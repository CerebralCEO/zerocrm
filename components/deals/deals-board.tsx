"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  defaultDropAnimationSideEffects,
  pointerWithin,
  rectIntersection,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type Announcements,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
  type DropAnimation,
  type KeyboardCoordinateGetter,
} from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { useDeals } from "@/lib/deals-store";
import { STAGES, stageById, type Deal, type Stage, type StageId } from "@/lib/deals";
import { EASE_IOS } from "@/lib/motion";
import { cn, formatNumber } from "@/lib/utils";
import { Tag } from "@/components/primitives/tag";
import { DealCard } from "./deal-card";
import { useDragScroll } from "@/components/companies/use-drag-scroll";
import { useTabIndicator } from "@/components/ui/use-tab-indicator";
import { useVisibleDeals } from "./deals-toolbar";

/* Pointer first (precise), then overlap — keyboard drags have no pointer. */
const collision: CollisionDetection = (args) => {
  const hits = pointerWithin(args);
  return hits.length ? hits : rectIntersection(args);
};

/* ← / → jump a keyboard-dragged card straight to the neighbouring column. */
const columnKeyboardCoordinates: KeyboardCoordinateGetter = (event, { context }) => {
  const { collisionRect, droppableRects, droppableContainers } = context;
  if (!collisionRect || (event.code !== "ArrowLeft" && event.code !== "ArrowRight")) return undefined;
  const columns = droppableContainers
    .getEnabled()
    .map((c) => droppableRects.get(c.id))
    .filter((r): r is NonNullable<typeof r> => !!r)
    .sort((a, b) => a.left - b.left);
  const cx = collisionRect.left + collisionRect.width / 2;
  let index = columns.findIndex((r) => cx >= r.left && cx <= r.left + r.width);
  if (index === -1) index = 0;
  index = Math.max(0, Math.min(columns.length - 1, index + (event.code === "ArrowRight" ? 1 : -1)));
  event.preventDefault();
  const target = columns[index];
  return { x: target.left + target.width / 2 - collisionRect.width / 2, y: collisionRect.top };
};

const dropAnimation: DropAnimation = {
  duration: 420,
  easing: EASE_IOS,
  sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: "0.4" } } }),
};

function DraggableDeal({ deal }: { deal: Deal }) {
  const openDeal = useDeals((s) => s.openDeal);
  const { setNodeRef, listeners, attributes, isDragging } = useDraggable({ id: deal.id, data: { stage: deal.stage } });

  return (
    <DealCard
      ref={setNodeRef}
      deal={deal}
      dimmed={isDragging}
      {...attributes}
      {...listeners}
      aria-roledescription="Draggable deal"
      onClick={() => openDeal(deal.id)}
      onKeyDown={(e) => {
        listeners?.onKeyDown?.(e);
        if (e.key === "Enter" && !isDragging) openDeal(deal.id);
      }}
      className="cursor-grab touch-manipulation active:cursor-grabbing"
    />
  );
}

function Column({ stage, deals, dragging }: { stage: Stage; deals: Deal[]; dragging: boolean }) {
  const openNewDeal = useDeals((s) => s.openNewDeal);
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });
  const total = deals.reduce((s, d) => s + d.value, 0);
  const weighted = Math.round(deals.reduce((s, d) => s + (d.value * d.probability) / 100, 0));

  return (
    <section
      ref={setNodeRef}
      aria-label={`${stage.label} — ${deals.length} deals`}
      className={cn(
        "flex h-full w-[86vw] max-w-[360px] shrink-0 snap-start flex-col border-r border-line transition-colors duration-200 last:border-r-0",
        "md:w-auto md:max-w-none md:min-w-[292px] md:flex-1 md:shrink",
        isOver && "bg-white/[0.022]",
      )}
    >
      <header className="shrink-0 px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <Tag tone={stage.tone}>{stage.label}</Tag>
          <span className="flex h-4 min-w-6 items-center justify-center rounded-full border border-white/10 bg-[#222] px-[5px] text-[12px] font-medium leading-none text-fg-soft">
            {deals.length}
          </span>
          <button
            type="button"
            aria-label={`Add deal to ${stage.label}`}
            onClick={() => openNewDeal(stage.id)}
            className="ml-auto flex size-6 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-white/[0.06] hover:text-fg"
          >
            <Plus className="size-[14px]" strokeWidth={1.75} />
          </button>
        </div>
        <div className="mt-[11px] flex items-baseline gap-2 text-[14px] leading-none font-medium text-fg tabular-nums">
          <span>
            <span className="mr-[4px] text-[#7f7f7f]">$</span>
            {formatNumber(total)}
          </span>
          {stage.id !== "won" && (
            <span className="truncate text-[12px] font-normal text-fg-muted">
              · ${formatNumber(weighted)} weighted
            </span>
          )}
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-y-contain px-3 pb-3">
        {deals.map((d) => (
          <DraggableDeal key={d.id} deal={d} />
        ))}
        {deals.length === 0 && (
          <div
            className={cn(
              "flex h-24 shrink-0 items-center justify-center rounded-lg border border-dashed text-[12px] text-fg-muted transition-colors",
              dragging ? "border-[#4a4a4a]" : "border-line-strong",
            )}
          >
            {dragging ? "Drop here" : "No deals in this stage"}
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Phone-only stage switcher above the board: tap to glide to a column; the
 * active tab follows the board as it is swiped. Works with mouse, touch and keyboard.
 */
function StageTabs({ active, counts, onSelect }: { active: number; counts: number[]; onSelect: (i: number) => void }) {
  const { ref, style: underline } = useTabIndicator(String(active));
  const navRef = useRef<HTMLElement | null>(null);
  const setNav = useCallback(
    (el: HTMLElement | null) => {
      navRef.current = el;
      ref(el);
    },
    [ref],
  );

  // Keep the active tab in view as the board is swiped.
  useEffect(() => {
    navRef.current
      ?.querySelector<HTMLElement>('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [active]);

  return (
    <nav
      ref={setNav}
      aria-label="Stages"
      className="no-scrollbar relative flex h-[44px] shrink-0 items-end gap-5 overflow-x-auto border-b border-line px-4 md:hidden"
    >
      {STAGES.map((s, i) => (
        <button
          key={s.id}
          type="button"
          data-active={active === i}
          aria-current={active === i ? "true" : undefined}
          onClick={() => onSelect(i)}
          className={cn(
            "no-press relative flex shrink-0 items-center gap-[6px] pb-[13px] text-[12px] leading-none whitespace-nowrap transition-colors",
            active === i ? "font-medium text-fg" : "text-fg-muted",
          )}
        >
          {s.label}
          <span className="flex h-4 min-w-5 items-center justify-center rounded-full border border-white/10 bg-[#222] px-1 text-[11px] font-medium text-fg-soft">
            {counts[i]}
          </span>
          {active === i && !underline && <span className="absolute inset-x-0 bottom-0 h-px bg-fg" />}
        </button>
      ))}
      {underline && (
        <span
          aria-hidden
          className="absolute bottom-0 h-px bg-fg transition-[left,width] duration-500 ease-(--ease-ios)"
          style={underline}
        />
      )}
    </nav>
  );
}

export function DealsBoard() {
  const deals = useVisibleDeals();
  const allDeals = useDeals((s) => s.deals);
  const moveDeal = useDeals((s) => s.moveDeal);
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = activeId ? allDeals.find((d) => d.id === activeId) : undefined;
  const scrollRef = useDragScroll<HTMLDivElement>();
  const [column, setColumn] = useState(0);

  // Which column is in view (phones show one at a time).
  const onScroll = () => {
    const el = scrollRef.current;
    const first = el?.querySelector("section");
    if (!el || !first) return;
    setColumn(Math.min(STAGES.length - 1, Math.round(el.scrollLeft / first.offsetWidth)));
  };
  const goToColumn = (i: number) => {
    const el = scrollRef.current;
    const target = el?.querySelectorAll("section")[i];
    if (el && target) el.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
  };

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    // Long-press to pick up on touch, so a quick swipe still scrolls the board.
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
    useSensor(KeyboardSensor, {
      keyboardCodes: { start: ["Space"], cancel: ["Escape"], end: ["Space", "Enter"] },
      coordinateGetter: columnKeyboardCoordinates,
    }),
  );

  const title = (id: string | number) => allDeals.find((d) => d.id === id)?.title ?? "deal";
  const stageName = (id?: string | number) => (id ? stageById(id as StageId).label : "no stage");
  const announcements: Announcements = {
    onDragStart: ({ active }) => `Picked up ${title(active.id)}.`,
    onDragOver: ({ active, over }) => `${title(active.id)} is over ${stageName(over?.id)}.`,
    onDragEnd: ({ active, over }) =>
      over ? `${title(active.id)} moved to ${stageName(over.id)}.` : `${title(active.id)} dropped.`,
    onDragCancel: ({ active }) => `Moving ${title(active.id)} was cancelled.`,
  };

  const onDragStart = ({ active }: DragStartEvent) => {
    setActiveId(String(active.id));
    navigator.vibrate?.(8); // subtle haptic tick where supported
  };
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (over) moveDeal(String(active.id), over.id as StageId);
  };

  return (
    <DndContext
      id="deals-board" // stable ids so SSR and client markup match
      sensors={sensors}
      collisionDetection={collision}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={() => setActiveId(null)}
      accessibility={{
        announcements,
        screenReaderInstructions: {
          draggable: "Press space to pick up a deal. Use the left and right arrow keys to move it between stages, then press space or enter to drop it. Press escape to cancel.",
        },
      }}
      autoScroll={{ threshold: { x: 0.1, y: 0.18 }, acceleration: 2 }}
    >
      <StageTabs
        active={column}
        counts={STAGES.map((s) => deals.filter((d) => d.stage === s.id).length)}
        onSelect={goToColumn}
      />
      <div
        ref={scrollRef}
        onScroll={onScroll}
        // Mouse wheel over a column header pans the board sideways.
        onWheel={(e) => {
          const el = scrollRef.current;
          if (el && Math.abs(e.deltaY) > Math.abs(e.deltaX) && (e.target as HTMLElement).closest("section > header")) {
            el.scrollLeft += e.deltaY;
          }
        }}
        className={cn(
          "table-scroll min-h-0 flex-1 overflow-x-auto overflow-y-hidden",
          // Column snapping on phones — paused mid-drag so auto-scroll can glide freely.
          !activeId && "max-md:snap-x max-md:snap-mandatory",
        )}
      >
        <div className="flex h-full min-w-full">
          {STAGES.map((stage) => (
            <Column
              key={stage.id}
              stage={stage}
              deals={deals.filter((d) => d.stage === stage.id)}
              dragging={!!activeId}
            />
          ))}
        </div>
      </div>

      <DragOverlay dropAnimation={dropAnimation}>{active ? <DealCard deal={active} lifted /> : null}</DragOverlay>
    </DndContext>
  );
}
