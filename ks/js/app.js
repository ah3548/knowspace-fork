var subjects = [
    {name: "Linear_Algebra"}
];

var cy = cytoscape({
  container: document.getElementById('cy'),
  elements: [ // list of graph elements to start with
    { // node a
      data: { id: subjects[0].name.replace(/_/,' ') }
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
getWiki(subjects[0].name);


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

cy.on('select', 'node', function(e) {
    var node = this;
    var subject = node._private.data.id;
    getSO(subject);
    getWiki(subject);
    addSub(subject);
});

var output="#socontainer", template="#soquestions";

var soractive = new Ractive({
  el: output,
  template: template,
  data: { questions: [] }
});

function getSO(subject) {
    $.ajax({url: "http://localhost:3000/so/questions/" + subject, success: function(result){
    soractive.set('questions', result.slice(0,10));
        //$("#wiki-container").html(result);
    }});
}
getSO(subjects[0].name);


function addSub(subject) {
    subjects.push({name:subject});
    ractive.set('subjects', subjects);
}

function appIntercept(event) {
    var linkPath = event.srcElement.pathname;
    var rPath = linkPath.split('/');
    addSub(rPath[2]);
    getSO(rPath[2]);
    getWiki(rPath[2]);
    event.preventDefault();

}