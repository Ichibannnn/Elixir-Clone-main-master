import React, { useState } from "react";
import moment from "moment";
import * as XLSX from "xlsx";
import {
  Badge,
  Button,
  Flex,
  HStack,
  Input,
  Select,
  Skeleton,
} from "@chakra-ui/react";
import { WarehouseReceivingHistory } from "./report_dropdown/WarehouseReceivingHistory";
import { MoveOrderHistory } from "./report_dropdown/MoveOrderHistory";
import { MiscIssueHistory } from "./report_dropdown/MiscIssueHistory";
import { MiscReceiptHistory } from "./report_dropdown/MiscReceiptHistory";
import { TransactedMOHistory } from "./report_dropdown/TransactedMOHistory";
import { CancelledOrders } from "./report_dropdown/CancelledOrders";
import { InventoryMovement } from "./report_dropdown/InventoryMovement";
import { BorrowedMatsHistory } from "./report_dropdown/BorrowedMatsHistory";
import { ReturnedQuantityTransaction } from "./report_dropdown/ReturnedQuantityTransaction";

const Reports = () => {
  const [dateFrom, setDateFrom] = useState(
    moment(new Date()).format("yyyy-MM-DD")
  );
  const [dateTo, setDateTo] = useState(moment(new Date()).format("yyyy-MM-DD"));

  console.log(dateFrom);
  console.log(dateTo);

  const [sample, setSample] = useState("");
  const [sheetData, setSheetData] = useState([]);

  const navigationHandler = (data) => {
    if (data) {
      setSample(data);
    } else {
      setSample("");
      setSheetData([]);
    }
  };

  const handleExport = () => {
    var workbook = XLSX.utils.book_new(),
      worksheet = XLSX.utils.json_to_sheet(sheetData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, "Elixir_Reports_ExportFile.xlsx");

    // console.log(worksheet);
  };

  const minimumDateForInventoryMovement = "2022-01-01";

  return (
    <>
      <Flex w="full" p={5} bg="form">
        <Flex w="full" justifyContent="start" flexDirection="column">
          <Flex w="full" justifyContent="space-between">
            {/* Dropdown value  */}
            <Flex justifyContent="start" flexDirection="column">
              <Flex>
                <Badge>Report Name</Badge>
              </Flex>
              <HStack>
                <Select
                  onChange={(e) => navigationHandler(Number(e.target.value))}
                  placeholder=" "
                  bgColor="#fff8dc"
                  w="full"
                  fontSize="xs"
                >
                  <option value={1}>Warehouse Receiving History</option>
                  <option value={2}>Move Order For Transaction History</option>
                  <option value={3}>Move Order Transacted History</option>
                  <option value={4}>Miscellaneous Receipt History</option>
                  <option value={5}>Miscellaneous Issue History</option>
                  <option value={6}>Borrowed Materials History</option>
                  <option value={7}>Returned Materials History</option>
                  <option value={8}>Unserved Orders History</option>
                </Select>
                <Button
                  onClick={handleExport}
                  disabled={sheetData?.length === 0 || !sample}
                  size="xs"
                >
                  Export
                </Button>
              </HStack>
            </Flex>

            {/* Viewing Condition  */}
            <Flex justifyContent="start">
              {sample < 9 ? (
                <Flex justifyContent="start" flexDirection="row">
                  <Flex flexDirection="column" ml={1}>
                    <Flex>
                      <Badge>Date from</Badge>
                    </Flex>
                    <Input
                      fontSize="xs"
                      bgColor="#fff8dc"
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                  </Flex>
                  <Flex flexDirection="column" ml={1}>
                    <Flex>
                      <Badge>Date to</Badge>
                    </Flex>
                    <Input
                      fontSize="xs"
                      bgColor="#fff8dc"
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </Flex>
                </Flex>
              ) : (
                ""
              )}
            </Flex>
          </Flex>

          {/* Rendering Reports Components  */}
          <Flex w="full" mt={5} justifyContent="center">
            {sample === 1 ? (
              <WarehouseReceivingHistory
                dateFrom={dateFrom}
                dateTo={dateTo}
                sample={sample}
                setSheetData={setSheetData}
              />
            ) : sample === 2 ? (
              <MoveOrderHistory
                dateFrom={dateFrom}
                dateTo={dateTo}
                sample={sample}
                setSheetData={setSheetData}
              />
            ) : sample === 3 ? (
              <TransactedMOHistory
                dateFrom={dateFrom}
                dateTo={dateTo}
                sample={sample}
                setSheetData={setSheetData}
              />
            ) : sample === 4 ? (
              <MiscReceiptHistory
                dateFrom={dateFrom}
                dateTo={dateTo}
                sample={sample}
                setSheetData={setSheetData}
              />
            ) : sample === 5 ? (
              <MiscIssueHistory
                dateFrom={dateFrom}
                dateTo={dateTo}
                sample={sample}
                setSheetData={setSheetData}
              />
            ) : sample === 6 ? (
              <BorrowedMatsHistory
                dateFrom={dateFrom}
                dateTo={dateTo}
                sample={sample}
                setSheetData={setSheetData}
              />
            ) : sample === 7 ? (
              <ReturnedQuantityTransaction
                dateFrom={dateFrom}
                dateTo={dateTo}
                sample={sample}
                setSheetData={setSheetData}
              />
            ) : sample === 8 ? (
              <CancelledOrders
                dateFrom={dateFrom}
                dateTo={dateTo}
                sample={sample}
                setSheetData={setSheetData}
              />
            ) : (
              // : sample === 6 ?
              //     <InventoryMovement dateFrom={dateFrom} dateTo={dateTo} sample={sample} setSheetData={setSheetData} />
              ""
            )}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Reports;
