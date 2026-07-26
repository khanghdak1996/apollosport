// Bản dịch tiếng Việt (phổ thông) cho phần "các bước" của bài tập từ free-exercise-db.
// ĐIỀN DẦN: thêm `EX.id: [câu VN...]`. Có bản VN → GuideDetail dùng thay tiếng Anh.
// Văn phong: câu NGẮN, cô đọng, mỗi bước 1 ý, giải thích thuật ngữ khi cần.
// Sắp theo nhóm cơ cho dễ bảo trì. Bài chưa có ở đây → hiển thị hướng dẫn gốc tiếng Anh.

export const INSTRUCTIONS_VI = {
  // ── Ngực ──────────────────────────────────────────────
  'bench-press': [
    'Nằm ngửa trên ghế phẳng, mắt dưới thanh đòn. Nắm đòn rộng hơn vai.',
    'Đạp chân xuống sàn, siết vai. Nhấc đòn khỏi giá, đưa thẳng trên ngực — tư thế bắt đầu.',
    'Hít vào, hạ đòn từ từ chạm giữa ngực. Giữ khuỷu tay hơi khép vào thân.',
    'Thở ra, đẩy đòn lên thẳng về tư thế đầu. Lặp lại.',
  ],
  'incline-bench': [
    'Nằm ngửa trên ghế nghiêng ~30 độ, nắm đòn rộng hơn vai. Nhấc đòn khỏi giá, đưa thẳng trên ngực trên — tư thế bắt đầu.',
    'Hít vào, hạ đòn từ từ chạm ngực trên.',
    'Thở ra, đẩy đòn lên thẳng bằng lực ngực. Hạ chậm gấp đôi lúc đẩy. Lặp lại.',
  ],
  'decline-bench': [
    'Nằm ngửa trên ghế dốc xuống, kẹp chân vào đệm. Nắm đòn rộng hơn vai, nhấc khỏi giá đưa thẳng trên ngực — tư thế bắt đầu.',
    'Hít vào, hạ đòn từ từ chạm ngực dưới.',
    'Thở ra, đẩy đòn lên thẳng bằng lực ngực. Lặp lại.',
  ],
  'dumbbell-press': [
    'Nằm ngửa trên ghế phẳng, hai tay cầm tạ đôi đưa lên ngang vai, lòng bàn tay hướng trước — tư thế bắt đầu.',
    'Thở ra, đẩy hai tạ lên thẳng trên ngực rồi siết ngực.',
    'Hít vào, hạ tạ từ từ về ngang ngực. Lặp lại.',
  ],
  'incline-db-press': [
    'Nằm ngửa trên ghế nghiêng ~30 độ, hai tay cầm tạ đôi ngang vai, lòng bàn tay hướng trước — tư thế bắt đầu.',
    'Thở ra, đẩy hai tạ lên thẳng trên ngực trên.',
    'Hít vào, hạ tạ từ từ về ngang vai. Lặp lại.',
  ],
  'cable-fly': [
    'Chỉnh ròng rọc ở vị trí cao, mỗi tay nắm một tay cầm. Bước tới một bước, hơi cúi người, hai tay mở sang ngang, khuỷu hơi cong — tư thế bắt đầu.',
    'Thở ra, kéo hai tay vòng cung về trước ngực, siết ngực.',
    'Hít vào, mở tay về hai bên từ từ đến khi thấy căng ngực. Lặp lại.',
  ],
  'low-cable-fly': [
    'Chỉnh ròng rọc ở vị trí thấp, mỗi tay nắm một tay cầm, tay buông dưới hông, lòng bàn tay hướng trước — tư thế bắt đầu.',
    'Thở ra, kéo hai tay vòng lên và vào giữa, gặp nhau trước ngực.',
    'Hít vào, hạ tay về hai bên từ từ. Lặp lại.',
  ],
  'dumbbell-fly': [
    'Nằm ngửa trên ghế phẳng, hai tay cầm tạ đôi đưa lên trên ngực, lòng bàn tay hướng vào nhau, khuỷu hơi cong — tư thế bắt đầu.',
    'Hít vào, mở hai tay sang ngang theo vòng cung đến khi căng ngực. Giữ khuỷu cong cố định.',
    'Thở ra, khép tay về trên ngực, siết ngực. Lặp lại.',
  ],
  'pec-deck': [
    'Ngồi vào máy, lưng tựa đệm, hai tay nắm tay cầm, cánh tay trên song song sàn — tư thế bắt đầu.',
    'Thở ra, ép hai tay cầm về giữa, siết ngực. Giữ một giây.',
    'Hít vào, mở tay về từ từ đến khi căng ngực. Lặp lại.',
  ],
  'chest-dip': [
    'Chống thẳng hai tay trên xà kép, người treo lơ lửng — tư thế bắt đầu.',
    'Hít vào, hạ người xuống từ từ, thân hơi ngả trước ~30 độ, khuỷu hơi xoè, đến khi thấy căng ngực.',
    'Thở ra, dùng lực ngực đẩy người lên về tư thế đầu. Lặp lại.',
  ],
  'machine-chest': [
    'Chỉnh ghế cho tay cầm ngang giữa ngực. Ngực ưỡn, vai kéo về sau — tư thế bắt đầu.',
    'Thở ra, đẩy tay cầm ra trước đến khi tay thẳng.',
    'Hít vào, thu tay về từ từ (không để tạ chạm chốt) để giữ lực căng. Lặp lại.',
  ],
  'push-up': [
    'Chống hai tay xuống sàn rộng hơn vai, người thẳng từ đầu đến gót.',
    'Siết bụng, giữ thân thẳng như tấm ván — tư thế bắt đầu.',
    'Hít vào, gập khuỷu hạ người xuống đến khi ngực gần chạm sàn. Khuỷu hơi khép.',
    'Thở ra, đẩy người lên thẳng tay về tư thế đầu. Lặp lại.',
  ],

  // ── Chân ──────────────────────────────────────────────
  squat: [
    'Đặt đòn lên giá ngang vai. Chui vào, tì đòn lên cơ vai (dưới gáy), hai tay nắm đòn.',
    'Đạp chân nhấc đòn, lùi một bước. Chân rộng bằng vai, mũi chân hơi mở. Lưng thẳng — tư thế bắt đầu.',
    'Hít vào, gập gối và hông hạ người xuống như ngồi ghế, đến khi đùi gần song song sàn.',
    'Giữ gối theo hướng mũi chân (không đổ vào trong), dồn lực vào gót.',
    'Thở ra, đạp gót đứng thẳng về tư thế đầu. Lặp lại.',
  ],
  'back-squat': [
    'Đặt đòn lên giá ngang vai, chui vào tì đòn lên cơ vai (dưới gáy). Đạp chân nhấc đòn, lùi một bước, chân rộng bằng vai — tư thế bắt đầu.',
    'Hít vào, gập gối và hông ngồi xuống đến khi đùi dưới song song sàn, lưng thẳng, gối theo mũi chân.',
    'Thở ra, đạp gót đứng lên về tư thế đầu. Lặp lại.',
  ],
  'front-squat': [
    'Đặt đòn lên giá ngang vai. Đưa tay dưới đòn, khuỷu nâng cao, đặt đòn lên vai trước. Nhấc đòn, lùi một bước, chân rộng bằng vai — tư thế bắt đầu.',
    'Hít vào, gập gối ngồi thẳng xuống đến khi đùi dưới song song sàn, giữ khuỷu cao và lưng thẳng.',
    'Thở ra, đạp giữa bàn chân đứng lên về tư thế đầu. Lặp lại.',
  ],
  'leg-press': [
    'Ngồi vào máy ép chân, đặt hai bàn chân lên bàn đạp rộng bằng vai. Đẩy bàn đạp lên đến khi chân gần thẳng (không khoá gối) — tư thế bắt đầu.',
    'Hít vào, hạ bàn đạp từ từ đến khi gối gập vuông góc.',
    'Thở ra, đạp bằng gót đưa bàn đạp lên về tư thế đầu. Lặp lại.',
  ],
  rdl: [
    'Đứng chân rộng bằng vai, nắm đòn rộng hơn vai một chút, tay thẳng, đòn tì đùi trước. Gối hơi chùng, lưng thẳng — tư thế bắt đầu.',
    'Hít vào, đẩy hông ra sau hạ đòn dọc theo chân (gối chỉ hơi cong) đến khi căng mặt sau đùi.',
    'Thở ra, siết mông đẩy hông về trước đứng thẳng. Lặp lại.',
  ],
  'leg-curl': [
    'Nằm sấp trên máy, gót chân móc dưới đệm đòn, tay nắm tay cầm — tư thế bắt đầu.',
    'Thở ra, co chân kéo gót về mông hết mức, giữ đùi áp đệm. Giữ một giây.',
    'Hít vào, duỗi chân về từ từ. Lặp lại.',
  ],
  'seated-leg-curl': [
    'Ngồi vào máy, lưng tựa đệm, mặt sau cẳng chân đặt trên đòn, đệm khoá trên đùi — tư thế bắt đầu.',
    'Thở ra, gập gối kéo đòn xuống hết mức. Giữ một giây.',
    'Hít vào, duỗi chân về từ từ. Lặp lại.',
  ],
  'leg-ext': [
    'Ngồi vào máy, cẳng chân sau đệm đòn, tay nắm tay cầm hai bên. Gối gập vuông góc — tư thế bắt đầu.',
    'Thở ra, duỗi thẳng chân đá đòn lên hết mức. Giữ một giây.',
    'Hít vào, hạ chân về từ từ (không quá vuông góc). Lặp lại.',
  ],
  'calf-raise': [
    'Đứng vào máy, vai dưới đệm, ức bàn chân trên bục, gót thả ra ngoài. Gối hơi chùng — tư thế bắt đầu.',
    'Thở ra, kiễng gót lên cao hết mức, siết bắp chân. Giữ một giây.',
    'Hít vào, hạ gót xuống từ từ đến khi căng bắp chân. Lặp lại.',
  ],
  'seated-calf': [
    'Ngồi vào máy, ức bàn chân trên bục, đệm đòn tì trên đùi dưới, tay giữ đòn. Nhả chốt an toàn — tư thế bắt đầu.',
    'Hít vào, hạ gót xuống từ từ đến khi căng bắp chân.',
    'Thở ra, kiễng gót lên cao hết mức, siết bắp chân. Lặp lại.',
  ],
  'bulgarian-split': [
    'Đứng bước chân trước - chân sau, mũi chân sau gác lên ghế phía sau. Mỗi tay cầm một tạ buông dọc thân — tư thế bắt đầu.',
    'Hít vào, gập gối trước hạ người thẳng xuống, giữ gối trước thẳng hàng mũi chân.',
    'Thở ra, đạp gót chân trước đứng lên về tư thế đầu. Làm hết số lần rồi đổi chân. Lặp lại.',
  ],
  'hack-squat': [
    'Vào máy hack squat, lưng và vai tựa đệm, chân đặt trên bàn rộng bằng vai. Nhả chốt an toàn, duỗi chân (không khoá gối) — tư thế bắt đầu.',
    'Hít vào, gập gối hạ người xuống đến khi đùi dưới song song sàn, gối theo hướng mũi chân.',
    'Thở ra, đạp gót duỗi chân lên về tư thế đầu. Lặp lại.',
  ],
  'goblet-squat': [
    'Đứng thẳng, hai tay ôm một tạ ấm (hoặc tạ đôi) sát ngực, chân rộng bằng vai — tư thế bắt đầu.',
    'Hít vào, gập gối và hông ngồi xuống giữa hai chân, giữ ngực và lưng thẳng.',
    'Thở ra, đạp gót đứng lên về tư thế đầu. Lặp lại.',
  ],
  'sumo-squat': [
    'Đứng chân rộng hơn vai, mũi chân xoay ra ngoài, hai tay cầm một tạ buông trước người — tư thế bắt đầu.',
    'Hít vào, gập gối hạ người đến khi đùi song song sàn, giữ gối theo hướng mũi chân.',
    'Thở ra, đạp gót đứng lên về tư thế đầu. Lặp lại.',
  ],
  'walking-lunge': [
    'Đứng thẳng, chân rộng bằng vai, hai tay chống hông (hoặc cầm tạ) — tư thế bắt đầu.',
    'Bước một chân lên trước, gập cả hai gối hạ người đến khi gối sau gần chạm sàn. Giữ thân thẳng, gối trước trên mũi chân.',
    'Đạp gót chân trước đứng lên, kéo chân sau bước tiếp lên trước. Đổi chân liên tục. Lặp lại.',
  ],
  'leg-press-calf': [
    'Ngồi vào máy ép chân, duỗi chân (không khoá gối), đặt ức bàn chân lên mép dưới bàn đạp, gót thả ra ngoài — tư thế bắt đầu.',
    'Thở ra, đẩy bàn đạp bằng cách kiễng gót lên hết mức, siết bắp chân. Giữ một giây.',
    'Hít vào, hạ gót về từ từ đến khi căng bắp chân. Lặp lại.',
  ],
  'sissy-squat': [
    'Đứng thẳng, chân rộng bằng vai, kiễng mũi chân, một tay vịn giá cho vững — tư thế bắt đầu.',
    'Hít vào, gập gối và đẩy hông-gối ra trước, ngả thân sau, hạ xuống đến khi gối gập ~90 độ. Giữ một giây.',
    'Thở ra, dùng lực đùi kéo thân lên về tư thế đầu. Lặp lại.',
  ],
  'single-leg-ext': [
    'Ngồi vào máy, một cẳng chân sau đệm đòn, gối thẳng trục máy — tư thế bắt đầu.',
    'Thở ra, duỗi thẳng chân đá đòn lên, giữ một giây trên đỉnh.',
    'Hít vào, hạ về từ từ (giữ lực căng). Làm hết số lần rồi đổi chân. Lặp lại.',
  ],
  'swiss-ball-leg-curl': [
    'Nằm ngửa dưới sàn, hai gót gác trên bóng, chân duỗi — tư thế bắt đầu.',
    'Nâng hông lên khỏi sàn, tựa lực vào vai và chân.',
    'Co gối kéo bóng về phía mông, siết mặt sau đùi. Duỗi về từ từ. Lặp lại.',
  ],

  // ── Lưng ──────────────────────────────────────────────
  deadlift: [
    'Đứng sát đòn, chân rộng bằng vai, đòn nằm trên giữa bàn chân.',
    'Gập gối cúi nắm đòn (tay rộng bằng vai). Lưng thẳng, ngực ưỡn — tư thế bắt đầu.',
    'Thở ra, đạp chân và nâng người thẳng lên cùng lúc, giữ đòn sát người.',
    'Hít vào, đẩy hông ra sau và gập gối hạ đòn xuống sàn, lưng vẫn thẳng. Lặp lại.',
  ],
  'barbell-row': [
    'Đứng chân rộng bằng vai, nắm đòn rộng hơn vai một chút.',
    'Gập hông cúi người khoảng 45 độ, lưng thẳng, đòn buông thẳng tay — tư thế bắt đầu.',
    'Thở ra, kéo đòn vào bụng dưới, siết cơ lưng, khuỷu tay đi sát thân.',
    'Hít vào, hạ đòn xuống từ từ về tư thế đầu. Giữ lưng thẳng suốt. Lặp lại.',
  ],
  'lat-pull': [
    'Ngồi vào máy, chỉnh đệm ép chắc đùi. Nắm thanh ngang rộng hơn vai.',
    'Ngực ưỡn, hơi ngả người ra sau — tư thế bắt đầu.',
    'Thở ra, kéo thanh xuống trước ngực, siết cơ lưng, khuỷu tay hạ sát thân.',
    'Hít vào, thả thanh lên từ từ đến khi tay thẳng. Lặp lại.',
  ],
  'pull-up': [
    'Nắm thanh ngang trên đầu, tay rộng hơn vai, lòng bàn tay hướng ra trước.',
    'Buông người thẳng tay, siết vai — tư thế bắt đầu.',
    'Thở ra, kéo người lên đến khi cằm qua thanh, siết cơ lưng.',
    'Hít vào, hạ người xuống từ từ đến khi tay thẳng. Lặp lại.',
  ],
  'chin-up': [
    'Nắm xà ngang, lòng bàn tay hướng vào người, tay hẹp hơn vai. Treo thẳng người, ngực ưỡn — tư thế bắt đầu.',
    'Thở ra, kéo người lên đến khi đầu ngang xà, dùng lực tay trước, khuỷu sát thân.',
    'Hít vào, hạ người xuống từ từ đến khi tay thẳng. Lặp lại.',
  ],
  'seated-row': [
    'Ngồi vào máy kéo cáp thấp, chân đạp bàn, gối hơi chùng, hai tay nắm tay cầm chữ V. Lưng thẳng, ngực ưỡn — tư thế bắt đầu.',
    'Thở ra, kéo tay cầm về bụng, khuỷu sát thân, siết cơ lưng. Giữ một giây.',
    'Hít vào, duỗi tay về từ từ đến khi căng cơ xô. Lặp lại.',
  ],
  't-bar-row': [
    'Đứng dạng chân trên đòn T-bar, hai tay nắm tay cầm, hông đẩy ra sau, ngực ưỡn, tay thẳng — tư thế bắt đầu.',
    'Thở ra, kéo đòn lên bụng trên, siết bả vai, khuỷu gập. Không giật.',
    'Hít vào, hạ đòn về từ từ. Lặp lại.',
  ],
  'single-arm-row': [
    'Chống một gối và một tay lên ghế, thân song song sàn, lưng thẳng. Tay kia cầm tạ buông thẳng, lòng bàn tay hướng vào thân — tư thế bắt đầu.',
    'Thở ra, kéo tạ lên cạnh sườn, khuỷu sát thân, siết cơ lưng.',
    'Hít vào, hạ tạ xuống từ từ. Làm hết số lần rồi đổi tay. Lặp lại.',
  ],
  'straight-arm-pull': [
    'Đứng trước máy kéo cáp cao, nắm đòn rộng hơn vai, tay thẳng, lùi lại hai bước. Cúi thân trước ~30 độ, khuỷu hơi cong — tư thế bắt đầu.',
    'Thở ra, giữ tay thẳng, kéo đòn xuống bằng cơ xô đến cạnh đùi.',
    'Hít vào, đưa đòn lên về từ từ. Lặp lại.',
  ],
  'chest-supported-row': [
    'Đứng thẳng, nắm đòn lòng bàn tay hướng lên (ngửa), rộng bằng vai. Gối hơi chùng, cúi thân trước gần song song sàn, lưng thẳng, đòn buông thẳng tay — tư thế bắt đầu.',
    'Thở ra, kéo đòn lên bụng, khuỷu sát thân, siết cơ lưng. Giữ một giây.',
    'Hít vào, hạ đòn xuống từ từ. Lặp lại.',
  ],
  'rack-pull': [
    'Đặt đòn lên chốt giá (power rack) ở ngang dưới gối. Đứng chân rộng bằng hông, nắm đòn rộng bằng vai, lưng ưỡn, hông đẩy ra sau — tư thế bắt đầu.',
    'Nhìn thẳng, duỗi hông và gối kéo đòn lên đến khi đứng thẳng, kéo vai về sau.',
    'Hạ đòn về chốt từ từ. Lặp lại.',
  ],
  hyperextension: [
    'Nằm sấp trên ghế lưng (hyperextension), gót móc dưới đệm, hông tì mép đệm. Khoanh tay trước ngực — tư thế bắt đầu.',
    'Hít vào, cúi gập người xuống ở hông đến khi căng mặt sau đùi, giữ lưng thẳng (không cong lưng).',
    'Thở ra, nâng thân lên thẳng hàng với chân (không ưỡn quá). Lặp lại.',
  ],
  'machine-high-row': [
    'Ngồi vào máy, chỉnh ghế để với tới tay cầm phía trên, nắm tay cầm lòng bàn tay hướng xuống — tư thế bắt đầu.',
    'Thở ra, kéo tay cầm về thân, siết bả vai, khuỷu gập.',
    'Hít vào, duỗi tay về từ từ (giữ lực căng). Lặp lại.',
  ],
  'neutral-grip-pulldown': [
    'Ngồi vào máy kéo xô, khoá đệm đùi, nắm tay cầm chữ V (lòng bàn tay hướng vào nhau). Ngực ưỡn, ngả người sau ~30 độ — tư thế bắt đầu.',
    'Thở ra, kéo tay cầm xuống gần chạm ngực bằng cơ xô, siết bả vai. Giữ một giây.',
    'Hít vào, thả tay lên về từ từ. Lặp lại.',
  ],
  'cable-pullover': [
    'Nằm ngang ghế (chỉ vai tựa ghế), hông thấp, chân đạp sàn. Hai tay ôm một tạ đưa thẳng trên ngực — tư thế bắt đầu.',
    'Hít vào, giữ tay thẳng, hạ tạ vòng cung ra sau đầu đến khi căng ngực.',
    'Thở ra, đưa tạ về trên ngực theo vòng cung cũ. Lặp lại.',
  ],
  'barbell-shrug': [
    'Đứng thẳng, chân rộng bằng vai, hai tay cầm đòn buông trước đùi, tay rộng hơn vai một chút — tư thế bắt đầu.',
    'Thở ra, nhún vai lên cao hết mức (không dùng tay kéo). Giữ một giây.',
    'Hít vào, hạ vai về từ từ. Lặp lại.',
  ],

  // ── Vai ───────────────────────────────────────────────
  ohp: [
    'Đứng chân rộng bằng vai, nắm đòn ngang vai, đòn tì trước phần vai trên.',
    'Siết bụng và mông, mắt nhìn thẳng — tư thế bắt đầu.',
    'Thở ra, đẩy đòn thẳng lên qua đầu đến khi tay thẳng.',
    'Hít vào, hạ đòn về ngang vai từ từ. Không ngửa lưng ra sau khi đẩy. Lặp lại.',
  ],
  'db-shoulder-press': [
    'Ngồi ghế có tựa lưng, hai tay cầm tạ đôi đưa lên ngang vai, lòng bàn tay hướng trước — tư thế bắt đầu.',
    'Thở ra, đẩy hai tạ lên trên đến khi gần chạm nhau.',
    'Hít vào, hạ tạ về ngang vai từ từ. Lặp lại.',
  ],
  'arnold-press': [
    'Ngồi ghế có tựa, hai tay cầm tạ đôi trước ngực trên, lòng bàn tay hướng vào người — tư thế bắt đầu.',
    'Thở ra, vừa đẩy tạ lên vừa xoay cổ tay đến khi tay thẳng trên đầu, lòng bàn tay hướng trước.',
    'Hít vào, hạ tạ xuống vừa xoay cổ tay về hướng người. Lặp lại.',
  ],
  'lateral-raise': [
    'Đứng thẳng, hai tay cầm tạ đôi buông dọc thân, lòng bàn tay hướng vào người — tư thế bắt đầu.',
    'Thở ra, nâng hai tạ sang ngang (khuỷu hơi cong) đến khi tay song song sàn. Giữ một giây.',
    'Hít vào, hạ tạ về từ từ. Lặp lại.',
  ],
  'cable-lateral-raise': [
    'Đứng cạnh ròng rọc thấp, tay xa nắm tay cầm, cáp chạy trước người, tay buông chéo — tư thế bắt đầu.',
    'Thở ra, nâng tay sang ngang đến khi song song sàn, giữ khuỷu hơi cong.',
    'Hít vào, hạ tay về từ từ. Đổi bên. Lặp lại.',
  ],
  'face-pull': [
    'Đứng trước ròng rọc cao gắn dây thừng, hai tay nắm dây, tay thẳng trước mặt — tư thế bắt đầu.',
    'Thở ra, kéo dây về phía mặt, tách hai tay sang hai bên, giữ khuỷu ngang vai.',
    'Hít vào, duỗi tay về từ từ. Lặp lại.',
  ],
  'front-raise': [
    'Đứng thẳng, hai tay cầm tạ đôi buông trước đùi, lòng bàn tay hướng vào đùi — tư thế bắt đầu.',
    'Thở ra, nâng một tạ ra trước (khuỷu hơi cong) đến khi hơi cao hơn ngang vai.',
    'Hít vào, hạ tạ về, đồng thời nâng tạ tay kia. Đổi tay liên tục. Lặp lại.',
  ],
  'reverse-fly': [
    'Nằm sấp áp ngực lên ghế nghiêng, hai tay cầm tạ đôi thả xuống, lòng bàn tay hướng vào nhau — tư thế bắt đầu.',
    'Thở ra, mở hai tay sang ngang theo vòng cung (khuỷu hơi cong) đến khi song song sàn, siết bả vai.',
    'Hít vào, hạ tạ về từ từ. Lặp lại.',
  ],
  'upright-row': [
    'Đứng thẳng, nắm đòn hẹp hơn vai một chút, lòng bàn tay hướng vào đùi, đòn tì trước đùi — tư thế bắt đầu.',
    'Thở ra, kéo đòn lên dọc thân đến gần cằm, khuỷu dẫn hướng và luôn cao hơn cẳng tay.',
    'Hít vào, hạ đòn về từ từ. Lặp lại.',
  ],
  'machine-shoulder': [
    'Ngồi vào máy đẩy vai, hai tay nắm tay cầm ngang vai, khuỷu gập — tư thế bắt đầu.',
    'Thở ra, đẩy tay cầm lên đến khi tay thẳng. Giữ một giây.',
    'Hít vào, hạ tay cầm về từ từ. Lặp lại.',
  ],
  'rear-delt-fly': [
    'Chỉnh ròng rọc trên đầu, tay bắt chéo (tay phải nắm cáp trái, tay trái nắm cáp phải) trước mặt — tư thế bắt đầu.',
    'Thở ra, mở hai tay ra sau và sang ngang, giữ tay thẳng.',
    'Hít vào, đưa tay về từ từ. Lặp lại.',
  ],
  'military-press': [
    'Đứng chân rộng bằng vai, nắm đòn rộng hơn vai, đòn tì trước vai. Đẩy đòn lên khoá tay trên đầu — tư thế bắt đầu.',
    'Hít vào, hạ đòn xuống trước vai từ từ.',
    'Thở ra, đẩy đòn lên thẳng về tư thế đầu. Lặp lại.',
  ],
  'cable-reverse-fly': [
    'Chỉnh ròng rọc trên đầu, tay bắt chéo (tay phải nắm cáp trái, tay trái nắm cáp phải) trước mặt — tư thế bắt đầu.',
    'Thở ra, mở hai tay ra sau và sang ngang, giữ tay thẳng, siết bả vai.',
    'Hít vào, đưa tay về từ từ. Lặp lại.',
  ],

  // ── Tay ───────────────────────────────────────────────
  'bicep-curl': [
    'Đứng thẳng, nắm đòn rộng bằng vai, lòng bàn tay hướng trước, tay buông thẳng.',
    'Giữ khuỷu tay sát thân và cố định — tư thế bắt đầu.',
    'Thở ra, gập khuỷu cuốn đòn lên gần vai, siết cơ tay trước. Không hất khuỷu ra trước.',
    'Hít vào, hạ đòn xuống từ từ đến khi tay thẳng. Lặp lại.',
  ],
  'db-curl': [
    'Đứng thẳng, hai tay cầm tạ đôi buông dọc thân, lòng bàn tay hướng trước, khuỷu sát thân — tư thế bắt đầu.',
    'Thở ra, cuốn tạ lên vai bằng cơ tay trước, giữ khuỷu cố định. Siết một giây.',
    'Hít vào, hạ tạ xuống từ từ. Lặp lại.',
  ],
  'hammer-curl': [
    'Đứng thẳng, hai tay cầm tạ đôi buông dọc thân, lòng bàn tay hướng vào người, khuỷu sát thân — tư thế bắt đầu.',
    'Thở ra, cuốn một tạ lên vai (giữ lòng bàn tay hướng vào trong như cầm búa). Siết một giây.',
    'Hít vào, hạ tạ xuống. Đổi tay liên tục. Lặp lại.',
  ],
  'preacher-curl': [
    'Ngồi ghế preacher, mặt sau cánh tay áp đệm nghiêng, hai tay nắm đòn EZ ngang vai, lòng bàn tay hướng lên — tư thế bắt đầu.',
    'Hít vào, hạ đòn xuống từ từ đến khi tay thẳng và căng cơ tay trước.',
    'Thở ra, cuốn đòn lên bằng cơ tay trước đến ngang vai. Siết một giây. Lặp lại.',
  ],
  'concentration-curl': [
    'Ngồi trên ghế, một tay cầm tạ, mặt sau cánh tay tì mặt trong đùi, tay duỗi thẳng — tư thế bắt đầu.',
    'Thở ra, cuốn tạ lên vai bằng cơ tay trước, chỉ cẳng tay di chuyển. Siết một giây.',
    'Hít vào, hạ tạ xuống từ từ. Đổi tay. Lặp lại.',
  ],
  'incline-db-curl': [
    'Nằm ngả trên ghế nghiêng, hai tay cầm tạ đôi buông thẳng xuống, lòng bàn tay hướng trước, khuỷu sát thân — tư thế bắt đầu.',
    'Thở ra, cuốn tạ lên vai bằng cơ tay trước, chỉ cẳng tay di chuyển. Siết một giây.',
    'Hít vào, hạ tạ xuống từ từ. Lặp lại.',
  ],
  'cable-curl': [
    'Đứng thẳng trước ròng rọc thấp, nắm đòn cáp rộng bằng vai, lòng bàn tay hướng lên, khuỷu sát thân — tư thế bắt đầu.',
    'Thở ra, cuốn đòn lên vai, chỉ cẳng tay di chuyển. Siết một giây.',
    'Hít vào, hạ đòn xuống từ từ. Lặp lại.',
  ],
  'ez-bar-curl': [
    'Đứng thẳng, nắm đòn EZ ở tay cầm ngoài, lòng bàn tay hướng trước hơi nghiêng vào, khuỷu sát thân — tư thế bắt đầu.',
    'Thở ra, cuốn đòn lên vai bằng cơ tay trước, chỉ cẳng tay di chuyển. Siết một giây.',
    'Hít vào, hạ đòn xuống từ từ. Lặp lại.',
  ],
  'reverse-curl': [
    'Đứng thẳng, nắm đòn rộng bằng vai, lòng bàn tay hướng xuống (úp), khuỷu sát thân — tư thế bắt đầu.',
    'Thở ra, cuốn đòn lên vai, chỉ cẳng tay di chuyển. Siết một giây.',
    'Hít vào, hạ đòn xuống từ từ. Lặp lại.',
  ],
  'tricep-push': [
    'Đứng trước ròng rọc cao, nắm đòn lòng bàn tay hướng xuống rộng bằng vai, khuỷu sát thân, cẳng tay hướng lên — tư thế bắt đầu.',
    'Thở ra, đẩy đòn xuống đến khi tay thẳng, chỉ cẳng tay di chuyển, siết cơ tay sau.',
    'Hít vào, đưa đòn lên về từ từ. Lặp lại.',
  ],
  'skull-crusher': [
    'Nằm ngửa trên ghế, nắm đòn EZ tay hẹp, đưa thẳng trên ngực, khuỷu khép — tư thế bắt đầu.',
    'Hít vào, gập khuỷu hạ đòn xuống gần trán, giữ cánh tay trên cố định.',
    'Thở ra, duỗi khuỷu đẩy đòn lên về tư thế đầu. Lặp lại.',
  ],
  'overhead-tricep': [
    'Đứng thẳng, hai tay ôm một tạ đưa thẳng trên đầu, lòng bàn tay hướng lên — tư thế bắt đầu.',
    'Hít vào, gập khuỷu hạ tạ vòng ra sau đầu, giữ cánh tay trên sát đầu và cố định.',
    'Thở ra, duỗi khuỷu đẩy tạ lên về tư thế đầu. Lặp lại.',
  ],
  'close-grip-bench': [
    'Nằm ngửa trên ghế phẳng, nắm đòn tay hẹp (bằng vai), nhấc khỏi giá đưa thẳng trên ngực — tư thế bắt đầu.',
    'Hít vào, hạ đòn xuống giữa ngực, giữ khuỷu sát thân (để dồn vào cơ tay sau).',
    'Thở ra, đẩy đòn lên bằng cơ tay sau về tư thế đầu. Lặp lại.',
  ],
  'tricep-kickback': [
    'Cầm tạ mỗi tay, gối hơi chùng, cúi thân trước gần song song sàn, cánh tay trên sát thân và song song sàn, cẳng tay hướng xuống — tư thế bắt đầu.',
    'Thở ra, duỗi cẳng tay ra sau đến khi tay thẳng, giữ cánh tay trên cố định. Siết cơ tay sau.',
    'Hít vào, gập cẳng tay về từ từ. Lặp lại.',
  ],
  'cable-overhead-tricep': [
    'Gắn dây thừng vào ròng rọc thấp. Quay lưng lại máy, hai tay nắm dây đưa thẳng trên đầu, khuỷu sát đầu — tư thế bắt đầu.',
    'Hít vào, hạ dây ra sau đầu, giữ cánh tay trên cố định, đến khi căng cơ tay sau.',
    'Thở ra, duỗi khuỷu đẩy dây lên về tư thế đầu. Lặp lại.',
  ],
  'single-arm-cable-curl': [
    'Đứng cạnh ròng rọc thấp, một tay nắm tay cầm, cánh tay trên cố định thẳng đứng, lòng bàn tay hướng trước — tư thế bắt đầu.',
    'Thở ra, cuốn tay cầm lên đến khi cẳng tay chạm bắp tay. Siết một giây.',
    'Hít vào, hạ xuống từ từ. Đổi tay. Lặp lại.',
  ],

  // ── Mông ──────────────────────────────────────────────
  'hip-thrust': [
    'Ngồi sàn, tựa lưng trên vào ghế phía sau, đòn tạ đặt ngang hông (nên lót đệm) — tư thế bắt đầu.',
    'Thở ra, đạp gót đẩy hông lên cao đến khi thân-đùi thẳng hàng, siết mông. Tựa lực vào vai và gót.',
    'Hít vào, hạ hông xuống từ từ. Lặp lại.',
  ],
  'glute-bridge': [
    'Nằm ngửa dưới sàn, đòn tạ đặt ngang hông (nên lót đệm), gối gập, bàn chân đạp sàn — tư thế bắt đầu.',
    'Thở ra, đạp gót đẩy hông lên cao đến khi thân-đùi thẳng hàng, siết mông.',
    'Hít vào, hạ hông xuống từ từ. Lặp lại.',
  ],
  'cable-kickback': [
    'Đeo dây cổ chân nối ròng rọc thấp, mặt hướng máy, tay vịn khung cho vững, gối và hông hơi chùng — tư thế bắt đầu.',
    'Thở ra, siết mông đá chân ra sau theo vòng cung lên cao hết mức. Siết một giây.',
    'Hít vào, đưa chân về từ từ. Đổi chân. Lặp lại.',
  ],
  'donkey-kick': [
    'Quỳ chống hai tay xuống sàn rộng bằng vai, lưng thẳng, gối gập vuông góc — tư thế bắt đầu.',
    'Thở ra, nâng một chân lên (giữ gối gập vuông) đến khi đùi thẳng hàng lưng, siết mông. Giữ một giây.',
    'Hít vào, hạ chân về. Đổi chân liên tục. Lặp lại.',
  ],
  'sumo-deadlift': [
    'Đứng chân rất rộng, mũi chân xoay ra ngoài, đòn trên giữa bàn chân. Gập hông nắm đòn, tay thẳng trong hai chân, lưng thẳng — tư thế bắt đầu.',
    'Hít một hơi, hạ hông, ngực ưỡn, nhìn thẳng. Đạp chân xuống sàn, duỗi hông và gối kéo đòn lên đến khi đứng thẳng.',
    'Gập hông hạ đòn xuống sàn từ từ. Lặp lại.',
  ],
  'step-up': [
    'Đứng thẳng trước bục, hai tay cầm tạ đôi buông dọc thân — tư thế bắt đầu.',
    'Thở ra, đặt một chân lên bục, đạp gót đẩy cả người lên, đưa chân kia lên bục.',
    'Hít vào, bước chân kia xuống rồi chân trước xuống về tư thế đầu. Đổi chân. Lặp lại.',
  ],
  abductor: [
    'Ngồi vào máy dạng đùi, mặt ngoài đùi tì đệm, tay nắm tay cầm, thân trên cố định — tư thế bắt đầu.',
    'Thở ra, dùng lực đùi ép hai chân mở ra ngoài. Siết một giây.',
    'Hít vào, khép chân về từ từ. Lặp lại.',
  ],
  adductor: [
    'Ngồi vào máy khép đùi, mặt trong đùi tì đệm, tay nắm tay cầm, thân trên cố định — tư thế bắt đầu.',
    'Thở ra, dùng lực đùi ép hai chân khép vào nhau. Siết một giây.',
    'Hít vào, mở chân về từ từ. Lặp lại.',
  ],
  'cable-pull-through': [
    'Đứng quay lưng lại ròng rọc thấp gắn dây thừng, dạng chân rộng, hai tay luồn dây qua giữa hai chân — tư thế bắt đầu.',
    'Hít vào, đẩy hông ra sau, cúi người với dây xuống giữa hai chân (gối hơi cong), lưng thẳng.',
    'Thở ra, duỗi hông đứng thẳng lên, siết mông (lực từ hông, không kéo bằng vai). Lặp lại.',
  ],

  // ── Bụng ──────────────────────────────────────────────
  plank: [
    'Nằm sấp chống hai cẳng tay xuống sàn, khuỷu ngay dưới vai, mũi chân chống sàn.',
    'Giữ thân thẳng như tấm ván từ đầu đến gót, siết bụng. Giữ càng lâu càng tốt.',
  ],
  'side-plank': [
    'Nằm nghiêng, chống một cẳng tay xuống sàn, khuỷu ngay dưới vai, hai chân duỗi chồng lên nhau.',
    'Nâng hông lên khỏi sàn, thân thẳng thành một đường từ đầu đến chân, siết bụng. Giữ càng lâu càng tốt rồi đổi bên.',
  ],
  crunch: [
    'Nằm ngửa, gối gập, bàn chân đạp sàn, hai tay đỡ nhẹ hai bên đầu (không đan sau gáy) — tư thế bắt đầu.',
    'Thở ra, siết bụng cuốn vai lên khỏi sàn ~10 cm, giữ lưng dưới áp sàn. Siết một giây.',
    'Hít vào, hạ vai xuống từ từ. Lặp lại.',
  ],
  'cable-crunch': [
    'Quỳ dưới ròng rọc cao gắn dây thừng, hai tay giữ dây cạnh mặt, hông hơi gập — tư thế bắt đầu.',
    'Thở ra, siết bụng gập thân xuống đưa khuỷu về phía giữa đùi, giữ hông cố định. Siết một giây.',
    'Hít vào, duỗi thân về từ từ (giữ lực căng bụng). Lặp lại.',
  ],
  'hanging-leg-raise': [
    'Treo người trên xà, hai tay nắm xà rộng bằng vai, chân duỗi thẳng xuống — tư thế bắt đầu.',
    'Thở ra, nâng chân lên đến khi thân-chân vuông góc, siết bụng. Giữ một giây.',
    'Hít vào, hạ chân xuống từ từ. Lặp lại.',
  ],
  'ab-wheel': [
    'Vào tư thế chống đẩy nhưng hai tay nắm đòn tạ (gắn bánh nhỏ mỗi bên) — tư thế bắt đầu.',
    'Thở ra, đẩy đòn lăn ra xa về phía trước, giữ bụng siết và lưng hơi ưỡn, tay vuông góc sàn.',
    'Hít vào, kéo đòn lăn về từ từ. Lặp lại.',
  ],
  'russian-twist': [
    'Ngồi sàn, gối gập, ngả thân sau tạo chữ V với đùi, hai tay chắp thẳng trước ngực — tư thế bắt đầu.',
    'Thở ra, xoay thân sang phải đến khi tay song song sàn. Giữ một giây.',
    'Xoay về giữa rồi sang trái. Đổi bên liên tục. Lặp lại.',
  ],
  'sit-up': [
    'Nằm ngửa, gối gập, cố định bàn chân, hai tay đan sau đầu — tư thế bắt đầu.',
    'Thở ra, nâng thân trên lên tạo chữ V với đùi.',
    'Hít vào, hạ thân xuống từ từ. Lặp lại.',
  ],
  'bicycle-crunch': [
    'Nằm ngửa, lưng dưới áp sàn, hai tay đỡ nhẹ hai bên đầu, nâng vai và hai chân lên (cẳng chân song song sàn) — tư thế bắt đầu.',
    'Thở ra, đạp chân phải ra, co gối trái vào, xoay đưa khuỷu phải về gần gối trái.',
    'Đổi bên: co gối phải, đưa khuỷu trái về gần gối phải. Đạp xen kẽ như đạp xe. Lặp lại.',
  ],
  'leg-raise': [
    'Nằm ngửa trên ghế, chân duỗi thẳng khỏi mép ghế, hai tay giữ mép ghế — tư thế bắt đầu.',
    'Thở ra, nâng chân lên (gối hơi cong) đến khi vuông góc sàn, siết bụng. Giữ một giây.',
    'Hít vào, hạ chân xuống từ từ. Lặp lại.',
  ],
  'toe-touch': [
    'Nằm ngửa, nâng hai chân lên gần vuông góc sàn (gối hơi cong), hai tay vươn thẳng lên 45 độ — tư thế bắt đầu.',
    'Thở ra, giữ lưng dưới áp sàn, nâng thân trên lên vươn tay chạm mũi chân.',
    'Hít vào, hạ thân và tay xuống từ từ. Lặp lại.',
  ],
};
