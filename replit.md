# Overview

This is a modern full-stack portfolio web application built with React and TypeScript. The project features a cosmic-themed design with advanced animations, 3D graphics capabilities, and interactive development tools. The portfolio includes sections for projects, videos, an integrated IDE, and contact functionality. It's designed as a comprehensive showcase for a developer's work with a focus on visual impact and user experience.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The application uses a modern React architecture with TypeScript and functional components. The frontend is organized using a component-based structure with clear separation of concerns:

- **Component Structure**: Modular components organized by functionality (UI components, page components, feature components)
- **State Management**: Zustand for global state management, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with a custom cosmic theme, CSS variables for theming, shadcn/ui component library
- **Animation**: Framer Motion for advanced animations and transitions
- **Build Tool**: Vite for fast development and optimized builds

## Backend Architecture
Simple Express.js server following RESTful API patterns:

- **API Structure**: Express routes organized in a modular pattern
- **Middleware**: Request logging, JSON parsing, error handling
- **Proxy Services**: YouTube API integration for video content
- **Static Serving**: Serves the built React application in production

## Data Storage Solutions
The application uses a hybrid approach for data storage:

- **Database**: PostgreSQL with Drizzle ORM for schema management and type safety
- **In-Memory Storage**: Temporary storage implementation for user data during development
- **Schema Definition**: Shared schema definitions between client and server using Drizzle and Zod

## Authentication and Authorization
Currently implements a basic user model with:

- **User Schema**: Simple username/password model defined in shared schema
- **Storage Interface**: Abstracted storage interface allowing for different implementations
- **Session Management**: Prepared for session-based authentication (connect-pg-simple ready)

## External Service Integrations

### YouTube API Integration
- **Video Search**: Proxy endpoint for YouTube Data API v3
- **Content Display**: Video cards with thumbnails, duration, and view counts
- **Player Integration**: Embedded YouTube player in modal interface

### Development Tools Integration
- **IDE Features**: File explorer, code editor with syntax highlighting, live preview
- **Terminal Emulation**: Interactive terminal component for command execution
- **Code Execution**: Framework for running and previewing code in the browser

### Communication Services
- **Contact Forms**: Form handling for user inquiries
- **WhatsApp Integration**: Direct messaging capability
- **Email Services**: Prepared infrastructure for email notifications

## Design System
The application implements a comprehensive design system:

- **Theme Architecture**: CSS variables for consistent theming across light/dark modes
- **Component Library**: shadcn/ui components customized for the cosmic theme
- **Animation System**: Centralized animation utilities using Framer Motion
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints

## Performance Optimizations
- **Code Splitting**: Vite's automatic code splitting for optimal loading
- **Asset Optimization**: Image optimization and lazy loading
- **Caching Strategy**: Browser caching for static assets
- **Bundle Optimization**: Tree shaking and dead code elimination