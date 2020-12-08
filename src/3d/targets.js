import * as itowns from 'itowns';
import { Potree, p1_2154, deltaPivotLocal, heightGeoid } from './config.js';

const material = new THREE.MeshBasicMaterial( {color: 0xff0000, transparent: true, opacity: 1.0 } );

const optionsGeoJsonParser = {
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

export const load = (view, url) => {
    return itowns.Fetcher.json(url)
        .then(function _(geojson) {
            return itowns.GeoJsonParser.parse(geojson, optionsGeoJsonParser).then((features) => {
                const vertices = features.features[0].vertices;
                for (var i = 0; i < vertices.length; i+= 3) {
                    vertices[i + 2] -= heightGeoid;

                    const coord = new itowns.Coordinates('EPSG:4326').setFromArray(vertices, i);
                    // ??
                    coord.z -= 1.7;

                    const s = new THREE.Sphere();
                    const geometry = new THREE.SphereGeometry( 0.10, 8, 8 );
                    const sphereTarget = new THREE.Mesh( geometry, material );

                    sphereTarget.position.copy(coord.as(view.referenceCrs));
                    view.scene.add( sphereTarget );
                    sphereTarget.updateMatrixWorld(true);
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
