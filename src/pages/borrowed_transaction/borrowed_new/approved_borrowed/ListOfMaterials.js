import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Toast,
  Tr,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import PageScroll from "../../../../utils/PageScroll";
import moment from "moment";
import { ToastComponent } from "../../../../components/Toast";
import Swal from "sweetalert2";
import request from "../../../../services/ApiClient";
import { AiOutlineMore } from "react-icons/ai";
import { GrView } from "react-icons/gr";
import { BiDownload } from "react-icons/bi";
import { ReturnRequest } from "./ReturnRequest";
import { useLocation, useNavigate } from "react-router-dom";

export const ListOfMaterials = ({
  materialList,
  setMaterialList,
  highlighterId,
  setHighlighterId,
  setIsConsumeModalOpen,
  setMaterialListId,
  materialListId,
  setItemCode,
  borrowedId,
  setBorrowedId,
  fetchMaterialsList,
  fetchNotificationWithParams,
  setIsLoading,
  setButtonChanger,
  returnQuantity,
  setReturnQuantity,
  setItemDescription,
  setUom,
  issueBorrowData,
  fetchBorrowed,
  setBorrowIssueData,
  setConsumedQuantity,
}) => {
  const toast = useToast();

  const {
    isOpen: isReturn,
    onClose: closeReturn,
    onOpen: openReturn,
  } = useDisclosure();

  const rowHandler = ({
    id,
    itemCode,
    itemDescription,
    uom,
    remainingQuantity,
  }) => {
    console.log(id);
    if (id) {
      setHighlighterId(id);
      setMaterialListId(id);
      setItemCode(itemCode);
      setItemDescription(itemDescription);
      setUom(uom);
      setItemCode(itemCode);
      setReturnQuantity(remainingQuantity);
      setBorrowedId(borrowedId);
      setIsConsumeModalOpen(true);
    } else {
      setHighlighterId("");
      setMaterialListId("");
      setItemCode("");
      setItemDescription("");
      setUom("");
      setReturnQuantity("");
      setBorrowedId("");
      setIsConsumeModalOpen(false);
    }
  };

  const materialListIdHandler = (data) => {
    if (data) {
      setMaterialListId(data);
      console.log(materialListId);
      openReturn();
    } else {
      setMaterialListId("");
    }
  };

  const submitConsumeHandler = (data) => {
    console.log(data);
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to save this information?",
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
        setIsLoading(true);
        try {
          const response = request
            .put(`Borrowed/SaveReturnedQuantity`, [
              {
                borrowedPKey: borrowedId,
              },
            ])
            .then((response) => {
              ToastComponent(
                "Success",
                "Returned materials was saved",
                "success",
                toast
              );
              fetchMaterialsList();
              setItemCode("");
              setHighlighterId("");
              setMaterialListId("");
              setConsumedQuantity("");
              setButtonChanger(false);
              setMaterialList("");
              fetchBorrowed();
              setIsLoading(false);
              fetchNotificationWithParams();
              sessionStorage.removeItem("Navigation");
              sessionStorage.removeItem("Borrowed ID");
              navigateConsume("/borrowed/view-request");
              console.log(materialList);
              setBorrowedId("");
            })
            .catch((err) => {
              // ToastComponent("Error", err.response.data, "warning", toast);
            });
        } catch (err) {
          ToastComponent("Error", err.response.data, "warning", toast);
        }
      }
    });
  };

  // console.log("The value is: ", borrowedId);
  // console.log("The value is: ", highlighterId);

  const cancelAllConsumed = (data) => {
    // console.log(data);
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to cancal all consumed information?",
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
        try {
          const response = request
            .put(`Borrowed/CancelAllConsumeItem`, { borrowedPKey: borrowedId })
            .then((response) => {
              ToastComponent(
                "Success",
                "Returned materials was saved",
                "success",
                toast
              );
              sessionStorage.removeItem("Navigation");
              sessionStorage.removeItem("Borrowed ID");
              fetchBorrowed();
              fetchMaterialsList();
              setBorrowedId("");
              setMaterialListId("");
              setItemCode("");
              setConsumedQuantity("");
              setIsLoading(false);
              setButtonChanger(false);
              fetchNotificationWithParams();
              // navigateConsume("/borrowed/view-request");
            })
            .catch((err) => {
              ToastComponent("Error", err.response.data, "warning", toast);
            });
        } catch (err) {
          ToastComponent("Error", err.response.data, "warning", toast);
        }
      }
    });
  };

  const navigateConsume = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    sessionStorage.setItem("Borrowed ID", borrowedId);

    return () => {
      const isConsumed = materialList?.some((item) =>
        Boolean(item.consumedQuantity)
      );

      if (isConsumed && sessionStorage.getItem("Borrowed ID"))
        Swal.fire({
          title: "[Warning!]<br>" + "[Borrowed Transaction]",
          html:
            "Your consumed list will be cancelled." +
            "<br>" +
            "Are you sure you want to leave the page without submitting?",
          icon: "warning",
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
            title: "my-swal-title",
          },
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            try {
              const response = request
                .put(`Borrowed/CancelAllConsumeItem`, {
                  borrowedPKey: borrowedId,
                })
                .then((response) => {
                  ToastComponent(
                    "Success",
                    "Returned materials was saved",
                    "success",
                    toast
                  );
                  fetchBorrowed();
                  fetchMaterialsList();
                  setBorrowedId("");
                  setMaterialListId("");
                  setItemCode("");
                  setConsumedQuantity("");
                  setIsLoading(false);
                  setButtonChanger(false);
                  fetchNotificationWithParams();
                  navigateConsume("/borrowed/view-request");
                })
                .catch((err) => {
                  ToastComponent("Error", err.response.data, "warning", toast);
                });
            } catch (err) {
              ToastComponent("Error", err.response.data, "warning", toast);
            }
          } else {
            navigateConsume("/borrowed/view-request");
            sessionStorage.setItem("Borrowed ID", borrowedId);
            sessionStorage.setItem("Navigation", 2);
          }
        });
    };
  }, [materialList]);

  return (
    <Flex flexDirection="column" h="80vh" w="full" mt={2} className="boxShadow">
      <Flex h="40px" bg="primary" color="white" alignItems="center">
        <Text fontSize="sm" ml={4}>
          List of Materials
        </Text>
      </Flex>
      <Flex justifyContent="left" w="full" mb={1} p={4}>
        <Flex>
          <VStack alignItems="start" spacing={1}>
            <HStack>
              <Text fontSize="xs" fontWeight="semibold">
                Borrowed Id:{" "}
              </Text>
              <Text fontSize="xs">{materialList[0]?.borrowedPKey}</Text>
            </HStack>
            <HStack>
              <Text fontSize="xs" fontWeight="semibold">
                Customer Code:{" "}
              </Text>
              <Text fontSize="xs">{materialList[0]?.customerCode}</Text>
            </HStack>
            <HStack>
              <Text fontSize="xs" fontWeight="semibold">
                Customer Name:{" "}
              </Text>
              <Text fontSize="xs">{materialList[0]?.customerName}</Text>
            </HStack>
            <HStack>
              <Text fontSize="xs" fontWeight="semibold">
                Borrowed Date:{" "}
              </Text>
              <Text fontSize="xs">
                {moment(materialList[0]?.borrowedDate).format("MM/DD/yyyy")}
              </Text>
            </HStack>
          </VStack>
        </Flex>
      </Flex>
      <Flex p={4}>
        <PageScroll minHeight="450px" maxHeight="470px">
          <Table size="sm" variant="striped">
            <Thead bgColor="primary" position="sticky" top={0} zIndex={1}>
              <Tr>
                <Th h="40px" color="white" fontSize="xs">
                  Id
                </Th>
                <Th h="40px" color="white" fontSize="xs">
                  Item Code
                </Th>
                <Th h="40px" color="white" fontSize="xs">
                  Item Description
                </Th>
                <Th h="40px" color="white" fontSize="xs">
                  Uom
                </Th>
                <Th h="40px" color="white" fontSize="xs">
                  Borrowed Qty
                </Th>
                <Th h="40px" color="white" fontSize="xs">
                  Return Qty
                </Th>
                <Th h="40px" color="white" fontSize="xs">
                  Consumed Qty
                </Th>
                <Th h="40px" color="white" fontSize="xs">
                  Unit Cost
                </Th>
                <Th h="40px" color="white" fontSize="xs">
                  Action
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {materialList?.map((item, i) => (
                <Tr key={i} cursor="pointer">
                  <Td fontSize="xs">{item.id}</Td>
                  <Td fontSize="xs">{item.itemCode}</Td>
                  <Td fontSize="xs">{item.itemDescription}</Td>
                  <Td fontSize="xs">{item.uom}</Td>
                  <Td fontSize="xs">
                    {item.borrowedQuantity.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Td>
                  <Td fontSize="xs">
                    {item.remainingQuantity.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Td>
                  <Td fontSize="xs">
                    {item.consumedQuantity.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Td>
                  <Td fontSize="xs">
                    {item.unitCost.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Td>
                  <Td fontSize="xs" mr={3}>
                    <Flex pl={2}>
                      <Box>
                        <Menu>
                          <MenuButton
                            alignItems="center"
                            justifyContent="center"
                            bg="none"
                          >
                            <AiOutlineMore fontSize="20px" />
                          </MenuButton>
                          <MenuList>
                            {item.consumedQuantity === 0 ? (
                              <MenuItem
                                isDisabled
                                icon={<GrView fontSize="17px" />}
                                onClick={() => materialListIdHandler(item.id)}
                              >
                                <Text fontSize="15px">View</Text>
                              </MenuItem>
                            ) : (
                              <MenuItem
                                icon={<GrView fontSize="17px" />}
                                onClick={() => materialListIdHandler(item.id)}
                              >
                                <Text fontSize="15px">View</Text>
                              </MenuItem>
                            )}

                            {item.borrowedQuantity === item.consumedQuantity ? (
                              <MenuItem
                                isDisabled
                                icon={<BiDownload fontSize="17px" />}
                                onClick={() => rowHandler(item)}
                              >
                                <Text fontSize="15px" _hover={{ color: "red" }}>
                                  Consume
                                </Text>
                              </MenuItem>
                            ) : (
                              <MenuItem
                                icon={<BiDownload fontSize="17px" />}
                                onClick={() => rowHandler(item)}
                              >
                                <Text fontSize="15px" _hover={{ color: "red" }}>
                                  Consume
                                </Text>
                              </MenuItem>
                            )}
                          </MenuList>
                        </Menu>
                      </Box>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageScroll>
      </Flex>
      <Flex justifyContent="end" mt={2} mr={2}>
        <HStack>
          <Button
            colorScheme="blue"
            size="sm"
            fontSize="xs"
            onClick={() => submitConsumeHandler(borrowedId)}
          >
            Submit
          </Button>
          <Button
            colorScheme="red"
            size="sm"
            fontSize="xs"
            onClick={() => cancelAllConsumed(borrowedId)}
          >
            Cancel
          </Button>
        </HStack>
      </Flex>
      {isReturn && (
        <ReturnRequest
          isOpen={isReturn}
          onClose={closeReturn}
          materialListId={materialListId}
        />
      )}
    </Flex>
  );
};
