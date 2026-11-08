import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Activity,
  ArrowUpRight,
  Check,
  Circle,
  Copy,
  Gamepad2,
  MapPin,
  Music2,
  Radio,
  Sparkles,
  Instagram,
  Disc3,
  MessageCircle,
  Volume2,
  VolumeX
} from "lucide-react";
import {
  siInstagram,
  siTiktok,
  siSpotify,
  siRiotgames
} from "simple-icons";
import { config } from "./config";
import { useLanyard } from "./useLanyard";

const statusMap = {
  online: { label: "online", color: "#5de0a0" },
  idle: { label: "idle", color: "#f5c451" },
  dnd: { label: "do not disturb", color: "#f16b76" },
  offline: { label: "offline", color: "#777783" }
};

const socialIcons = {
  Instagram: siInstagram,
  TikTok: siTiktok,
  Spotify: siSpotify,
  Riot: siRiotgames,
};
function DiscordCard({ presence, connection }) {
  const user = presence?.discord_user;
  const status = statusMap[presence?.discord_status || "offline"];
  const activities = presence?.activities || [];
  const spotify = presence?.spotify;
  const game = activities.find(a => a.type === 0);
  const custom = activities.find(a => a.type === 4);
  const otherActivity = activities.find(a => a.type !== 0 && a.type !== 4);

  const avatar = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}?size=256`
    : config.avatarUrl;

  const activityLine = spotify
    ? `Listening to ${spotify.song}`
    : game
      ? `Playing ${game.name}`
      : otherActivity
        ? otherActivity.name
        : "No activity shared right now";

  return (
    
<section className="panel discord-panel">

  <div className="discord-user">

    {/* Discord avatar */}
    <div className="avatar-wrap">
      <img
        src={avatar}
        alt="Discord avatar"
        onError={e => {
          e.currentTarget.src = config.avatarUrl;
        }}
      />
      <i
        className="status-dot"
        style={{ background: status.color }}
      />
    </div>

    {/* Discord user information */}
    <div className="user-copy">
      <strong>
        {user?.global_name || user?.display_name || config.displayName}
      </strong>

      <span>
        {user?.username ? `@${user.username}` : config.handle}
      </span>

      <a
        className="discord-view-profile"
        href={`https://discord.com/users/${config.discordUserId}`}
        target="_blank"
        rel="noreferrer"
      >
        VIEW PROFILE
      </a>

      {status.label !== "do not disturb" && (
        <small>
          <i style={{ background: status.color }} />
          {status.label}
        </small>
      )}
    </div>

  </div>
            {(spotify || game || otherActivity) && (
  <div className="activity-box">

    {/* Album bên trái khi nghe Spotify */}
    {spotify?.album_art_url ? (
      <img
        className="album-thumb"
        src={spotify.album_art_url}
        alt="Spotify album cover"
      />
    ) : (
      <div className="activity-icon">
        {game ? <Gamepad2 /> : <Activity />}
      </div>
    )}

    <div className="activity-copy">
      <span className="eyebrow">CURRENT ACTIVITY</span>
      <strong>{activityLine}</strong>
      <small>
        {spotify
          ? spotify.artist
          : game?.details || otherActivity?.state || " "}
      </small>
    </div>

  </div>
)}      {spotify && (
        <div className="spotify-progress">
          <div>
            <span>{spotify.song}</span>
            <span>{spotify.artist}</span>
          </div>
          <div className="progress-track">
            <span style={{
              width: `${Math.min(100, (spotify.timestamps?.start && spotify.timestamps?.end
                ? ((Date.now() - spotify.timestamps.start) /
                  (spotify.timestamps.end - spotify.timestamps.start)) * 100
                : 0))}%`
            }} />
          </div>
        </div>
      )}

      {!presence && (
  <p className="hint">
    Discord presence will appear once your account is available through Lanyard.
  </p>
)}

    </section>
  );
}
 
function ProfileCardFooter({ presence }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(currentTime);

  const device = presence?.active_on_discord_mobile
    ? "Mobile"
    : presence?.active_on_discord_desktop
      ? "Desktop"
      : "";

  return (
    <div className="discord-foot profile-card-foot">
      <span className="widget-clock">
        {formattedTime} GMT+7
      </span>

      <span>{device}</span>
    </div>
  );
}

function RiotIdCard() {
  return (
    <a
      className="riot-id-card"
      href="https://tracker.gg/valorant/profile/riot/wza%232502/overview"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="View wza#2502 on Valorant Tracker"
    >
      <div className="riot-id-logo riot-id-clove-wrap">
  <img
    className="riot-id-clove"
    src="https://valo.town/assets/images/agents/1dbf2edd-4729-0984-3115-daa5eed44993/displayiconsmall.png"
    alt="Clove VALORANT"
  />
</div>      <div className="riot-id-info">
        <span className="riot-id-label">VALORANT</span>
        <strong>wza</strong>
      </div>

      <span className="riot-id-tag">RIOT ID</span>
    </a>
  );
}




function CursorEffects() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ===== CONFIGURATION =====
    const NODE_COUNT = 20;
    const SPRING = 0.35;
    const FRICTION = 0.55;
    const DAMPENING = 0.16;
    const TENSION = 0.98;

    const FADE_DELAY = 5000;
    const FADE_DURATION = 450;
    const MAX_IDLE_TIME = FADE_DELAY + FADE_DURATION;

    const GLOW_COLOR = "#8B5CF6";
    const LAVENDER_COLOR = "#C4B5FD";

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = 1;

    let target = { x: 0, y: 0 };
    let nodes = [];

    let initialized = false;
    let animationFrame = null;
    let lastFrame = 0;
    let lastMoveAt = 0;

    // ===== CREATE NODES =====
    const createNodes = (x, y) =>
      Array.from({ length: NODE_COUNT }, () => ({
        x,
        y,
        vx: 0,
        vy: 0
      }));

    // ===== CANVAS RESIZE =====
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
    };

    // ===== SPRING PHYSICS =====
    const updateNodes = (delta) => {
      let spring = SPRING;
      let maxMotion = 0;

      const head = nodes[0];

      // First node follows the mouse.
      head.vx += (target.x - head.x) * spring * delta;
      head.vy += (target.y - head.y) * spring * delta;

      for (let i = 0; i < nodes.length; i++) {
        const current = nodes[i];

        // Each node follows the node ahead of it.
        if (i > 0) {
          const previous = nodes[i - 1];

          current.vx +=
            (previous.x - current.x) * spring * delta;

          current.vy +=
            (previous.y - current.y) * spring * delta;

          current.vx += previous.vx * DAMPENING * delta;
          current.vy += previous.vy * DAMPENING * delta;
        }

        const damping = Math.pow(FRICTION, delta);

        current.vx *= damping;
        current.vy *= damping;

        current.x += current.vx * delta;
        current.y += current.vy * delta;

        maxMotion = Math.max(
          maxMotion,
          Math.abs(current.vx),
          Math.abs(current.vy)
        );

        // Spring force gradually decreases toward the tail.
        spring *= TENSION;
      }

      return maxMotion;
    };

    // ===== BUILD ONE SMOOTH CURVE =====
    const drawCurve = () => {
      if (nodes.length < 3) return;

      ctx.beginPath();
      ctx.moveTo(nodes[0].x, nodes[0].y);

      for (let i = 1; i < nodes.length - 1; i++) {
        const current = nodes[i];
        const next = nodes[i + 1];

        const midX = (current.x + next.x) * 0.5;
        const midY = (current.y + next.y) * 0.5;

        ctx.quadraticCurveTo(
          current.x,
          current.y,
          midX,
          midY
        );
      }

      const last = nodes[nodes.length - 1];

      ctx.lineTo(last.x, last.y);
    };

    // ===== DRAW COMET =====
    const drawComet = (opacity) => {
      const head = nodes[0];
      const tail = nodes[nodes.length - 1];

      const gradient = ctx.createLinearGradient(
        tail.x,
        tail.y,
        head.x,
        head.y
      );

      gradient.addColorStop(0, "rgba(139,92,246,0)");
      gradient.addColorStop(0.35, "rgba(139,92,246,0.13)");
      gradient.addColorStop(0.72, "rgba(167,139,250,0.38)");
      gradient.addColorStop(1, "rgba(237,230,255,0.78)");

      ctx.save();

      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = opacity;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Outer glow: same path, not an additional trail.
      drawCurve();
      ctx.strokeStyle = GLOW_COLOR;
      ctx.lineWidth = 2.6;
      ctx.shadowColor = GLOW_COLOR;
      ctx.shadowBlur = 6;
      ctx.stroke();

      // Main lavender core.
      drawCurve();
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.15;
      ctx.shadowColor = LAVENDER_COLOR;
      ctx.shadowBlur = 2;
      ctx.stroke();

      ctx.restore();
    };

    // ===== RENDER LOOP =====
    const render = (now) => {
      animationFrame = null;

      ctx.clearRect(0, 0, width, height);

      if (!initialized || nodes.length === 0) return;

      const elapsed = now - lastMoveAt;

      // Stop and clear after the trail has faded.
      if (elapsed >= MAX_IDLE_TIME) {
        nodes = [];
        initialized = false;
        lastFrame = 0;
        return;
      }

      const delta = lastFrame
        ? Math.min((now - lastFrame) / 16.667, 1.5)
        : 1;

      lastFrame = now;

      const motion = updateNodes(delta);

      const fadeProgress = Math.max(
        0,
        (elapsed - FADE_DELAY) / FADE_DURATION
      );

      const opacity = 1 - fadeProgress;

      if (nodes.length >= 3 && opacity > 0) {
        drawComet(opacity);
      }

      // Continue only while the spring settles or the trail fades.
      if (
        motion > 0.008 ||
        elapsed < MAX_IDLE_TIME
      ) {
        animationFrame = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
        nodes = [];
        initialized = false;
        lastFrame = 0;
      }
    };

    // ===== MOUSE MOVEMENT =====
    const handleMouseMove = (event) => {
      const x = event.clientX;
      const y = event.clientY;

      target.x = x;
      target.y = y;

      // Initialize all nodes at the first mouse position.
      if (!initialized) {
        nodes = createNodes(x, y);
        initialized = true;
      }

      lastMoveAt = performance.now();

      if (animationFrame === null) {
        animationFrame = requestAnimationFrame(render);
      }
    };

    // ===== INITIALIZATION =====
    resize();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove, {
      passive: true
    });

    // ===== CLEANUP =====
    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }

      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);

      nodes = [];
      initialized = false;

      ctx.clearRect(0, 0, width, height);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="cursor-effects"
      aria-hidden="true"
    />
  );
}
function App() {
  // Discord data
  const { data, connection } = useLanyard(config.discordUserId);

  // Refs
  const musicRef = useRef(null);
  const profileRef = useRef(null);

  // States
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedRiot, setCopiedRiot] = useState(false);

  // Discord avatar decoration
const decorationAsset =
  data?.discord_user?.avatar_decoration_data?.asset;

const decorationUrl = decorationAsset
  ? `https://cdn.discordapp.com/avatar-decoration-presets/${decorationAsset}.png?size=256`
  : "";
  // Music
  const toggleMusic = async () => {
    if (!musicRef.current) return;

    try {
      if (isPlaying) {
        musicRef.current.pause();
      } else {
        await musicRef.current.play();
      }
    } catch (error) {
      console.error("Music playback failed:", error);
    }
  };

  // Profile movement - 3D tilt
const handleProfileMove = (e) => {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  card.style.setProperty("--mouse-x", `${x}px`);
  card.style.setProperty("--mouse-y", `${y}px`);

  const rotateY = (x / rect.width - 0.5) * 10;
  const rotateX = (0.5 - y / rect.height) * 6;

  card.style.transform =
    `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
};

const handleProfileLeave = (e) => {
  const card = e.currentTarget;

  card.style.removeProperty("--mouse-x");
  card.style.removeProperty("--mouse-y");

  card.style.transform =
    "perspective(1200px) rotateX(0deg) rotateY(0deg)";
};  // Intro transition
  const [introVisible, setIntroVisible] = useState(true);
  const [introLeaving, setIntroLeaving] = useState(false);
const enterWebsite = () => {
  if (introLeaving) return;

  musicRef.current?.play()
    .then(() => setIsPlaying(true))
    .catch((error) => {
      console.log("Music playback failed:", error);
      setIsPlaying(false);
    });

  setIntroLeaving(true);

  window.setTimeout(() => {
    setIntroVisible(false);
  }, 1000);
};  const [now] = useState(() => new Date());

  const time = useMemo(
    () =>
      now.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit"
      }),
    [now]
  );

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(config.discordUserId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      console.error("Cannot copy Discord ID:", error);
    }
  };

  return (
  <>
<button
  className="music-toggle"
  onClick={toggleMusic}
  aria-label={isPlaying ? "Pause music" : "Play music"}
  title={isPlaying ? "Pause music" : "Play music"}
>
  {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
</button>

<audio
  ref={musicRef}
  src="/background-music.mp3"
  loop
  preload="auto"
  onPlay={() => setIsPlaying(true)}
  onPause={() => setIsPlaying(false)}
/>    {/* Background video */}
      <video
        className="background-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>

      <div className="background-overlay" />
<div className="ambient-rays" />
<CursorEffects />
      {/* Intro screen */}
      {introVisible && (
        <div
          className={`intro-screen ${introLeaving ? "intro-exit" : ""}`}
          onClick={enterWebsite}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              enterWebsite();
            }
          }}
        >
          <div className="intro-stars" />
          <p className="intro-label">DEV BY NQG</p>
          <div className="signature">𝔀𝔃𝓪</div>
          <p className="intro-hint">CLICK ANYWHERE TO ENTER</p>
        </div>
      )}

      {/* Main website */}
      <main className={`site-shell ${!introVisible ? "website-entered" : ""}`}>        <div
          className="cover"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(8,8,12,.16), #09090d 100%), url(${config.coverUrl})`
          }}
        />

        <div className="grain" />

        <header className="topbar">
          <a className="wordmark" href="#">
            <span className="wordmark-dot" />
            {config.displayName}
            <span className="wordmark-suffix">.space</span>
          </a>

          <div className="topbar-right">
            <span className="local-time">
              <Circle size={7} fill="currentColor" /> {time} GMT+7
            </span>
            <span className="topbar-line" />
            <span className="topbar-label">PERSONAL WEBSITE</span>
          </div>
        </header>

        <div className="content">
          <div className="profile-drop-wrap">
  <div
    className="profile-card"
    ref={profileRef}
    onMouseMove={handleProfileMove}
    onMouseLeave={handleProfileLeave}
  >            <section className="hero">
              <div className="hero-avatar">
  <img
    className="hero-avatar-image"
    src={config.avatarUrl}
    alt="Profile avatar"
  />

  {decorationUrl && (
    <img
      className="hero-avatar-decoration"
      src={decorationUrl}
      alt=""
      aria-hidden="true"
    />
  )}

  <span className="avatar-spark">
    <Sparkles size={13} />
  </span>
</div>
             <div className="profile-info">
  <h1 className="brand-name">
    {config.displayName}
    <span className="title-period">.</span>
  </h1>                <p className="handle">{config.handle}</p>

<div className="profile-location">
  <MapPin size={13} />
  <span>{config.location}</span>
</div>
<p className="tagline">{config.tagline}</p> 
<div className="social-row">
  {config.socials.map((item) => {
    const icon = socialIcons[item.label];

    return (
      <a
        key={item.label}
        href={item.label === "Riot" ? undefined : item.href}
        onClick={async (e) => {
          if (item.label === "Riot") {
            e.preventDefault();

            try {
              await navigator.clipboard.writeText(item.value);
              setCopiedRiot(true);

              window.setTimeout(() => {
                setCopiedRiot(false);
              }, 2000);
            } catch (error) {
              console.error("Cannot copy Riot ID:", error);
            }
          }
        }}
        target={item.label === "Riot" ? undefined : "_blank"}
        rel="noreferrer"
        className="social-link social-icon-link"
        aria-label={item.label}
        title={item.label === "Riot" ? "Copy Riot ID" : item.label}
      >
        {icon && (
          <svg
            viewBox="0 0 24 24"
            width="27"
            height="27"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d={icon.path} />
          </svg>
        )}
      </a>
    );
  })}
</div>

{copiedRiot && (
  <div className="copy-toast">
    <Check size={14} />
    Đã copy Riot ID!
  </div>
)}
          </div>
            </section>

            <div className="dashboard">
  <DiscordCard
    presence={data}
    connection={connection}
  />

  <RiotIdCard />
</div>

<ProfileCardFooter presence={data} />        </div>
        </div>

        <footer className="footer">            <div className="footer-message">
              These are our only socials. Beware of impersonators.
            </div>

            <div className="footer-copyright">
              Copyright © {new Date().getFullYear()} nqg. All rights reserved.
            </div>
          </footer>
        </div>
            </main>
    </>
  );
}

export default App;