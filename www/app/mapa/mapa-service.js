/**
 * Created by Domingos Junior on 25/09/2015.
 */
(function() {
  'use strict';

  angular.module('servnow-map')
    .factory('markerservice', markerservice);

  markerservice.$inject = ['$log', '$http', '$cordovaGeolocation','$ionicLoading'];

  function markerservice($log, $http, $cordovaGeolocation, $ionicLoading){
      return {
        getMarkers : getMarkers,
        getCurrentLocation : getCurrentLocation
      }

      function getMarkers() {
        return $http.get('https://rawgit.com/allenhwkim/angularjs-google-maps/master/testapp/scripts/markers.js')
          .then(getMarkersComplete)
          .catch(getMarkersFailed);

          function getMarkersComplete(response){
            return response.data.results;
          }

          function getMarkersFailed(error){
            $log.error('Error: ' + error);
          }
      }

      function getCurrentLocation(){
        var options = {
          timeouts: 10000,
          enableHighAccuracy: false
        };
        return $cordovaGeolocation.getCurrentPosition(options)
          .then(getCurrentLocationComplete)
          .catch(getCurrentLocationFailed);

          function getCurrentLocationComplete(postion){
            return postion;
          }

          function getCurrentLocationFailed(err){
            $log.error('Error: ' + error);
            return [];
          }
      }
  }
})();
