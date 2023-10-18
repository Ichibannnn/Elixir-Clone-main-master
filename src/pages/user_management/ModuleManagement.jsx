import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  useToast,
  Thead,
  Tr,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  VStack,
  Portal,
  Image,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AiTwotoneEdit } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { RiAddFill } from "react-icons/ri";
import PageScroll from "../../utils/PageScroll";
import request from "../../services/ApiClient";
import { ToastComponent } from "../../components/Toast";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { decodeUser } from "../../services/decode-user";
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from "@ajna/pagination";

const ModuleManagement = () => {
  const [module, setModule] = useState([]);
  const [editData, setEditData] = useState([]);
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const toast = useToast();
  const currentUser = decodeUser();

  const [isLoading, setIsLoading] = useState(true);
  const [pageTotal, setPageTotal] = useState(undefined);
  const [disableEdit, setDisableEdit] = useState(false);

  // FETCH API MODULES:
  const fetchModuleApi = async (pageNumber, pageSize, status, search) => {
    const response = await request.get(
      `Module/GetAllModulesWithPaginationOrig/${status}?PageNumber=${pageNumber}&PageSize=${pageSize}&search=${search}`
    );

    return response.data;
  };

  //PAGINATION
  const outerLimit = 2;
  const innerLimit = 2;
  const {
    currentPage,
    setCurrentPage,
    pagesCount,
    pages,
    setPageSize,
    pageSize,
  } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 5 },
  });

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
  };

  const handlePageSizeChange = (e) => {
    const pageSize = Number(e.target.value);
    setPageSize(pageSize);
  };

  //STATUS
  const statusHandler = (data) => {
    setStatus(data);
  };

  const changeStatusHandler = (id, isActive) => {
    let routeLabel;
    if (isActive) {
      routeLabel = "InActiveModule";
    } else {
      routeLabel = "ActivateModule";
    }

    request
      .put(`/Module/${routeLabel}`, { id: id })
      .then((res) => {
        ToastComponent("Success", "Status updated", "success", toast);
        getModuleHandler();
      })
      .catch((err) => {
        console.log(err);
        ToastComponent("Error", err.response.data, "error", toast);
      });
    // console.log(routeLabel)
  };

  //SHOW MODULE DATA----
  const getModuleHandler = () => {
    fetchModuleApi(currentPage, pageSize, status, search).then((res) => {
      setIsLoading(false);
      setModule(res);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    getModuleHandler();

    return () => {
      setModule([]);
    };
  }, [currentPage, pageSize, status, search]);

  // SEARCH
  const searchHandler = (inputValue) => {
    setSearch(inputValue);
    // console.log(inputValue)
  };

  //ADD MODULE HANDLER---
  const addModuleHandler = () => {
    setEditData({
      id: "",
      mainMenuId: "",
      subMenuName: "",
      moduleName: "",
      addedBy: currentUser.fullName,
      modifiedBy: "",
    });
    onOpen();
    setDisableEdit(false);
  };

  //EDIT MODULE--
  const editModuleHandler = (mod) => {
    setDisableEdit(true);
    setEditData(mod);
    onOpen();
  };

  console.log(editData);

  //FOR DRAWER
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      color="fontColor"
      h="full"
      w="full"
      flexDirection="column"
      p={2}
      bg="form"
    >
      <Flex p={2} w="full">
        <Flex flexDirection="column" gap={1} w="full">
          <Flex justifyContent="space-between" alignItems="center">
            <HStack w="25%" mt={3}>
              <InputGroup size="sm">
                <InputLeftElement
                  pointerEvents="none"
                  children={<FiSearch bg="black" fontSize="18px" />}
                />
                <Input
                  borderRadius="lg"
                  fontSize="13px"
                  type="text"
                  border="1px"
                  bg="#E9EBEC"
                  placeholder="Search"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
                  onChange={(e) => searchHandler(e.target.value)}
                />
              </InputGroup>
            </HStack>

            <HStack flexDirection="row">
              <Text fontSize="12px">STATUS:</Text>
              <Select
                fontSize="12px"
                onChange={(e) => statusHandler(e.target.value)}
              >
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </Select>
            </HStack>
          </Flex>

          <Flex w="full" flexDirection="column" gap={2}>
            <PageScroll maxHeight="470px">
              {isLoading ? (
                <Stack width="full">
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                </Stack>
              ) : (
                <Table
                  size="sm"
                  width="full"
                  border="none"
                  boxShadow="md"
                  bg="gray.200"
                  variant="striped"
                >
                  <Thead bg="primary" position="sticky" top={0} zIndex={1}>
                    <Tr>
                      <Th h="40px" color="white" fontSize="10px">
                        ID
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        Menu Name
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        Sub-Menu Name
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        Date Added
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        Added By
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        Action
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {module.module?.map((mod, i) => (
                      <Tr key={i}>
                        <Td fontSize="xs">{mod.id}</Td>
                        <Td fontSize="xs">{mod.mainMenu}</Td>
                        <Td fontSize="xs">{mod.subMenuName}</Td>
                        <Td fontSize="xs">{mod.dateAdded}</Td>
                        <Td fontSize="xs">{mod.addedBy}</Td>

                        <Td pl={0}>
                          <Flex>
                            <HStack>
                              <Button
                                bg="none"
                                size="sm"
                                onClick={() => editModuleHandler(mod)}
                              >
                                <AiTwotoneEdit fontSize="15px" />
                              </Button>

                              <Popover>
                                {({ onClose }) => (
                                  <>
                                    <PopoverTrigger>
                                      {mod.isActive === true ? (
                                        <Button
                                          bg="none"
                                          size="md"
                                          p={0}
                                          // disabled={
                                          //   mod.isActive === true ? true : false
                                          // }
                                        >
                                          <Image
                                            boxSize="20px"
                                            src="/images/turnon.png"
                                            title="active"
                                          />
                                        </Button>
                                      ) : (
                                        <Button bg="none" size="md" p={0}>
                                          <Image
                                            boxSize="20px"
                                            src="/images/turnoff.png"
                                            title="inactive"
                                          />
                                        </Button>
                                      )}
                                    </PopoverTrigger>
                                    <Portal>
                                      <PopoverContent bg="primary" color="#fff">
                                        <PopoverArrow bg="primary" />
                                        <PopoverCloseButton />
                                        <PopoverHeader>
                                          Confirmation!
                                        </PopoverHeader>
                                        <PopoverBody>
                                          <VStack onClick={onClose}>
                                            {mod.isActive === true ? (
                                              <Text>
                                                Are you sure you want to set
                                                this module inactive?
                                              </Text>
                                            ) : (
                                              <Text>
                                                Are you sure you want to set
                                                this module active?
                                              </Text>
                                            )}
                                            <Button
                                              colorScheme="green"
                                              size="sm"
                                              onClick={() =>
                                                changeStatusHandler(
                                                  mod.id,
                                                  mod.isActive
                                                )
                                              }
                                            >
                                              Yes
                                            </Button>
                                          </VStack>
                                        </PopoverBody>
                                      </PopoverContent>
                                    </Portal>
                                  </>
                                )}
                              </Popover>
                            </HStack>
                          </Flex>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </PageScroll>

            <Flex justifyContent="space-between">
              <Button
                size="sm"
                colorScheme="blue"
                fontSize="13px"
                fontWeight="normal"
                _hover={{ bg: "blue.400", color: "#fff" }}
                w="auto"
                leftIcon={<RiAddFill fontSize="20px" />}
                // borderRadius="none"
                onClick={addModuleHandler}
              >
                New
              </Button>

              {/* PROPS */}
              {isOpen && (
                <DrawerComponent
                  isOpen={isOpen}
                  onClose={onClose}
                  fetchModuleApi={fetchModuleApi}
                  getModuleHandler={getModuleHandler}
                  editData={editData}
                  disableEdit={disableEdit}
                />
              )}

              <Stack>
                <Pagination
                  pagesCount={pagesCount}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                >
                  <PaginationContainer>
                    <PaginationPrevious
                      bg="primary"
                      color="white"
                      p={1}
                      _hover={{ bg: "btnColor", color: "white" }}
                    >
                      {"<<"}
                    </PaginationPrevious>
                    <PaginationPageGroup ml={1} mr={1}>
                      {pages.map((page) => (
                        <PaginationPage
                          _hover={{ bg: "btnColor", color: "white" }}
                          _focus={{ bg: "btnColor" }}
                          p={3}
                          bg="primary"
                          color="white"
                          key={`pagination_page_${page}`}
                          page={page}
                        />
                      ))}
                    </PaginationPageGroup>
                    <HStack>
                      <PaginationNext
                        bg="primary"
                        color="white"
                        p={1}
                        _hover={{ bg: "btnColor", color: "white" }}
                      >
                        {">>"}
                      </PaginationNext>
                      <Select onChange={handlePageSizeChange} variant="outline">
                        <option value={Number(5)}>5</option>
                        <option value={Number(10)}>10</option>
                        <option value={Number(25)}>25</option>
                        <option value={Number(50)}>50</option>
                      </Select>
                    </HStack>
                  </PaginationContainer>
                </Pagination>
              </Stack>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ModuleManagement;

const schema = yup.object().shape({
  formData: yup.object().shape({
    id: yup.string(),
    mainMenuId: yup.number().required("Main Menu is required"),
    subMenuName: yup.string().required("Sub-Menu is required"),
    moduleName: yup.string().required("Module Path is required"),
  }),
});

const currentUser = decodeUser();

const DrawerComponent = (props) => {
  const { isOpen, onClose, getModuleHandler, editData } = props;
  const [module, setModule] = useState([]);
  const toast = useToast();
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const onCloseDrawer = () => {
    setIsOpenDrawer(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        id: "",
        mainMenuId: "",
        subMenuName: "",
        moduleName: "",
        addedBy: currentUser?.fullName,
      },
    },
  });

  // FETCH MAIN MENU
  const fetchMainMenu = async () => {
    try {
      const res = await request.get("Module/GetAllActiveMainMenu");
      setModule(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    try {
      fetchMainMenu();
    } catch (error) {}
  }, []);

  const submitHandler = async (data) => {
    try {
      if (data.formData.id === "") {
        delete data.formData["id"];
        const res = await request
          .post("Module/AddNewModule", data.formData)
          .then((res) => {
            ToastComponent("Success", "New Module created!", "success", toast);
            getModuleHandler();
            onClose();
          })
          .catch((err) => {
            ToastComponent("Error", err.response.data, "error", toast);
            data.formData.id = "";
          });
      } else {
        const res = await request
          .put(`Module/UpdateModule`, data.formData)
          .then((res) => {
            ToastComponent("Success", "Module Updated", "success", toast);
            getModuleHandler();
            onClose();
          })
          .catch((error) => {
            ToastComponent(
              "Update Failed",
              error.response.data,
              "warning",
              toast
            );
          });
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (editData.id) {
      setValue(
        "formData",
        {
          id: editData.id,
          mainMenuId: editData?.mainMenuId,
          subMenuName: editData?.subMenuName,
          moduleName: editData?.moduleName,
        },
        { shouldValidate: true }
      );
    }
  }, [editData]);

  // console.log(watch('formData.id'))

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onCloseDrawer}>
        <DrawerOverlay />
        <form onSubmit={handleSubmit(submitHandler)}>
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Module Form</DrawerHeader>
            {/* <DrawerCloseButton /> */}
            <DrawerBody>
              <Stack spacing="7px">
                <Box>
                  <FormLabel>Main Menu:</FormLabel>

                  {module.length > 0 ? (
                    <Select
                      {...register("formData.mainMenuId")}
                      placeholder="Select Main Menu"
                    >
                      {module.map((mods) => (
                        <option key={mods.id} value={mods.id}>
                          {mods.mainMenu}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    "loading"
                  )}
                  <Text color="red" fontSize="xs">
                    {errors.formData?.mainMenuId?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel>Sub-Menu Name:</FormLabel>
                  <Input
                    {...register("formData.subMenuName")}
                    placeholder="Please enter Sub-Menu name"
                    autoComplete="off"
                  />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.subMenuName?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel>Menu Path Name:</FormLabel>
                  <Input
                    {...register("formData.moduleName")}
                    placeholder="Please enter Menu Path name"
                    autoComplete="off"
                  />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.moduleName?.message}
                  </Text>
                </Box>
              </Stack>
            </DrawerBody>
            <DrawerFooter borderTopWidth="1px">
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>

              <Button type="submit" colorScheme="blue" disabled={!isValid}>
                Submit
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </Drawer>
    </>
  );
};
