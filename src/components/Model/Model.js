import { animate, useReducedMotion, useSpring } from 'framer-motion';
import { useInViewport } from 'hooks';
import {
  createRef,
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  AmbientLight,
  Color,
  DirectionalLight,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshDepthMaterial,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneBufferGeometry,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderTarget,
  WebGLRenderer,
  sRGBEncoding,
} from 'three';
import { HorizontalBlurShader, VerticalBlurShader } from 'three-stdlib';
import { resolveSrcFromSrcSet } from 'utils/image';
import { classes, cssProps, numToMs } from 'utils/style';
import {
  cleanRenderer,
  cleanScene,
  modelLoader,
  removeLights,
  textureLoader,
} from 'utils/three';
import styles from './Model.module.css';
import { ModelAnimationType } from './deviceModels';

const MeshType = {
  Frame: 'Frame',
  Logo: 'Logo',
  Screen: 'Screen',
};

const rotationSpringConfig = {
  stiffness: 40,
  damping: 20,
  mass: 1.4,
  restSpeed: 0.001,
};

export const Model = ({
  models,
  show = true,
  showDelay = 0,
  cameraPosition = { x: 0, y: 0, z: 8 },
  style,
  className,
  alt,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  const container = useRef();
  const canvas = useRef();
  const camera = useRef();
  const modelGroup = useRef();
  const scene = useRef();
  const renderer = useRef();
  const shadowGroup = useRef();
  const renderTarget = useRef();
  const renderTargetBlur = useRef();
  const shadowCamera = useRef();
  const depthMaterial = useRef();
  const horizontalBlurMaterial = useRef();
  const verticalBlurMaterial = useRef();
  const plane = useRef();
  const lights = useRef();
  const blurPlane = useRef();
  const fillPlane = useRef();
  const isInViewport = useInViewport(container, false, { threshold: 0.2 });
  const reduceMotion = useReducedMotion();
  const rotationX = useSpring(0, rotationSpringConfig);
  const rotationY = useSpring(0, rotationSpringConfig);

  useEffect(() => {
    const { clientWidth, clientHeight } = container.current;

    renderer.current = new WebGLRenderer({
      canvas: canvas.current,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: true,
    });

    renderer.current.setPixelRatio(2);
    renderer.current.setSize(clientWidth, clientHeight);
    renderer.current.outputEncoding = sRGBEncoding;
    renderer.current.physicallyCorrectLights = true;

    camera.current = new PerspectiveCamera(36, clientWidth / clientHeight, 0.1, 100);
    camera.current.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    scene.current = new Scene();

    modelGroup.current = new Group();
    scene.current.add(modelGroup.current);

    // Lighting
    const ambientLight = new AmbientLight(0xffffff, 0.3);
    const keyLight = new DirectionalLight(0xffffff, 1.1);
    const fillLight = new DirectionalLight(0xffffff, 0.3);
    const purpleRimLight = new DirectionalLight(0x9f6cf7, 4.0);
    const purpleBackLight = new DirectionalLight(0x8a2be2, 2.5);
    const purpleTopLight = new DirectionalLight(0xb66dff, 3.0);
    const purpleFillLight = new DirectionalLight(0x9f6cf7, 2.2);

    fillLight.position.set(4, 2, 2);
    keyLight.position.set(-2, 2, 1);
    purpleRimLight.position.set(-3, 4, -2);
    purpleBackLight.position.set(2, 1, -3);
    purpleTopLight.position.set(0, 5, -3);
    purpleFillLight.position.set(3, 3, 2);
    
    [keyLight, fillLight, purpleRimLight, purpleBackLight, purpleTopLight, purpleFillLight].forEach(light => {
      light.castShadow = true;
      light.shadow.bias = -0.001;
      light.shadow.mapSize.width = 512;
      light.shadow.mapSize.height = 512;
    });

    lights.current = [ambientLight, keyLight, fillLight, purpleRimLight, purpleBackLight, purpleTopLight, purpleFillLight];
    lights.current.forEach(light => scene.current.add(light));

    // The shadow container, if you need to move the plane just move this
    shadowGroup.current = new Group();
    scene.current.add(shadowGroup.current);
    shadowGroup.current.position.set(0, 0, -0.8);
    shadowGroup.current.rotateX(Math.PI / 2);

    const renderTargetSize = 512;
    const planeWidth = 8;
    const planeHeight = 8;
    const cameraHeight = 1.5;
    const shadowOpacity = 0.6;
    const shadowDarkness = 2;

    // The render target that will show the shadows in the plane texture
    renderTarget.current = new WebGLRenderTarget(renderTargetSize, renderTargetSize);
    renderTarget.current.texture.generateMipmaps = false;

    // The render target that we will use to blur the first render target
    renderTargetBlur.current = new WebGLRenderTarget(renderTargetSize, renderTargetSize);
    renderTargetBlur.current.texture.generateMipmaps = false;

    // Make a plane and make it face up
    const planeGeometry = new PlaneBufferGeometry(planeWidth, planeHeight).rotateX(
      Math.PI / 2
    );

    // Shadow plane material with adjusted properties
    const planeMaterial = new MeshBasicMaterial({
      map: renderTarget.current.texture,
      opacity: shadowOpacity,
      transparent: true,
      blending: 2,  // Normal blending
      depthWrite: false,  // Don't write to depth buffer
    });

    plane.current = new Mesh(planeGeometry, planeMaterial);
    // The y from the texture is flipped!
    plane.current.scale.y = -1;
    shadowGroup.current.add(plane.current);

    // The plane onto which to blur the texture
    blurPlane.current = new Mesh(planeGeometry);
    blurPlane.current.visible = false;
    shadowGroup.current.add(blurPlane.current);

    // Ground plane with adjusted properties
    const fillMaterial = new MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0,
      transparent: true,
      depthWrite: false,
    });

    fillPlane.current = new Mesh(planeGeometry, fillMaterial);
    fillPlane.current.rotateX(Math.PI);
    fillPlane.current.position.y -= 0.00001;
    shadowGroup.current.add(fillPlane.current);

    // The camera to render the depth material from
    shadowCamera.current = new OrthographicCamera(
      -planeWidth / 2,
      planeWidth / 2,
      planeHeight / 2,
      -planeHeight / 2,
      0,
      cameraHeight
    );
    // Get the camera to look up
    shadowCamera.current.rotation.x = Math.PI / 2;
    shadowGroup.current.add(shadowCamera.current);

    // Like MeshDepthMaterial, but goes from black to transparent
    depthMaterial.current = new MeshDepthMaterial();
    depthMaterial.current.userData.darkness = { value: shadowDarkness };
    depthMaterial.current.onBeforeCompile = shader => {
      shader.uniforms.darkness = depthMaterial.current.userData.darkness;
      shader.fragmentShader = `
        uniform float darkness;
        ${shader.fragmentShader.replace(
          'gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );',
          'gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * darkness );'
        )}
      `;
    };
    depthMaterial.current.depthTest = false;
    depthMaterial.current.depthWrite = false;

    horizontalBlurMaterial.current = new ShaderMaterial(HorizontalBlurShader);
    horizontalBlurMaterial.current.depthTest = false;

    verticalBlurMaterial.current = new ShaderMaterial(VerticalBlurShader);
    verticalBlurMaterial.current.depthTest = false;

    const unsubscribeX = rotationX.onChange(renderFrame);
    const unsubscribeY = rotationY.onChange(renderFrame);

    return () => {
      renderTarget.current.dispose();
      renderTargetBlur.current.dispose();
      removeLights(lights.current);
      cleanScene(scene.current);
      cleanRenderer(renderer.current);
      unsubscribeX();
      unsubscribeY();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const blurShadow = useCallback(amount => {
    blurPlane.current.visible = true;

    // Blur horizontally and draw in the renderTargetBlur
    blurPlane.current.material = horizontalBlurMaterial.current;
    blurPlane.current.material.uniforms.tDiffuse.value = renderTarget.current.texture;
    horizontalBlurMaterial.current.uniforms.h.value = amount * (1 / 256);

    renderer.current.setRenderTarget(renderTargetBlur.current);
    renderer.current.render(blurPlane.current, shadowCamera.current);

    // Blur vertically and draw in the main renderTarget
    blurPlane.current.material = verticalBlurMaterial.current;
    blurPlane.current.material.uniforms.tDiffuse.value = renderTargetBlur.current.texture;
    verticalBlurMaterial.current.uniforms.v.value = amount * (1 / 256);

    renderer.current.setRenderTarget(renderTarget.current);
    renderer.current.render(blurPlane.current, shadowCamera.current);

    blurPlane.current.visible = false;
  }, []);

  // Handle render passes for a single frame
  const renderFrame = useCallback(() => {
    const blurAmount = 5;

    // Remove the background
    const initialBackground = scene.current.background;
    scene.current.background = null;

    // Force the depthMaterial to everything
    // cameraHelper.visible = false;
    scene.current.overrideMaterial = depthMaterial.current;

    // Render to the render target to get the depths
    renderer.current.setRenderTarget(renderTarget.current);
    renderer.current.render(scene.current, shadowCamera.current);

    // And reset the override material
    scene.current.overrideMaterial = null;

    blurShadow(blurAmount);

    // A second pass to reduce the artifacts
    // (0.4 is the minimum blur amout so that the artifacts are gone)
    blurShadow(blurAmount * 0.4);

    // Reset and render the normal scene
    renderer.current.setRenderTarget(null);
    scene.current.background = initialBackground;

    modelGroup.current.rotation.x = rotationX.get();
    modelGroup.current.rotation.y = rotationY.get();

    renderer.current.render(scene.current, camera.current);
  }, [blurShadow, rotationX, rotationY]);

  // Handle mouse move animation
  useEffect(() => {
    const onMouseMove = event => {
      const { innerWidth, innerHeight } = window;

      const position = {
        x: (event.clientX - innerWidth / 2) / innerWidth,
        y: (event.clientY - innerHeight / 2) / innerHeight,
      };

      // Get the first model's rotation intensity or use default
      const intensity = models[0]?.rotationIntensity || 0.5;
      rotationY.set(position.x * intensity);
      rotationX.set(position.y * intensity);
    };

    if (isInViewport && !reduceMotion) {
      window.addEventListener('mousemove', onMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [isInViewport, reduceMotion, rotationX, rotationY, models]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!container.current) return;

      const { clientWidth, clientHeight } = container.current;

      renderer.current.setSize(clientWidth, clientHeight);
      camera.current.aspect = clientWidth / clientHeight;
      camera.current.updateProjectionMatrix();

      renderFrame();
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [renderFrame]);

  return (
    <div
      className={classes(styles.model, className)}
      data-loaded={loaded}
      style={cssProps({ delay: numToMs(showDelay) }, style)}
      ref={container}
      role="img"
      aria-label={alt}
      {...rest}
    >
      <canvas className={styles.canvas} ref={canvas} />
      {models.map((model, index) => (
        <Device
          key={JSON.stringify(model.position)}
          renderer={renderer}
          modelGroup={modelGroup}
          show={show}
          showDelay={showDelay}
          renderFrame={renderFrame}
          index={index}
          setLoaded={setLoaded}
          model={model}
        />
      ))}
    </div>
  );
};

const Device = ({
  renderer,
  model,
  modelGroup,
  renderFrame,
  index,
  showDelay,
  setLoaded,
  show,
}) => {
  const [loadDevice, setLoadDevice] = useState();
  const reduceMotion = useReducedMotion();
  const placeholderScreen = createRef();

  useEffect(() => {
    const applyScreenTexture = async (texture, node) => {
      texture.encoding = sRGBEncoding;
      texture.flipY = false;
      texture.anisotropy = renderer.current.capabilities.getMaxAnisotropy();
      texture.generateMipmaps = false;

      // Decode the texture to prevent jank on first render
      await renderer.current.initTexture(texture);

      node.material.color = new Color(0xffffff);
      node.material.transparent = true;
      node.material.map = texture;
    };

    // Generate promises to await when ready
    const load = async () => {
      const { texture, position, url } = model;
      let loadFullResTexture;
      let playAnimation;

      // Clean up any existing models first
      if (modelGroup.current) {
        modelGroup.current.children.forEach(child => {
          if (child.userData.type === model.type) {
            modelGroup.current.remove(child);
            child.traverse(node => {
              if (node.material) node.material.dispose();
              if (node.geometry) node.geometry.dispose();
            });
          }
        });
      }

      const [placeholder, gltf] = await Promise.all([
        await textureLoader.loadAsync(texture.placeholder.src),
        await modelLoader.loadAsync(url),
      ]);

      // Tag the model with its type for future cleanup
      gltf.scene.userData.type = model.type;
      modelGroup.current.add(gltf.scene);

      // Ensure proper initial position
      gltf.scene.position.set(position.x, position.y, position.z);
      gltf.scene.rotation.set(0, 0, 0);

      gltf.scene.traverse(async node => {
        if (node.material) {
          // Enhanced black material with better edge definition
          if (node.name === MeshType.Frame) {
            node.material.color = new Color(0x0a0a0a);
            node.material.metalness = 0.85;    // Slightly reduced metalness
            node.material.roughness = 0.2;     // Increased for better detail
            node.material.envMapIntensity = 2.5; // Increased for better reflections
            node.material.emissive = new Color(0x0a0a0a);
            node.material.emissiveIntensity = 0.2;  // Increased for better edges
            // Add subtle normal map intensity for surface detail
            if (node.material.normalScale) {
              node.material.normalScale.set(0.5, 0.5);
            }
          } else {
            node.material.color = new Color(0x0a0a0a);
            node.material.metalness = 0.75;    // Reduced for better detail
            node.material.roughness = 0.25;    // Increased for surface definition
            node.material.envMapIntensity = 2.0;  // Balanced reflections
          }
          node.material.needsUpdate = true;
          node.material.color.convertSRGBToLinear();
        }

        if (node.name === MeshType.Screen) {
          // Create a copy of the screen mesh with enhanced properties
          placeholderScreen.current = node.clone();
          placeholderScreen.current.material = node.material.clone();
          node.parent.add(placeholderScreen.current);
          placeholderScreen.current.material.opacity = 1;
          placeholderScreen.current.position.z += 0.001;

          // Screen material with enhanced visibility always on
          node.material.metalness = 0.0;
          node.material.roughness = 0.0;    // No roughness for clear image
          node.material.envMapIntensity = 0.0;  // Remove environment reflections
          node.material.emissive = new Color(0x000000);  // No emissive
          node.material.emissiveIntensity = 0.05;  // Slight constant emissive
          node.material.clearcoat = 0.0;     // Remove clearcoat
          node.material.clearcoatRoughness = 0.0;
          node.material.transparent = true;
          node.material.opacity = 1.0;      // Fully opaque

          // Remove hover effects since we want constant visibility
          applyScreenTexture(placeholder, placeholderScreen.current);

          loadFullResTexture = async () => {
            const image = await resolveSrcFromSrcSet(texture);
            const fullSize = await textureLoader.loadAsync(image);
            await applyScreenTexture(fullSize, node);

            animate(1, 0, {
              onUpdate: value => {
                if (placeholderScreen.current) {
                  placeholderScreen.current.material.opacity = value;
                  renderFrame();
                }
              },
              onComplete: () => {
                if (placeholderScreen.current && placeholderScreen.current.parent) {
                  placeholderScreen.current.parent.remove(placeholderScreen.current);
                  placeholderScreen.current.material.dispose();
                }
              },
            });
          };
        }
      });

      const targetPosition = new Vector3(position.x, position.y, position.z);

      if (reduceMotion) {
        gltf.scene.position.set(...targetPosition.toArray());
      }

      // Simple slide up animation
      if (model.animation === ModelAnimationType.SpringUp) {
        playAnimation = () => {
          const startPosition = new Vector3(
            targetPosition.x,
            targetPosition.y - 1,
            targetPosition.z
          );

          gltf.scene.position.set(...startPosition.toArray());

          animate(startPosition.y, targetPosition.y, {
            type: 'spring',
            delay: (300 * index + showDelay) / 1000,
            stiffness: 60,
            damping: 20,
            mass: 1,
            restSpeed: 0.0001,
            restDelta: 0.0001,
            onUpdate: value => {
              gltf.scene.position.y = value;
              renderFrame();
            },
          });
        };
      }

      // Swing the laptop lid open
      if (model.animation === ModelAnimationType.LaptopOpen) {
        playAnimation = () => {
          const frameNode = gltf.scene.children.find(
            node => node.name === MeshType.Frame
          );
          const startRotation = new Vector3(MathUtils.degToRad(90), 0, 0);
          const endRotation = new Vector3(0, 0, 0);

          gltf.scene.position.set(...targetPosition.toArray());
          frameNode.rotation.set(...startRotation.toArray());

          return animate(startRotation.x, endRotation.x, {
            type: 'spring',
            delay: (300 * index + showDelay + 300) / 1000,
            stiffness: 80,
            damping: 20,
            restSpeed: 0.0001,
            restDelta: 0.0001,
            onUpdate: value => {
              frameNode.rotation.x = value;
              renderFrame();
            },
          });
        };
      }

      // Float and rotate animation
      if (model.animation === ModelAnimationType.FloatAndRotate) {
        playAnimation = () => {
          if (!gltf?.scene) return;
          
          const startPosition = new Vector3(
            targetPosition.x,
            targetPosition.y - 2,
            targetPosition.z
          );

          gltf.scene.position.set(...startPosition.toArray());

          // Enhanced float animation
          return animate(startPosition.y, targetPosition.y, {
            type: 'spring',
            delay: (300 * index + showDelay) / 1000,
            stiffness: 40,
            damping: 12,
            mass: 1.2,
            restSpeed: 0.0001,
            restDelta: 0.0001,
            onUpdate: value => {
              if (!gltf?.scene) return;
              const time = Date.now();
              // Complex motion combining multiple sine waves
              const floatY = Math.sin(time * 0.003) * (model.floatIntensity || 0.4) +
                            Math.sin(time * 0.007) * (model.floatIntensity || 0.4) * 0.5;
              
              // Smooth rotation with multiple axes
              const rotationX = Math.sin(time * 0.002) * 0.05 * (model.rotationIntensity || 0.8);
              const rotationY = Math.sin(time * 0.003) * 0.15 * (model.rotationIntensity || 0.8);
              const rotationZ = Math.cos(time * 0.002) * 0.05 * (model.rotationIntensity || 0.8);

              gltf.scene.position.y = value + floatY;
              gltf.scene.rotation.x = rotationX;
              gltf.scene.rotation.y = rotationY;
              gltf.scene.rotation.z = rotationZ;
              renderFrame();
            },
          });
        };
      }

      // Smooth reveal animation
      if (model.animation === ModelAnimationType.SmoothReveal) {
        playAnimation = () => {
          if (!gltf?.scene) return;
          
          const frameNode = gltf.scene.children.find(
            node => node.name === MeshType.Frame
          );
          
          if (!frameNode) return;
          
          const startRotation = new Vector3(
            MathUtils.degToRad(160), // Reduced from 180 for faster start
            MathUtils.degToRad(5),   // Reduced rotation for consistency
            0                        // Removed initial tilt for stability
          );
          const endRotation = new Vector3(0, 0, 0);

          gltf.scene.position.set(...targetPosition.toArray());
          frameNode.rotation.set(...startRotation.toArray());

          // Simplified scale animation with faster timing
          gltf.scene.scale.set(0.98, 0.98, 0.98); // Less scale difference
          animate(0.98, 1, {
            type: 'spring',
            delay: (100 * index + showDelay) / 1000, // Reduced delay
            stiffness: 80,  // Increased stiffness
            damping: 20,    // Increased damping
            mass: 1,        // Reduced mass
            onUpdate: value => {
              if (!gltf?.scene) return;
              gltf.scene.scale.set(value, value, value);
            },
          });

          // Main opening animation
          return animate(startRotation.x, endRotation.x, {
            type: 'spring',
            delay: (100 * index + showDelay) / 1000, // Reduced delay
            stiffness: 80,    // Increased for snappier response
            damping: 20,      // Balanced damping
            mass: 1,          // Reduced mass for faster movement
            restSpeed: 0.001, // Increased rest speed
            restDelta: 0.001, // Increased rest delta
            onUpdate: value => {
              if (!frameNode || !gltf?.scene) return;
              
              // Simplified progress calculation
              const progress = 1 - (value / startRotation.x);
              
              // Basic rotation with reduced complexity
              frameNode.rotation.x = value;
              frameNode.rotation.y = startRotation.y * (1 - progress);
              
              // Simplified floating effect
              const floatY = Math.sin(Date.now() * 0.002) * 0.02 * progress;
              gltf.scene.position.y = targetPosition.y + floatY;
              
              renderFrame();
            },
          });
        };
      }

      return { loadFullResTexture, playAnimation };
    };

    setLoadDevice({ start: load });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loadDevice || !show) return;
    let animation;

    const onLoad = async () => {
      const { loadFullResTexture, playAnimation } = await loadDevice.start();

      setLoaded(true);

      if (!reduceMotion) {
        animation = playAnimation();
      }

      await loadFullResTexture();

      if (reduceMotion) {
        renderFrame();
      }
    };

    startTransition(() => {
      onLoad();
    });

    return () => {
      animation?.stop();
      // Clean up placeholder screen
      if (placeholderScreen.current && placeholderScreen.current.parent) {
        placeholderScreen.current.parent.remove(placeholderScreen.current);
        placeholderScreen.current.material.dispose();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadDevice, show]);
};
