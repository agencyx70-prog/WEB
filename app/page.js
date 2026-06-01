import Hero from '../components/Hero';
import FeaturedWork from '../components/FeaturedWork';
import MarqueeBanner from '../components/MarqueeBanner';
import PageTransition from '../components/PageTransition';

export default function Home() {
  return (
    <PageTransition>
      <main>
        <Hero />
        <FeaturedWork />
        <MarqueeBanner />
      </main>
    </PageTransition>
  );
}
