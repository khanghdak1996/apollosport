// English translations for the hand-written GUIDES (src/domain/guides.js), keyed by guide id.
// When the UI language is 'en', localize() in guides.js merges the matching entry over the
// Vietnamese guide (title/summary/level/steps/mistakes/sections/tips/safety, and muscles/equipment
// for exercise guides). Fields left out here keep their Vietnamese/base value (media, sourceUrl…).
// steps may be plain strings — GuideDetail handles both strings and { text } objects.

export const GUIDES_EN = {
  // ── RUNNING ─────────────────────────────────────────────
  'run-getting-started': {
    title: 'Start running safely',
    summary: 'How to start running from zero without hurting your knees or quitting after a week.',
    level: 'Beginner',
    steps: [
      'Warm up for 5 minutes: brisk walking and gentle ankle, knee and hip circles to get the body warm.',
      'Alternate running and walking: run 1 minute, walk 2 minutes, repeat 6–8 times. Don’t try to run the whole way.',
      'Keep a pace where you can still talk. If you’re gasping for breath, you’re running too fast — slow down.',
      'Finish with 5 minutes of slow walking and light calf and thigh stretches to reduce next-day soreness.',
    ],
    mistakes: [
      'Running too fast and too far in the first week → sore knees, frustration and giving up.',
      'Skipping the warm-up → easy to strain a muscle.',
      'Wearing stiff-soled shoes instead of running shoes → hard on your feet.',
    ],
    sections: [
      { heading: 'How many sessions a week?', body: 'Beginners should run 3 times a week with rest days in between so the body can recover. Each week, add a little more running time to every session.' },
    ],
    tips: ['Choose running shoes that fit well and cushion your feet.', 'Drink enough water and avoid the midday heat.'],
    safety: ['Sharp pain in a knee or ankle → stop, don’t push through it.'],
  },

  'run-form': {
    title: 'Run with better form — less tired, fewer injuries',
    summary: 'Fix a few small posture mistakes to run lighter, last longer and get fewer knee and back aches.',
    level: 'Beginner',
    steps: [
      'Keep your upper body tall, leaning slightly forward from the ankles (not bending at the waist). Look 10–20m ahead.',
      'Relax your shoulders, bend your elbows to about 90 degrees, and swing your arms gently front-to-back along your body — don’t cross them over your chest.',
      'Land on the middle of your foot right under your hips, and don’t reach your foot far out in front (that unintentionally “brakes” with every step).',
      'Take short, quick steps: aim for about 170–180 steps per minute. Count your steps for 15 seconds and multiply by 4 to estimate.',
      'Breathe steadily through both nose and mouth, drawing the breath deep into your belly. If you’re out of breath, slow down — don’t force it.',
    ],
    mistakes: [
      'Overstriding with a hard heel strike out front → the impact travels up to your knees and tires you out fast.',
      'Tensing your shoulders and clenching your fists → wasted energy and a stiff, achy neck and shoulders.',
      'Looking down at your feet while running → it bends your neck and back and makes breathing harder.',
      'Running on your toes the whole session → tight calves and Achilles pain.',
    ],
    sections: [
      { heading: 'What is cadence, and why does it matter?', body: 'Cadence is the number of steps you take per minute. Short, quick steps (170–180) let your feet land closer to your centre of gravity, reducing the impact on your knees and hips — the simplest way to run smoother without running faster yet.' },
    ],
    tips: [
      'Ask someone to film 10 seconds from the side so you can check your own form.',
      'Try running to the beat of a song around 175 BPM to get used to the cadence.',
    ],
    safety: ['Ongoing knee or Achilles pain after running → cut your distance and review how you’re landing.'],
  },

  'run-first-5k': {
    title: 'Your first 5K running plan',
    summary: 'An 8-week plan that takes you from run–walk intervals to running a full 5km, without rushing the process.',
    level: 'Intermediate',
    steps: [
      'Weeks 1–2: run 1 minute / walk 2 minutes, repeat 8 times. Train 3 times a week, every other day.',
      'Weeks 3–4: run 2 minutes / walk 1 minute, repeat 7–8 times. Still 3 sessions a week.',
      'Weeks 5–6: run 5 minutes / walk 1 minute, repeat 4–5 times. Start getting used to continuous running.',
      'Week 7: run continuously for 20–25 minutes, walking only when you really need to. Keep a pace where you can still talk.',
      'Week 8: run a continuous 5km (beginners usually take 30–35 minutes). Don’t worry about speed — the goal is to finish.',
    ],
    mistakes: [
      'Skipping ahead because you feel good → shin or knee pain and a long forced break.',
      'Trying to run faster every session → you don’t recover, and you fade the more you train.',
      'Skipping the rest days between sessions → your legs don’t recover and injury risk goes up.',
    ],
    sections: [
      { heading: 'If a week feels too hard?', body: 'Just repeat that same week once more before moving on. The 8-week plan is only a guide — progress at your body’s pace, not the calendar’s. Consistency matters more than speed.' },
      { heading: 'How many sessions a week?', body: '3 runs, alternating with rest days or light walks. The rest days are exactly when your body gets stronger — don’t skip them.' },
    ],
    tips: [
      'Log every session in the app to see your progress and stay motivated.',
      'Warm up with 5 minutes of brisk walking before each session, and stretch your legs gently afterward.',
    ],
    safety: [
      'Sharp pain (different from normal muscle soreness) → rest a few days, don’t keep running on it.',
      'Wear cushioned running shoes; replace them when the soles are worn.',
    ],
  },

  // ── GYM ─────────────────────────────────────────────────
  'gym-newbie': {
    title: 'Gym for beginners',
    summary: 'What to do on your first gym visit and how to train safely and make progress.',
    level: 'Beginner',
    steps: [
      'Warm up for 5–10 minutes (brisk walking, joint circles) before your main exercises.',
      'Train with LIGHT weights in the first week to learn the movements. Good technique matters more than lifting heavy.',
      'Do 3 sets of 8–12 reps per exercise, resting 60–90 seconds between sets.',
      'Log your weights each session (this app does it for you) so you can add a little next time.',
    ],
    mistakes: [
      'Going heavy right away → bad form and easy injuries.',
      'Only training one favourite muscle group → imbalance. Beginners should train the whole body.',
      'Skipping the warm-up.',
    ],
    sections: [
      { heading: 'How should I train?', body: 'Beginners should train the WHOLE BODY each session (one push, one pull, one leg exercise) instead of splitting it into single muscle groups. 3 sessions a week is enough to make progress.' },
    ],
    tips: ['Ask a gym trainer to check your form for the first few sessions.'],
    safety: ['Always have a spotter when lifting heavy.', 'Don’t hold your breath under load — exhale as you push.'],
  },

  'ex-incline-bench': {
    title: 'Incline Bench Press',
    summary: 'A pressing exercise on an inclined bench to build the upper chest. Step-by-step for beginners.',
    level: 'Beginner',
    muscles: 'Upper chest, front delts, triceps',
    equipment: 'Incline bench + barbell (or dumbbells)',
    sections: [
      { heading: 'What does this work?', body: 'This is a pressing exercise done lying on a slightly inclined bench (not flat). Because the bench is inclined, the UPPER chest (near the collarbone) works harder, giving a fuller, more balanced chest.' },
    ],
    steps: [
      'Set the bench back to about 30 degrees — just a slight incline. Too steep turns it into a shoulder exercise.',
      'Lie back on the bench with both feet planted firmly on the floor. Keep your glutes and upper back on the bench at all times.',
      'Grip the bar a bit wider than shoulder width, wrists straight.',
      'Unrack the bar and press it straight up over your chest — the starting position.',
      'Breathe in and lower the bar slowly until it lightly touches your upper chest. Keep your elbows tucked slightly, not flared out.',
      'Breathe out and press the bar back up to the start. Control the speed, don’t let it drop. Repeat.',
    ],
    mistakes: [
      'Setting the bench too steep → the load shifts to the shoulders, straining them and missing the chest.',
      'Flaring your elbows out at 90 degrees to your body → hard on the shoulders. Keep them tucked to about 45 degrees.',
      'Bouncing the bar off your chest for momentum → it loses effect and risks injury.',
      'Arching your back too much to press heavier → keep your upper back and glutes on the bench.',
    ],
    tips: [
      'Beginners: train with an empty bar or very light weight for a few sessions to learn the movement.',
      '8–12 reps per set, 3 sets, resting 60–90 seconds.',
    ],
    safety: [
      'Always use a spotter when going heavy, or use a Smith machine if training alone.',
      'Don’t hold your breath under load — exhale as you press up.',
      'Sharp shoulder pain → lower the bench incline or reduce the weight.',
    ],
  },

  // ── WALKING ─────────────────────────────────────────────
  'walk-daily': {
    title: 'Daily walking for beginners',
    summary: 'Turn walking into a lasting habit — start light, build up gradually, no sore feet.',
    level: 'Beginner',
    steps: [
      'Start from where you are now: 10–15 minutes a day is plenty for the first week. Don’t force 10,000 steps right away.',
      'Stand tall, look about 10m ahead, relax your shoulders, and swing your arms naturally with your steps.',
      'Land on your heel and roll through to your toes. Take moderate steps — don’t try to stride long.',
      'Each week, add 5 more minutes or about 1,000 steps until you reach the goal you want.',
    ],
    mistakes: [
      'Walking too long on day one → sore shins and calves, then discouragement and quitting.',
      'Walking while looking down at your phone → a stiff neck and poor posture.',
      'Wearing stiff, ill-fitting shoes → blisters and heel pain.',
    ],
    sections: [
      { heading: 'How many sessions a week?', body: 'Light walking can be done almost daily because it puts little strain on the body. Beginners can aim for 5–7 sessions a week of 15–30 minutes each, then gradually increase the duration rather than the speed.' },
    ],
    tips: [
      'Choose cushioned, well-fitting athletic shoes.',
      'Invite a friend along or listen to a podcast to keep it consistent.',
    ],
    safety: [
      'Sharp pain in a knee, shin or heel → rest, cut the distance, don’t push it.',
      'Drink enough water and avoid the midday heat.',
    ],
  },

  'walk-brisk': {
    title: 'Power walking to burn fat',
    summary: 'How to walk fast with good technique to burn more calories without running.',
    level: 'Beginner',
    steps: [
      'Warm up for 3–5 minutes with an easy, relaxed walk.',
      'Increase your step rate (step faster) rather than striding longer — that’s the key to walking fast without hip pain.',
      'Bend your elbows to 90 degrees and pump your arms actively; the faster your arms, the faster your legs follow.',
      'Hold an intensity where you can talk but not sing for 20–30 minutes.',
      'Cool down for 3–5 minutes by slowing to an easy pace, then gently stretch your calves and hamstrings.',
    ],
    mistakes: [
      'Overstriding to go faster → strained hips, hard heel strikes and joint pain.',
      'Crossing your arms or keeping them still → you lose half your drive and can’t lift your pace.',
      'Walking fast but hunched and leaning forward → a sore lower back.',
    ],
    sections: [
      { heading: 'How do I know I’m fast enough?', body: 'Use the talk test: if you can say a few short sentences but can’t sing a whole line, you’re in the right fat-burning zone. If you can still chat comfortably, pick up your step rate.' },
    ],
    tips: [
      'Choose a flat, open route to keep a steady rhythm.',
      'Add a gentle incline to raise the intensity without needing to run.',
    ],
    safety: [
      'Shin splints (pain at the front of the lower leg) → slow down, check your shoes and shorten your stride.',
    ],
  },

  'walk-10k': {
    title: 'Reaching 10,000 steps a day',
    summary: 'How to fit steps into a busy day to hit 10,000 steps without a dedicated workout.',
    level: 'Beginner',
    steps: [
      'Measure your baseline over 3 days (the app or your phone can count for you). That’s your starting point.',
      'Each week, add about 1,000 steps a day over your old baseline instead of jumping straight to 10,000.',
      'Weave steps into daily life: take the stairs, park further away, walk while you’re on the phone.',
      'Schedule 2–3 “10-minute walks” across the day (morning, noon, evening) — together they already add up to several thousand steps.',
    ],
    mistakes: [
      'Forcing 10,000 steps on the very first day → sore feet and reluctance to walk the next day.',
      'Relying on a single long walk → miss one and you fall short for the whole day. Spreading it out is easier to keep up.',
      'Treating 10,000 as mandatory — for many people 7,000–8,000 steps a day is already very good.',
    ],
    sections: [
      { heading: 'Do I really need 10,000?', body: 'No. 10,000 is just an easy-to-remember number, not a magic threshold. Research shows benefits rise clearly from as few as 6,000–8,000 steps a day. What matters is more than yesterday, kept up consistently.' },
    ],
    tips: [
      'Set a “stand up and walk for 5 minutes” reminder every hour if you sit at work for long stretches.',
      'A 10–15 minute walk after meals aids digestion and racks up steps.',
    ],
    safety: ['Build up steps gradually; knee or foot pain → hold steady for a week before increasing again.'],
  },

  // ── CYCLING ─────────────────────────────────────────────
  'cycle-start': {
    title: 'Start cycling safely',
    summary: 'Set the bike up to fit you and pedal correctly to avoid knee and back pain from day one.',
    level: 'Beginner',
    steps: [
      'Set the saddle height: at the lowest point of the pedal stroke, your knee should be only slightly bent (neither locked straight nor sharply bent).',
      'Wear a well-fitting helmet and buckle the strap before every ride — even short ones.',
      'Keep your back naturally straight, elbows slightly soft, hands relaxed on the handlebars, shoulders loose.',
      'Spin your legs lightly and quickly (about 70–90 revolutions per minute) instead of grinding a heavy gear.',
      'Shift to an easier gear before a climb; shift to a harder gear on descents or when you want more speed.',
    ],
    mistakes: [
      'Setting the saddle too low → the knee bends too much, causing pain at the front of the knee.',
      'Head-down grinding a heavy gear for speed → sore knees and quick fatigue. A light spin lasts longer.',
      'Gripping the bars tightly and locking your elbows → every bump jolts straight into your shoulders and wrists.',
      'Forgetting to check the brakes and tyres before setting off.',
    ],
    sections: [
      { heading: 'What is cadence (leg spin)?', body: 'It’s the number of pedal revolutions per minute. Beginners should keep a light, steady spin (70–90 rpm) instead of grinding a heavy gear. A light spin is easier on the knees and saves energy for longer rides.' },
    ],
    tips: [
      'Practise in a quiet area to get used to shifting and braking before heading into traffic.',
      'Carry water and a mini pump or patch kit for longer rides.',
    ],
    safety: [
      'Always wear a helmet; ride in the correct lane and signal with your hand when turning.',
      'Squeeze both brakes smoothly; avoid grabbing the front brake hard, which can flip the bike.',
    ],
  },

  'cycle-first-ride': {
    title: 'Your first long ride (20–30km)',
    summary: 'How to pace yourself, eat and drink, and stay safe to finish your first long route.',
    level: 'Intermediate',
    steps: [
      'Pick a flat, quiet route for your first time. Estimate around 1.5–2 hours.',
      'Ride the first 20 minutes easy to warm your legs up — don’t blast off right away.',
      'Keep a steady spin; on climbs, shift to an easier gear and stay seated instead of standing and grinding.',
      'Take a few sips of water every 15–20 minutes — don’t wait until you’re thirsty.',
      'For rides over 1 hour, eat a light snack (banana, a bar) around the midpoint so you don’t “bonk”.',
    ],
    mistakes: [
      'Pushing too hard in the first 10km → running out of energy for the rest.',
      'Forgetting to drink and snack → dizziness, cramps and a sudden loss of energy.',
      'Not checking the bike before setting off → a flat tyre mid-route with no patch kit.',
    ],
    sections: [
      { heading: 'Ride solo or in a group?', body: 'Riding in a group is safer and more fun for your first time: there’s help if you have a mechanical, and drafting behind someone saves energy. If you ride solo, tell a family member your route and carry a fully charged phone.' },
    ],
    tips: [
      'Check your tyres, brakes and chain before you start.',
      'Wear breathable clothing, and consider gloves to reduce hand numbness on long rides.',
    ],
    safety: [
      'Wear a helmet; use lights if it’s dark or foggy.',
      'Cramps or dizziness → pull over, rest, drink water, don’t push on.',
    ],
  },

  // ── SWIMMING ────────────────────────────────────────────
  'swim-basics': {
    title: 'Getting comfortable in water & breathing underwater',
    summary: 'The first step for people afraid of water: floating, breathing and feeling at ease underwater.',
    level: 'Beginner',
    steps: [
      'Start in shallow, chest-deep water. Hold the wall, put your face in the water and breathe out slowly through your nose/mouth.',
      'Practise a gentle hold then exhale into bubbles underwater, lift up and breathe in. Repeat until it feels familiar.',
      'Practise a front float: hold the wall, extend your body, relax and let your face rest in the water — your body floats when you relax.',
      'Hold a float or the wall and practise a gentle, straight-legged kick from the hips (not much knee bend), toes pointed.',
      'Put it together: push gently off the wall, glide face-down and kick a few metres while breathing out underwater.',
    ],
    mistakes: [
      'Holding your breath and tensing up → you sink and panic more easily. The trick is to relax and breathe out steadily.',
      'Lifting your head too high to breathe → your hips drop and your legs sink, wasting energy.',
      'Kicking by bending your knees like riding a bike → the water resists and you don’t move. Kick straight from the hips.',
    ],
    sections: [
      { heading: 'Afraid of water — where do I start?', body: 'Don’t rush into swimming. Spend your first few sessions just getting used to breathing out underwater and floating relaxed in the shallow end. Once your body trusts that “relaxing makes you float,” the fear fades and the next steps get much easier.' },
    ],
    tips: [
      'Use goggles to see clearly underwater — it’s far less scary.',
      'Practise where there’s a lifeguard or a strong swimmer with you.',
    ],
    safety: [
      'Always practise in shallow water within standing depth when you’re starting out.',
      'Don’t swim alone; don’t get in the water when you’re very tired or have just eaten a big meal.',
    ],
  },

  'swim-freestyle': {
    title: 'Basic freestyle',
    summary: 'Combine arms, legs and side breathing to swim your first smooth metres of freestyle.',
    level: 'Intermediate',
    steps: [
      'Glide face-down, body extended straight, head looking straight down at the bottom (don’t lift it), with a gentle straight-legged kick from the hips.',
      'Pull with one arm: reach it forward, “catch” the water, then pull along your body to your thigh while the other arm stays extended and waits.',
      'Rotate your whole body gently with the pulling arm so the arm reaches further — the power comes from hip rotation, not just the shoulder.',
      'Breathe to the side: as one arm pulls back, turn your face to that side just enough to get your mouth out of the water and breathe in, then face back down and breathe out.',
      'Start by breathing once every 3 arm pulls (alternating sides) for balance; swim short stretches, then rest.',
    ],
    mistakes: [
      'Lifting your whole head forward to breathe → your hips and legs sink and you lose momentum. Only turn your face to the side.',
      'Pulling with shoulder strength without rotating your body → you tire fast and your reach is short.',
      'Holding your breath while your face is down → you run out of air after a few strokes. You must breathe out steadily underwater.',
      'Kicking with a big knee bend → strong drag. Keep your legs nearly straight and your ankles loose.',
    ],
    sections: [
      { heading: 'What order should I learn it in?', body: 'Break it down, then combine: a kicking session (holding a float) → a one-arm pull drill → practising body rotation with side breathing → and only then putting all three together. Don’t try to perfect the whole stroke at once; fixing one piece at a time progresses faster.' },
    ],
    tips: [
      'Use a pull buoy or a kickboard to train arms and legs separately.',
      'Swimming slow and long is better than fast with a messy breathing rhythm.',
    ],
    safety: [
      'Swim in a lane and rest at the wall when you’re out of breath.',
      'Dizziness or chest tightness → get out and rest, don’t keep swimming.',
    ],
  },

  'swim-laps': {
    title: 'Swim more laps without running out of breath',
    summary: 'How to split up rest and hold a rhythm to swim longer and add laps each session.',
    level: 'Beginner',
    steps: [
      'Warm up with 2–3 very easy, relaxed laps to get used to the water and your breathing.',
      'Swim intervals: swim 1 lap, then rest 20–30 seconds at the wall, and repeat. Rest enough for your heart rate to settle.',
      'Keep a steady pace, slower than you think — swimming for endurance means swimming relaxed, not straining.',
      'Each session, try one more lap or shorten your rest a little compared with last time.',
      'Finish with 1–2 very slow laps to cool down.',
    ],
    mistakes: [
      'Swimming all-out on the first lap → out of breath, long rests, and thinking you’re “unfit”.',
      'Resting too long or too short between laps → you either cool down or don’t recover in time.',
      'Focusing only on swimming fast and neglecting steady breathing → you tire quickly.',
    ],
    sections: [
      { heading: 'How many sessions a week?', body: '2–3 sessions a week, every other day, is enough to build endurance steadily. Each session, add a little to your total lap count rather than increasing speed. Endurance in the water improves quite fast if you keep your breathing relaxed.' },
    ],
    tips: [
      'Count laps with an easy-to-remember marker, or log them in the app after your swim.',
      'Breathe on a fixed rhythm (e.g. 3 strokes per breath) to swim more steadily.',
    ],
    safety: [
      'Swim in a lane that suits your level; rest as soon as you feel breathless or dizzy.',
      'Don’t swim alone where there’s no lifeguard.',
    ],
  },

  // ── YOGA ────────────────────────────────────────────────
  'yoga-start': {
    title: 'Your first yoga session at home',
    summary: 'What you need, how to breathe, and a few foundational poses for a gentle, pain-free first yoga session.',
    level: 'Beginner',
    steps: [
      'Prepare a mat (or a soft flat surface), wear stretchy clothes, and pick a quiet spot with room to extend your arms and legs.',
      'Sit up tall and practise belly breathing: breathe in and the belly expands, breathe out and it draws in, slow and steady for 1–2 minutes.',
      'Cat–Cow pose: on hands and knees, breathe in as you arch your back and lift your head, breathe out as you round your back and drop your head. Repeat 8–10 times to warm up the spine.',
      'Downward Dog: on hands and feet, push your hips up high into an inverted V, knees slightly bent if it’s tight. Hold for 3–5 breaths.',
      'Warrior II: step your feet wide, turn the front foot out, bend the front knee, and extend both arms out to the sides. Hold 3–5 breaths per side.',
      'Finish with Child’s pose: kneel and fold forward, forehead to the mat, arms extended in front, and breathe deeply for 5–10 breaths to relax.',
    ],
    mistakes: [
      'Forcing yourself into deep poses like the video → overstretching, pain and discouragement. Yoga is a comfortable stretch, not pain.',
      'Holding your breath in a pose → it loses its relaxing effect. Always breathe slow and steady.',
      'Skipping the spinal warm-up (cat–cow) → going straight into deep poses can strain your back.',
    ],
    sections: [
      { heading: 'Can I do it if I’m not flexible?', body: 'Yes — and that’s exactly why you should. Flexibility is a result of yoga, not a requirement to start. Keep your knees slightly bent and enter each pose only to a point that feels comfortable; after a few weeks your body will noticeably loosen up.' },
    ],
    tips: [
      'Move with your breath: pair each movement with an inhale or an exhale.',
      '10–15 minutes a day beats one long session a week.',
    ],
    safety: [
      'Sharp joint pain (different from a comfortable muscle stretch) → back out of the pose immediately.',
      'If you have spine or blood-pressure issues, or you’re pregnant → check with a doctor first.',
    ],
  },

  'yoga-desk': {
    title: 'Yoga for office workers (stiff neck, back pain)',
    summary: 'A short stretch sequence to relieve the neck, shoulders and lower back after hours at the computer.',
    level: 'Beginner',
    steps: [
      'Neck stretch: sit tall, tilt your head to one side to bring your ear toward your shoulder, hold 20–30 seconds, then switch. No sharp jerking.',
      'Shoulder rolls: roll your shoulders backward 10 times, then forward 10 times to loosen the neck and shoulders.',
      'Chest–shoulder stretch: clasp your hands behind your back, straighten and gently lift them, opening the chest, hold 20–30 seconds (counters the hunched sitting posture).',
      'Seated spinal twist: sit tall, rotate your torso to one side holding the chair, hold 20–30 seconds per side to relax the back.',
      'Lower back & hip stretch: stand up, place one ankle on the opposite knee into a figure-4, bend the standing knee slightly to stretch the glute–hip, hold 20–30 seconds per side.',
    ],
    mistakes: [
      'Jerking or bouncing into the stretch → easy to strain a muscle. Ease in and hold still.',
      'Holding your breath while stretching → the muscle can’t relax. Breathe out deeply as you go deeper.',
      'Only stretching once it already hurts badly → do short stretches several times a day to prevent it in advance.',
    ],
    sections: [
      { heading: 'When should I do it?', body: 'Spread 1–2 sessions across your workday, 3–5 minutes each — mid-morning and mid-afternoon are when the neck and shoulders start to ache. Set a phone reminder so you don’t forget. Consistency matters more than long sessions.' },
    ],
    tips: [
      'Combine it with standing up and walking for a few minutes each hour.',
      'Set your screen at eye level to reduce neck slouching from the start.',
    ],
    safety: ['Pain radiating down your arm or lasting numbness → stop and see a doctor, don’t force a hard stretch.'],
  },

  'yoga-flexibility': {
    title: 'Yoga for flexibility',
    summary: 'A sequence stretching the hamstrings, hips and spine to make your body suppler over time.',
    level: 'Beginner',
    steps: [
      'Warm up with 8–10 cat–cow reps and a few downward dogs to get the body warm — don’t stretch deeply while cold.',
      'Forward fold (standing or seated): knees slightly bent, let your torso sink down with your breath to stretch the hamstrings. Hold 5–8 breaths.',
      'Pigeon pose (hip stretch): one leg folded in front, the other extended back, lower your torso down gently. Hold 5–8 breaths per side.',
      'Reclined spinal twist: lie on your back, bend one knee and draw it across to the other side, keeping both shoulders on the floor. Hold 5–8 breaths per side.',
      'Finish in Child’s pose and lie down to relax for 1–2 minutes, breathing steadily.',
    ],
    mistakes: [
      'Rushing to force depth to “get flexible fast” → strained muscles, the opposite effect and injury risk.',
      'Holding a pose while holding your breath → the muscle can’t release. Breathe out to sink a little deeper each breath.',
      'Stretching while cold → easy to slightly tear muscle fibres. Always warm up first.',
    ],
    sections: [
      { heading: 'How long until I’m more flexible?', body: 'Flexibility comes slowly but surely: train 3–4 sessions a week, holding each pose 30–60 seconds, and after 3–4 weeks you’ll see a clear difference. Consistency and patience matter more than forcing depth in a single session.' },
    ],
    tips: [
      'Stretching after another workout (running, gym) while your muscles are warm is most effective.',
      'Use a strap or towel for support if your hands can’t reach your feet yet.',
    ],
    safety: ['The right feeling is a comfortable stretch; sharp pain or strong muscle shaking means you’ve gone too far — ease back.'],
  },

  // ── BADMINTON ───────────────────────────────────────────
  'badminton-start': {
    title: 'Badminton for beginners',
    summary: 'How to hold the racket, stand ready and serve correctly so you can play from your first session.',
    level: 'Beginner',
    steps: [
      'Use the forehand (handshake) grip: hold the handle as if shaking someone’s hand, fingers relaxed, not clenched.',
      'Ready stance: feet shoulder-width apart, knees slightly bent, weight on the balls of your feet, racket up in front of you and ready.',
      'Move with small shuffle steps, then a long step toward the shuttle, and return to the centre of the court right after hitting.',
      'Low serve: drop the shuttle and gently push the racket so it flies just over the net into the diagonal box, making contact below your waist.',
      'High serve: swing harder so the shuttle flies high and deep to the back of your opponent’s court (good for singles).',
    ],
    mistakes: [
      'Gripping the racket too tightly the whole match → a stiff wrist, no “flick” and quick fatigue.',
      'Standing still after a hit → you don’t get back to centre and your opponent runs you around.',
      'Swinging with your whole arm but forgetting the wrist flick → you lose power and accuracy.',
      'Standing with straight legs and a high centre of gravity → slow to react to the shuttle.',
    ],
    sections: [
      { heading: 'Why return to the centre?', body: 'The centre of the court (slightly back) is the position from which you can reach every corner fastest. Making it a habit to return there right after a hit keeps you ready for the next shot — this is what separates beginners from players with a foundation.' },
    ],
    tips: [
      'Practise the wrist flick with a hanging shuttle or by tapping gently against a wall to learn the feel.',
      'Wear badminton shoes (grippy, snug) instead of running shoes so you can change direction safely.',
    ],
    safety: [
      'Warm up your wrist, shoulder and ankles well — badminton has lots of direction changes and it’s easy to roll an ankle.',
      'Shoulder pain when smashing → lower the intensity and review your swing technique.',
    ],
  },

  'badminton-strokes': {
    title: 'Foundational strokes',
    summary: 'Three basic strokes — clear, drop and smash — are enough to play out rallies.',
    level: 'Beginner',
    steps: [
      'The clear: hit the shuttle high and deep to the back of your opponent’s court to push them back and buy yourself time to reset.',
      'Overhead contact: reach up to meet the shuttle at the highest point in front of your forehead, rotating your body and flicking your wrist at contact.',
      'The drop: same swing motion as the clear but ease off the power at the last moment, so the shuttle falls just over the net on the other side.',
      'The smash: contact the shuttle high and hit it steeply downward, firm and decisive, while it’s up high in front of you.',
      'Take turns practising each stroke with a partner: 10 clears, 10 drops, then work on the smash.',
    ],
    mistakes: [
      'Smashing everything at full power → you tire fast and mishit often. Knowing when to clear and when to drop matters more.',
      'Contacting the shuttle too low or behind your head → you lose power and control of direction.',
      'Using the same obvious swing every time → your opponent reads your intentions.',
    ],
    sections: [
      { heading: 'Which stroke should I learn first?', body: 'Prioritise the clear and the drop first — they keep the rally going and move your opponent around. The smash looks “cool” but burns energy and misses easily; save it for when you’ve got the other two solid and the shuttle is set up high.' },
    ],
    tips: [
      'Disguise your intentions by starting the clear and the drop with the same swing.',
      'Practise against a wall or with a steady partner to learn the contact point.',
    ],
    safety: ['The smash and overhead reaches strain the shoulder easily — warm it up well and don’t practise too many smashes when you’re starting out.'],
  },

  // ── PICKLEBALL ──────────────────────────────────────────
  'pickleball-start': {
    title: 'Pickleball for beginners',
    summary: 'Grasp the basic rules, the grip and the non-volley zone so you can get on court and play right away.',
    level: 'Beginner',
    steps: [
      'Use the handshake (continental) grip — it works for both forehand and backhand, with a relaxed hold.',
      'Serve: stand behind the baseline, hit the ball below your waist with an upward arc, so it flies diagonally into the opposite service box.',
      'Remember the double-bounce rule: the ball must bounce once on the receiver’s side and once on the server’s side before anyone can volley (hit it out of the air).',
      'Don’t volley while standing in the “kitchen” (the 2.13m non-volley zone by the net) — this is beginners’ most common fault.',
      'After the first few shots, move up near the kitchen line with your partner — the best position to control the ball.',
    ],
    mistakes: [
      'Stepping into the kitchen then volleying → an unnecessary lost point. Only enter the kitchen once the ball has bounced.',
      'Forgetting the double-bounce rule and rushing to volley right after the serve → a fault.',
      'Camping at the baseline → your opponents dominate the net. Move up to the kitchen line.',
      'Hitting every ball hard → it sails out. Pickleball is won on control, not power.',
    ],
    sections: [
      { heading: 'What is the “kitchen”?', body: 'The kitchen (non-volley zone) is the 2.13m line from the net on each side. In this zone you can’t hit the ball out of the air; you must let it bounce first. This rule makes pickleball more about placing the ball cleverly than smashing hard — and it’s why beginners can have fun right away.' },
    ],
    tips: [
      'Play doubles to get used to the rules and run around less.',
      'Practise serving diagonally over the net a few dozen times before a match.',
    ],
    safety: [
      'Warm up your ankles, knees and shoulders; the court is small but has lots of direction changes.',
      'Don’t back-pedal to reach a high ball (you can fall backward) — pivot and run back instead.',
    ],
  },

  'pickleball-tips': {
    title: 'Tips for your first match',
    summary: 'A few simple tactics to play smarter and score from your very first match.',
    level: 'Beginner',
    steps: [
      'Prioritise getting the ball safely in play over trying to win the point outright — most points come from opponents’ errors.',
      'Practise the dink: hit softly so the ball drops into the opposite kitchen, forcing your opponent to play a low ball instead of attacking.',
      'After serving/receiving, move up quickly to the kitchen line with your partner and stay level with each other.',
      'Aim between the two opponents, or at the weaker player’s feet, to put them in a bind.',
      'On the third shot, try the “third-shot drop”: an arcing shot that lands softly in the kitchen so you have time to move up to the net.',
    ],
    mistakes: [
      'Trying to smash a winner on every ball → you make more errors than points.',
      'The two of you standing at different depths (one up, one back) → a gap opens in the middle of the court.',
      'Standing at the baseline after serving → you don’t control the net.',
    ],
    sections: [
      { heading: 'Why is the dink so effective?', body: 'A soft dink into the kitchen means your opponent can’t smash (the ball is low and near the net), forcing a soft reply. Whoever dinks patiently and better usually wins — it’s the skill most worth practising for beginners who want to improve fast.' },
    ],
    tips: [
      'Communicate with your partner: call “mine” / “yours” to avoid both of you going for it or both leaving it.',
      'Keep your paddle ready at chest height to react quickly at the net.',
    ],
    safety: ['At the net the ball comes fast — wear eye protection if you have it, and don’t stand too close to your partner to avoid clashing paddles.'],
  },

  // ── TENNIS ──────────────────────────────────────────────
  'tennis-start': {
    title: 'Tennis for beginners',
    summary: 'How to hold the racket, stand correctly and hit your first forehand over the net.',
    level: 'Beginner',
    steps: [
      'Use the Eastern grip for the forehand: place your palm flat against the racket face, then slide down to grip the handle — like shaking hands with the racket.',
      'Ready stance: feet wider than your shoulders, knees slightly bent, your non-dominant hand supporting the racket throat, weight on the balls of your feet.',
      'Into the forehand: rotate your shoulders and hips to load up (take the racket back), and step forward with your front foot.',
      'Hit the ball at hip height and out in front of your body, swinging low to high and finishing with the racket over your opposite shoulder.',
      'Start by hitting balls you drop and bounce yourself, then move on to balls fed by someone else.',
    ],
    mistakes: [
      'Hitting the ball too close to your body or too late (past you) → you lose power and can’t control direction.',
      'Swinging with just your arm, without rotating your body → weak shots and a quickly tired shoulder.',
      'Standing with straight legs and waiting for the ball instead of stepping in to meet it.',
      'Gripping the racket rigidly and squeezing hard → a stiff wrist and easy elbow pain.',
    ],
    sections: [
      { heading: 'What should I practise first?', body: 'Spend most of your early time on the forehand and footwork. Don’t rush into big serves or a two-handed backhand. Being able to land 10 steady forehands over the net is a solid foundation that makes every other stroke easier.' },
    ],
    tips: [
      'Practise against a wall to get many ball contacts in a short time.',
      'Preparing the racket early (taking it back the moment you see the ball) is the secret to being on time.',
    ],
    safety: [
      'Warm up your shoulder, elbow and wrist; elbow pain (“tennis elbow”) usually comes from poor technique or an over-strung racket.',
      'Wear grippy tennis shoes to change direction and stop safely.',
    ],
  },

  'tennis-rally': {
    title: 'Rallying consistently',
    summary: 'Prioritise consistency over power to keep the ball in the court and extend the rally.',
    level: 'Beginner',
    steps: [
      'Set your goal: get the ball over the net and into the court consistently — no need for power or winners yet.',
      'Hit the ball on an arc over the net (1–2m above it) for a safety margin, so it still lands in the court.',
      'After each shot, move straight back toward the centre (near the baseline) to be ready for the next ball.',
      'Turn to meet the ball and prepare the racket early; hit out in front of your body and finish the swing fully.',
      'Challenge: with a partner, keep the ball going 10 times in a row without a miss, then build up to 20.',
    ],
    mistakes: [
      'Hitting right over the net tape to “play it safe” → you clip the net easily. Hitting higher over the net is far safer.',
      'Standing still to admire the shot you just hit → you don’t get back in position for the next one.',
      'Trying to hit hard on every ball → a high error rate and rallies that keep breaking down.',
    ],
    sections: [
      { heading: 'Why does consistency win?', body: 'At the beginner level, most points come from unforced errors, not winners. Whoever gets more balls in the court almost always wins. Practising long rallies trains the thing that matters most: consistency and movement.' },
    ],
    tips: [
      'Count the number of ball contacts in a rally to measure your own progress.',
      'Breathing out each time you hit the ball helps keep your rhythm and reduces tension.',
    ],
    safety: ['Lots of movement tires the legs — warm up and stretch your thighs and calves before and after your session.'],
  },

  // ── FOOTBALL ────────────────────────────────────────────
  'football-warmup': {
    title: 'Warm up & stay injury-free in pickup football',
    summary: 'Weekend pickup games cause injuries if you start cold — here’s how to warm up properly.',
    level: 'Beginner',
    steps: [
      'Jog lightly around the pitch for 3–5 minutes to warm up before you touch the ball.',
      'Dynamic warm-up: high knees, heel flicks, walking lunges, hip rotations — 20–30 seconds each.',
      'Warm up your ankles and knees thoroughly in both directions — these are the two joints most prone to injury in football.',
      'Do a few gentle accelerations (70–80% effort) so your muscles get used to sprinting before the match.',
      'Juggle and pass gently with teammates for a few minutes to get a feel for the ball.',
    ],
    mistakes: [
      'Playing straight away while your muscles are cold → hamstring strains, cramps, even muscle tears.',
      'Only static stretching (sitting and stretching) before playing → do a dynamic warm-up instead, and save static stretching for afterward.',
      'Skipping the ankle warm-up → easy to roll an ankle in a tackle or a change of direction.',
      'Wearing the wrong shoes for the surface (long studs on a hard pitch) → slipping and knee strain.',
    ],
    sections: [
      { heading: 'Why a dynamic warm-up, not sitting and stretching?', body: 'Before intense activity, the body needs to be “woken up” with movement (a dynamic warm-up) to raise temperature and blood flow to the muscles. Static stretching while cold can temporarily weaken muscles and increase strain risk. Save static stretching for the cool-down after the match.' },
    ],
    tips: [
      'Hydrate before, during and after; on long games, take water breaks between halves.',
      'Wear shoes suited to the surface (natural grass, artificial turf or concrete).',
    ],
    safety: [
      'Sharp pain in the back of the thigh after a sprint → stop immediately; it’s likely a strain, and pushing on makes it worse.',
      'A sprained ankle → ice it, elevate it and rest, don’t try to play on.',
    ],
  },

  'football-skills': {
    title: 'Core skills: control, passing, shooting',
    summary: 'Three core skills to play with more confidence in pickup games.',
    level: 'Beginner',
    steps: [
      'Inside-foot pass: use the inside of your foot to strike the middle of the ball, with your foot pointing straight at the receiver. This is the most accurate pass.',
      'First touch (control): as the ball arrives, meet it with a soft foot and “cushion” it close to you instead of letting it bounce away.',
      'Dribbling: nudge the ball with the outside/inside of your foot in small touches, keeping it under control, with your head up to scan.',
      'Shooting: plant your standing foot beside the ball, strike the middle of the ball with your laces, and swing your leg through toward where you want it to go.',
      'Repeat with a wall or a partner: 20 inside-foot passes, 20 first touches, then practise shooting at a target.',
    ],
    mistakes: [
      'Passing with your toe → the ball goes off-line and the power is hard to control.',
      'Trapping the ball with a stiff foot → it bounces away and you lose control.',
      'Staring down at the ball while dribbling → you can’t see teammates or opponents.',
      'Shooting with your toe “for power” → it lacks accuracy and can hurt your toes.',
    ],
    sections: [
      { heading: 'Which skill should I practise first?', body: 'Passing and first touch are the two most-used skills in every game. A clean first touch buys you time to act; an accurate pass keeps possession for your team. A powerful shot looks appealing but is used less often — build your foundation from passing and control first.' },
    ],
    tips: [
      'Practising against a wall is an effective way to train passing and first touch when you’re alone.',
      'Train both feet — even just short passes with your weaker foot are a real advantage.',
    ],
    safety: ['Practise powerful shots once your muscles are warm; warm up your hips and thighs first to avoid straining a muscle when swinging your leg.'],
  },

  // ── BASKETBALL ──────────────────────────────────────────
  'basketball-start': {
    title: 'Basketball for beginners',
    summary: 'Basic dribbling, passing and shooting to play your first games.',
    level: 'Beginner',
    steps: [
      'Dribble with your fingertips (not your palm), bouncing the ball low around hip height, with your head up looking at the court, not the ball.',
      'Defensive stance: bend your knees, lower your centre of gravity, arms out, and move with lateral slide steps (don’t cross your feet).',
      'Chest pass: hold the ball at chest height, push it straight out with both hands to your teammate’s chest, finishing with your palms facing outward.',
      'Shoot using the BEEF principle: Balance (feet balanced), Eyes (eyes on the rim), Elbow (elbow straight under the ball), Follow-through (flick your wrist afterward).',
      'Practise shooting close to the rim first (under the backboard); once you’ve got it, gradually step back.',
    ],
    mistakes: [
      'Dribbling with your palm and bouncing too high → easy to strip, hard to control.',
      'Looking down at the ball while dribbling → you can’t see teammates or opponents.',
      'Shooting by shoving with your whole arm → the ball goes flat and straight, with no arc. Use your wrist to create spin and arc.',
      'Defending by crossing your feet → you lose balance and get beaten easily.',
    ],
    sections: [
      { heading: 'What to practise first to play sooner?', body: 'Prioritise head-up dribbling and close-range shooting. Dribbling while still scanning the court is the foundation for every play; mastering close shots builds confidence before shooting from range. Accurate chest passes keep possession for the team — these three are enough to get in the game.' },
    ],
    tips: [
      'Practise dribbling with both hands — being able to dribble with your weak hand is harder to defend.',
      'Shoot with a steady rhythm: legs – arm – wrist as one smooth motion.',
    ],
    safety: [
      'Warm up your ankles and knees well; basketball has lots of stop-starts and jumps.',
      'Land on both feet with knees slightly bent to reduce the force on your knees.',
    ],
  },

  'basketball-fitness': {
    title: 'Warm up & protect your ankles and knees',
    summary: 'Basketball has lots of jumping and cutting — warm up properly to avoid rolled ankles and knee pain.',
    level: 'Beginner',
    steps: [
      'Jog lightly around the court for 3–5 minutes, then do a dynamic warm-up: high knees, heel flicks, defensive lateral slides.',
      'Rotate and warm up your ankles and knees thoroughly in both directions — the two joints most prone to injury in this sport.',
      'Practise gentle jumps and correct landings: little hops in place, landing on both feet, bending the knees to “absorb” the impact.',
      'Do a few accelerations and sudden stops at moderate intensity so your muscles get used to the stop-start rhythm of a game.',
      'After the game, cool down by walking and static-stretching your calves, quads and hamstrings.',
    ],
    mistakes: [
      'Jumping for the ball right away before warming up → easy to roll an ankle or strain the Achilles.',
      'Landing on one leg or with a stiff, straight leg → the force loads onto your knee and ankle.',
      'Skipping the ankle warm-up → a tackle or change of direction rolls it instantly.',
    ],
    sections: [
      { heading: 'Why are ankles injured most?', body: 'Basketball constantly involves changing direction, jumping and landing — often on top of someone else’s foot. The ankle takes large twisting forces, so it’s very easy to roll. A thorough warm-up, high-top shoes that hug the ankle, and practising two-footed landings are the three most effective ways to prevent it.' },
    ],
    tips: [
      'Wear high-top basketball shoes with good grip to support your ankles.',
      'If you’ve rolled an ankle before, consider taping it or wearing an ankle brace when you play.',
    ],
    safety: [
      'A rolled ankle → stop playing immediately, ice it and elevate it; don’t try to “walk it off”.',
      'A dull knee ache that lingers after playing → lower the intensity and review your landing technique.',
    ],
  },
};
