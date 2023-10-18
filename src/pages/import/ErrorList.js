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
import PageScrollModalErrorList from "../../components/PageScrollModalErrorList";
import PageScrollImportModal from "../../components/PageScrollImportModal";
import { RiFileList3Fill } from "react-icons/ri";
import { TiWarning } from "react-icons/ti";
import Swal from "sweetalert2";
import request from "../../services/ApiClient";
import { ToastComponent } from "../../components/Toast";
import PageScroll from "../../utils/PageScroll";
import { decodeUser } from "../../services/decode-user";
// import DateConverter from "../../components/DateConverter";

const currentUser = decodeUser();

const ErrorList = ({
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
  const toast = useToast();
  const clearExcelFile = useRef();

  const availableImportData = errorData?.availableImport?.map((list) => {
    return {
      pR_Number: list.pR_Number,
      pR_Date: moment(list.pR_Date).format("YYYY-MM-DD"),
      pO_Number: list.pO_Number,
      pO_Date: moment(list.pO_Date).format("YYYY-MM-DD"),
      itemCode: list.itemCode,
      itemDescription: list.itemDescription,
      ordered: list.ordered,
      delivered: list.delivered,
      billed: list.billed,
      uom: list.uom,
      unitPrice: list.unitPrice,
      vendorName: list.vendorName,
    };
  });

  const duplicateListData = errorData?.duplicateList?.map((list) => {
    return {
      pR_Number: list.pR_Number,
      pR_Date: moment(list.pR_Date).format("YYYY-MM-DD"),
      pO_Number: list.pO_Number,
      pO_Date: moment(list.pO_Date).format("YYYY-MM-DD"),
      item_Code: list.itemCode,
      item_Description: list.itemDescription,
      ordered: list.ordered,
      delivered: list.delivered,
      billed: list.billed,
      uom: list.uom,
      unitPrice: list.unitPrice,
      vendorName: list.vendorName,
    };
  });

  const itemcodeNotExistData = errorData?.itemcodeNotExist?.map((list) => {
    return {
      pR_Number: list.pR_Number,
      pR_Date: moment(list.pR_Date).format("YYYY-MM-DD"),
      pO_Number: list.pO_Number,
      pO_Date: moment(list.pO_Date).format("YYYY-MM-DD"),
      item_Code: list.itemCode,
      item_Description: list.itemDescription,
      ordered: list.ordered,
      delivered: list.delivered,
      billed: list.billed,
      uom: list.uom,
      unitPrice: list.unitPrice,
      vendorName: list.vendorName,
    };
  });

  const itemdescriptionNotExist = errorData?.itemdescriptionNotExist?.map(
    (list) => {
      return {
        pR_Number: list.pR_Number,
        pR_Date: moment(list.pR_Date).format("YYYY-MM-DD"),
        pO_Number: list.pO_Number,
        pO_Date: moment(list.pO_Date).format("YYYY-MM-DD"),
        item_Code: list.itemCode,
        item_Description: list.itemDescription,
        ordered: list.ordered,
        delivered: list.delivered,
        billed: list.billed,
        uom: list.uom,
        unitPrice: list.unitPrice,
        vendorName: list.vendorName,
      };
    }
  );

  const supplierNotExistData = errorData?.supplierNotExist?.map((list) => {
    return {
      pR_Number: list.pR_Number,
      pR_Date: moment(list.pR_Date).format("YYYY-MM-DD"),
      pO_Number: list.pO_Number,
      pO_Date: moment(list.pO_Date).format("YYYY-MM-DD"),
      item_Code: list.itemCode,
      item_Description: list.itemDescription,
      ordered: list.ordered,
      delivered: list.delivered,
      billed: list.billed,
      uom: list.uom,
      unitPrice: list.unitPrice,
      vendorName: list.vendorName,
    };
  });

  const uomCodeNotExistData = errorData?.uomCodeNotExist?.map((list) => {
    return {
      pR_Number: list.pR_Number,
      pR_Date: moment(list.pR_Date).format("YYYY-MM-DD"),
      pO_Number: list.pO_Number,
      pO_Date: moment(list.pO_Date).format("YYYY-MM-DD"),
      item_Code: list.itemCode,
      item_Description: list.itemDescription,
      ordered: list.ordered,
      delivered: list.delivered,
      billed: list.billed,
      uom: list.uom,
      unitPrice: list.unitPrice,
      vendorName: list.vendorName,
    };
  });

  const available = availableImportData;
  const duplicate = duplicateListData;
  const itemCodes = itemcodeNotExistData;
  const itemDescription = itemdescriptionNotExist;
  const supplier = supplierNotExistData;
  const uom = uomCodeNotExistData;

  // const resultArray = excelData.map((item) => {
  //     let newPrData = DateConverter(item.pr_date);
  //     let newPoDate = DateConverter(item.po_date);

  //     return {
  //       pR_Number: item.pr_number,
  //       pR_Date: moment(newPrData).format("YYYY-MM-DD"),
  //       pO_Number: item.po_number,
  //       pO_Date: moment(newPoDate).format("YYYY-MM-DD"),
  //       itemCode: item.item_code,
  //       itemDescription: item.item_description,
  //       ordered: item.qty_ordered,
  //       delivered: item.qty_delivered,
  //       billed: item.qty_billed,
  //       uom: item.uom,
  //       unitPrice: item.unit_price,
  //       vendorName: item.supplier_name,
  //       addedBy: currentUser.username,
  //     };
  //   });

  const submitAvailablePOHandler = () => {
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to import this purchase order list?",
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
              .post("Import/AddNewPOSummary", available)
              .then((res) => {
                onClose();
                ToastComponent("Success!", "PO Imported", "success", toast);
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
                // ToastComponent(
                //   "Error",
                //   "Import Failed, Please check your fields.",
                //   "error",
                //   toast
                // );
                // setErrorData(err.response.data);
                // if (err.response.data) {
                //   setErrorOpener(true);
                // //   onErrorOpen();
                // }
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
                                PR Number
                              </Th>
                              <Th color="white" fontSize="9px">
                                PR Date
                              </Th>
                              <Th color="white" fontSize="9px">
                                PO Number
                              </Th>
                              <Th color="white" fontSize="9px">
                                PO Date
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Description
                              </Th>
                              <Th color="white" fontSize="9px">
                                Qty Ordered
                              </Th>
                              <Th color="white" fontSize="9px">
                                Qty Delivered
                              </Th>
                              <Th color="white" fontSize="9px">
                                Qty Billed
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM
                              </Th>
                              <Th color="white" fontSize="9px">
                                Supplier Name
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
                                  {d?.pR_Number}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {moment(d?.pR_Date).format("yyyy-MM-DD")}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.pO_Number}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {moment(d?.pO_Date).format("yyyy-MM-DD")}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemDescription}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.ordered}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.delivered}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.billed}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uom}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.vendorName}
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
                        color="black"
                        // color="#dc2f02"
                        fontWeight="semibold"
                        fontSize="13px"
                      >
                        Duplicated Lists{" "}
                        <Badge fontSize="10px" color="red">
                          {duplicate?.length}
                        </Badge>
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
                              {/* <Th color='white'>ID</Th> */}
                              <Th color="white" fontSize="9px">
                                PR Number
                              </Th>
                              <Th color="white" fontSize="9px">
                                PR Date
                              </Th>
                              <Th color="white" fontSize="9px">
                                PO Number
                              </Th>
                              <Th color="white" fontSize="9px">
                                PO Date
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Description
                              </Th>
                              <Th color="white" fontSize="9px">
                                Ordered
                              </Th>
                              <Th color="white" fontSize="9px">
                                Delivered
                              </Th>
                              <Th color="white" fontSize="9px">
                                Billed
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM
                              </Th>
                              <Th color="white" fontSize="9px">
                                Unit Price
                              </Th>
                              <Th color="white" fontSize="9px">
                                Supplier Name
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {duplicate?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {/* <Td>{ }</Td> */}
                                  {d?.pR_Number === 0 ? (
                                    <Text fontWeight="semibold" color="danger">
                                      Empty field
                                    </Text>
                                  ) : (
                                    d?.pR_Number
                                  )}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.pR_Date === 0 ? (
                                    <Text fontWeight="semibold" color="danger">
                                      Empty field
                                    </Text>
                                  ) : (
                                    d?.pR_Date
                                  )}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.pO_Number === 0 ? (
                                    <Text fontWeight="semibold" color="danger">
                                      Empty field
                                    </Text>
                                  ) : (
                                    d?.pO_Number
                                  )}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.pO_Date === 0 ? (
                                    <Text fontWeight="semibold" color="danger">
                                      Empty field
                                    </Text>
                                  ) : (
                                    d?.pO_Date
                                  )}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.item_Code}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.item_Description}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.ordered}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.delivered}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.billed}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uom}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.unitPrice}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.vendorName}
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

              {/* Item Code */}
              {itemCodes?.length > 0 ? (
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
                        color="black"
                        fontWeight="semibold"
                        fontSize="13px"
                      >
                        Item Code does not exist {""}
                        <Badge color="red">{itemCodes?.length}</Badge>{" "}
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollModalErrorList>
                      {itemCodes?.length > 0 ? (
                        <Table variant="striped" size="sm" bg="white">
                          <Thead bgColor="gray.600">
                            <Tr>
                              {/* <Th color='white'>ID</Th> */}
                              <Th color="white" fontSize="9px">
                                PO Number
                              </Th>
                              <Th color="white" fontSize="9px">
                                PO Date
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Description
                              </Th>
                              <Th color="white" fontSize="9px">
                                Ordered Qty
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM
                              </Th>
                              <Th color="white" fontSize="9px">
                                Unit Price
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {itemCodes?.map((ne, i) => (
                              <Tr key={i}>
                                {/* <Td>{ }</Td> */}
                                <Td color="gray.600" fontSize="11px">
                                  {ne?.pO_Number}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {ne?.pO_Date}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {ne?.item_Code}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {ne?.item_Description}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {ne?.ordered}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {ne?.uom}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {ne?.unitPrice}
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
                              There are no lists with unregistered item code.
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

              {/* Supplier */}
              {supplier?.length > 0 ? (
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
                        color="black"
                        fontWeight="semibold"
                        fontSize="13px"
                      >
                        Supplier does not exist
                        <Badge color="red">{supplier?.length}</Badge>{" "}
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollModalErrorList>
                      {supplier?.length > 0 ? (
                        <Table variant="striped" size="sm" bg="white">
                          <Thead bgColor="gray.600">
                            <Tr>
                              {/* <Th color='white'>ID</Th> */}
                              <Th color="white" fontSize="9px">
                                PO Number
                              </Th>
                              <Th color="white" fontSize="9px">
                                PO Date
                              </Th>
                              <Th color="white" fontSize="9px">
                                Supplier Name
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {supplier?.map((ne, i) => (
                              <Tr key={i}>
                                {/* <Td>{ }</Td> */}
                                <Td color="gray.600" fontSize="11px">
                                  {ne?.pO_Number}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {ne?.pO_Date}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {ne?.vendorName}
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
                              There are no lists with unregistered suppliers.
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

              {/* UOM */}
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
                        color="black"
                        fontWeight="semibold"
                        fontSize="13px"
                      >
                        UOM does not exist{" "}
                        <Badge color="red">{uom?.length}</Badge>
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
                              {/* <Th color='white'>ID</Th> */}
                              <Th color="white" fontSize="9px">
                                PO Number
                              </Th>
                              <Th color="white" fontSize="9px">
                                PO Date
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Description
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM
                              </Th>
                              <Th color="white" fontSize="9px">
                                Unit Price
                              </Th>
                            </Tr>
                          </Thead>

                          {uom?.map((ne, i) => (
                            <Tr key={i}>
                              {/* <Td>{ }</Td> */}
                              <Td color="gray.600" fontSize="11px">
                                {ne?.pO_Number}
                              </Td>
                              <Td color="gray.600" fontSize="11px">
                                {ne?.pO_Date}
                              </Td>
                              <Td color="gray.600" fontSize="11px">
                                {ne?.item_Code}
                              </Td>
                              <Td color="gray.600" fontSize="11px">
                                {ne?.item_Description}
                              </Td>
                              <Td color="gray.600" fontSize="11px">
                                {ne?.uom}
                              </Td>
                              <Td color="gray.600" fontSize="11px">
                                {ne?.unitPrice}
                              </Td>
                            </Tr>
                          ))}
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

              {/* ITEM DESCRIPTION DOES NOT EXIST */}
              {itemDescription?.length > 0 ? (
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
                        color="black"
                        fontWeight="semibold"
                        fontSize="13px"
                      >
                        Item description does not exist{" "}
                        <Badge color="red">{itemDescription?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollModalErrorList>
                      {itemDescription?.length > 0 ? (
                        <Table variant="striped" size="sm" bg="white">
                          <Thead bgColor="gray.600">
                            <Tr>
                              {/* <Th color='white'>ID</Th> */}
                              <Th color="white" fontSize="9px">
                                PR Number
                              </Th>
                              <Th color="white" fontSize="9px">
                                PR Date
                              </Th>
                              <Th color="white" fontSize="9px">
                                PO Number
                              </Th>
                              <Th color="white" fontSize="9px">
                                PO Date
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Description
                              </Th>
                              <Th color="white" fontSize="9px">
                                Ordered
                              </Th>
                              <Th color="white" fontSize="9px">
                                Delivered
                              </Th>
                              <Th color="white" fontSize="9px">
                                Billed
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM
                              </Th>
                              <Th color="white" fontSize="9px">
                                Unit Price
                              </Th>
                              <Th color="white" fontSize="9px">
                                Supplier Name
                              </Th>
                            </Tr>
                          </Thead>

                          {itemDescription?.map((ne, i) => (
                            <Tr key={i}>
                              {/* <Td>{ }</Td> */}
                              <Td color="gray.600" fontSize="11px">
                                {ne?.pR_Number}
                              </Td>
                              <Td color="gray.600" fontSize="11px">
                                {ne?.pR_Date}
                              </Td>
                              <Td color="gray.600" fontSize="11px">
                                {ne?.pO_Number}
                              </Td>
                              <Td color="gray.600" fontSize="11px">
                                {ne?.pO_Date}
                              </Td>
                              <Td color="gray.600" fontSize="11px">
                                {ne?.item_Code}
                              </Td>
                              <Td color="gray.600" fontSize="11px">
                                {ne?.item_Description}
                              </Td>
                              <Td color="gray.600" fontSize="11px">
                                {ne?.ordered}
                              </Td>
                              <Td color="gray.600" fontSize="11px">
                                {ne?.delivered}
                              </Td>
                              <Td color="gray.600" fontSize="11px">
                                {ne?.billed}
                              </Td>
                              <Td color="gray.600" fontSize="11px">
                                {ne?.uom}
                              </Td>
                              <Td color="gray.600" fontSize="11px">
                                {ne?.unitPrice}
                              </Td>
                              <Td color="gray.600" fontSize="11px">
                                {ne?.vendorName}
                              </Td>
                            </Tr>
                          ))}
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">
                              There are no lists with unregistered item
                              description.
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
              <Text fontSize="9px">Disclaimer: There were no PO imported.</Text>
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

export default ErrorList;
