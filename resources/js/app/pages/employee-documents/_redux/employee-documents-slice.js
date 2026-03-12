import { createSlice } from '@reduxjs/toolkit';
import {
  fetchEmployeeDocuments,
  fetchEmployeeDocument,
  uploadEmployeeDocument,
  updateEmployeeDocument,
  deleteEmployeeDocument,
  fetchDocumentTypes,
} from './employee-documents-thunk';

const initialState = {
  documents: [],
  documentTypes: [],
  currentDocument: null,
  loading: false,
  error: null,
  uploadProgress: 0,
};

const employeeDocumentsSlice = createSlice({
  name: 'employeeDocuments',
  initialState,
  reducers: {
    clearCurrentDocument: (state) => {
      state.currentDocument = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all documents
      .addCase(fetchEmployeeDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(fetchEmployeeDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single document
      .addCase(fetchEmployeeDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDocument = action.payload;
      })
      .addCase(fetchEmployeeDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Upload document
      .addCase(uploadEmployeeDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadEmployeeDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.documents.unshift(action.payload.document);
        state.uploadProgress = 100;
      })
      .addCase(uploadEmployeeDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.uploadProgress = 0;
      })

      // Update document
      .addCase(updateEmployeeDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployeeDocument.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.documents.findIndex((doc) => doc.id === action.payload.document.id);
        if (index !== -1) {
          state.documents[index] = action.payload.document;
        }
        state.currentDocument = action.payload.document;
      })
      .addCase(updateEmployeeDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete document
      .addCase(deleteEmployeeDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployeeDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = state.documents.filter((doc) => doc.id !== action.payload);
      })
      .addCase(deleteEmployeeDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch document types
      .addCase(fetchDocumentTypes.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchDocumentTypes.fulfilled, (state, action) => {
        state.documentTypes = action.payload;
      })
      .addCase(fetchDocumentTypes.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearCurrentDocument, setUploadProgress } = employeeDocumentsSlice.actions;
export default employeeDocumentsSlice.reducer;
