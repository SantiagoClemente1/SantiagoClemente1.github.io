# santiagoclemente1.github.io

Personal portfolio site of Santiago Clemente, served by GitHub Pages. It's plain HTML and CSS with no build step.

## Structure

```
index.html          Home
about.html          About Me: background, education, experience, skills
projects.html       Project cards  → projects/project-N.html
research.html       Paper list     → research/paper-N.html
resume.html         Embeds assets/resume.pdf once it exists
assets/css/style.css  All styling (colors are tokens at the top)
assets/js/site.js     Shared nav + footer (edit links/contact here)
assets/img/           Images (projects/, research/)
assets/papers/        Paper PDFs
```

## Common edits

- **Add a project:** copy `projects/project-1.html`, then add a matching card in `projects.html`.
- **Swap a placeholder image:** replace the `<div class="placeholder">` with `<img src="..." alt="...">`.
- **Update the resume:** replace `assets/resume.pdf`.
- **Preview locally:** `python3 -m http.server 8000`, then open http://localhost:8000.
- **After changing style.css or site.js:** bump the `?v=` number (etc.) in every page's `<link>`/`<script>` tags so browsers fetch the new file instead of a cached copy.
