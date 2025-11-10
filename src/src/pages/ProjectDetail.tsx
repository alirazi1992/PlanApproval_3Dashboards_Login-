import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Tabs } from '../components/ui/Tabs';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { DataTable, Column } from '../components/ui/DataTable';
import { Icon } from '../components/ui/Icon';
import { mockProjects, mockDocuments, mockInspections, mockCertificates, mockCAPAs, mockClosures, mockUsers, mockUnits, mockComments } from '../mocks/db';
import { Document, Inspection, Certificate, CAPA, Closure } from '../features/projects/types';
export function ProjectDetail() {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const project = mockProjects.find(p => p.id === id);
  if (!project) {
    return <AppShell>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">پروژه یافت نشد</h2>
          <Button onClick={() => navigate('/projects')} className="mt-4">
            بازگشت به لیست پروژه‌ها
          </Button>
        </div>
      </AppShell>;
  }
  const projectDocuments = mockDocuments.filter(d => d.projectId === id);
  const projectInspections = mockInspections.filter(i => i.projectId === id);
  const projectCertificates = mockCertificates.filter(c => c.projectId === id);
  const projectCAPAs = mockCAPAs.filter(c => c.projectId === id);
  const projectClosures = mockClosures.filter(c => c.projectId === id);
  const applicant = mockUsers.find(u => u.id === project.applicantId);
  const unit = mockUnits.find(u => u.id === project.unitId);
  const documentColumns: Column<Document>[] = [{
    key: 'fileName',
    header: 'نام فایل',
    render: doc => <div className="flex items-center gap-2">
          <Icon name="clipboard" size={16} className="text-gray-400" />
          <span className="font-medium">{doc.fileName}</span>
        </div>
  }, {
    key: 'revision',
    header: 'نسخه',
    render: doc => <Badge>v{doc.revision}</Badge>
  }, {
    key: 'status',
    header: 'وضعیت',
    render: doc => <StatusBadge status={doc.status} />
  }, {
    key: 'uploadedAt',
    header: 'تاریخ بارگذاری',
    render: doc => <span className="text-sm text-gray-600">
          {new Date(doc.uploadedAt).toLocaleDateString('fa-IR')}
        </span>
  }, {
    key: 'fileSize',
    header: 'حجم',
    render: doc => <span className="text-sm text-gray-600">
          {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
        </span>
  }];
  const inspectionColumns: Column<Inspection>[] = [{
    key: 'type',
    header: 'نوع بازرسی',
    render: inspection => {
      const typeLabels = {
        Initial: 'اولیه',
        Re: 'مجدد',
        Final: 'نهایی'
      };
      return <span>{typeLabels[inspection.type]}</span>;
    }
  }, {
    key: 'inspectionDate',
    header: 'تاریخ بازرسی',
    render: inspection => <span className="text-sm text-gray-600">
          {new Date(inspection.inspectionDate).toLocaleDateString('fa-IR')}
        </span>
  }, {
    key: 'result',
    header: 'نتیجه',
    render: inspection => <StatusBadge status={inspection.result} />
  }, {
    key: 'inspectorId',
    header: 'بازرس',
    render: inspection => {
      const inspector = mockUsers.find(u => u.id === inspection.inspectorId);
      return <span className="text-sm text-gray-600">{inspector?.name}</span>;
    }
  }, {
    key: 'remarks',
    header: 'توضیحات',
    render: inspection => <span className="text-sm text-gray-600">
          {inspection.remarks || '-'}
        </span>
  }];
  const certificateColumns: Column<Certificate>[] = [{
    key: 'certificateNumber',
    header: 'شماره گواهی',
    render: cert => <span className="font-medium">{cert.certificateNumber}</span>
  }, {
    key: 'type',
    header: 'نوع',
    render: cert => {
      const typeLabels = {
        Design: 'طراحی',
        Renewal: 'تمدید',
        Replacement: 'جایگزین'
      };
      return <span>{typeLabels[cert.type]}</span>;
    }
  }, {
    key: 'issueDate',
    header: 'تاریخ صدور',
    render: cert => <span className="text-sm text-gray-600">
          {new Date(cert.issueDate).toLocaleDateString('fa-IR')}
        </span>
  }, {
    key: 'expiryDate',
    header: 'تاریخ انقضا',
    render: cert => <span className="text-sm text-gray-600">
          {new Date(cert.expiryDate).toLocaleDateString('fa-IR')}
        </span>
  }, {
    key: 'status',
    header: 'وضعیت',
    render: cert => <StatusBadge status={cert.status} />
  }];
  const capaColumns: Column<CAPA>[] = [{
    key: 'title',
    header: 'عنوان',
    render: capa => <span className="font-medium">{capa.title}</span>
  }, {
    key: 'status',
    header: 'وضعیت',
    render: capa => <StatusBadge status={capa.status} />
  }, {
    key: 'assignedTo',
    header: 'مسئول',
    render: capa => {
      const assignee = mockUsers.find(u => u.id === capa.assignedTo);
      return <span className="text-sm text-gray-600">{assignee?.name}</span>;
    }
  }, {
    key: 'dueDate',
    header: 'مهلت',
    render: capa => <span className="text-sm text-gray-600">
          {new Date(capa.dueDate).toLocaleDateString('fa-IR')}
        </span>
  }];
  const tabs = [{
    id: 'overview',
    label: 'نمای کلی',
    content: <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  شماره پیگیری
                </label>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {project.utn}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  نوع پروژه
                </label>
                <p className="text-gray-900 mt-1">{project.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  متقاضی
                </label>
                <p className="text-gray-900 mt-1">{applicant?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  واحد
                </label>
                <p className="text-gray-900 mt-1">{unit?.name}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  تاریخ ایجاد
                </label>
                <p className="text-gray-900 mt-1">
                  {new Date(project.createdAt).toLocaleDateString('fa-IR')}
                </p>
              </div>
              {project.submittedAt && <div>
                  <label className="text-sm font-medium text-gray-600">
                    تاریخ ارسال
                  </label>
                  <p className="text-gray-900 mt-1">
                    {new Date(project.submittedAt).toLocaleDateString('fa-IR')}
                  </p>
                </div>}
              {project.approvedAt && <div>
                  <label className="text-sm font-medium text-gray-600">
                    تاریخ تأیید
                  </label>
                  <p className="text-gray-900 mt-1">
                    {new Date(project.approvedAt).toLocaleDateString('fa-IR')}
                  </p>
                </div>}
              {project.certifiedAt && <div>
                  <label className="text-sm font-medium text-gray-600">
                    تاریخ گواهی
                  </label>
                  <p className="text-gray-900 mt-1">
                    {new Date(project.certifiedAt).toLocaleDateString('fa-IR')}
                  </p>
                </div>}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">توضیحات</label>
            <p className="text-gray-900 mt-2 leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>
  }, {
    id: 'documents',
    label: `مدارک (${projectDocuments.length})`,
    content: <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {projectDocuments.length} مدرک
            </p>
            <Button variant="primary" size="sm">
              + بارگذاری مدرک
            </Button>
          </div>
          <DataTable data={projectDocuments} columns={documentColumns} />
        </div>
  }, {
    id: 'inspections',
    label: `بازرسی‌ها (${projectInspections.length})`,
    content: <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {projectInspections.length} بازرسی
            </p>
            <Button variant="primary" size="sm">
              + بازرسی جدید
            </Button>
          </div>
          <DataTable data={projectInspections} columns={inspectionColumns} />
        </div>
  }, {
    id: 'certificates',
    label: `گواهینامه‌ها (${projectCertificates.length})`,
    content: <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {projectCertificates.length} گواهینامه
            </p>
            <Button variant="primary" size="sm">
              + صدور گواهینامه
            </Button>
          </div>
          <DataTable data={projectCertificates} columns={certificateColumns} />
        </div>
  }, {
    id: 'capa',
    label: `CAPA (${projectCAPAs.length})`,
    content: <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {projectCAPAs.length} اقدام اصلاحی/پیشگیرانه
            </p>
          </div>
          <DataTable data={projectCAPAs} columns={capaColumns} />
        </div>
  }, {
    id: 'closure',
    label: 'بسته‌شدن',
    content: <div className="space-y-4">
          {projectClosures.map(closure => <div key={closure.id} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">
                  {closure.type === 'Technical' ? 'بسته‌شدن فنی' : closure.type === 'Financial' ? 'بسته‌شدن مالی' : 'بسته‌شدن قراردادی'}
                </h4>
                <StatusBadge status={closure.status} />
              </div>
              {closure.notes && <p className="text-sm text-gray-600 mt-2">{closure.notes}</p>}
              {closure.closedAt && <p className="text-xs text-gray-500 mt-2">
                  بسته شده در:{' '}
                  {new Date(closure.closedAt).toLocaleDateString('fa-IR')}
                </p>}
            </div>)}
          {projectClosures.length === 0 && <p className="text-center text-gray-500 py-8">
              هنوز بسته‌شدنی ثبت نشده است
            </p>}
        </div>
  }];
  return <AppShell>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button onClick={() => navigate('/projects')} className="text-gray-400 hover:text-gray-600">
                <Icon name="chevronDown" size={20} className="rotate-90" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {project.title}
              </h1>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-gray-600 mr-8">{project.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              ویرایش
            </Button>
            <Button variant="primary" size="sm">
              اقدامات
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <Tabs tabs={tabs} variant="default" />
        </div>
      </div>
    </AppShell>;
}