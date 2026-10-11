/* Beröm, motståndarnas pikar och svårighetsgraderna - flyttat ur public/legacy/app.js (som läser dem via window.SiiriData,
   app/plugins/siiri-data.client.ts). Ren data: ändra här, så gäller det både Vue-sidorna och legacy-skärmarna. */

export const PRAISE = {
  t1: [
    { et: "Tubli!", sv: "Duktigt!" },
    { et: "Õige!", sv: "Rätt!" },
    { et: "Just nii!", sv: "Precis så!" },
    { et: "Tore!", sv: "Fint!" },
    { et: "Hästi!", sv: "Bra!" },
  ],
  t2: [
    { et: "Väga hea!", sv: "Mycket bra!" },
    { et: "Väga tubli!", sv: "Riktigt duktigt!" },
    { et: "Sa oskad!", sv: "Du kan det här!" },
    { et: "Nii hea!", sv: "Så bra!" },
    { et: "Oled osav!", sv: "Du är skicklig!" },
  ],
  t3: [
    { et: "Suurepärane!", sv: "Enastående!" },
    { et: "Imeline!", sv: "Underbart!" },
    { et: "Fantastiline!", sv: "Fantastiskt!" },
    { et: "Vapustav!", sv: "Otroligt!" },
    { et: "Sa oled tubli!", sv: "Du är duktig!" },
  ],
  t4: [
    { et: "Uskumatu!", sv: "Ofattbart!" },
    { et: "Sa oled meister!", sv: "Du är en mästare!" },
    { et: "Suurepärane töö!", sv: "Enastående jobbat!" },
  ],
  no: [
    { et: "Pole hullu!", sv: "Ingen fara!" },
    { et: "Proovi veel!", sv: "Fortsätt försöka!" },
    { et: "Kuula hoolikalt!", sv: "Lyssna noga!" },
    { et: "Edasi!", sv: "Vi fortsätter!" },
  ],
};

export const TAUNT = {
  lead: [
    { et: "Ma võidan!", sv: "Jag vinner!" },
    { et: "Liiga lihtne!", sv: "För lätt!" },
    { et: "Ma olen kiire!", sv: "Jag är snabb!" },
  ],
  behind: [
    { et: "Oi ei!", sv: "Åh nej!" },
    { et: "Sa oled hea!", sv: "Du är bra!" },
    { et: "Ma pean pingutama!", sv: "Jag måste skärpa mig!" },
  ],
  miss: [
    { et: "Oih, ma eksisin!", sv: "Hoppsan, jag hade fel!" },
    { et: "Ei ole võimalik!", sv: "Inte möjligt!" },
  ],
  hit: [
    { et: "Õige!", sv: "Rätt!" },
    { et: "Loomulikult!", sv: "Självklart!" },
  ],
  win: [{ et: "Ma võitsin! Proovi uuesti!", sv: "Jag vann! Försök igen!" }],
  lose: [
    { et: "Sa võitsid! Palju õnne!", sv: "Du vann! Grattis!" },
    { et: "Hästi mängitud!", sv: "Snyggt spelat!" },
  ],
  dbl: [{ et: "Topeltpunkt!", sv: "Dubbelpoäng!" }],
  last: [{ et: "Viimane küsimus!", sv: "Sista frågan!" }],
  tie: [{ et: "Otsustav küsimus!", sv: "Avgörande fråga!" }],
};

export const DIFFS = [
  {
    id: "latt",
    sv: "Lätt",
    et: "Kerge",
    em: "🍃",
    mult: 1,
    opts: 3,
    peek: true,
    hint: true,
    emoji: true,
    txt: "Tre svar att välja på, bilder som hjälp och uttalsstöd överallt.",
    types: ["choose", "listen", "choose", "type"],
  },
  {
    id: "lagom",
    sv: "Lagom",
    et: "Keskmine",
    em: "⭐",
    mult: 1.5,
    opts: 4,
    peek: true,
    hint: true,
    emoji: true,
    txt: "Fyra svar, blandade frågor och lite mer att skriva.",
    types: ["listen", "choose", "type", "speak"],
  },
  {
    id: "svar",
    sv: "Svår",
    et: "Raske",
    em: "🔥",
    mult: 2,
    opts: 6,
    peek: false,
    hint: false,
    emoji: true,
    txt: "Sex svar, ingen svensk ledtråd, mest skriva och lyssna. Öppnar egna plagg och hemligheter.",
    types: ["type", "listen", "speak", "type", "listen"],
  },
];
