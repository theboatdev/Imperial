/**
 * Shopify Admin API helpers (server-side only).
 * Used after N-Genius payment confirmation to create a Draft Order.
 */

export interface DraftOrderLineItem {
  variantId: string;
  quantity: number;
  /** Optional title fallback when variant is unknown */
  title?: string;
  price?: string;
}

export interface DraftOrderAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  country: string;
  zip?: string;
  phone?: string;
}

export interface CreateDraftOrderInput {
  lineItems: DraftOrderLineItem[];
  email: string;
  phone?: string;
  shippingAddress: DraftOrderAddress;
  billingAddress?: DraftOrderAddress;
  note: string;
  /** ISO currency code from cart (AED, USD, …) — informational; Admin uses shop/variant currency */
  currencyCode?: string;
  tags?: string[];
}

export interface CreateDraftOrderResult {
  id: string;
  name: string;
  invoiceUrl: string | null;
  stub: boolean;
}

/** Best-effort idempotency for draft orders created from a payment ref (process-local). */
const createdDraftsByPaymentRef = new Map<string, CreateDraftOrderResult>();

function adminEndpoint(): string {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const version = process.env.SHOPIFY_API_VERSION || '2024-01';
  if (!domain) {
    throw new Error('NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is not configured');
  }
  return `https://${domain}/admin/api/${version}/graphql.json`;
}

const DRAFT_ORDER_CREATE = `
  mutation draftOrderCreate($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
      draftOrder {
        id
        name
        invoiceUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Create a Shopify Draft Order from paid checkout details.
 * Stubs when SHOPIFY_ADMIN_TOKEN is missing so local verify/webhook flows still succeed.
 */
export async function createDraftOrder(
  input: CreateDraftOrderInput,
  paymentRef?: string
): Promise<CreateDraftOrderResult> {
  if (paymentRef && createdDraftsByPaymentRef.has(paymentRef)) {
    return createdDraftsByPaymentRef.get(paymentRef)!;
  }

  const token = process.env.SHOPIFY_ADMIN_TOKEN?.trim();

  if (!token) {
    console.warn(
      '[shopify-admin] SHOPIFY_ADMIN_TOKEN missing — stubbing draftOrderCreate'
    );
    const stub: CreateDraftOrderResult = {
      id: `gid://shopify/DraftOrder/STUB_${paymentRef || Date.now()}`,
      name: `#STUB-${(paymentRef || 'LOCAL').slice(0, 12)}`,
      invoiceUrl: null,
      stub: true,
    };
    if (paymentRef) createdDraftsByPaymentRef.set(paymentRef, stub);
    return stub;
  }

  const lineItems = input.lineItems.map((item) => {
    // Prefer variant ID for real inventory linkage
    if (item.variantId?.startsWith('gid://')) {
      return {
        variantId: item.variantId,
        quantity: item.quantity,
      };
    }
    return {
      title: item.title || 'Item',
      originalUnitPrice: item.price || '0.00',
      quantity: item.quantity,
    };
  });

  const shipping = {
    firstName: input.shippingAddress.firstName,
    lastName: input.shippingAddress.lastName,
    address1: input.shippingAddress.address1,
    address2: input.shippingAddress.address2 || '',
    city: input.shippingAddress.city,
    province: input.shippingAddress.province,
    country: input.shippingAddress.country || 'AE',
    zip: input.shippingAddress.zip || '',
    phone: input.shippingAddress.phone || input.phone || '',
  };

  const variables = {
    input: {
      email: input.email,
      note: input.note,
      tags: input.tags || ['n-genius', 'headless-checkout'],
      lineItems,
      shippingAddress: shipping,
      billingAddress: input.billingAddress
        ? {
            firstName: input.billingAddress.firstName,
            lastName: input.billingAddress.lastName,
            address1: input.billingAddress.address1,
            address2: input.billingAddress.address2 || '',
            city: input.billingAddress.city,
            province: input.billingAddress.province,
            country: input.billingAddress.country || 'AE',
            zip: input.billingAddress.zip || '',
            phone: input.billingAddress.phone || input.phone || '',
          }
        : shipping,
      taxExempt: false,
    },
  };

  const response = await fetch(adminEndpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({ query: DRAFT_ORDER_CREATE, variables }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(
      `Shopify Admin draftOrderCreate HTTP ${response.status}: ${body || response.statusText}`
    );
  }

  const json = (await response.json()) as {
    data?: {
      draftOrderCreate?: {
        draftOrder?: { id: string; name: string; invoiceUrl?: string | null };
        userErrors?: Array<{ field?: string[]; message: string }>;
      };
    };
    errors?: Array<{ message: string }>;
  };

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '));
  }

  const payload = json.data?.draftOrderCreate;
  const userErrors = payload?.userErrors || [];
  if (userErrors.length) {
    throw new Error(userErrors.map((e) => e.message).join('; '));
  }

  const draft = payload?.draftOrder;
  if (!draft?.id) {
    throw new Error('Shopify Admin draftOrderCreate returned no draft order');
  }

  const result: CreateDraftOrderResult = {
    id: draft.id,
    name: draft.name,
    invoiceUrl: draft.invoiceUrl ?? null,
    stub: false,
  };

  if (paymentRef) createdDraftsByPaymentRef.set(paymentRef, result);
  return result;
}

export function hasCreatedDraftForPayment(paymentRef: string): boolean {
  return createdDraftsByPaymentRef.has(paymentRef);
}
