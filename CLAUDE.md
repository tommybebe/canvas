# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Leanvas is a lean canvas creation tool inspired by leanstack.com, built as a personal project for brainstorming and sharing early-stage ideas. It allows users to create and collaborate on lean canvas documents with real-time updates and social features.

**Tech Stack:**
- Frontend: AngularJS 1.2, AngularFire, Firebase
- Backend: Express/Node.js (minimal server for serving static files)
- Build System: Gulp
- Styling: SCSS with autoprefixer
- Testing: Karma + Jasmine (unit), Protractor (e2e)
- Package Management: Bower (frontend), npm (backend/build tools)

## Development Commands

### Setup
```bash
npm install           # Install build dependencies
bower install         # Install frontend dependencies
```

### Development
```bash
gulp serve            # Start dev server with live reload (http://localhost:9000)
                      # BrowserSync proxies Express server on port 8000
```

### Building
```bash
gulp                  # Build production files to dist/
gulp clean            # Clean build artifacts (.tmp, dist, .sass-cache)
```

### Testing & Linting
```bash
npm test              # Runs gulp test (unit tests)
gulp unit             # Run unit tests with Karma
gulp e2e              # Run end-to-end tests with Protractor
gulp jshint           # Lint JavaScript files
```

### Production
```bash
gulp serve:dist       # Build and serve production bundle
```

## Architecture & Key Patterns

### Application Structure

**Frontend (`app/`):**
- `scripts/app.js` - Main AngularJS module (`canvasApp`) with routing configuration
- `scripts/config.js` - Firebase URI, A/B testing experiments configuration
- `scripts/controllers/` - Route controllers (main, dashboard, canvas, navbar)
- `scripts/services/db.js` - Firebase database service wrapper
- `scripts/factories/auth.js` - Authentication & user management via FirebaseSimpleLogin
- `scripts/directives/` - Custom directives (sortable, rating, navbar, footer, notFound)
- `scripts/filters/` - Custom filters (timeago)
- `partials/` - HTML templates (cached via gulp-angular-templatecache)
- `styles/` - SCSS files compiled to CSS

**Backend (`server/`):**
- `server.js` - Express application entry point
- `config/` - Environment-based configuration (development, production, test)
- `routes.js` - Route definitions
- `controllers/` - Server-side controllers

**Build (`tasks/`):**
- `build.js` - Production build tasks (minification, optimization, copying)
- `serve.js` - Development server with BrowserSync
- `test.js` - Unit and e2e test runners

### Firebase Integration

The app uses Firebase for:
- **Real-time database**: Canvas documents, user data, messages
- **Authentication**: Facebook login via FirebaseSimpleLogin
- **URI**: Configured in `app/scripts/config.js` as `FIREBASE_URI` constant

**Important patterns:**
- Email addresses are escaped for Firebase keys: dots (`.`) are replaced with commas (`,`) - see `escapeEmail()` in `auth.js`
- User data structure: `users/{escapedEmail}/canvas/{canvasId}`
- Message system: `message/{escapedEmail}/{messageId}` for notifications (invites, updates, deletions)

### A/B Testing System

The app includes an A/B testing framework using Google Content Experiments:
- Experiment variations defined in `app/scripts/config.js` as `EXPERIMENTS` constant
- File naming convention: `example.html`, `example.0.html`, `example.1.html`, etc.
- `$experiment` factory selects variation and updates `$templateCache` on app initialization
- Currently testing variations of `canvas-item.html`

### Template Caching

HTML partials are compiled into `app/scripts/templates.js`:
- Gulp task `templateCache` generates the cache from `app/partials/**/*.html`
- Templates cached in the `config` module
- Root set to `partials` for consistent paths
- Automatically rebuilds on partial changes during development

### Routing

AngularJS routing with HTML5 mode enabled:
- `/` - Main landing page (MainCtrl)
- `/dashboard` - User's canvas list (DashboardCtrl)
- `/canvas/:id` or `/canvas/:id/:title` - Canvas editor (CanvasCtrl)
- Google Analytics pageview tracking on route changes
- Custom `$location.path()` override for conditional route reloading

### Authentication Flow

1. FirebaseSimpleLogin initializes with Facebook provider
2. On successful login:
   - User data synced to `users/{escapedEmail}` in Firebase
   - User object bound to `$rootScope.user` via AngularFire
   - Profile picture fetched from Facebook Graph API
   - `auth:login` event broadcast
3. Message listener established for real-time notifications
4. Canvas invitations, updates, and deletions automatically sync to user's canvas list

### Message System

Users can send/receive messages for collaboration:
- **Types**: `invited`, `updated`, `deleted`, `has removed your authority`
- Messages trigger automatic updates to recipient's canvas list
- `auth.message.send(type, target, to)` - Send message
- `auth.message.del(id)` - Remove message
- Messages displayed in UI and can be dismissed

## Code Style & Linting

JSHint configuration (`.jshintrc`):
- Strict mode required
- Single quotes for strings
- 2-space indentation
- Camelcase naming
- Global objects: `angular`, `Firebase`, `FirebaseSimpleLogin`, `_` (lodash), `ga`, `cxApi`

## Important Notes

- This is a legacy project using AngularJS 1.2 and outdated Firebase SDK
- Firebase Simple Login is deprecated; modern projects should use Firebase Auth SDK
- Ruby Sass is used for compilation (gulp-ruby-sass) - requires Ruby installed
- BrowserSync proxies the Express server for live reloading during development
- Production builds minify JS (with some comments preserved) and CSS
- Image optimization is cached to speed up rebuilds
