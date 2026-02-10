import { apiSlice } from '../../services/apiSlice';

export interface Employee {
  id: string | number;
  name: string;
  email: string;
  role: string;
  department?: string;
  position?: string;
  phone?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeData {
  name: string;
  email: string;
  password: string;
  role: string;
  department?: string;
  position?: string;
  phone?: string;
}

export interface UpdateEmployeeData {
  name?: string;
  email?: string;
  role?: string;
  department?: string;
  position?: string;
  phone?: string;
  status?: 'active' | 'inactive';
}

export const employeeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all employees
    getEmployees: builder.query<Employee[], void>({
      query: () => '/employees',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Employee' as const, id })), { type: 'Employee', id: 'LIST' }]
          : [{ type: 'Employee', id: 'LIST' }],
      transformResponse: (response: any) => {
        console.log('🌐 GET /employees response:', response);
        return response.employees || [];
      },
    }),

    // Get employee by ID
    getEmployeeById: builder.query<Employee, string | number>({
      query: (id) => `/employees/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Employee', id }],
      transformResponse: (response: any) => {
        console.log('🌐 GET /employees/:id response:', response);
        return response.employee;
      },
    }),

    // Create new employee
    createEmployee: builder.mutation<Employee, CreateEmployeeData>({
      query: (employeeData) => {
        console.log('🌐 POST /employees request:', {
          ...employeeData,
          password: '[HIDDEN]'
        });
        return {
          url: '/employees',
          method: 'POST',
          body: employeeData,
        };
      },
      invalidatesTags: [{ type: 'Employee', id: 'LIST' }],
      transformResponse: (response: any) => {
        console.log('✅ Employee created:', response);
        return response.employee;
      },
    }),

    // Update employee
    updateEmployee: builder.mutation<Employee, { id: string | number; data: UpdateEmployeeData }>({
      query: ({ id, data }) => {
        console.log('🌐 PUT /employees/:id request:', data);
        return {
          url: `/employees/${id}`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Employee', id },
        { type: 'Employee', id: 'LIST' },
      ],
      transformResponse: (response: any) => {
        console.log('✅ Employee updated:', response);
        return response.employee;
      },
    }),

    // Delete employee
    deleteEmployee: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/employees/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Employee', id },
        { type: 'Employee', id: 'LIST' },
      ],
      transformResponse: (response: any) => {
        console.log('✅ Employee deleted:', response);
        return response;
      },
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApi;
