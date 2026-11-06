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
import { config } from "./config";
import { useLanyard } from "./useLanyard";

const statusMap = {
  online: { label: "online", color: "#5de0a0" },
  idle: { label: "idle", color: "#f5c451" },
  dnd: { label: "do not disturb", color: "#f16b76" },
  offline: { label: "offline", color: "#777783" }
};

const socialIcons = {
  Instagram: Instagram,
  TikTok: Music2,
  Spotify: Disc3,
  Riot: Gamepad2,
  Discord: MessageCircle
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
      <div className="panel-heading">
        <div className="heading-left">
          <span className="icon-tile discord-mark">◉</span>
          <div>
            <p className="eyebrow">LIVE PRESENCE</p>
            <h2>Discord</h2>
          </div>
        </div>
        <span className={`live-pill ${connection === "connected" ? "is-live" : ""}`}>
          <span />
          {connection === "connected" ? "LIVE" : connection.toUpperCase()}
        </span>
      </div>

      <div className="discord-user">
        <div className="avatar-wrap">
          <img src={avatar} alt="Discord avatar" onError={e => { e.currentTarget.src = config.avatarUrl; }} />
          <i className="status-dot" style={{ background: status.color }} />
        </div>
        <div className="user-copy">
          <strong>{user?.global_name || user?.display_name || config.displayName}</strong>
          <span>{user?.username ? `@${user.username}` : config.handle}</span>
          <small><i style={{ background: status.color }} />{status.label}</small>
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

      <div className="activity-box">
        <div className="activity-icon">
          {spotify ? <Music2 /> : game ? <Gamepad2 /> : <Activity />}
        </div>
        <div className="activity-copy">
          <span className="eyebrow">CURRENT ACTIVITY</span>
          <strong>{activityLine}</strong>
          <small>{spotify ? spotify.artist : game?.details || otherActivity?.state || "Waiting for shared activity"}</small>
        </div>
        {spotify?.album_art_url && (
          <img className="album-thumb" src={spotify.album_art_url} alt="Spotify album cover" />
        )}
      </div>

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

      <div className="discord-foot">
        <span><Radio size={13} /> Presence via Lanyard</span>
        <span>{presence?.active_on_discord_mobile ? "Mobile" : presence?.active_on_discord_desktop ? "Desktop" : " "}</span>
      </div>

      {!presence && (
        <p className="hint">Discord presence will appear once your account is available through Lanyard.</p>
      )}
<div className="widget-clock">
  {formattedTime}
</div>
    </section>
  );
}
  
function CursorEffects() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !window.matchMedia("(pointer: fine)").matches) return;

    const ctx = canvas.getContext("2d");
    let animationId;
    let points = [];
    let clicks = [];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const move = (e) => {
      points.push({
        x: e.clientX,
        y: e.clientY,
        life: 1
      });

      if (points.length > 45) points.shift();
    };

    const click = (e) => {
      clicks.push({
        x: e.clientX,
        y: e.clientY,
        radius: 2,
        alpha: 1
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Glowing cursor trail
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1];
        const b = points[i];
        const progress = i / points.length;
        const alpha = progress * Math.min(a.life, b.life);

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineWidth = 2.5 + progress * 4.5;
        ctx.lineCap = "round";
        ctx.strokeStyle = `rgba(235, 205, 255, ${alpha * 0.8})`;
        ctx.shadowColor = "#d99cff";
        ctx.shadowBlur = 12;
        ctx.stroke();
      }

      // Bright cursor head
      if (points.length > 0) {
        const head = points[points.length - 1];

        ctx.beginPath();
        ctx.arc(head.x, head.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.shadowColor = "#e7aaff";
        ctx.shadowBlur = 18;
        ctx.fill();
      }

      // Fade trail
      points.forEach(point => {
        point.life -= 0.018;
      });

      points = points.filter(point => point.life > 0);

      // Click ripple
      clicks.forEach(ring => {
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(225, 185, 255, ${ring.alpha})`;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = "#c78aff";
        ctx.shadowBlur = 12;
        ctx.stroke();

        ring.radius += 1.8;
        ring.alpha -= 0.025;
      });

      clicks = clicks.filter(ring => ring.alpha > 0);

      ctx.shadowBlur = 0;
      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move);
    window.addEventListener("click", click);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("click", click);
    };
  }, []);

  return <canvas ref={canvasRef} className="cursor-effects" />;
}



function App() {
  const { data, connection } = useLanyard(config.discordUserId);
const decorationAsset =
  data?.discord_user?.avatar_decoration_data?.asset ||
  data?.discord_user?.avatar_decoration ||
  null;

const decorationUrl = decorationAsset
  ? `https://cdn.discordapp.com/avatar-decoration-presets/${decorationAsset}.png?size=256`
  : null;
  const [copied, setCopied] = useState(false);
  const profileRef = useRef(null);
const musicRef = useRef(null);
const [isPlaying, setIsPlaying] = useState(false);
const toggleMusic = async () => {
  if (!musicRef.current) return;

  if (musicRef.current.paused) {
    try {
      await musicRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.log("Music playback failed:", error);
    }
  } else {
    musicRef.current.pause();
    setIsPlaying(false);
  }
};
  const handleProfileMove = (e) => {
    const card = profileRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rotateY = (x - 0.5) * 10;
    const rotateX = (0.5 - y) * 6;

    card.style.transform =
      `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleProfileLeave = () => {
    if (profileRef.current) {
      profileRef.current.style.transform =
        "perspective(1200px) rotateX(0deg) rotateY(0deg)";
    }
  };

  // Intro transition
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
      <main className="site-shell">
        <div
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
          <div
            className="profile-card"
            ref={profileRef}
            onMouseMove={handleProfileMove}
            onMouseLeave={handleProfileLeave}
          >
            <section className="hero">
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
                <h1>
                  {config.displayName}
                  <span className="title-period">.</span>
                </h1>

                <p className="handle">{config.handle}</p>

<div className="profile-location">
  <MapPin size={13} />
  <span>{config.location}</span>
</div>

<p className="tagline">{config.tagline}</p>                <div className="social-row">
                  {config.socials.map((item) => {
                    const Icon =
                      socialIcons[item.label] || ArrowUpRight;

                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="social-link social-icon-link"
                        aria-label={item.label}
                        title={item.label}
                      >
                        <Icon size={27} strokeWidth={2} />
                      </a>
                    );
                  })}
                </div>
              </div>
            </section>

            <div className="dashboard">
              <DiscordCard
                presence={data}
                connection={connection}
              />
            
            </div>
          </div>

          <footer className="footer">
            <div className="footer-message">
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