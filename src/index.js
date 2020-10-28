import view, { callBacks } from './3d/core';
import { addPointCloud } from './3d/pointsCloud';
import { gui } from './3d/gui';
import { pathCloud } from './3d/config';

let interfaceCloud;

interfaceCloud = addPointCloud(view, pathCloud);

gui.create(callBacks);
gui.createGuiCloud(view, interfaceCloud);
