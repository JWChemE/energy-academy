/**
 * Lightweight YouTube embed. Pass the 11-character video id (the part after
 * `v=` or `youtu.be/`), e.g. <YouTubeEmbed id="abcd1234XYZ" title="..." />.
 *
 * Short-term video strategy: embed YouTube. When we move to self-hosted video
 * later, only this component changes.
 */
export function YouTubeEmbed({
  id,
  title = "Video",
  start,
}: {
  id: string;
  title?: string;
  start?: number;
}) {
  const params = new URLSearchParams({ rel: "0", modestbranding: "1" });
  if (start) params.set("start", String(start));

  return (
    <figure className="my-8">
      <div className="aspect-video overflow-hidden rounded-xl border border-slate-200 bg-black shadow-sm">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      {title !== "Video" && (
        <figcaption className="mt-2 text-center text-sm text-slate-500">
          {title}
        </figcaption>
      )}
    </figure>
  );
}
