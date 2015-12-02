/*
*  do not use 
*/
(function($){
  'use strict';
  //
  var injected_modules = ['ngResource', 'ngRoute'],
      app = angular.module('myAnalysisCalendar', injected_modules, function($interpolateProvider){
        // in this app, this step is not necessarary
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
      });

  // ng-router ; all url start with predefined url in main.js and orginal route ; in this case / point to /analysis/text_analysis
  app.config(['$routeProvider', function($routeProvider){
    // route provider
    $routeProvider.when('/',{
      //
      templateUrl: '/public/my_ng_html_templates/text_analysis.html',
      controller: 'CalendarCtrl'
    }).otherwise({
      redirectTo: '/'
    });
  }]);

  // ng-value
  app.value('DICT',{
    MY_EMAIL : 'gogistics@gogistics-tw.com'
  });

  /* ng-controllers and ng-services */
  // services
  var AppService = function($http, DICT){
    //
    var _this = this;
    _this.get_tweets_summary = function(arg_request_info){
      // request info
    }
  }
  AppService.$injector = ['$http', 'DICT'];
  app.service('AppService', AppService);
  // end of services

  // controllers
  var CalendarController = function($scope, $sce, AppService){
    var _this = this;
    // set data
    var get_random_int = function(){
      //
      return Math.floor(Math.random() * 10 + 1);
    }
    $scope.tweets = [{title: 'tweet-1'}, { title: 'tweet-2'}, { title: 'tweet-3'}];

    //
    _this.periodically_update_data = function(){
      
      $scope.$apply(function(){
        //
        if($scope.tweets && $scope.tweets.length !== 0){
          for(var ith in $scope.tweets){
            //
            $scope.tweets[ith]['title'] = 'tweet-' + get_random_int();
          }
        }
      });
      setTimeout(_this.periodically_update_data, 1000);
    }
    
    //
    setTimeout(_this.periodically_update_data, 1000);

  }
  CalendarController.$injector = ['$scope','$sce', 'AppService'];
  app.controller('CalendarCtrl', CalendarController);
  // end of ng-controllers
})(jQuery);