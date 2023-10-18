import React, { useState, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Flex,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  toast,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { BsFillQuestionOctagonFill } from "react-icons/bs";
import request from "../../../services/ApiClient";
import { ToastComponent } from "../../../components/Toast";
import { decodeUser } from "../../../services/decode-user";
import { BsQuestionOctagonFill } from "react-icons/bs";
import swal from "sweetalert";
import DateConverter from "../../../components/DateConverter";
import Swal from "sweetalert2";
import moment from "moment";

const currentUser = decodeUser();

// SCHEDULE OF ORDERS
export const ScheduleModal = ({
  isOpen,
  onClose,
  checkedItems,
  setCheckedItems,
  customerName,
  fetchOrders,
  setCurrentPage,
  currentPage,
}) => {
  const [preparationDate, setPreparationDate] = useState();
  const date = new Date();
  const maxDate = moment(new Date(date.setMonth(date.getMonth() + 6))).format(
    "yyyy-MM-DD"
  );
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = decodeUser();
  const toast = useToast();

  const dateProvider = (date) => {
    console.log(date);
    if (date) {
      setPreparationDate(date);
    } else {
      setPreparationDate("");
    }
  };
  // SCHEDULE BUTTON FUNCTION
  const submitValidate = () => {
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to schedule these (1) orders?",
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
        const submitArray = checkedItems?.map((item) => {
          console.log(item);
          return {
            id: item,
            preparedDate: preparationDate,
            preparedBy: currentUser.userName,
          };
        });
        console.log(submitArray);
        setIsLoading(true);
        try {
          const res = request
            .put(`Ordering/SchedulePreparedOrderedDate`, submitArray)
            .then((res) => {
              ToastComponent(
                "Success",
                "Orders were successfully scheduled",
                "success",
                toast
              );
              // fetchNotification()
              // closeSchedule();
              setCurrentPage(currentPage);
              setCheckedItems([]);
              fetchOrders();
              setIsLoading(false);
              onClose();
            })
            .catch((err) => {
              console.log(err);
              ToastComponent("Error", "Schedule failed", "error", toast);
              setIsLoading(false);
            });
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="primary" color="white">
          <Flex justifyContent="left">
            <Text fontSize="15px">Schedule Order</Text>
          </Flex>
        </ModalHeader>

        <ModalBody>
          <VStack textAlign="start">
            <HStack spacing={4} w="full" justifyContent="center">
              <Text w="38%" pl={2} fontSize="sm">
                Customer:
              </Text>
              <Text
                w="97%"
                pl={2}
                py={2}
                bgColor="gray.200"
                border="1px"
                color="fontColor"
                fontSize="sm"
              >
                {customerName && customerName}
              </Text>
            </HStack>
            <HStack spacing={4} w="full" justifyContent="center">
              <Text w="40%" pl={2} fontSize="sm">
                Preparation Date:
              </Text>
              <Input
                borderRadius="none"
                bg="#E2E8F0"
                color="fontColor"
                fontSize="sm"
                type="date"
                onChange={(date) => dateProvider(date.target.value)}
                min={moment(new Date()).format("yyyy-MM-DD")}
                max={maxDate}
              />
            </HStack>
          </VStack>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <ButtonGroup size="xs" mt={8}>
            <Button
              borderRadius="none"
              px={5}
              colorScheme="blue"
              disabled={!preparationDate}
              onClick={submitValidate}
            >
              Yes
            </Button>
            <Button colorScheme="red" borderRadius="none" onClick={onClose}>
              Cancel
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const EditModal = ({
  isOpen,
  onClose,
  editData,
  setCurrentPage,
  currentPage,
  fetchOrders,
}) => {
  const [quantitySubmit, setQuantitySubmit] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const quantityHandler = (data, editData) => {
    if (data) {
      setQuantitySubmit(parseFloat(data));
      // ToastComponent(
      //   "Error",
      //   "Quantity cannot be exceed actual quantity!",
      //   "error",
      //   toast
      // );
      console.log(quantitySubmit);
    } else {
      setQuantitySubmit("");
    }
  };

  const submitHandler = () => {
    setIsLoading(true);
    try {
      const res = request
        .put(`Ordering/EditOrderQuantity`, {
          id: editData.transactId,
          quantityOrdered: quantitySubmit,
        })
        .then((res) => {
          ToastComponent("Success", "Order has been edited!", "success", toast);
          onClose();
          fetchOrders();
          setCurrentPage(currentPage);
        })
        .catch((err) => {
          ToastComponent("Error", err.response.data, "error", toast);
          setIsLoading(false);
        });
    } catch (error) {}
  };

  const titles = [
    "Customer",
    "Item Code",
    "Item Description",
    "UOM",
    "Quantity Order",
    "Edit Quantity",
  ];
  const autofilled = [
    editData?.customerName,
    editData?.itemCode,
    editData?.itemDescription,
    editData?.uom,
    editData?.quantity,
    // editData?.standardQuantity,
  ];

  // console.log(editData.standardQuantity);

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} isCentered size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="black">
            <Flex justifyContent="left">
              <Text fontSize="15px">Edit Order</Text>
            </Flex>
          </ModalHeader>

          <ModalBody>
            {/* <PageScrollReusable minHeight='50px' maxHeight='350px'> */}
            <Text textAlign="center" mb={7} fontSize="sm">
              Are you sure you want to edit this order?
            </Text>
            <HStack justifyContent="center" textAlign="start">
              <VStack spacing={4}>
                {titles.map((title) => (
                  <Text w="full" pl={2} key={title} fontSize="xs">
                    {title}
                  </Text>
                ))}
              </VStack>
              <VStack spacing={3.5}>
                {autofilled.map((items) => (
                  <Text
                    w="70%"
                    pl={2}
                    bgColor="gray.200"
                    border="1px"
                    key={items}
                    color="fontColor"
                    fontSize="xs"
                  >
                    {items}
                  </Text>
                ))}
                <Input
                  borderRadius="sm"
                  color="fontColor"
                  fontSize="sm"
                  onChange={(e) => quantityHandler(e.target.value)}
                  value={quantitySubmit}
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  onKeyDown={(e) =>
                    ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()
                  }
                  onPaste={(e) => e.preventDefault()}
                  w="72%"
                  pl={2}
                  h={7}
                  bgColor="#fff8dc"
                  border="1px"
                />
              </VStack>
            </HStack>
            {/* </PageScrollReusable> */}
          </ModalBody>

          <ModalFooter justifyItems="center">
            <ButtonGroup size="xs" mt={5}>
              <Button
                px={4}
                onClick={submitHandler}
                isLoading={isLoading}
                disabled={
                  !quantitySubmit ||
                  isLoading ||
                  quantitySubmit > editData.standardQuantity
                }
                colorScheme="blue"
              >
                Save
              </Button>
              <Button
                onClick={onClose}
                isLoading={isLoading}
                disabled={isLoading}
                variant="outline"
                color="black"
              >
                Cancel
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export const CancelModalConfirmation = ({
  isOpen,
  onClose,
  cancelId,
  setCurrentPage,
  currentPage,
  fetchOrders,
  orders,
}) => {
  const [cancelRemarks, setCancelRemarks] = useState("");
  const [reasons, setReasons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const fetchReasonsApi = async () => {
    const res = await request.get(`Reason/GetAllActiveReasons`);
    return res.data;
  };

  const fetchReasons = () => {
    fetchReasonsApi().then((res) => {
      setReasons(res);
    });
  };

  useEffect(() => {
    fetchReasons();

    return () => {
      setReasons([]);
    };
  }, []);

  const remarksHandler = (data) => {
    if (data) {
      setCancelRemarks(data);
    } else {
      setCancelRemarks("");
    }
  };

  const cancelHandler = () => {
    setIsLoading(true);
    try {
      const res = request
        .put(`Ordering/CancelOrders`, {
          id: cancelId,
          remarks: cancelRemarks,
          isCancelBy: currentUser.userName,
        })
        .then((res) => {
          setCurrentPage(currentPage);
          ToastComponent(
            "Success",
            "Order has been cancelled!",
            "success",
            toast
          );
          // fetchNotification()
          setIsLoading(false);
          onClose();
          fetchOrders();
        })
        .catch((err) => {
          ToastComponent("Error", "Cancel failed!", "error", toast);
          setIsLoading(false);
        });
    } catch (error) {}
  };

  return (
    <Modal isCentered size="xl" isOpen={isOpen} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="primary" color="white">
          <Flex justifyContent="left">
            <Text fontSize="15px">Cancel Order</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <ModalBody>
          <VStack justifyContent="center" mt={4} mb={7}>
            <Text>Are you sure you want to cancel this order?</Text>
            {reasons.length > 0 ? (
              <Select
                onChange={(e) => remarksHandler(e.target.value)}
                placeholder="Please select a reason"
                w="65%"
                // bgColor="#fff8dc"
              >
                {reasons?.map((item, i) => (
                  <option key={i} value={item.reasonName}>
                    {item.reasonName}
                  </option>
                ))}
              </Select>
            ) : (
              "loading"
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            onClick={() => cancelHandler()}
            disabled={!cancelRemarks}
            isLoading={isLoading}
            colorScheme="blue"
            mr={3}
            _hover={{ bgColor: "accent" }}
          >
            Yes
          </Button>
          <Button
            variant="outline"
            color="black"
            onClick={onClose}
            disabled={isLoading}
            isLoading={isLoading}
          >
            No
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
