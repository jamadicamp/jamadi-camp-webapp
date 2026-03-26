"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import routes from "../lib/routes";
import { usePathname } from "next/navigation";
import NavLink from "./nav-link";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

const conoceMasLinks = [
  { label: "Jamädi Campamentos", href: routes.campamentos.href },
  { label: "Jamädi Orgánico", href: routes.organico.href },
  { label: "Jamädi Celebración", href: routes.celebracion.href },
  { label: "Jamädi Empresarial", href: routes.empresarial.href },
  { label: "Jamädi Natura", href: routes.natura.href },
  { label: "Jamädi Kids", href: routes.kids.href },
  { label: "Jamädi Experiencias", href: routes.experiencias.href },
  { label: "Jamädi Bienes Raíces", href: routes.bienesRaices.href },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const sidebarVariants = {
    open: {
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    closed: {
      x: "-100%",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const conoceMasActive =
    mounted &&
    conoceMasLinks.some((link) => pathname.startsWith(link.href));

  return (
    <nav className="flex items-center justify-between px-4 md:px-20 bg-orange-50 border-b border-[#3a383a]/15 shadow-sm">
      {/* LOGO */}
      <Link href={routes.home.href} className="text-4xl font-bold">
        <div className="relative w-24 h-24 md:w-28 md:h-28">
          <Image
            fill
            src={"/images/logo-main.webp"}
            alt="Logo principal"
            objectFit="cover"
          />
        </div>
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden md:flex flex-row gap-8 items-center">
        <NavLink
          href={routes.home.href}
          as={routes.home.path}
          active={mounted && pathname === routes.home.href}
        >
          inicio
        </NavLink>
        <NavLink
          href={routes.faq.href}
          as={routes.faq.path}
          active={mounted && pathname === routes.faq.href}
        >
          Preguntas Frecuentes
        </NavLink>

        {/* Conoce Más Dropdown */}
        <li
          className="relative list-none"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <button
            className={`uppercase tracking-widest font-light flex items-center gap-1 hover:text-yellow-700 transition-colors ${
              conoceMasActive ? "text-yellow-700" : ""
            }`}
          >
            Conoce Más
            <motion.span
              animate={{ rotate: dropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              <ChevronDown className="w-3 h-3" />
            </motion.span>
          </button>
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-orange-50 border border-orange-200 shadow-lg min-w-[220px] py-2 z-50"
              >
                {conoceMasLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-5 py-2 text-xs uppercase tracking-widest hover:text-yellow-700 text-[#3a383a] font-light transition-colors whitespace-nowrap"
                  >
                    {link.label}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </li>

        <NavLink
          href={routes.reservas.href}
          as={routes.reservas.path}
        >
          Jamädi Reservas
        </NavLink>
      </ul>

      {/* Mobile Hamburger Icon */}
      <div
        className="flex md:hidden flex-col gap-1 cursor-pointer z-50"
        onClick={toggleSidebar}
      >
        <motion.span
          className="block h-[2px] w-6 bg-black"
          animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          className="block h-[2px] w-6 bg-black"
          animate={isOpen ? { width: 0, opacity: 0 } : { width: "100%", opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          className="block h-[2px] w-6 bg-black"
          animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Animated Sidebar (Mobile) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sidebar"
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed top-0 left-0 w-[75%] sm:w-[60%] md:hidden h-full bg-black text-white flex flex-col p-8 z-40 overflow-y-auto"
          >
            <ul className="space-y-6 mt-10">
              <li>
                <NavLink
                  href={routes.home.href}
                  as={routes.home.path}
                  active={mounted && pathname === routes.home.href}
                  onClick={() => setIsOpen(false)}
                >
                  inicio
                </NavLink>
              </li>
              <li>
                <NavLink
                  href={routes.faq.href}
                  as={routes.faq.path}
                  active={mounted && pathname === routes.faq.href}
                  onClick={() => setIsOpen(false)}
                >
                  Preguntas Frecuentes
                </NavLink>
              </li>

              {/* Mobile Conoce Más */}
              <li>
                <button
                  onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                  className={`uppercase tracking-widest font-light flex items-center gap-2 hover:text-yellow-700 transition-colors ${
                    conoceMasActive ? "text-yellow-700" : ""
                  }`}
                >
                  Conoce Más
                  <motion.span
                    animate={{ rotate: mobileDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {mobileDropdownOpen && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: "hidden" }}
                      className="mt-4 ml-2 space-y-4"
                    >
                      {conoceMasLinks.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="text-xs uppercase tracking-widest font-light hover:text-yellow-700 transition-colors block"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>

              <li>
                <NavLink
                  href={routes.reservas.href}
                  as={routes.reservas.path}
                  onClick={() => setIsOpen(false)}
                >
                  Jamädi Reservas
                </NavLink>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
