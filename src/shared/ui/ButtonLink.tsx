import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { buttonStyles, type ButtonSize, type ButtonVariant } from "./buttonStyles";

type Props = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    block?: boolean;
  };

export function ButtonLink({ variant, size, block, className, ...rest }: Props) {
  return <Link className={buttonStyles({ variant, size, block, className })} {...rest} />;
}
