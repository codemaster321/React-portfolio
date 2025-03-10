import { lazy } from "react";
import MainComponent from "./components/MainComponent";
import SmoothScrolling from "./components/SmoothScrolling";

const Skills = lazy(() => import("./components/Skills"));
const Portfolio = lazy(() => import("./components/Portfolio"));
const Contact = lazy(() => import("./components/Contact"));
const Timeline = lazy(() => import("./components/Timeline"));

function App() {
  return (
    <SmoothScrolling>
      <MainComponent />

      <Skills />
      <Timeline />
      <Portfolio />
      <Contact />
    </SmoothScrolling>
  );
}

export default App;
