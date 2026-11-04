import type { ButtonHTMLAttributes } from "react";
import { buttonStyles, type ButtonSize, type ButtonVariant } from "./buttonStyles";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
};

export function Button({ variant, size, block, className, type = "button", ...rest }: Props) {
  return (
    <button type={type} className={buttonStyles({ variant, size, block, className })} {...rest} />
  );
}
