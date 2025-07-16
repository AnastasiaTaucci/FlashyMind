# FlashyMind

FlashyMind is a mobile flashcard application built with React Native and Expo. It allows users to create custom flashcard decks or explore pre-made flashcard sets to study and quiz themselves on various topics.

---

## 📱 Features

- ✏️ Create and edit your own flashcards and decks
- 📚 Study flashcards
- 🔐 Supabase-powered authentication
- ❓ Quiz Mode: Test knowledge in a card-flipping interface
- 🏰 Explore pre-made flashcards by category and difficulty using pre-made trivia questions from the [Open Trivia DB](https://opentdb.com/api_config.php)

---

## 🛠️ Tech Stack

**Frontend:**

- **React Native + Expo** – for building cross-platform mobile apps
- **Expo Router** – screen-based routing and navigation
- **Zustand** – lightweight global state management
- **Formik + Yup** – for form input handling and validation
- **AsyncStorage** – to store decks and progress locally for offline access

**Backend & Data:**

- **Supabase** – provides authentication and real-time database (used for storing decks and cards)
- **ExpressJS** – custom backend API for extended logic beyond Supabase

---

## 🧱 Folder Structure

```
flashymind/
├── backend/                    # ExpressJS backend API
|   ├── .env                    # Environment variables (Supabase credentials)
├── frontend/                   # React Native app
│   ├── app/                    # Screens and routing (expo-router)
│       ├── (auth)/             # Login & signup
│       ├── (tabs)/             # Home & Explore tab groups
│       └── +not-found.tsx      # 404 fallback
│   ├── components/             # Reusable UI components
│   ├── context/                # Auth and other providers
│   ├── service/                # Supabase and API logic
│   ├── store/                  # Zustand state store
│   ├── types/                  # TypeScript types
│   └── utils/                  # Utility functions
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16
- Expo CLI (`npm install -g expo-cli`)
- Supabase account & project

### Installation

```bash
# Clone the repo
$ git clone https://github.com/AnastasiaTaucci/FlashyMind.git
$ cd FlashyMind

# Install frontend dependencies
$ cd frontend
$ npm install

# Install backend dependencies
$ cd ../backend
$ npm install
```

### Environment Setup

Create a `.env` file in `backend/` directory and configure:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
```

---

## 🔑 Demo Credentials

If you're reviewing this project and want to try it out with our demo Supabase instance, you can find the necessary credentials here:

👉 [View Supabase Demo Credentials (Google Doc)](https://docs.google.com/document/d/1ie7tb5OnlBIhcsSsSjMEDnlnBdXlFvDLh2pys0eDwq8/edit?usp=sharing)

> ⚠️ These keys are **read-only** and for **demo purposes only**. Please do not use them in production apps.

---

## 🔧 Development

### Start the frontend

```bash
$ cd frontend
$ npx expo start
```

### Start the backend

```bash
$ cd backend
$ npm run dev
```

---

## 👥 Contributing

- Follow feature branch naming convention: `FEAT<ISSUE#>_<ShortDescription>_<YourName>`
- Open a pull request to `develop` branch
- Include issue references and testing instructions in PRs

---

## 🧪 Testing Instructions

This project uses **Jest** along with **React Native Testing Library** for unit testing.

### To run tests:

```bash
cd frontend
npm run test
```

Test coverage is tracked in the `coverage/` directory.  
Some screens (e.g., Study Mode, Quiz Mode) include test files under `__tests__/`.

> 📝 Note: `__tests__` folders are located in the same directory as the screen or component they are testing.

---

## 👥 Team Contributions

- **Ahmet**: Supabase integration, backend logic, and Quiz Mode functionality.
- **Joshua**: Authentication (Login/Signup), Add/Edit Deck and Card screens, UI/UX design, unit testing, and debugging full-deck issues.
- **Anastasia**: Project management, wireframes, initial navigation, UI/UX design, Home screen, Explore Deck feature, Study Mode, and unit testing.

---

## 🐞 Known Bugs / Limitations

- Limited offline functionality — only the 3 most recent decks are cached.
- The app currently works only on iOS due to backend connection issues on Android.
- No normalization for decks and flashcards — the same flashcard cannot be reused across multiple decks.
- Add/Edit/Delete buttons become inactive only after a delayed network timeout, which may confuse users during slow or unstable connections.

---

## 💡 Potential Improvements

- Add a screen or tab to view saved quiz results per deck after completing a quiz (data is stored in Supabase but not yet accessible in the UI).

- Improve Study Mode with smoother animations for revealing answers and transitioning between cards.

- Add unit tests for Quiz Mode to ensure input handling, scoring logic, and UI behavior are reliable.

---

## 🎤 Final Presentation

You can view the final presentation slides here:  
[FlashyMind Project Presentation – View on OneDrive](https://1drv.ms/p/c/9f4164d2de04d803/Ecck3vwkEMtAqSkYzWzDYjcBjRV6k838Z3GV-1A37P8zFA?e=0qEicG)

---

## 📄 License

MIT License © 2024 FlashyMind Team
