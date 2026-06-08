import { getDiscordCommunity, DISCORD_INVITE_URL } from '@/lib/discord';
import { CommunityProofView } from './CommunityProofView';

/** Avatars rendered into the stack; the remainder rolls up into a "+N" chip. */
const MAX_AVATARS = 12;

/**
 * Social-proof beat: a stacked row of real exit1.dev Discord members with an
 * honest member count and a join CTA. Data is fetched server-side and
 * revalidated hourly; the view degrades gracefully when the roster (or count)
 * isn't available.
 */
export async function CommunityProof() {
  const community = await getDiscordCommunity();

  return (
    <CommunityProofView
      inviteUrl={DISCORD_INVITE_URL}
      memberCount={community?.memberCount ?? null}
      avatars={community?.members.slice(0, MAX_AVATARS) ?? []}
    />
  );
}
