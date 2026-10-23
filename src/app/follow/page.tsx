import { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { PageContainer, PageShell } from "@/components/PageLayout";
import { FollowAction } from "@/components/status/FollowAction";

// Where the confirm and unsubscribe links in follow emails land. The token
// rides in the query string; FollowAction only uses it once the button is
// pressed, so a link scanner opening the URL changes nothing.
export const metadata: Metadata = {
  title: "Follow status",
  description: "Confirm or stop email alerts for a service monitored by exit1.dev.",
  robots: { index: false, follow: false },
};

const TOKEN_PATTERN = /^[a-f0-9]{64}$/;

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

export default async function FollowPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const action = first(params.action) === "unsubscribe" ? "unsubscribe" : "confirm";
  const rawToken = first(params.token);
  const token = TOKEN_PATTERN.test(rawToken) ? rawToken : null;

  return (
    <PageShell>
      <main>
        <PageContainer>
          <PageHero size="md">
            <FollowAction action={action} token={token} />
          </PageHero>
        </PageContainer>
      </main>
    </PageShell>
  );
}
