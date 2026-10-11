/* Dolda hemligheter i profilen - porterat från SECRETS i public/legacy/app.js (rad 2460-2474). */

export type Secret = {
  id: string;
  em: string;
  sv: string;
  hint: string;
};

export const SECRETS: Secret[] = [
  { id: "gold", em: "🌟", sv: "Gyllene Siiri", hint: "Guld kommer till den som inte släpper taget." },
  { id: "tickle", em: "🤭", sv: "Kittelkungen", hint: "Tålamodet tar slut om fingret aldrig gör det." },
  { id: "snow", em: "❄️", sv: "Snöfallet", hint: "Månen bär på vinter. Väck den – tålmodigt eller enträget." },
  { id: "sneeze", em: "🤧", sv: "Nysningen", hint: "Tre gånger på det som luktar." },
  { id: "stars", em: "⭐", sv: "Stjärnregnet", hint: "Sju snabba tryck på räknaren uppe i hörnet." },
  { id: "medals", em: "🏅", sv: "Medaljkarusellen", hint: "Håll fast vid metallen tills den börjar dansa." },
  { id: "ten", em: "🔟", sv: "Tio i rad", hint: "Tio steg utan att snubbla." },
  { id: "year", em: "🌍", sv: "Hela året", hint: "Fem gånger på vädret, så hinner alla årstider förbi." },
  { id: "owl", em: "🌙", sv: "Nattugglan", hint: "Hon är vaken när andra sover. Nästan." },
  { id: "me", em: "🦔", sv: "Namnet", hint: "Ett lånat namn förvirrar den som äger det." },
  { id: "hardten", em: "🔥", sv: "Eldsjälen", hint: "Tio i rad — men bara den som spelar utan hjälp får den." },
  { id: "hardperfect", em: "🐉", sv: "Draksegraren", hint: "Allt rätt i ett tema, på den svåraste nivån." },
  { id: "turtle", em: "🐢", sv: "Sköldpaddan", hint: "Den långsammaste knappen belönar den som väntar längst." },
];
