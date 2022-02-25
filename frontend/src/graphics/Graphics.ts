import * as THREE from "three"
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Stats from "three/examples/jsm/libs/stats.module";
import React from "react";

/**
 * Singleton class encapsulating three-js code for creating and rendering the building model in the canvas.
 */
export default class Graphics {
    private static instance?: Graphics;

    private width: number = window.innerWidth;
    private height: number = window.innerHeight;
    private ref: any;

    private resizeListener = () => { this.resize(); };
    private animateListener = () => { this.animate(); };

    private camera: THREE.PerspectiveCamera;
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;

    private controls: OrbitControls;
    private stats: Stats
    
    private constructor() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.stats = Stats();

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, this.width/this.height, 0.1, 1000);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0x000000);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 25, 0);
        this.controls.minDistance = 50;
        this.camera.position.set(150, 80, -150)
        this.controls.update();
    }

    /**
     * Singleton get instance method
     * @returns The only instance of the Graphics class
     */
    static getInstance() {
        if (this.instance) return this.instance;
        const obj = new this();
        this.instance = obj;
        return obj;
    }

    /**
     * Method to initalise the scene.
     * @returns Promise of model loader. Add .then and .catch to intercept success or failure.
     */
    async init(mountRef: React.MutableRefObject<any>) {
        // Add to dom
        this.ref = mountRef.current;
        this.ref.appendChild(this.stats.dom);
        this.ref.appendChild(this.renderer.domElement);

        // Add resize listener
        window.addEventListener('resize', this.resizeListener);

        // Start animation
        this.animateListener = () => {
            requestAnimationFrame(this.animateListener);
            this.animate();
        }
        this.animateListener();

        // Lighting
        const lights : THREE.Light[] = [];
        lights.push(new THREE.AmbientLight(0x404040));
        lights.push(new THREE.DirectionalLight(0xf4f4f4));
        lights.push(new THREE.DirectionalLight(0xf4f4af));

        lights[1].position.set(-100, 100, -100);
        lights[2].position.set(100, 100, 100);
        this.scene.add(...lights);

        // Load model as the last step
        const loader = new GLTFLoader();
        return loader.loadAsync("/assets/abacws.glb").then((gltf: GLTF) => {
            this.scene.add(gltf.scene);
            return gltf;
        });
    }

    /**
     * Method to update the size of the canvas and camera when the window changes size.
     */
    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.camera.aspect = this.width/this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height)
    }

    /**
     * Method to draw a frame on the canvas
     */
    animate() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        this.stats.update();
    }

    /**
     * Method called to dispose of resources when this object is no longer required.
     */
    dispose() {
        this.ref.removeChild(this.renderer.domElement);
        this.ref.removeChild(this.stats.dom);

        // Remove event listeners
        window.removeEventListener('resize', this.resizeListener);
        this.animateListener = () => {};
    }
}