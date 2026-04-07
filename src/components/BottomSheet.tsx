'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Snap points as fractions of viewport height (from bottom).
 * - collapsed: just the drag handle + search bar visible (~15%)
 * - half: half the screen (~50%)
 * - full: nearly full screen (~92%)
 */
const SNAP_COLLAPSED = 0.15;
const SNAP_HALF = 0.50;
const SNAP_FULL = 0.92;
const SNAPS = [SNAP_COLLAPSED, SNAP_HALF, SNAP_FULL];

function closestSnap(fraction: number): number {
  let best = SNAPS[0];
  let bestDist = Math.abs(fraction - best);
  for (const s of SNAPS) {
    const d = Math.abs(fraction - s);
    if (d < bestDist) {
      best = s;
      bestDist = d;
    }
  }
  return best;
}

interface BottomSheetProps {
  children: ReactNode;
}

export default function BottomSheet({ children }: BottomSheetProps) {
  const [snap, setSnap] = useState(SNAP_HALF);
  const [dragging, setDragging] = useState(false);
  const [currentHeight, setCurrentHeight] = useState<number | null>(null);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

  // Resolve display height
  const displayHeight = currentHeight ?? snap * vh;

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Only respond to touch or primary mouse button on the handle
      setDragging(true);
      dragStartY.current = e.clientY;
      dragStartHeight.current = displayHeight;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [displayHeight]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const dy = dragStartY.current - e.clientY; // positive = dragging up
      const newHeight = Math.max(vh * 0.1, Math.min(vh * 0.95, dragStartHeight.current + dy));
      setCurrentHeight(newHeight);
    },
    [dragging, vh]
  );

  const handlePointerUp = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    if (currentHeight !== null) {
      const fraction = currentHeight / vh;
      const newSnap = closestSnap(fraction);
      setSnap(newSnap);
      setCurrentHeight(null);
    }
  }, [dragging, currentHeight, vh]);

  // Handle window resize
  useEffect(() => {
    const handler = () => setCurrentHeight(null);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Toggle between collapsed and half on handle tap (no drag)
  const handleTap = useCallback(() => {
    if (snap === SNAP_COLLAPSED) {
      setSnap(SNAP_HALF);
    } else {
      setSnap(SNAP_COLLAPSED);
    }
  }, [snap]);

  const tapRef = useRef(false);
  const handlePointerDownCapture = useCallback((e: React.PointerEvent) => {
    tapRef.current = true;
    handlePointerDown(e);
  }, [handlePointerDown]);

  const handlePointerMoveCapture = useCallback((e: React.PointerEvent) => {
    if (dragging && Math.abs(e.clientY - dragStartY.current) > 5) {
      tapRef.current = false;
    }
    handlePointerMove(e);
  }, [dragging, handlePointerMove]);

  const handlePointerUpCapture = useCallback(() => {
    if (tapRef.current) {
      handleTap();
      setDragging(false);
      setCurrentHeight(null);
    } else {
      handlePointerUp();
    }
  }, [handleTap, handlePointerUp]);

  return (
    <div
      ref={sheetRef}
      className="fixed left-0 right-0 bottom-0 z-10 flex flex-col rounded-t-2xl overflow-hidden"
      style={{
        height: `${displayHeight}px`,
        background: 'var(--panel-bg)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--panel-border)',
        borderBottom: 'none',
        transition: dragging ? 'none' : 'height 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
        touchAction: 'none',
      }}
    >
      {/* Drag handle */}
      <div
        className="flex-shrink-0 flex items-center justify-center py-3 cursor-grab active:cursor-grabbing select-none"
        onPointerDown={handlePointerDownCapture}
        onPointerMove={handlePointerMoveCapture}
        onPointerUp={handlePointerUpCapture}
        style={{ touchAction: 'none' }}
      >
        <div
          className="w-10 h-1 rounded-full"
          style={{ background: 'var(--text-muted)' }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {children}
      </div>
    </div>
  );
}
