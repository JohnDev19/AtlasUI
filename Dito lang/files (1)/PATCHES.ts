// ============================================================
// PATCH 1 — src/components/feedback/index.tsx
// ============================================================
// In feedback/index.tsx, find the final export block (at bottom of file):
//
// OLD (replace this exact text):
// ─────────────────────────────────────────────────────────────
export {

  Alert, AlertTitle, AlertDescription,
  ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, ToastAction,
  Snackbar,
  Progress,
  CircularProgress,
  Skeleton,
  LoadingSpinner,
  EmptyState,
  StatusIndicator,
  Notification,
  BannerAlert, ConfirmDialog, FloatingActionButton, RichTooltip, Tour
};
// ─────────────────────────────────────────────────────────────
//
// NEW (replace with this):
// ─────────────────────────────────────────────────────────────
export { StepProgress } from "./StepProgress";
export type { StepProgressProps } from "./StepProgress";

export {
  Alert, AlertTitle, AlertDescription,
  ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, ToastAction,
  Snackbar,
  Progress,
  CircularProgress,
  Skeleton,
  LoadingSpinner,
  EmptyState,
  StatusIndicator,
  Notification,
  BannerAlert, ConfirmDialog, FloatingActionButton, RichTooltip, Tour,
  StepProgress,
};
// ─────────────────────────────────────────────────────────────


// ============================================================
// PATCH 2 — src/components/utility/index.tsx
// ============================================================
// In utility/index.tsx, find the final export block (at bottom of file):
//
// OLD (replace this exact text):
// ─────────────────────────────────────────────────────────────
export {
 ThemeSwitcher, CopyButton, KeyboardShortcut, ResizablePanel, DragDropArea ,
  InfiniteScroll, VirtualList
};
// ─────────────────────────────────────────────────────────────
//
// NEW (replace with this):
// ─────────────────────────────────────────────────────────────
export { TypewriterText } from "./TypewriterText";
export type { TypewriterTextProps } from "./TypewriterText";

export {
  ThemeSwitcher, CopyButton, KeyboardShortcut, ResizablePanel, DragDropArea,
  InfiniteScroll, VirtualList,
  TypewriterText,
};
// ─────────────────────────────────────────────────────────────
