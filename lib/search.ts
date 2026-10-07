/**
 * Typo-tolerant product search helpers.
 * Combines token scoring with Levenshtein distance so misspellings
 * still surface relevant products when Shopify exact/prefix match fails.
 */

export interface SearchableProduct {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  productType: string;
  tags: string[];
}

const MAX_EDIT_RATIO = 0.4;
const MIN_SCORE = 0.35;

/** Normalize text for comparison: lowercase, strip accents/punctuation. */
export function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenize(value: string): string[] {
  const normalized = normalizeSearchText(value);
  return normalized ? normalized.split(' ') : [];
}

/** Classic Levenshtein edit distance. */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const prev = new Array<number>(b.length + 1);
  const curr = new Array<number>(b.length + 1);

  for (let j = 0; j <= b.length; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + cost
      );
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
  }

  return prev[b.length];
}

/** Score how well a query token matches a candidate token (0–1). */
function tokenSimilarity(queryToken: string, candidateToken: string): number {
  if (!queryToken || !candidateToken) return 0;
  if (queryToken === candidateToken) return 1;

  if (candidateToken.startsWith(queryToken) || queryToken.startsWith(candidateToken)) {
    const shorter = Math.min(queryToken.length, candidateToken.length);
    const longer = Math.max(queryToken.length, candidateToken.length);
    return 0.85 + (0.15 * shorter) / longer;
  }

  if (candidateToken.includes(queryToken) || queryToken.includes(candidateToken)) {
    const shorter = Math.min(queryToken.length, candidateToken.length);
    const longer = Math.max(queryToken.length, candidateToken.length);
    return 0.65 * (shorter / longer);
  }

  // Skip expensive distance checks for very short tokens
  if (queryToken.length < 3 || candidateToken.length < 3) return 0;

  const distance = levenshtein(queryToken, candidateToken);
  const maxLen = Math.max(queryToken.length, candidateToken.length);
  const ratio = distance / maxLen;

  if (ratio > MAX_EDIT_RATIO) return 0;
  return 1 - ratio;
}

/** Best similarity of a query token against any token in the field text. */
function bestTokenScore(queryToken: string, fieldTokens: string[]): number {
  let best = 0;
  for (const token of fieldTokens) {
    const score = tokenSimilarity(queryToken, token);
    if (score > best) best = score;
    if (best >= 1) break;
  }
  return best;
}

/**
 * Score a product against a free-text query.
 * Higher is better; returns 0 when there is no meaningful match.
 */
export function scoreProductMatch(query: string, product: SearchableProduct): number {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return 0;

  const titleTokens = tokenize(product.title);
  const handleTokens = tokenize(product.handle.replace(/-/g, ' '));
  const vendorTokens = tokenize(product.vendor);
  const typeTokens = tokenize(product.productType);
  const tagTokens = product.tags.flatMap(tokenize);

  const fields: { tokens: string[]; weight: number }[] = [
    { tokens: titleTokens, weight: 1 },
    { tokens: handleTokens, weight: 0.7 },
    { tokens: typeTokens, weight: 0.55 },
    { tokens: vendorTokens, weight: 0.5 },
    { tokens: tagTokens, weight: 0.45 },
  ];

  let total = 0;
  let matchedTokens = 0;

  for (const qToken of queryTokens) {
    let bestForToken = 0;
    for (const field of fields) {
      const fieldScore = bestTokenScore(qToken, field.tokens) * field.weight;
      if (fieldScore > bestForToken) bestForToken = fieldScore;
    }
    if (bestForToken >= MIN_SCORE) matchedTokens += 1;
    total += bestForToken;
  }

  // Require at least one query token to match reasonably well
  if (matchedTokens === 0) return 0;

  const coverage = matchedTokens / queryTokens.length;
  return (total / queryTokens.length) * (0.7 + 0.3 * coverage);
}

/**
 * Rank products by fuzzy relevance and return those above the score floor.
 */
export function fuzzyRankProducts<T extends SearchableProduct>(
  query: string,
  products: T[],
  limit = 24
): T[] {
  const scored = products
    .map((product) => ({ product, score: scoreProductMatch(query, product) }))
    .filter(({ score }) => score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ product }) => product);
}

/**
 * Build a Shopify products() query string for free-text search.
 * Broader than title-prefix-only so vendor/type/tags also participate.
 */
export function buildShopifyTextQuery(q: string): string {
  const trimmed = q.trim();
  if (!trimmed) return '';

  // Escape quotes used in Shopify query syntax
  const safe = trimmed.replace(/"/g, '');
  return `${safe}*`;
}
