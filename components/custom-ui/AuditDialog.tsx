import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, SquarePen, Bell, Upload, Check, X, Clock } from "lucide-react";

type TabType = "reminder" | "newAudit" | "auditHistory";

interface AuditDialogProps {
  children: React.ReactNode;
  calculationData?: {
    taxType: string;
    totalAmount: number;
    currency: string;
    breakdown?: Record<string, any>;
    dueDate?: string;
    installments?: number;
  };
}

export function AuditDialog({ children, calculationData }: AuditDialogProps) {
  const [activeTab, setActiveTab] = useState<TabType>("reminder");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [validationStatus, setValidationStatus] = useState<"pending" | "verified" | "failed" | null>(null);

  // Generate payment schedules from calculation data or use dummy data
  const getPaymentSchedules = () => {
    if (calculationData) {
      const dueDate = calculationData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const installments = calculationData.installments || 3;
      return [
        {
          id: `PS${Date.now()}`,
          taxType: calculationData.taxType,
          totalAmount: `${calculationData.currency}${calculationData.totalAmount.toLocaleString()}`,
          dueDate,
          status: "pending" as const,
          installments,
        },
      ];
    }
    
    // Dummy data fallback
    return [
      {
        id: "PS001",
        taxType: "PAYE",
        totalAmount: "₦450,000",
        dueDate: "2025-12-25",
        status: "pending" as const,
        installments: 3,
      },
      {
        id: "PS002",
        taxType: "Business (CIT)",
        totalAmount: "₦2,150,000",
        dueDate: "2025-12-31",
        status: "pending" as const,
        installments: 4,
      },
    ];
  };

  const paymentSchedules = getPaymentSchedules();

  // Dummy blockchain audit history
  const blockchainRecords = [
    {
      id: "BLK001",
      receiptId: "RCP001",
      amount: "₦150,000",
      date: "2025-11-20",
      status: "verified",
      blockHash: "0x7f3a9e2c4b5d1f8e9a0b3c6d7e8f9a0b",
      txHash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p",
    },
    {
      id: "BLK002",
      receiptId: "RCP002",
      amount: "₦200,000",
      date: "2025-11-28",
      status: "verified",
      blockHash: "0x4b5d1f8e9a0b3c6d7e8f9a0b7f3a9e2c",
      txHash: "0x5e6f7g8h9i0j1k2l3m4n5o6p1a2b3c4d",
    },
    {
      id: "BLK003",
      receiptId: "RCP003",
      amount: "₦100,000",
      date: "2025-12-05",
      status: "verified",
      blockHash: "0x8f9a0b3c6d7e8f9a0b7f3a9e2c4b5d1f",
      txHash: "0x9i0j1k2l3m4n5o6p1a2b3c4d5e6f7g8h",
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Simulate validation after file upload
      setTimeout(() => {
        setValidationStatus("verified");
      }, 1500);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <Check className="w-4 h-4 text-green-500" />;
      case "failed":
        return <X className="w-4 h-4 text-red-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-600 text-white";
      case "failed":
        return "bg-red-600 text-white";
      case "pending":
        return "bg-yellow-600 text-white";
      default:
        return "bg-neutral-600 text-white";
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: "reminder",
      label: "Reminder",
      icon: <Bell className="w-4 h-4" />,
    },
    {
      id: "newAudit",
      label: "New Audit",
      icon: <SquarePen className="w-4 h-4" />,
    },
    {
      id: "auditHistory",
      label: "Audit History",
      icon: <FileText className="w-4 h-4" />,
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-2xl md:max-w-4xl lg:max-w-6xl min-h-[70vh] sm:min-h-[80vh] z-1000 p-0! overflow-hidden bg-[#1E1E1E] font-sans">
        <div className="flex h-full w-full flex-col">
          <div className="flex h-full w-full gap-0 overflow-hidden flex-col sm:flex-row">
            {/* Sidebar */}
            <div className="hidden sm:block w-40 md:w-48 shrink-0 border-r border-neutral-700 overflow-hidden">
              <Sidebar>
                <SidebarContent className="min-w-40 md:min-w-48 py-3">
                  <SidebarGroup>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {tabs.map((tab) => (
                          <SidebarMenuItem key={tab.id}>
                            <SidebarMenuButton
                              isActive={activeTab === tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              className="cursor-pointer text-xs sm:text-sm"
                            >
                              {tab.icon}
                              <span className="hidden sm:inline">{tab.label}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                </SidebarContent>
              </Sidebar>
            </div>

            {/* Mobile Tab Selector */}
            <div className="sm:hidden flex gap-2 p-3 border-b border-neutral-700 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded whitespace-nowrap text-xs transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white"
                      : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 w-full">
              {activeTab === "reminder" && (
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
                      Payment Schedules
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      {paymentSchedules.map((schedule) => (
                        <div
                          key={schedule.id}
                          className="p-3 sm:p-4 bg-neutral-800 rounded-lg border border-neutral-700 hover:border-blue-500 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-2 sm:mb-3 flex-col sm:flex-row gap-2">
                            <div>
                              <p className="text-white font-semibold text-sm sm:text-base">
                                {schedule.taxType}
                              </p>
                              <p className="text-xs text-neutral-400">
                                ID: {schedule.id}
                              </p>
                            </div>
                            <span className={`text-xs px-2 sm:px-3 py-1 rounded whitespace-nowrap ${getStatusBadgeColor(schedule.status)}`}>
                              {schedule.status.charAt(0).toUpperCase() +
                                schedule.status.slice(1)}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                            <div>
                              <p className="text-neutral-400 text-xs sm:text-sm">Total Amount</p>
                              <p className="text-white font-semibold text-sm sm:text-base">
                                {schedule.totalAmount}
                              </p>
                            </div>
                            <div>
                              <p className="text-neutral-400 text-xs sm:text-sm">Due Date</p>
                              <p className="text-white font-semibold">
                                {schedule.dueDate}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-neutral-400">
                                Installments: {schedule.installments}
                              </p>
                              <div className="w-full bg-neutral-700 rounded-full h-2 mt-1">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: "33%" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "newAudit" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Upload Receipt for Verification
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-neutral-300 mb-2 block">
                          Select Payment Schedule
                        </Label>
                        <select className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm">
                          <option>PS001 - PAYE (₦450,000)</option>
                          <option>PS002 - Business (₦2,150,000)</option>
                        </select>
                      </div>

                      <div className="border-2 border-dashed border-neutral-700 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer bg-neutral-900">
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="receipt-upload"
                          accept="image/*,.pdf"
                        />
                        <label htmlFor="receipt-upload" className="cursor-pointer">
                          <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                          <p className="text-white font-medium">
                            {uploadedFile ? uploadedFile.name : "Click to upload receipt"}
                          </p>
                          <p className="text-xs text-neutral-400 mt-1">
                            PNG, JPG, PDF (Max 5MB)
                          </p>
                        </label>
                      </div>

                      {uploadedFile && (
                        <div className="bg-neutral-800 rounded-lg p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-white text-sm">
                                Receipt Authenticity
                              </span>
                              {validationStatus === "verified" && (
                                <span className="flex items-center gap-2 text-green-500 text-sm">
                                  <Check className="w-4 h-4" />
                                  Authentic
                                </span>
                              )}
                              {validationStatus === "pending" && (
                                <span className="flex items-center gap-2 text-yellow-500 text-sm">
                                  <Clock className="w-4 h-4" />
                                  Verifying...
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <span className="text-neutral-400">Price Match</span>
                              {validationStatus === "verified" && (
                                <span className="flex items-center gap-2 text-green-500">
                                  <Check className="w-4 h-4" />
                                  Matched
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <span className="text-neutral-400">
                                Vendor Validation
                              </span>
                              {validationStatus === "verified" && (
                                <span className="flex items-center gap-2 text-green-500">
                                  <Check className="w-4 h-4" />
                                  Valid Vendor
                                </span>
                              )}
                            </div>
                          </div>

                          {validationStatus === "verified" && (
                            <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                              Store on Blockchain
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "auditHistory" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Blockchain Proof of Payment
                    </h3>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden bg-neutral-900">
                      <Table>
                        <TableHeader className="bg-neutral-800 border-b border-neutral-700">
                          <TableRow>
                            <TableHead className="text-neutral-300 py-3">
                              Receipt
                            </TableHead>
                            <TableHead className="text-neutral-300">
                              Amount
                            </TableHead>
                            <TableHead className="text-neutral-300">
                              Date
                            </TableHead>
                            <TableHead className="text-neutral-300">
                              Status
                            </TableHead>
                            <TableHead className="text-neutral-300">
                              Block Hash
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {blockchainRecords.map((record) => (
                            <TableRow
                              key={record.id}
                              className="border-b border-neutral-700 hover:bg-neutral-800 transition-colors"
                            >
                              <TableCell className="text-white py-3">
                                <span className="font-mono text-xs bg-neutral-800 px-2 py-1 rounded">
                                  {record.receiptId}
                                </span>
                              </TableCell>
                              <TableCell className="text-white font-semibold">
                                {record.amount}
                              </TableCell>
                              <TableCell className="text-neutral-400 text-sm">
                                {record.date}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(record.status)}
                                  <span className="text-xs capitalize text-neutral-300">
                                    {record.status}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="font-mono text-xs text-blue-400 hover:text-blue-300 cursor-pointer truncate block max-w-xs" title={record.blockHash}>
                                  {record.blockHash.slice(0, 10)}...
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="mt-6 p-4 bg-neutral-800 rounded-lg border border-neutral-700">
                      <p className="text-neutral-400 text-sm mb-2">
                        Total Verified Payments
                      </p>
                      <p className="text-white text-2xl font-bold">
                        ₦450,000
                      </p>
                      <p className="text-neutral-400 text-xs mt-2">
                        All proofs stored on blockchain with cryptographic verification
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
