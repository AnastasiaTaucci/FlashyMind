# FlashyMind Software Development Plan

---

**Project Title:** FlashyMind – Custom & Pre-Made Flashcards App
**Platform:** React Native with Expo
**Repository:** [https://github.com/AnastasiaTaucci/FlashyMind.git](https://github.com/AnastasiaTaucci/FlashyMind.git)

---

## 🎯 Core Idea

FlashyMind is a mobile flashcard application that allows users to study any topic using either custom-created decks or curated pre-made sets. The app supports a variety of subjects such as Biology and Software Development. It features Study Mode for sequential review and Quiz Mode for testing knowledge.

---

## 🔢 Core Features

* Create flashcards and decks using a simple form
* Study flashcards with an interactive card-flipping interface
* User authentication using Supabase
* *(Optional)* Quiz Mode: Multiple-choice quizzes based on flashcards
* *(Optional)* Explore & import pre-made decks from various subjects

---

## 📱 App Screens

| Screen                        | Description                                                           |
| ----------------------------- | --------------------------------------------------------------------- |
| 🔐 Sign In / Sign Up          | Email/password login via Supabase for personalized content            |
| 🏠 Home                       | Lists all flashcard sets with options to edit, delete, study, or quiz |
| 📂 Create/Edit Deck           | Form to create or update deck name and manage flashcards              |
| 📂 Create/Edit Flashcard      | Form to add or edit a card (front = question, back = answer)          |
| 📚 Study Mode                 | Flip through flashcards one-by-one for review                         |
| ❓ Quiz Mode *(Optional)*      | Match questions and answers in a randomized quiz format               |
| 🏰 Explore Decks *(Optional)* | Browse and import pre-made decks                                      |

---

## ✏️ Input Forms

| Form                  | Fields                                      |
| --------------------- | ------------------------------------------- |
| Sign In / Sign Up     | Email, Password                             |
| Create/Edit Deck      | Deck name, ability to add/remove flashcards |
| Create/Edit Flashcard | Front (question), Back (answer), Validation |

---

## 🗓️ 5-Week Timeline

| Week | Focus                  | Tasks & Deliverables                                             |
| ---- | ---------------------- | ---------------------------------------------------------------- |
| 1    | Planning & Setup       | Define scope, create wireframes, set up GitHub & Expo            |
| 2    | Home + Deck Management | Build Home screen, login form, backend integration with Supabase |
| 3    | Study & Explore UI     | Build Study screen, Add/Edit Deck/Card UI, Explore screen        |
| 4    | Quiz Mode + Polish     | Implement Quiz Mode, backend refinements, UI polish              |
| 5    | Testing & Presentation | Final testing, bug fixes, UX improvements, presentation prep     |

---

## 🚀 Objectives

* Build a mobile app for flashcard-based learning
* Implement at least 4 core screens and 2 validated forms
* Store and fetch data using Supabase backend
* Support custom and pre-made flashcard sets
* Validate viability through testing and user feedback

---

## 👥 Team Roles

| Role               | Name         |
| ------------------ | ------------ |
| Project Manager    | Anastasia  |
| Frontend Developer | Anastasia, Shuyu, Ahmet |
| Backend Developer  | Ahmet        |
| QA / Testing       | Everybody writes test for their own feature |
| UI/UX Designer     | Anastasia    |

---

## 🔧 Tools & Libraries

* React Native with Expo
* Supabase (Authentication & Database)
* ExpressJS (API backend)
* GitHub Projects (Task and issue tracking)
* React Navigation
* React Hook Form or Formik (for form handling)

---

## ⚖️ Success Criteria

| Criteria                | How It's Measured                              |
| ----------------------- | ---------------------------------------------- |
| Consistent Design       | All screens align with wireframes              |
| 20% Unit Test Coverage  | Coverage via Jest and testing-library          |
| Intuitive Navigation    | Minimal confusion observed in user testing     |
| Core Feature Completion | Create/edit/study/quiz features are functional |
| Backend Integration     | Data persists and syncs correctly via Supabase |

---

## 🧰 Sprint Planning & Team Meetings

* **Sprint Duration:** 1 week
* **Kickoff Meeting:** Every Thursday at 1 PM (plan goals, assign tasks)
* **Daily Standups:** 15-minute check-ins (async via Discord)
* **Midweek Sync:** Optional check-in/work session
* **Sprint Review:** Every Wednesday in class (demo and feedback)
* **Task Management:** Managed through GitHub Projects with assigned issues and deadlines

---

## 🔄 Version Control Workflow

* `main`: Stable release branch
* `dev`: Active development branch
* `feature/*`: One feature per branch using format:
  `FEAT<ISSUE#>_<ShortDescription>_<Creator>`
  *Example: `FEAT13_ExpressINIT_DegerAhmet`*
* All changes merged into `dev` via pull requests after code review

---
