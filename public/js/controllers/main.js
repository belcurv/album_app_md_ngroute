/*
 * js/controllers/main.js
 */

(function () {
    'use strict';

    angular.module('albumController', [])

    // inject the Albums service factory into our controller
        .controller('mainController', function ($scope, $http, Albums, $mdSidenav, $mdToast, $mdBottomSheet) {
        
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
        
//            $scope.openBottomSheet = function () {
//                $mdBottomSheet.show({
//                    templateUrl: 'bottom-sheet.html',
//                    controller: 'bottomSheet',
//                    clickOutsideToClose: true
//                });
//            };

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

        }); // ends mainController

})();