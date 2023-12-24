import "@/styles/globals.scss";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Providers } from "@/app/providers";
import clsx from "clsx";
import {Inter} from 'next/font/google'

const inter = Inter({subsets: ['latin', 'cyrillic']})

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon-16x16.png",
		apple: "/apple-touch-icon.png",
	},
};

export default function RootLayout({
																		 children,
																	 }: {
	children: React.ReactNode;
}) {

	return (
		<html lang="ru" suppressHydrationWarning>
		<head />
		<body
			className={clsx(
				'min-h-screen font-sans antialiased',
				inter.className
			)}
		>
		<Providers themeProps={{ attribute: 'class', defaultTheme: 'light' }}>

					{children}

		</Providers>
		</body>
		</html>
	);
}
