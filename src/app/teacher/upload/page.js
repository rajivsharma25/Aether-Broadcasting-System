'use client';
// Content Upload Page: High-level container for the content upload workflow.
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { UploadForm } from '@/components/forms/UploadForm';
import { toast } from 'sonner';
import ContentService from '@/services/content.service';
import { useAuth } from '@/context/AuthContext';

export default function UploadPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handles the submission of content data from the modular UploadForm component
   */
  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await ContentService.uploadContent({
        ...data,
        teacherId: user?.id,
        teacherName: user?.name,
      });
      toast.success('Content uploaded successfully and pending approval!');
      router.push('/teacher/content');
    } catch (error) {
      toast.error(error.message || 'Failed to upload content');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Upload New Content</h1>
          <p className="text-slate-500 font-medium">Share educational materials with your students.</p>
        </div>

        <Card className="p-8 shadow-2xl shadow-slate-200/50">
          <UploadForm onSubmit={handleSubmit} isLoading={isSubmitting} />
        </Card>
      </div>
    </DashboardLayout>
  );
}
