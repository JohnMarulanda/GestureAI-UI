import Background from '@/components/gesture/Background'
import CameraInterface from '@/components/gesture/CameraInterface'
import MacWindow from '@/components/gesture/MacWindow'
import NavigationDock from '@/components/gesture/NavigationDock'
import { MainHeading } from '@/components/gesture/Typography'
import React from 'react'
import '../../src/styles/animations.css'

const InteractiveSpace: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with abstract pattern */}
      <Background />
      {/* Content container */}
      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col min-h-screen">
        {/* Header section */}
        <div className="mb-8 float-animation">
          <MainHeading>Where Gestures Bring Ideas to Life</MainHeading>
        </div>
        {/* Main content section with camera and dock side by side */}
        <div className="flex-grow flex flex-col lg:flex-row gap-8">
          {/* Camera window section */}
          <div className="flex-grow">
            <MacWindow>
              <CameraInterface />
            </MacWindow>
          </div>

          {/* Dock positioned on the right */}
          <div className="flex items-center lg:items-start">
            <NavigationDock />
          </div>
        </div>
      </div>
    </div>
  )
}

export default InteractiveSpace
