"use client";

import { CallList, sampleCallListData } from "@/components/call-list";

export default function CallListPage() {
  const handleViewCall = (callId: string) => {
    console.log("View call:", callId);
    // Navigate to call details page
  };

  const handleExport = () => {
    console.log("Export calls");
    // Handle export logic
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <CallList
          calls={sampleCallListData}
          onViewCall={handleViewCall}
          onExport={handleExport}
        />
      </div>
    </div>
  );
}
