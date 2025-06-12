# Software Development Plan

**Team Name:** Proof of Concept Mobile Application
**Project:** FlashyMind
**Platform:** React Native with Expo
**Timeline:** 5 Weeks
**Team Members:** Ahmet (Backend), Joshua (Frontend), Anastasia (UI/UX)

---

## 📌 Project Overview

This project aims to develop a proof-of-concept mobile application using React Native and Expo. The goal is to demonstrate core functionality, technical feasibility, and a user-friendly experience for flashcard-based learning.

FlashyMind enables users to study any topic through custom-created flashcards or curated pre-made decks. It includes features like Study Mode and an optional Quiz Mode to support multiple learning strategies. Supabase is used for authentication and backend storage.

---

## 🎯 Objectives

* Develop a mobile app with core flashcard-based learning features
* Implement intuitive navigation and a clean UI
* Include at least:

  * 4 Screens
  * 2 Forms with validation
  * Remote data storage
  * Real-time data fetching and updates
* Validate app viability through testing and user feedback
* Demonstrate technical understanding of mobile dev principles, project management, and collaboration

---

## ✅ Sprint-by-Sprint Breakdown

### 🗓️ Sprint 1: Planning & Setup

**Goals:**

* Define overall project goals and scope.
* Set up the development environment and repositories.
* Assign team roles.

**Tasks:**

* Create wireframes and user flows.
* Initialize GitHub repo and project structure (frontend/backend).
* Select tech stack: Expo, Supabase, ExpressJS, etc.

**Deliverables:**

* Wireframes and flowcharts - Anastasia
* Project proposal document - Ahmet
* GitHub repository with base structure - Joshua

### 🗓️ Sprint 2: Authentication & Deck Management

**Goals:**

* Implement authentication and deck management basics.

**Tasks:**

* Build Sign In / Sign Up screen with Supabase Auth - Joshua
* Set up ESlint, Prettier and Jest - Joshua
* Create Home screen with deck list - Anastasia
* Initial Application Structure - Anastasia
* Backend setup and database schema (users, decks, flashcards) - Ahmet
* Create Geck Add/Edit screen - Ahmet

**Deliverables:**

* Auth screen with working login - Joshua
* Configured ESLint, Prettier and Jest - Joshua
* Home screen listing decks - Anastasia
* Initial folder layout, screens - Anastasia
* Backend with initial Supabase integration - Ahmet
* Deck Add/Edit screen - Ahmet

### 🗓️ Sprint 3: Study & Explore

**Goals:**

* Adding studying and quiz modes, enable Add/Edit Flashcard

**Tasks:**

* Create Study Mode screen with flip interaction
* Add/Edit Flashcard forms (with validation)
* Develop Quiz Mode functionality (randomized Q\&A matching)

**Deliverables:**

* Fully functional Study screen - Anastasia
* Deck and Flashcard creation forms - Joshua
* Quiz Mode screen - Ahmet

### 🗓️ Sprint 4: Quiz Mode & Polish

**Goals:**

* Add interactive Quiz Mode, finish Study mode, and improve UI consistency.

**Tasks:**

* Explore Decks screen (fetch from an outside API) -Anastasia
* Finish Study mode screen - Anastasia
* Testing - all of us
* Refactor backend as needed - Ahmet 
* Apply final design polish and improvements - Joshua
* Quiz mode (screen, logic and connection to the backend) - Ahmet, Joshua


### 🗓️ Sprint 5: Testing & Presentation

**Goals:**

* Finalize features and deliver a polished, working demo.

**Tasks:**

* Fix bugs and test all features on multiple devices
* Write README and setup documentation
* Record or present final demo

**Deliverables:**

* Fully working FlashyMind mobile app
* Final team presentation/demo
* Complete project documentation

---

## ✅ Success Criteria

| Criteria               | Measurement Method                          |
| ---------------------- | ------------------------------------------- |
| Consistent Design      | Visual consistency across all screens       |
| 20% Unit Test Coverage | Core components tested with Jest            |
| Intuitive Navigation   | User tests show smooth navigation flow      |
| Functional Features    | Add/Edit/Study/Quiz decks work as expected  |
| Working Backend        | Flashcards & user data stored and retrieved |

---

## 📁 GitHub Project

* **Project Board:** [https://github.com/users/AnastasiaTaucci/projects/2](https://github.com/users/AnastasiaTaucci/projects/2)

## 🧰 Tools & Libraries

* React Native + Expo – Mobile development
* Supabase – Auth and DB
* ExpressJS – Custom backend API
* GitHub Projects – Task management
* React Navigation – App routing
* Formik / React Hook Form – Forms with validation
* Zustand – Global state management

---

## 🔄 Sprint Planning & Team Meetings

* **Sprint Duration:** 1 Week
* **Kickoff Meeting:** Thursdays at 1 PM – Review goals and assign tasks
* **Stand-Ups:** Daily 15-minute updates (async via Teams)
* **Midweek Sync:** Optional working session
* **Sprint Review:** Wednesdays in class – Feature demos and feedback
* **Task Management:** GitHub Projects with clear task descriptions, deadlines, and owners
* **Communication:** Teams for real-time updates

---

## 👥 Team Roles

| Role                  | Assigned Members                                           |
| --------------------- | ---------------------------------------------------------- |
| Project Manager       | Anastasia                                                  |
| Frontend Developer(s) | Shared                                                     |
| Backend Integrator    | Ahmet, Joshua                                              |  
| QA / Tester           | Each team member responsible for their own testing script  |
| UI/UX Designer        | Anastasia, Joshua                                          |

---

## 🧪 Version Control Workflow

* **Main Branch:** Stable releases

  * [https://github.com/AnastasiaTaucci/FlashyMind.git](https://github.com/AnastasiaTaucci/FlashyMind.git)
* **Dev Branch:** Ongoing development
    * [https://github.com/AnastasiaTaucci/FlashyMind/tree/develop](https://github.com/AnastasiaTaucci/FlashyMind/tree/develop)
* **Feature Branches:** One per task/feature

  * Naming convention: `FEAT<ISSUE#>_<ShortDescription>_<YourName>`
* **Pull Requests:** Required for merging into `dev` after review and testing
