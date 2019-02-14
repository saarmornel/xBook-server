module.exports={
    "mongo": {
        "development":{      //mlab
            "connectionString":"mongodb://admin:admin@ds113136.mlab.com:13136/comarket"
        },
        "test" : {
            "connectionString":"mongodb://admin:admin@ds231549.mlab.com:31549/xbook-server-test"
        },
        "prod":{
        }
    }
}
