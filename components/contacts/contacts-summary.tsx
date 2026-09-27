"use client";

import { useLiveContacts } from "@/lib/use-contacts";
import { Heart, Snowflake, Trophy, Users } from "lucide-react";
import { SegmentedMeter } from "@/components/primitives/meter";
import { KpiCell, KpiStrip } from "@/components/ui/kpi-strip";
import { isCold } from "./shared";

export function ContactsSummary() {
  const contacts = useLiveContacts();
  const champions = contacts.filter((c) => c.personas.includes("Champion"));
  const accounts = new Set(champions.map((c) => c.companyId)).size;
  const warm = contacts.filter((c) => c.strength >= 70).length;
  const avg = contacts.length ? Math.round(contacts.reduce((s, c) => s + c.strength, 0) / contacts.length) : 0;
  const cold = contacts.filter(isCold).length;

  return (
    <KpiStrip>
      <KpiCell
        icon={Users}
        label="Contacts"
        value={contacts.length}
        currency={false}
        meta={
          <>
            across <span className="text-fg-soft">{new Set(contacts.map((c) => c.companyId)).size}</span> accounts
          </>
        }
      />
      <KpiCell
        icon={Trophy}
        label="Champions"
        value={champions.length}
        currency={false}
        meta={
          <>
            in <span className="text-meter-green">{accounts}</span> accounts
          </>
        }
      />
      <KpiCell
        icon={Heart}
        label="Warm relationships"
        value={warm}
        currency={false}
        aside={<SegmentedMeter value={avg} className="hidden sm:flex" />}
        meta={
          <>
            <span className="text-fg-soft">{avg}</span> average strength
          </>
        }
      />
      <KpiCell
        icon={Snowflake}
        label="Going cold"
        value={cold}
        currency={false}
        meta={
          <>
            <span className={cold ? "text-danger-dot" : "text-fg-soft"}>no touch</span> in 21+ days
          </>
        }
      />
    </KpiStrip>
  );
}
