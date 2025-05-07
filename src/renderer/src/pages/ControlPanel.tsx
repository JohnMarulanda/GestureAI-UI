import { Hand, HelpCircle, Layout, RotateCcw, Settings } from 'lucide-react';
import { Dock } from 'primereact/dock';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ControlPanel() {
    const navigate = useNavigate();
    const [position, setPosition] = useState<'bottom' | 'top' | 'left' | 'right'>('bottom');

    const items = [
        {
            label: 'Detección',
            icon: () => <Hand className="w-6 h-6" />,
            command: () => navigate('/detection')
        },
        {
            label: 'Configuración',
            icon: () => <Settings className="w-6 h-6" />,
            command: () => navigate('/settings')
        },
        {
            label: 'Ayuda',
            icon: () => <HelpCircle className="w-6 h-6" />,
            command: () => navigate('/help')
        },
        {
            label: 'Inicio',
            icon: () => <Layout className="w-6 h-6" />,
            command: () => navigate('/')
        },
        {
            label: 'Rotar Dock',
            icon: () => <RotateCcw className="w-6 h-6" />,
            command: () => {
                const positions: Array<'bottom' | 'top' | 'left' | 'right'> = ['bottom', 'right', 'top', 'left'];
                const currentIndex = positions.indexOf(position);
                const nextIndex = (currentIndex + 1) % positions.length;
                setPosition(positions[nextIndex]);
            }
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white p-8 relative overflow-hidden">
            <div className="relative z-10 max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600">
                    Panel de Control
                </h1>

                <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                    <p className="text-xl text-gray-300 text-center">
                        Utiliza el dock para navegar entre las diferentes secciones.
                        <br />
                        Puedes rotar la posición del dock usando el botón de rotación.
                    </p>
                </div>

                <Dock
                    model={items}
                    position={position}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-2 hover:bg-gray-700/50 transition-colors duration-200"
                    style={{
                        '--dock-item-hover-bg': 'rgba(107, 114, 128, 0.3)',
                        '--dock-item-active-bg': 'rgba(139, 92, 246, 0.3)',
                        '--dock-item-width': '3rem',
                        '--dock-item-height': '3rem'
                    }}
                />
            </div>
        </div>
    );
}