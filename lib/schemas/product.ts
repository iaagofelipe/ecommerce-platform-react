import { z } from "zod"

export const productSchema = z.object({
    id: z.string().uuid(),
    sku: z.string(),
    name: z.string(),
    description: z.string(),
    priceCents: z.number(),
    imageUrl: z.string().url(),
    stockQty: z.number(),
    active: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
})

export const pageSchema = <T extends z.ZodTypeAny>(item: T) =>
    z.object({
        content: z.array(item),
        totalElements: z.number(),
        totalPages: z.number(),
        number: z.number(), // página atual (0-based)
        size: z.number(),
    })

export const productsPageSchema = pageSchema(productSchema)

export type ProductDto = z.infer<typeof productSchema>
export type ProductsPageDto = z.infer<typeof productsPageSchema>
