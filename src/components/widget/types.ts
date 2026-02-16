export type DisplayType = 'inline' | 'popup' | 'slide_out' | 'floating_button';
export type LeadCaptureMode = 'email_only' | 'email_phone' | 'disabled';
export type WidgetStatus = 'draft' | 'live';
export type InstallStatus = 'installed' | 'not_installed';
export type LeadCaptureTiming = 'before_measurement' | 'after_measurement' | 'before_quote_reveal' | 'disabled';
export type QuoteDisplayMode = 'exact' | 'starting_at';
export type ButtonStyleOption = 'solid' | 'outline';
export type InstallPlatform = 'wordpress' | 'wix' | 'webflow' | 'custom';
export type WidgetStep = 1 | 2 | 3 | 4 | 5;

export interface EntryConfig {
  addressPlaceholder: string;
  buttonText: string;
  supportingMicrocopy: string;
}

export interface LeadCaptureConfig {
  timing: LeadCaptureTiming;
  emailEnabled: boolean;
  phoneEnabled: boolean;
  nameEnabled: boolean;
}

export interface ConversionConfig {
  depositRequired: boolean;
  quoteDisplay: QuoteDisplayMode;
  quoteExpirationDays: number;
}

export interface StylingConfig {
  primaryColor: string;
  buttonStyle: ButtonStyleOption;
  borderRadius: number;
  customCss: string;
}

export interface WidgetVariant {
  id: string;
  name: string;
  status: WidgetStatus;
  linkedServiceId: string | null;
  linkedServiceName: string | null;
  displayType: DisplayType;
  installStatus: InstallStatus;
  entryConfig: EntryConfig;
  leadCaptureConfig: LeadCaptureConfig;
  conversionConfig: ConversionConfig;
  stylingConfig: StylingConfig;
  installPlatform: InstallPlatform | null;
}

export const DEFAULT_ENTRY_CONFIG: EntryConfig = {
  addressPlaceholder: 'Enter your property address',
  buttonText: 'Get Your Quote',
  supportingMicrocopy: 'Instant pricing based on your property size',
};

export const DEFAULT_LEAD_CAPTURE_CONFIG: LeadCaptureConfig = {
  timing: 'after_measurement',
  emailEnabled: true,
  phoneEnabled: false,
  nameEnabled: false,
};

export const DEFAULT_CONVERSION_CONFIG: ConversionConfig = {
  depositRequired: false,
  quoteDisplay: 'exact',
  quoteExpirationDays: 7,
};

export const DEFAULT_STYLING_CONFIG: StylingConfig = {
  primaryColor: '#16a34a',
  buttonStyle: 'solid',
  borderRadius: 8,
  customCss: '',
};

export const DISPLAY_TYPE_LABELS: Record<DisplayType, string> = {
  inline: 'Inline Embed',
  popup: 'Popup Modal',
  slide_out: 'Slide-Out Panel',
  floating_button: 'Floating Button',
};

export const LEAD_TIMING_LABELS: Record<LeadCaptureTiming, string> = {
  before_measurement: 'Before measurement',
  after_measurement: 'After measurement, before quote',
  before_quote_reveal: 'Before quote reveal',
  disabled: 'Disable lead capture',
};

export const LEAD_CAPTURE_MODE_LABELS: Record<LeadCaptureMode, string> = {
  email_only: 'Email Only',
  email_phone: 'Email + Phone',
  disabled: 'Disabled',
};

export function getLeadCaptureMode(config: LeadCaptureConfig): LeadCaptureMode {
  if (config.timing === 'disabled') return 'disabled';
  if (config.phoneEnabled) return 'email_phone';
  return 'email_only';
}

export function createDefaultVariant(id: string, name: string): WidgetVariant {
  return {
    id,
    name,
    status: 'draft',
    linkedServiceId: null,
    linkedServiceName: null,
    displayType: 'inline',
    installStatus: 'not_installed',
    entryConfig: { ...DEFAULT_ENTRY_CONFIG },
    leadCaptureConfig: { ...DEFAULT_LEAD_CAPTURE_CONFIG },
    conversionConfig: { ...DEFAULT_CONVERSION_CONFIG },
    stylingConfig: { ...DEFAULT_STYLING_CONFIG },
    installPlatform: null,
  };
}
