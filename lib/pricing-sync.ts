"use client";

const PRICING_SYNC_EVENT = "pricing-sync-event";
const PRICING_SYNC_CHANNEL = "photo-calculator-pricing-sync";
const PRICING_SYNC_STORAGE_KEY = "__photo_calc_pricing_sync__";

export function emitPricingSync() {
  window.dispatchEvent(new Event(PRICING_SYNC_EVENT));

  try {
    localStorage.setItem(PRICING_SYNC_STORAGE_KEY, String(Date.now()));
  } catch {
    // Ignore localStorage errors in private mode.
  }

  if ("BroadcastChannel" in window) {
    const channel = new BroadcastChannel(PRICING_SYNC_CHANNEL);
    channel.postMessage({ type: PRICING_SYNC_EVENT, at: Date.now() });
    channel.close();
  }
}

export function subscribePricingSync(onSync: () => void) {
  const onEvent = () => onSync();
  const onStorage = (event: StorageEvent) => {
    if (event.key === PRICING_SYNC_STORAGE_KEY) {
      onSync();
    }
  };

  window.addEventListener(PRICING_SYNC_EVENT, onEvent);
  window.addEventListener("storage", onStorage);

  let channel: BroadcastChannel | null = null;
  if ("BroadcastChannel" in window) {
    channel = new BroadcastChannel(PRICING_SYNC_CHANNEL);
    channel.onmessage = (event: MessageEvent<{ type?: string }>) => {
      if (event.data?.type === PRICING_SYNC_EVENT) {
        onSync();
      }
    };
  }

  return () => {
    window.removeEventListener(PRICING_SYNC_EVENT, onEvent);
    window.removeEventListener("storage", onStorage);
    if (channel) {
      channel.close();
    }
  };
}
