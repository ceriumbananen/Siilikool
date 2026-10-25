/* Spelarens utseende på hela sidan: bakgrundsscenen hon bär ("Bakom Siiri" i Laat), färgtemat
   och ljust/mörkt - som applyScene()/applyColor() i public/legacy/app.js, men för alla sidor
   (Vue-sidorna saknade dem) och reaktivt, så att ett köp i Laat byter utseende direkt. Det sparade
   ljusa/mörka läget (S.theme) lästes förut aldrig in när appen startade. */

/** Enkel luminans för en "#rrggbb"-färg (de enda --bg-värden temana/scenerna använder). */
function isDarkHex(hex: string): boolean {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return false;
  const n = parseInt(m[1]!, 16);
  const r = (n >> 16) & 255,
    g = (n >> 8) & 255,
    b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b < 128;
}

export default defineNuxtPlugin(() => {
  const profile = useProfileStore();
  const root = document.documentElement;
  const set = (attr: string, value: string | null) =>
    value ? root.setAttribute(attr, value) : root.removeAttribute(attr);

  watchEffect(() => {
    const s = profile.state;
    const scene = (s.wear as Record<string, string | null> | undefined)?.scene;
    set("data-scene", scene && ((s.owned as string[] | undefined) || []).includes(scene) ? scene : null);
    set("data-color", s.color && s.color !== "skog" ? (s.color as string) : null);
    if (s.theme === "dark" || s.theme === "light") set("data-theme", s.theme as string);
    /* Utan detta kan webbläsarens egen mörka-läge-heuristik (eller tillägg som Dark Reader)
       måla om inmatningsfält på egen hand, oberoende av våra --bg/--ink - precis det
       buggrapporterna beskriver ("ser inte texten" när man skriver, med norrsken eller
       mörkt läge). color-scheme talar om exakt vilket läge sidan faktiskt är målad i just nu
       (scenen kan göra sidan mörk även om data-theme inte är satt till "dark", och tvärtom),
       så webbläsaren slutar gissa. */
    root.style.colorScheme = isDarkHex(getComputedStyle(root).getPropertyValue("--bg")) ? "dark" : "light";
  });
});
