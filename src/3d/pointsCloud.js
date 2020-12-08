import * as itowns from 'itowns';
import * as THREE from 'three';
import { Potree, p1_2154, deltaPivotLocal, heightGeoid } from './config.js';

global.Potree = Potree;

Potree.pointBudget = 100000*1000;

const points = new THREE.Group()

p1_2154.x -= deltaPivotLocal.x;
p1_2154.y -= deltaPivotLocal.y;
const pointclouds = [];
const p1_4326 = p1_2154.as('EPSG:4326');
const pivotTHREE = new THREE.Object3D();


const pointcloudMaterial = new itowns.PointsMaterial();

pointcloudMaterial.clipBoxes = [];
pointcloudMaterial.mode = 4;
pointcloudMaterial.uniforms.octreeSize = { value: 0 };
pointcloudMaterial.size = 3;

export const addPointCloud = (view, urls) => {
    const geocentricPosition = p1_4326.as(view.referenceCrs);
    pivotTHREE.position.copy(geocentricPosition);
    pivotTHREE.lookAt(p1_4326.geodesicNormal.add(geocentricPosition));
    pivotTHREE.updateMatrixWorld(true);
    view.scene.add(pivotTHREE);

    // convergence of meridians
    const a = itowns.OrientationUtils.quaternionFromCRSToCRS('EPSG:2154', 'EPSG:4326', p1_4326);

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

    for(const url of urls) {
    	Potree.loadPointCloud(url, name, function(data) {
    	    const pointcloud = data.pointcloud;
            pointclouds.push(pointcloud);

            pivotTHREE.add(pointcloud);
            pointcloud.position.z -= heightGeoid;
            pointcloud.quaternion.copy(a);
            pivotTHREE.updateMatrixWorld(true);

            pointcloud.material = pointcloudMaterial;
        });
    }

    const near = camera.near;
    const far = camera.far;

    return {
    	layer: points,
    	updateGroundVisibility: (value) => {
            if (value) {
                camera.near = near;
                camera.far = far;
            } else {
                camera.near = 0.05;
                camera.far = 20000;
            }
            camera.updateProjectionMatrix();
            view.tileLayer.display = value;
            view.controls.handleCollision = value;
            view.getLayerById('atmosphere').visible = value;
            view.getLayerById('Ortho').visible = value;
            view.controls.minDistance = value ? 50 : 5;
            view.notifyChange(camera, true);
    	},
    	updateBudget: (value) => {
    		Potree.pointBudget = value;
    	}
	}
}