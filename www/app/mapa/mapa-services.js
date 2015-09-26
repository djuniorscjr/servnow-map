/**
 * Created by Domingos Junior on 25/09/2015.
 */
(function() {
  'use strict';

  angular.module('servnow-map')
    .factory('markerservice', markerservice);

  markerservice.$inject = ['$log', '$http'];

  function markerservice($log, $http){
      return {
        getMarkers : getMarkers
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

  }
})();
