angular.module('ksApp')
    .constant('categories', [
                {title:"Adventure"},
                {title:"Map"},
                {title:"Guides"}
              ])
    .constant('zoomToolDefaults', {
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
                })
    .constant('cyStyle', [ // the stylesheet for the graph
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
              ])
    .value('subjects', [
                {name: "Linear_Algebra"}
            ])
    .value('questions', [ {body: '<div></div>'}
                
            ])
    .factory('wiki', ['$resource', function($resource) {
        return {
            get: function() {
                return $resource("http://localhost:3000/wiki/:subject",
                                  {subject:'@subject'},
                                  {query: {method: 'get', isArray:false}});
            }
        }
    }]);
            


/*
var categories = 

var output="#container", template="#raccon";

var ractive = new Ractive({
  el: output,
  template: template,
  data: { categories: categories, subjects: subjects }
});*/

