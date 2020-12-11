import * as itowns from 'itowns';
import { Potree, p1_2154, deltaPivotLocal, heightGeoid } from './config.js';

const material = new THREE.MeshBasicMaterial( {color: 0xff0000, transparent: true, opacity: 1.0 } );

const optionsGeoJsonParser = {
    in: {
        crs: 'EPSG:2154',
    },
    out: {
        crs: 'EPSG:2154',
        buildExtent: true,
        mergeFeatures: true,
        withNormal: false,
        withAltitude: true,
    }
};

export const load = (view, url, pivotLocal) => {
    const targets = new THREE.Group();
    pivotLocal.add( targets );
    return itowns.Fetcher.json(url)
        .then(function _(geojson) {
            return itowns.GeoJsonParser.parse(geojson, optionsGeoJsonParser).then((features) => {
                const vertices = features.features[0].vertices;
                for (var i = 0; i < vertices.length; i+= 3) {

                    const coord = new itowns.Coordinates('EPSG:2154').setFromArray(vertices, i);

                    const s = new THREE.Sphere();
                    const geometry = new THREE.SphereGeometry( 0.01, 8, 8 );
                    const target = new THREE.Mesh( geometry, material );

                    target.position.copy(coord);
                    targets.add( target );
                }
                targets.updateMatrixWorld(true);
                return features;
            });
        })
}

const optionsGeoJsonParserLabel = {
    in: {
        crs: 'EPSG:2154',
    },
    out: {
        crs: 'EPSG:4326',
        buildExtent: true,
        mergeFeatures: true,
        withNormal: false,
        withAltitude: true,
    }
};

export const loadLabel = (view, url) => {
    return itowns.Fetcher.json(url)
        .then(function _(geojson) {
            return itowns.GeoJsonParser.parse(geojson, optionsGeoJsonParserLabel).then((features) => {
                const vertices = features.features[0].vertices;
                for (var i = 0; i < vertices.length; i+= 3) {
                    vertices[i + 2] -= heightGeoid - 0.1;
                }
                return features;
            });
        }).then(function _(features) {
            const ciblesSource = new itowns.FileSource({ features });

            const style = new itowns.Style({
                zoom: {
                    min: 16,
                },
                text: {
                    size: 20,
                    color: 'red',
                    field: '{name}',
                    font: ['Arial', 'sans-serif'],
                    haloColor: 'white',
                    haloWidth: 3,
                },
            });

            const ciblesLayer = new itowns.LabelLayer('Cibles', {
                transparent: true,
                source: ciblesSource,
                crs: 'EPSG:4326',
                style,
            });

            view.addLayer(ciblesLayer);
        });
}
