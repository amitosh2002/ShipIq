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
6. **Postman-like API Tester:** Create a dedicated page acting like Postman where users can construct requests, test the API, and automatically store the results.
   - Provide a UI with a URL input bar and a dropdown for HTTP methods (GET, POST, PUT, DELETE).
   - Include dynamic inputs for Headers, Query Parameters, and a text area for a JSON Request Body.
   - Display the JSON Response payload, HTTP Status Code, and Response Time in a dedicated panel.
   - Automatically intercept and save the executed request (along with its success/failure state) to the database.
7. **Database Query Interface:** Build a page where users can write custom queries to fetch and analyze the stored API response data directly from their database.
   - Provide a UI (like a mini-SQL editor or a structured filter builder) to search the stored logs.
   - *Example Use Case:* Write a query to fetch all failed requests (Status > 399) or requests that took longer than 2000ms.
   - Render the database query results in a clean table or dashboard view for analysis.

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

**Base URL:** Use the same Mock API URL (e.g., \`https://shipiq-backend-service.onrender.com\` or \`http://localhost:3000\`).

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

### 7. Postman-like API Tester
Create a dedicated page acting like Postman where users can construct requests, test the GitHub Mock API, and automatically store the results.
- Provide a UI with a URL input bar and a dropdown for HTTP methods (GET, POST, etc.).
- Include dynamic inputs for Headers (e.g., Authorization), Query Parameters, and a text area for a JSON Request Body.
- Display the JSON Response payload, HTTP Status Code, and Response Time in a dedicated panel.
- Automatically intercept and save the executed request (along with its success/failure state) to the database.

### 8. Database Query Interface
Build a page where users can write custom queries to fetch and analyze the stored API response data directly from their database.
- Provide a UI (like a mini-SQL editor or a structured filter builder) to search the stored logs.
- *Example Use Case:* Write a query to fetch all failed requests (Status > 399) or requests that took longer than 2000ms.
- Render the database query results in a clean table or dashboard view for analysis.

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
};

export const SERVER_MONITORING_ASSIGNMENT = `
# 45 min Challenge
**Version:** 1.0  
**Duration:** 45 Minutes Coding + 15 Minutes Discussion  
**AI Usage:** ✅ Allowed

---

## 🎯 Objective
Build a Real-time Server Monitoring Dashboard that tests a candidate's ability to handle asynchronous polling, complex state management, and real-world API instability.

---

## 💻 Challenge: Server Monitoring Dashboard
You need to build a dashboard that tracks the health of our internal microservices. The application should continuously fetch live server logs and deployment statuses.

### APIs
You will use our **Mock Internal API** which perfectly replicates a production environment under heavy load.

**Base URL:** Use the Mock API URL (e.g., \`https://shipiq-backend-service.onrender.com\` or \`http://localhost:3000\`).

> **⚠️ Real-World API Instability Simulation**  
> 37% of all requests will encounter edge cases:
> - **10% chance to HANG:** The API hangs for 20s.
> - **20% chance to FAIL:** The API returns random HTTP errors (500, 502, 429).
> - **5% chance of EMPTY STATE:** The API returns \`200 OK\` but no data.
> - **2% chance of MALFORMED JSON:** Broken JSON that crashes parsers.

**Required Endpoints:**
1. \`GET /logs?count=100\`
2. \`GET /deployments?count=5\`

---

## 📋 Functional Requirements

### 1. Live Data Polling
- Poll the \`/logs\` endpoint every 10 seconds.
- Poll the \`/deployments\` endpoint every 30 seconds.

### 2. Dashboard UI
- **Log Analytics:** Display the total count of \`ERROR\` vs \`INFO\` logs in a visual format (progress bar, simple chart, or stat cards).
- **Recent Deployments:** Show a list of the 5 most recent deployments and their statuses (SUCCESS, FAILED, IN_PROGRESS).
- **Service Health Indicator:** Show an overall "System Status" (Healthy if the last API call succeeded, Degraded if it failed or timed out).

### 3. Edge Case Handling
- **Timeouts:** If a request hangs, cancel it after 5 seconds and display a non-intrusive warning.
- **Failures:** Do not crash the application when the API returns a 500 or malformed JSON. Keep displaying the last known good data.

---

## 🔄 Product Change (Introduced During Interview)
Approximately 20 minutes into the interview, the interviewer will introduce one of the following requirements:
1. **Exponential Backoff:** "When the API fails, stop polling every 10s. Instead, increase the delay to 20s, then 40s, up to a maximum of 2 minutes, until it succeeds again."
2. **Tab Visibility Check:** "Stop polling when the user switches away from the browser tab to save bandwidth."

The objective is to see how easily they can modify their setInterval logic.
\`;

export const NOTIFICATION_CENTER_ASSIGNMENT = \`
# 45 min Challenge
**Version:** 1.0  
**Duration:** 45 Minutes Coding + 15 Minutes Discussion  
**AI Usage:** ✅ Allowed

---

## 🎯 Objective
Build a dynamic Notification Center component to test a candidate's ability to handle optimistic UI updates, data mutation, and graceful error recovery.

---

## 💻 Challenge: Interactive Notification Center
Build a dropdown notification feed (similar to the GitHub or Facebook bell icon) that lets users view and manage their alerts.

### APIs
You will use our **Mock Internal API**.

**Base URL:** Use the Mock API URL (e.g., \`https://shipiq-backend-service.onrender.com\` or \`http://localhost:3000\`).

> **⚠️ API Instability**  
> As always, expect 37% of requests to fail, hang, or return corrupted data.

**Required Endpoints:**
1. \`GET /notifications?count=20\`
2. \`PUT /projects/:id\` (We will repurpose this as a mock "Mark as Read" endpoint for notifications)

---

## 📋 Functional Requirements

### 1. Notification Feed
- Display a "Bell" icon with an unread badge counter.
- Clicking the bell opens a popover/dropdown showing the latest notifications.
- Differentiate read vs unread notifications visually.

### 2. Optimistic UI Updates
- When a user clicks a notification to "Mark as Read", immediately update the UI (reduce the unread count, change the style).
- Make a \`PUT\` request to the API in the background.
- **Crucial:** Because our API randomly fails 20% of the time, if the \`PUT\` request fails, you must **revert** the UI back to its previous unread state and show a toast error message.

### 3. Empty States & Loading
- Show a skeleton loader while initially fetching.
- Handle the 5% chance where the API returns an empty array perfectly.

---

## 🔄 Product Change (Introduced During Interview)
Midway through the interview, the interviewer will ask the candidate to add:
- **"Mark All as Read" Button:** This should optimistically update all items at once, but if the bulk API call fails, revert the entire list back to its exact previous state.
\`;
