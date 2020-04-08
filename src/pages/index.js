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