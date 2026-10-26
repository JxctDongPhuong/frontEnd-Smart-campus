import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Zap, Calendar, RotateCw, TrendingUp, Sparkles, Clock } from 'lucide-react';
import { mockCampusData } from '../../data/mockData';

export function OccupancyChart() {
  const [period, setPeriod] = useState('day'); // 'day' | 'week' | 'month' | 'year'
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [animKey, setAnimKey] = useState(0);

  const seriesData = mockCampusData.timelineMetrics[period] || mockCampusData.timelineMetrics.day;

  // Tính toán các giá trị thống kê
  const values = seriesData.map(d => d.kwh);
  const totalKWh = values.reduce((acc, v) => acc + v, 0).toFixed(1);
  const maxVal = Math.max(...values, 1);
  const avgVal = (totalKWh / values.length).toFixed(1);

  // SVG coordinate calculations
  const svgWidth = 640;
  const svgHeight = 220;
  const paddingX = 42;
  const paddingTop = 25;
  const paddingBottom = 35;
  const usableWidth = svgWidth - paddingX * 2;
  const usableHeight = svgHeight - paddingTop - paddingBottom;

  // Generate points
  const points = seriesData.map((d, idx) => {
    const x = paddingX + (idx / Math.max(seriesData.length - 1, 1)) * usableWidth;
    const y = paddingTop + usableHeight - (d.kwh / (maxVal * 1.15)) * usableHeight;
    return { ...d, x, y, index: idx };
  });

  // Smooth bezier curve path
  const createSmoothPath = (pts) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return path;
  };

  const linePath = createSmoothPath(points);
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${svgHeight - paddingBottom} L ${points[0].x} ${svgHeight - paddingBottom} Z`
    : '';

  const periodLabels = {
    day: 'Theo Giờ (Ngày)',
    week: 'Theo Tuần',
    month: 'Theo Tháng',
    year: 'Theo Năm'
  };

  return (
    <Card className="p-6 animate-fade-in-up stagger-2 interactive-card">
      {/* Chart Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <Zap className="w-4 h-4 fill-blue-500 text-blue-500" />
            </div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Biểu Đồ Tiêu Thụ Điện Năng Theo Phòng & Toàn Trường
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tổng hợp điện năng tiêu thụ tất cả phòng học theo chu kỳ chọn lọc ({periodLabels[period]})
          </p>
        </div>

        {/* Period Selector Tabs & Replay Button */}
        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 bg-slate-100/90 rounded-xl border border-slate-200/60 shadow-xs">
            {[
              { id: 'day', label: 'Ngày' },
              { id: 'week', label: 'Tuần' },
              { id: 'month', label: 'Tháng' },
              { id: 'year', label: 'Năm' }
            ].map((p) => {
              const active = period === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setPeriod(p.id);
                    setHoveredPoint(null);
                    setAnimKey(prev => prev + 1);
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setAnimKey(prev => prev + 1)}
            title="Phát lại hiệu ứng vẽ đường"
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer border border-transparent hover:border-blue-100"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-3 gap-3 my-4">
        <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100/80">
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Tổng điện năng</span>
          <span className="text-base sm:text-lg font-black text-slate-900 font-mono">
            {Number(totalKWh).toLocaleString()} <span className="text-xs font-semibold text-slate-500">kWh</span>
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100/80">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Trung bình / mốc</span>
          <span className="text-base sm:text-lg font-black text-emerald-800 font-mono">
            {Number(avgVal).toLocaleString()} <span className="text-xs font-semibold text-slate-500">kWh</span>
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100/80">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Đỉnh tải cao nhất</span>
          <span className="text-base sm:text-lg font-black text-amber-900 font-mono">
            {Number(maxVal).toLocaleString()} <span className="text-xs font-semibold text-slate-500">kWh</span>
          </span>
        </div>
      </div>

      {/* SVG Line Chart */}
      <div className="relative mt-2" key={animKey}>
        <div className="w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-52 sm:h-56 select-none overflow-visible"
          >
            <defs>
              <linearGradient id="lineAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.38" />
                <stop offset="60%" stopColor="#60a5fa" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.0" />
              </linearGradient>

              <linearGradient id="lineStrokeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>

              <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#2563eb" floodOpacity="0.25" />
              </filter>
            </defs>

            {/* Background Horizontal Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const y = paddingTop + usableHeight * (1 - ratio);
              const val = (maxVal * 1.15 * ratio).toFixed(period === 'year' || period === 'month' ? 0 : 1);
              return (
                <g key={idx}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={svgWidth - paddingX}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 3}
                    textAnchor="end"
                    fontSize="9"
                    fill="#94a3b8"
                    fontFamily="monospace"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Smooth Gradient Area Fill */}
            {areaPath && (
              <path
                d={areaPath}
                fill="url(#lineAreaGradient)"
                className="chart-area-animate"
              />
            )}

            {/* Main Smooth Line with Draw Animation */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="url(#lineStrokeGradient)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#lineGlow)"
                className="chart-line-animate"
              />
            )}

            {/* Interactive Data Points and Labels */}
            {points.map((pt, idx) => {
              const isHovered = hoveredPoint?.index === idx;
              return (
                <g key={idx} className="cursor-pointer">
                  {/* Vertical Guide line on hover */}
                  {isHovered && (
                    <line
                      x1={pt.x}
                      y1={paddingTop}
                      x2={pt.x}
                      y2={svgHeight - paddingBottom}
                      stroke="#3b82f6"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                      opacity="0.8"
                    />
                  )}

                  {/* Outer glow ring on hover */}
                  {isHovered && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="9"
                      fill="#3b82f6"
                      fillOpacity="0.2"
                      className="animate-ping"
                    />
                  )}

                  {/* Dot Point */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 6 : 4}
                    fill={isHovered ? '#1d4ed8' : '#ffffff'}
                    stroke="#2563eb"
                    strokeWidth={isHovered ? 3 : 2.5}
                    className="transition-all duration-150"
                  />

                  {/* Invisible Hit Target for smooth mouse interaction */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="18"
                    fill="transparent"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />

                  {/* X-axis Label */}
                  <text
                    x={pt.x}
                    y={svgHeight - paddingBottom + 18}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight={isHovered ? 'bold' : 'normal'}
                    fill={isHovered ? '#1d4ed8' : '#64748b'}
                    className="transition-colors"
                  >
                    {pt.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hover Floating Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute pointer-events-none z-20 px-3 py-2 rounded-xl bg-slate-900/95 backdrop-blur-md text-white shadow-xl border border-slate-700/80 transition-all duration-150 -translate-x-1/2 -translate-y-full"
            style={{
              left: `${(hoveredPoint.x / svgWidth) * 100}%`,
              top: `${(hoveredPoint.y / svgHeight) * 100}%`,
              marginTop: '-12px'
            }}
          >
            <div className="flex items-center gap-1.5 text-[10px] text-blue-300 font-bold uppercase tracking-wider">
              <Clock className="w-3 h-3" />
              <span>{hoveredPoint.label}</span>
            </div>
            <div className="text-sm font-extrabold font-mono text-white mt-0.5">
              {hoveredPoint.kwh.toLocaleString()} <span className="text-xs font-normal text-slate-300">kWh</span>
            </div>
            {hoveredPoint.note && (
              <div className="text-[11px] text-slate-300 mt-1 max-w-[180px] leading-tight border-t border-slate-700/60 pt-1">
                {hoveredPoint.note}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chart Footer Indicator */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/60 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Điểm đang xem:</span>
          {hoveredPoint ? (
            <span className="font-medium text-slate-900">
              Mốc <strong className="font-mono text-blue-700">{hoveredPoint.label}</strong>: {hoveredPoint.kwh} kWh ({hoveredPoint.note || 'Hoạt động bình thường'})
            </span>
          ) : (
            <span className="text-slate-400 italic">Rê chuột vào các mốc trên đường để xem chi tiết tiêu thụ và sự kiện</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 font-medium text-emerald-600 shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Dữ liệu thời gian thực đồng bộ</span>
        </div>
      </div>
    </Card>
  );
}
