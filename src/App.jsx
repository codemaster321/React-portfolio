import { lazy } from "react";
import MainComponent from "./components/MainComponent";

const Skills = lazy(() => import("./components/Skills"));
const Portfolio = lazy(() => import("./components/Portfolio"));
const Contact = lazy(() => import("./components/Contact"));
const Timeline = lazy(() => import("./components/Timeline"));

function App() {
  return (
    <>
      <MainComponent />
      <Skills />
      <Timeline />
      <Portfolio />
      <Contact />
    </>
  );
}

export default App;
