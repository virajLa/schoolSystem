import React, { useState } from 'react';
import { User, Role } from '../types';
import { Users, UserCheck, Shuffle, Sliders, Shield, RefreshCw } from 'lucide-react';

interface UserManagementProps {
  currentUser: User;
  allUsers: User[];
  onUpdateOfficerMapping: (teacherId: string, officerId: string) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  currentUser,
  allUsers,
  onUpdateOfficerMapping,
}) => {
  const isPrincipalOrAdmin = ['Principal', 'Super Administrator'].includes(currentUser.role);

  // Group users
  const teachers = allUsers.filter((u) => u.role === 'Teacher');
  const potentialOfficers = allUsers.filter((u) =>
    ['Principal', 'Deputy Principal', 'Sectional Head', 'Head of Department'].includes(u.role)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-sans font-bold text-gray-900 text-lg uppercase tracking-wider">Officer Assignment Directory</h2>
        <p className="text-3xs text-gray-500 font-medium">Map institutional relationships. Explicitly select which validation officer reviews each instructor's documents.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Full width: Mapping table */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-sans font-black text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" />
              Roster Instructor &bull; Supervisor Mappings
            </h3>
            {isPrincipalOrAdmin && (
              <span className="text-3xs bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Principal Controls Active
              </span>
            )}
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-extrabold text-3xs uppercase tracking-widest border-b border-gray-150">
                  <th className="p-4 pl-6">Instructor Name</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Role Designation</th>
                  <th className="p-4">Assigned Approval Officer (Workflow Target)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150">
                {teachers.map((teacher) => {
                  const activeOfficer = potentialOfficers.find(o => o.id === teacher.assignedOfficerId);
                  return (
                    <tr key={teacher.id} className="hover:bg-slate-50/50">
                      <td className="p-4 pl-6 font-bold text-slate-900 leading-snug flex items-center gap-3">
                        <img
                          src={teacher.avatar}
                          alt={teacher.name}
                          className="h-8.5 w-8.5 rounded-full object-cover border border-gray-200"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{teacher.name}</p>
                          <p className="text-3xs text-gray-400 font-medium">{teacher.email}</p>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 font-semibold">{teacher.department}</td>
                      <td className="p-4"><span className="bg-slate-100 text-slate-700 text-3xs font-extrabold px-2 py-0.5 rounded-full uppercase">{teacher.role}</span></td>
                      <td className="p-4">
                        {isPrincipalOrAdmin ? (
                          <select
                            id={`mapping-select-${teacher.id}`}
                            value={teacher.assignedOfficerId || ''}
                            onChange={(e) => onUpdateOfficerMapping(teacher.id, e.target.value)}
                            className="bg-white border border-gray-200 text-xs px-2.5 py-1.5 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                          >
                            <option value="">-- No Supervisor Assigned --</option>
                            {potentialOfficers.map(opt => (
                              <option key={opt.id} value={opt.id}>
                                {opt.name} ({opt.role})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-xs font-bold text-slate-700">
                            {activeOfficer ? `${activeOfficer.name} (${activeOfficer.role})` : 'N/A'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
