import { redirect } from 'next/navigation';

/** Legacy contact route — redirects to the handover Contact Us page. */
export default async function StoryRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/contact-us`);
}
