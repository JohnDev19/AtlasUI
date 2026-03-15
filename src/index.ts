/**
 * atlasui-kit
 *
 * Build anything. Ship faster.
 * 90+ production-ready components — accessible, composable, dark-mode ready.
 *
 * By JohnDev19 — https://github.com/JohnDev19/AtlasUI
 * Docs: https://atlasui.vercel.app/
 * Issues: https://github.com/JohnDev19/AtlasUI/issues
 *
 * @version 0.1.0
 * @license MIT
 */

// ─── Basic ────────────────────────────────────────────────────────────────
export { Button, buttonVariants } from "./components/basic/Button";
export type { ButtonProps } from "./components/basic/Button";
export { IconButton, iconButtonVariants } from "./components/basic/IconButton";
export type { IconButtonProps } from "./components/basic/IconButton";
export {
  Link,
  Badge, badgeVariants,
  Avatar,
  AvatarGroup,
  Divider,
  Tag,
  Chip,
  Tooltip,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
} from "./components/basic";
export type {
  LinkProps,
  BadgeProps,
  AvatarProps,
  AvatarGroupProps,
  DividerProps,
  TagProps,
  ChipProps,
  TooltipProps,
} from "./components/basic";

// ─── Layout ───────────────────────────────────────────────────────────────
export {
  Container,
  Stack,
  Grid,
  Flex,
  Section,
  Spacer,
  AspectRatio,
  Center,
  ScrollArea,
  Masonry,
} from "./components/layout";
export type {
  ContainerProps,
  StackProps,
  GridProps,
  FlexProps,
  SectionProps,
  SpacerProps,
  CenterProps,
  MasonryProps,
} from "./components/layout";

// ─── Navigation ───────────────────────────────────────────────────────────
export {
  Navbar,
  Sidebar,
  Menu,
  MenuItem,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuRadioGroup,
  Breadcrumb,
  Pagination,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Stepper,
} from "./components/navigation";
export type {
  NavbarProps,
  SidebarProps,
  MenuItemProps,
  BreadcrumbItem,
  BreadcrumbProps,
  PaginationProps,
  StepperStep,
  StepperProps,
} from "./components/navigation";

// ─── Forms ────────────────────────────────────────────────────────────────
export {
  Input, inputVariants,
  TextArea,
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  Checkbox,
  RadioGroup,
  Switch,
  Slider,
  RangeSlider,
  DatePicker,
  TimePicker,
} from "./components/forms";
export type {
  InputProps,
  TextAreaProps,
  CheckboxProps,
  RadioGroupProps,
  RadioOption,
  SwitchProps,
  DatePickerProps,
  TimePickerProps,
} from "./components/forms";

// ─── Advanced Forms ───────────────────────────────────────────────────────
export {
  FileUpload,
  OTPInput,
  ColorPicker,
  SearchInput,
  PasswordInput,
  Combobox,
  MultiSelect,
  FormField,
  FormLabel,
  FormError,
} from "./components/advanced-forms";
export type {
  FileUploadProps,
  OTPInputProps,
  ColorPickerProps,
  SearchInputProps,
  PasswordInputProps,
  ComboboxOption,
  ComboboxProps,
  MultiSelectProps,
  FormFieldProps,
  FormLabelProps,
  FormErrorProps,
} from "./components/advanced-forms";

// ─── Data Display ─────────────────────────────────────────────────────────
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  DataTable,
  List,
  ListItem,
  Statistic,
  Timeline,
  Calendar,
  CodeBlock,
  Chart,
} from "./components/data-display";
export type {
  CardProps,
  DataTableColumn,
  DataTableProps,
  ListProps,
  ListItemProps,
  StatisticProps,
  TimelineEvent,
  TimelineProps,
  CalendarProps,
  CodeBlockProps,
  ChartProps,
} from "./components/data-display";

// ─── Feedback ─────────────────────────────────────────────────────────────
export {
  Alert,
  AlertTitle,
  AlertDescription,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  Snackbar,
  Progress,
  CircularProgress,
  Skeleton,
  LoadingSpinner,
  EmptyState,
  StatusIndicator,
  Notification,
} from "./components/feedback";
export type {
  AlertProps,
  SnackbarProps,
  ProgressProps,
  CircularProgressProps,
  SkeletonProps,
  LoadingSpinnerProps,
  EmptyStateProps,
  StatusIndicatorProps,
  NotificationProps,
} from "./components/feedback";

// ─── Overlay ──────────────────────────────────────────────────────────────
export {
  Modal,
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  Drawer,
  Sheet,
  Popover,
  PopoverTrigger,
  PopoverContent,
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel,
  ContextMenuGroup,
  ContextMenuSub,
  ContextMenuRadioGroup,
  CommandDialog,
  CommandItem,
  CommandGroup,
  CommandSeparator,
  Lightbox,
  ImageViewer,
} from "./components/overlay";
export type {
  ModalProps,
  DrawerProps,
  CommandDialogProps,
  LightboxProps,
} from "./components/overlay";

// ─── Media ────────────────────────────────────────────────────────────────
export {
  Image,
  VideoPlayer,
  AudioPlayer,
  Carousel,
  Gallery,
} from "./components/media";
export type {
  ImageProps,
  VideoPlayerProps,
  AudioPlayerProps,
  CarouselProps,
  GalleryImage,
  GalleryProps,
} from "./components/media";

// ─── Utility ──────────────────────────────────────────────────────────────
export {
  ThemeSwitcher,
  CopyButton,
  KeyboardShortcut,
  ResizablePanel,
  DragDropArea,
} from "./components/utility";
export type {
  ThemeSwitcherProps,
  CopyButtonProps,
  KeyboardShortcutProps,
  ResizablePanelProps,
  DragDropAreaProps,
} from "./components/utility";

// ─── Hooks ────────────────────────────────────────────────────────────────
export {
  useDisclosure,
  useMediaQuery,
  useBreakpoint,
  useClipboard,
  useLocalStorage,
  useTheme,
  useDebounce,
  useOnClickOutside,
  useKeydown,
  useMounted,
  useId,
} from "./hooks";
export type { UseDisclosureOptions, UseClipboardOptions, AtlasTheme } from "./hooks";

export {
  useToast,
  ToastContextProvider,
} from "./hooks/use-toast";
export type { ToastVariant, ToastData, ToastInput } from "./hooks/use-toast";

// ─── Types ────────────────────────────────────────────────────────────────
export type {
  Size,
  ResponsiveSize,
  ColorScheme,
  Variant,
  Placement,
  Side,
  AtlasBaseProps,
  AtlasAriaProps,
  AsChildProps,
  Orientation,
  Status,
  Theme,
  VariantProps,
} from "./types";

// ─── Utils ────────────────────────────────────────────────────────────────
export { cn, composeEventHandlers, generateId, isBrowser, isDefined, noop } from "./utils/cn";

// ─── Tailwind plugin ──────────────────────────────────────────────────────
export { atlasPlugin, atlasPreset } from "./tailwind";
