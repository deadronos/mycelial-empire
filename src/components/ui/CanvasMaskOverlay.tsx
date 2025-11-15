import { useLayoutEffect, useState, type RefObject } from "react";

export const CanvasMaskOverlay = ({
  targetRef,
  parentRef,
}: {
  targetRef: RefObject<HTMLElement | null>;
  parentRef?: RefObject<HTMLElement | null>;
}) => {
  const [rect, setRect] = useState({ top: 0, left: 0, width: 0, height: 0, right: 0, bottom: 0 });

  useLayoutEffect(() => {
    const update = () => {
      const el = targetRef?.current;
      const parent = parentRef?.current;
      if (!el) {
        setRect({ top: 0, left: 0, width: 0, height: 0, right: 0, bottom: 0 });
        return;
      }

      const bounds = el.getBoundingClientRect();
      let parentBounds = {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        right: window.innerWidth,
        bottom: window.innerHeight,
      };
      if (parent) parentBounds = parent.getBoundingClientRect();

      const top = Math.max(0, bounds.top - parentBounds.top);
      const left = Math.max(0, bounds.left - parentBounds.left);
      const right = Math.max(0, parentBounds.right - bounds.right);
      const bottom = Math.max(0, parentBounds.bottom - bounds.bottom);

      setRect({
        top,
        left,
        width: Math.max(0, bounds.width),
        height: Math.max(0, bounds.height),
        right,
        bottom,
      });
    };

    update();
    const raf = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      cancelAnimationFrame(raf);
    };
  }, [targetRef, parentRef]);

  return (
    // parentRef is usually the `main` element to ensure overlay positions are relative to the card area
    <div className="pointer-events-none absolute inset-0 z-10">
      {/* Top */}
      <div
        className="absolute left-0 right-0 bg-slate-950/55 backdrop-blur-sm"
        style={{ top: 0, height: `${rect.top}px` }}
      />
      {/* Left */}
      <div
        className="absolute bg-slate-950/55 backdrop-blur-sm"
        style={{ top: `${rect.top}px`, left: 0, width: `${rect.left}px`, height: `${rect.height}px` }}
      />
      {/* Right */}
      <div
        className="absolute bg-slate-950/55 backdrop-blur-sm"
        style={{ top: `${rect.top}px`, right: 0, width: `${rect.right}px`, height: `${rect.height}px` }}
      />
      {/* Bottom */}
      <div
        className="absolute left-0 right-0 bg-slate-950/55 backdrop-blur-sm"
        style={{ bottom: 0, height: `${rect.bottom}px` }}
      />
    </div>
  );
};

export default CanvasMaskOverlay;
