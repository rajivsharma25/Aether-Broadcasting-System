"use client";
// All Content: Advanced search and filtering interface for all institution materials.
import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import ContentService from "@/services/content.service";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SkeletonLoader } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/common/Pagination";
import { Search, Filter, Eye, Calendar, Clock, Timer } from "lucide-react";
import { clsx } from "clsx";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { format } from "date-fns";
import Image from "next/image";
import { getScheduleStatus } from "@/utils/helpers";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function AllContentPage() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    let mounted = true;
    const loadContent = async () => {
      const data = await ContentService.getContent({
        status: statusFilter === "all" ? null : statusFilter,
        search: searchTerm,
      });
      if (mounted) {
        setContent(data);
        setLoading(false);
      }
    };

    loadContent();
    return () => { mounted = false; };
  }, [statusFilter, searchTerm]);

  const totalPages = Math.ceil(content.length / itemsPerPage);
  const currentItems = content.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          All Institution Content
        </h1>
        <p className="text-slate-500 font-medium">
          Search and filter through all uploaded broadcasting materials.
        </p>
      </div>

      <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-end md:space-x-4 md:space-y-0">
        <div className="flex-1">
          <Input
            label="Search"
            placeholder="Search by title or description..."
            icon={<Search className="h-4 w-4" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select
            label="Status"
            icon={<Filter className="h-4 w-4" />}
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: 'All Status', value: 'all' },
              { label: 'Pending', value: 'pending' },
              { label: 'Approved', value: 'approved' },
              { label: 'Rejected', value: 'rejected' }
            ]}
          />
        </div>
      </div>

      <Card className="overflow-hidden p-0 border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Content</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Teacher</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Broadcast</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">From</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">To</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="px-6 py-4">
                      <SkeletonLoader className="h-12 w-full" />
                    </td>
                  </tr>
                ))
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No content found matching your filters.
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200">
                          <Image
                            src={item.fileUrl}
                            alt=""
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{item.title}</p>
                          <p className="text-[10px] font-black uppercase tracking-tight text-slate-400">
                            {item.subject}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-slate-600">{item.teacherName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.status === 'approved' ? (
                        <div className={clsx(
                          "inline-flex items-center space-x-1.5 rounded-md border px-2 py-0.5 text-[10px] font-black uppercase tracking-tight",
                          getScheduleStatus(item.startTime, item.endTime) === 'Active' 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100 animate-pulse" 
                            : getScheduleStatus(item.startTime, item.endTime) === 'Scheduled' 
                            ? "bg-blue-50 text-blue-600 border-blue-100" 
                            : "bg-slate-50 text-slate-500 border-slate-200"
                        )}>
                          <div className={clsx(
                            "h-1.5 w-1.5 rounded-full",
                            getScheduleStatus(item.startTime, item.endTime) === 'Active' ? "bg-emerald-500" :
                            getScheduleStatus(item.startTime, item.endTime) === 'Scheduled' ? "bg-blue-500" : "bg-slate-400"
                          )} />
                          <span>{getScheduleStatus(item.startTime, item.endTime)}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">— Pending —</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-slate-600">{format(new Date(item.startTime), "MMM d, h:mm a")}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-slate-600">{format(new Date(item.endTime), "MMM d, h:mm a")}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="transition-all"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsPreviewOpen(true);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Details Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Content Overview"
      >
        {selectedItem && (
          <div className="space-y-6">
            {/* Cinematic Preview */}
            <div className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-950 shadow-2xl">
              <Image
                src={selectedItem.fileUrl}
                alt={selectedItem.title}
                fill
                className="object-contain p-2"
              />
              {/* Top Left: Status Overlay */}
              <div className="absolute top-4 left-4">
                <StatusBadge status={selectedItem.status} />
              </div>
              
              {/* Top Right: Rotation Overlay */}
              <div className="absolute top-4 right-4">
                <div className="flex items-center space-x-2 rounded-full bg-black/60 backdrop-blur-md px-3 py-1.5 text-[10px] font-bold text-white ring-1 ring-white/20 shadow-xl">
                  <Timer className="h-3 w-3 text-primary-light" />
                  <span>{selectedItem.rotationDuration}s</span>
                </div>
              </div>

              {/* Rejection Reason (Bottom Overlay) */}
              {selectedItem.status === 'rejected' && (
                <div className="absolute bottom-4 left-4 right-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="backdrop-blur-xl bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 shadow-2xl ring-1 ring-white/10">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                      <h4 className="text-[9px] font-black text-rose-300 uppercase tracking-widest">Moderator Feedback</h4>
                    </div>
                    <p className="text-xs font-medium text-rose-50 leading-relaxed italic line-clamp-2 tracking-tight">
                      &quot;{selectedItem.rejectionReason}&quot;
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50/50 p-4 border border-slate-100 ring-1 ring-slate-100/50">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subject</h4>
                <p className="mt-1 text-sm font-bold text-slate-800">{selectedItem.subject}</p>
              </div>
              <div className="rounded-2xl bg-slate-50/50 p-4 border border-slate-100 ring-1 ring-slate-100/50">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Uploaded By</h4>
                <div className="mt-1 flex items-center space-x-2">
                  <p className="text-sm font-bold text-slate-800">{selectedItem.teacherName}</p>
                </div>
              </div>
            </div>

            {/* Title & Description */}
            <div className="px-1">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">{selectedItem.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500 font-medium">{selectedItem.description || "No description provided."}</p>
            </div>

            {/* Status & Schedule Footer Card */}
            <div className="overflow-hidden rounded-2xl bg-slate-900 shadow-xl shadow-slate-900/20 p-6">
              <div className="space-y-6">
                {/* Broadcast Window (Full Width) */}
                <div className="flex items-center justify-between w-full">
                  <div className="text-left">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">From</h4>
                    <div className="text-xs font-bold text-white whitespace-nowrap">
                      {format(new Date(selectedItem.startTime), "MMM d, h:mm a")}
                    </div>
                  </div>
                  <div className="text-right">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">To</h4>
                    <div className="text-xs font-bold text-white/70 whitespace-nowrap">
                      {format(new Date(selectedItem.endTime), "MMM d, h:mm a")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
