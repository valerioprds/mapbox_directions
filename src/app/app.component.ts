import { Component, OnInit } from '@angular/core';
import { environment } from 'enviroments/environment';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'map_directions';

  map?: mapboxgl.Map; // Using a more concise optional type syntax
  style = 'mapbox://styles/mapbox/streets-v11'; // Fixed the path here
  lat = 12.0911;
  lng = 85.8511;
  zoom = 10;

  //41.733540418351495, 12.286741957722258

  constructor() {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken; // Fixed typo here
  }

  ngOnInit(): void {
    this.buildMap();
  }

  buildMap() {
    const navControl = new mapboxgl.NavigationControl({ visualizePitch: true });

    let geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
    });

    const directions = new MapboxDirections({
      unit: 'metric',
      profile: 'mapbox/driving',
      container: 'directions',
      bearing: true,
      steps: true,
      voice_instructions: true,
      controls: {
        inputs: true,
        instructions: true,
        profileSwitcher: true,
      },
    });

    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: this.zoom,
      center: [this.lng, this.lat],
      attributionControl: false,
    });

    this.map.addControl(directions, 'top-left');

    this.map.addControl(navControl, 'top-right');

    this.map.addControl(geolocate, 'top-right');

    this.map.on('load', function () {
      geolocate.trigger();
    });

/*     this.map.on('load', function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          directions.setOrigin([
            position.coords.longitude,
            position.coords.latitude,
          ]);
        });
      }
    }); */

    geolocate.on('geolocate', locateUser);

    // scaling control:
    this.map.addControl(new mapboxgl.ScaleControl(), 'bottom-right');

    // full screen control:
    this.map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
  }
}

function locateUser(e: any) {
  console.log('Lng :' + e.coords.longitude + '' + 'Lat :' + e.coords.latitude);
}
