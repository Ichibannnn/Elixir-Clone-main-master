import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Checkbox,
  Flex,
  HStack,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import moment from "moment";
import PageScroll from "../../../utils/PageScroll";

export const ListOfPreparedOrders = ({
  orders,
  orderNo,
  setOrderNo,
  customerOrders,
  status,
  setStatus,
  orderIds,
  setOrderIds,
  checkedItems,
  setCheckedItems,
  notification,
  fetchNotification,
  genusData,
  setGenusData,
}) => {
  const orderNoHandler = (mirId) => {
    if (mirId) {
      setOrderNo(mirId);
    } else {
      setOrderNo("");
    }
    // console.log(orderNo);
  };

  //Auto select index 0
  useEffect(() => {
    setOrderNo(orders[0]?.mirId);
  }, [orders]);

  const allOrders = orders?.map((item) => item.mirId);

  const parentCheckHandler = (e) => {
    if (e.target.checked) {
      setCheckedItems(allOrders);

      // console.log(orders);

      const genusAllOrders = orders?.map((item) => ({
        mir_id: item.mirId,
        status: "For preparation",
        orders: item.order.map((orderItem) => ({
          order_id: orderItem.orderNo,
          quantity_served: null,
        })),
      }));
      setGenusData(genusAllOrders);
    } else {
      setCheckedItems([]);
      setGenusData([]);
    }
  };
  // console.log(checkedItems);
  // console.log(genusData);

  const childCheckHandler = (e) => {
    //GENUS
    if (e.target.checked) {
      const item = orders.find(
        (order) => order.mirId === parseInt(e.target.value)
      );

      if (item) {
        const { mirId, order } = item;

        const transaction = {
          mir_id: mirId,
          status: "For preparation",
          orders: order.map((orderItem) => ({
            order_id: orderItem.orderNo,
            quantity_served: null,
          })),
        };
        setGenusData((prevValue) => [...prevValue, transaction]);
      }
      // ELIXIR
      setCheckedItems([...checkedItems, parseInt(e.target.value)]);
    } else {
      //GENUS
      setGenusData((prevValue) => [
        ...prevValue.filter(
          (item) => item.mir_id.toString() !== e.target.value
        ),
      ]);

      //ELIXIR
      const data = checkedItems?.filter(
        (item) => item !== parseInt(e.target.value)
      );
      setCheckedItems(data);
    }
  };

  useEffect(() => {
    setOrderIds(checkedItems);
    return () => {
      setOrderIds([]);
    };
  }, [checkedItems]);

  return (
    <Flex w="100%" flexDirection="column" className="boxShadow" p={4}>
      <Flex direction="row" justifyContent="left">
        <Button
          size="xs"
          fontSize="xs"
          borderRadius="none"
          colorScheme={!status ? "blue" : "gray"}
          variant={!status ? "solid" : "outline"}
          onClick={() => setStatus(false)}
        >
          Regular Orders
          {notification?.orderingApprovalNotRush
            ?.orderingapprovalcountNotRush === 0 ? (
            ""
          ) : (
            <Badge
              ml={2}
              fontSize="10px"
              variant="solid"
              colorScheme="red"
              mb={1}
            >
              {
                notification?.orderingApprovalNotRush
                  ?.orderingapprovalcountNotRush
              }
            </Badge>
          )}
        </Button>
        <Button
          size="xs"
          fontSize="xs"
          borderRadius="none"
          colorScheme={status ? "blue" : "gray"}
          variant={status ? "solid" : "outline"}
          onClick={() => setStatus(true)}
        >
          Rush Orders
          {notification?.orderingApproval?.orderingapprovalcount === 0 ? (
            ""
          ) : (
            <Badge
              ml={2}
              fontSize="10px"
              variant="solid"
              colorScheme="red"
              mb={1}
            >
              {notification?.orderingApproval?.orderingapprovalcount}
            </Badge>
          )}
        </Button>
      </Flex>
      <Flex flexDirection="column">
        <Text
          textAlign="center"
          bgColor="secondary"
          color="white"
          fontSize="13px"
        >
          LIST OF PREPARED DATE
        </Text>
        <PageScroll minHeight="300px" maxHeight="400px">
          <Table size="sm" variant="simple">
            {status === false ? (
              <Thead bgColor="secondary" position="sticky" top={0} zIndex={1}>
                <Tr h="30px">
                  <Th color="white" fontSize="11px">
                    <Checkbox
                      onChange={parentCheckHandler}
                      isChecked={
                        allOrders?.length === checkedItems?.length
                        // genusData?.length
                      }
                      disabled={!allOrders?.length > 0}
                    />{" "}
                    Line
                  </Th>
                  <Th color="white" fontSize="11px">
                    MIR ID
                  </Th>
                  <Th color="white" fontSize="11px">
                    Customer Code
                  </Th>
                  <Th color="white" fontSize="11px">
                    Customer Name
                  </Th>
                  <Th color="white" fontSize="11px">
                    Total Quantity Order
                  </Th>
                  <Th color="white" fontSize="11px">
                    Preparation Date
                  </Th>
                </Tr>
              </Thead>
            ) : (
              <Thead bgColor="secondary" position="sticky" top={0} zIndex={1}>
                <Tr h="30px">
                  <Th color="white" fontSize="11px">
                    <Checkbox
                      onChange={parentCheckHandler}
                      isChecked={
                        allOrders?.length === checkedItems?.length &&
                        genusData?.length
                      }
                      disabled={!allOrders?.length > 0}
                    />{" "}
                    Line
                  </Th>
                  <Th color="white" fontSize="11px">
                    MIR ID
                  </Th>
                  <Th color="white" fontSize="11px">
                    Customer Code
                  </Th>
                  <Th color="white" fontSize="11px">
                    Customer Name
                  </Th>
                  <Th color="white" fontSize="11px">
                    Total Quantity Order
                  </Th>
                  <Th color="white" fontSize="11px">
                    Preparation Date
                  </Th>
                  <Th color="white" fontSize="11px">
                    Reason
                  </Th>
                </Tr>
              </Thead>
            )}

            {status === false ? (
              <Tbody>
                {orders?.map((item, i) => (
                  <Tr
                    onClick={() => orderNoHandler(item.mirId)}
                    bgColor={orderNo === item.mirId ? "blue.100" : "none"}
                    key={i}
                    cursor="pointer"
                  >
                    <Td fontSize="xs">
                      <Checkbox
                        onChange={childCheckHandler}
                        isChecked={checkedItems.includes(item.mirId)}
                        value={item.mirId}
                        color="black"
                      >
                        <Text fontSize="xs">{i + 1}</Text>
                      </Checkbox>
                    </Td>
                    <Td fontSize="xs">{item.mirId}</Td>
                    <Td fontSize="xs">{item.customerCode}</Td>
                    <Td fontSize="xs">{item.customerName} </Td>
                    <Td fontSize="xs">{item.totalOrders}</Td>
                    <Td fontSize="xs">
                      {moment(item.preparedDate).format("MM/DD/yyyy")}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            ) : (
              <Tbody>
                {orders?.map((item, i) => (
                  <Tr
                    onClick={() => orderNoHandler(item.mirId)}
                    bgColor={orderNo === item.mirId ? "blue.100" : "none"}
                    key={i}
                    cursor="pointer"
                  >
                    <Td fontSize="xs">
                      <Checkbox
                        onChange={childCheckHandler}
                        isChecked={checkedItems.includes(item.mirId)}
                        value={item.mirId}
                        color="black"
                      >
                        <Text fontSize="xs">{i + 1}</Text>
                      </Checkbox>
                    </Td>
                    <Td fontSize="xs">{item.mirId}</Td>
                    <Td fontSize="xs">{item.customerCode}</Td>
                    <Td fontSize="xs">{item.customerName} </Td>
                    <Td fontSize="xs">{item.totalOrders}</Td>
                    <Td fontSize="xs">
                      {moment(item.preparedDate).format("MM/DD/yyyy")}
                    </Td>
                    <Td fontSize="xs">{item.rush}</Td>
                  </Tr>
                ))}
              </Tbody>
            )}
          </Table>
        </PageScroll>
      </Flex>
    </Flex>
  );
};

// import React, { useEffect } from "react";
// import {
//   Badge,
//   Button,
//   Flex,
//   HStack,
//   Select,
//   Table,
//   Tbody,
//   Td,
//   Text,
//   Th,
//   Thead,
//   Tr,
// } from "@chakra-ui/react";

// import moment from "moment";
// import PageScroll from "../../../utils/PageScroll";

// export const ListOfPreparedOrders = ({
//   orders,
//   orderNo,
//   setOrderNo,
//   customerOrders,
//   status,
//   setStatus,
// }) => {
//   const orderNoHandler = (id) => {
//     if (id) {
//       setOrderNo(id);
//     } else {
//       setOrderNo("");
//     }
//     console.log(orderNo);
//   };

//   //Auto select index 0
//   useEffect(() => {
//     setOrderNo(orders[0]?.orderNoPKey);
//   }, [orders]);

//   const handleStatusChange = (newStatus) => {
//     setStatus(newStatus);
//     setSelectedMIRIds([]); // Reset selected MIR IDs when changing status
//   };

//   // console.log(customerOrders);
//   // console.log(orders);

//   // const rushBadge = customerOrders?.some((x) => (x.rush ? true : false));

//   return (
//     <Flex w="95%" h="250px" flexDirection="column">
//       <Flex direction="row" justifyContent="left">
//         <Button
//           size="xs"
//           fontSize="xs"
//           borderRadius="none"
//           colorScheme={!status ? "blue" : "gray"}
//           variant={!status ? "solid" : "outline"}
//           onClick={() => handleStatusChange(false)}
//         >
//           Regular Orders
//           {/* {regularOrdersCount > 0 && (
//             // <Badge ml={2} colorScheme="red" variant="solid" borderRadius="40%">
//             //   {regularOrdersCount}
//             // </Badge>
//           )} */}
//         </Button>
//         <Button
//           size="xs"
//           fontSize="xs"
//           borderRadius="none"
//           colorScheme={status ? "blue" : "gray"}
//           variant={status ? "solid" : "outline"}
//           onClick={() => handleStatusChange(true)}
//         >
//           Rush Orders
//           {/* {rushOrdersCount > 0 && (
//             <Badge ml={2} colorScheme="red" variant="solid" borderRadius="40%">
//               {rushOrdersCount}
//             </Badge>
//           )} */}
//         </Button>
//       </Flex>
//       <Flex flexDirection="column">
//         <Text
//           textAlign="center"
//           bgColor="secondary"
//           color="white"
//           fontSize="13px"
//         >
//           List of Prepared Date
//         </Text>
//         <PageScroll minHeight="200px" maxHeight="210px">
//           <Table size="sm" variant="simple">
//             <Thead bgColor="secondary" position="sticky" top={0} zIndex={1}>
//               <Tr h="30px">
//                 <Th color="white" fontSize="10px">
//                   Line
//                 </Th>
//                 <Th color="white" fontSize="10px">
//                   Order ID
//                 </Th>
//                 <Th color="white" fontSize="10px">
//                   Customer Code
//                 </Th>
//                 <Th color="white" fontSize="10px">
//                   Customer Name
//                 </Th>
//                 <Th color="white" fontSize="10px">
//                   Total Quantity Order
//                 </Th>
//                 <Th color="white" fontSize="10px">
//                   Prepared Date
//                 </Th>
//                 <Th color="white" fontSize="10px">
//                   Status
//                 </Th>
//               </Tr>
//             </Thead>
//             <Tbody>
//               {orders?.map((item, i) => (
//                 <Tr
//                   onClick={() => orderNoHandler(item.orderNoPKey)}
//                   bgColor={orderNo === item.orderNoPKey ? "blue.100" : "none"}
//                   key={i}
//                   cursor="pointer"
//                 >
//                   <Td fontSize="xs">{i + 1}</Td>
//                   <Td fontSize="xs">{item.orderNoPKey}</Td>
//                   {/* <Td fontSize="xs">{item.department}</Td> */}
//                   <Td fontSize="xs">{item.customerCode}</Td>
//                   <Td fontSize="xs">
//                     {item.customerName}{" "}
//                     {/* <Badge
//                       fontSize="9.5px"
//                       colorScheme="orange"
//                       variant="solid"
//                       className="inputCapital"
//                     >
//                       {rushBadge && "Rush"}
//                     </Badge> */}
//                     {/* {!!customerOrders?.find(
//                         (order) => order.orderNo === item.orderNoPKey
//                       )?.rush && "Rush"} */}
//                   </Td>
//                   {/* <Td fontSize="xs">{item.category}</Td> */}
//                   <Td fontSize="xs">{item.totalOrders}</Td>
//                   <Td fontSize="xs">
//                     {moment(item.preparedDate).format("MM/DD/yyyy")}
//                   </Td>
//                   <Td fontSize="xs">
//                     {item.rush ? (
//                       <Badge
//                         fontSize="9.5px"
//                         colorScheme="orange"
//                         variant="solid"
//                         className="inputCapital"
//                       >
//                         Rush
//                       </Badge>
//                     ) : (
//                       ""
//                     )}
//                   </Td>
//                 </Tr>
//               ))}
//             </Tbody>
//           </Table>
//         </PageScroll>
//       </Flex>
//     </Flex>
//   );
// };
