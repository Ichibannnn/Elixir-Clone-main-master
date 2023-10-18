import React, { useState, useEffect, useRef } from "react";
import {
  HStack,
  Image,
  Button,
  ButtonGroup,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
  Box,
  ModalOverlay,
} from "@chakra-ui/react";
// import apiClient from '../../../services/apiClient'
// import { ToastComponent } from '../../../components/Toast'
// import PageScrollReusable from '../../../components/PageScroll-Reusable'
import moment from "moment";
// import { PrintModal } from '../approvedmo/Action-Modals'
import { useReactToPrint } from "react-to-print";
import Barcode from "react-barcode";
import { decodeUser } from "../../../services/decode-user";
import PageScroll from "../../../utils/PageScroll";
import request from "../../../services/ApiClient";
import { ToastComponent } from "../../../components/Toast";
import { PrintModal } from "../approvedmo/ActionModal";

const currentUser = decodeUser;

// VIEW MODAL----------------------------
export const ViewModal = ({ isOpen, onClose, viewData, status }) => {
  const TableHeads = [
    "Line",
    "Barcode",
    "Item Code",
    "Item Description",
    "Quantity",
    "Unit Cost",
    "Total Cost",
    "Remarks",
  ];

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="5xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="primary">
          <Flex justifyContent="left">
            <Text fontSize="xs" color="white">
              Returned Approval Details
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton color="white" onClick={onClose} />

        <ModalBody mb={5}>
          <Flex justifyContent="space-between">
            <VStack alignItems="start" spacing={1}>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  MIR ID:
                </Text>
                <Text fontSize="xs">{viewData[0]?.mirId}</Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Customer Code:
                </Text>
                <Text fontSize="xs">{viewData[0]?.customercode}</Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Customer Name:
                </Text>
                <Text fontSize="xs">{viewData[0]?.customerName}</Text>
              </HStack>
              {status === false ? (
                ""
              ) : (
                <Text fontSize="xs">Reason: {viewData[0]?.rush}</Text>
              )}
            </VStack>
            <VStack alignItems="start" spacing={1}>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Company:
                </Text>
                <Text fontSize="xs">
                  {viewData[0]?.companyCode} - {viewData[0]?.companyName}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Department:
                </Text>
                <Text fontSize="xs">
                  {viewData[0]?.departmentCode} - {viewData[0]?.departmentName}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Location:
                </Text>
                <Text fontSize="xs">
                  {viewData[0]?.locationCode} - {viewData[0]?.locationName}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Account Title:
                </Text>
                <Text fontSize="xs">
                  {viewData[0]?.accountCode} - {viewData[0]?.accountTitles}
                </Text>
              </HStack>
              {viewData[0]?.empId ? (
                <>
                  <HStack>
                    <Text fontSize="xs" fontWeight="semibold">
                      Employee ID:
                    </Text>
                    <Text fontSize="xs">{viewData[0]?.empId}</Text>
                  </HStack>
                  <HStack>
                    <Text fontSize="xs" fontWeight="semibold">
                      Fullname:
                    </Text>
                    <Text fontSize="xs">{viewData[0]?.fullName}</Text>
                  </HStack>
                </>
              ) : (
                ""
              )}
            </VStack>
          </Flex>
          <Flex justifyContent="center">
            <PageScroll minHeight="300px" maxHeight="450px">
              <Table size="sm">
                <Thead bgColor="secondary">
                  <Tr>
                    <Th color="white" fontSize="10px">
                      Line
                    </Th>
                    {/* <Th color="white" fontSize="10px">
                      MIR ID
                    </Th> */}
                    <Th color="white" fontSize="10px">
                      Item Code
                    </Th>
                    <Th color="white" fontSize="10px">
                      Item Description
                    </Th>
                    <Th color="white" fontSize="10px">
                      Quantity
                    </Th>
                    <Th color="white" fontSize="10px">
                      Unit Cost
                    </Th>
                    {/* <Th color="white" fontSize="10px">
                      Total Cost
                    </Th> */}
                    <Th color="white" fontSize="10px">
                      Item Remarks
                    </Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {viewData?.map((item, i) => (
                    <Tr key={i}>
                      <Td fontSize="xs">{i + 1}</Td>
                      {/* <Td fontSize="xs">{item.barcodeNo}</Td> */}
                      <Td fontSize="xs">{item.itemCode}</Td>
                      <Td fontSize="xs">{item.itemDescription}</Td>
                      <Td fontSize="xs"> {item.quantity}</Td>
                      <Td fontSize="xs">
                        {" "}
                        {item.unitCost.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      {/* <Td fontSize="xs">
                        {" "}
                        {item.totalCost.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td> */}
                      <Td fontSize="xs">{item.rush}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </PageScroll>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <ButtonGroup size="sm" mt={7}>
            <Button colorScheme="gray" onClick={onClose}>
              Close
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// REJECT MODAL------------------------------
export const RejectModal = ({
  isOpen,
  onClose,
  id,
  fetchForApprovalMO,
  fetchNotification,
  mirNo,
  orderNo,
}) => {
  const [reasonSubmit, setReasonSubmit] = useState("");
  const [reasons, setReasons] = useState([]);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const fetchReasonsApi = async () => {
    const res = await request.get(`Reason/GetAllActiveReasons`);
    return res.data;
  };

  const fetchReasons = () => {
    fetchReasonsApi().then((res) => {
      setReasons(res);
    });
  };

  useEffect(() => {
    fetchReasons();

    return () => {
      setReasons([]);
    };
  }, []);

  const submitHandler = () => {
    setIsLoading(true);
    try {
      const res = request
        .put(
          `Ordering/RejectListOfMoveOrder`,
          mirNo?.map((item) => {
            return {
              orderNo: item,
              remarks: reasonSubmit,
              rejectedBy: currentUser.fullName,
            };
          })
          // {
          //   orderNo: id,
          //   remarks: reasonSubmit,
          //   rejectBy: currentUser?.userName,
          // }
        )
        .then((res) => {
          ToastComponent(
            "Success",
            "Move order has been rejected",
            "success",
            toast
          );
          fetchNotification();
          fetchForApprovalMO();
          setIsLoading(false);
          onClose();
        })
        .catch((err) => {
          ToastComponent(
            "Error",
            "Move order was not rejected",
            "error",
            toast
          );
          setIsLoading(false);
        });
    } catch (error) {}
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex justifyContent="center">
            <Text>Reject</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody>
          <VStack justifyContent="center">
            <Text>Are you sure you want to reject this move order?</Text>
            {reasons?.length > 0 ? (
              <Select
                onChange={(e) => setReasonSubmit(e.target.value)}
                w="70%"
                placeholder="Please select a reason"
              >
                {reasons?.map((reason, i) => (
                  <option key={i} value={reason.reasonName}>
                    {reason.reasonName}
                  </option>
                ))}
              </Select>
            ) : (
              "loading"
            )}
          </VStack>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <ButtonGroup size="sm" mt={7}>
            <Button
              onClick={submitHandler}
              disabled={!reasonSubmit || isLoading}
              isLoading={isLoading}
              colorScheme="blue"
            >
              Yes
            </Button>
            <Button
              onClick={onClose}
              disabled={isLoading}
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

// APPROVE MOVE ORDER ----------------------------
export const ApproveModal = ({
  isOpen,
  onClose,
  orderNo,
  fetchForApprovalMO,
  printData,
  fetchNotification,
  totalQuantity,
  mirNo,
  setCheckedItems,
  genusData,
}) => {
  const currentUser = decodeUser();
  const [isLoading, setIsLoading] = useState(false);

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const dateToday = new Date();

  const toast = useToast();
  const {
    isOpen: isPrint,
    onClose: closePrint,
    onOpen: openPrint,
  } = useDisclosure();

  const submitHandler = () => {
    console.log(mirNo);
    console.log("Submit Data: ", genusData);
    setIsLoading(true);
    try {
      const res = request
        .put(
          `Ordering/ApproveListOfMoveOrder`,
          mirNo?.map((item) => {
            return {
              orderNo: item,
              // preparedBy: currentUser.fullName,
            };
          })
        )
        .then((res) => {
          //GENUS SUBMIT DATA

          ToastComponent(
            "Success",
            "Move order has been approved",
            "success",
            toast
          );
          fetchNotification();
          fetchForApprovalMO();
          onClose();
          try {
            const res = request
              .put(
                `Ordering/UpdatePrintStatus`,
                mirNo?.map((item) => {
                  return {
                    orderNo: item,
                  };
                })
              )
              .then((res) => {
                setIsLoading(false);
                setCheckedItems([]);

                // handlePrint();
                // openPrint();
              })
              .catch((err) => {});
          } catch (error) {}
        })
        .catch((item) => {
          ToastComponent(
            "Error",
            "Move order was not approved",
            "error",
            toast
          );
          setIsLoading(false);
        });
    } catch (error) {}
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex justifyContent="center">
              <Text>Approval Confirmation </Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />

          <ModalBody>
            <VStack justifyContent="center">
              <Text>Are you sure you want to approve this move order?</Text>
            </VStack>
          </ModalBody>

          <ModalFooter justifyContent="center">
            <ButtonGroup size="sm" mt={7}>
              <Button
                onClick={submitHandler}
                isLoading={isLoading}
                disabled={isLoading}
                colorScheme="blue"
                fontSize="13px"
              >
                Yes
              </Button>
              <Button
                onClick={onClose}
                isLoading={isLoading}
                disabled={isLoading}
                fontSize="13px"
                color="black"
                variant="outline"
              >
                No
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {isPrint && (
        <PrintModal
          isOpen={isPrint}
          onClose={closePrint}
          closeApprove={onClose}
          printData={printData}
          fetchApprovedMO={fetchForApprovalMO}
          orderId={orderNo}
          totalQuantity={totalQuantity}
        />
      )}

      {/* Printed  */}
      <Box display="none">
        <PageScroll minHeight="150px" maxHeight="300px">
          <VStack spacing={20} w="93%" ml={3} ref={componentRef}>
            {/* Survey Form */}
            {/* <Flex w="full" mb="510px" p={5} flexDirection="column">
              <HStack w="full" border="1px">
                <Image src="/images/RDF Logo.png" w="18%" ml={3} />

                <VStack mt={5} spacing={0} w="full">
                  <Text
                    fontWeight="semibold"
                    fontSize="md"
                    textAlign="center"
                    w="full"
                    borderLeft="1px"
                    borderBottom="1px"
                  >
                    Form
                  </Text>
                  <Text
                    fontWeight="semibold"
                    fontSize="lg"
                    textAlign="center"
                    w="full"
                    borderLeft="1px"
                    borderBottom="1px"
                  >
                    Customer Survey
                  </Text>
                  <Flex w="full" justifyContent="space-between">
                    <VStack w="full" spacing={0}>
                      <Text
                        fontWeight="semibold"
                        fontSize="xs"
                        textAlign="center"
                        w="full"
                        borderLeft="1px"
                        borderBottom="1px"
                      >
                        Control No.
                      </Text>
                      <Text
                        fontWeight="semibold"
                        fontSize="xs"
                        textAlign="center"
                        w="full"
                        borderLeft="1px"
                        borderBottom="1px"
                      >
                        Owner
                      </Text>
                      <Text
                        fontWeight="semibold"
                        fontSize="xs"
                        textAlign="center"
                        w="full"
                        borderLeft="1px"
                      >
                        Effectivity
                      </Text>
                    </VStack>
                    <VStack w="full" spacing={0}>
                      <Text
                        fontWeight="semibold"
                        fontSize="xs"
                        textAlign="center"
                        w="full"
                        borderLeft="1px"
                        borderBottom="1px"
                      >
                        ETD-FRM-23-001
                      </Text>
                      <Text
                        fontWeight="semibold"
                        fontSize="xs"
                        textAlign="center"
                        w="full"
                        borderLeft="1px"
                        borderBottom="1px"
                      >
                        PC
                      </Text>
                      <Text
                        fontWeight="semibold"
                        fontSize="xs"
                        textAlign="center"
                        w="full"
                        borderLeft="1px"
                      >
                        &nbsp;
                      </Text>
                    </VStack>
                    <VStack w="full" spacing={0}>
                      <Text
                        fontWeight="semibold"
                        fontSize="xs"
                        textAlign="center"
                        w="full"
                        borderLeft="1px"
                        borderBottom="1px"
                      >
                        Supersedes
                      </Text>
                      <Text
                        fontWeight="semibold"
                        fontSize="xs"
                        textAlign="center"
                        w="full"
                        borderLeft="1px"
                        borderBottom="1px"
                      >
                        Revision No.
                      </Text>
                      <Text
                        fontWeight="semibold"
                        fontSize="xs"
                        textAlign="center"
                        w="full"
                        borderLeft="1px"
                      >
                        Page
                      </Text>
                    </VStack>
                    <VStack w="full" spacing={0}>
                      <Text
                        fontWeight="semibold"
                        fontSize="xs"
                        textAlign="center"
                        w="full"
                        borderLeft="1px"
                        borderBottom="1px"
                      >
                        None
                      </Text>
                      <Text
                        fontWeight="semibold"
                        fontSize="xs"
                        textAlign="center"
                        w="full"
                        borderLeft="1px"
                        borderBottom="1px"
                      >
                        0
                      </Text>
                      <Text
                        fontWeight="semibold"
                        fontSize="xs"
                        textAlign="center"
                        w="full"
                        borderLeft="1px"
                      >
                        1
                      </Text>
                    </VStack>
                  </Flex>
                </VStack>
              </HStack>

              <HStack spacing={20}>
                <Text fontWeight="semibold" fontSize="xs">
                  Evaluated Unit: _____________________ Warehouse
                </Text>
                <Text fontWeight="semibold" fontSize="xs">
                  Date: _______________________________
                </Text>
                <Text fontSize="xs" fontWeight="semibold">
                  Order ID: {orderNo && orderNo}
                </Text>
              </HStack>

              <Table variant="unstyled" size="sm">
                <Thead border="1px">
                  <Tr>
                    <Th textAlign="center" borderRight="1px">
                      Service Level
                    </Th>
                    <Th></Th>
                    <Th
                      textAlign="center"
                      borderX="1px"
                    >{`Score (Bilugan ang Score)`}</Th>
                    <Th textAlign="center">Remarks/comments/suggestion</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr border="1px">
                    <Td fontSize="xs" textAlign="center" borderRight="1px">
                      Quantity Issue
                    </Td>
                    <Td
                      fontSize="xs"
                      textAlign="center"
                      borderRight="1px"
                    >{`(nauubusan ba ng stock ang customer?)`}</Td>
                    <Td fontSize="sm" textAlign="center" borderRight="1px">
                      1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3
                    </Td>
                    <Td></Td>
                  </Tr>
                  <Tr border="1px">
                    <Td fontSize="xs" textAlign="center" borderRight="1px">
                      Quality Issue
                    </Td>
                    <Td
                      fontSize="xs"
                      textAlign="center"
                      borderRight="1px"
                    >{`(kalidad ng trabaho/gawa)`}</Td>
                    <Td fontSize="sm" textAlign="center" borderRight="1px">
                      1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3
                    </Td>
                    <Td></Td>
                  </Tr>
                  <Tr border="1px">
                    <Td fontSize="xs" textAlign="center" borderRight="1px">
                      Customer Service
                    </Td>
                    <Td
                      fontSize="xs"
                      textAlign="center"
                      borderRight="1px"
                    >{`(pakikitungo sa customer)`}</Td>
                    <Td fontSize="sm" textAlign="center" borderRight="1px">
                      1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3
                    </Td>
                    <Td></Td>
                  </Tr>
                  <Tr border="1px">
                    <Td fontSize="xs" textAlign="center" borderRight="1px">
                      Other Issue <br />
                      {`(ano pa ang problema na hindi nabanggit sa itaas?)`}
                    </Td>
                    <Td
                      fontSize="xs"
                      textAlign="center"
                      borderRight="1px"
                    >{`(nauubusan ba ng stock ang customer?)`}</Td>
                    <Td fontSize="sm" textAlign="center" borderRight="1px">
                      1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3
                    </Td>
                    <Td></Td>
                  </Tr>
                </Tbody>
              </Table>

              <Flex w="full" justifyContent="end" mt={2}>
                <Text fontWeight="semibold" fontSize="xs">
                  Evaluated By: __________________________________________
                </Text>
              </Flex>
            </Flex> */}

            {/* MO Slip */}
            <Flex
              w="full"
              mt={2}
              p={5}
              flexDirection="column"
              ref={componentRef}
            >
              <Flex spacing={0} justifyContent="start" flexDirection="column">
                <Image src="/images/RDF Logo.png" w="13%" ml={3} />
                <Text fontSize="8px" ml={2}>
                  Purok 6, Brgy. Lara, City of San Fernando, Pampanga,
                  Philippines
                </Text>
              </Flex>

              <Flex justifyContent="center" my={4}>
                <Text fontSize="lg" fontWeight="semibold">
                  Move Order Slip
                </Text>
              </Flex>

              <Flex justifyContent="space-between" mb={3}>
                <Flex flexDirection="column">
                  <Text>Order ID: {orderNo && orderNo}</Text>
                  <Text>Unit: {`Warehouse`}</Text>
                  <Text>Customer: {printData[0]?.customerName}</Text>
                  {/* <Text>Address: {printData[0]?.address}</Text> */}
                  {/* <Text>Batch Number: {printData[0]?.batchNo}</Text> */}
                </Flex>
                <Flex flexDirection="column">
                  <Barcode width={3} height={50} value={Number(orderNo)} />
                  <Text>Date: {moment(dateToday).format("MM/DD/yyyy")}</Text>
                </Flex>
              </Flex>

              <Table size="sm">
                <Thead bgColor="secondary">
                  <Tr>
                    <Th color="white">ITEM CODE</Th>
                    <Th color="white">ITEM DESCRIPTION</Th>
                    <Th color="white">UOM</Th>
                    <Th color="white">QUANTITY</Th>
                    <Th color="white">ACTUAL QTY RECEIVED</Th>
                    {/* <Th color="white">EXPIRATION DATE</Th> */}
                  </Tr>
                </Thead>
                <Tbody>
                  {printData?.map((item, i) => (
                    <Tr borderX="1px" borderBottom="1px" key={i}>
                      <Td>{item.itemCode}</Td>
                      <Td>{item.itemDescription}</Td>
                      <Td>{item.uom}</Td>
                      <Td>{item.quantity}</Td>
                      <Td></Td>
                      {/* <Td>{moment(item.expiration).format("MM/DD/yyyy")}</Td> */}
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              {/* <Flex justifyContent="start" mb={3}>
                <Text>Total Quantity: {totalQuantity && totalQuantity}</Text>
              </Flex> */}

              <Flex justifyContent="space-between" mb={5} mt={2}>
                <HStack>
                  <Text>Delivery Status:</Text>
                  <Text textDecoration="underline">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {"Pick-Up"}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Text>
                </HStack>
                <VStack spacing={0}>
                  <HStack>
                    <Text>Checked By:</Text>
                    <Text textDecoration="underline">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </Text>
                  </HStack>
                </VStack>
              </Flex>

              <Flex justifyContent="space-between">
                <VStack spacing={0}>
                  <HStack>
                    <Text>Prepared By:</Text>
                    <Text textDecoration="underline">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </Text>
                  </HStack>
                </VStack>

                <VStack spacing={0}>
                  <HStack>
                    <Text>Received By:</Text>
                    <Text textDecoration="underline">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </Text>
                  </HStack>
                </VStack>
              </Flex>

              <Flex mt={10}>
                <Text fontWeight="semibold" fontSize="xs">
                  ETD-FRM-23-001
                </Text>
              </Flex>
            </Flex>
          </VStack>
        </PageScroll>
      </Box>
    </>
  );
};
