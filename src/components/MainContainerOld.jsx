import { Flex, useMediaQuery } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import MainContent from "./MainContent";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const MainContainer = () => {
  const [navBarData, setNavbarData] = useState([]);
  const [isMobile] = useMediaQuery("(max-width: 1220px)");
  const [sidebarHandler, setSidebarHandler] = useState(false);
  // const [toggleSidebar, setToggleSidebar] = useState(false)

  const toggleSidebar = () => {
    setSidebarHandler((prev = !prev));
  };

  useEffect(() => {
    setSidebarHandler(isMobile);
  }, [isMobile]);

  return (
    <Flex bgColor="background" h="100vh">
      {!sidebarHandler && <Sidebar setNavbarData={setNavbarData} />}

      <Flex flexDirection="column" width="full">
        <Header toggleSidebar={toggleSidebar} />
        <Navbar navBarData={navBarData} />
        <MainContent />
      </Flex>
    </Flex>
  );
};

export default MainContainer;
