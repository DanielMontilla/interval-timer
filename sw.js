if(!self.define){let e,i={};const s=(s,c)=>(s=new URL(s+".js",c).href,i[s]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=i,document.head.appendChild(e)}else e=s,importScripts(s),i()})).then((()=>{let e=i[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(c,r)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(i[n])return;let o={};const d=e=>s(e,n),b={module:{uri:n},exports:o,require:d};i[n]=Promise.all(c.map((e=>b[e]||d(e)))).then((e=>(r(...e),o)))}}define(["./workbox-3625d7b0"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"app/android-chrome-192x192.png",revision:"a072e6e51b13d24ad69895b52e1f327c"},{url:"app/android-chrome-512x512.png",revision:"503d883cd68b725c05dcc34f0e459bf1"},{url:"app/apple-touch-icon.png",revision:"4c3422a557702b13e43f75c74567bc67"},{url:"app/favicon-16x16.png",revision:"b363a4119bc93e6b2fc622119f2de434"},{url:"app/favicon-32x32.png",revision:"f2eea4fac2211ab84ce546dc098bd643"},{url:"app/favicon.ico",revision:"75095c56193baf7f19d804b191c271f7"},{url:"app/favicon.svg",revision:"59947ef593b111ee3b94b03f892a2bed"},{url:"app/mstile-144x144.png",revision:"bc9fb1e36ee0899e8cd67023f5966e64"},{url:"app/mstile-150x150.png",revision:"9aec886c547938d6fcb074bb090e9b70"},{url:"app/mstile-310x150.png",revision:"41b63451a6ade449e51d1fed368e14eb"},{url:"app/mstile-310x310.png",revision:"4c2969d50f3220637a32eee195cb15f8"},{url:"app/mstile-70x70.png",revision:"c2568d62c0a01838811de457a51a648c"},{url:"app/safari-pinned-tab.svg",revision:"b8731c1e2a796dca9fafaf43af4667c4"},{url:"assets/index.12b3dfc1.js",revision:null},{url:"assets/index.2b421891.css",revision:null},{url:"icons/!.svg",revision:"497d16a54cbf2eac8d8b992572c4c3e8"},{url:"icons/add.svg",revision:"314e80c70fa2791b11680f48349a540d"},{url:"icons/clear.svg",revision:"e300b21bf52b4ce5f215822cde3c720c"},{url:"icons/copy.svg",revision:"42dcff7b1b0b26f0713fe23ca6b8bdbc"},{url:"icons/create.svg",revision:"0ca362c6c9026a4bedd3926450ea9e46"},{url:"icons/delete.svg",revision:"e4bb37c9c213a13083ee751b95b02960"},{url:"icons/duration.svg",revision:"b02482244fee27d08f7a0580c437eb0f"},{url:"icons/edit.svg",revision:"42c81371093fd18171c26eeb34d0e587"},{url:"icons/home.svg",revision:"4d78c00fe314006542deb96249256beb"},{url:"icons/movedown.svg",revision:"8005bb49d56c9902afebcd6a2558944d"},{url:"icons/moveup.svg",revision:"7ea3a98c5912a5dcf4e06eb7f591c8f7"},{url:"icons/next.svg",revision:"43bcac857ed84637575f041c7f43b625"},{url:"icons/pause.svg",revision:"9be1857203f6f88bfd7e0cd11b5da161"},{url:"icons/play.svg",revision:"b05ec323ceb215e99349d59a2762d511"},{url:"icons/redo.svg",revision:"6fdd91b1cd96e3c7e18d7654638b970f"},{url:"icons/restart.svg",revision:"24b21dccd9b9e8378a4268eeee293f0c"},{url:"icons/save.svg",revision:"efe5d59777479a06cf5966c5ad66e2e5"},{url:"icons/select.svg",revision:"7e215673587467323e6d3a8ddfbd2ea7"},{url:"icons/spinner.svg",revision:"57799b6a63a0678c9e8943ef5ba71125"},{url:"icons/workout.svg",revision:"a72a8873b819a26798c6a4fcdf323b6e"},{url:"index.html",revision:"17204f869b0fcb3bd07b4ab0221f7611"},{url:"registerSW.js",revision:"07c732b1ce274c8f75285ad3d11c1398"},{url:"sounds/button_1.mp3",revision:"967373d47635c6bb713e5dbfd86a3586"},{url:"sounds/button_2.mp3",revision:"5ab4ad0d5516dd99265e981e24604f92"},{url:"sounds/button_3.mp3",revision:"8885b403f4e398f5bbe18059ed4512f8"},{url:"sounds/button_4.mp3",revision:"43ecc90b6c9c5dc5ad5846996604eed7"},{url:"sounds/button_5.mp3",revision:"7b240f345c5b4bcd95611ed4a828b433"},{url:"sounds/cassette_1.mp3",revision:"26fbf05119c69614d5d0bc89655207ec"},{url:"sounds/cassette_2.mp3",revision:"8f3ff34e09fedb058f95d2e43535b723"},{url:"sounds/cassette_3.mp3",revision:"36a1b8c0919ec3f1d0e07e5e5dfe3546"},{url:"sounds/click.mp3",revision:"59911e6495baca42f0c55364c89ca5bc"},{url:"sounds/error.mp3",revision:"71535c874d53c85b5e70f59726c19c93"},{url:"sounds/key.mp3",revision:"2d60d9a802c72d3e4566a61550d68cea"},{url:"text/interval-timer!.svg",revision:"fd3b785541e49acb1f4674542e84d8fd"},{url:"text/welcome-back-to.svg",revision:"e9c73b6a9b71887d8a000f1c46865da6"},{url:"text/welcome-to.svg",revision:"922f0d54b82d780cd33f0d0d7d7161a8"},{url:"manifest.webmanifest",revision:"004ab5927a3504c8b65ebc0d2e87e3c2"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
