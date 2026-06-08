/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PolaroidMemory {
  id: string;
  src: string;
  title: string;
  caption: string;
  angle: number; // degrees of rotation for layout variety
  date: string;
}

export interface StarMessage {
  id: number;
  label: string;
  title: string;
  message: string;
  top: string; // percentage positions
  left: string;
}

export interface FriendshipPromise {
  id: string;
  icon: string;
  title: string;
  text: string;
}

export const POLAROID_MEMORIES: PolaroidMemory[] = [
  {
    id: "mem1",
    src: "/src/assets/images/cafeteria.jpg",
    title: "Cozy Office Cafeteria Moments",
    caption: "At last, we met in the cafeteria and took some photos together. Those pictures became both our first and last photos within the Cognizant office premises. The CTS campus cafeteria will always remain a special place for me, as it was where we met, shared conversations, and created beautiful memories that I will always cherish.🫂",
    angle: 3,
    date: "CTS Companions"
  },
  {
    id: "mem2",
    src: "/src/assets/images/station.jpg",
    title: "Station Story & Farewell",
    caption: "On my last day, we met at Tambaram Railway Station. Even though you had a fever, you still came to send me off. I will never forget that gesture and the effort you made just to be there,Thank you for coming that day. This photo is the last picture we took together, and it will always remain one of my most precious memories.❤️",
    angle: 3,
    date: "Farewell"
  },
  {
    id: "mem3",
    src: "/src/assets/images/mall.jpg",
    title: "Mall Wandering & Fun",
    caption: "A simple day at the mall turned into a special memory. We walked around, talked about random things, clicked photos, and enjoyed every moment together. Looking at this picture brings back all the laughter, fun conversations, and the happiness of spending time together.😊",
    angle: 3,
    date: "Happy Days Out"
  }
];

export const STAR_MESSAGES: StarMessage[] = [
  {
    id: 1,
    label: "Joy Sparkler",
    title: "Your Magical Laughter",
    message: "Your laughter is literally the best soundtrack in the universe, Myann! It can instantly banish any grey cloud.",
    top: "15%",
    left: "12%"
  },
  {
    id: 2,
    label: "Safe Haven",
    title: "The Safest Place",
    message: "Thank you for being the person with whom I can be 100% silly, absolute weird, and totally myself without checking twice.",
    top: "22%",
    left: "45%"
  },
  {
    id: 3,
    label: "Bright Aura",
    title: "Adorable Presence",
    message: "You are the most adorable human ever, Myann. Truly! Your positive glow is contagious and deeply loved.",
    top: "18%",
    left: "78%"
  },
  {
    id: 4,
    label: "Pure Heart",
    title: "Your Infinite Kindness",
    message: "The depth of your empathy and how much you care for those around you is a rare, spectacular treasure.",
    top: "55%",
    left: "8%"
  },
  {
    id: 5,
    label: "Comfort Zone",
    title: "Always There For Me",
    message: "Whenever I'm having a rough time, just knowing you are on my side gives me a superpower. I hope you know I'm always on yours too!",
    top: "40%",
    left: "30%"
  },
  {
    id: 6,
    label: "Sweet Smile",
    title: "Smile Booster",
    message: "Your sweet smile has a custom magical property: it instantly reminds me of everything good, light, and beautiful in life.",
    top: "48%",
    left: "62%"
  },
  {
    id: 7,
    label: "Constant",
    title: "Through Thick & Thin",
    message: "Seasons change, life shifts, but our friendship remains a warm, beautiful, unshakeable sanctuary. Cheers to forever!",
    top: "60%",
    left: "85%"
  }
];

export const FRIENDSHIP_PROMISES: FriendshipPromise[] = [
  {
    id: "p1",
    icon: "Heart",
    title: "Infinite Ear & Shoulder",
    text: "Promise to listen to your 3 AM rants, celebrate your tiniest victories, and offer a cozy digital shoulder anytime."
  },
  {
    id: "p2",
    icon: "Sparkles",
    title: "Anti-Sadness Force Field",
    text: "Whenever the world gets too exhausting, I promise to send spam-levels of adorable memes and reminder letters to restore your smile."
  },
  {
    id: "p3",
    icon: "Coffee",
    title: "Endless Cozy Cups",
    text: "Promise to buy you cozy cups of coffee/tea, eat ice cream in the rain, and plan absurdly fun adventures together."
  }
];

export const SCRATCH_COMPLIMENTS = [
  "You are the pink strawberry in a bowl of plain vanilla! 🍓",
  "The universe is 100% more magical simply because you are breathing in it. ✨",
  "If adorable was an Olympic sport, Myann would bring home gold, diamonds, and a crown! 👑",
  "You are a warm cup of cocoa on a cold winter morning. Pure cozy comfort! ☕",
  "Your friendship is my favorite chapter in my whole life story. 📖♥",
  "Even on my greyest days, your presence is an absolute sunshine dispenser! ☀️"
];

// Beautiful text after "thank you for the memories"
export const MEMORY_CLOSING_TEXT = 
  "Thank you for being part of so many beautiful memories. From silly jokes and random talks to taking photos and sharing countless laughs, every moment with you has been special.Life keeps changing, people move to different places, and things don't always stay the same, but the memories we've created together will always stay with me. Whenever I look back at our photos, I'll remember the fun, the laughter, and the friendship that made those moments so memorable.Thank you for being such a great friend. I'm really lucky to have met you, and I hope we continue making many more memories together.♥";
