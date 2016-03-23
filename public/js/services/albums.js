/*
 * js/services/albums.js
 * 
 * Purpose: interact with our Node API.
 * All the code to get, create, update & delete albums resides in this service.
 *
 * There are many different ways to declare a service.
 * Below we define our service using .factory with four different functions.
 * get, create, update, & delete all return promise objects that we can use in
 * our controller.
*/

angular.module('albumService', [])
  
  .factory('Albums', function ($http) {
    return {

      get : function() {
        return $http.get('/api/albums');
      },
      
      create : function (albumData) {
        return $http.post('api/albums', albumData);
      },
      
      delete : function (id) {
        return $http.delete('api/albums/' + id);
      },
      
      update : function (id, updateData) {
        return $http.put('api/albums/' + id, updateData);
      }
      
    };
});