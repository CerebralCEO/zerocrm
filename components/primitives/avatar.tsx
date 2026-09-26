"use client";

import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import * as avataaars from "@dicebear/avataaars";
import { cn } from "@/lib/utils";

const BEARDED = new Set(["Jensen Ackles", "Sarah Nguyen", "Mark Darnalds", "Nia Jameson"]);

export function Avatar({
  name,
  size = 20,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const src = useMemo(
    () =>
      createAvatar(avataaars, {
        seed: name,
        backgroundColor: ["f3f3f3"],
        backgroundType: ["solid"],
        mouth: ["smile", "default", "twinkle"],
        eyes: ["default", "happy", "wink"],
        eyebrows: ["default", "defaultNatural", "raisedExcitedNatural"],
        accessoriesProbability: 0,
        facialHairProbability: BEARDED.has(name) ? 100 : 0,
        facialHair: ["beardMedium", "beardLight"],
        ...(name === "Jensen Ackles"
          ? { top: ["shortFlat" as const], hairColor: ["2c1b18"], facialHairColor: ["2c1b18"], skinColor: ["d08b5b"] }
          : {}),
      }).toDataUri(),
    [name],
  );

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      className={cn("shrink-0 rounded-full", className)}
      style={{ width: size, height: size }}
    />
  );
}
