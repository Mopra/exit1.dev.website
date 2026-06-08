/**
 * Live community proof for the homepage. Pulls the real exit1.dev Discord
 * roster server-side (the bot token never reaches the client) so the section
 * shows genuine member avatars and an accurate count — never inflated.
 *
 * Requires DISCORD_BOT_TOKEN in the environment. The bot must be a member of
 * the guild and have the SERVER MEMBERS INTENT enabled in the Developer Portal
 * (Discord requires it to list members over REST). Without a token we fall back
 * to the public invite endpoint, which gives the member count only — no avatars.
 */

const GUILD_ID = process.env.DISCORD_GUILD_ID ?? '1396397621937176596';
const INVITE_CODE = process.env.DISCORD_INVITE_CODE ?? 'uZvWbpwJZS';
export const DISCORD_INVITE_URL = `https://discord.gg/${INVITE_CODE}`;

const API = 'https://discord.com/api/v10';
const REVALIDATE_SECONDS = 3600; // refresh the roster at most hourly
const USER_AGENT = 'exit1.dev-website (https://exit1.dev, 1.0)';

export type DiscordMember = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type DiscordCommunity = {
  /** Total human members (bots excluded). */
  memberCount: number;
  /** Member avatars, real custom avatars first. May be empty (count-only fallback). */
  members: DiscordMember[];
};

type RawMember = {
  user?: {
    id: string;
    username: string;
    global_name?: string | null;
    avatar?: string | null;
    bot?: boolean;
  };
};

function toAvatarUrl(id: string, avatar: string | null | undefined): string {
  if (avatar) {
    return `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=80`;
  }
  // Default avatar bucket for the new (pomelo) username system. BigInt because
  // snowflake IDs exceed Number.MAX_SAFE_INTEGER.
  const index = Number((BigInt(id) >> BigInt(22)) % BigInt(6));
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
}

async function fetchInviteCount(): Promise<number | null> {
  try {
    const res = await fetch(`${API}/invites/${INVITE_CODE}?with_counts=true`, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const count = data?.approximate_member_count;
    return typeof count === 'number' ? count : null;
  } catch {
    return null;
  }
}

export async function getDiscordCommunity(): Promise<DiscordCommunity | null> {
  const token = process.env.DISCORD_BOT_TOKEN;

  // No token (local dev / preview): degrade to the public count, no avatars.
  if (!token) {
    const memberCount = await fetchInviteCount();
    return memberCount == null ? null : { memberCount, members: [] };
  }

  try {
    const res = await fetch(`${API}/guilds/${GUILD_ID}/members?limit=1000`, {
      headers: {
        Authorization: `Bot ${token}`,
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
      },
      next: { revalidate: REVALIDATE_SECONDS },
    });

    // Token present but the call failed (missing intent, bot not in guild,
    // rate limit). Degrade to the public count rather than breaking the page.
    if (!res.ok) {
      const memberCount = await fetchInviteCount();
      return memberCount == null ? null : { memberCount, members: [] };
    }

    const raw = (await res.json()) as RawMember[];
    const humans = raw.filter((m) => m.user && !m.user.bot);

    const members: DiscordMember[] = humans
      .map((m) => {
        const u = m.user!;
        return {
          id: u.id,
          name: u.global_name || u.username,
          avatarUrl: toAvatarUrl(u.id, u.avatar),
          hasCustom: Boolean(u.avatar),
        };
      })
      // Lead with real custom avatars instead of the gray default circles.
      .sort((a, b) => Number(b.hasCustom) - Number(a.hasCustom))
      .map(({ id, name, avatarUrl }) => ({ id, name, avatarUrl }));

    return { memberCount: humans.length, members };
  } catch {
    const memberCount = await fetchInviteCount();
    return memberCount == null ? null : { memberCount, members: [] };
  }
}
