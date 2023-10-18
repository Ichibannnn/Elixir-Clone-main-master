import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormLabel,
  HStack,
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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BsPatchQuestionFill } from "react-icons/bs";
import request from "../../../services/ApiClient";
import { decodeUser } from "../../../services/decode-user";
import { ToastComponent } from "../../../components/Toast";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";

const currentUser = decodeUser();

export const AddConfirmation = ({
  isOpen,
  onClose,
  closeAddModal,
  details,
  setDetails,
  rawMatsInfo,
  setRawMatsInfo,
  listDataTempo,
  setListDataTempo,
  supplierRef,
  setSelectorId,
  remarks,
  transactionDate,
  supplierData,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const addItemHandler = () => {
    setIsLoading(true);
    const addToArray = {
      itemCode: rawMatsInfo.itemCode,
      itemDescription: rawMatsInfo.itemDescription,
      supplierName: rawMatsInfo.supplierName,
      supplierCode: supplierData.supplierCode,
      uom: rawMatsInfo.uom,
      quantity: rawMatsInfo.quantity,
      unitPrice: rawMatsInfo.unitPrice,
      description: details,
      remarks: remarks,
      transactionDate: transactionDate,
    };
    setListDataTempo((current) => [...current, addToArray]);
    setRawMatsInfo({
      itemCode: "",
      itemDescription: "",
      supplierName: rawMatsInfo.supplierName,
      uom: "",
      quantity: "",
      unitPrice: "",
    });
    setSelectorId("");
    setIsLoading(false);
    onClose();
    closeAddModal();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
      <ModalOverlay />
      <ModalContent pt={10} pb={5}>
        <ModalHeader>
          <Flex justifyContent="center">
            <BsPatchQuestionFill fontSize="50px" />
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody mb={5}>
          <Text textAlign="center" fontSize="lg">
            Are you sure you want to add this information?
          </Text>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <ButtonGroup>
            <Button
              onClick={addItemHandler}
              isLoading={isLoading}
              colorScheme="blue"
            >
              Yes
            </Button>
            <Button
              onClick={onClose}
              isLoading={isLoading}
              color="black"
              variant="outline"
            >
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const schema = yup.object().shape({
  formData: yup.object().shape({
    orderId: yup.string(),
    companyId: yup.number().required().typeError("Company Name is required"),
    departmentId: yup
      .number()
      .required()
      .typeError("Department Category is required"),
    locationId: yup.number().required().typeError("Location Name is required"),
    accountId: yup.number().required().typeError("Account Name is required"),
  }),
});

export const SaveConfirmation = ({
  isOpen,
  onClose,
  listDataTempo,
  setListDataTempo,
  supplierData,
  setSupplierData,
  totalQuantity,
  supplierRef,
  setDetails,
  setRawMatsInfo,
  remarks,
  setRemarks,
  remarksRef,
  transactionDate,
  setTransactionDate,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const [company, setCompany] = useState([]);
  const [department, setDepartment] = useState([]);
  const [location, setLocation] = useState([]);
  const [account, setAccount] = useState([]);

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
      console.log(res.data.result.departments);
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

  useEffect(() => {
    fetchCompanyApi();
  }, []);

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
    fetchAccountApi();
  }, []);

  // useEffect(() => {
  //   fetchCompanyApi();
  //   fetchDepartmentApi();
  //   fetchLocationApi();
  //   fetchAccountApi();

  //   return () => {
  //     setCompany([]);
  //     setDepartment([]);
  //     setLocation([]);
  //     setAccount([]);
  //     // setIsCoaSet(false);
  //   };
  // }, []);

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
        // companyId : company?.find((x) => x.name === customerData?.companyName)
        // ?.id
        // departmentId: department?.find(
        //   (x) => x.name === customerData?.departmentName
        // )?.id,
        // locationId: location?.find((x) => x.name === customerData?.locationName)
        //   ?.id,
        accountId: "",
        addedBy: currentUser.fullName,
      },
    },
  });

  const saveSubmitHandler = (data) => {
    const firstSubmit = {
      supplierCode: supplierData.supplierCode,
      supplier: supplierData.supplierName,
      totalQuantity: totalQuantity,
      details: listDataTempo[0]?.description,
      remarks: remarks,
      preparedBy: currentUser?.fullName,
      transactionDate: transactionDate,
      companyCode: company?.find((x) => x.id === data.formData.companyId)?.code,
      companyName: company?.find((x) => x.id === data.formData.companyId)?.name,
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
      accountCode: account?.find((x) => x.id === data.formData.accountId)?.code,
      accountTitles: account?.find((x) => x.id === data.formData.accountId)
        ?.name,
      addedBy: currentUser.fullName,
    };

    console.log(firstSubmit);

    if (totalQuantity > 0) {
      setIsLoading(true);
      try {
        const res = request
          .post(`Miscellaneous/AddNewMiscellaneousReceipt`, firstSubmit)
          .then((res) => {
            const id = res.data.id;

            console.log(res);

            //SECOND POST IF MAY ID
            if (id) {
              const submitArray = listDataTempo.map((item) => {
                return {
                  miscellaneousReceiptId: id,
                  itemCode: item.itemCode,
                  itemDescription: item.itemDescription,
                  uom: item.uom,
                  supplier: item.supplierName,
                  // expiration: item.expirationDate,
                  actualGood: item.quantity,
                  unitPrice: item.unitPrice,
                  details: item.description,
                  remarks: item.remarks,
                  transactionDate: item.transactionDate,
                  unitPrice: item.unitPrice,
                  receivedBy: currentUser.userName,
                };
              });
              try {
                const res = request.post(
                  `Miscellaneous/AddNewMiscellaneousReceiptInWarehouse`,
                  submitArray
                );
                ToastComponent(
                  "Success",
                  "Information saved",
                  "success",
                  toast
                );
                setListDataTempo([]);
                supplierRef.current.value = "";
                remarksRef.current.value = "";
                console.log("done");
                setTransactionDate("");
                setDetails("");
                setRemarks("");
                setSupplierData({
                  supplierName: "",
                });
                setRawMatsInfo({
                  itemCode: "",
                  itemDescription: "",
                  supplier: "",
                  uom: "",
                  // expirationDate: '',
                  quantity: "",
                  unitPrice: "",
                });
                setIsLoading(false);
                onClose();
              } catch (error) {
                console.log(error);
              }
              console.log(submitArray);
            }
          })
          .catch((err) => {
            ToastComponent(
              "Error",
              "Information was not saved",
              "error",
              toast
            );
            setIsLoading(false);
          });
      } catch (error) {}
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="2xl">
      <ModalOverlay />
      <form onSubmit={handleSubmit(saveSubmitHandler)}>
        <ModalContent>
          <ModalHeader textAlign="center">Charge Of Accounts</ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <ModalBody>
            <Stack spacing={2} p={6}>
              <Box>
                <FormLabel fontSize="sm">Company</FormLabel>

                <HStack w="full">
                  <Controller
                    control={control}
                    name="formData.companyId"
                    defaultValue={
                      company?.find((x) => x.name === supplierData?.companyName)
                        ?.id
                    }
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={field.value || ""}
                        placeholder="Select Company"
                        fontSize="sm"
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
                <FormLabel fontSize="sm">Department</FormLabel>
                <Controller
                  control={control}
                  name="formData.departmentId"
                  defaultValue={
                    department?.find(
                      (x) => x.name === supplierData?.departmentName
                    )?.id
                  }
                  render={({ field }) => (
                    <Select
                      {...field}
                      value={field.value || ""}
                      placeholder="Select Department"
                      fontSize="sm"
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
                <FormLabel fontSize="sm">Location</FormLabel>
                <Controller
                  control={control}
                  name="formData.locationId"
                  defaultValue={
                    location?.find((x) => x.name === supplierData?.locationName)
                      ?.id
                  }
                  render={({ field }) => (
                    <Select
                      {...field}
                      value={field.value || ""}
                      placeholder="Select Location"
                      fontSize="sm"
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
                <FormLabel fontSize="sm">Account Title</FormLabel>
                <Controller
                  control={control}
                  name="formData.accountId"
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      {...field}
                      value={field.value || ""}
                      placeholder="Select Account"
                      fontSize="sm"
                      bgColor="#fff8dc"
                      isSearchable
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
            </Stack>
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
                // !watch("formData.accountTitles") ||
                !watch("formData.companyId") ||
                !watch("formData.departmentId") ||
                !watch("formData.locationId") ||
                !watch("formData.accountId")
              }
            >
              Submit
            </Button>
            <Button
              size="sm"
              // colorScheme="red"
              onClick={onClose}
              isLoading={isLoading}
              disabled={isLoading}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
    // <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
    //   <ModalContent color="black" pt={10} pb={5}>
    //     <ModalHeader>
    //       <Flex justifyContent="center">
    //         <BsPatchQuestionFill fontSize="50px" />
    //       </Flex>
    //     </ModalHeader>
    //     <ModalCloseButton color="black" onClick={onClose} />

    //     <ModalBody mb={5}>
    //       <Text textAlign="center" fontSize="lg">
    //         Are you sure you want to save this information?
    //       </Text>
    //     </ModalBody>

    //     <ModalFooter justifyContent="center">
    //       <ButtonGroup>
    //         <Button
    //           onClick={saveSubmitHandler}
    //           isLoading={isLoading}
    //           disabled={isLoading}
    //           colorScheme="blue"
    //         >
    //           Yes
    //         </Button>
    //         <Button
    //           onClick={onClose}
    //           isLoading={isLoading}
    //           color="black"
    //           variant="outline"
    //         >
    //           No
    //         </Button>
    //       </ButtonGroup>
    //     </ModalFooter>
    //   </ModalContent>
    // </Modal>
  );
};

export const CancelConfirmation = ({
  isOpen,
  onClose,
  selectorId,
  rowIndex,
  setListDataTempo,
  listDataTempo,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const cancelSubmitHandler = () => {
    setIsLoading(true);
    if (listDataTempo.length > 0) {
      const newArray = [...listDataTempo];
      if (rowIndex !== -1) {
        newArray.splice(rowIndex, 1);
        setListDataTempo(newArray);
        onClose();
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
      <ModalOverlay />
      <ModalContent bgColor="white" color="black" pt={10} pb={5}>
        <ModalHeader>
          <Flex justifyContent="center">
            <BsPatchQuestionFill fontSize="50px" />
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody mb={5}>
          <Text textAlign="center" fontSize="lg">
            Are you sure you want to cancel this information?
          </Text>
        </ModalBody>

        <ModalFooter>
          <ButtonGroup>
            <Button
              onClick={cancelSubmitHandler}
              isLoading={isLoading}
              disabled={isLoading}
              colorScheme="blue"
            >
              Yes
            </Button>
            <Button onClick={onClose} isLoading={isLoading}>
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Frontend Edit Process

export const EditModal = ({
  isOpen,
  onClose,
  selectorId,
  rowIndex,
  setListDataTempo,
  listDataTempo,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    isOpen: isEditConfirm,
    onClose: closeEditConfirm,
    onOpen: openEditConfirm,
  } = useDisclosure();

  const editHandler = () => {
    openEditConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="4xl">
      <ModalContent>
        <ModalHeader></ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody></ModalBody>

        <ModalFooter>
          <ButtonGroup>
            <Button
              onClick={editHandler}
              isLoading={isLoading}
              disabled={isLoading}
              colorScheme="blue"
            >
              Update
            </Button>
            <Button
              onClick={onClose}
              isLoading={isLoading}
              colorScheme="blackAlpha"
            >
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
      {isEditConfirm && (
        <EditConfirmation
          isOpen={isEditConfirm}
          onClose={closeEditConfirm}
          closeEditModal={onClose}
          selectorId={selectorId}
          rowIndex={rowIndex}
          setListDataTempo={setListDataTempo}
          listDataTempo={listDataTempo}
        />
      )}
    </Modal>
  );
};

export const EditConfirmation = ({
  isOpen,
  onClose,
  selectorId,
  rowIndex,
  setListDataTempo,
  listDataTempo,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
      <ModalContent bgColor="secondary" color="white" pt={10} pb={5}>
        <ModalHeader>
          <Flex justifyContent="center">
            <BsPatchQuestionFill fontSize="50px" />
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody mb={5}>
          <Text textAlign="center" fontSize="lg">
            Are you sure you want to update this information?
          </Text>
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
