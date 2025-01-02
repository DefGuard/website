import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const coreFeatures = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/core-features" }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
  }),
});

const clientFeatures = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/client-features" }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
  }),
});

const pricingSchema = z.object({
  name: z.string(),
  order: z.number(),
  price: z.number(),
  annualPrice: z.number().optional(),
  priceLink: z.string(),
  annualPriceLink: z.string().optional(),
  discount: z.number().optional(),
  disabled: z.boolean().optional().default(false),
  linkTarget: z.string().optional(),
  buttonText: z.string().optional(),
});

const roadmapSchema = z.object({
  title: z.string(),
  version: z.number(),
});

export type Roadmap = z.infer<typeof roadmapSchema>;

const roadmap = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/roadmap" }),
  schema: roadmapSchema,
});

export type PricingSchema = z.infer<typeof pricingSchema>;

const pricing = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pricing" }),
  schema: pricingSchema,
});

const openvpnFeaturesSchema = z.object({
  title: z.string(),
  order: z.number(),
});

const openvpnFeaturesCollection = defineCollection({
  schema: openvpnFeaturesSchema,
  loader: glob({ pattern: "**/*.md", base: "./src/content/openvpn-features" }),
});

const faqSchema = z.object({
  title: z.string(),
  order: z.number(),
});

const faqCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/faq" }),
  schema: faqSchema,
});

export const collections = {
  "client-features": clientFeatures,
  "core-features": coreFeatures,
  "openvpn-features": openvpnFeaturesCollection,
  faq: faqCollection,
  pricing: pricing,
  roadmap,
};
