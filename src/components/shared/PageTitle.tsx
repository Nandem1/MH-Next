"use client";

import { useEffect } from "react";
import Head from "next/head";

interface PageTitleProps {
  title: string;
  description?: string;
}

export function PageTitle({ title, description }: PageTitleProps) {
  const fullTitle = `${title} | Mercado House`;

  useEffect(() => {
    document.title = fullTitle;
  }, [fullTitle]);

  return (
    <Head>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
    </Head>
  );
} 