# Changelog

All notable changes to the OSRS Skilling Assistant project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Express Backend Server** - Complete REST API with CRUD operations for seed management
- **In-Memory Database** - Server-side data persistence with initial OSRS seed data
- **API Service Layer** - Centralized frontend API communication with error handling
- **CRUD Endpoints** - Full Create, Read, Update, Delete operations for seeds:
  - `GET /api/seeds` - Retrieve all seeds
  - `GET /api/seeds/:id` - Get specific seed by ID
  - `POST /api/seeds` - Create new seed
  - `PUT /api/seeds/:id` - Full update of seed
  - `PATCH /api/seeds/:id` - Partial update of seed
  - `DELETE /api/seeds/:id` - Delete seed
  - `POST /api/seeds/reset` - Reset to initial data (dev only)
- **Loading States** - Professional loading spinner and error handling UI
- **Development Scripts** - Concurrent frontend/backend development workflow
- **Health Check Endpoint** - Server monitoring and status verification

### Changed
- **Data Architecture** - Migrated from static JSON imports to dynamic API calls
- **Frontend Data Flow** - Refactored components to use async API service
- **Development Workflow** - Added scripts for running both frontend and backend
- **Error Handling** - Enhanced user experience with loading states and retry functionality

### Technical Improvements
- **Server-Side Validation** - Input validation middleware for seed data
- **CORS Configuration** - Cross-origin resource sharing for frontend-backend communication
- **Error Response Format** - Standardized API error responses with proper HTTP status codes
- **Async/Await Pattern** - Modern JavaScript patterns for API communication
- **Modular Architecture** - Separated concerns with dedicated routes, database, and services
- **Development Dependencies** - Added nodemon for auto-reload and concurrently for parallel execution

## [0.4.0] - 2024-01-XX

### Added
- **Two-Column Layout System** - Implemented dedicated seed list and detail view columns
- **Enhanced Detail Panel** - Professional card-based detail view with key metrics visualization
- **Click-Based Selection** - Replaced hover effects with persistent click-based seed selection
- **No Selection State** - Added helpful placeholder when no seed is selected
- **Improved Container Sizing** - Increased main content width to 80% for better space utilization

### Changed
- **Layout Architecture** - Restructured from single table to two-column farming layout (1:1 ratio)
- **User Interaction Model** - Changed from hover-based to click-based seed selection
- **Detail View Design** - Enhanced with grid-based card layout for better data presentation
- **Table Optimization** - Shortened column headers and improved space efficiency
- **Container Constraints** - Added proper overflow handling and width constraints

### Technical Improvements
- **CSS Grid Layout** - Implemented responsive two-column grid system
- **Overflow Management** - Added proper overflow handling to prevent layout breaking
- **Box Model Optimization** - Enhanced box-sizing and width constraints
- **Mobile Responsiveness** - Improved mobile layout with stacked columns
- **Visual Hierarchy** - Better organization of information with color-coded detail cards

## [0.3.0] - 2024-01-XX

### Added
- **Enhanced Seed Data Model** - Added `seedType` and `requiredFarmingLevel` fields to Seed class
- **Authentic OSRS Data** - Integrated real Old School RuneScape seed data from official wiki
- **Professional Table Layout** - Replaced card-based seed display with responsive data table
- **Real Inventory Data** - Updated with actual player seed and yield counts (1,381 seeds, 7,360 yields)
- **Comprehensive Seed Database** - 16 different seed types covering all major categories:
  - Tree seeds (Magic, Yew)
  - Allotment seeds (Watermelon, Snape Grass)
  - Herb seeds (Tarromin through Torstol)
  - Special seeds (Spirit, Celastrus)
- **Enhanced UI Components** - Color-coded badges for seed types and farming levels
- **Improved Data Visualization** - Better organization and readability of seed information

### Changed
- **Seed Class Architecture** - Enhanced with new required fields and validation
- **Data Structure** - Migrated from hardcoded examples to external JSON with real OSRS data
- **UI Layout** - Converted from card-based to professional table layout for better data density
- **Grid Layout** - Optimized container ratios (2:1) for table and details panel
- **Responsive Design** - Updated mobile breakpoints for table display
- **Yield Names** - Updated tree seed yields from "logs" to "root" for accuracy

### Technical Improvements
- **Data Validation** - Enhanced input validation for new seed fields
- **Utility Methods** - Updated `getSummary()` and `toJSON()` methods for new fields
- **CSS Architecture** - Streamlined styles with table-specific components
- **Performance** - Optimized rendering with efficient table structure

## [0.2.0] - 2024-01-XX

### Added
- Farming Inventory tab with comprehensive seed management system
- Seed class model with validation and utility methods
- Interactive seed selection and detailed view functionality
- Dashboard statistics showing total seeds, yields, and expected yields
- External JSON data file for seed information (`data/initial_data_farming_seeds.json`)
- Responsive design with modern UI components and animations

### Changed
- Restructured application to use tab-based navigation
- Moved seed management functionality from Hello World tab to dedicated Farming Inventory tab
- Simplified Hello World tab to serve as welcome page with feature overview

## [0.1.0] - 2024-01-XX

### Added
- Initial project setup with React 18 and Vite
- Basic tab navigation system with Hello World and Coming Soon tabs
- Modern UI design with gradient backgrounds and glassmorphism effects
- Responsive layout supporting desktop and mobile devices
- Development environment configuration with hot reload
- Comprehensive .gitignore file for React.js projects
- Project documentation and README with setup instructions

### Technical Details
- **Framework**: React 18 with functional components and hooks
- **Build Tool**: Vite for fast development and building
- **Styling**: CSS3 with modern features (gradients, backdrop-filter, animations)
- **Package Management**: npm with package-lock.json for dependency consistency

---

## Version History Summary

### Major Milestones

1. **Repository Initialization** - Set up the foundational React webapp with modern tooling and beautiful UI
2. **Farming Inventory System** - Introduced comprehensive seed management functionality with data persistence

### Upcoming Features
- Additional skill tracking tabs (Mining, Fishing, etc.)
- Data persistence and local storage
- Export/import functionality for inventory data
- Advanced analytics and reporting features
