'use strict';

function KsNavBarController(categories, subjects) {
    var ctrl = this;
    ctrl.categories = categories;
    ctrl.subjects = subjects;
}

angular.
module('ksApp').
component('ksNavBar', {
    templateUrl: 'components/ks-nav-bar/ks-nav-bar.template.html',
    controller: [ 'categories', 'subjects', KsNavBarController ]
});