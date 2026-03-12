import React from 'react';
import { Modal as AntModal } from 'antd';

/**
 * Modal Component using Ant Design
 * 
 * @param {boolean} open - Controls modal visibility
 * @param {function} onClose - Callback when modal closes
 * @param {string} title - Modal title
 * @param {ReactNode} children - Modal content
 * @param {ReactNode} footer - Custom footer content
 * @param {string} size - Modal size: sm, md, lg, xl, full
 * @param {boolean} centered - Center the modal vertically
 * @param {boolean} closable - Show close button
 * @param {boolean} maskClosable - Close modal when clicking outside
 * @param {string} className - Additional CSS classes
 */
const Modal = ({
  open = false,
  onClose,
  title = '',
  children,
  footer = null,
  size = 'md',
  centered = true,
  closable = true,
  maskClosable = true,
  destroyOnClose = true,
  className = '',
  ...props
}) => {
  const sizes = {
    sm: 400,
    md: 600,
    lg: 800,
    xl: 1000,
    full: '90%',
  };

  return (
    <AntModal
      open={open}
      onCancel={onClose}
      title={title}
      footer={footer}
      width={sizes[size] || sizes.md}
      centered={centered}
      closable={closable}
      maskClosable={maskClosable}
      destroyOnClose={destroyOnClose}
      className={className}
      styles={{
        body: {
          maxHeight: '70vh',
          overflowY: 'auto',
          padding: '24px',
        },
      }}
      {...props}
    >
      {children}
    </AntModal>
  );
};

export default Modal;
