import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { Callout } from "./Callout";
import { Figure } from "./Figure";
import { YouTubeEmbed } from "./YouTubeEmbed";
import { Quiz } from "./Quiz";
import { PaybackCalculator } from "./PaybackCalculator";
import { KeyFigures, KeyFigure } from "./KeyFigures";
import { WorkedExample, Given, Find, Solution } from "./WorkedExample";
import VapourCompressionCycle from "./diagrams/VapourCompressionCycle";
import PdcaCycle from "./diagrams/PdcaCycle";
import AcVsDcWaves from "./diagrams/AcVsDcWaves";
import ThreePhaseWaves from "./diagrams/ThreePhaseWaves";
import BoilerBoundaries from "./diagrams/BoilerBoundaries";
import BoilerSankey from "./BoilerSankey";
import MotorEnergyBalance from "./MotorEnergyBalance";
import OhmsLawTriangle from "./OhmsLawTriangle";
import EnergySignatureExplorer from "./EnergySignatureExplorer";
import AffinityLawsExplorer from "./AffinityLawsExplorer";
import CompositeCurvesExplorer from "./CompositeCurvesExplorer";
import PowerFactorTriangle from "./PowerFactorTriangle";
import ExcessAirExplorer from "./ExcessAirExplorer";
import EconomicThicknessExplorer from "./EconomicThicknessExplorer";
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
import PinchSystemDiagnostics from "../simulators/PinchSystemDiagnostics";
import BrewerySystemDiagnostics from "../simulators/BrewerySystemDiagnostics";
import CreSystemDiagnostics from "../simulators/CreSystemDiagnostics";
import EnergyAuditCapstone from "../simulators/EnergyAuditCapstone";
import BreweryAuditCapstone from "../simulators/BreweryAuditCapstone";
import CreAuditCapstone from "../simulators/CreAuditCapstone";

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
  KeyFigures,
  KeyFigure,
  WorkedExample,
  Given,
  Find,
  Solution,
  VapourCompressionCycle,
  PdcaCycle,
  AcVsDcWaves,
  ThreePhaseWaves,
  BoilerBoundaries,
  BoilerSankey,
  MotorEnergyBalance,
  OhmsLawTriangle,
  EnergySignatureExplorer,
  AffinityLawsExplorer,
  CompositeCurvesExplorer,
  PowerFactorTriangle,
  ExcessAirExplorer,
  EconomicThicknessExplorer,
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
  PinchSystemDiagnostics,
  BrewerySystemDiagnostics,
  CreSystemDiagnostics,
  EnergyAuditCapstone,
  BreweryAuditCapstone,
  CreAuditCapstone,
};
