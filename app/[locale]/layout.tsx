import type { Metadata } from "next";
import { Poppins, Cairo } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartProvider from "@/components/providers/cart-provider";
import WishlistProvider from "@/components/providers/WishlistProvider";
import { getWishlist } from "@/app/actions/wishlist";
import { cookies } from "next/headers";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: {
      default: t("defaultTitle"),
      template: `%s | ${t("siteName")}`,
    },
    description: t("defaultDescription"),
    openGraph: {
      type: "website",
      locale: t("ogLocale"),
      siteName: t("siteName"),
      title: t("defaultTitle"),
      description: t("homeDescription"),
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("customer_access_token")?.value;
  const idToken = cookieStore.get("customer_id_token")?.value;
  const isLoggedIn = Boolean(accessToken || idToken);
  const wishlistItems = await getWishlist();
  const isRtl = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isRtl ? "rtl" : "ltr"}
      className={`${poppins.variable} ${cairo.variable}`}
    >
      <body className={isRtl ? "font-arabic" : undefined}>
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <WishlistProvider
              initialItems={wishlistItems}
              isLoggedIn={isLoggedIn}
            >
              <Header />
              <main id="main-content">{children}</main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
