import { IonIcon, IonMenuButton } from "@ionic/react";
import { menu, close } from "ionicons/icons";
import gsap from "gsap";
import { useLayoutEffect, useRef, useEffect } from "react";

export default function NavBar() {
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
      <div className="bg"></div>

      <header ref={comp}>
        <h2 className="nav-title" id="heading">
          !Shiv
        </h2>
        <nav className="main-nav" id="navbar">
          <div className="e">
            <a className="main-nav-link " href="#">
              Portfolio
            </a>
          </div>
          <div className="e">
            <a className="main-nav-link skills--link" href="#">
              Skills
            </a>
          </div>

          <div className="e">
            <a className="main-nav-link contact" href="#">
              Contact
            </a>
          </div>
        </nav>

        <button className="btn-mobile-nav">
          <IonIcon
            className="icon-mobile-nav"
            name="menu-outline"
            icon={menu}
          ></IonIcon>
          <IonIcon
            className="icon-mobile-nav"
            icon={close}
            name="close-outline"
          ></IonIcon>
        </button>
      </header>
    </>
  );
}
