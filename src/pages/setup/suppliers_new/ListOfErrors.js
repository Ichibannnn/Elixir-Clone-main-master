import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import { RiFileList3Fill } from "react-icons/ri";
import Swal from "sweetalert2";
import PageScrollImport from "../../../components/PageScrollImport";
import { ToastComponent } from "../../../components/Toast";
import request from "../../../services/ApiClient";
import PageScroll from "../../../utils/PageScroll";

export const ListOfErrors = (
  isOpen,
  onOpen,
  onClose,
  errorData,
  setErrorData,
  isLoading,
  setIsLoading
) => {
  const toast = useToast();

  const duplicateList = errorData?.duplicateList?.map((list) => {
    return {
      supplier_No: list?.supplier_No,
      supplierCode: list?.supplierCode,
      supplierName: list?.supplierName,
    };
  });

  const filteredOrders = errorData?.availableImport?.map((list) => {
    return {
      supplier_No: list?.supplier_No,
      supplierCode: list?.supplierCode,
      supplierName: list?.supplierName,
    };
  });

  const resultArray = filteredOrders?.map((list) => {
    return {
      supplier_No: list?.supplier_No,
      supplierCode: list?.supplierCode,
      supplierName: list?.supplierName,
    };
  });

  const validationAvailableToSync = () => {
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to sync these suppliers?",
      icon: "info",
      color: "white",
      background: "#1B1C1D",
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
      if (result.isConfirmed) {
        try {
          const res = request
            .post(
              `Supplier/AddNewSupplier`,
              resultArray.map((item) => {
                return {
                  supplier_No: item?.supplier_No,
                  supplierCode: item?.supplierCode,
                  supplierName: item?.supplierName,
                };
              })
            )
            .then((res) => {
              ToastComponent("Success", "Orders Synced!", "success", toast);
              onClose();
              setIsLoading(false);
            })
            .catch((err) => {
              setIsLoading(false);
              setErrorData(err.response.data);
              if (err.response.data) {
                onClose();
                onOpen();
              }
            });
        } catch (error) {}
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="4xl">
      <ModalOverlay />
      <ModalContent
        color="white"
        bg="linear-gradient(rgba(0, 0, 0, 0.850),rgba(0, 0, 0, 3))"
      >
        <ModalHeader>
          <Flex justifyContent="left">
            <Text fontSize="11px" color="white">
              Orders were not synced due to the following reasons:
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <PageScroll>
          <ModalBody>
            <Accordion allowToggle>
              {/* DUPLICATED LIST */}
              {duplicateList?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton color="white" fontWeight="semibold">
                      <Box
                        flex="1"
                        textAlign="left"
                        color="black"
                        fontSize="13px"
                        fontWeight="semibold"
                      >
                        Duplicated Lists{" "}
                        <Badge color="red">{duplicateList?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollImport maxHeight="470px">
                      {duplicateList ? (
                        <Table variant="striped" size="sm">
                          <Thead bgColor="gray.600">
                            <Tr>
                              <Th color="white" fontSize="9px">
                                Line
                              </Th>
                              <Th color="white" fontSize="9px">
                                ID
                              </Th>
                              <Th color="white" fontSize="9px">
                                Supplier No.
                              </Th>
                              <Th color="white" fontSize="9px">
                                Supplier Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Supplier Name
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {duplicateList?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.supplier_No}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.supplierCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.supplierName}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">
                              There are no duplicated lists on this file
                            </Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScrollImport>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}

              {/* FILTERED ORDERS */}
              {filteredOrders?.length > 0 ? (
                <AccordionItem bgColor="blue.200">
                  <Flex>
                    <AccordionButton fontWeight="semibold">
                      <Box
                        flex="1"
                        textAlign="left"
                        color="black"
                        fontSize="13px"
                        fontWeight="semibold"
                      >
                        Available for syncing{" "}
                        <Badge color="green">{filteredOrders?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScroll minHeight="500px" maxHeight="501px">
                      {filteredOrders ? (
                        <Table variant="striped" size="sm" bg="form">
                          <Thead bgColor="gray.600">
                            <Tr>
                              <Th color="white" fontSize="9px">
                                Line
                              </Th>
                              <Th color="white" fontSize="9px">
                                ID
                              </Th>
                              <Th color="white" fontSize="9px">
                                Supplier No.
                              </Th>
                              <Th color="white" fontSize="9px">
                                Supplier Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Supplier Name
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {filteredOrders?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.supplier_No}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.supplierCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.supplierName}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">
                              There are no duplicated lists on this file
                            </Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScroll>
                    {filteredOrders ? (
                      <Flex justifyContent="end">
                        <Button
                          onClick={() => validationAvailableToSync()}
                          size="sm"
                          _hover={{ bgColor: "accent", color: "white" }}
                          colorScheme="blue"
                          isLoading={isLoading}
                        >
                          Sync
                        </Button>
                      </Flex>
                    ) : (
                      ""
                    )}
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}
            </Accordion>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </PageScroll>
      </ModalContent>
    </Modal>
  );
};
