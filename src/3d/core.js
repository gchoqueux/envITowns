import { itowns, pathLayers } from './config';

// Define initial camera position
const placement = {
    coord: new itowns.Coordinates('EPSG:4326', 7.31974850827616, 43.98952226087919,),
    range: 54000,
    tilt: 29.48,
    heading: -25.11
}

// Instanciate iTowns GlobeView*
const viewerDiv = document.getElementById('viewerDiv');
const view = new itowns.GlobeView(viewerDiv, placement, {  renderer: { isWebGL2: false } });

view.controls.minDistanceCollision = 50;
view.controls.minDistance = 150;

let orthoLayer;
let adminLayer;
let alexLayer;

let x = 0;

// Add two imagery layers to the scene
// This layer is defined in a json file but it could be defined as a plain js
// object. See Layer* for more info.
const pOrtho = itowns.Fetcher.json(pathLayers + 'Ortho.json').then(function _(config) {
    config.source = new itowns.WMTSSource(config.source);
    orthoLayer = new itowns.ColorLayer('Ortho', config);
    view.addLayer(orthoLayer);
});

const pOsm = itowns.Fetcher.json(pathLayers + 'Alex.json').then(function _(config) {
    config.source = new itowns.WMTSSource(config.source);
    alexLayer = new itowns.ColorLayer('Alex', config);
    view.addLayer(alexLayer);
});

const pAdmin = itowns.Fetcher.json(pathLayers + 'Administrative.json').then(function _(config) {
    config.source = new itowns.WMTSSource(config.source);
    adminLayer = new itowns.ColorLayer('Administrative', config);
    view.addLayer(adminLayer);
});

// Add two elevation layers.
// These will deform iTowns globe geometry to represent terrain elevation.
function addElevationLayerFromConfig(config) {
    config.source = new itowns.WMTSSource(config.source);
    view.addLayer(new itowns.ElevationLayer(config.id, config));
}

itowns.Fetcher.json(pathLayers + 'WORLD_DTM.json').then(addElevationLayerFromConfig);
itowns.Fetcher.json(pathLayers + 'IGN_MNT_HIGHRES.json').then(addElevationLayerFromConfig);
// itowns.Fetcher.json(pathLayers + 'mns.json').then(addElevationLayerFromConfig);

export const callBacks = {
    zoomIn: () => {
        const zoom = Math.min(20, view.controls.getZoom() + 1);
        console.log('zoom', zoom);
        view.controls.lookAtCoordinate({ zoom, time: 500 });
    },
    place: () => {
        view.controls.lookAtCoordinate({ tilt: 89, heading: 0 }, false);
    },
    zoomOut: () => {
        const zoom = Math.max(3, view.controls.getZoom() - 1);
        view.controls.lookAtCoordinate({ zoom, time: 500 });
    },
    setScissor: (v) => {
        x = Math.max(v, 0);
        view.notifyChange();
    },
    resize: () => {
        view.resize()
    }
}

// Rendering code
function splitRendering() {
    const oldVisOrtho = orthoLayer.visible;
    const oldVisAlex = alexLayer.visible;
    const g = view.mainLoop.gfxEngine;
    const camera = view.camera;
    const r = g.renderer;
    r.setScissorTest(true);

    // render ortho layer on the left
    alexLayer.visible = false;
    orthoLayer.visible = oldVisOrtho;

    r.setScissor(0, 0, x + 2, camera.height);
    g.renderView(view);

    // render osm layer on the right
    orthoLayer.visible = oldVisOrtho;
    alexLayer.visible = oldVisAlex;

    r.setScissor(x + 2, 0, camera.width - x - 2, camera.height);
    g.renderView(view);

    alexLayer.visible = oldVisAlex;
    orthoLayer.visible = oldVisOrtho;
}

// Override default rendering method when color layers are ready
export const allLayerLoaded = Promise.all([pOrtho, pOsm, pAdmin]);
allLayerLoaded.then(() => {
    view.render = splitRendering;
    itowns.ColorLayersOrdering.moveLayerToIndex(view, 'Ortho', 0);
    itowns.ColorLayersOrdering.moveLayerToIndex(view, 'Alex', 1);
    itowns.ColorLayersOrdering.moveLayerToIndex(view, 'Administrative', 2);
});

export default view;