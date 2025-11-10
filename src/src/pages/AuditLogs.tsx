import React, { useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { mockAuditEvents, mockUsers, mockRoles, mockAccessTokens, mockScopes } from '../mocks/db';
import { AuditEvent } from '../features/projects/types';
export function AuditLogs() {
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const columns: Column<AuditEvent>[] = [{
    key: 'timestamp',
    header: 'زمان',
    sortable: true,
    render: event => <div className="text-sm">
          <div className="font-medium text-gray-900">
            {new Date(event.timestamp).toLocaleDateString('fa-IR')}
          </div>
          <div className="text-gray-500">
            {new Date(event.timestamp).toLocaleTimeString('fa-IR')}
          </div>
        </div>
  }, {
    key: 'userId',
    header: 'کاربر',
    render: event => {
      const user = mockUsers.find(u => u.id === event.userId);
      return <div className="flex items-center gap-2">
            <img src={user?.avatar} alt="" className="w-8 h-8 rounded-full" />
            <span className="text-sm font-medium text-gray-900">
              {user?.name}
            </span>
          </div>;
    }
  }, {
    key: 'action',
    header: 'عملیات',
    render: event => {
      const actionLabels: Record<string, string> = {
        CREATE_PROJECT: 'ایجاد پروژه',
        UPLOAD_DOCUMENT: 'بارگذاری مدرک',
        REVIEW_DOCUMENT: 'بررسی مدرک',
        ASSIGN_PERMISSION: 'تخصیص دسترسی'
      };
      return <Badge>{actionLabels[event.action] || event.action}</Badge>;
    }
  }, {
    key: 'entity',
    header: 'موجودیت',
    render: event => <div className="text-sm">
          <div className="font-medium text-gray-900">{event.entity}</div>
          <div className="text-gray-500">{event.entityId}</div>
        </div>
  }, {
    key: 'roleId',
    header: 'نقش',
    render: event => {
      const role = mockRoles.find(r => r.id === event.roleId);
      return <span className="text-sm text-gray-600">{role?.name}</span>;
    }
  }, {
    key: 'tokenId',
    header: 'توکن',
    render: event => {
      if (!event.tokenId) return <span className="text-gray-400">-</span>;
      const token = mockAccessTokens.find(t => t.id === event.tokenId);
      return <span className="text-sm text-gray-600">{token?.code}</span>;
    }
  }, {
    key: 'ipAddress',
    header: 'IP',
    render: event => <span className="text-sm font-mono text-gray-600">
          {event.ipAddress}
        </span>
  }];
  return <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              گزارش‌های حسابرسی
            </h1>
            <p className="text-gray-600 mt-1">
              لاگ‌های غیرقابل تغییر تمامی عملیات سیستم
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary">
              <Icon name="clipboard" size={16} className="ml-2" />
              خروجی Excel
            </Button>
            <Button variant="secondary">
              <Icon name="clipboard" size={16} className="ml-2" />
              خروجی PDF
            </Button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Icon name="bell" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">لاگ‌های حسابرسی</h3>
            <p className="text-sm text-blue-700 mt-1">
              این لاگ‌ها غیرقابل تغییر و فقط خواندنی هستند. تمامی عملیات با
              شناسه کاربر، نقش، توکن، و محدوده دسترسی ثبت می‌شوند.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                از تاریخ
              </label>
              <input type="date" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                تا تاریخ
              </label>
              <input type="date" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                نوع عملیات
              </label>
              <select className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">همه</option>
                <option value="CREATE_PROJECT">ایجاد پروژه</option>
                <option value="UPLOAD_DOCUMENT">بارگذاری مدرک</option>
                <option value="REVIEW_DOCUMENT">بررسی مدرک</option>
                <option value="ASSIGN_PERMISSION">تخصیص دسترسی</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                کاربر
              </label>
              <select className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">همه</option>
                {mockUsers.map(user => <option key={user.id} value={user.id}>
                    {user.name}
                  </option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Audit Table */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <DataTable data={mockAuditEvents} columns={columns} onRowClick={setSelectedEvent} searchable searchPlaceholder="جستجو در لاگ‌ها..." />
        </div>

        {/* Event Detail Dialog */}
        {selectedEvent && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  جزئیات رویداد
                </h2>
                <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-gray-600">
                  <Icon name="check" size={24} className="rotate-45" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      شناسه رویداد
                    </label>
                    <p className="text-gray-900 mt-1 font-mono text-sm">
                      {selectedEvent.id}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      زمان
                    </label>
                    <p className="text-gray-900 mt-1">
                      {new Date(selectedEvent.timestamp).toLocaleString('fa-IR')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      کاربر
                    </label>
                    <p className="text-gray-900 mt-1">
                      {mockUsers.find(u => u.id === selectedEvent.userId)?.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      نقش
                    </label>
                    <p className="text-gray-900 mt-1">
                      {mockRoles.find(r => r.id === selectedEvent.roleId)?.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      عملیات
                    </label>
                    <p className="text-gray-900 mt-1">{selectedEvent.action}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      موجودیت
                    </label>
                    <p className="text-gray-900 mt-1">
                      {selectedEvent.entity} ({selectedEvent.entityId})
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      آدرس IP
                    </label>
                    <p className="text-gray-900 mt-1 font-mono text-sm">
                      {selectedEvent.ipAddress}
                    </p>
                  </div>
                  {selectedEvent.tokenId && <div>
                      <label className="text-sm font-medium text-gray-600">
                        توکن دسترسی
                      </label>
                      <p className="text-gray-900 mt-1">
                        {mockAccessTokens.find(t => t.id === selectedEvent.tokenId)?.code}
                      </p>
                    </div>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    جزئیات
                  </label>
                  <pre className="mt-2 p-4 bg-gray-50 rounded-xl text-sm overflow-x-auto">
                    {JSON.stringify(selectedEvent.details, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>}
      </div>
    </AppShell>;
}