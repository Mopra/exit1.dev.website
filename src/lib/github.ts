/**
 * Live GitHub star count for the repo, fetched server-side with hourly
 * revalidation so the header can show real social proof without hammering the
 * unauthenticated GitHub API (60 req/hr/IP). Set GITHUB_TOKEN to lift that
 * limit; it's optional and never reaches the client.
 */

const REPO = process.env.GITHUB_REPO ?? 'Mopra/exit1.dev';
export const GITHUB_REPO_URL = `https://github.com/${REPO}`;

const REVALIDATE_SECONDS = 3600; // refresh the star count at most hourly
const USER_AGENT = 'exit1.dev-website (https://exit1.dev, 1.0)';

export async function getGithubStars(): Promise<number | null> {
  try {
    const headers: Record<string, string> = {
      'User-Agent': USER_AGENT,
      Accept: 'application/vnd.github+json',
    };
    const token = process.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      headers,
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;

    const data = await res.json();
    const count = data?.stargazers_count;
    return typeof count === 'number' ? count : null;
  } catch {
    return null;
  }
}

/** Compact star count: 1234 → "1.2k", 12500 → "12k". */
export function formatStarCount(n: number): string {
  if (n < 1000) return String(n);
  const k = n / 1000;
  return `${k.toFixed(k >= 10 ? 0 : 1).replace(/\.0$/, '')}k`;
}
