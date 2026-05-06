"use client";
// Approval Queue: Specialized interface for the principal to review and moderate content.
import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import ApprovalService from "@/services/approval.service";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { SkeletonLoader } from "@/components/ui/Skeleton";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Eye, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

export default function ApprovalsPage() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const data = await ApprovalService.getPendingContent();
      if (mounted) {
        setPending(data);
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const handleApprove = async (id) => {
    try {
      await ApprovalService.processContent(id, "approved");
      toast.success("Content approved successfully!");
      // Refresh data
      const data = await ApprovalService.getPendingContent();
      setPending(data);
    } catch (error) {
      toast.error("Failed to approve content");
    }
  };

  const handleReject = async () => {
    if (!rejectionReason) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    try {
      await ApprovalService.processContent(
        selectedItem.id,
        "rejected",
        rejectionReason,
      );
      toast.success("Content rejected");
      setIsRejectModalOpen(false);
      setRejectionReason("");
      // Refresh data
      const data = await ApprovalService.getPendingContent();
      setPending(data);
    } catch (error) {
      toast.error("Failed to reject content");
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Pending Approvals</h1>
        <p className="text-muted-foreground">
          Review and moderate content before it goes live.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <SkeletonLoader key={i} type="approval" />
          ))}
        </div>
      ) : pending.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-20 text-center">
          <CheckCircle2 className="mb-4 h-12 w-12 text-emerald-500" />
          <h3 className="text-xl font-bold">All caught up!</h3>
          <p className="text-muted-foreground">
            There are no pending approval requests at the moment.
          </p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {pending.map((item) => (
            <Card
              key={item.id}
              className="flex items-center justify-between gap-4 p-6"
            >
              <div className="flex items-center space-x-6 flex-1">
                <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <Image
                    src={item.fileUrl}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="mb-1 flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      {item.subject}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <div className="flex items-center text-xs text-muted-foreground">
                      <User className="mr-1 h-3 w-3" />
                      <span>{item.teacherName}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <div className="mt-1 flex items-center text-xs text-muted-foreground">
                    <Calendar className="mr-1.5 h-3.5 w-3.5" />
                    <span>
                      Scheduled for{" "}
                      {format(new Date(item.startTime), "MMM d, h:mm a")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-1.5 shrink-0 min-w-[120px]">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setSelectedItem(item);
                    setIsPreviewOpen(true);
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleApprove(item.id)}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setSelectedItem(item);
                    setIsRejectModalOpen(true);
                  }}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Content Preview"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
              <Image
                src={selectedItem.fileUrl}
                alt=""
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h4 className="font-bold text-lg">{selectedItem.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedItem.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 text-xs">
              <div>
                <p className="font-bold text-muted-foreground uppercase mb-1">
                  Subject
                </p>
                <p className="font-medium">{selectedItem.subject}</p>
              </div>
              <div>
                <p className="font-bold text-muted-foreground uppercase mb-1">
                  Duration
                </p>
                <p className="font-medium">
                  {selectedItem.rotationDuration} seconds
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Rejection Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Reject Content"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please provide a reason for rejecting this content. This will be
            visible to the teacher.
          </p>
          <Input
            label="Rejection Reason"
            placeholder="e.g. Low quality image, incorrect information..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="ghost" onClick={() => setIsRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleReject}>
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
