// Simple WordPress-like mock API for local development
// Run with: node mock-api/server.js
const express = require("express");
const cors = require("cors");
const { faker } = require("@faker-js/faker");

const app = express();
app.use(cors());
app.use(express.json());

/** ---------- Config ---------- **/
const PORT = process.env.PORT || 4000;
const PAGE_SIZE_DEFAULT = 10;
const TOTAL_POSTS = 120; // generate this many fake posts
const CATEGORIES = [
  { id: 1, name: "Politics" },
  { id: 2, name: "Business" },
  { id: 3, name: "Technology" },
  { id: 4, name: "Health" },
  { id: 5, name: "Sports" },
  { id: 6, name: "World" },
];
const TAGS = [
  "analysis",
  "opinion",
  "breaking",
  "feature",
  "editorial",
  "exclusive",
].map((name, i) => ({ id: i + 1, name }));

// --- Remote config (toggleable special tab) ---
let REMOTE_CONFIG = {
  specialTab: {
    enabled: true,
    title: 'Murdaugh',
    path: 'murdaugh',
    icon: 'flame-outline', // Ionicons name
    color: '#e64a19'       // any CSS color
  }
};

app.get('/wp-json/fitsnews/v1/config', (_req, res) => res.json(REMOTE_CONFIG));


/** ---------- Helpers ---------- **/
 const countByAuthor = (authorId) =>
   POSTS.filter((p) => p.author === authorId).length;
 const countByCategory = (catId) =>
   POSTS.filter((p) => p.categories.includes(catId)).length;

const htmlWrap = (txt) => `<p>${txt}</p>`;
const pic = (seed, w = 1200, h = 675) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

/** ---------- Seed data ---------- **/
const AUTHORS = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  name: faker.person.fullName(),
  slug: faker.internet.userName().toLowerCase(),
}));

const POSTS = Array.from({ length: TOTAL_POSTS }).map((_, i) => {
  const id = i + 1;
  const title = i === 0 ? "laphona rules" : faker.lorem.sentence({ min: 5, max: 10 });
  const paragraphs = faker.lorem.paragraphs({ min: 4, max: 10 }, "\n\n");
  const excerpt = faker.lorem.sentences({ min: 1, max: 2 });
  const date = faker.date.recent({ days: 60 }); // within last 60 days
  const author = AUTHORS[faker.number.int({ min: 0, max: AUTHORS.length - 1 })];
  const cats = faker.helpers
    .arrayElements(CATEGORIES, { min: 1, max: 3 })
    .map((c) => c.id);
  const tags = faker.helpers
    .arrayElements(TAGS, { min: 0, max: 4 }) 
    .map((t) => t.id);

  return {
    id,
    date: date.toISOString(),
    slug: faker.lorem.slug(),
    status: "publish",
    type: "post",
    link: `https://fitsnews.example/posts/${id}`,
    title: { rendered: title },
    excerpt: { rendered: htmlWrap(excerpt) },
    content: {
      rendered: [
        `<p><img src="${pic(id, 1200, 675)}" alt="header image"/></p>`,
        ...paragraphs.split("\n\n").map((p) => `<p>${p}</p>`),
      ].join("\n"),
      protected: false,
    },
    author: author.id,
    featured_media: id, // reuse id as media id for convenience
    categories: cats,
    tags,
    _links: {
      author: [{ href: `/wp-json/wp/v2/users/${author.id}` }],
      "wp:featuredmedia": [{ href: `/wp-json/wp/v2/media/${id}` }],
      "wp:term": [
        { taxonomy: "category", href: "/wp-json/wp/v2/categories" },
        { taxonomy: "post_tag", href: "/wp-json/wp/v2/tags" },
      ],
    },
  };
});

/** ---------- WP-ish routes ---------- **/
// GET /wp-json/wp/v2/posts
app.get("/wp-json/wp/v2/posts", (req, res) => {
  const per_page = Math.max(
    1,
    Math.min(100, Number(req.query.per_page) || PAGE_SIZE_DEFAULT)
  );
  const page = Math.max(1, Number(req.query.page) || 1);
  const search = (req.query.search || "").toString().toLowerCase();
  const slug = (req.query.slug || "").toString().toLowerCase();
  const author = Number(req.query.author) || null;
  const categories = req.query.categories
    ? (req.query.categories + "").split(",").map((n) => Number(n))
    : null;
  const tags = req.query.tags
    ? (req.query.tags + "").split(",").map((n) => Number(n))
    : null;
  const wantEmbed = "_embed" in req.query;

 

  let list = POSTS.slice().sort((a, b) => b.date.localeCompare(a.date));

  if (search) {
    list = list.filter(
      (p) =>
        p.title.rendered.toLowerCase().includes(search) ||
        p.excerpt.rendered.toLowerCase().includes(search) ||
        p.content.rendered.toLowerCase().includes(search)
    );
  }
  if (slug) list = list.filter((p) => p.slug.toLowerCase() === slug);
  if (author) list = list.filter((p) => p.author === author);
  if (categories)
    list = list.filter((p) => p.categories.some((c) => categories.includes(c)));
  if (tags) list = list.filter((p) => p.tags.some((t) => tags.includes(t)));

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / per_page));
  const start = (page - 1) * per_page;
  const items = list.slice(start, start + per_page);

  // WordPress style pagination headers
  res.set("X-WP-Total", String(total));
  res.set("X-WP-TotalPages", String(totalPages));

  if (wantEmbed) {
    return res.json(
      items.map((p) => ({
        ...p,
        _embedded: {
          author: [AUTHORS.find((a) => a.id === p.author)],
          "wp:featuredmedia": [
            {
              id: p.featured_media,
              source_url: pic(p.featured_media),
              media_type: "image",
            },
          ],
          "wp:term": [
            CATEGORIES.filter((c) => p.categories.includes(c.id)).map((c) => ({
              id: c.id,
              name: c.name,
              taxonomy: "category",
            })),
            TAGS.filter((t) => p.tags.includes(t.id)).map((t) => ({
              id: t.id,
              name: t.name,
              taxonomy: "post_tag",
            })),
          ],
        },
      }))
    );
  }

  res.json(items);
});
// GET /wp-json/wp/v2/categories?search=&page=&per_page=
app.get('/wp-json/wp/v2/categories', (req, res) => {
  const per_page = Math.max(1, Math.min(100, Number(req.query.per_page) || 10));
  const page = Math.max(1, Number(req.query.page) || 1);
  const search = (req.query.search || '').toString().toLowerCase();

  let list = CATEGORIES.slice();
  if (search) {
    list = list.filter(c => c.name.toLowerCase().includes(search));
  }

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / per_page));
  const start = (page - 1) * per_page;

  const items = list.slice(start, start + per_page).map(c => ({
    ...c,
    count: countByCategory(c.id),
  }));

  res.set('X-WP-Total', String(total));
  res.set('X-WP-TotalPages', String(totalPages));
  res.json(items);
});


// GET /wp-json/wp/v2/posts/:id
app.get("/wp-json/wp/v2/posts/:id", (req, res) => {
  const post = POSTS.find((p) => p.id === Number(req.params.id));
  if (!post) return res.status(404).json({ message: "Not found" });
  if ("_embed" in req.query) {
    return res.json({
      ...post,
      _embedded: {
        author: [AUTHORS.find((a) => a.id === post.author)],
        "wp:featuredmedia": [
          {
            id: post.featured_media,
            source_url: pic(post.featured_media),
            media_type: "image",
          },
        ],
      },
    });
  }
  res.json(post);
});

// Minimal extra endpoints (handy if you want them)
app.get("/wp-json/wp/v2/users/:id", (req, res) => {
  const a = AUTHORS.find((x) => x.id === Number(req.params.id));
  if (!a) return res.status(404).json({ message: "Not found" });
  res.json(a);
});

// GET /wp-json/wp/v2/users?search=&page=&per_page=
app.get('/wp-json/wp/v2/users', (req, res) => {
  const per_page = Math.max(1, Math.min(100, Number(req.query.per_page) || 10));
  const page = Math.max(1, Number(req.query.page) || 1);
  const search = (req.query.search || '').toString().toLowerCase();

  let list = AUTHORS.slice();
  if (search) {
    list = list.filter(a =>
      (a.name || '').toLowerCase().includes(search) ||
      (a.slug || '').toLowerCase().includes(search)
    );
  }

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / per_page));
  const start = (page - 1) * per_page;
  const items = list.slice(start, start + per_page).map(a => ({
    ...a,
    count: countByAuthor(a.id),
  }));

  res.set('X-WP-Total', String(total));
  res.set('X-WP-TotalPages', String(totalPages));
  res.json(items);
});

app.get("/wp-json/wp/v2/categories", (req, res) => {
  const per_page = Math.max(1, Math.min(100, Number(req.query.per_page) || 10));
  const page = Math.max(1, Number(req.query.page) || 1);
  const search = (req.query.search || "").toString().toLowerCase();

  let list = CATEGORIES.slice();
  if (search) {
    list = list.filter((c) => c.name.toLowerCase().includes(search));
  }

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / per_page));
  const start = (page - 1) * per_page;

  const items = list.slice(start, start + per_page).map((c) => ({
    ...c,
    count: countByCategory(c.id),
  }));

  res.set("X-WP-Total", String(total));
  res.set("X-WP-TotalPages", String(totalPages));
  res.json(items);
});

app.get("/wp-json/wp/v2/tags", (_req, res) => res.json(TAGS));
app.get("/wp-json", (_req, res) =>
  res.json({ namespaces: ["wp/v2"], routes: Object.keys(app._router.stack) })
);

app.listen(PORT, () => {
  console.log(
    `Mock WP API running at http://localhost:${PORT}/wp-json/wp/v2/posts`
  );
});
