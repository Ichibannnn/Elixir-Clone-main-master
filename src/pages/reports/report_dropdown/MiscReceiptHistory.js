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

const fetchMiscellaenouseReceiptApi = async (
  pageNumber,
  pageSize,
  dateFrom,
  dateTo
) => {
  const dayaDate = new Date();
  const dateToDaya = dayaDate.setDate(dayaDate.getDate() + 1);
  const res = await request.get(
    `Reports/MiscellaneousReceiptReport?PageNumber=${pageNumber}&PageSize=${pageSize}&DateFrom=${dateFrom}&DateTo=${dateTo}`
  );
  return res.data;
};

export const MiscReceiptHistory = ({
  dateFrom,
  dateTo,
  sample,
  setSheetData,
}) => {
  const [miscReceiptData, setMiscReceiptData] = useState([]);
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

  const fetchMiscellaenouseReceipt = () => {
    fetchMiscellaenouseReceiptApi(
      currentPage,
      pageSize,
      dateFrom,
      dateTo,
      sample
    ).then((res) => {
      setMiscReceiptData(res);
      setSheetData(
        res?.inventory?.map((item, i) => {
          return {
            "Line Number": i + 1,
            "Receipt Id": item.receiptId,
            "Supplier Code": item.supplierCode,
            "Supplier Name": item.supplierName,
            Details: item.details,
            "Item Code": item.itemCode,
            "Item Description": item.itemDescription,
            UOM: item.uom,
            Quantity: item.quantity,
            // 'Expiration Date': item.expirationDate,
            "Transacted By": item.trantedBy,
            "Transaction Date": moment(item.transactDate).format("yyyy-MM-DD"),
          };
        })
      );
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    fetchMiscellaenouseReceipt();

    return () => {
      setMiscReceiptData([]);
    };
  }, [currentPage, pageSize, dateFrom, dateTo, sample]);

  return (
    <Flex w="full" flexDirection="column">
      <Flex className="boxShadow">
        <PageScroll minHeight="600px" maxHeight="620px">
          <Table size="sm">
            <Thead bgColor="secondary" h="40px">
              <Tr>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Receipt ID
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Receipt Date
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Supplier Code
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Supplier Name
                </Th>
                {buttonChanger ? (
                  <>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Details
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Item Code
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Item Description
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      UOM
                    </Th>
                    {/* <Th color='white'>category</Th> */}
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Quantity
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Transact By
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Transaction Date
                    </Th>
                  </>
                ) : (
                  <>
                    {/* <Th color='white'>Expiration Date</Th> */}
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Company Code
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Company Name
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Department Code
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Department Name
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Location Code
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Location Name
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Account Title
                    </Th>
                  </>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {miscReceiptData?.inventory?.map((item, i) => (
                <Tr key={i}>
                  <Td fontSize="xs">{item.receiptId}</Td>
                  <Td fontSize="xs">{item.receivingDate}</Td>
                  <Td fontSize="xs">{item.supplierCode}</Td>
                  <Td fontSize="xs">{item.supplierName}</Td>
                  {buttonChanger ? (
                    <>
                      <Td fontSize="xs">{item.details}</Td>
                      <Td fontSize="xs">{item.itemCode}</Td>
                      <Td fontSize="xs">{item.itemDescription}</Td>
                      <Td fontSize="xs">{item.uom}</Td>
                      {/* <Td>{item.category}</Td> */}
                      <Td>{item.quantity}</Td>
                      <Td fontSize="xs">{item.transactBy}</Td>
                      <Td fontSize="xs">
                        {moment(item.transactDate).format("yyyy-MM-DD")}
                      </Td>
                    </>
                  ) : (
                    <>
                      {/* <Td>{item.expirationDate}</Td> */}
                      <Td fontSize="xs">{item.companyCode}</Td>
                      <Td fontSize="xs">{item.companyName}</Td>
                      <Td fontSize="xs">{item.departmentCode}</Td>
                      <Td fontSize="xs">{item.departmentName}</Td>
                      <Td fontSize="xs">{item.locationCode}</Td>
                      <Td fontSize="xs">{item.locationName}</Td>
                      <Td fontSize="xs">{item.accountTitles}</Td>
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
          Total Records: {miscReceiptData?.inventory?.length}
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
