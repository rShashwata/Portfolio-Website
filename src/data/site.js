// ───────────────────────────────────────────────────────────────────────────
//  EDIT EVERYTHING HERE.
//  Single source of content for the whole site. Replace placeholder text,
//  projects, reel links and CV entries with the real ones — no need to touch
//  the components.
// ───────────────────────────────────────────────────────────────────────────

// Cloudflare R2 bucket (custom domain) for large videos and heavy documents.
// Small images stay in /public — they ship with the build and need no extra
// request hop. Referenced as `${R2}/…` below.
// If this host ever changes, change it here AND in the CSP in public/_headers
// (img-src, media-src and frame-src all name it exactly) — otherwise the
// browser blocks every asset from the new host and it fails silently.
export const R2 = 'https://media.shashwataroy.com';

export const profile = {
  name: 'SHASHWATA ROY',
  // These cycle in the hero rotator. Keep them short, one craft each.
  roles: ['Visual Designer', 'Illustrator', 'Video Editor', 'Motion Designer', 'Animator'],
  tagline:
    'Strategic, collaborative, relentlessly hands-on — I take ideas from brief to delivery and turn tight deadlines into standout outcomes.',
  location: 'Based in India — working worldwide',
  available: true, // toggles the "Available for work" pill
  email: 'rshashwata@hotmail.com',
  phone: '+91 8178021263',
  // B&W PNG cutout (transparent background) rendered as an interactive
  // halftone portrait in the hero. Place the file in /public at this path.
  photo: '/img/hero/portrait.png',
  // Used in the marquee strips. Add/remove freely.
  keywords: [
    'Graphic Design',
    'Illustration',
    'Motion Graphics',
    'Video Editing',
    'Brand Identity',
    'Art Direction',
    'Photography',
  ],
};

// ── Work categories (tabs). `key` matches each project's `cat`.
//    Order here = order of the tabs. "Design" leads because it's priority.
//    The "Recent" tab is added automatically by the Work component and shows
//    only the first 3 projects.
export const categories = [
  { key: 'design', label: 'Design' },
  { key: 'motion', label: 'Animation' },
  { key: 'graphic', label: 'Illustration' },
  { key: 'threed', label: '3D Visualisation' },
  { key: 'photo', label: 'Photography' },
];

// ── Projects = case studies. Each entry below AUTOMATICALLY creates:
//      • a row on the home page (/) and a card on the gallery (/gallery)
//      • a full case-study page at  /work/<id>
//    To add a case study, copy one block, paste it, and edit the fields:
//      `id`          → URL slug, lowercase-with-dashes (must be unique)
//      `no`          → the number shown next to it ('01', '02', …)
//      `title`       → project name
//      `category`    → label shown under the title (e.g. 'Brand Identity')
//      `cat`         → which filter tab it belongs to: see `categories` above
//      `type`        → small sub-label (e.g. 'Design · Motion')
//      `year`        → year string
//      `accent`      → hex colour used for the hover tint / placeholder
//      `media`       → big hero image. null = placeholder.
//      `thumb`       → OPTIONAL. The 4:3 tile that follows the cursor on the
//                      home-page work list. Omit it and that tile cover-crops
//                      `media`, which is fine for a hero whose subject sits in
//                      the middle. Set it when the subject doesn't survive the
//                      crop — a wide hero loses its outer thirds to a 4:3 box,
//                      and anything off-centre VERTICALLY can't be nudged back
//                      with object-position, because only the width is cropped.
//                      Export at 800×600 (the tile renders at most 320×240 CSS
//                      px, so that covers a 2x screen with room to spare).
//                      Keep project files in /public/img/work/<id>/ so each case
//                      study owns one folder, e.g. '/img/work/neon-pulse/hero.jpg'
//                      Same rule for any local (non-R2) document a case study
//                      embeds: /public/docs/<id>/, e.g.
//                      '/docs/uae-india-start-up-series/brand-guidelines.pdf'
//                      — mirrors the img/work/<id>/ folder, not a flat docs/.
//      `client`,`role` → shown in the case-study meta
//      `services`    → array of tags, e.g. ['Editing', 'Color']
//      `description` → array of paragraphs (the "Overview" text)
//      `gallery`     → array of case-study gallery items. Omit/[] = placeholders.
//                      Four item shapes are supported:
//
//                      1. IMAGE — a plain string. Local path or any https URL,
//                         so an R2 image needs no object wrapper:
//                           '/img/work/neon-pulse/01.jpg'
//                           `${R2}/work/neon-pulse/wide-shot.jpg`
//
//                      2. YOUTUBE
//                           { type: 'youtube', id: 'dQw4w9WgXcQ' }              → 16:9
//                           { type: 'youtube', id: '...', vertical: true }      → 9:16
//                         `id` is the bit after ?v= in the watch URL (or the
//                         last path segment of a /shorts/ URL). `vertical: true`
//                         for Shorts/Reels, so the player gets a 9:16 box
//                         instead of being pillarboxed into 16:9.
//
//                      3. VIDEO — self-hosted .mp4 (R2). `poster` is optional
//                         but worth setting on big files: without it the browser
//                         shows an empty black box until metadata arrives.
//                           { type: 'video', src: `${R2}/work/reel.mp4`,
//                             poster: '/img/work/neon-pulse/reel-poster.jpg' }
//                           { type: 'video', src: `${R2}/work/short.mp4`,
//                             vertical: true }
//
//                      4. DOC — a link tile for any document. Opens in a new
//                         tab. `label`, `meta` and `cover` are all optional;
//                         the badge (PDF, DOCX…) comes from the file extension.
//                           { type: 'doc',
//                             src: `${R2}/uae-india-aviation-report.pdf`,
//                             label: 'UAE-India Monthly Aviation Report',
//                             meta: 'PDF · 11 pages · 8.7 MB',
//                             cover: '/img/work/monolith/…-cover.jpg' }
//                         `cover` is an ordinary IMAGE of the first page —
//                         browsers can't rasterise a PDF, so export page 1 as
//                         a JPG (~1200px wide) and drop it in /public. With a
//                         cover the tile takes A4 proportions; without one it
//                         falls back to a plain accent card.
//                         Works with ANY url, including other people's sites —
//                         a link is a navigation, not a page resource, so the
//                         CSP allowlist doesn't apply to it at all:
//                           { type: 'doc', src: 'https://someone-else.com/x.pdf',
//                             label: 'Featured in …' }
//
//                      5. PDF — embedded inline (an iframe, reads in-page).
//                           { type: 'pdf', src: '/cv/shashwata-resume-2026.pdf' }
//                         Use for LOCAL /public files. R2-hosted PDFs will not
//                         embed while the media domain returns
//                         `X-Frame-Options: SAMEORIGIN` (a Cloudflare zone-level
//                         security-headers transform). That header comes from
//                         the file's own host, so no CSP change here overrides
//                         it — it must be lifted for that hostname in
//                         Cloudflare. Prefer `doc` for anything big: iOS Safari
//                         refuses to render framed PDFs regardless, and an
//                         embed downloads the whole file on page load.
//
//                      Layout: the first item spans full width. Any 16:9 player
//                      (YouTube or video) takes its own full-width row; vertical
//                      ones sit in a single column at a capped height; PDFs get a
//                      full-width, height-capped frame.
//
//    HEADS UP: the CSP in public/_headers allows remote assets from an explicit
//    list of hosts only — currently the R2 bucket, startupseries.ae (images) and
//    youtube-nocookie.com (embeds). Pointing any item at a NEW host means adding
//    it to the matching directive there (img-src / media-src / frame-src) or the
//    browser blocks it. Local files under /public always work.
//    Filenames in /public must be lowercase-with-dashes + ASCII.
export const projects = [
  // ── DESIGNING (priority) ────────────────────────────────────────────────
  {
    id: 'uae-india-start-up-series',
    no: '01',
    title: 'UAE-India Start-up Series',
    category: 'Brand Identity',
    cat: 'design',
    type: 'Design · Motion',
    year: '2025',
    accent: '#8c00ff',
    media: '/img/work/uae-india-start-up-series/uiss-1-0-hero-bg.webp',
    thumb: '/img/work/uae-india-start-up-series/uiss-1-0-thumb.webp',
    client: 'UAE Embassy in India - CEPA Council',
    role: 'Lead Designer',
    services: ['Brand Identity', 'Logo System', 'Guidelines', 'Motion'],
    description: [
      'A complete identity for a boutique architecture studio — built around a flexible monogram and a warm, editorial type system.',
      'The system stretches from business cards to large-format signage and an animated logo reveal used across their launch film.',
    ],
    // Example: drop image files in /public/img/work/<id>/ and list them here.
    // First item spans full width. Remove or leave empty for placeholder tiles.
    // A YouTube embed can go anywhere in this list:
    //   { type: 'youtube', id: 'dQw4w9WgXcQ' },                 // 16:9
    //   { type: 'youtube', id: 'dQw4w9WgXcQ', vertical: true }, // 9:16 Short
    gallery: [
      '/img/work/uae-india-start-up-series/uicc-start-up-series-pitch-event-37.jpg',
      '/img/work/uae-india-start-up-series/uicc-start-up-series-pitch-event-9.jpg',
      'https://startupseries.ae/wp-content/uploads/2019/07/Web-Banner-4.png',
      '/img/work/uae-india-start-up-series/mou-uae-india-business-council-2-1.jpg',
    ],
  },
  {
    id: 'monolith',
    no: '02',
    title: 'Monolith',
    category: 'Visual System',
    cat: 'design',
    type: 'Art Direction',
    year: '2023',
    accent: '#3ad8c8',
    media: null,
    client: 'Monolith Records',
    role: 'Art Director',
    services: ['Visual System', 'Cover Art', 'Layout'],
    description: [
      'A modular visual language for an independent record label, designed to flex across dozens of releases while staying unmistakably theirs.',
      'Bold grids, heavy type and a restrained palette let the music — and the artwork — do the talking.',
    ],
    // DEMO CONTENT — replace when this case study is written up.
    gallery: [
      {
        type: 'doc',
        src: `${R2}/UAE-India%20Monthly%20Aviation%20Report.pdf`,
        label: 'UAE-India Market Intelligence Report',
        meta: 'PDF · 11 pages · 8.8 MB',
        cover: '/img/work/monolith/uae-india-monthly-aviation-report-cover.jpg',
      },
    ],
  },
  {
    id: 'form-and-function',
    no: '03',
    title: 'Form & Function',
    category: 'Editorial Design',
    cat: 'design',
    type: 'Print · Layout',
    year: '2024',
    accent: '#ff9f1c',
    media: null,
    client: 'F&F Quarterly',
    role: 'Designer',
    services: ['Editorial', 'Typography', 'Print Production'],
    description: [
      'A quarterly design journal with a confident editorial grid and expressive cover typography.',
      'Each issue plays with the grid differently, so the magazine feels alive without losing its backbone.',
    ],
  },

  // ── GRAPHIC ───────────────────────────────────────────────────────────────
  {
    id: 'echo-chamber',
    no: '04',
    title: 'Echo Chamber',
    category: 'Poster Series',
    cat: 'graphic',
    type: 'Graphic · Print',
    year: '2023',
    accent: '#c89bff',
    media: null,
    client: 'Echo Festival',
    role: 'Graphic Designer',
    services: ['Poster Design', 'Typography', 'Print'],
    description: [
      'A series of gig posters exploring repetition, distortion and noise as visual texture.',
      'Risograph printing gave each poster a tactile, imperfect finish that suited the music.',
    ],
  },
  {
    id: 'riso-dreams',
    no: '05',
    title: 'Riso Dreams',
    category: 'Print Collateral',
    cat: 'graphic',
    type: 'Graphic Design',
    year: '2022',
    accent: '#ff6ec7',
    media: null,
    client: 'Self-initiated',
    role: 'Designer',
    services: ['Illustration', 'Print', 'Layout'],
    description: [
      'A self-initiated risograph zine experimenting with overprint colour and bold geometric illustration.',
      'A playground for ideas that later fed into client work.',
    ],
  },

  // ── MOTION GRAPHICS ─────────────────────────────────────────────────────────
  {
    id: 'neon-pulse',
    no: '06',
    title: 'Neon Pulse',
    category: 'Music Video',
    cat: 'motion',
    type: 'Edit · Grade',
    year: '2025',
    accent: '#5e8bff',
    media: null,
    client: 'Pulse Collective',
    role: 'Editor & Colorist',
    services: ['Editing', 'Motion Graphics', 'Color Grading'],
    description: [
      'A high-energy music video cut to the beat, layered with kinetic typography and reactive motion graphics.',
      'Graded for a neon-soaked, late-night feel that matched the track.',
    ],
  },
  {
    id: 'bloom-festival',
    no: '07',
    title: 'Bloom Festival',
    category: 'Title Sequence',
    cat: 'motion',
    type: 'Motion Design',
    year: '2024',
    accent: '#ff5e3a',
    media: null,
    client: 'Bloom Festival',
    role: 'Motion Designer',
    services: ['Title Sequence', 'Animation', '3D'],
    description: [
      'An opening title sequence for a music & arts festival, blending 3D type with organic, blooming transitions.',
      'Designed to scale from cinema screens down to social cut-downs.',
    ],
  },

  // ── 3D VISUALISATION ───────────────────────────────────────────────────────
  {
    id: 'glasshouse',
    no: '08',
    title: 'Glasshouse',
    category: 'Product Render',
    cat: 'threed',
    type: '3D · Render',
    year: '2025',
    accent: '#38bdf8',
    media: null,
    client: 'Glasshouse Studio',
    role: '3D Visualiser',
    services: ['3D Modelling', 'Lighting', 'Render'],
    description: [
      'Photoreal product renders for a furniture launch, built from CAD data and lit to match the brand\'s studio photography.',
      'Every angle was rendered in-house, cutting the need for a physical photo shoot entirely.',
    ],
  },

  // ── PHOTOGRAPHS ───────────────────────────────────────────────────────────
  {
    id: 'after-hours',
    no: '09',
    title: 'After Hours',
    category: 'Photo Series',
    cat: 'photo',
    type: 'Photography',
    year: '2024',
    accent: '#7c5cff',
    media: null,
    client: 'Personal',
    role: 'Photographer',
    services: ['Photography', 'Color Grading'],
    description: [
      'A nocturnal photo series chasing neon, reflections and empty city streets after midnight.',
      'Shot handheld, graded for mood over realism.',
    ],
  },
  {
    id: 'concrete',
    no: '10',
    title: 'Concrete',
    category: 'Architecture',
    cat: 'photo',
    type: 'Photography',
    year: '2023',
    accent: '#9aa0a6',
    media: null,
    client: 'Personal',
    role: 'Photographer',
    services: ['Photography', 'Composition'],
    description: [
      'A study of brutalist architecture — light, shadow and raw concrete reduced to graphic form.',
      'High-contrast black and white emphasising structure over surface.',
    ],
  },
];

export const about = {
  // Big statement, split across spans for the scroll reveal.
  statement:
    "Across diplomatic stages, corporate boardrooms and ed-tech classrooms, I've spent 5+ years turning complex objectives into visual stories that land. I take full ownership, brief to delivery, and believe the best work should always move the needle.",
  // Small stats strip.
  stats: [
    { value: '5+', label: 'Years of experience' },
    { value: '4', label: 'Companies partnered with' },
    { value: '1M+', label: 'Views on Insta reels' },
  ],
};

export const cv = {
  // Where the "View CV" button links to. Points at the downloadable PDF
  // résumé in /public — it opens in a new tab, so PDF-capable browsers
  // preview it and the rest download it. (The HTML resume page at
  // src/pages/resume.astro, built from `resume` below, is no longer linked
  // from this button but still exists at /resume.)
  resumeUrl: '/cv/shashwata-resume-2026.pdf',
  experience: [
    {
      role: 'Senior Design Consultant',
      // This role spans two orgs; each segment links separately (from the PDF).
      // Segments render joined by " | "; drop `url` on a part to leave it plain.
      orgParts: [
        { text: 'IndAus Advisors LLP', url: 'https://indausadvisory.com/' },
        { text: 'UAE Embassy in India - CEPA Council', url: 'https://cepacouncil.com/' },
      ],
      period: '2024 — 2026',
      note: 'Brand identity, event collateral and publication design for the UAE-India CEPA Council.',
    },
    {
      role: 'Graphic Designer',
      org: 'ARK Infosolutions Pvt. Ltd. - ICT360 Division',
      url: 'https://www.arkinfo.in/',
      period: '2023 — 2024',
      note: 'Ed-tech creatives and 3D architectural visualizations for the iLab product line.',
    },
    {
      role: 'Graphic Designer',
      org: 'Timeus Interactive Services Pvt. Ltd.',
      url: 'https://timeus.in/',
      period: '2022',
      note: 'Illustration, comic strips and 2D animation for enterprise clients like Dell and HCL.',
    },
    {
      role: 'Freelance Illustrator & Animator',
      org: 'Oasis Films & New Media',
      url: 'https://ofnm.in/',
      period: '2020 — 2021',
      note: '2D animation and illustration for Government of India public sector campaigns.',
    },
  ],
  education: [
    { title: 'Master of Fine Arts', org: 'College of Art, Delhi University', url: 'https://colart.delhi.gov.in/', period: '2022' },
    { title: 'Bachelor of Fine Arts', org: 'College of Art, Delhi University', url: 'https://colart.delhi.gov.in/', period: '2020' },
  ],
  tools: [
    'Photoshop',
    'Illustrator',
    'Premiere Pro',
    'After Effects',
    'Figma',
    'Claude Code',
    'Word',
    'PowerPoint'
  ],
  services: [
    'Graphic Design',
    'Illustration',
    'Animation',
    'UX Design',
    'Video Editing',
    'Motion Graphics',
    'Storyboarding',
    'Research',
  ],
};

// ── Full resume — HTML rendition of the source PDF, shown at /resume.
//    (`cv` above stays as the short, homepage-friendly summary.)
export const resume = {
  greeting: "Hey there, I'm",
  name: 'Shashwata Roy',
  roles: 'Visual Designer | Illustrator | Animator',
  summary:
    "A strategic, multi-disciplinary and Visual Communicator with 5+ years of professional experience delivering premium visual solutions across diplomatic, corporate, and ed-tech sectors. Anchored by a strong academic foundation with both a Bachelor's and Master's from the College of Art, Delhi University, I seamlessly blend advanced expertise in graphic design, 2D animation, illustration, and 3D spatial visualization to translate complex organizational objectives into compelling visual narratives. A highly collaborative, cross-functional partner recognized for taking absolute end-to-end design ownership, navigating tight deadlines with agility, and consistently delivering high-impact outcomes that elevate brand presence and exceed strategic goals.",
  expertise: [
    'Graphic Design',
    'Illustration',
    'Storyboarding',
    'Animation',
    'Motion Graphic',
    'Video Editing',
    'Content Writing',
    'Research',
  ],
  tools: ['Photoshop', 'Illustrator', 'Figma', 'Premiere Pro', 'After Effects', 'Claude Code', 'MS Office'],
  awards: [{ title: 'Academic Excellence', org: 'College of Art', note: 'Secured 2nd Prize' }],
  education: [
    { title: 'Master of Fine Arts', org: 'College of Art, Delhi University', period: '2022' },
    { title: 'Bachelor of Fine Arts', org: 'College of Art, Delhi University', period: '2020' },
  ],
  experience: [
    {
      role: 'Senior Graphic Designer',
      subtitle: 'CEPA Council (UAE Embassy)',
      org: 'IndAus Advisors LLP',
      location: 'New Delhi',
      period: '2024 — 2026',
      bullets: [
        {
          label: 'Brand Identity',
          text: 'Designed the comprehensive visual identity for the high-profile UAE-India Start-Up Series to align with key institutional objectives.',
        },
        {
          label: 'Event Collaterals',
          text: 'Spearheaded end-to-end design and production of visual assets for high-level summits nationwide under the CEPA Council ecosystem.',
        },
        {
          label: 'Publication Design',
          text: 'Transformed lengthy, complex policy documents and data-heavy reports into visually structured, engaging publications.',
        },
        {
          label: 'Digital Media Impact',
          text: "Produced high-performing video content and viral Instagram Reels that garnered millions of views, exponentially growing the CEPA Council's digital footprint.",
        },
        {
          label: 'Strategic Assets',
          text: 'Delivered high-impact presentation decks and creative assets under strict, fast-paced timelines through seamless cross-functional teamwork.',
        },
      ],
    },
    {
      role: 'Graphic Designer',
      subtitle: 'ICT360 Division',
      org: 'ARK Infosolutions Pvt. Ltd.',
      location: 'Noida',
      period: '2023 — 2024',
      note: "Executed high-quality social media creatives, corporate newsletters, and educational assets for the B2B Ed-Tech division. Played a pivotal role as a 3D Visualizer, developing sophisticated architectural visualizations for the company's proprietary iLab models, directly accelerating the onboarding of new partner schools.",
    },
    {
      role: 'Graphic Designer',
      org: 'Timeus Interactive Services Pvt. Ltd.',
      location: 'New Delhi',
      period: '2022',
      note: 'Developed high-fidelity illustrations, narrative comic strips, social media assets, and 2D animations for elite enterprise tech clients including Dell, HCL, and Genpact. Thrived in a fast-paced agency environment, demonstrating agility and strong multitasking capabilities to consistently deliver premium creative work under tight deadlines.',
    },
    {
      role: 'Freelance Illustrator & Animator',
      org: 'Oasis Films & New Media',
      location: 'New Delhi',
      period: '2020 — 2021',
      note: 'Collaborated on public sector consulting projects to visually communicate and promote the strategic initiatives and public services of the Government of India. Spearheaded the production of targeted 2D animation projects and designed custom digital illustrations tailored for diverse government communication channels.',
    },
  ],
  contact: {
    portfolio: { label: 'www.shashwataroy.com', href: '/' },
    linkedin: { label: 'linkedin.com/in/roy-shashwata', href: 'https://www.linkedin.com/in/roy-shashwata' },
    email: 'rshashwata@hotmail.com',
    phone: '+91 8178021263',
    location: 'Greater Noida',
  },
};

export const socials = [
  { label: 'Behance', href: 'https://www.behance.net/rshashwata' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/roy-shashwata/' },
];
