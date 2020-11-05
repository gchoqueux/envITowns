import * as itowns from 'itowns';
import * as THREE from 'three';

import { Potree } from './config.js';

global.Potree = Potree;

Potree.pointBudget = 10000*1000;

const points = new THREE.Group()
let pointclouds = [];

export const addPointCloud = (view, url) => {
	view.scene.add(points);
	const camera = view.camera.camera3D;

    view.addFrameRequester(itowns.MAIN_LOOP_EVENTS.BEFORE_RENDER, (a) => {
        const renderer = view.mainLoop.gfxEngine.renderer;
        const octree = Potree.updatePointClouds(pointclouds, camera, renderer);

        points.children = [];

        if (octree.visibleNodes.length) {
            const sceneNodes = octree.visibleNodes.map(a => a.sceneNode)
            points.add(...sceneNodes);
        }
        view.notifyChange(camera, true);
    });

	Potree.loadPointCloud(url, name, function(data) {
	    var pointcloud = data.pointcloud;
        pointclouds.push(pointcloud);

	    // Transformation du nuage relatif
	    // const position = new THREE.Vector3(-21188.66740624979, -2795.3316578148515, -6369521.159717696).negate();
	    // position.z -= 50;
	    // const quaternion = new itowns.THREE.Quaternion(0.051029642724280636, -0.386805667413997, 0, 0.9207482561590027).inverse();
	    // position.applyQuaternion(quaternion);
	    // pointcloud.position.copy(position);
	    // pointcloud.quaternion.copy(quaternion);

	    // Transformation du nuage absolu
	    const position = new THREE.Vector3(0, 0, 1);
	    const quaternion = new THREE.Quaternion(0.051029642724280636, -0.386805667413997, 0, 0.9207482561590027).inverse();
	    position.applyQuaternion(quaternion);
	    position.setLength(55);
	    pointcloud.position.sub(position);

        pointcloud.material = new itowns.PointsMaterial();
        pointcloud.material.clipBoxes = [];
        pointcloud.material.mode = 1;
        pointcloud.material.intensityRange = new THREE.Vector3(0, 4096);
        pointcloud.material.uniforms.octreeSize = { value: 0 };
        pointcloud.material.size = 3;
    });

    return {
    	layer: points,
    	updateGroundVisibility: (value) => {
            view.tileLayer.display = value;
            view.tileLayer.maxSubdivisionLevel = value ? 19 : 14;
            view.controls.handleCollision = value;
            view.controls.minDistance = value ? 150 : 50;
            view.getLayerById('atmosphere').visible = value;
            view.getLayerById('Ortho').visible = value;
            view.getLayerById('Alex').visible = value;
            view.notifyChange(view.camera.camera3D, true);
    	},
    	updateBudget: (value) => {
    		Potree.pointBudget = value;
    	}
	}
}