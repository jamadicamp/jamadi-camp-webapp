import Image from "next/image";
import Faq from "./faq";
import Link from "next/link";
import routes from "../lib/routes";

export default function Footer() {
	return (
		<footer className="bg-orange-50 text-[#3a383a]">
			<div className=" max-w-[800px] mx-auto">
				<Faq />
				<div className="py-12 flex flex-col md:flex-row gap-8 px-4 md:px-8" id="contact">
					<div className="space-y-2">
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

						<div className="text-lg space-y-2">
							<h3 className="text-2xl">Contacto</h3>
							<div>
								<a href="https://wa.me/524464109800?text=Hola%2C%20quiero%20reservar%20una%20cabaña%20en%20Jämadi%20Camp" className="opacity-80 hover:opacity-100 transition-opacity">
									WhatsApp: +52 446 410 9800
								</a>
							</div>
							<div>
								{" "}
								<a href={`mailto:${process.env.NEXT_PUBLIC_TO_EMAIL}`} className="opacity-80 hover:opacity-100 transition-opacity">
									Email: {process.env.NEXT_PUBLIC_TO_EMAIL}
								</a>
							</div>
						</div>
					</div>
					
					<div className="flex flex-col items-center md:items-end space-y-4">
						<div className="text-center md:text-right">
							<h4 className="text-lg font-semibold mb-2">Escanea para contactarnos</h4>
							<p className="text-sm text-gray-600 mb-3">Usa WhatsApp para reservar tu cabaña</p>
						</div>
						<div className="relative w-32 h-32 md:w-36 md:h-36">
							<Image
								src="/images/whatsapp-qr.jpeg"
								alt="Código QR de WhatsApp"
								fill
								className="object-cover rounded-lg shadow-md"
							/>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
