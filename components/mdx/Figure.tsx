export function Figure({
  src,
  alt,
  caption,
  credit,
}: {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
}) {
  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="h-auto w-full" />
      </div>
      {(caption || credit) && (
        <figcaption className="mt-2 text-center text-sm text-slate-500">
          {caption}
          {credit && (
            <span className="block text-xs text-slate-400">{credit}</span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
