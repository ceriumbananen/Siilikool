(function () {
  "use strict";

  /* ============ INNEHÅLL ============ */
  var THEMES = [
    {
      id: "tere",
      sv: "Hälsningar",
      et: "Tervitused",
      em: "👋",
      words: [
        { et: "tere", sv: "hej", em: "👋", hint: "TE-re" },
        { et: "tere hommikust", sv: "god morgon", em: "🌅", hint: "TE-re HOM-mi-kust" },
        { et: "head aega", sv: "hej då", em: "🖐️", hint: "HEAD A-e-ga" },
        { et: "aitäh", sv: "tack", em: "🎁", hint: "AJ-täh" },
        { et: "palun", sv: "snälla", em: "🤲", hint: "PA-lun" },
        { et: "jah", sv: "ja", em: "✅", hint: "jah" },
        { et: "ei", sv: "nej", em: "❌", hint: "ej" },
        { et: "head ööd", sv: "god natt", em: "🌙", hint: "HEAD ÖÖD" },
        { et: "tere päevast", sv: "god dag", em: "☀️", hint: "TE-re PÄE-vast" },
        { et: "tere õhtust", sv: "god kväll", em: "🌆", hint: "TE-re ÕH-tust" },
        { et: "kuidas läheb", sv: "hur mår du", em: "🤔", hint: "KUI-das LÄ-heb" },
        { et: "vabandust", sv: "förlåt", em: "🙇", hint: "VA-ban-dust" },
        { et: "nägemist", sv: "vi ses", em: "🫱", hint: "NÄ-ge-mist" },
        { et: "tere tulemast", sv: "välkommen", em: "🚪", hint: "TE-re TU-le-mast" },
        { et: "kõike head", sv: "allt gott", em: "🍀", hint: "KÕI-ke HEAD" },
        { et: "ole hea", sv: "varsågod", em: "🙂", hint: "O-le HEA" },
        { et: "kuidas läheb", sv: "hur går det", em: "🤔", hint: "KUI-das LÄ-heb" },
        { et: "hästi", sv: "bra", em: "👍", hint: "HÄS-ti" },
        { et: "halvasti", sv: "dåligt", em: "👎", hint: "HAL-vas-ti" },
        { et: "kena", sv: "trevligt", em: "😊", hint: "KE-na" },
      ],
    },
    {
      id: "loomad",
      sv: "Djur",
      et: "Loomad",
      em: "🦔",
      words: [
        { et: "koer", sv: "hund", em: "🐶", hint: "KO-er" },
        { et: "kass", sv: "katt", em: "🐱", hint: "kass" },
        { et: "hobune", sv: "häst", em: "🐴", hint: "HO-bu-ne" },
        { et: "lehm", sv: "ko", em: "🐮", hint: "lehm" },
        { et: "karu", sv: "björn", em: "🐻", hint: "KA-ru" },
        { et: "siil", sv: "igelkott", em: "🦔", hint: "siil" },
        { et: "lind", sv: "fågel", em: "🐦", hint: "lind" },
        { et: "kala", sv: "fisk", em: "🐟", hint: "KA-la" },
        { et: "siga", sv: "gris", em: "🐷", hint: "SI-ga" },
        { et: "lammas", sv: "får", em: "🐑", hint: "LAM-mas" },
        { et: "kits", sv: "get", em: "🐐", hint: "kits" },
        { et: "hunt", sv: "varg", em: "🐺", hint: "hunt" },
        { et: "rebane", sv: "räv", em: "🦊", hint: "RE-ba-ne" },
        { et: "jänes", sv: "hare", em: "🐰", hint: "JÄ-nes" },
        { et: "hiir", sv: "mus", em: "🐭", hint: "hiir" },
        { et: "konn", sv: "groda", em: "🐸", hint: "konn" },
        { et: "orav", sv: "ekorre", em: "🐿️", hint: "O-rav" },
      ],
    },
    {
      id: "varvid",
      sv: "Färger",
      et: "Värvid",
      em: "🎨",
      words: [
        /* steg 1: grundfärgerna. steg 2 och 3 öppnas när de föregående sitter */
        { et: "punane", sv: "röd", em: "🔴", hint: "PU-na-ne", step: 1 },
        { et: "sinine", sv: "blå", em: "🔵", hint: "SI-ni-ne", step: 1 },
        { et: "kollane", sv: "gul", em: "🟡", hint: "KOL-la-ne", step: 1 },
        { et: "roheline", sv: "grön", em: "🟢", hint: "RO-he-li-ne", step: 1 },
        { et: "must", sv: "svart", em: "⚫", hint: "must", step: 1 },
        { et: "valge", sv: "vit", em: "⚪", hint: "VAL-ge", step: 1 },
        /* steg 2: fler färger */
        { et: "roosa", sv: "rosa", em: "🩷", hint: "ROO-sa", step: 2 },
        { et: "lilla", sv: "lila", em: "🟣", hint: "LIL-la", step: 2 },
        { et: "hall", sv: "grå", em: "🩶", hint: "hall", step: 2 },
        { et: "pruun", sv: "brun", em: "🟤", hint: "pruun", step: 2 },
        { et: "oranž", sv: "orange", em: "🟠", hint: "O-ranž", step: 2 },
        /* steg 3: ordbildning – hele- och tume- sätts ihop med en grundfärg */
        { et: "helesinine", sv: "ljusblå", em: "🔷", hint: "HE-le-si-ni-ne", step: 3 },
        { et: "tumeroheline", sv: "mörkgrön", em: "🟩", hint: "TU-me-ro-he-li-ne", step: 3 },
        { et: "kuldne", sv: "gyllene", em: "🥇", hint: "KULD-ne", step: 3 },
        { et: "hõbedane", sv: "silvrig", em: "🥈", hint: "HÕ-be-da-ne", step: 3 },
        { et: "värviline", sv: "färgglad", em: "🌈", hint: "VÄR-vi-li-ne", step: 3 },
      ],
    },
    {
      id: "numbrid",
      sv: "Siffror",
      et: "Numbrid",
      em: "🔢",
      words: [
        { et: "üks", sv: "ett", em: "1️⃣", hint: "üks" },
        { et: "kaks", sv: "två", em: "2️⃣", hint: "kaks" },
        { et: "kolm", sv: "tre", em: "3️⃣", hint: "kolm" },
        { et: "neli", sv: "fyra", em: "4️⃣", hint: "NE-li" },
        { et: "viis", sv: "fem", em: "5️⃣", hint: "viis" },
        { et: "kuus", sv: "sex", em: "6️⃣", hint: "kuus" },
        { et: "seitse", sv: "sju", em: "7️⃣", hint: "SEJT-se" },
        { et: "kaheksa", sv: "åtta", em: "8️⃣", hint: "KA-hek-sa" },
        { et: "üheksa", sv: "nio", em: "9️⃣", hint: "Ü-hek-sa" },
        { et: "kümme", sv: "tio", em: "🔟", hint: "KÜM-me" },
        { et: "null", sv: "noll", em: "0️⃣", hint: "null" },
        { et: "sada", sv: "hundra", em: "💯", hint: "SA-da" },
        { et: "esimene", sv: "första", em: "🥇", hint: "E-si-me-ne" },
        { et: "teine", sv: "andra", em: "🥈", hint: "TEI-ne" },
        { et: "kolmas", sv: "tredje", em: "🥉", hint: "KOL-mas" },
        { et: "pool", sv: "halv", em: "🌗", hint: "pool" },
        { et: "palju", sv: "mycket", em: "🗻", hint: "PAL-ju" },
        { et: "vähe", sv: "lite", em: "🤏", hint: "VÄ-he" },
      ],
    },
    {
      id: "toit",
      sv: "Mat",
      et: "Toit",
      em: "🍎",
      words: [
        { et: "leib", sv: "bröd", em: "🍞", hint: "lejb" },
        { et: "piim", sv: "mjölk", em: "🥛", hint: "piim" },
        { et: "vesi", sv: "vatten", em: "💧", hint: "VE-si" },
        { et: "õun", sv: "äpple", em: "🍎", hint: "ÕUN (bakre ö)" },
        { et: "juust", sv: "ost", em: "🧀", hint: "juust" },
        { et: "kook", sv: "tårta", em: "🍰", hint: "kook" },
        { et: "supp", sv: "soppa", em: "🍲", hint: "supp" },
        { et: "jäätis", sv: "glass", em: "🍦", hint: "JÄÄ-tis" },
        { et: "või", sv: "smör", em: "🧈", hint: "või" },
        { et: "muna", sv: "ägg", em: "🥚", hint: "MU-na" },
        { et: "liha", sv: "kött", em: "🍖", hint: "LI-ha" },
        { et: "riis", sv: "ris", em: "🍚", hint: "riis" },
        { et: "pasta", sv: "pasta", em: "🍝", hint: "PAS-ta" },
        { et: "mesi", sv: "honung", em: "🍯", hint: "ME-si" },
        { et: "sool", sv: "salt", em: "🧂", hint: "sool" },
        { et: "šokolaad", sv: "choklad", em: "🍫", hint: "SJO-ko-laad" },
        { et: "kartul", sv: "potatis", em: "🥔", hint: "KAR-tul" },
      ],
    },
    {
      id: "pere",
      sv: "Familjen",
      et: "Perekond",
      em: "👨‍👩‍👧",
      words: [
        { et: "ema", sv: "mamma", em: "👩", hint: "E-ma" },
        { et: "isa", sv: "pappa", em: "👨", hint: "I-sa" },
        { et: "õde", sv: "syster", em: "👧", hint: "Õ-de" },
        { et: "vend", sv: "bror", em: "👦", hint: "vend" },
        { et: "vanaema", sv: "mormor", em: "👵", hint: "VA-na-e-ma" },
        { et: "vanaisa", sv: "morfar", em: "👴", hint: "VA-na-i-sa" },
        { et: "laps", sv: "barn", em: "🧒", hint: "laps" },
        { et: "sõber", sv: "kompis", em: "🤝", hint: "SÕ-ber" },
        { et: "tädi", sv: "faster", em: "👩‍🦰", hint: "TÄ-di" },
        { et: "onu", sv: "farbror", em: "👨‍🦱", hint: "O-nu" },
        { et: "nõbu", sv: "kusin", em: "🧑", hint: "NÕ-bu" },
        { et: "beebi", sv: "bebis", em: "👶", hint: "BEE-bi" },
        { et: "poeg", sv: "son", em: "👦🏻", hint: "PO-eg" },
        { et: "tütar", sv: "dotter", em: "👧🏻", hint: "TÜ-tar" },
        { et: "naine", sv: "kvinna", em: "👩‍🦳", hint: "NAI-ne" },
        { et: "mees", sv: "man", em: "👨‍🦳", hint: "mees" },
      ],
    },
    {
      id: "keha",
      sv: "Kroppen",
      et: "Keha",
      em: "✋",
      words: [
        { et: "käsi", sv: "hand", em: "✋", hint: "KÄ-si" },
        { et: "jalg", sv: "ben, fot", em: "🦶", hint: "jalg" },
        { et: "silm", sv: "öga", em: "👁️", hint: "silm" },
        { et: "kõrv", sv: "öra", em: "👂", hint: "KÕRV" },
        { et: "nina", sv: "näsa", em: "👃", hint: "NI-na" },
        { et: "suu", sv: "mun", em: "👄", hint: "suu" },
        { et: "hammas", sv: "tand", em: "🦷", hint: "HAM-mas" },
        { et: "juuksed", sv: "hår", em: "💇", hint: "JUUK-sed" },
        { et: "pea", sv: "huvud", em: "🧠", hint: "pea" },
        { et: "selg", sv: "rygg", em: "🧍", hint: "selg" },
        { et: "kõht", sv: "mage", em: "🫃", hint: "kõht" },
        { et: "sõrm", sv: "finger", em: "☝️", hint: "sõrm" },
        { et: "varvas", sv: "tå", em: "👣", hint: "VAR-vas" },
        { et: "põlv", sv: "knä", em: "🦵", hint: "põlv" },
        { et: "õlg", sv: "axel", em: "💪", hint: "õlg" },
        { et: "keel", sv: "tunga", em: "👅", hint: "keel" },
        { et: "kael", sv: "hals", em: "🧣", hint: "kael" },
      ],
    },
    {
      id: "kool",
      sv: "I skolan",
      et: "Koolis",
      em: "🎒",
      words: [
        { et: "kool", sv: "skola", em: "🏫", hint: "kool" },
        { et: "raamat", sv: "bok", em: "📚", hint: "RAA-mat" },
        { et: "pliiats", sv: "penna", em: "✏️", hint: "PLII-ats" },
        { et: "paber", sv: "papper", em: "📄", hint: "PA-ber" },
        { et: "kott", sv: "väska", em: "🎒", hint: "kott" },
        { et: "arvuti", sv: "dator", em: "💻", hint: "AR-vu-ti" },
        { et: "kell", sv: "klocka", em: "🕐", hint: "kell" },
        { et: "õpetaja", sv: "lärare", em: "👩‍🏫", hint: "Õ-pe-ta-ja" },
        { et: "tahvel", sv: "tavla", em: "📋", hint: "TAH-vel" },
        { et: "kustukumm", sv: "suddgummi", em: "🧽", hint: "KUS-tu-kumm" },
        { et: "käärid", sv: "sax", em: "✂️", hint: "KÄÄ-rid" },
        { et: "liim", sv: "lim", em: "🧴", hint: "liim" },
        { et: "joonlaud", sv: "linjal", em: "📏", hint: "JOON-laud" },
        { et: "vihik", sv: "skrivbok", em: "📓", hint: "VI-hik" },
        { et: "pinal", sv: "pennfodral", em: "🖊️", hint: "PI-nal" },
        { et: "tund", sv: "lektion", em: "⏰", hint: "tund" },
        { et: "vahetund", sv: "rast", em: "🏃", hint: "VA-he-tund" },
        { et: "küsimus", sv: "fråga", em: "❓", hint: "KÜ-si-mus" },
        { et: "vastus", sv: "svar", em: "💬", hint: "VAS-tus" },
        { et: "sõber", sv: "kompis", em: "🤝", hint: "SÕ-ber" },
      ],
    },
    {
      id: "riided",
      sv: "Kläder",
      et: "Riided",
      em: "👕",
      words: [
        { et: "särk", sv: "tröja", em: "👕", hint: "särk" },
        { et: "püksid", sv: "byxor", em: "👖", hint: "PÜK-sid" },
        { et: "kleit", sv: "klänning", em: "👗", hint: "klejt" },
        { et: "sokid", sv: "strumpor", em: "🧦", hint: "SO-kid" },
        { et: "kingad", sv: "skor", em: "👟", hint: "KIN-gad" },
        { et: "müts", sv: "mössa", em: "🧢", hint: "müts" },
        { et: "jope", sv: "jacka", em: "🧥", hint: "JO-pe" },
        { et: "kindad", sv: "vantar", em: "🧤", hint: "KIN-dad" },
        { et: "pluus", sv: "blus", em: "👚", hint: "pluus" },
        { et: "sall", sv: "halsduk", em: "🧣", hint: "sall" },
        { et: "saapad", sv: "stövlar, kängor", em: "🥾", hint: "SAA-pad" },
        { et: "sussid", sv: "tofflor", em: "🩴", hint: "SUS-sid" },
        { et: "lühikesed püksid", sv: "shorts", em: "🩳", hint: "LÜ-hi-ke-sed PÜK-sid" },
        { et: "pidžaama", sv: "pyjamas", em: "🛌", hint: "PID-zjaa-ma" },
        { et: "taskurätik", sv: "näsduk", em: "🤧", hint: "TAS-ku-rä-tik" },
        { et: "käekell", sv: "armbandsur", em: "⌚", hint: "KÄE-kell" },
        { et: "seelik", sv: "kjol", em: "👗", hint: "SEE-lik" },
      ],
    },
    {
      id: "kodus",
      sv: "Hemma",
      et: "Kodus",
      em: "🏠",
      words: [
        { et: "maja", sv: "hus", em: "🏠", hint: "MA-ja" },
        { et: "uks", sv: "dörr", em: "🚪", hint: "uks" },
        { et: "aken", sv: "fönster", em: "🪟", hint: "A-ken" },
        { et: "voodi", sv: "säng", em: "🛏️", hint: "VOO-di" },
        { et: "tool", sv: "stol", em: "🪑", hint: "tool" },
        { et: "diivan", sv: "soffa", em: "🛋️", hint: "DII-van" },
        { et: "lamp", sv: "lampa", em: "💡", hint: "lamp" },
        { et: "võti", sv: "nyckel", em: "🔑", hint: "VÕ-ti" },
        { et: "vann", sv: "badkar", em: "🛁", hint: "vann" },
        { et: "dušš", sv: "dusch", em: "🚿", hint: "dusj" },
        { et: "tualett", sv: "toalett", em: "🚽", hint: "TU-a-lett" },
        { et: "külmkapp", sv: "kylskåp", em: "🧊", hint: "KÜLM-kapp" },
        { et: "pliit", sv: "spis", em: "🍳", hint: "pliit" },
        { et: "telekas", sv: "tv", em: "📺", hint: "TE-le-kas" },
        { et: "tekk", sv: "täcke", em: "🛌", hint: "tekk" },
        { et: "vaip", sv: "matta", em: "🟫", hint: "vaip" },
        { et: "padi", sv: "kudde", em: "🛏️", hint: "PA-di" },
        { et: "kell", sv: "klocka", em: "🕰️", hint: "kell" },
        { et: "peegel", sv: "spegel", em: "🪞", hint: "PEE-gel" },
      ],
    },
    {
      id: "soidukid",
      sv: "Fordon",
      et: "Sõidukid",
      em: "🚗",
      words: [
        { et: "auto", sv: "bil", em: "🚗", hint: "AU-to" },
        { et: "buss", sv: "buss", em: "🚌", hint: "buss" },
        { et: "rong", sv: "tåg", em: "🚂", hint: "rong" },
        { et: "jalgratas", sv: "cykel", em: "🚲", hint: "JALG-ra-tas" },
        { et: "laev", sv: "båt", em: "🚢", hint: "laev" },
        { et: "lennuk", sv: "flygplan", em: "✈️", hint: "LEN-nuk" },
        { et: "traktor", sv: "traktor", em: "🚜", hint: "TRAK-tor" },
        { et: "tuletõrjeauto", sv: "brandbil", em: "🚒", hint: "TU-le-tõr-je-au-to" },
        { et: "tramm", sv: "spårvagn", em: "🚋", hint: "tramm" },
        { et: "takso", sv: "taxi", em: "🚕", hint: "TAK-so" },
        { et: "mootorratas", sv: "motorcykel", em: "🏍️", hint: "MOO-tor-ra-tas" },
        { et: "tõukeratas", sv: "sparkcykel", em: "🛴", hint: "TÕU-ke-ra-tas" },
        { et: "kiirabi", sv: "ambulans", em: "🚑", hint: "KII-ra-bi" },
        { et: "politseiauto", sv: "polisbil", em: "🚓", hint: "PO-lit-sei-au-to" },
        { et: "helikopter", sv: "helikopter", em: "🚁", hint: "HE-li-kop-ter" },
        { et: "rakett", sv: "raket", em: "🚀", hint: "RA-kett" },
        { et: "ratas", sv: "hjul", em: "☸️", hint: "RA-tas" },
        { et: "veoauto", sv: "lastbil", em: "🚚", hint: "VE-o-au-to" },
      ],
    },
    {
      id: "tegevused",
      sv: "Vad man gör",
      et: "Tegevused",
      em: "🏃",
      words: [
        { et: "jooksma", sv: "springa", em: "🏃", hint: "JOOKS-ma" },
        { et: "hüppama", sv: "hoppa", em: "🤸", hint: "HÜP-pa-ma" },
        { et: "magama", sv: "sova", em: "😴", hint: "MA-ga-ma" },
        { et: "sööma", sv: "äta", em: "🍽️", hint: "SÖÖ-ma" },
        { et: "jooma", sv: "dricka", em: "🧃", hint: "JOO-ma" },
        { et: "lugema", sv: "läsa", em: "📖", hint: "LU-ge-ma" },
        { et: "laulma", sv: "sjunga", em: "🎤", hint: "LAUL-ma" },
        { et: "mängima", sv: "leka", em: "🎠", hint: "MÄN-gi-ma" },
        { et: "kõndima", sv: "gå", em: "🚶", hint: "KÕN-di-ma" },
        { et: "rääkima", sv: "prata", em: "🗣️", hint: "RÄÄ-ki-ma" },
        { et: "kirjutama", sv: "skriva", em: "✍️", hint: "KIR-ju-ta-ma" },
        { et: "joonistama", sv: "rita", em: "🎨", hint: "JOO-nis-ta-ma" },
        { et: "tantsima", sv: "dansa", em: "💃", hint: "TANT-si-ma" },
        { et: "naerma", sv: "skratta", em: "😂", hint: "NAER-ma" },
        { et: "nutma", sv: "gråta", em: "😭", hint: "NUT-ma" },
        { et: "ootama", sv: "vänta", em: "⏳", hint: "OO-ta-ma" },
      ],
    },
    {
      id: "puuviljad",
      sv: "Frukt och grönt",
      et: "Puuviljad",
      em: "🍓",
      words: [
        { et: "banaan", sv: "banan", em: "🍌", hint: "BA-naan" },
        { et: "pirn", sv: "päron", em: "🍐", hint: "pirn" },
        { et: "maasikas", sv: "jordgubbe", em: "🍓", hint: "MAA-si-kas" },
        { et: "apelsin", sv: "apelsin", em: "🍊", hint: "A-pel-sin" },
        { et: "viinamari", sv: "vindruva", em: "🍇", hint: "VII-na-ma-ri" },
        { et: "porgand", sv: "morot", em: "🥕", hint: "POR-gand" },
        { et: "kurk", sv: "gurka", em: "🥒", hint: "kurk" },
        { et: "tomat", sv: "tomat", em: "🍅", hint: "TO-mat" },
        { et: "virsik", sv: "persika", em: "🍑", hint: "VIR-sik" },
        { et: "arbuus", sv: "vattenmelon", em: "🍉", hint: "AR-buus" },
        { et: "ananass", sv: "ananas", em: "🍍", hint: "A-na-nass" },
        { et: "sidrun", sv: "citron", em: "🍋", hint: "SID-run" },
        { et: "kirss", sv: "körsbär", em: "🍒", hint: "kirss" },
        { et: "mustikas", sv: "blåbär", em: "🫐", hint: "MUS-ti-kas" },
        { et: "seen", sv: "svamp", em: "🍄", hint: "seen" },
        { et: "sibul", sv: "lök", em: "🧅", hint: "SI-bul" },
        { et: "kapsas", sv: "kål", em: "🥬", hint: "KAP-sas" },
        { et: "ploom", sv: "plommon", em: "🫐", hint: "ploom" },
        { et: "hernes", sv: "ärta", em: "🫛", hint: "HER-nes" },
      ],
    },
    {
      id: "tunded",
      sv: "Känslor",
      et: "Tunded",
      em: "😊",
      words: [
        { et: "rõõmus", sv: "glad", em: "😄", hint: "RÕÕ-mus" },
        { et: "kurb", sv: "ledsen", em: "😢", hint: "kurb" },
        { et: "vihane", sv: "arg", em: "😠", hint: "VI-ha-ne" },
        { et: "väsinud", sv: "trött", em: "🥱", hint: "VÄ-si-nud" },
        { et: "üllatunud", sv: "förvånad", em: "😲", hint: "ÜL-la-tu-nud" },
        { et: "hirmul", sv: "rädd", em: "😨", hint: "HIR-mul" },
        { et: "näljane", sv: "hungrig", em: "😋", hint: "NÄL-ja-ne" },
        { et: "janune", sv: "törstig", em: "🥤", hint: "JA-nu-ne" },
        { et: "armunud", sv: "kär", em: "😍", hint: "AR-mu-nud" },
        { et: "uhke", sv: "stolt", em: "😎", hint: "UH-ke" },
        { et: "häbelik", sv: "blyg", em: "😳", hint: "HÄ-be-lik" },
        { et: "igav", sv: "uttråkad", em: "😑", hint: "I-gav" },
        { et: "õnnelik", sv: "lycklig", em: "🥰", hint: "ÕN-ne-lik" },
        { et: "mures", sv: "orolig", em: "😟", hint: "MU-res" },
        { et: "tugev", sv: "stark", em: "💪", hint: "TU-gev" },
        { et: "julge", sv: "modig", em: "🦁", hint: "JUL-ge" },
        { et: "elevil", sv: "uppspelt", em: "🤩", hint: "E-le-vil" },
        { et: "rahulik", sv: "lugn", em: "😌", hint: "RA-hu-lik" },
      ],
    },
    {
      id: "mang",
      sv: "Leka och sporta",
      et: "Mäng ja sport",
      em: "⚽",
      words: [
        { et: "pall", sv: "boll", em: "⚽", hint: "pall" },
        { et: "nukk", sv: "docka", em: "🪆", hint: "nukk" },
        { et: "klotsid", sv: "klossar", em: "🧱", hint: "KLOT-sid" },
        { et: "karumõmm", sv: "nallebjörn", em: "🧸", hint: "KA-ru-mõmm" },
        { et: "lohe", sv: "drake", em: "🪁", hint: "LO-he" },
        { et: "ujuma", sv: "simma", em: "🏊", hint: "U-ju-ma" },
        { et: "suusatama", sv: "åka skidor", em: "🎿", hint: "SUU-sa-ta-ma" },
        { et: "uisutama", sv: "åka skridskor", em: "⛸️", hint: "UI-su-ta-ma" },
        { et: "korvpall", sv: "basket", em: "🏀", hint: "KORV-pall" },
        { et: "tennis", sv: "tennis", em: "🎾", hint: "TEN-nis" },
        { et: "male", sv: "schack", em: "♟️", hint: "MA-le" },
        { et: "kaardid", sv: "spelkort", em: "🃏", hint: "KAAR-did" },
        { et: "pusle", sv: "pussel", em: "🧩", hint: "PUS-le" },
        { et: "võimlema", sv: "gympa", em: "🤸", hint: "VÕIM-le-ma" },
        { et: "kelgutama", sv: "åka pulka", em: "🛷", hint: "KEL-gu-ta-ma" },
        { et: "ronima", sv: "klättra", em: "🧗", hint: "RO-ni-ma" },
        { et: "mäng", sv: "spel", em: "🎲", hint: "mäng" },
        { et: "võit", sv: "vinst", em: "🏆", hint: "võit" },
        { et: "kiik", sv: "gunga", em: "🛝", hint: "kiik" },
        { et: "liumägi", sv: "rutschkana", em: "🛝", hint: "LI-u-mä-gi" },
        { et: "peitus", sv: "kurragömma", em: "🙈", hint: "PEI-tus" },
      ],
    },
    {
      id: "loodus",
      sv: "Ute i naturen",
      et: "Loodus",
      em: "🌳",
      words: [
        { et: "päike", sv: "sol", em: "☀️", hint: "PÄJ-ke" },
        { et: "vihm", sv: "regn", em: "🌧️", hint: "vihm" },
        { et: "lumi", sv: "snö", em: "❄️", hint: "LU-mi" },
        { et: "tuul", sv: "vind", em: "💨", hint: "tuul" },
        { et: "puu", sv: "träd", em: "🌳", hint: "puu" },
        { et: "lill", sv: "blomma", em: "🌸", hint: "lill" },
        { et: "meri", sv: "hav", em: "🌊", hint: "ME-ri" },
        { et: "mets", sv: "skog", em: "🌲", hint: "mets" },
        { et: "pilv", sv: "moln", em: "☁️", hint: "pilv" },
        { et: "äike", sv: "åska", em: "⛈️", hint: "ÄI-ke" },
        { et: "vikerkaar", sv: "regnbåge", em: "🌈", hint: "VI-ker-kaar" },
        { et: "järv", sv: "sjö", em: "🏞️", hint: "järv" },
        { et: "mägi", sv: "berg", em: "⛰️", hint: "MÄ-gi" },
        { et: "kivi", sv: "sten", em: "🪨", hint: "KI-vi" },
        { et: "täht", sv: "stjärna", em: "⭐", hint: "täht" },
        { et: "kuu", sv: "måne", em: "🌙", hint: "kuu" },
        { et: "muru", sv: "gräsmatta", em: "🌱", hint: "MU-ru" },
        { et: "liiv", sv: "sand", em: "🏖️", hint: "liiv" },
        { et: "oks", sv: "gren", em: "🌿", hint: "oks" },
      ],
    },
    {
      id: "kysimus",
      sv: "Fråga saker",
      et: "Küsimused",
      em: "❓",
      words: [
        { et: "kes", sv: "vem", em: "🙋", hint: "kes" },
        { et: "mis", sv: "vad", em: "❓", hint: "mis" },
        { et: "kus", sv: "var", em: "📍", hint: "kus" },
        { et: "kuhu", sv: "vart", em: "➡️", hint: "KU-hu" },
        { et: "kust", sv: "varifrån", em: "⬅️", hint: "kust" },
        { et: "millal", sv: "när", em: "⏰", hint: "MIL-lal" },
        { et: "miks", sv: "varför", em: "🤔", hint: "miks" },
        { et: "kuidas", sv: "hur", em: "🧭", hint: "KUI-das" },
        { et: "kui palju", sv: "hur mycket", em: "🧮", hint: "kui PAL-ju" },
        { et: "kumb", sv: "vilken av två", em: "⚖️", hint: "kumb" },
        { et: "kelle", sv: "vems", em: "🏷️", hint: "KEL-le" },
        { et: "kas", sv: "frågeordet kas", em: "❔", hint: "kas" },
      ],
    },
    {
      id: "minasina",
      sv: "Jag och du",
      et: "Mina ja sina",
      em: "👥",
      words: [
        { et: "mina", sv: "jag", em: "🙂", hint: "MI-na" },
        { et: "sina", sv: "du", em: "👉", hint: "SI-na" },
        { et: "tema", sv: "han eller hon", em: "🧑", hint: "TE-ma" },
        { et: "meie", sv: "vi", em: "👥", hint: "MEI-e" },
        { et: "teie", sv: "ni", em: "👫", hint: "TEI-e" },
        { et: "nemad", sv: "de", em: "👨‍👩‍👧‍👦", hint: "NE-mad" },
        { et: "minu", sv: "min", em: "🫰", hint: "MI-nu" },
        { et: "sinu", sv: "din", em: "🤝", hint: "SI-nu" },
        { et: "see", sv: "den här", em: "👇", hint: "see" },
        { et: "too", sv: "den där", em: "👆", hint: "too" },
        { et: "ise", sv: "själv", em: "🪞", hint: "I-se" },
        { et: "koos", sv: "tillsammans", em: "🤗", hint: "koos" },
      ],
    },
    {
      id: "suurnum",
      sv: "Stora tal",
      et: "Suured numbrid",
      em: "🔢",
      words: [
        { et: "üksteist", sv: "elva", em: "11", hint: "ÜKS-teist" },
        { et: "kaksteist", sv: "tolv", em: "12", hint: "KAKS-teist" },
        { et: "kolmteist", sv: "tretton", em: "13", hint: "KOLM-teist" },
        { et: "viisteist", sv: "femton", em: "15", hint: "VIIS-teist" },
        { et: "kakskümmend", sv: "tjugo", em: "20", hint: "KAKS-küm-mend" },
        { et: "kolmkümmend", sv: "trettio", em: "30", hint: "KOLM-küm-mend" },
        { et: "nelikümmend", sv: "fyrtio", em: "40", hint: "NE-li-küm-mend" },
        { et: "viiskümmend", sv: "femtio", em: "50", hint: "VIIS-küm-mend" },
        { et: "kuuskümmend", sv: "sextio", em: "60", hint: "KUUS-küm-mend" },
        { et: "seitsekümmend", sv: "sjuttio", em: "70", hint: "SEIT-se-küm-mend" },
        { et: "üheksakümmend", sv: "nittio", em: "90", hint: "Ü-hek-sa-küm-mend" },
        { et: "tuhat", sv: "tusen", em: "1000", hint: "TU-hat" },
      ],
    },
    {
      id: "aeg",
      sv: "Dagar och tid",
      et: "Aeg",
      em: "📅",
      words: [
        { et: "esmaspäev", sv: "måndag", em: "E", hint: "ES-mas-päev" },
        { et: "teisipäev", sv: "tisdag", em: "T", hint: "TEI-si-päev" },
        { et: "kolmapäev", sv: "onsdag", em: "K", hint: "KOL-ma-päev" },
        { et: "neljapäev", sv: "torsdag", em: "N", hint: "NEL-ja-päev" },
        { et: "reede", sv: "fredag", em: "R", hint: "REE-de" },
        { et: "laupäev", sv: "lördag", em: "L", hint: "LAU-päev" },
        { et: "pühapäev", sv: "söndag", em: "P", hint: "PÜ-ha-päev" },
        { et: "hommik", sv: "morgon", em: "🌅", hint: "HOM-mik" },
        { et: "õhtu", sv: "kväll", em: "🌆", hint: "ÕH-tu" },
        { et: "nädal", sv: "vecka", em: "📅", hint: "NÄ-dal" },
        { et: "aasta", sv: "år", em: "🗓️", hint: "AAS-ta" },
        { et: "kell", sv: "klocka", em: "⏰", hint: "kell" },
      ],
    },
    {
      id: "jahei",
      sv: "Ja och nej",
      et: "Jah ja ei",
      em: "✅",
      words: [
        { et: "jah", sv: "ja", em: "✅", hint: "jah" },
        { et: "ei", sv: "nej", em: "❌", hint: "ei" },
        { et: "ei ole", sv: "är inte", em: "🚫", hint: "ei O-le" },
        { et: "pole", sv: "finns inte", em: "⛔", hint: "PO-le" },
        { et: "mitte", sv: "inte", em: "✖️", hint: "MIT-te" },
        { et: "muidugi", sv: "självklart", em: "👌", hint: "MUI-du-gi" },
        { et: "võib-olla", sv: "kanske", em: "🤷", hint: "VÕIB-ol-la" },
        { et: "kindlasti", sv: "absolut", em: "💪", hint: "KIND-las-ti" },
        { et: "ära", sv: "låt bli", em: "🙅", hint: "Ä-ra" },
        { et: "tõesti", sv: "verkligen", em: "😮", hint: "TÕES-ti" },
        { et: "vale", sv: "fel", em: "❎", hint: "VA-le" },
        { et: "õige", sv: "rätt", em: "✔️", hint: "ÕI-ge" },
      ],
    },
    {
      id: "ilm",
      sv: "Vädret",
      et: "Ilm",
      em: "🌤️",
      words: [
        { et: "päike", sv: "sol", em: "☀️", hint: "PÄI-ke" },
        { et: "vihm", sv: "regn", em: "🌧️", hint: "vihm" },
        { et: "lumi", sv: "snö", em: "❄️", hint: "LU-mi" },
        { et: "torm", sv: "storm", em: "🌪️", hint: "torm" },
        { et: "külm", sv: "kallt", em: "🥶", hint: "külm" },
        { et: "soe", sv: "varmt", em: "🥵", hint: "soe" },
        { et: "udu", sv: "dimma", em: "🌫️", hint: "U-du" },
        { et: "jää", sv: "is", em: "🧊", hint: "jää" },
        { et: "äike", sv: "åska", em: "⛈️", hint: "ÄI-ke" },
        { et: "ilus ilm", sv: "fint väder", em: "🌈", hint: "I-lus ilm" },
        { et: "vihmavari", sv: "paraply", em: "☂️", hint: "VIH-ma-va-ri" },
        { et: "saabas", sv: "stövel", em: "🥾", hint: "SAA-bas" },
      ],
    },
    {
      id: "linnas",
      sv: "I staden",
      et: "Linnas",
      em: "🏙️",
      words: [
        { et: "pood", sv: "affär", em: "🏪", hint: "pood" },
        { et: "turg", sv: "torg", em: "🏬", hint: "turg" },
        { et: "apteek", sv: "apotek", em: "💊", hint: "AP-teek" },
        { et: "post", sv: "post", em: "📮", hint: "post" },
        { et: "pank", sv: "bank", em: "🏦", hint: "pank" },
        { et: "kohvik", sv: "kafé", em: "☕", hint: "KOH-vik" },
        { et: "park", sv: "park", em: "🌳", hint: "park" },
        { et: "sild", sv: "bro", em: "🌉", hint: "sild" },
        { et: "tänav", sv: "gata", em: "🛣️", hint: "TÄ-nav" },
        { et: "maja", sv: "hus", em: "🏠", hint: "MA-ja" },
        { et: "kirik", sv: "kyrka", em: "⛪", hint: "KI-rik" },
        { et: "raamatukogu", sv: "bibliotek", em: "📚", hint: "RAA-ma-tu-ko-gu" },
      ],
    },
    {
      id: "ruumis",
      sv: "Var saker är",
      et: "Kus asi on",
      em: "📍",
      words: [
        { et: "peal", sv: "på", em: "⬆️", hint: "peal" },
        { et: "all", sv: "under", em: "⬇️", hint: "all" },
        { et: "sees", sv: "inne i", em: "📦", hint: "sees" },
        { et: "kõrval", sv: "bredvid", em: "↔️", hint: "KÕR-val" },
        { et: "taga", sv: "bakom", em: "🔙", hint: "TA-ga" },
        { et: "ees", sv: "framför", em: "🔜", hint: "ees" },
        { et: "vahel", sv: "mellan", em: "↔️", hint: "VA-hel" },
        { et: "juures", sv: "vid", em: "📍", hint: "JUU-res" },
        { et: "siin", sv: "här", em: "👇", hint: "siin" },
        { et: "seal", sv: "där", em: "👉", hint: "seal" },
        { et: "üleval", sv: "uppe", em: "🔼", hint: "Ü-le-val" },
        { et: "all pool", sv: "nere", em: "🔽", hint: "all pool" },
      ],
    },
    {
      id: "suurus",
      sv: "Stort och smått",
      et: "Suur ja väike",
      em: "📏",
      words: [
        { et: "suur", sv: "stor", em: "🐘", hint: "suur" },
        { et: "väike", sv: "liten", em: "🐭", hint: "VÄI-ke" },
        { et: "pikk", sv: "lång", em: "📏", hint: "pikk" },
        { et: "lühike", sv: "kort", em: "✂️", hint: "LÜ-hi-ke" },
        { et: "raske", sv: "tung", em: "🪨", hint: "RAS-ke" },
        { et: "kerge", sv: "lätt", em: "🪶", hint: "KER-ge" },
        { et: "kiire", sv: "snabb", em: "⚡", hint: "KII-re" },
        { et: "aeglane", sv: "långsam", em: "🐌", hint: "AEG-la-ne" },
        { et: "uus", sv: "ny", em: "✨", hint: "uus" },
        { et: "vana", sv: "gammal", em: "🕰️", hint: "VA-na" },
        { et: "puhas", sv: "ren", em: "🧼", hint: "PU-has" },
        { et: "must", sv: "smutsig", em: "🫧", hint: "must" },
      ],
    },
  ];

  var CHATS = [
    {
      id: "tere",
      em: "👋",
      sv: "Säga hej",
      et: "Tere!",
      intro: { et: "Tore, et sa tulid!", sv: "Vad kul att du kom!" },
      turns: [
        {
          q: { et: "Tere! Mina olen Siiri.", sv: "Hej! Jag heter Siiri." },
          opts: [
            { et: "Tere!", sv: "Hej!" },
            { et: "Tere hommikust!", sv: "God morgon!" },
          ],
          reply: { et: "Tore sind näha!", sv: "Kul att se dig!" },
        },
        {
          q: { et: "Kuidas sul läheb?", sv: "Hur mår du?" },
          opts: [
            { et: "Hästi, aitäh!", sv: "Bra, tack!" },
            { et: "Nii ja naa.", sv: "Sådär." },
          ],
          reply: { et: "Väga hea!", sv: "Så bra!" },
        },
        {
          q: { et: "Mis sinu nimi on?", sv: "Vad heter du?" },
          opts: [
            { et: "Minu nimi on Anna.", sv: "Jag heter Anna." },
            { et: "Minu nimi on Oskar.", sv: "Jag heter Oskar." },
          ],
          reply: { et: "Väga meeldiv!", sv: "Trevligt!" },
        },
        {
          q: { et: "Kas sa räägid eesti keelt?", sv: "Talar du estniska?" },
          opts: [
            { et: "Natuke.", sv: "Lite grann." },
            { et: "Jah, ma õpin!", sv: "Ja, jag lär mig!" },
          ],
          reply: { et: "Sa oled tubli!", sv: "Du är duktig!" },
        },
        {
          q: { et: "Head aega!", sv: "Hej då!" },
          opts: [
            { et: "Head aega!", sv: "Hej då!" },
            { et: "Nägemist!", sv: "Vi ses!" },
          ],
          reply: { et: "Näeme homme!", sv: "Vi ses imorgon!" },
        },
      ],
    },
    {
      id: "loomad",
      em: "🐻",
      sv: "Om djur",
      et: "Loomadest",
      intro: { et: "Räägime loomadest!", sv: "Nu pratar vi om djur!" },
      turns: [
        {
          q: { et: "Kas sulle meeldivad loomad?", sv: "Gillar du djur?" },
          opts: [
            { et: "Jah, väga!", sv: "Ja, jättemycket!" },
            { et: "Natuke.", sv: "Lite grann." },
          ],
          reply: { et: "Mina olen siil.", sv: "Jag är en igelkott." },
        },
        {
          q: { et: "Kas sul on kodus loom?", sv: "Har du något djur hemma?" },
          opts: [
            { et: "Mul on koer.", sv: "Jag har en hund." },
            { et: "Mul on kass.", sv: "Jag har en katt." },
          ],
          reply: { et: "Kui tore!", sv: "Vad roligt!" },
        },
        {
          q: { et: "Kuidas ütleb kass?", sv: "Vad säger katten?" },
          opts: [
            { et: "Kass ütleb mjäu.", sv: "Katten säger mjau." },
            { et: "Kass ütleb auh.", sv: "Katten säger voff." },
          ],
          reply: { et: "Kass ütleb mjäu!", sv: "Katten säger mjau!" },
        },
        {
          q: { et: "Kas karu on suur või väike?", sv: "Är björnen stor eller liten?" },
          opts: [
            { et: "Karu on suur.", sv: "Björnen är stor." },
            { et: "Karu on väike.", sv: "Björnen är liten." },
          ],
          reply: { et: "Karu on väga suur!", sv: "Björnen är jättestor!" },
        },
      ],
    },
    {
      id: "toit",
      em: "🍎",
      sv: "Om mat",
      et: "Toidust",
      intro: { et: "Mulle meeldib süüa!", sv: "Jag gillar att äta!" },
      turns: [
        {
          q: { et: "Kas sa oled näljane?", sv: "Är du hungrig?" },
          opts: [
            { et: "Jah, ma olen näljane.", sv: "Ja, jag är hungrig." },
            { et: "Ei, ma olen söönud.", sv: "Nej, jag har ätit." },
          ],
          reply: { et: "Lähme sööma!", sv: "Nu går vi och äter!" },
        },
        {
          q: { et: "Mis sulle maitseb?", sv: "Vad tycker du är gott?" },
          opts: [
            { et: "Mulle maitseb leib.", sv: "Jag gillar bröd." },
            { et: "Mulle maitseb jäätis.", sv: "Jag gillar glass." },
          ],
          reply: { et: "Mmm, väga hea!", sv: "Mmm, jättegott!" },
        },
        {
          q: { et: "Kas sa jood piima?", sv: "Dricker du mjölk?" },
          opts: [
            { et: "Jah, ma joon piima.", sv: "Ja, jag dricker mjölk." },
            { et: "Ei, ma joon vett.", sv: "Nej, jag dricker vatten." },
          ],
          reply: { et: "Tubli!", sv: "Duktigt!" },
        },
        {
          q: { et: "Mis värvi on õun?", sv: "Vilken färg har äpplet?" },
          opts: [
            { et: "Õun on punane.", sv: "Äpplet är rött." },
            { et: "Õun on sinine.", sv: "Äpplet är blått." },
          ],
          reply: { et: "Õun on punane ja magus!", sv: "Äpplet är rött och sött!" },
        },
      ],
    },
    {
      id: "varvid",
      em: "🎨",
      sv: "Om färger",
      et: "Värvidest",
      intro: { et: "Vaatame värve!", sv: "Nu tittar vi på färger!" },
      turns: [
        {
          q: { et: "Mis värvi on taevas?", sv: "Vilken färg har himlen?" },
          opts: [
            { et: "Taevas on sinine.", sv: "Himlen är blå." },
            { et: "Taevas on roheline.", sv: "Himlen är grön." },
          ],
          reply: { et: "Taevas on sinine!", sv: "Himlen är blå!" },
        },
        {
          q: { et: "Mis värvi on mets?", sv: "Vilken färg har skogen?" },
          opts: [
            { et: "Mets on roheline.", sv: "Skogen är grön." },
            { et: "Mets on kollane.", sv: "Skogen är gul." },
          ],
          reply: { et: "Mets on roheline!", sv: "Skogen är grön!" },
        },
        {
          q: { et: "Mis on sinu lemmikvärv?", sv: "Vilken är din favoritfärg?" },
          opts: [
            { et: "Minu lemmikvärv on punane.", sv: "Min favoritfärg är röd." },
            { et: "Minu lemmikvärv on kollane.", sv: "Min favoritfärg är gul." },
          ],
          reply: { et: "Väga ilus värv!", sv: "Vilken fin färg!" },
        },
        {
          q: { et: "Mis värvi on lumi?", sv: "Vilken färg har snön?" },
          opts: [
            { et: "Lumi on valge.", sv: "Snön är vit." },
            { et: "Lumi on must.", sv: "Snön är svart." },
          ],
          reply: { et: "Lumi on valge ja külm!", sv: "Snön är vit och kall!" },
        },
      ],
    },
    {
      id: "mina",
      em: "🏡",
      sv: "Om dig",
      et: "Sinust",
      intro: { et: "Ma tahan sind tundma õppida!", sv: "Jag vill lära känna dig!" },
      turns: [
        {
          q: { et: "Kui vana sa oled?", sv: "Hur gammal är du?" },
          opts: [
            { et: "Ma olen kaheksa.", sv: "Jag är åtta." },
            { et: "Ma olen kümme.", sv: "Jag är tio." },
          ],
          reply: { et: "Sa oled juba suur!", sv: "Du är redan stor!" },
        },
        {
          q: { et: "Kas sul on õde või vend?", sv: "Har du en syster eller en bror?" },
          opts: [
            { et: "Mul on õde.", sv: "Jag har en syster." },
            { et: "Mul on vend.", sv: "Jag har en bror." },
          ],
          reply: { et: "Kui tore!", sv: "Vad roligt!" },
        },
        {
          q: { et: "Kus sa elad?", sv: "Var bor du?" },
          opts: [
            { et: "Ma elan Rootsis.", sv: "Jag bor i Sverige." },
            { et: "Ma elan Eestis.", sv: "Jag bor i Estland." },
          ],
          reply: { et: "Väga hea!", sv: "Så bra!" },
        },
        {
          q: { et: "Mida sa täna teed?", sv: "Vad gör du idag?" },
          opts: [
            { et: "Ma mängin.", sv: "Jag leker." },
            { et: "Ma õpin eesti keelt.", sv: "Jag lär mig estniska." },
          ],
          reply: { et: "See on väga tore!", sv: "Det är jättekul!" },
        },
      ],
    },
    {
      id: "koolis",
      em: "🎒",
      sv: "Om skolan",
      et: "Koolist",
      intro: { et: "Räägime koolist!", sv: "Nu pratar vi om skolan!" },
      turns: [
        {
          q: { et: "Kas sa käid koolis?", sv: "Går du i skolan?" },
          opts: [
            { et: "Jah, ma käin koolis.", sv: "Ja, jag går i skolan." },
            { et: "Ei, ma olen kodus.", sv: "Nej, jag är hemma." },
          ],
          reply: { et: "Kool on tore koht!", sv: "Skolan är ett fint ställe!" },
        },
        {
          q: { et: "Mis on sinu lemmikaine?", sv: "Vilket är ditt favoritämne?" },
          opts: [
            { et: "Mulle meeldib joonistada.", sv: "Jag gillar att rita." },
            { et: "Mulle meeldib lugeda.", sv: "Jag gillar att läsa." },
          ],
          reply: { et: "Väga hea valik!", sv: "Vilket bra val!" },
        },
        {
          q: { et: "Kas sul on koolikott?", sv: "Har du en skolväska?" },
          opts: [
            { et: "Jah, mul on kott.", sv: "Ja, jag har en väska." },
            { et: "Mul on seljakott.", sv: "Jag har en ryggsäck." },
          ],
          reply: { et: "Ära unusta raamatut!", sv: "Glöm inte boken!" },
        },
        {
          q: { et: "Kes on sinu õpetaja?", sv: "Vem är din lärare?" },
          opts: [
            { et: "Minu õpetaja on tore.", sv: "Min lärare är snäll." },
            { et: "Mul on kaks õpetajat.", sv: "Jag har två lärare." },
          ],
          reply: { et: "Tubli õpetaja!", sv: "Vilken bra lärare!" },
        },
      ],
    },
    {
      id: "ilm",
      em: "🌦️",
      sv: "Om vädret",
      et: "Ilmast",
      intro: { et: "Vaatame, milline ilm on!", sv: "Vi tittar på vädret!" },
      turns: [
        {
          q: { et: "Milline ilm täna on?", sv: "Hur är vädret idag?" },
          opts: [
            { et: "Päike paistab.", sv: "Solen skiner." },
            { et: "Sajab vihma.", sv: "Det regnar." },
          ],
          reply: { et: "Nii on!", sv: "Så är det!" },
        },
        {
          q: { et: "Kas sul on külm?", sv: "Fryser du?" },
          opts: [
            { et: "Jah, mul on külm.", sv: "Ja, jag fryser." },
            { et: "Ei, mul on soe.", sv: "Nej, jag har det varmt." },
          ],
          reply: { et: "Pane müts pähe!", sv: "Sätt på dig mössan!" },
        },
        {
          q: { et: "Kas sulle meeldib lumi?", sv: "Gillar du snö?" },
          opts: [
            { et: "Jah, ma armastan lund.", sv: "Ja, jag älskar snö." },
            { et: "Mulle meeldib suvi.", sv: "Jag gillar sommaren." },
          ],
          reply: { et: "Talv on ilus!", sv: "Vintern är vacker!" },
        },
        {
          q: { et: "Mida sa teed vihmaga?", sv: "Vad gör du när det regnar?" },
          opts: [
            { et: "Ma loen raamatut.", sv: "Jag läser en bok." },
            { et: "Ma mängin kodus.", sv: "Jag leker hemma." },
          ],
          reply: { et: "Hea mõte!", sv: "Bra idé!" },
        },
      ],
    },
    {
      id: "kodu",
      em: "🏠",
      sv: "Om hemma",
      et: "Kodust",
      intro: { et: "Räägime sinu kodust!", sv: "Nu pratar vi om ditt hem!" },
      turns: [
        {
          q: { et: "Kas sa elad majas?", sv: "Bor du i ett hus?" },
          opts: [
            { et: "Jah, ma elan majas.", sv: "Ja, jag bor i ett hus." },
            { et: "Ma elan korteris.", sv: "Jag bor i en lägenhet." },
          ],
          reply: { et: "Kodu on kõige parem!", sv: "Hemma är bäst!" },
        },
        {
          q: { et: "Mis värvi on sinu tuba?", sv: "Vilken färg har ditt rum?" },
          opts: [
            { et: "Minu tuba on sinine.", sv: "Mitt rum är blått." },
            { et: "Minu tuba on valge.", sv: "Mitt rum är vitt." },
          ],
          reply: { et: "Kui ilus!", sv: "Vad fint!" },
        },
        {
          q: { et: "Kas sul on oma voodi?", sv: "Har du en egen säng?" },
          opts: [
            { et: "Jah, mul on oma voodi.", sv: "Ja, jag har en egen säng." },
            { et: "Ma magan õega.", sv: "Jag sover med min syster." },
          ],
          reply: { et: "Maga hästi!", sv: "Sov gott!" },
        },
        {
          q: { et: "Kes teeb teil süüa?", sv: "Vem lagar mat hos er?" },
          opts: [
            { et: "Ema teeb süüa.", sv: "Mamma lagar mat." },
            { et: "Isa teeb süüa.", sv: "Pappa lagar mat." },
          ],
          reply: { et: "Mmm, kui hea lõhn!", sv: "Mmm, vad det luktar gott!" },
        },
      ],
    },
  ];

  var TRIP = [
    {
      id: "tallinn",
      et: "Tallinn",
      sv: "Tallinn",
      x: 153.4,
      y: 26.1,
      em: "🏰",
      fact: "Tallinns gamla stan är en av Europas bäst bevarade medeltidsstäder. Stadsmuren har kvar tjugo torn.",
      words: [
        { et: "vanalinn", sv: "gamla stan", em: "🏘️", hint: "VA-na-linn" },
        { et: "torn", sv: "torn", em: "🗼", hint: "torn" },
        { et: "sadam", sv: "hamn", em: "⚓", hint: "SA-dam" },
      ],
    },
    {
      id: "lahemaa",
      et: "Lahemaa",
      sv: "Lahemaa nationalpark",
      x: 202.2,
      y: 20.0,
      em: "🌲",
      fact: "Estlands största nationalpark. Här finns älgar, björnar och stora mossar man går på i träskor av trä.",
      words: [
        { et: "rahvuspark", sv: "nationalpark", em: "🏞️", hint: "RAH-vus-park" },
        { et: "raba", sv: "mosse", em: "🪵", hint: "RA-ba" },
        { et: "põder", sv: "älg", em: "🫎", hint: "PÕ-der" },
      ],
    },
    {
      id: "narva",
      et: "Narva",
      sv: "Narva",
      x: 311.0,
      y: 31.2,
      em: "🏯",
      fact: "Vid floden står en borg från 1200-talet. På andra sidan vattnet ligger Ryssland — man ser dit från muren.",
      words: [
        { et: "jõgi", sv: "flod", em: "🏞️", hint: "JÕ-gi" },
        { et: "kindlus", sv: "fästning, borg", em: "🏯", hint: "KIND-lus" },
        { et: "piir", sv: "gräns", em: "🚧", hint: "piir" },
      ],
    },
    {
      id: "tartu",
      et: "Tartu",
      sv: "Tartu",
      x: 245.4,
      y: 120.8,
      em: "🎓",
      fact: "Estlands studentstad. Universitetet grundades 1632 och staden kallas ofta för landets tankesmedja.",
      words: [
        { et: "ülikool", sv: "universitet", em: "🎓", hint: "Ü-li-kool" },
        { et: "raamatukogu", sv: "bibliotek", em: "📚", hint: "RAA-ma-tu-ko-gu" },
        { et: "tudeng", sv: "student", em: "🧑‍🎓", hint: "TU-deng" },
      ],
    },
    {
      id: "polva",
      et: "Põlva",
      sv: "Põlva",
      x: 260.8,
      y: 149.1,
      ly: -13,
      lx: 12,
      em: "⛪",
      fact: "Namnet kommer från ordet põlv, knä. Sägnen säger att kyrkan byggdes där man knäböjde. Runtom ligger åkrar och skogsfestivalen Intsikurmu.",
      words: [
        { et: "põld", sv: "åker", em: "🌾", hint: "põld" },
        { et: "kirik", sv: "kyrka", em: "⛪", hint: "KI-rik" },
        { et: "sild", sv: "bro", em: "🌉", hint: "sild" },
      ],
    },
    {
      id: "setomaa",
      et: "Setomaa",
      sv: "Setomaa",
      x: 280.4,
      y: 165.3,
      ly: 22,
      lx: 8,
      em: "🪗",
      fact: "Här bor seto-folket med eget språk och en sångtradition som heter leelo. Unesco skyddar den.",
      words: [
        { et: "laul", sv: "sång", em: "🎶", hint: "laul" },
        { et: "rahvariided", sv: "folkdräkt", em: "👘", hint: "RAH-va-rii-ded" },
        { et: "leelo", sv: "setosång", em: "🪗", hint: "LEE-lo" },
      ],
    },
    {
      id: "otepaa",
      et: "Otepää",
      sv: "Otepää",
      x: 234.6,
      y: 149.4,
      ly: -2,
      lx: -24,
      em: "🎿",
      fact: "Estlands vinterhuvudstad. Här är det kuperat och alla åker skidor, kälke och skridskor på sjöarna.",
      words: [
        { et: "suusarada", sv: "skidspår", em: "🎿", hint: "SUU-sa-ra-da" },
        { et: "küngas", sv: "kulle", em: "⛰️", hint: "KÜN-gas" },
        { et: "kelk", sv: "kälke", em: "🛷", hint: "kelk" },
      ],
    },
    {
      id: "viljandi",
      et: "Viljandi",
      sv: "Viljandi",
      x: 192.4,
      y: 122.0,
      em: "🎻",
      fact: "Varje sommar fylls slottsruinen av folkmusik. Festivalen är en av Estlands största.",
      words: [
        { et: "muusika", sv: "musik", em: "🎶", hint: "MUU-si-ka" },
        { et: "varemed", sv: "ruiner", em: "🏚️", hint: "VA-re-med" },
        { et: "pill", sv: "instrument", em: "🎻", hint: "pill" },
      ],
    },
    {
      id: "parnu",
      et: "Pärnu",
      sv: "Pärnu",
      x: 141.5,
      y: 120.0,
      em: "🏖️",
      fact: "Estlands sommarhuvudstad med en lång sandstrand. Vattnet är grunt och varmt långt ut.",
      words: [
        { et: "rand", sv: "strand", em: "🏖️", hint: "rand" },
        { et: "liiv", sv: "sand", em: "🏝️", hint: "liiv" },
        { et: "purjekas", sv: "segelbåt", em: "⛵", hint: "PUR-je-kas" },
      ],
    },
    {
      id: "haapsalu",
      et: "Haapsalu",
      sv: "Haapsalu",
      x: 97.0,
      y: 70.2,
      em: "👻",
      fact: "En gammal kurort där man badar i gyttja. I borgens fönster sägs Vita damen visa sig i augusti.",
      words: [
        { et: "raudtee", sv: "järnväg", em: "🚉", hint: "RAUD-tee" },
        { et: "muda", sv: "gyttja", em: "🛁", hint: "MU-da" },
        { et: "kummitus", sv: "spöke", em: "👻", hint: "KUM-mi-tus" },
      ],
    },
    {
      id: "kuressaare",
      et: "Kuressaare",
      sv: "Kuressaare på Saaremaa",
      x: 47.9,
      y: 131.9,
      ly: -14,
      em: "🏛️",
      fact: "Huvudstaden på Saaremaa, Estlands största ö. Biskopsborgen från 1300-talet står kvar med vallgrav runt om, och inte långt bort ligger sjön Kaali i en meteoritkrater.",
      words: [
        { et: "loss", sv: "slott", em: "🏛️", hint: "loss" },
        { et: "tuulik", sv: "väderkvarn", em: "🌬️", hint: "TUU-lik" },
        { et: "vallikraav", sv: "vallgrav", em: "🕳️", hint: "VAL-li-kraav" },
      ],
    },
    {
      id: "rakvere",
      et: "Rakvere",
      sv: "Rakvere",
      x: 238.0,
      y: 44.0,
      em: "🐂",
      fact: "Utanför borgen står en jättelik uroxe i brons. Den är Estlands största djurstaty — sex meter lång.",
      words: [
        { et: "härg", sv: "oxe", em: "🐂", hint: "härg" },
        { et: "loss", sv: "slott", em: "🏰", hint: "loss" },
        { et: "kuju", sv: "staty", em: "🗿", hint: "KU-ju" },
      ],
    },
    {
      id: "johvi",
      et: "Jõhvi",
      sv: "Jõhvi",
      x: 287.0,
      y: 40.0,
      em: "⛏️",
      fact: "I nordost bryts oljeskiffer ur marken. Gruvmuseet låter dig åka ner i en riktig gruvgång.",
      words: [
        { et: "kaevandus", sv: "gruva", em: "⛏️", hint: "KAE-van-dus" },
        { et: "kivi", sv: "sten", em: "🪨", hint: "KI-vi" },
        { et: "tuli", sv: "eld", em: "🔥", hint: "TU-li" },
      ],
    },
    {
      id: "peipsi",
      et: "Peipsi",
      sv: "Peipsi-sjön",
      x: 296.0,
      y: 96.0,
      em: "🐟",
      fact: "Europas fjärde största sjö. Längs stranden ligger byar där man odlar lök i långa randiga rader.",
      words: [
        { et: "järv", sv: "sjö", em: "🏞️", hint: "järv" },
        { et: "sibul", sv: "lök", em: "🧅", hint: "SI-bul" },
        { et: "paat", sv: "båt", em: "🛶", hint: "paat" },
      ],
    },
    {
      id: "voru",
      et: "Võru",
      sv: "Võru",
      x: 276.0,
      y: 155.0,
      em: "⛰️",
      fact: "Här finns Suur Munamägi, Baltikums högsta punkt — 318 meter. Uppe i tornet ser man tre länder.",
      words: [
        { et: "mägi", sv: "berg", em: "⛰️", hint: "MÄ-gi" },
        { et: "kõrge", sv: "hög", em: "📏", hint: "KÕR-ge" },
        { et: "vaade", sv: "utsikt", em: "🔭", hint: "VAA-de" },
      ],
    },
    {
      id: "valga",
      et: "Valga",
      sv: "Valga",
      x: 218.0,
      y: 163.0,
      em: "🚧",
      fact: "Staden är delad i två av gränsen. Ena halvan heter Valga och ligger i Estland, andra heter Valka och ligger i Lettland.",
      words: [
        { et: "linn", sv: "stad", em: "🏙️", hint: "linn" },
        { et: "rong", sv: "tåg", em: "🚂", hint: "rong" },
        { et: "tee", sv: "väg", em: "🛣️", hint: "tee" },
      ],
    },
    {
      id: "paide",
      et: "Paide",
      sv: "Paide",
      x: 186.0,
      y: 76.0,
      em: "🗼",
      fact: "Mitt i Estland står ett åttkantigt torn från 1200-talet. Härifrån är det lika långt åt alla håll.",
      words: [
        { et: "kesk", sv: "mitten", em: "🎯", hint: "kesk" },
        { et: "torn", sv: "torn", em: "🗼", hint: "torn" },
        { et: "kell", sv: "klocka", em: "🕰️", hint: "kell" },
      ],
    },
    {
      id: "hiiumaa",
      et: "Hiiumaa",
      sv: "Hiiumaa",
      x: 60.0,
      y: 62.0,
      em: "🗼",
      fact: "På ön står Kõpu, en av världens äldsta fyrar som fortfarande lyser. Den har brunnit i femhundra år.",
      words: [
        { et: "saar", sv: "ö", em: "🏝️", hint: "saar" },
        { et: "tuletorn", sv: "fyr", em: "🗼", hint: "TU-le-torn" },
        { et: "meri", sv: "hav", em: "🌊", hint: "ME-ri" },
      ],
    },
    {
      id: "muhu",
      et: "Muhu",
      sv: "Muhu",
      x: 86.0,
      y: 112.0,
      em: "🧶",
      fact: "På Muhu broderar man de färggladaste folkdräkterna i hela Estland — orange, rosa och gult om vartannat.",
      words: [
        { et: "tikand", sv: "broderi", em: "🧵", hint: "TI-kand" },
        { et: "lill", sv: "blomma", em: "🌸", hint: "lill" },
        { et: "värv", sv: "färg", em: "🎨", hint: "värv" },
      ],
    },
    {
      id: "salme",
      et: "Salme",
      sv: "Salme på Saaremaa",
      x: 37.8,
      y: 142.9,
      em: "⛵",
      fact: "I Salme hittades två vikingaskepp i sanden, äldre än allt man känt till i Skandinavien. Ombord låg fyrtio krigare från Sverige.",
      words: [
        { et: "viiking", sv: "viking", em: "🛡️", hint: "VII-king" },
        { et: "paat", sv: "roddbåt", em: "🚣", hint: "paat" },
        { et: "muinasaeg", sv: "forntid", em: "🏺", hint: "MUI-nas-aeg" },
      ],
    },
  ];
  /* orter utan stopp – bara namn på kartan */
  var MAPTOWNS = [
    { et: "Rakvere", x: 228.0, y: 34.2, dy: -4 },
    { et: "Jõhvi", x: 277.2, y: 33.0, dy: -4 },
    { et: "Paide", x: 190.8, y: 75.4 },
    { et: "Rapla", x: 155.2, y: 65.5, end: true },
    { et: "Kärdla", x: 60.0, y: 65.3, end: true },
    { et: "Elva", x: 230.9, y: 134.7, end: true, dy: -3 },
    { et: "Võru", x: 258.7, y: 169.4, dy: 9 },
    { et: "Valga", x: 212.9, y: 174.5, dy: 9, end: true },
    { et: "Türi", x: 181.0, y: 83.0, end: true },
  ];
  /* varje ort har tre uppdrag och en souvenir */
  var TRIPTASKS = {
    tallinn: [
      ["words", 3],
      ["theme", 1],
      ["mix", 1],
    ],
    lahemaa: [
      ["words", 3],
      ["hear", 5],
      ["theme", 1],
    ],
    rakvere: [
      ["words", 3],
      ["mix", 2],
      ["otsi", 1],
    ],
    johvi: [
      ["words", 3],
      ["type", 5],
      ["theme", 1],
    ],
    narva: [
      ["words", 3],
      ["type", 6],
      ["mem", 1],
    ],
    peipsi: [
      ["words", 3],
      ["hear", 7],
      ["theme", 2],
    ],
    tartu: [
      ["words", 3],
      ["sent", 2],
      ["theme", 2],
    ],
    polva: [
      ["words", 3],
      ["hear", 8],
      ["mix", 2],
    ],
    voru: [
      ["words", 3],
      ["otsi", 2],
      ["theme", 2],
    ],
    setomaa: [
      ["words", 3],
      ["sent", 3],
      ["theme", 2],
    ],
    valga: [
      ["words", 3],
      ["type", 10],
      ["duel", 1],
    ],
    otepaa: [
      ["words", 3],
      ["type", 12],
      ["theme", 3],
    ],
    viljandi: [
      ["words", 3],
      ["talk", 1],
      ["theme", 3],
    ],
    paide: [
      ["words", 3],
      ["mem", 2],
      ["mix", 3],
    ],
    parnu: [
      ["words", 3],
      ["hear", 12],
      ["theme", 3],
    ],
    haapsalu: [
      ["words", 3],
      ["type", 14],
      ["otsi", 3],
    ],
    hiiumaa: [
      ["words", 3],
      ["sent", 5],
      ["theme", 4],
    ],
    muhu: [
      ["words", 3],
      ["otsi", 4],
      ["mix", 4],
    ],
    kuressaare: [
      ["words", 3],
      ["sent", 6],
      ["theme", 4],
    ],
    salme: [
      ["words", 3],
      ["hear", 16],
      ["theme", 5],
    ],
  };
  var TASKTEXT = {
    words: { em: "🎧", sv: "Lär dig ortens tre ord" },
    theme: { em: "🏁", sv: "Klara ett tema" },
    mix: { em: "🎲", sv: "Klara en runda blandade ord" },
    type: { em: "✏️", sv: "Skriv ord rätt" },
    sent: { em: "🧩", sv: "Bygg meningar rätt" },
    talk: { em: "💬", sv: "Prata klart ett samtal med Siiri" },
    hear: { em: "👂", sv: "Svara rätt på lyssningsfrågor" },
    otsi: { em: "🔍", sv: "Hitta saker i Otsi!" },
    mem: { em: "🃏", sv: "Klara en runda memory" },
    duel: { em: "⚔️", sv: "Vinn en duell" },
  };
  var SOUVENIR = {
    tallinn: "sall",
    lahemaa: "lill",
    rakvere: "myts",
    johvi: "tuli",
    narva: "kott",
    peipsi: "jaatis",
    tartu: "raamat",
    polva: "leib",
    voru: "talv",
    setomaa: "hobekee",
    valga: "lips",
    otepaa: "suusad",
    viljandi: "kannel",
    paide: "kroon",
    parnu: "ring",
    haapsalu: "vihmav",
    hiiumaa: "rukkilill",
    muhu: "mulgi",
    kuressaare: "kihnu",
    salme: "rahvas",
  };

  function tripDone() {
    if (typeof S.tripDone !== "number") {
      S.tripDone = Math.max(0, Math.min(TRIP.length - 1, themesDone()));
      save();
    }
    return S.tripDone;
  }
  var STORY = {
    tallinn:
      "Siiri har fått ett brev. Om tolv veckor är det **laulupidu**, den stora sångfesten på Tallinns sångarfält, där hundratusen människor sjunger tillsammans. Men Siiri kan bara första raden i sången. Resten måste hon samla ihop — en rad i varje ort.",
    lahemaa: "I mossen sjunger tranorna en rad som ingen skrivit ner. Siiri lär sig den av dem.",
    narva: "Vid borgen vid floden sjunger en gammal man en rad på andra sidan vattnet. Siiri ropar tillbaka den.",
    tartu: "På universitetsbiblioteket finns en dammig bok med en bortglömd vers. Siiri läser den högt.",
    polva: "Kyrkklockan i Põlva slår en melodi. Siiri skriver ner tonerna med en pinne i åkerjorden.",
    setomaa:
      "Seto-kvinnorna sjunger leelo, där en börjar och alla andra svarar. De lär Siiri en rad som är äldre än alla hus i byn.",
    otepaa: "Uppe på kullen i vinterluften ekar en rad tillbaka från skogen. Siiri tar med sig ekot.",
    viljandi:
      "På folkmusikfestivalen vid slottsruinen spelar någon precis rätt melodi på en kannel. Siiri lär sig raden på ett kvällspass.",
    parnu: "Vågorna vid Pärnu strand sjunger samma rad om och om igen. Siiri sitter i sanden tills hon kan den.",
    haapsalu: "I borgens fönster sjunger Vita damen en rad så vacker att Siiri glömmer att bli rädd.",
    kuressaare: "Väderkvarnarna på Saaremaa gnisslar i takt. Siiri hör en rad i vinden mellan vingarna.",
    rakvere:
      "Vid borgen i Rakvere råmar bronsoxen en rad så djup att marken skakar. Siiri känner den genom fötterna och lär sig den utantill.",
    johvi:
      "Djupt nere i gruvgången under Jõhvi ekar en rad mellan stenväggarna. Siiri lyssnar tills ekot blir till ord hon kan ta med sig upp.",
    peipsi:
      "Ute på Peipsi sjö gungar en fiskebåt i takt med en rad som vinden för med sig över vattnet. Siiri ror ut och fångar den i håven.",
    voru: "Uppe i tornet på Suur Munamägi ser Siiri tre länder på en gång — och en rad som svävar mellan dem och bara väntar på att plockas ner.",
    valga:
      "Mitt på gränsen mellan Valga och Valka möts en estnisk och en lettisk röst och sjunger varsin halva av samma rad. Siiri lägger ihop dem till en.",
    paide:
      "Från det åttkantiga tornet mitt i Estland hörs en rad lika starkt åt alla håll. Siiri klättrar upp och hämtar den där den ekar som mest.",
    hiiumaa:
      "Kõpu fyr har blinkat samma rad i femhundra år, en gång mörkt och en gång ljust. Siiri räknar blinkningarna tills hon kan sjunga dem.",
    muhu: "På Muhu broderar mormödrarna en rad rakt in i tygets mönster, i orange, rosa och gult. Siiri drar ett finger längs trådarna och känner orden.",
    salme:
      "I sanden vid Salme, där vikingaskeppen låg, ligger den sista raden begravd i tusen år. Siiri gräver fram den — och nu kan hon hela sången.",
  };
  function tripReached() {
    return Math.max(1, Math.min(TRIP.length, tripDone() + 1));
  }
  function tripCur() {
    return TRIP[tripReached() - 1];
  }
  function tripProg() {
    if (!S.tripP) S.tripP = {};
    var id = tripCur().id;
    if (!S.tripP[id]) S.tripP[id] = { words: [], theme: 0, mix: 0, type: 0, sent: 0, talk: 0, hear: 0 };
    return S.tripP[id];
  }
  function taskValue(kind) {
    var p = tripProg();
    if (kind === "words") {
      /* ordet räknas när det både hörts och sitter i minnet */
      var w = tripCur().words || [],
        n = 0,
        i,
        mm;
      for (i = 0; i < w.length; i++) {
        mm = (S.wordmem || {})[mkey(w[i].et, w[i].sv)];
        if (p.words.indexOf(w[i].et) >= 0 && mm && ((mm.r || 0) >= 1 || (mm.s || 0) >= 1)) n++;
      }
      return n;
    }
    return p[kind] || 0;
  }
  function tasksOf() {
    return (
      TRIPTASKS[tripCur().id] || [
        ["words", 3],
        ["theme", 1],
        ["mix", 1],
      ]
    );
  }
  function tasksLeft() {
    var t = tasksOf(),
      n = 0,
      i;
    for (i = 0; i < t.length; i++) {
      if (taskValue(t[i][0]) < t[i][1]) n++;
    }
    return n;
  }
  /* något händer på vägen mellan två orter */
  function roadStop() {
    var leg = tripReached() - 1,
      ev = roadEvent(leg),
      km = legKm(leg);
    var gain = ev.stars;
    earnStars(gain);
    addXp(12);
    save();
    refreshTop();
    var d = document.createElement("div");
    d.className = "overlay";
    d.innerHTML =
      '<div class="oc roadcard"><p class="kicker">🥾 ' +
      km +
      " km på vägen till " +
      esc(TRIP[leg].et) +
      "</p>" +
      '<span class="rem">' +
      ev.em +
      "</span>" +
      "<h3>" +
      esc(ev.et) +
      "</h3><p>" +
      esc(ev.sv) +
      "</p>" +
      '<p class="qsub">⭐ +' +
      gain * starMult() +
      "</p>" +
      '<button class="btn big wide" id="rgo">Fortsätt 🗺️</button></div>';
    document.body.appendChild(d);
    speak(ev.et);
    d.querySelector("#rgo").onclick = function () {
      d.remove();
      go(tripScreen, true);
    };
  }

  /* räkna upp ett uppdrag för den ort Siiri står på */
  function tripBump(kind, amount, word) {
    if (tripDone() >= TRIP.length) return;
    var p = tripProg();
    if (kind === "words") {
      if (word && p.words.indexOf(word) < 0) p.words.push(word);
    } else {
      p[kind] = (p[kind] || 0) + (amount || 1);
    }
    save();
    if (tasksLeft() === 0) tripAdvance();
  }
  function tripAdvance() {
    autoBackup("ny ort");
    var from = tripCur(),
      gift = SOUVENIR[from.id],
      it = itemById(gift),
      gifted = it && !owns(it.id); /* har barnet redan köpt den i butiken själv? då ges inget nytt */
    S.walkFrom = tripReached() - 1; /* varifrån hon vandrar */
    S.tripDone = Math.min(TRIP.length, tripDone() + 1);
    save();
    if (gifted) {
      if (!S.owned) S.owned = [];
      if (!S.wear) S.wear = {};
      S.owned.push(it.id);
      S.wear[it.slot] = it.id;
      save();
      applyScene();
    }
    var nx = TRIP[tripReached() - 1],
      last = tripDone() >= TRIP.length;
    fanfare(3);
    burst(200);
    setTimeout(function () {
      burst(160);
    }, 420);
    setTimeout(function () {
      var d = document.createElement("div");
      d.className = "overlay";
      d.innerHTML =
        '<div class="oc" style="border-color:var(--berry)"><p class="kicker">🎒 Alla uppdrag klara i ' +
        esc(from.et) +
        "!</p>" +
        (gifted
          ? '<div style="font-size:64px">' +
            it.em +
            "</div><h3>" +
            esc(it.et) +
            "</h3>" +
            "<p>" +
            esc(it.sv) +
            " — souvenir från " +
            esc(from.et) +
            ", gratis till marknaden</p>"
          : it
            ? '<div style="font-size:64px">' +
              it.em +
              "</div><h3>" +
              esc(it.et) +
              "</h3>" +
              "<p>" +
              esc(it.sv) +
              " — du har redan den här souveniren från " +
              esc(from.et) +
              "</p>"
            : "") +
        (last
          ? '<p class="qsub" style="margin-top:8px">Du har rest genom hela Estland!</p>'
          : '<p class="qsub" style="margin-top:8px">Siiri vandrar vidare till <b>' + esc(nx.et) + "</b>.</p>") +
        '<button class="btn big wide" id="tadv">' +
        (last ? "Till kartan 🗺️" : "Vandra vidare 🥾") +
        "</button></div>";
      document.body.appendChild(d);
      if (it) speak(it.et);
      d.querySelector("#tadv").onclick = function () {
        d.remove();
        if (last) go(tripScreen, true);
        else roadStop();
      };
    }, 600);
  }

  /* räkna upp ett uppdrag för den ort Siiri står på */
  function tripWords() {
    var out = [],
      i,
      j,
      n = tripReached();
    for (i = 0; i < n; i++) for (j = 0; j < TRIP[i].words.length; j++) out.push(TRIP[i].words[j]);
    return out;
  }

  var UI = {
    play: { et: "Mängime!", sv: "Nu spelar vi" },
    mix: { et: "Kõik sõnad", sv: "Blandade ord" },
    sent: { et: "Lauseladu", sv: "Bygg meningar" },
    talk: { et: "Jutt Siiriga", sv: "Prata med Siiri" },
    themes: { et: "Teemad", sv: "Teman" },
    shop: { et: "Laat", sv: "Marknaden" },
    words: { et: "Sõnastik", sv: "Ordlistan" },
    treasure: { et: "Aarded", sv: "Skattkammaren" },
    me: { et: "Minu profiil", sv: "Min profil" },
    trip: { et: "Teekond", sv: "Resan genom Estland" },
    bag: { et: "Üllatuskott", sv: "Överraskningspåsen" },
    next: { et: "Järgmine teema", sv: "Nästa tema" },
    hard: { et: "Harjuta raskeid sõnu", sv: "Öva svåra ord" },
    again: { et: "Veel kord", sv: "En gång till" },
  };

  var SENTENCES = [
    { et: "Mul on suur koer.", sv: "Jag har en stor hund.", w: ["Mul", "on", "suur", "koer"] },
    { et: "Kass on must.", sv: "Katten är svart.", w: ["Kass", "on", "must"] },
    { et: "Ma söön õuna.", sv: "Jag äter ett äpple.", w: ["Ma", "söön", "õuna"] },
    { et: "Isa joob vett.", sv: "Pappa dricker vatten.", w: ["Isa", "joob", "vett"] },
    { et: "Meil on kollane maja.", sv: "Vi har ett gult hus.", w: ["Meil", "on", "kollane", "maja"] },
    { et: "Väike laps magab.", sv: "Det lilla barnet sover.", w: ["Väike", "laps", "magab"] },
    { et: "Mulle meeldib jäätis.", sv: "Jag gillar glass.", w: ["Mulle", "meeldib", "jäätis"] },
    { et: "Koer jookseb metsas.", sv: "Hunden springer i skogen.", w: ["Koer", "jookseb", "metsas"] },
    { et: "Ema loeb raamatut.", sv: "Mamma läser en bok.", w: ["Ema", "loeb", "raamatut"] },
    { et: "Päike paistab täna.", sv: "Solen skiner idag.", w: ["Päike", "paistab", "täna"] },
    { et: "Minu õde laulab.", sv: "Min syster sjunger.", w: ["Minu", "õde", "laulab"] },
    { et: "Me sõidame bussiga.", sv: "Vi åker buss.", w: ["Me", "sõidame", "bussiga"] },
    { et: "Siil sööb maasikat.", sv: "Igelkotten äter en jordgubbe.", w: ["Siil", "sööb", "maasikat"] },
    { et: "Vanaisa magab diivanil.", sv: "Morfar sover i soffan.", w: ["Vanaisa", "magab", "diivanil"] },
    { et: "Kass magab diivanil.", sv: "Katten sover i soffan.", w: ["Kass", "magab", "diivanil"] },
    { et: "Ma joon piima.", sv: "Jag dricker mjölk.", w: ["Ma", "joon", "piima"] },
    { et: "Isa loeb raamatut.", sv: "Pappa läser en bok.", w: ["Isa", "loeb", "raamatut"] },
    { et: "Vanaema teeb kooki.", sv: "Mormor bakar en kaka.", w: ["Vanaema", "teeb", "kooki"] },
    { et: "Meil on väike kass.", sv: "Vi har en liten katt.", w: ["Meil", "on", "väike", "kass"] },
    { et: "Koer sööb leiba.", sv: "Hunden äter bröd.", w: ["Koer", "sööb", "leiba"] },
    { et: "Ma lähen kooli.", sv: "Jag går till skolan.", w: ["Ma", "lähen", "kooli"] },
    { et: "Õde joonistab lille.", sv: "Syster ritar en blomma.", w: ["Õde", "joonistab", "lille"] },
    { et: "Vend mängib palliga.", sv: "Bror leker med bollen.", w: ["Vend", "mängib", "palliga"] },
    { et: "Päike paistab merel.", sv: "Solen skiner över havet.", w: ["Päike", "paistab", "merel"] },
    { et: "Lumi on valge ja külm.", sv: "Snön är vit och kall.", w: ["Lumi", "on", "valge", "ja", "külm"] },
    { et: "Mul on punane müts.", sv: "Jag har en röd mössa.", w: ["Mul", "on", "punane", "müts"] },
    { et: "Ma armastan jäätist.", sv: "Jag älskar glass.", w: ["Ma", "armastan", "jäätist"] },
    { et: "Kass on väsinud.", sv: "Katten är trött.", w: ["Kass", "on", "väsinud"] },
    { et: "Laps naerab.", sv: "Barnet skrattar.", w: ["Laps", "naerab"] },
    { et: "Me sõidame rongiga.", sv: "Vi åker tåg.", w: ["Me", "sõidame", "rongiga"] },
    { et: "Isa sõidab autoga.", sv: "Pappa kör bil.", w: ["Isa", "sõidab", "autoga"] },
    { et: "Ema laulab ilusti.", sv: "Mamma sjunger vackert.", w: ["Ema", "laulab", "ilusti"] },
    { et: "Karu magab metsas.", sv: "Björnen sover i skogen.", w: ["Karu", "magab", "metsas"] },
    { et: "Lind laulab puu otsas.", sv: "Fågeln sjunger i trädet.", w: ["Lind", "laulab", "puu", "otsas"] },
    { et: "Kala ujub vees.", sv: "Fisken simmar i vattnet.", w: ["Kala", "ujub", "vees"] },
    { et: "Ma pesen käsi.", sv: "Jag tvättar händerna.", w: ["Ma", "pesen", "käsi"] },
    { et: "Mul on külm.", sv: "Jag fryser.", w: ["Mul", "on", "külm"] },
    { et: "Täna sajab vihma.", sv: "Idag regnar det.", w: ["Täna", "sajab", "vihma"] },
    { et: "Homme läheme randa.", sv: "Imorgon går vi till stranden.", w: ["Homme", "läheme", "randa"] },
    { et: "Vanaisa joob teed.", sv: "Morfar dricker te.", w: ["Vanaisa", "joob", "teed"] },
    { et: "Mulle meeldivad loomad.", sv: "Jag gillar djur.", w: ["Mulle", "meeldivad", "loomad"] },
    { et: "See on minu sõber.", sv: "Det här är min kompis.", w: ["See", "on", "minu", "sõber"] },
    { et: "Kus on minu kott?", sv: "Var är min väska?", w: ["Kus", "on", "minu", "kott"] },
    { et: "Ma olen näljane.", sv: "Jag är hungrig.", w: ["Ma", "olen", "näljane"] },
    { et: "Palun anna mulle vett.", sv: "Ge mig vatten, tack.", w: ["Palun", "anna", "mulle", "vett"] },
    { et: "Siil jookseb aias.", sv: "Igelkotten springer i trädgården.", w: ["Siil", "jookseb", "aias"] },
    { et: "Öösel on pime.", sv: "På natten är det mörkt.", w: ["Öösel", "on", "pime"] },
    { et: "Hommikul sööme putru.", sv: "På morgonen äter vi gröt.", w: ["Hommikul", "sööme", "putru"] },
    { et: "Mets on roheline.", sv: "Skogen är grön.", w: ["Mets", "on", "roheline"] },
    { et: "Mul on kaks õde.", sv: "Jag har två systrar.", w: ["Mul", "on", "kaks", "õde"] },
    { et: "Kus on koer?", sv: "Var är hunden?", w: ["Kus", "on", "koer"] },
    { et: "Mis see on?", sv: "Vad är det här?", w: ["Mis", "see", "on"] },
    { et: "Kes seal on?", sv: "Vem är där?", w: ["Kes", "seal", "on"] },
    { et: "Mul ei ole kassi.", sv: "Jag har ingen katt.", w: ["Mul", "ei", "ole", "kassi"] },
    { et: "See ei ole minu.", sv: "Det här är inte mitt.", w: ["See", "ei", "ole", "minu"] },
    { et: "Ma ei tea.", sv: "Jag vet inte.", w: ["Ma", "ei", "tea"] },
    { et: "Millal me läheme?", sv: "När går vi?", w: ["Millal", "me", "läheme"] },
    { et: "Kui palju kell on?", sv: "Vad är klockan?", w: ["Kui", "palju", "kell", "on"] },
    { et: "Kell on kolm.", sv: "Klockan är tre.", w: ["Kell", "on", "kolm"] },
    { et: "Mina olen Siiri.", sv: "Jag är Siiri.", w: ["Mina", "olen", "Siiri"] },
    { et: "Sina oled tubli.", sv: "Du är duktig.", w: ["Sina", "oled", "tubli"] },
    { et: "Meil on kaks koera.", sv: "Vi har två hundar.", w: ["Meil", "on", "kaks", "koera"] },
    { et: "Koerad jooksevad.", sv: "Hundarna springer.", w: ["Koerad", "jooksevad"] },
    { et: "Lapsed mängivad.", sv: "Barnen leker.", w: ["Lapsed", "mängivad"] },
    { et: "Ma ei taha magada.", sv: "Jag vill inte sova.", w: ["Ma", "ei", "taha", "magada"] },
    { et: "Kas sa tuled?", sv: "Kommer du?", w: ["Kas", "sa", "tuled"] },
    { et: "Miks sa naerad?", sv: "Varför skrattar du?", w: ["Miks", "sa", "naerad"] },
    { et: "Kuidas sul läheb?", sv: "Hur mår du?", w: ["Kuidas", "sul", "läheb"] },
    { et: "Täna on esmaspäev.", sv: "Idag är det måndag.", w: ["Täna", "on", "esmaspäev"] },
    { et: "Homme on laupäev.", sv: "Imorgon är det lördag.", w: ["Homme", "on", "laupäev"] },
    { et: "Täna sajab vihma.", sv: "Idag regnar det.", w: ["Täna", "sajab", "vihma"] },
    { et: "Päike paistab.", sv: "Solen skiner.", w: ["Päike", "paistab"] },
    { et: "Väljas on külm.", sv: "Det är kallt ute.", w: ["Väljas", "on", "külm"] },
    { et: "Mul on uus müts.", sv: "Jag har en ny mössa.", w: ["Mul", "on", "uus", "müts"] },
    { et: "Ema teeb suppi.", sv: "Mamma lagar soppa.", w: ["Ema", "teeb", "suppi"] },
    { et: "Isa loeb raamatut.", sv: "Pappa läser en bok.", w: ["Isa", "loeb", "raamatut"] },
    { et: "Koer magab diivanil.", sv: "Hunden sover på soffan.", w: ["Koer", "magab", "diivanil"] },
    { et: "Kass istub aknal.", sv: "Katten sitter i fönstret.", w: ["Kass", "istub", "aknal"] },
    { et: "Ma lähen kooli.", sv: "Jag går till skolan.", w: ["Ma", "lähen", "kooli"] },
    { et: "Me mängime õues.", sv: "Vi leker ute.", w: ["Me", "mängime", "õues"] },
    { et: "Vend joonistab pilti.", sv: "Brorsan ritar en bild.", w: ["Vend", "joonistab", "pilti"] },
    { et: "Õde laulab laulu.", sv: "Syrran sjunger en sång.", w: ["Õde", "laulab", "laulu"] },
    { et: "Raamat on laual.", sv: "Boken ligger på bordet.", w: ["Raamat", "on", "laual"] },
    { et: "Pall on tooli all.", sv: "Bollen är under stolen.", w: ["Pall", "on", "tooli", "all"] },
    { et: "Kruus on kapis.", sv: "Muggen är i skåpet.", w: ["Kruus", "on", "kapis"] },
    { et: "Lill on akna peal.", sv: "Blomman står i fönstret.", w: ["Lill", "on", "akna", "peal"] },
    { et: "Ma olen väsinud.", sv: "Jag är trött.", w: ["Ma", "olen", "väsinud"] },
    { et: "Sa oled tubli.", sv: "Du är duktig.", w: ["Sa", "oled", "tubli"] },
    { et: "Mul on kõht tühi.", sv: "Jag är hungrig.", w: ["Mul", "on", "kõht", "tühi"] },
    { et: "Mul on janu.", sv: "Jag är törstig.", w: ["Mul", "on", "janu"] },
    { et: "Kus on minu kott?", sv: "Var är min väska?", w: ["Kus", "on", "minu", "kott"] },
    { et: "Mis see on?", sv: "Vad är det här?", w: ["Mis", "see", "on"] },
    { et: "Kes seal on?", sv: "Vem är där?", w: ["Kes", "seal", "on"] },
    { et: "Millal me sööme?", sv: "När äter vi?", w: ["Millal", "me", "sööme"] },
    { et: "Ma tahan jäätist.", sv: "Jag vill ha glass.", w: ["Ma", "tahan", "jäätist"] },
    { et: "Kas sa tuled kaasa?", sv: "Kommer du med?", w: ["Kas", "sa", "tuled", "kaasa"] },
    { et: "Me sõidame bussiga.", sv: "Vi åker buss.", w: ["Me", "sõidame", "bussiga"] },
    { et: "Rong tuleb kell kaks.", sv: "Tåget kommer klockan två.", w: ["Rong", "tuleb", "kell", "kaks"] },
    { et: "Pood on kinni.", sv: "Affären är stängd.", w: ["Pood", "on", "kinni"] },
    { et: "Turg on avatud.", sv: "Torget är öppet.", w: ["Turg", "on", "avatud"] },
    { et: "Mul on viis õuna.", sv: "Jag har fem äpplen.", w: ["Mul", "on", "viis", "õuna"] },
    { et: "Seal on kolm koera.", sv: "Där är tre hundar.", w: ["Seal", "on", "kolm", "koera"] },
    { et: "Maja on suur ja valge.", sv: "Huset är stort och vitt.", w: ["Maja", "on", "suur", "ja", "valge"] },
    { et: "Auto on väike ja punane.", sv: "Bilen är liten och röd.", w: ["Auto", "on", "väike", "ja", "punane"] },
    { et: "Mets on roheline.", sv: "Skogen är grön.", w: ["Mets", "on", "roheline"] },
    { et: "Meri on sinine.", sv: "Havet är blått.", w: ["Meri", "on", "sinine"] },
    { et: "Lumi on valge.", sv: "Snön är vit.", w: ["Lumi", "on", "valge"] },
    { et: "Ma armastan sind.", sv: "Jag älskar dig.", w: ["Ma", "armastan", "sind"] },
    { et: "Head ööd, ema!", sv: "God natt, mamma!", w: ["Head", "ööd", "ema"] },
    { et: "Tere hommikust, isa!", sv: "God morgon, pappa!", w: ["Tere", "hommikust", "isa"] },
    { et: "Aitäh abi eest.", sv: "Tack för hjälpen.", w: ["Aitäh", "abi", "eest"] },
    { et: "Palun anna mulle vett.", sv: "Snälla ge mig vatten.", w: ["Palun", "anna", "mulle", "vett"] },
    { et: "Vabandust, ma ei tea.", sv: "Förlåt, jag vet inte.", w: ["Vabandust", "ma", "ei", "tea"] },
    { et: "Ma ei saa aru.", sv: "Jag förstår inte.", w: ["Ma", "ei", "saa", "aru"] },
    { et: "Räägi aeglasemalt.", sv: "Prata långsammare.", w: ["Räägi", "aeglasemalt"] },
    { et: "Mis su nimi on?", sv: "Vad heter du?", w: ["Mis", "su", "nimi", "on"] },
    { et: "Minu nimi on Siiri.", sv: "Jag heter Siiri.", w: ["Minu", "nimi", "on", "Siiri"] },
    {
      et: "Ma olen kaheksa aastat vana.",
      sv: "Jag är åtta år gammal.",
      w: ["Ma", "olen", "kaheksa", "aastat", "vana"],
    },
    { et: "Me elame Rootsis.", sv: "Vi bor i Sverige.", w: ["Me", "elame", "Rootsis"] },
    { et: "Vanaema elab Eestis.", sv: "Mormor bor i Estland.", w: ["Vanaema", "elab", "Eestis"] },
    { et: "Siiri jookseb kiiresti.", sv: "Siiri springer snabbt.", w: ["Siiri", "jookseb", "kiiresti"] },
    { et: "Lind laulab puu otsas.", sv: "Fågeln sjunger i trädet.", w: ["Lind", "laulab", "puu", "otsas"] },
    { et: "Kala ujub vees.", sv: "Fisken simmar i vattnet.", w: ["Kala", "ujub", "vees"] },
    { et: "Hobune sööb rohtu.", sv: "Hästen äter gräs.", w: ["Hobune", "sööb", "rohtu"] },
    { et: "Lehm annab piima.", sv: "Kon ger mjölk.", w: ["Lehm", "annab", "piima"] },
    { et: "Ma panen mütsi pähe.", sv: "Jag sätter på mig mössan.", w: ["Ma", "panen", "mütsi", "pähe"] },
    { et: "Jalad on külmad.", sv: "Fötterna är kalla.", w: ["Jalad", "on", "külmad"] },
    { et: "Käed on puhtad.", sv: "Händerna är rena.", w: ["Käed", "on", "puhtad"] },
    { et: "Mul valutab kõht.", sv: "Jag har ont i magen.", w: ["Mul", "valutab", "kõht"] },
    { et: "Ma lähen magama.", sv: "Jag går och lägger mig.", w: ["Ma", "lähen", "magama"] },
    { et: "Hommikul sööme putru.", sv: "På morgonen äter vi gröt.", w: ["Hommikul", "sööme", "putru"] },
    { et: "Õhtul vaatame filmi.", sv: "På kvällen ser vi en film.", w: ["Õhtul", "vaatame", "filmi"] },
    { et: "Laupäeval lähme ujuma.", sv: "På lördag ska vi bada.", w: ["Laupäeval", "lähme", "ujuma"] },
    { et: "Suvel on soe.", sv: "På sommaren är det varmt.", w: ["Suvel", "on", "soe"] },
    { et: "Talvel sajab lund.", sv: "På vintern snöar det.", w: ["Talvel", "sajab", "lund"] },
    { et: "Kevadel õitsevad lilled.", sv: "På våren blommar blommorna.", w: ["Kevadel", "õitsevad", "lilled"] },
    { et: "Sügisel langevad lehed.", sv: "På hösten faller löven.", w: ["Sügisel", "langevad", "lehed"] },
    { et: "Mul on hea tuju.", sv: "Jag är på gott humör.", w: ["Mul", "on", "hea", "tuju"] },
    { et: "See on väga ilus.", sv: "Det är väldigt vackert.", w: ["See", "on", "väga", "ilus"] },
    { et: "Ma oskan eesti keelt.", sv: "Jag kan estniska.", w: ["Ma", "oskan", "eesti", "keelt"] },
  ];
  /* orden var för sig, så de kan läsas upp när man trycker på dem */
  var TOKENS = [
    { et: "Mul" },
    { et: "on" },
    { et: "suur" },
    { et: "Kass" },
    { et: "Ma" },
    { et: "söön" },
    { et: "õuna" },
    { et: "Isa" },
    { et: "joob" },
    { et: "vett" },
    { et: "Meil" },
    { et: "kollane" },
    { et: "Väike" },
    { et: "laps" },
    { et: "magab" },
    { et: "Mulle" },
    { et: "meeldib" },
    { et: "Koer" },
    { et: "jookseb" },
    { et: "metsas" },
    { et: "Ema" },
    { et: "loeb" },
    { et: "raamatut" },
    { et: "Päike" },
    { et: "paistab" },
    { et: "täna" },
    { et: "Minu" },
    { et: "laulab" },
    { et: "Me" },
    { et: "sõidame" },
    { et: "bussiga" },
    { et: "Siil" },
    { et: "sööb" },
    { et: "maasikat" },
    { et: "Vanaisa" },
    { et: "diivanil" },
  ];

  var SHOP = [
    /* vardagsplagg */
    { id: "lill", slot: "head", em: "🌸", sv: "Blomma", et: "Lill", price: 25 },
    { id: "lips", slot: "neck", em: "🎀", sv: "Rosett", et: "Lips", price: 35 },
    { id: "myts", slot: "head", em: "🧢", sv: "Röd mössa", et: "Punane müts", price: 60 },
    { id: "sall", slot: "neck", em: "🧣", sv: "Halsduk", et: "Sall", price: 90 },
    { id: "jaatis", slot: "hand", em: "🍦", sv: "Glass", et: "Jäätis", price: 120 },
    { id: "raamat", slot: "hand", em: "📕", sv: "Bok", et: "Raamat", price: 180 },
    { id: "kott", slot: "back", em: "🎒", sv: "Ryggsäck", et: "Koolikott", price: 250 },
    { id: "tiivad", slot: "back", em: "🦋", sv: "Fjärilsvingar", et: "Liblikatiivad", price: 400 },
    { id: "kroon", slot: "head", em: "👑", sv: "Guldkrona", et: "Kuldkroon", price: 700 },
    { id: "sara", slot: "aura", em: "✨", sv: "Gyllene skimmer", et: "Kuldne sära", price: 1200 },
    { id: "vikerkaar", slot: "scene", em: "🌈", sv: "Regnbåge", et: "Vikerkaar", price: 2500 },
    { id: "taevas", slot: "scene", em: "🌌", sv: "Stjärnhimmel", et: "Tähetaevas", price: 4000 },
    /* drömmar */
    { id: "virmalised", slot: "scene", em: "🌠", sv: "Norrsken", et: "Virmalised", price: 3600, dream: true },
    { id: "kosmos", slot: "scene", em: "🚀", sv: "Rymden", et: "Kosmos", price: 3000, dream: true },
    /* estniska fynd */
    { id: "rukkilill", slot: "head", em: "🔵", sv: "Blåklint", et: "Rukkilill", price: 120 },
    { id: "leib", slot: "hand", em: "🍞", sv: "Svart rågbröd", et: "Must leib", price: 160 },
    { id: "kihnu", slot: "outfit", em: "🧵", sv: "Kihnukjol", et: "Kihnu seelik", price: 750 },
    { id: "paasuke2", slot: "back", em: "🐦", sv: "Ladusvala", et: "Suitsupääsuke", price: 640 },
    { id: "kannel", slot: "hand", em: "🎼", sv: "Kantele", et: "Kannel", price: 820 },
    { id: "hobekee", slot: "neck", em: "🪙", sv: "Setos silversmycke", et: "Hõbekee", price: 1100 },
    { id: "rahvas", slot: "outfit", em: "👘", sv: "Folkdräkt", et: "Rahvarõivad", price: 1400 },
    { id: "torupill", slot: "hand", em: "🎺", sv: "Säckpipa", et: "Torupill", price: 1000 },
    { id: "mulgi", slot: "outfit", em: "🧥", sv: "Mulgikaftan", et: "Mulgi kuub", price: 1700 },
    { id: "jaanituli", slot: "aura", em: "🔥", sv: "Midsommareld", et: "Jaanituli", price: 900 },
    { id: "vanalinn", slot: "scene", em: "🏙️", sv: "Gamla stan", et: "Vanalinn", price: 3500 },
    { id: "rand2", slot: "scene", em: "🏖️", sv: "Pärnu strand", et: "Pärnu rand", price: 4000 },
    { id: "raba", slot: "scene", em: "🌅", sv: "Mossen i gryningen", et: "Raba koidikul", price: 2800 },
    /* bara för den som spelar på svår nivå */
    { id: "tulekroon", slot: "head", em: "🔥", sv: "Eldkrona", et: "Tulekroon", price: 900, hard: true },
    { id: "valk", slot: "aura", em: "⚡", sv: "Blixtar", et: "Välk", price: 1300, hard: true },
    { id: "draakon", slot: "back", em: "🐉", sv: "Drakvingar", et: "Draakonitiivad", price: 2200, hard: true },
    /* vinter */
    { id: "talv", slot: "head", em: "🎿", sv: "Vintermössa", et: "Talvemüts", price: 140, seasons: ["vinter"] },
    { id: "suusad", slot: "hand", em: "⛷️", sv: "Skidor", et: "Suusad", price: 450, seasons: ["vinter"] },
    /* vår */
    { id: "parg", slot: "head", em: "💐", sv: "Blomsterkrans", et: "Lillepärg", price: 280, seasons: ["kevad"] },
    /* sommar */
    { id: "jaanip", slot: "head", em: "🌼", sv: "Midsommarkrans", et: "Jaanipärg", price: 320, seasons: ["suvi"] },
    { id: "ring", slot: "back", em: "🛟", sv: "Badring", et: "Ujumisrõngas", price: 380, seasons: ["suvi"] },
    /* höst */
    { id: "lehed", slot: "head", em: "🍁", sv: "Lövkrona", et: "Lehekroon", price: 220, seasons: ["sygis"] },
    { id: "vihmav", slot: "hand", em: "☂️", sv: "Paraply", et: "Vihmavari", price: 300, seasons: ["sygis"] },
    /* högtider */
    { id: "lipp", slot: "hand", em: "🇪🇪", sv: "Estlands flagga", et: "Eesti lipp", price: 260, months: [2] },
    {
      id: "smvsall",
      slot: "neck",
      em: "🔵",
      sv: "Blå-svart-vit halsduk",
      et: "Sinimustvalge sall",
      price: 340,
      months: [2],
    },
    { id: "joulum", slot: "head", em: "🎅", sv: "Tomteluva", et: "Jõulumüts", price: 240, months: [12] },
    { id: "tuli", slot: "aura", em: "🎆", sv: "Fyrverkeri", et: "Ilutulestik", price: 600, months: [12, 1] },
  ];
  var SLOTS = [
    { id: "head", sv: "På huvudet" },
    { id: "outfit", sv: "Dräkt" },
    { id: "neck", sv: "Runt halsen" },
    { id: "hand", sv: "I tassen" },
    { id: "back", sv: "På ryggen" },
    { id: "aura", sv: "Runt Siiri" },
    { id: "scene", sv: "Bakom Siiri" },
  ];
  function seasonId() {
    var m = new Date().getMonth() + 1;
    if (m === 12 || m <= 2) return "vinter";
    if (m <= 5) return "kevad";
    if (m <= 8) return "suvi";
    return "sygis";
  }
  /* säsongs- och högtidsvaror syns bara när de är aktuella – ägda plagg kan alltid bäras */
  function hardWins() {
    return S.hardWins || 0;
  }
  function itemAvailable(it) {
    if (owns(it.id)) return true;
    if (it.hard && hardWins() < 1) return false;
    var m = new Date().getMonth() + 1;
    if (it.months) return it.months.indexOf(m) >= 0;
    if (it.seasons) return it.seasons.indexOf(seasonId()) >= 0;
    return true;
  }
  function isLimited(it) {
    return !!(it.months || it.seasons || it.hard);
  }
  function owns(id) {
    return (S.owned || []).indexOf(id) >= 0;
  }
  function wearing(slot) {
    return (S.wear || {})[slot] || null;
  }
  function itemById(id) {
    for (var i = 0; i < SHOP.length; i++) {
      if (SHOP[i].id === id) return SHOP[i];
    }
    return null;
  }

  var DIFFS = [
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
  function diff() {
    var i;
    for (i = 0; i < DIFFS.length; i++) {
      if (DIFFS[i].id === (S.diff || "lagom")) return DIFFS[i];
    }
    return DIFFS[1];
  }

  var RANKS = [
    {
      id: "siil",
      xp: 0,
      em: "🦔",
      et: "Pronkssiil",
      sv: "Bronsigelkotten",
      c1: "#E8A76A",
      c2: "#A9683A",
      ring: "#7A4522",
    },
    {
      id: "lind",
      xp: 150,
      em: "🐦",
      et: "Hõbelind",
      sv: "Silverfågeln",
      c1: "#F2F5F8",
      c2: "#A9B4BF",
      ring: "#7C8894",
    },
    { id: "kala", xp: 350, em: "🐟", et: "Kuldkala", sv: "Guldfisken", c1: "#FFE08A", c2: "#E0A21A", ring: "#A87206" },
    {
      id: "karu",
      xp: 650,
      em: "🐻",
      et: "Kristallkaru",
      sv: "Kristallbjörnen",
      c1: "#DFFAFF",
      c2: "#79C9E8",
      ring: "#3E8FB0",
    },
    {
      id: "rebane",
      xp: 1000,
      em: "🦊",
      et: "Tulerebane",
      sv: "Eldräven",
      c1: "#FFC24D",
      c2: "#F2612B",
      ring: "#B33808",
    },
    { id: "hunt", xp: 1450, em: "🐺", et: "Jäähunt", sv: "Isvargen", c1: "#EAF6FF", c2: "#8FB6F0", ring: "#4E79C4" },
    {
      id: "ukssarvik",
      xp: 2000,
      em: "🦄",
      et: "Kuldükssarvik",
      sv: "Guldenhörningen",
      c1: "#FFF0A8",
      c2: "#F5B72F",
      ring: "#C77BB0",
    },
    {
      id: "draakon",
      xp: 2800,
      em: "🐉",
      et: "Tähedraakon",
      sv: "Stjärndraken",
      c1: "#E3CCFF",
      c2: "#8E5BE8",
      ring: "#5B2FB0",
    },
    {
      id: "kull",
      xp: 4000,
      em: "🦉",
      et: "Tähekull",
      sv: "Stjärnugglan",
      c1: "#FFF1D6",
      c2: "#C99A4E",
      ring: "#8A6425",
    },
    {
      id: "kotkas",
      xp: 6000,
      em: "🦅",
      et: "Kuldkotkas",
      sv: "Guldörnen",
      c1: "#FFEFA8",
      c2: "#E6A81C",
      ring: "#A06E00",
    },
    {
      id: "vaal",
      xp: 9000,
      em: "🐋",
      et: "Hõbevaal",
      sv: "Silvervalen",
      c1: "#E6F6FF",
      c2: "#7FB6D9",
      ring: "#3D7699",
    },
    {
      id: "podera",
      xp: 13000,
      em: "🦌",
      et: "Põhjapõder",
      sv: "Norrskensrenen",
      c1: "#D8FFEF",
      c2: "#4FD1A0",
      ring: "#1E7D5C",
    },
    {
      id: "lovi",
      xp: 18000,
      em: "🦁",
      et: "Tulelõvi",
      sv: "Eldlejonet",
      c1: "#FFD9A8",
      c2: "#F2662B",
      ring: "#A63307",
    },
    {
      id: "kilpkonn",
      xp: 25000,
      em: "🐢",
      et: "Igikilpkonn",
      sv: "Urtidssköldpaddan",
      c1: "#E2F3C8",
      c2: "#7FA83E",
      ring: "#4A6B18",
    },
    {
      id: "mammut",
      xp: 35000,
      em: "🦣",
      et: "Jäämammut",
      sv: "Isjättemammuten",
      c1: "#EAF2FF",
      c2: "#98A9C9",
      ring: "#5A6B8C",
    },
    {
      id: "paasuke",
      xp: 48000,
      em: "🕊️",
      et: "Hõbepääsuke",
      sv: "Silversvalan",
      c1: "#FFFFFF",
      c2: "#BFC9D6",
      ring: "#7E8A99",
    },
    {
      id: "paabu",
      xp: 65000,
      em: "🦚",
      et: "Kuldpaabulind",
      sv: "Guldpåfågeln",
      c1: "#CFFFF3",
      c2: "#22A6B3",
      ring: "#0B6E7A",
    },
    {
      id: "kuningas",
      xp: 100000,
      em: "👑",
      et: "Kuningsiil",
      sv: "Kungsigelkotten",
      c1: "#FFF6C0",
      c2: "#F0B222",
      ring: "#B4780A",
    },
  ];
  function rankIndex(xp) {
    var i,
      r = 0;
    for (i = 0; i < RANKS.length; i++) {
      if (xp >= RANKS[i].xp) r = i;
    }
    return r;
  }
  function medalSVG(r, idx, locked, style) {
    var g = "g" + idx,
      st = style || "lagom",
      i,
      s = "";
    var deco = "",
      frame = "",
      ribbon = "";
    if (st === "latt") {
      ribbon =
        '<path d="M40 8 L56 8 L50 56 L32 50 Z" fill="#7FB08C"/><path d="M80 8 L64 8 L70 56 L88 50 Z" fill="#5C8F6C"/>';
      frame = '<circle cx="60" cy="88" r="44" fill="' + r.ring + '" opacity=".85"/>';
      deco =
        '<g opacity=".9">' +
        '<path d="M22 96 Q16 84 24 76 Q32 84 27 96 Z" fill="#4E9A68"/>' +
        '<path d="M98 96 Q104 84 96 76 Q88 84 93 96 Z" fill="#4E9A68"/></g>';
    } else if (st === "svar") {
      ribbon =
        '<path d="M34 4 L54 4 L46 58 L24 50 Z" fill="#7B3BE0"/><path d="M86 4 L66 4 L74 58 L96 50 Z" fill="#4C1FA8"/>';
      s = '<g opacity=".95">';
      for (i = 0; i < 12; i++) {
        s +=
          '<path d="M60 88 L64 34 L56 34 Z" fill="' +
          (i % 2 ? r.c2 : r.c1) +
          '" transform="rotate(' +
          i * 30 +
          ' 60 88)" opacity=".8"/>';
      }
      s += "</g>";
      frame = s + '<circle cx="60" cy="88" r="43" fill="' + r.ring + '"/>';
      deco =
        '<circle cx="60" cy="88" r="36" fill="none" stroke="#FFF3B0" stroke-width="2"/>' +
        '<path d="M60 46 l4 8 8 1 -6 6 2 8 -8 -4 -8 4 2 -8 -6 -6 8 -1 Z" fill="#FFF3B0"/>';
    } else {
      ribbon =
        '<path d="M34 6 L54 6 L46 58 L26 52 Z" fill="#C8305A"/><path d="M86 6 L66 6 L74 58 L94 52 Z" fill="#9E1F42"/>';
      frame = '<circle cx="60" cy="88" r="46" fill="' + r.ring + '"/>';
      deco =
        '<circle cx="60" cy="88" r="33" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="2.5" stroke-dasharray="5 7"/>';
    }
    return (
      '<svg class="medal" viewBox="0 0 120 150" role="img" aria-label="' +
      esc(r.sv) +
      '">' +
      '<defs><radialGradient id="' +
      g +
      '" cx="35%" cy="28%" r="85%">' +
      '<stop offset="0%" stop-color="#FFFFFF" stop-opacity=".75"/>' +
      '<stop offset="22%" stop-color="' +
      r.c1 +
      '"/><stop offset="62%" stop-color="' +
      r.c2 +
      '"/>' +
      '<stop offset="100%" stop-color="' +
      r.ring +
      '"/></radialGradient>' +
      '<clipPath id="c' +
      g +
      '"><circle cx="60" cy="88" r="40"/></clipPath></defs>' +
      ribbon +
      frame +
      '<circle cx="60" cy="88" r="40" fill="url(#' +
      g +
      ')"/>' +
      '<ellipse cx="48" cy="72" rx="17" ry="11" fill="#fff" opacity=".28"/>' +
      deco +
      (locked
        ? '<text x="60" y="100" font-size="34" text-anchor="middle">🔒</text>'
        : '<text x="60" y="101" font-size="38" text-anchor="middle">' +
          r.em +
          "</text>" +
          '<g clip-path="url(#c' +
          g +
          ')"><rect class="shine" x="-40" y="42" width="26" height="92" fill="rgba(255,255,255,.55)" transform="rotate(18 60 88)"/></g>') +
      "</svg>"
    );
  }
  function medalStyleOf(rankId) {
    return (S.mstyle && S.mstyle[rankId]) || "lagom";
  }
  /* belöningar som tjänas under en runda visas samlat på resultatskärmen */
  var pend = [];
  function pendAdd(em, title, sub) {
    pend.push({ em: em, title: title, sub: sub });
  }
  function pendHtml() {
    if (!pend.length) return "";
    var s = '<div class="card gains"><p class="q" style="text-align:left">Du fick</p>',
      i;
    for (i = 0; i < pend.length; i++) {
      s +=
        '<div class="gain"><span class="gem">' +
        pend[i].em +
        "</span>" +
        "<span><b>" +
        pend[i].title +
        "</b><small>" +
        pend[i].sub +
        "</small></span></div>";
    }
    pend = [];
    return s + "</div>";
  }
  function inRound() {
    try {
      return (
        !!(typeof L !== "undefined" && L && L.rounds && L.rounds.length) ||
        !!(typeof SP !== "undefined" && SP) ||
        !!(typeof LS !== "undefined" && LS) ||
        !!(typeof DU !== "undefined" && DU) ||
        !!(typeof MM !== "undefined" && MM) ||
        !!(typeof RN !== "undefined" && RN)
      );
    } catch (e) {
      return false;
    }
  }
  function rankUp(oldI, newI) {
    autoBackup("nytt märke");
    setTimeout(function () {
      dance(true);
    }, 600);
    if (inRound()) {
      var rr = RANKS[newI];
      pendAdd(rr.em, "Nytt märke: " + esc(rr.et), esc(rr.sv) + " · " + rr.xp.toLocaleString("sv-SE") + " poäng");
      sndLvl();
      return;
    }
    var r = RANKS[newI];
    if (!S.mstyle) S.mstyle = {};
    S.mstyle[r.id] = diff().id;
    save();
    var d = document.createElement("div");
    d.className = "overlay";
    d.innerHTML =
      '<div class="oc"><p class="kicker">Nytt märke upplåst!</p>' +
      medalSVG(r, "ov", false, diff().id) +
      "<h3>" +
      esc(r.et) +
      "</h3><p>" +
      esc(r.sv) +
      " · " +
      diff().em +
      " " +
      diff().sv +
      "</p>" +
      '<p style="margin-top:8px">' +
      (S.name ? esc(S.name) + " har" : "Du har") +
      " klättrat till märke " +
      (newI + 1) +
      " av " +
      RANKS.length +
      ".</p>" +
      '<button class="btn big wide" id="ocdone">Toppen! 🎉</button></div>';
    document.body.appendChild(d);
    sndLvl();
    burst(190);
    setTimeout(function () {
      burst(120);
    }, 450);
    d.querySelector("#ocdone").onclick = function () {
      d.remove();
    };
  }

  var LEADS = {
    tere: { et: "Tere,", sv: "Hej," },
    tubli: { et: "Tubli,", sv: "Duktigt," },
    vaga: { et: "Väga hea,", sv: "Jättebra," },
    aitah: { et: "Aitäh,", sv: "Tack," },
    aega: { et: "Head aega,", sv: "Hej då," },
    tore: { et: "Tore, et sa mängid,", sv: "Vad kul att du spelar," },
  };

  var EGGS = {
    gold: { et: "Vaata, ma olen kuldne siil!", sv: "Titta, jag är en gyllene igelkott!" },
    tickle: { et: "Kõdi! Ära kõdista mind!", sv: "Det kittlas! Sluta kittla mig!" },
    snow: { et: "Vaata, sajab lund!", sv: "Titta, det snöar!" },
    me: { et: "See olen ju mina!", sv: "Men det är ju jag!" },
  };
  var EGGS2 = {
    turtle: { et: "Aeglane ja tark nagu kilpkonn!", sv: "Långsam och klok som en sköldpadda!" },
    hardten: { et: "Kümme järjest raskel tasemel!", sv: "Tio i rad på svår nivå!" },
    hardperfect: { et: "Raske tase, suurepärane töö!", sv: "Svår nivå, enastående jobbat!" },
    sneeze: { et: "Aptsihh! Vabandust.", sv: "Atjo! Ursäkta." },
    stars: { et: "Vaata, tähesadu!", sv: "Titta, stjärnregn!" },
    medals: { et: "Kui ilusad medalid!", sv: "Vilka fina medaljer!" },
    ten: { et: "Kümme õiget järjest!", sv: "Tio rätt i rad!" },
    year: { et: "Aasta läheb ringi!", sv: "Året går runt!" },
    night: { et: "Mul on uni. Head ööd!", sv: "Jag är sömnig. God natt!" },
  };
  /* beröm som trappas upp – Siiri säger dem högt */
  /* ---------- DUELLER: motståndare, repliker och regler ---------- */
  var RIVALS = [
    {
      id: "hiir",
      em: "🐭",
      et: "Hiir",
      sv: "Musen",
      skill: 0.5,
      need: 0,
      desc: "Snabb men slarvig. Bra att börja med.",
    },
    {
      id: "rebane",
      em: "🦊",
      et: "Rebane",
      sv: "Räven",
      skill: 0.66,
      need: 3,
      desc: "Kaxig och kvick. Spärrar vägen mot Tartu.",
    },
    {
      id: "karu",
      em: "🐻",
      et: "Karu",
      sv: "Björnen",
      skill: 0.76,
      need: 6,
      desc: "Långsam att svara, men sällan fel.",
    },
    {
      id: "draakon",
      em: "🐉",
      et: "Draakon",
      sv: "Draken",
      skill: 0.86,
      need: 9,
      desc: "Kan nästan varje ord. Nästan.",
    },
  ];
  var TAUNT = {
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
  var COACH = [
    { et: "Sa saad hakkama!", sv: "Du klarar det!" },
    { et: "Ole julge!", sv: "Var modig!" },
    { et: "Ma usun sinusse!", sv: "Jag tror på dig!" },
  ];
  function taunt(kind) {
    var a = TAUNT[kind] || TAUNT.hit;
    return a[(Math.random() * a.length) | 0];
  }

  var PRAISE = {
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
      { et: "Proovi veel!", sv: "Försök igen!" },
      { et: "Kuula hoolikalt!", sv: "Lyssna noga!" },
      { et: "Edasi!", sv: "Vi fortsätter!" },
    ],
  };
  var lastPraise = "";
  function praise(combo, ok) {
    var pool = !ok ? PRAISE.no : combo >= 10 ? PRAISE.t4 : combo >= 5 ? PRAISE.t3 : combo >= 3 ? PRAISE.t2 : PRAISE.t1;
    var p = pool[(Math.random() * pool.length) | 0],
      guard = 0;
    while (p.et === lastPraise && pool.length > 1 && guard++ < 6) p = pool[(Math.random() * pool.length) | 0];
    lastPraise = p.et;
    return p;
  }
  function praiseSay(combo, ok, el) {
    var p = praise(combo, ok);
    if (el) {
      el.className = "feedback " + (ok ? "ok" : "no");
      el.innerHTML =
        esc(p.et) + ' <span style="font-weight:500;color:var(--muted);font-size:var(--fs-sm)">' + esc(p.sv) + "</span>";
    }
    if (ok && (combo >= 3 || Math.random() < 0.45)) queuePraise(p.et);
    else if (!ok && Math.random() < 0.5) queuePraise(p.et);
    return p;
  }
  /* berömmet sägs efter det rätta ordet när svaret visas (showAnswer), annars ensamt –
       så att Siiri aldrig pratar i mun på sig själv ("Usku-lehm") */
  var pendingPraise = null;
  function queuePraise(et) {
    pendingPraise = et;
    setTimeout(function () {
      if (pendingPraise === et) {
        pendingPraise = null;
        speak(et);
      }
    }, 150);
  }

  var SECRETS = [
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
  function foundSecret(id) {
    if (!S.secrets) S.secrets = [];
    if (S.secrets.indexOf(id) >= 0) return false;
    S.secrets.push(id);
    save();
    return true;
  }

  var BADGES = [
    {
      id: "first",
      em: "🌱",
      sv: "Första ordet",
      test: function (s) {
        return s.correct >= 1;
      },
    },
    {
      id: "ten",
      em: "🔟",
      sv: "Tio rätt",
      test: function (s) {
        return s.correct >= 10;
      },
    },
    {
      id: "fifty",
      em: "🏆",
      sv: "Femtio rätt",
      test: function (s) {
        return s.correct >= 50;
      },
    },
    {
      id: "talker",
      em: "🎤",
      sv: "Pratmakare",
      test: function (s) {
        return s.spoken >= 8;
      },
    },
    {
      id: "writer",
      em: "✏️",
      sv: "Stavningsmästare",
      test: function (s) {
        return s.typed >= 8;
      },
    },
    {
      id: "perfect",
      em: "💎",
      sv: "Allt rätt i ett tema",
      test: function (s) {
        return s.perfect >= 1;
      },
    },
    {
      id: "all",
      em: "👑",
      sv: "Alla teman klara",
      test: function (s) {
        var n = 0;
        for (var k in s.best) {
          if (s.best[k] > 0) n++;
        }
        return n >= THEMES.length;
      },
    },
    {
      id: "combo8",
      em: "🔥",
      sv: "Åtta rätt i rad",
      test: function (s) {
        return (s.bestcombo || 0) >= 8;
      },
    },
    {
      id: "flame3",
      em: "🔥",
      sv: "Tre dagar i rad",
      test: function (s) {
        return (s.flames || 0) >= 3;
      },
    },
    {
      id: "stars100",
      em: "🌟",
      sv: "Hundra stjärnor",
      test: function (s) {
        return s.stars >= 100;
      },
    },
    {
      id: "right250",
      em: "📗",
      sv: "250 rätta svar",
      test: function (s) {
        return s.correct >= 250;
      },
    },
    {
      id: "right1000",
      em: "📘",
      sv: "1000 rätta svar",
      test: function (s) {
        return s.correct >= 1000;
      },
    },
    {
      id: "spoken50",
      em: "🗣️",
      sv: "50 ord sagda högt",
      test: function (s) {
        return s.spoken >= 50;
      },
    },
    {
      id: "typed50",
      em: "⌨️",
      sv: "50 skrivna ord",
      test: function (s) {
        return s.typed >= 50;
      },
    },
    {
      id: "sent25",
      em: "🧩",
      sv: "25 byggda meningar",
      test: function (s) {
        return (s.sentbest || 0) >= 6 && s.correct >= 200;
      },
    },
    {
      id: "flame7",
      em: "📅",
      sv: "En hel vecka i rad",
      test: function (s) {
        return (s.flames || 0) >= 7;
      },
    },
    {
      id: "flame30",
      em: "🗓️",
      sv: "Trettio dagar i rad",
      test: function (s) {
        return (s.flames || 0) >= 30;
      },
    },
    {
      id: "trip6",
      em: "🗺️",
      sv: "Halva Estland",
      test: function (s) {
        return (s.tripDone || 0) >= Math.ceil(TRIP.length / 2);
      },
    },
    {
      id: "trip12",
      em: "🧭",
      sv: "Hela resan klar",
      test: function (s) {
        return (s.tripDone || 0) >= TRIP.length;
      },
    },
    {
      id: "wardrobe",
      em: "👗",
      sv: "Halva marknaden",
      test: function (s) {
        return (s.owned || []).length >= 13;
      },
    },
    {
      id: "wardrobeall",
      em: "🎽",
      sv: "Hela marknaden",
      test: function (s) {
        return (s.owned || []).length >= SHOP.length;
      },
    },
    {
      id: "hardwin",
      em: "🔥",
      sv: "Klarat svår nivå",
      test: function (s) {
        return (s.hardWins || 0) >= 1;
      },
    },
    {
      id: "hard10",
      em: "🐲",
      sv: "Tio teman på svår",
      test: function (s) {
        return (s.hardWins || 0) >= 10;
      },
    },
    {
      id: "perfect5",
      em: "💠",
      sv: "Fem perfekta teman",
      test: function (s) {
        return (s.perfect || 0) >= 5;
      },
    },
    {
      id: "stars5000",
      em: "✨",
      sv: "5 000 stjärnor samlade",
      test: function (s) {
        return s.stars >= 5000;
      },
    },
    {
      id: "kilpkonn",
      em: "🐢",
      sv: "Sköldpaddans märke",
      test: function (s) {
        return (s.secrets || []).indexOf("turtle") >= 0;
      },
    },
    {
      id: "duel1",
      em: "⚔️",
      sv: "Första duellvinsten",
      test: function (s) {
        var n = 0,
          k;
        for (k in s.duels || {}) n += s.duels[k].w || 0;
        return n >= 1;
      },
    },
    {
      id: "duel10",
      em: "🥊",
      sv: "Tio duellvinster",
      test: function (s) {
        var n = 0,
          k;
        for (k in s.duels || {}) n += s.duels[k].w || 0;
        return n >= 10;
      },
    },
    {
      id: "duelall",
      em: "👑",
      sv: "Slagit alla fyra",
      test: function (s) {
        var n = 0,
          i;
        for (i = 0; i < RIVALS.length; i++) {
          if (((s.duels || {})[RIVALS[i].id] || {}).w) n++;
        }
        return n >= 4;
      },
    },
  ];

  /* ============ ÅRSTIDER OCH HÖGTIDER ============ */
  var SEASONS = {
    vinter: { em: "❄️", sv: "Vinter", et: "Talv", word: { et: "lumi", sv: "snö" }, fx: "snow" },
    kevad: { em: "🌸", sv: "Vår", et: "Kevad", word: { et: "lill", sv: "blomma" }, fx: "petals" },
    suvi: { em: "☀️", sv: "Sommar", et: "Suvi", word: { et: "päike", sv: "sol" }, fx: "none" },
    sygis: { em: "🍂", sv: "Höst", et: "Sügis", word: { et: "vihm", sv: "regn" }, fx: "leaves" },
  };
  var HOLIDAYS = [
    {
      m: 2,
      d: 24,
      em: "🇪🇪",
      sv: "Estlands självständighetsdag",
      et: "Head iseseisvuspäeva!",
      tr: "Glad självständighetsdag!",
    },
    { m: 3, d: 14, em: "📖", sv: "Modersmålsdagen i Estland", et: "Head emakeelepäeva!", tr: "Glad modersmålsdag!" },
    { m: 6, d: 23, em: "🔥", sv: "Midsommarafton i Estland", et: "Head jaanipäeva!", tr: "Glad midsommar!" },
    { m: 6, d: 24, em: "🌼", sv: "Midsommardagen", et: "Head jaanipäeva!", tr: "Glad midsommar!" },
    { m: 12, d: 24, em: "🎄", sv: "Julafton", et: "Häid jõule!", tr: "God jul!" },
    { m: 12, d: 25, em: "🎄", sv: "Juldagen", et: "Häid jõule!", tr: "God jul!" },
    { m: 1, d: 1, em: "🎆", sv: "Nyårsdagen", et: "Head uut aastat!", tr: "Gott nytt år!" },
  ];
  function seasonNow() {
    var m = new Date().getMonth() + 1;
    if (m === 12 || m <= 2) return SEASONS.vinter;
    if (m <= 5) return SEASONS.kevad;
    if (m <= 8) return SEASONS.suvi;
    return SEASONS.sygis;
  }
  function holidayNow() {
    var t = new Date(),
      m = t.getMonth() + 1,
      d = t.getDate(),
      i;
    for (i = 0; i < HOLIDAYS.length; i++) {
      if (HOLIDAYS[i].m === m && HOLIDAYS[i].d === d) return HOLIDAYS[i];
    }
    return null;
  }
  function seasonFx() {
    var f = seasonNow().fx;
    if (f === "snow") snow(70);
    else if (f === "petals") petals(45, ["#FFC7DC", "#FFE0EC", "#F7A8C4"]);
    else if (f === "leaves") petals(45, ["#E0A14A", "#C8762F", "#D9B84C"]);
  }
  function holidayCard() {
    var hol = holidayNow();
    if (!hol) return;
    if (S.holseen === today()) return;
    S.holseen = today();
    save();
    setTimeout(function () {
      var d = document.createElement("div");
      d.className = "overlay";
      d.innerHTML =
        '<div class="oc"><p class="kicker">Idag är det något särskilt!</p>' +
        '<div style="font-size:64px">' +
        hol.em +
        "</div><h3>" +
        esc(hol.et) +
        "</h3><p>" +
        esc(hol.tr) +
        "</p>" +
        '<p class="qsub" style="margin-top:4px">' +
        esc(hol.sv) +
        "</p>" +
        '<button class="btn big wide" id="holok">Aitäh!</button></div>';
      document.body.appendChild(d);
      burst(180);
      speak(hol.et);
      d.querySelector("#holok").onclick = function () {
        d.remove();
      };
    }, 700);
  }

  /* ============ DAGENS UTMANING ============ */
  var QUESTS = [
    { id: "right15", em: "🎯", sv: "Få 15 rätt idag", goal: 15, key: "correct" },
    { id: "speak6", em: "🎤", sv: "Säg 6 ord högt idag", goal: 6, key: "spoken" },
    { id: "themes2", em: "🏁", sv: "Klara 2 teman idag", goal: 2, key: "themes" },
    { id: "type8", em: "✏️", sv: "Skriv 8 ord rätt idag", goal: 8, key: "typed" },
    { id: "talk1", em: "💬", sv: "Prata klart ett samtal", goal: 1, key: "talks" },
    { id: "right25", em: "🔥", sv: "Få 25 rätt idag", goal: 25, key: "correct" },
    { id: "mixed1", em: "🎲", sv: "Klara en runda blandade ord", goal: 1, key: "mixed" },
    { id: "sent3", em: "🧩", sv: "Bygg 3 meningar rätt", goal: 3, key: "sent" },
  ];
  function today() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function questOfDay() {
    var d = new Date();
    return QUESTS[d.getDay() % QUESTS.length];
  }
  /* ============ STATE ============ */
  /* Datan (S), sparningen, profilerna och reservkopiorna ligger i Nuxt-appen
       (app/stores/profile.ts), så att den här koden och Vue delar samma data. S är samma
       reaktiva objekt som lagret håller – fält ändras direkt som förut, och save() sparar. */
  var STORE = window.SiiriStore;
  var S = STORE.state;
  function curSlot() {
    return STORE.slot;
  }
  function slotInfo(i) {
    return STORE.slotInfo(i);
  }
  function switchSlot(i) {
    STORE.switchSlot(i);
  }
  function save() {
    STORE.save();
  }
  /* ---------- automatisk reservkopia ---------- */
  function autoBackup(why) {
    STORE.autoBackup(why);
  }
  function backupInfo() {
    return STORE.backupInfo();
  }
  function backupAge(p) {
    return STORE.backupAge(p);
  }
  function restoreBackup() {
    return STORE.restoreBackup();
  }
  function backupLooksBetter() {
    return STORE.backupLooksBetter();
  }
  /* säkerhetskopia: all data som en kod man kan spara eller flytta */
  function exportCode() {
    return STORE.exportCode();
  }
  /* familjekontot (Nuxt-appen, app/stores/cloud.ts) – finns bara om konton är påslagna */
  function cloudOn() {
    return !!(window.SiiriCloud && window.SiiriCloud.enabled);
  }
  function cloudInfo() {
    return cloudOn()
      ? window.SiiriCloud.info()
      : {
          linked: false,
          name: "",
          kind: "",
          status: "",
          needsLogin: false,
          adult: false,
          locked: false,
          familyDevice: false,
          family: "",
          signedIn: false,
        };
  }
  /* barn spelar här (barnspelare, eller enheten är låst av en vuxen): föräldradelar, admin och
     glosinklistring visas inte – glosorna kommer från de vuxna i familjen */
  function childDevice() {
    var c = cloudInfo();
    return c.kind === "child" || c.locked;
  }
  /* märke på en spelare i profilväxlaren: sparas i familjen (och har PIN-kod) */
  function slotTag(i) {
    if (!cloudOn()) return "";
    var k = window.SiiriCloud.slotKind(i);
    return k === "child-pin"
      ? "<small>☁️ 🔒 PIN</small>"
      : k === "child"
        ? "<small>☁️ familjen</small>"
        : k === "adult"
          ? "<small>☁️ vuxen</small>"
          : "";
  }
  /* kortet Familj i profilen: vad som gäller beror på vem som är inloggad på enheten */
  function familyCard() {
    if (!cloudOn()) return "";
    var c = cloudInfo(),
      row = '<div class="row" style="justify-content:flex-start;margin-top:8px">',
      h =
        '<div class="card"><p class="q" style="text-align:left">Perekond · Familj</p><p class="qsub" style="text-align:left">';
    if (c.adult)
      h +=
        "Du är inloggad som vuxen" +
        (c.family ? " i " + esc(c.family) : "") +
        ". Barn, glosor och familjekod finns i föräldraläget.</p>" +
        row +
        '<a class="btn green" href="/parent">👨‍👩‍👧 Föräldraläget</a>' +
        '<button class="btn ghost" id="famlock">🔒 Lås enheten</button></div>' +
        '<p class="qsub" id="fammsg" style="text-align:left;margin-top:8px"></p>';
    else if (c.familyDevice)
      h +=
        (c.locked ? "🔒 Enheten är låst av en vuxen. " : "") +
        (c.family ? "Ni spelar i " + esc(c.family) + "." : "Ni spelar i familjen.") +
        " Spelet sparas i familjekontot och glosorna kommer från de vuxna.</p>" +
        row +
        '<button class="btn green" id="famswitch">👥 Byt spelare</button>' +
        '<a class="btn ghost" href="/join">➕ Lägg till spelare</a>' +
        (c.locked ? '<a class="btn ghost" href="/parent">🔓 Lås upp</a>' : "") +
        "</div>";
    else if (c.signedIn)
      h +=
        "Du är inloggad men inte med i någon familj än.</p>" +
        row +
        '<a class="btn green" href="/parent">👨‍👩‍👧 Föräldraläget</a></div>';
    else
      h +=
        (c.linked
          ? "Spelet hör till familjen, men enheten är utloggad. Skriv familjekoden igen så sparas det som vanligt."
          : "Spela med familjen: spelet sparas i familjekontot och följer med till andra enheter, och glosorna kommer från de vuxna.") +
        "</p>" +
        row +
        '<a class="btn green" href="/join">🔑 Jag har en familjekod</a>' +
        '<a class="btn ghost" href="/parent">👩 Jag är vuxen</a></div>';
    return h + "</div>";
  }
  function cloudLine() {
    var c = cloudInfo();
    if (!c.linked)
      return (
        "Allt sparas bara i den här webbläsaren. Spara en kod om du byter dator eller rensar historiken." +
        (cloudOn()
          ? " Eller gå med i familjen, så sparas spelet i familjekontot och följer med till andra enheter."
          : "")
      );
    if (c.needsLogin)
      return (
        "☁️ Kopplad till familjekontot" +
        (c.name ? " (" + esc(c.name) + ")" : "") +
        ", men enheten är utloggad – se Familj ovan."
      );
    return (
      "☁️ Sparas i familjekontot" +
      (c.name ? " som " + esc(c.name) : "") +
      " och följer med till andra enheter." +
      (c.status === "offline" ? " Just nu offline – det skickas när nätet är tillbaka." : "") +
      " Koden nedan är en extra säkerhetskopia."
    );
  }
  function importCode(code) {
    return STORE.importCode(code);
  }
  function newDay() {
    var t = today();
    if (S.day !== t) {
      var y = new Date();
      y.setDate(y.getDate() - 1);
      var ystr = y.getFullYear() + "-" + (y.getMonth() + 1) + "-" + y.getDate();
      if (S.day !== ystr) S.flames = 0;
      S.day = t;
      S.dayp = { correct: 0, spoken: 0, typed: 0, themes: 0, talks: 0, mixed: 0, claimed: 0 };
      save();
    }
    if (!S.dayp) S.dayp = { correct: 0, spoken: 0, typed: 0, themes: 0, talks: 0, mixed: 0, claimed: 0 };
  }
  function questProgress() {
    var q = questOfDay(),
      v = S.dayp[q.key] || 0;
    return { q: q, v: Math.min(v, q.goal), done: v >= q.goal, claimed: !!S.dayp.claimed };
  }
  function bumpQuest(key, amount, isMax) {
    newDay();
    if (isMax) {
      if ((S.dayp[key] || 0) < amount) S.dayp[key] = amount;
    } else S.dayp[key] = (S.dayp[key] || 0) + (amount || 1);
    var p = questProgress();
    if (p.done && !p.claimed) {
      S.dayp.claimed = 1;
      S.flames = (S.flames || 0) + 1;
      save();
      addXp(60);
      setTimeout(function () {
        var d = document.createElement("div");
        d.className = "overlay";
        d.innerHTML =
          '<div class="oc"><p class="kicker">Dagens utmaning klar!</p>' +
          '<div style="font-size:64px">' +
          p.q.em +
          "</div><h3>" +
          esc(p.q.sv) +
          "</h3>" +
          "<p>+60 poäng · " +
          S.flames +
          " dagar i rad 🔥</p>" +
          '<button class="btn big wide" id="qdone">Nice!</button></div>';
        document.body.appendChild(d);
        burst(160);
        sndLvl();
        d.querySelector("#qdone").onclick = function () {
          d.remove();
        };
      }, 900);
    }
    save();
  }

  var app = document.getElementById("app");
  /* bilden läggs in en enda gång och återanvänds av alla figurer */
  (function () {
    try {
      var img = window.SIIRI_IMG || "";
      var defs = document.querySelector("#siiridefs defs");
      var bs = window.SIIRI_BASE || img,
        hd = window.SIIRI_HEAD || "";
      if (defs && img)
        defs.innerHTML =
          '<image id="siiriPic" href="' +
          img +
          '" x="0" y="0" width="200" height="200" preserveAspectRatio="xMidYMid meet"/>' +
          '<image id="siiriBase" href="' +
          bs +
          '" x="0" y="0" width="200" height="200" preserveAspectRatio="xMidYMid meet"/>' +
          (hd
            ? '<image id="siiriHead" href="' +
              hd +
              '" x="0" y="0" width="200" height="200" preserveAspectRatio="xMidYMid meet"/>'
            : "");
    } catch (e) {}
  })();
  var elStars = document.getElementById("stars");
  var btnBack = document.getElementById("back");
  var btnSound = document.getElementById("sound");
  var btnTheme = document.getElementById("theme");
  /* räknare som tickar upp i stället för att hoppa */
  function tickNumber(el, from, to, dur) {
    if (!el) return;
    if (typeof requestAnimationFrame !== "function" || Math.abs(to - from) > 4000 || from === to) {
      el.textContent = to.toLocaleString("sv-SE");
      return;
    }
    var t0 = performance.now();
    dur = dur || 520;
    function step(now) {
      var k = Math.min(1, (now - t0) / dur),
        v = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)));
      el.textContent = v.toLocaleString("sv-SE");
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* toppraden: figur, namn, märke, stjärnor och mätaren mot nästa märke */
  function refreshTop() {
    var ri = rankIndex(S.xp),
      r = RANKS[ri],
      nxt = RANKS[ri + 1],
      e;
    e = document.getElementById("meav");
    if (e) e.textContent = S.avatar || "🦔";
    e = document.getElementById("mename");
    if (e) e.textContent = S.name || "Profil";
    e = document.getElementById("rankmini");
    if (e) e.innerHTML = medalSVG(r, "mini", false, medalStyleOf(r.id));
    if (elStars) tickNumber(elStars, parseInt((elStars.textContent || "0").replace(/\s/g, ""), 10) || 0, S.stars, 520);
    e = document.getElementById("lvltext");
    if (e) e.textContent = nxt ? "Nästa märke: " + nxt.et + " · " + nxt.sv : "Högsta märket! " + r.et;
    e = document.getElementById("xptext");
    if (e)
      e.textContent = nxt
        ? (S.xp - r.xp).toLocaleString("sv-SE") + " / " + (nxt.xp - r.xp).toLocaleString("sv-SE")
        : S.xp.toLocaleString("sv-SE");
    e = document.getElementById("bandfill");
    if (e)
      e.style.width =
        (nxt ? Math.max(0, Math.min(100, Math.round(((S.xp - r.xp) / (nxt.xp - r.xp)) * 100))) : 100) + "%";
    e = document.getElementById("sound");
    if (e) e.textContent = S.sound ? "🔊" : "🔇";
    var nav = document.getElementById("nav");
    if (nav) nav.hidden = !S.setupdone;
  }

  var blobCache = {},
    blobCount = 0;
  function toBlob(src) {
    if (!src || src.indexOf("data:") !== 0) return src;
    if (blobCache[src]) return blobCache[src];
    if (blobCount > 320) return src;
    try {
      var parts = src.split(","),
        bin = atob(parts[1]),
        n = bin.length,
        arr = new Uint8Array(n),
        i;
      for (i = 0; i < n; i++) arr[i] = bin.charCodeAt(i);
      var url = URL.createObjectURL(new Blob([arr], { type: "audio/mpeg" }));
      blobCache[src] = url;
      blobCount++;
      return url;
    } catch (e) {
      return src;
    }
  }
  var AC = null;
  function tone(freq, dur, when, type) {
    if (!S.sound) return;
    try {
      if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === "suspended") AC.resume();
      var o = AC.createOscillator(),
        g = AC.createGain();
      o.type = type || "sine";
      o.frequency.value = freq;
      o.connect(g);
      g.connect(AC.destination);
      var t = AC.currentTime + (when || 0);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.start(t);
      o.stop(t + dur + 0.03);
    } catch (e) {}
  }
  function buzz(p) {
    try {
      if (S.sound && navigator.vibrate) navigator.vibrate(p);
    } catch (e) {}
  }
  function stampOn(el, sym) {
    if (!el) return;
    try {
      var s = document.createElement("span");
      s.className = "stamp";
      s.textContent = sym;
      el.appendChild(s);
      setTimeout(function () {
        if (s.parentNode) s.parentNode.removeChild(s);
      }, 1400);
    } catch (e) {}
  }
  function sndOk() {
    tone(660, 0.14, 0);
    tone(880, 0.16, 0.11);
    tone(1180, 0.22, 0.22);
  }
  /* applåder: korta brusstötar genom ett högpassfilter, utspridda som en folkmassa som klappar */
  function applause(n, dur) {
    if (!S.sound) return;
    try {
      if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === "suspended") AC.resume();
      var claps = n || 16,
        i;
      for (i = 0; i < claps; i++) {
        (function (delay) {
          var len = 0.05,
            buf = AC.createBuffer(1, Math.ceil(AC.sampleRate * len), AC.sampleRate);
          var data = buf.getChannelData(0),
            j;
          for (j = 0; j < data.length; j++) data[j] = (Math.random() * 2 - 1) * (1 - j / data.length);
          var src = AC.createBufferSource();
          src.buffer = buf;
          var f = AC.createBiquadFilter();
          f.type = "highpass";
          f.frequency.value = 1200;
          var g = AC.createGain(),
            t = AC.currentTime + delay;
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(0.4, t + 0.004);
          g.gain.exponentialRampToValueAtTime(0.0001, t + len);
          src.connect(f);
          f.connect(g);
          g.connect(AC.destination);
          src.start(t);
          src.stop(t + len + 0.01);
        })(Math.random() * (dur || 1.8));
      }
    } catch (e) {}
  }
  /* kattspinn: en låg ton som darrar i ~26 Hz, plus lite brus för textur */
  /* kattspinn: riktiga katter spinner genom att stämbanden öppnas och stängs
       ~25-30 ggr/sek, vilket ger ett muller av bruset luft snarare än en ren ton –
       därför byggs ljudet av pulsat, lågpassfiltrerat brus och ingen oscillator */
  function purr(dur) {
    if (!S.sound) return;
    try {
      if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === "suspended") AC.resume();
      var t = AC.currentTime,
        len = dur || 1.1,
        sr = AC.sampleRate;
      var n = Math.ceil(sr * len),
        buf = AC.createBuffer(1, n, sr),
        data = buf.getChannelData(0);
      var rate = 28,
        i,
        time,
        pulse;
      for (i = 0; i < n; i++) {
        time = i / sr;
        pulse = Math.max(0, Math.sin(2 * Math.PI * rate * time));
        pulse = Math.pow(pulse, 1.6);
        data[i] = (Math.random() * 2 - 1) * pulse;
      }
      var src = AC.createBufferSource();
      src.buffer = buf;
      var f1 = AC.createBiquadFilter();
      f1.type = "lowpass";
      f1.frequency.value = 260;
      f1.Q.value = 1;
      var g = AC.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(1.6, t + 0.15);
      g.gain.setValueAtTime(1.6, t + len - 0.3);
      g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      src.connect(f1);
      f1.connect(g);
      g.connect(AC.destination);
      src.start(t);
      src.stop(t + len + 0.02);
    } catch (e) {}
  }
  function sndNo() {
    tone(300, 0.16, 0, "triangle");
    tone(210, 0.22, 0.13, "triangle");
  }
  var AMB = null;
  function ambienceStop() {
    if (!AMB) return;
    try {
      if (AMB.gain) AMB.gain.gain.setTargetAtTime(0, AC.currentTime, 0.4);
      var n = AMB;
      setTimeout(function () {
        try {
          n.src && n.src.stop();
          n.lfo && n.lfo.stop();
          n.gain && n.gain.disconnect();
        } catch (e) {}
      }, 1100);
      if (n.timer) clearInterval(n.timer);
    } catch (e) {}
    AMB = null;
  }
  /* ljudmiljön ska andas, inte susa: mycket tyst brus med långsamma vindpustar
       plus enstaka händelser – regndroppar på hösten, fåglar på våren och sommaren */
  function ambienceStart() {
    if (!S.sound || !S.amb || AMB) return;
    try {
      if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === "suspended") AC.resume();
      var sec = seasonId();
      var len = AC.sampleRate * 4,
        buf = AC.createBuffer(1, len, AC.sampleRate),
        d = buf.getChannelData(0),
        last = 0,
        i;
      for (i = 0; i < len; i++) {
        var wn = Math.random() * 2 - 1;
        last = (last + 0.02 * wn) / 1.02;
        d[i] = last * 3.2;
      }
      var src = AC.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      var bp = AC.createBiquadFilter();
      bp.type = "lowpass";
      bp.frequency.value = sec === "vinter" ? 300 : sec === "sygis" ? 520 : 420;
      bp.Q.value = 0.6;
      var base = AC.createGain();
      base.gain.value = sec === "suvi" ? 0.006 : 0.01; /* nästan omärkligt */
      /* vindpustar: långsam våg som höjer och sänker */
      var lfo = AC.createOscillator(),
        lfoG = AC.createGain();
      lfo.frequency.value = 0.055; /* ca en pust var 18:e sekund */
      lfoG.gain.value = sec === "suvi" ? 0.004 : 0.008;
      lfo.connect(lfoG);
      lfoG.connect(base.gain);
      var out = AC.createGain();
      out.gain.value = 0;
      out.gain.setTargetAtTime(1, AC.currentTime, 2.5); /* tona in långsamt */
      src.connect(bp);
      bp.connect(base);
      base.connect(out);
      out.connect(AC.destination);
      src.start();
      lfo.start();
      AMB = { src: src, lfo: lfo, gain: out, timer: null };
      /* enstaka händelser i stället för konstant ljud */
      AMB.timer = setInterval(function () {
        if (!AMB || !S.sound) return;
        var t = AC.currentTime;
        if (sec === "kevad" || sec === "suvi") {
          if (Math.random() < 0.62) return; /* fågel ungefär var 12:e sekund */
          var o = AC.createOscillator(),
            og = AC.createGain();
          o.type = "sine";
          o.frequency.setValueAtTime(1900 + Math.random() * 700, t);
          o.frequency.exponentialRampToValueAtTime(2500 + Math.random() * 800, t + 0.08);
          og.gain.setValueAtTime(0.0001, t);
          og.gain.exponentialRampToValueAtTime(0.022, t + 0.03);
          og.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
          o.connect(og);
          og.connect(AC.destination);
          o.start(t);
          o.stop(t + 0.28);
        } else if (sec === "sygis") {
          if (Math.random() < 0.5) return; /* enstaka droppe */
          var o2 = AC.createOscillator(),
            g2 = AC.createGain();
          o2.type = "sine";
          o2.frequency.setValueAtTime(900 + Math.random() * 500, t);
          o2.frequency.exponentialRampToValueAtTime(420, t + 0.09);
          g2.gain.setValueAtTime(0.0001, t);
          g2.gain.exponentialRampToValueAtTime(0.014, t + 0.01);
          g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
          o2.connect(g2);
          g2.connect(AC.destination);
          o2.start(t);
          o2.stop(t + 0.2);
        }
      }, 4200);
    } catch (e) {}
  }
  function ambienceToggle() {
    S.amb = S.amb ? 0 : 1;
    save();
    if (!S.amb) ambienceStop();
    else ambienceStart();
  }
  function fanfare(tier) {
    if (!S.sound) return;
    var N = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    if (tier >= 3) {
      tone(261.6, 0.5, 0, "triangle");
      tone(392, 0.5, 0, "triangle");
      tone(N[0], 0.16, 0.05);
      tone(N[1], 0.16, 0.2);
      tone(N[2], 0.16, 0.35);
      tone(N[3], 0.5, 0.52);
      tone(N[2], 0.5, 0.52);
      tone(N[4], 0.7, 0.7);
      tone(130.8, 0.7, 0.7, "triangle");
      setTimeout(function () {
        tone(N[3], 0.18, 0);
        tone(N[4], 0.5, 0.16);
      }, 1200);
    } else if (tier === 2) {
      tone(N[0], 0.14, 0);
      tone(N[1], 0.14, 0.13);
      tone(N[2], 0.14, 0.26);
      tone(N[3], 0.45, 0.4);
      tone(N[1], 0.45, 0.4);
    } else {
      tone(N[1], 0.12, 0);
      tone(N[2], 0.12, 0.11);
      tone(N[3], 0.3, 0.23);
    }
  }
  function sndLvl() {
    tone(523, 0.14, 0);
    tone(659, 0.14, 0.12);
    tone(784, 0.14, 0.24);
    tone(1047, 0.3, 0.36);
  }

  /* ============ TAL UT (estniska, kvinnoröst) ============ */
  var BANKS = window.AUDIO || { normal: {}, slow: {}, names: {} };
  if (!BANKS.story) BANKS.story = {};
  if (!BANKS.normal) BANKS.normal = {};
  if (!BANKS.slow) BANKS.slow = {};
  if (!BANKS.names) BANKS.names = {};
  function bank(slow) {
    return (slow ? BANKS.slow : BANKS.normal) || BANKS.normal || {};
  }

  /* --- offline: be service workern hämta en dels alla klipp i förväg,
       så att hela temat fungerar utan nät när det väl har öppnats --- */
  function precacheClips(banks) {
    if (!("serviceWorker" in navigator) || location.protocol.indexOf("http") !== 0) return;
    var urls = [],
      b,
      k,
      v;
    for (b in banks) {
      if (!banks[b] || typeof banks[b] !== "object") continue;
      for (k in banks[b]) {
        v = banks[b][k];
        if (typeof v === "string" && v.indexOf("data:") !== 0) urls.push(v);
      }
    }
    if (!urls.length) return;
    navigator.serviceWorker.ready
      .then(function (reg) {
        if (reg.active) reg.active.postMessage({ type: "precache", urls: urls });
      })
      .catch(function () {});
  }
  precacheClips(BANKS); /* orden i startfilen */

  /* --- ljuddelar: hämtas först när de behövs --- */
  window.AUDIO_PARTS = window.AUDIO_PARTS || { loaded: {}, pending: {} };
  window.addAudio = function (part, data) {
    var k;
    if (data.normal) for (k in data.normal) BANKS.normal[k] = data.normal[k];
    if (data.slow) for (k in data.slow) BANKS.slow[k] = data.slow[k];
    if (data.names) for (k in data.names) BANKS.names[k] = data.names[k];
    precacheClips(data);
    window.AUDIO_PARTS.loaded[part] = 1;
    var q = window.AUDIO_PARTS.pending[part] || [];
    delete window.AUDIO_PARTS.pending[part];
    for (var i = 0; i < q.length; i++) {
      try {
        q[i]();
      } catch (e) {}
    }
  };
  function partFor(text) {
    var pm = window.PARTMAP || null;
    if (!pm) return null;
    var p = pm[text];
    if (!p || window.AUDIO_PARTS.loaded[p]) return null;
    return p;
  }
  /* orden i startfilen har bara normal hastighet – den långsamma inläsningen
       ligger i en egen del som hämtas först när någon trycker 🐢 */
  function slowPartFor(text) {
    var sm = window.SLOWMAP || null;
    if (!sm) return null;
    var p = sm[text];
    if (!p || window.AUDIO_PARTS.loaded[p]) return null;
    return p;
  }
  var loadingParts = 0;
  function showLoading(on) {
    var el = document.getElementById("loadbar");
    if (!el) {
      if (!on) return;
      el = document.createElement("div");
      el.id = "loadbar";
      document.body.appendChild(el);
    }
    el.className = on ? "on" : "";
    if (!on)
      setTimeout(function () {
        if (el && !loadingParts) el.remove();
      }, 400);
  }
  function loadPart(part, cb) {
    /* i enfilsversionen finns ingen delkarta – då ligger allt ljud redan i sidan */
    if (!part || !window.PARTMAP) {
      cb && cb();
      return;
    }
    var P = window.AUDIO_PARTS;
    if (P.loaded[part]) {
      cb && cb();
      return;
    }
    if (P.pending[part]) {
      if (cb) P.pending[part].push(cb);
      return;
    }
    P.pending[part] = cb ? [cb] : [];
    loadingParts++;
    showLoading(true);
    var done = function () {
      loadingParts = Math.max(0, loadingParts - 1);
      if (!loadingParts) showLoading(false);
    };
    var s = document.createElement("script");
    s.addEventListener("load", done);
    s.addEventListener("error", done);
    s.src = "audio/" + part + ".js";
    s.async = true;
    s.onerror = function () {
      P.loaded[part] = 1;
      var q = P.pending[part] || [];
      delete P.pending[part];
      for (var i = 0; i < q.length; i++) {
        try {
          q[i]();
        } catch (e) {}
      }
    };
    document.head.appendChild(s);
  }
  function prefetch(part) {
    loadPart(part, null);
  }
  function prefetchTheme(id) {
    prefetch("theme-" + id);
  }
  function prefetchAllThemes() {
    for (var i = 0; i < THEMES.length; i++) prefetch("theme-" + THEMES[i].id);
  }
  function prefetchName() {
    var k = (S.name || "").trim().charAt(0).toLowerCase();
    if (k) prefetch("names-" + (/[a-zåäöõü]/.test(k) ? k : "x"));
  }
  var voices = [],
    etVoice = null,
    voiceSource = "inbyggd";
  var FEM = /anu|liisi|külli|kylli|kadri|mari|eva|naine|female|woman|zira|hazel/i;
  var MAS = /kert|tõnu|tonu|meelis|mihkel|mees|male\b|man\b|david|mark/i;
  function loadVoices() {
    try {
      voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    } catch (e) {
      voices = [];
    }
    etVoice = pickEstonian();
    voiceSource = etVoice ? "system" : "inbyggd";
  }
  function pickEstonian() {
    var et = [],
      i,
      v;
    for (i = 0; i < voices.length; i++) {
      v = voices[i];
      if (v.lang && v.lang.toLowerCase().indexOf("et") === 0) et.push(v);
    }
    if (!et.length) return null;
    for (i = 0; i < et.length; i++) {
      if (FEM.test(et[i].name)) return et[i];
    }
    for (i = 0; i < et.length; i++) {
      if (!MAS.test(et[i].name)) return et[i];
    }
    return null; /* bara manlig estnisk röst -> anvand inbyggd kvinnoröst */
  }
  loadVoices();
  if (window.speechSynthesis) {
    speechSynthesis.onvoiceschanged = loadVoices;
  }

  var player = null,
    AN = null,
    srcNode = null,
    jawRAF = null,
    talking = false;
  var isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var useAN = !isIOS,
    anBuf = null;
  function ensureGraph() {
    if (!useAN || srcNode || !player) return;
    try {
      if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state !== "running") {
        try {
          AC.resume();
        } catch (e) {}
        return;
      } /* koppla inte in en sovande motor */
      srcNode = AC.createMediaElementSource(player);
      AN = AC.createAnalyser();
      AN.fftSize = 512;
      anBuf = new Uint8Array(AN.fftSize);
      srcNode.connect(AN);
      AN.connect(AC.destination);
    } catch (e) {
      useAN = false;
      AN = null;
    }
  }
  function startJaw(live) {
    stopJaw();
    talking = true;
    mMood("talk");
    var t0 = performance.now();
    function step(now) {
      var v = 0,
        i,
        d,
        sum = 0;
      if (live && AN) {
        AN.getByteTimeDomainData(anBuf);
        for (i = 0; i < anBuf.length; i += 2) {
          d = (anBuf[i] - 128) / 128;
          sum += d * d;
        }
        v = Math.min(1, Math.sqrt(sum / (anBuf.length / 2)) * 5.2);
      } else {
        var t = (now - t0) / 1000;
        v = Math.max(0, (Math.sin(t * 15.5) * 0.5 + 0.5) * (0.45 + 0.55 * Math.abs(Math.sin(t * 2.9))));
      }
      mJaw(v);
      jawRAF = requestAnimationFrame(step);
    }
    jawRAF = requestAnimationFrame(step);
  }
  function stopJaw() {
    if (jawRAF) cancelAnimationFrame(jawRAF);
    jawRAF = null;
    talking = false;
    mJaw(0);
    var s = $s("s-svg");
    if (s && s.className.baseVal.indexOf("mood-talk") >= 0) mMood("");
  }
  function stopSpeak() {
    qlist = [];
    stopStory();
    stopJaw();
    try {
      if (window.speechSynthesis) speechSynthesis.cancel();
    } catch (e) {}
    try {
      if (player) {
        player.pause();
        player.currentTime = 0;
      }
    } catch (e) {}
  }
  function nameKey() {
    return (S.name || "")
      .trim()
      .split(/\s+/)[0]
      .toLowerCase()
      .replace(/[^a-zåäöõüšž]/g, "");
  }
  function nameClip() {
    var b = BANKS.names || {},
      k = nameKey();
    if (k && !b[k]) {
      var pp = partFor(k);
      if (pp) {
        loadPart(pp, null);
      }
    }
    if (!k) return null;
    if (b[k]) return b[k];
    /* prova utan prickar: Jönas -> jonas, Sofía -> sofia */
    var plain = k
      .replace(/å/g, "a")
      .replace(/ä/g, "a")
      .replace(/ö/g, "o")
      .replace(/õ/g, "o")
      .replace(/ü/g, "u")
      .replace(/š/g, "s")
      .replace(/ž/g, "z");
    if (b[plain]) return b[plain];
    /* och tvärtom: jonas finns, jônas skrivet -> jämför alla nycklar i enkel form */
    for (var key in b) {
      if (key.replace(/å/g, "a").replace(/ä/g, "a").replace(/ö/g, "o").replace(/õ/g, "o").replace(/ü/g, "u") === plain)
        return b[key];
    }
    return null;
  }
  function hasVoiceName() {
    return !!nameClip();
  }
  /* säger t.ex. "Tere, Anna!" genom att spela frasen och namnet efter varandra */
  function speakTo(leadId) {
    var lead = LEADS[leadId];
    if (!lead) return;
    var np = partFor(nameKey()) || partFor(lead.et);
    if (np) {
      loadPart(np, function () {
        speakTo(leadId);
      });
      return;
    }
    var a = bank()[lead.et],
      b = nameClip();
    if (a && b) {
      playChain([a, b]);
      return;
    }
    speak(lead.et);
  }
  var qlist = [];
  function playChain(srcs) {
    if (!S.sound) return;
    stopSpeak();
    qlist = srcs.slice(1);
    playSrc(srcs[0], 1);
  }
  function playSrc(src, rate) {
    try {
      if (!player) {
        player = new Audio();
        player.preload = "auto";
        player.addEventListener("ended", function () {
          if (qlist.length) {
            playSrc(qlist.shift(), 1);
          } else stopJaw();
        });
        /* om ett klipp inte går att spela: hoppa vidare i kön i stället för att tystna */
        player.addEventListener("error", function () {
          if (qlist.length) playSrc(qlist.shift(), 1);
          else stopJaw();
        });
      }
      var start = function () {
        try {
          ensureGraph();
          player.src = toBlob(src);
          player.playbackRate = rate || 1;
          var pr = player.play();
          if (pr && pr.then) {
            pr.then(function () {
              startJaw(!!AN);
            }).catch(function () {
              /* blob nekades – prova den inbäddade källan rakt av */
              try {
                player.src = src;
                var p2 = player.play();
                if (p2 && p2.then)
                  p2.then(function () {
                    startJaw(false);
                  }).catch(function () {
                    stopJaw();
                  });
                else startJaw(false);
              } catch (e2) {
                stopJaw();
              }
            });
          } else {
            startJaw(!!AN);
          }
        } catch (e) {
          stopJaw();
        }
      };
      /* vänta tills ljudmotorn är vaken – annars spelas klippet tyst */
      if (AC && AC.state !== "running") {
        var r = null;
        try {
          r = AC.resume();
        } catch (e) {}
        if (r && r.then) {
          r.then(start, start);
          setTimeout(function () {
            if (player && player.paused) start();
          }, 350);
          return;
        }
      }
      start();
    } catch (e) {
      stopJaw();
    }
  }
  /* sagan läses av en egen svensk berättarröst – Siiri talar bara estniska */
  function stopStory() {}
  function speak(text, slow) {
    if (!S.sound) return;
    var part = partFor(text);
    if (part) {
      loadPart(part, function () {
        speak(text, slow);
      });
      return;
    }
    if (slow) {
      var sp = slowPartFor(text);
      if (sp) {
        loadPart(sp, function () {
          speak(text, slow);
        });
        return;
      }
    }
    stopSpeak();
    var src = slow ? bank(true)[text] || bank()[text] : bank()[text];
    var haveSlow = !!(slow && bank(true)[text]);
    if (!src && etVoice) {
      try {
        var u = new SpeechSynthesisUtterance(text);
        u.voice = etVoice;
        u.lang = etVoice.lang;
        u.rate = slow ? 0.62 : 0.78;
        u.pitch = 1.1;
        u.onstart = function () {
          startJaw(false);
        };
        u.onend = function () {
          stopJaw();
        };
        u.onerror = function () {
          stopJaw();
        };
        speechSynthesis.speak(u);
        return;
      } catch (e) {}
    }
    if (!src) {
      /* glosord vars uttal inte hunnit hämtas än: hämta det och spela sedan */
      if (isSchoolWord(text))
        ttsNow(text, "normal").then(function (ok) {
          if (ok) speak(text, slow);
        });
      return;
    }
    qlist = [];
    playSrc(src, slow && !haveSlow ? 0.72 : 1);
  }
  /* säger flera ord i följd, som en mening */
  function speakSeq(list) {
    if (!S.sound || !list || !list.length) return;
    var i, p;
    for (i = 0; i < list.length; i++) {
      p = partFor(list[i]);
      if (p) {
        loadPart(p, function () {
          speakSeq(list);
        });
        return;
      }
    }
    var srcs = [];
    for (i = 0; i < list.length; i++) {
      var s = bank()[list[i]];
      if (s) srcs.push(s);
    }
    if (!srcs.length) return;
    stopSpeak();
    qlist = srcs.slice(1);
    playSrc(srcs[0], 1);
  }
  function speakSeqSlow(list) {
    if (!S.sound || !list || !list.length) return;
    var i, p;
    for (i = 0; i < list.length; i++) {
      p = partFor(list[i]);
      if (p) {
        loadPart(p, function () {
          speakSeqSlow(list);
        });
        return;
      }
    }
    for (i = 0; i < list.length; i++) {
      p = slowPartFor(list[i]);
      if (p) {
        loadPart(p, function () {
          speakSeqSlow(list);
        });
        return;
      }
    }
    var srcs = [];
    for (i = 0; i < list.length; i++) {
      var s = bank(true)[list[i]] || bank()[list[i]];
      if (s) srcs.push(s);
    }
    if (!srcs.length) return;
    stopSpeak();
    qlist = srcs.slice(1);
    playSrc(srcs[0], 1);
  }
  function voiceStatus() {
    return "Siiri talar med den estniska rösten Mari, byggd på studioinspelningar från Tartu universitet. 🐢 ger en långsammare inläsning av samma ord.";
  }

  /* ============ TAL IN ============ */
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var micOK = !!SR;
  var inFrame = false;
  try {
    inFrame = window.self !== window.top;
  } catch (e) {
    inFrame = true;
  }
  var micGranted = false,
    micBlocked = false,
    micLang = "et-EE";
  var APP_URL = "https://claude.ai/artifact/UTaGovPZDgwS6tZDM7yiRP";
  function appUrl() {
    /* inuti chattrutan är location.href en intern ram-adress som inte går att öppna direkt */
    return inFrame ? APP_URL : location.href;
  }
  function openTabHTML(txt) {
    return (
      '<a class="btn ghost" style="margin-top:8px" href="' +
      appUrl() +
      '" target="_blank" rel="noopener">' +
      (txt || "Öppna appen i egen flik 🎤") +
      "</a>"
    );
  }
  function micProblem(err) {
    if (err === "noSR") return "Den här webbläsaren kan inte lyssna. Prova Chrome, Edge eller Safari.";
    if (
      err === "NotAllowedError" ||
      err === "SecurityError" ||
      err === "not-allowed" ||
      err === "service-not-allowed"
    ) {
      micBlocked = true;
      return inFrame
        ? "Mikrofonen får inte användas här. Tryck på svaret i stället, eller öppna appen i egen flik och tillåt mikrofonen."
        : "Mikrofonen är avstängd. Tillåt mikrofon för sidan i webbläsaren och försök igen.";
    }
    if (err === "NotFoundError") return "Ingen mikrofon hittades på enheten.";
    if (err === "no-speech") return "Jag hörde inget. Prata lite närmare mikrofonen och prova igen.";
    if (err === "network") return "Rösttjänsten nås inte just nu. Prova igen om en stund.";
    return "Mikrofonen krånglar här. " + (inFrame ? "Prova att öppna appen i egen flik." : "Prova igen.");
  }
  /* ber om tillstånd först – det ger en tydlig fråga i stället för tyst nekande */
  function askMic(cb) {
    if (micBlocked) {
      cb("NotAllowedError");
      return;
    }
    if (micGranted) {
      cb(null);
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      micGranted = true;
      cb(null);
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (st) {
        try {
          st.getTracks().forEach(function (t) {
            t.stop();
          });
        } catch (e) {}
        micGranted = true;
        cb(null);
      })
      .catch(function (err) {
        var n = err && err.name ? err.name : "NotAllowedError";
        if (n === "NotAllowedError" || n === "SecurityError") micBlocked = true;
        cb(n);
      });
  }
  function listen(onResult, onEnd, onErr) {
    if (!SR) {
      onErr && onErr("noSR");
      return null;
    }
    askMic(function (permErr) {
      if (permErr) {
        onErr && onErr(permErr);
        onEnd && onEnd();
        return;
      }
      startSR(onResult, onEnd, onErr, false);
    });
    return null;
  }
  function startSR(onResult, onEnd, onErr, retried) {
    var r,
      done = false;
    try {
      r = new SR();
    } catch (e) {
      onErr && onErr("start");
      onEnd && onEnd();
      return;
    }
    r.lang = retried ? navigator.language || "en-US" : micLang;
    r.interimResults = false;
    r.maxAlternatives = 5;
    r.continuous = false;
    r.onresult = function (e) {
      done = true;
      var alts = [],
        i;
      for (i = 0; i < e.results[0].length; i++) {
        alts.push(e.results[0][i].transcript);
      }
      onResult(alts);
    };
    r.onerror = function (e) {
      if ((e.error === "language-not-supported" || e.error === "bad-grammar") && !retried) {
        micLang = navigator.language || "en-US";
        startSR(onResult, onEnd, onErr, true);
        return;
      }
      done = true;
      onErr && onErr(e.error);
    };
    r.onend = function () {
      onEnd && onEnd();
      if (!done) {
        /* tyst slut */
      }
    };
    try {
      r.start();
    } catch (e) {
      onErr && onErr("start");
      onEnd && onEnd();
    }
    /* nödbroms om motorn hänger sig */
    setTimeout(function () {
      if (!done) {
        try {
          r.stop();
        } catch (e) {}
      }
    }, 9000);
  }
  function norm(s) {
    return (s || "")
      .toLowerCase()
      .replace(/[.,!?;:"'`´]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  function loose(s) {
    return norm(s)
      .replace(/õ/g, "o")
      .replace(/ä/g, "a")
      .replace(/ö/g, "o")
      .replace(/ü/g, "u")
      .replace(/š/g, "s")
      .replace(/ž/g, "z")
      .replace(/(.)\1+/g, "$1");
  }
  function lev(a, b) {
    var m = a.length,
      n = b.length,
      d = [],
      i,
      j;
    for (i = 0; i <= m; i++) {
      d[i] = [i];
    }
    for (j = 0; j <= n; j++) {
      d[0][j] = j;
    }
    for (i = 1; i <= m; i++)
      for (j = 1; j <= n; j++) {
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
    return d[m][n];
  }
  function saidIt(alts, target) {
    var t = loose(target),
      i,
      a,
      tol = Math.max(1, Math.floor(t.length / 4));
    for (i = 0; i < alts.length; i++) {
      a = loose(alts[i]);
      if (a === t) return true;
      if (a.indexOf(t) >= 0) return true;
      if (lev(a, t) <= tol) return true;
    }
    return false;
  }

  /* ============ KONFETTI ============ */
  var fx = document.getElementById("fx"),
    ctx = null,
    parts = [],
    raf = null;
  try {
    ctx = fx.getContext("2d");
  } catch (e) {
    ctx = null;
  }
  function sizeFx() {
    if (!ctx) return;
    fx.width = innerWidth * devicePixelRatio;
    fx.height = innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  sizeFx();
  addEventListener("resize", sizeFx);
  var CONF = ["#F6B93B", "#C8305A", "#3B6CD4", "#2E6B45", "#FFFFFF", "#8A5A3B"];
  function burst(n) {
    if (!ctx) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var i,
      cx = innerWidth / 2,
      cy = innerHeight * 0.42;
    for (i = 0; i < (n || 70); i++) {
      parts.push({
        x: cx,
        y: cy,
        vx: (Math.random() - 0.5) * 11,
        vy: Math.random() * -11 - 3,
        s: 5 + Math.random() * 7,
        c: CONF[(Math.random() * CONF.length) | 0],
        a: 1,
        r: Math.random() * 6,
      });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function petals(n, cols) {
    if (!ctx) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (var i = 0; i < (n || 40); i++) {
      parts.push({
        snow: 1,
        petal: 1,
        x: Math.random() * innerWidth,
        y: -20 - Math.random() * innerHeight,
        vx: 0,
        vy: 0.5 + Math.random() * 0.9,
        s: 5 + Math.random() * 7,
        c: cols[(Math.random() * cols.length) | 0],
        a: 1,
        r: Math.random() * 6,
        w: Math.random() * 6.28,
      });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function snow(n) {
    if (!ctx) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (var i = 0; i < (n || 120); i++) {
      parts.push({
        snow: 1,
        x: Math.random() * innerWidth,
        y: -20 - Math.random() * innerHeight * 1.2,
        vx: 0,
        vy: 0.7 + Math.random() * 1.1,
        s: 3 + Math.random() * 6,
        c: "#FFFFFF",
        a: 1,
        r: Math.random() * 6,
        w: Math.random() * Math.PI * 2,
      });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  /* ballonger som stiger från botten, för de allra största firandena */
  function balloons(n) {
    if (!ctx) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (var i = 0; i < (n || 12); i++) {
      parts.push({
        balloon: 1,
        x: innerWidth * (0.08 + Math.random() * 0.84),
        y: innerHeight + 30 + Math.random() * 220,
        vy: -(1 + Math.random() * 0.9),
        s: 20 + Math.random() * 14,
        c: CONF[(Math.random() * CONF.length) | 0],
        a: 1,
        w: Math.random() * 6.28,
      });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      if (p.balloon) {
        p.w += 0.04;
        p.y += p.vy;
        p.x += Math.sin(p.w) * 0.7;
        if (p.y < -60) {
          parts.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = p.a;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.s * 0.62, p.s, 0, 0, 6.284);
        ctx.fillStyle = p.c;
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(p.x, p.y + p.s);
        ctx.lineTo(p.x, p.y + p.s + 22);
        ctx.strokeStyle = "rgba(255,255,255,.5)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
        continue;
      }
      if (p.snow) {
        p.w += 0.03;
        p.y += p.vy;
        p.x += Math.sin(p.w) * (p.petal ? 1.6 : 0.9);
        if (p.y > innerHeight + 20) {
          parts.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = p.petal ? 0.85 : 0.9;
        if (p.petal) {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.w);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.s / 2, p.s / 3.4, 0, 0, 6.284);
          ctx.fillStyle = p.c;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.s / 2, 0, 6.284);
          ctx.fillStyle = p.c;
          ctx.fill();
        }
        ctx.restore();
        continue;
      }
      p.vy += 0.42;
      p.x += p.vx;
      p.y += p.vy;
      p.r += 0.18;
      p.a -= 0.011;
      if (p.a <= 0 || p.y > innerHeight + 40) {
        parts.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = Math.max(p.a, 0);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
      ctx.restore();
    }
    if (parts.length) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = null;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
    }
  }

  /* ============ MASKOT: igelkotten Siiri ============ */
  /* kläder från garderoben, ritade ovanpå eller bakom bilden */
  /* små hjälpare så plaggen får volym: ljus uppifrån vänster, skugga där de möter pälsen */
  function gr(id, c1, c2, x1, y1, x2, y2) {
    return (
      '<linearGradient id="' +
      id +
      '" x1="' +
      (x1 || 0) +
      '" y1="' +
      (y1 || 0) +
      '" x2="' +
      (x2 || 0.35) +
      '" y2="' +
      (y2 || 1) +
      '">' +
      '<stop offset="0%" stop-color="' +
      c1 +
      '"/><stop offset="100%" stop-color="' +
      c2 +
      '"/></linearGradient>'
    );
  }
  function shine(id, op) {
    return (
      '<linearGradient id="' +
      id +
      '" x1="0" y1="0" x2="0.2" y2="1">' +
      '<stop offset="0%" stop-color="#fff" stop-opacity="' +
      (op || 0.45) +
      '"/>' +
      '<stop offset="55%" stop-color="#fff" stop-opacity="0"/></linearGradient>'
    );
  }
  function wearSVG(slot) {
    var id = wearing(slot);
    if (!id || !owns(id)) return "";
    if (id === "lill")
      return (
        "<g><defs>" +
        gr("g-lill", "#FFA8C6", "#E4548B") +
        "</defs>" +
        '<path d="M141 60 q4 -9 1 -15" stroke="#3E7A3C" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
        '<path d="M140 52 q-6 -3 -8 -8 q7 0 9 5" fill="#4E9A52"/>' +
        '<g transform="translate(140,42)">' +
        '<ellipse cx="0" cy="-6.4" rx="4.4" ry="6.4" fill="url(#g-lill)" stroke="#D0407A" stroke-width=".7"/>' +
        '<ellipse cx="6" cy="-2" rx="4.4" ry="6.4" fill="url(#g-lill)" stroke="#D0407A" stroke-width=".7" transform="rotate(72 6 -2)"/>' +
        '<ellipse cx="3.7" cy="5.2" rx="4.4" ry="6.4" fill="url(#g-lill)" stroke="#D0407A" stroke-width=".7" transform="rotate(144 3.7 5.2)"/>' +
        '<ellipse cx="-3.7" cy="5.2" rx="4.4" ry="6.4" fill="url(#g-lill)" stroke="#D0407A" stroke-width=".7" transform="rotate(216 -3.7 5.2)"/>' +
        '<ellipse cx="-6" cy="-2" rx="4.4" ry="6.4" fill="url(#g-lill)" stroke="#D0407A" stroke-width=".7" transform="rotate(288 -6 -2)"/>' +
        '<circle cx="0" cy="0" r="3.8" fill="#F6B93B"/><circle cx="-1.2" cy="-1.2" r="1.4" fill="#FFE9A8"/></g></g>'
      );
    if (id === "myts")
      return (
        "<g><defs>" +
        gr("g-myts", "#E8564020", "#A32A1A") +
        gr("g-myts2", "#F07A5E", "#C03A26") +
        shine("g-mytsS", 0.5) +
        gr("g-mytsB", "#FFFBF2", "#DCCBB2", 0, 0, 0.2, 1) +
        "</defs>" +
        '<path d="M60 58 q2 -34 40 -34 q38 0 40 34 z" fill="url(#g-myts2)"/>' +
        '<g stroke="#A5301F" stroke-width="1.1" opacity=".45" fill="none">' +
        '<path d="M74 55 q6 -22 18 -30"/><path d="M88 57 q3 -24 10 -32"/><path d="M104 57 q4 -24 12 -30"/>' +
        '<path d="M118 55 q2 -20 8 -26"/></g>' +
        '<path d="M60 58 q2 -34 40 -34 q10 0 18 6 q-30 6 -34 28 z" fill="url(#g-mytsS)"/>' +
        '<rect x="55" y="52" width="90" height="13" rx="6.5" fill="url(#g-mytsB)"/>' +
        '<path d="M55 58 h90" stroke="#C9B8A0" stroke-width="1" opacity=".5"/>' +
        '<path d="M60 58 q40 7 80 0" stroke="#7E2416" stroke-width="1.6" fill="none" opacity=".45"/>' +
        '<circle cx="100" cy="20" r="9" fill="url(#g-mytsB)"/>' +
        '<circle cx="97" cy="17" r="3.4" fill="#fff" opacity=".8"/></g>'
      );
    if (id === "talv")
      return (
        "<g><defs>" +
        gr("g-talv", "#5FA0E0", "#1C4E8E") +
        shine("g-talvS", 0.42) +
        gr("g-talvB", "#FFFFFF", "#CFDDEA", 0, 0, 0.2, 1) +
        "</defs>" +
        '<path d="M58 58 q2 -36 42 -36 q40 0 42 36 z" fill="url(#g-talv)"/>' +
        '<g stroke="#17457E" stroke-width="1.2" opacity=".4" fill="none">' +
        '<path d="M72 56 q6 -24 18 -32"/><path d="M88 57 q3 -26 10 -34"/><path d="M106 57 q4 -26 12 -32"/><path d="M120 55 q2 -22 8 -28"/></g>' +
        '<path d="M58 58 q2 -36 42 -36 q10 0 18 6 q-32 6 -36 30 z" fill="url(#g-talvS)"/>' +
        '<g opacity=".92"><path d="M100 30 v13 M93.5 33.5 l13 6.5 M106.5 33.5 l-13 6.5" stroke="#EAF3FC" stroke-width="2.6" stroke-linecap="round"/>' +
        '<circle cx="100" cy="36.5" r="2" fill="#EAF3FC"/></g>' +
        '<rect x="53" y="51" width="94" height="14" rx="7" fill="url(#g-talvB)"/>' +
        '<g stroke="#C3D3E2" stroke-width="1" opacity=".7"><path d="M62 51 v14 M76 51 v14 M90 51 v14 M104 51 v14 M118 51 v14 M132 51 v14"/></g>' +
        '<circle cx="100" cy="15" r="10.5" fill="url(#g-talvB)"/>' +
        '<circle cx="96.5" cy="11.5" r="3.6" fill="#fff" opacity=".85"/></g>'
      );
    if (id === "kroon")
      return (
        "<g><defs>" +
        '<linearGradient id="g-kroon" x1="0" y1="0" x2="0.3" y2="1">' +
        '<stop offset="0%" stop-color="#FFE9A0"/><stop offset="38%" stop-color="#F7C53F"/>' +
        '<stop offset="62%" stop-color="#E5A413"/><stop offset="100%" stop-color="#B87A05"/></linearGradient>' +
        '<linearGradient id="g-kroonB" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="#FFF0BC"/><stop offset="50%" stop-color="#F5C63A"/>' +
        '<stop offset="100%" stop-color="#C98A06"/></linearGradient>' +
        "</defs>" +
        '<path d="M66 54 L70 24 L84 40 L100 18 L116 40 L130 24 L134 54 Z" fill="url(#g-kroon)" stroke="#8E5D02" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<path d="M70 26 L82 39 L100 21 L118 39 L130 26" fill="none" stroke="#FFF3C8" stroke-width="1.6" opacity=".75"/>' +
        '<rect x="63" y="49" width="74" height="11" rx="5.5" fill="url(#g-kroon)" stroke="#8E5D02" stroke-width="1.4"/>' +
        '<path d="M65 52 h70" stroke="#FFF3C8" stroke-width="1.6" opacity=".7"/>' +
        '<g><circle cx="100" cy="30" r="4.6" fill="#D33B62"/><circle cx="98.6" cy="28.6" r="1.6" fill="#fff" opacity=".75"/>' +
        '<circle cx="78" cy="42" r="3.4" fill="#3B6CD4"/><circle cx="77" cy="41" r="1.2" fill="#fff" opacity=".7"/>' +
        '<circle cx="122" cy="42" r="3.4" fill="#2E8B57"/><circle cx="121" cy="41" r="1.2" fill="#fff" opacity=".7"/>' +
        '<circle cx="70" cy="24" r="2.6" fill="#FFF0BC"/><circle cx="100" cy="18" r="2.8" fill="#FFF0BC"/><circle cx="130" cy="24" r="2.6" fill="#FFF0BC"/></g></g>'
      );
    if (id === "lips")
      return (
        "<g><defs>" +
        gr("g-lips", "#F0567E", "#9E1F42") +
        shine("g-lipsS", 0.5) +
        "</defs>" +
        '<path d="M100 137 q-12 -11 -21 -9 q-5 9 0 18 q10 2 21 -9 z" fill="url(#g-lips)" stroke="#8A1937" stroke-width="1.1"/>' +
        '<path d="M100 137 q12 -11 21 -9 q5 9 0 18 q-10 2 -21 -9 z" fill="url(#g-lips)" stroke="#8A1937" stroke-width="1.1"/>' +
        '<path d="M100 137 q-11 -10 -19 -8 q-2 4 -1 8 z" fill="url(#g-lipsS)"/>' +
        '<path d="M100 137 q11 -10 19 -8 q2 4 1 8 z" fill="url(#g-lipsS)"/>' +
        '<ellipse cx="100" cy="137" rx="5.6" ry="5" fill="#B82A52" stroke="#8A1937" stroke-width="1"/>' +
        '<ellipse cx="98.4" cy="135.4" rx="2" ry="1.6" fill="#fff" opacity=".5"/></g>'
      );
    if (id === "sall")
      return (
        "<g><defs>" +
        gr("g-sall", "#49A972", "#1E6B40") +
        shine("g-sallS", 0.3) +
        "</defs>" +
        '<path d="M124 140 q11 15 7 27 l15 3 q4 -17 -5 -28 z" fill="#1E6B40"/>' +
        '<path d="M126 142 q10 14 6 25 l11 2 q3 -15 -4 -25 z" fill="url(#g-sall)"/>' +
        '<g stroke="#8FE0B4" stroke-width="2.4" opacity=".75"><path d="M129 157 q7 1 11 2"/><path d="M131 149 q7 1 11 2"/></g>' +
        '<path d="M56 127 q44 21 88 0 l3 14 q-47 23 -94 0 z" fill="url(#g-sall)"/>' +
        '<g stroke="#8FE0B4" stroke-width="2.6" opacity=".8" fill="none">' +
        '<path d="M58 131 q42 19 84 0"/><path d="M57 137 q43 20 86 0"/></g>' +
        '<path d="M56 127 q44 21 88 0 l1 5 q-45 21 -90 0 z" fill="url(#g-sallS)"/>' +
        "" +
        '<path d="M57 140 q43 21 86 0" stroke="#145233" stroke-width="1.6" opacity=".5" fill="none"/></g>'
      );
    if (id === "kott")
      return (
        {
          /* väskan centrerad på ryggen (syns bakifrån); remmarna går över axlarna
             och syns framifrån - tillsammans syns hela ryggsäcken bakifrån */
          back:
            "<g><defs>" +
            gr("g-kott", "#E04A74", "#8E1838") +
            "</defs>" +
            '<rect x="74" y="118" width="52" height="55" rx="14" fill="url(#g-kott)" stroke="#7A1430" stroke-width="1.4"/>' +
            '<rect x="80" y="134" width="40" height="20" rx="8" fill="#9E1F42" stroke="#7A1430" stroke-width="1"/>' +
            '<rect x="80" y="134" width="40" height="8" rx="4" fill="#F07A9C" opacity=".35"/>' +
            '<rect x="92" y="114" width="16" height="9" rx="4.5" fill="none" stroke="#7A1430" stroke-width="2.4"/></g>',
          front:
            '<g><path d="M70 122 q-15 7 -19 22" stroke="#7A1430" stroke-width="6" fill="none" stroke-linecap="round"/>' +
            '<path d="M70 122 q-15 7 -19 22" stroke="#C8305A" stroke-width="3.6" fill="none" stroke-linecap="round"/>' +
            '<path d="M132 122 q15 7 19 22" stroke="#7A1430" stroke-width="6" fill="none" stroke-linecap="round"/>' +
            '<path d="M132 122 q15 7 19 22" stroke="#C8305A" stroke-width="3.6" fill="none" stroke-linecap="round"/>' +
            '<rect x="60" y="130" width="9" height="7" rx="2" fill="#E0C05A" stroke="#A8871F" stroke-width=".8"/>' +
            '<rect x="131" y="130" width="9" height="7" rx="2" fill="#E0C05A" stroke="#A8871F" stroke-width=".8"/></g>',
          /* bakifrån går remmarna uppåt över axlarna (inte nedåt som "front"-
             varianten, som bara stämmer sedd framifrån) - används av siilBackSVG */
          rear:
            '<g><path d="M82 119 Q55 100 58 48" stroke="#7A1430" stroke-width="6" fill="none" stroke-linecap="round"/>' +
            '<path d="M82 119 Q55 100 58 48" stroke="#C8305A" stroke-width="3.6" fill="none" stroke-linecap="round"/>' +
            '<path d="M118 119 Q145 100 142 48" stroke="#7A1430" stroke-width="6" fill="none" stroke-linecap="round"/>' +
            '<path d="M118 119 Q145 100 142 48" stroke="#C8305A" stroke-width="3.6" fill="none" stroke-linecap="round"/>' +
            '<rect x="73" y="110" width="9" height="7" rx="2" fill="#E0C05A" stroke="#A8871F" stroke-width=".8" transform="rotate(-20 77.5 113.5)"/>' +
            '<rect x="118" y="110" width="9" height="7" rx="2" fill="#E0C05A" stroke="#A8871F" stroke-width=".8" transform="rotate(20 122.5 113.5)"/></g>',
        }[arguments[1] || "front"] || ""
      );
    if (id === "rukkilill")
      return (
        '<g><path d="M141 60 q4 -9 1 -15" stroke="#3E7A3C" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
        '<g transform="translate(140,42)">' +
        '<g transform="scale(1.35)">' +
        '<path d="M0 -9 l3 -5 3 5 5 -1 -2 6 5 3 -5 3 2 6 -5 -1 -3 5 -3 -5 -5 1 2 -6 -5 -3 5 -3 -2 -6 z" fill="#3B6CD4"/>' +
        '<path d="M0 -7 l2 -3 2 3 4 -1 -2 4 4 2 -4 2 2 5 -4 -1 -2 4 -2 -4 -4 1 2 -5 -4 -2 4 -2 -2 -4 z" fill="#5C8BEA" opacity=".8"/>' +
        '</g><circle cx="0" cy="0" r="3.2" fill="#152F6E"/><circle cx="-1" cy="-1" r="1.1" fill="#7FA8F0"/></g></g>'
      );
    if (id === "leib")
      return (
        '<g><rect x="118" y="130" width="30" height="20" rx="6" fill="#4A2F1E" transform="rotate(-10 133 140)"/>' +
        '<rect x="122" y="134" width="22" height="12" rx="4" fill="#6B452B" transform="rotate(-10 133 140)"/>' +
        '<circle cx="128" cy="139" r="1.6" fill="#8A6141"/><circle cx="136" cy="142" r="1.4" fill="#8A6141"/></g>'
      );
    if (id === "kihnu")
      return (
        "<g><defs>" +
        gr("g-kih", "#E4553F", "#9E211A") +
        "</defs>" +
        '<path d="M62 146 q38 16 76 0 l6 40 q-44 20 -88 0 z" fill="url(#g-kih)" stroke="#8E1F18" stroke-width="1"/>' +
        '<g fill="none">' +
        '<path d="M62.6 152 q37.4 16 74.8 0" stroke="#F4D93C" stroke-width="4.2"/>' +
        '<path d="M63.4 160 q36.6 15.5 73.2 0" stroke="#2B4CA8" stroke-width="4.2"/>' +
        '<path d="M64.2 168 q35.8 15 71.6 0" stroke="#F4D93C" stroke-width="4.2"/>' +
        '<path d="M65 176 q35 14.5 70 0" stroke="#1E7A4A" stroke-width="4.2"/>' +
        '<path d="M65.8 184 q34.2 14 68.4 0" stroke="#F4D93C" stroke-width="3.4"/></g>' +
        '<path d="M62 146 q38 16 76 0 l1 6 q-39 17 -78 0 z" fill="#fff" opacity=".22"/></g>'
      );
    if (id === "rahvas")
      return (
        "<g><defs>" +
        gr("g-blus", "#FFFDF6", "#DCD2BE") +
        gr("g-liiv", "#3A3430", "#15120F") +
        gr("g-fork", "#E4553F", "#A8281F") +
        "</defs>" +
        '<path d="M60 142 q40 18 80 0 l7 44 q-47 22 -94 0 z" fill="url(#g-blus)" stroke="#CFC3AC" stroke-width="1"/>' +
        '<path d="M60 142 q40 18 80 0 l2 10 q-42 19 -84 0 z" fill="#FFFFFF" opacity=".55"/>' +
        '<path d="M74 142 q26 12 52 0 l4 27 q-30 14 -60 0 z" fill="url(#g-liiv)" stroke="#0C0A08" stroke-width="1"/>' +
        '<g stroke="#D94334" stroke-width="2.8" fill="none" opacity=".95">' +
        '<path d="M76 147 q24 10 48 0"/><path d="M77 154 q23 10 46 0"/><path d="M78 161 q22 10 44 0"/></g>' +
        '<g stroke="#F4D93C" stroke-width="1.3" fill="none" opacity=".9">' +
        '<path d="M76.5 150.5 q23.5 10 47 0"/><path d="M77.5 157.5 q22.5 10 45 0"/></g>' +
        '<path d="M100 142 v27" stroke="#F4D93C" stroke-width="1.2" opacity=".8"/>' +
        '<path d="M62 170 q38 16 76 0 l2 13 q-40 18 -80 0 z" fill="url(#g-fork)" stroke="#8E1F18" stroke-width="1"/>' +
        '<g stroke="#F4D93C" stroke-width="2.2" fill="none" opacity=".95">' +
        '<path d="M63.5 175 q36.5 15 73 0"/><path d="M64.5 180.5 q35.5 15 71 0"/></g>' +
        '<circle cx="100" cy="141" r="3.6" fill="#D6DDE4" stroke="#8E99A6" stroke-width=".9"/>' +
        '<circle cx="98.8" cy="139.8" r="1.2" fill="#fff"/></g>'
      );
    if (id === "mulgi")
      return (
        "<g><defs>" +
        gr("g-mulgi", "#3A3430", "#121010") +
        "</defs>" +
        '<path d="M58 140 q42 18 84 0 l6 48 q-48 22 -96 0 z" fill="url(#g-mulgi)" stroke="#0B0A09" stroke-width="1"/>' +
        '<path d="M58 140 q42 18 84 0 l1 8 q-43 19 -86 0 z" fill="#fff" opacity=".12"/>' +
        '<g stroke="#D94334" stroke-width="3.2" fill="none">' +
        '<path d="M59.5 147 q40.5 17 81 0"/><path d="M61 161 q39 16 78 0"/></g>' +
        '<g stroke="#F4D93C" stroke-width="1.1" fill="none" opacity=".85">' +
        '<path d="M59.8 150.5 q40.2 17 80.4 0"/><path d="M61.3 164.5 q38.7 16 77.4 0"/></g>' +
        '<path d="M100 142 v46" stroke="#D94334" stroke-width="2.6" opacity=".85"/>' +
        '<g><circle cx="100" cy="152" r="3.8" fill="#E8CC66" stroke="#A8871F" stroke-width=".9"/>' +
        '<circle cx="98.8" cy="150.8" r="1.2" fill="#FFF3C8"/>' +
        '<circle cx="100" cy="167" r="3.8" fill="#E8CC66" stroke="#A8871F" stroke-width=".9"/>' +
        '<circle cx="98.8" cy="165.8" r="1.2" fill="#FFF3C8"/></g></g>'
      );
    if (id === "hobekee")
      return (
        "<g><defs>" +
        gr("g-hob", "#F2F6FA", "#8E9AA8") +
        gr("g-hob2", "#FFFFFF", "#A9B4C0") +
        "</defs>" +
        '<path d="M70 131 q30 17 60 0" stroke="#9EAAB8" stroke-width="3.4" fill="none"/>' +
        '<path d="M70 130 q30 17 60 0" stroke="#EDF2F7" stroke-width="1.4" fill="none" opacity=".9"/>' +
        '<circle cx="100" cy="147" r="16" fill="url(#g-hob)" stroke="#7E8A99" stroke-width="1.2"/>' +
        '<circle cx="100" cy="147" r="11.5" fill="url(#g-hob2)" stroke="#8E99A6" stroke-width="1"/>' +
        '<g stroke="#8E99A6" stroke-width="1.3" opacity=".9">' +
        '<path d="M100 136 v22 M89 147 h22 M92.2 139.2 l15.6 15.6 M107.8 139.2 l-15.6 15.6"/></g>' +
        '<circle cx="100" cy="147" r="4.4" fill="#F4F8FB" stroke="#9EAAB8" stroke-width="1"/>' +
        '<circle cx="98.4" cy="145.4" r="1.6" fill="#fff"/>' +
        '<circle cx="80" cy="136" r="4.4" fill="url(#g-hob2)" stroke="#8E99A6" stroke-width=".9"/>' +
        '<circle cx="120" cy="136" r="4.4" fill="url(#g-hob2)" stroke="#8E99A6" stroke-width=".9"/></g>'
      );
    if (id === "kannel")
      return (
        '<g><path d="M112 128 l36 8 l-6 22 l-30 -8 z" fill="#B07C42" transform="rotate(-6 130 143)"/>' +
        '<path d="M114 132 l30 7 l-4 14 l-26 -7 z" fill="#8A5B2A" transform="rotate(-6 130 143)"/>' +
        '<g stroke="#F0E3C8" stroke-width="1" opacity=".9" transform="rotate(-6 130 143)">' +
        '<path d="M114 134 l30 7 M114 138 l30 7 M114 142 l30 7 M114 146 l29 7"/></g></g>'
      );
    if (id === "torupill")
      return (
        '<g><ellipse cx="128" cy="146" rx="18" ry="14" fill="#C8302F" transform="rotate(-12 128 146)"/>' +
        '<path d="M120 134 l-8 -22" stroke="#8A5B2A" stroke-width="5" stroke-linecap="round"/>' +
        '<path d="M136 134 l10 -18" stroke="#8A5B2A" stroke-width="4" stroke-linecap="round"/>' +
        '<path d="M140 152 l16 6" stroke="#8A5B2A" stroke-width="4" stroke-linecap="round"/>' +
        '<circle cx="112" cy="112" r="4" fill="#E0C05A"/></g>'
      );
    if (id === "paasuke2")
      return (
        {
          back: "",
          front:
            '<g transform="translate(42,110) scale(1.05)"><path d="M0 0 q-16 -10 -30 -4 q14 4 22 12 q10 10 22 8 q-10 -6 -14 -16 z" fill="#2B3A56"/>' +
            '<ellipse cx="4" cy="2" rx="13" ry="9" fill="#2B3A56"/><circle cx="14" cy="-2" r="6" fill="#2B3A56"/>' +
            '<path d="M16 2 q6 -1 9 2 q-6 2 -9 0 z" fill="#E8A33C"/><circle cx="16" cy="-4" r="1.6" fill="#fff"/>' +
            '<path d="M12 6 q6 4 12 2 q-4 6 -12 2 z" fill="#C8302F"/>' +
            '<path d="M-8 6 q-18 10 -30 8 q14 -2 22 -10 z" fill="#1E2A40"/></g>',
        }[arguments[1] || "front"] || ""
      );
    if (id === "jaanituli")
      return (
        '<g><ellipse cx="100" cy="186" rx="86" ry="18" fill="#FF9A3C" opacity=".3"/>' +
        '<g opacity=".92" transform="translate(-72,-6)">' +
        '<path d="M100 192 q-14 -16 -5 -30 q2 9 9 12 q-4 -14 7 -23 q-2 16 9 25 q5 7 -2 16 z" fill="#FF7A1A"/>' +
        '<path d="M100 192 q-7 -11 -2 -19 q2 7 7 9 q-2 -9 4 -14 q0 10 5 17 q4 5 -2 9 z" fill="#FFD45E"/></g>' +
        '<g opacity=".92" transform="translate(72,-6)">' +
        '<path d="M100 192 q-14 -16 -5 -30 q2 9 9 12 q-4 -14 7 -23 q-2 16 9 25 q5 7 -2 16 z" fill="#FF7A1A"/>' +
        '<path d="M100 192 q-7 -11 -2 -19 q2 7 7 9 q-2 -9 4 -14 q0 10 5 17 q4 5 -2 9 z" fill="#FFD45E"/></g>' +
        '<g fill="#FFC24D"><circle cx="66" cy="150" r="2.4"/><circle cx="138" cy="140" r="2"/><circle cx="82" cy="120" r="1.8"/>' +
        '<circle cx="124" cy="112" r="2.2"/><circle cx="52" cy="176" r="2"/><circle cx="152" cy="168" r="1.8"/></g></g>'
      );
    if (id === "jaatis")
      return (
        "<g><defs>" +
        gr("g-strut", "#F0C489", "#B9873F") +
        "</defs>" +
        '<path d="M131 152 l-6 -16 h15 z" fill="url(#g-strut)" stroke="#9E7030" stroke-width=".8"/>' +
        '<g stroke="#9E7030" stroke-width=".7" opacity=".7">' +
        '<path d="M126.5 139 l10 4 M127.5 143 l8 3 M129 147 l5 2"/></g>' +
        '<circle cx="127.5" cy="133" r="7.4" fill="#F9D7E4" stroke="#E0A9BE" stroke-width=".8"/>' +
        '<circle cx="134.5" cy="136" r="6.2" fill="#FBEBC0" stroke="#DCC78E" stroke-width=".8"/>' +
        '<circle cx="132" cy="127.5" r="6.4" fill="#C7EAD8" stroke="#98C8B0" stroke-width=".8"/>' +
        '<circle cx="125.6" cy="130.6" r="2.2" fill="#fff" opacity=".7"/>' +
        '<path d="M133 122 q2 -4 5 -2" stroke="#C8305A" stroke-width="1.6" fill="none"/>' +
        '<circle cx="133" cy="121.5" r="2.4" fill="#D33B62"/></g>'
      );
    if (id === "raamat")
      return (
        '<g transform="rotate(-8 131 142)"><defs>' +
        gr("g-raam", "#D24A40", "#8E241F") +
        "</defs>" +
        '<rect x="117" y="131" width="28" height="22" rx="2" fill="url(#g-raam)" stroke="#6E1A16" stroke-width="1"/>' +
        '<rect x="119.5" y="133" width="23" height="18" rx="1.5" fill="#F7EEDC" stroke="#D8C9AC" stroke-width=".8"/>' +
        '<path d="M131 133 v18" stroke="#C9B79A" stroke-width="1.8"/>' +
        '<g stroke="#A8957C" stroke-width="1.1" opacity=".9">' +
        '<path d="M122 137 h7 M122 141 h7 M122 145 h5 M133.5 137 h7 M133.5 141 h7 M133.5 145 h5"/></g>' +
        '<path d="M117 131 h28 v3 h-28 z" fill="#fff" opacity=".18"/>' +
        '<path d="M131 131 v22" stroke="#6E1A16" stroke-width="1.6"/></g>'
      );
    if (id === "suusad")
      return (
        '<g><path d="M112 156 q18 -4 36 -2" stroke="#2F6FB5" stroke-width="5" fill="none" stroke-linecap="round"/>' +
        '<path d="M112 163 q18 -4 36 -2" stroke="#D2442F" stroke-width="5" fill="none" stroke-linecap="round"/>' +
        '<path d="M146 120 v34" stroke="#8A6B4E" stroke-width="3" stroke-linecap="round"/>' +
        '<circle cx="146" cy="152" r="4" fill="none" stroke="#8A6B4E" stroke-width="2"/></g>'
      );
    if (id === "vihmav")
      return (
        '<g><path d="M146 118 v34 q0 8 -8 8" stroke="#6B4A2E" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<path d="M120 118 q26 -26 52 0 q-13 -8 -26 -8 q-13 0 -26 8 Z" fill="#C8305A"/>' +
        '<path d="M120 118 q13 -8 26 -8 q13 0 26 8 q-13 10 -26 0 q-13 10 -26 0 Z" fill="#E8557E"/></g>'
      );
    if (id === "lipp")
      return (
        '<g><path d="M136 118 v42" stroke="#8A6B4E" stroke-width="3" stroke-linecap="round"/>' +
        '<rect x="138" y="118" width="34" height="8" fill="#0072CE"/>' +
        '<rect x="138" y="126" width="34" height="8" fill="#111"/>' +
        '<rect x="138" y="134" width="34" height="8" fill="#FFF"/>' +
        '<rect x="138" y="118" width="34" height="24" fill="none" stroke="#B8A88E" stroke-width="1"/></g>'
      );
    if (id === "parg")
      return (
        '<g><path d="M52 54 q48 -30 96 0" stroke="#4E9A68" stroke-width="5" fill="none" stroke-linecap="round"/>' +
        '<circle cx="62" cy="50" r="6" fill="#FF7FA8"/><circle cx="82" cy="40" r="6.5" fill="#FFD45E"/>' +
        '<circle cx="100" cy="36" r="7" fill="#FF9BC0"/><circle cx="118" cy="40" r="6.5" fill="#C9A7F5"/>' +
        '<circle cx="138" cy="50" r="6" fill="#FFD45E"/>' +
        '<circle cx="100" cy="36" r="2.6" fill="#fff"/><circle cx="82" cy="40" r="2.2" fill="#fff"/></g>'
      );
    if (id === "jaanip")
      return (
        '<g><path d="M52 54 q48 -32 96 0" stroke="#3E8C5A" stroke-width="6" fill="none" stroke-linecap="round"/>' +
        '<circle cx="66" cy="48" r="6" fill="#FFF2B0"/><circle cx="66" cy="48" r="2.4" fill="#F0A81E"/>' +
        '<circle cx="88" cy="38" r="7" fill="#FFF2B0"/><circle cx="88" cy="38" r="2.8" fill="#F0A81E"/>' +
        '<circle cx="112" cy="38" r="7" fill="#FFF2B0"/><circle cx="112" cy="38" r="2.8" fill="#F0A81E"/>' +
        '<circle cx="134" cy="48" r="6" fill="#FFF2B0"/><circle cx="134" cy="48" r="2.4" fill="#F0A81E"/>' +
        '<path d="M76 46 q6 -8 14 -6 M124 46 q-6 -8 -14 -6" stroke="#5FAE72" stroke-width="3" fill="none" stroke-linecap="round"/></g>'
      );
    if (id === "lehed")
      return (
        '<g><path d="M54 54 q46 -28 92 0" stroke="#8A5A2B" stroke-width="5" fill="none" stroke-linecap="round"/>' +
        '<path d="M68 50 q-8 -12 2 -18 q10 6 4 18 z" fill="#D9762F"/>' +
        '<path d="M92 40 q-8 -13 2 -19 q11 6 5 19 z" fill="#E0A14A"/>' +
        '<path d="M116 40 q8 -13 -2 -19 q-11 6 -5 19 z" fill="#C25A28"/>' +
        '<path d="M138 50 q8 -12 -2 -18 q-10 6 -4 18 z" fill="#D9A93F"/></g>'
      );
    if (id === "joulum")
      return (
        '<g><path d="M60 58 q4 -34 42 -34 q30 0 38 22 q-16 14 -80 12 z" fill="#C42B2B"/>' +
        '<rect x="55" y="52" width="90" height="12" rx="6" fill="#FBF6EE"/>' +
        '<circle cx="140" cy="44" r="9" fill="#FBF6EE"/></g>'
      );
    if (id === "smvsall")
      return (
        '<g><path d="M56 128 q44 20 88 0 l3 13 q-47 22 -94 0 z" fill="#0072CE"/>' +
        '<path d="M57 133 q43 19 86 0 l1 5 q-44 20 -88 0 z" fill="#111"/>' +
        '<path d="M58 138 q42 18 84 0 l1 4 q-43 19 -86 0 z" fill="#F4F1EA"/>' +
        '<path d="M124 141 q10 14 6 26 l14 3 q4 -16 -4 -27 z" fill="#0072CE"/>' +
        '<path d="M126 152 h15 M127 158 h15" stroke="#F4F1EA" stroke-width="3"/></g>'
      );
    if (id === "ring")
      return (
        {
          back: "",
          front:
            '<g><circle cx="100" cy="128" r="62" fill="none" stroke="#F4F1EA" stroke-width="15"/>' +
            '<circle cx="100" cy="128" r="62" fill="none" stroke="#E2453C" stroke-width="15" stroke-dasharray="46 46" stroke-dashoffset="23"/></g>',
        }[arguments[1] || "front"] || ""
      );
    if (id === "sara")
      return (
        '<g><circle cx="100" cy="104" r="86" fill="url(#sg-aura)"/>' +
        '<g fill="#FFE9A8"><path d="M26 44 l2.6 6 6 .8 -4.4 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.4-4.2 6-.8 z"/>' +
        '<path d="M172 56 l2.2 5 5 .7 -3.6 3.5 1 5-4.6-2.5-4.6 2.5 1-5-3.6-3.5 5-.7 z"/>' +
        '<path d="M164 150 l2 4.6 4.6.6 -3.3 3.2.9 4.6-4.2-2.3-4.2 2.3.9-4.6-3.3-3.2 4.6-.6 z"/>' +
        '<path d="M34 148 l2 4.6 4.6.6 -3.3 3.2.9 4.6-4.2-2.3-4.2 2.3.9-4.6-3.3-3.2 4.6-.6 z"/></g></g>'
      );
    if (id === "tuli")
      return (
        '<g opacity=".95">' +
        '<g stroke="#FFD45E" stroke-width="2" stroke-linecap="round">' +
        '<path d="M32 40 v-14 M32 40 l-10 -10 M32 40 l10 -10 M32 40 l-14 0 M32 40 l14 0"/></g>' +
        '<g stroke="#FF7FA8" stroke-width="2" stroke-linecap="round">' +
        '<path d="M168 52 v-12 M168 52 l-9 -9 M168 52 l9 -9 M168 52 l-12 0 M168 52 l12 0"/></g>' +
        '<g stroke="#8FD3F4" stroke-width="2" stroke-linecap="round">' +
        '<path d="M150 22 v-10 M150 22 l-8 -8 M150 22 l8 -8"/></g></g>'
      );
    if (id === "vikerkaar")
      return (
        '<g opacity=".9">' +
        '<path d="M6 176 a94 94 0 0 1 188 0" fill="none" stroke="#E2453C" stroke-width="9"/>' +
        '<path d="M15 176 a85 85 0 0 1 170 0" fill="none" stroke="#F0A81E" stroke-width="9"/>' +
        '<path d="M24 176 a76 76 0 0 1 152 0" fill="none" stroke="#F3D34A" stroke-width="9"/>' +
        '<path d="M33 176 a67 67 0 0 1 134 0" fill="none" stroke="#5FAE72" stroke-width="9"/>' +
        '<path d="M42 176 a58 58 0 0 1 116 0" fill="none" stroke="#4E8ED2" stroke-width="9"/>' +
        '<path d="M51 176 a49 49 0 0 1 98 0" fill="none" stroke="#9B72D0" stroke-width="9"/></g>'
      );
    if (id === "taevas")
      return (
        '<g><circle cx="100" cy="100" r="99" fill="#1B2A55"/>' +
        '<circle cx="100" cy="100" r="99" fill="url(#sg-night)"/>' +
        '<g fill="#FFF6C8"><circle cx="30" cy="34" r="2.4"/><circle cx="58" cy="18" r="1.6"/><circle cx="92" cy="26" r="2"/>' +
        '<circle cx="132" cy="16" r="1.8"/><circle cx="168" cy="38" r="2.4"/><circle cx="180" cy="80" r="1.8"/>' +
        '<circle cx="18" cy="76" r="2"/><circle cx="24" cy="128" r="1.7"/><circle cx="176" cy="132" r="2.1"/>' +
        '<circle cx="150" cy="60" r="1.5"/><circle cx="46" cy="52" r="1.5"/></g>' +
        '<circle cx="158" cy="30" r="13" fill="#FBF3D0"/><circle cx="152" cy="26" r="11" fill="#1B2A55"/></g>'
      );
    if (id === "virmalised")
      return (
        '<g><circle cx="100" cy="100" r="99" fill="#0E1B3A"/>' +
        '<path d="M0 70 q50 -34 100 -6 q50 28 100 -8 v34 q-50 34 -100 6 q-50 -28 -100 8 z" fill="#3FE0A8" opacity=".55"/>' +
        '<path d="M0 92 q50 -30 100 -4 q50 26 100 -6 v26 q-50 30 -100 4 q-50 -26 -100 6 z" fill="#7BE8F5" opacity=".45"/>' +
        '<path d="M0 116 q50 -26 100 -2 q50 24 100 -4 v22 q-50 26 -100 2 q-50 -24 -100 4 z" fill="#B78BF0" opacity=".38"/>' +
        '<g fill="#FFFDF0"><circle cx="26" cy="26" r="2"/><circle cx="70" cy="14" r="1.6"/><circle cx="120" cy="20" r="2.2"/>' +
        '<circle cx="170" cy="28" r="1.8"/><circle cx="184" cy="96" r="2"/><circle cx="14" cy="104" r="1.7"/></g></g>'
      );
    if (id === "kosmos")
      return (
        '<g><circle cx="100" cy="100" r="99" fill="#070B22"/>' +
        '<g fill="#FFFDF0"><circle cx="22" cy="30" r="2.2"/><circle cx="56" cy="14" r="1.5"/><circle cx="96" cy="22" r="2.6"/>' +
        '<circle cx="140" cy="12" r="1.8"/><circle cx="176" cy="34" r="2.2"/><circle cx="186" cy="88" r="1.6"/>' +
        '<circle cx="12" cy="86" r="2"/><circle cx="20" cy="140" r="1.8"/><circle cx="182" cy="140" r="2.4"/>' +
        '<circle cx="64" cy="176" r="1.6"/><circle cx="140" cy="182" r="2"/></g>' +
        '<circle cx="36" cy="46" r="15" fill="#E8894A"/><ellipse cx="36" cy="46" rx="24" ry="6" fill="none" stroke="#F3D34A" stroke-width="3" transform="rotate(-18 36 46)"/>' +
        '<circle cx="168" cy="66" r="9" fill="#7BA7F0"/>' +
        '<g transform="rotate(24 160 150)"><path d="M156 158 l4 -16 4 16 z" fill="#E2453C"/>' +
        '<path d="M154 158 h12 l-2 6 h-8 z" fill="#D9DEE8"/><circle cx="160" cy="148" r="2.4" fill="#8FD3F4"/></g>' +
        '<g fill="#FFD45E" opacity=".9"><path d="M78 168 l2 5 5 .7 -3.6 3.5 1 5-4.4-2.4-4.4 2.4 1-5-3.6-3.5 5-.7 z"/></g></g>'
      );
    if (id === "vanalinn")
      return (
        "<g><defs>" +
        gr("g-vanalinn", "#F6C879", "#C9703E", 0, 0, 0.3, 1) +
        '<clipPath id="clip-vanalinn"><circle cx="100" cy="100" r="99"/></clipPath>' +
        "</defs>" +
        '<circle cx="100" cy="100" r="99" fill="url(#g-vanalinn)"/>' +
        '<g clip-path="url(#clip-vanalinn)">' +
        '<g fill="#4A2E22">' +
        '<rect x="8" y="128" width="24" height="60"/>' +
        '<rect x="36" y="110" width="18" height="78"/>' +
        '<path d="M36 110 l9 -16 9 16 z"/>' +
        '<rect x="58" y="134" width="20" height="54"/>' +
        '<rect x="148" y="122" width="20" height="66"/>' +
        '<rect x="170" y="138" width="22" height="50"/>' +
        '<rect x="108" y="76" width="16" height="112"/>' +
        '<path d="M108 76 l8 -28 8 28 z"/>' +
        '<rect x="115" y="40" width="2" height="12"/>' +
        "</g>" +
        '<g fill="#F3D34A" opacity=".85">' +
        '<rect x="14" y="146" width="4" height="6"/><rect x="22" y="156" width="4" height="6"/>' +
        '<rect x="64" y="150" width="4" height="6"/><rect x="154" y="140" width="4" height="6"/>' +
        '<rect x="178" y="156" width="4" height="6"/>' +
        "</g>" +
        "</g>" +
        '<circle cx="150" cy="40" r="15" fill="#FFE9A8" opacity=".9"/></g>'
      );
    if (id === "rand2")
      return (
        "<g><defs>" +
        gr("g-rand2sky", "#BFE6F5", "#EAF6FC", 0, 0, 0, 1) +
        gr("g-rand2sea", "#4E9FC9", "#1E5A82", 0, 0, 0, 1) +
        '<clipPath id="clip-rand2"><circle cx="100" cy="100" r="99"/></clipPath>' +
        "</defs>" +
        '<g clip-path="url(#clip-rand2)">' +
        '<rect x="0" y="0" width="200" height="200" fill="url(#g-rand2sky)"/>' +
        '<circle cx="148" cy="48" r="16" fill="#FFE07A"/>' +
        '<rect x="0" y="128" width="200" height="72" fill="url(#g-rand2sea)"/>' +
        '<path d="M0 140 q25 10 50 0 q25 -10 50 0 q25 10 50 0 q25 -10 50 0" stroke="#EAF6FC" stroke-width="3" fill="none" opacity=".6"/>' +
        '<path d="M0 154 q25 10 50 0 q25 -10 50 0 q25 10 50 0 q25 -10 50 0" stroke="#EAF6FC" stroke-width="3" fill="none" opacity=".4"/>' +
        '<rect x="0" y="176" width="200" height="24" fill="#E8D7A8"/>' +
        '<g stroke="#4E8A52" stroke-width="2" fill="none" opacity=".8">' +
        '<path d="M10 178 q2 -12 -2 -20"/><path d="M18 180 q4 -14 0 -22"/>' +
        '<path d="M182 176 q-2 -12 2 -18"/><path d="M190 180 q-4 -14 0 -20"/>' +
        "</g>" +
        "</g></g>"
      );
    if (id === "raba")
      return (
        "<g><defs>" +
        gr("g-rabasky", "#F3C9A0", "#F7E6C4", 0, 0, 0, 1) +
        '<clipPath id="clip-raba"><circle cx="100" cy="100" r="99"/></clipPath>' +
        "</defs>" +
        '<g clip-path="url(#clip-raba)">' +
        '<rect x="0" y="0" width="200" height="200" fill="url(#g-rabasky)"/>' +
        '<circle cx="100" cy="118" r="26" fill="#FFD98A" opacity=".9"/>' +
        '<rect x="0" y="130" width="200" height="70" fill="#9AB89C"/>' +
        '<path d="M0 132 q50 -8 100 0 q50 8 100 0 v6 q-50 8 -100 0 q-50 -8 -100 0 z" fill="#7FA082" opacity=".8"/>' +
        '<g stroke="#5E4A38" stroke-width="2.4" opacity=".55">' +
        '<path d="M20 200 v-46"/><path d="M34 200 v-50"/><path d="M160 200 v-44"/><path d="M176 200 v-52"/>' +
        "</g>" +
        '<g fill="#E8D7B0" opacity=".9"><rect x="86" y="150" width="28" height="4"/><rect x="82" y="158" width="36" height="4"/>' +
        '<rect x="86" y="166" width="28" height="4"/></g>' +
        "</g></g>"
      );
    if (id === "tulekroon")
      return (
        "<g><defs>" +
        '<linearGradient id="g-tulekroon" x1="0" y1="1" x2="0" y2="0">' +
        '<stop offset="0%" stop-color="#8E1F10"/><stop offset="40%" stop-color="#E8430A"/>' +
        '<stop offset="75%" stop-color="#FF8C14"/><stop offset="100%" stop-color="#FFE07A"/></linearGradient>' +
        '<linearGradient id="g-tulekroonB" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="#8A2A14"/><stop offset="100%" stop-color="#4A1006"/></linearGradient>' +
        "</defs>" +
        '<path d="M70 54 q-10 -20 -2 -34 q2 10 9 13 q-5 -16 5 -26 q-3 18 8 27 q7 8 -4 20 z" fill="url(#g-tulekroon)"/>' +
        '<path d="M100 54 q-12 -24 -2 -40 q2 12 11 16 q-6 -19 6 -31 q-3 21 9 32 q8 10 -5 23 z" fill="url(#g-tulekroon)"/>' +
        '<path d="M130 54 q10 -20 2 -34 q-2 10 -9 13 q5 -16 -5 -26 q3 18 -8 27 q-7 8 4 20 z" fill="url(#g-tulekroon)"/>' +
        '<rect x="63" y="49" width="74" height="11" rx="5.5" fill="url(#g-tulekroonB)" stroke="#2E0A03" stroke-width="1.4"/>' +
        '<path d="M65 52 h70" stroke="#FFCB6B" stroke-width="1.4" opacity=".55"/>' +
        '<circle cx="100" cy="30" r="3" fill="#FFE07A"/><circle cx="78" cy="38" r="2.2" fill="#FFCB6B"/><circle cx="122" cy="38" r="2.2" fill="#FFCB6B"/></g>'
      );
    if (id === "valk")
      return (
        '<g opacity=".95"><defs>' +
        '<linearGradient id="g-valk" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0%" stop-color="#FFF3B0"/><stop offset="100%" stop-color="#F6C92B"/></linearGradient>' +
        "</defs>" +
        '<path d="M34 50 l18 -34 l-6 20 l16 -6 l-22 38 l6 -20 z" fill="url(#g-valk)" stroke="#C99A0A" stroke-width="1"/>' +
        '<path d="M176 60 l-16 -32 l5 19 l-15 -5 l20 36 l-5 -19 z" fill="url(#g-valk)" stroke="#C99A0A" stroke-width="1"/>' +
        '<path d="M24 146 l16 -30 l-5 18 l14 -5 l-18 33 l5 -18 z" fill="url(#g-valk)" stroke="#C99A0A" stroke-width="1" opacity=".85"/>' +
        '<path d="M168 152 l-14 -28 l4 16 l-13 -4 l16 30 l-4 -16 z" fill="url(#g-valk)" stroke="#C99A0A" stroke-width="1" opacity=".85"/></g>'
      );
    if (id === "draakon")
      return (
        {
          back: "",
          front:
            "<g><defs>" +
            '<linearGradient id="g-draakon" x1="1" y1="0" x2="0" y2="1">' +
            '<stop offset="0%" stop-color="#8FD98F"/><stop offset="55%" stop-color="#3E8C4A"/>' +
            '<stop offset="100%" stop-color="#1E5A2A"/></linearGradient>' +
            "</defs>" +
            '<g><path d="M148,108 Q160,58 192,34 Q182,64 180,86 Q198,80 198,98 Q184,98 180,112 Q196,120 196,142 Q180,132 174,132 Q180,152 172,170 Q156,138 148,108 Z" fill="url(#g-draakon)" stroke="#143F1C" stroke-width="2"/>' +
            '<g stroke="#143F1C" stroke-width="1.4" opacity=".55" fill="none">' +
            '<path d="M150,106 Q166,70 188,38"/><path d="M154,112 Q176,96 196,98"/><path d="M158,122 Q178,114 194,142"/><path d="M160,132 Q170,142 172,168"/></g></g>' +
            '<g transform="scale(-1,1) translate(-200,0)">' +
            '<path d="M148,108 Q160,58 192,34 Q182,64 180,86 Q198,80 198,98 Q184,98 180,112 Q196,120 196,142 Q180,132 174,132 Q180,152 172,170 Q156,138 148,108 Z" fill="url(#g-draakon)" stroke="#143F1C" stroke-width="2"/>' +
            '<g stroke="#143F1C" stroke-width="1.4" opacity=".55" fill="none">' +
            '<path d="M150,106 Q166,70 188,38"/><path d="M154,112 Q176,96 196,98"/><path d="M158,122 Q178,114 194,142"/><path d="M160,132 Q170,142 172,168"/></g></g></g>',
        }[arguments[1] || "front"] || ""
      );
    if (id === "tiivad")
      return (
        {
          back: "",
          front:
            '<g opacity=".92"><defs>' +
            '<linearGradient id="g-tiiv" x1="1" y1="0" x2="0" y2="1">' +
            '<stop offset="0%" stop-color="#D9F1FD"/><stop offset="55%" stop-color="#8FD3F4"/>' +
            '<stop offset="100%" stop-color="#5FA8D8"/></linearGradient>' +
            '<linearGradient id="g-tiiv2" x1="1" y1="0" x2="0" y2="1">' +
            '<stop offset="0%" stop-color="#EAF8FE"/><stop offset="100%" stop-color="#93CDE8"/></linearGradient></defs>' +
            "<g>" +
            '<path d="M46 96 q-34 -30 -34 -4 q0 26 34 22 z" fill="url(#g-tiiv)" stroke="#5FA8D8" stroke-width="1.2"/>' +
            '<path d="M46 116 q-30 4 -28 26 q2 20 28 -8 z" fill="url(#g-tiiv2)" stroke="#7FBEDC" stroke-width="1.1"/>' +
            '<g stroke="#6FB6DA" stroke-width=".9" opacity=".8" fill="none">' +
            '<path d="M44 98 q-16 -6 -26 -2"/><path d="M44 104 q-18 0 -26 6"/><path d="M44 120 q-14 4 -20 14"/></g>' +
            '<circle cx="24" cy="100" r="3" fill="#FFFFFF" opacity=".6"/><circle cx="26" cy="132" r="2.4" fill="#FFFFFF" opacity=".55"/></g>' +
            "<g>" +
            '<path d="M154 96 q34 -30 34 -4 q0 26 -34 22 z" fill="url(#g-tiiv)" stroke="#5FA8D8" stroke-width="1.2"/>' +
            '<path d="M154 116 q30 4 28 26 q-2 20 -28 -8 z" fill="url(#g-tiiv2)" stroke="#7FBEDC" stroke-width="1.1"/>' +
            '<g stroke="#6FB6DA" stroke-width=".9" opacity=".8" fill="none">' +
            '<path d="M156 98 q16 -6 26 -2"/><path d="M156 104 q18 0 26 6"/><path d="M156 120 q14 4 20 14"/></g>' +
            '<circle cx="176" cy="100" r="3" fill="#FFFFFF" opacity=".6"/><circle cx="174" cy="132" r="2.4" fill="#FFFFFF" opacity=".55"/></g></g>',
        }[arguments[1] || "front"] || ""
      );
    return "";
  }

  /* Siiri bygger på en akvarellillustration; ögon, mun och glasögon ritas ovanpå så hon kan blinka och prata */
  /* barnets egen igelkott: samma teckning, egen pälsfärg och egna kläder */
  var FURS = [
    { id: "kreem", sv: "Gräddvit", et: "Kreemjas", c: "#FFFFFF", o: 0 },
    { id: "pruun", sv: "Nötbrun", et: "Pruun", c: "#9A5E2A", o: 0.72 },
    { id: "kaneel", sv: "Kanel", et: "Kaneel", c: "#C07A38", o: 0.7 },
    { id: "hall", sv: "Duvgrå", et: "Hall", c: "#6A757F", o: 0.7 },
    { id: "kuldne", sv: "Gyllene", et: "Kuldne", c: "#D89A12", o: 0.7 },
    { id: "vask", sv: "Koppar", et: "Vasekarva", c: "#B0552C", o: 0.7 },
    { id: "roosa", sv: "Rosa", et: "Roosa", c: "#EE6D9E", o: 0.68 },
    { id: "korall", sv: "Korall", et: "Korall", c: "#E76350", o: 0.68 },
    { id: "sinine", sv: "Himmelsblå", et: "Taevasinine", c: "#5089CE", o: 0.7 },
    { id: "meri", sv: "Havsgrön", et: "Meresinine", c: "#2D918B", o: 0.7 },
    { id: "roheline", sv: "Mossgrön", et: "Sammal", c: "#5C9C5E", o: 0.7 },
    { id: "lilla", sv: "Lavendel", et: "Lavendel", c: "#8E74D8", o: 0.7 },
    { id: "ploom", sv: "Plommon", et: "Ploomikarva", c: "#734184", o: 0.72 },
    { id: "sysi", sv: "Kolsvart", et: "Süsimust", c: "#33384A", o: 0.78 },
  ];
  var EYES = [
    { id: "pruun", sv: "Nötbrun", c: "#7A5836" },
    { id: "merevaik", sv: "Bärnsten", c: "#C98A20" },
    { id: "roheline", sv: "Grön", c: "#4E8C4A" },
    { id: "sinine", sv: "Blå", c: "#3A6FB0" },
    { id: "hall", sv: "Grå", c: "#6E7884" },
    { id: "lilla", sv: "Violett", c: "#7A5AA8" },
    { id: "kuld", sv: "Guld", c: "#D8A32A" },
    { id: "punane", sv: "Rubinröd", c: "#A8323C" },
  ];
  function myEye() {
    var i,
      id = S.eye || "pruun";
    for (i = 0; i < EYES.length; i++) if (EYES[i].id === id) return EYES[i];
    return EYES[0];
  }
  /* färgen målas med ljus och skugga: ljusare upptill vänster, mättad i mitten,
       mörkare mot kanten – och ansiktet målas tillbaka i originalfärg */
  function mixHex(c, t, amt) {
    function p(x) {
      return parseInt(x, 16);
    }
    var r = p(c.slice(1, 3)),
      g = p(c.slice(3, 5)),
      b = p(c.slice(5, 7));
    var r2 = p(t.slice(1, 3)),
      g2 = p(t.slice(3, 5)),
      b2 = p(t.slice(5, 7));
    function m(x, y) {
      var v = Math.round(x + (y - x) * amt).toString(16);
      return v.length < 2 ? "0" + v : v;
    }
    return "#" + m(r, r2) + m(g, g2) + m(b, b2);
  }
  function furLayer(f, img, idSuffix) {
    if (!f.o) return "";
    var sfx = idSuffix || "",
      mid = "fmask-" + f.id + sfx,
      gid = "fgrad-" + f.id + sfx,
      rid = "frim-" + f.id + sfx;
    var light = mixHex(f.c, "#FFFFFF", 0.42),
      dark = mixHex(f.c, "#2A1E14", 0.38);
    var rings = [
        [60, 65, 0.22],
        [53, 58, 0.3],
        [46, 51, 0.4],
        [39, 44, 0.55],
        [32, 37, 1],
      ],
      i;
    var s =
      "<defs>" +
      '<radialGradient id="' +
      gid +
      '" cx="34%" cy="24%" r="78%">' +
      '<stop offset="0%" stop-color="' +
      light +
      '"/>' +
      '<stop offset="42%" stop-color="' +
      f.c +
      '"/>' +
      '<stop offset="100%" stop-color="' +
      dark +
      '"/></radialGradient>' +
      '<radialGradient id="' +
      rid +
      '" cx="50%" cy="50%" r="50%">' +
      '<stop offset="70%" stop-color="' +
      dark +
      '" stop-opacity="0"/>' +
      '<stop offset="100%" stop-color="' +
      dark +
      '" stop-opacity=".5"/></radialGradient>' +
      '<mask id="' +
      mid +
      '" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">' +
      '<use href="#siiriPic"/></mask>';
    for (i = 0; i < rings.length; i++) {
      s +=
        '<clipPath id="fc' +
        i +
        sfx +
        '"><ellipse cx="100" cy="' +
        (119 - i) +
        '" rx="' +
        rings[i][0] +
        '" ry="' +
        rings[i][1] +
        '"/></clipPath>';
    }
    s +=
      "</defs>" +
      '<g mask="url(#' +
      mid +
      ')">' +
      '<rect x="0" y="0" width="200" height="200" fill="url(#' +
      gid +
      ')" opacity="' +
      f.o +
      '"/>' +
      '<rect x="0" y="0" width="200" height="200" fill="url(#' +
      rid +
      ')" opacity="' +
      (f.o * 0.8).toFixed(2) +
      '"/>' +
      "</g>";
    for (i = 0; i < rings.length; i++) {
      s += '<g clip-path="url(#fc' + i + sfx + ')" opacity="' + rings[i][2] + '"><use href="#siiriPic"/></g>';
    }
    return s;
  }
  function myFur() {
    var i,
      id = S.fur || "kreem";
    for (i = 0; i < FURS.length; i++) if (FURS[i].id === id) return FURS[i];
    return FURS[0];
  }
  /* samma ritning som Siiri, men med barnets päls och kläder och utan animationer */
  function siilSVG(size) {
    var cls = "siiri" + (size ? " " + size : "") + (diff().id === "svar" ? " cool" : "");
    var img = (typeof window !== "undefined" && window.SIIRI_IMG) || "";
    return (
      '<span class="siiri3d">' +
      '<svg class="' +
      cls +
      '" id="s-svg" viewBox="0 0 200 200" role="img" aria-label="Igelkotten Siiri">' +
      "<defs>" +
      '<radialGradient id="sg-aura" cx="50%" cy="50%" r="50%">' +
      '<stop offset="55%" stop-color="rgba(255,214,110,0)"/>' +
      '<stop offset="80%" stop-color="rgba(255,206,92,.38)"/>' +
      '<stop offset="100%" stop-color="rgba(255,186,40,0)"/></radialGradient>' +
      '<radialGradient id="sg-night" cx="38%" cy="26%" r="80%">' +
      '<stop offset="0%" stop-color="#31467F"/><stop offset="100%" stop-color="#101B3C"/></radialGradient>' +
      '<radialGradient id="sg-lid" cx="50%" cy="38%" r="62%">' +
      '<stop offset="0%" stop-color="#FFFDF8"/><stop offset="70%" stop-color="#FAF2E6"/>' +
      '<stop offset="100%" stop-color="#F1E3D0"/></radialGradient>' +
      '<linearGradient id="sg-lens" x1="0" y1="0" x2="0.5" y2="1">' +
      '<stop offset="0%" stop-color="#4A4A58"/><stop offset="45%" stop-color="#16161E"/>' +
      '<stop offset="100%" stop-color="#2B2B38"/></linearGradient>' +
      '<linearGradient id="sg-frame" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#5E5E6E"/><stop offset="50%" stop-color="#1A1A22"/>' +
      '<stop offset="100%" stop-color="#43434F"/></linearGradient>' +
      "</defs>" +
      '<g id="s-all">' +
      '<g id="s-wave"><circle cx="14" cy="52" r="6" fill="#3B6CD4" opacity="0"/><circle cx="14" cy="52" r="6" fill="#3B6CD4" opacity="0"/><circle cx="14" cy="52" r="6" fill="#3B6CD4" opacity="0"/></g>' +
      '<g id="s-head">' +
      wearSVG("scene") +
      (["kott", "tiivad", "paasuke2", "draakon", "ring"].indexOf(wearing("back")) >= 0
        ? wearSVG("back", "back")
        : wearSVG("back")) +
      '<use href="#siiriPic"/>' +
      furLayer(myFur(), img, "s") +
      (["kott", "tiivad", "paasuke2", "draakon", "ring"].indexOf(wearing("back")) >= 0
        ? wearSVG("back", "front")
        : "") +
      wearSVG("aura") +
      wearSVG("outfit") +
      wearSVG("neck") +
      wearSVG("head") +
      wearSVG("hand") +
      /* platshållare som minspelet animerar */
      '<g id="s-ear"></g><g id="s-armL"></g><g id="s-armR"></g><g id="s-flower"></g>' +
      '<g id="s-browL"><path d="M66 75 q9 -4 17 -1" stroke="#C3A88C" stroke-width="2" fill="none" stroke-linecap="round" opacity=".45"/></g>' +
      '<g id="s-browR"><path d="M116 74 q9 -4 17 1" stroke="#C3A88C" stroke-width="2" fill="none" stroke-linecap="round" opacity=".45"/></g>' +
      /* ögonlock: samma färg som pälsen, syns när hon blinkar */
      '<ellipse cx="76.4" cy="91.4" rx="10.3" ry="11" fill="url(#sg-lid)"/>' +
      '<ellipse cx="123.2" cy="90.7" rx="10.3" ry="11" fill="url(#sg-lid)"/>' +
      /* ögon */
      '<g id="s-eyeL">' +
      '<ellipse cx="76.4" cy="91.4" rx="9.2" ry="9.9" fill="#080605"/>' +
      '<circle id="s-irisL" cx="76.4" cy="91.4" r="5.6" fill="' +
      myEye().c +
      '"/>' +
      '<circle id="s-pupL" cx="76.4" cy="91.4" r="3.0" fill="#000"/>' +
      '<circle id="s-glL" cx="74.2" cy="88.8" r="2.6" fill="#fff"/>' +
      '<circle id="s-glL2" cx="79.1" cy="94.2" r="1.5" fill="#fff" opacity=".6"/>' +
      '<path d="M70.4 95.4 q6 5 12 1" stroke="#6E5F55" stroke-width="1" fill="none" opacity=".3"/>' +
      "</g>" +
      '<g id="s-eyeR">' +
      '<ellipse cx="123.2" cy="90.7" rx="9.2" ry="9.9" fill="#080605"/>' +
      '<circle id="s-irisR" cx="123.2" cy="90.7" r="5.6" fill="' +
      myEye().c +
      '"/>' +
      '<circle id="s-pupR" cx="123.2" cy="90.7" r="3.0" fill="#000"/>' +
      '<circle id="s-glR" cx="121.0" cy="88.1" r="2.6" fill="#fff"/>' +
      '<circle id="s-glR2" cx="125.9" cy="93.5" r="1.5" fill="#fff" opacity=".6"/>' +
      '<path d="M117.2 94.7 q6 5 12 1" stroke="#6E5F55" stroke-width="1" fill="none" opacity=".3"/>' +
      "</g>" +
      /* solglasögon (svår nivå) */
      '<g id="s-shades">' +
      '<path d="M59 87 Q67 82 73 85" stroke="url(#sg-frame)" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
      '<path d="M140 86 Q132 81 126 84" stroke="url(#sg-frame)" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
      '<path d="M94 88 Q100 85 106 88" stroke="url(#sg-frame)" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M66 81 h26 q5 0 5 5 q0 12 -8 16 q-7 4 -14 0 q-7 -4 -10 -14 q-1 -7 1 -7 Z" fill="url(#sg-lens)" stroke="url(#sg-frame)" stroke-width="2.8"/>' +
      '<path d="M134 80 h-26 q-5 0 -5 5 q0 12 8 16 q7 4 14 0 q7 -4 10 -14 q1 -7 -1 -7 Z" fill="url(#sg-lens)" stroke="url(#sg-frame)" stroke-width="2.8"/>' +
      '<path d="M71 85 l9 0 -11 11 0 -7 Z" fill="#fff" opacity=".45"/>' +
      '<path d="M113 84 l9 0 -11 11 0 -7 Z" fill="#fff" opacity=".45"/>' +
      '<g id="s-glint"><path d="M128 83 l1.9 4 4.2 .6 -3 3 .8 4.2 -3.9 -2.1 -3.8 2.1 .7 -4.2 -3 -3 4.2 -.6 Z" fill="#FFF7C4"/></g>' +
      "</g>" +
      /* munnen: illustrationens leende syns som det är, och när hon pratar läggs en öppen mun över */
      '<circle id="s-nose-hit" cx="99.5" cy="106" r="13" fill="#fff" opacity="0" style="cursor:pointer"/>' +
      '<path id="s-smile" d="M0 0" stroke="none" fill="none"/>' +
      '<g id="s-mouth" opacity="0">' +
      '<ellipse id="s-mouthO" cx="100" cy="117" rx="9.5" ry="2" fill="#6E3540"/>' +
      '<ellipse id="s-tongue" cx="100" cy="120" rx="5.5" ry="1.3" fill="#E28EA0"/>' +
      "</g>" +
      "</g></g></svg>" +
      '<span class="siirishadow"></span></span>'
    );
  }
  /* Siiri sedd bakifrån: ansiktet sitter inbakat i vattenfärgsbildens pixlar och
     kan därför inte "vändas om". Istället klipper vi ut en ansiktsfri pälsbit
     från toppen av huvudet (ren tagg-päls, inga ögon/öron) och upprepar den som
     ett SVG-mönster över ryggens taggiga siluett - så det är fortfarande den
     riktiga målade texturen, bara återanvänd. Samma pälsfärglogik som
     framsidans furLayer() tonar om mönstret när barnet valt en pälsfärg. */
  var BACK_SPLIT = ["kott", "tiivad", "paasuke2", "draakon", "ring"];
  function backFurColors() {
    var f = myFur();
    return {
      rim: f.o ? mixHex(f.c, "#2A1E14", 0.32) : "#B9A787",
      r2: f.o ? mixHex(f.c, "#2A1E14", 0.12) : "#C9BBA3",
      r3: f.o ? f.c : "#D6C7A8",
      r4: f.o ? mixHex(f.c, "#FFFFFF", 0.3) : "#E2D6BC",
      r5: f.o ? mixHex(f.c, "#FFFFFF", 0.55) : "#EBE1CA",
      r6: f.o ? mixHex(f.c, "#FFFFFF", 0.78) : "#F5EFDE",
      base: f.o ? mixHex(f.c, "#FFFFFF", 0.82) : "#FBF7EE",
      stroke: f.o ? mixHex(f.c, "#2A1E14", 0.4) : "#A8987E",
      line: f.o ? mixHex(f.c, "#000000", 0.14) : "#E6DCC8",
    };
  }
  function siilBackSVG(size) {
    var cls = "siiri" + (size ? " " + size : "");
    var f = myFur();
    var c = backFurColors();
    var backItem =
      BACK_SPLIT.indexOf(wearing("back")) >= 0
        ? wearSVG("back", "back") + (wearSVG("back", "rear") || wearSVG("back", "front"))
        : wearSVG("back");
    /* sex ringar taggar, från spetsigast/ytterst till kortast/innerst - formerna
       är desamma som tidigare, men fylls nu med den riktiga pälstexturen istället
       för platt färg. HI-delmängden får en diskret vit glansfläck ovanpå. */
    var rings = [
      {
        sw: 1.1,
        d: "M158.4 107.9 L172.5 112.7 L158.8 118.8 Z M156.8 132.6 L167.9 142.5 L153.4 142.9 Z M150.2 149.2 L159.1 162.7 L144.1 158.0 Z M143.1 159.3 L149.6 174.7 L135.5 166.6 Z M128.8 171.4 L130.4 187.7 L119.6 175.9 Z M111.1 178.3 L107.5 193.0 L101.0 179.5 Z M87.7 178.1 L78.0 192.8 L78.0 174.9 Z M74.3 173.1 L62.6 182.9 L65.6 167.5 Z M54.4 156.1 L37.4 161.5 L48.7 147.1 Z M45.4 139.7 L29.6 138.9 L42.4 129.2 Z M41.1 114.2 L28.3 107.2 L42.3 103.3 Z M44.0 96.4 L32.6 85.5 L48.0 86.3 Z M47.2 88.0 L38.0 76.0 L52.4 78.6 Z M59.4 70.0 L53.0 53.3 L67.3 63.2 Z M73.0 59.6 L71.7 42.7 L82.4 55.4 Z M96.9 52.6 L102.4 37.6 L107.0 53.0 Z M114.0 54.3 L123.1 42.8 L123.6 57.8 Z M124.9 58.5 L136.4 48.6 L133.7 63.9 Z M146.1 76.5 L161.5 72.5 L151.7 85.6 Z M153.1 88.7 L169.6 88.1 L156.7 98.9 Z",
        hi: "M158.4 107.9 L172.5 112.7 L158.8 118.8 Z M143.1 159.3 L149.6 174.7 L135.5 166.6 Z M87.7 178.1 L78.0 192.8 L78.0 174.9 Z M45.4 139.7 L29.6 138.9 L42.4 129.2 Z M47.2 88.0 L38.0 76.0 L52.4 78.6 Z M96.9 52.6 L102.4 37.6 L107.0 53.0 Z M146.1 76.5 L161.5 72.5 L151.7 85.6 Z",
      },
      {
        sw: 0.95,
        d: "M151.3 109.9 L163.4 114.6 L151.4 119.6 Z M149.2 131.9 L159.9 141.5 L145.9 140.9 Z M145.7 141.3 L154.2 152.6 L140.9 149.5 Z M133.5 158.0 L138.0 172.4 L126.3 163.7 Z M117.4 168.2 L116.2 181.5 L108.9 170.7 Z M98.5 171.5 L92.8 182.8 L89.7 170.4 Z M89.4 170.3 L81.2 182.2 L80.8 167.5 Z M77.2 165.7 L66.8 174.4 L69.6 160.7 Z M65.1 156.6 L52.3 162.2 L59.1 149.5 Z M51.4 134.0 L37.8 132.6 L49.2 124.6 Z M48.5 115.2 L36.8 109.2 L49.3 105.5 Z M50.4 100.2 L39.9 90.9 L53.6 91.1 Z M56.4 85.5 L49.1 73.9 L61.7 77.8 Z M69.5 70.2 L66.0 55.3 L77.1 65.1 Z M79.6 63.9 L79.7 49.4 L88.1 60.8 Z M90.2 60.3 L93.2 46.2 L99.0 59.3 Z M113.4 61.2 L122.4 49.2 L121.8 64.5 Z M129.9 69.7 L141.1 63.4 L136.7 76.0 Z M138.0 77.5 L151.1 73.0 L143.4 85.1 Z M144.8 87.8 L158.1 86.8 L148.5 96.6 Z",
        hi: "M151.3 109.9 L163.4 114.6 L151.4 119.6 Z M133.5 158.0 L138.0 172.4 L126.3 163.7 Z M89.4 170.3 L81.2 182.2 L80.8 167.5 Z M51.4 134.0 L37.8 132.6 L49.2 124.6 Z M56.4 85.5 L49.1 73.9 L61.7 77.8 Z M90.2 60.3 L93.2 46.2 L99.0 59.3 Z M138.0 77.5 L151.1 73.0 L143.4 85.1 Z",
      },
      {
        sw: 0.8,
        d: "M143.5 106.3 L153.1 110.2 L144.2 115.6 Z M143.7 122.0 L153.3 129.2 L141.6 131.0 Z M138.5 138.7 L144.0 148.3 L133.6 146.4 Z M126.6 153.7 L128.8 166.1 L119.4 158.6 Z M116.0 160.2 L114.7 171.7 L107.9 162.8 Z M96.0 163.4 L89.8 174.0 L87.7 161.6 Z M78.7 157.5 L68.8 164.4 L71.7 152.2 Z M70.8 151.3 L60.5 155.1 L65.0 144.5 Z M60.8 137.3 L48.8 137.3 L57.6 128.6 Z M55.8 114.1 L46.9 108.4 L56.8 104.8 Z M56.5 106.3 L48.4 99.1 L58.8 97.3 Z M62.1 89.8 L56.3 79.7 L67.1 82.3 Z M75.1 74.5 L74.2 63.4 L82.6 70.0 Z M83.2 69.7 L84.4 58.3 L91.3 67.0 Z M102.1 66.1 L107.8 56.0 L110.5 67.4 Z M122.6 72.9 L132.3 66.6 L129.4 78.4 Z M131.1 80.1 L141.9 76.7 L136.5 87.3 Z M140.6 95.7 L150.7 97.2 L143.2 104.6 Z",
        hi: "M143.5 106.3 L153.1 110.2 L144.2 115.6 Z M126.6 153.7 L128.8 166.1 L119.4 158.6 Z M78.7 157.5 L68.8 164.4 L71.7 152.2 Z M55.8 114.1 L46.9 108.4 L56.8 104.8 Z M75.1 74.5 L74.2 63.4 L82.6 70.0 Z M122.6 72.9 L132.3 66.6 L129.4 78.4 Z",
      },
      {
        sw: 0.65,
        d: "M136.8 113.7 L145.4 119.0 L136.0 122.6 Z M134.2 129.3 L140.4 137.7 L130.6 137.3 Z M129.3 139.3 L132.5 148.5 L123.8 145.8 Z M120.7 148.5 L121.2 158.6 L113.6 152.6 Z M107.8 154.7 L104.6 163.1 L99.9 155.6 Z M92.2 154.6 L85.9 161.0 L84.6 151.8 Z M78.1 147.4 L70.0 150.2 L72.2 141.4 Z M70.1 138.3 L61.4 138.4 L66.2 130.5 Z M64.0 122.6 L55.5 118.9 L63.2 113.7 Z M63.7 107.2 L56.0 100.2 L65.9 98.6 Z M72.0 87.4 L69.5 78.4 L77.7 81.2 Z M80.4 79.1 L80.5 69.5 L87.6 75.2 Z M94.8 73.2 L98.6 65.0 L102.8 72.9 Z M113.3 75.6 L121.1 68.9 L120.3 79.7 Z M122.8 81.7 L131.5 78.6 L128.5 88.0 Z M130.4 90.8 L139.0 91.0 L134.1 98.7 Z",
        hi: "M136.8 113.7 L145.4 119.0 L136.0 122.6 Z M120.7 148.5 L121.2 158.6 L113.6 152.6 Z M78.1 147.4 L70.0 150.2 L72.2 141.4 Z M63.7 107.2 L56.0 100.2 L65.9 98.6 Z M94.8 73.2 L98.6 65.0 L102.8 72.9 Z M130.4 90.8 L139.0 91.0 L134.1 98.7 Z",
      },
      {
        sw: 0.55,
        d: "M130.0 108.1 L136.4 112.1 L130.2 116.5 Z M127.9 127.0 L131.3 133.9 L124.1 134.2 Z M124.0 134.5 L126.5 142.8 L118.7 140.4 Z M110.2 145.7 L107.8 152.9 L102.9 147.5 Z M96.6 147.4 L91.6 152.5 L89.4 145.5 Z M84.0 142.5 L76.4 145.8 L78.2 137.2 Z M73.1 129.5 L65.4 128.1 L70.5 121.6 Z M70.1 119.7 L63.5 115.9 L69.7 111.4 Z M70.6 105.3 L65.3 98.8 L73.2 97.5 Z M78.5 89.6 L77.1 81.2 L84.3 84.4 Z M88.5 82.1 L90.5 74.7 L95.7 79.9 Z M105.3 80.1 L111.0 74.0 L112.5 82.6 Z M118.0 86.2 L125.6 83.7 L123.4 91.9 Z M126.7 97.4 L134.6 98.6 L129.4 105.2 Z",
        hi: "M130.0 108.1 L136.4 112.1 L130.2 116.5 Z M110.2 145.7 L107.8 152.9 L102.9 147.5 Z M73.1 129.5 L65.4 128.1 L70.5 121.6 Z M78.5 89.6 L77.1 81.2 L84.3 84.4 Z M118.0 86.2 L125.6 83.7 L123.4 91.9 Z",
      },
      {
        sw: 0.4,
        d: "M123.4 107.4 L128.6 110.9 L123.8 115.1 Z M122.5 122.0 L124.8 127.6 L119.3 128.8 Z M116.8 132.0 L116.9 138.2 L111.3 136.5 Z M104.8 139.1 L101.7 144.8 L97.9 139.6 Z M88.8 136.6 L83.1 138.4 L83.2 132.0 Z M79.8 127.2 L73.3 126.1 L77.0 120.2 Z M76.1 113.9 L71.7 109.6 L76.8 106.3 Z M77.2 104.8 L74.6 99.2 L80.3 97.9 Z M83.9 93.3 L84.1 87.1 L89.5 89.0 Z M97.3 86.5 L100.9 80.9 L104.1 86.7 Z M110.6 89.1 L116.3 87.0 L116.3 93.5 Z M119.3 97.3 L125.6 98.0 L122.5 104.0 Z",
        hi: "M123.4 107.4 L128.6 110.9 L123.8 115.1 Z M104.8 139.1 L101.7 144.8 L97.9 139.6 Z M76.1 113.9 L71.7 109.6 L76.8 106.3 Z M97.3 86.5 L100.9 80.9 L104.1 86.7 Z",
      },
    ];
    var ringColors = [c.rim, c.r2, c.r3, c.r4, c.r5, c.r6];
    var spikes = "",
      shine = "",
      clipShapes = '<ellipse cx="100" cy="116" rx="66" ry="71"/>',
      i;
    for (i = 0; i < rings.length; i++) {
      spikes +=
        '<path fill="' +
        ringColors[i] +
        '" stroke="' +
        c.stroke +
        '" stroke-width="' +
        rings[i].sw +
        '" d="' +
        rings[i].d +
        '"/>';
      shine += '<path fill="#fff" opacity=".3" d="' + rings[i].hi + '"/>';
      clipShapes += '<path d="' + rings[i].d + '"/>';
    }
    return (
      '<span class="siiri3d">' +
      '<svg class="' +
      cls +
      '" id="s-back-svg" viewBox="0 0 200 200" role="img" aria-label="Igelkotten Siiri bakifrån">' +
      "<defs>" +
      /* en ansiktsfri pälsbit från hjässan (ovanför ögonbrynen), upprepad som
         mönster - ger äkta penseldrag ovanpå de platta taggfärgerna nedan.
         Mönstret har genomskinliga luckor mellan strån, så det läggs som ett
         halvtransparent detaljlager - inte som själva bottenfärgen - annars
         lyser rummet bakom igenom luckorna. */
      /* y=20 flyttar mönstrets skarv (64x54-rutan upprepas inte sömlöst) ner
         så den hamnar dold under ryggsäcken istället för synlig mitt på ryggen */
      '<pattern id="back-furtile" patternUnits="userSpaceOnUse" x="0" y="20" width="64" height="54">' +
      '<use href="#siiriPic" x="-68" y="-4"/>' +
      "</pattern>" +
      '<clipPath id="back-clip">' +
      clipShapes +
      "</clipPath>" +
      "</defs>" +
      '<g id="s-back-all">' +
      wearSVG("scene") +
      wearSVG("aura") +
      '<ellipse cx="100" cy="186" rx="55" ry="8" fill="#2A1B0C" opacity=".15"/>' +
      '<ellipse cx="100" cy="116" rx="66" ry="71" fill="' +
      c.rim +
      '"/>' +
      spikes +
      '<g clip-path="url(#back-clip)">' +
      '<rect x="0" y="0" width="200" height="200" fill="url(#back-furtile)" opacity=".95"/>' +
      "</g>" +
      shine +
      '<ellipse cx="100" cy="150" rx="50" ry="40" fill="' +
      c.base +
      '"/>' +
      '<g stroke="' +
      c.line +
      '" stroke-width="1.4" opacity=".7" fill="none">' +
      '<path d="M70 134 q30 14 60 0"/><path d="M66 154 q34 16 68 0"/></g>' +
      '<ellipse cx="76" cy="182" rx="15" ry="10" fill="' +
      c.base +
      '" stroke="' +
      c.line +
      '" stroke-width="1"/>' +
      '<ellipse cx="124" cy="182" rx="15" ry="10" fill="' +
      c.base +
      '" stroke="' +
      c.line +
      '" stroke-width="1"/>' +
      /* ryggplagget förstoras ~30% och centreras över den taggiga mitten - precis
         där ansiktet hade legat på framsidan, så det täcker den tuffaste skarven */
      '<g transform="translate(100,122) scale(1.3) translate(-100,-122)">' +
      backItem +
      "</g>" +
      wearSVG("head") +
      wearSVG("neck") +
      "</g></svg>" +
      '<span class="siirishadow"></span></span>'
    );
  }
  function $s(id) {
    return document.getElementById(id);
  }
  function mMood(m) {
    var s = $s("s-svg");
    if (!s) return;
    s.className.baseVal = s.className.baseVal
      .replace(/mood-\S+/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (m) s.className.baseVal += " mood-" + m;
  }
  function mPulse(cls) {
    var s = $s("s-svg");
    if (!s) return;
    s.classList.remove("hop", "wob");
    void s.getBoundingClientRect();
    s.classList.add(cls);
    setTimeout(function () {
      s.classList.remove(cls);
    }, 1200);
  }
  /* musiknoter som stiger från henne när hon dansar */

  /* en liten glad slinga medan hon dansar */

  /* Siiri dansar när något går riktigt bra */
  var danceT = null;
  function dance(big) {
    var s = $s("s-svg");
    if (!s) return;
    s.classList.remove("dance");
    void s.offsetWidth;
    s.classList.add("dance");
    mMood("cheer");
    happyEyes(true);
    clearTimeout(danceT);
    danceT = setTimeout(function () {
      var e = $s("s-svg");
      if (e) e.classList.remove("dance");
      happyEyes(false);
      mMood("");
    }, 2200);
    /* en liten melodi till dansen */
    if (S.sound) {
      var n = [523, 659, 784, 1047],
        i;
      for (i = 0; i < n.length; i++) tone(n[i], 0.12, i * 0.16);
      if (big) {
        tone(1319, 0.3, 0.66);
        tone(1047, 0.3, 0.66);
      }
    }
  }
  /* glada, kisande ögon */
  function happyEyes(on) {
    var l = $s("s-irisL"),
      r = $s("s-irisR"),
      el = $s("s-eyeL"),
      er = $s("s-eyeR");
    if (!el || !er) return;
    el.style.transform = on ? "scaleY(.55)" : "";
    er.style.transform = on ? "scaleY(.55)" : "";
    el.style.transformBox = "view-box";
    er.style.transformBox = "view-box";
    el.style.transformOrigin = "76.4px 91.4px";
    er.style.transformOrigin = "123.2px 90.7px";
    if (l) l.style.opacity = on ? ".25" : "";
    if (r) r.style.opacity = on ? ".25" : "";
  }
  /* ---------- Siiri lever mellan uppgifterna ---------- */
  var IDLE = { t: null, last: Date.now(), n: 0, on: true };
  var IDLE_LINES = [
    { et: "Mul on igav!", sv: "Jag har tråkigt!" },
    { et: "Teeme edasi!", sv: "Vi fortsätter!" },
    { et: "Ma ootan sind.", sv: "Jag väntar på dig." },
    { et: "Kas mängime?", sv: "Ska vi spela?" },
  ];
  var BACK_LINES = [
    { et: "Oi, sa oled tagasi!", sv: "Åh, du är tillbaka!" },
    { et: "Tere jälle!", sv: "Hej igen!" },
    { et: "Kus sa olid?", sv: "Var har du varit?" },
  ];
  function siiriClass(add, ms) {
    var s = $s("s-svg");
    if (!s) return;
    s.classList.add(add);
    setTimeout(function () {
      var e = $s("s-svg");
      if (e) e.classList.remove(add);
    }, ms || 1300);
  }
  function idleAct() {
    var s = $s("s-svg");
    if (!s || !IDLE.on) return;
    IDLE.n++;
    /* bara mjuka helkroppsrörelser – huvudet står still */
    if (Math.random() < 0.45) siiriClass("wob", 900);
    /* var tredje gång säger hon något */
    if (IDLE.n % 3 === 0 && screen === "home") {
      var l = IDLE_LINES[(Math.random() * IDLE_LINES.length) | 0];
      speak(l.et);
      bubble(l);
    }
  }
  function bubble(l) {
    var host = document.querySelector(".hero") || document.querySelector("#app");
    if (!host) return;
    var old = document.getElementById("sbubble");
    if (old) old.remove();
    var d = document.createElement("div");
    d.id = "sbubble";
    d.className = "sbubble";
    d.innerHTML = "<b>" + esc(l.et) + "</b><small>" + esc(l.sv) + "</small>";
    host.appendChild(d);
    setTimeout(function () {
      var e = document.getElementById("sbubble");
      if (e) e.remove();
    }, 4200);
  }
  function idleKick() {
    IDLE.last = Date.now();
    clearTimeout(IDLE.t);
    IDLE.t = setTimeout(
      function tick() {
        if (Date.now() - IDLE.last > 18000) idleAct();
        IDLE.t = setTimeout(tick, 14000 + Math.random() * 12000);
      },
      20000 + Math.random() * 8000,
    );
  }
  document.addEventListener(
    "pointerdown",
    function () {
      IDLE.last = Date.now();
    },
    { passive: true },
  );
  /* hälsa när man kommer tillbaka efter ett uppehåll */
  function welcomeBack() {
    var now = Date.now(),
      gap = now - (S.lastSeen || now);
    S.lastSeen = now;
    save();
    if (gap > 6 * 3600 * 1000) {
      setTimeout(function () {
        var l = BACK_LINES[(Math.random() * BACK_LINES.length) | 0];
        speak(l.et);
        bubble(l);
        siiriClass("wob", 900);
      }, 900);
    }
  }
  function mood(kind) {
    if (kind === "dance") {
      dance();
      return;
    }
    if (kind === "cheer") {
      mMood("happy");
      mPulse("hop");
      setTimeout(function () {
        if (!talking) mMood("");
      }, 1600);
    } else if (kind === "oops") {
      mMood("sad");
      mPulse("wob");
      setTimeout(function () {
        if (!talking) mMood("");
      }, 1800);
    } else mMood(kind || "");
  }
  var MOUTH_Y = 117;
  function mJaw(v) {
    var m = $s("s-mouth"),
      o = $s("s-mouthO"),
      t = $s("s-tongue"),
      sm = $s("s-smile");
    if (!m || !o) return;
    if (v <= 0.04) {
      m.setAttribute("opacity", "0");
      if (sm) sm.setAttribute("opacity", "1");
      return;
    }
    m.setAttribute("opacity", "1");
    if (sm) sm.setAttribute("opacity", "0");
    var ry = 1.8 + 8.5 * v;
    o.setAttribute("cy", MOUTH_Y.toFixed(2));
    o.setAttribute("ry", ry.toFixed(2));
    o.setAttribute("rx", (9 + 2.6 * v).toFixed(2));
    if (t) {
      t.setAttribute("cy", (MOUTH_Y + ry * 0.42).toFixed(2));
      t.setAttribute("ry", (1.0 + 1.8 * v).toFixed(2));
      t.setAttribute("rx", (4.5 + 1.6 * v).toFixed(2));
      t.setAttribute("opacity", v > 0.35 ? "1" : "0");
    }
  }
  /* ögonen följer fingret eller muspekaren */
  var lookX = 0,
    lookY = 0;
  function mLook(cx, cy) {
    var s = $s("s-svg");
    if (!s) return;
    var r = s.getBoundingClientRect();
    var ex = r.left + r.width / 2,
      ey = r.top + r.height * 0.52;
    var W = window.innerWidth || 600,
      H = window.innerHeight || 600;
    /* mät åt vänster och åt höger var för sig: hon sitter sällan mitt på skärmen,
           så samma måttstock åt båda håll gör att blicken slår i taket åt ena sidan */
    var spanL = Math.max(ex, 60),
      spanR = Math.max(W - ex, 60);
    var spanU = Math.max(ey, 60),
      spanD = Math.max(H - ey, 60);
    var dx = (cx - ex) / (cx < ex ? spanL : spanR);
    var dy = (cy - ey) / (cy < ey ? spanU : spanD);
    lookX = Math.max(-1, Math.min(1, dx)) * 3.2;
    lookY = Math.max(-1, Math.min(1, dy)) * 2.8;
    /* hela figuren lutar en aning mot pekaren – det ger djup */
    try {
      var ty = Math.max(-1, Math.min(1, dx)) * 9,
        tx = Math.max(-1, Math.min(1, dy)) * -6;
      document.documentElement.style.setProperty("--tiltY", ty.toFixed(1) + "deg");
      document.documentElement.style.setProperty("--tiltX", tx.toFixed(1) + "deg");
    } catch (e) {}
    /* hela figuren vrider sig en aning mot pekaren – djup utan 3D-modell */
    if (s && !s.classList.contains("dance")) {
      var ry = Math.max(-1, Math.min(1, dx)) * 7,
        rx = Math.max(-1, Math.min(1, dy)) * -4;
      s.style.transform = "perspective(700px) rotateY(" + ry.toFixed(1) + "deg) rotateX(" + rx.toFixed(1) + "deg)";
    }
    var p,
      i,
      ids = ["s-irisL", "s-pupL", "s-glL", "s-glL2", "s-irisR", "s-pupR", "s-glR", "s-glR2"];
    for (i = 0; i < ids.length; i++) {
      p = $s(ids[i]);
      if (p) p.setAttribute("transform", "translate(" + lookX.toFixed(1) + "," + lookY.toFixed(1) + ")");
    }
  }
  addEventListener(
    "pointermove",
    function (e) {
      mLook(e.clientX, e.clientY);
    },
    { passive: true },
  );

  /* ============ HEMLIGHETER ============ */
  function eggSay(id) {
    var e = EGGS[id];
    if (!e) return;
    speak(e.et);
    var d = document.createElement("div");
    d.className = "overlay";
    d.style.background = "rgba(12,28,18,.55)";
    d.innerHTML =
      '<div class="oc" style="border-color:#6B4FD8"><p class="kicker">🤫 Hemlighet!</p>' +
      '<div style="font-size:64px">' +
      (id === "gold" ? "🌟" : id === "tickle" ? "🤭" : id === "snow" ? "❄️" : "🦔") +
      "</div>" +
      '<h3 style="font-size:22px">' +
      esc(e.et) +
      "</h3><p>" +
      esc(e.sv) +
      "</p>" +
      '<button class="btn big wide" id="eggok">Hihi!</button></div>';
    document.body.appendChild(d);
    d.querySelector("#eggok").onclick = function () {
      d.remove();
    };
    setTimeout(function () {
      if (d.parentNode) d.remove();
    }, 6000);
  }
  function goldenSiiri() {
    var s = $s("s-svg");
    if (s) {
      s.classList.add("golden");
      setTimeout(function () {
        s.classList.remove("golden");
      }, 4200);
    }
    burst(220);
    setTimeout(function () {
      burst(160);
    }, 500);
    sndLvl();
    mood("cheer");
    var isNew = foundSecret("gold");
    eggSay("gold");
    if (isNew) {
      addXp(40);
    }
  }
  function tickleSiiri() {
    var s = $s("s-svg");
    buzz(30);
    if (s) {
      s.classList.add("giggle");
      setTimeout(function () {
        s.classList.remove("giggle");
      }, 1600);
    }
    tone(880, 0.08, 0);
    tone(1100, 0.08, 0.09);
    tone(1320, 0.12, 0.18);
    burst(50);
    var isNew = foundSecret("tickle");
    eggSay("tickle");
    if (isNew) {
      addXp(40);
    }
  }
  function snowfall() {
    snow(150);
    var isNew = foundSecret("snow");
    eggSay("snow");
    if (isNew) {
      addXp(40);
    }
  }
  function eggSay2(id, em) {
    var e = EGGS2[id];
    if (!e) return;
    speak(e.et);
    var d = document.createElement("div");
    d.className = "overlay";
    d.style.background = "rgba(12,28,18,.55)";
    d.innerHTML =
      '<div class="oc" style="border-color:#6B4FD8"><p class="kicker">🤫 Hemlighet!</p>' +
      '<div style="font-size:64px">' +
      em +
      "</div>" +
      '<h3 style="font-size:22px">' +
      esc(e.et) +
      "</h3><p>" +
      esc(e.sv) +
      "</p>" +
      '<button class="btn big wide" id="eggok2">Hihi!</button></div>';
    document.body.appendChild(d);
    d.querySelector("#eggok2").onclick = function () {
      d.remove();
    };
    setTimeout(function () {
      if (d.parentNode) d.remove();
    }, 6000);
  }
  function eggReward(id, xp, stars) {
    var isNew = foundSecret(id);
    if (isNew) {
      addXp(xp || 40);
      if (stars) {
        S.stars += stars;
        save();
        refreshTop();
      }
    }
    return isNew;
  }
  function sneeze() {
    var s = $s("s-svg");
    if (s) {
      s.classList.add("wob");
      setTimeout(function () {
        s.classList.remove("wob");
      }, 700);
    }
    tone(880, 0.07, 0, "triangle");
    tone(420, 0.22, 0.08, "triangle");
    burst(40);
    eggReward("sneeze", 40);
    eggSay2("sneeze", "🤧");
  }
  function starRain() {
    if (ctx) {
      snow(60);
      petals(60, ["#FFD45E", "#FFE9A8", "#FFF3C8"]);
    }
    sndLvl();
    var isNew = eggReward("stars", 40, 25);
    eggSay2("stars", "⭐");
  }
  function medalSpin() {
    var m = document.querySelector(".rankchip svg");
    if (m) {
      m.style.transition = "transform 1.2s cubic-bezier(.2,.8,.2,1)";
      m.style.transform = "rotate(720deg)";
      setTimeout(function () {
        m.style.transform = "rotate(0deg)";
      }, 1300);
    }
    burst(120);
    sndLvl();
    eggReward("medals", 40);
    eggSay2("medals", "🏅");
  }
  function comboTen() {
    if (diff().id === "svar" && (S.secrets || []).indexOf("hardten") < 0) {
      burst(220);
      setTimeout(function () {
        burst(160);
      }, 400);
      eggReward("hardten", 80, 40);
      eggSay2("hardten", "🔥");
      return;
    }
    if ((S.secrets || []).indexOf("ten") >= 0) return;
    burst(200);
    setTimeout(function () {
      burst(140);
    }, 400);
    eggReward("ten", 60, 10);
    eggSay2("ten", "🔟");
  }
  function yearRound() {
    snow(45);
    petals(45, ["#FFC7DC", "#FFE0EC"]);
    setTimeout(function () {
      petals(45, ["#E0A14A", "#C8762F"]);
    }, 400);
    eggReward("year", 40);
    eggSay2("year", "🌍");
  }
  function nightOwl() {
    var hh = new Date().getHours();
    if (hh < 21 && hh >= 5) return;
    if (S.owlseen === today()) return;
    S.owlseen = today();
    save();
    setTimeout(function () {
      mMood("sad");
      eggReward("owl", 40);
      eggSay2("night", "🌙");
      setTimeout(function () {
        mMood("");
      }, 2500);
    }, 1400);
  }

  function turtleEgg() {
    var isNew = eggReward("turtle", 100, 20);
    burst(140);
    sndLvl();
    var d = document.createElement("div");
    d.className = "combo";
    d.style.color = "var(--moss)";
    d.textContent = "🐢 +100";
    document.body.appendChild(d);
    setTimeout(function () {
      d.remove();
    }, 900);
    eggSay2("turtle", "🐢");
    checkBadges();
    refreshTop();
  }
  /* sköldpaddsknappen belönar den som håller kvar */
  var turtleT = null;
  document.addEventListener(
    "pointerdown",
    function (e) {
      var b = e.target.closest ? e.target.closest("button") : null;
      if (!b) return;
      var isTurtle = (b.textContent || "").indexOf("🐢") >= 0 || b.hasAttribute("data-slow");
      if (!isTurtle) return;
      clearTimeout(turtleT);
      turtleT = setTimeout(function () {
        turtleT = null;
        turtleEgg();
      }, 1400);
    },
    { passive: true },
  );
  function endTurtle() {
    if (turtleT) {
      clearTimeout(turtleT);
      turtleT = null;
    }
  }
  document.addEventListener("pointerup", endTurtle, { passive: true });
  document.addEventListener("pointercancel", endTurtle, { passive: true });
  document.addEventListener("pointerleave", endTurtle, { passive: true });

  /* långt tryck på Siiri + snabba tryck */
  var pressTimer = null,
    tapCount = 0,
    tapTimer = null;
  var noseTaps = 0,
    noseTimer = null;
  /* kittling: dra fingret fram och tillbaka över henne */
  var TK = { on: false, x: 0, dist: 0, turns: 0, lastDir: 0, t: 0, level: 0 };
  function tickleReset() {
    TK.on = false;
    TK.dist = 0;
    TK.turns = 0;
    TK.lastDir = 0;
    TK.level = 0;
  }
  function tickleMove(e) {
    if (!TK.on) return;
    var dx = e.clientX - TK.x;
    if (Math.abs(dx) < 16) return; /* små darrningar räknas inte */
    var dir = dx > 0 ? 1 : -1;
    if (TK.lastDir && dir !== TK.lastDir) TK.turns++;
    TK.lastDir = dir;
    TK.x = e.clientX;
    TK.dist += Math.abs(dx);
    var s = $s("s-svg");
    if (TK.turns >= 3 && TK.level < 1) {
      TK.level = 1;
      if (s) {
        s.classList.add("giggle");
      }
      mMood("cheer");
    }
    if (TK.turns >= 6 && TK.level < 2) {
      TK.level = 2;
      tone(1100, 0.06, 0);
      happyEyes(true);
    }
    if (TK.turns >= 10 && TK.level < 3) {
      TK.level = 3;
      if (s) s.classList.remove("giggle");
      tickleSiiri(); /* repliken och hemligheten */
      setTimeout(function () {
        dance(true);
      }, 420);
      tickleReset();
    }
  }
  document.addEventListener("pointermove", tickleMove, { passive: true });
  document.addEventListener(
    "pointerdown",
    function (e) {
      var nose = e.target.closest ? e.target.closest("#s-nose-hit") : null;
      if (nose) {
        noseTaps++;
        clearTimeout(noseTimer);
        noseTimer = setTimeout(function () {
          noseTaps = 0;
        }, 1500);
        tone(660, 0.05, 0);
        if (noseTaps >= 3) {
          noseTaps = 0;
          sneeze();
        }
        return;
      }
      var t = e.target.closest ? e.target.closest("#s-svg") : null;
      if (!t) return;
      TK.on = true;
      TK.x = e.clientX;
      TK.dist = 0;
      TK.turns = 0;
      TK.lastDir = 0;
      TK.level = 0;
      TK.t = Date.now();
      clearTimeout(pressTimer);
      pressTimer = setTimeout(function () {
        pressTimer = null;
        tapCount = 0;
        goldenSiiri();
      }, 1100);
    },
    { passive: true },
  );
  function endPress(e) {
    if (TK.on) {
      var s = $s("s-svg");
      if (s) s.classList.remove("giggle");
      if (TK.level > 0 && TK.level < 3) {
        happyEyes(false);
        mMood("");
      }
      tickleReset();
    }
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
      var t = e.target && e.target.closest ? e.target.closest("#s-svg") : null;
      if (t) {
        tapCount++;
        clearTimeout(tapTimer);
        tapTimer = setTimeout(function () {
          tapCount = 0;
        }, 1200);
        if (tapCount >= 6) {
          tapCount = 0;
          tickleSiiri();
          setTimeout(function () {
            dance(true);
          }, 420);
        }
      }
    }
  }
  document.addEventListener("pointerup", endPress, { passive: true });
  document.addEventListener(
    "pointercancel",
    function () {
      clearTimeout(pressTimer);
      pressTimer = null;
    },
    { passive: true },
  );

  /* ============ EGNA BILDER TILL ORD ============ */
  /* emojier räcker inte: 🏞️ betyder både sjö, flod och nationalpark.
       Orden nedan får egna ritade ikoner i stället. */
  var WORDART = {
    /* pennfodral: det finns ingen emoji, och 🖊️ visade bara en penna */
    pinal:
      '<g transform="translate(0 7)">' +
      '<g transform="rotate(-18 36 46)"><rect x="31" y="12" width="10" height="36" rx="1" fill="#F6C744"/><rect x="31" y="12" width="3.5" height="36" fill="#E2A92A"/><path d="M31 12 L36 1 L41 12 z" fill="#F2D9B0"/><path d="M34.3 5 L36 1 L37.7 5 z" fill="#3B3B3B"/></g>' +
      '<g transform="rotate(14 62 46)"><rect x="57" y="16" width="10" height="32" rx="1" fill="#E5534B"/><rect x="57" y="16" width="3.5" height="32" fill="#C23B35"/><path d="M57 16 L62 5 L67 16 z" fill="#F2D9B0"/><path d="M60.3 9 L62 5 L63.7 9 z" fill="#C23B35"/></g>' +
      '<rect x="10" y="40" width="80" height="44" rx="18" fill="#4E9AC4"/><path d="M10 64 h80 v2 a18 18 0 0 1 -18 18 h-44 a18 18 0 0 1 -18 -18 z" fill="#3D82AD"/>' +
      '<path d="M20 50 H80" stroke="#2C6688" stroke-width="5" stroke-linecap="round"/><path d="M20 50 H80" stroke="#BFD9EA" stroke-width="2.4" stroke-dasharray="2.6 2.6"/><circle cx="80" cy="50" r="4.5" fill="#D9D9D9" stroke="#8C8C8C" stroke-width="1.5"/><rect x="77.5" y="53" width="5" height="12" rx="2.5" fill="#D9D9D9" stroke="#8C8C8C" stroke-width="1.5"/>' +
      "</g>",
    järv:
      '<ellipse cx="50" cy="62" rx="36" ry="20" fill="#4E9AC4"/><ellipse cx="50" cy="60" rx="31" ry="16" fill="#7CC0E0"/>' +
      '<path d="M22 70 q14 -6 28 0 q14 6 28 0" stroke="#fff" stroke-width="3" fill="none" opacity=".6"/>' +
      '<path d="M6 62 q10 -22 20 -6 q8 -14 16 -2" fill="#5C9A5E"/><path d="M78 58 q10 -20 16 -2 v8 z" fill="#5C9A5E"/>' +
      '<circle cx="74" cy="24" r="9" fill="#FFE07A"/>',
    jõgi:
      '<path d="M18 8 q10 20 2 34 q-8 14 6 26 q12 10 6 24" stroke="#4E9AC4" stroke-width="18" fill="none" stroke-linecap="round"/>' +
      '<path d="M18 8 q10 20 2 34 q-8 14 6 26 q12 10 6 24" stroke="#7CC0E0" stroke-width="10" fill="none" stroke-linecap="round"/>' +
      '<path d="M44 20 q12 -10 22 2 q10 10 22 2" stroke="#5C9A5E" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      '<path d="M50 74 q14 -8 26 2" stroke="#5C9A5E" stroke-width="7" fill="none" stroke-linecap="round"/>',
    rahvuspark:
      '<path d="M8 76 h84 v8 H8 z" fill="#5C9A5E"/><path d="M26 76 l16 -40 l16 40 z" fill="#3E7A46"/>' +
      '<path d="M56 76 l14 -30 l14 30 z" fill="#4E8A52"/><circle cx="24" cy="24" r="8" fill="#FFE07A"/>' +
      '<path d="M14 76 q6 -16 12 0 z" fill="#6CB46E"/>',
    õlg:
      '<path d="M50 20 a16 16 0 1 1 0.1 0 z" fill="#F0C8A0"/>' +
      '<path d="M24 86 q2 -34 26 -34 q24 0 26 34 z" fill="#E8C79A"/>' +
      '<circle cx="26" cy="54" r="11" fill="#D6453F"/><circle cx="26" cy="54" r="5" fill="#fff" opacity=".5"/>',
    selg:
      '<path d="M50 18 a14 14 0 1 1 0.1 0 z" fill="#E8C79A" opacity=".5"/>' +
      '<path d="M30 84 q0 -42 20 -42 q20 0 20 42 z" fill="#F0C8A0"/>' +
      '<path d="M50 46 v34" stroke="#C08A6A" stroke-width="5" stroke-linecap="round"/>' +
      '<g stroke="#C08A6A" stroke-width="3"><path d="M42 54 h16 M42 64 h16 M42 74 h16"/></g>',
    kael:
      '<path d="M50 24 a16 16 0 1 1 0.1 0 z" fill="#F0C8A0"/>' +
      '<rect x="40" y="36" width="20" height="24" fill="#E8B88A"/>' +
      '<path d="M22 86 q4 -26 28 -26 q24 0 28 26 z" fill="#E8C79A"/>' +
      '<path d="M38 56 q12 8 24 0" stroke="#C08A6A" stroke-width="3" fill="none"/>',
    tund:
      '<rect x="10" y="18" width="80" height="54" rx="4" fill="#3E5A44"/>' +
      '<rect x="14" y="22" width="72" height="46" fill="#2E4A34"/>' +
      '<g stroke="#F7F1E2" stroke-width="3" stroke-linecap="round"><path d="M24 34 h30 M24 44 h40 M24 54 h22"/></g>' +
      '<rect x="8" y="72" width="84" height="7" rx="3" fill="#B07C48"/>',
    vahetund:
      '<circle cx="34" cy="26" r="9" fill="#F0C8A0"/>' +
      '<path d="M34 36 l-10 22 l8 4 l6 -12 l8 14 l8 -4 z" fill="#3A72C8"/>' +
      '<path d="M24 58 l-8 16" stroke="#E8893A" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M50 62 l10 14" stroke="#E8893A" stroke-width="6" stroke-linecap="round"/>' +
      '<circle cx="74" cy="30" r="14" fill="#FFE07A"/><path d="M74 22 v8 l6 4" stroke="#8A6238" stroke-width="3" fill="none"/>',
    joonlaud:
      '<rect x="10" y="38" width="80" height="22" rx="3" fill="#F2C94C"/>' +
      '<rect x="10" y="38" width="80" height="7" fill="#FFE07A"/>' +
      '<g stroke="#8A6238" stroke-width="2.6"><path d="M20 60 v-10 M30 60 v-7 M40 60 v-10 M50 60 v-7 M60 60 v-10 M70 60 v-7 M80 60 v-10"/></g>',
    tekk:
      '<rect x="12" y="34" width="76" height="40" rx="8" fill="#7FA9C9"/>' +
      '<rect x="12" y="34" width="76" height="12" rx="6" fill="#A8C8E0"/>' +
      '<g stroke="#5E87A8" stroke-width="2.4" opacity=".7"><path d="M30 46 v28 M50 46 v28 M70 46 v28"/></g>' +
      '<rect x="20" y="24" width="30" height="14" rx="7" fill="#FFFDF6"/>',
    pidžaama:
      '<path d="M26 26 h48 l6 16 l-10 4 v34 H30 V46 l-10 -4 z" fill="#C9A0E2"/>' +
      '<path d="M50 26 v54" stroke="#A87ACC" stroke-width="3"/>' +
      '<g fill="#F7EEDC"><circle cx="44" cy="44" r="3"/><circle cx="56" cy="56" r="3"/><circle cx="40" cy="66" r="3"/></g>',
    nõbu:
      '<circle cx="34" cy="34" r="14" fill="#F0C8A0"/><path d="M20 84 q0 -24 14 -24 q14 0 14 24 z" fill="#5C9C5E"/>' +
      '<circle cx="68" cy="40" r="12" fill="#E8C79A"/><path d="M56 84 q0 -22 12 -22 q12 0 12 22 z" fill="#E8893A"/>' +
      '<path d="M46 56 q8 -6 14 0" stroke="#C8305A" stroke-width="3" fill="none"/>',
    sõber:
      '<circle cx="32" cy="32" r="13" fill="#F0C8A0"/><path d="M18 82 q0 -24 14 -24 q14 0 14 24 z" fill="#3A72C8"/>' +
      '<circle cx="68" cy="32" r="13" fill="#E8C79A"/><path d="M54 82 q0 -24 14 -24 q14 0 14 24 z" fill="#D6453F"/>' +
      '<path d="M44 60 q6 -8 12 0" stroke="#4E9A5C" stroke-width="4" fill="none" stroke-linecap="round"/>',
    raamatukogu:
      '<rect x="10" y="20" width="80" height="64" rx="4" fill="#B07C48"/>' +
      '<rect x="14" y="24" width="72" height="56" fill="#8A5E30"/>' +
      '<rect x="14" y="46" width="72" height="5" fill="#B07C48"/>' +
      '<g><rect x="20" y="28" width="9" height="18" fill="#D6453F"/><rect x="31" y="30" width="8" height="16" fill="#3A72C8"/>' +
      '<rect x="41" y="27" width="10" height="19" fill="#E8B62C"/><rect x="53" y="31" width="8" height="15" fill="#4E9A5C"/>' +
      '<rect x="63" y="28" width="9" height="18" fill="#9A6BBE"/>' +
      '<rect x="20" y="53" width="8" height="18" fill="#4E9A5C"/><rect x="30" y="55" width="10" height="16" fill="#D6453F"/>' +
      '<rect x="42" y="52" width="8" height="19" fill="#3A72C8"/><rect x="52" y="56" width="9" height="15" fill="#E8B62C"/></g>',
    hõbedane:
      '<circle cx="50" cy="50" r="30" fill="#C8CCD2"/><circle cx="50" cy="50" r="23" fill="#E6EAF0"/>' +
      '<path d="M34 36 q16 -8 32 4" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".9"/>' +
      '<circle cx="50" cy="50" r="30" fill="none" stroke="#9AA2AC" stroke-width="3"/>',
    laps:
      '<circle cx="50" cy="32" r="16" fill="#F0C8A0"/>' +
      '<path d="M34 20 q16 -10 32 0 q-4 -12 -16 -12 q-12 0 -16 12 z" fill="#8A5E30"/>' +
      '<circle cx="44" cy="32" r="2.4" fill="#2A1B0C"/><circle cx="56" cy="32" r="2.4" fill="#2A1B0C"/>' +
      '<path d="M45 40 q5 4 10 0" stroke="#C8305A" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
      '<path d="M28 86 q0 -34 22 -34 q22 0 22 34 z" fill="#E8893A"/>',
    vikerkaar:
      '<g fill="none" stroke-width="7" stroke-linecap="round">' +
      '<path d="M14 76 a36 36 0 0 1 72 0" stroke="#D6453F"/>' +
      '<path d="M22 76 a28 28 0 0 1 56 0" stroke="#E8B62C"/>' +
      '<path d="M30 76 a20 20 0 0 1 40 0" stroke="#4E9A5C"/>' +
      '<path d="M38 76 a12 12 0 0 1 24 0" stroke="#3A72C8"/></g>' +
      '<ellipse cx="22" cy="80" rx="14" ry="7" fill="#fff"/><ellipse cx="78" cy="80" rx="14" ry="7" fill="#fff"/>',
    "ilus ilm":
      '<circle cx="38" cy="38" r="17" fill="#FFE07A"/>' +
      '<g stroke="#F2C94C" stroke-width="4" stroke-linecap="round"><path d="M38 12 v-6 M38 70 v6 M12 38 h-6 M64 38 h6 M20 20 l-4 -4 M56 56 l4 4 M20 56 l-4 4 M56 20 l4 -4"/></g>' +
      '<ellipse cx="62" cy="64" rx="24" ry="14" fill="#fff"/><ellipse cx="44" cy="68" rx="16" ry="10" fill="#fff"/>',
    sild:
      '<path d="M6 60 h88" stroke="#8A5E30" stroke-width="8"/>' +
      '<path d="M14 60 q36 -40 72 0" stroke="#C08A52" stroke-width="7" fill="none"/>' +
      '<g stroke="#A8713C" stroke-width="4"><path d="M28 60 v-16 M50 60 v-24 M72 60 v-16"/></g>' +
      '<rect x="6" y="64" width="88" height="16" fill="#7CC0E0"/>' +
      '<path d="M10 72 q10 -5 20 0 q10 5 20 0 q10 -5 20 0 q10 5 20 0" stroke="#fff" stroke-width="2.6" fill="none" opacity=".7"/>',
    lühike:
      '<rect x="24" y="52" width="16" height="34" rx="5" fill="#E8B62C"/>' +
      '<path d="M24 52 L32 38 L40 52 Z" fill="#C98A1E"/>' +
      '<rect x="60" y="20" width="16" height="66" rx="5" fill="#9BB7D4"/>' +
      '<path d="M60 20 L68 8 L76 20 Z" fill="#6E8FB0"/>' +
      '<path d="M18 92 L46 92" stroke="#D6453F" stroke-width="5" stroke-linecap="round"/>',
    muru:
      '<rect x="8" y="58" width="84" height="26" rx="6" fill="#5C9C5E"/>' +
      '<g stroke="#3E7A46" stroke-width="4" stroke-linecap="round">' +
      '<path d="M18 58 q2 -12 6 -16 M32 58 q-2 -14 2 -18 M46 58 q3 -12 7 -16 M60 58 q-2 -13 2 -17 M74 58 q3 -11 6 -15"/></g>' +
      '<circle cx="26" cy="70" r="3" fill="#8FD08F"/><circle cx="66" cy="74" r="3" fill="#8FD08F"/>',
    liiv:
      '<path d="M8 62 q22 -14 42 -2 q20 12 42 -4 v28 H8 z" fill="#E8D2A0"/>' +
      '<path d="M8 72 q22 -10 42 0 q20 10 42 -2 v18 H8 z" fill="#D8BE86"/>' +
      '<circle cx="30" cy="76" r="2" fill="#B8A06A"/><circle cx="58" cy="80" r="2" fill="#B8A06A"/>' +
      '<circle cx="74" cy="74" r="2" fill="#B8A06A"/>',
    oks:
      '<path d="M14 78 q22 -12 36 -34" stroke="#8A5E30" stroke-width="8" fill="none" stroke-linecap="round"/>' +
      '<path d="M36 56 q10 -14 22 -16" stroke="#8A5E30" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<g fill="#5C9C5E"><ellipse cx="60" cy="38" rx="12" ry="7" transform="rotate(-24 60 38)"/>' +
      '<ellipse cx="44" cy="30" rx="11" ry="6.5" transform="rotate(-50 44 30)"/>' +
      '<ellipse cx="68" cy="56" rx="11" ry="6.5" transform="rotate(10 68 56)"/></g>',
    udu:
      '<ellipse cx="50" cy="40" rx="34" ry="18" fill="#D8E2E8"/>' +
      '<g stroke="#A8BAC4" stroke-width="6" stroke-linecap="round" opacity=".9">' +
      '<path d="M16 58 h50 M30 70 h50 M20 82 h40"/></g>',
    pilv:
      '<ellipse cx="42" cy="56" rx="26" ry="18" fill="#FFFFFF"/>' +
      '<ellipse cx="64" cy="50" rx="20" ry="16" fill="#F4F8FB"/>' +
      '<ellipse cx="30" cy="48" rx="16" ry="13" fill="#FFFFFF"/>' +
      '<ellipse cx="50" cy="66" rx="34" ry="10" fill="#E2EAF0"/>',
    /* seelik vs kleit (👗) delar emoji – kjolen får en egen siluett */
    seelik:
      '<path d="M34 18 h32 l4 14 h-40 z" fill="#E8B62C"/>' +
      '<path d="M30 32 h40 l12 48 q-32 14 -64 0 z" fill="#3A72C8"/>' +
      '<path d="M30 32 h40" stroke="#2A5A9A" stroke-width="2.4" fill="none"/>',
    /* padi vs voodi (🛏️) delar emoji – kudden får en egen bild */
    padi:
      '<rect x="14" y="34" width="72" height="40" rx="18" fill="#FFFDF6"/>' +
      '<rect x="14" y="34" width="72" height="40" rx="18" fill="none" stroke="#E2D8C0" stroke-width="2.6"/>' +
      '<path d="M50 40 v28" stroke="#E2D8C0" stroke-width="2" stroke-dasharray="4 4"/>',
    /* ploom vs mustikas (🫐) delar emoji – plommonet får en egen bild */
    ploom:
      '<ellipse cx="50" cy="56" rx="26" ry="30" fill="#734184"/>' +
      '<ellipse cx="40" cy="44" rx="8" ry="10" fill="#9A6BBE" opacity=".55"/>' +
      '<path d="M50 26 q2 -10 10 -12" stroke="#5C9A5E" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="60" cy="16" rx="9" ry="5" fill="#5C9A5E" transform="rotate(30 60 16)"/>',
    /* kiik vs liumägi (🛝) delar emoji – gungan får en egen bild */
    kiik:
      '<path d="M10 16 h80" stroke="#8A5E30" stroke-width="7" stroke-linecap="round" fill="none"/>' +
      '<path d="M18 16 l10 54" stroke="#6E6E6E" stroke-width="3" fill="none"/>' +
      '<path d="M82 16 l-10 54" stroke="#6E6E6E" stroke-width="3" fill="none"/>' +
      '<rect x="22" y="70" width="56" height="12" rx="5" fill="#D6453F"/>',
    /* kõrval vs vahel delar emoji (↔️) – två positionsdiagram i stället */
    kõrval:
      '<circle cx="34" cy="50" r="20" fill="#3A72C8"/>' +
      '<circle cx="74" cy="50" r="20" fill="#E6EAF0" stroke="#B9C2CC" stroke-width="2.4"/>',
    vahel:
      '<circle cx="18" cy="50" r="15" fill="#E6EAF0" stroke="#B9C2CC" stroke-width="2.4"/>' +
      '<circle cx="50" cy="50" r="18" fill="#D6453F"/>' +
      '<circle cx="82" cy="50" r="15" fill="#E6EAF0" stroke="#B9C2CC" stroke-width="2.4"/>',
  };
  function wArt(et) {
    var a = WORDART[et];
    if (!a) return "";
    return '<svg class="wicon" viewBox="0 0 100 100" aria-hidden="true">' + a + "</svg>";
  }
  /* har ordet en bild som säkert stämmer? Läxord saknar bild (de hade bara 📝), och ett ord
       vars emoji är missvisande kan märkas med nopic: true i THEMES. Sådana ord visas utan
       ikon och hamnar aldrig i frågor där bilden är svaret. */
  function hasPic(w) {
    return !!(w && !w.school && !w.nopic && (WORDART[w.et] || (w.em && w.em !== "📝")));
  }
  /* ikon om vi ritat en, annars emoji – och hellre ingen alls än en som kan vara fel */
  function wIcon(w) {
    if (!hasPic(w)) return "";
    return wArt(w.et) || esc(w.em);
  }

  /* ============ SKOLANS GLOSOR ============ */
  /* Föräldern klistrar in veckans ord. De blandas in i alla lekar, prioriteras
       i urvalet, och faller bort av sig själva när barnet kan dem. */
  function schoolSet() {
    return S.school && S.school.words && S.school.words.length ? S.school : null;
  }
  function schoolDaysLeft() {
    var s = schoolSet();
    if (!s) return 0;
    var end = (s.added || today0()) + (s.days || 21);
    return end - today0();
  }
  function schoolKnows(w) {
    var mm = (S.wordmem || {})[mkey(w.et, w.sv)];
    return !!(mm && (mm.s || 0) >= 2 && (mm.r || 0) >= 3);
  }
  function schoolLeft() {
    var s = schoolSet();
    if (!s) return [];
    return s.words.filter(function (w) {
      return !schoolKnows(w);
    });
  }
  function schoolDone() {
    var s = schoolSet();
    if (!s) return 0;
    return s.words.length - schoolLeft().length;
  }
  /* städar bort hela omgången när tiden gått ut eller allt sitter */
  function schoolSweep() {
    var s = schoolSet();
    if (!s) return;
    if (schoolLeft().length === 0 || schoolDaysLeft() < 0) {
      if (!S.schoolDoneSets) S.schoolDoneSets = [];
      S.schoolDoneSets.push({ name: s.name, n: s.words.length, done: schoolDone(), when: today0() });
      S.school = null;
      save();
    }
  }
  function schoolParse(txt) {
    var lines = (txt || "").split(/[\n\r]+/),
      out = [],
      bad = [],
      i;
    for (i = 0; i < lines.length; i++) {
      var l = lines[i].trim();
      if (!l) continue;
      var parts = l.split(/\s*(?:=|;|\t|\u2013|\u2014| - |,)\s*/);
      if (parts.length < 2 || !parts[0] || !parts[1]) {
        bad.push(l);
        continue;
      }
      var et = parts[0].trim(),
        sv = parts[1].trim();
      if (et.length > 40 || sv.length > 40) {
        bad.push(l);
        continue;
      }
      out.push({ et: et, sv: sv, em: "📝", hint: et, school: true });
    }
    return { words: out.slice(0, 40), bad: bad };
  }
  function schoolHasAudio(et) {
    return !!(bank()[et] || partFor(et));
  }

  /* ---------- uttal till egna glosor ----------
       Ord som saknar inspelning hämtas från Neurokõne (Tartu universitet, rösten Mari –
       samma som resten av appen) och sparas i service workerns cache, så att de
       fungerar offline. Samma inställningar som tools/generate_audio.py. */
  var TTS_API = "https://api.tartunlp.ai/text-to-speech/v2";
  var TTS_CACHE = "siilikool"; /* samma cache som sw.js */
  var TTS_DIR = "audio/clips/school/";
  var TTS_SPEED = { normal: 0.95, slow: 0.6 },
    TTS_RMS = { normal: 0.148, slow: 0.12 };
  var ttsRun = null;
  function ttsOk() {
    return !!(window.caches && window.fetch && window.Promise && window.DataView);
  }
  function ttsUrl(et, kind) {
    var h = 5381,
      i;
    for (i = 0; i < et.length; i++) h = ((h * 33) ^ et.charCodeAt(i)) >>> 0;
    var s =
      et
        .toLowerCase()
        .replace(/[õö]/g, "o")
        .replace(/[äå]/g, "a")
        .replace(/ü/g, "u")
        .replace(/š/g, "s")
        .replace(/ž/g, "z")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 40) || "ord";
    return new URL(TTS_DIR + kind + "/" + s + "-" + h.toString(36) + ".wav", location.href).href;
  }
  function ttsFetch(text, speed) {
    /* utan avslutande skiljetecken tappar rösten sista ljudet ("Sinakas" -> "sinaka") */
    if (!/[.!?…]$/.test(text)) text += ".";
    var tries = 0;
    function go() {
      var ctl = window.AbortController ? new AbortController() : null;
      var t = ctl
        ? setTimeout(function () {
            ctl.abort();
          }, 45000)
        : 0;
      return fetch(TTS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "audio/wav" },
        body: JSON.stringify({ text: text, speaker: "mari", speed: speed }),
        signal: ctl ? ctl.signal : undefined,
      })
        .then(function (r) {
          clearTimeout(t);
          if (!r.ok) throw new Error("tts " + r.status);
          return r.arrayBuffer();
        })
        .catch(function (e) {
          clearTimeout(t);
          if (++tries < 3)
            return new Promise(function (res) {
              setTimeout(res, 2000 * tries);
            }).then(go);
          throw e;
        });
    }
    return go();
  }
  /* läser wav (16-bit eller float) till mono-flyttal */
  function wavRead(buf) {
    var v = new DataView(buf),
      p = 12,
      fmt = null,
      data = null;
    while (p + 8 <= v.byteLength) {
      var id = String.fromCharCode(v.getUint8(p), v.getUint8(p + 1), v.getUint8(p + 2), v.getUint8(p + 3)),
        sz = v.getUint32(p + 4, true);
      if (id === "fmt ")
        fmt = {
          tag: v.getUint16(p + 8, true),
          ch: v.getUint16(p + 10, true),
          sr: v.getUint32(p + 12, true),
          bits: v.getUint16(p + 22, true),
        };
      else if (id === "data") {
        data = { off: p + 8, len: Math.min(sz, v.byteLength - p - 8) };
        break;
      }
      p += 8 + sz + (sz & 1);
    }
    if (!fmt || !data) return null;
    var flt = fmt.tag === 3 || (fmt.tag === 0xfffe && fmt.bits === 32),
      by = fmt.bits / 8;
    if (!flt && fmt.bits !== 16) return null;
    var n = Math.floor(data.len / by / fmt.ch),
      s = new Float32Array(n),
      i,
      c,
      o,
      sum;
    for (i = 0; i < n; i++) {
      for (sum = 0, c = 0; c < fmt.ch; c++) {
        o = data.off + (i * fmt.ch + c) * by;
        sum += flt ? v.getFloat32(o, true) : v.getInt16(o, true) / 32768;
      }
      s[i] = sum / fmt.ch;
    }
    return { sr: fmt.sr, s: s };
  }
  /* klipper tystnaden till 0,25 s, jämnar ut nivån och skriver 16-bit mono-wav */
  function wavShape(w, kind) {
    var s = w.s,
      max = 0,
      i,
      a = -1,
      b = -1,
      sq = 0;
    for (i = 0; i < s.length; i++) if (Math.abs(s[i]) > max) max = Math.abs(s[i]);
    for (i = 0; i < s.length; i++)
      if (Math.abs(s[i]) > 0.02 * max) {
        if (a < 0) a = i;
        b = i;
      }
    if (a < 0) return null;
    for (i = a; i <= b; i++) sq += s[i] * s[i];
    var gain = TTS_RMS[kind] / Math.max(1e-6, Math.sqrt(sq / (b - a + 1)));
    var pad = Math.round(0.25 * w.sr),
      n = b - a + 1 + 2 * pad;
    var out = new DataView(new ArrayBuffer(44 + n * 2));
    function str(o, t) {
      for (var k = 0; k < 4; k++) out.setUint8(o + k, t.charCodeAt(k));
    }
    str(0, "RIFF");
    out.setUint32(4, 36 + n * 2, true);
    str(8, "WAVE");
    str(12, "fmt ");
    out.setUint32(16, 16, true);
    out.setUint16(20, 1, true);
    out.setUint16(22, 1, true);
    out.setUint32(24, w.sr, true);
    out.setUint32(28, w.sr * 2, true);
    out.setUint16(32, 2, true);
    out.setUint16(34, 16, true);
    str(36, "data");
    out.setUint32(40, n * 2, true);
    for (i = a; i <= b; i++)
      out.setInt16(44 + (pad + i - a) * 2, Math.round(Math.max(-0.98, Math.min(0.98, s[i] * gain)) * 32767), true);
    return new Blob([out.buffer], { type: "audio/wav" });
  }
  /* med service worker spelas klippet från cachen via sin adress, annars som blob */
  function ttsUse(et, kind, url, blob) {
    var src = navigator.serviceWorker && navigator.serviceWorker.controller ? url : URL.createObjectURL(blob);
    (kind === "slow" ? BANKS.slow : BANKS.normal)[et] = src;
  }
  /* ett ords uttal (normal/långsam): från cachen, annars från Neurokõne – sparas i cachen.
       Löftet ger "made" (hämtat), "hit" (fanns), "offline" eller "failed". */
  function ttsClip(c, et, kind) {
    var url = ttsUrl(et, kind);
    return c.match(url).then(function (hit) {
      if (hit)
        return hit.blob().then(function (bl) {
          ttsUse(et, kind, url, bl);
          return "hit";
        });
      if (navigator.onLine === false) return "offline";
      return ttsFetch(et, TTS_SPEED[kind])
        .then(function (buf) {
          var w = wavRead(buf),
            bl = w && wavShape(w, kind);
          if (!bl) throw new Error("tomt ljud");
          return c.put(url, new Response(bl, { headers: { "Content-Type": "audio/wav" } })).then(function () {
            ttsUse(et, kind, url, bl);
            return "made";
          });
        })
        .catch(function () {
          return "failed";
        });
    });
  }
  /* glosornas ord som saknar inspelning och därför behöver hämtat uttal */
  function ttsNeeds(et) {
    var src = BANKS.normal[et];
    return !(
      partFor(et) ||
      (src && src.indexOf("/" + TTS_DIR) < 0 && src.indexOf(TTS_DIR) !== 0 && src.indexOf("blob:") !== 0)
    );
  }
  /* glosorna i alla profiler på enheten – deras uttal får inte städas bort när en annan spelare spelar */
  function allSchoolWords() {
    var out = [],
      i,
      raw,
      p;
    for (i = 0; i < 3; i++) {
      try {
        raw = i === curSlot() ? S : JSON.parse(localStorage.getItem("siiri-eesti-v1" + (i ? "-" + i : "")) || "null");
        p = raw && raw.school && raw.school.words;
        if (p)
          p.forEach(function (w) {
            if (w && w.et) out.push(w.et);
          });
      } catch (e) {}
    }
    return out;
  }
  /* ett glosord utan ljud spelas upp: hämta uttalet nu (en gång per ord och session) */
  var ttsAsked = {};
  function ttsNow(et, kind) {
    if (!ttsOk() || ttsAsked[kind + ":" + et]) return Promise.resolve(false);
    ttsAsked[kind + ":" + et] = 1;
    return caches
      .open(TTS_CACHE)
      .then(function (c) {
        return ttsClip(c, et, kind);
      })
      .then(function (r) {
        return r === "made" || r === "hit";
      })
      .catch(function () {
        return false;
      });
  }
  function isSchoolWord(et) {
    var s = schoolSet();
    return !!(
      s &&
      s.words.some(function (w) {
        return w.et === et;
      })
    );
  }
  /* ser till att alla ord i glosorna har ljud: tar från cachen, hämtar det som saknas
       och rensar bort ljud från gamla listor. onProgress(klara, totalt) är valfri.
       Kommer en ny lista medan det pågår (t.ex. från familjen) körs det en gång till efteråt. */
  var ttsAgain = false;
  function schoolAudio(onProgress) {
    if (!ttsOk()) return Promise.resolve({ made: 0, failed: 0 });
    if (ttsRun) {
      ttsAgain = true;
      return ttsRun;
    }
    var s = schoolSet(),
      words = s
        ? s.words.map(function (w) {
            return w.et;
          })
        : [],
      want = {},
      todo = [];
    /* uttal som ska sparas: alla profilers glosor, inte bara den som spelas nu */
    allSchoolWords().forEach(function (et) {
      ["normal", "slow"].forEach(function (kind) {
        want[ttsUrl(et, kind)] = 1;
      });
    });
    words.forEach(function (et) {
      /* riktig inspelning finns (långsamt spelas den då i lägre takt) – hämta inget */
      if (!ttsNeeds(et)) return;
      ["normal", "slow"].forEach(function (kind) {
        if (!(kind === "slow" ? BANKS.slow : BANKS.normal)[et]) todo.push({ et: et, kind: kind });
      });
    });
    var made = 0,
      failed = 0,
      done = 0;
    ttsRun = caches
      .open(TTS_CACHE)
      .then(function (c) {
        /* städa: ljud till ord som inte längre finns i någon lista */
        var prune = c.keys().then(function (keys) {
          return Promise.all(
            keys
              .filter(function (k) {
                return k.url.indexOf("/" + TTS_DIR) >= 0 && !want[k.url];
              })
              .map(function (k) {
                return c.delete(k);
              }),
          );
        });
        var i = 0;
        function next() {
          if (i >= todo.length) return;
          var t = todo[i++];
          return ttsClip(c, t.et, t.kind)
            .then(function (r) {
              if (r === "made") made++;
              else if (r !== "hit") failed++;
              done++;
              if (onProgress) onProgress(done, todo.length);
            })
            .then(next);
        }
        return Promise.all([prune, next(), next()]);
      })
      .catch(function () {})
      .then(function () {
        ttsRun = null;
        if (ttsAgain) {
          ttsAgain = false;
          schoolAudio();
        }
        return { made: made, failed: failed, total: todo.length };
      });
    return ttsRun;
  }
  function schoolImport() {
    screen = "school";
    btnBack.hidden = false;
    var s = schoolSet();
    var html =
      '<div class="zone words"><span class="zem">📝</span><span><b>Koolisõnad</b>' +
      "<span>" +
      (childDevice() ? "Skolans glosor — från de vuxna i familjen" : "Skolans glosor — klistra in veckans ord") +
      "</span></span></div>";
    if (s) {
      var left = schoolLeft().length,
        d = schoolDaysLeft();
      html +=
        '<div class="card"><p class="kicker">' +
        esc(s.name || "Veckans ord") +
        "</p>" +
        '<p class="qsub"><b>' +
        schoolDone() +
        " av " +
        s.words.length +
        "</b> sitter · " +
        (d > 0 ? d + " dagar kvar" : "sista dagen") +
        '</p><div class="schoolwrap">';
      var i;
      for (i = 0; i < s.words.length; i++) {
        var w = s.words[i],
          ok = schoolKnows(w);
        html +=
          '<div class="schoolrow' +
          (ok ? " done" : "") +
          '"><span class="sw">' +
          esc(w.et) +
          "</span>" +
          '<span class="ss">' +
          esc(w.sv) +
          "</span>" +
          '<span class="sa">' +
          (ok ? "✓ " : "") +
          (schoolHasAudio(w.et)
            ? '<button class="speakbtn sm" data-say="' +
              esc(w.et) +
              '" aria-label="Hör ordet">🔊</button>' +
              '<button class="speakbtn sm" data-slow="' +
              esc(w.et) +
              '" aria-label="Hör ordet långsamt">🐢</button>'
            : ok
              ? ""
              : "—") +
          "</span></div>";
      }
      html +=
        '</div><button class="btn green big wide" id="schoolplay" style="margin-top:10px">▶️ Öva på orden</button>' +
        /* glosor från familjen tas bort av de vuxna i föräldraläget */
        (s.cloudId || childDevice()
          ? '<p class="qsub" style="margin-top:8px">Glosorna kommer från familjen – de vuxna byter dem i föräldraläget.</p>'
          : '<button class="btn ghost wide" id="schoolclear" style="margin-top:8px">Ta bort listan</button>') +
        "</div>";
    }
    if (childDevice()) {
      if (!s)
        html +=
          '<div class="card"><p class="kicker">Inga glosor just nu</p>' +
          '<p class="qsub">När en vuxen lägger in veckans ord i föräldraläget dyker de upp här.</p></div>';
      app.innerHTML = html;
      schoolBind();
      return;
    }
    html +=
      '<div class="card"><p class="kicker">Klistra in orden</p>' +
      '<p class="qsub">Ett ord per rad: <b>estniska = svenska</b>. Komma, semikolon eller tabb fungerar också.</p>' +
      '<textarea id="schooltxt" class="schooltext" rows="8" placeholder="koer = hund&#10;maja = hus&#10;punane = röd"></textarea>' +
      '<div class="row" style="margin-top:8px"><input id="schoolname" class="namefield" type="text" placeholder="Namn, t.ex. Vecka 41" maxlength="24">' +
      '<input id="schooldays" class="namefield" type="number" min="3" max="60" value="14" style="max-width:92px"></div>' +
      '<p class="qsub">Antal dagar listan ska gälla. Ord som sitter faller bort tidigare.</p>' +
      '<button class="btn green big wide" id="schoolsave">Lägg till i spelet</button>' +
      '<div id="schoolmsg"></div></div>';
    app.innerHTML = html;
    schoolBind();
    document.getElementById("schoolsave").onclick = schoolSaveClick;
  }
  /* knapparna i listan (öva, ta bort, lyssna) */
  function schoolBind() {
    var cl = document.getElementById("schoolclear");
    if (cl)
      cl.onclick = function () {
        S.school = null;
        save();
        schoolAudio();
        schoolImport();
      };
    var pl = document.getElementById("schoolplay");
    if (pl)
      pl.onclick = function () {
        go(schoolLessonStart, true);
      };
    var ssay = app.querySelectorAll("[data-say],[data-slow]"),
      si;
    for (si = 0; si < ssay.length; si++) {
      (function (el) {
        el.onclick = function () {
          var w = el.getAttribute("data-say");
          if (w) speak(w);
          else speak(el.getAttribute("data-slow"), true);
        };
      })(ssay[si]);
    }
  }
  /* "Lägg till i spelet": glosorna som klistrats in */
  function schoolSaveClick() {
    var txt = document.getElementById("schooltxt").value;
    var r = schoolParse(txt),
      msg = document.getElementById("schoolmsg");
    if (!r.words.length) {
      msg.innerHTML =
        '<p class="qsub" style="color:var(--berry)">Hittade inga ordpar. Skriv ett ord per rad med = mellan.</p>';
      return;
    }
    var withAudio = 0,
      i;
    for (i = 0; i < r.words.length; i++) if (schoolHasAudio(r.words[i].et)) withAudio++;
    S.school = {
      name: (document.getElementById("schoolname").value || "").trim() || "Veckans ord",
      words: r.words,
      added: today0(),
      days: Math.max(3, Math.min(60, parseInt(document.getElementById("schooldays").value, 10) || 14)),
    };
    save();
    var head =
      '<p class="qsub" style="color:var(--moss)"><b>' +
      r.words.length +
      " ord tillagda.</b> " +
      withAudio +
      " av dem har inspelad röst." +
      (r.bad.length ? "<br>" + r.bad.length + " rader kunde inte läsas." : "") +
      "</p>";
    msg.innerHTML = head;
    burst(60);
    fanfare(2);
    var t0 = Date.now();
    /* hämta uttal till resten; skärmen ritas om när det är klart (minst 0,9 s, som förut) */
    schoolAudio(function (n, tot) {
      msg.innerHTML = head + '<p class="qsub">🎙️ Hämtar uttal … ' + n + " av " + tot + "</p>";
    }).then(function (res) {
      if (res.failed)
        msg.innerHTML =
          head +
          '<p class="qsub" style="color:var(--berry)">' +
          Math.ceil(res.failed / 2) +
          " ord fick inget uttal just nu. Siiri försöker igen nästa gång appen är online.</p>";
      setTimeout(
        function () {
          if (screen === "school") schoolImport();
        },
        Math.max(0, (res.failed ? 2600 : 900) - (Date.now() - t0)),
      );
    });
  }

  /* ============ ORDMINNE ============ */
  /* varje ord får en vikt: fel höjer den, rätt sänker den. Tunga ord dyker upp oftare. */
  function today0() {
    return Math.floor(Date.now() / 86400000);
  }
  /* samma estniska ord kan betyda två olika saker (t.ex. "must" = svart/smutsig).
       sådana ord nycklas på et+sv så att den ena betydelsen inte räknas som kunskap om den andra. */
  var AMBIG_ET = (function () {
    var seen = {},
      dup = {},
      i,
      j,
      w,
      lists = [];
    for (i = 0; i < THEMES.length; i++) lists.push(THEMES[i].words);
    for (i = 0; i < TRIP.length; i++) lists.push(TRIP[i].words);
    for (i = 0; i < lists.length; i++) {
      for (j = 0; j < lists[i].length; j++) {
        w = lists[i][j];
        if (seen.hasOwnProperty(w.et) && seen[w.et] !== w.sv) dup[w.et] = true;
        seen[w.et] = w.sv;
      }
    }
    return dup;
  })();
  function mkey(et, sv) {
    return AMBIG_ET[et] ? et + "" + sv : et;
  }
  function wmem(et, sv) {
    if (!S.wordmem) S.wordmem = {};
    var k = mkey(et, sv);
    if (!S.wordmem[k]) S.wordmem[k] = { w: 1, r: 0, m: 0, d: today0(), s: 0 };
    return S.wordmem[k];
  }
  /* rätt svar skjuter fram nästa repetition: 1, 2, 4, 8, 16, 30 dagar.
       Fel nollställer intervallet. Att skriva eller säga ordet väger tyngre än att peka ut det. */
  function wmemHit(et, ok, mode, sv) {
    var m = wmem(et, sv);
    m.d = today0();
    if (ok) {
      m.r++;
      var strong = mode === "type" || mode === "speak";
      m.s = strong ? Math.min(6, (m.s || 0) + 1) : Math.min(3, (m.s || 0) + 0.5);
      m.w = Math.max(0.35, m.w * (strong ? 0.45 : 0.7));
    } else {
      m.m++;
      m.s = 0;
      m.w = Math.min(16, m.w + 2.2);
    }
    save();
  }
  /* meningsbyggarens ord är ofta böjda former ("sõidame", inte "sõita"),
     så bara de som exakt matchar ett riktigt ordförrådsord räknas in i
     ordminnet - annars skulle böjningsformer skräpa ner S.wordmem utan
     att någonsin repeteras på riktigt */
  function wmemHitSentenceWords(words, ok) {
    var pool = allWords(),
      i,
      j,
      token,
      match;
    for (i = 0; i < words.length; i++) {
      token = words[i].toLowerCase();
      match = null;
      for (j = 0; j < pool.length; j++) {
        if (pool[j].et.toLowerCase() === token) {
          match = pool[j];
          break;
        }
      }
      if (match) wmemHit(match.et, ok, "choose", match.sv);
    }
  }
  function wmemDue(et, sv) {
    var m = (S.wordmem || {})[mkey(et, sv)];
    if (!m) return 0;
    var gaps = [1, 2, 4, 8, 16, 30, 45];
    var gap = gaps[Math.min(6, Math.round(m.s || 0))] || 1;
    return today0() - (m.d || today0()) - gap;
  }
  function wordWeight(et, sv) {
    var sc = schoolSet(),
      i;
    if (sc)
      for (i = 0; i < sc.words.length; i++)
        if (sc.words[i].et === et && !schoolKnows(sc.words[i])) return 6.5; /* skolans ord först */
    var m = (S.wordmem || {})[mkey(et, sv)];
    if (!m) return 2.2;
    /* en gammal eller trasig minnespost får inte göra vikten till NaN */
    var base = typeof m.w === "number" && isFinite(m.w) ? m.w : 1;
    var w = Math.max(0.3, base),
      due = wmemDue(et, sv);
    if (isFinite(due) && due >= 0) w += 2.6 + Math.min(5, due * 0.5); /* förfallna ord går före */
    else w *= 0.35;
    return isFinite(w) ? w : 1;
  }
  /* drar n ord ur en lista, viktat så svåra ord kommer oftare */
  function pickWeighted(pool, n) {
    var left = pool.slice(),
      out = [],
      i,
      tot,
      r,
      acc;
    n = Math.min(n, left.length);
    var guard = 0;
    while (out.length < n && left.length && guard++ < 400) {
      tot = 0;
      for (i = 0; i < left.length; i++) tot += wordWeight(left[i].et, left[i].sv);
      if (!isFinite(tot) || tot <= 0) {
        /* kan inte vikta – ta dem i ordning */
        out.push(left.shift());
        continue;
      }
      r = Math.random() * tot;
      acc = 0;
      var took = false;
      for (i = 0; i < left.length; i++) {
        acc += wordWeight(left[i].et, left[i].sv);
        if (r <= acc) {
          out.push(left[i]);
          left.splice(i, 1);
          took = true;
          break;
        }
      }
      if (!took) out.push(left.shift()); /* avrundning kan missa – ta första */
    }
    return out;
  }
  function hardWords(limit) {
    var all = allWords(),
      out = [],
      i;
    for (i = 0; i < all.length; i++) {
      var m = (S.wordmem || {})[mkey(all[i].et, all[i].sv)];
      if (m && (m.w > 1.6 || wmemDue(all[i].et, all[i].sv) >= 0)) out.push({ w: all[i], m: m });
    }
    out.sort(function (a, b) {
      return b.m.w - a.m.w;
    });
    return out.slice(0, limit || 8);
  }

  /* ============ HJÄLP ============ */
  function shuffle(a) {
    var i, j, t;
    a = a.slice();
    for (i = a.length - 1; i > 0; i--) {
      j = (Math.random() * (i + 1)) | 0;
      t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function starStr(n) {
    var s = "",
      i;
    for (i = 0; i < 3; i++) s += i < n ? "★" : "☆";
    return s;
  }
  /* stjärnorna växer med märket så de stora målen blir nåbara */
  function starMult() {
    return 1 + Math.floor(rankIndex(S.xp) / 3);
  }
  function earnStars(n) {
    S.stars += Math.round(n * starMult());
  }
  function addXp(n, ev) {
    var before = rankIndex(S.xp);
    S.xp += n;
    var after = rankIndex(S.xp);
    save();
    refreshTop();
    if (ev) flyXp(n, ev);
    if (after > before) {
      S.rank = after;
      save();
      setTimeout(function () {
        rankUp(before, after);
      }, 700);
    }
  }
  function flyXp(n, ev) {
    try {
      var d = document.createElement("div");
      d.className = "xpfly";
      d.textContent = "+" + n;
      var x = (ev && ev.clientX) || innerWidth / 2,
        y = (ev && ev.clientY) || innerHeight / 2;
      d.style.left = x - 16 + "px";
      d.style.top = y - 30 + "px";
      document.body.appendChild(d);
      setTimeout(function () {
        d.remove();
      }, 1000);
    } catch (e) {}
  }
  function comboFlash(n) {
    var d = document.createElement("div");
    d.className = "combo";
    d.textContent = (n >= 5 ? "🔥 " : "") + "Kombo x" + n + "!";
    document.body.appendChild(d);
    setTimeout(function () {
      d.remove();
    }, 900);
  }
  function checkBadges() {
    var newOnes = [],
      i;
    for (i = 0; i < BADGES.length; i++) {
      if (S.badges.indexOf(BADGES[i].id) < 0 && BADGES[i].test(S)) {
        S.badges.push(BADGES[i].id);
        newOnes.push(BADGES[i]);
      }
    }
    if (newOnes.length) save();
    return newOnes;
  }
  /* hur nära en olåst bragd man är - visas som "x/y" så barnet ser målet
     komma närmare (goal-gradient: synlig närhet ökar motivationen) */
  function badgeProgress(b, s) {
    var n = 0,
      k,
      i;
    switch (b.id) {
      case "first":
        return [Math.min(s.correct || 0, 1), 1];
      case "ten":
        return [Math.min(s.correct || 0, 10), 10];
      case "fifty":
        return [Math.min(s.correct || 0, 50), 50];
      case "talker":
        return [Math.min(s.spoken || 0, 8), 8];
      case "writer":
        return [Math.min(s.typed || 0, 8), 8];
      case "perfect":
        return [Math.min(s.perfect || 0, 1), 1];
      case "all":
        for (k in s.best || {}) if (s.best[k] > 0) n++;
        return [Math.min(n, THEMES.length), THEMES.length];
      case "combo8":
        return [Math.min(s.bestcombo || 0, 8), 8];
      case "flame3":
        return [Math.min(s.flames || 0, 3), 3];
      case "stars100":
        return [Math.min(s.stars || 0, 100), 100];
      case "right250":
        return [Math.min(s.correct || 0, 250), 250];
      case "right1000":
        return [Math.min(s.correct || 0, 1000), 1000];
      case "spoken50":
        return [Math.min(s.spoken || 0, 50), 50];
      case "typed50":
        return [Math.min(s.typed || 0, 50), 50];
      case "sent25":
        if ((s.sentbest || 0) / 6 <= (s.correct || 0) / 200) return [Math.min(s.sentbest || 0, 6), 6];
        return [Math.min(s.correct || 0, 200), 200];
      case "flame7":
        return [Math.min(s.flames || 0, 7), 7];
      case "flame30":
        return [Math.min(s.flames || 0, 30), 30];
      case "trip6":
        return [Math.min(s.tripDone || 0, Math.ceil(TRIP.length / 2)), Math.ceil(TRIP.length / 2)];
      case "trip12":
        return [Math.min(s.tripDone || 0, TRIP.length), TRIP.length];
      case "wardrobe":
        return [Math.min((s.owned || []).length, 13), 13];
      case "wardrobeall":
        return [Math.min((s.owned || []).length, SHOP.length), SHOP.length];
      case "hardwin":
        return [Math.min(s.hardWins || 0, 1), 1];
      case "hard10":
        return [Math.min(s.hardWins || 0, 10), 10];
      case "perfect5":
        return [Math.min(s.perfect || 0, 5), 5];
      case "stars5000":
        return [Math.min(s.stars || 0, 5000), 5000];
      case "duel1":
        for (k in s.duels || {}) n += s.duels[k].w || 0;
        return [Math.min(n, 1), 1];
      case "duel10":
        for (k in s.duels || {}) n += s.duels[k].w || 0;
        return [Math.min(n, 10), 10];
      case "duelall":
        for (i = 0; i < RIVALS.length; i++) if (((s.duels || {})[RIVALS[i].id] || {}).w) n++;
        return [n, 4];
      default:
        return null; /* kilpkonn m.fl. hemligheter förblir mystiska */
    }
  }
  function badgeChip(b) {
    var has = S.badges.indexOf(b.id) >= 0;
    if (has) return '<span class="badge">' + b.em + " " + esc(b.sv) + "</span>";
    var p = badgeProgress(b, S);
    return (
      '<span class="badge" style="opacity:.35;filter:grayscale(1)">' +
      b.em +
      " " +
      esc(b.sv) +
      (p ? '<small style="opacity:.8;font-weight:700">' + p[0] + "/" + p[1] + "</small>" : "") +
      "</span>"
    );
  }
  /* liten flytande toast, samma mönster som "Raske sõna ×2"-rutan - visas
     direkt istället för att vänta till rundans slut */
  function badgeToast(newOnes, i) {
    i = i || 0;
    if (i >= newOnes.length) return;
    var b = newOnes[i];
    var d = document.createElement("div");
    d.className = "combo hardwin";
    d.innerHTML = b.em + " Nytt märke: " + esc(b.sv);
    document.body.appendChild(d);
    sndLvl();
    setTimeout(function () {
      d.remove();
    }, 1600);
    if (i + 1 < newOnes.length) setTimeout(badgeToast, 1300, newOnes, i + 1);
  }

  /* ============ SKÄRMAR ============ */
  var screen = "home";
  var roomFacing = "front"; /* "front" eller "back" - styr bara hur Siiri ritas i Tuba */
  function go(fn, isSub) {
    btnBack.hidden = !isSub;
    window.scrollTo(0, 0);
    /* riktning: inåt när man öppnar något, utåt när man går tillbaka */
    app.classList.remove("back");
    if (!isSub) app.classList.add("back");
    void app.offsetWidth;
    fn();
  }

  /* teman låses upp efterhand så man slipper välja bland sexton på en gång */

  function themeMastery(t) {
    var i,
      strong = 0,
      m;
    for (i = 0; i < t.words.length; i++) {
      m = (S.wordmem || {})[mkey(t.words[i].et, t.words[i].sv)];
      if (m && (m.s || 0) >= 2) strong++;
    }
    var p = strong / t.words.length;
    return {
      pct: Math.round(p * 100),
      strong: strong,
      total: t.words.length,
      medal: p >= 0.95 ? "gold" : p >= 0.7 ? "silver" : p >= 0.4 ? "bronze" : "",
    };
  }
  function masteryEm(m) {
    return m === "gold" ? "🥇" : m === "silver" ? "🥈" : m === "bronze" ? "🥉" : "";
  }
  function themesDone() {
    var n = 0,
      k;
    for (k in S.best || {}) {
      if (S.best[k] > 0) n++;
    }
    return n;
  }
  function themesUnlocked() {
    return Math.min(THEMES.length, 4 + themesDone() * 2);
  }
  /* vad "Mängime!" gör just nu */
  function nextUp() {
    var hw = hardWords(99);
    if (hw.length >= 6) return { kind: "hard", sv: "öva orden som vacklar", et: UI.hard.et };
    var lim = themesUnlocked(),
      i,
      t;
    for (i = 0; i < lim && i < THEMES.length; i++) {
      t = THEMES[i];
      if (!(S.best[t.id] > 0)) return { kind: "theme", t: t, sv: esc(t.sv), et: t.et };
    }
    for (i = 0; i < lim && i < THEMES.length; i++) {
      t = THEMES[i];
      if ((S.best[t.id] || 0) < 3) return { kind: "theme", t: t, sv: esc(t.sv), et: t.et };
    }
    return { kind: "mix", sv: "blandade ord från allt du kan", et: UI.mix.et };
  }
  function startNext() {
    var n = nextUp();
    if (n.kind === "theme") {
      speak(n.t.et);
      go(function () {
        lessonStart(n.t.id);
      }, true);
    } else if (n.kind === "hard") {
      speak(UI.hard.et);
      go(speedIntro, true);
    } else {
      speak(UI.mix.et);
      go(speedIntro, true);
    }
  }
  var sessionStart = Date.now(),
    pauseShown = false;
  function checkPause() {
    if (pauseShown || Date.now() - sessionStart < 40 * 60 * 1000) return;
    pauseShown = true;
    var d = document.createElement("div");
    d.className = "overlay";
    d.innerHTML =
      '<div class="oc"><p class="kicker">Siiri sträcker på sig</p><div style="font-size:52px">🫖</div>' +
      "<h3>Dags för en paus?</h3><p>Ni har hållit på i fyrtio minuter. Orden sitter bättre om man vilar en stund emellan.</p>" +
      '<button class="btn green big wide" id="pz">Okej, vi pausar</button>' +
      '<button class="btn ghost wide" id="pn" style="margin-top:8px">Vi fortsätter lite till</button></div>';
    document.body.appendChild(d);
    d.querySelector("#pz").onclick = function () {
      d.remove();
      go(homeScreen, false);
    };
    d.querySelector("#pn").onclick = function () {
      d.remove();
      sessionStart = Date.now();
      pauseShown = false;
    };
  }
  function homeScreen() {
    checkPause();
    idleKick();
    screen = "home";
    newDay();
    var i,
      t,
      html = "",
      n = nextUp(),
      p = questProgress(),
      se = seasonNow(),
      hol = holidayNow();
    var ri = rankIndex(S.xp),
      nxt = RANKS[ri + 1];

    /* spellägen: beräknas tidigt så den minst prövade leken kan erbjudas
       som ett riktigt ALTERNATIV till den gröna knappens eget förslag -
       annars väljer algoritmen allt och barnet får ingen egen vilja med. */
    var MODES = [
      /* åtta egna kulörer – ingen delas av två lekar */
      {
        k: "otsi",
        em: "🔍",
        et: "Otsi!",
        sv: "Hitta det Siiri säger",
        grp: "gör",
        bg: "linear-gradient(160deg,#1E9A5E,#0C6038)",
      },
      { k: "mem", em: "🃏", et: "Mälumäng", sv: "Memory", grp: "gör", bg: "linear-gradient(160deg,#0E8FA0,#05525E)" },
      {
        k: "rain",
        em: "🌧️",
        et: "Sõnasadu",
        sv: "Ordregnet",
        grp: "gör",
        bg: "linear-gradient(160deg,#2C6FD0,#123E86)",
      },
      {
        k: "speed",
        em: "🎲",
        et: esc(UI.mix.et),
        sv: esc(UI.mix.sv),
        grp: "öva",
        bg: "linear-gradient(160deg,#6A4FE0,#35218F)",
      },
      {
        k: "sent",
        em: "🧩",
        et: esc(UI.sent.et),
        sv: esc(UI.sent.sv),
        grp: "öva",
        bg: "linear-gradient(160deg,#A24AD6,#5C1E85)",
      },
      {
        k: "talk",
        em: "💬",
        et: esc(UI.talk.et),
        sv: esc(UI.talk.sv),
        grp: "öva",
        bg: "linear-gradient(160deg,#D6407E,#8A1046)",
      },
      {
        k: "duel",
        em: "⚔️",
        et: "Duell",
        sv: "Tävla mot ett djur",
        grp: "tävla",
        bg: "linear-gradient(160deg,#E04A2E,#8E1E10)",
      },
      {
        k: "chal",
        em: "🤝",
        et: "Väljakutse",
        sv: "Utmana en vuxen",
        grp: "tävla",
        bg: "linear-gradient(160deg,#D18A0A,#8A5200)",
      },
    ];
    if (!S.tried) S.tried = {};
    /* obeprövade lägen först, sedan de minst använda */
    MODES.sort(function (x, y) {
      return (S.tried[x.k] || 0) - (S.tried[y.k] || 0);
    });
    var altMode = MODES[0];

    /* säsong allra överst – det första man ser */
    html +=
      '<div class="seasonbar">' +
      (hol ? hol.em : se.em) +
      " <b>" +
      esc(hol ? hol.et : se.et) +
      "</b>" +
      "<span>" +
      (hol ? esc(hol.sv) : esc(se.sv) + " · " + esc(se.word.et) + " = " + esc(se.word.sv)) +
      "</span></div>";

    html +=
      '<div class="zone play"><span class="zem">🎮</span><span><b>Mängime</b>' +
      "<span>" +
      (S.name ? esc(S.name) + " · " : "") +
      esc(RANKS[ri].et) +
      " · ⭐ " +
      S.stars.toLocaleString("sv-SE") +
      "</span></span></div>";
    html +=
      '<div class="hero"><div class="herorow">' +
      siilSVG("small") +
      '<div style="flex:1"><h1>' +
      (S.name ? "Tere, " + esc(S.name) + "!" : "Tere!") +
      "<span>" +
      esc(RANKS[ri].et) +
      " · " +
      esc(RANKS[ri].sv) +
      "</span></h1>" +
      '<button class="bubble" id="hello" style="margin-top:8px">🔊 Tere' +
      (S.name ? ", " + esc(S.name) : "") +
      "!" +
      "<small>hej" +
      (S.name ? ", " + esc(S.name) : "") +
      "</small></button></div></div></div>";

    /* den gröna knappen föreslår, men barnet ska också kunna välja själv
       (autonomi, inte bara ett enda påtvingat förslag) - därför en liten
       andrahandsknapp bredvid som alltid pekar på en annan lek */
    html +=
      '<button class="playbtn" id="play"><span class="pem">▶️</span>' +
      "<span><b>" +
      esc(UI.play.et) +
      "</b><span>" +
      esc(UI.play.sv) +
      "</span>" +
      "<small>" +
      (n.kind === "theme" ? esc(n.t.em + " " + n.t.et + " · " + n.t.sv) : esc(n.et + " · " + n.sv)) +
      "</small></span></button>" +
      '<button class="btn ghost wide" id="playalt" style="margin-top:6px">🔀 Eller: ' +
      altMode.em +
      " " +
      esc(altMode.et) +
      " · " +
      esc(altMode.sv) +
      "</button>";

    if (!S.correct || S.correct < 3) {
      html +=
        '<div class="emptytip"><span class="arrow">☝️</span><span><b>Börja här!</b>' +
        "<span>Tryck på den gröna knappen — Siiri visar vägen. Allt du klarar ger stjärnor att handla för på marknaden!</span></span></div>";
    }

    /* dagens överraskning */
    if (bagReady()) {
      html +=
        '<button class="bagbtn" id="bag"><span class="bem">🎁</span>' +
        "<span><b>" +
        esc(UI.bag.et) +
        "</b><span>" +
        esc(UI.bag.sv) +
        " – öppna dagens påse!</span></span></button>";
    }

    /* tre spellägen */
    /* spellägen: tre synliga, resten bakom en knapp – och nyheter markeras */
    var showMode = S.allModes ? MODES.length : 5;
    html += '<div class="modes">';
    var newLeft = 2; /* märket betyder inget om allt är nytt */
    for (i = 0; i < showMode; i++) {
      var md = MODES[i],
        isNew = !S.tried[md.k] && newLeft > 0;
      if (isNew) newLeft--;
      html +=
        '<button class="mode' +
        (isNew ? " fresh" : "") +
        '" data-go="' +
        md.k +
        '" style="background:' +
        md.bg +
        '">' +
        (isNew ? '<span class="newtag">Ny!</span>' : "") +
        '<span class="grp">' +
        ({ gör: "GÖR", öva: "ÖVA", tävla: "TÄVLA" }[md.grp] || "") +
        "</span>" +
        '<span class="em">' +
        md.em +
        "</span><b>" +
        md.et +
        "</b><span>" +
        md.sv +
        "</span></button>";
    }
    html += "</div>";
    html +=
      '<button class="morebtn" id="moremodes">' +
      (S.allModes ? "Näita vähem · Visa färre lekar" : "Näita kõiki · Visa alla " + MODES.length + " lekar") +
      "</button>";

    /* resan */
    var trn = tripReached(),
      tdone = 3 - tasksLeft(),
      allDone = tripDone() >= TRIP.length;
    html +=
      '<div class="tripcard">' +
      '<p class="tripkick"><span class="tripflag">🎶</span> Laulupidu · Siiri reser genom Estlands ' +
      TRIP.length +
      " orter</p>" +
      '<button class="tripgo" id="tripbtn">' +
      '<span class="tripem">' +
      TRIP[trn - 1].em +
      "</span>" +
      '<span class="triptx">' +
      '<b><span lang="et">' +
      esc(UI.trip.et) +
      '</span> · <span lang="et">' +
      esc(TRIP[trn - 1].et) +
      "</span></b>" +
      "<small>" +
      (allDone ? "hela resan klar!" : "ort " + trn + " av " + TRIP.length) +
      "</small>" +
      '<span class="tripbar"><i style="width:' +
      Math.round((tripDone() / TRIP.length) * 100) +
      '%"></i></span>' +
      '<span class="triplines">' +
      tripDone() +
      " av " +
      TRIP.length +
      " orter</span>" +
      "</span>" +
      '<span class="tripcta"><span class="tripgobtn">Mine ▸</span><small>gå dit</small></span>' +
      "</button>" +
      (allDone
        ? ""
        : '<div class="tripmini">' +
          '<span class="tripdots">' +
          "●".repeat(tdone) +
          "○".repeat(Math.max(0, 3 - tdone)) +
          "</span>" +
          "<span>" +
          tdone +
          ' av 3 uppdrag klara i <span lang="et">' +
          esc(TRIP[trn - 1].et) +
          "</span></span></div>") +
      "</div>";

    /* skolans glosor, om en lista är igång */
    (function () {
      var sc = schoolSet();
      if (!sc) return;
      var d = schoolDaysLeft(),
        pct = Math.round((schoolDone() / sc.words.length) * 100);
      html +=
        '<button class="stbox wide school" id="schoolbtn" style="width:100%;margin-top:14px">' +
        "<b>📝 " +
        esc(sc.name) +
        " · ▶️ Öva läxorden</b>" +
        "<small>" +
        schoolDone() +
        " av " +
        sc.words.length +
        " sitter" +
        (d > 0 ? " · " + d + " dagar kvar" : " · sista dagen") +
        "</small>" +
        '<span class="qbar" style="background:var(--line)"><i style="width:' +
        pct +
        '%;background:var(--moss)"></i></span></button>' +
        '<button class="btn small ghost" id="schooledit" style="margin-top:6px">✏️ Ändra glosorna</button>';
    })();

    /* kompakt status: utmaning + nivå */
    html +=
      '<div class="statusrow">' +
      '<button class="stbox" id="questbtn"><b>' +
      p.q.em +
      " " +
      (p.done ? "Klart!" : p.v + " / " + p.q.goal) +
      "</b>" +
      "<small>" +
      esc(p.q.sv) +
      (S.flames ? " · 🔥 " + S.flames : "") +
      "</small>" +
      '<span class="qbar" style="background:var(--line)"><i style="width:' +
      Math.round((p.v / p.q.goal) * 100) +
      '%;background:var(--moss)"></i></span></button>' +
      "</div>";

    /* svit i fara: varna innan den nollställs tyst imorgon, inte efteråt */
    if (S.flames && !p.done)
      html +=
        '<div class="streaktip"><span class="em">🔥</span><span>' +
        S.flames +
        " dagar i rad – klara dagens utmaning idag så fortsätter den!</span></div>";

    /* teman */
    var lim = themesUnlocked(),
      showAll = !!S.showAll;
    var visible = showAll ? lim : Math.min(lim, 6);
    html +=
      '<h2 class="sec">' +
      esc(UI.themes.et) +
      ' <span style="font-weight:500;color:var(--muted);font-size:15.5px">' +
      esc(UI.themes.sv) +
      '</span></h2><div class="grid">';
    for (i = 0; i < THEMES.length; i++) {
      t = THEMES[i];
      var locked = i >= lim;
      if (!locked && i >= visible) continue;
      if (locked && i > lim + 1) continue;
      var bs = S.best[t.id] || 0;
      html +=
        '<button class="tile' +
        (locked ? " locked" : "") +
        '"' +
        (locked ? "" : ' data-theme="' + t.id + '"') +
        ">" +
        '<span class="em">' +
        (locked ? "🔒" : t.em) +
        "</span>" +
        '<span class="et">' +
        esc(t.et) +
        '</span><span class="sv">' +
        esc(t.sv) +
        " · " +
        t.words.length +
        " ord</span>" +
        '<span class="stars">' +
        (locked
          ? '<small style="color:var(--muted)">klara fler teman</small>'
          : starStr(bs) +
            " " +
            (function () {
              var mm = themeMastery(t);
              return mm.medal ? masteryEm(mm.medal) : "";
            })()) +
        "</span></button>";
    }
    html += "</div>";
    if (lim > 6)
      html +=
        '<button class="morebtn" id="more">' +
        (showAll
          ? "Näita vähem · Visa färre teman"
          : "Näita kõiki · Visa alla " + Math.min(THEMES.length, lim) + " öppna teman") +
        "</button>";

    app.innerHTML = html;
    document.getElementById("play").onclick = startNext;
    document.getElementById("hello").onclick = function () {
      if (S.name) speakTo("tere");
      else speak("Tere! Mina olen Siiri.");
      mood("cheer");
    };
    document.getElementById("questbtn").onclick = function () {
      go(trophyScreen, true);
    };
    var sbn = document.getElementById("schoolbtn");
    if (sbn)
      sbn.onclick = function () {
        go(schoolLessonStart, true);
      };
    var sed = document.getElementById("schooledit");
    if (sed)
      sed.onclick = function () {
        go(schoolImport, true);
      };
    document.getElementById("tripbtn").onclick = function () {
      speak(TRIP[tripReached() - 1].et);
      go(tripScreen, true);
    };
    var bg = document.getElementById("bag");
    if (bg)
      bg.onclick = function () {
        openBag();
      };
    var mb = document.getElementById("more");
    if (mb)
      mb.onclick = function () {
        S.showAll = !S.showAll;
        save();
        homeScreen();
      };
    var sb = app.querySelector(".seasonbar"),
      seasonTaps = 0,
      seasonTimer = null;
    if (sb)
      sb.onclick = function () {
        seasonTaps++;
        clearTimeout(seasonTimer);
        seasonTimer = setTimeout(function () {
          seasonTaps = 0;
        }, 2000);
        if (seasonTaps >= 5) {
          seasonTaps = 0;
          yearRound();
          return;
        }
        seasonFx();
        var hh = holidayNow();
        speak(hh ? hh.et : seasonNow().word.et);
        mood("cheer");
      };
    var tiles = app.querySelectorAll("[data-theme]");
    for (i = 0; i < tiles.length; i++) {
      (function (el) {
        el.onclick = function () {
          var id = el.getAttribute("data-theme"),
            j;
          for (j = 0; j < THEMES.length; j++) {
            if (THEMES[j].id === id) speak(THEMES[j].et);
          }
          go(function () {
            lessonStart(id);
          }, true);
        };
      })(tiles[i]);
    }
    var modes = {
      speed: speedIntro,
      sent: sentIntro,
      talk: talkScreen,
      mem: memIntro,
      rain: rainIntro,
      duel: duelIntro,
      chal: chIntro,
      otsi: otsiIntro,
    };
    var keys = ["speed", "sent", "talk", "mem", "rain", "duel", "chal", "otsi"];
    for (i = 0; i < keys.length; i++) {
      (function (k) {
        var el = app.querySelector('[data-go="' + k + '"]');
        if (el)
          el.onclick = function () {
            var nm = {
              speed: UI.mix.et,
              sent: UI.sent.et,
              talk: UI.talk.et,
              mem: "Mälumäng",
              rain: "Sõnasadu",
              duel: "Duell",
              chal: "Väljakutse",
              otsi: "Otsi!",
            }[k];
            S.tried[k] = (S.tried[k] || 0) + 1;
            save();
            speak(nm);
            go(modes[k], true);
          };
      })(keys[i]);
    }
    var pa = document.getElementById("playalt");
    if (pa)
      pa.onclick = function () {
        S.tried[altMode.k] = (S.tried[altMode.k] || 0) + 1;
        save();
        speak(altMode.et);
        go(modes[altMode.k], true);
      };
    var mm2 = document.getElementById("moremodes");
    if (mm2)
      mm2.onclick = function () {
        S.allModes = !S.allModes;
        save();
        homeScreen();
      };
    refreshTop();
    setNav("home");
  }
  function setNav(which) {
    var nav = document.getElementById("nav");
    if (!nav) return;
    nav.hidden = !S.setupdone;
    var bs = nav.querySelectorAll("[data-nav]"),
      i;
    for (i = 0; i < bs.length; i++) {
      bs[i].className = bs[i].getAttribute("data-nav") === which ? "on" : "";
    }
  }

  /* ---------- VANEMALE: sidan för föräldern ---------- */
  function parentScreen() {
    screen = "parent";
    setNav("me");
    var all = allWords(),
      i,
      strong = 0,
      weak = 0,
      unseen = 0,
      m;
    for (i = 0; i < all.length; i++) {
      m = (S.wordmem || {})[mkey(all[i].et, all[i].sv)];
      if (!m) unseen++;
      else if ((m.s || 0) >= 2) strong++;
      else weak++;
    }
    var days = Object.keys(S.wordmem || {}).length ? null : null;
    var hw = hardWords(12),
      t,
      mm;
    var html =
      '<div class="zone me"><span class="zem">👨‍👩‍👧</span><span><b>Vanemale</b>' +
      "<span>För föräldern — vad barnet faktiskt kan</span></span></div>";
    /* föräldraläget: barn, glosor, familjekod och lås (Nuxt-sidan /parent) */
    if (cloudOn())
      html +=
        '<a class="btn green wide" href="/parent" style="margin-bottom:12px">👨‍👩‍👧 Föräldraläget · barn, glosor och familjekod</a>';
    html +=
      '<div class="card"><p class="q" style="text-align:left">' +
      (S.name ? esc(S.name) : "Spelaren") +
      " just nu</p>" +
      '<div class="stats">' +
      '<div class="stat"><b>' +
      strong +
      "</b><span>ord som sitter</span></div>" +
      '<div class="stat"><b>' +
      weak +
      "</b><span>ord som vacklar</span></div>" +
      '<div class="stat"><b>' +
      unseen +
      "</b><span>ord kvar att möta</span></div>" +
      '<div class="stat"><b>' +
      (S.flames || 0) +
      "</b><span>dagar i rad</span></div>" +
      '<div class="stat"><b>' +
      (S.lessons || 0) +
      "</b><span>avklarade lektioner</span></div>" +
      '<div class="stat"><b>' +
      S.correct +
      "</b><span>rätta svar totalt</span></div>" +
      '<div class="stat"><b>' +
      S.spoken +
      "</b><span>ord sagda högt</span></div>" +
      '<div class="stat"><b>' +
      S.typed +
      "</b><span>ord skrivna</span></div>" +
      "</div>" +
      '<p class="qsub" style="text-align:left;margin-top:10px">Ett ord räknas som att det <b>sitter</b> först när barnet ' +
      "klarat det flera gånger, helst genom att skriva eller säga det — inte bara peka på rätt bild.</p></div>";
    /* per tema */
    html += '<div class="card"><p class="q" style="text-align:left">Tema för tema</p><div class="parentlist">';
    for (i = 0; i < THEMES.length; i++) {
      t = THEMES[i];
      mm = themeMastery(t);
      html +=
        '<div class="prow"><span class="pem">' +
        t.em +
        "</span>" +
        '<span class="ptx"><b>' +
        esc(t.sv) +
        "</b>" +
        '<span class="qbar" style="background:var(--line)"><i style="width:' +
        mm.pct +
        "%;background:" +
        (mm.medal === "gold" ? "var(--honey)" : mm.medal === "silver" ? "var(--blue)" : "var(--moss)") +
        '"></i></span>' +
        "<small>" +
        mm.strong +
        " av " +
        mm.total +
        " ord sitter" +
        (mm.medal ? " · " + masteryEm(mm.medal) : "") +
        "</small></span></div>";
    }
    html += "</div></div>";
    if (hw.length) {
      html += '<div class="card"><p class="q" style="text-align:left">Ord att öva tillsammans</p><div class="shelf">';
      for (i = 0; i < hw.length; i++) {
        html +=
          '<button class="shelfitem" data-say="' +
          esc(hw[i].w.et) +
          '"><span class="em">' +
          wIcon(hw[i].w) +
          "</span>" +
          "<b>" +
          esc(hw[i].w.et) +
          "</b><small>" +
          esc(hw[i].w.sv) +
          "</small></button>";
      }
      html +=
        '</div><p class="qsub" style="text-align:left;margin-top:10px">Appen tar redan upp dem oftare. Att säga dem högt hemma hjälper mest.</p></div>';
    }
    html +=
      '<div class="card"><p class="q" style="text-align:left">Om inlärningen</p>' +
      '<p class="qsub" style="text-align:left">Orden återkommer med växande mellanrum — en dag, två, fyra, åtta, sexton, trettio. ' +
      "Ett fel nollställer intervallet. Det är samma princip som i forskningen kring repetition över tid, och den är " +
      "inbyggd i alla spellägen, så barnet möter rätt ord utan att behöva välja dem.</p></div>";
    app.innerHTML = html;
    var bs = app.querySelectorAll("[data-say]"),
      k;
    for (k = 0; k < bs.length; k++) {
      (function (el) {
        el.onclick = function () {
          speak(el.getAttribute("data-say"));
        };
      })(bs[k]);
    }
  }

  /* ---------- ADMIN: dolt felsökningsläge ---------- */
  var ADMIN_CODE = "lyckholm";
  var APPVER = "2.0",
    BUILDDATE = "2026-10-04";
  /* självtest: letar tysta fel som annars aldrig syns */
  function runSelfTest(log) {
    var fails = [],
      warn = [],
      i,
      j,
      nb = bank(),
      sb = bank(true),
      words = allWords();
    for (i = 0; i < words.length; i++) {
      if (words[i].school) continue; /* importerade glosor saknar ofta ljud */
      if (!nb[words[i].et] && !partFor(words[i].et)) fails.push("ljud saknas: " + words[i].et);
      else if (!sb[words[i].et] && !partFor(words[i].et) && !slowPartFor(words[i].et))
        warn.push("långsamt saknas: " + words[i].et);
    }
    for (i = 0; i < SENTENCES.length; i++) {
      if (!nb[SENTENCES[i].et] && !partFor(SENTENCES[i].et)) fails.push("mening utan ljud: " + SENTENCES[i].et);
      for (j = 0; j < SENTENCES[i].w.length; j++) {
        var tk = SENTENCES[i].w[j];
        if (!nb[tk] && !partFor(tk)) warn.push("ordbricka utan ljud: " + tk);
      }
    }
    for (i = 0; i < TRIP.length; i++) {
      if (!TRIPTASKS[TRIP[i].id]) fails.push("ort utan uppdrag: " + TRIP[i].id);
      if (!SOUVENIR[TRIP[i].id] || !itemById(SOUVENIR[TRIP[i].id])) fails.push("ort utan souvenir: " + TRIP[i].id);
      if (!nb[TRIP[i].et] && !partFor(TRIP[i].et)) warn.push("ortnamn utan ljud: " + TRIP[i].et);
    }
    var slots = {};
    for (i = 0; i < SLOTS.length; i++) slots[SLOTS[i].id] = 1;
    for (i = 0; i < SHOP.length; i++) {
      if (!slots[SHOP[i].slot]) fails.push("okänd plats: " + SHOP[i].id);
      if (!wearSVG(SHOP[i].slot)) 0;
      if (!nb[SHOP[i].et] && !partFor(SHOP[i].et)) warn.push("vara utan ljud: " + SHOP[i].et);
    }
    for (i = 1; i < RANKS.length; i++) {
      if (RANKS[i].xp <= RANKS[i - 1].xp) fails.push("medaljordning fel: " + RANKS[i].id);
    }
    var seen = {};
    for (i = 0; i < SECRETS.length; i++) {
      if (seen[SECRETS[i].id]) fails.push("dubbel hemlighet: " + SECRETS[i].id);
      seen[SECRETS[i].id] = 1;
      if (!SECRETS[i].hint) fails.push("hemlighet utan gåta: " + SECRETS[i].id);
    }
    for (i = 0; i < BADGES.length; i++) {
      try {
        BADGES[i].test(S);
      } catch (e) {
        fails.push("bragd kraschar: " + BADGES[i].id);
      }
    }
    log(
      (fails.length ? "❌ " + fails.length + " fel" : "✅ inga fel") +
        " · " +
        (warn.length ? "⚠️ " + warn.length + " varningar" : "inga varningar") +
        " · " +
        words.length +
        " ord, " +
        SHOP.length +
        " varor, " +
        RANKS.length +
        " medaljer, " +
        SECRETS.length +
        " hemligheter" +
        (fails.length ? " — " + fails.slice(0, 4).join("; ") : warn.length ? " — " + warn.slice(0, 3).join("; ") : ""),
    );
  }
  function adminScreen() {
    screen = "admin";
    setNav("me");
    var parts = window.AUDIO_PARTS ? Object.keys(window.AUDIO_PARTS.loaded || {}).length : 0;
    var wordCount = allWords().length,
      bankN = Object.keys(bank()).length,
      namesN = Object.keys(BANKS.names || {}).length;
    var html =
      '<div class="card" style="border-color:#C8305A">' +
      '<p class="q" style="text-align:left">🛠️ Admin</p>' +
      '<p class="qsub" style="text-align:left">Version ' +
      APPVER +
      " · byggd " +
      BUILDDATE +
      "</p>" +
      '<p class="qsub" style="text-align:left">Felsökningsläge. Barnet ser aldrig den här sidan.</p>' +
      '<div class="stats">' +
      '<div class="stat"><b>' +
      wordCount +
      "</b><span>ord i spelet</span></div>" +
      '<div class="stat"><b>' +
      bankN +
      "</b><span>ljudklipp laddade</span></div>" +
      '<div class="stat"><b>' +
      namesN +
      "</b><span>namn</span></div>" +
      '<div class="stat"><b>' +
      parts +
      "</b><span>ljuddelar</span></div>" +
      '<div class="stat"><b>' +
      TRIP.length +
      "</b><span>orter</span></div>" +
      '<div class="stat"><b>' +
      SHOP.length +
      "</b><span>plagg</span></div>" +
      '<div class="stat"><b>' +
      SENTENCES.length +
      "</b><span>meningar</span></div>" +
      '<div class="stat"><b>' +
      SECRETS.length +
      "</b><span>hemligheter</span></div>" +
      "</div></div>";
    html +=
      '<div class="card"><p class="q" style="text-align:left">Lås upp</p><div class="row" style="justify-content:flex-start">' +
      '<button class="btn ghost" data-a="stars1k">+1 000 ⭐</button>' +
      '<button class="btn ghost" data-a="stars100k">+100 000 ⭐</button>' +
      '<button class="btn ghost" data-a="xp">+2 000 poäng</button>' +
      '<button class="btn ghost" data-a="themes">Alla teman</button>' +
      '<button class="btn ghost" data-a="trip">Hela resan</button>' +
      '<button class="btn ghost" data-a="shop">Alla plagg</button>' +
      '<button class="btn ghost" data-a="secrets">Alla hemligheter</button>' +
      '<button class="btn ghost" data-a="badges">Alla märken</button>' +
      '<button class="btn ghost" data-a="all">🔓 Allt på en gång</button>' +
      "</div></div>";
    html +=
      '<div class="card"><p class="q" style="text-align:left">Testa</p><div class="row" style="justify-content:flex-start">' +
      '<button class="btn ghost" data-a="bag">Öppna påsen igen</button>' +
      '<button class="btn ghost" data-a="hol">Visa högtidsruta</button>' +
      '<button class="btn ghost" data-a="rank">Nästa märke</button>' +
      '<button class="btn ghost" data-a="egg">Spela upp en hemlighet</button>' +
      '<button class="btn ghost" data-a="bkmake">💾 Spara en kopia nu</button>' +
      '<button class="btn ghost" data-a="bkload">↩️ Hämta tillbaka kopian</button>' +
      '<button class="btn ghost" data-a="dance">💃 Testa dansen</button>' +
      '<button class="btn ghost" data-a="mic">Testa mikrofonen</button>' +
      '<button class="btn ghost" data-a="voice">Testa rösten</button>' +
      '<button class="btn ghost" data-a="selftest">🔍 Kör självtest</button>' +
      '</div><p class="qsub" id="adminlog" style="text-align:left;margin-top:8px">&nbsp;</p></div>';
    html +=
      '<div class="card"><p class="q" style="text-align:left">Farligt</p><div class="row" style="justify-content:flex-start">' +
      '<button class="btn ghost" data-a="wipeword">Nollställ ordminnet</button>' +
      '<button class="btn ghost" data-a="wipe" style="color:var(--berry)">Nollställ allt</button>' +
      '<button class="btn ghost" data-a="off">Stäng adminläget</button>' +
      "</div></div>";
    app.innerHTML = html;
    var log = function (t) {
      var e = document.getElementById("adminlog");
      if (e) e.textContent = t;
    };
    var bs = app.querySelectorAll("[data-a]"),
      i;
    for (i = 0; i < bs.length; i++) {
      (function (el) {
        el.onclick = function () {
          var a = el.getAttribute("data-a"),
            k,
            j;
          if (a === "stars1k") {
            S.stars += 1000;
          } else if (a === "stars100k") {
            S.stars += 100000;
          } else if (a === "xp") {
            S.xp += 2000;
          } else if (a === "themes") {
            for (j = 0; j < THEMES.length; j++) {
              if (!S.best[THEMES[j].id]) S.best[THEMES[j].id] = 1;
            }
            S.showAll = 1;
          } else if (a === "trip") {
            for (j = 0; j < THEMES.length; j++) {
              S.best[THEMES[j].id] = Math.max(1, S.best[THEMES[j].id] || 0);
            }
            S.tripDone = TRIP.length;
            S.tripP = {};
          } else if (a === "shop") {
            S.owned = [];
            for (j = 0; j < SHOP.length; j++) S.owned.push(SHOP[j].id);
          } else if (a === "secrets") {
            S.secrets = [];
            for (j = 0; j < SECRETS.length; j++) S.secrets.push(SECRETS[j].id);
            S.secretsOpen = 1;
          } else if (a === "badges") {
            S.badges = [];
            for (j = 0; j < BADGES.length; j++) S.badges.push(BADGES[j].id);
          } else if (a === "all") {
            S.stars += 100000;
            S.xp = RANKS[RANKS.length - 1].xp;
            S.showAll = 1;
            S.owned = [];
            for (j = 0; j < SHOP.length; j++) S.owned.push(SHOP[j].id);
            S.secrets = [];
            for (j = 0; j < SECRETS.length; j++) S.secrets.push(SECRETS[j].id);
            S.badges = [];
            for (j = 0; j < BADGES.length; j++) S.badges.push(BADGES[j].id);
            for (j = 0; j < THEMES.length; j++) S.best[THEMES[j].id] = 3;
            S.tripDone = TRIP.length;
            S.tripP = {};
          } else if (a === "bag") {
            S.bagday = null;
            save();
            openBag();
            return;
          } else if (a === "hol") {
            S.holseen = null;
            save();
            var hh = holidayNow() || HOLIDAYS[0];
            var d = document.createElement("div");
            d.className = "overlay";
            d.innerHTML =
              '<div class="oc"><p class="kicker">Testvisning</p><div style="font-size:64px">' +
              hh.em +
              "</div>" +
              "<h3>" +
              esc(hh.et) +
              "</h3><p>" +
              esc(hh.tr) +
              '</p><button class="btn big wide" id="hok">Stäng</button></div>';
            document.body.appendChild(d);
            burst(140);
            speak(hh.et);
            d.querySelector("#hok").onclick = function () {
              d.remove();
            };
            return;
          } else if (a === "rank") {
            var ri = rankIndex(S.xp);
            if (RANKS[ri + 1]) {
              S.xp = RANKS[ri + 1].xp;
              save();
              refreshTop();
              rankUp(ri, ri + 1);
            }
            return;
          } else if (a === "egg") {
            goldenSiiri();
            return;
          } else if (a === "dance") {
            dance(true);
            log("Siiri dansar.");
            return;
          } else if (a === "bkmake") {
            autoBackup("manuell");
            var p0 = backupInfo();
            log(p0 ? "Kopia sparad (" + backupAge(p0) + ")." : "Kunde inte spara.");
            return;
          } else if (a === "bkload") {
            var p1 = backupInfo();
            if (!p1) {
              log("Ingen kopia finns.");
              return;
            }
            if (restoreBackup()) {
              log("Kopian hämtad — laddar om…");
              setTimeout(function () {
                location.reload();
              }, 600);
            } else log("Kunde inte hämta kopian.");
            return;
          } else if (a === "mic") {
            log("Testar mikrofonen …");
            listen(
              function (alts) {
                log("Hörde: " + alts[0]);
              },
              function () {},
              function (err) {
                log("Mikrofonfel: " + micProblem(err));
              },
            );
            return;
          } else if (a === "voice") {
            log("Spelar upp tre ord …");
            speak("tere");
            setTimeout(function () {
              speak("jäätis");
            }, 1200);
            setTimeout(function () {
              speak("Kuressaare");
            }, 2600);
            return;
          } else if (a === "selftest") {
            runSelfTest(log);
            return;
          } else if (a === "wipeword") {
            S.wordmem = {};
            log("Ordminnet nollställt.");
          } else if (a === "wipe") {
            confirmBox(
              "Nollställ allt",
              "Namn, poäng, stjärnor, garderob, resa och hemligheter raderas. Går inte att ångra.",
              "Ja, radera allt",
              function () {
                /* sparas i familjekontot? Då kopplas spelaren bort från enheten först – kontots kopia
                                   av spelet lämnas orörd, så ett barn kan inte radera den av misstag */
                Promise.resolve(cloudOn() ? window.SiiriCloud.unlink() : null)
                  .catch(function () {})
                  .then(function () {
                    /* nollställer profilen som spelas nu (i minnet och i lagringen) */
                    STORE.wipe();
                    try {
                      location.reload();
                    } catch (e) {}
                    setTimeout(function () {
                      /* om omladdning blockeras: börja om utan att ladda om */
                      applyScene();
                      applyColor();
                      refreshTop();
                      setupScreen(true);
                    }, 400);
                  });
              },
            );
            return;
          } else if (a === "off") {
            S.admin = 0;
            save();
            go(profileScreen, true);
            return;
          }
          save();
          refreshTop();
          adminScreen();
          log("Klart: " + a);
        };
      })(bs[i]);
    }
  }
  function confirmBox(title, text, okText, cb) {
    var d = document.createElement("div");
    d.className = "overlay";
    d.innerHTML =
      '<div class="oc" style="border-color:var(--berry)"><p class="kicker">' +
      esc(title) +
      "</p>" +
      '<div style="font-size:44px">⚠️</div><p>' +
      esc(text) +
      "</p>" +
      '<button class="btn big wide" id="cbyes" style="background:var(--berry);box-shadow:0 5px 0 #8E1338;margin-top:8px">' +
      esc(okText) +
      "</button>" +
      '<button class="btn ghost wide" id="cbno" style="margin-top:8px">Avbryt</button></div>';
    document.body.appendChild(d);
    d.querySelector("#cbyes").onclick = function () {
      d.remove();
      cb();
    };
    d.querySelector("#cbno").onclick = function () {
      d.remove();
    };
  }
  function askAdmin() {
    var d = document.createElement("div");
    d.className = "overlay";
    d.innerHTML =
      '<div class="oc" style="border-color:#C8305A"><p class="kicker">🛠️ Låst läge</p>' +
      '<h3 style="font-size:19px">Kod</h3>' +
      '<input class="type" id="admcode" type="password" autocomplete="off" placeholder="••••••••" style="font-size:19px">' +
      '<p class="qsub" id="admmsg" style="min-height:18px">&nbsp;</p>' +
      '<button class="btn big wide" id="admok">Lås upp</button>' +
      '<button class="btn ghost wide" id="admno" style="margin-top:8px">Avbryt</button></div>';
    document.body.appendChild(d);
    var inp = d.querySelector("#admcode"),
      msg = d.querySelector("#admmsg");
    setTimeout(function () {
      try {
        inp.focus();
      } catch (e) {}
    }, 80);
    function check() {
      if ((inp.value || "").trim().toLowerCase() === ADMIN_CODE) {
        S.admin = 1;
        save();
        sndLvl();
        d.remove();
        go(adminScreen, true);
      } else {
        sndNo();
        msg.textContent = "Fel kod.";
        inp.value = "";
        inp.className = "type wrong";
        setTimeout(function () {
          inp.className = "type";
        }, 500);
      }
    }
    d.querySelector("#admok").onclick = check;
    d.querySelector("#admno").onclick = function () {
      d.remove();
    };
    inp.onkeydown = function (e) {
      if (e.key === "Enter") check();
    };
  }

  /* ---------- PROFIL ---------- */
  var COLORS = [
    { id: "skog", sv: "Skog", c1: "#EDF4E6", c2: "#2E6B45" },
    { id: "rosa", sv: "Rosa", c1: "#FFF1F6", c2: "#E24D90" },
    { id: "lila", sv: "Lila", c1: "#F5F0FF", c2: "#7B52D6" },
    { id: "hav", sv: "Hav", c1: "#EBF6FF", c2: "#2B8CD9" },
    { id: "sol", sv: "Sol", c1: "#FFF8E6", c2: "#DD8A12" },
    { id: "mint", sv: "Mint", c1: "#EAFBF3", c2: "#12A97A" },
  ];
  function applyScene() {
    var s = wearing("scene");
    if (s && owns(s)) document.documentElement.setAttribute("data-scene", s);
    else document.documentElement.removeAttribute("data-scene");
  }
  function applyColor() {
    var c = S.color || "skog";
    if (c === "skog") document.documentElement.removeAttribute("data-color");
    else document.documentElement.setAttribute("data-color", c);
  }
  var AVATARS = ["🦔", "🐻", "🦊", "🐰", "🐼", "🦉", "🐸", "🐯", "🦁", "🐨", "🐧", "🦄", "🐢", "🐙"];
  function setupScreen(first) {
    screen = "setup";
    setNav(first ? "" : "me");
    btnBack.hidden = !!first ? true : false;
    var html =
      '<div class="card" style="text-align:center">' +
      '<div class="center">' +
      siilSVG("small") +
      "</div>" +
      '<p class="q">' +
      (first ? "Tere! Vad heter du?" : "Ändra din profil") +
      "</p>" +
      '<p class="qsub">Då kan Siiri säga hej till dig med namn.</p>' +
      '<input class="type" id="nm" maxlength="14" autocomplete="given-name" placeholder="ditt namn" value="' +
      esc(S.name || "") +
      '">' +
      '<p class="qsub" style="margin-top:18px">Välj din figur</p><div class="avatars" id="avs">';
    for (var i = 0; i < AVATARS.length; i++) {
      html +=
        '<button class="av' +
        (AVATARS[i] === (S.avatar || "🦔") ? " on" : "") +
        '" data-av="' +
        AVATARS[i] +
        '">' +
        AVATARS[i] +
        "</button>";
    }
    html += '</div><p class="qsub" style="margin-top:18px">Hur svårt ska det vara?</p><div class="diffs" id="dfs">';
    for (i = 0; i < DIFFS.length; i++) {
      html +=
        '<button class="dif' +
        (DIFFS[i].id === (S.diff || "lagom") ? " on" : "") +
        '" data-dif="' +
        DIFFS[i].id +
        '">' +
        '<span class="de">' +
        DIFFS[i].em +
        "</span><b>" +
        DIFFS[i].sv +
        "</b>" +
        "<small>" +
        esc(DIFFS[i].txt) +
        "</small></button>";
    }
    html += '</div><p class="qsub" style="margin-top:18px">Välj färg på appen</p><div class="colors" id="cols">';
    for (i = 0; i < COLORS.length; i++) {
      html +=
        '<button class="col' +
        (COLORS[i].id === (S.color || "skog") ? " on" : "") +
        '" data-col="' +
        COLORS[i].id +
        '" aria-label="' +
        COLORS[i].sv +
        '">' +
        '<span style="background:linear-gradient(160deg,' +
        COLORS[i].c1 +
        " 45%," +
        COLORS[i].c2 +
        ' 45%)"></span>' +
        "<b>" +
        COLORS[i].sv +
        "</b></button>";
    }
    html +=
      '</div><button class="btn green big wide" id="ok" style="margin-top:18px">' +
      (first ? "Nu kör vi! 🎈" : "Spara") +
      "</button>" +
      (first ? '<button class="btn ghost wide" id="skip" style="margin-top:8px">Hoppa över</button>' : "") +
      "</div>";
    app.innerHTML = html;
    var avs = app.querySelectorAll("[data-av]"),
      i;
    for (i = 0; i < avs.length; i++) {
      (function (el) {
        el.onclick = function () {
          var a = app.querySelectorAll("[data-av]");
          for (var j = 0; j < a.length; j++) a[j].classList.remove("on");
          el.classList.add("on");
          S.avatar = el.getAttribute("data-av");
          save();
        };
      })(avs[i]);
    }
    var dfs = app.querySelectorAll("[data-dif]");
    for (i = 0; i < dfs.length; i++) {
      (function (el) {
        el.onclick = function () {
          var a = app.querySelectorAll("[data-dif]");
          for (var j = 0; j < a.length; j++) a[j].classList.remove("on");
          el.classList.add("on");
          S.diff = el.getAttribute("data-dif");
          save();
          var sv = $s("s-svg");
          if (sv) {
            if (S.diff === "svar") {
              sv.classList.add("cool");
              tone(520, 0.1, 0);
              tone(780, 0.14, 0.1);
              mood("cheer");
            } else {
              sv.classList.remove("cool");
              tone(700, 0.09, 0);
            }
          } else tone(700, 0.09, 0);
        };
      })(dfs[i]);
    }
    var cols = app.querySelectorAll("[data-col]");
    for (i = 0; i < cols.length; i++) {
      (function (el) {
        el.onclick = function () {
          var a = app.querySelectorAll("[data-col]");
          for (var j = 0; j < a.length; j++) a[j].classList.remove("on");
          el.classList.add("on");
          S.color = el.getAttribute("data-col");
          save();
          applyColor();
          tone(760, 0.09, 0);
        };
      })(cols[i]);
    }
    document.getElementById("ok").onclick = function () {
      var v = document.getElementById("nm").value.trim().slice(0, 14);
      S.name = v;
      S.setupdone = 1;
      save();
      prefetchName();
      if (v.toLowerCase() === "siiri" || v.toLowerCase() === "siil") {
        foundSecret("me");
        addXp(40);
        burst(140);
        go(homeScreen, false);
        setTimeout(function () {
          eggSay("me");
          mood("cheer");
        }, 400);
        return;
      }
      go(homeScreen, false);
      setTimeout(function () {
        if (v) speakTo("tere");
        else speak("Tere! Mina olen Siiri.");
        mood("cheer");
      }, 350);
    };
    if (first) {
      document.getElementById("skip").onclick = function () {
        S.setupdone = 1;
        save();
        go(homeScreen, false);
      };
    }
    setTimeout(function () {
      var n = document.getElementById("nm");
      if (n && !S.name) n.focus();
    }, 150);
  }
  function profileScreen() {
    screen = "profile";
    setNav("me");
    newDay();
    var ri = rankIndex(S.xp),
      nxt = RANKS[ri + 1],
      i,
      done = 0;
    for (var k in S.best) {
      if (S.best[k] > 0) done++;
    }
    var html =
      '<div class="zone me"><span class="zem">🦔</span><span><b>Minu profiil</b><span>Min profil</span></span></div>' +
      '<div class="card" style="text-align:center">' +
      siilSVG("small") +
      '<p class="q" style="font-size:26px;margin:2px 0">' +
      (S.name ? esc(S.name) : "Ingen spelare än") +
      "</p>" +
      (hasVoiceName()
        ? '<button class="btn ghost" id="sayname">🔊 Hör Siiri säga ditt namn</button>'
        : S.name
          ? '<p class="qsub">Siiri kan inte säga just det namnet högt än, men skriver det överallt.</p>'
          : "") +
      '<div style="max-width:130px;margin:10px auto 0">' +
      medalSVG(RANKS[ri], "prof", false, medalStyleOf(RANKS[ri].id)) +
      "</div>" +
      '<p class="q" style="font-size:19px;margin:4px 0">' +
      esc(RANKS[ri].et) +
      "</p>" +
      '<p class="qsub" style="margin:0">' +
      esc(RANKS[ri].sv) +
      "</p>" +
      (nxt
        ? '<p class="qsub">Nästa märke om ' + (nxt.xp - S.xp) + " poäng</p>"
        : '<p class="qsub">Alla märken tagna!</p>') +
      "</div>";
    html +=
      '<div class="card"><p class="q" style="text-align:left">Dina siffror</p><div class="stats">' +
      '<div class="stat"><b>' +
      S.xp +
      "</b><span>poäng</span></div>" +
      '<div class="stat"><b>' +
      S.stars +
      "</b><span>stjärnor</span></div>" +
      '<div class="stat"><b>' +
      S.correct +
      "</b><span>rätta svar</span></div>" +
      '<div class="stat"><b>' +
      (S.bestcombo || 0) +
      "</b><span>bästa kombo</span></div>" +
      '<div class="stat"><b>' +
      done +
      " / " +
      THEMES.length +
      "</b><span>teman klara</span></div>" +
      '<div class="stat"><b>' +
      (S.flames || 0) +
      " 🔥</b><span>dagar i rad</span></div>" +
      '<div class="stat"><b>' +
      S.spoken +
      "</b><span>sagt högt</span></div>" +
      '<div class="stat"><b>' +
      S.typed +
      "</b><span>skrivna ord</span></div>" +
      '<div class="stat"><b>' +
      hardWords(99).length +
      "</b><span>ord att öva</span></div>" +
      "</div></div>";
    html += '<div class="card"><p class="q" style="text-align:left">Dina bragder</p>';
    for (i = 0; i < BADGES.length; i++) {
      html += badgeChip(BADGES[i]);
    }
    html += "</div>";
    var got = (S.secrets || []).length;
    if (S.secretsOpen) {
      html +=
        '<div class="secretbox"><h3 id="secclose" style="cursor:pointer">🤫 ' +
        got +
        " av " +
        SECRETS.length +
        '<span style="float:right;opacity:.65;font-weight:500">✕ dölj</span></h3>';
      for (i = 0; i < SECRETS.length; i++) {
        var f = (S.secrets || []).indexOf(SECRETS[i].id) >= 0;
        html +=
          '<div class="secretrow' +
          (f ? "" : " hidden") +
          '"><span class="em">' +
          (f ? SECRETS[i].em : "❔") +
          "</span>" +
          "<span>" +
          (f ? esc(SECRETS[i].sv) : '<i style="opacity:.8">' + esc(SECRETS[i].hint) + "</i>") +
          "<small>" +
          (f ? "Hittad" : "") +
          "</small></span></div>";
      }
      html +=
        '<p class="qsub" style="color:#C9BCEF;margin-top:8px">Siiri gömmer saker i appen. Vissa hittar man av en slump.</p></div>';
    }
    /* profilväxlaren */
    html +=
      '<div class="card"><p class="q" style="text-align:left">Mängijad · Spelare</p>' +
      '<p class="qsub" style="text-align:left">Varje spelare har egna poäng, egen figur och egen garderob.</p>' +
      '<div class="slotgrid">';
    for (i = 0; i < 3; i++) {
      var si = slotInfo(i),
        cur = i === curSlot();
      html +=
        '<button class="slotbtn' +
        (cur ? " on" : "") +
        '" data-slot="' +
        i +
        '">' +
        '<span class="sav">' +
        (si ? si.avatar : "➕") +
        "</span>" +
        "<b>" +
        (si ? (si.name ? esc(si.name) : "Namnlös") : "Ny spelare") +
        "</b>" +
        "<small>" +
        (si ? si.xp.toLocaleString("sv-SE") + " p · ⭐" + si.stars.toLocaleString("sv-SE") : "tom plats") +
        "</small>" +
        slotTag(i) +
        (cur ? '<small style="color:var(--moss)">spelar nu</small>' : "") +
        "</button>";
    }
    html += "</div></div>";
    html += familyCard();

    /* säkerhetskopiering */
    html +=
      '<div class="card"><p class="q" style="text-align:left">Varukoopia · Säkerhetskopia</p>' +
      '<p class="qsub" style="text-align:left">' +
      cloudLine() +
      "</p>" +
      '<div class="row" style="justify-content:flex-start">' +
      '<button class="btn ghost" id="bkexp">📋 Kopiera min kod</button>' +
      '<button class="btn ghost" id="bkimp">📥 Återställ från kod</button></div>' +
      '<p class="qsub" id="bkmsg" style="text-align:left;min-height:18px;margin-top:8px">&nbsp;</p></div>';

    html +=
      '<div class="card"><p class="q" id="setttl" style="text-align:left;cursor:pointer;-webkit-user-select:none;user-select:none">Seaded · Inställningar</p>' +
      '<div class="row" style="justify-content:flex-start">' +
      '<button class="btn ghost" id="psound">' +
      (S.sound ? "🔊 Ljud på" : "🔇 Ljud av") +
      "</button>" +
      '<button class="btn ghost" id="ptheme">🌙 Ljust / mörkt</button>' +
      '<button class="btn ghost" id="pamb">' +
      (S.amb === 0 ? "🎵 Ljudmiljö av" : "🎵 Ljudmiljö på") +
      "</button></div>" +
      '<p class="qsub" style="text-align:left;margin-top:8px">' +
      esc(voiceStatus()) +
      "</p></div>";
    if (!S.secretsOpen) html += '<button class="peek" id="peekbtn">🤫</button>';
    html +=
      '<button class="btn wide" id="toroom2" style="margin-top:12px">🏠 Siiri tuba · välj Siiris färg och kläder</button>';
    html +=
      '<button class="bigcard school" id="toschool">' +
      '<span class="bcem">📝</span>' +
      '<span class="bctx"><b>Skolans glosor</b>' +
      "<small>" +
      (schoolSet()
        ? esc(schoolSet().name) + " — " + schoolDone() + " av " + schoolSet().words.length + " sitter"
        : childDevice()
          ? "Inga glosor just nu – de vuxna lägger in dem"
          : "Klistra in veckans ord så övar Siiri dem") +
      "</small></span>" +
      '<span class="bcgo">›</span></button>';
    /* när ett barn spelar (eller enheten är låst) hör föräldradelen och admin inte hemma –
       föräldern ser framstegen i föräldraläget på sin egen enhet */
    var kidsHere = childDevice();
    if (!kidsHere)
      html +=
        '<button class="btn ghost wide" id="toparent" style="margin-top:10px">👨‍👩‍👧 Vanemale · För föräldern</button>';
    if (S.admin && !kidsHere)
      html +=
        '<button class="btn wide" id="toadmin" style="margin-top:12px;background:#C8305A;box-shadow:0 5px 0 #8E1338">🛠️ Admin</button>';
    html +=
      '<button class="btn wide" id="edit" style="margin-top:12px">✏️ Ändra namn, figur och färg</button>' +
      '<button class="btn ghost wide" id="toShop2" style="margin-top:8px">🎪 Laat · Marknaden</button>' +
      '<button class="btn ghost wide" id="toTroph" style="margin-top:8px">🏆 Skattkammaren</button>';
    app.innerHTML = html;
    var sn = document.getElementById("sayname");
    if (sn)
      sn.onclick = function () {
        speakTo("tere");
        mood("cheer");
      };
    function on(id, fn) {
      var e = document.getElementById(id);
      if (e) e.onclick = fn;
      return e;
    }
    var sbs = app.querySelectorAll("[data-slot]"),
      si2;
    for (si2 = 0; si2 < sbs.length; si2++) {
      (function (el) {
        el.onclick = function () {
          var idx = parseInt(el.getAttribute("data-slot"), 10);
          if (idx === curSlot()) return;
          /* familjens spelare: barn med PIN-kod väljs via "Vem spelar?" */
          if (cloudOn()) window.SiiriCloud.requestSlot(idx);
          else switchSlot(idx);
        };
      })(sbs[si2]);
    }
    on("bkexp", function () {
      var code = exportCode(),
        msg = document.getElementById("bkmsg");
      var d = document.createElement("div");
      d.className = "overlay";
      d.innerHTML =
        '<div class="oc"><p class="kicker">📋 Din kod</p>' +
        '<p class="qsub">Markera och kopiera. Spara den i ett mejl till dig själv.</p>' +
        '<textarea id="bkarea" readonly style="width:100%;height:110px;font-size:11px;border-radius:14px;border:3px solid var(--line);padding:8px;background:var(--bg);color:var(--ink)"></textarea>' +
        '<button class="btn big wide" id="bkclose" style="margin-top:10px">Klar</button></div>';
      document.body.appendChild(d);
      var ta = d.querySelector("#bkarea");
      ta.value = code;
      try {
        ta.focus();
        ta.select();
        if (navigator.clipboard && navigator.clipboard.writeText)
          navigator.clipboard.writeText(code).then(
            function () {
              msg.textContent = "Koden är kopierad.";
            },
            function () {},
          );
      } catch (e) {}
      d.querySelector("#bkclose").onclick = function () {
        d.remove();
      };
    });
    on("bkimp", function () {
      var d = document.createElement("div");
      d.className = "overlay";
      d.innerHTML =
        '<div class="oc" style="border-color:var(--berry)"><p class="kicker">📥 Återställ</p>' +
        '<p class="qsub">Klistra in koden. Den nuvarande profilen skrivs över.</p>' +
        '<textarea id="imarea" style="width:100%;height:110px;font-size:11px;border-radius:14px;border:3px solid var(--line);padding:8px;background:var(--bg);color:var(--ink)"></textarea>' +
        '<p class="qsub" id="immsg" style="min-height:18px">&nbsp;</p>' +
        '<button class="btn big wide" id="imok">Återställ</button>' +
        '<button class="btn ghost wide" id="imno" style="margin-top:8px">Avbryt</button></div>';
      document.body.appendChild(d);
      d.querySelector("#imno").onclick = function () {
        d.remove();
      };
      d.querySelector("#imok").onclick = function () {
        if (importCode(d.querySelector("#imarea").value)) {
          d.remove();
          location.reload();
        } else {
          d.querySelector("#immsg").textContent = "Koden känns inte igen.";
          sndNo();
        }
      };
    });
    on("peekbtn", function () {
      S.secretsOpen = 1;
      save();
      profileScreen();
      tone(880, 0.08, 0);
      tone(1180, 0.1, 0.08);
    });
    on("secclose", function () {
      S.secretsOpen = 0;
      save();
      profileScreen();
      tone(600, 0.08, 0);
    });
    var admTaps = 0,
      admT = null;
    on("setttl", function () {
      admTaps++;
      clearTimeout(admT);
      admT = setTimeout(function () {
        admTaps = 0;
      }, 3500);
      if (admTaps >= 2) tone(500 + admTaps * 90, 0.05, 0);
      if (admTaps >= 5) {
        admTaps = 0;
        askAdmin();
      }
    });
    if (S.admin) html && null;
    on("psound", function () {
      btnSound.onclick();
      profileScreen();
    });
    on("pamb", function () {
      ambienceToggle();
      profileScreen();
    });
    var pt = document.getElementById("ptheme"),
      ptPress = null,
      ptLong = false,
      ptTaps = 0,
      ptTapT = null;
    if (pt) {
      pt.addEventListener("contextmenu", function (e) {
        e.preventDefault();
      });
      pt.addEventListener(
        "pointerdown",
        function () {
          ptLong = false;
          ptPress = setTimeout(function () {
            ptPress = null;
            ptLong = true;
            ptTaps = 0;
            snowfall();
          }, 900);
        },
        { passive: true },
      );
      function endPt() {
        if (ptPress) {
          clearTimeout(ptPress);
          ptPress = null;
        }
      }
      pt.addEventListener("pointerup", endPt, { passive: true });
      pt.addEventListener("pointerleave", endPt, { passive: true });
      pt.addEventListener("pointercancel", endPt, { passive: true });
      pt.onclick = function () {
        if (ptLong) {
          ptLong = false;
          return;
        }
        ptTaps++;
        clearTimeout(ptTapT);
        ptTapT = setTimeout(function () {
          ptTaps = 0;
        }, 1600);
        if (ptTaps >= 5) {
          ptTaps = 0;
          snowfall();
          return;
        }
        btnTheme.onclick();
        profileScreen();
      };
    }
    on("toroom2", function () {
      go(roomScreen, true);
    });
    on("toparent", function () {
      go(parentScreen, true);
    });
    on("famswitch", function () {
      window.SiiriCloud.choosePlayer();
    });
    on("famlock", function () {
      confirmBox(
        "Lås enheten",
        "Barnen väljer vem som spelar, och föräldraläget behöver vuxen-PIN för att öppnas igen. Dina andra enheter påverkas inte.",
        "🔒 Lås",
        function () {
          window.SiiriCloud.lock().then(
            function () {
              location.reload();
            },
            function () {
              var m = document.getElementById("fammsg");
              if (m)
                m.innerHTML =
                  'Välj först en vuxen-PIN i <a href="/parent">föräldraläget</a> – den behövs för att låsa upp.';
            },
          );
        },
      );
    });
    on("toschool", function () {
      go(schoolImport, true);
    });
    on("toadmin", function () {
      go(adminScreen, true);
    });
    on("edit", function () {
      setupScreen(false);
    });
    on("toTroph", function () {
      go(trophyScreen, true);
    });
    on("toShop2", function () {
      go(shopScreen, true);
    });
  }

  /* ---------- MENINGSBYGGE ---------- */
  var LS = null;
  function sentIntro() {
    screen = "sent";
    prefetch("sent");
    var html =
      '<div class="card" style="text-align:center"><div style="font-size:64px">🧩</div>' +
      '<p class="q">Bygg meningar</p>' +
      '<p class="qsub">Siiri visar en mening på svenska. Lägg de estniska orden i rätt ordning – tryck på ett ord för att höra det.</p>' +
      (S.sentbest ? '<p class="qsub">Ditt bästa: <b>' + S.sentbest + " av 6</b></p>" : "") +
      '<div class="center">' +
      siilSVG("small") +
      "</div>" +
      '<button class="btn green big wide" id="start">Sätt igång 🧩</button></div>';
    app.innerHTML = html;
    document.getElementById("start").onclick = function () {
      sentStart();
    };
  }
  function sentStart() {
    var scored = SENTENCES.map(function (s) {
      var ww = 0,
        i,
        m;
      for (i = 0; i < s.w.length; i++) {
        m = (S.wordmem || {})[s.w[i]];
        ww += m ? Math.max(0.3, m.w) : 1.6;
      }
      return { s: s, w: ww / s.w.length + Math.random() * 0.8 };
    }).sort(function (a, b) {
      return b.w - a.w;
    });
    LS = {
      list: shuffle(
        scored.slice(0, 12).map(function (x) {
          return x.s;
        }),
      ).slice(0, 6),
      i: 0,
      right: 0,
      placed: [],
      done: false,
    };
    sentRound();
  }
  function sentRound() {
    if (!LS) return;
    if (LS.i >= LS.list.length) {
      sentEnd();
      return;
    }
    var s = LS.list[LS.i];
    LS.placed = [];
    LS.done = false;
    var bag = shuffle(s.w.slice()),
      i;
    var html = '<div class="progressdots">';
    for (i = 0; i < LS.list.length; i++) {
      var c = "dot";
      if (i < LS.i) {
        c += LS.resList && LS.resList[i] === false ? " no" : " ok";
      } else if (i === LS.i) {
        c += " now";
      }
      html += '<span class="' + c + '"></span>';
    }
    html +=
      '</div><div class="card"><p class="q">Hur säger man det här?</p>' +
      '<p class="qsub" style="font-size:19px;color:var(--ink);font-weight:600">' +
      esc(s.sv) +
      "</p>" +
      '<div class="slots" id="slots"></div>' +
      '<div class="tiles" id="tiles"></div>' +
      (diff().id === "svar"
        ? ""
        : '<div class="center" style="margin-top:12px"><button class="speakbtn sm" id="hear" aria-label="Hör meningen">🔊</button>' +
          '<button class="speakbtn sm" id="hearslow" aria-label="Hör meningen långsamt">🐢</button></div>') +
      '<div class="feedback" id="fb"></div>' +
      '<button class="btn ghost wide" id="clear" style="margin-top:8px">Börja om med den här</button>' +
      '</div><div class="center">' +
      siilSVG("small") +
      "</div>";
    app.innerHTML = html;
    LS.bag = bag;
    drawTiles();
    var hb = document.getElementById("hear");
    if (hb) {
      hb.onclick = function () {
        speak(s.et);
      };
      document.getElementById("hearslow").onclick = function () {
        speak(s.et, true);
      };
    }
    document.getElementById("clear").onclick = function () {
      LS.placed = [];
      LS.done = false;
      drawTiles();
    };
  }
  function drawTiles() {
    var s = LS.list[LS.i],
      i;
    var sl = document.getElementById("slots"),
      tl = document.getElementById("tiles");
    if (!sl || !tl) return;
    var h1 = "";
    for (i = 0; i < s.w.length; i++) {
      var v = LS.placed[i];
      h1 +=
        '<span class="slot' +
        (v ? " filled" : "") +
        (LS.done ? " right" : "") +
        '" data-slot="' +
        i +
        '">' +
        (v ? esc(v) : "·") +
        "</span>";
    }
    sl.innerHTML = h1;
    var used = {},
      j;
    for (j = 0; j < LS.placed.length; j++) {
      if (LS.placed[j]) used[LS.placed[j]] = (used[LS.placed[j]] || 0) + 1;
    }
    var seen = {},
      h2 = "";
    for (i = 0; i < LS.bag.length; i++) {
      var t = LS.bag[i];
      seen[t] = (seen[t] || 0) + 1;
      var isUsed = (used[t] || 0) >= seen[t];
      h2 += '<button class="tile2' + (isUsed ? " used" : "") + '" data-tile="' + i + '">' + esc(t) + "</button>";
    }
    tl.innerHTML = h2;
    var tb = tl.querySelectorAll("[data-tile]");
    for (i = 0; i < tb.length; i++) {
      (function (el) {
        el.onclick = function () {
          if (LS.done) return;
          var word = LS.bag[parseInt(el.getAttribute("data-tile"), 10)];
          speak(word);
          for (var k = 0; k < LS.list[LS.i].w.length; k++) {
            if (!LS.placed[k]) {
              LS.placed[k] = word;
              break;
            }
          }
          drawTiles();
          checkSentence();
        };
      })(tb[i]);
    }
    var sb = sl.querySelectorAll("[data-slot]");
    for (i = 0; i < sb.length; i++) {
      (function (el) {
        el.onclick = function () {
          if (LS.done) return;
          var k = parseInt(el.getAttribute("data-slot"), 10);
          if (LS.placed[k]) {
            LS.placed[k] = null;
            var comp = [],
              m;
            for (m = 0; m < LS.placed.length; m++) {
              if (LS.placed[m]) comp.push(LS.placed[m]);
            }
            LS.placed = comp;
            drawTiles();
          }
        };
      })(sb[i]);
    }
  }
  function checkSentence() {
    if (LS.done) return;
    var s = LS.list[LS.i];
    if (LS.placed.length < s.w.length) return;
    for (var i = 0; i < s.w.length; i++) {
      if (!LS.placed[i]) return;
    }
    var ok = true;
    for (i = 0; i < s.w.length; i++) {
      if (LS.placed[i] !== s.w[i]) ok = false;
    }
    var fb = document.getElementById("fb");
    if (!LS.resList) LS.resList = [];
    LS.resList[LS.i] = ok;
    LS.done = true;
    wmemHitSentenceWords(s.w, ok);
    if (ok) {
      LS.right++;
      S.correct++;
      earnStars(2);
      bumpQuest("correct", 1);
      bumpQuest("sent", 1);
      tripBump("sent", 1);
      addXp(Math.round(18 * diff().mult));
      sndOk();
      burst(80);
      mood("cheer");
      save();
      fb.className = "feedback ok";
      fb.textContent = "Täpselt! ⭐";
      speak(s.et);
      drawTiles();
      setTimeout(function () {
        if (!LS) return;
        LS.i++;
        sentRound();
      }, 2100);
    } else {
      sndNo();
      mood("oops");
      fb.className = "feedback no";
      fb.textContent = "Rätt ordning: " + s.et;
      var sl = document.getElementById("slots");
      if (sl)
        sl.querySelectorAll(".slot").forEach &&
          sl.querySelectorAll(".slot").forEach(function (e) {
            e.classList.add("wrong");
          });
      speak(s.et);
      setTimeout(function () {
        if (!LS) return;
        LS.i++;
        sentRound();
      }, 2100);
    }
    refreshTop();
  }
  function sentEnd() {
    var right = LS.right,
      n = LS.list.length;
    if (right > (S.sentbest || 0)) S.sentbest = right;
    save();
    var newB = checkBadges();
    burst(right >= n - 1 ? 170 : 110);
    var st = right >= n ? 3 : right >= n * 0.7 ? 2 : right >= n * 0.4 ? 1 : 0;
    var html =
      '<div class="card" style="text-align:center"><div class="bigstars">' +
      starStr(st) +
      "</div>" +
      '<div class="bigscore">' +
      right +
      " / " +
      n +
      "</div>" +
      '<p class="q">' +
      (right >= n ? "Alla meningar rätt!" : "Bra byggt!") +
      "</p>" +
      '<p class="qsub">Varje rätt mening ger 2 stjärnor på marknaden.</p>' +
      '<div class="center">' +
      siilSVG("small") +
      "</div>";
    if (newB.length) {
      html += '<div style="margin-top:8px">';
      for (var i = 0; i < newB.length; i++) {
        html += '<span class="badge">' + newB[i].em + " " + esc(newB[i].sv) + "</span>";
      }
      html += "</div>";
    }
    html +=
      '<div class="row"><button class="btn green big" id="again">En omgång till 🧩</button>' +
      '<button class="btn ghost big" id="home">Tillbaka</button></div></div>';
    app.innerHTML = html;
    LS = null;
    mood("cheer");
    document.getElementById("again").onclick = function () {
      sentIntro();
    };
    document.getElementById("home").onclick = function () {
      go(homeScreen, false);
    };
    refreshTop();
  }

  /* ---------- ÜLLATUSKOTT: dagens överraskning ---------- */
  function bagReady() {
    return S.bagday !== today();
  }
  function openBag() {
    if (!bagReady()) return;
    S.bagday = today();
    save();
    /* vad som ligger i påsen: mest stjärnor, ibland ett plagg, ibland ett hemligt ord */
    var roll = Math.random(),
      gift;
    var affordable = [],
      i;
    for (i = 0; i < SHOP.length; i++) {
      if (!owns(SHOP[i].id) && itemAvailable(SHOP[i]) && SHOP[i].price <= 400) affordable.push(SHOP[i]);
    }
    if (roll < 0.14 && affordable.length) {
      var it = affordable[(Math.random() * affordable.length) | 0];
      if (!S.owned) S.owned = [];
      if (!S.wear) S.wear = {};
      S.owned.push(it.id);
      S.wear[it.slot] = it.id;
      save();
      gift = { em: it.em, big: esc(it.sv), sub: esc(it.et) + " · ett fynd från marknaden!" };
    } else if (roll < 0.4) {
      var pool = allWords(),
        w = pool[(Math.random() * pool.length) | 0];
      speak(w.et);
      gift = { em: w.em, big: esc(w.et), sub: esc(w.sv) + " · dagens ord från Siiri", word: w };
    } else {
      var amount = [15, 20, 25, 30, 40, 50, 60][(Math.random() * 7) | 0];
      if (roll > 0.93) amount = 100;
      S.stars += amount;
      save();
      refreshTop();
      gift = {
        em: "⭐",
        big: "+" + amount + " stjärnor",
        sub: amount >= 100 ? "En riktig skattpåse!" : "Spara dem till marknaden",
      };
    }
    sndLvl();
    burst(190);
    var d = document.createElement("div");
    d.className = "overlay";
    d.innerHTML =
      '<div class="oc"><p class="kicker">🎁 ' +
      esc(UI.bag.et) +
      "</p>" +
      '<div class="bagpop">' +
      gift.em +
      "</div><h3>" +
      gift.big +
      "</h3><p>" +
      gift.sub +
      "</p>" +
      (gift.word ? '<button class="btn ghost" id="bagsay" style="margin-top:8px">🔊 Hör ordet igen</button>' : "") +
      '<button class="btn big wide" id="bagok" style="margin-top:8px">Aitäh, Siiri!</button>' +
      '<p class="qsub" style="margin-top:8px">En ny påse väntar imorgon.</p></div>';
    document.body.appendChild(d);
    if (gift.word)
      d.querySelector("#bagsay").onclick = function () {
        speak(gift.word.et);
      };
    d.querySelector("#bagok").onclick = function () {
      d.remove();
      if (screen === "home") homeScreen();
    };
    mood("cheer");
  }

  /* ---------- öva ortens tre ord ---------- */
  var TP = null;
  function tripPractice(cityId) {
    var city = null,
      i;
    for (i = 0; i < TRIP.length; i++) if (TRIP[i].id === cityId) city = TRIP[i];
    if (!city) return;
    var q = [];
    for (i = 0; i < city.words.length; i++) {
      q.push(city.words[i]);
      q.push(city.words[i]);
    }
    TP = { city: city, q: shuffle(q), i: 0, right: 0, lock: false };
    tpRound();
  }
  function tpRound() {
    if (!TP) return;
    screen = "tp";
    setNav("home");
    btnBack.hidden = false;
    if (TP.i >= TP.q.length) {
      var right = TP.right,
        n = TP.q.length,
        city = TP.city;
      TP = null;
      earnStars(20 + right * 4);
      addXp(30);
      save();
      refreshTop();
      burst(120);
      fanfare(2);
      app.innerHTML =
        '<div class="card" style="text-align:center"><p class="kicker">🎧 ' +
        esc(city.et) +
        "</p>" +
        '<h2 class="q">' +
        (right === n ? "Alla rätt!" : "Bra jobbat!") +
        "</h2>" +
        '<p class="qsub">' +
        right +
        " av " +
        n +
        " rätt · ⭐ +" +
        (20 + right * 4) * starMult() +
        "</p>" +
        '<div class="row"><button class="btn big" id="tpag">En gång till</button>' +
        '<button class="btn green" id="tpmap">Till kartan 🗺️</button></div></div>';
      document.getElementById("tpag").onclick = function () {
        tripPractice(city.id);
      };
      document.getElementById("tpmap").onclick = function () {
        go(tripScreen, true);
      };
      return;
    }
    var w = TP.q[TP.i],
      all = allWords(),
      opts = [w],
      tries = 0,
      j;
    while (opts.length < 4 && tries < 120) {
      var c = all[(Math.random() * all.length) | 0];
      tries++;
      var dup = false;
      for (j = 0; j < opts.length; j++) if (opts[j].sv === c.sv) dup = true;
      if (!dup) opts.push(c);
    }
    opts = shuffle(opts);
    var listen = TP.i % 2 === 1;
    var html =
      '<div class="zone"><span>🎧 <b>' +
      esc(TP.city.et) +
      "</b></span><span>" +
      (TP.i + 1) +
      " / " +
      TP.q.length +
      "</span></div>" +
      '<div class="odots">';
    for (j = 0; j < TP.q.length; j++) html += '<i class="' + (j < TP.i ? "on" : j === TP.i ? "now" : "") + '"></i>';
    html +=
      '</div><div class="card">' +
      (listen
        ? '<p class="q">Lyssna — vad betyder ordet?</p><div class="center"><button class="speakbtn big" id="tpsay" aria-label="Hör ordet">🔊</button></div>'
        : '<p class="q">Vad betyder</p>' +
          promptHtml(w, w.et, "et") +
          '<div class="center"><button class="speakbtn sm" id="tpsay" aria-label="Hör ordet">🔊</button></div>') +
      '<div class="opts">';
    for (j = 0; j < opts.length; j++)
      html += '<button class="opt" data-sv="' + esc(opts[j].sv) + '">' + esc(opts[j].sv) + "</button>";
    html += '</div><div class="feedback" id="tpfb"></div></div>';
    app.innerHTML = html;
    speak(w.et);
    document.getElementById("tpsay").onclick = function () {
      speak(w.et);
    };
    var bs = app.querySelectorAll(".opt"),
      k;
    for (k = 0; k < bs.length; k++) {
      (function (el) {
        el.onclick = function () {
          if (TP.lock) return;
          TP.lock = true;
          var ok = el.getAttribute("data-sv") === w.sv,
            b2 = app.querySelectorAll(".opt"),
            q2;
          for (q2 = 0; q2 < b2.length; q2++) {
            b2[q2].disabled = true;
            if (b2[q2].getAttribute("data-sv") === w.sv) b2[q2].className = "opt right";
          }
          if (!ok) el.className = "opt wrong";
          var fb = document.getElementById("tpfb");
          if (ok) {
            TP.right++;
            sndOk();
            if (fb) fb.innerHTML = '<b style="color:var(--moss)">Õige!</b>';
          } else {
            sndNo();
            if (fb) fb.innerHTML = "<b>" + esc(w.et) + " = " + esc(w.sv) + "</b>";
          }
          wmemHit(w.et, ok, "choose", w.sv);
          tripBump("words", 1, w.et);
          speak(w.et);
          setTimeout(
            function () {
              TP.i++;
              TP.lock = false;
              tpRound();
            },
            ok ? 850 : 1600,
          );
        };
      })(bs[k]);
    }
  }

  /* ============ STATIONER: varje ort har en egen lek ============ */
  var ST = null;
  var STATIONS = {
    tallinn: {
      em: "⚓",
      et: "Sadam",
      sv: "Hamnen",
      verb: "Lasta båten",
      eng: "harbor",
      intro: "Siiri säger vad som ska ombord. Tryck på rätt saker på kajen.",
    },
    lahemaa: {
      em: "🦌",
      et: "Metsarada",
      sv: "Skogsstigen",
      verb: "Hitta paren",
      eng: "pairs",
      pool: "loomad",
      intro: "Djuren gömmer sig i skogen. Para ihop bilden med ordet.",
    },
    rakvere: {
      em: "🐂",
      et: "Lossimäng",
      sv: "Vid borgen",
      verb: "Räkna djuren",
      eng: "count",
      pool: "loomad",
      intro: "Hur många ser du? Lyssna och välj rätt tal.",
    },
    johvi: {
      em: "⛏️",
      et: "Kaevandus",
      sv: "Gruvan",
      verb: "Sortera stenarna",
      eng: "sort",
      intro: "Stenarna ska i rätt låda. Siiri säger vilken färg.",
    },
    narva: {
      em: "🏰",
      et: "Jõgi",
      sv: "Floden",
      verb: "Fånga i strömmen",
      eng: "catch",
      pool: "toit",
      intro: "Saker flyter förbi i floden. Fånga det Siiri säger.",
    },
    peipsi: {
      em: "🧅",
      et: "Sibulatee",
      sv: "Lökvägen",
      verb: "Räkna lökarna",
      eng: "count",
      pool: "puuviljad",
      intro: "Lyssna på talet och välj rätt antal.",
    },
    tartu: {
      em: "📚",
      et: "Raamatukogu",
      sv: "Biblioteket",
      verb: "Sortera böckerna",
      eng: "library",
      intro: "Varje bok ska i rätt hylla. Siiri säger vilken färg hyllan har.",
    },
    polva: {
      em: "🍄",
      et: "Seenemets",
      sv: "Svampskogen",
      verb: "Plocka i korgen",
      eng: "collect",
      pool: "loodus",
      intro: "Siiri säger vad som ska i korgen. Tryck på rätt saker.",
    },
    voru: {
      em: "⛰️",
      et: "Munamägi",
      sv: "Berget",
      verb: "Hitta paren",
      eng: "pairs",
      pool: "loodus",
      intro: "Para ihop bilden med rätt ord på vägen upp.",
    },
    setomaa: {
      em: "🎶",
      et: "Leelo",
      sv: "Sångkretsen",
      verb: "Upprepa ordningen",
      eng: "seq",
      pool: "tere",
      intro: "Siiri sjunger orden i en ordning. Upprepa den.",
    },
    valga: {
      em: "🚂",
      et: "Raudtee",
      sv: "Järnvägen",
      verb: "Lasta tåget",
      eng: "collect",
      pool: "soidukid",
      intro: "Tåget ska lastas. Siiri säger vad som ska med.",
    },
    otepaa: {
      em: "🎿",
      et: "Suusarada",
      sv: "Skidspåret",
      verb: "Upprepa ordningen",
      eng: "seq",
      pool: "riided",
      intro: "Klä på dig i rätt ordning innan du åker.",
    },
    viljandi: {
      em: "🪕",
      et: "Kandlelugu",
      sv: "Kannelmelodin",
      verb: "Spela efter",
      eng: "seq",
      pool: "mang",
      intro: "Siiri spelar en slinga. Tryck på samma ordning.",
    },
    paide: {
      em: "🗼",
      et: "Tornikell",
      sv: "Tornklockan",
      verb: "Räkna slagen",
      eng: "count",
      pool: "aeg",
      intro: "Hör hur många slag klockan gör och välj rätt tal.",
    },
    parnu: {
      em: "🏖️",
      et: "Rand",
      sv: "Stranden",
      verb: "Fånga orden",
      eng: "beach",
      intro: "Orden flyter i land på vågorna. Fånga det Siiri säger.",
    },
    haapsalu: {
      em: "♨️",
      et: "Kuurort",
      sv: "Kurorten",
      verb: "Hitta paren",
      eng: "pairs",
      pool: "keha",
      intro: "Para ihop bilden med ordet i kurortens park.",
    },
    hiiumaa: {
      em: "🗼",
      et: "Tuletorn",
      sv: "Fyren",
      verb: "Fånga i vågorna",
      eng: "catch",
      pool: "loodus",
      intro: "Vågorna bär med sig saker. Fånga rätt sak.",
    },
    muhu: {
      em: "🧶",
      et: "Tikand",
      sv: "Broderiet",
      verb: "Sortera trådarna",
      eng: "sort",
      intro: "Trådarna ska i rätt ask. Siiri säger färgen.",
    },
    kuressaare: {
      em: "🏰",
      et: "Kohvik",
      sv: "Kaféet",
      verb: "Servera gästen",
      eng: "collect",
      pool: "toit",
      intro: "Gästen beställer på estniska. Lägg rätt saker på brickan.",
    },
    salme: {
      em: "🎶",
      et: "Laulupidu",
      sv: "Sångfesten",
      verb: "Sjung hela sången",
      eng: "finale",
      intro: "Alla raderna är samlade. Lägg dem i rätt ordning och sjung!",
    },
  };
  var STTHEMES = ["toit", "puuviljad", "riided", "kodus", "mang", "kool"];
  /* saker som inte går att bära ombord sorteras bort */
  var STSKIP = [
    "järv",
    "jõgi",
    "sild",
    "maja",
    "mets",
    "meri",
    "muru",
    "liiv",
    "taevas",
    "päike",
    "kuu",
    "vihm",
    "lumi",
    "tuul",
    "udu",
    "pilv",
    "torm",
    "äike",
    "jää",
    "tuba",
    "köök",
    "aken",
    "uks",
    "põrand",
    "lagi",
    "sein",
    "kapp",
    "voodi",
    "diivan",
    "laud",
    "tool",
    "riiul",
    "pliit",
    "külmkapp",
    "vaip",
    "peegel",
    "kell",
    "lamp",
  ];
  function stThings(n) {
    var pool = [],
      i,
      j;
    for (i = 0; i < THEMES.length; i++) {
      if (STTHEMES.indexOf(THEMES[i].id) < 0) continue;
      for (j = 0; j < THEMES[i].words.length; j++) {
        var w = THEMES[i].words[j];
        if (w.em && w.et.indexOf(" ") < 0 && STSKIP.indexOf(w.et) < 0) pool.push(w);
      }
    }
    return pickWeighted(pool, Math.min(n, pool.length));
  }
  function stationOf(id) {
    return STATIONS[id] || null;
  }
  function stationStart(id) {
    var s = stationOf(id);
    if (!s) return;
    ST = null;
    if (s.eng === "harbor") stHarbor(true);
    else if (s.eng === "library") stLibrary(true);
    else if (s.eng === "beach") stBeach(true);
    else if (s.eng === "collect") stCollect(id, true);
    else if (s.eng === "catch") stCatch(id, true);
    else if (s.eng === "sort") stSort(id, true);
    else if (s.eng === "count") stCount(id, true);
    else if (s.eng === "pairs") stPairs(id, true);
    else if (s.eng === "seq") stSeq(id, true);
    else if (s.eng === "finale") stFinale(true);
  }
  /* ord ur ett visst tema, med fallback */
  function stPool(themeId, n) {
    var i,
      j,
      pool = [];
    for (i = 0; i < THEMES.length; i++) {
      if (themeId && THEMES[i].id !== themeId) continue;
      for (j = 0; j < THEMES[i].words.length; j++) {
        var w = THEMES[i].words[j];
        if (w.em && w.et.indexOf(" ") < 0 && STSKIP.indexOf(w.et) < 0) pool.push(w);
      }
    }
    if (pool.length < 6) pool = stThings(30);
    return pickWeighted(pool, Math.min(n || 24, pool.length));
  }
  function stHead(id, extra) {
    var s = stationOf(id);
    return (
      '<div class="zone"><span>' +
      s.em +
      " <b>" +
      esc(s.et) +
      "</b></span>" +
      "<span>" +
      esc(extra || "") +
      "</span></div>"
    );
  }
  function stAsk(words, hintSv) {
    var i,
      h2 =
        '<div class="otsiask"><button class="btn small" id="stsay" aria-label="Hör igen">🔊</button>' +
        '<div class="ochips">';
    for (i = 0; i < words.length; i++)
      h2 += '<button class="ochip" data-w="' + esc(words[i]) + '">' + esc(words[i]) + "</button>";
    h2 +=
      '<small id="sthint" hidden>' +
      esc(hintSv) +
      "</small>" +
      '<button class="obtnhelp" id="sthelp">Vad betyder det?</button></div></div>';
    return h2;
  }
  function stWire(words) {
    var sb = document.getElementById("stsay");
    if (sb)
      sb.onclick = function () {
        speakSeq(words);
      };
    var hb = document.getElementById("sthelp");
    if (hb)
      hb.onclick = function () {
        var el = document.getElementById("sthint");
        if (el) el.hidden = false;
        hb.remove();
      };
    var ch = app.querySelectorAll(".ochip"),
      ci;
    for (ci = 0; ci < ch.length; ci++)
      (function (el) {
        el.onclick = function () {
          speak(el.getAttribute("data-w"), true);
        };
      })(ch[ci]);
    speakSeq(words);
  }
  function stDone(gain, title, sub, again, cityId) {
    var st = ST ? Math.max(1, 3 - (ST.wrong || 0)) : 1;
    ST = null;
    earnStars(gain);
    addXp(50);
    S.lessons = (S.lessons || 0) + 1;
    save();
    refreshTop();
    bumpQuest("themes", 1);
    /* bumpa bara aktuell orts uppdrag – annars kan en omspelad gammal ort knuffa fel orts framsteg */
    if (!cityId || cityId === tripCur().id) tripBump("theme", 1);
    burst(170);
    fanfare(st >= 3 ? 3 : 2);
    app.innerHTML =
      '<div class="card" style="text-align:center"><p class="kicker">' +
      esc(title) +
      "</p>" +
      '<div class="bigstars">' +
      "⭐".repeat(st) +
      "</div>" +
      '<p class="qsub">' +
      esc(sub) +
      "<br>⭐ +" +
      gain * starMult() +
      "</p>" +
      '<div class="center">' +
      siilSVG("small") +
      "</div>" +
      '<div class="row"><button class="btn big" id="stag">En gång till</button>' +
      '<button class="btn green" id="stmap">Till kartan 🗺️</button></div></div>';
    document.getElementById("stag").onclick = function () {
      stationStart(cityId);
    };
    document.getElementById("stmap").onclick = function () {
      go(tripScreen, true);
    };
  }

  /* ---------- SALME: finalen på sångfesten ---------- */
  var SONG = [
    { et: "Mu isamaa on minu arm", sv: "Mitt fosterland är min kärlek" },
    { et: "kellele olen andnud", sv: "som jag har gett" },
    { et: "mu kalli isamaa", sv: "mitt kära fosterland" },
    { et: "ja armastan ma teda", sv: "och jag älskar det" },
    { et: "su kõrgte mägede", sv: "dina höga berg" },
    { et: "su metsad laialt", sv: "dina vida skogar" },
    { et: "laulame koos", sv: "vi sjunger tillsammans" },
  ];
  function stFinale(first) {
    screen = "station";
    setNav("home");
    btnBack.hidden = false;
    if (first)
      ST = {
        city: "salme",
        phase: 1,
        order: [],
        wrong: 0,
        stars: 0,
        lock: false,
        pool: shuffle(
          SONG.map(function (l, i) {
            return { i: i, l: l };
          }),
        ),
      };
    if (ST.phase === 2) {
      stSing();
      return;
    }
    var html =
      '<div class="zone"><span>🎶 <b>Laulupidu</b> · Salme</span>' +
      "<span>" +
      ST.order.length +
      " / " +
      SONG.length +
      " rader</span></div>" +
      '<div class="card"><p class="q">Pane laul järjekorda</p>' +
      '<p class="qsub">Du har samlat alla rader på resan. Lägg dem i rätt ordning — ' +
      "tryck på 🔊 för att höra hur raden låter.</p>" +
      '<div class="songbox">';
    var i;
    for (i = 0; i < SONG.length; i++) {
      var placed = ST.order[i];
      html +=
        '<div class="songslot' +
        (placed !== undefined ? " filled" : "") +
        '">' +
        '<span class="num">' +
        (i + 1) +
        "</span>" +
        '<span class="ln">' +
        (placed !== undefined ? esc(SONG[placed].et) : "—") +
        "</span>" +
        (placed !== undefined ? "<small>" + esc(SONG[placed].sv) + "</small>" : "") +
        "</div>";
    }
    html += '</div><div class="songpool">';
    for (i = 0; i < ST.pool.length; i++) {
      html +=
        '<button class="songcard" data-line="' +
        ST.pool[i].i +
        '">' +
        "<b>" +
        esc(ST.pool[i].l.et) +
        "</b><small>" +
        esc(ST.pool[i].l.sv) +
        "</small>" +
        '<span class="sp">🔊</span></button>';
    }
    html += '</div><p class="qsub" id="sttip">Vilken rad kommer först?</p></div>';
    app.innerHTML = html;
    var bs = app.querySelectorAll("[data-line]"),
      k;
    for (k = 0; k < bs.length; k++) {
      (function (el) {
        el.onclick = function () {
          if (ST.lock) return;
          var idx = parseInt(el.getAttribute("data-line"), 10),
            tip = document.getElementById("sttip");
          speak(SONG[idx].et);
          if (idx === ST.order.length) {
            ST.order.push(idx);
            ST.pool = ST.pool.filter(function (p) {
              return p.i !== idx;
            });
            sndOk();
            buzz(14);
            burst(30);
            var g = 14;
            ST.stars += g;
            earnStars(g);
            save();
            refreshTop();
            if (ST.order.length >= SONG.length) {
              ST.phase = 2;
              ST.lock = true;
              setTimeout(stSing, 900);
              return;
            }
            setTimeout(function () {
              stFinale(false);
            }, 450);
          } else {
            ST.wrong++;
            el.classList.add("nope");
            sndNo();
            buzz(26);
            if (tip) tip.textContent = "Inte den — lyssna på raderna och prova igen.";
            setTimeout(function () {
              el.classList.remove("nope");
            }, 450);
          }
        };
      })(bs[k]);
    }
  }
  function stSing() {
    screen = "station";
    setNav("home");
    btnBack.hidden = false;
    var html =
      '<div class="zone"><span>🎶 <b>Laulupidu</b> · Salme</span><span>sjung!</span></div>' +
      '<div class="card" style="text-align:center"><p class="kicker">🎤 Laulame!</p>' +
      '<div class="singstage">' +
      siilSVG() +
      "</div>" +
      '<div class="songbox sing" id="singbox">';
    var i;
    for (i = 0; i < SONG.length; i++)
      html +=
        '<div class="songslot filled" data-ln="' +
        i +
        '"><span class="ln">' +
        esc(SONG[i].et) +
        "</span>" +
        "<small>" +
        esc(SONG[i].sv) +
        "</small></div>";
    html +=
      '</div><button class="btn big green wide" id="singgo">🎶 Sjung hela sången</button>' +
      '<p class="qsub" id="sttip">Hela sångarfältet lyssnar.</p></div>';
    app.innerHTML = html;
    document.getElementById("singgo").onclick = function () {
      var i2 = 0;
      var box = document.getElementById("singbox");
      var step = function () {
        if (i2 > 0 && box.children[i2 - 1]) box.children[i2 - 1].classList.remove("now");
        if (i2 >= SONG.length) {
          stFinaleEnd();
          return;
        }
        if (box.children[i2]) box.children[i2].classList.add("now");
        speak(SONG[i2].et);
        burst(24);
        dance(i2 % 2 === 0);
        i2++;
        setTimeout(step, 1700);
      };
      step();
    };
  }
  function stFinaleEnd() {
    var gain = 400 + (ST ? ST.stars : 0);
    var wrong = ST ? ST.wrong : 0;
    ST = null;
    if (!S.badges) S.badges = [];
    if (S.badges.indexOf("laulupidu") < 0) S.badges.push("laulupidu");
    S.songDone = 1;
    earnStars(gain);
    addXp(500);
    save();
    refreshTop();
    autoBackup("sångfesten");
    burst(420);
    fanfare(3);
    balloons(16);
    applause(18, 2.4);
    setTimeout(function () {
      speak("Hurraa! Hurraa! Hurraa!");
    }, 300);
    setTimeout(function () {
      burst(260);
      balloons(8);
    }, 700);
    setTimeout(function () {
      burst(220);
    }, 1400);
    app.innerHTML =
      '<div class="card" style="text-align:center"><p class="kicker">🎶 Laulupidu</p>' +
      '<h2 class="q">Sången är färdig!</h2>' +
      '<div class="center">' +
      siilSVG("big") +
      "</div>" +
      '<p class="qsub">Du har rest genom hela Estland, samlat alla sju raderna och sjungit dem ' +
      "på sångarfältet tillsammans med hundratusen andra.</p>" +
      '<div class="bigstars">⭐⭐⭐</div>' +
      '<p class="qsub">⭐ +' +
      gain * starMult() +
      " · nytt märke: <b>Laulupidu</b>" +
      (wrong === 0 ? "<br>Och inte ett enda fel på vägen." : "") +
      "</p>" +
      '<div class="row"><button class="btn green big" id="fmap">Till kartan 🗺️</button>' +
      '<button class="btn" id="froom">Till rummet 🏠</button></div></div>';
    document.getElementById("fmap").onclick = function () {
      go(tripScreen, true);
    };
    document.getElementById("froom").onclick = function () {
      go(roomScreen, true);
    };
  }

  /* ---------- SAMLA: lägg rätt saker i korgen/på brickan ---------- */
  function stCollect(id, first) {
    screen = "station";
    setNav("home");
    btnBack.hidden = false;
    var s = stationOf(id);
    if (first) ST = { city: id, round: 0, n: 6, wrong: 0, stars: 0, pool: stPool(s.pool, 30) };
    if (ST.round >= ST.n) {
      stDone(60 + ST.round * 9, s.em + " " + s.et, "Du klarade alla " + ST.n + " beställningarna.", null, id);
      speak("Hästi tehtud!");
      return;
    }
    var num = 1 + ((Math.random() * 3) | 0),
      NUMW = ["üks", "kaks", "kolm"];
    var t = ST.pool[(Math.random() * ST.pool.length) | 0];
    var items = stCrates(t, ST.pool, num, 6),
      i;
    ST.need = num;
    ST.have = 0;
    ST.target = t;
    ST.items = items;
    ST.lock = false;
    var html =
      stHead(id, ST.round + 1 + " / " + ST.n + " · ⭐ " + ST.stars) +
      '<div class="card">' +
      stAsk(["Korja kokku", t.et], "Lägg " + num + " " + t.sv + " i korgen") +
      '<div class="howmany" style="margin:0 0 8px">' +
      "●".repeat(num) +
      " <b>" +
      num +
      "</b></div>" +
      '<div class="basket" id="basket"></div><div class="quay">';
    for (i = 0; i < items.length; i++)
      html += '<button class="crate" data-c="' + i + '">' + wIcon(items[i].w) + "</button>";
    html += '</div><p class="qsub" id="sttip">Tryck på sakerna som ska med.</p></div>';
    app.innerHTML = html;
    stWire(["Korja kokku", t.et]);
    var cs = app.querySelectorAll("[data-c]"),
      k;
    for (k = 0; k < cs.length; k++) {
      (function (el) {
        el.onclick = function () {
          if (ST.lock) return;
          var it = ST.items[parseInt(el.getAttribute("data-c"), 10)],
            tip = document.getElementById("sttip");
          if (it.got) return;
          if (it.w.et === ST.target.et) {
            it.got = true;
            ST.have++;
            el.classList.add("loaded");
            sndOk();
            buzz(14);
            speak(NUMW[Math.min(2, ST.have - 1)]);
            var bk = document.getElementById("basket");
            if (bk) bk.innerHTML += "<span>" + wIcon(it.w) + "</span>";
            var hm = app.querySelector(".howmany");
            if (hm)
              hm.innerHTML =
                "●".repeat(ST.need - ST.have) +
                (ST.need - ST.have ? " <b>" + (ST.need - ST.have) + "</b>" : " <b>✓</b>");
            if (ST.have >= ST.need) {
              ST.lock = true;
              ST.round++;
              var g = 10 + ST.round * 2;
              ST.stars += g;
              earnStars(g);
              wmemHit(ST.target.et, true, "choose", ST.target.sv);
              save();
              refreshTop();
              if (tip) tip.innerHTML = '<b style="color:var(--moss)">Valmis!</b>';
              speak("Valmis!");
              burst(45);
              setTimeout(function () {
                stCollect(id, false);
              }, 1000);
            }
          } else {
            ST.wrong++;
            el.classList.add("nope");
            sndNo();
            buzz(24);
            wmemHit(ST.target.et, false, "choose", ST.target.sv);
            if (tip) tip.innerHTML = "Det där är <b>" + esc(it.w.sv) + "</b>.";
            setTimeout(function () {
              el.classList.remove("nope");
            }, 500);
          }
        };
      })(cs[k]);
    }
  }

  /* ---------- FÅNGA: saker driver förbi ---------- */
  function stCatch(id, first) {
    screen = "station";
    setNav("home");
    btnBack.hidden = false;
    var s = stationOf(id);
    if (first) ST = { city: id, round: 0, n: 8, wrong: 0, stars: 0, pool: stPool(s.pool, 24) };
    if (ST.round >= ST.n) {
      stDone(70 + ST.round * 8, s.em + " " + s.et, "Du fångade alla " + ST.n + " orden.", null, id);
      speak("Hästi tehtud!");
      return;
    }
    var t = ST.pool[(Math.random() * ST.pool.length) | 0];
    var others = ST.pool.filter(function (w) {
      return w.et !== t.et;
    });
    var items = [t],
      i;
    for (i = 0; i < 3; i++) items.push(others[(Math.random() * others.length) | 0]);
    items = shuffle(items);
    ST.items = items;
    ST.target = t;
    ST.lock = false;
    var flow = id === "narva" ? "river" : "sea";
    var html =
      stHead(id, ST.round + 1 + " / " + ST.n + " · ⭐ " + ST.stars) +
      '<div class="card">' +
      stAsk(["Püüa kinni", t.et], "Fånga " + t.sv) +
      '<div class="beach ' +
      flow +
      '">';
    for (i = 0; i < items.length; i++)
      html +=
        '<button class="float" data-f="' +
        i +
        '" style="animation-delay:-' +
        (1.4 + i * 1.5).toFixed(1) +
        "s;top:" +
        (8 + i * 21) +
        '%">' +
        wIcon(items[i]) +
        "</button>";
    html += '</div><p class="qsub" id="sttip">Tryck på rätt sak innan den driver förbi.</p></div>';
    app.innerHTML = html;
    stWire(["Püüa kinni", t.et]);
    var fs2 = app.querySelectorAll("[data-f]"),
      k;
    for (k = 0; k < fs2.length; k++) {
      (function (el) {
        el.onclick = function () {
          if (ST.lock) return;
          var w = ST.items[parseInt(el.getAttribute("data-f"), 10)],
            tip = document.getElementById("sttip");
          if (w.et === ST.target.et) {
            ST.lock = true;
            ST.round++;
            var g = 10 + ST.round * 2;
            ST.stars += g;
            earnStars(g);
            wmemHit(w.et, true, "choose", w.sv);
            save();
            refreshTop();
            el.classList.add("caught");
            sndOk();
            buzz(14);
            speak(w.et);
            burst(35);
            if (tip) tip.innerHTML = '<b style="color:var(--moss)">Püütud! ' + esc(w.sv) + "</b>";
            tripBump("hear", 1);
            setTimeout(function () {
              stCatch(id, false);
            }, 950);
          } else {
            ST.wrong++;
            el.classList.add("nope");
            sndNo();
            buzz(24);
            wmemHit(ST.target.et, false, "choose", ST.target.sv);
            if (tip) tip.innerHTML = "Det där är <b>" + esc(w.sv) + "</b>.";
            setTimeout(function () {
              el.classList.remove("nope");
            }, 500);
          }
        };
      })(fs2[k]);
    }
  }

  /* ---------- SORTERA: fyra lådor med färg ---------- */
  function stSort(id, first) {
    screen = "station";
    setNav("home");
    btnBack.hidden = false;
    var s = stationOf(id);
    var BINS = [
      { id: "punane", sv: "röd", c: "#D6453F" },
      { id: "sinine", sv: "blå", c: "#3A72C8" },
      { id: "kollane", sv: "gul", c: "#E8B62C" },
      { id: "roheline", sv: "grön", c: "#4E9A5C" },
    ];
    if (first) ST = { city: id, round: 0, n: 8, wrong: 0, stars: 0, bins: BINS, done: [0, 0, 0, 0] };
    if (ST.round >= ST.n) {
      stDone(70 + ST.round * 8, s.em + " " + s.et, "Allt är sorterat — " + ST.n + " rätt.", null, id);
      speak("Hästi tehtud!");
      return;
    }
    var want = ST.bins[(Math.random() * ST.bins.length) | 0];
    ST.want = want;
    ST.lock = false;
    var piece = id === "muhu" ? '<span class="thread" id="pcs"></span>' : '<span class="stone" id="pcs"></span>';
    var html =
      stHead(id, ST.round + 1 + " / " + ST.n + " · ⭐ " + ST.stars) +
      '<div class="card">' +
      stAsk(["Pane kotti", ST.want.id], "Lägg i den " + ST.want.sv + "a asken") +
      '<div class="bookhand">' +
      piece +
      '</div><div class="shelves">';
    var i;
    for (i = 0; i < ST.bins.length; i++)
      html +=
        '<button class="shelfslot" data-s="' +
        ST.bins[i].id +
        '"><span class="shelfbar" style="background:' +
        ST.bins[i].c +
        '"></span>' +
        '<span class="shelfbooks">' +
        "●".repeat(Math.min(6, ST.done[i])) +
        "</span></button>";
    html += '</div><p class="qsub" id="sttip">Tryck på rätt ask.</p></div>';
    app.innerHTML = html;
    stWire(["Pane kotti", want.id]);
    var ss = app.querySelectorAll("[data-s]"),
      k;
    for (k = 0; k < ss.length; k++) {
      (function (el) {
        el.onclick = function () {
          if (ST.lock) return;
          var bid = el.getAttribute("data-s"),
            tip = document.getElementById("sttip"),
            i2;
          if (bid === ST.want.id) {
            ST.lock = true;
            for (i2 = 0; i2 < ST.bins.length; i2++) if (ST.bins[i2].id === bid) ST.done[i2]++;
            ST.round++;
            var g = 9 + ST.round * 2;
            ST.stars += g;
            earnStars(g);
            wmemHit(ST.want.id, true, "choose", ST.want.sv);
            save();
            refreshTop();
            var pc = document.getElementById("pcs");
            if (pc) pc.style.background = ST.want.c;
            el.classList.add("hit");
            sndOk();
            buzz(14);
            speak(ST.want.id);
            if (tip) tip.innerHTML = '<b style="color:var(--moss)">Õige!</b>';
            setTimeout(function () {
              stSort(id, false);
            }, 850);
          } else {
            ST.wrong++;
            el.classList.add("nope");
            sndNo();
            buzz(24);
            wmemHit(ST.want.id, false, "choose", ST.want.sv);
            var f = null;
            for (i2 = 0; i2 < ST.bins.length; i2++) if (ST.bins[i2].id === bid) f = ST.bins[i2];
            if (tip) tip.innerHTML = "Den asken är <b>" + esc(f ? f.sv : "") + "</b>.";
            setTimeout(function () {
              el.classList.remove("nope");
            }, 500);
          }
        };
      })(ss[k]);
    }
  }

  /* ---------- RÄKNA: hur många ser du ---------- */
  var NUMWORDS = ["üks", "kaks", "kolm", "neli", "viis", "kuus", "seitse", "kaheksa"];
  function stCount(id, first) {
    screen = "station";
    setNav("home");
    btnBack.hidden = false;
    var s = stationOf(id);
    if (first) ST = { city: id, round: 0, n: 7, wrong: 0, stars: 0, pool: stPool(s.pool, 20) };
    if (ST.round >= ST.n) {
      stDone(
        60 + ST.round * 9,
        s.em + " " + s.et,
        "Du räknade rätt " + (ST.n - ST.wrong) + " av " + ST.n + ".",
        null,
        id,
      );
      speak("Hästi tehtud!");
      return;
    }
    var maxN = Math.min(8, 3 + Math.floor(ST.round / 2) + 2);
    var num = 1 + ((Math.random() * maxN) | 0);
    var t = ST.pool[(Math.random() * ST.pool.length) | 0];
    var opts = [num],
      i,
      tries = 0;
    while (opts.length < 4 && tries < 40) {
      var c = 1 + ((Math.random() * maxN) | 0);
      tries++;
      if (opts.indexOf(c) < 0) opts.push(c);
    }
    opts = shuffle(opts);
    ST.num = num;
    ST.lock = false;
    var html =
      stHead(id, ST.round + 1 + " / " + ST.n + " · ⭐ " + ST.stars) +
      '<div class="card">' +
      stAsk(["Mitu on?", t.et], "Hur många " + t.sv + " ser du?") +
      '<div class="countbox">';
    for (i = 0; i < num; i++) html += '<span class="citem">' + wIcon(t) + "</span>";
    html += '</div><div class="opts numopts">';
    for (i = 0; i < opts.length; i++)
      html += '<button class="opt" data-n="' + opts[i] + '">' + esc(NUMWORDS[opts[i] - 1]) + "</button>";
    html += '</div><p class="qsub" id="sttip">Välj rätt tal på estniska.</p></div>';
    app.innerHTML = html;
    stWire(["Mitu on?", t.et]);
    var bs = app.querySelectorAll("[data-n]"),
      k;
    for (k = 0; k < bs.length; k++) {
      (function (el) {
        el.onclick = function () {
          if (ST.lock) return;
          var v = parseInt(el.getAttribute("data-n"), 10),
            tip = document.getElementById("sttip");
          var all = app.querySelectorAll("[data-n]"),
            q;
          if (v === ST.num) {
            ST.lock = true;
            for (q = 0; q < all.length; q++) {
              all[q].disabled = true;
              if (+all[q].getAttribute("data-n") === ST.num) all[q].className = "opt right";
            }
            ST.round++;
            var g = 10 + ST.round * 2;
            ST.stars += g;
            earnStars(g);
            wmemHitSentenceWords([NUMWORDS[ST.num - 1]], true);
            save();
            refreshTop();
            sndOk();
            buzz(14);
            speak(NUMWORDS[ST.num - 1]);
            if (tip)
              tip.innerHTML =
                '<b style="color:var(--moss)">Õige! ' + ST.num + " = " + esc(NUMWORDS[ST.num - 1]) + "</b>";
            setTimeout(function () {
              stCount(id, false);
            }, 1000);
          } else {
            ST.wrong++;
            el.className = "opt wrong";
            sndNo();
            buzz(24);
            wmemHitSentenceWords([NUMWORDS[ST.num - 1]], false);
            if (tip) tip.innerHTML = "Räkna en gång till — tryck på sakerna medan du räknar.";
          }
        };
      })(bs[k]);
    }
  }

  /* ---------- PARA IHOP: bild mot ord ---------- */
  function stPairs(id, first) {
    screen = "station";
    setNav("home");
    btnBack.hidden = false;
    var s = stationOf(id);
    if (first) ST = { city: id, round: 0, n: 3, wrong: 0, stars: 0, pool: stPool(s.pool, 24) };
    if (ST.round >= ST.n) {
      stDone(70 + ST.round * 12, s.em + " " + s.et, "Alla par hittade.", null, id);
      speak("Hästi tehtud!");
      return;
    }
    var set = otsiPick(4, ST.pool);
    ST.set = set;
    ST.picked = null;
    ST.left = 4;
    ST.lock = false;
    var words = shuffle(set.slice());
    var html =
      stHead(id, ST.round + 1 + " / " + ST.n + " · ⭐ " + ST.stars) +
      '<div class="card">' +
      '<p class="q">Leia paar · Para ihop bild och ord</p><div class="pairgrid">';
    var i;
    for (i = 0; i < set.length; i++)
      html += '<button class="pcard pic" data-pic="' + esc(set[i].et) + '">' + wIcon(set[i]) + "</button>";
    html += '</div><div class="pairgrid words">';
    for (i = 0; i < words.length; i++)
      html += '<button class="pcard wrd" data-wrd="' + esc(words[i].et) + '">' + esc(words[i].et) + "</button>";
    html += '</div><p class="qsub" id="sttip">Tryck på en bild och sedan på ordet.</p></div>';
    app.innerHTML = html;
    var bs = app.querySelectorAll("[data-pic],[data-wrd]"),
      k;
    for (k = 0; k < bs.length; k++) {
      (function (el) {
        el.onclick = function () {
          if (ST.lock || el.classList.contains("done")) return;
          var tip = document.getElementById("sttip");
          var isPic = el.hasAttribute("data-pic");
          var key = isPic ? el.getAttribute("data-pic") : el.getAttribute("data-wrd");
          if (isPic) {
            speak(key);
          }
          if (!ST.picked) {
            ST.picked = { el: el, key: key, isPic: isPic };
            el.classList.add("sel");
            return;
          }
          if (ST.picked.el === el) {
            el.classList.remove("sel");
            ST.picked = null;
            return;
          }
          if (ST.picked.isPic === isPic) {
            ST.picked.el.classList.remove("sel");
            ST.picked = { el: el, key: key, isPic: isPic };
            el.classList.add("sel");
            return;
          }
          if (ST.picked.key === key) {
            el.classList.add("done");
            ST.picked.el.classList.add("done");
            ST.picked.el.classList.remove("sel");
            ST.picked = null;
            ST.left--;
            sndOk();
            buzz(12);
            speak(key);
            for (var pw = 0; pw < ST.set.length; pw++) {
              if (ST.set[pw].et === key) {
                wmemHit(ST.set[pw].et, true, "choose", ST.set[pw].sv);
                break;
              }
            }
            if (tip) tip.innerHTML = '<b style="color:var(--moss)">Õige!</b>';
            if (ST.left <= 0) {
              ST.lock = true;
              ST.round++;
              var g = 16 + ST.round * 4;
              ST.stars += g;
              earnStars(g);
              save();
              refreshTop();
              burst(60);
              setTimeout(function () {
                stPairs(id, false);
              }, 900);
            }
          } else {
            ST.wrong++;
            el.classList.add("nope");
            ST.picked.el.classList.remove("sel");
            var bad = el,
              old = ST.picked.el;
            ST.picked = null;
            sndNo();
            buzz(22);
            if (tip) tip.textContent = "Inte det paret. Prova igen.";
            setTimeout(function () {
              bad.classList.remove("nope");
              old.classList.remove("nope");
            }, 450);
          }
        };
      })(bs[k]);
    }
  }

  /* ---------- ORDNING: upprepa det Siiri säger ---------- */
  function stSeq(id, first) {
    screen = "station";
    setNav("home");
    btnBack.hidden = false;
    var s = stationOf(id);
    if (first) ST = { city: id, round: 0, n: 5, wrong: 0, stars: 0, pool: stPool(s.pool, 16) };
    if (ST.round >= ST.n) {
      stDone(70 + ST.round * 10, s.em + " " + s.et, "Du klarade alla " + ST.n + " slingorna.", null, id);
      speak("Hästi tehtud!");
      return;
    }
    var len = Math.min(5, 2 + Math.floor(ST.round / 1.5));
    var choices = otsiPick(Math.min(5, ST.pool.length), ST.pool);
    var seq = [],
      i;
    for (i = 0; i < len; i++) seq.push(choices[(Math.random() * choices.length) | 0]);
    ST.seq = seq;
    ST.step = 0;
    ST.choices = choices;
    ST.lock = true;
    var html =
      stHead(id, ST.round + 1 + " / " + ST.n + " · ⭐ " + ST.stars) +
      '<div class="card">' +
      '<p class="q">Korda järge · Upprepa ordningen</p>' +
      '<div class="seqdots" id="seqdots">';
    for (i = 0; i < len; i++) html += "<i></i>";
    html += '</div><div class="pairgrid">';
    for (i = 0; i < choices.length; i++)
      html += '<button class="pcard pic" data-seq="' + esc(choices[i].et) + '">' + wIcon(choices[i]) + "</button>";
    html +=
      '</div><p class="qsub" id="sttip">Lyssna först …</p>' +
      '<button class="btn wide" id="seqagain">🔊 Hör slingan igen</button></div>';
    app.innerHTML = html;
    var playSeq = function () {
      ST.lock = true;
      var tip = document.getElementById("sttip");
      if (tip) tip.textContent = "Lyssna …";
      speakSeq(
        seq.map(function (w) {
          return w.et;
        }),
      );
      setTimeout(
        function () {
          ST.lock = false;
          ST.step = 0;
          var t2 = document.getElementById("sttip");
          if (t2) t2.textContent = "Nu du — tryck i samma ordning.";
        },
        700 + seq.length * 900,
      );
    };
    playSeq();
    document.getElementById("seqagain").onclick = playSeq;
    var bs = app.querySelectorAll("[data-seq]"),
      k;
    for (k = 0; k < bs.length; k++) {
      (function (el) {
        el.onclick = function () {
          if (ST.lock) return;
          var et = el.getAttribute("data-seq"),
            tip = document.getElementById("sttip");
          var dots = document.getElementById("seqdots");
          if (et === ST.seq[ST.step].et) {
            if (dots && dots.children[ST.step]) dots.children[ST.step].className = "on";
            wmemHit(ST.seq[ST.step].et, true, "choose", ST.seq[ST.step].sv);
            ST.step++;
            sndOk();
            buzz(10);
            speak(et);
            if (ST.step >= ST.seq.length) {
              ST.lock = true;
              ST.round++;
              var g = 14 + ST.round * 3;
              ST.stars += g;
              earnStars(g);
              save();
              refreshTop();
              burst(50);
              if (tip) tip.innerHTML = '<b style="color:var(--moss)">Õige järjekord!</b>';
              setTimeout(function () {
                stSeq(id, false);
              }, 950);
            }
          } else {
            ST.wrong++;
            wmemHit(ST.seq[ST.step].et, false, "choose", ST.seq[ST.step].sv);
            ST.step = 0;
            el.classList.add("nope");
            sndNo();
            buzz(26);
            if (dots) for (var q = 0; q < dots.children.length; q++) dots.children[q].className = "";
            if (tip) tip.textContent = "Oj — börja om från början på slingan.";
            setTimeout(function () {
              el.classList.remove("nope");
            }, 450);
          }
        };
      })(bs[k]);
    }
  }

  /* bygger lådorna så att ANTALET inte avslöjar svaret:
       även lurendrejarna kommer i flera exemplar, minst en lika många som målet */
  function stCrates(target, pool, need, total) {
    var items = [],
      i,
      c;
    for (i = 0; i < need; i++) items.push({ w: target, got: false });
    var others = pool.filter(function (w) {
      return w.et !== target.et;
    });
    others = shuffle(others);
    var rest = total - need,
      k = 0;
    var first = true;
    while (rest > 0 && k < others.length) {
      if (first && rest >= need) {
        c = need;
        first = false;
      } /* en lurendrejare lika många */
      else c = 1 + ((Math.random() * Math.min(rest, 3)) | 0);
      if (c > rest) c = rest;
      for (i = 0; i < c; i++) items.push({ w: others[k], got: false });
      rest -= c;
      k++;
    }
    while (rest > 0 && others.length) {
      items.push({ w: others[(Math.random() * others.length) | 0], got: false });
      rest--;
    }
    return shuffle(items);
  }

  /* ---------- TALLINN: lasta båten ---------- */
  function stHarbor(first) {
    screen = "station";
    setNav("home");
    btnBack.hidden = false;
    if (first) {
      ST = { city: "tallinn", round: 0, n: 6, wrong: 0, stars: 0, pool: stThings(40), loaded: [] };
    }
    if (ST.round >= ST.n) {
      stDone(60 + ST.round * 10, "⚓ Laev on täis!", "Du lastade båten med " + ST.n + " saker.", null, "tallinn");
      speak("Laev on täis!");
      return;
    }
    /* en last: ett antal av en sak */
    var num = 1 + ((Math.random() * 3) | 0);
    var NUMW = ["üks", "kaks", "kolm"]; /* räknas högt när varje sak läggs i */
    var target = ST.pool[(Math.random() * ST.pool.length) | 0];
    var crate = stCrates(target, ST.pool, num, 6),
      i;
    ST.need = num;
    ST.have = 0;
    ST.target = target;
    ST.crate = crate;
    ST.lock = false;
    var html =
      '<div class="zone"><span>⚓ <b>Sadam</b> · Tallinn</span><span>' +
      (ST.round + 1) +
      " / " +
      ST.n +
      " · ⭐ " +
      ST.stars +
      "</span></div>" +
      '<div class="card"><div class="otsiask">' +
      '<button class="btn small" id="stsay" aria-label="Hör igen">🔊</button>' +
      '<div class="ochips"><button class="ochip" data-w="Pane paati">Pane paati</button>' +
      '<button class="ochip" data-w="' +
      esc(target.et) +
      '">' +
      esc(target.et) +
      "</button>" +
      '<span class="howmany">' +
      "●".repeat(num) +
      " <b>" +
      num +
      "</b></span>" +
      '<small id="sthint" hidden>Lägg ' +
      num +
      " " +
      esc(target.sv) +
      " i båten</small>" +
      '<button class="obtnhelp" id="sthelp">Vad betyder det?</button></div></div>' +
      '<div class="harbor">' +
      '<div class="boat"><div class="boathull"></div><div class="boatload" id="boatload"></div></div>' +
      '<div class="quay">';
    for (i = 0; i < crate.length; i++) {
      html += '<button class="crate" data-c="' + i + '"><span>' + wIcon(crate[i].w) + "</span></button>";
    }
    html += '</div></div><p class="qsub" id="sttip">Tryck på sakerna som ska ombord.</p></div>';
    app.innerHTML = html;
    speakSeq(["Pane paati", target.et]);
    document.getElementById("stsay").onclick = function () {
      speakSeq(["Pane paati", target.et]);
    };
    document.getElementById("sthelp").onclick = function () {
      var el = document.getElementById("sthint");
      if (el) el.hidden = false;
      var b = document.getElementById("sthelp");
      if (b) b.remove();
    };
    var ch = app.querySelectorAll(".ochip"),
      ci;
    for (ci = 0; ci < ch.length; ci++)
      (function (el) {
        el.onclick = function () {
          speak(el.getAttribute("data-w"), true);
        };
      })(ch[ci]);
    var cs = app.querySelectorAll("[data-c]"),
      k;
    for (k = 0; k < cs.length; k++) {
      (function (el) {
        el.onclick = function () {
          if (ST.lock) return;
          var idx = parseInt(el.getAttribute("data-c"), 10),
            c = ST.crate[idx];
          if (c.got) return;
          var tip = document.getElementById("sttip");
          if (c.w.et === ST.target.et) {
            c.got = true;
            ST.have++;
            el.classList.add("loaded");
            sndOk();
            buzz(14);
            var numSaid = NUMW[Math.min(2, ST.have - 1)]; /* üks … kaks … kolm */
            if (ST.have < ST.need) speak(numSaid); /* sista räknas ihop med berömmet nedan */
            var hm = app.querySelector(".howmany");
            if (hm)
              hm.innerHTML =
                "●".repeat(ST.need - ST.have) +
                (ST.need - ST.have ? " <b>" + (ST.need - ST.have) + "</b>" : " <b>✓</b>");
            var bl = document.getElementById("boatload");
            if (bl) bl.innerHTML += "<span>" + wIcon(c.w) + "</span>";
            if (ST.have >= ST.need) {
              ST.lock = true;
              ST.round++;
              var g = 10 + ST.round * 2;
              ST.stars += g;
              earnStars(g);
              wmemHit(ST.target.et, true, "choose", ST.target.sv);
              save();
              refreshTop();
              if (tip) tip.innerHTML = '<b style="color:var(--moss)">Tubli! Båten rullar vidare.</b>';
              speakSeq([numSaid, "Tubli!"]);
              burst(50);
              setTimeout(function () {
                stHarbor(false);
              }, 1800);
            } else if (tip) tip.textContent = "Bra! " + (ST.need - ST.have) + " till.";
          } else {
            ST.wrong++;
            el.classList.add("nope");
            sndNo();
            buzz(26);
            wmemHit(ST.target.et, false, "choose", ST.target.sv);
            if (tip)
              tip.innerHTML = "Det där är <b>" + esc(c.w.sv) + "</b>. Siiri bad om <b>" + esc(ST.target.sv) + "</b>.";
            setTimeout(function () {
              el.classList.remove("nope");
            }, 500);
          }
        };
      })(cs[k]);
    }
  }

  /* ---------- TARTU: sortera böckerna ---------- */
  function stLibrary(first) {
    screen = "station";
    setNav("home");
    btnBack.hidden = false;
    var SHELF = [
      { id: "punane", sv: "röd", c: "#D6453F" },
      { id: "sinine", sv: "blå", c: "#3A72C8" },
      { id: "kollane", sv: "gul", c: "#E8B62C" },
      { id: "roheline", sv: "grön", c: "#4E9A5C" },
    ];
    if (first) ST = { city: "tartu", round: 0, n: 8, wrong: 0, stars: 0, shelf: SHELF, done: [0, 0, 0, 0] };
    if (ST.round >= ST.n) {
      stDone(
        70 + ST.round * 8,
        "📚 Kõik raamatud on riiulis!",
        "Du sorterade " + ST.n + " böcker rätt.",
        null,
        "tartu",
      );
      speak("Kõik raamatud on riiulis!");
      return;
    }
    var want = ST.shelf[(Math.random() * ST.shelf.length) | 0];
    ST.want = want;
    ST.lock = false;
    var html =
      '<div class="zone"><span>📚 <b>Raamatukogu</b> · Tartu</span><span>' +
      (ST.round + 1) +
      " / " +
      ST.n +
      " · ⭐ " +
      ST.stars +
      "</span></div>" +
      '<div class="card"><div class="otsiask">' +
      '<button class="btn small" id="stsay" aria-label="Hör igen">🔊</button>' +
      '<div class="ochips"><button class="ochip" data-w="Pane riiulisse">Pane riiulisse</button>' +
      '<button class="ochip" data-w="' +
      esc(want.id) +
      '">' +
      esc(want.id) +
      "</button>" +
      '<small id="sthint" hidden>Ställ boken i den ' +
      esc(want.sv) +
      "a hyllan</small>" +
      '<button class="obtnhelp" id="sthelp">Vad betyder det?</button></div></div>' +
      '<div class="bookhand"><span class="bk plain" id="bkhand"></span></div>' +
      '<div class="shelves">';
    var i;
    for (i = 0; i < ST.shelf.length; i++) {
      html +=
        '<button class="shelfslot" data-s="' +
        ST.shelf[i].id +
        '">' +
        '<span class="shelfbar" style="background:' +
        ST.shelf[i].c +
        '"></span>' +
        '<span class="shelfbooks">' +
        "📕".repeat(Math.min(5, ST.done[i])) +
        "</span></button>";
    }
    html += '</div><p class="qsub" id="sttip">Tryck på rätt hylla.</p></div>';
    app.innerHTML = html;
    speakSeq(["Pane riiulisse", want.id]);
    document.getElementById("stsay").onclick = function () {
      speakSeq(["Pane riiulisse", want.id]);
    };
    document.getElementById("sthelp").onclick = function () {
      var el = document.getElementById("sthint");
      if (el) el.hidden = false;
      var b = document.getElementById("sthelp");
      if (b) b.remove();
    };
    var ch = app.querySelectorAll(".ochip"),
      ci;
    for (ci = 0; ci < ch.length; ci++)
      (function (el) {
        el.onclick = function () {
          speak(el.getAttribute("data-w"), true);
        };
      })(ch[ci]);
    var ss = app.querySelectorAll("[data-s]"),
      k;
    for (k = 0; k < ss.length; k++) {
      (function (el) {
        el.onclick = function () {
          if (ST.lock) return;
          var id = el.getAttribute("data-s"),
            tip = document.getElementById("sttip"),
            i2;
          if (id === ST.want.id) {
            ST.lock = true;
            for (i2 = 0; i2 < ST.shelf.length; i2++) if (ST.shelf[i2].id === id) ST.done[i2]++;
            ST.round++;
            var g = 9 + ST.round * 2;
            ST.stars += g;
            earnStars(g);
            wmemHit(ST.want.id, true, "choose", ST.want.sv);
            save();
            refreshTop();
            var bkh = document.getElementById("bkhand");
            if (bkh) {
              bkh.classList.remove("plain");
              bkh.style.background = ST.want.c;
            }
            el.classList.add("hit");
            sndOk();
            buzz(14);
            speak(ST.want.id);
            if (tip) tip.innerHTML = '<b style="color:var(--moss)">Õige!</b>';
            setTimeout(function () {
              stLibrary(false);
            }, 900);
          } else {
            ST.wrong++;
            el.classList.add("nope");
            sndNo();
            buzz(26);
            wmemHit(ST.want.id, false, "choose", ST.want.sv);
            var f = null;
            for (i2 = 0; i2 < ST.shelf.length; i2++) if (ST.shelf[i2].id === id) f = ST.shelf[i2];
            if (tip)
              tip.innerHTML =
                "Den hyllan är <b>" + esc(f ? f.sv : "") + "</b>. Siiri sa <b>" + esc(ST.want.id) + "</b>.";
            setTimeout(function () {
              el.classList.remove("nope");
            }, 500);
          }
        };
      })(ss[k]);
    }
  }

  /* ---------- PÄRNU: fånga orden på vågorna ---------- */
  function stBeach(first) {
    screen = "station";
    setNav("home");
    btnBack.hidden = false;
    if (first) {
      ST = { city: "parnu", round: 0, n: 8, wrong: 0, stars: 0, pool: stThings(30) };
    }
    if (ST.round >= ST.n) {
      stDone(70 + ST.round * 8, "🏖️ Tubli püüdja!", "Du fångade " + ST.n + " ord på stranden.", null, "parnu");
      speak("Tubli!");
      return;
    }
    var target = ST.pool[(Math.random() * ST.pool.length) | 0];
    var others = ST.pool.filter(function (w) {
      return w.et !== target.et;
    });
    var items = [target],
      i;
    for (i = 0; i < 3; i++) items.push(others[(Math.random() * others.length) | 0]);
    items = shuffle(items);
    ST.target = target;
    ST.lock = false;
    var html =
      '<div class="zone"><span>🏖️ <b>Rand</b> · Pärnu</span><span>' +
      (ST.round + 1) +
      " / " +
      ST.n +
      " · ⭐ " +
      ST.stars +
      "</span></div>" +
      '<div class="card"><div class="otsiask">' +
      '<button class="btn small" id="stsay" aria-label="Hör igen">🔊</button>' +
      '<div class="ochips"><button class="ochip" data-w="Püüa kinni">Püüa kinni</button>' +
      '<button class="ochip" data-w="' +
      esc(target.et) +
      '">' +
      esc(target.et) +
      "</button>" +
      '<small id="sthint" hidden>Fånga ' +
      esc(target.sv) +
      "</small>" +
      '<button class="obtnhelp" id="sthelp">Vad betyder det?</button></div></div>' +
      '<div class="beach">';
    for (i = 0; i < items.length; i++) {
      html +=
        '<button class="float" data-f="' +
        i +
        '" style="animation-delay:-' +
        (1.4 + i * 1.5).toFixed(1) +
        "s;top:" +
        (8 + i * 21) +
        '%">' +
        "<span>" +
        items[i].em +
        "</span></button>";
    }
    html += '</div><p class="qsub" id="sttip">Tryck på rätt sak innan den flyter förbi.</p></div>';
    app.innerHTML = html;
    ST.items = items;
    speakSeq(["Püüa kinni", target.et]);
    document.getElementById("stsay").onclick = function () {
      speakSeq(["Püüa kinni", target.et]);
    };
    document.getElementById("sthelp").onclick = function () {
      var el = document.getElementById("sthint");
      if (el) el.hidden = false;
      var b = document.getElementById("sthelp");
      if (b) b.remove();
    };
    var ch = app.querySelectorAll(".ochip"),
      ci;
    for (ci = 0; ci < ch.length; ci++)
      (function (el) {
        el.onclick = function () {
          speak(el.getAttribute("data-w"), true);
        };
      })(ch[ci]);
    var fs = app.querySelectorAll("[data-f]"),
      k;
    for (k = 0; k < fs.length; k++) {
      (function (el) {
        el.onclick = function () {
          if (ST.lock) return;
          var w = ST.items[parseInt(el.getAttribute("data-f"), 10)],
            tip = document.getElementById("sttip");
          if (w.et === ST.target.et) {
            ST.lock = true;
            ST.round++;
            var g = 10 + ST.round * 2;
            ST.stars += g;
            earnStars(g);
            wmemHit(w.et, true, "choose", w.sv);
            save();
            refreshTop();
            el.classList.add("caught");
            sndOk();
            buzz(14);
            speak(w.et);
            burst(40);
            if (tip) tip.innerHTML = '<b style="color:var(--moss)">Püütud! ' + esc(w.sv) + "</b>";
            tripBump("hear", 1);
            setTimeout(function () {
              stBeach(false);
            }, 1000);
          } else {
            ST.wrong++;
            el.classList.add("nope");
            sndNo();
            buzz(26);
            wmemHit(ST.target.et, false, "choose", ST.target.sv);
            if (tip) tip.innerHTML = "Det där är <b>" + esc(w.sv) + "</b>.";
            setTimeout(function () {
              el.classList.remove("nope");
            }, 500);
          }
        };
      })(fs[k]);
    }
  }

  /* ---------- RESAN GENOM ESTLAND ---------- */
  var EST_LAND = [
    "M274.4 196.7 L273.2 197 L266.7 195.8 L259.6 192.2 L256.5 189.4 L253.4 189.6 L249.6 191.3 L236.3 196.4 L233 195.3 L225.3 190.2 L221.4 184.7 L212.9 173.7 L212.2 171.1 L211 169.1 L201.8 166.3 L198.4 162.2 L195.6 161.6 L191.6 159.6 L180.7 151.1 L178 150.1 L177.3 151.7 L177.7 153.7 L177 154.9 L175.5 154.8 L173.1 151.7 L170.1 148.9 L160.7 154.2 L157.4 155.6 L154.5 155.9 L139.8 162.7 L135.2 166.4 L133.4 166.1 L133.7 162.6 L139.9 145 L141.1 131.2 L143.3 129.2 L144 127.3 L143 122.8 L136.6 120 L134.1 120.5 L131.7 125.2 L129.4 128.6 L123.7 130.7 L118.8 127.2 L107.6 122.2 L104.6 115.8 L103.9 109.3 L98 103.1 L95.5 95.7 L96.5 90.6 L101.9 87.1 L103.4 84.2 L96.7 84.7 L95.2 83.9 L94.8 81.2 L91.8 72.2 L94.5 68.7 L95.7 65.3 L93.5 62.3 L94.2 58.9 L95.8 55.5 L94.8 47.7 L101.5 43.5 L108.2 40.6 L122.2 39 L120.8 31.9 L126.5 31.6 L136.1 22.9 L145.5 24.4 L159.2 18.6 L185.5 18.6 L189.2 15.1 L188.6 11.7 L188.6 8 L193.6 9.1 L201.8 8.5 L233 15.6 L240.5 15.6 L251.1 22.9 L256.8 24.9 L273.7 24.9 L299.5 28.2 L304.7 23.2 L305.2 21.8 L307.6 24.6 L310.8 29.1 L311.6 31.7 L310.6 33.1 L307.4 34.5 L306.8 35.8 L305.4 38.1 L301.7 38.6 L299.9 40.3 L297.5 47.9 L293.3 60.4 L287 70.1 L281.9 75.3 L279.6 79.4 L278.3 84.2 L277.9 89 L282.8 115.7 L282.8 120.5 L281.6 125.3 L280.8 130.4 L281.4 134.8 L284.6 142.2 L288 153.2 L289.3 160.4 L291.7 163 L293.8 164.9 L294.3 166.1 L294.2 167.4 L293.2 168.8 L283.3 172.5 L281.9 175.6 L280.9 179.2 L276.7 184.3 L275.4 189.1 L274.6 194.7 L274.4 196.7 Z",
    "M53.9 98.9 L57.3 101.1 L60.3 100.5 L63.3 98.9 L70 100.3 L85.4 111.3 L86.8 114.3 L77.7 115.5 L75.6 118.9 L73.4 121.3 L70.9 122.1 L66.3 126.7 L60.5 131.2 L59.1 133.8 L48.4 133.4 L42.5 135.1 L37.7 140.2 L35.8 149.8 L32.3 157.4 L28.8 160.2 L25.1 160.7 L24.1 157.7 L24.6 154.9 L32.3 144.2 L34 140.7 L30.1 139.1 L26.8 135.4 L19.7 131.1 L18.4 127.6 L20.1 127.3 L21.7 126.2 L23.6 123.3 L24.4 120 L18.7 110.1 L21.7 108.6 L25.3 108.9 L28.9 111.8 L33 108.4 L34.8 107.9 L37.7 109.2 L40.5 102.7 L47.2 100.5 L50.6 98.5 L53.9 98.9 Z",
    "M68.2 80.6 L64.3 85 L62.1 83.3 L61 81.1 L55.9 91.2 L50.4 92.9 L47.2 90.9 L47.6 87.1 L44.4 77.4 L39.5 74.4 L32.8 74.3 L27.8 70.2 L46.7 67.4 L48.7 62.8 L52.6 57.8 L55.4 57.3 L58 58.4 L58.3 62.3 L59 63.9 L67.5 65.9 L70.9 72.2 L72.2 80 L68.2 80.6 Z",
    "M87.8 105.3 L83.9 106.2 L74.7 99.9 L76.9 95.7 L79.4 94 L87.3 96.6 L88.3 103.1 L87.8 105.3 Z",
  ];
  var EST_PEIPUS =
    "M279 66.9 L294.4 90.2 L286.9 117 L283.6 147.4 L275.7 165.3 L266.4 159 L272 127.7 L260.4 99.1 L268.3 75.9 Z";
  var EST_VORTS = "M216.1 105.4 L220.8 125.9 L213.8 143.8 L207.7 127.7 L210.5 109.8 Z";
  function tripMapSVG() {
    var n = tripReached(),
      i,
      s = "";
    s +=
      '<svg viewBox="0 0 330 205" class="estmap" role="img" aria-label="Karta över Estland">' +
      '<defs><linearGradient id="mland" x1="0" y1="0" x2="0.3" y2="1">' +
      '<stop offset="0%" stop-color="#D8EDCB"/><stop offset="100%" stop-color="#A8CE97"/></linearGradient>' +
      '<linearGradient id="msea" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#CDE8F3"/><stop offset="100%" stop-color="#A8D3E6"/></linearGradient></defs>' +
      '<rect x="0" y="0" width="330" height="205" rx="18" fill="url(#msea)"/>';
    for (i = 0; i < EST_LAND.length; i++) {
      s +=
        '<path d="' +
        EST_LAND[i] +
        '" fill="url(#mland)" stroke="#6E9E5E" stroke-width="1.3" stroke-linejoin="round"/>';
    }
    s +=
      '<path d="' +
      EST_PEIPUS +
      '" fill="#B6DCEC" stroke="#8CBBD2" stroke-width="1"/>' +
      '<path d="' +
      EST_VORTS +
      '" fill="#B6DCEC" stroke="#8CBBD2" stroke-width="1"/>';
    /* orter utan stopp */
    for (i = 0; i < MAPTOWNS.length; i++) {
      var mt = MAPTOWNS[i];
      var ax = mt.end ? "end" : "start",
        tx = mt.x + (mt.end ? -4 : 4);
      s +=
        '<g class="mtown"><circle cx="' +
        mt.x +
        '" cy="' +
        mt.y +
        '" r="2.2" fill="#6E8A66"/>' +
        '<text x="' +
        tx +
        '" y="' +
        (mt.y + (mt.dy || 3)) +
        '" text-anchor="' +
        ax +
        '" font-size="7" fill="none" ' +
        'stroke="#F6FBF2" stroke-width="2.4" stroke-linejoin="round">' +
        esc(mt.et) +
        "</text>" +
        '<text x="' +
        tx +
        '" y="' +
        (mt.y + (mt.dy || 3)) +
        '" text-anchor="' +
        ax +
        '" font-size="7" fill="#4A6647">' +
        esc(mt.et) +
        "</text></g>";
    }
    /* vägen */
    var d = "",
      d2 = "";
    for (i = 0; i < TRIP.length; i++) {
      d += (i ? " L" : "M") + TRIP[i].x + " " + TRIP[i].y;
    }
    for (i = 0; i < n; i++) {
      d2 += (i ? " L" : "M") + TRIP[i].x + " " + TRIP[i].y;
    }
    s +=
      '<path d="' +
      d +
      '" fill="none" stroke="#7A5C42" stroke-width="2" stroke-dasharray="4 5" opacity=".5"/>' +
      '<path d="' +
      d2 +
      '" fill="none" stroke="#C8305A" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>';
    for (i = 0; i < TRIP.length; i++) {
      var t = TRIP[i],
        open = i < n,
        here = i === n - 1;
      s +=
        '<g class="mstop' +
        (open ? "" : " locked") +
        (here ? " here" : "") +
        '" data-stop="' +
        t.id +
        '" style="cursor:' +
        (open ? "pointer" : "default") +
        '">' +
        '<circle cx="' +
        t.x +
        '" cy="' +
        t.y +
        '" r="' +
        (here ? 11 : 8.5) +
        '" fill="' +
        (open ? "#FFF7E8" : "#E6EBE2") +
        '" stroke="' +
        (open ? "#C8305A" : "#93A78D") +
        '" stroke-width="' +
        (here ? 3 : 2) +
        '"/>' +
        '<text x="' +
        t.x +
        '" y="' +
        (t.y + (here ? 4.5 : 3.5)) +
        '" text-anchor="middle" font-size="' +
        (here ? 12 : 9.5) +
        '">' +
        (open ? t.em : "🔒") +
        "</text>" +
        '<text x="' +
        (t.x + (t.lx || 0)) +
        '" y="' +
        (t.y + (t.ly || (here ? 23 : 20))) +
        '" text-anchor="middle" font-size="8.5" font-weight="700" ' +
        'fill="none" stroke="#F6FBF2" stroke-width="3" stroke-linejoin="round">' +
        esc(t.et) +
        "</text>" +
        '<text x="' +
        (t.x + (t.lx || 0)) +
        '" y="' +
        (t.y + (t.ly || (here ? 23 : 20))) +
        '" text-anchor="middle" font-size="8.5" font-weight="700" ' +
        'fill="#28402C">' +
        esc(t.et) +
        "</text>" +
        "</g>";
    }
    /* Siiri står som en spelpjäs bredvid orten hon nått */
    var me = TRIP[n - 1];
    var walking = S.walkFrom !== undefined && S.walkFrom !== null && S.walkFrom !== n - 1;
    var from = walking ? TRIP[S.walkFrom] : me;
    var px = me.x + 13,
      py = me.y - 17;
    s +=
      '<g id="mewalk"' +
      (walking ? ' style="--fx:' + (from.x - me.x) + "px;--fy:" + (from.y - me.y) + 'px"' : "") +
      ">" +
      '<ellipse cx="' +
      px +
      '" cy="' +
      (py + 9) +
      '" rx="7" ry="2.4" fill="#2E402C" opacity=".28"/>' +
      '<path d="M' +
      (px - 6) +
      " " +
      (py + 8) +
      ' q6 3 12 0 v-2 q-6 3 -12 0 z" fill="#C8305A" opacity=".9"/>' +
      '<text x="' +
      px +
      '" y="' +
      (py + 6) +
      '" text-anchor="middle" font-size="17">🦔</text></g>';
    s += "</svg>";
    return s;
  }
  /* kartan är 330 enheter bred och Estland ungefär 380 km – ger en km-skala */
  var KM_PER_UNIT = 1.18;
  function legKm(i) {
    if (i <= 0) return 0;
    var a = TRIP[i - 1],
      b = TRIP[i];
    return Math.round(Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)) * KM_PER_UNIT);
  }
  function kmWalked() {
    var i,
      s = 0;
    for (i = 1; i < tripReached(); i++) s += legKm(i);
    return s;
  }
  function kmTotal() {
    var i,
      s = 0;
    for (i = 1; i < TRIP.length; i++) s += legKm(i);
    return s;
  }

  /* små händelser på vägen mellan två orter */
  var ROAD = [
    { em: "🫐", et: "Mustikad!", sv: "Blåbär vid stigen", stars: 20, word: "mustikas" },
    { em: "🌧️", et: "Vihma sajab.", sv: "Det börjar regna — Siiri springer", stars: 10, word: "vihm" },
    { em: "🦌", et: "Põder!", sv: "En älg står mitt på vägen", stars: 25, word: "põder" },
    { em: "🪺", et: "Linnupesa.", sv: "Ett fågelbo i en gran", stars: 15, word: "lind" },
    { em: "🍄", et: "Seened!", sv: "Svamp i mossan", stars: 20, word: "seen" },
    { em: "🌈", et: "Vikerkaar!", sv: "En regnbåge över åkern", stars: 30, word: "vikerkaar" },
    { em: "🚲", et: "Jalgratas!", sv: "Någon lånar ut en cykel", stars: 15, word: "jalgratas" },
    { em: "⭐", et: "Täht!", sv: "Siiri hittar en stjärna i vattenpölen", stars: 35, word: "täht" },
  ];
  function roadEvent(legIndex) {
    var seed = dayHash("road" + legIndex + (S.name || ""));
    return ROAD[seed % ROAD.length];
  }
  /* "Mängi" ska starta något, inte lämna barnet på startsidan.
       För skrivuppdraget väljs det upplåsta tema som har flest ord mogna för
       skrivfrågor (r>=2); för temauppdraget det tema som är längst ifrån klart. */
  function bestThemeFor(kind) {
    var lim = themesUnlocked(),
      best = null,
      bestN = -1,
      i,
      j,
      n,
      m;
    for (i = 0; i < Math.min(lim, THEMES.length); i++) {
      var t = THEMES[i],
        ws = stepWords(t);
      n = 0;
      for (j = 0; j < ws.length; j++) {
        m = (S.wordmem || {})[mkey(ws[j].et, ws[j].sv)] || {};
        if (kind === "type") {
          if ((m.r || 0) >= 2) n++;
        } else {
          if (!m.r) n++;
        } /* tema: flest ord kvar att möta */
      }
      if (n > bestN) {
        bestN = n;
        best = t;
      }
    }
    return best;
  }
  /* varje uppdrag ska gå att starta direkt – annars vet barnet inte var man gör det */
  var TASKGO = {
    words: { go: "practice", lbl: "Mängi" },
    theme: { go: "theme", lbl: "Mängi" },
    mix: { go: "speed", lbl: "Mängi" },
    /* skrivfrågor dyker bara upp i en temalektion, och först när ordet börjat sitta */
    type: { go: "typetheme", lbl: "Mängi", tip: "skrivfrågor kommer när ordet börjat sitta" },
    sent: { go: "sent", lbl: "Mängi" },
    talk: { go: "talk", lbl: "Mängi" },
    hear: { go: "speed", lbl: "Mängi", tip: "Mikrofonen behövs inte — lyssna och välj räcker" },
    otsi: { go: "otsi", lbl: "Mängi" },
    mem: { go: "mem", lbl: "Mängi" },
    duel: { go: "duel", lbl: "Mängi" },
  };
  function taskListHtml(cityId) {
    var tasks = TRIPTASKS[cityId] || [
        ["words", 3],
        ["theme", 1],
        ["mix", 1],
      ],
      i,
      s = "";
    s += '<div class="tasklist">';
    for (i = 0; i < tasks.length; i++) {
      var kind = tasks[i][0],
        goal = tasks[i][1],
        val = Math.min(taskValue(kind), goal),
        done = val >= goal;
      var tt = TASKTEXT[kind],
        tg = TASKGO[kind] || {};
      s +=
        '<div class="task' +
        (done ? " done" : "") +
        '"><span class="tem">' +
        (done ? "✅" : tt.em) +
        "</span>" +
        '<span class="ttx"><b>' +
        esc(tt.sv) +
        (goal > 1 && kind !== "words" ? " (" + goal + " st)" : "") +
        "</b>" +
        '<span class="qbar" style="background:var(--line)"><i style="width:' +
        Math.round((val / goal) * 100) +
        "%;background:" +
        (done ? "var(--moss)" : "var(--berry)") +
        '"></i></span>' +
        "<small>" +
        val +
        " av " +
        goal +
        (tg.tip ? " · " + esc(tg.tip) : "") +
        "</small></span>" +
        (done
          ? '<span class="taskdone">Klar</span>'
          : '<button class="btn small taskgo" data-taskgo="' +
            kind +
            '" data-city="' +
            esc(cityId) +
            '">' +
            (tg.lbl || "Mängi") +
            " ▸</button>") +
        "</div>";
    }
    return s + "</div>";
  }
  function stopCardHtml(t, isHere, n) {
    var sta = stationOf(t.id),
      gift = itemById(SOUVENIR[t.id]),
      j,
      s = "";
    s +=
      '<div class="card stopcard' +
      (isHere ? " now" : "") +
      '">' +
      (isHere
        ? ""
        : '<button class="btn-plain caret" data-openstop="' +
          t.id +
          '" style="float:right;font-size:18px">▾</button>') +
      '<p class="q" style="text-align:left;margin-bottom:2px">' +
      t.em +
      ' <span lang="et">' +
      esc(t.et) +
      "</span>" +
      (isHere ? ' <small class="herenow">siin oled · här är du</small>' : "") +
      '<button class="speakbtn sm" data-say="' +
      esc(t.et) +
      '" style="float:right" aria-label="Hör ortens namn">🔊</button></p>' +
      (STORY[t.id] ? '<p class="storyline">' + STORY[t.id].replace(/\*\*(.+?)\*\*/g, "<b>$1</b>") + "</p>" : "") +
      '<p class="qsub" style="text-align:left">' +
      esc(t.fact) +
      "</p>";
    if (isHere) {
      var tl = tasksLeft();
      s +=
        '<p class="qsub" style="text-align:left;margin-top:8px"><b>' +
        (tl
          ? "Klara alla tre, så vandrar Siiri vidare" + (TRIP[n] ? " till " + esc(TRIP[n].et) : "") + "."
          : "Alla uppdrag klara!") +
        "</b></p>" +
        taskListHtml(t.id);
      if (gift)
        s +=
          '<p class="qsub" style="text-align:left;margin-top:8px">🎁 Souvenir när allt är klart: <b>' +
          gift.em +
          ' <span lang="et">' +
          esc(gift.et) +
          "</span></b> — " +
          esc(gift.sv) +
          "</p>";
    }
    s += '<button class="btn wide" data-practice="' + t.id + '" style="margin-top:8px">🎧 Öva de tre orden</button>';
    if (sta)
      s +=
        '<button class="btn green stationbtn" data-station="' +
        t.id +
        '">' +
        '<span class="stbtx">' +
        sta.em +
        ' <span lang="et">' +
        esc(sta.et) +
        "</span> · " +
        esc(sta.verb) +
        "</span>" +
        '</button><p class="qsub" style="text-align:left">' +
        esc(sta.intro) +
        "</p>";
    s += '<div class="stopwords">';
    for (j = 0; j < t.words.length; j++) {
      var wd = t.words[j];
      s +=
        '<div class="wordrow"><span class="em">' +
        wIcon(wd) +
        '</span><span class="t"><b lang="et">' +
        esc(wd.et) +
        "</b>" +
        "<span>" +
        esc(wd.sv) +
        " · uttal: " +
        esc(wd.hint) +
        "</span></span>" +
        '<button class="speakbtn sm" data-say="' +
        esc(wd.et) +
        '" data-refresh="1" aria-label="Hör ordet">🔊</button>' +
        '<button class="speakbtn sm" data-slow="' +
        esc(wd.et) +
        '" aria-label="Långsamt">🐢</button></div>';
    }
    return s + "</div></div>";
  }
  function tripScreen() {
    screen = "trip";
    setNav("trip");
    prefetch("trip");
    var n = tripReached(),
      here = TRIP[n - 1],
      next = TRIP[n],
      i;
    var tl = tasksLeft(),
      tasks = tasksOf(),
      gift = itemById(SOUVENIR[here.id]);
    var songPct = Math.round((tripDone() / TRIP.length) * 100);
    var html =
      '<div class="zone map"><span class="zem">🗺️</span><span><b>Teekond</b><span>Resan genom Estland</span></span></div>';
    /* målet först: barnet ska veta vad resan går ut på innan det ser kartan */
    html +=
      '<div class="card goalcard"><p class="q" style="text-align:left;margin-bottom:2px">🎶 Laulupidu · Sångfesten</p>' +
      '<p class="qsub" style="text-align:left">Hjälp Siiri att resa genom Estlands ' +
      TRIP.length +
      " orter. I varje ort väntar nya ord och uppdrag.</p>" +
      '<div class="songrow"><b class="songbig">' +
      tripDone() +
      " av " +
      TRIP.length +
      "</b><span>orter besökta</span></div>" +
      '<span class="qbar" style="background:var(--line)"><i style="width:' +
      songPct +
      '%;background:var(--berry)"></i></span>' +
      "</div>";
    html +=
      '<div class="card">' +
      '<p class="qsub">' +
      esc(UI.trip.sv) +
      " · " +
      n +
      " av " +
      TRIP.length +
      " orter</p>" +
      tripMapSVG() +
      '<div class="kmbar"><span>🥾 ' +
      kmWalked().toLocaleString("sv-SE") +
      " km</span>" +
      '<span class="qbar" style="background:var(--line)"><i style="width:' +
      Math.round((kmWalked() / kmTotal()) * 100) +
      '%;background:var(--bark)"></i></span>' +
      '<span style="color:var(--muted)">av ' +
      kmTotal().toLocaleString("sv-SE") +
      "</span></div>" +
      (n < TRIP.length
        ? '<p class="qsub" style="margin-top:6px">Nästa etapp: <span lang="et">' +
          esc(TRIP[n].et) +
          "</span> · " +
          legKm(n) +
          " km</p>"
        : "") +
      "</div>";
    if (tripDone() >= TRIP.length) {
      html +=
        '<div class="card" style="text-align:center"><p class="q">🎶 Sången är färdig!</p>' +
        '<p class="storyline" style="text-align:left">Siiri står på sångarfältet i Tallinn med alla tolv raderna i huvudet. ' +
        "Hundratusen röster börjar samtidigt — och hon kan varenda rad, för du hjälpte henne att hitta dem.</p>" +
        '<div class="center">' +
        siilSVG() +
        "</div>" +
        '<button class="btn green big wide" id="singit" style="margin-top:10px">🎵 Låt henne sjunga</button></div>';
    }
    /* ortkortet för orten man är på: berättelse, uppdrag och ord på samma ställe */
    html += stopCardHtml(here, true, n);
    /* de klarade orterna ligger hopfällda längst ner */
    if (n > 1) {
      var vis = !!S.tripVisited;
      html +=
        '<button class="card visitedhead" id="visitedhead"><span class="sem">🏰</span>' +
        '<span class="stx"><b lang="et">Külastatud</b><small>Besökta orter · ' +
        (n - 1) +
        " st</small></span>" +
        '<span class="caret">' +
        (vis ? "▾" : "▸") +
        "</span></button>";
      if (vis) {
        for (i = n - 2; i >= 0; i--) {
          var t0 = TRIP[i],
            op0 = S.tripOpen === t0.id;
          if (op0) {
            html += stopCardHtml(t0, false, n);
          } else {
            html +=
              '<button class="card stopmini" data-openstop="' +
              t0.id +
              '">' +
              '<span class="sem">' +
              t0.em +
              "</span>" +
              '<span class="stx"><b lang="et">' +
              esc(t0.et) +
              "</b><small>" +
              esc(t0.sv) +
              " · klar ✓</small></span>" +
              '<span class="caret">▸</span></button>';
          }
        }
      }
    }
    app.innerHTML = html;
    var pb = app.querySelectorAll("[data-practice]"),
      pq;
    for (pq = 0; pq < pb.length; pq++) {
      (function (el) {
        el.onclick = function (e) {
          e.stopPropagation();
          tripPractice(el.getAttribute("data-practice"));
        };
      })(pb[pq]);
    }
    var os = app.querySelectorAll("[data-openstop]"),
      oq;
    for (oq = 0; oq < os.length; oq++) {
      (function (el) {
        el.onclick = function (e) {
          e.stopPropagation();
          var id = el.getAttribute("data-openstop");
          S.tripOpen = S.tripOpen === id ? "-" : id;
          save();
          tripScreen();
        };
      })(os[oq]);
    }
    var vh = document.getElementById("visitedhead");
    if (vh)
      vh.onclick = function () {
        S.tripVisited = !S.tripVisited;
        save();
        tripScreen();
      };
    var tg = app.querySelectorAll("[data-taskgo]"),
      tq;
    for (tq = 0; tq < tg.length; tq++) {
      (function (el) {
        el.onclick = function (e) {
          e.stopPropagation();
          var kind = el.getAttribute("data-taskgo"),
            city = el.getAttribute("data-city");
          var dest = (TASKGO[kind] || {}).go;
          stopSpeak();
          if (dest === "practice") {
            tripPractice(city);
            return;
          }
          if (dest === "theme" || dest === "typetheme") {
            var bt = bestThemeFor(dest === "typetheme" ? "type" : "theme");
            if (bt) {
              lessonStart(bt.id);
              return;
            }
            go(homeScreen, true);
            return;
          }
          var f = {
            home: homeScreen,
            speed: speedIntro,
            sent: sentIntro,
            talk: talkScreen,
            otsi: otsiIntro,
            mem: memIntro,
            duel: duelIntro,
          }[dest];
          if (f) go(f, true);
        };
      })(tg[tq]);
    }
    var sb3 = app.querySelectorAll("[data-station]"),
      sq3;
    for (sq3 = 0; sq3 < sb3.length; sq3++) {
      (function (el) {
        el.onclick = function (e) {
          e.stopPropagation();
          stationStart(el.getAttribute("data-station"));
        };
      })(sb3[sq3]);
    }
    var sing = document.getElementById("singit");
    if (sing)
      sing.onclick = function () {
        burst(220);
        fanfare(3);
        mood("cheer");
        var lines = ["Mu isamaa on minu arm", "ja armastan ma teda"],
          k2 = 0;
        speak(TRIP[TRIP.length - 1].et);
        setTimeout(function () {
          petals(80, ["#FFD45E", "#3FE0A8", "#8FD3F4"]);
        }, 700);
      };
    var b = app.querySelectorAll("[data-say]"),
      k;
    for (k = 0; k < b.length; k++) {
      (function (el) {
        el.onclick = function (e) {
          e.stopPropagation();
          var wd = el.getAttribute("data-say");
          speak(wd);
          var cur = tripCur(),
            q;
          for (q = 0; q < cur.words.length; q++) {
            if (cur.words[q].et === wd) tripBump("words", 1, wd);
          }
          if (el.getAttribute("data-refresh"))
            setTimeout(function () {
              if (screen === "trip") tripScreen();
            }, 900);
        };
      })(b[k]);
    }
    var sl = app.querySelectorAll("[data-slow]");
    for (k = 0; k < sl.length; k++) {
      (function (el) {
        el.onclick = function (e) {
          e.stopPropagation();
          speak(el.getAttribute("data-slow"), true);
        };
      })(sl[k]);
    }
    var ms = app.querySelectorAll("[data-stop]");
    for (k = 0; k < ms.length; k++) {
      (function (el) {
        el.onclick = function () {
          var id = el.getAttribute("data-stop"),
            q;
          for (q = 0; q < TRIP.length; q++) {
            if (TRIP[q].id === id && q < tripReached()) speak(TRIP[q].et);
          }
          var card = app.querySelectorAll(".stopcard")[[].slice.call(ms).indexOf(el)];
          if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
        };
      })(ms[k]);
    }
  }
  var DU = null;
  function rivalOpen(r) {
    return tripDone() >= r.need;
  }
  function duelRec(id) {
    if (!S.duels) S.duels = {};
    if (!S.duels[id]) S.duels[id] = { w: 0, l: 0, best: 0 };
    return S.duels[id];
  }
  /* ---------- VÄLJAKUTSE: barnet utmanar en vuxen ---------- */
  var CH = null;

  /* motståndarens chans att svara rätt: sämre på ord du kan, bättre på ord som vacklar,
       och hon skärper sig när hon halkar efter – men kan aldrig springa ifrån på slutet */

  /* ---------- SIIRI TUBA: rummet där samlingen bor ---------- */
  /* ---------- DAGENS GÖMDA SAK ---------- */
  var HIDE_SPOTS = [
    { id: "kardin", sv: "bakom gardinen", x: 7, y: 24 },
    { id: "vaip", sv: "under mattan", x: 46, y: 92 },
    { id: "riiul", sv: "på hyllan", x: 56, y: 47 },
    { id: "kamin", sv: "vid brasan", x: 78, y: 44 },
    { id: "lipp", sv: "bakom tavlan", x: 36, y: 11 },
    { id: "aken", sv: "på fönsterbrädan", x: 16, y: 53 },
    { id: "tool", sv: "i fåtöljen", x: 12, y: 71 },
    { id: "puud", sv: "i vedtraven", x: 93, y: 86 },
  ];
  function dayHash(s) {
    var i,
      n = 0;
    for (i = 0; i < s.length; i++) n = (n * 31 + s.charCodeAt(i)) >>> 0;
    return n;
  }
  function hiddenToday() {
    var seed = dayHash(today() + "|" + (S.name || ""));
    var pool = allWords();
    return { spot: HIDE_SPOTS[seed % HIDE_SPOTS.length], word: pool[(seed >>> 3) % pool.length] };
  }
  function hideFound() {
    return S.hideday === today();
  }
  function findHidden() {
    if (hideFound()) return;
    var t = hiddenToday();
    S.hideday = today();
    S.hidelast = { et: t.word.et, sv: t.word.sv, em: t.word.em };
    var gain = 15 + (dayHash(today()) % 6) * 5;
    earnStars(gain);
    addXp(20);
    save();
    refreshTop();
    speak(t.word.et);
    burst(140);
    fanfare(2);
    buzz(24);
    var d = document.createElement("div");
    d.className = "overlay";
    d.innerHTML =
      '<div class="oc" style="border-color:var(--honey)"><p class="kicker">🔍 Sa leidsid! · Du hittade den!</p>' +
      '<div class="bagpop">' +
      wIcon(t.word) +
      "</div><h3>" +
      esc(t.word.et) +
      "</h3><p>" +
      esc(t.word.sv) +
      " · låg " +
      esc(t.spot.sv) +
      "</p>" +
      '<p class="qsub">⭐ +' +
      gain * starMult() +
      "</p>" +
      '<div class="row"><button class="btn" id="hsay">🔊 Hör igen</button>' +
      '<button class="btn green" id="hok">Aitäh!</button></div></div>';
    document.body.appendChild(d);
    d.querySelector("#hsay").onclick = function () {
      speak(t.word.et);
    };
    d.querySelector("#hok").onclick = function () {
      d.remove();
      roomScreen();
    };
  }

  /* ================= MÖBLERING AV RUMMET ================= */
  var FURN = [
    /* väggar */
    { id: "w-panel", slot: "wall", sv: "Gräddpanel", et: "Kreemjas", price: 0, def: 1 },
    { id: "w-mint", slot: "wall", sv: "Grönaktig vägg", et: "Rohekas", price: 260 },
    { id: "w-rose", slot: "wall", sv: "Rosaaktig vägg", et: "Roosakas", price: 260 },
    { id: "w-blue", slot: "wall", sv: "Blåaktig vägg", et: "Sinakas", price: 320 },
    { id: "w-stars", slot: "wall", sv: "Stjärntapet", et: "Tähetapeet", price: 650 },
    /* golv */
    { id: "f-wood", slot: "floor", sv: "Furugolv", et: "Puupõrand", price: 0, def: 1 },
    { id: "f-dark", slot: "floor", sv: "Mörkt golv", et: "Tume põrand", price: 240 },
    { id: "f-tile", slot: "floor", sv: "Rutigt golv", et: "Ruuduline", price: 380 },
    /* mattor */
    { id: "r-round", slot: "rug", sv: "Rund matta", et: "Ümmargune vaip", price: 0, def: 1 },
    { id: "r-stripe", slot: "rug", sv: "Randig matta", et: "Triibuline vaip", price: 220 },
    { id: "r-folk", slot: "rug", sv: "Folkmönstrad matta", et: "Rahvavaip", price: 460 },
    { id: "r-bear", slot: "rug", sv: "Björnfäll", et: "Karunahk", price: 700 },
    /* möbel vänster */
    { id: "l-chair", slot: "left", sv: "Grön fåtölj", et: "Tugitool", price: 0, def: 1 },
    { id: "l-bed", slot: "left", sv: "Liten säng", et: "Voodi", price: 520 },
    { id: "l-desk", slot: "left", sv: "Skrivbord", et: "Kirjutuslaud", price: 430 },
    { id: "l-rock", slot: "left", sv: "Gungstol", et: "Kiiktool", price: 600 },
    /* möbel höger */
    { id: "g-wood", slot: "right", sv: "Vedtrave", et: "Puuriit", price: 0, def: 1 },
    { id: "g-shelf", slot: "right", sv: "Bokhylla", et: "Raamaturiiul", price: 480 },
    { id: "g-toys", slot: "right", sv: "Leksakskorg", et: "Mänguasjad", price: 300 },
    { id: "g-kannel", slot: "right", sv: "Kannel på stativ", et: "Kannel", price: 820 },
    /* vägg */
    { id: "a-flag", slot: "art", sv: "Estniska flaggan", et: "Lipp", price: 0, def: 1 },
    { id: "a-view", slot: "art", sv: "Landskapstavla", et: "Maastik", price: 280 },
    { id: "a-map", slot: "art", sv: "Karta över Estland", et: "Kaart", price: 340 },
    { id: "a-photo", slot: "art", sv: "Familjefoto", et: "Pere pilt", price: 420 },
    /* lampa */
    { id: "p-none", slot: "lamp", sv: "Ingen lampa", et: "Ilma", price: 0, def: 1 },
    { id: "p-floor", slot: "lamp", sv: "Golvlampa", et: "Põrandalamp", price: 260 },
    { id: "p-lant", slot: "lamp", sv: "Lykta", et: "Latern", price: 340 },
    /* växt */
    { id: "v-none", slot: "plant", sv: "Ingen växt", et: "Ilma", price: 0, def: 1 },
    { id: "v-pot", slot: "plant", sv: "Krukväxt", et: "Toataim", price: 180 },
    { id: "v-tree", slot: "plant", sv: "Litet träd", et: "Väike puu", price: 420 },
    { id: "v-flow", slot: "plant", sv: "Blomvas", et: "Lillevaas", price: 300 },
    { id: "v-cact", slot: "plant", sv: "Kaktus", et: "Kaktus", price: 260 },
    { id: "u-day", slot: "view", sv: "Sommardag", et: "Suvepäev", price: 0, def: 1 },
    { id: "u-night", slot: "view", sv: "Stjärnnatt", et: "Tähine öö", price: 340 },
    { id: "u-snow", slot: "view", sv: "Snöfall", et: "Lumesadu", price: 380 },
    { id: "u-sea", slot: "view", sv: "Havsutsikt", et: "Merevaade", price: 460 },
    { id: "d-none", slot: "pet", sv: "Inget djur", et: "Ilma", price: 0, def: 1 },
    { id: "d-cat", slot: "pet", sv: "Kattunge", et: "Kassipoeg", price: 900 },
    { id: "d-bird", slot: "pet", sv: "Fågel i bur", et: "Lind puuris", price: 640 },
    { id: "d-hedge", slot: "pet", sv: "Liten igelkott", et: "Siilipoeg", price: 1200 },
    { id: "w-wood", slot: "wall", sv: "Timmervägg", et: "Palksein", price: 520 },
    { id: "r-star", slot: "rug", sv: "Stjärnmatta", et: "Tähevaip", price: 520 },
    { id: "l-sofa", slot: "left", sv: "Liten soffa", et: "Diivan", price: 700 },
    { id: "g-dress", slot: "right", sv: "Byrå", et: "Kummut", price: 560 },
    { id: "a-clock", slot: "art", sv: "Väggklocka", et: "Seinakell", price: 300 },
    { id: "p-ceil", slot: "lamp", sv: "Taklampa", et: "Laelamp", price: 420 },
  ];
  var FURNSLOTS = [
    ["wall", "Vägg", "🎨"],
    ["floor", "Golv", "🪵"],
    ["rug", "Matta", "🟣"],
    ["left", "Möbel vänster", "🪑"],
    ["right", "Möbel höger", "📚"],
    ["art", "På väggen", "🖼️"],
    ["lamp", "Lampa", "💡"],
    ["plant", "Växt", "🪴"],
    ["view", "Utsikt", "🪟"],
    ["pet", "Husdjur", "🐾"],
  ];
  function furnById(id) {
    var i;
    for (i = 0; i < FURN.length; i++) if (FURN[i].id === id) return FURN[i];
    return null;
  }
  function furnOwned(id) {
    var f = furnById(id);
    return !!(f && (f.def || (S.furnOwned || []).indexOf(id) >= 0));
  }
  function furnOf(slot) {
    if (!S.room) S.room = {};
    var id = S.room[slot],
      i;
    if (id && furnOwned(id)) return id;
    for (i = 0; i < FURN.length; i++) if (FURN[i].slot === slot && FURN[i].def) return FURN[i].id;
    return null;
  }

  /* ---- ritningar för möblerna ---- */
  function fWall(id) {
    var base = {
      "w-panel": ["#EFE3CC", "#E2D3B8", "#C8B698"],
      "w-mint": ["#E4F0E2", "#CFE4CC", "#A9CBA6"],
      "w-rose": ["#F6E6E4", "#EBD2CF", "#D2ADA8"],
      "w-blue": ["#E2EDF6", "#CBDFEE", "#A5C2DA"],
      "w-stars": ["#2B3A63", "#223052", "#16213C"],
    }[id] || ["#EFE3CC", "#E2D3B8", "#C8B698"];
    var s =
      '<linearGradient id="g-wall" x1="0" y1="0" x2="0.25" y2="1">' +
      '<stop offset="0%" stop-color="' +
      base[0] +
      '"/><stop offset="48%" stop-color="' +
      base[1] +
      '"/>' +
      '<stop offset="100%" stop-color="' +
      base[2] +
      '"/></linearGradient>';
    var body = '<rect width="400" height="202" fill="url(#g-wall)"/>',
      x;
    for (x = 0; x <= 400; x += 24) {
      body +=
        '<rect x="' +
        x +
        '" y="0" width="1.4" height="202" fill="#000" opacity=".03"/>' +
        '<rect x="' +
        (x + 1.4) +
        '" y="0" width="1.2" height="202" fill="#fff" opacity=".10"/>';
    }
    if (id === "w-stars") {
      var i, sx, sy;
      for (i = 0; i < 34; i++) {
        sx = ((i * 97) % 380) + 10;
        sy = ((i * 53) % 170) + 8;
        body +=
          '<path d="M' +
          sx +
          " " +
          (sy - 3.2) +
          ' l1 2.2 l2.4 .3 l-1.8 1.7 l.5 2.4 l-2.1 -1.2 l-2.1 1.2 l.5 -2.4 l-1.8 -1.7 l2.4 -.3 z" fill="#F6E28A" opacity="' +
          (0.5 + (i % 3) * 0.2) +
          '"/>';
      }
      body +=
        '<circle cx="340" cy="38" r="16" fill="#F8EDBE" opacity=".9"/><circle cx="333" cy="33" r="13" fill="' +
        base[0] +
        '"/>';
    }
    body +=
      '<rect x="0" y="0" width="34" height="202" fill="#3A2A18" opacity=".10"/>' +
      '<rect x="366" y="0" width="34" height="202" fill="#3A2A18" opacity=".08"/>' +
      '<rect x="0" y="0" width="400" height="16" fill="#3A2A18" opacity=".12"/>';
    /* bröstpanel */
    var wain = id === "w-stars" ? "#33436E" : "#EADCC0";
    body +=
      '<rect x="0" y="150" width="400" height="46" fill="' +
      wain +
      '"/>' +
      '<rect x="0" y="147" width="400" height="5" rx="2.5" fill="#D9C8AB" opacity=".9"/>' +
      '<rect x="0" y="147" width="400" height="2" fill="#FFF6E6" opacity=".7"/>';
    for (x = 12; x < 400; x += 64) {
      body +=
        '<rect x="' +
        x +
        '" y="158" width="48" height="30" rx="3" fill="none" stroke="#C6B294" stroke-width="1.8" opacity=".8"/>';
    }
    body += '<rect x="0" y="190" width="400" height="6" fill="#B9A585"/>';
    return { defs: s, body: body };
  }
  function fFloor(id) {
    var c = {
      "f-wood": ["#C39A68", "#AC8352", "#8A6238"],
      "f-dark": ["#8A6A4A", "#6E5134", "#4E3721"],
      "f-tile": ["#DCD2C2", "#C3B6A2", "#A2957F"],
    }[id] || ["#C39A68", "#AC8352", "#8A6238"];
    var s =
      '<linearGradient id="g-floor" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="' +
      c[0] +
      '"/><stop offset="45%" stop-color="' +
      c[1] +
      '"/>' +
      '<stop offset="100%" stop-color="' +
      c[2] +
      '"/></linearGradient>';
    var body = '<rect y="196" width="400" height="74" fill="url(#g-floor)"/>',
      i,
      x1,
      x2;
    if (id === "f-tile") {
      var r, q;
      for (r = 0; r < 4; r++)
        for (q = -1; q < 9; q++) {
          if ((r + q) % 2) continue;
          var yy = 196 + r * 19,
            hh = 19,
            xx = q * 52 + r * 8,
            ww = 52 + r * 8;
          body +=
            '<rect x="' + xx + '" y="' + yy + '" width="' + ww + '" height="' + hh + '" fill="#F2ECE0" opacity=".5"/>';
        }
    } else {
      for (i = -6; i < 14; i++) {
        x1 = i * 34;
        x2 = 200 + (x1 - 200) * 1.9;
        body += '<path d="M' + x1 + " 196 L" + x2 + ' 270" stroke="#3A2410" stroke-width="1.2" opacity=".15"/>';
      }
    }
    body += '<rect y="193" width="400" height="8" fill="#2A1B0C" opacity=".20"/>';
    return { defs: s, body: body };
  }
  function fRug(id) {
    if (id === "r-stripe") {
      var s = '<ellipse cx="150" cy="240" rx="88" ry="22" fill="#2A1B0C" opacity=".2"/>',
        i;
      var cols = ["#C85A6A", "#E8D6B4", "#4E8A8C", "#E8D6B4"];
      for (i = 0; i < 8; i++)
        s +=
          '<ellipse cx="150" cy="240" rx="' +
          (86 - i * 10) +
          '" ry="' +
          (21.5 - i * 2.5) +
          '" fill="' +
          cols[i % 4] +
          '"/>';
      return s;
    }
    if (id === "r-folk") {
      var s2 =
          '<ellipse cx="150" cy="240" rx="88" ry="22" fill="#7E3348"/>' +
          '<ellipse cx="150" cy="239" rx="72" ry="18" fill="#E6D2AE"/>' +
          '<ellipse cx="150" cy="238" rx="54" ry="13" fill="#A8465C"/>' +
          '<ellipse cx="150" cy="238" rx="30" ry="7" fill="#E6D2AE"/>',
        k,
        a,
        x,
        y;
      for (k = 0; k < 12; k++) {
        a = (Math.PI * 2 * k) / 12;
        x = 150 + Math.cos(a) * 63;
        y = 239 + Math.sin(a) * 15.5;
        s2 += '<path d="M' + x + " " + (y - 3) + ' l2.4 3 l-2.4 3 l-2.4 -3 z" fill="#2E6B45"/>';
      }
      return s2;
    }
    if (id === "r-bear") {
      return (
        '<g><ellipse cx="150" cy="243" rx="74" ry="18" fill="#6E4E34"/>' +
        '<ellipse cx="150" cy="241" rx="62" ry="15" fill="#8A6845"/>' +
        '<circle cx="80" cy="238" r="15" fill="#6E4E34"/><circle cx="70" cy="228" r="6" fill="#5C3F28"/>' +
        '<circle cx="90" cy="226" r="6" fill="#5C3F28"/><circle cx="75" cy="238" r="2" fill="#2A1B0C"/>' +
        '<circle cx="86" cy="238" r="2" fill="#2A1B0C"/><ellipse cx="80" cy="243" rx="4" ry="3" fill="#3A2A1E"/>' +
        '<circle cx="214" cy="232" r="11" fill="#6E4E34"/><circle cx="208" cy="252" r="11" fill="#6E4E34"/></g>'
      );
    }
    var s3 =
      '<ellipse cx="150" cy="240" rx="88" ry="22" fill="#2A1B0C" opacity=".2"/>' +
      '<ellipse cx="150" cy="240" rx="86" ry="21" fill="#B8566A"/>' +
      '<ellipse cx="150" cy="239" rx="66" ry="16" fill="#E0CDAC"/>' +
      '<ellipse cx="150" cy="238" rx="42" ry="10" fill="#A8465C"/>';
    return s3;
  }
  function fLeft(id) {
    if (id === "l-bed") {
      return (
        '<g transform="translate(14,146)"><ellipse cx="46" cy="80" rx="52" ry="9" fill="#2A1B0C" opacity=".22"/>' +
        '<rect x="0" y="18" width="12" height="58" rx="4" fill="#8A5E30"/><rect x="80" y="30" width="12" height="46" rx="4" fill="#8A5E30"/>' +
        '<rect x="0" y="4" width="12" height="20" rx="5" fill="#A8713C"/>' +
        '<rect x="4" y="34" width="86" height="18" rx="6" fill="#F3EADA"/>' +
        '<rect x="4" y="40" width="86" height="14" rx="6" fill="#7FA9C9"/>' +
        '<rect x="10" y="28" width="30" height="14" rx="6" fill="#FFFDF6"/>' +
        '<rect x="4" y="52" width="86" height="8" rx="4" fill="#5E87A8"/></g>'
      );
    }
    if (id === "l-desk") {
      return (
        '<g transform="translate(16,150)"><ellipse cx="46" cy="76" rx="48" ry="8" fill="#2A1B0C" opacity=".22"/>' +
        '<rect x="0" y="22" width="92" height="9" rx="3" fill="#B07C48"/><rect x="0" y="22" width="92" height="3" fill="#E0BC8E" opacity=".8"/>' +
        '<rect x="4" y="31" width="9" height="42" rx="3" fill="#8A5E30"/><rect x="79" y="31" width="9" height="42" rx="3" fill="#8A5E30"/>' +
        '<rect x="46" y="31" width="38" height="26" rx="3" fill="#A8713C"/><circle cx="65" cy="44" r="2.4" fill="#E8D2A8"/>' +
        '<rect x="12" y="12" width="26" height="10" rx="2" fill="#C85A6A"/><rect x="14" y="8" width="22" height="6" rx="2" fill="#4E8A8C"/>' +
        '<path d="M66 22 v-10" stroke="#8A5E30" stroke-width="2"/><circle cx="66" cy="10" r="5" fill="#F6D24A"/></g>'
      );
    }
    if (id === "l-rock") {
      return (
        '<g transform="translate(20,150)"><ellipse cx="40" cy="78" rx="44" ry="8" fill="#2A1B0C" opacity=".22"/>' +
        '<path d="M6 30 q0 -26 30 -26 q30 0 30 26 v28 H6 z" fill="#9A6B8C"/>' +
        '<path d="M6 30 q0 -26 30 -26 q10 0 16 5 q-22 5 -26 24 z" fill="#fff" opacity=".16"/>' +
        '<rect x="0" y="52" width="72" height="16" rx="7" fill="#7E5472"/>' +
        '<path d="M-2 76 q38 -14 76 0" stroke="#6E4A28" stroke-width="5" fill="none" stroke-linecap="round"/>' +
        '<rect x="8" y="66" width="7" height="10" fill="#6E4A28"/><rect x="57" y="66" width="7" height="10" fill="#6E4A28"/></g>'
      );
    }
    return (
      '<g transform="translate(24,150)"><ellipse cx="34" cy="76" rx="38" ry="9" fill="#2A1B0C" opacity=".22"/>' +
      '<path d="M6 30 q0 -22 28 -22 q28 0 28 22 v34 H6 z" fill="#6A9A7A"/>' +
      '<path d="M6 30 q0 -22 28 -22 q10 0 16 5 q-22 4 -26 22 z" fill="#fff" opacity=".14"/>' +
      '<rect x="0" y="52" width="68" height="18" rx="7" fill="#5E8A6B"/>' +
      '<rect x="-2" y="44" width="12" height="26" rx="5" fill="#446B52"/><rect x="58" y="44" width="12" height="26" rx="5" fill="#446B52"/>' +
      '<rect x="8" y="68" width="7" height="9" rx="2" fill="#6E4A28"/><rect x="53" y="68" width="7" height="9" rx="2" fill="#6E4A28"/>' +
      '<g transform="translate(14,34) rotate(-8)"><rect x="0" y="0" width="26" height="20" rx="5" fill="#E2C46A"/>' +
      '<rect x="0" y="0" width="26" height="6" rx="3" fill="#F2DC9C" opacity=".8"/></g></g>'
    );
  }
  function fRight(id) {
    if (id === "g-shelf") {
      return (
        '<g transform="translate(348,150)"><ellipse cx="32" cy="90" rx="38" ry="8" fill="#2A1B0C" opacity=".22"/>' +
        '<rect x="0" y="0" width="64" height="88" rx="3" fill="#A8713C"/>' +
        '<rect x="4" y="4" width="56" height="80" fill="#7A5230"/>' +
        '<rect x="4" y="28" width="56" height="5" fill="#A8713C"/><rect x="4" y="54" width="56" height="5" fill="#A8713C"/>' +
        '<g><rect x="8" y="8" width="7" height="20" fill="#C85A6A"/><rect x="17" y="10" width="6" height="18" fill="#4E8A8C"/>' +
        '<rect x="25" y="7" width="8" height="21" fill="#E8B62C"/><rect x="35" y="12" width="6" height="16" fill="#7E5AA8"/>' +
        '<rect x="8" y="36" width="6" height="18" fill="#5C9C5E"/><rect x="16" y="34" width="8" height="20" fill="#C06A4A"/>' +
        '<rect x="26" y="38" width="7" height="16" fill="#3A72C8"/>' +
        '<circle cx="46" cy="48" r="6" fill="#4E8A52"/><rect x="43" y="48" width="7" height="6" fill="#C06A4A"/></g></g>'
      );
    }
    if (id === "g-toys") {
      return (
        '<g transform="translate(344,208)"><ellipse cx="30" cy="34" rx="34" ry="7" fill="#2A1B0C" opacity=".22"/>' +
        '<path d="M2 4 h56 l-6 28 h-44 z" fill="#C9A06A"/><path d="M2 4 h56 l-1.4 6 h-53.2 z" fill="#E0BC8E"/>' +
        '<g stroke="#A8824E" stroke-width="1.2" opacity=".6"><path d="M12 10 v20 M24 10 v20 M36 10 v20 M48 10 v20"/></g>' +
        '<circle cx="16" cy="0" r="9" fill="#C85A6A"/><circle cx="34" cy="-2" r="7" fill="#3A72C8"/>' +
        '<path d="M44 2 l6 -10 l6 10 z" fill="#E8B62C"/></g>'
      );
    }
    if (id === "g-kannel") {
      return (
        '<g transform="translate(344,186)"><ellipse cx="34" cy="58" rx="36" ry="8" fill="#2A1B0C" opacity=".22"/>' +
        '<path d="M4 20 h58 l-10 22 h-38 z" fill="#C08A54"/><path d="M4 20 h58 l-2 5 h-54 z" fill="#E0BC8E"/>' +
        '<g stroke="#F2E4C8" stroke-width="1" opacity=".85"><path d="M10 24 l40 0 M12 29 l36 0 M14 34 l32 0 M16 39 l28 0"/></g>' +
        '<rect x="14" y="42" width="7" height="16" fill="#8A5E30"/><rect x="46" y="42" width="7" height="16" fill="#8A5E30"/></g>'
      );
    }
    return (
      '<g transform="translate(348,214)"><ellipse cx="24" cy="30" rx="30" ry="6" fill="#2A1B0C" opacity=".26"/>' +
      '<g><g transform="translate(4,18)"><ellipse rx="8.5" ry="7" fill="#6E4524"/><ellipse rx="6.4" ry="5.2" fill="#C89A62"/></g>' +
      '<g transform="translate(23,18)"><ellipse rx="8.5" ry="7" fill="#5E3A1E"/><ellipse rx="6.4" ry="5.2" fill="#B98A54"/></g>' +
      '<g transform="translate(42,18)"><ellipse rx="8.5" ry="7" fill="#6E4524"/><ellipse rx="6.4" ry="5.2" fill="#C89A62"/></g>' +
      '<g transform="translate(13,7)"><ellipse rx="8.5" ry="7" fill="#5E3A1E"/><ellipse rx="6.4" ry="5.2" fill="#BE8F58"/></g>' +
      '<g transform="translate(33,7)"><ellipse rx="8.5" ry="7" fill="#6E4524"/><ellipse rx="6.4" ry="5.2" fill="#C89A62"/></g>' +
      '<g transform="translate(23,-4)"><ellipse rx="8.5" ry="7" fill="#5E3A1E"/><ellipse rx="6.4" ry="5.2" fill="#C29562"/></g></g></g>'
    );
  }
  function fArt(id) {
    if (id === "a-view") {
      return (
        '<g transform="translate(150,20)"><rect x="3" y="5" width="96" height="66" rx="3" fill="#2A1B0C" opacity=".22"/>' +
        '<rect width="96" height="66" rx="3" fill="#8A6238"/><rect x="5" y="5" width="86" height="56" fill="#DCEEF6"/>' +
        '<path d="M5 40 q18 -16 34 -4 q14 10 24 -4 q10 -12 23 -2 v27 H5 z" fill="#8FBE7E"/>' +
        '<circle cx="70" cy="20" r="9" fill="#F6D24A"/><path d="M5 52 q22 -8 44 0 q22 8 42 -2 v11 H5 z" fill="#5E8A54"/></g>'
      );
    }
    if (id === "a-map") {
      return (
        '<g transform="translate(150,20)"><rect x="3" y="5" width="96" height="66" rx="3" fill="#2A1B0C" opacity=".22"/>' +
        '<rect width="96" height="66" rx="3" fill="#6E4E2A"/><rect x="5" y="5" width="86" height="56" fill="#F2EAD6"/>' +
        '<path d="M14 40 q6 -14 22 -12 q10 -8 24 -2 q14 -2 18 8 q4 12 -8 16 q-16 6 -34 2 q-18 -2 -22 -12 z" fill="#9EC48E" stroke="#6E8A5E" stroke-width="1"/>' +
        '<circle cx="34" cy="30" r="2.2" fill="#C8305A"/><circle cx="56" cy="38" r="2" fill="#C8305A"/><circle cx="70" cy="34" r="2" fill="#C8305A"/>' +
        '<path d="M34 30 L56 38 L70 34" stroke="#C8305A" stroke-width="1.2" fill="none" stroke-dasharray="3 2"/></g>'
      );
    }
    if (id === "a-photo") {
      return (
        '<g transform="translate(150,20)"><rect x="3" y="5" width="96" height="66" rx="3" fill="#2A1B0C" opacity=".22"/>' +
        '<rect width="96" height="66" rx="3" fill="#C9A06A"/><rect x="6" y="6" width="84" height="54" fill="#FBF6EA"/>' +
        '<circle cx="34" cy="30" r="11" fill="#E8D2B4"/><circle cx="34" cy="30" r="8" fill="#C9A98A"/>' +
        '<circle cx="60" cy="33" r="9" fill="#E8D2B4"/><circle cx="60" cy="33" r="6.4" fill="#C9A98A"/>' +
        '<path d="M18 52 q16 -12 32 0 q14 -10 28 0 v8 H18 z" fill="#8FA8C4"/>' +
        '<path d="M26 20 q8 -8 16 0" stroke="#8A6238" stroke-width="2" fill="none"/></g>'
      );
    }
    return (
      '<g transform="translate(150,20)"><rect x="3" y="5" width="96" height="66" rx="3" fill="#2A1B0C" opacity=".22"/>' +
      '<rect width="96" height="66" rx="3" fill="#8A6238"/><rect x="5" y="5" width="86" height="56" fill="#F7F7F7"/>' +
      '<rect x="5" y="5" width="86" height="18.7" fill="#0072CE"/><rect x="5" y="23.7" width="86" height="18.7" fill="#141414"/>' +
      '<rect x="5" y="42.4" width="86" height="18.6" fill="#FAFAFA"/>' +
      '<rect x="5" y="5" width="86" height="56" fill="none" stroke="#6E4E2A" stroke-width="1.2"/></g>'
    );
  }
  function fLamp(id) {
    if (id === "p-floor") {
      return (
        '<g transform="translate(120,124)"><ellipse cx="0" cy="104" rx="16" ry="4" fill="#2A1B0C" opacity=".24"/>' +
        '<rect x="-2" y="18" width="4" height="86" fill="#8A7A5E"/><rect x="-10" y="100" width="20" height="5" rx="2.5" fill="#6E6048"/>' +
        '<path d="M-18 18 h36 l-7 -20 h-22 z" fill="#F2D98A"/><path d="M-18 18 h36 l-1 3 h-34 z" fill="#D8B964"/>' +
        '<ellipse cx="0" cy="26" rx="22" ry="9" fill="#FFE9A8" opacity=".35"/></g>'
      );
    }
    if (id === "p-lant") {
      return (
        '<g transform="translate(298,74)"><path d="M0 0 v8" stroke="#6E6048" stroke-width="2"/>' +
        '<path d="M-9 8 h18 l-2 22 h-14 z" fill="#8A7A5E"/>' +
        '<path d="M-7 10 h14 l-1.6 18 h-10.8 z" fill="#FFE9A8"/>' +
        '<circle cx="0" cy="19" r="4" fill="#FFC24D"/>' +
        '<ellipse cx="0" cy="19" rx="18" ry="14" fill="#FFE9A8" opacity=".25"/></g>'
      );
    }
    return "";
  }
  function fPlant(id) {
    if (id === "v-tree") {
      return (
        '<g transform="translate(378,196)" transform-origin="378 196"><ellipse cx="0" cy="52" rx="24" ry="6" fill="#2A1B0C" opacity=".24"/>' +
        '<rect x="-4" y="16" width="8" height="34" fill="#8A5E30"/>' +
        '<circle cx="0" cy="8" r="20" fill="#4E8A52"/><circle cx="-14" cy="18" r="13" fill="#5CA05E"/>' +
        '<circle cx="14" cy="18" r="13" fill="#3E7A46"/>' +
        '<path d="M-14 50 h28 l-3 10 h-22 z" fill="#C06A4A"/></g>'
      );
    }
    if (id === "v-flow") {
      return (
        '<g transform="translate(366,168)"><ellipse cx="0" cy="34" rx="16" ry="5" fill="#2A1B0C" opacity=".24"/>' +
        '<path d="M-8 10 q0 22 8 24 q8 -2 8 -24 z" fill="#9ACCE2"/><path d="M-8 10 h16 l-1 3 h-14 z" fill="#C6E4F2"/>' +
        '<path d="M0 10 v-16" stroke="#4E8A52" stroke-width="2"/><circle cx="0" cy="-18" r="5" fill="#E86A8A"/>' +
        '<path d="M-5 2 q-8 -6 -9 -14 q8 2 10 12 z" fill="#5CA05E"/>' +
        '<path d="M4 -2 q9 -6 10 -16 q-9 3 -11 14 z" fill="#4E8A52"/>' +
        '<circle cx="-7" cy="-12" r="4" fill="#F6D24A"/><circle cx="7" cy="-10" r="4" fill="#C8A0E2"/></g>'
      );
    }
    if (id === "v-pot") {
      return (
        '<g transform="translate(366,168)"><ellipse cx="0" cy="34" rx="20" ry="5" fill="#2A1B0C" opacity=".24"/>' +
        '<path d="M0 14 q-14 -6 -17 -22 q16 2 19 18 z" fill="#4E8A52"/>' +
        '<path d="M3 14 q14 -9 15 -25 q-16 5 -17 22 z" fill="#69A86A"/>' +
        '<path d="M-12 14 h26 l-4 20 h-18 z" fill="#C06A4A"/><path d="M-12 14 h26 l-1 5 h-24 z" fill="#E08A66"/></g>'
      );
    }
    return "";
  }
  function fWallExtra(id) {
    if (id !== "w-wood") return "";
    var s = "",
      y;
    for (y = 0; y < 150; y += 22) {
      s +=
        '<path d="M0 ' +
        y +
        ' h400 v22 h-400 z" fill="#C9A06A" opacity="' +
        (y % 44 ? ".55" : ".75") +
        '"/>' +
        '<path d="M0 ' +
        (y + 22) +
        ' h400" stroke="#8A5E30" stroke-width="1.4" opacity=".5"/>' +
        '<path d="M0 ' +
        (y + 2) +
        ' h400" stroke="#E8C79A" stroke-width="1.2" opacity=".45"/>';
    }
    return s;
  }
  function fView(id) {
    if (id === "u-night") {
      var s = '<rect x="28" y="34" width="84" height="90" fill="#223052"/>',
        i,
        x,
        y;
      for (i = 0; i < 22; i++) {
        x = 32 + ((i * 37) % 76);
        y = 38 + ((i * 23) % 78);
        s +=
          '<circle cx="' +
          x +
          '" cy="' +
          y +
          '" r="' +
          (0.8 + (i % 3) * 0.4) +
          '" fill="#F6E28A" opacity="' +
          (0.5 + (i % 4) * 0.12) +
          '"/>';
      }
      return (
        s +
        '<circle cx="92" cy="54" r="11" fill="#F8EDBE"/><circle cx="87" cy="50" r="9" fill="#223052"/>' +
        '<path d="M28 104 q22 -14 42 -4 q18 10 42 -4 v28 H28 z" fill="#2E4064"/>'
      );
    }
    if (id === "u-snow") {
      var s2 = '<rect x="28" y="34" width="84" height="90" fill="#CFE2EF"/>',
        j,
        x2,
        y2;
      s2 += '<path d="M28 92 q22 -16 42 -6 q20 10 42 -6 v44 H28 z" fill="#F2F7FB"/>';
      for (j = 0; j < 26; j++) {
        x2 = 30 + ((j * 31) % 80);
        y2 = 36 + ((j * 19) % 86);
        s2 += '<circle cx="' + x2 + '" cy="' + y2 + '" r="' + (1.2 + (j % 3) * 0.5) + '" fill="#FFFFFF" opacity=".9"/>';
      }
      return s2 + '<path d="M44 92 l6 -16 l6 16 z" fill="#E8F2F8"/><path d="M78 96 l7 -18 l7 18 z" fill="#E8F2F8"/>';
    }
    if (id === "u-sea") {
      return (
        '<rect x="28" y="34" width="84" height="90" fill="#BFE0F2"/>' +
        '<circle cx="94" cy="52" r="10" fill="#FFE58A"/>' +
        '<rect x="28" y="84" width="84" height="40" fill="#5AA8C8"/>' +
        '<g stroke="#FFFFFF" stroke-width="1.4" opacity=".7" fill="none">' +
        '<path d="M32 94 q8 -4 16 0 q8 4 16 0 q8 -4 16 0 q8 4 16 0"/>' +
        '<path d="M32 106 q8 -4 16 0 q8 4 16 0 q8 -4 16 0 q8 4 16 0"/></g>' +
        '<path d="M54 84 l8 -16 l8 16 z" fill="#F7EEDC"/><rect x="60" y="68" width="2" height="16" fill="#8A5E30"/>'
      );
    }
    return "";
  }
  function fRugExtra(id) {
    if (id !== "r-star") return null;
    var s =
        '<ellipse cx="150" cy="240" rx="88" ry="22" fill="#2A1B0C" opacity=".2"/>' +
        '<ellipse cx="150" cy="240" rx="86" ry="21" fill="#3A4C8A"/>' +
        '<ellipse cx="150" cy="239" rx="64" ry="15" fill="#4E63A8"/>',
      i,
      a,
      x,
      y;
    for (i = 0; i < 14; i++) {
      a = (Math.PI * 2 * i) / 14;
      x = 150 + Math.cos(a) * 70;
      y = 239 + Math.sin(a) * 17;
      s +=
        '<path d="M' +
        x +
        " " +
        (y - 3.4) +
        ' l1.1 2.4 l2.6 .3 l-1.9 1.8 l.5 2.6 l-2.3 -1.3 l-2.3 1.3 l.5 -2.6 l-1.9 -1.8 l2.6 -.3 z" fill="#F6E28A"/>';
    }
    s +=
      '<path d="M150 230 l3.4 7 l7.6 .9 l-5.6 5.4 l1.4 7.6 l-6.8 -3.8 l-6.8 3.8 l1.4 -7.6 l-5.6 -5.4 l7.6 -.9 z" fill="#F8EDBE"/>';
    return s;
  }
  function fLeftExtra(id) {
    if (id !== "l-sofa") return null;
    return (
      '<g transform="translate(16,154)"><ellipse cx="46" cy="72" rx="52" ry="9" fill="#2A1B0C" opacity=".22"/>' +
      '<path d="M4 26 q0 -18 20 -18 h44 q20 0 20 18 v22 H4 z" fill="#B85E72"/>' +
      '<path d="M4 26 q0 -18 20 -18 h20 q-16 6 -18 22 z" fill="#fff" opacity=".14"/>' +
      '<rect x="-2" y="40" width="96" height="22" rx="9" fill="#9C4A5E"/>' +
      '<rect x="-4" y="30" width="16" height="32" rx="7" fill="#8A3F52"/>' +
      '<rect x="80" y="30" width="16" height="32" rx="7" fill="#8A3F52"/>' +
      '<rect x="10" y="60" width="8" height="10" rx="2" fill="#6E4A28"/>' +
      '<rect x="74" y="60" width="8" height="10" rx="2" fill="#6E4A28"/>' +
      '<rect x="26" y="20" width="22" height="18" rx="5" fill="#E2C46A" transform="rotate(-8 37 29)"/></g>'
    );
  }
  function fRightExtra(id) {
    if (id !== "g-dress") return null;
    return (
      '<g transform="translate(336,156)"><ellipse cx="30" cy="74" rx="36" ry="8" fill="#2A1B0C" opacity=".22"/>' +
      '<rect x="0" y="0" width="60" height="72" rx="4" fill="#B07C48"/>' +
      '<rect x="0" y="0" width="60" height="6" rx="3" fill="#D8A86A"/>' +
      '<rect x="6" y="10" width="48" height="18" rx="3" fill="#C9A06A"/>' +
      '<rect x="6" y="32" width="48" height="18" rx="3" fill="#C9A06A"/>' +
      '<rect x="6" y="54" width="48" height="14" rx="3" fill="#C9A06A"/>' +
      '<circle cx="30" cy="19" r="2.6" fill="#F2E8D4"/><circle cx="30" cy="41" r="2.6" fill="#F2E8D4"/>' +
      '<circle cx="30" cy="61" r="2.6" fill="#F2E8D4"/>' +
      '<g transform="translate(14,-14)"><path d="M0 14 q-8 -4 -10 -12 q9 1 11 10 z" fill="#4E8A52"/>' +
      '<path d="M2 14 q8 -5 9 -14 q-9 3 -10 12 z" fill="#69A86A"/>' +
      '<path d="M-7 14 h16 l-2 10 h-12 z" fill="#C06A4A"/></g></g>'
    );
  }
  function fArtExtra(id) {
    if (id !== "a-clock") return null;
    return (
      '<g transform="translate(182,24)"><circle cx="16" cy="18" r="21" fill="#8A6238"/>' +
      '<circle cx="16" cy="18" r="17" fill="#F7F2E6"/>' +
      '<g stroke="#6E5F55" stroke-width="1.4"><path d="M16 5 v3 M16 28 v3 M3 18 h3 M26 18 h3"/></g>' +
      '<path d="M16 18 v-9 M16 18 l7 5" stroke="#33312E" stroke-width="2" stroke-linecap="round"/>' +
      '<circle cx="16" cy="18" r="2" fill="#33312E"/>' +
      '<path d="M16 39 v6" stroke="#8A6238" stroke-width="3"/><circle cx="16" cy="48" r="5" fill="#C9A06A"/></g>'
    );
  }
  function fLampExtra(id) {
    if (id !== "p-ceil") return null;
    return (
      '<g transform="translate(200,0)"><rect x="-1.5" y="0" width="3" height="26" fill="#8A7A5E"/>' +
      '<path d="M-22 26 h44 l-9 -16 h-26 z" fill="#E8D8A8"/>' +
      '<path d="M-22 26 h44 l-1.5 3 h-41 z" fill="#C9B882"/>' +
      '<ellipse cx="0" cy="34" rx="26" ry="11" fill="#FFE9A8" opacity=".35"/></g>'
    );
  }
  function fPlantExtra(id) {
    if (id !== "v-cact") return null;
    return (
      '<g transform="translate(366,172)"><ellipse cx="0" cy="30" rx="16" ry="5" fill="#2A1B0C" opacity=".24"/>' +
      '<rect x="-6" y="-14" width="12" height="28" rx="6" fill="#4E8A52"/>' +
      '<rect x="-16" y="-4" width="10" height="8" rx="5" fill="#5CA05E"/>' +
      '<rect x="6" y="-10" width="10" height="8" rx="5" fill="#5CA05E"/>' +
      '<circle cx="0" cy="-18" r="3.4" fill="#E86A8A"/>' +
      '<path d="M-10 14 h20 l-3 16 h-14 z" fill="#C06A4A"/>' +
      '<path d="M-10 14 h20 l-1 4 h-18 z" fill="#E08A66"/></g>'
    );
  }
  function fPet(id) {
    if (id === "d-cat") {
      return (
        '<g id="roompet" transform="translate(70,193) scale(0.6)" style="cursor:pointer">' +
        '<ellipse cx="50" cy="93" rx="27" ry="5" fill="#2A1B0C" opacity=".18"/>' +
        '<g class="pettail">' +
        '<path d="M64,66 C96,66 108,30 86,8 C98,28 96,62 60,60 Z" fill="#F2A765"/>' +
        '<path d="M86,16 C96,32 92,54 68,58" fill="none" stroke="#D98A3E" stroke-width="1.6" opacity=".5" stroke-linecap="round"/>' +
        "</g>" +
        '<ellipse cx="50" cy="62" rx="28" ry="24" fill="#F2A765"/>' +
        '<ellipse cx="50" cy="72" rx="19" ry="16" fill="#FDF4E6"/>' +
        '<path d="M50,78 q0,7 0,11" stroke="#E8C79A" stroke-width="1.3" opacity=".6" stroke-linecap="round"/>' +
        '<ellipse cx="38" cy="85" rx="9.5" ry="7.5" fill="#FDF4E6"/>' +
        '<ellipse cx="62" cy="85" rx="9.5" ry="7.5" fill="#FDF4E6"/>' +
        '<path d="M32,16 Q22,0 42,12 Q38,18 32,16 Z" fill="#F2A765"/>' +
        '<path d="M33,14 Q27,5 39,12 Q36,15.5 33,14 Z" fill="#FBD9B0"/>' +
        '<path d="M68,16 Q78,0 58,12 Q62,18 68,16 Z" fill="#F2A765"/>' +
        '<path d="M67,14 Q73,5 61,12 Q64,15.5 67,14 Z" fill="#FBD9B0"/>' +
        '<circle cx="50" cy="31" r="22" fill="#F2A765"/>' +
        '<g stroke="#D98A3E" stroke-width="1.7" fill="none" stroke-linecap="round" opacity=".7">' +
        '<path d="M43,14 q2,5 0,9"/><path d="M50,12 q0,5 0,9"/><path d="M57,14 q-2,5 0,9"/>' +
        "</g>" +
        '<ellipse cx="32" cy="38" rx="5.5" ry="4" fill="#F7C07E" opacity=".5"/>' +
        '<ellipse cx="68" cy="38" rx="5.5" ry="4" fill="#F7C07E" opacity=".5"/>' +
        '<g stroke="#FFFDF8" stroke-width="1.1" stroke-linecap="round" opacity=".9">' +
        '<path d="M28,34 L9,30"/><path d="M28,37 L8,37"/><path d="M28,40 L9,44"/>' +
        '<path d="M72,34 L91,30"/><path d="M72,37 L92,37"/><path d="M72,40 L91,44"/>' +
        "</g>" +
        '<ellipse cx="41.5" cy="33" rx="5" ry="6" fill="#2A2015"/><ellipse cx="58.5" cy="33" rx="5" ry="6" fill="#2A2015"/>' +
        '<circle cx="39.5" cy="29.5" r="1.7" fill="#fff"/><circle cx="56.5" cy="29.5" r="1.7" fill="#fff"/>' +
        '<circle cx="43" cy="35" r=".9" fill="#fff" opacity=".7"/><circle cx="60" cy="35" r=".9" fill="#fff" opacity=".7"/>' +
        '<path d="M46.5,40 L53.5,40 L50,43.5 Z" fill="#E8899A"/>' +
        '<path d="M50,43.5 L50,45.5" stroke="#C47A4A" stroke-width="1"/>' +
        '<path d="M50,45.5 q-4,4 -8,0.6" fill="none" stroke="#C47A4A" stroke-width="1.3" stroke-linecap="round"/>' +
        '<path d="M50,45.5 q4,4 8,0.6" fill="none" stroke="#C47A4A" stroke-width="1.3" stroke-linecap="round"/>' +
        "</g>"
      );
    }
    if (id === "d-bird") {
      return (
        '<g transform="translate(78,192)">' +
        '<ellipse cx="0" cy="62" rx="18" ry="5" fill="#2A1B0C" opacity=".24"/>' +
        '<rect x="-1.6" y="48" width="3.2" height="14" fill="#8A7A5E"/>' +
        '<path d="M-10 62 h20 l-2 -4 h-16 z" fill="#8A7A5E"/>' +
        '<path d="M0 0 v10" stroke="#8A7A5E" stroke-width="2"/>' +
        '<path d="M-14 10 q14 -8 28 0 v36 q-14 8 -28 0 z" fill="#F2EADA" opacity=".55"/>' +
        '<g stroke="#A8936E" stroke-width="1.2"><path d="M-10 12 v34 M-4 10 v38 M2 10 v38 M8 12 v34"/></g>' +
        '<ellipse cx="0" cy="48" rx="15" ry="4" fill="#A8936E"/>' +
        '<ellipse cx="0" cy="34" rx="7" ry="6" fill="#E8B62C"/><circle cx="4" cy="29" r="4.4" fill="#F2C94C"/>' +
        '<path d="M7 29 l5 1.6 l-5 1.6 z" fill="#E86A3A"/><circle cx="5" cy="28" r="1" fill="#2A1B0C"/></g>'
      );
    }
    if (id === "d-hedge") {
      return (
        '<g transform="translate(320,252)"><ellipse cx="0" cy="5" rx="20" ry="5" fill="#2A1B0C" opacity=".24"/>' +
        '<ellipse cx="0" cy="-7" rx="17" ry="13" fill="#8A7055"/>' +
        '<g fill="#6E5540">' +
        '<path d="M-14 -14 l-3 -7 l7 3 z"/><path d="M-6 -18 l-1 -8 l6 5 z"/><path d="M2 -19 l2 -8 l5 6 z"/>' +
        '<path d="M10 -15 l6 -6 l2 7 z"/><path d="M15 -8 l8 -3 l-4 6 z"/></g>' +
        '<ellipse cx="-13" cy="-4" rx="8" ry="7" fill="#F2E4CE"/>' +
        '<circle cx="-16" cy="-6" r="1.4" fill="#2A1B0C"/><circle cx="-10" cy="-6" r="1.4" fill="#2A1B0C"/>' +
        '<ellipse cx="-20" cy="-3" rx="2.2" ry="1.8" fill="#3A2A1E"/></g>'
      );
    }
    return "";
  }
  /* diplomen hänger på väggen */
  function fDiplomas() {
    var ids = [],
      k;
    for (k in S.diplomas || {}) if (S.diplomas[k]) ids.push({ id: k, s: S.diplomas[k] });
    if (!ids.length) return "";
    var s = '<g transform="translate(266,6)">',
      i,
      max = Math.min(8, ids.length);
    for (i = 0; i < max; i++) {
      var col = ids[i].s >= 3 ? "#D9A52B" : ids[i].s >= 2 ? "#A8A8A8" : "#C08A54";
      var x = (i % 4) * 31,
        y = Math.floor(i / 4) * 33;
      s +=
        '<g transform="translate(' +
        x +
        "," +
        y +
        ')">' +
        '<rect x="1" y="1" width="26" height="29" rx="2" fill="#2A1B0C" opacity=".18"/>' +
        '<rect width="26" height="29" rx="2" fill="#F7F1E2" stroke="' +
        col +
        '" stroke-width="1.8"/>' +
        '<path d="M5 9 h16 M5 13.5 h16 M5 18 h11" stroke="#B7A98E" stroke-width="1.2"/>' +
        '<circle cx="19" cy="23" r="3.4" fill="' +
        col +
        '"/></g>';
    }
    if (ids.length > 8) s += '<text x="0" y="78" font-size="7" fill="#6E5F4E">+' + (ids.length - 8) + " till</text>";
    return s + "</g>";
  }
  /* souvenirhyllan: visar resans minnen */
  function fShelf() {
    var got = [],
      i,
      id;
    for (i = 0; i < TRIP.length; i++) {
      id = SOUVENIR[TRIP[i].id];
      got.push({ have: i < tripDone(), em: (itemById(id) || {}).em || "🎁", et: TRIP[i].et });
    }
    var s =
      '<g transform="translate(150,98)"><rect x="0" y="22" width="98" height="7" rx="2.5" fill="#B07C48"/>' +
      '<rect x="0" y="22" width="98" height="2" fill="#E0BC8E" opacity=".8"/>' +
      '<path d="M0 29 h98 l-4 4 h-90 z" fill="#2A1B0C" opacity=".2"/>' +
      '<path d="M8 29 h10 l-3 6 h-4 z M80 29 h10 l-3 6 h-4 z" fill="#7A5230"/>';
    var k, row, col, x, y;
    for (k = 0; k < got.length && k < 20; k++) {
      row = k < 10 ? 0 : 1;
      col = k % 10;
      x = 6 + col * 9.6;
      y = row === 0 ? -6 : 20;
      if (got[k].have) s += '<text x="' + x + '" y="' + y + '" font-size="9">' + got[k].em + "</text>";
      else s += '<circle cx="' + (x + 3.4) + '" cy="' + (y - 3.4) + '" r="2.8" fill="#000" opacity=".10"/>';
    }
    /* en liten extra hylla för den övre raden */
    s +=
      '<rect x="0" y="-4" width="98" height="5" rx="2" fill="#B07C48"/>' +
      '<rect x="0" y="-4" width="98" height="1.6" fill="#E0BC8E" opacity=".8"/>';
    return s + "</g>";
  }
  var WINDOWSVG =
    '<g transform="translate(22,28)"> <rect x="-8" y="-8" width="112" height="124" rx="6" fill="#2A1B0C" opacity=".18"/> <rect x="-6" y="-6" width="108" height="120" rx="5" fill="#B08A5E"/> <rect x="-6" y="-6" width="108" height="120" rx="5" fill="none" stroke="#7E6038" stroke-width="2"/> <rect x="0" y="0" width="96" height="108" fill="url(#sky)"/> <g opacity=".9"> <ellipse cx="24" cy="26" rx="18" ry="9" fill="#fff" opacity=".85"/> <ellipse cx="62" cy="38" rx="13" ry="7" fill="#fff" opacity=".7"/> <path d="M0 78 q14 -12 26 -4 q10 7 20 -2 q12 -10 24 0 q14 10 26 -2 v38 H0 z" fill="#79A36A" opacity=".85"/> <path d="M0 92 q18 -8 32 0 q16 8 32 -2 q16 -8 32 2 v16 H0 z" fill="#5E8A54" opacity=".9"/> </g> <path d="M46 0 V108 M0 52 H96" stroke="#B08A5E" stroke-width="7"/> <path d="M46 0 V108 M0 52 H96" stroke="#D8B27E" stroke-width="2" opacity=".7"/> <rect x="0" y="0" width="96" height="108" fill="none" stroke="#8A6A40" stroke-width="2"/> <path d="M6 6 L34 6 L6 34 Z" fill="#fff" opacity=".22"/> <path d="M54 58 L84 58 L54 88 Z" fill="#fff" opacity=".16"/> <rect x="-14" y="108" width="124" height="9" rx="3" fill="#C49A66"/> <rect x="-14" y="108" width="124" height="3" fill="#EBC593" opacity=".8"/> <rect x="-14" y="117" width="124" height="4" fill="#2A1B0C" opacity=".18"/> <path d="M-12 -8 q20 24 20 60 q0 32 -8 56 h-18 z" fill="url(#curt)" opacity=".92"/> <path d="M108 -8 q-20 24 -20 60 q0 32 8 56 h18 z" fill="url(#curt)" opacity=".92"/> <g stroke="#6E5540" stroke-width="1.2" opacity=".45" fill="none"> <path d="M-6 -4 q12 26 10 58 q-2 28 -6 50"/><path d="M2 -2 q10 26 9 56 q-2 26 -5 48"/> <path d="M102 -4 q-12 26 -10 58 q2 28 6 50"/><path d="M94 -2 q-10 26 -9 56 q2 26 5 48"/> </g> </g> <path d="M36 148 L128 148 L196 268 L60 268 Z" fill="url(#beam)" opacity=".5"/>';
  var FIRESVG =
    ' <rect x="-14" y="-14" width="126" height="16" rx="4" fill="#A98757"/> <rect x="-14" y="-14" width="126" height="5" rx="2.5" fill="#D2AE7A"/> <rect x="-14" y="-1" width="126" height="4" fill="#2A1B0C" opacity=".25"/> <rect x="-4" y="2" width="106" height="108" rx="5" fill="url(#stone)" stroke="#7E776B" stroke-width="1.6"/> <path d="M16 106 V44 q33 -30 66 0 V106 Z" fill="#1E1713"/> <path d="M16 106 V44 q33 -30 66 0 V106" fill="none" stroke="#6E6659" stroke-width="3"/> <path d="M16 46 q33 -28 66 0" fill="none" stroke="#C9C1B4" stroke-width="2" opacity=".5"/> <ellipse cx="49" cy="100" rx="44" ry="20" fill="url(#fireglow)"/> <g> <rect x="24" y="88" width="50" height="9" rx="4.5" fill="#7A5230" transform="rotate(-5 49 92)"/> <rect x="24" y="88" width="50" height="3" rx="1.5" fill="#9E6E44" transform="rotate(-5 49 92)" opacity=".8"/> <rect x="28" y="94" width="46" height="9" rx="4.5" fill="#5E3E22" transform="rotate(4 51 98)"/> <g stroke="#3E2814" stroke-width="1" opacity=".55"> <path d="M28 90 h42 M32 96 h38" transform="rotate(-5 49 92)"/> </g> </g> <ellipse cx="49" cy="95" rx="26" ry="7" fill="#FF7A1A" opacity=".5"/> <g class="flames"> <path class="fl a" d="M49 96 q-16 -16 -6 -32 q2 11 9 14 q-7 -18 6 -29 q-2 18 10 29 q8 10 -3 18 z" fill="url(#fl1)"/> <path class="fl b" d="M33 97 q-10 -11 -3 -21 q1 7 6 10 q-4 -11 4 -17 q0 11 6 18 q5 6 -3 10 z" fill="url(#fl2)" opacity=".9"/> <path class="fl c" d="M65 97 q-10 -11 -3 -21 q1 7 6 10 q-4 -11 4 -17 q0 11 6 18 q5 6 -3 10 z" fill="url(#fl2)" opacity=".82"/> <path class="fl d" d="M49 97 q-8 -9 -2 -17 q1 6 5 7 q-3 -9 4 -13 q0 10 5 15 q4 5 -3 8 z" fill="#FFF6D6" opacity=".92"/> <path class="fl e" d="M49 97 q-5 -6 -1 -11 q1 4 3 5 q-2 -6 2 -9 q0 7 3 10 q2 3 -1 5 z" fill="#8FD3F4" opacity=".5"/> </g> <g fill="#FF9A1F" opacity=".9" class="embers"> <circle cx="33" cy="78" r="1.6"/><circle cx="61" cy="70" r="1.3"/><circle cx="47" cy="62" r="1.1"/> </g> <rect x="-20" y="106" width="138" height="13" rx="3" fill="#B8B0A2"/> <rect x="-20" y="106" width="138" height="4" rx="2" fill="#DCD5C8"/> <ellipse cx="49" cy="122" rx="74" ry="10" fill="#3E2A16" opacity=".24"/> </g>';
  var MANTELSVG =
    ' <!-- Salvo-dockor i trä, i folkdräkt --> <g transform="translate(288,78)"> <ellipse cx="0" cy="1" rx="9" ry="2.4" fill="#2A1B0C" opacity=".28"/> <path d="M-7.5 0 q0.4 -13 7.5 -15 q7.1 2 7.5 15 z" fill="#C8302F"/> <path d="M-7.5 0 q0.4 -13 7.5 -15 q2 0.6 3.4 2.6 q-5 3.4 -5.6 12.4 z" fill="#E4553F"/> <g stroke="#F4D93C" stroke-width="1.1" fill="none"> <path d="M-6.6 -4 q6.6 2.2 13.2 0"/><path d="M-5.6 -8 q5.6 2 11.2 0"/></g> <path d="M-4.6 -12.4 q4.6 -2.6 9.2 0 q-1.4 -4.6 -4.6 -4.6 q-3.2 0 -4.6 4.6 z" fill="#F7EEDC"/> <circle cx="0" cy="-18.4" r="5" fill="#EBD3B4"/> <path d="M-5 -18.6 q0.6 -6 5 -6 q4.4 0 5 6 q-2 -2.6 -5 -2.6 q-3 0 -5 2.6 z" fill="#2E6B45"/> <path d="M-4.8 -17.8 q1.6 5.4 4.8 5.4 q3.2 0 4.8 -5.4 q-1.2 3.4 -4.8 3.4 q-3.6 0 -4.8 -3.4 z" fill="#2E6B45"/> <circle cx="-1.8" cy="-18.6" r=".8" fill="#3A2A1E"/><circle cx="1.8" cy="-18.6" r=".8" fill="#3A2A1E"/> <path d="M-1.6 -16.2 q1.6 1.4 3.2 0" stroke="#B07A6A" stroke-width=".8" fill="none"/> <circle cx="-3.4" cy="-16.6" r="1.2" fill="#F0A8A0" opacity=".7"/><circle cx="3.4" cy="-16.6" r="1.2" fill="#F0A8A0" opacity=".7"/> </g> <g transform="translate(304,78) scale(0.86)"> <ellipse cx="0" cy="1" rx="9" ry="2.4" fill="#2A1B0C" opacity=".28"/> <path d="M-7.5 0 q0.4 -13 7.5 -15 q7.1 2 7.5 15 z" fill="#2B4CA8"/> <path d="M-7.5 0 q0.4 -13 7.5 -15 q2 0.6 3.4 2.6 q-5 3.4 -5.6 12.4 z" fill="#4A6FD0"/> <g stroke="#F7EEDC" stroke-width="1.1" fill="none"> <path d="M-6.6 -4 q6.6 2.2 13.2 0"/><path d="M-5.6 -8 q5.6 2 11.2 0"/></g> <path d="M-4.6 -12.4 q4.6 -2.6 9.2 0 q-1.4 -4.6 -4.6 -4.6 q-3.2 0 -4.6 4.6 z" fill="#F7EEDC"/> <circle cx="0" cy="-18.4" r="5" fill="#EBD3B4"/> <path d="M-5 -18.6 q0.6 -6 5 -6 q4.4 0 5 6 q-2 -2.6 -5 -2.6 q-3 0 -5 2.6 z" fill="#C8302F"/> <path d="M-4.8 -17.8 q1.6 5.4 4.8 5.4 q3.2 0 4.8 -5.4 q-1.2 3.4 -4.8 3.4 q-3.6 0 -4.8 -3.4 z" fill="#C8302F"/> <circle cx="-1.8" cy="-18.6" r=".8" fill="#3A2A1E"/><circle cx="1.8" cy="-18.6" r=".8" fill="#3A2A1E"/> <path d="M-1.6 -16.2 q1.6 1.4 3.2 0" stroke="#B07A6A" stroke-width=".8" fill="none"/> <circle cx="-3.4" cy="-16.6" r="1.2" fill="#F0A8A0" opacity=".7"/><circle cx="3.4" cy="-16.6" r="1.2" fill="#F0A8A0" opacity=".7"/> </g> <!-- dalahäst --> <g transform="translate(344,78) scale(0.62)"> <ellipse cx="0" cy="2" rx="17" ry="3.2" fill="#2A1B0C" opacity=".26"/> <g fill="#A8241C"> <rect x="-12" y="-9" width="4.4" height="9" rx="1.8"/> <rect x="-6.5" y="-9" width="4.4" height="9" rx="1.8"/> <rect x="2" y="-9" width="4.4" height="9" rx="1.8"/> <rect x="7.5" y="-9" width="4.4" height="9" rx="1.8"/> </g> <path d="M-14 -14 q-5 -1.5 -6 -6.5 q5 0.5 7.5 4.5 z" fill="#A8241C"/> <path d="M-13.5 -9 v-9 q0 -3.5 4 -3.5 h10 q4 0 5 4 l2.5 -9.5 q1 -4 5 -4 h3.5 q1.5 2.5 1 5 l-1 5 q-0.5 2.5 -3 3.5 l-4.5 1.5 q-3 1 -4 4 v3.5 z" fill="#C8302F"/> <path d="M12.5 -32.5 l9 2 q2 0.6 1.6 2.6 l-0.6 3 q-0.4 2 -2.5 1.6 l-9 -1.6 z" fill="#C8302F"/> <path d="M20.5 -25.5 q2.6 0.4 2.8 2.2 q-2 1 -3.8 -0.4 z" fill="#8E1F18"/> <circle cx="17.5" cy="-28.5" r="1.1" fill="#2A1B0C"/> <path d="M12.8 -33 l0.4 -4 l3 3.2 z" fill="#C8302F"/> <path d="M16.6 -32.2 l2.6 -3.2 l0.6 3.8 z" fill="#C8302F"/> <path d="M7.5 -22 q2.4 -5.4 5.2 -9.4" stroke="#8E1F18" stroke-width="1.8" fill="none" opacity=".55" stroke-linecap="round"/> <g stroke="#F4D93C" stroke-width="1.3" fill="none" stroke-linecap="round"> <path d="M-10 -14 q5 -3 10 -0.5"/><path d="M-8 -10.5 q4.5 -2.5 9 -0.5"/></g> <g stroke="#2B7A4A" stroke-width="1.1" fill="none" stroke-linecap="round"> <path d="M-11 -17.5 q4 -2 8 -0.5"/><path d="M-3 -19.5 q3 -1.5 6 0.5"/></g> <g fill="#F7EEDC"> <circle cx="-6" cy="-17.5" r="1.5"/><circle cx="-1" cy="-16.5" r="1.3"/><circle cx="-9" cy="-12" r="1.2"/></g> <path d="M-6 -7.5 q4.5 -1.5 9 0" stroke="#2B4CA8" stroke-width="1.2" fill="none"/> </g> ';
  var FIREDEFS =
    '<linearGradient id="sky" x1="0.1" y1="0" x2="0.6" y2="1"><stop offset="0%" stop-color="#AFD8EF"/><stop offset="55%" stop-color="#D6ECF8"/><stop offset="100%" stop-color="#EFF8FD"/></linearGradient><linearGradient id="curt" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#8E7256"/><stop offset="35%" stop-color="#B49472"/><stop offset="62%" stop-color="#9A7B5C"/><stop offset="100%" stop-color="#7E6448"/></linearGradient><linearGradient id="stone" x1="0.1" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="#D3CCC0"/><stop offset="55%" stop-color="#ADA598"/><stop offset="100%" stop-color="#8B8377"/></linearGradient><radialGradient id="fireglow" cx="50%" cy="62%" r="52%"><stop offset="0%" stop-color="#FFB443" stop-opacity=".85"/><stop offset="60%" stop-color="#FF9A1F" stop-opacity=".35"/><stop offset="100%" stop-color="#FF9A1F" stop-opacity="0"/></radialGradient><linearGradient id="fl1" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#E8430A"/><stop offset="42%" stop-color="#FF8C14"/><stop offset="100%" stop-color="#FFE07A"/></linearGradient><linearGradient id="fl2" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#FF7A14"/><stop offset="58%" stop-color="#FFD45E"/><stop offset="100%" stop-color="#FFF8DC"/></linearGradient>';
  function roomSVG() {
    var wall = fWall(furnOf("wall")),
      floor = fFloor(furnOf("floor"));
    var fire = '<g transform="translate(270,92)">' + FIRESVG + "</g>";
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 270" class="roomsvg" preserveAspectRatio="xMidYMid slice">' +
      "<defs>" +
      wall.defs +
      floor.defs +
      FIREDEFS +
      '<radialGradient id="g-warm" cx="76%" cy="60%" r="66%"><stop offset="0%" stop-color="#FFC978" stop-opacity=".30"/>' +
      '<stop offset="100%" stop-color="#FFC978" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="g-vign" cx="50%" cy="46%" r="72%"><stop offset="55%" stop-color="#2A1B0C" stop-opacity="0"/>' +
      '<stop offset="100%" stop-color="#2A1B0C" stop-opacity=".30"/></radialGradient>' +
      '<linearGradient id="g-beam" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="#FFF6DC" stop-opacity=".5"/>' +
      '<stop offset="100%" stop-color="#FFF6DC" stop-opacity="0"/></linearGradient>' +
      "</defs>" +
      wall.body +
      fWallExtra(furnOf("wall")) +
      floor.body +
      WINDOWSVG +
      fView(furnOf("view")) +
      '<path d="M36 148 L128 148 L196 268 L60 268 Z" fill="url(#g-beam)" opacity=".45"/>' +
      (fArtExtra(furnOf("art")) || fArt(furnOf("art"))) +
      fShelf() +
      fire +
      fDiplomas() +
      MANTELSVG +
      (fRugExtra(furnOf("rug")) || fRug(furnOf("rug"))) +
      (fLeftExtra(furnOf("left")) || fLeft(furnOf("left"))) +
      (fRightExtra(furnOf("right")) || fRight(furnOf("right"))) +
      (fLampExtra(furnOf("lamp")) || fLamp(furnOf("lamp"))) +
      (fPlantExtra(furnOf("plant")) || fPlant(furnOf("plant"))) +
      fPet(furnOf("pet")) +
      '<rect width="400" height="270" fill="url(#g-warm)" style="pointer-events:none"/><rect width="400" height="270" fill="url(#g-vign)" style="pointer-events:none"/>' +
      "</svg>"
    );
  }

  /* ================= DIPLOM ================= */
  var DP = null;
  function dipGet(id) {
    return (S.diplomas || {})[id] || 0;
  }

  function dipStart(theme) {
    var pool = theme.words.slice(),
      q = [],
      i;
    pool = shuffle(pool);
    for (i = 0; i < Math.min(10, pool.length); i++) q.push(pool[i]);
    while (q.length < 10 && pool.length) q.push(pool[q.length % pool.length]);
    DP = { theme: theme, q: q, i: 0, right: 0, lock: false };
    dipRound();
  }
  function dipRound() {
    if (!DP) return;
    screen = "diplom";
    setNav("room");
    btnBack.hidden = false;
    if (DP.i >= DP.q.length) {
      dipEnd();
      return;
    }
    var w = DP.q[DP.i],
      all = allWords(),
      opts = [w],
      tries = 0,
      i;
    while (opts.length < 4 && tries < 120) {
      var c = all[(Math.random() * all.length) | 0];
      tries++;
      var dup = false;
      for (i = 0; i < opts.length; i++) if (opts[i].sv === c.sv) dup = true;
      if (!dup) opts.push(c);
    }
    opts = shuffle(opts);
    var listen = DP.i % 3 === 2;
    var html =
      '<div class="zone"><span>📜 <b>Diplom</b> · ' +
      esc(DP.theme.et) +
      "</span>" +
      "<span>" +
      (DP.i + 1) +
      " / " +
      DP.q.length +
      "</span></div>" +
      '<div class="odots">';
    for (i = 0; i < DP.q.length; i++) html += '<i class="' + (i < DP.i ? "on" : i === DP.i ? "now" : "") + '"></i>';
    html +=
      '</div><div class="card">' +
      (listen
        ? '<p class="q">Lyssna — vad betyder ordet?</p><div class="center">' +
          '<button class="speakbtn big" id="dsay" aria-label="Hör ordet">🔊</button></div>'
        : '<p class="q">Vad betyder</p><div class="bigword">' +
          esc(w.et) +
          "</div>" +
          '<div class="center"><button class="speakbtn sm" id="dsay" aria-label="Hör ordet">🔊</button></div>') +
      '<div class="opts">';
    for (i = 0; i < opts.length; i++)
      html += '<button class="opt" data-sv="' + esc(opts[i].sv) + '">' + esc(opts[i].sv) + "</button>";
    html += '</div><div class="feedback" id="dfb"></div></div>';
    app.innerHTML = html;
    if (listen) speak(w.et);
    document.getElementById("dsay").onclick = function () {
      speak(w.et);
    };
    var bs = app.querySelectorAll(".opt"),
      k;
    for (k = 0; k < bs.length; k++) {
      (function (el) {
        el.onclick = function () {
          if (DP.lock) return;
          DP.lock = true;
          var ok = el.getAttribute("data-sv") === w.sv,
            b2 = app.querySelectorAll(".opt"),
            q2;
          for (q2 = 0; q2 < b2.length; q2++) {
            b2[q2].disabled = true;
            if (b2[q2].getAttribute("data-sv") === w.sv) b2[q2].className = "opt right";
          }
          if (!ok) el.className = "opt wrong";
          var fb = document.getElementById("dfb");
          if (ok) {
            DP.right++;
            sndOk();
            if (fb) fb.innerHTML = '<b style="color:var(--moss)">Õige!</b>';
          } else {
            sndNo();
            if (fb) fb.innerHTML = "<b>" + esc(w.et) + " = " + esc(w.sv) + "</b>";
          }
          wmemHit(w.et, ok, "choose", w.sv);
          speak(w.et);
          setTimeout(function () {
            DP.i++;
            DP.lock = false;
            dipRound();
          }, 900);
        };
      })(bs[k]);
    }
  }
  function dipEnd() {
    var seals = DP.right >= 10 ? 3 : DP.right >= 8 ? 2 : DP.right >= 6 ? 1 : 0;
    var th = DP.theme,
      right = DP.right;
    if (!S.diplomas) S.diplomas = {};
    if (seals > (S.diplomas[th.id] || 0)) S.diplomas[th.id] = seals;
    autoBackup("diplom");
    var gain = 40 + right * 8;
    earnStars(gain);
    addXp(60);
    save();
    refreshTop();
    DP = null;
    burst(180);
    fanfare(seals >= 2 ? 3 : 2);
    app.innerHTML =
      '<div class="card" style="text-align:center"><p class="kicker">📜 Diplom</p>' +
      dipSVG(th, seals, S.name || "") +
      '<p class="qsub">' +
      right +
      " av 10 rätt · ⭐ +" +
      gain * starMult() +
      "</p>" +
      (seals < 3 ? '<p class="qsub">Gör om det när du vill — bästa resultatet räknas.</p>' : "") +
      '<div class="row"><button class="btn big" id="dagain">Gör om</button>' +
      '<button class="btn green" id="droom">Till rummet 🏠</button></div></div>';
    document.getElementById("dagain").onclick = function () {
      dipStart(th);
    };
    document.getElementById("droom").onclick = function () {
      S.roomTab = "diplom";
      save();
      go(roomScreen, true);
    };
  }
  function dipSVG(th, seals, name) {
    var col = seals >= 3 ? "#D9A52B" : seals >= 2 ? "#A8A8A8" : seals >= 1 ? "#C08A54" : "#CFC6B4";
    var s =
      '<svg viewBox="0 0 220 150" style="width:min(74vw,300px);height:auto;display:block;margin:0 auto">' +
      '<rect x="6" y="8" width="208" height="138" rx="5" fill="#2A1B0C" opacity=".14"/>' +
      '<rect x="2" y="4" width="208" height="138" rx="5" fill="#F7F1E2" stroke="' +
      col +
      '" stroke-width="4"/>' +
      '<rect x="10" y="12" width="192" height="122" rx="3" fill="none" stroke="' +
      col +
      '" stroke-width="1.4" opacity=".7"/>' +
      '<text x="106" y="40" text-anchor="middle" font-size="15" font-weight="800" fill="#4A3B2A">DIPLOM</text>' +
      '<text x="106" y="62" text-anchor="middle" font-size="12" fill="#6E5F4E">' +
      esc(name) +
      "</text>" +
      '<text x="106" y="84" text-anchor="middle" font-size="13" font-weight="700" fill="#2E4A34">' +
      esc(th.et) +
      "</text>" +
      '<text x="106" y="100" text-anchor="middle" font-size="10" fill="#6E5F4E">' +
      esc(th.sv) +
      "</text>" +
      "<g>";
    var i;
    for (i = 0; i < 3; i++) {
      var on = i < seals,
        x = 84 + i * 22;
      s +=
        '<circle cx="' +
        x +
        '" cy="118" r="9" fill="' +
        (on ? col : "#E6DECB") +
        '"/>' +
        '<text x="' +
        x +
        '" y="122" text-anchor="middle" font-size="10">' +
        (on ? "⭐" : "") +
        "</text>";
    }
    return s + '</g><text x="106" y="140" text-anchor="middle" font-size="7" fill="#9A8C78">Siilikool</text></svg>';
  }
  function roomScreen() {
    screen = "room";
    setNav("room");
    if (!S.roomTab) S.roomTab = "varv";
    if (!S.furnOwned) S.furnOwned = [];
    if (!S.room) S.room = {};
    var owned = S.owned || [],
      i,
      bySlot = {};
    for (i = 0; i < SHOP.length; i++) {
      if (owned.indexOf(SHOP[i].id) >= 0) {
        (bySlot[SHOP[i].slot] = bySlot[SHOP[i].slot] || []).push(SHOP[i]);
      }
    }
    var have = owned.length,
      total = SHOP.length;
    var img = (typeof window !== "undefined" && window.SIIRI_IMG) || "";

    var html =
      '<div class="zone market"><span class="zem">🏠</span><span><b>Siiri tuba</b>' +
      "<span>Siiris rum — hon är din, gör henne till din egen</span></span></div>";

    /* rummet: hylla, fönster och matta bakom henne */
    html +=
      '<div class="roomstage">' +
      roomSVG() +
      '<div class="rsiiri' +
      (roomFacing === "back" ? " turned" : "") +
      '" id="rdance" title="Tryck på Siiri för att vända på henne">' +
      '<div class="sflip">' +
      '<div class="sflipface sflipfront">' +
      siilSVG() +
      "</div>" +
      '<div class="sflipface sflipback">' +
      siilBackSVG() +
      "</div>" +
      "</div>" +
      "</div>" +
      (function () {
        if (hideFound()) return "";
        var t = hiddenToday();
        return (
          '<button class="hidething" id="hidebtn" style="left:' +
          t.spot.x +
          "%;top:" +
          t.spot.y +
          '%" aria-label="Något gömmer sig"><span>' +
          t.word.em +
          "</span></button>"
        );
      })() +
      '<div class="rlabel">' +
      esc(myFur().sv) +
      " päls · " +
      esc(myEye().sv) +
      " ögon · " +
      have +
      " av " +
      total +
      " saker</div>" +
      "</div>";
    html += hideFound()
      ? '<p class="note">🔍 Dagens sak hittad: <b>' +
        esc((S.hidelast || {}).et || "") +
        "</b> — " +
        esc((S.hidelast || {}).sv || "") +
        ". Ny sak imorgon!</p>"
      : '<p class="note">🔍 Något litet gömmer sig i rummet idag. Hittar du det?</p>';

    /* flikar */
    var tabs = [
      ["varv", "🎨", "Färg"],
      ["silmad", "👀", "Ögon"],
      ["riided", "👕", "Kläder"],
      ["sisu", "🛋️", "Möbler"],
      ["diplom", "📜", "Diplom"],
    ];
    html += '<div class="rtabs">';
    for (i = 0; i < tabs.length; i++) {
      html +=
        '<button class="rtab' +
        (S.roomTab === tabs[i][0] ? " on" : "") +
        '" data-tab="' +
        tabs[i][0] +
        '">' +
        "<span>" +
        tabs[i][1] +
        "</span><b>" +
        tabs[i][2] +
        "</b></button>";
    }
    html += "</div>";

    if (S.roomTab === "diplom") {
      html +=
        '<div class="card"><p class="kicker">📜 Diplomid · Diplom</p>' +
        '<p class="qsub">Tio frågor på ett tema. Du kan inte misslyckas — gör om när du vill, bästa resultatet räknas. ' +
        'Diplomen hänger på väggen i rummet.</p><div class="diprow">';
      var dq;
      for (dq = 0; dq < THEMES.length; dq++) {
        var th = THEMES[dq],
          seals = dipGet(th.id);
        html +=
          '<button class="dipbtn' +
          (seals ? " has" : "") +
          '" data-dip="' +
          th.id +
          '">' +
          '<span class="dem">' +
          th.em +
          "</span><b>" +
          esc(th.et) +
          "</b>" +
          "<small>" +
          esc(th.sv) +
          "</small>" +
          '<small class="seals">' +
          (seals ? "⭐".repeat(seals) : "gör diplom") +
          "</small></button>";
      }
      html += "</div></div>";
    }
    if (S.roomTab === "sisu") {
      html +=
        '<div class="card"><p class="kicker">Sisusta tuba · Möblera rummet</p>' +
        '<p class="qsub">Byt fritt mellan det du äger. Nytt köper du i marknaden under <b>Rummet</b>.</p>';
      var si, sj;
      for (si = 0; si < FURNSLOTS.length; si++) {
        var slot = FURNSLOTS[si][0],
          mine = FURN.filter(function (f) {
            return f.slot === slot && furnOwned(f.id);
          });
        html +=
          '<p class="q" style="text-align:left;margin-top:10px">' +
          FURNSLOTS[si][2] +
          " " +
          FURNSLOTS[si][1] +
          '</p><div class="furrow">';
        for (sj = 0; sj < mine.length; sj++) {
          html +=
            '<button class="furbtn' +
            (furnOf(slot) === mine[sj].id ? " on" : "") +
            '" data-furn="' +
            mine[sj].id +
            '">' +
            "<b>" +
            esc(mine[sj].sv) +
            "</b><small>" +
            esc(mine[sj].et) +
            "</small></button>";
        }
        var locked = FURN.filter(function (f) {
          return f.slot === slot && !furnOwned(f.id);
        }).length;
        if (locked) html += '<span class="furlock">🔒 ' + locked + " till i marknaden</span>";
        html += "</div>";
      }
      html += "</div>";
    }
    if (S.roomTab === "varv") {
      html +=
        '<div class="card"><p class="slotrow" style="margin-top:0">Karvavärv · Pälsfärg</p>' +
        '<p class="qsub" style="text-align:left">Färgen sätter sig på taggarna. Ansiktet och magen förblir gräddvita.</p>' +
        '<div class="furgrid">';
      for (i = 0; i < FURS.length; i++) {
        html +=
          '<button class="furbtn' +
          (myFur().id === FURS[i].id ? " on" : "") +
          '" data-fur="' +
          FURS[i].id +
          '">' +
          '<span class="fsw" style="background:' +
          (FURS[i].o ? FURS[i].c : "#F3EADB") +
          '"></span>' +
          "<b>" +
          esc(FURS[i].sv) +
          "</b><small>" +
          esc(FURS[i].et) +
          "</small></button>";
      }
      html += "</div></div>";
    } else if (S.roomTab === "silmad") {
      html +=
        '<div class="card"><p class="slotrow" style="margin-top:0">Silmavärv · Ögonfärg</p>' + '<div class="furgrid">';
      for (i = 0; i < EYES.length; i++) {
        html +=
          '<button class="furbtn' +
          (myEye().id === EYES[i].id ? " on" : "") +
          '" data-eye="' +
          EYES[i].id +
          '">' +
          '<span class="eyesw"><span style="background:' +
          EYES[i].c +
          '"></span></span>' +
          "<b>" +
          esc(EYES[i].sv) +
          "</b></button>";
      }
      html += "</div></div>";
    } else {
      if (!have) {
        html +=
          '<div class="card empty"><p>Garderoben är tom än. Allt du köper på marknaden hamnar här.</p>' +
          '<span class="pointer">🎪</span>' +
          '<button class="btn green wide" id="toshop3" style="margin-top:10px">Till marknaden</button></div>';
      }
      for (i = 0; i < SLOTS.length; i++) {
        var list = bySlot[SLOTS[i].id];
        if (!list || !list.length) continue;
        html +=
          '<div class="card"><p class="slotrow" style="margin-top:0">' + esc(SLOTS[i].sv) + '</p><div class="shelf">';
        for (var j = 0; j < list.length; j++) {
          var it = list[j],
            worn = wearing(it.slot) === it.id;
          html +=
            '<button class="shelfitem' +
            (worn ? " worn" : "") +
            '" data-wear="' +
            it.id +
            '">' +
            '<span class="em">' +
            it.em +
            '</span><b lang="et">' +
            esc(it.et) +
            "</b><small>" +
            esc(it.sv) +
            "</small>" +
            (worn ? '<small style="color:var(--moss)">på ✓</small>' : "") +
            "</button>";
        }
        html += "</div></div>";
      }
      if (have && have < total) html += '<p class="note">' + (total - have) + " saker väntar på marknaden.</p>";
      if (have === total) html += '<p class="note">Du äger allt som finns. Rummet är fullt!</p>';
    }
    app.innerHTML = html;

    var db = app.querySelectorAll("[data-dip]"),
      di;
    for (di = 0; di < db.length; di++) {
      (function (el) {
        el.onclick = function () {
          var id = el.getAttribute("data-dip"),
            t;
          for (var q = 0; q < THEMES.length; q++) if (THEMES[q].id === id) t = THEMES[q];
          if (t) dipStart(t);
        };
      })(db[di]);
    }
    var fb = app.querySelectorAll("[data-furn]"),
      fi;
    for (fi = 0; fi < fb.length; fi++) {
      (function (el) {
        el.onclick = function () {
          var id = el.getAttribute("data-furn"),
            f = furnById(id);
          if (!f) return;
          S.room[f.slot] = id;
          save();
          tone(720, 0.07, 0);
          roomScreen();
        };
      })(fb[fi]);
    }
    var hb = document.getElementById("hidebtn");
    if (hb)
      hb.onclick = function (e) {
        e.stopPropagation();
        findHidden();
      };
    var rd = document.getElementById("rdance");
    if (rd)
      rd.onclick = function () {
        roomFacing = roomFacing === "back" ? "front" : "back";
        tone(520, 0.08, 0);
        tone(720, 0.1, 0.07);
        /* CSS-flippen (backface-visibility) sköter själva vändningen, så vi
           byter bara klass - ett helt om-render skulle avbryta animationen */
        rd.classList.toggle("turned", roomFacing === "back");
      };
    var rp = document.getElementById("roompet");
    if (rp)
      rp.onclick = function (e) {
        e.stopPropagation();
        purr();
      };
    var tb = app.querySelectorAll("[data-tab]"),
      k;
    for (k = 0; k < tb.length; k++) {
      (function (el) {
        el.onclick = function () {
          S.roomTab = el.getAttribute("data-tab");
          save();
          tone(700, 0.06, 0);
          roomScreen();
        };
      })(tb[k]);
    }
    var fb2 = app.querySelectorAll("[data-fur]");
    for (k = 0; k < fb2.length; k++) {
      (function (el) {
        el.onclick = function () {
          S.fur = el.getAttribute("data-fur");
          save();
          tone(820, 0.08, 0);
          burst(24);
          roomScreen();
        };
      })(fb2[k]);
    }
    var eb = app.querySelectorAll("[data-eye]");
    for (k = 0; k < eb.length; k++) {
      (function (el) {
        el.onclick = function () {
          S.eye = el.getAttribute("data-eye");
          save();
          tone(900, 0.08, 0);
          roomScreen();
        };
      })(eb[k]);
    }
    var bs = app.querySelectorAll("[data-wear]");
    for (k = 0; k < bs.length; k++) {
      (function (el) {
        el.onclick = function () {
          var it = itemById(el.getAttribute("data-wear"));
          if (!it) return;
          S.wear[it.slot] = wearing(it.slot) === it.id ? null : it.id;
          save();
          applyScene();
          if (wearing(it.slot) === it.id) {
            speak(it.et);
            tone(760, 0.09, 0);
          } else tone(520, 0.09, 0);
          roomScreen();
        };
      })(bs[k]);
    }
    var ts = document.getElementById("toshop3");
    if (ts)
      ts.onclick = function () {
        go(shopScreen, true);
      };
  }

  /* ---------- VÄLJAKUTSE: barnet utmanar en vuxen ---------- */

  function chIntro() {
    screen = "chal";
    var last = (S.challenges || [])[0];
    app.innerHTML =
      '<div class="zone map"><span class="zem">🤝</span><span><b>Väljakutse</b>' +
      "<span>Utmana en vuxen — du väljer orden</span></span></div>" +
      '<div class="card"><p class="qsub" style="text-align:left">Du väljer sex ord. Sedan lämnar du över telefonen ' +
      "till en vuxen som får svara. Du ser hur det gick — och de får höra hur orden låter.</p>" +
      (function () {
        var l = (S.challenges || []).slice(0, 3),
          i,
          s2 = "";
        if (!l.length) return "";
        s2 = '<div class="card" style="margin-top:10px"><p class="q" style="text-align:left">Tidigare utmaningar</p>';
        for (i = 0; i < l.length; i++)
          s2 +=
            '<div class="wordrow"><span class="em">' +
            (l[i].em || "🧑") +
            "</span>" +
            '<span class="t"><b>' +
            esc(l[i].who) +
            "</b><span>" +
            l[i].score +
            " av " +
            l[i].total +
            "</span></span></div>";
        return s2 + "</div>";
      })() +
      '<div class="center">' +
      siilSVG("small") +
      "</div>" +
      '<button class="btn green big wide" id="pick">Välj sex ord →</button></div>';
    document.getElementById("pick").onclick = chWho;
  }
  var OPPONENTS = [
    { id: "ema", em: "👩", sv: "Mamma" },
    { id: "isa", em: "👨", sv: "Pappa" },
    { id: "vana", em: "👵", sv: "Mormor eller farmor" },
    { id: "muu", em: "🧑", sv: "Någon annan" },
  ];
  function chWho() {
    screen = "chal";
    var i,
      html =
        '<div class="zone map"><span class="zem">🤝</span><span><b>Väljakutse</b>' +
        '<span>Vem ska du utmana?</span></span></div><div class="card"><div class="whogrid">';
    for (i = 0; i < OPPONENTS.length; i++) {
      html +=
        '<button class="whobtn" data-who="' +
        OPPONENTS[i].id +
        '"><span class="wem">' +
        OPPONENTS[i].em +
        "</span>" +
        "<b>" +
        esc(OPPONENTS[i].sv) +
        "</b>" +
        (function () {
          var r = (S.chalTop || {})[OPPONENTS[i].id + ":lagom"];
          return r ? "<small>bästa: " + r + " av 6</small>" : "<small>har inte spelat än</small>";
        })() +
        "</button>";
    }
    html += "</div></div>";
    app.innerHTML = html;
    var bs = app.querySelectorAll("[data-who]"),
      k;
    for (k = 0; k < bs.length; k++) {
      (function (el) {
        el.onclick = function () {
          var id = el.getAttribute("data-who"),
            o;
          for (var q = 0; q < OPPONENTS.length; q++) if (OPPONENTS[q].id === id) o = OPPONENTS[q];
          CH = { words: [], all: pickWeighted(allWords(), 24), foe: o };
          chPickDraw();
        };
      })(bs[k]);
    }
  }
  function chPick() {
    chWho();
  }
  function chPickDraw() {
    screen = "chal";
    var i,
      html =
        '<div class="zone map"><span class="zem">🤝</span><span><b>Välj sex ord</b>' +
        "<span>" +
        CH.words.length +
        ' av 6 valda</span></span></div><div class="card"><div class="shelf">';
    for (i = 0; i < CH.all.length; i++) {
      var w = CH.all[i],
        on = CH.words.indexOf(w) >= 0;
      html +=
        '<button class="shelfitem' +
        (on ? " worn" : "") +
        '" data-pick="' +
        i +
        '">' +
        '<span class="em">' +
        wIcon(w) +
        "</span><b>" +
        esc(w.et) +
        "</b><small>" +
        esc(w.sv) +
        "</small></button>";
    }
    html += "</div></div>";
    if (CH.words.length === 6)
      html += '<button class="btn green big wide" id="ready">Klart – lämna över telefonen 📱</button>';
    else html += '<p class="note">Tryck på de ord du tror att en vuxen inte kan.</p>';
    app.innerHTML = html;
    var bs = app.querySelectorAll("[data-pick]"),
      k;
    for (k = 0; k < bs.length; k++) {
      (function (el) {
        el.onclick = function () {
          var w = CH.all[parseInt(el.getAttribute("data-pick"), 10)],
            at = CH.words.indexOf(w);
          if (at >= 0) CH.words.splice(at, 1);
          else if (CH.words.length < 6) {
            CH.words.push(w);
            speak(w.et);
          }
          tone(760, 0.07, 0);
          chPickDraw();
        };
      })(bs[k]);
    }
    var rd = document.getElementById("ready");
    if (rd) rd.onclick = chPickLevel;
  }
  var CHLEVELS = [
    { id: "latt", sv: "Lätt", em: "🙂", opts: 3, listen: 0, txt: "Tre svar, ordet syns" },
    { id: "lagom", sv: "Lagom", em: "🧐", opts: 4, listen: 0.5, txt: "Fyra svar, varannan fråga bara ljud" },
    { id: "svar", sv: "Svår", em: "😤", opts: 6, listen: 0.5, txt: "Sex svar, varannan fråga bara ljud" },
    {
      id: "proff",
      sv: "Expert",
      em: "🔥",
      opts: 6,
      listen: 1,
      txt: "Sex svar, allt bara ljud, tio sekunder per fråga",
      time: 10,
    },
  ];
  function chLevel() {
    var i,
      id = (CH && CH.lvl) || "lagom";
    for (i = 0; i < CHLEVELS.length; i++) if (CHLEVELS[i].id === id) return CHLEVELS[i];
    return CHLEVELS[1];
  }
  function chPickLevel() {
    screen = "chal";
    var i,
      html =
        '<div class="zone map"><span class="zem">🤝</span><span><b>Väljakutse</b>' +
        '<span>Hur svårt ska den vuxna ha det?</span></span></div><div class="card"><div class="lvlgrid">';
    for (i = 0; i < CHLEVELS.length; i++) {
      var L = CHLEVELS[i],
        best = (S.chalTop || {})[CH.foe.id + ":" + L.id];
      html +=
        '<button class="lvlbtn" data-lvl="' +
        L.id +
        '"><span class="wem">' +
        L.em +
        "</span>" +
        "<b>" +
        L.sv +
        "</b><small>" +
        esc(L.txt) +
        "</small>" +
        '<small class="rec">' +
        (best ? "bästa: " + best + " av 6" : "inte spelat än") +
        "</small></button>";
    }
    html += "</div></div>";
    app.innerHTML = html;
    var bs = app.querySelectorAll("[data-lvl]"),
      k;
    for (k = 0; k < bs.length; k++) {
      (function (el) {
        el.onclick = function () {
          CH.lvl = el.getAttribute("data-lvl");
          chHandover();
        };
      })(bs[k]);
    }
  }
  function chHandover() {
    screen = "chal";
    app.innerHTML =
      '<div class="card" style="text-align:center"><div style="font-size:64px">📱</div>' +
      '<p class="q">Lämna över telefonen</p>' +
      '<p class="qsub">Ge den till en vuxen. ' +
      (S.name ? esc(S.name) : "Barnet") +
      " har valt sex ord — vi får se hur det går.</p>" +
      '<div class="center">' +
      siilSVG("small") +
      "</div>" +
      '<button class="btn green big wide" id="go">Jag är den vuxna – kör!</button>' +
      '<button class="btn ghost wide" id="back2" style="margin-top:8px">Välj andra ord</button></div>';
    document.getElementById("go").onclick = function () {
      CH.i = 0;
      CH.score = 0;
      CH.log = [];
      chRound();
    };
    document.getElementById("back2").onclick = chPick;
  }
  function chRound() {
    if (!CH) return;
    if (CH.i >= CH.words.length) {
      chEnd();
      return;
    }
    var L = chLevel();
    var w = CH.words[CH.i],
      all = allWords(),
      opts = [w],
      i,
      tries = 0;
    var listen = L.listen >= 1 ? true : L.listen > 0 ? CH.i % 2 === 1 : false;
    while (opts.length < L.opts && tries < 160) {
      var c = all[(Math.random() * all.length) | 0];
      tries++;
      var dup = false;
      for (i = 0; i < opts.length; i++) if (opts[i].sv === c.sv) dup = true;
      if (!dup) opts.push(c);
    }
    opts = shuffle(opts);
    var html =
      '<div class="zone map"><span class="zem">🤝</span><span><b>Fråga ' +
      (CH.i + 1) +
      " av 6</b>" +
      "<span>" +
      CH.score +
      " rätt hittills</span></span></div>" +
      '<div class="card">' +
      (listen
        ? '<p class="q">Lyssna — vad betyder ordet?</p>' +
          '<div class="center"><button class="speakbtn big" id="say" aria-label="Hör ordet">🔊</button></div>'
        : '<p class="q">Vad betyder</p><div class="bigword">' +
          esc(w.et) +
          "</div>" +
          '<div class="center"><button class="speakbtn sm" id="say" aria-label="Hör ordet">🔊</button></div>') +
      '<div class="opts">';
    for (i = 0; i < opts.length; i++)
      html += '<button class="opt" data-sv="' + esc(opts[i].sv) + '">' + esc(opts[i].sv) + "</button>";
    html += '</div><div class="feedback" id="fb"></div></div>';
    app.innerHTML = html;
    if (listen) speak(w.et);
    document.getElementById("say").onclick = function () {
      speak(w.et);
    };
    chStopTimer();
    if (L.time) {
      var left = L.time,
        bar = document.createElement("div");
      bar.className = "chtime";
      bar.innerHTML = "<i></i><span>" + left + "</span>";
      app.querySelector(".card").insertBefore(bar, app.querySelector(".opts"));
      var tid = setInterval(function () {
        var el = app.querySelector(".chtime");
        if (!CH || !el) {
          clearInterval(tid);
          return;
        } /* utmaningen är slut */
        left--;
        el.querySelector("span").textContent = Math.max(0, left);
        el.querySelector("i").style.width = Math.max(0, (left / L.time) * 100) + "%";
        if (left <= 0) {
          clearInterval(tid);
          if (CH) CH.timer = null;
          chTimeout();
        }
      }, 1000);
      CH.timer = tid;
    }
    var bs = app.querySelectorAll(".opt"),
      k;
    for (k = 0; k < bs.length; k++) {
      (function (el) {
        el.onclick = function () {
          chStopTimer();
          var ok = el.getAttribute("data-sv") === w.sv,
            b2 = app.querySelectorAll(".opt"),
            q;
          for (q = 0; q < b2.length; q++) {
            b2[q].disabled = true;
            if (b2[q].getAttribute("data-sv") === w.sv) b2[q].className = "opt right";
          }
          if (!ok) el.className = "opt wrong";
          if (ok) CH.score++;
          CH.log.push({ w: w, ok: ok });
          speak(w.et);
          var fb = document.getElementById("fb");
          fb.className = "feedback " + (ok ? "ok" : "no");
          fb.textContent = ok ? "Rätt!" : w.et + " = " + w.sv;
          CH.i++;
          setTimeout(function () {
            if (CH) chRound();
          }, 900);
        };
      })(bs[k]);
    }
  }
  function chStopTimer() {
    if (CH && CH.timer) {
      clearInterval(CH.timer);
      CH.timer = null;
    }
  }
  function chTimeout() {
    if (!CH) return;
    var fb = document.getElementById("fb");
    if (fb) fb.innerHTML = '<b style="color:var(--berry)">Tiden är ute!</b>';
    CH.log.push({ w: CH.words[CH.i], ok: false });
    CH.i++;
    setTimeout(function () {
      chRound();
    }, 900);
  }
  function chEnd() {
    chStopTimer();
    var s = CH.score,
      n = CH.words.length,
      i;
    var who = s >= 6 ? "Mästaren!" : s >= 4 ? "Ganska bra" : s >= 2 ? "Lite kämpigt" : "Oj då";
    var foe = CH.foe || { em: "🧑", sv: "Den vuxna", id: "muu" };
    if (!S.chalTop) S.chalTop = {};
    if (s > (S.chalTop[foe.id] || 0)) S.chalTop[foe.id] = s;
    if (!S.challenges) S.challenges = [];
    S.challenges.unshift({ who: foe.sv, em: foe.em, score: s, total: n, day: today() });
    S.challenges = S.challenges.slice(0, 5);
    var gain = 10 + s * 4;
    earnStars(gain);
    addXp(20);
    save();
    refreshTop();
    burst(s >= 5 ? 180 : 120);
    var tricked = [],
      ti;
    for (ti = 0; ti < CH.log.length; ti++) if (!CH.log[ti].ok) tricked.push(CH.log[ti].w);
    var html =
      '<div class="card" style="text-align:center"><div style="font-size:56px">' +
      (CH.foe ? CH.foe.em : "🧑") +
      "</div>" +
      '<div class="bigscore">' +
      s +
      " / " +
      n +
      '</div><p class="q">' +
      esc(CH.foe ? CH.foe.sv : "Den vuxna") +
      ": " +
      esc(who) +
      "</p>" +
      (tricked.length
        ? '<p class="qsub">Du lurade dem med ' + tricked.length + " ord!</p>"
        : '<p class="qsub">Alla rätt — nästa gång får du välja svårare ord.</p>') +
      '<div class="center">' +
      siilSVG("small") +
      "</div>" +
      '<p class="qsub">Du fick ⭐ ' +
      gain * starMult() +
      " för att du lärde ut orden.</p></div>" +
      '<div class="card"><p class="q" style="text-align:left">Så gick det</p>';
    for (i = 0; i < CH.log.length; i++) {
      html +=
        '<div class="wordrow"><span class="em">' +
        (CH.log[i].ok ? "✅" : "❌") +
        "</span>" +
        '<span class="t"><b>' +
        esc(CH.log[i].w.et) +
        "</b><span>" +
        esc(CH.log[i].w.sv) +
        "</span></span>" +
        '<button class="speakbtn sm" data-say="' +
        esc(CH.log[i].w.et) +
        '" aria-label="Hör ordet">🔊</button></div>';
    }
    html +=
      '</div><div class="row"><button class="btn green big" id="again">Utmana igen 🤝</button>' +
      '<button class="btn ghost big" id="home">Tillbaka</button></div>';
    app.innerHTML = html;
    CH = null;
    mood("cheer");
    var sb = app.querySelectorAll("[data-say]"),
      k;
    for (k = 0; k < sb.length; k++) {
      (function (el) {
        el.onclick = function () {
          speak(el.getAttribute("data-say"));
        };
      })(sb[k]);
    }
    document.getElementById("again").onclick = chWho;
    document.getElementById("home").onclick = function () {
      go(homeScreen, false);
    };
  }

  var SCENE =
    '<svg viewBox="0 0 400 270" class="otsiscene" preserveAspectRatio="xMidYMid meet"><defs> <linearGradient id="o-wall" x1="0" y1="0" x2="0.2" y2="1"> <stop offset="0%" stop-color="#F3E8D2"/><stop offset="100%" stop-color="#DCCBAC"/></linearGradient> <linearGradient id="o-floor" x1="0" y1="0" x2="0" y2="1"> <stop offset="0%" stop-color="#C79A68"/><stop offset="100%" stop-color="#9A7043"/></linearGradient> <linearGradient id="o-wood" x1="0" y1="0" x2="0" y2="1"> <stop offset="0%" stop-color="#C08A52"/><stop offset="100%" stop-color="#8A5E30"/></linearGradient> <linearGradient id="o-sky" x1="0" y1="0" x2="0.4" y2="1"> <stop offset="0%" stop-color="#AFD8EF"/><stop offset="100%" stop-color="#EAF6FC"/></linearGradient> <radialGradient id="o-vign" cx="50%" cy="46%" r="72%"> <stop offset="60%" stop-color="#2A1B0C" stop-opacity="0"/><stop offset="100%" stop-color="#2A1B0C" stop-opacity=".22"/></radialGradient> </defs><rect width="400" height="196" fill="url(#o-wall)"/><rect x="0" y="0" width="1.3" height="196" fill="#000" opacity=".035"/><rect x="26" y="0" width="1.3" height="196" fill="#000" opacity=".035"/><rect x="52" y="0" width="1.3" height="196" fill="#000" opacity=".035"/><rect x="78" y="0" width="1.3" height="196" fill="#000" opacity=".035"/><rect x="104" y="0" width="1.3" height="196" fill="#000" opacity=".035"/><rect x="130" y="0" width="1.3" height="196" fill="#000" opacity=".035"/><rect x="156" y="0" width="1.3" height="196" fill="#000" opacity=".035"/><rect x="182" y="0" width="1.3" height="196" fill="#000" opacity=".035"/><rect x="208" y="0" width="1.3" height="196" fill="#000" opacity=".035"/><rect x="234" y="0" width="1.3" height="196" fill="#000" opacity=".035"/><rect x="260" y="0" width="1.3" height="196" fill="#000" opacity=".035"/><rect x="286" y="0" width="1.3" height="196" fill="#000" opacity=".035"/><rect x="312" y="0" width="1.3" height="196" fill="#000" opacity=".035"/><rect x="338" y="0" width="1.3" height="196" fill="#000" opacity=".035"/><rect x="364" y="0" width="1.3" height="196" fill="#000" opacity=".035"/><rect x="390" y="0" width="1.3" height="196" fill="#000" opacity=".035"/><rect y="196" width="400" height="74" fill="url(#o-floor)"/><path d="M-204 196 L-567.5999999999999 270" stroke="#3A2410" stroke-width="1.2" opacity=".15"/><path d="M-170 196 L-503.0 270" stroke="#3A2410" stroke-width="1.2" opacity=".15"/><path d="M-136 196 L-438.4 270" stroke="#3A2410" stroke-width="1.2" opacity=".15"/><path d="M-102 196 L-373.79999999999995 270" stroke="#3A2410" stroke-width="1.2" opacity=".15"/><path d="M-68 196 L-309.2 270" stroke="#3A2410" stroke-width="1.2" opacity=".15"/><path d="M-34 196 L-244.59999999999997 270" stroke="#3A2410" stroke-width="1.2" opacity=".15"/><path d="M0 196 L-180.0 270" stroke="#3A2410" stroke-width="1.2" opacity=".15"/><path d="M34 196 L-115.39999999999998 270" stroke="#3A2410" stroke-width="1.2" opacity=".15"/><path d="M68 196 L-50.79999999999998 270" stroke="#3A2410" stroke-width="1.2" opacity=".15"/><path d="M102 196 L13.800000000000011 270" stroke="#3A2410" stroke-width="1.2" opacity=".15"/><path d="M136 196 L78.4 270" stroke="#3A2410" stroke-width="1.2" opacity=".15"/><path d="M170 196 L143.0 270" stroke="#3A2410" stroke-width="1.2" opacity=".15"/><path d="M204 196 L207.6 270" stroke="#3A2410" stroke-width="1.2" opacity=".15"/><path d="M238 196 L272.2 270" stroke="#3A2410" stroke-width="1.2" opacity=".15"/><path d="M272 196 L336.79999999999995 270" stroke="#3A2410" stroke-width="1.2" opacity=".15"/><path d="M306 196 L401.4 270" stroke="#3A2410" stroke-width="1.2" opacity=".15"/><path d="M340 196 L466.0 270" stroke="#3A2410" stroke-width="1.2" opacity=".15"/><path d="M374 196 L530.5999999999999 270" stroke="#3A2410" stroke-width="1.2" opacity=".15"/><path d="M408 196 L595.2 270" stroke="#3A2410" stroke-width="1.2" opacity=".15"/><path d="M442 196 L659.8 270" stroke="#3A2410" stroke-width="1.2" opacity=".15"/><rect y="193" width="400" height="8" fill="#2A1B0C" opacity=".20"/><g transform="translate(28,34)"> <rect x="-7" y="-7" width="98" height="104" rx="5" fill="#B08A5E"/> <rect x="0" y="0" width="84" height="90" fill="url(#o-sky)"/> <ellipse cx="22" cy="22" rx="16" ry="8" fill="#fff" opacity=".8"/> <path d="M0 64 q16 -12 30 -4 q14 8 26 -2 q12 -8 28 2 v30 H0 z" fill="#7BA76C" opacity=".9"/> <path d="M42 0 V90 M0 45 H84" stroke="#B08A5E" stroke-width="6"/> <rect x="0" y="0" width="84" height="90" fill="none" stroke="#8A6A40" stroke-width="2"/> <path d="M4 4 L30 4 L4 30 Z" fill="#fff" opacity=".2"/> <rect x="-14" y="90" width="112" height="9" rx="3" fill="#C49A66"/> <rect x="-14" y="90" width="112" height="3" fill="#EBC593" opacity=".8"/> </g><rect x="0" y="150" width="400" height="46" fill="#EADCC0"/><rect x="0" y="147" width="400" height="5" rx="2.5" fill="#D9C8AB"/><rect x="0" y="147" width="400" height="2" fill="#FFF6E6" opacity=".8"/><rect x="12" y="158" width="48" height="30" rx="3" fill="none" stroke="#C6B294" stroke-width="1.8"/><rect x="14" y="160" width="44" height="26" rx="2" fill="none" stroke="#FFF6E6" stroke-width="1" opacity=".5"/><rect x="76" y="158" width="48" height="30" rx="3" fill="none" stroke="#C6B294" stroke-width="1.8"/><rect x="78" y="160" width="44" height="26" rx="2" fill="none" stroke="#FFF6E6" stroke-width="1" opacity=".5"/><rect x="140" y="158" width="48" height="30" rx="3" fill="none" stroke="#C6B294" stroke-width="1.8"/><rect x="142" y="160" width="44" height="26" rx="2" fill="none" stroke="#FFF6E6" stroke-width="1" opacity=".5"/><rect x="204" y="158" width="48" height="30" rx="3" fill="none" stroke="#C6B294" stroke-width="1.8"/><rect x="206" y="160" width="44" height="26" rx="2" fill="none" stroke="#FFF6E6" stroke-width="1" opacity=".5"/><rect x="268" y="158" width="48" height="30" rx="3" fill="none" stroke="#C6B294" stroke-width="1.8"/><rect x="270" y="160" width="44" height="26" rx="2" fill="none" stroke="#FFF6E6" stroke-width="1" opacity=".5"/><rect x="332" y="158" width="48" height="30" rx="3" fill="none" stroke="#C6B294" stroke-width="1.8"/><rect x="334" y="160" width="44" height="26" rx="2" fill="none" stroke="#FFF6E6" stroke-width="1" opacity=".5"/><rect x="396" y="158" width="48" height="30" rx="3" fill="none" stroke="#C6B294" stroke-width="1.8"/><rect x="398" y="160" width="44" height="26" rx="2" fill="none" stroke="#FFF6E6" stroke-width="1" opacity=".5"/><rect x="0" y="190" width="400" height="6" fill="#B9A585"/><g transform="translate(160,58)"> <rect x="0" y="22" width="96" height="7" rx="2.5" fill="url(#o-wood)"/> <rect x="0" y="22" width="96" height="2" fill="#E0BC8E" opacity=".8"/> <path d="M0 29 h96 l-4 4 h-88 z" fill="#2A1B0C" opacity=".2"/> <path d="M8 29 h10 l-3 7 h-4 z M78 29 h10 l-3 7 h-4 z" fill="#7A5230"/> </g><g transform="translate(288,40)"> <rect x="3" y="4" width="70" height="52" rx="3" fill="#2A1B0C" opacity=".2"/> <rect x="0" y="0" width="70" height="52" rx="3" fill="#8A6238"/> <rect x="5" y="5" width="60" height="42" fill="#EAF2F6"/> <path d="M5 33 q14 -12 26 -2 q10 8 20 -3 q8 -8 14 -1 v18 H5 z" fill="#8FBE7E"/> <circle cx="52" cy="17" r="7" fill="#F6D24A" opacity=".9"/> <rect x="5" y="5" width="60" height="42" fill="none" stroke="#6E4E2A" stroke-width="1"/> </g><g transform="translate(366,168)"> <ellipse cx="0" cy="34" rx="20" ry="5" fill="#2A1B0C" opacity=".24"/> <path d="M0 14 q-14 -6 -17 -22 q16 2 19 18 z" fill="#4E8A52"/> <path d="M3 14 q14 -9 15 -25 q-16 5 -17 22 z" fill="#69A86A"/> <path d="M1 16 q-3 -16 -1 -26" stroke="#3E6E42" stroke-width="1.6" fill="none"/> <path d="M-12 14 h26 l-4 20 h-18 z" fill="#C06A4A"/> <path d="M-12 14 h26 l-1 5 h-24 z" fill="#E08A66"/> </g><g transform="translate(212,150)"> <ellipse cx="60" cy="72" rx="72" ry="10" fill="#2A1B0C" opacity=".22"/> <rect x="0" y="0" width="120" height="11" rx="4" fill="url(#o-wood)"/> <rect x="0" y="0" width="120" height="3.4" rx="1.7" fill="#E0BC8E" opacity=".85"/> <rect x="8" y="11" width="9" height="60" rx="3" fill="#8A5E30"/> <rect x="103" y="11" width="9" height="60" rx="3" fill="#8A5E30"/> <rect x="8" y="11" width="3" height="60" fill="#C08A52" opacity=".6"/> <rect x="103" y="11" width="3" height="60" fill="#C08A52" opacity=".6"/> </g><g transform="translate(116,140)"> <ellipse cx="26" cy="82" rx="32" ry="8" fill="#2A1B0C" opacity=".22"/> <rect x="4" y="-2" width="44" height="9" rx="3.5" fill="#9E6B38"/> <rect x="4" y="12" width="44" height="7" rx="3" fill="#9E6B38"/> <rect x="2" y="-4" width="8" height="30" rx="3" fill="#8A5E30"/> <rect x="42" y="-4" width="8" height="30" rx="3" fill="#8A5E30"/> <rect x="0" y="26" width="54" height="10" rx="4" fill="url(#o-wood)"/> <rect x="0" y="26" width="54" height="3" rx="1.5" fill="#E0BC8E" opacity=".8"/> <rect x="3" y="36" width="8" height="46" rx="3" fill="#8A5E30"/> <rect x="43" y="36" width="8" height="46" rx="3" fill="#8A5E30"/> </g><path d="M30 150 L118 150 L182 268 L52 268 Z" fill="#FFF6DC" opacity=".22"/><ellipse cx="150" cy="240" rx="86" ry="21" fill="#B8566A"/><ellipse cx="150" cy="239" rx="66" ry="16" fill="#E0CDAC"/><ellipse cx="150" cy="238" rx="42" ry="10" fill="#A8465C"/><rect width="400" height="270" fill="url(#o-vign)"/></svg>';

  var SCENE_AED =
    '<svg viewBox="0 0 400 270" class="otsiscene" preserveAspectRatio="xMidYMid meet"><defs> <linearGradient id="a-sky" x1="0" y1="0" x2="0.2" y2="1"> <stop offset="0%" stop-color="#9FD2EF"/><stop offset="60%" stop-color="#CDE9F7"/><stop offset="100%" stop-color="#EAF6FC"/></linearGradient> <linearGradient id="a-grass" x1="0" y1="0" x2="0" y2="1"> <stop offset="0%" stop-color="#8CC27A"/><stop offset="55%" stop-color="#6FA862"/><stop offset="100%" stop-color="#528948"/></linearGradient> <linearGradient id="a-wood" x1="0" y1="0" x2="0" y2="1"> <stop offset="0%" stop-color="#C08A52"/><stop offset="100%" stop-color="#8A5E30"/></linearGradient> <radialGradient id="a-vign" cx="50%" cy="46%" r="72%"> <stop offset="60%" stop-color="#1B2A0C" stop-opacity="0"/><stop offset="100%" stop-color="#1B2A0C" stop-opacity=".2"/></radialGradient> </defs><rect width="400" height="150" fill="url(#a-sky)"/><circle cx="340" cy="38" r="22" fill="#FFE58A"/><circle cx="340" cy="38" r="30" fill="#FFE58A" opacity=".28"/><ellipse cx="80" cy="42" rx="30" ry="12" fill="#fff" opacity=".9"/><ellipse cx="104" cy="36" rx="20" ry="10" fill="#fff" opacity=".85"/><ellipse cx="210" cy="30" rx="24" ry="9" fill="#fff" opacity=".7"/><path d="M0 150 q60 -34 120 -6 q50 24 90 -8 q50 -38 110 -2 q40 22 80 6 v30 H0 z" fill="#79A96A"/><rect y="150" width="400" height="120" fill="url(#a-grass)"/><g><rect x="8" y="124" width="9" height="40" rx="3" fill="#D8C09A"/><rect x="8" y="124" width="3" height="40" fill="#F0DEBE"/><path d="M8 124 l4.5 -6 l4.5 6 z" fill="#C9AE86"/><rect x="34" y="124" width="9" height="40" rx="3" fill="#D8C09A"/><rect x="34" y="124" width="3" height="40" fill="#F0DEBE"/><path d="M34 124 l4.5 -6 l4.5 6 z" fill="#C9AE86"/><rect x="60" y="124" width="9" height="40" rx="3" fill="#D8C09A"/><rect x="60" y="124" width="3" height="40" fill="#F0DEBE"/><path d="M60 124 l4.5 -6 l4.5 6 z" fill="#C9AE86"/><rect x="86" y="124" width="9" height="40" rx="3" fill="#D8C09A"/><rect x="86" y="124" width="3" height="40" fill="#F0DEBE"/><path d="M86 124 l4.5 -6 l4.5 6 z" fill="#C9AE86"/><rect x="112" y="124" width="9" height="40" rx="3" fill="#D8C09A"/><rect x="112" y="124" width="3" height="40" fill="#F0DEBE"/><path d="M112 124 l4.5 -6 l4.5 6 z" fill="#C9AE86"/><rect x="138" y="124" width="9" height="40" rx="3" fill="#D8C09A"/><rect x="138" y="124" width="3" height="40" fill="#F0DEBE"/><path d="M138 124 l4.5 -6 l4.5 6 z" fill="#C9AE86"/><rect x="164" y="124" width="9" height="40" rx="3" fill="#D8C09A"/><rect x="164" y="124" width="3" height="40" fill="#F0DEBE"/><path d="M164 124 l4.5 -6 l4.5 6 z" fill="#C9AE86"/><rect x="190" y="124" width="9" height="40" rx="3" fill="#D8C09A"/><rect x="190" y="124" width="3" height="40" fill="#F0DEBE"/><path d="M190 124 l4.5 -6 l4.5 6 z" fill="#C9AE86"/><rect x="216" y="124" width="9" height="40" rx="3" fill="#D8C09A"/><rect x="216" y="124" width="3" height="40" fill="#F0DEBE"/><path d="M216 124 l4.5 -6 l4.5 6 z" fill="#C9AE86"/><rect x="242" y="124" width="9" height="40" rx="3" fill="#D8C09A"/><rect x="242" y="124" width="3" height="40" fill="#F0DEBE"/><path d="M242 124 l4.5 -6 l4.5 6 z" fill="#C9AE86"/><rect x="268" y="124" width="9" height="40" rx="3" fill="#D8C09A"/><rect x="268" y="124" width="3" height="40" fill="#F0DEBE"/><path d="M268 124 l4.5 -6 l4.5 6 z" fill="#C9AE86"/><rect x="294" y="124" width="9" height="40" rx="3" fill="#D8C09A"/><rect x="294" y="124" width="3" height="40" fill="#F0DEBE"/><path d="M294 124 l4.5 -6 l4.5 6 z" fill="#C9AE86"/><rect x="320" y="124" width="9" height="40" rx="3" fill="#D8C09A"/><rect x="320" y="124" width="3" height="40" fill="#F0DEBE"/><path d="M320 124 l4.5 -6 l4.5 6 z" fill="#C9AE86"/><rect x="346" y="124" width="9" height="40" rx="3" fill="#D8C09A"/><rect x="346" y="124" width="3" height="40" fill="#F0DEBE"/><path d="M346 124 l4.5 -6 l4.5 6 z" fill="#C9AE86"/><rect x="372" y="124" width="9" height="40" rx="3" fill="#D8C09A"/><rect x="372" y="124" width="3" height="40" fill="#F0DEBE"/><path d="M372 124 l4.5 -6 l4.5 6 z" fill="#C9AE86"/><rect x="398" y="124" width="9" height="40" rx="3" fill="#D8C09A"/><rect x="398" y="124" width="3" height="40" fill="#F0DEBE"/><path d="M398 124 l4.5 -6 l4.5 6 z" fill="#C9AE86"/><rect x="0" y="134" width="400" height="6" fill="#C9AE86"/><rect x="0" y="150" width="400" height="6" fill="#C9AE86"/></g><g transform="translate(74,96)"> <ellipse cx="0" cy="92" rx="34" ry="8" fill="#2A3A14" opacity=".22"/> <rect x="-8" y="30" width="16" height="62" rx="4" fill="#8A5E30"/> <path d="M-8 60 q-12 -8 -16 -20 q14 2 18 14 z" fill="#8A5E30"/> <circle cx="0" cy="14" r="34" fill="#4E8A52"/><circle cx="-26" cy="32" r="22" fill="#5CA05E"/> <circle cx="26" cy="32" r="22" fill="#3E7A46"/><circle cx="0" cy="36" r="24" fill="#4E8A52"/> <circle cx="-10" cy="4" r="10" fill="#6CB46E" opacity=".5"/> <circle cx="-18" cy="26" r="4" fill="#D64B3F"/><circle cx="14" cy="18" r="4" fill="#D64B3F"/> </g><g transform="translate(212,176)"> <ellipse cx="46" cy="54" rx="56" ry="8" fill="#2A3A14" opacity=".24"/> <rect x="0" y="0" width="92" height="9" rx="3" fill="url(#a-wood)"/> <rect x="0" y="0" width="92" height="3" fill="#E0BC8E" opacity=".8"/> <rect x="0" y="-16" width="92" height="7" rx="3" fill="#B07C48"/> <rect x="4" y="-24" width="7" height="24" fill="#8A5E30"/><rect x="81" y="-24" width="7" height="24" fill="#8A5E30"/> <rect x="8" y="9" width="8" height="34" rx="3" fill="#8A5E30"/><rect x="76" y="9" width="8" height="34" rx="3" fill="#8A5E30"/> </g><g><g transform="translate(130,232)"><path d="M0 0 v-16" stroke="#3E7A46" stroke-width="2.4"/><circle cx="0" cy="-20" r="5" fill="#E86A8A"/><circle cx="-6" cy="-16" r="5" fill="#E86A8A"/><circle cx="6" cy="-16" r="5" fill="#E86A8A"/><circle cx="0" cy="-12" r="5" fill="#E86A8A"/><circle cx="0" cy="-16" r="3" fill="#FFF3C4"/></g><g transform="translate(146,232)"><path d="M0 0 v-16" stroke="#3E7A46" stroke-width="2.4"/><circle cx="0" cy="-20" r="5" fill="#F6D24A"/><circle cx="-6" cy="-16" r="5" fill="#F6D24A"/><circle cx="6" cy="-16" r="5" fill="#F6D24A"/><circle cx="0" cy="-12" r="5" fill="#F6D24A"/><circle cx="0" cy="-16" r="3" fill="#FFF3C4"/></g><g transform="translate(162,232)"><path d="M0 0 v-16" stroke="#3E7A46" stroke-width="2.4"/><circle cx="0" cy="-20" r="5" fill="#C8A0E2"/><circle cx="-6" cy="-16" r="5" fill="#C8A0E2"/><circle cx="6" cy="-16" r="5" fill="#C8A0E2"/><circle cx="0" cy="-12" r="5" fill="#C8A0E2"/><circle cx="0" cy="-16" r="3" fill="#FFF3C4"/></g><g transform="translate(178,232)"><path d="M0 0 v-16" stroke="#3E7A46" stroke-width="2.4"/><circle cx="0" cy="-20" r="5" fill="#E86A8A"/><circle cx="-6" cy="-16" r="5" fill="#E86A8A"/><circle cx="6" cy="-16" r="5" fill="#E86A8A"/><circle cx="0" cy="-12" r="5" fill="#E86A8A"/><circle cx="0" cy="-16" r="3" fill="#FFF3C4"/></g><g transform="translate(348,232)"><path d="M0 0 v-16" stroke="#3E7A46" stroke-width="2.4"/><circle cx="0" cy="-20" r="5" fill="#F6D24A"/><circle cx="-6" cy="-16" r="5" fill="#F6D24A"/><circle cx="6" cy="-16" r="5" fill="#F6D24A"/><circle cx="0" cy="-12" r="5" fill="#F6D24A"/><circle cx="0" cy="-16" r="3" fill="#FFF3C4"/></g><g transform="translate(366,232)"><path d="M0 0 v-16" stroke="#3E7A46" stroke-width="2.4"/><circle cx="0" cy="-20" r="5" fill="#C8A0E2"/><circle cx="-6" cy="-16" r="5" fill="#C8A0E2"/><circle cx="6" cy="-16" r="5" fill="#C8A0E2"/><circle cx="0" cy="-12" r="5" fill="#C8A0E2"/><circle cx="0" cy="-16" r="3" fill="#FFF3C4"/></g></g><rect width="400" height="270" fill="url(#a-vign)"/></svg>';
  var SCENE_KOOK =
    '<svg viewBox="0 0 400 270" class="otsiscene" preserveAspectRatio="xMidYMid meet"><defs> <linearGradient id="k-wall" x1="0" y1="0" x2="0.2" y2="1"> <stop offset="0%" stop-color="#F4EFE2"/><stop offset="100%" stop-color="#DCD2BE"/></linearGradient> <linearGradient id="k-counter" x1="0" y1="0" x2="0" y2="1"> <stop offset="0%" stop-color="#E4DACA"/><stop offset="100%" stop-color="#C2B49C"/></linearGradient> <linearGradient id="k-cab" x1="0" y1="0" x2="0.3" y2="1"> <stop offset="0%" stop-color="#7FA9B8"/><stop offset="100%" stop-color="#55808F"/></linearGradient> <linearGradient id="k-floor" x1="0" y1="0" x2="0" y2="1"> <stop offset="0%" stop-color="#D8CDBA"/><stop offset="100%" stop-color="#B0A389"/></linearGradient> <radialGradient id="k-vign" cx="50%" cy="46%" r="72%"> <stop offset="60%" stop-color="#2A1B0C" stop-opacity="0"/><stop offset="100%" stop-color="#2A1B0C" stop-opacity=".2"/></radialGradient> </defs><rect width="400" height="214" fill="url(#k-wall)"/><rect x="1" y="97" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="25" y="97" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="49" y="97" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="73" y="97" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="97" y="97" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="121" y="97" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="145" y="97" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="169" y="97" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="193" y="97" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="217" y="97" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="241" y="97" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="265" y="97" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="289" y="97" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="313" y="97" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="337" y="97" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="361" y="97" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="385" y="97" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="1" y="115" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="25" y="115" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="49" y="115" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="73" y="115" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="97" y="115" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="121" y="115" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="145" y="115" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="169" y="115" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="193" y="115" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="217" y="115" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="241" y="115" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="265" y="115" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="289" y="115" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="313" y="115" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="337" y="115" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="361" y="115" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="385" y="115" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="1" y="133" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="25" y="133" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="49" y="133" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="73" y="133" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="97" y="133" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="121" y="133" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="145" y="133" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="169" y="133" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="193" y="133" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="217" y="133" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="241" y="133" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="265" y="133" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="289" y="133" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="313" y="133" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="337" y="133" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="361" y="133" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect x="385" y="133" width="22" height="16" rx="2" fill="#FBF7EE" opacity=".8"/><rect y="214" width="400" height="56" fill="url(#k-floor)"/><path d="M0 214 L-120.0 270" stroke="#8A7D63" stroke-width="1" opacity=".25"/><path d="M50 214 L-40.0 270" stroke="#8A7D63" stroke-width="1" opacity=".25"/><path d="M100 214 L40.0 270" stroke="#8A7D63" stroke-width="1" opacity=".25"/><path d="M150 214 L120.0 270" stroke="#8A7D63" stroke-width="1" opacity=".25"/><path d="M200 214 L200.0 270" stroke="#8A7D63" stroke-width="1" opacity=".25"/><path d="M250 214 L280.0 270" stroke="#8A7D63" stroke-width="1" opacity=".25"/><path d="M300 214 L360.0 270" stroke="#8A7D63" stroke-width="1" opacity=".25"/><path d="M350 214 L440.0 270" stroke="#8A7D63" stroke-width="1" opacity=".25"/><path d="M400 214 L520.0 270" stroke="#8A7D63" stroke-width="1" opacity=".25"/><g><rect x="16" y="24" width="150" height="64" rx="4" fill="url(#k-cab)"/><rect x="22" y="30" width="64" height="52" rx="3" fill="#8FB8C6"/><rect x="94" y="30" width="64" height="52" rx="3" fill="#8FB8C6"/><circle cx="82" cy="56" r="3" fill="#F2E8D4"/><circle cx="98" cy="56" r="3" fill="#F2E8D4"/><rect x="16" y="86" width="150" height="5" rx="2" fill="#44697A"/></g><g><rect x="0" y="150" width="260" height="12" rx="3" fill="url(#k-counter)"/><rect x="0" y="150" width="260" height="4" fill="#F2EADA"/><rect x="0" y="162" width="260" height="52" fill="#6E99A8"/><rect x="10" y="170" width="70" height="38" rx="3" fill="#8FB8C6"/><rect x="90" y="170" width="70" height="38" rx="3" fill="#8FB8C6"/><rect x="170" y="170" width="70" height="38" rx="3" fill="#8FB8C6"/><circle cx="78" cy="189" r="3" fill="#F2E8D4"/><circle cx="158" cy="189" r="3" fill="#F2E8D4"/></g><g transform="translate(176,150)"><rect x="0" y="0" width="84" height="12" rx="3" fill="#B8B0A2"/><circle cx="22" cy="6" r="7" fill="#5E5A52"/><circle cx="44" cy="6" r="7" fill="#5E5A52"/><circle cx="66" cy="6" r="5" fill="#5E5A52"/><rect x="0" y="12" width="84" height="52" fill="#9A938A"/><rect x="8" y="20" width="68" height="34" rx="3" fill="#3E3A34"/><rect x="12" y="24" width="60" height="26" rx="2" fill="#6E675E" opacity=".6"/></g><g transform="translate(300,96)"><rect x="0" y="0" width="76" height="118" rx="6" fill="#E8E2D6"/><rect x="0" y="0" width="76" height="40" rx="6" fill="#F2EDE2"/><rect x="0" y="42" width="76" height="76" rx="6" fill="#F2EDE2"/><rect x="60" y="12" width="5" height="18" rx="2.5" fill="#A8A092"/><rect x="60" y="54" width="5" height="22" rx="2.5" fill="#A8A092"/><rect x="6" y="54" width="22" height="16" rx="2" fill="#F6D24A" opacity=".7"/></g><g transform="translate(16,150)"><rect x="0" y="2" width="54" height="9" rx="3" fill="#C2BAAA"/><rect x="4" y="4" width="46" height="6" rx="2" fill="#A8A092"/><path d="M26 2 v-14 q0 -6 10 -6 h8" stroke="#A8A092" stroke-width="3" fill="none"/></g><rect width="400" height="270" fill="url(#k-vign)"/></svg>';
  var SCENE_TURG =
    '<svg viewBox="0 0 400 270" class="otsiscene" preserveAspectRatio="xMidYMid meet"><defs> <linearGradient id="t-sky" x1="0" y1="0" x2="0.2" y2="1"> <stop offset="0%" stop-color="#BBDDF2"/><stop offset="100%" stop-color="#EDF6FB"/></linearGradient> <linearGradient id="t-stone" x1="0" y1="0" x2="0" y2="1"> <stop offset="0%" stop-color="#C9C0B2"/><stop offset="100%" stop-color="#A3998A"/></linearGradient> <linearGradient id="t-tent" x1="0" y1="0" x2="0" y2="1"> <stop offset="0%" stop-color="#E8705E"/><stop offset="100%" stop-color="#C04A3C"/></linearGradient> <linearGradient id="t-wood" x1="0" y1="0" x2="0" y2="1"> <stop offset="0%" stop-color="#C08A52"/><stop offset="100%" stop-color="#8A5E30"/></linearGradient> <radialGradient id="t-vign" cx="50%" cy="46%" r="72%"> <stop offset="60%" stop-color="#2A1B0C" stop-opacity="0"/><stop offset="100%" stop-color="#2A1B0C" stop-opacity=".2"/></radialGradient> </defs><rect width="400" height="186" fill="url(#t-sky)"/><rect x="0" y="116" width="46" height="70" fill="#E8C98E"/><path d="M-3 116 h52 l-6 -10 h-40 z" fill="#8A5E44"/><rect x="8" y="130" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="27" y="130" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="8" y="152" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="27" y="152" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="8" y="174" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="27" y="174" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="52" y="100" width="46" height="86" fill="#D8A38A"/><path d="M49 100 h52 l-6 -10 h-40 z" fill="#8A5E44"/><rect x="60" y="114" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="79" y="114" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="60" y="136" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="79" y="136" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="60" y="158" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="79" y="158" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="104" y="122" width="46" height="64" fill="#C9D2A8"/><path d="M101 122 h52 l-6 -10 h-40 z" fill="#8A5E44"/><rect x="112" y="136" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="131" y="136" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="112" y="158" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="131" y="158" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="150" y="94" width="46" height="92" fill="#E8C98E"/><path d="M147 94 h52 l-6 -10 h-40 z" fill="#8A5E44"/><rect x="158" y="108" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="177" y="108" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="158" y="130" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="177" y="130" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="158" y="152" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="177" y="152" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="158" y="174" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="177" y="174" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="206" y="114" width="46" height="72" fill="#B9C8D8"/><path d="M203 114 h52 l-6 -10 h-40 z" fill="#8A5E44"/><rect x="214" y="128" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="233" y="128" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="214" y="150" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="233" y="150" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="214" y="172" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="233" y="172" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="252" y="98" width="46" height="88" fill="#D8A38A"/><path d="M249 98 h52 l-6 -10 h-40 z" fill="#8A5E44"/><rect x="260" y="112" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="279" y="112" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="260" y="134" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="279" y="134" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="260" y="156" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="279" y="156" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="260" y="178" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="279" y="178" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="306" y="120" width="46" height="66" fill="#E8C98E"/><path d="M303 120 h52 l-6 -10 h-40 z" fill="#8A5E44"/><rect x="314" y="134" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="333" y="134" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="314" y="156" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="333" y="156" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="314" y="178" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="333" y="178" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="352" y="106" width="46" height="80" fill="#C9D2A8"/><path d="M349 106 h52 l-6 -10 h-40 z" fill="#8A5E44"/><rect x="360" y="120" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="379" y="120" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="360" y="142" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="379" y="142" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="360" y="164" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect x="379" y="164" width="11" height="13" rx="2" fill="#F6EFD8" opacity=".85"/><rect y="186" width="400" height="84" fill="url(#t-stone)"/><ellipse cx="-28" cy="190" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="0" cy="190" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="28" cy="190" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="56" cy="190" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="84" cy="190" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="112" cy="190" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="140" cy="190" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="168" cy="190" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="196" cy="190" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="224" cy="190" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="252" cy="190" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="280" cy="190" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="308" cy="190" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="336" cy="190" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="364" cy="190" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="392" cy="190" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="420" cy="190" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="-14" cy="207" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="14" cy="207" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="42" cy="207" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="70" cy="207" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="98" cy="207" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="126" cy="207" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="154" cy="207" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="182" cy="207" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="210" cy="207" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="238" cy="207" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="266" cy="207" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="294" cy="207" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="322" cy="207" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="350" cy="207" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="378" cy="207" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="406" cy="207" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="434" cy="207" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="-28" cy="224" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="0" cy="224" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="28" cy="224" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="56" cy="224" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="84" cy="224" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="112" cy="224" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="140" cy="224" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="168" cy="224" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="196" cy="224" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="224" cy="224" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="252" cy="224" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="280" cy="224" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="308" cy="224" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="336" cy="224" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="364" cy="224" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="392" cy="224" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="420" cy="224" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="-14" cy="241" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="14" cy="241" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="42" cy="241" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="70" cy="241" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="98" cy="241" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="126" cy="241" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="154" cy="241" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="182" cy="241" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="210" cy="241" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="238" cy="241" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="266" cy="241" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="294" cy="241" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="322" cy="241" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="350" cy="241" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="378" cy="241" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="406" cy="241" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="434" cy="241" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="-28" cy="258" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="0" cy="258" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="28" cy="258" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="56" cy="258" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="84" cy="258" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="112" cy="258" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="140" cy="258" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="168" cy="258" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="196" cy="258" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="224" cy="258" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="252" cy="258" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="280" cy="258" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="308" cy="258" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="336" cy="258" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="364" cy="258" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="392" cy="258" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><ellipse cx="420" cy="258" rx="12" ry="6" fill="#B8AE9E" stroke="#978D7E" stroke-width="1"/><g transform="translate(40,88)"> <rect x="4" y="30" width="7" height="86" fill="#8A5E30"/><rect x="129" y="30" width="7" height="86" fill="#8A5E30"/> <path d="M-6 32 L70 2 L146 32 z" fill="url(#t-tent)"/> <path d="M-6 32 h152 l-6 10 h-140 z" fill="#B8402E"/> <g fill="#F7EEDC"><path d="M-2 42 h18 l-9 10 z"/><path d="M20 42 h18 l-9 10 z"/><path d="M42 42 h18 l-9 10 z"/><path d="M64 42 h18 l-9 10 z"/><path d="M86 42 h18 l-9 10 z"/><path d="M108 42 h18 l-9 10 z"/><path d="M130 42 h18 l-9 10 z"/></g> <rect x="-4" y="76" width="148" height="12" rx="3" fill="url(#t-wood)"/> <rect x="-4" y="76" width="148" height="4" fill="#E0BC8E" opacity=".8"/> <rect x="-4" y="88" width="148" height="30" fill="#A8713C"/> <g stroke="#8A5E30" stroke-width="1.4" opacity=".6"><path d="M20 88 v30 M60 88 v30 M100 88 v30"/></g> </g><g transform="translate(224,214)"> <ellipse cx="22" cy="26" rx="28" ry="6" fill="#2A1B0C" opacity=".22"/> <path d="M0 0 h44 l-5 24 h-34 z" fill="#C9A06A"/> <path d="M0 0 h44 l-1.4 6 h-41.2 z" fill="#E0BC8E"/> <g stroke="#A8824E" stroke-width="1.2" opacity=".6"><path d="M11 6 v18 M22 6 v18 M33 6 v18"/></g> </g> <g transform="translate(296,206)"> <ellipse cx="28" cy="36" rx="34" ry="7" fill="#2A1B0C" opacity=".22"/> <rect x="0" y="0" width="56" height="34" rx="3" fill="#B98A54"/> <rect x="0" y="0" width="56" height="7" rx="3" fill="#D8A86A"/> <g stroke="#8A5E30" stroke-width="1.4" opacity=".55"><path d="M14 7 v27 M28 7 v27 M42 7 v27"/></g> </g><rect width="400" height="270" fill="url(#t-vign)"/></svg>';
  /* fyra platser med egna möbler, prepositioner och ord */
  var OSCENES = [
    {
      id: "tuba",
      sv: "Siiris rum",
      et: "Tuba",
      svg: null,
      spots: [
        { id: "riiul", et: "riiuli peal", sv: "på hyllan", x: [178, 238], y: 80 },
        { id: "laudP", et: "laua peal", sv: "på bordet", x: [226, 314], y: 150 },
        { id: "laudA", et: "laua all", sv: "under bordet", x: [234, 304], y: 214 },
        { id: "tool", et: "tooli peal", sv: "på stolen", x: [126, 158], y: 166 },
        { id: "toolA", et: "tooli all", sv: "under stolen", x: [128, 156], y: 220 },
        { id: "aken", et: "akna juures", sv: "vid fönstret", x: [30, 92], y: 124 },
        { id: "aknaP", et: "akna peal", sv: "på fönsterbrädan", x: [38, 84], y: 124 },
        { id: "vaip", et: "vaiba peal", sv: "på mattan", x: [114, 188], y: 240 },
        { id: "porand", et: "põrandal", sv: "på golvet", x: [300, 344], y: 252 },
      ],
      objs: ["raamat", "pall", "müts", "kruus", "lill", "õun", "auto", "kott", "pliiats", "võti", "kell", "täht"],
    },
    {
      id: "aed",
      sv: "Trädgården",
      et: "Aed",
      svg: "AED",
      spots: [
        { id: "puuA", et: "puu all", sv: "under trädet", x: [52, 96], y: 196 },
        { id: "pink", et: "pingi peal", sv: "på bänken", x: [224, 296], y: 176 },
        { id: "pinkA", et: "pingi all", sv: "under bänken", x: [230, 290], y: 228 },
        { id: "aia", et: "aia juures", sv: "vid staketet", x: [300, 376], y: 168 },
        { id: "muru", et: "muru peal", sv: "på gräset", x: [120, 210], y: 250 },
        { id: "lille", et: "lille kõrval", sv: "bredvid blomman", x: [188, 206], y: 234 },
      ],
      objs: ["pall", "õun", "lill", "lind", "kala", "kivi", "seen", "puu", "kott", "müts", "täht", "auto"],
    },
    {
      id: "kook",
      sv: "Köket",
      et: "Köök",
      svg: "KOOK",
      spots: [
        { id: "lett", et: "leti peal", sv: "på bänken", x: [88, 172], y: 150 },
        { id: "kapi", et: "kapi peal", sv: "på skåpet", x: [46, 150], y: 23 },
        { id: "pliit", et: "pliidi peal", sv: "på spisen", x: [204, 248], y: 147 },
        { id: "kraan", et: "kraanikausis", sv: "i diskhon", x: [26, 62], y: 152 },
        { id: "kylm", et: "külmkapi kõrval", sv: "bredvid kylen", x: [288, 296], y: 218 },
        { id: "porand2", et: "põrandal", sv: "på golvet", x: [120, 240], y: 252 },
      ],
      objs: ["kruus", "õun", "kook", "jäätis", "kala", "lill", "seen", "pall", "kell", "raamat", "võti", "täht"],
    },
    {
      id: "turg",
      sv: "Torget",
      et: "Turg",
      svg: "TURG",
      spots: [
        { id: "lettT", et: "leti peal", sv: "på disken", x: [48, 172], y: 164 },
        { id: "telgi", et: "telgi all", sv: "under tältet", x: [60, 160], y: 206 },
        { id: "korvi", et: "korvi sees", sv: "i korgen", x: [236, 262], y: 214 },
        { id: "kasti", et: "kasti peal", sv: "på lådan", x: [306, 344], y: 206 },
        { id: "kivi2", et: "maas", sv: "på marken", x: [196, 230], y: 252 },
        { id: "kastiK", et: "kasti kõrval", sv: "bredvid lådan", x: [366, 380], y: 246 },
      ],
      objs: ["õun", "kook", "lill", "kott", "müts", "kruus", "raamat", "täht", "seen", "kala", "pall", "jäätis"],
    },
  ];
  function otsiScene() {
    var i = (OT && OT.round) || 0;
    return OSCENES[Math.floor(i / 2) % OSCENES.length];
  }
  function sceneSVG(sc) {
    if (!sc.svg) return SCENE;
    return sc.svg === "AED" ? SCENE_AED : sc.svg === "KOOK" ? SCENE_KOOK : SCENE_TURG;
  }
  /* ============ OTSI! — hitta det Siiri säger ============ */
  var OT = null;
  var OBJ = [
    { id: "raamat", et: "raamat", sv: "bok", def: "boken", g: "en" },
    { id: "pall", et: "pall", sv: "boll", def: "bollen", g: "en" },
    { id: "müts", et: "müts", sv: "mössa", def: "mössan", g: "en" },
    { id: "kruus", et: "kruus", sv: "mugg", def: "muggen", g: "en" },
    { id: "lill", et: "lill", sv: "blomma", def: "blomman", g: "en" },
    { id: "õun", et: "õun", sv: "äpple", def: "äpplet", g: "ett" },
    { id: "auto", et: "auto", sv: "bil", def: "bilen", g: "en" },
    { id: "kala", et: "kala", sv: "fisk", def: "fisken", g: "en" },
    { id: "lind", et: "lind", sv: "fågel", def: "fågeln", g: "en" },
    { id: "täht", et: "täht", sv: "stjärna", def: "stjärnan", g: "en" },
    { id: "maja", et: "maja", sv: "hus", def: "huset", g: "ett" },
    { id: "kott", et: "kott", sv: "väska", def: "väskan", g: "en" },
    { id: "pliiats", et: "pliiats", sv: "penna", def: "pennan", g: "en" },
    { id: "võti", et: "võti", sv: "nyckel", def: "nyckeln", g: "en" },
    { id: "kell", et: "kell", sv: "klocka", def: "klockan", g: "en" },
    { id: "kook", et: "kook", sv: "tårta", def: "tårtan", g: "en" },
    { id: "seen", et: "seen", sv: "svamp", def: "svampen", g: "en" },
    { id: "kivi", et: "kivi", sv: "sten", def: "stenen", g: "en" },
    { id: "jäätis", et: "jäätis", sv: "glass", def: "glassen", g: "en" },
    { id: "puu", et: "puu", sv: "träd", def: "trädet", g: "ett" },
  ];
  var OCOL = [
    { id: "punane", sv: "röd", t: "rött", b: "röda", c: "#D6453F", d: "#A32E2A" },
    { id: "sinine", sv: "blå", t: "blått", b: "blåa", c: "#3A72C8", d: "#27509A" },
    { id: "kollane", sv: "gul", t: "gult", b: "gula", c: "#E8B62C", d: "#B98A16" },
    { id: "roheline", sv: "grön", t: "grönt", b: "gröna", c: "#4E9A5C", d: "#367040" },
    { id: "must", sv: "svart", t: "svart", b: "svarta", c: "#3C3936", d: "#211F1D" },
    { id: "valge", sv: "vit", t: "vitt", b: "vita", c: "#F4EFE4", d: "#C9C0AE" },
  ];
  function svDef(col, obj) {
    return (obj.g === "ett" ? "det " : "den ") + col.b + " " + obj.def;
  }
  function svInd(col, obj) {
    return obj.g + " " + (obj.g === "ett" ? col.t : col.sv) + " " + obj.sv;
  }
  var OSPOT = [
    { id: "riiul", et: "riiuli peal", sv: "på hyllan", x: [178, 238], y: 80 },
    { id: "laudP", et: "laua peal", sv: "på bordet", x: [226, 314], y: 150 },
    { id: "laudA", et: "laua all", sv: "under bordet", x: [234, 304], y: 214 },
    { id: "tool", et: "tooli peal", sv: "på stolen", x: [126, 158], y: 166 },
    { id: "aken", et: "akna juures", sv: "vid fönstret", x: [30, 92], y: 124 },
    { id: "vaip", et: "vaiba peal", sv: "på mattan", x: [114, 188], y: 240 },
    { id: "toolA", et: "tooli all", sv: "under stolen", x: [128, 156], y: 220 },
    { id: "aknaP", et: "akna peal", sv: "på fönsterbrädan", x: [38, 84], y: 124 },
    { id: "porand", et: "põrandal", sv: "på golvet", x: [300, 344], y: 252 },
    { id: "laudK", et: "laua kõrval", sv: "bredvid bordet", x: [338, 352], y: 218 },
    { id: "aknaA", et: "akna all", sv: "under fönstret", x: [34, 88], y: 186 },
  ];
  function otsiDraw(it, i) {
    var c = it.col.c,
      d = it.col.d,
      x = it.x,
      y = it.y,
      g;
    if (it.obj.id === "raamat") {
      g =
        '<path d="M-15 -16 q7 -3 14 0 v16 q-7 -3 -14 0 z" fill="' +
        c +
        '"/>' +
        '<path d="M15 -16 q-7 -3 -14 0 v16 q7 -3 14 0 z" fill="' +
        d +
        '"/>' +
        '<path d="M-13.5 -14 q6 -2.6 12 0 v12.6 q-6 -2.6 -12 0 z" fill="#FBF6EA"/>' +
        '<path d="M13.5 -14 q-6 -2.6 -12 0 v12.6 q6 -2.6 12 0 z" fill="#F2EADA"/>' +
        '<g stroke="#C4B9A2" stroke-width="1" stroke-linecap="round">' +
        '<path d="M-11 -10 h7 M-11 -6.6 h7 M-11 -3.2 h5 M4 -10 h7 M4 -6.6 h7 M4 -3.2 h5"/></g>' +
        '<path d="M0 -16.6 v16.6" stroke="' +
        d +
        '" stroke-width="2"/>';
    } else if (it.obj.id === "pall") {
      g =
        '<circle cx="0" cy="-11" r="11" fill="' +
        c +
        '"/>' +
        '<path d="M-11 -11 q11 -7 22 0 q-11 7 -22 0 z" fill="' +
        d +
        '" opacity=".55"/>' +
        '<ellipse cx="-4" cy="-15" rx="4" ry="3" fill="#fff" opacity=".45"/>';
    } else if (it.obj.id === "müts") {
      g =
        '<path d="M-12 -4 q-1 -18 12 -18 q13 0 12 18 z" fill="' +
        c +
        '"/>' +
        '<path d="M-10 -8 q-1 -12 10 -12 q4 0 6 2 q-9 1 -11 10 z" fill="#fff" opacity=".18"/>' +
        '<g stroke="' +
        d +
        '" stroke-width="1.6" opacity=".7" fill="none">' +
        '<path d="M-6.5 -19 q-0.5 8 -0.5 15"/><path d="M0 -20 v15"/><path d="M6.5 -19 q0.5 8 0.5 15"/></g>' +
        '<path d="M-15 -5 h30 q2 0 2 2.6 v2.4 q0 2 -2 2 h-30 q-2 0 -2 -2 v-2.4 q0 -2.6 2 -2.6 z" fill="#F7EEDC"/>' +
        '<path d="M-15 -2.4 h30" stroke="' +
        d +
        '" stroke-width="1" opacity=".35"/>' +
        '<circle cx="0" cy="-23" r="4.6" fill="#F7EEDC"/>' +
        '<circle cx="-1.4" cy="-24.4" r="1.6" fill="#fff" opacity=".8"/>';
    } else if (it.obj.id === "kruus") {
      g =
        '<path d="M-9 -18 h18 l-2 18 h-14 z" fill="' +
        c +
        '"/>' +
        '<path d="M9 -15 q7 1 7 6 q0 5 -7 6 v-3 q4 -1 4 -3 q0 -2 -4 -3 z" fill="' +
        d +
        '"/>' +
        '<ellipse cx="0" cy="-18" rx="9" ry="2.6" fill="' +
        d +
        '"/>' +
        '<rect x="-6" y="-15" width="3" height="10" rx="1.5" fill="#fff" opacity=".35"/>';
    } else if (it.obj.id === "lill") {
      g =
        '<path d="M0 0 v-12" stroke="#4E8A52" stroke-width="2.2"/>' +
        '<path d="M0 -6 q-6 -3 -8 -8 q6 0 8 5 z" fill="#5CA05E"/>' +
        '<g fill="' +
        c +
        '"><circle cx="0" cy="-19" r="4.4"/><circle cx="-6" cy="-15" r="4.4"/>' +
        '<circle cx="6" cy="-15" r="4.4"/><circle cx="-4" cy="-23" r="4.4"/><circle cx="4" cy="-23" r="4.4"/></g>' +
        '<circle cx="0" cy="-19" r="3.4" fill="#F6D24A"/>';
    } else if (it.obj.id === "auto") {
      g =
        '<path d="M-15 -6 q1 -7 6 -7 h4 l3 -5 h8 l2 5 h4 q5 0 6 7 v6 h-33 z" fill="' +
        c +
        '"/>' +
        '<path d="M-6 -12 h7 l1.4 5 h-10 z" fill="#CFE6F5" opacity=".85"/>' +
        '<circle cx="-8" cy="0" r="4" fill="#33312E"/><circle cx="-8" cy="0" r="1.8" fill="#9A9690"/>' +
        '<circle cx="9" cy="0" r="4" fill="#33312E"/><circle cx="9" cy="0" r="1.8" fill="#9A9690"/>' +
        '<rect x="-15" y="-6.6" width="30" height="2.4" fill="' +
        d +
        '"/>';
    } else if (it.obj.id === "kala") {
      g =
        '<path d="M-14 -10 q9 -8 18 0 q-9 8 -18 0 z" fill="' +
        c +
        '"/>' +
        '<path d="M4 -10 q7 -6 10 -1 q-3 5 -10 1 z" fill="' +
        d +
        '"/>' +
        '<circle cx="-8" cy="-11" r="1.6" fill="#231F1C"/>' +
        '<path d="M-6 -13 q5 3 9 0" stroke="' +
        d +
        '" stroke-width="1.2" fill="none"/>';
    } else if (it.obj.id === "lind") {
      g =
        '<ellipse cx="0" cy="-9" rx="10" ry="8" fill="' +
        c +
        '"/>' +
        '<circle cx="7" cy="-15" r="5.4" fill="' +
        c +
        '"/>' +
        '<path d="M11 -15 l6 2 l-6 2 z" fill="#E8A62C"/>' +
        '<circle cx="8.4" cy="-16.4" r="1.3" fill="#231F1C"/>' +
        '<path d="M-3 -10 q7 -4 10 2 q-7 4 -10 -2 z" fill="' +
        d +
        '"/>' +
        '<path d="M-10 -8 l-6 -3 l3 6 z" fill="' +
        d +
        '"/>' +
        '<path d="M-2 -1 v3 M3 -1 v3" stroke="#E8A62C" stroke-width="1.6"/>';
    } else if (it.obj.id === "täht") {
      g =
        '<path d="M0 -24 l4.6 9.4 l10.4 1.5 l-7.5 7.3 l1.8 10.3 L0 -0.4 l-9.3 4.9 l1.8 -10.3 l-7.5 -7.3 l10.4 -1.5 z" fill="' +
        c +
        '"/>' +
        '<path d="M0 -24 l4.6 9.4 l-4.6 2 z" fill="#fff" opacity=".35"/>';
    } else if (it.obj.id === "maja") {
      g =
        '<rect x="-11" y="-13" width="22" height="13" fill="' +
        c +
        '"/>' +
        '<path d="M-14 -13 L0 -24 L14 -13 z" fill="' +
        d +
        '"/>' +
        '<rect x="-4" y="-8" width="8" height="8" fill="#6E4A28"/>' +
        '<rect x="-9" y="-11" width="5" height="4" fill="#CFE6F5"/>' +
        '<rect x="5" y="-11" width="5" height="4" fill="#CFE6F5"/>';
    } else if (it.obj.id === "kott") {
      g =
        '<path d="M-11 -13 q0 -3 3 -3 h16 q3 0 3 3 l1.6 13 h-25.2 z" fill="' +
        c +
        '"/>' +
        '<path d="M-11.6 -13 q0 -5 5 -5 h13.2 q5 0 5 5 v5 q0 2 -2 2 h-19.2 q-2 0 -2 -2 z" fill="' +
        d +
        '"/>' +
        '<rect x="-3" y="-8" width="6" height="5" rx="1.4" fill="#F2E8D4"/>' +
        '<path d="M-6 -18 q0 -6 6 -6 q6 0 6 6" stroke="' +
        d +
        '" stroke-width="2.4" fill="none"/>' +
        '<rect x="-7" y="-4" width="14" height="4" rx="1.6" fill="#fff" opacity=".28"/>';
    } else if (it.obj.id === "pliiats") {
      g =
        '<path d="M-3 -22 h6 v17 h-6 z" fill="' +
        c +
        '"/>' +
        '<path d="M-3 -5 h6 l-3 5 z" fill="#E8C79A"/>' +
        '<path d="M-1.2 -1.6 h2.4 l-1.2 1.6 z" fill="#3A2A1E"/>' +
        '<rect x="-3" y="-24" width="6" height="2.4" fill="' +
        d +
        '"/>' +
        '<rect x="-3" y="-22" width="1.8" height="17" fill="#fff" opacity=".28"/>';
    } else if (it.obj.id === "kell") {
      g =
        '<circle cx="0" cy="-12" r="11" fill="' +
        c +
        '"/><circle cx="0" cy="-12" r="8.4" fill="#F7F2E6"/>' +
        '<path d="M0 -12 v-6 M0 -12 l4.4 3" stroke="#33312E" stroke-width="1.6" stroke-linecap="round"/>' +
        '<circle cx="0" cy="-12" r="1.3" fill="#33312E"/>' +
        '<rect x="-2" y="-25" width="4" height="3" rx="1.4" fill="' +
        d +
        '"/>';
    } else if (it.obj.id === "kook") {
      g =
        '<ellipse cx="0" cy="0" rx="16" ry="4" fill="#E6DECB"/>' +
        '<path d="M-13 -3 h26 v-7 h-26 z" fill="' +
        d +
        '"/>' +
        '<path d="M-13 -10 h26 v-7 h-26 z" fill="' +
        c +
        '"/>' +
        '<path d="M-13 -17 q6.5 4 13 0 q6.5 -4 13 0 v-4 q-6.5 -4 -13 0 q-6.5 4 -13 0 z" fill="#F7EEDC"/>' +
        '<path d="M-13 -10 h26" stroke="#F7EEDC" stroke-width="1.6" opacity=".7"/>' +
        '<path d="M0 -21 v-5" stroke="#E8C79A" stroke-width="2.4"/>' +
        '<path d="M0 -26 q2.4 2.4 0 4.6 q-2.4 -2.2 0 -4.6" fill="#F6D24A"/>' +
        '<circle cx="-7" cy="-19.6" r="1.6" fill="#D6453F"/><circle cx="7" cy="-19.6" r="1.6" fill="#D6453F"/>';
    } else if (it.obj.id === "seen") {
      g =
        '<path d="M-4 0 q-1 -9 0 -11 h8 q1 2 0 11 z" fill="#F2E7D2"/>' +
        '<path d="M-13 -11 q0 -11 13 -11 q13 0 13 11 z" fill="' +
        c +
        '"/>' +
        '<g fill="#F7EEDC" opacity=".85"><circle cx="-6" cy="-15" r="2.4"/><circle cx="4" cy="-17" r="2"/>' +
        '<circle cx="8" cy="-13" r="1.6"/></g>';
    } else if (it.obj.id === "kivi") {
      g =
        '<path d="M-13 0 L-9 -9 L-2 -13 L7 -11 L13 -3 L11 0 Z" fill="' +
        c +
        '"/>' +
        '<path d="M-9 -9 L-2 -13 L1 -5 Z" fill="#fff" opacity=".22"/>' +
        '<path d="M1 -5 L7 -11 L13 -3 Z" fill="' +
        d +
        '" opacity=".55"/>' +
        '<path d="M-13 0 L-9 -9 L1 -5 L11 0 Z" fill="' +
        d +
        '" opacity=".2"/>' +
        '<path d="M-13 0 L-9 -9 L-2 -13 L7 -11 L13 -3 L11 0 Z" fill="none" stroke="' +
        d +
        '" stroke-width="1.6" stroke-linejoin="round"/>';
    } else if (it.obj.id === "jäätis") {
      g =
        '<path d="M-6 -8 l6 8 l6 -8 z" fill="#D8A86A"/>' +
        '<path d="M-6 -8 h12 l-1 -2 h-10 z" fill="#C08A54"/>' +
        '<circle cx="-3" cy="-12" r="5.6" fill="' +
        c +
        '"/><circle cx="3" cy="-12" r="5.6" fill="' +
        d +
        '"/>' +
        '<circle cx="0" cy="-17" r="5.6" fill="' +
        c +
        '"/>' +
        '<circle cx="-2" cy="-19" r="1.8" fill="#fff" opacity=".45"/>';
    } else if (it.obj.id === "puu") {
      g =
        '<rect x="-2.4" y="-9" width="4.8" height="9" fill="#8A5E30"/>' +
        '<circle cx="0" cy="-17" r="9" fill="' +
        c +
        '"/>' +
        '<circle cx="-6" cy="-12" r="6" fill="' +
        c +
        '"/><circle cx="6" cy="-12" r="6" fill="' +
        c +
        '"/>' +
        '<circle cx="-3" cy="-20" r="4" fill="#fff" opacity=".22"/>';
    } else if (it.obj.id === "võti") {
      g =
        '<circle cx="-6" cy="-14" r="6.4" fill="' +
        c +
        '"/><circle cx="-6" cy="-14" r="2.6" fill="#F3EEE2"/>' +
        '<rect x="-1" y="-16" width="16" height="4" rx="1.4" fill="' +
        c +
        '"/>' +
        '<rect x="9" y="-12" width="3" height="4.4" fill="' +
        c +
        '"/>' +
        '<rect x="13" y="-12" width="3" height="3" fill="' +
        c +
        '"/>';
    } else {
      g =
        '<path d="M0 -20 q-11 0 -11 10 q0 10 11 10 q11 0 11 -10 q0 -10 -11 -10 z" fill="' +
        c +
        '"/>' +
        '<path d="M0 -20 q-6 0 -8.6 4 q3 -8 8.6 -8 z" fill="#fff" opacity=".35"/>' +
        '<path d="M0 -21 v-4" stroke="#6E4A28" stroke-width="2"/>' +
        '<path d="M1 -24 q6 -4 9 0 q-5 4 -9 0 z" fill="#5CA05E"/>';
    }
    return (
      '<g class="oit" data-oi="' +
      i +
      '" transform="translate(' +
      x +
      "," +
      y +
      ') scale(1.12)" style="cursor:pointer">' +
      '<ellipse cx="0" cy="-9" rx="17" ry="16" fill="#FFFFFF" opacity=".30"/>' +
      '<ellipse cx="0" cy="2" rx="12" ry="3.4" fill="#2A1B0C" opacity=".28"/>' +
      g +
      '<circle class="ohit" cx="0" cy="-10" r="24" fill="transparent"/></g>'
    );
  }
  function otsiPick(n, arr) {
    var a = arr.slice(),
      o = [],
      i;
    for (i = 0; i < n && a.length; i++) o.push(a.splice(Math.floor(Math.random() * a.length), 1)[0]);
    return o;
  }
  function otsiBuild() {
    var lv = OT.round < 3 ? 1 : OT.round < 6 ? 2 : 3;
    var sc = otsiScene();
    OT.scene = sc;
    var pool = OBJ.filter(function (o) {
      return sc.objs.indexOf(o.id) >= 0;
    });
    if (pool.length < 4) pool = OBJ;
    var spots = otsiPick(Math.min(6, sc.spots.length), sc.spots),
      items = [],
      i;
    var tObj = pool[Math.floor(Math.random() * pool.length)];
    var tCol = OCOL[Math.floor(Math.random() * OCOL.length)];
    items.push({ obj: tObj, col: tCol, spot: spots[0] });
    /* lurendrejare som skiljer sig på exakt en sak */
    var others = pool.filter(function (o) {
      return o.id !== tObj.id;
    });
    var cols = OCOL.filter(function (c) {
      return c.id !== tCol.id;
    });
    items.push({ obj: others[Math.floor(Math.random() * others.length)], col: tCol, spot: spots[1] });
    items.push({ obj: tObj, col: cols[Math.floor(Math.random() * cols.length)], spot: spots[2] });
    for (i = 3; i < 6; i++) {
      items.push({
        obj: pool[Math.floor(Math.random() * pool.length)],
        col: OCOL[Math.floor(Math.random() * OCOL.length)],
        spot: spots[i],
      });
    }
    /* placera i sina fack, inte ovanpå varandra */
    for (i = 0; i < items.length; i++) {
      var sp = items[i].spot;
      items[i].x = Math.round(sp.x[0] + Math.random() * (sp.x[1] - sp.x[0]));
      items[i].y = sp.y;
    }
    for (i = items.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)),
        t = items[i];
      items[i] = items[j];
      items[j] = t;
    }
    OT.items = items;
    OT.target = 0;
    for (i = 0; i < items.length; i++) {
      if (items[i].obj === tObj && items[i].col === tCol && items[i].spot === spots[0]) {
        OT.target = i;
        break;
      }
    }
    var tg = items[OT.target];
    if (lv === 1) {
      OT.say = ["Kus on", tCol.id, tObj.et];
      OT.sv = "Var är " + svDef(tCol, tObj) + "?";
    } else if (lv === 2) {
      OT.say = ["Kus on", tObj.et, tg.spot.et];
      OT.sv = "Var är " + tObj.def + " " + tg.spot.sv + "?";
    } else {
      OT.say = ["Kus on", tCol.id, tObj.et, tg.spot.et];
      OT.sv = "Var är " + svDef(tCol, tObj) + " " + tg.spot.sv + "?";
    }
  }
  function otsiScreen() {
    screen = "otsi";
    setNav("home");
    btnBack.hidden = false;
    if (!OT) {
      OT = { round: 0, n: 8, right: 0, wrong: 0, stars: 0, lock: false };
    }
    otsiBuild();
    OT.helped = false;
    OT.missedHere = false;
    OT.missHere = 0;
    var tg = OT.items[OT.target];
    var html =
      '<div class="zone"><span>🔍 <b>Otsi!</b> · ' +
      esc(OT.scene.et) +
      "</span>" +
      "<span>" +
      (OT.round + 1) +
      " / " +
      OT.n +
      " · ⭐ " +
      OT.stars +
      "</span></div>";
    var chips = OT.say
      .map(function (w, k) {
        return (
          '<button class="ochip" data-w="' +
          esc(w) +
          '">' +
          esc(w) +
          (k === OT.say.length - 1 ? '<span class="oq">?</span>' : "") +
          "</button>"
        );
      })
      .join("");
    html +=
      '<div class="card"><div class="otsiask">' +
      '<button class="btn small" id="otsisay" aria-label="Hör hela frågan">🔊</button>' +
      '<button class="btn small ghost" id="otsislow" aria-label="Hör långsamt">🐢</button>' +
      '<div class="ochips">' +
      chips +
      '<small id="otsisv" hidden>' +
      esc(OT.sv) +
      "</small>" +
      '<button class="obtnhelp" id="otsihelp">Vad betyder det?</button></div></div>' +
      '<div class="odots">' +
      Array.apply(null, { length: OT.n })
        .map(function (_, k) {
          return '<i class="' + (k < OT.round ? "on" : k === OT.round ? "now" : "") + '"></i>';
        })
        .join("") +
      "</div>" +
      '<div class="otsiwrap">' +
      sceneSVG(OT.scene) +
      '<svg class="otsilayer" viewBox="0 0 400 270">' +
      '<defs><radialGradient id="ohalo" cx="50%" cy="50%" r="50%">' +
      '<stop offset="42%" stop-color="#FFFFFF" stop-opacity=".44"/>' +
      '<stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient></defs>' +
      OT.items.map(otsiDraw).join("") +
      "</svg></div>" +
      '<p class="qsub" id="otsitip">Tryck på rätt sak i rummet.</p></div>';
    app.innerHTML = html;
    speakSeq(OT.say); /* direkt i tryckningen – annars stoppar webbläsaren ljudet */
    document.getElementById("otsisay").onclick = function () {
      speakSeq(OT.say);
    };
    document.getElementById("otsislow").onclick = function () {
      speakSeqSlow(OT.say);
    };
    document.getElementById("otsihelp").onclick = function () {
      otsiHelp();
    };
    var ch = app.querySelectorAll(".ochip"),
      ci;
    for (ci = 0; ci < ch.length; ci++) {
      (function (el) {
        el.onclick = function () {
          speak(el.getAttribute("data-w"), true);
        };
      })(ch[ci]);
    }
    var g = app.querySelectorAll("[data-oi]"),
      i;
    for (i = 0; i < g.length; i++) {
      (function (el) {
        el.onclick = function () {
          otsiTap(parseInt(el.getAttribute("data-oi"), 10), el);
        };
      })(g[i]);
    }
  }
  function otsiHelp() {
    var sv = document.getElementById("otsisv"),
      b = document.getElementById("otsihelp");
    if (!sv) return;
    sv.hidden = false;
    if (b) b.remove();
    OT.helped = true;
  }
  function otsiTap(i, el) {
    if (OT.lock) return;
    var tip = document.getElementById("otsitip");
    if (i === OT.target) {
      OT.lock = true;
      OT.right++;
      var solo = !OT.helped && !OT.missedHere;
      if (solo) OT.solo = (OT.solo || 0) + 1;
      var gain = 12 + OT.round * 2 + (solo ? 6 : 0);
      OT.stars += gain;
      earnStars(gain);
      addXp(14);
      save();
      refreshTop();
      el.classList.add("ofound");
      sndOk();
      buzz(16);
      burst(60);
      if (tip)
        tip.innerHTML =
          '<b style="color:var(--moss)">Leidsid! ' +
          esc(OT.items[i].obj.def) +
          " ✓</b>" +
          (solo ? ' <span class="qsub" style="display:inline">utan hjälp ⭐ +6</span>' : "");
      speak("Leidsid!");
      bumpQuest("correct", 1);
      tripBump("hear", 1);
      setTimeout(function () {
        OT.round++;
        if (OT.round >= OT.n) otsiEnd();
        else {
          OT.lock = false;
          otsiScreen();
        }
      }, 1100);
    } else {
      OT.wrong++;
      OT.missedHere = true;
      OT.missHere = (OT.missHere || 0) + 1;
      el.classList.add("owrong");
      sndNo();
      buzz(30);
      if (OT.missHere >= 2) otsiHelp(); /* först efter två försök */
      var w = OT.items[i];
      if (tip)
        tip.innerHTML = "Det där är <b>" + esc(svInd(w.col, w.obj)) + "</b> " + esc(w.spot.sv) + ". Leta vidare!";
      setTimeout(function () {
        el.classList.remove("owrong");
      }, 600);
      setTimeout(function () {
        speakSeq(OT.say);
      }, 700);
    }
  }
  function otsiEnd() {
    tripBump("otsi", 1);
    var st = OT.wrong === 0 ? 3 : OT.wrong <= 2 ? 2 : 1;
    var gained = OT.stars,
      wrong = OT.wrong,
      solo = OT.solo || 0;
    OT = null;
    S.lessons = (S.lessons || 0) + 1;
    save();
    bumpQuest("themes", 1);
    tripBump("hear", 1);
    app.innerHTML =
      '<div class="card" style="text-align:center"><p class="kicker">🔍 Otsi!</p>' +
      '<h2 class="q">' +
      (wrong === 0 ? "Alla rätt!" : "Bra letat!") +
      "</h2>" +
      '<div class="bigstars">' +
      "⭐".repeat(st) +
      "</div>" +
      '<p class="qsub">Du hittade 8 saker och samlade ⭐ ' +
      gained +
      ".<br>" +
      "<b>" +
      solo +
      " av 8</b> klarade du utan att se den svenska texten.</p>" +
      '<div class="row"><button class="btn big" id="oag">En gång till</button>' +
      '<button class="btn ghost" id="ohome">Till start</button></div></div>';
    burst(160);
    fanfare(st);
    document.getElementById("oag").onclick = function () {
      go(otsiScreen, true);
    };
    document.getElementById("ohome").onclick = function () {
      go(homeScreen, true);
    };
  }
  function otsiIntro() {
    OT = null;
    screen = "otsi";
    setNav("home");
    btnBack.hidden = false;
    app.innerHTML =
      '<div class="zone play"><span class="zem">🔍</span><span><b>Otsi!</b>' +
      "<span>Hitta det Siiri säger</span></span></div>" +
      '<div class="card" style="text-align:center">' +
      '<p class="qsub">Siiri säger på estniska vad hon letar efter. Tryck på rätt sak i rummet.</p>' +
      '<p class="qsub">Först <b>färg och sak</b> — <i>kollane müts</i>. Sedan <b>var den ligger</b> — ' +
      "<i>laua all</i>, <i>tooli peal</i>, <i>akna juures</i>.</p>" +
      '<p class="qsub">Åtta saker att hitta. Tryck på 🔊 för att höra om.</p>' +
      '<button class="btn big wide" id="ostart">Alusta! · Börja leta</button></div>';
    document.getElementById("ostart").onclick = function () {
      try {
        ensureGraph();
        if (AC && AC.state === "suspended") AC.resume();
      } catch (e) {}
      OT = { round: 0, n: 8, right: 0, wrong: 0, stars: 0, lock: false };
      go(otsiScreen, true);
    };
  }

  function duelIntro() {
    screen = "duel";
    prefetchAllThemes();
    var i,
      html =
        '<div class="zone map"><span class="zem">⚔️</span><span><b>Duell</b>' +
        "<span>Tävla mot ett djur — Siiri hejar på dig</span></span></div>";
    html +=
      '<div class="card"><p class="qsub" style="text-align:left">Tolv frågor i tre ronder. ' +
      "Ni får samma fråga, och den som har flest rätt vinner. Ingen klocka, och du kan aldrig förlora stjärnor du redan har.</p></div>";
    for (i = 0; i < RIVALS.length; i++) {
      var r = RIVALS[i],
        open = rivalOpen(r),
        rec = duelRec(r.id);
      html +=
        '<button class="rivalcard' +
        (open ? "" : " locked") +
        '"' +
        (open ? ' data-rival="' + r.id + '"' : "") +
        ">" +
        '<span class="rem">' +
        (open ? r.em : "🔒") +
        "</span>" +
        '<span class="rtx"><b>' +
        esc(r.et) +
        "</b><small>" +
        esc(r.sv) +
        " · " +
        esc(r.desc) +
        "</small>" +
        "<small>" +
        (open
          ? "🏆 " + rec.w + " vinster · " + rec.l + " förluster" + (rec.best ? " · bästa " + starStr(rec.best) : "")
          : "öppnas vid ort " + (r.need + 1) + " på resan") +
        "</small></span></button>";
    }
    app.innerHTML = html;
    var bs = app.querySelectorAll("[data-rival]"),
      k;
    for (k = 0; k < bs.length; k++) {
      (function (el) {
        el.onclick = function () {
          duelSetup(el.getAttribute("data-rival"));
        };
      })(bs[k]);
    }
  }
  function duelSetup(id) {
    var r = null,
      i;
    for (i = 0; i < RIVALS.length; i++) if (RIVALS[i].id === id) r = RIVALS[i];
    if (!r) return;
    var rec = duelRec(id),
      pot = 40 + Math.min(60, rec.w * 8);
    screen = "duel";
    app.innerHTML =
      '<div class="zone map"><span class="zem">' +
      r.em +
      "</span><span><b>" +
      esc(r.et) +
      "</b>" +
      "<span>" +
      esc(r.sv) +
      " · " +
      esc(r.desc) +
      "</span></span></div>" +
      '<div class="card" style="text-align:center">' +
      '<div class="duelvs"><span>' +
      (S.avatar || "🦔") +
      "</span><b>vs</b><span>" +
      r.em +
      "</span></div>" +
      '<p class="qsub">Potten är <b>⭐ ' +
      pot +
      "</b>. Vinst ger hela, förlust halva — du kan inte förlora något du redan samlat.</p>" +
      '<button class="btn ghost wide" id="handi">🤝 Ge ' +
      esc(r.et) +
      " två poängs försprång (+50% stjärnor)</button>" +
      '<p class="qsub" id="handit">&nbsp;</p>' +
      '<button class="btn green big wide" id="go">⚔️ Sätt igång</button></div>';
    var handi = false;
    document.getElementById("handi").onclick = function () {
      handi = !handi;
      this.className = handi ? "btn wide" : "btn ghost wide";
      document.getElementById("handit").textContent = handi ? "Försprång på: modigt!" : "";
      tone(handi ? 900 : 600, 0.08, 0);
    };
    document.getElementById("go").onclick = function () {
      duelStart(r, pot, handi);
    };
  }
  function duelStart(r, pot, handi) {
    DU = {
      r: r,
      pot: pot,
      handi: !!handi,
      i: 0,
      n: 12,
      me: 0,
      you: handi ? 2 : 0,
      myMiss: 0,
      hint: true,
      dbl: false,
      rivalDbl: false,
      pool: pickWeighted(allWords(), 16),
      lock: false,
    };
    speak(COACH[(Math.random() * COACH.length) | 0].et);
    setTimeout(duelRound, 700);
  }
  /* motståndarens chans att svara rätt: sämre på ord du kan, bättre på ord som vacklar,
       och hon skärper sig när hon halkar efter – men kan aldrig springa ifrån på slutet */
  function rivalChance(w) {
    var base = DU.r.skill,
      m = (S.wordmem || {})[mkey(w.et, w.sv)],
      strong = m ? Math.min(1, (m.s || 0) / 4) : 0;
    base -= strong * 0.22; /* ord du är stark på klarar hon sämre */
    base += m && m.w > 2 ? 0.1 : 0; /* ord som vacklar kan hon bättre */
    var diff = DU.me - DU.you;
    if (diff >= 2) base += 0.15; /* du leder: hon skärper sig */
    if (diff <= -2) base -= 0.2; /* hon leder: hon slarvar */
    var left = DU.n - DU.i;
    if (left <= 2 && diff > 0) base -= 0.25; /* sista ronden: din ledning står sig */
    return Math.max(0.15, Math.min(0.94, base));
  }
  function duelTrack() {
    var me = Math.min(1, DU.me / 8),
      you = Math.min(1, DU.you / 8);
    return (
      '<div class="track"><div class="lane"><span class="run" style="left:' +
      me * 82 +
      '%">' +
      (S.avatar || "🦔") +
      "</span>" +
      '<span class="flag">🏁</span></div>' +
      '<div class="lane"><span class="run" style="left:' +
      you * 82 +
      '%">' +
      DU.r.em +
      '</span><span class="flag">🏁</span></div>' +
      '<div class="score"><b>' +
      DU.me +
      "</b> – <b>" +
      DU.you +
      "</b></div></div>"
    );
  }
  function duelRound() {
    if (!DU) return;
    /* oavgjort efter tolv frågor ger en avgörande fråga till */
    if (DU.i >= DU.n) {
      if (DU.me === DU.you) {
        DU.n++;
        speak(taunt("tie").et);
      } else {
        duelEnd();
        return;
      }
    }
    var w = DU.pool[DU.i % DU.pool.length],
      all = allWords(),
      opts = [w],
      i,
      tries = 0;
    var listen = DU.i % 3 === 2; /* var tredje fråga hörs i stället för att synas */
    while (opts.length < 4 && tries < 90) {
      var c = all[(Math.random() * all.length) | 0];
      tries++;
      var dup = false;
      for (i = 0; i < opts.length; i++) if (opts[i].et === c.et || opts[i].sv === c.sv) dup = true;
      if (!dup) opts.push(c);
    }
    opts = shuffle(opts);
    var rnd = Math.floor(DU.i / 4) + 1;
    if (DU.i > 0 && DU.i % 4 === 0 && DU.lastCoach !== rnd) {
      DU.lastCoach = rnd;
      var cm = COACH[(Math.random() * COACH.length) | 0];
      /* ordet som ska höras har ensamrätt – ingen hejarklack ovanpå */
      if (!listen)
        setTimeout(function () {
          if (DU) speak(cm.et);
        }, 350);
    }
    /* motståndaren kan spela sin dubbelpoäng en gång, helst när hon ligger under */
    if (!DU.rivalDbl && DU.i >= 4 && DU.you < DU.me && Math.random() < 0.4) {
      DU.rivalDbl = "now";
    }
    var html =
      '<div class="zone map"><span class="zem">' +
      DU.r.em +
      "</span><span><b>Rond " +
      Math.min(3, rnd) +
      " av 3</b>" +
      "<span>fråga " +
      (DU.i + 1) +
      " av " +
      DU.n +
      "</span></span></div>" +
      '<div class="card">' +
      duelTrack() +
      (DU.i === DU.n - 1
        ? '<p class="qsub" style="color:var(--berry);font-weight:700">' + esc(taunt("last").et) + " · sista frågan</p>"
        : "") +
      (DU.rivalDbl === "now"
        ? '<p class="qsub" style="color:var(--honey-deep);font-weight:700">⭐ ' + esc(DU.r.et) + ": Topeltpunkt!</p>"
        : "") +
      (listen
        ? '<p class="q">Lyssna och välj</p>' +
          '<div class="center"><button class="speakbtn big" id="hear" aria-label="Hör ordet">🔊</button></div>' +
          '<p class="qsub">Tryck igen om du vill höra en gång till</p>'
        : '<p class="q">Vad heter</p>' + promptHtml(w, w.sv)) +
      '<div class="opts" id="opts">';
    for (i = 0; i < opts.length; i++)
      html += '<button class="opt" data-et="' + esc(opts[i].et) + '" lang="et">' + esc(opts[i].et) + "</button>";
    html +=
      '</div><div class="row" style="margin-top:10px">' +
      '<button class="btn ghost" id="hint"' +
      (DU.hint ? "" : " disabled") +
      ">🔍 Vihje</button>" +
      '<button class="btn ghost" id="dbl"' +
      (DU.dbl ? " disabled" : "") +
      ">⭐ Topeltpunkt</button></div>" +
      '<div class="feedback" id="fb"></div></div><div class="center">' +
      siilSVG("small") +
      "</div>";
    app.innerHTML = html;
    if (listen) {
      speak(w.et);
      var hb = document.getElementById("hear");
      if (hb)
        hb.onclick = function () {
          speak(w.et);
        };
    }
    if (DU.rivalDbl === "now" && !listen) speak(taunt("dbl").et);
    var used = false;
    document.getElementById("hint").onclick = function () {
      if (DU.lock || !DU.hint) return;
      DU.hint = false;
      this.disabled = true;
      var bs = app.querySelectorAll(".opt"),
        removed = 0,
        k;
      for (k = 0; k < bs.length && removed < 2; k++) {
        if (bs[k].getAttribute("data-et") !== w.et) {
          bs[k].style.opacity = ".25";
          bs[k].disabled = true;
          removed++;
        }
      }
      tone(700, 0.1, 0);
    };
    document.getElementById("dbl").onclick = function () {
      if (DU.lock || DU.dbl) return;
      DU.dbl = true;
      this.disabled = true;
      this.className = "btn";
      DU.dblNow = true;
      tone(1180, 0.12, 0);
      document.getElementById("fb").className = "feedback";
      document.getElementById("fb").textContent = "Dubbelt om du har rätt — men missar du får " + DU.r.et + " poängen.";
    };
    var bs = app.querySelectorAll(".opt"),
      k2;
    for (k2 = 0; k2 < bs.length; k2++) {
      (function (el) {
        el.onclick = function () {
          if (DU.lock) return;
          DU.lock = true;
          var ok = el.getAttribute("data-et") === w.et;
          var b2 = app.querySelectorAll(".opt"),
            q;
          for (q = 0; q < b2.length; q++) {
            b2[q].disabled = true;
            if (b2[q].getAttribute("data-et") === w.et) b2[q].className = "opt right";
          }
          if (!ok) el.className = "opt wrong";
          wmemHit(w.et, ok, "choose", w.sv);
          var gained = 0;
          if (ok) {
            gained = DU.dblNow ? 2 : 1;
            DU.me += gained;
            sndOk();
            buzz(18);
            mood("cheer");
          } else {
            DU.myMiss++;
            sndNo();
            mood("oops");
            if (DU.dblNow) {
              DU.you += 1;
            }
          }
          DU.dblNow = false;
          praiseSay(ok ? 2 : 0, ok, document.getElementById("fb"));
          /* motståndaren funderar synligt innan hon svarar */
          var fbT = document.getElementById("fb");
          if (fbT && fbT.parentNode) {
            var th = document.createElement("div");
            th.className = "rivalthink";
            th.innerHTML =
              '<span class="rem">' +
              DU.r.em +
              '</span><span class="dots"><i></i><i></i><i></i></span>' +
              '<span class="rtxt">' +
              esc(DU.r.et) +
              " funderar…</span>";
            fbT.parentNode.insertBefore(th, fbT);
          }
          setTimeout(function () {
            if (!DU) return;
            var th2 = app.querySelector(".rivalthink");
            if (th2) th2.remove();
            var hit = Math.random() < rivalChance(w);
            var pts = DU.rivalDbl === "now" ? 2 : 1;
            if (hit) DU.you += pts;
            if (DU.rivalDbl === "now") DU.rivalDbl = true;
            var t = taunt(hit ? (DU.you > DU.me ? "lead" : "hit") : "miss");
            speak(t.et);
            if (hit) {
              tone(660, 0.09, 0);
              tone(880, 0.12, 0.09);
            } else {
              tone(300, 0.15, 0);
            }
            var face = hit ? (DU.you > DU.me ? "😎" : "🙂") : "😳";
            var fb = document.getElementById("fb");
            if (fb) {
              fb.className = "feedback " + (hit ? "no" : "ok");
              fb.innerHTML =
                '<span class="rivalsay"><span class="rem">' +
                DU.r.em +
                "</span>" +
                "<span><b>" +
                esc(DU.r.et) +
                " " +
                (hit ? "svarade rätt" : "svarade fel") +
                " " +
                face +
                "</b>" +
                "<small>" +
                esc(t.et) +
                " · " +
                esc(t.sv) +
                "</small></span></span>";
            }
            var tr = app.querySelector(".track");
            if (tr) tr.outerHTML = duelTrack();
            DU.i++;
            DU.lock = false;
            setTimeout(function () {
              if (DU) duelRound();
            }, 1300);
          }, 950);
        };
      })(bs[k2]);
    }
  }
  function duelEnd() {
    var won = DU.me > DU.you,
      rec = duelRec(DU.r.id),
      margin = DU.me - DU.you;
    var st = !won ? 0 : DU.myMiss === 0 ? 3 : margin >= 3 ? 2 : 1;
    var gain = Math.round((won ? DU.pot : DU.pot / 2) * (DU.handi ? 1.5 : 1));
    earnStars(gain);
    addXp(won ? 60 : 25);
    if (won) rec.w++;
    else rec.l++;
    if (st > rec.best) rec.best = st;
    save();
    refreshTop();
    if (won) {
      burst(200);
      fanfare(3);
      setTimeout(function () {
        dance();
      }, 300);
    } else {
      burst(80);
      sndLvl();
    }
    speak(taunt(won ? "lose" : "win").et);
    var trophy = won && rec.w === 5;
    app.innerHTML =
      '<div class="card" style="text-align:center">' +
      '<div class="duelvs"><span>' +
      (S.avatar || "🦔") +
      "</span><b>" +
      DU.me +
      " – " +
      DU.you +
      "</b><span>" +
      DU.r.em +
      "</span></div>" +
      '<div class="bigstars">' +
      starStr(st) +
      "</div>" +
      '<p class="q">' +
      (won ? "Du vann mot " + esc(DU.r.et) + "!" : esc(DU.r.et) + " vann den här gången") +
      "</p>" +
      '<p class="qsub">' +
      (won
        ? DU.myMiss === 0
          ? "Felfri match — tre stjärnor!"
          : margin >= 3
            ? "Stor marginal — två stjärnor!"
            : "En stjärna. Vinn med tre poängs marginal för två."
        : "Du får ändå halva potten.") +
      "</p>" +
      '<p class="qsub">⭐ +' +
      gain +
      (DU.handi ? " (försprångsbonus)" : "") +
      "</p>" +
      (trophy ? '<p class="q" style="color:var(--honey-deep)">🏆 Fem vinster mot ' + esc(DU.r.et) + "!</p>" : "") +
      '<div class="center">' +
      siilSVG("small") +
      "</div>" +
      '<button class="btn green big wide" id="again">⚔️ En gång till mot ' +
      esc(DU.r.et) +
      "</button>" +
      '<div class="row"><button class="btn ghost" id="other">Byt motståndare</button>' +
      '<button class="btn ghost" id="home">Menüü</button></div></div>';
    var r = DU.r;
    DU = null;
    mood(won ? "cheer" : "oops");
    if (won) tripBump("duel", 1);
    if (won)
      setTimeout(function () {
        dance(st >= 2);
      }, 400);
    document.getElementById("again").onclick = function () {
      duelSetup(r.id);
    };
    document.getElementById("other").onclick = function () {
      duelIntro();
    };
    document.getElementById("home").onclick = function () {
      go(homeScreen, false);
    };
  }

  /* ---------- SIIRI TUBA: rummet där samlingen bor ---------- */

  /* ---------- MÄLUMÄNG: memory ---------- */
  var MM = null;
  function memIntro() {
    screen = "mem";
    prefetchAllThemes();
    if (!S.memLv) S.memLv = 1;
    var sizes = [4, 6, 8],
      names = ["Lätt · 4 par", "Lagom · 6 par", "Svår · 8 par"],
      i;
    var html =
      '<div class="zone play"><span class="zem">🃏</span><span><b>Mälumäng</b>' +
      "<span>Memory — para ihop ordet med bilden</span></span></div>" +
      '<div class="card" style="text-align:center">' +
      '<p class="qsub">Korten ligger nedvända. Vänd två i taget. Hittar du paret läser Siiri ordet – ingen klocka, ingen stress.</p>' +
      '<div class="memlv">';
    for (i = 0; i < 3; i++) {
      var bestT = (S.memBestLv || {})[i];
      html +=
        '<button class="memlvbtn' +
        (S.memLv === i ? " on" : "") +
        '" data-lv="' +
        i +
        '"><b>' +
        names[i] +
        "</b>" +
        "<small>" +
        (bestT ? "bästa: " + bestT + " vändningar" : "inte spelat än") +
        "</small></button>";
    }
    html +=
      '</div><div class="center">' +
      siilSVG("small") +
      "</div>" +
      '<button class="btn green big wide" id="start">Sätt igång 🃏</button></div>';
    app.innerHTML = html;
    var bs = app.querySelectorAll("[data-lv]"),
      k;
    for (k = 0; k < bs.length; k++) {
      (function (el) {
        el.onclick = function () {
          S.memLv = parseInt(el.getAttribute("data-lv"), 10);
          save();
          tone(760, 0.07, 0);
          memIntro();
        };
      })(bs[k]);
    }
    document.getElementById("start").onclick = memStart;
  }
  function memStart() {
    var n = [4, 6, 8][S.memLv || 1];
    var pool = pickWeighted(allWords().filter(hasPic), n),
      cards = [],
      i; /* bild ↔ ord: inga läxord */
    for (i = 0; i < pool.length; i++) {
      cards.push({ id: i, kind: "word", w: pool[i] });
      cards.push({ id: i, kind: "pic", w: pool[i] });
    }
    MM = {
      cards: shuffle(cards),
      open: [],
      done: {},
      turns: 0,
      lock: false,
      pairs: n,
      streak: 0,
      best: 0,
      flash: null,
    };
    memDraw();
  }
  function memDraw() {
    var c = MM.cards,
      i;
    var perfect = MM.pairs,
      stars = memStars(MM.turns, MM.pairs);
    var html =
      '<div class="zone play"><span class="zem">🃏</span><span><b>Mälumäng</b>' +
      "<span>" +
      MM.turns +
      " vändningar · " +
      Object.keys(MM.done).length +
      " av " +
      MM.pairs +
      " par" +
      (MM.streak > 1 ? " · 🔥 " + MM.streak + " i rad" : "") +
      "</span></span></div>" +
      '<div class="card">' +
      (MM.flash
        ? '<div class="memflash"><span class="fem">' +
          MM.flash.em +
          "</span>" +
          '<span><b lang="et">' +
          esc(MM.flash.et) +
          "</b><small>" +
          esc(MM.flash.sv) +
          "</small></span></div>"
        : '<div class="memflash empty"></div>') +
      '<div class="memgrid' +
      (MM.pairs >= 8 ? " tight" : "") +
      '">';
    for (i = 0; i < c.length; i++) {
      var isOpen = MM.open.indexOf(i) >= 0,
        isDone = MM.done[c[i].id];
      html +=
        '<button class="memcard' +
        (isOpen || isDone ? " up" : "") +
        (isDone ? " done" : "") +
        '" data-m="' +
        i +
        '">' +
        '<span class="mface back"><span class="mem-back">🦔</span></span>' +
        '<span class="mface front">' +
        (c[i].kind === "pic"
          ? '<span class="mem-em">' + wIcon(c[i].w) + "</span>"
          : '<span class="mem-wd">' + esc(c[i].w.et) + "</span>") +
        "</span></button>";
    }
    html +=
      '</div><p class="qsub" style="margin-top:10px">' +
      (MM.turns
        ? "Klarar du det på " + perfect + " vändningar blir det tre stjärnor."
        : "Varje par du minns direkt ger extra stjärnor.") +
      '</p></div><div class="center">' +
      siilSVG("small") +
      "</div>";
    app.innerHTML = html;
    var bs = app.querySelectorAll("[data-m]");
    for (i = 0; i < bs.length; i++) {
      (function (el) {
        el.onclick = function () {
          memFlip(parseInt(el.getAttribute("data-m"), 10));
        };
      })(bs[i]);
    }
  }
  function memStars(turns, pairs) {
    if (turns <= pairs) return 3;
    if (turns <= Math.round(pairs * 1.6)) return 2;
    if (turns <= pairs * 2.6) return 1;
    return 0;
  }
  function memFlip(i) {
    if (!MM || MM.lock) return;
    var c = MM.cards[i];
    if (MM.done[c.id] || MM.open.indexOf(i) >= 0) return;
    MM.open.push(i);
    speak(c.w.et);
    if (MM.open.length < 2) {
      MM.flash = null;
      memDraw();
      return;
    }
    MM.turns++;
    MM.lock = true;
    memDraw();
    var a = MM.cards[MM.open[0]],
      b = MM.cards[MM.open[1]];
    if (a.id === b.id) {
      MM.done[a.id] = 1;
      MM.open = [];
      MM.lock = false;
      MM.streak++;
      if (MM.streak > MM.best) MM.best = MM.streak;
      var bonus = 2 + (MM.streak >= 3 ? 2 : MM.streak >= 2 ? 1 : 0);
      S.correct++;
      earnStars(bonus);
      addXp(12 + MM.streak * 2);
      wmemHit(a.w.et, true, "choose", a.w.sv);
      sndOk();
      buzz(18);
      mood("cheer");
      save();
      refreshTop();
      MM.flash = { em: wIcon(a.w), et: a.w.et, sv: a.w.sv };
      if (MM.streak >= 3) {
        tone(1180, 0.1, 0);
        tone(1560, 0.16, 0.1);
      }
      if (Object.keys(MM.done).length >= MM.pairs) {
        setTimeout(memEnd, 650);
        memDraw();
        return;
      }
      setTimeout(memDraw, 260);
    } else {
      MM.streak = 0;
      wmemHit(a.w.et, false, undefined, a.w.sv);
      sndNo();
      mood("oops");
      setTimeout(function () {
        if (!MM) return;
        MM.open = [];
        MM.lock = false;
        MM.flash = null;
        memDraw();
      }, 1000);
    }
  }
  function memEnd() {
    tripBump("mem", 1);
    var t = MM.turns,
      pairs = MM.pairs,
      st = memStars(t, pairs);
    if (!S.memBestLv) S.memBestLv = {};
    var lv = S.memLv || 1,
      rec = !S.memBestLv[lv] || t < S.memBestLv[lv];
    if (rec) S.memBestLv[lv] = t;
    if (!S.memBest || t < S.memBest) S.memBest = t;
    var gain = 10 + pairs * 3 + st * 8;
    earnStars(gain);
    save();
    refreshTop();
    tripBump("mix", 1);
    bumpQuest("mixed", 1);
    if (st === 3) {
      burst(180);
      fanfare(3);
      setTimeout(function () {
        dance();
      }, 300);
    } else {
      burst(110);
      fanfare(2);
    }
    app.innerHTML =
      '<div class="card" style="text-align:center"><div class="bigstars">' +
      starStr(st) +
      "</div>" +
      '<div class="bigscore">' +
      t +
      '</div><p class="q">' +
      (st === 3 ? "Perfekt minne!" : rec ? "Nytt rekord!" : "Alla par hittade!") +
      "</p>" +
      '<p class="qsub">vändningar på ' +
      pairs +
      " par" +
      (MM.best > 1 ? " · längsta serie " + MM.best : "") +
      "</p>" +
      '<p class="qsub">⭐ +' +
      gain * starMult() +
      "</p>" +
      '<div class="center">' +
      siilSVG("small") +
      "</div>" +
      '<button class="btn green big wide" id="again">En gång till 🃏</button>' +
      '<div class="row"><button class="btn ghost" id="harder">Byt svårighet</button>' +
      '<button class="btn ghost" id="home">Tillbaka</button></div></div>';
    MM = null;
    mood("cheer");
    document.getElementById("again").onclick = memStart;
    document.getElementById("harder").onclick = memIntro;
    document.getElementById("home").onclick = function () {
      go(homeScreen, false);
    };
  }

  /* ---------- SÕNASADU: ordregn ---------- */
  var RN = null;
  function rainIntro() {
    screen = "rain";
    prefetchAllThemes();
    app.innerHTML =
      '<div class="zone play"><span class="zem">🌧️</span><span><b>Sõnasadu</b><span>Ordregnet — fånga rätt ord</span></span></div>' +
      '<div class="card" style="text-align:center"><p class="qsub">Orden dalar sakta ner. Tryck på det ord Siiri ber om. Missar du dyker det upp igen — ingen stress.</p>' +
      '<div class="center">' +
      siilSVG("small") +
      "</div>" +
      '<button class="btn green big wide" id="start">Sätt igång 🌧️</button></div>';
    document.getElementById("start").onclick = rainStart;
  }
  function rainStart() {
    RN = { i: 0, n: 10, right: 0, pool: pickWeighted(allWords(), 20) };
    rainRound();
  }
  function rainRound() {
    if (!RN) return;
    if (RN.i >= RN.n) {
      rainEnd();
      return;
    }
    RN.lock = false;
    var target = RN.pool[RN.i % RN.pool.length],
      all = allWords(),
      opts = [target],
      i,
      tries = 0;
    while (opts.length < 4 && tries < 80) {
      var c = all[(Math.random() * all.length) | 0];
      tries++;
      var dup = false;
      for (i = 0; i < opts.length; i++) if (opts[i].et === c.et || opts[i].sv === c.sv) dup = true;
      if (!dup) opts.push(c);
    }
    opts = shuffle(opts);
    var html =
      '<div class="zone play"><span class="zem">🌧️</span><span><b>Sõnasadu</b>' +
      "<span>ord " +
      (RN.i + 1) +
      " av " +
      RN.n +
      " · " +
      RN.right +
      " rätt</span></span></div>" +
      '<div class="card"><p class="q">Hitta ordet för</p>' +
      promptHtml(target, target.sv) +
      '<div class="center"><button class="speakbtn sm" id="say" aria-label="Hör ordet">🔊</button></div>' +
      '<div class="rainbox">';
    for (i = 0; i < opts.length; i++) {
      html +=
        '<button class="raindrop" data-et="' +
        esc(opts[i].et) +
        '" style="left:' +
        (6 + i * 23) +
        "%;animation-duration:" +
        (7 + i * 1.3) +
        "s;animation-delay:" +
        i * 0.7 +
        's">' +
        esc(opts[i].et) +
        "</button>";
    }
    html += '</div><div class="feedback" id="fb"></div></div><div class="center">' + siilSVG("small") + "</div>";
    app.innerHTML = html;
    speak(target.et);
    document.getElementById("say").onclick = function () {
      speak(target.et);
    };
    var ds = app.querySelectorAll("[data-et]");
    for (i = 0; i < ds.length; i++) {
      (function (el) {
        el.onclick = function () {
          if (!RN || RN.lock) return;
          RN.lock = true;
          for (var j = 0; j < ds.length; j++) {
            ds[j].disabled = true;
            ds[j].style.animationPlayState = "paused";
          }
          var ok = el.getAttribute("data-et") === target.et;
          el.classList.add(ok ? "hit" : "miss");
          wmemHit(target.et, ok, "choose", target.sv);
          praiseSay(ok ? RN.right + 1 : 0, ok, document.getElementById("fb"));
          if (ok) {
            RN.right++;
            S.correct++;
            earnStars(2);
            addXp(10);
            sndOk();
            buzz(18);
            mood("cheer");
            save();
            refreshTop();
          } else {
            sndNo();
            mood("oops");
          }
          RN.i++;
          setTimeout(function () {
            if (RN) rainRound();
          }, 800);
        };
      })(ds[i]);
    }
  }
  function rainEnd() {
    var r = RN.right,
      n = RN.n;
    save();
    burst(150);
    fanfare(2);
    tripBump("hear", r);
    tripBump("mix", 1);
    var st = r >= n ? 3 : r >= n * 0.7 ? 2 : r >= n * 0.4 ? 1 : 0;
    app.innerHTML =
      '<div class="card" style="text-align:center"><div class="bigstars">' +
      starStr(st) +
      "</div>" +
      '<div class="bigscore">' +
      r +
      " / " +
      n +
      '</div><p class="q">Bra fångat!</p>' +
      '<div class="center">' +
      siilSVG("small") +
      "</div>" +
      '<div class="row"><button class="btn green big" id="again">En gång till 🌧️</button>' +
      '<button class="btn ghost big" id="home">Tillbaka</button></div></div>';
    RN = null;
    mood("cheer");
    document.getElementById("again").onclick = rainIntro;
    document.getElementById("home").onclick = function () {
      go(homeScreen, false);
    };
  }

  /* ---------- GARDEROBEN ---------- */
  function furnBuy(id) {
    var f = furnById(id);
    if (!f) return;
    if (furnOwned(id)) {
      S.room[f.slot] = id;
      save();
      shopScreen();
      speak(f.et);
      return;
    }
    if ((S.stars || 0) < f.price) {
      tone(220, 0.2, 0, "triangle");
      return;
    }
    S.stars -= f.price;
    if (!S.furnOwned) S.furnOwned = [];
    S.furnOwned.push(id);
    if (!S.room) S.room = {};
    S.room[f.slot] = id;
    save();
    refreshTop();
    burst(120);
    fanfare(2);
    speak(f.et);
    setTimeout(function () {
      dance(f.price >= 600);
    }, 400);
    shopScreen();
  }
  function furnShopHtml() {
    var s =
        '<div class="card"><p class="kicker">🛋️ Tuba · Rummet</p>' +
        '<p class="qsub">Möbler, färger och saker till Siiris rum. Du byter fritt mellan det du äger.</p>',
      i,
      j;
    for (i = 0; i < FURNSLOTS.length; i++) {
      var slot = FURNSLOTS[i][0],
        list = FURN.filter(function (f) {
          return f.slot === slot && !f.def;
        });
      if (!list.length) continue;
      s += '<p class="q" style="text-align:left;margin-top:10px">' + FURNSLOTS[i][2] + " " + FURNSLOTS[i][1] + "</p>";
      for (j = 0; j < list.length; j++) {
        var f = list[j],
          own = furnOwned(f.id),
          on = furnOf(slot) === f.id;
        /* hela raden köper/sätter in – knappen i mitten finns kvar för tangentbordet, 🔊 stoppar klicket själv */
        s +=
          '<div class="shoprow' +
          (own ? " owned" : "") +
          (on ? " on" : "") +
          '" data-furnbuy="' +
          f.id +
          '" style="cursor:pointer">' +
          '<button class="speakbtn sm" data-say="' +
          esc(f.et) +
          '" aria-label="Hör namnet på estniska">🔊</button>' +
          '<button class="btn-plain t"><b lang="et">' +
          esc(f.et) +
          "</b><span>" +
          esc(f.sv) +
          "</span></button>" +
          '<span class="p">' +
          (own ? (on ? "bärs nu" : "ägd — sätt in") : "⭐ " + f.price) +
          "</span></div>";
      }
    }
    return s + "</div>";
  }
  function shopScreen() {
    screen = "shop";
    setNav("shop");
    var se = seasonNow(),
      hol = holidayNow(),
      i,
      it;
    var html =
      '<div class="zone market"><span class="zem">🎪</span><span><b>Laat</b><span>Marknaden — som Mardilaat och Märtsilaat i Estland</span></span></div>' +
      '<div class="card" style="text-align:center">' +
      '<p class="qsub" style="margin-top:2px">Som de riktiga estniska marknaderna Mardilaat och Märtsilaat</p>' +
      '<p class="qsub">Du har <b>⭐ ' +
      S.stars +
      "</b> stjärnor. Tryck för att köpa, tryck igen för att ta av.</p>" +
      siilSVG() +
      "</div>";

    html +=
      '<button class="btn wide" id="toroom" style="margin-bottom:12px">🏠 Siiri tuba · klä Siiri och möblera rummet</button>';
    html += furnShopHtml();

    /* hyllan för svår nivå */
    var hardList = [],
      hardLocked = 0;
    for (i = 0; i < SHOP.length; i++) {
      it = SHOP[i];
      if (!it.hard) continue;
      if (owns(it.id)) continue;
      if (itemAvailable(it)) hardList.push(it);
      else hardLocked++;
    }
    if (hardList.length) {
      html +=
        '<div class="card" style="border-color:#C8305A"><p class="slotrow" style="margin-top:0;color:var(--berry)">' +
        "🔥 Bara för svår nivå</p>" +
        '<p class="qsub" style="text-align:left">Du har klarat ett tema på svår — de här tre finns bara för dig.</p>' +
        '<div class="shopgrid">' +
        shopCells(hardList) +
        "</div></div>";
    } else if (hardLocked) {
      html +=
        '<div class="card" style="border-color:var(--line);opacity:.9"><p class="slotrow" style="margin-top:0">🔒 Tre plagg är låsta</p>' +
        '<p class="qsub" style="text-align:left">Eldkrona, blixtar och drakvingar öppnas när du klarar ett tema på <b>🔥 svår nivå</b>. ' +
        "Där finns också två hemligheter som inte går att hitta någon annanstans.</p></div>";
    }

    /* säsongshyllan */
    var lim = [];
    for (i = 0; i < SHOP.length; i++) {
      it = SHOP[i];
      if (isLimited(it) && !it.hard && itemAvailable(it) && !owns(it.id)) lim.push(it);
    }
    if (lim.length) {
      html +=
        '<div class="card" style="border-color:var(--honey)"><p class="slotrow" style="margin-top:0;color:var(--honey-deep)">' +
        (hol ? hol.em + " Bara idag: " + esc(hol.sv) : se.em + " Bara den här årstiden: " + esc(se.sv)) +
        "</p>" +
        '<p class="qsub" style="text-align:left">De här försvinner ur butiken när årstiden byts – men det du köpt får du behålla för alltid.</p>' +
        '<div class="shopgrid">' +
        shopCells(lim) +
        "</div></div>";
    }

    /* vanliga hyllor */
    for (var s = 0; s < SLOTS.length; s++) {
      var list = [];
      for (i = 0; i < SHOP.length; i++) {
        it = SHOP[i];
        if (it.slot !== SLOTS[s].id || it.dream || it.hard) continue;
        if (!itemAvailable(it)) continue;
        list.push(it);
      }
      if (!list.length) continue;
      html +=
        '<div class="card"><p class="slotrow" style="margin-top:0">' +
        esc(SLOTS[s].sv) +
        "</p>" +
        '<div class="shopgrid">' +
        shopCells(list) +
        "</div></div>";
    }

    /* drömmarna */
    html +=
      '<div class="card" style="background:linear-gradient(150deg,#2B2250,#150F30);border-color:#3D3170;color:#fff">' +
      '<p class="slotrow" style="margin-top:0;color:#E9DEFF">🌠 Drömmar</p>' +
      '<p class="qsub" style="text-align:left;color:#C9BCEF">Långa sparmål. De tar tid – men tänk vad fint det blir.</p>';
    for (i = 0; i < SHOP.length; i++) {
      it = SHOP[i];
      if (!it.dream) continue;
      var pct = Math.min(100, Math.round((S.stars / it.price) * 100));
      var have = owns(it.id),
        on = wearing(it.slot) === it.id;
      html +=
        '<button class="dreamrow" data-buy="' +
        it.id +
        '"><span class="dem">' +
        it.em +
        "</span>" +
        '<span class="dtxt"><b>' +
        esc(it.et) +
        "</b><small>" +
        esc(it.sv) +
        " · ⭐ " +
        it.price.toLocaleString("sv-SE") +
        "</small>" +
        '<span class="qbar" style="background:rgba(255,255,255,.2)"><i style="width:' +
        pct +
        '%;background:var(--honey)"></i></span>' +
        "<small>" +
        (have
          ? on
            ? "Du bär den ✓"
            : "I lådan – tryck för att ta på"
          : S.stars.toLocaleString("sv-SE") + " av " + it.price.toLocaleString("sv-SE") + " (" + pct + "%)") +
        "</small></span></button>";
    }
    html += "</div>";

    var left = 0;
    for (i = 0; i < SHOP.length; i++) {
      if (!owns(SHOP[i].id)) left++;
    }
    html +=
      '<p class="note">' +
      (left
        ? left +
          " saker kvar att spara till, varav några bara går att köpa vissa månader. Stjärnor får du för varje rätt svar – tre i rad ger dubbelt, fem i rad tredubbelt."
        : "Du har köpt allt på marknaden! Siiri är världens finaste igelkott.") +
      "</p>";
    app.innerHTML = html;
    var fbb = app.querySelectorAll("[data-furnbuy]"),
      fk;
    for (fk = 0; fk < fbb.length; fk++) {
      (function (el) {
        el.onclick = function () {
          furnBuy(el.getAttribute("data-furnbuy"));
        };
      })(fbb[fk]);
    }
    var fsay = app.querySelectorAll("[data-say]"),
      fs;
    for (fs = 0; fs < fsay.length; fs++) {
      (function (el) {
        el.onclick = function (e) {
          e.stopPropagation();
          speak(el.getAttribute("data-say"));
        };
      })(fsay[fs]);
    }
    var rb = document.getElementById("toroom");
    if (rb)
      rb.onclick = function () {
        speak("Siiri tuba");
        go(roomScreen, true);
      };
    var bs = app.querySelectorAll("[data-buy]"),
      k;
    for (k = 0; k < bs.length; k++) {
      (function (el) {
        el.onclick = function () {
          buyOrWear(el.getAttribute("data-buy"));
        };
      })(bs[k]);
    }
  }
  function shopCells(list) {
    var html = "",
      i;
    for (i = 0; i < list.length; i++) {
      var it = list[i],
        have = owns(it.id),
        on = wearing(it.slot) === it.id,
        afford = S.stars >= it.price;
      html +=
        '<button class="shopitem' +
        (on ? " worn" : "") +
        (have ? "" : afford ? " locked" : " cant") +
        '" data-buy="' +
        it.id +
        '">' +
        '<span class="em">' +
        it.em +
        '</span><b lang="et">' +
        esc(it.et) +
        "</b><small>" +
        esc(it.sv) +
        "</small>" +
        (have
          ? '<span class="cost">' + (on ? "på ✓" : "i lådan") + "</span>"
          : afford
            ? '<span class="cost">⭐ ' + it.price.toLocaleString("sv-SE") + "</span>"
            : '<span class="cost cant">🔒 ⭐ ' + (it.price - S.stars).toLocaleString("sv-SE") + " kvar</span>") +
        (!have && !afford && it.price >= 700
          ? '<span class="qbar sm"><i style="width:' +
            Math.min(100, Math.round((S.stars / it.price) * 100)) +
            '%;background:var(--honey-deep)"></i></span>'
          : "") +
        (isLimited(it) && !have ? '<small style="color:var(--honey-deep)">säsong</small>' : "") +
        "</button>";
    }
    return html;
  }
  function buyOrWear(id) {
    var it = itemById(id);
    if (!it) return;
    if (!S.owned) S.owned = [];
    if (!S.wear) S.wear = {};
    if (!owns(id)) {
      if (S.stars < it.price) {
        var d = document.createElement("div");
        d.className = "combo";
        d.style.color = "var(--berry)";
        d.textContent = "⭐ " + (it.price - S.stars) + " kvar";
        document.body.appendChild(d);
        setTimeout(function () {
          d.remove();
        }, 900);
        sndNo();
        return;
      }
      S.stars -= it.price;
      S.owned.push(id);
      S.wear[it.slot] = id;
      save();
      setTimeout(function () {
        dance(it.price >= 1000);
      }, 500);
      var tier = it.price >= 2000 ? 3 : it.price >= 500 ? 2 : 1;
      fanfare(tier);
      burst(120 + tier * 90);
      if (tier >= 2)
        setTimeout(function () {
          burst(140);
        }, 380);
      if (tier >= 3) {
        setTimeout(function () {
          burst(180);
          petals(70, ["#FFD45E", "#FFF3C4", "#FFE9A8"]);
        }, 760);
        setTimeout(function () {
          burst(160);
        }, 1150);
      }
      applyScene();
      refreshTop();
      shopScreen();
      mood("cheer");
      if (it.slot === "scene") {
        document.body.classList.add("scenepop");
        setTimeout(function () {
          document.body.classList.remove("scenepop");
        }, 1200);
      }
      setTimeout(
        function () {
          speak(it.et);
        },
        tier >= 3 ? 1500 : 520,
      );
      setTimeout(function () {
        var o = document.createElement("div");
        o.className = "overlay";
        o.innerHTML =
          '<div class="oc"' +
          (tier >= 3 ? ' style="border-color:#8E7BFF"' : "") +
          '><p class="kicker">' +
          (tier >= 3 ? "✨ En dröm gick i uppfyllelse!" : tier === 2 ? "⭐ Ny skatt!" : "Nytt plagg!") +
          "</p>" +
          '<div style="font-size:' +
          (tier >= 3 ? 76 : 56) +
          'px" class="bagpop">' +
          it.em +
          "</div>" +
          "<h3>" +
          esc(it.et) +
          "</h3><p>" +
          esc(it.sv) +
          "</p>" +
          '<div class="center"><button class="speakbtn" id="soksay" aria-label="Hör ordet">🔊</button>' +
          '<button class="speakbtn sm" id="sokslow" aria-label="Hör ordet långsamt">🐢</button></div>' +
          (it.slot === "scene" ? '<p class="qsub" style="margin-top:8px">Hela appen har bytt skepnad!</p>' : "") +
          '<button class="btn big wide" id="sok" style="margin-top:12px">' +
          (tier >= 3 ? "Wow! ✨" : "Snyggt!") +
          "</button></div>";
        document.body.appendChild(o);
        o.querySelector("#soksay").onclick = function () {
          speak(it.et);
        };
        o.querySelector("#sokslow").onclick = function () {
          speak(it.et, true);
        };
        o.querySelector("#sok").onclick = function () {
          o.remove();
        };
      }, 200);
      return;
    }
    S.wear[it.slot] = wearing(it.slot) === id ? null : id;
    save();
    tone(wearing(it.slot) ? 760 : 520, 0.1, 0);
    if (it.slot === "scene") {
      applyScene();
      if (wearing(it.slot) === id) {
        document.body.classList.add("scenepop");
        setTimeout(function () {
          document.body.classList.remove("scenepop");
        }, 1100);
        burst(90);
      }
    }
    shopScreen();
    if (wearing(it.slot) === id) speak(it.et);
  }

  /* ---------- SKATTKAMMAREN ---------- */
  function trophyScreen() {
    screen = "trophy";
    setNav("me");
    newDay();
    var ri = rankIndex(S.xp),
      i;
    var p = questProgress();
    var html =
      '<div class="zone treasure"><span class="zem">🏆</span><span><b>Aarded</b><span>Skattkammaren</span></span></div>' +
      '<div class="card">' +
      '<p class="qsub" style="text-align:left">' +
      RANKS.length +
      " märken att samla, från bronsigelkotten till kungsigelkotten på 100 000 poäng. " +
      "Medaljen ser olika ut beroende på vilken nivå du spelade när du tog den: 🍃 grönt löv, ⭐ rött band eller 🔥 lila stjärna.</p>" +
      '<p class="qsub" style="text-align:left"><b>' +
      S.xp.toLocaleString("sv-SE") +
      "</b> poäng · " +
      (RANKS[rankIndex(S.xp) + 1]
        ? "nästa märke om <b>" + (RANKS[rankIndex(S.xp) + 1].xp - S.xp).toLocaleString("sv-SE") + "</b> poäng"
        : "du har alla märken!") +
      "</p>" +
      '<div class="medalgrid">';
    for (i = 0; i < RANKS.length; i++) {
      var locked = i > ri;
      html +=
        '<div class="medalcell' +
        (locked ? " locked" : "") +
        (i === ri ? " now" : "") +
        '">' +
        medalSVG(RANKS[i], "t" + i, locked, locked ? diff().id : medalStyleOf(RANKS[i].id)) +
        "<b>" +
        esc(RANKS[i].et) +
        "</b>" +
        '<span style="font-weight:600;color:var(--ink)">' +
        esc(RANKS[i].sv) +
        "</span>" +
        "<span>" +
        (locked
          ? RANKS[i].xp + " poäng"
          : (function () {
              var st = medalStyleOf(RANKS[i].id),
                dd;
              for (var q = 0; q < DIFFS.length; q++) {
                if (DIFFS[q].id === st) dd = DIFFS[q];
              }
              return dd ? dd.em + " " + dd.sv : esc(RANKS[i].et);
            })()) +
        "</span></div>";
    }
    html += "</div></div>";

    html +=
      '<div class="card"><p class="q" style="text-align:left">' +
      p.q.em +
      " Dagens utmaning</p>" +
      '<p class="qsub" style="text-align:left">' +
      esc(p.q.sv) +
      " – " +
      p.v +
      " av " +
      p.q.goal +
      (p.done ? " ✓ klar!" : "") +
      (S.flames ? " · 🔥 " + S.flames + " dagar i rad" : "") +
      "</p>" +
      '<span class="qbar" style="background:var(--line)"><i style="width:' +
      Math.round((p.v / p.q.goal) * 100) +
      '%;background:var(--moss)"></i></span></div>';

    var hw = hardWords(8);
    if (hw.length) {
      html += '<div class="card"><p class="q" style="text-align:left">Ord Siiri övar extra med dig</p>';
      for (i = 0; i < hw.length; i++) {
        html +=
          '<span class="badge" style="background:var(--bg2);color:var(--ink)">' +
          hw[i].w.em +
          " " +
          esc(hw[i].w.et) +
          " – " +
          esc(hw[i].w.sv) +
          "</span>";
      }
      html +=
        '<p class="qsub" style="text-align:left;margin-top:8px">De här kommer tillbaka oftare i spelet tills de sitter.</p></div>';
    }
    var dtot = 0,
      dk;
    for (dk in S.duels || {}) dtot += S.duels[dk].w || 0;
    if (dtot) {
      html += '<div class="card"><p class="q" style="text-align:left">⚔️ Duellhyllan</p><div class="duelwall">';
      for (i = 0; i < RIVALS.length; i++) {
        var rr = RIVALS[i],
          rc = (S.duels || {})[rr.id];
        if (!rc || (!rc.w && !rc.l)) continue;
        html +=
          '<div class="duelrow"><span class="dem">' +
          rr.em +
          (rc.w >= 5 ? '<span class="cup">🏆</span>' : "") +
          "</span>" +
          "<span><b>" +
          esc(rr.et) +
          "</b><small>" +
          rc.w +
          " vinster · " +
          rc.l +
          " förluster" +
          (rc.best ? " · bästa " + starStr(rc.best) : "") +
          "</small></span></div>";
      }
      html += "</div></div>";
    }
    html +=
      '<div class="card"><p class="q" style="text-align:left">' +
      (S.name ? esc(S.name) + "s bragder" : "Dina bragder") +
      "</p>";
    for (i = 0; i < BADGES.length; i++) {
      html += badgeChip(BADGES[i]);
    }
    html +=
      '<p class="qsub" style="text-align:left;margin-top:12px">⭐ ' +
      S.stars +
      " stjärnor · " +
      S.correct +
      " rätta svar · 🔥 bästa kombo: " +
      (S.bestcombo || 0) +
      " i rad</p></div>";
    app.innerHTML = html;
  }

  /* ---------- BLANDADE ORD (lugn runda, ingen klocka) ---------- */
  var SP = null;
  function allWords() {
    var w = [],
      i,
      j;
    for (i = 0; i < THEMES.length; i++) for (j = 0; j < THEMES[i].words.length; j++) w.push(THEMES[i].words[j]);
    w = w.concat(tripWords());
    var sc = schoolSet();
    if (sc) w = w.concat(schoolLeft()); /* skolans ord är med tills de sitter */
    return w;
  }
  function speedIntro() {
    screen = "mix";
    prefetchAllThemes();
    var html =
      '<div class="card" style="text-align:center"><div style="font-size:64px">🎲</div>' +
      '<p class="q">Blandade ord</p>' +
      '<p class="qsub">Tolv ord från alla teman, i din egen takt. Ingen klocka – ta all tid du behöver.<br>' +
      "Tre rätt i rad ger dubbla poäng, fem i rad ger tredubbla.</p>" +
      (S.mixbest ? '<p class="qsub">Ditt bästa hittills: <b>' + S.mixbest + " av 12</b></p>" : "") +
      '<div class="center">' +
      siilSVG("small") +
      "</div>" +
      '<button class="btn green big wide" id="start">Sätt igång 🎲</button></div>';
    app.innerHTML = html;
    document.getElementById("start").onclick = function () {
      speedStart();
    };
  }
  function speedStart() {
    SP = { score: 0, combo: 0, best: 0, n: 12, i: 0, pool: pickWeighted(allWords(), 16), results: [] };
    speedRound();
  }
  function speedRound() {
    if (!SP) return;
    if (SP.i >= SP.n) {
      speedEnd();
      return;
    }
    if (SP.i >= SP.pool.length) SP.pool = SP.pool.concat(pickWeighted(allWords(), 16));
    var w = SP.pool[SP.i],
      all = allWords(),
      opts = [],
      i,
      tries = 0;
    while (opts.length < diff().opts - 1 && tries < 160) {
      var c = all[(Math.random() * all.length) | 0];
      tries++;
      if (c.et === w.et || c.sv === w.sv) continue;
      var dup = false;
      for (i = 0; i < opts.length; i++) if (opts[i].et === c.et || opts[i].sv === c.sv) dup = true;
      if (!dup) opts.push(c);
    }
    opts = shuffle(opts.concat([w]));
    var listen = SP.i % 3 === 2;
    var mult = SP.combo >= 5 ? 3 : SP.combo >= 3 ? 2 : 1;
    var html = '<div class="progressdots">';
    for (i = 0; i < SP.n; i++) {
      var c2 = "dot";
      if (i < SP.results.length) {
        c2 += SP.results[i] ? " ok" : " no";
      } else if (i === SP.i) {
        c2 += " now";
      }
      html += '<span class="' + c2 + '"></span>';
    }
    html +=
      '</div><div class="card">' +
      '<div style="display:flex;justify-content:space-between;font-weight:600;font-size:15.5px;color:var(--muted)">' +
      "<span>⭐ " +
      SP.score +
      " poäng</span><span>" +
      (SP.combo >= 3 ? "🔥 dubbla poäng · " : "") +
      "ord " +
      (SP.i + 1) +
      " av " +
      SP.n +
      "</span></div>";
    if (listen) {
      html +=
        '<p class="q" style="margin-top:8px">Vilket ord hör du?</p>' +
        '<div class="center"><button class="speakbtn" id="say" aria-label="Hör ordet">🔊</button>' +
        '<button class="speakbtn sm" id="slow" aria-label="Hör ordet långsamt">🐢</button></div>';
    } else {
      html += promptHtml(w, w.sv);
    }
    html +=
      '<div class="streakline">' + (SP.combo > 1 ? SP.combo + " rätt i rad!" : "&nbsp;") + '</div><div class="opts">';
    for (i = 0; i < opts.length; i++) {
      html +=
        '<button class="opt" data-et="' + esc(opts[i].et) + '">' + esc(opts[i].et) + (listen ? "" : "") + "</button>";
    }
    html += '</div><div class="feedback" id="fb"></div></div><div class="center">' + siilSVG("small") + "</div>";
    app.innerHTML = html;
    if (listen) {
      speak(w.et);
      document.getElementById("say").onclick = function () {
        speak(w.et);
      };
      document.getElementById("slow").onclick = function () {
        speak(w.et, true);
      };
    }
    var btns = app.querySelectorAll(".opt");
    for (i = 0; i < btns.length; i++) {
      (function (el) {
        el.onclick = function () {
          if (!SP) return;
          var ok = el.getAttribute("data-et") === w.et,
            j;
          for (j = 0; j < btns.length; j++) {
            btns[j].disabled = true;
            if (btns[j].getAttribute("data-et") === w.et) btns[j].classList.add("right");
          }
          if (!ok) el.classList.add("wrong");
          SP.results[SP.i] = ok;
          SP.i++;
          wmemHit(w.et, ok, undefined, w.sv);
          var fb = document.getElementById("fb");
          if (ok) {
            SP.combo++;
            if (SP.combo > SP.best) SP.best = SP.combo;
            if (SP.combo > (S.bestcombo || 0)) {
              S.bestcombo = SP.combo;
              save();
            }
            var m = SP.combo >= 5 ? 3 : SP.combo >= 3 ? 2 : 1;
            SP.score += m;
            S.correct++;
            earnStars(m);
            bumpQuest("correct", 1);
            if (listen) tripBump("hear", 1);
            addXp(Math.round(8 * m * diff().mult));
            sndOk();
            burst(30 + 16 * m);
            mood("cheer");
            if (SP.combo === 3 || SP.combo === 5) comboFlash(SP.combo);
            if (SP.combo >= 10) comboTen();
            fb.className = "feedback ok";
            fb.textContent = "Rätt! ⭐";
          } else {
            SP.combo = 0;
            sndNo();
            mood("oops");
            speak(w.et);
            fb.className = "feedback no";
            fb.textContent = w.sv + " heter " + w.et;
          }
          setTimeout(
            function () {
              if (SP) speedRound();
            },
            ok ? 1000 : 2100,
          );
        };
      })(btns[i]);
    }
  }
  function speedEnd() {
    var right = 0,
      i;
    for (i = 0; i < SP.results.length; i++) {
      if (SP.results[i]) right++;
    }
    var sc = SP.score,
      bc = SP.best,
      n = SP.n;
    var rec = right > (S.mixbest || 0);
    if (rec) S.mixbest = right;
    bumpQuest("mixed", 1);
    tripBump("mix", 1);
    addXp(right * 2);
    save();
    var newB = checkBadges();
    SP = null;
    burst(right >= n * 0.8 ? 180 : 110);
    var st = right >= n * 0.95 ? 3 : right >= n * 0.7 ? 2 : right >= n * 0.4 ? 1 : 0;
    var html =
      '<div class="card" style="text-align:center"><div class="bigstars">' +
      starStr(st) +
      "</div>" +
      '<div class="bigscore">' +
      right +
      " / " +
      n +
      "</div>" +
      '<p class="q">' +
      (rec
        ? "Ditt bästa hittills" + (S.name ? ", " + esc(S.name) : "") + "!"
        : st >= 2
          ? "Fint jobbat!"
          : "Bra kämpat!") +
      "</p>" +
      '<p class="qsub">Bästa kombo: ' +
      bc +
      " i rad · " +
      sc +
      " poäng samlade</p>" +
      '<div class="center">' +
      siilSVG("small") +
      "</div>";
    if (newB.length) {
      html += '<div style="margin-top:8px">';
      for (i = 0; i < newB.length; i++) {
        html += '<span class="badge">' + newB[i].em + " " + esc(newB[i].sv) + "</span>";
      }
      html += "</div>";
    }
    html +=
      '<div class="row"><button class="btn green big" id="again">En runda till 🎲</button>' +
      '<button class="btn ghost big" id="home">Tillbaka</button></div></div>';
    app.innerHTML = html;
    mood("cheer");
    document.getElementById("again").onclick = function () {
      speedIntro();
    };
    document.getElementById("home").onclick = function () {
      go(homeScreen, false);
    };
    refreshTop();
  }

  /* ---------- ORDLISTA ---------- */
  function wordRow(w) {
    return (
      '<div class="wordrow"><span class="em">' +
      wIcon(w) +
      '</span><span class="t"><b>' +
      esc(w.et) +
      "</b>" +
      "<span>" +
      esc(w.sv) +
      " · uttal: " +
      esc(w.hint || "") +
      "</span></span>" +
      '<button class="speakbtn sm" data-say="' +
      esc(w.et) +
      '" aria-label="Hör ordet">🔊</button>' +
      '<button class="speakbtn sm" data-slow="' +
      esc(w.et) +
      '" aria-label="Hör ordet långsamt">🐢</button></div>'
    );
  }
  function listScreen() {
    screen = "list";
    setNav("words");
    prefetch("trip");
    prefetchAllThemes();
    if (S.listOpen === undefined) S.listOpen = "";
    var q = (S.listQ || "").trim().toLowerCase();
    var html =
      '<div class="zone words"><span class="zem">📖</span><span><b>Sõnastik</b>' +
      "<span>Ordlistan — 🔊 hör ordet, 🐢 hör det långsamt</span></span></div>" +
      '<div class="searchbar"><span>🔎</span>' +
      '<input id="wq" type="search" placeholder="Sök på svenska eller estniska" value="' +
      esc(S.listQ || "") +
      '" autocomplete="off">' +
      (q ? '<button class="btn small ghost" id="wqclear">Rensa</button>' : "") +
      "</div>";

    if (q) {
      /* sökläge: alla träffar i en lista */
      var hits = [],
        seen = {},
        all = allWords(),
        i;
      for (i = 0; i < all.length; i++) {
        var w = all[i];
        if (seen[w.et]) continue;
        if (w.et.toLowerCase().indexOf(q) >= 0 || w.sv.toLowerCase().indexOf(q) >= 0) {
          seen[w.et] = 1;
          hits.push(w);
        }
      }
      html += '<div class="card"><div class="listhead">' + hits.length + " träffar</div>";
      if (!hits.length) html += '<p class="qsub">Inget ord matchar. Prova en annan del av ordet.</p>';
      for (i = 0; i < hits.length && i < 80; i++) html += wordRow(hits[i]);
      if (hits.length > 80)
        html += '<p class="qsub">… och ' + (hits.length - 80) + " till. Skriv mer för att hitta rätt.</p>";
      html += "</div>";
    } else {
      var tw = tripWords();
      if (tw.length) {
        var openTrip = S.listOpen === "trip";
        html +=
          '<div class="card"><button class="listhead btn-plain" data-open="trip">' +
          "<span>🗺️ " +
          esc(UI.trip.et) +
          " <small>ord från resan · " +
          tw.length +
          "</small></span>" +
          '<span class="caret">' +
          (openTrip ? "▾" : "▸") +
          "</span></button>";
        if (openTrip) for (var q2 = 0; q2 < tw.length; q2++) html += wordRow(tw[q2]);
        html += "</div>";
      }
      for (var i2 = 0; i2 < THEMES.length; i2++) {
        var t = THEMES[i2],
          mm = themeMastery(t),
          op = S.listOpen === t.id;
        html +=
          '<div class="card"><button class="listhead btn-plain" data-open="' +
          t.id +
          '">' +
          "<span>" +
          t.em +
          " " +
          esc(t.et) +
          (mm.medal ? " " + masteryEm(mm.medal) : "") +
          " <small>" +
          esc(t.sv) +
          " · " +
          mm.strong +
          "/" +
          mm.total +
          " sitter</small></span>" +
          '<span class="caret">' +
          (op ? "▾" : "▸") +
          "</span></button>";
        if (op) for (var j = 0; j < t.words.length; j++) html += wordRow(t.words[j]);
        html += "</div>";
      }
    }
    app.innerHTML = html;
    var inp = document.getElementById("wq");
    if (inp) {
      inp.oninput = function () {
        S.listQ = inp.value;
        save();
        var pos = inp.selectionStart;
        listScreen();
        var el = document.getElementById("wq");
        if (el) {
          el.focus();
          try {
            el.setSelectionRange(pos, pos);
          } catch (e) {}
        }
      };
    }
    var cl = document.getElementById("wqclear");
    if (cl)
      cl.onclick = function () {
        S.listQ = "";
        save();
        listScreen();
      };
    var ob = app.querySelectorAll("[data-open]"),
      oi;
    for (oi = 0; oi < ob.length; oi++) {
      (function (el) {
        el.onclick = function () {
          var id = el.getAttribute("data-open");
          S.listOpen = S.listOpen === id ? "" : id;
          save();
          listScreen();
        };
      })(ob[oi]);
    }
    var b = app.querySelectorAll("[data-say]");
    for (var k = 0; k < b.length; k++) {
      (function (el) {
        el.onclick = function () {
          speak(el.getAttribute("data-say"));
        };
      })(b[k]);
    }
    var sl = app.querySelectorAll("[data-slow]");
    for (var n = 0; n < sl.length; n++) {
      (function (el) {
        el.onclick = function () {
          speak(el.getAttribute("data-slow"), true);
        };
      })(sl[n]);
    }
  }

  /* ---------- LEKTION ---------- */
  var L = null;
  /* övning med bara läxorden: körs som ett vanligt tema. Ord som redan sitter är med
       som repetition och svarsalternativ, men de nya och vacklande lärs in först. */
  function schoolLessonStart() {
    var s = schoolSet();
    if (!s) {
      schoolImport();
      return;
    }
    var known = s.words.filter(function (w) {
      return schoolKnows(w);
    });
    lessonStart("school", {
      id: "school",
      school: true,
      et: "Koolisõnad",
      sv: s.name || "Veckans ord",
      em: "📝",
      words: schoolLeft().concat(known),
    });
  }
  function lessonStart(themeId, theme) {
    var t = theme || null,
      i;
    if (!t) {
      prefetchTheme(themeId);
      for (i = 0; i < THEMES.length; i++) {
        if (THEMES[i].id === themeId) t = THEMES[i];
      }
    }
    if (!t) {
      homeScreen();
      return;
    }
    /* visa bara de ord som behöver mötas: nya och sådana som vacklar */
    /* högst fem nya ord åt gången – arbetsminnet rymmer inte fler */
    var pool = stepWords(t),
      fresh = [],
      shaky = [],
      i2,
      mm2;
    for (i2 = 0; i2 < pool.length; i2++) {
      mm2 = (S.wordmem || {})[mkey(pool[i2].et, pool[i2].sv)];
      if (!mm2 || (mm2.r || 0) === 0) fresh.push(pool[i2]);
      else if ((mm2.s || 0) < 2 || wmemDue(pool[i2].et, pool[i2].sv) >= 0) shaky.push(pool[i2]);
    }
    /* vacklar flera ord redan? då får färre nya in denna gång, så repetitionen får plats */
    var dueShaky = shaky.filter(function (w) {
      return wmemDue(w.et, w.sv) >= 0;
    }).length;
    var freshBudget = Math.max(2, 5 - Math.min(3, dueShaky));
    var need = fresh.slice(0, freshBudget);
    if (!need.length) need = shaky.slice(0, 3);
    if (!need.length) need = t.words.slice(0, 3);
    L = { theme: t, phase: "learn", learnIdx: 0, learnList: need, rounds: [], idx: 0, results: [], right: 0 };
    learnCard();
  }
  function learnCard() {
    screen = "learn";
    var t = L.theme,
      list = L.learnList || t.words,
      w = list[L.learnIdx];
    var html =
      '<div class="qsub">Lär dig först · ' +
      (L.learnIdx + 1) +
      " av " +
      list.length +
      (list.length < t.words.length ? ' <span style="color:var(--moss)">(bara orden som behöver övas)</span>' : "") +
      "</div>" +
      '<div class="card">' +
      promptHtml(w, w.et, "et") +
      '<div class="trans">' +
      esc(w.sv) +
      "</div>" +
      '<div class="hint">säg så här: ' +
      esc(w.hint) +
      "</div>" +
      '<div class="center"><button class="speakbtn" id="say" aria-label="Hör ordet igen">🔊</button>' +
      '<button class="speakbtn sm" id="slow" aria-label="Hör ordet långsamt">🐢</button></div>' +
      '<button class="btn wide big" id="next">' +
      (L.learnIdx < list.length - 1 ? "Nästa ord →" : "Nu kör vi! 🎈") +
      "</button>" +
      (list.length > 2
        ? '<button class="btn ghost wide" id="skiplearn" style="margin-top:8px">⏩ Hoppa till frågorna</button>'
        : "") +
      "</div>" +
      '<div class="center">' +
      siilSVG("small") +
      "</div>";
    app.innerHTML = html;
    speak(w.et);
    document.getElementById("say").onclick = function () {
      speak(w.et);
    };
    document.getElementById("slow").onclick = function () {
      speak(w.et, true);
    };
    var sk = document.getElementById("skiplearn");
    if (sk)
      sk.onclick = function () {
        L.phase = "play";
        buildRounds();
        nextRound();
      };
    document.getElementById("next").onclick = function () {
      var list = L.learnList || L.theme.words;
      if (L.learnIdx < list.length - 1) {
        L.learnIdx++;
        learnCard();
      } else {
        buildRounds();
        nextRound();
      }
    };
  }
  /* lägger frågorna i en båge: lugn start, svårast i mitten, lätt vinst sist */
  function dramaOrder(rounds) {
    if (!rounds || rounds.length < 5) return shuffle(rounds);
    var r = shuffle(rounds.slice());
    function hardness(x) {
      var h = 0,
        m = x.w ? (S.wordmem || {})[mkey(x.w.et, x.w.sv)] || null : null;
      if (m) h += Math.max(0, 3 - (m.s || 0)) + Math.min(3, m.m || 0) * 0.8;
      else h += 2.2; /* osett ord är ganska svårt */
      if (x.type === "type") h += 2.2; /* skriva är svårast */
      else if (x.type === "speak") h += 1.2;
      else if (x.type === "listen") h += 0.8;
      return h;
    }
    r.sort(function (a, b) {
      return hardness(a) - hardness(b);
    });
    var n = r.length,
      out = new Array(n),
      i;
    /* bygg bågen: 0,1 lätta → mitten svår → sista lätt */
    var easy = r.slice(0, Math.ceil(n * 0.4)); /* lättaste 40 % */
    var hard = r.slice(Math.ceil(n * 0.4)); /* resten */
    out[0] = easy.shift();
    out[1] = easy.shift() || hard.pop();
    out[n - 1] = easy.pop() || hard.pop(); /* en lätt vinst sist */
    var mid = [],
      k;
    while (hard.length) mid.push(hard.shift());
    while (easy.length) mid.push(easy.shift());
    /* svåraste mot mitten: varva in från båda håll */
    mid.sort(function (a, b) {
      return hardness(b) - hardness(a);
    });
    var free = [];
    for (i = 2; i <= n - 2; i++) free.push(i);
    /* mitten först, sedan utåt */
    free.sort(function (a, b) {
      return Math.abs(a - (n - 1) / 2) - Math.abs(b - (n - 1) / 2);
    });
    for (k = 0; k < free.length; k++) out[free[k]] = mid[k];
    for (i = 0; i < n; i++) if (!out[i]) out[i] = mid[mid.length - 1];
    return out.filter(function (x) {
      return !!x;
    });
  }
  function markGolden(list) {
    var i,
      n = Math.max(1, Math.round(list.length / 12));
    var idx = shuffle(
      list.map(function (_, k) {
        return k;
      }),
    ).slice(0, n);
    for (i = 0; i < idx.length; i++) list[idx[i]].gold = true;
    return list;
  }
  /* dramaturgin ordnar frågorna efter svårighet, men ett enskilt ord ska ändå
       alltid mötas i ordningen höra → välja → säga → skriva. Här byts typerna
       plats inom ordet, utan att rubba bågen lätt → svår → lätt. */
  function fixWordPath(r) {
    var rank = { listen: 0, choose: 1, speak: 2, type: 3 },
      byW = {},
      i,
      k;
    for (i = 0; i < r.length; i++) {
      k = r[i].w && r[i].w.et;
      if (!k) continue;
      if (!byW[k]) byW[k] = [];
      byW[k].push(i);
    }
    for (k in byW) {
      var idx = byW[k];
      if (idx.length < 2) continue;
      var ts = [];
      for (i = 0; i < idx.length; i++) ts.push(r[idx[i]].type);
      ts.sort(function (a, b) {
        return (rank[a] || 0) - (rank[b] || 0);
      });
      for (i = 0; i < idx.length; i++) r[idx[i]].type = ts[i];
    }
    return r;
  }
  /* teman som är indelade i steg (färgerna) släpper fram nästa steg först när
       det föregående sitter. Barnet lär sig grundfärgerna innan helesinine dyker upp. */
  function stepReached(t) {
    var step = 1,
      s,
      i,
      all,
      m;
    for (step = 1; step < 3; step++) {
      all = true;
      for (i = 0; i < t.words.length; i++) {
        if ((t.words[i].step || 1) !== step) continue;
        m = (S.wordmem || {})[mkey(t.words[i].et, t.words[i].sv)];
        if (!m || (m.s || 0) < 1 || (m.r || 0) < 2) {
          all = false;
          break;
        }
      }
      if (!all) return step;
    }
    return 3;
  }
  function hasSteps(t) {
    var i;
    for (i = 0; i < t.words.length; i++) {
      if (t.words[i].step) return true;
    }
    return false;
  }
  function stepWords(t) {
    if (!hasSteps(t)) return t.words;
    var max = stepReached(t),
      out = [],
      i;
    for (i = 0; i < t.words.length; i++) {
      if ((t.words[i].step || 1) <= max) out.push(t.words[i]);
    }
    return out.length ? out : t.words;
  }
  function buildRounds() {
    /* passet: orden som just lärts in + repetition som fallit due, 10–12 frågor */
    var learned = (L.learnList || []).slice(),
      rest = [],
      i0,
      mm0;
    var tw = stepWords(L.theme);
    for (i0 = 0; i0 < tw.length; i0++) {
      var w0 = tw[i0],
        isNew = false,
        k0;
      for (k0 = 0; k0 < learned.length; k0++) if (learned[k0].et === w0.et) isNew = true;
      if (isNew) continue;
      mm0 = (S.wordmem || {})[mkey(w0.et, w0.sv)];
      if (mm0 && (mm0.r || 0) > 0) rest.push(w0);
    }
    rest = pickWeighted(rest, rest.length);
    /* ord som blev fel en tidigare dag går före allt annat */
    if (S.redo) {
      var rd = [],
        rk,
        zi;
      for (zi = rest.length - 1; zi >= 0; zi--) {
        rk = rest[zi].et;
        if (S.redo[rk] !== undefined && S.redo[rk] < today0()) {
          rd.push(rest[zi]);
          rest.splice(zi, 1);
        }
      }
      rest = rd.concat(rest);
    }
    /* fem nya ord ×2 fyllde hela passet, så repetitionen trängdes ut helt.
           Nu reserveras alltid plats för gamla ord som fallit due. */
    var newQ = learned.length * 2;
    var want = Math.min(12, Math.max(10, newQ + Math.min(5, rest.length)));
    var ws = learned.concat(learned); /* varje nytt ord möts två gånger */
    for (i0 = 0; ws.length < want && i0 < rest.length; i0++) ws.push(rest[i0]);
    if (ws.length < 8) ws = pickWeighted(tw, Math.min(10, tw.length));
    ws = shuffle(ws);
    var r = [],
      i,
      types = diff().types.slice();
    if (!micOK || micBlocked) {
      for (i = 0; i < types.length; i++) {
        if (types[i] === "speak") types[i] = "listen";
      }
    }
    /* varje ord går samma väg: höra → välja → säga → skriva.
           Ett ord ska aldrig behöva skrivas innan det hörts ett par gånger. */
    var seenW = {};
    for (i = 0; i < ws.length; i++) {
      var wq = ws[i],
        mq = (S.wordmem || {})[mkey(wq.et, wq.sv)] || {},
        rq = mq.r || 0,
        t;
      seenW[wq.et] = (seenW[wq.et] || 0) + 1;
      if (rq === 0 && seenW[wq.et] === 1) t = "listen"; /* första mötet: hör ordet */
      else if (rq === 0 && seenW[wq.et] === 2) t = "choose"; /* andra: känn igen det */
      else if (rq < 2) t = "choose"; /* fortfarande färskt */
      else t = types[i % types.length];
      if (t === "speak" && (!micOK || micBlocked)) t = "listen";
      r.push({ type: t, w: wq });
    }
    /* skrivfrågor dök nästan aldrig upp: bara ord med r>=2 kan få dem, och
           typen lottades 1 på 4. Uppdraget "Skriv ord rätt" gick därför inte att klara.
           Nu får varje pass minst en skrivfråga så fort något ord är moget för det. */
    if (diff().types.indexOf("type") >= 0) {
      var hasType = 0,
        eligible = [],
        rq2;
      for (i = 0; i < r.length; i++) {
        if (r[i].type === "type") hasType++;
        rq2 = ((S.wordmem || {})[mkey(r[i].w.et, r[i].w.sv)] || {}).r || 0;
        if (rq2 >= 2) eligible.push(i);
      }
      var wantType = Math.min(eligible.length, hasType ? 2 : 1);
      for (i = eligible.length - 1; i >= 0 && hasType < wantType; i--) {
        if (r[eligible[i]].type !== "type") {
          r[eligible[i]].type = "type";
          hasType++;
        }
      }
    }
    L.rounds = fixWordPath(markGolden(dramaOrder(r)));
    L.idx = 0;
    L.results = [];
    L.right = 0;
    L.combo = 0;
    L.bestCombo = 0;
  }
  /* serien ligger i ett litet chip på prickraden – den ska inte konkurrera med ordet */
  function meterHtml() {
    return "";
  }
  function dots() {
    var s = '<div class="progressdots">',
      i;
    for (i = 0; i < L.rounds.length; i++) {
      var c = "dot",
        res = L.results[i];
      if (i < L.results.length) {
        c += res === "skip" ? " skip" : res ? " ok" : " no";
      } else if (i === L.idx) {
        c += " now";
      }
      s += '<span class="' + c + '"></span>';
    }
    s += "</div>";
    var cc = L.combo || 0,
      mult = cc >= 5 ? 3 : cc >= 3 ? 2 : 1;
    var chip = cc > 1 ? '<span class="fchip">🔥 ' + cc + (mult > 1 ? " · ×" + mult : "") + "</span>" : "";
    return '<div class="dotrow">' + s + chip + "</div>";
  }
  /* säsongens löv och snö är fina på startsidan, men de drar blicken i en övning */
  function calmFx() {
    try {
      if (!parts || !parts.length) return;
      for (var i = parts.length - 1; i >= 0; i--) {
        if (parts[i].snow) parts.splice(i, 1);
      }
      if (ctx) ctx.clearRect(0, 0, innerWidth, innerHeight);
    } catch (e) {}
  }
  function nextRound() {
    calmFx();
    if (L.idx >= L.rounds.length) {
      resultScreen();
      return;
    }
    var r = L.rounds[L.idx];
    if (r.type === "listen") roundListen(r);
    else if (r.type === "choose") roundChoose(r);
    else if (r.type === "type") roundType(r);
    else roundSpeak(r);
  }
  function distractors(w, n) {
    var tw2 = stepWords(L.theme);
    /* läxlistan kan vara kort – fyll på med andra ord så att det finns något att välja mellan */
    if (L.theme.school && tw2.length < n + 1)
      tw2 = tw2.concat(shuffle(allWords().filter(hasPic)).slice(0, n + 1 - tw2.length));
    n = Math.max(2, Math.min(n, tw2.length - 1));
    var pool = [],
      i;
    for (i = 0; i < tw2.length; i++) {
      if (tw2[i].et !== w.et) pool.push(tw2[i]);
    }
    pool = shuffle(pool).slice(0, n);
    return shuffle(pool.concat([w]));
  }
  function struggling() {
    return L && (L.missRun || 0) >= 3;
  }
  /* sitter ordet? då behövs inte svenskan längre – bilden räcker (scaffold fading) */
  function wordSolid(w) {
    var m = w && (S.wordmem || {})[mkey(w.et, w.sv)];
    return !!(m && (m.s || 0) >= 2 && (m.r || 0) >= 3 && (m.m || 0) === 0);
  }
  /* svensk undertext, eller en diskret plats där den brukade stå */
  function transHtml(w, size) {
    /* utan bild är svenskan det enda som visar vilket ord som menas */
    if (wordSolid(w) && hasPic(w)) return '<div class="trans faded">utan svenska nu · du kan det här</div>';
    return '<div class="trans" style="font-size:' + size + 'px">' + esc(w.sv) + "</div>";
  }
  /* ledordet och bilden sida vid sida: bilden hjälper till, men ordet är det man läser.
       Utan säker bild står ordet ensamt. */
  function promptHtml(w, text, lang) {
    var ic = diff().emoji ? wIcon(w) : "";
    return (
      '<div class="prompt">' +
      (ic ? '<span class="pem" aria-hidden="true">' + ic + "</span>" : "") +
      '<span class="pword"' +
      (lang ? ' lang="' + lang + '"' : "") +
      ">" +
      esc(text) +
      "</span></div>"
    );
  }
  /* färre alternativ när det kärvar */
  function optCount() {
    return struggling() ? Math.min(3, diff().opts) : diff().opts;
  }
  function answered(ok, extra) {
    L.results[L.idx] = ok;
    L.missRun = ok ? 0 : (L.missRun || 0) + 1;
    /* hon märker när ett ord som brukade vackla äntligen sitter */
    try {
      var rw = L.rounds[L.idx] && L.rounds[L.idx].w;
      if (ok && rw) {
        var mm = (S.wordmem || {})[mkey(rw.et, rw.sv)];
        if (mm && mm.m >= 2 && mm.r >= 2 && !L.saidFix) {
          L.saidFix = true;
          queuePraise("Nüüd sa oskad!");
          setTimeout(function () {
            siiriClass("wob", 900);
          }, 700);
        }
      }
    } catch (e) {}
    /* var ordet svårt innan? spara det före minnet uppdateras */
    var hardBefore = false,
      cameBack = false;
    if (L.rounds[L.idx] && L.rounds[L.idx].w) {
      var mb = (S.wordmem || {})[mkey(L.rounds[L.idx].w.et, L.rounds[L.idx].w.sv)];
      hardBefore = !!(mb && (mb.m || 0) > 0 && (mb.s || 0) < 2);
      cameBack = !!(mb && (mb.m || 0) >= 2 && (mb.s || 0) >= 1.5);
    }
    if (L.rounds[L.idx] && L.rounds[L.idx].w)
      wmemHit(L.rounds[L.idx].w.et, ok, L.rounds[L.idx].type, L.rounds[L.idx].w.sv);
    /* satt det nu? då behöver det inte tas upp i morgon */
    if (ok && S.redo && L.rounds[L.idx] && L.rounds[L.idx].w) {
      delete S.redo[L.rounds[L.idx].w.et];
      save();
    }
    if (ok) {
      L.right++;
      S.correct++;
      L.combo = (L.combo || 0) + 1;
      if (L.combo > (L.bestCombo || 0)) L.bestCombo = L.combo;
      if (L.combo > (S.bestcombo || 0)) S.bestcombo = L.combo;
      var mult = L.combo >= 5 ? 3 : L.combo >= 3 ? 2 : 1;
      if (extra === "speak") S.spoken++;
      if (extra === "type") S.typed++;
      if (extra === "type") tripBump("type", 1);
      /* både att säga ordet och att höra och välja rätt räknas – mikrofon behövs aldrig */
      if (extra === "speak") tripBump("hear", 1);
      else if (L.rounds[L.idx] && L.rounds[L.idx].type === "listen") tripBump("hear", 1);
      bumpQuest("correct", 1);
      if (extra === "speak") bumpQuest("spoken", 1);
      if (extra === "type") bumpQuest("typed", 1);
      var gold = L.rounds[L.idx] && L.rounds[L.idx].gold;
      var hardX = hardBefore ? 2 : 1; /* ord du missat förut är värda dubbelt */
      addXp(Math.round(10 * mult * diff().mult * (gold ? 2 : 1) * hardX));
      earnStars((gold ? mult * 3 : mult) * hardX);
      if (hardBefore && !gold) {
        L.hardWon = (L.hardWon || 0) + 1;
        var hw = document.createElement("div");
        hw.className = "combo hardwin";
        hw.innerHTML = "💪 Raske sõna ×2";
        document.body.appendChild(hw);
        setTimeout(function () {
          hw.remove();
        }, 1100);
        tone(880, 0.1, 0);
        tone(1180, 0.16, 0.1);
      }
      /* ordet som inte satt förut sitter nu */
      if (cameBack && L.rounds[L.idx] && L.rounds[L.idx].w) {
        L.fixed = L.fixed || [];
        var fw = L.rounds[L.idx].w,
          dup = false,
          fz;
        for (fz = 0; fz < L.fixed.length; fz++) if (L.fixed[fz].et === fw.et) dup = true;
        if (!dup) L.fixed.push(fw);
      }
      if (gold) {
        petals(40, ["#FFD45E", "#FFF3C4", "#FFE9A8"]);
        tone(1320, 0.12, 0);
        tone(1760, 0.2, 0.12);
        var g = document.createElement("div");
        g.className = "combo";
        g.style.color = "var(--honey-deep)";
        g.textContent = "✨ Kuldsõna ×3";
        document.body.appendChild(g);
        setTimeout(function () {
          g.remove();
        }, 1000);
      }
      save();
      /* kolla bragder direkt, inte bara vid rundans slut - den allra första
         "Nytt märke!" ska komma inom sekunder, inte efter 10-12 frågor */
      var newBadges = checkBadges();
      if (newBadges.length) badgeToast(newBadges);
      sndOk();
      buzz(18);
      mood("cheer");
      if (L.combo === 5 || L.combo === 10) dance(L.combo >= 10);
      if (L.combo >= 3) comboFlash(L.combo);
      if (L.combo >= 10) comboTen();
      if (mult > 1) tone(1320, 0.12, 0.3);
    } else {
      L.combo = 0;
      sndNo();
      buzz([12, 60, 12]);
      mood("oops");
      /* ordet kommer tillbaka om 2–3 frågor, medan det fortfarande sitter i huvudet */
      var r0 = L.rounds[L.idx];
      if (r0 && !r0.again && L.rounds.length < 26) {
        var back = { type: r0.type === "type" || r0.type === "speak" ? "listen" : r0.type, w: r0.w, again: true };
        var at = Math.min(L.rounds.length, L.idx + 2 + ((Math.random() * 2) | 0));
        L.rounds.splice(at, 0, back);
      }
      /* och en gång till i morgon */
      if (r0 && r0.w) {
        if (!S.redo) S.redo = {};
        S.redo[r0.w.et] = today0();
        save();
      }
    }
    refreshTop();
    /* inget försvinner av sig självt – barnet bestämmer när nästa fråga kommer */
    L.waiting = true;
    var rw = L.rounds[L.idx] && L.rounds[L.idx].w,
      ag = false,
      zz;
    if (!ok && rw)
      for (zz = L.idx + 1; zz < L.rounds.length; zz++) {
        if (L.rounds[zz].again && L.rounds[zz].w && L.rounds[zz].w.et === rw.et) ag = true;
      }
    showAnswer(rw, ag);
  }
  function goNext() {
    if (!L || !L.waiting) return;
    L.waiting = false;
    clearTimeout(L.timer);
    L.idx++;
    nextRound();
  }
  /* svarsrutan: estniskan störst, ljudet spelas en gång, och den ligger kvar */
  function showAnswer(w, again) {
    var slot = document.getElementById("ansslot");
    if (!slot) {
      var card = app.querySelector(".card");
      if (!card) return;
      slot = document.createElement("div");
      slot.className = "ansslot";
      slot.id = "ansslot";
      card.appendChild(slot);
    }
    /* frågans kontroller (t.ex. bokstäverna och Valmis) byts mot svaret på samma plats och höjd */
    var fb = document.getElementById("fb"),
      ctl = document.getElementById("qctl");
    var good = !fb || fb.className.indexOf(" no") < 0;
    if (ctl) {
      slot.style.minHeight = ctl.offsetHeight + "px";
      ctl.parentNode.insertBefore(slot, ctl.nextSibling);
      ctl.hidden = true;
    }
    var h = '<div class="ansbox ' + (good ? "good" : "bad") + '"><div class="anspanel">';
    if (w) {
      h +=
        '<div class="answrap"><span class="answord" lang="et">' +
        esc(w.et) +
        "</span>" +
        '<button class="speakbtn sm" id="ansay" aria-label="Hör ordet">🔊</button>' +
        '<button class="speakbtn sm" id="anslow" aria-label="Hör ordet långsamt">🐢</button></div>' +
        '<div class="anssv"><span lang="et">' +
        esc(w.et) +
        "</span> = " +
        esc(w.sv) +
        "</div>";
    }
    if (again) h += '<div class="ansagain">🔁 Vi tar det igen snart</div>';
    h += '</div><button class="btn green wide nextbtn" id="goon">Edasi · Nästa →</button></div>';
    slot.innerHTML = h;
    /* berömmet (eller "ingen fara") hamnar överst i samma panel som ordet */
    var panel = slot.querySelector(".anspanel");
    if (fb && fb.innerHTML && panel) panel.insertBefore(fb, panel.firstChild);
    var b = document.getElementById("ansay");
    if (b && w)
      b.onclick = function () {
        speak(w.et);
      };
    b = document.getElementById("anslow");
    if (b && w)
      b.onclick = function () {
        speak(w.et, true);
      };
    b = document.getElementById("goon");
    if (b) b.onclick = goNext;
    if (w) {
      /* först ordet, sedan berömmet om det finns ett i kö */
      var after = pendingPraise;
      pendingPraise = null;
      setTimeout(function () {
        if (after) speakSeq([w.et, after]);
        else speak(w.et);
      }, 200);
    }
    try {
      slot.scrollIntoView({ block: "nearest", behavior: "smooth" });
    } catch (e) {}
  }
  /* att hoppa över är inte ett fel – prick och serie lämnas i fred */
  function skipRound() {
    if (!L || L.waiting) return;
    L.results[L.idx] = "skip";
    var r0 = L.rounds[L.idx];
    if (r0 && !r0.again && L.rounds.length < 26) L.rounds.push({ type: "listen", w: r0.w, again: true });
    L.waiting = true;
    refreshTop();
    showAnswer(r0 && r0.w, true);
  }
  function roundListen(r) {
    screen = "q";
    var opts = distractors(r.w, optCount() - 1),
      i,
      pics = hasPic(r.w);
    /* läxord har ingen bild: då väljer barnet bland de svenska orden i stället */
    var html =
      dots() +
      meterHtml() +
      '<div class="card' +
      (r.gold ? " golden" : "") +
      '"><p class="q">' +
      (pics ? "Vilken bild hör du?" : "Vilket ord hör du?") +
      '</p><p class="qsub">Tryck på högtalaren och lyssna noga.</p>' +
      '<div class="center"><button class="speakbtn" id="say" aria-label="Spela upp ordet">🔊</button></div><div class="opts">';
    for (i = 0; i < opts.length; i++) {
      html +=
        '<button class="opt" data-et="' +
        esc(opts[i].et) +
        '">' +
        (pics
          ? '<span class="oem">' + wIcon(opts[i]) + "</span><small>" + esc(opts[i].sv) + "</small>"
          : "<b>" + esc(opts[i].sv) + "</b>") +
        "</button>";
    }
    html +=
      '</div><div class="feedback" id="fb"></div><div class="ansslot" id="ansslot"></div></div><div class="center">' +
      siilSVG("small") +
      "</div>";
    app.innerHTML = html;
    speak(r.w.et);
    document.getElementById("say").onclick = function () {
      speak(r.w.et);
    };
    var btns = app.querySelectorAll(".opt");
    for (i = 0; i < btns.length; i++) {
      (function (el) {
        el.onclick = function () {
          var ok = el.getAttribute("data-et") === r.w.et,
            j;
          for (j = 0; j < btns.length; j++) {
            btns[j].disabled = true;
            if (btns[j].getAttribute("data-et") === r.w.et) {
              btns[j].classList.add("right");
              stampOn(btns[j], "⭐");
            }
          }
          if (!ok) {
            el.classList.add("wrong");
            stampOn(el, "❌");
          }
          praiseSay(L.combo + (ok ? 1 : 0), ok, document.getElementById("fb"));
          answered(ok);
        };
      })(btns[i]);
    }
  }
  function roundChoose(r) {
    screen = "q";
    var opts = distractors(r.w, optCount() - 1),
      i;
    /* svenskan står alltid kvar: bilderna stämmer inte alltid, så ordet är ledtråden.
       På Lätt (barn som kanske inte läser än) får varje alternativ ändå en liten
       bild - annars är den som inte kan läsa orden helt utlämnad åt gissning. */
    var withPics = diff().id === "latt";
    var html =
      dots() +
      meterHtml() +
      '<div class="card' +
      (r.gold ? " golden" : "") +
      '"><p class="q">Mis see on? · Vad heter det?</p>' +
      promptHtml(r.w, r.w.sv) +
      '<div class="opts' +
      (withPics ? "" : " txt") +
      '">';
    for (i = 0; i < opts.length; i++) {
      html +=
        '<button class="opt" data-et="' +
        esc(opts[i].et) +
        '" lang="et">' +
        (withPics && hasPic(opts[i])
          ? '<span class="oem">' + wIcon(opts[i]) + "</span><small lang=\"et\">" + esc(opts[i].et) + "</small>"
          : esc(opts[i].et)) +
        "</button>";
    }
    html +=
      '</div><div class="feedback" id="fb"></div><div class="ansslot" id="ansslot"></div></div><div class="center">' +
      siilSVG("small") +
      "</div>";
    app.innerHTML = html;
    var btns = app.querySelectorAll(".opt");
    for (i = 0; i < btns.length; i++) {
      (function (el) {
        el.onclick = function () {
          var ok = el.getAttribute("data-et") === r.w.et,
            j;
          /* rätt svar får en bock, resten tonas ned – lugnt, utan rött */
          for (j = 0; j < btns.length; j++) {
            btns[j].disabled = true;
            if (btns[j].getAttribute("data-et") === r.w.et) {
              btns[j].classList.add("right");
              btns[j].textContent += " ✓";
            } else btns[j].classList.add("dim");
          }
          praiseSay(L.combo + (ok ? 1 : 0), ok, document.getElementById("fb"));
          answered(ok);
        };
      })(btns[i]);
    }
  }
  /* hur långt ifrån är stavningen? används för att säga vad som gick fel */
  function lev(a, b) {
    var m = a.length,
      n = b.length,
      i,
      j,
      prev,
      cur,
      t;
    if (!m) return n;
    if (!n) return m;
    prev = [];
    for (j = 0; j <= n; j++) prev[j] = j;
    for (i = 1; i <= m; i++) {
      cur = [i];
      for (j = 1; j <= n; j++) {
        t = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + t);
      }
      prev = cur;
    }
    return prev[n];
  }
  /* "en bokstav saknas" är begripligt för ett barn, "inte riktigt" är det inte */
  function typoHint(got, want) {
    var g = norm(got || ""),
      w = norm(want || "");
    if (!g) return "Skriv ordet först.";
    if (g === w) return "Rätt!";
    if (w.indexOf(g) === 0) {
      var d = w.length - g.length;
      return d === 1 ? "Nästan! En bokstav saknas i slutet." : "Nästan! Det fattas " + d + " bokstäver i slutet.";
    }
    if (g.indexOf(w) === 0) return "Nästan! En bokstav för mycket i slutet.";
    var dist = lev(g, w);
    if (dist === 1) return "Nästan! En bokstav är fel.";
    if (dist === 2) return "Nära! Två bokstäver är fel.";
    return "Inte riktigt – prova en gång till.";
  }
  /* visar vilka bokstäver som satt rätt */
  function letterDiff(got, want) {
    var g = got || "",
      w = want || "",
      s = '<span class="ldiff" lang="et">',
      i;
    for (i = 0; i < g.length; i++) {
      var right = i < w.length && norm(g.charAt(i)) === norm(w.charAt(i));
      s += '<span class="' + (right ? "okch" : "badch") + '">' + esc(g.charAt(i)) + "</span>";
    }
    return s + "</span>";
  }
  /* visar det rätta ordet och markerar det som skiljer – även en bokstav som saknas
       ("kasvatu" → kasvatu<b>s</b>), vilket letterDiff inte kan visa */
  function wantDiff(got, want) {
    var g = (got || "").toLowerCase().replace(/\s+/g, " ").trim(),
      w = want || "",
      wl = w.toLowerCase(),
      p = 0,
      q = 0;
    while (p < g.length && p < wl.length && g.charAt(p) === wl.charAt(p)) p++;
    while (q < g.length - p && q < wl.length - p && g.charAt(g.length - 1 - q) === wl.charAt(wl.length - 1 - q)) q++;
    return (
      '<span class="ldiff" lang="et"><span class="okch">' +
      esc(w.slice(0, p)) +
      "</span>" +
      '<span class="badch">' +
      esc(w.slice(p, w.length - q)) +
      "</span>" +
      '<span class="okch">' +
      esc(w.slice(w.length - q)) +
      "</span></span>"
    );
  }
  function roundType(r) {
    screen = "q";
    /* specialtecknen och Valmis ligger i #qctl – svaret tar deras plats, så kortet inte hoppar */
    var html =
      dots() +
      meterHtml() +
      '<div class="card' +
      (r.gold ? " golden" : "") +
      '"><p class="q">Kirjuta eesti keeles · Skriv på estniska</p>' +
      promptHtml(r.w, r.w.sv) +
      '<div class="center qtools"><button class="speakbtn sm" id="say" aria-label="Hör ordet">🔊</button>' +
      (diff().peek ? '<button class="btn ghost" id="peek">💡 Första bokstaven</button>' : "") +
      "</div>" +
      '<input class="type" id="inp" lang="et" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="skriv här" inputmode="text">' +
      '<div class="qctl" id="qctl"><p class="keyslabel">Estniska bokstäver</p><div class="keys" id="keys"></div>' +
      '<button class="btn wide" id="ok">Valmis! · Klart</button>' +
      '<div class="feedback" id="fb"></div></div><div class="ansslot" id="ansslot"></div></div><div class="center">' +
      siilSVG("small") +
      "</div>";
    app.innerHTML = html;
    var inp = document.getElementById("inp"),
      fb = document.getElementById("fb"),
      tries = 0;
    var special = ["ä", "ö", "ü", "õ", "š", "ž"],
      keys = document.getElementById("keys"),
      i;
    for (i = 0; i < special.length; i++) {
      (function (ch) {
        var b = document.createElement("button");
        b.className = "key";
        b.type = "button";
        b.textContent = ch;
        b.onclick = function () {
          inp.value += ch;
          inp.focus();
        };
        keys.appendChild(b);
      })(special[i]);
    }
    document.getElementById("say").onclick = function () {
      speak(r.w.et);
    };
    var pk = document.getElementById("peek");
    if (pk)
      pk.onclick = function () {
        if (!inp.value) inp.value = r.w.et.charAt(0);
        inp.focus();
      };
    /* frågan kan bara besvaras en gång – förut gick Valmis att trycka igen och igen för nya poäng */
    var done = false;
    function finish(ok) {
      done = true;
      /* Valmis och bokstäverna försvinner när showAnswer byter #qctl mot svaret */
      var e = document.getElementById("peek");
      if (e) e.hidden = true;
      if (ok) inp.value = inp.value.trim() + " ✓";
      answered(ok, "type");
    }
    function check() {
      if (done) return;
      var got = inp.value,
        ok = norm(got) === norm(r.w.et),
        closeTry = false,
        nearly = false;
      /* på Lätt räcker det nära nog, men rätt stavning visas alltid */
      if (!ok && diff().id === "latt" && got && lev(norm(got), norm(r.w.et)) <= 1) ok = nearly = true;
      if (!ok && loose(got) === loose(r.w.et)) {
        tries++;
        inp.className = "type wrong";
        fb.className = "feedback no";
        fb.innerHTML = "Nästan! Kolla prickarna och krokarna.<br>" + letterDiff(got, r.w.et);
        setTimeout(function () {
          inp.className = "type";
        }, 600);
        if (tries < 2) return;
        closeTry = true;
      }
      if (ok && nearly) {
        /* godkänt, men barnet ska se att en bokstav blev fel – inget "du kan det här" */
        inp.className = "type right";
        inp.disabled = true;
        fb.className = "feedback ok";
        fb.innerHTML = "Nästan perfekt! Så här stavas det:<br>" + wantDiff(got, r.w.et);
        finish(true);
      } else if (ok) {
        inp.className = "type right";
        inp.disabled = true;
        praiseSay(L.combo + 1, true, fb);
        finish(true);
      } else if (closeTry) {
        /* redan på sitt andra (nästan-rätt) försök – räkna inte ett tredje här */
        inp.className = "type wrong";
        inp.disabled = true;
        fb.className = "feedback no";
        fb.innerHTML = typoHint(got, r.w.et);
        finish(false);
      } else {
        tries++;
        if (tries < 2) {
          inp.className = "type wrong";
          fb.className = "feedback no";
          fb.innerHTML = typoHint(got, r.w.et) + "<br>" + letterDiff(got, r.w.et);
          setTimeout(function () {
            inp.className = "type";
          }, 600);
        } else {
          inp.className = "type wrong";
          inp.disabled = true;
          fb.className = "feedback no";
          fb.innerHTML = typoHint(got, r.w.et);
          finish(false);
        }
      }
    }
    document.getElementById("ok").onclick = check;
    inp.onkeydown = function (e) {
      if (e.key === "Enter") check();
    };
    setTimeout(function () {
      inp.focus();
    }, 120);
  }
  function roundSpeak(r) {
    if (!micOK || micBlocked) {
      roundChoose(r);
      return;
    }
    screen = "q";
    var html =
      dots() +
      meterHtml() +
      '<div class="card' +
      (r.gold ? " golden" : "") +
      '"><p class="q">Ütle valjusti! · Säg ordet högt!</p><p class="qsub">Tryck på mikrofonen och säg ordet.</p>' +
      promptHtml(r.w, r.w.et, "et") +
      '<div class="trans">' +
      esc(r.w.sv) +
      "</div>" +
      (diff().hint ? '<div class="hint">säg så här: ' + esc(r.w.hint) + "</div>" : "") +
      '<div class="center"><button class="speakbtn sm" id="say" aria-label="Hör ordet först">🔊</button>' +
      '<button class="mic" id="mic" aria-label="Spela in din röst">🎤</button>' +
      '<button class="speakbtn sm" id="slow" aria-label="Hör ordet långsamt">🐢</button></div>' +
      '<div class="heard" id="heard"></div>' +
      '<div class="row"><button class="btn ghost" id="saidit">🗣️ Jag sa det högt!</button>' +
      '<button class="btn ghost" id="skip">Hoppa över</button></div>' +
      '<div class="feedback" id="fb"></div><div class="ansslot" id="ansslot"></div></div><div class="center">' +
      siilSVG("small") +
      "</div>";
    app.innerHTML = html;
    var mic = document.getElementById("mic"),
      heard = document.getElementById("heard"),
      fb = document.getElementById("fb");
    var tries = 0,
      busy = false;
    document.getElementById("say").onclick = function () {
      speak(r.w.et);
    };
    document.getElementById("slow").onclick = function () {
      speak(r.w.et, true);
    };
    /* barnet kan ha sagt ordet perfekt – mikrofonen är inte domaren */
    document.getElementById("saidit").onclick = function () {
      fb.className = "feedback ok";
      fb.textContent = "Tubli! · Duktigt!";
      answered(true, "speak");
    };
    document.getElementById("skip").onclick = function () {
      fb.className = "feedback";
      fb.textContent = "Ingen fara – vi övar mer sen!";
      skipRound();
    };
    mic.onclick = function () {
      if (busy) return;
      busy = true;
      stopSpeak();
      mic.classList.add("listening");
      heard.textContent = "Jag lyssnar …";
      listen(
        function (alts) {
          heard.textContent = "Du sa: " + alts[0];
          if (saidIt(alts, r.w.et)) {
            praiseSay(L.combo + 1, true, fb);
            answered(true, "speak");
          } else {
            tries++;
            if (tries < 2) {
              fb.className = "feedback no";
              fb.textContent = "Nästan! Lyssna en gång till och prova igen.";
              speak(r.w.et);
            } else {
              fb.className = "feedback no";
              fb.textContent = "Vi tar det igen nästa gång: " + r.w.et;
              answered(false);
            }
          }
        },
        function () {
          mic.classList.remove("listening");
          busy = false;
          if (!talking) mMood("");
        },
        function (err) {
          mic.classList.remove("listening");
          busy = false;
          mMood("");
          heard.innerHTML = esc(micProblem(err)) + (inFrame ? "<br>" + openTabHTML() : "");
        },
      );
    };
    if (!micOK) {
      heard.innerHTML =
        '🎤 Mikrofonen är avstängd. Det gör inget – säg ordet högt och tryck <b>Jag sa det högt!</b><br><span style="font-size:12.5px">' +
        esc(micProblem("noSR")) +
        (inFrame ? " " + openTabHTML() : "") +
        "</span>";
    } else if (inFrame) {
      heard.innerHTML =
        'Tryck på mikrofonen och säg ordet.<br><span style="font-size:12.5px">Händer inget? ' +
        openTabHTML("Öppna i egen flik") +
        "</span>";
    }
  }
  function maybeChest() {
    S.lessons = (S.lessons || 0) + 1;
    save();
    if (S.lessons % 3) return;
    var roll = Math.random(),
      pool = allWords();
    if (roll < 0.3) {
      var w = pool[(Math.random() * pool.length) | 0];
      pendAdd("🧰", "Bonuskista: " + esc(w.et), esc(w.sv) + " · ett ord på köpet");
    } else {
      var base = [10, 15, 20, 25, 30, 40][(Math.random() * 6) | 0];
      earnStars(base);
      save();
      refreshTop();
      pendAdd("🧰", "Bonuskista", "+" + base * starMult() + " stjärnor till marknaden");
    }
  }
  function resultScreen() {
    screen = "result";
    var total = L.rounds.length,
      right = L.right;
    var pct = right / total;
    var st = pct >= 0.95 ? 3 : pct >= 0.7 ? 2 : pct >= 0.4 ? 1 : 0;
    if (st > (S.best[L.theme.id] || 0)) {
      S.best[L.theme.id] = st;
    }
    if (right === total) S.perfect++;
    if (!S.bestRight) S.bestRight = {};
    if (L.right > (S.bestRight[L.theme.id] || 0)) {
      S.bestRight[L.theme.id] = L.right;
      save();
    }
    if (st > 0) {
      bumpQuest("themes", 1);
      tripBump("theme", 1);
    }
    setTimeout(function () {
      dance(st >= 3);
    }, 350);
    maybeChest();
    var wrongN = 0,
      wi;
    for (wi = 0; wi < L.results.length; wi++) if (L.results[wi] === false) wrongN++;
    if (wrongN >= Math.max(5, Math.round(L.rounds.length * 0.4)) && diff().id !== "latt") {
      S.tough = (S.tough || 0) + 1;
      S.easy = 0;
    } else if (wrongN === 0 && diff().id !== "svar") {
      S.easy = (S.easy || 0) + 1;
      S.tough = 0;
    } else {
      S.tough = 0;
      S.easy = 0;
    }
    save();
    if (diff().id === "svar" && st > 0) {
      S.hardWins = (S.hardWins || 0) + 1;
      save();
      if (S.hardWins === 1) {
        setTimeout(function () {
          var d = document.createElement("div");
          d.className = "overlay";
          d.innerHTML =
            '<div class="oc" style="border-color:#C8305A"><p class="kicker">🔥 Svår nivå klarad!</p>' +
            '<div style="font-size:64px">🐉</div><h3>Tre plagg låstes upp</h3>' +
            "<p>Eldkrona, blixtar och drakvingar finns nu på marknaden — bara för den som spelar på svår.</p>" +
            '<button class="btn big wide" id="hwok">Till garderoben</button></div>';
          document.body.appendChild(d);
          burst(180);
          sndLvl();
          d.querySelector("#hwok").onclick = function () {
            d.remove();
            go(shopScreen, true);
          };
        }, 1200);
      }
      if (st === 3 && (S.secrets || []).indexOf("hardperfect") < 0) {
        setTimeout(function () {
          eggReward("hardperfect", 80, 50);
          eggSay2("hardperfect", "🐉");
        }, 700);
      }
    }
    addXp(Math.round(st * 15 * diff().mult));
    save();
    if (st >= 3)
      setTimeout(function () {
        dance();
      }, 520);
    var newB = checkBadges();
    if (st >= 2) burst(140);
    var html =
      '<div class="card" style="text-align:center">' +
      '<div class="bigstars">' +
      starStr(st) +
      "</div>" +
      '<p class="q">' +
      (st === 3
        ? "Suurepärane" + (S.name ? ", " + esc(S.name) : "") + "! Alldeles perfekt!"
        : st === 2
          ? "Tubli" + (S.name ? ", " + esc(S.name) : "") + "! Snyggt jobbat!"
          : st === 1
            ? "Bra kämpat!"
            : "Öva lite till – du fixar det!") +
      "</p>" +
      '<p class="qsub">' +
      right +
      " rätt av " +
      total +
      " · bästa kombo x" +
      (L.bestCombo || 0) +
      " · " +
      diff().em +
      " " +
      diff().sv +
      "</p>" +
      '<div class="center">' +
      siilSVG() +
      "</div>";
    if (newB.length) {
      html += '<p class="q" style="margin-top:12px">Nytt märke!</p><div>';
      for (var i = 0; i < newB.length; i++) {
        html += '<span class="badge">' + newB[i].em + " " + esc(newB[i].sv) + "</span>";
      }
      html += "</div>";
    }
    html += pendHtml();
    /* ord som inte satt förut men sitter nu */
    if (L.fixed && L.fixed.length) {
      html += '<div class="fixedbox"><b>💪 Det här satt inte förut — nu sitter det!</b>';
      for (var fq = 0; fq < L.fixed.length; fq++) {
        html +=
          '<span class="fw">' +
          esc(L.fixed[fq].em || "") +
          " " +
          esc(L.fixed[fq].et) +
          ' <span style="font-weight:400;color:var(--muted)">' +
          esc(L.fixed[fq].sv) +
          "</span></span>";
      }
      html += "</div>";
    }
    if (L.hardWon)
      html +=
        '<p class="qsub">💪 ' +
        L.hardWon +
        (L.hardWon === 1 ? " svårt ord" : " svåra ord") +
        " gav dubbla stjärnor.</p>";
    var nx = nextUp();
    html +=
      '<button class="btn green big wide" id="nextup">▶️ ' +
      esc(UI.next.et) +
      '<span style="font-weight:500;font-size:14px;opacity:.9"> · ' +
      (nx.kind === "theme" ? esc(nx.t.sv) : esc(nx.sv)) +
      "</span></button>" +
      (function () {
        var untried = ["duel", "mem", "rain", "sent", "talk"].filter(function (k) {
          return !(S.tried || {})[k];
        });
        if (!untried.length) return "";
        var nm = {
          duel: "⚔️ Duell mot ett djur",
          mem: "🃏 Memory",
          rain: "🌧️ Ordregnet",
          sent: "🧩 Bygg meningar",
          talk: "💬 Prata med Siiri",
        }[untried[0]];
        return (
          '<button class="btn ghost wide" id="trynew" data-try="' +
          untried[0] +
          '" style="margin-top:10px">Har du testat ' +
          nm +
          "?</button>"
        );
      })() +
      '<div class="row"><button class="btn ghost" id="again">' +
      esc(UI.again.et) +
      " · en gång till</button>" +
      '<button class="btn ghost" id="home">Menüü · menyn</button></div></div>';
    app.innerHTML = html;
    mood("cheer");
    document.getElementById("nextup").onclick = function () {
      startNext();
    };
    var tn = document.getElementById("trynew");
    if (tn)
      tn.onclick = function () {
        var k = tn.getAttribute("data-try");
        var f = { duel: duelIntro, mem: memIntro, rain: rainIntro, sent: sentIntro, talk: talkScreen }[k];
        if (!S.tried) S.tried = {};
        S.tried[k] = (S.tried[k] || 0) + 1;
        save();
        go(f, true);
      };
    if ((S.tough || 0) >= 1 || (S.easy || 0) >= 3) {
      var easier = (S.tough || 0) >= 1;
      setTimeout(function () {
        var d = document.createElement("div");
        d.className = "overlay";
        d.innerHTML =
          '<div class="oc"><p class="kicker">' +
          (easier ? "Siiri undrar en sak" : "Siiri har en idé") +
          "</p>" +
          '<div style="font-size:52px">' +
          (easier ? "🍃" : "🔥") +
          "</div>" +
          "<h3>" +
          (easier ? "Ska vi ta det lite lugnare?" : "Vill du prova svårare?") +
          "</h3>" +
          "<p>" +
          (easier
            ? "Du får fler bilder som hjälp och färre svarsalternativ. Du kan byta tillbaka när du vill."
            : "Du klarade flera omgångar utan ett enda fel. På svår nivå finns egna plagg och hemligheter.") +
          "</p>" +
          '<button class="btn green big wide" id="dyes">' +
          (easier ? "🍃 Byt till Lätt" : "🔥 Byt till Svår") +
          "</button>" +
          '<button class="btn ghost wide" id="dno" style="margin-top:8px">Nej tack, det går bra</button></div>';
        document.body.appendChild(d);
        d.querySelector("#dyes").onclick = function () {
          S.diff = easier ? "latt" : "svar";
          S.tough = 0;
          S.easy = 0;
          save();
          d.remove();
          refreshTop();
          sndLvl();
        };
        d.querySelector("#dno").onclick = function () {
          S.tough = 0;
          S.easy = 0;
          save();
          d.remove();
        };
      }, 1800);
    }
    if (st >= 2 && S.name) speakTo(st === 3 ? "vaga" : "tubli");
    else if (st >= 2) speak("Sa oled tubli!");
    document.getElementById("again").onclick = function () {
      L.learnIdx = 0;
      buildRounds();
      nextRound();
    };
    document.getElementById("home").onclick = function () {
      go(homeScreen, false);
    };
    refreshTop();
  }

  /* ---------- PRATA MED SIIRI ---------- */
  var T = null;
  function talkScreen() {
    screen = "talk";
    prefetch("chat");
    var html =
      '<div class="card"><p class="q">Vad vill du prata om?</p>' +
      '<p class="qsub">Siiri ställer en fråga. Du svarar med rösten eller trycker på ett svar.</p>' +
      '<div class="center">' +
      siilSVG() +
      '</div><div class="topics">';
    for (var i = 0; i < CHATS.length; i++) {
      html +=
        '<button class="tile" data-chat="' +
        CHATS[i].id +
        '" style="min-height:96px">' +
        '<span class="em">' +
        CHATS[i].em +
        '</span><span class="et">' +
        esc(CHATS[i].et) +
        "</span>" +
        '<span class="sv">' +
        esc(CHATS[i].sv) +
        "</span></button>";
    }
    html += "</div></div>";
    app.innerHTML = html;
    mMood("");
    var b = app.querySelectorAll("[data-chat]");
    for (var k = 0; k < b.length; k++) {
      (function (el) {
        el.onclick = function () {
          startChat(el.getAttribute("data-chat"));
        };
      })(b[k]);
    }
  }
  function startChat(id) {
    var c = null,
      i;
    for (i = 0; i < CHATS.length; i++) {
      if (CHATS[i].id === id) c = CHATS[i];
    }
    if (!c) {
      talkScreen();
      return;
    }
    T = { c: c, i: 0, said: 0, voice: 0, phase: "intro" };
    renderTalk();
  }
  function renderTalk() {
    var c = T.c,
      step = c.turns[T.i];
    var line = T.phase === "intro" ? c.intro : T.phase === "reply" ? step.reply : step.q;
    var html =
      '<div class="stage">' +
      '<div class="saysbub" id="bub"><b>' +
      esc(line.et) +
      "</b><span>" +
      esc(line.sv) +
      "</span></div>" +
      siilSVG("big") +
      '<div class="progressdots">';
    for (var d = 0; d < c.turns.length; d++) {
      html += '<span class="dot' + (d < T.i ? " ok" : d === T.i ? " now" : "") + '"></span>';
    }
    html += '</div></div><div class="card" id="ansbox">';
    if (T.phase === "q") {
      html +=
        '<div class="center"><button class="speakbtn sm" id="again" aria-label="Hör frågan igen">🔊</button>' +
        (micOK ? '<button class="mic" id="mic" aria-label="Svara med rösten">🎤</button>' : "") +
        '<button class="speakbtn sm" id="slow" aria-label="Hör frågan långsamt">🐢</button></div>' +
        '<div class="heard" id="heard">' +
        (micOK ? "Säg ditt svar – eller tryck på det." : "Tryck på det svar du vill ge.") +
        "</div>";
      for (var i = 0; i < step.opts.length; i++) {
        html +=
          '<button class="answer" data-opt="' +
          i +
          '">' +
          esc(step.opts[i].et) +
          "<span>" +
          esc(step.opts[i].sv) +
          "</span></button>";
      }
    } else {
      html +=
        '<div class="center"><button class="btn big" id="onwards">' +
        (T.phase === "intro" ? "Börja prata 💬" : "Vidare →") +
        "</button></div>";
    }
    html += "</div>";
    app.innerHTML = html;
    speak(line.et);

    if (T.phase !== "q") {
      document.getElementById("onwards").onclick = function () {
        if (T.phase === "reply") {
          T.i++;
          if (T.i >= c.turns.length) {
            talkDone();
            return;
          }
        }
        T.phase = "q";
        renderTalk();
      };
      return;
    }
    document.getElementById("again").onclick = function () {
      speak(step.q.et);
    };
    document.getElementById("slow").onclick = function () {
      speak(step.q.et, true);
    };
    var btns = app.querySelectorAll("[data-opt]");
    for (var j = 0; j < btns.length; j++) {
      (function (el) {
        el.onclick = function () {
          el.classList.add("picked");
          answerTalk(parseInt(el.getAttribute("data-opt"), 10), false);
        };
      })(btns[j]);
    }
    var mic = document.getElementById("mic");
    if (mic) {
      var busy = false;
      mic.onclick = function () {
        if (busy) return;
        busy = true;
        stopSpeak();
        mMood("listen");
        mic.classList.add("listening");
        document.getElementById("heard").textContent = "Jag lyssnar …";
        listen(
          function (alts) {
            var k,
              hit = -1;
            for (k = 0; k < step.opts.length; k++) {
              if (saidIt(alts, step.opts[k].et)) {
                hit = k;
                break;
              }
            }
            document.getElementById("heard").textContent = "Du sa: " + alts[0];
            if (hit >= 0) {
              btns[hit].classList.add("picked");
              setTimeout(function () {
                answerTalk(hit, true);
              }, 350);
            } else {
              mMood("think");
              document.getElementById("heard").textContent = "Du sa: " + alts[0] + " – prova ett av svaren nedan.";
              setTimeout(function () {
                mMood("");
              }, 1600);
            }
          },
          function () {
            mic.classList.remove("listening");
            busy = false;
            if (!talking) mMood("");
          },
          function (err) {
            mic.classList.remove("listening");
            busy = false;
            mMood("");
            var hd = document.getElementById("heard");
            hd.innerHTML = esc(micProblem(err)) + (inFrame ? "<br>" + openTabHTML() : "");
          },
        );
      };
    }
  }
  function answerTalk(k, byVoice) {
    var step = T.c.turns[T.i];
    T.said++;
    if (byVoice) T.voice++;
    S.correct++;
    if (byVoice) S.spoken++;
    addXp(byVoice ? 12 : 6);
    earnStars(1);
    save();
    sndOk();
    burst(byVoice ? 70 : 40);
    mood("cheer");
    speak(step.opts[k].et);
    setTimeout(function () {
      T.phase = "reply";
      renderTalk();
    }, 1500);
  }
  function talkDone() {
    bumpQuest("talks", 1);
    tripBump("talk", 1);
    var mine = S.name ? esc(S.name) : "";
    var newB = checkBadges();
    burst(150);
    var html =
      '<div class="card" style="text-align:center"><div class="bigstars">★★★</div>' +
      '<p class="q">Sa said hakkama' +
      (mine ? ", " + mine : "") +
      "! Du klarade hela samtalet!</p>" +
      '<p class="qsub">' +
      T.voice +
      " av " +
      T.said +
      " svar sa du med rösten.</p>" +
      '<div class="center">' +
      siilSVG() +
      "</div>";
    if (newB.length) {
      html += '<div style="margin-top:12px">';
      for (var i = 0; i < newB.length; i++) {
        html += '<span class="badge">' + newB[i].em + " " + esc(newB[i].sv) + "</span>";
      }
      html += "</div>";
    }
    html +=
      '<div class="row"><button class="btn green big" id="again">Prata om annat 💬</button>' +
      '<button class="btn ghost big" id="home">Tillbaka</button></div></div>';
    app.innerHTML = html;
    if (S.name) speakTo("tubli");
    else speak("Sa oled tubli!");
    setTimeout(function () {
      mood("cheer");
    }, 200);
    document.getElementById("again").onclick = function () {
      talkScreen();
    };
    document.getElementById("home").onclick = function () {
      go(homeScreen, false);
    };
  }

  /* ============ KNAPPAR ============ */
  btnBack.onclick = function () {
    stopSpeak();
    SP = null;
    go(homeScreen, false);
  };
  btnSound.onclick = function () {
    S.sound = !S.sound;
    save();
    btnSound.textContent = S.sound ? "🔊" : "🔇";
    if (!S.sound) {
      stopSpeak();
      ambienceStop();
    } else {
      tone(880, 0.12, 0);
      ambienceStart();
    }
  };
  var themePress = null,
    themeLong = false;
  btnTheme.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });
  btnTheme.addEventListener(
    "pointerdown",
    function () {
      themeLong = false;
      themePress = setTimeout(function () {
        themePress = null;
        themeLong = true;
        snowfall();
      }, 900);
    },
    { passive: true },
  );
  btnTheme.addEventListener("pointercancel", endThemePress, { passive: true });
  function endThemePress() {
    if (themePress) {
      clearTimeout(themePress);
      themePress = null;
    }
  }
  btnTheme.addEventListener("pointerup", endThemePress, { passive: true });
  btnTheme.addEventListener("pointerleave", endThemePress, { passive: true });
  btnTheme.addEventListener("pointercancel", endThemePress, { passive: true });
  btnTheme.onclick = function () {
    if (themeLong) {
      themeLong = false;
      return;
    }
    var cur = document.documentElement.getAttribute("data-theme");
    var isDark = cur ? cur === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    var next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    S.theme = next;
    save();
    btnTheme.textContent = next === "dark" ? "☀️" : "🌙";
  };

  var rankPress = null,
    rankLong = false;
  var rc = document.getElementById("rankchip");
  rc.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });
  rc.addEventListener(
    "pointerdown",
    function () {
      rankLong = false;
      rankPress = setTimeout(function () {
        rankPress = null;
        rankLong = true;
        medalSpin();
      }, 900);
    },
    { passive: true },
  );
  rc.addEventListener("pointercancel", endRankPress, { passive: true });
  function endRankPress() {
    if (rankPress) {
      clearTimeout(rankPress);
      rankPress = null;
    }
  }
  rc.addEventListener("pointerup", endRankPress, { passive: true });
  rc.addEventListener("pointerleave", endRankPress, { passive: true });
  rc.onclick = function () {
    if (rankLong) {
      rankLong = false;
      return;
    }
    go(trophyScreen, true);
  };
  var starTaps = 0,
    starTimer = null;
  document.addEventListener(
    "pointerdown",
    function ambOnce() {
      document.removeEventListener("pointerdown", ambOnce);
      ambienceStart();
    },
    { passive: true },
  );
  document.getElementById("starchip").onclick = function () {
    /* första trycket öppnar marknaden direkt; fortsätter man trycka på stjärnan
           där uppe räknas tryckningarna vidare och sju i rad ger stjärnregn */
    starTaps++;
    clearTimeout(starTimer);
    starTimer = setTimeout(function () {
      starTaps = 0;
    }, 3000);
    if (starTaps >= 7) {
      starTaps = 0;
      starRain();
      return;
    }
    if (starTaps >= 3) tone(560 + starTaps * 70, 0.05, 0);
    if (screen !== "shop") {
      go(shopScreen, true);
      setNav("shop");
    }
  };
  document.getElementById("mechip").onclick = function () {
    go(profileScreen, true);
  };
  (function () {
    var nav = document.getElementById("nav");
    var map = {
      home: function () {
        go(homeScreen, false);
        setNav("home");
      },
      trip: function () {
        go(tripScreen, true);
        setNav("trip");
      },
      words: function () {
        go(listScreen, true);
        setNav("words");
      },
      shop: function () {
        go(shopScreen, true);
        setNav("shop");
      },
      room: function () {
        go(roomScreen, true);
        setNav("room");
      },
      me: function () {
        go(profileScreen, true);
        setNav("me");
      },
    };
    var bs = nav.querySelectorAll("[data-nav]"),
      i;
    for (i = 0; i < bs.length; i++) {
      (function (el) {
        el.onclick = function () {
          stopSpeak();
          SP = null;
          map[el.getAttribute("data-nav")]();
        };
      })(bs[i]);
    }
  })();
  /* service workern registreras av Nuxt-appen (app/plugins/sw.client.ts) */
  newDay();
  /* ser profilen tom ut trots att en kopia finns? erbjud återställning */
  try {
    if (backupLooksBetter()) {
      setTimeout(function () {
        var p = backupInfo();
        var d = document.createElement("div");
        d.className = "overlay";
        d.innerHTML =
          '<div class="oc" style="border-color:var(--honey)"><p class="kicker">💾 Säkerhetskopia</p>' +
          '<div style="font-size:52px">🦔</div><h3>Vi hittade en sparad kopia</h3>' +
          "<p>Den är från " +
          esc(backupAge(p)) +
          " och innehåller ⭐ " +
          (p.data.stars || 0) +
          " och " +
          (p.data.correct || 0) +
          " rätta svar. Vill du hämta tillbaka den?</p>" +
          '<div class="row"><button class="btn green" id="bkyes">Ja, hämta tillbaka</button>' +
          '<button class="btn ghost" id="bkno">Nej tack</button></div></div>';
        document.body.appendChild(d);
        d.querySelector("#bkyes").onclick = function () {
          if (restoreBackup()) location.reload();
          else d.remove();
        };
        d.querySelector("#bkno").onclick = function () {
          d.remove();
        };
      }, 1200);
    }
  } catch (e) {}
  welcomeBack();
  idleKick();
  applyColor(); /* färgtema */
  applyScene(); /* scenen bakom Siiri, om en sådan bärs */
  refreshTop();
  prefetchName();
  /* uttal till glosorna: ta fram sparade, hämta det som saknas (även när nätet kommer tillbaka) */
  setTimeout(function () {
    schoolAudio();
  }, 1500);
  window.addEventListener("online", function () {
    schoolAudio();
  });
  /* nya glosor från familjen (app/stores/cloud.ts) – hämta uttalet direkt, inte först nästa gång appen öppnas */
  window.addEventListener("siiri-school", function () {
    schoolAudio();
  });
  setTimeout(seasonFx, 600);
  setTimeout(holidayCard, 300);
  setTimeout(nightOwl, 1000);
  if (!S.setupdone) {
    btnBack.hidden = true;
    setupScreen(true);
  } else {
    homeScreen();
  }
})();
