import dat from 'dat.gui';

const splitSlider = document.getElementById('splitSlider');
const viewerDiv = document.getElementById('viewerDiv');

export const gui = {
    create: (callBacks) => {
        const zoomIn = document.getElementById('zoom-in');
        zoomIn.addEventListener('click', callBacks.zoomIn, false);

        const place = document.getElementById('place');
        place.addEventListener('click', callBacks.place, false);

        const zoomOut = document.getElementById('zoom-out');
        zoomOut.addEventListener('click', callBacks.zoomOut, false);

        // Affichage de l'aide
        let showHelpContent = false ;
        const helpContent = document.getElementById('help-content') ;
        const help = document.getElementById('help');
        help.addEventListener('click', () => {
            showHelpContent = !showHelpContent ;
            let visibility = showHelpContent ? 'visible' : 'hidden' ;
            helpContent.style.visibility = visibility ;
        });
    },

    createGuiCloud: (view, inter) => {
        if (inter) {
            const element = document.createElement('div');
            element.id = 'menuDiv';
            const datGui = new dat.GUI({ autoPlace: false });
            element.appendChild(datGui.domElement);
            document.body.appendChild(element);

            const { layer, updateGroundVisibility } = inter;

            view.tileLayer.display = true;

            datGui.add(view.tileLayer, 'display').name('Sol').onChange((value) => {
                updateGroundVisibility(value);
            });

            layer.pointSize = 4;
            datGui.add(layer, 'visible').name('Point Lidar'); //.onChange(update);

            datGui.add(layer, 'pointSize', 0, 5).name('Taille des points').onChange(value => {
                const points = layer.children[0];
                points.material.size = value;
            });

            datGui.add(Potree, 'pointBudget', Potree.pointBudget * 0.005, Potree.pointBudget * 3).name('Détail');
        }
    }
}




