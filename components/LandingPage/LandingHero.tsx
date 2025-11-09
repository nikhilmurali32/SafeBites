'use client';

import Image from 'next/image';
import { motion, useAnimation, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

// ---------- TUNE THESE ----------
const DEBUG = false;

const TRAY_W = 1000;
const TRAY_H = 560;
const COVER_W = 950;
const COVER_H = 687;
const LOGO_W = 142;
const LOGO_H = 142;

// Your canvas size (the design space in which all left/top are defined)
const SCENE_W = 2000;
const SCENE_H = 800;

// Manual positions (px) relative to the scene’s top-left
const TRAY_LEFT  = 280;
const TRAY_TOP   = 600;

const COVER_LEFT = 320;
const COVER_TOP  = 2;
const COVER_LIFT = 500;

// Text block
const TEXT_LEFT  = TRAY_LEFT + 200;
const TEXT_TOP   = TRAY_TOP  - 400;

// Mobile scaling limits
const MIN_SCALE = 0.42;    // how small the whole scene is allowed to get
const VIEW_PAD  = 24;      // viewport padding so content isn’t flush to edges
// --------------------------------

// Images in components/public
import Tray  from '../public/tray.png';
import Cover from '../public/cover.png';
import Logo  from '../public/logo.png';

function useSceneScale() {
  const [scale, setScale] = useState(1);

    useEffect(() => {
      const calc = () => {
        const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  
        const VIEW_PAD = 24;   // edge padding
        const SAFE = 56;       // extra room for shadows/edges
  
        const fitW = (vw - 2 * (VIEW_PAD + SAFE)) / SCENE_W;
        const fitH = (vh - 2 * (VIEW_PAD + SAFE)) / SCENE_H;
  
        const MIN_SCALE = 0.38; // allow a bit more shrink on phones
        const s = Math.max(Math.min(fitW, fitH, 1), MIN_SCALE);
        setScale(s);
      };
  
      calc();
      window.addEventListener('resize', calc);
      return () => window.removeEventListener('resize', calc);
    }, []);
  
    return scale;
  }
  
export default function LandingHero() {
  const sceneScale = useSceneScale();

  // three controllers so text unfolds WHILE cover lifts
  const groupCtrl = useAnimation();
  const coverCtrl = useAnimation();
  const textCtrl  = useAnimation();
  const reduce = useReducedMotion();

  useEffect(() => {
    (async () => {
      await groupCtrl.start('enter');
      coverCtrl.start('lift');
      textCtrl.start('show');
    })();
  }, [groupCtrl, coverCtrl, textCtrl]);

  const group = {
    initial: { x: '-110%', opacity: 0 },
    enter: reduce
      ? { x: 0, opacity: 1 }
      : { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 90, damping: 14 } },
  };

  const cover = {
    initial: { y: 0 },
    lift: reduce
      ? { y: -COVER_LIFT }
      : { y: -COVER_LIFT, transition: { type: 'spring', stiffness: 120, damping: 16, delay: 0.02 } },
  };

  const headline = {
    initial: { opacity: 0, scaleY: 0.86, scaleX: 0.95 },
    show: reduce
      ? { opacity: 1, scaleY: 1, scaleX: 1 }
      : {
          opacity: 1,
          scaleY: [0.86, 1.08, 1],
          scaleX: [0.95, 1.02, 1],
          transition: { duration: 0.55, ease: 'easeOut' },
        },
  };

  const body = {
    initial: { opacity: 0, y: 8 },
    show: reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  const overlap = useMemo(() => {
    const a = { l: TRAY_LEFT, t: TRAY_TOP, r: TRAY_LEFT + TRAY_W, b: TRAY_TOP + TRAY_H };
    const b = { l: COVER_LEFT, t: COVER_TOP - COVER_LIFT, r: COVER_LEFT + COVER_W, b: COVER_TOP - COVER_LIFT + COVER_H };
    const x = Math.max(0, Math.min(a.r, b.r) - Math.max(a.l, b.l));
    const y = Math.max(0, Math.min(a.b, b.b) - Math.max(a.t, b.t));
    return x > 0 && y > 0;
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* richer mint background to match sign-in */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-700 via-emerald-650 to-emerald-600" />
      <div className="absolute inset-0 bg-[conic-gradient(from_210deg_at_70%_30%,rgba(255,255,255,0.08),transparent_35%,transparent_65%,rgba(0,0,0,0.08))]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1500px_700px_at_50%_20%,rgba(255,255,255,0.16),transparent_70%)]" />

      {/* center the designed scene; scale for mobile */}
      <div className="relative z-10 grid min-h-screen place-items-center px-3 sm:px-6">
        <motion.div
          className="relative"
          style={{
            width: SCENE_W,
            height: SCENE_H,
            transform: `scale(${sceneScale})`,
            transformOrigin: 'center',
          }}
          initial="initial"
          animate={groupCtrl}
          variants={group}
        >
          {/* optional debug */}
          {DEBUG && (
            <>
              <div className="absolute inset-0 border border-emerald-300/25" />
              <div className="absolute top-2 right-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
                {overlap ? 'OVERLAP: YES' : 'OVERLAP: NO'}
              </div>
            </>
          )}

          {/* TRAY */}
          <div
            className={`absolute ${DEBUG ? 'outline outline-1 outline-emerald-300/30' : ''}`}
            style={{ left: TRAY_LEFT, top: TRAY_TOP }}
          >
            <Image
              src={Tray}
              alt="Serving tray"
              width={TRAY_W}
              height={TRAY_H}
              priority
              sizes={`${Math.round(TRAY_W * sceneScale)}px`}
              quality={90}
              className="drop-shadow-[0_24px_50px_rgba(0,0,0,0.28)]"
            />
          </div>

          {/* COVER */}
          <motion.div
            className={`absolute z-10 ${DEBUG ? 'outline outline-1 outline-emerald-300/30' : ''}`}
            style={{ left: COVER_LEFT, top: COVER_TOP }}
            initial="initial"
            animate={coverCtrl}
            variants={cover}
          >
            <Image
              src={Cover}
              alt="Tray cover"
              width={COVER_W}
              height={COVER_H}
              priority
              sizes={`${Math.round(COVER_W * sceneScale)}px`}
              quality={90}
            />
          </motion.div>

          {/* TEXT + CTA */}
          <div className="absolute" style={{ left: TEXT_LEFT, top: TEXT_TOP }}>
            <motion.div initial="initial" animate={textCtrl} variants={headline} className="flex items-start gap-4">
              <div
                className={`relative shrink-0 ${DEBUG ? 'outline outline-1 outline-emerald-300/30' : ''}`}
                style={{ width: LOGO_W, height: LOGO_H }}
              >
                <Image
                  src={Logo}
                  alt="SafeBites logo"
                  fill
                  sizes={`${Math.round(LOGO_W * sceneScale)}px`}
                  className="object-contain"
                  quality={90}
                />
              </div>

              <div className="leading-tight text-black drop-shadow-[0_2px_10px_rgba(0,0,0,0.22)]">
                <div className="text-[44px] md:text-[56px] lg:text-[72px] font-extrabold tracking-tight">Welcome to</div>
                <div className="text-[44px] md:text-[56px] lg:text-[72px] font-extrabold tracking-tight">SafeBites</div>
              </div>
            </motion.div>

            <motion.p
              initial="initial"
              animate={textCtrl}
              variants={body}
              className="mt-4 text-[18px] md:text-[22px] lg:text-[28px] font-semibold text-black drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)] text-center"
            >
              Take a picture and know what you eat <span className="font-extrabold">INSTANTLY.</span>
            </motion.p>

            {/* CENTERED CTA */}
            <motion.div initial="initial" animate={textCtrl} variants={body} className="mt-5 flex flex-col items-center gap-2">
              <a
                href="/login" className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-emerald-700"
              >
                Log In
              </a>
              <p className="text-xs md:text-sm text-emerald-50">
                Don’t have an account?{' '}
                <a href="/signup" className="font-semibold underline-offset-2 hover:underline text-white">
                  Sign Up
                </a>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
