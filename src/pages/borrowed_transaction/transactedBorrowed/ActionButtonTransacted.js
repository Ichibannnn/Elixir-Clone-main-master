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

export const ViewModal = ({ isOpen, onClose, statusBody }) => {
  const [transactedsDetailsData, setTransactedDetailsData] = useState([]);

  console.log(statusBody);
  // console.log(transactedsDetailsData);
  const param_id = statusBody?.id;
  const fetchTransactedDetailsApi = async () => {
    const res = await request.get(
      `Borrowed/ViewBorrowedReturnDetails?id=${param_id}`
    );
    return res.data;
  };

  const fetchTransactedDetails = () => {
    fetchTransactedDetailsApi().then((res) => {
      setTransactedDetailsData(res);
    });
  };

  useEffect(() => {
    fetchTransactedDetails();
  }, [param_id]);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="5xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader mt={5} fontSize="md">
          <Flex fontSize="sm" justifyContent="center">
            <Text>Returned Borrowed Details</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <VStack alignItems="start" spacing={-1}>
              <Text fontSize="xs">
                Transaction ID: {transactedsDetailsData[0]?.id}
              </Text>
              <Text fontSize="xs">
                Returned Date:{" "}
                {moment(transactedsDetailsData[0]?.borrowedDate).format(
                  "yyyy-MM-DD"
                )}
              </Text>
              <Text fontSize="xs">
                Transacted By: {transactedsDetailsData[0]?.preparedBy}
              </Text>
            </VStack>
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <ModalBody mb={5}>
          <Flex justifyContent="center">
            <PageScroll minHeight="350px" maxHeight="351px">
              <Table size="sm">
                <Thead bgColor="secondary">
                  <Tr>
                    <Th color="white" fontSize="xs">
                      Item Code
                    </Th>
                    <Th color="white" fontSize="xs">
                      Item Description
                    </Th>
                    {/* <Th color="white" fontSize="xs">
                      Borrowed Qty
                    </Th> */}
                    <Th color="white" fontSize="xs">
                      Consumed
                    </Th>
                    <Th color="white" fontSize="xs">
                      Returned Qty
                    </Th>
                    {/* <Text fontSize="xs">
                Transacted By:
              </Text> */}
                  </Tr>
                </Thead>
                <Tbody>
                  {transactedsDetailsData?.map((borrowdetails, i) => (
                    <Tr key={i}>
                      <Td fontSize="xs">{borrowdetails.itemCode}</Td>
                      <Td fontSize="xs">{borrowdetails.itemDescription}</Td>
                      {/* <Td fontSize="xs">
                        {borrowdetails.quantity?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td> */}
                      <Td fontSize="xs">
                        {borrowdetails.consume?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {borrowdetails.returnQuantity?.toLocaleString(
                          undefined,
                          {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          }
                        )}
                      </Td>
                      {/* <Td fontSize="xs">{borrowdetails.itemDescription}</Td> */}
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
