import iphone11 from 'assets/iphone-11.glb';
import macbookPro from 'assets/macbook-pro.glb';

export const ModelAnimationType = {
  SpringUp: 'spring-up',
  LaptopOpen: 'laptop-open',
  FloatAndRotate: 'float-and-rotate',
  SmoothReveal: 'smooth-reveal'
};

// Progressive loading priorities
export const LoadPriority = {
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3
};

export const deviceModels = {
  phone: {
    url: iphone11,
    width: 374,
    height: 512,
    position: { x: 0, y: 0, z: 0 },
    animation: ModelAnimationType.FloatAndRotate,
    rotationIntensity: 0.8,
    floatIntensity: 0.4,
    hoverIntensity: 1.2,
    type: 'phone-model',
    priority: LoadPriority.HIGH,
    // Optimize geometry settings
    geometryOptimization: {
      simplify: true,
      targetTriangles: 15000,
      preserveTextures: true
    }
  },
  laptop: {
    url: macbookPro,
    width: 1280,
    height: 800,
    position: { x: 0, y: 0, z: 0 },
    animation: ModelAnimationType.SmoothReveal,
    rotationIntensity: 0.6,
    floatIntensity: 0.3,
    hoverIntensity: 1.5,
    type: 'laptop-model',
    priority: LoadPriority.HIGH,
    // Optimize geometry settings
    geometryOptimization: {
      simplify: true,
      targetTriangles: 20000,
      preserveTextures: true
    }
  },
};
