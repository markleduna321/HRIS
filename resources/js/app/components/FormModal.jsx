import React from 'react';
import Modal from './Modal';
import { Button } from './index';

/**
 * Form Modal Component
 * A modal specifically designed for forms with proper actions
 */
const FormModal = ({
  open = false,
  onClose,
  onSubmit,
  title = '',
  children,
  submitText = 'Submit',
  cancelText = 'Cancel',
  submitVariant = 'primary',
  loading = false,
  size = 'md',
  ...props
}) => {
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (onSubmit) onSubmit();
  };

  const footer = (
    <div className="flex gap-3 justify-end">
      <Button variant="secondary" onClick={onClose} disabled={loading}>
        {cancelText}
      </Button>
      <Button 
        variant={submitVariant} 
        onClick={handleSubmit}
        loading={loading}
        disabled={loading}
      >
        {submitText}
      </Button>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={footer}
      size={size}
      {...props}
    >
      <form onSubmit={handleSubmit}>
        {children}
      </form>
    </Modal>
  );
};

export default FormModal;
