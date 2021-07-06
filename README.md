# hackAIR mobile app

## Deprecation notice
This is an old version of the hackAIR mobile app, and is not actively supported.

## Description
The hackAIR mobile app (available both in Android and iOS) enables citizens to get convenient access to easy-to-understand air quality information, contribute to measurements by either connecting to a hackAIR compliant open sensor (via Bluetooth or USB), or by taking and uploading sky-depicting photos and receive personalised information on their everyday activities such as traveling, commuting and sports activities.
The app has been developed using the Ionic Framework v1.

## Installation
#### You will need both `ionic` and `cordova` installed globally via npm:
- `npm install -g ionic cordova@7.0` (Later versions of Cordova have problems with plugin installation on Windows)

- clone this repository
- `npm install`
- `bower install`
- `ionic state restore`
- `ionic serve`

## Project Style
The project is based on [John Papa's styling guide](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md).

The following changes have been made to the proposed file structure so that it
remains compatible with the Ionic framework:
- App code remains in the ```www``` folder.
- Bower components are stored in the ```www/lib``` folder.

The basic structure is shown below:
- www
  - app
    - core
      - config.js
      - core.module.js
      - core.route.js
      - router
      - logger
      - exception
    - componentX
      - componentX.html
      - componentX.controller.js
      - componentX.route.js
      - componentX.service.js
      - componentX.directive.js
      - componentX.scss
    - app.module.js  
  - scss
  - css
  - img
  - lib
  - index.html

## License
The hackAIR mobile app is licensed under the AGPL v3 licence. You may obtain a copy of the license [here](https://www.gnu.org/licenses/agpl-3.0.en.html).

## Credits
The hackAIR mobile app was created under the scope of hackAIR EU Horizon 2020 Project.
