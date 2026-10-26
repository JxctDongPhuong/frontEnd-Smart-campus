/**
 * Mock data đồng bộ chuẩn 100% với Backend Database Schema (seed_data.py)
 * Loại bỏ toàn bộ các trường không có trong backend như cảm biến AQI, độ ẩm, nhiệt độ giả, khóa RFID.
 */
export const mockCampusData = {
  // Thống kê tổng quan từ Backend metrics/summary & rooms
  summary: {
    totalRooms: 6,
    roomsOccupied: 2,
    roomsAvailable: 4,
    totalKWh: 39.0,
    averageKWhPerRoom: 13.0,
    activeReports: 1, // 1 phiếu báo hỏng tại A202
    wasteAlertsCount: 1, // 1 phòng B302 lãng phí điện
    systemStatus: 'Ổn định'
  },

  // Cảnh báo lãng phí điện năng (Idle Waste) từ Backend /api/metrics/waste-alerts
  aiWasteAlert: {
    id: 'waste-b302',
    ma_phong: 'B302',
    title: 'Phát hiện lãng phí điện năng tại Phòng B302',
    message: 'Phòng B302 không có lịch học hôm nay nhưng phát sinh tiêu thụ 8.5 kWh (6.0 giờ bật). Nghi vấn quên tắt thiết bị làm mát.',
    kwh_tieu_thu: 8.5,
    muc_do: 'Trung bình',
    actionText: 'Tắt thiết bị B302',
    canh_bao: 'Idle Waste: Tiêu thụ điện bất thường ngoài lịch học'
  },

  // Danh sách phòng học thực tế từ Backend (Bảng Phong & LichPhong) theo sơ đồ kiến trúc 4 khu A, B, C, D qua 4 tầng
  floorRooms: [
    // TẦNG 1 (KHU A, B, C, D)
    { ma_phong: 'A.101', ten_phong: 'Phòng học A.101', ma_cs: 'CS1', toa: 'A', tang: 1, loai_phong: 'Phòng lý thuyết', suc_chua: 50, trang_thai: 'Đang dùng', hasScheduleToday: true, currentSchedule: { ca: 1, ten_mon_hoc: 'Lập trình Python Nâng Cao', giang_vien: 'ThS. Nguyễn Văn A', lop: 'CNTT-K15', thoi_gian: '07:30 - 11:30' }, kwh: 12.5 },
    { ma_phong: 'A.102', ten_phong: 'Phòng học A.102', ma_cs: 'CS1', toa: 'A', tang: 1, loai_phong: 'Phòng lý thuyết', suc_chua: 55, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },
    { ma_phong: 'A.103', ten_phong: 'Phòng học A.103', ma_cs: 'CS1', toa: 'A', tang: 1, loai_phong: 'Phòng lý thuyết', suc_chua: 50, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },
    { ma_phong: 'A.105', ten_phong: 'Thư quán Trung tâm Học liệu', ma_cs: 'CS1', toa: 'A', tang: 1, loai_phong: 'Thư quán', suc_chua: 40, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 3.5 },
    { ma_phong: 'A.106', ten_phong: 'Phòng học A.106', ma_cs: 'CS1', toa: 'A', tang: 1, loai_phong: 'Phòng lý thuyết', suc_chua: 45, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },
    { ma_phong: 'A.107', ten_phong: 'Phòng học A.107', ma_cs: 'CS1', toa: 'A', tang: 1, loai_phong: 'Phòng lý thuyết', suc_chua: 50, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },
    { ma_phong: 'A.108', ten_phong: 'Kho sách TTĐTTX', ma_cs: 'CS1', toa: 'A', tang: 1, loai_phong: 'Kho sách', suc_chua: 10, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 1.2 },

    { ma_phong: 'B.101', ten_phong: 'Phòng học B.101', ma_cs: 'CS1', toa: 'B', tang: 1, loai_phong: 'Phòng học', suc_chua: 50, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },
    { ma_phong: 'B.102', ten_phong: 'Phòng học B.102', ma_cs: 'CS1', toa: 'B', tang: 1, loai_phong: 'Phòng học', suc_chua: 50, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },
    { ma_phong: 'B.103', ten_phong: 'Phòng học B.103', ma_cs: 'CS1', toa: 'B', tang: 1, loai_phong: 'Phòng học', suc_chua: 45, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },
    { ma_phong: 'B.104', ten_phong: 'Phòng học B.104', ma_cs: 'CS1', toa: 'B', tang: 1, loai_phong: 'Phòng học', suc_chua: 50, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },

    { ma_phong: 'C.101', ten_phong: 'Phòng học C.101', ma_cs: 'CS1', toa: 'C', tang: 1, loai_phong: 'Phòng học', suc_chua: 60, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },
    { ma_phong: 'C.102', ten_phong: 'Phòng học C.102', ma_cs: 'CS1', toa: 'C', tang: 1, loai_phong: 'Phòng học', suc_chua: 60, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },
    { ma_phong: 'C.107', ten_phong: 'Thư viện Trung tâm', ma_cs: 'CS1', toa: 'C', tang: 1, loai_phong: 'Thư viện', suc_chua: 200, trang_thai: 'Đang dùng', hasScheduleToday: true, currentSchedule: { ca: 1, ten_mon_hoc: 'Không gian tự học & đọc sách', giang_vien: 'Ban Quản trị Thư viện', lop: 'Toàn trường', thoi_gian: '07:00 - 21:00' }, kwh: 24.5 },
    { ma_phong: 'C.108', ten_phong: 'Phòng học C.108', ma_cs: 'CS1', toa: 'C', tang: 1, loai_phong: 'Phòng học', suc_chua: 50, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },
    { ma_phong: 'C.109', ten_phong: 'Phòng học C.109', ma_cs: 'CS1', toa: 'C', tang: 1, loai_phong: 'Phòng học', suc_chua: 50, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },

    { ma_phong: 'D.101', ten_phong: 'Phòng học D.101', ma_cs: 'CS1', toa: 'D', tang: 1, loai_phong: 'Phòng học', suc_chua: 50, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },
    { ma_phong: 'D.102', ten_phong: 'Phòng học D.102', ma_cs: 'CS1', toa: 'D', tang: 1, loai_phong: 'Phòng học', suc_chua: 50, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },
    { ma_phong: 'D.103', ten_phong: 'Phòng học D.103', ma_cs: 'CS1', toa: 'D', tang: 1, loai_phong: 'Phòng học', suc_chua: 45, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },
    { ma_phong: 'D.104', ten_phong: 'Phòng học D.104', ma_cs: 'CS1', toa: 'D', tang: 1, loai_phong: 'Phòng học', suc_chua: 50, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },

    // TẦNG 2 (KHU A, B, C, D)
    { ma_phong: 'A.201', ten_phong: 'Phòng Máy Tính Lab 1', ma_cs: 'CS1', toa: 'A', tang: 2, loai_phong: 'Phòng máy tính', suc_chua: 45, trang_thai: 'Đang dùng', hasScheduleToday: true, currentSchedule: { ca: 2, ten_mon_hoc: 'Thực hành Mạng Máy Tính', giang_vien: 'TS. Trần Thị B', lop: 'KTPM-K16', thoi_gian: '13:00 - 17:00' }, kwh: 18.0 },
    { ma_phong: 'A.202', ten_phong: 'Phòng Máy Tính Lab 2', ma_cs: 'CS1', toa: 'A', tang: 2, loai_phong: 'Phòng máy tính', suc_chua: 40, trang_thai: 'Bảo trì', hasScheduleToday: false, currentSchedule: null, hasIssue: true, issueDesc: 'Điều hòa Panasonic bị chảy nước và kêu to', kwh: 0.0 },
    { ma_phong: 'A.203', ten_phong: 'Phòng học A.203', ma_cs: 'CS1', toa: 'A', tang: 2, loai_phong: 'Phòng lý thuyết', suc_chua: 50, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },
    { ma_phong: 'A.204', ten_phong: 'Phòng học A.204', ma_cs: 'CS1', toa: 'A', tang: 2, loai_phong: 'Phòng lý thuyết', suc_chua: 50, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },

    { ma_phong: 'B.201', ten_phong: 'Phòng học B.201', ma_cs: 'CS1', toa: 'B', tang: 2, loai_phong: 'Phòng học', suc_chua: 50, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },
    { ma_phong: 'B.202', ten_phong: 'Phòng học B.202', ma_cs: 'CS1', toa: 'B', tang: 2, loai_phong: 'Phòng học', suc_chua: 50, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },
    { ma_phong: 'B.203', ten_phong: 'Phòng học B.203', ma_cs: 'CS1', toa: 'B', tang: 2, loai_phong: 'Phòng học', suc_chua: 50, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },

    { ma_phong: 'C.201', ten_phong: 'Phòng thí nghiệm IoT', ma_cs: 'CS1', toa: 'C', tang: 2, loai_phong: 'Phòng thí nghiệm', suc_chua: 35, trang_thai: 'Đang dùng', hasScheduleToday: true, currentSchedule: { ca: 1, ten_mon_hoc: 'Hệ thống Nhúng & IoT', giang_vien: 'TS. Hoàng Hải', lop: 'KTPM-K15', thoi_gian: '08:00 - 11:30' }, kwh: 9.8 },
    { ma_phong: 'C.202', ten_phong: 'Phòng học C.202', ma_cs: 'CS1', toa: 'C', tang: 2, loai_phong: 'Phòng học', suc_chua: 50, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },
    { ma_phong: 'C.203', ten_phong: 'Phòng học C.203', ma_cs: 'CS1', toa: 'C', tang: 2, loai_phong: 'Phòng học', suc_chua: 50, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },

    { ma_phong: 'D.201', ten_phong: 'Phòng học D.201', ma_cs: 'CS1', toa: 'D', tang: 2, loai_phong: 'Phòng học', suc_chua: 50, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },
    { ma_phong: 'D.202', ten_phong: 'Phòng học D.202', ma_cs: 'CS1', toa: 'D', tang: 2, loai_phong: 'Phòng học', suc_chua: 50, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },

    // TẦNG 3 (KHU A, B, C, D)
    { ma_phong: 'A.301', ten_phong: 'Phòng học A.301', ma_cs: 'CS1', toa: 'A', tang: 3, loai_phong: 'Phòng học', suc_chua: 60, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },
    { ma_phong: 'A.302', ten_phong: 'Phòng học A.302', ma_cs: 'CS1', toa: 'A', tang: 3, loai_phong: 'Phòng học', suc_chua: 60, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },

    { ma_phong: 'B.301', ten_phong: 'Hội trường Lớn B.301', ma_cs: 'CS1', toa: 'B', tang: 3, loai_phong: 'Hội trường', suc_chua: 150, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },
    { ma_phong: 'B.302', ten_phong: 'Phòng Học Nhóm B.302', ma_cs: 'CS1', toa: 'B', tang: 3, loai_phong: 'Phòng học nhóm', suc_chua: 15, trang_thai: 'Cảnh báo lãng phí', hasScheduleToday: false, currentSchedule: null, isWasteAlert: true, kwh: 8.5 },

    { ma_phong: 'C.301', ten_phong: 'Phòng học C.301', ma_cs: 'CS1', toa: 'C', tang: 3, loai_phong: 'Phòng học', suc_chua: 50, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },
    { ma_phong: 'C.302', ten_phong: 'Phòng học C.302', ma_cs: 'CS1', toa: 'C', tang: 3, loai_phong: 'Phòng học', suc_chua: 50, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },

    { ma_phong: 'D.301', ten_phong: 'Phòng học D.301', ma_cs: 'CS1', toa: 'D', tang: 3, loai_phong: 'Phòng học', suc_chua: 50, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },
    { ma_phong: 'D.302', ten_phong: 'Phòng học D.302', ma_cs: 'CS1', toa: 'D', tang: 3, loai_phong: 'Phòng học', suc_chua: 50, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },

    // TẦNG 4 (KHU A, B, C, D)
    { ma_phong: 'A.401', ten_phong: 'Văn phòng Khoa CNTT', ma_cs: 'CS1', toa: 'A', tang: 4, loai_phong: 'Văn phòng', suc_chua: 30, trang_thai: 'Đang dùng', hasScheduleToday: true, currentSchedule: { ca: 1, ten_mon_hoc: 'Làm việc hành chính khoa', giang_vien: 'BGH & Trợ lý khoa', lop: 'Khoa CNTT', thoi_gian: '08:00 - 17:00' }, kwh: 7.2 },
    { ma_phong: 'A.402', ten_phong: 'Phòng họp Hội đồng', ma_cs: 'CS1', toa: 'A', tang: 4, loai_phong: 'Phòng họp', suc_chua: 40, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },

    { ma_phong: 'B.401', ten_phong: 'Phòng Nghiên cứu AI Lab', ma_cs: 'CS1', toa: 'B', tang: 4, loai_phong: 'Lab Nghiên cứu', suc_chua: 25, trang_thai: 'Đang dùng', hasScheduleToday: true, currentSchedule: { ca: 1, ten_mon_hoc: 'Huấn luyện mô hình Deep Learning', giang_vien: 'Lab AI Team', lop: 'NCS & Cao học', thoi_gian: '08:00 - 18:00' }, kwh: 16.4 },
    { ma_phong: 'B.402', ten_phong: 'Phòng Server Trung tâm', ma_cs: 'CS1', toa: 'B', tang: 4, loai_phong: 'Data Center', suc_chua: 10, trang_thai: 'Đang dùng', hasScheduleToday: true, currentSchedule: { ca: 1, ten_mon_hoc: 'Vận hành hệ thống máy chủ 24/7', giang_vien: 'Admin Hạ tầng mạng', lop: 'Campus IT', thoi_gian: 'Cả ngày' }, kwh: 32.0 },

    { ma_phong: 'C.401', ten_phong: 'Phòng học C.401', ma_cs: 'CS1', toa: 'C', tang: 4, loai_phong: 'Phòng học', suc_chua: 50, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },
    { ma_phong: 'C.402', ten_phong: 'Phòng học C.402', ma_cs: 'CS1', toa: 'C', tang: 4, loai_phong: 'Phòng học', suc_chua: 50, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },

    { ma_phong: 'D.401', ten_phong: 'Studio Ghi hình Bài giảng', ma_cs: 'CS1', toa: 'D', tang: 4, loai_phong: 'Studio', suc_chua: 20, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 0.0 },
    { ma_phong: 'D.402', ten_phong: 'Phòng Kỹ thuật E-learning', ma_cs: 'CS1', toa: 'D', tang: 4, loai_phong: 'Phòng kỹ thuật', suc_chua: 15, trang_thai: 'Sẵn sàng', hasScheduleToday: false, currentSchedule: null, kwh: 2.1 }
  ],

  // Chi tiết thiết bị theo từng phòng (Bảng ThietBi)
  devicesByRoom: {
    'A101': [
      { ma_tb: 'TB_ML_A101', ten_tb: 'Điều hòa Daikin 1', ma_loai: 'MAYLANH', cong_suat: '2500W', tinh_trang: 'Tốt' },
      { ma_tb: 'TB_MC_A101', ten_tb: 'Máy chiếu Panasonic', ma_loai: 'MAYCHIEU', cong_suat: '400W', tinh_trang: 'Tốt' }
    ],
    'A102': [
      { ma_tb: 'TB_ML_A102', ten_tb: 'Điều hòa Daikin A102', ma_loai: 'MAYLANH', cong_suat: '2500W', tinh_trang: 'Tốt' },
      { ma_tb: 'TB_MC_A102', ten_tb: 'Máy chiếu Sony', ma_loai: 'MAYCHIEU', cong_suat: '400W', tinh_trang: 'Tốt' }
    ],
    'A201': [
      { ma_tb: 'TB_PC_A201', ten_tb: 'Dàn 45 PC Dell OptiPlex', ma_loai: 'MAYTINH', cong_suat: '5000W', tinh_trang: 'Tốt' },
      { ma_tb: 'TB_ML_A201', ten_tb: 'Điều hòa công suất lớn', ma_loai: 'MAYLANH', cong_suat: '3500W', tinh_trang: 'Tốt' }
    ],
    'A202': [
      { ma_tb: 'TB_ML_A202', ten_tb: 'Điều hòa Panasonic A202', ma_loai: 'MAYLANH', cong_suat: '2500W', tinh_trang: 'Hỏng' },
      { ma_tb: 'TB_PC_A202', ten_tb: 'Dàn 40 PC Dell Lab 2', ma_loai: 'MAYTINH', cong_suat: '4500W', tinh_trang: 'Tốt' }
    ],
    'B301': [
      { ma_tb: 'TB_MC_B301', ten_tb: 'Máy chiếu hội trường Epson', ma_loai: 'MAYCHIEU', cong_suat: '800W', tinh_trang: 'Tốt' },
      { ma_tb: 'TB_ML_B301', ten_tb: 'Hệ thống điều hòa trung tâm', ma_loai: 'MAYLANH', cong_suat: '6000W', tinh_trang: 'Tốt' }
    ],
    'B302': [
      { ma_tb: 'TB_ML_B302', ten_tb: 'Điều hòa Inverter B302', ma_loai: 'MAYLANH', cong_suat: '1800W', tinh_trang: 'Tốt' }
    ]
  },

  // Lịch học hôm nay theo phòng (Bảng LichPhong)
  schedulesByRoom: {
    'A101': {
      ma_lich: 1,
      ca: 1,
      thoi_gian: '07:30 - 11:30',
      ten_mon_hoc: 'Lập trình Python Nâng Cao',
      giang_vien: 'ThS. Nguyễn Văn A',
      lop: 'CNTT-K15',
      trang_thai: 'Đang diễn ra'
    },
    'A201': {
      ma_lich: 2,
      ca: 2,
      thoi_gian: '13:00 - 17:00',
      ten_mon_hoc: 'Thực hành Mạng Máy Tính',
      giang_vien: 'TS. Trần Thị B',
      lop: 'KTPM-K16',
      trang_thai: 'Sắp diễn ra'
    }
  },

  // Điện năng theo phòng (Bảng DienNang)
  metricsByRoom: {
    'A101': { kwh: 12.5, so_gio_bat: 4.0 },
    'A102': { kwh: 0.0, so_gio_bat: 0.0 },
    'A201': { kwh: 18.0, so_gio_bat: 3.5 },
    'A202': { kwh: 0.0, so_gio_bat: 0.0 },
    'B301': { kwh: 0.0, so_gio_bat: 0.0 },
    'B302': { kwh: 8.5, so_gio_bat: 6.0 }
  },

  // Phân bổ tiêu thụ theo nhóm thiết bị thực tế (LoaiThietBi)
  energyBreakdown: {
    totalKWh: 39.0,
    categories: [
      { name: 'Máy tính Lab (MAYTINH)', percentage: 46, kwh: 18.0, color: '#3b82f6' },
      { name: 'Máy điều hòa (MAYLANH)', percentage: 44, kwh: 17.0, color: '#10b981' },
      { name: 'Máy chiếu & Thiết bị khác', percentage: 10, kwh: 4.0, color: '#f59e0b' }
    ]
  },

  // Gợi ý từ AI Agent (/api/ai/analize)
  aiRecommendations: [
    {
      id: 'rec-1',
      title: 'Tự động ngắt điện phòng B302',
      description: 'Phòng B302 đang tiêu thụ 8.5 kWh ngoài giờ không có lịch học. Gửi lệnh tắt điều hòa tức thì.',
      benefit: 'Tiết kiệm ngay 8.5 kWh',
      category: 'Năng lượng'
    },
    {
      id: 'rec-2',
      title: 'Xử lý phiếu sửa chữa điều hòa A202',
      description: 'Phiếu báo hỏng TB_ML_A202 đang chờ kỹ thuật viên tiếp nhận để khôi phục phòng máy tính.',
      benefit: 'Đảm bảo phòng sẵn sàng học',
      category: 'Thiết bị'
    }
  ],

  // Danh sách sự cố & cảnh báo báo hỏng (Bảng PhieuBaoHong & DienNang Idle Waste)
  recentAlerts: [
    {
      id: 'alt-waste-1',
      title: 'Lãng phí điện bất thường (Idle Waste)',
      location: 'Phòng B302 (Tòa B - Tầng 3)',
      time: 'Hôm nay',
      severity: 'warning',
      severityLabel: 'Lãng phí điện',
      detail: 'Tiêu thụ 8.5 kWh không có lịch học trong LichPhong'
    },
    {
      id: 'alt-issue-1',
      title: 'Điều hòa bị chảy nước và kêu to',
      location: 'Phòng A202 (Tòa A - Tầng 2)',
      time: 'Phiếu #1',
      severity: 'critical',
      severityLabel: 'Đang xử lý',
      detail: 'Thiết bị TB_ML_A202 - Người báo: Admin'
    }
  ],

  // 1. Toàn bộ danh mục phòng học chuẩn PhongRead
  allRooms: [
    { ma_phong: 'A101', ten_phong: 'Phòng Lý Thuyết A101', ma_cs: 'CS1', toa: 'A', tang: 1, loai_phong: 'Phòng lý thuyết', suc_chua: 50, so_ban: 25, dien_tich: 65.0, trang_thai: 'Đang dùng', da_xoa: false },
    { ma_phong: 'A102', ten_phong: 'Phòng Lý Thuyết A102', ma_cs: 'CS1', toa: 'A', tang: 1, loai_phong: 'Phòng lý thuyết', suc_chua: 60, so_ban: 30, dien_tich: 75.0, trang_thai: 'Sẵn sàng', da_xoa: false },
    { ma_phong: 'A201', ten_phong: 'Phòng Máy Tính Lab 1', ma_cs: 'CS1', toa: 'A', tang: 2, loai_phong: 'Phòng máy tính', suc_chua: 45, so_ban: 45, dien_tich: 80.0, trang_thai: 'Đang dùng', da_xoa: false },
    { ma_phong: 'A202', ten_phong: 'Phòng Máy Tính Lab 2', ma_cs: 'CS1', toa: 'A', tang: 2, loai_phong: 'Phòng máy tính', suc_chua: 40, so_ban: 40, dien_tich: 70.0, trang_thai: 'Bảo trì', da_xoa: false },
    { ma_phong: 'B301', ten_phong: 'Hội Trường Lớn B301', ma_cs: 'CS1', toa: 'B', tang: 3, loai_phong: 'Hội trường', suc_chua: 150, so_ban: 75, dien_tich: 200.0, trang_thai: 'Sẵn sàng', da_xoa: false },
    { ma_phong: 'B302', ten_phong: 'Phòng Học Nhóm B302', ma_cs: 'CS1', toa: 'B', tang: 3, loai_phong: 'Phòng học nhóm', suc_chua: 15, so_ban: 5, dien_tich: 28.0, trang_thai: 'Sẵn sàng', da_xoa: false }
  ],

  // 2. Toàn bộ thiết bị chuẩn ThietBiRead
  allDevices: [
    { ma_tb: 'TB_ML_A101', ma_loai: 'MAYLANH', ma_phong: 'A101', ma_lo: 'ML_01', ten_tb: 'Điều hòa Daikin 1', cong_suat_w: 2500, nam_mua: 2023, tinh_trang: 'Tốt' },
    { ma_tb: 'TB_MC_A101', ma_loai: 'MAYCHIEU', ma_phong: 'A101', ma_lo: 'MC_01', ten_tb: 'Máy chiếu Panasonic', cong_suat_w: 400, nam_mua: 2022, tinh_trang: 'Tốt' },
    { ma_tb: 'TB_ML_A102', ma_loai: 'MAYLANH', ma_phong: 'A102', ma_lo: 'ML_01', ten_tb: 'Điều hòa Daikin A102', cong_suat_w: 2500, nam_mua: 2023, tinh_trang: 'Tốt' },
    { ma_tb: 'TB_MC_A102', ma_loai: 'MAYCHIEU', ma_phong: 'A102', ma_lo: 'MC_01', ten_tb: 'Máy chiếu Sony Laser', cong_suat_w: 420, nam_mua: 2023, tinh_trang: 'Tốt' },
    { ma_tb: 'TB_PC_A201', ma_loai: 'MAYTINH', ma_phong: 'A201', ma_lo: 'PC_DELL', ten_tb: 'Dàn 45 PC Dell OptiPlex', cong_suat_w: 5000, nam_mua: 2024, tinh_trang: 'Tốt' },
    { ma_tb: 'TB_ML_A201', ma_loai: 'MAYLANH', ma_phong: 'A201', ma_lo: 'ML_INVERTER', ten_tb: 'Điều hòa 2.5HP Sharp', cong_suat_w: 3500, nam_mua: 2023, tinh_trang: 'Tốt' },
    { ma_tb: 'TB_ML_A202', ma_loai: 'MAYLANH', ma_phong: 'A202', ma_lo: 'ML_PANA', ten_tb: 'Điều hòa Panasonic A202', cong_suat_w: 2500, nam_mua: 2021, tinh_trang: 'Hỏng' },
    { ma_tb: 'TB_PC_A202', ma_loai: 'MAYTINH', ma_phong: 'A202', ma_lo: 'PC_DELL', ten_tb: 'Dàn 40 PC Dell Lab 2', cong_suat_w: 4500, nam_mua: 2023, tinh_trang: 'Tốt' },
    { ma_tb: 'TB_MC_B301', ma_loai: 'MAYCHIEU', ma_phong: 'B301', ma_lo: 'MC_EPSON', ten_tb: 'Máy chiếu Epson 5000 ANSI', cong_suat_w: 800, nam_mua: 2023, tinh_trang: 'Tốt' },
    { ma_tb: 'TB_ML_B301', ma_loai: 'MAYLANH', ma_phong: 'B301', ma_lo: 'ML_VRV', ten_tb: 'Hệ thống VRV Trung tâm B301', cong_suat_w: 6000, nam_mua: 2022, tinh_trang: 'Tốt' },
    { ma_tb: 'TB_ML_B302', ma_loai: 'MAYLANH', ma_phong: 'B302', ma_lo: 'ML_INVERTER', ten_tb: 'Điều hòa Inverter B302', cong_suat_w: 1800, nam_mua: 2024, tinh_trang: 'Tốt' },
    { ma_tb: 'TB_KHO_01', ma_loai: 'MAYCHIEU', ma_phong: null, ma_lo: 'MC_DU_PHONG', ten_tb: 'Máy chiếu di động dự phòng', cong_suat_w: 350, nam_mua: 2024, tinh_trang: 'Tốt' }
  ],

  // 3. Toàn bộ lịch phòng chuẩn LichPhongRead
  allSchedules: [
    { ma_lich: 1, ma_phong: 'A101', ngay: new Date().toISOString().split('T')[0], ca: 1, loai: 'HOC', noi_dung: 'Lập trình Python Nâng Cao', ten_mon_hoc: 'Lập trình Python Nâng Cao', giang_vien: 'ThS. Nguyễn Văn A', lop: 'CNTT-K15', so_nguoi: 48, trang_thai: 'Đang diễn ra' },
    { ma_lich: 2, ma_phong: 'A201', ngay: new Date().toISOString().split('T')[0], ca: 2, loai: 'HOC', noi_dung: 'Thực hành Mạng Máy Tính', ten_mon_hoc: 'Thực hành Mạng Máy Tính', giang_vien: 'TS. Trần Thị B', lop: 'KTPM-K16', so_nguoi: 42, trang_thai: 'Sắp diễn ra' },
    { ma_lich: 3, ma_phong: 'B301', ngay: new Date(Date.now() + 86400000).toISOString().split('T')[0], ca: 1, loai: 'MUON', noi_dung: 'Hội thảo Khoa học Sinh viên 2026', ten_mon_hoc: 'Hội thảo Khoa học Sinh viên', giang_vien: 'Đoàn Thanh Niên', lop: 'Toàn trường', so_nguoi: 120, trang_thai: 'Đã xếp lịch' },
    { ma_lich: 4, ma_phong: 'A102', ngay: new Date(Date.now() + 86400000).toISOString().split('T')[0], ca: 3, loai: 'HOC', noi_dung: 'Cơ sở Dữ liệu Phân tán', ten_mon_hoc: 'Cơ sở Dữ liệu Phân tán', giang_vien: 'ThS. Lê Hoàng C', lop: 'HTTT-K15', so_nguoi: 55, trang_thai: 'Đã xếp lịch' }
  ],

  // 4. Yêu cầu mượn phòng chuẩn YeuCauMuonRead
  allBookingRequests: [
    { ma_yc: 1, ma_tk: 2, nguoi_gui_ten: 'Lê Văn Cường (SV)', ma_phong: 'B302', ngay: new Date(Date.now() + 86400000).toISOString().split('T')[0], ca: 2, so_nguoi: 10, muc_dich: 'Họp nhóm đồ án tốt nghiệp ngành Trí tuệ Nhân tạo', trang_thai: 'ChoDuyet', ngay_gui: '2026-10-26T08:30:00' },
    { ma_yc: 2, ma_tk: 3, nguoi_gui_ten: 'Nguyễn Thị Dung (CLB)', ma_phong: 'B301', ngay: new Date(Date.now() + 172800000).toISOString().split('T')[0], ca: 1, so_nguoi: 80, muc_dich: 'Tập luyện văn nghệ chào tân sinh viên K17', trang_thai: 'ChoDuyet', ngay_gui: '2026-10-26T09:15:00' },
    { ma_yc: 3, ma_tk: 4, nguoi_gui_ten: 'Phạm Minh Tuấn (GV)', ma_phong: 'A102', ngay: new Date(Date.now() - 86400000).toISOString().split('T')[0], ca: 2, so_nguoi: 50, muc_dich: 'Học bù môn Toán rời rạc', trang_thai: 'DaDuyet', ngay_gui: '2026-10-24T14:00:00' }
  ],

  // 5. Phiếu báo hỏng thiết bị chuẩn PhieuBaoHongRead
  allReports: [
    {
      ma_phieu: 1,
      ma_phong: 'A202',
      ma_tb: 'TB_ML_A202',
      ten_tb: 'Điều hòa Panasonic A202',
      mo_ta: 'Điều hòa A202 bị chảy nước nhiều xuống sàn và kêu to, không mát',
      muc_do: 'NghiemTrong',
      trang_thai: 'DangXuLy',
      ma_tk: 1,
      nguoi_bao_ten: 'Admin (Ban Quản Lý)',
      ngay_bao: '2026-10-26T07:15:00',
      ghi_chu_admin: 'Đã điều thợ bảo trì kiểm tra đường ống gas và lốc máy',
      ngay_xu_ly: null
    },
    {
      ma_phieu: 2,
      ma_phong: 'A101',
      ma_tb: 'TB_MC_A101',
      ten_tb: 'Máy chiếu Panasonic',
      mo_ta: 'Hình ảnh trình chiếu bị mờ nhạt và ám vàng góc phải màn hình',
      muc_do: 'TrungBinh',
      trang_thai: 'Moi',
      ma_tk: 2,
      nguoi_bao_ten: 'ThS. Nguyễn Văn A',
      ngay_bao: '2026-10-26T10:45:00',
      ghi_chu_admin: null,
      ngay_xu_ly: null
    },
    {
      ma_phieu: 3,
      ma_phong: 'B301',
      ma_tb: 'TB_MC_B301',
      ten_tb: 'Máy chiếu Epson Hội trường',
      mo_ta: 'Cổng HDMI 1 tiếp xúc chập chờn khi cắm laptop',
      muc_do: 'Nhe',
      trang_thai: 'DaXuLy',
      ma_tk: 1,
      nguoi_bao_ten: 'Admin',
      ngay_bao: '2026-10-24T15:20:00',
      ghi_chu_admin: 'Đã thay dây cáp tín hiệu HDMI 4K mạ vàng mới',
      ngay_xu_ly: '2026-10-25T09:00:00'
    }
  ],

  // 6. Lịch sử tiêu thụ điện năng chuẩn DienNangRead
  allEnergyMetrics: [
    { ma_phong: 'A101', ngay: new Date().toISOString().split('T')[0], kwh: 12.5, so_gio_bat: 4.0, danh_gia: 'Tiêu chuẩn', co_lich: true, sparkline7d: [9.2, 11.0, 14.2, 10.5, 13.8, 11.5, 12.5] },
    { ma_phong: 'A102', ngay: new Date().toISOString().split('T')[0], kwh: 0.0, so_gio_bat: 0.0, danh_gia: 'Tắt hoàn toàn', co_lich: false, sparkline7d: [6.5, 8.0, 11.0, 4.5, 0.0, 0.0, 0.0] },
    { ma_phong: 'A201', ngay: new Date().toISOString().split('T')[0], kwh: 18.0, so_gio_bat: 3.5, danh_gia: 'Phòng Lab (Hiệu suất cao)', co_lich: true, sparkline7d: [15.0, 17.5, 20.5, 16.0, 19.5, 14.0, 18.0] },
    { ma_phong: 'A202', ngay: new Date().toISOString().split('T')[0], kwh: 0.0, so_gio_bat: 0.0, danh_gia: 'Đang bảo trì', co_lich: false, sparkline7d: [12.0, 10.5, 0.0, 0.0, 0.0, 0.0, 0.0] },
    { ma_phong: 'B301', ngay: new Date().toISOString().split('T')[0], kwh: 0.0, so_gio_bat: 0.0, danh_gia: 'Sẵn sàng', co_lich: false, sparkline7d: [0.0, 0.0, 18.5, 0.0, 0.0, 22.0, 0.0] },
    { ma_phong: 'B302', ngay: new Date().toISOString().split('T')[0], kwh: 8.5, so_gio_bat: 6.0, danh_gia: 'Cảnh báo lãng phí (Idle Waste)', co_lich: false, isWaste: true, sparkline7d: [2.0, 2.5, 3.0, 4.2, 5.0, 7.8, 8.5] },
    // Dữ liệu hôm qua
    { ma_phong: 'A101', ngay: new Date(Date.now() - 86400000).toISOString().split('T')[0], kwh: 14.2, so_gio_bat: 5.0, danh_gia: 'Tiêu chuẩn', co_lich: true, sparkline7d: [8.5, 10.0, 12.0, 11.0, 13.5, 14.2, 12.5] },
    { ma_phong: 'A102', ngay: new Date(Date.now() - 86400000).toISOString().split('T')[0], kwh: 11.0, so_gio_bat: 4.0, danh_gia: 'Tiêu chuẩn', co_lich: true, sparkline7d: [5.0, 7.5, 8.0, 10.0, 11.0, 0.0, 0.0] },
    { ma_phong: 'A201', ngay: new Date(Date.now() - 86400000).toISOString().split('T')[0], kwh: 20.5, so_gio_bat: 4.5, danh_gia: 'Phòng Lab', co_lich: true, sparkline7d: [14.0, 16.0, 18.0, 19.0, 20.5, 17.0, 18.0] }
  ],

  // 7. Chuỗi thời gian tổng điện năng tiêu thụ tất cả phòng (Ngày, Tuần, Tháng, Năm)
  timelineMetrics: {
    day: [
      { label: '06:00', kwh: 2.1, note: 'Khởi động hệ thống' },
      { label: '08:00', kwh: 14.8, note: 'Bắt đầu Ca 1 học lý thuyết & thực hành' },
      { label: '10:00', kwh: 26.5, note: 'Đỉnh tải ca sáng: Lab A201 + A101' },
      { label: '12:00', kwh: 8.2, note: 'Giờ nghỉ trưa - tắt điều hòa phòng học' },
      { label: '14:00', kwh: 29.4, note: 'Đỉnh tải ca chiều: Phòng thực hành đầy đủ' },
      { label: '16:00', kwh: 22.0, note: 'Học ca 3' },
      { label: '18:00', kwh: 15.6, note: 'Lớp tại chức / Học ban đêm' },
      { label: '20:00', kwh: 9.8, note: 'Tập trung phòng học nhóm & thư viện' },
      { label: '22:00', kwh: 8.5, note: 'Phát hiện lãng phí điện B302' }
    ],
    week: [
      { label: 'Thứ 2', kwh: 142.5, note: 'Ngày đầu tuần đầy đủ ca học' },
      { label: 'Thứ 3', kwh: 168.0, note: 'Toàn bộ lab máy tính hoạt động' },
      { label: 'Thứ 4', kwh: 155.2, note: 'Học lý thuyết và bảo trì định kỳ' },
      { label: 'Thứ 5', kwh: 172.8, note: 'Cao điểm ca học sáng và chiều' },
      { label: 'Thứ 6', kwh: 148.4, note: 'Tổng kết tuần và báo cáo lab' },
      { label: 'Thứ 7', kwh: 78.0, note: 'Hội thảo B301 & các lớp học bù' },
      { label: 'Chủ Nhật', kwh: 24.5, note: 'Chỉ bật hệ thống an ninh & máy chủ' }
    ],
    month: [
      { label: 'Tuần 1', kwh: 820.0, note: 'Đầu tháng - lịch học ổn định' },
      { label: 'Tuần 2', kwh: 890.5, note: 'Tuần thi giữa kỳ (Lab mở liên tục)' },
      { label: 'Tuần 3', kwh: 865.0, note: 'Hội thảo khoa học sinh viên' },
      { label: 'Tuần 4', kwh: 795.5, note: 'Đang tối ưu tiết kiệm điện AI' }
    ],
    year: [
      { label: 'Th1', kwh: 3100, note: 'Học kỳ 1' },
      { label: 'Th2', kwh: 1850, note: 'Nghỉ Tết Nguyên Đán' },
      { label: 'Th3', kwh: 3450, note: 'Cao điểm học kỳ 2' },
      { label: 'Th4', kwh: 3620, note: 'Thi giữa kỳ và đồ án môn' },
      { label: 'Th5', kwh: 3800, note: 'Thời tiết nắng nóng, điều hòa tăng' },
      { label: 'Th6', kwh: 2900, note: 'Kết thúc năm học chính' },
      { label: 'Th7', kwh: 1600, note: 'Học kỳ hè (giảm tải)' },
      { label: 'Th8', kwh: 1950, note: 'Chuẩn bị đón tân sinh viên' },
      { label: 'Th9', kwh: 3750, note: 'Khai giảng năm học mới' },
      { label: 'Th10', kwh: 3580, note: 'Tháng hiện tại' },
      { label: 'Th11', kwh: 3400, note: 'Dự báo tiêu thụ' },
      { label: 'Th12', kwh: 3250, note: 'Dự báo cuối kỳ' }
    ]
  }
};
