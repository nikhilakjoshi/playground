import { CallData } from "@/components/call-data";

const sampleCallData = {
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
      regulationType: "Elder Abuse",
      timeStamp: "00:02:02",
      status: "REVIEWED / ACCEPTED" as const,
    },
    {
      id: "2",
      regulationType: "Exploitation of Trust",
      timeStamp: "00:02:02",
      status: "REVIEWED / ACCEPTED" as const,
    },
    {
      id: "3",
      regulationType: "FINOP - Miranda Violation",
      timeStamp: "00:02:02",
      status: "REVIEWED / ACCEPTED" as const,
      description: "Miranda Violation",
    },
    {
      id: "4",
      regulationType: "Failure to Disclose Risk",
      timeStamp: "00:02:02",
      status: "REVIEWED / ACCEPTED" as const,
    },
    {
      id: "5",
      regulationType: "Violation Example A",
      timeStamp: "00:02:02",
      status: "REVIEWED / REJECTED" as const,
    },
    {
      id: "6",
      regulationType: "Violation Example B",
      timeStamp: "00:02:02",
      status: "REVIEWED / ACCEPTED" as const,
    },
    {
      id: "7",
      regulationType: "Violation Example C",
      timeStamp: "00:02:02",
      status: "REVIEWED / ACCEPTED" as const,
    },
    {
      id: "8",
      regulationType: "Pending Review Item A",
      timeStamp: "00:03:15",
      status: "PENDING" as const,
    },
    {
      id: "9",
      regulationType: "Pending Review Item B",
      timeStamp: "00:04:22",
      status: "PENDING" as const,
    },
  ],
  transcript: [
    {
      id: "1",
      speaker: "Richard Hendricks",
      timestamp: "00:01:03",
      text: "You mentioned you wanted to make some adjustments to your current investments, which ones?",
      sentiment: "neutral" as const,
    },
    {
      id: "2",
      speaker: "Jethery Preston Bezos",
      timestamp: "00:01:23",
      text: "I would like to purchase some new treasury bonds",
      sentiment: "positive" as const,
    },
    {
      id: "3",
      speaker: "Richard Hendricks",
      timestamp: "00:01:35",
      text: "Oh, that's a great idea, right now we have some really good yields on XXX XXX",
      sentiment: "positive" as const,
      flagged: true,
      violation: "RNDIP - MIRANDA VIOLATION",
    },
    {
      id: "4",
      speaker: "Jethery Preston Bezos",
      timestamp: "00:01:50",
      text: "I would like to purchase some new treasury bonds",
      sentiment: "positive" as const,
    },
    {
      id: "5",
      speaker: "Richard Hendricks",
      timestamp: "00:02:04",
      text: "Yes, I would suggest XXX XXX. I even have some myself and they are the way to go.",
      sentiment: "positive" as const,
      flagged: true,
      violation: "RNDIP - MIRANDA VIOLATION",
    },
    {
      id: "6",
      speaker: "Jethery Preston Bezos",
      timestamp: "00:02:22",
      text: "Sounds great, lets purchase those.",
      sentiment: "positive" as const,
    },
  ],
  voiceAnalysisData: {
    duration: 170,
    segments: 170,
    complete: true,
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CallData
        summary={sampleCallData.summary}
        callDetails={sampleCallData.callDetails}
        flagAuditLog={sampleCallData.flagAuditLog}
        transcript={sampleCallData.transcript}
        voiceAnalysisData={sampleCallData.voiceAnalysisData}
      />
    </div>
  );
}
