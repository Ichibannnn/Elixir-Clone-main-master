import React, { useRef } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
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
  Text,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Badge,
  VStack,
  HStack,
  useToast,
} from "@chakra-ui/react";
import moment from "moment";
// import PageScrollModalErrorList from "../../components/PageScrollModalErrorList";
import PageScrollModalErrorList from "../../../components/PageScrollModalErrorList";
// import PageScrollImportModal from "../../components/PageScrollImportModal";
import PageScrollImportModal from "../../../components/PageScrollImportModal";
import { RiFileList3Fill } from "react-icons/ri";
import { TiWarning } from "react-icons/ti";
import Swal from "sweetalert2";
import request from "../../../services/ApiClient";
import { ToastComponent } from "../../../components/Toast";
import PageScroll from "../../../utils/PageScroll";
import { decodeUser } from "../../../services/decode-user";
import DateConverter from "../../../components/DateConverter";

export const ErrorList = ({
  isOpen,
  onClose,
  errorData,
  setErrorData,
  setErrorOpener,
  errorOpener,
  isLoading,
  setIsLoading,
  setIsDisabled,
  setExcelData,
  excelData,
}) => {
  const currentUser = decodeUser();

  const toast = useToast();
  const clearExcelFile = useRef();

  const availableImportData = errorData?.availableImport?.map((list) => {
    return {
      itemCode: list.itemCode,
      itemDescription: list.itemDescription,
      accountPName: list.accountPName,
      itemCategoryName: list.itemCategoryName,
      uomCode: list.uomCode,
      bufferLevel: list.bufferLevel,
      addedBy: currentUser.fullName,
    };
  });

  const duplicateListData = errorData?.duplicateList?.map((list) => {
    return {
      itemCode: list.itemCode,
      itemDescription: list.itemDescription,
      accountPName: list.accountPName,
      itemCategoryName: list.itemCategoryName,
      uomCode: list.uomCode,
      bufferLevel: list.bufferLevel,
      addedBy: currentUser.fullName,
    };
  });

  const itemcategoryNotExist = errorData?.itemcategoryNotExist?.map((list) => {
    return {
      itemCode: list.itemCode,
      itemDescription: list.itemDescription,
      accountPName: list.accountPName,
      itemCategoryName: list.itemCategoryName,
      uomCode: list.uomCode,
      bufferLevel: list.bufferLevel,
      addedBy: currentUser.fullName,
    };
  });

  const accountTitleNotExist = errorData?.accountTitleNotExist?.map((list) => {
    return {
      itemCode: list.itemCode,
      itemDescription: list.itemDescription,
      accountPName: list.accountPName,
      itemCategoryName: list.itemCategoryName,
      uomCode: list.uomCode,
      bufferLevel: list.bufferLevel,
      addedBy: currentUser.fullName,
    };
  });

  const uomNotExist = errorData?.uomNotExist?.map((list) => {
    return {
      itemCode: list.itemCode,
      itemDescription: list.itemDescription,
      accountPName: list.accountPName,
      itemCategoryName: list.itemCategoryName,
      uomCode: list.uomCode,
      bufferLevel: list.bufferLevel,
      addedBy: currentUser.fullName,
    };
  });

  // NEWLY ADDED VALIDATIONS ------------------

  const itemCodeAlreadyExist = errorData?.itemCodeAlreadyExist?.map((list) => {
    return {
      itemCode: list.itemCode,
      itemDescription: list.itemDescription,
      accountPName: list.accountPName,
      itemCategoryName: list.itemCategoryName,
      uomCode: list.uomCode,
      bufferLevel: list.bufferLevel,
      addedBy: currentUser.fullName,
    };
  });

  const itemCodeNull = errorData?.itemCodeNull?.map((list) => {
    return {
      itemCode: list.itemCode,
      itemDescription: list.itemDescription,
      accountPName: list.accountPName,
      itemCategoryName: list.itemCategoryName,
      uomCode: list.uomCode,
      bufferLevel: list.bufferLevel,
      addedBy: currentUser.fullName,
    };
  });

  const itemDescriptionAlreadyExist =
    errorData?.itemDescriptionAlreadyExist?.map((list) => {
      return {
        itemCode: list.itemCode,
        itemDescription: list.itemDescription,
        accountPName: list.accountPName,
        itemCategoryName: list.itemCategoryName,
        uomCode: list.uomCode,
        bufferLevel: list.bufferLevel,
        addedBy: currentUser.fullName,
      };
    });

  const itemDescriptionNull = errorData?.itemDescriptionNull?.map((list) => {
    return {
      itemCode: list.itemCode,
      itemDescription: list.itemDescription,
      accountPName: list.accountPName,
      itemCategoryName: list.itemCategoryName,
      uomCode: list.uomCode,
      bufferLevel: list.bufferLevel,
      addedBy: currentUser.fullName,
    };
  });

  const available = availableImportData;
  const duplicate = duplicateListData;
  const itemCategoryName = itemcategoryNotExist;
  const accountTitle = accountTitleNotExist;
  const uom = uomNotExist;
  const item_code_exist = itemCodeAlreadyExist;
  const item_code_null = itemCodeNull;
  const item_desc_exist = itemDescriptionAlreadyExist;
  const item_desc_null = itemDescriptionNull;

  const submitAvailablePOHandler = () => {
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to import this material list?",
      icon: "info",
      color: "black",
      background: "white",
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
        if (available?.length > 0) {
          console.log(available);
          try {
            setIsLoading(true);
            const res = request
              .post("Material/AddNewImportMaterials", available)
              .then((res) => {
                onClose();
                ToastComponent(
                  "Success!",
                  "Materials Imported",
                  "success",
                  toast
                );
                setIsLoading(false);
                setIsDisabled(false);
                clearExcelFile.current.value = "";
                setExcelData([]);
                setErrorOpener(false);
              })
              .catch((err) => {
                setIsLoading(false);
                setErrorOpener(false);
                clearExcelFile.current.value = "";
              });
          } catch (err) {
            ToastComponent(
              "Error!",
              "Wrong excel format imported for PO",
              "error",
              toast
            );
          }
        } else {
          ToastComponent(
            "Error!",
            "No data provided, please check your import",
            "error",
            toast
          );
        }
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="6xl">
      <ModalOverlay />
      <ModalContent color="white" bg="primary">
        <ModalHeader>
          <Flex justifyContent="left">
            <Text fontSize="11px">
              Error: File was not imported due to the following reasons:
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <PageScrollImportModal>
          <ModalBody>
            <Accordion allowToggle>
              {/* FILTERED ORDERS */}
              {available?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton fontWeight="semibold" border="1px">
                      <Box
                        flex="1"
                        textAlign="left"
                        fontSize="13px"
                        fontWeight="semibold"
                        color="green"
                      >
                        Available for syncing{" "}
                        <Badge color="green">{available?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScroll minHeight="500px" maxHeight="501px">
                      {available ? (
                        <Table variant="striped" size="sm" bg="form">
                          <Thead bgColor="gray.600">
                            <Tr>
                              <Th color="white" fontSize="9px">
                                Line
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Description
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Category
                              </Th>
                              <Th color="white" fontSize="9px">
                                Account Title
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM
                              </Th>
                              <Th color="white" fontSize="9px">
                                Buffer Level
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {available?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemDescription}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCategoryName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.accountPName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uomCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.bufferLevel}
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
                    {available ? (
                      <Flex justifyContent="end">
                        <Button
                          onClick={() => submitAvailablePOHandler()}
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

              {/* Duplicated ---------------*/}
              {duplicate?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton
                      color="white"
                      fontWeight="semibold"
                      border="1px"
                    >
                      <Box
                        flex="1"
                        textAlign="left"
                        color="#dc2f02"
                        fontWeight="semibold"
                        fontSize="13px"
                      >
                        Duplicated Lists {""}
                        <Badge color="red">{duplicate?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollModalErrorList>
                      {duplicate?.length > 0 ? (
                        <Table variant="striped" size="sm" bg="white">
                          <Thead bgColor="gray.600">
                            <Tr>
                              <Th color="white" fontSize="9px">
                                Line
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Description
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Category
                              </Th>
                              <Th color="white" fontSize="9px">
                                Account Title
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM
                              </Th>
                              <Th color="white" fontSize="9px">
                                Buffer Level
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {duplicate?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemDescription}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCategoryName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.accountPName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uomCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.bufferLevel}
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
                    </PageScrollModalErrorList>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}

              {/* Item Category */}
              {itemCategoryName?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton
                      color="white"
                      fontWeight="semibold"
                      border="1px"
                    >
                      <Box
                        flex="1"
                        textAlign="left"
                        color="#dc2f02"
                        fontWeight="semibold"
                        fontSize="13px"
                      >
                        Item Category does not exist {""}
                        <Badge color="red">{itemCategoryName?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollModalErrorList>
                      {itemCategoryName?.length > 0 ? (
                        <Table variant="striped" size="sm" bg="white">
                          <Thead bgColor="gray.600">
                            <Tr>
                              <Th color="white" fontSize="9px">
                                Line
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Description
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Category
                              </Th>
                              <Th color="white" fontSize="9px">
                                Account Title
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM
                              </Th>
                              <Th color="white" fontSize="9px">
                                Buffer Level
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {itemCategoryName?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemDescription}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCategoryName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.accountPName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uomCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.bufferLevel}
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
                              There are no lists with unregistered item
                              category.
                            </Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScrollModalErrorList>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}

              {/* Account Title*/}
              {accountTitle?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton
                      color="white"
                      fontWeight="semibold"
                      border="1px"
                    >
                      <Box
                        flex="1"
                        textAlign="left"
                        color="#dc2f02"
                        fontWeight="semibold"
                        fontSize="13px"
                      >
                        Account Title per Item does not exist{" "}
                        <Badge color="red">{accountTitle?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollModalErrorList>
                      {accountTitle?.length > 0 ? (
                        <Table variant="striped" size="sm" bg="white">
                          <Thead bgColor="gray.600">
                            <Tr>
                              <Th color="white" fontSize="9px">
                                Line
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Description
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Category
                              </Th>
                              <Th color="white" fontSize="9px">
                                Account Title
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM
                              </Th>
                              <Th color="white" fontSize="9px">
                                Buffer Level
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {accountTitle?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemDescription}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCategoryName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.accountPName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uomCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.bufferLevel}
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
                              There are no lists with unregistered item sub
                              category.
                            </Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScrollModalErrorList>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}

              {/* UOM Code */}
              {uom?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton
                      color="white"
                      fontWeight="semibold"
                      border="1px"
                    >
                      <Box
                        flex="1"
                        textAlign="left"
                        color="#dc2f02"
                        fontWeight="semibold"
                        fontSize="13px"
                      >
                        UOM does not exist{" "}
                        <Badge color="danger">{uom?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollModalErrorList>
                      {uom?.length > 0 ? (
                        <Table variant="striped" size="sm" bg="white">
                          <Thead bgColor="gray.600">
                            <Tr>
                              <Th color="white" fontSize="9px">
                                Line
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Description
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Category
                              </Th>
                              <Th color="white" fontSize="9px">
                                Account Title
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM
                              </Th>
                              <Th color="white" fontSize="9px">
                                Buffer Level
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {uom?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemDescription}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCategoryName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.accountPName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uomCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.bufferLevel}
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
                              There are no lists with unregistered UOM.
                            </Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScrollModalErrorList>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}

              {/* Item code null */}
              {item_code_null?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton
                      color="white"
                      fontWeight="semibold"
                      border="1px"
                    >
                      <Box
                        flex="1"
                        textAlign="left"
                        color="#dc2f02"
                        fontWeight="semibold"
                        fontSize="13px"
                      >
                        Item Code has an empty cell{" "}
                        <Badge color="danger">{item_code_null?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollModalErrorList>
                      {item_code_null?.length > 0 ? (
                        <Table variant="striped" size="sm" bg="white">
                          <Thead bgColor="gray.600">
                            <Tr>
                              <Th color="white" fontSize="9px">
                                Line
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Description
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Category
                              </Th>
                              <Th color="white" fontSize="9px">
                                Account Title
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM
                              </Th>
                              <Th color="white" fontSize="9px">
                                Buffer Level
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {item_code_null?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemDescription}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCategoryName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.accountPName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uomCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.bufferLevel}
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
                              Check if any fields of Item Code is empty.
                            </Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScrollModalErrorList>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}

              {item_code_exist?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton
                      color="white"
                      fontWeight="semibold"
                      border="1px"
                    >
                      <Box
                        flex="1"
                        textAlign="left"
                        color="#dc2f02"
                        fontWeight="semibold"
                        fontSize="13px"
                      >
                        Item Code is already exist{" "}
                        <Badge color="danger">{item_code_exist?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollModalErrorList>
                      {item_code_exist?.length > 0 ? (
                        <Table variant="striped" size="sm" bg="white">
                          <Thead bgColor="gray.600">
                            <Tr>
                              <Th color="white" fontSize="9px">
                                Line
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Description
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Category
                              </Th>
                              <Th color="white" fontSize="9px">
                                Account Title
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM
                              </Th>
                              <Th color="white" fontSize="9px">
                                Buffer Level
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {item_code_exist?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemDescription}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCategoryName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.accountPName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uomCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.bufferLevel}
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
                              Check the field of Item code if existing.
                            </Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScrollModalErrorList>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}

              {item_desc_null?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton
                      color="white"
                      fontWeight="semibold"
                      border="1px"
                    >
                      <Box
                        flex="1"
                        textAlign="left"
                        color="#dc2f02"
                        fontWeight="semibold"
                        fontSize="13px"
                      >
                        Item Code has an empty cell{" "}
                        <Badge color="danger">{item_desc_null?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollModalErrorList>
                      {item_desc_null?.length > 0 ? (
                        <Table variant="striped" size="sm" bg="white">
                          <Thead bgColor="gray.600">
                            <Tr>
                              <Th color="white" fontSize="9px">
                                Line
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Description
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Category
                              </Th>
                              <Th color="white" fontSize="9px">
                                Account Title
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM
                              </Th>
                              <Th color="white" fontSize="9px">
                                Buffer Level
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {item_desc_null?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemDescription}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCategoryName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.accountPName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uomCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.bufferLevel}
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
                              Check if any fields of Item Description is empty
                            </Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScrollModalErrorList>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}

              {item_desc_exist?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton
                      color="white"
                      fontWeight="semibold"
                      border="1px"
                    >
                      <Box
                        flex="1"
                        textAlign="left"
                        color="#dc2f02"
                        fontWeight="semibold"
                        fontSize="13px"
                      >
                        Item Description is already exist{" "}
                        <Badge color="danger">{item_desc_exist?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollModalErrorList>
                      {item_desc_exist?.length > 0 ? (
                        <Table variant="striped" size="sm" bg="white">
                          <Thead bgColor="gray.600">
                            <Tr>
                              <Th color="white" fontSize="9px">
                                Line
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Description
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Category
                              </Th>
                              <Th color="white" fontSize="9px">
                                Account Title
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM
                              </Th>
                              <Th color="white" fontSize="9px">
                                Buffer Level
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {item_desc_exist.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemDescription}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCategoryName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.accountPName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uomCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.bufferLevel}
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
                              Check item Description if existing.
                            </Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScrollModalErrorList>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}
            </Accordion>

            <HStack mt={20} textAlign="center" fontWeight="semibold">
              {/* <TiWarning color='red' /> */}
              <Text fontSize="9px">
                Disclaimer: There were no Material imported.
              </Text>
            </HStack>
          </ModalBody>
        </PageScrollImportModal>

        <ModalFooter>
          <Button mr={3} onClick={onClose} color="gray.600" fontSize="11px">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
