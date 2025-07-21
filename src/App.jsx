import { lazy } from "react";
import MainComponent from "./components/MainComponent";
import SmoothScrolling from "./components/SmoothScrolling";

import Skills from "./components/Skills";
import Portfolio from "./components/Portfolio";
import Contact from "./components/Contact";
import Timeline from "./components/Timeline";
import VerticalProgress from "./components/VertilcalProgress";
import LoadingScreen from "./components/LoadingScreen";
import NavBar from "./components/NavBar";
import Links from "./components/Links";

function App() {
  return (
    <>
      <div className="main-content">
        <>
          <LoadingScreen />
        </>
        <>
          <VerticalProgress />
          <SmoothScrolling>
            <NavBar />

            <MainComponent />

            <Skills />
            <Timeline />
            <Portfolio />
            <Contact />
            <Links />
          </SmoothScrolling>
        </>
      </div>
    </>
  );
}
export default App;
