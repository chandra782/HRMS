# HRMS - Human Resource Management System

A complete full-stack HRMS application with organisation-based multi-tenancy, employee and team management, and comprehensive audit logging.

## Features

- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Organisation-based Isolation**: Each organisation's data is completely isolated
- **Employee Management**: Full CRUD operations for employees
- **Team Management**: Full CRUD operations for teams
- **Team Assignment**: Many-to-many relationship between employees and teams
- **Audit Logging**: Complete audit trail for all actions
- **Clean Architecture**: Well-organized folder structure with separation of concerns

## Tech Stack

### Backend
- Node.js + Express
- PostgreSQL (cloud-ready with SSL support)
- Sequelize ORM
- JWT authentication
- bcryptjs for password hashing

### Frontend
- React 18
- Vite
- React Router DOM
- Axios for API calls
- Modern CSS with clean UI

## Project Structure

```
hrms/
├── backend/
│   ├── src/
│   │   ├── models/          # Sequelize models
│   │   ├── controllers/     # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Auth middleware
│   │   ├── db.js            # Database connection
│   │   └── index.js         # Server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── services/        # API service
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Database Schema

- **organisations**: Organisation data
- **users**: User accounts (belongs to organisation)
- **employees**: Employee records (belongs to organisation)
- **teams**: Team records (belongs to organisation)
- **employee_teams**: Many-to-many relationship table
- **logs**: Audit trail (belongs to organisation)

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database (local or cloud like Render)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   DB_HOST=your-db-host.render.com
   DB_PORT=5432
   DB_NAME=your-db-name
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

4. Update the `.env` file with your PostgreSQL credentials. For cloud databases like Render, use the provided connection string details.

5. Start the backend server:
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000` (or the PORT specified in your `.env`).

   The server will automatically:
   - Connect to the database
   - Sync all models (create tables if they don't exist)
   - Start listening for requests

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Create a `.env` file in the `frontend` directory if you need to change the API URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```bash
   npm start
   ```

   The frontend will start on `http://localhost:3000`.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new organisation
- `POST /api/auth/login` - Login and get JWT token

### Employees (Protected - requires JWT)
- `GET /api/employees` - List all employees (for current organisation)
- `POST /api/employees` - Create a new employee
- `PUT /api/employees/:id` - Update an employee
- `DELETE /api/employees/:id` - Delete an employee

### Teams (Protected - requires JWT)
- `GET /api/teams` - List all teams (for current organisation)
- `POST /api/teams` - Create a new team
- `PUT /api/teams/:id` - Update a team
- `DELETE /api/teams/:id` - Delete a team
- `POST /api/teams/assign` - Assign employee to team
- `POST /api/teams/unassign` - Unassign employee from team

### Health Check
- `GET /api/health` - Check API health status

## Usage

1. **Register an Organisation**: 
   - Go to `/register` page
   - Enter organisation name, admin name, email, and password
   - This creates both the organisation and the admin user account

2. **Login**:
   - Go to `/login` page
   - Enter your email and password
   - You'll receive a JWT token stored in localStorage

3. **Manage Employees**:
   - Navigate to `/employees`
   - Add, edit, or delete employees
   - View which teams each employee belongs to

4. **Manage Teams**:
   - Navigate to `/teams`
   - Create, edit, or delete teams
   - Use the "Assign" button to assign employees to teams
   - View team members in the members column

5. **Dashboard**:
   - View statistics about your employees and teams
   - Quick access to all features

## Security Features

- All passwords are hashed using bcrypt
- JWT tokens include userId and orgId for organisation isolation
- All protected routes verify JWT token
- All database queries filter by organisation_id to ensure data isolation
- CORS enabled for cross-origin requests

## Audit Logging

All actions are logged in the `logs` table with:
- Organisation ID
- User ID (who performed the action)
- Action type (login, register, employee_create, employee_update, etc.)
- Metadata (JSONB) containing relevant details
- Timestamp

## Deployment

### Backend Deployment

1. Set environment variables on your hosting platform (Render, Heroku, etc.)
2. Ensure your PostgreSQL database is accessible
3. The backend will automatically sync models on startup
4. Point your domain to the PORT specified in environment variables

### Frontend Deployment

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting platform (Vercel, Netlify, etc.)
3. Set the `VITE_API_URL` environment variable to your backend API URL

## Development Notes

- Backend uses CommonJS (require/module.exports) - no ES modules
- Frontend uses ES modules (import/export)
- Database connection includes SSL configuration for cloud PostgreSQL (Render)
- All Sequelize models have proper associations defined
- Error handling is implemented throughout

## Troubleshooting

- **Database connection issues**: Check your `.env` file credentials and ensure SSL is enabled for cloud databases
- **CORS errors**: Ensure backend CORS is configured correctly
- **JWT errors**: Check that JWT_SECRET is set in backend `.env`
- **Model sync issues**: Check database permissions and connection string

## License

ISC

## Author

HRMS Project

