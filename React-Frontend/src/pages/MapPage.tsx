import React, { useState, useEffect } from "react";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { motion } from "framer-motion";
import { Button, Grid, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";
import Header from "../components/General/Header";
import "../index.css";
import { environment } from "../../mapbox.config";
import Map from "../components/MapPage/Map";
import LocationCard from "../components/MapPage/LocationCard";
import LocationDetails from "../components/MapPage/LocationDetails";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useQuestionnaire } from "../context/QuestionnaireProvider";

mapboxgl.accessToken = environment.mapbox.accessToken;

export interface Neighbourhood {
  name: string;
  borough: string;
  description: string;
  rating: number;
  coordinates: [number, number];
  photoPath: string;
  zipcode: string;
  neighbourhood_id: number;
}

export interface Listing {
  id: number;
  listingDetails: string;
  link: string;
  imageUrl: string;
  lat: string;
  lng: string;
  neighbourhoodId: number;
}

export interface Rankings {
  neighbourhood_id: number;
  population_density_Rank: number;
  index_percPop_0_5_Rank: number;
  index_percPop_6_11_Rank: number;
  index_percPop_12_17_Rank: number;
  male_index_Rank: number;
  female_index_Rank: number;
  Normalized_Employment_Health_Index_Rank: number;
  Annual_Earnings_Index_Rank: number;
  Housing_Affordability_Index_Rank: number;
  Safety_Index_Rank: number;
  age_evenness_index_Rank: number;
  gender_diversity_index_Rank: number;
  business_index_Rank: number;
}

export interface Indexes {
  neighbourhood_id: number;
  population_density: number;
  index_percPop_0_5: number;
  index_percPop_6_11: number;
  index_percPop_12_17: number;
  male_index: number;
  female_index: number;
  Normalized_Employment_Health_Index: number;
  Annual_Earnings_Index: number;
  Housing_Affordability_Index: number;
  Safety_Index: number;
  age_evenness_index: number;
  gender_diversity_index: number;
  business_index: number;
}

export interface PredictionResponse {
  predictions: { [zipcode: string]: number };
}

export interface HighlightedLocation {
  lat: number;
  lng: number;
}

const MapPage: React.FC = () => {
  const fastURL = import.meta.env.VITE_FAST_URL;
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const frontendURL = import.meta.env.VITE_FRONTEND_URL;
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { data, isQuestionnaireCompleted, setQuestionnaireDefault, dummyData } =
    useQuestionnaire();
  const [selectedBoroughs, setSelectedBoroughs] = useState<string[]>([]);
  const [predictions, setPredictions] = useState<PredictionResponse>({
    predictions: {},
  });
  const [neighbourhoods, setNeighbourhoods] = useState<Neighbourhood[]>([]);
  const [selectedNeighbourhood, setSelectedNeighbourhood] =
    useState<Neighbourhood | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isClosing, setIsClosing] = useState(false);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [rankingsData, setRankingsData] = useState<Rankings[]>([]);
  const [highlightedLocation, setHighlightedLocation] =
    useState<HighlightedLocation | null>(null);
  const [indexData, setIndexData] = useState<Indexes[]>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();

  useEffect(() => {
    console.log("selected boroughs:", selectedBoroughs);
    const fetchPredictions = async () => {
      if (!isLoaded) {
        return;
      }
      if (isLoaded) {
        console.log("Clerk has finished loading");
        setIsPageLoaded(true);
      }
      try {
        // if (dummyData) {
        //   console.log('test: dummy data');
        //   const payload = {
        //     'data': {
        //       "businessType": "Industry_Commercial Lessor",
        //       "openHour": 8,
        //       "closeHour": 18,
        //       "budget": 20,
        //       "selectedAgeGroup": [
        //         11,
        //         59
        //       ],
        //       "ageImportance": 0.5,
        //       "selectedIncomeLevel": [
        //         18000,
        //         84000
        //       ],
        //       "incomeImportance": 0.5,
        //       "targetGroup": [
        //         "Singles"
        //       ],
        //       "proximityImportance": 0.5,
        //       "footfallImportance": 0.5,
        //       "surroundingBusinessesImportance": 0.5,
        //       "rentBudget": 500,
        //       "genderRatio": 0.5,
        //       "employmentStatus": [
        //         "Full Time"
        //       ],
        //       "homeValue": 50,
        //       "populationDensity": 0.5,
        //       "selectedBoroughs": [
        //         "Manhattan",
        //         "Brooklyn",
        //         "Queens"
        //       ],
        //       "areaType": [
        //         "Residential"
        //       ]
        //     }
        //   }
        //   const mlResponse = await fetch('http://localhost:8000/api/v1/predict', {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(payload),
        //   });

        //   console.log(JSON.stringify(
        //     {
        //       clerkUserId: user && user.id,
        //       results: payload
        //     }
        //   ));
        //   const dbResponse = await fetch(`http://localhost:8080/api/user-results/${user && user.id}`, {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(
        //       {
        //         clerkUserId: user && user.id,
        //         results: payload
        //       }
        //     )
        //   });

        //   if (!mlResponse.ok) {
        //     throw new Error('API response from ML Model was not ok.');
        //   }

        //   const predictions = await mlResponse.json();

        //   setPredictions(predictions);
        //   setSelectedBoroughs(payload.data.selectedBoroughs);
        //   setQuestionnaireDefault();

        //   if (!dbResponse.ok) {
        //     throw new Error('API response from DB was not ok.');
        //   }

        //   return;
        // }

        let payload;
        console.log(isSignedIn);
        if (isQuestionnaireCompleted()) {
          setSelectedBoroughs(data.selectedBoroughs);
          payload = { data };
          console.log(payload);
        }

        // continue as guest
        if (!isSignedIn && isQuestionnaireCompleted()) {
          console.log("test: continue as guest");
          const response = await fetch(`${fastURL}/api/v1/predict`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error("API response from ML Model was not ok.");
          }
          const predictions = await response.json();
          setPredictions(predictions);
          setQuestionnaireDefault();
          return;
        }

        // signed in and completed questionnaire
        if (isSignedIn && isQuestionnaireCompleted()) {
          console.log("test: signed in and completed questionnaire");
          const mlResponse = await fetch(`${fastURL}/api/v1/predict`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          const dbResponse = await fetch(
            `${backendURL}/api/v1/user-results/${user && user.id}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                clerkUserId: user && user.id,
                results: payload,
              }),
            },
          );

          if (!mlResponse.ok) {
            throw new Error("API response from ML Model was not ok.");
          }

          if (!dbResponse.ok) {
            throw new Error("API response from DB was not ok. " + dbResponse);
          }

          const predictions = await mlResponse.json();
          setPredictions(predictions);
          setQuestionnaireDefault();
          return;
        }

        // signed in and questionnaire not completed
        if (isSignedIn && !isQuestionnaireCompleted()) {
          console.log("test: signed in and questionnaire not completed");
          const dbResponse = await fetch(
            `${backendURL}/api/v1/user-results/${user && user.id}`,
          );

          const data = await dbResponse.json();

          console.log(data);
          console.log(data.results[0].results);

          // If user has no saved results in the database, redirect to welcome page
          if (data.results.length === 0) {
            navigate("/welcome");
            throw new Error(`Couldn't find user results in database: ${user}`);
          }

          const mlResponse = await fetch(`${fastURL}/api/v1/predict`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data.results[0].results),
          });

          if (!mlResponse.ok) {
            throw new Error("API response from ML Model was not ok.");
          } else {
            console.log("ML response was ok");
          }

          const predictions = await mlResponse.json();
          console.log(predictions);
          setPredictions(predictions);
          setSelectedBoroughs(data.results[0].results.data.selectedBoroughs);
          return;
        }

        // not signed in and questionnaire not completed
        if (!isSignedIn && !isQuestionnaireCompleted()) {
          console.log("test: not signed in and questionnaire not completed");
          navigate("/welcome");
        }
      } catch (error) {
        console.error("Error fetching predictions:", error);
      }
    };
    fetchPredictions();
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    const fetchPage = async (page: number) => {
      try {
        const response = await axios.get(
          `${backendURL}/api/v1/neighbourhoods?page=${page}`,
        );
        return response.data._embedded.neighbourhoods;
      } catch (error) {
        console.error(`Error fetching page ${page}:`, error);
        return [];
      }
    };

    const fetchAllLocations = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/v1/neighbourhoods`);
        const totalPages = response.data.page.totalPages;

        // Fetch all pages concurrently
        const allLocationsPromises = [];
        for (let page = 0; page < totalPages; page++) {
          allLocationsPromises.push(fetchPage(page));
        }

        const allLocationsArray = await Promise.all(allLocationsPromises);
        const allLocations = allLocationsArray.flat().map((location: any) => {
          const neighbourhood_id = location._links.self.href.split("/").pop();
          return {
            name: location.name,
            borough: location.borough,
            description: location.description,
            rating: 0, // default 0，will be updated by prediction
            coordinates: [-73.936, 40.686] as [number, number],
            photoPath: `/img/neighbourhoods/${location.name}.jpg`,
            zipcode: location.zipcode,
            neighbourhood_id: parseInt(neighbourhood_id, 10),
          };
        });

        return allLocations;
      } catch (error) {
        console.error("Error fetching all locations:", error);
        return [];
      }
    };

    const fetchLocations = async () => {
      const allLocations = await fetchAllLocations();

      // Filter locations based on selected boroughs
      const filteredLocations = selectedBoroughs.includes("No preference")
        ? allLocations
        : allLocations.filter((location) =>
            selectedBoroughs.includes(location.borough),
          );

      // normalize the value
      const predictionValues = Object.values(predictions?.predictions || {});
      const minPrediction = Math.min(...predictionValues);
      const maxPrediction = Math.max(...predictionValues);

      // update rating and sort，only show the top 10
      const updatedLocations = filteredLocations
        .map((location) => {
          const normalizedValue =
            predictions?.predictions[location.zipcode] !== undefined
              ? (predictions.predictions[location.zipcode] - minPrediction) /
                (maxPrediction - minPrediction)
              : 0;
          return { ...location, rating: normalizedValue * 5 };
        })
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 10);

      setNeighbourhoods(updatedLocations);
    };
    if (predictions) {
      fetchLocations();
    }
  }, [selectedBoroughs, predictions]);

  useEffect(() => {
    const fetchPage = async (page: number) => {
      try {
        const response = await axios.get(
          `${backendURL}/api/v1/listings?page=${page}`,
        );
        return response.data._embedded.listings;
      } catch (error) {
        console.error(`Error fetching page ${page}:`, error);
        return [];
      }
    };

    const fetchAllListings = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/v1/listings`);
        const totalPages = response.data.page.totalPages;

        // Fetch all pages concurrently
        const allListingsPromises = [];
        for (let page = 0; page < totalPages; page++) {
          allListingsPromises.push(fetchPage(page));
        }

        const allListingsArray = await Promise.all(allListingsPromises);
        const allListings = allListingsArray.flat().map((listing: any) => {
          const id = parseInt(listing._links.self.href.split("/").pop(), 10);
          return {
            id,
            listingDetails: listing.listingDetails,
            link: listing.link,
            imageUrl: listing.imageUrl,
            lat: listing.lat,
            lng: listing.lng,
            neighbourhoodId: listing.neighbourhoodId,
          } as Listing;
        });

        return allListings;
      } catch (error) {
        console.error("Error fetching all listings:", error);
        return [];
      }
    };

    const fetchIndexesData = async () => {
      try {
        const response = await axios.get("/final_index_data.json");
        console.log(response.data);
        if (Array.isArray(response.data)) {
          setIndexData(response.data);
        } else {
          throw new Error("Fetched data is not an array");
        }
      } catch (error) {
        console.error("Failed to fetch or parse indexes data:", error);
      }
    };
    fetchIndexesData();

    const fetchListings = async () => {
      const allListings = await fetchAllListings();

      setListings(allListings);
    };

    fetchListings();
    const fetchRankingsData = async () => {
      try {
        const response = await axios.get("/final_data_rankings.json");
        console.log(response.data); // Check what's actually being returned
        if (Array.isArray(response.data)) {
          setRankingsData(response.data);
        } else {
          throw new Error("Fetched data is not an array");
        }
      } catch (error) {
        console.error("Failed to fetch or parse rankings data:", error);
      }
    };
    fetchRankingsData();
  }, []);

  // function to convert zipcode to lat and lng
  const getCoordinatesByZipcode = async (zipcode: string) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${zipcode}.json`,
        {
          params: {
            access_token: mapboxgl.accessToken,
            proximity: "-74.0060,40.7128", // New York City coordinates
            limit: 1, // Limit the results to 1 to ensure you get the closest match
          },
        },
      );
      const coordinates = response.data.features[0].center;
      return coordinates;
    } catch (error) {
      console.error(
        `Error fetching coordinates for zipcode ${zipcode}:`,
        error,
      );
      return null;
    }
  };

  const handleLearnMore = async (neighbourhood: Neighbourhood) => {
    setSelectedNeighbourhood(neighbourhood);
    setIsClosing(false);
    // function for zoom in when clicked learn more
    const coordinates = await getCoordinatesByZipcode(neighbourhood.zipcode);
    console.log(coordinates);
    console.log(neighbourhood.zipcode);
    if (coordinates && mapInstance) {
      mapInstance.flyTo({ center: coordinates, zoom: 12 });
    }
  };

  const handleGetLocation = (name: string): Neighbourhood => {
    console.log(neighbourhoods);
    return neighbourhoods.find((neighbourhood) => neighbourhood.name === name)!;
  };

  const handleListingClick = (listing: Listing) => {
    setHighlightedLocation({
      lat: parseFloat(listing.lat),
      lng: parseFloat(listing.lng),
    });
    if (mapInstance) {
      mapInstance.flyTo({
        center: [parseFloat(listing.lng), parseFloat(listing.lat)],
        zoom: 14,
      });
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => setHighlightedLocation(null), 500);
    setTimeout(() => setSelectedNeighbourhood(null), 500);
  };

  const filteredListings = selectedNeighbourhood
    ? listings.filter(
        (listing) =>
          listing.neighbourhoodId === selectedNeighbourhood.neighbourhood_id,
      )
    : [];

  const filteredRankings = selectedNeighbourhood
    ? rankingsData.find(
        (ranking) =>
          ranking.neighbourhood_id === selectedNeighbourhood.neighbourhood_id,
      )
    : undefined;

  const filteredIndexes = selectedNeighbourhood
    ? indexData.find(
        (index) =>
          index.neighbourhood_id === selectedNeighbourhood.neighbourhood_id,
      )
    : undefined;

  // Not signed in and no questionnaire completed yet
  // if (!isSignedIn && !isQuestionnaireCompleted()) {
  //   return (
  //     <>
  //       <Navigate to="/" replace={true} />
  //     </>
  //   )
  // }

  // // Continue as guest
  // if (!isSignedIn && isQuestionnaireCompleted()) {
  //   return (
  //   <>
  //   <Navigate to="/" replace={true}/>
  //   </>
  //   );
  // }

  // // Signed in and completed questionnaire
  // if (isSignedIn && isQuestionnaireCompleted()) {
  //   return (
  //     <div>
  //       <h1>Welcome {user.fullName}</h1>
  //     </div>
  //   )
  // }

  // Signed in and not completed questionnaire
  // if (isSignedIn && !isQuestionnaireCompleted()) {
  //   return (
  //     <>
  //       <Navigate to="/welcome" replace={true} />
  //     </>
  //   )
  // }

  if (!isPageLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-screen"
      style={{ backgroundColor: "#E8EAF6" }}
    >
      <Header />
      <div className="flex flex-1 mt-20">
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5 }}
            className="hidden md:block w-1/2 overflow-y-auto bg-gray-100"
            style={{ backgroundColor: "#E8EAF6" }}
          >
            <div
              className="w-full"
              style={{ backgroundColor: "#D1D6F5", margin: 0, padding: 0 }}
            >
              <div
                className="flex justify-between items-center text-2xl py-2 px-4"
                style={{
                  backgroundColor: "#D1D6F5",
                  position: "sticky",
                  top: 0,
                }}
              >
                <span className="font-alegreya text-primary-text-dark font-bold">
                  Your Results
                </span>
                <Button variant="outlined">Filters</Button>
              </div>
            </div>
            <Box
              p={2}
              className="overflow-auto hide-scrollbar"
              style={{ maxHeight: "calc(100vh - 64px)" }}
            >
              <Grid container spacing={0}>
                {neighbourhoods.map((neigbhourhood, index) => (
                  <LocationCard
                    key={index}
                    location={neigbhourhood}
                    onLearnMore={handleLearnMore}
                    isBestMatch={index === 0}
                  />
                ))}
              </Grid>
            </Box>
          </motion.div>
        )}
        {/* Map for desktop on the right one-third */}
        {!isMobile && (
          <div className="w-full md:w-1/2 h-full absolute top-0 right-0">
            <Map
              selectedBoroughs={selectedBoroughs}
              handleSelectNeighbourhood={handleLearnMore}
              handleGetLocation={handleGetLocation}
              predictions={predictions}
              listings={filteredListings}
              highlightedLocation={highlightedLocation}
              setMapInstance={setMapInstance}
            />
          </div>
        )}
      </div>
      {isMobile && (
        <div className="block md:hidden flex-1">
          {/* Map for mobile display on the top half */}
          <div className="w-full h-80 z-10">
            <Map
              selectedBoroughs={selectedBoroughs}
              predictions={predictions}
              handleSelectNeighbourhood={handleLearnMore}
              handleGetLocation={handleGetLocation}
              listings={filteredListings}
              highlightedLocation={highlightedLocation}
              setMapInstance={setMapInstance}
            />
          </div>
          {/* Location on the bottom */}
          <div className="text-center text-2xl py-2 bg-gray-100 font-alegreya text-primary-text-dark font-bold">
            Your Results
          </div>
          <div className="w-full h-1/2 p-4 bg-gray-100 overflow-y-auto">
            <Box p={2}>
              <Grid container spacing={2}>
                {neighbourhoods.map((neighbourhood, index) => (
                  <LocationCard
                    key={index}
                    location={neighbourhood}
                    onLearnMore={handleLearnMore}
                    isBestMatch={index === 0}
                  />
                ))}
              </Grid>
            </Box>
          </div>
        </div>
      )}
      {/* Detail column when clicked learn more */}
      {selectedNeighbourhood && (
        <LocationDetails
          location={selectedNeighbourhood}
          listings={filteredListings} // pass filteredListings
          rankings={filteredRankings}
          indexes={filteredIndexes}
          isMobile={isMobile}
          isClosing={isClosing}
          onClose={handleClose}
          onListingClick={handleListingClick}
        />
      )}
    </div>
  );
};

export default MapPage;
