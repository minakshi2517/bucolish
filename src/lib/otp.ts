// Global in-memory OTP store for active verification sessions
export const otpStore = new Map<string, { code: string; expiresAt: number }>();
