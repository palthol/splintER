# SplintER - League of Legends Summoner Analytics Platform

SplintER is a modern, full-stack web application that provides detailed analytics and insights for League of Legends players. The application allows users to search for summoners by name or Riot ID, view comprehensive match histories, analyze performance stats, and track progress over time.

## 🌟 Features

- **Dual Search System**: Search by traditional summoner name or modern Riot ID format (Name#Tag)
- **Player Analytics Dashboard**: View detailed performance metrics and match history
- **User Authentication**: Create an account to save favorite summoners and personalize your experience
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Accessibility Focused**: Built with WCAG guidelines in mind for all users

## 🛠️ Technology Stack

### Frontend

- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests
- Fully accessible UI components

### Backend

- Node.js with Express
- TypeScript for type safety
- JWT authentication
- PostgreSQL database with Sequelize ORM
- RESTful API architecture

### External Integrations

- Riot Games API for League of Legends data

## 🚀 Deployment

The application is deployed on Render with separate services for the backend API and frontend static site, enabling seamless scaling and maintenance.

## 🔄 Architecture

SplintER follows a modern microservices architecture with:

- Clean separation between frontend and backend
- RESTful API endpoints for data retrieval
- JWT-based authentication flow
- Environment-based configuration for development and production

## 🔧 Development

The project uses a comprehensive development workflow with:

- TypeScript for static type checking
- Concurrently for running multiple development servers
- Environment-specific configurations
- Graceful error handling and production logging

---

SplintER: Empowering League players with data-driven insights to improve their gameplay and track their progress. Search any summoner, analyze their performance, and gain the competitive edge.
