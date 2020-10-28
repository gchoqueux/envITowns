import dat from 'dat.gui';
// import "./less/gui.less"

const splitSlider = document.getElementById('splitSlider');
const viewerDiv = document.getElementById('viewerDiv');
const widthSplitter = parseInt(getComputedStyle(splitSlider).width.replace('px',''));

export const gui = {
    create: (callBacks) => {
        const zoomIn = document.getElementById('zoom-in');
        zoomIn.addEventListener('click', callBacks.zoomIn, false);

        const place = document.getElementById('place');
        place.addEventListener('click', callBacks.place, false);

        const zoomOut = document.getElementById('zoom-out');
        zoomOut.addEventListener('click', callBacks.zoomOut, false);

        // Slide handling

        callBacks.setScissor(splitSlider.offsetLeft - viewerDiv.getBoundingClientRect().x);

        function splitSliderMove(evt) {
            const br = splitSlider.parentElement.getBoundingClientRect();
            const targetBoundingRect = event.target.getBoundingClientRect();
            let posX = targetBoundingRect.x + event.offsetX;

            posX = posX > 60000 ? 0 : posX;
            posX = Math.max(splitSlider.parentElement.getBoundingClientRect().x, posX);
            posX = Math.min(posX, splitSlider.parentElement.offsetWidth - widthSplitter);
            splitSlider.style.left = posX + 'px';

            callBacks.setScissor(posX - viewerDiv.getBoundingClientRect().x)
        }

        function mouseDown(evt) {
            window.addEventListener('mousemove', splitSliderMove, true);
        }

        function mouseUp() {
            window.removeEventListener('mousemove', splitSliderMove, true);
        }

        splitSlider.addEventListener('mousedown', mouseDown, false);
        window.addEventListener('mouseup', mouseUp, false);

        // Affichage de l'aide
        let showHelpContent = false ;
        const helpContent = document.getElementById('help-content') ;
        const help = document.getElementById('help');
        help.addEventListener('click', () => {
            showHelpContent = !showHelpContent ;
            let visibility = showHelpContent ? 'visible' : 'hidden' ;
            helpContent.style.visibility = visibility ;
        });

        // Plein écran
        let fullScreen = false ;
        const resize = document.getElementById('resize');
        resize.addEventListener('click', () => {
            const containerMap = document.getElementById('container-map') ;
            if (!fullScreen) {
                containerMap.classList.add('full-screen') ;
                resize.innerHTML = '<span class="glyphicon glyphicon-resize-small small"></span>' ;
            } else {
                containerMap.classList.remove('full-screen') ;
                resize.innerHTML = '<span class="glyphicon glyphicon-resize-full small"></span>' ;
            }
            fullScreen = !fullScreen ;
            callBacks.resize() ;
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

                splitSlider.style.visibility = value ? 'visible' : 'hidden';
                updateGroundVisibility(value);
            });

            layer.pointSize = 4;
            datGui.add(layer, 'visible').name('Point Lidar'); //.onChange(update);

            datGui.add(layer, 'pointSize', 0, 5).name('Taille des points').onChange(value => {
                const points = layer.children[0];
                points.material.size = value;
            });
        }
    }
}




