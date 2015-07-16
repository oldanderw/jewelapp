'use strict';
angular.module('jewelApp.controllers')
.controller('PairCtrl',['$scope', '$state', '$timeout', '$logService', '$ionicPlatform', '$cordovaBluetoothle', function($scope, $state, $timeout, $logService, $ionicPlatform, $cordovaBluetoothle){
    $scope.model = {
      status : 'starting...',
      chosenDevice : {},
      devices : [],
      pairing: false,
      isPaired : false,
      deviceChosen : function () {
        return Object.keys($scope.model.chosenDevice).length !== 0;
      }
    };

    $scope.pairToDevice = function(address) {
        $scope.model.pairing = true;
        $logService.LogMessage('chosen device was: ' + JSON.stringify(address));
        $ionicPlatform.ready()
          .then(function () {
            return $cordovaBluetoothle.connect({address: address})
              .then( function (success) {
                $scope.model.status = 'Successfully connected!';
                $scope.model.pairing = false;
                $scope.model.isPaired = true;
                $logService.Log('message', 'successfully connected to: ' + JSON.stringify(success));
              })
              .error(function (err) {
                $scope.model.status = 'Error While Connecting: ' + JSON.stringify(err);
                return $cordovaBluetoothle.disconnect(address);
              });
          })
          .then( function (success) {
            $logService.Log('message', 'paired! Now transitioning: ' + JSON.stringify(success));
            return $state.go('/pair-success');
          });

    };

    var getAvailableDevices = function () {
      var params = {
        request: true,
        name: 'JewelBot'
      };
      $ionicPlatform.ready()
        .then(function () {
          return $cordovaBluetoothle.initialize(params)
            .then(function (initialized) {
              $logService.Log('message', 'initialized: ' + JSON.stringify(initialized));
              $scope.model.status = 'Bluetooth Initialized!';
              return $cordovaBluetoothle.find(params);
            });
        })
        .then(function (data) {
          $scope.model.status = 'Scanning...';
          if (data.status === 'scanResult') {
            $scope.model.status = 'Found device: ' + data.name;
            $logService.Log('message', 'pushing new data: ' + JSON.stringify(data));
            $scope.model.devices.push(data);
            return $cordovaBluetoothle.stopScan();
          }
        }, function (error) {
          $scope.model.status = 'Error while scanning.' + JSON.stringify(error);
          return $cordovaBluetoothle.stopScan();
        }, function (notify) {
          $logService.Log('message', 'still scanning: ' + JSON.stringify(notify));
        })
        .then(function () {
          $scope.model.status = 'ending scan...';
          return $cordovaBluetoothle.isScanning().then(function(isScanning) {
            $logService.Log('message', 'Are we scanning? 2' + JSON.stringify(isScanning));
            $scope.model.status = isScanning ? 'Scan Not Ended' : 'Scan Ended';
          });
        });
    };
    getAvailableDevices();
}])

.controller('RegistrationCtrl', function(){

});
