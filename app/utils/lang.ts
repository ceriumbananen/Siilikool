/* Språkriktningen för Vue-sidorna - samma regler som tgt()/nat()/L() i public/legacy/app.js
   (se "SPRÅKRIKTNING" där). S.home är barnets eget språk: "sv" (standard) lär sig estniska,
   "et" lär sig svenska. Ordens data är par ({ et, sv }), så valet är bara vilken sida som
   visas som det man lär sig och vilken som förklaring. */

export type HomeLang = "sv" | "et";
type Save = Record<string, any>;
type Pair = { et: string; sv: string };

export const isEtHome = (s: Save) => s.home === "et";
/** Texten på språket barnet lär sig. */
export const tgt = (s: Save, o: Pair | null | undefined) => (o ? (isEtHome(s) ? o.sv : o.et) : "");
/** Texten på barnets eget språk. */
export const nat = (s: Save, o: Pair | null | undefined) => (o ? (isEtHome(s) ? o.et : o.sv) : "");
/** Fast gränssnittstext: svensk version normalt, estnisk i estniskt läge. */
export const L = (s: Save, sv: string, et: string) => (isEtHome(s) ? et : sv);
/** lang-attribut för text på språket barnet lär sig. */
export const tgtLang = (s: Save) => (isEtHome(s) ? "sv" : "et");
