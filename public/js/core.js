/* 
 * /public/core.js
 *
 * Now that we have moved our controller and services out of core.js and into
 * their own modules, we have to inject them into our main application module.
 *
 * Have one module: albumApp that we inject our controller and service.
*/

(function () {
    'use strict';

    var albumApp = angular.module('albumApp', ['ui.router', 'ngMaterial', 'ngAnimate', 'ngAria']);


    // ============================= Theme Config =============================
    albumApp.config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('amber')
            .accentPalette('brown');
    });

    
    // ================================ Routing ===============================
    albumApp.config(function ($stateProvider, $urlRouterProvider) {
        
        $urlRouterProvider.otherwise('/home');

        $stateProvider

            .state('home', {
                url: '/home',
                templateUrl: 'partials/home.html',
                controller: 'homeController'
            })
        
            .state('settings', {
                url: '/settings',
                templateUrl: 'partials/settings.html',
                controller: 'settingsController'
            });
    });

    
    // =============================== Services ===============================
    albumApp.factory('Albums', function ($http) {
        
        var getResponse = {};
        
        return {

            get : function () {
                return $http.get('/api/albums');
            },
            
//            get : function () {
//                $http.get('/api/albums')
//                    .then(function successCallback(response) {
//                        getResponse = response;
//                    }, function errorCallback(err) {
//                        console.log('Error: ' + err);
//                    });
//            },

            create : function (albumData) {
                return $http.post('api/albums', albumData);
            },

            delete : function (id) {
                return $http.delete('api/albums/' + id);
            },

            update : function (id, updateData) {
                return $http.put('api/albums/' + id, updateData);
            },
            
            getGetResponse : function () {
                return getResponse;
            }
            
        };
    });

    
    // ============================== Controllers =============================
    albumApp.controller('homeController', ['$scope', 'Albums', '$http', '$mdToast', '$mdSidenav', function ($scope, Albums, $http, $mdToast, $mdSidenav) {
        
        // UTILITY METHODS
        $scope.openSidebar = function () {
            $mdSidenav('left').open();
        };

        $scope.closeSidebar = function () {
            $mdSidenav('left').close();
        };

        var showToast = function (message) {
            $mdToast.show(
                $mdToast.simple()
                    .content(message)
                    .position('top right')
                    .hideDelay(3000)
            );
        };

        // SOME SETUP
        $scope.formData = {};
        $scope.updateData = {};
        $scope.buttonDisabled = false; // button enabled at first hit

        // GET ====================================================================
        // when landing on the page, get and show all albums.
        // use our service to get them
        Albums.get()
            .success(function (data) {
                $scope.albums = data;
                showToast('Database connected');
            });
        
//        Albums.get()
//            .success(function () {
//                $scope.albums = Albums.getGetResponse;
//                showToast('Database connected');
//            });

        // CREATE =================================================================
        // when submitting the add form, send the text to the Node API
        // creative form validation...
        $scope.createAlbum = function () {
            $scope.buttonDisabled = true; // button disabled unless...
            if ($scope.formData.albumName.length) { // ... some text is entered.

                // call the create function from our service (returns a promise object)
                Albums.create($scope.formData)

                    // if successful, call our get function to get all albums
                    .success(function (data) {
                        $scope.albums = data; // assign our new list of albums
                    })

                    .error(function (data) {
                        console.log("Error");
                        console.log(data);
                    })

                    .finally(function (data) {
                        $scope.formData = {}; // clear form; ready for new data
                        $scope.buttonDisabled = false; // now we can enable button again
                        $scope.closeSidebar();
                        showToast('Album created');
                    });
            }
        };

        // DELETE =================================================================
        // delete an album
        $scope.deleteAlbum = function (id) {
            Albums.delete(id)
                .success(function (data) {
                    $scope.albums = data; // get all albums on success
                    showToast('Album deleted');
                });
        };

        // UPDATE =================================================================
        // updates an existing album
        $scope.updateAlbum = function (id) {

            // call the update function from our service (returns a promise object)
            Albums.update(id, $scope.updateData)

                // if successful, call our get function to get all albums
                .success(function (data) {
                    $scope.albums = data; // assign our new list of albums
                    console.log(data);
                })

                .error(function (data) {
                    console.log("Error");
                    console.log(data);
                })

                .finally(function (data) {
                    $scope.updateData = {}; // clear form; ready for new data
                    $scope.updateButtonDisabled = false; // now we can enable button again
                    $scope.closeSidebar();
                    showToast('Album updated');
                });
        };

    }]);
    
    albumApp.controller('settingsController', ['$scope', function ($scope) {
        
        $scope.message = 'Settings page, holmes!';
        
    }]);


    // =============================== Directives =============================
    albumApp.directive('leftSideNav', function () {
        return {
            restrict: 'AE',
            templateUrl: 'templates/left-sidenav.html',
            replace: true
        };
    });
    
    albumApp.directive('albumList', function () {
        return {
            restrict: 'AE',
            templateUrl: 'templates/album-list.html',
            replace: true
        };
    });

    
})();