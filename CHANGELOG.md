# Changelog

All notable changes to the OSRS Skilling Assistant project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Add Farm Run Page** - Dedicated full-page interface for creating and managing farm runs
- **Stopwatch Functionality** - Start/Pause/Reset timer controls with real-time elapsed time display
- **Dynamic Button States** - Smart button behavior that changes from Start/Reset to Pause/Reset when running
- **Farm Run Step Management** - Modal interface for adding individual farming steps with location, patch, and seed selection
- **Automatic Farm Run Creation** - Farm runs are created automatically when entering the add page
- **Step Recording System** - Complete workflow for recording planting and harvesting activities
- **Navigation Integration** - Seamless navigation from Farm Run Log to Add Farm Run page
- **Full Viewport Layout** - Main content now uses full remaining viewport width for better space utilization
- **Farm Run Log UI** - Complete farm run tracking interface with 2x2 grid layout and summary statistics
- **Farm Run Data Integration** - Full backend integration with API endpoints and database seeding
- **Activity Log System** - Complete inventory change tracking with audit trails
- **SeedChangeRecord Model** - New data model for tracking inventory changes with timestamps
- **Change Management UI** - Modal interface for recording inventory changes with validation
- **Real-time Preview** - Live calculation showing current → new values before submission
- **Inventory Validation** - Prevents negative inventory values with clear error messages
- **Sign Selection UI** - Dropdown selectors for +/- instead of manual input
- **Activity History Display** - Component to view change history with timestamps and notes
- **Deep Link Support** - Implemented React Router for URL-based navigation and bookmarking
- **Route-Based Tabs** - Converted state-based tabs to proper routes with browser history support
- **URL Navigation** - Users can now bookmark and share direct links to specific tabs
- **Browser Integration** - Back/forward buttons work correctly with tab navigation
- **SQLite Database** - Replaced in-memory database with persistent SQLite storage
- **Database Migration System** - Automated database setup and seeding scripts
- **Sidebar Navigation** - Converted top navigation to modern left-hand sidebar
- **Farming Sub-Navigation** - Added horizontal sub-navigation for farming features
- **Activity Dashboard** - New activity log component showing all farming changes
- **Farming Page Structure** - Organized farming features into dedicated sub-pages
- **FarmPatch Data Model** - Complete data model for farming patch locations and types
- **Locations Tab** - New farming locations interface with 2-column layout
- **Farm Patches API** - Full CRUD API for managing farming patch data
- **FarmRun Data Model** - New data model for tracking farming run sessions with timestamps and tags
- **FarmRunStep Data Model** - New data model for individual steps within farm runs with patch and change record references

### Changed
- **Database Architecture** - Migrated from static counts to change record-based calculation
- **Inventory Management** - Replaced direct editing with change tracking system
- **UI Components** - Updated FarmingInventory with new change management interface
- **API Endpoints** - Added new endpoints for reconciliation and increment operations
- **Navigation System** - Replaced state management with React Router for better UX
- **Tab Architecture** - Migrated from useState to URL-based tab switching
- **Default Route** - Root path now redirects to Hello World tab by default
- **Farming Tab Name** - Changed "Farming Inventory" to "Farming" for broader scope
- **Navigation Layout** - Converted top tabs to left sidebar with modern design
- **Farming Default View** - Activity log now shows by default instead of inventory
- **Database Storage** - All data now persists between server restarts
- **Farming Navigation** - Added Locations tab between Activity and Inventory
- **Database Schema** - Added farm_patches table with comprehensive patch data
- **Layout Architecture** - Updated main content to use full viewport width with proper flexbox layout
- **CSS Overflow Handling** - Fixed overflow issues that were preventing Activity and ActivityLog components from displaying
- **Component Layout** - Updated Farming, Activity, and FarmRunLog components to work with full-width layout

### Technical Improvements
- **Change Record API** - New endpoints for inventory change management:
  - `GET /api/seeds/:id/changes` - Get change history for specific seed
  - `GET /api/seeds/changes/all` - Get all change records
  - `POST /api/seeds/:id/reconcile` - Create reconciliation change record
  - `POST /api/seeds/:id/increment` - Create increment change record
- **Database Schema** - Updated to use change records instead of static counts
- **Validation Logic** - Client and server-side validation for inventory changes
- **UI/UX Enhancements** - Improved modal design with real-time feedback
- **React Router DOM** - Added client-side routing with BrowserRouter
- **Link Components** - Replaced button clicks with proper Link navigation
- **Route Configuration** - Set up dedicated routes for each tab:
  - `/hello` - Hello World tab
  - `/farming` - Farming tab with sub-navigation
  - `/coming-soon` - Coming Soon tab
- **Active State Management** - Dynamic tab highlighting based on current route
- **SQLite Integration** - Added sqlite3 dependency and database layer
- **Migration Scripts** - Automated database setup with `npm run db:migrate`
- **Data Persistence** - All changes now saved to SQLite database file
- **Farming Sub-Routes** - Nested routing for farming features:
  - `/farming/activity` - Activity dashboard (default)
  - `/farming/locations` - Farm patch locations (NEW)
  - `/farming/inventory` - Inventory management
  - `/farming/planning` - Planning tools (coming soon)
  - `/farming/progress` - Progress tracking (coming soon)
  - `/farming/guides` - Farming guides (coming soon)
- **Farm Patches API** - Complete REST API for patch management:
  - `GET /api/farm-patches` - Get all farm patches
  - `GET /api/farm-patches/:id` - Get specific farm patch
  - `POST /api/farm-patches` - Create new farm patch
  - `PUT /api/farm-patches/:id` - Update farm patch
  - `DELETE /api/farm-patches/:id` - Delete farm patch
  - `GET /api/farm-patches/location/:location` - Get patches by location
  - `GET /api/farm-patches/type/:patchType` - Get patches by type
  - `GET /api/farm-patches/search/:term` - Search patches
  - `GET /api/farm-patches/meta/locations` - Get unique locations
  - `GET /api/farm-patches/meta/patch-types` - Get unique patch types
- **Responsive Design** - Mobile-optimized sidebar and navigation
- **FarmRun Database Schema** - New table with foreign key relationships and indexes:
  - `farm_runs` table with id, start, end, tags, timestamps
  - Proper indexing for performance on timestamp and foreign key queries
  - Automatic timestamp triggers for updated_at fields
- **FarmRunStep Database Schema** - New table with comprehensive foreign key relationships:
  - `farm_run_steps` table linking farm runs, patches, and change records
  - One-to-many relationship: FarmRun → FarmRunStep
  - One-to-one relationship: SeedChangeRecord → FarmRunStep
  - Cascade delete constraints for data integrity
- **FarmRun JavaScript Model** - Complete data model with validation and utility methods:
  - Timestamp handling with automatic Date conversion
  - Tag management with add/remove/check functionality
  - Duration calculation methods (milliseconds, minutes, hours)
  - Status checking (isActive, isCompleted)
  - JSON serialization support
- **FarmRunStep JavaScript Model** - Comprehensive data model with foreign key validation:
  - Foreign key validation for farm runs, patches, and change records
  - Timestamp validation ensuring end > start
  - Duration calculation and status checking methods
  - Relationship validation and data integrity checks
- **Farm Run Log UI** - Complete farming run session management interface:
  - 2x2 grid layout with summary cards and detailed views
  - Farm runs table with click-to-select functionality
  - Farm run details panel showing steps and metadata
  - Real-time statistics (total runs, steps, yield calculations)
  - Add farm run button for creating new sessions
- **Farm Run Data Integration** - Full backend integration with persistent storage:
  - JSON data files for initial farm runs and steps seeding
  - Database migration updates to seed farm run data
  - REST API endpoints for farm runs with joined steps
  - API service integration replacing static mock data

### Technical Improvements
- **Farm Run API Endpoints** - Complete REST API for farm run management:
  - `GET /api/farm-runs` - Get all farm runs with joined steps
  - `GET /api/farm-runs/:id` - Get specific farm run with steps
  - `POST /api/farm-runs` - Create new farm run
  - `PUT /api/farm-runs/:id` - Update farm run
  - `DELETE /api/farm-runs/:id` - Delete farm run
  - `GET /api/farm-runs/:id/steps` - Get steps for specific farm run
  - `POST /api/farm-runs/:id/steps` - Create new farm run step
- **Database Methods** - Advanced SQL queries for farm run data:
  - Complex JOIN queries to group steps by farm run
  - Foreign key relationship handling
  - Cascade delete operations for data integrity
  - JSON parsing for tags and metadata
- **Migration System Updates** - Enhanced database seeding:
  - Added farm runs and farm run steps seeding methods
  - Updated verification to include new table counts
  - Proper data file integration with migration script
- **Frontend-Backend Integration** - Seamless data flow:
  - Real-time data loading from API endpoints
  - Proper error handling and loading states
  - Dynamic statistics calculation from live data
- **Layout System Improvements** - Enhanced viewport utilization:
  - Full viewport width layout with proper flexbox implementation
  - Fixed CSS overflow issues preventing component display
  - Responsive design updates for better mobile experience
  - Component height and overflow handling optimizations

## [0.5.0] - 2024-01-XX

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
