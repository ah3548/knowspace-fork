'use strict';

angular.module('ksApp', ['ngResource','angular-bind-html-compile'])
    .config(['$sceProvider',function($sceProvider){
        $sceProvider.enabled(false);
    }])
    .controller('MainCtrl', ['$scope', '$resource', '$document', '$rootScope', 'categories', 'subjects', 'zoomToolDefaults', 'cyStyle', 'questions','wiki', 'ksGraph',
                             function($scope, $resource, $document, $rootScope, categories, subjects, zoomToolDefaults, cyStyle, questions, wiki, ksGraph) {
    $scope.subject = "Linear Algebra";
    $scope.categories = categories;
    $scope.subjects = subjects;
    $scope.questions = questions;
    
    var cy = null;
    
    /* CY INIT */
    $scope.initGraph = function() {
       cy = cytoscape({
          container: $('#cy'),
          elements: [ // list of graph elements to start with
            { // node a
              data: { id: subjects[0].name.replace(/_/,' ') }
            }
          ],
          style: cyStyle
        });
        
        cy.on('select', 'node', function(e) {
            var node = this;
            var subject = node._private.data.id;
            addSub(subject);
            loadNewSubject(subject);
        });
        
        cy.panzoom(zoomToolDefaults);
        
        getWikiLinks($scope.subject);
    }
    
    /* CY GETTERS AND SETTERS */
    function getNode(ref) {
        return cy.getElementById(ref.title);
    }

    function getEdge(ref, prev_ref) {
        return cy.getElementById(prev_ref.title + "," + ref.title);
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

    /* CY FUNCTIONS */
    function updateGraph(result){
        addLinksToGraph(result);
        addEdge({title: result[0].title}, {title:"Linear Algebra"});
        setGraphLayout();
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
    
    function setGraphLayout() {
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
      
/* END CY */
                                 
    $scope.updateBreadCrumbs = function(subject) {
       for (var i = 0; i < subjects.length; i++) {
           if (subjects[i].name == subject) {
               console.log(subjects[i].name);
               console.log(subjects.slice(0,i+1));
               $scope.subjects = subjects.slice(0,i+1);
               break;
           }
       }
        loadNewSubject(subject);
    }
                                 
    function loadNewSubject(subject) {
        getSO(subject);
        getWiki(subject);
        getWikiLinks(subject);
    }

    function addSub(subject) {
        $scope.subject=subject;
        $scope.subjects.push({name:subject});
        sessionStorage.setItem('subjects',JSON.stringify($scope.subjects));
    }

    $scope.appIntercept = function (linkPath) {
        var rPath = linkPath.split('/');
        addSub(subject);
        loadNewSubject(rPath[2]);
    }
                                 
    // ################### SERVICES ############################## 
    function getWiki(subject) { wiki.get().query({subject:subject}).$promise.then(function(article) {
            $scope.article=article;
        });
    }
    getWiki(subjects[0].name);

    function getWikiLinks(subject) {
        $.ajax({
            url: "http://localhost:3000/wiki/" + subject + "/links", success: updateGraph
        });
    }

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
.directive('ksPage', function() {
  return {
    templateUrl: 'view/view.html',
      replace: true
  };
})
.factory('ksGraph', [ '$q', 'cyStyle', 'subjects', function( $q, cyStyle, subjects){
  var cy;
  var ksGraph = function(k){
    var deferred = $q.defer();
    
    /*// put people model in cy.js
    var eles = [];
    for( var i = 0; i < people.length; i++ ){
      eles.push({
        group: 'nodes',
        data: {
          id: people[i].id,
          weight: people[i].weight,
          name: people[i].name
        }
      });
    }*/
    
    $(function(){ // on dom ready
      cy = cytoscape({
          container: $('#cy'),
          elements: [ // list of graph elements to start with
            { // node a
              data: { id: subjects[0].name.replace(/_/,' ') }
            }
          ],
          style: cyStyle,
          ready: function(){
              deferred.resolve( this );
          }
      });
      /*cy = cytoscape({
        container: $('#cy'),
        
        style: cytoscape.stylesheet()
          .selector('node')
            .css({
              'content': 'data(name)',
              'height': 80,
              'width': 'mapData(weight, 1, 200, 1, 200)',
               'text-valign': 'center',
                'color': 'white',
                'text-outline-width': 2,
                'text-outline-color': '#888'
             })
          .selector('edge')
            .css({
              'target-arrow-shape': 'triangle'
            })
          .selector(':selected')
            .css({
              'background-color': 'black',
              'line-color': 'black',
              'target-arrow-color': 'black',
              'source-arrow-color': 'black',
              'text-outline-color': 'black'
          }),

        layout: {
          name: 'cose',
          padding: 10
        },
        
        elements: eles,

        ready: function(){
          deferred.resolve( this );
          
          cy.on('cxtdrag', 'node', function(e){
            var node = this;
            var dy = Math.abs( e.cyPosition.x - node.position().x );
            var weight = Math.round( dy*2 );
            
            node.data('weight', weight);
            
            fire('onWeightChange', [ node.id(), node.data('weight') ]);
          });
        }
      });*/

    }); // on dom ready
    
    return deferred.promise;
  };
  
  /*peopleGraph.listeners = {};
  
  function fire(e, args){
    var listeners = peopleGraph.listeners[e];
    
    for( var i = 0; listeners && i < listeners.length; i++ ){
      var fn = listeners[i];
      
      fn.apply( fn, args );
    }
  }
  
  function listen(e, fn){
    var listeners = peopleGraph.listeners[e] = peopleGraph.listeners[e] || [];
    
    listeners.push(fn);
  }
  
  peopleGraph.setPersonWeight = function(id, weight){
    cy.$('#' + id).data('weight', weight);
  };
  
  peopleGraph.onWeightChange = function(fn){
    listen('onWeightChange', fn);
  };*/
  
  return ksGraph;
  
  
} ]);;






