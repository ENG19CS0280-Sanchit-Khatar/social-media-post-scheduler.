# Schedulezy - A Social Media Post Scheduler made scheduling and posting easy.

A feature-rich, high-performance Social Media Post Scheduler built with **React, Vite, and Material UI**. This application allows users to compose, schedule, filter, and manage posts across multiple social media platforms (Facebook, Instagram, X, and TikTok) from a single centralized dashboard.

---

## Live Demo & Repository
* **Live Deployment:** [https://social-media-post-scheduler-one.vercel.app/](https://social-media-post-scheduler-one.vercel.app/)
* **GitHub Repository:** [https://github.com/ENG19CS0280-Sanchit-Khatar/social-media-post-scheduler](https://github.com/ENG19CS0280-Sanchit-Khatar/social-media-post-scheduler)

---

## Features Implemented (Assignment Checklist)

1. **Dashboard Queue Grouping**: Displays all 30+ mock posts grouped logically by day (Today, Tomorrow, and subsequent dates), featuring content previews, platform icons, scheduled times, and statuses.
2. **Advanced Filtering & URL Persistence**: Filter posts by platform and status, or search instantly by content. Filters persist across page refreshes via URL query parameters.
3. **Post Composer**: Fully functional composer supporting multi-platform selection, custom text content, optional media image URLs, and a date-time picker.
4. **Live Platform Character Limits**: Real-time character counters adhering to platform limits (X: 280, Instagram: 2,200, TikTok: 2,200, Facebook: 5,000). Compose button is disabled if any selected platform exceeds its limit.
5. **Timezone & Future Validation**: Validates that scheduled times are strictly in the future, stores dates in UTC, and renders them seamlessly in the user's local time zone.
6. **Retry Failed Posts**: Allows users to retry failed posts with an immediate optimistic UI update, a simulated 1-second API delay, a 20% random failure rate, and automatic rollback with an error message on failure.
7. **Robust UI States & Responsiveness**: Gracefully handles loading, empty, and error states.

---

## Key Technical & Architectural Decisions

* **Performance Optimizations**: 
  * Implemented Debounce which updates the `debouncedSearch` state for the search input to ensure minimal performance lag or UI stutter during filtering, 
  * Memoized filtering logic with `useMemo` to avoid unnecessary recompute of expensive filter operation.
  * Optimized image rendering in table cells using fixed thumbnail dimensions (`48x48`) and native lazy loading (`loading="lazy"`) to prevent layout shifts.
* **UI Component Library**: Built with **Material UI (MUI)** to ensure a modern, accessible, and polished dashboard aesthetic across all devices.

---

## Steps to Run the Application Locally

Follow these steps to run the project locally on your machine:

### 1. Run these bash commands to clone and setup Schedulezy
```bash
git clone https://github.com/ENG19CS0280-Sanchit-Khatar/social-media-post-scheduler..git
cd social-media-post-scheduler
npm install
npm run dev
