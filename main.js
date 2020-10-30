var zabbixclient = require('./zabbixclient');

var cli = new zabbixclient("http://zabbix.stef.local","zabbixapi","zabbixapi")

function exporter(host,data){
    result=""
    
    var meta_name="zabbix_items"
    result+="# HELP "+meta_name+' Etat de applicactif (0=KO,1=OK)\n'
    result+="# TYPE "+meta_name+" gauge\n"
    for( i=0;i<data.length;i++){
        if( data[i].value_type == 0 || data[i].value_type==3){
            result+=meta_name+'{name="'+data[i].name+'",host="'+host+'",value_type="'+data[i].value_type+'"} '+data[i].lastvalue+' '+data[i].lastclock+'\n'
        }
    }
    return result
}


// cli.connect( function( response){
//     cli.hosts({"filter": {"host": ['devserver.stef.local','dockersrv.stef.local']}},function( hostresponse){
//         cli.items({"hostids":response.data.result[0].hostid},function( response){
//             promexport=exporter(this.host,response.data.result)
//             console.log(promexport)
//         }.bind({host:hostresponse.data.result[0].name}))
//     })
// })

const gethosts = (param) => { 
    return new Promise((resolve, reject) => {
        cli.hosts(param,(data) => {
            if(data.statusText == 'OK'){
                resolve(data.data.result)
            } else{
                reject(data.statusText)
            }
        })
    })
}

const getitems = (param) => { 
    return new Promise((resolve, reject) => {
        cli.items(param,(data) => {
            if(data.statusText == 'OK'){
                resolve(data.data.result)
            } else{
                reject(data.statusText)
            }
        })
    })
}


cli.connect( function( response){
    gethosts({"filter": {"host": ['devserver.stef.local','dockersrv.stef.local']}})
    .then(hosts => {
        hosts.forEach(function(h){
            getitems({hostids: h.hostid}).then(items => {
                var meta_name="zabbix_items"
                items.forEach(function(item){
                    if( item.value_type == 0 || item.value_type==3){
                        console.log(meta_name+'{name="'+item.name+'",host="'+h.name+'",value_type="'+item.value_type+'"} '+item.lastvalue+' '+item.lastclock)
                    }
                })
            })
        })
    })
    .catch(err => console.error(err))
})

           
//         var jobQueries=[];
//         hostresponse.data.result.forEach(function(h){
//             jobQueries.push(cli.items({"hostids":h.hostid}));
//         });
//         return Promise.all(jobQueries)
//     }).then(function(datas){
//          datas.forEach(function(data){
//              console.log(data)
//         })
//     })



