import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

function Button({ className = "", variant = "", ...props }) {
  return <button className={`border border-slate-700 ${variant === "outline" ? "bg-slate-900-70 text-white bg-slate-800-hover" : "bg-yellow-400 text-slate-950"} ${className}`} {...props} />;
}

function Card({ className = "", ...props }) {
  return <div className={`border ${className}`} {...props} />;
}

function CardContent({ className = "", ...props }) {
  return <div className={className} {...props} />;
}

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 500;
const GROUND_Y = 410;
const BEST_KEY = "swagRunnerBest";
const LEADERBOARD_KEY = "swagRunnerLeaderboard";
const PLAYER_KEY = "swagRunnerPlayerName";

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function safeGet(key, fallback) {
  try {
    return window.localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {}
}

function readBestScore() {
  return Number(safeGet(BEST_KEY, "0"));
}

function writeBestScore(value) {
  safeSet(BEST_KEY, String(value));
}

function readLeaderboard() {
  try {
    const data = JSON.parse(safeGet(LEADERBOARD_KEY, "[]"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveLeaderboard(entries) {
  safeSet(LEADERBOARD_KEY, JSON.stringify(entries.slice(0, 10)));
}

function addLeaderboardScore(name, score, coins) {
  const cleanName = String(name || "SWAG PLAYER").trim().slice(0, 16) || "SWAG PLAYER";
  const entry = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: cleanName,
    score,
    coins,
    date: new Date().toLocaleDateString("th-TH"),
  };

  const updated = [...readLeaderboard(), entry]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  saveLeaderboard(updated);
  return updated;
}

function runSelfTests() {
  console.assert(rectsOverlap({ x: 0, y: 0, w: 10, h: 10 }, { x: 5, y: 5, w: 10, h: 10 }) === true, "overlapping rectangles should collide");
  console.assert(rectsOverlap({ x: 0, y: 0, w: 10, h: 10 }, { x: 12, y: 12, w: 10, h: 10 }) === false, "separated rectangles should not collide");
  console.assert(clamp(15, 0, 10) === 10, "clamp should cap high values");
  console.assert(clamp(-2, 0, 10) === 0, "clamp should cap low values");
  console.assert(clamp(6, 0, 10) === 6, "clamp should keep in-range values");
}

export default function SwagRunnerNightCityGame() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const keysRef = useRef({});
  const gameRef = useRef(null);

  const [screen, setScreen] = useState("landing");
  const [status, setStatus] = useState("ready");
  const [playerName, setPlayerName] = useState("SWAG PLAYER");
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [lives, setLives] = useState(3);
  const [best, setBest] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [savedGameOverScore, setSavedGameOverScore] = useState(null);

  function freshGame() {
    return {
      speed: 5,
      distance: 0,
      score: 0,
      coins: 0,
      lives: 3,
      invincible: 0,
      player: {
        x: 120,
        y: GROUND_Y - 82,
        w: 50,
        h: 82,
        vy: 0,
        onGround: true,
        ducking: false,
      },
      obstacles: [],
      coinItems: [],
      particles: [],
      nextObstacle: 90,
      nextCoin: 45,
      buildings: Array.from({ length: 12 }, (_, i) => ({
        x: i * 95,
        w: 70 + Math.random() * 45,
        h: 90 + Math.random() * 190,
        windows: Math.floor(4 + Math.random() * 7),
      })),
      stars: Array.from({ length: 70 }, () => ({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * 240,
        r: Math.random() * 1.6 + 0.4,
      })),
    };
  }

  function updatePlayerName(value) {
    const nextName = value.slice(0, 16);
    setPlayerName(nextName);
    safeSet(PLAYER_KEY, nextName);
  }

  function resetGame() {
    gameRef.current = freshGame();
    keysRef.current = {};
    setSavedGameOverScore(null);
    setScore(0);
    setCoins(0);
    setLives(3);
    setStatus("playing");
    setScreen("game");
  }

  function goLanding() {
    setStatus("ready");
    setScreen("landing");
  }

  function clearLeaderboard() {
    saveLeaderboard([]);
    setLeaderboard([]);
  }

  function pressJump() {
    if (screen !== "game") return;
    if (status === "ready" || status === "gameover") {
      resetGame();
      return;
    }
    keysRef.current.Space = true;
    window.setTimeout(() => {
      keysRef.current.Space = false;
    }, 120);
  }

  function pressDuck(isPressed) {
    if (screen !== "game") return;
    if (status === "ready" || status === "gameover") {
      if (isPressed) resetGame();
      return;
    }
    keysRef.current.ArrowDown = isPressed;
  }

  function handleCanvasTouch(e) {
    e.preventDefault();
    const touch = e.changedTouches?.[0];
    const canvas = canvasRef.current;
    if (!touch || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const localX = touch.clientX - rect.left;
    if (localX < rect.width * 0.42) {
      pressDuck(true);
    } else {
      pressJump();
    }
  }

  function handleCanvasTouchEnd(e) {
    e.preventDefault();
    pressDuck(false);
  }

  useEffect(() => {
    runSelfTests();
    setBest(readBestScore());
    setLeaderboard(readLeaderboard());
    setPlayerName(safeGet(PLAYER_KEY, "SWAG PLAYER"));
  }, []);

  useEffect(() => {
    const down = (e) => {
      keysRef.current[e.code] = true;
      if (["Space", "ArrowUp", "ArrowDown"].includes(e.code)) e.preventDefault();
      if (screen === "landing" && e.code === "Enter") resetGame();
      if (screen === "game" && (status === "ready" || status === "gameover") && e.code === "Space") resetGame();
    };

    const up = (e) => {
      keysRef.current[e.code] = false;
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [screen, status]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    gameRef.current = gameRef.current || freshGame();

    const drawRoundRect = (x, y, w, h, r) => {
      const radius = clamp(r, 0, Math.min(w, h) / 2);
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + w, y, x + w, y + h, radius);
      ctx.arcTo(x + w, y + h, x, y + h, radius);
      ctx.arcTo(x, y + h, x, y, radius);
      ctx.arcTo(x, y, x + w, y, radius);
      ctx.closePath();
    };

    const addParticles = (x, y, type = "coin") => {
      const g = gameRef.current;
      for (let i = 0; i < 10; i += 1) {
        g.particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 5,
          vy: -Math.random() * 5 - 1,
          life: 26,
          type,
        });
      }
    };

    const update = () => {
      const g = gameRef.current;
      if (screen !== "game" || status !== "playing") return;

      const p = g.player;
      const jumpPressed = keysRef.current.Space || keysRef.current.ArrowUp || keysRef.current.KeyW;
      p.ducking = Boolean(keysRef.current.ArrowDown || keysRef.current.KeyS);

      if (jumpPressed && p.onGround) {
        p.vy = -15.5;
        p.onGround = false;
      }

      p.vy += 0.78;
      p.y += p.vy;

      const targetH = p.ducking && p.onGround ? 55 : 82;
      const oldBottom = p.y + p.h;
      p.h += (targetH - p.h) * 0.35;
      p.y = oldBottom - p.h;

      if (p.y + p.h >= GROUND_Y) {
        p.y = GROUND_Y - p.h;
        p.vy = 0;
        p.onGround = true;
      }

      g.distance += g.speed;
      g.speed += 0.0025;
      g.score = Math.floor(g.distance / 8) + g.coins * 25;
      if (g.invincible > 0) g.invincible -= 1;

      g.nextObstacle -= 1;
      if (g.nextObstacle <= 0) {
        const type = Math.random() > 0.62 ? "copCar" : "police";
        g.obstacles.push({
          type,
          x: CANVAS_WIDTH + 30,
          y: type === "copCar" ? GROUND_Y - 48 : GROUND_Y - 74,
          w: type === "copCar" ? 82 : 42,
          h: type === "copCar" ? 48 : 74,
        });
        g.nextObstacle = Math.max(48, 80 + Math.random() * 80 - g.speed * 3);
      }

      g.nextCoin -= 1;
      if (g.nextCoin <= 0) {
        const arc = Math.random() > 0.45;
        for (let i = 0; i < 5; i += 1) {
          g.coinItems.push({
            x: CANVAS_WIDTH + 25 + i * 34,
            y: arc ? GROUND_Y - 130 - Math.sin((i / 4) * Math.PI) * 55 : GROUND_Y - 72,
            w: 22,
            h: 22,
            spin: Math.random() * 6,
          });
        }
        g.nextCoin = 95 + Math.random() * 95;
      }

      g.obstacles.forEach((o) => {
        o.x -= g.speed + (o.type === "copCar" ? 1.8 : 0.4);
      });

      g.coinItems.forEach((c) => {
        c.x -= g.speed;
        c.spin += 0.2;
      });

      g.obstacles = g.obstacles.filter((o) => o.x + o.w > -30);
      g.coinItems = g.coinItems.filter((c) => c.x + c.w > -30);

      const hitBox = {
        x: p.x + 8,
        y: p.y + 8,
        w: p.w - 16,
        h: p.h - 10,
      };

      g.coinItems = g.coinItems.filter((c) => {
        if (rectsOverlap(hitBox, c)) {
          g.coins += 1;
          addParticles(c.x + 10, c.y + 10, "coin");
          return false;
        }
        return true;
      });

      for (const o of g.obstacles) {
        const oBox = { x: o.x + 5, y: o.y + 5, w: o.w - 10, h: o.h - 8 };
        if (g.invincible <= 0 && rectsOverlap(hitBox, oBox)) {
          g.lives -= 1;
          g.invincible = 90;
          addParticles(p.x + 25, p.y + 35, "hit");
          o.x -= 80;

          if (g.lives <= 0) {
            const newBest = Math.max(g.score, readBestScore());
            writeBestScore(newBest);
            setBest(newBest);
            const nextBoard = addLeaderboardScore(playerName, g.score, g.coins);
            setLeaderboard(nextBoard);
            setSavedGameOverScore(g.score);
            setStatus("gameover");
          }
          break;
        }
      }

      g.particles.forEach((pt) => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.25;
        pt.life -= 1;
      });
      g.particles = g.particles.filter((pt) => pt.life > 0);

      g.buildings.forEach((b) => {
        b.x -= g.speed * 0.28;
        if (b.x + b.w < 0) {
          b.x = CANVAS_WIDTH + Math.random() * 120;
          b.w = 70 + Math.random() * 45;
          b.h = 90 + Math.random() * 190;
          b.windows = Math.floor(4 + Math.random() * 7);
        }
      });

      g.stars.forEach((s) => {
        s.x -= g.speed * 0.08;
        if (s.x < 0) s.x = CANVAS_WIDTH;
      });

      setScore(g.score);
      setCoins(g.coins);
      setLives(g.lives);
    };

    const drawPlayer = (g) => {
      const p = g.player;
      const blink = g.invincible > 0 && Math.floor(g.invincible / 6) % 2 === 0;
      if (blink) return;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.fillStyle = "#3f3f46";
      drawRoundRect(13, p.h - 35, 13, 35, 7);
      ctx.fill();
      drawRoundRect(29, p.h - 35, 13, 35, 7);
      ctx.fill();
      ctx.fillStyle = "#f8fafc";
      drawRoundRect(7, p.h - 10, 24, 10, 5);
      ctx.fill();
      drawRoundRect(27, p.h - 10, 26, 10, 5);
      ctx.fill();
      const hoodieY = p.ducking && p.onGround ? 15 : 24;
      ctx.fillStyle = "#18181b";
      drawRoundRect(3, hoodieY, 48, 38, 14);
      ctx.fill();
      ctx.fillStyle = "#27272a";
      drawRoundRect(-4, hoodieY + 9, 58, 30, 15);
      ctx.fill();
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(26, hoodieY + 15, 8, 0.1, Math.PI - 0.1);
      ctx.stroke();
      ctx.fillStyle = "#d6a37c";
      ctx.beginPath();
      ctx.arc(27, 17, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#111827";
      ctx.beginPath();
      ctx.arc(24, 12, 18, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ef4444";
      drawRoundRect(12, 0, 31, 9, 6);
      ctx.fill();
      ctx.fillRect(38, 4, 16, 5);
      ctx.fillStyle = "#020617";
      drawRoundRect(15, 15, 11, 6, 3);
      ctx.fill();
      drawRoundRect(29, 15, 11, 6, 3);
      ctx.fill();
      ctx.fillRect(25, 17, 5, 2);
      ctx.restore();
    };

    const drawPolice = (o) => {
      if (o.type === "copCar") {
        ctx.fillStyle = "#1e3a8a";
        drawRoundRect(o.x, o.y + 12, o.w, 32, 10);
        ctx.fill();
        ctx.fillStyle = "#0f172a";
        drawRoundRect(o.x + 16, o.y, 42, 24, 7);
        ctx.fill();
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(o.x + 35, o.y - 4, 10, 6);
        ctx.fillStyle = "#60a5fa";
        ctx.fillRect(o.x + 46, o.y - 4, 10, 6);
        ctx.fillStyle = "#111827";
        ctx.beginPath(); ctx.arc(o.x + 18, o.y + 44, 9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(o.x + 64, o.y + 44, 9, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#f8fafc";
        ctx.font = "bold 13px sans-serif";
        ctx.fillText("POLICE", o.x + 17, o.y + 33);
      } else {
        ctx.fillStyle = "#1e40af";
        drawRoundRect(o.x + 6, o.y + 24, 30, 45, 8);
        ctx.fill();
        ctx.fillStyle = "#d6a37c";
        ctx.beginPath(); ctx.arc(o.x + 21, o.y + 15, 13, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#172554";
        ctx.fillRect(o.x + 9, o.y + 4, 25, 8);
        ctx.fillStyle = "#facc15";
        ctx.fillRect(o.x + 18, o.y + 31, 7, 7);
        ctx.fillStyle = "#111827";
        ctx.fillRect(o.x + 9, o.y + 67, 9, 7);
        ctx.fillRect(o.x + 25, o.y + 67, 9, 7);
      }
    };

    const drawCoin = (c) => {
      ctx.save();
      ctx.translate(c.x + 11, c.y + 11);
      ctx.scale(Math.abs(Math.cos(c.spin)) * 0.55 + 0.35, 1);
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.arc(0, 0, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#fff7ed";
      ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("$", 0, 5);
      ctx.restore();
    };

    const draw = () => {
      const g = gameRef.current;
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      const sky = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      sky.addColorStop(0, "#020617");
      sky.addColorStop(0.55, "#111827");
      sky.addColorStop(1, "#312e81");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = "rgba(255,255,255,0.86)";
      ctx.beginPath(); ctx.arc(760, 72, 34, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(2,6,23,0.85)";
      ctx.beginPath(); ctx.arc(748, 61, 31, 0, Math.PI * 2); ctx.fill();

      g.stars.forEach((s) => {
        ctx.fillStyle = "rgba(255,255,255,0.75)";
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      });

      g.buildings.forEach((b, idx) => {
        ctx.fillStyle = idx % 2 ? "#0f172a" : "#111827";
        ctx.fillRect(b.x, GROUND_Y - b.h, b.w, b.h);
        ctx.fillStyle = "rgba(250,204,21,0.72)";
        for (let i = 0; i < b.windows; i += 1) {
          for (let j = 0; j < 3; j += 1) {
            if ((i + j + idx) % 3 !== 0) ctx.fillRect(b.x + 12 + j * 18, GROUND_Y - b.h + 18 + i * 24, 7, 10);
          }
        }
      });

      ctx.fillStyle = "#18181b";
      ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);
      ctx.fillStyle = "#27272a";
      ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, 8);
      ctx.strokeStyle = "rgba(250,204,21,0.75)";
      ctx.lineWidth = 5;
      ctx.setLineDash([38, 32]);
      ctx.beginPath();
      ctx.moveTo((-g.distance * 0.7) % 70, 458);
      ctx.lineTo(CANVAS_WIDTH, 458);
      ctx.stroke();
      ctx.setLineDash([]);

      g.coinItems.forEach(drawCoin);
      g.obstacles.forEach(drawPolice);
      drawPlayer(g);

      g.particles.forEach((pt) => {
        ctx.globalAlpha = Math.max(pt.life / 26, 0);
        ctx.fillStyle = pt.type === "coin" ? "#facc15" : "#ef4444";
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.type === "coin" ? 3 : 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      if (status !== "playing") {
        ctx.fillStyle = "rgba(2, 6, 23, 0.65)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = "#f8fafc";
        ctx.textAlign = "center";
        ctx.font = "800 42px sans-serif";
        ctx.fillText(status === "gameover" ? "โดนจับแล้ว!" : "SWAG NIGHT RUNNER", CANVAS_WIDTH / 2, 190);
        ctx.font = "18px sans-serif";
        ctx.fillText("มือถือ: แตะขวาเพื่อกระโดด • แตะซ้ายค้างเพื่อหมอบ", CANVAS_WIDTH / 2, 232);
        ctx.fillStyle = "#facc15";
        ctx.font = "bold 22px sans-serif";
        ctx.fillText(status === "gameover" ? `คะแนนสุดท้าย: ${savedGameOverScore ?? score}` : "เก็บเหรียญ หลบตำรวจ วิ่งให้ไกลที่สุด", CANVAS_WIDTH / 2, 268);
      }
    };

    const loop = () => {
      update();
      draw();
      animationRef.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [screen, status, score, playerName, savedGameOverScore]);

  if (screen === "landing") {
    return (
      <div className="min-h-screen w-full overflow-hidden bg-slate-950 text-white flex items-center justify-center p-4 relative">
        <div className="absolute inset-0 bg-hero" />
        <div className="absolute bottom-0 left-0 right-0 h-36 bg-bottom-fade" />
        <div className="absolute bottom-0 left-0 right-0 flex" style={{ opacity: .7 }}>
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="mx-1 bg-slate-900 border border-slate-800" style={{ width: 80, height: 80 + ((i * 43) % 170) }} />
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-6xl grid lg-grid-landing gap-5 items-center">
          <Card className="rounded-game border-white-10 bg-slate-950-70 backdrop-blur-xl shadow-2xl overflow-hidden">
            <CardContent className="p-6 sm-p-10">
              <div className="inline-flex rounded-full border border-yellow-300-40 bg-yellow-300-10 px-4 py-2 text-xs sm-text-sm font-black text-yellow-200 mb-5">
                NIGHT CITY • SWAG RUNNER • MOBILE READY
              </div>
              <h1 className="text-5xl sm-text-7xl lg-text-8xl font-black tracking-tighter leading-none text-white">
                SWAG<br />NIGHT<br /><span className="text-yellow-300">RUNNER</span>
              </h1>
              <p className="mt-5 text-slate-300 text-base sm-text-lg max-w-xl">
                วิ่งฝ่าเมืองกลางคืน เก็บเหรียญ หลบตำรวจ ทำคะแนนขึ้น Leaderboard แล้วโชว์ความ Swag ของคุณ
              </p>

              <div className="mt-6 grid grid-landing-input gap-3 max-w-xl">
                <input
                  value={playerName}
                  onChange={(e) => updatePlayerName(e.target.value)}
                  placeholder="ใส่ชื่อผู้เล่น"
                  className="rounded-2xl bg-slate-900-90 border border-slate-700 px-5 py-4 text-white outline-none focus-yellow font-bold"
                  maxLength={16}
                />
                <Button onClick={resetGame} className="rounded-2xl px-8 py-7 text-lg font-black">
                  ▶ เข้าเล่น
                </Button>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 text-xs sm-text-sm text-slate-300">
                <span className="rounded-full bg-slate-900-80 border border-slate-700 px-4 py-2">มือถือ: แตะขวา = กระโดด</span>
                <span className="rounded-full bg-slate-900-80 border border-slate-700 px-4 py-2">แตะซ้ายค้าง = หมอบ</span>
                <span className="rounded-full bg-slate-900-80 border border-slate-700 px-4 py-2">คอม: Space / ↑ / ↓</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-game border-white-10 bg-slate-950-70 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="text-2xl font-black">🏆 Leaderboard</h2>
                <Button onClick={clearLeaderboard} variant="outline" className="rounded-2xl px-4 py-2 font-bold">
                  ล้างคะแนน
                </Button>
              </div>

              <div style={{ display: "grid", gap: ".5rem" }}>
                {leaderboard.length === 0 ? (
                  <div className="rounded-2xl border border-slate-700 bg-slate-900-70 p-5 text-slate-300">
                    ยังไม่มีคะแนน เริ่มเล่นแล้วขึ้นอันดับแรกเลย
                  </div>
                ) : (
                  leaderboard.map((entry, index) => (
                    <div key={entry.id} className="grid grid-leaderboard-row items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900-80 p-3">
                      <div className="h-9 w-9 rounded-xl bg-yellow-300 text-slate-950 flex items-center justify-center font-black">{index + 1}</div>
                      <div className="min-w-0">
                        <p className="font-black truncate">{entry.name}</p>
                        <p className="text-xs text-slate-400">🪙 {entry.coins} • {entry.date}</p>
                      </div>
                      <div className="text-xl font-black text-yellow-300">{entry.score}</div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-5 rounded-2xl border border-blue-400-30 bg-blue-400-10 p-4 text-sm text-blue-100">
                Leaderboard นี้เก็บในเครื่องผู้เล่นก่อน ถ้าต้องการอันดับรวมออนไลน์จริง ให้ต่อ Firebase หรือ Supabase
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 p-2 sm-p-4 text-white flex items-center justify-center overscroll-none touch-none select-none">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-6xl">
        <div className="mb-3 sm-mb-4 flex flex-col gap-3 md-flex-row md-items-end md-justify-between">
          <div>
            <button onClick={goLanding} className="mb-2 text-xs sm-text-sm text-yellow-300 font-bold" style={{ background: "transparent", border: 0 }}>← กลับหน้าแรก</button>
            <h1 className="text-2xl sm-text-3xl md-text-5xl font-black tracking-tight">Swag Night Runner</h1>
            <p className="text-slate-300 mt-1 sm-mt-2 text-sm sm-text-base">Player: <b>{playerName || "SWAG PLAYER"}</b></p>
          </div>

          <div className="flex gap-2">
            <Button onClick={resetGame} className="rounded-2xl px-5 py-5 sm-py-6 text-base font-bold">
              <span className="mr-2" aria-hidden="true">{status === "playing" ? "↻" : "▶"}</span>
              {status === "playing" ? "เริ่มใหม่" : "Start"}
            </Button>
          </div>
        </div>

        <div className="grid grid-score gap-2 sm-gap-3 mb-3 sm-mb-4">
          <Card className="bg-slate-900-80 border-slate-700 rounded-2xl shadow-xl"><CardContent className="p-2 sm-p-4 flex items-center gap-2 sm-gap-3"><span className="text-xl sm-text-2xl">🚨</span><div><p className="text-xs text-slate-400">Score</p><p className="text-lg sm-text-2xl font-black text-white">{score}</p></div></CardContent></Card>
          <Card className="bg-slate-900-80 border-slate-700 rounded-2xl shadow-xl"><CardContent className="p-2 sm-p-4 flex items-center gap-2 sm-gap-3"><span className="text-xl sm-text-2xl">🪙</span><div><p className="text-xs text-slate-400">Coins</p><p className="text-lg sm-text-2xl font-black text-white">{coins}</p></div></CardContent></Card>
          <Card className="bg-slate-900-80 border-slate-700 rounded-2xl shadow-xl"><CardContent className="p-2 sm-p-4 flex items-center gap-2 sm-gap-3"><span className="text-xl sm-text-2xl">❤️</span><div><p className="text-xs text-slate-400">Lives</p><p className="text-lg sm-text-2xl font-black text-white">{lives}</p></div></CardContent></Card>
          <Card className="bg-slate-900-80 border-slate-700 rounded-2xl shadow-xl"><CardContent className="p-2 sm-p-4"><p className="text-xs text-slate-400">Best</p><p className="text-lg sm-text-2xl font-black text-white">{best}</p></CardContent></Card>
        </div>

        <div className="relative rounded-game sm-rounded-game overflow-hidden border border-slate-700 shadow-2xl bg-slate-900 p-1 sm-p-2 touch-none">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onTouchStart={handleCanvasTouch}
            onTouchMove={handleCanvasTouch}
            onTouchEnd={handleCanvasTouchEnd}
            onTouchCancel={handleCanvasTouchEnd}
            className="w-full rounded-game-inner sm-rounded-game-inner bg-slate-950 touch-none"
            aria-label="Swag Night Runner game canvas"
          />
          <div className="pointer-events-none absolute inset-x-2 bottom-2 flex justify-between gap-2">
            <div className="rounded-2xl bg-slate-950-55 border border-white-20 px-4 py-2 text-xs font-bold backdrop-blur">แตะซ้ายค้าง = หมอบ</div>
            <div className="rounded-2xl bg-slate-950-55 border border-white-20 px-4 py-2 text-xs font-bold backdrop-blur">แตะขวา = กระโดด</div>
          </div>
        </div>

        <div className="mt-3 sm-mt-4 grid grid-mobile-controls md-grid-cols-3 gap-2 sm-gap-3 text-xs sm-text-sm text-slate-300">
          <button type="button" onTouchStart={(e) => { e.preventDefault(); pressDuck(true); }} onTouchEnd={(e) => { e.preventDefault(); pressDuck(false); }} onTouchCancel={(e) => { e.preventDefault(); pressDuck(false); }} onMouseDown={() => pressDuck(true)} onMouseUp={() => pressDuck(false)} onMouseLeave={() => pressDuck(false)} className="rounded-2xl bg-slate-900-90 border border-slate-700 p-4 font-black active-scale transition">↓ หมอบ</button>
          <button type="button" onTouchStart={(e) => { e.preventDefault(); pressJump(); }} onMouseDown={pressJump} className="rounded-2xl bg-yellow-400 text-slate-950 border border-yellow-200 p-4 font-black active-scale transition">↑ กระโดด</button>
          <div className="col-span-2 md-col-span-1 rounded-2xl bg-slate-900-70 border border-slate-700 p-4">มือถือ: แตะขวาเพื่อกระโดด / แตะซ้ายค้างเพื่อหมอบ</div>
        </div>
      </motion.div>
    </div>
  );
}
