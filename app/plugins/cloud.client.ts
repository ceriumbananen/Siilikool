/* Startar synken med familjekontot och gör den nåbar för den gamla koden som window.SiiriCloud
   (Familj-kortet och spelarna i profilen, vad som visas för barn/låst enhet, och bortkoppling vid
   "Nollställ allt"). */

export interface SiiriCloudBridge {
  enabled: boolean;
  info(): {
    linked: boolean;
    name: string;
    kind: "" | "adult" | "child" /* vem profilplatsen som spelas nu är kopplad till */;
    status: string;
    needsLogin: boolean;
    adult: boolean /* inloggad vuxen som inte låst enheten */;
    locked: boolean /* enheten är låst av en vuxen */;
    familyDevice: boolean /* barnen spelar här: barnenhet eller låst enhet ("Vem spelar?") */;
    family: string /* familjens namn, om det är känt */;
    signedIn: boolean;
  };
  /* märke på en profilplats i spelarlistan: "child" | "child-pin" | "adult" | "" */
  slotKind(slot: number): string;
  /* byter spelare – på en familjeenhet via "Vem spelar?" när barnet har PIN-kod */
  requestSlot(slot: number): void;
  choosePlayer(): void;
  lock(): Promise<void>;
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
      kind: cloud.link?.kind || "",
      status: cloud.status,
      needsLogin: cloud.needsLogin,
      adult: cloud.isAdult,
      locked: cloud.isLocked,
      familyDevice: cloud.isFamilyDevice,
      family: cloud.familyName,
      signedIn: !!cloud.session,
    }),
    slotKind: slot => {
      const l = cloud.links[String(slot)];
      return !l ? "" : l.kind === "child" ? (l.pin ? "child-pin" : "child") : "adult";
    },
    requestSlot: slot => cloud.requestSlot(slot),
    choosePlayer: () => cloud.openPicker(),
    lock: () => cloud.lock(),
    unlink: () => cloud.removePlayer(),
  };
  (window as unknown as { SiiriCloud: SiiriCloudBridge }).SiiriCloud = bridge;
});
