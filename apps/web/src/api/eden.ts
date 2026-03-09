import { clientEnv } from "@modflix/env/client"
import { treaty } from '@elysiajs/eden'

import type { App } from "@modflix/api-types"

export const api = treaty<App>(clientEnv.VITE_API_URL)
