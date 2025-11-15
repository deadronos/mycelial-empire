import * as Toast from "@radix-ui/react-toast";

import { useUiStore } from "@/state/useUiStore";

export const ToastHub = () => {
  const toasts = useUiStore((state) => state.toasts);
  const dismissToast = useUiStore((state) => state.dismissToast);

  return (
    <Toast.Provider swipeDirection="right">
      {toasts.map((toast) => (
        <Toast.Root
          key={toast.id}
          duration={4000}
          open
          className={`rounded-2xl border px-4 py-3 shadow-panel ${resolveTone(toast.intent)}`}
          onOpenChange={(open) => {
            if (!open) {
              dismissToast(toast.id);
            }
          }}
        >
          <Toast.Title className="text-sm font-semibold text-white">{toast.title}</Toast.Title>
          {toast.description && <Toast.Description className="text-xs text-slate-200">{toast.description}</Toast.Description>}
        </Toast.Root>
      ))}
      <Toast.Viewport className="pointer-events-none fixed bottom-5 right-5 z-50 flex w-[360px] flex-col gap-3" />
    </Toast.Provider>
  );
};

const resolveTone = (intent: "info" | "success" | "error") => {
  switch (intent) {
    case "success":
      return "border-emerald-500/60 bg-emerald-500/10";
    case "error":
      return "border-rose-500/60 bg-rose-500/10";
    default:
      return "border-slate-700 bg-slate-800/80";
  }
};
