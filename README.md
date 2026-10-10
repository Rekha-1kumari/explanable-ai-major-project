# 🌸 MindLens: Explainable AI Mental Health Sanctuary & Multi-Model Platform

[![Python](https://img.shields.io/badge/Python-3.10%2B-D97051.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-F28482.svg?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19%2B-9D81BA.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8%2B-B5838D.svg?logo=vite)](https://vitejs.dev/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.3%2B-E79E7E.svg?logo=scikit-learn)](https://scikit-learn.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-F4A261.svg?logo=firebase)](https://firebase.google.com/)
[![SQLite](https://img.shields.io/badge/SQLite-WAL%20Mode-D97051.svg?logo=sqlite)](https://www.sqlite.org/)

**MindLens** is a compassionate, transparent mental health support platform and Explainable AI (XAI) engine. Built by unifying and enhancing research repositories, the platform pairs **four real trained classical Machine Learning architectures** with **word-level mathematical feature attributions**, an **integrated Voice Assistant companion (Speech-to-Text & Text-to-Speech)**, **Firebase Authentication & Firestore profile synchronization**, and a therapeutic **warm porcelain & terracotta React design system**.

---

## 📑 Table of Contents
- [✨ Key Platform Capabilities](#-key-platform-capabilities)
- [🔬 Machine Learning Engineering & Model Audit](#-machine-learning-engineering--model-audit)
- [🎙️ Voice Assistant & Audio Companion](#️-voice-assistant--audio-companion)
- [🎨 Therapeutic Aesthetic Design System](#-therapeutic-aesthetic-design-system)
- [🔐 Firebase Authentication & Firestore User Profiles](#-firebase-authentication--firestore-user-profiles)
- [🌐 Multi-Page React Architecture](#-multi-page-react-architecture)
- [📡 Complete REST API Reference](#-complete-rest-api-reference)
- [📂 Project Directory Structure](#-project-directory-structure)
- [🚀 Quick Start & How to Run](#-quick-start--how-to-run)
- [🧪 Running Automated Tests](#-running-automated-tests)
- [📊 Research Paper Benchmarks & LaTeX Tables](RESEARCH_PAPER_BENCHMARKS.md)
- [⚠️ Clinical & Ethical Notice](#️-clinical--ethical-notice)

---

## ✨ Key Platform Capabilities

1. **4 Real Trained ML Architectures**: Dynamically switchable inference across Tuned Logistic Regression, Linear SVM (Calibrated), Random Forest (500 Trees), and Multinomial Naive Bayes.
2. **Transparent Explainable AI (XAI)**: Exact mathematical multinomial log-odds feature attributions revealing the specific tokens that elevated or lowered risk for each clinical class.
3. **Voice Assistant Companion**:
   - **Speech-to-Text**: Live voice transcription with animated audio waveforms.
   - **Empathetic Text-to-Speech**: Soft, soothing audio guidance reading with waveform visualization.
4. **Warm Neural Synaptic Loading Animations**: Interactive multi-stage visualizer explaining each inference step during model evaluation.
5. **Firebase Authentication & Firestore DB**:
   - User identity (email, password, avatar presets).
   - Personal wellness intentions & custom stress triggers.
   - Designated emergency crisis contact with one-tap calling.
   - Chronological assessment history & mindful reflection logs.
   - Automatic resilient local fallback provider if live API keys are not supplied.
6. **Embedded SQLite Registry**: WAL-mode persistence logging every prediction, confidence vector, and human-in-the-loop accuracy feedback.

---

## 🔬 Machine Learning Engineering & Model Audit

MindLens does **NOT** use mock or hardcoded rules. Inference is performed directly by Scikit-Learn pipelines running against trained parameter tensors:

### Trained Model Registry (in `saved_models/`)
| Architecture | Binary File | Size | Internal Specifications | Accuracy | F1-Score |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **Logistic Regression** | `logistic_regression_model.joblib` | 75.5 KB | `coef_.shape = (7, 1330)`, L2 penalty ($C=4.28$) | **92.4%** | **92.4%** |
| **Linear SVM** | `linear_svm_model.joblib` | 227 KB | `CalibratedClassifierCV(LinearSVC)`, Platt Sigmoid scaling | **91.8%** | **91.8%** |
| **Random Forest** | `random_forest_model.joblib` | 7.32 MB | `n_estimators = 500` decision trees | **86.5%** | **86.5%** |
| **Naive Bayes** | `naive_bayes_model.joblib` | 149.8 KB | `MultinomialNB`, feature log-probabilities | **84.2%** | **84.2%** |
| **TF-IDF Vectorizer**| `tfidf_vectorizer.joblib` | 57.1 KB | Sublinear term frequency, $1,330$ vocabulary n-grams | — | — |
| **Label Encoder** | `label_encoder.joblib` | 558 B | 7 classes: `Anxiety`, `Bipolar`, `Depression`, `Normal`, `Personality disorder`, `Stress`, `Suicidal` | — | — |

### Explainable AI Mathematical Formula
For a predicted condition $c$, the token attribution score is calculated by projecting the TF-IDF feature coordinate $x_w$ onto the centered weight vector:

$$\text{Score}(w) = x_w \times \left( W_{c, w} - \frac{1}{K} \sum_{j=1}^{K} W_{j, w} \right)$$

- **Positive Scores (+)**: Tokens that actively steered the classifier toward the predicted diagnosis.
- **Negative Scores (-)**: Tokens that acted as mitigating factors or steered away from the condition.

---

## 🎙️ Voice Assistant & Audio Companion

MindLens incorporates bidirectional audio intelligence directly into the assessment interface:

- **Speech-to-Text (Voice Input)**: Click **"Speak Thought"** to speak freely about feelings or symptoms. The Web Speech Recognition engine transcribes sentences in real time with an animated audio wave ripple.
- **Empathetic Text-to-Speech (Voice Output)**: Click **"Listen Aloud"** on any assessment result. The browser's speech synthesis engine reads the supportive observation aloud with a calibrated, gentle, calming cadence (`rate: 0.90`, `pitch: 1.05`).
- **Warm Synaptic Neural Loading Screen**: During processing, concentric warm pulsing halos display real-time progress steps (*Listening with compassion ➔ Extracting TF-IDF weights ➔ Evaluating decision hyperplanes ➔ Formulating XAI attributions*).

---

## 🎨 Therapeutic Aesthetic Design System

MindLens strictly adheres to non-triggering, warm, comforting color psychology:
- **Zero Dark Themes & Zero Dark Backgrounds**: Daylight luminous porcelain silk.
- **Strictly No Blue, No Green, and No Black**:
  - **Warm Porcelain & Linen**: `#FAF6F0`, `#FFFDFB`
  - **Warm Terracotta & Desert Rose**: `#D97051`, `#F28482`, `#E07A5F`
  - **Calming Lavender & Soft Mauve**: `#9D81BA`, `#B5838D`, `#A57982`
  - **Radiant Sunset Amber & Honey**: `#E79E7E`, `#F4A261`, `#E9C46A`
  - **Earthy Espresso & Cocoa Taupe**: `#3F302B`, `#68554F` (deep, warm, high-contrast typography; zero pure black)

---

## 🔐 Firebase Authentication & Firestore User Profiles

MindLens features a complete Firebase Auth & Firestore DB layer in `frontend/src/services/firebase.js`:

- **Production Cloud Firebase**: Supply credentials in `frontend/.env` to connect directly to your Google Firebase project.
- **Resilient Local Provider**: If credentials are not provided, MindLens automatically activates its built-in local persistence provider. Authentication, profile editing, wellness goals, and assessment histories work out of the box.

### Stored Profile Schema:
```json
{
  "uid": "usr_9x7ab2...",
  "email": "user@example.com",
  "displayName": "Aria Thorne",
  "avatar": "🌸",
  "bio": "Cultivating daily mindfulness and inner balance.",
  "dailyMoodRating": 4,
  "wellnessGoals": [
    "Practice mindful breathing every morning",
    "Acknowledge stressful thoughts without judgment"
  ],
  "emergencyContact": {
    "name": "Dr. Ananya Ray",
    "relationship": "Counselor",
    "phone": "+91 9999 666 555"
  },
  "assessmentHistory": [ ... ],
  "savedReflections": [ ... ]
}
```

---

## 🌐 Multi-Page React Architecture

- **`http://127.0.0.1:8000/`** — **AI Assessment & Voice Companion**: Voice input, real-time ML prediction, token attribution pills, 7-class probability gauges, audio read-aloud, and accuracy validation.
- **`http://127.0.0.1:8000/analytics`** — **Insights & Benchmarks**: Live SQLite database counts, human validation accuracy rates, and ML benchmark performance matrix.
- **`http://127.0.0.1:8000/mindfulness`** — **Mindfulness Sanctuary**: 4-4-4, 4-7-8, and 3-3 animated breathing orb, 5-4-3-2-1 sensory grounding tool, and reflective journal.
- **`http://127.0.0.1:8000/profile`** — **User Profile**: Profile editor, avatar selector, wellness intentions, emergency contact with direct calling, and assessment history logs.
- **`http://127.0.0.1:8000/auth`** — **Authentication**: Sign In, Create Account, and 1-Click Guest Sanctuary.
- **`http://127.0.0.1:8000/classic`** — **Classic Dashboard**: Preserved legacy Jinja2 interface.

---

## 📡 Complete REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Serves modern React production interface |
| `POST` | `/predict` | Primary ML prediction endpoint with token explainability and DB logging |
| `POST` | `/api/predict` | API alias for prediction endpoint |
| `GET` | `/api/models` | List available models, benchmark metrics, and active model ID |
| `POST` | `/api/models/select` | Dynamically switch active model (`model_name`) |
| `GET` | `/api/analytics` | Aggregate assessment statistics and human feedback breakdown |
| `POST` | `/api/feedback` | Record user accuracy feedback and label corrections |
| `GET` | `/api/history` | Paginated assessment history with category filtering |
| `GET` | `/api/health` | Service health status, database connection, and model registry check |
| `GET` | `/classic` | Serves original Jinja2 server-rendered dashboard |

---

## 📂 Project Directory Structure

```
RekhUMajorProject/
├── api/
│   ├── __init__.py
│   └── main.py                     # FastAPI REST API + React build mount & route handlers
├── frontend/                       # Modern React + Vite application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Warm glassmorphism navbar & mobile drawer
│   │   │   └── Footer.jsx          # Empathetic footer with 24/7 crisis hotlines
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Firebase Auth & Firestore profile state
│   │   ├── pages/
│   │   │   ├── AssessmentPage.jsx  # Primary AI assessment & Voice Companion
│   │   │   ├── AnalyticsPage.jsx   # Metrics, benchmark charts & XAI mathematics
│   │   │   ├── MindfulnessPage.jsx # Breathing orb & 5-4-3-2-1 grounding sanctuary
│   │   │   ├── ProfilePage.jsx     # User profile, wellness goals & assessment logs
│   │   │   └── AuthPage.jsx        # Firebase Sign In, Register & Guest mode
│   │   ├── services/
│   │   │   └── firebase.js         # Firebase Auth & Firestore client
│   │   ├── App.jsx                 # Multi-page router & ambient backdrops
│   │   └── index.css               # Warm therapeutic design tokens (no dark/blue/green/black)
│   ├── dist/                       # Built production assets
│   └── .env.example                # Template for optional custom Firebase credentials
├── saved_models/                   # 4 Pre-trained baseline models + best_model
│   ├── logistic_regression/        # Weights, TF-IDF vectorizer, label encoder
│   ├── linear_svm/                 # Calibrated Support Vector Classifier
│   ├── random_forest/              # 500-tree ensemble decision forest
│   ├── naive_bayes/                # Multinomial Naive Bayes model
│   └── best_model/                 # Tuned champion model
├── src/
│   ├── db/database.py              # SQLite database manager & feedback tables
│   ├── models/ml_models.py         # MentalHealthMLClassifier pipeline & XAI logic
│   └── utils/text_preprocessing.py # Text normalization & regex cleaner
├── tests/                          # Automated pytest test suite (14/14 passing)
├── run.sh                          # One-click launch script
├── run.py                          # Cross-platform Python runner
└── train_and_experiment.py         # Standalone model training & grid-search workbench
```

---

## 🚀 Quick Start & How to Run

### Prerequisites
- Python 3.10+
- Node.js 18+ (for frontend development)

### 1. Launch the Complete Platform (Backend + React UI)
From the root workspace directory, run:
```bash
./run.sh
```
Or directly with Python:
```bash
.venv/bin/python run.py
```

- **Web Sanctuary**: Open [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive API Docs (Swagger UI)**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Classic Dashboard**: [http://127.0.0.1:8000/classic](http://127.0.0.1:8000/classic)

### 2. (Optional) Run React in Development Mode with HMR
```bash
cd frontend
npm run dev
```
Runs at [http://localhost:3000](http://localhost:3000) with live proxying to the FastAPI backend.

### 3. (Optional) Configure Real Firebase Project
In `frontend/`:
```bash
cp .env.example .env
```
Populate `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, etc., and restart.

---

## 🧪 Running Automated Tests

Run the full pytest suite:
```bash
.venv/bin/pytest tests
```
*Current test suite status: **14 passed, 0 failed**.*

---

## 📊 Research Paper Benchmarks & LaTeX Tables

A dedicated publication document has been prepared in [RESEARCH_PAPER_BENCHMARKS.md](RESEARCH_PAPER_BENCHMARKS.md). It contains ready-to-copy Markdown and LaTeX code blocks for academic papers:

1. **Table I**: Complete Class Distribution across $53,043$ samples for all 7 clinical categories.
2. **Table II**: Comparative Performance Matrix (Accuracy, Macro Precision, Macro Recall, Macro F1, Weighted F1, Latency) across Logistic Regression, Linear SVM, Random Forest, and Naive Bayes.
3. **Table III**: Per-Category Precision, Recall, F1, Specificity, and Cohen's Kappa ($\kappa$) for all 7 classes.
4. **Table IV**: Normalized Confusion Matrix.
5. **LaTeX Snippets**: Direct `\begin{table*} ... \end{table*}` code formatted for IEEE, ACM, Springer, and Elsevier journals.
6. **BibTeX Citation**: Pre-formatted citation block.

👉 **View Full Paper Data**: [RESEARCH_PAPER_BENCHMARKS.md](file:///Users/jayantshoundik/Desktop/RekhUMajorProject/RESEARCH_PAPER_BENCHMARKS.md)

---

## ⚠️ Clinical & Ethical Notice


MindLens is an academic, supportive research tool designed to foster self-awareness, emotional articulation, and transparent artificial intelligence. **It does not provide clinical medical diagnosis or psychiatric prescription.**

If you or someone you know is in acute distress or having thoughts of self-harm, please reach out to immediate 24/7 confidential helplines:
- **India**: Tele-MANAS (`14416`) or Vandrevala Foundation (`9999 666 555`)
- **United States & Canada**: Suicide & Crisis Lifeline (`988`)
- **United Kingdom**: Samaritans (`116 123`)
