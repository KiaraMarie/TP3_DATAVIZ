class Map {
  constructor(type = "station", day = null) {
    this.type = type;
    this.day = day;
    this.map = {};
    this.data = {};
    this.stations = [];
  }

  day() { return this.day };
  map() { return this.map };
  data() { return this.data };
  stations() { return this.station };

  load(path) {
    d3.json(path).then((datas) => {
      this.data = datas;
      this.drawStationsMarker();
    }).catch(console.error);
    this.map = L.map('map').setView(
      [46.1314365, -2.4344083],
      6
    );
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoiYXJjaGFub24iLCJhIjoiY2pzZWQ2MzZhMHgyMzQ0dGJ6bmZ0eDZ2MyJ9.wIBJkbtgVXo_mlSPYJDa-A'
    }).addTo(this.map);
    this.map.locate({ setView: true, maxZoom: 10 });
    this.map.on('locationfound', (e) => {
      let radius = e.accuracy;
      L.circle(e.latlng, radius).addTo(this.map);
    });
  }

  drawStationsMarker() {
    let stations = this.stations;
    let map = this.map;
    let day = this.day;
    let type = this.type;
    let exists = false;
    this.data.forEach(data => {
      data.station.forEach(station => {
        stations.forEach(s => {
          if (s.n === station.n) {
            exists = true;
          }
        });
        if (exists === false) {
          stations.push({
            lat: station.lat,
            lng: station.lng,
            n: station.n
          });
        }
      });
    });
    if (type === "station") {
      stations.forEach(station => {
        let popupContent = document.createElement('div');

        let stationName = document.createElement('div');
        stationName.appendChild(document.createTextNode(station.n.toLowerCase()));

        let stationControl = document.createElement('button');
        stationControl.className = "btn btn-info";
        stationControl.appendChild(document.createTextNode("Voir"));
        stationControl.id = station.n;
        stationControl.onclick = this.stationControlAction.bind(this);

        popupContent.appendChild(stationName);
        popupContent.appendChild(stationControl);

        L.marker([station.lat, station.lng])
          .bindPopup(popupContent)
          .addTo(map);
      });
    }
    else if(type === "meteo") {
      this.data[day].station.forEach(station => {

        let markerHTML = document.createElement('div');
        let stationT =  document.createElement('div');
        stationT.appendChild(document.createTextNode(Math.round(station.t / 100)));
        stationT.className = "text-center font-weight-bold";
        let precipitation = station.p;
        let sunIcon = document.createElement('img');
        let cloudIcon = document.createElement('img');
        let rainIcon = document.createElement('img');

        sunIcon.src = "./img/iconfinder_Sunny_3741356.png";
        cloudIcon.src = "./img/iconfinder_Overcast_3741359.png";
        rainIcon.src = "./img/iconfinder_Light_Rain_3741355.png";

        sunIcon.height = "32";
        cloudIcon.height = sunIcon.height;
        rainIcon.height = cloudIcon.height;

        if(precipitation === 0) {
            markerHTML.appendChild(sunIcon);
        }
        else if(precipitation < 1) {
          markerHTML.appendChild(cloudIcon);
        }
        else {
          markerHTML.appendChild(rainIcon);
        }

        markerHTML.appendChild(stationT);

        L.marker([station.lat, station.lng], {
          icon: new L.DivIcon({
              className: 'map-t',
              html: markerHTML.innerHTML
          })
        }).addTo(map);
      });
    }
  }

  stationControlAction(e) {
    console.log(this.day);
    d3.json("./data/meteo.json")
    .then((datas, id, day) => {

      drawTempStation(datas, e.target.id, this.day);
      drawPluviStation(datas, e.target.id, this.day);
    }).catch(console.error);
  }
}
