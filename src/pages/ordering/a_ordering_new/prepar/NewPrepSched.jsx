import React, { useState, useEffect } from "react";
import { Box, Flex, Stack, VStack } from "@chakra-ui/react";
import request from "../../../../services/ApiClient";
import { ListOfOrders } from "./ListOfOrders";
import { ListOfMir } from "./ListOfMir";
import { usePagination } from "@ajna/pagination";

const NewPrepSched = ({ notification, fetchNotification }) => {
  const [selectedMIRIds, setSelectedMIRIds] = useState([]);

  const [mirList, setMirList] = useState([]);
  const [rushOrders, setRushOrders] = useState([]);
  const [regularOrders, setRegularOrders] = useState([]);
  const [regularOrdersCount, setRegularOrdersCount] = useState(0);
  const [rushOrdersCount, setRushOrdersCount] = useState(0);

  const [lengthIndicator, setLengthIndicator] = useState("");
  const [checkedItems, setCheckedItems] = useState([]);

  const [isAllChecked, setIsAllChecked] = useState(false);
  const [disableScheduleButton, setDisableScheduleButton] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(false);
  const [pageTotal, setPageTotal] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMirListApi = async (pageNumber, pageSize, status, search) => {
    const response = await request.get(
      `Ordering/GetAllListOfMir?PageNumber=${pageNumber}&PageSize=${pageSize}&status=${status}&search=${search}`
    );

    return response.data;
  };

  //SHOW MIRLIST DATA----
  const fetchMirList = () => {
    fetchMirListApi(currentPage, pageSize, status, search).then((res) => {
      setIsLoading(false);
      setMirList(res);
      setPageTotal(res.totalCount);
    });
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

  useEffect(() => {
    fetchMirList();

    return () => {
      setMirList([]);
    };
  }, [currentPage, pageSize, status, search]);

  return (
    <Flex color="fontColor" w="full" flexDirection="column" p={2} bg="white">
      <VStack w="full">
        <ListOfMir
          status={status}
          setStatus={setStatus}
          selectedMIRIds={selectedMIRIds}
          setSelectedMIRIds={setSelectedMIRIds}
          mirList={mirList}
          setMirList={setMirList}
          regularOrdersCount={regularOrdersCount}
          rushOrdersCount={rushOrdersCount}
          isAllChecked={isAllChecked}
          setIsAllChecked={setIsAllChecked}
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
          setDisableScheduleButton={setDisableScheduleButton}
          search={search}
          setSearch={setSearch}
          rushOrders={rushOrders}
          regularOrders={regularOrders}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setPageSize={setPageSize}
          pagesCount={pagesCount}
          pages={pages}
          notification={notification}
          fetchNotification={fetchNotification}
        />

        <ListOfOrders
          setCurrentPage={setCurrentPage}
          setSearch={setSearch}
          selectedMIRIds={selectedMIRIds}
          setSelectedMIRIds={setSelectedMIRIds}
          fetchMirList={fetchMirList}
          isAllChecked={isAllChecked}
          setIsAllChecked={setIsAllChecked}
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
          disableScheduleButton={disableScheduleButton}
          setDisableScheduleButton={setDisableScheduleButton}
          fetchNotification={fetchNotification}
        />
      </VStack>
    </Flex>
  );
};

export default NewPrepSched;

// NEWEST CODES ========================================================
// import React, { useState, useEffect } from "react";
// import { Box, Flex, Stack, VStack } from "@chakra-ui/react";
// import request from "../../../../services/ApiClient";
// import { ListOfOrders } from "./ListOfOrders";
// import { ListOfMir } from "./ListOfMir";

// const NewPrepSched = () => {
//   const [customers, setCustomers] = useState("Swine Breeder Farms");
//   const [mirIds, setMirIds] = useState("");
//   const [mirList, setMirList] = useState([]);
//   const [mirOrderList, setmirOrderList] = useState([]);
//   const [status, setStatus] = useState(false);
//   const [selectedMirIds, setSelectedMirIds] = useState({});

//   // MIR List
//   useEffect(() => {
//     const fetchMIRList = async () => {
//       try {
//         const res = await request.get(
//           `Ordering/GetAllListOfMir?customer=${customers}&status=${status}`
//         );
//         console.log(res.data); // Add this line
//         setMirList(res.data);
//       } catch (error) {
//         console.error("Error fetching MIR list:", error);
//       }
//     };

//     fetchMIRList();
//   }, [customers, status]);

//   // MIR Order List
//   useEffect(() => {
//     const fetchMirOrderList = async () => {
//       try {
//         const response = await request.get(
//           `Ordering/GetAllListOfMirOrdersByMirIds?customerName=${customers}&listofMirIds=${encodeURIComponent(
//             JSON.stringify(mirIds)
//           )}`
//         );
//         setmirOrderList(response.data);

//         console.log(response.data);
//       } catch (error) {
//         console.error("Error fetching MIR order list:", error);
//       }
//     };

//     fetchMirOrderList();
//   }, [customers]); // Add customers as a dependency

//   const mirIdHandler = (mirId, customerName) => {
//     if (mirId && customerName) {
//       setMirIds(mirId);
//       setCustomers(customerName);
//     } else {
//       setMirIds("");
//       setCustomers("");
//     }
//   };

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
//         <ListOfMir
//           mirList={mirList}
//           customers={customers}
//           setCustomers={setCustomers}
//           mirIds={mirIds}
//           setMirIds={setMirIds}
//           handleMirSelection={mirIdHandler}
//           selectedMirIds={selectedMirIds}
//           setSelectedMirIds={setSelectedMirIds}
//         />

//         <ListOfOrders
//           mirOrderList={mirOrderList}
//           customers={customers}
//           setCustomers={setCustomers}
//           selectedMirIds={selectedMirIds}
//         />
//       </VStack>
//     </Flex>
//   );
// };

// export default NewPrepSched;

// OLD CODE------------------------------------------------------------
// import React, { useState, useEffect } from "react";
// import { Box, Flex, Stack, VStack } from "@chakra-ui/react";
// import request from "../../../../services/ApiClient";
// import { ListOfOrders } from "./ListOfOrders";
// import { ListOfMir } from "./ListOfMir";

// // FETHC CUSTOMER API
// const fetchCustomerApi = async () => {
//   const res = await request.get(
//     `Ordering/GetAllListofOrdersPaginationOrig?pageNumber=${2000}&pageSize=${1}`
//   );
//   return res.data;
// };

// const NewPrepSched = () => {
//   const [customers, setCustomers] = useState("Swine Breeder Farms");
//   const [mirIds, setMirIds] = useState("");
//   const [mirList, setMirList] = useState([]);
//   const [mirOrderList, setmirOrderList] = useState([]);
//   const [status, setStatus] = useState(false);

//   // MIR List
//   useEffect(() => {
//     const fetchMIRList = async () => {
//       try {
//         const res = await request.get(
//           `Ordering/GetAllListOfMir?customer=${customers}&status=${status}`
//         );
//         setMirList(res.data);
//       } catch (error) {
//         console.error("Error fetching MIR list:", error);
//       }
//     };

//     fetchMIRList();
//   }, []);

//   // MIR Order List
//   useEffect(() => {
//     const fetchMirOrderList = async () => {
//       try {
//         const response = await request.get(
//           `Ordering/GetAllListOfMirOrdersByMirIds?customerName=${customers}&listofMirIds=${encodeURIComponent(
//             JSON.stringify(mirIds)
//           )}`
//         );
//         setmirOrderList(response.data);

//         console.log(response.data);
//       } catch (error) {
//         console.error("Error fetching MIR order list:", error);
//       }
//     };

//     fetchMirOrderList();
//   }, []);

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
//         <ListOfMir
//           mirList={mirList}
//           customers={customers}
//           setCustomers={setCustomers}
//           mirIds={mirIds}
//           setMirIds={setMirIds}
//         />

//         <ListOfOrders
//           mirOrderList={mirOrderList}
//           customers={customers}
//           setCustomers={setCustomers}
//         />
//       </VStack>
//     </Flex>
//   );
// };

// export default NewPrepSched;
