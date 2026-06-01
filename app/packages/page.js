import Packages from '../../components/Packages';
import PageTransition from '../../components/PageTransition';

export default function PackagesPage() {
  return (
    <PageTransition>
      <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <Packages />
      </main>
    </PageTransition>
  );
}
