import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { 
  Building, 
  Layers, 
  Users, 
  Zap,
  Info,
  CalendarCheck,
  AlertTriangle,
  Wrench,
  Search,
  LayoutGrid,
  Table as TableIcon,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export function FloorPlanViewer({ rooms = [], selectedRoomId = 'A.101', onSelectRoom }) {
  const [selectedFloor, setSelectedFloor] = useState(1); // 1 | 2 | 3 | 4
  const [displayMode, setDisplayMode] = useState('diagram'); // 'diagram' (Sơ đồ mặt bằng) | 'table' (Bảng danh sách)
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'OCCUPIED' | 'AVAILABLE' | 'ISSUE'

  // Danh sách các phòng thuộc tầng đang chọn
  const floorRooms = useMemo(() => {
    return rooms.filter(r => {
      const roomFloor = r.tang !== undefined ? Number(r.tang) : Number(r.ma_phong?.replace(/[^0-9]/g, '').charAt(0) || 1);
      return roomFloor === Number(selectedFloor);
    });
  }, [rooms, selectedFloor]);

  // Phân chia theo 4 Khu A, B, C, D cho sơ đồ mặt bằng
  const wingRooms = useMemo(() => {
    const wings = { A: [], B: [], C: [], D: [] };
    floorRooms.forEach(room => {
      const wing = room.toa || room.ma_phong?.charAt(0)?.toUpperCase();
      if (wings[wing]) {
        wings[wing].push(room);
      }
    });

    // Sắp xếp mã phòng theo thứ tự tăng dần
    Object.keys(wings).forEach(w => {
      wings[w].sort((a, b) => (a.ma_phong || '').localeCompare(b.ma_phong || ''));
    });
    return wings;
  }, [floorRooms]);

  // Dữ liệu lọc cho chế độ Bảng danh sách hoặc tìm kiếm
  const filteredRooms = useMemo(() => {
    return floorRooms.filter(r => {
      const isOcc = r.trang_thai === 'Đang dùng' || r.hasScheduleToday;
      const isIss = r.trang_thai === 'Bảo trì' || r.hasIssue || r.isWasteAlert;

      if (statusFilter === 'OCCUPIED' && !isOcc) return false;
      if (statusFilter === 'AVAILABLE' && (isOcc || isIss)) return false;
      if (statusFilter === 'ISSUE' && !isIss) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const id = (r.ma_phong || r.id || '').toLowerCase();
        const ten = (r.ten_phong || '').toLowerCase();
        const loai = (r.loai_phong || r.type || '').toLowerCase();
        const mon = (r.currentSchedule?.ten_mon_hoc || '').toLowerCase();
        if (!id.includes(q) && !ten.includes(q) && !loai.includes(q) && !mon.includes(q)) return false;
      }

      return true;
    });
  }, [floorRooms, statusFilter, searchTerm]);

  // Thống kê nhanh của tầng
  const stats = useMemo(() => {
    let occupied = 0;
    let available = 0;
    let issue = 0;
    floorRooms.forEach(r => {
      const isOcc = r.trang_thai === 'Đang dùng' || r.hasScheduleToday;
      const isIss = r.trang_thai === 'Bảo trì' || r.hasIssue || r.isWasteAlert;
      if (isOcc) occupied++;
      else if (isIss) issue++;
      else available++;
    });
    return { occupied, available, issue, total: floorRooms.length };
  }, [floorRooms]);

  return (
    <Card className="p-6 animate-fade-in-up stagger-3 flex flex-col justify-between shadow-xs">
      <div>
        {/* Top Header & Floor Selector Tabs & Display Switcher bố cục chuẩn như ảnh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          {/* Cụm Tiêu Đề bên trái */}
          <div className="max-w-md">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
                Sơ đồ Mặt Bằng & Trạng Thái Phòng Học
              </h2>
              <Badge variant="primary" size="sm" className="font-bold">Cơ sở CS1</Badge>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full font-mono">
                Tầng {selectedFloor} • {floorRooms.length} phòng
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Bố trí kiến trúc khuôn viên 4 cánh (Khu A, B, C, D) quanh giếng trời trung tâm
            </p>
          </div>

          {/* Cụm Điều Khiển bên phải: 2 thanh xếp chồng gọn gàng hoặc liền kề như trong ảnh */}
          <div className="flex flex-col items-end gap-2.5 shrink-0">
            {/* Thanh chọn 4 Tầng */}
            <div className="inline-flex p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-2xs">
              {[1, 2, 3, 4].map(floorNum => {
                const isActive = selectedFloor === floorNum;
                return (
                  <button
                    key={floorNum}
                    onClick={() => setSelectedFloor(floorNum)}
                    className={`px-4 py-1.5 font-bold rounded-xl transition-all duration-150 cursor-pointer text-xs ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    Tầng {floorNum}
                  </button>
                );
              })}
            </div>

            {/* Thanh chuyển đổi Dạng Sơ đồ / Bảng Danh sách */}
            <div className="inline-flex p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-2xs">
              <button
                onClick={() => setDisplayMode('diagram')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 font-bold rounded-xl transition-all cursor-pointer text-xs ${
                  displayMode === 'diagram'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
                title="Hiển thị theo sơ đồ bố trí kiến trúc"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Dạng Sơ đồ</span>
              </button>
              <button
                onClick={() => setDisplayMode('table')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 font-bold rounded-xl transition-all cursor-pointer text-xs ${
                  displayMode === 'table'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
                title="Hiển thị dưới dạng bảng danh sách chi tiết"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Bảng Danh sách</span>
              </button>
            </div>
          </div>
        </div>

        {/* Toolbar: Quick Search & Status Filters */}
        <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm nhanh mã phòng, môn học..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 transition-all font-medium"
            />
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả ({floorRooms.length})
            </button>
            <button
              onClick={() => setStatusFilter('OCCUPIED')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'OCCUPIED'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Đang có lớp ({stats.occupied})
            </button>
            <button
              onClick={() => setStatusFilter('AVAILABLE')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'AVAILABLE'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-slate-300"></span>
              Sẵn sàng ({stats.available})
            </button>
            <button
              onClick={() => setStatusFilter('ISSUE')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'ISSUE'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Cảnh báo / Bảo trì ({stats.issue})
            </button>
          </div>
        </div>

        {/* ===================== VIEW MODE 1: SƠ ĐỒ MẶT BẰNG KIẾN TRÚC ===================== */}
        {displayMode === 'diagram' ? (
          <div className="mt-4 p-3 sm:p-5 bg-slate-50/90 rounded-2xl border border-slate-200/90 bg-grid-pattern relative">
            <div className="flex items-center justify-between pb-3 text-xs border-b border-slate-200/60 mb-4">
              <span className="font-extrabold tracking-wider text-slate-700 uppercase text-xs">
                SƠ ĐỒ CHI TIẾT — TẦNG {selectedFloor}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Info className="w-3.5 h-3.5 text-blue-500" />
                <span>Nhấp vào bất kỳ phòng nào để xem chi tiết bên phải</span>
              </div>
            </div>

            {/* SƠ ĐỒ HÌNH CHỮ U / HÌNH VUÔNG 4 KHU (C TRÊN, B TRÁI, D PHẢI, A DƯỚI) */}
            <div className="space-y-4">
              {/* 1. KHU C (Phía Trên / Phía Bắc) */}
              <div className="p-3 bg-white/95 rounded-xl border border-blue-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span className="font-extrabold text-xs text-blue-900 tracking-wide uppercase">KHU C</span>
                    <span className="text-[10px] text-slate-400 font-mono">({wingRooms.C.length} phòng)</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 italic">Thư viện & Dãy phòng học Bắc</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                  {wingRooms.C.map(room => (
                    <BlueprintRoomItem
                      key={room.ma_phong}
                      room={room}
                      isSelected={(room.ma_phong === selectedRoomId) || (room.ma_phong.replace('.', '') === selectedRoomId.replace('.', ''))}
                      onClick={() => onSelectRoom?.(room.ma_phong)}
                    />
                  ))}
                  {wingRooms.C.length === 0 && (
                    <span className="text-xs text-slate-400 italic py-2">Chưa có dữ liệu phòng Khu C</span>
                  )}
                </div>
              </div>

              {/* 2. GIỮA: KHU B (Trái) — KHUÔN VIÊN GIẾNG TRỜI / SÂN TRONG — KHU D (Phải) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
                {/* Cánh Trái: KHU B */}
                <div className="md:col-span-4 p-3 bg-white/95 rounded-xl border border-blue-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      <span className="font-extrabold text-xs text-blue-900 tracking-wide uppercase">KHU B</span>
                      <span className="text-[10px] text-slate-400 font-mono">({wingRooms.B.length} phòng)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {wingRooms.B.map(room => (
                        <BlueprintRoomItem
                          key={room.ma_phong}
                          room={room}
                          isSelected={(room.ma_phong === selectedRoomId) || (room.ma_phong.replace('.', '') === selectedRoomId.replace('.', ''))}
                          onClick={() => onSelectRoom?.(room.ma_phong)}
                        />
                      ))}
                      {wingRooms.B.length === 0 && (
                        <span className="text-xs text-slate-400 italic py-2">Trống</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* SÂN TRUNG TÂM / GIẾNG TRỜI (COURTYARD) */}
                <div className="md:col-span-4 p-4 rounded-xl bg-gradient-to-b from-blue-50/50 via-slate-100/60 to-blue-50/50 border border-dashed border-slate-300 flex flex-col items-center justify-center text-center select-none min-h-[140px]">
                  <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">SÂN TRONG</span>
                  <h3 className="text-2xl sm:text-3xl font-black text-rose-600 tracking-tight my-1">
                    TẦNG {selectedFloor}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    <span>Hệ thống Campus Thông Minh</span>
                  </div>
                </div>

                {/* Cánh Phải: KHU D */}
                <div className="md:col-span-4 p-3 bg-white/95 rounded-xl border border-blue-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      <span className="font-extrabold text-xs text-blue-900 tracking-wide uppercase">KHU D</span>
                      <span className="text-[10px] text-slate-400 font-mono">({wingRooms.D.length} phòng)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {wingRooms.D.map(room => (
                        <BlueprintRoomItem
                          key={room.ma_phong}
                          room={room}
                          isSelected={(room.ma_phong === selectedRoomId) || (room.ma_phong.replace('.', '') === selectedRoomId.replace('.', ''))}
                          onClick={() => onSelectRoom?.(room.ma_phong)}
                        />
                      ))}
                      {wingRooms.D.length === 0 && (
                        <span className="text-xs text-slate-400 italic py-2">Trống</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. KHU A & SẢNH CHÍNH (Phía Dưới / Phía Nam) */}
              <div className="p-3 bg-white/95 rounded-xl border border-blue-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span className="font-extrabold text-xs text-blue-900 tracking-wide uppercase">KHU A</span>
                    <span className="text-[10px] text-slate-400 font-mono">({wingRooms.A.length} phòng)</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 italic">Dãy phòng học Nam & Sảnh đón tiếp</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                  {wingRooms.A.map(room => (
                    <BlueprintRoomItem
                      key={room.ma_phong}
                      room={room}
                      isSelected={(room.ma_phong === selectedRoomId) || (room.ma_phong.replace('.', '') === selectedRoomId.replace('.', ''))}
                      onClick={() => onSelectRoom?.(room.ma_phong)}
                    />
                  ))}
                  {wingRooms.A.length === 0 && (
                    <span className="text-xs text-slate-400 italic py-2">Chưa có dữ liệu phòng Khu A</span>
                  )}
                </div>

                {/* Cầu thang & Sảnh chính vòm cong */}
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-center">
                  <div className="px-6 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-bold text-slate-600 tracking-wider uppercase">
                    CỬA VÀO & SẢNH CHÍNH KHUÔN VIÊN
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ===================== VIEW MODE 2: BẢNG DANH SÁCH CHI TIẾT CÁC PHÒNG ===================== */
          <div className="mt-4 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-3 w-20 whitespace-nowrap">Mã phòng</th>
                    <th className="py-3 px-3">Tên phòng / Loại</th>
                    <th className="py-3 px-3 w-24 whitespace-nowrap">Khu vực</th>
                    <th className="py-3 px-3 w-28 whitespace-nowrap">Trạng thái</th>
                    <th className="py-3 px-3">Lịch học hiện tại</th>
                    <th className="py-3 px-3 w-20 whitespace-nowrap">Sức chứa</th>
                    <th className="py-3 px-3 text-right w-24 whitespace-nowrap">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredRooms.map(room => {
                    const roomId = room.ma_phong || room.id;
                    const isSelected = (roomId === selectedRoomId) || (roomId.replace('.', '') === selectedRoomId.replace('.', ''));
                    const isOcc = room.trang_thai === 'Đang dùng' || room.hasScheduleToday;
                    const isIss = room.trang_thai === 'Bảo trì' || room.hasIssue;
                    const isWaste = room.isWasteAlert;

                    return (
                      <tr 
                        key={roomId} 
                        onClick={() => onSelectRoom?.(roomId)}
                        className={`hover:bg-blue-50/40 transition-colors cursor-pointer ${
                          isSelected ? 'bg-blue-50/80 font-semibold' : ''
                        }`}
                      >
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className={`font-mono font-black ${isSelected ? 'text-blue-700' : 'text-slate-900'}`}>
                            {roomId}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{room.ten_phong || `Phòng ${roomId}`}</div>
                          <div className="text-[11px] text-slate-400">{room.loai_phong || 'Phòng học'}</div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded whitespace-nowrap inline-block">
                            Khu {room.toa || roomId.charAt(0)}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          {isWaste ? (
                            <Badge variant="warning" size="sm" className="whitespace-nowrap">Cần lưu ý</Badge>
                          ) : isIss ? (
                            <Badge variant="danger" size="sm" className="whitespace-nowrap">Bảo trì</Badge>
                          ) : isOcc ? (
                            <Badge variant="success" size="sm" className="whitespace-nowrap">Đang có lớp</Badge>
                          ) : (
                            <Badge variant="neutral" size="sm" className="whitespace-nowrap">Phòng trống</Badge>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-700">
                          {room.currentSchedule ? (
                            <div className="truncate max-w-[200px] font-medium text-emerald-800">
                              {room.currentSchedule.ten_mon_hoc}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Trống lịch</span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap">
                          {room.suc_chua || 40} chỗ
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectRoom?.(roomId);
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 cursor-pointer whitespace-nowrap"
                          >
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredRooms.length === 0 && (
                <div className="py-12 text-center text-sm text-slate-400">
                  Không tìm thấy phòng nào phù hợp với bộ lọc trên tầng này.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Blueprint Legend Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-4 border-t border-slate-100 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600 font-medium">Đang có lớp ({stats.occupied})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
            <span className="text-slate-600 font-medium">Phòng trống / Sẵn sàng ({stats.available})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-slate-600 font-medium">Cảnh báo / Bảo trì ({stats.issue})</span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="text-slate-500">Tổng sức chứa tầng {selectedFloor}:</span>
          <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
            {floorRooms.reduce((acc, r) => acc + (r.suc_chua || 40), 0)} chỗ
          </span>
        </div>
      </div>
    </Card>
  );
}

/**
 * Thẻ phòng kiến trúc trên bản đồ mặt bằng Blueprint
 */
function BlueprintRoomItem({ room, isSelected, onClick }) {
  const roomId = room.ma_phong || room.id;
  const isOcc = room.trang_thai === 'Đang dùng' || room.hasScheduleToday;
  const isIss = room.trang_thai === 'Bảo trì' || room.hasIssue;
  const isWaste = room.isWasteAlert;

  return (
    <div
      onClick={onClick}
      className={`p-2 rounded-lg border text-left transition-all duration-150 cursor-pointer select-none relative ${
        isSelected
          ? 'bg-blue-50/95 border-blue-600 ring-2 ring-blue-500/30 shadow-xs'
          : isWaste
          ? 'bg-amber-50/70 border-amber-300 hover:border-amber-400'
          : isIss
          ? 'bg-rose-50/60 border-rose-200 hover:border-rose-300'
          : isOcc
          ? 'bg-emerald-50/60 border-emerald-200 hover:border-emerald-400'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`font-mono font-black text-xs ${isSelected ? 'text-blue-700' : 'text-slate-900'}`}>
          {roomId}
        </span>
        <span className={`w-2 h-2 rounded-full ${
          isWaste ? 'bg-amber-500 animate-pulse' : isIss ? 'bg-rose-500' : isOcc ? 'bg-emerald-500' : 'bg-slate-300'
        }`} />
      </div>

      <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5 leading-tight">
        {room.ten_phong?.replace(`Phòng học ${roomId}`, 'PHÒNG HỌC') || room.loai_phong || 'Phòng học'}
      </p>

      {/* Trạng thái lớp hoặc trống */}
      <div className="mt-1 text-[9px] font-semibold truncate">
        {room.currentSchedule ? (
          <span className="text-emerald-700 truncate block">
            {room.currentSchedule.ten_mon_hoc}
          </span>
        ) : isWaste ? (
          <span className="text-amber-700 font-bold">Lãng phí ({room.kwh} kWh)</span>
        ) : isIss ? (
          <span className="text-rose-600 font-bold">Bảo trì</span>
        ) : (
          <span className="text-slate-400 font-normal">Trống</span>
        )}
      </div>
    </div>
  );
}
