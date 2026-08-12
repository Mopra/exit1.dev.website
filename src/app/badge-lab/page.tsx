import type { Metadata } from 'next';
import { OnlineBadge } from '@/components/OnlineBadge';
import { LaserBeam } from '@/components/LaserBeam';

// Internal component sandbox for tuning the badge + laser composition. It has
// no business being in search results, and until this was added it shipped
// with the root layout's title — a third page competing on the homepage's own
// title tag. Also excluded from sitemap.ts.
export const metadata: Metadata = {
  title: 'Badge Lab (internal)',
  robots: { index: false, follow: false },
};

export default function BadgeLabPage() {
  return (
    <div
      style={{ background: '#0A0A0F' }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
    >
      <div className="relative" style={{ perspective: '800px' }}>
        {/* Laser sits below the badge, pointing downward.
            Negative wisp/flow speeds reverse the animation so the streaks
            appear to emanate FROM the badge instead of flowing into it. */}
        <LaserBeam
          direction="down"
          wispSpeed={-15}
          flowSpeed={-0.35}
          fogFallSpeed={-0.6}
          horizontalSizing={4.3}
          verticalSizing={10.0}
          decay={0.2}
          falloffStart={4.0}
          wispDensity={10}
          wispIntensity={10}
          className="absolute left-1/2 top-19/28 -translate-x-1/2 w-[140%] h-[600px]"
        />

        {/* Badge on top via relative + z-10. */}
        <OnlineBadge
          className="relative z-10 text-7xl"
          style={{ transform: 'rotateX(22deg)', transformOrigin: 'center bottom' }}
        />
      </div>
    </div>
  );
}
