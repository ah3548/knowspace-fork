var cy = cytoscape({
  container: document.getElementById('cy'),
  elements: [ // list of graph elements to start with
    { // node a
      data: { id: 'a' }
    },
    { // node b
      data: { id: 'b' }
    },
    { // edge ab
      data: { id: 'ab', source: 'a', target: 'b' }
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

  layout: {
    name: 'grid',
    rows: 1
  }
});

$.ajax({url: "http://localhost:3000/wiki", success: function(result){
        $("#wiki-container").html(result);
    }});


var output="#socontainer", template="#soquestions";

var soractive = new Ractive({
  el: output,
  template: template,
  data: { questions: [] }
});

$.ajax({url: "http://localhost:3000/so/questions", success: function(result){
    soractive.set('questions', result);
        //$("#wiki-container").html(result);
    }});
