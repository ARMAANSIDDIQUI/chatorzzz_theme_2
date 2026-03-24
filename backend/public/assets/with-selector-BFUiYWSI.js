import{U as E,g as b}from"./index-IC3llQUD.js";var s={exports:{}},S={},f={exports:{}},l={},p;function j(){if(p)return l;p=1;/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=E();function o(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var x=typeof Object.is=="function"?Object.is:o,m=r.useState,y=r.useEffect,w=r.useLayoutEffect,q=r.useDebugValue;function R(e,t){var n=t(),a=m({inst:{value:n,getSnapshot:t}}),u=a[0].inst,c=a[1];return w(function(){u.value=n,u.getSnapshot=t,i(u)&&c({inst:u})},[e,n,t]),y(function(){return i(u)&&c({inst:u}),e(function(){i(u)&&c({inst:u})})},[e]),q(n),n}function i(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!x(e,n)}catch{return!0}}function _(e,t){return t()}var g=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?_:R;return r.useSyncExternalStore!==void 0&&r.useSyncExternalStore,l}var d;function D(){return d||(d=1,f.exports=j()),f.exports}var h;function U(){if(h)return S;h=1;/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=E(),o=D();return o.useSyncExternalStore,r.useRef,r.useEffect,r.useMemo,r.useDebugValue,S}var v;function W(){return v||(v=1,s.exports=U()),s.exports}var V=W();const I=b(V);export{I as u,V as w};
