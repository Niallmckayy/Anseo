import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconButton, Typography, Box, Grid, Rating } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Bar, Radar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler 
} from 'chart.js';
import { Listing as ListingType, Rankings, Indexes, Neighbourhood } from '../../utils/types';
import Listing from './Listing';

// Register all necessary Chart.js components at once
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler
);

interface NeighbourhoodDetailsProps {
  neighbourhood: Neighbourhood
  listings: ListingType[];
  rankings: Rankings | undefined;
  indexes: Indexes | undefined;
  isClosing: boolean;
  onClose: () => void;
  onListingClick: (listing: ListingType) => void;
}

const NeighbourhoodDetails: React.FC<NeighbourhoodDetailsProps> = ({ neighbourhood, listings, rankings, indexes, isClosing, onClose, onListingClick }) => {

  const demographicData = {
    labels: [
      'Population Density', 
      'Young People', 'Middle Aged People', 'Older People', 
      'Male Index', 'Female Index', 
      'Age Diversity', 'Gender Diversity'
    ],
    datasets: [{
      label: 'Demographic Rankings',
      data: rankings ? [
        rankings.population_density_Rank,
        rankings.index_percPop_0_5_Rank,
        rankings.index_percPop_6_11_Rank,
        rankings.index_percPop_12_17_Rank,
        rankings.male_index_Rank,
        rankings.female_index_Rank,
        rankings.age_evenness_index_Rank,
        rankings.gender_diversity_index_Rank,
        
      ] : [],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }]
  };

  const economicData = {
    labels: ['Employment Health', 'Annual Earnings', 'Housing Affordability', 'Safety', 'Business Index'],
    datasets: [{
      label: 'Economic and Social Rankings',
      data: rankings ? [
        rankings.Normalized_Employment_Health_Index_Rank,
        rankings.Annual_Earnings_Index_Rank,
        rankings.Housing_Affordability_Index_Rank,
        rankings.Safety_Index_Rank,
        rankings.business_index_Rank
      ] : [],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    }]
  };

  const demographicRadarData = {
    labels: ['Population Density', 'Young People', 'Middle Aged People', 'Older People', 
             'Male Index', 'Female Index', 'Age Diversity', 'Gender Diversity'],
    datasets: [{
      label: 'Demographic Indexes',
      data: indexes ? [
        indexes.population_density, indexes.index_percPop_0_5, indexes.index_percPop_6_11, indexes.index_percPop_12_17,
        indexes.male_index, indexes.female_index, indexes.age_evenness_index, indexes.gender_diversity_index
      ] : [],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 2,
      fill: true
    }]
  };
  
  const economicRadarData = {
    labels: ['Employment Health', 'Annual Earnings', 'Housing Affordability', 'Safety', 'Business Index'],
    datasets: [{
      label: 'Economic and Social Indexes',
      data: indexes ? [
        indexes.Normalized_Employment_Health_Index, indexes.Annual_Earnings_Index,
        indexes.Housing_Affordability_Index, indexes.Safety_Index, indexes.business_index
      ] : [],
      backgroundColor: 'rgba(53, 162, 235, 0.2)',
      borderColor: 'rgba(53, 162, 235, 1)',
      borderWidth: 2,
      fill: true
    }]
  };

  return (
    <AnimatePresence>
      {!isClosing && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.5 }}
          className={` bg-user-sidebar-purple-light shadow-lg p-6 z-50 overflow-y-auto`}
        >
          <div className="flex justify-end">
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <Typography variant="h4" component="h2" gutterBottom style={{ fontWeight: 'bold', color: '#3B447A', fontFamily: 'Alegreya' }}>
            {neighbourhood.name}
          </Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {neighbourhood.borough}
          </Typography>
          <Box display="flex" alignItems="center" mt={1} mb={2} gap={1}>
            <Rating 
              name="Neighbourhood Rating" 
              value={neighbourhood.rating} 
              precision={0.1} 
              readOnly
              sx={{
                fontFamily: 'Commissioner',
                color: '#2D345D',
              }}
             />
              <Typography variant="body2" style={{ 
                color: '#2D345D',
                fontFamily: 'Commissioner',
                fontWeight: 500
              }}>{neighbourhood.rating.toFixed(2)}
               </Typography>
              </Box>
          <Typography variant="body1" paragraph>
            {neighbourhood.description}
          </Typography>
          <Typography variant="h5" component="h3" gutterBottom>
            Why this neighbourhood?
          </Typography>
          <Typography variant="h5" component="h3" gutterBottom>Demographic Rankings</Typography>
          <Box sx={{ height: 300, display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ width: '45%' }}>
              <Bar data={demographicData} options={{ maintainAspectRatio: false }} />
            </Box>
            <Box sx={{ width: '45%' }}>
              <Radar data={demographicRadarData} options={
                { 
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      ticks: {
                        display: false
                      }
                    }
                  },
                }
                } />
            </Box>
          </Box>

          {/* Economic and Social Rankings with Radar Chart */}
          <Typography variant="h5" component="h3" gutterBottom>Economic and Social Rankings</Typography>
          <Box sx={{ height: 300, display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ width: '45%' }}>
              <Bar data={economicData} options={{ maintainAspectRatio: false }} />
            </Box>
            <Box sx={{ width: '45%' }}>
              <Radar data={economicRadarData} options={
                { 
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      ticks: {
                        display: false
                      }
                    }
                  },
                }
              } />
            </Box>
          </Box>

          <Typography variant="h5" component="h3" gutterBottom>
            Available listings
          </Typography>
          {listings.length > 0 ? (
            <Box display="flex" overflow="auto">
              <Grid
                container
                spacing={2}
                style={{ flexWrap: "nowrap", overflowX: "auto" }}
              >
                {listings.map((listing) => (
                  <Listing listing={listing} onListingClick={onListingClick} />
                ))}
              </Grid>
            </Box>
          ) : (
            <Typography variant="body2">
              {" "}
              Currently no listings available
            </Typography>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NeighbourhoodDetails;