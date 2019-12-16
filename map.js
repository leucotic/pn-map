
// -------- Make the map --------

var mymap = L.map('mapid', {
    minZoom: 2,
    maxZoom: 18
}).setView([39.96467, -75.213446], 14);

var maptiles = new L.StamenTileLayer("watercolor");

var labels = new L.StamenTileLayer("toner-labels");

mymap.addLayer(maptiles);
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
    goodsG = L.layerGroup(),
    careG = L.layerGroup(),
    financialG = L.layerGroup(),
    legalG = L.layerGroup(),
    ostG = L.layerGroup(),
    otherG = L.layerGroup(),
    allG = L.layerGroup();

// -------- Output PN Map Data -------

var orgsLink = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSu_F9uodWU7mO3Yfs3JjrrpGSbMJMAThWqKJcCrAgKWYnUoMf1D9dsLM9W1pAazLChWUCcYMzdhzjM/pub?output=tsv";
var servicesLink = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJ29Xzh0j_ZZJApMKWeJI8GrhD6I8MONzRhJEfMKT6UBPqRzJi0J9I95KpFwoxuwfeClNAEVarYXy1/pub?output=tsv";

getData(orgsLink, newfunx);

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
    console.log(orgs);
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
    var marker = L.marker([org.Latitude, org.Longitude]);
    addToLayers(org, marker);

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

function addToLayers(org, marker){
  
  console.log(org.Name, org.serviceTypes.length, org.serviceTypes);
  allG.addLayer(marker);
  if (org.serviceTypes.length == 0) org.serviceTypes.push("other");
  org.serviceTypes.forEach(service =>{
    let layerName = service.toLowerCase() + "G";
    console.log(layerName);
    eval(layerName).addLayer(marker);
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

var baseMaps = {
    "<b>Show All</b>": allG,
    "Housing": housingG,
    "Education": educationG,
    "Employment": employmentG,
    "Health": healthG,
    "Behavioral Health": behavioralG,
    "Food": foodG,
    "Clothing & Goods": goodsG,
    "Financial Services": financialG,
    "Legal Aid": legalG,
    "Out of School Time": ostG,
    "Other": otherG
};

var overlayMaps = {};
L.control.layers(baseMaps, overlayMaps).addTo(mymap);

allG.addTo(mymap);

