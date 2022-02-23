import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Stats from "three/examples/jsm/libs/stats.module"
import Spinner from "../components/Spinner"

export interface Props {}

export default function ModelView(props: Props) {
    const [loaded, setLoaded] = useState(false);
    // Reference to mount the canvas to
    const mountRef = useRef<any>(null);
    
    // Function to setup canvas when this component is first created
    useEffect(() => {
        let width = window.innerWidth;
        let height = window.innerHeight;

        let stats = Stats();
        mountRef.current.appendChild(stats.dom);

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000)
        mountRef.current.appendChild(renderer.domElement);

        // Load orbit controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 25, 0);
        controls.minDistance = 50;
        camera.position.set(150, 80, -150)
        controls.update();

        // Load model
        const loader = new GLTFLoader();
        loader.load("/assets/abacws.glb", (gltf) => {
            console.log("Scene loaded!");
            scene.add(gltf.scene);
            setLoaded(true);
        }, undefined, (error) => {
            console.log(error);
        });

        // Add lighting
        const lights : THREE.Light[] = [];

        lights.push(new THREE.AmbientLight(0x404040));
        lights.push(new THREE.DirectionalLight(0xf4f4f4));
        lights.push(new THREE.DirectionalLight(0xf4f4af));

        lights[1].position.set(-100, 100, -100);
        lights[2].position.set(100, 100, 100);
        scene.add(...lights);
        
        // Animation function
        var animate = function () {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
            stats.update()
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
        // Store ref now so that it doesn't break this code if changed
        const ref = mountRef.current;
        return () => {
            ref.removeChild(renderer.domElement);
            ref.removeChild(stats.dom);
            window.removeEventListener('resize', onResize);
        }
    }, []);

    // Render loading spinner until the model is finished loading
    const loadingSpinner = (!loaded) ? <Spinner/> : null;
    return (
        <div ref={mountRef} className="model-container">
            {loadingSpinner}
        </div>
    )
}
