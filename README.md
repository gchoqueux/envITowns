## Pour communiquer lors de la session

http://rocket.forge-geoportail.ign.fr

## Créer son projet itowns

### créer l'arborescence
 * créer un dossier avec le nom de votre projet
 * ouvrir une console dans ce dossier
 * `npm init -y`
 * créez la structure de fichier :
    * :file_folder: `public`
        - :page_facing_up: `index.html`
        - :page_facing_up: `bundle.js`
    * :file_folder: `src`
        - :page_facing_up: `index.js`
    - :page_facing_up: `webpack.config.js`

    * commande shell windows:
        - `type nul > webpack.config.js && mkdir public src && cd public && type nul > index.html bundle.js && cd .. && cd src && type nul > index.js && cd ..`
    * commande shell unix:
        - `touch webpack.config.js && mkdir public src && cd public && touch index.html bundle.js && cd .. && cd src && touch index.js && cd ..`
### Installation de Webpack
* `npm install --save-dev webpack@latest webpack-dev-server@latest`
### Configuration de Webpack
* ajouter dans `webpack.config.js`
```js
const webpack = require("webpack");
const path = require("path");
```
* dans index.html
```html
<script src="bundle.js"></script>
```
* dans index.js
```js
document.write("Je débute avec Webpack !");
```
* Installer Webpack de manière globale
`npm install -g webpack@latest`

### Installer un serveur de développement

* `npm install webpack-dev-server --save-dev`
* `npm i -D webpack-cli`
* ajouter dans `webpack.config.js`
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
* ajouter dans `package.json`
```json
"start": "webpack-dev-server -d --hot --config webpack.config.js --watch"
```

### configuration de **iTowns**
* `npm install itowns --save`
* `npm install three --save`
* ajouter dans `index.js`
```js
import * as itowns from 'itowns';`
```
* ajouter dans `index.html`
```html
<div id="viewerDiv"></div>`
```



