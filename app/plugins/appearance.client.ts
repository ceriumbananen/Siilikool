/* Spelarens utseende på hela sidan: bakgrundsscenen hon bär ("Bakom Siiri" i Laat), färgtemat
   och ljust/mörkt - som applyScene()/applyColor() i public/legacy/app.js, men för alla sidor
   (Vue-sidorna saknade dem) och reaktivt, så att ett köp i Laat byter utseende direkt. Det sparade
   ljusa/mörka läget (S.theme) lästes förut aldrig in när appen startade. */

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
  });
});
