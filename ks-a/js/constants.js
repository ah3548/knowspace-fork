angular.module('ksApp')
    .constant('categories', [
                {title:"Adventure"},
                {title:"Map"},
                {title:"Guides"}
              ])
    //.constant('BASEURL', "http://localhost:3000")
    .constant('BASEURL', "http://amir.us-east-1.elasticbeanstalk.com")
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
    .service('cyStyle', ['emojis', function(emojis) {
        return cytoscape.stylesheet()
            .selector('node')
              .css({
                'background-color': '#666',
                'background-fit': 'cover',
                'label': 'data(id)'
              })
            .selector('edge')
              .css({
                'width': 3,
                'line-color': '#ccc',
                'target-arrow-color': '#ccc',
                'target-arrow-shape': 'triangle'
              })
            .selector('.confused')
              .css({
                'background-image': emojis.confused,
              })
            .selector('.satisfied')
              .css({
                'background-image': emojis.satisfied
              })
    }])
    .value('subjects', [
                {name: "Linear Algebra"}
            ])
    .value('qs', [])
    .value('emojis', {
            confused: 'http://www.emoji-cheat-sheet.com/graphics/emojis/confused.png',
            satisfied: 'http://www.emoji-cheat-sheet.com/graphics/emojis/satisfied.png'        
          })