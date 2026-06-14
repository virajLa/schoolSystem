import React, { useState } from 'react';
import { User, Role } from '../types';
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  Mail, 
  ShieldAlert, 
  Check, 
  Briefcase, 
  BadgeCheck, 
  SlidersHorizontal 
} from 'lucide-react';

interface UserManagementProps {
  currentUser: User;
  allUsers: User[];
  onUpdateOfficerMapping: (teacherId: string, officerId: string) => void;
  onAddUser?: (user: User) => void;
  onUpdateUser?: (userId: string, updatedFields: Partial<User>) => void;
  onDeleteUser?: (userId: string) => void;
}

const DEPARTMENTS = [
  'Science',
  'Mathematics',
  'English',
  'History & Social Studies',
  'Languages',
  'Arts & Music',
  'Physical Education',
  'Administration',
  'IT & Systems'
];

const ROLES: Role[] = [
  'Teacher',
  'Head of Department',
  'Sectional Head',
  'Deputy Principal',
  'Principal',
  'Super Administrator'
];

// Aesthetic mock avatar bank
const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
];

export const UserManagement: React.FC<UserManagementProps> = ({
  currentUser,
  allUsers,
  onUpdateOfficerMapping,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
}) => {
  const isSuperAdmin = currentUser.role === 'Super Administrator';
  const isPrincipal = currentUser.role === 'Principal';
  const isPrincipalOrAdmin = isPrincipal || isSuperAdmin;

  // Active workspace sub-tab (for Super Admin who can access both mapping AND credential maintenance)
  const [subTab, setSubTab] = useState<'mappings' | 'credentials'>(isSuperAdmin ? 'credentials' : 'mappings');

  // Creation State
  const [isCreating, setIsCreating] = useState(false);
  const [newForm, setNewForm] = useState({
    name: '',
    email: '',
    role: 'Teacher' as Role,
    department: 'Science',
    avatar: PRESET_AVATARS[0],
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Edit State
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: 'Teacher' as Role,
    department: '',
    avatar: '',
  });

  // Filters for officer mapping
  const teachers = allUsers.filter((u) => u.role === 'Teacher');
  const potentialOfficers = allUsers.filter((u) =>
    ['Principal', 'Deputy Principal', 'Sectional Head', 'Head of Department'].includes(u.role)
  );

  // Handle new user creation
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newForm.name.trim()) {
      setFormError('Please enter a full name.');
      return;
    }
    if (!newForm.email.trim()) {
      setFormError('Please enter a valid institution email.');
      return;
    }

    // Check for email collision
    const collision = allUsers.some(u => u.email.toLowerCase() === newForm.email.trim().toLowerCase());
    if (collision) {
      setFormError('This email is already registered to a workspace profile.');
      return;
    }

    if (onAddUser) {
      const generatedId = `u_${Date.now()}`;
      onAddUser({
        id: generatedId,
        name: newForm.name.trim(),
        email: newForm.email.trim(),
        role: newForm.role,
        department: newForm.department,
        avatar: newForm.avatar,
      });

      // Reset state
      setIsCreating(false);
      setNewForm({
        name: '',
        email: '',
        role: 'Teacher',
        department: 'Science',
        avatar: PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)],
      });
    }
  };

  // Start editing a user
  const startEdit = (user: User) => {
    setEditingUserId(user.id);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      avatar: user.avatar || PRESET_AVATARS[0],
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingUserId(null);
  };

  // Confirm and save edit
  const handleEditSave = (userId: string) => {
    if (!editForm.name.trim()) return;
    if (!editForm.email.trim()) return;

    if (onUpdateUser) {
      onUpdateUser(userId, {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        role: editForm.role,
        department: editForm.department,
        avatar: editForm.avatar,
      });
      setEditingUserId(null);
    }
  };

  // Delete wrapper
  const handleDeleteClick = (userId: string) => {
    if (userId === currentUser.id) {
      alert('Violation Check: It is strictly illegal to delete your currently authenticated session.');
      return;
    }
    if (window.confirm('Are you absolutely sure you want to permanently revoke this login profile and delete all records bound to it? This action is irreversible.')) {
      if (onDeleteUser) {
        onDeleteUser(userId);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header controls & tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans font-bold text-gray-900 text-lg uppercase tracking-wider flex items-center gap-2">
            <Users className="h-5.5 w-5.5 text-emerald-600" />
            Institutional User Center
          </h2>
          <p className="text-3xs text-gray-500 font-medium">Manage user credential directory profiles and review-workflow mapping assignments.</p>
        </div>

        {/* Super admin workspace options */}
        {isSuperAdmin && (
          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-gray-200">
            <button
              type="button"
              id="subtab-credentials"
              onClick={() => setSubTab('credentials')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                subTab === 'credentials' 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <BadgeCheck className="h-4 w-4 text-emerald-600" />
              Credentials Maintenance
            </button>
            <button
              type="button"
              id="subtab-mappings"
              onClick={() => setSubTab('mappings')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                subTab === 'mappings' 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4 text-blue-600" />
              Officer Mappings
            </button>
          </div>
        )}
      </div>

      {subTab === 'mappings' ? (
        <div className="grid grid-cols-1 gap-6">
          {/* VIEW A: OFFICER MAPPINGS (MAPPING DIRECTORY) */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-sans font-black text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-emerald-600" />
                Roster Instructor &bull; Supervisor Mappings
              </h3>
              {isPrincipalOrAdmin && (
                <span className="text-3xs bg-emerald-100 text-emerald-850 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  Mapping Override Authorized
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
                            className="h-8.5 w-8.5 rounded-full object-cover border border-gray-250 animate-fade-in"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">{teacher.name}</p>
                            <p className="text-3xs text-gray-400 font-medium">{teacher.email}</p>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600 font-semibold">{teacher.department}</td>
                        <td className="p-4">
                          <span className="bg-slate-100 text-slate-700 text-3xs font-extrabold px-2 py-0.5 rounded-full uppercase">
                            {teacher.role}
                          </span>
                        </td>
                        <td className="p-4">
                          {isPrincipalOrAdmin ? (
                            <select
                              id={`mapping-select-${teacher.id}`}
                              value={teacher.assignedOfficerId || ''}
                              onChange={(e) => onUpdateOfficerMapping(teacher.id, e.target.value)}
                              className="bg-white border border-gray-250 text-xs px-2.5 py-1.5 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500 font-semibold cursor-pointer"
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
      ) : (
        /* VIEW B: USER CREATION & MAINTENANCE (SUPER ADMIN SEAT EXCLUSIVE) */
        <div className="space-y-6">
          
          {/* Expanded creation card toggler */}
          {!isCreating ? (
            <div className="flex justify-end">
              <button
                type="button"
                id="btn-trigger-create-user"
                onClick={() => setIsCreating(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm shadow-emerald-100 animate-fade-in cursor-pointer"
              >
                <UserPlus className="h-4 w-4" />
                Enroll System Account Login
              </button>
            </div>
          ) : (
            <form 
              onSubmit={handleCreateSubmit} 
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4 animate-slide-down"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="font-sans font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                  <UserPlus className="h-4.5 w-4.5 text-emerald-600" />
                  Create Staff Login Credentials
                </h3>
                <button
                  type="button"
                  id="btn-cancel-create-user"
                  onClick={() => setIsCreating(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {formError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <ShieldAlert className="h-4.5 w-4.5 text-rose-500" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
                <div className="space-y-1.5 lg:col-span-4">
                  <label htmlFor="create-uname" className="text-3xs font-extrabold uppercase tracking-widest text-slate-500 block">Full Legal Name</label>
                  <input
                    type="text"
                    id="create-uname"
                    value={newForm.name}
                    onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                    placeholder="e.g. Martha Stewart"
                    className="w-full bg-slate-50/50 hover:bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5 lg:col-span-4">
                  <label htmlFor="create-uemail" className="text-3xs font-extrabold uppercase tracking-widest text-slate-500 block">System Login Email</label>
                  <input
                    type="email"
                    id="create-uemail"
                    value={newForm.email}
                    onChange={(e) => setNewForm({ ...newForm, email: e.target.value })}
                    placeholder="name@schoolflow.edu"
                    className="w-full bg-slate-50/50 hover:bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5 lg:col-span-2">
                  <label htmlFor="create-urole" className="text-3xs font-extrabold uppercase tracking-widest text-slate-500 block">Authorized Role</label>
                  <select
                    id="create-urole"
                    value={newForm.role}
                    onChange={(e) => setNewForm({ ...newForm, role: e.target.value as Role })}
                    className="w-full bg-slate-50/50 hover:bg-slate-50 border border-gray-200 rounded-xl px-2 py-2 text-xs font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
                  >
                    {ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 lg:col-span-2">
                  <label htmlFor="create-udept" className="text-3xs font-extrabold uppercase tracking-widest text-slate-500 block">Department</label>
                  <select
                    id="create-udept"
                    value={newForm.department}
                    onChange={(e) => setNewForm({ ...newForm, department: e.target.value })}
                    className="w-full bg-slate-50/50 hover:bg-slate-50 border border-gray-200 rounded-xl px-2 py-2 text-xs font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
                  >
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Graphic Avatar Selector */}
              <div className="space-y-2">
                <span className="text-3xs font-extrabold uppercase tracking-widest text-slate-500 block">Select Avatar Seed</span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_AVATARS.map((avatarUrl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNewForm({ ...newForm, avatar: avatarUrl })}
                      className={`relative rounded-full h-10 w-10 overflow-hidden border-2 cursor-pointer transition-all ${
                        newForm.avatar === avatarUrl ? 'border-emerald-500 scale-110 shadow-md shadow-emerald-50' : 'border-transparent hover:border-slate-300'
                      }`}
                    >
                      <img src={avatarUrl} alt="Preset avatar option" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                      {newForm.avatar === avatarUrl && (
                        <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                          <Check className="h-3 w-3 text-emerald-600 bg-white rounded-full p-0.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Rows */}
              <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3.5 py-1.5 border border-gray-200 rounded-xl text-slate-700 text-xs font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-save-new-user"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-50 cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  Save New Workspace Access
                </button>
              </div>
            </form>
          )}

          {/* Table representing ALL users for credential list & modification */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-slate-50">
              <h3 className="font-sans font-black text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-emerald-600" />
                Credential Ledger Directory (Authorized Logins)
              </h3>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-extrabold text-3xs uppercase tracking-widest border-b border-gray-150">
                    <th className="p-4 pl-6">Profile & Account Info</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Designated Access Role</th>
                    <th className="p-4">Staff Department</th>
                    <th className="p-4 text-right pr-6">Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {allUsers.map((user) => {
                    const isEditing = editingUserId === user.id;
                    const isCurrentUser = user.id === currentUser.id;

                    return (
                      <tr key={user.id} className={`${isEditing ? 'bg-emerald-50/20' : 'hover:bg-slate-50/50'}`}>
                        {/* 1. Name & Avatar */}
                        <td className="p-4 pl-6 font-bold text-slate-900 leading-snug">
                          {isEditing ? (
                            <div className="flex items-center gap-3">
                              <img
                                src={editForm.avatar}
                                alt="Editing user avatar"
                                className="h-9 w-9 rounded-full object-cover border border-emerald-300"
                                referrerPolicy="no-referrer"
                              />
                              <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                className="bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="h-8.5 w-8.5 rounded-full object-cover border border-gray-250"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <p className="font-bold text-slate-900 leading-tight">
                                  {user.name} {isCurrentUser && <span className="text-[10px] text-slate-400 font-medium bg-slate-100 rounded-sm px-1 ml-1">You</span>}
                                </p>
                                <p className="text-3xs text-gray-400 font-medium tracking-wide">ID: {user.id}</p>
                              </div>
                            </div>
                          )}
                        </td>

                        {/* 2. Email */}
                        <td className="p-4 text-slate-600 font-semibold">
                          {isEditing ? (
                            <input
                              type="email"
                              value={editForm.email}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                              className="bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full max-w-xs"
                            />
                          ) : (
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Mail className="h-3.5 w-3.5 text-slate-400" />
                              <span>{user.email}</span>
                            </div>
                          )}
                        </td>

                        {/* 3. Role */}
                        <td className="p-4">
                          {isEditing ? (
                            <select
                              value={editForm.role}
                              onChange={(e) => setEditForm({ ...editForm, role: e.target.value as Role })}
                              className="bg-white border border-gray-300 rounded-lg px-2 py-1 text-xs font-semibold"
                            >
                              {ROLES.map(role => (
                                <option key={role} value={role}>{role}</option>
                              ))}
                            </select>
                          ) : (
                            <span className={`text-3xs font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              user.role === 'Super Administrator' ? 'bg-purple-100 text-purple-800' :
                              user.role === 'Principal' ? 'bg-red-100 text-red-800' :
                              user.role === 'Deputy Principal' ? 'bg-orange-100 text-orange-850' :
                              user.role === 'Sectional Head' ? 'bg-blue-105 text-blue-800 animate-pulse' :
                              user.role === 'Head of Department' ? 'bg-teal-100 text-teal-800' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {user.role}
                            </span>
                          )}
                        </td>

                        {/* 4. Department */}
                        <td className="p-4">
                          {isEditing ? (
                            <select
                              value={editForm.department}
                              onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                              className="bg-white border border-gray-300 rounded-lg px-2 py-1 text-xs font-semibold"
                            >
                              {DEPARTMENTS.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-slate-600 font-bold">{user.department}</span>
                          )}
                        </td>

                        {/* 5. Control buttons */}
                        <td className="p-4 text-right pr-6 space-x-1 whitespace-nowrap">
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleEditSave(user.id)}
                                className="bg-emerald-50 hover:bg-emerald-110 text-emerald-700 p-1.5 rounded-lg border border-emerald-200 cursor-pointer"
                                title="Save Profile Modifications"
                              >
                                <Save className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={cancelEdit}
                                className="bg-slate-50 hover:bg-slate-100 text-slate-600 p-1.5 rounded-lg border border-gray-200 cursor-pointer"
                                title="Abort editing"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => startEdit(user)}
                                className="text-slate-500 hover:text-slate-800 p-1.5 hover:bg-slate-150 rounded-lg inline-flex items-center cursor-pointer"
                                title="Modify Profile credentials"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteClick(user.id)}
                                disabled={isCurrentUser}
                                className={`p-1.5 rounded-lg inline-flex items-center ${
                                  isCurrentUser 
                                    ? 'text-slate-200 cursor-not-allowed' 
                                    : 'text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer'
                                }`}
                                title={isCurrentUser ? 'Forbidden: Self Deletion Lock' : 'Revoke Workspace Profile Access'}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
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
      )}
    </div>
  );
};
