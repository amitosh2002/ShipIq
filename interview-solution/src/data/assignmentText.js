export const API_EXPLORER_ASSIGNMENT = `
#  Software Engineering Internship
## Live Coding Challenge – API Explorer & Monitoring Tool

**Duration:** 40 - 60 Minutes  
**Difficulty:** Advanced  
**AI Usage:** ✅ Allowed (must explain architecture and decisions)

---

## 🏢 Background

 our engineering team uses several internal services that continuously generate live operational data such as application logs, deployments, notifications, and project activities.

To help developers debug and analyze these services, we need a lightweight **API Explorer & Monitoring Tool** (similar to Postman or Datadog). This tool must execute requests against these services, catch any API failures, store the responses, and allow users to view their query history.

Your task is to build this Full-Stack developer tool.

---

## 🌐 The Interview API

You will hit our Mock Internal API (e.g., \`https://shipiq-backend-service.onrender.com\`).

> **Real-World API Instability**  
> This API is designed to mimic real-world microservices under heavy load. **37% of all requests will encounter edge cases.** Your application must gracefully handle:
> - **10% chance to HANG:** The API will hang for 20s. You must implement UI timeouts and request cancellations.
> - **20% chance to FAIL:** The API returns random HTTP errors (500, 502, 401, 403, 429).
> - **5% chance of EMPTY STATE:** The API succeeds (\`200 OK\`) but returns no data \`[]\`.
> - **2% chance of MALFORMED JSON:** The API returns broken JSON that might crash your parser.

### Core Endpoints

#### 1. API Discovery (Metadata)
\`\`\`http
GET /metadata
\`\`\`
Instead of hardcoding your frontend forms, you **must** call this endpoint on load to dynamically build your API request UI. It returns a schema of all available endpoints, their HTTP methods (\`GET\`, \`POST\`, \`PUT\`, \`DELETE\`), and their required parameters.

#### 2. Data Retrieval (GET)
Supports query parameters (e.g. \`?count=10&level=ERROR\`).
- \`GET /logs\`
- \`GET /deployments\`
- \`GET /notifications\`
- \`GET /projects\`

#### 3. Data Mutation (POST, PUT, DELETE)
Supports sending data in the request body or URL params.
- **Advanced Search:** \`POST /search\` (requires \`{ "resource": "logs" }\` in JSON body)
- **Update Record:** \`PUT /projects/:id\` (requires \`{ "status": "COMPLETED" }\` in JSON body)
- **Delete Record:** \`DELETE /logs/:id\`

---

## 🎯 Objective & Requirements

You must build a Full Stack application (Frontend + Backend Proxy/Logger) that allows users to:

1. **Browse available APIs:** Dynamically render forms based on \`/metadata\`.
2. **Execute Requests:** Support all HTTP methods (\`GET\`, \`POST\`, \`PUT\`, \`DELETE\`).
3. **Handle Edge Cases:** Catch timeouts, standard errors (400, 500, 429), and malformed JSON cleanly in the UI.
4. **Log & Save Responses:** Your backend must intercept these responses (both successes and failures), segregate them, and save them to a database as a "Report".
5. **View History:** Provide a separate "History" page in your UI that queries your backend to show a log of all past API requests made.

### Technical Requirements
- **Backend:** Express.js, REST APIs, Modular architecture.
- **Frontend:** React, Component-based architecture.
- **Storage:** In-memory array, SQLite, or a JSON File.

---

## 📊 Evaluation Criteria

| Category | Marks |
| :--- | :--- |
| **Dynamic Frontend** (No hardcoded forms) | 20 |
| **Edge Case Handling** (Timeouts, 500s, Bad JSON) | 20 |
| **Backend API Design & Proxying** | 20 |
| **Database Storage & Segregation** | 15 |
| **Code Quality & Architecture** | 10 |
| **Validation Handling** (400 Bad Requests) | 5 |
| **Communication & Architecture Explanation** | 10 |
| **Total** | **100** |

---

## 🗣️ Discussion Round
After coding, be prepared to discuss:
1. Why did you structure your backend this way?
2. How would you store millions of logs in a production environment?
3. How did you handle the API instability (timeouts/malformed JSON)?
4. How would you implement authentication (Bearer/API Key) for this tool?
`;

export const QA_TESTING_ASSIGNMENT = `
# API Explorer & Monitoring Tool – QA & Testing Challenge

**Version:** 2.0  
**Duration:** 40 – 60 Minutes Coding + 15 Minutes Discussion  
**Difficulty:** Advanced  
**AI Usage:** ✅ Allowed (Candidate must explain architecture and technical decisions)

---

## 🏢 Background
Engineering teams use several internal microservices that continuously generate live operational data (e.g., application logs, deployments, notifications, and project activities). To help developers debug and analyze these services, candidates are asked to build a lightweight, full-stack API Explorer & Monitoring Tool (similar to Postman or Datadog). This tool executes requests against internal microservices, handles real-world service instability, logs and segregates responses on a backend service, and provides a UI to explore query history.

---

## 🌐 Interviewer API Specification & Setup Guide

Interviewers must provide or deploy the mock API backend using the following base URL or local instance:
- **Live Production Mock URL:** \`https://shipiq-backend-service.onrender.com\`
- **Local Instance URL:** \`http://localhost:3000\`

> **⚠️ Real-World API Instability Simulation Rules**  
> To evaluate edge-case resilience, **37% of all requests** to the mock service must emulate chaos engineering behavior:
> - **10% chance to HANG:** Request stalls for 20 seconds. *(Candidate must implement client-side timeouts / AbortController).*
> - **20% chance to FAIL:** API returns random HTTP error status codes (500 Internal Server Error, 502 Bad Gateway, 401 Unauthorized, 403 Forbidden, 429 Too Many Requests).
> - **5% chance of EMPTY STATE:** API returns \`200 OK\` with an empty payload (\`[]\` or \`{}\`).
> - **2% chance of MALFORMED JSON:** API returns unparseable/corrupted JSON string.

---

## 📋 Endpoint Reference & Mock Schema

### 1. API Discovery (Metadata)
\`\`\`http
GET /metadata
\`\`\`
Returns the complete JSON schema detailing available endpoints, HTTP methods, required query parameters, and JSON request body parameters. Candidates must use this payload to build their UI forms dynamically without hardcoding.

### 2. Data Retrieval (GET)
**Application Logs**
- \`GET /logs\`
- \`count\` (number) – Default: 50
- \`level\` (select) – Options: INFO, WARN, ERROR, DEBUG
- \`service\` (string) – e.g., auth-service, payment-service, core-api
- *Example:* \`/logs?count=10&level=DEBUG&service=auth-service\`

**Deployment Records**
- \`GET /deployments\`
- \`count\` (number) – Default: 20
- \`status\` (select) – Options: SUCCESS, FAILED, IN_PROGRESS, PENDING
- *Example:* \`/deployments?count=5&status=FAILED\`

**Notification Events**
- \`GET /notifications\`
- \`count\` (number) – Default: 30
- \`type\` (select) – Options: EMAIL, SMS, PUSH, WEBHOOK
- *Example:* \`/notifications?count=100&type=WEBHOOK\`

**Project Activities**
- \`GET /projects\`
- \`count\` (number) – Default: 15
- \`status\` (select) – Options: ACTIVE, ARCHIVED, PLANNING, COMPLETED
- *Example:* \`/projects?count=3&status=ARCHIVED\`

### 3. Data Mutation & Advanced Search (POST, PUT, DELETE)

**Advanced Search**
- \`POST /search\`
- Content-Type: application/json
- \`resource\` (REQUIRED string) – Options: logs, deployments, notifications, projects
- \`count\` (number)
- Resource-specific filters (e.g., level, status, service, type)

*Example Body:*
\`\`\`json
{
  "resource": "logs",
  "count": 25,
  "level": "WARN"
}
\`\`\`

**Update Project Status**
- \`PUT /projects/:id\`
- Content-Type: application/json
- *Example URL:* \`/projects/proj-102\`
- *Example Body:*
\`\`\`json
{
  "status": "COMPLETED"
}
\`\`\`

**Delete Log Entry**
- \`DELETE /logs/:id\`
- *Example URL:* \`/logs/log-8841\`

---

## 🎯 Candidate Functional & Technical Requirements

Candidates must construct a Full-Stack application consisting of a React Frontend and an Express.js Proxy/Logger Backend with local persistence (In-Memory, SQLite, or JSON File storage).

1. **Dynamic Form Generation:** Query \`/metadata\` on application launch to dynamically generate UI controls (methods, endpoints, query fields, and body fields).
2. **Full HTTP Method Support:** Support GET, POST, PUT, and DELETE invocations.
3. **Resilient Client-Side Handling:** Intercept and handle timeout cancellations, HTTP error states (4xx, 5xx), empty data payloads, and malformed JSON syntax.
4. **Response Segregation & Backend Persistence:** Intercept every outbound request/response in the candidate's backend, categorize responses (Success, Client Error, Server Error, Timeout, Parsing Failure), and store them.
5. **Audit Trail / Request History View:** Provide a dedicated UI view displaying historically executed requests, response times, status codes, and stored payloads.
6. **Smoke Test & Audit Report:** 
   - Develop a script to run a 3-5 minute automated smoke test against the endpoints.
   - Capture all responses and generate a comprehensive **Audit Report**.
   - The report must segregate results into **Success** and **Failure** sections.
   - For each request, the report must include the following columns: *HTTP Method, Endpoint, Status Code, Response Time, Expected Response, and Actual Response*.
   - Based on the audit failures, the candidate must file formal bug reports detailing the issues encountered.
`;

export const GITHUB_PR_ASSIGNMENT = `
# 40 min Challenge
**Version:** 1.0  
**Duration:** 40 Minutes Coding + 15 Minutes Discussion  
**AI Usage:** ✅ Allowed

---

## 🎯 Objective
This challenge evaluates a candidate's ability to:
- Build a real-world feature
- Read and integrate third-party APIs
- Design reusable components
- Work effectively with AI tools
- Debug and explain generated code
- Adapt to changing product requirements

The goal is not to evaluate whether a candidate can memorize syntax, but whether they can build production-quality features and explain their implementation.

---

## 💻 Challenge: GitHub Pull Request Explorer
Build a small web application that displays GitHub Pull Requests for a repository and allows users to explore them using dynamic filters.

### APIs
You will use our **Mock GitHub API** which perfectly replicates the real GitHub API responses (but doesn't require a real token or hit rate limits).

The interviewer will provide:
- **Repository Owner** (e.g., \`hora-hq\`)
- **Repository Name** (e.g., \`core-api\`)
- **GitHub Personal Access Token** (Any string will work for the mock)

**Required Endpoints:**
1. \`GET /repos/{owner}/{repo}\`
2. \`GET /repos/{owner}/{repo}/pulls\`

*(Note: You must pass the token as an \`Authorization: Bearer <token>\` header.)*

---

## 📋 Functional Requirements

### 1. Repository Summary
Display the following information:
- Repository Name
- Description
- Stars
- Forks
- Open Issues

### 2. Pull Request List
Display a table containing:
- Title
- Author
- State
- Created Date

### 3. Search
Users should be able to search Pull Requests by:
- Title
- Author

### 4. Dynamic Filter Builder
Users should be able to create one or more filters. Each filter is combined using AND logic.
*Example: Status = OPEN AND Author contains Amit (+ Add Filter)*

**Supported Fields:** Status, Author
**Supported Operators:** 
- For Status: Equals
- For Author: Equals, Contains

### 5. Clear Filters
Provide an option to clear all applied filters.

### 6. Loading & Error States
The application should handle:
- API loading
- Failed requests (Our mock API has a built-in failure rate to test your error handling!)
- Empty results

---

## 🌟 Bonus Features (Optional)
- Sort by Created Date
- Sort by Author
- Display total Pull Requests
- Display Open vs Closed count
- Responsive layout
- Pagination

---

## 🔄 Product Change (Introduced During Interview)
Approximately 20 minutes into the interview, the interviewer will introduce an additional requirement. Example:
- Add a Repository filter, OR
- Add support for filtering Draft Pull Requests.

Candidates are expected to adapt their implementation accordingly. The objective is to evaluate extensibility rather than speed.
`;
