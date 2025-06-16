# FlashyMind

FlashyMind is a mobile flashcard application built with React Native and Expo. It allows users to create custom flashcard decks or explore curated pre-made sets to study and quiz themselves on various topics.

---

## 📱 Features

* ✏️ Create and edit your own flashcards and decks
* 📚 Study flashcards in a card-flipping interface
* 🔐 Supabase-powered authentication
* ❓ Quiz Mode (optional): Test knowledge with multiple-choice quizzes
* 🏰 Explore pre-made flashcards by category and difficulty using pre-made trivia questions from the [Open Trivia DB](https://opentdb.com/api_config.php)


---

## 🛠️ Tech Stack

* React Native + Expo
* Supabase (Auth + Database)
* ExpressJS (Backend API)
* React Navigation
* Formik or React Hook Form

---

## 🧱 Folder Structure

```
flashymind/
├── backend/              # ExpressJS backend API
├── frontend/             # React Native app
│   ├── components/       # UI components
│   ├── screens/          # App screens
│   ├── services/         # API/Supabase services
│   └── App.js            # Entry point
├── .env                  # Environment variables
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js >= 16
* Expo CLI (`npm install -g expo-cli`)
* Supabase account & project

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

Create a `.env` file in both `frontend/` and `backend/` directories and configure:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
```

---

## 🔧 Development

### Start the frontend

```bash
$ cd frontend
$ expo start
```

### Start the backend

```bash
$ cd backend
$ npm run dev
```

---

## 👥 Contributing

* Follow feature branch naming convention: `FEAT<ISSUE#>_<ShortDescription>_<YourName>`
* Open a pull request to `dev` branch
* Include issue references and testing instructions in PRs

---

## 📄 License

MIT License © 2024 FlashyMind Team
