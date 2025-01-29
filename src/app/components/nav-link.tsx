import Link from "next/link";
import { cn } from "../lib/classNames";
import { PropsWithChildren } from "react";

type Props = {
  href: string;
  as: string;
  active?: boolean;
  className?: string;
};

export default function NavLink(props: PropsWithChildren<Props>) {
  const { href, as, active, className } = props;
  return (
    <Link
      href={href}
      as={as}
      className={cn("uppercase hover:text-yellow-700 tracking-widest font-light", {
        "text-yellow-700": active,
      }, className)}
    >
      {props.children}
    </Link>
  );
}
