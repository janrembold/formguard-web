import { SITE_URL } from "./constants";
import { plans, priceWithAi } from "./plans";
import type { Lang } from "../i18n/utils";

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Submit API",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    description:
      "Secure interface between web forms and email delivery, with spam, virus and injection protection.",
  };
}

export function softwareApplicationLd(lang: Lang) {
  const desc =
    lang === "de"
      ? "Submit API prüft jede Formular-Einsendung auf Spam, Viren und Angriffe und leitet nur saubere Daten per E-Mail weiter."
      : "Submit API checks every form submission for spam, viruses and attacks and forwards only clean data by email.";
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Submit API",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    description: desc,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: "9",
      highPrice: "199",
      offerCount: String(plans.filter((p) => p.priceMonthly !== null).length),
    },
  };
}

export function faqPageLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function productOffersLd(lang: Lang) {
  const name =
    lang === "de" ? "Submit API Abonnement" : "Submit API subscription";
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    brand: { "@type": "Brand", name: "Submit API" },
    description:
      lang === "de"
        ? "Nutzungsbasierte Preise für sichere Formular-Zustellung. Alle Features in jedem Plan."
        : "Usage-based pricing for secure form delivery. Every feature in every plan.",
    offers: plans
      .filter((p) => p.priceMonthly !== null)
      .map((p) => ({
        "@type": "Offer",
        name: p.name,
        price: String(priceWithAi(p.priceMonthly as number, false)),
        priceCurrency: "EUR",
        url: `${SITE_URL}/${lang === "de" ? "" : "en/"}pricing`,
        availability: "https://schema.org/InStock",
      })),
  };
}
