parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r},p.cache={};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"OCo3":[function(require,module,exports) {
window.ENV=function(){"use strict";var e,a,t=0;function r(e){e||(e={});var a=15*Math.random();return e.elapsed=a,e.formatElapsed=function(e){var a=parseFloat(e).toFixed(2);if(e>60){var t=Math.floor(e/60),r=(e%60).toFixed(2).split(".");a=t+":"+r[0].lpad("0",2)+"."+r[1]}return a}(a),e.elapsedClassName=function(e){var a="Query elapsed";return a+=e>=10?" warn_long":e>=1?" warn":" short"}(a),e.query="SELECT blah FROM something",e.waiting=Math.random()<.5,Math.random()<.2&&(e.query="<IDLE> in transaction"),Math.random()<.1&&(e.query="vacuum"),e}function l(e){if(!e)return{query:"***",formatElapsed:"",elapsedClassName:""};e.formatElapsed="",e.elapsedClassName="",e.query="",e.elapsed=null,e.waiting=null}function s(e,a,t){var s=Math.floor(10*Math.random()+1);if(e||(e={}),e.lastMutationId=t,e.nbQueries=s,e.lastSample||(e.lastSample={}),e.lastSample.topFiveQueries||(e.lastSample.topFiveQueries=[]),a){if(!e.lastSample.queries){e.lastSample.queries=[];for(var n=0;n<12;n++)e.lastSample.queries[n]=l()}for(var i in e.lastSample.queries){var u=e.lastSample.queries[i];i<=s?r(u):l(u)}}else{e.lastSample.queries=[];for(i=0;i<12;i++)if(i<s){u=r(l());e.lastSample.queries.push(u)}else e.lastSample.queries.push(l())}for(var o=0;o<5;o++){var m=e.lastSample.queries[o];e.lastSample.topFiveQueries[o]=m}return e.lastSample.nbQueries=s,e.lastSample.countClassName=function(e){var a="label";return a+=e>=20?" label-important":e>=10?" label-warning":" label-success"}(s),e}(a=String.prototype).lpad||(a.lpad=function(e,a){return e.repeat((a-this.length)/e.length).concat(this)});var n=.5;var i=document.querySelector("body"),u=i.firstChild,o=document.createElement("div");o.style.cssText="display: flex";var m=document.createElement("input"),p=document.createElement("label");return p.innerHTML="mutations : "+(100*n).toFixed(0)+"%",p.id="ratioval",m.setAttribute("type","range"),m.style.cssText="margin-bottom: 10px; margin-top: 5px",m.addEventListener("change",function(e){ENV.mutations(e.target.value/100),document.querySelector("#ratioval").innerHTML="mutations : "+(100*ENV.mutations()).toFixed(0)+"%"}),o.appendChild(p),o.appendChild(m),i.insertBefore(o,u),{generateData:function(a){var r=e;if(!a){e=[];for(var l=1;l<=ENV.rows;l++)e.push({dbname:"cluster"+l,query:"",formatElapsed:"",elapsedClassName:""}),e.push({dbname:"cluster"+l+" slave",query:"",formatElapsed:"",elapsedClassName:""})}if(!e){for(e=[],l=1;l<=ENV.rows;l++)e.push({dbname:"cluster"+l}),e.push({dbname:"cluster"+l+" slave"});r=e}for(var l in e){var n=e[l];!a&&r&&r[l]&&(n.lastSample=r[l].lastSample),!n.lastSample||Math.random()<ENV.mutations()?(t+=1,a||(n.lastSample=null),s(n,a,t)):e[l]=r[l]}return{toArray:function(){return e}}},rows:50,timeout:0,mutations:function(e){return e?n=e:n}}}();
},{}]},{},["OCo3"], null)
//# sourceMappingURL=db-monster-lib.5300bdb5.map