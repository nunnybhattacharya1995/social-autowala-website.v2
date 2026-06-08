import { useState, useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import { useLenis } from './hooks/useLenis';
import Loader   from './components/Loader/Loader';
import Cursor   from './components/Cursor/Cursor';
import Nav      from './components/Nav/Nav';
import Hero     from './components/Hero/Hero';
import Story    from './components/Story/Story';
import Why      from './components/Why/Why';
import Services from './components/Services/Services';
import Grow     from './components/Grow/Grow';
import Work     from './components/Work/Work';
import Testimonials from './components/Testimonials/Testimonials';
import Founder  from './components/Founder/Founder';
import Team     from './components/Team/Team';
import Contact  from './components/Contact/Contact';
import Footer   from './components/Footer/Footer';

function SiteContent() {
  const [loaded, setLoaded] = useState(false);
  useLenis();

  // After the loader exits, the Hero pin (and Grow pin) get created, which
  // changes total page height. Refresh ScrollTrigger so every trigger
  // re-measures against the final geometry. Two passes: an early one once
  // the pins are wired, and a later one to catch async image-load reflow
  // (the 3D auto/icons affect layout). Also refresh on full window load.
  useEffect(() => {
    if (!loaded) return;
    const t1 = setTimeout(() => ScrollTrigger.refresh(), 400);
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 900);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('load', onLoad);
    };
  }, [loaded]);

  return (
    <>
      <Loader onComplete={() => setLoaded(true)} />
      <Cursor />
      <Nav />
      <main>
        <Hero isLoaded={loaded} />
        <Story />
        <Why />
        <Services />
        <Grow />
        <Work />
        <Testimonials />
        <Founder />
        <Team />
        <Contact />
        <Footer />
      </main>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <SiteContent />
      </ErrorBoundary>
    </ThemeProvider>
  );
}
