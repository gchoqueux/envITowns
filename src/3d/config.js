import * as _Potree from '../../itowns_build/potree.js';
import BinaryHeap from '../../itowns_build/BinaryHeap.js';
import { LASFile, LASDecoder } from '../../itowns_build/plasio/js/laslaz.js';

global.BinaryHeap = BinaryHeap;
global.LASFile = LASFile;
global.LASDecoder = LASDecoder;

export const pathLayers = './layers/';
export const pathCloud = 'https://alex.ign.fr/3d/ept.json';
export const Potree = _Potree;