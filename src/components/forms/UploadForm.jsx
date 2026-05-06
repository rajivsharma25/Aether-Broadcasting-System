'use client';
// Reusable form component for content uploads with professional date picking and validation.
import { useState, useRef } from 'react';
import Image from 'next/image';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Upload, X, FileImage, Calendar, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { toast } from 'sonner';

export const UploadForm = ({ onSubmit, isLoading }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    startTime: null,
    endTime: null,
    rotationDuration: '10',
  });
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      toast.error('Invalid file type. Please upload JPG, PNG, or GIF.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const event = { target: { files: [file] } };
      handleFileChange(event);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!preview) {
      toast.error('Please upload a file');
      return;
    }
    if (!formData.startTime || !formData.endTime) {
      toast.error('Please select both start and end times');
      return;
    }
    if (formData.endTime <= formData.startTime) {
      toast.error('End time must be after start time');
      return;
    }
    onSubmit({ 
      ...formData, 
      startTime: formData.startTime.toISOString(),
      endTime: formData.endTime.toISOString(),
      fileUrl: preview 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">Content Title</label>
            <Input
              required
              placeholder="e.g., Introduction to Photosynthesis"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1.5"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Subject</label>
            <Input
              required
              placeholder="e.g., Biology"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="mt-1.5"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Description</label>
            <textarea
              rows={4}
              placeholder="Provide context for the students..."
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 outline-hidden resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-semibold text-slate-700">Media Content</label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !preview && fileInputRef.current?.click()}
            className={clsx(
              "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300",
              preview ? "border-primary bg-primary/5 aspect-video" : "border-slate-300 bg-slate-50 hover:border-primary hover:bg-primary/5 h-[280px] cursor-pointer",
              isDragging && "border-primary bg-primary/10 scale-[1.02]"
            )}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleFileChange}
            />

            <AnimatePresence mode="wait">
              {preview ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative h-full w-full"
                >
                  {/* unoptimized: Required because preview is a Base64 data: URL — Next.js Image optimizer does not support data: URLs */}
                  <Image 
                    src={preview} 
                    alt="Preview" 
                    fill 
                    unoptimized
                    className="rounded-2xl object-contain" 
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreview(null);
                    }}
                    className="absolute top-3 right-3 rounded-full bg-white/90 p-1.5 text-rose-500 shadow-md hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              ) : (
                <div className="text-center p-6">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm border border-slate-100">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">Click or drag image to upload</p>
                  <p className="mt-1 text-xs text-slate-400">JPG, PNG, or GIF (max 10MB)</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <label className="text-sm font-semibold text-slate-700">Start Date & Time</label>
          <div className="relative mt-1.5 datepicker-wrapper">
            <Calendar className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <DatePicker
              selected={formData.startTime}
              onChange={(date) => setFormData({ ...formData, startTime: date })}
              showTimeSelect
              dateFormat="MMM d, yyyy h:mm aa"
              placeholderText="Select start time"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 pl-10 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 outline-hidden"
              required
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">End Date & Time</label>
          <div className="relative mt-1.5 datepicker-wrapper">
            <Clock className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <DatePicker
              selected={formData.endTime}
              onChange={(date) => setFormData({ ...formData, endTime: date })}
              showTimeSelect
              dateFormat="MMM d, yyyy h:mm aa"
              placeholderText="Select end time"
              minDate={formData.startTime || new Date()}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 pl-10 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 outline-hidden"
              required
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Rotation (Seconds)</label>
          <Input
            type="number"
            min="5"
            required
            className="mt-1.5"
            value={formData.rotationDuration}
            onChange={(e) => setFormData({ ...formData, rotationDuration: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-slate-100">
        <Button
          type="submit"
          isLoading={isLoading}
          className="px-8 py-3.5 text-base font-bold shadow-xl shadow-primary/20"
        >
          Upload New Content
        </Button>
      </div>
    </form>
  );
};
