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
  ModalOverlay,
  HStack,
} from "@chakra-ui/react";
import { BsQuestionOctagonFill } from "react-icons/bs";
import request from "../../../../services/ApiClient";
import { ToastComponent } from "../../../../components/Toast";
import PageScroll from "../../../../utils/PageScroll";
import moment from "moment";
import { useReactToPrint } from "react-to-print";

export const ViewModal = ({ isOpen, onClose, statusBody }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [receiptDetailsData, setReceiptDetailsData] = useState([]);

  const id = statusBody.id;
  const fetchReceiptDetailsApi = async (id) => {
    const res = await request.get(
      `Miscellaneous/GetAllDetailsFromWarehouseByMReceipt?id=${id}`
    );
    return res.data;
  };

  const fetchReceiptDetails = () => {
    fetchReceiptDetailsApi(id).then((res) => {
      setReceiptDetailsData(res);
    });
  };

  useEffect(() => {
    fetchReceiptDetails();
  }, [id]);

  console.log(receiptDetailsData);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="6xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="primary">
          <Flex justifyContent="left">
            <Text fontSize="xs" color="white">
              Receipt Details
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton color="white" onClick={onClose} />
        <ModalBody mb={5} ref={componentRef}>
          <Flex justifyContent="space-between">
            <VStack alignItems="start" spacing={1}>
              <HStack>
                <Text fontSize="12px" fontWeight="semibold">
                  Transaction ID:
                </Text>
                <Text fontSize="12px">{receiptDetailsData[0]?.id}</Text>
              </HStack>

              <HStack>
                <Text fontSize="12px" fontWeight="semibold">
                  Transaction Date:
                </Text>
                <Text fontSize="12px">
                  {" "}
                  {moment(receiptDetailsData[0]?.preparedDate).format(
                    "yyyy-MM-DD"
                  )}
                </Text>
              </HStack>

              <HStack>
                <Text fontSize="12px" fontWeight="semibold">
                  Supplier Code:
                </Text>
                <Text fontSize="12px">
                  {receiptDetailsData[0]?.supplierCode}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="12px" fontWeight="semibold">
                  Supplier Name:
                </Text>
                <Text fontSize="12px">
                  {receiptDetailsData[0]?.supplierName}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="12px" fontWeight="semibold">
                  Details:
                </Text>
                <Text fontSize="12px">{receiptDetailsData[0]?.remarks}</Text>
              </HStack>
            </VStack>

            <VStack alignItems="start" spacing={1}>
              <HStack>
                <Text fontSize="12px" fontWeight="semibold">
                  Company:
                </Text>
                <Text fontSize="12px">
                  {receiptDetailsData[0]?.companyCode} -{" "}
                  {receiptDetailsData[0]?.companyName}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="12px" fontWeight="semibold">
                  Department:
                </Text>
                <Text fontSize="12px">
                  {receiptDetailsData[0]?.departmentCode} -{" "}
                  {receiptDetailsData[0]?.departmentName}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="12px" fontWeight="semibold">
                  Location:
                </Text>
                <Text fontSize="12px">
                  {receiptDetailsData[0]?.locationCode} -{" "}
                  {receiptDetailsData[0]?.locationName}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="12px" fontWeight="semibold">
                  Account Title:
                </Text>
                <Text fontSize="12px">
                  {receiptDetailsData[0]?.accountCode} -{" "}
                  {receiptDetailsData[0]?.accountTitles}
                </Text>
              </HStack>
            </VStack>
          </Flex>
          <VStack justifyContent="center" mt={3}>
            <PageScroll minHeight="320px" maxHeight="321px">
              <Table size="sm" bg="gray.100">
                <Thead bgColor="secondary" h="30px">
                  <Tr>
                    <Th color="white" fontSize="xs">
                      Item Code
                    </Th>
                    <Th color="white" fontSize="xs">
                      Item Description
                    </Th>
                    <Th color="white" fontSize="xs">
                      Quantity
                    </Th>
                    <Th color="white" fontSize="xs">
                      Unit Cost
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {receiptDetailsData?.map((receiptdetails, i) => (
                    <Tr key={i}>
                      <Td fontSize="xs">{receiptdetails.itemcode}</Td>
                      <Td fontSize="xs">{receiptdetails.itemDescription}</Td>
                      <Td fontSize="xs">{receiptdetails.totalQuantity}</Td>
                      <Td fontSize="xs">
                        {receiptdetails.unitCost.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </PageScroll>

            <Flex justifyContent="space-between" mt={5} w="full">
              {/* <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Transaction ID:
                </Text>
                <Text textDecoration="underline" fontSize="xs">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {receiptDetailsData[0]?.id}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Text>
              </HStack> */}

              {/* <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Transaction Date:
                </Text>
                <Text textDecoration="underline" fontSize="xs">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {moment(receiptDetailsData[0]?.preparedDate).format(
                    "yyyy-MM-DD"
                  )}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Text>
              </HStack> */}

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Transacted By:
                </Text>
                <Text textDecoration="underline" fontSize="xs">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {receiptDetailsData[0]?.preparedBy}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Text>
              </HStack>
            </Flex>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup size="sm">
            <Button colorScheme="blue" onClick={handlePrint}>
              Print
            </Button>
            <Button colorScheme="gray" onClick={onClose}>
              Close
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
