"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { ChevronRight, Flag } from "lucide-react";
// Removed AG Grid imports as we're using custom components now

// Types for the call data structure
export interface CallDetails {
  callDate: string;
  duration: string;
  callStartTime: string;
  callEndTime: string;
  callType: string;
  recordingSource: string;
  overallSentimentAnalysis: string;
  firstySensor: string;
}

export interface FlagAuditItem {
  id: string;
  regulationType: string;
  timeStamp: string;
  status: "REVIEWED / ACCEPTED" | "REVIEWED / REJECTED" | "PENDING";
  description?: string;
}

export interface TranscriptEntry {
  id: string;
  speaker: string;
  timestamp: string;
  text: string;
  sentiment?: "positive" | "negative" | "neutral";
  flagged?: boolean;
  violation?: string;
}

export interface CallDataProps {
  summary: string;
  callDetails: CallDetails;
  flagAuditLog: FlagAuditItem[];
  transcript: TranscriptEntry[];
  voiceAnalysisData?: {
    duration: number;
    segments: number;
    complete: boolean;
  };
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "REVIEWED / ACCEPTED":
        return "bg-green-100 text-green-800 border-green-200";
      case "REVIEWED / REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
        getStatusStyles(status)
      )}
    >
      {status}
    </span>
  );
}

// Sentiment Indicator Component
function SentimentIndicator({ sentiment }: { sentiment?: string }) {
  if (!sentiment) return null;

  const getSentimentStyles = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-500";
      case "negative":
        return "bg-red-500";
      case "neutral":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div
      className={cn("w-2 h-2 rounded-full", getSentimentStyles(sentiment))}
    />
  );
}

// Flag Icon Component removed - integrated directly into transcript

// Call Summary Section
function CallSummary({ summary }: { summary: string }) {
  return (
    <div className="rounded-lg">
      <h2 className="text-lg font-semibold mb-2 text-gray-900">Call Data</h2>
      <p className="text-gray-700 leading-relaxed">{summary}</p>
    </div>
  );
}

// Call Details Section
function CallDetailsSection({ callDetails }: { callDetails: CallDetails }) {
  if (!callDetails) {
    return <div>No call details available</div>;
  }

  return (
    <div className="bg-white rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">Call Details</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Call Date</p>
          <p className="text-sm text-gray-900 font-bold">
            {callDetails.callDate}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Duration</p>
          <p className="text-sm text-gray-900 font-bold">
            {callDetails.duration}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Call start time</p>
          <p className="text-sm text-gray-900 font-bold">
            {callDetails.callStartTime}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Call end time</p>
          <p className="text-sm text-gray-900 font-bold">
            {callDetails.callEndTime}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Call type</p>
          <p className="text-sm text-gray-900 font-bold">
            {callDetails.callType}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Recording source</p>
          <p className="text-sm text-gray-900 font-bold">
            {callDetails.recordingSource}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">
            Overall sentiment analysis
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-900 font-bold">
              {callDetails.overallSentimentAnalysis}
            </span>
            <SentimentIndicator
              sentiment={callDetails.overallSentimentAnalysis.toLowerCase()}
            />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Firsty Sensor</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-900 font-bold">
              {callDetails.firstySensor}
            </span>
            {callDetails.firstySensor.includes("not authenticated") && (
              <div className="w-2 h-2 rounded-full bg-orange-500" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Grouped Flag Audit Display Component
function GroupedFlagAuditDisplay({ flags }: { flags: FlagAuditItem[] }) {
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(
    new Set([
      "Elder Abuse",
      "RNDIP - Miranda Violation",
      "Regulation - Best Interest",
      "Regulation - DD",
    ])
  );

  // Group flags by categories
  const groupedFlags = React.useMemo(() => {
    const groups: { [key: string]: FlagAuditItem[] } = {
      "Elder Abuse": [],
      "RNDIP - Miranda Violation": [],
      "Regulation - Best Interest": [],
      "Regulation - DD": [],
    };

    flags.forEach((flag) => {
      // Categorize flags based on regulation type
      if (
        flag.regulationType.includes("Elder") ||
        flag.regulationType.includes("Abuse")
      ) {
        groups["Elder Abuse"].push(flag);
      } else if (
        flag.regulationType.includes("Miranda") ||
        flag.regulationType.includes("FINOP") ||
        flag.regulationType.includes("RNDIP")
      ) {
        groups["RNDIP - Miranda Violation"].push(flag);
      } else if (
        flag.regulationType.includes("Interest") ||
        flag.regulationType.includes("Trust")
      ) {
        groups["Regulation - Best Interest"].push(flag);
      } else {
        groups["Regulation - DD"].push(flag);
      }
    });

    return groups;
  }, [flags]);

  const toggleGroup = (groupName: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 uppercase tracking-wider">
        <div className="col-span-6">Regulation Type</div>
        <div className="col-span-3">Time Stamp</div>
        <div className="col-span-3">Status</div>
      </div>

      {/* Grouped Content */}
      <div className="bg-white">
        {Object.entries(groupedFlags).map(([groupName, groupFlags]) => (
          <div key={groupName}>
            {/* Group Header */}
            <div
              className="flex items-center px-4 py-2 bg-gray-50 border-b cursor-pointer hover:bg-gray-100"
              onClick={() => toggleGroup(groupName)}
            >
              <ChevronRight
                className={cn(
                  "mr-2 text-gray-500 transition-transform",
                  expandedGroups.has(groupName) ? "rotate-90" : ""
                )}
                size={14}
              />
              <span className="text-xs font-normal text-gray-400 mr-2">
                ({groupFlags.length})
              </span>
              <span className="text-sm font-medium text-gray-700">
                {groupName}
              </span>
            </div>

            {/* Group Items */}
            {expandedGroups.has(groupName) &&
              groupFlags.map((flag) => (
                <div
                  key={flag.id}
                  className="grid grid-cols-12 gap-2 px-4 py-2 border-b hover:bg-gray-50"
                >
                  <div className="col-span-6">
                    <div className="flex items-center gap-2 pl-6">
                      <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                        {flag.regulationType}
                      </span>
                      {flag.description && (
                        <span className="text-xs text-gray-500">
                          - {flag.description}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-span-3">
                    <span className="text-sm text-gray-900">
                      {flag.timeStamp}
                    </span>
                  </div>
                  <div className="col-span-3">
                    <StatusBadge status={flag.status} />
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Flag Audit Log Table
function FlagAuditLog({ flagAuditLog }: { flagAuditLog: FlagAuditItem[] }) {
  if (!flagAuditLog || !Array.isArray(flagAuditLog)) {
    return <div>No audit log data available</div>;
  }

  // Separate pending and reviewed flags
  const pendingFlags = flagAuditLog.filter((item) => item.status === "PENDING");
  const reviewedFlags = flagAuditLog.filter(
    (item) => item.status !== "PENDING"
  );

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm h-full flex flex-col">
      <div className="bg-gray-50 px-4 pt-3">
        <h3 className="text-sm font-medium text-gray-900 pb-3 border-b border-gray-200 -mx-4 px-4">
          Flag Audit Log
        </h3>
      </div>

      <Tabs
        defaultValue="reviewed"
        className="w-full flex-1 flex flex-col gap-0 bg-white"
      >
        <TabsList className="w-full justify-start bg-gray-50 rounded-none border-b">
          <TabsTrigger value="pending">Pending Flags</TabsTrigger>
          <TabsTrigger value="reviewed">Reviewed Flags</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-0 flex-1">
          {pendingFlags.length > 0 ? (
            <ScrollArea className="h-full">
              <GroupedFlagAuditDisplay flags={pendingFlags} />
            </ScrollArea>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No pending flags
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviewed" className="mt-0 flex-1">
          {reviewedFlags.length > 0 ? (
            <ScrollArea className="h-full">
              <GroupedFlagAuditDisplay flags={reviewedFlags} />
            </ScrollArea>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No reviewed flags
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="bg-gray-50 px-4 py-3 border-t">
        <Button variant="outline" size="sm">
          Load more
        </Button>
      </div>
    </div>
  );
}

// Transcript Section
function TranscriptSection({ transcript }: { transcript: TranscriptEntry[] }) {
  if (!transcript || !Array.isArray(transcript)) {
    return <div>No transcript available</div>;
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white h-full flex flex-col">
      <div className="bg-gray-50 px-4 py-3 border-b">
        <h3 className="text-sm font-medium text-gray-900">Transcript</h3>
      </div>

      <ScrollArea className="flex-1 p-4 bg-gray-50">
        <div className="space-y-0">
          {transcript.map((entry, index) => (
            <div
              key={entry.id}
              className={cn(
                "py-3 space-y-1",
                index !== transcript.length - 1 && "border-b border-gray-200"
              )}
            >
              <div className="font-medium text-sm text-gray-500">
                {entry.speaker}
              </div>
              <div className="text-sm text-gray-900 leading-relaxed font-bold">
                {entry.text}
              </div>
              {entry.flagged && entry.violation && (
                <div className="flex items-center gap-1 text-red-600 text-xs">
                  <Flag size={10} />
                  <span>{entry.violation}</span>
                </div>
              )}
              <div className="text-xs text-blue-600 font-medium">
                {entry.timestamp}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

// Voice Analysis Section
function VoiceAnalysis({
  voiceAnalysisData,
}: {
  voiceAnalysisData?: CallDataProps["voiceAnalysisData"];
}) {
  if (!voiceAnalysisData) return null;

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b">
        <h3 className="text-sm font-medium text-gray-900">Voice Analysis</h3>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>{voiceAnalysisData.duration} seconds</span>
          </div>
          <div className="flex items-center gap-2">
            <span>█ {voiceAnalysisData.segments} seconds</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-gray-500">● Complete</span>
            <span className="text-gray-500">○ Non-complete</span>
          </div>
        </div>

        <div className="mt-4 h-20 bg-gray-100 rounded flex items-center justify-center">
          <span className="text-gray-500 text-sm">
            Voice analysis visualization would go here
          </span>
        </div>
      </div>
    </div>
  );
}

// Main Call Data Component
export function CallData({
  summary,
  callDetails,
  flagAuditLog,
  transcript,
  voiceAnalysisData,
}: CallDataProps) {
  return (
    <div className="max-w-7xl mx-auto p-6 gap-y-6 bg-gray-200 rounded-2xl flex flex-col">
      {/* Row 1 - Call Data Summary */}
      <CallSummary summary={summary} />

      {/* Row 2 - Call Details */}
      <CallDetailsSection callDetails={callDetails} />

      {/* Row 3 - Two Column Layout: Flag Audit Log (3) & Transcript (2) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 basis-auto min-h-[40vh]">
        {/* Col 1 - Flag Audit Log (3/5 width) */}
        <div className="lg:col-span-3 h-full">
          <FlagAuditLog flagAuditLog={flagAuditLog} />
        </div>

        {/* Col 2 - Transcript (2/5 width) */}
        <div className="lg:col-span-2 h-full">
          <TranscriptSection transcript={transcript} />
        </div>
      </div>

      {/* Row 4 - Voice Analysis */}
      <VoiceAnalysis voiceAnalysisData={voiceAnalysisData} />
    </div>
  );
}

// Sample data for demonstration
export const sampleCallData: CallDataProps = {
  summary:
    "Summary: The client called due to difficulty accessing their account. The agent verified the client's identity, identified that the account was temporarily locked due to multiple failed login attempts, and successfully guided the client through the process of resetting their password. Customer also wanted to purchase some new Treasury Bonds and was assisted with that transaction.",
  callDetails: {
    callDate: "Nov 30, 2025",
    duration: "31 mins 31 secs",
    callStartTime: "10:30:00 AM",
    callEndTime: "10:42:31 AM",
    callType: "Inbound",
    recordingSource: "NICE",
    overallSentimentAnalysis: "Positive",
    firstySensor: "Identified, not authenticated",
  },
  flagAuditLog: [
    {
      id: "1",
      regulationType: "Exploitation of Trust",
      timeStamp: "00:02:02",
      status: "REVIEWED / ACCEPTED",
    },
    {
      id: "2",
      regulationType: "Failure to Disclose Risk",
      timeStamp: "00:02:02",
      status: "REVIEWED / ACCEPTED",
    },
    {
      id: "3",
      regulationType: "Violation Example A",
      timeStamp: "00:02:02",
      status: "REVIEWED / REJECTED",
    },
    {
      id: "4",
      regulationType: "Violation Example B",
      timeStamp: "00:02:02",
      status: "REVIEWED / ACCEPTED",
    },
    {
      id: "5",
      regulationType: "Violation Example C",
      timeStamp: "00:02:02",
      status: "REVIEWED / ACCEPTED",
    },
    {
      id: "6",
      regulationType: "Violation Example D",
      timeStamp: "00:02:02",
      status: "REVIEWED / ACCEPTED",
    },
    {
      id: "7",
      regulationType: "Violation Example E",
      timeStamp: "00:02:02",
      status: "REVIEWED / REJECTED",
    },
    {
      id: "8",
      regulationType: "Violation Example F",
      timeStamp: "00:02:02",
      status: "REVIEWED / REJECTED",
    },
  ],
  transcript: [
    {
      id: "1",
      speaker: "Richard Hendricks",
      timestamp: "00:02:02",
      text: "You mentioned you wanted to make some adjustments to your current investments, which ones?",
      sentiment: "neutral",
    },
    {
      id: "2",
      speaker: "Jethery Preston Bezos",
      timestamp: "00:02:23",
      text: "I would like to purchase some new treasury bonds",
      sentiment: "positive",
    },
    {
      id: "3",
      speaker: "Richard Hendricks",
      timestamp: "00:02:35",
      text: "Oh, that's a great idea, right now we have some really good yields on XXX XXX",
      sentiment: "positive",
    },
    {
      id: "4",
      speaker: "Jethery Preston Bezos",
      timestamp: "00:02:50",
      text: "I would like to purchase some new treasury bonds",
      sentiment: "positive",
    },
    {
      id: "5",
      speaker: "Richard Hendricks",
      timestamp: "00:03:04",
      text: "Yes, I would suggest XXX XXX. I even have some myself and they are the way to go.",
      sentiment: "positive",
    },
    {
      id: "6",
      speaker: "Jethery Preston Bezos",
      timestamp: "00:03:22",
      text: "Sounds great, lets purchase those.",
      sentiment: "positive",
    },
  ],
  voiceAnalysisData: {
    duration: 170,
    segments: 170,
    complete: true,
  },
};
