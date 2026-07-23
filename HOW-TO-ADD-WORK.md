# How to add a case study

Everything lives in **one file**: [`src/data/site.js`](src/data/site.js).
You don't need to touch any other code. Add an entry there and the site
automatically builds:

- a row on the home page (`/`)
- a card on the gallery page (`/gallery`)
- a full case-study page at `/work/<id>`

---

## 1. Add the project entry

Open `src/data/site.js`, find the `projects = [ ... ]` list, **copy one of the
existing blocks**, paste it as a new block, and edit the fields:

```js
{
  id: 'brand-x',                 // URL slug — lowercase-with-dashes, must be unique
  no: '10',                      // the number shown next to it
  title: 'Brand X',              // project name
  category: 'Brand Identity',    // label under the title
  cat: 'design',                 // filter tab: design | graphic | motion | photo
  type: 'Design · Motion',       // small sub-label
  year: '2026',
  accent: '#d8ff3e',             // hover tint / placeholder color (any hex)
  media: '/work/brand-x.jpg',    // big hero image (or null for a placeholder)
  client: 'Brand X Co.',
  role: 'Lead Designer',
  services: ['Identity', 'Motion', 'Guidelines'],
  description: [
    'First paragraph of the overview.',
    'Second paragraph (optional — add as many as you like).',
  ],
  gallery: [                     // case-study images (or [] for placeholders)
    '/work/brand-x-1.jpg',
    '/work/brand-x-2.jpg',
    '/work/brand-x-3.jpg',
  ],
},
```

**Order matters:** projects show in the order they appear in the list, so put
the most important ones near the top.

---

## 2. Add the images

1. Put image files in the **`public/`** folder (e.g. `public/work/brand-x.jpg`).
   You can make a `work` subfolder to stay tidy.
2. Reference them with a leading slash and **no** `public`:
   `public/work/brand-x.jpg`  →  `'/work/brand-x.jpg'`
3. `media` is the large hero image. `gallery` is the list of images further down
   the case study (the first one spans full width).

**Tips:** use JPG/WebP, roughly 1600px wide, under ~400 KB each for fast loading.
Leave `media: null` and `gallery: []` to keep the coloured placeholders.

---

## 3. Preview and publish

```bash
npm run dev      # preview locally at http://localhost:4321 (updates as you save)
npm run build    # build the final site into /dist to upload/deploy
```

While `npm run dev` is running, just save `site.js` and the browser updates.

---

## Optional: add a new category tab

Edit the `categories` list near the top of `site.js`:

```js
export const categories = [
  { key: 'design', label: 'Designing' },
  { key: 'illustration', label: 'Illustration' }, // new tab
  ...
];
```

Then set `cat: 'illustration'` on any project to file it under that tab.

---

## To remove or rename a case study

- **Remove:** delete its `{ ... }` block from the `projects` list.
- **Rename the URL:** change its `id` (the old `/work/<old-id>` link will stop working).
