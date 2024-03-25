import { IonIcon, IonMenuButton } from "@ionic/react";
import { menu, close } from "ionicons/icons";

export default function NavBar() {
  return (
    <>
      <div className="bg"></div>

      <header>
        <h2 className="nav-title">!Shiv</h2>
        <nav className="main-nav">
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
