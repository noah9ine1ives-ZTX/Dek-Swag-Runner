
import React,{useEffect,useRef,useState}from"react";
import{motion}from"framer-motion";
import{createClient}from"@supabase/supabase-js";

const W=900,H=500,GROUND=410;
const URL=import.meta.env.VITE_SUPABASE_URL,KEY=import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase=URL&&KEY?createClient(URL,KEY):null;
const LS={best:"swagRunnerBest",wallet:"swagRunnerWalletCoins",board:"swagRunnerLeaderboard",player:"swagRunnerPlayerName",skin:"swagRunnerSkin",unlocked:"swagRunnerUnlockedSkins",loadout:"swagRunnerAvatarLoadout",parts:"swagRunnerUnlockedParts",quality:"swagRunnerQualityMode"};
const TRAIL_EFFECTS=[
 {id:"none",name:"No Trail",price:0,rarity:"starter",accent:"#64748b",glow:"rgba(100,116,139,.06)",trail:"rgba(148,163,184,.10)",type:"none",length:0,particles:0,desc:"เริ่มต้นแบบไม่มีเอฟเฟกต์"},
 {id:"ember-step",name:"Ember Step",price:450,rarity:"rare",accent:"#f97316",glow:"rgba(249,115,22,.18)",trail:"rgba(251,146,60,.44)",type:"ember",length:1.05,particles:2,desc:"ไฟลากจากเท้าแบบ runner"},
 {id:"neon-blue-step",name:"Neon Blue Step",price:600,rarity:"rare",accent:"#38bdf8",glow:"rgba(56,189,248,.18)",trail:"rgba(56,189,248,.40)",type:"neon",length:1,particles:2,desc:"แสงฟ้านีออนติดเท้า"},
 {id:"lightning-step",name:"Lightning Step",price:900,rarity:"epic",accent:"#fde047",glow:"rgba(250,204,21,.20)",trail:"rgba(253,224,71,.48)",type:"lightning",length:.8,particles:3,desc:"สายฟ้าสั้น ๆ ตอนวิ่ง"},
 {id:"smoke-drift",name:"Smoke Drift",price:700,rarity:"rare",accent:"#94a3b8",glow:"rgba(148,163,184,.10)",trail:"rgba(203,213,225,.24)",type:"smoke",length:.9,particles:3,desc:"ควันนุ่ม ๆ เล่นนานไม่ล้า"},
 {id:"holo-dust",name:"Holo Dust",price:1100,rarity:"epic",accent:"#a78bfa",glow:"rgba(167,139,250,.16)",trail:"rgba(216,180,254,.32)",type:"holo",length:.95,particles:3,desc:"ละออง hologram เบา ๆ"}
];
const EFFECTS=TRAIL_EFFECTS;

const DEFAULT_LOADOUT={bodyType:"male",hair:"basic-short",top:"plain-tee",pants:"basic-pants",shoes:"simple-sneakers",accessory:"none",trail_effect:"none"};
const DEFAULT_PARTS={hairs:["basic-short"],tops:["plain-tee"],pants:["basic-pants"],shoes:["simple-sneakers"],accessories:["none"]};

const PARTS={
 hairs:[
  {id:"basic-short",name:"Basic Short",price:0,rarity:"starter",fit:"unisex",style:"basicShort",hair:"#1f2937",skinTone:"#d6a37c",desc:"ทรงผมธรรมดาเริ่มต้น"},
  {id:"cap-fade",name:"Cap Fade",price:260,rarity:"rare",fit:"unisex",style:"capFade",hair:"#111827",cap:"#111827",skinTone:"#d6a37c",desc:"หมวกดำ street cap"},
  {id:"fluffy-brown",name:"Fluffy Brown",price:300,rarity:"rare",fit:"unisex",style:"fluffy",hair:"#5b3a29",skinTone:"#d6a37c",desc:"ผมฟูน้ำตาล"},
  {id:"short-spike",name:"Short Spike",price:320,rarity:"rare",fit:"male",style:"spike",hair:"#0f172a",skinTone:"#d6a37c",desc:"ผมสั้นตั้งแนวเท่"},
  {id:"middle-part",name:"Middle Part",price:380,rarity:"rare",fit:"unisex",style:"middlePart",hair:"#2b2b2b",skinTone:"#d6a37c",desc:"แสกกลางแฟชั่น"},
  {id:"long-street",name:"Long Street",price:420,rarity:"rare",fit:"female",style:"longStreet",hair:"#111827",skinTone:"#d6a37c",desc:"ผมยาว street style"}
 ],
 tops:[
  {id:"plain-tee",name:"Plain Tee",price:0,rarity:"starter",fit:"unisex",style:"plainTee",main:"#334155",accent:"#475569",detail:"#1e293b",desc:"เสื้อยืดธรรมดาเริ่มต้น"},
  {id:"oversized-hoodie",name:"Oversized Hoodie",price:340,rarity:"rare",fit:"unisex",style:"hoodie",main:"#18181b",accent:"#ef4444",detail:"#27272a",desc:"ฮู้ดดี้ oversize"},
  {id:"varsity-jacket",name:"Varsity Jacket",price:460,rarity:"rare",fit:"unisex",style:"varsity",main:"#111827",accent:"#facc15",sleeve:"#e5e7eb",desc:"แจ็คเก็ต varsity"},
  {id:"tee-layered",name:"Layered Tee",price:300,rarity:"rare",fit:"unisex",style:"layeredTee",main:"#0f172a",accent:"#38bdf8",inner:"#f8fafc",desc:"เสื้อซ้อนเลเยอร์"},
  {id:"puffer-black",name:"Puffer Jacket",price:620,rarity:"epic",fit:"unisex",style:"puffer",main:"#111111",accent:"#a78bfa",detail:"#27272a",desc:"แจ็คเก็ต puffer"},
  {id:"crop-street",name:"Crop Street Jacket",price:520,rarity:"rare",fit:"female",style:"cropJacket",main:"#111827",accent:"#ec4899",detail:"#334155",desc:"แจ็คเก็ตครอป street"}
 ],
 pants:[
  {id:"basic-pants",name:"Basic Pants",price:0,rarity:"starter",fit:"unisex",style:"basic",main:"#475569",detail:"#334155",desc:"กางเกงธรรมดาเริ่มต้น"},
  {id:"baggy-gray",name:"Baggy Gray",price:300,rarity:"rare",fit:"unisex",style:"baggy",main:"#52525b",detail:"#27272a",desc:"กางเกง baggy เทา"},
  {id:"cargo-dark",name:"Dark Cargo",price:360,rarity:"rare",fit:"unisex",style:"cargo",main:"#334155",detail:"#0f172a",desc:"cargo pants สีเข้ม"},
  {id:"jogger-black",name:"Black Jogger",price:300,rarity:"rare",fit:"unisex",style:"jogger",main:"#18181b",detail:"#3f3f46",desc:"jogger สีดำ"},
  {id:"wide-leg",name:"Wide Leg",price:380,rarity:"rare",fit:"unisex",style:"wideLeg",main:"#1f2937",detail:"#64748b",desc:"กางเกงขากว้าง"}
 ],
 shoes:[
  {id:"simple-sneakers",name:"Simple Sneakers",price:0,rarity:"starter",fit:"unisex",style:"simple",main:"#e5e7eb",sole:"#94a3b8",desc:"รองเท้าธรรมดาเริ่มต้น"},
  {id:"chunky-white",name:"Chunky White",price:360,rarity:"rare",fit:"unisex",style:"chunky",main:"#f8fafc",sole:"#cbd5e1",desc:"รองเท้า chunky สีขาว"},
  {id:"high-top-gold",name:"High Top Gold",price:460,rarity:"rare",fit:"unisex",style:"highTop",main:"#fef3c7",sole:"#d97706",desc:"รองเท้าหุ้มข้อทอง"},
  {id:"runner-neon",name:"Runner Neon",price:520,rarity:"rare",fit:"unisex",style:"runner",main:"#ecfccb",sole:"#22c55e",desc:"รองเท้า runner นีออน"},
  {id:"angel-wing-kicks",name:"Angel Wing Kicks",price:760,rarity:"epic",fit:"unisex",style:"wingShoes",main:"#fff",sole:"#a78bfa",wing:true,desc:"รองเท้ามีปีกเล็ก"}
 ],
 accessories:[
  {id:"none",name:"No Accessory",price:0,rarity:"starter",fit:"unisex",style:"none",desc:"ไม่มี accessory"},
  {id:"silver-chain",name:"Silver Chain",price:320,rarity:"rare",fit:"unisex",style:"chain",main:"#e5e7eb",desc:"สร้อยเงิน street"},
  {id:"black-glasses",name:"Black Glasses",price:280,rarity:"rare",fit:"unisex",style:"glasses",main:"#111827",desc:"แว่นดำ"},
  {id:"crossbody-bag",name:"Crossbody Bag",price:520,rarity:"epic",fit:"unisex",style:"bag",main:"#18181b",accent:"#facc15",desc:"กระเป๋าคาดอก"}
 ]
};
const DAILY=[{type:"coins",target:60,title:"Daily Hustle",desc:"เก็บเหรียญให้ครบ 60 เหรียญ",reward:75},{type:"score",target:2500,title:"Night Legend",desc:"ทำคะแนนให้ถึง 2,500",reward:100},{type:"combo",target:12,title:"Combo King",desc:"ทำ Combo ให้ถึง x12",reward:125},{type:"dodge",target:8,title:"Clean Dodge",desc:"หลบเฉียด 8 ครั้ง",reward:150}];

const get=(k,f)=>{try{return localStorage.getItem(k)||f}catch{return f}},set=(k,v)=>{try{localStorage.setItem(k,v)}catch{}},num=(v,f=0)=>Number.isFinite(Number(v))?Number(v):f,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const hit=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y,dist=(a,b)=>Math.hypot(a.x+a.w/2-(b.x+b.w/2),a.y+a.h/2-(b.y+b.h/2));
const grade=(s,c=1,st=0)=>{const t=num(s)+num(st)*.1+num(c)*45;if(t>=1e5)return"SS";if(t>=65000)return"S";if(t>=40000)return"A";if(t>=22000)return"B";if(t>=9000)return"C";return"D"},comboMult=c=>1+Math.min(1.25,(Math.max(1,Math.floor(num(c,1)))-1)*.045),daily=()=>DAILY[new Date().getDate()%DAILY.length];

function trailLevel(effect){return effect?.type==="none"?0:(effect?.particles||2)}
function footAnchors(p,isFemale=false){
 const y=p.y+p.h-6;
 return[{x:p.x+(isFemale?17:18),y},{x:p.x+(isFemale?32:34),y:y+1}];
}
function pushFootTrail(g,effect,p,isFemale=false,kind="run"){
 if(!effect||effect.type==="none"||!g?.trails)return;
 const anchors=footAnchors(p,isFemale),baseLife=kind==="burst"?22:kind==="land"?18:14,len=(effect.length||1)*(kind==="burst"?1.35:1),amount=kind==="run"?Math.max(1,trailLevel(effect)):Math.max(3,trailLevel(effect)+2);
 for(let i=0;i<amount;i++){const a=anchors[i%2];g.trails.push({x:a.x-8-Math.random()*18*len,y:a.y-2+Math.random()*7,vx:-2.2-Math.random()*3.2*len,vy:(Math.random()-.5)*(kind==="run"?1.1:2.8)-(kind==="burst"?1.4:0),life:baseLife+Math.random()*8,max:baseLife+8,size:(kind==="run"?4.5:6)+Math.random()*5,color:i%2?effect.trail:effect.accent,type:effect.type,kind})}
}


const OBSTACLE_TYPES={
 LOW_JUMP:{id:"LOW_JUMP",label:"Jump",icon:"⬆",action:"jump",style:"#f97316",reward:35,variants:["road cone","police barrier","spike strip"]},
 HIGH_SLIDE:{id:"HIGH_SLIDE",label:"Slide",icon:"⬇",action:"slide",style:"#38bdf8",reward:45,variants:["drone","laser scan","hanging sign"]},
 TALL_DOUBLE:{id:"TALL_DOUBLE",label:"Double Jump",icon:"⤊",action:"double",style:"#a78bfa",reward:70,variants:["tall barricade","police van"]},
 MIXED:{id:"MIXED",label:"Mixed",icon:"⚠",action:"mixed",style:"#facc15",reward:95,variants:["mixed gate"]}
};
function obstacleTypeForScore(score=0){const s=num(score,0),r=Math.random();if(s<500)return"LOW_JUMP";if(s<1300)return r<.72?"LOW_JUMP":"HIGH_SLIDE";if(s<2500)return r<.52?"LOW_JUMP":r<.82?"HIGH_SLIDE":"TALL_DOUBLE";return r<.42?"LOW_JUMP":r<.72?"HIGH_SLIDE":r<.92?"TALL_DOUBLE":"MIXED"}
function buildObstacle(type,x){const cfg=OBSTACLE_TYPES[type]||OBSTACLE_TYPES.LOW_JUMP,variant=cfg.variants[Math.floor(Math.random()*cfg.variants.length)];
 if(type==="HIGH_SLIDE")return{x,w:variant==="laser scan"?58:variant==="hanging sign"?48:42,h:variant==="laser scan"?18:variant==="hanging sign"?30:34,y:variant==="laser scan"?GROUND-52:variant==="hanging sign"?GROUND-64:GROUND-70,type,requiredAction:cfg.action,label:cfg.label,variant,icon:cfg.icon,color:cfg.style,reward:cfg.reward,passed:false,kind:variant};
 if(type==="TALL_DOUBLE")return{x,w:variant==="police van"?80:52,h:variant==="police van"?64:90,y:variant==="police van"?GROUND-64:GROUND-90,type,requiredAction:cfg.action,label:cfg.label,variant,icon:cfg.icon,color:cfg.style,reward:cfg.reward,passed:false,kind:variant};
 if(type==="MIXED")return{x,w:64,h:76,y:GROUND-76,type,requiredAction:cfg.action,label:cfg.label,variant,icon:cfg.icon,color:cfg.style,reward:cfg.reward,passed:false,kind:"gate"};
 return{x,w:variant==="spike strip"?54:42,h:variant==="road cone"?44:variant==="police barrier"?52:18,y:variant==="spike strip"?GROUND-18:variant==="road cone"?GROUND-44:GROUND-52,type:"LOW_JUMP",requiredAction:"jump",label:"Jump",variant,icon:"⬆",color:OBSTACLE_TYPES.LOW_JUMP.style,reward:OBSTACLE_TYPES.LOW_JUMP.reward,passed:false,kind:variant}}
function obstacleHitbox(o){if(o.kind==="road cone")return{x:o.x+10,y:o.y+4,w:o.w-20,h:o.h-4};if(o.kind==="police barrier")return{x:o.x+4,y:o.y+7,w:o.w-8,h:o.h-7};if(o.kind==="spike strip")return{x:o.x+2,y:o.y+2,w:o.w-4,h:o.h-2};if(o.kind==="drone")return{x:o.x+4,y:o.y+4,w:o.w-8,h:o.h-5};if(o.kind==="laser scan")return{x:o.x+1,y:o.y+1,w:o.w-2,h:o.h-1};if(o.kind==="hanging sign")return{x:o.x+4,y:o.y+3,w:o.w-8,h:o.h-3};if(o.kind==="tall barricade")return{x:o.x+5,y:o.y+3,w:o.w-10,h:o.h-3};if(o.kind==="police van")return{x:o.x+4,y:o.y+8,w:o.w-8,h:o.h-8};if(o.type==="MIXED")return{x:o.x+5,y:o.y+8,w:o.w-10,h:o.h-8};return{x:o.x+4,y:o.y+4,w:o.w-8,h:o.h-4}}
function playerHitbox(p){const duck=p.duck&&p.on;return{x:p.x+7,y:p.y+(duck?27:8),w:p.w-14,h:duck?31:p.h-14}}
function obstacleSpeedMod(o){if(o.type==="TALL_DOUBLE")return.65;if(o.type==="HIGH_SLIDE")return.55;if(o.type==="MIXED")return.85;return.7}

function normLoadout(l){
 const src=l&&typeof l==="object"?l:DEFAULT_LOADOUT;
 const legacy={default:"basic-short",peach:"fluffy-brown",tan:"short-spike",classic:"none",gold:"ember-step",angel:"holo-dust",toxic:"neon-blue-step"};
 const ok=(cat,id)=>PARTS[cat]?.some(p=>p.id===id);
 const trail=src.trailEffect||src.trail_effect||src.trail_effect||src.effect||legacy[src.trail_effect]||"none";
 return{
  bodyType:["male","female"].includes(src.bodyType||src.body_type)?(src.bodyType||src.body_type):"male",
  hair:ok("hairs",src.hair)?src.hair:(legacy[src.head]||DEFAULT_LOADOUT.hair),
  top:ok("tops",src.top)?src.top:DEFAULT_LOADOUT.top,
  pants:ok("pants",src.pants||src.bottom)?(src.pants||src.bottom):DEFAULT_LOADOUT.pants,
  shoes:ok("shoes",src.shoes)?src.shoes:DEFAULT_LOADOUT.shoes,
  accessory:ok("accessories",src.accessory)?src.accessory:DEFAULT_LOADOUT.accessory,
  trail_effect:TRAIL_EFFECTS.some(e=>e.id===trail)?trail:DEFAULT_LOADOUT.trail_effect
 }
}
function normParts(p){
 const src=p&&typeof p==="object"?p:DEFAULT_PARTS;
 const legacy=Array.isArray(src.heads)?src.heads.map(id=>({default:"basic-short",peach:"fluffy-brown",tan:"short-spike"}[id])).filter(Boolean):[];
 const clean=(cat,def)=>{
  const raw=cat==="hairs"?[...(Array.isArray(src.hairs)?src.hairs:[]),...legacy]:(Array.isArray(src[cat])?src[cat]:[]);
  return Array.from(new Set([...def,...raw.filter(id=>PARTS[cat]?.some(p=>p.id===id))]));
 };
 return{
  hairs:clean("hairs",DEFAULT_PARTS.hairs),
  tops:clean("tops",DEFAULT_PARTS.tops),
  pants:clean("pants",DEFAULT_PARTS.pants),
  shoes:clean("shoes",DEFAULT_PARTS.shoes),
  accessories:clean("accessories",DEFAULT_PARTS.accessories)
 }
}
const readJSON=(k,f,n=x=>x)=>{try{return n(JSON.parse(get(k,JSON.stringify(f))))}catch{return f}},best=()=>num(get(LS.best,"0")),wallet=()=>num(get(LS.wallet,"0")),board=()=>readJSON(LS.board,[]),saveBoard=b=>set(LS.board,JSON.stringify(b.slice(0,10)));
function addBoard(name,score,coins,style,maxCombo){const n=String(name||"SWAGPLAYER").trim().slice(0,16)||"SWAGPLAYER",cur=board(),e={id:n,name:n,score:Math.max(0,Math.floor(num(score))),coins:Math.max(0,Math.floor(num(coins))),styleScore:Math.max(0,Math.floor(num(style))),maxCombo:Math.max(1,Math.floor(num(maxCombo,1))),date:new Date().toLocaleDateString("th-TH")},i=cur.findIndex(x=>x.name===n);if(i>=0){if(e.score>num(cur[i].score))cur[i]=e}else cur.push(e);const out=cur.sort((a,b)=>num(b.score)-num(a.score)).slice(0,10);saveBoard(out);return out}
function Button({className="",variant="default",...p}){return<button className={`btn ${variant==="outline"?"dark":variant==="pink"?"pink":""} ${className}`} {...p}/>}

function ItemThumb({cat,item}){
 const color=item.main||item.hair||item.accent||"#64748b";
 const accent=item.accent||item.cap||item.detail||item.sole||"#facc15";
 const second=item.sleeve||item.inner||item.detail||item.sole||accent;
 if(cat==="hairs")return <div className={`item-thumb hair-thumb ${item.style||""}`}><div className="thumb-head"style={{background:item.skinTone||"#d6a37c"}}/><div className="thumb-hair"style={{background:item.hair||"#111827"}}/><div className="thumb-cap"style={{background:item.cap||"transparent"}}/></div>;
 if(cat==="tops")return <div className={`item-thumb top-thumb ${item.style||""}`}><div className="thumb-top-body"style={{background:color}}/><div className="thumb-sleeve l"style={{background:second}}/><div className="thumb-sleeve r"style={{background:second}}/><div className="thumb-accent"style={{background:accent}}/></div>;
 if(cat==="pants")return <div className={`item-thumb pants-thumb ${item.style||""}`}><div className="thumb-leg l"style={{background:color}}/><div className="thumb-leg r"style={{background:color}}/><div className="thumb-pocket l"style={{background:item.detail||"#1e293b"}}/><div className="thumb-pocket r"style={{background:item.detail||"#1e293b"}}/></div>;
 if(cat==="shoes")return <div className={`item-thumb shoes-thumb ${item.style||""}`}><div className="thumb-shoe l"style={{background:color,borderColor:accent}}/><div className="thumb-shoe r"style={{background:color,borderColor:accent}}/>{item.wing&&<><div className="thumb-wing l"/><div className="thumb-wing r"/></>}</div>;
 if(cat==="accessories")return <div className={`item-thumb accessory-thumb ${item.style||""}`}><div className="thumb-accessory-core"style={{background:color,borderColor:accent}}/><div className="thumb-accessory-line"style={{background:accent}}/><div className="thumb-accessory-dot"style={{background:accent}}/></div>;
 return <div className="item-thumb"><div className="thumb-accessory-core"style={{background:color}}/></div>;
}
function TrailThumb({effect}){
 return <div className={`item-thumb trail-thumb ${effect.type||"none"}`}><div className="trail-foot"/><div className="trail-streak a"style={{background:effect.trail||effect.accent}}/><div className="trail-streak b"style={{background:effect.accent}}/><div className="trail-spark s1"style={{background:effect.accent}}/><div className="trail-spark s2"style={{background:effect.trail||effect.accent}}/></div>;
}

function makeFriendCode(name="SWAG"){
 const clean=String(name||"SWAG").toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,4)||"SWAG";
 return `${clean}-${Math.floor(1000+Math.random()*9000)}`;
}
async function createUniqueFriendCode(baseName){
 if(!supabase)return makeFriendCode(baseName);
 for(let i=0;i<8;i++){
  const code=makeFriendCode(baseName);
  const {data}=await supabase.from("profiles").select("id").eq("friend_code",code).maybeSingle();
  if(!data)return code;
 }
 return `${String(baseName||"SWAG").toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,4)||"SWAG"}-${Date.now().toString().slice(-4)}`;
}



function cleanUsername(value){
 return String(value||"").replace(/[^A-Za-z0-9_.@-]/g,"").slice(0,16);
}
function isValidUsername(value){
 return /^[A-Za-z0-9_.@-]{3,16}$/.test(String(value||""));
}
async function isUsernameTaken(username, ignoreUserId=null){
 if(!supabase||!username)return false;
 let query=supabase.from("profiles").select("id").ilike("username",username).limit(1);
 if(ignoreUserId)query=query.neq("id",ignoreUserId);
 const {data}=await query.maybeSingle();
 return Boolean(data);
}
async function createUniqueUsername(baseName, ignoreUserId=null){
 const cleaned=cleanUsername(baseName)||"SWAGPLAYER";
 const base=(cleaned.length>=3?cleaned:"SWAGPLAYER").slice(0,16);
 if(!await isUsernameTaken(base,ignoreUserId))return base;
 for(let i=0;i<20;i++){
  const suffix=String(Math.floor(1000+Math.random()*9000));
  const candidate=`${base.slice(0,16-suffix.length)}${suffix}`;
  if(!await isUsernameTaken(candidate,ignoreUserId))return candidate;
 }
 return `SWAG${Date.now().toString().slice(-8)}`.slice(0,16);
}

export default function SwagRunnerNightCityGame(){
 const canvasRef=useRef(null),previewCanvasRef=useRef(null),raf=useRef(null),keys=useRef({}),game=useRef(null),ui=useRef(0);
 const state=useRef({screen:"menu",status:"ready",playerName:"SWAGPLAYER",skin:"none",quality:"auto",loadout:DEFAULT_LOADOUT,saved:null});
 const[screen,setScreen]=useState("menu"),[status,setStatus]=useState("ready"),[playerName,setPlayerName]=useState("SWAGPLAYER"),[score,setScore]=useState(0),[coins,setCoins]=useState(0),[lives,setLives]=useState(3),[combo,setCombo]=useState(1),[maxCombo,setMaxCombo]=useState(1),[styleScore,setStyleScore]=useState(0),[bestScore,setBestScore]=useState(0),[walletCoins,setWalletCoins]=useState(0),[leaderboard,setLeaderboard]=useState([]),[friendsLeaderboard,setFriendsLeaderboard]=useState([]);
 const[skin,setSkin]=useState("none"),[unlockedEffects,setUnlockedEffects]=useState(["none"]),[quality,setQuality]=useState("auto"),[loadout,setLoadout]=useState(DEFAULT_LOADOUT),[unlockedParts,setUnlockedParts]=useState(DEFAULT_PARTS),[previewLoadout,setPreviewLoadout]=useState(DEFAULT_LOADOUT),[previewSkin,setPreviewSkin]=useState("none"),[previewItem,setPreviewItem]=useState(null);
 const[active,setActive]=useState("leaderboard"),[savedScore,setSavedScore]=useState(null),[toast,setToast]=useState("Ready"),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[user,setUser]=useState(null),[authStatus,setAuthStatus]=useState(supabase?"Guest mode":"Supabase env ยังไม่พร้อม"),[cloudLoading,setCloudLoading]=useState(false);
 const[friendSearch,setFriendSearch]=useState(""),[friends,setFriends]=useState([]),[incoming,setIncoming]=useState([]),[outgoing,setOutgoing]=useState([]),[friendCode,setFriendCode]=useState("");
 const[profileModal,setProfileModal]=useState(null),[profileBio,setProfileBio]=useState(""),[profileUsername,setProfileUsername]=useState(""),[avatarUploading,setAvatarUploading]=useState(false),[userRole,setUserRole]=useState("player"),[accountStatus,setAccountStatus]=useState("active"),[suspendedUntil,setSuspendedUntil]=useState(null),[devCoins,setDevCoins]=useState("10000"),[devLookup,setDevLookup]=useState(""),[devTarget,setDevTarget]=useState(null),[devTargetCoins,setDevTargetCoins]=useState("0"),[devTargetRole,setDevTargetRole]=useState("player"),[devBusy,setDevBusy]=useState(false),[devReason,setDevReason]=useState(""),[devSuspendDays,setDevSuspendDays]=useState("7"),[devItemCat,setDevItemCat]=useState("hairs"),[devItemId,setDevItemId]=useState("cap-fade"),[devLogs,setDevLogs]=useState([]);
 const[showPassword,setShowPassword]=useState(false),[signupUsername,setSignupUsername]=useState(""),[usernameStatus,setUsernameStatus]=useState("ตั้ง Username ตอนสมัครครั้งแรก"),[usernameStatusType,setUsernameStatusType]=useState("idle"),[authMode,setAuthMode]=useState("login");
 const ch=daily(),locked=status==="playing",finalScore=savedScore??score;
 useEffect(()=>{state.current={...state.current,screen,status,playerName,skin,quality,loadout,saved:savedScore}},[screen,status,playerName,skin,quality,loadout,savedScore]);
 const updateName=v=>{const n=cleanUsername(v);setPlayerName(n);set(LS.player,n);if(v&&n!==String(v))setToast("Username ใช้ได้เฉพาะ A-Z, 0-9 และ _ . - @ เท่านั้น")};
 const parts=(l=loadout)=>{
 const s=normLoadout(l);
 return{
  bodyType:s.bodyType,
  hair:PARTS.hairs.find(p=>p.id===s.hair)||PARTS.hairs[0],
  top:PARTS.tops.find(p=>p.id===s.top)||PARTS.tops[0],
  pants:PARTS.pants.find(p=>p.id===s.pants)||PARTS.pants[0],
  bottom:PARTS.pants.find(p=>p.id===s.pants)||PARTS.pants[0],
  shoes:PARTS.shoes.find(p=>p.id===s.shoes)||PARTS.shoes[0],
  accessory:PARTS.accessories.find(p=>p.id===s.accessory)||PARTS.accessories[0],
  trail:TRAIL_EFFECTS.find(p=>p.id===s.trail_effect)||TRAIL_EFFECTS[0]
 }
};
 const lockToast=()=>setToast("กำลังเล่นอยู่ — เปลี่ยนชุด/ตั้งค่าได้หลังจบรอบหรือเริ่มรอบใหม่เท่านั้น"),usernameFromUser=(u=user)=>cleanUsername(u?.user_metadata?.name||u?.email?.split("@")[0]||playerName||"SWAGPLAYER")||"SWAGPLAYER";
 async function ensureCloudDefaults(u){
 if(!supabase||!u)return;
 const desired=cleanUsername(usernameFromUser(u)||playerName||"SWAGPLAYER");
 const {data:existing}=await supabase.from("profiles").select("username,friend_code").eq("id",u.id).maybeSingle();
 const username=isValidUsername(existing?.username)?existing.username:await createUniqueUsername(desired,u.id);
 const friend_code=existing?.friend_code||await createUniqueFriendCode(username);
 await supabase.from("profiles").upsert({id:u.id,username,friend_code,body_type:DEFAULT_LOADOUT.bodyType,last_seen:new Date().toISOString(),updated_at:new Date().toISOString()},{onConflict:"id"});
 await supabase.from("player_inventory").upsert({user_id:u.id,hairs:DEFAULT_PARTS.hairs,tops:DEFAULT_PARTS.tops,pants:DEFAULT_PARTS.pants,shoes:DEFAULT_PARTS.shoes,accessories:DEFAULT_PARTS.accessories,effects:["none"],trail_effects:["none"],updated_at:new Date().toISOString()},{onConflict:"user_id",ignoreDuplicates:true});
 await supabase.from("player_loadouts").upsert({user_id:u.id,hair:DEFAULT_LOADOUT.hair,top:DEFAULT_LOADOUT.top,pants:DEFAULT_LOADOUT.pants,shoes:DEFAULT_LOADOUT.shoes,body_type:DEFAULT_LOADOUT.bodyType,accessory:DEFAULT_LOADOUT.accessory,trail_effect:DEFAULT_LOADOUT.trail_effect,updated_at:new Date().toISOString()},{onConflict:"user_id",ignoreDuplicates:true});
}
 async function touchPresence(){if(supabase&&user)await supabase.from("profiles").update({last_seen:new Date().toISOString(),updated_at:new Date().toISOString()}).eq("id",user.id)}
 async function loadCloudPlayer(u){if(!supabase||!u)return;setCloudLoading(true);setAuthStatus("กำลังโหลดข้อมูลผู้เล่น...");try{await ensureCloudDefaults(u);const[{data:p},{data:inv},{data:lo},{data:lb}]=await Promise.all([supabase.from("profiles").select("username,coins,best_score,best_combo,best_style,last_seen,friend_code,bio,avatar_url,role,account_status,suspended_until,body_type,effect_intensity,reduce_vfx").eq("id",u.id).maybeSingle(),supabase.from("player_inventory").select("hairs,tops,pants,shoes,accessories,effects,trail_effects").eq("user_id",u.id).maybeSingle(),supabase.from("player_loadouts").select("hair,top,pants,shoes,body_type,accessory,trail_effect").eq("user_id",u.id).maybeSingle(),supabase.from("leaderboard").select("user_id,username,score,coins,max_combo,style_score,updated_at,profile:profiles!leaderboard_user_id_fkey(avatar_url,bio,friend_code,last_seen)").order("score",{ascending:false}).limit(50)]);if(p?.username)updateName(p.username.slice(0,16));if(p?.friend_code)setFriendCode(p.friend_code);setProfileBio(p?.bio||"");setProfileUsername(p?.username||usernameFromUser(u));setUserRole(p?.role||"player");setAccountStatus(p?.account_status||"active");setSuspendedUntil(p?.suspended_until||null);if(Number.isFinite(Number(p?.coins))){setWalletCoins(p.coins);set(LS.wallet,String(p.coins))}if(Number.isFinite(Number(p?.best_score))){setBestScore(p.best_score);set(LS.best,String(p.best_score))}if(inv){const np=normParts(inv);setUnlockedParts(np);set(LS.parts,JSON.stringify(np));const ef=Array.from(new Set(["none",...(Array.isArray(inv.trail_effects)?inv.trail_effects:(Array.isArray(inv.effects)?inv.effects:[]))]));setUnlockedEffects(ef);set(LS.unlocked,JSON.stringify(ef))}if(lo){const nl=normLoadout(lo),ef=TRAIL_EFFECTS.some(e=>e.id===lo.trail_effect)?lo.trail_effect:"none";setLoadout(nl);setPreviewLoadout(nl);setSkin(ef);setPreviewSkin(ef);state.current={...state.current,loadout:nl,skin:ef};set(LS.loadout,JSON.stringify(nl));set(LS.skin,ef)}if(Array.isArray(lb)){const out=lb.map(r=>({id:r.user_id,name:r.username,score:r.score,coins:r.coins,maxCombo:r.max_combo,styleScore:r.style_score,date:new Date(r.updated_at).toLocaleDateString("th-TH"),avatar_url:r.profile?.avatar_url||""}));setLeaderboard(out);saveBoard(out)}setAuthStatus(`Online save พร้อมใช้งาน: ${u.email}`);await loadFriendsData(u.id);setTimeout(()=>devRefreshLogs?.(),300)}catch(e){console.error(e);setAuthStatus(`โหลดข้อมูลออนไลน์ไม่สำเร็จ: ${e.message}`)}finally{setCloudLoading(false)}}
 
 async function checkSignupUsername(value=signupUsername){
  const username=cleanUsername(value);
  setSignupUsername(username);
  if(!username){
   setUsernameStatus("กรอก Username ก่อนสมัคร");
   setUsernameStatusType("idle");
   return false;
  }
  if(!isValidUsername(username)){
   setUsernameStatus("ใช้ได้เฉพาะ A-Z, 0-9, _ . - @ และต้องยาว 3-16 ตัว ❌");
   setUsernameStatusType("bad");
   return false;
  }
  setUsernameStatus("Checking...");
  setUsernameStatusType("checking");
  const taken=await isUsernameTaken(username);
  if(taken){
   setUsernameStatus("Username already taken ❌");
   setUsernameStatusType("bad");
   return false;
  }
  setUsernameStatus("Username available ✅");
  setUsernameStatusType("good");
  return true;
}
 async function handleEmailAuth(mode){
 if(locked)return lockToast();
 if(!supabase)return setAuthStatus("Supabase env ยังไม่พร้อม");
 if(mode==="signup"){
  const username=cleanUsername(signupUsername||playerName);
  if(!await checkSignupUsername(username))return setAuthStatus("Username ยังไม่ผ่านการตรวจสอบ");
  updateName(username);
 }
 if(!email||password.length<6)return setAuthStatus("กรอก Email และ Password อย่างน้อย 6 ตัว");
 setCloudLoading(true);
 setAuthStatus(mode==="signup"?"กำลังสมัครสมาชิก...":"กำลังเข้าสู่ระบบ...");
 try{
  const finalName=cleanUsername(signupUsername||playerName)||"SWAGPLAYER";
  const res=mode==="signup"
   ? await supabase.auth.signUp({email,password,options:{data:{name:finalName}}})
   : await supabase.auth.signInWithPassword({email,password});
  if(res.error)throw res.error;
  const u=res.data.user||res.data.session?.user;
  if(u){
   setUser(u);
   if(mode==="signup"){
    const friend_code=await createUniqueFriendCode(finalName);
    await supabase.from("profiles").upsert({id:u.id,username:finalName,friend_code,bio:"",last_seen:new Date().toISOString(),updated_at:new Date().toISOString()},{onConflict:"id"});
   }
   await loadCloudPlayer(u);
  }else setAuthStatus("สมัครแล้ว: กรุณาเช็กอีเมลเพื่อยืนยันก่อนเข้าสู่ระบบ");
 }catch(e){console.error(e);setAuthStatus(e.message||"เข้าสู่ระบบไม่สำเร็จ")}
 finally{setCloudLoading(false)}
}
 async function logout(){if(locked)return lockToast();if(!supabase)return;await supabase.auth.signOut();setUser(null);setAuthStatus("ออกจากระบบแล้ว: Guest mode");setFriends([]);setIncoming([]);setOutgoing([]);setFriendsLeaderboard([]);setUserRole("player");setAccountStatus("active");setSuspendedUntil(null)}
 async function saveCloudLoadout(nl=loadout,ns=skin,np=unlockedParts,ne=unlockedEffects){
 if(!supabase||!user)return;
 try{
  const safeLoadout=normLoadout({...nl,skin_effect:ns});
  const safeParts=normParts(np);
  const safeEffects=Array.from(new Set(["none",...ne]));
  await Promise.all([
   supabase.from("player_loadouts").upsert({user_id:user.id,hair:safeLoadout.hair,top:safeLoadout.top,pants:safeLoadout.pants,shoes:safeLoadout.shoes,body_type:safeLoadout.bodyType,accessory:safeLoadout.accessory,trail_effect:safeLoadout.trail_effect,updated_at:new Date().toISOString()},{onConflict:"user_id"}),
   supabase.from("player_inventory").upsert({user_id:user.id,hairs:safeParts.hairs,tops:safeParts.tops,pants:safeParts.pants,shoes:safeParts.shoes,accessories:safeParts.accessories,effects:safeEffects,trail_effects:safeEffects,updated_at:new Date().toISOString()},{onConflict:"user_id"})
  ]);
  setAuthStatus("บันทึก Style Shop ออนไลน์แล้ว")
 }catch(e){console.error(e);setAuthStatus(`Save Style Shop ไม่สำเร็จ: ${e.message}`)}
}
 async function saveCloudResult(fs,fc,fm,fst){
 if(!supabase||!user)return;
 if(accountStatus==="banned"||(accountStatus==="suspended"&&suspendedUntil&&new Date(suspendedUntil)>new Date()))return;
 try{
  const username=await createUniqueUsername(cleanUsername(playerName||usernameFromUser())||"SWAGPLAYER",user.id);
  if(username!==playerName)updateName(username);
  const{data:p}=await supabase.from("profiles").select("coins,best_score,best_combo,best_style").eq("id",user.id).maybeSingle();
  const nextCoins=num(p?.coins)+num(fc),nextBest=Math.max(num(p?.best_score),num(fs)),nextCombo=Math.max(num(p?.best_combo,1),num(fm,1)),nextStyle=Math.max(num(p?.best_style),num(fst));
  await supabase.from("profiles").upsert({id:user.id,username,coins:nextCoins,best_score:nextBest,best_combo:nextCombo,best_style:nextStyle,last_seen:new Date().toISOString(),updated_at:new Date().toISOString()},{onConflict:"id"});
  const{data:old}=await supabase.from("leaderboard").select("score").eq("user_id",user.id).maybeSingle();
  if(!old||num(fs)>num(old.score))await supabase.from("leaderboard").upsert({user_id:user.id,username,score:Math.floor(num(fs)),coins:Math.floor(num(fc)),max_combo:Math.floor(num(fm,1)),style_score:Math.floor(num(fst)),updated_at:new Date().toISOString()},{onConflict:"user_id"});
  await loadGlobalLeaderboard();await loadFriendsLeaderboard();setWalletCoins(nextCoins);set(LS.wallet,String(nextCoins));setBestScore(nextBest);set(LS.best,String(nextBest));setAuthStatus("บันทึกคะแนนออนไลน์แล้ว")
 }catch(e){console.error(e);setAuthStatus(`Save score ไม่สำเร็จ: ${e.message}`)}
}
 async function loadGlobalLeaderboard(){if(!supabase)return;const{data}=await supabase.from("leaderboard").select("user_id,username,score,coins,max_combo,style_score,updated_at,profile:profiles!leaderboard_user_id_fkey(avatar_url,bio,friend_code,last_seen)").order("score",{ascending:false}).limit(50);if(Array.isArray(data)){const out=data.map(r=>({id:r.user_id,name:r.username,score:r.score,coins:r.coins,maxCombo:r.max_combo,styleScore:r.style_score,date:new Date(r.updated_at).toLocaleDateString("th-TH"),avatar_url:r.profile?.avatar_url||""}));setLeaderboard(out);saveBoard(out)}}
 async function loadFriendsData(uid=user?.id){if(!supabase||!uid)return;try{const{data:fs}=await supabase.from("friendships").select("user_id, friend_id, friend:profiles!friendships_friend_id_fkey(id,username,friend_code,best_score,last_seen), owner:profiles!friendships_user_id_fkey(id,username,friend_code,best_score,last_seen)").or(`user_id.eq.${uid},friend_id.eq.${uid}`);const list=(fs||[]).map(f=>f.user_id===uid?f.friend:f.owner).filter(Boolean);setFriends(list);const{data:inc}=await supabase.from("friend_requests").select("id, requester_id, receiver_id, requester:profiles!friend_requests_requester_id_fkey(id,username,friend_code,best_score,last_seen)").eq("receiver_id",uid).eq("status","pending");setIncoming(inc||[]);const{data:out}=await supabase.from("friend_requests").select("id, requester_id, receiver_id, receiver:profiles!friend_requests_receiver_id_fkey(id,username,friend_code,best_score,last_seen)").eq("requester_id",uid).eq("status","pending");setOutgoing(out||[]);await loadFriendsLeaderboard(list)}catch(e){console.error(e);setToast("โหลดรายชื่อเพื่อนไม่สำเร็จ — ตรวจว่า Run SQL v3 แล้วหรือยัง")}}
 async function loadFriendsLeaderboard(list=friends){if(!supabase||!user)return;const ids=[user.id,...(list||[]).map(f=>f.id)].filter(Boolean);if(!ids.length)return;const{data}=await supabase.from("leaderboard").select("user_id,username,score,coins,max_combo,style_score,updated_at,profile:profiles!leaderboard_user_id_fkey(avatar_url,bio,friend_code,last_seen)").in("user_id",ids).order("score",{ascending:false}).limit(50);setFriendsLeaderboard((data||[]).map(r=>({id:r.user_id,name:r.username,score:r.score,coins:r.coins,maxCombo:r.max_combo,styleScore:r.style_score,date:new Date(r.updated_at).toLocaleDateString("th-TH"),avatar_url:r.profile?.avatar_url||""})))}
 async function sendFriendRequest(){
 if(!supabase||!user)return setToast("ต้อง Login ก่อนเพิ่มเพื่อน");
 const q=friendSearch.trim();
 if(!q)return;
 try{
  const normalized=q.toUpperCase();
  let {data:p,error}=await supabase.from("profiles").select("id,username,friend_code").eq("friend_code",normalized).neq("id",user.id).limit(1).maybeSingle();
  if(error)throw error;
  if(!p){
   const result=await supabase.from("profiles").select("id,username,friend_code").ilike("username",q).neq("id",user.id).limit(1).maybeSingle();
   if(result.error)throw result.error;
   p=result.data;
  }
  if(!p)return setToast("ไม่พบ Friend Code / Username นี้");
  const {data:already}=await supabase.from("friendships").select("user_id").eq("user_id",user.id).eq("friend_id",p.id).maybeSingle();
  if(already)return setToast(`${p.username} เป็นเพื่อนอยู่แล้ว`);
  await supabase.from("friend_requests").upsert({requester_id:user.id,receiver_id:p.id,status:"pending",created_at:new Date().toISOString()},{onConflict:"requester_id,receiver_id"});
  setFriendSearch("");
  setToast(`ส่งคำขอไปหา ${p.username} แล้ว`);
  await loadFriendsData();
 }catch(e){console.error(e);setToast(`ส่งคำขอไม่สำเร็จ: ${e.message}`)}
}
 async function acceptFriend(req){if(!supabase||!user)return;try{await supabase.from("friend_requests").update({status:"accepted",responded_at:new Date().toISOString()}).eq("id",req.id);const a=req.requester_id,b=req.receiver_id;await supabase.from("friendships").insert([{user_id:a,friend_id:b},{user_id:b,friend_id:a}]);setToast("รับเพื่อนแล้ว");await loadFriendsData()}catch(e){console.error(e);setToast(`รับเพื่อนไม่สำเร็จ: ${e.message}`)}}
 async function rejectFriend(req){if(!supabase||!user)return;await supabase.from("friend_requests").update({status:"rejected",responded_at:new Date().toISOString()}).eq("id",req.id);await loadFriendsData()}
 const isOnline=last=>last&&Date.now()-new Date(last).getTime()<2*60*1000;

 
 async function openProfile(entry){
  if(!entry)return;
  try{
   let p=null;
   if(supabase&&entry.id&&String(entry.id).includes("-")){
    const {data,error}=await supabase.from("profiles").select("id,username,friend_code,bio,avatar_url,coins,best_score,best_combo,best_style,last_seen").eq("id",entry.id).maybeSingle();
    if(error)throw error;
    p=data;
   }
   const fallback={id:entry.id,username:entry.name,friend_code:"",bio:"",avatar_url:entry.avatar_url||"",coins:entry.coins||0,best_score:entry.score||0,best_combo:entry.maxCombo||1,best_style:entry.styleScore||0,last_seen:null};
   const prof=p||fallback;
   setProfileModal({...prof,isSelf:user?.id===prof.id});
   setProfileBio(prof.bio||"");
   setProfileUsername(prof.username||"");
  }catch(e){console.error(e);setToast(`เปิดโปรไฟล์ไม่สำเร็จ: ${e.message}`)}
 }
 async function saveOwnProfile(){
  if(!supabase||!user)return setToast("ต้อง Login ก่อนตั้งโปรไฟล์");
  const username=cleanUsername(profileUsername);
  if(!isValidUsername(username))return setToast("Username ต้องยาว 3-16 ตัว และใช้ A-Z, 0-9, _ . - @ เท่านั้น");
  const currentName=cleanUsername(playerName);
  const nameChanged=username.toLowerCase()!==currentName.toLowerCase();
  if(nameChanged&&userRole!=="dev"){
   if(walletCoins<10000)return setToast("ต้องมี 10,000 coins เพื่อเปลี่ยน Username");
   if(await isUsernameTaken(username,user.id))return setToast("Username นี้ถูกใช้แล้ว");
  }
  const bio=String(profileBio||"").slice(0,160);
  try{
   const nextCoins=nameChanged&&userRole!=="dev"?walletCoins-10000:walletCoins;
   await supabase.from("profiles").update({username,bio,coins:nextCoins,updated_at:new Date().toISOString(),last_seen:new Date().toISOString()}).eq("id",user.id);
   await supabase.from("leaderboard").update({username}).eq("user_id",user.id);
   updateName(username);
   setWalletCoins(nextCoins);
   set(LS.wallet,String(nextCoins));
   setProfileModal(m=>m?{...m,username,bio,coins:nextCoins}:m);
   setToast(nameChanged?(userRole==="dev"?"Dev เปลี่ยน Username ฟรีแล้ว":"เปลี่ยน Username สำเร็จ หัก 10,000 coins แล้ว"):"บันทึกโปรไฟล์แล้ว");
   await loadCloudPlayer(user);
  }catch(e){console.error(e);setToast(`บันทึกโปรไฟล์ไม่สำเร็จ: ${e.message}`)}
 }
 async function uploadAvatar(file){
  if(!supabase||!user)return setToast("ต้อง Login ก่อนอัปโหลดรูป");
  if(!file)return;
  if(!["image/jpeg","image/png","image/webp","image/gif"].includes(file.type))return setToast("รองรับเฉพาะ jpg, png, webp, gif");
  if(file.size>2*1024*1024)return setToast("รูปต้องไม่เกิน 2MB");
  setAvatarUploading(true);
  try{
   const ext=(file.name.split(".").txt()||"jpg").toLowerCase().replace(/[^a-z0-9]/g,"")||"jpg";
   const path=`${user.id}/avatar-${Date.now()}.${ext}`;
   const {error}=await supabase.storage.from("avatars").upload(path,file,{upsert:true,cacheControl:"3600"});
   if(error)throw error;
   const {data}=supabase.storage.from("avatars").getPublicUrl(path);
   const avatar_url=data.publicUrl;
   await supabase.from("profiles").update({avatar_url,updated_at:new Date().toISOString(),last_seen:new Date().toISOString()}).eq("id",user.id);
   setProfileModal(m=>m?{...m,avatar_url}:m);
   setToast("อัปโหลดรูปโปรไฟล์แล้ว");
  }catch(e){console.error(e);setToast(`อัปโหลดรูปไม่สำเร็จ: ${e.message}`)}
  finally{setAvatarUploading(false)}
 }
 async function addFriendFromProfile(profile=profileModal){
  if(!profile)return;
  if(!user)return setToast("ต้อง Login ก่อนเพิ่มเพื่อน");
  if(profile.id===user.id)return setToast("นี่คือโปรไฟล์ของคุณ");
  try{
   const {data:already}=await supabase.from("friendships").select("user_id").eq("user_id",user.id).eq("friend_id",profile.id).maybeSingle();
   if(already)return setToast("เป็นเพื่อนอยู่แล้ว");
   await supabase.from("friend_requests").upsert({requester_id:user.id,receiver_id:profile.id,status:"pending",created_at:new Date().toISOString()},{onConflict:"requester_id,receiver_id"});
   setToast(`ส่งคำขอไปหา ${profile.username} แล้ว`);
   await loadFriendsData();
  }catch(e){console.error(e);setToast(`เพิ่มเพื่อนไม่สำเร็จ: ${e.message}`)}
 }

 
 async function openMyProfile(){
  if(!user)return setToast("ต้อง Login ก่อนดู My Profile");
  await openProfile({id:user.id,name:playerName,score:bestScore,maxCombo:maxCombo,styleScore:styleScore,coins:walletCoins});
 }

 
 function requireLoginToPlay(){
  if(!user){
   setActive("settings");
   setScreen("menu");
   setToast("กรุณา Login หรือ Sign up ก่อนเข้าเล่น เพื่อบันทึกคะแนน โปรไฟล์ และอันดับออนไลน์");
   return false;
  }
  if(accountStatus==="banned"){
   setActive("settings");
   setScreen("menu");
   setToast("บัญชีนี้ถูก Ban และไม่สามารถเล่นได้");
   return false;
  }
  if(accountStatus==="suspended"&&suspendedUntil&&new Date(suspendedUntil)>new Date()){
   setActive("settings");
   setScreen("menu");
   setToast(`บัญชีถูก Suspend ถึง ${new Date(suspendedUntil).toLocaleString("th-TH")}`);
   return false;
  }
  return true;
 }

 
 const isDev=userRole==="dev";
 async function devSyncWallet(nextCoins){
  if(!supabase||!user||!isDev)return;
  const coins=Math.max(0,Math.floor(num(nextCoins,0)));
  await supabase.from("profiles").update({coins,updated_at:new Date().toISOString(),last_seen:new Date().toISOString()}).eq("id",user.id);
  setWalletCoins(coins);
  set(LS.wallet,String(coins));
  setToast(`DEV: wallet set to ${coins} coins`);
 }
 async function devAddCoins(){
  if(!isDev)return setToast("Dev only");
  await devSyncWallet(walletCoins+num(devCoins,0));
 }
 async function devUnlockAll(){
  if(!supabase||!user||!isDev)return setToast("Dev only");
  const allParts={
   hairs:PARTS.hairs.map(x=>x.id),
   tops:PARTS.tops.map(x=>x.id),
   pants:PARTS.pants.map(x=>x.id),
   shoes:PARTS.shoes.map(x=>x.id)
  };
  const allEffects=EFFECTS.map(x=>x.id);
  setUnlockedParts(allParts);setUnlockedEffects(allEffects);
  set(LS.parts,JSON.stringify(allParts));set(LS.unlocked,JSON.stringify(allEffects));
  await saveCloudLoadout(loadout,skin,allParts,allEffects);
  setToast("DEV: unlocked all wardrobe and effects");
 }
 async function devResetMyTestData(){
  if(!supabase||!user||!isDev)return setToast("Dev only");
  const cleanLoadout=DEFAULT_LOADOUT;
  const cleanParts=DEFAULT_PARTS;
  setWalletCoins(0);setBestScore(0);setLoadout(cleanLoadout);setPreviewLoadout(cleanLoadout);setSkin("none");setPreviewSkin("none");setUnlockedParts(cleanParts);setUnlockedEffects(["none"]);
  set(LS.wallet,"0");set(LS.best,"0");set(LS.loadout,JSON.stringify(cleanLoadout));set(LS.parts,JSON.stringify(cleanParts));set(LS.skin,"none");set(LS.unlocked,JSON.stringify(["none"]));
  await Promise.all([
   supabase.from("profiles").update({coins:0,best_score:0,best_combo:1,best_style:0,updated_at:new Date().toISOString()}).eq("id",user.id),
   supabase.from("leaderboard").delete().eq("user_id",user.id),
   supabase.from("player_loadouts").upsert({user_id:user.id,...cleanLoadout,trail_effect:"none",updated_at:new Date().toISOString()},{onConflict:"user_id"}),
   supabase.from("player_inventory").upsert({user_id:user.id,...cleanParts,effects:["none"],updated_at:new Date().toISOString()},{onConflict:"user_id"})
  ]);
  await loadGlobalLeaderboard();await loadFriendsLeaderboard();
  setToast("DEV: reset only your own test data");
 }

 
 async function devAudit(action,targetId,details={}){
  if(!supabase||!user||!isDev)return;
  try{
   await supabase.from("dev_audit_log").insert({
    dev_id:user.id,
    target_id:targetId||null,
    action,
    details,
    created_at:new Date().toISOString()
   });
  }catch(e){console.error("audit failed",e)}
 }
 async function devLookupPlayer(){
  if(!supabase||!user||!isDev)return setToast("Dev only");
  const q=devLookup.trim();
  if(!q)return setToast("กรอก Username หรือ Friend Code ก่อน");
  setDevBusy(true);
  try{
   const normalized=q.toUpperCase();
   let {data:p,error}=await supabase.from("profiles").select("id,username,friend_code,role,account_status,suspended_until,coins,best_score,best_combo,best_style,bio,avatar_url,last_seen,created_at,updated_at").eq("friend_code",normalized).maybeSingle();
   if(error)throw error;
   if(!p){
    const res=await supabase.from("profiles").select("id,username,friend_code,role,account_status,suspended_until,coins,best_score,best_combo,best_style,bio,avatar_url,last_seen,created_at,updated_at").ilike("username",q).maybeSingle();
    if(res.error)throw res.error;
    p=res.data;
   }
   if(!p){setDevTarget(null);return setToast("ไม่พบผู้เล่นนี้")}
   setDevTarget(p);
   setDevTargetCoins(String(p.coins||0));
   setDevTargetRole(p.role||"player");
   setToast(`DEV: found ${p.username}`);
  }catch(e){console.error(e);setToast(`ค้นหาผู้เล่นไม่สำเร็จ: ${e.message}`)}
  finally{setDevBusy(false)}
 }

 async function devSetTargetCoins(){
  if(!supabase||!user||!isDev||!devTarget)return setToast("Dev only");
  if(!requireDevReason("set coins"))return;
  const coins=Math.max(0,Math.floor(num(devTargetCoins,0)));
  if(!confirm(`Set ${devTarget.username} coins to ${coins}?`))return;
  setDevBusy(true);
  try{
   await supabase.from("profiles").update({coins,updated_at:new Date().toISOString()}).eq("id",devTarget.id);
   await devAudit("set_coins",devTarget.id,{reason:devReason,old:devTarget.coins,new:coins});
   setDevTarget({...devTarget,coins});
   setToast(`DEV: set coins for ${devTarget.username}`);
  }catch(e){console.error(e);setToast(`Set coins failed: ${e.message}`)}
  finally{setDevBusy(false)}
 }
 async function devAddTargetCoins(){
  if(!supabase||!user||!isDev||!devTarget)return setToast("Dev only");
  if(!requireDevReason("add coins"))return;
  const add=Math.floor(num(devCoins,0));
  const coins=Math.max(0,Math.floor(num(devTarget.coins,0)+add));
  if(!confirm(`Add ${add} coins to ${devTarget.username}?`))return;
  setDevBusy(true);
  try{
   await supabase.from("profiles").update({coins,updated_at:new Date().toISOString()}).eq("id",devTarget.id);
   await devAudit("add_coins",devTarget.id,{reason:devReason,add,new:coins});
   setDevTarget({...devTarget,coins});
   setDevTargetCoins(String(coins));
   setToast(`DEV: added coins to ${devTarget.username}`);
  }catch(e){console.error(e);setToast(`Add coins failed: ${e.message}`)}
  finally{setDevBusy(false)}
 }
 async function devSetTargetRoleNow(){
  if(!supabase||!user||!isDev||!devTarget)return setToast("Dev only");
 if(!requireDevReason("set role"))return;
 if(!["player","dev"].includes(devTargetRole))return setToast("Invalid role,account_status,suspended_until");
 if(!requireDevSafetyCode())return;
  if(!confirm(`Set ${devTarget.username} role to ${devTargetRole}?`))return;
  setDevBusy(true);
  try{
   await supabase.from("profiles").update({role:devTargetRole,updated_at:new Date().toISOString()}).eq("id",devTarget.id);
   await devAudit("set_role",devTarget.id,{reason:devReason,old:devTarget.role,new:devTargetRole});
   setDevTarget({...devTarget,role:devTargetRole});
  setToast("Success: role updated");
 }catch(e){console.error(e);setToast(explainDevError(e,"Failed set role"))}
  finally{setDevBusy(false)}
 }
 async function devRemoveTargetScore(){
  if(!supabase||!user||!isDev||!devTarget)return setToast("Dev only");
 if(!requireDevReason("remove leaderboard score"))return;
 if(!requireDevSafetyCode())return;
  if(!confirm(`Remove ${devTarget.username} from leaderboard?`))return;
  setDevBusy(true);
  try{
   await supabase.from("leaderboard").delete().eq("user_id",devTarget.id);
   await devAudit("remove_leaderboard_score",devTarget.id,{reason:devReason,username:devTarget.username});
   await loadGlobalLeaderboard();
   await loadFriendsLeaderboard();
  setToast("Success: removed leaderboard score");
 }catch(e){console.error(e);setToast(explainDevError(e,"Failed remove score"))}
  finally{setDevBusy(false)}
 }
 async function devResetTargetProfilePublic(){
  if(!supabase||!user||!isDev||!devTarget)return setToast("Dev only");
 if(!requireDevReason("reset avatar/bio"))return;
 if(!requireDevSafetyCode())return;
  if(!confirm(`Reset avatar and bio for ${devTarget.username}?`))return;
  setDevBusy(true);
  try{
   await supabase.from("profiles").update({bio:"",avatar_url:null,updated_at:new Date().toISOString()}).eq("id",devTarget.id);
   await devAudit("reset_profile_public",devTarget.id,{reason:devReason,username:devTarget.username});
   setDevTarget({...devTarget,bio:"",avatar_url:null});
  setToast("Success: reset avatar/bio");
 }catch(e){console.error(e);setToast(explainDevError(e,"Failed reset avatar/bio"))}
  finally{setDevBusy(false)}
 }

 
function requireDevReason(action="action"){
 if(!devReason.trim()){
  setToast("Reason required");
  return false;
 }
 return true;
}
const DEV_ADMIN_CODE="13499011";
function explainDevError(e,fallback="Failed"){
 const msg=(e?.message||"").toLowerCase();
 if(msg.includes("permission")||msg.includes("rls"))return "Permission denied / RLS blocked";
 if(msg.includes("no rows")||msg.includes("not found"))return "Target not found";
 return `${fallback}: ${e?.message||"unknown error"}`;
}
function requireDevSafetyCode(){
 const code=prompt("DEV SAFETY CHECK — Type admin code to continue","");
 if(code===null)return false;
 if(code.trim()!==DEV_ADMIN_CODE){
  setToast("Invalid admin code");
  return false;
 }
 return true;
}
 async function devRefreshLogs(){
  if(!supabase||!user||!isDev)return;
  try{
   const {data,error}=await supabase.from("dev_audit_log").select("id,action,details,created_at,dev_id,target_id").order("created_at",{ascending:false}).limit(20);
   if(error)throw error;
   setDevLogs(data||[]);
  }catch(e){console.error(e);setToast(`โหลด audit log ไม่สำเร็จ: ${e.message}`)}
 }
 async function devSetAccountStatus(status){
 if(!supabase||!user||!isDev||!devTarget)return setToast("Dev only");
 if(!requireDevReason(status))return;
 if(!requireDevSafetyCode())return;
  let until=null;
  if(status==="suspended"){
   const days=Math.max(1,Math.floor(num(devSuspendDays,7)));
   until=new Date(Date.now()+days*24*60*60*1000).toISOString();
  }
  if(!confirm(`Set ${devTarget.username} status to ${status}?`))return;
  setDevBusy(true);
  try{
   await supabase.from("profiles").update({account_status:status,suspended_until:until,updated_at:new Date().toISOString()}).eq("id",devTarget.id);
   await devAudit(`set_status_${status}`,devTarget.id,{reason:devReason,status,suspended_until:until});
   setDevTarget({...devTarget,account_status:status,suspended_until:until});
  setToast(`Success: account status set to ${status}`);
   await devRefreshLogs();
 }catch(e){console.error(e);setToast(explainDevError(e,"Failed set account status"))}
  finally{setDevBusy(false)}
 }
 async function devResetTargetScoreFull(){
 if(!supabase||!user||!isDev||!devTarget)return setToast("Dev only");
 if(!requireDevReason("reset score"))return;
 if(!requireDevSafetyCode())return;
  if(!confirm(`Reset score for ${devTarget.username}?`))return;
  setDevBusy(true);
  try{
   await Promise.all([
    supabase.from("leaderboard").delete().eq("user_id",devTarget.id),
    supabase.from("profiles").update({best_score:0,best_combo:1,best_style:0,updated_at:new Date().toISOString()}).eq("id",devTarget.id)
   ]);
   await devAudit("reset_score_full",devTarget.id,{reason:devReason});
   setDevTarget({...devTarget,best_score:0,best_combo:1,best_style:0});
   await loadGlobalLeaderboard();await loadFriendsLeaderboard();await devRefreshLogs();
  setToast("Success: reset score completed");
 }catch(e){console.error(e);setToast(explainDevError(e,"Failed reset score"))}
  finally{setDevBusy(false)}
 }
 async function devResetTargetStyleShop(){
 if(!supabase||!user||!isDev||!devTarget)return setToast("Dev only");
 if(!requireDevReason("reset wardrobe"))return;
 if(!requireDevSafetyCode())return;
  if(!confirm(`Reset wardrobe for ${devTarget.username}?`))return;
  setDevBusy(true);
  try{
   await Promise.all([
    supabase.from("player_inventory").upsert({user_id:devTarget.id,hairs:DEFAULT_PARTS.hairs,tops:DEFAULT_PARTS.tops,pants:DEFAULT_PARTS.pants,shoes:DEFAULT_PARTS.shoes,accessories:DEFAULT_PARTS.accessories,effects:["none"],trail_effects:["none"],updated_at:new Date().toISOString()},{onConflict:"user_id"}),
    supabase.from("player_loadouts").upsert({user_id:devTarget.id,hair:DEFAULT_LOADOUT.hair,top:DEFAULT_LOADOUT.top,pants:DEFAULT_LOADOUT.pants,shoes:DEFAULT_LOADOUT.shoes,body_type:DEFAULT_LOADOUT.bodyType,accessory:DEFAULT_LOADOUT.accessory,trail_effect:DEFAULT_LOADOUT.trail_effect,updated_at:new Date().toISOString()},{onConflict:"user_id"})
   ]);
   await devAudit("reset_wardrobe",devTarget.id,{reason:devReason});
   await devRefreshLogs();
  setToast("Success: reset wardrobe completed");
 }catch(e){console.error(e);setToast(explainDevError(e,"Failed reset wardrobe"))}
  finally{setDevBusy(false)}
 }
 async function devModifyTargetItem(mode){
  if(!supabase||!user||!isDev||!devTarget)return setToast("Dev only");
  if(!requireDevReason(`${mode} item`))return;
  const cat=devItemCat;
  const itemId=devItemId;
  const validEffects=EFFECTS.map(x=>x.id);
  const validParts=PARTS[cat]?.map(x=>x.id)||[];
 if(cat==="effects"&&!validEffects.includes(itemId))return setToast("Invalid item/category");
 if(cat!=="effects"&&!validParts.includes(itemId))return setToast("Invalid item/category");
  if(!confirm(`${mode==="give"?"Give":"Remove"} ${itemId} ${cat} for ${devTarget.username}?`))return;
  setDevBusy(true);
  try{
   if(cat==="effects"){
    const {data:inv}=await supabase.from("player_inventory").select("effects").eq("user_id",devTarget.id).maybeSingle();
    let arr=Array.isArray(inv?.effects)?inv.effects:["none"];
    arr=mode==="give"?Array.from(new Set([...arr,itemId])):arr.filter(x=>x!==itemId||x==="none");
    if(!arr.includes("none"))arr.unshift("none");
    await supabase.from("player_inventory").upsert({user_id:devTarget.id,effects:arr,trail_effects:arr,updated_at:new Date().toISOString()},{onConflict:"user_id"});
   }else{
    const {data:inv}=await supabase.from("player_inventory").select("hairs,tops,pants,shoes,accessories,effects,trail_effects").eq("user_id",devTarget.id).maybeSingle();
    const base=normParts(inv||DEFAULT_PARTS);
    let arr=Array.isArray(base[cat])?base[cat]:DEFAULT_PARTS[cat];
    arr=mode==="give"?Array.from(new Set([...arr,itemId])):arr.filter(x=>!DEFAULT_PARTS[cat].includes(x)&&x!==itemId?true:DEFAULT_PARTS[cat].includes(x));
    if(mode==="remove")arr=Array.from(new Set([...DEFAULT_PARTS[cat],...arr.filter(x=>x!==itemId)]));
    await supabase.from("player_inventory").upsert({user_id:devTarget.id,hairs:base.hairs,tops:base.tops,pants:base.pants,shoes:base.shoes,accessories:base.accessories,effects:base.effects,trail_effects:base.effects,[cat]:arr,updated_at:new Date().toISOString()},{onConflict:"user_id"});
   }
   await devAudit(`${mode}_item`,devTarget.id,{reason:devReason,cat,itemId});
   await devRefreshLogs();
  setToast(`Success: ${mode} item done`);
 }catch(e){console.error(e);setToast(explainDevError(e,`Failed ${mode} item`))}
  finally{setDevBusy(false)}
 }
 async function devClearGlobalLeaderboard(){
  if(!supabase||!user||userRole!=="dev")return setToast("Permission denied / RLS blocked");
  if(!requireDevReason("clear global leaderboard"))return;
  if(!confirm("Clear Global Leaderboard? This deletes all leaderboard rows."))return;
  if(!requireDevSafetyCode())return;
  setDevBusy(true);
  try{
   const {count,error}=await supabase.from("leaderboard").delete({count:"exact"}).gte("score",0);
   if(error)throw error;
   const {count:remain,error:remainError}=await supabase.from("leaderboard").select("user_id",{count:"exact",head:true});
   if(remainError)throw remainError;
   if((remain||0)>0)throw new Error("Clear failed: leaderboard still has rows");
   setLeaderboard([]);
   setFriendsLeaderboard([]);
   saveBoard([]);
   localStorage.removeItem(LS.board);
   await devAudit("clear_leaderboard",null,{reason:devReason,deleted_count:count??null,timestamp:new Date().toISOString()});
   await loadGlobalLeaderboard();await loadFriendsLeaderboard();await devRefreshLogs();
   setToast("Global leaderboard cleared");
  }catch(e){console.error(e);setToast(e?.message==="Clear failed: leaderboard still has rows"?"Clear failed: leaderboard still has rows":`Failed: ${e.message}`)}
  finally{setDevBusy(false)}
 }

 function fresh(){const low=quality==="low"||(quality==="auto"&&innerWidth<768);return{visual:low?"low":"high",speed:5,distance:0,score:0,bonus:0,anim:0,coins:0,lives:3,combo:1,timer:0,maxCombo:1,style:0,dodges:0,gameOver:false,inv:0,shield:0,magnet:0,boost:0,heat:0,shake:0,player:{x:120,y:GROUND-76,w:46,h:76,vy:0,on:true,duck:false,jumpCount:0,maxJumps:2,jumpPressed:false,justDoubleJumped:false,fastFall:false,fastFallFx:0},obs:[],coinItems:[],power:[],particles:[],texts:[],trails:[],nextObs:90,nextCoin:45,nextPower:260,build:Array.from({length:12},(_,i)=>({x:i*95,w:70+Math.random()*45,h:90+Math.random()*190,win:Math.floor(4+Math.random()*7)})),stars:Array.from({length:low?40:70},()=>({x:Math.random()*W,y:Math.random()*240,r:Math.random()*1.6+.4})),rain:Array.from({length:low?42:95},()=>({x:Math.random()*W,y:Math.random()*H,len:8+Math.random()*18,spd:8+Math.random()*7,a:.12+Math.random()*.22}))}}
 function reset(){if(!requireLoginToPlay())return;game.current=fresh();keys.current={};state.current={...state.current,status:"playing",screen:"play",saved:null};setSavedScore(null);setScore(0);setCoins(0);setLives(3);setCombo(1);setMaxCombo(1);setStyleScore(0);setStatus("playing");setScreen("play");setToast("Run started!");touchPresence()}
 function goLanding(){state.current={...state.current,status:"ready",screen:"menu"};setStatus("ready");setScreen("menu")}
 function clearBoard(){if(locked)return lockToast();saveBoard([]);setLeaderboard([])}
 function cycleQuality(){if(locked)return lockToast();const q=quality==="auto"?"high":quality==="high"?"low":"auto";setQuality(q);set(LS.quality,q);state.current={...state.current,quality:q};setToast(`Quality ${q.toUpperCase()}`)}
 function previewPart(cat,item){const key={hairs:"hair",tops:"top",pants:"pants",shoes:"shoes",accessories:"accessory"}[cat];if(!key)return;const nl=normLoadout({...previewLoadout,[key]:item.id});setPreviewLoadout(nl);setPreviewItem({cat,id:item.id,name:item.name,price:item.price})}
function previewBodyType(type){if(locked)return lockToast();const nl=normLoadout({...previewLoadout,bodyType:type});setPreviewLoadout(nl);setPreviewItem({cat:"bodyType",id:type,name:type==="female"?"Female Runner":"Male Runner",price:0});setToast(`Preview ${type==="female"?"Female Runner":"Male Runner"}`)}
  function equipPart(cat,item){if(locked)return lockToast();const key={hairs:"hair",tops:"top",pants:"pants",shoes:"shoes",accessories:"accessory"}[cat];if(!key)return;if(!unlockedParts[cat].includes(item.id)){if(walletCoins<item.price)return setToast(`ต้องมี ${item.price} coins`);const nw=walletCoins-item.price,np=normParts({...unlockedParts,[cat]:[...unlockedParts[cat],item.id]});setWalletCoins(nw);set(LS.wallet,String(nw));setUnlockedParts(np);set(LS.parts,JSON.stringify(np));const nl=normLoadout({...loadout,[key]:item.id});setLoadout(nl);setPreviewLoadout(nl);set(LS.loadout,JSON.stringify(nl));state.current={...state.current,loadout:nl};saveCloudLoadout(nl,skin,np,unlockedEffects);return}const nl=normLoadout({...loadout,[key]:item.id});setLoadout(nl);setPreviewLoadout(nl);set(LS.loadout,JSON.stringify(nl));state.current={...state.current,loadout:nl};setToast(`${item.name} equipped`);saveCloudLoadout(nl)}
 function previewEffect(id){setPreviewSkin(id);setPreviewItem({cat:"effect",id,name:EFFECTS.find(e=>e.id===id)?.name||id,price:EFFECTS.find(e=>e.id===id)?.price||0})}
 function equipEffect(id){if(locked)return lockToast();const e=EFFECTS.find(x=>x.id===id);if(!e)return;if(unlockedEffects.includes(id)){setSkin(id);setPreviewSkin(id);set(LS.skin,id);state.current={...state.current,skin:id};setToast(`${e.name} equipped`);saveCloudLoadout(loadout,id);return}if(walletCoins<e.price)return setToast(`ต้องมี ${e.price} coins`);const nw=walletCoins-e.price,ne=[...unlockedEffects,id];setWalletCoins(nw);set(LS.wallet,String(nw));setUnlockedEffects(ne);set(LS.unlocked,JSON.stringify(ne));setSkin(id);setPreviewSkin(id);set(LS.skin,id);saveCloudLoadout(loadout,id,unlockedParts,ne)}
 function buyOrEquipPreview(){if(!previewItem)return;if(previewItem.cat==="bodyType"){const nl=normLoadout(previewLoadout);setLoadout(nl);set(LS.loadout,JSON.stringify(nl));state.current={...state.current,loadout:nl};saveCloudLoadout(nl,previewSkin,unlockedParts,unlockedEffects);return setToast(`Equipped ${nl.bodyType==="female"?"Female Runner":"Male Runner"}`)} if(previewItem.cat==="effect")return equipEffect(previewItem.id); const item=PARTS[previewItem.cat]?.find(x=>x.id===previewItem.id); if(item)equipPart(previewItem.cat,item)}
 function pressJump(){if(screen!=="play")return;if(status!=="playing")return reset();keys.current.Space=false;setTimeout(()=>{keys.current.Space=true;setTimeout(()=>keys.current.Space=false,120)},0)}
 function pressDuck(v){if(screen!=="play")return;if(status!=="playing"&&v)return reset();keys.current.ArrowDown=v}

 useEffect(()=>{setBestScore(best());setWalletCoins(num(get(LS.wallet,"0")));setLeaderboard(board());updateName(get(LS.player,"SWAGPLAYER"));const ue=readJSON(LS.unlocked,["none"],x=>Array.isArray(x)?Array.from(new Set(["none",...x])):["none"]);setUnlockedEffects(ue);const s=get(LS.skin,"none");setSkin(ue.includes(s)?s:"none");setPreviewSkin(ue.includes(s)?s:"none");const q=get(LS.quality,"auto");setQuality(["auto","high","low"].includes(q)?q:"auto");const lo=readJSON(LS.loadout,DEFAULT_LOADOUT,normLoadout),up=readJSON(LS.parts,DEFAULT_PARTS,normParts);setLoadout(lo);setPreviewLoadout(lo);setUnlockedParts(up);state.current={...state.current,loadout:lo,skin:s,quality:q};if(supabase){supabase.auth.getSession().then(({data})=>{const u=data.session?.user||null;if(u){setUser(u);loadCloudPlayer(u)}});const{data:l}=supabase.auth.onAuthStateChange((_e,session)=>{const u=session?.user||null;setUser(u);if(u)loadCloudPlayer(u);else setAuthStatus("Guest mode")});return()=>l.subscription.unsubscribe()}},[]);
 useEffect(()=>{if(!user)return;touchPresence();const t=setInterval(()=>{touchPresence();loadFriendsData(user.id)},45000);return()=>clearInterval(t)},[user]);
 
 useEffect(()=>{
  if(user)return;
  const username=signupUsername;
  if(!username){
   setUsernameStatus("ตั้ง Username ตอนสมัครครั้งแรก");
   setUsernameStatusType("idle");
   return;
  }
  setUsernameStatus("Checking...");
  setUsernameStatusType("checking");
  const t=setTimeout(()=>{checkSignupUsername(username)},500);
  return()=>clearTimeout(t);
 },[signupUsername,user]);

 useEffect(()=>{const down=e=>{const t=e.target?.tagName?.toLowerCase();if(t==="input"||t==="textarea"||e.target?.isContentEditable)return;keys.current[e.code]=true;if(["Space","ArrowUp","ArrowDown"].includes(e.code))e.preventDefault();if(screen==="menu"&&e.code==="Enter")reset();if(screen==="play"&&status!=="playing"&&e.code==="Space")reset()};const up=e=>keys.current[e.code]=false;addEventListener("keydown",down);addEventListener("keyup",up);return()=>{removeEventListener("keydown",down);removeEventListener("keyup",up)}},[screen,status]);

 // Canvas game loop
 useEffect(()=>{const c=canvasRef.current;if(!c)return;const ctx=c.getContext("2d"),dpr=Math.min(devicePixelRatio||1,2);c.width=W*dpr;c.height=H*dpr;c.style.width="100%";ctx.setTransform(dpr,0,0,dpr,0,0);game.current=game.current||fresh();const rr=(x,y,w,h,r)=>{r=clamp(r,0,Math.min(w,h)/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()},shadow=(x,y,w,h,a=.28)=>{const g=ctx.createRadialGradient(x,y,2,x,y,w/2);g.addColorStop(0,`rgba(0,0,0,${a})`);g.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y,w/2,h/2,0,0,Math.PI*2);ctx.fill()},part=(x,y,type,n=10)=>{for(let i=0;i<n;i++)game.current.particles.push({x,y,vx:(Math.random()-.5)*5,vy:-Math.random()*5-1,life:26,type})},txt=(t,x,y,type="score")=>game.current.texts.push({txt:t,x,y,life:55,type});
 function update(){const g=game.current,rt=state.current;if(rt.screen!=="play"||rt.status!=="playing")return;const p=g.player;if(p.jumpCount==null)p.jumpCount=0;if(p.maxJumps==null)p.maxJumps=2;if(p.jumpPressed==null)p.jumpPressed=false;if(p.fastFall==null)p.fastFall=false;if(p.fastFallFx==null)p.fastFallFx=0;const boost=g.boost>0?1.75:1,jump=!!(keys.current.Space||keys.current.ArrowUp||keys.current.KeyW),jumpStart=jump&&!p.jumpPressed,slideHeld=!!(keys.current.ArrowDown||keys.current.KeyS);p.jumpPressed=jump;p.duck=slideHeld;
 if(jumpStart&&p.jumpCount<p.maxJumps&&!p.duck){
  const efJump=TRAIL_EFFECTS.find(e=>e.id===rt.skin)||TRAIL_EFFECTS[0];
  const isDouble=p.jumpCount===1;
  p.vy=isDouble?-13.2:-15.5;p.on=false;p.jumpCount++;
  p.justDoubleJumped=isDouble;p.fastFall=false;
  pushFootTrail(g,efJump,p,rt.loadout?.bodyType==="female",isDouble?"burst":"land");
  txt(isDouble?"DOUBLE JUMP!":"+ JUMP",p.x+6,p.y-10,isDouble?"style":"score");
  if(isDouble){g.style+=80;g.combo+=.35;g.maxCombo=Math.max(g.maxCombo,Math.floor(g.combo));}
 }
 if(slideHeld&&!p.on){
  if(!p.fastFall){
   const efFall=TRAIL_EFFECTS.find(e=>e.id===rt.skin)||TRAIL_EFFECTS[0];
   pushFootTrail(g,efFall,p,rt.loadout?.bodyType==="female","burst");
   txt("FAST FALL",p.x+5,p.y-8,"style");
   p.fastFallFx=14;
  }
  p.fastFall=true;
  if(p.vy<8.5)p.vy=8.5;
 }
 p.vy+=p.fastFall?1.08:.78;p.y+=p.vy;const th=p.duck&&p.on?52:76,b=p.y+p.h;p.h+=(th-p.h)*.35;p.y=b-p.h;if(p.y+p.h>=GROUND){p.y=GROUND-p.h;p.vy=0;if(!p.on){const ef2=TRAIL_EFFECTS.find(e=>e.id===state.current.skin)||TRAIL_EFFECTS[0];pushFootTrail(g,ef2,p,state.current.loadout?.bodyType==="female","land");if(p.fastFall){g.style+=45;g.combo+=.18;txt("QUICK LAND",p.x+4,p.y-8,"style")}}p.on=true;p.jumpCount=0;p.justDoubleJumped=false;p.fastFall=false;p.fastFallFx=0}if(g.timer>0)g.timer--;if(p.fastFallFx>0)p.fastFallFx--;if(g.timer<=0&&g.combo>1)g.combo=Math.max(1,g.combo-.02);["inv","shield","magnet","boost","shake"].forEach(k=>{if(g[k]>0)g[k]--});g.anim+=p.on?(p.duck?.12:.22*boost):.075;g.distance+=g.speed*boost;if(g.boost>0)g.bonus+=1.35+g.speed*.06+Math.max(1,g.combo)*.08;const ef=TRAIL_EFFECTS.find(e=>e.id===rt.skin)||TRAIL_EFFECTS[0];if(ef.type!=="none"&&(p.on||g.boost>0)&&Math.random()<(quality==="low"?.24:.44))pushFootTrail(g,ef,p,rt.loadout?.bodyType==="female","run");g.speed+=.0028;g.heat=clamp(g.heat-.006,0,100);g.score=Math.floor((Math.floor(g.distance/8)+g.coins*25+g.style)*comboMult(g.combo)+g.bonus);if(--g.nextObs<=0){g.obs.push(buildObstacle(obstacleTypeForScore(g.score),W+30));g.nextObs=Math.max(72,118+Math.random()*92-g.speed*3.2)}if(--g.nextCoin<=0){const arc=Math.random()>.45;for(let i=0;i<5;i++)g.coinItems.push({x:W+25+i*34,y:arc?GROUND-130-Math.sin(i/4*Math.PI)*55:GROUND-72,w:22,h:22,spin:Math.random()*6});g.nextCoin=84+Math.random()*85}if(--g.nextPower<=0){const ts=["shield","magnet","boost"],type=ts[Math.floor(Math.random()*ts.length)];g.power.push({type,x:W+40,y:GROUND-155-Math.random()*75,w:30,h:30,spin:0});g.nextPower=360+Math.random()*260}g.obs.forEach(o=>o.x-=(g.speed+obstacleSpeedMod(o))*boost);g.coinItems.forEach(co=>{if(g.magnet>0&&dist(p,co)<245){const pull=clamp(.08+g.speed*.004,.08,.18);co.x+=(p.x+p.w/2-co.x)*pull;co.y+=(p.y+p.h/2-co.y)*pull}co.x-=g.speed*boost;co.spin+=.2});g.power.forEach(u=>{u.x-=g.speed*boost;u.spin+=.12});g.obs=g.obs.filter(o=>o.x+o.w>-30);g.coinItems=g.coinItems.filter(co=>co.x+co.w>-30);g.power=g.power.filter(u=>u.x+u.w>-30);const hb=playerHitbox(p);g.coinItems=g.coinItems.filter(co=>{if(hit(hb,co)){g.combo=Math.min(25,g.combo+Math.min(.35,.09+g.combo*.006));g.timer=120;g.maxCombo=Math.max(g.maxCombo,Math.floor(g.combo));g.coins++;g.style+=Math.floor(2*g.combo);part(co.x+10,co.y+10,"coin",10);return false}return true});g.power=g.power.filter(u=>{if(hit(hb,u)){if(u.type==="shield"){g.shield=720;setToast("Shield activated")}if(u.type==="magnet"){g.magnet=780;setToast("Magnet activated")}if(u.type==="boost"){g.boost=540;setToast("Boost activated")}g.style+=80;txt(u.type.toUpperCase(),u.x,u.y-12,"power");part(u.x+15,u.y+15,"power",g.visual==="low"?8:14);return false}return true});for(const o of g.obs){
 const ob=obstacleHitbox(o);
 if(!o.passed&&o.x+o.w<p.x){o.passed=true;g.dodges++;g.style+=(o.reward||35);g.combo=Math.min(25,g.combo+(o.type==="LOW_JUMP"?.28:.42));g.timer=120;g.maxCombo=Math.max(g.maxCombo,Math.floor(g.combo));txt(o.type==="LOW_JUMP"?"CLEAN JUMP":`${o.label} CLEAR`,p.x,p.y-12,"style")}
 if(g.inv<=0&&hit(hb,ob)){
  if(g.shield>0){g.shield=0;g.inv=42;g.heat=clamp(g.heat+24,0,100);g.shake=11;txt("SHIELD BLOCK",p.x,p.y-18,"power");o.x-=100}
  else{g.lives--;g.inv=90;g.combo=1;g.timer=0;g.heat=clamp(g.heat+42,0,100);g.shake=18;o.x-=80;setToast(g.lives<=0?"โดนจับแล้ว!":"ตำรวจเริ่มไล่หนักขึ้น!");if(g.lives<=0&&!g.gameOver){g.gameOver=true;const fs=g.score,fc=g.coins,fst=g.style,fm=g.maxCombo,nb=Math.max(fs,best()),nw=num(get(LS.wallet,"0"))+fc;set(LS.best,String(nb));set(LS.wallet,String(nw));setWalletCoins(nw);setBestScore(nb);setLeaderboard(addBoard(rt.playerName,fs,fc,fst,fm));setSavedScore(fs);state.current={...state.current,status:"gameover",saved:fs};setStatus("gameover");saveCloudResult(fs,fc,fm,fst)}}break}
}
g.trails.forEach(t=>{t.life--;t.x+=(t.vx||(-g.speed*.75*boost));t.y+=(t.vy||0);t.vy=(t.vy||0)+.03});g.trails=g.trails.filter(t=>t.life>0).slice(-42);g.particles.forEach(pt=>{pt.x+=pt.vx;pt.y+=pt.vy;pt.vy+=.25;pt.life--});g.particles=g.particles.filter(pt=>pt.life>0);g.texts.forEach(t=>{t.y-=.75;t.life--});g.texts=g.texts.filter(t=>t.life>0);g.build.forEach(b=>{b.x-=g.speed*.28*boost;if(b.x+b.w<0){b.x=W+Math.random()*120;b.w=70+Math.random()*45;b.h=90+Math.random()*190;b.win=Math.floor(4+Math.random()*7)}});g.stars.forEach(s=>{s.x-=g.speed*.08*boost;if(s.x<0)s.x=W});g.rain.forEach(r=>{r.x-=g.speed*.35*boost;r.y+=r.spd*boost;if(r.y>H+30||r.x<-30){r.x=Math.random()*W+40;r.y=-30}});const now=performance.now();if(now-ui.current>100||g.lives<=0){ui.current=now;setScore(g.score);setCoins(g.coins);setLives(g.lives);setCombo(Math.floor(g.combo));setMaxCombo(g.maxCombo);setStyleScore(g.style)}}
 function drawAvatar(ctx,p,lo,sk){
 const ef=TRAIL_EFFECTS.find(e=>e.id===sk)||TRAIL_EFFECTS[0],ps=parts(lo),isFemale=ps.bodyType==="female",hy=22;
 const faceX=24,faceY=isFemale?16:15,faceRX=isFemale?13.6:15.4,faceRY=isFemale?15.1:15.4;
 const legBaseY=p.h-32,torsoX=isFemale?10:8,torsoW=isFemale?28:32,armY=hy+14;
 const shoeY=isFemale?p.h-9:p.h-8,shoeH=isFemale?8:9;
 ctx.save();ctx.translate(p.x,p.y);ctx.shadowColor="transparent";ctx.shadowBlur=0;
 if(ef.wing){ctx.fillStyle="rgba(255,255,255,.6)";ctx.beginPath();ctx.ellipse(-5,36,18,34,-.55,0,Math.PI*2);ctx.fill();ctx.fillStyle="rgba(15,23,42,.72)";ctx.beginPath();ctx.ellipse(52,37,18,34,.55,0,Math.PI*2);ctx.fill()}
 const drawLeg=(x,w,h)=>{ctx.save();ctx.translate(x,legBaseY);rr(-w/2,0,w,h,7);ctx.fill();ctx.restore()};
 ctx.fillStyle=ps.pants.main;
 if(ps.pants.style==="baggy"){const gr=ctx.createLinearGradient(10,legBaseY,38,p.h);gr.addColorStop(0,ps.pants.main);gr.addColorStop(1,ps.pants.detail);ctx.fillStyle=gr;drawLeg(isFemale?18:18,isFemale?11.5:13,isFemale?30:31);drawLeg(isFemale?31:32,isFemale?11.5:13,isFemale?30:31)}
 else if(ps.pants.style==="cargo"){drawLeg(18,isFemale?10.5:12,31);drawLeg(31,isFemale?10.5:12,31);ctx.fillStyle=ps.pants.detail;ctx.fillRect(isFemale?12:11,p.h-20,5,5);ctx.fillRect(isFemale?30:31,p.h-20,5,5)}
 else if(ps.pants.style==="wideLeg"){drawLeg(18,isFemale?11:13,29);drawLeg(31,isFemale?11:13,29);ctx.fillStyle=ps.pants.detail;ctx.fillRect(12,p.h-6,8,2);ctx.fillRect(28,p.h-6,8,2)}
 else{drawLeg(18,isFemale?9.2:11,isFemale?28:28);drawLeg(31,isFemale?9.2:11,isFemale?28:28);ctx.fillStyle=ps.pants.detail;ctx.fillRect(14,p.h-5,7,2);ctx.fillRect(28,p.h-5,7,2)}
 ctx.fillStyle=ps.shoes.main;
 if(ps.shoes.style==="highTop"){rr(7,shoeY-4,isFemale?15:18,isFemale?12:13,5);ctx.fill();rr(isFemale?24:25,shoeY-4,isFemale?15:18,isFemale?12:13,5);ctx.fill()}
 else{rr(7,shoeY,isFemale?18:20,shoeH,5);ctx.fill();rr(isFemale?24:24,shoeY,isFemale?19:22,shoeH,5);ctx.fill()}
 if(ps.shoes.style==="wingShoes"){ctx.fillStyle="rgba(255,255,255,.72)";ctx.beginPath();ctx.ellipse(5,p.h-7,6.5,3.2,-.2,0,Math.PI*2);ctx.ellipse(45,p.h-7,6.5,3.2,.2,0,Math.PI*2);ctx.fill()}
 ctx.fillStyle=ps.shoes.sole;ctx.fillRect(8,p.h-2,isFemale?16:18,2);ctx.fillRect(isFemale?25:26,p.h-2,isFemale?16:18,2);
 if(ps.top.style==="plainTee"){
  ctx.fillStyle=ps.top.main;rr(torsoX,hy+3,torsoW,isFemale?25:26,10);ctx.fill();
  ctx.fillStyle=ps.top.accent;ctx.fillRect(isFemale?15:13,hy+10,isFemale?16:22,3)
 }else if(ps.top.style==="hoodie"){
  const gr=ctx.createLinearGradient(0,hy,48,hy+34);gr.addColorStop(0,ps.top.accent);gr.addColorStop(.18,ps.top.main);gr.addColorStop(1,"#09090b");ctx.fillStyle=gr;rr(isFemale?8:5,hy,isFemale?32:38,30,13);ctx.fill();ctx.fillStyle=ps.top.detail;rr(isFemale?12:9,hy+17,isFemale?24:30,12,7);ctx.fill()
 }else if(ps.top.style==="varsity"){
  ctx.fillStyle=ps.top.main;rr(isFemale?9:8,hy,isFemale?30:32,29,10);ctx.fill();ctx.fillStyle=ps.top.sleeve;rr(4,hy+2,8,24,6);ctx.fill();rr(36,hy+2,8,24,6);ctx.fill();ctx.fillStyle=ps.top.accent;ctx.fillRect(23,hy+2,2.5,25)
 }else if(ps.top.style==="layeredTee"){
  ctx.fillStyle=ps.top.inner;rr(isFemale?9:7,hy+4,isFemale?30:36,27,10);ctx.fill();ctx.fillStyle=ps.top.main;rr(isFemale?11:9,hy,isFemale?26:32,23,9);ctx.fill();ctx.fillStyle=ps.top.accent;ctx.fillRect(isFemale?16:14,hy+8,isFemale?14:22,3)
 }else if(ps.top.style==="cropJacket"){
  ctx.fillStyle=ps.top.main;rr(10,hy,28,22,10);ctx.fill();ctx.fillStyle=ps.top.detail;rr(12,hy+18,24,8,5);ctx.fill();ctx.fillStyle=ps.top.accent;ctx.fillRect(16,hy+4,16,3)
 }else{
  ctx.fillStyle=ps.top.main;rr(isFemale?8:6,hy,isFemale?32:37,32,12);ctx.fill();ctx.strokeStyle=ps.top.detail;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(isFemale?11:9,hy+6+i*6);ctx.lineTo(isFemale?38:40,hy+6+i*6);ctx.stroke()}ctx.fillStyle=ps.top.accent;ctx.fillRect(23,hy+3,2,23)
 }
 if(isFemale&&ps.top.style!=="cropJacket"){ctx.fillStyle="rgba(15,23,42,.18)";rr(15,hy+18,18,7,4);ctx.fill()}
 ctx.lineCap="round";ctx.strokeStyle=ps.top.style==="varsity"?ps.top.sleeve:ps.top.main;ctx.lineWidth=isFemale?5:6;ctx.beginPath();ctx.moveTo(isFemale?11:8,armY);ctx.lineTo(4,hy+31);ctx.moveTo(isFemale?38:42,armY);ctx.lineTo(45,hy+31);ctx.stroke();
 if(ps.accessory?.style==="chain"){ctx.strokeStyle=ps.accessory.main||"#e5e7eb";ctx.lineWidth=2;ctx.beginPath();ctx.arc(24,hy+10,isFemale?9:10,0,Math.PI);ctx.stroke()}
 if(ps.accessory?.style==="glasses"){ctx.strokeStyle=ps.accessory.main||"#111827";ctx.lineWidth=2;ctx.strokeRect(16,14,6.5,4);ctx.strokeRect(26,14,6.5,4);ctx.beginPath();ctx.moveTo(22.5,16);ctx.lineTo(26,16);ctx.stroke()}
 if(ps.accessory?.style==="bag"){ctx.strokeStyle=ps.accessory.accent||"#facc15";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(10,hy+2);ctx.lineTo(38,hy+32);ctx.stroke();ctx.fillStyle=ps.accessory.main||"#111827";rr(31,hy+20,12,11,4);ctx.fill()}
 const sg=ctx.createRadialGradient(19,10,3,24,15,17);sg.addColorStop(0,"#ffd6b4");sg.addColorStop(.55,ps.hair.skinTone||"#d6a37c");sg.addColorStop(1,"#9a6a4f");ctx.fillStyle=sg;ctx.beginPath();ctx.ellipse(faceX,faceY,faceRX,faceRY,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle=ps.hair.hair;
 if(ps.hair.style==="capFade"){ctx.beginPath();ctx.arc(22,10,17,Math.PI,Math.PI*2);ctx.fill();if(isFemale){rr(11,10,6,18,6);ctx.fill();rr(30,10,6,18,6);ctx.fill()}ctx.fillStyle=ps.hair.cap||"#ef4444";rr(9,-1,30,8,6);ctx.fill();ctx.fillRect(36,3,13,4)}
 else if(ps.hair.style==="fluffy"){ctx.beginPath();ctx.arc(15,9,8,0,Math.PI*2);ctx.arc(23,5,10,0,Math.PI*2);ctx.arc(31,8,8,0,Math.PI*2);ctx.arc(37,12,6,0,Math.PI*2);ctx.fill();if(isFemale){rr(12,11,6,16,5);ctx.fill();rr(30,11,6,16,5);ctx.fill()}}
 else if(ps.hair.style==="spike"){ctx.beginPath();ctx.moveTo(9,12);ctx.lineTo(13,2);ctx.lineTo(18,9);ctx.lineTo(23,0);ctx.lineTo(28,9);ctx.lineTo(34,2);ctx.lineTo(39,13);ctx.lineTo(39,16);ctx.lineTo(9,16);ctx.closePath();ctx.fill()}
 else if(ps.hair.style==="basicShort"){ctx.beginPath();ctx.arc(24,9,15,Math.PI,Math.PI*2);ctx.fill();ctx.fillRect(10,10,28,5);if(isFemale){rr(13,11,5,12,4);ctx.fill();rr(30,11,5,12,4);ctx.fill();ctx.beginPath();ctx.moveTo(14,9);ctx.quadraticCurveTo(24,3,34,9);ctx.lineTo(34,14);ctx.lineTo(14,14);ctx.closePath();ctx.fill()}}
 else if(ps.hair.style==="longStreet"){ctx.beginPath();ctx.arc(24,9,16,Math.PI,Math.PI*2);ctx.fill();rr(8,8,8,30,7);ctx.fill();rr(32,8,8,30,7);ctx.fill();ctx.beginPath();ctx.moveTo(15,10);ctx.quadraticCurveTo(24,3,33,10);ctx.lineTo(33,15);ctx.lineTo(15,15);ctx.closePath();ctx.fill()}
 else{ctx.beginPath();ctx.arc(18,8,10,Math.PI,Math.PI*2);ctx.arc(30,8,10,Math.PI,Math.PI*2);ctx.fill();ctx.fillStyle="rgba(255,255,255,.08)";ctx.fillRect(23,1,2,12);if(isFemale){ctx.fillStyle=ps.hair.hair;rr(12,11,5,14,4);ctx.fill();rr(31,11,5,14,4);ctx.fill()}}
 ctx.fillStyle="#0f172a";ctx.beginPath();ctx.arc(19,15,isFemale?1.9:1.7,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(29,15,isFemale?1.9:1.7,0,Math.PI*2);ctx.fill();
 if(isFemale){ctx.strokeStyle="rgba(15,23,42,.55)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(16,13);ctx.lineTo(13,12);ctx.moveTo(32,13);ctx.lineTo(35,12);ctx.moveTo(17,17);ctx.lineTo(21,17);ctx.moveTo(27,17);ctx.lineTo(31,17);ctx.stroke();ctx.strokeStyle="rgba(244,114,182,.85)";ctx.lineWidth=1.35;ctx.beginPath();ctx.arc(24,21,4,.2,Math.PI-.2);ctx.stroke()}
 else{ctx.fillStyle="rgba(15,23,42,.55)";ctx.fillRect(21,21,6,1.6)}
 ctx.fillStyle="rgba(244,114,182,.38)";ctx.beginPath();ctx.arc(16,19,3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(32,19,3,0,Math.PI*2);ctx.fill();ctx.restore()}
 function draw(){const g=game.current,sx=g.shake>0?(Math.random()-.5)*g.shake:0,sy=g.shake>0?(Math.random()-.5)*g.shake*.4:0;ctx.save();ctx.translate(sx,sy);ctx.clearRect(-20,-20,W+40,H+40);const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,"#020617");sky.addColorStop(.55,"#111827");sky.addColorStop(1,g.heat>35?"#7f1d1d":"#312e81");ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);ctx.fillStyle="rgba(255,255,255,.86)";ctx.beginPath();ctx.arc(760,72,34,0,Math.PI*2);ctx.fill();ctx.fillStyle="rgba(2,6,23,.85)";ctx.beginPath();ctx.arc(748,61,31,0,Math.PI*2);ctx.fill();g.stars.forEach(s=>{ctx.fillStyle="rgba(255,255,255,.75)";ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill()});g.build.forEach((b,i)=>{ctx.fillStyle=i%2?"#0f172a":"#111827";ctx.fillRect(b.x,GROUND-b.h,b.w,b.h);ctx.fillStyle=g.heat>35?"rgba(248,113,113,.75)":"rgba(250,204,21,.72)";for(let r=0;r<b.win;r++)for(let j=0;j<3;j++)if((r+j+i)%3!==0)ctx.fillRect(b.x+12+j*18,GROUND-b.h+18+r*24,7,10)});ctx.fillStyle="#18181b";ctx.fillRect(0,GROUND,W,H-GROUND);ctx.strokeStyle="rgba(250,204,21,.75)";ctx.lineWidth=5;ctx.setLineDash([38,32]);ctx.beginPath();ctx.moveTo((-g.distance*.7)%70,458);ctx.lineTo(W,458);ctx.stroke();ctx.setLineDash([]);if(g.heat>35){ctx.fillStyle="rgba(239,68,68,.18)";ctx.fillRect(0,0,W,H);ctx.fillStyle="#ef4444";ctx.font="bold 20px sans-serif";ctx.fillText("POLICE CHASE!",24,46)}g.obs.forEach(o=>shadow(o.x+o.w/2,GROUND-4,o.w*1.2,18,.32));shadow(g.player.x+g.player.w/2,GROUND-3,62,16,.32);if(g.player.fastFall||g.player.fastFallFx>0){ctx.save();ctx.globalAlpha=g.player.fastFall?.45:.25;ctx.strokeStyle="rgba(250,204,21,.55)";ctx.lineWidth=3;ctx.lineCap="round";for(let i=0;i<5;i++){const x=g.player.x+8+i*8,y=g.player.y-18-i*7;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-8,y-18);ctx.stroke()}ctx.restore()}g.trails.forEach(t=>{const a=Math.max(t.life/t.max,0);ctx.save();ctx.globalAlpha=a;ctx.fillStyle=t.color;ctx.strokeStyle=t.color;ctx.lineCap="round";ctx.lineWidth=Math.max(2,t.size*.28*a);if(t.type==="lightning"){ctx.beginPath();ctx.moveTo(t.x,t.y);ctx.lineTo(t.x+8*a,t.y-5);ctx.lineTo(t.x+16*a,t.y+2);ctx.stroke()}else if(t.type==="smoke"){ctx.globalAlpha=a*.42;ctx.beginPath();ctx.ellipse(t.x,t.y,t.size*.9*a,t.size*.55*a,0,0,Math.PI*2);ctx.fill()}else if(t.type==="holo"){ctx.save();ctx.translate(t.x,t.y);ctx.rotate(.7);ctx.fillRect(-t.size*.25*a,-t.size*.25*a,t.size*.5*a,t.size*.5*a);ctx.restore()}else{ctx.beginPath();ctx.ellipse(t.x,t.y,Math.max(4,t.size*1.45*a),Math.max(2,t.size*.42*a),-.15,0,Math.PI*2);ctx.fill()}ctx.restore();ctx.globalAlpha=1});g.coinItems.forEach(co=>{ctx.save();ctx.translate(co.x+11,co.y+11);ctx.scale(Math.abs(Math.cos(co.spin))*.55+.35,1);ctx.fillStyle="#facc15";ctx.beginPath();ctx.arc(0,0,11,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#f97316";ctx.lineWidth=2;ctx.stroke();ctx.fillStyle="#fff7ed";ctx.font="bold 13px sans-serif";ctx.textAlign="center";ctx.fillText("$",0,5);ctx.restore()});g.power.forEach(u=>{const icon=u.type==="shield"?"🛡":u.type==="magnet"?"🧲":"⚡";ctx.save();ctx.translate(u.x+15,u.y+15);ctx.rotate(u.spin);ctx.fillStyle=u.type==="shield"?"#60a5fa":u.type==="magnet"?"#f472b6":"#facc15";ctx.beginPath();ctx.arc(0,0,17,0,Math.PI*2);ctx.fill();ctx.font="18px sans-serif";ctx.textAlign="center";ctx.fillText(icon,0,7);ctx.restore()});g.obs.forEach(o=>{
 ctx.save();
 if(o.type==="HIGH_SLIDE"){
  ctx.fillStyle="rgba(56,189,248,.22)";ctx.fillRect(o.x-8,o.y-8,o.w+16,o.h+16);
  ctx.fillStyle="#0f172a";rr(o.x,o.y,o.w,o.h,12);ctx.fill();ctx.strokeStyle=o.color;ctx.lineWidth=3;ctx.stroke();
  ctx.fillStyle=o.color;ctx.beginPath();ctx.arc(o.x+o.w*.5,o.y+o.h*.5,7,0,Math.PI*2);ctx.fill();
 }else if(o.type==="TALL_DOUBLE"){
  const gr=ctx.createLinearGradient(o.x,o.y,o.x,o.y+o.h);gr.addColorStop(0,"#4c1d95");gr.addColorStop(1,"#111827");ctx.fillStyle=gr;rr(o.x,o.y,o.w,o.h,10);ctx.fill();ctx.strokeStyle=o.color;ctx.lineWidth=3;ctx.stroke();
  ctx.fillStyle="rgba(255,255,255,.14)";for(let i=0;i<4;i++)ctx.fillRect(o.x+8,o.y+12+i*16,o.w-16,3);
 }else if(o.type==="MIXED"){
  ctx.fillStyle="#111827";rr(o.x,o.y,o.w,o.h,12);ctx.fill();ctx.strokeStyle=o.color;ctx.lineWidth=3;ctx.stroke();
  ctx.fillStyle="rgba(56,189,248,.35)";ctx.fillRect(o.x+6,o.y+9,o.w-12,10);ctx.fillStyle="rgba(249,115,22,.55)";rr(o.x+17,o.y+42,30,29,7);ctx.fill();
 }else{
  ctx.fillStyle="#ef4444";rr(o.x,o.y,o.w,o.h,9);ctx.fill();ctx.fillStyle="#facc15";ctx.fillRect(o.x+5,o.y+10,o.w-10,7);ctx.fillStyle="#111827";ctx.fillRect(o.x+8,o.y+24,o.w-16,6);
 }
 if(o.x<W+80&&o.x>-80){const wx=o.x+o.w/2,wy=o.y-22;ctx.fillStyle="rgba(2,6,23,.84)";rr(wx-26,wy-16,52,18,9);ctx.fill();ctx.strokeStyle=o.color||"#fde047";ctx.lineWidth=2;ctx.stroke();ctx.font="900 14px system-ui";ctx.textAlign="center";ctx.fillStyle=o.color||"#fde047";ctx.fillText(o.icon||"⬆",wx,wy-2);ctx.font="800 10px system-ui";ctx.fillStyle="rgba(226,232,240,.9)";ctx.fillText(o.label||"Jump",wx,o.y-2)}
 ctx.restore();
});drawAvatar(ctx,g.player,state.current.loadout,state.current.skin);g.rain.forEach(r=>{ctx.strokeStyle=`rgba(226,232,240,${r.a})`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(r.x,r.y);ctx.lineTo(r.x-5,r.y+r.len);ctx.stroke()});g.particles.forEach(pt=>{ctx.globalAlpha=Math.max(pt.life/26,0);ctx.fillStyle=pt.type==="coin"?"#facc15":pt.type==="power"?"#60a5fa":"#ef4444";ctx.beginPath();ctx.arc(pt.x,pt.y,3,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1});g.texts.forEach(t=>{ctx.globalAlpha=Math.max(t.life/55,0);ctx.fillStyle=t.type==="power"?"#60a5fa":"#facc15";ctx.font="900 18px sans-serif";ctx.fillText(t.txt,t.x,t.y);ctx.globalAlpha=1});ctx.restore();ctx.fillStyle="rgba(2,6,23,.55)";rr(14,14,285,82,18);ctx.fill();ctx.fillStyle="#fff";ctx.font="bold 16px sans-serif";ctx.fillText(`Combo x${Math.max(1,Math.floor(g.combo))}`,30,42);ctx.fillText(`Style +${g.style}`,30,70);ctx.fillStyle="#facc15";ctx.fillText(`Heat ${Math.floor(g.heat)}%`,150,70);if(state.current.status!=="playing"){ctx.fillStyle="rgba(2,6,23,.7)";ctx.fillRect(0,0,W,H);ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="800 42px sans-serif";ctx.fillText(state.current.status==="gameover"?"โดนจับแล้ว!":"SWAG NIGHT RUNNER",W/2,190);ctx.font="18px sans-serif";ctx.fillText("มือถือ: แตะขวาเพื่อกระโดด / กระโดดสองครั้ง • แตะซ้ายค้างเพื่อหมอบ",W/2,232);ctx.fillStyle="#facc15";ctx.font="bold 22px sans-serif";const fs=state.current.saved??g.score;ctx.fillText(state.current.status==="gameover"?`คะแนนสุดท้าย: ${fs} • Rank ${grade(fs,g.maxCombo,g.style)}`:"Combo • Power-up • Police Chase • Friends",W/2,268);ctx.textAlign="start"}}
 const loop=()=>{update();draw();raf.current=requestAnimationFrame(loop)};loop();return()=>cancelAnimationFrame(raf.current)},[screen]);
 // preview canvas
 useEffect(()=>{
  const c=previewCanvasRef.current;if(!c)return;
  const ctx=c.getContext("2d"),d=2;c.width=420;c.height=340;ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,210,170);
  const rr=(x,y,w,h,r)=>{r=clamp(r,0,Math.min(w,h)/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()};
  const previewSourceLoadout=screen==="menu"?loadout:previewLoadout,previewSourceSkin=screen==="menu"?skin:previewSkin;
  const ps=parts(previewSourceLoadout),ef=EFFECTS.find(e=>e.id===previewSourceSkin)||EFFECTS[0],isFemale=ps.bodyType==="female";
  const ph=76,hy=22,faceX=24,faceY=isFemale?16:15,faceRX=isFemale?13.6:15.4,faceRY=isFemale?15.1:15.4;
  const legBaseY=ph-32,torsoX=isFemale?10:8,torsoW=isFemale?28:32,shoeY=isFemale?ph-9:ph-8,shoeH=isFemale?8:9;
  ctx.save();ctx.translate(82,36);ctx.scale(isFemale?1.18:1.25,isFemale?1.18:1.25);ctx.shadowColor="transparent";ctx.shadowBlur=0;
  if(ef.wing){ctx.fillStyle="rgba(255,255,255,.60)";ctx.beginPath();ctx.ellipse(-5,36,18,34,-.55,0,Math.PI*2);ctx.fill();ctx.fillStyle="rgba(15,23,42,.72)";ctx.beginPath();ctx.ellipse(52,37,18,34,.55,0,Math.PI*2);ctx.fill()}
  const leg=(x,w,h)=>{ctx.save();ctx.translate(x,legBaseY);rr(-w/2,0,w,h,7);ctx.fill();ctx.restore()};
  ctx.fillStyle=ps.pants.main;
  if(ps.pants.style==="baggy"){const gr=ctx.createLinearGradient(10,legBaseY,38,ph);gr.addColorStop(0,ps.pants.main);gr.addColorStop(1,ps.pants.detail);ctx.fillStyle=gr;leg(18,isFemale?11.5:13,isFemale?30:31);leg(31,isFemale?11.5:13,isFemale?30:31)}
  else if(ps.pants.style==="cargo"){leg(18,isFemale?10.5:12,31);leg(31,isFemale?10.5:12,31);ctx.fillStyle=ps.pants.detail;ctx.fillRect(isFemale?12:11,ph-20,5,5);ctx.fillRect(isFemale?30:31,ph-20,5,5)}
  else if(ps.pants.style==="wideLeg"){leg(18,isFemale?11:13,29);leg(31,isFemale?11:13,29);ctx.fillStyle=ps.pants.detail;ctx.fillRect(12,ph-6,8,2);ctx.fillRect(28,ph-6,8,2)}
  else{leg(18,isFemale?9.2:11,28);leg(31,isFemale?9.2:11,28);ctx.fillStyle=ps.pants.detail;ctx.fillRect(14,ph-5,7,2);ctx.fillRect(28,ph-5,7,2)}
  ctx.fillStyle=ps.shoes.main;
  if(ps.shoes.style==="highTop"){rr(7,shoeY-4,isFemale?15:18,isFemale?12:13,5);ctx.fill();rr(isFemale?24:25,shoeY-4,isFemale?15:18,isFemale?12:13,5);ctx.fill()}else{rr(7,shoeY,isFemale?18:20,shoeH,5);ctx.fill();rr(24,shoeY,isFemale?19:22,shoeH,5);ctx.fill()}
  if(ps.shoes.style==="wingShoes"){ctx.fillStyle="rgba(255,255,255,.72)";ctx.beginPath();ctx.ellipse(5,ph-7,6.5,3.2,-.2,0,Math.PI*2);ctx.ellipse(45,ph-7,6.5,3.2,.2,0,Math.PI*2);ctx.fill()}
  ctx.fillStyle=ps.shoes.sole;ctx.fillRect(8,ph-2,isFemale?16:18,2);ctx.fillRect(isFemale?25:26,ph-2,isFemale?16:18,2);
  if(ps.top.style==="plainTee"){ctx.fillStyle=ps.top.main;rr(torsoX,hy+3,torsoW,isFemale?25:26,10);ctx.fill();ctx.fillStyle=ps.top.accent;ctx.fillRect(isFemale?15:13,hy+10,isFemale?16:22,3)}
  else if(ps.top.style==="hoodie"){const gr=ctx.createLinearGradient(0,hy,48,hy+34);gr.addColorStop(0,ps.top.accent);gr.addColorStop(.18,ps.top.main);gr.addColorStop(1,"#09090b");ctx.fillStyle=gr;rr(isFemale?8:5,hy,isFemale?32:38,30,13);ctx.fill();ctx.fillStyle=ps.top.detail;rr(isFemale?12:9,hy+17,isFemale?24:30,12,7);ctx.fill()}
  else if(ps.top.style==="varsity"){ctx.fillStyle=ps.top.main;rr(isFemale?9:8,hy,isFemale?30:32,29,10);ctx.fill();ctx.fillStyle=ps.top.sleeve;rr(4,hy+2,8,24,6);ctx.fill();rr(36,hy+2,8,24,6);ctx.fill();ctx.fillStyle=ps.top.accent;ctx.fillRect(23,hy+2,2.5,25)}
  else if(ps.top.style==="layeredTee"){ctx.fillStyle=ps.top.inner;rr(isFemale?9:7,hy+4,isFemale?30:36,27,10);ctx.fill();ctx.fillStyle=ps.top.main;rr(isFemale?11:9,hy,isFemale?26:32,23,9);ctx.fill();ctx.fillStyle=ps.top.accent;ctx.fillRect(isFemale?16:14,hy+8,isFemale?14:22,3)}
  else if(ps.top.style==="cropJacket"){ctx.fillStyle=ps.top.main;rr(10,hy,28,22,10);ctx.fill();ctx.fillStyle=ps.top.detail;rr(12,hy+18,24,8,5);ctx.fill();ctx.fillStyle=ps.top.accent;ctx.fillRect(16,hy+4,16,3)}
  else{ctx.fillStyle=ps.top.main;rr(isFemale?8:6,hy,isFemale?32:37,32,12);ctx.fill();ctx.strokeStyle=ps.top.detail;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(isFemale?11:9,hy+6+i*6);ctx.lineTo(isFemale?38:40,hy+6+i*6);ctx.stroke()}ctx.fillStyle=ps.top.accent;ctx.fillRect(23,hy+3,2,23)}
  if(isFemale&&ps.top.style!=="cropJacket"){ctx.fillStyle="rgba(15,23,42,.18)";rr(15,hy+18,18,7,4);ctx.fill()}
  ctx.lineCap="round";ctx.strokeStyle=ps.top.style==="varsity"?ps.top.sleeve:ps.top.main;ctx.lineWidth=isFemale?5:6;ctx.beginPath();ctx.moveTo(isFemale?11:8,hy+14);ctx.lineTo(4,hy+31);ctx.moveTo(isFemale?38:42,hy+14);ctx.lineTo(45,hy+31);ctx.stroke();
  const sg=ctx.createRadialGradient(19,10,3,24,15,17);sg.addColorStop(0,"#ffd6b4");sg.addColorStop(.55,ps.hair.skinTone||"#d6a37c");sg.addColorStop(1,"#9a6a4f");ctx.fillStyle=sg;ctx.beginPath();ctx.ellipse(faceX,faceY,faceRX,faceRY,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=ps.hair.hair;
  if(ps.hair.style==="capFade"){ctx.beginPath();ctx.arc(22,10,17,Math.PI,Math.PI*2);ctx.fill();if(isFemale){rr(11,10,6,18,6);ctx.fill();rr(30,10,6,18,6);ctx.fill()}ctx.fillStyle=ps.hair.cap||"#ef4444";rr(9,-1,30,8,6);ctx.fill();ctx.fillRect(36,3,13,4)}
  else if(ps.hair.style==="fluffy"){ctx.beginPath();ctx.arc(15,9,8,0,Math.PI*2);ctx.arc(23,5,10,0,Math.PI*2);ctx.arc(31,8,8,0,Math.PI*2);ctx.arc(37,12,6,0,Math.PI*2);ctx.fill();if(isFemale){rr(12,11,6,16,5);ctx.fill();rr(30,11,6,16,5);ctx.fill()}}
  else if(ps.hair.style==="spike"){ctx.beginPath();ctx.moveTo(9,12);ctx.lineTo(13,2);ctx.lineTo(18,9);ctx.lineTo(23,0);ctx.lineTo(28,9);ctx.lineTo(34,2);ctx.lineTo(39,13);ctx.lineTo(39,16);ctx.lineTo(9,16);ctx.closePath();ctx.fill()}
  else if(ps.hair.style==="basicShort"){ctx.beginPath();ctx.arc(24,9,15,Math.PI,Math.PI*2);ctx.fill();ctx.fillRect(10,10,28,5);if(isFemale){rr(13,11,5,12,4);ctx.fill();rr(30,11,5,12,4);ctx.beginPath();ctx.moveTo(14,9);ctx.quadraticCurveTo(24,3,34,9);ctx.lineTo(34,14);ctx.lineTo(14,14);ctx.closePath();ctx.fill()}}
  else if(ps.hair.style==="longStreet"){ctx.beginPath();ctx.arc(24,9,16,Math.PI,Math.PI*2);ctx.fill();rr(8,8,8,30,7);ctx.fill();rr(32,8,8,30,7);ctx.fill();ctx.beginPath();ctx.moveTo(15,10);ctx.quadraticCurveTo(24,3,33,10);ctx.lineTo(33,15);ctx.lineTo(15,15);ctx.closePath();ctx.fill()}
  else{ctx.beginPath();ctx.arc(18,8,10,Math.PI,Math.PI*2);ctx.arc(30,8,10,Math.PI,Math.PI*2);ctx.fill();ctx.fillStyle="rgba(255,255,255,.08)";ctx.fillRect(23,1,2,12);if(isFemale){ctx.fillStyle=ps.hair.hair;rr(12,11,5,14,4);ctx.fill();rr(31,11,5,14,4);ctx.fill()}}
  ctx.fillStyle="#0f172a";ctx.beginPath();ctx.arc(19,15,isFemale?1.9:1.7,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(29,15,isFemale?1.9:1.7,0,Math.PI*2);ctx.fill();
  if(isFemale){ctx.strokeStyle="rgba(15,23,42,.55)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(16,13);ctx.lineTo(13,12);ctx.moveTo(32,13);ctx.lineTo(35,12);ctx.moveTo(17,17);ctx.lineTo(21,17);ctx.moveTo(27,17);ctx.lineTo(31,17);ctx.stroke();ctx.strokeStyle="rgba(244,114,182,.85)";ctx.lineWidth=1.35;ctx.beginPath();ctx.arc(24,21,4,.2,Math.PI-.2);ctx.stroke()}else{ctx.fillStyle="rgba(15,23,42,.55)";ctx.fillRect(21,21,6,1.6)}
  ctx.fillStyle="rgba(244,114,182,.38)";ctx.beginPath();ctx.arc(16,19,3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(32,19,3,0,Math.PI*2);ctx.fill();if(ef.type!=="none"){ctx.globalAlpha=.75;ctx.fillStyle=ef.trail||ef.accent;for(let i=0;i<4;i++){ctx.beginPath();ctx.ellipse(-8-i*9,72-i%2*3,14-i*2,3.4,0,0,Math.PI*2);ctx.fill()}ctx.fillStyle=ef.accent;ctx.beginPath();ctx.arc(7,70,3.2,0,Math.PI*2);ctx.arc(25,71,2.8,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1}ctx.restore();
 },[previewLoadout,previewSkin,screen,loadout,skin]);
 // Need draw avatar preview using DOM trick: use a light custom preview, not full canvas effect, rendered via same CSS? We'll draw it in JSX text area by small canvas removed for simplicity.
 const progress=(()=>{const g=game.current;if(!g)return 0;if(ch.type==="coins")return g.coins;if(ch.type==="score")return g.score;if(ch.type==="combo")return g.maxCombo;return g.dodges})();
 const renderMiniPreview=(viewLoadout=previewLoadout,viewSkin=previewSkin,viewTitle=previewItem?.name||"Preview Outfit")=>{const safeLoadout=normLoadout(viewLoadout||loadout),safeSkin=TRAIL_EFFECTS.some(e=>e.id===viewSkin)?viewSkin:(skin||"none"),infoParts=parts(safeLoadout);return <div className="avatar-preview"><canvas ref={previewCanvasRef}/><div className="style-preview-info"><b>{viewTitle||"Runner Preview"}</b><span>{infoParts.bodyType==="female"?"Female Runner":"Male Runner"}</span><small>{infoParts.hair.name} • {infoParts.top.name}</small><small>{infoParts.pants.name} • {infoParts.shoes.name}</small><small>{infoParts.accessory.name} • {TRAIL_EFFECTS.find(e=>e.id===safeSkin)?.name||"No Trail"}</small></div></div>};
 
 
 const leaderboardAvatar=(entry)=><div className="leader-avatar">{entry.avatar_url?<img src={entry.avatar_url}alt={entry.name}/>:<span>{String(entry.name||"?").slice(0,1).toUpperCase()}</span>}</div>;

 const profileModalView=()=>profileModal?<div className="modal-backdrop"onClick={()=>setProfileModal(null)}><div className="profile-modal"onClick={e=>e.stopPropagation()}><div className="row"style={{justifyContent:"space-between"}}><h2>👤 Player Profile</h2><button className="btn ghost"onClick={()=>setProfileModal(null)}>✕</button></div><div className="profile-head"><div className="avatar-box">{profileModal.avatar_url?<img src={profileModal.avatar_url}alt={profileModal.username}/>:<span>{(profileModal.username||"?").slice(0,1).toUpperCase()}</span>}</div><div><h1>{profileModal.username}</h1><p className="muted">{profileModal.friend_code||"No Friend Code"} • {isOnline(profileModal.last_seen)?"ออนไลน์":"ออฟไลน์"}</p><div className="row"><div className="pill">Rank {grade(profileModal.best_score||0,profileModal.best_combo||1,profileModal.best_style||0)}</div>{profileModal.isSelf&&userRole==="dev"&&<div className="pill">DEV</div>}</div></div></div><div className="profile-grid"><div className="stat"><small>Best Score</small><b>{profileModal.best_score||0}</b></div><div className="stat"><small>Coins</small><b>{profileModal.coins||0}</b></div><div className="stat"><small>Max Combo</small><b>x{profileModal.best_combo||1}</b></div><div className="stat"><small>Style</small><b>{profileModal.best_style||0}</b></div></div><div className="notice"style={{marginTop:12}}><b>Bio</b><p style={{whiteSpace:"pre-wrap",marginBottom:0}}>{profileModal.bio||"ยังไม่ได้ตั้ง Bio"}</p></div>{profileModal.isSelf?<div className="edit-profile"><h3>ตั้งค่าโปรไฟล์</h3><input className="input"value={profileUsername}onChange={e=>setProfileUsername(cleanUsername(e.target.value))}placeholder="Username"/><div className="muted">เปลี่ยน Username ใช้ 10,000 coins • ถ้าแก้เฉพาะ Bio/Avatar ฟรี</div><textarea className="textarea"value={profileBio}onChange={e=>setProfileBio(e.target.value.slice(0,160))}placeholder="เขียน Bio ได้สูงสุด 160 ตัวอักษร"/><div className="muted">{profileBio.length}/160</div><input className="input"type="file"accept="image/png,image/jpeg,image/webp,image/gif"onChange={e=>uploadAvatar(e.target.files?.[0])}/><div className="row"><Button onClick={saveOwnProfile}>Save Profile</Button><Button variant="outline"disabled={avatarUploading}>{avatarUploading?"Uploading...":"Avatar Upload"}</Button></div></div>:<div className="row"style={{marginTop:14}}><Button onClick={()=>addFriendFromProfile(profileModal)}>เพิ่มเพื่อน</Button><Button variant="outline"onClick={()=>setProfileModal(null)}>ปิด</Button></div>}</div></div>:null;

 const panel=()=> <><div className="card pad">
 {(screen==="shop"||screen==="leaderboard"||screen==="friends"||screen==="profile"||screen==="settings"||screen==="dev")&&<div className="row" style={{marginBottom:12}}><Button variant="outline" onClick={()=>setScreen("menu")}>← Back</Button></div>}
 {screen==="leaderboard"&&<div><div className="row"style={{justifyContent:"space-between",marginBottom:12}}><div><h2>🏆 {user?"Online Leaderboard":"Local Leaderboard"}</h2><p className="muted">{user?"อันดับรวมออนไลน์":"คะแนนในเครื่องนี้"}</p></div><Button variant="outline"disabled={locked||!!user}onClick={clearBoard}>ล้าง</Button></div>{leaderboard.length===0?<div className="notice">ยังไม่มีคะแนน</div>:leaderboard.map((e,i)=><div key={e.id}className="rank rank-with-avatar clickable"onClick={()=>openProfile(e)}><div className="badge">{i+1}</div>{leaderboardAvatar(e)}<div><b>{e.name}</b><div className="muted">🪙 {e.coins} • x{e.maxCombo||1} • Style {e.styleScore||0}</div></div><b style={{color:"#fde047",fontSize:22}}>{e.score}</b></div>)}</div>}
 {screen==="friends"&&<div><div className="row"style={{justifyContent:"space-between"}}><div><h2>👥 Friends</h2><p className="muted">เพิ่มเพื่อนด้วย Friend Code ดูออนไลน์ และแข่งคะแนนเฉพาะเพื่อน</p></div><Button variant="outline"disabled={!user}onClick={()=>loadFriendsData()}>Refresh</Button></div>{!user&&<div className="notice">ต้อง Login ก่อนใช้ระบบเพื่อน</div>}{user&&<div className="notice">Friend Code ของคุณ: <b>{friendCode||"กำลังสร้าง..."}</b> — ส่งโค้ดนี้ให้เพื่อนเพิ่มคุณได้</div>}{user&&<><div className="formrow"style={{marginTop:12}}><input className="input"value={friendSearch}onChange={e=>setFriendSearch(e.target.value)}placeholder="ใส่ Friend Code เช่น NXAH-4821 หรือ username"/><Button onClick={sendFriendRequest}>เพิ่มเพื่อน</Button></div>{incoming.length>0&&<div style={{marginTop:14}}><b>คำขอเป็นเพื่อน</b>{incoming.map(r=><div className="friend-card"key={r.id}><span className={isOnline(r.requester?.last_seen)?"online-dot":"offline-dot"}/><div><b>{r.requester?.username}</b><div className="muted">{r.requester?.friend_code||""} • Best {r.requester?.best_score||0}</div></div><div className="row"><Button onClick={()=>acceptFriend(r)}>รับ</Button><Button variant="outline"onClick={()=>rejectFriend(r)}>ปฏิเสธ</Button></div></div>)}</div>}<div style={{marginTop:14}}><b>เพื่อนของคุณ</b>{friends.length===0?<div className="notice">ยังไม่มีเพื่อน ลองค้นหา username แล้วเพิ่มเพื่อน</div>:friends.map(f=><div className="friend-card clickable"key={f.id}onClick={()=>openProfile({id:f.id,name:f.username,score:f.best_score||0,maxCombo:1,styleScore:0,coins:0})}><span className={isOnline(f.last_seen)?"online-dot":"offline-dot"}/><div><b>{f.username}</b><div className="muted">{f.friend_code||""} • {isOnline(f.last_seen)?"ออนไลน์":"ออฟไลน์"} • Best {f.best_score||0}</div></div><span className="pill">{grade(f.best_score||0)}</span></div>)}</div><div style={{marginTop:16}}><h3>🏆 Friends Leaderboard</h3>{friendsLeaderboard.length===0?<div className="notice">ยังไม่มีคะแนนเพื่อน</div>:friendsLeaderboard.map((e,i)=><div key={e.id}className="rank rank-with-avatar clickable"onClick={()=>openProfile(e)}><div className="badge">{i+1}</div>{leaderboardAvatar(e)}<div><b>{e.name}</b><div className="muted">x{e.maxCombo||1} • Style {e.styleScore||0}</div></div><b style={{color:"#fde047",fontSize:22}}>{e.score}</b></div>)}</div></>}</div>}
 {screen==="play"&&<div><h2>🎯 {ch.title}</h2><p className="muted">{ch.desc}</p><div className="notice"><div style={{height:14,borderRadius:999,background:"#020617",overflow:"hidden"}}><div style={{height:"100%",width:`${clamp(progress/ch.target*100,0,100)}%`,background:"#facc15"}}/></div><p>Progress: {Math.min(progress,ch.target)} / {ch.target}</p><p className="muted">Reward +{ch.reward} coins</p></div></div>}
 {screen==="shop"&&<div><div className="row"style={{justifyContent:"space-between"}}><div><h2>🧥 Style Preview</h2><p className="muted">แตะไอเทมเพื่อ Preview ก่อนซื้อ/Equip</p></div><b style={{color:"#fde047"}}>Wallet 🪙 {walletCoins}</b></div>{locked&&<div className="notice">🔒 กำลังเล่นอยู่: เปลี่ยนได้หลังจบรอบ</div>}<div className="body-type-switch"><button className={parts(previewLoadout).bodyType==="male"?"on":""}disabled={locked}onClick={()=>previewBodyType("male")}>♂ Male Runner</button><button className={parts(previewLoadout).bodyType==="female"?"on":""}disabled={locked}onClick={()=>previewBodyType("female")}>♀ Female Runner</button></div><div className="grid3"style={{marginTop:12}}><div>{renderMiniPreview()}<Button style={{width:"100%",marginTop:8}}disabled={locked||!previewItem}onClick={buyOrEquipPreview}>{previewItem?"Buy / Equip Preview":"เลือกไอเทมก่อน"}</Button><Button variant="outline"style={{width:"100%",marginTop:8}}disabled={locked}onClick={()=>{setPreviewLoadout(loadout);setPreviewSkin(skin);setPreviewItem(null)}}>Reset Preview</Button></div><div style={{gridColumn:"span 2"}}>{[["hairs","Hair"],["tops","Top"],["pants","Bottom"],["shoes","Shoes"],["accessories","Accessory"]].map(([cat,title])=><div key={cat}style={{marginBottom:16}}><b>{title}</b><div className="grid2">{PARTS[cat].map(item=>{const key={hairs:"hair",tops:"top",pants:"pants",shoes:"shoes",accessories:"accessory"}[cat],on=normLoadout(loadout)[key]===item.id,pre=normLoadout(previewLoadout)[key]===item.id,un=unlockedParts[cat]?.includes(item.id);return <button key={item.id}disabled={locked}onClick={()=>previewPart(cat,item)}className={`item ${on?"on":""} ${pre&&!on?"preview":""}`}><ItemThumb cat={cat} item={item}/><b>{item.name}</b><div className="muted">{un?(on?"Equipped":"Owned"):`Unlock ${item.price}`}{pre&&!on?" • Preview":""}</div><span className={`rarity ${item.rarity||"rare"}`}>{item.rarity||"rare"}</span></button>})}</div></div>)}<div><b>Trail Effect</b><div className="grid2">{TRAIL_EFFECTS.map(e=><button key={e.id}disabled={locked}onClick={()=>previewEffect(e.id)}className={`item ${skin===e.id?"on":""} ${previewSkin===e.id&&skin!==e.id?"preview":""}`}><TrailThumb effect={e}/><b>{e.name}</b><div className="muted">{unlockedEffects.includes(e.id)?(skin===e.id?"Equipped":"Owned"):`Unlock ${e.price}`}</div><span className={`rarity ${e.rarity||"rare"}`}>{e.rarity||"rare"}</span></button>)}</div></div></div></div></div>}
 {(screen==="settings"||screen==="profile"||screen==="dev")&&<div><div className="auth-hero"><div><div className="pill">🔐 LOGIN REQUIRED</div><h2>Welcome to Swag Night Runner</h2><p>Login เพื่อบันทึกคะแนน โปรไฟล์ รูป Avatar เพื่อน ของแต่งตัว และอันดับออนไลน์</p></div><div className="auth-mini-card"><b>Cloud Save</b><span>{user?"ONLINE":"LOCKED"}</span></div></div><div className="auth-card"><div className="auth-side"><div className="auth-logo">SNR</div><h3>{user?"Cloud Profile Ready":"Login to Play"}</h3><p>{user?"ข้อมูลของคุณพร้อม sync กับ Supabase แล้ว":"สร้างบัญชีหรือเข้าสู่ระบบก่อนเริ่มเล่น เพื่อให้คะแนนและของแต่งตัวไม่หาย"}</p><div className="auth-feature">🏆 Online Leaderboard</div><div className="auth-feature">👥 Friends & Profile</div><div className="auth-feature">🧥 Style Shop Cloud Save</div></div><div className="auth-form"><div className="row"style={{justifyContent:"space-between"}}><div><h3>{user?"บัญชีของคุณ":"เข้าสู่ระบบ"}</h3><p className="muted">{authStatus}</p></div>{user?<span className="auth-status online">ONLINE</span>:<span className="auth-status locked">GUEST</span>}</div>{user?<div className="signed-box"><div className="avatar-box small">{profileModal?.avatar_url?<img src={profileModal.avatar_url}alt={playerName}/>:<span>{playerName.slice(0,1).toUpperCase()}</span>}</div><div><b>{playerName}</b><p className="muted">Friend Code: {friendCode||"กำลังสร้าง..."}</p></div></div>:<><label>Username</label><input className={`input auth-input username-input ${usernameStatusType}`}value={signupUsername}onChange={e=>{const v=cleanUsername(e.target.value);setSignupUsername(v)}}placeholder="เช่น _nxah.qt"maxLength={16}/><p className={`username-status ${usernameStatusType}`}>{usernameStatus}</p><label>Email</label><input className="input auth-input"value={email}onChange={e=>setEmail(e.target.value)}placeholder="your@email.com"type="email"/><label>Password</label><div className="password-wrap"><input className="input auth-input"value={password}onChange={e=>setPassword(e.target.value)}placeholder="Password 6+"type={showPassword?"text":"password"}/><button type="button"onClick={()=>setShowPassword(!showPassword)}>{showPassword?"Hide":"Show"}</button></div><p className="muted">ตั้ง Username ครั้งแรกตอนสมัคร • เปลี่ยนภายหลังใน My Profile ใช้ 10,000 coins</p></>}<div className="auth-actions">{user?<><Button onClick={openMyProfile}>👤 My Profile</Button><Button variant="outline"onClick={()=>loadCloudPlayer(user)}>Sync Profile</Button><Button variant="outline"disabled={locked||cloudLoading}onClick={logout}>Logout</Button></>:<><Button disabled={locked||cloudLoading}onClick={()=>handleEmailAuth("signin")}>{cloudLoading?"Loading...":"Login"}</Button><Button variant="outline"disabled={locked||cloudLoading||usernameStatusType!=="good"}onClick={()=>handleEmailAuth("signup")}>Create Account</Button></>}</div></div></div>{isDev&&<div className="dev-panel"><div className="row"style={{justifyContent:"space-between"}}><div><h3>🧪 Dev Dashboard</h3><p className="muted">เครื่องมือ Dev สำหรับทดสอบและดูแลผู้เล่น • role = dev เท่านั้น</p></div><span className="pill">DEV ONLY</span></div><div className="dev-section"><h4>Self Test Tools</h4><div className="grid4"style={{marginTop:10}}><div><label>Coins</label><input className="input"value={devCoins}onChange={e=>setDevCoins(e.target.value.replace(/[^0-9]/g,""))}/></div><Button onClick={devAddCoins}>+ Add Coins</Button><Button variant="outline"onClick={devUnlockAll}>Unlock All</Button><Button variant="outline"onClick={devResetMyTestData}>Reset My Data</Button></div><p className="muted">Dev เปลี่ยน Username ฟรีใน My Profile • Self tools กระทบเฉพาะบัญชีตัวเอง</p></div><div className="dev-section"><h4>Player Lookup</h4><div className="formrow"><input className="input"value={devLookup}onChange={e=>setDevLookup(e.target.value)}placeholder="Username หรือ Friend Code"/><Button disabled={devBusy}onClick={devLookupPlayer}>{devBusy?"Loading...":"Search"}</Button></div>{devTarget&&<div className="dev-target"><div className="profile-head"><div className="avatar-box small">{devTarget.avatar_url?<img src={devTarget.avatar_url}alt={devTarget.username}/>:<span>{devTarget.username?.slice(0,1).toUpperCase()}</span>}</div><div><h3>{devTarget.username}</h3><p className="muted">{devTarget.friend_code||"No Friend Code"} • role: <b>{devTarget.role}</b> • status: <b>{devTarget.account_status||"active"}</b> • {isOnline(devTarget.last_seen)?"ออนไลน์":"ออฟไลน์"}</p></div></div><div className="profile-grid"><div className="stat"><small>Coins</small><b>{devTarget.coins||0}</b></div><div className="stat"><small>Best</small><b>{devTarget.best_score||0}</b></div><div className="stat"><small>Combo</small><b>x{devTarget.best_combo||1}</b></div><div className="stat"><small>Style</small><b>{devTarget.best_style||0}</b></div></div><div className="notice"style={{marginTop:10}}><b>Bio</b><p style={{marginBottom:0,whiteSpace:"pre-wrap"}}>{devTarget.bio||"No bio"}</p></div><div className="grid4"style={{marginTop:12}}><div><label>Set Coins</label><input className="input"value={devTargetCoins}onChange={e=>setDevTargetCoins(e.target.value.replace(/[^0-9]/g,""))}/></div><Button disabled={devBusy}onClick={devSetTargetCoins}>Set Coins</Button><Button disabled={devBusy}onClick={devAddTargetCoins}>+ Add Coins</Button><Button variant="outline"disabled={devBusy}onClick={devRemoveTargetScore}>Remove Score</Button></div><div className="grid4"style={{marginTop:10}}><div><label>Role</label><select className="input"value={devTargetRole}onChange={e=>setDevTargetRole(e.target.value)}><option value="player">player</option><option value="dev">dev</option></select></div><Button variant="outline"disabled={devBusy}onClick={devSetTargetRoleNow}>Set Role</Button><Button variant="outline"disabled={devBusy}onClick={devResetTargetProfilePublic}>Reset Avatar/Bio</Button><Button variant="outline"onClick={()=>openProfile({id:devTarget.id,name:devTarget.username,score:devTarget.best_score||0,coins:devTarget.coins||0})}>View Profile</Button></div><div className="dev-section"><h4>Moderation</h4><div><label>Reason Required</label><textarea className="textarea"value={devReason}onChange={e=>setDevReason(e.target.value.slice(0,180))}placeholder="เหตุผล เช่น คะแนนผิดปกติ / รูปไม่เหมาะสม / ทดสอบระบบ"/></div><div className="grid4"style={{marginTop:10}}><Button variant="outline"disabled={devBusy}onClick={()=>devSetAccountStatus("banned")}>Ban</Button><Button variant="outline"disabled={devBusy}onClick={()=>devSetAccountStatus("active")}>Unban / Active</Button><div><label>Suspend Days</label><input className="input"value={devSuspendDays}onChange={e=>setDevSuspendDays(e.target.value.replace(/[^0-9]/g,""))}/></div><Button variant="outline"disabled={devBusy}onClick={()=>devSetAccountStatus("suspended")}>Suspend</Button></div><div className="grid4"style={{marginTop:10}}><Button variant="outline"disabled={devBusy}onClick={devResetTargetScoreFull}>Reset Score Full</Button><Button variant="outline"disabled={devBusy}onClick={devResetTargetStyleShop}>Reset Style Shop</Button><Button variant="outline"disabled={devBusy}onClick={devResetTargetProfilePublic}>Reset Avatar/Bio</Button><Button variant="outline"disabled={devBusy}onClick={devRemoveTargetScore}>Remove Score Only</Button></div></div><div className="dev-section"><h4>Give / Remove Item</h4><div className="grid4"><div><label>Category</label><select className="input"value={devItemCat}onChange={e=>{setDevItemCat(e.target.value);const cat=e.target.value;setDevItemId(cat==="effects"?EFFECTS[0].id:PARTS[cat]?.[0]?.id||"")}}><option value="hairs">Hair</option><option value="tops">Top</option><option value="pants">Pants</option><option value="shoes">Shoes</option><option value="effects">Effect</option></select></div><div><label>Item</label><select className="input"value={devItemId}onChange={e=>setDevItemId(e.target.value)}>{(devItemCat==="effects"?EFFECTS:PARTS[devItemCat]||[]).map(x=><option key={x.id}value={x.id}>{x.name}</option>)}</select></div><Button disabled={devBusy}onClick={()=>devModifyTargetItem("give")}>Give Item</Button><Button variant="outline"disabled={devBusy}onClick={()=>devModifyTargetItem("remove")}>Remove Item</Button></div></div><p className="muted">ทุก action จะถูกบันทึกลง dev_audit_log</p></div>}<div className="dev-section"><h4>Global Dev Reason</h4><div><label>Reason Required</label><textarea className="textarea"value={devReason}onChange={e=>setDevReason(e.target.value.slice(0,180))}placeholder="เหตุผล เช่น maintenance / cleanup / test reset"/></div></div><div className="dev-section"><h4>Global Controls</h4><div className="grid4"style={{marginTop:10}}><Button variant="outline"disabled={devBusy}onClick={devClearGlobalLeaderboard}>Clear Global Leaderboard</Button></div></div></div><div className="dev-section"><div className="row"style={{justifyContent:"space-between"}}><h4>Audit Log Viewer</h4><Button variant="outline"onClick={devRefreshLogs}>Refresh Logs</Button></div>{devLogs.length===0?<div className="notice">ยังไม่มี Audit Log หรือยังไม่ได้กด Refresh</div>:devLogs.map(log=><div className="audit-row"key={log.id}><b>{log.action}</b><span>{new Date(log.created_at).toLocaleString("th-TH")}</span><pre>{JSON.stringify(log.details||{},null,2)}</pre></div>)}</div></div>}<div className="grid4"style={{marginTop:12}}><Button variant="outline"disabled={locked}onClick={cycleQuality}>Quality: {quality.toUpperCase()}</Button><div className="notice">มือถือ: ขวา=กระโดด / ซ้ายค้าง=หมอบ</div><div className="notice">คอม: Space/↑ กระโดด ↓ หมอบ</div><div className="notice">v5.0 Clean Foundation</div></div></div>}
 </div>{profileModalView()}</>;

 if(!user)return <div className="auth-screen"><div className="auth-screen-card card"><div className="auth-screen-logo">SNR</div><h1>Swag Night Runner</h1><p className="muted">{authStatus}</p><div className="auth-mode-toggle"><button className={authMode==="login"?"active":""}onClick={()=>setAuthMode("login")}>Login</button><button className={authMode==="signup"?"active":""}onClick={()=>setAuthMode("signup")}>Sign Up</button></div>{authMode==="signup"&&<><label>Username</label><input className={`input auth-input username-input ${usernameStatusType}`}value={signupUsername}onChange={e=>setSignupUsername(cleanUsername(e.target.value))}placeholder="เช่น _nxah.qt"maxLength={16}/><p className={`username-status ${usernameStatusType}`}>{usernameStatus}</p></>}<label>{authMode==="login"?"Username or Email":"Email"}</label><input className="input auth-input"value={email}onChange={e=>setEmail(e.target.value)}placeholder={authMode==="login"?"username or your@email.com":"your@email.com"}type="email"/><label>Password</label><div className="password-wrap"><input className="input auth-input"value={password}onChange={e=>setPassword(e.target.value)}placeholder="Password 6+"type={showPassword?"text":"password"}/><button type="button"onClick={()=>setShowPassword(!showPassword)}>{showPassword?"Hide":"Show"}</button></div>{authMode==="login"?<p className="muted">Use your email to login if username login is not available yet.</p>:<p className="muted">ตั้ง Username ครั้งแรกตอนสมัคร • เปลี่ยนภายหลังใน My Profile ใช้ 10,000 coins</p>}<Button disabled={locked||cloudLoading||(authMode==="signup"&&usernameStatusType!=="good")}onClick={()=>handleEmailAuth(authMode==="signup"?"signup":"signin")}>{cloudLoading?"Loading...":authMode==="signup"?"Create Account":"Login"}</Button></div></div>;
 if(screen==="menu")return <div className="app menu-screen"><motion.div className="card hero menu-card"initial={{opacity:0,y:18}}animate={{opacity:1,y:0}}><div className="menu-layout"><div className="menu-left"><div className="pill">MAIN MENU</div><h1 className="title">SWAG<br/>NIGHT<br/><span>RUNNER</span></h1><div className="menu-buttons"><Button onClick={()=>setScreen("play")}>Play</Button><Button onClick={()=>setScreen("shop")}>Shop</Button><Button onClick={()=>setScreen("leaderboard")}>Leaderboard</Button><Button onClick={()=>setScreen("friends")}>Friends</Button><Button onClick={()=>setScreen("profile")}>Profile</Button><Button onClick={()=>setScreen("settings")}>Settings</Button>{isDev&&<Button onClick={()=>setScreen("dev")}>Dev</Button>}</div></div><div className="menu-right"><div className="menu-info-bar"><div className="notice">🪙 Wallet <b>{walletCoins}</b></div><div className="notice">🏆 Best <b>{bestScore}</b></div><div className="notice">👥 Code <b>{friendCode||"-"}</b></div></div><div className="menu-preview-stage">{loadout?renderMiniPreview(loadout,skin,"Runner Preview"):<div className="menu-preview-fallback">Loading Runner...</div>}</div><div className="menu-nameplate"><b>{playerName}</b><span>Runner Profile</span></div></div></div></motion.div></div>;
 if(screen!=="play")return <div className="app"><div className="shell"><div className="panel">{panel()}</div></div></div>;
 return <div className="app"><div className="shell"><div className="row"style={{justifyContent:"space-between",alignItems:"flex-end"}}><div>{status==="gameover"?<button className="btn ghost"onClick={goLanding}>← กลับหน้าแรก</button>:<div className="muted">กำลังวิ่งอยู่ • จบเกมแล้วถึงกลับหน้าแรกได้</div>}<h1 style={{margin:"6px 0 0",fontSize:"clamp(28px,5vw,52px)"}}>Swag Night Runner</h1><div className="muted">Player: <b>{playerName}</b> • {toast}</div></div><Button onClick={reset}>{status==="playing"?"↻ เริ่มใหม่":user?"▶ Start":"🔐 Login to Play"}</Button></div><div className="stats">{[["Score",score],["Coins",`🪙 ${coins}`],["Lives",`❤️ ${lives}`],["Best",bestScore],["Combo",`x${combo}`],["Max",`x${maxCombo}`],["Style",styleScore],["Wallet",walletCoins]].map(([a,b])=><div className="stat"key={a}><small>{a}</small><b>{b}</b></div>)}</div><div className="canvaswrap"><canvas ref={canvasRef}width={W}height={H}onTouchStart={e=>{e.preventDefault();const t=e.changedTouches[0],r=e.currentTarget.getBoundingClientRect();if(t.clientX-r.left<r.width*.42)pressDuck(true);else pressJump()}}onTouchMove={e=>e.preventDefault()}onTouchEnd={e=>{e.preventDefault();pressDuck(false)}}/><div className="mobilehint"><span>แตะซ้ายค้าง = หมอบ</span><span>แตะขวา = กระโดด</span></div></div>{status==="gameover"&&<div className="result"><div className="card pad"><div className="muted">RESULT</div><div className="grade">Rank {grade(finalScore,maxCombo,styleScore)}</div><p>Score <b>{finalScore}</b> • Max Combo <b>x{maxCombo}</b></p><p>Style <b>{styleScore}</b> • Earned <b>+{coins}</b></p><p className="muted">Wallet รวมตอนนี้ <b>{walletCoins}</b></p><div className="row"><Button onClick={reset}>เล่นอีกครั้ง</Button><Button variant="outline"onClick={goLanding}>กลับหน้าแรก</Button></div></div>{panel()}</div>}{status!=="gameover"&&<div className="panel">{panel()}</div>}<div className="grid4"style={{marginTop:12}}><button className="btn dark"onTouchStart={e=>{e.preventDefault();pressDuck(true)}}onTouchEnd={e=>{e.preventDefault();pressDuck(false)}}onMouseDown={()=>pressDuck(true)}onMouseUp={()=>pressDuck(false)}>↓ หมอบ</button><button className="btn"onTouchStart={e=>{e.preventDefault();pressJump()}}onMouseDown={pressJump}>↑ กระโดด</button><button className="btn dark"disabled={locked}onClick={cycleQuality}>⚙️ Quality: {quality.toUpperCase()}</button><div className="notice">👥 v3 Friends & Style Preview</div></div></div></div>
}
