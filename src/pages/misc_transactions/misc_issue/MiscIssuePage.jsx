import React, { useEffect, useRef, useState } from "react";
import { Button, Flex, HStack, useDisclosure, VStack } from "@chakra-ui/react";
import request from "../../../services/ApiClient";
import { MaterialsInformation } from "./MaterialsInformation";
import { ListOfIssue } from "./ListOfIssue";
import { ActionButton } from "./ActionButton";
import { ViewListIssue } from "./viewingMiscIssue/ViewListIssue";

const fetchCustomersApi = async () => {
  const res = await request.get(`Customer/GetAllActiveCustomers`);
  return res.data;
};
const fetchRawMatsApi = async () => {
  const res = await request.get(
    `Miscellaneous/GetAvailableStocksForIssueNoParameters`
  );
  return res.data;
};

const fetchTransactApi = async () => {
  const res = await request.get(`TransactionType/GetAllActiveTransactionType`);
  return res.data;
};

const fetchBarcodeNoApi = async (itemCode) => {
  const res = await request.get(
    `Miscellaneous/GetAllAvailableStocksForMIsssue`,
    {
      params: {
        itemcode: itemCode,
      },
    }
  );
  return res.data;
};

const MiscIssuePage = ({
  miscData,
  fetchActiveMiscIssues,
  navigation,
  setNavigation,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const customerRef = useRef();
  const remarksRef = useRef();
  const transDate = useRef();

  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
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
    unitCost: "",
  });
  const [details, setDetails] = useState("");
  const [remarks, setRemarks] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [unitCost, setUnitCost] = useState("");

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

  // console.log(transactions);

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
  }, [itemCode, navigation]);

  //Refetch on change navigation
  useEffect(() => {
    if (navigation) {
      fetchCustomers();
      fetchRawMats();
      fetchBarcodeNo();
      fetchTransaction();
    }
  }, [navigation]);

  return (
    <Flex px={5} pt={5} pb={0} w="full" flexDirection="column" bg="form">
      <Flex w="full" justifyContent="space-between">
        <HStack spacing={0}>
          <Button
            bgColor={navigation === 1 ? "primary" : ""}
            color={navigation === 1 ? "white" : ""}
            _hover={{ bgColor: "btnColor", color: "white" }}
            border="1px"
            borderColor="gray.300"
            size="sm"
            fontSize="xs"
            onClick={() => setNavigation(1)}
          >
            Add Issue
          </Button>
          <Button
            bgColor={navigation === 2 ? "primary" : ""}
            color={navigation === 2 ? "white" : ""}
            _hover={{ bgColor: "btnColor", color: "white" }}
            border="1px"
            borderColor="gray.300"
            size="sm"
            fontSize="xs"
            onClick={() => setNavigation(2)}
          >
            View Issues
          </Button>
        </HStack>
      </Flex>

      <VStack
        w="full"
        p={5}
        spacing={10}
        height={miscData?.length === 0 ? "87vh" : "auto"}
        // className="boxShadow"
      >
        {navigation === 1 ? (
          <>
            <MaterialsInformation
              rawMatsInfo={rawMatsInfo}
              setRawMatsInfo={setRawMatsInfo}
              details={details}
              setDetails={setDetails}
              customers={customers}
              transactions={transactions}
              setTransactions={setTransactions}
              rawMats={rawMats}
              barcodeNo={barcodeNo}
              setSelectorId={setSelectorId}
              warehouseId={warehouseId}
              setWarehouseId={setWarehouseId}
              fetchActiveMiscIssues={fetchActiveMiscIssues}
              setCustomerData={setCustomerData}
              customerData={customerData}
              customerRef={customerRef}
              remarks={remarks}
              setRemarks={setRemarks}
              remarksRef={remarksRef}
              transDate={transDate}
              transactionDate={transactionDate}
              setTransactionDate={setTransactionDate}
              unitCost={unitCost}
              setUnitCost={setUnitCost}
            />
            {miscData?.length > 0 ? (
              <>
                <ListOfIssue
                  selectorId={selectorId}
                  setSelectorId={setSelectorId}
                  setTotalQuantity={setTotalQuantity}
                  miscData={miscData}
                  fetchActiveMiscIssues={fetchActiveMiscIssues}
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
                  setDetails={setDetails}
                  selectorId={selectorId}
                  setSelectorId={setSelectorId}
                  miscData={miscData}
                  fetchActiveMiscIssues={fetchActiveMiscIssues}
                  customerRef={customerRef}
                  setRawMatsInfo={setRawMatsInfo}
                  //warehouse Id
                  warehouseId={warehouseId}
                  fetchBarcodeNo={fetchBarcodeNo}
                  remarks={remarks}
                  setRemarks={setRemarks}
                  remarksRef={remarksRef}
                  transDate={transDate}
                  transactionDate={transactionDate}
                  setTransactionDate={setTransactionDate}
                />
              </>
            ) : (
              ""
            )}
          </>
        ) : navigation === 2 ? (
          <>
            <ViewListIssue />
          </>
        ) : (
          ""
        )}
      </VStack>
    </Flex>
  );
};

export default MiscIssuePage;
