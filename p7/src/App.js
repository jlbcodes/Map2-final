import React, { Component } from 'react';
import './App.css';

import axios from 'axios'

class App extends Component {

  state = {
    venues: []
  }

  componentDidMount() {
    this.getVenues()
  }

  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDVUC3xdtnjZHRBBBXacMv35ScFuZX9qSc&callback=initMap")
    window.initMap = this.initMap
  }

  getVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id: "LMONO5JP4GHDNPSWTKINXK1H0UFUNWJA4FIO4A0TS5BY4UZ2",
      client_secret: "4ND5NVPRKMDUXVUINITJM3YU3WSX2FG0UKVE4WN2ZHGXEENZ",
      query: "food",
      near: "Denver",
      v: "20183010"
    }

    axios.get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState({
          venues: response.data.response.groups[0].items
        }, this.renderMap())
      })
      .catch(error => {
        console.log("ERROR!! " + error)
      })
  }

  initMap = () => {
    var map = new window.google.maps.Map(document.getElementById('map'), {
        center: {lat: 39.740162, lng: -104.992518},
        zoom: 12
    })

    //creates an InfoWindow
    var infowindow = new window.google.maps.InfoWindow()

    //displays dynamic markers
    this.state.venues.map(myVenue => {

      var contentString = `${myVenue.venue.name}${myVenue.venue.location.formattedAddress}`


      //Creates a Marker
      var marker = new window.google.maps.Marker({
         position: {lat: myVenue.venue.location.lat, lng: myVenue.venue.location.lng},
         map: map,
         title: myVenue.venue.name
      })

      //Click on a Marker
      marker.addListener('click', function() {

      //Change the InfoWindow contentString
      infowindow.setContent(contentString)

      //Open an InfoWindow
      infowindow.open(map, marker);
      });

    })
  }

  render() {
    return (
      <main>
        <div id="map"></div>
      </main>
    );
  }
}

/*<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"
    async defer></script>*/

function loadScript(url) {
  var index = window.document.getElementsByTagName('script')[0]
  var script = window.document.createElement("script")
  script.src =url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
}

export default App;