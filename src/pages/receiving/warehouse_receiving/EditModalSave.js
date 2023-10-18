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
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useRef, useState } from "react";
import request from "../../../services/ApiClient";
import { ReceivingContext } from "../../../components/context/ReceivingContext";
import { ToastComponent } from "../../../components/Toast";
import PrintBarcode from "./PrintBarcode";
import { useReactToPrint } from "react-to-print";
import Barcode from "react-barcode";
import moment from "moment";

const EditModalSave = ({
  sumQuantity,
  submitDataOne,
  submitDataTwo,
  submitDataThree,
  expectedDelivery,
  actualDelivered,
  siNumber,
  isSubmitDisabled,
  getAvailablePOHandler,
  closeModal,
  receivingDate,
  setReceivingDate,
  actualGood,
  setCode,
  editData,
  disableQuantity,
  lotSection,
  quantity,
  // setReceivingId,
  receivingId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const { setReceivingId } = useContext(ReceivingContext);
  const firstSubmit = { ...submitDataOne, ...submitDataThree };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isPrintModalOpen,
    onOpen: openPrintModal,
    onClose: closePrintModal,
  } = useDisclosure();

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const submitEditedHandler = () => {
    console.log(firstSubmit);
    // console.log(secondSubmit);
    try {
      setIsLoading(true);
      const res = request
        .put(`Warehouse/ReceiveRawMaterialsById`, firstSubmit)
        .then((res) => {
          ToastComponent(
            "Success!",
            "Purchase order updated.",
            "success",
            toast
          );
          setReceivingId(res.data.id);
          setReceivingDate(receivingDate);
          setIsLoading(false);
          getAvailablePOHandler();
          // fetchNotification()
          handlePrint();
          openPrintModal();
          onClose();
          // closeModal();

          // take generated id
          const receivingIdWithoutUseContext = res.data.id;

          // final array data for second put
          const secondSubmit = submitDataTwo.map((data) => {
            return {
              pO_ReceivingId: receivingIdWithoutUseContext,
              quantity: data.quantity,
              remarks: data.remarksName,
            };
          });

          if (sumQuantity > 0) {
            console.log(secondSubmit);
            try {
              const res = request.put(
                `Warehouse/ReceiveRawMaterialsById`,
                secondSubmit
              );
            } catch (err) {
              console.log(err);
            }

            // proceed to first put error catch if condition for second put is not met
          }
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
      <Button
        colorScheme="blue"
        onClick={onOpen}
        disabled={
          isSubmitDisabled ||
          !expectedDelivery ||
          !actualDelivered ||
          !siNumber ||
          !receivingDate ||
          !lotSection ||
          disableQuantity < 0 ||
          quantity
        }
        title={
          isSubmitDisabled || !expectedDelivery || !actualDelivered || !siNumber
            ? "Please provide required fields"
            : ""
        }
      >
        Receive
      </Button>

      <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
        <ModalOverlay />
        <ModalContent color="white" justifyContent="center">
          <ModalHeader fontSize="17px" bg="primary">
            <Flex justifyContent="center">
              <Text>Confirmation</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <ModalBody>
            <Flex justifyContent="center">
              <Text color="#000">Are you sure you want to do this action?</Text>
            </Flex>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <ButtonGroup size="md">
              <Button
                size="sm"
                colorScheme="blue"
                isLoading={isLoading}
                onClick={() => submitEditedHandler()}
              >
                Yes
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onClose}
                color="black"
              >
                No
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {isPrintModalOpen && (
        <PrintBarcode
          printData={editData}
          receivingDate={receivingDate}
          lotSection={lotSection}
          actualGood={actualGood}
          sumQuantity={sumQuantity}
          setCode={setCode}
          isOpen={isPrintModalOpen}
          onClose={closePrintModal}
          actualDelivered={actualDelivered}
          closeModal={closeModal}
          receivingId={receivingId}
          siNumber={siNumber}
        />
      )}
    </Flex>
  );
};

export default EditModalSave;
