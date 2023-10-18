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
import { RiFileList3Fill } from "react-icons/ri";
import { TiWarning } from "react-icons/ti";
import Swal from "sweetalert2";
import request from "../../../services/ApiClient";
import { ToastComponent } from "../../../components/Toast";
import PageScroll from "../../../utils/PageScroll";
import { decodeUser } from "../../../services/decode-user";
import PageScrollModalErrorList from "../../../components/PageScrollModalErrorList";
import PageScrollImportModal from "../../../components/PageScrollImportModal";

export const ErrorListUsers = ({
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

  const available = errorData?.availableImport?.map((list) => {
    return {
      empId: list.empId,
      fullName: list.fullName,
      department: list.department,
      userRoleName: list.userRoleName,
      addedBy: list.addedBy,
    };
  });

  //   const departmentNull = errorData?.departmentNULL?.map((list) => {
  //     return {
  //       empId: list.empId,
  //       fullName: list.fullName,
  //       department: list.department,
  //       userRoleName: list.userRoleName,
  //     };
  //   });

  const duplicate = errorData?.duplicateList?.map((list) => {
    return {
      empId: list.empId,
      fullName: list.fullName,
      department: list.department,
      userRoleName: list.userRoleName,
    };
  });

  //   const empIdNull = errorData?.empIdNULL?.map((list) => {
  //     return {
  //       empId: list.empId,
  //       fullName: list.fullName,
  //       department: list.department,
  //       userRoleName: list.userRoleName,
  //     };
  //   });

  const fullNameIncomplete = errorData?.fullNameIncomplete?.map((list) => {
    return {
      empId: list.empId,
      fullName: list.fullName,
      department: list.department,
      userRoleName: list.userRoleName,
    };
  });

  //   const fullNameNull = errorData?.fullNameNULL?.map((list) => {
  //     return {
  //       empId: list.empId,
  //       fullName: list.fullName,
  //       department: list.department,
  //       userRoleName: list.userRoleName,
  //     };
  //   });

  const userRoleNotExist = errorData?.userRoleNotExist?.map((list) => {
    return {
      empId: list.empId,
      fullName: list.fullName,
      department: list.department,
      userRoleName: list.userRoleName,
    };
  });

  const submitAvailableUsersHandler = () => {
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to import this users list?",
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
              .post("User/AddNewUsersImport", available)
              .then((res) => {
                onClose();
                ToastComponent("Success!", "Users Imported", "success", toast);
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
              "Wrong excel format imported for Users",
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
                                Employee Id
                              </Th>
                              <Th color="white" fontSize="9px">
                                Full Name
                              </Th>
                              <Th color="white" fontSize="9px">
                                Department
                              </Th>
                              <Th color="white" fontSize="9px">
                                User Role
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
                                  {d?.empId}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.fullName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.department}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.userRoleName}
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
                          onClick={() => submitAvailableUsersHandler()}
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
                        Duplicated Lists
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
                              <Th color="white" fontSize="9px">
                                Line
                              </Th>
                              <Th color="white" fontSize="9px">
                                Employee Id
                              </Th>
                              <Th color="white" fontSize="9px">
                                Full Name
                              </Th>
                              <Th color="white" fontSize="9px">
                                Department
                              </Th>
                              <Th color="white" fontSize="9px">
                                User Role
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
                                  {d?.empId}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.fullName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.department}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.userRoleName}
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

              {/* Duplicated ---------------*/}
              {userRoleNotExist?.length > 0 ? (
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
                        User Role not Exist
                        <Badge fontSize="10px" color="red">
                          {userRoleNotExist?.length}
                        </Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollModalErrorList>
                      {userRoleNotExist?.length > 0 ? (
                        <Table variant="striped" size="sm" bg="white">
                          <Thead bgColor="gray.600">
                            <Tr>
                              <Th color="white" fontSize="9px">
                                Line
                              </Th>
                              <Th color="white" fontSize="9px">
                                Employee Id
                              </Th>
                              <Th color="white" fontSize="9px">
                                Full Name
                              </Th>
                              <Th color="white" fontSize="9px">
                                Department
                              </Th>
                              <Th color="white" fontSize="9px">
                                User Role
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {userRoleNotExist?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.empId}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.fullName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.department}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.userRoleName}
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
                              There are no user role lists on this file
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

              {/* Fullname incomplete ---------------*/}
              {fullNameIncomplete?.length > 0 ? (
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
                        Full Name is incomplete
                        <Badge fontSize="10px" color="red">
                          {fullNameIncomplete?.length}
                        </Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollModalErrorList>
                      {fullNameIncomplete?.length > 0 ? (
                        <Table variant="striped" size="sm" bg="white">
                          <Thead bgColor="gray.600">
                            <Tr>
                              <Th color="white" fontSize="9px">
                                Line
                              </Th>
                              <Th color="white" fontSize="9px">
                                Employee Id
                              </Th>
                              <Th color="white" fontSize="9px">
                                Full Name
                              </Th>
                              <Th color="white" fontSize="9px">
                                Department
                              </Th>
                              <Th color="white" fontSize="9px">
                                User Role
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {fullNameIncomplete?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.empId}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.fullName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.department}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.userRoleName}
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
                              There are no full name lists on this file
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
                Disclaimer: There were no users imported.
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
