import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";

import { AUTOSAVE_KEY } from "@/hooks/useAutosave";
import { parseGameSave } from "@/lib/serialization";
import { useGameStore } from "@/state/useGameStore";
import { useUiStore } from "@/state/useUiStore";

export const SettingsDialog = () => {
  const open = useUiStore((state) => state.dialogs.settingsOpen);
  const setOpen = useUiStore((state) => state.setSettingsOpen);
  const autosave = useUiStore((state) => state.autosave);
  const setAutosaveEnabled = useUiStore((state) => state.setAutosaveEnabled);
  const setAutosaveInterval = useUiStore((state) => state.setAutosaveInterval);
  const importBuffer = useUiStore((state) => state.importBuffer);
  const setImportBuffer = useUiStore((state) => state.setImportBuffer);
  const toggleGridOverlay = useUiStore((state) => state.toggleGridOverlay);
  const showGridOverlay = useUiStore((state) => state.devtools.showGridOverlay);
  const pushToast = useUiStore((state) => state.pushToast);
  const serialize = useGameStore((state) => state.serialize);
  const hydrate = useGameStore((state) => state.hydrate);
  const [isExporting, setExporting] = useState(false);

  const exportSave = async () => {
    setExporting(true);
    try {
      const payload = serialize();
      const serialized = JSON.stringify(payload, null, 2);
      await navigator.clipboard.writeText(serialized);
      window.localStorage.setItem(AUTOSAVE_KEY, serialized);
      pushToast({ title: "Save copied", description: "Snapshot copied to clipboard.", intent: "success" });
    } catch (error) {
      pushToast({
        title: "Export failed",
        description: error instanceof Error ? error.message : String(error),
        intent: "error",
      });
    } finally {
      setExporting(false);
    }
  };

  const importSave = () => {
    try {
      const payload = parseGameSave(JSON.parse(importBuffer));
      hydrate(payload);
      window.localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(payload));
      pushToast({ title: "Save loaded", description: "Network restored from file.", intent: "success" });
      setOpen(false);
    } catch (error) {
      pushToast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "The provided text is not a valid save.",
        intent: "error",
      });
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-950/60 backdrop-blur" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-slate-800/80 bg-slate-950/95 p-6 shadow-panel">
          <Dialog.Title className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Colony Settings
          </Dialog.Title>

          <section className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300">Autosave</p>
                <p className="text-xs text-slate-500">
                  Every {(autosave.intervalMs / 1000).toFixed(0)} seconds
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAutosaveEnabled(!autosave.enabled)}
                className={`inline-flex h-8 w-16 items-center rounded-full border border-slate-700 ${
                  autosave.enabled ? "bg-emerald-500/30" : "bg-slate-800"
                }`}
              >
                <span
                  className={`mx-1 h-6 w-6 rounded-full bg-white transition ${autosave.enabled ? "translate-x-8" : "translate-x-0"}`}
                />
              </button>
            </div>
            <input
              type="range"
              min={10_000}
              max={120_000}
              step={5_000}
              value={autosave.intervalMs}
              onChange={(event) => setAutosaveInterval(Number(event.target.value))}
              className="w-full"
            />
            {autosave.lastSavedAt && (
              <p className="text-[0.65rem] text-slate-500">
                Last autosave {new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
                  Math.round((Date.now() - autosave.lastSavedAt) / 1000) * -1,
                  "second"
                )}
              </p>
            )}
          </section>

          <section className="mt-6 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-300">Data</p>
              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={exportSave}
                  className="rounded-full border border-emerald-500/50 px-3 py-1 text-emerald-200"
                  disabled={isExporting}
                >
                  Export
                </button>
                <button
                  type="button"
                  onClick={importSave}
                  className="rounded-full border border-cyan-500/50 px-3 py-1 text-cyan-200"
                >
                  Import
                </button>
              </div>
            </div>
            <textarea
              value={importBuffer}
              onChange={(event) => setImportBuffer(event.target.value)}
              placeholder="Paste JSON save here"
              className="h-24 w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-200"
            />
          </section>

          <section className="mt-6 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300">Dev Overlays</p>
                <p className="text-xs text-slate-500">Toggle debug grid for ECS testing.</p>
              </div>
              <button
                type="button"
                onClick={toggleGridOverlay}
                className={`rounded-full border px-3 py-1 text-xs ${
                  showGridOverlay ? "border-emerald-500/70 text-emerald-200" : "border-slate-700 text-slate-400"
                }`}
              >
                {showGridOverlay ? "Grid On" : "Grid Off"}
              </button>
            </div>
          </section>

          <Dialog.Close className="absolute right-4 top-4 text-slate-500">✕</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
