# Admin Application PRD (Product Requirements Document)

> **Document Information**
>
> - **Created**: 2025-01-XX
> - **Version**: 1.0.0

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication & Authorization](#authentication--authorization-prd)
3. [Dashboard](#dashboard-prd)
4. [Test Management](#test-management-prd)
5. [Category Management](#category-management-prd)
6. [Series Management](#series-management-prd)
7. [Theme Management](#theme-management-prd)
8. [User Management](#user-management-prd)
9. [User Response Management](#user-response-management-prd)
10. [Feedback Management](#feedback-management-prd)
11. [Analytics](#analytics-prd)
12. [Growth Analysis](#growth-analysis-prd)
13. [Common Components & Layout](#common-components--layout-prd)

---

# Overview

## 1. Purpose

This document outlines the product requirements for the Admin Application of the Pickid service. The admin application is a management dashboard designed for administrators to create, manage, and analyze tests, users, and content on the platform.

## 2. Target Users

The admin application is designed for:

- **Administrators**: Staff members responsible for content creation, user management, and platform operations
- **Content Managers**: Users who create and manage tests, categories, and other content
- **Analysts**: Users who monitor analytics and performance metrics

## 3. System Architecture

The admin application follows a **Layered Architecture** pattern:

- **Presentation Layer**: Pages and UI components
- **Business Logic Layer**: React hooks and state management
- **Data Access Layer**: Service layer for API calls
- **Infrastructure Layer**: Utilities, types, and shared libraries

## 4. Technology Stack

- **Framework**: React 18 with Vite
- **Routing**: React Router
- **State Management**: TanStack Query, React Hook Form
- **UI Components**: Custom components based on shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Validation**: Zod

---

# Authentication & Authorization PRD

## 1. Overview

### 1.1. Page Information

- **Page Path**: `/auth`
- **Page Type**: Authentication page
- **Access Permission**: Public access, but authenticated users are redirected to dashboard

### 1.2. Page Purpose

The Admin Login Page provides secure access to the admin dashboard. It ensures that only authorized administrators can access the management interface.

### 1.3. User Scenarios

- **Admin Login**: An administrator enters their email and password to access the dashboard
- **Auto-redirect**: An already authenticated admin is automatically redirected to the dashboard
- **Failed Login**: An administrator enters incorrect credentials and receives an error message

---

## 2. Login Form

### 2.1. Functional Requirements

- **Email Input**: Users must enter their registered email address
- **Password Input**: Users must enter their password
- **Password Visibility Toggle**: Users can toggle password visibility
- **Form Validation**: Both fields are required before submission
- **Submit Action**: Form submission triggers authentication

### 2.2. UI Requirements

- **Form Layout**: Centered form with email and password fields
- **Input Fields**: Email and password inputs with icons
- **Password Toggle**: Eye icon button to show/hide password
- **Submit Button**: Primary action button for login
- **Error Display**: Error messages displayed below the form

### 2.3. Interaction Requirements

- **Auto-fill**: Form supports browser auto-fill for saved credentials
- **Enter Key**: Pressing Enter in password field submits the form
- **Error Handling**: Invalid credentials display error message
- **Loading State**: Submit button shows loading state during authentication

---

## 3. Authentication Flow

### 3.1. Functional Requirements

- **Session Management**: Successful login creates a session
- **Auto-redirect**: Authenticated users are redirected to dashboard
- **Route Protection**: Unauthenticated users are redirected to login page
- **Session Persistence**: User session persists across page refreshes

### 3.2. Error Handling

- **Invalid Credentials**: Display error message for incorrect email/password
- **Network Errors**: Display error message for connection issues
- **Server Errors**: Display generic error message for server-side issues

---

# Dashboard PRD

## 1. Overview

### 1.1. Page Information

- **Page Path**: `/` (root path)
- **Page Type**: Dashboard/Overview page
- **Access Permission**: Authenticated administrators only

### 1.2. Page Purpose

The Dashboard provides administrators with a comprehensive overview of the platform's key metrics and quick access to important actions.  
It serves as the central hub for:

- Monitoring daily activity (tests, responses, visitors, shares)
- Quickly identifying which tests are performing well
- Highlighting “today’s featured test/theme” aligned with content strategy
- Navigating to deeper analytics and content management pages

### 1.3. User Scenarios

- **Daily Check**: An administrator logs in and checks today's key metrics to understand platform activity
- **Quick Action**: An administrator wants to quickly create a new test from the dashboard
- **Performance Monitoring**: An administrator reviews popular tests and completion rates
- **Campaign Operation**: An administrator reviews today’s featured test/theme and checks if it is performing as expected

---

## 2. Page Structure

### 2.1. Overall Layout

The dashboard is composed of the following sections:

1. **Page Header**: Title, description, and quick action button
2. **KPI Cards**: Key performance indicator cards (tests, responses, visitors, completion, shares, session behavior)
3. **Real-time Activity Notice**: Information about accessing real-time data
4. **Popular Tests Card**: Top tests by today's responses
5. **Today’s Highlight Section**: Highlighted “Today’s Test / Today’s Theme” for operation
6. **Quick Actions Card**: Shortcuts to common tasks

> _Note: Layout may use a responsive grid (e.g., 2×2 for KPI, 2-column grid for cards below)._

---

## 3. KPI Cards

### 3.1. Functional Requirements

The dashboard MUST display the following core KPIs:

- **Active Tests**

  - Displays count of published tests
  - Subtitle: total tests (published + draft + scheduled)

- **Today's Responses**

  - Shows today's response count
  - Displays growth indicator vs. previous comparable period (e.g., yesterday or last week same day)

- **Today's Visitors**

  - Displays today's visitor count
  - Shows growth indicator vs. previous period

- **Completion Rate**
  - Shows recent (e.g., weekly) average completion rate percentage
  - Indicates if completion rate is trending up or down

Additional KPIs (recommended but optional, configurable):

- **Today's Shares**

  - Total number of share events (result screen share actions) today
  - Growth indicator vs. previous period
  - Helps understand viral/word-of-mouth performance

- **Avg Tests per Session (Today)**
  - Average number of completed tests per session today  
    (e.g., total completed tests ÷ total sessions)
  - Indicates whether users are consuming multiple tests in a single visit

### 3.2. UI Requirements

- **Card Layout**

  - KPI cards displayed in a responsive grid (e.g., 2 or 3 columns depending on screen width)
  - Optional: allow “extended KPIs” (shares, avg tests per session) to be hidden/shown

- **Iconography**

  - Each card displays a relevant icon (tests, responses, visitors, share, etc.)

- **Values**

  - Large, prominent numbers for key metrics
  - Clear units (e.g., `%` for completion rate, plain number for counts)

- **Growth Indicators**

  - Trend icons (up/down/neutral)
  - Percentage change vs. previous period
  - Tooltip explaining comparison basis (e.g., vs. previous 7 days)

- **Subtitles**
  - Additional context (e.g., “of 124 total tests”, “vs. yesterday”)

### 3.3. Interaction Requirements

- **Clickable Cards (Optional)**

  - KPI cards may link to detailed views:
    - Active Tests → Test list page
    - Responses/Completion → Analytics overview
    - Shares → Test analytics “share performance” tab

- **Data Refresh**
  - Values update on page reload
  - Optional manual refresh button

---

## 4. Real-time Activity Notice

### 4.1. Functional Requirements

- **Information Display**

  - Informs administrators that more accurate real-time data is available in Google Analytics (GA4)
  - Explains that the dashboard focuses on “summary KPIs” rather than second-by-second real-time data

- **Navigation Hint**
  - Provides guidance on where to find real-time data in GA4
  - May include:
    - “Realtime > Overview”
    - “Realtime user map and event streams”

### 4.2. UI Requirements

- **Notice Card**

  - Prominent but non-intrusive informational card
  - Title, short description, and optional icon

- **Clear Messaging**
  - Concise explanation that GA4 should be used for deep real-time monitoring

---

## 5. Popular Tests Card

### 5.1. Functional Requirements

- **Top Tests Display**

  - Shows top 3 tests by today's response count
  - Optionally sorted by a composite score (responses + completion rate + shares)

- **Test Information**

  - Test title
  - Response count (today)
  - Start count (today)
  - Completion rate (today or last 7 days)
  - Optional: share count (today)

- **Ranking**

  - Displays rank number (1, 2, 3) for each test

- **Navigation**

  - “View All” button links to test list or analytics overview page filtered by period

- **Empty State**
  - Displays a friendly message when no test data is available (e.g., no responses today)

### 5.2. UI Requirements

- **Card Layout**

  - Card with header (title, “View All” action) and content list

- **List Display**

  - Each row contains:
    - Rank badge
    - Test title
    - Key metrics grouped (responses, completion rate, optional shares)

- **Trend Icons**

  - Optional trend indicator per test (e.g., “hot”, “rising”, “falling” based on responses/share delta vs. previous period)

- **Empty State**
  - Simple illustration/icon and short message
  - Optional CTA: “Create a new test”

### 5.3. Interaction Requirements

- **Test Click**

  - Clicking a test row may navigate to the Test Analytics Detail page

- **View All**
  - Navigates to analytics overview or tests list with a filter applied (e.g., recent 7 days)

---

## 6. Today’s Highlight Section (Today’s Test / Theme)

### 6.1. Functional Requirements

This section connects content strategy (themes/series) with dashboard visibility.

- **Today's Featured Test**

  - Shows one featured test for today
  - Selection logic options:
    - Manually pinned in admin (highest priority)
    - Or automatically chosen from top performing recent tests (responses + shares)

- **Today's Theme (Optional)**

  - Displays current running theme or campaign (e.g., “Exam Season”, “Year-End Reflection”, “Valentine Week”)
  - Shows short description and time range

- **Related Tests List**
  - List up to 3 tests associated with current theme (if theme exists)
  - For each test:
    - Title
    - Category/series
    - Today’s responses and shares

### 6.2. UI Requirements

- **Card Layout**

  - Single card or 2-column layout:
    - Left: Featured Test
    - Right: Today’s Theme & related tests

- **Featured Test Display**

  - Test badge with category
  - Key metrics (responses, completion rate, shares)
  - “View Analytics” / “Edit Test” quick links

- **Theme Display**
  - Theme name
  - Date range
  - Short copy describing the intent

### 6.3. Interaction Requirements

- **Featured Test Actions**

  - “View Analytics” → navigates to Test Analytics Detail page
  - “Edit Test” → navigates to Test Edit page

- **Theme Interaction**
  - Theme title may link to a filtered Analytics view (showing tests under that theme)

---

## 7. Quick Actions Card

### 7.1. Functional Requirements

- **Action Links**
  - Provides quick access to frequently used pages or actions, such as:
    - Create new test
    - Go to test list
    - Open analytics overview
    - Go to category/series management

### 7.2. UI Requirements

- **Card Layout**

  - Card with list of buttons or link items

- **Clear Labels**
  - Each action has a descriptive label and optional icon

### 7.3. Interaction Requirements

- **Action Navigation**
  - Clicking an action navigates to the relevant page or opens a modal

---

## 8. Data Refresh

### 8.1. Functional Requirements

- **Initial Load**

  - Data loads when page is accessed

- **Last Updated**

  - Displays timestamp of last data update (e.g., “Updated 5 minutes ago”)

- **Auto Refresh (Optional)**
  - Data may automatically refresh at configured intervals
  - Manual refresh button triggers data reload

---

# Test Management PRD

## 1. Overview

### 1.1. Page Information

- **Test List Path**: `/tests`
- **Test Create Path**: `/tests/create`
- **Test Edit Path**: `/tests/:testId/edit`
- **Page Type**: Content management pages
- **Access Permission**: Authenticated administrators only

### 1.2. Page Purpose

The Test Management section allows administrators to view, create, edit, and manage all tests on the platform.

It provides:

- A central place to manage all tests (search, filter, bulk operations)
- Configuration of **content metadata** such as category, series, theme, and featured slots
- Tools to support **content strategy and operations** (priorities, target publish date, internal notes)

### 1.3. User Scenarios

- **Test Creation**: An administrator creates a new test through a multi-step wizard
- **Test Editing**: An administrator updates an existing test's information, questions, results, and metadata
- **Test Management**: An administrator searches, filters, and manages multiple tests
- **Bulk Operations**: An administrator publishes or deletes multiple tests at once
- **Content Strategy**: An administrator assigns tests to categories, series, themes, and featured slots for campaigns

---

## 2. Test List Page

### 2.1. Overview

The Test List Page displays all tests in the system with filtering, searching, and management capabilities.  
It also surfaces key content metadata (category, type, series, theme, featured slot) so operators can manage tests as “content assets”, not just records.

---

### 2.2. Statistics Cards

#### 2.2.1. Functional Requirements

- **Total Tests**  
  Displays count of all tests

- **Published**  
  Shows count of published tests

- **Draft**  
  Displays count of draft tests

- **Scheduled**  
  Shows count of scheduled tests

- **Total Responses**  
  Displays total response count across all tests

> (Share/viral metrics are handled mainly in Analytics/Dashboard; here focus is inventory-level stats.)

#### 2.2.2. UI Requirements

- **Card Grid**  
  Five statistics cards displayed horizontally (responsive grid on smaller screens)

- **Clear Labels**  
  Each card has a descriptive label

- **Large Numbers**  
  Prominent display of metric values

---

### 2.3. Search & Filters

#### 2.3.1. Functional Requirements

- **Search**

  - Text input to search tests by title or description

- **Status Filter**

  - Dropdown to filter by test status:
    - All
    - Published
    - Draft
    - Scheduled

- **Test Type Filter**

  - Filter by test type:
    - Psychology
    - Balance
    - Character Matching
    - Quiz
    - Meme
    - Lifestyle

- **Category Filter**

  - Filter by main content category (aligned with content strategy), e.g.:
    - Relationship
    - School/College Life
    - Friends/Relationships
    - Self-development/Future
    - Meme/Trend

- **Series Filter (Optional)**

  - Filter by series (e.g., “Love Drama Series”, “Exam Season Series”)

- **Theme Filter (Optional)**

  - Filter by campaign/theme (e.g., “Exam Season 2025”, “Year-End 2025”)

- **Real-time Filtering**
  - Results update as filters are applied (client-side or server-side)

#### 2.3.2. UI Requirements

- **Filter Bar**

  - Horizontal bar containing:
    - Search input
    - Status dropdown
    - Test Type dropdown
    - Category/Series/Theme dropdowns (collapsible or in an “Advanced filters” section)

- **Search Input**

  - Text field with placeholder text (e.g., “Search by title or description…”)

- **Filter Dropdowns**
  - Select dropdowns with clear labels
  - Multi-select for category/series/theme (optional)

---

### 2.4. Bulk Actions

#### 2.4.1. Functional Requirements

- **Selection**

  - Users can select multiple tests via checkboxes

- **Publish Action**

  - Bulk publish selected tests

- **Unpublish Action**

  - Bulk unpublish selected tests

- **Delete Action**

  - Bulk delete selected tests

- **Clear Selection**
  - Button to deselect all tests

#### 2.4.2. UI Requirements

- **Action Bar**

  - Appears when tests are selected (sticky at top of list)

- **Action Buttons**

  - Buttons for each bulk action (Publish, Unpublish, Delete)

- **Selection Count**

  - Displays number of selected tests (e.g., “3 tests selected”)

- **Confirmation**
  - Delete action requires confirmation (e.g., modal with “type test name” or “type DELETE”)

---

### 2.5. Test Table

#### 2.5.1. Functional Requirements

- **Test Display**

  - Table showing all filtered tests

- **Column Information**

  - **Select**: Checkbox for row selection
  - **Test name/title**
  - **Test type**
    - Psychology / Balance / Character / Quiz / Meme / Lifestyle
  - **Main Category**
    - Relationship / School / Friends / Self-development / Meme, etc.
  - **Series / Episode (Optional)**
    - Series name + order (“Love Drama Series · EP2”)
  - **Theme (Optional)**
    - Linked campaign/theme (e.g., “Exam Season 2025”)
  - **Featured Slot (Optional)**
    - today_pick / theme_pick / none
  - **Status**
    - Published / Draft / Scheduled
  - **Response count**
  - **Creation date**
  - **Actions**
    - Edit
    - Change status (publish/unpublish)
    - Delete

- **Row Selection**

  - Checkbox for selecting individual tests (for bulk actions)

- **Row Click**
  - Clicking a row opens the test detail modal

#### 2.5.2. UI Requirements

- **Table Layout**

  - Responsive table with sortable columns
  - Fixed columns for essential info (Title, Status, Responses)

- **Status Badges**

  - Visual badges (e.g., Published=green, Draft=gray, Scheduled=blue)

- **Type & Category Badges**

  - Color-coded tags for test type and main category

- **Featured Indicator**

  - Small tag or icon for featured slots (e.g., “Today’s Pick”, “Theme Pick”)

- **Action Menu**
  - Dropdown or button group for actions (Edit / Publish / Unpublish / Delete)

---

### 2.6. Test Detail Modal

#### 2.6.1. Functional Requirements

- **Test Information**

  - Displays key metadata:
    - Title
    - Test type
    - Main category / subcategory
    - Series (name + order, if any)
    - Theme (if any)
    - Featured slot type
    - Status
    - Creation & last updated time

- **Operational Metadata**

  - Displays:
    - Priority (high/medium/low)
    - Target publish date (for draft/scheduled)
    - Internal notes / operation memo

- **Quick Actions**

  - Toggle publish status
  - Delete test
  - Mark as featured / un-feature
  - Edit metadata (category/series/theme/slot)

- **Navigation**
  - Link to edit page (full wizard)

#### 2.6.2. UI Requirements

- **Modal Overlay**

  - Full-screen or centered modal with scrollable content

- **Information Sections**

  - Basic Info (title, type, status)
  - Content Metadata (category, series, theme, featured slot)
  - Operational Metadata (priority, target publish date, internal notes)

- **Action Buttons**
  - Clear action buttons at bottom or in a header action bar

---

### 2.7. Pagination

#### 2.7.1. Functional Requirements

- **Page Navigation**

  - Navigate between pages of test results

- **Page Size**

  - Configurable items per page (e.g., 20, 50, 100)

- **Page Indicators**
  - Current page and total pages displayed

---

## 3. Test Creation Page

### 3.1. Overview

The Test Creation Page uses a multi-step wizard to guide administrators through creating a new test, including:

- Selecting test **type/format**
- Setting **basic info + content metadata** (category, series, theme, slots)
- Creating **questions**
- Configuring **results & share card info**
- Previewing and publishing

---

### 3.2. Step Indicator

#### 3.2.1. Functional Requirements

- **Step Display**

  - Visual indicator showing current step and total steps

- **Step Navigation**

  - Clickable steps to jump between completed steps

- **Progress Indication**
  - Clear visual indication of progress (e.g., “Step 2 of 5”)

#### 3.2.2. UI Requirements

- **Progress Bar**

  - Horizontal or vertical step indicator

- **Active Step**

  - Highlighted current step

- **Completed Steps**

  - Visual indication of completed steps (checkmarks)

- **Disabled Steps**
  - Future steps disabled until previous steps are completed

---

### 3.3. Step 1: Type Selection

#### 3.3.1. Functional Requirements

- **Type Selection**

  - User selects one of six test types:
    - **Psychology**: MBTI, personality analysis tests
    - **Balance**: Two-choice or multi-choice selection games
    - **Character Matching**: Character/IP matching tests
    - **Quiz**: Knowledge-based tests with correct answers
    - **Meme**: Meme/emoji matching tests
    - **Lifestyle**: Preference-based lifestyle tests

- **Type Information**

  - Each type displays description, features, and example use cases

- **Selection Validation**
  - Type must be selected before proceeding to the next step

#### 3.3.2. UI Requirements

- **Type Cards**

  - Grid or list of type option cards

- **Type Details**

  - Each card shows:
    - Type name
    - Short description
    - Typical question style
    - Example test titles

- **Selection State**
  - Visual indication of selected type (border, background, checkmark)

---

### 3.4. Step 2: Basic Information & Content Metadata

#### 3.4.1. Functional Requirements

##### Basic Test Information

- **Test Title** (required)

  - Text input for test name

- **Test Code** (optional)

  - Optional short code for sharing (auto-generatable)

- **Test Description**

  - Text area for test description (shown on detail page)

- **Start Text**

  - Optional introductory text shown before test starts

- **Thumbnail Upload**

  - Image upload for test thumbnail

- **Estimated Time**

  - Number input for estimated completion time (e.g., in minutes)

- **Max Score**

  - Number input for maximum possible score (for quiz/scoring types)

- **Gender Required**

  - Toggle for requiring gender selection before starting

- **Publish Status**
  - Toggle or select box for:
    - Draft
    - Publish immediately
    - Schedule publish (with date/time)

##### Content Metadata (Category / Series / Theme / Slot)

- **Main Category** (required)

  - Enum selection aligned with content strategy, e.g.:
    - Relationship / Love
    - School/College Life
    - Friends/People
    - Self-development/Future
    - Meme/Trend

- **Subcategory / Tags** (optional)

  - Free-text or tag-based input (e.g., “exam season”, “MBTI parody”)

- **Series Assignment** (optional)

  - Select existing series or create a new one
  - **Series name**
  - **Episode/order number** within the series (e.g., 1, 2, 3)

- **Theme Assignment** (optional)

  - Select active theme/campaign (e.g., “Exam Season 2025”, “Year-End 2025”)

- **Featured Slot Type** (optional)
  - Enum:
    - `none`
    - `today_pick` (candidate for “Today’s Test”)
    - `theme_pick` (highlight in theme block)

##### Operational Metadata

- **Production Priority**

  - Enum: high / medium / low

- **Target Publish Date**

  - Date input (for planning, especially for drafts)

- **Operation Notes / Internal Memo**
  - Text area for internal notes (not visible to users), e.g.:
    - “Use before exam week”
    - “Update results with new memes next month”

#### 3.4.2. UI Requirements

- **Form Layout**

  - Group fields into logical sections:
    - Basic Info
    - Content Metadata
    - Operational Metadata

- **Required Fields**

  - Visual indication of required fields (e.g., asterisk)

- **Image Preview**

  - Preview of uploaded thumbnail

- **Category & Metadata Controls**

  - Dropdowns for main category, series, theme, featured slot
  - Ability to create new series/theme (if permissions allow)

- **Toggle Switches**
  - For boolean options (Gender Required, Publish Status modes)

---

### 3.5. Step 3: Question Creation

#### 3.5.1. Functional Requirements

- **Question Management**

  - Add, delete, and reorder questions

- **Question Text**

  - Text input for question content

- **Question Image**

  - Optional image upload for each question

- **Question Type**

  - Select between:
    - Multiple choice
    - Short answer
    - (Optional: scale or other typologies in future)

- **Choice Management (for multiple choice)**

  - Add, delete, and reorder choices for each question

- **Choice Text**

  - Text input for each choice

- **Choice Score / Codes**

  - Number input for scoring
  - Optional: code/tag per choice for mapping to result types

- **Correct Answer (Quiz Type)**

  - Mark correct answers for quiz-type tests

- **Explanation**
  - Optional text for answer explanations (for quiz)

#### 3.5.2. UI Requirements

- **Question List**

  - Expandable or accordion-style list of questions

- **Question Editor**

  - Inline or side panel form for editing individual questions

- **Choice List**

  - List of choices with drag-and-drop reordering

- **Image Upload**

  - Upload interface for question images with preview

- **Validation**
  - Visual feedback for required fields (e.g., question text, minimum 2 choices)

---

### 3.6. Step 4: Result Configuration

#### 3.6.1. Functional Requirements

- **Result Management**

  - Add, delete, and reorder results

- **Result Name**

  - Text input for result title

- **Result Description**

  - Text area for detailed description

- **Background Image**

  - Optional image upload for result background (used on results page)

- **Theme Color**

  - Color picker for result theme color (used in card UI)

- **Match Conditions**

  - Configure how results are matched:
    - Score range matching (min/max)
    - Choice code/tag matching
    - Composite conditions (optional future extension)

- **Result Features**

  - Configuration of extra attributes (e.g., icons, badges, short tags)

- **Gender Targeting**

  - Optional gender-specific targeting (e.g., result only for female/male)

- **Share Card Content (Optional, for viral performance)**
  - **Share Title**: Short, catchy one-liner shown on share image or meta
  - **Share Subtitle/Hook**: One sentence encouraging friends to take the test
  - **Hashtags/Tags (Optional)**: Tags or keywords used for OG/meta or share templates

#### 3.6.2. UI Requirements

- **Result List**

  - List of results with create/edit/delete controls

- **Result Editor**

  - Form for editing:
    - Name, description
    - Background image
    - Theme color
    - Matching conditions
    - Share card content

- **Color Picker**

  - UI component to select brand-consistent colors

- **Condition Builder**

  - Intuitive UI for defining conditions (range selectors, dropdowns, etc.)

- **Image Upload**
  - Upload interface with preview for background images

---

### 3.7. Step 5: Preview & Publish

#### 3.7.1. Functional Requirements

- **Test Information Preview**

  - Display all basic information and content metadata

- **Question Preview**

  - List all questions with choices

- **Result Preview**

  - List all results with descriptions and share card content

- **Checklist**

  - Validation checklist before publishing, e.g.:
    - Required fields filled
    - Minimum questions/results
    - Matching conditions valid
    - Category/series/theme set (if required by policy)

- **Save & Publish**

  - Button to save and publish test immediately

- **Schedule Publish**

  - If “scheduled” is selected, ensure date/time is set before confirming

- **Save as Draft**
  - Option to save without publishing

#### 3.7.2. UI Requirements

- **Preview Sections**

  - Organized display (accordion or tabbed) for:
    - Basic Info
    - Questions
    - Results

- **Checklist Items**

  - List of validation checks with status indicators (pass/fail)

- **Action Buttons**

  - Clear buttons for:
    - Save as Draft
    - Publish Now
    - Schedule

- **Validation Feedback**
  - Visual indication of missing or invalid fields, with links to the step where the issue exists

---

## 4. Test Edit Page

### 4.1. Overview

The Test Edit Page allows administrators to modify existing tests using the same multi-step wizard as creation.

### 4.2. Functional Requirements

- **Data Loading**

  - Existing test data (including content metadata and operational metadata) loads into the form

- **5-Step Process**

  - Same wizard steps as creation:
    - Type
    - Basic Info & Content Metadata
    - Questions
    - Results
    - Preview & Publish

- **Preview Link**

  - Link to view test on public site

- **Update Action**

  - Save changes to existing test
  - Option to:
    - Update immediately
    - Schedule updates (optional future feature)

- **Navigation**
  - Back button to return to test list

### 4.3. UI Requirements

- **Page Header**

  - Test title and back navigation

- **Preview Button**

  - External link button to view test on public site

- **Same Wizard**
  - Identical step structure and UI as creation page, with fields pre-filled

---

# Category Management PRD

## 1. Overview

### 1.1. Page Information

- **Page Path**: `/categories`
- **Page Type**: Content management page
- **Access Permission**: Authenticated administrators only

### 1.2. Page Purpose

The Category Management page allows administrators to create, edit, organize, and manage test categories. Categories help organize and filter tests for users.

### 1.3. User Scenarios

- **Category Creation**: An administrator creates a new category
- **Category Organization**: An administrator reorders categories by drag-and-drop
- **Bulk Management**: An administrator activates or deactivates multiple categories

---

## 2. Category List Page

### 2.1. Statistics Cards

#### 2.1.1. Functional Requirements

- **Total Categories**: Displays total count of categories
- **Active Categories**: Shows count of active categories
- **Inactive Categories**: Displays count of inactive categories

---

### 2.2. Search & Filters

#### 2.2.1. Functional Requirements

- **Search**: Text input to search categories by name
- **Status Filter**: Filter by active/inactive status
- **Action Buttons**: "Sort Order" and "Add" buttons

---

### 2.3. Bulk Actions

#### 2.3.1. Functional Requirements

- **Selection**: Select multiple categories via checkboxes
- **Bulk Activate**: Activate all selected categories
- **Bulk Deactivate**: Deactivate all selected categories
- **Clear Selection**: Deselect all categories

---

### 2.4. Category Table

#### 2.4.1. Functional Requirements

- **Category Display**: Table showing all categories
- **Column Information**:
  - Category name
  - Sort order
  - Status (active/inactive)
  - Creation date
  - Actions (edit, status change, delete)
- **Row Selection**: Checkbox for selecting categories

---

### 2.5. Category Create/Edit Modal

#### 2.5.1. Functional Requirements

- **Category Name**: Required text input
- **Slug**: Auto-generated or manual slug input
- **Sort Order**: Number input for display order
- **Status**: Toggle for active/inactive status
- **Save Action**: Create new or update existing category

#### 2.5.2. UI Requirements

- **Modal Form**: Centered modal with form fields
- **Validation**: Required field validation
- **Action Buttons**: Save and cancel buttons

---

### 2.6. Category Sort Modal

#### 2.6.1. Functional Requirements

- **Drag and Drop**: Reorder categories by dragging
- **Visual Feedback**: Clear indication during drag operation
- **Save Order**: Button to save new sort order
- **Cancel**: Option to cancel without saving

#### 2.6.2. UI Requirements

- **Sortable List**: List with drag handles
- **Preview**: Visual preview of new order
- **Save Button**: Confirm changes button

---

# Series Management PRD

## 1. Overview

### 1.1. Page Information

- **Page Path**: `/series`
- **Page Type**: Content management page
- **Access Permission**: Authenticated administrators only

### 1.2. Page Purpose

The Series Management page allows administrators to create, edit, organize, and manage test series. A series groups related tests that share a common theme or storyline (e.g., "Love Drama Episode 1, 2, 3").

### 1.3. Series vs Theme

| Aspect | Series | Theme |
|--------|--------|-------|
| Purpose | Group sequential/related tests (episode series) | Time-limited campaign/event grouping |
| Example | Love Drama EP1·2·3, MBTI Series | Exam Season Special, Christmas Event |
| Duration | Permanent (no end date) | Has start/end dates |
| Order | Important – Episode 1 → 2 → 3 | Not important |
| Use Cases | Next episode recommendation, Series completion rate | Campaign performance analysis, Main section display |

### 1.4. User Scenarios

- **Series Creation**: An administrator creates a new series for related tests
- **Series Organization**: An administrator manages tests within a series
- **Performance Analysis**: An administrator reviews series completion rates and episode-to-episode transitions

---

## 2. Series List Page

### 2.1. Statistics Cards

#### 2.1.1. Functional Requirements

- **Total Series**: Displays count of all series
- **Active Series**: Shows count of active series
- **Inactive Series**: Displays count of inactive series

---

### 2.2. Search & Filters

#### 2.2.1. Functional Requirements

- **Search**: Text input to search series by name
- **Status Filter**: Filter by active/inactive status
- **Action Buttons**: "Add" button for series creation

---

### 2.3. Series Table

#### 2.3.1. Functional Requirements

- **Series Display**: Table showing all series
- **Column Information**:
  - Series name
  - Test count (number of tests in series)
  - Sort order
  - Status (active/inactive)
  - Creation date
  - Actions (view details, edit, delete)
- **Row Click**: Opens series detail modal

#### 2.3.2. UI Requirements

- **Table Layout**: Responsive table with sortable columns
- **Status Badges**: Visual badges (Active=green, Inactive=gray)
- **Test Count**: Displayed as badge or number

---

### 2.4. Series Create/Edit Modal

#### 2.4.1. Functional Requirements

- **Series Name**: Required text input
- **Slug**: Auto-generated or manual slug input (unique)
- **Description**: Optional text area for series description
- **Thumbnail**: Optional image upload for series thumbnail
- **Sort Order**: Number input for display order (default: 100)
- **Status**: Toggle for active/inactive status
- **Save Action**: Create new or update existing series

#### 2.4.2. UI Requirements

- **Modal Form**: Centered modal with form fields
- **Slug Auto-generation**: Slug auto-generates from series name
- **Image Preview**: Preview of uploaded thumbnail
- **Validation**: Required field validation, unique slug check

---

### 2.5. Series Detail Modal

#### 2.5.1. Functional Requirements

- **Series Information**: Displays series metadata
  - Name, description, thumbnail
  - Sort order, status
  - Created/updated dates
- **Tests in Series**: List of tests belonging to this series
  - Test title
  - Episode order (series_order)
  - Test status (published/draft)
- **Quick Actions**:
  - Edit series
  - Delete series

#### 2.5.2. UI Requirements

- **Modal Layout**: Organized sections for series info and test list
- **Test List**: Ordered list showing episode sequence
- **Episode Order Display**: Clear indication of test order within series

---

### 2.6. Series Delete

#### 2.6.1. Functional Requirements

- **Confirmation Modal**: Requires confirmation before deletion
- **Warning Message**: If series contains tests, show warning:
  - "This series contains X tests. Deleting the series will remove series association from these tests."
- **Cascade Behavior**: Sets `series_id = null` for associated tests (does not delete tests)

---

## 3. Integration with Tests

### 3.1. Test Form Integration

#### 3.1.1. Functional Requirements

- **Series Selection**: Dropdown to select existing series in test creation/edit form
- **Episode Order**: Number input for position within series (series_order)
- **Create New Series**: "+ New Series" button opens series creation modal
- **No Series Option**: Tests without series function as standalone tests

### 3.2. Series Detail Test Management (Phase 2)

#### 3.2.1. Functional Requirements

- **View Tests**: Display all tests in series with episode order
- **Reorder Tests**: Drag-and-drop to change episode order (Phase 3)
- **Add Test**: Option to add existing test to series

---

## 4. Data Model

### 4.1. Series Data

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | PK |
| name | text | Series name |
| slug | text | URL slug (unique) |
| description | text | Series description |
| thumbnail_url | text | Thumbnail image URL |
| sort_order | int | Display order in series list (default: 100) |
| is_active | boolean | Active status (default: true) |
| created_at | timestamp | Creation date |
| updated_at | timestamp | Last update date |

> Note: Test's position within a series is stored in the `tests` table as `series_order`.

---

## 5. Implementation Priority

### Phase 1 (MVP)

1. Series list page with search and filter
2. Series create/edit/delete functionality
3. Sidebar navigation to series management
4. Test form series selection and episode order input

### Phase 2

1. Series detail modal with test list display
2. "+ New Series" button in test form
3. Basic series statistics

### Phase 3

1. Drag-and-drop test reordering in series detail
2. Series analytics (completion rate, episode transitions)
3. Series performance comparison

---

# Theme Management PRD

## 1. Overview

### 1.1. Theme Definition

**Theme**
- A grouping of tests for **time-limited campaigns/events**
- Examples:
  - `Exam Season Special`
  - `Christmas Event`
  - `Year-End Reflection Tests`

**Purpose**:
- Group tests by season/event for focused exposure
- Track campaign-specific performance (responses, shares, etc.)
- Easily configure "Theme Sections" on the main page

### 1.2. Series vs Theme (Concept Comparison)

| Aspect | Series | Theme |
|--------|--------|-------|
| Purpose | Sequential test grouping (episode series) | Time-limited campaign/event grouping |
| Examples | Love Drama EP1·2·3, MBTI Series | Exam Season Special, Christmas Event |
| Duration | Usually permanent (no end date) | Has start_date ~ end_date (or ongoing) |
| Order | Important (Episode 1, 2, 3…) | Not important |
| Use Cases | Next episode recommendation, series completion rate | Theme-based traffic/performance analysis, main banner/section exposure |

> This document covers **Theme only**. (See separate PRD for Series)

### 1.3. Page Information

- **Page Path**: `/themes`
- **Page Type**: Content management page
- **Access Permission**: Authenticated administrators only

### 1.4. User Scenarios

- **Theme Creation**: An administrator creates a new campaign theme
- **Campaign Management**: An administrator manages tests within a theme period
- **Performance Analysis**: An administrator reviews theme performance during and after campaign

---

## 2. Management Goals

| Item | Description |
|------|-------------|
| Feature Purpose | Administrators create/edit/delete themes to manage time-limited events |
| Core Value | Enable season/event-based content operations and **campaign-specific performance analysis** |
| Expected Benefits | - Systematic seasonal content management<br>- Theme-by-theme performance comparison<br>- Main/Home theme section integration |

---

## 3. Menu Structure

### 3.1. Navigation Placement (Same level as Series)

- Sidebar example:
  - Dashboard
  - Test Management
  - Series Management
  - **Theme Management**
  - Category Management
  - User Management …

> If a unified "Content Management" menu is created later, Tests/Categories/Series/Themes can be organized under it.
> This PRD assumes **Theme as an independent management target**.

---

## 4. Main Feature Flow

### 4.1. Theme List Page

#### 4.1.1. Functional Requirements

- **Theme List Display**
  - View all themes
  - Search: Search by theme name
  - Filter:
    - Active/Inactive
    - Status: Active / Upcoming / Ended / Ongoing

- **List Information**
  - Theme name
  - Period (start_date ~ end_date, or "Ongoing")
  - Test count
  - Status (Active/Upcoming/Ended/Ongoing/Inactive)
  - Creation date

- **Statistics Cards (Optional)**
  - Total themes
  - Active themes
  - Upcoming themes
  - Ended themes

#### 4.1.2. UI Requirements

- **Table Layout**: Responsive table with sortable columns
- **Period Display**: Format as "2025.01.01 ~ 2025.01.31" or "Ongoing"
- **Status Badges**: Color-coded status indicators

---

### 4.2. Theme Create/Edit

#### 4.2.1. Entry Point

- Click "+ New Theme" button → Opens modal or separate page

#### 4.2.2. Input Fields

| Field | Required | Description |
|-------|----------|-------------|
| Theme Name | ✅ | Theme/campaign name |
| URL Slug | Auto | Auto-generated from name, editable (unique) |
| Description | Optional | Theme description |
| Thumbnail | Optional | Representative image URL |
| Start Date | Optional | Campaign start date |
| End Date | Optional | Campaign end date |
| Active Status | ✅ | ON/OFF toggle (default: ON) |

#### 4.2.3. Behavior

- Slug auto-generates when theme name is entered
- Date handling cases:
  - Both empty → "Ongoing theme without time limit"
  - Only start_date → "Ongoing after start date" (policy can be refined)
- Validation:
  - Theme name required
  - Slug must be unique
  - start_date > end_date is not allowed

#### 4.2.4. UI Requirements

- **Modal Form**: Centered modal with form fields
- **Date Range Picker**: Date selection for start/end dates
- **Image Preview**: Preview of uploaded thumbnail
- **Validation**: Required field validation, unique slug check, date range validation

---

### 4.3. Theme Detail

#### 4.3.1. Entry Point

- Click "View Details" in list

#### 4.3.2. Display Content

**1. Basic Information**
- Theme name, description, thumbnail
- Period (start ~ end or Ongoing)
- Status, active status

**2. Tests in Theme**
- List of tests belonging to this theme
- Display info:
  - Test title
  - Status (published/draft)
  - (Optional) Category, series, etc.
- Phase 1: Simple list + "Go to test" link only
- Phase 2: Add/remove tests from theme detail (Phase 2)

**3. Theme Statistics (Future)**
- Response count during period
- Share count during period
- CTR for main/section exposure of this theme

---

### 4.4. Theme Delete

#### 4.4.1. Behavior

- Confirmation dialog on delete:
  - "This theme contains X tests. Deleting the theme will remove theme association from these tests."
- Actual processing:
  - Set `theme_id = null` for associated tests

#### 4.4.2. Policy

- Deleting theme does not delete the tests themselves
- If "theme archive" concept is needed later, discuss separately

---

## 5. Theme Status Definition

> Define "status badges" for UI display and internal logic criteria.

### 5.1. Status Types

- Active (진행중)
- Upcoming (예정)
- Ended (종료)
- Ongoing (상시)
- Inactive (비활성)

### 5.2. Status Logic (with Priority)

1. `is_active = false`
   → **Inactive**

2. `is_active = true` AND `start_date = null` AND `end_date = null`
   → **Ongoing**

3. Otherwise (`is_active = true` AND at least one date exists):
   - `today < start_date` → **Upcoming**
   - `start_date ≤ today ≤ end_date` → **Active**
   - `today > end_date` → **Ended**

> Policy Note:
> - If only start_date exists without end_date, whether to treat as "ongoing after that date" or "ongoing" can be decided based on actual operations.
> - Default: Only treat as "Ongoing" when both dates are null; otherwise use date-based status.

---

## 6. Data Model

### 6.1. Theme Data

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | PK |
| name | text | Theme/campaign name |
| slug | text | URL slug (unique) |
| description | text | Theme description |
| thumbnail_url | text | Thumbnail image URL |
| start_date | date | Campaign start date (optional) |
| end_date | date | Campaign end date (optional) |
| is_active | boolean | Active status (default: true) |
| created_at | timestamp | Creation date |
| updated_at | timestamp | Last update date |

> Sorting: Initially operate with "created_at desc" or "start_date latest first".
> If needed, add `sort_order` field for manual sort priority later (lower priority).

---

## 7. Integration with Tests

### 7.1. Test Form Theme Selection

- **Current**
  - Theme selection select box ✅ (0 or 1 theme per test)

- **Additional Suggestions**
  - Add "+ New Theme" button in theme selection area
    - Opens theme creation modal on click
  - If no theme selected → "No theme" state, exposed as regular test only

> Current structure assumes "1 test → max 1 theme".
> If "multiple themes" need arises later, add **junction table** between tests and themes for expansion.

### 7.2. Test Management from Theme Detail (Phase 2+)

Example UX:

- Theme: Exam Season Special (2025.05.01 ~ 2025.05.31)
  - Tests in Theme (5)
    - Exam Period Type Test
    - Study Style Test
    - …

- Features:
  - `[+ Add Test]` button: Select existing test to link to this theme
  - (Optional) Removing from list sets `theme_id = null`

---

## 8. Implementation Priority

### Phase 1 (MVP)

1. Theme list page with search and filter
2. Theme create/edit/delete functionality
3. Sidebar navigation to theme management
4. Test form theme selection (select box only)

### Phase 2

1. Theme detail view with test list display
2. **"+ New Theme"** modal integration in test form
3. Add/remove test connection from theme detail

### Phase 3

1. Theme statistics (responses, shares, etc.) dashboard tab
2. Main page "Theme Section" exposure rules linked to theme status
   - e.g., Only show Active + Ongoing themes

---

# User Management PRD

## 1. Overview

### 1.1. Page Information

- **Page Path**: `/users`
- **Page Type**: User management page
- **Access Permission**: Authenticated administrators only

### 1.2. Page Purpose

The User Management page allows administrators to view, manage, and analyze user accounts on the platform.

### 1.3. User Scenarios

- **User Search**: An administrator searches for a specific user by email
- **Status Management**: An administrator changes a user's status (active/inactive/deleted)
- **User Analysis**: An administrator views user details and participation history

---

## 2. User List Page

### 2.1. Statistics Cards

#### 2.1.1. Functional Requirements

- **Active Users**: Count of active users
- **Inactive Users**: Count of inactive users
- **Deleted Users**: Count of deleted users

---

### 2.2. User Sync

#### 2.2.1. Functional Requirements

- **Sync Button**: Button to synchronize user data
- **Sync Process**: Updates user data from authentication system
- **Loading State**: Shows sync progress

---

### 2.3. Search & Filters

#### 2.3.1. Functional Requirements

- **Search**: Text input to search users by email or name
- **Status Filter**: Filter by user status
- **Provider Filter**: Filter by sign-up method (email, Kakao, etc.)

---

### 2.4. Bulk Actions

#### 2.4.1. Functional Requirements

- **Selection**: Select multiple users
- **Bulk Activate**: Activate selected users
- **Bulk Deactivate**: Deactivate selected users
- **Bulk Delete**: Mark selected users as deleted

---

### 2.5. User Table

#### 2.5.1. Functional Requirements

- **User Display**: Table showing all users
- **Column Information**:
  - Email address
  - Name (with avatar)
  - Sign-up method
  - Status
  - Registration date
  - Actions (status change, delete)
- **Row Click**: Opens user detail modal

---

### 2.6. User Detail Modal

#### 2.6.1. Functional Requirements

- **User Information**: Displays user basic information
- **Test Participation**: Shows tests user has participated in
- **Response Statistics**: Displays user's response statistics

#### 2.6.2. UI Requirements

- **Modal Layout**: Organized sections for different information types
- **Data Tables**: Tables for participation and statistics

---

# User Response Management PRD

## 1. Overview

### 1.1. Page Information

- **Page Path**: `/responses`
- **Page Type**: Analytics page
- **Access Permission**: Authenticated administrators only

### 1.2. Page Purpose

The User Response Management page provides comprehensive analysis of user responses to tests, including completion rates, device distribution, and time metrics.

### 1.3. User Scenarios

- **Response Analysis**: An administrator analyzes overall response patterns
- **Device Analysis**: An administrator reviews device distribution for responses
- **Performance Monitoring**: An administrator monitors completion rates and average completion times

---

## 2. Response Analysis Page

### 2.1. Page Header

#### 2.1.1. Functional Requirements

- **Page Title**: "Response Analysis" heading
- **Description**: Brief description of page purpose

---

### 2.2. Response Filters

#### 2.2.1. Functional Requirements

- **Search**: Text input to search responses
- **Test Filter**: Dropdown to filter by specific test
- **Category Filter**: Dropdown to filter by category
- **Device Filter**: Filter by device type (mobile/desktop/tablet)
- **Date Range**: Date picker for filtering by date range
- **Export**: Button to export filtered data

---

### 2.3. Response Statistics Cards

#### 2.3.1. Functional Requirements

- **Total Responses**: Count of all responses
- **Completed Responses**: Count of completed responses
- **Completion Rate**: Percentage of completed vs total responses
- **Average Completion Time**: Average time to complete tests
- **Mobile Ratio**: Percentage of mobile device responses
- **Unique Users**: Count of unique users who responded

---

### 2.4. Detailed Statistics

#### 2.4.1. Functional Requirements

- **Device Distribution**: Breakdown by device type
- **Completion Status**: Detailed completion statistics
- **Time Analysis**: Average completion time breakdown

---

# Feedback Management PRD

## 1. Overview

### 1.1. Page Information

- **Page Path**: `/feedbacks`
- **Page Type**: Content management page
- **Access Permission**: Authenticated administrators only

### 1.2. Page Purpose

The Feedback Management page allows administrators to view, manage, and respond to user feedback and suggestions submitted through the platform.

### 1.3. User Scenarios

- **Feedback Review**: An administrator reviews new feedback submissions
- **Status Management**: An administrator updates feedback status (pending, in progress, completed, rejected)
- **Response**: An administrator replies to user feedback

---

## 2. Feedback List Page

### 2.1. Statistics Cards

#### 2.1.1. Functional Requirements

- **Total**: Count of all feedback
- **Pending**: Count of pending feedback
- **In Progress**: Count of in-progress feedback
- **Completed**: Count of completed feedback
- **Replied**: Count of feedback with admin replies
- **Rejected**: Count of rejected feedback

---

### 2.2. Search & Filters

#### 2.2.1. Functional Requirements

- **Search**: Text input to search feedback by title or content
- **Status Filter**: Filter by feedback status
- **Category Filter**: Filter by feedback category

---

### 2.3. Bulk Actions

#### 2.3.1. Functional Requirements

- **Selection**: Select multiple feedback items
- **Bulk Status Change**: Change status of selected items
- **Actions Available**:
  - Mark as "In Progress"
  - Mark as "Completed"
  - Reject

---

### 2.4. Feedback Table

#### 2.4.1. Functional Requirements

- **Feedback Display**: Table showing all feedback
- **Column Information**:
  - Title (with content preview)
  - File attachment indicator
  - Category
  - Author name
  - Status
  - Creation date
  - View count
  - Actions (reply, status change, delete)
- **Row Click**: Opens feedback detail modal

---

### 2.5. Feedback Detail Modal

#### 2.5.1. Functional Requirements

- **Feedback Information**: Displays full feedback content
- **File Attachments**: Shows attached files if any
- **Reply Button**: Button to open reply modal
- **Status Display**: Current feedback status

---

### 2.6. Feedback Reply Modal

#### 2.6.1. Functional Requirements

- **Reply Form**: Text area for admin reply
- **Save Reply**: Button to save and send reply
- **Reply Display**: Shows existing reply if already replied

---

# Analytics PRD

## 1. Overview

### 1.1. Page Information

- **Analytics Overview Path**: `/analytics`
- **Test Analytics Detail Path**: `/analytics/tests/:testId`
- **Page Type**: Analytics and reporting pages
- **Access Permission**: Authenticated administrators only

### 1.2. Page Purpose

The Analytics section provides:

- Comprehensive performance analysis for tests
- Response and completion metrics across all tests
- Detailed analysis per test, including:
  - Completion rates and drop-off points
  - Result distribution
  - Share performance (how often results are shared, by which channels)
  - Category/series/theme-level performance

### 1.3. User Scenarios

- **Performance Overview**: An administrator reviews overall test performance metrics
- **Test Analysis**: An administrator analyzes specific test performance in detail
- **Trend Analysis**: An administrator reviews trends (responses, completion, shares) over time
- **Funnel Analysis**: An administrator analyzes drop-off rates at each question
- **Content Strategy**: An administrator compares categories/series/themes to decide what to create next

---

## 2. Analytics Overview Page

### 2.1. Statistics Cards

#### 2.1.1. Functional Requirements

The overview page displays high-level statistics across all tests:

- **Total Tests**

  - Count of all tests

- **Published Tests**

  - Count of tests with published status

- **Draft Tests**

  - Count of tests in draft status

- **Scheduled Tests**

  - Count of tests scheduled for future publishing

- **Total Responses**

  - Total response count across all tests (in selected time range)

- **Overall Completion Rate**
  - Completion rate across all tests

Optional / recommended additional cards:

- **Total Shares**

  - Total share events across all tests (in selected time range)

- **Avg Tests per Session**
  - Average completed tests per session over the selected time range

---

### 2.2. Search & Filters

#### 2.2.1. Functional Requirements

- **Search**

  - Text input to search tests by name

- **Status Filter**

  - Filter by test status:
    - All
    - Published
    - Draft
    - Scheduled

- **Category Filter**

  - Filter tests by category (e.g., Relationship, School, Friends, Self-development, Meme)

- **Time Range Filter**
  - Filter metrics by:
    - Last 7 days
    - Last 30 days
    - Last 90 days
    - Custom date range (optional)

---

### 2.3. Test Analytics Table

#### 2.3.1. Functional Requirements

- **Test Display**

  - Table showing all tests with aggregated analytics

- **Column Information**

  - Test name
  - Status
  - Category (and optional series/theme badge)
  - Response count
  - Completion rate (with visual progress bar)
  - Average completion time
  - Share count (optional)
  - Creation date

- **Row Click**
  - Navigates to Test Analytics Detail page for the selected test

---

### 2.4. Category & Series Analytics Summary (Optional)

#### 2.4.1. Functional Requirements

Provide a high-level summary by **category** and **series**:

- **Category Summary Table**

  - Category name
  - Number of tests in category
  - Total responses
  - Average completion rate
  - Total shares

- **Series Summary Table (if series feature is used)**
  - Series name
  - Number of tests in series
  - Total responses
  - Average completion rate
  - Average tests per session within the series

#### 2.4.2. UI Requirements

- Collapsible section or dedicated tab below the main test table
- Simple tables or cards with sorting by responses/completion/shares

---

## 3. Test Analytics Detail Page

### 3.1. Analytics Header

#### 3.1.1. Functional Requirements

- **Test Information**

  - Test title
  - Status
  - Category, series, and theme information (if any)
  - Basic metadata (e.g., created date)

- **Time Range Selector**

  - Dropdown or date range picker to change analysis period:
    - Last 7 days
    - Last 30 days
    - Last 90 days
    - Custom range

- **Back Button**
  - Returns to analytics overview page

---

### 3.2. Analytics Statistics Cards

#### 3.2.1. Functional Requirements

Display key metrics for the selected test (within selected time range):

- **Responses**

  - Total response count

- **Completions**

  - Total completion count

- **Completion Rate**

  - Percentage of completions vs responses

- **Average Time**

  - Average completion time per user

- **Average Score (if applicable)**

  - Average score for quiz-type tests

- **Device Distribution**
  - Breakdown by device type (e.g., mobile/desktop/tablet, may be a summary card linking to chart)

Additional cards related to share/viral performance:

- **Shares**

  - Total number of share events for this test

- **Share Conversion Rate**
  - `shares / completions`
  - Indicates how “shareable” this test is

---

### 3.3. Analytics Tabs

The detail page contains multiple tabs for deeper analysis.

#### 3.3.1. Overview Tab

- **Completion Rate Chart**

  - Visual chart (e.g., line chart) showing completion rate over time
  - X-axis: date
  - Y-axis: completion rate (%)

- **Result Distribution**

  - Chart (e.g., bar or pie) showing distribution of result types
  - For each result:
    - Label
    - Count
    - Percentage

- **Share Performance**

  - Summary block for how well this test is being shared:
    - Total shares (in period)
    - Share conversion rate (`shares / completions`)
    - Share channel breakdown:
      - Instagram story
      - Kakao/other messenger
      - Direct link copy
      - Other
  - Optional chart:
    - Shares over time (daily/weekly)
    - Stack or pie chart by share channel

- **Category/Series Context (Optional)**
  - Display how this test compares to:
    - Other tests in the same category
    - Other tests in the same series
  - Basic indicators:
    - “Above category average completion rate”
    - “Top 3 in series by responses”

#### 3.3.2. Trends Tab

- **Trend Summary**

  - Short textual summary of trends:
    - “Responses increased by X% compared to previous period”
    - “Completion rate is stable / increasing / decreasing”
    - “Shares are rising/falling compared to last week”

- **Trend Chart**
  - Configurable line/bar charts, examples:
    - Responses over time
    - Completions over time
    - Shares over time
    - Completion rate trend

#### 3.3.3. Funnel Tab

- **Funnel Summary**

  - Overview of test-level funnel metrics:
    - Test detail viewed
    - Test started
    - Test completed
    - Result shared

- **Funnel Visualization**

  - Funnel chart (e.g., vertical funnel) with counts and percentages for each step

- **Question Detail**
  - Detailed analysis for each question including:
    - Reached count (users who viewed this question)
    - Completed count (users who answered this question)
    - Drop-off rate (users who abandoned at this question)
    - Average time spent on this question

---

### 3.4. Category / Series / Theme Performance (Per Test Context)

#### 3.4.1. Functional Requirements

This section provides context for how the selected test performs within its category/series/theme:

- **Category Context**

  - Average completion rate for the category
  - Average responses per test in category
  - Position of this test (e.g., “Top 20% by responses”)

- **Series Context (if applicable)**

  - Series name and episode order
  - Responses per episode in the series
  - Drop-off between episodes (e.g., EP1 → EP2 → EP3)

- **Theme Context (if applicable)**
  - Theme name (e.g., “Exam Season”, “Year-End”)
  - Total responses across theme tests
  - This test’s share within the theme

#### 3.4.2. UI Requirements

- Compact cards or mini-tables inside the Overview or a sub-section
- Tooltips or labels to clarify comparison basis (“category average”, “series position”, etc.)

---

# Growth Analysis PRD

## 1. Overview

### 1.1. Page Information

- **Page Path**: `/growth`
- **Page Type**: Information and navigation page
- **Access Permission**: Authenticated administrators only

### 1.2. Page Purpose

The Growth Analysis page provides:

- Guidance and links to Google Analytics (GA4) for advanced growth metrics, user acquisition, and traffic analysis
- A clear definition of the **core growth funnel** for the platform (visit → signup → test start → test completion → result share → revisit)
- A summary of **key growth metrics** (e.g., share conversion, avg tests per session) so that administrators know what to look for when using GA4 or internal reports

### 1.3. User Scenarios

- **GA Navigation**: An administrator wants to access Google Analytics for detailed analysis of user acquisition and traffic
- **Funnel Clarification**: An administrator wants to understand how the product defines the growth funnel stages
- **Metric Definition**: An administrator needs clear definitions of key metrics (e.g., share rate, retention) to design dashboards in GA4

---

## 2. Growth Page

### 2.1. Page Header

#### 2.1.1. Functional Requirements

- **Page Title**

  - “Growth Analysis”

- **Description**
  - Brief explanation that:
    - GA4 provides powerful and flexible analysis capabilities
    - This page explains how to interpret growth for the product and where to find relevant reports in GA4

---

### 2.2. GA Guide Cards

#### 2.2.1. Functional Requirements

- **Traffic Acquisition**

  - Explain where to see:
    - Sessions by source/medium
    - Campaign performance
    - New vs returning users

- **User Acquisition**

  - Explain where to see:
    - User acquisition reports
    - Signup-related events
    - Activation metrics

- **Real-time Analysis**
  - Explain where to see:
    - Realtime overview
    - Event streams
    - Current active users

#### 2.2.2. UI Requirements

- **Card Layout**
  - Three cards with:
    - Icon
    - Title
    - Short description
    - GA4 navigation path (e.g., “Reports → Acquisition → User acquisition”)

---

### 2.3. Additional Analysis Guide

#### 2.3.1. Functional Requirements

- **Technical Analysis**

  - Guidance on device, browser, OS-level analysis
  - Example metrics:
    - Sessions by device category (mobile/desktop)
    - Performance differences per device type

- **Demographics Analysis**
  - Guidance on geographic and demographic data in GA4
  - How to check:
    - Country/region distribution
    - Age/gender distributions (if enabled)

---

### 2.4. Google Analytics Link

#### 2.4.1. Functional Requirements

- **External Link**

  - A prominent button to open GA4 in a new tab

- **Clear Call-to-Action**
  - Label such as “Open Google Analytics (GA4)”

---

### 2.5. Growth Funnel Definition

#### 2.5.1. Functional Requirements

- **Funnel Stage Definition**

  - Clearly define each step in the product’s core growth funnel:

    1. **Visit**
       - Users visiting the site (session started)
    2. **Signup (Optional)**
       - Users completing account creation (if required)
    3. **Test Start**
       - Users starting any test (start event)
    4. **Test Completion**
       - Users finishing a test and reaching the result page
    5. **Result Share**
       - Users triggering a share event (native share, copy link, etc.)
    6. **Revisit / Repeat Usage**
       - Users returning and starting/finishing additional tests on subsequent sessions

- **Mapping to GA4 Events**
  - Document expected event names and parameters (at a conceptual level):
    - `view_home`, `view_test_detail`, `start_test`, `complete_test`, `share_result`, `login`, `sign_up`, etc.

#### 2.5.2. UI Requirements

- **Funnel Diagram**
  - Simple visual diagram illustrating the stages
  - Text labels for each stage and a short explanation

---

### 2.6. Core Growth Metrics

#### 2.6.1. Functional Requirements

Define the key metrics that administrators should monitor regularly (in GA4 or internal dashboards):

- **Visit → Test Start Conversion Rate**

  - `test_start_sessions / total_sessions`

- **Test Start → Completion Rate**

  - `completed_tests / started_tests`
  - Already referenced in Analytics PRD, but here positioned as a growth lever

- **Share Conversion Rate**

  - `share_events / completed_tests`
  - Measures how often tests lead to shareable outcomes

- **Sessions with Multiple Tests**

  - `sessions_with_2+_completed_tests / total_sessions`
  - Indicates whether users are exploring multiple tests per visit

- **Average Tests per Session**

  - `total_completed_tests / total_sessions`

- **Return User Ratio**

  - `returning_users / total_users`
  - Overall retention indicator

- **Theme/Series Impact**
  - For specific campaigns/themes:
    - Uplift in sessions, completed tests, and share events during the campaign period vs. baseline

#### 2.6.2. UI Requirements

- **Metric List Block**
  - A text-based section with:
    - Metric name
    - Short description
    - Example calculation formula
  - No charts required on this page; this is a documentation-style guide

---

# Common Components & Layout PRD

## 1. Overview

### 1.1. Purpose

This section defines the common components and layout structure used throughout the admin application to ensure consistency and usability.

---

## 2. Admin Layout

### 2.1. Sidebar

#### 2.1.1. Functional Requirements

- **Sidebar Toggle**: Button to collapse/expand sidebar
- **Navigation Menu**: List of navigation items organized by sections
- **Section Groups**: Navigation items grouped into logical sections:
  - Dashboard
  - Content Management (Tests, Categories)
  - Data & Analytics (Responses, Analytics, Growth)
  - User & Community (Users, Feedback)
- **Active State**: Visual indication of current page
- **Collapsed State**: Icon-only view when collapsed

#### 2.1.2. UI Requirements

- **Persistent State**: Sidebar collapse state persists across sessions
- **Section Headers**: Clear section dividers
- **Icons**: Icons for each navigation item
- **Hover Effects**: Visual feedback on hover

---

### 2.2. Header

#### 2.2.1. Functional Requirements

- **User Information**: Displays logged-in admin user information
- **Logout Button**: Button to log out of admin session
- **Sidebar Toggle**: Button to toggle sidebar (on mobile/tablet)

#### 2.2.2. UI Requirements

- **Fixed Position**: Header remains visible while scrolling
- **User Avatar**: User profile image or initial
- **Clear Actions**: Prominent logout button

---

### 2.3. Main Content Area

#### 2.3.1. Functional Requirements

- **Content Container**: Main area for page content
- **Responsive Layout**: Adapts to sidebar state
- **Padding**: Consistent padding around content

---

## 3. Common UI Components

### 3.1. DataTable

#### 3.1.1. Functional Requirements

- **Data Display**: Table for displaying structured data
- **Sorting**: Column sorting capability
- **Selection**: Row selection with checkboxes
- **Pagination**: Built-in pagination support
- **Actions**: Action column for row-specific actions

---

### 3.2. FilterBar

#### 3.2.1. Functional Requirements

- **Search Input**: Text search field
- **Filter Dropdowns**: Multiple filter dropdowns
- **Filter Values**: Displays current filter values
- **Clear Filters**: Option to reset all filters

---

### 3.3. BulkActions

#### 3.3.1. Functional Requirements

- **Selection Count**: Displays number of selected items
- **Action Buttons**: Multiple action buttons
- **Clear Selection**: Button to deselect all
- **Conditional Display**: Only shows when items are selected

---

### 3.4. StatsCards

#### 3.4.1. Functional Requirements

- **Multiple Cards**: Grid of statistic cards
- **Configurable Columns**: Adjustable number of columns
- **Card Content**: Label and value for each card
- **Optional Colors**: Color coding for different metrics

---

### 3.5. DataState

#### 3.5.1. Functional Requirements

- **Loading State**: Displays loading indicator
- **Error State**: Displays error message
- **Empty State**: Displays message when no data
- **Success State**: Renders data when available

---

### 3.6. AdminCard

#### 3.6.1. Functional Requirements

- **Card Container**: Reusable card component
- **Variants**: Different card styles (default, gradient, step)
- **Padding Options**: Configurable padding sizes
- **Header/Content**: Optional header and content sections

---

### 3.7. Pagination

#### 3.7.1. Functional Requirements

- **Page Navigation**: Previous/next buttons
- **Page Numbers**: Clickable page numbers
- **Current Page**: Visual indication of current page
- **Total Pages**: Display of total page count

---

## 4. Form Components

### 4.1. DefaultInput

#### 4.1.1. Functional Requirements

- **Text Input**: Standard text input field
- **Label**: Optional label above input
- **Placeholder**: Placeholder text
- **Validation**: Error message display
- **Required Indicator**: Visual indicator for required fields

---

### 4.2. DefaultTextarea

#### 4.2.1. Functional Requirements

- **Multi-line Input**: Text area for longer text
- **Label**: Optional label
- **Rows**: Configurable number of rows
- **Validation**: Error message display

---

### 4.3. DefaultSelect

#### 4.3.1. Functional Requirements

- **Dropdown**: Select dropdown component
- **Options**: List of selectable options
- **Label**: Optional label
- **Placeholder**: Placeholder text
- **Search**: Optional search within options

---

### 4.4. Switch

#### 4.4.1. Functional Requirements

- **Toggle**: On/off toggle switch
- **Label**: Optional label
- **State**: Current on/off state
- **Change Handler**: Callback on state change

---

### 4.5. Image Upload

#### 4.5.1. Functional Requirements

- **File Upload**: Image file selection
- **Preview**: Preview of uploaded image
- **Remove**: Option to remove uploaded image
- **Validation**: File type and size validation

---

## 5. Modal Components

### 5.1. Test Detail Modal

#### 5.1.1. Functional Requirements

- **Test Information**: Comprehensive test details
- **Quick Actions**: Toggle publish, delete, edit
- **Close**: Close button or overlay click

---

### 5.2. User Detail Modal

#### 5.2.1. Functional Requirements

- **User Information**: User profile details
- **Participation History**: List of tests user participated in
- **Statistics**: User response statistics

---

### 5.3. Feedback Detail Modal

#### 5.3.1. Functional Requirements

- **Feedback Content**: Full feedback text
- **Attachments**: Display attached files
- **Reply Action**: Button to open reply modal
- **Status Display**: Current feedback status

---

### 5.4. Feedback Reply Modal

#### 5.4.1. Functional Requirements

- **Reply Form**: Text area for admin reply
- **Submit**: Save and send reply
- **Cancel**: Close without saving

---

### 5.5. Category Create/Edit Modal

#### 5.5.1. Functional Requirements

- **Category Form**: Form fields for category creation/editing
- **Save**: Create or update category
- **Cancel**: Close without saving

---

### 5.6. Category Sort Modal

#### 5.6.1. Functional Requirements

- **Sortable List**: Drag-and-drop category list
- **Save Order**: Save new sort order
- **Cancel**: Close without saving

---

## 6. Error Handling

### 6.1. Form Validation

- **Required Fields**: Validation for required inputs
- **Format Validation**: Email, URL, number format validation
- **Custom Validation**: Business logic validation
- **Error Messages**: Clear, actionable error messages

---

### 6.2. API Error Handling

- **Network Errors**: Handling of connection issues
- **Server Errors**: Handling of server-side errors
- **Error Messages**: User-friendly error messages
- **Retry Options**: Option to retry failed operations

---

### 6.3. User Feedback

#### 6.3.1. Success Messages

- **Action Confirmation**: Success messages for completed actions
- **Auto-dismiss**: Messages automatically disappear after timeout

#### 6.3.2. Error Messages

- **Error Display**: Clear error messages
- **Actionable**: Messages suggest next steps

#### 6.3.3. Loading States

- **Loading Indicators**: Visual feedback during operations
- **Button States**: Disabled state during processing
- **Progress Indicators**: Progress bars for long operations

---

## 7. Accessibility

### 7.1. Keyboard Navigation

- **Tab Order**: Logical tab order through interactive elements
- **Keyboard Shortcuts**: Common shortcuts for frequent actions
- **Focus Indicators**: Clear visual focus indicators

---

### 7.2. Screen Readers

- **ARIA Labels**: Appropriate ARIA labels for all interactive elements
- **Alt Text**: Descriptive alt text for images
- **Semantic HTML**: Proper use of semantic HTML elements

---

### 7.3. Visual Feedback

- **Loading States**: Clear indication of loading operations
- **Success Feedback**: Visual confirmation of successful actions
- **Error Feedback**: Clear indication of errors

---

## 8. Performance

### 8.1. Data Loading

- **Lazy Loading**: Load data as needed
- **Pagination**: Limit data loaded at once
- **Caching**: Cache frequently accessed data

---

### 8.2. Image Optimization

- **Image Formats**: Use optimized image formats
- **Lazy Loading**: Load images on demand
- **Compression**: Compress images for web

---

**Created**: 2025-01-XX  
**Version**: 1.0.0
