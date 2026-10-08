/* ett namn på enheten som de vuxna känner igen i listan över barnets enheter */
export function deviceLabel() {
  const ua = navigator.userAgent;
  const kind =
    /iPad/.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua))
      ? "iPad"
      : /iPhone/.test(ua)
        ? "iPhone"
        : /Android/.test(ua)
          ? "Android"
          : "Dator";
  return kind + " · " + new Date().toLocaleDateString("sv-SE");
}
