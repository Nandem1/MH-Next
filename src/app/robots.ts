import { MetadataRoute } from 'next'
import { ENV } from '@/config/env';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = ENV.SITE_URL || 'https://mercadohouse.cl'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
