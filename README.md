# My portfolio site

My professional portfolio site, built as a plain static site (HTML/CSS/JS, no build step) so it runs directly on GitHub Pages.

This README is for **me**. It explains how to update the content **entirely through the GitHub website**, without needing a code editor, git, or any help from Claude.

The site's live files all live inside the `docs/` folder of this repository — that's the folder GitHub Pages is configured to publish from. Every path below starts with `docs/` for that reason.

## First-time setup (once)

1. Create a new repository on github.com and upload this whole folder (or push it with git).
2. In the repo, go to **Settings → Pages**.
3. Under "Build and deployment", set **Source** to *Deploy from a branch*, pick your default branch (usually `main`), and set the folder to **/docs**. Save.
4. Wait ~1 minute; GitHub gives you the live URL at the top of that same Pages settings screen.

## How this site is put together

- `docs/index.html` — the **Experience** page (this is the homepage)
- `docs/built.html` — the **Things I've Built** page
- `docs/contact.html` — the **Contact Me** page
- `docs/experience-detail.html` / `docs/built-detail.html` — the "Read More Details" page template; one page handles every entry
- `docs/data/experience.json` — the content for every Experience card
- `docs/data/built.json` — the content for every "Things I've Built" card
- `docs/data/contact.json` — your email, LinkedIn, resume link, etc.
- `docs/images/experience/` — photos for your experience detail pages
- `docs/images/built/` — photos for your project cards and detail pages
- `docs/assets/css/style.css` — colors, fonts, layout (only touch this if you want to change the design)
- `docs/assets/js/site.js` — the code that reads the JSON files and builds the cards (only touch this if you want to change how things behave)

**The important part: to update your experience, projects, or contact info, you only ever need to edit the files inside the `docs/data/` folder.** Everything else can stay as-is.

## Editing content on GitHub.com (no git, no code editor needed)

1. Go to your repository on github.com and open the `docs` folder, then the `data` folder inside it.
2. Click the file you want to change (`experience.json`, `built.json`, or `contact.json`).
3. Click the pencil icon (✏️) in the top-right of the file view — this opens GitHub's built-in editor.
4. Make your changes (see the examples below).
5. Scroll down, add a short commit message like "Update dates," and click **Commit changes...** → **Commit directly to the `main` branch**.
6. Wait 30–60 seconds. GitHub Pages automatically rebuilds your site — refresh your live site and the change will be there. You can watch the progress under the repo's **Actions** tab if you want to confirm it deployed.

That's it — no installs, no terminal, no pull requests required.

## JSON basics

These `.json` files are just lists of `{ }` blocks. A few rules that matter:

- Every piece of text goes in double quotes: `"like this"`.
- Every field is followed by a colon: `"company": "AEON"`.
- Every field (except the last one in a block) ends with a comma.
- Every entry (except the last one in the list) is followed by a comma, then a `}` on its own, `{` on its own for the next one.

If you ever break the formatting, the site will just silently fail to show that section — nothing will crash publicly, but check your edit against the examples below (or use a free validator like [jsonlint.com](https://jsonlint.com) by pasting the file content in) if a page looks empty after you save.

## Editing an existing Experience card

Open `docs/data/experience.json`. Each entry is one block like this:

```json
{
  "id": "autonomous-systems",
  "company": "Autonomous & Multi-Agent Systems",
  "title": "Systems Architecture",
  "date": "Ongoing",
  "summary": "The short 2-3 sentence blurb shown on the card itself.",
  "fullDescription": [
    "First paragraph shown on the detail page.",
    "Second paragraph shown on the detail page."
  ],
  "responsibilities": [
    "A bullet point on the detail page",
    "Another bullet point"
  ],
  "technologies": ["Python", "MongoDB"],
  "images": []
}
```

To change the card's short description, edit the text inside `"summary": "..."`.
To change the longer write-up on the "Read More Details" page, edit the `"fullDescription"` and `"responsibilities"` lists.

## Adding a brand new Experience or "Things I've Built" card

Copy an entire block (from `{` to `}`), paste it either right before or right after another block inside the same `[ ]` list, add a comma between the two blocks, and then edit the copied block's text. Give it a unique `"id"` (lowercase, no spaces — e.g. `"new-thing"`) so its detail page link works correctly.

For "Things I've Built" (`docs/data/built.json`), the field is called `"name"` instead of `"company"`, and there's an optional `"link"` field — put a project URL there (e.g. a GitHub repo or live demo) and a "View it" button will appear on that project's detail page. Leave it as `""` if there's no link.

## Adding photos

Detail pages and "Things I've Built" cards can both show photos, via the `"images"` list in each entry.

1. **Upload the image files themselves first.** On github.com, open the `docs/images/experience` folder (for experience) or `docs/images/built` folder (for a project), click **Add file → Upload files**, and drag your photo(s) in. Commit the upload.
2. **Then point to them from the JSON.** Open the matching entry in `docs/data/experience.json` or `docs/data/built.json` and fill in its `"images"` list, for example:

   ```json
   "images": ["images/built/aeon-dashboard.jpg", "images/built/aeon-council.jpg"]
   ```

   The paths in the JSON are just `images/<folder>/<filename>` (no `docs/` prefix needed here, since the page itself already lives inside `docs/`) — they need to match the file names you uploaded exactly (including capitalization and file extension).

What shows up where:
- **Experience** (`docs/data/experience.json`): images only appear on that entry's "Read More Details" page, as a photo gallery — the card itself stays text-only.
- **Things I've Built** (`docs/data/built.json`): the *first* image in the list is also used as the card's thumbnail on the "Things I've Built" page; all the images in the list appear in the gallery on that project's detail page.
- No images yet? Leave `"images": []` and nothing extra is shown — no broken image icons.

Keep photos under a few MB each (resize to around 1600px wide) and use simple lowercase file names with no spaces (`aeon-dashboard.jpg`, not `IMG 4821.JPG`).

## Removing a card

Delete its entire `{ ... }` block, including the trailing comma if it's not the last item in the list (and remove the comma from the new last item if you delete the very last one).

## Updating your contact info

Open `docs/data/contact.json` and edit the values for `email`, `linkedin`, `github`, and `resume`. This file only ever has one entry, not a list. Leave any value as `""` to hide that row.

## Changing colors or fonts

Site-wide colors are defined at the very top of `docs/assets/css/style.css` under `:root { ... }` — e.g. `--bg` is the page background, `--card-bg` is the card color, `--black` is the button/accent color. The fonts are loaded from Google Fonts in the `<head>` of each HTML page (`Fraunces` for headings, `Inter` for body text) — swap the font name in both the Google Fonts `<link>` and the matching `font-family` in `style.css` if you want to change them.

## A note on the visual style

This site is styled to evoke anthropic.com's look (warm cream background, black cards/buttons, a serif heading font paired with a clean sans body font). Anthropic's actual fonts (Styrene and Tiempos) are proprietary, so this uses free, similar-looking Google Fonts (Fraunces + Inter) instead.
