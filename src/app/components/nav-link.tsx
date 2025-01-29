import Link from "next/link";
import { cn } from "../lib/classNames";
import { PropsWithChildren } from "react";

type Props = {
  href: string;
  as: string;
  active?: boolean;
  className?: string;
  onClick?: () => void
};

export default function NavLink(props: PropsWithChildren<Props>) {
  const { href, as, active, className, ...other } = props;
  return (
    <Link
      href={href}
      as={as}
      className={cn("uppercase hover:text-yellow-700 tracking-widest font-light", {
        "text-yellow-700": active,
      }, className)}
      {...other}
    >
      {props.children}
    </Link>
  );
}
