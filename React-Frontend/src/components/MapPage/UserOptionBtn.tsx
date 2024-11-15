import { Button } from '@mui/material';
import { motion } from 'framer-motion';

interface UserOptionBtnProps {
    title: string;
    isActive?: boolean;
    handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const UserOptionBtn: React.FC<UserOptionBtnProps> = ({ title, isActive, handleClick }) => {
    return (
        <>
        <Button 
        component={motion.button}
        whileHover={{ 
            scale: 1.05 ,
        }}
        animate={{
            backgroundColor: isActive ? '#D1D6F5' : '#FFFFFF',
            color: isActive ? '#3B447A' : '#ABB0B4',
            transition: { duration: 0.1, ease: "easeInOut" },
        }}
        sx={{
            fontFamily: 'Commissioner',
            borderRadius: 4,
            fontSize: 'inherit',
            textTransform: 'none',
            fontWeight: isActive ? 600 : 500,
        }}
        className={`${isActive ? 'active' : ''} `}
        onClick={handleClick}>
            {title}
        </Button>
        </>
    )
}
export default UserOptionBtn;