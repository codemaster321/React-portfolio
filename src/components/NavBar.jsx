import {
  IonButton,
  IonIcon,
  IonMenuButton,
  setupIonicReact,
} from "@ionic/react";
import { menu, close } from "ionicons/icons";
import gsap from "gsap";
import { useLayoutEffect, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

setupIonicReact();

export default function NavBar() {
  const openNavRef = useRef(null);
  const closeNavRef = useRef(null);

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
      }).from("#navbar", {
        opacity: 0,
        yPercent: "-50",
        duration: 1,
        delay: 0,
      });
    }, comp.current);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <header ref={comp}>
        <h2 className="nav-title" id="heading">
          !Shiv
        </h2>
        <nav className="main-nav" id="navbar">
          <div className="e">
            <Link onClick={onClickPortfolioHandler} className="main-nav-link ">
              Portfolio
            </Link>
          </div>
          <div className="e">
            <Link
              onClick={onClickSkillsHandler}
              className="main-nav-link skills--link"
            >
              Skills
            </Link>
          </div>

          <div className="e">
            <Link
              onClick={onClickContactHandler}
              className="main-nav-link contact"
            >
              Contact
            </Link>
          </div>
        </nav>

        <button className="btn-mobile-nav">
          <IonIcon
            ref={openNavRef}
            className="icon-mobile-nav md hydrated"
            data-name="menu-outline"
            icon={menu}
            color="black"
          ></IonIcon>

          <IonButton
            ref={closeNavRef}
            className="icon-mobile-nav"
            icon={close}
            data-name="close-outline"
          ></IonButton>
        </button>
      </header>
    </>
  );
}
