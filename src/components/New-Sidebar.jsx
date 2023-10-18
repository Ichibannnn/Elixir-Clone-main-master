import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import request from "../services/ApiClient";
import { decodeUser } from "../services/decode-user";
import { Context } from "./context/Context";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Flex,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import PageScroll from "../utils/PageScroll";
import { ChevronRightIcon } from "@chakra-ui/icons";

const currentUser = decodeUser();

const fetchTagModuleApi = async () => {
  const currentSelectedRole = currentUser?.role;
  const res = await request.get(
    `Role/GetRoleModuleWithId/${currentSelectedRole}`
  );
  return res.data;
};

//Main
const Sidebar = ({
  notification,
  fetchNotification,
  notificationWithParams,
  fetchNotificationWithParams,
}) => {
  return (
    <Flex
      h="100vh"
      width="15rem"
      bg="primary"
      color="#D1D2D5"
      justifyContent="space-between"
      flexDirection="column"
    >
      <Flex flexDirection="column" w="full">
        <SidebarHeader />
        <SidebarList
          notification={notification}
          fetchNotification={fetchNotification}
          notificationWithParams={notificationWithParams}
          fetchNotificationWithParams={fetchNotificationWithParams}
        />
      </Flex>
      <SidebarFooter />
    </Flex>
  );
};

export default Sidebar;

//Navigation
const SidebarList = ({
  notification,
  fetchNotification,
  notificationWithParams,
}) => {
  const { pathname } = useLocation();
  const [tagModules, setTagModules] = useState([]);
  const { menu, setMenu } = useContext(Context);
  const [focusedAccordion, setFocusedAccordion] = useState(null); // New state to keep track of focused accordion panel

  const fetchTagged = () => {
    fetchTagModuleApi(tagModules).then((res) => {
      const unique = [];
      const map = new Map();
      for (const item of res) {
        if (!map.has(item.mainMenuId)) {
          map.set(item.mainMenuId, true);
          const submenu = res.filter(
            (s) =>
              s.mainMenuId === item.mainMenuId && s.subMenu !== item.mainMenu
          );
          unique.push({
            mainMenuId: item.mainMenuId,
            mainMenu: item.mainMenu,
            path: item.menuPath,
            subMenu: submenu.map((sub) => {
              return {
                title: sub.subMenu,
                path: sub.moduleName,
              };
            }),
          });
        }
      }
      setTagModules(unique);
    });
  };

  useEffect(() => {
    fetchTagged();

    return () => {
      setTagModules([]);
    };
  }, []);

  const sideBars = [
    {
      title: "Borrowed Requests",
      notifcation: notification?.getAllBorrowed?.getAllBorrowed,
    },
    {
      title: "Returned Requests",
      notifcation: notification?.returnedApproval?.forreturnedApprovalcount,
    },
    {
      title: "View Request",
      notifcation: notificationWithParams?.allBorrowedCount?.allBorrowed,
    },
    {
      title: "View Return Materials",
      notifcation:
        notificationWithParams?.returnedApproved?.returnedApprovecount,
    },
    {
      title: "Warehouse Receiving",
      notifcation: notification?.poSummary?.posummarycount,
    },
    {
      title: "Preparation Schedule",
      notifcation: notification?.orderingAll?.orderingnotifallcount,
    },
    {
      title: "Approval",
      notifcation: notification?.orderingApprovalAll?.orderingapprovalallcount,
    },
    {
      title: "Move Order Issue",
      notifcation: notification?.moveOrderlistAll?.moveorderlistallcount,
    },
    {
      title: "Transact Move Order",
      notifcation: notification?.transactmoveorder?.transactmoveordercount,
    },
    {
      title: "For Approval MO",
      notifcation:
        notification?.forApprovalMoveOrderAll?.forapprovalmoveorderallcount,
    },
  ];

  return (
    <Flex w="full">
      <PageScroll minHeight="auto" maxHeight="550px">
        <Accordion allowToggle w="full">
          {tagModules?.map((sidebarMenu, i) => (
            <AccordionItem
              key={i}
              border="none"
              fontWeight="semibold"
              _focus={{ outline: "none" }}
            >
              <AccordionButton
                w="full"
                onClick={() => {
                  setMenu(sidebarMenu.subMenu);
                  setFocusedAccordion(i); // Set focusedAccordion to the current index
                }}
                fontSize="xs"
                justifyContent="flex-start"
                bgColor={pathname.includes(sidebarMenu.path) ? "accent" : ""}
                color={focusedAccordion === i ? "blue.600" : "white"} // Change font color when focused
                _hover={{
                  bg: "whiteAlpha.200",
                  color: "white",
                }}
              >
                {/* Tab style to the left of the font */}
                <Box
                  w="4px" // Adjust the tab width based on focus
                  h="20px"
                  bgColor={focusedAccordion === i ? "blue.600" : "transparent"}
                />
                <Box flex="1" pl={2}>
                  <Text
                    fontWeight="semibold"
                    textAlign="start"
                    // color={focusedAccordion === i ? "blue.300" : "white"}
                  >
                    {sidebarMenu.mainMenu}
                  </Text>
                </Box>

                <AccordionIcon color="white" />
              </AccordionButton>
              {/* </Link> */}
              <AccordionPanel bgColor="secondary" p={2} gap={5}>
                <PageScroll minHeight="auto" maxHeight="160px">
                  {menu?.map((sub, j) => (
                    <Link to={sub.path} key={sub.path}>
                      <HStack
                        w="full"
                        flexDirection="row"
                        justifyContent="space-between" // Align sub.title from the sidebarMenu.mainMenu
                        p={2}
                        fontSize="xs"
                        bgColor={
                          pathname.includes(sub.path) ? "blue.600" : "secondary"
                        }
                        textAlign="left"
                        borderStyle={
                          pathname.includes(sub.path) ? "groove" : "dashed"
                        }
                        _focus={{ bg: "btnColor" }}
                        _hover={{
                          bg: "whiteAlpha.200",
                          color: "white",
                        }}
                        color={focusedAccordion === i ? "white" : "primary"}
                      >
                        {/* <Box w="10px" /> */}
                        <Text ml={3}>{sub.title}</Text>

                        {sideBars.map((side, i) =>
                          !pathname.includes(sub.path)
                            ? sub.title === side.title && (
                                <Badge
                                  fontSize="10px"
                                  key={i}
                                  variant="solid"
                                  colorScheme="red"
                                  mb={1}
                                >
                                  {side.notifcation === 0
                                    ? ""
                                    : side.notifcation}
                                </Badge>
                              )
                            : ""
                        )}
                      </HStack>
                    </Link>
                  ))}
                </PageScroll>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </PageScroll>
    </Flex>
  );
};

//Header
const SidebarHeader = () => {
  return (
    <Flex
      h="150px"
      flexDirection="column"
      alignItems="center"
      gap={1}
      mt={3}
      pt={2}
    >
      <Image
        boxSize="100px"
        objectFit="cover"
        src="/images/elixirlogos.png"
        alt="etheriumlogo"
        mt={1}
      />
      <Text className="logo-title" mt={-1}>
        ELIXIR ETD
      </Text>
    </Flex>
  );
};

//Footer
const SidebarFooter = () => {
  return (
    <Flex h="40px" fontSize="10px" textAlign="center" p={2}>
      © 2023, Elixir ETD Powered by Process Automation (MIS)
    </Flex>
  );
};
