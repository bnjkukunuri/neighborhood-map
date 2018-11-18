import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import { resolve } from 'path';

class App extends Component {

  state = {
    venues: []
  }
  componentDidMount(){
    this.getMarkers();
  }

  renderMap = () => {
    loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyARNE-73x5xv5USWIGi_gbkaWHpwQ-X0ow&callback=initMap')
    window.initMap = this.initMap;
  }

  // Initialize and add the map
  initMap = () => {
    // The location of Uluru
    let uluru = {lat: 37.000, lng: -118.000};
    // The map, centered at Uluru
    let map = new window.google.maps.Map(
        document.getElementById('map'),
        { zoom: 6, center: uluru });
    // Create An InfoWindow
    var infowindow = new window.google.maps.InfoWindow();

    // The marker, positioned at Uluru
    this.state.venues.map(venue => {
      let contentString = `${venue.venue.name}`;

      let marker = new window.google.maps.Marker(
        {
          position: {
          lat: venue.venue.location.lat,
          lng: venue.venue.location.lng
          },
          map: map,
          title: venue.venue.name
        });

      marker.addListener('click', () => {
        // Change the content
        infowindow.setContent(contentString);

        // Open An InfoWindow
        infowindow.open(map, marker);
      });
    });
  }

  getMarkers = () => {
    const endpoint = 'https://api.foursquare.com/v2/venues/explore?';
    const params = {
      client_id: "QHTNVLEETPN2YOQO3NQGVRHNXCTD02BNUULMUBMR0SFVE5HK",
      client_secret: "LFR2SJIN5BW4EFE3LUXX0HYJRHERBOF5OISGDRAJMXKH3YR4",
      query: "camp fire",
      near: "California",
      v: "20181118"
    };

    axios.get(endpoint + new URLSearchParams(params))
      .then(result => this.setState(
        { venues: result.data.response.groups[0].items }, this.renderMap()))
      .catch(error => console.log(error));
  }

  render() {
    return (
      <main>
        <div id="map"></div>
      </main>    
    )
  }
}

const loadScript = (mapApiUrl) => {
  let index = window.document.getElementsByTagName('script')[0];
  let script = window.document.createElement('script');
  script.src = mapApiUrl;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script,index);
}

export default App;
