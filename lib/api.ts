import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
})

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
        return config
    },
    (error) => {
        console.error("[API] Request error:", error)
        return Promise.reject(error)
    },
)

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        // console.log(`[API] ${response.status} ${response.config.url}`)
        return response
    },
    (error) => {
        console.error("[API] Response error:", error.response?.status, error.response?.data)

        // Handle common error cases
        if (error.response?.status === 404) {
            throw new Error("Recurso não encontrado")
        } else if (error.response?.status === 500) {
            throw new Error("Erro interno do servidor")
        } else if (error.code === "ECONNABORTED") {
            throw new Error("Timeout na requisição")
        }

        throw error
    },
)

export default apiClient
