import { Box } from "@chakra-ui/react";
import React from "react";

const PageScroll = ({ children, minHeight, maxHeight, minWidth, maxWidth }) => {
  return (
    <Box
      w="full"
      overflowY="auto"
      overflowX="auto"
      // height="auto"
      minHeight={minHeight ? minHeight : "150px"}
      maxHeight={maxHeight ? maxHeight : "480px"}
      minWidth={minWidth ? minWidth : "150px "}
      maxWidth={maxWidth ? maxWidth : "full"}
      sx={{
        "&::-webkit-scrollbar": {
          height: "5px",
          width: "5px",
          borderRadius: "1px",
          backgroundColor: `rgba(0, 0, 0, 0.05)`,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#A8A8A8",
        },
      }}
    >
      {children}
    </Box>
  );
};

export default PageScroll;
