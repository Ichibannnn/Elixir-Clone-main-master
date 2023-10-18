import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import request from "../../../services/ApiClient";
import PageScroll from "../../../utils/PageScroll";
import moment from "moment";
import { EditModal } from "./ActionModalBorrowed";
import { ToastComponent } from "../../../components/Toast";
import Swal from "sweetalert2";

export const ViewModal = ({
  isOpen,
  onClose,
  statusBody,
  fetchBorrowed,
  setIsLoading,
}) => {
  // console.log(statusBody)
  const {
    isOpen: isEdit,
    onOpen: openEdit,
    onClose: closeEdit,
  } = useDisclosure();

  const [borrowedDetailsData, setBorrowedDetailsData] = useState([]);
  const [editData, setEditData] = useState({
    id: "",
    itemCode: "",
    itemDescription: "",
    returnQuantity: "",
    consumes: "",
    quantity: "",
  });

  const toast = useToast();

  // console.log(statusBody.id);

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
      //   id &&
      //   itemCode &&
      //   itemDescription &&
      //   returnQuantity > 0 &&
      //   consumes > 0 &&
      //   quantity
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
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          if (statusBody.id) {
            const res = request
              .put(`Borrowed/SaveReturnedQuantity`, [{ id: statusBody.id }])
              .then((res) => {
                fetchBorrowed();
                ToastComponent(
                  "Success",
                  "Returned materials was saved",
                  "success",
                  toast
                );
                onClose();
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

  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="5xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="primary">
          <Flex justifyContent="left">
            <Text fontSize="xs" color="white">
              Pending Borrowed Details
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton color="white" onClick={onClose} />
        <ModalBody mb={5}>
          <Flex justifyContent="space-between">
            <VStack alignItems="start" spacing={1}>
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

            <VStack alignItems="start" spacing={-1}></VStack>
            <VStack alignItems="start" spacing={-1}>
              {/* <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Company:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.companyCode} -{" "}
                  {borrowedDetailsData[0]?.companyName}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Department:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.departmentCode} - {""}
                  {borrowedDetailsData[0]?.departmentName}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Location:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.locationCode} - {""}
                  {borrowedDetailsData[0]?.locationName}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Account Title:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.accountCode} - {""}
                  {borrowedDetailsData[0]?.accountTitles}
                </Text>
              </HStack> */}
            </VStack>
          </Flex>
          <VStack justifyContent="center">
            <PageScroll minHeight="320px" maxHeight="321px">
              <Table size="sm" variant="striped">
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
                      Borrow Qty
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {borrowedDetailsData?.map((borrowdetails, i) => (
                    <Tr key={i}>
                      <Td fontSize="xs">{borrowdetails.id}</Td>
                      <Td fontSize="xs">{borrowdetails.itemCode}</Td>
                      <Td fontSize="xs">{borrowdetails.itemDescription}</Td>
                      <Td fontSize="xs">
                        {borrowdetails.quantity.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
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
            <Button colorScheme="gray" onClick={onClose}>
              Close
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
