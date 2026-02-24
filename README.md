# Interactive Portfolio Game 🎮

A unique, interactive 2D platformer-style portfolio website built with **Next.js**. Instead of a traditional resume, navigate through a fun game environment where you control a robot character to collect coins while exploring my work and skills.

**[Play the Game](https://your-deployed-url.com)** | **[Traditional Resume](/resume)**

## Features

- **Interactive Gameplay** - Control a robot character using keyboard controls
- **Coin Collection** - Collect procedurally spawned coins throughout the game
- **Smooth Animations** - Framer Motion-powered animations and parallax background scrolling
- **Responsive Design** - Plays smoothly on different screen sizes
- **Audio Integration** - Background music and sound effects
- **Physics-Based Movement** - Realistic jumping and collision detection
- **Traditional Fallback** - Traditional resume page available for those who prefer it

## Getting Started

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/personal_website.git
cd personal_website
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

### Running the Development Server

Start the Next.js development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser and start playing!

## How to Play

- **Move Left/Right**: Arrow Keys or `A`/`D` keys
- **Jump**: Spacebar
- **Collect Coins**: Collide with coins to collect them
- **Explore**: Move around to discover the full landscape and collect all coins

## Building for Production

### Build the project
```bash
npm run build
# or
yarn build
```

### Start the production server
```bash
npm start
# or
yarn start
```

## Project Structure

```
src/
├── app/
│   ├── components/           # Main game components
│   │   ├── Robot.tsx         # Playable robot character
│   │   ├── Background.tsx    # Animated SVG landscape
│   │   ├── Coin.tsx          # Collectible coins
│   │   ├── TextBubble.tsx    # Communication bubbles
│   │   ├── AudioPlayer.tsx   # Sound management
│   │   ├── NavBar.tsx        # Navigation header
│   │   └── Start.tsx         # Start screen
│   ├── page.tsx              # Main game engine
│   ├── resume/page.tsx       # Traditional resume page
│   └── layout.tsx            # Root layout
├── redux/                    # State management
├── lib/                      # Utility functions
└── components/ui/            # Reusable UI components
```

## Technologies Used

- **Framework**: [Next.js](https://nextjs.org/) 14.2
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Audio**: [use-sound](https://www.npmjs.com/package/use-sound)
- **Icons**: [Lucide React](https://lucide.dev/)
- **3D Graphics**: [Three.js](https://threejs.org/) (for future enhancements)

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint code quality checks |

## Deployment

This project can be easily deployed to [Vercel](https://vercel.com/) (recommended for Next.js):

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Vercel will automatically detect Next.js and configure the build settings
4. Your site will be live!

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

Feel free to reach out if you have questions or want to connect!
