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
  Badge,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AiTwotoneEdit } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { RiAddFill } from "react-icons/ri";
import PageScroll from "../../utils/PageScroll";
import request from "../../services/ApiClient";
import { ToastComponent } from "../../components/Toast";
import { CUIAutoComplete } from "chakra-ui-autocomplete";

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
import axios from "axios";

const UserAccount = () => {
  const [users, setUsers] = useState([]);
  const [editData, setEditData] = useState([]);
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const toast = useToast();
  const currentUser = decodeUser();

  const [isLoading, setIsLoading] = useState(true);
  const [pageTotal, setPageTotal] = useState(undefined);
  const [disableEdit, setDisableEdit] = useState(false);

  const fetchUserApi = async (pageNumber, pageSize, status, search) => {
    const response = await request.get(
      `User/GetAllUserWithPaginationOrig/${status}?PageNumber=${pageNumber}&PageSize=${pageSize}&search=${search}`
    );

    return response.data;
  };

  //FOR DRAWER
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();

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

  //SHOW USER DATA----
  const getUserHandler = () => {
    fetchUserApi(currentPage, pageSize, status, search).then((res) => {
      setIsLoading(false);
      setUsers(res);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    getUserHandler();

    return () => {
      setUsers([]);
    };
  }, [currentPage, pageSize, status, search]);

  // console.log(users);

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
      routeLabel = "InactiveUser";
    } else {
      routeLabel = "ActivateUser";
    }

    request
      .put(`/User/${routeLabel}`, { id: id })
      .then((res) => {
        ToastComponent("Success", "Status updated", "success", toast);
        getUserHandler();
      })
      .catch((error) => {
        ToastComponent("Error", error.response.data, "warning", toast);
      });
    // console.log(routeLabel)
  };

  const searchHandler = (inputValue) => {
    setSearch(inputValue);
    // console.log(inputValue)
  };

  //ADD USER HANDLER---
  const addUserHandler = () => {
    setEditData({
      id: "",
      fullName: "",
      userName: "",
      password: "",
      userRoleId: "",
      department: "",
      addedBy: currentUser.fullName,
      modifiedBy: "",
    });
    onOpen();
    setDisableEdit(false);
  };

  //EDIT USER--
  const editUserHandler = (user) => {
    setDisableEdit(true);
    setEditData(user);
    onOpen();
    console.log(user);
    // onOpenEdit();
  };

  // console.log(status);

  return (
    <Flex
      color="fontColor"
      h="auto"
      w="full"
      flexDirection="column"
      p={2}
      bg="form"
    >
      <Flex p={2} w="full">
        <Flex flexDirection="column" gap={1} w="full">
          <Flex
            justifyContent="space-between"
            alignItems="center"
            borderRadius="md"
          >
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
            <PageScroll maxHeight="700px">
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
                  className="inputUpperCase"
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
                        Fullname
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        Username
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        Department
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        User Role
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        Added By
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        Date Added
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        Action
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {users.user?.map((user, i) => (
                      <Tr key={i}>
                        <Td fontSize="xs">{user.id}</Td>
                        <Td fontSize="xs">{user.fullName}</Td>
                        <Td fontSize="xs">{user.userName}</Td>
                        <Td fontSize="xs">{user.department}</Td>
                        <Td fontSize="xs">{user.userRole}</Td>
                        <Td fontSize="xs">{user.addedBy}</Td>
                        <Td fontSize="xs">{user.dateAdded}</Td>

                        <Td pl={0}>
                          <HStack>
                            <Button
                              bg="none"
                              p={0}
                              size="sm"
                              onClick={() => editUserHandler(user)}
                            >
                              <AiTwotoneEdit fontSize="15px" />
                            </Button>

                            <Popover>
                              {({ isOpen, onClose }) => (
                                <>
                                  <PopoverTrigger>
                                    {user.isActive === true ? (
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
                                          {user.isActive === true ? (
                                            <Text>
                                              Are you sure you want to set this
                                              user account inactive?
                                            </Text>
                                          ) : (
                                            <Text>
                                              Are you sure you want to set this
                                              user account active?
                                            </Text>
                                          )}
                                          <Button
                                            colorScheme="green"
                                            size="sm"
                                            onClick={() =>
                                              changeStatusHandler(
                                                user.id,
                                                user.isActive
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
                fontSize="13px"
                fontWeight="normal"
                colorScheme="blue"
                _hover={{ bg: "blue.400", color: "#fff" }}
                w="auto"
                leftIcon={<RiAddFill fontSize="20px" />}
                // borderRadius="none"
                onClick={addUserHandler}
              >
                New
              </Button>

              {/* PROPS */}
              {isOpen && (
                <DrawerComponent
                  isOpen={isOpen}
                  onClose={onClose}
                  fetchUserApi={fetchUserApi}
                  getUserHandler={getUserHandler}
                  editData={editData}
                  disableEdit={disableEdit}
                />
              )}

              {/* PROPS */}
              {/* {isEdit && (
                <DrawerComponentEdit
                  isEdit={isEdit}
                  onCloseEdit={onCloseEdit}
                  fetchUserApi={fetchUserApi}
                  getUserHandler={getUserHandler}
                  editData={editData}
                  disableEdit={disableEdit}
                />
              )} */}

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
                      <Select onChange={handlePageSizeChange}>
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

export default UserAccount;

const schema = yup.object().shape({
  formData: yup.object().shape({
    id: yup.string(),
    fullName: yup.string().required("Fullname is required"),
    userName: yup
      .string()
      .required("Username is required")
      .min(5, "Username must be at least 5 characters"),
    password: yup
      .string()
      .required("Password is required")
      .min(5, "Password must be at least 5 characters"),
    userRoleId: yup.string().required("User Role is required"),
    department: yup.string().required("Department is required"),
  }),
});

const currentUser = decodeUser();

// DRAWER FOR ADD ACCOUNTS -----------------------
const DrawerComponent = (props) => {
  const { isOpen, onClose, getUserHandler, editData, disableEdit } = props;

  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const toast = useToast();
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const onCloseDrawer = () => {
    setIsOpenDrawer(false);
  };

  // SEDAR
  const [pickerItems, setPickerItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleCreateItem = (item) => {
    setPickerItems((curr) => [item]);
    setSelectedItems((curr) => [item]);
  };

  const handleSelectedItemsChange = (selectedItems) => {
    if (selectedItems) {
      setSelectedItems(selectedItems);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        id: "",
        empId: "",
        fullName: "",
        userName: "",
        password: "",
        userRoleId: "",
        department: "",
        addedBy: currentUser?.fullName,
        modifiedBy: "",
        empId: "",
      },
    },
  });

  const fetchRoles = async () => {
    try {
      const res = await request.get("Role/GetAllActiveRoles");
      setRoles(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    try {
      fetchRoles();
    } catch (error) {}
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://rdfsedar.com/api/data/employees", {
        headers: {
          Authorization: "Bearer " + process.env.REACT_APP_SEDAR_TOKEN,
        },
      });

      const sedarEmployees = res.data.data.map((item) => {
        return {
          label: item.general_info.full_id_number,
          value: item.general_info.full_id_number,
        };
      });

      setPickerItems(res.data.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const submitHandler = async (data) => {
    console.log(data);
    try {
      if (data.formData.id === "") {
        delete data.formData["id"];
        const res = await request
          .post(`User/AddNewUser`, data.formData)
          .then((res) => {
            ToastComponent("Success", "New user created!", "success", toast);
            getUserHandler();
            onClose();
          })
          .catch((err) => {
            ToastComponent("Error", err.response.data, "error", toast);
            data.formData.id = "";
          });
      } else {
        const res = await request
          .put(`User/UpdateUserInfo`, data.formData)
          .then((res) => {
            ToastComponent("Success", "User Updated", "success", toast);
            getUserHandler();
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

  const [idNumber, setIdNumber] = useState();
  const [info, setInfo] = useState();
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    // console.log(pickerItems.filter(item=> {
    //   return item?.label.toLowerCase().includes(idNumber)
    // }).splice(0,10))

    setInfo(
      pickerItems
        .filter((item) => {
          return item?.general_info?.full_id_number_full_name
            .toLowerCase()
            .includes(idNumber);
        })
        .splice(0, 10)
    );

    return () => {};
  }, [idNumber]);

  const handleAutoFill = (data) => {
    // console.log("handleautofill data:", data);
    // const fName = data?.general_info?.first_name;
    // console.log(fName);

    // if (fName) {
    //   const names = fName.split(" ")

    //   if (names.length >= 2) {
    //     const name1 = names[0].charAt(0).toLowerCase()
    //     const name2 = names[1].charAt(0).toLowerCase()

    //   }

    // }

    setValue("formData.empId", data?.general_info?.full_id_number);
    setValue("formData.fullName", data?.general_info?.full_name);
    setValue("formData.department", data?.unit_info?.department_name);
    setValue(
      "formData.userName",
      data?.general_info?.first_name
        .split(" ")
        .map((i) => i.charAt(0))
        .join("")
        .toLowerCase() +
        data?.general_info.last_name.split(" ").join("").toLowerCase()
    );
    setValue(
      "formData.password",
      data?.general_info?.first_name
        .split(" ")
        .map((i) => i.charAt(0))
        .join("")
        .toLowerCase() +
        data?.general_info.last_name.split(" ").join("").toLowerCase()
      // + "1234"
    );
    setShowLoading(false);
  };

  useEffect(() => {
    if (editData.id) {
      setValue(
        "formData",
        {
          id: editData.id,
          empId: editData.empId,
          fullName: editData?.fullName,
          userName: editData?.userName,
          password: editData?.password,
          userRoleId: editData?.userRoleId,
          department: editData?.department,
          modifiedBy: currentUser.fullName,
        },
        { shouldValidate: true }
      );
    }
  }, [editData]);

  useEffect(() => {
    if (editData.id) {
      const employeeDetails = pickerItems?.find(
        (item) => item.general_info.full_id_number === editData.empId
      );

      if (employeeDetails) {
        setValue("formData", {
          fullName: employeeDetails?.general_info?.full_name,
          department: employeeDetails?.unit_info?.department_name,
          id: editData.id,
          empId: editData.empId,
          userName: editData?.userName,
          password: editData?.password,
          userRoleId: editData?.userRoleId,
          modifiedBy: currentUser.fullName,
        });
      }
    }
  }, [pickerItems]);

  // console.log(watch("formData.empId"));
  // console.log(pickerItems);

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onCloseDrawer}>
        <DrawerOverlay />
        <form onSubmit={handleSubmit(submitHandler)}>
          <DrawerContent>
            <DrawerHeader
              borderBottomWidth="1px"
              bg="secondary"
              color="white"
              fontSize="md"
            >
              User Form
            </DrawerHeader>
            <DrawerBody>
              <Stack spacing={4} mt={4}>
                <Box>
                  <Badge
                    fontWeight="semibold"
                    fontFamily="revert"
                    fontSize="sm"
                    mb={3}
                  >
                    USER DETAILS:
                  </Badge>

                  <Box pl={2}>
                    <Text fontSize="sm" fontWeight="semibold">
                      Employee ID:
                    </Text>
                    <Input
                      fontSize="14px"
                      {...register("formData.empId")}
                      disabled={disableEdit}
                      readOnly={disableEdit}
                      _disabled={{ color: "black" }}
                      bgColor={disableEdit && "gray.300"}
                      autoComplete="off"
                      onChange={(e) => setIdNumber(e.target.value)}
                      onFocus={() => setShowLoading(true)}
                    />
                    <Box
                      style={{ position: "relative", width: "100%" }}
                      onBlur={() => setShowLoading(false)}
                    >
                      <div
                        className="filteredData"
                        style={{ display: showLoading ? "block" : "none" }}
                      >
                        {showLoading &&
                          info?.map((item, i) => {
                            return (
                              <Text
                                key={i}
                                onClick={() => {
                                  handleAutoFill(item);
                                }}
                                style={{ cursor: "pointer", zIndex: 999 }}
                              >
                                {item?.general_info?.full_id_number}
                              </Text>
                            );
                          })}
                        {showLoading && pickerItems.length <= 0 && (
                          <div>LOADING...</div>
                        )}
                      </div>
                    </Box>
                  </Box>

                  <Box pl={2}>
                    <Text fontSize="sm" fontWeight="semibold">
                      Full Name:
                    </Text>
                    <Input
                      fontSize="14px"
                      {...register("formData.fullName")}
                      disabled={disableEdit}
                      readOnly={disableEdit}
                      _disabled={{ color: "black" }}
                      bgColor={disableEdit && "gray.300"}
                      autoFocus
                      autoComplete="off"
                    />
                    <Text color="red" fontSize="xs">
                      {errors.formData?.fullName?.message}
                    </Text>
                  </Box>

                  <Flex mt={3}></Flex>
                  <Box pl={2}>
                    <Text fontSize="sm" fontWeight="semibold">
                      Department:
                    </Text>
                    <Input
                      fontSize="xs"
                      {...register("formData.department")}
                      disabled={disableEdit}
                      readOnly={disableEdit}
                      _disabled={{ color: "black" }}
                      bgColor={disableEdit && "gray.300"}
                      autoFocus
                      autoComplete="off"
                    />
                    <Text color="red" fontSize="xs">
                      {errors.formData?.department?.message}
                    </Text>
                  </Box>
                </Box>

                <Box>
                  <Badge
                    fontWeight="semibold"
                    fontFamily="revert"
                    fontSize="sm"
                    mb={3}
                  >
                    USER PERMISSION:
                  </Badge>
                  <Box pl={2}>
                    <Text fontSize="sm" fontWeight="semibold">
                      Username:
                    </Text>
                    <Input
                      fontSize="14px"
                      {...register("formData.userName")}
                      placeholder="Please enter Fullname"
                      autoComplete="off"
                      disabled={disableEdit}
                      readOnly={disableEdit}
                      _disabled={{ color: "black" }}
                      bgColor={disableEdit && "gray.300"}
                    />
                    <Text color="red" fontSize="xs">
                      {errors.formData?.userName?.message}
                    </Text>
                  </Box>

                  <Flex mt={3}></Flex>
                  <Box pl={2}>
                    <Text fontSize="sm" fontWeight="semibold">
                      Password:
                    </Text>
                    <InputGroup>
                      <Input
                        fontSize="14px"
                        type={showPassword ? "text" : "password"}
                        {...register("formData.password")}
                        placeholder="Please enter Password"
                        autoComplete="off"
                      />
                      <InputRightElement>
                        <Button
                          bg="none"
                          onClick={() => setShowPassword(!showPassword)}
                          size="sm"
                        >
                          {showPassword ? <VscEye /> : <VscEyeClosed />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <Text color="red" fontSize="xs">
                      {errors.formData?.password?.message}
                    </Text>
                  </Box>

                  <Flex mt={3}></Flex>

                  <Box pl={2}>
                    <Text fontSize="sm" fontWeight="semibold">
                      User Role:
                    </Text>
                    {roles.length > 0 ? (
                      <Select
                        fontSize="14px"
                        {...register("formData.userRoleId")}
                        placeholder="Select Role"
                      >
                        {roles.map((rol) => (
                          <option key={rol.id} value={rol.id}>
                            {rol.roleName}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      "loading"
                    )}
                    <Text color="red" fontSize="xs">
                      {errors.formData?.userRoleId?.message}
                    </Text>
                  </Box>
                </Box>
              </Stack>
            </DrawerBody>
            <DrawerFooter borderTopWidth="1px">
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" colorScheme="blue">
                Submit
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </Drawer>
    </>
  );
};

// DRAWER FOR EDIT ACCOUNTS
// const DrawerComponentEdit = (props) => {
//   const { isEdit, onCloseEdit, getUserHandler, editData, disableEdit } = props;

//   const [showPassword, setShowPassword] = useState(false);
//   const [roles, setRoles] = useState([]);
//   const [departments, setDepartment] = useState([]);
//   const toast = useToast();

//   const [isOpenDrawer, setIsOpenDrawer] = useState(false);

//   const onCloseDrawer = () => {
//     setIsOpenDrawer(false);
//   };

//   // SEDAR
//   const [pickerItems, setPickerItems] = useState([]);
//   const [selectedItems, setSelectedItems] = useState([]);

//   const handleCreateItem = (item) => {
//     setPickerItems((curr) => [item]);
//     setSelectedItems((curr) => [item]);
//   };

//   const handleSelectedItemsChange = (selectedItems) => {
//     if (selectedItems) {
//       setSelectedItems(selectedItems);
//     }
//   };

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//   } = useForm({
//     resolver: yupResolver(schema),
//     mode: "onChange",
//     defaultValues: {
//       formData: {
//         id: "",
//         empId: "",
//         fullName: "",
//         userName: "",
//         password: "",
//         userRoleId: "",
//         department: "",
//         addedBy: currentUser?.fullName,
//         modifiedBy: "",
//         empId: "",
//       },
//     },
//   });

//   const fetchRoles = async () => {
//     try {
//       const res = await request.get("Role/GetAllActiveRoles");
//       setRoles(res.data);
//     } catch (error) {}
//   };

//   useEffect(() => {
//     try {
//       fetchRoles();
//     } catch (error) {}
//   }, []);

//   // const fetchDepartment = async () => {
//   //   try {
//   //     const res = await request.get("User/GetAllActiveDepartment");
//   //     setDepartment(res.data);
//   //   } catch (error) {}
//   // };

//   // useEffect(() => {
//   //   try {
//   //     fetchDepartment();
//   //   } catch (error) {}
//   // }, []);

//   const fetchEmployees = async () => {
//     try {
//       const res = await axios.get("http://rdfsedar.com/api/data/employees", {
//         headers: {
//           Authorization: "Bearer " + process.env.REACT_APP_SEDAR_TOKEN,
//         },
//       });

//       const sedarEmployees = res.data.data.map((item) => {
//         return {
//           label: item.general_info.full_id_number,
//           value: item.general_info.full_id_number,
//         };
//       });

//       setPickerItems(res.data.data);
//     } catch (error) {}
//   };

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const submitHandler = async (data) => {
//     // console.log(first)
//     try {
//       if (data.formData.id === "") {
//         delete data.formData["id"];
//         const res = await request
//           .post(`User/AddNewUser`, data.formData)
//           .then((res) => {
//             ToastComponent("Success", "New user created!", "success", toast);
//             getUserHandler();
//             onCloseEdit();
//           })
//           .catch((err) => {
//             ToastComponent("Error", err.response.data, "error", toast);
//             data.formData.id = "";
//           });
//       } else {
//         const res = await request
//           .put(`User/UpdateUserInfo`, data.formData)
//           .then((res) => {
//             ToastComponent("Success", "User Updated", "success", toast);
//             getUserHandler();
//             onCloseEdit(onCloseEdit);
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

//   const [idNumber, setIdNumber] = useState();
//   const [info, setInfo] = useState();
//   const [showLoading, setShowLoading] = useState(false);

//   useEffect(() => {
//     // console.log(pickerItems.filter(item=> {
//     //   return item?.label.toLowerCase().includes(idNumber)
//     // }).splice(0,10))

//     setInfo(
//       pickerItems
//         .filter((item) => {
//           return item?.general_info?.full_id_number_full_name
//             .toLowerCase()
//             .includes(idNumber);
//         })
//         .splice(0, 50)
//     );

//     // console.log(
//     //   pickerItems
//     //     .filter((item) => {
//     //       return item?.general_info?.full_id_number_full_name
//     //         .toLowerCase()
//     //         .includes(idNumber);
//     //     })
//     //     .splice(0, 50)
//     // );

//     return () => {};
//   }, [idNumber]);

//   const handleAutoFill = (data) => {
//     console.log("handleautofill data:", data);
//     setValue("formData.empId", data?.general_info?.full_id_number);
//     setValue("formData.fullName", data?.general_info?.full_name);
//     setValue("formData.department", data?.unit_info?.department_name);
//     // let data;
//     // function generateUsername(data) {
//     //   const names = data?.general_info?.full_name.split(' ');
//     //   const username = names[0][0] + names[names.length - 1];
//     //   return username.toLowerCase();
//     // }

//     // setValue("formData.userName", )
//     setValue(
//       "formData.userName",
//       data?.general_info?.first_name.charAt(0).toLowerCase() +
//         data?.general_info.last_name.toLowerCase()
//     );
//     setValue(
//       "formData.password",
//       data?.general_info?.first_name.charAt(0).toLowerCase() +
//         data?.general_info.last_name.toLowerCase()
//       // +  "1234"
//     );
//     setShowLoading(false);
//   };

//   useEffect(() => {
//     if (editData.id) {
//       setValue(
//         "formData",
//         {
//           id: editData.id,
//           empId: editData.empId,
//           fullName: editData?.fullName,
//           userName: editData?.userName,
//           password: editData?.password,
//           userRoleId: editData?.userRoleId,
//           department: editData?.department,
//           modifiedBy: currentUser.fullName,
//         },
//         { shouldValidate: true }
//       );
//     }
//   }, [editData]);

//   // console.log(watch('formData.userRoleId'))

//   return (
//     <>
//       <Drawer isOpen={isEdit} placement="right" onClose={onCloseDrawer}>
//         <DrawerOverlay />
//         <form onSubmit={handleSubmit(submitHandler)}>
//           <DrawerContent>
//             <DrawerHeader
//               borderBottomWidth="1px"
//               bg="secondary"
//               color="white"
//               fontSize="md"
//             >
//               User Form
//             </DrawerHeader>
//             {/* <DrawerCloseButton color="white" /> */}
//             <DrawerBody>
//               <Stack spacing={4} mt={4}>
//                 <Box>
//                   <Badge
//                     fontWeight="semibold"
//                     fontFamily="revert"
//                     fontSize="sm"
//                     mb={3}
//                   >
//                     USER DETAILS:
//                   </Badge>

//                   <Box pl={2}>
//                     <Text fontSize="sm" fontWeight="semibold">
//                       Employee ID:
//                     </Text>
//                     <Input
//                       fontSize="14px"
//                       {...register("formData.empId")}
//                       autoComplete="off"
//                       onChange={(e) => setIdNumber(e.target.value)}
//                       onFocus={() => setShowLoading(true)}
//                       // onBlur={() => setShowLoading(false)}
//                     />
//                     <Box
//                       style={{ position: "relative", width: "100%" }}
//                       onBlur={() => setShowLoading(false)}
//                     >
//                       <div
//                         className="filteredData"
//                         style={{ display: showLoading ? "block" : "none" }}
//                       >
//                         {showLoading &&
//                           info?.map((item, i) => {
//                             return (
//                               <Text
//                                 key={i}
//                                 onClick={() => {
//                                   handleAutoFill(item);
//                                 }}
//                                 style={{ cursor: "pointer", zIndex: 999 }}
//                               >
//                                 {item?.general_info?.full_id_number}
//                               </Text>
//                             );
//                           })}
//                         {showLoading && pickerItems.length <= 0 && (
//                           <div>LOADING...</div>
//                         )}
//                       </div>
//                     </Box>
//                   </Box>

//                   <Box pl={2}>
//                     <Text fontSize="sm" fontWeight="semibold">
//                       Full Name:
//                     </Text>
//                     <Input
//                       fontSize="14px"
//                       {...register("formData.fullName")}
//                       // placeholder="Please enter Fullname"
//                       disabled={disableEdit}
//                       autoFocus
//                       autoComplete="off"
//                       readOnly={disableEdit}
//                       _disabled={{ color: "black" }}
//                       bgColor={disableEdit && "gray.300"}
//                     />
//                     <Text color="red" fontSize="xs">
//                       {errors.formData?.fullName?.message}
//                     </Text>
//                   </Box>

//                   <Flex mt={3}></Flex>
//                   <Box pl={2}>
//                     <Text fontSize="sm" fontWeight="semibold">
//                       Department:
//                     </Text>
//                     <Input
//                       disabled={disableEdit}
//                       fontSize="xs"
//                       {...register("formData.department")}
//                       // placeholder="Please enter Fullname"
//                       autoFocus
//                       autoComplete="off"
//                       readOnly={disableEdit}
//                       _disabled={{ color: "black" }}
//                       bgColor={disableEdit && "gray.300"}
//                     />
//                     <Text color="red" fontSize="xs">
//                       {errors.formData?.department?.message}
//                     </Text>
//                   </Box>
//                 </Box>

//                 <Box>
//                   <Badge
//                     fontWeight="semibold"
//                     fontFamily="revert"
//                     fontSize="sm"
//                     mb={3}
//                   >
//                     USER PERMISSION:
//                   </Badge>
//                   <Box pl={2}>
//                     <Text fontSize="sm" fontWeight="semibold">
//                       Username:
//                     </Text>
//                     <Input
//                       fontSize="14px"
//                       {...register("formData.userName")}
//                       placeholder="Please enter Fullname"
//                       autoComplete="off"
//                       disabled={disableEdit}
//                       readOnly={disableEdit}
//                       _disabled={{ color: "black" }}
//                       bgColor={disableEdit && "gray.300"}
//                     />
//                     <Text color="red" fontSize="xs">
//                       {errors.formData?.userName?.message}
//                     </Text>
//                   </Box>

//                   <Flex mt={3}></Flex>
//                   <Box pl={2}>
//                     <Text fontSize="sm" fontWeight="semibold">
//                       Password:
//                     </Text>
//                     <InputGroup>
//                       <Input
//                         // readOnly={disableEdit}
//                         // disabled={disableEdit}
//                         fontSize="14px"
//                         type={showPassword ? "text" : "password"}
//                         {...register("formData.password")}
//                         placeholder="Please enter Password"
//                         autoComplete="off"
//                       />
//                       <InputRightElement>
//                         <Button
//                           bg="none"
//                           onClick={() => setShowPassword(!showPassword)}
//                           size="sm"
//                         >
//                           {showPassword ? <VscEye /> : <VscEyeClosed />}
//                         </Button>
//                       </InputRightElement>
//                     </InputGroup>
//                     <Text color="red" fontSize="xs">
//                       {errors.formData?.password?.message}
//                     </Text>
//                   </Box>

//                   <Flex mt={3}></Flex>

//                   <Box pl={2}>
//                     <Text fontSize="sm" fontWeight="semibold">
//                       User Role:
//                     </Text>
//                     {roles.length > 0 ? (
//                       <Select
//                         fontSize="14px"
//                         // disabled={disableEdit}
//                         // readOnly={disableEdit}
//                         // _disabled={{ color: "black" }}
//                         // bgColor={disableEdit && "gray.400"}
//                         {...register("formData.userRoleId")}
//                         placeholder="Select Role"
//                       >
//                         {roles.map((rol) => (
//                           <option key={rol.id} value={rol.id}>
//                             {rol.roleName}
//                           </option>
//                         ))}
//                       </Select>
//                     ) : (
//                       "loading"
//                     )}
//                     <Text color="red" fontSize="xs">
//                       {errors.formData?.userRoleId?.message}
//                     </Text>
//                   </Box>
//                 </Box>
//               </Stack>
//             </DrawerBody>
//             <DrawerFooter borderTopWidth="1px">
//               <Button variant="outline" mr={3} onClick={onCloseEdit}>
//                 Cancel
//               </Button>
//               <Button type="submit" colorScheme="blue">
//                 Submit
//               </Button>
//             </DrawerFooter>
//           </DrawerContent>
//         </form>
//       </Drawer>
//     </>
//   );
// };
