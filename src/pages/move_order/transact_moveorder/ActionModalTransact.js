import React, { useState } from "react";
import {
  Flex,
  HStack,
  Button,
  ButtonGroup,
  Text,
  useToast,
  VStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  ModalOverlay,
  FormLabel,
  Stack,
} from "@chakra-ui/react";
import PageScroll from "../../../utils/PageScroll";
import { BsQuestionDiamondFill } from "react-icons/bs";
import request from "../../../services/ApiClient";
import { decodeUser } from "../../../services/decode-user";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import Barcode from "react-barcode";
import DatePicker from "react-datepicker";
import { ToastComponent } from "../../../components/Toast";

const currentUser = decodeUser();

export const ViewModal = ({
  isOpen,
  onClose,
  moveOrderInformation,
  moveOrderViewTable,
}) => {
  const TableHead = [
    "Line",
    "Order Date",
    // "Farm Code", "Farm",
    "Item Code",
    "Item Description",
    "Category",
    "UOM",
    "Quantity",
    "Unit Cost",
    "Total Cost",
    // "Expiration Date",
  ];

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} isCentered size="6xl" mt={4}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="primary">
            <Flex justifyContent="left">
              <Text fontSize="xs" color="white">
                View Transact Move Order
              </Text>
            </Flex>
            {/* <Text textAlign="center" fontSize="15px">
              View Transact Move Order
            </Text> */}
          </ModalHeader>
          <ModalCloseButton color="white" onClick={onClose} />
          <ModalBody mt={5}>
            <Flex w="full" flexDirection="column" className="boxShadow">
              <VStack w="full" spacing={0} mb={6}>
                <Text
                  w="full"
                  textAlign="center"
                  bgColor="primary"
                  color="white"
                  fontSize="xs"
                >
                  Transact Move Order
                </Text>
                <Text
                  w="full"
                  textAlign="center"
                  bgColor="secondary"
                  color="white"
                  fontSize="xs"
                >
                  Move Order Information
                </Text>
                <VStack w="99%" mb={6}>
                  <Stack w="full" mt={2}>
                    <Flex justifyContent="space-between">
                      <FormLabel fontSize="xs" w="40%">
                        MIR ID:
                        <Text
                          textAlign="center"
                          w="full"
                          fontSize="xs"
                          bgColor="gray.200"
                          border="1px"
                          py={1}
                        >
                          {moveOrderInformation.orderNo
                            ? moveOrderInformation.orderNo
                            : "Please select a list"}
                        </Text>
                      </FormLabel>

                      <FormLabel fontSize="xs" w="40%">
                        Delivery Status:
                        <Text
                          textAlign="center"
                          w="full"
                          fontSize="xs"
                          bgColor="gray.200"
                          border="1px"
                          py={1}
                        >
                          {moveOrderInformation.deliveryStatus
                            ? moveOrderInformation.deliveryStatus
                            : "Please select a list"}
                        </Text>
                      </FormLabel>
                    </Flex>
                  </Stack>
                  <Stack w="full" mt={2}>
                    <Flex justifyContent="space-between">
                      <FormLabel fontSize="xs" w="40%">
                        Customer Code:
                        <Text
                          textAlign="center"
                          w="full"
                          fontSize="xs"
                          bgColor="gray.200"
                          border="1px"
                          py={1}
                        >
                          {moveOrderInformation.customerName
                            ? moveOrderInformation.customerName
                            : "Please select a list"}
                        </Text>
                      </FormLabel>

                      <FormLabel fontSize="xs" w="40%">
                        Customer Name:
                        <Text
                          textAlign="center"
                          w="full"
                          fontSize="xs"
                          bgColor="gray.200"
                          border="1px"
                          py={1}
                        >
                          {moveOrderInformation.customerCode
                            ? moveOrderInformation.customerCode
                            : "Please select a list"}
                        </Text>
                      </FormLabel>
                    </Flex>
                  </Stack>
                </VStack>
              </VStack>
            </Flex>

            <Flex w="full" flexDirection="column" className="boxShadow">
              <VStack spacing={0}>
                <Text
                  pb={2}
                  textAlign="center"
                  fontSize="xs"
                  color="white"
                  bgColor="primary"
                  w="full"
                  mb={-1.5}
                >
                  List of Move Orders
                </Text>
                <PageScroll minHeight="350px" maxHeight="400px">
                  <Table size="sm" variant="simple">
                    <Thead bgColor="secondary">
                      <Tr>
                        {TableHead?.map((t, i) => (
                          <Th color="white" fontSize="10px" key={i}>
                            {t}
                          </Th>
                        ))}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {moveOrderViewTable?.map((list, i) => (
                        <Tr key={i}>
                          <Td fontSize="11px">{i + 1}</Td>
                          <Td fontSize="11px">{list.orderDate}</Td>
                          <Td fontSize="11px">{list.itemCode}</Td>
                          <Td fontSize="11px">{list.itemDescription}</Td>
                          <Td fontSize="11px">{list.category}</Td>
                          <Td fontSize="11px">{list.uom}</Td>
                          <Td fontSize="11px">{list.quantity}</Td>
                          <Td fontSize="11px">
                            {list.unitCost.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                              minimumFractionDigits: 2,
                            })}
                          </Td>
                          <Td fontSize="11px">
                            {list.totalCost.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                              minimumFractionDigits: 2,
                            })}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </PageScroll>
              </VStack>
            </Flex>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export const TransactConfirmation = ({
  isOpen,
  onClose,
  deliveryDate,
  checkedItems,
  setCheckedItems,
  fetchMoveOrderList,
  setDeliveryDate,
  fetchNotification,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = () => {
    const arraySubmit = checkedItems?.map((item) => {
      return {
        orderNo: item.orderNo,
        // farmType: item.farmType,
        customerName: item.customerName,
        customerCode: item.customerCode,
        orderNoPKey: item.orderNoPKey,
        isApprove: item.isApprove,
        deliveryDate: deliveryDate,
        preparedBy: currentUser?.userName,
      };
    });
    setIsLoading(true);
    try {
      const res = request
        .post(`Ordering/TransactListOfMoveOrders`, arraySubmit)
        .then((res) => {
          ToastComponent("Success", "Move order transacted", "success", toast);
          fetchNotification();
          setDeliveryDate("");
          setCheckedItems([]);
          fetchMoveOrderList();
          setIsLoading(false);
          onClose();
        })
        .catch((err) => {
          ToastComponent("Error", "Transaction failed", "error", toast);
          setIsLoading(false);
          console.log(err);
        });
    } catch (error) {}
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="primary" color="white">
          <Flex justifyContent="center">
            <Text fontSize="14px">Confirmation</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <ModalBody>
          <Flex justifyContent="center" mt={7}>
            <Text fontSize="sm">
              Are you sure you want to transact this move order?
            </Text>
          </Flex>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <ButtonGroup size="sm" mt={7}>
            <Button
              onClick={submitHandler}
              isLoading={isLoading}
              disabled={isLoading}
              colorScheme="blue"
            >
              Yes
            </Button>
            <Button
              onClick={onClose}
              isLoading={isLoading}
              disabled={isLoading}
              colorScheme="blackAlpha"
            >
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
