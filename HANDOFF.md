# Apollo Sport — Handoff (bàn giao để tiếp tục ở chat mới)

> Mạng xã hội tập luyện nội bộ công ty (mở rộng từ app gym cá nhân "GymPair").
> Cập nhật: 2026-07-26. Đọc file này đầu tiên khi mở chat mới.
> **Plan hiện hành (đầy đủ A→F):** `/Users/hoangdanganhkhang/.claude/plans/t-m-g-c-l-i-phase-cozy-duckling.md`

> ### 👉 VIỆC KẾ TIẾP KHI VÀO CHAT MỚI
> Đã xong & **user đã E2E account thật OK**: **A** (bớt gym-centric, ProgressTab lai), **B/C** (kho Hướng dẫn + YouTube), **D** (thư viện free-exercise-db: ảnh thật + nhóm cơ VN).
> **E2/E3/E4 + dịch VN ĐÃ XONG** (2026-07-23, verify harness đã xoá — xem §10). **E1 CHƯA làm** (là quyết định sản phẩm/khảo sát, không phải code).
> ### ✅ RULES ĐÃ DEPLOY (2026-07-25)
> Rules sửa-bình-luận (chủ comment sửa text) **đã deploy**. Các tính năng khác (sửa/xoá bài, sửa ảnh) không cần đổi rules.

> ### ✅ CỤC A — Role Admin ĐÃ XONG (hạ tầng + UI kiểm duyệt v1, 2026-07-25) — chi tiết §12
> Quyền admin = collection `admins/{uid}` (**CỘNG THÊM**, admin vẫn là user đầy đủ), set tay qua Console, **client không ghi được**. **UI đầu tiên đã cắm:** toggle "Chế độ quản trị" trong Cài đặt (**chỉ admin thấy**); khi bật → banner tím + admin xoá được **mọi** bài (nút 🛡 trên feed) & **mọi** bình luận. Rules Firestore + Storage (admin xoá ảnh) đã deploy. Chưa E2E account admin thật (cần tạo doc `admins/{myuid}` qua Console).

> **MỚI (2026-07-23) — backlog từ khảo sát app fitness khác (chi tiết §11 + Phần F của plan):**
> - **✅ F0 sửa bài đã đăng + mở rộng (2026-07-23):** sửa title/note **+ ảnh**, nút quản lý (⋯) **ngay trên Bảng tin**, **sửa bình luận của mình**, **xoá bài kèm hoàn nguyên số liệu** (điểm/phút/buổi/volume + streak + leaderboard kỳ đó). Chi tiết §11. Còn lại chưa làm:
> - Research song song: **✅ Cục A** (§12) · **✅ Cục B** PR+Goal cá nhân (§13) · **🚧 Nhóm/CLB Đợt 1 + mời/đổi cổng vào** (§14) · **🚧 Đợt 2 Mục tiêu chung** (§15). Tất cả **XONG code 2026-07-26, CHƯA E2E account thật**. Backlog còn: F4 Dashboard HR · F5 kiểm duyệt tự động · F6 badge/vinh danh · timer thời gian thực (quyết định riêng).
> - Để dành phase sau: Dashboard HR/Admin · Kiểm duyệt tự động (keyword) · Badge phong phú + phần thưởng đổi điểm.
> - **F6 ĐÃ PLAN (2026-07-26)** — huy hiệu vẽ riêng + khung viền avatar theo cấp + Bảng vinh danh (trong tab Xếp hạng) + danh hiệu tần suất trên hồ sơ. Chi tiết + **Design Brief** (đưa qua claude design) ở **PHẦN G** cuối file plan. F5 user chốt CHƯA cần (nội bộ, ai cũng biết ai). **Đã chốt:** cấp avatar theo `totals.sessions` (0/10/50/150/365), không theo điểm. F6 sẵn sàng build khi user ra hiệu.
> **Cũng xong 2026-07-23:** accordion "Các bước" thêm **màn mờ** (mask gradient) gợi ý bấm mở; **dịch VN 100%** (96/96 bài EXDB). 9 bài KHÔNG có instruction (không có trong EXDB) → xem §11 để user xử lý.

> **MỚI (2026-07-25) — nghiên cứu Strava đã gộp vào Phần F của plan:** đối chiếu Strava (tracking theo môn + cộng đồng/hội nhóm), chia theo từng nhánh backlog. Chốt: **company-wide > follow-graph** cho nội bộ (không copy follow); **loại mọi thứ GPS** (segment đối-đầu-thời-gian) → PR chỉ **so với chính mình** + danh hiệu **theo tần suất** (Local-Legend-style); thêm nhánh **Thử thách nhóm** với **Group Goal hợp tác làm mặc định** (hợp công sở). Chi tiết ở từng mục Phần F ("Đối chiếu Strava"). Chưa đụng code.

---

## 1. App là gì
Từ một app theo dõi gym cá nhân 1-file (2 người), đã mở rộng thành **mạng xã hội tập luyện đa môn cho nhân viên công ty**: đăng nhập Google khoá domain, ghi mọi môn thể thao, feed công ty (tim + bình luận), streak + huy hiệu + màn mừng, bảng xếp hạng công ty/phòng ban theo điểm quy đổi, cài đặt riêng tư, hồ sơ đồng nghiệp.

## 2. Stack & chạy local
- **Preact 10 + htm** (qua import map, không build step) + **Firebase 10.14.1** (Auth/Firestore/Storage).
- Chạy: `python3 -m http.server 8000` trong thư mục dự án → mở `http://localhost:8000`.
  **KHÔNG mở trực tiếp file:// được** (ES module bị CORS chặn). Deploy: GitHub Pages / Firebase Hosting.
- Firebase project: **`apollo-sport-social`** (config đã nhúng trong `src/firebase.js`).
- Firebase CLI đã cài (15.24.0). **Java CHƯA cài** → emulator không chạy được (cần `brew install openjdk` nếu muốn dùng emulator). Hiện test bằng account thật hoặc dev-bypass tạm.

## 3. Bố cục file
```
index.html            # style (1-246 cũ) + import map + <script src=./src/main.js>
src/
  main.js             # render(GymPair)
  app.js              # ~1450 dòng: TẤT CẢ component UI + GymPair root (state/routing)
  html.js  config.js  firebase.js  auth.js
  ui/     theme.js icons.js primitives.js sound.js
  domain/ activities.js session.js stats.js streak.js period.js badges.js exercises.js constants.js format.js
          guides.js fitness-vocab.js                    # MỚI (hướng dẫn + dịch VN từ vựng)
  data/   local.js photos.js cloud.js(cũ, không dùng) repo-sessions.js repo-social.js repo-users.js repo-leaderboard.js repo-private.js
          exercises-db.js (tự sinh) instructions-vi.js   # MỚI (thư viện free-exercise-db + dịch bước VN)
  screens/ SignIn.js Onboarding.js PickActivity.js LogActivity.js FeedTab.js PostCard.js CommentsSheet.js LeaderboardTab.js Settings.js ProfileScreen.js
           GuidesScreen.js GuideDetail.js               # MỚI (kho hướng dẫn)
tools/  build-exercise-db.mjs   # dev: sinh src/data/exercises-db.js từ free-exercise-db (chạy lại được)
firebase/ firestore.rules storage.rules firestore.indexes.json firebase.json
```
**Lưu ý kiến trúc:** mọi component UI (HomeTab, CalendarTab, ActiveWorkout, SaveWorkout, SessDetail, ProgressTab, CelebrationModal, ProgsTab, PickEx, CreateProg, GymPair...) vẫn nằm CHUNG trong `src/app.js`. Các screen MỚI (feed/leaderboard/settings/...) đã tách file riêng trong `src/screens/`. Peel thêm component cũ ra file khi viết lại chúng.

## 4. Data model
**Firestore collections:**
- `users/{uid}`: `{uid,email,name,photoURL,dept,center,title,accent, prefs:{defaultVisibility,optOutLeaderboard,hideWeight,onboarded,sports}, streak:{current,longest,lastDate}, badges:[], totals:{sessions,minutes,points,volumeKg}}`
- `users/{uid}/private/weights`: `{entries:[{at,kg}]}` (cân nặng — chỉ chủ đọc)
- `users/{uid}/reacted/{sid}`: mirror tim của mình
- `sessions/{uid}_{id}`: buổi tập (schema mới, xem dưới)
- `sessions/{sid}/reactions/{uid}`, `sessions/{sid}/comments/{cid}`
- `leaderboard/{periodId}/entries/{uid}`: `periodId` = `w-2026-W30` / `m-2026-07`

**Session doc (mọi môn, discriminated theo `type`):**
```
{ id, authorUid, authorName, authorPhoto, dept,
  type, title, note, photoUrl, date:'YYYY-MM-DD', startTime, endTime, loggedAt,
  durationMin, activeMinutes, points, visibility:'company'|'private', streakAtPost,
  reactionCount, commentCount, schemaV:1,
  detail:{...} }   // gym: {progId,progName,dayName,totalVol,totalSets,exs:[...]}
                   // distance: {distanceKm,intensity,paceMinPerKm}
                   // session:  {intensity}
```
**Điểm quy đổi:** `points = round(activeMinutes × MET × k_cường_độ / 5)`, `activeMinutes=clamp(durationMin,0,180)`. MET theo môn ở `domain/activities.js`. Đây là trục xếp hạng chung (kg vô nghĩa với chạy/yoga).

**Mẫu quan trọng — "local mirror":** doc ghi lên Firestore là schema SẠCH. Bản lưu localStorage (`toLocal(sess)` trong app.js) thêm field top-level `exs/totalVol/progName/dayName` để các component gym cũ đọc được mà không phải sửa. Helper `exsOf(s)`/`volOf(s)` trong `stats.js` chịu được cả 2 schema.

## 5. Security rules & deploy
- File ở `firebase/`. Deploy: `cd firebase && firebase deploy --only firestore:rules,storage:rules,firestore:indexes --project apollo-sport-social`
- Rules: khoá `@apollo.edu.vn` (email_verified + domain), ownership qua doc-id `uid_id`, author fields bất biến, người khác chỉ đổi được `reactionCount/commentCount` ±1, cân nặng/private chỉ chủ, users tự-xoá được (cho xoá tài khoản), leaderboard entry chỉ chủ ghi.
- **Indexes cần build** (đã có trong indexes.json): sessions (visibility,loggedAt), (authorUid,loggedAt), (authorUid,visibility,loggedAt), (visibility,type,loggedAt); entries (dept,points). Nếu feed/hồ sơ báo "requires an index" → chờ build hoặc redeploy indexes.

## 6. Đã xong (Phase 0 → 3)
- **P0:** tách 1-file → ES modules, verify chạy y hệt.
- **P1:** Google auth + domain lock + `users/{uid}` + onboarding; schema đa môn + `points`; feed phân trang + thả tim; streak (`domain/streak.js`: computeStreak/advanceStreak/liveStreak); bảng xếp hạng công ty/phòng ban; batch ghi (session + user totals/streak + leaderboard entries).
- **P2:** Settings (đổi tên/dept, opt-out xếp hạng, ẩn cân nặng, tính lại chuỗi, **xoá tài khoản**); cân nặng → `users/{uid}/private/weights`; Hồ sơ đồng nghiệp (ProfileScreen, bấm avatar); UX (lịch chấm màu theo môn, SessDetail rẽ nhánh gym/môn khác); **dọn code chết** + **xoá dev-bypass**.
- **P3:** huy hiệu (`domain/badges.js` + `awardBadges` trong app.js, lưu `users/{uid}.badges`); **CelebrationModal đa môn** (headline + summaryStats + streak + badges, activity cũng có màn mừng); cảnh báo "sắp mất chuỗi" ở Home; Home revamp 3 tile = **Chuỗi / Tuần này / Phút tuần** (bỏ Volume-kg gym-centric).
- Tất cả đã verify render trên trình duyệt. User đã E2E bằng account thật, OK.

## 7. ĐÃ XONG — Log phong phú theo môn, "mức Vừa" (2026-07-21)
Log cho từng môn sâu hơn, **KHÔNG ghi thắng/thua** (nhạy cảm công sở). `detail` là object tự do → **không migrate schema, không đổi rules, không đổi cách tính điểm**. Đã verify: 5 file syntax OK, app render (sign-in) không lỗi console, unit-test node cho build+summary+points/pace của run/swim/cycle/football/yoga/other đều đúng.

**Đã làm:**
1. **Ô riêng theo từng môn** — `domain/activities.js`: mỗi activity khai báo `fields` riêng; `fieldsOf(type)` = `a.fields || FIELDS[kind] || FIELDS.session`. `LogActivity.js` render theo `fieldsOf(type)`.
   - Bơi: kiểu bơi (select), chiều dài bể (seg 25/50m), quãng đường (m → `distanceM`), pace/100m (tự tính).
   - Chạy/đi bộ: km, pace tự tính, [chi tiết] độ cao (m), nhịp tim (bpm) / số bước.
   - Đạp xe: km, tốc độ TB km/h (tự tính), trong/ngoài nhà (seg), [chi tiết] độ cao.
   - Leo núi: km, độ cao leo (m). Yoga: trường phái + [chi tiết] mục tiêu (select).
   - Đối kháng (đá/rổ/cầu lông/tennis/pickleball): counter số hiệp/ván (không thắng/thua).
2. **Loại ô mới** trong `LogActivity.js`: `select` (chip wrap), `counter` (±), `time` (mm:ss), `pace` (chỉ hiển thị, tự tính km / km/h / 100m). Đã có `number`, `seg`.
3. **Progressive disclosure:** field có `adv:true` (+ lap builder) ẩn dưới nút "Thêm chi tiết ▾".
4. **Lap builder tuỳ chọn** cho môn có `laps:true` (run/walk→no, cycle/swim/run): thêm hàng {dist, time mm:ss} → lưu `detail.laps=[{n,dist,time}]`. Hiện dưới "Thêm chi tiết".
5. **Feed footer đúng môn** — `summaryStats()` trong `session.js`: bơi /100m (`pace100Label`), đạp xe km/h (`speedKmh`), chạy/đi/leo /km (`paceLabel`). Mỗi stat có thêm `l` (nhãn) cho SessDetail; icon mới `wave`/`gauge` thêm vào STAT_EMOJI ở `PostCard.js` + `app.js`.
   - `buildActivitySession` giờ **field-driven**: `collectDetail(type,vals)` gom mọi field (ép kiểu number/counter, bỏ ô rỗng), tự tính `paceMinPerKm`, gắn `laps`.
   - **SessDetail** (`app.js`) hiển thị `detailChips` (kiểu bơi/trường phái/độ cao/số ván...) + bảng "Chi tiết chặng" cho non-gym.

**Còn có thể nâng (Nhẹ, tuỳ chọn sau):** onSave của `LogActivity` truyền `vals` object (không phải field phẳng) — nếu thêm field mới chỉ cần sửa `activities.js`. Lap builder chưa cộng vào điểm/summary (chỉ hiển thị) — đúng ý "tuỳ chọn".

## 7b. ĐÃ XONG — Bớt gym-centric + Kho Hướng dẫn (2026-07-22)
Plan: `/Users/hoangdanganhkhang/.claude/plans/t-m-g-c-l-i-phase-cozy-duckling.md`. **Nguyên tắc: gym KHÔNG bị giảm tính năng**, chỉ bớt độc quyền màn mặc định; công sức dồn nâng môn khác + thêm hướng dẫn.

**Phần A — bớt gym-centric (đã verify bằng harness `_progtest.html` tạm, đã xoá):**
- `domain/stats.js`: thêm helper đa môn `weeklyActive` / `sportBreakdown(sinceDays)` / `distanceProgress(type)` (unit-test node OK). Giữ nguyên helper gym.
- Vá "0 kg": `app.js` HomeTab thẻ Gần đây + CalendarTab (tháng → "buổi · phút"; thẻ ngày dùng `primStat()` — chỉ số nổi bật đa môn). `primStat` là helper module-level mới.
- **Viết lại `ProgressTab`** (`app.js`) thành **lai**: chip chọn `view` (Tổng quan | từng môn user đã tập). Tổng quan = điểm/phút/buổi tuần + "Phân bổ theo môn" (bar màu) + "Điểm theo tuần" + thẻ cân nặng (đã dời lên đây). Drill-down: **gym giữ NGUYÊN** (SegToggle bài/buổi, volume/PR/1RM); distance → pace/km hoặc /100m (bơi) hoặc km/h (đạp) + km/tuần; session → buổi/phút/điểm. `dayOptions` giờ lọc gym-only.

**Phần B — Kho Hướng dẫn (format-first, nội dung để sau; đã verify bằng `_guidetest.html` tạm, đã xoá):**
- `domain/guides.js` (MỚI): registry tĩnh `GUIDES` + helper `guidesForSport`/`guideForExercise`/`guideById`/`allGuides`. Schema: `{id, scope:'sport'|'exercise', sport, exId, title, level, summary, media:[{type,src,caption}], sections:[{heading,body}], tips, safety}`. **media để trống** — UI có placeholder "Hình/video sắp có". Hiện có 3 bài MẪU (run, gym nhập môn, incline-bench). **Nội dung thật đổ sau — chỉ thêm object vào GUIDES.**
- `screens/GuidesScreen.js` + `screens/GuideDetail.js` (MỚI). Routing `app.js`: `pg='guides'`, `pg='guide-detail'`. pgCtx cho guide-detail = `{guide, back}` (nút quay lại tuỳ ngữ cảnh, qua helper `openGuide(guide, back)`).
- **3 lối vào:** (a) thẻ "📖 Hướng dẫn tập luyện" trong tab Cá nhân; (b) link "📖 Hướng dẫn" tại mỗi bài trong `ActiveWorkout` khi `guideForExercise(exId)` có (overlay khi đang tập — có thêm nhánh `guide-detail` TRONG block `active && showWorkout`); (c) banner "📖 Hướng dẫn <môn>" ở đầu `LogActivity` khi `guidesForSport(type)` có.
- **Lưu ý:** back từ guide mở tại LogActivity sẽ về form TRỐNG (component remount) — chấp nhận vì link ở đầu, đọc trước khi điền.

**Phần C — Hướng dẫn CHI TIẾT + video YouTube + auto-fallback (2026-07-22, verify bằng harness tạm đã xoá):**
- `domain/guides.js`: thêm `ytSearchUrl(query)` (→ `youtube.com/results?search_query=...`, space→+). Schema guide thêm `muscles`, `equipment`, `steps:[{text,media?}]`, `mistakes:[]`, `ytQuery`. **`guideForExercise(exId)`**: có bài viết tay → trả bài đó; **không có → tự sinh `autoExerciseGuide` từ EX** (`auto:true`, tên+nhóm cơ+link YouTube `how to do <name>`+lưu ý chung) → **mọi bài gym đều có nút Hướng dẫn**. `richGuides()` = chỉ bài viết tay (dùng cho `GuidesScreen`, không phình 115 stub). Bài mẫu viết tay đầy đủ: **`ex-incline-bench`** (văn phong bình dân, 6 bước + 4 lỗi + mẹo + an toàn) — **để user DUYỆT FORMAT trước khi nhân lên 5–8 bài**.
- `screens/GuideDetail.js` viết lại: nút đỏ **"▶ Xem video hướng dẫn (YouTube)"** (target=_blank), chip nhóm cơ/dụng cụ, **"Các bước thực hiện"** đánh số (mỗi bước có ô ảnh placeholder), khối **"❌ Lỗi thường gặp"**, giữ sections/tips/safety/disclaimer; `auto:true` → chỉ hiện tên+cơ+video+an toàn + ghi chú "đang bổ sung" (ẩn placeholder rỗng).
- **Quy tắc viết** (đợt sau, xem plan §C4): tiếng Việt phổ thông, câu ngắn, mỗi bước 1 ý, giải thích mọi thuật ngữ.
- **VIỆC TIẾP:** user duyệt bài incline-bench → chốt format → viết thêm ~5–8 bài (ưu tiên squat, bench, deadlift, các bài phổ biến) + vài bài sport-level. Ảnh minh hoạ user tự tìm, dán vào `media`/`steps[].media`.

## 7d. ĐÃ XONG — Tích hợp thư viện free-exercise-db (ẢNH THẬT, 2026-07-22, verify harness đã xoá)
Nguồn: **free-exercise-db** (`yuhonas/free-exercise-db`, **Unlicense/public domain**, 873 bài). **Giai đoạn 1: enrich 112 bài EX** — KHÔNG đụng danh tính EX / dữ liệu buổi tập.
- **`tools/build-exercise-db.mjs`** (dev, chạy lại được): tải `dist/exercises.json` → `tools/exdb.json` (curl, lệnh in sẵn nếu thiếu), khớp bảng tay `MAP` (EX.id→library.id), xuất **`src/data/exercises-db.js`** (`export const EXDB`). Kết quả: **96/105 bài matched**; 9 bài niche (single-leg-press, meadows-row, lat-pull-in, pendlay-row, elbows-out-row, cable-face-pull, reverse-grip-ez-curl, supinated-ez-curl, cable-tricep-kickback) → auto-YouTube. Muốn sửa khớp: sửa `MAP` rồi chạy lại script.
- **Ảnh**: hotlink jsDelivr `https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/<path>` (2 ảnh tư thế/bài; cần mạng). Đã verify 200 + load thật trong app.
- **`src/domain/fitness-vocab.js`** (mới): map VN cho nhóm cơ/dụng cụ/trình độ/force/mechanic + helper `vMuscles/vEquip/vLevel`.
- **`src/data/instructions-vi.js`** (mới): bản dịch VN từng bước, **ĐIỀN DẦN** (`EX.id: [câu...]`); hiện có `squat`, `deadlift`. Có VN → dùng VN, không thì tiếng Anh + nhãn "bản dịch đang cập nhật".
- **`guides.js`**: `guideForExercise` ưu tiên **bài viết tay (GUIDES) → library (EXDB) → auto stub**. `libraryGuide()` dựng guide từ EXDB (ảnh + nhóm cơ VN + các bước + `source:'free-exercise-db'`).
- **`GuideDetail.js`**: render ảnh library, nhãn "bản dịch đang cập nhật" khi bước còn tiếng Anh, dòng credit "free-exercise-db (public domain)".
- **VIỆC TIẾP (dịch dần):** thêm bản dịch VN vào `instructions-vi.js` cho các bài phổ biến (bench-press, barbell-row, lat-pull, ohp, deadlift đã có, squat đã có...). Không cần đụng gì khác.
- **Giai đoạn 2 (ĐỂ DÀNH):** "bách khoa 800 bài" — màn duyệt/tìm theo nhóm cơ/dụng cụ, **lazy-fetch** full `exercises.json` (~1MB) khi mở; chưa làm.

**Đã E2E account thật OK** (A/B/C/D) — user xác nhận 2026-07-23.

## 8. Để dành sau — Phase 4 (user đã note lại)
Cần hạ tầng/tiền/quyết định thêm, làm sau:
- **Thử thách nhóm/phòng ban** (mục tiêu chung + thanh tiến độ) — không tốn phí; cần quyết ai được tạo (đề xuất cờ isAdmin).
- **Kiểm duyệt** báo cáo/ẩn bài — nhẹ, nên làm kèm.
- **Cloud Functions** (tính lại xếp hạng ban đêm chống gian lận + dọn ảnh Storage/comment khi xoá tài khoản) — **cần nâng Firebase Blaze** (gắn thẻ, ~$0/tháng), thêm thư mục `functions/`.
- **Push notification** (FCM + service worker) — cần Blaze; **hạn chế iOS** (chỉ chạy khi cài PWA vào màn hình chính, iOS≥16.4).

## 9. Gotchas / lưu ý
- **Đăng nhập Google:** dùng popup, fallback redirect cho iOS in-app webview. `hd` chỉ là gợi ý — rules mới là hàng rào thật.
- **Dev-bypass:** đã XOÁ khỏi code. Trước đây từng thêm tạm `?dev` trên localhost để xem UI không cần popup Google (inject user giả; rules vẫn chặn server). Nếu cần verify UI khi đã đăng nhập mà không có account, thêm lại tạm rồi xoá.
- **Xoá tài khoản** hiện xoá sessions + entries + user doc + private; CHƯA dọn ảnh Storage + comment ở bài người khác (chờ Cloud Function P4).
- **Cân nặng** local-first + đồng bộ `users/{uid}/private/weights`. Không bao giờ lên feed/leaderboard.
- **Kho hướng dẫn (guides):** `guideForExercise(exId)` ưu tiên bài viết tay `GUIDES` → thư viện `EXDB` (ảnh thật) → auto-YouTube stub. Danh sách duyệt (`GuidesScreen`) chỉ hiện bài viết tay (`richGuides()`). Ảnh library hotlink jsDelivr (cần mạng). Sửa khớp bài ↔ thư viện: sửa `MAP` trong `tools/build-exercise-db.mjs` rồi chạy lại.
- Kế hoạch gốc đầy đủ (A→E): `/Users/hoangdanganhkhang/.claude/plans/t-m-g-c-l-i-phase-cozy-duckling.md`

## 10. Improvement backlog E2–E4 — ĐÃ XONG (2026-07-23); E1 còn lại
Chi tiết + câu hỏi mở ở **Phần E** của plan file. **E2/E3/E4 + dịch VN đã làm & verify** (harness `_etest.html` tạm đã xoá: thumbnail EXDB load thật, accordion thu gọn mặc định, bước không còn placeholder, bản dịch VN hiển thị).

**E1 — Khảo sát nội bộ trước khi đầu tư môn khác (product, không phải code) — CHƯA làm.** App còn nhiều thứ chuyên gym (chương trình, ActiveWorkout set builder, drill-down gym) mà môn khác chưa có tương đương. Trước khi mở rộng nền tảng cho mọi môn → **khảo sát nhân viên thích môn nào** rồi đầu tư có trọng điểm. Cân nhắc 1 màn "môn bạn quan tâm?" lúc onboarding, hoặc form ngoài.

**✅ E2 — Icon tròn trước tên bài tập gym.** Thêm component module-level **`ExThumb`** trong `src/app.js` (dùng `EXDB[exId]?.images[1]` = 1.jpg ending position; fallback chữ cái đầu). Gắn vào `PickEx` (mỗi bài) + header bài trong `ActiveWorkout`. Import `EXDB` vào app.js.

**✅ E3 — GuideDetail: bỏ ô ảnh từng bước + rút gọn câu chữ.** Bỏ `imgPlaceholder(64,null)` trong `steps.map` của `GuideDetail.js` (giữ ảnh hero). Rút gọn bước ở `instructions-vi.js` (squat/deadlift) + bài viết tay incline-bench trong `guides.js`.

**✅ E4 — Guide dạng accordion thu gọn.** Phần "Các bước thực hiện" trong `GuideDetail` **mặc định thu gọn** (state `stepsOpen=false`, header bấm mở, hiện "N bước ▾"). **Chỉ collapse phần "Các bước"** (phần cơ bản nhất); sections/mẹo/lỗi/an toàn vẫn hiện — nếu muốn collapse thêm thì mở rộng sau.

**✅ (dịch dần)** Đã thêm bản dịch VN cô đọng vào `src/data/instructions-vi.js`: bench-press, barbell-row, lat-pull, ohp, push-up, pull-up, bicep-curl (squat/deadlift đã có từ trước, đã rút gọn lại). Thêm bài khác: chỉ thêm `EX.id: [câu VN...]`, không đụng gì khác.

Ràng buộc giữ nguyên: không đổi schema/rules/cách tính điểm; `EX.id` bất biến.

## 11. VIỆC KẾ TIẾP — Backlog từ khảo sát app fitness khác (user chốt 2026-07-23, CHƯA làm)
Sau khi khảo sát Strava + các app corporate wellness (Vantage Fit, GoJoe, Wellness360...), đối chiếu 10 tính năng liên quan với app hiện tại, user đã chốt giữ lại và sắp xếp lại theo mức ưu tiên. Chi tiết + câu hỏi mở ở **Phần F** của plan.

**Làm sớm (không cần research lớn):**
- **✅ F0 — ĐÃ XONG (2026-07-23).** Cho phép user **sửa (edit)** nội dung nhật ký bài đã đăng của CHÍNH MÌNH. Phạm vi an toàn: chỉ **title + note** (không đổi điểm/streak/xếp hạng/detail → tránh cộng trùng leaderboard/totals). `updateSessionContent(uid,id,{title,note})` trong `repo-sessions.js` (dùng `updateDoc`, không đụng aggregate). `SessDetail` (app.js) có nút bút chì (chỉ hiện khi `authorUid===pid`) → panel sửa title/note + nút Lưu/Huỷ. Handler `editSession` cập nhật cache cục bộ + pgCtx + cloud. Rules KHÔNG cần đổi (đã cho chủ bài update mọi field trừ authorUid/loggedAt/date/counters). **CHƯA E2E account thật** (nút chỉ hiện trên bài của mình khi đã đăng nhập). Nếu sau muốn cho sửa cả metric (duration/distance) → phải xử lý diff điểm/leaderboard (chưa làm, có chủ đích).

**✅ F0 mở rộng — Quản lý bài đăng & bình luận (2026-07-23):**
- **Sửa bài từ Bảng tin:** `PostCard` có nút **⋯** trên bài của chính mình (prop `myUid`/`onManage`) → mở `SessDetail` (nơi có sửa/xoá). `FeedTab` nhận `myUid`/`onManage`/`refreshKey`; app bump `feedKey` sau khi sửa/xoá để feed nạp lại.
- **Sửa ảnh:** `SessDetail` panel sửa có ô ảnh (chọn ảnh mới / gỡ ảnh) — pattern giống `SaveWorkout`. `editSession` xử lý `photoFile`(compress+upload) / `removePhoto`(null + `deleteSessionPhoto` best-effort). `updateSessionContent` giờ ghi cả `photoUrl`. `photos.js` thêm `deleteSessionPhoto` (deleteObject).
- **Sửa bình luận của mình:** `repo-social.editComment` (updateDoc text + editedAt). `CommentsSheet` có nút "Sửa" cho bình luận của mình (inline textarea), nhãn "· đã sửa". **RULES ĐỔI** (`allow update` cho chủ comment) → **PHẢI DEPLOY** (xem banner đầu file).
- **Xoá bài kèm số liệu:** `deleteSessionWithStats(session, me, remaining)` trong `repo-sessions.js` — batch xoá doc + giảm totals + **tính lại streak** (computeStreak) + **tính lại entry leaderboard tuần & tháng** từ buổi còn lại (`recomputePeriodEntry`, khớp công thức cap 120 phút/ngày; xoá hết → xoá entry). Nút "Xoá bài đăng" đỏ trong panel sửa của `SessDetail` (window.confirm). Handler `deletePost` cập nhật cache + userDoc cục bộ. **Không hoàn nguyên PR & huy hiệu** (chấp nhận). Logic đã unit-test node (cap/loại private/xoá entry đúng).
- **CHƯA E2E account thật** (đều là luồng cần đăng nhập). Đã verify: syntax OK, app render sạch (module graph), logic delete test OK. Lưu ý HTTP-cache: đổi cổng hoặc hard-reload khi test sau khi sửa module.

**Nội dung hướng dẫn — ĐÃ XONG dịch VN 100% (2026-07-23):**
- `src/data/instructions-vi.js`: dịch VN cô đọng đủ **96/96 bài EXDB** (verify bằng script: không sót/trùng/rỗng). Bài viết tay incline-bench trong `guides.js` vẫn thắng.
- **9 bài KHÔNG có instruction** (không match EXDB → hiện auto-YouTube stub, KHÔNG có các bước). **User cần xử lý sau** (viết tay vào `GUIDES` trong `guides.js`, hoặc sửa `MAP` trong `tools/build-exercise-db.mjs` để khớp thư viện rồi chạy lại):
  1. `single-leg-press` — Single-Leg Leg Press (Chân)
  2. `meadows-row` — Meadows Row (Lưng)
  3. `lat-pull-in` — 1 Arm Lat Pull-in (Lưng)
  4. `pendlay-row` — Pendlay Row (Lưng)
  5. `elbows-out-row` — Cable Seated Elbows-Out Row (Lưng)
  6. `cable-face-pull` — Cable Face Pull (Vai)
  7. `reverse-grip-ez-curl` — Reverse Grip EZ Bar Curl (Tay)
  8. `supinated-ez-curl` — Supinated EZ Bar Curl (Tay)
  9. `cable-tricep-kickback` — Cable Triceps Kickback (Tay)

**Research song song trước khi code (3 nhánh độc lập):**
- **Cục A — Role Admin.** Hạ tầng quyền quản trị (`isAdmin` hay tương tự). Phục vụ trước cho thử thách nhóm (Phase 4 cũ), dùng lại sau cho Dashboard HR (F4) và phần kiểm duyệt tự động (F5).
- **Cục B — PR đa môn + Goal setting.** Cần định nghĩa "kỷ lục cá nhân" (PR) cho từng môn ngoài gym (chạy/bơi/đạp/leo núi...) — câu hỏi mở: PR là pace tốt nhất ở cự ly nào, hay quãng đường xa nhất...? Từ định nghĩa PR này mới thiết kế được mục tiêu cá nhân (Goal setting) vì mục tiêu thường đặt theo các chỉ số này.
- **F2 — Câu lạc bộ (Clubs) theo sở thích, không theo phòng ban.** Đứng riêng, không phụ thuộc 2 cục trên. Câu hỏi mở: club tạo tự do hay chỉ có sẵn theo môn? Ai được tạo club?

**Để dành phase sau (khi trải nghiệm hiện tại ổn định):**
- **F4** Dashboard cho HR/Admin (dùng lại Cục A).
- **F5** Kiểm duyệt tự động bắt keyword nhạy cảm + report (phần edit đã tách lên F0 làm sớm). Ghi chú kỹ thuật: Firestore Security Rules hỗ trợ regex match trên string field → có thể chặn/gắn cờ từ khoá **không cần nâng Blaze/Cloud Functions**, cần verify lại khi bắt tay.
- **F6** Làm giàu huy hiệu (badges) + bảng vinh danh, và (sau, cần xin budget) phần thưởng đổi điểm (voucher...). Note gộp chung, để làm sau hết theo ý user dù badge/vinh danh không tốn ngân sách.

**Đã cân nhắc và loại bỏ (không làm):**
- Đồng bộ thiết bị (Strava/Apple Health/Google Fit/Garmin), push notification — quá phức tạp/tốn hạ tầng so với lợi ích cho app nội bộ quy mô nhỏ.
- Ghép cặp bạn tập (quay lại ý tưởng gốc "GymPair") — user muốn giữ app thuần cá nhân + xã hội, không thêm cơ chế ghép đôi 1-1 (dễ tạo cảm giác thiên vị/khó xử giữa đồng nghiệp — cùng tinh thần với nguyên tắc sẵn có "không ghi thắng/thua vì nhạy cảm công sở").

## 12. ✅ CỤC A — Role Admin (hạ tầng, 2026-07-25)
**Quyết định user chốt:**
- Quyền admin = collection **`admins/{uid}`** (không phải field trên user doc — tránh user tự set `isAdmin=true` vì rules cho user update doc của mình).
- Quyền admin **CỘNG THÊM**, không thay thế vai trò user: người trong `admins/{uid}` vẫn log tập, lên bảng xếp hạng, tham gia bình thường. (User muốn "vừa admin vừa user, switch được" → mô hình cộng thêm thoả mãn; toggle "chế độ admin" trong UI để sau, chỉ là boolean client.)
- **v1 chỉ hạ tầng (flag + rules), CHƯA UI.** Không build màn Admin; sau này dùng nút rải rác + phong admin qua Console.

**Đã làm & deploy:**
- `firebase/firestore.rules`:
  - Hàm `isAdmin()` = `exists(/databases/.../admins/$(uid))`.
  - `match /admins/{uid}`: **read** cho domainOk (ai cũng biết ai là admin), **write: if false** (chỉ set qua Console/server, client không ghi được).
  - `sessions`: admin được **read mọi bài** (kể cả private — phục vụ F4 dashboard sau; nếu muốn siết lại chỉ company thì bỏ `|| isAdmin()` ở rule read), **update mọi bài** (kiểm duyệt/ẩn — F5), **delete mọi bài** (gỡ vi phạm).
  - `comments`: admin **delete** mọi bình luận (kiểm duyệt).
  - ĐÃ deploy (`firebase deploy --only firestore:rules`), compile OK.
- Client: `repo-users.js` thêm `isAdminUser(uid)` (đọc `admins/{uid}`, fail-closed → false nếu lỗi). `app.js` thêm state `isAdmin`, load sau đăng nhập trong effect `watchAuth`, reset khi logout. **Chưa có UI dùng cờ này** — để dành.
- Verify: node --check 2 file OK; app render sign-in sạch, không lỗi console; module mới nạp OK.

**UI kiểm duyệt v1 (2026-07-25):**
- State `adminMode` (mặc định false) + derived `moderating = isAdmin && adminMode`. Reset khi logout / mất quyền admin.
- **Toggle "Chế độ quản trị"** trong `Settings.js` — section "Quản trị" **chỉ render nếu `isAdmin`** (đúng yêu cầu "chỉ admin mới có nút switch"). Props mới: `isAdmin/adminMode/onToggleAdminMode`.
- **Banner tím** ở layout chính khi `moderating` bật, có nút "Thoát" (`setAdminMode(false)`).
- **Xoá bài người khác:** `PostCard` nhận `moderating/onAdminDelete` → khi `moderating && !mine` hiện nút **🛡 Xoá** (confirm). `FeedTab` truyền xuyên. Handler `adminDeletePost` (app.js) gọi `adminDeleteSession` (repo-sessions: **chỉ xoá doc, KHÔNG hoàn nguyên số liệu tác giả** — client không có sessions của họ; chấp nhận lệch, reconcile sau bằng Cloud Function) + xoá ảnh best-effort + bump `feedKey`.
- **Xoá bình luận người khác:** `CommentsSheet` nhận `canModerate` → `canDelete = own || postAuthor || canModerate`. Xoá vẫn qua `deleteComment` (rules cho admin delete mọi comment).
- **Storage rules:** thêm `isAdmin()` (dùng `firestore.exists(admins/{uid})`) → admin xoá được ảnh bài vi phạm. ĐÃ deploy.

**VIỆC TIẾP để E2E:** tạo tay doc `admins/{your-uid}` (vd `{}`) trong Firebase Console → đăng nhập → vào **Cài đặt** sẽ thấy mục "Quản trị" → bật toggle → banner tím hiện, nút 🛡 Xoá xuất hiện trên bài người khác + nút Xoá trên mọi bình luận.

**Lưu ý khi xây tính năng phụ thuộc Cục A:** cờ `isAdmin`/`adminMode` đã có sẵn trong component `GymPair` (state). Rules đã cho admin quyền rộng trên sessions/comments/storage; khi thêm collection mới (clubs/challenges) nhớ thêm nhánh `isAdmin()` tương ứng nếu admin cần quản trị chúng.

## 13. ✅ CỤC B — PR đa môn + Goal setting (2026-07-26)
**Quyết định user chốt:** PR chỉ SO VỚI CHÍNH MÌNH, bỏ mọi thứ GPS. PR distance = **xa nhất 1 buổi + tổng tuần cao nhất + buổi dài nhất (phút)**. Goal v1 = **số buổi/tuần + số phút/tuần**. Hiển thị **cả ProgressTab lẫn Hồ sơ**. Môn **đối kháng bỏ PR** (chỉ đếm buổi/phút).

**Định nghĩa PR (theo kind môn):**
- **distance** (run/walk/cycle/swim/hiking): xa nhất 1 buổi (km, bơi→m) · tổng tuần cao nhất (km/m) · buổi dài nhất (phút).
- **session KHÔNG đối kháng** (yoga/other): buổi dài nhất (phút) · tổng phút tuần cao nhất.
- **đối kháng** (football/basketball/badminton/tennis/pickleball) & **gym**: KHÔNG có PR ở đây (gym vẫn có PR tạ/1RM cũ trong drill-down). `COMBAT_SPORTS` set trong stats.js.

**Đã làm:**
- `domain/stats.js` (helpers thuần, unit-test node OK):
  - `COMBAT_SPORTS` (set 5 môn đối kháng).
  - `personalRecords(sessions, type, kind)` → `[{key,label,value,unit}]` theo quy tắc trên. Distance quy về mét nội bộ (bơi hiện m, còn lại km 1 chữ số thập phân).
  - `currentWeekActivity(sessions)` → `{count,minutes,points}` tuần hiện tại (để so mục tiêu).
- `data/repo-sessions.js`: `allSessionsOf(uid,{isSelf})` — lấy toàn bộ buổi (cap 400) để tính PR trên Hồ sơ (isSelf=false chỉ 'company', khớp rules). ProfileScreen giờ dùng hàm này thay `historyOf` (recent = slice 12 đầu).
- **Goal data model:** `users/{uid}.goals = { sessionsPerWeek, minutesPerWeek }`. Lưu qua `updateUserDoc` (merge). **KHÔNG đổi rules** (field cộng thêm; update rule chỉ ràng buộc uid/email/streak). Không đổi schema sessions/cách tính điểm.
- **ProgressTab (app.js):** props mới `goals`, `onSaveGoals`. Overview có **thẻ "Mục tiêu tuần này"** (đặt/sửa buổi+phút, thanh tiến độ, ✅ khi đạt). Drill-down distance & session (không đối kháng) có **thẻ "🏆 Kỷ lục cá nhân"** (`prCard`). Handler `saveGoals` trong GymPair (cập nhật local + cloud).
- **ProfileScreen:** section **"🏆 Kỷ lục cá nhân"** theo từng môn đã tập (từ `allSessionsOf`). **Thẻ "🎯 Mục tiêu tuần"** CHỈ hiện trên hồ sơ CỦA MÌNH (`isSelf`) — cố ý không phơi mục tiêu người khác (nhất quán nguyên tắc riêng tư của app).
- Verify: syntax OK, unit-test personalRecords/currentWeekActivity đúng (run/swim/yoga/football/gym + tuần hiện tại), app render sạch không lỗi console. **CHƯA E2E account thật.**

**Còn có thể nâng (sau):** danh hiệu "Chăm chỉ nhất môn X tháng này" (theo tần suất, Local-Legend-style) → thuộc F6 (badges/vinh danh). Goal per-môn (vd 20km chạy/tuần) — v1 để global buổi+phút cho gọn. PR pace/tốc độ đã CỐ Ý bỏ (tránh áp lực + gian lận nhập tay).

## 14. 🚧 NHÓM (Câu lạc bộ) — Đợt 1 XONG code (2026-07-26), CHƯA E2E
Gộp "CLB + Thử thách nhóm" thành 1 khái niệm: **Nhóm (Club)** thường trực + (Đợt 2) **Mục tiêu chung** tùy chọn. User chốt: ai cũng tạo tự do (public/invite-only), feed nhóm = **bài của THÀNH VIÊN, CHỈ đúng môn của nhóm**, không leaderboard group-vs-group. (Timer thời gian thực để làm sau — quyết định riêng.)

**Data model (mới):**
- `clubs/{clubId}`: `{id,name,sport,desc,coverEmoji,ownerUid,ownerName,visibility:'public'|'invite',memberCount,createdAt}`. clubId = `<sport>-<rand8>`.
- `clubs/{clubId}/members/{uid}`: `{uid,name,photoURL,role:'owner'|'member',joinedAt}`.
- `clubs/{clubId}/joinRequests/{uid}`: `{uid,name,photoURL,requestedAt}` (chỉ invite-only).

**Rules (ĐÃ deploy):**
- `clubs`: đọc domainOk; tạo nếu ownerUid==me & memberCount==1 & name hợp lệ; update nếu chủ/app-admin **hoặc chỉ đổi memberCount ±1** (`onlyMemberCountDelta`, cho join/leave); delete nếu chủ/app-admin.
- `members`: public → tự join (uid==me, club public, role member); invite → chỉ chủ thêm; xoá nếu chính mình / chủ / app-admin.
- `joinRequests`: user tạo/xoá của mình; chủ đọc & xoá (duyệt/từ chối).
- **Recursive** `match /{path=**}/members/{memberId} allow read` — cho query collection-group "nhóm của tôi".
- **Index (ĐÃ deploy):** fieldOverride `members.uid` (COLLECTION + COLLECTION_GROUP). Feed nhóm dùng lại index `(visibility,type,loggedAt)` sẵn có.

**Code mới:**
- `src/data/repo-clubs.js`: createClub · listClubs · myClubIds (collectionGroup) · getClub · listMembers · joinPublicClub/leaveClub (batch + memberCount±1) · requestJoin/myJoinRequested/listRequests/approveRequest/denyRequest · deleteClub (best-effort dọn sub) · **clubFeedPage(cursor,sport,memberSet)** (query sessions theo môn rồi lọc client theo thành viên).
- `src/screens/ClubsScreen.js`: danh sách (Nhóm của bạn / Khám phá) + modal Tạo nhóm (tên/môn/công khai-cần duyệt/mô tả).
- `src/screens/ClubDetail.js`: header + nút Tham gia/Rời/Yêu cầu/Chủ nhóm; duyệt yêu cầu (chủ, invite); avatar thành viên; **feed nhóm** (PostCard + tim inline, phân trang cuộn); nút Xoá nhóm (chủ hoặc app-admin, confirm).
- `app.js`: import + routing `pg='clubs'`/`'club-detail'`; **thẻ "👥 Câu lạc bộ"** trong tab Cá nhân (trên thẻ Hướng dẫn).

**Đã verify:** node --check tất cả OK, rules compile + deploy OK, app render sign-in sạch không lỗi console. **CHƯA E2E account thật** (mọi luồng cần đăng nhập). Test: đăng nhập → tab Cá nhân → Câu lạc bộ → Tạo nhóm → tham gia bằng account khác → đăng buổi đúng môn → xem hiện trong feed nhóm.

**Known quirk (chấp nhận Đợt 1):** routing 1-page (không stack) → mở **bình luận / hồ sơ** từ trong feed nhóm khi đóng sẽ về **Trang chủ**, không về lại nhóm. Tim/join/leave/duyệt thì ở nguyên trong nhóm. Sửa sau nếu cần (thêm "back target" cho openComments/openProfile).

**Đợt 2 (chưa làm) — Mục tiêu chung:** collection `goals/{id}` (scope club|company) + `goals/{id}/progress/{uid}`; tính lại từ sessions mỗi lần mở màn; cap thô chống gian lận. Xem đề xuất ở lịch sử chat / plan.

## 14b. ✅ Nhóm — Mời thành viên + Đổi cổng vào (2026-07-26, CHƯA E2E)
Bổ sung cho Đợt 1:
- **Mời theo tên/email + popup noti (không realtime):**
  - Model: `clubs/{clubId}/invites/{toUid}` `{toUid,toName,fromUid,fromName,clubId,clubName,clubSport,createdAt}`.
  - Rules: chủ nhóm tạo (fromUid==me); người được mời/chủ/admin xoá; **recursive read** `/{path=**}/invites` cho query "lời mời của tôi"; **member create thêm nhánh** "được mời → tự vào" (kể cả invite-only) nếu `exists(invites/{me})`. Index fieldOverride `invites.toUid` (COLLECTION_GROUP). ĐÃ deploy.
  - `repo-users.listAllUsers()` (cap 500) để tìm; `repo-clubs`: inviteToClub · myInvites (collectionGroup) · acceptInvite (batch: member+count+xoá invite) · dismissInvite · listClubInvites.
  - UI: `ClubDetail` (chủ) có nút **"＋ Mời thành viên"** → modal tìm theo tên/email → Mời. **Popup noti ở app root** (`app.js`, state `invites`, nạp trong effect theo `pid`) hiện khi vào app/reload: "Bạn có lời mời vào nhóm" + Tham gia/Bỏ qua. Refetch = lúc load (đúng ý "không cần realtime, hiện khi reload").
- **Đổi cổng vào nhóm:** `repo-clubs.updateClubVisibility`. Panel "Quản lý nhóm" (chủ) trong `ClubDetail` có toggle **Công khai ↔ Cần duyệt**. Rules update cho chủ đã có sẵn (không đổi rules).

## 15. ✅ Đợt 2 — MỤC TIÊU CHUNG (Group Goal hợp tác, 2026-07-26, CHƯA E2E)
Hợp tác, **không xếp hạng group-vs-group**. Gắn **nhóm** (scope=club) hoặc **toàn công ty** (scope=company). Ai cũng tạo. Tính đóng góp **lại từ sessions mỗi lần mở màn**.
- **Model:** `goals/{goalId}` `{id,title,scope,clubId,clubName,metric:'sessions'|'minutes'|'distanceKm',sport|null,target,startDate,endDate,creatorUid,creatorName,createdAt}` + `goals/{goalId}/progress/{uid}` `{uid,name,value,updatedAt}`.
- **Rules (ĐÃ deploy):** goals đọc domainOk; tạo nếu creatorUid==me & scope/metric hợp lệ & target>0; sửa/xoá nếu người tạo/app-admin. progress: mỗi user chỉ ghi bản mình + **cap thô `value ≤ 100000`** (chống bịa — liên quan note [[admin-delete-no-stats-reconcile]]). Không cần index mới (query 1-equality).
- **Tính đóng góp:** `stats.goalContribution(sessions, goal)` (unit-test OK) — lọc theo khoảng ngày + môn, cộng theo metric. Mỗi lần mở `GoalCard`: đọc progress → tính đóng góp của mình từ local sessions → ghi `progress/{uid}` (nếu >0 hoặc đã có doc) → tổng nhóm = cộng các bản.
- **Code mới:** `repo-goals.js` (createGoal/listCompanyGoals/listClubGoals/getGoalProgress/setMyGoalProgress/deleteGoal); `screens/GoalCard.js` (thẻ tiến độ tổng + đóng góp của bạn + top người góp + nút xoá); `screens/GoalForm.js` (modal tạo, dùng chung club/company); `screens/GoalsScreen.js` (mục tiêu công ty).
- **UI:** thẻ **"🎯 Mục tiêu chung"** ở tab Cá nhân → `GoalsScreen` (routing `pg='goals'`). `ClubDetail` có section **"🎯 Mục tiêu nhóm"** (chủ tạo, thành viên đóng góp — `canContribute=isMember`). Cả 2 truyền `mySessions=${sessions}`.
- Verify: node --check tất cả OK, goalContribution unit-test đúng, rules compile+deploy, app render sạch. **CHƯA E2E account thật.**

**Ghi chú gian lận (đợt sau):** progress do client tính từ sessions (có thể chứa buổi nhập tay phóng đại) + cap thô 100000. Vì hợp tác không xếp hạng nên động cơ gian lận thấp. Bài toán "timer thật vs nhập tay" tách riêng làm sau (đụng cả leaderboard cá nhân) — xem [[admin-delete-no-stats-reconcile]].

## 16. ✅ Mục tiêu opt-in (admin) + Feed thông báo (2026-07-26, CHƯA E2E)
Tinh chỉnh Đợt 2 theo chốt của user:
- **Mục tiêu NHÓM (club goal):** giữ nguyên — chủ nhóm tạo (topic/đo bằng/mốc, vd "đi bộ · 100km · toàn thành viên") + bảng đóng góp; **thành viên tự động đóng góp** (`joinable=false`, `canContribute=isMember`).
- **Mục tiêu CÔNG TY (company goal):**
  - **CHỈ app-admin tạo được** (dành CEO/COO phát động). Gác 2 lớp: rules `create ... && (scope=='club' || isAdmin())`; UI `GoalsScreen` nút "＋ Tạo" chỉ hiện khi `isAdmin`.
  - **AUTO — mọi người tự động đóng góp** khi tập đúng môn (user chốt 2026-07-26: KHÔNG opt-in). `GoalCard canContribute=true`. (Từng làm opt-in rồi gỡ theo yêu cầu — `removeMyGoalProgress` còn export nhưng không dùng.)
- **Feed thông báo (kênh 1 chiều):** subcollection `posts` dưới `clubs/{id}` và `goals/{id}`. Rules: **chỉ chủ nhóm / người tạo goal / app-admin** đăng (text ≤2000), mọi người đọc; xoá nếu tác giả/chủ/admin. ĐÃ deploy.
  - `data/repo-posts.js` (listAnnouncements/addAnnouncement/deleteAnnouncement, `parent`=['clubs',id]|['goals',id]).
  - `screens/AnnouncementFeed.js` (component collapsible "📢 Thông báo", lazy-load khi mở, ô đăng chỉ hiện khi `canPost`).
  - Gắn: **ClubDetail** (feed cấp CLB, canPost=chủ/admin) + **GoalCard** (feed per-goal, canPost=người tạo/admin) → có ở cả CLB lẫn mọi mục tiêu.
- **Chưa làm (user không yêu cầu gấp):** mời-người-cụ-thể vào mục tiêu công ty (goal mở + admin phát động + có feed thông báo nên tự nhảy vào là đủ; thêm sau nếu cần). Reaction/tim trên post thông báo (giờ chỉ text + xoá).
- Verify: node --check OK, rules compile+deploy OK, app render sạch. **CHƯA E2E account thật.**

## 17. Chỉnh nhỏ (2026-07-26)
- **Mục tiêu công ty: bỏ opt-in → auto** (xem §16 đã sửa). Mọi người tự động đóng góp.
- **Trang chủ (HomeTab, app.js): bỏ khối "Bắt đầu tập" gym** (Label + Quản lý chương trình + danh sách chương trình với nút ▶ theo buổi). Lý do: Home không còn gym-centric; chọn chương trình gym chỉ hiện khi user chủ động bắt đầu môn gym (nút ＋ → PickActivity → onGym → ProgsTab, luồng cũ vẫn nguyên). HomeTab giờ = hero + 3 tile (Chuỗi/Tuần này/Phút tuần) + "Gần đây". Props `progs/onStart/onManagePrograms` của HomeTab còn truyền nhưng không dùng (vô hại).
- **GoalForm: sửa mặc định đơn vị theo môn.** Trước đây club goal luôn mặc định `distanceKm` dù môn gì. Giờ: default = (môn kind==='distance' → km, còn lại → số buổi); và **ẩn lựa chọn "Quãng đường (km)"** cho nhóm môn không phải distance (yoga/bóng/gym…) — km chỉ hiện với company hoặc club môn distance.
