import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Flex,
  Select,
  VStack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import request from "../../services/ApiClient";
import { BsBookmarkDashFill, BsBookmarkPlusFill } from "react-icons/bs";
import { ToastComponent } from "../../components/Toast";

const DrawerTaggingComponent = ({ isOpen, onClose, taggingData, onOpen }) => {
  const [mainMenu, setMainMenu] = useState([]);
  const [moduleId, setModuleId] = useState("");
  const [untagModules, setUntagModules] = useState([]);
  const [tagModules, setTagModules] = useState([]);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const onCloseDrawer = () => {
    setIsOpenDrawer(false);
  };

  const toast = useToast();

  // FETCH MAIN MENU
  const fetchMainMenuApi = async () => {
    const res = await request.get(`Module/GetAllActiveMainMenu`);
    return res.data;
  };

  // GET/SHOW MAIN MENU
  const getMainMenuHandler = () => {
    fetchMainMenuApi().then((res) => {
      setMainMenu(res);
    });
  };

  useEffect(() => {
    getMainMenuHandler();
  }, []);

  console.log(tagModules);

  const moduleStatusHandler = (data) => {
    if (data) {
      setModuleId(data);
    }
  };

  //FETCH UNTAGGED MODULES
  const fetchUntaggedApi = async (moduleId) => {
    const roleId = taggingData?.roleId;
    const res = await request.get(
      `Role/GetUntagModuleByRoleId/${roleId}/${moduleId}`
    );
    return res.data;
  };

  //GET/SHOW UNTAGGED MODULES
  const getUntaggedModule = () => {
    fetchUntaggedApi(moduleId).then((res) => {
      setUntagModules(res);
    });
  };

  useEffect(() => {
    if (moduleId !== "") {
      getUntaggedModule();
    }
  }, [moduleId]);

  console.log(untagModules);

  //FETCH TAGGED MODULES
  const fetchTaggedApi = async (moduleId) => {
    const roleId = taggingData?.roleId;
    const res = await request.get(
      `Role/GetRoleModulebyId/${roleId}/${moduleId}`
    );
    return res.data;
  };

  //GET/SHOW TAGGED MODULES
  const getTaggedModule = () => {
    fetchTaggedApi(moduleId).then((res) => {
      setTagModules(res);
    });
  };

  useEffect(() => {
    if (moduleId !== "") {
      getTaggedModule();
    }
  }, [moduleId]);

  const untagHandler = (id) => {
    const roleId = taggingData?.roleId;
    request
      .put(`Role/UntagModule`, [{ roleId, moduleId: id }])
      .then((res) => {
        ToastComponent("Success", "Module Untagged", "success", toast);
        getUntaggedModule();
        getTaggedModule();
      })
      .catch((err) => {
        ToastComponent("Error", err.response.data, "error", toast);
      });
    onOpen();
  };

  const tagHandler = (roleId, moduleId) => {
    request
      .put(`Role/TagModuleinRole`, [{ roleId, moduleId }])
      .then((res) => {
        ToastComponent("Success", "Module Tagged", "success", toast);
        getTaggedModule();
        getUntaggedModule();
      })
      .catch((err) => {
        ToastComponent("Error", err.response.data, "error", toast);
      });
    onOpen();
  };

  const sample = () => {
    console.log("Popover");
  };

  return (
    <>
      <Flex>
        <Drawer
          size="xl"
          isOpen={isOpen}
          placement="right"
          onClose={onCloseDrawer}
        >
          <DrawerOverlay />

          <DrawerContent p={7}>
            {/* <DrawerCloseButton /> */}
            <DrawerHeader>
              Module Tagging
              <Text>
                {/* {taggingData?.roleId}  */}
                {taggingData?.roleName}
              </Text>
            </DrawerHeader>

            <DrawerBody>
              <Flex w="25%" alignContent="flex-end">
                {mainMenu.length > 0 ? (
                  <Select
                    placeholder="Select Main Menu"
                    onChange={(e) => moduleStatusHandler(e.target.value)}
                  >
                    {mainMenu.map((menu) => (
                      <option key={menu.id} value={menu.id}>
                        {menu.mainMenu}
                      </option>
                    ))}
                  </Select>
                ) : (
                  "loading"
                )}
              </Flex>

              <Flex>
                {/* For List of Tag Modules */}
                <VStack w="50%" mt={4}>
                  <Flex>
                    <VStack>
                      <Text fontWeight="semibold">LIST OF TAGGED MODULES</Text>
                    </VStack>
                  </Flex>

                  <Flex w="98%">
                    <Table size="sm" variant="striped">
                      <Thead>
                        <Tr bg="primary">
                          <Td color="white">Id</Td>
                          <Td color="white">Main Menu</Td>
                          <Td color="white">Sub-Menu</Td>
                          <Td color="white">Untag</Td>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {tagModules?.map((tag, id) => (
                          <Tr key={id}>
                            <Td p={4}>{tag.id}</Td>
                            <Td p={4}>{tag.mainMenu}</Td>
                            <Td p={4}>{tag.subMenu}</Td>
                            <Td p={1}>
                              <Popover>
                                {({ onClose }) => (
                                  <>
                                    <PopoverTrigger>
                                      <Button p={0} bg="none">
                                        <BsBookmarkDashFill
                                          fontSize="25px"
                                          onClick={sample}
                                        />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent bg="primary" color="#fff">
                                      <PopoverArrow bg="primary" />
                                      <PopoverCloseButton />
                                      <PopoverHeader>
                                        Confirmation!
                                      </PopoverHeader>
                                      <PopoverBody>
                                        <VStack onClick={onClose}>
                                          <Text mb={2}>
                                            Are you sure you want to untag this
                                            module?
                                          </Text>
                                          <Flex justifyContent="right">
                                            <Button
                                              p={4}
                                              colorScheme="blue"
                                              size="sm"
                                              onClick={() =>
                                                untagHandler(tag.id)
                                              }
                                            >
                                              Yes
                                            </Button>
                                          </Flex>
                                        </VStack>
                                      </PopoverBody>
                                    </PopoverContent>
                                  </>
                                )}
                              </Popover>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Flex>
                </VStack>

                {/* For List of Untag Modules */}
                <VStack w="50%" mt={4}>
                  <Flex>
                    <VStack>
                      <Text fontWeight="semibold">
                        LIST OF UNTAGGED MODULES
                      </Text>
                    </VStack>
                  </Flex>

                  <Flex w="98%">
                    <Table size="sm" variant="striped">
                      <Thead>
                        <Tr bg="primary">
                          <Td color="white">Id</Td>
                          <Td color="white">Main Menu</Td>
                          <Td color="white">Sub-Menu</Td>
                          <Td color="white">Tag</Td>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {untagModules?.map((untag) => (
                          <Tr key={untag.moduleId}>
                            <Td p={4}>{untag.moduleId}</Td>
                            <Td p={4}>{untag.mainMenu}</Td>
                            <Td p={4}>{untag.subMenu}</Td>
                            <Td p={1}>
                              <Popover>
                                {({ onClose }) => (
                                  <>
                                    <PopoverTrigger>
                                      <Button p={0} bg="none">
                                        <BsBookmarkPlusFill
                                          fontSize="25px"
                                          onClick={sample}
                                        />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent bg="primary" color="#fff">
                                      <PopoverArrow bg="primary" />
                                      <PopoverCloseButton />
                                      <PopoverHeader>
                                        Confirmation!
                                      </PopoverHeader>
                                      <PopoverBody>
                                        <VStack onClick={onClose}>
                                          <Text mb={2}>
                                            Are you sure you want to tag this
                                            module?
                                          </Text>
                                          <Flex justifyContent="right">
                                            <Button
                                              p={4}
                                              colorScheme="blue"
                                              size="sm"
                                              onClick={() =>
                                                tagHandler(
                                                  untag.roleId,
                                                  untag.moduleId
                                                )
                                              }
                                            >
                                              Yes
                                            </Button>
                                          </Flex>
                                        </VStack>
                                      </PopoverBody>
                                    </PopoverContent>
                                  </>
                                )}
                              </Popover>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Flex>
                </VStack>
              </Flex>
            </DrawerBody>

            <DrawerFooter>
              <Button colorScheme="gray" onClick={onClose}>
                Close
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Flex>
    </>
  );
};

export default DrawerTaggingComponent;
