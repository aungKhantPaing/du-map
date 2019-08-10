
// Materialized Sidebar and Collapsibles 
document.addEventListener('DOMContentLoaded', function () {
  var sideNavElem = document.querySelector('.sidenav');
  M.Sidenav.init(sideNavElem);

  var collapsibleElem = document.querySelector('.collapsible');
  var collapsibleInstance = M.Collapsible.init(collapsibleElem, function onOpenStart() {
      // added custom code for dropdown animation
  });

  var tabs = document.querySelectorAll('.tabs');
  var tabInstance = M.Tabs.init(tabs, {});
});

