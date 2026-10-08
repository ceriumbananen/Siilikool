/* Det de vuxna gör i familjekontot: logga in, skapa familjen, barn och PIN, glosor, enheter,
   familjekod, fler vuxna, vuxen-PIN och konto. Behörigheten avgörs av databasen
   (supabase/migrations/20261008000000_familj.sql) – här finns bara anropen. */

function must<T>(r: { data: T; error: { message: string } | null }): T {
  if (r.error) throw new Error(r.error.message);
  return r.data;
}

const MEMBER_LIST = "id, kind, name, avatar, has_pin, updated_at, stars:data->stars, xp:data->xp";
const LIST_COLS = "id, member_id, name, words, days, created_at";

export function useParentApi() {
  const sb = getSupabase();
  if (!sb) throw new Error("Konton är inte påslagna");

  return {
    /* ---------- inloggning med e-postlänk (eller koden i samma mejl) ---------- */
    /* länken leder tillbaka till sidan man står på (föräldraläget eller en inbjudan) */
    async sendLoginLink(email: string) {
      must(
        await sb.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: location.origin + location.pathname + location.search },
        }),
      );
    },
    async verifyCode(email: string, token: string) {
      must(await sb.auth.verifyOtp({ email, token: token.replace(/\s/g, ""), type: "email" }));
    },

    /* ---------- familjen ---------- */
    async family(): Promise<Family | null> {
      return must(await sb.from("families").select("id, name, child_code").maybeSingle()) as Family | null;
    },
    async createFamily(name: string, adultName: string): Promise<string> {
      return must(await sb.rpc("create_family", { p_name: name.trim(), p_adult_name: adultName.trim() })) as string;
    },
    async renameFamily(id: string, name: string) {
      must(await sb.from("families").update({ name: name.trim() }).eq("id", id));
    },
    async rotateCode(): Promise<string> {
      return must(await sb.rpc("rotate_child_code")) as string;
    },

    /* ---------- medlemmar ---------- */
    async members(): Promise<Member[]> {
      return must(await sb.from("members").select(MEMBER_LIST).order("created_at")) as Member[];
    },
    async addChild(familyId: string, name: string, avatar: string): Promise<Member> {
      return must(
        await sb
          .from("members")
          .insert({ family_id: familyId, kind: "child", name: name.trim().slice(0, 40), avatar })
          .select(MEMBER_LIST)
          .single(),
      ) as Member;
    },
    async updateMember(id: string, fields: { name?: string; avatar?: string }) {
      must(await sb.from("members").update(fields).eq("id", id));
    },
    async deleteChild(id: string) {
      must(await sb.from("members").delete().eq("id", id));
    },
    /* barnets PIN (4–8 siffror), eller null för att ta bort den */
    async setChildPin(id: string, pin: string | null) {
      must(await sb.rpc("set_member_pin", { p_member: id, p_pin: pin }));
    },
    /* barnets framsteg, sammanställt ur spelet som barnets enheter senast sparade */
    async progress(id: string): Promise<ChildProgress> {
      const row = must(await sb.from("members").select("data").eq("id", id).single()) as { data: Record<string, any> };
      return summarizeProgress(row.data);
    },

    /* ---------- glosor: för ett barn eller alla barn (memberId null) – den senaste gäller ---------- */
    async latestList(memberId: string | null): Promise<WordList | null> {
      const q = sb.from("word_lists").select(LIST_COLS);
      const r = await (memberId ? q.eq("member_id", memberId) : q.is("member_id", null))
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return must(r) as WordList | null;
    },
    async createList(familyId: string, memberId: string | null, name: string, words: Word[], days: number) {
      must(
        await sb.from("word_lists").insert({
          family_id: familyId,
          member_id: memberId,
          name: name.trim().slice(0, 40) || "Veckans ord",
          words,
          days,
        }),
      );
    },
    async deleteList(id: string) {
      must(await sb.from("word_lists").delete().eq("id", id));
    },

    /* ---------- enheter där ett barn valts ---------- */
    async devices(memberId: string): Promise<Device[]> {
      return must(
        await sb
          .from("device_members")
          .select("session_id, label, created_at")
          .eq("member_id", memberId)
          .order("created_at"),
      ) as Device[];
    },
    async removeDevice(sessionId: string, memberId: string) {
      must(await sb.from("device_members").delete().eq("session_id", sessionId).eq("member_id", memberId));
    },

    /* ---------- vuxna ---------- */
    async createInvite(): Promise<string> {
      return must(await sb.rpc("create_invite")) as string;
    },
    async acceptInvite(token: string, name: string): Promise<string> {
      return must(await sb.rpc("accept_invite", { p_token: token, p_name: name.trim() })) as string;
    },
    async hasAdultPin(): Promise<boolean> {
      return !!must(await sb.rpc("has_adult_pin"));
    },
    async setAdultPin(pin: string) {
      must(await sb.rpc("set_adult_pin", { p_pin: pin }));
    },

    /* ---------- konto ---------- */
    async deleteAccount() {
      must(await sb.rpc("delete_my_account"));
      await sb.auth.signOut({ scope: "local" });
    },
  };
}
