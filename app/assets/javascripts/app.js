 (function() {
     function config($stateProvider, $locationProvider, $urlRouterProvider) {
         $locationProvider
             .html5Mode({
                 enabled: true,
                 requireBase: false
             });
         $stateProvider
             .state('home', {
                 url: '/home',
                 controller: 'HomeCtrl as home',
                 templateUrl: '_home.html'
             })
              .state('contact', {
                 url: '/contact',
                 controller: 'ContactCtrl as contact',
                 templateUrl: '_contact.html'
             });
         $urlRouterProvider.otherwise('home');
     }
     angular
         .module('chatbot', ['firebase', 'ui.router', 'templates', 'ngSanitize'])
         .config(config);
 })();