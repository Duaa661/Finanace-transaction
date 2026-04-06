#  Finance Data Processing and Access Control Backend

##  Overview

This project is a backend system for a **Finance Dashboard** that allows users to manage financial records, perform transactions, and view summary analytics based on their roles.

The system is designed with a focus on:

* Clean API structure
* Role-based access control
* Proper data modeling
* Scalable backend logic

---

##  Features

###  Authentication

* User Registration
* User Login
* JWT-based Authentication
* Secure Logout with Token Blacklisting

---

###  Role-Based Access Control

The system supports three roles:

* **Viewer**

  * Can view financial records and dashboard data

* **Analyst**

  * Can view records and access analytics

* **Admin**

  * Full access (create, update, delete records)

Access control is implemented using middleware.

---

###  Financial Records Management

Users can manage financial records with the following fields:

* Amount
* Type (INCOME / EXPENSE)
* Category
* Date
* Notes

#### APIs:

* `POST /api/records` → Create record (Admin)
* `GET /api/records` → Get all records (with filters)
* `PUT /api/records/:id` → Update record (Admin)
* `DELETE /api/records/:id` → Delete record (Admin)

#### Filtering:

* By type → `?type=INCOME`
* By category → `?category=Food`

---

###  Dashboard Summary

Provides aggregated financial insights:

#### API:

* `GET /api/dashboard/summary`

#### Response:

* Total Income
* Total Expense
* Net Balance
* Category-wise totals
* Recent Transactions

---

###  Account & Transaction System (Advanced Feature)

* Account creation and management
* Ledger-based balance calculation
* Secure transaction handling with idempotency
* Email notifications for transactions

---

###  Email Notifications

* Welcome email on registration
* Transaction success email
* Transaction failure email

---

##  Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB (Mongoose)**
* **JWT Authentication**
* **Nodemailer (OAuth2 Gmail)**

---

##  Project Structure

```
/controllers
/models
/routes
/middlewares
/services
app.js
```

---

##  Installation & Setup

### 1. Clone the repository

```
git clone <your-repo-url>
cd project-folder
```

### 2. Install dependencies

```
npm install
```

### 3. Setup Environment Variables

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret

EMAIL_USER=your_email
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
REFRESH_TOKEN=your_refresh_token
ACCESS_TOKEN=your_access_token
```

---

### 4. Run the server

```
npm start
```

---

##  Security Features

* JWT Authentication
* Token Blacklisting
* Role-based Authorization
* Input validation
* Protected routes

---

##  Assumptions

* Users are assigned roles at registration
* Only Admin can modify records
* Transactions require valid account ownership
* MongoDB is used as the primary database

---

##  Testing

You can test APIs using:

* Postman
* Thunder Client

---

##  Future Improvements

* Pagination & sorting
* Advanced analytics using MongoDB aggregation
* Unit & integration testing
* API documentation with Swagger

##  Author

Developed as part of a backend assignment to demonstrate:

* API Design
* Data Modeling
* Access Control
* Backend Architecture
