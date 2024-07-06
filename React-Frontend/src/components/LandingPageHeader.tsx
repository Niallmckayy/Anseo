import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

/**
 * Header Component
 *
 * This component renders the Header component.
 * It includes styled buttons for navigating to the login and sign-up pages.
 *
 *
 * @returns The Header component
 */

// Declare component
const Header: React.FC = () => {
  // useNavigate is a hook from the react-router-dom for programmatic navigation
  const navigate = useNavigate();

  return (
    // Container div for the header buttons with absolute positioning and spacing
    <div className="hidden md:block">
      <div
        className="hidden md:block absolute top-10 left-1/2 transform -translate-x-1/2 text-5xl font-bold"
        style={{ fontFamily: "Fredoka One", color: "#DEDA6D" }}
      >
        ANSEO
      </div>
      <div className="absolute top-4 right-10 flex space-x-4">
        {/* "Log in" button */}
        <Button
          variant="outlined"
          sx={{
            borderColor: "white", // White border colour
            color: "white", // White text colour
            borderRadius: "20px", // Rounded corner
            padding: "0.25rem 1rem", // Padding inside the button
          }}
          onClick={() => navigate("/sign-in")} // Navigate to log in on click
        >
          Log in
        </Button>
        {/* "Sign up" button */}
        <Button
          variant="contained"
          color="error" // Red Colour
          sx={{ backgroundcolor: "red", color: "white", borderRadius: "5px" }}
          // backroundcolor: redbackground colour
          // color: White text colour
          // borderRadius: Rounded corners
          onClick={() => navigate("/sign-up")} // Navigate to sign in on click
        >
          Sign up
        </Button>
      </div>
    </div>
  );
};

export default Header;
