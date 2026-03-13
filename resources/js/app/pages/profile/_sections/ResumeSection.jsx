import { useRef } from 'react';
import { DocumentArrowUpIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Button, IconButton } from '@/app/components';

export default function ResumeSection({
  resumePath,
  uploadingResume,
  onUpload,
  onDelete,
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(file);
      e.target.value = '';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Resume</h2>
      <div className="space-y-4">
        {resumePath ? (
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">Resume uploaded</p>
                <p className="text-xs text-green-700">{resumePath.split('/').pop()}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.open(`/storage/${resumePath}`, '_blank')}
              >
                View
              </Button>
              <IconButton
                variant="ghost-danger"
                size="sm"
                onClick={onDelete}
                title="Delete resume"
              >
                <TrashIcon className="h-4 w-4" />
              </IconButton>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">No resume uploaded</p>
            </div>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
          className="hidden"
        />
        <Button
          variant="secondary"
          fullWidth
          onClick={() => fileInputRef.current?.click()}
          loading={uploadingResume}
          icon={<DocumentArrowUpIcon className="h-5 w-5" />}
        >
          {uploadingResume ? 'Uploading...' : resumePath ? 'Replace Resume' : 'Upload Resume'}
        </Button>
        <p className="text-xs text-gray-500">
          PDF, DOC or DOCX. Max size 2MB.
        </p>
      </div>
    </div>
  );
}
