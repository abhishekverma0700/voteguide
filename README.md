# VoteGuide — Election Process Assistant

VoteGuide is a compact, offline-friendly web assistant that helps first-time voters understand the election process, timelines, and essential next steps. It is built with plain HTML, CSS and JavaScript so it can be hosted anywhere as a static site.

## Key Features
- Interactive Election Timeline (expand each step for details)
- Rule-based Chatbot with 20+ preloaded Q&A entries and fuzzy matching
- Quick-reply buttons for common questions
- Voter Eligibility Checker (age + citizenship)
- Searchable Election Glossary (20+ terms)
- Readiness Quiz with progress indicator
- Chat persistence using `localStorage` (keeps conversation history)

## Quick Start (run locally)
1. Clone or download the repository.
2. Open `index.html` in your browser. No build step or server required.

## Project Structure
```
project-root/
├── index.html              # Main app
├── assets/
│   ├── style.css          # All styles and responsive rules
│   └── script.js          # All JS: timeline, chatbot, glossary, quiz
└── README.md
```

## How It Works (overview)
- Timeline: The timeline uses semantic `article` cards. Clicking a step toggles its expanded details. The behavior is implemented in `initTimeline()` inside `assets/script.js`.
- Chatbot: A rule-based chatbot is driven by the `const botResponses = { ... }` object in `assets/script.js`. User input is normalized and matched exactly or by fuzzy keyword overlap for flexible replies. Conversations persist in `localStorage` under the key `voteguide.chat`.
- Eligibility Checker: Simple age + citizenship form with immediate feedback.
- Glossary: A client-side list of terms rendered dynamically and filtered as you type.
- Progress Tracker: Five yes/no questions update a progress bar showing readiness percentage.

## Design & Accessibility
- Color variables and spacing are defined in `assets/style.css` using CSS custom properties for easy theming.
- Semantic HTML elements (`header`, `main`, `section`, `article`, `nav`, `footer`) improve structure and assistive technology support.
- Interactive elements include `aria-label` and `aria-live` where appropriate.
- Responsive, mobile-first layout with a sticky header and an accessible mobile navigation toggle.

## Deployment
Because the app is a single static site, you can deploy it to any static host (GitHub Pages, Netlify, Vercel, or a simple web server). To deploy to GitHub Pages: push the repository and enable Pages on the `main` branch.

## Testing & QA Checklist
- Open `index.html` and verify no console errors.
- Verify timeline cards expand/collapse.
- Ask the chatbot a quick question and confirm a reply appears.
- Check that chat history persists across page reloads.
- Use the glossary search and verify filtering.
- Complete the readiness quiz and confirm progress percent.

## Extending the Assistant
- Add more Q&A to the `botResponses` object in `assets/script.js` (the chatbot normalizes input for robust matching).
- Replace the static glossary entries with a JSON file and fetch it locally if you prefer data separation.
- Add localization by extracting text into resource files.

## Troubleshooting
- If the chat doesn't respond: open the browser console for errors, make sure JavaScript is enabled, and check that `assets/script.js` is loaded.
- If the page reloads when submitting the chat form, ensure the submit handler is attached; `e.preventDefault()` prevents default submission.

## Screenshots
<img width="1901" height="1005" alt="image" src="https://github.com/user-attachments/assets/2fdaa12b-fc94-46bb-9a8c-c7147cfb40d5" />
<img width="1910" height="1032" alt="image" src="https://github.com/user-attachments/assets/34abc9cc-87a1-4fa0-8352-8d6fe4094e77" />
<img width="1919" height="1013" alt="image" src="https://github.com/user-attachments/assets/893bd3ab-c47b-47da-a0ad-f4ed8cbc803c" />


