import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { RadialMenu } from './components/RadialMenu'
import HelpSupportV2 from './pages/HelpSupportV2'
import IntroAnimation from './pages/IntroAnimation'

import ControlPanel from './pages/ControlPanel'
import GestureSettings from './pages/GestureSeettings'
import GestureTesting from './pages/GestureTesting'
import LandingPage2 from './pages/LandingPage'
import SettingsInterface from './pages/Settings2'

function App(): JSX.Element {
  return (
    <BrowserRouter>
      {/* RadialMenu se mostrará en las páginas especificadas */}
      <RadialMenu />

      <Routes>
        <Route path="/" element={<IntroAnimation />} />
        <Route path="/home" element={<LandingPage2 />} />

        <Route path="/detection-test" element={<GestureTesting />} />
        <Route path="/detection-settings" element={<GestureSettings />} />

        <Route path="/settings" element={<SettingsInterface />} />

        <Route path="/help" element={<HelpSupportV2 />} />
        <Route path="/control-panel" element={<ControlPanel />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
