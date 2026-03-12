// Export thunks
export { 
  fetchDepartments, 
  fetchDepartment, 
  createDepartment, 
  updateDepartment, 
  deleteDepartment 
} from './departments-thunk';

// Export slice
export { default as departmentsReducer } from './departments-slice';
export { clearError, setCurrentDepartment, clearCurrentDepartment } from './departments-slice';
