import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Wrench, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  DoorClosed, 
  Monitor, 
  User, 
  Calendar,
  MessageSquare,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { campusApi } from '../../services/api';
import { mockCampusData } from '../../data/mockData';

const STATUS_CONFIG = {
  Moi: { label: 'Mới tiếp nhận', variant: 'warning', icon: AlertTriangle },
  DangXuLy: { label: 'Đang xử lý', variant: 'primary', icon: Wrench },
  DaXuLy: { label: 'Đã hoàn tất', variant: 'success', icon: CheckCircle2 },
  TuChoi: { label: 'Từ chối', variant: 'danger', icon: XCircle }
};

export function TicketsView() {
  const [reports, setReports] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // Forms
  const [createForm, setCreateForm] = useState({
    ma_phong: 'A202',
    ma_tb: 'TB_ML_A202',
    mo_ta: '',
    muc_do: 'TrungBinh'
  });

  const [processForm, setProcessForm] = useState({
    trang_thai: 'DangXuLy',
    ghi_chu_admin: '',
    ma_tb: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [reps, rms, devs] = await Promise.all([
        campusApi.getAllReports(),
        campusApi.getAllRoomsList(),
        campusApi.getAllDevicesList()
      ]);
      setReports(reps?.length ? reps : mockCampusData.allReports);
      setRooms(rms?.length ? rms : mockCampusData.allRooms);
      setDevices(devs?.length ? devs : mockCampusData.allDevices);
    } catch {
      setReports(mockCampusData.allReports);
      setRooms(mockCampusData.allRooms);
      setDevices(mockCampusData.allDevices);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter
  const filteredReports = reports.filter(r => {
    const matchStatus = activeFilter === 'ALL' || r.trang_thai === activeFilter;
    const matchSearch = (r.mo_ta || '').toLowerCase().includes(search.toLowerCase()) ||
                        (r.ma_phong || '').toLowerCase().includes(search.toLowerCase()) ||
                        (r.ma_tb || '').toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  // KPI
  const totalReports = reports.length;
  const moiCount = reports.filter(r => r.trang_thai === 'Moi').length;
  const inProgressCount = reports.filter(r => r.trang_thai === 'DangXuLy').length;
  const resolvedCount = reports.filter(r => r.trang_thai === 'DaXuLy').length;

  // Mở modal xử lý
  const handleOpenProcess = (report) => {
    setSelectedReport(report);
    setProcessForm({
      trang_thai: report.trang_thai,
      ghi_chu_admin: report.ghi_chu_admin || '',
      ma_tb: report.ma_tb || ''
    });
    setIsProcessModalOpen(true);
  };

  // Cập nhật tiến độ xử lý
  const handleSaveProcess = async (e) => {
    e.preventDefault();
    const updatePayload = {
      trang_thai: processForm.trang_thai,
      ghi_chu_admin: processForm.ghi_chu_admin,
      ma_tb: processForm.ma_tb || undefined,
      ngay_xu_ly: processForm.trang_thai === 'DaXuLy' ? new Date().toISOString() : null
    };

    await campusApi.updateReport(selectedReport.ma_phieu, updatePayload);
    setReports(prev => prev.map(r => r.ma_phieu === selectedReport.ma_phieu ? { ...r, ...updatePayload } : r));
    setIsProcessModalOpen(false);
    alert('Đã cập nhật tiến độ xử lý phiếu báo hỏng thành công!');
  };

  // Tạo phiếu mới
  const handleCreateReport = async (e) => {
    e.preventDefault();
    if (!createForm.mo_ta) return alert('Vui lòng nhập mô tả sự cố hư hỏng!');

    const newRep = await campusApi.submitReport({
      ma_phong: createForm.ma_phong,
      ma_tb: createForm.ma_tb || undefined,
      mo_ta: createForm.mo_ta
    });

    setReports(prev => [newRep, ...prev]);
    setIsCreateModalOpen(false);
    alert('Đã gửi phiếu báo hỏng lên Ban Quản Lý CSVC thành công!');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Hệ thống Tiếp nhận PhieuBaoHong</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Quản Lý Sự Cố & Phiếu Báo Hỏng Thiết Bị</h1>
          <p className="text-xs text-slate-500 mt-1">
            Quy trình tiếp nhận phản ánh hư hỏng từ giảng viên/sinh viên và điều phối kỹ thuật viên xử lý kịp thời.
          </p>
        </div>

        <Button 
          variant="primary" 
          icon={Plus} 
          onClick={() => setIsCreateModalOpen(true)}
          className="text-xs shadow-md shadow-blue-500/20 active:scale-95"
        >
          Gửi Phiếu Báo Hỏng Mới
        </Button>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-white to-slate-50">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">Tổng số phiếu</p>
            <AlertTriangle className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalReports}</p>
          <span className="text-[10px] text-slate-400">Ghi nhận toàn trường</span>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-white to-amber-50/40">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">Mới tiếp nhận</p>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
          </div>
          <p className="text-2xl font-black text-amber-700 mt-2">{moiCount}</p>
          <span className="text-[10px] text-amber-600 font-medium">Chờ phân công kỹ thuật</span>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-white to-blue-50/40">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">Đang sửa chữa</p>
            <Wrench className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-700 mt-2">{inProgressCount}</p>
          <span className="text-[10px] text-blue-600 font-medium">Kỹ thuật viên đang xử lý</span>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-white to-emerald-50/40">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">Đã giải quyết xong</p>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-2">{resolvedCount}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Thiết bị hoạt động lại</span>
        </Card>
      </div>

      {/* 3. Filter tabs & Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'ALL', label: 'Tất cả phiếu' },
              { id: 'Moi', label: `Mới (${moiCount})` },
              { id: 'DangXuLy', label: `Đang xử lý (${inProgressCount})` },
              { id: 'DaXuLy', label: `Đã hoàn tất (${resolvedCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Tìm theo mô tả, phòng, mã thiết bị..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </Card>

      {/* 4. Ticket Cards List */}
      <div className="space-y-4">
        {filteredReports.map((report) => {
          const statusConf = STATUS_CONFIG[report.trang_thai] || STATUS_CONFIG.Moi;
          const StatusIcon = statusConf.icon;

          return (
            <Card key={report.ma_phieu} hover className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900">Phiếu #{report.ma_phieu}</span>
                  <Badge variant={statusConf.variant} size="sm">
                    <StatusIcon className="w-3 h-3" />
                    <span>{statusConf.label}</span>
                  </Badge>

                  {report.muc_do && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      report.muc_do === 'NghiemTrong' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      Mức độ: {report.muc_do === 'NghiemTrong' ? 'Nghiêm trọng' : 'Bình thường'}
                    </span>
                  )}

                  <span className="text-xs text-slate-400">
                    • Báo bởi: {report.nguoi_bao_ten || `Tài khoản #${report.ma_tk}`}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-800">{report.mo_ta}</h4>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1 font-bold text-blue-700">
                    <DoorClosed className="w-3.5 h-3.5" /> Phòng {report.ma_phong}
                  </span>

                  {report.ma_tb && (
                    <span className="flex items-center gap-1 font-mono text-slate-700 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                      <Monitor className="w-3.5 h-3.5 text-slate-400" /> {report.ten_tb ? `${report.ten_tb} (${report.ma_tb})` : report.ma_tb}
                    </span>
                  )}

                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Ngày gửi: {new Date(report.ngay_bao).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                {/* Admin notes */}
                {report.ghi_chu_admin && (
                  <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100 text-xs text-blue-900 mt-2">
                    <span className="font-bold block">Tiến độ kỹ thuật / Kết quả xử lý:</span>
                    <span>{report.ghi_chu_admin}</span>
                    {report.ngay_xu_ly && (
                      <span className="block text-[10px] text-blue-500 mt-0.5">
                        Hoàn thành lúc: {new Date(report.ngay_xu_ly).toLocaleDateString('vi-VN')}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Button for Admin */}
              <div className="self-end md:self-center shrink-0">
                <Button 
                  size="sm" 
                  variant="outline"
                  icon={Wrench}
                  onClick={() => handleOpenProcess(report)}
                  className="text-xs hover:border-blue-500 hover:text-blue-600"
                >
                  Cập Nhật Tiến Độ
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 5. Modal Cập nhật tiến độ xử lý (Admin) */}
      {isProcessModalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in-up">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-base text-slate-900">
                Xử Lý Phiếu #{selectedReport.ma_phieu}
              </h3>
              <button onClick={() => setIsProcessModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProcess} className="p-6 space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 text-xs space-y-1">
                <p className="font-bold text-slate-900">Phòng {selectedReport.ma_phong} - Sự cố:</p>
                <p className="text-slate-600">{selectedReport.mo_ta}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Cập nhật trạng thái xử lý</label>
                <select 
                  value={processForm.trang_thai}
                  onChange={(e) => setProcessForm(prev => ({ ...prev, trang_thai: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none font-bold"
                >
                  <option value="Moi">Mới tiếp nhận</option>
                  <option value="DangXuLy">Đang xử lý (Đã điều kỹ thuật)</option>
                  <option value="DaXuLy">Đã xử lý (Sửa chữa xong)</option>
                  <option value="TuChoi">Từ chối (Báo hỏng sai sự thật / Không lỗi)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mã thiết bị liên quan</label>
                <input 
                  type="text"
                  placeholder="Gán mã TB nếu lúc báo để trống..."
                  value={processForm.ma_tb}
                  onChange={(e) => setProcessForm(prev => ({ ...prev, ma_tb: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Ghi chú của Quản trị viên / Kỹ thuật viên *</label>
                <textarea 
                  required
                  rows="3"
                  placeholder="Ghi rõ hành động (Ví dụ: Đã thay tụ máy lạnh, bơm gas r410a, kiểm tra máy hoạt động bình thường...)"
                  value={processForm.ghi_chu_admin}
                  onChange={(e) => setProcessForm(prev => ({ ...prev, ghi_chu_admin: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsProcessModalOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" variant="primary">
                  Cập Nhật Tiến Độ
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Modal Tạo phiếu báo hỏng mới */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in-up">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-base text-slate-900">Gửi Phiếu Báo Hỏng Thiết Bị</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phòng xảy ra sự cố *</label>
                  <select 
                    value={createForm.ma_phong}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, ma_phong: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none font-bold"
                  >
                    {rooms.map(r => (
                      <option key={r.ma_phong} value={r.ma_phong}>Phòng {r.ma_phong}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mã thiết bị (nếu biết)</label>
                  <input 
                    type="text"
                    placeholder="Ví dụ: TB_ML_A202"
                    value={createForm.ma_tb}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, ma_tb: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mô tả chi tiết hư hỏng *</label>
                <textarea 
                  required
                  rows="3"
                  placeholder="Ghi rõ hiện tượng (Ví dụ: Máy chiếu nhấp nháy đèn đỏ, điều hòa không lạnh, rò điện...)"
                  value={createForm.mo_ta}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, mo_ta: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" variant="primary">
                  Gửi Báo Hỏng
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
