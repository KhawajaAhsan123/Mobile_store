import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

const AnimatedBackground: React.FC = () => {
  const { theme } = useTheme();

  const getBackgroundClass = () => {
    return 'bg-gradient-to-br from-gray-900 via-purple-900 to-slate-800';
  };

  const floatingShapes = [
    { id: 1, size: 300, top: '10%', left: '10%', delay: 0, color: 'rgba(147, 51, 234, 0.05)' },
    { id: 2, size: 200, top: '60%', left: '80%', delay: 2, color: 'rgba(59, 130, 246, 0.05)' },
    { id: 3, size: 150, top: '80%', left: '20%', delay: 4, color: 'rgba(236, 72, 153, 0.05)' },
    { id: 4, size: 250, top: '30%', left: '60%', delay: 1, color: 'rgba(34, 197, 94, 0.05)' },
    { id: 5, size: 180, top: '50%', left: '40%', delay: 3, color: 'rgba(251, 146, 60, 0.05)' },
    { id: 6, size: 120, top: '25%', left: '70%', delay: 5, color: 'rgba(168, 85, 247, 0.04)' },
    { id: 7, size: 100, top: '70%', left: '30%', delay: 6, color: 'rgba(217, 70, 239, 0.04)' },
  ];

  const darkFloatingShapes = [
    { id: 1, size: 300, top: '10%', left: '10%', delay: 0, color: 'rgba(147, 51, 234, 0.1)' },
    { id: 2, size: 200, top: '60%', left: '80%', delay: 2, color: 'rgba(59, 130, 246, 0.1)' },
    { id: 3, size: 150, top: '80%', left: '20%', delay: 4, color: 'rgba(236, 72, 153, 0.1)' },
    { id: 4, size: 250, top: '30%', left: '60%', delay: 1, color: 'rgba(34, 197, 94, 0.1)' },
    { id: 5, size: 180, top: '50%', left: '40%', delay: 3, color: 'rgba(251, 146, 60, 0.1)' },
    { id: 6, size: 120, top: '25%', left: '70%', delay: 5, color: 'rgba(168, 85, 247, 0.08)' },
    { id: 7, size: 100, top: '70%', left: '30%', delay: 6, color: 'rgba(217, 70, 239, 0.08)' },
  ];

  const shapes = theme === 'dark' ? darkFloatingShapes : floatingShapes;

  // Additional transparent geometric shapes
  const geometricShapes = [
    { id: 'g1', type: 'triangle', size: 80, top: '15%', left: '85%', delay: 1, color: 'rgba(147, 51, 234, 0.03)' },
    { id: 'g2', type: 'square', size: 60, top: '75%', left: '15%', delay: 3, color: 'rgba(59, 130, 246, 0.03)' },
    { id: 'g3', type: 'hexagon', size: 70, top: '45%', left: '75%', delay: 2, color: 'rgba(236, 72, 153, 0.03)' },
    { id: 'g4', type: 'circle', size: 50, top: '25%', left: '50%', delay: 4, color: 'rgba(34, 197, 94, 0.03)' },
    { id: 'g5', type: 'diamond', size: 90, top: '65%', left: '35%', delay: 5, color: 'rgba(251, 146, 60, 0.03)' },
  ];

  const renderGeometricShape = (shape: any) => {
    const baseStyle = {
      position: 'absolute' as const,
      width: shape.size,
      height: shape.size,
      top: shape.top,
      left: shape.left,
      backgroundColor: shape.color,
      opacity: 0.6,
    };

    switch (shape.type) {
      case 'triangle':
        return (
          <div
            style={{
              ...baseStyle,
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            }}
          />
        );
      case 'square':
        return <div style={{ ...baseStyle, borderRadius: '8px' }} />;
      case 'hexagon':
        return (
          <div
            style={{
              ...baseStyle,
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%)',
            }}
          />
        );
      case 'diamond':
        return (
          <div
            style={{
              ...baseStyle,
              transform: 'rotate(45deg)',
              borderRadius: '8px',
            }}
          />
        );
      default:
        return <div style={{ ...baseStyle, borderRadius: '50%' }} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-slate-800 transition-all duration-1000 ease-in-out">
      {/* Animated overlay patterns */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Geometric shapes with transparency */}
        {geometricShapes.map((shape) => (
          <motion.div
            key={shape.id}
            animate={{
              x: [0, 100, -50, 50, -100, 0],
              y: [0, -50, 30, -30, 50, 0],
              rotate: [0, 90, 180, 270, 360, 0],
              opacity: [0.2, 0.4, 0.3, 0.5, 0.3, 0.2],
            }}
            transition={{
              duration: 20 + shape.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {renderGeometricShape(shape)}
          </motion.div>
        ))}

        {/* Animated floating shapes */}
        {shapes.map((shape) => (
          <motion.div
            key={shape.id}
            className="absolute rounded-full blur-xl"
            style={{
              width: shape.size,
              height: shape.size,
              top: shape.top,
              left: shape.left,
              backgroundColor: shape.color,
            }}
            animate={{
              x: [0, 150, -100, 100, -150, 0],
              y: [0, -80, 60, -60, 80, 0],
              scale: [1, 1.3, 0.7, 1.2, 0.8, 1],
              rotate: [0, 180, 360, 180, 360, 0],
              opacity: [0.3, 0.6, 0.4, 0.7, 0.5, 0.3],
            }}
            transition={{
              duration: 15 + shape.delay * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Dark theme specific overlays */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                            radial-gradient(circle at 40% 20%, rgba(255, 219, 98, 0.2) 0%, transparent 50%)`,
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Additional transparent overlays */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 20% 30%, rgba(147, 51, 234, 0.02) 0%, transparent 50%)',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 50%', '50% 100%', '0% 0%'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.02) 0%, transparent 50%)',
          }}
          animate={{
            backgroundPosition: ['100% 100%', '0% 50%', '50% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 80%, rgba(236, 72, 153, 0.02) 0%, transparent 50%)',
          }}
          animate={{
            backgroundPosition: ['50% 50%', '100% 0%', '0% 100%', '50% 50%'],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.1 + Math.random() * 0.2,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100, 0],
              y: [0, Math.random() * 200 - 100, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      {/* Subtle animated grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
