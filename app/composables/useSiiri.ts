/* Signaler till Siiri-figuren (SiiriPortrait) från resten av appen - motsvarar att legacy-koden
   anropade dance()/mood() direkt (public/legacy/app.js rad 5238, 5364). Alla figurer på sidan
   lyssnar; finns ingen figur händer inget. */

export type SiiriMood = "cheer" | "oops" | "listen" | "think" | "";

const danceRequest = reactive({ n: 0, big: false });
const moodRequest = reactive({ n: 0, kind: "" as SiiriMood });

export function useSiiri() {
  /** Får Siiri att dansa (big = med extra ackord, som vid nytt märke). */
  function dance(big = false) {
    danceRequest.big = big;
    danceRequest.n++;
  }
  /** Humör: "cheer" (glad + hopp, går över), "oops" (ledsen + vickning, går över),
   * "listen" (lyssnar, med ljudvågor) och "think" ligger kvar tills mood("") släpper dem. */
  function mood(kind: SiiriMood) {
    moodRequest.kind = kind;
    moodRequest.n++;
  }
  return { dance, mood, danceRequest: readonly(danceRequest), moodRequest: readonly(moodRequest) };
}
