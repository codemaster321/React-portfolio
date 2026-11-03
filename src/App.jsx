import MainComponent from "./components/MainComponent";
import SmoothScrolling from "./components/SmoothScrolling";
import Marquee from "./components/Marquee";
import Portfolio from "./components/Portfolio";
import About from "./components/About";
import Timeline from "./components/Timeline";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";
import NavBar from "./components/NavBar";

function App() {
  return (
    <>
      <LoadingScreen />
      <SmoothScrolling>
        <a className="skip-link" href="#main">Skip to content</a>
        <NavBar />
        <main id="main">
          <MainComponent />
          <Marquee />
          <Portfolio />
          <About />
          <Timeline />
          <Contact />
        </main>
        <Footer />
      </SmoothScrolling>
    </>
  );
}

export default App;
