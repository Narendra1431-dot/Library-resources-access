# Library E-Resources Access Website

A modern, intelligent, and scalable platform for academic institution library resources. Built with React, Node.js, Express, and MongoDB.

## Features

### Core Modules
- **Authentication System**: Role-based login (Student, Faculty, Admin) with JWT
- **Dashboard**: Personalized recommendations, usage statistics, and quick access
- **Advanced Search**: Multi-filter search with relevance sorting
- **AI Recommendations**: Smart suggestions based on user behavior
- **E-Book Reader**: Interactive reading with notes, highlights, and dark mode
- **Research Assistant**: AI-powered research help and citation generation
- **Admin Analytics**: Comprehensive usage statistics and resource management
- **Student Contributions**: Upload and review system for research materials
- **Notifications**: Alerts for new resources and deadlines
- **Gamification**: Reading streaks, leaderboards, and achievements

### Technical Features
- Responsive design with dark/light mode
- Real-time search and filtering
- Download tracking with limits
- Note-taking and bookmarking
- Resource watermarking
- Activity logging and analytics
- File upload for submissions
- Role-based access control

## Tech Stack

### Frontend
- React 18 with Hooks
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Custom animations and transitions

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Multer for file uploads

### Database Collections
- Users (with roles and limits)
- Resources (e-books, journals, papers)
- Downloads (with expiry and watermarking)
- Notes (user annotations)
- Recommendations (AI-generated suggestions)
- Submissions (student contributions)
- AnalyticsLogs (usage tracking)

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup
```bash
cd library-e-resources/backend
npm install
# Create .env file with:
# MONGODB_URI=mongodb://localhost:27017/library-db
# JWT_SECRET=your-secret-key
# PORT=5000
npm run dev
```

### Frontend Setup
```bash
cd library-e-resources/frontend
npm install
npm start
```

### Database Seeding
```bash
# Import mock data
mongoimport --db library-db --collection users --file mock-data.json --jsonArray
mongoimport --db library-db --collection resources --file mock-data.json --jsonArray
# Repeat for other collections
```

## API Documentation

See [api-routes.md](./api-routes.md) for complete API reference.

## Database Schema

See [db-schema.md](./db-schema.md) for database structure details.

## UI Layout

See [ui-layout.md](./ui-layout.md) for design system and component structure.

## Usage

### For Students
1. Register/Login with student account
2. Browse dashboard for recommendations
3. Search for resources using advanced filters
4. Download resources (within limits)
5. Use e-book reader for interactive reading
6. Submit research contributions

### For Faculty
1. Login with faculty account
2. Access all student features
3. Higher download limits
4. Faculty-specific recommendations

### For Admins
1. Login with admin account
2. Manage resources (add/edit/delete)
3. Review student submissions
4. View analytics dashboard
5. Monitor system usage

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Download limits and tracking
- Resource watermarking
- Activity logging
- Rate limiting (recommended)

## Development

### Project Structure
```
library-e-resources/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth middleware
│   ├── server.js        # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── App.js       # Main app component
│   │   └── index.js
│   ├── public/
│   └── package.json
├── docs/
│   ├── api-routes.md
│   ├── db-schema.md
│   └── ui-layout.md
└── mock-data.json
```

### Available Scripts

#### Backend
- `npm start` - Production server
- `npm run dev` - Development server with nodemon

#### Frontend
- `npm start` - Development server
- `npm run build` - Production build
- `npm test` - Run tests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test thoroughly
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team or create an issue in the repository.

---

**Note**: This is a comprehensive academic resource management system designed for scalability and modern web standards. Ensure proper security measures are implemented before production deployment.
