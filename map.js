
// -------- Make the map --------

var mymap = L.map('mapid', {
    minZoom: 2,
    maxZoom: 18
}).setView([39.9673942,-75.1979834], 14);

var maptiles = new L.StamenTileLayer("watercolor", {
  "attribution":  [
                'Map tiles by <a href="http://stamen.com/">Stamen Design</a>, ',
                'under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ',
                'Data by <a href="http://openstreetmap.org/">OpenStreetMap</a>, ',
                'under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
            ].join("")
});

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

// mymap.on('click', onMapClick);

// Layer Groups



var allServices = [];
var allLayerGroups = {};
var baseMaps = {};

// var housingG = L.layerGroup(),
//     educationG = L.layerGroup(),
//     employmentG = L.layerGroup(),
//     healthG = L.layerGroup(),
//     behavioral_healthG = L.layerGroup(),
//     foodG = L.layerGroup(),
//     goodsG = L.layerGroup(),
//     careG = L.layerGroup(),
//     financialG = L.layerGroup(),
//     legalG = L.layerGroup(),
//     ostG = L.layerGroup(),
//     case_managementG = L.layerGroup(),
//     otherG = L.layerGroup(),
//     allG = L.layerGroup();

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

function makeLayerGroups(services){
  for(let service of services){
    allLayerGroups[service] = L.layerGroup();
  }
  allLayerGroups["All"] = L.layerGroup();
}

function makeMap(groups, services){
  
  
  var overlayMaps = {};
  for (let s of services) {
  
    baseMaps[s] = groups[s];
  }
  baseMaps["All"] = groups['All'];
 
  var mycontrol = L.control.layers(baseMaps, overlayMaps, 
  {position: "topleft", collapsed:false}).addTo(mymap);

}

function main(data){
  // let services = data;
  orgs = restructureData(orgs, data);
  makeLayerGroups(allServices);
  makeMap(allLayerGroups, allServices);

  mapOrgs(orgs);
  baseMaps['All'].addTo(mymap);
}

function restructureData(orgs, services){
    orgs.forEach(org => {
    org.services = [];
    org.serviceTypes = [];
  });
  
  services.forEach(service =>{
    let pushed = false;
    for(let org of orgs){
      if(org.Name === service.OrgName && org.Latitude && org.Longitude){
          org.services.push(service);
          pushed = true;
          if(!org.serviceTypes.includes(service.Type))
          org.serviceTypes.push(service.Type);
        if(!allServices.includes(service.Type)){
          allServices.push(service.Type);
        }
      }
    }
    if (pushed == false){
      console.log("org not found: ", service.OrgName)
    }
  });
  return orgs;
}

function createOrgPopup(org){
  var marker = L.marker([org.Latitude, org.Longitude]);
    addToLayers(org, marker);

    let section = document.createElement('div');
    // $(section).addClass("popup")
    section.classList.add("popup");
    // $(section).append('h1').text(org.Name);
    let name = addText('h1', org.Name, section);
    let address = addText('a', `${org.Address}`, section);
    address.href ="https://www.google.com/maps/place/" + org.Address.replace(/ /g, '+');
    address.style.display = 'block';
    let website = addText('a', `${org.Website}`, section);
    website.href = org.Website;
    website.style.display = 'block';
    let phone = addText('a', org.Phone, section);
    phone.href = "tel: " +org.Phone;
    phone.style.display = 'block';
    let servicesDiv = section.appendChild(document.createElement('div'));
    let servicesTitle = addText('h2', "Services:", servicesDiv)

    org.services.forEach(service=> {
      let servDiv = section.appendChild(document.createElement('div'));
      let servName = addText('h3', service.Name, servDiv);
      let servHours = addText('p', `${service.Hours ? `Hours: ${service.Hours}`: "" }`, servDiv);
      let servPhone = addText('p', `${service.Phone ? `Phone: ${service.Phone}`: "" }`, servDiv);
      let servDemographics = addText('p', `${service.Demographics ? `Demographics: ${service.Demographics}`: "" }`, servDiv);
      let servAccess = addText('p', `${service.Accessibility ? `Accessibility: ${service.Accessibility}`: "" }`, servDiv);
      let servElig = addText('p', `${service.Eligibility ? `Eligibility: ${service.Eligibility}`: "" }`, servDiv);
      let servCost = addText('p', `${service.Cost ? `Cost: ${service.Cost}`: "" }`, servDiv);
      let servDocuments = addText('p', `${service.Documents ? `Documents: ${service.Documents}`: "" }`, servDiv);
      // let togglebtn = addText('span', ' show/hide details', servDiv);
      // togglebtn.classList.add('togglebtn');
      // togglebtn.onclick = toggleClass;
      // let details = servDiv.appendChild(document.createElement('div'));
      // details.classList.add('details');
      let servDescription = addText('p', `${service.Description ? `Description: ${service.Description}`: "" }`, servDiv);

    });
    
    marker.bindPopup(section);
}

function mapOrgs(data){
	
	data.forEach(org => {
    
    if(org.Latitude && org.Longitude){
      createOrgPopup(org);
    } else {
      console.log("missing", org);
    }
    
	});
}



function addToLayers(org, marker){
  
  baseMaps['All'].addLayer(marker);
  if (org.serviceTypes.length == 0) org.serviceTypes.push("other");
  org.serviceTypes.forEach(service =>{
    baseMaps[service].addLayer(marker);
  });
}

function toggleClass(){
  let mydiv = this.parentElement;
  if(mydiv.classList.contains("open")){
    mydiv.classList.remove("open");
  }else mydiv.classList.add("open");
  let blep = mydiv.classList;
  // console.log("clicked", blep);
}

function addText(type, text, place){
    let element = place.appendChild(document.createElement(type));
    element.appendChild(document.createTextNode(text));
    return element;
}

// $('#iframe').append(`<iframe src="https://www.google.com/maps/place/${"111 N 49th St, Philadelphia, PA 19139".replaceAll(" ", "+")}"></iframe>`);
// $('#iframe').append(`<iframe src="https://www.google.com/maps/place/111+N+49th+St,+Philadelphia,+PA+19139/" id="iView" style="width:300px;height:200px;border:dotted 1px red" frameborder="0"></iframe>`);

// $(".submit").click(function()
//                 {
//                     $('<iframe>');  // Create an iframe element
//                     $('<iframe />', {
//                         name: 'frame1',
//                         id: 'frame1',
//                         src: 'https://www.google.com/maps/place/111+N+49th+St,+Philadelphia,+PA+19139/'
//                     }).appendTo('#iframe');
//                 });



