import Team from '../../components/Team';
import PageTransition from '../../components/PageTransition';

export default function TeamPage() {
  return (
    <PageTransition>
      <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <Team />
      </main>
    </PageTransition>
  );
}
