import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { Callout } from "./Callout";
import { Figure } from "./Figure";
import { YouTubeEmbed } from "./YouTubeEmbed";
import { Quiz } from "./Quiz";
import { PaybackCalculator } from "./PaybackCalculator";
import SteamBoilerOptimizer from "../simulators/SteamBoilerOptimizer";
import SteamSystemDiagnostics from "../simulators/SteamSystemDiagnostics";
import HvacSystemDiagnostics from "../simulators/HvacSystemDiagnostics";
import MotorSystemDiagnostics from "../simulators/MotorSystemDiagnostics";
import AirSystemDiagnostics from "../simulators/AirSystemDiagnostics";
import ChpSystemDiagnostics from "../simulators/ChpSystemDiagnostics";
import LightingSystemDiagnostics from "../simulators/LightingSystemDiagnostics";
import EnvelopeSystemDiagnostics from "../simulators/EnvelopeSystemDiagnostics";
import RefrigSystemDiagnostics from "../simulators/RefrigSystemDiagnostics";
import WhrSystemDiagnostics from "../simulators/WhrSystemDiagnostics";
import InsulationSystemDiagnostics from "../simulators/InsulationSystemDiagnostics";
import TesSystemDiagnostics from "../simulators/TesSystemDiagnostics";
import RenewSystemDiagnostics from "../simulators/RenewSystemDiagnostics";
import CtrlSystemDiagnostics from "../simulators/CtrlSystemDiagnostics";
import CommxSystemDiagnostics from "../simulators/CommxSystemDiagnostics";
import MaintSystemDiagnostics from "../simulators/MaintSystemDiagnostics";
import MvSystemDiagnostics from "../simulators/MvSystemDiagnostics";
import EconSystemDiagnostics from "../simulators/EconSystemDiagnostics";
import EnergyAuditCapstone from "../simulators/EnergyAuditCapstone";

/** Internal links use next/link for client-side nav; external open in a new tab. */
function MdxLink({
  href = "",
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isInternal = href.startsWith("/") || href.startsWith("#");
  if (isInternal) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

/** Components available inside every lesson's MDX. */
export const mdxComponents = {
  a: MdxLink,
  Callout,
  Figure,
  YouTubeEmbed,
  Quiz,
  PaybackCalculator,
  SteamBoilerOptimizer,
  SteamSystemDiagnostics,
  HvacSystemDiagnostics,
  MotorSystemDiagnostics,
  AirSystemDiagnostics,
  ChpSystemDiagnostics,
  LightingSystemDiagnostics,
  EnvelopeSystemDiagnostics,
  RefrigSystemDiagnostics,
  WhrSystemDiagnostics,
  InsulationSystemDiagnostics,
  TesSystemDiagnostics,
  RenewSystemDiagnostics,
  CtrlSystemDiagnostics,
  CommxSystemDiagnostics,
  MaintSystemDiagnostics,
  MvSystemDiagnostics,
  EconSystemDiagnostics,
  EnergyAuditCapstone,
};
