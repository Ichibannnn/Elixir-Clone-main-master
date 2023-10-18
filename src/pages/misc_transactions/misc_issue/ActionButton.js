import React, { useState } from "react";
import { Button, ButtonGroup, Flex, useDisclosure } from "@chakra-ui/react";
import {
  AccountTitleModal,
  AllCancelConfirmation,
  SaveConfirmation,
} from "./ActionModal";
// import { AllCancelConfirmation, SaveConfirmation } from './Action-Modal'

export const ActionButton = ({
  selectorId,
  setSelectorId,
  totalQuantity,
  customerData,
  setCustomerData,
  details,
  rawMatsInfo,
  warehouseId,
  miscData,
  setTotalQuantity,
  fetchActiveMiscIssues,
  isLoading,
  setIsLoading,
  customerRef,
  setDetails,
  setRawMatsInfo,
  fetchBarcodeNo,
  remarks,
  setRemarks,
  remarksRef,
  transactionDate,
  setTransactionDate,
}) => {
  const [hideButton, setHideButton] = useState(false);

  const {
    isOpen: isSave,
    onClose: closeSave,
    onOpen: openSave,
  } = useDisclosure();
  const saveHandler = () => {
    setHideButton(true);
    openSave();
  };

  const {
    isOpen: allIsCancel,
    onClose: allCloseCancel,
    onOpen: openAllCancel,
  } = useDisclosure();
  const cancelHandler = () => {
    openAllCancel();
  };

  // Open COA Modal
  const {
    isOpen: isCoaModal,
    onClose: closeCoaModal,
    onOpen: openCoaModal,
  } = useDisclosure();
  const coaHandler = () => {
    openCoaModal();
  };

  return (
    <>
      <Flex w="full" justifyContent="end">
        <ButtonGroup size="xs">
          <Button
            onClick={saveHandler}
            disabled={miscData.length === 0 || isLoading || hideButton}
            isLoading={isLoading}
            colorScheme="blue"
            px={5}
          >
            Save
          </Button>
          <Button
            color="black"
            variant="outline"
            px={3}
            onClick={cancelHandler}
          >
            Cancel All
          </Button>
        </ButtonGroup>
      </Flex>

      {/* 
      {isCoaModal && (
        <AccountTitleModal
          isOpen={isCoaModal}
          onClose={closeCoaModal}
          totalQuantity={totalQuantity}
          setTotalQuantity={setTotalQuantity}
          customerData={customerData}
          details={details}
          miscData={miscData}
          fetchActiveMiscIssues={fetchActiveMiscIssues}
          warehouseId={warehouseId}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          customerRef={customerRef}
          setDetails={setDetails}
          rawMatsInfo={rawMatsInfo}
          setRawMatsInfo={setRawMatsInfo}
          setHideButton={setHideButton}
          remarks={remarks}
          setRemarks={setRemarks}
          remarksRef={remarksRef}
        />
      )} */}

      {isSave && (
        <SaveConfirmation
          isOpen={isSave}
          onClose={closeSave}
          totalQuantity={totalQuantity}
          setTotalQuantity={setTotalQuantity}
          customerData={customerData}
          setCustomerData={setCustomerData}
          miscData={miscData}
          fetchActiveMiscIssues={fetchActiveMiscIssues}
          warehouseId={warehouseId}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          customerRef={customerRef}
          details={details}
          setDetails={setDetails}
          rawMatsInfo={rawMatsInfo}
          setRawMatsInfo={setRawMatsInfo}
          setHideButton={setHideButton}
          remarks={remarks}
          setRemarks={setRemarks}
          remarksRef={remarksRef}
          transactionDate={transactionDate}
          setTransactionDate={setTransactionDate}
        />
      )}

      {allIsCancel && (
        <AllCancelConfirmation
          isOpen={allIsCancel}
          onClose={allCloseCancel}
          miscData={miscData}
          setSelectorId={setSelectorId}
          fetchActiveMiscIssues={fetchActiveMiscIssues}
          setHideButton={setHideButton}
          fetchBarcodeNo={fetchBarcodeNo}
        />
      )}
    </>
  );
};
