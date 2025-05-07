import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface GestureCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
}

export function GestureCard({ name, description, icon: Icon }: GestureCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="group bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
          <Icon className="w-6 h-6 text-purple-400 group-hover:text-purple-300" />
        </div>
        <h3 className="text-xl font-semibold text-white group-hover:text-purple-200 transition-colors">
          {name}
        </h3>
      </div>
      <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{description}</p>
    </motion.div>
  );
}