import type { ResponsiveImage } from "./types";

export default function ResponsivePicture({
  image,
  className,
  eager = false,
}: {
  image: ResponsiveImage;
  className?: string;
  eager?: boolean;
}) {
  return (
    <picture>
      {image.sources.map((source) => (
        <source
          key={source.type}
          type={source.type}
          srcSet={source.srcSet}
          sizes={image.sizes}
        />
      ))}
      <img
        src={image.src}
        srcSet={image.srcSet}
        sizes={image.sizes}
        width={image.width}
        height={image.height}
        alt={image.alt}
        className={className}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : undefined}
      />
    </picture>
  );
}
