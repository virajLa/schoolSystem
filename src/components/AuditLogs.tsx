import React, { useState } from 'react';
import { AuditLog } from '../types';
import { ShieldCheck, Search, Filter, RefreshCw, AlertCircle, Trash2 } from 'lucide-react';

interface AuditLogsProps {
  logs: AuditLog[];
  onClearLogs: () => void;
}

export const AuditLogs: React.FC<AuditLogsProps> = ({ logs, onClearLogs }) => {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredLogs = logs.filter((log) => {
    const matchesQuery =
      log.action.toLowerCase().includes(query.toLowerCase()) ||
      log.userName.toLowerCase().includes(query.toLowerCase()) ||
      log.details.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-sans font-bold text-gray-900 text-lg uppercase tracking-wider">Audit Trail Ledger</h2>
          <p className="text-3xs text-gray-500 font-medium">Tamperproof security telemetry tracking logins, plan submission edits, and configuration swaps.</p>
        </div>
        <button
          id="btn-clear-audit-logs"
          onClick={onClearLogs}
          className="text- rose-600 hover:text-rose-700 bg-white border border-rose-100 px-3 py-1.5 rounded-lg text-3xs font-extrabold uppercase transition-colors cursor-pointer"
        >
          Flush Ledger
        </button>
      </div>

      {/* Filter Options */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col md:flex-row gap-3 justify-between items-center shadow-3xs">
        <div className="w-full md:flex-1 relative">
          <input
            type="text"
            placeholder="Search logins, operators, or detail logs..."
            value={query}
            id="audit-search-query"
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div className="w-full md:w-48">
          <select
            value={statusFilter}
            id="audit-filter-status"
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white outline-none"
          >
            <option value="all">All Verifications</option>
            <option value="SUCCESS">Success Actions</option>
            <option value="BLOCKED">Blocked Actions</option>
            <option value="WARNING">Warnings</option>
          </select>
        </div>
      </div>

      {/* Active Ledger List */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="p-4 bg-slate-50 border-b border-gray-150 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <span className="text-3xs uppercase tracking-widest font-black text-slate-700">Chronological Telemetry Feed</span>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-extrabold text-3xs uppercase tracking-widest border-b border-gray-150">
                <th className="p-3.5 pl-6">Timestamp</th>
                <th className="p-3.5">System Operator</th>
                <th className="p-3.5">User Role</th>
                <th className="p-3.5">Logged Action</th>
                <th className="p-3.5">Subject Entity</th>
                <th className="p-3.5">Transaction Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    No active audits registered under criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isSuccess = log.status === 'SUCCESS';
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5 pl-6 font-mono font-medium text-slate-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900 leading-snug">{log.userName}</td>
                      <td className="p-3.5"><span className="bg-slate-100 text-slate-700 text-3xs font-extrabold px-2 py-0.5 rounded-full uppercase">{log.userRole}</span></td>
                      <td className="p-3.5 font-bold text-slate-800">{log.action}</td>
                      <td className="p-3.5"><span className="text-2xs bg-indigo-50 text-indigo-800 font-bold px-2 py-0.5 rounded border border-indigo-150">{log.entity}</span></td>
                      <td className="p-3.5 text-slate-500 font-medium max-w-xs leading-normal">{log.details}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
