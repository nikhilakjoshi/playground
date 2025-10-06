"use client";

import { CallList, sampleCallListData } from "@/components/call-list";
import { NavigationBar } from "@/components/navigation-bar";

export default function CallListPage() {
  const handleViewCall = (callId: string) => {
    console.log("View call:", callId);
    // Navigate to call details page
  };

  const handleExport = () => {
    console.log("Export calls");
    // Handle export logic
  };

  const handleMenuClick = () => {
    console.log("Menu clicked");
    // Handle menu functionality
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar
        onMenuClick={handleMenuClick}
        userName="John Doe"
        userAvatar=""
      />

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <CallList
            calls={sampleCallListData}
            onViewCall={handleViewCall}
            onExport={handleExport}
          />
        </div>
      </div>
    </div>
  );
}
