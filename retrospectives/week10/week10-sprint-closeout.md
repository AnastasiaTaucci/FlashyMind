# Week 10 – Sprint Closeout

---

## ✅ Completed Tasks

| Task Name                                | Assignee         |
| ---------------------------------------- | ---------------- |
| Explore Decks screen (API fetch)         | Anastasia        |
| Finalize Study Mode screen               | Anastasia        |
| Unit testing                             | Joshua           |
| Quiz Mode UI and logic (partial)         | Ahmet            |
| UI polish and design consistency         | Joshua           |
| Backend refactor and adjustments         | Ahmet            |

---

## 🕒 Unfinished Tasks

| Task Name                                | Assignee         | Notes                                             |
| ---------------------------------------- | ---------------- | ------------------------------------------------- |
| Final integration for full Quiz Mode     | Ahmet, Joshua    | Functional but still needs polish and debugging   |
| Complete unit testing coverage           | Anastasia, Ahmet | Only partial coverage achieved so far             |

---

## 🐛 Bugs / Blockers

| Task Name                             | Assignee         | Notes                                                                                          |
| --------------------------------------| ---------------- | ---------------------------------------------------------------------------------------------- |
| Quiz input + animation issues         | Ahmet            | Laggy UI and keyboard issues on mobile devices                                                 |
| Error state persists to other screens | Joshua           | The error displayed on the home screen is shown on other screen too when you navigate to them  |
| Deck deletion UX                      | Anastasia        | Alert appears too late; user can navigate away                                                 |

---

## 🌟 Key Wins and Challenges

**Wins:**

- Study Mode is now fully functional with review logic and restart flow.
- Explore Decks screen successfully connects to external trivia API and allows import.
- UI polish across multiple screens makes the app look more consistent.
- Backend was improved and cleaned up to support all frontend needs.

**Challenges:**

- Quiz Mode required more time due to UI and animation issues.
- Testing was difficult to implement across all components within sprint time.
- Cross-device compatibility continued to create challenges (simulator vs physical).

---

## ⏭️ Next Sprint Priorities

- Finish final polish and fix remaining bugs (Quiz input, redirects, deletion delay).
- Add basic offline support (e.g., show recent decks via AsyncStorage).
- Complete README, Software Plan, and final presentation slides.
- Merge develop branch into main and freeze code.
- Submit the final version and rehearse for demo.