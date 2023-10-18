import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  ButtonGroup,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
  HStack,
  ModalOverlay,
  useDisclosure,
  Input,
  Box,
  FormLabel,
  Select,
  Stack,
  Image,
} from "@chakra-ui/react";
import request from "../../../../services/ApiClient";
import PageScroll from "../../../../utils/PageScroll";
import moment from "moment";
// import { EditModal } from "./ActionModalBorrowed";
import { ToastComponent } from "../../../../components/Toast";
import Swal from "sweetalert2";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { decodeUser } from "../../../../services/decode-user";
import { useReactToPrint } from "react-to-print";
import { BsFillPrinterFill } from "react-icons/bs";

const currentUser = decodeUser();

export const ViewModal = ({
  isOpen,
  onCloseView,
  statusBody,
  fetchBorrowed,
  setIsLoading,
  issueBorrowData,
  fetchNotificationWithParams,
}) => {
  const {
    isOpen: isEdit,
    onOpen: openEdit,
    onClose: closeEdit,
  } = useDisclosure();
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const { isOpen: isCOA, onOpen: openCOA, onClose: closeCOA } = useDisclosure();

  const [borrowedDetailsData, setBorrowedDetailsData] = useState([]);
  const [editData, setEditData] = useState({
    id: "",
    itemCode: "",
    itemDescription: "",
    returnQuantity: "",
    consumes: "",
    quantity: "",
  });
  const [coaId, setCoaId] = useState("");

  const toast = useToast();

  const id = statusBody.id;
  const fetchBorrowedDetailsApi = async (id) => {
    const res = await request.get(
      `Borrowed/GetAllDetailsInBorrowedIssue?id=${id}`
    );
    return res.data;
  };

  const fetchBorrowedDetails = () => {
    fetchBorrowedDetailsApi(id).then((res) => {
      setBorrowedDetailsData(res);
    });
  };

  useEffect(() => {
    fetchBorrowedDetails();
  }, [id]);

  const closeHandler = () => {
    const updatedBorrowedDetails = borrowedDetailsData.map((item) => {
      if (item.id === editData.id) {
        return { ...item, returnQuantity: 0 };
      }
      return item;
    });
    setBorrowedDetailsData(updatedBorrowedDetails);
    onCloseView();
  };

  const returnZero = () => {
    // console.log(borrowedDetailsData[0]?.borrowedPKey);
    setIsLoading(true);
    Swal.fire({
      title: "Confirmation!",
      text: "Changes was not saved. Are you sure you want to exit?",
      icon: "info",
      color: "white",
      background: "#1B1C1D",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#CBD1D8",
      confirmButtonText: "Yes",
      heightAuto: false,
      width: "40em",
      customClass: {
        container: "my-swal",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          const res = request
            .put(`Borrowed/CloseSaveBorrowed`, [
              {
                borrowedPKey: borrowedDetailsData[0]?.borrowedPKey,
                // returnQuantity: zeroValue,
              },
            ])
            .then((res) => {
              // ToastComponent(
              //   "Success",
              //   "Cancelled !",
              //   "success",
              //   toast
              // );
              onCloseView();
              fetchBorrowedDetails();
              fetchNotificationWithParams();
            })
            .catch((err) => {
              ToastComponent("Error", err.response.data, "error", toast);
              setIsLoading(false);
            });
        } catch (error) {}
      }
    });
  };

  const editHandler = ({
    id,
    itemCode,
    itemDescription,
    returnQuantity,
    consumes,
    quantity,
  }) => {
    if (
      id &&
      itemCode &&
      itemDescription &&
      returnQuantity >= 0 &&
      consumes >= 0 &&
      quantity
    ) {
      setEditData({
        id: id,
        itemCode: itemCode,
        itemDescription: itemDescription,
        returnQuantity: returnQuantity,
        consumes: consumes,
        quantity: quantity,
      });
      openEdit();
    } else {
      setEditData({
        id: "",
        itemCode: "",
        itemDescription: "",
        returnQuantity: "",
        consumes: "",
        quantity: "",
      });
    }
  };

  const submitBody = () => {
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to save this information?",
      icon: "info",
      color: "black",
      background: "white",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#CBD1D8",
      confirmButtonText: "Yes",
      heightAuto: false,
      width: "40em",
      customClass: {
        container: "my-swal",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          if (statusBody.id) {
            const res = request
              .put(`Borrowed/SaveReturnedQuantity`, [
                {
                  id: statusBody.id,
                },
              ])
              .then((res) => {
                fetchBorrowed();
                ToastComponent(
                  "Success",
                  "Returned materials was saved",
                  "success",
                  toast
                );
                onCloseView();
              })
              .catch((err) => {
                ToastComponent(
                  "Error",
                  "Returned materials was not saved",
                  "error",
                  toast
                );
                setIsLoading(false);
              });
          }
        } catch (error) {}
      }
    });
  };

  const coaIdHandler = (data) => {
    // console.log(borrowedDetailsData[0]?.borrowedPKey);
    // console.log(borrowedDetailsData);
    // console.log(data);
    if (data) {
      setCoaId(data);

      openCOA();
    } else {
      setCoaId("");
    }
    console.log(coaId);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="5xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader mb={5} fontSize="md"></ModalHeader>
        {/* <ModalCloseButton onClick={onClose} /> */}

        <ModalBody mb={10} ref={componentRef}>
          {/* Display Borrowed */}
          <Flex spacing={0} justifyContent="start" flexDirection="column">
            <Image src="/images/RDF Logo.png" w="13%" ml={3} />
            <Text fontSize="8px" ml={2}>
              Purok 6, Brgy. Lara, City of San Fernando, Pampanga, Philippines
            </Text>
          </Flex>

          <Flex justifyContent="center" my={1}>
            <Text fontSize="xs" fontWeight="semibold">
              Borrowed Details
            </Text>
          </Flex>

          <Flex justifyContent="space-between">
            <VStack alignItems="start" spacing={-1}>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Customer Code:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.customerCode}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Customer Name:
                </Text>
                <Text fontSize="xs">{borrowedDetailsData[0]?.customer}</Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Details:
                </Text>
                <Text fontSize="xs">{borrowedDetailsData[0]?.remarks}</Text>
              </HStack>
            </VStack>

            <VStack alignItems="start" spacing={-1}>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Transaction ID:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.borrowedPKey}
                </Text>
              </HStack>

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Transaction Date:
                </Text>
                <Text fontSize="xs">
                  {" "}
                  {moment(borrowedDetailsData[0]?.preparedDate).format(
                    "MM/DD/yyyy"
                  )}
                </Text>
              </HStack>
            </VStack>
          </Flex>

          <VStack justifyContent="center">
            <PageScroll minHeight="350px" maxHeight="351px">
              <Table size="sm">
                <Thead bgColor="secondary">
                  <Tr>
                    <Th color="white" fontSize="xs">
                      Id
                    </Th>
                    <Th color="white" fontSize="xs">
                      Item Code
                    </Th>
                    <Th color="white" fontSize="xs">
                      Item Description
                    </Th>
                    <Th color="white" fontSize="xs">
                      UOM
                    </Th>
                    <Th color="white" fontSize="xs">
                      Borrowed Qty
                    </Th>
                    <Th color="white" fontSize="xs">
                      Unit Cost
                    </Th>
                    <Th color="white" fontSize="xs">
                      Prepared Date
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {borrowedDetailsData?.map((borrowdetails, i) => (
                    <Tr key={i}>
                      <Td fontSize="xs">{borrowdetails.id}</Td>
                      <Td fontSize="xs">{borrowdetails.itemCode}</Td>
                      <Td fontSize="xs">{borrowdetails.itemDescription}</Td>
                      <Td fontSize="xs">{borrowdetails.uom}</Td>
                      <Td fontSize="xs">
                        {borrowdetails.quantity.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {borrowdetails.unitCost.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {moment(borrowdetails.preparedDate).format(
                          "MM/DD/yyyy"
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </PageScroll>
            <Flex justifyContent="space-between" mt={5} w="full">
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Requested By:
                </Text>
                <Text textDecoration="underline" fontSize="xs">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {borrowedDetailsData[0]?.preparedBy}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Text>
              </HStack>
            </Flex>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup size="sm">
            <Button
              colorScheme="blue"
              onClick={handlePrint}
              // onClick={() => coaIdHandler(borrowedDetailsData[0]?.borrowedPKey)}
            >
              Print
            </Button>
            <Button
              colorScheme="gray"
              // onClick={() => returnZero(borrowedDetailsData[0]?.borrowedPKey)}
              onClick={onCloseView}
            >
              Close
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>

      {/* {isEdit && (
        <EditModal
          isOpen={isEdit}
          onClose={closeEdit}
          editData={editData}
          fetchBorrowedDetails={fetchBorrowedDetails}
        />
      )} */}

      {isCOA && (
        <AccountTitleModal
          isOpen={isCOA}
          onClose={closeCOA}
          onCloseView={onCloseView}
          borrowedDetailsData={borrowedDetailsData}
          coaId={coaId}
          setCoaId={setCoaId}
          fetchBorrowed={fetchBorrowed}
          fetchNotificationWithParams={fetchNotificationWithParams}
        />
      )}
    </Modal>
  );
};

const schema = yup.object().shape({
  formData: yup.object().shape({
    borrowedItemPKey: yup.string(),
    consume: yup
      .number()
      .required("Consume quantity is required")
      .typeError("Must be a number"),
    companyId: yup.number().required().typeError("Company Name is required"),
    departmentId: yup
      .number()
      .required()
      .typeError("Department Category is required"),
    locationId: yup.number().required().typeError("Location Name is required"),
    accountId: yup.number().required("Account Name is required"),
    empId: yup.string(),
    fullName: yup.string(),
    // fullName: yup.string().required("Fullname is required"),
  }),
});

export const ConsumeModal = ({
  isConsumeModalOpen,
  setIsConsumeModalOpen,
  isLoading,
  setIsLoading,
  highlighterId,
  materialList,
  setMaterialList,
  fetchMaterialsList,
  fetchReturnRequest,
  fetchBorrowed,
  fetchNotificationWithParams,
  materialListId,
  setMaterialListId,
  borrowedId,
  setBorrowedId,
  consumedQuantity,
  setConsumedQuantity,
  itemCode,
  setItemCode,
  itemDescription,
  setItemDescription,
  uom,
  setUom,
  returnQuantity,
}) => {
  const toast = useToast();

  const [company, setCompany] = useState([]);
  const [department, setDepartment] = useState([]);
  const [location, setLocation] = useState([]);
  const [account, setAccount] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");

  const [disableFullName, setDisableFullName] = useState(true);

  // SEDAR
  const [pickerItems, setPickerItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

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

  // // FETCH COMPANY API
  const fetchCompanyApi = async () => {
    try {
      const res = await axios.get(
        "http://10.10.2.76:8000/api/dropdown/company?api_for=vladimir&status=1&paginate=0",
        {
          headers: {
            Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
          },
        }
      );
      setCompany(res.data.result.companies);
      // console.log(res.data.result.companies);
    } catch (error) {}
  };

  // // FETCH DEPT API
  const fetchDepartmentApi = async (id = "") => {
    try {
      const res = await axios.get(
        "http://10.10.2.76:8000/api/dropdown/department?status=1&paginate=0&api_for=vladimir&company_id=" +
          id,
        {
          headers: {
            Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
          },
        }
      );
      setDepartment(res.data.result.departments);
      // console.log(res.data.result.departments);
    } catch (error) {}
  };

  // // FETCH Loc API
  const fetchLocationApi = async (id = "") => {
    try {
      const res = await axios.get(
        "http://10.10.2.76:8000/api/dropdown/location?status=1&paginate=0&api_for=vladimir&department_id=" +
          id,
        {
          headers: {
            Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
          },
        }
      );
      setLocation(res.data.result.locations);
    } catch (error) {}
  };

  // FETCH ACcount API
  const fetchAccountApi = async (id = "") => {
    try {
      const res = await axios.get(
        "http://10.10.2.76:8000/api/dropdown/account-title?status=1&paginate=0" +
          id,
        {
          headers: {
            Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
          },
        }
      );
      setAccount(res.data.result.account_titles);
    } catch (error) {}
  };

  useEffect(() => {
    fetchCompanyApi();
    fetchDepartmentApi();
    fetchLocationApi();
    fetchAccountApi();

    return () => {
      setCompany([]);
      setDepartment([]);
      setLocation([]);
      setAccount([]);
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    reset,
    watch,
    control,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        companyId: "",
        departmentId: "",
        locationId: "",
        accountId: "",
        consume: "",
        empId: "",
        fullName: "",
        addedBy: currentUser.userName,
      },
    },
  });

  // console.log(watch("formData"));

  const triggerPointHandler = (event) => {
    const newData = event.target.value;

    const selectAccountTitle = account?.find((item) => {
      return item.id === parseInt(event.target.value);
    });

    if (!selectedAccount?.name?.match(/Advances to Employees/gi)) {
      setIdNumber("");
      setValue("formData.empId", "");
      setValue("formData.fullName", "");
    }

    setSelectedAccount(selectAccountTitle?.name);
    // console.log(selectAccountTitle);
  };

  const [idNumber, setIdNumber] = useState();
  const [info, setInfo] = useState();
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    setInfo(
      pickerItems
        .filter((item) => {
          return item?.general_info?.full_id_number_full_name
            .toLowerCase()
            .includes(idNumber);
        })
        .splice(0, 50)
    );

    return () => {};
  }, [idNumber]);

  const handleAutoFill = (data) => {
    setValue("formData.empId", data?.general_info?.full_id_number);
    setValue("formData.fullName", data?.general_info?.full_name);
    setShowLoading(false);
  };

  const submitConsumeHandler = (data) => {
    // console.log(data);
    // console.log(itemDescription);
    // console.log(uom);
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to save this information?",
      icon: "info",
      color: "black",
      background: "white",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#CBD1D8",
      confirmButtonText: "Yes",
      heightAuto: false,
      width: "40em",
      customClass: {
        container: "my-swal",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(borrowedId);
        // console.log(materialListId);
        try {
          const response = request
            .post(`Borrowed/EditReturnedQuantity`, {
              borrowedPKey: borrowedId,
              borrowedItemPKey: materialListId,
              itemCode: itemCode,
              itemDescription: itemDescription,
              uom: uom,
              consume: consumedQuantity,
              companyCode: company?.find(
                (x) => x.id === data.formData.companyId
              )?.code,
              companyName: company?.find(
                (x) => x.id === data.formData.companyId
              )?.name,
              departmentCode: department?.find(
                (x) => x.id === data.formData.departmentId
              )?.code,
              departmentName: department?.find(
                (x) => x.id === data.formData.departmentId
              )?.name,
              locationCode: location?.find(
                (x) => x.id === data.formData.locationId
              )?.code,
              locationName: location?.find(
                (x) => x.id === data.formData.locationId
              )?.name,
              accountCode: account.find((x) => x.id === data.formData.accountId)
                ?.code,
              accountTitles: account?.find(
                (x) => x.id === data.formData.accountId
              )?.name,
              empId: data.formData.empId,
              fullName: data.formData.fullName,
              addedBy: currentUser.fullName,
            })
            .then((response) => {
              sessionStorage.removeItem("Borrowed ID");
              sessionStorage.removeItem("Navigation");
              ToastComponent(
                "Success",
                "Returned materials was saved",
                "success",
                toast
              );
              setConsumedQuantity("");
              fetchBorrowed();
              setIsConsumeModalOpen(false);
              fetchMaterialsList();
              fetchReturnRequest();
              setMaterialListId("");
              setBorrowedId("");
              setMaterialList([]);
              setItemCode("");
              setItemDescription("");
              setUom("");
              setIsLoading(false);
              fetchNotificationWithParams();
            })
            .catch((err) => {
              // ToastComponent("Error", err.response.data, "warning", toast);
            });
        } catch (err) {
          ToastComponent("Error", err.response.data, "warning", toast);
        }
      }
    });
  };

  const consumeQuantityRef = useRef();

  const setQuantityValidate = (data) => {
    // if (consumedQuantity > returnQuantity) {
    //   ToastComponent(
    //     "Warning",
    //     "Consume quantity should not be greater than to return quantity",
    //     "warning",
    //     toast
    //   );
    //   setConsumedQuantity("");
    // }

    if (data !== "0") {
      setConsumedQuantity(data);
    }
  };

  console.log("Return Qty: ", returnQuantity);
  console.log("Consumed Qty: ", consumedQuantity);
  // console.log(watch("formData"));

  // useEffect(() => {
  //   if (consumedQuantity > returnQuantity) {
  //     ToastComponent(
  //       "Warning",
  //       "Consume quantity should not be greater than to return quantity",
  //       "warning",
  //       toast
  //     );
  //     setConsumedQuantity("");
  //   }
  // }, []);

  return (
    <Modal
      isOpen={isConsumeModalOpen}
      onClose={() => setIsConsumeModalOpen(false)}
      isCentered
      size="2xl"
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay />
      <form onSubmit={handleSubmit(submitConsumeHandler)}>
        <ModalContent>
          <ModalHeader textAlign="center"></ModalHeader>
          <ModalCloseButton onClick={() => setIsConsumeModalOpen(false)} />
          <ModalBody>
            <HStack>
              <Stack
                spacing={2}
                p={4}
                border="2px"
                borderRadius="5%"
                borderColor="gray.200"
                w="50%"
                h="full"
              >
                <Text fontWeight="semibold">Input Consume Quantity</Text>
                <Box>
                  <Text fontSize="xs">Consume Quantity</Text>
                  <Input
                    {...register("formData.consume")}
                    fontSize="xs"
                    // autoComplete="off"
                    onChange={(e) => setQuantityValidate(e.target.value)}
                    value={consumedQuantity}
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(e) =>
                      ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()
                    }
                    onPaste={(e) => e.preventDefault()}
                    autoComplete="off"
                    min="1"
                  />

                  {/* <Input
                    {...register("formData.consume")}
                    fontSize="xs"
                    autoComplete="off"
                    // onChange={(e) =>
                    //   consumeQuantityHandler(Number(e.target.value))
                    // }
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(e) =>
                      ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()
                    }
                    onPaste={(e) => e.preventDefault()}
                    min={1}
                    placeholder="Please enter quantity"
                    // value={consumedQuantity}
                    ref={consumeQuantityRef}
                  /> */}

                  {/* <Controller
                    control={control}
                    name="formData.consume"
                    render={({ field }) => (
                      <Input
                        {...field}
                        fontSize="xs"
                        autoComplete="off"
                        // onChange={(e) =>
                        //   consumeQuantityHandler(Number(e.target.value))
                        // }
                        type="number"
                        onWheel={(e) => e.target.blur()}
                        onKeyDown={(e) =>
                          ["E", "e", "+", "-"].includes(e.key) &&
                          e.preventDefault()
                        }
                        onPaste={(e) => e.preventDefault()}
                        min={1}
                        max={Number(returnQuantity)}
                        placeholder="Please enter quantity"
                        // value={consumedQuantity}
                        // ref={consumeQuantityRef}
                      />
                    )}
                  /> */}
                  <Text color="red" fontSize="xs">
                    {errors.formData?.consume?.message}
                  </Text>
                </Box>
              </Stack>
              <Stack
                spacing={2}
                p={4}
                border="2px"
                borderRadius="5%"
                borderColor="gray.200"
                // w="50%"
              >
                <Text fontWeight="semibold">Charge Of Accounts</Text>
                <Box>
                  <FormLabel fontSize="xs">Company</FormLabel>

                  <HStack w="full">
                    <Controller
                      control={control}
                      name="formData.companyId"
                      // defaultValue={
                      //   company?.find((x) => x.name === customerData?.companyName)
                      //     ?.id
                      // }
                      render={({ field }) => (
                        <Select
                          {...field}
                          value={field.value || ""}
                          placeholder="Select Company"
                          fontSize="xs"
                          onChange={(e) => {
                            field.onChange(e);
                            setValue("formData.departmentId", "");
                            setValue("formData.locationId", "");
                            fetchDepartmentApi(e.target.value);
                          }}
                        >
                          {company?.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.code} - {item.name}
                            </option>
                          ))}
                        </Select>
                      )}
                    />
                  </HStack>

                  <Text color="red" fontSize="xs">
                    {errors.formData?.companyId?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel fontSize="xs">Department</FormLabel>
                  <Controller
                    control={control}
                    name="formData.departmentId"
                    // defaultValue={
                    //   department?.find(
                    //     (x) => x.name === customerData?.departmentName
                    //   )?.id
                    // }
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={field.value || ""}
                        placeholder="Select Department"
                        fontSize="xs"
                        onChange={(e) => {
                          field.onChange(e);
                          setValue("formData.locationId", "");
                          fetchLocationApi(e.target.value);
                        }}
                      >
                        {department?.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.code} - {dept.name}
                          </option>
                        ))}
                      </Select>
                    )}
                  />

                  <Text color="red" fontSize="xs">
                    {errors.formData?.departmentId?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel fontSize="xs">Location</FormLabel>
                  <Controller
                    control={control}
                    name="formData.locationId"
                    // defaultValue={
                    //   location?.find((x) => x.name === customerData?.locationName)
                    //     ?.id
                    // }
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={field.value || ""}
                        placeholder="Select Location"
                        fontSize="xs"
                      >
                        {location?.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.code} - {item.name}
                          </option>
                        ))}
                      </Select>
                    )}
                  />

                  <Text color="red" fontSize="xs">
                    {errors.formData?.locationId?.message}
                  </Text>
                </Box>
                <Box>
                  <FormLabel fontSize="xs">Account Title</FormLabel>
                  <Controller
                    control={control}
                    name="formData.accountId"
                    // defaultValue={
                    //   account?.find((x) => x.name === customerData?.accountTitles)
                    //     ?.id
                    // }
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={field.value || ""}
                        placeholder="Select Account"
                        fontSize="xs"
                        bgColor="#fff8dc"
                        onChange={(e) => {
                          field.onChange(e);
                          triggerPointHandler(e);
                        }}
                      >
                        {account?.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.code} - {item.name}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.accountId?.message}
                  </Text>
                </Box>
                {!!selectedAccount.match(/Advances to Employees/gi) && (
                  <Box>
                    <Text fontSize="xs">Employee ID:</Text>
                    <Input
                      fontSize="xs"
                      {...register("formData.empId")}
                      // value={idNumber}
                      _disabled={{ color: "black" }}
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
                    <Box>
                      <Text fontSize="xs">Full Name:</Text>
                      <Input
                        fontSize="xs"
                        {...register("formData.fullName")}
                        disabled={disableFullName}
                        readOnly={disableFullName}
                        _disabled={{ color: "black" }}
                        bgColor={disableFullName && "gray.300"}
                        autoFocus
                        autoComplete="off"
                      />
                      <Text color="red" fontSize="xs">
                        {errors.formData?.fullName?.message}
                      </Text>
                    </Box>
                  </Box>
                )}
              </Stack>
            </HStack>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button
              size="sm"
              colorScheme="blue"
              type="submit"
              isLoading={isLoading}
              disabled={
                isLoading ||
                !isValid ||
                !watch("formData.companyId") ||
                !watch("formData.departmentId") ||
                !watch("formData.locationId") ||
                !watch("formData.accountId") ||
                !watch("formData.consume") ||
                // !watch("formData.empId") ||
                // !watch("formData.fullName")
                consumedQuantity > returnQuantity
              }
            >
              Submit
            </Button>
            <Button
              size="sm"
              // colorScheme="red"
              onClick={() => setIsConsumeModalOpen(false)}
              isLoading={isLoading}
              disabled={isLoading}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

// export const EditModal = ({
//   isOpen,
//   onClose,
//   editData,
//   fetchBorrowedDetails,
// }) => {
//   const [quantitySubmit, setQuantitySubmit] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const toast = useToast();

//   const quantityHandler = (data) => {
//     if (data) {
//       setQuantitySubmit(parseFloat(data));
//     } else {
//       setQuantitySubmit("");
//     }
//   };

//   const submitHandler = () => {
//     setIsLoading(true);
//     try {
//       const res = request
//         .put(`Borrowed/EditReturnedQuantity`, {
//           id: editData.id,
//           returnQuantity: quantitySubmit,
//         })
//         .then((res) => {
//           ToastComponent("Success", "Order has been edited!", "success", toast);
//           onClose();
//           fetchBorrowedDetails();
//         })
//         .catch((err) => {
//           // ToastComponent("Error", err.response.data, "error", toast);
//           setIsLoading(false);
//         });
//     } catch (error) {}
//   };

//   const titles = ["Item Code", "Item Description", "Return Quantity"];
//   const autofilled = [editData?.itemCode, editData?.itemDescription];

//   return (
//     <>
//       <Modal isOpen={isOpen} onClose={() => {}} isCentered size="md">
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader bg="primary" color="white">
//             <Flex justifyContent="left">
//               <Text fontSize="15px">Return Quantity</Text>
//             </Flex>
//           </ModalHeader>

//           <ModalBody>
//             {/* <PageScrollReusable minHeight='50px' maxHeight='350px'> */}
//             {/* <Text textAlign="center" mb={7} fontSize="sm">
//               Are you sure you want to edit this order?
//             </Text> */}
//             <HStack justifyContent="center" textAlign="start">
//               <VStack spacing={4}>
//                 {titles.map((title) => (
//                   <Text w="full" pl={2} key={title} fontSize="xs">
//                     {title}
//                   </Text>
//                 ))}
//               </VStack>
//               <VStack spacing={3.5}>
//                 {autofilled.map((items) => (
//                   <Text
//                     w="70%"
//                     pl={2}
//                     bgColor="gray.200"
//                     border="1px"
//                     key={items}
//                     color="fontColor"
//                     fontSize="xs"
//                   >
//                     {items}
//                   </Text>
//                 ))}
//                 <Input
//                   borderRadius="sm"
//                   color="fontColor"
//                   fontSize="sm"
//                   onChange={(e) => quantityHandler(e.target.value)}
//                   value={quantitySubmit}
//                   type="number"
//                   onWheel={(e) => e.target.blur()}
//                   onKeyDown={(e) =>
//                     ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()
//                   }
//                   onPaste={(e) => e.preventDefault()}
//                   min="1"
//                   w="72%"
//                   pl={2}
//                   h={7}
//                   bgColor="#fff8dc"
//                   border="1px"
//                 />
//               </VStack>
//             </HStack>
//             {/* </PageScrollReusable> */}
//           </ModalBody>

//           <ModalFooter justifyItems="center">
//             <ButtonGroup size="xs" mt={5}>
//               <Button
//                 px={4}
//                 onClick={submitHandler}
//                 isLoading={isLoading}
//                 disabled={
//                   !quantitySubmit ||
//                   isLoading ||
//                   quantitySubmit > editData?.quantity
//                 }
//                 // disabled={!quantitySubmit || isLoading || quantitySubmit > editData?.consumes}
//                 colorScheme="blue"
//               >
//                 Save
//               </Button>
//               <Button
//                 onClick={onClose}
//                 isLoading={isLoading}
//                 disabled={isLoading}
//                 colorScheme="gray"
//               >
//                 Cancel
//               </Button>
//             </ButtonGroup>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };

// //ACCOUNT TITLE
export const AccountTitleModal = ({
  isOpen,
  onClose,
  borrowedDetailsData,
  coaId,
  setCoaId,
  fetchBorrowed,
  onCloseView,
  fetchNotificationWithParams,
  // fetchNotification,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [company, setCompany] = useState([]);
  const [department, setDepartment] = useState([]);
  const [location, setLocation] = useState([]);
  const [account, setAccount] = useState([]);

  // console.log("data", borrowedDetailsData);
  // console.log(
  //   "borrowedDetailsData",
  //   borrowedDetailsData?.find((item) => item.borrowedPKey === coaId).companyCode
  // );

  // FETCH COMPANY API
  const fetchCompanyApi = async () => {
    try {
      const res = await axios.get(
        "http://10.10.2.76:8000/api/dropdown/company?api_for=vladimir&status=1&paginate=0",
        {
          headers: {
            Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
          },
        }
      );
      setCompany(res.data.result.companies);
      // console.log(res.data.result.companies);
    } catch (error) {}
  };

  // FETCH DEPT API
  const fetchDepartmentApi = async (id = "") => {
    try {
      const res = await axios.get(
        "http://10.10.2.76:8000/api/dropdown/department?status=1&paginate=0&api_for=vladimir&company_id=" +
          id,
        {
          headers: {
            Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
          },
        }
      );
      setDepartment(res.data.result.departments);
      // console.log(res.data.result.companies);
    } catch (error) {}
  };

  // FETCH Loc API
  const fetchLocationApi = async (id = "") => {
    try {
      const res = await axios.get(
        "http://10.10.2.76:8000/api/dropdown/location?status=1&paginate=0&api_for=vladimir&department_id=" +
          id,
        {
          headers: {
            Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
          },
        }
      );
      setLocation(res.data.result.locations);
      // console.log(res.data.result.companies);
    } catch (error) {}
  };

  // FETCH ACcount API
  const fetchAccountApi = async () => {
    try {
      const res = await axios.get(
        "http://10.10.2.76:8000/api/dropdown/account-title?status=1&paginate=0",
        {
          headers: {
            Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
          },
        }
      );
      setAccount(res.data.result.account_titles);
      // console.log(res.data.result.companies);
    } catch (error) {}
  };

  useEffect(() => {
    fetchCompanyApi();
    fetchDepartmentApi();
    fetchLocationApi();
    fetchAccountApi();
  }, []);

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
        borrowedPKey: coaId,
        companyId: "",
        departmentId: "",
        locationId: "",
        accountTitleId: "",
        addedBy: currentUser.userName,
      },
    },
  });

  useEffect(() => {
    setValue(
      "formData.companyId",
      company?.find(
        (x) =>
          x.code ===
          borrowedDetailsData?.find((item) => item.borrowedPKey === coaId)
            .companyCode
      )?.id
    );
  }, [company]);

  useEffect(() => {
    setValue(
      "formData.departmentId",
      department?.find(
        (x) =>
          x.code ===
          borrowedDetailsData?.find((item) => item.borrowedPKey === coaId)
            .departmentCode
      )?.id
    );
  }, [department]);

  useEffect(() => {
    setValue(
      "formData.locationId",
      location?.find(
        (x) =>
          x.code ===
          borrowedDetailsData?.find((item) => item.borrowedPKey === coaId)
            .locationCode
      )?.id
    );
  }, [location]);

  useEffect(() => {
    setValue(
      "formData.accountTitleId",
      account?.find(
        (x) =>
          x.code ===
          borrowedDetailsData?.find((item) => item.borrowedPKey === coaId)
            .accountCode
      )?.id
    );
  }, [account]);

  const submitHandler = async (data) => {
    const submitArrayBody = borrowedDetailsData?.map((item) => {
      return {
        id: coaId,
        companyCode: company?.find((x) => x.id === data.formData.companyId)
          ?.code,
        companyName: company?.find((x) => x.id === data.formData.companyId)
          ?.name,
        departmentCode: department?.find(
          (x) => x.id === data.formData.departmentId
        )?.code,
        departmentName: department?.find(
          (x) => x.id === data.formData.departmentId
        )?.name,
        locationCode: location?.find((x) => x.id === data.formData.locationId)
          ?.code,
        locationName: location?.find((x) => x.id === data.formData.locationId)
          ?.name,
        accountTitles: account?.find(
          (x) => x.id === data.formData.accountTitleId
        )?.name,
        accountCode: account.find((x) => x.id === data.formData.accountTitleId)
          ?.code,
        // addedBy: currentUser.fullName,
      };
    });
    console.log(submitArrayBody);
    try {
      const response = await request
        .put(`Borrowed/SaveReturnedQuantity`, submitArrayBody)
        .then((response) => {
          fetchBorrowed();
          ToastComponent(
            "Success",
            "Returned materials was saved",
            "success",
            toast
          );
          onClose();
          onCloseView();
          fetchNotificationWithParams();
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} size="xl" isCentered>
        <ModalOverlay />
        <form>
          <ModalContent>
            <ModalHeader>
              <Flex justifyContent="center">
                <Text>Charge of Accounts</Text>
              </Flex>
            </ModalHeader>
            <ModalCloseButton onClick={onClose} />

            <ModalBody>
              <Stack spacing={2} p={6}>
                <Box>
                  <FormLabel fontSize="sm">Company</FormLabel>

                  <HStack w="full">
                    <Select
                      {...register("formData.companyId")}
                      defaultValue={
                        company?.find(
                          (x) =>
                            x.code ===
                            borrowedDetailsData?.find(
                              (item) => item.borrowedPKey === coaId
                            )?.companyCode
                        )?.id
                      }
                      placeholder="Select Company"
                      fontSize="sm"
                      onChange={(e) => {
                        setValue("formData.departmentId", "");
                        setValue("formData.locationId", "");
                        fetchDepartmentApi(e.target.value);
                      }}
                    >
                      {company?.map((item) => {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.code} - {item.name}
                          </option>
                        );
                      })}
                    </Select>
                  </HStack>

                  <Text color="red" fontSize="xs">
                    {errors.formData?.companyId?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel fontSize="sm">Department</FormLabel>
                  <Select
                    {...register("formData.departmentId")}
                    placeholder="Select Department"
                    fontSize="sm"
                    onChange={(e) => {
                      setValue("formData.locationId", "");
                      fetchLocationApi(e.target.value);
                    }}
                  >
                    {department?.map((dept) => {
                      return (
                        <option key={dept.id} value={dept.id}>
                          {dept.code} - {dept.name}
                        </option>
                      );
                    })}
                  </Select>

                  <Text color="red" fontSize="xs">
                    {errors.formData?.departmentId?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel fontSize="sm">Location</FormLabel>
                  <Select
                    {...register("formData.locationId")}
                    placeholder="Select Location"
                    fontSize="sm"
                  >
                    {location?.map((item) => {
                      return (
                        <option key={item.id} value={item.id}>
                          {item.code} - {item.name}
                        </option>
                      );
                    })}
                  </Select>

                  <Text color="red" fontSize="xs">
                    {errors.formData?.locationId?.message}
                  </Text>
                </Box>
                <Box>
                  <FormLabel fontSize="sm">Account Title</FormLabel>
                  <Select
                    {...register("formData.accountTitleId")}
                    placeholder="Select Account"
                    fontSize="sm"
                    bgColor="#fff8dc"
                  >
                    {account?.map((item) => {
                      return (
                        <option key={item.id} value={item.id}>
                          {item.code} - {item.name}
                        </option>
                      );
                    })}
                  </Select>
                  <Text color="red" fontSize="xs">
                    {errors.formData?.accountTitleId?.message}
                  </Text>
                </Box>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button
                type="submit"
                // disabled={!isValid}
                colorScheme="blue"
                px={4}
              >
                Submit
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};
