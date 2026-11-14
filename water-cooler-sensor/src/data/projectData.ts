export interface ProblemResolutionItem {
  id: string;
  index: string;
  problemTitle: string;
  problemSummary: string;
  resolutionTitle: string;
  resolutionSummary: string;
  metricBefore: string;
  metricAfter: string;
  sensorModule: string;
  simulationScenario: 'rush' | 'low' | 'clog';
}

export interface CostComponentItem {
  serial: number;
  name: string;
  shortLabel: string;
  cost: number;
  role: string;
  specDetail: string;
}

export interface HardwareHotspot {
  id: 'display' | 'sensors' | 'motherboard' | 'valve';
  label: string;
  cost: string;
  description: string;
  xPercent: number;
  yPercent: number;
}

export const PROBLEMS_AND_RESOLUTIONS: ProblemResolutionItem[] = [
  {
    id: 'scarcity',
    index: '01',
    problemTitle: 'Water scarcity due to heavy usage of water',
    problemSummary:
      'During peak campus breaks, heavy student draw drains cooler reservoirs unexpectedly, leaving students queuing at empty taps without warning.',
    resolutionTitle: 'Sensors help students detect water levels accurately',
    resolutionSummary:
      'Continuous ultrasonic level sensing maps exact remaining liters onto the front display so students see real availability at a glance.',
    metricBefore: 'Unpredictable empty taps during peak breaks',
    metricAfter: 'Real-time 0–100% tank visibility on front display',
    sensorModule: 'Ultrasonic Level Probe + Front OLED Display',
    simulationScenario: 'rush',
  },
  {
    id: 'staff-awareness',
    index: '02',
    problemTitle: "The staff isn't aware about the water availability",
    problemSummary:
      'Facility staff currently rely on manual walking checks across buildings, causing long delays before an empty cooler is refilled.',
    resolutionTitle: 'Helps the staff to check the levels easily',
    resolutionSummary:
      'Threshold alerts trigger automatically when capacity drops below the configured reserve mark, notifying maintenance staff immediately.',
    metricBefore: 'Manual rounds across blocks with delayed refills',
    metricAfter: 'Instant low-reserve threshold alert to facility staff',
    sensorModule: 'Motherboard Controller + Staff Alert Relay',
    simulationScenario: 'low',
  },
  {
    id: 'clogging',
    index: '03',
    problemTitle: 'Water gets clogged',
    problemSummary:
      'Sediment, scale, or valve blockages quietly restrict outlet pressure until flow stops completely or pressure backs up.',
    resolutionTitle: 'Helps detect any clog or blockage',
    resolutionSummary:
      'Inline flow-rate comparison against valve demand catches partial restrictions early and flags a clog fault before full failure.',
    metricBefore: 'Undetected sediment buildup until tap shuts down',
    metricAfter: 'Sub-second flow-drop anomaly detection & fault alert',
    sensorModule: 'Inline Hall-Effect Flow Sensor',
    simulationScenario: 'clog',
  },
];

export const HARDWARE_COMPONENTS: CostComponentItem[] = [
  {
    serial: 1,
    name: 'Display',
    shortLabel: 'Display',
    cost: 6000,
    role: 'Student-facing level readout & fault indicator screen',
    specDetail: 'High-contrast panel mounted on cooler facade showing % level, liters, and clog alerts.',
  },
  {
    serial: 2,
    name: 'Sensors',
    shortLabel: 'Sensors',
    cost: 2000,
    role: 'Water level & inline clog/flow detection probes',
    specDetail: 'Waterproof ultrasonic level transducer paired with hall-effect outlet flow meter.',
  },
  {
    serial: 3,
    name: 'Motherboard',
    shortLabel: 'Motherboard',
    cost: 5000,
    role: 'Core processing board & staff alert controller',
    specDetail: 'Processes real-time telemetry, threshold triggers, and display driver output.',
  },
  {
    serial: 4,
    name: 'Testing & Execution',
    shortLabel: 'Testing',
    cost: 3000,
    role: 'Calibration, waterproofing, installation & field validation',
    specDetail: 'Tank volume calibration, pipe sealing, clog threshold tuning, and campus deployment.',
  },
];

export const TOTAL_COMMERCIAL_COST = 16000;
export const COMPONENT_COST_MIN = 2000;
export const COMPONENT_COST_MAX = 6000;

export const HARDWARE_HOTSPOTS: HardwareHotspot[] = [
  {
    id: 'display',
    label: 'Front Display Unit',
    cost: '₹6,000',
    description: 'Shows real-time tank percentage and clear availability status to students walking up.',
    xPercent: 50,
    yPercent: 25,
  },
  {
    id: 'sensors',
    label: 'Level Sensor Array',
    cost: '₹2,000',
    description: 'Tracks exact water height inside the insulated reservoir with millimeter resolution.',
    xPercent: 35,
    yPercent: 46,
  },
  {
    id: 'motherboard',
    label: 'Control Motherboard',
    cost: '₹5,000',
    description: 'Evaluates threshold triggers, drives the display, and sends staff refill alerts.',
    xPercent: 68,
    yPercent: 58,
  },
  {
    id: 'valve',
    label: 'Flow & Clog Sensor',
    cost: 'Included in Sensors',
    description: 'Monitors outlet manifold velocity to catch sediment clogs or blockages immediately.',
    xPercent: 46,
    yPercent: 78,
  },
];

export const ORIGINAL_SLIDES = [
  {
    id: 'slide-1',
    title: 'Problem & Resolution Matrix',
    caption: 'Original Slide 01 — Core campus water problems paired with sensor-driven resolutions.',
    src: '/assets/aistudio/image_abe02af2.png',
    alt: 'Original presentation slide showing Water Cooler Sensor problem and resolution comparison table',
  },
  {
    id: 'slide-2',
    title: 'Commercial Cost Breakdown',
    caption: 'Original Slide 02 — Commercial component pricing (₹2,000–₹6,000 range, ₹16,000 total).',
    src: '/assets/aistudio/image_b130767e.png',
    alt: 'Original presentation slide showing commercial cost table and area chart totaling 16,000 rupees',
  },
];
