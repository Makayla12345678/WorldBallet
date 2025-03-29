# World Ballets System Patterns

## System Architecture

The World Ballets platform follows a hybrid architecture that combines client-side and server-side components:

```
┌─────────────────────────────────────┐
│           Client Browser            │
└───────────────┬─────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│         Frontend Application        │
│                                     │
│  ┌─────────────┐   ┌─────────────┐  │
│  │    Views    │   │ Controllers │  │
│  └──────┬──────┘   └──────┬──────┘  │
│         │                 │         │
│         ▼                 ▼         │
│  ┌─────────────────────────────┐    │
│  │       Data Service          │    │
│  └─────────────┬───────────────┘    │
└─────────────────┬─────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│         Backend Server              │
│                                     │
│  ┌─────────────┐   ┌─────────────┐  │
│  │  REST API   │   │  Scrapers   │  │
│  └──────┬──────┘   └──────┬──────┘  │
│         │                 │         │
│         ▼                 ▼         │
│  ┌─────────────────────────────┐    │
│  │       MongoDB Database      │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### Key Components

1. **Frontend Application**
   - HTML/CSS/JavaScript application
   - Runs in the client's browser
   - Responsible for UI rendering and user interactions

2. **Data Service**
   - JavaScript module that handles data fetching and processing
   - Can operate in two modes:
     - Direct scraping (client-side fallback)
     - API integration (primary method)

3. **Backend Server**
   - Node.js application
   - Provides RESTful API endpoints
   - Runs scheduled scraping jobs
   - Manages database operations

4. **Database**
   - MongoDB database
   - Stores company and performance data
   - Provides persistence between scraping runs

## Design Patterns

### Frontend Patterns

1. **Module Pattern**
   - Each JavaScript file is structured as a self-contained module
   - Private and public methods separated through closures
   - Example: `DataService`, `UIController`, etc.

2. **Revealing Module Pattern**
   - Only exposes necessary public methods and properties
   - Keeps implementation details private
   - Used in all major JavaScript components

3. **Observer Pattern**
   - UI updates in response to data changes
   - Event-driven architecture for user interactions
   - Implemented through event listeners and callbacks

4. **Facade Pattern**
   - `DataService` provides a simplified interface to data operations
   - Hides complexity of data fetching, processing, and error handling
   - Presents consistent API regardless of data source

### Backend Patterns

1. **MVC Pattern**
   - Models: MongoDB schemas (Company, Performance)
   - Controllers: Route handlers in routes directory
   - Views: JSON responses from API endpoints

2. **Repository Pattern**
   - Scrapers encapsulate data retrieval logic
   - Database models provide data access abstraction
   - Separation of concerns between data access and business logic

3. **Adapter Pattern**
   - Scrapers adapt external website data to internal data model
   - Consistent internal representation regardless of source format
   - Allows for easy addition of new ballet company scrapers

4. **Scheduler Pattern**
   - Cron-based scheduling for regular scraping jobs
   - Configurable intervals via environment variables
   - Ensures data freshness without manual intervention

## Data Flow

### Frontend Data Flow

```
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  Data Service │───▶│ UI Controller │───▶│  DOM Updates  │
└───────┬───────┘    └───────────────┘    └───────────────┘
        │
        │
┌───────▼───────┐
│  API / Scraper │
└───────────────┘
```

1. `DataService` requests data from API or falls back to scraping
2. `UIController` processes data and prepares for display
3. DOM is updated with the processed data

### Backend Data Flow

```
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   Scrapers    │───▶│  Data Models  │───▶│ API Endpoints │
└───────┬───────┘    └───────────────┘    └───────────────┘
        │
        │
┌───────▼───────┐
│ External Sites │
└───────────────┘
```

1. Scrapers fetch data from external ballet company websites
2. Data is normalized and stored in MongoDB via data models
3. API endpoints expose the stored data to the frontend

## Key Implementation Paths

### Performance Data Path

1. Scraper retrieves performance data from ballet company website
2. Data is normalized to internal model format
3. Normalized data is stored in MongoDB
4. Frontend requests performance data via API
5. Data is processed by `DataService`
6. `UIController` renders performance cards or timeline
7. User views performance information

### Company Information Path

1. Scraper retrieves company information from official website
2. Information is normalized to internal model format
3. Normalized data is stored in MongoDB
4. Frontend requests company data via API
5. Data is processed by `DataService`
6. `UIController` renders company profile page
7. User views company information

## Error Handling Patterns

1. **Graceful Degradation**
   - Fallback to mock data when scraping or API fails
   - Ensures user always sees content even during failures

2. **Centralized Error Handling**
   - Frontend: Errors captured in `DataService`
   - Backend: Global error middleware for API routes

3. **Retry Logic**
   - Automatic retry for failed scraping attempts
   - Exponential backoff to avoid overwhelming external sites

## Extensibility Patterns

1. **Plugin Architecture for Scrapers**
   - Each scraper is a standalone module
   - Common interface for all scrapers
   - New scrapers can be added without modifying existing code

2. **Configuration-Driven Behavior**
   - Environment variables control server behavior
   - Easily configurable scraping schedules and database connections

3. **API Versioning**
   - API routes structured to support versioning
   - Ensures backward compatibility as the system evolves
