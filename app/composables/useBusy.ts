/* "upptagen" + felmeddelande runt en åtgärd: knapparna stängs av medan den pågår, och fel visas som text */
export function useBusy() {
  const busy = ref(false);
  const err = ref("");
  async function run(fn: () => Promise<void>) {
    err.value = "";
    busy.value = true;
    try {
      await fn();
    } catch (e) {
      err.value = e instanceof Error ? e.message : String(e);
    } finally {
      busy.value = false;
    }
  }
  return { busy, err, run };
}
