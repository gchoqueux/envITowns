communication : http://rocket.forge-geoportail.ign.fr

##Créer son projet itowns

 * créer un dossier
 * ouvrir une console dans ce dossier
 * `npm init -y`
 * créez la structure de fichier :
    * public
        - index.html
        - bundle.js
    * src
        - index.js
    - webpack.config.js

    type nul > webpack.config.js && mkdir public src && cd public && type nul > index.html bundle.js && cd .. && cd src && type nul > index.js && cd ..
 * mkdir assets && cd assets && mkdir fonts icons images stylesheets && cd ..

 * Installation de Webpack
    * npm install --save-dev webpack@latest webpack-dev-server@latest
 * Configuration de Webpack
    * ajouter dans `webpack.config.js`
        ```js
        const webpack = require("webpack");
        const path = require("path");
        ```
    * dans index.html
        ```js
        <script src="bundle.js"></script>
        ```
    * dans index.js
        ```js
        document.write("Je débute avec Webpack !");
        ```
    * Installer Webpack de manière globale
        `npm install -g webpack@latest`
    *
 * Installer un serveur de développement

    * npm install webpack-dev-server --save-dev
    * npm i -D webpack-cli
    * config webpack
        ```js
            devServer: {
                contentBase: path.resolve(__dirname, "./public"),
                historyApiFallback: true,
                inline: true,
                open: true,
                hot: true
            },
            devtool: "eval-source-map"
        ```
            * contentBase : indique le dossier depuis lequel le contenu sera servi
            * historyApiFallback : activation d’un fallback vers index.html pour les Single Page Applications
            * inline : active la diffusion de messages dans la console DevTools
            * open : ouvre votre navigateur par défaut lorsque le serveur est lancé
            * hot : active le Hot Module Reload, soit le rechargement automatique de vos modules à chaque modification/sauvegarde de vos fichiers
    * package.json
        "start": "webpack-dev-server -d --hot --config webpack.config.js --watch"

* configurer itowns
    * `npm install itowns --save`
    * `npm install three --save`
    * dans index.js
        `import * as itowns from 'itowns';`
    * dans index.html
        `<div id="viewerDiv"></div>`



