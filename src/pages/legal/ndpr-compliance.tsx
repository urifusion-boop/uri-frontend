import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';

export default function NdprCompliancePage() {
  return (
    <>
      <SeoHead title="NDPR Compliance" />
      <Navigation />
      <main className="px-4 sm:px-6 lg:px-8 py-12">
        <section className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">NDPR Compliance</h1>
          <p className="text-muted-foreground">Alignment with Nigeria Data Protection Regulation. Coming soon.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
