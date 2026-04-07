# MakeMyFacelessVideo — Coming Soon Page

AI-powered faceless video creation for YouTube, Instagram & TikTok.

## 🚀 Deploy to Cloudflare Pages (Step-by-Step)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/makemyfacelessvideo.git
git push -u origin main
```

### 2. Connect to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create**
2. Click **Pages** → **Connect to Git**
3. Authorize GitHub and select the `makemyfacelessvideo` repo
4. Set build settings:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/` (or leave blank)
5. Click **Save and Deploy**

Cloudflare will deploy your site and give you a `*.pages.dev` URL instantly.

### 3. Add a Custom Domain (optional)

1. In Cloudflare Pages → your project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter `makemyfacelessvideo.com`
4. If your domain is already on Cloudflare DNS, it auto-configures. Otherwise add the provided CNAME to your registrar.

---

## 📧 Connect Email Waitlist (Google Forms)

The email form sends to Google Forms. To activate it:

1. Create a Google Form with one "Email" field
2. Inspect the form and find:
   - The `action` URL (looks like `https://docs.google.com/forms/d/e/XXXXX/formResponse`)
   - The field entry ID (looks like `entry.123456789`)
3. Open `index.html` and replace these two placeholders in the `handleSubmit()` function:
   ```js
   const FORM_ACTION = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse';
   // and
   '?entry.YOUR_FIELD_ID=' + encodeURIComponent(email)
   ```

---

## 📁 File Structure

```
/
├── index.html        ← Main landing page
├── favicon.svg       ← Site icon
├── robots.txt        ← SEO crawler rules
├── sitemap.xml       ← SEO sitemap (update domain)
├── _redirects        ← Cloudflare Pages routing
├── _headers          ← Security & cache headers
├── .gitignore
└── README.md
```

---

## ✏️ Customisation Checklist

- [ ] Replace Google Form ID and field ID in `index.html`
- [ ] Update `sitemap.xml` with your real domain
- [ ] Update `robots.txt` with your real domain
- [ ] Change the launch date in `index.html` (search for `LAUNCH =`)
- [ ] Add your social links in the footer
