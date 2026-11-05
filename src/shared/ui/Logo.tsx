import Image from "next/image";
import Link from "next/link";

type Props = {
  href?: string;
};

export function Logo({ href = "/landing" }: Props) {
  return (
    <Link href={href} aria-label="짚어 홈" className="inline-flex shrink-0">
      <Image src="/brand/logo.svg" alt="짚어" width={60} height={34} priority />
    </Link>
  );
}
