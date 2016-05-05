var cy = cytoscape({
  container: document.getElementById('cy'),
  elements: [ // list of graph elements to start with
    { // node a
      data: { id: 'Linear Algebra' }
    }
  ],
  style: [ // the stylesheet for the graph
    {
      selector: 'node',
      style: {
        'background-color': '#666',
        'label': 'data(id)'
      }
    },

    {
      selector: 'edge',
      style: {
        'width': 3,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        'target-arrow-shape': 'triangle'
      }
    }
  ],
});


function getWiki(subject) {
    $.ajax({url: "http://localhost:3000/wiki/" + subject, success: function(result){
        result += "LOOK HERE";
        $("#wiki-container").html(result);
    }});
}
getWiki("Linear_Algebra");


$.ajax({
    url: "http://localhost:3000/wiki/Linear_Algebra/links", success: function(result){
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
        addEdge({title: result[0].title},                                 {title:"Linear Algebra"}
                );
       cy.layout({
            name: 'concentric',
            concentric: function( node ){
              return node.degree();
            },
            levelWidth: function( nodes ){
              return 2;
            }
          });
        addZoomTool();
        cy.reset();
    }
});

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

function addZoomTool() {
    // the default values of each option are outlined below:
var defaults = {
  zoomFactor: 0.05, // zoom factor per zoom tick
  zoomDelay: 45, // how many ms between zoom ticks
  minZoom: 0.1, // min zoom level
  maxZoom: 10, // max zoom level
  fitPadding: 50, // padding when fitting
  panSpeed: 10, // how many ms in between pan ticks
  panDistance: 10, // max pan distance per tick
  panDragAreaSize: 75, // the length of the pan drag box in which the vector for panning is calculated (bigger = finer control of pan speed and direction)
  panMinPercentSpeed: 0.25, // the slowest speed we can pan by (as a percent of panSpeed)
  panInactiveArea: 8, // radius of inactive area in pan drag box
  panIndicatorMinOpacity: 0.5, // min opacity of pan indicator (the draggable nib); scales from this to 1.0
  zoomOnly: false, // a minimal version of the ui only with zooming (useful on systems with bad mousewheel resolution)

  // icon class names
  sliderHandleIcon: 'fa fa-minus',
  zoomInIcon: 'fa fa-plus',
  zoomOutIcon: 'fa fa-minus',
  resetIcon: 'fa fa-expand'
};
    
    cy.panzoom( defaults );
}

cy.on('select', 'node', function(e) {
    var node = this;
    var subject = node._private.data.id;
    console.log(subject);
    getWiki(subject)
});

var output="#socontainer", template="#soquestions";

var soractive = new Ractive({
  el: output,
  template: template,
  data: { questions: [] }
});

$.ajax({url: "http://localhost:3000/so/questions", success: function(result){
    soractive.set('questions', result.slice(0,10));
        //$("#wiki-container").html(result);
    }});


function appIntercept(event) {
    event.preventDefault();
    var linkPath = event.srcElement.pathname;
    var rPath = linkPath.split('/');
    console.log(rPath[2]);
    getWiki(rPath[2]);
}