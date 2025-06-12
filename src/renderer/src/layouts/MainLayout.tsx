import { Outlet } from 'react-router-dom'
import { RadialMenu } from '../components/MenuDock'

export default function MainLayout() {
  return (
    <div className="relative min-h-screen">
      <RadialMenu />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
