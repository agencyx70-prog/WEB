import Services from '../../components/Services';
import PageTransition from '../../components/PageTransition';

export default function ServicesPage() {
  return (
    <PageTransition>
      <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <Services />
      </main>
    </PageTransition>
  );
}
