import * as itowns from 'itowns';
import proj4 from 'proj4';
import * as THREE from 'three';

proj4.defs('EPSG:2153', '+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');

const placement = {
    coord: new itowns.Coordinates('EPSG:4326', 2.35, 48.85),
    range: 60000,
}


// const coordinates = new itowns.Coordinates('EPSG:2153', 6866531.47, 662454.922, 0).as('EPSG:4326');
const coordinates = new itowns.Coordinates('EPSG:4326', 2.41378509, 48.82105262);

const viewerDiv = document.getElementById('viewerDiv');
const view = new itowns.GlobeView(viewerDiv, placement);
const layer = new itowns.ColorLayer('mon calque', {
	source: new itowns.WMTSSource({
		'url': 'https://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wmts',
        'projection': 'EPSG:3857',
        'name': 'ORTHOIMAGERY.ORTHOPHOTOS',
        'tileMatrixSet': 'PM',
        'format': 'image/jpeg',
	})
});

view.addLayer(layer);

view.addEventListener(itowns.VIEW_EVENTS.INITIALIZED, () => {
	const axes = new THREE.AxesHelper(10e3);
	placement.coord.as(view.referenceCrs).toVector3(axes.position);
	// http://www.itowns-project.org/itowns/docs/#api/Geographic/OrientationUtils
	itowns.OrientationUtils.quaternionFromCRSToCRS(placement.coord.crs, view.referenceCrs)(placement.coord, axes.quaternion);
	// view.scene.add(axes);
	axes.updateMatrixWorld();
	view.notifyChange();
});

// http://www.itowns-project.org/itowns/docs/#api/View/View
view.addFrameRequester(itowns.MAIN_LOOP_EVENTS.AFTER_CAMERA_UPDATE, () => {
	const coordinates = view.controls.getLookAtCoordinate();
	// console.log(coordinates.longitude, coordinates.latitude);
});

// http://www.itowns-project.org/itowns/docs/#api/Controls/GlobeControls
view.controls.addEventListener(itowns.CONTROL_EVENTS.CAMERA_TARGET_CHANGED, () => {
	const coordinates = view.controls.getLookAtCoordinate();
	// console.log('Final', coordinates.longitude, coordinates.latitude);
});

var jsonSource = new itowns.FileSource({
    url: 'nivrn.bbox_2.4_48.8.json',
    projection: 'EPSG:4326',
    fetcher: itowns.Fetcher.json,
    parser: itowns.GeoJsonParser.parse,
});

var jsonLayer = new itowns.ColorLayer('nivrn', {
    name: 'nivrn',
    transparent: true,
    source: jsonSource,
	style: {
		point: {
		    color:'red',
		},
	},
});

view.addLayer(jsonLayer).then(a => console.log(a));

const options = {
		buildExtent: true,
        crsIn: 'EPSG:4326',
        crsOut: view.tileLayer.extent.crs,
        mergeFeatures: true,
        withNormal: false,
        withAltitude: false
};
var rsgsiteSource = new itowns.FileSource({
    url: 'rsgsite.bbox_2.4_48.8.json',
    projection: 'EPSG:4326',
    fetcher: itowns.Fetcher.json,
    parser: (json) => {
    	const features = new itowns.FeatureCollection('EPSG:4326', options);

        const feature = new itowns.Feature(itowns.FEATURE_TYPES.POINT, view.tileLayer.extent.crs, options)
        features.pushFeature(feature)
        const geometry = feature.bindNewGeometry();

        geometry.startSubGeometry(Object.keys(json).length - 1, feature);
        for (const key in json) {
        	const s = json[key];
        	if (s.lambda_dd) {
	        	coordinates.x = s.lambda_dd;
	        	coordinates.y = s.phi_dd;
	        	geometry.pushCoordinates(coordinates, feature);
	        	geometry.updateExtent();
        	}
		}
        feature.updateExtent(geometry);
        features.updateExtent();
    	return Promise.resolve(features);
    },
});

var rsgsiteLayer = new itowns.ColorLayer('rsgsite', {
    name: 'nivrn',
    transparent: true,
    source: rsgsiteSource,
	style: {
		point: {
		    color: 'white',
		    line: 'black',
		    radius: 4,
		},
	},
});

view.addLayer(rsgsiteLayer);