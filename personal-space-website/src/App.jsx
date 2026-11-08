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

    if (
      !canvas ||
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ===== SPRING CONFIGURATION =====
    const TRAIL_COUNT = 1;
    const NODE_COUNT = 42;

    const FRICTION = 0.72;
    const DAMPENING = 0.19;
    const TENSION = 0.965;

    const MAX_FRAME_DELTA = 32;
    const STOP_THRESHOLD = 0.025;

    // ===== VISUAL CONFIGURATION =====
    const COLORS = {
      violet: "rgba(139, 92, 246, 0.8)",
      lavender: "rgba(167, 139, 250, 0.85)",
      softLavender: "rgba(196, 181, 253, 0.8)",
      white: "rgba(255, 250, 255, 0.95)"
    };

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = 1;

    let animationFrame = null;
    let lastFrame = 0;
    let initialized = false;

    const pointer = {
      x: 0,
      y: 0
    };

    // Each trail has its own spring behavior.
    const trails = Array.from({ length: TRAIL_COUNT }, (_, index) => ({
      spring: 0.34 + (index / TRAIL_COUNT) * 0.045,
      friction: FRICTION + index * 0.008,

      nodes: Array.from({ length: NODE_COUNT }, () => ({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0
      }))
    }));

    // ===== CANVAS SETUP =====
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

    // ===== SMOOTH CURVE =====
    const drawSmoothCurve = (nodes) => {
      if (nodes.length < 3) return;

      ctx.beginPath();

      ctx.moveTo(nodes[0].x, nodes[0].y);

      let i = 1;

      for (; i < nodes.length - 2; i++) {
        const current = nodes[i];
        const next = nodes[i + 1];

        const midX = (current.x + next.x) / 2;
        const midY = (current.y + next.y) / 2;

        ctx.quadraticCurveTo(
          current.x,
          current.y,
          midX,
          midY
        );
      }

      const p1 = nodes[i];
      const p2 = nodes[i + 1];

      ctx.quadraticCurveTo(
        p1.x,
        p1.y,
        p2.x,
        p2.y
      );
    };

    // ===== DRAW ONE SPRING TRAIL =====
    const drawTrail = (trail, index) => {
      const nodes = trail.nodes;

      const head = nodes[0];
      const tail = nodes[nodes.length - 1];

      const distance = Math.hypot(
        head.x - tail.x,
        head.y - tail.y
      );

      if (distance < 0.3) return;

      const strength = 1 - index / TRAIL_COUNT;

      // Gradient follows the trail direction.
      const gradient = ctx.createLinearGradient(
        head.x,
        head.y,
        tail.x,
        tail.y
      );

      gradient.addColorStop(
        0,
        `rgba(255, 255, 255, ${0.78 * strength})`
      );

      gradient.addColorStop(
        0.12,
        `rgba(196, 181, 253, ${0.7 * strength})`
      );

      gradient.addColorStop(
        0.48,
        `rgba(167, 139, 250, ${0.38 * strength})`
      );

      gradient.addColorStop(
        1,
        "rgba(139, 92, 246, 0)"
      );

      ctx.save();

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalCompositeOperation = "lighter";

      drawSmoothCurve(nodes);

      // Outer purple bloom.
      ctx.save();
      ctx.strokeStyle = COLORS.violet;
      ctx.globalAlpha = 0.16 * strength;
      ctx.lineWidth = 2.0;
      ctx.shadowColor = "#8B5CF6";
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.restore();

      // Main lavender trail.
      drawSmoothCurve(nodes);
      ctx.strokeStyle = gradient;
      ctx.globalAlpha = 0.75;
      ctx.lineWidth = 1.9;
      ctx.shadowColor = "#A78BFA";
      ctx.shadowBlur = 7;
      ctx.stroke();

      // Fine white-lavender center line.
      if (index < 2) {
        drawSmoothCurve(nodes);
        ctx.strokeStyle = COLORS.white;
        ctx.globalAlpha = 0.18 + strength * 0.25;
        ctx.lineWidth = 0.7;
        ctx.shadowColor = "#E9DDFF";
        ctx.shadowBlur = 4;
        ctx.stroke();
      }

      ctx.restore();
    };

    // ===== SPRING PHYSICS =====
    const updateTrail = (trail, delta) => {
      let spring = trail.spring;
      const nodes = trail.nodes;

      const first = nodes[0];

      first.vx += (pointer.x - first.x) * spring;
      first.vy += (pointer.y - first.y) * spring;

      let motion = 0;

      for (let i = 0; i < nodes.length; i++) {
        const current = nodes[i];

        if (i > 0) {
          const previous = nodes[i - 1];

          current.vx +=
            (previous.x - current.x) * spring;

          current.vy +=
            (previous.y - current.y) * spring;

          current.vx += previous.vx * DAMPENING;
          current.vy += previous.vy * DAMPENING;
        }

        current.vx *= Math.pow(trail.friction, delta);
        current.vy *= Math.pow(trail.friction, delta);

        current.x += current.vx * delta;
        current.y += current.vy * delta;

        motion = Math.max(
          motion,
          Math.abs(current.vx),
          Math.abs(current.vy)
        );

        spring *= TENSION;
      }

      return motion;
    };

    // ===== CURSOR MOVEMENT =====
    const handlePointerMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;

      if (!initialized) {
        initialized = true;

        trails.forEach(trail => {
          trail.nodes.forEach(node => {
            node.x = pointer.x;
            node.y = pointer.y;
            node.vx = 0;
            node.vy = 0;
          });
        });
      }

      if (animationFrame === null) {
        animationFrame = requestAnimationFrame(render);
      }
    };

    // ===== RENDER LOOP =====
    const render = (now) => {
      animationFrame = null;

      const delta = lastFrame
        ? Math.min((now - lastFrame) / 16.67, MAX_FRAME_DELTA / 16.67)
        : 1;

      lastFrame = now;

      ctx.clearRect(0, 0, width, height);

      let totalMotion = 0;

      trails.forEach((trail, index) => {
        const motion = updateTrail(trail, delta);

        totalMotion = Math.max(totalMotion, motion);

        drawTrail(trail, index);
      });

      // Sharp, tiny cursor highlight.
      const head = trails[0].nodes[0];

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const headGlow = ctx.createRadialGradient(
        head.x,
        head.y,
        0,
        head.x,
        head.y,
        5
      );

      headGlow.addColorStop(
        0,
        "rgba(255,255,255,0.95)"
      );

      headGlow.addColorStop(
        0.3,
        "rgba(196,181,253,0.55)"
      );

      headGlow.addColorStop(
        1,
        "rgba(139,92,246,0)"
      );

      ctx.beginPath();
      ctx.arc(head.x, head.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = headGlow;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(head.x, head.y, 1.15, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.shadowColor = "#C4B5FD";
      ctx.shadowBlur = 5;
      ctx.fill();

      ctx.restore();

      // Stop rendering once the spring system settles.
      if (totalMotion > STOP_THRESHOLD) {
        animationFrame = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
        lastFrame = 0;
      }
    };

    // ===== INITIALIZATION =====
    resize();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true
    });

    // ===== CLEANUP =====
    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }

      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);

      trails.forEach(trail => {
        trail.nodes.length = 0;
      });
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