# 🎨 Wedding Mood Board Pro

A collaborative web application for couples and wedding designers to create stunning mood boards together in real-time.

## ✨ Features

- 🎯 **Interactive Drag-and-Drop Canvas** - Organize images into themed sections
- 🎨 **Color Palette Management** - Create and save wedding color schemes
- 🤝 **Real-time Collaboration** - Work together with your partner or designer
- 📱 **Responsive Design** - Beautiful on desktop and mobile devices
- 📄 **PDF Export** - Download your mood board as a printable document
- ☁️ **Cloud Image Storage** - Powered by Cloudinary for fast image delivery
- 💾 **Cloud Database** - Supabase for secure data storage

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Drag & Drop**: dnd-kit
- **PDF Generation**: @react-pdf/renderer
- **Database**: Supabase (PostgreSQL)
- **Image Storage**: Cloudinary
- **State Management**: Zustand
- **Icons**: Lucide React

## 📁 Project Structure

```
wedding-moodboard-pro/
├── src/
│   ├── components/
│   │   ├── board/
│   │   │   ├── Canvas.tsx
│   │   │   ├── ImageCard.tsx
│   │   │   ├── Section.tsx
│   │   │   └── DragDropContainer.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── Modal.tsx
│   ├── pages/
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   ├── index.tsx
│   │   ├── dashboard.tsx
│   │   └── board/[id].tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── cloudinary.ts
│   │   └── utils.ts
│   ├── styles/
│   │   └── globals.css
│   └── types/
│       └── index.ts
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
├── .env.example
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account
- Cloudinary account

### Installation

1. Clone the repository

```bash
git clone https://github.com/noriman293/wedding-moodboard-pro.git
cd wedding-moodboard-pro
```

2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in your Supabase and Cloudinary credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
```

4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Type check with TypeScript

## 📖 Usage

1. **Create a Board** - Enter couple's name and wedding date
2. **Upload Images** - Add images from your computer or gallery
3. **Organize** - Drag and drop images into themed sections
4. **Customize** - Select your wedding color palette
5. **Export** - Download as PDF or share with collaborators

## 🎨 Design Philosophy

- **Elegance**: Clean, minimalist interface inspired by high-end wedding magazines
- **Functionality**: Intuitive drag-and-drop experience
- **Performance**: Optimized images and fast loading times
- **Responsiveness**: Works seamlessly on all devices

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@weddingmoodboard.pro or open an issue on GitHub.

---

**Made with 💍 for beautiful weddings**
