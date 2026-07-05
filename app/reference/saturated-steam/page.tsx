import type { Metadata } from "next";
import { SAT_STEAM, PIPE_LOSS } from "@/lib/steamTables";
import { RefShell, RefSection, RefTable, RefLinks } from "@/components/reference/RefShell";

export const metadata: Metadata = {
  title: "Saturated Steam Table",
  description:
    "Saturation temperature, sensible heat, latent heat and total heat of saturated steam by gauge pressure, with bare and insulated pipe heat losses and flash steam fractions.",
  alternates: { canonical: "/reference/saturated-steam" },
};

/** Flash fraction from p1 to atmospheric, % — computed from the same table. */
function flashToAtm(hf: number): string {
  const atm = SAT_STEAM[0];
  return (((hf - atm.hf) / atm.hfg) * 100).toFixed(1);
}

export default function SaturatedSteamPage() {
  return (
    <RefShell
      title="Saturated steam table"
      lead="Saturated steam's temperature is fixed by its pressure alone, and its heat splits into the sensible part (held in the condensate) and the much larger latent part (released on condensing). These are the working figures for steam-system arithmetic."
      reviewed="2026-07-05"
    >
      <RefSection
        heading="Properties by gauge pressure"
        note="hf = sensible heat in the condensate; hfg = latent heat released on condensing; hg = total heat of the steam. All kJ/kg. The right-hand column is the fraction of condensate that flashes to steam when discharged to atmosphere."
      >
        <RefTable
          headers={[
            "Pressure (bar g)",
            "Saturation temp (°C)",
            "hf (kJ/kg)",
            "hfg (kJ/kg)",
            "hg (kJ/kg)",
            "Flash to atm (%)",
          ]}
          rows={SAT_STEAM.map((r) => [
            r.pBarG,
            r.tSat.toFixed(1),
            r.hf,
            r.hfg,
            r.hg,
            r.pBarG === 0 ? "0.0" : flashToAtm(r.hf),
          ])}
        />
      </RefSection>

      <RefSection
        heading="Heat loss from steam pipework"
        note="Horizontal steel pipe at ~170 °C (7 bar g) in still 20 °C air; indicative figures. Insulation retains roughly 90% of the loss, which is why bare pipe and fittings repay lagging within months."
      >
        <RefTable
          headers={["Pipe size (DN)", "Bare (W/m)", "Insulated (W/m)"]}
          rows={PIPE_LOSS.map((p) => [p.dn, p.bareWperM, p.insulatedWperM])}
        />
      </RefSection>

      <RefSection
        heading="A working cost of steam"
        note="At the platform's reference prices (gas £0.06/kWh, boiler 85% efficient, feedwater at 80 °C), steam at 7 bar g costs roughly £48 per tonne in fuel alone, before water and treatment. Every steam loss can be priced from that figure."
      >
        <RefTable
          headers={["Assumption", "Value"]}
          rows={[
            ["Gas price", "£0.06/kWh"],
            ["Boiler efficiency", "85%"],
            ["Feedwater temperature", "80 °C (hf ≈ 335 kJ/kg)"],
            ["Heat added per tonne (7 bar g)", "2,769 − 335 = 2,434 MJ"],
            ["Gas per tonne", "≈ 795 kWh"],
            ["Fuel cost per tonne", "≈ £48"],
          ]}
        />
      </RefSection>

      <RefLinks
        taught={[
          { href: "/courses/steam-and-condensate/steam-basics", label: "Steam basics" },
          { href: "/courses/steam-and-condensate/steam-pressure", label: "Pressure & flash steam" },
          { href: "/courses/insulation-systems/pipe-sizing", label: "Pipe lagging" },
        ]}
        sources={[
          { href: "https://www.spiraxsarco.com/learn-about-steam", label: "Spirax Sarco steam tables" },
          { href: "https://www.bsigroup.com/", label: "BS 5422 (insulation thickness)" },
        ]}
      />
    </RefShell>
  );
}
