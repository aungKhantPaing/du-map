var departments = JSON.parse(getJSON('https://gist.githubusercontent.com/aungKhantPaing/269702071bfccc161534e72f631ed787/raw/ff0d21813588cbbe615650562fd8596ab68dddcc/departments.geojson'));
var department_area = JSON.parse(getJSON('https://gist.githubusercontent.com/aungKhantPaing/b768a6011cc5f93bdb7228074697ab76/raw/c2b01bdd087997212fcdfbc63a19f3e46b7996ac/department-area.geojson'));





function getJSON(url) {
    var resp ;
    var xmlHttp ;

    resp  = '' ;
    xmlHttp = new XMLHttpRequest();

    if(xmlHttp != null)
    {
        xmlHttp.open( "GET", url, false );
        xmlHttp.send( null );
        resp = xmlHttp.responseText;
    }

    return resp ;
}