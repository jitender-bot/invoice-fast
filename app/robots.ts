import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://invoicefast.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/history",
        "/sign-in",
        "/sign-up",
        "/reset-password",
        "/templates/", // Phase 2 scaffold urls if indexable is restricted initially
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
