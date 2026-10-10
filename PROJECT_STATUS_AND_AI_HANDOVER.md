# 🌸 MindLens AI: System Manifest & Autonomous Agent Handover Guide

> **Repository**: [https://github.com/Rekha-1kumari/explanable-ai-major-project](https://github.com/Rekha-1kumari/explanable-ai-major-project)  
> **Status**: Production-Ready / Fully Integrated Classical ML + XAI + FastAPI + React Frontend  
> **Target Audience**: AI Agents, Collaborators, and Downstream Systems integrating this module into a larger mental health / healthcare ecosystem.

---

## 📌 1. Executive Summary & Purpose

MindLens AI is an end-to-end, explainable mental health assessment platform. It unifies classical machine learning with mathematical token-level explainability, a reactive FastAPI REST API backend, an embedded SQLite audit registry, and a modern React 19 + Vite frontend equipped with voice interaction and Firebase profile management.

This repository serves as a self-contained, reproducible submodule that can either run standalone or be consumed as a microservice in larger health informatics networks.

---

## 🏛️ 2. Architectural Blueprint

```
                      ┌────────────────────────────────────────┐
                      │          React 19 + Vite Frontend      │
                      │  - Warm Porcelain/Terracotta Aesthetics │
                      │  - Web Speech STT & Empirical TTS      │
                      │  - Firebase Auth & Profile Store       │
                      └──────────────────┬─────────────────────┘
                                         │ HTTP REST (FastAPI)
                                         ▼
                      ┌────────────────────────────────────────┐
                      │        FastAPI Microservice Engine     │
                      │  - /predict: Multi-model inference     │
                      │  - /explain: Token attributions        │
                      │  - /history & /feedback: Audit logs    │
                      └─────────────┬──────────────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ Classical ML Core│      │ XAI Attribution  │      │ SQLite Audit DB  │
│ - Logistic Regr. │      │ - Centered Log-  │      │ - WAL Mode       │
│ - Linear SVM     │      │   Odds Scoring   │      │ - Inferences &   │
│ - Random Forest  │      │ - Token Weight   │      │   Confidence Log │
│ - Naive Bayes    │      │   Decomposition  │      │ - Feedback Loops │
└──────────────────┘      └──────────────────┘      └──────────────────┘
```

---

## 📂 3. Directory Layout & Module Responsibilities

```
├── api/                                # FastAPI Web Application Layer
│   ├── app.py                          # Application factory, CORS, and lifecycle hooks
│   ├── main.py                         # ASGI entry point
│   ├── routes.py                       # REST API route handlers (/predict, /explain, etc.)
│   └── schemas.py                      # Pydantic v2 validation contracts
│
├── frontend/                           # Client-side Single Page Application
│   ├── src/
│   │   ├── components/                 # UI components (AudioVisualizer, ModelPicker, etc.)
│   │   ├── context/                    # AuthContext (Firebase + Local Storage fallback)
│   │   ├── pages/                      # AssessmentPage, ProfilePage, HistoryPage, etc.
│   │   └── services/                   # Firebase initialization & API clients
│   ├── package.json                    # Frontend dependencies (React 19, Lucide, Vite)
│   └── vite.config.js                  # Vite bundler configuration
│
├── src/                                # Core Engine Logic
│   ├── database/                       # Database models & SQLite session management
│   ├── explainability/                 # Mathematical token attribution algorithms
│   ├── models/                         # ML Model loading, caching & inference abstraction
│   └── utils/                          # Text cleaning & N-gram tokenization
│
├── saved_models/                       # Trained Scikit-Learn Model Binaries & Artifacts
│   ├── best_model/                     # Calibrated default models (.joblib)
│   │   ├── logistic_regression_model.joblib
│   │   ├── tfidf_vectorizer.joblib
│   │   ├── label_encoder.joblib
│   │   └── config.json
│   ├── linear_svm/                     # Linear SVM binary artifacts
│   ├── naive_bayes/                    # Multinomial Naive Bayes binary artifacts
│   ├── random_forest/                  # Random Forest binary artifacts
│   └── model_comparison_summary.json   # Benchmark metrics across all architectures
│
├── tests/                              # Automated Test Suite (pytest)
│   ├── test_api.py                     # API contract & validation tests
│   ├── test_models.py                  # ML inference & pipeline accuracy checks
│   └── test_explainability.py          # Token attribution correctness tests
│
├── data/                               # Embedded Database Directory
│   └── mental_health_xai.db            # SQLite persistent audit store
│
├── README.md                           # Comprehensive documentation & User Guide
├── RESEARCH_PAPER_BENCHMARKS.md        # Academic papers comparison & LaTeX tables
├── TECHSTACK.md                        # Technical stack specification & engineering audit
├── PROJECT_STATUS_AND_AI_HANDOVER.md   # This Handover Manifest
├── requirements.txt                    # Python dependencies
├── run.py                              # Unified Python launcher
└── run.sh                              # Shell script to start both Backend & Frontend
```

---

## 🔬 4. Machine Learning & Dataset Specification

### Clean Dataset & Artifact Policy
- **No Redundant Bloat**: The repository contains verified, lightweight binary model artifacts (`.joblib` files under `saved_models/`, all < 10 MB).
- **Binary & Multiclass Readiness**: The engine handles:
  1. Multi-class classification across 7 clinically validated diagnostic classes: `Normal`, `Depression`, `Suicidal`, `Anxiety`, `Bipolar`, `Stress`, and `Personality disorder`.
  2. Binary classification and thresholding modes (e.g., distress vs. non-distress screening).
- **Self-Contained Training Workbench**: `train_and_experiment.py` includes built-in synthetic dataset generation and preprocessing utilities, allowing autonomous retuning and training without requiring external massive CSV files.

### Benchmark Metrics (Tested Performance)
| Architecture | Accuracy | F1-Score | Latency | Attribution Method |
| :--- | :---: | :---: | :---: | :--- |
| **Logistic Regression (L2)** | **92.4%** | **92.4%** | ~12 ms | Direct centered weight vector |
| **Linear SVM (Calibrated)** | **91.8%** | **91.8%** | ~15 ms | Platt Sigmoid calibrated log-odds |
| **Random Forest (500 Trees)**| **86.5%** | **86.5%** | ~45 ms | Gini impurity & tree contribution |
| **Multinomial Naive Bayes** | **84.2%** | **84.2%** | ~8 ms  | Feature log-probability delta |

---

## 📡 5. Key API Endpoints & Contract for Downstream Systems

Downstream AI systems or microservices can query MindLens using the following standard endpoints:

### `POST /api/v1/predict`
- **Request Body**:
  ```json
  {
    "text": "I feel an overwhelming sense of dread every morning.",
    "model_type": "logistic_regression"
  }
  ```
- **Response**:
  ```json
  {
    "prediction": "Anxiety",
    "confidence": 0.892,
    "class_probabilities": {
      "Anxiety": 0.892,
      "Stress": 0.054,
      "Normal": 0.021,
      "Depression": 0.018,
      "Bipolar": 0.007,
      "Personality disorder": 0.005,
      "Suicidal": 0.003
    },
    "tokens": [
      {"token": "overwhelming", "weight": 1.42},
      {"token": "dread", "weight": 2.15}
    ],
    "model_used": "logistic_regression"
  }
  ```

### `GET /api/v1/health`
Returns system status, active loaded models, and database connectivity.

---

## 🚀 6. Instructions for AI Agents & Developers Taking a Pull

When another AI or developer pulls this repository, perform the following setup:

### Step 1: Virtual Environment & Dependencies
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Step 2: Running Automated Tests
```bash
pytest
```
*All tests should pass, verifying API routes, model inference, and SQLite operations.*

### Step 3: Launching the Platform
```bash
# Option A: Unified Launcher
./run.sh

# Option B: Run Backend Directly
python run.py
# (FastAPI will run on http://127.0.0.1:8000 with Swagger UI at /docs)

# Option C: Run Frontend in Parallel
cd frontend
npm install
npm run dev
# (Vite will serve at http://localhost:5173)
```

---

## 🤝 7. Integration & Extension Opportunities

1. **EHR / Clinical Portal Integration**: Connect `/api/v1/predict` as an asynchronous triage engine for patient intake notes.
2. **LLM RAG Orchestration**: Use the word-level token attribution weights (`tokens`) from the `/explain` endpoint to provide grounded context to conversational LLMs (e.g. Gemini / Claude) for generating empathetic, medically grounded response summaries.
3. **Database Federation**: Export SQLite logs from `data/mental_health_xai.db` to enterprise PostgreSQL or BigQuery instances using standard ETL pipelines.
