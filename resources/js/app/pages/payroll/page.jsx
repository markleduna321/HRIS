import React from 'react';
import AppLayout from '../layout';
import { Head } from '@inertiajs/react';

export default function PayrollPage() {
  return (
    <AppLayout>
      <Head title="Payroll" />
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Payroll Management</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage employee payroll, deductions, and compensation.
            </p>
          </div>
        </div>
        <div className="mt-8">
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">Payroll management module coming soon...</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
