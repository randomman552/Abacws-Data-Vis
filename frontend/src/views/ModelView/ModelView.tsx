import { useEffect, useRef } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export interface Props {}

export default function ModelView(props: Props) {
    // Reference to mount the canvas to
    const mountRef = useRef<any>(null);
    
    // Function to setup canvas when this component is first created
    useEffect(() => {
        let width = window.innerWidth;
        let height = window.innerHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        
        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);

        // Load orbit controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1;
        
        // Load model
        const loader = new GLTFLoader();
        loader.load("/assets/Cube.glb", (gltf) => {
            console.log("Scene loaded!");
            scene.add(gltf.scene);
        }, undefined, (error) => {
            console.log(error);
        })
        
        // Need ambient lighting for the model to be visible
        scene.add(new THREE.AmbientLight(0xF4F4F4))
        camera.position.z = 5;
        
        var animate = function () {
            requestAnimationFrame( animate );
            controls.update();
            renderer.render( scene, camera );
        };
        animate();

        // Resize listener to automatically scale canvas to window
        const onResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            camera.aspect = width/height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height)
        }
        window.addEventListener('resize', onResize);
        
        // Cleanup function
        return () => {
            mountRef.current.removeChild(renderer.domElement);
            window.removeEventListener('resize', onResize);
        }
    }, []);

    // Render view
    return (
        <div ref={mountRef}></div>
    )
}
