'use strict';
angular.module('jewelApp.controllers')
.controller('HomeCtrl',['$scope', '$window', '$state', 'DataService',  function($scope, $window, $state, DataService) {
    $scope.isPaired = function() {
      if (!DataService.IsPaired()) {
        $state.go('pair');
      }
      else {
        $state.go('dashboard');
      }
    };

}])
.controller('DashboardCtrl', ['$scope', '$state', '$ionicPlatform', '$cordovaContacts', '$logService', 'UserService', function($scope, $state, $ionicPlatform, $cordovaContacts, $logService, UserService) {
    $scope.hasFriends = function() {
      $logService.Log('message', 'entering has friends');
      return UserService.HasFriends();
    };
    $scope.contacts = [];
    $scope.findFriendsToAdd = function(color) {
      try {
        $logService.Log('message', 'entering find Friends?' + JSON.stringify(color));
        $ionicPlatform.ready().then(function () {
          $logService.Log('message', 'entering we are ready in ionicPlatform');
          $cordovaContacts.find({fields: ['givenName', 'familyName', 'phoneNumbers']}).then(function (contactPicked) {
            $scope.contacts = _.map(contactPicked, function(p) {
              return {
                givenName: p.givenName,
                familyName: p.familyName.charAt(0)
              };
            }, 'id');
            $logService.Log('message', 'contact picked: ' + JSON.stringify(contactPicked));
            $logService.Log('message', 'contacts chosen were:' + JSON.stringify($scope.contacts));
          });
        });
      }
      catch (err) {
        $logService.Log('error', err);
      }
    };

}]);
