# Varun Jadhav — Next.js Portfolio

This is a Next.js port of the portfolio site. It includes the primary landing, projects, timeline, and interactions.

Quick start

1. Open this project folder

```bash
cd "c:/varun protofilo"
```

2. Install dependencies, if you have not already

```bash
npm install
```

3. Run the Next.js dev server

```bash
npm run dev
```

Open http://localhost:3000

Do not use VS Code Live Server for this project. Live Server opens
`http://127.0.0.1:5500/` and only shows the folder files because this is a
Next.js app, not a plain static HTML site.

Notes

- Replace placeholder images in `public/img/` and `public/resume.pdf` with your real assets.
- To deploy, build with `npm run build` then `npm run start`, or deploy to Vercel for automatic Next.js hosting.
- This project uses client-side effects for animations. For enhanced SEO and performance, consider converting critical parts to server-rendered components or using Next.js Image optimization with remote images.
