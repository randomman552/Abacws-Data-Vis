import * as THREE from "three"
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Stats from "three/examples/jsm/libs/stats.module";
import React from "react";
import { Device } from "..";

const DEVICE_GEOM = new THREE.BoxGeometry(3, 3, 3);
const DEVICE_COLOR = 0xff0000;
const DEVICE_HOVER_GEOM = new THREE.BoxGeometry(4, 4, 4);
const DEVICE_HOVER_COLOR = 0x00aaff;
const DEVICE_SELECTED_GEOM = new THREE.BoxGeometry(4, 4, 4);
const DEVICE_SELECTED_COLOR = 0x00ffaa;

/**
 * Singleton class encapsulating three-js code for creating and rendering the building model in the canvas.
 */
export default class Graphics {
    private static instance?: Graphics;

    private width = window.innerWidth;
    private height = window.innerHeight;
    private ref: any;

    // Event listeners
    private onReize = () => { this.resize(); };
    private onAnimate = () => { this.animate(); };
    private onPointerMove = (event: PointerEvent) => { this.pointerMove(event); }
    private onPointerDown = (event: PointerEvent) => { this.pointerDown(event); }
    /**
     * Attribute to store the interval ID for the interval used to rotate the device cubes in the scene.
     */
    private deviceIntervalID;

    private camera = new THREE.PerspectiveCamera();
    private scene = new THREE.Scene();
    private deviceScene = new THREE.Scene();
    private renderer = new THREE.WebGLRenderer();
    private rayCaster = new THREE.Raycaster();

    private clippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 100);

    private controls = new OrbitControls(this.camera, this.renderer.domElement);
    private stats = Stats()

    private pointer = { x:0, y:0 };
    private _hoveredDevice?: THREE.Object3D<THREE.Event>;
    private _selectedDevice?: THREE.Object3D<THREE.Event>;
    
    private constructor() {
        console.log("Graphics created");
        
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.camera.aspect = this.width/this.height;
        this.camera.updateProjectionMatrix();

        // Renderer setup
        this.renderer.autoClear = false;
        this.renderer.setPixelRatio(2);
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0x000000);

        // Controls setup
        this.controls.target.set(0, 25, 0);
        this.controls.minDistance = 50;
        this.camera.position.set(150, 80, -150)
        this.controls.update();
        
        // Clipping plane setup
        this.renderer.clippingPlanes = [ this.clippingPlane ];

        // Start device rotation interval
        this.deviceIntervalID = setInterval(() => {
            const angle = THREE.MathUtils.degToRad(1);
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

        // Add event listeners
        window.addEventListener('resize', this.onReize);
        window.addEventListener('pointermove', this.onPointerMove);
        window.addEventListener('pointerdown', this.onPointerDown);

        // Start animation
        this.onAnimate = () => {
            requestAnimationFrame(this.onAnimate);
            this.animate();
        }
        this.onAnimate();

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040);
        const light = new THREE.DirectionalLight(0xf4f4f4);
        light.position.set(0, 100, -100);
        this.scene.add(ambientLight, light);

        // Load model as the last step
        const loader = new GLTFLoader();
        return loader.loadAsync("/assets/abacws.glb").then((gltf: GLTF) => {
            this.scene.add(gltf.scene);
            return gltf;
        });
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
        window.removeEventListener('resize', this.onReize);
        window.removeEventListener('pointermove', this.onPointerMove);
        window.removeEventListener('pointerdown', this.onPointerDown);
        this.onAnimate = () => { this.animate() };

        // Clear intervals
        clearInterval(this.deviceIntervalID)

        // Remove old instance
        Graphics.instance = undefined;
    }

    // Setters
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
        const geom = DEVICE_GEOM;
        const mat = new THREE.MeshPhongMaterial({color: DEVICE_COLOR});
        for (const device of devices) {
            const cube = new THREE.Mesh(geom, mat);
            cube.position.set(device.position.x, device.position.y, device.position.z);
            cube.userData = device;
            this.deviceScene.add(cube);
        }
        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040);
        const light = new THREE.DirectionalLight(0xf4f4f4);
        light.position.set(-100, 100, -100);
        this.deviceScene.add(light, ambientLight);
    }

    // Getters
    get selectedDevice(): Device {
        return this._selectedDevice?.userData as Device
    }


    // Event listeners
    /**
     * Method to update the size of the canvas and camera when the window changes size.
     */
    private resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.camera.aspect = this.width/this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height)
    }

    /**
     * Method called whenever the pointer moves
     * Checks if we are hovering over a device using raycasts
     * @param event 
     */
    private pointerMove(event: PointerEvent) {
        this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        
        // Check if raycast intersects any devices
        this.rayCaster.setFromCamera(this.pointer, this.camera);
        const intersects = this.rayCaster.intersectObjects(this.deviceScene.children, false);
        // If an object is detected, change its color so we can easily see it is being hovered
        if (intersects.length) {
            const device:any = intersects[0].object;
            this.deviceHoverEnter(device);
        } else if (this._hoveredDevice) {
            const device:any = this._hoveredDevice;
            this.deviceHoverExit(device);
        }
    }

    /**
     * Method called whenever a pointer down event occurs on the window.
     * Used to select a device when we click on it
     * @param event 
     */
    private pointerDown(event: PointerEvent) {
        if (this._hoveredDevice && event.button === 0)
            this.devicePointerDown(this._hoveredDevice);
    }

    /**
     * Method called when we hover of a device in three-js
     * @param device The device we are currently hovering over (3D object)
     */
    private deviceHoverEnter(device: any) {
        this._hoveredDevice = device;
        if (device === this._selectedDevice) return;
        device.material.color.set(DEVICE_HOVER_COLOR);
        device.geometry = DEVICE_HOVER_GEOM;
    }

    /**
     * Method called when we stop hovering over a device in three-js
     * @param device The device we are no longer hovering over
     */
    private deviceHoverExit(device: any) {
        this._hoveredDevice = undefined;
        if (device === this._selectedDevice) return;
        device.material.color.set(DEVICE_COLOR);
        device.geometry = DEVICE_GEOM;
    }

    /**
     * Method called whenever we click on a device
     * Selects the device for later use
     * @param device The device we have clicked on
     */
    private devicePointerDown(device: any) {
        // If a new device is selected, we must revert any changes to the previous one
        if (device !== this._selectedDevice && this._selectedDevice) {
            const selectedDevice:any = this._selectedDevice;
            selectedDevice.material.color.set(DEVICE_COLOR);
            selectedDevice.geometry = DEVICE_GEOM;
        }
        this._selectedDevice = device;
        if (device) {
            device.material.color.set(DEVICE_SELECTED_COLOR);
            device.geometry = DEVICE_SELECTED_GEOM;
        }
    }
}