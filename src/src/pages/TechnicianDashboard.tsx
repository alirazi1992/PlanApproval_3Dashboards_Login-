import React, { useMemo, useState, useEffect } from "react";
import { WorkspaceAppShell } from "../components/layout/WorkspaceAppShell";
import { GlassCard } from "../components/common/GlassCard";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { AvatarGroup } from "../components/common/AvatarGroup";
import { JourneyBoard } from "../components/journey/JourneyBoard";
import { Donut } from "../components/charts/Donut";
import { AreaSpark } from "../components/charts/AreaSpark";
import { mockAvatars } from "../mocks/db";
import {
  WorkspaceProvider,
  useWorkspace,
} from "../features/workspace/WorkspaceContext";
import {
  createInitialJourneyState,
  workspaceSnapshots,
} from "../features/workspace/data";
import { JourneyState } from "../features/workspace/types";
import { Island } from "../features/projects/types";

/** --- Helpers for perfect Persian UX --- */
const toFaDigits = (input: string | number) => {
  const fa = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(input).replace(/\d/g, (d) => fa[Number(d)]);
};

// In case child widgets accept an rtl prop; safe to pass even if ignored
const RTL_HINT = { rtl: true } as const;

/** --- Static data (kept as-is) --- */
const knowledgeBase = [
  {
    id: "kb-1",
    title: "راهنمای تحلیل ریشه‌ای ارتعاش",
    detail: "چک‌لیست ۱۲ مرحله‌ای برای رفع سریع",
  },
  {
    id: "kb-2",
    title: "الگوی گزارش مدیران",
    detail: "نسخه آماده ارائه با نمودارهای مهم",
  },
  {
    id: "kb-3",
    title: "بسته معتبرسازی میدانی",
    detail: "استانداردهای پذیرش برای تیم QA",
  },
];

const donutData = [
  { label: "ارجاع اضطراری", value: 18, color: "#f97316" },
  { label: "در حال اقدام", value: 32, color: "#0ea5e9" },
  { label: "بسته شده", value: 44, color: "#10b981" },
];

const sparkData = [30, 42, 38, 54, 49, 60, 70, 88, 85, 78, 90, 97];

const quickStats = [
  {
    id: "handover",
    label: "در انتظار تحویل",
    value: "۱۲",
    change: "+3",
    changeTone: "positive",
  },
  {
    id: "visits",
    label: "بازدید میدانی امروز",
    value: "۵",
    change: "-1",
    changeTone: "negative",
  },
  {
    id: "incidents",
    label: "هشدار فعال",
    value: "۳",
    change: "+1",
    changeTone: "negative",
  },
  {
    id: "satisfaction",
    label: "رضایت مشتری",
    value: "۹۱٪",
    change: "+6",
    changeTone: "positive",
  },
];

function TechnicianDashboardView() {
  const { activeTab } = useWorkspace();
  const [journeys, setJourneys] = useState<JourneyState>(() =>
    createInitialJourneyState()
  );
  const snapshot = workspaceSnapshots[activeTab];
  const islands = journeys[activeTab] ?? [];

  // Ensure document direction is RTL for keyboard nav & selection flow
  useEffect(() => {
    const prevDir = document.documentElement.getAttribute("dir");
    const prevLang = document.documentElement.getAttribute("lang");
    document.documentElement.setAttribute("dir", "rtl");
    document.documentElement.setAttribute("lang", "fa");
    return () => {
      if (prevDir) document.documentElement.setAttribute("dir", prevDir);
      else document.documentElement.removeAttribute("dir");
      if (prevLang) document.documentElement.setAttribute("lang", prevLang);
      else document.documentElement.removeAttribute("lang");
    };
  }, []);

  const handleTaskReorder = (
    islandId: string,
    taskId: string,
    newOrder: number
  ) => {
    setJourneys((prev) => {
      const next: JourneyState = { ...prev };
      next[activeTab] = prev[activeTab].map((island) => {
        if (island.id !== islandId) return island;
        const tasks = [...island.tasks];
        const fromIndex = tasks.findIndex((task) => task.id === taskId);
        if (fromIndex === -1) return island;
        const [removed] = tasks.splice(fromIndex, 1);
        tasks.splice(newOrder, 0, removed);
        return {
          ...island,
          tasks: tasks.map((task, order) => ({ ...task, order })),
        };
      }) as Island[];
      return next;
    });
  };

  const alerts = useMemo(
    () => snapshot.reminders.slice(0, 4),
    [snapshot.reminders]
  );

  return (
    <WorkspaceAppShell>
      {/* Root RTL scope for this screen */}
      <div dir="rtl" lang="fa" className="space-y-8">
        {/* ----- Header & KPI row ----- */}
        <section className="grid gap-6 lg:grid-cols-3">
          <GlassCard className="p-6 lg:col-span-2 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              {/* Title block aligned right for RTL */}
              <div className="space-y-2 text-right">
                <p className="text-xs text-gray-500">
                  وضعیت کلی پرونده‌های حیاتی
                </p>
                <h2 className="text-[22px] font-semibold text-gray-900">
                  {snapshot.headline}
                </h2>
                <p className="text-sm text-gray-500">{snapshot.subline}</p>
              </div>
              {/* Action buttons: visual order right→left */}
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm">
                  یادداشت فوری
                </Button>
                <Button variant="primary" size="sm">
                  ثبت اقدام جدید
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {snapshot.metrics.map((metric) => (
                <div
                  key={metric.id}
                  className="rounded-2xl border border-white/70 bg-white/95 px-4 py-3 text-right"
                >
                  <p className="text-xs text-gray-500">{metric.label}</p>
                  <div className="flex items-end justify-end gap-2 mt-2">
                    <span className="text-2xl font-semibold text-gray-900">
                      {toFaDigits(metric.value)}
                    </span>
                    {metric.trend && (
                      <span
                        className={`text-xs font-medium inline-flex items-center gap-1 ${
                          metric.trend.isPositive
                            ? "text-emerald-600"
                            : "text-rose-500"
                        }`}
                        aria-label={
                          metric.trend.isPositive
                            ? "روند افزایشی"
                            : "روند کاهشی"
                        }
                      >
                        <Icon
                          name={
                            metric.trend.isPositive
                              ? "arrowUpRight"
                              : "arrowDownRight"
                          }
                          size={14}
                        />
                        {toFaDigits(metric.trend.value)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <Card className="p-6 space-y-4">
            <h3 className="text-base font-semibold text-gray-900 text-right">
              نمای کلی امروز
            </h3>
            <div className="space-y-3">
              {quickStats.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white/90 px-4 py-3"
                >
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {item.value}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      item.changeTone === "positive"
                        ? "text-emerald-600"
                        : "text-rose-500"
                    }`}
                  >
                    {toFaDigits(item.change)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* ----- Charts & Alerts ----- */}
        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Donut */}
              <div className="rounded-2xl border border-gray-100 bg-white/95 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">وضعیت ارجاعات</p>
                    <h4 className="text-base font-semibold text-gray-900">
                      پراکندگی پرونده‌ها
                    </h4>
                  </div>
                  <span className="text-xs text-gray-400">امروز</span>
                </div>
                <div className="flex justify-center">
                  {/* If your Donut supports rtl, it’ll use it; otherwise unchanged */}
                  <Donut data={donutData} size={200} {...RTL_HINT} />
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  {donutData.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-gray-600">{item.label}</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {toFaDigits(item.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sparkline */}
              <div className="rounded-2xl border border-gray-100 bg-white/95 p-4 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">توان عملیاتی</p>
                    <h4 className="text-base font-semibold text-gray-900">
                      روند تکمیل ماهانه
                    </h4>
                  </div>
                  <span className="text-xs text-gray-400">۱۲ هفته اخیر</span>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <AreaSpark
                    data={sparkData}
                    width={260}
                    height={120}
                    color="#0ea5e9"
                    {...RTL_HINT}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                  <span>ابتدای دوره</span>
                  <span>اکنون</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Alerts */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs text-gray-500">هشدارهای فعال</p>
                <h4 className="text-base font-semibold text-gray-900">
                  اولویت‌های امروز
                </h4>
              </div>
              <Button variant="ghost" size="sm">
                ثبت یادداشت
              </Button>
            </div>
            <div className="space-y-3">
              {alerts.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-gray-100 bg-white/95 px-4 py-3 text-right"
                >
                  <p className="text-sm font-medium text-gray-900">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    مسئول: {item.owner} · موعد: {toFaDigits(item.due)}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* ----- Knowledge + Support ----- */}
        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="p-6 space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <h4 className="text-base font-semibold text-gray-900">
                  منابع پیشنهادی تیم
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  به‌روزرسانی شده توسط دفتر فنی
                </p>
              </div>
              <Button variant="secondary" size="sm">
                مشاهده آرشیو
              </Button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {knowledgeBase.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-gray-100 bg-white/95 px-4 py-3 flex items-center justify-between gap-3"
                >
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{item.detail}</p>
                  </div>
                  {/* Icon order is visual left in RTL */}
                  <div className="flex gap-1 text-gray-500">
                    <span className="w-8 h-8 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                      <Icon name="plus" size={16} />
                    </span>
                    <span className="w-8 h-8 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                      <Icon name="clipboard" size={16} />
                    </span>
                    <span className="w-8 h-8 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                      <Icon name="calendar" size={16} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <h4 className="text-base font-semibold text-gray-900">
                  پشتیبانی و سرویس
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  تیم موفقیت مشتری همیشه آماده است
                </p>
              </div>
              <Button variant="ghost" size="sm">
                ثبت تیکت
              </Button>
            </div>
            <div className="space-y-3">
              {[
                {
                  id: "chat",
                  title: "چت با مهندس آماده‌باش",
                  detail: "پاسخگویی میانگین ۶ دقیقه",
                },
                {
                  id: "calendar",
                  title: "رزرو جلسه هم‌آهنگی",
                  detail: "انتخاب بازه ۳۰ دقیقه‌ای",
                },
                {
                  id: "secure-room",
                  title: "اتاق داده ایمن",
                  detail: "دسترسی رمزگذاری‌شده AES-256",
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-gray-100 bg-white/95 px-4 py-3 flex items-center justify-between"
                >
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{item.detail}</p>
                  </div>
                  {/* In RTL, forward chevron usually points to the left */}
                  <Icon
                    name="chevronLeft"
                    size={16}
                    className="text-gray-300"
                  />
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* ----- Journey board ----- */}
        <section className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="text-right">
              <h3 className="text-lg font-semibold text-gray-900">
                گردش کار روزانه تیم‌ها
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                پیگیری بصری مراحل از دریافت تا تحویل
              </p>
            </div>
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              <AvatarGroup avatars={mockAvatars} />
            </div>
          </div>
          <GlassCard className="p-6">
            {/* If your board supports rtl columns, it can use the hint */}
            <JourneyBoard
              islands={islands}
              onTaskReorder={handleTaskReorder}
              {...RTL_HINT}
            />
          </GlassCard>
        </section>
      </div>
    </WorkspaceAppShell>
  );
}

export function TechnicianDashboard() {
  return (
    <WorkspaceProvider>
      <TechnicianDashboardView />
    </WorkspaceProvider>
  );
}
