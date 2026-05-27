export function shouldSyncOnboardingAfterAuth(nextPath: string): boolean {
  return nextPath === '/premium'
}

export function getPostSyncPath(nextPath: string, isPremium: boolean): string {
  return isPremium ? '/dashboard' : nextPath
}

export const EXISTING_PROFILE_CONFIRMATION_REQUIRED = 'existing_profile_confirmation_required'

export function isProfileReplacementRequired(status: number, data: unknown): boolean {
  if (status !== 409 || typeof data !== 'object' || data === null || !('code' in data)) {
    return false
  }

  return data.code === EXISTING_PROFILE_CONFIRMATION_REQUIRED
}
