import * as itowns from 'itowns';
import proj4 from 'proj4';
import * as THREE from 'three';

proj4.defs('EPSG:2153', '+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');

const placement = {
    coord: new itowns.Coordinates('EPSG:4326', 2.42, 48.83),
    range: 2500,
}

// const coordinates = new itowns.Coordinates('EPSG:2153', 6866531.47, 662454.922, 0).as('EPSG:4326');
const coordinates = new itowns.Coordinates('EPSG:4326', 2.41378509, 48.82105262);

const viewerDiv = document.getElementById('viewerDiv');
const view = new itowns.GlobeView(viewerDiv, placement);
const layer = new itowns.ColorLayer('mon calque', {
    source: new itowns.WMTSSource({
        url: 'https://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wmts',
        projection: 'EPSG:3857',
        name: 'ORTHOIMAGERY.ORTHOPHOTOS',
        tileMatrixSet: 'PM',
        format: 'image/jpeg',
    })
});

view.addLayer(layer);

const layerElevation = new itowns.ElevationLayer('IGN_MNT_HIGHRES', {
    source: new itowns.WMTSSource({
        url: 'https://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wmts',
        format: 'image/x-bil;bits=32',
        projection: 'EPSG:4326',
        name: 'ELEVATION.ELEVATIONGRIDCOVERAGE.HIGHRES',
        tileMatrixSet: 'WGS84G',
        tileMatrixSetLimits: {
            "11": {
                "minTileRow": 442,
                "maxTileRow": 1267,
                "minTileCol": 1344,
                "maxTileCol": 2683
            },
            "12": {
                "minTileRow": 885,
                "maxTileRow": 2343,
                "minTileCol": 3978,
                "maxTileCol": 5126
            },
            "13": {
                "minTileRow": 1770,
                "maxTileRow": 4687,
                "minTileCol": 7957,
                "maxTileCol": 10253
            },
            "14": {
                "minTileRow": 3540,
                "maxTileRow": 9375,
                "minTileCol": 15914,
                "maxTileCol": 20507
            }
        }
    })
});

view.addLayer(layerElevation);

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

const jsonSource = new itowns.FileSource({
    url: 'nivrn.bbox_2.4_48.8.json',
    projection: 'EPSG:4326',
    fetcher: itowns.Fetcher.json,
    parser: (json, options) => {
        return itowns.GeoJsonParser.parse(json, options);
    },
    zoom: { min: 15, max: 15 },
});

const color = new THREE.Color();

var tile;
const convert = itowns.Feature2Mesh.convert({
    color: () => color.set(0x00ff00),
    altitude: (properties, contour) => {
        var result;
        var z = 0;
        if (contour) {
            result = itowns.DEMUtils.getElevationValueAt(view.tileLayer, contour, 0, tile);
            if (!result) {
                result = itowns.DEMUtils.getElevationValueAt(view.tileLayer, contour, 0);
            }
            if (result) {
                tile = [result.tile];
                z = result.z;
            }
            return z + 5;
        }
    }
});

const jsonLayer = new itowns.GeometryLayer('nivrn', new THREE.Group(), {
    update: itowns.FeatureProcessing.update,
    convert: (data, extDest, layer) => {
        return convert(data, extDest, layer);
    },
    onMeshCreated: (mesh) => {
        mesh.material.size = 10;
        mesh.material.sizeAttenuation = false;
    },
    overrideAltitudeInToZero: true,
    source: jsonSource
});

view.addLayer(jsonLayer);

const options = {
        buildExtent: true,
        crsIn: 'EPSG:4326',
        crsOut: view.tileLayer.extent.crs,
        mergeFeatures: true,
        withNormal: false,
        withAltitude: false
};

const rsgsiteSource = new itowns.FileSource({
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

// WFS vers des objets 3D extrudés

function altitudeBuildings(properties) {
    return properties.z_min - properties.hauteur;
}

function extrudeBuildings(properties) {
    return properties.hauteur;
}

function acceptFeature(properties) {
    return !!properties.hauteur;
}

function colorBuildings(properties) {
    if (properties.id.indexOf('bati_remarquable') === 0) {
        return color.set(0x5555ff);
    } else if (properties.id.indexOf('bati_industriel') === 0) {
        return color.set(0xff5555);
    }
    return color.set(0xeeeeee);
}

var wfsBuildingSource = new itowns.WFSSource({
    url: 'https://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wfs?',
    version: '2.0.0',
    typeName: 'BDTOPO_BDD_WLD_WGS84G:bati_remarquable,BDTOPO_BDD_WLD_WGS84G:bati_indifferencie,BDTOPO_BDD_WLD_WGS84G:bati_industriel',
    projection: 'EPSG:4326',
    ipr: 'IGN',
    format: 'application/json',
    zoom: { min: 15, max: 15 },
    extent: new itowns.Extent('EPSG:4326', 2.4, 2.5, 48.5, 49),
});

var wfsBuildingLayer = new itowns.GeometryLayer('WFS Building', new THREE.Group(), {
    update: itowns.FeatureProcessing.update,
    convert: itowns.Feature2Mesh.convert({
        color: colorBuildings,
        altitude: altitudeBuildings,
        extrude: extrudeBuildings }),
    filter: acceptFeature,
    overrideAltitudeInToZero: true,
    source: wfsBuildingSource
});

view.addLayer(wfsBuildingLayer);

window.view = view;