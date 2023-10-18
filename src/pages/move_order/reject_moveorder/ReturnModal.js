import React, { useState, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { BsQuestionOctagonFill } from "react-icons/bs";
import request from "../../../services/ApiClient";
import { ToastComponent } from "../../../components/Toast";
import { decodeUser } from "../../../services/decode-user";

const ReturnModal = ({ isOpen, onClose, orderNo, fetchRejectedMO }) => {
  const [reasonSubmit, setReasonSubmit] = useState("");

  const [reasons, setReasons] = useState([]);

  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

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

  const submitHandler = () => {
    setIsLoading(true);
    try {
      const res = request
        .put(`Ordering/ReturnMoveOrderForApproval`, {
          orderNo: orderNo,
          remarks: reasonSubmit,
        })
        .then((res) => {
          ToastComponent(
            "Success",
            "Move order has been returned",
            "success",
            toast
          );
          // fetchNotification()
          fetchRejectedMO();
          setIsLoading(false);
          onClose();
        })
        .catch((err) => {
          ToastComponent(
            "Error",
            "Move order was not rejected",
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
        <ModalHeader bg="primary" color="white">
          <Flex justifyContent="left">
            <Text fontSize="14px">Return Materials</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody>
          <VStack justifyContent="center">
            <Text fontSize="sm">
              Are you sure you want to return this move order?
            </Text>
            {reasons?.length > 0 ? (
              <Select
                fontSize="xs"
                onChange={(e) => setReasonSubmit(e.target.value)}
                w="70%"
                placeholder="Please select a reason"
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

export default ReturnModal;
