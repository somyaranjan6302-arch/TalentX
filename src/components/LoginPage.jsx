import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
} from 'lucide-react';
import './LoginPage.css';

const continents = [
  [[0.09, 0.24], [0.12, 0.13], [0.22, 0.08], [0.3, 0.14], [0.33, 0.22], [0.29, 0.3], [0.27, 0.39], [0.22, 0.42], [0.2, 0.51], [0.16, 0.46], [0.14, 0.37], [0.1, 0.35]],
  [[0.28, 0.49], [0.34, 0.5], [0.36, 0.58], [0.34, 0.68], [0.31, 0.82], [0.28, 0.76], [0.26, 0.63]],
  [[0.45, 0.22], [0.49, 0.18], [0.55, 0.19], [0.59, 0.23], [0.57, 0.29], [0.53, 0.32], [0.48, 0.31], [0.45, 0.27]],
  [[0.46, 0.34], [0.54, 0.33], [0.59, 0.4], [0.57, 0.51], [0.54, 0.66], [0.5, 0.73], [0.46, 0.64], [0.43, 0.5]],
  [[0.57, 0.19], [0.66, 0.13], [0.76, 0.15], [0.86, 0.19], [0.92, 0.26], [0.88, 0.33], [0.81, 0.34], [0.77, 0.4], [0.7, 0.37], [0.65, 0.4], [0.6, 0.35], [0.56, 0.29]],
  [[0.77, 0.57], [0.84, 0.56], [0.9, 0.6], [0.89, 0.68], [0.85, 0.73], [0.79, 0.7], [0.76, 0.64]],
  [[0.34, 0.12], [0.39, 0.09], [0.41, 0.14], [0.38, 0.2], [0.34, 0.19]],
];

const cityNodes = [
  { id: 'vancouver', region: 0, x: 0.17, y: 0.22 },
  { id: 'san-francisco', region: 0, x: 0.16, y: 0.31 },
  { id: 'austin', region: 0, x: 0.23, y: 0.39 },
  { id: 'toronto', region: 0, x: 0.28, y: 0.27 },
  { id: 'new-york', region: 0, x: 0.3, y: 0.3 },
  { id: 'mexico-city', region: 0, x: 0.26, y: 0.47 },
  { id: 'bogota', region: 1, x: 0.32, y: 0.52 },
  { id: 'lima', region: 1, x: 0.3, y: 0.61 },
  { id: 'sao-paulo', region: 1, x: 0.34, y: 0.7 },
  { id: 'buenos-aires', region: 1, x: 0.33, y: 0.78 },
  { id: 'london', region: 2, x: 0.48, y: 0.26 },
  { id: 'paris', region: 2, x: 0.5, y: 0.28 },
  { id: 'berlin', region: 2, x: 0.53, y: 0.26 },
  { id: 'stockholm', region: 2, x: 0.54, y: 0.21 },
  { id: 'lagos', region: 3, x: 0.49, y: 0.46 },
  { id: 'cairo', region: 3, x: 0.55, y: 0.39 },
  { id: 'nairobi', region: 3, x: 0.55, y: 0.55 },
  { id: 'cape-town', region: 3, x: 0.51, y: 0.7 },
  { id: 'dubai', region: 4, x: 0.61, y: 0.4 },
  { id: 'mumbai', region: 4, x: 0.65, y: 0.43 },
  { id: 'delhi', region: 4, x: 0.66, y: 0.37 },
  { id: 'singapore', region: 4, x: 0.71, y: 0.53 },
  { id: 'hong-kong', region: 4, x: 0.78, y: 0.39 },
  { id: 'tokyo', region: 4, x: 0.86, y: 0.33 },
  { id: 'sydney', region: 5, x: 0.86, y: 0.65 },
  { id: 'melbourne', region: 5, x: 0.83, y: 0.69 },
];

const cityNodeById = new Map(cityNodes.map((node) => [node.id, node]));

const globalRoutes = [
  ['san-francisco', 'tokyo'],
  ['new-york', 'london'],
  ['new-york', 'paris'],
  ['london', 'lagos'],
  ['london', 'dubai'],
  ['paris', 'mumbai'],
  ['cairo', 'mumbai'],
  ['mumbai', 'singapore'],
  ['singapore', 'sydney'],
  ['tokyo', 'hong-kong'],
  ['mexico-city', 'bogota'],
  ['sao-paulo', 'cape-town'],
];

function projectGlobePoint([x, y], rotationY, rotationX) {
  const longitude = (x - 0.5) * Math.PI * 2;
  const latitude = (0.5 - y) * Math.PI;
  const cosLatitude = Math.cos(latitude);
  const globeX = cosLatitude * Math.sin(longitude);
  const globeY = Math.sin(latitude);
  const globeZ = cosLatitude * Math.cos(longitude);
  const yawX = globeX * Math.cos(rotationY) + globeZ * Math.sin(rotationY);
  const yawZ = globeZ * Math.cos(rotationY) - globeX * Math.sin(rotationY);
  const pitchY = globeY * Math.cos(rotationX) - yawZ * Math.sin(rotationX);
  const pitchZ = globeY * Math.sin(rotationX) + yawZ * Math.cos(rotationX);

  return {
    x: 320 + yawX * 236,
    y: 320 - pitchY * 236,
    depth: pitchZ,
  };
}

function projectedGlobePath(points, rotationY, rotationX, close = false) {
  const pathPoints = close ? [...points, points[0]] : points;
  let path = '';
  let drawing = false;
  let previousPoint = null;
  let previousProjection = null;

  const horizonPoint = (start, end) => {
    let visible = start;
    let hidden = end;
    for (let i = 0; i < 12; i += 1) {
      const middle = [(visible[0] + hidden[0]) / 2, (visible[1] + hidden[1]) / 2];
      if (projectGlobePoint(middle, rotationY, rotationX).depth > 0) visible = middle;
      else hidden = middle;
    }
    return projectGlobePoint(visible, rotationY, rotationX);
  };

  pathPoints.forEach((point) => {
    const projection = projectGlobePoint(point, rotationY, rotationX);
    if (projection.depth > 0) {
      if (!drawing) {
        if (previousProjection && previousProjection.depth <= 0) {
          const horizon = horizonPoint(previousPoint, point);
          path += `M ${horizon.x.toFixed(2)} ${horizon.y.toFixed(2)} `;
        } else {
          path += `M ${projection.x.toFixed(2)} ${projection.y.toFixed(2)} `;
        }
        drawing = true;
      }
      path += `L ${projection.x.toFixed(2)} ${projection.y.toFixed(2)} `;
    } else if (drawing) {
      const horizon = horizonPoint(previousPoint, point);
      path += `L ${horizon.x.toFixed(2)} ${horizon.y.toFixed(2)} ${close ? 'Z ' : ''}`;
      drawing = false;
    }
    previousPoint = point;
    previousProjection = projection;
  });

  if (drawing && close) path += 'Z';
  return path;
}

function createRoutePoints(start, end, lift) {
  const controlX = (start.x + end.x) / 2;
  const controlY = (start.y + end.y) / 2 - lift / 450;
  return Array.from({ length: 25 }, (_, index) => {
    const t = index / 24;
    const inverseT = 1 - t;
    return [
      inverseT * inverseT * start.x + 2 * inverseT * t * controlX + t * t * end.x,
      inverseT * inverseT * start.y + 2 * inverseT * t * controlY + t * t * end.y,
    ];
  });
}

function WorldNetworkMap({ storyRef }) {
  const globeRef = useRef(null);
  const rotationRef = useRef({
    rotationX: 0,
    rotationY: 0,
    targetRotationX: 0,
    velocityY: 0,
    targetVelocityY: 0,
    dragging: false,
    pointerId: null,
    lastPointerX: 0,
    lastPointerY: 0,
  });

  const localRoutes = cityNodes.flatMap((node, index) => cityNodes
    .map((candidate, candidateIndex) => ({
      candidate,
      candidateIndex,
      distance: Math.hypot(node.x - candidate.x, node.y - candidate.y),
    }))
    .filter((entry) => entry.candidate.region === node.region && entry.candidateIndex > index && entry.distance < 0.19)
    .slice(0, 2)
    .map((entry) => [node, entry.candidate]));

  useEffect(() => {
    const storyElement = storyRef.current;
    if (!storyElement) return undefined;

    let animationFrame;
    const isOverGlobe = (event) => {
      const bounds = globeRef.current?.getBoundingClientRect();
      if (!bounds) return false;
      const x = (event.clientX - (bounds.left + bounds.width / 2)) / (bounds.width / 2);
      const y = (event.clientY - (bounds.top + bounds.height / 2)) / (bounds.height / 2);
      return x * x + y * y <= 0.74 * 0.74;
    };

    const animate = () => {
      const rotation = rotationRef.current;
      rotation.velocityY += (rotation.targetVelocityY - rotation.velocityY) * 0.08;
      rotation.rotationY += rotation.velocityY;
      rotation.rotationX += (rotation.targetRotationX - rotation.rotationX) * 0.08;

      const globe = globeRef.current;
      if (globe) {
        globe.querySelectorAll('.login-globe__land').forEach((element) => {
          const shape = continents[Number(element.dataset.shape)];
          const sampledShape = shape.flatMap((start, index) => {
            const end = shape[(index + 1) % shape.length];
            return Array.from({ length: 9 }, (_, step) => {
              const t = step / 9;
              return [start[0] + (end[0] - start[0]) * t, start[1] + (end[1] - start[1]) * t];
            });
          });
          element.setAttribute('d', projectedGlobePath(sampledShape, rotation.rotationY, rotation.rotationX, true));
        });

        globe.querySelectorAll('.login-globe__grid').forEach((element) => {
          const value = Number(element.dataset.value);
          const points = element.dataset.type === 'meridian'
            ? Array.from({ length: 49 }, (_, index) => [value, index / 48])
            : Array.from({ length: 97 }, (_, index) => [index / 96, value]);
          element.setAttribute('d', projectedGlobePath(points, rotation.rotationY, rotation.rotationX));
        });

        globe.querySelectorAll('.login-globe__route').forEach((element) => {
          const start = cityNodeById.get(element.dataset.start);
          const end = cityNodeById.get(element.dataset.end);
          const points = createRoutePoints(start, end, Number(element.dataset.lift));
          element.setAttribute('d', projectedGlobePath(points, rotation.rotationY, rotation.rotationX));
        });

        globe.querySelectorAll('.login-globe__node').forEach((element) => {
          const projection = projectGlobePoint(
            [Number(element.dataset.x), Number(element.dataset.y)],
            rotation.rotationY,
            rotation.rotationX,
          );
          element.setAttribute('cx', projection.x.toFixed(2));
          element.setAttribute('cy', projection.y.toFixed(2));
          element.setAttribute('opacity', projection.depth > 0 ? '1' : '0');
        });
      }
      animationFrame = requestAnimationFrame(animate);
    };

    const handlePointerMove = (event) => {
      const rotation = rotationRef.current;
      if (rotation.dragging) {
        if (event.pointerId !== rotation.pointerId) return;
        const deltaX = event.clientX - rotation.lastPointerX;
        const deltaY = event.clientY - rotation.lastPointerY;
        rotation.targetVelocityY = Math.max(-0.12, Math.min(0.12, deltaX * 0.012));
        rotation.targetRotationX = Math.max(-0.3, Math.min(0.3, rotation.targetRotationX + deltaY * 0.004));
        rotation.lastPointerX = event.clientX;
        rotation.lastPointerY = event.clientY;
        return;
      }

      if (!isOverGlobe(event)) {
        rotation.targetVelocityY = 0;
        return;
      }

      const bounds = globeRef.current.getBoundingClientRect();
      const mouseX = event.clientX - (bounds.left + bounds.width / 2);
      rotation.targetVelocityY = (mouseX / (bounds.width / 2)) * 0.018;
    };

    const handlePointerDown = (event) => {
      if (event.button !== 0 || !isOverGlobe(event)) return;
      const rotation = rotationRef.current;
      rotation.dragging = true;
      rotation.pointerId = event.pointerId;
      rotation.lastPointerX = event.clientX;
      rotation.lastPointerY = event.clientY;
      rotation.targetVelocityY = 0;
      storyElement.setPointerCapture(event.pointerId);
    };

    const stopDragging = (event) => {
      const rotation = rotationRef.current;
      if (!rotation.dragging || event.pointerId !== rotation.pointerId) return;
      rotation.dragging = false;
      rotation.targetVelocityY = 0;
      if (storyElement.hasPointerCapture(event.pointerId)) {
        storyElement.releasePointerCapture(event.pointerId);
      }
    };

    const handlePointerLeave = () => {
      if (!rotationRef.current.dragging) {
        rotationRef.current.targetVelocityY = 0;
      }
    };

    animationFrame = requestAnimationFrame(animate);
    storyElement.addEventListener('pointermove', handlePointerMove);
    storyElement.addEventListener('pointerdown', handlePointerDown);
    storyElement.addEventListener('pointerup', stopDragging);
    storyElement.addEventListener('pointercancel', stopDragging);
    storyElement.addEventListener('lostpointercapture', stopDragging);
    storyElement.addEventListener('pointerleave', handlePointerLeave);
    return () => {
      cancelAnimationFrame(animationFrame);
      storyElement.removeEventListener('pointermove', handlePointerMove);
      storyElement.removeEventListener('pointerdown', handlePointerDown);
      storyElement.removeEventListener('pointerup', stopDragging);
      storyElement.removeEventListener('pointercancel', stopDragging);
      storyElement.removeEventListener('lostpointercapture', stopDragging);
      storyElement.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [storyRef]);

  return (
    <div className="login-world-map" role="img" aria-label="Circular globe with green network connections">
      <svg
        ref={globeRef}
        className="login-globe-art"
        viewBox="0 0 640 640"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="login-globe-fill" cx="34%" cy="27%" r="76%">
            <stop offset="0%" stopColor="#1b4b2a" />
            <stop offset="58%" stopColor="#0d2916" />
            <stop offset="100%" stopColor="#030805" />
          </radialGradient>
          <radialGradient id="login-globe-light" cx="32%" cy="26%" r="70%">
            <stop offset="0%" stopColor="#9bffb0" stopOpacity="0.2" />
            <stop offset="55%" stopColor="#56c974" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#020604" stopOpacity="0.56" />
          </radialGradient>
          <clipPath id="login-globe-clip">
            <circle cx="320" cy="320" r="236" />
          </clipPath>
        </defs>

        <circle className="login-globe__surface" cx="320" cy="320" r="236" />
        <g clipPath="url(#login-globe-clip)">
          {Array.from({ length: 7 }, (_, index) => (
            <path
              key={`meridian-${index}`}
              className="login-globe__grid"
              data-type="meridian"
              data-value={index / 6}
            />
          ))}
          {Array.from({ length: 5 }, (_, index) => (
            <path
              key={`parallel-${index}`}
              className="login-globe__grid"
              data-type="parallel"
              data-value={(index + 1) / 6}
            />
          ))}

          {continents.map((shape, index) => (
            <path
              key={`continent-${index}`}
              className="login-globe__land"
              data-shape={index}
            />
          ))}

          {localRoutes.map(([startNode, endNode]) => (
            <path
              key={`local-${startNode.id}-${endNode.id}`}
              className="login-globe__route login-globe__route--local"
              data-start={startNode.id}
              data-end={endNode.id}
              data-lift="6"
            />
          ))}
          {globalRoutes.map(([startId, endId], index) => (
            <path
              key={`global-${startId}-${endId}`}
              className="login-globe__route"
              data-start={startId}
              data-end={endId}
              data-lift={24 + (index % 3) * 10}
            />
          ))}

          {cityNodes.map((node) => {
            return (
              <circle
                key={node.id}
                className="login-globe__node"
                data-x={node.x}
                data-y={node.y}
                r="4"
              />
            );
          })}
          <circle className="login-globe__lighting" cx="320" cy="320" r="236" />
        </g>

        <circle className="login-globe__rim" cx="320" cy="320" r="236" />
      </svg>
    </div>
  );
}

export function LoginPage({ onSignIn, authContent }) {
  const storyRef = useRef(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSignIn();
  };

  return (
    <div className="login-page" role={authContent ? undefined : 'main'}>
      <section
        ref={storyRef}
        className="login-story"
        aria-label="TalentX introduction"
      >
        <WorldNetworkMap storyRef={storyRef} />
        <div className="login-story__shade" />

        <a className="login-brand" href="#home" aria-label="TalentX home">
          <span className="login-brand__mark"><Sparkles size={19} /></span>
          <span>Talent<span className="login-brand__x">X</span></span>
        </a>

        <div className="login-story__content">
          <h1>Make your next move <span>count.</span></h1>
          <p className="login-story__copy">
            Your skills, opportunities, and the people who can take you further, all in one place.
          </p>

          <div className="login-proof">
            <div className="login-proof__avatars" aria-hidden="true">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=faces" alt="" />
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces" alt="" />
              <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=faces" alt="" />
            </div>
            <p><strong>People building what’s next.</strong><br />A network that moves with you.</p>
          </div>
        </div>

        <p className="login-story__footer">LEARN <i /> BUILD <i /> VERIFY <i /> GROW</p>
      </section>

      <section className="login-panel" aria-labelledby={authContent ? 'auth-heading' : 'login-heading'}>
        <div className="login-panel__topline">
          <span>Talent intelligence, made personal</span>
          <span className="login-secure"><LockKeyhole size={13} /> Secure sign in</span>
        </div>

        {authContent ? (
          <div className="login-auth-content">{authContent}</div>
        ) : (
        <div className="login-form-wrap">
          <p className="login-form__kicker">WELCOME BACK</p>
          <h2 id="login-heading">Sign in to TalentX</h2>
          <p className="login-form__intro">Pick up where your ambition left off.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="login-email">Work or university email</label>
            <div className="login-input-wrap">
              <Mail size={18} aria-hidden="true" />
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="login-password-label">
              <label htmlFor="login-password">Password</label>
              <button className="login-text-button" type="button" onClick={() => window.alert('Password reset is not connected in this demo.')}>Forgot password?</button>
            </div>
            <div className="login-input-wrap">
              <LockKeyhole size={18} aria-hidden="true" />
              <input
                id="login-password"
                name="password"
                type={passwordVisible ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
                required
              />
              <button
                className="login-visibility"
                type="button"
                onClick={() => setPasswordVisible((visible) => !visible)}
                aria-label={passwordVisible ? 'Hide password' : 'Show password'}
              >
                {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <label className="login-remember">
              <input type="checkbox" name="remember" />
              <span>Keep me signed in</span>
            </label>

            <button className="login-submit" type="submit">
              Sign in <ArrowRight size={17} />
            </button>
          </form>

          <div className="login-divider"><span>OR</span></div>
          <button className="login-demo" type="button" onClick={onSignIn}>Explore the demo <ArrowRight size={16} /></button>
          <p className="login-demo-note">Prototype access. No real account required.</p>

          <p className="login-signup">New to TalentX? <button className="login-text-button" type="button" onClick={onSignIn}>Create an account</button></p>
        </div>
        )}

        <p className="login-legal">By continuing, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</p>
      </section>
    </div>
  );
}