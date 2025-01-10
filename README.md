
---

# Personal Finance Manager

## Overview

This is a personal finance manager system that helps users track their income, expenses, savings goals, and generate monthly/yearly reports. The system allows users to manage their finances by adding transactions, categorizing them, and tracking their progress towards savings goals.

### Features:

- **User Management:** Users can register, login, and manage their profiles (name, email, etc.).
- **Transaction Management:** Users can add, view, update, and delete financial transactions with details like amount, date, category, and description.
- **Category Management:** Users can create and manage custom categories for transactions.
- **Savings Goals:** Users can set savings goals with a target amount and date. The system tracks progress towards the goal.
- **Reports:** Monthly and yearly reports showing income, expenses, and savings, including visual representations like pie charts and bar graphs.
- **Data Persistence:** All user data, transactions, categories, and savings goals are stored in a MongoDB database.

**Important Note:**  
The system is designed to run MongoDB locally, meaning you need to set up a local MongoDB instance (on port `27017`). The database is configured to use a `syfe` database, and a `sessions` collection will be used to store session data.

### Tech Stack:

- **Backend:** Node.js, Express
- **Frontend:** EJS templates
- **Database:** MongoDB
- **Charting:** Chart.js for visual reports

## Setup Instructions

### Prerequisites

Before starting the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14.x or higher)
- [MongoDB](https://www.mongodb.com/) (Local MongoDB instance)

### Installation

1. **Clone the repository:**

   ```bash
     git clone https://github.com/Rajvardhan2002/Syfe-Intern-Assignment.git
   ```

2. **Navigate to the project folder:**

   ```bash
   cd personal-finance-manager
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **MongoDB Setup:**

   - **Run MongoDB locally:** The system is configured to use a local MongoDB instance on the default port `27017`.
   - You must ensure that MongoDB is running on your machine.
     - If MongoDB is not running, you can start it by running:
       ```bash
       mongod
       ```
   - The application connects to a database called `syfe` in your local MongoDB instance. Make sure the database exists, or it will be created automatically.
   - **Sessions Configuration:** The application uses the `sessions` collection in MongoDB to store session data. Ensure your MongoDB instance is set up to handle this.

5. **Run the application:**

   ```bash
   npm start
   ```

   This will start the application on [http://localhost:3000](http://localhost:3000).

6. **Login Credentials for Test User:**

   - **Email:** `test01@gmail.com`
   - **Password:** `123456789`

   Use these credentials to log in and test the application.

### Assumptions

- MongoDB is running locally, and the database `syfe` is accessible.
- The application does not rely on any `.env` file for configuration (MongoDB connection is hardcoded).
- The `sessions` collection is created automatically in MongoDB for session handling.
- The savings goal progress calculation is not implemented in this version, so it will not calculate the progress towards savings goals.

---

### Sidebar Navigation

Once logged in, you'll see a sidebar that allows you to access different sections of the application:

- **Categories:** View and manage your transaction categories.
- **Transactions:** Add, view, update, and delete transactions.
- **Saving Goals:** Set and manage your savings goals.
- **Track Income:** Add and view your monthly income.
- **Reports:** Generate and view monthly and yearly financial reports.

---

### Sample Test Cases

To test the basic functionalities, here are some sample test cases you can run:

1. **User Registration:**

   - **Input:** New user details (name, email, password).
   - **Expected Outcome:** New user is created, and a profile is associated with the account.

2. **User Login:**

   - **Input:** Email (`test01@gmail.com`), Password (`123456789`).
   - **Expected Outcome:** User logs in successfully and is redirected to the dashboard.

3. **Transaction Management:**

   - **Input:** Add a transaction (amount: 1000, date: 2025-01-01, category: Food, description: Groceries).
   - **Expected Outcome:** The transaction is added and stored in the database.

4. **Category Management:**

   - **Input:** Add a new category (e.g., Entertainment).
   - **Expected Outcome:** New category is created and displayed in the list of categories.

5. **Savings Goal Management:**

   - **Input:** Set a savings goal (target amount: 5000, target date: 2025-12-31).
   - **Expected Outcome:** Savings goal is created.

6. **Reports:**
   - **Input:** Generate a monthly or yearly report.
   - **Expected Outcome:** A report is generated with a bar chart showing income, expenses, and balance.

---

### Notes

- **Session Management:** The system uses MongoDB to store session data. Ensure MongoDB is running locally to handle the session management.
- **Savings Goal Progress:** The calculation for the progress towards savings goals is not yet implemented.

---
