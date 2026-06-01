import Contact from '../../components/Contact';
import PageTransition from '../../components/PageTransition';

export default function ContactPage() {
  return (
    <PageTransition>
      <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <Contact />
      </main>
    </PageTransition>
  );
}
