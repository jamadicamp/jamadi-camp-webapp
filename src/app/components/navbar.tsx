"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import routes from "../lib/routes";
import { usePathname } from "next/navigation";
import NavLink from "./nav-link";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

const megaMenuColumns = [
  {
    heading: "Campamentos",
    links: [
      { label: "Jamädi Camp", href: routes.camp.href },
      { label: "Jamädi Camping", href: routes.camping.href },
      { label: "Jamädi San José", href: routes.sanJose.href },
    ],
  },
  {
    heading: "Eventos",
    links: [
      { label: "Jamädi Celebración", href: routes.celebracion.href },
      { label: "Jamädi Empresarial", href: routes.empresarial.href },
    ],
  },
  {
    heading: "Experiencias",
    links: [
      { label: "Jamädi Natura", href: routes.natura.href },
      { label: "Jamädi Kids", href: routes.kids.href },
      { label: "Jamädi Experiencias", href: routes.experiencias.href },
    ],
  },
  {
    heading: "Servicios",
    links: [
      { label: "Jamädi Orgánico", href: routes.organico.href },
      { label: "Jamädi Bienes Raíces", href: routes.bienesRaices.href },
    ],
  },
];

const allMegaLinks = megaMenuColumns.flatMap((col) => col.links);

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
    mounted && allMegaLinks.some((link) => pathname.startsWith(link.href));

  return (
    <nav
      className="relative flex items-center justify-between px-4 md:px-20 bg-orange-50 border-b border-[#3a383a]/15 shadow-sm"
      onMouseLeave={() => setDropdownOpen(false)}
    >
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

        {/* Conoce Más trigger */}
        <li
          className="list-none"
          onMouseEnter={() => setDropdownOpen(true)}
        >
          <button
            className={`uppercase tracking-widest font-light flex items-center gap-1 text-[#3a383a] hover:text-yellow-700 transition-colors ${
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
        </li>

        <NavLink
          href={routes.reservas.href}
          as={routes.reservas.path}
        >
          Jamädi Reservas
        </NavLink>
      </ul>

      {/* Desktop Mega Menu — full-width panel */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 hidden md:block bg-orange-50 border-b border-[#3a383a]/15 shadow-md z-50 px-20 py-8"
          >
            <div className="grid grid-cols-4">
              {megaMenuColumns.map((col, i) => (
                <div
                  key={col.heading}
                  className={`px-8 ${i === 0 ? "pl-0" : "border-l border-[#3a383a]/10"}`}
                >
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#3a383a] opacity-40 mb-5 font-medium">
                    {col.heading}
                  </p>
                  <ul className="space-y-3">
                    {col.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setDropdownOpen(false)}
                          className="text-sm text-[#3a383a] opacity-60 hover:opacity-100 hover:text-yellow-700 transition-all font-light tracking-wide block"
                        >
                          › {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Hamburger Icon */}
      <div
        className="flex md:hidden flex-col gap-1 cursor-pointer z-50"
        onClick={toggleSidebar}
      >
        <motion.span
          className={`block h-[2px] w-6 ${isOpen ? "bg-white" : "bg-[#3a383a]"}`}
          animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          className={`block h-[2px] w-6 ${isOpen ? "bg-white" : "bg-[#3a383a]"}`}
          animate={isOpen ? { width: 0, opacity: 0 } : { width: "100%", opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          className={`block h-[2px] w-6 ${isOpen ? "bg-white" : "bg-[#3a383a]"}`}
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

              {/* Mobile Conoce Más — grouped sections */}
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
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: "hidden" }}
                      className="mt-5 ml-1 space-y-6"
                    >
                      {megaMenuColumns.map((col) => (
                        <div key={col.heading}>
                          <p className="text-[9px] uppercase tracking-[0.2em] opacity-40 mb-3 font-medium">
                            {col.heading}
                          </p>
                          <ul className="space-y-3">
                            {col.links.map((link) => (
                              <li key={link.href}>
                                <Link
                                  href={link.href}
                                  onClick={() => setIsOpen(false)}
                                  className="text-xs uppercase tracking-widest font-light opacity-75 hover:opacity-100 hover:text-yellow-700 transition-colors block"
                                >
                                  › {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </motion.div>
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
