const canvas=document.getElementById('civicCanvas');
if(canvas&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(45,1,.1,100);
  camera.position.z=8;
  const group=new THREE.Group(); scene.add(group);
  const geo=new THREE.IcosahedronGeometry(.45,1);
  for(let i=0;i<12;i++){
    const material=new THREE.MeshPhysicalMaterial({color:0x4d8ff7,roughness:.24,metalness:.08,transmission:.35,transparent:true,opacity:.2});
    const mesh=new THREE.Mesh(geo,material); const angle=i/12*Math.PI*2;
    mesh.position.set(Math.cos(angle)*(2.4+(i%3)*.55),Math.sin(angle)*(1.4+(i%2)*.4),(i%4)-2);
    mesh.scale.setScalar(.45+(i%4)*.16); group.add(mesh);
  }
  const points=group.children.map(x=>x.position.clone());
  group.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:0x86b8ff,transparent:true,opacity:.13})));
  let mx=0,my=0;
  window.addEventListener('pointermove',e=>{mx=(e.clientX/window.innerWidth-.5)*.22;my=(e.clientY/window.innerHeight-.5)*.16},{passive:true});
  function resize(){const rect=canvas.getBoundingClientRect();renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(rect.width,rect.height,false);camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix()}
  function loop(t){group.rotation.z=t*.000035;group.rotation.y+=(mx-group.rotation.y)*.025;group.rotation.x+=(-my-group.rotation.x)*.025;group.children.forEach((o,i)=>{if(o.isMesh)o.rotation.x=o.rotation.y=t*.00025*(i%3+1)});renderer.render(scene,camera);requestAnimationFrame(loop)}
  window.addEventListener('resize',resize);resize();requestAnimationFrame(loop);
}
