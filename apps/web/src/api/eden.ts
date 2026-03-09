import { treaty
} from '@elysiajs/eden'

import type { App } from "@modflix/api-types"

export const api = treaty<App>(import.meta.env.API_URL)
