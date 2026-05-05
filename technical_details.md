# Technical Details: Chart Viz Pro

This document outlines the architectural decisions and technical implementations used in the Chart Viz Pro Dashboard.

## 1. Visualization Libraries

### Apache ECharts
Used for standard dashboard components and high-performance rendering.
- **Why?**: ECharts uses a Canvas-based engine which is more efficient for high-density visualizations like **Heatmaps** and **Candlestick** charts.
- **Customization**: Leveraged the `option` object for deep theme integration, customized tooltips with `extraCssText`, and synchronized zooming with `dataZoom`.

### D3.js
Used for bespoke, mathematically driven visualizations.
- **Why?**: D3 allows for granular control over every SVG element. This was essential for:
  - **Treemaps**: Implementing hierarchical layouts.
  - **Regression Analysis**: Calculating slopes and intercepts in the Scatter plot.
  - **Variant Waves**: Using `d3.area` and `d3.curveBasis` for smooth evolutionary transitions.
- **Integration**: Managed via `useRef` and `useEffect` to bridge the D3 imperative style with React's declarative lifecycle.

## 1.5 State Synchronization & Filtering
Implemented a **shared state pattern** to enable cross-component interactivity:
- **Event Listeners**: ECharts `click` and `legendselectchanged` events are captured to update a global `selectedPathogen` state.
- **Reactive Dims**: Component props reactively adjust visual properties (opacity, scale) of non-selected series, providing an instant filtering effect across the entire dashboard.

## 2. Frontend Architecture

### Next.js 15 & TypeScript
- **App Router**: Utilized for clean organization of pages and layouts.
- **Type Safety**: Defined interfaces for all scientific data structures to ensure robust handling of pathogen metrics and geographic metadata.
- **Hydration Control**: Implemented patterns to prevent mismatches during the rendering of client-side visualization components.

### Custom Design System (Vanilla CSS)
- **Glassmorphism**: Achieved using `backdrop-filter: blur()`, semi-transparent backgrounds, and subtle borders.
- **CSS Grid**: A 12-column responsive layout system defined in `globals.css` with custom utility classes (e.g., `.glass-card`, `.dashboard-grid`).
- **Animations**: Used CSS transitions and keyframes for smooth tab switching and hover interactions.

## 3. Data Management

### Mock Data Generation
- A custom Node.js script was developed to generate multi-dimensional scientific data that mimics:
  - **NWSS Patterns**: Wastewater viral loads with seasonal periodicity.
  - **Genomic Waves**: Variant prevalence using Gaussian-style distributions.
  - **Environmental Correlation**: Lagged relationships between viral load and clinical hospitalizations.

## 4. Key Problem Solving
- **Naming Collisions**: Resolved a critical conflict between Lucide-react's `Map` icon and the global `Map` constructor by renaming imports to `MapIcon`.
- **Tooltip Portability**: Fixed issues where tooltips were clipped by card boundaries using ECharts' `confine: true` and D3's absolute positioning relative to the document page.
- **Responsive SVGs**: Implemented dynamic width detection in D3 components to ensure charts resize correctly across different screen resolutions.

## 5. Development Workflow
- **Linting**: Strict ESLint rules applied to maintain code quality.
- **Build**: Verified production bundle generation to ensure all scientific libraries are correctly tree-shaken and bundled.
