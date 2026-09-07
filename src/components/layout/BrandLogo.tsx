import card24Logo from "@/assets/card24-logo.jpg";

type BrandLogoProps = {
  compact?: boolean;
  className?: string;
  imageClassName?: string;
  showText?: boolean;
};

export function BrandLogo({
  compact = false,
  className = "",
  imageClassName = "",
  showText = true,
}: BrandLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src={card24Logo}
        alt="card24"
        className={[
          compact ? "h-9 w-9" : "h-10 w-10",
          "rounded-lg object-cover shadow-sm",
          imageClassName,
        ].join(" ")}
      />
      {showText && (
        <span className="font-display text-lg font-bold tracking-normal text-foreground">
          card24
        </span>
      )}
    </span>
  );
}
