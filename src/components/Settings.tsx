import React, { useState } from 'react';
import { SystemSettings, User } from '../types';
import { Settings, Save, Mail, Smartphone, AlertCircle, Archive, ShieldAlert } from 'lucide-react';

interface SettingsProps {
  currentUser: User;
  settings: SystemSettings;
  onSaveSettings: (settings: SystemSettings) => void;
  onTriggerCleanup: () => void;
}

export const SettingsTab: React.FC<SettingsProps> = ({
  currentUser,
  settings,
  onSaveSettings,
  onTriggerCleanup,
}) => {
  const [smtpHost, setSmtpHost] = useState(settings.smtpHost);
  const [smtpPort, setSmtpPort] = useState(settings.smtpPort);
  const [smtpUser, setSmtpUser] = useState(settings.smtpUser);
  const [smsGateway, setSmsGateway] = useState(settings.smsGateway);
  const [smsApiKey, setSmsApiKey] = useState(settings.smsApiKey);
  const [maxUploadSizeMB, setMaxUploadSizeMB] = useState(settings.maxUploadSizeMB);
  const [allowedTypes, setAllowedTypes] = useState(settings.allowedTypes);
  const [retentionYears, setRetentionYears] = useState(settings.retentionYears);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    const updated: SystemSettings = {
      smtpHost,
      smtpPort,
      smtpUser,
      smsGateway,
      smsApiKey,
      maxUploadSizeMB: Number(maxUploadSizeMB),
      allowedTypes,
      retentionYears: Number(retentionYears),
    };
    onSaveSettings(updated);
    setSuccessMsg('System configuration has been successfully updated and re-serialized.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-sans font-bold text-gray-900 text-lg uppercase tracking-wider">System Settings</h2>
        <p className="text-3xs text-gray-500 font-medium">Update integration gateways, define upload parameters, and audit historical deletion policies.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
          {/* SMTP configurations */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
            <h3 className="font-sans font-bold text-xs text-gray-800 border-b border-gray-100 pb-2 flex items-center gap-2">
              <Mail className="h-4.5 w-4.5 text-emerald-600" />
              SMTP Email Notification Server
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
              <div>
                <label className="block text-3xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">SMTP Host URL</label>
                <input
                  type="text"
                  value={smtpHost}
                  id="set-smtp-host"
                  onChange={(e) => setSmtpHost(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg outline-none text-xs bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-3xs font-extrabold text-gray-500 uppercase tracking-widest mb-1 font-bold">Port Number</label>
                <input
                  type="text"
                  value={smtpPort}
                  id="set-smtp-port"
                  onChange={(e) => setSmtpPort(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg outline-none text-xs bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-3xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Authorized User</label>
                <input
                  type="text"
                  value={smtpUser}
                  id="set-smtp-user"
                  onChange={(e) => setSmtpUser(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg outline-none text-xs bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* SMS Configurations */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
            <h3 className="font-sans font-bold text-xs text-gray-800 border-b border-gray-100 pb-2 flex items-center gap-2">
              <Smartphone className="h-4.5 w-4.5 text-emerald-600" />
              Ceyora SMS API Gateway Integration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <label className="block text-3xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Gateway API Endpoint</label>
                <input
                  type="text"
                  value={smsGateway}
                  id="set-sms-gateway"
                  onChange={(e) => setSmsGateway(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg outline-none text-xs bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-3xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Ceyora API secret token</label>
                <input
                  type="password"
                  value={smsApiKey}
                  id="set-sms-api"
                  onChange={(e) => setSmsApiKey(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg outline-none text-xs bg-white focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Upload limitations */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
            <h3 className="font-sans font-bold text-xs text-gray-800 border-b border-gray-100 pb-2 flex items-center gap-2">
              <Settings className="h-4.5 w-4.5 text-emerald-600" />
              Administrative Limitations
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <label className="block text-3xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Max attachment size (MB)</label>
                <input
                  type="number"
                  value={maxUploadSizeMB}
                  id="set-max-size"
                  onChange={(e) => setMaxUploadSizeMB(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg outline-none text-xs bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-3xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Allowed File extensions</label>
                <input
                  type="text"
                  value={allowedTypes}
                  id="set-allowed-types"
                  onChange={(e) => setAllowedTypes(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg outline-none text-xs bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl p-4 text-3xs font-bold leading-tight">
              {successMsg}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              id="set-btn-save"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
            >
              <Save className="h-4.5 w-4.5" />
              Save Settings Changes
            </button>
          </div>
        </form>

        {/* Right column: Dynamic Retention Policy execution sandbox */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-sans font-bold text-xs text-slate-200 border-b border-slate-850 pb-2 flex items-center gap-2">
              <Archive className="h-4.5 w-4.5 text-indigo-400" />
              Retention Deletion policy Configuration
            </h3>
            <p className="text-3xs text-slate-400 leading-relaxed font-semibold">
              The academic board mandates that approved plans must be retained securely for **3 years** (36 months). Legacy items are purged completely via cron parameters.
            </p>

            <div>
              <label className="block text-3xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">Default Memory cap (Years)</label>
              <input
                type="number"
                value={retentionYears}
                id="set-retention"
                onChange={(e) => setRetentionYears(Number(e.target.value))}
                className="w-full text-xs font-bold bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                id="btn-trigger-cleanup"
                onClick={onTriggerCleanup}
                className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-750 text-white font-bold text-3xs py-2 rounded-lg transition-colors cursor-pointer text-center"
              >
                Manually Execute purging pass (36 months)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
