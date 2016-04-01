'use strict';

/**
 * @ngdoc overview
 * @name twentyfortyeightApp
 * @description
 * # twentyfortyeightApp
 *
 * Main module of the application.
 */
angular
  .module('twentyfortyeightApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
