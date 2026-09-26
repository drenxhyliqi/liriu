import {
  AlertTriangle,
  Compass,
  Fence,
  Lightbulb,
  MapPin,
  Milestone,
  type LucideIcon,
  Route,
  Signpost,
  SquareParking,
  TrafficCone,
} from "lucide-react";

export const productIcons: Record<string, LucideIcon> = {
  "traffic-signs": AlertTriangle,
  "information-signs": Signpost,
  "street-name-plates": MapPin,
  "poles-brackets": Milestone,
  "signage-portals": Route,
  "led-signage": Lightbulb,
  "traffic-cones": TrafficCone,
  delineators: Compass,
  barriers: Fence,
  "traffic-mirrors": Route,
  "parking-solutions": SquareParking,
};
