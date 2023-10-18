import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
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
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import request from "../../../services/ApiClient";
import { AddConfirmation } from "./ActionModal";

export const MaterialsInformation = ({
  rawMatsInfo,
  setRawMatsInfo,
  details,
  setDetails,
  customerRef,
  transactions,
  customers,
  rawMats,
  uoms,
  barcodeNo,
  setSelectorId,
  setWarehouseId,
  warehouseId,
  fetchActiveMiscIssues,
  customerData,
  setCustomerData,
  remarks,
  setRemarks,
  remarksRef,
  transactionDate,
  setTransactionDate,
  unitCost,
  setUnitCost,
}) => {
  const {
    isOpen: isModal,
    onClose: closeModal,
    onOpen: openModal,
  } = useDisclosure();

  // console.log(transactionDate);

  const detailHandler = (data) => {
    if (data) {
      setDetails(data);
    } else {
      setDetails("");
    }

    console.log(details);
  };

  // console.log(transactionDate);

  const customerHandler = (data) => {
    if (data) {
      const newData = JSON.parse(data);
      const customerCode = newData.customerCode;
      const customerName = newData.customerName;
      setRawMatsInfo({
        itemCode: rawMatsInfo.itemCode,
        itemDescription: rawMatsInfo.itemDescription,
        customerName: customerName,
        uom: rawMatsInfo.uom,
        warehouseId: rawMatsInfo.warehouseId,
        quantity: rawMatsInfo.quantity,
        unitCost: rawMatsInfo.unitCost,
      });
      setCustomerData({
        customerCode: customerCode,
        customerName: customerName,
      });
    } else {
      setRawMatsInfo({
        itemCode: rawMatsInfo.itemCode,
        itemDescription: rawMatsInfo.itemDescription,
        customerName: "",
        uom: rawMatsInfo.uom,
        warehouseId: rawMatsInfo.warehouseId,
        quantity: rawMatsInfo.quantity,
        unitCost: rawMatsInfo.unitCost,
      });
      setCustomerData({
        customerCode: "",
        customerName: "",
      });
    }
  };

  return (
    <Flex justifyContent="center" flexDirection="column" w="full">
      <VStack w="full" spacing={6}>
        <Box bgColor="primary" w="full" pl={2} h="30px" alignItems="center">
          <Text color="white" textAlign="center">
            Materials Information
          </Text>
        </Box>
        <Flex w="95%" justifyContent="space-between">
          <VStack alignItems="start" w="40%" mx={5}>
            {/* Customer Code */}
            <HStack w="full">
              <Text
                minW="50%"
                w="auto"
                bgColor="secondary"
                color="white"
                pl={2}
                py={2.5}
                fontSize="xs"
              >
                Customer Code:{" "}
              </Text>
              {customers.length > 0 ? (
                <Select
                  fontSize="xs"
                  onChange={(e) => customerHandler(e.target.value)}
                  placeholder="Select Customer Code"
                  ref={customerRef}
                  w="full"
                  bgColor="#fff8dc"
                >
                  {customers?.map((item, i) => (
                    <option
                      key={i}
                      value={JSON.stringify(item)}
                    >{`${item.customerCode} - ${item.customerName}`}</option>
                  ))}
                </Select>
              ) : (
                <Spinner />
              )}
            </HStack>

            {/* Remarks New (Transaction Type) */}
            <HStack w="full">
              <Text
                minW="50%"
                w="auto"
                bgColor="secondary"
                color="white"
                pl={2}
                py={2.5}
                fontSize="xs"
              >
                Transaction Type:{" "}
              </Text>
              {transactions?.length > 0 ? (
                <Select
                  fontSize="xs"
                  onChange={(e) => setRemarks(e.target.value)}
                  ref={remarksRef}
                  w="full"
                  placeholder="Select Transaction Type"
                  bgColor="#fff8dc"
                >
                  {transactions?.map((tt) => (
                    <option key={tt.id} value={tt.transactionName}>
                      {tt.transactionName}
                    </option>
                  ))}
                </Select>
              ) : (
                <Spinner />
              )}
            </HStack>

            {/* Remarks */}
            {/* <HStack w="full">
              <Text
                minW="50%"
                w="auto"
                bgColor="secondary"
                color="white"
                pl={2}
                py={2.5}
                fontSize="xs"
              >
                Transaction Type:{" "}
              </Text>

              <Select
                fontSize="xs"
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Select Transact Type"
                bgColor="#fff8dc"
              >
                <option value="Adjustment">Adjustment</option>
                <option value="Transfer">Transfer</option>
                <option value="Deal Item">Deal Item</option>
              </Select>
            </HStack> */}
          </VStack>

          <VStack alignItems="start" w="40%" mx={5}>
            {/* Customer Name */}
            <HStack w="full">
              <Text
                minW="50%"
                w="auto"
                bgColor="secondary"
                color="white"
                pl={2}
                pr={10}
                py={2.5}
                fontSize="xs"
              >
                Customer Name:{" "}
              </Text>
              <Text
                fontSize="xs"
                pl={2}
                w="full"
                border="1px"
                bg="gray.300"
                borderColor="gray.200"
                py={1.5}
              >
                {customerData.customerName
                  ? customerData.customerName
                  : "Please select a customer code"}
              </Text>
            </HStack>

            {/* Transaction Date */}
            <HStack w="full">
              <Text
                minW="50%"
                w="auto"
                bgColor="secondary"
                color="white"
                pl={2}
                pr={10}
                py={2.5}
                fontSize="xs"
              >
                Transaction Date:{" "}
              </Text>
              <Input
                type="date"
                fontSize="xs"
                onChange={(e) => setTransactionDate(e.target.value)}
                // ref={transDate}
                value={transactionDate}
                pl={2}
                w="full"
                border="1px"
                // defaultValue={moment(new Date()).format("yyyy-MM-DD")}
                max={moment(new Date()).format("yyyy-MM-DD")}
                bgColor="#fff8dc"
                py={1.5}
              />
            </HStack>
          </VStack>
        </Flex>
        <VStack alignItems="start" w="92%" mx={5}>
          {/* Details */}
          <HStack w="full">
            <Text
              w="auto"
              bgColor="secondary"
              color="white"
              pl={2}
              pr={5}
              py={2.5}
              fontSize="xs"
            >
              Details:{" "}
            </Text>
            <Input
              fontSize="xs"
              onChange={(e) => detailHandler(e.target.value)}
              value={details}
              minW="93%"
              w="auto"
              bgColor="#fff8dc"
            />
          </HStack>
        </VStack>
        <Flex w="full" justifyContent="end" mt={4} p={2}>
          <Button
            onClick={() => openModal()}
            disabled={
              !rawMatsInfo.customerName ||
              !details ||
              !remarks ||
              !transactionDate
            }
            size="sm"
            colorScheme="blue"
          >
            New
          </Button>
        </Flex>
      </VStack>

      {isModal && (
        <RawMatsInfoModal
          rawMatsInfo={rawMatsInfo}
          setRawMatsInfo={setRawMatsInfo}
          details={details}
          setDetails={setDetails}
          customerRef={customerRef}
          rawMats={rawMats}
          uoms={uoms}
          barcodeNo={barcodeNo}
          setSelectorId={setSelectorId}
          warehouseId={warehouseId}
          setWarehouseId={setWarehouseId}
          fetchActiveMiscIssues={fetchActiveMiscIssues}
          customerData={customerData}
          setCustomerData={setCustomerData}
          isOpen={isModal}
          onClose={closeModal}
          remarks={remarks}
          setRemarks={setRemarks}
          transactionDate={transactionDate}
          setTransactionDate={setTransactionDate}
          unitCost={unitCost}
          setUnitCost={setUnitCost}
        />
      )}
    </Flex>
  );
};

export const RawMatsInfoModal = ({
  isOpen,
  onClose,
  transactionDate,
  setTransactionDate,
  details,
  setDetails,
  remarks,
  setRemarks,
  rawMatsInfo,
  setRawMatsInfo,
  customerRef,
  rawMats,
  barcodeNo,
  setSelectorId,
  setCustomerData,
  setWarehouseId,
  warehouseId,
  fetchActiveMiscIssues,
  customerData,
  unitCost,
  setUnitCost,
}) => {
  const [availableStock, setAvailableStock] = useState("");

  const { isOpen: isAdd, onClose: closeAdd, onOpen: openAdd } = useDisclosure();
  const openAddConfirmation = () => {
    openAdd();
  };

  const itemCodeHandler = (data) => {
    if (data) {
      const newData = JSON.parse(data);
      const itemCode = newData.itemCode;
      const itemDescription = newData.itemDescription;
      const uom = newData.uom;
      // const expirationDate = newData.expirationDate
      setRawMatsInfo({
        itemCode: itemCode,
        itemDescription: itemDescription,
        customerName: rawMatsInfo.customerName,
        uom: uom,
        // expirationDate: expirationDate
        warehouseId: rawMatsInfo.warehouseId,
        quantity: rawMatsInfo.quantity,
        // unitCost: rawMatsInfo.unitCost,
      });
    } else {
      setRawMatsInfo({
        itemCode: "",
        itemDescription: "",
        customerName: rawMatsInfo.customerName,
        uom: "",
        // expirationDate: ''
        warehouseId: rawMatsInfo.warehouseId,
        quantity: rawMatsInfo.quantity,
        // unitCost: rawMatsInfo.unitCost,
      });
    }
  };

  const barcodeNoHandler = (data) => {
    if (data) {
      const newData = JSON.parse(data);
      const warehouseId = newData.warehouseId;
      setAvailableStock(newData.remainingStocks);
      setUnitCost(newData.unitCost);
      setWarehouseId(warehouseId);
      setRawMatsInfo({
        itemCode: rawMatsInfo.itemCode,
        itemDescription: rawMatsInfo.itemDescription,
        customerName: rawMatsInfo.customerName,
        uom: rawMatsInfo.uom,
        warehouseId: warehouseId,
        quantity: rawMatsInfo.quantity,
        // unitCost: rawMatsInfo.unitCost,
      });
    } else {
      setAvailableStock("");
      setUnitCost("");
      setWarehouseId("");
      setRawMatsInfo({
        itemCode: rawMatsInfo.itemCode,
        itemDescription: rawMatsInfo.itemDescription,
        customerName: rawMatsInfo.customerName,
        uom: rawMatsInfo.uom,
        warehouseId: "",
        quantity: rawMatsInfo.quantity,
        // unitCost: rawMatsInfo.unitCost,
      });
    }
  };

  // console.log(barcodeNo);

  useEffect(() => {
    setAvailableStock("");
    setUnitCost("");
  }, [rawMatsInfo.itemCode]);

  const newDate = new Date();
  const minDate = moment(newDate).format("yyyy-MM-DD");

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} isCentered size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader mb={4}>
            <VStack justifyContent="center" spacing={-2}>
              <Text> Materials Information</Text>
              <Text fontSize="xs">Miscellaneous Issue</Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <ModalBody mb={5}>
            <Flex w="95%" justifyContent="space-between">
              <VStack alignItems="start" w="40%" mx={5}>
                {/* Item Code */}
                <HStack w="full">
                  <Text
                    minW="50%"
                    w="auto"
                    bgColor="secondary"
                    color="white"
                    pl={2}
                    pr={7}
                    py={2.5}
                    fontSize="xs"
                  >
                    Item Code:{" "}
                  </Text>

                  {rawMats.length > 0 ? (
                    <Select
                      fontSize="xs"
                      onChange={(e) => itemCodeHandler(e.target.value)}
                      w="full"
                      placeholder=" "
                      bgColor="#fff8dc"
                    >
                      {rawMats?.map((item, i) => (
                        <option key={i} value={JSON.stringify(item)}>
                          {item.itemCode}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <Spinner />
                  )}
                </HStack>

                {/* Barcode No */}
                <HStack w="full">
                  <Text
                    minW="50%"
                    w="auto"
                    bgColor="secondary"
                    color="white"
                    pl={2}
                    pr={7}
                    py={2.5}
                    fontSize="xs"
                  >
                    Barcode Number:{" "}
                  </Text>
                  <Select
                    fontSize="xs"
                    onChange={(e) => barcodeNoHandler(e.target.value)}
                    w="full"
                    placeholder=" "
                    bgColor="#fff8dc"
                  >
                    {barcodeNo?.map((item, i) => (
                      <option key={i} value={JSON.stringify(item)}>
                        {item.warehouseId}
                      </option>
                    ))}
                  </Select>

                  {/* {barcodeNo.length > 0 ? (
                    <Select
                      fontSize="xs"
                      onChange={(e) => barcodeNoHandler(e.target.value)}
                      w="full"
                      placeholder=" "
                      bgColor="#fff8dc"
                    >
                      {barcodeNo?.map((item, i) => (
                        <option key={i} value={JSON.stringify(item)}>
                          {item.warehouseId}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <Text color="danger" fontStyle="italic">
                      No Available Stocks
                    </Text>
                  )} */}
                </HStack>

                {/* Quantity */}
                <HStack w="full">
                  <Text
                    minW="50%"
                    w="auto"
                    bgColor="secondary"
                    color="white"
                    pl={2}
                    pr={7}
                    py={2.5}
                    fontSize="xs"
                  >
                    Quantity:{" "}
                  </Text>
                  <Input
                    fontSize="xs"
                    onChange={(e) =>
                      setRawMatsInfo({
                        itemCode: rawMatsInfo.itemCode,
                        itemDescription: rawMatsInfo.itemDescription,
                        customerName: rawMatsInfo.customerName,
                        uom: rawMatsInfo.uom,
                        warehouseId: rawMatsInfo.warehouseId,
                        quantity: Number(e.target.value),
                      })
                    }
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(e) =>
                      ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()
                    }
                    onPaste={(e) => e.preventDefault()}
                    // value={rawMatsInfo}
                    min="1"
                    w="full"
                    bgColor="#fff8dc"
                  />
                </HStack>
              </VStack>

              <VStack alignItems="start" w="40%" mx={5}>
                {/* Item Description */}
                <HStack w="full">
                  <Text
                    minW="50%"
                    w="auto"
                    bgColor="secondary"
                    color="white"
                    pl={2}
                    pr={10}
                    py={2.5}
                    fontSize="xs"
                  >
                    Item Description:{" "}
                  </Text>
                  <Text
                    textAlign="center"
                    fontSize="xs"
                    w="full"
                    bgColor="gray.200"
                    border="1px"
                    borderColor="gray.200"
                    py={1.5}
                  >
                    {rawMatsInfo.itemDescription
                      ? rawMatsInfo.itemDescription
                      : "Select an item code"}
                  </Text>
                </HStack>

                {/* UOM */}
                <HStack w="full">
                  <Text
                    minW="50%"
                    w="auto"
                    bgColor="secondary"
                    color="white"
                    pl={2}
                    pr={7}
                    py={2.5}
                    fontSize="xs"
                  >
                    UOM:{" "}
                  </Text>
                  <Text
                    textAlign="center"
                    fontSize="xs"
                    w="full"
                    bgColor="gray.200"
                    border="1px"
                    borderColor="gray.200"
                    py={1.5}
                  >
                    {rawMatsInfo.uom ? rawMatsInfo.uom : "Select an item code"}
                  </Text>
                </HStack>

                {/* Available Stocks */}
                <HStack w="full">
                  <Text
                    minW="50%"
                    w="auto"
                    bgColor="secondary"
                    color="white"
                    pl={2}
                    pr={7}
                    py={2.5}
                    fontSize="xs"
                  >
                    Available Stock:{" "}
                  </Text>
                  {barcodeNo.length === 0 ? (
                    <Text
                      textAlign="center"
                      fontSize="xs"
                      w="full"
                      bgColor="gray.200"
                      border="1px"
                      borderColor="gray.200"
                      py={1.5}
                    >
                      No Available Stock
                    </Text>
                  ) : (
                    <Text
                      textAlign="center"
                      fontSize="xs"
                      w="full"
                      bgColor="gray.200"
                      border="1px"
                      borderColor="gray.200"
                      py={1.5}
                    >
                      {availableStock ? availableStock : "Available Stocks"}
                    </Text>
                  )}
                </HStack>

                {/* Unit Cost */}
                <HStack w="full">
                  <Text
                    minW="50%"
                    w="auto"
                    bgColor="secondary"
                    color="white"
                    pl={2}
                    pr={7}
                    py={2.5}
                    fontSize="xs"
                  >
                    Unit Cost:{" "}
                  </Text>
                  {barcodeNo.length === 0 ? (
                    <Text
                      textAlign="center"
                      fontSize="xs"
                      w="full"
                      bgColor="gray.200"
                      border="1px"
                      borderColor="gray.200"
                      py={1.5}
                    >
                      Select a barcode number
                    </Text>
                  ) : (
                    <Text
                      textAlign="center"
                      fontSize="xs"
                      w="full"
                      bgColor="gray.200"
                      border="1px"
                      borderColor="gray.200"
                      py={1.5}
                    >
                      {unitCost
                        ? unitCost.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })
                        : "Select a barcode number"}
                    </Text>
                  )}
                </HStack>
              </VStack>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup size="xs">
              <Button
                onClick={openAddConfirmation}
                disabled={
                  !rawMatsInfo.itemCode ||
                  !rawMatsInfo.customerName ||
                  !rawMatsInfo.uom ||
                  !rawMatsInfo.warehouseId ||
                  !rawMatsInfo.quantity ||
                  !details ||
                  // !transactionDate ||
                  rawMatsInfo.quantity > availableStock
                }
                title={
                  rawMatsInfo.quantity > availableStock
                    ? "Quantity must not be greater than available stock"
                    : ""
                }
                colorScheme="blue"
                px={4}
              >
                Add
              </Button>
              <Button color="black" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {isAdd && (
        <AddConfirmation
          isOpen={isAdd}
          onClose={closeAdd}
          closeAddModal={onClose}
          details={details}
          setDetails={setDetails}
          rawMatsInfo={rawMatsInfo}
          setRawMatsInfo={setRawMatsInfo}
          customerRef={customerRef}
          setSelectorId={setSelectorId}
          warehouseId={warehouseId}
          setWarehouseId={setWarehouseId}
          fetchActiveMiscIssues={fetchActiveMiscIssues}
          customerData={customerData}
          remarks={remarks}
          setRemarks={setRemarks}
          transactionDate={transactionDate}
          setTransactionDate={setTransactionDate}
          unitCost={unitCost}
          setUnitCost={setUnitCost}
        />
      )}
    </>
  );
};
