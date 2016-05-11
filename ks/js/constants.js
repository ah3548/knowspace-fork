var categories = [
    {title:"Adventure"},
    {title:"Map"},
    {title:"Guides"}];

var output="#container", template="#raccon";

var ractive = new Ractive({
  el: output,
  template: template,
  data: { categories: categories, subjects: subjects }
});

