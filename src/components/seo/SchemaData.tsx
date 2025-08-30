export default function SchemaData() {
  // Schema para Supermercado Multihouse La Cantera
  const laCanteraSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Supermercado Multihouse La Cantera",
    "alternateName": "Mercado House La Cantera",
    "image": "/assets/multihouse-logo-black.png",
    "description": "Supermercado de confianza en La Cantera, Coquimbo. Productos frescos, calidad y el mejor servicio con más de 15 años de experiencia.",
    "url": "https://mercadohouse.cl",
    "telephone": "+56982219972",
    "priceRange": "$",
    "servesCuisine": "Supermercado",
    "category": "Supermercado",
    "paymentAccepted": ["Cash", "Credit Card", "Debit Card"],
    "currenciesAccepted": "CLP",
    "address": {
      "@type": "PostalAddress",
      "name": "SUPERMERCADO MULTIHOUSE LA CANTERA",
      "streetAddress": "Narciso Herrera 2575",
      "addressLocality": "La Cantera",
      "addressRegion": "Coquimbo",
      "addressCountry": "CL",
      "postalCode": "1780000"
    },
    "openingHours": "Mo-Su 08:00-22:00",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -29.9533,
      "longitude": -71.3436
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "80",
      "bestRating": "5",
      "worstRating": "2"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+56982219972",
      "contactType": "customer service",
      "areaServed": "CL",
      "availableLanguage": "Spanish"
    },
    "areaServed": [
      { "@type": "City", "name": "La Cantera" },
      { "@type": "City", "name": "Coquimbo" }
    ]
  };

  // Schema para Supermercado Las Compañías
  const lasCompaniasSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Supermercado Las Compañías",
    "alternateName": "Mercado House Las Compañías",
    "image": "/assets/multihouse-logo-black.png",
    "description": "Supermercado de confianza en Las Compañías, La Serena. Productos frescos, calidad y el mejor servicio con más de 15 años de experiencia.",
    "url": "https://mercadohouse.cl",
    "telephone": "+56-51-2-234-5678",
    "priceRange": "$",
    "servesCuisine": "Supermercado",
    "category": "Supermercado",
    "paymentAccepted": ["Cash", "Credit Card", "Debit Card"],
    "currenciesAccepted": "CLP",
    "address": {
      "@type": "PostalAddress",
      "name": "SUPERMERCADO LAS COMPAÑÍAS",
      "streetAddress": "Av Libertador 1476",
      "addressLocality": "Las Compañías",
      "addressRegion": "La Serena",
      "addressCountry": "CL",
      "postalCode": "1700000"
    },
    "openingHours": "Mo-Su 07:30-23:00",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -29.9033,
      "longitude": -71.2536
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "3.7",
      "reviewCount": "3",
      "bestRating": "5",
      "worstRating": "1"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+56-51-2-234-5678",
      "contactType": "customer service",
      "areaServed": "CL",
      "availableLanguage": "Spanish"
    },
    "areaServed": [
      { "@type": "City", "name": "Las Compañías" },
      { "@type": "City", "name": "La Serena" }
    ]
  };

  // Schema para Multimercado Azabache
  const azabacheSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Multimercado Azabache",
    "alternateName": "Mercado House Azabache",
    "image": "/assets/multihouse-logo-black.png",
    "description": "Multimercado de confianza en La Serena. Productos frescos, calidad y el mejor servicio con más de 15 años de experiencia.",
    "url": "https://mercadohouse.cl",
    "telephone": "+56-51-2-234-5678",
    "priceRange": "$",
    "servesCuisine": "Supermercado",
    "category": "Supermercado",
    "paymentAccepted": ["Cash", "Credit Card", "Debit Card"],
    "currenciesAccepted": "CLP",
    "address": {
      "@type": "PostalAddress",
      "name": "MULTIMERCADO AZABACHE",
      "streetAddress": "Av Balmaceda 599",
      "addressLocality": "La Serena",
      "addressRegion": "La Serena",
      "addressCountry": "CL",
      "postalCode": "1700000"
    },
    "openingHours": "Mo-Su 08:30-21:30",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -29.9033,
      "longitude": -71.2536
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "reviewCount": "39",
      "bestRating": "5",
      "worstRating": "2"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+56-51-2-234-5678",
      "contactType": "customer service",
      "areaServed": "CL",
      "availableLanguage": "Spanish"
    },
    "areaServed": [
      { "@type": "City", "name": "La Serena" }
    ]
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Mercado House SPA",
    "url": "https://mercadohouse.cl",
    "logo": "https://mercadohouse.cl/assets/multihouse-logo-black.png",
    "description": "Supermercado de confianza en La Serena y Coquimbo con más de 15 años sirviendo a la comunidad. Productos frescos, calidad y el mejor servicio.",
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
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Ofertas Destacadas Mercadohouse",
    "description": "Productos en oferta en nuestros supermercados de La Serena y Coquimbo",
    "numberOfItems": 8,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "Product",
          "name": "Refreskids Ambrosoli 180ml",
          "description": "Caja de 24 unidades",
          "offers": {
            "@type": "Offer",
            "price": "4200",
            "priceCurrency": "CLP",
            "availability": "https://schema.org/InStock"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "Product",
          "name": "Helados de invierno 10unid",
          "description": "Helados de invierno",
          "offers": {
            "@type": "Offer",
            "price": "1790",
            "priceCurrency": "CLP",
            "availability": "https://schema.org/InStock"
          }
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(laCanteraSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(lasCompaniasSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(azabacheSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema)
        }}
      />
    </>
  );
}
