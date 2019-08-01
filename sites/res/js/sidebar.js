
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
    var collapsibleElem = document.querySelector('.collapsible');
    var collapsibleInstance = M.Collapsible.init(collapsibleElem, function onOpenStart(){
        
    });
    var tabs = document.querySelectorAll('.tabs');
    var instance = M.Tabs.init(tabs, {
    });
});