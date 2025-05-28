/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";

export function useResponsiveSlides() {
	const [slidesPerView, setSlidesPerView] = useState(1);

	useEffect(() => {
		function handleResize() {
			const width = window.innerWidth;
			if (width >= 1280) {
				setSlidesPerView(7); // e.g. 4 slides on ≥1280px
			} else if (width >= 1024) {
				setSlidesPerView(6); // e.g. 3 slides on ≥1024px
			} else if (width >= 640) {
				setSlidesPerView(4); // e.g. 2 slides on ≥640px
			} else {
				setSlidesPerView(3); // 1 slide on <640px
			}
		}

		window.addEventListener("resize", handleResize);
		handleResize(); // run once on mount
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return slidesPerView;
}

import React from "react";
import { motion } from "framer-motion";
import { Image } from "../types/Room";

// Example images (replace with your real URLs)

export default function ImageSlides({ images }: { images: Image[] }) {
	const slidesPerView = useResponsiveSlides();

	// Number of "pages" if we skip all items at once
	const pagesCount = Math.ceil(images.length / slidesPerView);
	const [pageIndex, setPageIndex] = useState(0);

	// Auto-slide every 5s
	useEffect(() => {
		const interval = setInterval(() => {
			nextPage();
		}, 5000);
		return () => clearInterval(interval);
	}, [pageIndex, slidesPerView]);

	function nextPage() {
		setPageIndex((prev) => (prev >= pagesCount - 1 ? 0 : prev + 1));
	}

	// If we change slidesPerView such that the old pageIndex is out of range, reset
	useEffect(() => {
		if (pageIndex >= pagesCount) {
			setPageIndex(0);
		}
	}, [pageIndex, pagesCount]);

	// We want each page to shift horizontally by 100% increments,
	// because each "page" is effectively the full carousel width
	// (containing slidesPerView images).

	// For the actual layout, we still use a row of all images,
	// each with a fraction of the width.
	// The container total will be pagesCount * 100% wide.
	// We'll see the chunk (page) we are currently on (pageIndex).

	return (
		<div className="w-full mx-auto px-6 overflow-hidden">
			<motion.div
				className="flex gap-6"
				// style={{ width: `${pagesCount * 100}%` }}
				animate={{ x: `-${100 * pageIndex}%` }}
				transition={{ duration: 0.5 }}
			>
				{images.map((src, i) => (
					<div
						key={i}
						className="flex-none"
						style={{
							// Each page is 100% wide,
							// and within each page we show slidesPerView items (with gap-6).
							width: `calc((100% / ${slidesPerView}) - ${
								((slidesPerView - 1) * 24) / slidesPerView
							}px)`,
						}}
					>
						<div className="aspect-square relative overflow-hidden">
							<img
								src={(src.url || src.src)}
								alt={src?.alt || src?.text}
								className="absolute w-full h-full object-cover"
							/>
						</div>
					</div>
				))}
			</motion.div>

			{/* Pagination dots (one dot per page) */}
			{pagesCount > 1 && (
				<div className="mt-4 flex justify-center space-x-3">
					{Array.from({ length: pagesCount }).map((_, idx) => (
						<button
							key={idx}
							onClick={() => setPageIndex(idx)}
							className={`w-1.5 h-1.5 rounded-full transition-colors ${
								idx === pageIndex ? "bg-gray-800" : "bg-gray-300"
							}`}
						/>
					))}
				</div>
			)}
		</div>
	);
}
