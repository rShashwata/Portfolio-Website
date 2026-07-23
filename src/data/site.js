// ───────────────────────────────────────────────────────────────────────────
//  EDIT EVERYTHING HERE.
//  Single source of content for the whole site. Replace placeholder text,
//  projects, reel links and CV entries with the real ones — no need to touch
//  the components.
// ───────────────────────────────────────────────────────────────────────────

export const profile = {
  name: 'SHASHWATA ROY',
  // Positioning line (eyebrow + used in the <title>).
  title: 'Senior Design Consultant',
  // These cycle in the hero rotator. Keep them short, one craft each.
  roles: ['Visual Designer', 'Illustrator', 'Video Editor', 'Motion Designer', 'Animator', 'Photographer'],
  tagline:
    'Strategic, collaborative, relentlessly hands-on — I take ideas from brief to delivery and turn tight deadlines into standout outcomes.',
  location: 'Based in India — working worldwide',
  available: true, // toggles the "Available for work" pill
  email: 'rshashwata@hotmail.com',
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
//      `media`       → big hero image, e.g. '/work/neon.jpg' (put files in /public). null = placeholder
//      `client`,`role` → shown in the case-study meta
//      `services`    → array of tags, e.g. ['Editing', 'Color']
//      `description` → array of paragraphs (the "Overview" text)
//      `gallery`     → array of image paths for the case-study gallery,
//                      e.g. ['/work/neon-1.jpg', '/work/neon-2.jpg']. Omit/[] = placeholders.
export const projects = [
  // ── DESIGNING (priority) ────────────────────────────────────────────────
  {
    id: 'uae-india-start-up-series',
    no: '01',
    title: 'UAE India Start-up Series',
    category: 'Brand Identity',
    cat: 'design',
    type: 'Design · Motion',
    year: '2025',
    accent: '#8c00ff',
    media: '/img/case-studies/Banner-Top-5-scaled.webp',
    client: 'Envoy Strategy',
    role: 'Lead Designer',
    services: ['Brand Identity', 'Logo System', 'Guidelines', 'Motion'],
    description: [
      'A complete identity for a boutique architecture studio — built around a flexible monogram and a warm, editorial type system.',
      'The system stretches from business cards to large-format signage and an animated logo reveal used across their launch film.',
    ],
    // Example: drop image files in /public and list them here. First image
    // spans full width. Remove or leave empty to keep placeholder tiles.
    gallery: ['/img/case-studies/UICC-Start-up-Series-Pitch-Event-37.jpg',
      '/img/case-studies/UICC-Start-up-Series-Pitch-Event-9.jpg',
      'https://startupseries.ae/wp-content/uploads/2019/07/Web-Banner-4.png',
      '/img/case-studies/MoU-UAE-India-Business-Council-2-1.jpg'
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
    { value: '2', label: 'Fine Arts degrees' },
    { value: '1M+', label: 'Views on CEPA Council reels' },
  ],
};

export const cv = {
  // Where the "Download CV" / "View CV" button links to. Points at the
  // full HTML resume page (src/pages/resume.astro) — see `resume` below
  // for that page's content.
  resumeUrl: '/resume',
  experience: [
    {
      role: 'Senior Design Consultant',
      org: 'IndAus Advisors LLP | CEPA Council - UAE Embassy in India',
      period: '2024 — 2026',
      note: 'Brand identity, event collateral and publication design for the UAE-India CEPA Council.',
    },
    {
      role: 'Graphic Designer',
      org: 'ARK Infosolutions Pvt. Ltd. - ICT360 Division',
      period: '2023 — 2024',
      note: 'Ed-tech creatives and 3D architectural visualizations for the iLab product line.',
    },
    {
      role: 'Graphic Designer',
      org: 'Timeus Interactive Services Pvt. Ltd.',
      period: '2022',
      note: 'Illustration, comic strips and 2D animation for enterprise clients like Dell and HCL.',
    },
    {
      role: 'Freelance Illustrator & Animator',
      org: 'Oasis Films & New Media',
      period: '2020 — 2021',
      note: '2D animation and illustration for Government of India public sector campaigns.',
    },
  ],
  education: [
    { title: 'Master of Fine Arts', org: 'College of Art, Delhi University', period: '2022' },
    { title: 'Bachelor of Fine Arts', org: 'College of Art, Delhi University', period: '2020' },
  ],
  software: [
    'Photoshop',
    'Illustrator',
    'Premiere Pro',
    'After Effects',
    'Figma',
    'Claude Code',
    'MS Office Suite',
  ],
  services: [
    'Graphic Design',
    'Illustration',
    'Storyboarding',
    'Animation',
    'Motion Graphics',
    'Video Editing',
    'Content Writing',
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
    phone: '+91 85272 09805',
    location: 'Greater Noida',
  },
};

export const socials = [
  { label: 'Instagram', href: 'https://instagram.com/' },
  { label: 'Behance', href: 'https://behance.net/' },
  { label: 'Vimeo', href: 'https://vimeo.com/' },
  { label: 'LinkedIn', href: 'https://linkedin.com/' },
];
