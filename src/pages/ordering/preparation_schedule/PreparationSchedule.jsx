import React, { useState, useEffect } from "react";
import { Flex, VStack } from "@chakra-ui/react";
import { usePagination } from "@ajna/pagination";
import request from "../../../services/ApiClient";
import { PreparationListOrders } from "./PreparationListOrders";

// FETHC CUSTOMER ORDERS API
const fetchCustomerOrdersApi = async (pageNumber) => {
  const res = await request.get(
    `Ordering/GetAllListOfOrdersPagination?pageSize=1&pageNumber=${pageNumber}`
  );
  return res.data;
};

const PrepartionSchedule = () => {
  const [customerName, setCustomerName] = useState("");
  const [orders, setOrders] = useState([]);

  const [transactId, setTransactId] = useState(null);

  const [lengthIndicator, setLengthIndicator] = useState("");
  const [qty, setQty] = useState("");

  const [pageTotal, setPageTotal] = useState(undefined);
  const outerLimit = 2;
  const innerLimit = 2;
  const { currentPage, setCurrentPage, pagesCount } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 1 },
  });

  const fetchCustomerOrders = () => {
    fetchCustomerOrdersApi(currentPage).then((res) => {
      setCustomerName(res.orders[0]?.customerName);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    fetchCustomerOrders();

    return () => {
      setCustomerName("");
    };
  }, [currentPage]);

  // FETCH CUSTOMER API WITH PARAMETER CUSTOMER NAME
  const fetchOrdersApi = async () => {
    const res = await request.get(
      `Ordering/GetAllListofOrders?customer=${customerName}`
    );
    return res.data;
  };

  const fetchOrders = () => {
    fetchOrdersApi(customerName).then((res) => {
      setOrders(res);
      setLengthIndicator(res.length);
    });
  };

  useEffect(() => {
    if (customerName) {
      fetchOrders();
    }

    return () => {
      setOrders([]);
    };
  }, [customerName]);

  return (
    <>
      <VStack w="full" h="auto" bg="form">
        <PreparationListOrders
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          pagesCount={pagesCount}
          setCustomerName={setCustomerName}
          customerName={customerName}
          orders={orders}
          pageTotal={pageTotal}
          setTransactId={setTransactId}
          transactId={transactId}
          fetchCustomerOrders={fetchCustomerOrders}
          fetchOrders={fetchOrders}
          lengthIndicator={lengthIndicator}
          qty={qty}
          setQty={setQty}
          // fetchNotification={fetchNotification}
        />
      </VStack>
    </>
  );
};

export default PrepartionSchedule;
