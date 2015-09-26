/**
 * Created by Domingos Junior on 24/09/2015.
 */
(function() {
  'use strict';

angular.module('servnow-map')
  .controller('mapaCtrl', mapaCtrl);

  mapaCtrl.$inject = ['$scope', '$timeout', '$ionicPlatform', '$ionicLoading', '$cordovaGeolocation', 'markerservice', '$log'];

  function mapaCtrl($scope, $timeout, $ionicPlatform, $ionicLoading, $cordovaGeolocation, markerservice, $log){
    var ctrl = this;
    var map;

    ctrl.nameApplication = "Mapa servnow!!";
    ctrl.markers = [];
    ctrl.dynMarkers = [];

    ctrl.markers = markers;


    $scope.$on('mapInitialized', function(event, evtMap) {
      map = evtMap;
      angular.forEach(ctrl.markers, function(mar){
        var latLng = new google.maps.LatLng(mar.position[0], mar.position[1]);
        var marker = new google.maps.Marker({position:latLng, customInfo: "Marker " + mar.photo});

        google.maps.event.addListener(marker,"click", function(event) {
          console.log(event);
          console.log(marker);
        });
        ctrl.dynMarkers.push(marker);
      });

      $scope.markerClusterer = new MarkerClusterer(map, ctrl.dynMarkers, {});

      getCurrentPosition();

    });

    function getCurrentPosition(){
      $ionicPlatform.ready(function(){
        $ionicLoading.show({
          content: 'Carregando posição...',
          showBackdrop: false
        });

        var options = {
          timeouts: 10000,
          enableHighAccuracy: false
        };

        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
          ctrl.latitude = position.coords.latitude;
          ctrl.longitude = position.coords.longitude;
          ctrl.accuracy = position.coords.accuracy;
          ctrl.dataReceived = true;
          $ionicLoading.hide();
        }, function (err) {
          $ionicLoading.hide();
          $ionicLoading.show({
            content: 'Error!! ' + err,
            showBackdrop:false
          });

          $timeout(function () {
            $ionicLoading.hide();
          }, 3000);
        });
      });
    }

    function loadingAllMarkers() {
      return getMarkers.then(function() {
        $log.info('Ativo!!');
      });
    }

    function getMarkers() {
      return markerservice.getMarkers()
        .then(function(data) {
          ctrl.markers = data;
          return ctrl.markers;
        });
    }
  }
})();
