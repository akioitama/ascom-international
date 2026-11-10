import {
  CarFront,
  Cctv,
  CircleDot,
  Construction,
  Container,
  Cpu,
  Droplets,
  Eye,
  Factory,
  FireExtinguisher,
  Fuel,
  Gauge,
  HardDrive,
  HardHat,
  Headset,
  Layers,
  Megaphone,
  Milestone,
  Monitor,
  Network,
  Octagon,
  Paintbrush,
  PenTool,
  Printer,
  RectangleHorizontal,
  Route,
  Server,
  Shield,
  ShieldCheck,
  Ship,
  Signpost,
  Store,
  TrafficCone,
  Triangle,
  Truck,
  Building,
  Car,
  Cog,
  Landmark,
  Recycle,
  Siren,
  Tractor,
  Zap,
  type LucideIcon,
} from "lucide-react";

const byIndustry: Record<string, LucideIcon> = {
  infrastructure: Construction,
  "government-and-public-sector": Landmark,
  "industrial-manufacturing": Factory,
  "emergency-and-fire-safety": Siren,
  transportation: Route,
  "municipal-services": Recycle,
  "commercial-organisations": Store,
  automotive: Car,
  agriculture: Tractor,
  "energy-and-power": Zap,
  "machinery-and-equipment": Cog,
  "general-industry": Building,
};

const byDivision: Record<string, LucideIcon> = {
  "creative-solutions": Signpost,
  construction: Construction,
  manufacturing: Factory,
  "technology-solutions": Cpu,
  engineering: Cog,
  "road-safety": TrafficCone,
  "vehicle-customisation": Truck,
  "fire-safety": FireExtinguisher,
  "military-and-defence": Shield,
};

export function divisionIcon(slug: string): LucideIcon {
  return byDivision[slug] ?? Milestone;
}

export function industryIcon(slug: string): LucideIcon {
  return byIndustry[slug] ?? Milestone;
}

const byCategory: Record<string, LucideIcon> = {
  "firefighting-vehicles": Truck,
  "mobile-foam-units": Droplets,
  "firefighting-equipment": FireExtinguisher,
  "water-trailers": Container,
  "vehicle-bodies": CarFront,
  "manufactured-equipment": Factory,
  "road-safety-products": TrafficCone,
  signage: Signpost,
  "creative-services": Megaphone,
  technology: Cpu,
};

const byProduct: Record<string, LucideIcon> = {
  "vehicle-painting-and-branding": Paintbrush,
  "cycle-boats": Ship,
  "traffic-cones": TrafficCone,
  "safety-barriers": Construction,
  "reflective-tapes": Layers,
  "road-studs": CircleDot,
  "speed-breakers": Gauge,
  "convex-mirrors": Eye,
  "safety-bollards": Shield,
  "high-visibility-safety-gear": HardHat,
  "regulatory-signs": Octagon,
  "warning-signs": Triangle,
  "directional-signage": Signpost,
  "reflective-sign-boards": RectangleHorizontal,
  "highway-signage": Route,
  "urban-and-industrial-sign-systems": Building,
  "custom-signage": PenTool,
  "petroleum-retail-signage": Fuel,
  "trade-marketing-signage": Megaphone,
  "shop-and-showroom-branding": Store,
  "computers-and-workstations": Monitor,
  servers: Server,
  "storage-systems": HardDrive,
  "cctv-and-recording": Cctv,
  "office-supplies": Printer,
  "it-infrastructure": Network,
  "network-security": ShieldCheck,
  "it-support": Headset,
};

export function productIcon(slug: string, categorySlug?: string | null): LucideIcon {
  return byProduct[slug] ?? (categorySlug ? byCategory[categorySlug] : undefined) ?? Milestone;
}

export function categoryIcon(slug: string): LucideIcon {
  return byCategory[slug] ?? Milestone;
}
