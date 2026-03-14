import { configureStore } from '@reduxjs/toolkit';
// Central slices (shared across pages)
import authReducer from './slices/authSlice';
import employeeReducer from './slices/employeeSlice';
import departmentReducer from './slices/departmentSlice';
import leaveReducer from './slices/leaveSlice';
import attendanceReducer from './slices/attendanceSlice';
import payrollReducer from './slices/payrollSlice';
import performanceReducer from './slices/performanceSlice';

// Page-level slices (co-located with pages)
import { userManagementReducer, rolesReducer } from '../pages/users/_redux';
import { employeesReducer } from '../pages/employees/_redux';
import { departmentsReducer } from '../pages/departments/_redux';
import { employeeDocumentsReducer } from '../pages/employee-documents/_redux';
import { profileReducer } from '../pages/profile/_redux';
import { jobRequisitionsReducer } from '../pages/job-requisitions/_redux';

const store = configureStore({
  reducer: {
    // Global state
    auth: authReducer,
    departments: departmentReducer,
    leaves: leaveReducer,
    attendance: attendanceReducer,
    payroll: payrollReducer,
    performance: performanceReducer,
    
    // Page-level state
    users: userManagementReducer,
    roles: rolesReducer,
    employeesPage: employeesReducer,
    departmentsPage: departmentsReducer,
    employeeDocumentsPage: employeeDocumentsReducer,
    profilePage: profileReducer,
    jobRequisitionsPage: jobRequisitionsReducer,
    
    // Legacy employee reducer (from central slices)
    employees: employeeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
