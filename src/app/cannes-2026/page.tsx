import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionContent } from "@/components/PageLayout";
import { Eyebrow } from "@/components/home/Eyebrow";
import { Reveal } from "@/components/home/Reveal";
import { RequestInvitationForm } from "@/components/cannes/RequestInvitationForm";
import { CannesSlider } from "@/components/cannes/CannesSlider";

const cannesImages = [
  "/cannes/0075ea8f-e6fc-47d8-b7ab-3b18e5bc2da7.avif",
  "/cannes/6ca07889-bbe3-4422-aa20-a8001f1518dc.avif",
  "/cannes/9dd57b6c-ceae-428a-9ddb-5d472e821ef4.avif",
];

const title = "Monitoring Summit Cannes 2026 | exit1.dev";
const description =
  "Join exit1 at the Monitoring Summit, Cannes 2026. Four days of ideas, real conversations, and the people building what comes next. Request your invitation.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "https://exit1.dev/cannes-2026",
  },
  openGraph: {
    title,
    description,
    type: "website",
    url: "https://exit1.dev/cannes-2026",
    siteName: "Exit1.dev",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

const schedule = [
  { date: "June 22", day: "Monday", hours: "11:00 AM – 4:00 PM" },
  { date: "June 23", day: "Tuesday", hours: "11:00 AM – 4:00 PM" },
  { date: "June 24", day: "Wednesday", hours: "11:00 AM – 5:00 PM" },
  { date: "June 25", day: "Thursday", hours: "10:00 AM – 5:00 PM" },
];

export default function CannesSummitPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero — full-bleed background */}
      <section className="relative isolate overflow-hidden">
          {/* Cannes skyline photo blended with the brand aurora wash */}
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <Image
              src="/cannes-lions-hero.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[center_35%] opacity-90"
            />
            {/* Fade only the lower edge into the page background so the photo stays
                vivid up top while the collage below still blends in */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/25 to-background" />
          </div>

          <SectionContent size="lg" className="px-4 py-36 text-center sm:py-52">
            <Reveal>
              <Eyebrow className="justify-center text-foreground">
                Join us at
              </Eyebrow>
            </Reveal>

            <Reveal delay={0.05}>
              <h1 className="mt-3 text-[2.75rem] font-bold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
                Monitoring Summit
                <br />
                <span className="text-foreground">Cannes 2026</span>
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground sm:text-xl">
                4 days of ideas, real conversations, and the people building
                what comes next.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-10">
                <RequestInvitationForm />
              </div>
            </Reveal>
          </SectionContent>
      </section>

      {/* Off-stage collage — headline + intro over a scattered bento of stats,
          a photo, and the homepage data-stream line. */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        {/* Heading row */}
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
            <h2 className="text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              Where the most important conversations in the industry happen off
              stage.
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-4 lg:col-start-9 lg:pt-2">
            <p className="text-base leading-relaxed text-muted-foreground">
              The Monitoring Summit brings together the people responsible for
              keeping the industry moving. Four days of closed sessions, private
              conversations, and the ideas that don&apos;t make it onto the main
              stage.
            </p>
          </Reveal>
        </div>

        {/* Interlocking bento — photo and the data-stream video are the two
            anchors at different sizes; the two stats stack between them.
            Row1: [  photo  ][ $5B+ ][ video ]
            Row2: [  photo  ][4 Days][ video ]  */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:mt-20 sm:gap-5 lg:h-[34rem] lg:grid-cols-5 lg:grid-rows-2">
          {/* Photo — large anchor, 3 cols × 2 rows. Crossfade slider through the Cannes shots. */}
          <Reveal className="col-span-2 lg:col-span-3 lg:col-start-1 lg:row-span-2 lg:row-start-1">
            <CannesSlider images={cannesImages} fill className="h-full min-h-[18rem]" />
          </Reveal>

          {/* $5B+ */}
          <Reveal delay={0.05} className="lg:col-start-4 lg:row-start-1">
            <div className="flex h-full flex-col justify-center rounded-2xl bg-muted/40 p-6">
              <div className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                $5B+
              </div>
              <div className="mt-2 text-sm uppercase tracking-wide text-muted-foreground">
                worth of assets monitored
              </div>
            </div>
          </Reveal>

          {/* 4 Days */}
          <Reveal delay={0.1} className="lg:col-start-4 lg:row-start-2">
            <div className="flex h-full flex-col justify-center rounded-2xl bg-muted/40 p-6">
              <div className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                4 Days
              </div>
              <div className="mt-2 text-sm uppercase tracking-wide text-muted-foreground">
                of curated programming
              </div>
            </div>
          </Reveal>

          {/* Data-stream line — tall video rail, 1×2. The homepage "always on"
              motif, linked to the live event status board. */}
          <Reveal delay={0.15} className="col-span-2 lg:col-span-1 lg:col-start-5 lg:row-span-2 lg:row-start-1">
            <Link
              href="/cannes-2026/status"
              className="group relative block aspect-video h-full overflow-hidden rounded-2xl bg-black/40 lg:aspect-auto"
            >
              <video
                className="h-full w-full rounded-2xl object-cover transition-transform duration-500 group-hover:scale-105"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/exit1-data-stream-line.jpg"
                aria-hidden="true"
              >
                <source src="/exit1-data-stream-line.webm" type="video/webm" />
                <source src="/exit1-data-stream-line.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-[#F5C842] p-4">
                <span className="flex items-center gap-1.5 text-sm font-medium text-black">
                  Live event status
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Details card */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionContent size="xl" className="py-16">
            <Reveal>
              <div className="rounded-3xl bg-[#6366F1] p-8 text-white sm:p-12">
                <span className="inline-flex items-center font-mono text-xs uppercase tracking-[0.2em] text-white/80">
                  Schedule
                </span>
                <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                  Four days in Cannes, France.
                </h2>
                <p className="mt-3 max-w-2xl text-white/80">
                  Your infrastructure stays up because exit1 never sleeps. For
                  four days in Cannes, the teams keeping it that way get a room
                  of their own.
                </p>

                <dl className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                  {schedule.map((slot) => (
                    <div key={slot.date}>
                      <dt className="text-xl font-bold tracking-tight text-white">
                        {slot.date}
                      </dt>
                      <dd className="mt-1 text-base text-white/80">
                        {slot.day}
                      </dd>
                      <dd className="mt-4 font-mono text-sm tracking-tight text-white/70">
                        {slot.hours}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </SectionContent>
      </section>

      {/* Closing CTA — request invite again */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionContent size="md" className="py-24 text-center sm:py-28">
            <Reveal>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Request your invitation.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                Seats are limited. Add your email and we&apos;ll send you the
                details.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-10">
                <RequestInvitationForm />
              </div>
            </Reveal>
          </SectionContent>
      </section>
    </div>
  );
}
