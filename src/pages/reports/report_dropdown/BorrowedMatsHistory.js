import React, { useEffect, useState } from "react";
import {
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Button,
  HStack,
  Select,
  Stack,
  Text,
  Box,
} from "@chakra-ui/react";
import request from "../../../services/ApiClient";
import PageScroll from "../../../utils/PageScroll";
import moment from "moment";
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from "@ajna/pagination";

const fetchBorrowedHistoryApi = async (
  pageNumber,
  pageSize,
  dateFrom,
  dateTo
) => {
  const dayaDate = new Date();
  const dateToDaya = dayaDate.setDate(dayaDate.getDate() + 1);
  const res = await request.get(
    `Reports/BorrowedTransactionReports?PageNumber=${pageNumber}&PageSize=${pageSize}&DateFrom=${dateFrom}&DateTo=${dateTo}`
  );
  return res.data;
};

export const BorrowedMatsHistory = ({
  dateFrom,
  dateTo,
  sample,
  setSheetData,
}) => {
  const [borrowedData, setBorrowedData] = useState([]);
  const [buttonChanger, setButtonChanger] = useState(true);
  const [pageTotal, setPageTotal] = useState(undefined);

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
    initialState: { currentPage: 1, pageSize: 5000 },
  });

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
  };

  const handlePageSizeChange = (e) => {
    const pageSize = Number(e.target.value);
    setPageSize(pageSize);
  };

  const fetchBorrowedHistory = () => {
    fetchBorrowedHistoryApi(
      currentPage,
      pageSize,
      dateFrom,
      dateTo,
      sample
    ).then((res) => {
      setBorrowedData(res);
      setSheetData(
        res?.inventory?.map((item, i) => {
          return {
            "Line Number": i + 1,
            ID: item.borrowedId,
            "Customer Code": item.customerCode,
            "Customer Name": item.customerName,
            "Item Code": item.itemCode,
            "Item Description": item.itemDescrption,
            UOM: item.uom,
            "Borrowed Qty": item.borrowedQuantity,
            "Borrowed Date": item.borrowedDate,
            Consumed: item.consumed,
            "Returned Qty": item.returnedQuantity,
            "Returned Date": item.returnedDate,
            "Company Code": item.companyCode,
            "Company Name": item.companyName,
            "Department Code": item.departmentCode,
            "Department Name": item.departmentName,
            "Location Code": item.locationCode,
            "Location Name": item.locationName,
            "Account Title": item.accountTitles,
            Status: item.statusApprove,
            "Transaction By": item.transactedBy,
          };
        })
      );
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    fetchBorrowedHistory();

    return () => {
      setBorrowedData([]);
    };
  }, [currentPage, pageSize, dateFrom, dateTo, sample]);

  return (
    <Flex w="full" flexDirection="column">
      <Flex className="boxShadow">
        <PageScroll minHeight="600px" maxHeight="620px">
          <Table size="sm" variant="striped">
            <Thead bgColor="primary" h="40px">
              <Tr>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Borrowed ID
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Customer Code
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Customer Name
                </Th>
                {buttonChanger ? (
                  <>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Item Code
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Item Description
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      UOM
                    </Th>
                  </>
                ) : (
                  <>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Borrowed Qty
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Borrowed Date
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Status
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Requested By
                    </Th>
                  </>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {borrowedData?.inventory?.map((item, i) => (
                <Tr key={i}>
                  <Td fontSize="xs">{item.borrowedId}</Td>
                  <Td fontSize="xs">{item.customerCode}</Td>
                  <Td fontSize="xs">{item.customerName}</Td>
                  {buttonChanger ? (
                    <>
                      <Td fontSize="xs">{item.itemCode}</Td>
                      <Td fontSize="xs">{item.itemDescription}</Td>
                      <Td fontSize="xs">{item.uom}</Td>
                    </>
                  ) : (
                    <>
                      <Td fontSize="xs">
                        {item.borrowedQuantity.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {item.borrowedDate !== null
                          ? moment(item.borrowedDate).format("MM/DD/yyyy")
                          : "Pending Borrowed"}
                      </Td>
                      <Td fontSize="xs">{item.status}</Td>
                      <Td fontSize="xs">{item.transactedBy}</Td>
                    </>
                  )}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageScroll>
      </Flex>

      <Flex justifyContent="space-between" mt={2}>
        <Stack>
          <Pagination
            pagesCount={pagesCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          >
            <PaginationContainer>
              <PaginationPrevious
                bg="primary"
                color="white"
                p={1}
                _hover={{ bg: "btnColor", color: "white" }}
              >
                {"<<"}
              </PaginationPrevious>
              <PaginationPageGroup ml={1} mr={1}>
                {pages.map((page) => (
                  <PaginationPage
                    _hover={{ bg: "btnColor", color: "white" }}
                    _focus={{ bg: "btnColor" }}
                    p={3}
                    bg="primary"
                    color="white"
                    key={`pagination_page_${page}`}
                    page={page}
                  />
                ))}
              </PaginationPageGroup>
              <HStack>
                <PaginationNext
                  bg="primary"
                  color="white"
                  p={1}
                  _hover={{ bg: "btnColor", color: "white" }}
                >
                  {">>"}
                </PaginationNext>
                <Select onChange={handlePageSizeChange} variant="outline">
                  <option value={Number(5)}>5</option>
                  <option value={Number(10)}>10</option>
                  <option value={Number(25)}>25</option>
                  <option value={Number(50)}>50</option>
                  <option value={Number(100)}>100</option>
                </Select>
              </HStack>
            </PaginationContainer>
          </Pagination>
        </Stack>

        <Text fontSize="xs" fontWeight="semibold">
          Total Records: {borrowedData?.inventory?.length}
        </Text>
        <Button
          size="xs"
          colorScheme="blue"
          onClick={() => setButtonChanger(!buttonChanger)}
        >
          {buttonChanger ? `>>>>` : `<<<<`}
        </Button>
      </Flex>
    </Flex>
  );
};
