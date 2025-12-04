# Authentication Implementation Guide

_(This version is written directly for the teammate who will implement authentication.)_

## Overview

Welcome! This guide explains exactly what you need to implement the authentication system for our Dashboard Project. It is written for you as the developer who will be building the login, registration, OAuth flow, and secure user database.

You already have the necessary Azure permissions to work on:

- The **Function App** (backend)
- The **Storage Account – Table Storage** (user database)

This README tells you what to build, how the system works, and which Azure resources you will use.

---

## 1. Project Architecture Overview

### Frontend

- Hosted on **Azure Static Web App**
- Communicates with backend via API base URL:

```
VITE_API_BASE_URL=https://nutritionalinsightssecondver-egfggebfbnameubc.westus-01.azurewebsites.net
```

### Backend

- Runs on **Azure Function App**
- Stores user profiles in **Azure Storage Account (Table Storage)**
- Authentication logic is implemented here

---

## 2. Authentication Requirements

- Email + Password login
- At least one OAuth provider (Google, GitHub, LinkedIn)
- Store **hashed password + salt** (never raw passwords)
- Data must be encrypted at rest (Azure Storage handles this automatically)
- Dashboard should only be visible after login
- Display logged-in user's name and provide a logout option

---

## 3. Backend Authentication Endpoints (Azure Functions)

### 1. Register

```
POST /api/auth/register
```

Backend tasks:

- Validate input
- Generate salt
- Hash password
- Insert user record into Table Storage

Example record:

```
PartitionKey: "USER"
RowKey: <GUID>
Email: user@example.com
PasswordHash: <hash>
Salt: <salt>
Name: <name>
CreatedAt: <timestamp>
```

---

### 2. Login

```
POST /api/auth/login
```

Flow:

- Find user by email
- Hash incoming password + stored salt
- Compare with stored hash
- If valid, return JWT token containing userId, name, and email

---

### 3. OAuth Login

```
POST /api/auth/oauth-login
```

Flow:

1. Frontend processes OAuth callback
2. Sends profile to backend
3. Backend creates user if needed and issues JWT

---

## 4. User Database (Azure Table Storage)

Recommended table name:

```
Users
```

Azure Storage provides encryption at rest, meeting the security requirement.
Each row represents one user profile.

---

## 5. Backend Configuration (Function App → Configuration)

Add the following values:

```
JWT_SECRET=<random-secret-key>
USERS_TABLE_NAME=Users
AzureWebJobsStorage=<connection-string>
```

---

## 6. Securing Dashboard APIs

Protected endpoints (e.g., `GET /api/get-insights`) must:

- Read the `Authorization: Bearer <token>` header
- Verify JWT
- Reject requests without valid tokens

---

## 7. Required Azure Permissions

You have been granted two specific Azure roles. These give you everything needed to build authentication, without exposing the entire resource group.

### ✅ Function App — **Contributor**

This allows you to:

- Deploy backend authentication code
- Modify environment variables (JWT secret, table name, etc.)
- Restart and debug the Function App
- View logs

### ✅ Storage Account — **Storage Table Data Contributor**

This role gives you full access to work with **Table Storage**, which we are using as our user database.
You can:

- Create the `Users` table
- Insert user records during registration
- Query users during login
- Update or delete user records

**Important:** This is the correct and minimal set of permissions needed to implement authentication. You do _not_ need resource group–level access.

---

## 8. Frontend Integration

- Store token in localStorage:

```
localStorage.setItem("token", jwt);
```

- Attach token to backend API calls:

```
Authorization: Bearer <token>
```

- Redirect to login if token is missing
- Display user's name and provide logout functionality

---

## 9. Development Workflow

1. Pull backend project
2. Implement register/login/OAuth endpoints
3. Test locally using:

```
func start
```

4. Deploy backend:

```
func azure functionapp publish <FUNCTION_APP_NAME>
```

5. Configure environment variables
6. Deploy frontend
7. Perform integration testing

---

## 10. Summary of Responsibilities

- Implement secure backend authentication
- Store hashed passwords with unique salts
- Issue and validate JWTs
- Integrate authentication into frontend workflow
- Use Azure Table Storage as the user database
- Operate with the required roles:

  - Function App: Contributor
  - Storage Account: Storage Table Data Contributor
