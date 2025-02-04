"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import routes from "../lib/routes";
import { usePathname } from "next/navigation";
import NavLink from "./nav-link";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	// Sidebar slide-in variants
	const sidebarVariants = {
		open: {
			x: 0,
			transition: {
				type: "spring",
				stiffness: 300,
				damping: 30,
			},
		},
		closed: {
			x: "-100%",
			transition: {
				type: "spring",
				stiffness: 300,
				damping: 30,
			},
		},
	};

	// Simple toggle for hamburger vs X
	const toggleSidebar = () => {
		setIsOpen((prev) => !prev);
	};

	return (
		<nav className="flex items-center justify-between px-4 md:px-20 bg-orange-50">
			{/* LOGO */}
			<Link href={routes.home.href} className="text-4xl font-bold">
				<div className="relative w-16 h-16 md:w-24 md:h-24">
					<Image
						fill
						src={"/images/logo-main.webp"}
						alt="Main logo"
						objectFit="cover"
					/>
				</div>
			</Link>

			{/* Desktop Menu */}
			<ul className="hidden md:flex flex-row gap-8">
				<NavLink
					href={routes.home.href}
					as={routes.home.path}
					active={pathname === routes.home.href}
				>
					home
				</NavLink>
				<NavLink
					href={routes.faq.href}
					as={routes.faq.path}
					active={pathname === routes.faq.href}
				>
					Faq
				</NavLink>
				<NavLink
					href={routes.cabins.href}
					as={routes.cabins.path}
					active={pathname === routes.cabins.href}
				>
					our cabins
				</NavLink>
				<NavLink
					href={routes.contact.href}
					as={routes.contact.path}
					active={pathname === routes.contact.href}
				>
					contact
				</NavLink>
			</ul>

			{/* Mobile Hamburger Icon */}
			<div
				className="flex md:hidden flex-col gap-1 cursor-pointer"
				onClick={toggleSidebar}
			>
				{/* Top line */}
				<motion.span
					className="block h-[2px] w-6 bg-black"
					animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
					transition={{ duration: 0.3 }}
				/>
				{/* Middle line */}
				<motion.span
					className="block h-[2px] w-6 bg-black"
					animate={
						isOpen ? { width: 0, opacity: 0 } : { width: "100%", opacity: 1 }
					}
					transition={{ duration: 0.3 }}
				/>
				{/* Bottom line */}
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
						className="fixed top-0 left-0 w-[75%] sm:w-[60%] md:hidden h-full bg-black text-white flex flex-col p-8 z-50"
					>
						<ul className="space-y-6 mt-10">
							<li>
								<NavLink
									href={routes.home.href}
									as={routes.home.path}
									active={pathname === routes.home.href}
									onClick={() => setIsOpen(false)}
								>
									home
								</NavLink>
							</li>
							<li>
								<NavLink
									href={routes.faq.href}
									as={routes.faq.path}
									active={pathname === routes.faq.href}
									onClick={() => setIsOpen(false)}
								>
									Faq
								</NavLink>
							</li>
							<li>
								<NavLink
									href={routes.cabins.href}
									as={routes.cabins.path}
									active={pathname === routes.cabins.href}
									onClick={() => setIsOpen(false)}
								>
									our cabins
								</NavLink>
							</li>
							<li>
								<NavLink
									href={routes.contact.href}
									as={routes.contact.path}
									active={pathname === routes.contact.href}
									onClick={() => setIsOpen(false)}
								>
									contact
								</NavLink>
							</li>
						</ul>
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	);
}
