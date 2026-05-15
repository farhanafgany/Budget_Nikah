import { createHash } from 'crypto'

export function isMidtransProduction() {
  return process.env.MIDTRANS_IS_PRODUCTION === 'true'
}

export function getMidtransServerKey() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY
  if (!serverKey) {
    throw new Error('MIDTRANS_SERVER_KEY is required.')
  }
  return serverKey
}

export function getMidtransSnapBaseUrl() {
  // Switch MIDTRANS_IS_PRODUCTION=true only after replacing sandbox keys
  // with production keys from the Midtrans production dashboard.
  return isMidtransProduction()
    ? 'https://app.midtrans.com/snap/v1'
    : 'https://app.sandbox.midtrans.com/snap/v1'
}

export function getMidtransApiBaseUrl() {
  // Status API follows the same sandbox/production mode as Snap.
  return isMidtransProduction()
    ? 'https://api.midtrans.com/v2'
    : 'https://api.sandbox.midtrans.com/v2'
}

export function getMidtransBasicAuthHeader() {
  return `Basic ${Buffer.from(`${getMidtransServerKey()}:`).toString('base64')}`
}

export function verifyMidtransSignature({
  orderId,
  statusCode,
  grossAmount,
  signatureKey,
}: {
  orderId: string
  statusCode: string
  grossAmount: string
  signatureKey: string
}) {
  const expected = createHash('sha512')
    .update(`${orderId}${statusCode}${grossAmount}${getMidtransServerKey()}`)
    .digest('hex')

  return expected === signatureKey
}
