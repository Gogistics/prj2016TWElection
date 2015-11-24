/* angularjs handler */
(function($){
  'use strict';
  //
  var injected_modules = ['ngResource', 'ngRoute'],
      app = angular.module('myApp', injected_modules, function($interpolateProvider){
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
      controller: 'IndexCtrl'
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
      var request_info = $.param({
        'request_info': JSON.stringify(arg_request_info, 2, 2)
      });

      // requet promise
      var request_promise = $http({
        url: '/services/get_tweets_summary',
        method: 'POST',
        data: request_info,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      });

      return request_promise;
    }
  }
  AppService.$injector = ['$http', 'DICT'];
  app.service('AppService', AppService);
  // end of services

  // controllers
  var TextAnalysisController = function($scope, $sce, AppService){
    var _this = this;
    // set data
    $scope.tweets = [{title: 'tweet-1'}, { title: 'tweet-2'}];
    window.scope = $scope;
    $scope.changeListName = function(name) {
      alert(name);
    };
    //
    _this.get_tweets_summary = function(arg_request_info){
      //
      AppService.get_tweets_summary(arg_request_info).success(function(results){
        //
        $scope.tweets_summary = results;
      });
    }

    _this.get_tweets_summary({user_key: 'cdRBrbrnSDchthsDFTYsaU'});
  }
  TextAnalysisController.$injector = ['$scope','$sce', 'AppService'];
  app.controller('IndexCtrl', TextAnalysisController);
  // end of controllers

})(jQuery);