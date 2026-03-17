import React, { useState } from 'react';
import { Modal, Button, showSuccess, showError } from '@/app/components';
import { createInterview } from '@/app/services/interview-service';

export default function ScheduleInterviewModal({ isOpen, onClose, application, onSuccess, interviewType = 'initial' }) {
  const [form, setForm] = useState({
    mode: 'online',
    interview_date: '',
    interview_time: '',
    meeting_link: '',
    location: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleModeChange = (mode) => {
    setForm(prev => ({ ...prev, mode, meeting_link: '', location: '' }));
    setErrors({});
  };

  const validate = () => {
    const errs = {};
    if (!form.interview_date) errs.interview_date = 'Date is required';
    if (!form.interview_time) errs.interview_time = 'Time is required';
    if (form.mode === 'online' && !form.meeting_link) errs.meeting_link = 'Meeting link is required';
    if (form.mode === 'in-person' && !form.location) errs.location = 'Location is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await createInterview({
        job_application_id: application.id,
        type: interviewType,
        mode: form.mode,
        interview_date: form.interview_date,
        interview_time: form.interview_time,
        meeting_link: form.mode === 'online' ? form.meeting_link : null,
        location: form.mode === 'in-person' ? form.location : null,
        notes: form.notes || null,
      });
      showSuccess({
        title: interviewType === 'final' ? 'Final Interview Scheduled' : 'Interview Scheduled',
        content: `${interviewType === 'final' ? 'Final interview' : 'Interview'} for ${application.applicant_name} has been scheduled.`,
      });
      // Reset form
      setForm({ mode: 'online', interview_date: '', interview_time: '', meeting_link: '', location: '', notes: '' });
      setErrors({});
      onSuccess?.();
      onClose();
    } catch (error) {
      const msg = error.response?.data?.errors;
      if (msg) {
        setErrors(msg);
      } else {
        showError({ title: 'Error', content: 'Failed to schedule interview.' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!application) return null;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="md"
      title=""
      footer={null}
      closable={false}
      styles={{ body: { padding: 0, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' } }}
    >
      {/* Blue Header */}
      <div className="bg-indigo-600 px-6 py-4 -mt-6 -mx-6 mb-0 flex items-start justify-between rounded-t-lg">
        <div>
          <h2 className="text-lg font-semibold text-white">{interviewType === 'final' ? 'Schedule Final Interview' : 'Schedule Initial Interview'}</h2>
          <p className="text-sm text-indigo-200 mt-0.5">{application.applicant_name}</p>
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white transition-colors mt-1">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Interview Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Interview Mode *</label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mode"
                checked={form.mode === 'online'}
                onChange={() => handleModeChange('online')}
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Online</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mode"
                checked={form.mode === 'in-person'}
                onChange={() => handleModeChange('in-person')}
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">In-Person</span>
            </label>
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input
              type="date"
              value={form.interview_date}
              onChange={(e) => handleChange('interview_date', e.target.value)}
              className={`w-full rounded-lg border ${errors.interview_date ? 'border-red-300' : 'border-gray-300'} px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            />
            {errors.interview_date && <p className="text-xs text-red-500 mt-1">{errors.interview_date}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
            <input
              type="time"
              value={form.interview_time}
              onChange={(e) => handleChange('interview_time', e.target.value)}
              className={`w-full rounded-lg border ${errors.interview_time ? 'border-red-300' : 'border-gray-300'} px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            />
            {errors.interview_time && <p className="text-xs text-red-500 mt-1">{errors.interview_time}</p>}
          </div>
        </div>

        {/* Meeting Link (Online) */}
        {form.mode === 'online' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Link *</label>
            <input
              type="text"
              value={form.meeting_link}
              onChange={(e) => handleChange('meeting_link', e.target.value)}
              placeholder="https://meet.google.com/..."
              className={`w-full rounded-lg border ${errors.meeting_link ? 'border-red-300' : 'border-gray-300'} px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            />
            {errors.meeting_link && <p className="text-xs text-red-500 mt-1">{errors.meeting_link}</p>}
          </div>
        )}

        {/* Location (In-Person) */}
        {form.mode === 'in-person' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g., Conference Room A, Main Office"
              className={`w-full rounded-lg border ${errors.location ? 'border-red-300' : 'border-gray-300'} px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            />
            {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
          <textarea
            value={form.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Additional information for the candidate..."
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-200">
        <Button variant="secondary" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} loading={loading} className="flex-1">
          Schedule Interview
        </Button>
      </div>
    </Modal>
  );
}
