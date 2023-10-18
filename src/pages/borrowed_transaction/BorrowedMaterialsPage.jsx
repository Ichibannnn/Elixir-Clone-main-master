import React, { useEffect, useRef, useState } from "react";
import { Button, Flex, HStack, useDisclosure, VStack } from "@chakra-ui/react";
import request from "../../services/ApiClient";
import { BorrowedInformation } from "./BorrowedInformation";
import { ListOfBorrowed } from "./ListOfBorrowed";
import { ViewListBorrowed } from "./viewingBorrowed/ViewListBorrowed";
import { ActionButton } from "./ActionButton";
import { TransactedListBorrowed } from "./transactedBorrowed/TransactedListBorrowed";

const fetchCustomersApi = async () => {
  const res = await request.get(`Customer/GetAllActiveCustomers`);
  return res.data;
};
const fetchRawMatsApi = async () => {
  const res = await request.get(`Material/GetAllActiveMaterials`);
  return res.data;
};

const fetchBarcodeNoApi = async (itemCode) => {
  const res = await request.get(
    `Miscellaneous/GetAllAvailableStocksForMIsssue?itemcode=${itemCode}`
  );
  return res.data;
};

const fetchTransactApi = async () => {
  const res = await request.get(`TransactionType/GetAllActiveTransactionType`);
  return res.data;
};

const BorrowedMaterialsPage = ({
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
  const [transactions, setTransactions] = useState([]);

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
  const [transactionDate, setTransactionDate] = useState("");

  const itemCode = rawMatsInfo.itemCode;

  const [selectorId, setSelectorId] = useState("");

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

  //Transaction Type Fetching
  const fetchTransaction = () => {
    fetchTransactApi().then((res) => {
      setTransactions(res);
    });
  };

  useEffect(() => {
    fetchTransaction();

    return () => {
      setTransactions([]);
    };
  }, []);

  //Refetch on change navigation
  useEffect(() => {
    if (borrowedNav) {
      fetchCustomers();
      fetchRawMats();
      fetchBarcodeNo();
      // fetchTransaction();
    }
  }, [borrowedNav]);

  return (
    <Flex px={5} pt={5} pb={0} w="full" flexDirection="column" bg="form">
      <Flex w="full" justifyContent="space-between">
        <HStack spacing={0}>
          <Button
            bgColor={borrowedNav === 1 ? "primary" : ""}
            color={borrowedNav === 1 ? "white" : ""}
            _hover={{ bgColor: "btnColor", color: "white" }}
            border="1px"
            borderColor="gray.300"
            size="sm"
            fontSize="xs"
            onClick={() => setBorrowedNav(1)}
            borderRadius="none"
          >
            Add Borrow Materials
          </Button>
          <Button
            bgColor={borrowedNav === 2 ? "primary" : ""}
            color={borrowedNav === 2 ? "white" : ""}
            _hover={{ bgColor: "btnColor", color: "white" }}
            border="1px"
            borderColor="gray.300"
            size="sm"
            fontSize="xs"
            onClick={() => setBorrowedNav(2)}
            borderRadius="none"
          >
            Pending Borrowed Materials
          </Button>
          <Button
            bgColor={borrowedNav === 3 ? "primary" : ""}
            color={borrowedNav === 3 ? "white" : ""}
            _hover={{ bgColor: "btnColor", color: "white" }}
            border="1px"
            borderColor="gray.300"
            size="sm"
            fontSize="xs"
            onClick={() => setBorrowedNav(3)}
            borderRadius="none"
          >
            Transacted Return Materials
          </Button>
        </HStack>
      </Flex>

      <VStack
        w="full"
        p={5}
        spacing={10}
        height={borrowedData?.length === 0 ? "87vh" : "auto"}
        border="2px"
      >
        {borrowedNav === 1 ? (
          <>
            <BorrowedInformation
              rawMatsInfo={rawMatsInfo}
              setRawMatsInfo={setRawMatsInfo}
              details={details}
              setDetails={setDetails}
              transactions={transactions}
              customers={customers}
              rawMats={rawMats}
              barcodeNo={barcodeNo}
              setSelectorId={setSelectorId}
              warehouseId={warehouseId}
              setWarehouseId={setWarehouseId}
              fetchActiveBorrowed={fetchActiveBorrowed}
              setCustomerData={setCustomerData}
              customerData={customerData}
              customerRef={customerRef}
              remarks={remarks}
              setRemarks={setRemarks}
              remarksRef={remarksRef}
              transactionDate={transactionDate}
              setTransactionDate={setTransactionDate}
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
                />
                <ActionButton
                  setIsLoading={setIsLoading}
                  isLoading={isLoading}
                  totalQuantity={totalQuantity}
                  setTotalQuantity={setTotalQuantity}
                  customerData={customerData}
                  setCustomerData={setCustomerData}
                  details={details}
                  setDetails={setDetails}
                  selectorId={selectorId}
                  setSelectorId={setSelectorId}
                  borrowedData={borrowedData}
                  fetchActiveBorrowed={fetchActiveBorrowed}
                  customerRef={customerRef}
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
        ) : borrowedNav === 2 ? (
          <>
            <ViewListBorrowed
              setIsLoading={setIsLoading}
              // isLoading={isLoading}
            />
          </>
        ) : borrowedNav == 3 ? (
          <TransactedListBorrowed />
        ) : (
          ""
        )}
      </VStack>
    </Flex>
  );
};

export default BorrowedMaterialsPage;
