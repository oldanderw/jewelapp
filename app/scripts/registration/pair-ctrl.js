'use strict';
angular.module('jewelApp.controllers')
// '$cordovaBluetoothle', and $cordovaBluetoothle, were here
.controller('PairCtrl',[

  'ionicReady',
  '$logService',
  '$scope',
  '$state',
  '$timeout',
  'DataService',
  '$q',
  function(

  ionicReady,
  $logService,
  $scope,
  $state,
  $timeout,
  DataService,
  $q
  ) {
    $scope.model = {
      status: 'starting...',
      chosenDevice: {},
      devices: [],
      pairing: false,
      isPaired: false,
      offerRetry: false,
      deviceChosen: function() {
        return Object.keys($scope.model.chosenDevice).length !== 0;
      }
    };

    // $scope.pairToDevice = function(address) {
    //
    //     $scope.model.pairing = true;
    //     ionicReady()
    //       .then( function() {
    //         return $cordovaBluetoothle.connect({address: address})
    //           .then( function(success) {
    //             $scope.model.pairing = false;
    //             $scope.model.isPaired = true;
    //             DataService.Pair(success.address);
    //             $scope.NeedsFirmwareUpdate();
    //           })
    //           .error( function(err) {
    //             $scope.model.status = `Error While Connecting: + ${JSON.stringify(err)}`;
    //             $logService.Log(`Error While Connecting: ${JSON.stringify(err)}`);
    //             return $cordovaBluetoothle.disconnect(address); })
    //           .notify( function(notify) {
    //             $logService.Log('message', 'still trying to connect: ' + JSON.stringify(notify));
    //           });
    //       });
    // };

    // $scope.getAvailableDevices = function() {
    //   //TODO: can it filter here instead of in an if statement below?
    //   var params = {};
    //
    //   ionicReady().then( function() {
    //     return $cordovaBluetoothle.initialize();
    //   })
    //   .then( function(data) {
    //     $scope.model.debug += 'init: ' + JSON.stringify(data);
    //     return $cordovaBluetoothle.startScan(params);
    //   })
    //   .then( function(data) {
    //     $scope.model.status = 'Scanning...';
    //     $logService.Log('message', 'scan results: ' + JSON.stringify(data));
    //     for (let i = 0; i < data.length; i++) {
    //       $scope.model.debug += JSON.stringify(data[i]);
    //       if (data[i].status === 'scanResult' &&
    //        data[i].advertisement.isConnectable ) {
    //         var mfg = '';
    //         if (data[i].advertisement.manufacturerData !== null) {
    //           try {
    //             mfg = $cordovaBluetoothle
    //             .encodedStringToBytes(
    //               data[i]
    //               .advertisement
    //               .manufacturerData
    //             );
    //           }
    //           catch (err) {
    //             $logService.Log('error',
    //             `Error attempting to decode manufacturerData: ${JSON.stringify(err)}`);
    //             $scope.model.debug += ' --- ' + JSON.stringify(err) + '---';
    //           }
    //           $scope.model.status += '---Found device: ' + data[i].name + ' : ' + mfg;
    //           $scope.model.devices.push(data[i]);
    //         }
    //       }
    //     }
    //     if ($scope.model.devices.length === 0) {
    //       $scope.model.offerRetry = true;
    //       $scope.model.error = "We couldn't find your Jewelbot! Please make sure your Jewelbot is turned on, in pairing mode, and near your mobile device."
    //     }
    //     return $cordovaBluetoothle.stopScan();
    //   })
    //   .catch(function(err) {
    //     if (err.error === 'enable') {
    //       $scope.model.error = 'Please enable bluetooth on your mobile device and try again.';
    //     } else {
    //       $logService.Log('error',
    //       `Error Getting Available Devices: ${JSON.stringify(err)}`);
    //       $scope.model.debug = JSON.stringify(err);
    //       $scope.model.error = 'There was an error trying to find your Jewelbot. Please make sure your Jewelbot is turned on, in pairing mode, and near your mobile device.';
    //     }
    //     $scope.model.offerRetry = true;
    //     return $cordovaBluetoothle.stopScan();
    //   });
    // };

    $scope.init = function() {
      try {
        if (!DataService.IsPaired()) {
          $scope.getAvailableDevices();
        }else {
          $scope.model.status = 'Already Paired: ' + $scope.model.chosenDevice;
          return $state.go('friends');
        }
      }
      catch (err) {
        $logService.Log('error',
         `error trying to getAvailableDevices: ${JSON.stringify(err)}`);
        $scope.model.debug = JSON.stringify(err);
        $scope.model.error = 'There was an error trying to get a device. Please make sure your Jewelbot is turned on, in pairing mode, and near your mobile device.';
        $scope.model.offerRetry = true;
      }
    };

    // $scope.retry = function() {
    //   $scope.model.error = '';
    //   $scope.model.offerRetry = false;
    //   $scope.getAvailableDevices();
    // };
    // $scope.NeedsFirmwareUpdate = function() {
    //   const deviceId = DataService.GetDeviceId();
    //   const params = {address: deviceId};
    //
    //   const result = $cordovaBluetoothle.initialize({'request': true})
    //    .then( function(response) {
    //     $logService.Log(response);
    //     return $timeout($cordovaBluetoothle.connect({address: deviceId}));
    //   })
    //   .then(function(response) {
    //     $logService.Log(response);
    //     return $cordovaBluetoothle.services({address: deviceId});
    //   })
    //   .then( function(response) {
    //     $logService.Log(response);
    //     return $cordovaBluetoothle.characteristics({address: deviceId,
    //       service: '180A'});
    //   })
    //   .then( function(response) {
    //     $logService.Log(response);
    //     return $cordovaBluetoothle.read({address: DataService.GetDeviceId(),
    //       service: '180A', characteristic: '2A26'});
    //   })
    //   .then(function(response) {
    //     const versionBytes = $cordovaBluetoothle
    //     .encodedStringToBytes(response.value);
    //     const version = $cordovaBluetoothle.bytesToString(versionBytes);
    //     // TODO: when this is workable, check against server version
    //     // to kick off DFU process as necessary
    //     // it also makes sense to check against a minimum firmware version
    //     // before app DFU is implemented to warn them to upgrade
    //     // but this can't be done until 2a26 broadcasts appropriately
    //     // so obviously this would need to be updated to not hardcode a ver #
    //     $logService.Log(`actual version: ${version}`);
    //     $logService.Log(`version: ${DataService.FirmwareUpdateRequired(version)}`);
    //     //version = 0;
    //     if (DataService.FirmwareUpdateRequired(version)) {
    //       $logService.Log('returned true');
    //       return $state.go('needs-update');
    //
    //     } else {
    //       $logService.Log('returned false');
    //       return $state.go('friends-list');
    //     }
    //   })
    //   .catch( function(err) {
    //     $logService.Log('error',
    //      `failed getFirmware Revision: ${JSON.stringify(err)}`);
    //   });
    // };
    $scope.init();
  }]);
