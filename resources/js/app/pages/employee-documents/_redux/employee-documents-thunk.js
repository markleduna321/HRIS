import { createAsyncThunk } from '@reduxjs/toolkit';
import * as employeeDocumentsService from '@/app/services/employee-documents-service';

// Fetch all employee documents with optional filters
export const fetchEmployeeDocuments = createAsyncThunk(
  'employeeDocuments/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      console.log('⚡ Thunk: fetchEmployeeDocuments called with params:', params);
      const response = await employeeDocumentsService.getEmployeeDocuments(params);
      console.log('⚡ Thunk: returning documents:', response);
      return response;
    } catch (error) {
      console.error('⚡ Thunk: fetchEmployeeDocuments error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch single employee document
export const fetchEmployeeDocument = createAsyncThunk(
  'employeeDocuments/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      console.log('⚡ Thunk: fetchEmployeeDocument called for id:', id);
      const response = await employeeDocumentsService.getEmployeeDocument(id);
      console.log('⚡ Thunk: returning document:', response);
      return response;
    } catch (error) {
      console.error('⚡ Thunk: fetchEmployeeDocument error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Upload new employee document
export const uploadEmployeeDocument = createAsyncThunk(
  'employeeDocuments/upload',
  async (formData, { rejectWithValue }) => {
    try {
      console.log('⚡ Thunk: uploadEmployeeDocument called');
      const response = await employeeDocumentsService.uploadEmployeeDocument(formData);
      console.log('⚡ Thunk: upload successful:', response);
      return response;
    } catch (error) {
      console.error('⚡ Thunk: uploadEmployeeDocument error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update employee document metadata
export const updateEmployeeDocument = createAsyncThunk(
  'employeeDocuments/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      console.log('⚡ Thunk: updateEmployeeDocument called for id:', id);
      const response = await employeeDocumentsService.updateEmployeeDocument(id, data);
      console.log('⚡ Thunk: update successful:', response);
      return response;
    } catch (error) {
      console.error('⚡ Thunk: updateEmployeeDocument error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete employee document
export const deleteEmployeeDocument = createAsyncThunk(
  'employeeDocuments/delete',
  async (id, { rejectWithValue }) => {
    try {
      console.log('⚡ Thunk: deleteEmployeeDocument called for id:', id);
      await employeeDocumentsService.deleteEmployeeDocument(id);
      console.log('⚡ Thunk: delete successful');
      return id;
    } catch (error) {
      console.error('⚡ Thunk: deleteEmployeeDocument error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Download employee document
export const downloadEmployeeDocument = async (id, documentName) => {
  try {
    console.log('⚡ Download: starting download for id:', id);
    const response = await employeeDocumentsService.downloadEmployeeDocument(id);
    
    // Create blob and download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', documentName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    console.log('⚡ Download: file downloaded successfully');
    return true;
  } catch (error) {
    console.error('⚡ Download: error:', error);
    throw error;
  }
};

// Fetch document types for dropdown
export const fetchDocumentTypes = createAsyncThunk(
  'employeeDocuments/fetchTypes',
  async (_, { rejectWithValue }) => {
    try {
      console.log('⚡ Thunk: fetchDocumentTypes called');
      const response = await employeeDocumentsService.getDocumentTypes();
      console.log('⚡ Thunk: returning document types:', response);
      return response;
    } catch (error) {
      console.error('⚡ Thunk: fetchDocumentTypes error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
