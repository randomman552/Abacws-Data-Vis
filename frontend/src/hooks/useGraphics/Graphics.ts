import * as THREE from "three"
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Stats from "three/examples/jsm/libs/stats.module";
import React from "react";
import { Device } from "..";
import { Spinner } from "../../components";

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
    /**
     * Attribute to store the interval ID for the interval used to rotate the device cubes in the scene.
     */
    private deviceIntervalID;

    private camera: THREE.PerspectiveCamera;
    private scene: THREE.Scene;
    private deviceScene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;

    private clippingPlane: THREE.Plane;

    private controls: OrbitControls;
    private stats: Stats
    
    constructor() {
        console.log("Graphics created");
        
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.stats = Stats();

        this.scene = new THREE.Scene();
        this.deviceScene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, this.width/this.height, 0.1, 1000);

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.autoClear = false;
        this.renderer.setPixelRatio(2);
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0x000000);

        // Controls setup
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 25, 0);
        this.controls.minDistance = 50;
        this.camera.position.set(150, 80, -150)
        this.controls.update();
        
        // Clipping plane setup
        this.clippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 100);
        this.renderer.clippingPlanes = [ this.clippingPlane ];

        // Start device rotation interval
        this.deviceIntervalID = setInterval(() => {
            const angle = 1*(Math.PI/180);
            this.deviceScene.children.forEach((child) => {
                child.rotateX(angle);
                child.rotateY(angle);
                child.rotateZ(angle);
            });
        }, 10)
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
     * Method moves the clipping plane to hide floors above the given floor number.
     * @param floor Integer representing the floor number
     */
    setFloor(floor: number) {
        const perFloor = 12.5
        const base = 12.5;

        // Clamp floor value
        floor = Math.min(Math.max(floor, 0), 7);

        // Calculate clipping height
        let val = base + perFloor*floor;
        this.clippingPlane.set(this.clippingPlane.normal, val);
    }

    /**
     * Add the given devices to the current scene for rendering
     * @param devices The devices to add to the scene
     */
    setDevices(devices: Device[]) {
        this.deviceScene.clear();
        const geom = new THREE.BoxGeometry(3, 3, 3);
        const mat = new THREE.MeshPhongMaterial({color: 0xff0000});
        for (const device of devices) {
            const cube = new THREE.Mesh(geom, mat);
            cube.position.set(device.position.x, device.position.y, device.position.z);
            this.deviceScene.add(cube);
        }
        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040);
        const light = new THREE.DirectionalLight(0xf4f4f4);
        light.position.set(-100, 100, -100);
        this.deviceScene.add(light, ambientLight);
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
        this.renderer.clear();
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        this.renderer.render(this.deviceScene, this.camera);
        this.stats.update();
    }

    /**
     * Method called to dispose of resources when this object is no longer required.
     */
    dispose() {
        console.log("Graphics destroyed");
        this.ref.removeChild(this.renderer.domElement);
        this.ref.removeChild(this.stats.dom);

        // Remove event listeners
        window.removeEventListener('resize', this.resizeListener);
        this.animateListener = () => { this.animate() };

        // Clear intervals
        clearInterval(this.deviceIntervalID)

        // Remove old instance
        Graphics.instance = undefined;
    }
}