import NavBar from "./components/NavBar";
import MainComponent from "./components/MainComponent";
import Particle from "./components/Particle";
import Skills from "./components/Skills";
import Portfolio from "./components/Portfolio";
import Contact from "./components/Contact";
import Map from "./components/MapView";
import ReactDOM from "react-dom";
import { useRef } from "react";

function App() {
  return (
    <>
      <Particle />
      <NavBar />
      <MainComponent />
      <Skills />
      <Portfolio />
      <Contact />
    </>
  );
}

export default App;
