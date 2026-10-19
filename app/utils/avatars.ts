/* Figurerna man kan välja – samma som i spelet (AVATARS i public/legacy/app.js). Valet sparas
   som själva emojin (S.avatar), inte ett id - AVATARS ändras därför aldrig i efterhand utan
   att gamla sparfiler tappar sitt val. */
export const AVATARS = ["🦔", "🐻", "🦊", "🐰", "🐼", "🦉", "🐸", "🐯", "🦁", "🐨", "🐧", "🦄", "🐢", "🐙"];

/* Illustrerad bild istället för bara emoji (samma handritade stil som Siiri/rivalerna) för
   den som väljer den avatarn - se public/images/avatars/ och avatarIcon() i app.js. En
   separat uppslagning från emoji till bild, inte en del av AVATARS själv, eftersom S.avatar
   redan pekar på emojin och den identiteten inte ska ändras. */
export const AVATAR_IMG: Record<string, string> = {
  "🦔": "/images/avatars/hedgehog.webp",
  "🐻": "/images/avatars/bear.webp",
  "🦊": "/images/avatars/fox.webp",
  "🐰": "/images/avatars/rabbit.webp",
  "🐼": "/images/avatars/panda.webp",
  "🦉": "/images/avatars/owl.webp",
  "🐸": "/images/avatars/frog.webp",
  "🐯": "/images/avatars/tiger.webp",
  "🦁": "/images/avatars/lion.webp",
  "🐨": "/images/avatars/koala.webp",
  "🐧": "/images/avatars/penguin.webp",
  "🦄": "/images/avatars/unicorn.webp",
  "🐢": "/images/avatars/turtle.webp",
  "🐙": "/images/avatars/octopus.webp",
};
