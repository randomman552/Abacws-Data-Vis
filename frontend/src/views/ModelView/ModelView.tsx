import { useEffect, useRef } from "react"
import * as THREE from "three"

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
        
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        
        scene.add(cube);
        camera.position.z = 5;
        
        // Animation function
        const animate = function () {
          requestAnimationFrame(animate);
          cube.rotation.x += 0.01;
          cube.rotation.y += 0.01;
          renderer.render(scene, camera);
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
