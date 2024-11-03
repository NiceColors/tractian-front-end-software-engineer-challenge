import { env } from "../env"

export function api(path: string, init?: RequestInit) {
    const baseUrl = env.client.VITE_API_URL
    const apiPrefix = ''
    const url = new URL(apiPrefix.concat(path), baseUrl)
    return fetch(url, init)
}
