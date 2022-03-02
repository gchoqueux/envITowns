import * as itowns from 'itowns';
import * as itowns_widgets from 'itowns/widgets';

const placement = {
    coord: new itowns.Coordinates('EPSG:4326', 2.42, 48.83),
    range: 2500000,
}

const viewerDiv = document.getElementById('viewerDiv');
const view = new itowns.GlobeView(viewerDiv, placement);
const layer = new itowns.ColorLayer('mon calque...', {
    source: new itowns.WMTSSource({
        url: 'https://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wmts',
        crs: 'EPSG:3857',
        name: 'ORTHOIMAGERY.ORTHOPHOTOS',
        tileMatrixSet: 'PM',
        format: 'image/jpeg',
    })
});

view.addLayer(layer);

// Create a ColorLayer that shall be displayed on the minimap.
const minimapColorLayer = new itowns.ColorLayer('minimap', {
    source: new itowns.VectorTilesSource({
        style: 'https://wxs.ign.fr/essentiels/static/vectorTiles/styles/PLAN.IGN/standard.json',
        // We don't display mountains and plot related data to ease visualisation
        filter: (layer) => !layer['source-layer'].includes('oro_')
            && !layer['source-layer'].includes('parcellaire'),
    }),
    addLabelLayer: true,
});

// Create a minimap.
const minimap = new itowns_widgets.Minimap(view, minimapColorLayer, {
    cursor: '+',
    size: 200,
});

// ---------- ADD NAVIGATION WIDGET : ----------

const widgets = new itowns_widgets.Navigation(view, { position: 'bottom-right' });

// Example on how to add a new button to the widgets menu
widgets.addButton(
    'rotate-up',
    '<p style="font-size: 20px">&#8595</p>',
    () => {
        view.controls.lookAtCoordinate({
            tilt: view.controls.getTilt() - 10,
            time: 500,
        });
    },
    'button-bar-rotation',
);
widgets.addButton(
    'rotate-down',
    '<p style="font-size: 20px">&#8593</p>',
    () => {
        view.controls.lookAtCoordinate({
            tilt: view.controls.getTilt() + 10,
            time: 500,
        });
    },
    'button-bar-rotation',
);
widgets.addButton(
    'reset-position',
    '&#8634',
    () => { view.controls.lookAtCoordinate(placement) },
);