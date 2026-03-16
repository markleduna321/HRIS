import ResumeSection from './ResumeSection';

export default function DocumentsSection({
  resumePath,
  uploadingResume,
  onUploadResume,
  onDeleteResume,
}) {
  return (
    <div className="p-6">
      <ResumeSection
        resumePath={resumePath}
        uploadingResume={uploadingResume}
        onUpload={onUploadResume}
        onDelete={onDeleteResume}
      />
    </div>
  );
}
