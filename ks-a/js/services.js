angular.module('ksApp')
    .factory('wiki', ['$resource', 'BASEURL', function($resource, BASEURL) {
        return {
            get: function() {
                console.log('wiki');
                return $resource(BASEURL + "/wiki/:subject",
                                  {subject:'@subject'},
                                  {query: {method: 'GET', isArray:false}});
            }
        }
    }])
    .service('graph', ['$resource', 'BASEURL', function($resource, BASEURL) {
        console.log('graph');
        return $resource(BASEURL + "/graph/:title",
                        {title:'@title'}, {
                        query: {method: "GET", isArray:true}
                });
    }]);