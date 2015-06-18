'use strict';
angular.module('jewelApp.services')//Todo: Implement Parse.com calls
.factory('JewelbotService',['$ionicPlatform', '$cordovaBluetoothle', '$timeout', '$logService',  function($ionicPlatform, $cordovaBluetoothle, $timeout, $logService) {
    var service = {
        IsPaired : function() {
            return false; //STUB; replace with Parse.com call. toggle to manually test different states.
        },
        GetAppId : function (stubId) {
          return stubId || '';
        },
        SetAppId : function () {
          //stub call to local storage and Parse.
        },
        IsInitialized : function (params) {
          $logService.LogMessage('entering IsInitialized' + JSON.stringify(params));
          $cordovaBluetoothle.isInitialized(params).then(function(result){
            $logService.LogMessage('Checking initialization :' + JSON.stringify(result));
            return result.enabled === true;
          });
        },
        Initialize : function (params) {
          $logService.LogMessage('initializing' + JSON.stringify(params));

        },
        GetDevices : function (params) {
          $ionicPlatform.ready(function () {
            params.request = true;
            $logService.LogMessage('Entering initalization');
            if (!service.IsInitialized()) {
              $logService.LogMessage('ble initialized:\n' + JSON.stringify(params));
              $cordovaBluetoothle.initialize(params).then(function(result) {
                $logService.LogMessage('result of Initialize: ' + JSON.stringify(result));
                return service.ScanDevices(params);
              });
            }
            $logService.LogMessage('is Initialized');
            return service.ScanDevices(params);
          });
        },
        ScanDevices : function (params) {
          $logService.LogMessage('entered scannning devices');
            return $cordovaBluetoothle.startScan(params);
        },
        Pair : function (device) {
          var result = $cordovaBluetoothle.initialize({'request': true})
          .then(function (response) {
            $logService.LogMessage('Response was: ' + JSON.stringify(response));
            if (response.status === 'enabled') {
              var connected = $timeout($cordovaBluetoothle.connect({'address': device.address})
                .then(function (connectedResponse) {
                  $logService.LogMessage('connected!: ' + JSON.stringify(connectedResponse));
                  return true;
                },
                function (failed) {
                  $logService.LogMessage('failed to pair: ' + JSON.stringify(failed));
                  return false;
                }) , 15000);
              $logService.LogMessage('JSON Connected: ' + JSON.stringify(connected));
            }
          });
          return result;
      }
    };
    return service;
}]);
