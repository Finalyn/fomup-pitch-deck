import { useEffect, useRef, useState } from "react";

// The three.js bundle and the model together weigh far more than the rest of
// the deck, so nothing is fetched until the slide is actually reached.
type Props = { active: boolean };

// GLTFLoader renames every node as it loads: whitespace becomes underscores and
// a handful of characters are dropped. Names written the way Blender shows them
// match nothing once loaded, which is why the cap could not be found. Both sides
// go through the same transform here.
const slug = (name: string) => name.replace(/\s/g, "_").replace(/[[\].:/]/g, "");

const CAP_NODE = slug("Capuchon transparent amovible");
// The export also carries the pouring animation: a hundred foam cells, the
// liquid ribbon and the foam sitting in the cap. None of it belongs in a still
// turntable, and left visible it floats beside the bottle.
// "Flacon | ..." is deliberately absent: it looks like animation scaffolding but
// it is the parent of the body, the collar and the whole pump, so hiding it
// takes the bottle with it.
const HIDDEN = ["Cellule fine", "Microbulles", "Ruban de liquide", "Capuchon | remplissage"].map(
  slug,
);
const isHidden = (name: string) => HIDDEN.some((prefix) => name.startsWith(prefix));

const BACKDROPS = [
  { key: "cream", label: "Cream", color: "#f5f1e8" },
  { key: "gold", label: "Gold", color: "#e3ac36" },
  { key: "ink", label: "Ink", color: "#141210" },
  { key: "mint", label: "Mint", color: "#9fc5a6" },
] as const;

export function BottleViewer({ active }: Props) {
  const holder = useRef<HTMLDivElement | null>(null);
  const capRef = useRef<{ show: (on: boolean) => void } | null>(null);
  const bgRef = useRef<((hex: string) => void) | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "failed">("idle");
  const [capOn, setCapOn] = useState(true);
  const [backdrop, setBackdrop] = useState<string>(BACKDROPS[0].key);
  // The scene is built once. status and backdrop must stay out of the effect's
  // dependencies: setting status inside it would retrigger the effect, and the
  // cleanup would tear the renderer down before the model finished loading.
  const started = useRef(false);
  const backdropRef = useRef(backdrop);
  backdropRef.current = backdrop;
  // Latches on the first visit and never goes back, so leaving the slide cannot
  // trigger the cleanup and leave an empty canvas on the way back.
  const [armed, setArmed] = useState(false);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    if (active) setArmed(true);
  }, [active]);

  useEffect(() => {
    if (!armed || started.current || !holder.current) return;
    started.current = true;
    const mount = holder.current;
    setStatus("loading");
    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      const { RoomEnvironment } =
        await import("three/examples/jsm/environments/RoomEnvironment.js");
      if (disposed) return;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const startColor = BACKDROPS.find((b) => b.key === backdropRef.current)?.color ?? "#f5f1e8";
      scene.background = new THREE.Color(startColor);
      bgRef.current = (hex) => {
        (scene.background as InstanceType<typeof THREE.Color>).set(hex);
      };

      // A room environment gives the aluminium and the chrome something to
      // reflect. Without it both read as flat grey plastic.
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

      const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 100);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.enablePan = false;
      controls.rotateSpeed = 0.85;
      // Dolly towards whatever is under the pointer rather than the centre.
      controls.zoomToCursor = true;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.9;
      controls.addEventListener("start", () => {
        controls.autoRotate = false;
      });

      const loader = new GLTFLoader();
      let frame = 0;
      loader.load(
        `${import.meta.env.BASE_URL}fomup-bottle.glb`,
        (gltf) => {
          if (disposed) return;
          const model = gltf.scene;
          model.traverse((child) => {
            if (isHidden(child.name)) child.visible = false;
          });
          // Matched by prefix rather than exact name: the loader appends a
          // counter when two nodes sanitise to the same string.
          let cap: InstanceType<typeof THREE.Object3D> | undefined;
          model.traverse((child) => {
            if (!cap && child.name.startsWith(CAP_NODE)) cap = child;
          });
          capRef.current = {
            show: (on) => {
              if (cap) cap.visible = on;
            },
          };

          // Frame the bottle from its own bounds rather than guessing a camera
          // distance: the export's scale is in Blender units, not metres.
          // Bounds are taken from the bottle alone, with the hidden foam left out,
          // otherwise the framing accounts for geometry nobody can see. A mesh
          // keeps visible true even when an ancestor is hidden, so the whole
          // chain has to be checked.
          const shown = (obj: InstanceType<typeof THREE.Object3D>) => {
            for (let o: typeof obj | null = obj; o; o = o.parent) if (!o.visible) return false;
            return true;
          };
          const box = new THREE.Box3();
          model.updateWorldMatrix(true, true);
          model.traverse((child) => {
            const mesh = child as InstanceType<typeof THREE.Mesh>;
            if (mesh.isMesh && shown(child)) box.expandByObject(child);
          });
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);
          scene.add(model);

          const radius = Math.max(size.x, size.y, size.z) * 0.5;
          const distance = radius / Math.sin((camera.fov * Math.PI) / 360);
          camera.position.set(distance * 0.55, distance * 0.28, distance * 0.92);
          controls.target.set(0, 0, 0);
          controls.minDistance = distance * 0.45;
          controls.maxDistance = distance * 2.2;
          controls.update();
          setStatus("ready");
        },
        undefined,
        () => {
          if (!disposed) setStatus("failed");
        },
      );

      const resize = () => {
        const { clientWidth: w, clientHeight: h } = mount;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(mount);

      const tick = () => {
        frame = requestAnimationFrame(tick);
        // No point burning a GPU frame on a slide nobody is looking at.
        if (!activeRef.current) return;
        controls.update();
        renderer.render(scene, camera);
      };
      tick();

      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        controls.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [armed]);

  return (
    <div className="viewer">
      <div className="viewer-stage" ref={holder} data-status={status}>
        {status !== "ready" && (
          <p className="viewer-status">
            {status === "failed" ? "3D unavailable on this device" : "Loading the bottle"}
          </p>
        )}
      </div>
      <div className="viewer-controls">
        <button
          type="button"
          className="viewer-button"
          onClick={() => {
            const next = !capOn;
            setCapOn(next);
            capRef.current?.show(next);
          }}
          disabled={status !== "ready"}
        >
          {capOn ? "Remove the cap" : "Put the cap back"}
        </button>
        <div className="viewer-swatches" role="group" aria-label="Backdrop colour">
          {BACKDROPS.map(({ key, label, color }) => (
            <button
              type="button"
              key={key}
              className={key === backdrop ? "active" : ""}
              style={{ background: color }}
              aria-label={label}
              aria-pressed={key === backdrop}
              onClick={() => {
                setBackdrop(key);
                bgRef.current?.(color);
              }}
            />
          ))}
        </div>
      </div>
      <p className="viewer-hint">Drag to turn, scroll or pinch to zoom.</p>
    </div>
  );
}
