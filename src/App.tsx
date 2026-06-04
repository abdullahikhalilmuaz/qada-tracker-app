import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
} from "@ionic/react";
import { Route, Redirect, BrowserRouter } from "react-router-dom";
import {
  homeOutline,
  alarmOutline,
  statsChartOutline,
  settingsOutline,
  reorderThreeOutline,
} from "ionicons/icons";
import Home from "./pages/Home";
import Log from "./pages/Log";
import Alarms from "./pages/Alarms";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <>
      <IonTabs>
        <IonRouterOutlet>
          <BrowserRouter>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/home">
              <Home />
            </Route>
            <Route exact path="/log">
              <Log />
            </Route>
            <Route exact path="/alarms">
              <Alarms />
            </Route>
            <Route exact path="/stats">
              <Stats />
            </Route>
            <Route exact path="/settings">
              <Settings />
            </Route>
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
          </BrowserRouter>
        </IonRouterOutlet>

        <IonTabBar slot="bottom" className="qada-tab-bar">
          <IonTabButton tab="home" href="/home">
            <IonIcon icon={homeOutline} />
          </IonTabButton>
          <IonTabButton tab="log" href="/log">
            <IonIcon icon={reorderThreeOutline} />
          </IonTabButton>
          <IonTabButton tab="alarms" href="/alarms">
            <IonIcon icon={alarmOutline} />
          </IonTabButton>
          <IonTabButton tab="stats" href="/stats">
            <IonIcon icon={statsChartOutline} />
          </IonTabButton>
          <IonTabButton tab="settings" href="/settings">
            <IonIcon icon={settingsOutline} />
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </>
  );
}
