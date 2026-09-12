import { Component, type ErrorInfo, type ReactNode } from "react";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { LoreArchive } from "./components/LoreArchive";
import { Nav } from "./components/Nav";
import { Projects } from "./components/Projects";
import { QuipReel } from "./components/QuipReel";
import { Stats } from "./components/Stats";
import { useSound } from "./hooks/useSound";

class SectionBoundary extends Component<{ name: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[${this.props.name}]`, error, info.componentStack);
  }

  render() {
    if (this.state.failed) {
      return (
        <section className="section">
          <div className="wrap">
            <div className="empty empty--error" role="alert">
              the {this.props.name} module failed to render. everything else is fine; reload to try again.
            </div>
          </div>
        </section>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const sound = useSound();
  return (
    <>
      <a className="skip-link" href="#projects">
        skip to content
      </a>
      <Nav sound={sound} />
      <main id="main">
        <Hero />
        <SectionBoundary name="projects">
          <Projects sound={sound} />
        </SectionBoundary>
        <SectionBoundary name="lore archive">
          <LoreArchive sound={sound} />
        </SectionBoundary>
        <SectionBoundary name="quip reel">
          <QuipReel sound={sound} />
        </SectionBoundary>
        <SectionBoundary name="stats">
          <Stats sound={sound} />
        </SectionBoundary>
      </main>
      <Footer />
    </>
  );
}
