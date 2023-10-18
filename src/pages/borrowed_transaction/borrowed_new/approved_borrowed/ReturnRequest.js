import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { MdOutlineCheckBox, MdOutlinePendingActions } from "react-icons/md";
import { GoArrowSmallRight } from "react-icons/go";
import PageScroll from "../../../../utils/PageScroll";
import moment from "moment";
import request from "../../../../services/ApiClient";

export const ReturnRequest = ({ isOpen, onClose, materialListId }) => {
  const [returnRequest, setReturnRequest] = useState([]);

  //RETURN REQUEST
  const id = materialListId;
  const fetchReturnRequestApi = async (id) => {
    const res = await request.get(`Borrowed/GetConsumedItem?`, {
      params: {
        id: id,
      },
    });
    return res.data;
  };

  const fetchReturnRequest = () => {
    fetchReturnRequestApi(id).then((res) => {
      setReturnRequest(res);
      console.log(res);
    });
  };

  useEffect(() => {
    if (id) {
      fetchReturnRequest();
    }
    return () => {
      setReturnRequest([]);
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
            {/* <Box w="full" bgColor="primary" h="22px">
              <Text
                fontWeight="normal"
                fontSize="13px"
                color="white"
                textAlign="center"
                justifyContent="center"
              >
                List of Consumed Materials
              </Text>
            </Box> */}
            <PageScroll minHeight="430px" maxHeight="450px">
              <Table size="sm" variant="striped">
                <Thead bgColor="primary" position="sticky" top={0} zIndex={1}>
                  <Tr>
                    {/* <Th h="20px" color="white" fontSize="10px">
                Id
              </Th> */}
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
                  {returnRequest?.map((item, i) => (
                    <Tr key={i}>
                      {/* <Td fontSize="xs">{item.id}</Td> */}
                      <Td fontSize="xs">{item.itemCode}</Td>
                      <Td fontSize="xs">{item.itemDescription}</Td>
                      <Td fontSize="xs">{item.uom}</Td>
                      <Td fontSize="xs">
                        {item.consumedQuantity.toLocaleString(undefined, {
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
                      {/* <Td fontSize="xs">
                  <Flex>
                    <HStack>
                      <Button colorScheme="facebook" size="xs">
                        Return
                      </Button>
                    </HStack>
                  </Flex>
                </Td> */}
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
