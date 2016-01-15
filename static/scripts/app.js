'use strict';

var app=angular.module('pokerCasino', [
	'ngRoute'
])
.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/casino'
      })
      .when('/casino', {
        templateUrl: '/static/views/casino.html',
        controller: 'casinoController',
        resolve: {
          userSeated: function(User) {
            User.getUserTable('casino');
          }
        }
      })
      .when('/table/:tableId', {
        templateUrl: '/static/views/table.html',
        controller: 'tableController',
        resolve: {
          userSeated: function(User) {
            User.getUserTable('table');
          }
        }
      })
      .when('/player/:cameFrom/:tableId', {
        templateUrl: '/static/views/player.html',
        controller: 'playerController',
      })
      .otherwise({
        redirectTo: '/casino'
      });
  }).run(['$rootScope', '$location', function($rootScope, $location) {
    $rootScope.$on('$routeChangeError', function(event, next, previous, error) {
      $location.path('/casino');
    });
}]);