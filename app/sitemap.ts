import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://invoicefast.com";

  // All SEO-critical paths specified in sitemap from PRD.md §6
  const routes = [
    "",
    "help",
    "terms",
    "privacy",
    "guides",
    // Standalone guides
    "guides/invoice-to-cash",
    "guides/how-to-get-paid-faster",
    "guides/how-to-reduce-late-payments",
    "guides/invoice-payment-terms",
    // 5-part invoicing course
    "guides/invoicing-guide/introduction",
    "guides/invoicing-guide/how-to-make-invoices",
    "guides/invoicing-guide/getting-paid",
    "guides/invoicing-guide/client-billing",
    "guides/invoicing-guide/running-your-business",
  ];

  const currentDate = new Date();

  return routes.map((route) => {
    let priority = 0.5;
    let changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" = "monthly";

    if (route === "") {
      priority = 1.0;
      changeFrequency = "daily";
    } else if (route.startsWith("guides")) {
      priority = 0.8;
      changeFrequency = "weekly";
    }

    return {
      url: `${baseUrl}/${route}`.replace(/\/$/, ""), // Ensure no trailing slash
      lastModified: currentDate,
      changeFrequency,
      priority,
    };
  });
}
