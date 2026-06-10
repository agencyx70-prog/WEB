import { ImageResponse } from 'next/og';

export const alt = 'TheSevenZ — Content, Video, Social & Web';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0a0908',
          color: '#f4f2ef',
          padding: '76px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, letterSpacing: 6, color: '#8d8884', textTransform: 'uppercase' }}>
          Creative Studio · Telangana, India
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 150, fontWeight: 800, letterSpacing: -5 }}>
            <span style={{ display: 'flex' }}>TheSeven</span>
            <span style={{ display: 'flex', color: '#ff2b2b' }}>Z</span>
          </div>
          <div style={{ display: 'flex', fontSize: 38, color: '#8d8884', marginTop: 18 }}>
            Content · Video · Social · Brand Deals · Web
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', fontSize: 28, color: '#5a5651' }}>agencyx70@gmail.com</div>
          <div style={{ display: 'flex', width: 64, height: 64, borderRadius: 16, background: '#ff2b2b', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 800, color: '#fff' }}>
            Z
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
