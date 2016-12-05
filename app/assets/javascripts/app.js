 (function() {
     function Scrollup($rootScope){
       $rootScope.$on('$stateChangeSuccess',function(){
           $("html, body").animate({ scrollTop: 0 }, 200);
       })      
     };
     function config($stateProvider, $locationProvider, $urlRouterProvider, $provide) {
         $locationProvider
             .html5Mode({
                 enabled: true,
                 requireBase: false
             });
         $stateProvider
             .state('home', {
                 url: '/',
                 controller: 'HomeCtrl as home',
                 templateUrl: '_home.html'
             })
              .state('contact', {
                 url: '/contact',
                 controller: 'PortfolioCtrl as portfolio',
                 templateUrl: '_contact.html'
             })
             .state('portfolio/blocipedia', {
                 url: '/portfolio/blocipedia',
                 controller: 'PortfolioCtrl as portfolio',
                 templateUrl: 'portfolio/_blocipedia.html'
             })
             .state('portfolio/blocjamsang', {
                 url: '/portfolio/blocjamsang',
                 controller: 'PortfolioCtrl as portfolio',
                 templateUrl: 'portfolio/_blocjamsang.html'
             })
             .state('portfolio/alexa', {
                 url: '/portfolio/alexa',
                 controller: 'PortfolioCtrl as portfolio',
                 templateUrl: 'portfolio/_alexa.html'
             })
             .state('portfolio/chatbot', {
                 url: '/portfolio/chatbot',
                 controller: 'PortfolioCtrl as portfolio',
                 templateUrl: 'portfolio/_chatbot.html'
             })
             .state('portfolio/pdfs', {
                 url: '/portfolio/pdfs',
                 controller: 'PortfolioCtrl as portfolio',
                 templateUrl: 'portfolio/_pdfs.html'
             })
             .state('quota', {
                 url: '/portfolio/quota',
                 controller: 'PortfolioCtrl as portfolio',
                 templateUrl: 'portfolio/_quota.html'
             });
         $urlRouterProvider.otherwise('home');
     }
     angular
         .module('chatbot', ['firebase', 'ui.router', 'templates', 'ngSanitize', 'ngAnimate'])
         .run(['$rootScope', Scrollup])
         .config(config);
 })();