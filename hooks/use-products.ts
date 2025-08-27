"use client"

import { useQuery } from "@tanstack/react-query"
import apiClient from "@/lib/api"
import { productsPageSchema, type ProductsPageDto } from "@/lib/schemas/product"

type Params = {
    q?: string
    active?: boolean
    page?: number
    size?: number
}

export function useProducts(params: Params = {}) {
    const { q, active = true, page = 0, size = 12 } = params

    return useQuery({
        queryKey: ["products", { q, active, page, size }],
        queryFn: async (): Promise<ProductsPageDto> => {
            const res = await apiClient.get("/products", { params: { q, active, page, size } })
            return productsPageSchema.parse(res.data)
        },
        keepPreviousData: true,
        staleTime: 30_000,
    })
}
