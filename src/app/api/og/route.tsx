import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
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
          backgroundColor: '#ffffff',
          padding: '40px',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#1976d2',
              textAlign: 'center',
            }}
          >
            MERCADOHOUSE
          </div>
        </div>

        {/* Main Text */}
        <div
          style={{
            fontSize: '32px',
            fontWeight: '600',
            color: '#333333',
            textAlign: 'center',
            marginBottom: '20px',
            maxWidth: '800px',
          }}
        >
          Tu supermercado de confianza en La Serena/Coquimbo
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '20px',
            color: '#666666',
            textAlign: 'center',
            marginBottom: '40px',
            maxWidth: '600px',
          }}
        >
          Productos frescos, calidad y el mejor servicio en nuestros 3 locales
        </div>

        {/* Locations */}
        <div
          style={{
            display: 'flex',
            gap: '40px',
            fontSize: '16px',
            color: '#1976d2',
            fontWeight: '500',
          }}
        >
          <span>La Cantera</span>
          <span>Las Compañías</span>
          <span>Balmaceda</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
