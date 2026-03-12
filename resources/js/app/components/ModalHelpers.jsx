import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined, CheckCircleOutlined, InfoCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

/**
 * Utility functions for showing confirmation modals
 */

/**
 * Show a confirmation dialog
 * @param {Object} config - Configuration object
 * @param {string} config.title - Dialog title
 * @param {string} config.content - Dialog content
 * @param {function} config.onOk - Callback when OK is clicked
 * @param {function} config.onCancel - Callback when Cancel is clicked
 * @param {string} config.okText - OK button text (default: 'OK')
 * @param {string} config.cancelText - Cancel button text (default: 'Cancel')
 * @param {string} config.okType - OK button type (default: 'primary')
 */
export const showConfirm = ({
  title = 'Confirm',
  content = 'Are you sure?',
  onOk,
  onCancel,
  okText = 'OK',
  cancelText = 'Cancel',
  okType = 'primary',
  ...config
}) => {
  Modal.confirm({
    title,
    icon: <ExclamationCircleOutlined />,
    content,
    onOk,
    onCancel,
    okText,
    cancelText,
    okType,
    centered: true,
    ...config,
  });
};

/**
 * Show a delete confirmation dialog
 */
export const showDeleteConfirm = ({
  title = 'Delete Confirmation',
  content = 'Are you sure you want to delete this item? This action cannot be undone.',
  onOk,
  onCancel,
  ...config
}) => {
  Modal.confirm({
    title,
    icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
    content,
    onOk,
    onCancel,
    okText: 'Delete',
    okType: 'danger',
    cancelText: 'Cancel',
    centered: true,
    ...config,
  });
};

/**
 * Show a success modal
 */
export const showSuccess = ({
  title = 'Success',
  content,
  onOk,
  ...config
}) => {
  Modal.success({
    title,
    icon: <CheckCircleOutlined />,
    content,
    onOk,
    centered: true,
    ...config,
  });
};

/**
 * Show an error modal
 */
export const showError = ({
  title = 'Error',
  content,
  onOk,
  ...config
}) => {
  Modal.error({
    title,
    icon: <CloseCircleOutlined />,
    content,
    onOk,
    centered: true,
    ...config,
  });
};

/**
 * Show an info modal
 */
export const showInfo = ({
  title = 'Information',
  content,
  onOk,
  ...config
}) => {
  Modal.info({
    title,
    icon: <InfoCircleOutlined />,
    content,
    onOk,
    centered: true,
    ...config,
  });
};

/**
 * Show a warning modal
 */
export const showWarning = ({
  title = 'Warning',
  content,
  onOk,
  ...config
}) => {
  Modal.warning({
    title,
    icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
    content,
    onOk,
    centered: true,
    ...config,
  });
};
