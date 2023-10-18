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

  // console.log(statusBody)

  const [issuesDetailsData, setIssuesDetailsData] = useState([]);

  const id = statusBody.id;
  const fetchIssuesDetailsApi = async (id) => {
    const res = await request.get(
      `Miscellaneous/GetAllDetailsInMiscellaneousIssue?id=${id}`
    );
    return res.data;
  };

  const fetchIssuesDetails = () => {
    fetchIssuesDetailsApi(id).then((res) => {
      setIssuesDetailsData(res);
    });
  };

  useEffect(() => {
    fetchIssuesDetails();
  }, [id]);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="5xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="primary">
          <Flex justifyContent="left">
            <Text fontSize="xs" color="white">
              Miscellaneous Issue Details
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton color="white" onClick={onClose} />

        <ModalBody mb={5} ref={componentRef}>
          <Flex justifyContent="space-between">
            <VStack alignItems="start" spacing={1}>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Transaction ID:
                </Text>
                <Text fontSize="xs">{issuesDetailsData[0]?.issuePKey}</Text>
              </HStack>

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Transaction Date:
                </Text>
                <Text fontSize="xs">
                  {" "}
                  {moment(issuesDetailsData[0]?.preparedDate).format(
                    "yyyy-MM-DD"
                  )}
                </Text>
              </HStack>

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Customer Code:
                </Text>
                <Text fontSize="xs">{issuesDetailsData[0]?.customerCode}</Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Customer Name:
                </Text>
                <Text fontSize="xs">{issuesDetailsData[0]?.customer}</Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Details:
                </Text>
                <Text fontSize="xs">{issuesDetailsData[0]?.remarks}</Text>
              </HStack>
            </VStack>

            <VStack alignItems="start" spacing={1}>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Company:
                </Text>
                <Text fontSize="xs">
                  {issuesDetailsData[0]?.companyCode} -{" "}
                  {issuesDetailsData[0]?.companyName}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Department:
                </Text>
                <Text fontSize="xs">
                  {issuesDetailsData[0]?.departmentCode} -{" "}
                  {issuesDetailsData[0]?.departmentName}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Location:
                </Text>
                <Text fontSize="xs">
                  {issuesDetailsData[0]?.locationCode} -{" "}
                  {issuesDetailsData[0]?.locationName}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Account Title:
                </Text>
                <Text fontSize="xs">
                  {issuesDetailsData[0]?.accountCode} -{" "}
                  {issuesDetailsData[0]?.accountTitles}
                </Text>
              </HStack>
            </VStack>
          </Flex>
          <VStack justifyContent="center" mt={2}>
            <PageScroll minHeight="320px" maxHeight="321px">
              <Table size="sm">
                <Thead bgColor="secondary">
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
                  {issuesDetailsData?.map((issuedetails, i) => (
                    <Tr key={i}>
                      <Td fontSize="xs">{issuedetails.itemCode}</Td>
                      <Td fontSize="xs">{issuedetails.itemDescription}</Td>
                      <Td fontSize="xs">{issuedetails.totalQuantity}</Td>
                      <Td fontSize="xs">
                        {issuedetails.unitCost.toLocaleString(undefined, {
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
                  Transacted By:
                </Text>
                <Text textDecoration="underline" fontSize="xs">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {issuesDetailsData[0]?.preparedBy}
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
