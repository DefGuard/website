import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const defaultPattern = "**/*.{md,mdx}";

const contentPath = (value: string) => "./src/content/" + value;

const coreFeatures = defineCollection({
  loader: glob({ pattern: defaultPattern, base: contentPath("core-features") }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
  }),
});

const clientFeatures = defineCollection({
  loader: glob({ pattern: defaultPattern, base: contentPath("client-features") }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
  }),
});

const pricingSchema = z.object({
  name: z.string(),
  order: z.number(),
  price: z.number(),
  supported: z.boolean().optional().default(false),
  annualPrice: z.number().optional(),
  priceLink: z.string(),
  annualPriceLink: z.string().optional(),
  disabled: z.boolean().optional().default(false),
  linkTarget: z.string().optional(),
  buttonText: z.string().optional(),
});

const roadmapSchema = z.object({
  title: z.string(),
  version: z.number(),
});

export type Roadmap = z.infer<typeof roadmapSchema>;

const roadmapCollection = defineCollection({
  loader: glob({ pattern: defaultPattern, base: contentPath("roadmap") }),
  schema: roadmapSchema,
});

export type PricingSchema = z.infer<typeof pricingSchema>;

const pricingCollection = defineCollection({
  loader: glob({ pattern: defaultPattern, base: contentPath("pricing") }),
  schema: pricingSchema,
});

const openvpnFeaturesSchema = z.object({
  title: z.string(),
  order: z.number(),
});

const openvpnFeaturesCollection = defineCollection({
  schema: openvpnFeaturesSchema,
  loader: glob({ pattern: defaultPattern, base: contentPath("openvpn-features") }),
});

const faqSchema = z.object({
  title: z.string(),
  order: z.number(),
});

const faqCollection = defineCollection({
  loader: glob({ pattern: defaultPattern, base: contentPath("faq") }),
  schema: faqSchema,
});

export const collections = {
  "client-features": clientFeatures,
  "core-features": coreFeatures,
  "openvpn-features": openvpnFeaturesCollection,
  faq: faqCollection,
  pricing: pricingCollection,
  roadmap: roadmapCollection,
};
