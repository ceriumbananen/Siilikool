/* Det föräldern gör i sitt konto: logga in, barnprofiler, läxlistor, koppla enheter, radera konto.
   Behörigheten avgörs av databasen (supabase/migrations) – här finns bara anropen. */

function must<T>(r: { data: T; error: { message: string } | null }): T {
  if (r.error) throw new Error(r.error.message);
  return r.data;
}

export function useParentApi() {
  const sb = getSupabase();
  if (!sb) throw new Error("Konton är inte påslagna");

  return {
    /* ---------- inloggning med e-postlänk (eller koden i samma mejl) ---------- */
    async sendLoginLink(email: string) {
      must(await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: location.origin + "/parent" } }));
    },
    async verifyCode(email: string, token: string) {
      must(await sb.auth.verifyOtp({ email, token: token.replace(/\s/g, ""), type: "email" }));
    },
    async deleteAccount() {
      must(await sb.rpc("delete_my_account"));
      await sb.auth.signOut({ scope: "local" });
    },

    /* ---------- barn ---------- */
    async children(): Promise<Child[]> {
      const { data: u } = await sb.auth.getUser();
      return must(
        await sb
          .from("profiles")
          .select("id, name, avatar, updated_at, stars:data->stars, xp:data->xp")
          .eq("parent_id", u.user?.id ?? "")
          .order("created_at"),
      ) as Child[];
    },
    async addChild(name: string): Promise<Child> {
      return must(
        await sb
          .from("profiles")
          .insert({ name: name.trim().slice(0, 40) })
          .select("id, name, avatar, updated_at")
          .single(),
      ) as Child;
    },
    async renameChild(id: string, name: string) {
      must(
        await sb
          .from("profiles")
          .update({ name: name.trim().slice(0, 40) })
          .eq("id", id),
      );
    },
    /* barnets framsteg, sammanställt ur spelet som barnets enhet senast sparade i kontot */
    async progress(id: string): Promise<ChildProgress> {
      const row = must(await sb.from("profiles").select("data").eq("id", id).single()) as { data: Record<string, any> };
      return summarizeProgress(row.data);
    },
    async deleteChild(id: string) {
      must(await sb.from("profiles").delete().eq("id", id));
    },

    /* ---------- läxlistor (den senaste gäller på barnets enhet) ---------- */
    async latestList(profileId: string): Promise<SchoolList | null> {
      return must(
        await sb
          .from("school_lists")
          .select("id, name, words, days, created_at")
          .eq("profile_id", profileId)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ) as SchoolList | null;
    },
    async createList(profileId: string, name: string, words: Word[], days: number) {
      must(
        await sb
          .from("school_lists")
          .insert({ profile_id: profileId, name: name.trim().slice(0, 40) || "Veckans ord", words, days }),
      );
    },
    async deleteList(id: string) {
      must(await sb.from("school_lists").delete().eq("id", id));
    },

    /* ---------- barnets enheter ---------- */
    async pairCode(profileId: string): Promise<string> {
      return must(await sb.rpc("create_pair_code", { p_profile: profileId })) as string;
    },
    async devices(profileId: string): Promise<Device[]> {
      return must(
        await sb
          .from("device_links")
          .select("device_user, label, created_at")
          .eq("profile_id", profileId)
          .order("created_at"),
      ) as Device[];
    },
    async removeDevice(deviceUser: string) {
      must(await sb.from("device_links").delete().eq("device_user", deviceUser));
    },
  };
}
