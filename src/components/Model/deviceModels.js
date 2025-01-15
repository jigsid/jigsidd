import iphone11 from 'assets/iphone-11.glb';
import macbookPro from 'assets/macbook-pro.glb';

export const ModelAnimationType = {
  SpringUp: 'spring-up',
  LaptopOpen: 'laptop-open',
  FloatAndRotate: 'float-and-rotate',
  SmoothReveal: 'smooth-reveal'
};

export const deviceModels = {
  phone: {
    url: iphone11,
    width: 374,
    height: 512,
    position: { x: 0, y: 0, z: 0 },
    animation: ModelAnimationType.FloatAndRotate,
    rotationIntensity: 0.5,
    floatIntensity: 0.2
  },
  laptop: {
    url: macbookPro,
    width: 1280,
    height: 800,
    position: { x: 0, y: 0, z: 0 },
    animation: ModelAnimationType.SmoothReveal,
    rotationIntensity: 0.3,
    floatIntensity: 0.1
  },
};
