//Generate the Map
var myMap = L.map("map").setView([45.52, -95.67], 2);

//Get the world tiles
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw", {
  maxZoom: 18,
  id: "mapbox.outdoors"
}).addTo(myMap);

//Grab the json data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", d => {

	//Json is full of random stuff. Isolate the quakes data as an array
	quakes = d.features;

	//Run through the array to add the markers/circles
	quakes.forEach(quake => {

		//Grab all the quake's data before doing L.circle. Just looks cleaner
		var q_location = quake.geometry.coordinates;
		var q_magnitude = quake.properties.mag;

		//Customizing our little circles
		L.circle(q_location, {
			fillOpacity: 0.75,
			color: "black",
			fillColor: getColor(q_magnitude),
			radius: q_magnitude * 50000,
			weight: 1
		}).bindPopup(
			"<h1>" + q_magnitude + "</h1>"
		)
		.addTo(myMap);

	});

	//Adding in the legend
	var legend = L.control({position: 'bottomright'});

	// This is copypasta code. I honestly have no idea why .onAdd is a property of
	// something that is returned by L.control(); and this is the only way to add
	// a legend to Leaflet?
	// :shrugs:

	legend.onAdd = function (map) {

		//Again, copy pasted. What the heck is L.DomUtil? I guess it must be something
		//used to create custom divs within the map.
		var div = L.DomUtil.create('div', 'info legend'),
			grades = [0, 1, 2, 3, 4, 5],
			labels = [];

		// Looping through the magnitudes and appending the HTML to the legend div
		// for every single grade. 
		for (var i = 0; i < grades.length; i++) {
			div.innerHTML +=

			//This part is pretty clever to be honest. Taken from the 
			//leaflet chloropleth tutorial. But it's a clever way to write
			// 0-1, 1-2, etc etc but ending in 5+
				'<i style="background:' + getColor(grades[i]) + '"></i> ' +
				grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
		}

		return div;
	};

	legend.addTo(myMap);



});

//Oh yeah, our color function.
function getColor(magnitude){
	if(magnitude >= 5){
		return "maroon"
	} else if (magnitude >= 4) {
		return "red";
	} else if (magnitude >= 3) {
		return "olive";
	} else if (magnitude >= 2) {
		return "orange";
	} else if (magnitude >= 1) {
		return "yellow";
	} else {
		return "lime";
	}
}

