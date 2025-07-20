import {
  IonButton,
  IonIcon,
  IonMenuButton,
  setupIonicReact,
} from "@ionic/react";
import { menu, close } from "ionicons/icons";
import gsap from "gsap";
import { useLayoutEffect, useRef, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

setupIonicReact();

export default function NavBar() {
  const openNavRef = useRef(null);
  const closeNavRef = useRef(null);

  const btnNavEl = useRef(null);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const navTriggerHandler = () => {
    setIsNavOpen(!isNavOpen);
  };

  const onClickContactHandler = () => {
    document
      .querySelector(".contactSection")
      .scrollIntoView({ behavior: "smooth" });
  };
  const onClickSkillsHandler = () => {
    document
      .querySelector(".section--skills")
      .scrollIntoView({ behavior: "smooth" });
  };
  const onClickPortfolioHandler = () => {
    document
      .querySelector(".portfolioSection")
      .scrollIntoView({ behavior: "smooth" });
  };
  const comp = useRef(null);
  console.log(comp.current);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const t1 = gsap.timeline();
      t1.from("#heading", {
        opacity: 0,
        yPercent: "-50",
        duration: 1,
        delay: 1,
      }).from(".e", {
        opacity: 0,
        yPercent: "-50",
        duration: 1,
        delay: 0,
        stagger: 0.5,
      });
    }, comp.current);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const header = comp.current;
    if (header) {
      if (isNavOpen) {
        header.classList.add("nav-open");
      } else {
        header.classList.remove("nav-open");
      }
    }
  }, [isNavOpen]);

  return (
    <>
      <header ref={comp}>
        <h2 className="nav-title" id="heading">
          !Shiv
        </h2>
        <nav className="main-nav" id="navbar">
          <div className="e">
            <NavLink
              onClick={onClickPortfolioHandler}
              className="main-nav-link "
            >
              Portfolio
            </NavLink>
          </div>
          <div className="e">
            <NavLink
              onClick={onClickSkillsHandler}
              className="main-nav-link skills--link"
            >
              Skills
            </NavLink>
          </div>

          <div className="e">
            <NavLink
              onClick={onClickContactHandler}
              className="main-nav-link contact"
            >
              Contact
            </NavLink>
          </div>
        </nav>

        <button
          onClick={navTriggerHandler}
          ref={btnNavEl}
          className="btn-mobile-nav"
        >
          <IonIcon
            ref={openNavRef}
            className="icon-mobile-nav "
            data-name="menu-outline"
            icon={menu}
            color="black"
          ></IonIcon>

          <IonIcon
            ref={closeNavRef}
            className="icon-mobile-nav"
            icon={close}
            data-name="close-outline"
            color="black"
          ></IonIcon>
        </button>
      </header>
    </>
  );
}
