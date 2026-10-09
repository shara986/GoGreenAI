# 🌿 GoGreen AI — Nursery Management Platform

A full-stack nursery management platform built with Spring Boot 4, React, MySQL, and JWT authentication.

## 📁 Project Structure

```
GoGreen-AI/
├── backend/          # Spring Boot 4 REST API
├── frontend/         # React application
└── database/         # SQL scripts
```

---

## ⚙️ Technology Stack

| Layer         | Technology                        |
|---------------|-----------------------------------|
| Backend       | Spring Boot 4.0.8 + Java 25       |
| Database      | MySQL 8.x                         |
| ORM           | Spring Data JPA + Hibernate 6     |
| Security      | Spring Security 7 + JWT           |
| Frontend      | React 18 + React Router 6         |
| HTTP Client   | Axios                             |
| Mapper        | MapStruct 1.6.3                   |
| Build Tool    | Maven 4                           |

---

## 🗄️ Database Setup

### 1. Create the Database

```bash
mysql -u root -p < database/init.sql
```

Or manually:
```sql
CREATE DATABASE gogreen_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configure Database in Backend

Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/gogreen_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

---

## 🚀 Running the Backend

### Prerequisites
- Java 25 (JDK)
- Maven 4.x
- MySQL 8.x running

### Start the API

```bash
cd backend
mvn spring-boot:run
```

The API will start at: **http://localhost:8081/api**

### Build a JAR

```bash
mvn clean package -DskipTests
java -jar target/gogreen-api-0.0.1-SNAPSHOT.jar
```

---

## 💻 Running the Frontend

### Prerequisites
- Node.js 18+
- npm

### Install Dependencies

```bash
cd frontend
npm install
```

### Start Dev Server

```bash
npm start
```

The frontend will start at: **http://localhost:3000**

---

## 🔐 API Endpoints

### Auth (Public)
| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| POST   | `/api/auth/register`  | Register as customer |
| POST   | `/api/auth/login`     | Login & get JWT      |
| GET    | `/api/auth/me`        | Get current user     |

### Nursery (Public GET, Owner POST/PUT)
| Method | Endpoint        | Role Required        |
|--------|-----------------|----------------------|
| GET    | `/api/nursery`  | Public               |
| POST   | `/api/nursery`  | ROLE_NURSERY_OWNER   |
| PUT    | `/api/nursery`  | ROLE_NURSERY_OWNER   |

### Categories (Public GET)
| Method | Endpoint               | Role Required                |
|--------|------------------------|------------------------------|
| GET    | `/api/categories`      | Public                       |
| GET    | `/api/categories/{id}` | Public                       |
| POST   | `/api/categories`      | ROLE_ADMIN / ROLE_NURSERY_OWNER |
| PUT    | `/api/categories/{id}` | ROLE_ADMIN / ROLE_NURSERY_OWNER |
| DELETE | `/api/categories/{id}` | ROLE_ADMIN                   |

### Plants (Public GET)
| Method | Endpoint                          | Role Required        |
|--------|-----------------------------------|----------------------|
| GET    | `/api/plants?name=&plantType=&active=` | Public         |
| GET    | `/api/plants/{id}`                | Public               |
| GET    | `/api/plants/sku/{sku}`           | Public               |
| GET    | `/api/plants/category/{id}`       | Public               |
| POST   | `/api/plants`                     | ROLE_NURSERY_OWNER   |
| PUT    | `/api/plants/{id}`                | ROLE_NURSERY_OWNER   |
| DELETE | `/api/plants/{id}`                | ROLE_NURSERY_OWNER   |

---

## 👥 Default Seed Users

After running `database/init.sql`:

| Role             | Username        | Password    |
|------------------|-----------------|-------------|
| ROLE_ADMIN       | `admin`         | `Admin@1234` |
| ROLE_NURSERY_OWNER | `nursery_owner` | `Owner@1234` |

> ⚠️ Change default passwords immediately in production!

---

## 🏗️ Business Rules

1. **Single Nursery** — Only ONE nursery exists in the entire system
2. **Single Owner** — Only one user with `ROLE_NURSERY_OWNER` owns the nursery
3. **SKU Uniqueness** — Plant SKUs must be unique across the nursery
4. **Self-Registration** — Users register as `ROLE_CUSTOMER` by default
5. **Admin-Assigned Roles** — `ROLE_ADMIN` and `ROLE_NURSERY_OWNER` must be assigned via SQL or Admin API

---

## 🔧 Configuration to Change Before Production

1. `app.jwt.secret` — Use a strong random 256-bit key
2. `spring.datasource.password` — Set real MySQL password
3. `spring.jpa.hibernate.ddl-auto=update` → change to `validate` in production
4. CORS origin in `SecurityConfig` — update from `localhost:3000` to real domain
5. Change seed user passwords in `database/init.sql`
