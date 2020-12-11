import * as _Potree from '../../itowns_build/potree.js';
import BinaryHeap from '../../itowns_build/BinaryHeap.js';
import { LASFile, LASDecoder } from '../../itowns_build/plasio/js/laslaz.js';
import { CRS, Coordinates } from 'itowns';

CRS.defs('EPSG:2154', '+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');

global.BinaryHeap = BinaryHeap;
global.LASFile = LASFile;
global.LASDecoder = LASDecoder;

export const pathLayers = './layers/';
const rootPath = '../Cloud/STFalaise/';
export const pathCloud_Falaise = '../Cloud/STFalaise/ept_Falaise_v2/ept.json';
export const pathCloud_Context = rootPath + 'ept_Context/ept.json';
export const pathTargets = rootPath + 'cibles_local_v2.geojson';
export const pathTargetsLabel = rootPath + 'cibles_v2.geojson';
export const Potree = _Potree;

export const heightGeoid = 50;
export const deltaPivotLocal = new THREE.Vector2(100, 100);
export const p1_2154 = new Coordinates('EPSG:2154', 385984.6349, 6219242.2964, 0);