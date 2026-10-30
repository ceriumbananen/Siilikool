/* Siiri köök - matlagningsspelet. Ett recept är en kedja av steg, varje steg ett eget verb/gest
   (se kitchenStart() m.fl. i public/legacy/app.js för själva interaktionen):
   - vala (häll): dra ingrediensen till skålen
   - sega (röra): cirkelrörelse i skålen
   - loika (hacka/skär): upprepade tryck
   - kupseta (steka/baka): släpp när man vill - ingen tidspress, bara olika utfall

   Design: inget steg kan "misslyckas" på riktigt - gör man det press/för löst/för sent blir
   resultatet bara en annan, rolig maträtt (kitchenOutcomeFor nedan), aldrig ett rött kryss.
   Se SECRETS (secrets.ts) för samma "samla det udda resultatet"-mönster - S.cookbook fylls på
   likadant. */

export type KitchenVerb = "vala" | "sega" | "loika" | "kupseta";

export type KitchenStep = {
  verb: KitchenVerb;
  et: string;
  sv: string;
  /** bara vala: vad man drar till skålen */
  ingredient?: { em: string; et: string; sv: string };
};

export type KitchenOutcome = {
  id: string;
  em: string;
  name: { et: string; sv: string };
  et: string;
  sv: string;
};

export type KitchenRecipe = {
  id: string;
  name: { et: string; sv: string };
  steps: KitchenStep[];
  perfect: KitchenOutcome;
  /** utfallet om just det här steget blev det mest missade. "vala" (dra till skålen) har inget
   * "för mycket/för lite" i sig själv - bara sega/loika/kupseta har en egen gradskala
   * (för löst/för hårt rört, för få/för många tryck, för tidigt/sent uttagen), så bara de tre
   * behöver ett utfall här. */
  miss: Partial<Record<KitchenVerb, KitchenOutcome>>;
};

export const KITCHEN_RECIPES: KitchenRecipe[] = [
  {
    id: "kringel",
    name: { et: "Kringel", sv: "Kringlor" },
    steps: [
      {
        verb: "vala",
        et: "Vala kolm marja kaussi",
        sv: "Häll i tre bär i skålen",
        ingredient: { em: "🫐", et: "marjad", sv: "bär" },
      },
      { verb: "sega", et: "Sega taignat", sv: "Rör om degen" },
      { verb: "loika", et: "Lõika taigen tükkideks", sv: "Dela degen i bitar" },
      { verb: "kupseta", et: "Küpseta kringlid", sv: "Grädda kringlorna" },
    ],
    perfect: {
      id: "kringel-ok",
      em: "🥨",
      name: { et: "Kringel", sv: "En fin kringla" },
      et: "Imeline! Täpselt paras kringel, krõbe väljast ja pehme seest.",
      sv: "Underbart! En precis lagom kringla, knaprig utanpå och mjuk inuti.",
    },
    miss: {
      sega: {
        id: "kringel-miss-sega",
        em: "🥞",
        name: { et: "Hiiglaslik pannkook", sv: "Jättepannkaka" },
        et: "Taigen sai nii kaua segatud, et sellest sai hoopis üks hiiglaslik pannkook.",
        sv: "Degen blev omrörd så länge att den blev en enda jättestor pannkaka istället.",
      },
      loika: {
        id: "kringel-miss-loika",
        em: "🪢",
        name: { et: "Suur taignasõlm", sv: "Stor degknut" },
        et: "Taigen jäi üheks suureks sõlmeks - keegi ei jõudnud seda tükkideks lõigata.",
        sv: "Degen förblev en enda stor knut - ingen hann dela den i bitar.",
      },
      kupseta: {
        id: "kringel-miss-kupseta",
        em: "🦔",
        name: { et: "Siilikook", sv: "Igelkottskaka" },
        et: "See nägi ahjust tulles välja täpselt nagu väike okkaline siil!",
        sv: "Den såg ut precis som en liten taggig igelkott när den kom ur ugnen!",
      },
    },
  },
];
