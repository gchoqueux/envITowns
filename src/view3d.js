import view, { callBacks } from './3d/core';
import { addPointCloud } from './3d/pointsCloud';
import { load as loadTarget, loadLabel } from './3d/targets';
import { gui } from './3d/gui';
import { pathCloud_Falaise, pathCloud_Context, pathTargets, pathTargetsLabel} from './3d/config';

const interfaceCloud = addPointCloud(view, [pathCloud_Falaise, pathCloud_Context]);

loadTarget(view, pathTargets, interfaceCloud.pivotLocal);
loadLabel(view, pathTargetsLabel);

gui.create(callBacks);
gui.createGuiCloud(view, interfaceCloud);
