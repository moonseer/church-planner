# Church Planner - UI Design Document

This document outlines the UI design philosophy, key components, and user flows for the Church Planner application.

## UI Design Philosophy

The Church Planner UI is designed with these core principles:

1. **Clarity Over Complexity**: Information is presented in a clear, digestible manner without overwhelming the user.
2. **Context-Aware Actions**: Tools and actions are presented when and where they're needed.
3. **Consistent Patterns**: Similar actions work the same way throughout the application.
4. **Forgiving Design**: Mistakes are easy to undo, and confirmation is required for destructive actions.
5. **Progressive Disclosure**: Advanced features are available but don't clutter the interface for basic tasks.

## Color Scheme

- **Primary**: #3B82F6 (Blue) - Represents trust, stability, and faith
- **Secondary**: #10B981 (Green) - Represents growth and success
- **Accent**: #8B5CF6 (Purple) - Represents creativity and spirituality
- **Neutrals**: Shades of gray from #F9FAFB (lightest) to #1F2937 (darkest)
- **Semantic Colors**:
  - Success: #10B981 (Green)
  - Warning: #FBBF24 (Yellow)
  - Error: #EF4444 (Red)
  - Info: #3B82F6 (Blue)

## Typography

- **Headings**: Inter (Sans-serif), bold weights
- **Body**: Inter (Sans-serif), regular weight
- **Accents**: Inter (Sans-serif), medium weight
- **Scale**:
  - H1: 2.5rem
  - H2: 2rem
  - H3: 1.5rem
  - H4: 1.25rem
  - Body: 1rem
  - Small: 0.875rem

## Key UI Components

### 1. Navigation System

- **Top Navigation Bar**:
  - Logo/App name
  - Global search
  - Notifications
  - User profile menu
  - Help/support access

- **Sidebar Navigation**:
  - Dashboard link
  - Services planning
  - Teams/Volunteers
  - Song Library
  - Reports
  - Settings
  - Collapsible for mobile views

### 2. Dashboard

- **Overview Cards**:
  - Upcoming services
  - Pending volunteer responses
  - Recent activity
  - Quick actions

- **Calendar View**:
  - Month/week/day toggle
  - Service indicators
  - Rehearsal indicators
  - Click to expand/create

### 3. Service Planning Interface

- **Service List**:
  - Filterable by date, type, campus
  - Quick status indicators
  - Drag to reorder

- **Service Detail View**:
  - Timeline-based layout
  - Drag-and-drop item ordering
  - Inline editing of service items
  - Time indicators and warnings
  - Team assignments panel
  - Notes and attachments section

- **Service Item Types**:
  - Songs (with key, arrangement)
  - Scripture readings
  - Prayers
  - Announcements
  - Custom elements
  - Media elements

### 4. Volunteer Management

- **Team Roster**:
  - Filterable by ministry, role, availability
  - Status indicators
  - Quick contact options

- **Scheduling Interface**:
  - Calendar-based view
  - Drag-and-drop assignment
  - Conflict indicators
  - Availability overlays
  - Bulk scheduling tools

- **Volunteer Profile**:
  - Contact information
  - Role assignments
  - Availability settings
  - Service history
  - Notes and preferences

### 5. Song Library

- **Song Browser**:
  - Search with filters (title, author, theme, key)
  - Grid/list toggle view
  - Usage statistics
  - Last used indicator

- **Song Detail View**:
  - Lyrics with chord overlays
  - Key transposition controls
  - Arrangement sections
  - Attachment links (charts, audio)
  - Usage history
  - Related songs

### 6. Communication Tools

- **Announcement System**:
  - Target audience selection
  - Delivery method options
  - Scheduling options
  - Response tracking

- **Comment Threads**:
  - Contextual to service items
  - @mentions
  - Attachment support
  - Notification controls

- **Direct Messaging**:
  - Individual and group options
  - Media sharing
  - Read receipts
  - Availability indicators

## Key User Flows

### 1. Creating a New Service

1. User navigates to Services section
2. Clicks "Create New Service" button
3. Selects service template or starts from scratch
4. Sets date, time, and location
5. Adds service items via drag-and-drop from library or creates new items
6. Assigns teams and individuals to service roles
7. Adds notes and attachments
8. Publishes service plan to team

### 2. Scheduling Volunteers

1. User navigates to Teams section
2. Selects specific ministry team
3. Views calendar with service needs
4. Drags volunteers to positions or uses "Auto-Schedule" feature
5. System checks for conflicts and availability
6. User reviews and confirms assignments
7. System sends notifications to scheduled volunteers

### 3. Managing Song Library

1. User navigates to Songs section
2. Can browse, search, or filter existing songs
3. Clicks "Add Song" to create new entry
4. Enters song details, lyrics, and chord charts
5. Uploads or links to resources (audio, video, charts)
6. Tags song with themes, occasions, and categories
7. Saves to library for use in services

### 4. Mobile Experience Considerations

- Simplified navigation with bottom bar for primary actions
- Swipe gestures for common actions
- Optimized touch targets for all interactive elements
- Reduced information density compared to desktop
- Offline capabilities for viewing assigned services

## Accessibility Considerations

- High contrast mode option
- Screen reader compatibility
- Keyboard navigation support
- Text size adjustment
- Color blindness accommodations

## Responsive Design Breakpoints

- **Mobile**: < 640px
- **Tablet**: 641px - 1024px
- **Desktop**: 1025px - 1440px
- **Large Desktop**: > 1440px

## UI Component Library

We will use a customized version of a component library (like Tailwind UI or Material UI) to ensure consistency and reduce development time. Custom components will be created for domain-specific needs.

## Prototyping and Testing

- Low-fidelity wireframes for initial layout and flow validation
- High-fidelity mockups for visual design approval
- Interactive prototypes for user testing
- A/B testing for critical workflows
- Regular usability testing with actual church staff and volunteers 