import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('[Supabase] Missing env vars; using placeholder values until runtime env is configured.');
}

export function isSupabaseConfigured(): boolean {
    return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

let serverClient: SupabaseClient | null = null;

/** Server-side client; returns null when Supabase env is not configured. */
export function getSupabaseServerClient(): SupabaseClient | null {
    if (!isSupabaseConfigured()) return null;
    if (!serverClient) {
        serverClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
    }
    return serverClient;
}

type OfflineResult = { data: unknown; error: null; count: number; status: number; statusText: string };

/** Query builder that resolves immediately when no database is connected. */
function offlineQuery(asSingle = false): Promise<OfflineResult> & Record<string, unknown> {
    const result: OfflineResult = {
        data: asSingle ? null : [],
        error: null,
        count: 0,
        status: 200,
        statusText: 'OK',
    };
    const promise = Promise.resolve(result);
    const run = () => offlineQuery(asSingle);
    return new Proxy(run, {
        get(_target, prop) {
            if (prop === 'then') return promise.then.bind(promise);
            if (prop === 'catch') return promise.catch.bind(promise);
            if (prop === 'finally') return promise.finally.bind(promise);
            if (prop === 'single' || prop === 'maybeSingle') return () => offlineQuery(true);
            return run;
        },
        apply() {
            return offlineQuery(asSingle);
        },
    }) as Promise<OfflineResult> & Record<string, unknown>;
}

function createOfflineClient() {
    return {
        from: () => offlineQuery(),
        rpc: () => offlineQuery(),
        channel: () => offlineQuery(),
        removeChannel: () => Promise.resolve('ok'),
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            getUser: async () => ({ data: { user: null }, error: null }),
            signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: 'Demo office' } }),
            signUp: async () => ({ data: { user: null, session: null }, error: { message: 'Demo office' } }),
            signOut: async () => ({ error: null }),
            updateUser: async () => ({ data: { user: null }, error: null }),
            resetPasswordForEmail: async () => ({ data: {}, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
        },
        storage: {
            from: () => ({
                upload: async () => ({ data: null, error: { message: 'Demo office' } }),
                list: async () => ({ data: [], error: null }),
                remove: async () => ({ data: [], error: null }),
                getPublicUrl: () => ({ data: { publicUrl: '' } }),
            }),
        },
    };
}

export const supabase = (isSupabaseConfigured()
    ? createClient(supabaseUrl, supabaseKey)
    : createOfflineClient()) as SupabaseClient;
