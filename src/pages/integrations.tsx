import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';

export default function IntegrationsPage() {
  return (
    <>
      <SeoHead title="Integrations" />
      <Navigation />
      <main className="px-4 sm:px-6 lg:px-8 py-12">
        <section className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">Integrations</h1>
          <p className="text-muted-foreground">Connect CRM and tools to automate signal workflows.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
