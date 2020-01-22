import * as itowns from 'itowns';

const placement = {
    coord: new itowns.Coordinates('EPSG:4326', 2.35, 48.85),
    range: 250000,
}

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

// http://www.itowns-project.org/itowns/docs/#api/View/View
view.addFrameRequester(itowns.MAIN_LOOP_EVENTS.AFTER_CAMERA_UPDATE, () => {
	console.log('after update camera');
});


// http://www.itowns-project.org/itowns/docs/#api/Controls/GlobeControls
view.controls.addEventListener(itowns.CONTROL_EVENTS.CAMERA_TARGET_CHANGED, () => {
	console.log('CAMERA_TARGET_CHANGED');
});

