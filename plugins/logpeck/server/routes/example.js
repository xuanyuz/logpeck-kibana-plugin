import Wreck from 'wreck';

export default function (server) {
  server.route([
    {
      path: '/api/logpeck/init',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          var res;
          Wreck.post('http://localhost:9200/logpeck/host/_search?q=*&pretty',
            (err, xyResponse, payload) => {
              if (err) {
                res = '[{"result":"'+err+'"}]';
                reply(res);
              }
              reply(payload.toString());
            });
        };
        try {
          example();
        }
        catch (err) {
        }
      }
    },
    {
      path: '/api/logpeck/list',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          var ip=req.payload.ip;
          var  res;
          Wreck.post('http://'+ip+'/peck_task/liststats',
          (err, xyResponse, payload) => {
            var patt=new RegExp(/^List TaskStatus failed,/);
            if (err) {
              res = '[{"result":"'+err+'"}]';
              reply(res);
            }
            else if(payload==undefined){
              res='[{"result":"undefined"}]';
              reply(res);
            }
            else if(patt.test(res))
            {
              res='[{"result":"'+payload.toString()+'"}]';
              reply(res);
            }
            else{
              if(payload.toString()=="null"){
                res='[{"null":"true"}]';
                reply(res);
              }
              else{
                reply(payload.toString());
              }
            }
          });
        };
        try {
          example();
        }
        catch (err) {
        }
      }
    },
    {
      path: '/api/logpeck/start',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          var name=req.payload.name;
          var ip=req.payload.ip;
          var  res;
          Wreck.post('http://'+ip+'/peck_task/start',{ payload: '{ "Name" : "'+name+'" }' },
            (err, xyResponse, payload) => {
              if (err) {
                res = '[{"result":"'+err+'"}]';
                reply(res);
              }
              else {
                res = '[{"result":"' + payload.toString() + '"}]';
                reply(res);
              }
            });
        };
        try {
          example();
        }
        catch (err) {
        }
      }
    },
    {
      path: '/api/logpeck/stop',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          var name=req.payload.name;
          var ip=req.payload.ip;
          var res;
          Wreck.post('http://'+ip+'/peck_task/stop',{ payload: '{ "Name" : "'+name+'" }' },
            (err, xyResponse, payload) => {
              if (err) {
                res = '[{"result":"'+err+'"}]';
                reply(res);
              }
              else {
                res = '[{"result":"' + payload.toString() + '"}]';
                reply(res);
              }
            });
        };
        try {
          example();
        }
        catch (err) {
        }
      }
    },
    {
      path: '/api/logpeck/remove',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          var name=req.payload.name;
          var ip=req.payload.ip;
          Wreck.post('http://'+ip+'/peck_task/remove',{ payload: '{ "Name" : "'+name+'" }' },
            (err, xyResponse, payload) => {
              if (err) {
                res = '[{"result":"'+err+'"}]';
                reply(res);
              }
              else if(payload.toString()=="Remove Success") {
                Wreck.post('http://' + ip + '/peck_task/liststats',
                  (err, xyResponse, payload) => {
                    if (err) {
                      console.log(err);
                    }
                    var res = payload.toString();
                    if ((payload.toString() == "null")) {
                      res = '[{"null":"true"}]';
                    }
                    reply(res);
                  }
                );
              }
              else{
                res = '[{"result":"'+payload.toString()+'"}]';
                reply(res);
              }
            });
        };
        try {
          example();
        }
        catch (err) {
        }
      }
    },
    {
      path: '/api/logpeck/addTask',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        var res;
        const example = async function () {
            var name=req.payload.name;
            var logpath=req.payload.logpath;
            var hosts=req.payload.hosts;
            var index=req.payload.index;
            var type=req.payload.type;
            var Mapping=req.payload.Mapping;
            var Fields=req.payload.Fields;
            var Delimiters=req.payload.Delimiters;
            var FilterExpr=req.payload.FilterExpr;
            var LogFormat=req.payload.LogFormat;
            var ip=req.payload.ip;
            Wreck.post('http://'+ip+'/peck_task/add', {payload: '{ "Name" : "' + name + '","LogPath":"' + logpath + '","ESConfig":{"Hosts":["' + hosts + '"],"Index":"' + index + '","Type":"' + type + '","Mapping":"' + Mapping + '"},"Fields":"' + Fields +'","Delimiters":"' + Delimiters + '","FilterExpr":"' + FilterExpr + '","LogFormat":"' + LogFormat + '" }'},
              (err, xyResponse, payload) => {
                if (err) {
                  res = '[{"result":"'+err+'"}]';
                  reply(res);
                }
                else if(payload.toString()=="Add Success") {
                  Wreck.post('http://' + ip + '/peck_task/liststats',
                    (err, xyResponse, payload) => {
                      var patt=new RegExp(/^List TaskStatus failed,/);
                      if (err) {
                        res = '[{"result":"'+err+'"}]';
                        reply(res);
                      }
                      else if(payload==undefined){
                        res='[{"result":"undefined"}]';
                        reply(res);
                      }
                      else if(patt.test(res))
                      {
                        res='[{"result":"'+payload.toString()+'"}]';
                        reply(res);
                      }
                      else {
                        if (payload.toString() == "null") {
                          res = '[{"null":"true"}]';
                          reply(res);
                        }
                        else {
                          reply(payload.toString());
                        }
                      }
                    });
                }
                else{
                  res = '[{"result":"'+payload.toString()+'"}]';
                  reply(res);
                }
              });
        };
        try {
          example();
        }
        catch (err) {
        }
      }
    },
    {
      path: '/api/logpeck/addHost',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          var ip=req.payload.ip;
          var res;
          Wreck.post('http://localhost:9200/logpeck/host/_search?_source=false',{payload:'{"query": { "match": {"ip":"'+ip+'"}}}'},
            (err, xyResponse, payload) => {
              var exist=JSON.parse(payload.toString());
              var res;
              if (err) {
                res = '[{"result":"'+err+'"}]';
                reply(res);
              }
              else if(exist['hits']['total']==0) {
                Wreck.post('http://localhost:9200/logpeck/host', {payload: '{ "ip" : "' + ip + '" }'},
                  (err, xyResponse, payload) => {
                    if (err) {
                      res='[{"result":"err"}]';
                      reply(res);
                    }
                    else {
                      res = '[{"result":"Add success"}]';
                      reply(res);
                    }
                  });
              }
              else{
                res = '[{"result":"Already exist"}]';
                reply(res);
              }
            });
        }
        try {
          example();
        }
        catch (err) {
        }
      }
    },
    {
      path: '/api/logpeck/removeHost',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          var ip=req.payload.ip;
          var res;
          Wreck.post('http://localhost:9200/logpeck/host/_search?_source=false',{payload:'{"query": { "match": {"ip":"'+ip+'"}}}'},
            (err, xyResponse, payload) => {
              if (err) {
                res='[{"result":"'+err+'"}]';
                reply(res);
              }
              else {
                var getid = JSON.parse(payload.toString());
                if (getid['hits']['total'] == 0) {
                  res = '[{"result":"Ip not exist"}]';
                  reply(res);
                }
                else {
                  var id = getid['hits']['hits'][0]['_id'];
                  Wreck.delete('http://localhost:9200/logpeck/host/' + id + '?',
                    (err, xyResponse, payload) => {
                      if (err) {
                        res = '[{"result":"'+err+'"}]';
                        reply(res);
                      }
                      else {
                        res = '[{"result":"' + ip + '"}]';
                        reply(res);
                      }
                    });
                }
              }
            });
        }
        try {
          example();
        }
        catch (err) {
        }
      }
    },
    {
      path: '/api/logpeck/updateList',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        const example = async function () {
          var ip=req.payload.ip;
          var name=req.payload.name;
          var  res;
          Wreck.post('http://'+ip+'/peck_task/list',
            (err, xyResponse, payload) => {
              var patt=new RegExp(/^List PeckTask failed,/);
              if (err) {
                res = '[{"result":"'+err+'"}]';
                reply(res);
              }
              else if(payload==undefined){
                res='[{"result":"undefined"}]';
                reply(res);
              }
              else if(patt.test(res))
              {
                res='[{"result":"'+payload.toString()+'"}]';
                reply(res);
              }
              else{
                if(payload.toString()=="null"){
                  res='[{"null":"true"}]';
                  reply(res);
                }
                else{
                  var list=JSON.parse(payload.toString());
                  for(var id=0;id<list.length;id++){
                    if(list[id]['Name']==name){
                      reply(list[id]);
                    }
                  }
                }
              }
            });
        };
        try {
          example();
        }
        catch (err) {
        }
      }
    },
    {
      path: '/api/logpeck/updateTask',
      method: 'POST',
      handler(req, reply) {
        const Wreck = require('wreck');
        var res;
        const example = async function () {
          var name=req.payload.name;
          var logpath=req.payload.logpath;
          var hosts=req.payload.hosts;
          var index=req.payload.index;
          var type=req.payload.type;
          var Mapping=req.payload.Mapping;
          var Fields=req.payload.Fields;
          var Delimiters=req.payload.Delimiters;
          var FilterExpr=req.payload.FilterExpr;
          var LogFormat=req.payload.LogFormat;
          var ip=req.payload.ip;
          Wreck.post('http://'+ip+'/peck_task/update', {payload: '{ "Name" : "' + name + '","LogPath":"' + logpath + '","ESConfig":{"Hosts":["' + hosts + '"],"Index":"' + index + '","Type":"' + type + '","Mapping":"' + Mapping + '"},"Fields":"' + Fields +'","Delimiters":"' + Delimiters + '","FilterExpr":"' + FilterExpr + '","LogFormat":"' + LogFormat + '" }'},
            (err, xyResponse, payload) => {
              if (err) {
                res = '[{"result":"'+err+'"}]';
                reply(res);
              }
              else if(payload.toString()=="Update Success") {
                Wreck.post('http://' + ip + '/peck_task/liststats',
                  (err, xyResponse, payload) => {
                    var patt=new RegExp(/^List TaskStatus failed,/);
                    if (err) {
                      res = '[{"result":"'+err+'"}]';
                      reply(res);
                    }
                    else if(payload==undefined){
                      res='[{"result":"undefined"}]';
                      reply(res);
                    }
                    else if(patt.test(res))
                    {
                      res='[{"result":"'+payload.toString()+'"}]';
                      reply(res);
                    }
                    else {
                      if (payload.toString() == "null") {
                        res = '[{"null":"true"}]';
                        reply(res);
                      }
                      else {
                        reply(payload.toString());
                      }
                    }
                  });
              }
              else{
                res = '[{"result":"'+payload.toString()+'"}]';
                reply(res);
              }
            });
        };
        try {
          example();
        }
        catch (err) {
        }
      }
    },
  ]);

}
