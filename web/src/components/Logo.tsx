import Link from "next/link";

export function Logo({
  variant = "full",
  invert = false,
}: {
  variant?: "full" | "mark";
  invert?: boolean;
}) {
  if (variant === "mark") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/brand/plopi-mark.svg"
        alt="플로피"
        width={36}
        height={36}
        className="shrink-0"
      />
    );
  }

  return (
    <Link href="/" className="inline-flex items-center gap-2.5 group">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/plopi-mark.svg"
        alt=""
        width={32}
        height={32}
        className="shrink-0 transition-transform group-hover:scale-105"
      />
      <span
        className={`text-[1.35rem] font-bold tracking-tight leading-none ${
          invert ? "text-white" : "text-[var(--ink)]"
        }`}
      >
        plopi
      </span>
    </Link>
  );
}
