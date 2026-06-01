import PastWorks from '../../components/PastWorks';
import PageTransition from '../../components/PageTransition';

export default function WorkPage() {
  return (
    <PageTransition>
      <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <PastWorks />
      </main>
    </PageTransition>
  );
}
