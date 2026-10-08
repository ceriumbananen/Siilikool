/* Supabase-klienten (konton, barnprofiler, läxlistor). Adress och publik nyckel kommer från
   NUXT_PUBLIC_SUPABASE_URL och NUXT_PUBLIC_SUPABASE_KEY vid bygget. Saknas de fungerar appen
   precis som förut, bara utan konton. Använd aldrig service_role-nyckeln här. */

let client: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  const { supabaseUrl, supabaseKey } = useRuntimeConfig().public;
  client =
    supabaseUrl && supabaseKey
      ? createClient(String(supabaseUrl), String(supabaseKey), {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            /* "implicit": länken i mejlet fungerar även om den öppnas i en annan webbläsare än appen */
            flowType: "implicit",
            storageKey: "siilikool-auth",
          },
        })
      : null;
  return client;
}
