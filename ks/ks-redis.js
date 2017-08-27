var redis = require('redis'),
    host = '192.168.99.100',
    awshost = 'ks.v90bte.0001.use1.cache.amazonaws.com',
    port = 6379;

var RedisClient = (function() {
    var client = redis.createClient(port, awshost); //creates a new client

    client.on('connect', function() {
        console.log('connected');
        function getKey(execute_function, requestParam) {
            return execute_function.name + '(' + requestParam + ')';
        }

        this.save = (execute_function, requestParam, response) => {
            response = JSON.stringify(response);
            client.setex(getKey(execute_function, requestParam), 216000, response);
        };

        this.wrappedCall = (execute_function, requestParam) => {
            return new Promise(function (resolve, reject) {
                console.log('KEY: ' + getKey(execute_function, requestParam))
                client.get(getKey(execute_function, requestParam), (err, result) => {
                    resolve(JSON.parse(result));
                });
            });
        };
    }.bind(this));

    client.on("error", function (err) {
        console.log(err);
        this.save = (execute_function, requestParam, response) => {};
        this.wrappedCall = (execute_function, requestParam) => {
            return Promise.resolve();
        };
        client.quit();
    }.bind(this));

    return this;
})();

module.exports = {
    RedisClient
}

