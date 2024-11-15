import { Predictions, UserHistory as UserHistoryType } from "../../utils/types";
import { motion } from "framer-motion";
import { IconButton } from "@mui/material";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Replay } from "@mui/icons-material";
import NeighbourhoodRating from "./NeighbourhoodRating";
import InfoTool from "./Infotool";

interface UserHistoryProps {
    userHistory: UserHistoryType[] | null;
    handleReRenderPolygons: (selectedBoroughs: string[], predictions: Predictions) => void;
}

interface UserHistoryContainerProps {
    col?: boolean;
    children: React.ReactNode;
}

interface UserHistoryHeadingProps {
    title: string;
}
interface UserHistoryItemProps {
    content: string;
}

const UserHistoryContainer: React.FC<UserHistoryContainerProps> = ({ children }) => {
    return (
        <div className="flex flex-col items-center justify-center">
            {children}
        </div>
    )
}
const UserHistoryHeading: React.FC<UserHistoryHeadingProps> = ({title}) => {
    return (
        <>
        <h4 className="font-alegreya text-primary-text-dark md:text-lg">{title}</h4>
        </>
    )
}

const UserHistoryItem: React.FC<UserHistoryItemProps> = ({content}) => {
    return (
        <>
        <span className="font-commissioner font-[500] text-sm md:text-base text-shaded-grey" >{content}</span>
        </>
    )
}

const UserHistory: React.FC<UserHistoryProps> = ({ userHistory, handleReRenderPolygons }) => {
    if (!userHistory) {
        return (
            <div>
                <h1>No User History</h1>
            </div>
        );
    }
    
    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}>
        <SignedOut>
            <div className="flex items-center justify-center w-full h-full p-4">
            <h1 className="font-alegreya text-shaded-grey text-4xl text-center italic font-light">Create an account to access data from previous questionnaire results</h1>
            </div>
            </SignedOut>
            <SignedIn>
            <div className="flex flex-col gap-6 p-4">
        {userHistory && userHistory.map( (
            {   resultId, 
                predictions, 
                selectedBoroughs, 
                topNeighbourhoodName, 
                topNeighbourhoodRating, 
                timestamp }) => {
            return (
                <motion.div 
                whileHover={{ scale: 1.02 }}
                key={resultId} 
                className="flex flex-col md:flex-row bg-white p-4 border-b-[1px] gap-4 
                items-center justify-evenly border-b-primary-text-dark  
                shadow-md cursor-pointer rounded-lg">
                
                <UserHistoryContainer>
                    <UserHistoryHeading title="Date"/>
                    <UserHistoryItem content={new Date(timestamp).toLocaleString().slice(0,10)}/>
                </UserHistoryContainer>

                <UserHistoryContainer>
                <UserHistoryHeading title="Selected Boroughs"/>
                    {selectedBoroughs.map( (borough: string, index) => {
                        return (
                            <>
                                <UserHistoryItem key={`${resultId}-borough-${index}-${Math.random()}`} content={borough} /> 
                            </>
                        )
                    })
                }
                </UserHistoryContainer>

                <UserHistoryContainer col>
                    <UserHistoryHeading title="Top Location"/>
                    <UserHistoryItem content={topNeighbourhoodName}/>
                </UserHistoryContainer>

                <UserHistoryContainer col>
                    <UserHistoryHeading title="Highest Rating"/>
                    <NeighbourhoodRating rating={topNeighbourhoodRating} />
                </UserHistoryContainer>
                
                <UserHistoryContainer>
                <InfoTool title="Load previous results"> 
                <IconButton 
                onClick={() => handleReRenderPolygons(selectedBoroughs, predictions)}
                sx={{
                    fontSize: '2rem',
                        color: '#3B447A',
                        "&:hover": {
                                backgroundColor: "#E8EAF6",
                        }
                }}>
                    <Replay />
                    </IconButton>
                </InfoTool>
                </UserHistoryContainer>
                </motion.div>
            );
        })}
        </div>
            </SignedIn>
            </motion.div>
        );
}
export default UserHistory;