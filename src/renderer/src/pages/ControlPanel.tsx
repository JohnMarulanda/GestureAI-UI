'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import { MotionValue, animate, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Hand, Layout, RotateCw, Settings, Sparkles, Star, Zap } from 'lucide-react';
import { ReactNode, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SCALE = 2.25; // Factor máximo de escala de un icono
const DISTANCE = 110; // Píxeles antes de que el mouse afecte a un icono
const NUDGE = 40; // Píxeles que los iconos se alejan del mouse
const SPRING = {
    mass: 0.1,
    stiffness: 170,
    damping: 12,
};

export default function ControlPanel() {
    const navigate = useNavigate();
    const mouseLeft = useMotionValue(-Infinity);
    const mouseRight = useMotionValue(-Infinity);
    const left = useTransform(mouseLeft, [0, 40], [0, -40]);
    const right = useTransform(mouseRight, [0, 40], [0, -40]);
    const leftSpring = useSpring(left, SPRING);
    const rightSpring = useSpring(right, SPRING);

    const APPS = [
        { label: 'Detección', icon: Hand, path: '/detection' },
        { label: 'Gestos', icon: Sparkles, path: '/gestures' },
        { label: 'Acciones', icon: Zap, path: '/actions' },
        { label: 'Favoritos', icon: Star, path: '/favorites' },
        { label: 'Inicio', icon: Layout, path: '/' },
        { label: 'Más Apps', icon: ArrowRight, path: '/more-apps' },
        { label: 'Configuración', icon: Settings, path: '/settings' },
        { label: 'Rotar Dock', icon: RotateCw, path: '/rotate' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white p-8 relative overflow-hidden select-none drag">
            <div className="relative z-10 max-w-7xl mx-auto">

                <Tooltip.Provider delayDuration={0}>
                    <motion.div
                        onMouseMove={(e) => {
                            const { left, right } = e.currentTarget.getBoundingClientRect();
                            const offsetLeft = e.clientX - left;
                            const offsetRight = right - e.clientX;
                            mouseLeft.set(offsetLeft);
                            mouseRight.set(offsetRight);
                        }}
                        onMouseLeave={() => {
                            mouseLeft.set(-Infinity);
                            mouseRight.set(-Infinity);
                        }}
                        className="mx-auto hidden h-20 items-end gap-4 px-4 pb-4 sm:flex relative w-fit"
                    >
                        <motion.div
                            className="absolute rounded-2xl inset-y-0 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 -z-10"
                            style={{ left: leftSpring, right: rightSpring }}
                        />

                        {APPS.map((app, i) => (
                            <AppIcon key={i} mouseLeft={mouseLeft} onClick={() => navigate(app.path)}>
                                <app.icon className="w-7 h-7 text-gray-900" />
                                {app.label}
                            </AppIcon>
                        ))}
                    </motion.div>

                    <div className="sm:hidden">
                        <div className="mx-auto flex h-16 max-w-full items-end gap-4 overflow-x-scroll rounded-2xl bg-gray-700/50 backdrop-blur-sm px-4 pb-3">
                            {APPS.map((app, i) => (
                                <button
                                    key={i}
                                    onClick={() => navigate(app.path)}
                                    className="aspect-square w-10 flex-shrink-0 rounded-full bg-white/90 flex items-center justify-center"
                                >
                                    <app.icon className="w-7 h-7 text-gray-900" />
                                </button>
                            ))}
                        </div>
                    </div>
                </Tooltip.Provider>
            </div>
        </div>
    );
}

function AppIcon({
    mouseLeft,
    children,
    onClick,
}: {
    mouseLeft: MotionValue;
    children: ReactNode;
    onClick: () => void;
}) {
    const ref = useRef<HTMLButtonElement>(null);

    const distance = useTransform(() => {
        const bounds = ref.current
            ? { x: ref.current.offsetLeft, width: ref.current.offsetWidth }
            : { x: 0, width: 0 };

        return mouseLeft.get() - bounds.x - bounds.width / 2;
    });

    const scale = useTransform(distance, [-DISTANCE, 0, DISTANCE], [1, SCALE, 1]);
    const x = useTransform(() => {
        const d = distance.get();
        if (d === -Infinity) {
            return 0;
        } else if (d < -DISTANCE || d > DISTANCE) {
            return Math.sign(d) * -1 * NUDGE;
        } else {
            return (-d / DISTANCE) * NUDGE * scale.get();
        }
    });

    const scaleSpring = useSpring(scale, SPRING);
    const xSpring = useSpring(x, SPRING);
    const y = useMotionValue(0);

    return (
        <Tooltip.Root>
            <Tooltip.Trigger asChild>
                <motion.button
                    ref={ref}
                    style={{ x: xSpring, scale: scaleSpring, y }}
                    onClick={() => {
                        onClick();
                        animate(y, [0, -40, 0], {
                            repeat: 2,
                            ease: [
                                [0, 0, 0.2, 1],
                                [0.8, 0, 1, 1],
                            ],
                            duration: 0.7,
                        });
                    }}
                    className="aspect-square block w-12 rounded-full bg-white/90 shadow origin-bottom flex items-center justify-center no-drag"
                >
                    {Array.isArray(children) ? children[0] : children}
                </motion.button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
                <Tooltip.Content
                    sideOffset={10}
                    className="bg-gray-700 shadow shadow-black/20 border border-gray-600/50 px-2 py-1.5 text-sm rounded text-white font-medium z-50"
                >
                    {Array.isArray(children) ? children[1] : null}
                    <Tooltip.Arrow />
                </Tooltip.Content>
            </Tooltip.Portal>
        </Tooltip.Root>
    );
}


