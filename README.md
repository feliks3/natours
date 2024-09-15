# Finance Application Management Backend

This is the backend service for managing finance applications, built using Node.js, Express, and MongoDB. It provides APIs for user authentication, managing applications, and supports JWT-based authentication.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)

## Overview

This backend application is designed to manage finance applications, providing endpoints for creating, reading, updating, and deleting (CRUD) finance application records. It also includes user authentication endpoints for registration and login.

## Features

- User registration and login using JWT
- CRUD operations for finance applications
- Middleware for authentication
- Logging with Winston
- API documentation using Swagger

## Technologies Used

- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Logging**: Winston
- **Testing**: Jest, Supertest
- **API Documentation**: Swagger

## Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js**
- **npm**
- **MongoDB**

### Steps

1.  **Clone the Repository**:

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install Dependencies**:

    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a .env file in the root directory with the following content:

    ```bash
    MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>
    JWT_SECRET=<your_jwt_secret_key>
    PORT=8000
    API_URL=http://localhost:8001
    ```

    Replace placeholders (`<username>`, `<password>`, `<cluster-url>`, `<database-name>`, and `<your_jwt_secret_key>`) with your actual credentials and values.

## Running the Application

To run the application in development mode:

```bash
npm start
```

The server will run by default at http://localhost:8000.

## Running Tests

To run tests for the application:

```bash
npm test
```

This will execute all test files using Jest.

## Deployment

### Build the Application

No specific build step is required for this Node.js backend application. Ensure all dependencies are installed and the application is configured correctly for the production environment.

### Deploy the Application

Deploy the backend to a cloud service or server like AWS.

### Start the Application in Production Mode

On your server or cloud service, start the application using:

```bash
NODE_ENV=production npm start
```

## Environment Variables

- `MONGO_URI`: The MongoDB connection string.
- `JWT_SECRET`: Secret key for JWT authentication.
- `PORT`: The port on which the server will run.
- `API_URL`: The base URL for API documentation.

## API Documentation

The API is documented using Swagger and is accessible at:

```bash
http://localhost:8000/api-docs
```
