/* Fångar JS-fel och konsolfel globalt i en rullande buffert (bug-log.ts), som sedan följer med
   varje buggrapport (useBugReport.ts) som teknisk kontext. 00-prefixet gör att pluginen laddas
   allra först, så att fel från andra pluginers egen uppstart också fångas. */

export default defineNuxtPlugin(() => {
  window.addEventListener("error", e => logError(e.message || String(e.error || e)));
  window.addEventListener("unhandledrejection", e => logError("unhandled: " + String(e.reason)));
  const orig = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    logError(args.map(a => (a instanceof Error ? a.message : String(a))).join(" "));
    orig(...args);
  };
});
