"use client";

import routes from "../lib/routes";
import { usePathname } from "next/navigation";
import NavLink from "./nav-link";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-row px-20 py-6 bg-white items-center justify-between">
      <div className="relative w-20 h-16">
        <Image src="/images/Logo_Amealco_white.webp" priority unoptimized fill alt="Jamadi Camp Logo" />
      </div>
      <ul className="flex flex-row gap-8">
        <NavLink href={routes.home.href} as={routes.home.path} active={pathname === routes.home.href}>
          home
        </NavLink>
        <NavLink href={routes.whatToDo.href} as={routes.whatToDo.path} active={pathname === routes.whatToDo.href}>
          what to do in the camp
        </NavLink>
        <NavLink href={routes.cabins.href} as={routes.cabins.path} active={pathname === routes.cabins.href}>
          our cabins
        </NavLink>
        <NavLink href={routes.contact.href} as={routes.contact.path} active={pathname === routes.contact.href}>
          contact
        </NavLink>
      </ul>
    </nav>
  );
}
