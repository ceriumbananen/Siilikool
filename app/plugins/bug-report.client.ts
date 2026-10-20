/* Skickar en liten buggrapport till Supabase (bug_reports, se
   supabase/migrations/20261020000000_bugrapporter.sql) åt den gamla koden (openBugReport() i
   public/legacy/app.js), som når den som window.SiiriBugReport - samma brobyggarmönster som
   cloud.client.ts/siiri-store.client.ts. Fyller själv i den tekniska kontexten (skärm, senast
   uppspelade ord, de senaste JS-felen, enhet) - den som rapporterar väljer bara en kategori och
   skriver ev. en kort text. */

export interface SiiriBugReportBridge {
  enabled: boolean;
  send(category: string, note: string): Promise<boolean>;
}

export default defineNuxtPlugin(() => {
  const cloud = useCloudStore();
  const profile = useProfileStore();
  const sb = getSupabase();

  const bridge: SiiriBugReportBridge = {
    enabled: !!sb,
    async send(category, note) {
      if (!sb) return false;
      const debug = (window as unknown as { SiiriDebug?: { screen(): string; lastSpoken(): string } }).SiiriDebug;
      const trimmed = note.trim();
      const { error } = await sb.from("bug_reports").insert({
        reporter_user_id: cloud.session?.user.id ?? null,
        profile_name: profile.state.name || "",
        category,
        note: trimmed ? trimmed.slice(0, 2000) : null,
        screen: debug ? debug.screen() : "",
        last_audio: debug ? debug.lastSpoken() || null : null,
        console_errors: recentErrors(),
        device: { ua: navigator.userAgent, width: window.innerWidth, height: window.innerHeight },
      });
      return !error;
    },
  };
  (window as unknown as { SiiriBugReport: SiiriBugReportBridge }).SiiriBugReport = bridge;
});
