/**
 * Created by Domingos Junior on 24/09/2015.
 */
(function () {
  'use strict';

  angular.module('servnow-map')
    .controller('mapaCtrl', mapaCtrl);

  mapaCtrl.$inject = ['$scope', '$timeout', '$ionicPlatform', '$ionicLoading', '$cordovaGeolocation', 'markerservice', '$log'];

  function mapaCtrl($scope, $timeout, $ionicPlatform, $ionicLoading, $cordovaGeolocation, markerservice, $log) {
    var ctrl = this;
    var map;

    ctrl.markers = [];
    ctrl.dynMarkers = [];
    ctrl.markers = markers;
    getLocation();

    $scope.$on('mapInitialized', function (event, evtMap) {
      map = evtMap;
      ctrl.map = map;
      angular.forEach(ctrl.markers, function (mar) {

        var latLng = new google.maps.LatLng(mar.position[0], mar.position[1]);

        var marker = new google.maps.Marker({
          position: latLng,
          icon: 'img/coffee-marker.png',
          customInfo: mar.photo
        });

        google.maps.event.addListener(marker, "click", function (event) {
          map.setCenter(marker.getPosition());
          console.log(marker.customInfo);
          ctrl.image = marker.customInfo;
          map.scope.showInfoWindow.apply(this, [event, 'marker-info'])
        });
        ctrl.dynMarkers.push(marker);
      });

      $scope.markerClusterer = new MarkerClusterer(map, ctrl.dynMarkers, {});

      getCurrentPosition();

    });

    function getCurrentPosition() {
      $ionicPlatform.ready(function () {
        $ionicLoading.show({
          template: 'Carregando sua posição...'
        });

        if(ctrl.location == []){
          $ionicLoading.hide();
          $ionicLoading.show({
            template: 'Error!! GPS desativado!'
          });

          $timeout(function () {
            $ionicLoading.hide();
          }, 3000);
        }else {
          ctrl.latitude = ctrl.location.coords.latitude;
          ctrl.longitude = ctrl.location.coords.longitude;
          $ionicLoading.hide();
        }
      });
    }

    function loadingAllMarkers() {
      return getMarkers.then(function () {
        $log.info('Ativo!!');
      });
    }

    function getMarkers() {
      return markerservice.getMarkers()
        .then(function (data) {
          ctrl.markers = data;
          return ctrl.markers;
        });
    }

    function getLocation(){
      return markerservice.getCurrentLocation()
        .then(function (data) {
          ctrl.location = data;
          return ctrl.location;
        });
    }

  }
})();
