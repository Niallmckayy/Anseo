import React, { useEffect } from 'react';
import axios from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAddMapLayers } from '../../hooks/useAddMapLayers';
import mapboxgl from 'mapbox-gl';
import '../../index.css';
import { Listing, HighlightedLocation, Predictions } from '../../utils/types';
import { useMapInit } from '../../hooks/useMapInit';

interface MapProps {
  mapRef: React.RefObject<HTMLDivElement>;
  map: mapboxgl.Map | null;
  setMap: React.Dispatch<React.SetStateAction<mapboxgl.Map | null>>
  selectedBoroughs: string[];
  predictions: Predictions;
  filteredListings: Listing[];
  highlightedLocation: HighlightedLocation | null;
  reRenderPolygons: boolean;
  setReRenderPolygons: (reRenderPolygons: boolean) => void;
}

const Map: React.FC<MapProps> = ({
  mapRef,
  map, 
  setMap,
  selectedBoroughs,
  predictions,
  filteredListings,
  highlightedLocation,
  reRenderPolygons,
  setReRenderPolygons
}) => {
  const center: [number, number] = [-74.0060, 40.7128];
  const zoom: number = 10;
  const pitch: number = 55;

  console.log(filteredListings.length)
  useMapInit(mapRef, map, setMap, center[1], center[0], zoom, pitch);
  
  useEffect(() => {
    const fetchBoroughCoordinates = async (borough: string) => {
      try {
        const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${borough.toLowerCase()}.json`, {
          params: {
            access_token: mapboxgl.accessToken,
            proximity: '-74.0060,40.7128', 
          }
        });
        console.log(response)
        if (response.status !== 200) {
          throw new Error(response.statusText);
        }
        
        const coordinates = response.data.features[0].center;
        return coordinates;
      } catch (error) {
        console.error(`Error fetching coordinates for borough ${borough}: `, error);
        return null;
      }
    };

    const updateMapCenter = async () => {
      if (selectedBoroughs.length === 1 && selectedBoroughs[0] !== 'No preference') {
        const coordinates = await fetchBoroughCoordinates(selectedBoroughs[0]);
        console.log('coords ' + coordinates)
        if (coordinates) {
          map && map.flyTo({ center: coordinates, zoom: 11 });
        }
      } else {
        console.log('center' + center)
        map && map.flyTo({ center, zoom });
      } 
    };

    updateMapCenter();
  }, [selectedBoroughs]);
  
  // Custom hook to add map layers including highlighted location
  useAddMapLayers(
    map, 
    selectedBoroughs, 
    predictions, 
    filteredListings, 
    highlightedLocation,
    reRenderPolygons,
    setReRenderPolygons,
  );

  return <div ref={mapRef} className="flex-1 min-h-[50vh] w-full" />;
};

export default Map;
