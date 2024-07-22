import { useState } from "react";
import { motion } from "framer-motion";
import { Indexes, Listing, Neighbourhood, Rankings, UserResult } from "../../utils/types";
import UserOptionsHeader from "./UserOptionsHeader";
import NeighbourhoodCardGrid from "./NeighbourhoodCardGrid";
import NeighbourhoodDetails from "./NeighbourhoodDetails";
import UserFavourites from "./UserFavourites";
import UserHistory from "./UserHistory";

interface NeighbourhoodContainerProps {
    neighbourhoods: Neighbourhood[]
    handleLearnMore: (neighbourhood: Neighbourhood) => void
    selectedNeighbourhood: Neighbourhood | null
    filteredListings: Listing[]
    filteredRankings: Rankings | undefined
    filteredIndexes: Indexes | undefined    
    isClosing: boolean
    userHistory: UserResult[] | null
    handleClose: () => void
    handleListingClick: (listing: Listing) => void
}

const NeighbourhoodContainer: React.FC<NeighbourhoodContainerProps> = ( 
    { 
        neighbourhoods, 
        handleLearnMore,
        selectedNeighbourhood,
        filteredListings,
        filteredRankings,
        filteredIndexes,
        isClosing,
        handleClose,
        handleListingClick,
        userHistory
     }) => {
    const [activeBtn, setActiveBtn] = useState<string | null>('Results');

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setActiveBtn(e?.currentTarget.textContent);
    }

    return (
        <div className="flex flex-col w-full lg:w-[50%] min-h[calc(100vh-5rem)] bg-user-sidebar-purple-light overflow-auto shadow-md">
          <UserOptionsHeader 
          activeBtn={activeBtn}
          handleClick={handleClick} />
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col h-full w-full overflow-y-scroll no-scrollbar md:scrollbar px-2"
          >  

        {selectedNeighbourhood && 
            <NeighbourhoodDetails
            neighbourhood={selectedNeighbourhood}
            listings={filteredListings} 
            rankings={filteredRankings}
            indexes={filteredIndexes}
            isClosing={isClosing}
            onClose={handleClose}
            onListingClick={handleListingClick}
            /> 
          }
           
        {!selectedNeighbourhood ? activeBtn === 'Results' &&
        <NeighbourhoodCardGrid
        neighbourhoods={neighbourhoods}
        handleLearnMore={handleLearnMore}
        /> : ''}

        {!selectedNeighbourhood ? activeBtn === 'Favourites' &&
        <UserFavourites /> : ''}

        {!selectedNeighbourhood ? activeBtn === 'History' && 
        <UserHistory 
        userHistory={userHistory}
        /> : ''}

        </motion.div>
          </div>
      )
    }
export default NeighbourhoodContainer