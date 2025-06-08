import { HashRouter as Router, Route, Routes } from 'react-router-dom'

import { RadialMenu } from './components/MenuDock'
import HelpSupportV2 from './pages/HelpSupport'
import IntroAnimation from './pages/IntroAnimation'

import ControlPanel from './pages/ControlPanel'
import InfoGestures from './pages/InfoGestures'
import GestureTesting from './pages/GestureTesting'
import LandingPage from './pages/LandingPage'
import SettingsInterface from './pages/Settings'

function App(): JSX.Element {
  return (
    <Router>
      {/* RadialMenu se mostrará en las páginas especificadas */}
      <RadialMenu />

      <Routes>
        <Route path="/" element={<IntroAnimation />} />
        <Route path="/home" element={<LandingPage />} />

        <Route path="/detection-test" element={<GestureTesting />} />
        <Route path="/detection-info" element={<InfoGestures />} />

        <Route path="/settings" element={<SettingsInterface />} />

        <Route path="/help" element={<HelpSupportV2 />} />
        <Route path="/control-panel" element={<ControlPanel />} />
      </Routes>
    </Router>
  )
}

export default App
