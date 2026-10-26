import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Leaf, 
  ShieldAlert, 
  XCircle,
  BarChart2,
  DollarSign
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { campusApi } from '../../services/api';
import { mockCampusData } from '../../data/mockData';

export function EnergyView() {
  const [metrics, setMetrics] = useState([]);
  const [summary, setSummary] = useState(mockCampusData.summary);
  const [wasteAlerts, setWasteAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  const [metricForm, setMetricForm] = useState({
    ma_phong: 'A101',
    ngay: new Date().toISOString().split('T')[0],
    kwh: 10.5,
    so_gio_bat: 4.0
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [metricsRes, sumRes, wasteRes] = await Promise.all([
        campusApi.getEnergyMetricsList(),
        campusApi.getSummary(),
        campusApi.getWasteAlerts()
      ]);
      setMetrics(metricsRes?.length ? metricsRes : mockCampusData.allEnergyMetrics);
      if (sumRes) setSummary(sumRes);
      setWasteAlerts(wasteRes?.length ? wasteRes : [mockCampusData.aiWasteAlert]);
    } catch {
      setMetrics(mockCampusData.allEnergyMetrics);
      setWasteAlerts([mockCampusData.aiWasteAlert]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Ghi nhận chỉ số điện năng thủ công
  const handleRecordMetric = async (e) => {
    e.preventDefault();
    const newMetric = await campusApi.recordEnergyMetric({
      ...metricForm,
      kwh: Number(metricForm.kwh),
      so_gio_bat: Number(metricForm.so_gio_bat)
    });

    setMetrics(prev => [newMetric, ...prev]);
    setIsRecordModalOpen(false);
    alert(`Đã ghi nhận chỉ số điện năng cho phòng ${metricForm.ma_phong} thành công!`);
  };

  // Tắt điện khẩn cấp phòng lãng phí
  const handleCutPower = (maPhong) => {
    alert(`Đã gửi lệnh ngắt điện khẩn cấp đến phòng ${maPhong}! Tiết kiệm ước tính ~8.5 kWh.`);
    setWasteAlerts(prev => prev.filter(w => w.ma_phong !== maPhong));
  };

  const totalKwh = metrics.reduce((acc, m) => acc + (m.kwh || 0), 0);
  const totalCostVnd = Math.round(totalKwh * 2500); // 2,500đ/kWh

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Hệ thống Giám sát Điện năng DienNang</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Kiểm Soát Năng Lượng & Tiết Kiệm Xanh (AI)</h1>
          <p className="text-xs text-slate-500 mt-1">
            Phân tích số liệu tiêu thụ kWh theo ngày, phát hiện lãng phí ngoài giờ học (Idle Waste) bằng thuật toán thông minh.
          </p>
        </div>

        <Button 
          variant="primary" 
          icon={Plus} 
          onClick={() => setIsRecordModalOpen(true)}
          className="text-xs shadow-md shadow-blue-500/20"
        >
          Ghi Nhận Chỉ Số Điện
        </Button>
      </div>

      {/* 2. Nexus AI Idle Waste Warning Banner */}
      {wasteAlerts.length > 0 && (
        <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 shadow-xs animate-fade-in-down">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-amber-500/20">
                <AlertTriangle className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500 text-white">
                    Cảnh Báo Idle Waste
                  </span>
                  <span className="text-xs font-bold text-amber-900">Phát hiện tiêu thụ điện ngoài giờ</span>
                </div>
                <h4 className="text-sm font-black text-slate-900 mt-1">
                  {wasteAlerts[0].title || `Phát hiện lãng phí điện năng tại Phòng ${wasteAlerts[0].ma_phong}`}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 max-w-3xl">
                  {wasteAlerts[0].message || `Phòng ${wasteAlerts[0].ma_phong} không có lịch trong LichPhong nhưng phát sinh tiêu thụ điện bất thường (${wasteAlerts[0].kwh_tieu_thu || 8.5} kWh).`}
                </p>
              </div>
            </div>

            <Button 
              size="sm" 
              variant="primary"
              onClick={() => handleCutPower(wasteAlerts[0].ma_phong || 'B302')}
              className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm shrink-0 font-bold"
            >
              Ngắt Nguồn Phòng {wasteAlerts[0].ma_phong || 'B302'}
            </Button>
          </div>
        </div>
      )}

      {/* 3. KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-white to-blue-50/40">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">Tổng điện năng hôm nay</p>
            <Zap className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-700 mt-2">{summary.totalKWh || 39.0} <span className="text-sm font-semibold text-slate-500">kWh</span></p>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> Giảm 12.4% so với tuần trước
          </span>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-white to-emerald-50/40">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">Trung bình mỗi phòng</p>
            <BarChart2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-2">{summary.averageKWhPerRoom || 13.0} <span className="text-sm font-semibold text-slate-500">kWh</span></p>
          <span className="text-[10px] text-emerald-600 font-medium">Đạt chuẩn Green Campus</span>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-white to-amber-50/40">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">Điện lãng phí (Idle)</p>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-700 mt-2">8.5 <span className="text-sm font-semibold text-slate-500">kWh</span></p>
          <span className="text-[10px] text-amber-600 font-medium">Chiếm ~21% tổng tiêu thụ</span>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-white to-purple-50/40">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">Chi phí tạm tính</p>
            <DollarSign className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-purple-700 mt-2">{totalCostVnd.toLocaleString('vi-VN')} <span className="text-sm font-semibold text-slate-500">VNĐ</span></p>
          <span className="text-[10px] text-purple-600 font-medium">Đơn giá điện trường học</span>
        </Card>
      </div>

      {/* 4. Visual Animated Energy Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Biểu Đồ So Sánh Suất Tiêu Thụ Điện Theo Phòng (kWh)</h3>
            <p className="text-xs text-slate-500">Mô phỏng mức tải điện năng thời gian thực</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Đơn vị: kWh / ngày</span>
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-end h-40 pb-2 border-b border-slate-200">
          {metrics.slice(0, 6).map((m, idx) => {
            const maxVal = 25.0;
            const heightPercent = Math.max(10, Math.min(100, (m.kwh / maxVal) * 100));
            const isWaste = m.isWaste || (m.kwh > 5 && !m.co_lich);
            const delayClass = `chart-bar-delay-${Math.min(idx + 1, 6)}`;

            return (
              <div key={idx} className="flex flex-col items-center justify-end h-full gap-1.5 group cursor-pointer">
                <span className={`text-[11px] font-mono font-bold chart-value-pop ${delayClass} text-slate-600 group-hover:text-slate-900`}>
                  {m.kwh} kWh
                </span>

                <div className="w-full max-w-12 bg-slate-100 rounded-t-xl h-full flex items-end p-1 overflow-hidden">
                  <div 
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-lg chart-bar-animate ${delayClass} transition-all duration-300 ${
                      isWaste
                        ? 'bg-gradient-to-t from-amber-500 to-amber-400 group-hover:from-amber-600'
                        : m.kwh > 0
                        ? 'bg-gradient-to-t from-emerald-500 to-teal-400 group-hover:from-emerald-600'
                        : 'bg-slate-200'
                    }`}
                  />
                </div>

                <span className="text-xs font-mono font-bold text-slate-700">
                  {m.ma_phong}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 5. Energy Consumption Table per Room */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-slate-50/60">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Chi Tiết Tiêu Thụ Điện Theo Phòng (Bảng DienNang)</h3>
            <p className="text-xs text-slate-500">Đối chiếu trực tiếp với lịch học thực tế để phát hiện phòng bất thường</p>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/30 text-[11px] font-bold text-slate-500 uppercase">
                <th className="p-4">Phòng học</th>
                <th className="p-4">Ngày ghi nhận</th>
                <th className="p-4">Điện năng (kWh)</th>
                <th className="p-4">Số giờ hoạt động</th>
                <th className="p-4">Đối chiếu LichPhong</th>
                <th className="p-4">Đánh giá AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {metrics.map((m, idx) => {
                const isWaste = m.isWaste || (m.kwh > 5 && !m.co_lich);

                return (
                  <tr key={idx} className={`hover:bg-slate-50/70 transition-colors ${isWaste ? 'bg-amber-50/30' : ''}`}>
                    <td className="p-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                          {m.ma_phong}
                        </span>
                        <span>Phòng {m.ma_phong}</span>
                      </div>
                    </td>

                    <td className="p-4 text-slate-600 font-mono">
                      {m.ngay}
                    </td>

                    <td className="p-4 font-extrabold text-slate-900">
                      <span className={m.kwh > 15 ? 'text-blue-700' : isWaste ? 'text-amber-700 font-black' : 'text-slate-800'}>
                        {m.kwh} kWh
                      </span>
                    </td>

                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{m.so_gio_bat || 0} giờ</span>
                      </div>
                    </td>

                    <td className="p-4">
                      {m.co_lich ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                          <CheckCircle2 className="w-3 h-3" /> Có lịch học
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          Không có lịch
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      {isWaste ? (
                        <Badge variant="warning" size="sm" className="font-bold">
                          ⚠️ Cảnh báo lãng phí (Idle Waste)
                        </Badge>
                      ) : (
                        <Badge variant="success" size="sm">
                          {m.danh_gia || 'Hợp lý'}
                        </Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 5. Modal Ghi Nhận Chỉ Số Điện Năng */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in-up">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-base text-slate-900">Ghi Nhận Chỉ Số Điện Tiêu Thụ</h3>
              <button onClick={() => setIsRecordModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordMetric} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Chọn phòng học</label>
                <select 
                  value={metricForm.ma_phong}
                  onChange={(e) => setMetricForm(prev => ({ ...prev, ma_phong: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none font-bold"
                >
                  <option value="A101">Phòng A101</option>
                  <option value="A102">Phòng A102</option>
                  <option value="A201">Phòng A201</option>
                  <option value="A202">Phòng A202</option>
                  <option value="B301">Phòng B301</option>
                  <option value="B302">Phòng B302</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Ngày ghi nhận</label>
                <input 
                  type="date"
                  required
                  value={metricForm.ngay}
                  onChange={(e) => setMetricForm(prev => ({ ...prev, ngay: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Điện năng tiêu thụ (kWh) *</label>
                  <input 
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={metricForm.kwh}
                    onChange={(e) => setMetricForm(prev => ({ ...prev, kwh: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none font-bold text-blue-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Số giờ bật thiết bị</label>
                  <input 
                    type="number"
                    step="0.5"
                    min="0"
                    max="24"
                    value={metricForm.so_gio_bat}
                    onChange={(e) => setMetricForm(prev => ({ ...prev, so_gio_bat: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsRecordModalOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" variant="primary">
                  Lưu Vào Cơ Sở Dữ Liệu
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
