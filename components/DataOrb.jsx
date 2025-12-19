"use client";

import { useEffect, useRef, useState } from "react";
import * as BABYLON from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";

export default function DataOrb() {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const engineRef = useRef(null);

  const [isDay, setIsDay] = useState(false);

  // --- explicit theme colors you provided ---
  const DAY_BG_HEX = "#f3f4f6"; // requested white-ish (visible)
  const NIGHT_BG_HEX = "#0c0c0c"; // requested near-black

  // Day core color (changed to match/compliment day theme instead of shiny green)
  const DAY_CORE_HEX = "#FFB74D"; // cool muted blue — adjust if you'd like warmer/cooler

  // helper: hex -> normalized rgba
  function hexToRgbNormalized(hex) {
    if (!hex) return null;
    const h = hex.replace("#", "");
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const bigint = parseInt(full, 16);
    const r = ((bigint >> 16) & 255) / 255;
    const g = ((bigint >> 8) & 255) / 255;
    const b = (bigint & 255) / 255;
    return [r, g, b, 1];
  }

  // Detect external day theme via dataset or common classes
  function detectExternalDay() {
    try {
      const de = document.documentElement;
      const body = document.body;
      const dt = de && de.dataset && (de.dataset.theme || de.getAttribute("data-theme"));
      if (dt && (dt.toLowerCase() === "day" || dt.toLowerCase() === "light")) return true;
      const dayClasses = ["day", "light", "theme-day", "theme-light", "is-day"];
      for (const c of dayClasses) {
        if (body.classList.contains(c) || de.classList.contains(c)) return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  // Parse "rgb(...)" or "rgba(...)" -> [r,g,b,a] normalized 0..1, or null
  function parseRgbString(str) {
    if (!str) return null;
    const m = str.match(/rgba?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*([\d.]+))?\s*\)/i);
    if (!m) return null;
    const r = Math.min(255, parseInt(m[1], 10)) / 255;
    const g = Math.min(255, parseInt(m[2], 10)) / 255;
    const b = Math.min(255, parseInt(m[3], 10)) / 255;
    const a = m[4] !== undefined ? Math.max(0, Math.min(1, parseFloat(m[4]))) : 1;
    return [r, g, b, a];
  }

  // Read only canvas parent background (fallback)
  function getParentBackgroundColor() {
    try {
      const canvas = canvasRef.current;
      if (!canvas || !canvas.parentElement) return null;
      const style = getComputedStyle(canvas.parentElement);
      if (!style) return null;
      const bg = style.backgroundColor;
      const parsed = parseRgbString(bg);
      if (parsed && parsed[3] > 0.02) return parsed;
    } catch (e) {}
    return null;
  }

  // observe theme-like changes to toggle isDay
  useEffect(() => {
    setIsDay(detectExternalDay());
    const target = document.documentElement || document.body;
    if (!target || typeof MutationObserver === "undefined") return;
    const mo = new MutationObserver(() => setIsDay(detectExternalDay()));
    mo.observe(target, { attributes: true, attributeFilter: ["class", "data-theme"], subtree: false });
    if (document.body && document.body !== target) {
      mo.observe(document.body, { attributes: true, attributeFilter: ["class"], subtree: false });
    }
    return () => mo.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ---------------- SETTINGS ----------------
    const ORB_DIAMETER = 5.5;
    const NUM_CORES = 12;
    const NUM_PARTICLES = 70;
    const PACKET_SIZE = 0.22; // slightly larger for visibility
    const RING_COUNT = 4;
    const BASE_GLOW_INTENSITY = 0.7;
    const BASE_ORB_ROT_SPEED = 0.04;
    const RING_ROT_BASE = 0.12;
    const SPEED_SCALE = 0.1;
    const maxLane = 6;
    // Parallax/hover tuning
    const PARALLAX_DISTANCE = 0.55; // how far orbParent moves on pointer
    const PARALLAX_ROTATE = 0.18; // how much to tilt
    const HOVER_BOOST = 1.9; // multiplier on hover for speeds/glow
    const HOVER_LERP = 0.12;
    // ------------------------------------------

    const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    engine.setHardwareScalingLevel(1);
    engineRef.current = engine;

    const scene = new BABYLON.Scene(engine);

    // explicit clear color by theme, fallback to parent
    const dayRgb = hexToRgbNormalized(DAY_BG_HEX);
    const nightRgb = hexToRgbNormalized(NIGHT_BG_HEX);
    const bgRgb = isDay ? dayRgb : nightRgb;
    if (bgRgb) {
      scene.clearColor = new BABYLON.Color4(bgRgb[0], bgRgb[1], bgRgb[2], bgRgb[3]);
    } else {
      const parentBg = getParentBackgroundColor();
      if (parentBg) scene.clearColor = new BABYLON.Color4(parentBg[0], parentBg[1], parentBg[2], parentBg[3]);
      else scene.clearColor = new BABYLON.Color4(0.01, 0.015, 0.02, 1);
    }

    sceneRef.current = scene;

    const camera = new BABYLON.ArcRotateCamera(
      "orbCam",
      Math.PI * 0.05,  // VERY low horizontal angle (almost looking from the side)
      Math.PI * 0.48,  // lowered beta tilt (~24° above horizon)
      11,             // zoomed in (closer)
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);
    camera.wheelDeltaPercentage = 0.01;
    camera.lowerRadiusLimit = 4;

    const hemi = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
    hemi.intensity = 0.9;
    const dir = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(-0.4, -1, -0.2), scene);
    dir.intensity = 0.45;

    const glow = new BABYLON.GlowLayer("orbGlow", scene);
    glow.intensity = BASE_GLOW_INTENSITY;
    glow.blurKernelSize = 64;

    const orbParent = new BABYLON.TransformNode("orbParent", scene);

    // ------- Shell & Rim (kept hidden to remove halo) -------
    const shell = BABYLON.MeshBuilder.CreateSphere("shell", { diameter: ORB_DIAMETER + 0.3, segments: 48 }, scene);
    const shellMat = new BABYLON.PBRMaterial("shellMat", scene);
    shellMat.albedoColor = new BABYLON.Color3(0.04, 0.06, 0.08);
    shellMat.alpha = 0.0; // hidden to remove halo
    shellMat.roughness = 0.04;
    shellMat.metallic = 0.1;
    shell.material = shellMat;
    shell.parent = orbParent;

    const rim = BABYLON.MeshBuilder.CreateSphere("rim", { diameter: ORB_DIAMETER + 0.06, segments: 32 }, scene);
    const rimMat = new BABYLON.StandardMaterial("rimMat", scene);
    rimMat.emissiveColor = new BABYLON.Color3(0.02, 0.32, 0.18).scale(0.35);
    rimMat.alpha = 0.0; // hidden
    rim.material = rimMat;
    rim.parent = orbParent;

    // ------- Core -------
    const core = BABYLON.MeshBuilder.CreateSphere("core", { diameter: ORB_DIAMETER * 0.45, segments: 32 }, scene);
    const coreMat = new BABYLON.StandardMaterial("coreMat", scene);
    // default (night) values set later
    coreMat.roughness = 0.12;
    coreMat.metallic = 0.06;
    core.material = coreMat;
    core.parent = orbParent;

    // core instances
    const coreMaster = BABYLON.MeshBuilder.CreateBox("coreMaster", { size: 0.22 }, scene);
    const coreMasterMat = new BABYLON.StandardMaterial("coreMasterMat", scene);
    coreMasterMat.emissiveColor = new BABYLON.Color3(0.2, 1, 0.6);
    coreMasterMat.diffuseColor = new BABYLON.Color3(0.03, 0.03, 0.03);
    coreMaster.material = coreMasterMat;
    coreMaster.isVisible = false;
    const coreInstances = [];
    for (let i = 0; i < NUM_CORES; i++) {
      const inst = coreMaster.createInstance(`gcore_${i}`);
      const r = (ORB_DIAMETER * 0.45 / 2) * (0.55 + Math.random() * 0.35);
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      inst.position = new BABYLON.Vector3(r * Math.cos(theta) * Math.cos(phi), r * Math.sin(phi) * 0.4, r * Math.sin(theta) * Math.cos(phi));
      inst.scaling = new BABYLON.Vector3(0.6, 0.6, 0.6);
      inst.parent = core;
      coreInstances.push(inst);
    }
    glow.addIncludedOnlyMesh(coreMaster);

    // ------- Rings (create early) -------
    const ringConfigs = [
      { radius: ORB_DIAMETER * 0.85, color: "#2EC4B6", speed: 0.9 },
      { radius: ORB_DIAMETER * 0.65, color: "#FFD166", speed: -1.05 },
      { radius: ORB_DIAMETER * 0.45, color: "#8BE38B", speed: 1.4 },
      { radius: ORB_DIAMETER * 1.05, color: "#C58FF5", speed: -0.6 },
    ];
    const rings = [];
    ringConfigs.forEach((cfg, idx) => {
      const tor = BABYLON.MeshBuilder.CreateTorus(`ring_${idx}`, { diameter: cfg.radius, thickness: 0.045, tessellation: 64 }, scene);
      const tm = new BABYLON.StandardMaterial(`ringMat_${idx}`, scene);
      const c = BABYLON.Color3.FromHexString(cfg.color);
      tm.emissiveColor = c.scale(0.22);
      tm.alpha = 0.38;
      tm.diffuseColor = c.scale(0.02);
      tor.material = tm;
      tor.parent = orbParent;
      tor.rotation.x = Math.PI * 0.18 * (idx % 2 === 0 ? 1 : -1);
      rings.push({ mesh: tor, baseSpeed: cfg.speed * RING_ROT_BASE, currentSpeed: cfg.speed * RING_ROT_BASE, color: cfg.color, mat: tm });
      glow.addIncludedOnlyMesh(tor);
    });

    // ------- Pillars with content (restored clickable blocks) -------
    const pillars = [
      {
        fullLabel: "Data Engineering",
        color: "#6BD0FF",
        content: `<ul style="padding-left:20px; margin:0; list-style-type: disc;">
                    <li>Strong proficiency in developing ETL pipelines in Databricks, Pyspark and AWS.</li>
                    <li>Extensive experience with SQL and Big Data.</li>
                    <li>Database expertise with PostgreSQL, MySQL, Sqlite, Redshift, MongoDB.</li>
                    <li>Extensive experience in web scraping & data extraction with Selenium, Scrapy, requests, bs4.</li>
                </ul>
                <script>console.log("Data Engineering script runs!");</script>`
      },
      {
        fullLabel: "GPU-Accelerated Processing",
        color: "#FFD166",
        content: `<ul></ul>`
      },
      {
        fullLabel: "Software Development & Engineering",
        color: "#A6E22E",
        content: `<ul style="padding-left:20px; margin:0; list-style-type: disc;">
            <li>Extensive practical experience with cloud services in AWS (S3, EC2, Lambda, RDS, Glue).</li>
            <li>Skilled practicioner with Infrastructure as code in Terraform and CloudFormation.</li>
            <li>Extensive experience with CI/CD setup with Github Actions and Bitbucket Pipelines.</li>
            <li>Proficient in containerisation technology such as Docker.</li>
        </ul>
        <script>console.log("Software Dev and Engineering script runs!");</script>`
      },
      {
        fullLabel: "DevOps & MLOps Automation",
        color: "#C58FF5",
        content: `<ul style="padding-left:20px; margin:0; list-style-type: disc;">
            <li>Proficient in setting up CI/CD pipelines using <strong>Github Actions, Jenkins, and Bitbucket Pipelines.</strong></li>
            <li>Experience automating infrastructure provisioning with <strong>Terraform and CloudFormation.</strong></li>
            <li>Container orchestration and management with Docker and Kubernetes (EKS).</li>
            <li>Building automated ML workflows and pipelines using tools like MLflow, Kubeflow, and Airflow.</li>
            <li>Deploying scalable ML models to production environments with monitoring and rollback capabilities.</li>
            <li>Versioning datasets and models to ensure reproducibility and auditability.</li>
            <li>Experience with cloud-native MLOps platforms on AWS SageMaker and Azure ML.</li>
            <li>Automated testing and validation of ML models and data pipelines.</li>
            <li>Implementing logging, alerting, and metrics collection for ML systems health.</li>
        </ul>
        <script>console.log("Devops and mlops automation!");</script>`
      },
      {
        fullLabel: "System Architecture & Solution Design",
        color: "#FF8AB0",
        content: `<ul style="padding-left:20px; margin:0; list-style-type: disc;">
            <li>Designing scalable, fault-tolerant, and maintainable distributed systems.</li>
            <li>Expertise in microservices architecture and event-driven design patterns.</li>
            <li>Defining system requirements, components, and data flow diagrams for complex solutions.</li>
            <li>Experience with API design and management including RESTful and gRPC services.</li>
            <li>Proficient in selecting appropriate databases and storage solutions based on use case.</li>
            <li>Implementing asynchronous processing and message queue systems (Kafka, RabbitMQ).</li>
            <li>Performance optimization, load balancing, and capacity planning.</li>
            <li>Security architecture and compliance considerations in system design.</li>
            <li>Applying cloud-native design principles and hybrid cloud integration.</li>
            <li>Collaboration with cross-functional teams to align technical architecture with business goals.</li>
        </ul>
        <script>console.log("System architecture and solution design runs!");</script>`
      },
      {
        fullLabel: "Cloud Computing",
        color: "#2EC4B6",
        content: `<ul style="padding-left:20px; margin:0; list-style-type: disc;">
        <li>Extensive experience designing and deploying scalable cloud architectures on AWS.</li>
        <li>Hands-on with core AWS services: EC2, S3, Lambda, RDS, Redshift, VPC, CloudFront, and Route 53.</li>
        <li>Expertise in cloud security best practices, IAM policies, roles, and access control.</li>
        <li>Infrastructure as Code using Terraform and AWS CloudFormation for repeatable, scalable deployments.</li>
        <li>Cost optimization strategies including rightsizing, spot instances, and reserved instances.</li>
        <li>Implementing monitoring and alerting using AWS CloudWatch, SNS, and CloudTrail.</li>
        <li>Experience migrating legacy workloads to cloud-native services and containerized platforms.</li>
        <li>Hybrid cloud solutions and integrating on-premise with cloud infrastructure.</li>
        </ul>
        <script>console.log("Cloud computing script runs!");</script>`
      },
    ];

    const gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("orbLabelsUI", true, scene);
    gui.useInvalidateRectOptimization = false;

    const glyphs = [];

    // Overlay (restored)
    let overlay = document.getElementById("pillarOverlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "pillarOverlay";
      Object.assign(overlay.style, {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "rgba(10, 12, 15, 0.95)",
        padding: "24px",
        borderRadius: "14px",
        boxShadow: "0 0 20px rgba(0,255,100,0.3)",
        color: "#dbe9f8",
        maxWidth: "480px",
        maxHeight: "70vh",
        overflowY: "auto",
        zIndex: "9999",
        display: "none",
      });
      overlay.innerHTML = `
        <button id="pillarCloseBtn" style="
            position: absolute;
            top: 12px;
            right: 12px;
            background: transparent;
            border: none;
            font-size: 24px;
            font-weight: 700;
            color: var(--color-accent);
            cursor: pointer;
            line-height: 1;
        ">×</button>
        <h2 id="pillarTitle" style="margin-top: 24px; font-weight: 700;"></h2>
        <div id="pillarContent" style="margin-top: 12px; font-size: 16px; line-height: 1.4;"></div>
        `;
      const containerDiv = canvas.parentElement;
      containerDiv.appendChild(overlay);
      document.getElementById("pillarCloseBtn").onclick = () => {
        overlay.style.display = "none";
      };
    }

    function openPillarOverlay(title, color, content) {
      const titleElem = document.getElementById("pillarTitle");
      const contentElem = document.getElementById("pillarContent");
      if (!overlay || !titleElem || !contentElem) return;
      titleElem.textContent = title;
      titleElem.style.color = color;
      contentElem.innerHTML = content;
      Array.from(contentElem.querySelectorAll("script")).forEach((oldScript) => {
        const newScript = document.createElement("script");
        newScript.text = oldScript.textContent;
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
      overlay.style.display = "block";
    }

    // Pillars placement (restored clickable boxes) with "Explore" affordance
    const exploreLabels = []; // keep refs to dynamic textures to fade in/out
    pillars.forEach((p, i) => {
      const angle = (i / pillars.length) * Math.PI * 2;
      const box = BABYLON.MeshBuilder.CreateBox(`pillar_${i}`, { size: 0.6 }, scene);
      const m = new BABYLON.StandardMaterial(`pmat_${i}`, scene);
      m.emissiveColor = BABYLON.Color3.FromHexString(p.color).scale(0.55);
      m.diffuseColor = BABYLON.Color3.FromHexString(p.color).scale(0.05);
      m.alpha = 0.95;
      box.material = m;
      const radius = ORB_DIAMETER * 1.6;
      box.position = new BABYLON.Vector3(Math.cos(angle) * radius, 0.1, Math.sin(angle) * radius);
      box.parent = orbParent;
      glyphs.push(box);
      glow.addIncludedOnlyMesh(box);

            // --- label (text) ---
      const fontSize = 36;
      const label = p.fullLabel;
      const width = Math.min(1024, label.length * fontSize * 0.6);
      const height = fontSize * 2;
      const dt = new BABYLON.DynamicTexture(`labelDT_${i}`, { width, height }, scene, false);
      dt.hasAlpha = true;
      const font = `bold ${fontSize}px Arial`;
      // draw label text (transparent background)
      dt.drawText(label, null, fontSize + 10, font, BABYLON.Color3.FromHexString(p.color).toHexString(), "transparent", true);

      const planeWidth = width / 256;
      const planeHeight = height / 256;
      const labelPlane = BABYLON.MeshBuilder.CreatePlane(`labelPlane_${i}`, { width: planeWidth, height: planeHeight }, scene);
      labelPlane.parent = box;
      labelPlane.position = new BABYLON.Vector3(0, -0.5, 0);
      labelPlane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

      const labelMat = new BABYLON.StandardMaterial(`labelMat_${i}`, scene);
      // show the dynamic texture itself (colors)...
      labelMat.emissiveTexture = dt;
      // ...and use the texture alpha to drive the material opacity
      labelMat.opacityTexture = dt;
      // ensure alpha blending is used
      labelMat.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;
      labelMat.backFaceCulling = false;
      // keep diffuse neutral (won't show through where opacity exists)
      labelMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
      labelPlane.material = labelMat;

      // --- Explore small pill above each pillar (colored by pillar color) ---
      const exploreDT = new BABYLON.DynamicTexture(`exploreDT_${i}`, { width: 256, height: 64 }, scene, false);
      exploreDT.hasAlpha = true;

      // helper: pick readable contrast color for text
      function hexIsLight(hex) {
        const rgb = hexToRgbNormalized(hex); // returns normalized [r,g,b,a]
        if (!rgb) return false;
        const [r,g,b] = rgb;
        const luminance = 0.2126*r + 0.7152*g + 0.0722*b;
        return luminance > 0.6;
      }
      const exploreBg = p.color;
      const exploreTextCol = hexIsLight(exploreBg) ? "#000000" : "#FFFFFF";
      // draw pill: background is pillar color, text chosen for contrast
      // last param 'true' preserves alpha
      exploreDT.drawText("Explore →", null, 42, "bold 22px Arial", exploreTextCol, exploreBg, true);

      const explorePlane = BABYLON.MeshBuilder.CreatePlane(`explorePlane_${i}`, { width: 1.2, height: 0.28 }, scene);
      explorePlane.parent = box;
      explorePlane.position = new BABYLON.Vector3(0, 0.7, 0);
      explorePlane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

      const exploreMat = new BABYLON.StandardMaterial(`exploreMat_${i}`, scene);
      exploreMat.emissiveTexture = exploreDT;      // show texture directly (no black box)
      exploreMat.diffuseColor = BABYLON.Color3.FromHexString(p.color).scale(0.02); // small tint if lit
      exploreMat.alpha = 0.0; // start invisible, animate alpha to show/hide
      exploreMat.backFaceCulling = false;
      explorePlane.material = exploreMat;

      exploreLabels.push({ plane: explorePlane, mat: exploreMat, dt: exploreDT });

      // make the pillar pickable and show overlay on click
      box.isPickable = true;
      box.actionManager = new BABYLON.ActionManager(scene);
      box.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
          openPillarOverlay(p.fullLabel, p.color, p.content || `<p>No info available.</p>`);
        })
      );

      // cursor + hover animations: OnPointerOver/Out triggers
      box.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, () => {
          // cursor
          try { canvas.style.cursor = "pointer"; } catch (e) {}
          // scale pop
          box.scaling = box.scaling.multiplyByFloats(1.06, 1.06, 1.06);
          // fade in explore label (tween manually via alpha increment in render loop below)
          exploreMat.alpha = 0.0; // ensure starts at 0 and we animate up using a flag
          exploreMat._targetAlpha = 1.0;
        })
      );
      box.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, () => {
          try { canvas.style.cursor = "default"; } catch (e) {}
          box.scaling = box.scaling.multiplyByFloats(1 / 1.06, 1 / 1.06, 1 / 1.06);
          exploreMat._targetAlpha = 0.0;
        })
      );

      // ensure hover picks also show pointer style for accessibility with pointer events
      box.isPickable = true;
    });

    // ------- Packets -------
    const packetMaster = BABYLON.MeshBuilder.CreateSphere("pktMaster", { diameter: PACKET_SIZE }, scene);
    const pktMat = new BABYLON.StandardMaterial("pktMat", scene);
    // set default (night)
    pktMat.emissiveColor = new BABYLON.Color3(1, 0.82, 0.45);
    pktMat.diffuseColor = new BABYLON.Color3(0.08, 0.06, 0.03);
    pktMat.roughness = 0.22;
    packetMaster.material = pktMat;
    packetMaster.isVisible = false;
    glow.addIncludedOnlyMesh(packetMaster);

    // build packet tracks
    function buildCircularPath(radius, tilt = 0.12, samples = 48) {
      const path = [];
      for (let i = 0; i < samples; i++) {
        const t = i / (samples - 1);
        const angle = t * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(angle * 2) * tilt;
        path.push(new BABYLON.Vector3(x, y, z));
      }
      return path;
    }

    const packetTracks = [];
    for (let lane = 0; lane < maxLane; lane++) {
      const r = ORB_DIAMETER * (0.25 + lane * 0.28);
      const path = buildCircularPath(r, 0.075 + lane * 0.03, 72);
      for (let p = 0; p < Math.floor(NUM_PARTICLES / 3); p++) {
        const inst = packetMaster.createInstance(`pkt_lane${lane}_${p}`);
        inst.parent = orbParent;
        inst.isPickable = true;
        const offset = Math.random();
        const speed = ((maxLane - lane) * 0.18 + 0.25) * SPEED_SCALE * (0.8 + Math.random() * 0.5);
        packetTracks.push({ inst, path, offset, baseSpeed: speed, currentSpeed: speed, lane });
      }
    }

    // responsive scaling
    function responsiveScale() {
      const w = Math.max(600, canvas.clientWidth || 800);
      const s = Math.min(1.0, Math.max(0.6, w / 1200));
      orbParent.scaling = new BABYLON.Vector3(s, s, s);
    }
    responsiveScale();

    // ------- Dynamic state -------
    const dynamic = {
      time: 0,
      orbParent,
      core,
      coreMat,
      coreInstances,
      rings,
      packetTracks,
      glow,
      rimMat,
      shellMat,
      hemi,
      dir,
      pktMat,
      orbRotSpeed: BASE_ORB_ROT_SPEED,
      glowIntensity: BASE_GLOW_INTENSITY,
      ringSpeedFactor: 1.0,
      packetSpeedFactor: 1.0,
      coreEmissiveMultiplier: 0.9,
      target: {
        orbRotSpeed: BASE_ORB_ROT_SPEED,
        glowIntensity: BASE_GLOW_INTENSITY,
        ringSpeedFactor: 1.0,
        packetSpeedFactor: 1.0,
        coreEmissiveMultiplier: 0.9,
      },
      // parallax/hover state
      pointer: { x: 0, y: 0 }, // normalized -0.5..0.5
      pointerTarget: { x: 0, y: 0 },
      hover: false,
      hoverLerp: 0.06,
      parallaxOffset: new BABYLON.Vector3(0, 0, 0),
      parallaxTarget: new BABYLON.Vector3(0, 0, 0),
    };

    function lerp(a, b, t) { return a + (b - a) * t; }

    scene.onBeforeRenderObservable.add(() => {
      const dt = engine.getDeltaTime() / 1000;
      dynamic.time += dt;

      const LERP_SPEED = 0.08;
      dynamic.orbRotSpeed = lerp(dynamic.orbRotSpeed, dynamic.target.orbRotSpeed, LERP_SPEED);
      dynamic.glowIntensity = lerp(dynamic.glowIntensity, dynamic.target.glowIntensity, LERP_SPEED);
      dynamic.ringSpeedFactor = lerp(dynamic.ringSpeedFactor, dynamic.target.ringSpeedFactor, LERP_SPEED);
      dynamic.packetSpeedFactor = lerp(dynamic.packetSpeedFactor, dynamic.target.packetSpeedFactor, LERP_SPEED);
      dynamic.coreEmissiveMultiplier = lerp(dynamic.coreEmissiveMultiplier, dynamic.target.coreEmissiveMultiplier, LERP_SPEED);

      // parallax smoothing
      dynamic.pointer.x = lerp(dynamic.pointer.x, dynamic.pointerTarget.x, dynamic.hoverLerp);
      dynamic.pointer.y = lerp(dynamic.pointer.y, dynamic.pointerTarget.y, dynamic.hoverLerp);

      // compute parallax target for orbParent
      const px = dynamic.pointer.x * PARALLAX_DISTANCE;
      const py = dynamic.pointer.y * PARALLAX_DISTANCE * -1;
      dynamic.parallaxTarget.set(px, py - 0.05, 0);
      // use static Lerp and copyFrom (fixes lerpInPlace error)
      const newParallax = BABYLON.Vector3.Lerp(dynamic.parallaxOffset, dynamic.parallaxTarget, 0.12);
      dynamic.parallaxOffset.copyFrom(newParallax);

      // apply to orbParent
      if (dynamic.orbParent) {
        // position lerp using static Lerp and copyFrom
        const newPos = BABYLON.Vector3.Lerp(dynamic.orbParent.position, dynamic.parallaxOffset, 0.12);
        dynamic.orbParent.position.copyFrom(newPos);

        // slight tilt based on pointer
        dynamic.orbParent.rotation.x = lerp(dynamic.orbParent.rotation.x, dynamic.pointer.y * PARALLAX_ROTATE, 0.08);
        dynamic.orbParent.rotation.z = lerp(dynamic.orbParent.rotation.z, dynamic.pointer.x * PARALLAX_ROTATE * -0.5, 0.08);
      }

      dynamic.glow.intensity = dynamic.glowIntensity;
      dynamic.orbParent.rotation.y += dynamic.orbRotSpeed * dt;

      dynamic.rings.forEach((r, i) => {
        const speed = r.baseSpeed * dynamic.ringSpeedFactor;
        r.mesh.rotation.y += speed * dt;
        r.mesh.rotation.x = r.mesh.rotation.x + Math.sin(dynamic.time * (0.06 + i * 0.02)) * 0.0006;
        // subtle extra tilt while hovering to sell parallax
        r.mesh.rotation.z = lerp(r.mesh.rotation.z || 0, dynamic.pointer.x * 0.08 * (i % 2 ? -1 : 1), 0.05);
      });

      dynamic.core.rotation.y += 0.08 * dt;
      dynamic.coreInstances.forEach((ci, i) => {
        const flick = 0.85 + 0.35 * Math.abs(Math.sin(dynamic.time * (0.9 + i * 0.06)));
        ci.scaling.setAll(0.58 + flick * 0.02);
      });

      const baseEmissive = (isDay)
        ? BABYLON.Color3.FromHexString(DAY_CORE_HEX).scale(0.85)
        : new BABYLON.Color3(0.12, 0.9, 0.45);
      if (dynamic.coreMat) dynamic.coreMat.emissiveColor = baseEmissive.scale(dynamic.coreEmissiveMultiplier);

      dynamic.packetTracks.forEach((tItem) => {
        tItem.currentSpeed = tItem.baseSpeed * dynamic.packetSpeedFactor;
        const prog = (1 - ((dynamic.time * tItem.currentSpeed) + tItem.offset) % 1);
        const floatIdx = prog * (tItem.path.length - 1);
        const i0 = Math.floor(floatIdx);
        const i1 = Math.min(i0 + 1, tItem.path.length - 1);
        const subT = floatIdx - i0;
        const p0 = tItem.path[i0];
        const p1 = tItem.path[i1];
        const pos = BABYLON.Vector3.Lerp(p0, p1, subT);
        pos.y += Math.sin((prog + tItem.lane * 0.12) * Math.PI * 2) * 0.01;
        tItem.inst.position.copyFrom(pos);

        const dayBoost = (isDay) ? 1.18 : 1.0;
        tItem.inst.scaling = new BABYLON.Vector3(PACKET_SIZE, PACKET_SIZE, PACKET_SIZE)
          .scale((0.9 + Math.abs(Math.sin(prog * Math.PI * 2)) * 0.4) * dayBoost);
      });

      // animate explore labels alpha targets (simple smoothing)
      exploreLabels.forEach((el) => {
        const current = el.mat.alpha || 0;
        const target = typeof el.mat._targetAlpha === "number" ? el.mat._targetAlpha : 0;
        el.mat.alpha = lerp(current, target, 0.14);
      });
    });

    engine.runRenderLoop(() => scene.render());
    window.addEventListener("resize", onResize);
    function onResize() {
      responsiveScale();
      engine.resize();
    }

    scene.__dynamic = dynamic;

    // ------- Apply Day/Night visual adjustments (after rings/pkts created) -------
    (function applyThemeTuning() {
      if (isDay) {
        // Day: make core muted / theme-complementary
        coreMat.diffuseColor = new BABYLON.Color3(0.18, 0.20, 0.18); // darker grey-green base
        coreMat.emissiveColor = BABYLON.Color3.FromHexString(DAY_CORE_HEX).scale(0.6);
        coreMat.roughness = 0.55;
        coreMat.metallic = 0.02;
        core.material = coreMat;

        glow.intensity = 0.25;
        glow.blurKernelSize = 18;
        try { glow.removeIncludedOnlyMesh(core); } catch (e) {}

        rings.forEach((r) => {
          if (r.mat) {
            const col = BABYLON.Color3.FromHexString(r.color);
            r.mat.emissiveColor = col.scale(0.42);
            r.mat.diffuseColor = col.scale(0.08);
            r.mat.alpha = 0.46;
          }
        });

        pktMat.emissiveColor = new BABYLON.Color3(0.16, 0.16, 0.16);
        pktMat.diffuseColor = new BABYLON.Color3(0.52, 0.52, 0.52);
        pktMat.roughness = 0.6;

        shellMat.alpha = 0.0;
        rimMat.alpha = 0.0;

        hemi.intensity = 1.05;
        dir.intensity = 0.85;
        dir.direction = new BABYLON.Vector3(-0.5, -1.0, -0.15);

      } else {
        coreMat.diffuseColor = new BABYLON.Color3(0.04, 0.06, 0.06);
        coreMat.emissiveColor = new BABYLON.Color3(0.12, 0.9, 0.45).scale(0.9);
        coreMat.roughness = 0.12;
        coreMat.metallic = 0.06;
        core.material = coreMat;

        try { glow.addIncludedOnlyMesh(core); } catch (e) {}
        glow.intensity = BASE_GLOW_INTENSITY;
        glow.blurKernelSize = 64;

        rings.forEach((r) => {
          if (r.mat) {
            r.mat.emissiveColor = BABYLON.Color3.FromHexString(r.color).scale(0.22);
            r.mat.alpha = 0.38;
            r.mat.diffuseColor = BABYLON.Color3.FromHexString(r.color).scale(0.02);
          }
        });

        pktMat.emissiveColor = new BABYLON.Color3(1, 0.82, 0.45);
        pktMat.diffuseColor = new BABYLON.Color3(0.08, 0.06, 0.03);
        pktMat.roughness = 0.22;

        hemi.intensity = 0.9;
        dir.intensity = 0.45;
      }

      // push material refs into dynamic for runtime use
      dynamic.coreMat = coreMat;
      dynamic.pktMat = pktMat;
      dynamic.rimMat = rimMat;
      dynamic.shellMat = shellMat;
      dynamic.rings = rings;
    })();

    // initial visibility tweak for day (keeps rings & packets visible)
    (function initialVisibilityAdjust() {
      if (isDay) {
        dynamic.target.glowIntensity = 0.9;
        dynamic.glow.intensity = 0.9;
        dynamic.rings.forEach((r) => {
          if (r.mat) {
            const col = BABYLON.Color3.FromHexString(r.color);
            r.mat.emissiveColor = col.scale(0.6);
            r.mat.diffuseColor = col.scale(0.12);
            r.mat.alpha = 0.5;
          }
        });
      } else {
        dynamic.target.glowIntensity = BASE_GLOW_INTENSITY;
      }
    })();

    // ------- Hover / Pointer interactions (parallax + boost) -------
    function setPointerFromEvent(evt) {
      const rect = canvas.getBoundingClientRect();
      const x = ((evt.clientX - rect.left) / rect.width) - 0.5; // -0.5..0.5
      const y = ((evt.clientY - rect.top) / rect.height) - 0.5;
      dynamic.pointerTarget.x = Math.max(-0.5, Math.min(0.5, x));
      dynamic.pointerTarget.y = Math.max(-0.5, Math.min(0.5, y));
    }

    function handlePointerEnter(e) {
      dynamic.hover = true;
      // push targets for boost
      dynamic.target.orbRotSpeed = BASE_ORB_ROT_SPEED * HOVER_BOOST;
      dynamic.target.glowIntensity = dynamic.glowIntensity * Math.max(1.2, HOVER_BOOST * 0.6);
      dynamic.target.ringSpeedFactor = 1.0 * HOVER_BOOST;
      dynamic.target.packetSpeedFactor = 1.0 * HOVER_BOOST;
      dynamic.target.coreEmissiveMultiplier = Math.min(1.6, dynamic.coreEmissiveMultiplier * 1.4);
      dynamic.hoverLerp = 0.12;
    }
    function handlePointerLeave(e) {
      dynamic.hover = false;
      // revert targets
      dynamic.target.orbRotSpeed = BASE_ORB_ROT_SPEED;
      dynamic.target.glowIntensity = BASE_GLOW_INTENSITY;
      dynamic.target.ringSpeedFactor = 1.0;
      dynamic.target.packetSpeedFactor = 1.0;
      dynamic.target.coreEmissiveMultiplier = 0.9;
      // reset pointer target gently to center
      dynamic.pointerTarget.x = 0;
      dynamic.pointerTarget.y = 0;
      dynamic.hoverLerp = 0.06;
    }

    // attach events
    canvas.addEventListener("pointermove", setPointerFromEvent);
    canvas.addEventListener("pointerenter", handlePointerEnter);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    // also consider pointerdown/up for stronger interaction (optional)
    function handlePointerDown() {
      // small temporary nudge
      dynamic.target.orbRotSpeed *= 1.3;
      dynamic.target.glowIntensity *= 1.1;
    }
    canvas.addEventListener("pointerdown", handlePointerDown);

    // cleanup
    return () => {
      window.removeEventListener("resize", onResize);
      try { canvas.removeEventListener("pointermove", setPointerFromEvent); } catch (e) {}
      try { canvas.removeEventListener("pointerenter", handlePointerEnter); } catch (e) {}
      try { canvas.removeEventListener("pointerleave", handlePointerLeave); } catch (e) {}
      try { canvas.removeEventListener("pointerdown", handlePointerDown); } catch (e) {}
      try { scene.dispose(); } catch (e) {}
      try { engine.dispose(); } catch (e) {}
    };
  }, [isDay]); // rebuild scene when theme detection changes

  // Visual-only Day/Night adjustments (keeps animation)
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const dyn = scene.__dynamic;
    if (!dyn) return;

    // always set explicit clear color
    const dayRgb = hexToRgbNormalized(DAY_BG_HEX);
    const nightRgb = hexToRgbNormalized(NIGHT_BG_HEX);
    const bgRgb = isDay ? dayRgb : nightRgb;
    if (bgRgb) scene.clearColor = new BABYLON.Color4(bgRgb[0], bgRgb[1], bgRgb[2], bgRgb[3]);

    if (isDay) {
      if (dyn.hemi) dyn.hemi.intensity = 1.05;
      if (dyn.dir) {
        dyn.dir.intensity = 0.85;
        dyn.dir.direction = new BABYLON.Vector3(-0.5, -1.0, -0.15);
      }
      dyn.target.glowIntensity = Math.max(0.6, dyn.glowIntensity * 0.6);

      if (dyn.coreMat) {
        dyn.coreMat.diffuseColor = new BABYLON.Color3(0.18, 0.20, 0.18);
        dyn.coreMat.emissiveColor = BABYLON.Color3.FromHexString(DAY_CORE_HEX).scale(0.6);
        dyn.coreMat.roughness = 0.6;
      }

      if (dyn.pktMat) {
        dyn.pktMat.emissiveColor = new BABYLON.Color3(0.16, 0.16, 0.16);
        dyn.pktMat.diffuseColor = new BABYLON.Color3(0.52, 0.52, 0.52);
        dyn.pktMat.roughness = 0.6;
      }

      if (dyn.rings && dyn.rings.forEach) {
        dyn.rings.forEach((r) => {
          if (r.mat) {
            const col = BABYLON.Color3.FromHexString(r.color);
            r.mat.emissiveColor = col.scale(0.42);
            r.mat.alpha = 0.46;
            r.mat.diffuseColor = col.scale(0.08);
          }
        });
      }
    } else {
      if (dyn.hemi) dyn.hemi.intensity = 0.9;
      if (dyn.dir) dyn.dir.intensity = 0.45;
      dyn.target.glowIntensity = 0.7;

      if (dyn.coreMat) {
        dyn.coreMat.emissiveColor = new BABYLON.Color3(0.12, 0.9, 0.45).scale(0.9);
        dyn.coreMat.diffuseColor = new BABYLON.Color3(0.04, 0.06, 0.06);
        dyn.coreMat.roughness = 0.12;
      }
      if (dyn.pktMat) {
        dyn.pktMat.emissiveColor = new BABYLON.Color3(1, 0.82, 0.45);
        dyn.pktMat.diffuseColor = new BABYLON.Color3(0.08, 0.06, 0.03);
      }
      if (dyn.rings && dyn.rings.forEach) {
        dyn.rings.forEach((r) => {
          if (r.mat) {
            r.mat.emissiveColor = BABYLON.Color3.FromHexString(r.color).scale(0.22);
            r.mat.alpha = 0.38;
            r.mat.diffuseColor = BABYLON.Color3.FromHexString(r.color).scale(0.02);
          }
        });
      }
    }
  }, [isDay]);

  // UI colors for the overlay text, theme-aware
  const headingColor = isDay ? "#083030" : "#dbe9f8"; // dark teal-ish on day, pale on night
  const subColor = isDay ? "#6b7280" : "rgba(219,233,248,0.8)"; // muted gray on day, pale translucent on night

  // UI
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "500px", display: "block", borderRadius: 12 }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: "32px",
          pointerEvents: "none",
        }}
      >
        <div style={{ textAlign: "center", pointerEvents: "auto" }}>
          <h1 style={{ margin: 0, fontSize: 28, letterSpacing: 0.6, fontWeight: 700, color: headingColor }}>
            <span style={{ display: "inline-block", opacity: 0.96 }}>Speed.</span>{" "}
            <span style={{ display: "inline-block", opacity: 0.96 }}>Scalability.</span>{" "}
            <span style={{ display: "inline-block", color: "#9be8b6", opacity: isDay ? 0.95 : 0.98 }}>
              Storytelling.
            </span>
          </h1>
          <p style={{ marginTop: 10, opacity: 0.9, color: subColor }}>
            Data pipelines • Cloud-native architectures • Realtime ML
          </p>
        </div>
      </div>

      {/* Floating status (Boost removed) */}
      <div style={{
        position: "absolute",
        right: 16,
        top: 16,
        zIndex: 9999,
        pointerEvents: "auto",
        display: "flex",
        gap: 10,
        alignItems: "center"
      }}>
      </div>
    </div>
  );
}
