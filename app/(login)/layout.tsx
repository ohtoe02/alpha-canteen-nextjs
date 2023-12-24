import "@/styles/globals.scss";

export default function LoginLayout({
																			children
																		}: {
	children: React.ReactNode;
}) {

	return (
		<main>
			{children}
		</main>
	)
}