// ─── Types ────────────────────────────────────────────────────────────────
export type {
  Size,
  ResponsiveSize,
  ColorScheme,
  Variant,
  Placement,
  Side,
  VeloriaBaseProps,
  VeloriaAriaProps,
  AsChildProps,
  Orientation,
  Status,
  Theme,
  VariantProps,
} from "./types";

// ─── Utils ────────────────────────────────────────────────────────────────
export { cn, composeEventHandlers, generateId, isBrowser, isDefined, noop } from "./utils/cn";

// ─── Tailwind plugin ──────────────────────────────────────────────────────
export { veloriaPlugin, veloriaPreset } from "./tailwind";

// ─── Basic ────────────────────────────────────────────────────────────────
export {
  Button, buttonVariants,
  IconButton,
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
  ButtonProps,
  IconButtonProps,
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  Breadcrumb,
  Pagination,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Stepper,
  CommandDialog,
  CommandItem,
  CommandGroup,
  CommandSeparator,
} from "./components/navigation";
export type {
  NavbarProps,
  SidebarProps,
  MenuItemProps,
  BreadcrumbProps,
  PaginationProps,
  StepperProps,
  CommandDialogProps,
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
  PhoneInput,
  TagInput,
  CurrencyInput,
  RatingInput,
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
  PhoneInputProps,
  TagInputProps,
  CurrencyInputProps,
  RatingInputProps,
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
  StatsCard,
  TreeView,
  JsonViewer,
  Heatmap,
  KanbanBoard,
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
  StatsCardProps,
  TreeNode,
  TreeViewProps,
  JsonViewerProps,
  JsonValue,
  HeatmapCell,
  HeatmapProps,
  KanbanCard,
  KanbanColumn,
  KanbanBoardProps,
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
  BannerAlert,
  ConfirmDialog,
  FloatingActionButton,
  RichTooltip,
  Tour,
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
  BannerAlertProps,
  ConfirmDialogProps,
  FABAction,
  FloatingActionButtonProps,
  RichTooltipProps,
  TourStep,
  TourProps,
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
  Lightbox,
  ImageViewer,
} from "./components/overlay";
export type {
  ModalProps,
  DrawerProps,
  CommandDialogProps as OverlayCommandDialogProps,
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
  InfiniteScroll,
  VirtualList,
} from "./components/utility";
export type {
  ThemeSwitcherProps,
  CopyButtonProps,
  KeyboardShortcutProps,
  ResizablePanelProps,
  DragDropAreaProps,
  InfiniteScrollProps,
  VirtualListProps,
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
  useForm,
  usePagination,
  useIntersection,
  useWindowSize,
  useStep,
  useCountdown,
} from "./hooks";
export type {
  UseDisclosureOptions,
  UseClipboardOptions,
  VeloriaTheme,
  UseFormOptions,
  UseFormReturn,
  UsePaginationOptions,
  UsePaginationReturn,
  UseIntersectionOptions,
  WindowSize,
  UseStepOptions,
  UseStepReturn,
  UseCountdownOptions,
  UseCountdownReturn,
} from "./hooks";

export {
  useToast,
  ToastContextProvider,
} from "./hooks/use-toast";
export type { ToastVariant, ToastData, ToastInput } from "./hooks/use-toast";