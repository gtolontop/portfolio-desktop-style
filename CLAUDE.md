# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start Next.js development server
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint on the codebase

## Architecture Overview

This is a Next.js 14 portfolio application with a Windows-style desktop interface. The app uses TypeScript and is built with the following core technologies:

### Tech Stack
- **Framework**: Next.js 14.2.5 with App Router
- **UI**: React 18.3.1 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand 5.0.8
- **Window Management**: react-draggable 4.5.0
- **Icons**: lucide-react

### Project Structure

The application follows a modular architecture with clear separation of concerns:

- **`/src/app`** - Next.js App Router pages and layouts
- **`/src/apps`** - Application components that can be opened as windows
  - `TestFrame.tsx` - Example application component
  - `/templates/BaseApp.tsx` - Base template for creating new apps
- **`/src/components`** - Core UI components
  - `Desktop.tsx` - Main desktop container
  - `Window.tsx` - Draggable, resizable window component
  - `WindowManager.tsx` - Manages all open windows
  - `Taskbar.tsx` - Bottom taskbar with app launcher
  - `DesktopIcon.tsx` & `DesktopIcons.tsx` - Desktop icon system
- **`/src/store`** - Zustand state management
  - `appStore.ts` - Central store managing apps, windows, and desktop icons
- **`/src/config`** - Configuration files
  - `apps.registry.ts` - Registry of available applications
- **`/src/types`** - TypeScript type definitions
  - `app.types.ts` - Core application types

### Key Concepts

1. **App Registry Pattern**: Applications are registered in `apps.registry.ts` with configuration including icon, default size, and component reference.

2. **Window Management**: The `appStore` manages window state including position, size, z-index layering, and minimize/maximize states. Windows are uniquely identified and support drag, resize, and standard window controls.

3. **Component Architecture**: Applications are React components that render inside Window components. The WindowManager orchestrates rendering based on the store state.

4. **Responsive Design**: Window sizing adapts to screen dimensions with breakpoints for different display sizes (≤1366px, ≤1920px, >1920px).

5. **Type Safety**: Comprehensive TypeScript types in `app.types.ts` ensure type safety across the application.

### Adding New Applications

To add a new application:
1. Create a component in `/src/apps`
2. Add the app configuration to `defaultApps` in `apps.registry.ts`
3. The app will automatically appear in the desktop and taskbar

### Path Aliases
- `@/*` maps to `./src/*` for cleaner imports