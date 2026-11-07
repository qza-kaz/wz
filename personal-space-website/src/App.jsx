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
        <div className="avatar-wrap">
          <img src={avatar} alt="Discord avatar" onError={e => { e.currentTarget.src = config.avatarUrl; }} />
          <i className="status-dot" style={{ background: status.color }} />
        </div>
        <div className="user-copy">
          <strong>{user?.global_name || user?.display_name || config.displayName}</strong>
          <span>{user?.username ? `@${user.username}` : config.handle}</span>
          {status.label !== "do not disturb" && (
  <small>
    <i style={{ background: status.color }} />
    {status.label}
  </small>
)}
        </div>
        <a className="icon-button" href={`https://discord.com/users/${config.discordUserId}`} target="_blank" rel="noreferrer" aria-label="Open Discord profile">
          <ArrowUpRight size={17} />
        </a>
      </div>

      {custom?.state && (
        <div className="custom-status">
          <span>{custom.emoji?.name || "✦"}</span>
          {custom.state}
        </div>
      )}

      {(spotify || game || otherActivity) && (
  <div className="activity-box">
    <div className="activity-icon">
      {spotify ? <Music2 /> : game ? <Gamepad2 /> : <Activity />}
    </div>

    <div className="activity-copy">
      <span className="eyebrow">CURRENT ACTIVITY</span>
      <strong>{activityLine}</strong>
      <small>
        {spotify
          ? spotify.artist
          : game?.details || otherActivity?.state || " "}
      </small>
    </div>

    {spotify?.album_art_url && (
      <img
        className="album-thumb"
        src={spotify.album_art_url}
        alt="Spotify album cover"
      />
    )}
  </div>
)}
      {spotify && (
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

<div className="discord-foot">
  <span className="widget-clock">{formattedTime}</span>

  <span>
    {presence?.active_on_discord_mobile
      ? "Mobile"
      : presence?.active_on_discord_desktop
        ? "Desktop"
        : ""}
  </span>
</div>    </section>
  );
}
  






function CursorEffects() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !window.matchMedia("(pointer: fine)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame;
    let points = [];
    let pointer = { x: -100, y: -100 };

    const DURATION = 250;
    const STRANDS = 5;
    const MAX_POINTS = 150;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const move = (e) => {
      pointer = { x: e.clientX, y: e.clientY };
      const last = points[points.length - 1];

      if (last && Math.hypot(pointer.x - last.x, pointer.y - last.y) < 2) {
        return;
      }

      points.push({
        x: pointer.x,
        y: pointer.y,
        time: performance.now()
      });

      if (points.length > MAX_POINTS) points.shift();
    };

    const draw = (now) => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);

      points = points.filter(p => now - p.time < DURATION);

      if (points.length > 2) {
        const path = [];
        let distance = 0;

        for (let i = 0; i < points.length; i++) {
          if (i > 0) {
            distance += Math.hypot(
              points[i].x - points[i - 1].x,
              points[i].y - points[i - 1].y
            );
          }

          const age = now - points[i].time;
          path.push({
            ...points[i],
            distance,
            fade: Math.max(0, 1 - age / DURATION)
          });
        }

        const center = (STRANDS - 1) / 2;

        for (let s = 0; s < STRANDS; s++) {
          ctx.beginPath();

          for (let i = 1; i < path.length; i++) {
            const p = path[i];
            const prev = path[i - 1];

            const dx = p.x - prev.x;
            const dy = p.y - prev.y;
            const len = Math.hypot(dx, dy) || 1;

            const nx = -dy / len;
            const ny = dx / len;

            const wave =
              Math.sin(p.distance * 0.018 - now * 0.002 + s * 0.58) * 5 +
              Math.sin(p.distance * 0.009 - now * 0.0014 + s) * 3;

            const spread = (s - center) * 1.25;
            const offset = spread + wave;

            const x = p.x + nx * offset;
            const y = p.y + ny * offset;

            if (i === 1) ctx.moveTo(x, y);
            else {
              const before = path[i - 1];
              const midX = (x + before.x) / 2;
              const midY = (y + before.y) / 2;
              ctx.quadraticCurveTo(before.x, before.y, midX, midY);
            }
          }

          const tailFade = path[path.length - 1].fade;

          ctx.save();
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.globalAlpha = 0.35 + tailFade * 0.65;

          // Soft silver glow
          ctx.strokeStyle = "rgba(225, 232, 245, 0.45)";
          ctx.lineWidth = s === Math.floor(center) ? 3 : 1.8;
          ctx.shadowColor = "#ffffff";
          ctx.shadowBlur = 12;
          ctx.stroke();

          // Fine luminous silk thread
          ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
          ctx.lineWidth = s === Math.floor(center) ? 1.2 : 0.65;
          ctx.shadowBlur = 5;
          ctx.stroke();

          ctx.restore();
        }
      }

      // Soft luminous cursor tip
      const glow = ctx.createRadialGradient(
        pointer.x, pointer.y, 0,
        pointer.x, pointer.y, 22
      );

      glow.addColorStop(0, "rgba(255,255,255,0.4)");
      glow.addColorStop(0.3, "rgba(235,240,250,0.16)");
      glow.addColorStop(1, "rgba(255,255,255,0)");

      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 22, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      frame = requestAnimationFrame(draw);
    };

    resize();
    frame = requestAnimationFrame(draw);

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return <canvas ref={canvasRef} className="cursor-effects" />;
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
            
                        </div>
          </div>
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