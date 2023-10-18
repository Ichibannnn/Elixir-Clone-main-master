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
  Select,
} from "@chakra-ui/react";
import request from "../../../../services/ApiClient";
import PageScroll from "../../../../utils/PageScroll";
import moment from "moment";
import Swal from "sweetalert2";
import { ToastComponent } from "../../../../components/Toast";
import { decodeUser } from "../../../../services/decode-user";

const currentUser = decodeUser();

export const ViewModalApproval = ({
  isOpen,
  onClose,
  statusBody,
  fetchBorrowed,
  setIsLoading,
}) => {
  const [borrowedDetailsData, setBorrowedDetailsData] = useState([]);
  const toast = useToast();

  console.log(statusBody);

  const idparams = statusBody?.id;
  const fetchBorrowedDetailsApi = async (idparams) => {
    const res = await request.get(
      `Borrowed/GetAllForApprovalDetailsInBorrowed?id=${idparams}`
    );
    return res.data;
  };

  const fetchBorrowedDetails = () => {
    fetchBorrowedDetailsApi(idparams).then((res) => {
      setBorrowedDetailsData(res);
    });
  };
  //   console.log(borrowedDetailsData);

  useEffect(() => {
    fetchBorrowedDetails();
  }, [idparams]);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="5xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="primary">
          <Flex justifyContent="left">
            <Text fontSize="xs" color="white">
              Borrowed Approval Details
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
                  Transaction Date:
                </Text>
                <Text fontSize="xs">
                  {" "}
                  {moment(borrowedDetailsData[0]?.preparedDate).format(
                    "MM/DD/yyyy"
                  )}
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
            </VStack>

            <VStack alignItems="start" spacing={-1}>
              {/* <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Company:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.companyCode} -{" "}
                  {borrowedDetailsData[0]?.companyName}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Department:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.departmentCode} -{" "}
                  {borrowedDetailsData[0]?.departmentName}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Location:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.locationCode} -{" "}
                  {borrowedDetailsData[0]?.locationName}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Account Title:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.accountCode} -{" "}
                  {borrowedDetailsData[0]?.accountTitles}
                </Text>
              </HStack> */}
            </VStack>
          </Flex>

          <VStack justifyContent="center">
            <PageScroll minHeight="320px" maxHeight="321px">
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
                      UOM
                    </Th>
                    <Th color="white" fontSize="xs">
                      Borrowed Qty
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {borrowedDetailsData?.map((borrowdetails, i) => (
                    <Tr key={i}>
                      <Td fontSize="xs">{borrowdetails.id}</Td>
                      <Td fontSize="xs">{borrowdetails.itemCode}</Td>
                      <Td fontSize="xs">{borrowdetails.itemDescription}</Td>
                      <Td fontSize="xs">{borrowdetails.uom}</Td>
                      <Td fontSize="xs">
                        {borrowdetails.quantity.toLocaleString(undefined, {
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
            <Button colorScheme="gray" onClick={onClose}>
              Close
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>

      {/* {isEdit && (
        <EditModal
          isOpen={isEdit}
          onClose={closeEdit}
          editData={editData}
          fetchBorrowedDetails={fetchBorrowedDetails}
        />
      )} */}
    </Modal>
  );
};

export const RejectModalApproval = ({
  isOpen,
  onClose,
  fetchBorrowed,
  statusBody,
  setIsLoading,
  isLoading,
  fetchNotification,
}) => {
  const [reasonSubmit, setReasonSubmit] = useState("");
  const [reasons, setReasons] = useState([]);
  const toast = useToast();

  const fetchReasonApi = async () => {
    const res = await request.get(`Reason/GetAllActiveReasons`);
    return res.data;
  };

  const fetchReasons = () => {
    fetchReasonApi().then((res) => {
      setReasons(res);
    });
  };

  useEffect(() => {
    fetchReasons();

    return () => {
      setReasons([]);
    };
  }, []);

  const id = statusBody?.id;

  const submitHandler = () => {
    setIsLoading(true);
    try {
      const res = request
        .put(`Borrowed/RejectForBorrowed`, [
          {
            id: id,
            reason: reasonSubmit,
            rejectBy: currentUser?.fullName,
          },
        ])
        .then((res) => {
          ToastComponent(
            "Success",
            "Borrowed Materials has been rejected",
            "success",
            toast
          );
          fetchNotification();
          fetchBorrowed();
          setIsLoading(false);
          onClose();
        })
        .catch((err) => {
          ToastComponent(
            "Error",
            "Borrowed materials was not rejected",
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
            <Text>
              Are you sure you want to reject this borrowed materials?
            </Text>
            {reasons?.length > 0 ? (
              <Select
                onChange={(e) => setReasonSubmit(e.target.value)}
                w="70%"
                placeholder="Please select a reason"
                bg="#fff8dc"
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

export const ApproveModal = ({
  isOpen,
  onClose,
  fetchBorrowed,
  statusBody,
  isLoading,
  setIsLoading,
  fetchNotification,
}) => {
  const toast = useToast();
  const id = statusBody?.id;

  const submitHandler = () => {
    setIsLoading(true);
    try {
      const res = request
        .put(`Borrowed/ApprovedForBorrowed`, [
          { id: id, approveBy: currentUser?.fullName },
        ])
        .then((res) => {
          ToastComponent(
            "Success",
            "Borrowed materials has been approved",
            "success",
            toast
          );
          fetchNotification();
          fetchBorrowed();
          setIsLoading(false);
          onClose();
        })
        .catch((item) => {
          ToastComponent(
            "Error",
            "Borrowed materials was not approved",
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
              <Text>
                Are you sure you want to approve this borrowed materials?
              </Text>
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
    </>
  );
};
