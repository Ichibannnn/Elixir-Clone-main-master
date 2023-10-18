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

const SuppliersManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [editData, setEditData] = useState([]);
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const toast = useToast();
  const currentUser = decodeUser();

  const [isLoading, setIsLoading] = useState(true);
  const [pageTotal, setPageTotal] = useState(undefined);
  const [disableEdit, setDisableEdit] = useState(false);

  // FETCH API SUPPLIER CATEGORY:
  const fetchSupplierApi = async (pageNumber, pageSize, status, search) => {
    const response = await request.get(
      `Supplier/GetAllSupplierithPaginationOrig/${status}?PageNumber=${pageNumber}&PageSize=${pageSize}&search=${search}`
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
      routeLabel = "InActiveSupplier";
    } else {
      routeLabel = "ActivateSupplier";
    }

    request
      .put(`Supplier/${routeLabel}`, { id: id })
      .then((res) => {
        ToastComponent("Success", "Status updated", "success", toast);
        getSupplierHandler();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //SHOW SUPPLIER CATEGORY DATA----
  const getSupplierHandler = () => {
    fetchSupplierApi(currentPage, pageSize, status, search).then((res) => {
      setIsLoading(false);
      setSuppliers(res);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    getSupplierHandler();

    return () => {
      setSuppliers([]);
    };
  }, [currentPage, pageSize, status, search]);

  // SEARCH
  const searchHandler = (inputValue) => {
    setSearch(inputValue);
    // console.log(inputValue)
  };

  //ADD SUPPLIER CATEGORY HANDLER---
  const addSupplierHandler = () => {
    setEditData({
      id: "",
      supplierCode: "",
      supplierName: "",
      supplierAddress: "",
      addedBy: currentUser.userName,
      modifiedBy: "",
    });
    onOpen();
    setDisableEdit(false);
  };

  //EDIT SUPPLIER CATEGORY--
  const editSupplierHandler = (supplier) => {
    setDisableEdit(true);
    setEditData(supplier);
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
      p={2}
      bg="form"
      boxShadow="md"
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
                  placeholder="Search Supplier Name"
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
                  <Thead bg="secondary">
                    <Tr fontSize="15px">
                      <Th color="#D6D6D6" fontSize="10px">
                        ID
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Supplier Code
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Supplier Name
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Supplier Address
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Added By
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Date Added
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Action
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {suppliers?.supplier?.map((sup, i) => (
                      <Tr key={i}>
                        <Td fontSize="11px">{sup.id}</Td>
                        <Td fontSize="11px">{sup.supplierCode}</Td>
                        <Td fontSize="11px">{sup.supplierName}</Td>
                        <Td fontSize="11px">{sup.supplierAddress}</Td>
                        <Td fontSize="11px">{sup.addedBy}</Td>
                        <Td fontSize="11px">{sup.dateAdded}</Td>

                        <Td pl={0}>
                          <Flex>
                            <HStack>
                              <Button
                                bg="none"
                                onClick={() => editSupplierHandler(sup)}
                                size="sm"
                                p={0}
                              >
                                <AiTwotoneEdit fontSize="15px" />
                              </Button>

                              <Popover>
                                {({ onClose }) => (
                                  <>
                                    <PopoverTrigger>
                                      {sup.isActive === true ? (
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
                                            {sup.isActive === true ? (
                                              <Text>
                                                Are you sure you want to set
                                                this Supplier inactive?
                                              </Text>
                                            ) : (
                                              <Text>
                                                Are you sure you want to set
                                                this Supplier active?
                                              </Text>
                                            )}
                                            <Button
                                              colorScheme="green"
                                              size="sm"
                                              onClick={() =>
                                                changeStatusHandler(
                                                  sup.id,
                                                  sup.isActive
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

            <Flex justifyContent="space-between" mt={3}>
              <Button
                size="sm"
                colorScheme="blue"
                fontSize="13px"
                fontWeight="normal"
                _hover={{ bg: "blue.400", color: "#fff" }}
                w="auto"
                leftIcon={<RiAddFill fontSize="20px" />}
                borderRadius="none"
                onClick={addSupplierHandler}
              >
                New Supplier
              </Button>

              {/* PROPS */}
              {isOpen && (
                <DrawerComponent
                  isOpen={isOpen}
                  onClose={onClose}
                  fetchSupplierApi={fetchSupplierApi}
                  getSupplierHandler={getSupplierHandler}
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
                      size="sm"
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
                          size="sm"
                        />
                      ))}
                    </PaginationPageGroup>
                    <HStack>
                      <PaginationNext
                        bg="primary"
                        color="white"
                        p={1}
                        _hover={{ bg: "btnColor", color: "white" }}
                        size="sm"
                        mb={2}
                      >
                        {">>"}
                      </PaginationNext>
                      <Select
                        onChange={handlePageSizeChange}
                        bg="#FFFFFF"
                        // size="sm"
                        mb={2}
                        variant="outline"
                      >
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

export default SuppliersManagement;

const schema = yup.object().shape({
  formData: yup.object().shape({
    id: yup.string().uppercase(),
    supplierCode: yup.string().uppercase().required("Supplier Code is required"),
    supplierName: yup.string().uppercase().required("Supplier Name is required"),
    supplierAddress: yup.string().uppercase().required("Supplier Address is required"),
    addedBy: yup.string().uppercase(),
  }),
});

const currentUser = decodeUser();

const DrawerComponent = (props) => {
  const { isOpen, onClose, getSupplierHandler, editData, disableEdit } = props;
  const toast = useToast();

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
        supplierCode: "",
        supplierName: "",
        supplierAddress: "",
        addedBy: currentUser?.userName,
        modifiedBy: "",
      },
    },
  });

  const submitHandler = async (data) => {
    try {
      if (data.formData.id === "") {
        delete data.formData["id"];
        const res = await request
          .post("Supplier/AddNewSupplier", data.formData)
          .then((res) => {
            ToastComponent(
              "Success",
              "Supplier Category created!",
              "success",
              toast
            );
            getSupplierHandler();
            onClose();
          })
          .catch((err) => {
            ToastComponent("Error", err.response.data, "error", toast);
            data.formData.id = "";
          });
      } else {
        const res = await request
          .put(`Supplier/UpdateSupplier`, data.formData)
          .then((res) => {
            ToastComponent("Success", "Supplier Updated", "success", toast);
            getSupplierHandler();
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
          supplierCode: editData?.supplierCode,
          supplierName: editData?.supplierName,
          supplierAddress: editData?.supplierAddress,
          modifiedBy: currentUser.userName,
        },
        { shouldValidate: true }
      );
    }
  }, [editData]);

  // console.log(watch('formData'))

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <form onSubmit={handleSubmit(submitHandler)}>
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Supplier Form</DrawerHeader>
            <DrawerCloseButton />
            <DrawerBody>
              <Stack spacing="7px">
                <Box>
                  <FormLabel>Supplier Code:</FormLabel>
                  <Input
                    {...register("formData.supplierCode")}
                    placeholder="Please enter Supplier Code"
                    autoComplete="off"
                    disabled={disableEdit}
                    readOnly={disableEdit}
                    _disabled={{ color: "black" }}
                    bgColor={disableEdit && "gray.300"}
                    autoFocus
                  />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.supplierCode?.message}
                  </Text>
                </Box>
                <Box>
                  <FormLabel>Supplier Name:</FormLabel>
                  <Input
                    {...register("formData.supplierName")}
                    placeholder="Please enter Supplier Name"
                    autoComplete="off"
                  />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.supplierName?.message}
                  </Text>
                </Box>
                <Box>
                  <FormLabel>Supplier Address:</FormLabel>
                  <Input
                    {...register("formData.supplierAddress")}
                    placeholder="Please enter Supplier Address"
                    autoComplete="off"
                  />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.supplierAddress?.message}
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
