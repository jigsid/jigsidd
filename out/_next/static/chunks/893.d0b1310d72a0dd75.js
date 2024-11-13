(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[893],{2893:function(e,r,n){"use strict";n.r(r),n.d(r,{Model:function(){return P}});var t=n(7568),u=n(1799),a=n(9396),i=n(9534),c=n(828),o=n(9815),s=n(655),v=n(5893),l=n(6240),f=n(7378),d=n(2064),m=n(4529),p=n(7294),y=n(9477);const h={uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:"\n      varying vec2 vUv;\n\n      void main() {\n\n        vUv = uv;\n        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n      }\n  ",fragmentShader:"\n    uniform sampler2D tDiffuse;\n    uniform float h;\n\n    varying vec2 vUv;\n\n    void main() {\n\n    \tvec4 sum = vec4( 0.0 );\n\n    \tsum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;\n    \tsum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;\n    \tsum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;\n    \tsum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;\n    \tsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;\n    \tsum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;\n    \tsum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;\n    \tsum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;\n    \tsum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;\n\n    \tgl_FragColor = sum;\n\n    }\n  "},x={uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:"\n    varying vec2 vUv;\n\n    void main() {\n\n      vUv = uv;\n      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n    }\n  ",fragmentShader:"\n\n  uniform sampler2D tDiffuse;\n  uniform float v;\n\n  varying vec2 vUv;\n\n  void main() {\n\n    vec4 sum = vec4( 0.0 );\n\n    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;\n    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;\n    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;\n    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;\n    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;\n    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;\n    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;\n    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;\n    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;\n\n    gl_FragColor = sum;\n\n  }\n  "};var w=n(5622),g=n(2362),D=n(3142),U=n(4209),R=n.n(U),_=n(6521),b="Frame",M="Screen",S={stiffness:40,damping:20,mass:1.4,restSpeed:.001},P=function(e){var r=e.models,n=e.show,t=void 0===n||n,c=e.showDelay,o=void 0===c?0:c,s=e.cameraPosition,d=void 0===s?{x:0,y:0,z:8}:s,w=e.style,U=e.className,_=e.alt,b=(0,i.Z)(e,["models","show","showDelay","cameraPosition","style","className","alt"]),M=(0,p.useState)(!1),P=M[0],k=M[1],C=(0,p.useRef)(),Z=(0,p.useRef)(),E=(0,p.useRef)(),A=(0,p.useRef)(),z=(0,p.useRef)(),F=(0,p.useRef)(),T=(0,p.useRef)(),L=(0,p.useRef)(),N=(0,p.useRef)(),I=(0,p.useRef)(),J=(0,p.useRef)(),B=(0,p.useRef)(),K=(0,p.useRef)(),O=(0,p.useRef)(),G=(0,p.useRef)(),W=(0,p.useRef)(),X=(0,p.useRef)(),H=(0,m.NM)(C,!1,{threshold:.2}),q=(0,l.J)(),V=(0,f.q)(0,S),Y=(0,f.q)(0,S);(0,p.useEffect)((function(){var e=C.current,r=e.clientWidth,n=e.clientHeight;F.current=new y.CP7({canvas:Z.current,alpha:!0,antialias:!1,powerPreference:"high-performance",failIfMajorPerformanceCaveat:!0}),F.current.setPixelRatio(2),F.current.setSize(r,n),F.current.outputEncoding=y.knz,F.current.physicallyCorrectLights=!0,E.current=new y.cPb(36,r/n,.1,100),E.current.position.set(d.x,d.y,d.z),z.current=new y.xsS,A.current=new y.ZAu,z.current.add(A.current);var t=new y.Mig(16777215,1.2),u=new y.Ox3(16777215,1.1),a=new y.Ox3(16777215,.8);a.position.set(-6,2,2),u.position.set(.5,0,.866),G.current=[t,u,a],G.current.forEach((function(e){return z.current.add(e)})),T.current=new y.ZAu,z.current.add(T.current),T.current.position.set(0,0,-.8),T.current.rotateX(Math.PI/2);var i=512;L.current=new y.dd2(i,i),L.current.texture.generateMipmaps=!1,N.current=new y.dd2(i,i),N.current.texture.generateMipmaps=!1;var c=new y.BKK(8,8).rotateX(Math.PI/2),o=new y.vBJ({map:L.current.texture,opacity:.8,transparent:!0});O.current=new y.Kj0(c,o),O.current.scale.y=-1,T.current.add(O.current),W.current=new y.Kj0(c),W.current.visible=!1,T.current.add(W.current);var s=new y.vBJ({color:16777215,opacity:0,transparent:!0});X.current=new y.Kj0(c,s),X.current.rotateX(Math.PI),X.current.position.y-=1e-5,T.current.add(X.current),I.current=new y.iKG(-4,4,4,-4,0,1.5),I.current.rotation.x=Math.PI/2,T.current.add(I.current),J.current=new y.lRF,J.current.userData.darkness={value:3},J.current.onBeforeCompile=function(e){e.uniforms.darkness=J.current.userData.darkness,e.fragmentShader="\n        uniform float darkness;\n        ".concat(e.fragmentShader.replace("gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );","gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * darkness );"),"\n      ")},J.current.depthTest=!1,J.current.depthWrite=!1,B.current=new y.jyz(h),B.current.depthTest=!1,K.current=new y.jyz(x),K.current.depthTest=!1;var v=V.onChange($),l=Y.onChange($);return function(){L.current.dispose(),N.current.dispose(),(0,D.Ji)(G.current),(0,D.in)(z.current),(0,D.e8)(F.current),v(),l()}}),[]);var Q=(0,p.useCallback)((function(e){W.current.visible=!0,W.current.material=B.current,W.current.material.uniforms.tDiffuse.value=L.current.texture,B.current.uniforms.h.value=e*(1/256),F.current.setRenderTarget(N.current),F.current.render(W.current,I.current),W.current.material=K.current,W.current.material.uniforms.tDiffuse.value=N.current.texture,K.current.uniforms.v.value=e*(1/256),F.current.setRenderTarget(L.current),F.current.render(W.current,I.current),W.current.visible=!1}),[]),$=(0,p.useCallback)((function(){var e=z.current.background;z.current.background=null,z.current.overrideMaterial=J.current,F.current.setRenderTarget(L.current),F.current.render(z.current,I.current),z.current.overrideMaterial=null,Q(5),Q(2),F.current.setRenderTarget(null),z.current.background=e,A.current.rotation.x=V.get(),A.current.rotation.y=Y.get(),F.current.render(z.current,E.current)}),[Q,V,Y]);return(0,p.useEffect)((function(){var e=function(e){var r=window.innerWidth,n=window.innerHeight,t=(e.clientX-r/2)/r,u=(e.clientY-n/2)/n;Y.set(t/2),V.set(u/2)};return H&&!q&&window.addEventListener("mousemove",e),function(){window.removeEventListener("mousemove",e)}}),[H,q,V,Y]),(0,p.useEffect)((function(){var e=function(){if(C.current){var e=C.current,r=e.clientWidth,n=e.clientHeight;F.current.setSize(r,n),E.current.aspect=r/n,E.current.updateProjectionMatrix(),$()}};return window.addEventListener("resize",e),e(),function(){window.removeEventListener("resize",e)}}),[$]),(0,v.jsxs)("div",(0,a.Z)((0,u.Z)({className:(0,g.Sh)(R().model,U),"data-loaded":P,style:(0,g.Fh)({delay:(0,g.aU)(o)},w),ref:C,role:"img","aria-label":_},b),{children:[(0,v.jsx)("canvas",{className:R().canvas,ref:Z}),r.map((function(e,r){return(0,v.jsx)(j,{renderer:F,modelGroup:A,show:t,showDelay:o,renderFrame:$,index:r,setLoaded:k,model:e},JSON.stringify(e.position))}))]}))},j=function(e){var r=e.renderer,n=e.model,u=e.modelGroup,a=e.renderFrame,i=e.index,v=e.showDelay,f=e.setLoaded,m=e.show,h=(0,p.useState)(),x=h[0],g=h[1],U=(0,l.J)(),R=(0,p.createRef)();(0,p.useEffect)((function(){var e=function(){var e=(0,t.Z)((function(e,n){return(0,s.__generator)(this,(function(t){switch(t.label){case 0:return e.encoding=y.knz,e.flipY=!1,e.anisotropy=r.current.capabilities.getMaxAnisotropy(),e.generateMipmaps=!1,[4,r.current.initTexture(e)];case 1:return t.sent(),n.material.color=new y.Ilk(16777215),n.material.transparent=!0,n.material.map=e,[2]}}))}));return function(r,n){return e.apply(this,arguments)}}(),l=function(){var r=(0,t.Z)((function(){var r,l,f,m,p,h,x,g,S,P,j,k;return(0,s.__generator)(this,(function(C){switch(C.label){case 0:return r=n.texture,l=n.position,f=n.url,S=Promise.all,[4,D.Et.loadAsync(r.placeholder.src)];case 1:return P=[C.sent()],[4,D.Zf.loadAsync(f)];case 2:return[4,S.apply(Promise,[P.concat(C.sent())])];case 3:return h=c.Z.apply(void 0,[C.sent(),2]),x=h[0],g=h[1],u.current.add(g.scene),g.scene.traverse(function(){var n=(0,t.Z)((function(n){return(0,s.__generator)(this,(function(u){return n.material&&(n.material.color=new y.Ilk(2039845),n.material.color.convertSRGBToLinear()),n.name===M&&(R.current=n.clone(),R.current.material=n.material.clone(),n.parent.add(R.current),R.current.material.opacity=1,R.current.position.z+=.001,e(x,R.current),m=(0,t.Z)((function(){var t,u;return(0,s.__generator)(this,(function(i){switch(i.label){case 0:return[4,(0,w.Ro)(r)];case 1:return t=i.sent(),[4,D.Et.loadAsync(t)];case 2:return u=i.sent(),[4,e(u,n)];case 3:return i.sent(),(0,d.j)(1,0,{onUpdate:function(e){R.current.material.opacity=e,a()}}),[2]}}))}))),[2]}))}));return function(e){return n.apply(this,arguments)}}()),j=new y.Pa4(l.x,l.y,l.z),U&&(k=g.scene.position).set.apply(k,(0,o.Z)(j.toArray())),n.animation===_.u.SpringUp&&(p=function(){var e,r=new y.Pa4(j.x,j.y-1,j.z);(e=g.scene.position).set.apply(e,(0,o.Z)(r.toArray())),(0,d.j)(r.y,j.y,{type:"spring",delay:(300*i+v)/1e3,stiffness:60,damping:20,mass:1,restSpeed:1e-4,restDelta:1e-4,onUpdate:function(e){g.scene.position.y=e,a()}})}),n.animation===_.u.LaptopOpen&&(p=function(){var e,r,n=g.scene.children.find((function(e){return e.name===b})),t=new y.Pa4(y.M8C.degToRad(90),0,0),u=new y.Pa4(0,0,0);return(e=g.scene.position).set.apply(e,(0,o.Z)(j.toArray())),(r=n.rotation).set.apply(r,(0,o.Z)(t.toArray())),(0,d.j)(t.x,u.x,{type:"spring",delay:(300*i+v+300)/1e3,stiffness:80,damping:20,restSpeed:1e-4,restDelta:1e-4,onUpdate:function(e){n.rotation.x=e,a()}})}),[2,{loadFullResTexture:m,playAnimation:p}]}}))}));return function(){return r.apply(this,arguments)}}();g({start:l})}),[]),(0,p.useEffect)((function(){if(x&&m){var e,r=function(){var r=(0,t.Z)((function(){var r,n,t;return(0,s.__generator)(this,(function(u){switch(u.label){case 0:return[4,x.start()];case 1:return r=u.sent(),n=r.loadFullResTexture,t=r.playAnimation,f(!0),U||(e=t()),[4,n()];case 2:return u.sent(),U&&a(),[2]}}))}));return function(){return r.apply(this,arguments)}}();return(0,p.startTransition)((function(){r()})),function(){null===e||void 0===e||e.stop()}}}),[x,m])}},3142:function(e,r,n){"use strict";n.d(r,{Et:function(){return s},Ji:function(){return d},Zf:function(){return o},e8:function(){return f},in:function(){return v}});var t=n(9477),u=n(4521),a=n(4591);t.CtF.enabled=!0;var i=new u._,c=new a.E;i.setDecoderPath("/draco/"),c.setDRACOLoader(i);var o=c,s=new t.dpR,v=function(e){null===e||void 0===e||e.traverse((function(e){if(e.isMesh)if(e.geometry.dispose(),e.material.isMaterial)l(e.material);else{var r=!0,n=!1,t=void 0;try{for(var u,a=e.material[Symbol.iterator]();!(r=(u=a.next()).done);r=!0){var i=u.value;l(i)}}catch(c){n=!0,t=c}finally{try{r||null==a.return||a.return()}finally{if(n)throw t}}}}))},l=function(e){e.dispose();var r=!0,n=!1,t=void 0;try{for(var u,a=Object.keys(e)[Symbol.iterator]();!(r=(u=a.next()).done);r=!0){var i,c,o,s=e[u.value];if(s&&"object"===typeof s&&"minFilter"in s)s.dispose(),null===(i=s.source)||void 0===i||null===(c=i.data)||void 0===c||null===(o=c.close)||void 0===o||o.call(c)}}catch(v){n=!0,t=v}finally{try{r||null==a.return||a.return()}finally{if(n)throw t}}},f=function(e){e.dispose(),e=null},d=function(e){var r=!0,n=!1,t=void 0;try{for(var u,a=e[Symbol.iterator]();!(r=(u=a.next()).done);r=!0){var i=u.value;i.parent.remove(i)}}catch(c){n=!0,t=c}finally{try{r||null==a.return||a.return()}finally{if(n)throw t}}}},4209:function(e){e.exports={model:"Model_model__228ej",canvas:"Model_canvas__kaLjL"}},2064:function(e,r,n){"use strict";n.d(r,{j:function(){return i}});var t=n(3234),u=n(406),a=n(8899);function i(e,r,n){void 0===n&&(n={});var i=(0,u.i)(e)?e:(0,t.B)(e);return(0,a.b8)("",i,r,n),{stop:function(){return i.stop()},isAnimating:function(){return i.isAnimating()}}}}}]);