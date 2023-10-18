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
  InputRightElement,
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
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  StatArrow,
} from "@chakra-ui/react";
import React, { useState, useRef } from "react";
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
// import { Stat, StatHelpText, StatLabel, StatNumber } from "@chakra-ui/react/dist";
// import { Card, CardBody, CardFooter, CardHeader } from "@chakra-ui/react/dist";

const MaterialsManagement = () => {
  const [materials, setMaterials] = useState([]);
  const [editData, setEditData] = useState([]);
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const toast = useToast();
  const currentUser = decodeUser();

  const [isLoading, setIsLoading] = useState(true);
  const [pageTotal, setPageTotal] = useState(undefined);
  const [disableEdit, setDisableEdit] = useState(false);
  const accountTitleRef = useRef();

  // FETCH API MATERIALS:
  const fetchMaterialApi = async (pageNumber, pageSize, status, search) => {
    const response = await request.get(
      `Material/GetAllMaterialWithPaginationOrig/${status}?PageNumber=${pageNumber}&PageSize=${pageSize}&search=${search}`
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

  //SHOW MAIN MENU DATA----
  const getMaterialHandler = () => {
    fetchMaterialApi(currentPage, pageSize, status, search).then((res) => {
      setIsLoading(false);
      setMaterials(res);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    getMaterialHandler();

    return () => {
      setMaterials([]);
    };
  }, [currentPage, pageSize, status, search]);

  //STATUS
  const statusHandler = (data) => {
    setStatus(data);
  };

  const changeStatusHandler = (id, isActive) => {
    let routeLabel;
    if (isActive) {
      routeLabel = "InActiveMaterial";
    } else {
      routeLabel = "ActivateMaterial";
    }

    request
      .put(`Material/${routeLabel}`, { id: id })
      .then((res) => {
        ToastComponent("Success", "Status updated", "success", toast);
        getMaterialHandler();
      })
      .catch((err) => {
        ToastComponent("Error", err.response.data, "error", toast);
      });
  };

  // SEARCH
  const searchHandler = (inputValue) => {
    setSearch(inputValue);
    // console.log(inputValue)
  };

  //ADD MAIN MENU HANDLER---
  const addMaterialHandler = () => {
    setEditData({
      id: "",
      itemCode: "",
      itemDescription: "",
      itemCategoryId: "",
      uomId: "",
      bufferLevel: "",
      addedBy: currentUser.fullName,
      modifiedBy: "",
    });
    onOpen();
    setDisableEdit(false);
  };

  //EDIT ROLE--
  const editMaterialHandler = (mats) => {
    setDisableEdit(true);
    setEditData(mats);
    onOpen();
    console.log(editData);
  };

  //FOR DRAWER (Drawer / Drawer Tagging)
  const { isOpen, onOpen, onClose } = useDisclosure();

  console.log(materials?.materials?.length);

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
          {/* <Card>
            <CardBody>
              <Text>
                View a summary of all your customers over the last month.
              </Text>
            </CardBody>
          </Card> */}
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
                List of Materials
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
                  className="inputUpperCase"
                >
                  <Thead bg="primary" position="sticky" top={0} zIndex={1}>
                    <Tr>
                      <Th h="40px" color="white" fontSize="10px">
                        ID
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        Item Code
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        Item Description
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        Item Category
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        Account Title
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        UOM
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        Buffer Level
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
                    {materials?.materials?.map((mats, i) => (
                      <Tr key={i}>
                        <Td fontSize="xs">{mats.id}</Td>
                        <Td fontSize="xs">{mats.itemCode}</Td>
                        <Td fontSize="xs">{mats.itemDescription}</Td>
                        <Td fontSize="xs">{mats.itemCategoryName}</Td>
                        <Td fontSize="xs">{mats.accountPName}</Td>
                        <Td fontSize="xs">{mats.uom}</Td>
                        <Td fontSize="xs">
                          {mats.bufferLevel.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigirts: 2,
                          })}
                        </Td>
                        <Td fontSize="xs">{mats.dateAdded}</Td>
                        <Td fontSize="xs">{mats.addedBy}</Td>

                        <Td pl={0}>
                          <Flex>
                            <HStack>
                              <Button
                                bg="none"
                                size="sm"
                                onClick={() => editMaterialHandler(mats)}
                              >
                                <AiTwotoneEdit fontSize="15px" />
                              </Button>

                              <Popover>
                                {({ onClose }) => (
                                  <>
                                    <PopoverTrigger>
                                      {mats.isActive === true ? (
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
                                            {mats.isActive === true ? (
                                              <Text>
                                                Are you sure you want to set
                                                this Material inactive?
                                              </Text>
                                            ) : (
                                              <Text>
                                                Are you sure you want to set
                                                this Material active?
                                              </Text>
                                            )}
                                            <Button
                                              colorScheme="green"
                                              size="sm"
                                              onClick={() =>
                                                changeStatusHandler(
                                                  mats.id,
                                                  mats.isActive
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

            <Flex justifyContent="space-between" mt={2}>
              <Button
                size="sm"
                colorScheme="blue"
                fontSize="13px"
                fontWeight="normal"
                _hover={{ bg: "blue.400", color: "#fff" }}
                w="auto"
                leftIcon={<RiAddFill fontSize="20px" />}
                onClick={addMaterialHandler}
              >
                New
              </Button>
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
                        mb={2}
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

              {/* PROPS */}
              {isOpen && (
                <DrawerComponent
                  accountTitleRef={accountTitleRef}
                  isOpen={isOpen}
                  onClose={onClose}
                  fetchMaterialApi={fetchMaterialApi}
                  getMaterialHandler={getMaterialHandler}
                  editData={editData}
                  disableEdit={disableEdit}
                />
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MaterialsManagement;

const schema = yup.object().shape({
  formData: yup.object().shape({
    id: yup.string().uppercase(),
    itemCode: yup.string().uppercase().required("Item code is required"),
    itemDescription: yup
      .string()
      .uppercase()
      .required("Description is required"),
    accountPName: yup.string().required(),
    itemCategoryName: yup.string().required("Item Category Name is required"),
    uomId: yup.number().required("UOM is required"),
    bufferLevel: yup
      .number()
      .required("Buffer level is required")
      .typeError("Must be a number")
      .positive("Negative value is not valid")
      .integer("Buffer Level field should have digits only")
      .min(0, "Bufffer level must be greater than or equal to 0"),
    addedBy: yup.string().uppercase(),
  }),
});

const currentUser = decodeUser();

const DrawerComponent = (props) => {
  const {
    isOpen,
    onClose,
    getMaterialHandler,
    editData,
    disableEdit,
    accountTitleRef,
  } = props;

  const [accountTitle, setAccountTitle] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [itemCategoryName, setItemCategory] = useState("");
  const [uom, setUom] = useState([]);
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
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        id: "",
        itemCode: "",
        itemDescription: "",
        accountPName: "",
        itemCategoryName: "",
        uomId: "",
        bufferLevel: "",
        addedBy: currentUser?.fullName,
      },
    },
  });

  // FETCHING ITEM CATEGORY --------------------------------------------------
  const fetchItemCat = async () => {
    try {
      const res = await request.get(`Material/GetAllAccountmaterial`);
      setCategoryData(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchItemCat();
  }, []);

  // FETCHING SUB CATEGORY ---------------------
  const fetchSubCat = async () => {
    try {
      const res = await request.get(`Material/GetAllItemcategoriesmaterial`, {
        params: {
          category: itemCategoryName,
        },
      });
      setAccountTitle(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchSubCat();
  }, [itemCategoryName]);

  const fetchUom = async () => {
    try {
      const res = await request.get("Uom/GetAllActiveUoms");
      setUom(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    try {
      fetchUom();
    } catch (error) {}
  }, []);

  const categoryStatusHandler = (data) => {
    const newData = JSON.parse(data);
    if (data) {
      setItemCategory(newData.itemCategoryName);
    } else {
      setItemCategory("");
      setValue("formData.itemCategoryName", "");
    }
  };
  const submitHandler = async (data) => {
    const itemCategory = JSON.parse(data.formData.itemCategoryName);
    const accTitle = JSON.parse(data.formData.accountPName);

    const payload = {
      id: data.formData.id,
      itemCode: data.formData.itemCode,
      itemDescription: data.formData.itemDescription,
      itemCategoryName: itemCategory.itemCategoryName,
      accountTitleId: accTitle.accountTitleId,
      uomId: data.formData.uomId,
      bufferLevel: data.formData.bufferLevel,
      addedBy: currentUser?.fullName,
    };

    try {
      if (payload.id === "") {
        delete payload["id"];
        const res = await request
          .post(`Material/AddNewMaterial`, payload)
          .then((res) => {
            ToastComponent(
              "Success",
              "New Material created!",
              "success",
              toast
            );
            getMaterialHandler();
            onClose();
          })
          .catch((err) => {
            ToastComponent("Error", err.response.data, "error", toast);
            data.formData.id = "";
          });
      } else {
        const res = await request
          .put(`Material/UpdateMaterials`, payload)
          .then((res) => {
            ToastComponent("Success", "Material Updated", "success", toast);
            getMaterialHandler();
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
          itemCode: editData?.itemCode,
          itemDescription: editData?.itemDescription,
          itemCategoryName: JSON.stringify({
            itemCategoryId: editData?.itemCategoryId,
            itemCategoryName: editData?.itemCategoryName,
            accountTitleId: 0,
            accountPName: null,
          }),
          accountPName: JSON.stringify({
            itemCategoryId: editData?.itemCategoryId,
            itemCategoryName: null,
            accountTitleId: editData?.accountTitleId,
            accountPName: editData?.accountPName,
          }),
          uomId: editData?.uomId,
          bufferLevel: editData?.bufferLevel,
          addedBy: currentUser.fullName,
        },
        { shouldValidate: true }
      );

      setItemCategory(editData?.itemCategoryName);
    }
  }, [editData]);

  // console.log(editData);
  // console.log(categoryData);
  // console.log(subCategory);
  // console.log(watch("formData"));

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onCloseDrawer}>
        <DrawerOverlay />
        <form onSubmit={handleSubmit(submitHandler)}>
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Material Form</DrawerHeader>
            <DrawerBody>
              <Stack spacing="7px">
                <Box>
                  <FormLabel>Item Code:</FormLabel>
                  <Input
                    {...register("formData.itemCode")}
                    placeholder="Please enter Item Code"
                    autoComplete="off"
                    autoFocus
                    disabled={disableEdit}
                    readOnly={disableEdit}
                    _disabled={{ color: "black" }}
                    bgColor={disableEdit && "gray.300"}
                  />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.itemCode?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel>Item Description:</FormLabel>
                  <Input
                    {...register("formData.itemDescription")}
                    placeholder="Please enter Description"
                    autoComplete="off"
                  />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.itemDescription?.message}
                  </Text>
                </Box>

                <Flex mt={3}></Flex>

                <Box>
                  <FormLabel>Item Category:</FormLabel>
                  {categoryData.length > 0 ? (
                    <Select
                      {...register("formData.itemCategoryName")}
                      placeholder="Select Item Category"
                      onChange={(e) => categoryStatusHandler(e.target.value)}
                    >
                      {categoryData.map((itemCat, i) => (
                        <option key={i} value={JSON.stringify(itemCat)}>
                          {itemCat.itemCategoryName}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    ""
                  )}
                  <Text color="red" fontSize="xs">
                    {errors.formData?.itemCategoryName?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel>Account Title:</FormLabel>
                  {accountTitle.length > 0 ? (
                    <Select
                      className="inputUpperCase"
                      ref={accountTitleRef}
                      {...register("formData.accountPName")}
                      placeholder="Select Account Title"
                    >
                      {accountTitle.map((accountTitleItem, i) => (
                        <option
                          key={i}
                          value={JSON.stringify(accountTitleItem)}
                        >
                          {accountTitleItem.accountPName}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <Select>
                      <option>Select Sub Category</option>
                    </Select>
                  )}
                  <Text color="red" fontSize="xs">
                    {errors.formData?.accountTitleId?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel>UOM:</FormLabel>
                  {uom.length > 0 ? (
                    <Select
                      {...register("formData.uomId")}
                      placeholder="Select UOM"
                    >
                      {uom.map((uoms) => (
                        <option key={uoms.id} value={uoms.id}>
                          {uoms.uomCode}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    "loading"
                  )}
                  <Text color="red" fontSize="xs">
                    {errors.formData?.uomId?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel>Buffer Level:</FormLabel>
                  <Input
                    {...register("formData.bufferLevel")}
                    type="number"
                    placeholder="Please enter Buffer Level"
                    autoComplete="off"
                  />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.bufferLevel?.message}
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

// import {
//   Box,
//   Button,
//   Drawer,
//   DrawerBody,
//   DrawerCloseButton,
//   DrawerContent,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerOverlay,
//   Flex,
//   FormLabel,
//   HStack,
//   Input,
//   InputGroup,
//   InputLeftElement,
//   InputRightElement,
//   Select,
//   Skeleton,
//   Stack,
//   Table,
//   Tbody,
//   Td,
//   Text,
//   Th,
//   useToast,
//   Thead,
//   Tr,
//   useDisclosure,
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
//   PopoverHeader,
//   PopoverBody,
//   PopoverArrow,
//   PopoverCloseButton,
//   VStack,
//   Portal,
//   Image,
// } from "@chakra-ui/react";
// import React, { useState, useRef } from "react";
// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { AiTwotoneEdit } from "react-icons/ai";
// import { GiChoice } from "react-icons/gi";
// import { FiSearch } from "react-icons/fi";
// import { RiAddFill } from "react-icons/ri";
// import PageScroll from "../../utils/PageScroll";
// import request from "../../services/ApiClient";
// import { ToastComponent } from "../../components/Toast";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { decodeUser } from "../../services/decode-user";
// import {
//   Pagination,
//   usePagination,
//   PaginationNext,
//   PaginationPage,
//   PaginationPrevious,
//   PaginationContainer,
//   PaginationPageGroup,
// } from "@ajna/pagination";
// import { BsCheckLg } from "react-icons/bs";

// const MaterialsManagement = () => {
//   const [materials, setMaterials] = useState([]);
//   const [editData, setEditData] = useState([]);
//   const [status, setStatus] = useState(true);
//   const [search, setSearch] = useState("");
//   const toast = useToast();
//   const currentUser = decodeUser();

//   const [isLoading, setIsLoading] = useState(true);
//   const [pageTotal, setPageTotal] = useState(undefined);
//   const [disableEdit, setDisableEdit] = useState(false);
//   const accountTitleRef = useRef();

//   // FETCH API MATERIALS:
//   const fetchMaterialApi = async (pageNumber, pageSize, status, search) => {
//     const response = await request.get(
//       `Material/GetAllMaterialWithPaginationOrig/${status}?PageNumber=${pageNumber}&PageSize=${pageSize}&search=${search}`
//     );

//     return response.data;
//   };

//   //PAGINATION
//   const outerLimit = 2;
//   const innerLimit = 2;
//   const {
//     currentPage,
//     setCurrentPage,
//     pagesCount,
//     pages,
//     setPageSize,
//     pageSize,
//   } = usePagination({
//     total: pageTotal,
//     limits: {
//       outer: outerLimit,
//       inner: innerLimit,
//     },
//     initialState: { currentPage: 1, pageSize: 5 },
//   });

//   const handlePageChange = (nextPage) => {
//     setCurrentPage(nextPage);
//   };

//   const handlePageSizeChange = (e) => {
//     const pageSize = Number(e.target.value);
//     setPageSize(pageSize);
//   };

//   //SHOW MAIN MENU DATA----
//   const getMaterialHandler = () => {
//     fetchMaterialApi(currentPage, pageSize, status, search).then((res) => {
//       setIsLoading(false);
//       setMaterials(res);
//       setPageTotal(res.totalCount);
//     });
//   };

//   useEffect(() => {
//     getMaterialHandler();

//     return () => {
//       setMaterials([]);
//     };
//   }, [currentPage, pageSize, status, search]);

//   //STATUS
//   const statusHandler = (data) => {
//     setStatus(data);
//   };

//   const changeStatusHandler = (id, isActive) => {
//     let routeLabel;
//     if (isActive) {
//       routeLabel = "InActiveMaterial";
//     } else {
//       routeLabel = "ActivateMaterial";
//     }

//     request
//       .put(`Material/${routeLabel}`, { id: id })
//       .then((res) => {
//         ToastComponent("Success", "Status updated", "success", toast);
//         getMaterialHandler();
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   // SEARCH
//   const searchHandler = (inputValue) => {
//     setSearch(inputValue);
//     // console.log(inputValue)
//   };

//   //ADD MAIN MENU HANDLER---
//   const addMaterialHandler = () => {
//     setEditData({
//       id: "",
//       itemCode: "",
//       itemDescription: "",
//       itemCategoryId: "",
//       uomId: "",
//       bufferLevel: "",
//       addedBy: currentUser.userName,
//       modifiedBy: "",
//     });
//     onOpen();
//     setDisableEdit(false);
//   };

//   //EDIT ROLE--
//   const editMaterialHandler = (mats) => {
//     setDisableEdit(true);
//     setEditData(mats);
//     onOpen();
//     console.log(editData);
//   };

//   //FOR DRAWER (Drawer / Drawer Tagging)
//   const { isOpen, onOpen, onClose } = useDisclosure();

//   return (
//     <Flex
//       color="fontColor"
//       h="full"
//       w="full"
//       flexDirection="column"
//       p={2}
//       bg="form"
//       boxShadow="md"
//     >
//       <Flex p={2} w="full">
//         <Flex flexDirection="column" gap={1} w="full">
//           <Flex justifyContent="space-between" alignItems="center">
//             <HStack w="25%" mt={3}>
//               <InputGroup size="sm">
//                 <InputLeftElement
//                   pointerEvents="none"
//                   children={<FiSearch bg="black" fontSize="18px" />}
//                 />
//                 <Input
//                   borderRadius="lg"
//                   fontSize="13px"
//                   type="text"
//                   border="1px"
//                   bg="#E9EBEC"
//                   placeholder="Search Item Code"
//                   borderColor="gray.400"
//                   _hover={{ borderColor: "gray.400" }}
//                   onChange={(e) => searchHandler(e.target.value)}
//                 />
//               </InputGroup>
//             </HStack>

//             <HStack flexDirection="row">
//               <Text fontSize="12px">STATUS:</Text>
//               <Select
//                 fontSize="12px"
//                 onChange={(e) => statusHandler(e.target.value)}
//               >
//                 <option value={true}>Active</option>
//                 <option value={false}>Inactive</option>
//               </Select>
//             </HStack>
//           </Flex>

//           <Flex w="full" flexDirection="column" gap={2}>
//             <PageScroll maxHeight="470px">
//               {isLoading ? (
//                 <Stack width="full">
//                   <Skeleton height="20px" />
//                   <Skeleton height="20px" />
//                   <Skeleton height="20px" />
//                   <Skeleton height="20px" />
//                   <Skeleton height="20px" />
//                   <Skeleton height="20px" />
//                 </Stack>
//               ) : (
//                 <Table
//                   size="sm"
//                   width="full"
//                   border="none"
//                   boxShadow="md"
//                   bg="gray.200"
//                   variant="striped"
//                   className="inputUpperCase"
//                 >
//                   <Thead bg="primary">
//                     <Tr>
//                       {/* <Th h="40px" color="white" fontSize="10px">
//                         ID
//                       </Th> */}
//                       <Th h="40px" color="white" fontSize="10px">
//                         Item Code
//                       </Th>
//                       <Th h="40px" color="white" fontSize="10px">
//                         Item Description
//                       </Th>
//                       <Th h="40px" color="white" fontSize="10px">
//                         Item Category
//                       </Th>
//                       <Th h="40px" color="white" fontSize="10px">
//                         Item Sub Category
//                       </Th>
//                       <Th h="40px" color="white" fontSize="10px">
//                         UOM
//                       </Th>
//                       <Th h="40px" color="white" fontSize="10px">
//                         Buffer Level
//                       </Th>
//                       <Th h="40px" color="white" fontSize="10px">
//                         Date Added
//                       </Th>
//                       <Th h="40px" color="white" fontSize="10px">
//                         Added By
//                       </Th>
//                       <Th h="40px" color="white" fontSize="10px">
//                         Action
//                       </Th>
//                     </Tr>
//                   </Thead>
//                   <Tbody>
//                     {materials?.materials?.map((mats, i) => (
//                       <Tr key={i}>
//                         {/* <Td fontSize="xs">{mats.id}</Td> */}
//                         <Td fontSize="xs">{mats.itemCode}</Td>
//                         <Td fontSize="xs">{mats.itemDescription}</Td>
//                         <Td fontSize="xs">{mats.itemCategoryName}</Td>
//                         <Td fontSize="xs">{mats.subCategoryName}</Td>
//                         <Td fontSize="xs">{mats.uom}</Td>
//                         <Td fontSize="xs">
//                           {mats.bufferLevel.toLocaleString(undefined, {
//                             maximumFractionDigits: 2,
//                             minimumFractionDigirts: 2,
//                           })}
//                         </Td>
//                         <Td fontSize="xs">{mats.dateAdded}</Td>
//                         <Td fontSize="xs">{mats.addedBy}</Td>

//                         <Td pl={0}>
//                           <Flex>
//                             <HStack>
//                               <Button
//                                 bg="none"
//                                 size="sm"
//                                 onClick={() => editMaterialHandler(mats)}
//                               >
//                                 <AiTwotoneEdit fontSize="15px" />
//                               </Button>

//                               <Popover>
//                                 {({ onClose }) => (
//                                   <>
//                                     <PopoverTrigger>
//                                       {mats.isActive === true ? (
//                                         <Button bg="none" size="md" p={0}>
//                                           <Image
//                                             boxSize="20px"
//                                             src="/images/turnon.png"
//                                             title="active"
//                                           />
//                                         </Button>
//                                       ) : (
//                                         <Button bg="none" size="md" p={0}>
//                                           <Image
//                                             boxSize="20px"
//                                             src="/images/turnoff.png"
//                                             title="inactive"
//                                           />
//                                         </Button>
//                                       )}
//                                     </PopoverTrigger>
//                                     <Portal>
//                                       <PopoverContent bg="primary" color="#fff">
//                                         <PopoverArrow bg="primary" />
//                                         <PopoverCloseButton />
//                                         <PopoverHeader>
//                                           Confirmation!
//                                         </PopoverHeader>
//                                         <PopoverBody>
//                                           <VStack onClick={onClose}>
//                                             {mats.isActive === true ? (
//                                               <Text>
//                                                 Are you sure you want to set
//                                                 this Material inactive?
//                                               </Text>
//                                             ) : (
//                                               <Text>
//                                                 Are you sure you want to set
//                                                 this Material active?
//                                               </Text>
//                                             )}
//                                             <Button
//                                               colorScheme="green"
//                                               size="sm"
//                                               onClick={() =>
//                                                 changeStatusHandler(
//                                                   mats.id,
//                                                   mats.isActive
//                                                 )
//                                               }
//                                             >
//                                               Yes
//                                             </Button>
//                                           </VStack>
//                                         </PopoverBody>
//                                       </PopoverContent>
//                                     </Portal>
//                                   </>
//                                 )}
//                               </Popover>
//                             </HStack>
//                           </Flex>
//                         </Td>
//                       </Tr>
//                     ))}
//                   </Tbody>
//                 </Table>
//               )}
//             </PageScroll>

//             <Flex justifyContent="space-between" mt={2}>
//               <Button
//                 size="sm"
//                 colorScheme="blue"
//                 fontSize="13px"
//                 fontWeight="normal"
//                 _hover={{ bg: "blue.400", color: "#fff" }}
//                 w="auto"
//                 leftIcon={<RiAddFill fontSize="20px" />}
//                 borderRadius="none"
//                 onClick={addMaterialHandler}
//               >
//                 New
//               </Button>
//               <Stack>
//                 <Pagination
//                   pagesCount={pagesCount}
//                   currentPage={currentPage}
//                   onPageChange={handlePageChange}
//                 >
//                   <PaginationContainer>
//                     <PaginationPrevious
//                       bg="primary"
//                       color="white"
//                       p={1}
//                       _hover={{ bg: "btnColor", color: "white" }}
//                       size="sm"
//                     >
//                       {"<<"}
//                     </PaginationPrevious>
//                     <PaginationPageGroup ml={1} mr={1}>
//                       {pages.map((page) => (
//                         <PaginationPage
//                           _hover={{ bg: "btnColor", color: "white" }}
//                           _focus={{ bg: "btnColor" }}
//                           p={3}
//                           bg="primary"
//                           color="white"
//                           key={`pagination_page_${page}`}
//                           page={page}
//                           size="sm"
//                         />
//                       ))}
//                     </PaginationPageGroup>
//                     <HStack>
//                       <PaginationNext
//                         bg="primary"
//                         color="white"
//                         p={1}
//                         _hover={{ bg: "btnColor", color: "white" }}
//                         size="sm"
//                         mb={2}
//                       >
//                         {">>"}
//                       </PaginationNext>
//                       <Select
//                         onChange={handlePageSizeChange}
//                         bg="#FFFFFF"
//                         // size="sm"
//                         mb={2}
//                         variant="outline"
//                       >
//                         <option value={Number(5)}>5</option>
//                         <option value={Number(10)}>10</option>
//                         <option value={Number(25)}>25</option>
//                         <option value={Number(50)}>50</option>
//                       </Select>
//                     </HStack>
//                   </PaginationContainer>
//                 </Pagination>
//               </Stack>

//               {/* PROPS */}
//               {isOpen && (
//                 <DrawerComponent
//                   accountTitleRef={accountTitleRef}
//                   isOpen={isOpen}
//                   onClose={onClose}
//                   fetchMaterialApi={fetchMaterialApi}
//                   getMaterialHandler={getMaterialHandler}
//                   editData={editData}
//                   disableEdit={disableEdit}
//                 />
//               )}
//             </Flex>
//           </Flex>
//         </Flex>
//       </Flex>
//     </Flex>
//   );
// };

// export default MaterialsManagement;

// const schema = yup.object().shape({
//   formData: yup.object().shape({
//     id: yup.string().uppercase(),
//     itemCode: yup.string().uppercase().required("Item code is required"),
//     itemDescription: yup
//       .string()
//       .uppercase()
//       .required("Description is required"),
//     itemCategoryId: yup.number().required(),
//     subCategoryId: yup.number().required(),
//     uomId: yup.number().required("UOM is required"),
//     bufferLevel: yup
//       .number()
//       .required("Buffer level is required")
//       .typeError("Must be a number")
//       .positive("Negative value is not valid")
//       .integer()
//       .min(1, "Bufffer level must be greater than or equal to 1"),
//     addedBy: yup.string().uppercase(),
//     // itemCategoryName: yup
//     //   .string()
//     //   .uppercase()
//     //   .required("Item Category Name is required"),
//   }),
// });

// const currentUser = decodeUser();

// const DrawerComponent = (props) => {
//   const {
//     isOpen,
//     onClose,
//     getMaterialHandler,
//     editData,
//     disableEdit,
//     accountTitleRef,
//   } = props;

//   const [subCategory, setSubCategory] = useState([]);
//   const [categoryData, setCategoryData] = useState([]);
//   const [itemCategoryName, setItemCategory] = useState("");
//   const [allActiveCategory, setAllActiveCategory] = useState([]);
//   const [uom, setUom] = useState([]);
//   const toast = useToast();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isValid },
//     setValue,
//     watch,
//   } = useForm({
//     resolver: yupResolver(schema),
//     mode: "onChange",
//     defaultValues: {
//       formData: {
//         // id: "",
//         // itemCode: "",
//         // itemDescription: "",
//         // itemCategoryId: "",
//         // itemCategoryName: "",
//         // subCategoryId: "",
//         // subcategoryName: "",
//         // subCategoryId: "",
//         // itemCategoryId: "",
//         // itemCategoryName: "",
//         // uomId: "",
//         // bufferLevel: "",
//         // addedBy: currentUser?.userName,
//         // modifiedBy: "",
//         id: "",
//         itemCode: "",
//         itemDescription: "",
//         itemCategoryId: "",
//         subCategoryId: "",
//         uomId: "",
//         bufferLevel: "",
//         addedBy: currentUser?.userName,
//       },
//     },
//   });

//   // FETCHING ITEM CATEGORY --------------------------------------------------
//   const fetchAllActiveCategory = async () => {
//     try {
//       const res = await request.get(`Material/GetAllActiveItemCategories`);
//       setAllActiveCategory(res.data);
//     } catch (error) {}
//   };

//   useEffect(() => {
//     // try {
//     fetchAllActiveCategory();
//     // } catch (error) {}
//   }, []);

//   // FETCHING ITEM CATEGORY --------------------------------------------------
//   const fetchItemCat = async () => {
//     try {
//       const res = await request.get(`Material/GetallActiveSubcategoryDropDown`);
//       setCategoryData(res.data);
//     } catch (error) {}
//   };

//   useEffect(() => {
//     // try {
//     fetchItemCat();
//     // } catch (error) {}
//   }, []);

//   // FETCHING SUB CATEGORY ---------------------
//   const itemCategoryNameParameter = categoryData?.find(
//     (x) => x.itemCategoryId === Number(itemCategoryName)
//   )?.itemCategoryName;
//   const fetchSubCat = async () => {
//     try {
//       const res = await request.get(`Material/GetAllItemcategoriesmaterial`, {
//         params: {
//           category: itemCategoryNameParameter,
//         },
//       });
//       setSubCategory(res.data);
//     } catch (error) {}
//   };

//   useEffect(() => {
//     // try {
//     fetchSubCat();
//     // } catch (error) {}
//   }, [itemCategoryName]);

//   const fetchUom = async () => {
//     try {
//       const res = await request.get("Uom/GetAllActiveUoms");
//       setUom(res.data);
//     } catch (error) {}
//   };

//   useEffect(() => {
//     try {
//       fetchUom();
//     } catch (error) {}
//   }, []);

//   // const categoryStatusHandler = (data) => {
//   //   const newData = JSON.parse(data);
//   //   // x`console.log(newData);
//   //   if (data) {
//   //     setItemCategory(newData.itemCategoryName);
//   //     setValue("formData.itemCategoryName", newData.itemCategoryName);
//   //   } else {
//   //     setItemCategory("");
//   //     setValue("formData.itemCategoryName", "");
//   //   }
//   //   // console.log(newData);
//   // };

//   // const subCategoryStatusHandler = (data) => {
//   //   const newData = JSON.parse(data);
//   //   // console.log(newData);
//   //   if (data) {
//   //     setValue("formData.subCategoryId", newData.subcategoryId);
//   //   } else {
//   //     // setValue("formData.itemCategoryId", "");
//   //     setValue("formData.subCategoryId", "");
//   //   }
//   //   // console.log(newData);
//   // };

//   // useEffect(() => {
//   //   console.log(accountTitleRef);
//   // }, [watch("formData.subCategoryId")]);

//   const submitHandler = async (data) => {
//     console.log(data);
//     try {
//       if (data.formData.id === "") {
//         delete data.formData["id"];
//         const res = await request
//           .post(`Material/AddNewMaterial`, {
//             itemCode: data.formData.itemCode,
//             itemDescription: data.formData.itemDescription,
//             subCategoryId: data.formData.subCategoryId,
//             itemCategoryName: allActiveCategory?.find(
//               (x) => x.itemCategoryId === data.formData.itemCategoryId
//             )?.itemCategoryName,
//             uomId: data.formData.uomId,
//             bufferLevel: data.formData.bufferLevel,
//             addedBy: data.formData.addedBy,
//           })
//           .then((res) => {
//             ToastComponent(
//               "Success",
//               "New Material created!",
//               "success",
//               toast
//             );
//             getMaterialHandler();
//             onClose();
//           })
//           .catch((err) => {
//             ToastComponent("Error", err.response.data, "error", toast);
//             data.formData.id = "";
//           });
//       } else {
//         const res = await request
//           .put(`Material/UpdateMaterials`, {
//             id: data.formData.id,
//             itemCode: data.formData.itemCode,
//             itemDescription: data.formData.itemDescription,
//             subCategoryId: data.formData.subCategoryId,
//             itemCategoryName: allActiveCategory?.find(
//               (x) => x.itemCategoryId === data.formData.itemCategoryId
//             )?.itemCategoryName,
//             uomId: data.formData.uomId,
//             bufferLevel: data.formData.bufferLevel,
//             addedBy: data.formData.addedBy,
//           })
//           .then((res) => {
//             ToastComponent("Success", "Material Updated", "success", toast);
//             getMaterialHandler();
//             onClose(onClose);
//           })
//           .catch((error) => {
//             ToastComponent(
//               "Update Failed",
//               error.response.data,
//               "warning",
//               toast
//             );
//           });
//       }
//     } catch (err) {}
//   };

//   const handleSubCategoryDropdown = watch("formData.itemCategoryId")
//     ? subCategory
//     : allActiveCategory;

//   useEffect(() => {
//     if (editData.id) {
//       setValue(
//         "formData",
//         {
//           // id: editData.id,
//           // itemCode: editData?.itemCode,
//           // itemDescription: editData?.itemDescription,
//           // itemCategoryName: editData?.itemCategoryName,
//           // subCategoryId: editData?.subCategoryId,
//           // subCategoryName: editData?.subCategoryName,
//           // uomId: editData?.uomId,
//           // bufferLevel: editData?.bufferLevel,
//           // modifiedBy: currentUser.userName,
//           id: editData.id,
//           itemCode: editData?.itemCode,
//           itemDescription: editData?.itemDescription,
//           itemCategoryId: editData?.itemCategoryId,
//           subCategoryId: editData?.subCategoryId,
//           uomId: editData?.uomId,
//           bufferLevel: editData?.bufferLevel,
//           modifiedBy: currentUser.userName,
//         },
//         { shouldValidate: true }
//       );
//     }
//   }, [editData]);

//   console.log(allActiveCategory);

//   return (
//     <>
//       <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
//         <DrawerOverlay />
//         <form onSubmit={handleSubmit(submitHandler)}>
//           <DrawerContent>
//             <DrawerHeader borderBottomWidth="1px">Material Form</DrawerHeader>
//             <DrawerCloseButton />
//             <DrawerBody>
//               <Stack spacing="7px">
//                 <Box>
//                   <FormLabel>Item Code:</FormLabel>
//                   <Input
//                     {...register("formData.itemCode")}
//                     placeholder="Please enter Item Code"
//                     autoComplete="off"
//                     autoFocus
//                     disabled={disableEdit}
//                     readOnly={disableEdit}
//                     _disabled={{ color: "black" }}
//                     bgColor={disableEdit && "gray.300"}
//                   />
//                   <Text color="red" fontSize="xs">
//                     {errors.formData?.itemCode?.message}
//                   </Text>
//                 </Box>

//                 <Box>
//                   <FormLabel>Item Description:</FormLabel>
//                   <Input
//                     {...register("formData.itemDescription")}
//                     placeholder="Please enter Description"
//                     autoComplete="off"
//                   />
//                   <Text color="red" fontSize="xs">
//                     {errors.formData?.itemDescription?.message}
//                   </Text>
//                 </Box>

//                 <Flex mt={3}></Flex>

//                 <Box>
//                   <FormLabel>Item Category:</FormLabel>
//                   {categoryData.length > 0 ? (
//                     <Select
//                       {...register("formData.itemCategoryId")}
//                       onChange={(e) => setItemCategory(e.target.value)}
//                       placeholder="Select Item Category"
//                     >
//                       {categoryData?.map((itemCat, i) => (
//                         <option key={i} value={itemCat.itemCategoryId}>
//                           {itemCat.itemCategoryName}
//                         </option>
//                       ))}
//                     </Select>
//                   ) : (
//                     ""
//                   )}
//                   <Text color="red" fontSize="xs">
//                     {errors.formData?.itemCategoryId?.message}
//                   </Text>
//                 </Box>

//                 <Box>
//                   <FormLabel>Item Sub Category:</FormLabel>
//                   {allActiveCategory?.length > 0 ? (
//                     <Select
//                       {...register("formData.subCategoryId")}
//                       className="inputUpperCase"
//                       // defaultValue={
//                       //   allActiveCategory?.find(
//                       //     (x) => x.subcategoryId === editData?.subCategoryId
//                       //   )?.subcategoryId
//                       // }
//                       // ref={accountTitleRef}
//                       placeholder="Select Sub Category"
//                       // onChange={(e) => subCategoryStatusHandler(e.target.value)}
//                     >
//                       {allActiveCategory?.map((subCat, i) => (
//                         <option key={i} value={subCat.subcategoryId}>
//                           {subCat.subcategoryName}
//                         </option>
//                       ))}
//                     </Select>
//                   ) : (
//                     <Select>
//                       <option>Select Sub Category</option>
//                     </Select>
//                   )}
//                   <Text color="red" fontSize="xs">
//                     {errors.formData?.subCategoryId?.message}
//                   </Text>
//                 </Box>

//                 <Box>
//                   <FormLabel>UOM:</FormLabel>
//                   {uom.length > 0 ? (
//                     <Select
//                       {...register("formData.uomId")}
//                       placeholder="Select UOM"
//                     >
//                       {uom.map((uoms) => (
//                         <option key={uoms.id} value={uoms.id}>
//                           {uoms.uomCode}
//                         </option>
//                       ))}
//                     </Select>
//                   ) : (
//                     "loading"
//                   )}
//                   <Text color="red" fontSize="xs">
//                     {errors.formData?.uomId?.message}
//                   </Text>
//                 </Box>

//                 <Box>
//                   <FormLabel>Buffer Level:</FormLabel>
//                   <Input
//                     {...register("formData.bufferLevel")}
//                     type="number"
//                     placeholder="Please enter Buffer Level"
//                     autoComplete="off"
//                     // type="number"
//                   />
//                   <Text color="red" fontSize="xs">
//                     {errors.formData?.bufferLevel?.message}
//                   </Text>
//                 </Box>
//               </Stack>
//             </DrawerBody>
//             <DrawerFooter borderTopWidth="1px">
//               <Button variant="outline" mr={3} onClick={onClose}>
//                 Cancel
//               </Button>
//               <Button type="submit" colorScheme="blue" disabled={!isValid}>
//                 Submit
//               </Button>
//             </DrawerFooter>
//           </DrawerContent>
//         </form>
//       </Drawer>
//     </>
//   );
// };
