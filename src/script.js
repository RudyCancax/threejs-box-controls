import * as THREE from 'three'
import GUI from 'lil-gui'; 
import gsap from "gsap";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const gui = new GUI({width: 250, title: 'Debug UI', closeFolders: false});

window.addEventListener('keydown', (event)=>{
    if(event.key === 'h'){
        gui.show(gui._hidden);
    } 
});


const cubeControlsFolder = gui.addFolder('Cube');
const debugObject = {
    'color': '#ffca28'
};

/**
 * TEXTUREs
 */
const image = new Image();
const imageTexture = new THREE.Texture(image);
imageTexture.colorSpace = THREE.SRGBColorSpace;
image.onload = () => {
    console.log('image loaded');
    imageTexture.needsUpdate = true;
}

image.src = '/minecraft.png';


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// CUSTOM Object
const count = 200 * 3 * 3;
const positionArray = new Float32Array(count);
for (let index = 0; index < count; index++) {
    positionArray[index] = (Math.random() - 0.5) * 3;
}
// const geometry = new THREE.BufferGeometry();
// const positionAtribute = new THREE.BufferAttribute(positionArray, 3, false);
// positionAtribute.setUsage( THREE.DynamicDrawUsage );
// geometry.setAttribute('position', positionAtribute);

const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: debugObject.color, wireframe: true })
const material = new THREE.MeshBasicMaterial({ map: imageTexture })
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = 0.5;
scene.add(mesh)

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//DEBUG CONTROLS
cubeControlsFolder.add(mesh.position, 'z', -3, 3, 0.0001).name('zoom');
cubeControlsFolder.add(mesh, 'visible').name('Display mesh')
cubeControlsFolder.add(material, 'wireframe').name("Wireframe?");
cubeControlsFolder.addColor(debugObject, 'color').onChange(()=>{
    material.color.set(debugObject.color)
});

// subdivitions of geometry
debugObject.subdiv = 1;
cubeControlsFolder.add(debugObject, 'subdiv', 1, 20, 1).onFinishChange(
    ()=>{
        const subdivitions = [debugObject.subdiv, debugObject.subdiv, debugObject.subdiv]; // x y z
        mesh.geometry.dispose();
        mesh.geometry = new THREE.BoxGeometry(1, 1, 1, subdivitions[0], subdivitions[1], subdivitions[2]);
    });

// Custom function for controls
debugObject.spin = ()=>{
    gsap.to(mesh.rotation, {y: mesh.rotation.y + Math.PI * 2});
}

cubeControlsFolder.add(debugObject, 'spin');


window.addEventListener('resize', () =>
{

    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()