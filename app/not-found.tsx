import Link from "next/link";
import { BookConsultationButton } from "@/components/services/BookConsultationButton";
import { ServiceMarketingFooter, ServiceMarketingHeader } from "@/components/services/ServiceMarketingHeader";

export default function NotFound() {
  return (
    <div className="nexora-page-bg nexora-marketing-page flex min-h-screen flex-col text-nexora-muted">
      <ServiceMarketingHeader />
      <main id="main-content" className="flex flex-1 items-center px-6 py-24 lg:px-8">
        <div className="nexora-glow nexora-card mx-auto w-full max-w-2xl rounded-3xl p-10 text-center lg:p-12">
          <p className="nexora-eyebrow">404</p>
          <h1 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">Page not found</h1>
          <p className="mt-5 text-lg leading-8 text-nexora-muted">
            The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you back on track.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/" className="nexora-btn-secondary px-6 py-3 font-semibold">
              Back to Home
            </Link>
            <BookConsultationButton className="px-6 py-3" />
          </div>
        </div>
      </main>
      <ServiceMarketingFooter />
    </div>
  );
}
