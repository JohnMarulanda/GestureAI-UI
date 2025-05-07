import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from "./layouts/MainLayout";
import ControlPanel from "./pages/ControlPanel";
import GestureTest from "./pages/GestureTest";
import HelpSupport from "./pages/HelpSupport";
import LandingScreen from "./pages/LandingScreen";
import Settings from "./pages/Settings";

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingScreen />} />
          <Route path="detection" element={<GestureTest />} />
          <Route path="control" element={<ControlPanel />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<HelpSupport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
