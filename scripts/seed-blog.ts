/**
 * Seeds 8 SEO-focused blog posts about hiking in Kosovo, Albania, and Montenegro.
 * Run from the project root:  npx tsx scripts/seed-blog.ts
 * Requires DATABASE_URL in .env.local
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { blogPosts, adminUsers } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

const posts = [
  // ─── 1 ─────────────────────────────────────────────────────────────────────
  {
    slug: 'peaks-of-the-balkans-complete-hiking-guide',
    title: 'Peaks of the Balkans: The Complete Hiking Guide for 2025',
    excerpt:
      'Everything you need to know about hiking the 192 km Peaks of the Balkans trail through Kosovo, Albania and Montenegro — routes, difficulty, best time to go, and what to pack.',
    category: 'DESTINATION_GUIDE' as const,
    tags: ['peaks of the balkans', 'hiking guide', 'Kosovo', 'Albania', 'Montenegro', 'balkan trail'],
    featuredImageUrl:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    readingTimeMinutes: 12,
    seoTitle: 'Peaks of the Balkans Hiking Guide 2025 – Routes, Tips & Costs',
    seoDescription:
      'Complete guide to hiking the Peaks of the Balkans trail. 192 km across Kosovo, Albania and Montenegro. Routes, daily itineraries, difficulty, gear list and best time to visit.',
    published: true,
    publishedAt: new Date('2025-04-10T08:00:00Z'),
    content: `
<h2>What Is the Peaks of the Balkans Trail?</h2>
<p>The <strong>Peaks of the Balkans</strong> is a 192-kilometre circular trekking route that winds through three countries — Kosovo, Albania, and Montenegro — in the heart of the Prokletije mountain range. Known in Albanian as the <em>Bjeshkët e Namuna</em> (Accursed Mountains), this is one of the last great wild frontiers of Europe.</p>
<img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80" alt="Sweeping alpine landscape on the Peaks of the Balkans trail" />
<p>The trail typically takes <strong>10 to 13 days</strong> to complete in full, with most hikers covering 15–25 km per day depending on the stage. Elevation ranges from around 700 m in the valleys to over 2,500 m on high passes — so expect genuine mountain hiking, not a casual walk.</p>

<h2>The 10 Classic Stages</h2>
<p>The standard route begins and ends in Peja (Peć) in Kosovo, forming a loop. Here is the classic stage breakdown:</p>
<ul>
  <li><strong>Stage 1:</strong> Peja → Shtëpëza (Rugova Gorge entry, ~18 km)</li>
  <li><strong>Stage 2:</strong> Shtëpëza → Çerem / Kuqishtë (~22 km, crossing into Albania)</li>
  <li><strong>Stage 3:</strong> Valbona Valley traverse (~15 km, overnight in Valbona)</li>
  <li><strong>Stage 4:</strong> Valbona → Theth via Valbona Pass (2,170 m, ~21 km — the iconic day)</li>
  <li><strong>Stage 5:</strong> Theth → Dobërdol (~16 km, waterfalls and karst scenery)</li>
  <li><strong>Stage 6:</strong> Dobërdol → Vusanje (Montenegro border crossing, ~18 km)</li>
  <li><strong>Stage 7:</strong> Vusanje → Grebaje Valley (~14 km)</li>
  <li><strong>Stage 8:</strong> Grebaje → Babino Polje / Plav (~20 km)</li>
  <li><strong>Stage 9:</strong> Plav → Gusinje → re-enter Kosovo (~19 km)</li>
  <li><strong>Stage 10:</strong> Rragam / Liqenat → Peja (~17 km, return descent)</li>
</ul>
<img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80" alt="Hikers crossing a high alpine pass on the Peaks of the Balkans" />

<h2>Difficulty Level</h2>
<p>The Peaks of the Balkans is rated <strong>moderate to challenging</strong>. The terrain is unmistakably alpine — rocky ridges, steep ascents, exposed passes — but you do not need technical climbing skills. What you do need is solid cardiovascular fitness, multi-day hiking experience, and comfortable, worn-in footwear.</p>
<p>The single hardest day is Stage 4, the Valbona–Theth crossing. The pass sits at 2,170 m and the descent to Theth is steep, loose scree in places. Allow a full 7–8 hours and carry enough water.</p>

<h2>When to Go</h2>
<p>The trail is accessible from <strong>mid-June to late September</strong>. The sweet spot is <strong>July to early September</strong>: snow has melted from the passes, guesthouses are fully open, and the wildflower meadows are at their most spectacular. July and August are busier — if you prefer solitude, the last two weeks of June or September are ideal.</p>
<p>Avoid May and early June: the high passes can still be deep in snow and border crossings at altitude may be impassable. October sees the first snowfall and many guesthouses close.</p>

<h2>Accommodation: Guesthouses Along the Trail</h2>
<p>One of the great joys of the Peaks of the Balkans is the network of family-run <strong>guesthouses</strong> (Albanian: <em>bujtina</em>) that dot the route. These are not luxury lodges — expect shared dorms or simple double rooms, home-cooked meals of fresh bread, white cheese, lamb stew, and rakia — but the warmth of the hosts more than compensates.</p>
<img src="https://images.unsplash.com/photo-1490682143684-14369e18dce8?w=1200&q=80" alt="Traditional mountain guesthouse in the Albanian Alps" />
<p>Booking ahead is <strong>strongly recommended</strong> in July and August when the trail is at its busiest. On our guided departures, all accommodation is pre-booked and included in the price.</p>

<h2>Border Crossings</h2>
<p>The trail crosses three international borders: Kosovo–Albania, Albania–Montenegro, and Montenegro–Kosovo. These are pedestrian mountain crossings — there are no roads, no formal customs posts. You'll need a <strong>valid passport</strong> (most EU nationals and many others enter Kosovo visa-free; check your specific country). Kosovo is not an EU or Schengen member, so there is a passport stamp at each crossing.</p>
<p>Border guards do patrol these mountain passes, particularly on the Montenegro side. Carry your passport at all times and ensure your visa status is valid for all three countries before you leave.</p>

<h2>Essential Gear for the Peaks of the Balkans</h2>
<ul>
  <li>Waterproof hiking boots with ankle support (broken-in, not new)</li>
  <li>Trekking poles — essential for the steep descents</li>
  <li>Rain jacket and a warm mid-layer (temperatures drop sharply at altitude)</li>
  <li>35–50 litre pack with rain cover</li>
  <li>Headlamp (early starts are common)</li>
  <li>Offline maps downloaded: Maps.me or Wikiloc for the PoB trail</li>
  <li>Cash in euros — guesthouses rarely accept cards</li>
</ul>

<h2>Going Solo vs Joining a Guided Group</h2>
<p>Experienced mountain hikers can do the trail independently — waymarking has improved significantly in recent years. But the terrain is remote, the route changes seasonally, and language barriers at border crossings can be challenging.</p>
<p>A <strong>guided group departure</strong> removes all the logistics: accommodation booked, transfers sorted, local guides who know every variant and shortcut, and the safety net of having an expert on hand in genuinely wild terrain. It's also the best way to meet a group of like-minded hikers and share the experience.</p>
<img src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80" alt="Group of hikers on a mountain ridge in the western Balkans" />

<h2>How to Get There</h2>
<p>Most hikers fly into <strong>Pristina (PRN)</strong>, Kosovo — served by most major European airlines. From Pristina, Peja is roughly a 90-minute bus or taxi ride. Alternatively, fly into <strong>Tirana (TIA)</strong>, Albania, and travel north to Shkodër or Bajram Curri if you want to start from the Albanian side.</p>

<h2>Summary</h2>
<p>The Peaks of the Balkans is one of Europe's great undiscovered hiking trails — wild, culturally rich, logistically achievable, and genuinely breathtaking. Whether you spend 10 days doing the full loop or join a highlights itinerary covering the best stages, this is a journey that stays with you.</p>
`,
  },

  // ─── 2 ─────────────────────────────────────────────────────────────────────
  {
    slug: 'kosovo-hiking-guide-best-trails',
    title: 'Kosovo Hiking Guide: 7 Best Trails to Explore in 2025',
    excerpt:
      "From the dramatic Rugova Gorge to the summit of Gjeravica — Kosovo's highest peak — this guide covers the seven best hiking trails in Kosovo for all ability levels.",
    category: 'DESTINATION_GUIDE' as const,
    tags: ['Kosovo hiking', 'Rugova', 'Gjeravica', 'Brezovica', 'Kosovo trails', 'hiking guide'],
    featuredImageUrl:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80',
    readingTimeMinutes: 10,
    seoTitle: 'Kosovo Hiking Guide 2025: 7 Best Trails & Mountains',
    seoDescription:
      'Discover the best hiking trails in Kosovo: Rugova Gorge, Gjeravica Peak, Brezovica ski resort, Mirusha Waterfalls, and more. Full guide with difficulty ratings and directions.',
    published: true,
    publishedAt: new Date('2025-04-18T08:00:00Z'),
    content: `
<h2>Why Hike in Kosovo?</h2>
<p>Kosovo is one of Europe's smallest countries — and one of its most rewarding hiking destinations. The <strong>Prokletije and Šar mountain ranges</strong> dominate the west and south, offering alpine scenery that rivals anything in the Alps at a fraction of the crowds and cost. The country is compact enough that you can reach a mountain trailhead within two hours of the capital Pristina, yet the landscapes feel genuinely remote.</p>
<img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80" alt="Snow-capped mountains above Rugova Valley, Kosovo" />

<h2>1. Rugova Gorge and Valley</h2>
<p>The <strong>Rugova Gorge</strong> is Kosovo's Grand Canyon — a dramatic limestone canyon carved by the Peja River, stretching 25 km west of Peja city. The sheer walls rise hundreds of metres and the gorge narrows to barely 30 metres wide in places.</p>
<p><strong>The hike:</strong> The most popular walk follows the river along a trail used for centuries by shepherds and traders. The easy lower gorge section is 8 km (3 hours return). Extend into the Rugova Valley — a wide glacial valley above the gorge — for full-day or multi-day hiking. The Peaks of the Balkans trail passes through here.</p>
<p><strong>Difficulty:</strong> Easy (gorge) to Moderate (upper valley). <strong>Best time:</strong> May–October.</p>

<h2>2. Gjeravica — Kosovo's Highest Peak (2,656 m)</h2>
<p><strong>Gjeravica</strong> (also spelled Đeravica in Serbian) stands at 2,656 metres and is the highest point in Kosovo, located on the border with Albania in the Prokletije range. It is a genuine summit hike with a long approach and a rocky scramble to the top.</p>
<img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80" alt="Rocky summit approach on a Prokletije peak in Kosovo" />
<p><strong>Route:</strong> The most accessible route starts from the village of Lumbardh (near Peja). The trail climbs through beech and pine forest before emerging onto open alpine terrain. The summit day is demanding — 1,600 m of elevation gain — but non-technical. Allow 8–10 hours return.</p>
<p><strong>Difficulty:</strong> Challenging. <strong>Best time:</strong> July–September (snow often lingers until late June).</p>

<h2>3. Brezovica / Sharr Mountains</h2>
<p>The <strong>Šar Mountains</strong> (Kosovo side: Brezovica area) run along the border with North Macedonia and offer a completely different landscape from the Prokletije — broad grassy ridges, glacial lakes, and ski resort infrastructure that becomes hiking trails in summer.</p>
<p>The iconic walk is the <strong>Lake Luboten circuit</strong>: from Brezovica village, climb to the clear glacial lake at 2,400 m with views deep into North Macedonia. The Šar ridge walk can be extended to multi-day with wild camping.</p>
<p><strong>Difficulty:</strong> Moderate. <strong>Best time:</strong> June–September.</p>

<h2>4. Mirusha Waterfalls Canyon</h2>
<p>One for hikers who love water. The <strong>Mirusha Waterfalls</strong> are a series of 13 lakes connected by cascading waterfalls carved through white limestone in central Kosovo. The national park trail follows the canyon bottom — wading sections are unavoidable and that's entirely the point.</p>
<img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80" alt="Turquoise waterfall pool in a limestone canyon in Kosovo" />
<p><strong>The hike:</strong> 6 km one way (12 km return) through the canyon. Bring sandals or water shoes for the wading sections. Not suitable after heavy rain when water levels rise quickly.</p>
<p><strong>Difficulty:</strong> Easy–Moderate. <strong>Best time:</strong> June–September.</p>

<h2>5. Koritnik Mountain (above Dragash)</h2>
<p><strong>Koritnik</strong> (2,394 m) towers over the Gora region of southern Kosovo, a predominantly Gorani-speaking area near the Albanian and North Macedonian borders. The mountain is little-visited by international hikers and rewards those who make the effort with <strong>exceptional ridge views</strong> across three countries.</p>
<p>Start from Dragash town; the route climbs through pine and spruce forest before breaking onto a wide grassy ridge. The summit is a 6–7 hour return trip.</p>
<p><strong>Difficulty:</strong> Moderate. <strong>Best time:</strong> June–October.</p>

<h2>6. The Rugova Eagles Nest Via Ferrata</h2>
<p>For something more adventurous, the <strong>Eagles Nest via ferrata</strong> above Rugova Valley is Kosovo's most exciting fixed-rope climbing route. Steel cables and iron rungs take you up a sheer limestone face to a hidden plateau with vertigo-inducing views down to the valley floor.</p>
<p>No prior via ferrata experience is necessary but a head for heights and a helmet (rentable in Peja) are essential.</p>
<p><strong>Difficulty:</strong> Challenging. <strong>Best time:</strong> May–October.</p>

<h2>7. Peja Old Town to Patriarchate of Peć Walk</h2>
<p>Not every hike needs to be about altitude. The short walk from Peja's old bazaar to the 13th-century <strong>Patriarchate of Peć</strong> monastery — through the entrance of the Rugova Gorge — is a beautiful half-hour stroll combining cultural heritage and the first taste of the gorge's dramatic scenery. Perfect as a first-day warm-up or rest-day option.</p>

<h2>Getting to Kosovo's Hiking Trails</h2>
<p>Fly into <strong>Pristina Adem Jashari International Airport (PRN)</strong>. Most major European cities have direct connections — budget airlines including Wizz Air, Ryanair, and Eurowings operate routes. From Pristina, Peja (the main gateway for western Kosovo hiking) is 90 minutes by bus or shared taxi (furgon). For the Sharr Mountains, take a bus to Prizren (1.5 hrs from Pristina) then onward to Brezovica.</p>

<h2>Practical Tips for Hiking in Kosovo</h2>
<ul>
  <li><strong>Maps:</strong> Signage is improving but still patchy. Download Maps.me trails offline before you go.</li>
  <li><strong>Water:</strong> Mountain springs are generally clean but carry a filter for longer routes.</li>
  <li><strong>Accommodation:</strong> Peja is the main base. Guesthouses throughout Rugova Valley provide simple meals and beds at very low cost (€20–35 for dinner, bed, breakfast).</li>
  <li><strong>Currency:</strong> Kosovo uses the euro. Card acceptance is improving in Peja city; mountain guesthouses are cash only.</li>
  <li><strong>Safety:</strong> The mountains are remote. Tell someone your route and expected return time. Mobile signal is absent above ~1,500 m in most areas.</li>
</ul>
`,
  },

  // ─── 3 ─────────────────────────────────────────────────────────────────────
  {
    slug: 'albania-hiking-guide-accursed-mountains',
    title: 'Albania Hiking Guide: From the Accursed Mountains to the Albanian Alps',
    excerpt:
      "Albania's northern mountains are among Europe's most dramatic and least-visited. This guide covers the best hikes in the Albanian Alps — Valbona, Theth, the Razem Loop, and beyond.",
    category: 'DESTINATION_GUIDE' as const,
    tags: ['Albania hiking', 'Albanian Alps', 'Accursed Mountains', 'Valbona', 'Theth', 'northern Albania'],
    featuredImageUrl:
      'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1200&q=80',
    readingTimeMinutes: 11,
    seoTitle: 'Albania Hiking Guide 2025: Best Trails in the Albanian Alps',
    seoDescription:
      "Complete guide to hiking in Albania's northern mountains. Valbona, Theth, Accursed Mountains, the best trails, difficulty levels, and practical travel tips.",
    published: true,
    publishedAt: new Date('2025-05-01T08:00:00Z'),
    content: `
<h2>Albania's Northern Mountains: Europe's Last Wild Frontier</h2>
<p>The <strong>Albanian Alps</strong> — part of the larger Prokletije massif shared with Kosovo and Montenegro — are a landscape of superlatives. Jagged limestone peaks above 2,500 m, glacial valleys carved deep into the rock, emerald rivers running cold even in summer, and stone-towered villages where centuries-old hospitality customs still govern daily life.</p>
<img src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1200&q=80" alt="Dramatic limestone peaks of the Albanian Alps rising above a green valley" />
<p>This is Europe as it was before mass tourism. Infrastructure is improving fast — new guesthouses open each season, the Peaks of the Balkans trail is waymarked — but you can still spend days on a trail without seeing another hiker if you choose the right route.</p>

<h2>The Valbona–Theth Trek: Albania's Most Famous Hike</h2>
<p>This single-day crossing is the defining hike of northern Albania. Starting in the <strong>Valbona Valley</strong> — a UNESCO tentative listing — the trail climbs steeply to the <strong>Valbona Pass</strong> at 2,170 m before descending through pine forest and karst limestone to the picturesque village of <strong>Theth</strong>.</p>
<img src="https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=1200&q=80" alt="View down from the Valbona Pass toward the Albanian Alps" />
<p><strong>Distance:</strong> 21 km | <strong>Elevation gain:</strong> 1,100 m | <strong>Time:</strong> 7–9 hours<br />
<strong>Difficulty:</strong> Challenging | <strong>Best time:</strong> June–September</p>
<p>The pass is the high point in more ways than one: on a clear day, the views extend deep into Kosovo and Montenegro. Theth itself is worth an extra night — the Theth waterfall, the 18th-century <em>kulla</em> (stone lock-in tower), and the dramatic Grunas Canyon all reward exploration.</p>

<h2>Theth National Park Day Hikes</h2>
<p><strong>Theth</strong> makes an excellent base for 2–3 days of day hiking. The main options:</p>
<ul>
  <li><strong>Theth Waterfall:</strong> 1-hour easy walk to a 30 m waterfall on the Theth River. Perfect morning stroll.</li>
  <li><strong>Grunas Canyon:</strong> Half-day scramble up a tight limestone canyon — spectacular but involves some easy bouldering.</li>
  <li><strong>Okol Peak (2,112 m):</strong> Full-day summit hike with panoramic views across the Dinaric Alps into Montenegro.</li>
  <li><strong>Ndërlysaj Lakes:</strong> A moderate 5-hour return hike to glacial lakes above the treeline, rarely visited despite their beauty.</li>
</ul>

<h2>The Valbona Valley: Starting Point and Destination</h2>
<p>The <strong>Valbona Valley</strong> is the most visited valley in Albania's north — and deservedly so. The pale-blue Valbona River runs through a flat valley floor hemmed in by walls of white limestone rising 1,000 m on either side. In June, the meadows are carpeted with wildflowers; in October, the beech forests turn gold and crimson.</p>
<img src="https://images.unsplash.com/photo-1490682143684-14369e18dce8?w=1200&q=80" alt="Valbona Valley with traditional guesthouse and alpine backdrop" />
<p>Guesthouses line the valley and the hospitality is legendary. Expect generous dinners of tave kosi (baked lamb with yoghurt), fresh mountain cheese, homemade rakia, and excellent filter coffee made on a wood stove.</p>

<h2>The Razem Loop: Albania's Hidden Gem Trek</h2>
<p>Less known than the Valbona–Theth route, the <strong>Razem Loop</strong> is a 3-day circuit from Valbona that penetrates deeper into the Prokletije. The route passes the deserted village of Razem, climbs to a 2,300 m ridge with views into Kosovo, and descends through old-growth beech forest.</p>
<p>This is wild hiking — minimal waymarking, no guesthouses on day two (wild camping required), and navigation by map and compass or GPS. It is best done with a local guide.</p>
<p><strong>Distance:</strong> ~55 km | <strong>Days:</strong> 3 | <strong>Difficulty:</strong> Very Challenging</p>

<h2>Shkodër Lake and Surroundings</h2>
<p>For something gentler, the area around <strong>Shkodër</strong> — the main gateway city for northern Albania — offers excellent cycling and walking. The cycle path around Shkodër Lake (Skadar Lake), which straddles the Albanian-Montenegrin border, is flat, scenic, and accessible for all fitness levels. Flamingos, pelicans, and herons inhabit the lake's reed beds — one of Europe's largest wetlands.</p>

<h2>Getting to Northern Albania</h2>
<p>Fly into <strong>Tirana (TIA)</strong> with multiple European carriers. From Tirana:</p>
<ul>
  <li><strong>To Shkodër:</strong> 2 hours by bus (hourly from Tirana bus terminal)</li>
  <li><strong>To Valbona:</strong> From Shkodër, take the bus to Fierza (4 hrs) then the ferry across Lake Koman (a spectacular 2.5-hour boat journey through a dramatic gorge) to Valbona</li>
  <li><strong>To Theth:</strong> Furgon (shared minibus) from Shkodër daily in summer (3 hrs on a rough mountain road — unforgettable)</li>
</ul>

<h2>Practical Tips for Albania</h2>
<ul>
  <li><strong>Currency:</strong> Albanian lek (ALL). Guesthouses and markets prefer cash; Tirana has ATMs. Budget €30–50/day for guesthouse + meals in the mountains.</li>
  <li><strong>Language:</strong> Albanian (Shqip). Very few mountain hosts speak English — basic Albanian phrases and Google Translate go a long way.</li>
  <li><strong>Connectivity:</strong> SIM cards from One Albania or ALBtelecom available at Tirana airport. Signal in the valleys is intermittent; above the treeline, essentially none.</li>
  <li><strong>Safety:</strong> Albania is safe for hikers. The <em>Kanun</em> (traditional code of hospitality — <em>besa</em>) means you will never be turned away from a home. Wild camping is legal and generally tolerated.</li>
</ul>
`,
  },

  // ─── 4 ─────────────────────────────────────────────────────────────────────
  {
    slug: 'gjeravica-peak-hiking-guide-kosovo',
    title: "Gjeravica Peak: A Hiker's Guide to Kosovo's Highest Summit (2,656 m)",
    excerpt:
      'Gjeravica is the roof of Kosovo — a bold 2,656 m summit in the Prokletije range on the Albania border. Here is everything you need to plan and complete the ascent.',
    category: 'DESTINATION_GUIDE' as const,
    tags: ['Gjeravica', 'Kosovo', 'Prokletije', 'summit hiking', 'highest peak Kosovo', 'mountain guide'],
    featuredImageUrl:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80',
    readingTimeMinutes: 8,
    seoTitle: "Gjeravica Peak Hiking Guide — Kosovo's Highest Mountain (2,656 m)",
    seoDescription:
      "How to hike Gjeravica, Kosovo's highest peak at 2,656 m. Route details, trailhead, difficulty, best season and what to expect on the summit.",
    published: true,
    publishedAt: new Date('2025-05-08T08:00:00Z'),
    content: `
<h2>Why Climb Gjeravica?</h2>
<p><strong>Gjeravica</strong> (2,656 m) is Kosovo's highest point and one of the great non-technical summit climbs in the western Balkans. The peak sits on the border with Albania in the wild Prokletije range — the same mountains that form the backdrop of the Peaks of the Balkans trail. On a clear day from the top, you see deep into Albania, Montenegro, and across the entirety of Kosovo to the Šar Mountains on the opposite side of the country.</p>
<img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80" alt="Rocky Prokletije summit with Kosovo valleys below" />
<p>It is not a casual walk. The round trip involves roughly <strong>1,600 m of elevation gain</strong> and takes most hikers 8–10 hours. But the rewards — solitude, extraordinary views, the quiet pride of standing on the highest point in a country — are commensurate with the effort.</p>

<h2>The Route: Lumbardh to the Summit</h2>
<p>The most practical access is from the village of <strong>Lumbardh</strong>, approximately 20 km southwest of Peja. A rough track leads from Lumbardh to the mountain shepherd settlement of <strong>Babës/Štedim</strong> (reachable by 4WD in good conditions), reducing the total hiking distance.</p>
<p><strong>From Lumbardh village (trailhead):</strong></p>
<ol>
  <li><strong>Lumbardh → forest zone:</strong> The trail follows a jeep track through mixed beech forest, gaining altitude steadily. (~2 hrs)</li>
  <li><strong>Forest → alpine meadows:</strong> The trees thin and open into spectacular high meadows used by summer shepherds. The Gjeravica massif comes into full view. (~1 hr)</li>
  <li><strong>Meadows → upper ridge:</strong> The terrain steepens and becomes rocky. Several gullies lead toward the main ridge — follow the ridge north toward the summit. (~1.5 hrs)</li>
  <li><strong>Summit ridge → Gjeravica:</strong> The final section is a boulder scramble on the ridge crest. Non-technical but exposed — do not attempt in strong winds or wet conditions. (~45 min)</li>
</ol>
<img src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80" alt="Hiker approaching the summit of a Prokletije peak with Albania behind" />

<h2>Trailhead Logistics</h2>
<p><strong>Getting to Lumbardh:</strong> From Peja, take the Rugova Valley road west and turn south toward Lumbardh. The village is ~20 km from Peja on a paved road. By taxi from Peja: approximately €15–20. There is no public bus to Lumbardh.</p>
<p><strong>Parking:</strong> Small area by the village. For 4WD access to Babës: ask locally about current road conditions — the track is badly eroded in places and impassable after heavy rain.</p>
<p><strong>Start time:</strong> Leave no later than 06:30. The summit should be reached by midday to avoid afternoon thunderstorms which build rapidly in summer.</p>

<h2>Difficulty and Fitness Requirements</h2>
<p>Rate this as <strong>Challenging (4/5)</strong>. You need:</p>
<ul>
  <li>Good cardiovascular fitness — this is not a technical climb but it is a long, steep day</li>
  <li>Experience on rough mountain terrain and boulder scrambles</li>
  <li>Solid ankle support from boots — the upper ridge is unstable rock</li>
  <li>A head for heights on the exposed summit ridge</li>
</ul>
<p>This is <strong>not a hike for beginners</strong>. If you have not done a significant mountain day before, join a guided group or hire a local guide from Peja.</p>

<h2>Best Time to Climb</h2>
<p><strong>July to September</strong> is ideal. Snow typically clears from the upper ridge by mid-July. September offers the most stable weather — fewer afternoon storms, crystal visibility, and dramatically lower humidity than July and August.</p>
<p>Do not attempt the summit:</p>
<ul>
  <li>Before mid-June (snow on the ridge, unstable cornices)</li>
  <li>After early October (autumn snow, early darkness)</li>
  <li>If cloud is building on the summit before 10:00 (turn back)</li>
  <li>In wet conditions (the rock becomes treacherous when wet)</li>
</ul>

<h2>What to Carry</h2>
<ul>
  <li>2–3 litres of water minimum (no reliable sources above the meadows)</li>
  <li>High-calorie food for a full day — the ascent burns significant energy</li>
  <li>Waterproof jacket and warm layer (even in August, the summit can be below 5°C with wind)</li>
  <li>Trekking poles (invaluable on the steep descent)</li>
  <li>First aid kit and emergency whistle</li>
  <li>Offline map downloaded (Maps.me, Wikiloc, or Organic Maps)</li>
  <li>Fully charged phone and power bank</li>
  <li>Tell someone your planned route and expected return</li>
</ul>

<h2>On the Summit</h2>
<p>Gjeravica's summit cairn has a small register box — sign it if you find it. The Albanian border runs directly through the peak, though there is no formal crossing point. The views south into Albania's Tropoja district and the Valbona Valley are astonishing — you can see all the way to the Adriatic on an exceptionally clear day.</p>
<img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80" alt="Wide panoramic view from a Prokletije summit across Kosovo and Albania" />
<p>Allow 20–30 minutes on top. The descent is often more demanding than the ascent mentally — tired legs on steep rock require concentration.</p>

<h2>Guided Ascents of Gjeravica</h2>
<p>We offer Gjeravica as part of our <strong>Kosovo Highlights</strong> and <strong>Peaks of the Balkans</strong> itineraries. Our local mountain guides know the route in all conditions and carry full first aid and emergency equipment. Contact us to add a Gjeravica day to your Kosovo itinerary.</p>
`,
  },

  // ─── 5 ─────────────────────────────────────────────────────────────────────
  {
    slug: 'valbona-theth-trek-complete-guide',
    title: "The Valbona–Theth Trek: Albania's Most Iconic Mountain Crossing",
    excerpt:
      "Day-by-day guide to the Valbona–Theth traverse — Albania's most famous mountain hike. How to get there, where to stay, what to expect on the pass, and how to do it right.",
    category: 'DESTINATION_GUIDE' as const,
    tags: ['Valbona Theth', 'Albania trekking', 'Albanian Alps', 'Valbona Pass', 'Theth village', 'hiking Albania'],
    featuredImageUrl:
      'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=1200&q=80',
    readingTimeMinutes: 9,
    seoTitle: 'Valbona to Theth Hike: Complete Guide (Route, Tips, Accommodation)',
    seoDescription:
      'Everything you need to hike from Valbona to Theth in Albania. Route details, Valbona Pass elevation, transport, guesthouses, and day-by-day itinerary.',
    published: true,
    publishedAt: new Date('2025-05-15T08:00:00Z'),
    content: `
<h2>The Crossing That Defines Albanian Hiking</h2>
<p>Ask any hiker who has been to northern Albania what their highlight was, and nine times out of ten the answer is the same: <strong>Valbona to Theth</strong>. This single-day crossing over the <strong>Valbona Pass (2,170 m)</strong> connects two of Albania's most spectacular valleys and passes through a landscape of savage, magnificent mountain scenery.</p>
<img src="https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=1200&q=80" alt="The path through the Valbona Valley toward the high pass in Albania" />
<p>It is not an easy hike. The 21 km route involves 1,100 m of ascent, a boulder-strewn descent, and 7–9 hours of walking. But this is one of those trails where the effort feels earned rather than punishing — the landscape rewards every upward step.</p>

<h2>Route Overview</h2>
<p><strong>Start:</strong> Valbona village (900 m) | <strong>End:</strong> Theth village (745 m)<br />
<strong>Distance:</strong> 21 km | <strong>Total ascent:</strong> 1,100 m | <strong>Total descent:</strong> 1,350 m<br />
<strong>Duration:</strong> 7–9 hours | <strong>Difficulty:</strong> Challenging | <strong>Season:</strong> June–September</p>

<h2>The Stages in Detail</h2>
<h3>Valbona to the Pass (11 km, 4–5 hours)</h3>
<p>The trail leaves Valbona village on a well-worn path through poplar trees and over wooden footbridges across the pale-blue Valbona River. The valley floor is flat for the first 4 km — deceptively easy going. Then the climbing begins in earnest as the path turns south toward the headwall.</p>
<p>The upper section of the ascent is steep, crossing open scree and loose rock on the Albanian side of the pass. The final 200 m to the top are the most demanding: large boulders require hands-on scrambling in places. Take your time. The views opening up behind you over the Valbona Valley are extraordinary motivation.</p>
<img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80" alt="Looking back from the Valbona Pass toward the valley far below" />

<h3>The Pass (2,170 m): Take It In</h3>
<p>The top of the pass is a wide saddle with a simple stone shelter and a cross. On a clear day, Kosovo is visible to the north-east — the Prokletije peaks stretching toward Gjeravica. To the south, the forested descent toward Theth opens up below.</p>
<p>Spend 20–30 minutes here. Eat. Drink. Take photos. Check the weather — if clouds are building aggressively, descend promptly.</p>

<h3>The Pass to Theth (10 km, 3–4 hours)</h3>
<p>The descent on the Theth side is technically easier than the ascent but harder on the knees. The first section is steep scree, transitioning to pine and beech forest. Trekking poles are invaluable here.</p>
<p>Two hours below the pass, the trail emerges into the Theth valley — a wide, glacially-carved bowl ringed with limestone peaks. The village materialises gradually: stone farmhouses, guesthouses flying Albanian flags, the white 18th-century church, the ancient stone tower (<em>kulla</em>). Arriving here after a long mountain day is one of hiking's great pleasures.</p>

<h2>How to Get to Valbona</h2>
<p>The journey to Valbona from Shkodër (the main gateway city) is itself an adventure:</p>
<ol>
  <li><strong>Shkodër → Fierza:</strong> Bus or furgon (~4 hours on mountain roads, €5–8)</li>
  <li><strong>Fierza → Valbona ferry:</strong> The legendary <strong>Lake Koman ferry</strong> — a 2.5-hour boat journey through a dramatic flooded canyon, one of Albania's unmissable experiences (daily in summer, €5–7)</li>
  <li><strong>Valbona ferry dock → village:</strong> Furgon or guesthouse pickup (15 min)</li>
</ol>
<p><strong>Alternative:</strong> From Bajram Curri (accessible by bus from Shkodër), a direct furgon to Valbona takes about 1 hour and skips the ferry.</p>

<h2>Getting from Theth Back to Civilization</h2>
<p>Theth is connected to Shkodër by a daily furgon (departs Theth ~07:00, arriving Shkodër ~10:00; price ~€8). Book your seat the evening before through your guesthouse. The road is rough — 3 hours of switchbacks through spectacular scenery.</p>

<h2>Where to Stay</h2>
<p>Both Valbona and Theth have excellent guesthouse options (budget €20–40 per person for bed, dinner, and breakfast). Our favourites:</p>
<ul>
  <li><strong>Valbona:</strong> Guesthouse Selimaj (welcoming family, excellent food), Rilindja (slightly more modern)</li>
  <li><strong>Theth:</strong> Guesthouse Polia (great views, fantastic meals), Theth Lodge (newer, slightly more polished)</li>
</ul>
<p><strong>Tip:</strong> Book in advance for July and August — good guesthouses fill weeks ahead.</p>

<h2>Joining a Guided Group</h2>
<p>The Valbona–Theth crossing is manageable independently for confident mountain hikers. However, the area is remote, weather changes fast, and the ferry/furgon logistics can trip up first-timers. Joining a guided group from Peja or Shkodër includes:</p>
<ul>
  <li>All transport (including the Lake Koman ferry)</li>
  <li>Accommodation booked and confirmed at quality guesthouses</li>
  <li>A local guide who knows the route, the weather patterns, and the people</li>
  <li>Peace of mind in one of Europe's wilder mountains</li>
</ul>
<img src="https://images.unsplash.com/photo-1490682143684-14369e18dce8?w=1200&q=80" alt="Small group hiking through forest on the Albanian Alps trail" />
`,
  },

  // ─── 6 ─────────────────────────────────────────────────────────────────────
  {
    slug: 'montenegro-hiking-prokletije-guide',
    title: 'Montenegro Hiking Guide: Prokletije National Park and the Balkan Peaks',
    excerpt:
      "Montenegro's share of the Prokletije — including the Visitor Peak, Grebaje Valley, and Rosni Plato — is wilderness hiking at its finest. Here's how to explore it.",
    category: 'DESTINATION_GUIDE' as const,
    tags: ['Montenegro hiking', 'Prokletije', 'Visitor peak', 'Grebaje Valley', 'Plav', 'Gusinje'],
    featuredImageUrl:
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&q=80',
    readingTimeMinutes: 9,
    seoTitle: 'Montenegro Hiking: Prokletije National Park Complete Guide 2025',
    seoDescription:
      'Explore hiking in Prokletije National Park, Montenegro. Visitor Peak, Grebaje Valley, Volušnica, and the best trails near Plav and Gusinje. Difficulty, routes, and tips.',
    published: true,
    publishedAt: new Date('2025-05-22T08:00:00Z'),
    content: `
<h2>Montenegro's Hidden Hiking Frontier</h2>
<p>When most people think of Montenegro, they think of the Adriatic coastline — Kotor Bay, Budva, Sveti Stefan. But inland, hidden from the tourist brochures, <strong>Prokletije National Park</strong> contains some of the most dramatic mountain scenery in the entire western Balkans.</p>
<img src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&q=80" alt="Sunset alpenglow on Prokletije peaks in Montenegro near Plav" />
<p>Established as a national park in 2009, Prokletije covers 166 km² of the easternmost Albanian Alps — jagged limestone peaks above 2,600 m, glacial valleys, ice-cold mountain lakes, and the twin gateway towns of <strong>Plav</strong> and <strong>Gusinje</strong>. It is the least-visited corner of Montenegro and, for hikers willing to make the effort, one of its greatest rewards.</p>

<h2>Visitor Peak (2,211 m) and Volušnica</h2>
<p><strong>Visitor</strong> is the most iconic summit in the Montenegrin Prokletije and a compulsory goal for any serious hiker in the region. At 2,211 m, it offers panoramic views across three countries — Kosovo to the east, Albania to the south, and the Durmitor range to the north-west.</p>
<p><strong>Route from Grebaje Valley:</strong> The classic ascent starts from the floor of the Grebaje Valley, following a clear trail through spruce forest and into the alpine zone. The summit approach is a combination of grassy slopes and a short rocky scramble. Allow 5–6 hours return.</p>
<p><strong>Difficulty:</strong> Moderate–Challenging | <strong>Best time:</strong> June–October</p>
<img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80" alt="Looking toward Visitor Peak from the Grebaje Valley floor" />

<h2>Grebaje Valley: Base Camp for Prokletije</h2>
<p>The <strong>Grebaje Valley</strong> is the main staging area for Prokletije hiking. A 12 km drive from Gusinje on a rough track, it ends at a cluster of simple lodges and shepherd huts at around 1,200 m. From here, multiple trails fan out into the mountain:</p>
<ul>
  <li><strong>Rosni Plato:</strong> A 3-hour return walk to a high meadow plateau with exceptional views and often-present chamois</li>
  <li><strong>Visitor Peak circuit:</strong> The full day hike described above</li>
  <li><strong>Peaks of the Balkans Stage 7:</strong> The section of the main PoB trail that runs through Grebaje to the Kosovo border</li>
  <li><strong>Dobra Voda Lake:</strong> A short and rewarding walk to a glacial lake set in a dramatic cirque</li>
</ul>

<h2>Plav and Gusinje: The Gateway Towns</h2>
<p><strong>Plav</strong> (920 m) is the administrative centre for the region — a small town with basic services, a beautiful lake, and the starting point for the Peaks of the Balkans trail. <strong>Gusinje</strong>, 13 km further east and practically on the Albanian border, is even smaller but has a cluster of good guesthouses and is closer to the Grebaje Valley trailhead.</p>
<p>Both towns have a mixed Muslim-Christian heritage that makes them culturally distinct from coastal Montenegro — minarets and Orthodox churches share the same skylines, and the local cuisine reflects Albanian, Slavic, and Ottoman influences. The <em>mantije</em> (baked meat pastry) in Plav has a devoted local following.</p>

<h2>Ali Pasha's Springs (AliPašini Izvori)</h2>
<p>One of Montenegro's most striking natural phenomena is just 3 km from Gusinje. <strong>Ali Pasha's Springs</strong> are a series of ice-cold karst springs emerging from the base of a cliff face, flowing turquoise and crystal clear even in the height of summer. The temperature never exceeds 10°C regardless of season — fed from snowmelt deep within the limestone mountains.</p>
<p>The short walk (40 minutes return) is suitable for everyone and makes a perfect half-day addition to any Prokletije itinerary.</p>

<h2>The Peaks of the Balkans Through Montenegro</h2>
<p>Three stages of the Peaks of the Balkans trail pass through Montenegrin territory, covering the section between the Albanian border (at Vusanje) and the Kosovo border (near Čakor Pass). This is considered the most remote and challenging section of the full route — and some say the most beautiful.</p>
<img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80" alt="The Peaks of the Balkans trail descending through Montenegro to Plav lake" />
<p>The trail passes through the Grebaje Valley, over the Volušnica ridge, and skirts the edge of the Kosovo border before descending to Plav Lake. This section is best hiked with a guide — the trail is less well-waymarked than the Kosovo and Albanian sections, and the terrain is genuinely remote.</p>

<h2>Getting to Prokletije</h2>
<p>The most practical access is via <strong>Podgorica</strong> (Montenegro's capital, served by most European airlines). From Podgorica:</p>
<ul>
  <li>Bus to Plav: approximately 3.5–4 hours (one or two daily buses; check current schedules as they change seasonally)</li>
  <li>Taxi/transfer from Podgorica: approximately 2.5 hours (€80–120)</li>
</ul>
<p>Alternatively, access Prokletije from Kosovo: from Peja, the Čakor Pass road (partially unpaved) leads to Gusinje in approximately 2.5 hours. This road is only reliable June–October.</p>

<h2>When to Visit Montenegro's Prokletije</h2>
<p><strong>July to September</strong> is the primary hiking window. June is beautiful but the high trails may still have snow. October offers stunning autumn colours and near-solitude but some guesthouses close from mid-month.</p>
<p>Winter brings heavy snowfall — Prokletije is one of the snowiest regions in the Balkans — and is strictly for experienced alpine winter mountaineers only.</p>
`,
  },

  // ─── 7 ─────────────────────────────────────────────────────────────────────
  {
    slug: 'best-hiking-gear-balkan-mountains',
    title: 'Best Hiking Gear for the Balkan Mountains: What to Pack in 2025',
    excerpt:
      'The definitive packing list for multi-day hiking in Kosovo, Albania, and Montenegro. Boots, layers, navigation tools, and the essential items most hikers forget.',
    category: 'EQUIPMENT' as const,
    tags: ['hiking gear', 'packing list', 'Albania equipment', 'Kosovo hiking gear', 'Balkans trekking'],
    featuredImageUrl:
      'https://images.unsplash.com/photo-1446776709462-d6b525c57bd3?w=1200&q=80',
    readingTimeMinutes: 8,
    seoTitle: 'Hiking Gear for the Balkans: Complete Packing List 2025',
    seoDescription:
      'What to pack for hiking in Kosovo, Albania and Montenegro. Boots, clothing, navigation, safety gear — the complete packing list for Balkan mountain hiking.',
    published: true,
    publishedAt: new Date('2025-06-01T08:00:00Z'),
    content: `
<h2>Why Packing Right Matters in the Balkans</h2>
<p>The Prokletije mountains are genuine alpine terrain — not well-groomed Swiss walking paths. The weather changes fast: a blue-sky morning can become a thunderstorm by 14:00. The trails are rocky, the descents are steep, and the guesthouses, while warm and welcoming, do not have gear shops next door. What you carry from your hotel in Peja or Shkodër is what you have on the mountain.</p>
<img src="https://images.unsplash.com/photo-1446776709462-d6b525c57bd3?w=1200&q=80" alt="Hiking gear laid out on a wooden floor — boots, pack, layers, poles" />
<p>This list is built from years of guiding on the Peaks of the Balkans and in Kosovo and Albania. It covers everything from what goes on your feet to how to navigate without phone signal.</p>

<h2>Footwear: The Most Important Decision You Make</h2>
<p>Your boots will make or break your Balkan hiking trip. The terrain demands <strong>waterproof hiking boots with ankle support</strong>. This is not negotiable. Trail runners are fine for Kosovo day hikes on lower trails; for anything involving a mountain pass, significant elevation gain, or multi-day trekking, you need proper boots.</p>
<h3>What to look for:</h3>
<ul>
  <li><strong>GORE-TEX or equivalent waterproofing</strong> — stream crossings and wet meadows are inevitable</li>
  <li><strong>Ankle height</strong> — minimum mid-cut, ideally full high-cut for rocky terrain and pass crossings</li>
  <li><strong>Stiff soles</strong> — soft-soled boots are agony on scree and loose rock</li>
  <li><strong>Break them in</strong> — do not arrive with new boots. At least 50 km of walking in them before your first mountain day</li>
</ul>
<p><strong>Our recommendations:</strong> Salomon Quest 4 GORE-TEX, La Sportiva Trango Tech GTX, Scarpa Zodiac Plus GTX, Lowa Renegade GTX. Bring a pair of sandals or camp shoes for guesthouses and river crossings.</p>

<h2>Socks</h2>
<p>This sounds trivial. It is not. Merino wool hiking socks (Darn Tough, Smartwool, Icebreaker) are worth every penny. They cushion, regulate temperature, and manage moisture far better than synthetics. Bring four pairs minimum for a 10-day trip — wash and dry as you go.</p>

<h2>Clothing: The Layering System</h2>
<img src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80" alt="Hiker in layered mountain clothing on an exposed ridge" />
<h3>Base Layer</h3>
<p>Merino wool or technical synthetic. Avoid cotton — it holds sweat and chills rapidly. Two base layer tops (one short-sleeve, one long-sleeve) is the right amount.</p>
<h3>Mid-Layer</h3>
<p>A lightweight fleece or synthetic insulated jacket. Mountain temperatures drop to 5–10°C at altitude even in August; with wind, they drop further. Your mid-layer goes on at every stop.</p>
<h3>Shell / Rain Jacket</h3>
<p>Non-negotiable. A waterproof, breathable shell jacket (GORE-TEX or Pertex Shield equivalent). Full zip, hood that covers the helmet if needed, pit zips. Afternoon thunderstorms in July and August are a daily reality in the Prokletije — this is not optional.</p>
<h3>Trousers</h3>
<p>Convertible hiking trousers (zip-off legs) offer flexibility. One pair of full-length hiking trousers for cold/wet conditions; one pair of shorts. Avoid denim entirely.</p>
<h3>Warm Hat and Gloves</h3>
<p>Yes, even in summer. Temperatures on a 2,300 m pass in early morning with wind can be genuinely cold. A lightweight merino buff, thin beanie, and liner gloves weigh almost nothing and save the day.</p>

<h2>The Pack</h2>
<p>For multi-day hiking with accommodation at guesthouses (no camping): a <strong>35–45 litre daypack</strong> is sufficient. You do not need to carry a sleeping bag, cooking equipment, or tent.</p>
<p>For the Razem Loop or any wild-camping variant: <strong>55–70 litres</strong> with a sleeping bag, liner, and cooking equipment.</p>
<p><strong>Rain cover:</strong> Pack covers are not waterproof. Use a pack liner (dry bag inside the pack) for anything that must stay dry — sleeping bag, electronics, spare clothes.</p>

<h2>Navigation and Safety</h2>
<ul>
  <li><strong>Offline maps:</strong> Download Maps.me, Wikiloc, or Organic Maps with the Kosovo/Albania/Montenegro regions before you leave wifi. Phone signal is absent above ~1,200 m in most areas.</li>
  <li><strong>Portable battery:</strong> A 10,000–20,000 mAh power bank. Your phone is your map, camera, and emergency contact; keep it charged.</li>
  <li><strong>Headlamp with spare batteries:</strong> Early starts and late descents happen. Do not rely on your phone torch.</li>
  <li><strong>First aid kit:</strong> Blister plasters (a lot of them — Compeed brand is the best), ibuprofen, antihistamines, antiseptic wipes, bandage, emergency mylar blanket.</li>
  <li><strong>Trekking poles:</strong> Highly recommended. Invaluable on steep descents (knee protection), scree, and river crossings. Collapsible carbon poles pack small.</li>
  <li><strong>Whistle:</strong> A standard mountain safety item. Clip it to your pack strap.</li>
</ul>

<h2>Water</h2>
<p>Carry <strong>2–3 litres minimum</strong> on any mountain day in the Balkans. Mountain springs are generally clean and safe to drink directly; above the treeline where sheep graze, filter or purify. A Sawyer Squeeze or LifeStraw filter adds negligible weight and removes the guesswork.</p>

<h2>What to Leave Behind</h2>
<ul>
  <li>Cotton clothing of any kind</li>
  <li>Unnecessary electronics (camera, laptop — your phone is sufficient)</li>
  <li>More than two books (one e-reader weighs less than one paperback)</li>
  <li>Large bottles of toiletries — decant into 50 ml bottles</li>
  <li>Anything you have not used on a previous hiking trip</li>
</ul>

<h2>Cash</h2>
<p>Mountain guesthouses in Kosovo, Albania, and Montenegro are <strong>cash only</strong>. The euro is widely accepted and preferred across all three countries (Kosovo and Montenegro use it as official currency; Albania nominally uses lek but accepts euros in tourist areas). Bring enough cash for your full mountain section — ATMs do not exist in Valbona or Theth.</p>
<p><strong>Budget:</strong> ~€35–55 per person per day for dinner, bed, and breakfast at guesthouses, plus snacks and drinks.</p>
`,
  },

  // ─── 8 ─────────────────────────────────────────────────────────────────────
  {
    slug: 'best-time-to-hike-balkans-seasonal-guide',
    title: 'Best Time to Hike the Balkans: Month-by-Month Seasonal Guide',
    excerpt:
      'When should you visit Kosovo, Albania, and Montenegro for mountain hiking? A month-by-month breakdown of weather, trail conditions, crowds, and what to expect each season.',
    category: 'TRAVEL_TIPS' as const,
    tags: ['best time to hike', 'Balkans season', 'Kosovo weather', 'Albania hiking season', 'Montenegro mountains'],
    featuredImageUrl:
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80',
    readingTimeMinutes: 7,
    seoTitle: 'Best Time to Hike Kosovo, Albania & Montenegro (Seasonal Guide)',
    seoDescription:
      'When to visit the Balkans for hiking. Month-by-month weather, trail conditions, and crowd levels for Kosovo, Albania, and Montenegro. Plan your perfect trip.',
    published: true,
    publishedAt: new Date('2025-06-08T08:00:00Z'),
    content: `
<h2>Overview: The Balkan Mountain Calendar</h2>
<p>The Prokletije mountains — shared between Kosovo, Albania, and Montenegro — sit at latitudes similar to central Italy, but at elevations up to 2,656 m. The combination of Mediterranean moisture from the Adriatic and continental cold from the Pannonian plain creates a climate of extremes: heavy snowfall in winter, dramatic afternoon thunderstorms in summer, and extraordinarily colourful spring and autumn seasons.</p>
<img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80" alt="Sunset over Balkan mountain peaks with orange and pink sky reflections" />
<p>The hiking window is <strong>mid-June to late September</strong> for high passes and technical terrain. Lower trails and valley hikes are accessible from April to November.</p>

<h2>Month-by-Month Breakdown</h2>

<h3>April and May — Spring in the Valleys</h3>
<p>The lower valleys are awakening: wildflowers in the Rugova and Valbona valleys, swollen rivers from snowmelt, and brilliant green against limestone cliffs. Day temperatures in the valleys reach 15–20°C. The high passes, however, are still under significant snow — the Valbona Pass typically doesn't fully clear until mid-June, and Gjeravica holds snow into late June.</p>
<p><strong>Best for:</strong> Valley walks, cultural visits (Peja old town, Prizren, Shkodër), lower-elevation trails below 1,500 m. <em>Not</em> recommended for multi-day mountain crossings.</p>

<h3>June — The Sweet Spot (Early Season)</h3>
<p>June is arguably the most spectacular month in the Balkans. Snow retreats rapidly from the passes in the first two weeks, wildflowers erupt across the alpine meadows, and the light has an extraordinary clarity before the summer haze sets in. Rivers are still running high and cold — stream crossings require care.</p>
<img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80" alt="Wildflowers in an alpine meadow in the Albanian Alps in early summer" />
<p>Crowds are minimal compared to July and August. Guesthouses are open but not packed. The main risk: a late snow event in the first week of June can close high passes unexpectedly — always check with local guides before crossing passes in early June.</p>
<p><strong>Best for:</strong> Full Peaks of the Balkans trail, Valbona–Theth crossing (from mid-June), Rugova Valley, wildflower photography.</p>

<h3>July — Peak Season</h3>
<p>July is the busiest hiking month and for good reason: weather is most reliable (though afternoon thunderstorms are a near-daily occurrence), all passes are snow-free, and guesthouses operate at full capacity with the best staffing and food. Temperatures at altitude are comfortable (15–20°C on the passes); in the valleys, it can reach 30°C+ which makes the heat on ascents significant.</p>
<p><strong>Watch out for:</strong> Afternoon thunderstorms, which build rapidly after noon. Start all serious ascents before 07:00 and aim to be off exposed ridges by 13:00. These storms are not trivial — lightning on an exposed ridge at 2,300 m is life-threatening. Follow local guide advice.</p>
<p><strong>Best for:</strong> The full Peaks of the Balkans trail, Gjeravica summit, all high-alpine routes. Book guesthouses well in advance.</p>

<h3>August — Summer Continues</h3>
<p>Conditions broadly similar to July, with slightly higher temperatures in the valleys (can be uncomfortably hot in Shkodër and Peja). The second half of August often sees the thunderstorm pattern break — a window of more stable high-pressure weather that makes the last two weeks of August excellent for summit attempts.</p>
<p>Visitor numbers remain high in July and early August; drop noticeably from the third week of August onward.</p>
<p><strong>Best for:</strong> All mountain routes. If summit hiking is your goal, aim for mid-to-late August for more stable conditions.</p>

<h3>September — The Hiker's Favourite Month</h3>
<p>Ask experienced Balkan hikers when they prefer to visit and most will say <strong>September</strong>. The crowds have thinned, the weather is more stable, days are still long (sunset around 19:30 in early September), and the light has a golden quality that makes photography exceptional.</p>
<img src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&q=80" alt="Golden September light on Prokletije peaks above Plav lake" />
<p>Temperatures cool to ideal hiking range — 10–18°C at altitude, 20–25°C in the valleys. The first dusting of snow typically appears on the highest peaks in the last week of September — beautiful to look at, not a problem for the trails. Guesthouses are open and grateful for the continued business; you'll often have them to yourself.</p>
<p><strong>Best for:</strong> Everything. September is the ideal month for the Peaks of the Balkans, Gjeravica, Valbona–Theth, and all Prokletije routes.</p>

<h3>October — Autumn Colours, Closing Season</h3>
<p>October brings spectacular autumn colour — the beech forests of Rugova and Theth turn orange and gold — and genuinely solitary hiking. But the season is closing fast: snow can fall at any time above 1,800 m, most guesthouses along the Peaks of the Balkans trail close by mid-October, and the days shorten rapidly.</p>
<p>Lower valley trails and cultural visits remain excellent through October. High passes should be treated with alpine caution from mid-October onward.</p>
<p><strong>Best for:</strong> Valley hiking, photography, cultural visits. Not recommended for high-pass crossings after mid-October without winter mountaineering experience.</p>

<h3>November to March — Winter</h3>
<p>The Prokletije mountains receive the highest snowfall in the Balkans — up to several metres in the valleys, much more at altitude. This is serious winter mountaineering territory, not recreational hiking terrain. Unless you have full alpine winter experience and appropriate equipment (crampons, ice axe, avalanche kit), do not attempt mountain trails November–March.</p>
<p>The ski resort at Brezovica (Kosovo) typically operates December–March and offers a completely different winter experience.</p>

<h2>Summary Table</h2>
<ul>
  <li><strong>High-pass hiking (Valbona–Theth, Gjeravica, PoB):</strong> Mid-June to late September</li>
  <li><strong>Valley hiking and lower trails:</strong> April to November</li>
  <li><strong>Best weather + fewest crowds:</strong> September and late June</li>
  <li><strong>Peak season (busiest + most reliable):</strong> July and August</li>
  <li><strong>Autumn colours:</strong> October (valleys, not high passes)</li>
  <li><strong>Winter skiing:</strong> December–March (Brezovica)</li>
</ul>

<h2>Planning Your Trip</h2>
<p>Whatever month you choose, our guided departures run from June through September. We run small groups (maximum 10 hikers), work with the best local guides in the region, and adjust routes based on current conditions. View our <strong>upcoming departure dates</strong> to find the trip that fits your schedule.</p>
`,
  },
];

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  const db = drizzle(connection);

  // Grab the first admin user as the post author
  const [admin] = await db.select({ id: adminUsers.id }).from(adminUsers).limit(1);
  const authorId = admin?.id ?? null;

  console.log(`Using author ID: ${authorId ?? 'none (no admin user found)'}`);
  console.log(`Seeding ${posts.length} blog posts…\n`);

  for (const post of posts) {
    // Skip if slug already exists
    const [existing] = await db
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(eq(blogPosts.slug, post.slug))
      .limit(1);

    if (existing) {
      console.log(`⏭  Skipped (already exists): ${post.title}`);
      continue;
    }

    await db.insert(blogPosts).values({
      ...post,
      authorId,
      tags: post.tags,
      relatedTourIds: [],
    });
    console.log(`✓  Created: ${post.title}`);
  }

  console.log('\nDone.');
  await connection.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
