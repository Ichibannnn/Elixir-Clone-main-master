// import React, { useEffect, useState } from "react";
// import {
//   Badge,
//   Box,
//   Button,
//   Checkbox,
//   Flex,
//   HStack,
//   Input,
//   Menu,
//   MenuButton,
//   MenuItem,
//   MenuList,
//   Select,
//   Table,
//   Tbody,
//   Td,
//   Text,
//   Th,
//   Thead,
//   Tr,
//   useDisclosure,
// } from "@chakra-ui/react";
// // import PageScrollReusable from '../../../components/PageScroll-Reusable'
// // import { ApproveModal, RejectModal, ViewModal } from './Action-Modals'
// import {
//   Pagination,
//   usePagination,
//   PaginationNext,
//   PaginationPage,
//   PaginationPrevious,
//   PaginationContainer,
//   PaginationPageGroup,
// } from "@ajna/pagination";
// import moment from "moment";
// import PageScroll from "../../../utils/PageScroll";
// import { ApproveModal, RejectModal, ViewModal } from "./ActionModal";
// import { FaShippingFast } from "react-icons/fa";
// import { AiOutlineMore } from "react-icons/ai";
// import { GrView } from "react-icons/gr";
// import { GiCancel } from "react-icons/gi";

// export const ForApprovalMoveOrder = ({
//   setCurrentPage,
//   setPageSize,
//   setSearch,
//   pagesCount,
//   currentPage,
//   pageSize,
//   forApprovalData,
//   fetchForApprovalMO,
//   mirId,
//   setMirId,
//   viewData,
//   status,
//   setStatus,
//   checkedItems,
//   setCheckedItems,
//   setMirNo,
//   mirNo,
//   notification,
//   fetchNotification,
// }) => {
//   const TableHead = [
//     "Line",
//     "MIR ID",
//     "Customer Code",
//     "Customer Name",
//     // "Category",
//     "Total Quantity Order",
//     "Prepared Date",
//     "Rush",
//     "View",
//     // "Approve",
//     "Reject",
//   ];

//   const [totalQuantity, setTotalQuantity] = useState("");

//   const {
//     isOpen: isView,
//     onClose: closeView,
//     onOpen: openView,
//   } = useDisclosure();
//   const {
//     isOpen: isApprove,
//     onClose: closeApprove,
//     onOpen: openApprove,
//   } = useDisclosure();
//   const {
//     isOpen: isReject,
//     onClose: closeReject,
//     onOpen: openReject,
//   } = useDisclosure();

//   const handlePageChange = (nextPage) => {
//     setCurrentPage(nextPage);
//   };

//   const handlePageSizeChange = (e) => {
//     const pageSize = Number(e.target.value);
//     setPageSize(pageSize);
//   };

//   const searchHandler = (inputValue) => {
//     setSearch(inputValue);
//   };

//   const viewHandler = (id) => {
//     if (id) {
//       setMirId(id);
//     } else {
//       setMirId("");
//     }
//     openView();
//   };

//   const rejectHandler = (id) => {
//     if (id) {
//       setMirId(id);
//     } else {
//       setMirId("");
//     }
//     openReject();
//   };

//   const handleStatusChange = (newStatus) => {
//     setStatus(newStatus);
//   };

//   const allOrders = forApprovalData?.moveorder?.map((item) => item.mirId);

//   const parentCheckHandler = (e) => {
//     if (e.target.checked) {
//       setCheckedItems(allOrders);
//     } else {
//       setCheckedItems([]);
//     }
//   };

//   const childCheckHandler = (e) => {
//     if (e.target.checked) {
//       setCheckedItems([...checkedItems, parseInt(e.target.value)]);
//     } else {
//       const data = checkedItems?.filter(
//         (item) => item !== parseInt(e.target.value)
//       );
//       setCheckedItems(data);
//     }
//   };

//   useEffect(() => {
//     setMirNo(checkedItems);

//     console.log(mirId);

//     return () => {
//       setMirNo([]);
//     };
//   }, [checkedItems]);

//   const approveModal = () => {
//     openApprove();
//   };

//   return (
//     <Flex w="full" flexDirection="column" p={5} bg="form">
//       <Flex justifyContent="space-between">
//         <Select
//           onChange={handlePageSizeChange}
//           w="7%"
//           variant="filled"
//           fontSize="11px"
//           borderColor="gray.400"
//         >
//           <option value={Number(10)}>10</option>
//           <option value={Number(20)}>20</option>
//           <option value={Number(30)}>30</option>
//           <option value={Number(50)}>50</option>
//         </Select>
//         <HStack w="17%">
//           <Text fontSize="13px">Search:</Text>
//           <Input
//             borderColor="gray.400"
//             fontSize="11px"
//             placeholder="MIR Id"
//             onChange={(e) => searchHandler(e.target.value)}
//           />
//         </HStack>
//       </Flex>

//       <Flex mt={5} flexDirection="column">
//         <Flex direction="row" justifyContent="left">
//           <Button
//             size="xs"
//             fontSize="xs"
//             borderRadius="none"
//             colorScheme={!status ? "blue" : "gray"}
//             variant={!status ? "solid" : "outline"}
//             onClick={() => handleStatusChange(false)}
//           >
//             Regular Orders
//             {notification?.forApprovalMoveOrderNotRush
//               ?.forapprovalmoveordercountNotRush === 0 ? (
//               ""
//             ) : (
//               <Badge
//                 ml={2}
//                 fontSize="10px"
//                 variant="solid"
//                 colorScheme="red"
//                 mb={1}
//               >
//                 {
//                   notification?.forApprovalMoveOrderNotRush
//                     ?.forapprovalmoveordercountNotRush
//                 }
//               </Badge>
//             )}
//           </Button>
//           <Button
//             size="xs"
//             fontSize="xs"
//             borderRadius="none"
//             colorScheme={status ? "blue" : "gray"}
//             variant={status ? "solid" : "outline"}
//             onClick={() => handleStatusChange(true)}
//           >
//             Rush Orders
//             {notification?.forApprovalMoveOrder?.forapprovalmoveordercount ===
//             0 ? (
//               ""
//             ) : (
//               <Badge
//                 ml={2}
//                 fontSize="10px"
//                 variant="solid"
//                 colorScheme="red"
//                 mb={1}
//               >
//                 {notification?.forApprovalMoveOrder?.forapprovalmoveordercount}
//               </Badge>
//             )}
//           </Button>
//         </Flex>
//         <PageScroll minHeight="200px" maxHeight="480px">
//           <Table size="sm">
//             <Thead bgColor="primary" h="40px">
//               <Tr>
//                 <Th color="white" fontSize="10px">
//                   <Checkbox
//                     onChange={parentCheckHandler}
//                     isChecked={allOrders?.length === checkedItems?.length}
//                     disabled={!allOrders?.length > 0}
//                   />{" "}
//                   Line
//                 </Th>
//                 <Th color="white" fontSize="10px">
//                   MIR ID
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
//                   Action
//                 </Th>
//               </Tr>
//             </Thead>
//             <Tbody>
//               {forApprovalData?.moveorder?.map((item, i) => (
//                 <Tr key={i}>
//                   <Td fontSize="xs">
//                     <Checkbox
//                       onChange={childCheckHandler}
//                       isChecked={checkedItems.includes(item.mirId)}
//                       value={item.mirId}
//                       color="black"
//                     >
//                       <Text fontSize="xs">{i + 1}</Text>
//                     </Checkbox>
//                   </Td>

//                   <Td fontSize="xs">{item.mirId}</Td>
//                   <Td fontSize="xs">{item.customercode}</Td>
//                   <Td fontSize="xs">{item.customerName}</Td>
//                   {/* <Td fontSize="xs">{item.category}</Td> */}
//                   <Td fontSize="xs">{item.quantity}</Td>
//                   <Td fontSize="xs">
//                     {moment(item.preparedDate).format("MM/DD/yyyy")}
//                   </Td>
//                   <Td>
//                     <Flex pl={2}>
//                       <Box>
//                         <Menu>
//                           <MenuButton
//                             alignItems="center"
//                             justifyContent="center"
//                             bg="none"
//                           >
//                             <AiOutlineMore fontSize="20px" />
//                           </MenuButton>
//                           <MenuList>
//                             <MenuItem
//                               icon={<GrView fontSize="17px" />}
//                               onClick={() => viewHandler(item.mirId)}
//                             >
//                               <Text fontSize="15px">View</Text>
//                             </MenuItem>
//                             <MenuItem
//                               icon={<GiCancel fontSize="17px" />}
//                               onClick={() => rejectHandler(item.mirId)}
//                             >
//                               <Text fontSize="15px" _hover={{ color: "red" }}>
//                                 Reject
//                               </Text>
//                             </MenuItem>
//                           </MenuList>
//                         </Menu>
//                       </Box>
//                     </Flex>
//                   </Td>
//                 </Tr>
//               ))}
//             </Tbody>
//           </Table>
//         </PageScroll>
//       </Flex>

//       <Flex justifyContent="space-between" mt={7}>
//         <Text fontSize="xs">
//           {forApprovalData?.moveorder?.length > 0
//             ? `Showing ${forApprovalData?.moveorder?.length} entries`
//             : "No entries available"}
//         </Text>
//         <Flex>
//           <Button
//             colorScheme="blue"
//             size="sm"
//             borderRadius="none"
//             px={2}
//             disabled={!forApprovalData || checkedItems?.length === 0}
//             onClick={approveModal}
//           >
//             Approve
//           </Button>
//         </Flex>
//       </Flex>

//       {isView && (
//         <ViewModal
//           status={status}
//           isOpen={isView}
//           onClose={closeView}
//           id={mirId}
//           viewData={viewData}
//         />
//       )}
//       {isApprove && (
//         <ApproveModal
//           isOpen={isApprove}
//           onClose={closeApprove}
//           orderNo={mirId}
//           fetchForApprovalMO={fetchForApprovalMO}
//           printData={viewData}
//           fetchNotification={fetchNotification}
//           totalQuantity={totalQuantity}
//           mirNo={mirNo}
//           setCheckedItems={setCheckedItems}
//         />
//       )}
//       {isReject && (
//         <RejectModal
//           isOpen={isReject}
//           onClose={closeReject}
//           id={mirId}
//           fetchForApprovalMO={fetchForApprovalMO}
//           fetchNotification={fetchNotification}
//         />
//       )}
//     </Flex>
//   );
// };

// REJECT ALL CHECK ITEMS-------------------------------------------------------------------------
import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Flex,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import moment from "moment";
import PageScroll from "../../../utils/PageScroll";
import { ApproveModal, RejectModal, ViewModal } from "./ActionModal";

export const ForApprovalMoveOrder = ({
  setSearch,
  forApprovalData,
  fetchForApprovalMO,
  mirId,
  setMirId,
  viewData,
  status,
  setStatus,
  checkedItems,
  setCheckedItems,
  setMirNo,
  mirNo,
  notification,
  fetchNotification,
  genusData,
  setGenusData,
}) => {
  const TableHead = [
    "Line",
    "MIR ID",
    "Customer Code",
    "Customer Name",
    "Total Quantity Order",
    "Prepared Date",
    "Rush",
    "View",
    "Reject",
  ];

  const [totalQuantity, setTotalQuantity] = useState("");

  const {
    isOpen: isView,
    onClose: closeView,
    onOpen: openView,
  } = useDisclosure();
  const {
    isOpen: isApprove,
    onClose: closeApprove,
    onOpen: openApprove,
  } = useDisclosure();
  const {
    isOpen: isReject,
    onClose: closeReject,
    onOpen: openReject,
  } = useDisclosure();

  const searchHandler = (inputValue) => {
    setSearch(inputValue);
  };

  const viewHandler = (id) => {
    if (id) {
      setMirId(id);
    } else {
      setMirId("");
    }
    openView();
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  const allOrders = forApprovalData?.map((item) => item.mirId);

  const parentCheckHandler = (e) => {
    if (e.target.checked) {
      setCheckedItems(allOrders);
    } else {
      setCheckedItems([]);
    }
  };

  // console.log(checkedItems);
  // console.log(genusData);

  const childCheckHandler = (e) => {
    // GENUS ETD
    if (e.target.checked) {
      const item = forApprovalData?.find(
        (approvalData) => approvalData.mirId === parseInt(e.target.value)
      );

      // console.log(item);

      if (item) {
        const { mirId, order } = item;

        const transaction = {
          mir_id: mirId,
          status: "Ready for pickup",
          orders: order?.map((orderItem) => ({
            order_id: orderItem.orderNo,
            quantity_served: orderItem.quantity,
          })),
        };
        setGenusData((prevValue) => [...prevValue, transaction]);
      }
    }

    // ELIXIR
    if (e.target.checked) {
      setCheckedItems([...checkedItems, parseInt(e.target.value)]);
    } else {
      //GENUS
      // setGenusData((prevValue) => [
      //   ...prevValue.filter(
      //     (item) => item.mir_id.toString() !== e.target.value
      //   ),
      // ]);

      // ELIXIR
      const data = checkedItems?.filter(
        (item) => item !== parseInt(e.target.value)
      );
      setCheckedItems(data);
    }
  };

  useEffect(() => {
    setMirNo(checkedItems);

    // console.log(mirId);

    return () => {
      setMirNo([]);
    };
  }, [checkedItems]);

  const approveModal = () => {
    openApprove();
  };

  const rejectHandler = () => {
    openReject();
  };

  return (
    <Flex w="full" flexDirection="column" p={5} bg="form">
      <Flex justifyContent="space-between">
        <HStack></HStack>
        <HStack w="17%">
          <Text fontSize="13px">Search:</Text>
          <Input
            borderColor="gray.400"
            fontSize="11px"
            placeholder="MIR Id"
            onChange={(e) => searchHandler(e.target.value)}
          />
        </HStack>
      </Flex>

      <Flex mt={5} flexDirection="column">
        <Flex direction="row" justifyContent="left">
          <Button
            size="xs"
            fontSize="xs"
            borderRadius="none"
            colorScheme={!status ? "blue" : "gray"}
            variant={!status ? "solid" : "outline"}
            onClick={() => handleStatusChange(false)}
          >
            Regular Orders
            {notification?.forApprovalMoveOrderNotRush
              ?.forapprovalmoveordercountNotRush === 0 ? (
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
                  notification?.forApprovalMoveOrderNotRush
                    ?.forapprovalmoveordercountNotRush
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
            onClick={() => handleStatusChange(true)}
          >
            Rush Orders
            {notification?.forApprovalMoveOrder?.forapprovalmoveordercount ===
            0 ? (
              ""
            ) : (
              <Badge
                ml={2}
                fontSize="10px"
                variant="solid"
                colorScheme="red"
                mb={1}
              >
                {notification?.forApprovalMoveOrder?.forapprovalmoveordercount}
              </Badge>
            )}
          </Button>
        </Flex>
        <PageScroll minHeight="200px" maxHeight="480px">
          <Text
            textAlign="center"
            bgColor="primary"
            color="white"
            fontSize="14px"
          >
            List of Move Order
          </Text>
          <Table size="sm">
            <Thead bgColor="primary" h="40px">
              <Tr>
                <Th color="white" fontSize="10px">
                  <Checkbox
                    onChange={parentCheckHandler}
                    isChecked={allOrders?.length === checkedItems?.length}
                    disabled={!allOrders?.length > 0}
                  />{" "}
                  Line
                </Th>
                <Th color="white" fontSize="10px">
                  MIR ID
                </Th>
                <Th color="white" fontSize="10px">
                  Customer Code
                </Th>
                <Th color="white" fontSize="10px">
                  Customer Name
                </Th>
                <Th color="white" fontSize="10px">
                  Total Quantity Order
                </Th>
                <Th color="white" fontSize="10px">
                  Prepared Date
                </Th>
                <Th color="white" fontSize="10px">
                  View
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {forApprovalData?.map((item, i) => (
                <Tr key={i}>
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
                  <Td fontSize="xs">{item.customercode}</Td>
                  <Td fontSize="xs">{item.customerName}</Td>
                  <Td fontSize="xs">{item.quantity}</Td>
                  <Td fontSize="xs">
                    {moment(item.preparedDate).format("MM/DD/yyyy")}
                  </Td>
                  <Td>
                    <Button
                      size="xs"
                      fontSize="xs"
                      colorScheme="facebook"
                      onClick={() => viewHandler(item.mirId)}
                    >
                      View
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageScroll>
      </Flex>

      <Flex justifyContent="space-between" mt={7}>
        <Text fontSize="xs">
          {forApprovalData?.moveorder?.length > 0
            ? `Showing ${forApprovalData?.moveorder?.length} entries`
            : "No entries available"}
        </Text>
        <Flex>
          <ButtonGroup size="xs">
            <Button
              colorScheme="blue"
              size="sm"
              px={2}
              disabled={!forApprovalData || checkedItems?.length === 0}
              onClick={approveModal}
            >
              <Text fontSize="xs">Approve</Text>
            </Button>
            <Button
              colorScheme="red"
              size="sm"
              px={2}
              disabled={!forApprovalData || checkedItems?.length === 0}
              onClick={rejectHandler}
            >
              <Text fontSize="xs">Reject</Text>
            </Button>
          </ButtonGroup>
        </Flex>
      </Flex>

      {isView && (
        <ViewModal
          status={status}
          isOpen={isView}
          onClose={closeView}
          id={mirId}
          viewData={viewData}
        />
      )}
      {isApprove && (
        <ApproveModal
          isOpen={isApprove}
          onClose={closeApprove}
          orderNo={mirId}
          fetchForApprovalMO={fetchForApprovalMO}
          printData={viewData}
          fetchNotification={fetchNotification}
          totalQuantity={totalQuantity}
          mirNo={mirNo}
          genusData={genusData}
        />
      )}
      {isReject && (
        <RejectModal
          isOpen={isReject}
          onClose={closeReject}
          id={mirId}
          fetchForApprovalMO={fetchForApprovalMO}
          fetchNotification={fetchNotification}
          mirNo={mirNo}
          orderNo={mirId}
        />
      )}
    </Flex>
  );
};
