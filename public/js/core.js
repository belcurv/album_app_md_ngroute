/* 
 * /public/core.js
 *
 * Now that we have moved our controller and services out of core.js and into
 * their own modules, we have to inject them into our main application module.
 *
 * Have one module: albumApp that we inject our controller and service.
*/

angular.module('albumApp', ['ngMaterial', 'ngAnimate', 'ngAria', 'albumController', 'albumService'])

    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('amber')
            .accentPalette('brown');
    });