const axios = require('axios').default;

const { UV_FS_O_FILEMAP } = require('constants');
module.exports = class Zabbixclient {
    constructor(url,usr,pass) {
        this.url = url;
        this.usr = usr;
        this.pass = pass;
        this.token = null;
        this.lastaccessdate = null;
        this.accesscontrolmaxage = null;
        const request = require('request');

    }
    hosts(params,cb){
        this.getinfo("host.get",params,cb)
    }
    getinfo(method,params,cb){
        var self=this
            axios({
                method:'post',
                url: 'http://zabbix.stef.local/api_jsonrpc.php',
                headers: {"content-type": "application/json"},
                responseType: 'json',
                data: {
                    jsonrpc: "2.0",
                    method: method,
                    params: params,
                    id: 1,
                    auth: self.token
                }
            }).then(function( response){
                cb(response)
             })
    }   
    
    items(params,cb){
        this.getinfo("item.get",params,cb)
    }

    connect(cb) {
        var self=this
        console.log(self.usr)
        axios({
            method:'post',
            url: 'http://zabbix.stef.local/api_jsonrpc.php',
            headers: {'content-type': 'application/json'},
            responseType: 'json',
            data: {
                jsonrpc: "2.0",
                method: "user.login",
                params: {
                    "user": self.usr,
                    "password": self.pass,
                },
                id: 1,
                auth: self.token
            }
        }).then(function( response){
           self.token = response.data.result
           self.lastaccessdate=response.headers['date']
           self.accesscontrolmaxage= response.headers['access-control-max-age']
           cb(response)
        })
    }
    
    dump() {
        console.log(JSON.stringify(this))
    }
}
