<div align="center">

# 🎓 AURAK Event Management Platform

### A comprehensive platform for managing university events from submission to archival

[![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api-reference) • [Contributing](#-contributing)

</div>

---

## 📖 About

The **Event Management Platform (EMP)** streamlines the entire event lifecycle at the American University of Ras Al Khaimh (AURAK). From initial event submission and multi-level approval workflows to post-event media archiving and attendance tracking, EMP handles it all.

### ✨ Why EMP?

- **🔄 Streamlined Workflows**: Multi-level approval system with role-based access
- **📊 Real-time Tracking**: Monitor event status, budgets, and attendance in real-time
- **📱 Modern UI**: Beautiful, responsive interface built with React and shadcn/ui
- **🔐 Secure**: Email-based OTP authentication with planned SSO integration
- **📈 Analytics**: Comprehensive reporting and data export capabilities

## 🏗️ Tech Stack

### Backend
```
Django          - Python web framework
PostgreSQL      - Relational database
DRF             - RESTful API
JWT             - Token-based authentication
```

### Frontend
```
React 18        - UI library
TypeScript      - Type-safe JavaScript
Vite            - Fast build tool
shadcn/ui       - Component library
Tailwind CSS    - Utility-first CSS
React Router v6 - Client-side routing
Zod             - Schema validation
```

## ✨ Features

<table>
<tr>
<td width="50%">

### 📅 Event Management
- ✅ Comprehensive event creation forms
- ✅ Multi-level approval workflows
- ✅ Real-time status tracking
- ✅ Calendar integration
- ✅ Event categorization & tagging

</td>
<td width="50%">

### 💰 Budget Management
- ✅ Line-item budget requests
- ✅ Treasurer review & approval
- ✅ Cost tracking & reporting
- ✅ Financial oversight tools
- ✅ Budget analytics

</td>
</tr>
<tr>
<td width="50%">

### 📸 Media & Documentation
- ✅ Photo & video uploads
- ✅ Document management
- ✅ Secure file storage
- ✅ Media galleries
- ✅ Download capabilities

</td>
<td width="50%">

### 👥 Guest Registration
- ✅ Public registration forms
- ✅ Barcode generation
- ✅ Attendance tracking
- ✅ Check-in system
- ✅ CSV export

</td>
</tr>
</table>

### 🎯 User Roles

| Role | Capabilities |
|------|-------------|
| **Event Creator** | Submit events, track status, share registration links |
| **Department Admin** | Review & approve departmental events, view analytics |
| **Ultimate Admin** | Full system access, manage all events & users |
| **Treasurer** | Review budgets, approve expenses, financial oversight |
| **Event Host** | Upload media, manage documentation, post-event updates |

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- [Python 3.11+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL 14+](https://www.postgresql.org/download/)
- [Git](https://git-scm.com/)

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/win-x-u-r/Event-Management-Platform.git
cd Event-Management-Platform

# Navigate to backend directory
cd EMP

# Create and activate virtual environment
python -m venv env

# Windows
env\Scripts\activate

# macOS/Linux
source env/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure database in EMP/settings.py
# Create database in PostgreSQL first

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd FrontEnd/event-form-beautifier

# Install dependencies
npm install

# Configure API endpoint in src/config.ts
# Update with your backend URL

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:8080`

## 💻 Usage

### Quick Start

1. **Start the Backend Server**
   ```bash
   cd EMP
   env\Scripts\activate  # Windows
   python manage.py runserver
   ```

2. **Start the Frontend Server**
   ```bash
   cd FrontEnd/event-form-beautifier
   npm run dev
   ```

3. **Access the Application**
   - Navigate to `http://localhost:8080`
   - Login with your AURAK email
   - Verify OTP sent to your email
   - Start managing events!

### Configuration

#### Backend Configuration (`.env`)

```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost/dbname
ALLOWED_HOSTS=localhost,127.0.0.1
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@aurak.ac.ae
EMAIL_HOST_PASSWORD=your-app-password
```

#### Frontend Configuration (`src/config.ts`)

```typescript
export const API_BASE_URL = 'http://localhost:8000/api';
export const ENVIRONMENT = 'development';
```

## 📁 Project Structure

```
Internship/
├── 📂 EMP/                           # Django Backend
│   ├── manage.py
│   ├── requirements.txt
│   ├── 📂 EMP/                       # Main Django app
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── 📂 events/                    # Events module
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   ├── 📂 authentication/            # Auth module
│   ├── 📂 attendance/                # Attendance tracking
│   ├── 📂 budget/                    # Budget management
│   ├── 📂 media/                     # Media handling
│   └── 📂 users/                     # User management
│
├── 📂 FrontEnd/
│   └── 📂 event-form-beautifier/     # React Frontend
│       ├── 📂 src/
│       │   ├── 📂 components/        # React components
│       │   │   ├── 📂 ui/            # shadcn/ui components
│       │   │   ├── EventRequestForm.tsx
│       │   │   └── EventViewModal.tsx
│       │   ├── 📂 pages/             # Route pages
│       │   │   ├── Login.tsx
│       │   │   ├── UserDashboard.tsx
│       │   │   ├── AdminDashboard.tsx
│       │   │   └── TreasurerDashboard.tsx
│       │   ├── 📂 contexts/          # React contexts
│       │   ├── 📂 services/          # API services
│       │   └── 📂 utils/             # Utilities
│       ├── package.json
│       └── vite.config.ts
│
├── 📂 Database/                      # SQL scripts
│   ├── CREATE_TABLES.sql
│   ├── INSERT_DATA.sql
│   └── QUEREY.sql
│
└── 📂 Documentation/                 # Project docs
    ├── API Documentation/
    ├── ERM Diagram/
    └── Requirements/
```

## 🔌 API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/send-otp/` | Send OTP to email |
| `POST` | `/api/auth/verify-otp/` | Verify OTP and login |
| `GET` | `/api/auth/me/` | Get current user |

### Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/events/` | List all events |
| `POST` | `/api/events/` | Create new event |
| `GET` | `/api/events/{id}/` | Get event details |
| `PATCH` | `/api/events/{id}/` | Update event |
| `DELETE` | `/api/events/{id}/` | Delete event |

### Media

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/media/` | List media files |
| `POST` | `/api/media/` | Upload media |
| `DELETE` | `/api/media/{id}/` | Delete media |

### Budget

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/budgets/` | List budget items |
| `POST` | `/api/budgets/` | Create budget item |
| `PATCH` | `/api/budgets/{id}/` | Update budget status |

### Attendance

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/attendance/register/` | Register guest |
| `GET` | `/api/attendance/{event_id}/` | Get attendance list |
| `GET` | `/api/attendance/{event_id}/export/` | Export as CSV |

<details>
<summary>📝 Request/Response Examples</summary>

#### Create Event

**Request:**
```json
POST /api/events/
{
  "name": "Tech Workshop 2025",
  "description": "Annual technology workshop",
  "start_date": "2025-03-15",
  "end_date": "2025-03-15",
  "venue": "Engineering Building",
  "category": "Workshop",
  "expected_attendees": 50
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Tech Workshop 2025",
  "status": "pending",
  "created_at": "2025-01-22T10:00:00Z",
  ...
}
```

</details>

## 🗄️ Database Schema

<details>
<summary>View Entity Relationship Diagram</summary>

### Core Entities

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    User     │         │    Event    │         │   Budget    │
├─────────────┤         ├─────────────┤         ├─────────────┤
│ id          │────┐    │ id          │────┬───→│ id          │
│ email       │    │    │ name        │    │    │ item_name   │
│ name        │    └───→│ creator_id  │    │    │ quantity    │
│ department  │         │ start_date  │    │    │ cost        │
│ role        │         │ end_date    │    │    │ status      │
└─────────────┘         │ status      │    │    └─────────────┘
                        │ venue       │    │
                        └─────────────┘    │    ┌─────────────┐
                                           └───→│    Media    │
                                                ├─────────────┤
                                                │ id          │
                                                │ file        │
                                                │ type        │
                                                │ event_id    │
                                                └─────────────┘
```

</details>

## 🧪 Testing

### Backend Tests

```bash
cd EMP
python manage.py test

# Run specific app tests
python manage.py test events

# With coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
```

### Frontend Tests

```bash
cd FrontEnd/event-form-beautifier
npm test

# With coverage
npm test -- --coverage
```

## 🚢 Deployment

### Building for Production

**Frontend Build:**
```bash
cd FrontEnd/event-form-beautifier
npm run build
# Output: dist/
```

**Backend Setup:**
```bash
# Install production dependencies
pip install gunicorn

# Collect static files
python manage.py collectstatic

# Run with Gunicorn
gunicorn EMP.wsgi:application --bind 0.0.0.0:8000
```

### Environment Variables (Production)

```env
DEBUG=False
SECRET_KEY=strong-production-secret-key
DATABASE_URL=postgresql://user:pass@host:5432/dbname
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style

- **Python**: Follow PEP 8 guidelines
- **TypeScript/React**: Use ESLint and Prettier configurations
- **Commits**: Use conventional commit messages

## 📄 License

This project is developed for AURAK internal use.

## 👥 Team

**Internship Group 6** - AURAK Computer Science Department

## 🙏 Acknowledgments

- American University of Ras Al Khaimh
- Project Supervisors
- All Contributors

## 📞 Support

For questions, issues, or feature requests:

- 📧 Email: support@aurak.ac.ae
- 📝 Issues: [GitHub Issues](https://github.com/win-x-u-r/Event-Management-Platform/issues)
- 📚 Documentation: See `/Documentation` folder

---

<div align="center">

**[⬆ Back to Top](#-aurak-event-management-platform)**

Made with ❤️ by AURAK Students

</div>
