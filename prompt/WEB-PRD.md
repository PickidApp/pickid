# Web Application PRD (Product Requirements Document)

> **Document Information**
>
> - **Created**: 2025-11-30
> - **Version**: 1.0.0

---

## Table of Contents

1. [Home Page](#home-page-prd)
2. [Category Page](#category-page-prd)
3. [Test Detail/Progress Page](#test-detailprogress-page-prd)
4. [Test Result Page](#test-result-page-prd)
5. [Authentication Page](#authentication-page-prd)
6. [Feedback Page](#feedback-page-prd)
7. [Common Components & Layout](#common-components--layout-prd)

---

# Home Page PRD

## 1. Overview

### 1.1. Page Information

This document outlines the product requirements for the Home Page of the Pickid service.

- **Page Path**: `/` (root path)
- **Page Type**: Primary Landing Page
- **Access Permission**: All users (both logged-in and non-logged-in) can access this page.

### 1.2. Page Purpose

The Home Page is the main entry point for the Pickid service. Its primary goal is to introduce users to the wide array of psychological tests, personality analyses, and balance games available on the platform, and to provide clear pathways for exploration.

**Service Positioning (Core Mission)**

> “Pickid is a playful test playground that automatically gives you fun, shareable conversation starters with your friends.”

The key objectives are:

- To effectively showcase the service's core content, which is its collection of tests.
- To help users quickly find tests that align with their personal interests (e.g., romance, school life, friends, memes, self-development).
- To present the different types of tests in a well-organized manner, allowing users to understand the variety at a glance.
- To incorporate interactive elements that drive user engagement and participation (e.g., balance games, daily picks, carousels).
- To highlight series/themes (e.g., “Romance Drama Series”, “Exam Season Special”) so users naturally look for “the next episode”.

### 1.3. User Scenarios

- **New User**
  - Lands on the home page → Reads the hero copy (“what this service is”) → Scrolls through categories / “Today’s Test” → Selects one test and starts playing.
- **Existing User**
  - Visits the home page → Checks “Today’s Test” and “This Week HOT” → Plays a new test they haven’t tried before.
- **Repeat User**
  - Comes back frequently → Plays the Balance Game on the home page → Scrolls down to “Recommended For You” or “Hall of Fame” to find another test.
- **Social / Friend-driven User**
  - Comes from a shared link or friend recommendation → Lands on the home page → Finds similar tests in the same category/series (e.g., other romance tests) and plays additional ones.

---

## 2. Page Structure

### 2.1. Overall Layout

The home page is composed of vertically stacked sections that guide the user's flow from understanding the service → discovering a test → engaging and sharing:

1. **Hero Section**: Service positioning & main CTA.
2. **Banner Carousel**: Full-width featured tests.
3. **Category Filter Navigation**: Horizontal navigation bar for category-based browsing.
4. **Today’s Test Section**: Daily highlighted test slot.
5. **This Week HOT / Popular Tests Section**: Tests with high engagement in recent days.
6. **Balance Game Section**: Interactive balance game module.
7. **New Tests Section**: Recently added tests.
8. **Advertisement Banner**: Promotional banner.
9. **Recommended Tests Section (For You)**: Curated/personalized recommendations.
10. **Hall of Fame Section**: All-time best tests.

### 2.2. Section Spacing

- Consistent vertical spacing (padding and margins) must be applied between sections to ensure a clean and organized layout.
- Visual separation between sections (background color, dividers, typography) should be clear, helping users to process each content block independently.
- The hero + above-the-fold area (Hero + Banner + Category Navigation) should feel cohesive and not too dense.

---

## 3. Hero Section

### 3.1. Functional Requirements

- **Service Positioning Copy**
  - Display a one-line mission statement.
  - Example: “A test playground that automatically gives you fun, shareable conversation starters for your friends and group chats.”
- **Sub-copy**
  - Provide a short contextual description.
  - Example: “Perfect for group chats, school breaks, and Insta stories.”
- **Primary CTA**
  - “Take Today’s Test”
  - Scrolls to or navigates to the Today’s Test Section (or directly opens the selected test).
- **Secondary CTA**
  - “Browse Categories”
  - Scrolls down to the Category Filter Navigation.

### 3.2. UI Requirements

- **Desktop Layout**
  - Left: Main copy (positioning + sub-copy + CTAs).
  - Right: Visual illustration or mockup (e.g., multiple test cards, chat bubbles, playful elements).
- **Mobile Layout**
  - Stacked layout: copy first, illustration below.
- **Visual Tone**
  - Playful but clean.
  - Use colors and icons that match the brand concept (fun, casual, social).

### 3.3. Interaction Requirements

- Clicking **“Take Today’s Test”**:
  - Scrolls to the Today’s Test Section or directly routes to the test detail page (configurable).
- Clicking **“Browse Categories”**:
  - Scrolls to the Category Filter Navigation.

---

## 4. Banner Carousel

### 4.1. Functional Requirements

- **Auto-Sliding**
  - Automatically transition between banners at a predefined time interval.
- **Manual Navigation**
  - Left/right arrow buttons allow manual navigation.
- **Position Indicator**
  - Dot indicators show total banner count and current index.
- **Click Action**
  - Each banner is clickable and navigates to the associated test detail page or campaign landing.
- **Infinite Loop**
  - Carousel loops continuously, wrapping from last to first and vice versa.
- **Mobile Gestures**
  - Touch devices support horizontal swiping.

### 4.2. UI Requirements

- **Full-width Banners**
  - Banner spans the full viewport width.
- **Consistent Aspect Ratio**
  - Prevent layout shifts during transitions.
- **Prioritized Loading**
  - First banner image loads eagerly (not lazy-loaded).
- **Banner Content**
  - May include:
    - Test thumbnail / visual
    - Category or series label (e.g., “Romance / Drama Series”)
    - Short teaser line (“Post this in your group chat, chaos guaranteed ✨”)

### 4.3. Interaction Requirements

- Hovering pauses auto-sliding (desktop).
- Clicking a banner navigates to its target page.
- Clicking a dot indicator navigates to the corresponding banner.

---

## 5. Category Filter Navigation

### 5.1. Functional Requirements

- **Display All Top-level Categories**
  - Example categories:
    - Romance / Crush / Dating
    - School / Campus Life
    - Friends / Social
    - Self-development / Future
    - Memes / Trends
- **Category Selection**
  - Clicking a category navigates to the category page (filtered test list).
- **“All” Option**
  - Optional “All” item to view all tests without filtering.
- **Active State**
  - Current category is visually highlighted.

### 5.2. UI Requirements

- **Horizontal Scroll Bar**
  - Scrollable pill-style buttons when there are many categories.
- **Sticky Option**
  - Category bar may stick to top on scroll (optional, configurable).
- **Buttons**
  - Pill-shaped buttons with clear labels and hover/focus styles.

### 5.3. Interaction Requirements

- Clicking a category:
  - Immediately routes to `/category?category={slug}`.
- Hover state:
  - Background or border color changes to indicate interactivity.

---

## 6. Today’s Test Section

### 6.1. Functional Requirements

- **Single Daily Highlight**
  - Display one “Today’s Test” card.
- **Selection Logic**
  - System-based default:
    - Determined based on metrics such as:
      - Completions in the last 7 days.
      - Share count.
      - Engagement rate (start → complete).
  - Manual override:
    - Admin can pin a specific test as “Today’s Test.”
- **Click Action**
  - Clicking the card navigates to the test detail page.

### 6.2. UI Requirements

- **Section Header**
  - Title: “Today’s Test”
  - Optional subtitle:
    - “A perfect test to drop into your group chat today.”
- **Card Content**
  - Thumbnail image.
  - Main category tag (e.g., Romance / School).
  - Optional series tag (e.g., “[Romance Drama Series] Part 1”).
  - Test title.
  - One-line, meme-like description.

### 6.3. Interaction Requirements

- Hovering over the card:
  - Shadow/scale effects to emphasize clickability.
- Clicking the card:
  - Navigates to test detail page.

---

## 7. This Week HOT / Popular Tests Section

### 7.1. Functional Requirements

- **Test List**
  - Show a list of high-performing tests as a horizontal carousel.
- **Ranking Logic**
  - Primary KPI base:
    - “This Week HOT” = tests with high engagement in the last 7 days:
      - Number of completions.
      - Number of shares (if tracking is available).
  - Fallback:
    - Use total views or total completions.
- **Card Interaction**
  - Each card navigates to the test detail page.
- **Carousel Navigation**
  - Left/right arrow buttons for scrolling.
- **Section Title**
  - “This Week HOT” or “Popular Tests” with a HOT badge.

### 7.2. UI Requirements

- **Section Header**
  - Title + HOT badge.
- **Test Cards**
  - Thumbnail.
  - Up to two tags:
    - Category tag (e.g., “Romance”, “School Life”).
    - Optional series/feature tag (e.g., “[Drama Series]”, “Most Shared”).
  - Test title.
- **Carousel**
  - Horizontally scrollable.
  - Navigation arrows visible when more than visible cards.

### 7.3. Interaction Requirements

- Hovering over a card:
  - Scale/shadow effect.
- Clicking a card:
  - Navigates to the test detail page.
- Clicking arrows:
  - Scrolls the list by one or multiple card widths.

---

## 8. Balance Game Section

### 8.1. Functional Requirements

- **Game Display**
  - Show one balance game on the home page (random or curated).
- **Voting**
  - Users vote by selecting one of the two options.
- **Result Display**
  - After voting, show:
    - Percentage of votes per option.
    - Total vote count.
    - Which option the user chose.
- **Revoting**
  - Provide “Vote Again” to reset state and let the user re-vote.
- **More Games Link**
  - “More Balance Games” link navigates to a dedicated balance game list.

### 8.2. UI Requirements

**Pre-vote State**

- Section header with the game title.
- Two option cards with:
  - Emoji + label text.
- “VS” element between them.
- Participant count at the bottom.

**Post-vote State**

- Progress bars for each option (vote percentage).
- “My Choice” badge on the chosen option.
- Vote count and percentage text for each option.
- Buttons:
  - “Explore Other Tests”
  - “Vote Again”

**Loading State**

- Skeleton UI while fetching balance game data.

### 8.3. Interaction Requirements

- Option click:
  - Immediately casts vote and transitions to result state.
- Button states:
  - Disable option buttons while vote is being processed.
- “Vote Again”:
  - Reset to pre-vote state.
- “Explore Other Tests”:
  - Navigate to test list or category page.
- “More Balance Games”:
  - Navigate to balance game list page.

---

## 9. New Tests Section

### 9.1. Functional Requirements

- Display only if there are newly added tests.
- Show recently created tests in a horizontal carousel.
- Each card navigates to the test detail page.
- Left/right arrows for scrolling.
- Section title: “New Tests” with a NEW badge.

### 9.2. UI Requirements

- Section header: title + NEW badge.
- Card layout identical to Popular/Recommended sections.
- Carousel behavior identical to other carousels.

### 9.3. Interaction Requirements

- Hover effect on cards.
- Click → navigate to test detail.
- Arrow click → scroll tests.

---

## 10. Advertisement Banner

### 10.1. Functional Requirements

- Display an inline ad banner.
- Clicking the banner may navigate to an external or internal link.

### 10.2. UI Requirements

- Full-width banner.
- No horizontal padding (edge-to-edge).
- Consistent aspect ratio.

### 10.3. Interaction Requirements

- Clickable area:
  - Entire banner is clickable.
- If no ad is configured:
  - Section may be hidden.

---

## 11. Recommended Tests Section (For You)

### 11.1. Functional Requirements

- Show a list of recommended tests in a horizontal carousel.
- Section title: “Recommended Tests” or “For You” with a PICK badge.
- Card click → navigate to test detail.
- Arrow buttons for carousel navigation.

**Recommendation Logic (Initial Version)**

- **Anonymous users (not logged in)**:
  - Use global signals:
    - Overall popularity.
    - Recency.
    - Balance of categories (not only romance, etc.).
- **Logged-in users with profile/onboarding data**:
  - Use:
    - Selected interests (e.g., romance, school life, memes, self-development).
    - Recent completion history.
    - Recently played category/series.
  - Prioritize:
    - Tests in the same category as the user’s interests.
    - “Next episode” in a series the user has already started.

### 11.2. UI Requirements

- Section header:
  - Title + PICK badge.
  - Optional subtitle: “Picked for you based on your interests.”
- Card design:
  - Same as Popular/New sections.
  - May show a small “For You” label if personalized.

### 11.3. Interaction Requirements

- Hover effect on cards.
- Click → test detail.
- Arrow buttons → scroll.

---

## 12. Hall of Fame Section

### 12.1. Functional Requirements

- Display all-time best or most iconic tests.
- Carousel of “Hall of Fame” tests.
- Section title: “Hall of Fame” with a TOP badge.
- Each card navigates to test detail.
- Arrow buttons for navigation.

### 12.2. UI Requirements

- Section header: title + TOP badge.
- Card layout consistent with other sections.
- Additional bottom margin to clearly end the page content.

### 12.3. Interaction Requirements

- Hover effect.
- Click → detail page.
- Arrow buttons → scroll.

---

## 13. Common Test Card Specifications

### 13.1. Card Components

Each test card across all sections should share a consistent structure:

- **Thumbnail Image**
  - Representative image for the test (fixed aspect ratio, e.g., 4:3).
- **Tags**
  - Up to 2–3 tags, prioritized:
    - Main category tag (e.g., Romance / School / Friends / Memes / Self).
    - Optional series tag:
      - e.g., `[Romance Drama Series]`, `[School Life Series]`.
    - Optional theme tag:
      - e.g., `Exam Season`, `New Semester`, `Year-end`.
- **Title**
  - Test title (with max lines and ellipsis).
- (Optional) Short description
  - A single line explaining the vibe of the test.
- (Optional) Metric label
  - e.g., “Most shared this week” (later, when share data is available).

### 13.2. Card Interaction

- **Hover Effect**
  - Shadow / slight scale-up.
  - Thumbnail may slightly zoom for a “card is active” feeling.
- **Click Action**
  - Card is fully clickable and navigates to the test detail page.
- **Image Loading**
  - Show a placeholder or skeleton while the image is loading.
- **Responsiveness**
  - Card layout adapts to different screen sizes while maintaining hierarchy.

---

## 14. Error Handling

### 14.1. Data Loading Failure

- If data for a specific section fails to load:
  - Display a simple error message:
    - e.g., “We couldn’t load this section. Please try again.”
  - Optionally provide a “Retry” button.
- If critical data (e.g., initial featured tests) fails:
  - Show a fallback message and minimal safe content.
  - Optionally use a generic error component.

### 14.2. Empty State

- If a section has zero tests:
  - Hide the section entirely, or
  - Display a friendly empty state (e.g., “No tests here yet, stay tuned!”).
- The home page should always show at least some core sections (e.g., Hero, Category Navigation, Hall of Fame or some default).

---

## 15. Accessibility

### 15.1. Keyboard Navigation

- All interactive elements (buttons, links, cards, arrows) must be keyboard-accessible.
- Focus styles must be clearly visible on all focusable elements.

### 15.2. Screen Readers

- Provide ARIA labels for each major section:
  - e.g., “Banner Carousel”, “Today’s Test”, “Popular Tests”.
- All images must have descriptive `alt` text.
- Buttons and links must have descriptive labels:
  - e.g., “Go to next banner”, “View test details”.

### 15.3. Visual Feedback

- Visual feedback for:
  - Hover states.
  - Active/click states.
  - Loading states (skeletons or spinners).
- Ensure sufficient color contrast for accessibility.

---

## 16. Performance

### 16.1. Initial Loading

- Prioritize loading for:
  - Hero section.
  - First banner in the carousel.
  - Category navigation.
  - Today’s Test.
- Use SSR/SSG where possible for above-the-fold content.

### 16.2. Image Optimization

- Use appropriate formats (e.g., WebP) and responsive image sizes.
- Apply lazy loading to:
  - Images below the fold.
  - Carousel items not initially visible.

---

## 17. User Experience

### 17.1. Loading State

- Use skeleton UIs for:
  - Test cards.
  - Main lists and carousels.
- Show clear “loading” feedback so the page does not feel frozen.

### 17.2. Interaction Feedback

- All clickable elements should respond immediately (visual feedback).
- Animations:
  - Short, smooth, and non-blocking.

### 17.3. Content Flow

- Guide users from:
  - Understanding the service (Hero) →
  - Immediate action (Today’s Test, This Week HOT) →
  - Fun interaction (Balance Game) →
  - Continuous discovery (New, Recommended, Hall of Fame).
- Ensure that each section’s purpose is clear via titles and subtext.

### 2.2. Section Spacing

- Consistent spacing between:
  - Category Header
  - Filter bar
  - Sort options
  - Test grid
  - Pagination
- Layout must remain clean and easy to scan, even when filters and sort options are visible together.

---

## 3. Category Header

### 3.1. Functional Requirements

- **Display Category Information**
  - Show the main category name (e.g., “Love / Romance”, “School Life”, “Friends”, “Memes”, “Self / Future”).
- **Display Category Description**
  - Provide a short description explaining what kind of tests are in this category.
  - Example for Love:
    - “Crush, exes, ideal types, and your messy romance drama in test form.”
- **Display Example Topics (Optional)**
  - Show a one-line list of typical topics or example tests in this category.

### 3.2. UI Requirements

- **Category Title**
  - Prominent heading (`H1` or `H2`).
- **Category Description**
  - Smaller body text under the title.
- **Background Styling (Optional)**
  - Unique background color or subtle illustration based on the category theme (e.g., pink/purple tones for Love).
- **Optional Badge**
  - A small badge like “Romance”, “School Life”, etc., to emphasize the category identity.

### 3.3. Interaction Requirements

- The header itself is static (no click required) but may include:
  - A “Back to Home” or “All Categories” link above the title for easier navigation.

---

## 4. Sub-category & Series Filter Bar

### 4.1. Functional Requirements

This bar allows users to further narrow down tests **within the selected category**.

- **Sub-category Filters**
  - Provide sub-topic chips specific to each category.
  - Example:
    - **Love/Romance**
      - Exes / Past relationships
      - Crush & situationships
      - Ideal type / Dream partner
      - Relationship diagnostics
    - **School/Campus**
      - Class / major memes
      - Exam season / stress
      - Club / MT / group projects
    - **Friends / Social**
      - Group chat roles
      - Social energy / introvert-extrovert memes
      - “Who is the real clown?” type tests
    - **Self / Future**
      - Career / future self
      - Money & spending style
      - Self-growth / habits
    - **Memes / Trends**
      - Current internet memes
      - Trendy phrases / viral formats
- **Series Filters**
  - Optional filter to show tests belonging to a specific **series**.
  - Example:
    - “Romance Drama Series”
    - “School Life Trilogy”
    - “Exam Season Special”
- **Clear Filter**
  - Provide a way to clear all sub-category/series filters and return to “All”.

### 4.2. UI Requirements

- **Layout**
  - Horizontal scrollable bar under the Category Header.
  - Two groups inside:
    - Sub-category chips
    - Series chips (if defined for this category)
- **Chip Design**
  - Pill-shaped buttons.
  - Active chip should be clearly highlighted (background & text color).
- **Overflow Handling**
  - When there are many filters, enable horizontal scrolling with scroll hints (e.g., fade on edges).

### 4.3. Interaction Requirements

- **Filter Selection**
  - Clicking a chip toggles it:
    - Single-select or multi-select per group (implementation decision; default: single-select).
  - Applied filters immediately update the Test Grid (client-side or server-side).
- **URL State**
  - Optionally reflect filters in query params:
    - e.g., `/category/love?sub=ex&series=romance-drama`
- **Clear Filters**
  - A “Reset Filters” or “All” chip will clear sub-category/series filters.

---

## 5. Sort Options

### 5.1. Functional Requirements

- **Default Sort Order**
  - By default, tests are sorted by **Popularity** (most played in recent period, e.g., last 7 or 30 days).
- **Sorting Options**
  - Users can re-sort the test list with the following options:
    - **This Week HOT (or Popular)**:
      - Based on completions / engagement in the last 7 days.
    - **Most Popular (All-time)**:
      - Highest total participant count.
    - **Newest**:
      - Most recently created tests.
- **Active Sort Indicator**
  - Clearly indicate the currently active sort option.

### 5.2. UI Requirements

- **Layout**
  - Sort controls aligned to the right or top-right above the Test Grid.
  - Can be a segmented control or a dropdown.
- **Appearance**
  - Active option visually emphasized (bold text, different background).
- **Responsive Behavior**
  - On mobile, sort options may collapse into a compact dropdown.

### 5.3. Interaction Requirements

- **Click Action**
  - Clicking a sort option immediately re-fetches or re-sorts the Test Grid (without full page reload).
- **State Persistence**
  - The selected sort order must persist:
    - across pagination within the same category.
    - on navigation back within a short period (if feasible via state/URL).

---

## 6. Test Grid

### 6.1. Functional Requirements

- **Display Test List**
  - Show all tests for the selected category, filtered and sorted as configured.
- **Test Card Navigation**
  - Each card is clickable and navigates to the corresponding test detail page.
- **Filtering & Sorting Integration**
  - The grid should respond to:
    - Sub-category filter
    - Series filter
    - Sort options
- **Empty Filter Result**
  - If current filter + sort combination yields no tests, show an empty state inside the grid area.

### 6.2. UI Requirements

- **Layout**
  - Responsive grid:
    - Mobile: 2 columns
    - Tablet: 2–3 columns
    - Desktop: 3–4 columns
- **Test Card Contents**
  - Thumbnail image (4:3 ratio or consistent dimension).
  - Test title (max 2 lines with ellipsis).
  - Tags (up to 2–3):
    - Category tag (optional, since we’re already in a category).
    - Sub-category tag (e.g., “Ex / Breakup”, “Exam Season”, “Group Chat”).
    - Series tag (e.g., `[Romance Drama Series]`).
  - Optional indicator:
    - e.g., “HOT this week”, “New”, “Most shared”.
- **Loading State**
  - When fetching data or changing sort/filter:
    - Show skeleton cards in the grid positions to maintain layout.

### 6.3. Interaction Requirements

- **Hover Effect**
  - Card-level hover:
    - subtle shadow
    - slight scale-up or image zoom
- **Click Navigation**
  - Clicking anywhere on the card navigates to the test detail page.
- **Image Loading**
  - Use placeholders or blurred previews until images are loaded.

---

## 7. Pagination

### 7.1. Functional Requirements

- **Conditional Display**
  - Show pagination only when the number of tests exceeds the page size limit.
- **Page Navigation**
  - User can navigate:
    - to next/previous page
    - to specific page numbers.
- **Items per Page**
  - Fixed number per page (e.g., 12 or 16 tests).

### 7.2. UI Requirements

- **Layout**
  - Pagination centered horizontally under the Test Grid.
- **Components**
  - “Previous” and “Next” arrow buttons.
  - Page number buttons.
  - Current page highlighted.
  - Ellipsis `...` for large page counts.

### 7.3. Interaction Requirements

- **Click Action**
  - Clicking a page number or Next/Previous:
    - loads tests for the selected page.
    - scrolls back to the top of the Test Grid area.
- **Disabled State**
  - “Previous” disabled on first page.
  - “Next” disabled on last page.

---

## 8. Error Handling & Empty States

### 8.1. Invalid Category

- If `categoryId` does not exist:
  - Show a “Category not found” message or redirect to a 404 page.
  - Optionally show a link to go back to the home page or all categories.

### 8.2. Data Loading Failure

- If test list loading fails:
  - Show an inline error state in place of the Test Grid:
    - e.g., “We couldn’t load tests for this category. Please try again.”
  - Provide a “Retry” button that re-triggers the fetch.

### 8.3. Empty Category

- If the category exists but has no tests:
  - Show a friendly empty state:
    - e.g., “There are no tests in this category yet.”
  - Keep Category Header + Filter bar visible so users can switch to other filters/categories.

---

## 9. Accessibility

### 9.1. Keyboard Navigation

- All interactive elements (filter chips, sort controls, pagination, cards) must be accessible via keyboard (Tab, Enter, Space).
- Focus states must be clearly visible.

### 9.2. Screen Readers

- Use ARIA labels for:
  - Category header section.
  - Filter bar (e.g., “Sub-category filters”, “Series filters”).
  - Test grid.
  - Pagination.
- Ensure:
  - Each test card has a clear accessible name (test title).
  - Images have alt text describing the test theme.

### 9.3. Visual Feedback

- Provide distinct states for:
  - Default / hover / active / disabled.
- Make sure:
  - Filter chips show active selection clearly.
  - Current page in pagination stands out.

---

## 10. Performance

### 10.1. Initial Loading

- Use SSR/SSG where possible for:
  - Category info
  - Initial test list for the default sort state.
- Show skeletons instead of blank space while data is loading.

### 10.2. Filtering & Sorting

- Perform filtering/sorting efficiently:
  - Client-side when data is pre-fetched.
  - Or server-side with proper query params.
- Avoid unnecessary full-page reloads.

### 10.3. Image Optimization

- Use optimized formats (e.g., WebP) and proper sizes.
- Apply lazy loading for images that are not initially visible.

---

## 11. User Experience

### 11.1. Loading State

- Use consistent skeleton UI for:
  - Test cards
  - While changing filters, sort, or page.
- Avoid jarring layout shifts when data updates.

### 11.2. Interaction Feedback

- Immediate visual feedback on:
  - Filter selection
  - Sort change
  - Pagination click
- Provide short, smooth animations for grid updates (optional).

### 11.3. Content Flow

- Category Header gives context.
- Filter Bar lets users refine by **topic/series**.
- Sort Options let users control **ordering** (HOT / Popular / Newest).
- Test Grid presents rich options with good scanning.
- Pagination supports deeper exploration without overwhelming a single screen.

# Test Detail/Progress Page PRD

## 1. Overview

### 1.1. Page Information

- **Page Path**: `/tests/[id]`
- **Page Type**: Test Progression Page
- **Access Permission**: Accessible to both non-members and members.

### 1.2. Page Purpose

The Test Detail/Progress Page is where users start, answer, and complete a test. The main objectives are:

- To introduce the test and encourage users to start.
- To provide a customized question-and-answer experience tailored to the test type.
- To offer an intuitive and smooth interface for progressing through questions.
- To save user answers and collect data for calculating results.
- To act as an “entry point” for **viral/compare flows** when users come from shared or compare links.

### 1.3. User Scenarios

1. **Starting a Test**: Enters the test detail page → Reads the test introduction → Clicks the "Start" button → Begins answering questions.
2. **Psychology Test**: Selects gender → Answers a question → Can navigate back to the previous question → Completes all questions → Navigates to the result page.
3. **Balance Game**: Chooses between two options → Views statistics → Proceeds to the next question → Completes all questions → Navigates to the result page.
4. **Quiz**: Answers multiple-choice or short-answer questions → Immediately moves to the next question upon selection (except for the last question) → Completes all questions → Navigates to the result page.
5. **Compare Link Entry**: Enters via a compare link (e.g., `/tests/[id]?ref=compare&group={groupId}`) → Sees “compare with friend/group” context → Starts and completes the test → Moves to result page in compare mode.

---

### 1.4. Positioning & Core Value (Product Mission)

- **One-line mission**

> “Pickid is a psychology & balance test playground that automatically generates conversation topics to share with friends.”

- **Typical usage contexts**

  - Lunch break, between classes
  - KakaoTalk group chats, school club/MT
  - Early-stage dating / “getting to know each other”

- **Implication for this page**
  - The intro section should clearly signal that this test is:
    - Easy to share in chat/DM,
    - Fun to compare with friends,
    - Part of a recognizable category/series/theme (e.g., love, school life, memes).
  - When entering via share/compare links, the page should visually indicate:
    - “You’re about to take the same test as your friend.”
    - “Your results will be compared at the end.”

---

## 2. Page Structure

### 2.1. Overall Layout

The Test Detail/Progress Page consists of the following states:

```text
[Test Intro Screen]
  ↓ (On "Start" click)
[Question Progress Screen] (Varies by type)
  ↓ (After all questions are answered)
[Navigate to Result Page (/tests/[id]/result[?mode=...&group=...])]
```

**Additional context:**

The page may receive query parameters such as:
- `ref=share` (entered from a shared result)
- `ref=compare&group={groupId}` (entered from a "compare with friends" link)

These parameters affect UI messaging and what mode the result page will show later.

### 2.2. Test Types

- **Psychology**: Psychological test (requires gender selection, allows moving to previous questions).
- **Balance**: Balance game (choose between two options, displays statistics).
- **Quiz**: Quiz with multiple-choice or short-answer questions (selection immediately proceeds to the next question).

---

## 3. Test Intro Screen

### 3.1. Functional Requirements

#### Display Test Information

- Show the test's thumbnail, title, and description.

#### Display Content Metadata

- **Main Category Badge**
  - e.g., Relationship / School & College / Friends & Social / Self-development & Future / Meme & Trend.
- **Series Info (optional)**
  - When the test belongs to a series, display series name and episode/order.
  - Example: [Love Drama Series] EP.2.
- **Theme/Campaign Info (optional)**
  - When the test is part of a campaign (e.g., "Exam Season", "Year-End"), show a theme tag.
  - Example: 🎓 Exam Season Special.

#### Positioning/Context Copy

- Show a short line that reinforces the product mission, e.g.:
  - "Perfect test to compare with friends in your group chat."
  - "Share this in your chat and see who gets which type."

#### Display Participant Count

- Show the number of users who have participated so far (with an animation effect).

#### "Start" Button

- Provide a button to begin the test.

#### Gender Selection Modal

- For Psychology tests, display a modal to select gender when starting.

#### Increment Participant Count

- When the start button is clicked, asynchronously increment the participant count.

#### Compare Mode Indicator (Optional)

- If the page is opened with `ref=compare` or `group={groupId}`:
  - Display a compare mode banner at the top of the intro card, e.g.:
    - "You're taking this test to compare results with a friend."
    - "Results will be compared with your group."
  - Store `groupId` (if present) in client-side state so it can be used on the result page.

### 3.2. UI Requirements

#### Layout

- Centrally-aligned card-based layout.

#### Metadata & Tag Area

- Above or near the title:
  - Category badge (pill style).
  - Series tag (if any), e.g. Series.
  - Theme tag (if any), e.g. Exam Season.

#### Thumbnail Image

- Display the main image for the test.
- Square aspect ratio.
- Rounded corners.

#### Title

- Display the test title in a large font size.

#### Description

- Display the test description (supports line breaks).

#### Positioning Caption

- Short, subtle text under the description, e.g.:
  - "Great for sharing in your group chat or comparing with friends."

#### Participant Count Section

- Gradient background.
- Text format: "So far, {count} people have participated!"
- Animate the number count-up.

#### Compare Mode Banner (Optional)

- When in compare mode, show a small banner at the top or within the card:
  - e.g., "Compare mode – your result will be shown next to your friend's result."

#### "Start" Button

- Full-width.
- Gradient background.
- Shadow effect on hover.

#### Gender Selection Modal

- Modal overlay.
- Male/Female selection buttons.
- Each button should have an icon and text.

### 3.3. Interaction Requirements

- **On "Start" button click:**
  - Psychology Test: Show the gender selection modal.
  - Other Tests: Immediately transition to the question progress screen.
- **On gender selection in the modal:**
  - Close the modal and start the questions.
- **Compare Mode Handling:**
  - If `groupId` exists in the URL (compare mode):
    - Persist `groupId` in client-side state (e.g., in context or store).
    - Pass this information along when navigating to the result page.
- **Participant count:**
  - Should be incremented asynchronously on start click, without blocking the UI.

---

## 4. Common Question Progress Layout

### 4.1. Functional Requirements

#### Display Progress

- Show the current question number and the total number of questions.

#### Progress Bar

- Display a visual progress bar.

#### Navigate to Previous Question

- For Psychology tests, provide a button to go back to the previous question.

#### Analytics Event Hooks (Reference)

- (For later Analytics/Growth implementation)
  - `view_question` when a question is shown.
  - `answer_question` when a user selects/enters an answer.
  - `exit_during_question` if the user leaves before completion (optional).

### 4.2. UI Requirements

#### Header Area

- Display question number at the top (e.g., "1 / 10").
- Back button (only for Psychology tests, hidden on the first question).
- Progress bar with a gradient background.

#### Question Area

- Display the question text.

#### Answer Area

- UI varies by test type.

### 4.3. Interaction Requirements

- The progress bar should animate smoothly when the question changes.
- Clicking the back button should navigate to the previous question, preserving the previously selected answer.

---

## 5. Psychology Test Question Progress

### 5.1. Functional Requirements

#### Gender Selection

- Gender must be selected before starting the test.

#### Display Question

- Display the question text in the center.

#### Display Choices

- Show multiple choices as buttons.

#### Answer Selection

- Clicking a choice immediately moves to the next question.

#### Navigate to Previous Question

- Ability to return to the previous question.

#### Save Answers

- Store the answer for each question.

### 5.2. UI Requirements

#### Question Section

- Gradient background.
- Centrally aligned question text.
- Large font size.

#### Choice Buttons

- Each choice is a button.
- Show a check icon on hover.
- Change background and border color on hover.
- Slight scale effect on click.

#### Back Button

- Display a back button in the header.

### 5.3. Interaction Requirements

- Clicking a choice immediately moves to the next question.
- Clicking the back button moves to the previous question, displaying the previously selected answer.
- After completing the last question, navigate to the result page.

---

## 6. Balance Game Question Progress

### 6.1. Functional Requirements

#### Display Question

- Show question text and an optional image.

#### Two-Option Selection

- Choose between two options, A or B.

#### Display Statistics

- After selection, show the overall user statistics for that choice.

#### Move to Next Question

- Proceed to the next question after viewing stats.

#### Save Answers

- Store the answer for each question.

### 6.2. UI Requirements

#### Pre-selection State

- Display question text and image (if available).
- Display options as two large A/B buttons.
- Each button has an A/B label and the option text.
- Border color change and shadow effect on hover.

#### Post-selection State

- Keep the question text visible.
- Display the selection ratio for each option as a progress bar.
- The user's choice is marked with a "Selected" badge.
- Show the percentage and participant count for each option.
- Display a "Next Question" or "View Results" button.

### 6.3. Interaction Requirements

- Selecting an option immediately transitions to the statistics view.
- Statistics are displayed with an animation.
- Clicking "Next Question" moves to the next question.
- For the last question, the button changes to "View Results".
- After completing the last question, navigate to the result page.

---

## 7. Quiz Question Progress

### 7.1. Functional Requirements

#### Display Question

- Show question text and an optional image.

#### Support Multiple Choice/Short Answer

- Support both question formats.

#### Select/Enter Answer

- Multiple Choice: Select one of the options.
- Short Answer: Input text.

#### Immediate Next

- For multiple choice, move to the next question immediately upon selection (except for the last question).

#### Submit Button

- Display a submit button for the last question or for short-answer questions.

#### Save Answers

- Store the answer for each question.

### 7.2. UI Requirements

#### Question Section

- Display question text.
- Display image if available.

#### Multiple-Choice UI

- Display choices as buttons.
- Visually distinguish the selected option.
- Change background and border color on hover.

#### Short-Answer UI

- Text input field.
- Display placeholder text.
- Guide users that they can submit with the Enter key.

#### Submit Button

- Only visible on the last question or for short-answer questions.
- Disabled if no answer is provided.
- Gradient background.

### 7.3. Interaction Requirements

- **On multiple-choice selection:**
  - If not the last question: Immediately move to the next question.
  - If the last question: Enable the submit button.
- **On short-answer input:**
  - Can be submitted with the Enter key.
  - Can be submitted with the submit button.
  - Submission is disabled if the answer is empty.
- After completing the last question, navigate to the result page.

---

## 8. Answer Storage and State Management

### 8.1. Answer Storage

#### Storage Method

- Managed in client-side state.

#### Storage Format

- Basic mapping from question IDs to selected choice IDs/values, e.g.:

```typescript
{
  answers: Array<{
    questionId: string;
    choiceId?: string;
    value?: string;
  }>;
  // Metadata for viral/compare flows:
  sessionId?: string;        // Unique ID for this play session
  compareGroupId?: string;   // Group ID when in compare mode
  entryRef?: 'direct' | 'share' | 'compare'; // How the user entered this test
}
```

#### Session Storage

- Utilize Session Storage if needed to persist state across refreshes.

### 8.2. State Management

#### Current Question Index

- Manage the index of the current question.

#### Answer List

- Store answers for all questions.

#### Test Completion Status

- Manage whether all questions have been answered.

#### Compare Mode State (Optional)

- Persist `compareGroupId` and `entryRef` if the user entered via share or compare links.

---

## 9. Test Completion Process

### 9.1. Completion Condition

- When all questions have been answered.

### 9.2. Action on Completion

#### Calculate Results

- Calculate the result based on the collected answers.

#### Store Results

- Save the calculated results to Session Storage (if needed by the result page).

#### Determine Result Mode

- If `compareGroupId` is present:
  - Mark the completion context as compare mode.
- Else:
  - Use normal result mode.

#### Page Navigation

- Automatically navigate to the result page.

### 9.3. Navigation to Result Page

#### Base URL

- `/tests/[id]/result`

#### Query Parameters

- In normal mode (no compare): `/tests/[id]/result`
- In compare mode: `/tests/[id]/result?mode=compare&group={compareGroupId}`

#### Navigation Method

- Programmatic navigation via router.

---

## 10. Error Handling

### 10.1. Data Loading Failure

- If test information fails to load, redirect to a 404 page.
- Provide a clear error message to the user.

### 10.2. Invalid Test ID

- If the test ID does not exist, redirect to a 404 page.

### 10.3. No Question Data

- If a test has no questions, display an appropriate message or redirect to a 404 page.

---

## 11. Accessibility

### 11.1. Keyboard Navigation

- All interactive elements must be keyboard-accessible.
- Choices can be navigated sequentially using the Tab key.
- Choices can be selected using the Enter key.
- Focus indicators must be clearly visible.

### 11.2. Screen Readers

- Question text must be readable by screen readers.
- Provide clear labels for choices.
- Progress information must be perceivable by screen readers.
- Provide alt text for all images.

### 11.3. Visual Feedback

- Provide visual feedback for all interactions.
- Focus states must be clearly indicated.
- Selected states must be clearly distinguishable.

---

## 12. Performance

### 12.1. Initial Loading

- Use Server-Side Rendering (SSR) to load initial test information.
- The test thumbnail image should be prioritized for loading.

### 12.2. Question Progression

- All question data should be loaded initially.
- Transitions between questions should be handled on the client-side for speed.

### 12.3. Image Optimization

- All images must be optimized with appropriate sizes and formats.
- Apply lazy loading to question images if necessary.

---

## 13. User Experience

### 13.1. Loading State

- Display a skeleton UI or loading indicator during initial load.
- Clearly communicate to the user that content is loading.

### 13.2. Interaction Feedback

- Provide immediate visual feedback for all clickable elements.
- Use smooth animations for transitions between questions.
- Provide immediate feedback upon selection.

### 13.3. Progression Experience

- The progress bar should clearly indicate the user's current position.
- The question counter helps users understand how many questions are left.
- Provide an optimized experience tailored to each test type.

### 13.4. Completion Experience

- Ensure a natural transition to the result page upon completion.
- Minimize unnecessary waiting time during the completion process.
- Optionally show playful copy during navigation (e.g., "Preparing your result… ready to share with friends?").

---



# Test Result Page PRD

## 1. Overview

### 1.1. Page Information

- **Page Path**: `/tests/[id]/result`
- **Query Parameters**:
  - `?ref=share` – accessed via a shared link
  - `?mode=result` – user’s own result (default)
  - `?mode=shared` – viewing someone else’s shared result
  - `?mode=compare` – viewing result in compare/group mode
  - `?group={groupId}` – compare group identifier (optional)
- **Page Type**: Result Display Page
- **Access Permission**: Accessible to both non-members and members.

### 1.2. Page Purpose

The Test Result Page displays the results of a completed test, allows for sharing, and recommends related tests.

The main objectives are:

- To display customized results based on the test type.
- To provide detailed information about the result and its meaning.
- To encourage social sharing and viral spread.
- To drive re-engagement by recommending related tests.
- To enable **“compare with friends”** experiences that generate conversation topics.

### 1.3. User Scenarios

1. **Checking Results (Normal Flow)**
   Enters the result page after completing a test → Views their result → Shares or retries the test → Optionally explores recommended tests.

2. **Accessing via Shared Link**
   Clicks a shared link (e.g., `?ref=share&mode=shared`) → Views the shared result → Clicks "Take This Test Too" → Completes the test → Lands on their own result page.

3. **Friend Compare Flow (2–N people)**
   - User A completes a test → Clicks "Compare with Friends" → A compare link with `mode=compare&group={groupId}` is generated and shared.
   - User B (and others) open the compare link → Take the same test → Land on result page with compare mode.
   - Result page shows **“Me vs Friend/Group”** comparison cards.

4. **Exploring Results & Re-engagement**
   Views their result → Scrolls down to see recommended tests → Selects another test (same category/series/theme) and starts again.

### 1.4. Positioning & Core Value (Result Page Perspective)

- **Product Mission (One-Liner)**
  > “Pickid is a psychology & balance test playground that automatically generates conversation topics to share with friends.”

- The result page is the **core moment** where:
  - The test transforms into **“shareable content”** (screenshots, links, stories).
  - Users decide whether to:
    - Share with friends,
    - Compare results,
    - Or continue exploring more tests.

- Therefore, the result page must:
  - Present results in **meme-friendly and screenshot-friendly** format.
  - Provide **clear CTAs** for sharing and comparing.
  - Surface **relevant next tests** (same category/series/theme) to maintain engagement.

---

## 2. Common Elements

### 2.1. CTA Button Area

#### 2.1.1. User's Own Result Page (`mode="result"`)

- **"Retry" Button**
  - Navigates to the test page to retake the test (`/tests/[id]`).

- **"Share" Button**
  - Triggers share behavior (native Share API or clipboard copy).

- **"Compare with Friends" Button (Optional Feature)**
  - Creates or uses a `groupId` for this test.
  - Generates a compare link:
    - `/tests/[id]/result?mode=compare&group={groupId}`
    - or `/tests/[id]?ref=compare&group={groupId}` (implementation-dependent).
  - Copies the link or opens native Share dialog.
  - Used for “friend/group compare” flows.

- **"Explore Other Tests" Button**
  - Navigates to the home page or test discovery page.

#### 2.1.2. Shared Result Page (`mode="shared"` or `ref=share`)

- **"Take This Test Too" Button**
  - Navigates to the test detail page (`/tests/[id]`).

- **"Explore Other Tests" Button**
  - Navigates to the home page.

- Optionally show:
  - A subtle message: “You are viewing a friend’s result.”

#### 2.1.3. Compare Mode Page (`mode="compare"` with `group={groupId}`)

- **"Invite More Friends" Button**
  - Uses the same `groupId` link to invite additional participants.

- **"Explore Other Tests" Button**
  - Navigates to the home page.

- Page may set a **default active tab** to “Compare” sections (if type supports compare).

---

### 2.2. Share Functionality

#### 2.2.1. Sharing Method

- **Native Share API**
  - Use the system’s share dialog on mobile environments.
  - Includes title, message, and URL.

- **Clipboard Copy**
  - If the native Share API is unavailable or fails, copy the URL to the clipboard.

- **Success Toast**
  - Display a toast message on successful sharing or copying.
  - Example: “Link copied! Share it in your group chat.”

#### 2.2.2. Shared URL Rules

- **Psychology / Quiz**
  - Share result page URL:
    - `/tests/[id]/result?ref=share&mode=shared`
  - Optionally include encoded result info in state or backend (not in URL) for privacy.

- **Balance Game**
  - Share test page URL:
    - `/tests/[id]?ref=share`
  - Users will play the test again rather than see the exact result.

- **Compare Link (Optional)**
  - Group-based compare links:
    - `/tests/[id]/result?mode=compare&group={groupId}`
  - Backend or client associates `groupId` with multiple result entries.

#### 2.2.3. Share Text & Result Card Template

**Share Text Template**

- Components:
  - User name or alias (if available).
  - Result name/type.
  - A short meme-style line.
  - A call-to-action to tag/mention friends.
  - The share URL.

- Example:
  - `"[A Friend] got [Chatroom Planner Type] 🤯 This is so me. Tag the friend who would get this too 👉 [URL]"`

**Result Card Structure (for OG/Story)**

- **Fields (in Result Data Model)**
  - `shareTitle`: Meme-style one-liner for the result.
  - `shareSubtitle`: Short CTA-like subtitle encouraging sharing.
  - `shareTags` (optional): Hash tags or keywords.

- **Visual Structure**
  - Main title (shareTitle) in large bold text.
  - Subtitle (shareSubtitle) as smaller line.
  - Test name + brand/logo in a footer area.
  - Optional: category/series/theme labels (e.g. “Love / Love Drama Series”).

- This structure is used consistently across:
  - OG tags (link previews),
  - Screenshot-friendly cards,
  - Story templates (9:16).

---

### 2.3. Popular / Recommended Test Section

- Display a **“Popular Tests” or “Recommended for You”** section at the bottom of the result page.

#### 2.3.1. Functional Requirements

- **Base Behavior**
  - Show a list of tests excluding the current one.
  - At least 3–6 tests, depending on screen size.

- **Recommendation Logic (initial)**
  - Priority order:
    1. Tests from the same **main category** (e.g., Love/Relationships).
    2. Tests from the same **series** (if any).
    3. Tests from the same **theme/campaign** (if any).
    4. Overall popular tests (most responses in recent period).

- **Personalization (future)**
  - If user has profile/onboarding info:
    - Show a “For You” block based on age/interest tags.

- **Navigation**
  - Clicking a test card navigates to that test’s detail page (`/tests/[id]`).

#### 2.3.2. UI Requirements

- **Section Title**
  - Examples:
    - “Popular Tests”
    - “More Tests You Might Like”
    - “More from This Series”

- **Card Layout**
  - Thumbnail, title, short category label/tag.
  - Optional tag for series, e.g. `[Love Drama Series]`.

---

### 2.4. Friend Compare Functionality (Cross-Type Concept)

> Specific UI may differ by test type, but the concept is shared.

#### 2.4.1. Concept

- Enable users to compare their results with friends using:
  - 1:1 comparison (Me vs Friend).
  - Group comparison (Me vs Group distribution).

#### 2.4.2. Flow Overview

1. User A finishes test → On result page (mode=`result`).
2. A clicks “Compare with Friends”.
   - System:
     - Creates/uses a `groupId`.
     - Generates compare link: `/tests/[id]/result?mode=compare&group={groupId}`.
3. User B opens compare link → Takes the test (if not finished).
4. After completion:
   - B lands on result page with compare mode (mode=`compare`).
   - Sees:
     - Their own result.
     - A vs group distribution or A vs B result comparison.

#### 2.4.3. UI Requirements (Generic)

- Compare section title examples:
  - “Compare with Friends”
  - “Among Us, Who Is the Most ___?”
- Show:
  - My result vs friend/group results.
  - Simple summary line, e.g.:
    - “You’re the most extroverted in this group.”
    - “Most of your friends are in [Type A], you’re in [Type B].”

---

## 3. Psychology Test Results

### 3.1. Page Structure

```text
[Result Header]
[Description Section]
[Careers Section]
[Compatibility Section]
[Gifts Section]
[Friend Compare Section (optional)]
[Popular / Recommended Tests Section]
[CTA Button Area]
```

### 3.2. Result Header

#### 3.2.1. Functional Requirements

- **Display Result Image**: Show the main image for the result (if available).
- **Display Result Name**: Show the name of the result type.
- **Display Result One-Line Summary**: Show a brief, meme-style one-line description (shareTitle or similar).
- **Display Category/Series/Theme (Optional)**: Show labels/pills of:
  - Main category (e.g., Love/Relationships).
  - Series (if any).
  - Theme/campaign (if any).

#### 3.2.2. UI Requirements

- **Card Format**: Card with white background or light gradient.
- **Image Area**:
  - If a result image exists, display it at the top.
  - Square aspect ratio.
  - Center-aligned.
- **Title Area**:
  - Display the result name in a large font.
  - Apply a theme color.
- **One-Line Description**:
  - Center-aligned.
  - Short and catchy (meme-friendly).
- **Metadata Tags**: Small pills for category/series/theme under or above title.

---

### 3.3. Description Section

#### 3.3.1. Functional Requirements

- **Display Detailed Description**: Show a multi-line, detailed description of the result. Explain core traits and tendencies.
- **Support Line Breaks**: Properly render line breaks in the description text.

#### 3.3.2. UI Requirements

- **Card Format**: Card with a gradient background.
- **Background Decoration**: Circular decorative element in the top-right corner.
- **Text Style**: Readable font size and line height.

---

### 3.4. Careers Section

#### 3.4.1. Functional Requirements

- **Display Career List**: Show a list of suitable careers as tags.
- **Max Display Count**: Display up to 8 careers.

#### 3.4.2. UI Requirements

- **Card Format**: Card with a white background.
- **Section Title**: "Recommended Careers" with a dot prefix.
- **Career Tags**:
  - Rounded tags.
  - Background color based on the theme color.
  - Slight scale effect on hover.
- **Background Decoration**: Circular decorative element in the top-right corner.

---

### 3.5. Compatibility Section

#### 3.5.1. Functional Requirements

- **Display Best Match**: Show a list of the most compatible types.
- **Display Worst Match**: Show a list of the least compatible types.

#### 3.5.2. UI Requirements

- **Card Format**: Card with a white background.
- **Section Titles**: "Best Match" / "Worst Match" with a dot prefix.
- **Type List**:
  - Each type is a card.
  - Best Match: positive color scheme (e.g., greens).
  - Worst Match: contrasting color scheme (e.g., reds).
  - Each card displays the type name and a brief description.
- **Background Decoration**: Circular decorative element in the top-left corner.

---

### 3.6. Gifts Section

#### 3.6.1. Functional Requirements

- **Display Gift List**: Show a list of recommended gifts suitable for the result type.

#### 3.6.2. UI Requirements

- **Card Format**: Card with a white background.
- **Section Title**: "Recommended Gifts" with a dot prefix.
- **Gift List**:
  - Each gift is a card.
  - Background color based on the theme color.
  - Background color change on hover.
- **Background Decoration**: Circular decorative element in the top-left corner.

---

### 3.7. Shared Link Landing Page (mode="shared" / ref=share)

#### 3.7.1. Functional Requirements

- **Display Shared Result**: When accessed via a shared link, display the shared result as read-only.
- **"Take This Test Too"**: Provide a button that navigates to the test page.

#### 3.7.2. UI Requirements

- **Result Display**: Same layout as the user's own result page.
- **Notice**: Small notice such as "You are viewing a friend's result."
- **CTA Buttons**: "Take This Test Too" and "Explore Other Tests" buttons.

---

### 3.8. Friend Compare Section (mode="compare")

#### 3.8.1. Functional Requirements

- **Compare My Result vs Friends/Group**: Show the user's result next to:
  - Friend's result (for 2-person compare).
  - Group distribution (for group compare).
- **Metrics to Show (examples)**:
  - Percentage of group by each result type.
  - Highlight which result types are most/least common in the group.
  - Simple derived insights (e.g., "You're one of the few planners in this group.").

#### 3.8.2. UI Requirements

- **Layout**:
  - Section below core psychology sections.
  - Separate cards for: "You vs Friend", "You vs Group"
- **Copy Examples**:
  - "You're the only one in this group with this type."
  - "Most of your friends are [Type A], you're [Type B]."

---

## 4. Balance Game Results

### 4.1. Page Structure

```text
[Result Header]
[Fun Statistics Section]
[Friend Compare Section (optional / future)]
[Popular / Recommended Tests Section]
[CTA Button Area]
```

### 4.2. Result Header

#### 4.2.1. Functional Requirements

- **Display Test Title**: Show the title of the balance game.
- **Display User Name**: For logged-in users, display their name (optional).

#### 4.2.2. UI Requirements

- **Completion Icon**: Display a check icon to indicate completion.
- **Title**: Display the test title in a large font.
- **User Name**: Display as: "{Name}'s Balance Game Results" if applicable.
- **Center Alignment**: All elements centered.

---

### 4.3. Fun Statistics Section

#### 4.3.1. Functional Requirements

- **Closest Matchup**: Display the question with the most even vote distribution.
- **Landslide Victory**: Display the question with the most one-sided vote distribution.

#### 4.3.2. Closest Matchup UI

- **Card Format**: Card with a white background.
- **Section Title**: "Closest Matchup" with a scale icon.
- **Description**: "Opinions were extremely divided on this one."
- **Question Display**: Question text on a purple/pink gradient background.
- **Choice Display**:
  - Option A: purple-themed background.
  - Option B: pink-themed background.
  - Show percentage and participant count for each choice.
  - Visualize ratio with a progress bar.

#### 4.3.3. Landslide Victory UI

- **Card Format**: Card with a white background.
- **Section Title**: "Landslide Victory" with a flame icon.
- **Description**: "Almost everyone chose one side for this question."
- **Question Display**: Question text on an orange/amber gradient background.
- **Choice Display**:
  - Winning choice: orange/amber gradient background, highlighted.
  - Losing choice: gray background, de-emphasized.
  - Show percentage and participant count for each choice.
  - Visualize ratio with a progress bar.

---

### 4.4. Shared Link Handling

- Balance Games do not support standalone result page sharing.
- If accessed via a "result" share link by mistake:
  - Display a message guiding the user to the test page.
  - Provide a "Go to Test" button (`/tests/[id]`).

---

## 5. Quiz Results

### 5.1. Page Structure

```text
[Result Header]
[Detailed Results Section]
[Popular / Recommended Tests Section]
[CTA Button Area]
```

### 5.2. Result Header

#### 5.2.1. Functional Requirements

- **Display Quiz Title**: Show the quiz title.
- **Display Score**: Show the earned score as a large number.
- **Display Grade**: Show a grade based on the score (e.g., A, B, C).
- **Display Correct Answers Count**: Show number of correct answers vs total questions.
- **Display Accuracy Rate**: Show accuracy as a percentage.

#### 5.2.2. UI Requirements

- **Header Background**: Theme-based gradient background.
- **Score Card**:
  - Card with a white, semi-transparent background.
  - Large score number.
  - Grade as badge.
- **Answer Info**: Correct count and accuracy rate as text.
- **Center Alignment**: All elements centered.

---

### 5.3. Detailed Results Section

#### 5.3.1. Functional Requirements

- **Show Incorrect Answers**: Display only the questions answered incorrectly.
- **Randomize Question Order**: Shuffle incorrect questions.
- **Default Display Count**: Initially show only 3 incorrect answers.
- **"Show More" Functionality**: "Show More" button reveals the rest of the incorrect answers. Optionally provide "Collapse" control.

#### 5.3.2. UI Requirements

- **Card Format**: Card with a white background.
- **Section Title**: "Incorrect Answers" with count of incorrect questions.
- **Question Card**:
  - Incorrect icon.
  - Question number.
  - "Incorrect" badge.
  - Clear distinction:
    - "Your Answer" (regular text).
    - "Correct Answer" (highlighted green text).
- **"Show More" Button**: Displayed if more than 3 incorrect answers.

#### 5.3.3. Empty State Handling

- If there are no incorrect answers:
  - Hide this section.
  - Optionally show a simple message like "Perfect! No incorrect answers 🎉".

---

### 5.4. Shared Link Handling

- Quiz result page sharing is not supported by default (to simplify UX).
- If accessed via a quiz result share link:
  - Display a message guiding the user to take the quiz.
  - Provide a "Go to Test" button (`/tests/[id]`).

---

## 6. Error Handling

### 6.1. Data Loading Failure

- If result data fails to load:
  - Display an error message.
  - Provide an option for the user to retry (optional).

### 6.2. No Result Data

- If there is no result data:
  - Display an appropriate message.
  - Provide a button to navigate to the test page.

### 6.3. Invalid Test ID

- If the test ID is invalid:
  - Redirect to a 404 page.

---

## 7. Accessibility

### 7.1. Keyboard Navigation

- All interactive elements must be keyboard-accessible.
- Buttons can be navigated sequentially using the Tab key.
- Buttons can be activated using the Enter key.
- Focus indicators must be clearly visible.

### 7.2. Screen Readers

- Result information must be readable by screen readers.
- Provide appropriate ARIA labels for sections.
- Provide alt text for images.
- Provide clear descriptions for buttons and links.

### 7.3. Visual Feedback

- Provide visual feedback for all interactions.
- Focus states must be clearly indicated.
- Hover states must be clearly distinguishable.

---

## 8. Performance

### 8.1. Initial Loading

- Result data is loaded on the client-side (or hydration-aware if SSR).
- Display a skeleton UI or loading indicator during load.

### 8.2. Image Optimization

- All images must be optimized with appropriate sizes and formats.
- Result images should be loaded with priority.

### 8.3. Data Optimization

- Load only necessary data for the current result and recommendations.
- Use memoization/caching to prevent unnecessary recomputations.

---

## 9. User Experience

### 9.1. Loading State

- Display a skeleton UI or loading indicator during data loading.
- Clearly communicate to the user that content is loading.

### 9.2. Interaction Feedback

- Provide immediate visual feedback for all clickable elements.
- Display a toast message on successful share or compare-link generation.
- Provide hover/press effects on buttons.

### 9.3. Content Flow

- Display result information in a logical, readable order.
- Keep scannable structure: Header → Key sections (description, careers, etc.) → Compare (if any) → Recommendations → CTAs.

### 9.4. Sharing & Compare Experience

- Ensure share and compare actions are:
  - Intuitive,
  - Close to the main result card,
  - Clearly labeled.
- Provide friendly, conversational copy for:
  - Successful share,
  - Compare link creation,
  - Inviting friends.
- Example: "Link copied! Drop this in your chat and see what your friends get 🙌"



# Authentication Page PRD

## 1. Overview

### 1.1. Page Information

- **Login Page Path**: `/auth/login`
- **Registration Page Path**: `/auth/register`
- **Page Type**: Authentication Page
- **Access Permission**: Accessible to both non-members and members.

### 1.2. Page Purpose

The Authentication Page allows users to log in or register for the service. The main objectives are:

- To provide personalized services through user authentication
- To encourage quick registration through convenient social login
- To provide secure email/password-based authentication
- To provide convenient access through the side drawer

### 1.3. User Scenarios

1. **Direct Access**: Direct access via login/registration page URL
2. **Side Drawer Access**: Click header menu button → Open side drawer → Click "Login / Register" button → Navigate to login page
3. **Login**: Email/password or Kakao login → Redirect to homepage on success
4. **Registration**: Email/password or Kakao registration → Redirect to homepage on success

---

## 2. Page Access Paths

### 2.1. Direct Access

- Direct access via URL: `/auth/login`, `/auth/register`

### 2.2. Side Drawer Access

- **Header Menu Button**: Click menu button in the top-right of the header
- **Open Side Drawer**: Side drawer opens
- **Login/Register Button**: "Login / Register" button displayed at the top of the side drawer
- **Page Navigation**: Clicking the button navigates to the login page

### 2.3. Page Navigation

- Provide a link from the login page to the registration page
- Provide a link from the registration page to the login page

---

## 3. Login Page

### 3.1. Page Structure

```text
[Header Area]
- Title: "Login"
- Subtitle: "Discover yourself on Pickid"

[Authentication Form]
- Kakao login button
- Divider
- Email input field
- Password input field
- Login button
- Registration page link
```

### 3.2. Functional Requirements

#### 3.2.1. Email/Password Login

- **Email Input**: Email address input field
- **Password Input**: Password input field (masked)
- **Form Validation**:
  - Email format validation
  - Password minimum length validation (6 characters or more)
- **Login Processing**: Attempt login with entered information
- **Success Action**: Redirect to homepage on successful login
- **Failure Action**: Display error message

#### 3.2.2. Kakao Social Login

- **Kakao Login Button**: Provide Kakao login button
- **Social Login Processing**: Execute Kakao authentication flow
- **Success Action**: Redirect to homepage on successful login
- **Failure Action**: Display error message

#### 3.2.3. Error Handling

- **Error Message Display**: Display error message at the top on login failure
- **Error Message Format**: Warning box with red background
- **Error Message Content**: Display user-friendly error messages

### 3.3. UI Requirements

#### 3.3.1. Layout

- **Center Alignment**: Form placed at the center of the page
- **Background Effect**: Animated background blob effect
- **Card Format**: Card with semi-transparent white background
- **Responsive**: Adapt to various screen sizes

#### 3.3.2. Header Area

- **Title**: Display "Login" in large font
- **Subtitle**: Display "Discover yourself on Pickid" in smaller font

#### 3.3.3. Kakao Login Button

- **Button Style**: Apply Kakao brand color
- **Icon**: Display Kakao icon
- **Text**: "Start in 3 seconds with Kakao"
- **Position**: Top of the form

#### 3.3.4. Divider

- **Position**: Between Kakao login button and email login form
- **Text**: "Or login with email"

#### 3.3.5. Input Fields

- **Email Field**:
  - Label: "Email"
  - Placeholder: "your@email.com"
  - Red border on error state
- **Password Field**:
  - Label: "Password"
  - Placeholder: "••••••••"
  - Password show/hide toggle button
  - Red border on error state

#### 3.3.6. Login Button

- **Style**: Gradient background (rose-pink)
- **Text**: "Login"
- **Loading State**: Display loading indicator and "Logging in..." text when logging in
- **Disabled**: Disable button during submission

#### 3.3.7. Registration Link

- **Position**: Bottom of the form
- **Text**: "Don't have an account yet? Register"
- **Link Color**: Rose color

---

## 4. Registration Page

### 4.1. Page Structure

```text
[Header Area]
- Logo (optional)
- Title: "Register"
- Subtitle: "Start with Pickid"

[Authentication Form]
- Kakao registration button
- Divider
- Nickname or name input field
- Email input field
- Password input field
- Password confirmation input field
- Registration button
- Login page link
```

### 4.2. Functional Requirements

#### 4.2.1. Email/Password Registration

- **Nickname Input**: Nickname or name input field
- **Email Input**: Email address input field
- **Password Input**: Password input field (masked)
- **Password Confirmation Input**: Password confirmation input field (masked)
- **Form Validation**:
  - Nickname: 2-20 characters
  - Email format validation
  - Password minimum length validation (6 characters or more, maximum 100 characters)
  - Password match validation
- **Registration Processing**: Attempt registration with entered information
- **Success Action**: Redirect to homepage on successful registration
- **Failure Action**: Display error message

#### 4.2.2. Kakao Social Registration

- **Kakao Registration Button**: Provide Kakao login button (same as login)
- **Social Registration Processing**: Execute Kakao authentication flow
- **Success Action**: Redirect to homepage on successful registration
- **Failure Action**: Display error message

#### 4.2.3. Error Handling

- **Error Message Display**: Display error message at the top on registration failure
- **Field-Specific Error Display**: Display error message for each input field
- **Error Message Format**: Display in red text below the field

### 4.3. UI Requirements

#### 4.3.1. Layout

- Same layout as login page
- Logo display option (only on registration page)

#### 4.3.2. Header Area

- **Logo**: Display logo image (optional)
- **Title**: Display "Register" in large font
- **Subtitle**: Display "Start with Pickid" in smaller font

#### 4.3.3. Kakao Registration Button

- Same style as login page
- Text: "Start in 3 seconds with Kakao"

#### 4.3.4. Divider

- **Position**: Between Kakao registration button and email registration form
- **Text**: "Or continue with email"

#### 4.3.5. Input Fields

- **Nickname Field**:
  - Label: "Nickname or Name"
  - Placeholder: "Enter your nickname or name"
  - Red border on error state
- **Email Field**: Same as login page
- **Password Field**:
  - Label: "Password"
  - Placeholder: "Password with 6 or more characters"
  - Password show/hide toggle button
  - Red border on error state
- **Password Confirmation Field**:
  - Label: "Confirm Password"
  - Placeholder: "Enter your password again"
  - Password show/hide toggle button
  - Red border on error state

#### 4.3.6. Registration Button

- **Style**: Gradient background (rose-pink)
- **Text**: "Register"
- **Loading State**: Display loading indicator and "Registering..." text when registering
- **Disabled**: Disable button during submission

#### 4.3.7. Login Link

- **Position**: Bottom of the form
- **Text**: "Already have an account? Login"
- **Link Color**: Rose color

---

## 5. Form Validation

### 5.1. Login Form Validation

- **Email**:
  - Required
  - Valid email format
- **Password**:
  - Required
  - Minimum 6 characters

### 5.2. Registration Form Validation

- **Nickname**:
  - Required
  - Minimum 2 characters
  - Maximum 20 characters
- **Email**:
  - Required
  - Valid email format
- **Password**:
  - Required
  - Minimum 6 characters
  - Maximum 100 characters
- **Password Confirmation**:
  - Required
  - Must match password

### 5.3. Real-Time Validation

- **Validation During Input**: Validate in real-time as the user types
- **Error Display**: Display error message immediately on validation failure
- **Error Removal**: Automatically remove error message on validation success

---

## 6. Error Handling

### 6.1. Form Errors

- **Field-Specific Errors**: Display error message in red text below each input field
- **General Errors**: Display error message in warning box with red background at the top of the form

### 6.2. Authentication Errors

- **Login Failure**: Display error messages for incorrect email/password, non-existent account, etc.
- **Registration Failure**: Display error messages for existing email, weak password, etc.
- **Social Login Failure**: Display error message on social login cancellation or failure

### 6.3. Error Message Format

- **User-Friendly**: Easy-to-understand messages instead of technical error messages
- **Clear Guidance**: Messages that provide problem-solving methods

---

## 7. Success Handling

### 7.1. Login Success

- **Redirect**: Automatically navigate to homepage (`/`)
- **Session Maintenance**: Maintain login state

### 7.2. Registration Success

- **Redirect**: Automatically navigate to homepage (`/`)
- **Auto Login**: Automatically switch to logged-in state upon registration

---

## 8. Accessibility

### 8.1. Keyboard Navigation

- All input fields must be accessible via Tab key in sequence
- Form submission possible with Enter key
- Focus indicators must be clearly visible

### 8.2. Screen Readers

- Provide appropriate labels for all input fields
- Error messages must be readable by screen readers
- Provide clear descriptions for buttons

### 8.3. Visual Feedback

- Provide visual feedback for all interactions
- Focus states must be clearly indicated
- Error states must be clearly distinguishable

---

## 9. Performance

### 9.1. Form Validation

- Optimize real-time validation through debouncing
- Prevent unnecessary re-renders

### 9.2. Loading State

- Display loading indicator on button during submission
- Disable button during submission to prevent duplicate submissions

---

## 10. User Experience

### 10.1. Loading State

- Display clear loading state during login/registration processing
- Ensure users can recognize the progress

### 10.2. Interaction Feedback

- Provide immediate visual feedback for all clickable elements
- Provide visual effects on button hover
- Provide visual effects on input field focus

### 10.3. Form Flow

- Arrange input fields in logical order
- Distinguish between required and optional fields
- Natural transitions between pages

### 10.4. Social Login Experience

- Place Kakao login button prominently
- Encourage quick registration through social login
- Provide clear guidance on social login failure

---

# Feedback Page PRD

## 1. Overview

### 1.1. Page Information

- **Feedback List Page Path**: `/feedback`
- **Feedback Create Page Path**: `/feedback/create`
- **Feedback Detail Page Path**: `/feedback/[id]`
- **Page Type**: Feedback Collection and Viewing Page
- **Access Permission**: Accessible to both non-members and members.

### 1.2. Page Purpose

The Feedback Page allows users to submit feedback and view submitted feedback. The main objectives are:

- To collect user opinions and suggestions
- To collect bug reports and improvement suggestions
- To transparently display submitted feedback
- To facilitate communication through admin responses

### 1.3. User Scenarios

1. **Submitting Feedback**: Enters feedback list page → Clicks feedback create button → Writes feedback → Submits
2. **Viewing Feedback**: Views feedback list on feedback list page → Navigates to feedback detail page
3. **Checking Admin Response**: Views admin response on feedback detail page

---

## 2. Feedback List Page

### 2.1. Page Structure

```text
[Header Area]
- Title: "Feedback"
- Subtitle: "Share your thoughts"
- Feedback create button

[Feedback List Area]
- Feedback card list
- Empty state handling
- Loading state handling
- Error state handling
```

### 2.2. Functional Requirements

#### 2.2.1. Feedback List Display

- **List View**: Display all submitted feedback list
- **Sort by Latest**: Latest feedback displayed at the top
- **Feedback Card Click**: Clicking a feedback card navigates to the detail page

#### 2.2.2. Feedback Create Button

- **Button Position**: Top-right of header
- **Button Click**: Navigates to feedback create page

#### 2.2.3. Loading State

- **Loading Indicator**: Display spinner while data is loading

#### 2.2.4. Error State

- **Error Message**: Display error message when data loading fails
- **Retry Button**: Provide retry button when error occurs

### 2.3. UI Requirements

#### 2.3.1. Header Area

- **Title**: Display "Feedback" in large font
- **Subtitle**: Display "Share your thoughts" in smaller font
- **Feedback Create Button**:
  - Button with dark background
  - "Create Feedback" text
  - Navigates to feedback create page on click

#### 2.3.2. Feedback Card

- **Card Format**: Card with white background
- **Card Components**:
  - Left indicator: Blue if admin response exists, gray otherwise
  - Category emoji and title
  - Status badge (pending, in_progress, completed, replied, rejected)
  - Content preview (up to 2 lines)
  - Admin response preview (if available, up to 1 line)
  - Author name and creation date
- **Hover Effect**: Shadow and border color change on card hover
- **Clickable**: Entire card is clickable

#### 2.3.3. Empty State

- **Icon**: Display conversation emoji
- **Title**: "No feedback yet"
- **Description**: "Be the first to leave feedback"

#### 2.3.4. Loading State

- **Spinner**: Display rotating spinner at center

#### 2.3.5. Error State

- **Icon**: Display warning emoji
- **Title**: "An error occurred"
- **Error Message**: Display error message
- **Retry Button**: Provide "Retry" button

---

## 3. Feedback Create Page

### 3.1. Page Structure

```text
[Header Area]
- Title: "Send Feedback"
- Subtitle: "Share your thoughts"

[Feedback Form]
- Category selection
- Title input field
- Content input field
- Submit error message
- Cancel/Submit buttons
```

### 3.2. Functional Requirements

#### 3.2.1. Category Selection

- **Category Options**:
  - Bug Report (🐛)
  - Feature Suggestion (💡)
  - UI/UX Improvement (🎨)
  - Content Related (📝)
  - Other (💭)
- **Required Selection**: Category must be selected
- **Selection Indicator**: Display check icon on selected category

#### 3.2.2. Title Input

- **Required Input**: Title must be entered
- **Minimum Length**: 2 characters or more
- **Real-Time Validation**: Validate in real-time during input

#### 3.2.3. Content Input

- **Required Input**: Content must be entered
- **Minimum Length**: 10 characters or more
- **Multi-line Input**: Text area allows multiple lines
- **Real-Time Validation**: Validate in real-time during input

#### 3.2.4. Form Submission

- **Submission Processing**: Submit only when all fields are valid
- **Submission State**: Disable button and display loading during submission
- **Success Action**: Navigate to feedback list page on successful submission
- **Failure Action**: Display error message

#### 3.2.5. Cancel Functionality

- **Cancel Button**: Navigate to previous page on cancel button click
- **Cancel During Submission**: Disable cancel button during submission

### 3.3. UI Requirements

#### 3.3.1. Header Area

- **Title**: Display "Send Feedback" in large font
- **Subtitle**: Display "Share your thoughts" in smaller font

#### 3.3.2. Category Selection UI

- **Layout**: Display category list as buttons
- **Category Button**:
  - Each category is a button
  - Display emoji, category name, description
  - Selected category has dark border and background color
  - Display check icon on selected category
- **Error State**: Display red border and error message when category is not selected

#### 3.3.3. Title Input Field

- **Label**: "Title" (required indicator)
- **Placeholder**: "Enter title"
- **Error State**: Display red border and error message on validation failure

#### 3.3.4. Content Input Field

- **Label**: "Content" (required indicator)
- **Placeholder**: "Enter content"
- **Text Area**: Text area that allows multiple lines
- **Error State**: Display red border and error message on validation failure

#### 3.3.5. Submit Error Message

- **Position**: Bottom of form, above buttons
- **Style**: Warning box with red background
- **Content**: Display error message on submission failure

#### 3.3.6. Button Area

- **Cancel Button**:
  - Outline style
  - "Cancel" text
  - Navigate to previous page on click
- **Submit Button**:
  - Dark background
  - "Submit" text
  - Display "Submitting..." text and loading indicator during submission
  - Disable button during submission

---

## 4. Feedback Detail Page

### 4.1. Page Structure

```text
[Back Button]
[Feedback Detail Card]
- Header area (category, status, title, author, creation date)
- Content area
- Admin response area (if available)
```

### 4.2. Functional Requirements

#### 4.2.1. Feedback Detail Information Display

- **Category Display**: Display category emoji and name
- **Status Display**: Display status badge
- **Title Display**: Display feedback title
- **Author Display**: Display author name (or "Anonymous" if not available)
- **Creation Date Display**: Display creation date
- **Content Display**: Display full feedback content (preserve line breaks)

#### 4.2.2. Admin Response Display

- **Conditional Display**: Display only if admin response exists
- **Response Content Display**: Display admin response content
- **Response Date Display**: Display admin response date (if available)

#### 4.2.3. Back Functionality

- **Back Button**: Provide back button at the top
- **Back Action**: Navigate to previous page

#### 4.2.4. Loading State

- **Loading Indicator**: Display spinner while data is loading

#### 4.2.5. Error State

- **Error Message**: Display error message when feedback cannot be found
- **Action Buttons**: Provide "Back" and "Home" buttons

### 4.3. UI Requirements

#### 4.3.1. Back Button

- **Position**: Top header area
- **Style**: Arrow icon and "Back" text
- **Hover Effect**: Text color change on hover

#### 4.3.2. Feedback Detail Card

- **Card Format**: Card with white background
- **Header Area**:
  - Category emoji icon
  - Category name and status badge
  - Title
  - Author name and creation date
- **Content Area**:
  - Display full feedback content
  - Preserve line breaks
  - Readable font size and line height

#### 4.3.3. Admin Response Area

- **Position**: Below feedback content
- **Style**: Box with blue background
- **Header**:
  - Admin icon (A indicator)
  - "Admin Response" text
  - Response date (if available)
- **Content**:
  - Display admin response content
  - Preserve line breaks
  - Readable font size and line height

#### 4.3.4. Loading State

- **Spinner**: Display rotating spinner at center
- **Text**: Display "Loading..." text

#### 4.3.5. Error State

- **Title**: "Feedback not found"
- **Description**: "The requested feedback does not exist"
- **Buttons**: Provide "Back" and "Home" buttons

---

## 5. Feedback Categories

### 5.1. Category Types

- **Bug Report** (🐛): Report errors or issues
- **Feature Suggestion** (💡): Suggest new features
- **UI/UX Improvement** (🎨): Report design improvements
- **Content Related** (📝): Content-related opinions
- **Other** (💭): Other opinions

### 5.2. Category Display

- **Emoji**: Display unique emoji for each category
- **Name**: Display category name
- **Description**: Display description when category is selected

---

## 6. Feedback Status

### 6.1. Status Types

- **Pending** (pending): Feedback submitted and awaiting review
- **In Progress** (in_progress): Feedback reviewed and in progress
- **Completed** (completed): Feedback completed
- **Replied** (replied): Admin response completed
- **Rejected** (rejected): Feedback rejected

### 6.2. Status Display

- **Badge Format**: Display status as badge
- **Color Distinction**: Apply different colors by status
  - Pending: Yellow
  - In Progress: Blue
  - Completed/Replied: Green
  - Rejected: Red

---

## 7. Form Validation

### 7.1. Category Validation

- **Required Selection**: Category must be selected
- **Error Message**: "Please select a category."

### 7.2. Title Validation

- **Required Input**: Title must be entered
- **Minimum Length**: 2 characters or more
- **Error Messages**:
  - Not entered: "Please enter a title."
  - Minimum length not met: "Title must be at least 2 characters."

### 7.3. Content Validation

- **Required Input**: Content must be entered
- **Minimum Length**: 10 characters or more
- **Error Messages**:
  - Not entered: "Please enter content."
  - Minimum length not met: "Content must be at least 10 characters."

### 7.4. Real-Time Validation

- **Validation During Input**: Validate in real-time as the user types
- **Error Display**: Display error message immediately on validation failure
- **Error Removal**: Automatically remove error message on validation success

---

## 8. Error Handling

### 8.1. Form Errors

- **Field-Specific Errors**: Display error message in red text below each input field
- **Submit Errors**: Display error message in warning box with red background at the bottom of the form

### 8.2. Data Loading Errors

- **List Loading Failure**: Display error message and retry button when feedback list loading fails
- **Detail Loading Failure**: Display error message and action buttons when feedback detail loading fails

### 8.3. Error Message Format

- **User-Friendly**: Easy-to-understand messages instead of technical error messages
- **Clear Guidance**: Messages that provide problem-solving methods

---

## 9. Success Handling

### 9.1. Feedback Submission Success

- **Redirect**: Automatically navigate to feedback list page
- **Success Feedback**: Submitted feedback can be viewed on the list page

---

## 10. Accessibility

### 10.1. Keyboard Navigation

- All interactive elements must be keyboard-accessible
- Input fields can be navigated sequentially using Tab key
- Form submission possible with Enter key
- Focus indicators must be clearly visible

### 10.2. Screen Readers

- Provide appropriate labels for all input fields
- Error messages must be readable by screen readers
- Provide clear descriptions for buttons and links

### 10.3. Visual Feedback

- Provide visual feedback for all interactions
- Focus states must be clearly indicated
- Error states must be clearly distinguishable

---

## 11. Performance

### 11.1. Data Fetching

- Feedback list is fetched on the client-side
- Feedback detail is fetched on the client-side
- Apply appropriate caching strategy

### 11.2. Form Validation

- Optimize real-time validation through debouncing
- Prevent unnecessary re-renders

### 11.3. Loading State

- Display loading indicator on button during submission
- Disable button during submission to prevent duplicate submissions

---

## 12. User Experience

### 12.1. Loading State

- Display clear loading state during data loading
- Ensure users can recognize the progress

### 12.2. Interaction Feedback

- Provide immediate visual feedback for all clickable elements
- Provide visual effects on button hover
- Provide visual effects on input field focus

### 12.3. Form Flow

- Arrange input fields in logical order
- Distinguish between required and optional fields
- Natural transitions between pages

### 12.4. Feedback Viewing Experience

- Configure to easily view submitted feedback
- Clearly distinguish admin responses
- Intuitively understand feedback status

---

# Common Components & Layout PRD

## 1. Overview

### 1.1. Purpose

Common Components and Layout define components and layout structures used across all pages. The main objectives are:

- To provide a consistent user experience
- To ensure reusability of common functionality
- To provide global settings and state management
- To provide error handling and navigation

---

## 2. Global Layout (Root Layout)

### 2.1. Functional Requirements

#### 2.1.1. Metadata Configuration

- **Basic Metadata**: Set site title, description, keywords
- **Open Graph**: Configure OG tags for social media sharing
- **Twitter Card**: Configure card for Twitter sharing
- **Robots**: Configure search engine crawling
- **Verification**: Configure site verification tags

#### 2.1.2. Providers Configuration

- **QueryClientProvider**: Provide TanStack Query client
- **SessionProvider**: Provide authentication session management
- **Toaster**: Provide global toast messages

#### 2.1.3. Global Styles

- **Font Loading**: Configure global fonts
- **CSS Files**: Load global stylesheets

### 2.2. UI Requirements

- **HTML Structure**: Standard HTML structure
- **Language Setting**: Set to Korean (ko)
- **Viewport Setting**: Configure responsive viewport

---

## 3. App Layout (App Component)

### 3.1. Functional Requirements

#### 3.1.1. Container Structure

- **Max Width**: Set mobile max width
- **Background**: Semi-transparent white background with blur effect
- **Shadow**: Card-style shadow effect

#### 3.1.2. Top Gradient Line

- **Position**: Top of the page
- **Style**: Rose-pink gradient line
- **Height**: 1px

#### 3.1.3. Header Display

- **Position**: Top of all pages
- **Fixed**: Fixed to top on scroll

#### 3.1.4. Footer Display

- **Conditional Display**: Display only on main page
- **Position**: Bottom of the page

#### 3.1.5. Side Drawer

- **Position**: Accessible from all pages
- **Trigger**: Click header menu button

---

## 4. Header

### 4.1. Functional Requirements

#### 4.1.1. Logo/Back Button

- **Conditional Display**:
  - Main page or result share page: Display logo
  - Other pages: Display back button
- **Logo Click**: Navigate to main page
- **Back Click**: Navigate to previous page

#### 4.1.2. Menu Button

- **Position**: Top-right of header
- **Function**: Open side drawer

#### 4.1.3. Scroll Behavior

- **Scroll Up**: Show header when scrolling up
- **Scroll Down**: Hide header when scrolling down
- **Animation**: Smooth transition effect

### 4.2. UI Requirements

#### 4.2.1. Layout

- **Fixed Position**: Fixed to top (sticky)
- **Background**: White background
- **Border**: Gray border at bottom

#### 4.2.2. Logo

- **Image**: Logo SVG image
- **Size**: Display at appropriate size
- **Priority Loading**: Priority loading

#### 4.2.3. Back Button

- **Icon**: Left arrow icon
- **Hover Effect**: Background color change on hover

#### 4.2.4. Menu Button

- **Icon**: Hamburger menu icon
- **Hover Effect**: Background color change on hover

---

## 5. Footer

### 5.1. Functional Requirements

#### 5.1.1. Conditional Display

- **Display Condition**: Display only on main page
- **Hide Condition**: Hidden on other pages

#### 5.1.2. Information Display

- **Copyright**: Display copyright information
- **Contact**: Display email contact
- **Email Link**: Open mail app on email click

### 5.2. UI Requirements

#### 5.2.1. Layout

- **Background**: Gradient background
- **Center Alignment**: Center-align all content
- **Text Size**: Display in small font

#### 5.2.2. Information Display

- **Copyright**: "© 2025 픽키드. All rights reserved."
- **Contact**: "Contact: email address"
- **Email Link**: Clickable email link

---

## 6. Side Drawer

### 6.1. Functional Requirements

#### 6.1.1. Drawer Open/Close

- **Open**: Open on header menu button click
- **Close**:
  - Close on background click
  - Close on ESC key press
  - Close on menu item click
  - Close on back button click

#### 6.1.2. Authentication State-Based UI

- **Non-logged-in State**: Display logo, site information, login/register button
- **Logged-in State**: Display user profile, email, logout button

#### 6.1.3. Menu Navigation

- **Main Menu**: List of main feature menus
- **Other Features**: List of other feature menus
- **Menu Click**: Navigate to page and close drawer

### 6.2. UI Requirements

#### 6.2.1. Drawer Container

- **Position**: Slide from left side of screen
- **Width**: Mobile max width
- **Height**: Full screen height
- **Background**: White background
- **Overlay**: Display background overlay when drawer opens

#### 6.2.2. Non-logged-in State UI

- **Top Area**:
  - Background: Gray background
  - Logo/Site Information: Center-aligned
  - Site Name: Display in large font
  - Site Description: Display in smaller font
  - Login/Register Button: Rounded button style
- **Middle Area**:
  - Menu List: Scrollable area
  - Main Menu Section: "Main Menu" title and menu list
  - Other Features Section: "Other Features" title and menu list

#### 6.2.3. Logged-in State UI

- **Top Area**:
  - Background: Gray background
  - Profile Image: Circular profile image or default icon
  - Email: Display user email address
- **Middle Area**:
  - Menu List: Scrollable area
  - Main Menu Section: "Main Menu" title and menu list
  - Other Features Section: "Other Features" title and menu list
- **Bottom Area**:
  - Logout Button: Button with red border
  - Border: Gray border at top

### 6.3. Menu Configuration

#### 6.3.1. Main Menu

- **Psychology Test**: Navigate to psychology test category page
- **Balance Game**: Navigate to balance game category page
- **Personality Type Test**: Navigate to personality type test category page
- **Love Type Test**: Navigate to love type test category page
- **Popular Tests**: Navigate to popular tests page

#### 6.3.2. Other Features

- **Submit Feedback**: Navigate to feedback page

#### 6.3.3. Menu Item UI

- **Icon**: Display unique icon for each menu
- **Label**: Display menu name
- **Hover Effect**: Background color change on hover
- **Click Action**: Navigate to page and close drawer on click

### 6.4. Interaction Requirements

#### 6.4.1. Drawer Open/Close

- **Open Animation**: Slide-in animation from left
- **Close Animation**: Slide-out animation to left
- **Overlay**: Display background overlay when drawer opens

#### 6.4.2. Menu Click

- **Page Navigation**: Navigate to clicked menu's page
- **Drawer Close**: Automatically close drawer after page navigation

#### 6.4.3. Login/Register Button

- **Non-logged-in State**: Display "Login / Register" button
- **Click Action**: Navigate to login page and close drawer

#### 6.4.4. Logout Button

- **Position**: Bottom of drawer
- **Click Action**: Process logout, navigate to homepage, and close drawer

---

## 7. Error Pages

### 7.1. 404 Error Page (Not Found)

#### 7.1.1. Functional Requirements

- **Display Condition**: Display when accessing non-existent page
- **Error Message**: Display "Page not found" message
- **Description**: Display "The requested page does not exist or may have been moved." description
- **Action Buttons**:
  - "Home" button: Navigate to homepage
  - "Previous Page" button: Navigate to previous page

#### 7.1.2. UI Requirements

- **Layout**: Center-aligned error message
- **Icon**: Display error icon (optional)
- **Buttons**: Provide action buttons

### 7.2. General Error Page (Error)

#### 7.2.1. Functional Requirements

- **Display Condition**: Display when application error occurs
- **Error Message**: Display "An error occurred" message
- **Description**: Display "Please try again later or go to the homepage." description
- **Error Code**: Display error code (if available)
- **Action Buttons**:
  - "Retry" button: Attempt error recovery
  - "Home" button: Navigate to homepage
- **Additional Guidance**: Display "If the problem persists, please contact customer service." guidance message

#### 7.2.2. UI Requirements

- **Layout**: Center-aligned error message
- **Background**: Gradient background
- **Card Format**: Card with white background
- **Icon**: Display warning icon
- **Buttons**: Provide action buttons

---

## 8. Accessibility

### 8.1. Keyboard Navigation

- All interactive elements must be keyboard-accessible
- Side drawer can be closed with ESC key
- Sequential navigation possible with Tab key
- Focus indicators must be clearly visible

### 8.2. Screen Readers

- Provide clear descriptions for all buttons and links
- Drawer title must be readable by screen readers
- Error messages must be readable by screen readers

### 8.3. Visual Feedback

- Provide visual feedback for all interactions
- Focus states must be clearly indicated
- Hover states must be clearly distinguishable

---

## 9. Performance

### 9.1. Layout Optimization

- Prevent unnecessary re-renders
- Optimize conditional rendering

### 9.2. Image Optimization

- Priority loading for logo images
- Optimize profile images to appropriate size

### 9.3. Animation Optimization

- Provide smooth animations
- Use animations that do not impact performance

---

## 10. User Experience

### 10.1. Consistency

- Provide consistent layout across all pages
- Ensure consistent behavior of common components

### 10.2. Interaction Feedback

- Provide immediate visual feedback for all clickable elements
- Smooth animations for drawer open/close
- Visual effects on button hover

### 10.3. Navigation Experience

- Intuitive navigation structure
- Clear menu configuration
- Easy access paths

### 10.4. Error Handling Experience

- Provide clear error messages
- Provide recovery options
- Friendly error page design
