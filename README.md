# What Suzie Made

Static rebuild of whatsuziemade.co.uk: [Eleventy](https://www.11ty.dev/) builds it, GitHub Pages hosts it, and Suzie edits it in [Pages CMS](https://pagescms.org/).

## Local development

```bash
npm install
npm run fetch-images   # one-off: copies the images from the old WordPress site into src/images
npm start              # http://localhost:8080
npm run build          # outputs to _site/
```

## Where things live

| What | File(s) | Edited in Pages CMS as |
|---|---|---|
| Artwork | `src/pieces/*.md` (front matter only) | **Artwork** |
| Categories | `src/categories/*.md` (file name = URL) | **Categories** |
| Homepage text | `src/_data/home.yml` | **Homepage** |
| About / Contact | `src/_data/about.yml`, `contact.yml` | **About page**, **Contact page** |
| Logo, banners, socials, email | `src/_data/settings.yml` | **Site settings** |
| Category page wording | `src/_data/categoryText.yml` | **Category page wording** |
| Uploaded images | `src/images/` → served at `/images/` | Media |
| Templates and CSS | `src/_includes/`, `src/assets/` | — (only you edit these) |
| Old WordPress URL redirects | `src/_data/redirects.yml` | — |

How the pieces fit together:

- A piece appears on its category's page. If **Show in "New in"** is ticked, it also appears on the homepage, where the newest N are shown (N is set on the Homepage screen).
- Pieces have no page of their own. They link to their Etsy listing, or to the main shop if there isn't one.
- A category with no pieces shows its example image and a "taking shape" message.
- Every `<img>` is resized to WebP and JPEG/PNG at build time, so Suzie can upload photos straight from her phone.
- If an image is missing, the build leaves the original URL in place instead of failing.

## One-time setup

1. **Repo.** Create a GitHub repo and push this folder to `main`. Commit `src/images/` after you've run `fetch-images`.
2. **Pages.** In the repo, go to Settings → Pages → Build and deployment, and set Source to **GitHub Actions**. Every push to `main` then builds and deploys.
3. **Domain.** `src/CNAME` is already set to `www.whatsuziemade.co.uk`. In Settings → Pages, add the custom domain and tick *Enforce HTTPS*. Then change the DNS:
   - `www`: a CNAME record pointing to `<your-user>.github.io`
   - apex: A records to GitHub Pages' IPs, or a redirect to `www` from your DNS provider
4. **Pages CMS.** Sign in at https://app.pagescms.org with GitHub and install the GitHub App on **this repo only**. The app picks up `.pages.yml` automatically.
5. **Suzie.** In Pages CMS, open the repo's Collaborators, invite Suzie's email address, and send her the link. She doesn't need a GitHub account.
6. **Retire WordPress.** Once DNS has switched over, turn off WordPress on the VPS.

After she saves a change, the site updates in about a minute, once the GitHub Action finishes.

## Before go-live

- [ ] Run `npm run fetch-images` and check `src/images/`. The old "New in" images are tiny (around 100px wide), so ask Suzie for originals.
- [ ] Rename the seven "New in 1–7" pieces. They have no titles or categories on the old site.
- [ ] Search Instagram, Etsy and Facebook bios for `?page_id=` links. The homepage redirects 87 → /about/, 43 → /contact/ and 81 → /links/, but it's nicer to link straight to the new pages.
- [ ] Newsletter: when it's ready, put the provider's signup URL in Homepage → Newsletter box → Button link, or add an embed to `src/index.njk`.

## Fallback if Pages CMS goes away

All the content is plain Markdown and YAML in this repo, and the site builds without Pages CMS.

- **Self-host Pages CMS** (MIT licence) on the VPS: Node, Postgres and a reverse proxy, following https://pagescms.org/docs/guides/installing/self-host/
- **Or switch to Sveltia CMS**: add `src/admin/index.html` plus a config that maps the same fields, and use a Cloudflare Worker for the GitHub login.
