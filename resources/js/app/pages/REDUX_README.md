# Redux Structure - Page-Level Slices

This project follows a **co-located Redux pattern** where each page has its own `_redux` folder containing the Redux slices and thunks specific to that page.

## 📁 Directory Structure

```
pages/
├── users/
│   ├── _redux/
│   │   ├── usersSlice.js      # Users CRUD operations
│   │   ├── rolesSlice.js      # Roles & permissions CRUD
│   │   └── index.js           # Barrel export
│   ├── _sections/             # UI sections
│   └── page.jsx               # Main page component
│
└── employees/
    ├── _redux/
    │   ├── employeesSlice.js  # Employees CRUD operations
    │   └── index.js           # Barrel export
    ├── _sections/             # UI sections
    └── page.jsx               # Main page component
```

## 🎯 Architecture Pattern

### Page-Level Redux
- **Co-location**: Redux logic lives near the components that use it
- **Isolation**: Each page manages its own state independently
- **Modularity**: Easy to test, debug, and maintain
- **Scalability**: New pages can add their own Redux without affecting others

### Central Store
Global state that needs to be shared across multiple pages lives in `/app/store/slices/`:
- `authSlice.js` - Authentication state
- `departmentSlice.js` - Departments (shared resource)
- `attendanceSlice.js` - Attendance tracking
- `leaveSlice.js` - Leave management
- `payrollSlice.js` - Payroll processing
- `performanceSlice.js` - Performance reviews

## 📝 Slice Structure

Each slice follows this pattern:

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 1. Async Thunks (API calls)
export const fetchItems = createAsyncThunk(
  'namespace/fetchItems',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/items', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 2. Slice Definition
const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Synchronous actions
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle async thunks
    builder.addCase(fetchItems.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

// 3. Export actions and reducer
export const { clearError } = itemsSlice.actions;
export default itemsSlice.reducer;
```

## 🚀 Usage in Components

### 1. Basic Usage

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, createUser, updateUser, deleteUser } from './_redux';

export default function UsersPage() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector(state => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleCreate = (userData) => {
    dispatch(createUser(userData));
  };

  return (
    // Your component JSX
  );
}
```

### 2. With Inertia.js (Current Approach)

Currently, the pages receive data as props from Laravel controllers via Inertia.js:

```javascript
export default function UsersPage({ users, roles, permissions }) {
  // Data comes from Laravel controller, no Redux needed for initial load
  // Redux can be used for client-side state management and optimistic updates
}
```

### 3. Hybrid Approach (Recommended)

Use Inertia props for initial data, Redux for client-side updates:

```javascript
export default function UsersPage({ initialUsers, roles, permissions }) {
  const dispatch = useDispatch();
  const { users, loading } = useSelector(state => state.users);

  // Initialize Redux state from Inertia props
  useEffect(() => {
    if (initialUsers) {
      dispatch(setUsers(initialUsers));
    }
  }, [initialUsers, dispatch]);

  // Use Redux for CRUD operations
  const handleCreate = async (userData) => {
    await dispatch(createUser(userData));
    // Redux updates local state optimistically
  };
}
```

## 📦 Available Slices

### Users Page (`pages/users/_redux/`)

#### `usersSlice.js`
- **State**: `{ users: [], loading: false, error: null, currentUser: null }`
- **Thunks**: `fetchUsers()`, `createUser(data)`, `updateUser({ id, data })`, `deleteUser(id)`
- **Actions**: `clearError()`, `setCurrentUser(user)`, `clearCurrentUser()`

#### `rolesSlice.js`
- **State**: `{ roles: [], permissions: [], loading: false, error: null, currentRole: null }`
- **Thunks**: `fetchRoles()`, `createRole(data)`, `updateRole({ id, data })`, `deleteRole(id)`, `fetchPermissions()`
- **Actions**: `clearError()`, `setCurrentRole(role)`, `clearCurrentRole()`

### Employees Page (`pages/employees/_redux/`)

#### `employeesSlice.js`
- **State**: `{ employees: [], departments: [], loading: false, error: null, currentEmployee: null, pagination: {...} }`
- **Thunks**: `fetchEmployees(params)`, `fetchEmployee(id)`, `createEmployee(data)`, `updateEmployee({ id, data })`, `deleteEmployee(id)`, `fetchDepartments()`
- **Actions**: `clearError()`, `setCurrentEmployee(employee)`, `clearCurrentEmployee()`, `setFilters(filters)`

## 🔧 Registering Slices in Store

To use these slices, they need to be registered in the main Redux store:

```javascript
// resources/js/app/store/store.js
import { configureStore } from '@reduxjs/toolkit';

// Page-level reducers
import { usersReducer, rolesReducer } from '../pages/users/_redux';
import { employeesReducer } from '../pages/employees/_redux';

// Central reducers
import authReducer from './slices/authSlice';
import departmentReducer from './slices/departmentSlice';

export const store = configureStore({
  reducer: {
    // Page-level state
    users: usersReducer,
    roles: rolesReducer,
    employees: employeesReducer,
    
    // Global state
    auth: authReducer,
    departments: departmentReducer,
    // ... other central slices
  },
});
```

## 🎨 Integration with Current Pages

The current pages use **Inertia.js form helpers** instead of Redux for form state. This is a valid approach! You can choose:

### Option A: Keep Inertia Forms (Current)
```javascript
const { data, setData, post, put, processing, errors } = useForm({...});
// Simple, works great with Laravel validation
```

### Option B: Use Redux for Client State
```javascript
const dispatch = useDispatch();
const { users, loading } = useSelector(state => state.users);
// More complex, but better for complex client-side logic
```

### Option C: Hybrid (Best for Complex Apps)
```javascript
// Use Inertia for form submission
const { data, setData, post, errors } = useForm({...});

// Use Redux for list management and client-side filtering
const { users } = useSelector(state => state.users);
const [filteredUsers, setFilteredUsers] = useState(users);
```

## 🧪 Testing

Test slices independently:

```javascript
import { fetchUsers, usersReducer } from './usersSlice';

describe('usersSlice', () => {
  it('should handle fetchUsers.fulfilled', () => {
    const state = usersReducer(undefined, 
      fetchUsers.fulfilled([{ id: 1, name: 'Test' }])
    );
    expect(state.users).toHaveLength(1);
  });
});
```

## 🚦 Migration Path

If you want to start using Redux:

1. **Register slices** in the store (see above)
2. **Keep Inertia props** for initial data
3. **Use Redux thunks** for create/update/delete operations
4. **Dispatch actions** on success for optimistic UI updates
5. **Gradually migrate** filtering, sorting, pagination to Redux

## 📚 Best Practices

✅ **DO:**
- Use Redux for complex client-side state
- Co-locate slices with their pages
- Use TypeScript for type safety (future enhancement)
- Handle loading and error states

❌ **DON'T:**
- Duplicate data between Inertia props and Redux unnecessarily
- Use Redux for simple forms (Inertia form helpers are fine)
- Store temporary UI state in Redux (use local state)
- Make API calls outside of thunks

## 🔗 Related Documentation

- [Redux Toolkit Official Docs](https://redux-toolkit.js.org/)
- [Inertia.js Forms](https://inertiajs.com/forms)
- [Component Documentation](../components/README.md)
- [Section Components](../pages/users/_sections/)
