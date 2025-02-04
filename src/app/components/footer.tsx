import Image from "next/image";
import Faq from "./faq";
import Link from "next/link";
import routes from "../lib/routes";

export default function Footer() {
	return (
		<footer className="bg-orange-50 text-[#3a383a]">
			<div className=" max-w-[800px] mx-auto">
				<Faq />
				<div className="py-12 flex  px-4 md:px-8" id="contact">
					<div className="space-y-2">
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

						<div className="text-lg space-y-2">
							<h3 className="text-2xl">Contact</h3>
							<div>
								<a href="tel:+19999999999" className="opacity-80">
									Whatsapp: +1 999 999 9999
								</a>
							</div>
							<div>
								{" "}
								<a href="mailto:jamadicamp@gmail.com" className="opacity-80">
									Email: jamadicamp@gmail.com
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
