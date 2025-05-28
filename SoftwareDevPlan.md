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

* Wireframes and flowcharts
* Project proposal document
* GitHub repository with base structure

### 🗓️ Sprint 2: Authentication & Deck Management

**Goals:**

* Implement authentication and deck management basics.

**Tasks:**

* Build Sign In / Sign Up screen with Supabase Auth
* Create Home screen with deck list
* Backend setup and database schema (users, decks, flashcards)

**Deliverables:**

* Auth screen with working login
* Home screen listing decks
* Backend with initial Supabase integration

### 🗓️ Sprint 3: Study & Explore

**Goals:**

* Enable studying and exploring flashcard content.

**Tasks:**

* Create Study Mode screen with flip interaction
* Add/Edit Deck and Flashcard forms (with validation)
* Explore Decks screen (fetch from Supabase or local JSON)

**Deliverables:**

* Fully functional Study screen
* Deck and Flashcard creation forms
* Browseable Explore screen

### 🗓️ Sprint 4: Quiz Mode & Polish

**Goals:**

* Add interactive Quiz Mode and improve UI consistency.

**Tasks:**

* Develop Quiz Mode functionality (randomized Q\&A matching)
* Refactor backend as needed
* Apply final design polish and improvements

**Deliverables:**

* Quiz Mode screen
* Backend endpoint refinements
* UI/UX enhancements

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

* **Project Board:** [https://github.com/users/AnastasiaTaucci/projects/1](https://github.com/users/AnastasiaTaucci/projects/1)

## 🧰 Tools & Libraries

* React Native + Expo – Mobile development
* Supabase – Auth and DB
* ExpressJS – Custom backend API
* GitHub Projects – Task management
* React Navigation – App routing
* Formik / React Hook Form – Forms with validation

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

| Role                  | Assigned Members |
| --------------------- | ---------------- |
| Project Manager       | Anastasia  |
| Frontend Developer(s) | Joshua           |
| Backend Integrator    | Ahmet            |
| QA / Tester           | Each team member responsible for their own testing script  |
| UI/UX Designer        | Anastasia        |

---

## 🧪 Version Control Workflow

* **Main Branch:** Stable releases

  * [https://github.com/AnastasiaTaucci/FlashyMind.git](https://github.com/AnastasiaTaucci/FlashyMind.git)
* **Dev Branch:** Ongoing development
    * [https://github.com/AnastasiaTaucci/FlashyMind/tree/develop](https://github.com/AnastasiaTaucci/FlashyMind/tree/develop)
* **Feature Branches:** One per task/feature

  * Naming convention: `FEAT<ISSUE#>_<ShortDescription>_<YourName>`
* **Pull Requests:** Required for merging into `dev` after review and testing
