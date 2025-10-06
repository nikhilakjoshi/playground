"use client";

import { NavigationBar } from "@/components/navigation-bar";

export default function NavigationDemoPage() {
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

      {/* Demo content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Navigation Bar Demo
          </h1>
          <p className="text-gray-600">
            This is a demonstration of the updated navigation bar component. The
            navigation bar now features:
          </p>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li>• Black background with white text</li>
            <li>• Single-row layout</li>
            <li>• Logo and navigation links on the left</li>
            <li>• Menu button and user avatar on the right</li>
            <li>• Animated white underline for active navigation links</li>
            <li>• No search bar (removed as requested)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
