import React, { useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { CalendarGrid } from '../components/calendar/CalendarGrid';
import { TaskCard } from '../components/calendar/TaskCard';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { Badge } from '../components/ui/Badge';
import { Dialog } from '../components/ui/Dialog';
import { mockTasks, mockUsers, mockProjects, mockRoles } from '../mocks/db';
import { Task, TaskType, TaskStatus, UserRole } from '../features/projects/types';
export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  // Filter tasks
  const filteredTasks = mockTasks.filter(task => {
    if (filterRole !== 'all' && task.assignedRole !== filterRole) return false;
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (filterProject !== 'all' && task.projectId !== filterProject) return false;
    return true;
  });
  // Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  // Get month name in Persian
  const monthNames = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
  const roleLabels: Record<UserRole, string> = {
    Applicant: 'متقاضی',
    Reviewer: 'بازبین',
    Inspector: 'بازرس',
    Clerk: 'کارشناس',
    Administrator: 'مدیر سیستم',
    Executive: 'مدیر اجرایی'
  };
  const statusLabels: Record<TaskStatus, string> = {
    Pending: 'در انتظار',
    InProgress: 'در حال انجام',
    Completed: 'انجام شده',
    Overdue: 'عقب‌افتاده'
  };
  // Task statistics
  const taskStats = {
    total: filteredTasks.length,
    pending: filteredTasks.filter(t => t.status === TaskStatus.Pending).length,
    inProgress: filteredTasks.filter(t => t.status === TaskStatus.InProgress).length,
    completed: filteredTasks.filter(t => t.status === TaskStatus.Completed).length
  };
  return <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">تقویم وظایف</h1>
            <p className="text-gray-600 mt-1">
              پیگیری وظایف و فعالیت‌های تیم‌ها
            </p>
          </div>
          <Button variant="primary" onClick={goToToday}>
            <Icon name="calendar" size={16} className="ml-2" />
            امروز
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">کل وظایف</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {taskStats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Icon name="clipboard" size={24} className="text-gray-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">در انتظار</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {taskStats.pending}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Icon name="calendar" size={24} className="text-gray-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">در حال انجام</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {taskStats.inProgress}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Icon name="check" size={24} className="text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">انجام شده</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {taskStats.completed}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Icon name="check" size={24} className="text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                نقش
              </label>
              <select value={filterRole} onChange={e => setFilterRole(e.target.value as any)} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">همه نقش‌ها</option>
                {Object.entries(roleLabels).map(([key, label]) => <option key={key} value={key}>
                    {label}
                  </option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                وضعیت
              </label>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">همه وضعیت‌ها</option>
                {Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>
                    {label}
                  </option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                پروژه
              </label>
              <select value={filterProject} onChange={e => setFilterProject(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">همه پروژه‌ها</option>
                {mockProjects.map(project => <option key={project.id} value={project.id}>
                    {project.title}
                  </option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={goToPreviousMonth}>
              <Icon name="chevronDown" size={16} className="rotate-90" />
            </Button>
            <h2 className="text-lg font-semibold text-gray-900 min-w-[150px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <Button variant="secondary" size="sm" onClick={goToNextMonth}>
              <Icon name="chevronDown" size={16} className="-rotate-90" />
            </Button>
          </div>
          <div className="text-sm text-gray-600">
            {filteredTasks.length} وظیفه
          </div>
        </div>

        {/* Calendar Grid */}
        <CalendarGrid tasks={filteredTasks} currentDate={currentDate} onTaskClick={setSelectedTask} />

        {/* Task Detail Dialog */}
        {selectedTask && <Dialog isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} title="جزئیات وظیفه">
            <div className="space-y-4">
              <TaskCard task={selectedTask} />

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    پروژه
                  </label>
                  <p className="text-gray-900 mt-1">
                    {selectedTask.projectTitle}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    مسئول
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <img src={mockUsers.find(u => u.id === selectedTask.assignedTo)?.avatar} alt="" className="w-6 h-6 rounded-full" />
                    <span className="text-gray-900">
                      {mockUsers.find(u => u.id === selectedTask.assignedTo)?.name}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    نقش
                  </label>
                  <p className="text-gray-900 mt-1">
                    {roleLabels[selectedTask.assignedRole]}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    مهلت
                  </label>
                  <p className="text-gray-900 mt-1">
                    {new Date(selectedTask.dueDate).toLocaleDateString('fa-IR')}
                  </p>
                </div>
                {selectedTask.completedDate && <div>
                    <label className="text-sm font-medium text-gray-600">
                      تاریخ اتمام
                    </label>
                    <p className="text-gray-900 mt-1">
                      {new Date(selectedTask.completedDate).toLocaleDateString('fa-IR')}
                    </p>
                  </div>}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  توضیحات
                </label>
                <p className="text-gray-900 mt-2 leading-relaxed">
                  {selectedTask.description}
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="primary" className="flex-1" onClick={() => setSelectedTask(null)}>
                  بستن
                </Button>
              </div>
            </div>
          </Dialog>}
      </div>
    </AppShell>;
}