// Plain-fetch wrappers around the existing Supabase backend on the app side.
// Mirrors the pattern from the Lovable strip-down — no supabase-js dependency.

type SupabaseResult<T = unknown> = { data: T | null; error: { message: string } | null };

function getEnv() {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(
      'PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_PUBLISHABLE_KEY must be set in .env.local (and in Vercel project settings for production).',
    );
  }
  return { url, key };
}

/**
 * Invoke a Supabase edge function. Mirrors `supabase.functions.invoke` shape.
 */
export async function invokeEdgeFunction<T = unknown>(
  name: string,
  init: { body?: unknown; method?: string } = {},
): Promise<SupabaseResult<T>> {
  try {
    const { url, key } = getEnv();
    const res = await fetch(`${url}/functions/v1/${name}`, {
      method: init.method ?? 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
        apikey: key,
      },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    });
    const text = await res.text();
    let parsed: unknown = null;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = text;
    }
    if (!res.ok) {
      const message =
        (parsed && typeof parsed === 'object' && 'error' in parsed && (parsed as any).error) ||
        (parsed && typeof parsed === 'object' && 'message' in parsed && (parsed as any).message) ||
        `Edge function "${name}" failed with status ${res.status}`;
      return { data: null, error: { message: String(message) } };
    }
    return { data: parsed as T, error: null };
  } catch (err) {
    return {
      data: null,
      error: { message: err instanceof Error ? err.message : String(err) },
    };
  }
}

/**
 * Plain REST insert via PostgREST using the anon key.
 * Suitable for public forms whose target table has an INSERT-anon RLS policy.
 */
export async function restInsert(
  table: string,
  row: Record<string, unknown>,
): Promise<{ error: { message: string } | null }> {
  try {
    const { url, key } = getEnv();
    const res = await fetch(`${url}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
        apikey: key,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
    });
    if (!res.ok) {
      const text = await res.text();
      return { error: { message: text || `Insert failed with status ${res.status}` } };
    }
    return { error: null };
  } catch (err) {
    return {
      error: { message: err instanceof Error ? err.message : String(err) },
    };
  }
}
