# Audit chấm điểm

Công cụ dòng lệnh để kiểm tra & thử công thức chấm điểm leaderboard. Nó **import trực tiếp**
`effectiveMet` / `computePoints` từ [`src/domain/session.js`](../../src/domain/session.js) và
`actOf` / `metForSpeed` / `rpeOf` từ [`src/domain/activities.js`](../../src/domain/activities.js)
— **không chép lại hằng số**, nên kết quả luôn khớp với app. Sửa công thức trong `src/domain/`
rồi chạy lại là thấy ngay tác động.

## Chạy

```bash
# Báo cáo đầy đủ: 2 ca tham chiếu + độ phân biệt bơi + độ nhạy gym + đối chiếu các môn
node tools/audit-score/audit.mjs
```

Chấm 1 buổi tuỳ ý — `<môn> <mốc> <phút> <rpe>`:

```bash
node tools/audit-score/audit.mjs gym  9462 78 3   # gym:  <volume_kg> <phút> <rpe 1-5>
node tools/audit-score/audit.mjs swim 900  66 3   # bơi:  <mét>       <phút> <rpe>
node tools/audit-score/audit.mjs run  10   60 3   # pace: <km>        <phút> <rpe>  (run/walk/cycle)
node tools/audit-score/audit.mjs yoga -    45 2   # rpe_only: mốc '-'  <phút> <rpe>  (yoga/bóng đá/…)
```

Mỗi dòng in: phút hợp lệ · MET hiệu dụng · điểm · và *vì sao* (tốc độ→MET nền×RPE cho pace;
volume + cảnh báo `CHẠM TRẦN` cho gym; nội suy metMin↔metMax cho rpe_only).

## Công thức (tóm tắt)

`điểm = MET hiệu dụng × giờ × 10`, MET tính theo `category` của môn:

| category | MET hiệu dụng | Môn |
|---|---|---|
| `pace` | MET nền tra từ tốc độ (quãng đường ÷ thời lượng → `SPEED_BANDS`) × hệ số RPE (0.8–1.2) | chạy, đi bộ, đạp xe, bơi |
| `gym` | volume load × `gymRaw` × `GYM_K` ÷ phút, chặn `[metMin, GYM_MET_CAP]` | gym |
| `rpe_only` | nội suy tuyến tính `metMin ↔ metMax` theo index RPE | yoga, bóng đá, cầu lông… |

Hằng số/dải MET đều nằm trong `src/domain/` (không ở đây). `metMin/metMax` đã rà với
[Compendium 2024](https://pacompendium.com/); `GYM_K`/trần và `SPEED_BANDS.swim` đã calibrate
2026-08 (xem comment trong source).

## Bản trực quan

Bản kéo-slider realtime, có toggle so hằng số gym cũ/mới:
Artifact **Apollo Sport · Audit chấm điểm** (mở bằng tài khoản claude.ai của bạn).

## Ghi chú kỹ thuật

App là no-build (preact nạp qua importmap trên trình duyệt). Để import module domain trong
node, script stub `preact/hooks` (qua `registerHooks`) và `localStorage` — cả hai chỉ bị `i18n.js`
kéo vào gián tiếp, **không** ảnh hưởng công thức. Cần Node ≥ 22 (dùng `module.registerHooks`).
Đổi điểm hằng số **không hồi tố**: buổi cũ giữ `points` đã lưu lúc post, chỉ buổi mới tính lại.
