import { useTheme } from 'components/ThemeProvider';
import { Transition } from 'components/Transition';
import { useReducedMotion, useSpring } from 'framer-motion';
import { useInViewport, useWindowSize } from 'hooks';
import { startTransition, useEffect, useRef, useState } from 'react';
import {
  AmbientLight,
  Color,
  DirectionalLight,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  SphereBufferGeometry,
  UniformsUtils,
  Vector2,
  WebGLRenderer,
  sRGBEncoding,
} from 'three';
import { media, rgbToThreeColor } from 'utils/style';
import { cleanRenderer, cleanScene, removeLights } from 'utils/three';
import styles from './DisplacementSphere.module.css';
import fragShader from './displacementSphereFragment.glsl';
import vertShader from './displacementSphereVertex.glsl';
import song from '../../assets/song.mp3';

const springConfig = {
  stiffness: 30,
  damping: 20,
  mass: 2,
};

export const DisplacementSphere = (props) => {
  const theme = useTheme();
  const { rgbBackground, themeId, colorWhite } = theme;
  const start = useRef(Date.now());
  const canvasRef = useRef();
  const mouse = useRef();
  const renderer = useRef();
  const camera = useRef();
  const scene = useRef();
  const lights = useRef();
  const uniforms = useRef();
  const material = useRef();
  const geometry = useRef();
  const sphere = useRef();
  const reduceMotion = useReducedMotion();
  const isInViewport = useInViewport(canvasRef);
  const windowSize = useWindowSize();
  const rotationX = useSpring(0, springConfig);
  const rotationY = useSpring(0, springConfig);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [barOpacity, setBarOpacity] = useState(6);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio(song);
      const storedCurrentTime = localStorage.getItem('audioCurrentTime');
      const storedIsPlaying = localStorage.getItem('audioIsPlaying');

      if (storedCurrentTime) {
        audioRef.current.currentTime = parseFloat(storedCurrentTime);
        setCurrentTime(parseFloat(storedCurrentTime));
      }
      if (storedIsPlaying === 'true') {
        audioRef.current.play().catch((error) => console.error("Audio playback failed:", error));
        setIsPlaying(true);
        setBarOpacity(0.1);
      }
    }

    return () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
        audioRef.current.pause();
        localStorage.setItem('audioCurrentTime', audioRef.current.currentTime);
        localStorage.setItem('audioIsPlaying', isPlaying);
      }
    };
  }, []);

  const toggleAudioPlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setBarOpacity(0.85);
      } else {
        audioRef.current.currentTime = currentTime;
        audioRef.current.play().catch((error) => console.error("Audio playback failed:", error));
        setBarOpacity(0.7);
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Three.js Initialization
  useEffect(() => {
    const { innerWidth, innerHeight } = window;
    mouse.current = new Vector2(0.8, 0.5);
    renderer.current = new WebGLRenderer({
      canvas: canvasRef.current,
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: true,
    });
    renderer.current.setSize(innerWidth, innerHeight);
    renderer.current.setPixelRatio(window.devicePixelRatio);
    renderer.current.outputEncoding = sRGBEncoding;

    camera.current = new PerspectiveCamera(54, innerWidth / innerHeight, 0.1, 100);
    camera.current.position.z = 52;

    scene.current = new Scene();

    material.current = new MeshPhongMaterial();
    material.current.onBeforeCompile = (shader) => {
      uniforms.current = UniformsUtils.merge([
        shader.uniforms,
        { time: { type: 'f', value: 0 }, isPlaying: { value: isPlaying } },
      ]);

      shader.uniforms = uniforms.current;
      shader.vertexShader = vertShader;
      shader.fragmentShader = fragShader;
    };

    startTransition(() => {
      geometry.current = new SphereBufferGeometry(32, 128, 128);
      sphere.current = new Mesh(geometry.current, material.current);
      sphere.current.position.z = 0;
      sphere.current.modifier = Math.random();
      scene.current.add(sphere.current);
    });

    return () => {
      cleanScene(scene.current);
      cleanRenderer(renderer.current);
    };
  }, []);

  useEffect(() => {
    const dirLight = new DirectionalLight(colorWhite, 0.6);
    const ambientLight = new AmbientLight(colorWhite, themeId === 'light' ? 0.8 : 0.1);

    dirLight.position.set(100, 100, 200);
    lights.current = [dirLight, ambientLight];
    scene.current.background = new Color(...rgbToThreeColor(rgbBackground));
    lights.current.forEach(light => scene.current.add(light));

    return () => {
      removeLights(lights.current);
    };
  }, [rgbBackground, colorWhite, themeId]);

  useEffect(() => {
    const { width, height } = windowSize;
    const adjustedHeight = height + height * 0.3;

    renderer.current.setSize(width, adjustedHeight);
    camera.current.aspect = width / adjustedHeight;
    camera.current.updateProjectionMatrix();

    if (width <= media.mobile) {
      sphere.current.position.set(14, 10, 0);
    } else if (width <= media.tablet) {
      sphere.current.position.set(18, 14, 0);
    } else {
      sphere.current.position.set(22, 16, 0);
    }
  }, [windowSize]);

  useEffect(() => {
    let animation;

    const animate = () => {
      animation = requestAnimationFrame(animate);

      if (uniforms.current) {
        uniforms.current.time.value = 0.00005 * (Date.now() - start.current);
        uniforms.current.isPlaying.value = isPlaying;
      }

      if (sphere.current) {
        sphere.current.rotation.z += isPlaying ? 0.04 : 0.001;
        sphere.current.rotation.x = rotationX.get();
        sphere.current.rotation.y = rotationY.get();
      }

      renderer.current.render(scene.current, camera.current);
    };

    if (!reduceMotion && isInViewport) {
      animate();
    } else {
      renderer.current.render(scene.current, camera.current);
    }

    return () => {
      cancelAnimationFrame(animation);
    };
  }, [isInViewport, reduceMotion, rotationX, rotationY, isPlaying]);

  // Fix for mouse movement
  useEffect(() => {
    const onMouseMove = (event) => {
      const position = {
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
      };

      // Update the sphere's rotation based on mouse position
      rotationX.set(position.y * 0.7 - 1);  // Adjusted for better control
      rotationY.set(position.x * 0.7 - 1);  // Adjusted for better control
    };

    if (!reduceMotion && isInViewport) {
      window.addEventListener('mousemove', onMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [isInViewport, reduceMotion, rotationX, rotationY]);

  return (
    <Transition in timeout={3000}>
      {visible => (
        <>
          <canvas
            aria-hidden
            className={styles.canvas}
            data-visible={visible}
            ref={canvasRef}
            {...props}
          />
          <div
            onClick={toggleAudioPlayback}
            style={{
              position: 'fixed',
              top: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '50%',
              height: '60px',
              background: 'linear-gradient(90deg, black, #ADD8E6, white)', // Light blue gradient
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 20px',
              color: 'black',
              zIndex: 10,
              border: isPlaying ? '2px solid #333' : 'none', // Darker border when playing
              opacity: barOpacity,
              cursor: 'pointer',
              borderRadius: '30px',
              transition: 'border 0.3s ease, opacity 0.3s ease',
            }}
          >
            <span style={{ color: 'black', fontSize: '18px', fontWeight: 'bold' }}>
              {isPlaying ? 'Pause' : 'Play Music?'}
            </span>
          </div>
        </>
      )}
    </Transition>
  );
};
