# ⚠️ Node.js Not Installed

Your system doesn't have Node.js installed yet. Here's how to fix it:

## Step 1: Download Node.js

1. Go to: **https://nodejs.org/**
2. Click the **"LTS" button** (Long Term Support - recommended)
3. This downloads the installer for Windows

## Step 2: Install Node.js

1. **Run the installer** you just downloaded
2. Follow the setup wizard:
   - Click "Next" through the welcome screens
   - **IMPORTANT:** When asked about "Add to PATH", make sure it's checked ✓
   - Click "Install" 
   - Wait for it to finish

## Step 3: Restart Your Terminal

1. **Close PowerShell/Command Prompt completely**
2. **Open it again fresh**

## Step 4: Verify Installation

```powershell
node -v
npm -v
```

Both should show version numbers like:
```
v18.17.0
9.6.7
```

## Step 5: Install Dependencies

Once Node.js is installed, go back to your project folder and run:

```powershell
cd C:\Users\iwano\OneDrive\Desktop\proxyy
npm install
```

## Step 6: Start the Server

```powershell
node server.js
```

You should see:
```
🕷️ Web Crawler API server running on http://localhost:3001
Open your browser and go to http://localhost:3001
```

Then open **http://localhost:3001** in your browser!

---

**Need visual help?** 
Watch this video: https://www.youtube.com/watch?v=MJco5nIRQX8

Let me know once Node.js is installed! 🚀
