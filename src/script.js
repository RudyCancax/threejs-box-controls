import * as THREE from 'three'
import GUI from 'lil-gui'; 
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const gui = new GUI();
const debugObject = {

}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

debugObject.color = '#ffca28';

// Object
// const positionArray = new Float32Array([
//     0, 0, 0,
//     0, 1, 0,
//     1, 0, 0
// ]);
const count = 200 * 3 * 3;
const positionArray = new Float32Array(count);
for (let index = 0; index < count; index++) {
    positionArray[index] = (Math.random() - 0.5) * 3;
}

const geometry = new THREE.BufferGeometry();
const positionAtribute = new THREE.BufferAttribute(positionArray, 3, false);
positionAtribute.setUsage( THREE.DynamicDrawUsage );
geometry.setAttribute('position', positionAtribute);
const material = new THREE.MeshBasicMaterial({ color: debugObject.color, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//DEBUG CONTROLS
gui.add(mesh.position, 'z', -3, 3, 0.0001).name('zoom');
gui.add(mesh, 'visible').name('Display mesh')
gui.add(material, 'wireframe').name("Wireframe?");
gui.addColor(debugObject, 'color').onChange((a)=>{
    material.color.set(debugObject.color)
})



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