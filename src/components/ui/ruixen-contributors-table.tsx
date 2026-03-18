"use client";

import { useState } from "react";
import { CheckCircle2, Eye, Mail, Phone, SquarePen, Trash2 } from "lucide-react";

import type { Complaint } from "@/hooks/useComplaints";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ComplaintRecord = Complaint & {
  submittedBy?: string;
};

type ComplaintTableProps = {
  complaints: ComplaintRecord[];
  mode?: "admin" | "user";
  onView?: (complaint: ComplaintRecord) => void;
  onResolve?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (complaint: ComplaintRecord) => void;
};

const allColumns = [
  "Complaint",
  "Submitted By",
  "Category",
  "Priority",
  "Created At",
  "Contact",
  "Status",
  "Actions",
] as const;

const statusBadgeClass: Record<Complaint["status"], string> = {
  open: "border-red-400/30 bg-red-500/15 text-red-300",
  in_progress: "border-yellow-400/30 bg-yellow-500/15 text-yellow-200",
  resolved: "border-green-400/30 bg-green-500/15 text-green-300",
  closed: "border-slate-400/30 bg-slate-500/15 text-slate-200",
};

const priorityBadgeClass: Record<Complaint["priority"], string> = {
  low: "border-emerald-400/30 bg-emerald-500/15 text-emerald-300",
  medium: "border-amber-400/30 bg-amber-500/15 text-amber-200",
  high: "border-rose-400/30 bg-rose-500/15 text-rose-300",
};

const getComplaintDate = (createdAt: Complaint["createdAt"]) => {
  if (!createdAt) {
    return "Pending";
  }

  if (typeof createdAt?.toDate === "function") {
    return createdAt.toDate().toLocaleDateString();
  }

  const date = new Date(createdAt);
  return Number.isNaN(date.getTime()) ? "Pending" : date.toLocaleDateString();
};

const getAvatarUrl = (seed: string) =>
  `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed || "guest")}`;

function ComplaintContributorsTable({
  complaints,
  mode = "admin",
  onView,
  onResolve,
  onDelete,
  onEdit,
}: ComplaintTableProps) {
  const [visibleColumns, setVisibleColumns] = useState<string[]>([...allColumns]);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const filteredData = complaints.filter((complaint) => {
    const category = complaint.category || "";
    const title = complaint.title || "";

    return (
      (!statusFilter || complaint.status.toLowerCase().includes(statusFilter.toLowerCase())) &&
      (!categoryFilter ||
        category.toLowerCase().includes(categoryFilter.toLowerCase()) ||
        title.toLowerCase().includes(categoryFilter.toLowerCase()))
    );
  });

  const toggleColumn = (column: string) => {
    setVisibleColumns((prev) =>
      prev.includes(column)
        ? prev.filter((item) => item !== column)
        : [...prev, column],
    );
  };

  return (
    <div className="my-6 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur-xl">
      <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap">
          <Input
            placeholder="Filter by category..."
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="w-full border-white/10 bg-white/5 text-white placeholder:text-slate-400 sm:w-52"
          />
          <Input
            placeholder="Filter by status..."
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full border-white/10 bg-white/5 text-white placeholder:text-slate-400 sm:w-52"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="hidden border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white sm:inline-flex"
            >
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            {allColumns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column}
                checked={visibleColumns.includes(column)}
                onCheckedChange={() => toggleColumn(column)}
              >
                {column}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-3 sm:hidden">
        {filteredData.length ? (
          filteredData.map((complaint) => {
            const identity = complaint.userEmail || complaint.mobile || complaint.title;
            const canResolve =
              mode === "admin" &&
              complaint.status !== "resolved" &&
              complaint.status !== "closed";

            return (
              <div
                key={complaint.id}
                className="space-y-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 ring-2 ring-white/10">
                    <AvatarImage src={getAvatarUrl(identity)} alt={identity} />
                    <AvatarFallback>{identity.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="break-words text-sm font-semibold text-white">{complaint.title}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {complaint.submittedBy || complaint.userEmail || "Anonymous"}
                    </p>
                  </div>
                </div>

                <p className="break-words text-sm leading-6 text-slate-300">{complaint.description}</p>

                <div className="flex flex-wrap gap-2">
                  <Badge className={cn("border capitalize", priorityBadgeClass[complaint.priority])}>
                    {complaint.priority}
                  </Badge>
                  <Badge className={cn("border capitalize", statusBadgeClass[complaint.status])}>
                    {complaint.status.replace("_", " ")}
                  </Badge>
                  <Badge className="border border-white/10 bg-white/5 capitalize text-slate-200">
                    {complaint.category || "general"}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs text-slate-400">
                  <p>Created: {getComplaintDate(complaint.createdAt)}</p>
                  <p className="break-all">Email: {complaint.userEmail || "No email available"}</p>
                  <p>Phone: {complaint.mobile || "No phone number"}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {onView && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="min-h-9 flex-1 border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white"
                      onClick={() => onView(complaint)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  )}
                  {mode === "user" && onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="min-h-9 flex-1 border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white"
                      onClick={() => onEdit(complaint)}
                    >
                      <SquarePen className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  )}
                  {canResolve && onResolve && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="min-h-9 flex-1 border border-emerald-400/20 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20 hover:text-emerald-100"
                      onClick={() => onResolve(complaint.id)}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Resolve
                    </Button>
                  )}
                  {mode === "admin" && onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="min-h-9 flex-1 border border-rose-400/20 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20 hover:text-rose-100"
                      onClick={() => onDelete(complaint.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-8 text-center text-sm text-slate-400">
            No complaints found.
          </div>
        )}
      </div>

      <div className="hidden sm:block">
        <Table className="min-w-[920px]">
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              {visibleColumns.includes("Complaint") && <TableHead className="w-[220px] text-slate-300">Complaint</TableHead>}
              {visibleColumns.includes("Submitted By") && <TableHead className="w-[210px] text-slate-300">Submitted By</TableHead>}
              {visibleColumns.includes("Category") && <TableHead className="w-[140px] text-slate-300">Category</TableHead>}
              {visibleColumns.includes("Priority") && <TableHead className="w-[120px] text-slate-300">Priority</TableHead>}
              {visibleColumns.includes("Created At") && <TableHead className="w-[130px] text-slate-300">Created At</TableHead>}
              {visibleColumns.includes("Contact") && <TableHead className="w-[190px] text-slate-300">Contact</TableHead>}
              {visibleColumns.includes("Status") && <TableHead className="w-[120px] text-slate-300">Status</TableHead>}
              {visibleColumns.includes("Actions") && <TableHead className="w-[170px] text-slate-300">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length ? (
              filteredData.map((complaint) => {
                const identity = complaint.userEmail || complaint.mobile || complaint.title;
                const canResolve =
                  mode === "admin" &&
                  complaint.status !== "resolved" &&
                  complaint.status !== "closed";

                return (
                  <TableRow key={complaint.id} className="border-white/10 hover:bg-white/5">
                    {visibleColumns.includes("Complaint") && (
                      <TableCell className="py-4 align-middle font-medium text-white">
                        <div className="space-y-1">
                          <p className="break-words">{complaint.title}</p>
                          <p className="line-clamp-2 break-words text-xs text-slate-400">{complaint.description}</p>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.includes("Submitted By") && (
                      <TableCell className="py-4 align-middle">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 ring-2 ring-white/10">
                            <AvatarImage src={getAvatarUrl(identity)} alt={identity} />
                            <AvatarFallback>{identity.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">
                              {complaint.submittedBy || complaint.userEmail || "Anonymous"}
                            </p>
                            <p className="truncate text-xs text-slate-400">{complaint.userEmail || "No email"}</p>
                          </div>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.includes("Category") && (
                      <TableCell className="py-4 align-middle capitalize text-slate-300">
                        {complaint.category || "general"}
                      </TableCell>
                    )}
                    {visibleColumns.includes("Priority") && (
                      <TableCell className="py-4 align-middle">
                        <Badge className={cn("border capitalize", priorityBadgeClass[complaint.priority])}>
                          {complaint.priority}
                        </Badge>
                      </TableCell>
                    )}
                    {visibleColumns.includes("Created At") && (
                      <TableCell className="py-4 align-middle text-slate-300">
                        {getComplaintDate(complaint.createdAt)}
                      </TableCell>
                    )}
                    {visibleColumns.includes("Contact") && (
                      <TableCell className="py-4 align-middle">
                        <TooltipProvider>
                          <div className="flex items-center gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-200">
                                  <Mail className="h-4 w-4" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{complaint.userEmail || "No email available"}</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-200">
                                  <Phone className="h-4 w-4" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{complaint.mobile || "No phone number"}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TooltipProvider>
                      </TableCell>
                    )}
                    {visibleColumns.includes("Status") && (
                      <TableCell className="py-4 align-middle">
                        <Badge className={cn("border capitalize", statusBadgeClass[complaint.status])}>
                          {complaint.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                    )}
                    {visibleColumns.includes("Actions") && (
                      <TableCell className="py-4 align-middle whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {onView && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-200 hover:bg-white/10 hover:text-white"
                              onClick={() => onView(complaint)}
                              aria-label={`View ${complaint.title}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          {mode === "user" && onEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-200 hover:bg-white/10 hover:text-white"
                              onClick={() => onEdit(complaint)}
                              aria-label={`Edit ${complaint.title}`}
                            >
                              <SquarePen className="h-4 w-4" />
                            </Button>
                          )}
                          {canResolve && onResolve && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-emerald-300 hover:bg-emerald-500/10 hover:text-emerald-200"
                              onClick={() => onResolve(complaint.id)}
                              aria-label={`Resolve ${complaint.title}`}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          )}
                          {mode === "admin" && onDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
                              onClick={() => onDelete(complaint.id)}
                              aria-label={`Delete ${complaint.title}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            ) : (
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableCell colSpan={visibleColumns.length} className="py-8 text-center text-slate-400">
                  No complaints found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ComplaintContributorsTable;
