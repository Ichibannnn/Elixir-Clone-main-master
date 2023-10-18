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
  Input,
  Select,
} from "@chakra-ui/react";
import request from "../../../../services/ApiClient";
import PageScroll from "../../../../utils/PageScroll";
import moment from "moment";
import { GrView } from "react-icons/gr";

export const ViewModal = ({
  isOpen,
  onClose,
  statusBody,
  fetchBorrowed,
  setIsLoading,
}) => {
  const { isOpen: isCoa, onOpen: openCoa, onClose: closeCoa } = useDisclosure();

  const [borrowedDetailsData, setBorrowedDetailsData] = useState([]);
  const [coaId, setCoaId] = useState("");

  const toast = useToast();

  const id = statusBody.id;
  const fetchBorrowedDetailsApi = async (id) => {
    const res = await request.get(
      `Borrowed/ViewBorrowedReturnDetails?id=${id}`
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

  const coaIdHandler = (data) => {
    if (data) {
      setCoaId(data);
      console.log(coaId);
      openCoa();
    } else {
      setCoaId("");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="5xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="primary">
          <Flex justifyContent="left">
            <Text fontSize="xs" color="white">
              Approved Returned Details
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
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Borrowed Date:
                </Text>
                <Text fontSize="xs">
                  {" "}
                  {moment(borrowedDetailsData[0]?.transactionDate).format(
                    "MM/DD/yyyy"
                  )}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Returned Date:
                </Text>
                <Text fontSize="xs">
                  {" "}
                  {moment(borrowedDetailsData[0]?.returnedDate).format(
                    "MM/DD/yyyy"
                  )}
                </Text>
              </HStack>
            </VStack>

            <VStack alignItems="start" spacing={-1}></VStack>
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
                      Borrowed Qty
                    </Th>
                    <Th color="white" fontSize="xs">
                      Consumed
                    </Th>
                    <Th color="white" fontSize="xs">
                      Returned Qty
                    </Th>
                    <Th color="white" fontSize="xs">
                      View
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
                        {borrowdetails.borrowedQuantity.toLocaleString(
                          undefined,
                          {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          }
                        )}
                      </Td>
                      <Td fontSize="xs">
                        {borrowdetails.consume.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {borrowdetails.returnQuantity.toLocaleString(
                          undefined,
                          {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          }
                        )}
                      </Td>
                      <Td>
                        {borrowdetails.consume === 0 ? (
                          <Button isDisabled size="xs" bg="none">
                            <GrView
                              fontSize="18px"
                              onClick={() => coaIdHandler(borrowdetails.id)}
                            />
                          </Button>
                        ) : (
                          <Button
                            size="xs"
                            bg="none"
                            onClick={() => coaIdHandler(borrowdetails.id)}
                          >
                            <GrView fontSize="18px" />
                          </Button>
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
            {/* <Button colorScheme="blue" onClick={submitBody}>
                Submit
              </Button> */}
            <Button colorScheme="gray" onClick={onClose}>
              Close
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>

      {isCoa && <ViewCOA isOpen={isCoa} onClose={closeCoa} coaId={coaId} />}
    </Modal>
  );
};

export const ViewCOA = ({ isOpen, onClose, coaId }) => {
  const [coaList, setCoaList] = useState([]);

  //RETURN REQUEST
  const id = coaId;
  const fetchCOAListApi = async (id) => {
    const res = await request.get(`Borrowed/ViewConsumeForReturn?`, {
      params: {
        id: id,
      },
    });
    return res.data;
  };

  const fetchCOAList = () => {
    fetchCOAListApi(id).then((res) => {
      setCoaList(res);
      // console.log(res);
    });
  };

  useEffect(() => {
    if (id) {
      fetchCOAList();
    }
    return () => {
      setCoaList([]);
    };
  }, [id]);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="6xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="primary">
          <Flex justifyContent="left">
            <Text fontSize="xs" color="white">
              View Materials
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton color="white" onClick={onClose} />
        <ModalBody mb={5} fontSize="xs">
          <Flex mt={4} flexDir="left">
            <Text fontSize="xl" fontWeight="extrabold">
              List of Consumed Materials
            </Text>
          </Flex>
          <Flex flexDirection="column" w="full" mt={4}>
            <PageScroll minHeight="430px" maxHeight="450px">
              <Table size="sm" variant="striped">
                <Thead bgColor="primary" position="sticky" top={0} zIndex={1}>
                  <Tr>
                    <Th h="20px" color="white" fontSize="10px">
                      Item Code
                    </Th>
                    <Th h="20px" color="white" fontSize="10px">
                      Item Description
                    </Th>
                    <Th h="20px" color="white" fontSize="10px">
                      Uom
                    </Th>
                    <Th h="20px" color="white" fontSize="10px">
                      Consumed Qty
                    </Th>
                    <Th h="20px" color="white" fontSize="10px">
                      Company Code
                    </Th>
                    <Th h="20px" color="white" fontSize="10px">
                      Company Name
                    </Th>
                    <Th h="20px" color="white" fontSize="10px">
                      Department Code
                    </Th>
                    <Th h="20px" color="white" fontSize="10px">
                      Department Name
                    </Th>
                    <Th h="20px" color="white" fontSize="10px">
                      Location Code
                    </Th>
                    <Th h="20px" color="white" fontSize="10px">
                      Location Name
                    </Th>
                    <Th h="20px" color="white" fontSize="10px">
                      Account Code
                    </Th>
                    <Th h="20px" color="white" fontSize="10px">
                      Account Title
                    </Th>
                    <Th h="20px" color="white" fontSize="10px">
                      Employee Id
                    </Th>
                    <Th h="20px" color="white" fontSize="10px">
                      Full Name
                    </Th>
                    {/* <Th h="20px" color="white" fontSize="10px">
                Action
              </Th> */}
                  </Tr>
                </Thead>
                <Tbody>
                  {coaList?.map((item, i) => (
                    <Tr key={i}>
                      {/* <Td fontSize="xs">{item.id}</Td> */}
                      <Td fontSize="xs">{item.itemCode}</Td>
                      <Td fontSize="xs">{item.itemDescription}</Td>
                      <Td fontSize="xs">{item.uom}</Td>
                      <Td fontSize="xs">
                        {item.consume.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">{item.companyCode}</Td>
                      <Td fontSize="xs">{item.companyName}</Td>
                      <Td fontSize="xs">{item.departmentCode}</Td>
                      <Td fontSize="xs">{item.departmentName}</Td>
                      <Td fontSize="xs">{item.locationCode}</Td>
                      <Td fontSize="xs">{item.locationName}</Td>
                      <Td fontSize="xs">{item.accountCode}</Td>
                      <Td fontSize="xs">{item.accountTitles}</Td>
                      <Td fontSize="xs">{item.empId}</Td>
                      <Td fontSize="xs">{item.fullName}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </PageScroll>
          </Flex>
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
