import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

const ALLOWED_ACTIONS = {
  accept: 'Jeje, I accepted your apology 😁',
  decline: "Jeje, I won't accept your apology 🤐",
};

// In-memory idempotency store to prevent duplicate submissions
const recentSubmissions = new Map();
const SUBMISSION_TTL_MS = 10 * 60 * 1000;

function cleanupSubmissions() {
  const now = Date.now();
  for (const [key, timestamp] of recentSubmissions.entries()) {
    if (now - timestamp > SUBMISSION_TTL_MS) {
      recentSubmissions.delete(key);
    }
  }
}

function isCloudApiConfigured() {
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  const token = process.env.WHATSAPP_ACCESS_TOKEN?.trim();
  if (!phoneId || !token) return false;
  if (phoneId.includes('your_phone_number_id') || token.includes('your_permanent')) {
    return false;
  }
  return true;
}

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
  })
);
app.use(express.json({ limit: '16kb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    cloudApiConfigured: isCloudApiConfigured(),
  });
});

app.post('/api/whatsapp/send', async (req, res) => {
  cleanupSubmissions();

  const { action, idempotencyKey } = req.body || {};

  if (!action || !Object.prototype.hasOwnProperty.call(ALLOWED_ACTIONS, action)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid action. Expected "accept" or "decline".',
    });
  }

  const dedupKey = idempotencyKey ? `${idempotencyKey}:${action}` : null;
  if (dedupKey && recentSubmissions.has(dedupKey)) {
    return res.status(409).json({
      success: false,
      duplicate: true,
      error: 'This response has already been submitted.',
    });
  }

  if (!isCloudApiConfigured()) {
    return res.status(503).json({
      success: false,
      configured: false,
      fallbackRequired: true,
      error: 'WhatsApp Business Cloud API credentials are not configured.',
    });
  }

  const apiVersion = process.env.WHATSAPP_API_VERSION?.trim() || 'v21.0';
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID.trim();
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN.trim();
  const recipient = (process.env.WHATSAPP_RECIPIENT_NUMBER?.trim() || '918072935820').replace(/^\+/, '');
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME?.trim();
  const templateLang = process.env.WHATSAPP_TEMPLATE_LANG?.trim() || 'en';
  const messageText = ALLOWED_ACTIONS[action];

  const payload = templateName
    ? {
        messaging_product: 'whatsapp',
        to: recipient,
        type: 'template',
        template: {
          name: templateName,
          language: { code: templateLang },
          components: [
            {
              type: 'body',
              parameters: [{ type: 'text', text: messageText }],
            },
          ],
        },
      }
    : {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipient,
        type: 'text',
        text: {
          preview_url: false,
          body: messageText,
        },
      };

  try {
    const endpoint = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data?.messages?.[0]?.id) {
      return res.status(response.status || 502).json({
        success: false,
        configured: true,
        fallbackRequired: true,
        error: data?.error?.message || 'WhatsApp Cloud API did not accept the message.',
      });
    }

    if (dedupKey) {
      recentSubmissions.set(dedupKey, Date.now());
    }

    return res.status(200).json({
      success: true,
      messageId: data.messages[0].id,
      recipient,
    });
  } catch (err) {
    return res.status(502).json({
      success: false,
      configured: true,
      fallbackRequired: true,
      error: 'Unable to reach WhatsApp Cloud API.',
    });
  }
});

app.listen(PORT, () => {
  console.log(`WhatsApp API server listening on http://localhost:${PORT}`);
  console.log(`Cloud API configured: ${isCloudApiConfigured()}`);
});

