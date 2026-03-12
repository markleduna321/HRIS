# API Services - Page-Level Services

This project follows a **co-located services pattern** where each page has its own `_services` folder containing API service modules specific to that page.

## 📁 Directory Structure

```
pages/
├── users/
│   ├── _services/
│   │   ├── user-service.js    # User API calls
│   │   ├── role-service.js    # Role & permission API calls
│   │   └── index.js           # Barrel export
│   ├── _redux/                # Redux slices & thunks
│   ├── _sections/             # UI sections
│   └── page.jsx               # Main page
│
└── employees/
    ├── _services/
    │   ├── employee-service.js # Employee API calls
    │   └── index.js            # Barrel export
    ├── _redux/                 # Redux slices & thunks
    ├── _sections/              # UI sections
    └── page.jsx                # Main page
```

## 🎯 Architecture Overview

### Layer Separation
```
Component (page.jsx)
    ↓ dispatch action
Redux Thunk (_redux/*-thunk.js)
    ↓ call service method
API Service (_services/*-service.js)
    ↓ HTTP request
Central API Instance (app/services/api.js)
    ↓
Backend API
```

### Benefits
✅ **Separation of Concerns**: API logic separated from business logic  
✅ **Reusability**: Services can be used outside of Redux (e.g., in components directly)  
✅ **Testability**: Easy to mock services in unit tests  
✅ **Type Safety**: JSDoc comments provide type hints  
✅ **Consistency**: All API calls go through a single axios instance with interceptors  

## 📦 Available Services

### Users Page (`pages/users/_services/`)

#### **user-service.js**
Handles user CRUD operations and user management.

**Methods:**
- `getAll()` - Fetch all users
- `getById(id)` - Fetch single user
- `create(userData)` - Create new user
- `update(id, userData)` - Update user
- `delete(id)` - Delete user
- `activate(id)` - Activate user account
- `deactivate(id)` - Deactivate user account
- `assignRoles(id, roles)` - Assign roles to user
- `resetPassword(id, passwordData)` - Reset user password

**Example:**
```javascript
import { userService } from '../_services';

// Fetch all users
const users = await userService.getAll();

// Create a new user
const newUser = await userService.create({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  roles: ['employee']
});

// Update user
const updated = await userService.update(1, { name: 'Jane Doe' });
```

#### **role-service.js**
Handles role and permission management.

**Methods:**
- `getAll()` - Fetch all roles
- `getById(id)` - Fetch single role
- `create(roleData)` - Create new role
- `update(id, roleData)` - Update role
- `delete(id)` - Delete role
- `getPermissions()` - Fetch all available permissions
- `assignPermissions(id, permissions)` - Assign permissions to role
- `syncPermissions(id, permissions)` - Replace all permissions
- `getStats()` - Get role statistics
- `getUsers(id)` - Get users with this role

**Example:**
```javascript
import { roleService } from '../_services';

// Fetch all roles
const roles = await roleService.getAll();

// Create a new role
const newRole = await roleService.create({
  name: 'team_lead',
  level: 2,
  description: 'Team Lead Role',
  permissions: ['view employees', 'edit employees']
});

// Get all permissions
const permissions = await roleService.getPermissions();
```

### Employees Page (`pages/employees/_services/`)

#### **employee-service.js**
Handles employee CRUD operations and employee-related data.

**Methods:**
- `getAll(params)` - Fetch all employees with filters/pagination
- `getById(id)` - Fetch single employee
- `create(employeeData)` - Create new employee
- `update(id, employeeData)` - Update employee
- `delete(id)` - Delete employee
- `getDepartments()` - Fetch departments
- `search(query)` - Search employees by name/email
- `getStats()` - Get employee statistics
- `updateStatus(id, status)` - Update employment status
- `getAttendance(id, params)` - Get employee attendance records
- `getLeaves(id, params)` - Get employee leave records
- `getPayroll(id, params)` - Get employee payroll records
- `getPerformance(id, params)` - Get employee performance reviews
- `export(params)` - Export employees to CSV/Excel
- `import(formData)` - Import employees from file

**Example:**
```javascript
import { employeeService } from '../_services';

// Fetch all employees with filters
const employees = await employeeService.getAll({
  department: 'IT',
  status: 'active',
  page: 1,
  per_page: 10
});

// Create new employee
const newEmployee = await employeeService.create({
  employee_number: 'EMP001',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@company.com',
  department_id: 1,
  position: 'Software Engineer'
});

// Search employees
const results = await employeeService.search('john');

// Export employees
const file = await employeeService.export({ format: 'xlsx' });
```

## 🔧 Integration with Redux

Services are used by Redux thunks to fetch/update data:

```javascript
// In user-management-thunk.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../_services';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getAll();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
```

## 🔌 Central API Instance

All services use the central API instance from `app/services/api.js`:

```javascript
import api from '@/app/services/api';

const userService = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
};
```

### API Instance Features
- **Base URL**: `/api` prefix for all requests
- **Auth Token**: Automatically adds Bearer token from localStorage
- **Error Handling**: Redirects to login on 401 Unauthorized
- **Credentials**: Sends cookies with requests (`withCredentials: true`)
- **Headers**: Sets proper Content-Type and Accept headers

## 🧪 Testing Services

Services can be tested independently of Redux:

```javascript
import { userService } from './user-service';
import api from '@/app/services/api';

jest.mock('@/app/services/api');

describe('userService', () => {
  it('should fetch all users', async () => {
    const mockUsers = [{ id: 1, name: 'Test User' }];
    api.get.mockResolvedValue({ data: mockUsers });

    const result = await userService.getAll();

    expect(api.get).toHaveBeenCalledWith('/users');
    expect(result).toEqual(mockUsers);
  });
});
```

## 💡 Direct Usage in Components

Services can also be used directly in components without Redux:

```javascript
import { useState, useEffect } from 'react';
import { employeeService } from './_services';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await employeeService.getAll();
        setEmployees(data);
      } catch (error) {
        console.error('Failed to load employees:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadEmployees();
  }, []);

  // ... rest of component
}
```

## 📋 Best Practices

### ✅ DO:
- Use services for all API calls (never use axios/fetch directly in components)
- Add JSDoc comments to all service methods
- Handle errors in thunks, not in services
- Return response.data from services
- Use the central API instance
- Add new methods to existing services before creating new ones

### ❌ DON'T:
- Mix business logic with API calls in services
- Handle UI state in services
- Make services stateful
- Bypass the central API instance
- Duplicate methods across services
- Return the entire response object (return only response.data)

## 🚀 Adding New Services

To add a new service:

1. **Create service file** in `_services/` folder:
```javascript
// pages/newpage/_services/newpage-service.js
import api from '@/app/services/api';

const newpageService = {
  getAll: async () => {
    const response = await api.get('/newpage');
    return response.data;
  },
  // ... other methods
};

export default newpageService;
```

2. **Export from index.js**:
```javascript
// pages/newpage/_services/index.js
export { default as newpageService } from './newpage-service';
```

3. **Use in thunks**:
```javascript
// pages/newpage/_redux/newpage-thunk.js
import { newpageService } from '../_services';

export const fetchNewpageData = createAsyncThunk(
  'newpage/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      return await newpageService.getAll();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
```

## 🔗 Related Documentation

- [Redux Structure](./REDUX_README.md)
- [Component Library](../components/README.md)
- [Section Components](./_sections/)
- [Central API Configuration](../../services/api.js)
