import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
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
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  toast,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import moment from "moment";
import { ToastComponent } from "../../components/Toast";
import { MdOutlineManageSearch } from "react-icons/md";
import request from "../../services/ApiClient";
import PageScrollImport from "../../components/PageScrollImport";
import { AddQuantityConfirmation } from "./ActionModal";

const fetchAvailableBarcodePerItemCodeApi = async (itemCode) => {
  const res = await request.get(`Warehouse/GetAllListOfWarehouseReceivingId`, {
    params: {
      search: itemCode,
    },
  });
  return res.data;
};

export const ActualItemQuantity = ({
  warehouseId,
  setWarehouseId,
  barcodeData,
  orderId,
  highlighterId,
  setHighlighterId,
  itemCode,
  fetchOrderList,
  fetchPreparedItems,
  qtyOrdered,
  preparedQty,
  nearlyExpireBarcode,
  setItemCode,
}) => {
  const [availableBarcode, setAvailableBarcode] = useState([]);

  // const fetchAvailableBarcodePerItemCodeApi = async () => {
  //   try {
  //     const res = await request.get(
  //       `Warehouse/GetAllListOfWarehouseReceivingId`,
  //       {
  //         params: {
  //           search: itemCode,
  //         },
  //       }
  //     );
  //   } catch (error) {}
  // };

  // useEffect(() => {
  //   // try {
  //   fetchAvailableBarcodePerItemCodeApi();
  //   // } catch (error) {}
  // }, [itemCode]);

  const fetchAvailableBarcodePerItemCode = () => {
    fetchAvailableBarcodePerItemCodeApi(itemCode).then((res) => {
      setAvailableBarcode(res);
    });
  };
  // console.log(availableBarcode);

  const {
    isOpen: isBarcode,
    onClose: closeBarcode,
    onOpen: openBarcode,
  } = useDisclosure();

  const openAvailableBarcodes = () => {
    if (itemCode) {
      fetchAvailableBarcodePerItemCode();
      openBarcode();
    }
  };

  const barcodeRef = useRef(null);

  const [quantity, setQuantity] = useState("");

  const [inputValidate, setInputValidate] = useState(true);
  const [isQuantityZero, setIsQuantityZero] = useState(false);

  const toast = useToast();

  const {
    isOpen: isQuantity,
    onClose: closeQuantity,
    onOpen: openQuantity,
  } = useDisclosure();

  useEffect(() => {
    const total = Number(quantity) + Number(preparedQty);
    const stock = Number(barcodeData.remaining);
    if (total > qtyOrdered || quantity > stock) {
      setInputValidate(true);
    } else {
      setInputValidate(false);
    }

    setIsQuantityZero(Number(quantity) === 0);

    return () => {
      setInputValidate(true);
      setInputValidate(true);
    };
  }, [quantity]);

  //autofocus on barcode
  useEffect(() => {
    if (warehouseId === "") {
      window.setTimeout(() => {
        barcodeRef?.current?.focus();
      }, 600);
    }
  }, [warehouseId]);

  const allowableQuantity = quantity * 0.5;

  //Barcode Validation of Nearly Expired inventory
  useEffect(() => {
    if (barcodeData?.orders?.warehouseId) {
      if (barcodeData?.orders?.warehouseId != barcodeData?.warehouseId) {
        ToastComponent(
          "Warning",
          `The barcode ${barcodeData?.warehouseId} should be selected first before the barcode ${barcodeData?.orders?.warehouseId}`,
          "warning",
          toast
        );
      }
    }
  }, [barcodeData]);

  const setQuantityValidate = (value) => {
    if (value !== "0") {
      setQuantity(value);
    }
  };

  return (
    <Flex w="full" flexDirection="column">
      <Box w="full" bgColor="primary" h="22px">
        <Text
          fontWeight="semibold"
          fontSize="13px"
          color="white"
          textAlign="center"
          justifyContent="center"
        >
          Actual Quantity
        </Text>
      </Box>

      <HStack justifyContent="space-between" mt={2}>
        <HStack spacing={1}>
          <Text
            bgColor="secondary"
            color="white"
            px={10}
            textAlign="start"
            fontSize="13px"
          >
            Scan Barcode:
          </Text>
          <Input
            fontSize="13px"
            onChange={(e) => setWarehouseId(e.target.value)}
            value={warehouseId}
            ref={barcodeRef}
            type="number"
            onWheel={(e) => e.target.blur()}
            onKeyDown={(e) =>
              ["E", "e", ".", "+", "-"].includes(e.key) && e.preventDefault()
            }
            placeholder="Barcode number"
            h="15%"
            w="50%"
            bgColor="#fff8dc"
            borderRadius="none"
          />
          <Button
            onClick={openAvailableBarcodes}
            size="xs"
            background="none"
            title={`Check all available warehouse barcodes for ${itemCode}`}
          >
            <MdOutlineManageSearch fontSize="20px" />
          </Button>
        </HStack>
        <HStack spacing={5}>
          <Text
            bgColor="secondary"
            color="white"
            px={10}
            textAlign="start"
            fontSize="13px"
          >
            Remaining Quantity:
          </Text>
          <Text bgColor="gray.200" border="1px" px={12} fontSize="11px">
            {barcodeData?.orders?.remaining
              ? barcodeData?.orders?.remaining
              : "No data with this barcode"}
          </Text>
        </HStack>
        <HStack spacing={5}>
          <Text
            fontSize="13px"
            bgColor="secondary"
            color="white"
            px={10}
            textAlign="start"
          >
            Actual Quantity:
          </Text>
          <Input
            borderRadius="none"
            fontSize="13px"
            onChange={(e) => setQuantityValidate(e.target.value)}
            disabled={!barcodeData?.orders?.remaining}
            title={
              barcodeData?.orders?.remaining
                ? "Please enter a quantity"
                : "Barcode Number is required"
            }
            value={quantity}
            type="number"
            onWheel={(e) => e.target.blur()}
            onKeyDown={(e) =>
              ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()
            }
            onPaste={(e) => e.preventDefault()}
            autoComplete="off"
            min="1"
            placeholder="Please enter quantity"
            h="15%"
            w="50%"
            bgColor="#fff8dc"
          />
        </HStack>
      </HStack>

      <Flex justifyContent="end" mt={5}>
        {}

        <Button
          onClick={() => openQuantity()}
          disabled={
            !warehouseId ||
            isQuantityZero ||
            !quantity ||
            inputValidate ||
            !barcodeData ||
            quantity > barcodeData?.orders?.remaining
          }
          size="xs"
          fontSize="11px"
          colorScheme="blue"
          px={7}
        >
          Add
        </Button>
      </Flex>
      {
        <AddQuantityConfirmation
          isOpen={isQuantity}
          onClose={closeQuantity}
          orderNo={orderId}
          id={highlighterId}
          itemCode={itemCode}
          quantityOrdered={quantity}
          fetchOrderList={fetchOrderList}
          fetchPreparedItems={fetchPreparedItems}
          // expirationDate={expirationDate}
          setQuantity={setQuantity}
          setHighlighterId={setHighlighterId}
          setWarehouseId={setWarehouseId}
          warehouseId={warehouseId}
        />
      }

      {isBarcode && (
        <AvailableBarcodeModal
          isOpen={isBarcode}
          onClose={closeBarcode}
          availableBarcode={availableBarcode}
          setWarehouseId={setWarehouseId}
          itemCode={itemCode}
        />
      )}
    </Flex>
  );
};

const AvailableBarcodeModal = ({
  isOpen,
  onClose,
  availableBarcode,
  setWarehouseId,
  itemCode,
}) => {
  const selectId = (data) => {
    if (data) {
      setWarehouseId(data);
      onClose();
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} isCentered size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex justifyContent="center">
              {`Available stocks for ${itemCode}`}
            </Flex>
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <ModalBody>
            <PageScrollImport>
              <Table variant="striped" size="sm">
                <Thead>
                  <Tr bgColor="secondary" h="30px">
                    <Th color="white" fontSize="10px">
                      Warehouse ID
                    </Th>
                    <Th color="white" fontSize="10px">
                      Item Code
                    </Th>
                    <Th color="white" fontSize="10px">
                      Item Description
                    </Th>
                    <Th color="white" fontSize="10px">
                      Actual Good
                    </Th>
                    {/* <Th color="white">Expiration Day</Th>
                    <Th color="white">Expiration Date</Th> */}
                    <Th color="white" fontSize="10px">
                      Select
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {availableBarcode?.map((items) =>
                    items.actualGood <= 0 ? (
                      ""
                    ) : (
                      <Tr key={items.id}>
                        <Td fontSize="xs">{items.id}</Td>
                        <Td fontSize="xs">{items.itemCode}</Td>
                        <Td fontSize="xs">{items.itemDescription}</Td>
                        <Td fontSize="xs">{items.actualGood}</Td>
                        {/* <Td>{items.expirationDay}</Td>
                        <Td
                          color={items.expirationDay <= 0 ? "red" : ""}
                          title={
                            items.expirationDay <= 0
                              ? "Expired"
                              : `${items.expirationDay} days before expiration`
                          }
                          cursor="help"
                        >
                          {items.expirationDate}
                        </Td> */}
                        <Td>
                          <Button
                            onClick={() => selectId(items.id)}
                            size="xs"
                            colorScheme="blue"
                            title={`Use this barcode`}
                          >
                            Select
                          </Button>
                        </Td>
                      </Tr>
                    )
                  )}
                </Tbody>
              </Table>
            </PageScrollImport>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
