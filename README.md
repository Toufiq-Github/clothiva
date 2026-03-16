# Clothiva - Modern eCommerce Website (Updated Version)

This version of **Clothiva** contains the most recent updates made in Firebase Studio, including the **Bento Grid** layout, **Buttery Smooth Scroll**, and the **Parallax Hero Section**.

## Why is my GitHub/Vercel not updated?
The code you see here in Firebase Studio is the "Latest Version." However, since I am an AI, I cannot push directly to your GitHub or Vercel. You must manually sync these changes.

## The Solution: How to Update GitHub & Vercel
To get the updates from this Studio environment to your live site, follow these steps in your **local terminal**:

1. **Download/Sync the Code:**
   Ensure your local project folder matches the code you see here. You can copy the file contents or download the updated files.

2. **Navigate to your local project folder:**
   ```bash
   cd path/to/your/clothiva-project
   ```

3. **Check Remote (Ensure it points to your repo):**
   ```bash
   git remote -v
   # If not set, run:
   # git remote add origin https://github.com/Toufiq-Github/Clothiva-Ecommerce-Website.git
   ```

4. **Stage and Commit the Latest Changes:**
   ```bash
   git add .
   git commit -m "Final Update: Bento Grid, Parallax, and Smooth Scroll"
   ```

5. **Push to GitHub:**
   ```bash
   git push origin main
   ```

6. **Vercel Deployment:**
   If your Vercel project is linked to this GitHub repository, it will automatically start a new deployment as soon as you run the `git push` command.

## Current Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS + ShadCN UI
- **Animations:** Lenis (Smooth Scroll)
- **AI:** Genkit + Google Gemini
- **Database/Auth:** Firebase (Firestore & Auth)

---
Official Repository: [https://github.com/Toufiq-Github/Clothiva-Ecommerce-Website](https://github.com/Toufiq-Github/Clothiva-Ecommerce-Website)
