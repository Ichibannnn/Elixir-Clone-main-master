import { Flex, Table, Text, Th, Thead } from "@chakra-ui/react";
import React from "react";
import { Outlet } from "react-router-dom";

const MainContent = () => {
  return (
    <Flex w="full" h="100%" bg="#ffff">
      <Outlet />
    </Flex>

    // <div>MainContent</div>
  );
};

export default MainContent;
