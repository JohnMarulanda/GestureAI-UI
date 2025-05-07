import { motion } from 'framer-motion';
import { Hand, HandCoins, HandMetal, Handshake, Layout, Sparkles, ThumbsUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { GestureCard } from '../components/GestureCard';

const gestures = [
  {
    id: 1,
    name: 'Wave',
    description: 'Wave your hand to interact with the interface',
    icon: HandCoins
  },
  {
    id: 2,
    name: 'Swipe',
    description: 'Swipe left or right to navigate between screens',
    icon: Sparkles
  },
  {
    id: 3,
    name: 'Rock',
    description: 'Make a rock gesture to select and confirm actions',
    icon: HandMetal
  },
  {
    id: 4,
    name: 'Thumbs Up',
    description: 'Give a thumbs up to approve or proceed',
    icon: ThumbsUp
  },
  {
    id: 5,
    name: 'Peace',
    description: 'Make a peace sign to trigger special actions',
    icon: Handshake
  }
  ,
  {
    id: 6,
    name: 'Closed Fist',
    description: 'Make a closed fist to mute special actions',
    icon: Handshake
  }
];

export default function LandingScreen() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white p-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center mb-16 space-y-6"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600"
          >
            Welcome to GestureAI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Control your computer naturally with hand gestures. Experience the future of human-computer interaction.
          </motion.p>
        </motion.div>

        {/* Gestures Grid */}
        <div className="max-w-6xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {gestures.map((gesture, index) => (
              <motion.div
                key={gesture.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
              >
                <GestureCard
                  name={gesture.name}
                  description={gesture.description}
                  icon={gesture.icon}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="text-center space-y-4"
        >
          <Button
            icon={Hand}
            size="lg"
            onClick={() => navigate('/detection')}
            className="mb-4"
          >
            Say HI, with your hand! to start!
          </Button>
          <Button
            icon={Layout}
            size="lg"
            variant="secondary"
            onClick={() => navigate('/control')}
          >
            Abrir Panel de Control
          </Button>
        </motion.div>
      </div>
    </div>
  );
}