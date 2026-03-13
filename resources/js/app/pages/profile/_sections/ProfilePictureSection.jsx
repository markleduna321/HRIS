import { useRef } from 'react';
import { UserCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/components';

export default function ProfilePictureSection({
  profilePicture,
  uploadingPicture,
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
      <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Picture</h2>
      <div className="flex items-center gap-6">
        <div className="flex-shrink-0">
          {profilePicture ? (
            <img
              src={`/storage/${profilePicture}`}
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <UserCircleIcon className="h-24 w-24 text-gray-300" />
          )}
        </div>
        <div className="flex-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              loading={uploadingPicture}
            >
              {uploadingPicture ? 'Uploading...' : 'Change Picture'}
            </Button>
            {profilePicture && (
              <Button
                variant="outline-danger"
                onClick={onDelete}
                icon={<TrashIcon className="h-4 w-4" />}
              >
                Delete
              </Button>
            )}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            JPG, PNG or GIF. Max size 2MB.
          </p>
        </div>
      </div>
    </div>
  );
}
