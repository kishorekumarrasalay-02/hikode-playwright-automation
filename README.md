# hikode-playwright-automation
UI test automation framework for HiKode built with Playwright + TypeScript, using the Page Object Model. Covers Signup, Login, Jobs, Events, Coach, Contribute, and Networking (My Circle/Messages/Plans/Profile) modules, with Allure and Playwright HTML reporting.

# HiKode Playwright Automation Framework

UI test automation framework for **HiKode** — a job application and professional networking platform — built with **Playwright** and **TypeScript**, following the **Page Object Model (POM)** design pattern.

This project is a personal, self-driven initiative built to apply real product knowledge (from manual/exploratory testing on HiKode) into a structured automation framework, as part of an ongoing transition from Manual Testing into an SDET role.

---

## 🧰 Tech Stack

- **Playwright** – browser automation
- **TypeScript** – type-safe test code
- **Page Object Model (POM)** – maintainable, reusable page structure
- **Allure Report** – rich, interactive test reporting
- **Playwright HTML Reporter** – built-in run reports
- **Node.js / npm** – package management and scripts

---

## 📁 Project Structure

```
HIKODE/
├── .vscode/              # Editor/workspace settings
├── allure-report/        # Generated Allure HTML report
├── allure-results/       # Raw Allure result data
├── coach/                # Page objects & locators – Coach module
├── contribute/           # Page objects & locators – Contribute module
├── e2e/                  # End-to-end test flows spanning multiple modules
├── events/               # Page objects & locators – Events module
├── jobs/                 # Page objects & locators – Jobs module
├── Login/                # Page objects & locators – Login module
├── my-circle/            # Page objects & locators – My Circle (networking)
├── my-messages/          # Page objects & locators – My Messages module
├── my-plans/             # Page objects & locators – My Plans module
├── node_modules/         # Installed dependencies
├── playwright-report/    # Generated Playwright HTML report
├── profile/              # Page objects & locators – Profile module
├── scripts/              # Utility/setup scripts
├── Signup/               # Page objects & locators – Signup module
├── src/                  # Core framework utilities (config, fixtures, helpers)
├── test-results/         # Raw test run artifacts (screenshots, traces, videos)
├── tests/                # Test spec files
│   └── signup.spec.ts    # Signup flow test cases
├── .env.example           # Sample environment variable file
└── .gitignore
```

Each module folder (Login, Signup, Jobs, Events, Coach, Contribute, My Circle, My Messages, My Plans, Profile) contains the **page object classes and locators** specific to that section of the HiKode application, keeping test logic separate from page structure.

---

## ⚙️ Setup

### Prerequisites
- Node.js (v18 or later recommended)
- npm

### Installation

```bash
git clone https://github.com/<your-username>/hikode-playwright-automation.git
cd hikode-playwright-automation
npm install
npx playwright install
```

### Environment Variables

Copy the example env file and update it with your local/staging values:

```bash
cp .env.example .env
```

---

## ▶️ Running Tests

Run all tests:
```bash
npx playwright test
```

Run a specific test file:
```bash
npx playwright test tests/signup.spec.ts
```

Run tests in headed mode (visible browser):
```bash
npx playwright test --headed
```

Run tests in a specific browser:
```bash
npx playwright test --project=chromium
```

---

## 📊 Reporting

### Playwright HTML Report
```bash
npx playwright show-report
```

### Allure Report
Generate results during the test run, then serve the report:
```bash
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

---

## ✅ Current Coverage

- **Signup** – core signup flow (`tests/signup.spec.ts`)
- Additional module test coverage (Login, Jobs, Events, Coach, Contribute, My Circle, My Messages, My Plans, Profile) is in active development as page objects are built out.

---

## 🗺️ Roadmap

- [ ] Expand test coverage to Login and Jobs modules
- [ ] Add API-level checks alongside UI flows
- [ ] Integrate CI pipeline (GitHub Actions) for automated test runs on push/PR
- [ ] Add data-driven test cases using fixtures
- [ ] Cross-browser and mobile viewport test coverage

---

## 👤 Author

**Kishore Kumar**
Quality Analyst | Manual Tester transitioning into SDET
Built as a personal upskilling project alongside professional QA work at Ratnam Solutions Private Limited.

