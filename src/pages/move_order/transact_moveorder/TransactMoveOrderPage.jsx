import React, { useState, useEffect } from "react";
import {
  Button,
  Flex,
  HStack,
  Input,
  Select,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { ListMoveOrder } from "./ListMoveOrder";
import request from "../../../services/ApiClient";
// import { TransactConfirmation } from './transactmoveorder/Action-Modals-Transact';
import moment from "moment";
import { TransactConfirmation } from "./ActionModalTransact";

//Move Order List

const fetchMoveOrderListApi = async (status) => {
  const res = await request.get(
    `Ordering/GetTotalListForMoveOrder?status=${status}`
  );
  return res.data;
};

//Move Order Lists by Order No

const fetchMoveOrderViewTableApi = async (orderNo) => {
  const res = await request.get(
    `Ordering/ListOfMoveOrdersForTransact?orderId=${orderNo}`
  );
  return res.data;
};

const TransactMoveOrderPage = ({ fetchNotification }) => {
  const [status, setStatus] = useState(false);

  const [moveOrderList, setMoveOrderList] = useState([]);
  const [moveOrderViewTable, setMoveOrderViewTable] = useState([]);

  const [moveOrderInformation, setMoveOrderInformation] = useState({
    orderNo: "",
    deliveryStatus: "Pick-Up",
    customerName: "",
    customerCode: "",
  });
  const orderNo = moveOrderInformation.orderNo;
  const [deliveryDate, setDeliveryDate] = useState("");
  const [checkedItems, setCheckedItems] = useState([]);
  const {
    isOpen: isTransact,
    onClose: closeTransact,
    onOpen: openTransact,
  } = useDisclosure();

  //Get Move Order List
  const fetchMoveOrderList = () => {
    fetchMoveOrderListApi(status).then((res) => {
      setMoveOrderList(res);
    });
  };

  useEffect(() => {
    fetchMoveOrderList();

    return () => {
      setMoveOrderList([]);
    };
  }, [status]);

  //Get Move Order Lists by Order No
  const fetchMoveOrderViewTable = () => {
    fetchMoveOrderViewTableApi(orderNo).then((res) => {
      setMoveOrderViewTable(res);
    });
  };

  useEffect(() => {
    if (orderNo) {
      fetchMoveOrderViewTable();
    }

    return () => {
      setMoveOrderViewTable([]);
    };
  }, [orderNo]);

  const newDate = new Date();
  const maxDate = moment(newDate).format("yyyy-MM-DD");
  const minDate = moment(newDate.setDate(newDate.getDate() - 7)).format(
    "yyyy-MM-DD"
  );

  return (
    <>
      <Flex
        w="full"
        // justifyContent="space-between"
        flexDirection="column"
        bg="form"
      >
        <Flex justifyContent="space-between" w="full">
          <HStack justifyContent="space-between" mt={5} pl={5}>
            <Text fontSize="xs">Status:</Text>
            <Select
              fontSize="xs"
              onChange={(e) => setStatus(Boolean(Number(e.target.value)))}
            >
              <option value={0}>For Transaction</option>
              <option value={1}>Transacted Orders</option>
            </Select>
          </HStack>
          {!status && (
            <HStack justifyContent="space-between" mt={2} pr={2}>
              <Text fontSize="xs">Pick-Up Date:</Text>
              <Input
                fontSize="xs"
                onChange={(e) => setDeliveryDate(e.target.value)}
                min={minDate}
                max={maxDate}
                disabled={checkedItems <= 0}
                title={
                  checkedItems <= 0
                    ? "Please select items to transact first"
                    : ""
                }
                type="date"
                bgColor="#fff8dc"
              />
            </HStack>
          )}
        </Flex>

        <VStack p={2} w="full" spacing={0}>
          <ListMoveOrder
            moveOrderList={moveOrderList}
            moveOrderInformation={moveOrderInformation}
            setMoveOrderInformation={setMoveOrderInformation}
            moveOrderViewTable={moveOrderViewTable}
            checkedItems={checkedItems}
            setCheckedItems={setCheckedItems}
            status={status}
          />
        </VStack>
        {!status && (
          <HStack justifyContent="end" mr={10} mb={3}>
            <Button
              onClick={() => openTransact()}
              title={!deliveryDate ? "Please select a delivery date first" : ""}
              disabled={!deliveryDate}
              size="sm"
              colorScheme="blue"
              // borderRadius="none"
            >
              Transact
            </Button>
          </HStack>
        )}
      </Flex>
      {isTransact && (
        <TransactConfirmation
          isOpen={isTransact}
          onClose={closeTransact}
          deliveryDate={deliveryDate}
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
          fetchMoveOrderList={fetchMoveOrderList}
          setDeliveryDate={setDeliveryDate}
          fetchNotification={fetchNotification}
        />
      )}
    </>
  );
};

export default TransactMoveOrderPage;
