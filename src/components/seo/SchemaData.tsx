export default function SchemaData() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Mercadohouse",
    "alternateName": "Mercado House SPA",
    "image": "/assets/multihouse-logo-black.png",
    "description": "Tu supermercado de confianza en La Serena y Coquimbo con más de 15 años sirviendo a la comunidad. Productos frescos, calidad y el mejor servicio.",
    "url": "https://mercadohouse.cl",
    "telephone": "+56-51-2-234-5678",
    "priceRange": "$$",
    "servesCuisine": "Supermercado",
    "category": "Supermercado",
    "paymentAccepted": ["Cash", "Credit Card", "Debit Card"],
    "currenciesAccepted": "CLP",
    "address": [
      {
        "@type": "PostalAddress",
        "name": "SUPERMERCADO MULTIHOUSE",
        "streetAddress": "Narciso Herrera 2575",
        "addressLocality": "La Cantera",
        "addressRegion": "Coquimbo",
        "addressCountry": "CL",
        "postalCode": "1780000"
      },
      {
        "@type": "PostalAddress",
        "name": "SUPERMERCADO LAS COMPAÑÍAS", 
        "streetAddress": "Av Libertador 1476",
        "addressLocality": "Las Compañías",
        "addressRegion": "La Serena",
        "addressCountry": "CL",
        "postalCode": "1700000"
      },
      {
        "@type": "PostalAddress",
        "name": "MULTIMERCADO AZABACHE",
        "streetAddress": "Av Balmaceda 599",
        "addressLocality": "La Serena",
        "addressRegion": "La Serena",
        "addressCountry": "CL",
        "postalCode": "1700000"
      }
    ],
    "openingHours": [
      "Mo-Su 08:00-22:00",
      "Mo-Su 07:30-23:00", 
      "Mo-Su 08:30-21:30"
    ],
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -29.9533,
      "longitude": -71.3436
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "150"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "La Serena"
      },
      {
        "@type": "City", 
        "name": "Coquimbo"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Ofertas Mensuales",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Refreskids Ambrosoli 180ml",
            "description": "Caja de 24 unidades"
          },
          "price": "4200",
          "priceCurrency": "CLP",
          "availability": "https://schema.org/InStock"
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Product",
            "name": "Helados de invierno 10unid",
            "description": "Helados de invierno"
          },
          "price": "1790",
          "priceCurrency": "CLP",
          "availability": "https://schema.org/InStock"
        }
      ]
    }
  };



  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Mercado House SPA",
    "url": "https://mercadohouse.cl",
    "logo": "https://mercadohouse.cl/assets/multihouse-logo-black.png",
    "description": "Supermercado de confianza en La Serena y Coquimbo",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "La Serena",
      "addressRegion": "Coquimbo",
      "addressCountry": "CL"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+56-51-2-234-5678",
      "contactType": "customer service",
      "areaServed": "CL",
      "availableLanguage": "Spanish"
    },
    "sameAs": [
      "https://www.facebook.com/mercadohouse",
      "https://www.instagram.com/mercadohouse"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema)
        }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
    </>
  );
}
