/**
 * N-Genius (Network International) Hosted Payment Page client.
 * When NGENIUS_API_KEY is missing, createOrder / getOrderStatus run in stub mode
 * so the checkout UI can be exercised locally without credentials.
 */

export type NGeniusOrderStatus =
  | 'STARTED'
  | 'AWAIT_3DS'
  | 'PURCHASED'
  | 'CAPTURED'
  | 'FAILED'
  | 'CANCELLED'
  | 'UNKNOWN';

export interface CreateNGeniusOrderInput {
  /** Amount in major units (e.g. 100.00) — converted to minor units for the API */
  amountMajor: number;
  currencyCode: string;
  email: string;
  redirectUrl: string;
  cancelUrl: string;
  merchantOrderReference?: string;
  /** Opaque string payload for verify/webhook (e.g. JSON checkout details) */
  checkoutPayload?: string;
}

export interface CreateNGeniusOrderResult {
  orderRef: string;
  paymentUrl: string;
  stub: boolean;
}

export interface NGeniusOrderStatusResult {
  orderRef: string;
  status: NGeniusOrderStatus;
  paid: boolean;
  amountMinor?: number;
  currencyCode?: string;
  email?: string;
  checkoutPayload?: string;
  stub: boolean;
  raw?: unknown;
}

const STUB_ORDER_REF = 'STUB_TEST';

function isStubMode(): boolean {
  return !process.env.NGENIUS_API_KEY?.trim();
}

function baseUrl(): string {
  const env = (process.env.NGENIUS_ENV || 'sandbox').toLowerCase();
  if (env === 'production' || env === 'prod') {
    return (
      process.env.NGENIUS_BASE_URL_PROD ||
      'https://api-gateway.ngenius-payments.com'
    );
  }
  return (
    process.env.NGENIUS_BASE_URL_SANDBOX ||
    'https://api-gateway.sandbox.ngenius-payments.com'
  );
}

function outletRef(): string {
  const ref = process.env.NGENIUS_OUTLET_REF?.trim();
  if (!ref) {
    throw new Error('NGENIUS_OUTLET_REF is not configured');
  }
  return ref;
}

/** Convert major currency units to minor (fils/cents). */
export function toMinorUnits(amountMajor: number): number {
  return Math.round(amountMajor * 100);
}

/**
 * Obtain a short-lived N-Genius access token.
 */
export async function getAccessToken(): Promise<string> {
  if (isStubMode()) {
    return 'STUB_ACCESS_TOKEN';
  }

  const apiKey = process.env.NGENIUS_API_KEY!.trim();
  const url = `${baseUrl()}/identity/auth/access-token`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${apiKey}`,
      'Content-Type': 'application/vnd.ni-identity.v1+json',
      Accept: 'application/vnd.ni-identity.v1+json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(
      `N-Genius auth failed (${response.status}): ${body || response.statusText}`
    );
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error('N-Genius auth response missing access_token');
  }
  return data.access_token;
}

/**
 * Create a PURCHASE order and return the Hosted Payment Page URL.
 * Stub: returns a local success URL with ref=STUB_TEST.
 */
export async function createOrder(
  input: CreateNGeniusOrderInput
): Promise<CreateNGeniusOrderResult> {
  if (isStubMode()) {
    const stubUrl = input.redirectUrl.includes('?')
      ? `${input.redirectUrl.split('?')[0]}?ref=${STUB_ORDER_REF}`
      : `${input.redirectUrl}?ref=${STUB_ORDER_REF}`;

    return {
      orderRef: STUB_ORDER_REF,
      paymentUrl: stubUrl,
      stub: true,
    };
  }

  const token = await getAccessToken();
  const amountMinor = toMinorUnits(input.amountMajor);
  const url = `${baseUrl()}/transactions/outlets/${outletRef()}/orders`;

  const payload = {
    action: 'PURCHASE',
    amount: {
      currencyCode: input.currencyCode,
      value: amountMinor,
    },
    emailAddress: input.email,
    merchantOrderReference: input.merchantOrderReference,
    merchantAttributes: {
      redirectUrl: input.redirectUrl,
      cancelUrl: input.cancelUrl,
      skipConfirmationPage: true,
      ...(input.checkoutPayload
        ? { checkoutPayload: input.checkoutPayload }
        : {}),
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/vnd.ni-payment.v2+json',
      Accept: 'application/vnd.ni-payment.v2+json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(
      `N-Genius create order failed (${response.status}): ${body || response.statusText}`
    );
  }

  const data = (await response.json()) as {
    reference?: string;
    _links?: { payment?: { href?: string } };
  };

  const orderRef = data.reference;
  const paymentUrl = data._links?.payment?.href;

  if (!orderRef || !paymentUrl) {
    throw new Error('N-Genius create order response missing reference or payment URL');
  }

  return { orderRef, paymentUrl, stub: false };
}

function mapStateToStatus(state: string | undefined): NGeniusOrderStatus {
  const s = (state || '').toUpperCase();
  if (
    s === 'PURCHASED' ||
    s === 'CAPTURED' ||
    s === 'PARTIALLY_CAPTURED'
  ) {
    return s === 'PARTIALLY_CAPTURED' ? 'CAPTURED' : (s as NGeniusOrderStatus);
  }
  if (s === 'FAILED' || s === 'CLOSED') return 'FAILED';
  if (s === 'CANCELLED') return 'CANCELLED';
  if (s === 'STARTED') return 'STARTED';
  if (s.includes('3DS')) return 'AWAIT_3DS';
  return 'UNKNOWN';
}

function isPaidStatus(status: NGeniusOrderStatus): boolean {
  return status === 'PURCHASED' || status === 'CAPTURED';
}

/**
 * Fetch order status from N-Genius.
 * Stub: STUB_TEST (and any ref starting with STUB_) is treated as paid.
 */
export async function getOrderStatus(
  orderRef: string
): Promise<NGeniusOrderStatusResult> {
  if (isStubMode() || orderRef === STUB_ORDER_REF || orderRef.startsWith('STUB_')) {
    return {
      orderRef,
      status: 'PURCHASED',
      paid: true,
      stub: true,
    };
  }

  const token = await getAccessToken();
  const url = `${baseUrl()}/transactions/outlets/${outletRef()}/orders/${orderRef}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.ni-payment.v2+json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(
      `N-Genius get order failed (${response.status}): ${body || response.statusText}`
    );
  }

  const data = (await response.json()) as {
    reference?: string;
    _embedded?: {
      payment?: Array<{
        state?: string;
        amount?: { value?: number; currencyCode?: string };
      }>;
    };
    emailAddress?: string;
    merchantAttributes?: { checkoutPayload?: string };
  };

  const payment = data._embedded?.payment?.[0];
  const status = mapStateToStatus(payment?.state);

  return {
    orderRef: data.reference || orderRef,
    status,
    paid: isPaidStatus(status),
    amountMinor: payment?.amount?.value,
    currencyCode: payment?.amount?.currencyCode,
    email: data.emailAddress,
    checkoutPayload: data.merchantAttributes?.checkoutPayload,
    stub: false,
    raw: data,
  };
}
