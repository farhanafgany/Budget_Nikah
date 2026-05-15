const DEFAULT_WHATSAPP_MESSAGE = 'Halo, saya ingin tanya lebih lanjut tentang BudgetNikah.'

export function getWhatsAppMessage(rawMessage?: string) {
  const message = rawMessage?.trim() || DEFAULT_WHATSAPP_MESSAGE
  return message.replace(/^NEXT_PUBLIC_WHATSAPP_MESSAGE\s*=\s*/i, '').trim()
}

export function getWhatsAppUrl(rawNumber?: string, rawMessage?: string) {
  const number = rawNumber?.replace(/\D/g, '') ?? ''
  if (!number) return ''

  return `https://wa.me/${number}?text=${encodeURIComponent(getWhatsAppMessage(rawMessage))}`
}
