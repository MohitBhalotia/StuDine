"use client";

import { ChartAreaInteractiveStudent } from "@/components/chart-area-interactive";
import { SectionCardsStudent } from "@/components/section-cards";

export default function StudentDashboard() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCardsStudent />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractiveStudent />
          </div>
        </div>
      </div>
    </div>
  );
}
