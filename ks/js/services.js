angular.module('ksApp')
    .factory('wiki', ['$resource', 'BASEURL', function($resource, BASEURL) {
        return {
            get: function() {
                console.log('wiki');
                return $resource(BASEURL + "/wiki/:subject",
                                  {subject:'@subject'},
                                  {query: {method: 'GET', isArray:false}});
            },
            getLinks: function() {
                console.log('wikilink');
                return $resource(BASEURL + "/wiki/:subject/links",
                                  {subject:'@subject'},
                                  {query: {method: 'GET', isArray:true}});
            }
        }
    }])
    .service('question', ['$resource', 'BASEURL', function($resource, BASEURL) {
        console.log('question');
        return $resource(BASEURL + "/so/questions/:subject",
                          {subject:'@subject'},
                          {query: {method: 'GET', isArray:true}
                });
    }])
    .service('graph', ['$resource', 'BASEURL', function($resource, BASEURL) {
        console.log('graph');
        return $resource(BASEURL + "/graph",
                        {title:'@title'}, {
                        query: {method: "GET"},
                        update: {method: "POST"}
                });
    }]);