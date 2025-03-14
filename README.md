# 4T-Store E-commerce Platform

## Overview

4T-Store is a full-featured e-commerce web application built using modern web technologies. The project consists of two integrated systems:

1. **Main System**: A comprehensive e-commerce application with product catalog management, shopping cart functionality, checkout process, statistical reporting, and complete CRUD operations. It offers separate interfaces for customers and administrators.

2. **Payment System**: A secure transaction processing system that manages user accounts, payment processing, and transaction record-keeping between users and the main system.

## 📋 Features

### Main System Features

-   **Store Front**: Intuitive product browsing, filtering, and search capabilities
-   **User Authentication**: Local login, Google and Facebook OAuth integration
-   **Shopping Experience**: Cart management, checkout process, and order history
-   **Admin Dashboard**: Sales analytics, order management, and inventory control
-   **Product Management**: Complete CRUD operations for products and categories
-   **User Management**: User accounts administration with role-based access control
-   **MVC Architecture**: Well-structured codebase following MVC design patterns
-   **Responsive Design**: Mobile-friendly interface built with Bootstrap
-   **AJAX Integration**: Asynchronous requests for a smoother user experience
-   **API Integration**: WebAPI connection to the payment system

### Payment System Features

-   **User Accounts**: Account creation and balance management
-   **Secure Transactions**: SSL-secured transfer from user accounts to the main system
-   **Automatic Account Creation**: Accounts created for new users during signup
-   **Transaction Reconciliation**: System to verify and reconcile all transactions
-   **OAuth 2.0 Authentication**: Secure connections between systems

## 💻 Technologies Used

-   **Backend**: Node.js, Express.js
-   **Frontend**: EJS, HTML, CSS, JavaScript, Bootstrap
-   **Database**: MySQL 8.0, Sequelize ORM
-   **Authentication**: Passport.js, OAuth 2.0
-   **Payment Processing**: Custom secure payment system
-   **HTTP Security**: HTTPS with self-signed certificates

## 🚀 Getting Started

### System Requirements

-   Node.js (v14 or higher)
-   MySQL 8.0
-   Modern web browser

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/4T-Store.git
cd 4T-Store
```

#### 2. Environment Setup

Create a `.env` file in the root directory based on the provided `.env.sample` file with your database credentials and other configurations.

```
# Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASS=your_mysql_password
DB_NAME=4t_store

# Payment System Configuration
PAYMENT_DB_HOST=localhost
PAYMENT_DB_USER=your_mysql_username
PAYMENT_DB_PASS=your_mysql_password
PAYMENT_DB_NAME=4t_payment
PAYMENT_PORT=3001
PAYMENT_JWT_SECRET=your_jwt_secret
PAYMENT_CONNECTION_SECRET=your_connection_secret

# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://localhost:3000/auth/google/callback

FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
FACEBOOK_CALLBACK_URL=https://localhost:3000/auth/facebook/callback

# Server Configuration
PORT=3000
FRONTEND_URL=https://localhost:3000
SERVER_URL=https://localhost:3000
```

#### 3. SSL Certificate Generation

For secure HTTPS connections, create self-signed SSL certificates:

```bash
# Create ssl directory
mkdir payment/ssl
cd payment/ssl

# Generate SSL certificates
openssl genrsa -out key.pem 2048
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem
```

#### 4. Install Dependencies

From the root directory, install all dependencies:

```bash
npm install
```

#### 5. Initialize Database

Seed the database with initial data:

```bash
npm run seed:all
```

Alternatively, you can seed the shop and payment systems separately:

```bash
npm run seed:shop
npm run seed:payment
```

If you encounter issues with Sequelize dropping tables, you may need to manually drop the database in MySQL Workbench.

### Running the Application

To start both servers concurrently:

```bash
npm start
```

To run each server separately:

```bash
npm run start:shop    # Start main e-commerce system
npm run start:payment # Start payment system
```

The application will be available at: https://localhost:3000

## 🛠️ Helper Classes Usage

### Sorting

The app includes a sorting system that can be used via URL parameters:

```javascript
// Define sortable fields in your class
export default class ProductSortBuilder extends SortBuilder {
    constructor(requestQuery) {
        super(requestQuery);
        this._map = {
            name: ["name"],
            price: ["price"],
            createdAt: ["createdAt"],
            updatedAt: ["updatedAt"],
        };
        this._defaultSort = [["createdAt", "DESC"]];
    }
}

// Usage in route handler
const sortBuilder = new ProductSortBuilder(req.query);
const sort = sortBuilder.build();

await Product.findAll({
    order: [...sort],
});
```

Example URL with sorting: `api/products?sort=name,-price` (sorts by name ascending, then price descending)

### Pagination

Pagination can be implemented using the PaginationBuilder:

```javascript
const paginationBuilder = new PaginationBuilder(req.query);
const { limit, offset } = paginationBuilder.build();

await Product.findAll({
    limit,
    offset,
});
```

Example URL with pagination: `api/products?page=1&size=10`

### Filtering

Filter results using the FilterBuilder:

```javascript
export default class ProductFilterBuilder extends FilterBuilder {
    constructor(requestQuery) {
        super(requestQuery);
        this._allowFields = [
            "productId",
            "name",
            "price",
            "updatedAt",
            "createdAt",
        ];
    }
}

const filterBuilder = new ProductFilterBuilder(req.query);
const filter = filterBuilder.build();

await Product.findAll({
    where: { ...filter },
});
```

Example URL with filtering: `api/products?name=[like]apple&price=[gte]100`

### Combining Helpers

You can combine all these helpers for powerful data retrieval:

```bash
api/products?name=[like]apple&price=[gte]100&price=[lt]200&sort=name&page=2&size=10
```
