import {
  EXISTING_PROFILE_CONFIRMATION_REQUIRED,
  getPostSyncPath,
  isProfileReplacementRequired,
  shouldSyncOnboardingAfterAuth,
} from '@/lib/authFlow'

describe('shouldSyncOnboardingAfterAuth', () => {
  it('allows automatic sync when authentication continues the premium purchase flow', () => {
    expect(shouldSyncOnboardingAfterAuth('/premium')).toBe(true)
  })

  it('does not overwrite an existing dashboard profile during ordinary login', () => {
    expect(shouldSyncOnboardingAfterAuth('/dashboard')).toBe(false)
    expect(shouldSyncOnboardingAfterAuth('/')).toBe(false)
  })

  it('recognizes only the explicit profile replacement conflict response', () => {
    expect(isProfileReplacementRequired(409, { code: EXISTING_PROFILE_CONFIRMATION_REQUIRED })).toBe(true)
    expect(isProfileReplacementRequired(500, { code: EXISTING_PROFILE_CONFIRMATION_REQUIRED })).toBe(false)
    expect(isProfileReplacementRequired(409, { code: 'another_conflict' })).toBe(false)
  })

  it('sends an existing premium account directly to its dashboard after sync', () => {
    expect(getPostSyncPath('/premium', true)).toBe('/dashboard')
    expect(getPostSyncPath('/premium', false)).toBe('/premium')
  })
})
