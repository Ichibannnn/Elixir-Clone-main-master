import { Flex, useMediaQuery } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import MainContent from "./MainContent";
import Header from "./Header";
import Sidebar from "./New-Sidebar";
// import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import PageScrollModalErrorList from "./PageScrollModalErrorList";
import PageScroll from "../utils/PageScroll";
import AppScroll from "./Appscroll";

const MainContainer = ({
  notification,
  fetchNotification,
  notificationWithParams,
  fetchNotificationWithParams,
}) => {
  const [navBarData, setNavbarData] = useState([]);
  const [isMobile] = useMediaQuery("(max-width: 1100px)");
  const [sidebarHandler, setSidebarHandler] = useState(false);

  const toggleSidebar = () => {
    setSidebarHandler((prev) => !prev);
  };

  useEffect(() => {
    setSidebarHandler(isMobile);
  }, [isMobile]);

  return (
    <Flex bgColor="white" h="100vh">
      {!sidebarHandler && (
        <Sidebar
          setNavbarData={setNavbarData}
          notification={notification}
          fetchNotification={fetchNotification}
          notificationWithParams={notificationWithParams}
          fetchNotificationWithParams={fetchNotificationWithParams}
        />
      )}
      <AppScroll>
        <Flex flexDirection="column" width="full">
          <Header toggleSidebar={toggleSidebar} />
          {/* <Navbar navBarData={navBarData} /> */}
          <MainContent />
        </Flex>
      </AppScroll>
    </Flex>
  );
};

export default MainContainer;
