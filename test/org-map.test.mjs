// Ánh xạ Trung tâm/Phòng ban → Cụm → Khu vực. Chưa dùng để hiển thị gì; tồn tại để sau này
// dựng được bảng xếp hạng theo cụm/khu vực mà không phải đi hỏi lại từng người.
// Người dùng vẫn chỉ chọn phòng ban như cũ — đây thuần tuý là bảng tra cứu.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clusterOf, regionOf, REGIONS, ORG_ROWS, deptsOfRegion, deptsOfCluster } from '../src/data/org-map.js';
import { DEPARTMENTS } from '../src/data/departments.js';

test('tra được cụm và khu vực từ tên trung tâm', () => {
  assert.equal(clusterOf('HN1.PH'), 'Quang');
  assert.equal(regionOf('HN1.PH'), 'North');
  assert.equal(clusterOf('HCM8.PMH'), 'Thao');
  assert.equal(regionOf('HCM8.PMH'), 'South');
});

test('phòng ban back office thuộc khu vực NTW', () => {
  assert.equal(clusterOf('Management'), 'Back Office');
  assert.equal(regionOf('Management'), 'NTW');
});

test('back office cũng có phòng thuộc North và South, không phải chỉ NTW', () => {
  assert.equal(regionOf('Local Marketing North'), 'North');
  assert.equal(regionOf('Local Marketing South'), 'South');
  assert.equal(clusterOf('Local Marketing North'), 'Back Office');
});

test('phòng ban không có trong bảng trả về null, không ném lỗi', () => {
  assert.equal(clusterOf('Phòng Không Tồn Tại'), null);
  assert.equal(regionOf('Phòng Không Tồn Tại'), null);
  assert.equal(regionOf(''), null);
  assert.equal(regionOf(undefined), null);
});

test('có đúng ba khu vực', () => {
  assert.deepEqual([...REGIONS].sort(), ['NTW', 'North', 'South']);
});

// Đây KHÔNG phải chi tiết vụn: nếu sau này ai đó dựng lại bảng thành cấu trúc lồng
// khu vực → cụm → trung tâm thì sẽ làm hỏng dữ liệu thật, vì cụm trải qua nhiều khu vực.
test('một cụm có thể trải qua nhiều khu vực', () => {
  const viNghiem = ORG_ROWS.filter(([, cluster]) => cluster === 'ViNghiem');
  const regions = new Set(viNghiem.map(([, , region]) => region));
  assert.ok(regions.has('North') && regions.has('South'),
    'cụm ViNghiem có trung tâm ở cả hai miền — bảng phải để phẳng');
});

test('mọi dòng trong bảng đều có đủ cụm và khu vực', () => {
  for (const [dept, cluster, region] of ORG_ROWS) {
    assert.ok(dept && cluster && region, `dòng thiếu dữ liệu: ${dept}`);
    assert.ok(REGIONS.includes(region), `khu vực lạ ở ${dept}: ${region}`);
  }
});

test('không có trung tâm nào bị khai trùng', () => {
  const names = ORG_ROWS.map(([d]) => d);
  assert.equal(new Set(names).size, names.length);
});

test('lọc được danh sách theo khu vực và theo cụm', () => {
  assert.ok(deptsOfRegion('NTW').includes('Finance'));
  assert.ok(!deptsOfRegion('NTW').includes('HN1.PH'));
  assert.ok(deptsOfCluster('Quang').includes('HN1.PH'));
});

// Ô chọn phòng ban (DEPARTMENTS) và bảng ánh xạ là hai nguồn khác nhau. Lệch nhau nghĩa là
// có người chọn được phòng mà không tra ra khu vực, hoặc có trung tâm không ai chọn được.
// Hai danh sách phải khớp tuyệt đối.
test('mọi phòng ban trong ô chọn đều tra được cụm và khu vực', () => {
  const chuaCoAnhXa = DEPARTMENTS.filter(d => !clusterOf(d));
  assert.deepEqual(chuaCoAnhXa, [], 'phòng ban chọn được nhưng không tra ra khu vực');
});

test('mọi trung tâm trong bảng ánh xạ đều chọn được ở ô phòng ban', () => {
  const picker = new Set(DEPARTMENTS);
  const chuaCoTrongOChon = ORG_ROWS.map(([d]) => d).filter(d => !picker.has(d));
  assert.deepEqual(chuaCoTrongOChon, [], 'trung tâm có trong bảng nhưng không ai chọn được');
});
