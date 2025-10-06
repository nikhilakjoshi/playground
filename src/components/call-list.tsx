"use client";

import * as React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridReadyEvent, ICellRendererParams } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Filter, Download } from "lucide-react";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Types for the call list data structure
export interface CallListItem {
  id: string;
  no: number;
  interactionId: string;
  agentName: string;
  callType: string;
  interactionDate: string;
  origin: string;
  status: "PENDING REVIEW" | "REVIEWED" | "REPROCESSING" | "PROCESSING FAIL";
}

export interface CallListProps {
  calls: CallListItem[];
  onViewCall: (callId: string) => void;
  onExport?: () => void;
}

// Status Badge Component (reusing same colors as call details)
function StatusBadge({ status }: { status: string }) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "REVIEWED":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING REVIEW":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "REPROCESSING":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PROCESSING FAIL":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border",
        getStatusStyles(status)
      )}
    >
      {status}
    </span>
  );
}

// Actions Cell Renderer
function ActionsCellRenderer(props: ICellRendererParams) {
  const { onViewCall } = props.context || {};

  return (
    <div className="flex items-center">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onViewCall?.(props.data.id)}
      >
        View Call
      </Button>
    </div>
  );
}

// Status Cell Renderer
function StatusCellRenderer(props: ICellRendererParams) {
  return <StatusBadge status={props.value} />;
}

// Main Call List Component
export function CallList({ calls, onViewCall, onExport }: CallListProps) {
  const gridRef = React.useRef<AgGridReact>(null);

  // Column definitions
  const columnDefs: ColDef[] = [
    {
      headerName: "No.",
      field: "no",
      width: 80,
      sortable: true,
      cellStyle: { textAlign: "center" },
      resizable: true,
    },
    {
      headerName: "Interaction ID",
      field: "interactionId",
      width: 180,
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Agent Name",
      field: "agentName",
      width: 150,
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Call Type",
      field: "callType",
      width: 120,
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Interaction Date",
      field: "interactionDate",
      width: 150,
      sortable: true,
      filter: "agDateColumnFilter",
      resizable: true,
    },
    {
      headerName: "Origin",
      field: "origin",
      width: 180,
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Status",
      field: "status",
      width: 150,
      sortable: true,
      filter: true,
      cellRenderer: StatusCellRenderer,
      resizable: true,
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 120,
      sortable: false,
      filter: false,
      cellRenderer: ActionsCellRenderer,
      resizable: false,
      pinned: "right",
    },
  ];

  // Default column properties
  const defaultColDef = {
    resizable: true,
    sortable: true,
    filter: false,
  };

  // Grid ready handler
  const onGridReady = (params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  };

  // Grid context for passing functions to cell renderers
  const gridContext = {
    onViewCall,
  };

  return (
    <div className="w-full h-full">
      {/* Padded Background Container */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-gray-900">List of Calls</h1>
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="flex items-center gap-2"
            >
              <Download size={16} />
              Export
            </Button>
          )}
        </div>

        {/* Filter Section */}
        <div className="mb-4">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Filter size={16} />
            View by Date
            <span>▼</span>
          </Button>
        </div>

        {/* AG Grid Table */}
        <div className="ag-theme-alpine w-full" style={{ height: 600 }}>
          <AgGridReact
            ref={gridRef}
            rowData={calls}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            context={gridContext}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 25, 50]}
            suppressRowClickSelection={true}
            rowSelection="single"
            animateRows={true}
            suppressCellFocus={true}
            headerHeight={40}
            rowHeight={50}
          />
        </div>

        {/* Footer Info */}
        <div className="mt-4 text-sm text-gray-500">
          Showing {Math.min(calls.length, 10)} of {calls.length}
        </div>
      </div>
    </div>
  );
}

// Sample data for demonstration
export const sampleCallListData: CallListItem[] = [
  {
    id: "1",
    no: 1,
    interactionId: "EJI234567890-0987",
    agentName: "John Hamm",
    callType: "Inbound",
    interactionDate: "04/01/2025",
    origin: "NIC - OPS",
    status: "PENDING REVIEW",
  },
  {
    id: "2",
    no: 2,
    interactionId: "EJI234567890-0987",
    agentName: "John Hamm",
    callType: "Inbound",
    interactionDate: "04/01/2025",
    origin: "NIC - Estates",
    status: "PENDING REVIEW",
  },
  {
    id: "3",
    no: 3,
    interactionId: "EJI234567890-0987",
    agentName: "Yajara Louis",
    callType: "Inbound",
    interactionDate: "04/01/2025",
    origin: "Citi Private Client",
    status: "PENDING REVIEW",
  },
  {
    id: "4",
    no: 4,
    interactionId: "EJI234567890-0987",
    agentName: "John Hamm",
    callType: "Inbound",
    interactionDate: "04/01/2025",
    origin: "Citi Private Client",
    status: "REVIEWED",
  },
  {
    id: "5",
    no: 5,
    interactionId: "EJI234567890-0987",
    agentName: "John Hamm",
    callType: "Inbound",
    interactionDate: "04/01/2025",
    origin: "WA- Wealth Coach",
    status: "REPROCESSING",
  },
  {
    id: "6",
    no: 6,
    interactionId: "EJI234567890-0987",
    agentName: "John Hamm",
    callType: "Inbound",
    interactionDate: "04/01/2025",
    origin: "NIC - Estates",
    status: "REVIEWED",
  },
  {
    id: "7",
    no: 7,
    interactionId: "EJI234567890-0987",
    agentName: "John Hamm",
    callType: "Inbound",
    interactionDate: "04/01/2025",
    origin: "NIC - Estates",
    status: "PENDING REVIEW",
  },
  {
    id: "8",
    no: 8,
    interactionId: "EJI234567890-0987",
    agentName: "John Hamm",
    callType: "Inbound",
    interactionDate: "04/01/2025",
    origin: "WA- Wealth Coach",
    status: "REPROCESSING",
  },
  {
    id: "9",
    no: 9,
    interactionId: "EJI234567890-0987",
    agentName: "John Hamm",
    callType: "Inbound",
    interactionDate: "04/01/2025",
    origin: "WA- Wealth Advisor",
    status: "PROCESSING FAIL",
  },
  {
    id: "10",
    no: 10,
    interactionId: "EJI234567890-0987",
    agentName: "John Hamm",
    callType: "Inbound",
    interactionDate: "04/01/2025",
    origin: "WA- Wealth Advisor",
    status: "PENDING REVIEW",
  },
];
