# HIT Canteen Digital Ticketing System

A QR-based secure food ordering and verification system built for Harare Institute of Technology.

## Features

- Student wallet system
- Secure order generation
- Unique QR code per order
- One-time verification (anti-reuse protection)
- Transaction audit logging
- Order history tracking
- Financial traceability

## Tech Stack

Frontend:
- React.js

Backend:
- Node.js
- Express.js

Database:
- MongoDB

Security:
- JWT Authentication
- Order status validation
- One-time QR verification

## System Architecture
1. Finance Register Student To System and Credit Wallet Prior Student Cash/Card Paymenent
2. Canteen Add Meal and Price to Student Available Meal DashBoard
3. Student places order
4. Wallet balance deducted
5. Order created with unique ID
6. QR code generated
7. Security verifies via scanning
8. Order marked as "used"
9. Logged in transaction audit

## Installation

### Backend
cd backend
npm install
npm start


### Frontend
cd frontend
npm install
npm start


## Future Improvements

- Admin dashboard
- Expiry configuration
- Email notifications
- Role-based access control

