import { z } from "zod";

export const productSchema = z.object({
    id: z.string().uuid(),
    sku: z.string(),
    name: z.string(),
    description: z.string(),
    priceCents: z.number(),
    imageUrl: z.string().url(),
    stockQty: z.number(),
    active: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

const pageInfoSchema = z.object({
    size: z.number(),
    number: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
});

export const productsPageSchema = z.object({
    content: z.array(productSchema),
    page: pageInfoSchema,
});

export type ProductsPageDto = z.infer<typeof productsPageSchema>;