import React, { useState, useEffect } from "react";
import {
  Button,
  Flex,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { ListofApprovedDate, ListOfApprovedDate } from "./ListOfApprovedDate";
import { usePagination } from "@ajna/pagination";
import { ToastComponent } from "../../components/Toast";
import request from "../../services/ApiClient";
import { ListOfOrders } from "./ListOfOrders";
import { ActualItemQuantity } from "./ActualItemQuantity";
import { SaveButton } from "./ActionModal";
import { PreparedItem } from "./PreparedItem";

//Pagination
// const fetchMoveOrderApi = async () => {
//   const res = await request.get(
//     `Ordering/GetAllListForMoveOrderPaginationOrig?pageSize=1&pageNumber=50000`
//   );
//   return res.data;
// };

//List of Approved Move Orders

const MoveOrder = ({ notification, fetchNotification }) => {
  const [batchNumber, setBatchNumber] = useState("");
  const [moveData, setMoveData] = useState([]);
  const [lengthIndicator, setLengthIndicator] = useState("");

  const [orderId, setOrderId] = useState("");
  const [orderListData, setOrderListData] = useState([]);

  const [highlighterId, setHighlighterId] = useState("");

  const [qtyOrdered, setQtyOrdered] = useState("");
  const [preparedQty, setPreparedQty] = useState("");

  const [warehouseId, setWarehouseId] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [barcodeData, setBarcodeData] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(false);
  const [pageTotal, setPageTotal] = useState(undefined);

  const [preparedData, setPreparedData] = useState([]);

  let [buttonChanger, setButtonChanger] = useState(false);

  // console.log(notification);

  const fetchApprovedMoveOrdersApi = async (
    pageNumber,
    pageSize,
    status,
    search
  ) => {
    const res = await request.get(
      `Ordering/GetAllListOfApprovedPreparedforMoveOrder?PageNumber=${pageNumber}&PageSize=${pageSize}&status=${status}&search=${search}`
    );
    return res.data;
  };

  //List of Orders
  const fetchOrderListApi = async (orderId) => {
    const res = await request.get(
      `Ordering/GetAllListOfOrdersForMoveOrder?id=${orderId}`
    );
    return res.data;
  };

  //Actual Item Quantity || Barcode Details
  // const fetchBarcodeDetailsApi = async (warehouseId, itemCode) => {
  //   const res = await request.get(
  //     `Ordering/GetAvailableStockFromWarehouse?id=${warehouseId}&itemcode=${itemCode}`
  //   );
  //   return res.data;
  // };

  const fetchBarcodeDetailsApi = async (warehouseId, itemCode) => {
    const res = await request.get(`Ordering/GetAvailableStockFromWarehouse`, {
      params: {
        id: warehouseId,
        itemCode: itemCode,
      },
    });
    return res.data;
  };

  //Prepared Items
  const fetchPreparedItemsApi = async (orderId) => {
    const res = await request.get(
      `Ordering/ListOfPreparedItemsForMoveOrder?id=${orderId}`
    );
    return res.data;
  };

  //PAGINATION
  const outerLimit = 2;
  const innerLimit = 2;
  const {
    currentPage,
    setCurrentPage,
    pagesCount,
    pages,
    setPageSize,
    pageSize,
  } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 5 },
  });

  //Approved Move Orders
  const fetchApprovedMoveOrders = () => {
    fetchApprovedMoveOrdersApi(currentPage, pageSize, status, search).then(
      (res) => {
        setMoveData(res);
        setLengthIndicator(res.length);
        // setOrderId(res[0]?.id);
        setPageTotal(res.totalCount);
        // console.log(res);
      }
    );
  };

  useEffect(() => {
    fetchApprovedMoveOrders();

    return () => {
      setMoveData([]);
    };
  }, [currentPage, pageSize, status, search]);

  //List of Orders
  const fetchOrderList = () => {
    fetchOrderListApi(orderId).then((res) => {
      setOrderListData(res);
    });
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderList();
    }

    return () => {
      setOrderListData([]);
    };
  }, [orderId]);

  //Barcode Details
  const toast = useToast();
  const fetchBarcodeDetails = () => {
    fetchBarcodeDetailsApi(warehouseId, itemCode)
      .then((res) => {
        setBarcodeData(res);
      })
      .catch((err) => {
        ToastComponent("Error", err.response.data, "error", toast);
      });
  };

  useEffect(() => {
    if (warehouseId && itemCode) {
      fetchBarcodeDetails();
    }

    return () => {
      setBarcodeData([]);
    };
  }, [warehouseId, itemCode]);

  //Prepared Items

  const fetchPreparedItems = () => {
    fetchPreparedItemsApi(orderId).then((res) => {
      setPreparedData(res);
    });
  };

  useEffect(() => {
    if (orderId) {
      fetchPreparedItems();
    }

    return () => {
      setPreparedData([]);
    };
  }, [orderId]);

  //UseEffect for button change Add-Save
  useEffect(() => {
    if (orderListData.length > 0) {
      const variable = orderListData.every(
        (item) => item.preparedQuantity === item.quantityOrder
      );
      setButtonChanger(variable);
    }
  }, [orderListData]);

  return (
    <>
      <VStack color="fontColor" w="full" p={4} bg="form">
        <ListofApprovedDate
          moveData={moveData}
          status={status}
          setStatus={setStatus}
          setPageSize={setPageSize}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          pagesCount={pagesCount}
          pages={pages}
          setOrderId={setOrderId}
          orderId={orderId}
          setItemCode={setItemCode}
          setWarehouseId={setWarehouseId}
          setHighlighterId={setHighlighterId}
          setBatchNumber={setBatchNumber}
          buttonChanger={buttonChanger}
          setButtonChanger={setButtonChanger}
          fetchApprovedMoveOrders={fetchApprovedMoveOrders}
          lengthIndicator={lengthIndicator}
          preparedLength={preparedData?.length}
          orderListData={orderListData}
          search={search}
          setSearch={setSearch}
          notification={notification}
          fetchNotification={fetchNotification}
        />
        {orderId ? (
          <ListOfOrders
            orderListData={orderListData}
            setItemCode={setItemCode}
            highlighterId={highlighterId}
            setHighlighterId={setHighlighterId}
            setQtyOrdered={setQtyOrdered}
            setPreparedQty={setPreparedQty}
            setWarehouseId={setWarehouseId}
            status={status}
          />
        ) : (
          ""
        )}
        {buttonChanger ? (
          <SaveButton
            orderId={orderId}
            batchNumber={batchNumber}
            orderListData={orderListData}
            fetchPreparedItems={fetchPreparedItems}
            fetchApprovedMoveOrders={fetchApprovedMoveOrders}
            fetchOrderList={fetchOrderList}
            setOrderId={setOrderId}
            setHighlighterId={setHighlighterId}
            setItemCode={setItemCode}
            setButtonChanger={setButtonChanger}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            moveData={moveData}
            fetchNotification={fetchNotification}
          />
        ) : (
          itemCode &&
          highlighterId && (
            <ActualItemQuantity
              setWarehouseId={setWarehouseId}
              warehouseId={warehouseId}
              barcodeData={barcodeData}
              orderId={orderId}
              highlighterId={highlighterId}
              itemCode={itemCode}
              fetchOrderList={fetchOrderList}
              fetchPreparedItems={fetchPreparedItems}
              qtyOrdered={qtyOrdered}
              preparedQty={preparedQty}
              setHighlighterId={setHighlighterId}
              setItemCode={setItemCode}
            />
          )
        )}
        {preparedData.length > 0 && (
          <PreparedItem
            preparedData={preparedData}
            fetchPreparedItems={fetchPreparedItems}
            fetchOrderList={fetchOrderList}
            fetchNotification={fetchNotification}
          />
        )}
      </VStack>
    </>
  );
};

export default MoveOrder;

// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Flex,
//   useDisclosure,
//   useToast,
//   VStack,
// } from "@chakra-ui/react";
// import { ListofApprovedDate, ListOfApprovedDate } from "./ListOfApprovedDate";
// import { usePagination } from "@ajna/pagination";
// import { ToastComponent } from "../../components/Toast";
// import request from "../../services/ApiClient";
// import { ListOfOrders } from "./ListOfOrders";
// import { ActualItemQuantity } from "./ActualItemQuantity";
// import { SaveButton } from "./ActionModal";
// import { PreparedItem } from "./PreparedItem";

// //Pagination
// const fetchMoveOrderApi = async (pageNumber) => {
//   const res = await request.get(
//     `Ordering/GetAllListForMoveOrderPagination?pageSize=1&pageNumber=${pageNumber}`
//   );
//   return res.data;
// };

// //List of Approved Move Orders

// const fetchApprovedMoveOrdersApi = async (customerName) => {
//   const res = await request.get(
//     `Ordering/GetAllListOfApprovedPreparedforMoveOrder?customername=${customerName}`
//   );
//   return res.data;
// };

// //List of Orders

// const fetchOrderListApi = async (orderId) => {
//   const res = await request.get(
//     `Ordering/GetAllListOfOrdersForMoveOrder?id=${orderId}`
//   );
//   return res.data;
// };

// //Actual Item Quantity || Barcode Details
// const fetchBarcodeDetailsApi = async (warehouseId, itemCode) => {
//   const res = await request.get(
//     `Ordering/GetAvailableStockFromWarehouse?id=${warehouseId}&itemcode=${itemCode}`
//   );
//   return res.data;
// };

// //Prepared Items

// const fetchPreparedItemsApi = async (orderId) => {
//   const res = await request.get(
//     `Ordering/ListOfPreparedItemsForMoveOrder?id=${orderId}`
//   );
//   return res.data;
// };

// const MoveOrder = () => {
//   const [customerName, setCustomerName] = useState("");

//   // const [deliveryStatus, setDeliveryStatus] = useState("");
//   const [batchNumber, setBatchNumber] = useState("");

//   const [moveData, setMoveData] = useState([]);
//   const [lengthIndicator, setLengthIndicator] = useState("");

//   const [orderId, setOrderId] = useState("");
//   const [orderListData, setOrderListData] = useState([]);

//   const [highlighterId, setHighlighterId] = useState("");

//   const [qtyOrdered, setQtyOrdered] = useState("");
//   const [preparedQty, setPreparedQty] = useState("");

//   const [warehouseId, setWarehouseId] = useState("");
//   const [itemCode, setItemCode] = useState("");
//   const [barcodeData, setBarcodeData] = useState([]);
//   // const [nearlyExpireBarcode, setNearlyExpireBarcode] = useState("");

//   const [preparedData, setPreparedData] = useState([]);

//   let [buttonChanger, setButtonChanger] = useState(false);

//   const [pageTotal, setPageTotal] = useState(undefined);
//   const outerLimit = 2;
//   const innerLimit = 2;
//   const { currentPage, setCurrentPage, pagesCount, pages } = usePagination({
//     total: pageTotal,
//     limits: {
//       outer: outerLimit,
//       inner: innerLimit,
//     },
//     initialState: { currentPage: 1, pageSize: 1 },
//   });

//   //Pagination

//   const fetchMoveOrder = () => {
//     fetchMoveOrderApi(currentPage).then((res) => {
//       setCustomerName(res?.orders[0]?.customerName);
//       setPageTotal(res.totalCount);
//     });
//   };

//   useEffect(() => {
//     if (currentPage) {
//       fetchMoveOrder();
//     }

//     return () => {
//       setCustomerName("");
//     };
//   }, [currentPage]);

//   //Approved Move Orders

//   const fetchApprovedMoveOrders = () => {
//     fetchApprovedMoveOrdersApi(customerName).then((res) => {
//       setMoveData(res);
//       setLengthIndicator(res.length);
//       setOrderId(res[0]?.id);
//     });
//   };

//   // console.log(orderId)

//   useEffect(() => {
//     if (customerName) {
//       fetchApprovedMoveOrders();
//     }

//     return () => {
//       setMoveData([]);
//     };
//   }, [customerName]);

//   //List of Orders

//   const fetchOrderList = () => {
//     fetchOrderListApi(orderId).then((res) => {
//       setOrderListData(res);
//     });
//   };

//   useEffect(() => {
//     if (orderId) {
//       fetchOrderList();
//     }

//     return () => {
//       setOrderListData([]);
//     };
//   }, [orderId]);

//   //Barcode Details
//   const toast = useToast();
//   const fetchBarcodeDetails = () => {
//     fetchBarcodeDetailsApi(warehouseId, itemCode)
//       .then((res) => {
//         setBarcodeData(res);
//         // setNearlyExpireBarcode(res?.warehouseId);
//       })
//       .catch((err) => {
//         ToastComponent("Error", err.response.data, "error", toast);
//       });
//   };

//   useEffect(() => {
//     if (warehouseId && itemCode) {
//       fetchBarcodeDetails();
//     }

//     return () => {
//       setBarcodeData([]);
//     };
//   }, [warehouseId, itemCode]);

//   //Prepared Items

//   const fetchPreparedItems = () => {
//     fetchPreparedItemsApi(orderId).then((res) => {
//       setPreparedData(res);
//     });
//   };

//   useEffect(() => {
//     if (orderId) {
//       fetchPreparedItems();
//     }

//     return () => {
//       setPreparedData([]);
//     };
//   }, [orderId]);

//   //UseEffect for button change Add-Save
//   useEffect(() => {
//     if (orderListData.length > 0) {
//       const variable = orderListData.every(
//         (item) => item.preparedQuantity === item.quantityOrder
//       );
//       setButtonChanger(variable);
//     }
//   }, [orderListData]);

//   return (
//     <>
//       <VStack color="fontColor" w="full" p={4} bg="form" boxShadow="md">
//         <ListofApprovedDate
//           customerName={customerName}
//           moveData={moveData}
//           setCurrentPage={setCurrentPage}
//           currentPage={currentPage}
//           pagesCount={pagesCount}
//           setOrderId={setOrderId}
//           orderId={orderId}
//           setItemCode={setItemCode}
//           setWarehouseId={setWarehouseId}
//           setHighlighterId={setHighlighterId}
//           // setDeliveryStatus={setDeliveryStatus}
//           setBatchNumber={setBatchNumber}
//           buttonChanger={buttonChanger}
//           fetchApprovedMoveOrders={fetchApprovedMoveOrders}
//           lengthIndicator={lengthIndicator}
//           preparedLength={preparedData?.length}
//           orderListData={orderListData}
//         />
//         {orderId ? (
//           <ListOfOrders
//             orderListData={orderListData}
//             setItemCode={setItemCode}
//             highlighterId={highlighterId}
//             setHighlighterId={setHighlighterId}
//             setQtyOrdered={setQtyOrdered}
//             setPreparedQty={setPreparedQty}
//             setWarehouseId={setWarehouseId}
//           />
//         ) : (
//           ""
//         )}
//         {buttonChanger ? (
//           <SaveButton
//             orderId={orderId}
//             // deliveryStatus={deliveryStatus}
//             // setDeliveryStatus={setDeliveryStatus}
//             batchNumber={batchNumber}
//             orderListData={orderListData}
//             fetchMoveOrder={fetchMoveOrder}
//             fetchPreparedItems={fetchPreparedItems}
//             fetchApprovedMoveOrders={fetchApprovedMoveOrders}
//             fetchOrderList={fetchOrderList}
//             setOrderId={setOrderId}
//             setHighlighterId={setHighlighterId}
//             setItemCode={setItemCode}
//             setButtonChanger={setButtonChanger}
//             setCurrentPage={setCurrentPage}
//             currentPage={currentPage}
//             moveData={moveData}
//             // fetchNotification={fetchNotification}
//           />
//         ) : (
//           itemCode &&
//           highlighterId && (
//             <ActualItemQuantity
//               setWarehouseId={setWarehouseId}
//               warehouseId={warehouseId}
//               barcodeData={barcodeData}
//               orderId={orderId}
//               highlighterId={highlighterId}
//               itemCode={itemCode}
//               fetchOrderList={fetchOrderList}
//               fetchPreparedItems={fetchPreparedItems}
//               qtyOrdered={qtyOrdered}
//               preparedQty={preparedQty}
//               setHighlighterId={setHighlighterId}
//               setItemCode={setItemCode}
//             />
//           )
//         )}
//         {preparedData.length > 0 && (
//           <PreparedItem
//             preparedData={preparedData}
//             fetchPreparedItems={fetchPreparedItems}
//             fetchOrderList={fetchOrderList}
//           />
//         )}
//       </VStack>
//     </>
//   );
// };

// export default MoveOrder;
