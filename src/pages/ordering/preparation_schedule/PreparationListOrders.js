import React, { useState, useEffect } from "react";
import {
  Badge,
  Button,
  Checkbox,
  Flex,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from "@ajna/pagination";
import { TiInfo } from "react-icons/ti";
import PageScroll from "../../../utils/PageScroll";
import {
  CancelModalConfirmation,
  EditModal,
  ScheduleModal,
} from "./ScheduleModal";

export const PreparationListOrders = ({
  setCurrentPage,
  currentPage,
  pagesCount,
  customerName,
  setCustomerName,
  orders,
  pageTotal,
  setTrasactId,
  transactId,
  fetchOrders,
  fetchCustomerOrders,
  lengthIndicator,
  setQty,
  qty,
}) => {
  const [editData, setEditData] = useState({
    transactId: "",
    customerName: "",
    itemCode: "",
    itemDescription: "",
    uom: "",
    quantiyOrdered: "",
    standardQuantity: "",

    // stockOnHand: "",
  });
  const [cancelId, setCancelId] = useState("");
  const [checkedItems, setCheckedItems] = useState([]);
  const [dateNeeded, setDateNeeded] = useState("");
  const [disableIfStock, setDisableIfStock] = useState(false);
  const dateToday = new Date();
  const [badgeChanger, setBadgeChanger] = useState(false);

  const {
    isOpen: isEdit,
    onOpen: openEdit,
    onClose: closeEdit,
  } = useDisclosure();
  const {
    isOpen: isCancel,
    onOpen: openCancel,
    onClose: closeCancel,
  } = useDisclosure();
  const {
    isOpen: isSchedule,
    onOpen: openSchedule,
    onClose: closeSchedule,
  } = useDisclosure();

  const handlePageChange = (nextPage) => {
    setCheckedItems([]);
    setCurrentPage(nextPage);
  };

  const editHandler = ({
    id,
    customerName,
    itemCode,
    itemDescription,
    uom,
    quantityOrder,
    standardQuantity,
    // stockOnHand,
  }) => {
    if (
      id &&
      customerName &&
      itemCode &&
      itemDescription &&
      uom &&
      standardQuantity
      // stockOnHand
    ) {
      setEditData({
        transactId: id,
        customerName: customerName,
        itemCode: itemCode,
        itemDescription: itemDescription,
        uom: uom,
        quantity: quantityOrder,
        standardQuantity: standardQuantity,
        // stockOnHand: stockOnHand,
      });
      openEdit();
      console.log(editData);
    } else {
      setEditData({
        transactId: "",
        customerName: "",
        itemCode: "",
        itemDescription: "",
        uom: "",
        quantiy: "",
        standardQuantity: "",
        // stockOnHand: "",
      });
    }
  };

  const cancelHandler = ({ id }) => {
    if (id) {
      setCancelId(id);
      openCancel();
    } else {
      setCancelId("");
    }
  };

  //refetch if data length === 0
  useEffect(() => {
    if (lengthIndicator === 0 && currentPage === 1) {
      fetchCustomerOrders();
      fetchOrders();
    }
    if (lengthIndicator === 0 && currentPage !== 1) {
      setCurrentPage(1);
      fetchOrders();
    }
  }, [lengthIndicator]);

  const stockAvailable = orders?.filter(
    (item) => item.stockOnHand >= item.quantityOrder
  );
  const stockData = stockAvailable?.map((item) => item.id);
  const parentCheckHandler = (e) => {
    if (e.target.checked) {
      setCheckedItems(stockData);
    } else {
      setCheckedItems([]);
    }
  };

  const scheduleHandler = () => {
    openSchedule();
  };

  const [checkItemsData, setCheckItemsData] = useState([]);
  const childCheckHandler = (e) => {
    const newData = JSON.parse(e.target.value);
    // console.log(newData)
    const id = newData?.id;
    if (e.target.checked) {
      setCheckedItems([...checkedItems, parseInt(id)]);
      setCheckItemsData([...checkItemsData, newData]);
    } else {
      const data = checkedItems?.filter((item) => item !== parseInt(id));
      setCheckedItems(data);
      const revertData = checkItemsData?.filter(
        (item) => item.id !== parseInt(id)
      );
      setCheckItemsData(revertData);
    }
  };

  useEffect(() => {
    if (checkItemsData?.length) {
      let totalQuantity = checkItemsData.map((q) =>
        parseFloat(q.quantityOrder)
      );
      let sum = totalQuantity.reduce((a, b) => a + b);
      checkItemsData?.map((item) => {
        if (item.stockOnHand < sum) {
          setDisableIfStock(true);
        } else {
          setDisableIfStock(false);
        }
      });
    }
  }, [checkItemsData]);

  const rushBadge = orders?.some((x) => (x.rush ? true : false));

  return (
    <Flex w="full" p={7} flexDirection="column">
      <Flex w="full" justifyContent="space-between">
        <HStack w="40%" spacing={1}>
          <Badge bgColor="primary" color="white" px={3}>
            Customer:{" "}
          </Badge>
          <Text p={0} fontSize="sm">
            {customerName && customerName}
          </Text>
          <Badge
            fontSize="9.5px"
            colorScheme="orange"
            variant="solid"
            className="inputCapital"
          >
            {rushBadge && "Rush"}
          </Badge>
        </HStack>

        <Flex>
          <Pagination
            pagesCount={pagesCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          >
            <PaginationContainer>
              <PaginationPrevious
                border="1px"
                fontSize="xs"
                px={2}
                _hover={{ bg: "btnColor", color: "white" }}
              >
                {"< Previous"}
              </PaginationPrevious>
              <Text mx={1} bgColor="primary" color="white" px={2} pt={1.5}>
                {currentPage}
              </Text>
              <PaginationNext
                border="1px"
                fontSize="xs"
                px={4}
                _hover={{ bg: "btnColor", color: "white" }}
              >
                {"Next >"}
              </PaginationNext>
            </PaginationContainer>
          </Pagination>
        </Flex>
      </Flex>

      <Text textAlign="center" fontSize="sm" fontWeight="semibold">
        {pageTotal && pageTotal} Remaining Orders
      </Text>

      <VStack w="full" spacing={0} justifyContent="center" mt={5}>
        <Text
          w="full"
          fontWeight="semibold"
          fontSize="xs"
          bgColor="primary"
          color="white"
          textAlign="center"
        >
          List of Orders
        </Text>
        <PageScroll minHeight="130px" maxHeight="640px">
          <Table
            size="sm"
            boxShadow="md"
            // bg="gray.200"
            // variant="simple"
            // position="relative"
            border="1px"
            borderColor="gray.400"
            variant="simple"
          >
            <Thead bg="secondary" position="sticky">
              <Tr h="40px">
                <Th>
                  <Checkbox
                    size="sm"
                    onChange={parentCheckHandler}
                    isChecked={stockData?.length === checkedItems?.length}
                    disabled={!stockData?.length > 0}
                    color="white"
                  >
                    <Text fontSize="10px">Line</Text>
                  </Checkbox>
                </Th>
                <Th color="white" fontSize="10px">
                  ID
                </Th>
                <Th color="white" fontSize="10px">
                  Order Date
                </Th>
                <Th color="white" fontSize="10px">
                  Date Needed
                </Th>
                {/* <Th color="white" fontSize="10px">
                  Department
                </Th> */}
                <Th color="white" fontSize="10px">
                  Customer Code
                </Th>
                <Th color="white" fontSize="10px">
                  Customer Name
                </Th>
                <Th color="white" fontSize="10px">
                  Category
                </Th>
                <Th color="white" fontSize="10px">
                  Item Code
                </Th>
                <Th color="white" fontSize="10px">
                  Item Description
                </Th>
                <Th color="white" fontSize="10px">
                  UOM
                </Th>
                <Th color="white" fontSize="10px">
                  Quantity Order
                </Th>
                {/* <Th color="white" fontSize="10px">
                  Edited Qty Order
                </Th> */}
                <Th color="white" fontSize="10px">
                  Reserve
                </Th>
                <Th color="white" fontSize="10px">
                  Remarks
                </Th>
                <Th color="white" fontSize="9px">
                  Edit
                </Th>
                <Th color="white" fontSize="9px">
                  Cancel
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders?.map((item, i) => (
                <Tr
                  bgColor={
                    item.stockOnHand < item.quantityOrder ? "gray.200 " : "none"
                  }
                  color={
                    item.stockOnHand < item.quantityOrder ? "black" : "none"
                  }
                  _active={
                    transactId
                      ? { bgColor: "btnColor", color: "white" }
                      : { bgColor: "none" }
                  }
                  _hover={
                    transactId
                      ? { bgColor: "blue.100", color: "white" }
                      : { bgColor: "none" }
                  }
                  cursor="pointer"
                  key={i}
                >
                  {item.stockOnHand >= item.quantityOrder &&
                  item.standardQuantity ? (
                    <Td>
                      <Checkbox
                        // size="sm"
                        onChange={childCheckHandler}
                        // isChecked={checkedItems.includes(item.id)}
                        // value={item.id}
                        isChecked={checkedItems.includes(item.id)}
                        value={JSON.stringify(item)}
                        color="black"
                      >
                        <Text fontSize="11px">{i + 1}</Text>
                      </Checkbox>
                    </Td>
                  ) : (
                    <Td>
                      <HStack>
                        <TiInfo color="red" title="Not enough stocks" />
                        <Text fontSize="11px">{i + 1}</Text>
                      </HStack>
                    </Td>
                  )}
                  <Td fontSize="xs">{item.id}</Td>
                  <Td fontSize="xs">{item.orderDate}</Td>
                  <Td fontSize="xs">{item.dateNeeded}</Td>
                  {/* <Td fontSize="xs">{item.department}</Td> */}
                  <Td fontSize="xs">{item.customerCode}</Td>
                  <Td fontSize="xs">{item.customerName}</Td>
                  <Td fontSize="xs">{item.category.toUpperCase()}</Td>
                  <Td fontSize="xs">{item.itemCode}</Td>
                  <Td fontSize="xs">{item.itemDescription}</Td>
                  <Td fontSize="xs">{item.uom}</Td>
                  {/* <Td fontSize="xs">
                    {item.standardQuantity.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </Td> */}
                  <Td fontSize="xs">
                    {item.quantityOrder.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </Td>
                  <Td fontSize="xs">
                    {item.stockOnHand.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </Td>
                  <Td fontSize="xs">
                    {item.rush ? (
                      <Text fontSize="xs">
                        {item.rush}
                        {/* <Badge
                          ml="1"
                          fontSize="9px"
                          className="inputLowerCase"
                          colorScheme="green"
                        >
                          Rush
                        </Badge> */}
                      </Text>
                    ) : (
                      ""
                    )}
                  </Td>
                  <Td fontSize="xs">
                    <Button
                      onClick={() => editHandler(item)}
                      disabled={item.stockOnHand === 0}
                      size="xs"
                      colorScheme="blue"
                      color="white"
                      px={4}
                      borderRadius="none"
                    >
                      <Text fontSize="xs">Edit</Text>
                    </Button>
                  </Td>

                  <Td fontSize="11px">
                    <Button
                      onClick={() => cancelHandler(item)}
                      colorScheme="red"
                      size="xs"
                      borderRadius="none"
                    >
                      <Text fontSize="xs">Cancel</Text>
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageScroll>
        <Flex w="full" justifyContent="space-between" py={2} px={2}>
          <Text fontSize="xs">Selected Item(s): {checkedItems?.length}</Text>
          <Button
            onClick={scheduleHandler}
            title={
              !checkedItems?.length > 0
                ? disableIfStock
                  ? "Stocks must be available"
                  : "Please select an order to schedule"
                : !checkedItems?.length > 0 || disableIfStock
                ? "Stocks must be available"
                : "Schedule order(s)"
            }
            disabled={!checkedItems?.length > 0 || disableIfStock}
            size="sm"
            px={3}
            colorScheme="blue"
            borderRadius="none"
          >
            Schedule
          </Button>
        </Flex>
      </VStack>

      {isEdit && (
        <EditModal
          isOpen={isEdit}
          onClose={closeEdit}
          editData={editData}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          fetchOrders={fetchOrders}
          qty={qty}
        />
      )}

      {isCancel && (
        <CancelModalConfirmation
          isOpen={isCancel}
          onClose={closeCancel}
          cancelId={cancelId}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          fetchOrders={fetchOrders}
          //   fetchNotification={fetchNotification}
        />
      )}

      {isSchedule && (
        <ScheduleModal
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
          isOpen={isSchedule}
          onClose={closeSchedule}
          customerName={customerName}
          fetchOrders={fetchOrders}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      )}
    </Flex>
  );
};
