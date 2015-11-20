/**/
'use strict';
(function($){
  //
  var injected_modules = ['ngResource', 'ngRoute'],
      app = angular.module('my_ng_text_analysis', injected_modules, function($interpolateProvider){
        // in this app, this step is not necessarary
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.startSymbol('[[');
      });

  // ng-router ; all url start with predefined url in main.js and orginal route ; in this case / point to /analysis/text_analysis
  app.config(['$routeProvider', function($routeProvider){
    //
    $routeProvider.when('/',{
      //
      templateUrl: '/public/my_ng_html_templates/text_analysis.html',
      controller: 'IndexCtrl'
    }).otherwise({
      redirectTo: '/'
    });
  }]);

  // ng-controller
  app.value('DICT',{
    MY_EMAIL : 'gogistics@gogistics-tw.com'
  })
  .service('AppService', AppService)
  .controller('IndexCtrl', IndexController);

  /* controllers and services */
  // services
  AppService.$injector = ['$http', 'DICT'];
  function AppService($http, DICT){
    //
    var _this = this;
  }

  // controllers
  IndexController.$injector = ['$scope','$sce', 'AppService'];
  function IndexController($scope, $sce, AppService){
    //
    $scope.tweets = [{title: 'tweet-1'}, { title: 'tweet-2'}, {title: 'tweet-3'}, {title: 'tweet-4'}, {title: 'tweet-5'}];
  }
})(jQuery);