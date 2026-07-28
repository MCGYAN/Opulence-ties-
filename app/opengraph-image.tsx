import { ImageResponse } from 'next/og';
import { SITE_NAME, SITE_HERO_TAGLINE, SITE_LOCATION_TAGLINE } from '@/lib/site-brand';

export const runtime = 'edge';
export const alt = `${SITE_NAME} - ${SITE_HERO_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Dynamic OG image, customize colors/text in lib/site-brand.ts */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(140deg, #f1f5f9 0%, #e2e8f0 55%, #f8fafc 100%)',
          color: '#0f172a',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: '-0.02em' }}>{SITE_NAME}</div>
        <div style={{ fontSize: 32, marginTop: 16, color: '#475569' }}>{SITE_HERO_TAGLINE}</div>
        <div style={{ fontSize: 24, marginTop: 12, color: '#64748b' }}>{SITE_LOCATION_TAGLINE}</div>
      </div>
    ),
    { ...size }
  );
}
