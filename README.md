# 🎨 ArtistHub – Archiving and Marketing Rwandan Artworks

ArtistHub is a full-stack web platform designed to empower Rwandan artists by giving them a space to showcase, archive, and sell their artworks online. Built with Next.js, Sanity CMS, Tailwind CSS, and integrated with Flutterwave for secure local payments.

## 🚀 Live Deployment

> Deployed on **Vercel**
> 🔗 https://the-artisthub.vercel.app *(if live)*

## 📌 Features

- 🖼️ Artist profiles and artwork listings
- 🛒 Add-to-cart and purchase functionality
- 🔒 Flutterwave payment integration (Mobile Money, Cards, etc.)
- 📚 Legal articles and educational content on IP/copyright
- 📱 Fully responsive and mobile-friendly
- 🛡️ Admin moderation for content and user submissions
- 🖋️ Dynamic content updates via Sanity CMS
- 🆕 Future roadmap includes watermarking & blockchain (NFT) features

## 🧠 Tech Stack

| Frontend | Backend | CMS | Auth | Payments | Deployment |
|----------|---------|-----|------|----------|------------|
| Next.js  | Node.js (API routes) | Sanity | JWT | Flutterwave | Vercel |

## 🛠️ Installation Guide

### ✅ Prerequisites

- Node.js v16+
- npm v7+
- Git
- Sanity.io account
- Flutterwave account

### 1. Clone the Repository

```bash
git clone https://github.com/Ndi-Shema/the_artist_hub.git
cd the_artist_hub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory and include:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_public_key
```

You can find these from your Sanity dashboard and Flutterwave settings.

### 4. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

## 🧪 Testing

- ✅ Unit testing with **Jest**
- ✅ User acceptance testing (pilot with real artists)
- ✅ Manual validation of Flutterwave sandbox transactions
- ✅ Integration testing with Sanity CMS and all forms

## 📦 Deployment Instructions

1. Push your code to GitHub
2. Go to https://vercel.com and create an account
3. Connect your GitHub repo
4. Set the framework to **Next.js**
5. Add the same environment variables as in `.env.local`
6. Click **Deploy**

## 🧑‍🎨 How Artists Can Join

1. Use the contact form to express interest
2. Admin verifies the artist profile & uploads content
3. Artist can track views and sales

## 🧠 Educational Content

Artists can visit the **Legal Articles** section to:

- Learn about copyright in Rwanda
- Understand how to register their work
- Access tips for pricing, negotiation, and digital safety

## 🔐 Future Enhancements

- 🖋️ Add watermark overlays to uploaded images for IP protection
- ⛓️ Integrate blockchain (Web3/NFTs) to authenticate digital ownership
- 📱 Improve offline accessibility for low-connectivity regions
- 📊 Analytics dashboard for artists to track views and sales

## 📂 Folder Structure

```
/pages         → Route handlers
/components   → Reusable UI parts
/lib          → Utility functions & config
/sanity       → Sanity client setup
/public       → Static assets
/styles       → Tailwind config & global styles
```

## 🤝 Contributors

- **Shema Fred** – Developer, Project Lead
- **David [Supervisor]** – Capstone Supervisor
- Mentors from African Leadership University

## 📜 License

This project is licensed under the MIT License.

## 📧 Contact

For inquiries or collaborations:

📨 Email: fredshema24@gmail.com
🌐 GitHub: https://github.com/Ndi-Shema
