import { cn } from "@/lib/utils";

// The cut media frames used across the site. Paths are authored in
// objectBoundingBox units, so one definition scales to any container size.
//
// Two shapes, deliberately distinct so the same image treatment does not
// read as a repeated stamp:
//   notch - stepped, plate-like corners. Homepage hero video.
//   bevel - a single clean chamfer on two opposite corners. About photo.
//
// Because objectBoundingBox units are normalised per axis, a chamfer that
// should look like a 45-degree cut needs its x offset divided by the frame's
// aspect ratio. Both frames below run at 12/5, so 0.28 of the height is
// 0.28 / 2.4 = 0.1167 of the width. Re-derive these if the aspect changes.
const CUTS = {
  notch:
    "M0.0998072 1H0.422076H0.749756C0.767072 1 0.774207 0.961783 0.77561 0.942675V0.807325C0.777053 0.743631 0.791844 0.731953 0.799059 0.734076H0.969813C0.996268 0.730255 1.00088 0.693206 0.999875 0.675159V0.0700637C0.999875 0.0254777 0.985045 0.00477707 0.977629 0H0.902473C0.854975 0 0.890448 0.138535 0.850165 0.138535H0.0204424C0.00408849 0.142357 0 0.180467 0 0.199045V0.410828C0 0.449045 0.0136283 0.46603 0.0204424 0.469745H0.0523086C0.0696245 0.471019 0.0735527 0.497877 0.0733523 0.511146V0.915605C0.0723903 0.983121 0.090588 1 0.0998072 1Z",
  bevel: "M0.1167 0H1V0.72L0.8833 1H0V0.28L0.1167 0Z",
} as const;

export type CutFrameShape = keyof typeof CUTS;

export function CutFrame({
  cut = "notch",
  className,
  children,
}: {
  cut?: CutFrameShape;
  className?: string;
  children: React.ReactNode;
}) {
  // A fixed id per shape rather than useId(), so this stays usable from
  // server components. Rendering the same shape twice on one page emits
  // duplicate but identical defs, which is harmless.
  const clipId = `cut-frame-${cut}`;

  return (
    <>
      <svg width="0" height="0" aria-hidden className="absolute">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d={CUTS[cut]} />
          </clipPath>
        </defs>
      </svg>

      <div
        className={cn("relative bg-ink", className)}
        style={{ clipPath: `url(#${clipId})` }}
      >
        {children}
      </div>
    </>
  );
}
