import React, { useState, Fragment } from "react";
import ReactDOM from "react-dom";

// We will use these things from the lib
// https://react-google-maps-api-docs.netlify.com/
import {
  useLoadScript,
  GoogleMap,
  Marker,
  InfoWindow
} from "@react-google-maps/api";

function App() {
  // The things we need to track in state
  const [mapRef, setMapRef] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markerMap, setMarkerMap] = useState({});
  const [center, setCenter] = useState({ lat: 44.076613, lng: -98.362239833 });
  const [zoom, setZoom] = useState(5);
  const [clickedLatLng, setClickedLatLng] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [ping, setPing] = useState(null);
  const move = 10;

  // Load the Google maps scripts
  const { isLoaded } = useLoadScript({
    // Enter your own Google Maps API key
    googleMapsApiKey: ""
  });

  // The places I want to create markers for.
  // This could be a data-driven prop.

  const myPlaces = [
    { id: "place1", pos: { lat: 30.286232867660136, lng: -97.73679425928522 } },
    { id: "place2", pos: { lat: 30.28611624982507, lng: -97.73936561475675 } },
    { id: "place3", pos: { lat: 30.274911121404806, lng: -97.7392464727527 } },
    { id: "place4", pos: { lat: 30.306232867660136, lng: -97.76679425928522 } },
    { id: "place5", pos: { lat: 30.318611624982507, lng: -97.70936561475675 } },
    { id: "place6", pos: { lat: 30.294911121404806, lng: -97.7392464727527 } }
  ];

  // Iterate myPlaces to size, center, and zoom map to contain all markers
  const fitBounds = (map) => {
    const bounds = new window.google.maps.LatLngBounds();
    myPlaces.map((place) => {
      bounds.extend(place.pos);
      return place.id;
    });
    map.fitBounds(bounds);
  };

  const loadHandler = (map) => {
    // Store a reference to the google map instance in state
    setMapRef(map);
    // Fit map bounds to contain all markers
    fitBounds(map);
  };

  // We have to create a mapping of our places to actual Marker objects
  const markerLoadHandler = (marker, place) => {
    return setMarkerMap((prevState) => {
      return { ...prevState, [place.id]: marker };
    });
  };

  const markerClickHandler = (event, place) => {
    // Remember which place was clicked
    setSelectedPlace(place);

    // Required so clicking a 2nd marker works as expected
    if (infoOpen) {
      setInfoOpen(false);
    }

    setInfoOpen(true);

    // If you want to zoom in a little on marker click
    if (zoom < 13) {
      setZoom(13);
    }

    // if you want to center the selected Marker
    //setCenter(place.pos)
  };

  console.log(clickedLatLng);

  // myPlaces[0].pos = que;

  const renderMap = () => {
    return (
      <Fragment>
        <GoogleMap
          // Do stuff on map initial laod
          onLoad={loadHandler}
          // Save the current center position in state
          onCenterChanged={() => setCenter(mapRef.getCenter().toJSON())}
          // Save the user's map click position
          onClick={(e) => setClickedLatLng(e.latLng.toJSON())}
          // onClick={(e) => setClickedLatLng(e.lat.toJSON())}

          center={center}
          zoom={zoom}
          mapContainerStyle={{
            height: "100vh",
            width: "100%"
          }}
        >
          {myPlaces.map((place) => (
            <Marker
              key={place.id}
              position={place.pos}
              onLoad={(marker) => markerLoadHandler(marker, place)}
              onClick={(event) => markerClickHandler(event, place)}
              // Not required, but if you want a custom icon:
              icon={{
                path:
                  "M12.75 0l-2.25 2.25 2.25 2.25-5.25 6h-5.25l4.125 4.125-6.375 8.452v0.923h0.923l8.452-6.375 4.125 4.125v-5.25l6-5.25 2.25 2.25 2.25-2.25-11.25-11.25zM10.5 12.75l-1.5-1.5 5.25-5.25 1.5 1.5-5.25 5.25z",
                fillColor: "#2a00aa",
                fillOpacity: 1.0,
                strokeWeight: 0,
                scale: 1.25
              }}
            />
          ))}
          <Marker
            position={clickedLatLng}
            name={"clicked"}
            icon={{
              path:
                "M12.75 0l-2.25 2.25 2.25 2.25-5.25 6h-5.25l4.125 4.125-6.375 8.452v0.923h0.923l8.452-6.375 4.125 4.125v-5.25l6-5.25 2.25 2.25 2.25-2.25-11.25-11.25zM10.5 12.75l-1.5-1.5 5.25-5.25 1.5 1.5-5.25 5.25z",
              fillColor: "#9f9f00",
              fillOpacity: 1.0,
              strokeWeight: 0,
              scale: 1.25
            }}
          />
          {infoOpen && selectedPlace && (
            <InfoWindow
              anchor={markerMap[selectedPlace.id]}
              onCloseClick={() => setInfoOpen(false)}
            >
              <div>
                <h3>{selectedPlace.id}</h3>
                <div>This is your info window content</div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        {/* Position of the user's map click */}
        {selectedPlace && <h3>Selected Marker: {selectedPlace.id}</h3>}
      </Fragment>
    );
  };

  return isLoaded ? renderMap() : null;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
