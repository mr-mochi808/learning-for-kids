# 🚀 Deployment Guide - Render

Deploy your Web Crawler to the internet for FREE using Render!

## Step 1: Push Code to GitHub

1. **Create a GitHub account** (if you don't have one): https://github.com/signup
2. **Create a new repository:**
   - Go to https://github.com/new
   - Name it: `web-crawler`
   - Click "Create repository"

3. **Push your code to GitHub:**
   ```bash
   cd c:\Users\iwano\OneDrive\Desktop\proxyy
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/web-crawler.git
   git push -u origin main
   ```
   (Replace `YOUR_USERNAME` with your GitHub username)

## Step 2: Deploy on Render

1. **Go to Render:** https://render.com
2. **Sign up** with your GitHub account
3. **Create a new Web Service:**
   - Click "+ New >" → "Web Service"
   - Connect your GitHub repository (`web-crawler`)
   - Choose the repository

4. **Configure the deployment:**
   - **Name:** `web-crawler`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free tier (select this)

5. **Click "Create Web Service"**

6. **Wait for deployment** (2-5 minutes)
   - Render will show a live URL like: `https://web-crawler-xxxx.onrender.com`

## Step 3: Use Your Live Web Crawler!

Once deployed, open the URL in your browser and start crawling!

**Example:** `https://web-crawler-xxxx.onrender.com`

---

## Testing Locally Before Deployment

Before pushing to GitHub, test it locally:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   node server.js
   ```

3. **Open in browser:**
   ```
   http://localhost:3001
   ```

4. **Test crawling and searching** to make sure it works.

---

## Troubleshooting Render Deployment

### Deployment fails with "Command failed"
- Check `package.json` has `express` and `cors` dependencies
- Verify `server.js` exists in the root folder

### "Service failed to start"
- Check the Logs in Render dashboard
- Make sure `start` script in `package.json` is `node server.js`

### Web crawler works locally but not on Render
- The site you're crawling might block automated requests
- Try with `https://example.com` first

---

## Free Tier Limits on Render

- ✅ Free SSL/HTTPS
- ✅ Custom domain support
- ⚠️ Spins down after 15 minutes of inactivity (takes 30 sec to restart)
- ⚠️ Limited to 750 hours/month
- ⚠️ No persistent storage (data clears on restart)

**Good for:** Testing, demos, learning
**Not good for:** Production websites with high traffic

---

## Next Steps

1. **Test locally first** (`node server.js`)
2. **Push to GitHub**
3. **Deploy on Render**
4. **Share the URL with others!**

You now have a **live web crawler on the internet!** 🎉

---

## Alternative Free Hosting Options

- **Railway.app** - Similar to Render, generous free tier
- **Heroku** - Classic choice (free tier discontinued, but cheap)
- **Replit** - Great for quick demos
- **Vercel** - Better for frontend, harder for Node backends

---

For help, check Render's docs: https://render.com/docs
