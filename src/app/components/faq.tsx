"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Faq() {
	return (
		<div className="bg-orange-50 py-8 px-4 md:px-8"  id="faq">
			<h2 className="text-2xl text-center font-bold">
				Frequently Asked Questions
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 mt-8 gap-x-4 md:gap-x-12 max-w-[800px] mx-auto">
				<Item
					title="What time is check-in and check-out?"
					text="Check in at 3pm and Check out at 11am"
				/>
				<Item
					title="Do they have parking?"
					text="Jamadi Camp has free parking."
				/>
				<Item
					title="How do I get into my cabin?"
					text="You will be sent a code via WhatsApp two days before your reservation, which must be entered into the black storage box next to the main door, where you will find the keys to your cabin. At the end of your stay you must return them to the same place."
				/>
			</div>
		</div>
	);
}

function Item({ title, text }: { text: string; title: string }) {
	const [open, setOpen] = useState(false);
	return (
		<div className="py-3 border-t border-[#3a383a] space-y-3">
			<div
				className="flex flex-row items-center justify-between cursor-pointer"
				onClick={() => setOpen(!open)}
			>
				<h3 className="font-bold text-[#3a383a]">{title}</h3>
				<ToggleButton isOpen={open} setIsOpen={setOpen} />
			</div>
			<motion.p
				style={{ overflow: "hidden" }}
				animate={{
					height: open ? "auto" : 0,
				}}
				className="text-[#3a383a]"
			>
				{text}
			</motion.p>
		</div>
	);
}

function ToggleButton({
	isOpen,
	setIsOpen,
}: {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
}) {
	return (
		<motion.button
			onClick={() => setIsOpen(!isOpen)}
			className="flex items-center justify-center rounded-full transition"
		>
			<motion.span
				className="relative block w-3 h-3"
				initial={false}
				animate={isOpen ? "minus" : "plus"}
				variants={{
					plus: { rotate: 0 },
					minus: { rotate: 90 },
				}}
				transition={{ duration: 0.2 }}
			>
				{/* Horizontal Line */}
				<motion.div
					className="absolute top-[40%] left-0 w-full h-0.5 bg-black rounded"
					initial={false}
					animate={{ rotate: isOpen ? 90 : 0 }}
					transition={{ duration: 0.2 }}
				/>
				{/* Vertical Line (Only visible when not open) */}
				<motion.div
					className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-0.5 bg-black rounded"
					initial={false}
					animate={{ opacity: isOpen ? 0 : 1 }}
					transition={{ duration: 0.2 }}
				/>
			</motion.span>
		</motion.button>
	);
}
