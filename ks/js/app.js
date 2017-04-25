'use strict';

angular.module('ksApp', ['ngResource', 'angular-bind-html-compile', 'ngCookies'])
    .config(['$sceProvider', function ($sceProvider) {
        $sceProvider.enabled(false);
    }])
    .controller('MainCtrl', ['$scope', '$resource', '$document', '$rootScope', '$cookies', 'categories', 'subjects', 'zoomToolDefaults', 'cyStyle', 'qs', 'question', 'wiki', 'graph', 'AuthenticationService', 'emojis',
                             function ($scope, $resource, $document, $rootScope, $cookies, categories, subjects, zoomToolDefaults, cyStyle, qs, question, wiki, graph, AuthenticationService, emojis) {
            $scope.username = getSessionInfo('username');
            $scope.subject = getSessionInfo('subject');
            $scope.subjects = getSessionInfo('subjects');
            $scope.categories = categories;
            $scope.questions = qs;
            
            //$scope.password = '';

            AuthenticationService.ClearCredentials();
            $scope.login = function () {
                $scope.dataLoading = true;
                AuthenticationService.Login($scope.username, null, function (response) {
                    if (response.success) {
                        AuthenticationService.SetCredentials($scope.username, null);
                    } else {
                        $scope.error = response.message;
                    }
                    $scope.dataLoading = false;
                });
            }

            /* CY INIT */
            var cy = null;

            $scope.initGraph = function () {
                getBaseGraph();
                getSessionInfo('graph').then(function (result) {
                    console.log("Just loaded graph");
                    console.log(getNode({
                        title: $scope.subject
                    }));
                    loadNewSubject();
                });
            }

            function getBaseGraph() {
                cy = cytoscape({
                    container: $('#cy'),
                    elements: [],
                    style: cyStyle
                });

                //getNode({title: subjects[0].name}).addClass("confused");

                cy.on('select', 'node', function (e) {
                    console.log("node selected");
                    var node = this;
                    var subject = node._private.data.id;
                    addSub(subject);
                });

                cy.panzoom(zoomToolDefaults);
            }

            /* CY GETTERS AND SETTERS {title:<>"} */

            // get node with name with subject without underscores
            function uToS(source) {
                return source.replace(/_/g, ' ');
            }
            function getNode(ref) {
                return cy.getElementById(uToS(ref.title));
            }

            function getEdge(ref, prev_ref) {
                return cy.getElementById(prev_ref.title + "+" + ref.title);
            }

            function addNode(ref) {
                cy.add({
                    data: {
                        id: uToS(ref.title)
                    }
                });
            }

            function addEdge(ref, prev_ref) {
                var prevTitle = prev_ref.title;
                var curTitle = ref.title;
                cy.add({
                    data: {
                        id: prevTitle + "+" + curTitle,
                        source: uToS(prevTitle),
                        target: uToS(curTitle)
                    }
                });
            }

            /* CY FUNCTIONS */
            function updateGraph(result) {
                addLinksToGraph(result);
                getNode({
                    title: $scope.subject
                }).addClass("confused"); // if selected again do not get links
                //addEdge({title: result[0].title}, {title:"Linear Algebra"});
                setGraphLayout();
                updateSessionInfo('graph');
            }


            function addLinksToGraph(result) { // Placeholder for actual edge making algorithm
                for (var i = 0; i < result.length && i < 1000; i++) {
                    var ref = result[i];
                    var nExists = getNode(ref);
                    if (nExists.length == 0) {
                        addNode(ref);
                    }
                    if (i - 1 >= 0) {
                        var prev_ref = result[i - 1];
                        var eExists = getEdge(ref, prev_ref);
                        if (eExists.length == 0) {
                            addEdge(ref, prev_ref);
                        }
                    }
                }
            }

            function setGraphLayout() {
                cy.layout({
                    name: 'concentric',
                    concentric: function (node) {
                        return node.degree();
                    },
                    levelWidth: function (nodes) {
                        return 2;
                    }
                });
                cy.reset();
                /*cy.center(getNode({
                    title: $scope.subject
                }));*/
            }

            /* END CY */
            function getSessionInfo(name) {
                var value = $cookies.getObject(name);
                console.log("getting " + name);
                if (value == null) {
                    switch (name) {
                        case "username":
                            value = $scope.username = "Anon" + Math.floor(Math.random() * 10000 + 1).toString();
                            updateSessionInfo(name);
                            break;
                        case "subject":
                            value = subjects[0].name;
                            updateSessionInfo(name);
                            break;
                        case "subjects":
                            value = subjects;
                            updateSessionInfo(name);
                            break;
                        case "graph":
                            console.log("Actually getting graph");
                            return getGraph();
                            break;
                    }
                }
                return value;
            }

            function updateSessionInfo(name) {
                console.log("updating" + name);
                var value = "";
                switch (name) {
                    case "username":
                    case "subject":
                    case "subjects":
                        $cookies.putObject(name, $scope[name]);
                        break;
                    case "graph":
                        saveGraph(cy.json());
                        break;
                }
            }

            $scope.updateBreadCrumbs = function (clickedSubject) {
                $scope.subject = clickedSubject;

                for (var i = 0; i < $scope.subjects.length; i++) {
                    if ($scope.subjects[i].name == $scope.subject) {
                        $scope.subjects = $scope.subjects.slice(0, i + 1);
                        break;
                    }
                }
                loadNewSubject();
            }

            // GRAPH SHOULD BE LOADED BEFORE THIS FUNCTION IS CALLED
            function loadNewSubject() {
                console.log("loading " + $scope.subject);
                updateSessionInfo('subject');
                updateSessionInfo('subjects');
                getSO();
                getWiki();
                console.log(getNode({
                    title: $scope.subject
                }));
                //console.log(getNode({title: $scope.subject}));
                var visited = getNode({
                    title: $scope.subject
                }).hasClass('twa-confused');
                console.log(visited);
                if (!visited) {
                    getWikiLinks();
                }
            }

            function addSub(subject) {
                $scope.subject = subject;
                var contains = false;
                $scope.subjects.forEach(function (element) {
                    if (element.name == subject) {
                        contains = true;
                    }
                });
                if (!contains) {
                    $scope.subjects.push({
                        name: subject
                    });
                }
                loadNewSubject();
            }

            $scope.appIntercept = function (linkPath) {
                var rPath = linkPath.split('/');
                addSub(rPath[2]);
            }

            // ################### SERVICES ############################## 
            function getWiki(subject) {
                /*var article = wiki.get();
                article.query({
                    subject: $scope.subject
                }).$promise.then(function (article) {
                    $scope.article = article;
                });*/
            }

            function getWikiLinks(subject) {
                /*var links = wiki.getLinks();
                links.query({
                    subject: $scope.subject
                }).$promise.then(function (ls) {
                    ls.unshift({
                        title: uToS($scope.subject)
                    });
                    updateGraph(ls);
                });*/
            }

            function getSO(subject) {
                /*question.query({
                    subject: $scope.subject
                }).$promise.then(function (result) {
                    $scope.questions = result;
                });*/
            }

            function getGraph() {
                return graph.query({
                    title: $scope.subject.replace('_',' ')
                }).$promise.then(function(graph) {
                    console.log(graph);
                });
                /*return graph.query({
                    username: $scope.username
                }).$promise.then(function (graph) {
                    if (graph != null) {
                        graph.constructor = Object; // I don't understand why this needs to be here
                                                console.log(graph);

                        cy.json(graph);
                        return graph;
                    }
                });*/
            }

            function saveGraph(graphMetaData) {
                console.log("saving graph");
                /*graph.update({}, {
                    username: $scope.username,
                    graph: graphMetaData
                });*/
            }

}])
    .directive('ksPage', function () {
        return {
            templateUrl: 'view/view.html',
            replace: true
        };
    });
