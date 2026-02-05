# MIS and Invoicing Management System

A full-stack web application for managing clients, sales estimates, invoices, and payments with GST-compliant billing.

![React](https://img.shields.io/badge/React-18-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-cyan)

## 🚀 Features

- **Dashboard** - Overview of total clients, invoices, payments, and financial summaries
- **Client Management** - Add, edit, delete clients with categorization (group/chain/brand)
- **Estimate Management** - Create sales estimates, convert approved estimates to invoices
- **Invoice Management** - Generate GST-compliant invoices with CGST/SGST/IGST calculation
- **Payment Tracking** - Record payments with auto-update of invoice status

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS 4 |
| Backend | Spring Boot 3.2 |
| Database | MySQL / H2 (dev) |
| API | RESTful |

## 📁 Project Structure

```
MIS and Invoicing System/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   └── services/         # API service layer
│   └── package.json
│
└── backend/                  # Spring Boot application
    ├── src/main/java/com/mis/invoicing/
    │   ├── controller/       # REST controllers
    │   ├── model/            # JPA entities
    │   ├── repository/       # Data repositories
    │   ├── service/          # Business logic
    │   └── config/           # CORS configuration
    └── pom.xml
```

## 🔧 Prerequisites

- Node.js 18+
- Java JDK 17+
- Maven 3.6+
- MySQL (optional, H2 used for development)

## 🚀 Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

   The backend will start at `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will start at `http://localhost:5173`

## 📡 API Endpoints

| Module | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| Dashboard | GET | `/api/dashboard/stats` | Get overview statistics |
| Clients | GET | `/api/clients` | List all clients |
| Clients | POST | `/api/clients` | Create new client |
| Clients | PUT | `/api/clients/{id}` | Update client |
| Clients | DELETE | `/api/clients/{id}` | Delete client |
| Estimates | GET | `/api/estimates` | List all estimates |
| Estimates | POST | `/api/estimates?clientId={id}` | Create estimate |
| Estimates | POST | `/api/estimates/{id}/convert` | Convert to invoice |
| Invoices | GET | `/api/invoices` | List all invoices |
| Invoices | POST | `/api/invoices?clientId={id}` | Create invoice |
| Payments | GET | `/api/payments` | List all payments |
| Payments | POST | `/api/payments?invoiceId={id}` | Record payment |

## 💰 GST Calculation

The system supports Indian GST calculation:
- **Intra-State**: CGST (9%) + SGST (9%) = 18% total
- **Inter-State**: IGST (18%)

## 🎨 UI Screenshots

The application features a modern dark theme with:
- Glassmorphism effects
- Gradient accents
- Responsive design (mobile, tablet, desktop)
- Smooth transitions and animations

## 📄 License

This project is created as part of an internship capstone project.

## 👨‍💻 Author

**Ganesh** - Full Stack Developer
