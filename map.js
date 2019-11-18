
// -------- Make the map --------

var mymap = L.map('mapid').setView([39.96467, -75.213446], 14);

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

mymap.on('click', onMapClick);

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

getData(orgsLink, newfunx);
// setTimeout(function(){
  
// },300)


function getData(url, func){
    data = Papa.parse(url, {
    download: true,
    delimiter: "\t", 
    newline: "",  
    quoteChar: '"',
    escapeChar: '"',
    header: true,
    complete: function(results, file){
      return func(results.data);
      }
    });
}

var orgs;
function newfunx(data){
  orgs = data;
  getData(servicesLink, main);
}


function main(data){
  // let services = data;
  orgs = restructureData(orgs, data);
  mapOrgs(orgs);
}

function restructureData(orgs, services){
    orgs.forEach(org => {
    org.services = [];
    org.serviceTypes = [];
  });
    console.log(services);
  services.forEach(service =>{
    for(let org of orgs){
      if(org.Name == service.OrgName){
          org.services.push(service);
          if(!org.serviceTypes.includes(service.Type))
          org.serviceTypes.push(service.Type);
      }
    }
  });
  return orgs;
}

function mapOrgs(data){
	
	data.forEach(org => {
    var marker = L.marker([org.Latitude, org.Longitude]).addTo(mymap);

    let section = document.createElement('div');
    section.classList.add("popup");
    let name = addText('h1', org.Name, section);
    let address = addText('a', org.Address, section);
    address.href ="https://www.google.com/maps/place/" + org.Address.replace(/ /g, '+');
    address.style.display = 'block';
    let website = addText('a', org.Website, section);
    website.href = org.Website;
    let servicesDiv = section.appendChild(document.createElement('div'));
    let servicesTitle = addText('h2', "Services", servicesDiv)

    org.services.forEach(service=> {
      let servDiv = section.appendChild(document.createElement('div'));
      let servName = addText('h3', service.Name, servDiv);
      // let togglebtn = addText('span', ' show/hide details', servDiv);
      // togglebtn.classList.add('togglebtn');
      // togglebtn.onclick = toggleClass;
      let details = servDiv.appendChild(document.createElement('div'));
      details.classList.add('details');
      let servDescription = addText('p', service.Description, details);

    })
    
    marker.bindPopup(section);
	});
}

function toggleClass(){
  let mydiv = this.parentElement;
  if(mydiv.classList.contains("open")){
    mydiv.classList.remove("open");
  }else mydiv.classList.add("open");
  let blep = mydiv.classList;
  console.log("clicked", blep);
}

function addText(type, text, place){
    let element = place.appendChild(document.createElement(type));
    element.appendChild(document.createTextNode(text));
    return element;

}

function makeMarker(org) {
      // let currentLayer = eval(org.Type +"G")
      // currentLayer.addLayer(markers[markerid]);
      // console.log(markerid);
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



