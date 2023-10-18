import React, { useEffect, useState } from "react";
import { ToastComponent } from "../../../components/Toast";
import {
  Button,
  Flex,
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
} from "@chakra-ui/react";
import request from "../../../services/ApiClient";

const CancelModal = ({ isOpen, onClose, getAvailablePOHandler, poId }) => {
  const [reasons, setReasons] = useState([]);
  const [reasonData, setReasonData] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  //FETCH REASON API
  const fetchReasonApi = async () => {
    try {
      const res = await request.get("Reason/GetAllActiveReasons");
      setReasons(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    try {
      fetchReasonApi();
    } catch (error) {}
  }, []);

  //REASON HANDLER
  const reasonHandler = (data) => {
    if (data) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
    setReasonData(data);
  };

  //SUBMIT HANDLER
  const submitCancellationHandler = () => {
    const submitData = {
      id: poId,
      reason: reasonData,
    };

    try {
      setIsLoading(true);
      const res = request
        .put(`Warehouse/CancelPO`, submitData)
        .then((res) => {
          ToastComponent("Success!", "PO Cancelled", "success", toast);
          getAvailablePOHandler();
          // fetchNotification()
          onClose();
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          ToastComponent("Error", err.response.data, "error", toast);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Flex>
      <Modal size="xl" isOpen={isOpen} onClose={() => {}} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="primary" color="white">
            <Flex justifyContent="left">
              <Text fontSize="sm">Cancel Materials</Text>
            </Flex>
          </ModalHeader>

          <ModalCloseButton onClick={onClose} color="white" />

          <ModalBody>
            <Flex justifyContent="center" p={2} flexDirection="column">
              <Text fontSize="sm">
                Are you sure to cancel this materials?
              </Text>
              {reasons.length > 0 ? (
                <Select
                fontSize="xs"
                  onChange={(e) => reasonHandler(e.target.value)}
                  placeholder="Select Reason"
                >
                  {reasons.map((reason) => (
                    <option key={reason.id} value={reason.reasonName}>
                      {reason.reasonName}
                    </option>
                  ))}
                </Select>
              ) : (
                "loading"
              )}
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Flex justifyContent="end" gap={2}>
              <Button
                colorScheme="blue"
                isDisabled={isDisabled}
                onClick={() => submitCancellationHandler()}
              >
                Yes
              </Button>
              <Button onClick={onClose} variant="outline">No</Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default CancelModal;
