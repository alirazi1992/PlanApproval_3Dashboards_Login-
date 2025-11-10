import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { DataTable, Column } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { mockProjects, mockUnits } from '../mocks/db';
import { Project, ProjectType, ProjectStatus } from '../features/projects/types';

const typeLabels: Record<ProjectType, string> = {
  Hull: 'بدنه و سازه',
  Machinery: 'ماشین‌آلات و رانش',
  Electrical: 'الکتریک و کنترل',
  General: 'سایر حوزه‌ها'
};

const statusLabels: Record<ProjectStatus, string> = {
  Pending: 'در انتظار بررسی',
  UnderReview: 'در حال ارزیابی',
  Approved: 'تایید شده',
  Certified: 'گواهی صادر شده',
  Rejected: 'رد شده',
  Withdrawn: 'لغو شده'
};

const projectContent: Record<string, { title: string; description: string }> = {
  '1': {
    title: 'بهینه‌سازی اسکلت کشتی ۵۰۰۰ تنی',
    description: 'بازطراحی اتصال تیرک‌ها و کاهش ارتعاش بدنه برای ناوگان صادراتی.'
  },
  '2': {
    title: 'بازطراحی سامانه رانش واحد A12',
    description: 'ارتقای راندمان موتور اصلی و یکپارچه‌سازی کنترل هوشمند.'
  },
  '3': {
    title: 'بازآرایی شبکه برق اضطراری',
    description: 'جایگزینی تابلوهای کهنه و افزودن رصد سلامت تجهیزات.'
  },
  '4': {
    title: 'تغییر کاربری مخزن دو منظوره',
    description: 'افزودن مدار خنثی‌سازی سریع برای مواد حساس.'
  }
};

const unitNameMap: Record<string, string> = {
  '1': 'یگان مهندسی بدنه',
  '2': 'یگان ماشین‌آلات و رانش',
  '3': 'یگان الکتریک و کنترل',
  '4': 'یگان طراحی عمومی'
};

export function Projects() {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<ProjectType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | 'all'>('all');

  const localizedProjects = useMemo(() => mockProjects.map(project => ({
    ...project,
    title: projectContent[project.id]?.title ?? `پروژه ${project.utn}`,
    description: projectContent[project.id]?.description ?? 'شرح این پروژه هنوز ثبت نشده است.'
  })), []);

  const filteredProjects = localizedProjects.filter(project => {
    if (filterType !== 'all' && project.type !== filterType) return false;
    if (filterStatus !== 'all' && project.status !== filterStatus) return false;
    return true;
  });

  const columns: Column<Project>[] = [{
    key: 'utn',
    header: 'کد پیگیری',
    sortable: true,
    render: project => (
      <button
        onClick={() => navigate(`/projects/${project.id}`)}
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        {project.utn}
      </button>
    )
  }, {
    key: 'title',
    header: 'عنوان پروژه',
    sortable: true,
    render: project => (
      <div>
        <div className="font-medium text-gray-900">{project.title}</div>
        <div className="text-sm text-gray-500 mt-0.5">
          {project.description}
        </div>
      </div>
    )
  }, {
    key: 'type',
    header: 'حوزه فنی',
    render: project => <Badge>{typeLabels[project.type]}</Badge>
  }, {
    key: 'status',
    header: 'وضعیت',
    sortable: true,
    render: project => <StatusBadge status={project.status} />
  }, {
    key: 'unitId',
    header: 'یگان مسئول',
    render: project => {
      const unitLabel = unitNameMap[project.unitId] ?? mockUnits.find(u => u.id === project.unitId)?.name ?? 'نامشخص';
      return <span className="text-sm text-gray-600">{unitLabel}</span>;
    }
  }, {
    key: 'createdAt',
    header: 'تاریخ ثبت',
    sortable: true,
    render: project => (
      <span className="text-sm text-gray-600">
        {new Date(project.createdAt).toLocaleDateString('fa-IR')}
      </span>
    )
  }, {
    key: 'updatedAt',
    header: 'آخرین بروزرسانی',
    sortable: true,
    render: project => (
      <span className="text-sm text-gray-500">
        {new Date(project.updatedAt).toLocaleDateString('fa-IR')}
      </span>
    )
  }];

  return (
    <AppShell>
      <div className="space-y-6 text-right">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">پرونده‌های فعال</h1>
            <p className="text-gray-600 mt-1">
              مرور سریع وضعیت پروژه‌ها، واحدهای پاسخ‌گو و زمان‌بندی صدور گواهی.
            </p>
          </div>
          <Button variant="primary">
            + ثبت پروژه جدید
          </Button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                حوزه فنی
              </label>
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value as any)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              >
                <option value="all">همه حوزه‌ها</option>
                {Object.entries(typeLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                وضعیت بررسی
              </label>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              >
                <option value="all">همه وضعیت‌ها</option>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mr-auto text-sm text-gray-600">
              {filteredProjects.length} پروژه مطابق فیلتر
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <DataTable
            data={filteredProjects}
            columns={columns}
            onRowClick={project => navigate(`/projects/${project.id}`)}
            searchable
            searchPlaceholder="جستجوی UTN، عنوان یا واحد مسئول..."
          />
        </div>
      </div>
    </AppShell>
  );
}
