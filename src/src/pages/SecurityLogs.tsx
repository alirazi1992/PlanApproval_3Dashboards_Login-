import React, { useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { mockSecurityLogs, mockUsers } from '../mocks/db';
import { SecurityLog } from '../features/projects/types';
export function SecurityLogs() {
  const [selectedLog, setSelectedLog] = useState<SecurityLog | null>(null);
  const [lockdownMode, setLockdownMode] = useState(false);
  const severityColors: Record<string, string> = {
    Low: 'bg-blue-100 text-blue-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-orange-100 text-orange-800',
    Critical: 'bg-red-100 text-red-800'
  };
  const typeLabels: Record<string, string> = {
    IntegrityFailure: 'خطای یکپارچگی',
    PermissionEscalation: 'افزایش دسترسی',
    LoginAnomaly: 'ورود غیرعادی',
    UnauthorizedAccess: 'دسترسی غیرمجاز'
  };
  const columns: Column<SecurityLog>[] = [{
    key: 'timestamp',
    header: 'زمان',
    sortable: true,
    render: log => <div className="text-sm">
          <div className="font-medium text-gray-900">
            {new Date(log.timestamp).toLocaleDateString('fa-IR')}
          </div>
          <div className="text-gray-500">
            {new Date(log.timestamp).toLocaleTimeString('fa-IR')}
          </div>
        </div>
  }, {
    key: 'severity',
    header: 'شدت',
    sortable: true,
    render: log => <Badge className={severityColors[log.severity]}>{log.severity}</Badge>
  }, {
    key: 'type',
    header: 'نوع',
    render: log => <span className="text-sm font-medium text-gray-900">
          {typeLabels[log.type]}
        </span>
  }, {
    key: 'description',
    header: 'توضیحات',
    render: log => <span className="text-sm text-gray-700">{log.description}</span>
  }, {
    key: 'userId',
    header: 'کاربر',
    render: log => {
      if (!log.userId) return <span className="text-gray-400">-</span>;
      const user = mockUsers.find(u => u.id === log.userId);
      return <div className="flex items-center gap-2">
            <img src={user?.avatar} alt="" className="w-6 h-6 rounded-full" />
            <span className="text-sm text-gray-900">{user?.name}</span>
          </div>;
    }
  }, {
    key: 'entityType',
    header: 'موجودیت',
    render: log => <span className="text-sm text-gray-600">{log.entityType || '-'}</span>
  }];
  return <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              گزارش‌های امنیتی
            </h1>
            <p className="text-gray-600 mt-1">
              رویدادهای امنیتی و خطاهای یکپارچگی
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant={lockdownMode ? 'primary' : 'secondary'} onClick={() => setLockdownMode(!lockdownMode)}>
              <Icon name="settings" size={16} className="ml-2" />
              {lockdownMode ? 'حالت قفل فعال' : 'فعال‌سازی قفل'}
            </Button>
            <Button variant="secondary">
              <Icon name="clipboard" size={16} className="ml-2" />
              خروجی
            </Button>
          </div>
        </div>

        {/* Lockdown Banner */}
        {lockdownMode && <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 flex items-start gap-3">
            <Icon name="bell" size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-red-900 text-lg">
                حالت قفل امنیتی فعال
              </h3>
              <p className="text-sm text-red-700 mt-1">
                سیستم در حالت قفل امنیتی قرار دارد. تمامی عملیات حساس مسدود شده
                و تنها مشاهده مجاز است.
              </p>
            </div>
            <button onClick={() => setLockdownMode(false)} className="text-red-600 hover:text-red-800 font-medium text-sm">
              غیرفعال
            </button>
          </div>}

        {/* Critical Events Alert */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
          <Icon name="bell" size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-orange-900">
              لاگ‌های امنیتی غیرقابل تغییر
            </h3>
            <p className="text-sm text-orange-700 mt-1">
              این لاگ‌ها به صورت خودکار ثبت و غیرقابل ویرایش هستند. رویدادهای
              بحرانی به صورت خودکار به مدیران اطلاع داده می‌شوند.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">رویدادهای بحرانی</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {mockSecurityLogs.filter(l => l.severity === 'Critical').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Icon name="bell" size={24} className="text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">شدت بالا</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {mockSecurityLogs.filter(l => l.severity === 'High').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Icon name="bell" size={24} className="text-orange-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">شدت متوسط</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {mockSecurityLogs.filter(l => l.severity === 'Medium').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Icon name="bell" size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">کل رویدادها</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {mockSecurityLogs.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Icon name="clipboard" size={24} className="text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                شدت
              </label>
              <select className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">همه</option>
                <option value="Critical">بحرانی</option>
                <option value="High">بالا</option>
                <option value="Medium">متوسط</option>
                <option value="Low">پایین</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                نوع رویداد
              </label>
              <select className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">همه</option>
                <option value="IntegrityFailure">خطای یکپارچگی</option>
                <option value="PermissionEscalation">افزایش دسترسی</option>
                <option value="LoginAnomaly">ورود غیرعادی</option>
                <option value="UnauthorizedAccess">دسترسی غیرمجاز</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                بازه زمانی
              </label>
              <select className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="24h">24 ساعت اخیر</option>
                <option value="7d">7 روز اخیر</option>
                <option value="30d">30 روز اخیر</option>
                <option value="all">همه</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Logs Table */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <DataTable data={mockSecurityLogs} columns={columns} onRowClick={setSelectedLog} searchable searchPlaceholder="جستجو در رویدادهای امنیتی..." />
        </div>

        {/* Log Detail Dialog */}
        {selectedLog && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  جزئیات رویداد امنیتی
                </h2>
                <button onClick={() => setSelectedLog(null)} className="text-gray-400 hover:text-gray-600">
                  <Icon name="check" size={24} className="rotate-45" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
                  <Badge className={severityColors[selectedLog.severity]}>
                    {selectedLog.severity}
                  </Badge>
                  <span className="font-medium text-gray-900">
                    {typeLabels[selectedLog.type]}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      شناسه رویداد
                    </label>
                    <p className="text-gray-900 mt-1 font-mono text-sm">
                      {selectedLog.id}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      زمان
                    </label>
                    <p className="text-gray-900 mt-1">
                      {new Date(selectedLog.timestamp).toLocaleString('fa-IR')}
                    </p>
                  </div>
                  {selectedLog.userId && <div>
                      <label className="text-sm font-medium text-gray-600">
                        کاربر
                      </label>
                      <p className="text-gray-900 mt-1">
                        {mockUsers.find(u => u.id === selectedLog.userId)?.name}
                      </p>
                    </div>}
                  {selectedLog.entityType && <div>
                      <label className="text-sm font-medium text-gray-600">
                        موجودیت
                      </label>
                      <p className="text-gray-900 mt-1">
                        {selectedLog.entityType} ({selectedLog.entityId})
                      </p>
                    </div>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    توضیحات
                  </label>
                  <p className="text-gray-900 mt-2 leading-relaxed">
                    {selectedLog.description}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    جزئیات فنی
                  </label>
                  <pre className="mt-2 p-4 bg-gray-50 rounded-xl text-sm overflow-x-auto">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>}
      </div>
    </AppShell>;
}