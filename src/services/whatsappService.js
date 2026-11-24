export const RECIPIENT_NUMBER = '918072935820';

export const APOLOGY_MESSAGES = {
  accept: 'Jeje, I accepted your apology 😁',
  decline: "Jeje, I won't accept your apology 🤐",
};

export function getWhatsAppFallbackUrl(action) {
  const text = APOLOGY_MESSAGES[action];
  if (!text) return null;
  return `https://wa.me/${RECIPIENT_NUMBER}?text=${encodeURIComponent(text)}`;
}

export async function sendApologyResponse(action, idempotencyKey) {
  const messageText = APOLOGY_MESSAGES[action];
  if (!messageText) {
    throw new Error('Invalid apology action');
  }

  const fallbackUrl = getWhatsAppFallbackUrl(action);

  try {
    const response = await fetch('/api/whatsapp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, idempotencyKey }),
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.success) {
      return {
        status: 'sent',
        messageId: data.messageId,
        messageText,
      };
    }

    if (response.status === 409 && data.duplicate) {
      return {
        status: 'duplicate',
        messageText,
        fallbackUrl,
      };
    }

    return {
      status: 'fallback',
      fallbackUrl,
      messageText,
      reason: data.error || 'Automatic delivery is unavailable; opening WhatsApp chat.',
    };
  } catch {
    return {
      status: 'fallback',
      fallbackUrl,
      messageText,
      reason: 'Backend service unreachable; using direct WhatsApp link.',
    };
  }
}

