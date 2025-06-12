import { Metadata } from "next";
import { getI18n } from "@/lib/i18n/config";
import { Button } from "@/components/ui/button";
import { Property } from "@/app/types/models";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import PropertyList from "../../cms/components/PropertyList";
import { LanguageSwitcher } from "@/components/language-switcher";

export const metadata: Metadata = {
	title: "CMS Dashboard",
	description: "Content Management System Dashboard",
};

async function getProperties() {
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/cms/properties`,
		{
			headers: {
				Cookie: `token=${token}`,
			},
		}
	);

	if (!response.ok) {
		throw new Error("Failed to fetch properties");
	}

	return response.json();
}

export default async function CMSPage({
	params: { locale },
}: {
	params: { locale: string };
}) {
	const t = await getI18n();
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;

	if (!token) {
		redirect(`/${locale}/cms/login`);
	}

	try {
		const secret = new TextEncoder().encode(
			process.env.JWT_SECRET || "your-secret-key"
		);

		await jwtVerify(token, secret);
	} catch {
		redirect(`/${locale}/cms/login`);
	}

	const properties: Property[] = await getProperties();

	return (
		<div className="min-h-screen bg-gray-50">
			<header className="bg-white shadow">
				<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
					<h1 className="text-3xl font-bold text-gray-900">{t("cms.title")}</h1>
					<div className="flex items-center space-x-4">
						<LanguageSwitcher />
						<form action="/api/auth/logout" method="POST">
							<Button variant="outline" type="submit">
								{t("auth.logout")}
							</Button>
						</form>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-2xl font-semibold text-gray-900">
							{t("cms.properties.title")}
						</h2>
						<Button
							onClick={() =>
								(window.location.href = `/${locale}/cms/properties/new`)
							}
						>
							{t("cms.properties.create")}
						</Button>
					</div>

					<PropertyList properties={properties} />
				</div>
			</main>
		</div>
	);
}
