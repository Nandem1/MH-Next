"use client";

import LandingHeader from "@/components/landing/LandingHeader";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import ProductsSection from "@/components/landing/ProductsSection";
import CareersSection from "@/components/landing/CareersSection";
import LandingFooter from "@/components/landing/LandingFooter";
import { Box } from "@mui/material";

export default function LandingPageClient() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <LandingHeader />
      <main>
        <HeroSection />
        <AboutSection />
        <ProductsSection />
        <CareersSection />
      </main>
      <LandingFooter />
    </Box>
  );
}
