import moment from 'moment';
import { uiModules } from 'ui/modules';
import uiRoutes from 'ui/routes';

import 'ui/autoload/styles';
import './less/main.less';
import template1 from './templates/index.html';
import template2 from './templates/addTask.html';
import template3 from './templates/addHost.html';

uiRoutes.enable();
uiRoutes
  .when('/', {
    template : template1,
    controller : 'logpeckInit',
  })
  .when('/addTask', {
    template : template2,
    controller : 'logpeckInit',
  })
  .when('/addHost', {
    template : template3,
    controller : 'logpeckInit',
  });

var host_ip="";
var task_ip_exist=false;
var task_ip=[];
uiModules
.get('app/logpeck', [])
.controller('logpeckInit',function ($scope ,$rootScope,$route, $http) {
  //初始化
  $http({
    method: 'POST',
    url: '../api/logpeck/init',
  }).then(function successCallback(response) {
    var new_arr = [];
    for (var id=0 ; id<response['data']['hits']['total'] ; id++) {
      new_arr.push(response['data']['hits']['hits'][id]['_source']['ip']);
    }
    if(host_ip!=""){
      new_arr.push(host_ip);
      host_ip="";
    }
    if(task_ip_exist!=false){
      $scope.T_array=task_ip;
      $scope.visible=true;
      task_ip_exist=false;
      task_ip=[];
    }
    else {
      $scope.T_array = [];            //index:   tasklist
      $scope.visible = false;
    }
    $scope.T_IpList=new_arr;     //index and addhost:   hostlist
    $scope.IP="";                //addhost:   input IP
    $scope.Name="";
    $scope.LogPath="";
    $scope.Hosts="";
    $scope.Index="";
    $scope.Type="";
    $scope.Mapping="";
    $scope.Fields="";
    $scope.Delimiters="";
    $scope.FilterExpr="";
    $scope.LogFormat="";
  }, function errorCallback() {
  });


  //list task
  $scope.listTask = function ($event) {
    $rootScope.T_ip=event.target.getAttribute('name');
    console.log($rootScope.T_ip);
    $http({
      method: 'POST',
      url: '../api/logpeck/list',
      data: {ip: event.target.getAttribute('name')},
    }).then(function successCallback(response) {
      $scope.indexLog ='';
      if(response['data'][0]['result']==undefined) {
        $scope.visible = true;
        var new_arr = [];
        if (response['data'][0]['null'] != "true") {
          var name;
          var stat;
          var start;
          var logpath;
          for (var id = 0; id < response['data'].length; id++) {
            name=response['data'][id]['Name'];
            logpath=response['data'][id]['LogPath'];
            stat=response['data'][id]['Stop'];
            start=!stat;
            console.log(stat);
            console.log(start);
            new_arr.push({name:name,logpath:logpath,stop:stat,start:start});
          }
        }
        $scope.T_array = new_arr;
        console.log($scope.T_array);
      }
      else{
        $scope.indexLog =response['data'][0]['result'];
      }
    }, function errorCallback(err) {
      console.log('err');
    });
  };

  //startTask
  $scope.startTask = function ($event) {
    var key=event.target.getAttribute('name');
    $http({
      method: 'POST',
      url: '../api/logpeck/start',
      data: {name: $scope.T_array[key]['name'],ip: $rootScope.T_ip},
    }).then(function successCallback(response) {
      $scope.indexLog ='';
      if(response['data'][0]['result']!="Start Success"){
        $scope.indexLog =response['data'][0]['result'];
       // $scope.T_array[]
      }
      else{
        $scope.T_array[key]['stop']=false;
        $scope.T_array[key]['start']=true;
      }
    }, function errorCallback() {
    });
  };


  //stopTask
  $scope.stopTask = function ($event) {
    var key=event.target.getAttribute('name');
    $http({
      method: 'POST',
      url: '../api/logpeck/stop',
      data: {name: $scope.T_array[key]['name'],ip: $rootScope.T_ip},
    }).then(function successCallback(response) {
      $scope.indexLog ='';
      if(response['data'][0]['result']!="Stop Success"){
        $scope.indexLog =response['data'][0]['result'];
      }
      else{
        $scope.T_array[key]['stop']=true;
        $scope.T_array[key]['start']=false;
      }
    }, function errorCallback() {
    });
  };


  //removeTask
  $scope.removeTask = function ($event) {
    $http({
      method: 'POST',
      url: '../api/logpeck/remove',
      data: {name: event.target.getAttribute('name'),ip: $rootScope.T_ip},
    }).then(function successCallback(response) {
      $scope.indexLog ='';
      $scope.visible=true;
      if(response['data'][0]['result']==undefined) {
        var new_arr = [];
        if (response['data'][0]['null'] != "true") {
          var name;
          var stat;
          var start;
          var logpath;
          for (var id = 0; id < response['data'].length; id++) {
            name=response['data'][id]['Name'];
            logpath=response['data'][id]['LogPath'];
            stat=response['data'][id]['Stop'];
            start=!stat;
            new_arr.push({name:name,logpath:logpath,stop:stat,start:start});
          }
        }
        $scope.T_array = new_arr;
      }
      else{
        $scope.indexLog =response['data'][0]['result'];
      }
    }, function errorCallback() {
    });
  };

  $scope.addTask = function () {
    if ($rootScope.T_ip == ""||$rootScope.T_ip ==undefined) {
      $scope.addTaskResult = "IP is not complete";
    }
    else if($scope.Name==""||$scope.LogPath==""||$scope.Hosts==""||$scope.Index==""||$scope.Type==""){
      $scope.addTaskResult = "filed is not complete";
    }
    else {
      $http({
        method: 'POST',
        url: '../api/logpeck/addTask',
        data: {
          name: $scope.Name,
          logpath: $scope.LogPath,
          hosts: $scope.Hosts,
          index: $scope.Index,
          type: $scope.Type,
          Mapping: $scope.Mapping,
          Fields: $scope.Fields,
          Delimiters: $scope.Delimiters,
          FilterExpr: $scope.FilterExpr,
          LogFormat: $scope.LogFormat,
          ip: $rootScope.T_ip
        },
      }).then(function successCallback(response) {
        if(response['data'][0]['result']==undefined) {
          var new_arr = [];
          if (response['data'][0]['null'] != "true") {
            var name;
            var stat;
            var start;
            var logpath;
            for (var id = 0; id < response['data'].length; id++) {
              name=response['data'][id]['Name'];
              logpath=response['data'][id]['LogPath'];
              stat=response['data'][id]['Stop'];
              start=!stat;
              new_arr.push({name:name,logpath:logpath,stop:stat,start:start});
            }
          }
          $scope.T_array = new_arr;
          task_ip = new_arr;
          task_ip_exist = true;
          window.location.href = "#/";
        }
        else {
          $scope.addTaskResult =response['data'][0]['result'];
        }
      }, function errorCallback() {
      });
    }
  };

  $scope.addHost = function () {
    if ($scope.IP == ""||$scope.IP==undefined) {
      $scope.addHostResult = "host not exist";
    }
    else{
      $http({
        method: 'POST',
        url: '../api/logpeck/addHost',
        data: {ip: $scope.IP},
      }).then(function successCallback(response) {
        if (response['data'][0]['result'] == "Add success") {
          host_ip=$scope.IP;
          $scope.addHostResult = response['data'][0]['result'];
          window.location.href="#/";
        }
        else{
          $scope.addHostResult = response['data'][0]['result'];
        }
      }, function errorCallback() {
      });
    }
  };

  $scope.removeHost = function ($event) {
    $http({
      method: 'POST',
      url: '../api/logpeck/removeHost',
      data:{ip: event.target.getAttribute('name')},
    }).then(function successCallback(response) {
      $scope.indexLog ='';
      if(response['data'][0]['result'] != "err"&&response['data'][0]['result']!="Ip not exist"){
        var new_arr = [];
        for (var id=0 ; id<$scope.T_IpList.length ; id++) {
          if(response['data'][0]['result']!=$scope.T_IpList[id]) {
            new_arr.push($scope.T_IpList[id]);
          }
        }
        $scope.T_IpList=new_arr;
      }
      else{
        $scope.indexLog=response['data'][0]['result'];
      }
    }, function errorCallback() {
    });
  };

});






