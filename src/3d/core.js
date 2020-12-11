import * as itowns from 'itowns';
import { pathLayers } from './config';

// Define initial camera position
const placement = {
    coord: new itowns.Coordinates('EPSG:4326', -0.8482399150822765, 43.00396117941756, 0),
    range: 300,
    tilt: 29.48,
    heading: -25.11
}

// Instanciate iTowns Globe Viewer
const viewerDiv = document.getElementById('viewerDiv');
const view = new itowns.GlobeView(viewerDiv, placement, {  renderer: { isWebGL2: false } });

view.controls.minDistanceCollision = 10;
view.controls.minDistance = 50;
view.controls.dampingMoveFactor = 0.9;

// Add ortho images
const pOrtho = itowns.Fetcher.json(pathLayers + 'Ortho.json').then(function _(config) {
    config.source = new itowns.WMTSSource(config.source);
    view.addLayer(new itowns.ColorLayer('Ortho', config));
});

// Add two elevation layers.
function addElevationLayerFromConfig(config) {
    config.source = new itowns.WMTSSource(config.source);
    view.addLayer(new itowns.ElevationLayer(config.id, config));
}

itowns.Fetcher.json(pathLayers + 'WORLD_DTM.json').then(addElevationLayerFromConfig);
// itowns.Fetcher.json(pathLayers + 'IGN_MNT_HIGHRES.json').then(addElevationLayerFromConfig);
itowns.Fetcher.json(pathLayers + 'mns.json').then(addElevationLayerFromConfig);

export const callBacks = {
    zoomIn: () => {
        const zoom = Math.min(20, view.controls.getZoom() + 1);
        view.controls.lookAtCoordinate({ zoom, time: 500 });
    },
    place: () => {
        view.controls.lookAtCoordinate({ tilt: 89, heading: 0 }, false);
    },
    zoomOut: () => {
        const zoom = Math.max(3, view.controls.getZoom() - 1);
        view.controls.lookAtCoordinate({ zoom, time: 500 });
    },
    resize: () => {
        view.resize()
    }
}

export default view;