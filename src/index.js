import * as itowns from 'itowns';

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