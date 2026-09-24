export interface PriceTier {
  minQty: number;
  maxQty: number | null;
  unitPrice: number;
}

export type Category =
  | 'Microcontrollers'
  | 'Passives'
  | 'Connectors'
  | 'Sensors'
  | 'Power Management'
  | 'Optoelectronics'
  | 'Frequency Control';

export interface Product {
  id: string;
  mpn: string;
  name: string;
  category: Category;
  manufacturer: string;
  description: string;
  package: string;
  stock: number;
  leadTime: string;
  moq: number;
  multiples: number;
  rohs: boolean;
  reach: boolean;
  image: string;
  datasheet: boolean;
  featured?: boolean;
  tiers: PriceTier[];
}

export const CATEGORIES: { name: Category | 'All'; icon: string }[] = [
  { name: 'All', icon: 'LayoutGrid' },
  { name: 'Microcontrollers', icon: 'Cpu' },
  { name: 'Passives', icon: 'CircuitBoard' },
  { name: 'Connectors', icon: 'Plug' },
  { name: 'Sensors', icon: 'Radar' },
  { name: 'Power Management', icon: 'Zap' },
  { name: 'Optoelectronics', icon: 'Lightbulb' },
  { name: 'Frequency Control', icon: 'Clock' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'mcu-001',
    mpn: 'VS-M4F407VG',
    name: 'ARM Cortex-M4 Microcontroller, 1MB Flash, 168MHz',
    category: 'Microcontrollers',
    manufacturer: 'VoltCore Semi',
    description: 'High-performance 32-bit MCU with DSP and FPU, 1MB flash, 192KB RAM, 82 I/O, LQFP-100.',
    package: 'LQFP-100',
    stock: 48200,
    leadTime: 'Ships today',
    moq: 10,
    multiples: 10,
    rohs: true,
    reach: true,
    image: '/images/product-mcu.jpg',
    datasheet: true,
    featured: true,
    tiers: [
      { minQty: 1, maxQty: 99, unitPrice: 8.9 },
      { minQty: 100, maxQty: 999, unitPrice: 7.45 },
      { minQty: 1000, maxQty: 9999, unitPrice: 6.2 },
      { minQty: 10000, maxQty: null, unitPrice: 5.35 },
    ],
  },
  {
    id: 'mlc-002',
    mpn: 'GX-C0603-104-50V',
    name: 'MLCC Ceramic Capacitor 100nF 50V X7R',
    category: 'Passives',
    manufacturer: 'GridX Components',
    description: 'Class II multilayer ceramic chip capacitor, 0603 case, ±10% tolerance, tape & reel.',
    package: '0603',
    stock: 1240000,
    leadTime: 'Ships today',
    moq: 500,
    multiples: 500,
    rohs: true,
    reach: true,
    image: '/images/product-capacitor.jpg',
    datasheet: true,
    tiers: [
      { minQty: 1, maxQty: 999, unitPrice: 0.018 },
      { minQty: 1000, maxQty: 9999, unitPrice: 0.012 },
      { minQty: 10000, maxQty: 99999, unitPrice: 0.0085 },
      { minQty: 100000, maxQty: null, unitPrice: 0.0062 },
    ],
  },
  {
    id: 'res-003',
    mpn: 'AX-R0603-10K-1%',
    name: 'Precision Thick Film Chip Resistor 10kΩ 1/10W',
    category: 'Passives',
    manufacturer: 'Axiom Passive',
    description: 'Thick film chip resistor, 1% tolerance, 100ppm/°C, anti-sulfur, 0603 case size.',
    package: '0603',
    stock: 2400000,
    leadTime: 'Ships today',
    moq: 500,
    multiples: 500,
    rohs: true,
    reach: true,
    image: '/images/product-resistor.jpg',
    datasheet: true,
    tiers: [
      { minQty: 1, maxQty: 999, unitPrice: 0.009 },
      { minQty: 1000, maxQty: 9999, unitPrice: 0.0058 },
      { minQty: 10000, maxQty: 99999, unitPrice: 0.0041 },
      { minQty: 100000, maxQty: null, unitPrice: 0.0029 },
    ],
  },
  {
    id: 'res-004',
    mpn: 'AX-RN-4X0603-1K',
    name: 'Concave Network Resistor Array 4×1kΩ Isolated',
    category: 'Passives',
    manufacturer: 'Axiom Passive',
    description: 'Four-element isolated resistor network in convex 1206 package, 5% tolerance.',
    package: '1206',
    stock: 386000,
    leadTime: 'Ships today',
    moq: 250,
    multiples: 250,
    rohs: true,
    reach: true,
    image: '/images/product-resistor.jpg',
    datasheet: false,
    tiers: [
      { minQty: 1, maxQty: 499, unitPrice: 0.041 },
      { minQty: 500, maxQty: 4999, unitPrice: 0.028 },
      { minQty: 5000, maxQty: 49999, unitPrice: 0.0195 },
      { minQty: 50000, maxQty: null, unitPrice: 0.0143 },
    ],
  },
  {
    id: 'con-005',
    mpn: 'TB-508-02P-GRN',
    name: 'Pluggable Terminal Block 5.08mm Pitch, 2-Pole',
    category: 'Connectors',
    manufacturer: 'DockWell Interconnect',
    description: 'Rising-cage clamp terminal block, 300V/15A rating, vertical entry, UL recognized.',
    package: 'Through-Hole',
    stock: 86400,
    leadTime: 'Ships today',
    moq: 50,
    multiples: 50,
    rohs: true,
    reach: true,
    image: '/images/product-connector.jpg',
    datasheet: true,
    tiers: [
      { minQty: 1, maxQty: 99, unitPrice: 1.24 },
      { minQty: 100, maxQty: 999, unitPrice: 0.96 },
      { minQty: 1000, maxQty: 9999, unitPrice: 0.74 },
      { minQty: 10000, maxQty: null, unitPrice: 0.61 },
    ],
  },
  {
    id: 'sen-006',
    mpn: 'SL-ADX355-LGA',
    name: 'MEMS Accelerometer ±8g, 20-Bit SPI, Low Noise',
    category: 'Sensors',
    manufacturer: 'Signalpath Devices',
    description: 'Low-noise 3-axis accelerometer with 20-bit resolution, industrial temp range −40 to +125°C.',
    package: 'LGA-14',
    stock: 12300,
    leadTime: 'Ships today',
    moq: 5,
    multiples: 5,
    rohs: true,
    reach: true,
    image: '/images/product-sensor.jpg',
    datasheet: true,
    featured: true,
    tiers: [
      { minQty: 1, maxQty: 49, unitPrice: 14.85 },
      { minQty: 50, maxQty: 499, unitPrice: 12.4 },
      { minQty: 500, maxQty: 4999, unitPrice: 10.15 },
      { minQty: 5000, maxQty: null, unitPrice: 8.72 },
    ],
  },
  {
    id: 'pwr-007',
    mpn: 'PB-LM5164-65V',
    name: 'Synchronous Buck Regulator 65V 1A, SOIC-8',
    category: 'Power Management',
    manufacturer: 'PolarBridge Semi',
    description: 'Wide-Vin synchronous step-down converter, 1A continuous, 2.5MHz, integrated FETs.',
    package: 'SOIC-8',
    stock: 34800,
    leadTime: 'Ships today',
    moq: 25,
    multiples: 25,
    rohs: true,
    reach: true,
    image: '/images/product-power.jpg',
    datasheet: true,
    tiers: [
      { minQty: 1, maxQty: 99, unitPrice: 3.42 },
      { minQty: 100, maxQty: 999, unitPrice: 2.78 },
      { minQty: 1000, maxQty: 9999, unitPrice: 2.21 },
      { minQty: 10000, maxQty: null, unitPrice: 1.86 },
    ],
  },
  {
    id: 'pwr-008',
    mpn: 'PB-LDO-3V3-500',
    name: 'Low-Dropout Linear Regulator 3.3V 500mA, SOT-23-5',
    category: 'Power Management',
    manufacturer: 'PolarBridge Semi',
    description: 'Ultra-low noise LDO, 310mV dropout at full load, PSRR 75dB, thermal shutdown.',
    package: 'SOT-23-5',
    stock: 152300,
    leadTime: 'Ships today',
    moq: 100,
    multiples: 100,
    rohs: true,
    reach: true,
    image: '/images/product-power.jpg',
    datasheet: false,
    tiers: [
      { minQty: 1, maxQty: 499, unitPrice: 0.62 },
      { minQty: 500, maxQty: 4999, unitPrice: 0.44 },
      { minQty: 5000, maxQty: 49999, unitPrice: 0.31 },
      { minQty: 50000, maxQty: null, unitPrice: 0.238 },
    ],
  },
  {
    id: 'led-009',
    mpn: 'LX-XPG3-WHT-5K',
    name: 'High-Power SMD LED Emitter 5000K, 121lm/W',
    category: 'Optoelectronics',
    manufacturer: 'Lucentron Optics',
    description: 'Ceramic high-power LED, CRI 70, 3-step MacAdam binning, reflow-compatible.',
    package: 'SMD 3.45×3.45mm',
    stock: 220000,
    leadTime: 'Ships today',
    moq: 100,
    multiples: 100,
    rohs: true,
    reach: true,
    image: '/images/product-led.jpg',
    datasheet: true,
    tiers: [
      { minQty: 1, maxQty: 499, unitPrice: 1.18 },
      { minQty: 500, maxQty: 4999, unitPrice: 0.92 },
      { minQty: 5000, maxQty: 49999, unitPrice: 0.74 },
      { minQty: 50000, maxQty: null, unitPrice: 0.58 },
    ],
  },
  {
    id: 'frq-010',
    mpn: 'TF-X2520-24MHZ',
    name: 'SMD Crystal Oscillator 24MHz ±10ppm, 2520',
    category: 'Frequency Control',
    manufacturer: 'TimeFrame Oscillators',
    description: 'AT-cut quartz crystal, 2.5×2.0mm ceramic package, 8pF load, −20 to +70°C.',
    package: 'SMD 2520',
    stock: 96000,
    leadTime: 'Ships today',
    moq: 100,
    multiples: 100,
    rohs: true,
    reach: true,
    image: '/images/product-crystal.jpg',
    datasheet: true,
    tiers: [
      { minQty: 1, maxQty: 999, unitPrice: 0.44 },
      { minQty: 1000, maxQty: 9999, unitPrice: 0.31 },
      { minQty: 10000, maxQty: 99999, unitPrice: 0.225 },
      { minQty: 100000, maxQty: null, unitPrice: 0.168 },
    ],
  },
  {
    id: 'mlc-011',
    mpn: 'GX-TA-47UF-10V',
    name: 'Tantalum Capacitor 47µF 10V, 10% ESR',
    category: 'Passives',
    manufacturer: 'GridX Components',
    description: 'Molded tantalum chip capacitor, stable capacitance, AEC-Q200 qualified.',
    package: 'Case B / 3528',
    stock: 141000,
    leadTime: 'Ships today',
    moq: 100,
    multiples: 100,
    rohs: true,
    reach: true,
    image: '/images/product-capacitor.jpg',
    datasheet: true,
    tiers: [
      { minQty: 1, maxQty: 499, unitPrice: 0.38 },
      { minQty: 500, maxQty: 4999, unitPrice: 0.27 },
      { minQty: 5000, maxQty: 49999, unitPrice: 0.198 },
      { minQty: 50000, maxQty: null, unitPrice: 0.149 },
    ],
  },
  {
    id: 'con-012',
    mpn: 'DW-1667467-2',
    name: 'Mini-Fit Jr. Wire-to-Board Header, 4.2mm, 6-Pin',
    category: 'Connectors',
    manufacturer: 'DockWell Interconnect',
    description: 'Dual-row vertical header, 9A per contact, polarized housing, gold-plated contacts.',
    package: 'Through-Hole',
    stock: 47200,
    leadTime: 'Ships today',
    moq: 50,
    multiples: 50,
    rohs: true,
    reach: true,
    image: '/images/product-connector.jpg',
    datasheet: false,
    tiers: [
      { minQty: 1, maxQty: 99, unitPrice: 0.86 },
      { minQty: 100, maxQty: 999, unitPrice: 0.68 },
      { minQty: 1000, maxQty: 9999, unitPrice: 0.52 },
      { minQty: 10000, maxQty: null, unitPrice: 0.43 },
    ],
  },
];

export const MANUFACTURERS = [...new Set(PRODUCTS.map((p) => p.manufacturer))];
export const PACKAGES = [...new Set(PRODUCTS.map((p) => p.package))];

export function getTier(product: Product, qty: number): PriceTier {
  return (
    product.tiers.find((t) => qty >= t.minQty && (t.maxQty === null || qty <= t.maxQty)) ??
    product.tiers[0]
  );
}

export function fromPrice(product: Product): number {
  return product.tiers[product.tiers.length - 1].unitPrice;
}

export function formatMoney(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function formatUnitPrice(n: number): string {
  if (n < 0.01) return `$${n.toFixed(4)}`;
  if (n < 1) return `$${n.toFixed(3)}`;
  return `$${n.toFixed(2)}`;
}

export function formatQty(n: number): string {
  return n.toLocaleString('en-US');
}
