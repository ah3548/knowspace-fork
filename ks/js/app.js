'use strict';

// Declare app level module which depends on views, and components
angular.module('ksApp', ['ngRoute','ngSanitize','ngResource'])
    .config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
      controller: 'MainCtrl',
      templateUrl:'view/view.html'
  }).otherwise({
      controller: 'MainCtrl',
      templateUrl:'view/view.html'
  });
}])
    .controller('MainCtrl', ['$scope', '$resource', 'categories', 'subjects', 'zoomToolDefaults', 'cyStyle', 'questions','wiki',
                             function($scope, $resource, categories, subjects, zoomToolDefaults, cyStyle, questions, wiki) {
    $scope.subject = "Linear Algebra";
    $scope.categories = categories;
    $scope.subjects = subjects;
    $scope.questions = questions;
    
    var cy = cytoscape({
      container: document.getElementById('cy'),
      elements: [ // list of graph elements to start with
        { // node a
          data: { id: subjects[0].name.replace(/_/,' ') }
        }
      ],
      style: cyStyle
    });


    function addZoomTool(defaults) {
        // the default values of each option are outlined below:
        cy.panzoom( defaults );
    }


    function addNode(ref) { // {title:<>"}
        cy.add({
            data: {
                id: ref.title
            }
        });
    }

    function addEdge(ref, prev_ref) {
        cy.add({
            data: { 
                id: prev_ref.title + "," + ref.title, 
                source: prev_ref.title,      
                target: ref.title 
            }
        });
    }

    function getNode(ref) {
        return cy.getElementById(ref.title);
    }

    function getEdge(ref, prev_ref) {
        return cy.getElementById(prev_ref.title + "," + ref.title);
    }

    function loadNewSubject(subject) {
        getSO(subject);
        getWiki(subject);
        getWikiLinks(subject);
        addSub(subject);
    }

    cy.on('select', 'node', function(e) {
        var node = this;
        var subject = node._private.data.id;
        loadNewSubject(subject);
    });

    function addSub(subject) {
        subjects.push({name:subject});
        sessionStorage.setItem('subjects',JSON.stringify(subjects));
        ractive.set('subjects', subjects);
    }

    $scope.appIntercept = function (event) {
        var linkPath = event.srcElement.pathname;
        var rPath = linkPath.split('/');
        loadNewSubject(rPath[2]);
        event.preventDefault();
        event.stopPropagation();

    }

    function addLinksToGraph(result) {
        for (var i = 0; i < result.length && i < 100; i++) {
            var ref = result[i];
            var nExists = getNode(ref);
            if (nExists.length == 0) {
                addNode(ref);
            }
            if (i-1 >= 0) {
                var prev_ref = result[i-1];
                var eExists = getEdge(ref, prev_ref);
                if (eExists.length == 0) {
                    addEdge(ref, prev_ref);
                }
            }
        }
    }

    function initGraph(subject) {
        addZoomTool(zoomToolDefaults);
        getWikiLinks(subject)
    }
                                 
    // ################### SERVICES ############################## 
    
    
    function getWiki(subject) {
        /*$.ajax({url: "http://localhost:3000/wiki/" + subject, success: function(result){
            $("#wiki-container").html(result);
        }});*/
        wiki.get().query({subject:subject}).$promise.then(function(article) {
            $scope.article=article.body;
        });
    }
    getWiki(subjects[0].name);

    function getWikiLinks(subject) {
        $.ajax({
            url: "http://localhost:3000/wiki/" + subject + "/links", success: function(result){
                addLinksToGraph(result);
                addEdge({title: result[0].title}, {title:"Linear Algebra"});
                cy.layout({
                    name: 'concentric',
                    concentric: function( node ){
                      return node.degree();
                    },
                    levelWidth: function( nodes ){
                      return 2;
                    }
                  });
                cy.reset();
            }
        });
    }
    initGraph(subjects[0].name);

    function getSO(subject) {
        var questions = $resource("http://localhost:3000/so/questions/:subject",
                                  {subject:'@subject'},
                                  {query: {method: 'get', isArray:true}});
        questions.query({subject:subject}).$promise.then(function(qs) {
          $scope.questions = qs;
        });
    }
    getSO(subjects[0].name);          
                            
}])
.run(function($rootScope, $location, $anchorScroll, $routeParams) {
  //when the route is changed scroll to the proper element.
  $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
    $location.hash($routeParams.scrollTo);
    $anchorScroll();  
  });
});






