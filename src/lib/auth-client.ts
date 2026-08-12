// src/lib/auth-client.ts

import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, organizationClient, twoFactorClient } from "better-auth/client/plugins";
import type { BetterAuthClientPlugin } from "better-auth";


// Global callback for 2FA redirect during login
let _twoFactorRedirectCallback: ((methods: string[]) => void) | null = null

// Utiliser sessionStorage pour persister l'état 2FA et le rendre observable
const TWO_FA_KEY = '_2fa_in_progress'

export function setTwoFactorRedirectCallback(cb: ((methods: string[]) => void) | null) {
  _twoFactorRedirectCallback = cb
}

export function is2FAInProgress() {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem(TWO_FA_KEY) === 'true'
}

export function set2FAInProgress(value: boolean) {
  if (typeof window === 'undefined') return
  if (value) {
    sessionStorage.setItem(TWO_FA_KEY, 'true')
  } else {
    sessionStorage.removeItem(TWO_FA_KEY)
  }
  // Déclencher un événement personnalisé pour notifier les composants
  window.dispatchEvent(new CustomEvent('2fa-status-changed', { detail: { inProgress: value } }))
}

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
  sessionOptions: {
    refetchInterval: 0,
    refetchOnWindowFocus: false,
    refetchWhenOffline: false,
  },
  plugins: [
    twoFactorClient({
      onTwoFactorRedirect({ twoFactorMethods }) {
        console.log('[authClient] 2FA redirect triggered:', twoFactorMethods)
        set2FAInProgress(true)
        if (_twoFactorRedirectCallback) {
          _twoFactorRedirectCallback(twoFactorMethods || ['totp'])
        }
      },
    }),
    organizationClient(),
    inferAdditionalFields({
      user: {
        firstName: { type: "string", required: false },
        lastName: { type: "string", required: false },
        phoneNumber: { type: "string", required: false },
        timezone: { type: "string", required: false },
        language: { type: "string", required: false },
        isSuperAdmin: { type: "boolean", required: false },
        twoFactorEnabled: { type: "boolean", required: false },
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
  updateUser,
  twoFactor,
} = authClient