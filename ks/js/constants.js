var categories = [
    {title:"Adventure"},
    {title:"Map"},
    {title:"Guides"},
    {title:"Battle"}];

var output="#container", template="#raccon";

var ractive = new Ractive({
  el: output,
  template: template,
  data: { categories: categories }
});
