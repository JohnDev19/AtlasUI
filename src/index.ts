/**
 * veloria-ui v0.1.3
 *
 * Build anything. Ship faster.
 * Accessible, composable React components with Tailwind CSS and dark mode.
 *
 * By JohnDev19 — https://github.com/JohnDev19/Veloria-UI
 * Docs: https://veloria-ui.vercel.app/
 * @license MIT
 */

// ─── Basic ────────────────────────────────────────────────────────────────
export { Button, buttonVariants }      from "./components/basic/Button";
export type { ButtonProps }            from "./components/basic/Button";
export { Badge, badgeVariants }        from "./components/basic/Badge";
export type { BadgeProps }             from "./components/basic/Badge";
export {
  IconButton, iconButtonVariants,
  Link, Avatar, AvatarGroup, Divider, Tag, Chip,
  Tooltip, TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent,
} from "./components/basic";
export type {
  IconButtonProps, LinkProps, AvatarProps, AvatarGroupProps,
  DividerProps, TagProps, ChipProps, TooltipProps,
} from "./components/basic";

// ─── Layout ───────────────────────────────────────────────────────────────
export {
  Container, Stack, Grid, Flex, Section, Spacer, AspectRatio, Center, ScrollArea, Masonry,
} from "./components/layout";
export type {
  ContainerProps, StackProps, GridProps, FlexProps, SectionProps,
  SpacerProps, CenterProps, MasonryProps,
} from "./components/layout";

// ─── Navigation ───────────────────────────────────────────────────────────
export {
  Navbar, Sidebar, Menu, MenuItem,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuGroup,
  DropdownMenuPortal, DropdownMenuSub, DropdownMenuRadioGroup,
  Breadcrumb, Pagination, Tabs, TabsList, TabsTrigger, TabsContent, Stepper,
} from "./components/navigation";
export type {
  NavbarProps, SidebarProps, MenuItemProps,
  BreadcrumbItem, BreadcrumbProps, PaginationProps,
  StepperStep, StepperProps,
} from "./components/navigation";

// ─── Forms ────────────────────────────────────────────────────────────────
export { Input, inputVariants } from "./components/forms/Input";
export type { InputProps }      from "./components/forms/Input";
export {
  TextArea, Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
  SelectGroup, SelectLabel, SelectSeparator,
  Checkbox, RadioGroup, RadioGroupItem,
  Switch, Slider, RangeSlider, DatePicker, TimePicker,
} from "./components/forms";
export type { TextAreaProps, CheckboxProps, SwitchProps, SliderProps, DatePickerProps } from "./components/forms";

// ─── Advanced Forms ───────────────────────────────────────────────────────
export {
  FileUpload, OTPInput, ColorPicker, SearchInput, PasswordInput,
  Combobox, MultiSelect, FormField, FormLabel, FormError,
  PhoneInput, TagInput, CurrencyInput, RatingInput,
} from "./components/advanced-forms";
export type {
  FileUploadProps, OTPInputProps, ColorPickerProps, SearchInputProps,
  PasswordInputProps, ComboboxProps, MultiSelectProps,
  PhoneInputProps, TagInputProps, CurrencyInputProps, RatingInputProps,
} from "./components/advanced-forms";

// ─── Data Display ─────────────────────────────────────────────────────────
export {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants,
} from "./components/data-display/Card";
export type { CardProps } from "./components/data-display/Card";
export {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption,
  DataTable, List, ListItem, Statistic, Timeline, Calendar, CodeBlock, Chart,
  StatsCard, TreeView, JsonViewer, Heatmap, KanbanBoard,
} from "./components/data-display";
export type {
  StatsCardProps, TreeNode, TreeViewProps,
  JsonViewerProps, JsonValue, HeatmapCell, HeatmapProps,
  KanbanCard, KanbanColumn, KanbanBoardProps,
} from "./components/data-display";

// ─── Feedback ─────────────────────────────────────────────────────────────
export {
  Alert, Toast, ToastProvider, ToastViewport, ToastTitle, ToastDescription,
  ToastClose, ToastAction, Snackbar, Progress, CircularProgress, Skeleton,
  LoadingSpinner, EmptyState, StatusIndicator, Notification,
  BannerAlert, ConfirmDialog, FloatingActionButton, RichTooltip, Tour,
} from "./components/feedback";
export type {
  AlertProps, SnackbarProps, ProgressProps, CircularProgressProps,
  SkeletonProps, LoadingSpinnerProps, EmptyStateProps, StatusIndicatorProps,
  NotificationProps, BannerAlertProps, ConfirmDialogProps,
  FABAction, FloatingActionButtonProps, RichTooltipProps, TourStep, TourProps,
} from "./components/feedback";

// ─── Overlay ──────────────────────────────────────────────────────────────
export {
  Dialog, DialogTrigger, DialogPortal, DialogOverlay, DialogClose,
  DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription,
  Modal, Drawer, Sheet,
  Popover, PopoverTrigger, PopoverContent,
  HoverCard, HoverCardTrigger, HoverCardContent,
  ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem,
  ContextMenuSeparator, ContextMenuLabel, ContextMenuGroup,
  ContextMenuSub, ContextMenuRadioGroup,
  Lightbox, ImageViewer,
} from "./components/overlay";
export type { ModalProps, DrawerProps, LightboxProps, ImageViewerProps } from "./components/overlay";

// ─── Media ────────────────────────────────────────────────────────────────
export { Image, VideoPlayer, AudioPlayer, Carousel, Gallery } from "./components/media";
export type {
  ImageProps, VideoPlayerProps, AudioPlayerProps, CarouselProps, GalleryItem, GalleryProps,
} from "./components/media";

// ─── Utility ──────────────────────────────────────────────────────────────
export {
  ThemeSwitcher, CopyButton, KeyboardShortcut, ResizablePanel,
  DragDropArea, InfiniteScroll, VirtualList,
} from "./components/utility";
export type {
  ThemeSwitcherProps, CopyButtonProps, KeyboardShortcutProps,
  ResizablePanelProps, DragDropAreaProps, InfiniteScrollProps, VirtualListProps,
} from "./components/utility";

// ─── v0.1.3 Unique Components ─────────────────────────────────────────────
export {
  Marquee, GlowCard, SpotlightCard, BentoGrid, BentoItem,
  GradientText, TypewriterText, CountUp, ReadingProgress,
  AnimatedBorder, RippleButton, PricingCard, StickyNote,
  Ribbon, PulseRing, CommandBar, ScrollReveal,
} from "./components/utility/unique";
export type {
  MarqueeProps, GlowCardProps, SpotlightCardProps, BentoGridProps, BentoItemProps,
  GradientTextProps, TypewriterTextProps, CountUpProps, ReadingProgressProps,
  AnimatedBorderProps, RippleButtonProps, PricingCardProps, PricingFeature,
  StickyNoteProps, StickyNoteColor, RibbonProps, PulseRingProps,
  CommandBarProps, CommandBarAction, ScrollRevealProps,
} from "./components/utility/unique";

// ─── Classic Variant Tokens ───────────────────────────────────────────────
export {
  classicButtonBase, classicCardBase, classicBadgeBase,
  classicInputBase, classicTabBase, classicCSSVars,
} from "./variants/classic";

// ─── Tailwind Plugin & Preset ─────────────────────────────────────────────
export { veloriaPlugin, veloriaPreset } from "./tailwind";

// ─── Provider ─────────────────────────────────────────────────────────────
export { VeloriaProvider, useThemeContext } from "./provider";
export type { VeloriaProviderProps } from "./provider";

// ─── Hooks ────────────────────────────────────────────────────────────────
export { useDisclosure }     from "./hooks/use-disclosure";
export { useMediaQuery }     from "./hooks/use-media-query";
export { useBreakpoint }     from "./hooks/use-breakpoint";
export { useClipboard }      from "./hooks/use-clipboard";
export { useLocalStorage }   from "./hooks/use-local-storage";
export { useTheme }          from "./hooks/use-theme";
export { useDebounce }       from "./hooks/use-debounce";
export { useOnClickOutside } from "./hooks/use-on-click-outside";
export { useKeydown }        from "./hooks/use-keydown";
export { useMounted }        from "./hooks/use-mounted";
export { useToast }          from "./hooks/use-toast";
export type { ToastMessage } from "./hooks/use-toast";
export { useForm }           from "./hooks/use-form";
export type { UseFormOptions, UseFormReturn } from "./hooks/use-form";
export { usePagination }     from "./hooks/use-pagination";
export type { UsePaginationOptions, UsePaginationReturn } from "./hooks/use-pagination";
export { useIntersection }   from "./hooks/use-intersection";
export type { UseIntersectionOptions } from "./hooks/use-intersection";
export { useWindowSize }     from "./hooks/use-window-size";
export type { WindowSize }   from "./hooks/use-window-size";
export { useStep }           from "./hooks/use-step";
export type { UseStepOptions, UseStepReturn } from "./hooks/use-step";
export { useCountdown }      from "./hooks/use-countdown";
export type { UseCountdownOptions, UseCountdownReturn } from "./hooks/use-countdown";
export { useScrollLock }     from "./hooks/use-scroll-lock";

// ─── Types ────────────────────────────────────────────────────────────────
export type {
  Size, ResponsiveSize, ColorScheme, Variant, Placement, Side,
  VeloriaBaseProps, VeloriaAriaProps, AsChildProps,
  Orientation, Status, Theme, VariantProps,
} from "./types";

// ─── Utils ────────────────────────────────────────────────────────────────
export { cn, composeEventHandlers, generateId, isBrowser, isDefined, noop } from "./utils/cn";
