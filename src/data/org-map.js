// Ánh xạ Trung tâm/Phòng ban → Cụm → Khu vực. Nguồn: bảng tổ chức do Khang cung cấp (6/9/2026).
//
// Vì sao tồn tại: bảng xếp hạng hiện chỉ có phạm vi 'toàn công ty' và 'phòng ban'. Muốn thêm
// phạm vi theo cụm hoặc khu vực về sau thì phải biết mỗi trung tâm thuộc cụm/khu vực nào —
// và dữ liệu đó KHÔNG suy ra được từ tên. Thêm bây giờ là một file; thêm sau khi đã có vài
// trăm người dùng thì phải đi hỏi lại từng người.
//
// KHÔNG đổi gì ở giao diện: người dùng vẫn chỉ chọn phòng ban của mình như cũ. Đây thuần tuý
// là bảng tra cứu, chưa nơi nào trong app hiển thị cụm hay khu vực.
//
// Bảng để PHẲNG, không lồng khu vực → cụm → trung tâm, vì cụm trải qua nhiều khu vực:
// cụm 'ViNghiem' có trung tâm ở cả North lẫn South, 'Back Office' trải cả ba khu vực.

export const REGIONS = ['North', 'South', 'NTW'];

// [ tên trong ô chọn phòng ban, cụm, khu vực ]
export const ORG_ROWS = [
  ['Management',                'Back Office', 'NTW'],
  ['Corporate Communication',   'Back Office', 'NTW'],
  ['Finance',                   'Back Office', 'NTW'],
  ['Apollonian Experience',     'Back Office', 'NTW'],
  ['IT',                        'Back Office', 'NTW'],
  ['Talent Development',        'Back Office', 'NTW'],
  ['Legal',                     'Back Office', 'NTW'],
  ['CD',                        'Back Office', 'NTW'],
  ['HSE',                       'Back Office', 'NTW'],
  ['Marketing',                 'Back Office', 'NTW'],
  ['Procurement',               'Back Office', 'NTW'],
  ['Local Marketing North',     'Back Office', 'North'],
  ['Local Marketing South',     'Back Office', 'South'],
  ['Call Center',               'Back Office', 'South'],
  ['BD1.THD',                   'Hang',        'South'],
  ['BD2.DAN',                   'Hang',        'South'],
  ['BD3.BDA',                   'Hang',        'South'],
  ['BH1.PVT',                   'Hang',        'South'],
  ['CT1.BTT',                   'Thao',        'South'],
  ['DN1.DD',                    'NhatVy',      'South'],
  ['DN2.NHO',                   'NhatVy',      'South'],
  ['HCM1.LQD',                  'Hang',        'South'],
  ['HCM10.LVV',                 'Thao',        'South'],
  ['HCM11.BT',                  'Hang',        'South'],
  ['HCM12.TKQ',                 'NhatVy',      'South'],
  ['HCM13.PQ',                  'NhatVy',      'South'],
  ['HCM14.EST',                 'Hang',        'South'],
  ['HCM15.TS',                  'NhatVy',      'South'],
  ['HCM16.DVB',                 'Thao',        'South'],
  ['HCM17.NVG',                 'Thao',        'South'],
  ['HCM18.PVH',                 'Hang',        'South'],
  ['HCM19.GV2',                 'Hang',        'South'],
  ['HCM2.PNT',                  'NhatVy',      'South'],
  ['HCM20.THT',                 'Thao',        'South'],
  ['HCM21.LBB',                 'NhatVy',      'South'],
  ['HCM22.LDH2',                'Thao',        'South'],
  ['HCM23.TNV',                 'Thao',        'South'],
  ['HCM24.HP',                  'NhatVy',      'South'],
  ['HCM27.NAT',                 'Hang',        'South'],
  ['HCM28.DLP',                 'NhatVy',      'South'],
  ['HCM29.VGP',                 'Thao',        'South'],
  ['HCM31.GV3',                 'NhatVy',      'South'],
  ['HCM32.XVT',                 'Hang',        'South'],
  ['HCM33.NBE',                 'Thao',        'South'],
  ['HCM4.TBT',                  'Thao',        'South'],
  ['HCM6.BC',                   'NhatVy',      'South'],
  ['HCM8.PMH',                  'Thao',        'South'],
  ['HCM9.GV',                   'NhatVy',      'South'],
  ['KG1.RGI',                   'ViNghiem',    'South'],
  ['KH1.LTP',                   'Thao',        'South'],
  ['NTW AHP',                   'Hang',        'South'],
  ['VT02.BRI',                  'Hang',        'South'],
  ['VT1.LHG',                   'Hang',        'South'],
  ['ASP HN',                    'HuongPham',   'North'],
  ['BN1.NSL',                   'ViNghiem',    'North'],
  ['BN2.TUS',                   'ViNghiem',    'North'],
  ['HN1.PH',                    'Quang',       'North'],
  ['HN10.TG',                   'HuongPham',   'North'],
  ['HN12.NHT',                  'Hanh',        'North'],
  ['HN14.TM',                   'Hanh',        'North'],
  ['HN15.VP',                   'Quang',       'North'],
  ['HN16.PDP',                  'ViNghiem',    'North'],
  ['HN17.HNI',                  'HuongPham',   'North'],
  ['HN18.VTP',                  'HuongPham',   'North'],
  ['HN19.NT',                   'HuongPham',   'North'],
  ['HN2.TH',                    'ViNghiem',    'North'],
  ['HN21.NGD',                  'ViNghiem',    'North'],
  ['HN22.NVO',                  'Quang',       'North'],
  ['HN23.LD',                   'Hanh',        'North'],
  ['HN24.TC',                   'Quang',       'North'],
  ['HN25.LTT',                  'HuongPham',   'North'],
  ['HN26.VH',                   'Hanh',        'North'],
  ['HN27.OP',                   'Hanh',        'North'],
  ['HN28.PVD',                  'HuongPham',   'North'],
  ['HN29.VPH',                  'Quang',       'North'],
  ['HN3.HQV',                   'HuongPham',   'North'],
  ['HN30.AKH',                  'HuongPham',   'North'],
  ['HN31.AHG',                  'Quang',       'North'],
  ['HN33.DAH',                  'ViNghiem',    'North'],
  ['HN34.HTN',                  'Hanh',        'North'],
  ['HN4.LG',                    'ViNghiem',    'North'],
  ['HN5.NVL',                   'Hanh',        'North'],
  ['HN7.VQ',                    'Quang',       'North'],
  ['HN32.LLQ',                  'ViNghiem',    'North'],
  ['HP1.LHP',                   'Quang',       'North'],
  ['HP2.HBT',                   'Quang',       'North'],
  ['HP3.VIN',                   'Quang',       'North'],
  ['HY01.ECP',                  'Hanh',        'North'],
  ['QN01.HL',                   'ViNghiem',    'North'],
  ['TH01.TPU',                  'Hanh',        'North'],
  ['TN01.LNQ',                  'Quang',       'North'],
  ['VIN01.CT',                  'Hanh',        'North'],
  ['VP01.PCT',                  'HuongPham',   'North'],
];

const BY_DEPT = new Map(ORG_ROWS.map(([d, c, r]) => [d, { cluster: c, region: r }]));

// Trả null khi không tra được (phòng ban cũ, hoặc dữ liệu tổ chức chưa cập nhật) — nơi gọi
// phải xử lý được null, đừng để vỡ giao diện vì một người chọn phòng lạ.
export const clusterOf = dept => BY_DEPT.get(dept)?.cluster ?? null;
export const regionOf = dept => BY_DEPT.get(dept)?.region ?? null;

export const CLUSTERS = [...new Set(ORG_ROWS.map(([, c]) => c))];
export const deptsOfRegion = region => ORG_ROWS.filter(([, , r]) => r === region).map(([d]) => d);
export const deptsOfCluster = cluster => ORG_ROWS.filter(([, c]) => c === cluster).map(([d]) => d);
