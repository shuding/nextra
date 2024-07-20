import { NextraLogo } from '@components/icons'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

const font = fetch(new URL('./Inter-SemiBold.otf', import.meta.url)).then(res =>
  res.arrayBuffer()
)

export async function GET(req: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url)

    // ?title=<title>
    const title =
      searchParams.get('title')?.slice(0, 100) || 'Nextra Documentation'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: 80,
            backgroundColor: '#030303',
            backgroundImage:
              'radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            backgroundPosition: '-30px -10px',
            fontWeight: 600,
            color: 'white'
          }}
        >
          <NextraLogo
            style={{ position: 'absolute', top: 70, left: 80 }}
            height="40"
          />
          <p
            style={{
              position: 'absolute',
              bottom: 70,
              left: 80,
              margin: 0,
              fontSize: 30,
              letterSpacing: -1
            }}
          >
            Create beautiful websites with Next.js & MDX.
          </p>
          <h1
            style={{
              fontSize: 82,
              margin: '0 0 40px -2px',
              lineHeight: 1.1,
              textShadow: '0 2px 30px #000',
              letterSpacing: -4,
              backgroundImage: 'linear-gradient(90deg, #fff 40%, #aaa)',
              backgroundClip: 'text',
              color: 'transparent'
            }}
          >
            {title}
          </h1>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'inter',
            data: await font,
            style: 'normal'
          }
        ]
      }
    )
  } catch (error) {
    console.error(error)
    return new Response('Failed to generate the image', { status: 500 })
  }
}
