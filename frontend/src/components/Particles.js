import { useEffect, useRef } from "react";
import { Renderer, Camera, Geometry, Program, Mesh } from "ogl";

// Define defaultColors at the very top of the module, before any other functions or component definitions.
const defaultColors = ["#ffffff", "#ffffff", "#ffffff"];

// Utility function to convert hex color to RGB array (0-1 range)
const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex.split("").map((c) => c + c).join("");
  }
  const int = parseInt(hex, 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  return [r, g, b];
};

// Vertex Shader for particle positioning and sizing
const vertex = /* glsl */ `
  attribute vec3 position;    // Base position of the particle
  attribute vec4 random;      // Random values unique to each particle
  attribute vec3 color;      // Color of the particle

  uniform mat4 modelMatrix;   // Transformation matrix for the particle mesh
  uniform mat4 viewMatrix;    // Camera's view matrix
  uniform mat4 projectionMatrix; // Camera's projection matrix
  uniform float uTime;        // Time uniform for animation
  uniform float uSpread;      // Controls the spread/scale of particle positions
  uniform float uBaseSize;    // Base size for gl_PointSize
  uniform float uSizeRandomness; // Randomness factor for particle size
  uniform vec2 uMouse;        // Normalized mouse coordinates (-1 to 1)
  uniform float uParticleHoverFactor; // Influence factor for mouse interaction

  varying vec4 vRandom;       // Pass random values to fragment shader
  varying vec3 vColor;        // Pass color to fragment shader

  void main() {
    vRandom = random;
    vColor = color;

    vec3 pos = position * uSpread; // Scale base position by spread

    // Apply time-based sinusoidal movement to particles for a dynamic effect
    float t = uTime;
    pos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    pos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    pos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);

    // Calculate screen-space position to determine mouse proximity
    vec4 screenPos = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
    screenPos.xy /= screenPos.w; // Normalize device coordinates for 2D distance calculation

    // Calculate distance to mouse in screen space
    float distToMouse = length(screenPos.xy - uMouse);
    // Determine influence based on proximity, smoothstep for falloff
    float influence = smoothstep(1.0, 0.0, distToMouse * 2.0); // Influence is 1 close to mouse, 0 far away

    // Push particles away from mouse based on influence and hover factor
    // Normalize direction vector and scale by influence and hover factor
    pos.xy += normalize(screenPos.xy - uMouse) * influence * uParticleHoverFactor * 0.1; // Small push factor

    // Transform particle position by model, view, and projection matrices
    vec4 mvPos = viewMatrix * modelMatrix * vec4(pos, 1.0);
    // Calculate point size based on distance from camera for perspective scaling
    gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

// Fragment Shader for particle appearance (color and alpha)
const fragment = /* glsl */ `
  precision highp float; // High precision for floats

  uniform float uTime;        // Time uniform from vertex shader
  uniform float uAlphaParticles; // Controls if particles have alpha blending
  varying vec4 vRandom;       // Random values from vertex shader
  varying vec3 vColor;        // Color from vertex shader

  void main() {
    vec2 uv = gl_PointCoord.xy; // Coordinates within the current point (0 to 1)
    float d = length(uv - vec2(0.5)); // Distance from center of the point

    // If alphaParticles is false (0), render solid circles
    if(uAlphaParticles < 0.5) {
      if(d > 0.5) { // Discard fragments outside the circle (creates sharp circle)
        discard;
      }
      // Apply color with a slight sinusoidal variation based on time and random values
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
    } else { // If alphaParticles is true (1), render soft-edged circles
      float circle = smoothstep(0.5, 0.4, d) * 0.8; // Smooth falloff for alpha, creating soft edges
      // Apply color with variation and calculated alpha
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
    }
  }
`;

// Main Particles React Component
const Particles = ({
  particleCount = 200,          // Number of particles
  particleSpread = 10,          // Controls initial distribution range of particles
  speed = 0.1,                  // Overall animation speed multiplier
  particleColors,               // Array of hex color strings for particles
  moveParticlesOnHover = false, // Enable/disable mouse interaction
  particleHoverFactor = 1,      // Strength of mouse influence
  alphaParticles = false,       // Enable/disable alpha blending for soft particles
  particleBaseSize = 100,       // Base size for particles in world units
  sizeRandomness = 1,           // Factor for randomizing particle sizes
  cameraDistance = 20,          // Z-distance of the camera from the origin
  disableRotation = false,      // Disable/enable overall scene rotation
  className,                    // Optional CSS class for the container div
}) => {
  const containerRef = useRef(null); // Ref for the DOM container element
  const mouseRef = useRef({ x: 0, y: 0 }); // Ref for normalized mouse coordinates (-1 to 1)

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initialize OGL Renderer
    const renderer = new Renderer({ antialias: true, depth: false, alpha: true }); // Antialiasing for smoother edges, alpha for transparency
    const gl = renderer.gl; // Get WebGL context
    container.appendChild(gl.canvas); // Append canvas to the container
    gl.clearColor(0, 0, 0, 0); // Set clear color to transparent black

    // Setup Camera
    const camera = new Camera(gl, { fov: 15 }); // Field of view
    camera.position.set(0, 0, cameraDistance); // Set camera Z position

    // Handle window resizing
    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height); // Update renderer size
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height }); // Update camera aspect ratio
    };
    window.addEventListener("resize", resize, false);
    resize(); // Initial resize call

    // Handle mouse movement for interaction
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      // Normalize mouse coordinates to -1 to 1 range, relative to the container
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1); // Y-axis is inverted in OGL
    };

    if (moveParticlesOnHover) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    // Prepare particle data for GLSL attributes
    const count = particleCount;
    const positions = new Float32Array(count * 3); // x, y, z for each particle
    const randoms = new Float32Array(count * 4);   // 4 random values for each particle (for noise/animation offset)
    const colors = new Float32Array(count * 3);    // r, g, b for each particle

    // Use defaultColors if particleColors is not provided or empty
    const palette = particleColors && particleColors.length > 0 ? particleColors : defaultColors;

    for (let i = 0; i < count; i++) {
      let x, y, z, len;
      // Generate random position within a sphere for a more distributed look
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        len = x * x + y * y + z * z;
      } while (len > 1 || len === 0); // Ensure points are inside unit sphere and not at origin
      const r = Math.cbrt(Math.random()); // Distribute points more evenly in sphere (cubed root of random)
      positions.set([x * r, y * r, z * r], i * 3); // Set position

      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4); // Fill 4 random values

      const col = hexToRgb(palette[Math.floor(Math.random() * palette.length)]); // Pick a random color from palette
      colors.set(col, i * 3); // Set color
    }

    // Create OGL Geometry
    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions }, // Vertex positions
      random: { size: 4, data: randoms },     // Random data for shaders
      color: { size: 3, data: colors },       // Color data
    });

    // Create OGL Program (shaders and uniforms)
    const program = new Program(gl, {
      vertex,   // Vertex shader source
      fragment, // Fragment shader source
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: particleSpread },
        uBaseSize: { value: particleBaseSize },
        uSizeRandomness: { value: sizeRandomness },
        uAlphaParticles: { value: alphaParticles ? 1 : 0 }, // Pass alphaParticles as a float uniform
        // FIX: Pass mouse coordinates as an array [x, y]
        uMouse: { value: [mouseRef.current.x, mouseRef.current.y] }, // Pass mouse coordinates as an array
        uParticleHoverFactor: { value: particleHoverFactor }, // Pass hover factor
      },
      transparent: true,  // Enable transparency
      depthTest: false,   // Disable depth testing for particles to render correctly regardless of z-order
    });

    // Create OGL Mesh (combines geometry and program)
    const particlesMesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    let animationFrameId;
    let lastTime = performance.now();
    let elapsed = 0; // Total elapsed time for animations

    // Animation loop function
    const update = (t) => {
      animationFrameId = requestAnimationFrame(update); // Request next frame
      const delta = t - lastTime; // Time since last frame
      lastTime = t;
      elapsed += delta * speed; // Accumulate elapsed time, scaled by speed prop

      program.uniforms.uTime.value = elapsed * 0.001; // Update time uniform in seconds

      // Smoothly interpolate mesh position towards mouse influence
      if (moveParticlesOnHover) {
        particlesMesh.position.x += ((-mouseRef.current.x * particleHoverFactor) - particlesMesh.position.x) * 0.1;
        particlesMesh.position.y += ((-mouseRef.current.y * particleHoverFactor) - particlesMesh.position.y) * 0.1;
      } else {
        // Smoothly reset position if hover is disabled
        particlesMesh.position.x += (0 - particlesMesh.position.x) * 0.1;
        particlesMesh.position.y += (0 - particlesMesh.position.y) * 0.1;
      }

      // Update uMouse uniform value in the loop
      program.uniforms.uMouse.value = [mouseRef.current.x, mouseRef.current.y];

      // Apply overall scene rotation if not disabled
      if (!disableRotation) {
        particlesMesh.rotation.x = Math.sin(elapsed * 0.0002) * 0.1;
        particlesMesh.rotation.y = Math.cos(elapsed * 0.0005) * 0.15;
        particlesMesh.rotation.z += 0.001 * speed; // Rotate around Z-axis, scaled by speed
      } else {
        particlesMesh.rotation.set(0, 0, 0); // Reset rotation if disabled
      }

      renderer.render({ scene: particlesMesh, camera }); // Render the scene
    };

    animationFrameId = requestAnimationFrame(update); // Start the animation loop

    // Cleanup function for useEffect
    return () => {
      window.removeEventListener("resize", resize); // Remove resize listener
      if (moveParticlesOnHover) {
        container.removeEventListener("mousemove", handleMouseMove); // Remove mouse listener
      }
      cancelAnimationFrame(animationFrameId); // Stop animation frame requests
      // Clean up WebGL canvas from DOM
      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
    };
    // Dependencies for useEffect to re-run effect when props change
  }, [
    particleCount,
    particleSpread,
    speed,
    moveParticlesOnHover,
    particleHoverFactor,
    alphaParticles,
    particleBaseSize,
    sizeRandomness,
    cameraDistance,
    disableRotation,
    particleColors // Include particleColors as a dependency
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      // Ensure the container itself fills the space and is behind content
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
};

export default Particles;
