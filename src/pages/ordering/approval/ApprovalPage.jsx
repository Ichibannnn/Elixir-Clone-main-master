import React, { useState, useEffect } from "react";
import { Box, Flex, Stack, VStack } from "@chakra-ui/react";
import { ListOfOrders } from "./ListOfOrders";
import request from "../../../services/ApiClient";
import { ListOfPreparedOrders } from "./ListOfPreparedOrders";

const fetchOrderListApi = async (status) => {
  const res = await request.get(
    `Ordering/GetAllListForApprovalOfSchedule?status=${status}`
  );
  return res.data;
};

const fetchOrdersByOrderNoApi = async (orderNo) => {
  const res = await request.get(
    `Ordering/GetAllOrdersForScheduleApproval?id=${orderNo}`
  );
  return res.data;
};

const ApprovalPage = ({ notification, fetchNotification }) => {
  const [orderNo, setOrderNo] = useState("");
  const [orderIds, setOrderIds] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [status, setStatus] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [genusData, setGenusData] = useState([]);

  const fetchOrderList = () => {
    fetchOrderListApi(status).then((res) => {
      setOrders(res);
    });
  };

  // console.log(orders);

  useEffect(() => {
    fetchOrderList();

    return () => {
      setOrders([]);
    };
  }, [status]);

  const fetchOrdersByOrderNo = () => {
    fetchOrdersByOrderNoApi(orderNo).then((res) => {
      setCustomerOrders(res);
    });
  };

  useEffect(() => {
    if (orderNo) {
      fetchOrdersByOrderNo();
    }

    return () => {
      setCustomerOrders([]);
    };
  }, [orderNo]);

  return (
    <Flex color="fontColor" w="full" flexDirection="column" p={2} bg="white">
      <VStack w="full">
        <ListOfPreparedOrders
          orders={orders}
          orderNo={orderNo}
          setOrderNo={setOrderNo}
          customerOrders={customerOrders}
          status={status}
          setStatus={setStatus}
          orderIds={orderIds}
          setOrderIds={setOrderIds}
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
          genusData={genusData}
          setGenusData={setGenusData}
          notification={notification}
          fetchNotification={fetchNotification}
        />
        <ListOfOrders
          customerOrders={customerOrders}
          orderNo={orderNo}
          setOrderNo={setOrderNo}
          fetchOrderList={fetchOrderList}
          fetchOrdersByOrderNo={fetchOrdersByOrderNo}
          orderIds={orderIds}
          genusData={genusData}
          checkedItems={checkedItems}
          fetchNotification={fetchNotification}
        />
      </VStack>
    </Flex>
  );
};

export default ApprovalPage;

// import React, { useState, useEffect } from "react";
// import { Box, Flex, Stack, VStack } from "@chakra-ui/react";
// import { ListOfOrders } from "./ListOfOrders";
// import request from "../../../services/ApiClient";
// import { ListOfPreparedOrders } from "./ListOfPreparedOrders";

// const fetchOrderListApi = async () => {
//   const res = await request.get(`Ordering/GetAllListForApprovalOfSchedule`);
//   return res.data;
// };

// const fetchOrdersByOrderNoApi = async (orderNo) => {
//   const res = await request.get(
//     `Ordering/GetAllOrdersForScheduleApproval?id=${orderNo}`
//   );
//   return res.data;
// };

// const ApprovalPage = () => {
//   const [orderNo, setOrderNo] = useState("");
//   const [orders, setOrders] = useState([]);
//   const [customerOrders, setCustomerOrders] = useState([]);

//   const fetchOrderList = () => {
//     fetchOrderListApi().then((res) => {
//       setOrders(res);
//     });
//   };

//   useEffect(() => {
//     fetchOrderList();

//     return () => {
//       setOrders([]);
//     };
//   }, []);

//   const fetchOrdersByOrderNo = () => {
//     fetchOrdersByOrderNoApi(orderNo).then((res) => {
//       setCustomerOrders(res);
//     });
//   };

//   useEffect(() => {
//     if (orderNo) {
//       fetchOrdersByOrderNo();
//     }

//     return () => {
//       setCustomerOrders([]);
//     };
//   }, [orderNo]);

//   return (
//     <Flex
//       color="fontColor"
//       w="full"
//       flexDirection="column"
//       p={2}
//       bg="form"
//       boxShadow="md"
//     >
//       <VStack w="full">
//         <ListOfPreparedOrders
//           orders={orders}
//           orderNo={orderNo}
//           setOrderNo={setOrderNo}
//           customerOrders={customerOrders}
//         />
//         <ListOfOrders
//           customerOrders={customerOrders}
//           orderNo={orderNo}
//           setOrderNo={setOrderNo}
//           fetchOrderList={fetchOrderList}
//           fetchOrdersByOrderNo={fetchOrdersByOrderNo}
//         />
//       </VStack>
//     </Flex>
//   );
// };

// export default ApprovalPage;
