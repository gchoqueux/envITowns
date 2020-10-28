import { itowns, Potree, pointsConfig } from './config.js';

const THREE = itowns.THREE;

var points = new Potree.Group();
points.setPointBudget(10000000);

export const addPointCloud = (view, url) => {
	view.scene.add(points);

	Potree.loadPointCloud(url, name, function(data) {
	    var pointcloud = data.pointcloud;
	    var camera = view.camera.camera3D;

	    // Transformation du nuage relatif
	    // const position = new itowns.THREE.Vector3(-21188.66740624979, -2795.3316578148515, -6369521.159717696).negate();
	    // position.z -= 50;
	    // const quaternion = new itowns.THREE.Quaternion(0.051029642724280636, -0.386805667413997, 0, 0.9207482561590027).inverse();
	    // position.applyQuaternion(quaternion);
	    // pointcloud.position.copy(position);
	    // pointcloud.quaternion.copy(quaternion);

	    // Transformation du nuage absolu
	    const position = new itowns.THREE.Vector3(0, 0, 1);
	    const quaternion = new itowns.THREE.Quaternion(0.051029642724280636, -0.386805667413997, 0, 0.9207482561590027).inverse();
	    position.applyQuaternion(quaternion);
	    position.setLength(55);
	    pointcloud.position.sub(position);


	    pointcloud.material.pointColorType = Potree.PointColorType.INTENSITY;
	    // pointcloud.material.pointSizeType = Potree.PointSizeType.ADAPTIVE;
	    pointcloud.material.intensityRange = [0, 4096];
	    pointcloud.material.shape = Potree.PointShape.CIRCLE;
	    pointcloud.material.size = 3;
	    pointcloud.material.useEDL = true;

	    points.add(pointcloud);

	    pointcloud.updateMatrix();
	    pointcloud.updateMatrixWorld(true);
	    view.notifyChange(camera, true);
    });


    view.addFrameRequester(itowns.MAIN_LOOP_EVENTS.UPDATE_END, () => view.notifyChange(points, true));
    return {
    	layer: points,
    	updateGroundVisibility: (value) => {
            view.tileLayer.display = value;
            view.tileLayer.maxSubdivisionLevel = value ? 19 : 14;
            view.controls.handleCollision = value;
            view.getLayerById('atmosphere').visible = value;
            view.notifyChange(view.camera.camera3D, true);
    	},
	}
}