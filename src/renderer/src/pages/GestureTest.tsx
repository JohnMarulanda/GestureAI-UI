import { motion } from 'framer-motion';
import { Camera, Settings, Save, Video, Trash2, Maximize2, RefreshCw, Sliders } from 'lucide-react';
import { Button } from '../components/Button';
import { useState, useEffect, useRef } from 'react';

const gestures = [
  { id: 1, name: 'Swipe Left', description: 'Swipe hand left to navigate back' },
  { id: 2, name: 'Zoom In', description: 'Pinch out to zoom into content' },
  { id: 3, name: 'Grab', description: 'Close hand to grab and move items' },
  { id: 4, name: 'Wave', description: 'Wave to trigger attention mode' },
  { id: 5, name: 'Peace', description: 'Peace sign to confirm actions' }
];

const tools = [
  { id: 1, name: 'Save Screenshot', icon: Save },
  { id: 2, name: 'Record Video', icon: Video },
  { id: 3, name: 'Clear Overlay', icon: Trash2 },
  { id: 4, name: 'Fullscreen', icon: Maximize2 }
];

export default function GestureTest() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isMirrored, setIsMirrored] = useState(false); // Estado para el espejo
  const videoRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      setIsCameraOpen(false);
    }
  };

  const toggleMirror = () => {
    setIsMirrored(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Left Sidebar */}
      <aside className="w-1/4 min-w-[250px] border-r border-gray-700 p-4 flex flex-col gap-6 overflow-y-auto">
        {/* Gestures Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Available Gestures
          </h2>
          <ul className="space-y-2" role="list" aria-label="Gesture list">
            {gestures.map((gesture) => (
              <motion.li
                key={gesture.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 cursor-pointer transition-colors"
                role="button"
                tabIndex={0}
              >
                <h3 className="font-medium">{gesture.name}</h3>
                <p className="text-sm text-gray-400">{gesture.description}</p>
              </motion.li>
            ))}
          </ul>
        </section>

        {/* Tools Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Tools
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                icon={tool.icon}
                variant="outline"
                className="w-full justify-start gap-2 px-3 py-2"
                aria-label={tool.name}
              >
                {tool.name}
              </Button>
            ))}
          </div>
        </section>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col gap-6">
        {/* Camera Preview */}
        <div
          className="relative aspect-video bg-gray-800 rounded-xl flex items-center justify-center border-2 border-gray-700 cursor-pointer"
          role="region"
          aria-label="Camera preview"
          onClick={() => !isCameraOpen ? startCamera() : stopCamera()}
        >
          <div className="text-center">
            <Camera className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">Live Camera Preview</p>
          </div>
          <video
            ref={videoRef}
            autoPlay
            muted
            className={`absolute inset-0 w-full h-full object-cover rounded-xl ${isMirrored ? 'transform scale-x-[-1]' : ''}`}
          ></video>
        </div>

        {/* Camera Controls */}
        <div className="bg-gray-800 rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Sliders className="w-5 h-5" />
            Camera Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Device Selection */}
            <div className="space-y-2">
              <label htmlFor="camera-select" className="block text-sm font-medium text-gray-300">
                Camera Device
              </label>
              <select
                id="camera-select"
                className="w-full bg-gray-700 rounded-lg border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option>Select a camera device...</option>
              </select>
            </div>

            {/* Mirror Toggle */}
            <div className="space-y-2">
              <label htmlFor="mirror-toggle" className="block text-sm font-medium text-gray-300">
                Mirror View
              </label>
              <Button
                id="mirror-toggle"
                icon={RefreshCw}
                variant="outline"
                className="w-full justify-center"
                onClick={toggleMirror} // Cambia el estado al hacer click
                aria-pressed={isMirrored ? "true" : "false"}
              >
                Toggle Mirror
              </Button>
            </div>

            {/* Brightness Slider */}
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="brightness-slider" className="block text-sm font-medium text-gray-300">
                Brightness
              </label>
              <input
                type="range"
                id="brightness-slider"
                min="0"
                max="100"
                defaultValue="50"
                className="w-full accent-purple-500"
                aria-label="Adjust brightness"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
