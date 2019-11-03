
// -------- Make the map --------

var mymap = L.map('mapid').setView([39.962131, -75.201477], 15);

var basemaplayer = new L.StamenTileLayer("watercolor", {
});
    mymap.addLayer(basemaplayer);
var labels = new L.StamenTileLayer("terrain-labels", {
  // detectRetina: true
    // zoomOffset: -10
});
    mymap.addLayer(labels);

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}

// mymap.on('click', onMapClick);

// Layer Groups
var housingG = L.layerGroup(),
    educationG = L.layerGroup(),
    employmentG = L.layerGroup(),
    healthG = L.layerGroup(),
    behavioralG = L.layerGroup(),
    foodG = L.layerGroup(),
    clothingG = L.layerGroup(),
    careG = L.layerGroup(),
    financialG = L.layerGroup(),
    legalG = L.layerGroup(),
    OSTG = L.layerGroup(),
    otherG = L.layerGroup();


// -------- Output PN Map Data -------

var orgsLink = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSu_F9uodWU7mO3Yfs3JjrrpGSbMJMAThWqKJcCrAgKWYnUoMf1D9dsLM9W1pAazLChWUCcYMzdhzjM/pub?output=tsv";
var servicesLink = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJ29Xzh0j_ZZJApMKWeJI8GrhD6I8MONzRhJEfMKT6UBPqRzJi0J9I95KpFwoxuwfeClNAEVarYXy1/pub?output=tsv";

getData(orgsLink);

function getData(url){
    data = Papa.parse(url, {
    download: true,
    delimiter: "", 
    newline: "",  
    quoteChar: '"',
    escapeChar: '"',
    header: true,
    complete: function(results, file){
      return main(results.data);
      }
    });
}

function main(data){
  console.log("gotten");
    mapOrgs(data);
  console.log(data);


}

function mapOrgs(data){
	
	data.forEach(org => {
    console.log(org);
    var marker = L.marker([org.Latitude, org.Longitude]).addTo(mymap);
    let section = document.createElement('div');
    let name = section.appendChild(document.createElement('h2'));
    name.appendChild(document.createTextNode(org.Name));
    let address = section.appendChild(document.createElement('p'));
    address.appendChild(document.createTextNode(org.Address));
    let website = section.appendChild(document.createElement('a'));
    website.appendChild(document.createTextNode(org.Website));
    website.href = org.Website;
    marker.bindPopup(section);

	// 	var markerid = business.Name.replace(/[^a-zA-Z ]/g, "");
 //      makeMarker(business, markerid);
 //    business.markerid = markerid;
	// var popupName = "<b>"+ business.Name + "</b>";
	// 	var popupAddress = "<br>" + business.Address;
 //    var gmapslink = '<br><a href=https://www.google.com/maps/place/' + business.Address.replace(/ /g, '+') + "/' target='_blank'>Directions</a>";
 //  	markers[markerid].bindPopup(popupName + popupAddress + gmapslink);
    // makeRow(business);
	});
}

function makeMarker(org) {
      // let currentLayer = eval(org.Type +"G")
      // currentLayer.addLayer(markers[markerid]);
      // console.log(markerid);
}

// var myTable = document.getElementById("tablediv");

function makeRow(business) {
  var rowName = "<b>"+ business.Name + "</b>";
  var rowAddress = "<br>" + business.Address;
  var div = document.createElement('div');
  myTable.appendChild(div);
  div.setAttribute('class', 'location');
  var divtitle = '<h4>' + business.Name + '</h4>';
  var gmapslink = '<br><a href=https://www.google.com/maps/place/' + business.Address.replace(/ /g, '+') + "/' target='_blank'>Directions</a>";
  var locateBusiness = '<a class="cellx" href="#' + business.markerid + '" ' + 'id="' + business.markerid + '_">Find on Map</a>';
  // clicky(locateBusiness, business);
  div.innerHTML = divtitle + rowAddress + gmapslink + " | " + locateBusiness;
  div.className = business.Type;

}

function clicky(locateBusiness, business) { // locate corresponding marker and activate popup
      locateBusiness.onclick = function(){
        var mID = business.id.slice(0, -1); // remove the extra underscore
        console.log(mID);
        mymap._layers[mID].fire('click');
        mymap.setView([business.Latitude, business.Longitude]);
        console.log("clicked", mID);
        // window.scrollTo(0, 0);
        // x[i].parentElement.setAttribute('class', 'show');
        locateBusiness.classList.toggle("show"); // toggling the details info display
      };
  }

function removeLoader(){
  let loader = document.querySelector('.loading');
  // loader.remove();
}


// businesses.addTo(mymap);

    // GroceryG.addTo(mymap);
    // RestaurantsG.addTo(mymap);
    // FinanceG.addTo(mymap);
    // ApparelG.addTo(mymap);
    // HomeG.addTo(mymap);
    // LaundryG.addTo(mymap);
    // ElectronicsG.addTo(mymap);
    // CommunityG.addTo(mymap);
    // BeautyG.addTo(mymap);
    // HealthG.addTo(mymap);
    // MiscellaneousG.addTo(mymap);
    // ArtsG.addTo(mymap);


// var baseMaps = {
//     "Map": basemaplayer
// };

// var overlayMaps = {
//     // "Grocery": GroceryG,
//     // "Restaurants": RestaurantsG
// };




// let layerControl = L.control.layers(baseMaps, overlayMaps, {collapsed:false}).addTo(mymap);
// $('.leaflet-control-layers').on('mouseleave', () => {
//     layerControl.collapse();
// });
// $('.leaflet-control-layers-toggle').on('mouseenter', () => {
//     layerControl.expand();
// });

