// src/lib/auth-client.ts

import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, organizationClient } from "better-auth/client/plugins";
import type { BetterAuthClientPlugin } from "better-auth";


export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
  sessionOptions: {
    refetchInterval: 0,
    refetchOnWindowFocus: false,
    refetchWhenOffline: false,
  },
  plugins: [
    organizationClient(),
    inferAdditionalFields({
      user: {
        firstName: { type: "string", required: false },
        lastName: { type: "string", required: false },
        phoneNumber: { type: "string", required: false },
      },
    }),
  ] satisfies BetterAuthClientPlugin[],
})


export const {
  signIn,
  signUp,
  signOut,
  useSession,
  requestPasswordReset,
  resetPassword,
  organization,
} = authClient