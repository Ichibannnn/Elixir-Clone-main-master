import React from 'react'
import { Box } from '@chakra-ui/react';

const PageScrollEditReceiving = ({ children }) => {
    return (
        <Box w="full" overflowY="auto" overflowX="auto" mt={4}
            minHeight="300px"
            maxHeight="700px"
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
    )
};

export default PageScrollEditReceiving