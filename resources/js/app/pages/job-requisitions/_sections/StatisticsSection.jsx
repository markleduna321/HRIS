import React from 'react';

const StatCard = ({ title, count, bgColor, textColor }) => {
  return (
    <div className={`${bgColor} rounded-lg p-6 flex flex-col items-start justify-between`}>
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <p className={`text-4xl font-bold ${textColor}`}>{count}</p>
    </div>
  );
};

export default function StatisticsSection({ statistics }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Requisitions"
        count={statistics.total}
        bgColor="bg-indigo-50"
        textColor="text-indigo-600"
      />
      <StatCard
        title="Pending Review"
        count={statistics.pending}
        bgColor="bg-amber-50"
        textColor="text-amber-600"
      />
      <StatCard
        title="Approved"
        count={statistics.approved}
        bgColor="bg-emerald-50"
        textColor="text-emerald-600"
      />
      <StatCard
        title="In Progress"
        count={statistics.in_progress}
        bgColor="bg-violet-50"
        textColor="text-violet-600"
      />
    </div>
  );
}
