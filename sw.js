if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let o={};const d=e=>i(e,t),l={module:{uri:t},exports:o,require:d};s[t]=Promise.all(n.map((e=>l[e]||d(e)))).then((e=>(r(...e),o)))}}define(["./workbox-9517df1b"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-261bad19.css",revision:null},{url:"assets/index-ff40a68f.js",revision:null},{url:"index.html",revision:"d2e1bd3cb0d81cdb95a13ef284da3e68"},{url:"registerSW.js",revision:"1027e4a066bc42424138761d0f092f87"},{url:"manifest.webmanifest",revision:"bd03a46bd23f3a98143bd0482dc7cc50"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
