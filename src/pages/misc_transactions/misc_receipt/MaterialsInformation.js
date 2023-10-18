import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
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
// import { useLocation } from 'react-router-dom'
// import { AddConfirmation } from './Action-Modals'
import moment from "moment";
import request from "../../../services/ApiClient";
import { AddConfirmation } from "./ActionModals";

export const MaterialsInformation = ({
  rawMatsInfo,
  setRawMatsInfo,
  listDataTempo,
  setListDataTempo,
  details,
  setDetails,
  suppliers,
  materials,
  uoms,
  setSelectorId,
  supplierData,
  setSupplierData,
  supplierRef,
  remarks,
  setRemarks,
  remarksRef,
  transactionDate,
  setTransactionDate,
  transactionType,
  setTransactionType,
}) => {
  const {
    isOpen: isModal,
    onClose: closeModal,
    onOpen: openModal,
  } = useDisclosure();

  // const fetchTransactionTypeApi = async () => {
  //     const res = await request.get(`Transaction/GetAllActiveTransactionName`)
  //     return res.data
  // }
  // const fetchTransactionType = () => {
  //     fetchTransactionTypeApi().then(res => {
  //         setTransactions(res)
  //     })
  // }
  // useEffect(() => {
  //     fetchTransactionType()
  // }, [])

  const detailHandler = (data) => {
    if (data) {
      setDetails(data);
    } else {
      setDetails("");
    }
  };

  // console.log(supplierData?.supplierName);
  console.log(transactionDate);

  const supplierHandler = (data) => {
    if (data) {
      const newData = JSON.parse(data);
      const supplierCode = newData.supplierCode;
      const supplierName = newData.supplierName;
      setRawMatsInfo({
        itemCode: rawMatsInfo.itemCode,
        itemDescription: rawMatsInfo.itemDescription,
        supplierName: supplierName,
        uom: rawMatsInfo.uom,
        quantity: rawMatsInfo.quantity,
        unitPrice: rawMatsInfo.unitPrice,
      });
      setSupplierData({
        supplierCode: supplierCode,
        supplierName: supplierName,
      });
    } else {
      setRawMatsInfo({
        itemCode: rawMatsInfo.itemCode,
        itemDescription: rawMatsInfo.itemDescription,
        supplierName: "",
        uom: rawMatsInfo.uom,
        // expirationDate: rawMatsInfo.expirationDate,
        quantity: rawMatsInfo.quantity,
        unitPrice: rawMatsInfo.unitPrice,
      });
      setSupplierData({
        supplierCode: "",
        supplierName: "",
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

        <Flex w="full" justifyContent="space-between">
          <VStack alignItems="start" w="40%" mx={5}>
            {/* Supplier Code */}
            <HStack w="full">
              <Text
                minW="50%"
                w="auto"
                bgColor="primary"
                color="white"
                pl={2}
                py={2.5}
                fontSize="xs"
              >
                Supplier Code:{" "}
              </Text>
              {suppliers.length > 0 ? (
                <Select
                  fontSize="xs"
                  placeholder="Select Supplier"
                  onChange={(e) => supplierHandler(e.target.value)}
                  ref={supplierRef}
                  w="full"
                  bgColor="#ffffe0"
                >
                  {suppliers?.map((item, i) => (
                    <option
                      key={i}
                      value={JSON.stringify(item)}
                    >{`${item.supplierCode} - ${item.supplierName}`}</option>
                  ))}
                </Select>
              ) : (
                <Spinner />
              )}
            </HStack>

            {/* Remarks */}
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
              {transactionType?.length > 0 ? (
                <Select
                  fontSize="xs"
                  onChange={(e) => setRemarks(e.target.value)}
                  ref={remarksRef}
                  w="full"
                  placeholder="Select Transaction Type"
                  bgColor="#fff8dc"
                >
                  {transactionType?.map((tt) => (
                    <option key={tt.id} value={tt.transactionName}>
                      {tt.transactionName}
                    </option>
                  ))}
                </Select>
              ) : (
                <Spinner />
              )}
            </HStack>
          </VStack>

          <VStack alignItems="start" w="40%" mx={5}>
            {/* Supplier Name */}
            <HStack w="full">
              <Text
                minW="50%"
                w="auto"
                bgColor="primary"
                color="white"
                pl={2}
                pr={10}
                py={2.5}
                fontSize="xs"
              >
                Supplier Name:{" "}
              </Text>
              <Text
                fontSize="xs"
                bgColor="gray.300"
                w="full"
                border="1px"
                borderColor="gray.400"
                pl={2}
                py={1.5}
              >
                {supplierData.supplierName
                  ? supplierData.supplierName
                  : "Please select a supplier code"}
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
                pl={2}
                w="full"
                border="1px"
                onChange={(e) => setTransactionDate(e.target.value)}
                value={transactionDate}
                // defaultValue={moment(new Date()).format("yyyy-MM-DD")}
                max={moment(new Date()).format("yyyy-MM-DD")}
                bgColor="#fff8dc"
                py={1.5}
              />
            </HStack>
          </VStack>
        </Flex>
        <VStack alignItems="start" w="full">
          {/* Details */}
          <HStack w="full">
            <Text
              w="auto"
              bgColor="primary"
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
              w="full"
              bgColor="#ffffe0"
            />
          </HStack>
        </VStack>
        <Flex w="full" justifyContent="end" mt={4} p={2}>
          <Button
            onClick={() => openModal()}
            disabled={
              !supplierData.supplierName ||
              !details ||
              !remarks ||
              !transactionDate
            }
            size="sm"
            colorScheme="blue"
            // borderRadius="none"
          >
            New
          </Button>
        </Flex>
      </VStack>

      {isModal && (
        <RawMatsInfoModal
          rawMatsInfo={rawMatsInfo}
          setRawMatsInfo={setRawMatsInfo}
          listDataTempo={listDataTempo}
          setListDataTempo={setListDataTempo}
          details={details}
          setDetails={setDetails}
          supplierRef={supplierRef}
          materials={materials}
          uoms={uoms}
          setSelectorId={setSelectorId}
          isOpen={isModal}
          onClose={closeModal}
          remarks={remarks}
          transactionDate={transactionDate}
          setTransactionDate={setTransactionDate}
          supplierData={supplierData}
        />
      )}
    </Flex>
  );
};

export const RawMatsInfoModal = ({
  isOpen,
  onClose,
  details,
  setDetails,
  rawMatsInfo,
  setRawMatsInfo,
  listDataTempo,
  setListDataTempo,
  supplierRef,
  materials,
  uoms,
  setSelectorId,
  remarks,
  transactionDate,
  setTransactionDate,
  supplierData,
}) => {
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
      setRawMatsInfo({
        itemCode: itemCode,
        itemDescription: itemDescription,
        supplierName: rawMatsInfo.supplierName,
        uom: uom,
        // expirationDate: rawMatsInfo.expirationDate,
        quantity: rawMatsInfo.quantity,
        unitPrice: rawMatsInfo.unitPrice,
      });
    } else {
      setRawMatsInfo({
        itemCode: "",
        itemDescription: "",
        supplierName: rawMatsInfo.supplierName,
        uom: "",
        // expirationDate: rawMatsInfo.expirationDate,
        quantity: rawMatsInfo.quantity,
        unitPrice: rawMatsInfo.unitPrice,
      });
    }
  };

  const newDate = new Date();
  const minDate = moment(newDate).format("yyyy-MM-DD");

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} isCentered size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader mb={4}>
            <VStack justifyContent="center" spacing={-2}>
              <Text>Materials Information</Text>
              <Text fontSize="xs">Miscellaneous Receipt</Text>
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
                  {materials.length > 0 ? (
                    <Select
                      onChange={(e) => itemCodeHandler(e.target.value)}
                      w="full"
                      placeholder=" "
                      bgColor="#fff8dc"
                    >
                      {materials?.map((item, i) => (
                        <option key={i} value={JSON.stringify(item)}>
                          {item.itemCode}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <Spinner />
                  )}
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
                    onChange={(e) =>
                      setRawMatsInfo({
                        itemCode: rawMatsInfo.itemCode,
                        itemDescription: rawMatsInfo.itemDescription,
                        supplierName: rawMatsInfo.supplierName,
                        uom: rawMatsInfo.uom,
                        // expirationDate: rawMatsInfo.expirationDate,
                        quantity: Number(e.target.value),
                        unitPrice: rawMatsInfo.unitPrice,
                      })
                    }
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(e) =>
                      ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()
                    }
                    min="1"
                    onPaste={(e) => e.preventDefault()}
                    w="full"
                    bgColor="#fff8dc"
                  />
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
                  <InputGroup>
                    {/* <InputLeftElement
                      pointerEvents="auto"
                      // color="gray.300"
                      fontSize="1.2em"
                      children="₱"
                    /> */}
                    <Input
                      onChange={(e) =>
                        setRawMatsInfo({
                          itemCode: rawMatsInfo.itemCode,
                          itemDescription: rawMatsInfo.itemDescription,
                          supplierName: rawMatsInfo.supplierName,
                          uom: rawMatsInfo.uom,
                          // expirationDate: rawMatsInfo.expirationDate,
                          quantity: rawMatsInfo.quantity,
                          unitPrice: Number(e.target.value),
                        })
                      }
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      onKeyDown={(e) =>
                        ["E", "e", "+", "-"].includes(e.key) &&
                        e.preventDefault()
                      }
                      min="1"
                      onPaste={(e) => e.preventDefault()}
                      w="full"
                      bgColor="#fff8dc"
                    />
                  </InputGroup>
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
                    bgColor="gray.200"
                    w="full"
                    border="1px"
                    borderColor="gray.200"
                    py={1.5}
                  >
                    {rawMatsInfo.itemDescription
                      ? rawMatsInfo.itemDescription
                      : "Item Code required"}
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
                    bgColor="gray.200"
                    w="full"
                    border="1px"
                    borderColor="gray.200"
                    py={1.5}
                  >
                    {rawMatsInfo.uom ? rawMatsInfo.uom : "Item Code required"}
                  </Text>
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
                  !rawMatsInfo.supplierName ||
                  !rawMatsInfo.uom ||
                  !rawMatsInfo.quantity ||
                  !rawMatsInfo.unitPrice ||
                  !details
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
          listDataTempo={listDataTempo}
          setListDataTempo={setListDataTempo}
          supplierRef={supplierRef}
          setSelectorId={setSelectorId}
          remarks={remarks}
          transactionDate={transactionDate}
          setTransactionDate={setTransactionDate}
          supplierData={supplierData}
        />
      )}
    </>
  );
};
