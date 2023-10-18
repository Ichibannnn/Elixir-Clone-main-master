import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  toast,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { RiQuestionnaireLine } from "react-icons/ri";
import request from "../../services/ApiClient";
import { ToastComponent } from "../../components/Toast";
import { decodeUser } from "../../services/decode-user";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";

const currentUser = decodeUser();

//Cancel Approved Date
export const CancelApprovedDate = ({
  isOpen,
  onClose,
  id,
  setOrderId,
  fetchApprovedMoveOrders,
  fetchNotification,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = () => {
    setIsLoading(true);
    console.log(id);
    try {
      const res = request
        .put(`Ordering/CancelOrdersInMoveOrder`, [{ trasactId: id }])
        .then((res) => {
          ToastComponent(
            "Success",
            "Successfully cancelled approved date",
            "success",
            toast
          );
          setOrderId("");
          fetchApprovedMoveOrders();
          fetchNotification();
          setIsLoading(false);
          onClose();
        })
        .catch((err) => {
          ToastComponent("Error", "Cancel failed", "error", toast);
          setIsLoading(false);
        });
    } catch (error) {}
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} size="xl" isCentered>
        <ModalContent>
          <ModalHeader>
            <Flex justifyContent="center">
              <RiQuestionnaireLine fontSize="35px" />
            </Flex>
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />

          <ModalBody>
            <VStack justifyContent="center">
              <Text>
                Are you sure you want to cancel this approved date for
                re-scheduling?
              </Text>
            </VStack>
          </ModalBody>

          <ModalFooter mt={10}>
            <ButtonGroup size="sm" mt={3}>
              <Button
                onClick={submitHandler}
                isLoading={isLoading}
                disabled={isLoading}
                colorScheme="blue"
                px={4}
              >
                Yes
              </Button>
              <Button
                onClick={onClose}
                isLoading={isLoading}
                disabled={isLoading}
                colorScheme="red"
                px={4}
              >
                No
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

//Save Button

export const SaveButton = ({
  orderId,
  deliveryStatus,
  batchNumber,
  orderListData,
  fetchApprovedMoveOrders,
  fetchOrderList,
  setOrderId,
  setHighlighterId,
  setItemCode,
  setDeliveryStatus,
  setButtonChanger,
  setCurrentPage,
  currentPage,
  fetchNotification,
  moveData,
}) => {
  const {
    isOpen: isPlateNumber,
    onClose: closePlateNumber,
    onOpen: openPlateNumber,
  } = useDisclosure();

  return (
    <Flex w="full" justifyContent="end">
      <Button
        onClick={() => openPlateNumber()}
        // disabled={!deliveryStatus || !batchNumber}
        title={
          deliveryStatus
            ? `Save with delivery status "${deliveryStatus}" and batch number "${batchNumber}"`
            : "Please select a delivery status and batch number."
        }
        size="xs"
        colorScheme="blue"
        px={6}
      >
        Save
      </Button>
      {
        <AccountTitleModal
          orderId={orderId}
          isOpen={isPlateNumber}
          onClose={closePlateNumber}
          // deliveryStatus={deliveryStatus}
          // batchNumber={batchNumber}
          orderListData={orderListData}
          fetchApprovedMoveOrders={fetchApprovedMoveOrders}
          fetchOrderList={fetchOrderList}
          setOrderId={setOrderId}
          setHighlighterId={setHighlighterId}
          setItemCode={setItemCode}
          setDeliveryStatus={setDeliveryStatus}
          setButtonChanger={setButtonChanger}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          fetchNotification={fetchNotification}
          moveData={moveData}
        />
      }
    </Flex>
  );
};

// const schema = yup.object().shape({
//   formData: yup.object().shape({
//     orderId: yup.string(),
//     companyCode: yup.string().required("Company Code is required"),
//     companyName: yup.string().required("Company Name is required"),
//     departmentName: yup.string().required("Department Name is required"),
//     locationName: yup.string().required("Location Name is required"),
//     accountTitles: yup.string().required("Account Title is required"),
//   }),
// });

const schema = yup.object().shape({
  formData: yup.object().shape({
    orderId: yup.string(),
    companyId: yup.number().required().typeError("Company Name is required"),
    departmentId: yup
      .number()
      .required()
      .typeError("Department Category is required"),
    locationId: yup.number().required().typeError("Location Name is required"),
    accountTitleId: yup.number().required("Account Name is required"),
    empId: yup.string(),
    fullName: yup.string(),
  }),
});

//ACCOUNT TITLE
export const AccountTitleModal = ({
  orderId,
  isOpen,
  onClose,
  fetchMoveOrder,
  orderListData,
  fetchApprovedMoveOrders,
  fetchOrderList,
  fetchPreparedItems,
  setOrderId,
  setHighlighterId,
  setItemCode,
  setButtonChanger,
  setCurrentPage,
  currentPage,
  moveData,
  fetchNotification,
  // fetchNotification,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [company, setCompany] = useState([]);
  const [department, setDepartment] = useState([]);
  const [location, setLocation] = useState([]);
  const [account, setAccount] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [disableFullName, setDisableFullName] = useState(true);

  // console.log(
  //   "movedata",
  //   moveData?.orders?.find((item) => item.id === orderId)
  // );

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
    control,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        orderNo: orderId,
        companyId: company?.find((x) => x.name === moveData[0]?.companyName)
          ?.id,
        departmentId: department?.find(
          (x) => x.code === moveData[0]?.departmentCode
        )?.id,
        locationId: location?.find((x) => x.name === moveData[0]?.locationName)
          ?.id,
        accountTitleId: "",
        empId: "",
        fullName: "",
        addedBy: currentUser.userName,
      },
    },
  });

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

  const submitHandler = async (data) => {
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to save this move order list?",
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
      const submitArrayBody = moveData?.orders?.map((item) => {
        return {
          orderNo: orderId,
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
          accountCode: account?.find(
            (x) => x.id === data.formData.accountTitleId
          )?.code,
          empId: data.formData.empId,
          fullName: data.formData.fullName,
          addedBy: currentUser.fullName,
        };
      });
      console.log(submitArrayBody);
      if (result.isConfirmed) {
        try {
          const response = request
            .put(`Ordering/AddSavePreparedMoveOrder`, submitArrayBody)
            .then((response) => {
              ToastComponent(
                "Success",
                "Items prepared successfully.",
                "success",
                toast
              );

              // fetchMoveOrder();
              setOrderId("");
              setHighlighterId("");
              setItemCode("");
              setButtonChanger(false);
              setCurrentPage(currentPage);
              fetchApprovedMoveOrders();
              fetchNotification();
              fetchOrderList();
              setIsLoading(false);
              setCurrentPage(1);
              onClose();
            })
            .catch((err) => {
              console.log(err);
            });
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} size="xl" isCentered>
        <ModalOverlay />
        <form onSubmit={handleSubmit(submitHandler)}>
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
                            moveData?.orders?.find(
                              (item) => item.id === orderId
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
                    defaultValue={
                      department?.find(
                        (x) =>
                          x.code ===
                          moveData?.orders?.find((item) => item.id === orderId)
                            ?.departmentCode
                      )?.id
                    }
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
                    defaultValue={
                      location?.find(
                        (x) =>
                          x.code ===
                          moveData?.orders?.find((item) => item.id === orderId)
                            ?.locationCode
                      )?.id
                    }
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
                  <Controller
                    control={control}
                    name="formData.accountTitleId"
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
                    {errors.formData?.accountTitleId?.message}
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

export const AddQuantityConfirmation = ({
  isOpen,
  onClose,
  id,
  orderNo,
  itemCode,
  quantityOrdered,
  fetchOrderList,
  fetchPreparedItems,
  setQuantity,
  setHighlighterId,
  warehouseId,
  setWarehouseId,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = () => {
    setIsLoading(true);
    try {
      const res = request
        .post(`Ordering/PrepareItemForMoveOrder`, {
          warehouseId: warehouseId,
          orderNoPkey: id,
          orderNo: orderNo,
          itemCode: itemCode,
          quantityOrdered: Number(quantityOrdered),
          preparedBy: currentUser.userName,
        })
        .then((res) => {
          ToastComponent(
            "Success",
            "Quantity has been prepared.",
            "success",
            toast
          );
          setQuantity("");
          setHighlighterId("");
          setWarehouseId("");
          setIsLoading(false);
          onClose();
          fetchOrderList();
          fetchPreparedItems();
        })
        .catch((err) => {
          ToastComponent("Error", "Add Failed", "error", toast);
          setIsLoading(false);
        });
    } catch (error) {}
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {/* <Flex justifyContent="center">
              <RiQuestionnaireLine fontSize="35px" />
            </Flex> */}
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />

          <ModalBody>
            <VStack justifyContent="center">
              <Text fontSize="sm">
                Are you sure you want to add this quantity?
              </Text>
              <Text fontSize="sm">{`[ MIR ID: ${orderNo} ] [ Item Code: ${itemCode} ] [ Quantity Ordered: ${quantityOrdered} ]`}</Text>
            </VStack>
          </ModalBody>

          <ModalFooter justifyContent="center">
            <ButtonGroup size="sm" mt={3}>
              <Button
                onClick={submitHandler}
                isLoading={isLoading}
                disabled={isLoading}
                colorScheme="blue"
                px={4}
                size="xs"
              >
                Yes
              </Button>
              <Button
                onClick={onClose}
                isLoading={isLoading}
                disabled={isLoading}
                color="black"
                variant="outline"
                px={4}
                size="xs"
              >
                No
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

//Cancel Prepared

export const CancelConfirmation = ({
  isOpen,
  onClose,
  id,
  fetchPreparedItems,
  fetchOrderList,
  setCancelId,
  fetchNotification,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = () => {
    setIsLoading(true);
    try {
      const res = request
        .put(`Ordering/CancelPreparedItems`, { id: id })
        .then((res) => {
          ToastComponent(
            "Success",
            "Successfully cancelled prepared item",
            "success",
            toast
          );
          setCancelId("");
          fetchPreparedItems();
          fetchNotification();
          fetchOrderList();
          setIsLoading(false);
          onClose();
        })
        .catch((err) => {
          ToastComponent("Error", "Cancel failed", "error", toast);
          setIsLoading(false);
        });
    } catch (error) {}
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex justifyContent="center">
              <RiQuestionnaireLine fontSize="35px" />
            </Flex>
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />

          <ModalBody>
            <VStack justifyContent="center">
              <Text>Are you sure you want to cancel this prepared item?</Text>
            </VStack>
          </ModalBody>

          <ModalFooter justifyContent="center">
            <ButtonGroup size="sm" mt={3}>
              <Button
                onClick={submitHandler}
                isLoading={isLoading}
                disabled={isLoading}
                colorScheme="blue"
                px={4}
              >
                Yes
              </Button>
              <Button
                onClick={onClose}
                isLoading={isLoading}
                disabled={isLoading}
                color="black"
                variant="outline"
                px={4}
              >
                No
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
