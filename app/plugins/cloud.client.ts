/* Startar synken med föräldrakontot och gör den nåbar för den gamla koden som window.SiiriCloud
   (statusraden i profilen, länkarna till föräldraläget, och bortkoppling vid "Nollställ allt"). */

export interface SiiriCloudBridge {
  enabled: boolean;
  info(): { linked: boolean; name: string; status: string; needsLogin: boolean };
  unlink(): Promise<void>;
}

export default defineNuxtPlugin(() => {
  const cloud = useCloudStore();
  cloud.init();
  const bridge: SiiriCloudBridge = {
    enabled: cloud.enabled,
    info: () => ({
      linked: !!cloud.link,
      name: cloud.link?.name || "",
      status: cloud.status,
      needsLogin: cloud.needsLogin,
    }),
    unlink: () => cloud.unlink(),
  };
  (window as unknown as { SiiriCloud: SiiriCloudBridge }).SiiriCloud = bridge;
});
