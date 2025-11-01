# ☁️ Phase 2 – Cloud Dashboard Development

## 🧭 Quick Summary

**Goal:**  
Deploy the Phase 1 Azure Function to the cloud, connect it to a frontend dashboard, and visualize analysis results using real Azure services.

**Team Roles:**
| Role | Focus |
|------|--------|
| 🛰 **Azure Operator** | Handles all Azure setup: Function, Storage, Static Web App |
| 💻 **Frontend Developer** | Connects the frontend dashboard to the Azure Function API |
| 🧾 **Documentation Lead** | Draws architecture, compiles screenshots, writes the final PDF |

**Deliverables:**

- ✅ Azure Function URL
- ✅ Dashboard (Static Web App) URL
- ✅ GitHub repository (frontend + backend + docs)
- ✅ PDF report with architecture, services, and screenshots

**Rubric Coverage:**
Deployment · Dashboard · Visualization · Integration · Cloud Practices · Documentation  
→ **100% covered through shared roles**

---

## 📘 Detailed Plan

### 🛰 Azure Operator – Cloud Deployment & Integration

**Main Tasks:**

1. Create one **Resource Group** (`diet-analysis-rg`)
2. Deploy:
   - Azure **Storage Account** (upload dataset)
   - Azure **Function App** (HTTP trigger returning JSON)
   - Azure **Static Web App** (hosts frontend)
3. Configure environment variables in Azure Portal:
   - `AzureWebJobsStorage`
   - any custom dataset/connection strings
4. Enable **CORS** for:
   - `http://localhost:3000` (local testing)
   - the Static Web App URL (production)
5. Publish both backend and frontend to Azure  
   → ensure dashboard can fetch live JSON data

**Screenshots to Collect:**

- Resource Group overview
- Storage container view
- Function App overview
- Postman/Browser Function test
- Function CORS settings
- Static Web App overview

**PDF Sections:**

- Azure Services Used
- Function Deployment Process
- Integration Notes (backend ↔ frontend)

---

### 💻 Frontend Developer – Dashboard Visualization

**Main Tasks:**

1. Use provided **frontend starter code**
2. Connect API endpoint:
   ```js
   export const FUNCTION_URL =
     "https://<your-function>.azurewebsites.net/api/<endpoint>";
   ```
3. Implement:
   - 3 visualizations (bar, line, pie)
   - Refresh or filter controls
   - Metadata display (`executedAt`, `durationMs`)
4. Test locally, then confirm online fetch after A’s deployment

**Screenshots to Collect:**

- Dashboard overview
- Each chart type (bar/line/pie)
- Browser console (fetch success)
- Interaction (refresh/filter button)

**PDF Sections:**

- Dashboard Development & Visualization
- Integration Notes
- Challenges & Solutions (frontend part)

---

### 🧾 Documentation Lead – Architecture & Report

**Main Tasks:**

1. Draw **architecture diagram** and **data flow chart**
2. Collect all screenshots and compile `docs/report.pdf`
3. Write and format report sections:
   - Introduction (Phase 1 → 2 transition)
   - System Architecture Overview
   - Integration & Cloud Interaction
   - Challenges & Solutions
   - Conclusion & Future Work
4. Add Function URL, SWA URL, and GitHub repo links

**Screenshots to Collect:**

- Architecture diagram
- Data flow/workflow chart
- Final dashboard online view
- GitHub repo overview
- Report cover page

**PDF Table of Contents Example:**

1. Introduction
2. System Architecture Overview
3. Azure Services Used
4. Function Deployment Process
5. Dashboard & Visualization
6. Integration & Cloud Interaction
7. Challenges & Solutions
8. Conclusion & Future Work

---

### 🧱 Deliverable Checklist

| Deliverable            | Description                         | Responsible        |
| ---------------------- | ----------------------------------- | ------------------ |
| **Azure Function URL** | Backend API endpoint                | Azure Operator     |
| **Static Web App URL** | Public dashboard                    | Azure Operator     |
| **GitHub Repository**  | Source code + documentation         | Documentation Lead |
| **Report (PDF)**       | Full documentation with screenshots | Documentation Lead |

---

### 🧩 Screenshot Summary

| Category     | File Examples                                                                                         |
| ------------ | ----------------------------------------------------------------------------------------------------- |
| **Azure**    | `RG-Overview.png`, `Storage-Container.png`, `Function-App.png`, `CORS-Config.png`, `SWA-Overview.png` |
| **Frontend** | `Dashboard-Overview.png`, `Chart-Bar.png`, `Chart-Line.png`, `Chart-Pie.png`, `Fetch-Console.png`     |
| **Docs**     | `Architecture-Diagram.png`, `Workflow.png`, `Final-Dashboard.png`, `GitHub-Repo.png`, `PDF-Cover.png` |

---

### ✅ Grading Rubric Alignment

| Rubric Category             | Covered By                                |
| --------------------------- | ----------------------------------------- |
| **Deployment (20)**         | Azure Operator – full Azure setup         |
| **Frontend Dashboard (20)** | Frontend Developer – dashboard UI         |
| **Data Visualization (20)** | Frontend Developer – 3 chart types        |
| **Integration (20)**        | Azure Operator + Frontend Developer       |
| **Cloud Practices (10)**    | Azure Operator – env vars, CORS           |
| **Documentation (10)**      | Documentation Lead – PDF with screenshots |
