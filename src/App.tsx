/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, useMemo } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Heart, 
  Sparkles, 
  Smile, 
  Mail, 
  Volume2, 
  VolumeX, 
  Gift, 
  RefreshCw, 
  Music, 
  HeartHandshake, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Coffee, 
  UtensilsCrossed, 
  MapPin, 
  MessageCircle, 
  Flame,
  CheckCircle2,
  Sparkle
} from "lucide-react";
import { 
  POLAROID_MEMORIES, 
  STAR_MESSAGES, 
  FRIENDSHIP_PROMISES, 
  SCRATCH_COMPLIMENTS, 
  MEMORY_CLOSING_TEXT 
} from "./data";

// Web Audio synthesizer for cute celestial chime indicators
interface AudioController {
  playBell: () => void;
  playSparkle: () => void;
  playWarmDrone: () => void;
  stopWarmDrone: () => void;
}

export default function App() {
  const [stage, setStage] = useState<"envelope" | "popup" | "world">("envelope");
  const [subPage, setSubPage] = useState<"letter" | "scrapbook" | "promise">("letter");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [selectedPolaroid, setSelectedPolaroid] = useState<string | null>(null);
  const [letterPage, setLetterPage] = useState(0);
  
  // Star constellations state
  const [activeStarId, setActiveStarId] = useState<number | null>(null);
  
  // Scratch card state
  const [scratchIndex, setScratchIndex] = useState(0);
  const [isScratched, setIsScratched] = useState(false);
  const [isScratchingActive, setIsScratchingActive] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  
  // Interactive Virtual Hug showers
  const [gifts, setGifts] = useState<{ id: string; x: number; y: number; scale: number; emoji: string }[]>([]);
  
  // Custom letter paragraphs
  const letterPages = useMemo(() => [
    {
      title: "How It All Started 🤍",
      content: `I don't know what I mean to you.

Maybe I'm your best friend,
maybe just a friend in your life.

Maybe you have many best friends...

but for me,
you are the only one. 🤍

There was never any confusion on my side.
Never any doubt.

I still remember the day we started talking like normal strangers, never knowing that one day you would become my whole comfort place.

Some people enter our lives unexpectedly,
and somehow become one of the most important parts of it.

That's exactly what happened with you. ✨`,
      pstyle: "text-lg md:text-xl font-handwritten tracking-wide text-rose-800 leading-relaxed"
    },
    {
      title: "What You Mean to Me 🌷",
      content: `You matter to me—a lot,

Maybe you don't know how much I like you,
or how much your presence means to me.

But whenever your name lights up my screen,
I smile without even realizing it. 😊

No matter how busy life gets,
or how many people come and go,
you will always have a special place in my heart.`,
      pstyle: "text-lg md:text-xl font-handwritten tracking-wide text-rose-800 leading-relaxed"
    },
    {
      title: "Thank You For Being💌",
      content: `I know I irritate you sometimes.
I tease you without reason.
I act childish.
I get angry.

But deep inside, I know our bond is stronger than these small fights.

Some feelings stay quiet,
not because they are small—
but because words are never enough. 🤍

Some friendships mean more than words.

And if there's one thing I want you to remember, it's this:

You are one of the most important people in my life,
and I'm grateful for every conversation,
every laugh,
every memory,
and every moment we share.`,
      pstyle: "text-lg md:text-xl font-handwritten tracking-wide text-rose-800 leading-relaxed"
    }
  ], []);

  // Web Audio Context setup
  const audioCtxRef = useRef<AudioContext | null>(null);
  const droneOscsRef = useRef<{ osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playCustomTone = (freq: number, type: OscillatorType, duration: number, gainValue = 0.1) => {
    try {
      initAudio();
      if (!audioCtxRef.current || audioCtxRef.current.state === "suspended") {
        audioCtxRef.current?.resume();
      }
      
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(gainValue, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio error ignored for compatibility", e);
    }
  };

  const playBell = () => {
    if (!soundEnabled) return;
    // Beautiful twinkling chime chord
    playCustomTone(523.25, "sine", 0.6, 0.15); // C5
    setTimeout(() => playCustomTone(659.25, "sine", 0.6, 0.12), 100); // E5
    setTimeout(() => playCustomTone(783.99, "sine", 0.6, 0.10), 200); // G5
    setTimeout(() => playCustomTone(1046.50, "sine", 1.0, 0.18), 300); // C6
  };

  const playSparkle = () => {
    if (!soundEnabled) return;
    const notes = [880, 987.77, 1046.5, 1174.66, 1318.51];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playCustomTone(freq, "triangle", 0.4, 0.08);
      }, idx * 80);
    });
  };

  // Soft hum of lofi background drone to keep things super dreamy
  const startDrone = () => {
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      if (droneOscsRef.current) return; // already active

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.frequency.setValueAtTime(130.81, ctx.currentTime); // C3
      osc2.frequency.setValueAtTime(196.00, ctx.currentTime); // G3 dt
      osc1.type = "sine";
      osc2.type = "sine";

      gainNode.gain.setValueAtTime(0.0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2); // soft fade in

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();

      droneOscsRef.current = { osc1, osc2, gain: gainNode };
    } catch (e) {
      console.warn("Drone audio setup failed", e);
    }
  };

  const stopDrone = () => {
    if (droneOscsRef.current && audioCtxRef.current) {
      const { osc1, osc2, gain } = droneOscsRef.current;
      try {
        gain.gain.linearRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.5);
        setTimeout(() => {
          osc1.stop();
          osc2.stop();
        }, 600);
      } catch (e) {
        // Safe check
      }
      droneOscsRef.current = null;
    }
  };

  // Handle speaker toggle
  useEffect(() => {
    if (soundEnabled && stage === "world") {
      startDrone();
    } else {
      stopDrone();
    }
    return () => {
      stopDrone();
    };
  }, [soundEnabled, stage]);

  const triggerGiftShower = (emoji: string) => {
    playSparkle();
    const newGifts = Array.from({ length: 8 }).map((_, i) => ({
      id: `${Date.now()}-${i}`,
      x: 20 + Math.random() * 60, // percentage from left
      y: 10 + Math.random() * 20, // percentage from top
      scale: 0.8 + Math.random() * 0.8,
      emoji: emoji
    }));
    setGifts((prev) => [...prev, ...newGifts]);
    
    // Auto clear sparkles
    setTimeout(() => {
      setGifts((prev) => prev.slice(newGifts.length));
    }, 4000);
  };

  const nextScratchCard = () => {
    playSparkle();
    setScratchProgress(0);
    setIsScratched(false);
    setScratchIndex((prev) => (prev + 1) % SCRATCH_COMPLIMENTS.length);
  };

  return (
    <div className="relative min-h-screen bg-linear-to-b from-[#FFF2F6] via-[#FFEDF2] to-[#F1EAFF] font-sans text-neutral-800 overflow-x-hidden selection:bg-rose-200">
      
      {/* Sound Controller Floating Button */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <button
          onClick={() => {
            setSoundEnabled(!soundEnabled);
            // Play initial trigger to clear audio policies
            if (!soundEnabled) {
              setTimeout(() => {
                playCustomTone(659.25, "sine", 0.5, 0.1);
              }, 100);
            }
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/80 backdrop-blur-md border border-rose-100 shadow-sm text-rose-600 hover:text-rose-700 hover:scale-105 active:scale-95 transition-all text-xs font-medium"
        >
          
        </button>
      </div>

      {/* Decorative Flying Background Ornanments */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[8%] w-12 h-12 bg-rose-200/40 rounded-full blur-xl animate-float" style={{ animationDelay: "0s" }} />
        <div className="absolute top-[40%] right-[12%] w-16 h-16 bg-purple-200/40 rounded-full blur-xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-[15%] left-[15%] w-14 h-14 bg-rose-100/60 rounded-full blur-xl animate-float" style={{ animationDelay: "4s" }} />
        
        {/* Soft floating particles */}
        <div className="absolute top-1/4 left-1/3 opacity-30 text-rose-400 animate-bounce duration-1000">♥</div>
        <div className="absolute top-2/3 right-1/4 opacity-40 text-purple-400 animate-bounce duration-700">✿</div>
        <div className="absolute bottom-1/3 left-[5%] opacity-20 text-yellow-400 animate-pulse">★</div>
      </div>

      {/* RENDER STAGES AT ONCE WITH ELEGANT TRANSITIONS */}
      <AnimatePresence mode="wait">
        
        {/* ================= STAGE 0: THE FLOATING ENVELOPE ================= */}
        {stage === "envelope" && (
          <motion.div
            key="stage-envelope"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="flex flex-col items-center justify-center min-h-screen px-4 z-10 relative"
          >
            <div className="text-center max-w-lg mx-auto mb-10">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100/80 text-rose-600 text-xs font-semibold uppercase tracking-wider mb-4 border border-rose-200/50"
              >
                <HeartHandshake className="w-3.5 h-3.5 animate-pulse" />
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-neutral-900 leading-tight mb-3">
              Happy Best Friends Day<span className="text-rose-500 relative"></span>
              </h1>
            
            </div>

            {/* Interactive Floating Envelope */}
            <motion.div
              whileHover={{ scale: 1.05, y: -8 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                playBell();
                setStage("popup");
              }}
              className="relative cursor-pointer w-80 h-64 md:w-96 md:h-72 bg-gradient-to-br from-rose-50 to-[#FFF0F4] rounded-2xl shadow-xl hover:shadow-2xl border border-rose-100/60 p-6 flex flex-col justify-between overflow-hidden group transition-shadow"
              id="magic-envelope"
            >
              {/* Inner diagonal flaps background for envelope effect */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
              <div className="absolute -top-1/2 left-0 right-0 h-full bg-rose-100/30 rounded-full transform scale-y-50 group-hover:bg-rose-200/25 transition-colors duration-500" />
              
              <div className="flex justify-between items-start">
                <div className="p-2.5 rounded-xl bg-white/90 shadow-sm border border-rose-50">
                  <Mail className="w-6 h-6 text-rose-500 animate-pulse" />
                </div>
                
              </div>

              <div className="my-auto text-center px-4">
                <span className="block font-serif text-2xl font-bold text-neutral-800 tracking-wide mb-1">
                  Open when you miss me
                </span>
                <span className="block font-handwritten text-xl text-rose-600/90 font-semibold italic">
                  Especially for Thiru ♥.
                </span>
              </div>

              {/* Glowing Heart Seal Stamp */}
              <div className="flex justify-center items-center pb-2">
                <div className="w-14 h-14 rounded-full bg-rose-500 hover:bg-rose-600 glow-pink flex items-center justify-center transition-all duration-300 relative group-hover:scale-110">
                  <Heart className="w-6 h-6 text-white heart-pulsing" fill="currentColor" />
                  <span className="absolute -inset-1 rounded-full border border-rose-300/40 animate-ping group-hover:animate-none" />
                </div>
              </div>

              {/* Glowing ambient ring */}
              <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-yellow-200/50 rounded-full blur-xl group-hover:scale-150 transition-all duration-500" />
              <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-rose-200/50 rounded-full blur-xl group-hover:scale-150 transition-all duration-500" />
            </motion.div>

            <div className="mt-8 text-xs font-sans font-medium text-neutral-500 tracking-widest uppercase flex items-center gap-2">
              <span>Touch the heart seal to unpack</span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
          </motion.div>
        )}

        {/* ================= STAGE 1: THE POPUP VIEW CARD ================= */}
        {stage === "popup" && (
          <motion.div
            key="stage-popup"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center justify-center min-h-screen px-4 z-10 relative"
          >
            <div className="relative max-w-lg w-full bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-pink-50 text-center overflow-hidden">
              
              {/* Confetti or decorative hearts inside the card */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-pink-300 via-rose-400 to-purple-400" />
              <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-pink-100/40 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -left-8 -top-8 w-44 h-44 bg-purple-100/40 rounded-full blur-3xl pointer-events-none" />

              {/* Enhanced Emblem Icon with pulsing nested rings and flying micro stars */}
              <motion.div 
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 120, delay: 0.1 }}
                className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center"
              >
                <span className="absolute inset-0 rounded-full bg-pink-100/50 blur-xs animate-pulse" />
                <span className="absolute -inset-2 rounded-full border border-pink-100/30 animate-ping" style={{ animationDuration: '3s' }} />
                
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-400 to-pink-500 shadow-md flex items-center justify-center relative z-10">
                  <div className="text-3xl filter drop-shadow-md select-none transform hover:scale-110 transition-transform duration-300">🌸</div>
                </div>
                
                <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
                <Sparkle className="absolute -bottom-1 -left-1 w-4 h-4 text-pink-400 animate-pulse" style={{ animationDelay: '0.8s' }} />
              </motion.div>

              {/* Title Section (Exact Requirements Match but beautifully paired styling) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4 mb-10"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-500 text-xs font-bold uppercase tracking-wider mb-1 border border-rose-100/60">
                </div>

                <h2 className="text-3xl md:text-3.5xl font-serif font-black text-rose-600 tracking-tight leading-tight">
                 Hey Meoww😊
                </h2>
                
                <div className="text-xl md:text-2xl font-serif text-neutral-800 leading-relaxed max-w-md mx-auto">
                 A small surprise is waiting for you inside. 🎁💛
                </div>
              </motion.div>

        
              {/* Enter Button (Requirements Match: Click to enter our world with Sheen feedback) */}
              <motion.button
                whileHover={{ scale: 1.03, y: -2, boxShadow: "0 12px 28px -5px rgba(244, 63, 94, 0.35)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  playBell();
                  setStage("world");
                }}
                className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-sans font-bold tracking-wider hover:opacity-98 shadow-lg active:shadow-md transition-all flex items-center justify-center gap-3.5 group text-lg relative overflow-hidden"
                id="enter-world-button"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span>🎈 Click to Explore Our Memory Scrapbook </span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </motion.button>

              <button
                onClick={() => setStage("envelope")}
                className="mt-6 text-xs text-neutral-400 hover:text-neutral-500 hover:underline flex items-center justify-center gap-1.5 mx-auto transition-colors font-medium"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Go back to envelope</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* ================= STAGE 2: OUR WORLD (MAIN PORTAL) ================= */}
        {stage === "world" && (
          <motion.div
            key="stage-world"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="pb-4 relative z-10"
          >
            
            {/* Sparkling Custom Falling Sparkle Elements */}
            <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
              {gifts.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 1, y: `${item.y - 15}%`, x: `${item.x}%`, scale: 0 }}
                  animate={{ 
                    opacity: [1, 1, 0], 
                    y: [`${item.y - 15}%`, "80%"], 
                    x: [`${item.x}%`, `${item.x + (Math.random() * 20 - 10)}%`],
                    scale: [0, item.scale, item.scale * 0.4] 
                  }}
                  transition={{ duration: 3 + Math.random() * 2, ease: "easeOut" }}
                  className="absolute text-3xl select-none"
                >
                  {item.emoji}
                </motion.div>
              ))}
            </div>


            {/* MAIN CONTENT AREA: Render active subPage tab with custom page animations */}
            <main className="max-w-4xl mx-auto px-4 mt-8">
              <AnimatePresence mode="wait">
                
                {/* ================= PAGE 1/3: THE LETTER SECTION ================= */}
                {subPage === "letter" && (
                  <motion.div
                    key="page-letter"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  >
                    <section id="the-letter" className="relative">
                      <div className="absolute -left-4 -top-4 text-rose-300 opacity-60">✨</div>
                      <div className="absolute -right-4 bottom-12 text-purple-300 opacity-60">💖</div>
                      
                      <div className="bg-[#FFFDF9] rounded-3xl p-6 md:p-12 shadow-xl border border-[#F3ECE1] relative bg-[radial-gradient(#F5EFE6_1px,transparent_1px)] [background-size:20px_20px] overflow-hidden">
                        {/* Red margin line to resemble beautiful lined parchment paper */}
                        <div className="absolute left-10 md:left-16 top-0 bottom-0 w-[1px] bg-red-200 opacity-80" />
                        
                        {/* Seal ribbon visual */}
                        <div className="absolute right-8 top-0 w-8 h-20 bg-rose-500/20 rounded-b-lg border-x border-b border-rose-300/30 flex items-end justify-center pb-2">
                          <Heart className="w-4 h-4 text-rose-500 fill-current" />
                        </div>

                        <div className="pl-8 md:pl-12">
                          {/* Header bar of the letter with page dots */}
                          <div className="flex justify-between items-center pb-6 border-b border-neutral-100 mb-8">
                            <div className="flex gap-1">
                              {letterPages.map((_, i) => (
                                <div 
                                  key={i} 
                                  onClick={() => {
                                    playCustomTone(440 + i * 55, "sine", 0.15, 0.05);
                                    setLetterPage(i);
                                  }}
                                  className={`w-3.5 h-3.5 rounded-full cursor-pointer transition-colors ${i === letterPage ? 'bg-rose-500 hover:bg-rose-600' : 'bg-rose-100 hover:bg-rose-200'}`} 
                                />
                              ))}
                            </div>
                            <span className="font-mono text-xs font-semibold text-rose-400">
                              Page {letterPage + 1} of {letterPages.length}
                            </span>
                          </div>

                          {/* Letter Content carrying BIG dynamic texts */}
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={letterPage}
                              initial={{ opacity: 0, x: 15 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -15 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-6"
                            >
                              <h3 className="text-2xl md:text-3.5xl font-serif font-black text-neutral-900 tracking-tight flex items-center gap-2">
                                <span>{letterPages[letterPage].title}</span>
                                <Sparkle className="w-5 h-5 text-yellow-400 animate-pulse fill-current" />
                              </h3>
                              
                              <p className={letterPages[letterPage].pstyle}>
                                {letterPages[letterPage].content}
                              </p>
                            </motion.div>
                          </AnimatePresence>

                          {/* Interactive Ribbon navigation inside letter */}
                          <div className="flex justify-between items-center mt-10 pt-6 border-t border-neutral-100">
                            <button
                              onClick={() => {
                                if (letterPage > 0) {
                                  playCustomTone(392, "sine", 0.15, 0.05);
                                  setLetterPage(letterPage - 1);
                                }
                              }}
                              disabled={letterPage === 0}
                              className={`text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer ${letterPage === 0 ? "text-neutral-300 cursor-not-allowed" : "text-rose-600 hover:text-rose-700"}`}
                            >
                              <ChevronLeft className="w-4 h-4" />
                              <span>Previous</span>
                            </button>
                            {letterPage < letterPages.length - 1 && (
                              <button
                                onClick={() => {
                                  playCustomTone(440, "sine", 0.15, 0.05);
                                  setLetterPage(letterPage + 1);
                                }}
                                className="text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer text-rose-600 hover:text-rose-700"
                              >
                                <span>Next Page</span>
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            )}
                          
                          </div>

                        </div>
                      </div>

                      {/* Continuous Guide to the next overall page view */}
                      {letterPage === letterPages.length - 1 && (
                        <motion.div 
                          className="mt-12 flex justify-center"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <button
                            onClick={() => {
                              playCustomTone(440, "sine", 0.15, 0.05);
                              setSubPage("scrapbook");
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-6 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-sans font-bold text-xs tracking-wider uppercase shadow-md hover:shadow-lg flex items-center gap-2 transform active:scale-95 transition-all cursor-pointer"
                          >
                            <span>Open Memory Scrapbook 📸</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </motion.div>
                      )}
                    </section>
                  </motion.div>
                )}

                {/* ================= PAGE 2/3: CUTE PICTURES & POLAROIDS GALLERY ================= */}
                {subPage === "scrapbook" && (
                  <motion.div
                    key="page-scrapbook"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  >
                    <section id="the-pictures">
                      <div className="text-center mb-10">
                        <span className="inline-block px-3 py-1 bg-rose-50 text-rose-500 font-mono text-[10px] uppercase tracking-widest font-bold rounded-full mb-3">
                          🌸 Memory Scrapbook 🌸
                        </span>
                        <h2 className="text-2xl md:text-3.5xl font-serif font-black text-neutral-900 tracking-tight">
                          Our Polaroid Gallery
                        </h2>
                        <p className="text-xs text-neutral-500 mt-2 px-6 max-w-lg mx-auto leading-relaxed">
                          Click any snapshot of our beautiful journeys together to zoom in and see the story behind it.
                        </p>
                      </div>

                      {/* Polaroid list rendering with real generated beautiful illustrations */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 items-center justify-center">
                        {POLAROID_MEMORIES.map((photo) => (
                          <motion.div
                            key={photo.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ 
                              opacity: 1, 
                              y: 0, 
                              rotate: photo.angle 
                            }}
                            viewport={{ once: true, margin: "-100px" }}
                            whileHover={{ 
                              scale: 1.05, 
                              rotate: 0,
                              zIndex: 20,
                              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" 
                            }}
                            transition={{ type: "spring", stiffness: 100 }}
                            onClick={() => {
                              playCustomTone(587.33, "sine", 0.2, 0.08); // D5
                              setSelectedPolaroid(photo.id);
                            }}
                            className="bg-white p-4 pb-8 rounded-md shadow-lg border border-neutral-100/50 cursor-pointer relative group flex flex-col items-center"
                          >
                            {/* Realistic sticky tape accent at the top */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-6 bg-rose-50/70 border border-rose-100/30 transform -rotate-1 shadow-xs pointer-events-none group-hover:rotate-1 transition-transform" />

                            {/* Polaroid Image Box */}
                            <div className="w-full h-64 md:h-72 bg-neutral-950/[0.02] overflow-hidden rounded-md border border-neutral-100 relative flex items-center justify-center p-1.5">
                              <img 
                                src={photo.src} 
                                alt={photo.title}
                                referrerPolicy="no-referrer"
                                className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-102"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 pointer-events-none">
                                <span className="text-[11px] font-mono text-white tracking-widest uppercase">
                                  Zoom Picture 🔍
                                </span>
                              </div>
                            </div>

                            {/* Polaroid Handwritten Style Label */}
                            <div className="mt-4 text-center w-full">
                              <h4 className="font-handwritten text-2xl font-bold text-neutral-800 leading-none">
                                {photo.title}
                              </h4>
                              <span className="text-[10px] uppercase font-mono text-neutral-400 mt-2 block tracking-wider">
                                {photo.date}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Continuous Guide to the Promise page */}
                      <motion.div 
                        className="mt-14 flex justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <button
                          onClick={() => {
                            playCustomTone(523.25, "sine", 0.15, 0.05);
                            setSubPage("promise");
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-6 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-sans font-bold text-xs tracking-wider uppercase shadow-md hover:shadow-lg flex items-center gap-2 transform active:scale-95 transition-all cursor-pointer"
                        >
                          <span>Open Our Promise Forever 💖</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </motion.div>

                      {/* MODAL VIEW FOR POLAROID DETAIL */}
                      <AnimatePresence>
                        {selectedPolaroid && (() => {
                          const selected = POLAROID_MEMORIES.find(p => p.id === selectedPolaroid);
                          if (!selected) return null;
                          return (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="fixed inset-0 bg-neutral-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
                              onClick={() => setSelectedPolaroid(null)}
                            >
                              <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="bg-[#FFFDFB] rounded-3xl p-5 md:p-7 max-w-xl w-full shadow-2xl border border-neutral-100 max-h-[92vh] overflow-y-auto scrollbar-thin select-none"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="flex justify-between items-center mb-4">
                                  <span className="text-xs font-mono font-bold text-rose-500 uppercase tracking-widest flex items-center gap-1">
                                    <Heart className="w-3.5 h-3.5 fill-current" />
                                    <span>Memory Vault</span>
                                  </span>
                                  <button
                                    onClick={() => setSelectedPolaroid(null)}
                                    className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 flex items-center justify-center text-xs font-bold font-sans cursor-pointer"
                                  >
                                    ✕
                                  </button>
                                </div>

                                <div className="w-full bg-neutral-950/[0.015] rounded-2xl border border-dashed border-rose-200/40 p-2 flex items-center justify-center relative select-none">
                                  <img 
                                    src={selected.src} 
                                    alt={selected.title} 
                                    referrerPolicy="no-referrer"
                                    className="max-w-full max-h-[50vh] md:max-h-[58vh] object-contain rounded-xl shadow-xs mx-auto"
                                    style={{ display: "block" }}
                                  />
                                </div>

                                <div className="mt-5 space-y-3">
                                  <h3 className="font-serif text-2xl font-bold text-neutral-900 leading-tight">
                                    {selected.title}
                                  </h3>
                                  <p className="text-neutral-600 text-sm md:text-base leading-relaxed font-sans">
                                    {selected.caption}
                                  </p>
                                  <div className="flex justify-between items-center pt-3 border-t border-neutral-100 text-xs text-neutral-400">
                                    <span className="font-mono">Date: {selected.date}</span>
                                    <span className="font-handwritten text-base text-rose-500 font-bold">Unbreakable friendship bond ♥</span>
                                  </div>
                                </div>
                              </motion.div>
                            </motion.div>
                          );
                        })()}
                      </AnimatePresence>
                    </section>
                  </motion.div>
                )}

                {/* ================= PAGE 3/3: THANK YOU FOR THE MEMORIES & SWEET TEXTDisplay ================= */}
                {subPage === "promise" && (
  <motion.div
    key="page-promise"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.35, ease: "easeInOut" }}
  >
    <section id="the-memories-ending">
      <div className="bg-gradient-to-r from-rose-500/10 via-pink-400/5 to-purple-500/10 rounded-3xl p-6 md:p-8 text-center border border-rose-100/50 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-yellow-300 via-rose-400 to-purple-400" />
        
        <div className="absolute top-[15%] left-[10%] opacity-40 text-rose-500 animate-bounce duration-1000 text-3xl">♥</div>
        <div className="absolute bottom-[15%] right-[10%] opacity-40 text-rose-500 animate-bounce duration-700 text-3xl">♥</div>

        <span className="text-xl md:text-2xl font-serif text-rose-600 font-extrabold block mb-3 uppercase tracking-wider">
          Our Promise Forever ♥
        </span>

        <h2 className="text-4xl md:text-5.5xl font-serif font-black text-rose-600 tracking-tight leading-none mb-6">
          Thank you for the memoriess
        </h2>

        <div className="max-w-2xl mx-auto space-y-4">
          <p className="text-base md:text-lg text-neutral-700 font-sans leading-relaxed tracking-wide font-medium">
            {MEMORY_CLOSING_TEXT}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <button
          onClick={() => {
            playCustomTone(392, "sine", 0.15, 0.05);
            setSubPage("letter");
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-6 py-3 rounded-full bg-white text-rose-600 border border-rose-100 font-sans font-bold text-xs tracking-wider uppercase shadow-xs hover:bg-rose-50/50 hover:shadow-sm transform active:scale-95 transition-all cursor-pointer"
        >
          <span>💌 Re-read Our Letter</span>
        </button>
        <button
          onClick={() => {
            playCustomTone(440, "sine", 0.15, 0.05);
            setSubPage("scrapbook");
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-6 py-3 rounded-full bg-white text-rose-600 border border-rose-100 font-sans font-bold text-xs tracking-wider uppercase shadow-xs hover:bg-rose-50/50 hover:shadow-sm transform active:scale-95 transition-all cursor-pointer"
        >
          <span>📸 Re-open Scrapbook</span>
        </button>
      </div>
    </section>
  </motion.div>
)}

              </AnimatePresence>
            </main>

            {/* Custom footer element */}
            {subPage === "promise" && (
              <footer className="mt-4 border-t border-rose-100 pt-3 pb-4 text-center text-xs text-neutral-400">
                
                <p className="mt-1">
                  Happy Best Friend Day, Myann! Thank you for walking this glowing path together with me.
                </p>
                <button
                  onClick={() => {
                    playBell();
                    setStage("envelope");
                  }}
                  className="mt-3 px-4 py-2 rounded-full border border-rose-100/60 bg-white/60 hover:bg-white text-rose-500 hover:text-rose-600 hover:shadow-xs text-[11px] font-sans font-bold flex items-center gap-1.5 mx-auto active:scale-95 transition-all"
                >
                  <span>If you want to see again Go back to first</span>
                </button>
              </footer>
            )}

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
