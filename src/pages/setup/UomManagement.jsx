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

const UomManagement = () => {
  const [uom, setUom] = useState([]);
  const [editData, setEditData] = useState([]);
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const toast = useToast();
  const currentUser = decodeUser();

  const [isLoading, setIsLoading] = useState(true);
  const [pageTotal, setPageTotal] = useState(undefined);
  const [disableEdit, setDisableEdit] = useState(false);

  // FETCH API ROLES:
  const fetchUomApi = async (pageNumber, pageSize, status, search) => {
    const response = await request.get(
      `Uom/GetAllUomWithPaginationOrig/${status}?PageNumber=${pageNumber}&PageSize=${pageSize}&search=${search}`
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
    // console.log(id)
    // console.log(isActive)
    if (isActive) {
      routeLabel = "InActiveUom";
    } else {
      routeLabel = "ActivateUom";
    }

    request
      .put(`Uom/${routeLabel}`, { id: id })
      .then((res) => {
        ToastComponent("Success", "Status updated", "success", toast);
        getUomHandler();
      })
      .catch((err) => {
        ToastComponent("Error", err.response.data, "error", toast);
      });
  };

  //SHOW MAIN MENU DATA----
  const getUomHandler = () => {
    fetchUomApi(currentPage, pageSize, status, search).then((res) => {
      setIsLoading(false);
      setUom(res);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    getUomHandler();

    return () => {
      setUom([]);
    };
  }, [currentPage, pageSize, status, search]);

  // SEARCH
  const searchHandler = (inputValue) => {
    setSearch(inputValue);
    // console.log(inputValue)
  };

  //ADD MAIN MENU HANDLER---
  const addUomHandler = () => {
    setEditData({
      id: "",
      uomCode: "",
      uomDescription: "",
      addedBy: currentUser.fullName,
      modifiedBy: "",
    });
    onOpen();
    setDisableEdit(false);
  };

  //EDIT ROLE--
  const editUomHandler = (uoms) => {
    setDisableEdit(true);
    setEditData(uoms);
    onOpen();
    // console.log(mod.mainMenu)
  };

  //FOR DRAWER (Drawer / Drawer Tagging)
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      color="fontColor"
      h="full"
      w="full"
      flexDirection="column"
      p={4}
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
              <Text
                textAlign="center"
                bgColor="primary"
                color="white"
                fontSize="14px"
                // fontWeight="semibold"
              >
                List of UOM
              </Text>
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
                        UOM Code
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        Description
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
                    {uom?.uom?.map((uoms, i) => (
                      <Tr key={i}>
                        <Td fontSize="xs">{uoms.id}</Td>
                        <Td fontSize="xs">{uoms.uomCode}</Td>
                        <Td fontSize="xs">{uoms.uomDescription}</Td>
                        <Td fontSize="xs">{uoms.dateAdded}</Td>
                        <Td fontSize="xs">{uoms.addedBy}</Td>

                        <Td pl={0}>
                          <Flex>
                            <HStack>
                              <Button
                                bg="none"
                                size="sm"
                                onClick={() => editUomHandler(uoms)}
                              >
                                <AiTwotoneEdit fontSize="15px" />
                              </Button>

                              <Popover>
                                {({ onClose }) => (
                                  <>
                                    <PopoverTrigger>
                                      {uoms.isActive === true ? (
                                        <Button bg="none" size="md" p={0}>
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
                                            {uoms.isActive === true ? (
                                              <Text>
                                                Are you sure you want to set
                                                this UOM inactive?
                                              </Text>
                                            ) : (
                                              <Text>
                                                Are you sure you want to set
                                                this UOM active?
                                              </Text>
                                            )}
                                            <Button
                                              colorScheme="green"
                                              size="sm"
                                              onClick={() =>
                                                changeStatusHandler(
                                                  uoms.id,
                                                  uoms.isActive
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
                onClick={addUomHandler}
              >
                New
              </Button>

              {/* PROPS */}
              {isOpen && (
                <DrawerComponent
                  isOpen={isOpen}
                  onClose={onClose}
                  fetchUomApi={fetchUomApi}
                  getUomHandler={getUomHandler}
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

export default UomManagement;

const schema = yup.object().shape({
  formData: yup.object().shape({
    id: yup.string().uppercase(),
    uomCode: yup.string().uppercase().required("Uom Code name is required"),
    uomDescription: yup
      .string()
      .uppercase()
      .required("Description name is required"),
    addedBy: yup.string().uppercase().uppercase(),
  }),
});

const currentUser = decodeUser();

const DrawerComponent = (props) => {
  const { isOpen, onClose, getUomHandler, editData, disableEdit } = props;
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
        uomCode: "",
        uomDescription: "",
        addedBy: currentUser?.fullName,
        modifiedBy: "",
      },
    },
  });

  const submitHandler = async (data) => {
    try {
      if (data.formData.id === "") {
        delete data.formData["id"];
        const res = await request
          .post("Uom/AddNewUom", data.formData)
          .then((res) => {
            ToastComponent("Success", "New UOM created!", "success", toast);
            getUomHandler();
            onClose();
          })
          .catch((err) => {
            ToastComponent("Error", err.response.data, "error", toast);
            data.formData.id = "";
          });
      } else {
        const res = await request
          .put(`Uom/UpdateUom`, data.formData)
          .then((res) => {
            ToastComponent("Success", "UOM Updated", "success", toast);
            getUomHandler();
            onClose(onClose);
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
          uomCode: editData?.uomCode,
          uomDescription: editData?.uomDescription,
          modifiedBy: currentUser.fullName,
        },
        { shouldValidate: true }
      );
    }
  }, [editData]);

  // console.log(watch('formData'))

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onCloseDrawer}>
        <DrawerOverlay />
        <form onSubmit={handleSubmit(submitHandler)}>
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">UOM Form</DrawerHeader>
            {/* <DrawerCloseButton /> */}
            <DrawerBody>
              <Stack spacing="7px">
                <Box>
                  <FormLabel>UOM Code:</FormLabel>
                  <Input
                    {...register("formData.uomCode")}
                    placeholder="Please enter Main Menu name"
                    autoComplete="off"
                    autoFocus
                    disabled={disableEdit}
                    readOnly={disableEdit}
                    _disabled={{ color: "black" }}
                    bgColor={disableEdit && "gray.300"}
                  />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.uomCode?.message}
                  </Text>
                </Box>
                <Box>
                  <FormLabel>Description:</FormLabel>
                  <Input
                    {...register("formData.uomDescription")}
                    placeholder="Please enter Main Menu name"
                    autoComplete="off"
                  />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.uomDescription?.message}
                  </Text>
                </Box>
              </Stack>
            </DrawerBody>
            <DrawerFooter borderTopWidth="1px">
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid} colorScheme="blue">
                Submit
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </Drawer>
    </>
  );
};
