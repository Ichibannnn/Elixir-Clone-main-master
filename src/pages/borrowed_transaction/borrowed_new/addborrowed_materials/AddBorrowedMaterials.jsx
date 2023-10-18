import React, { useEffect, useRef, useState } from "react";
import { Button, Flex, HStack, useDisclosure, VStack } from "@chakra-ui/react";
import request from "../../../../services/ApiClient";
import { BorrowedInformation } from "../../BorrowedInformation";
import { ListOfBorrowed } from "../../ListOfBorrowed";
import { ActionButton } from "../../ActionButton";

const fetchCustomersApi = async () => {
  const res = await request.get(`Customer/GetAllActiveCustomers`);
  return res.data;
};
const fetchRawMatsApi = async () => {
  const res = await request.get(
    `Borrowed/GetAvailableStocksForBorrowedIssueNoParameters`
  );
  return res.data;
};

const fetchBarcodeNoApi = async (itemCode) => {
  const res = await request.get(
    `Borrowed/GetAllAvailableStocksForBorrowedIsssue`,
    {
      params: {
        itemcode: itemCode,
      },
    }
  );
  return res.data;
};

const AddBorrowedMaterials = ({
  borrowedData,
  fetchActiveBorrowed,
  borrowedNav,
  setBorrowedNav,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const customerRef = useRef();
  const remarksRef = useRef();

  const [customers, setCustomers] = useState([]);
  const [rawMats, setRawMats] = useState([]);
  const [barcodeNo, setBarcodeNo] = useState([]);

  const [totalQuantity, setTotalQuantity] = useState("");
  const [customerData, setCustomerData] = useState({
    customerCode: "",
    customerName: "",
  });

  const [warehouseId, setWarehouseId] = useState("");
  const [rawMatsInfo, setRawMatsInfo] = useState({
    itemCode: "",
    itemDescription: "",
    uom: "",
    customerName: "",
    warehouseId: "",
    quantity: "",
  });
  const [details, setDetails] = useState("");
  const [remarks, setRemarks] = useState("");

  const itemCode = rawMatsInfo.itemCode;

  const [selectorId, setSelectorId] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [unitCost, setUnitCost] = useState("");

  //Customer Fetching
  const fetchCustomers = () => {
    fetchCustomersApi().then((res) => {
      setCustomers(res);
    });
  };

  useEffect(() => {
    fetchCustomers();

    return () => {
      setCustomers([]);
    };
  }, []);

  //Raw Mats Fetching
  const fetchRawMats = () => {
    fetchRawMatsApi().then((res) => {
      setRawMats(res);
    });
  };

  useEffect(() => {
    fetchRawMats();

    return () => {
      setRawMats([]);
    };
  }, []);

  //Barcode (Warehouse ID)
  const fetchBarcodeNo = () => {
    fetchBarcodeNoApi(itemCode).then((res) => {
      setBarcodeNo(res);
    });
  };

  useEffect(() => {
    fetchBarcodeNo();

    return () => {
      setBarcodeNo([]);
    };
  }, [itemCode, borrowedNav]);

  //Refetch on change navigation
  useEffect(() => {
    if (borrowedNav) {
      fetchCustomers();
      fetchRawMats();
      fetchBarcodeNo();
    }
  }, [borrowedNav]);

  return (
    <Flex px={5} pt={5} pb={0} w="full" flexDirection="column" bg="form">
      <Flex w="full" justifyContent="space-between">
        <HStack spacing={0}>
          <Button
            bgColor={borrowedNav === 1 ? "primary" : ""}
            color={borrowedNav === 1 ? "white" : ""}
            _hover={{ bgColor: "primary", color: "white" }}
            border="1px"
            borderColor="gray.300"
            size="sm"
            fontSize="xs"
            onClick={() => setBorrowedNav(1)}
            borderRadius="none"
          >
            Add Borrow Materials
          </Button>
        </HStack>
      </Flex>

      <VStack
        w="full"
        p={5}
        spacing={10}
        height={borrowedData?.length === 0 ? "90vh" : "auto"}
        className="boxShadow"
      >
        {borrowedNav === 1 ? (
          <>
            <BorrowedInformation
              rawMatsInfo={rawMatsInfo}
              setRawMatsInfo={setRawMatsInfo}
              details={details}
              setDetails={setDetails}
              customers={customers}
              rawMats={rawMats}
              barcodeNo={barcodeNo}
              setSelectorId={setSelectorId}
              warehouseId={warehouseId}
              setWarehouseId={setWarehouseId}
              fetchActiveBorrowed={fetchActiveBorrowed}
              customerData={customerData}
              setCustomerData={setCustomerData}
              customerRef={customerRef}
              remarks={remarks}
              setRemarks={setRemarks}
              remarksRef={remarksRef}
              transactionDate={transactionDate}
              setTransactionDate={setTransactionDate}
              unitCost={unitCost}
              setUnitCost={setUnitCost}
            />
            {borrowedData?.length > 0 ? (
              <>
                <ListOfBorrowed
                  selectorId={selectorId}
                  setSelectorId={setSelectorId}
                  setTotalQuantity={setTotalQuantity}
                  borrowedData={borrowedData}
                  fetchActiveBorrowed={fetchActiveBorrowed}
                  fetchBarcodeNo={fetchBarcodeNo}
                  remarks={remarks}
                  unitCost={unitCost}
                />
                <ActionButton
                  setIsLoading={setIsLoading}
                  isLoading={isLoading}
                  totalQuantity={totalQuantity}
                  setTotalQuantity={setTotalQuantity}
                  customerData={customerData}
                  setCustomerData={setCustomerData}
                  details={details}
                  selectorId={selectorId}
                  setSelectorId={setSelectorId}
                  borrowedData={borrowedData}
                  fetchActiveBorrowed={fetchActiveBorrowed}
                  customerRef={customerRef}
                  setDetails={setDetails}
                  setRawMatsInfo={setRawMatsInfo}
                  //warehouse Id
                  warehouseId={warehouseId}
                  fetchBarcodeNo={fetchBarcodeNo}
                  remarks={remarks}
                  setRemarks={setRemarks}
                  remarksRef={remarksRef}
                  transactionDate={transactionDate}
                  setTransactionDate={setTransactionDate}
                />
              </>
            ) : (
              ""
            )}
          </>
        ) : (
          ""
        )}
      </VStack>
    </Flex>
  );
};

export default AddBorrowedMaterials;

// import React, { useEffect } from "react";
// import {
//   Button,
//   Flex,
//   Table,
//   Tbody,
//   Td,
//   Text,
//   Th,
//   Thead,
//   Tr,
//   useDisclosure,
//   VStack,
// } from "@chakra-ui/react";
// import PageScroll from "../../../../utils/PageScroll";
// // import { CancelConfirmation } from "./ActionModal";

// const fetchCustomersApi = async () => {
//   const res = await request.get(`Customer/GetAllActiveCustomers`);
//   return res.data;
// };
// const fetchRawMatsApi = async () => {
//   const res = await request.get(`Material/GetAllActiveMaterials`);
//   return res.data;
// };
// const fetchBarcodeNoApi = async (itemCode) => {
//   const res = await request.get(
//     `Miscellaneous/GetAllAvailableStocksForMIsssue?itemcode=${itemCode}`
//   );
//   return res.data;
// };

// const AddBorrowedMaterials = ({ borrowedData, fetchActiveBorrowed }) => {
//   const [isLoading, setIsLoading] = useState(false);

//   const customerRef = useRef();
//   const remarksRef = useRef();

//   const [customers, setCustomers] = useState([]);
//   const [rawMats, setRawMats] = useState([]);

//   const [barcodeNo, setBarcodeNo] = useState([]);

//   const [totalQuantity, setTotalQuantity] = useState("");
//   const [customerData, setCustomerData] = useState({
//     customerCode: "",
//     customerName: "",
//   });

//   const [warehouseId, setWarehouseId] = useState("");
//   const [rawMatsInfo, setRawMatsInfo] = useState({
//     itemCode: "",
//     itemDescription: "",
//     uom: "",
//     customerName: "",
//     warehouseId: "",
//     quantity: "",
//   });
//   const [details, setDetails] = useState("");
//   const [remarks, setRemarks] = useState("");

//   const itemCode = rawMatsInfo.itemCode;

//   const [selectorId, setSelectorId] = useState("");
//   const [transactionDate, setTransactionDate] = useState("");

//   //Customer Fetching
//   const fetchCustomers = () => {
//     fetchCustomersApi().then((res) => {
//       setCustomers(res);
//     });
//   };

//   useEffect(() => {
//     fetchCustomers();

//     return () => {
//       setCustomers([]);
//     };
//   }, []);

//   //Raw Mats Fetching
//   const fetchRawMats = () => {
//     fetchRawMatsApi().then((res) => {
//       setRawMats(res);
//     });
//   };

//   useEffect(() => {
//     fetchRawMats();

//     return () => {
//       setRawMats([]);
//     };
//   }, []);

//   //Barcode (Warehouse ID)
//   const fetchBarcodeNo = () => {
//     fetchBarcodeNoApi(itemCode).then((res) => {
//       setBarcodeNo(res);
//     });
//   };

//   useEffect(() => {
//     fetchBarcodeNo();

//     return () => {
//       setBarcodeNo([]);
//     };
//   }, [itemCode, borrowedNav]);

//   //Refetch on change navigation
//   useEffect(() => {
//     if (borrowedNav) {
//       fetchCustomers();
//       fetchRawMats();
//       fetchBarcodeNo();
//     }
//   }, [borrowedNav]);

//   return (
//     <Flex px={5} pt={5} pb={0} w="full" flexDirection="column" bg="form">
//       <Flex w="full" justifyContent="space-between">
//         <HStack spacing={0}>
//           <Button
//             bgColor={borrowedNav === 1 ? "primary" : ""}
//             color={borrowedNav === 1 ? "white" : ""}
//             _hover={{ bgColor: "btnColor", color: "white" }}
//             border="1px"
//             borderColor="gray.300"
//             size="sm"
//             fontSize="xs"
//             onClick={() => setBorrowedNav(1)}
//             borderRadius="none"
//           >
//             Add Borrow Materials
//           </Button>
//           <Button
//             bgColor={borrowedNav === 2 ? "primary" : ""}
//             color={borrowedNav === 2 ? "white" : ""}
//             _hover={{ bgColor: "btnColor", color: "white" }}
//             border="1px"
//             borderColor="gray.300"
//             size="sm"
//             fontSize="xs"
//             onClick={() => setBorrowedNav(2)}
//             borderRadius="none"
//           >
//             Pending Borrowed Materials
//           </Button>
//           <Button
//             bgColor={borrowedNav === 3 ? "primary" : ""}
//             color={borrowedNav === 3 ? "white" : ""}
//             _hover={{ bgColor: "btnColor", color: "white" }}
//             border="1px"
//             borderColor="gray.300"
//             size="sm"
//             fontSize="xs"
//             onClick={() => setBorrowedNav(3)}
//             borderRadius="none"
//           >
//             Transacted Return Materials
//           </Button>
//         </HStack>
//       </Flex>

//       <VStack
//         w="full"
//         p={5}
//         spacing={10}
//         height={borrowedData?.length === 0 ? "87vh" : "auto"}
//         border="2px"
//       >
//         {borrowedNav === 1 ? (
//           <>
//             <BorrowedInformation
//               rawMatsInfo={rawMatsInfo}
//               setRawMatsInfo={setRawMatsInfo}
//               details={details}
//               setDetails={setDetails}
//               customers={customers}
//               rawMats={rawMats}
//               barcodeNo={barcodeNo}
//               setSelectorId={setSelectorId}
//               setCustomerData={setCustomerData}
//               warehouseId={warehouseId}
//               setWarehouseId={setWarehouseId}
//               fetchActiveBorrowed={fetchActiveBorrowed}
//               customerData={customerData}
//               customerRef={customerRef}
//               remarks={remarks}
//               setRemarks={setRemarks}
//               remarksRef={remarksRef}
//               transactionDate={transactionDate}
//               setTransactionDate={setTransactionDate}
//             />
//             {borrowedData?.length > 0 ? (
//               <>
//                 <ListOfBorrowed
//                   selectorId={selectorId}
//                   setSelectorId={setSelectorId}
//                   setTotalQuantity={setTotalQuantity}
//                   borrowedData={borrowedData}
//                   fetchActiveBorrowed={fetchActiveBorrowed}
//                   fetchBarcodeNo={fetchBarcodeNo}
//                   remarks={remarks}
//                 />
//                 <ActionButton
//                   setIsLoading={setIsLoading}
//                   isLoading={isLoading}
//                   totalQuantity={totalQuantity}
//                   setTotalQuantity={setTotalQuantity}
//                   customerData={customerData}
//                   details={details}
//                   selectorId={selectorId}
//                   setSelectorId={setSelectorId}
//                   borrowedData={borrowedData}
//                   fetchActiveBorrowed={fetchActiveBorrowed}
//                   customerRef={customerRef}
//                   setDetails={setDetails}
//                   setRawMatsInfo={setRawMatsInfo}
//                   //warehouse Id
//                   warehouseId={warehouseId}
//                   fetchBarcodeNo={fetchBarcodeNo}
//                   remarks={remarks}
//                   setRemarks={setRemarks}
//                   remarksRef={remarksRef}
//                   transactionDate={transactionDate}
//                   setTransactionDate={setTransactionDate}
//                 />
//               </>
//             ) : (
//               ""
//             )}
//           </>
//         ) : borrowedNav === 2 ? (
//           <>
//             <ViewListBorrowed
//               setIsLoading={setIsLoading}
//               // isLoading={isLoading}
//             />
//           </>
//         ) : borrowedNav == 3 ? (
//           <TransactedListBorrowed />
//         ) : (
//           ""
//         )}
//       </VStack>
//     </Flex>
//   );
// };

// export default AddBorrowedMaterials;
