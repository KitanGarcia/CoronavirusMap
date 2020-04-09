import React from 'react';
import Helmet from 'react-helmet';
import L from 'leaflet';
import axios from 'axios';


import Layout from 'components/Layout';
import Container from 'components/Container';
import Map from 'components/Map';


const LOCATION = {
  lat: 38.9072,
  lng: -77.0369
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 2;



const IndexPage = () => {

  /**
   * mapEffect
   * @description Fires a callback once the page renders
   * @example Here this is and example of being used to zoom in and set a popup on load
   */

  async function mapEffect({ leafletElement: map} = {}) {
    let response;

    try {
      response = await axios.get('https://corona.lmao.ninja/countries');
    }
    catch (e) {
      console.log(`Failed to fetch countries": ${e.message}`, e);
      return;
    }

    //destructure response.
    //Equivalent to const data = response.data;
    const {data = []} = response;
    //data is now a list of countries as below:
    //[{"country":"USA","countryInfo":{"_id":840,"iso2":"US","iso3":"USA","lat":38,"long":-97,"flag":"https://raw.githubusercontent.com/NovelCOVID/API/master/assets/flags/us.png"},"updated":1586326293551,"cases":400540,"todayCases":205,"deaths":12857,"todayDeaths":16,"recovered":21711,"active":365972,"critical":9169,"casesPerOneMillion":1210,"deathsPerOneMillion":39,"tests":2082431,"testsPerOneMillion":6291}, ...]
    console.log(data);

    //boolean if data is an array and is not empty
    const hasData = Array.isArray(data) && data.length > 0;

    if (!hasData) return;

    /***GeoJSON Format***/
    /*
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [125.6, 10.1]
        },
        "properties": {
          "name": "Dinagat Islands"
        }
      }
    */
    /***GeoJSON Format***/
    
    //loop through features
    //For each country, obtain lat and lng to create a point on the map
    const geoJson = {
      type: 'FeatureCollection',
      features: data.map((country = {}) => {
        //countryInfo = country.info
        const {countryInfo = {} } = country;
        //lat = countryInfo.lat; lng = countryInfo.long;
        const {lat, long: lng } = countryInfo;
        return {
          type: 'Feature',
          properties: {
          //... spread syntax means the iterable (array in this case) is expanded to its individual elements
            ...country,
          },
          geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          }
        }
      })
    }
    console.log("GEOJSON");
    //By expanding the output below and inserting into geojson.io, we get a marker that appears
    console.log(geoJson);
    /*LOOKS LIKE THIS IN GEOJSON.IO
{
  "type": "Feature",
  "geometry": {
    "coordinates": [-97, 38],
    "type": "Point"
  },
  "properties": {
    "active": 397442,
    "cases": 435128,
    "casesPerOneMillion": 1315,
    "country": "USA",
    "countryInfo": {
      "flag": "https://raw.githubusercontent.com/NovelCOVID/API/master/assets/flags/us.png",
      "iso2": "US",
      "iso3": "USA",
      "lat": 38,
      "long": -97,
      "_id": 840
    },
    "critical": 9279,
    "deaths": 14795,
    "deathsPerOneMillion": 45,
    "recovered": 22891,
    "tests": 2209041,
    "testsPerOneMillion": 6674,
    "todayCases": 201,
    "todayDeaths": 7,
    "updated": 1586409093924
  }
}
    */

  }

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'OpenStreetMap',
    zoom: DEFAULT_ZOOM,
    mapEffect
  };

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
      </Helmet>

      <Map {...mapSettings}>
      </Map>

      <Container type="content" className="text-center home-start">
        <h2>Still Getting Started?</h2>
        <p>Run the following in your terminal!</p>
        <pre>
          <code>gatsby new [directory] https://github.com/colbyfayock/gatsby-starter-leaflet</code>
        </pre>
        <p className="note">Note: Gatsby CLI required globally for the above command</p>
      </Container>
    </Layout>
  );
};

export default IndexPage;
