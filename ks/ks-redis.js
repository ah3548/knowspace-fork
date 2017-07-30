var redis = require('redis'),
    host = '192.168.99.100',
    port = 6379,
    client = redis.createClient(port, host); //creates a new client

client.on('connect', function() {
    console.log('connected');
});

function getKey(execute_function, requestParam) {
    return execute_function.name + '(' + requestParam + ')';
}

var save = function(execute_function, requestParam, response) {
    response = JSON.stringify(response);
    client.setex(getKey(execute_function, requestParam), 216000, response);
};

function wrappedCall(execute_function, requestParam) {
    return new Promise(function(resolve, reject) {
        console.log('KEY: ' + getKey(execute_function, requestParam))
        client.get(getKey(execute_function, requestParam), (err, result)=> {
           resolve(JSON.parse(result));
        });
    });
}

module.exports = {
    wrappedCall,
    save
}

