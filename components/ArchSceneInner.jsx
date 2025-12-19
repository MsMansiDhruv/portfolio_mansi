"use client";

import { useEffect, useRef, useState } from "react";
import * as BABYLON from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
import DataOrb from "./DataOrb";

/**
 * Techno-Data Orb - ArchSceneInner.jsx
 * - Techno-Data Orb (center) + 4 colored glass blocks
 * - Instanced packet flows along subtle curves
 * - Click-to-focus zoom retained
 * - React legend overlay toggles per-flow + global
 * - Animated tagline below canvas
 *
 * TUNABLES near top.
 */

export default function ArchSceneInner() {
  return (
    <>
      <DataOrb />
      {/* Your existing scene + legend UI below */}
    </>
  );
}

// export default function ArchSceneInner() {
//   const canvasRef = useRef(null);

//   // React-side toggles (keeps UI accessible and controls rebuilding scene)
//   const [globalFlowsOn, setGlobalFlowsOn] = useState(true);
//   const [flowEnabled, setFlowEnabled] = useState([true, true, true, true]); // 0: Ingest->Storage, 1: Storage->GPU, 2: GPU->Orch, 3: Feedback

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     // ---------------- SETTINGS ----------------
//     const PARTICLES_PER_FLOW = 10; // safe default for most devices
//     const PACKET_SIZE = 0.16; // larger, visible
//     const GLOW_INTENSITY = 0.55;
//     const BLOCK_PULSE_STRENGTH = 0.06; // very subtle
//     const PATH_SAMPLES = 40; // path resolution
//     const SPEED_SCALE = 0.45; // slow overall speed
//     const ORB_ROTATION_SPEED = 0.06; // rad/s
//     // ------------------------------------------

//     const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
//     engine.setHardwareScalingLevel(1); // conservative - change to >1 for higher perf on low-end

//     const scene = new BABYLON.Scene(engine);
//     scene.clearColor = new BABYLON.Color4(0.025, 0.03, 0.04, 1);

//     // Camera
//     const camera = new BABYLON.ArcRotateCamera("cam", Math.PI / 4, Math.PI / 3.6, 18, BABYLON.Vector3.Zero(), scene);
//     camera.attachControl(canvas, true);
//     camera.lowerRadiusLimit = 5;
//     camera.upperRadiusLimit = 40;
//     camera.wheelDeltaPercentage = 0.01;

//     // Lights
//     const hemi = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
//     hemi.intensity = 0.9;
//     const dir = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(-0.4, -1, -0.2), scene);
//     dir.intensity = 0.5;

//     // Glow layer (bloom)
//     const glow = new BABYLON.GlowLayer("glow", scene);
//     glow.intensity = GLOW_INTENSITY;

//     // Single GUI (we still use React overlay for accessible toggles)
//     const gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("ui", true, scene);
//     gui.useInvalidateRectOptimization = false;

//     // Center Orb (Core Intelligence Kernel)
//     const orb = BABYLON.MeshBuilder.CreateSphere("orb", { diameter: 3.2, segments: 32 }, scene);
//     const orbMat = new BABYLON.StandardMaterial("orbMat", scene);
//     orbMat.diffuseColor = new BABYLON.Color3(0.06, 0.08, 0.1);
//     orbMat.emissiveColor = new BABYLON.Color3(0.02, 0.28, 0.2).scale(0.35); // subtle teal core
//     orbMat.specularPower = 64;
//     orb.material = orbMat;
//     orb.rotationQuaternion = null;

//     // inner lattice (thin instanced spheres to hint compute cores)
//     const coreMaster = BABYLON.MeshBuilder.CreateSphere("coreMaster", { diameter: 0.18 }, scene);
//     const coreMat = new BABYLON.StandardMaterial("coreMat", scene);
//     coreMat.emissiveColor = new BABYLON.Color3(0.2, 0.9, 0.45).scale(0.9);
//     coreMat.diffuseColor = new BABYLON.Color3(0.02, 0.02, 0.03);
//     coreMaster.material = coreMat;
//     coreMaster.isVisible = false;

//     // scatter a few small GPU cores inside orb
//     const coreInstances = [];
//     for (let i = 0; i < 10; i++) {
//       const inst = coreMaster.createInstance(`core_${i}`);
//       // random within small radius
//       const r = 1.0 * Math.random();
//       const theta = Math.random() * Math.PI * 2;
//       const phi = (Math.random() - 0.5) * Math.PI;
//       inst.position = new BABYLON.Vector3(r * Math.cos(theta) * Math.cos(phi), r * Math.sin(phi) * 0.6, r * Math.sin(theta) * Math.cos(phi));
//       coreInstances.push(inst);
//     }
//     glow.addIncludedOnlyMesh(coreMaster); // cores glow

//     // Blocks configuration (equal spacing)
//     const X_SPACING = 4.5;
//     const baseX = -1.5 * X_SPACING;
//     const blockMeta = [
//       { name: "Ingestion", color: "#4CC9F0", subtitle: "APIs · Kafka · Batch" },
//       { name: "Storage", color: "#7AD97A", subtitle: "S3 · Data Lake" },
//       { name: "GPU", color: "#A6E22E", subtitle: "NVIDIA · RAPIDS" },
//       { name: "Orchestration", color: "#C58FF5", subtitle: "Airflow · StepFns" },
//     ];

//     function makeGlassBlock(meta, idx) {
//       const x = baseX + idx * X_SPACING;
//       const box = BABYLON.MeshBuilder.CreateBox(meta.name, { size: 2.0 }, scene);
//       box.position = new BABYLON.Vector3(x, 0, 0);

//       const mat = new BABYLON.StandardMaterial(`${meta.name}-mat`, scene);
//       const c = BABYLON.Color3.FromHexString(meta.color);
//       mat.diffuseColor = c.scale(0.28);
//       mat.specularColor = c.scale(0.10);
//       mat.emissiveColor = c.scale(0.08);
//       mat.alpha = 0.78;
//       mat.backFaceCulling = false;
//       box.material = mat;

//       box._baseEmissive = mat.emissiveColor.clone ? mat.emissiveColor.clone() : new BABYLON.Color3(mat.emissiveColor.r, mat.emissiveColor.g, mat.emissiveColor.b);
//       box._label = `${meta.name}\n${meta.subtitle}`;
//       box.isPickable = true;
//       // slight shape
//       box.scaling = new BABYLON.Vector3(1, 0.92, 1.12);
//       return box;
//     }

//     const blocks = blockMeta.map((m, i) => makeGlassBlock(m, i));

//     // attach GUI labels (simple, light)
//     function attachLabel(mesh) {
//       const rect = new GUI.Rectangle();
//       rect.width = "220px";
//       rect.height = "56px";
//       rect.cornerRadius = 8;
//       rect.color = "#999";
//       rect.thickness = 0.7;
//       rect.background = "#00000066";
//       gui.addControl(rect);

//       const tb = new GUI.TextBlock();
//       tb.text = mesh._label;
//       tb.color = "white";
//       tb.fontSize = 14;
//       tb.textWrapping = true;
//       rect.addControl(tb);
//       rect.linkWithMesh(mesh);
//       rect.linkOffsetY = -92;
//       rect.isPointerBlocker = false;
//       return rect;
//     }

//     blocks.forEach((b) => attachLabel(b));

//     // click-to-focus (keeps zoom and shows panel)
//     const infoRect = new GUI.Rectangle();
//     infoRect.width = "420px";
//     infoRect.height = "160px";
//     infoRect.cornerRadius = 10;
//     infoRect.color = "#ccc";
//     infoRect.thickness = 1;
//     infoRect.background = "#06070bdd";
//     infoRect.isVisible = false;
//     gui.addControl(infoRect);
//     const infoText = new GUI.TextBlock();
//     infoText.textWrapping = true;
//     infoText.padding = "12px";
//     infoText.color = "#e6eef8";
//     infoText.fontSize = 13;
//     infoRect.addControl(infoText);

//     function showPanel(mesh) {
//       infoText.text = `${mesh.name}\n\n${mesh._label || ""}\n\nSkills: AWS · Redshift · Glue · Terraform · NVIDIA · RAPIDS · Airflow · Concourse`;
//       infoRect.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
//       infoRect.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
//       infoRect.isVisible = true;
//       setTimeout(() => (infoRect.isVisible = false), 6000);
//     }

//     blocks.forEach((b) => {
//       b.actionManager = new BABYLON.ActionManager(scene);
//       b.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
//         // camera animate to a nicer position
//         const to = b.position.add(new BABYLON.Vector3(0, 1.3, 6));
//         const anim = new BABYLON.Animation("camAnim", "position", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
//         anim.setKeys([{ frame: 0, value: camera.position.clone() }, { frame: 36, value: to }]);
//         camera.animations = [anim];
//         scene.beginAnimation(camera, 0, 36, false);
//         // show details
//         showPanel(b);
//       }));
//     });

//     // build gentle sample curve
//     function sampleCurve(start, end, bend = 0.14, samples = PATH_SAMPLES) {
//       const s = new BABYLON.Vector3(...start);
//       const e = new BABYLON.Vector3(...end);
//       const mid = s.add(e).scale(0.5);
//       mid.y += bend; // subtle bend
//       const path = [];
//       for (let i = 0; i <= samples; i++) {
//         const t = i / samples;
//         // quadratic bezier
//         const p = s.scale((1 - t) * (1 - t)).add(mid.scale(2 * (1 - t) * t)).add(e.scale(t * t));
//         path.push(p);
//       }
//       return path;
//     }

//     // create faint guide tube for perception
//     function createGuide(path, colorHex) {
//       const tube = BABYLON.MeshBuilder.CreateTube("guide", { path, radius: 0.05, updatable: false }, scene);
//       const m = new BABYLON.StandardMaterial("gmat", scene);
//       const c = BABYLON.Color3.FromHexString(colorHex);
//       m.emissiveColor = c.scale(0.12);
//       m.alpha = 0.25;
//       tube.material = m;
//       tube.isPickable = false;
//       glow.addIncludedOnlyMesh(tube);
//       return tube;
//     }

//     // master packet instance
//     const masterPacket = BABYLON.MeshBuilder.CreateSphere("masterPacket", { diameter: PACKET_SIZE }, scene);
//     const masterPacketMat = new BABYLON.StandardMaterial("masterPacketMat", scene);
//     masterPacketMat.emissiveColor = new BABYLON.Color3(1, 0.85, 0.5); // warmer dense color
//     masterPacketMat.diffuseColor = new BABYLON.Color3(0.12, 0.08, 0.06);
//     masterPacket.material = masterPacketMat;
//     masterPacket.isVisible = false;
//     glow.addIncludedOnlyMesh(masterPacket);

//     // define the flows (from block -> orb and orb -> next block; plus feedback)
//     // We'll create flows as arrays of path points; packets will move along them
//     const flows = []; // { path, packets[], enabled, color, speed }

//     // helper to create a flow from pointA to pointB (pos Vec3)
//     function buildFlow(fromVec, toVec, colorHex, speedFactor) {
//       const start = [fromVec.x, fromVec.y, fromVec.z];
//       const end = [toVec.x, toVec.y, toVec.z];
//       const path = sampleCurve(start, end, 0.14, PATH_SAMPLES);
//       const guide = createGuide(path, colorHex);
//       const packets = [];
//       for (let i = 0; i < PARTICLES_PER_FLOW; i++) {
//         const inst = masterPacket.createInstance(`pkt_${flows.length}_${i}`);
//         inst.isPickable = false;
//         packets.push({ inst, offset: (i / PARTICLES_PER_FLOW) * (1 / (speedFactor || 1)), speed: speedFactor || 1 });
//       }
//       flows.push({ path, guide, packets, enabled: true, color: colorHex, speed: speedFactor });
//     }

//     // Create flows:
//     // 0: Ingestion -> Orb (cyan)
//     // 1: Storage -> Orb (amber)
//     // 2: Orb -> GPU (green)  (or Storage->GPU earlier – but we use orb as central)
//     // 3: Feedback (orchestration -> ingestion) - distinct color
//     buildFlow(blocks[0].position, orb.position, "#4CC9F0", 0.55 * SPEED_SCALE);
//     buildFlow(blocks[1].position, orb.position, "#FFD166", 0.65 * SPEED_SCALE);
//     buildFlow(orb.position, blocks[2].position, "#7AD97A", 0.55 * SPEED_SCALE);
//     buildFlow(blocks[3].position, blocks[0].position, "#A98BFF", 0.30 * SPEED_SCALE); // feedback loop, distinct purple

//     // animation loop
//     let time = 0;
//     scene.onBeforeRenderObservable.add(() => {
//       const dt = engine.getDeltaTime() / 1000;
//       time += dt;

//       // orb rotation + subtle nucleus twinkle
//       orb.rotation.y += ORB_ROTATION_SPEED * dt;
//       for (let i = 0; i < coreInstances.length; i++) {
//         const ci = coreInstances[i];
//         // gentle flicker
//         const flick = 0.8 + 0.45 * Math.abs(Math.sin(time * (0.9 + i * 0.07)));
//         ci.scaling.setAll(0.6 + flick * 0.05);
//       }

//       // subtle block pulse (very small)
//       blocks.forEach((b, idx) => {
//         const phase = time * (0.5 + idx * 0.05);
//         const s = 1 + Math.sin(phase * 1.8) * BLOCK_PULSE_STRENGTH; // very gentle
//         b.scaling = new BABYLON.Vector3(s, 0.92 * s, 1.12 * s);
//         const base = b._baseEmissive;
//         if (base) {
//           b.material.emissiveColor = base.scale(1 + Math.abs(Math.sin(phase)) * 0.18);
//         }
//       });

//       // update flows
//       flows.forEach((flow, fi) => {
//         const enabled = globalFlowsOn && flowEnabled[fi];
//         flow.guide.visibility = enabled ? 0.9 : 0.08;
//         flow.packets.forEach((p, i) => {
//           if (!enabled) { p.inst.setEnabled(false); return; }
//           p.inst.setEnabled(true);
//           // progress along path
//           const prog = ((time * p.speed) + p.offset) % 1; // 0..1
//           const floatIdx = prog * (flow.path.length - 1);
//           const i0 = Math.floor(floatIdx);
//           const i1 = Math.min(i0 + 1, flow.path.length - 1);
//           const t = floatIdx - i0;
//           const p0 = flow.path[i0];
//           const p1 = flow.path[i1];
//           const pos = BABYLON.Vector3.Lerp(p0, p1, t);
//           // smaller sway (reduced)
//           pos.y += Math.sin((prog + i * 0.06) * Math.PI * 2) * 0.03;
//           p.inst.position.copyFrom(pos);
//           // scale/fade near ends - subtle
//           const distCenter = Math.abs(prog - 0.5);
//           const scale = 0.9 + (1 - distCenter) * 0.8;
//           p.inst.scaling = new BABYLON.Vector3(PACKET_SIZE * scale, PACKET_SIZE * scale, PACKET_SIZE * scale);
//         });
//       });
//     });

//     // cleanup
//     engine.runRenderLoop(() => scene.render());
//     const onResize = () => engine.resize();
//     window.addEventListener("resize", onResize);

//     return () => {
//       window.removeEventListener("resize", onResize);
//       try { scene.dispose(); } catch (e) {}
//       try { engine.dispose(); } catch (e) {}
//     };
//     // note: rebuild scene when toggles change (flowEnabled/globalFlowsOn)
//   }, [globalFlowsOn, flowEnabled.join(",")]); // re-create when toggles change (simple but effective)

//   // React legend overlay (accessible / easier to tweak)
//   function toggleFlow(index) {
//     setFlowEnabled((prev) => {
//       const c = prev.slice();
//       c[index] = !c[index];
//       return c;
//     });
//   }

//   return (
//     <div className="relative w-full select-none">
//       {/* Top-left legend (React) */}
//       <div style={{ position: "absolute", left: 14, top: 12, zIndex: 60, background: "rgba(6,7,10,0.56)", padding: 10, borderRadius: 8, color: "#e6eef8", fontSize: 13 }}>
//         <div style={{ fontWeight: 600, marginBottom: 6 }}>Flows</div>
//         <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
//           <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
//             <input type="checkbox" checked={flowEnabled[0]} onChange={() => toggleFlow(0)} /> Ingest → Orb
//           </label>
//           <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
//             <input type="checkbox" checked={flowEnabled[1]} onChange={() => toggleFlow(1)} /> Storage → Orb
//           </label>
//           <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
//             <input type="checkbox" checked={flowEnabled[2]} onChange={() => toggleFlow(2)} /> Orb → GPU
//           </label>
//           <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
//             <input type="checkbox" checked={flowEnabled[3]} onChange={() => toggleFlow(3)} /> Feedback loop
//           </label>
//         </div>
//       </div>

//       {/* Top-right global toggle */}
//       <div style={{ position: "absolute", right: 14, top: 12, zIndex: 60 }}>
//         <button onClick={() => setGlobalFlowsOn((s) => !s)} style={{ background: "rgba(10,11,14,0.6)", color: "white", padding: "8px 12px", borderRadius: 8 }}>
//           {globalFlowsOn ? "Hide Flows" : "Show Flows"}
//         </button>
//       </div>

//       {/* Canvas */}
//       <canvas ref={canvasRef} className="w-full h-[640px] rounded-xl border border-neutral-800" />

//       {/* Animated tagline */}
//       <div style={{ marginTop: 12, textAlign: "center", color: "#dbe9f8" }}>
//         <h2 style={{ fontSize: 22, margin: 0, letterSpacing: 0.6 }}>
//           <span style={{ opacity: 0.9 }}>System Design.</span>{" "}
//           <span style={{ opacity: 0.95 }}>Speed.</span>{" "}
//           <span style={{ opacity: 0.9 }}>Scalability.</span>{" "}
//           <span style={{ opacity: 0.95, color: "#9be8b6" }}>Storytelling.</span>
//         </h2>
//         <p style={{ marginTop: 8, opacity: 0.8 }}>GPU-accelerated data pipelines • Cloud-native architectures • Realtime ML</p>
//       </div>
//     </div>
//   );
// }
