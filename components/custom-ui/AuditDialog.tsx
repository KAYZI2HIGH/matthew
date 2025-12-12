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
import { FileText, SquarePen, Bell } from "lucide-react";

type TabType = "reminder" | "newAudit" | "auditHistory";

export function AuditDialog({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabType>("reminder");

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
      <DialogContent className="sm:max-w-175 min-h-[80vh]! z-1000 p-0! overflow-hidden bg-[#1E1E1E] font-sans">
        <div className="flex h-full w-full flex-col">
          <div className="flex h-full w-full gap-0 overflow-hidden">
            {/* Sidebar */}
            <div className="w-48 shrink-0 border-r overflow-hidden">
              <Sidebar>
                <SidebarContent className="min-w-48 py-3">
                  <SidebarGroup>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {tabs.map((tab) => (
                          <SidebarMenuItem key={tab.id}>
                            <SidebarMenuButton
                              isActive={activeTab === tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              className="cursor-pointer"
                            >
                              {tab.icon}
                              <span>{tab.label}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                </SidebarContent>
              </Sidebar>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 w-full">
              {activeTab === "reminder" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Audit Reminder
                  </h3>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label
                        htmlFor="audit-id"
                        className="text-neutral-300"
                      >
                        Audit ID
                      </Label>
                      <Input
                        id="audit-id"
                        placeholder="Auto-generated"
                        disabled
                        className="bg-neutral-800 border-neutral-700"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="audit-date"
                        className="text-neutral-300"
                      >
                        Audit Date
                      </Label>
                      <Input
                        id="audit-date"
                        type="date"
                        className="bg-neutral-800 border-neutral-700"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="audit-status"
                        className="text-neutral-300"
                      >
                        Status
                      </Label>
                      <Input
                        id="audit-status"
                        placeholder="Pending"
                        disabled
                        className="bg-neutral-800 border-neutral-700"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "newAudit" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Create New Audit
                  </h3>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="audit-name" className="text-neutral-300">
                        Audit Name
                      </Label>
                      <Input
                        id="audit-name"
                        placeholder="Enter audit name"
                        className="bg-neutral-800 border-neutral-700"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="audit-start-date"
                        className="text-neutral-300"
                      >
                        Start Date
                      </Label>
                      <Input
                        id="audit-start-date"
                        type="date"
                        className="bg-neutral-800 border-neutral-700"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="audit-end-date"
                        className="text-neutral-300"
                      >
                        End Date
                      </Label>
                      <Input
                        id="audit-end-date"
                        type="date"
                        className="bg-neutral-800 border-neutral-700"
                      />
                    </div>
                    <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                      Create Audit
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === "auditHistory" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Audit History
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-neutral-800 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Audit #001</p>
                        <p className="text-xs text-neutral-400">2025-12-10</p>
                      </div>
                      <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                        Completed
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-neutral-800 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Audit #002</p>
                        <p className="text-xs text-neutral-400">2025-12-05</p>
                      </div>
                      <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded">
                        In Progress
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-neutral-800 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Audit #003</p>
                        <p className="text-xs text-neutral-400">2025-11-28</p>
                      </div>
                      <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                        Completed
                      </span>
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
