import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
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
import {
  Pagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from "@ajna/pagination";
import PageScroll from "../../../utils/PageScroll";
import { BiRightArrow } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import { CgDanger } from "react-icons/cg";
import { AiOutlinePrinter } from "react-icons/ai";
import { useReactToPrint } from "react-to-print";
import { MdOutlineWarning } from "react-icons/md";
import { ImWarning } from "react-icons/im";
// import apiClient from '../../../services/apiClient'

export const MrpTable = ({
  mrpData,
  setSelectorId,
  selectorId,
  setRawMatsInfo,
  pagesCount,
  pages,
  currentPage,
  setCurrentPage,
  setPageSize,
  setSearch,
  pageTotal,
  sheetData,
}) => {
  const [buttonChanger, setButtonChanger] = useState(false);

  // console.log(sheetData);

  const handleExport = () => {
    var workbook = XLSX.utils.book_new(),
      worksheet = XLSX.utils.json_to_sheet(sheetData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, "Elixir_MRP_ExportFile.xlsx");
  };

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
  };

  const handlePageSizeChange = (e) => {
    const pageSize = Number(e.target.value);
    setPageSize(pageSize);
  };

  const searchHandler = (inputValue) => {
    setCurrentPage(1);
    setSearch(inputValue);
  };

  const selectorHandler = (
    id,
    { itemCode, itemDescription, soh, bufferLevel, averageIssuance, daysLevel }
  ) => {
    if (id) {
      setSelectorId(id);
      setRawMatsInfo({
        itemCode: itemCode,
        itemDescription: itemDescription,
        soh: soh,
        bufferLevel: bufferLevel,
        averageIssuance: averageIssuance,
        daysLevel: daysLevel,
      });
    } else {
      setSelectorId("");
      setRawMatsInfo({
        itemCode: "",
        itemDescription: "",
        soh: "",
        bufferLevel: "",
        averageIssuance: "",
        daysLevel: "",
      });
    }
  };

  const {
    isOpen: isPrint,
    onOpen: openPrint,
    onClose: closePrint,
  } = useDisclosure();
  const printMRPHandler = () => {
    openPrint();
  };

  return (
    <Flex w="full" justifyContent="center" flexDirection="column">
      <Flex justifyContent="space-between" mb={1}>
        <InputGroup w="30%">
          <InputLeftElement
            pointerEvents="none"
            children={<FaSearch color="gray.300" />}
            fontSize="xs"
          />
          <Input
            onChange={(e) => searchHandler(e.target.value)}
            type="text"
            fontSize="xs"
            placeholder="Search"
            focusBorderColor="btnColor"
            borderColor="gray.300"
          />
          <Button
            onClick={printMRPHandler}
            ml={3}
            bgColor="secondary"
            _hover={{ bgColor: "accent" }}
          >
            <AiOutlinePrinter color="white" fontSize="25px" />
          </Button>
          <Button
            onClick={handleExport}
            disabled={!sheetData}
            ml={2}
            px={5}
            colorScheme="blue"
            fontSize="xs"
          >
            Export
          </Button>
        </InputGroup>

        <Button
          onClick={() => setButtonChanger(!buttonChanger)}
          ml={2}
          px={5}
          colorScheme="blue"
          fontSize="xs"
        >
          {buttonChanger ? "<< Previous" : "Next >>"}
        </Button>
      </Flex>

      <Text
        textAlign="center"
        bgColor="primary"
        color="white"
        fontSize="14px"
        // fontWeight="semibold"
      >
        Material Requisition Planning
      </Text>
      <PageScroll minHeight="680px" maxHeight="700px">
        <Table size="sm">
          <Thead bgColor="primary" position="sticky" top={0}>
            <Tr>
              <Th p={0} color="white" fontSize="xs"></Th>
              <Th p={0} color="white" fontSize="xs"></Th>
              <Th color="white" fontSize="xs">
                Line
              </Th>
              <Th color="white" fontSize="xs">
                Item Code
              </Th>
              <Th color="white" fontSize="xs">
                Item Description
              </Th>
              {!buttonChanger ? (
                <>
                  <Th color="white">Item Category</Th>
                  <Th color="white">UOM</Th>
                  <Th color="white">Unit Cost</Th>
                  <Th color="white">Total Cost</Th>
                  <Th color="white">SOH</Th>
                  <Th color="white">Reserve</Th>
                  <Th color="white">Buffer Level</Th>
                </>
              ) : (
                <>
                  <Th color="white">{`Receive (IN)`}</Th>
                  <Th color="white">{`Receipt (IN)`}</Th>
                  <Th color="white">{`Move Order (OUT)`}</Th>
                  <Th color="white">{`Issue (OUT)`}</Th>
                  {/* <Th color="white">{`Borrowed Qty`}</Th>
                  <Th color="white">{`Returned Qty`}</Th> */}
                  <Th color="white">Average Issuance</Th>
                  <Th color="white">Days Level</Th>
                </>
              )}
            </Tr>
          </Thead>
          <Tbody>
            {mrpData?.inventory?.map((item, i) => (
              <Tr
                key={i}
                onClick={() => selectorHandler(i + 1, item)}
                bgColor={
                  selectorId === i + 1
                    ? "blue.200"
                    : "none" && item.bufferLevel > item.reserve
                    ? "gray.300"
                    : "none"
                }
                cursor="pointer"
              >
                {selectorId === i + 1 ? (
                  <Td p={0}>
                    <BiRightArrow />
                  </Td>
                ) : (
                  <Td p={0}></Td>
                )}
                <Td fontSize="xs">
                  {item.bufferLevel > item.reserve ? (
                    <ImWarning color="red" />
                  ) : (
                    ""
                  )}
                </Td>
                <Td fontSize="xs">{i + 1}</Td>
                <Td fontSize="xs">{item.itemCode}</Td>
                <Td fontSize="xs">{item.itemDescription}</Td>
                {!buttonChanger ? (
                  <>
                    <Td fontSize="xs">{item.itemCategory}</Td>
                    <Td fontSize="xs">{item.uom}</Td>
                    <Td fontSize="xs">
                      {item.price?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td fontSize="xs">
                      {item.totalPrice?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td fontSize="xs">
                      {item.soh?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td fontSize="xs">
                      {item.reserve?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td fontSize="xs">
                      {item.bufferLevel?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                  </>
                ) : (
                  <>
                    <Td fontSize="xs">
                      {item.receiveIn?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td fontSize="xs">
                      {item.receiptIn?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td fontSize="xs">
                      {item.moveOrderOut?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td fontSize="xs">
                      {item.issueOut?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    {/* <Td fontSize="xs">
                      {item.borrowedDepartment?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td fontSize="xs">
                      {item.returnedBorrowed?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td> */}
                    <Td fontSize="xs">
                      {item.averageIssuance?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td fontSize="xs">{item.daysLevel?.toLocaleString()}</Td>
                  </>
                )}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </PageScroll>

      <Flex mt={5} justifyContent="end" w="full">
        <Stack>
          <Pagination
            pagesCount={pagesCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          >
            <PaginationContainer>
              <PaginationPrevious
                bg="secondary"
                color="white"
                p={1}
                _hover={{ bg: "accent", color: "white" }}
              >
                {"<<"}
              </PaginationPrevious>
              <PaginationPageGroup ml={1} mr={1}>
                {pages.map((page) => (
                  <PaginationPage
                    _hover={{ bg: "accent", color: "white" }}
                    p={3}
                    bg="secondary"
                    color="white"
                    key={`pagination_page_${page}`}
                    page={page}
                  />
                ))}
              </PaginationPageGroup>
              <HStack>
                <PaginationNext
                  bg="secondary"
                  color="white"
                  p={1}
                  _hover={{ bg: "accent", color: "white" }}
                >
                  {">>"}
                </PaginationNext>
                <Select onChange={handlePageSizeChange} variant="filled">
                  <option value={Number(10000)}>ALL</option>
                  <option value={Number(50)}>50</option>
                  <option value={Number(5)}>5</option>
                  <option value={Number(10)}>10</option>
                  <option value={Number(25)}>25</option>
                </Select>
              </HStack>
            </PaginationContainer>
          </Pagination>
        </Stack>
      </Flex>

      {isPrint && (
        <PrintModal isOpen={isPrint} onClose={closePrint} mrpData={mrpData} />
      )}
    </Flex>
  );
};

const PrintModal = ({ isOpen, onClose, mrpData }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} isCentered size="6xl">
        <ModalContent>
          <ModalHeader>
            <Flex justifyContent="center">Print MRP Data</Flex>
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />

          <ModalBody mt={5}>
            <PageScroll minHeight="617px" maxHeight="618px">
              <Table size="sm" variant="simple" ref={componentRef}>
                <Thead bgColor="secondary">
                  <Tr>
                    <Th p={0} color="white"></Th>
                    <Th color="white">Item Code</Th>
                    <Th color="white">Item Description</Th>
                    <Th color="white">Item Category</Th>
                    <Th color="white">UOM</Th>

                    <Th color="white">SOH</Th>
                    <Th color="white">Reserve</Th>
                    <Th color="white">Buffer Level</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {mrpData?.inventory?.map((item, i) => (
                    <Tr key={i}>
                      <Td>
                        {item.bufferLevel > item.reserve ? (
                          <CgDanger color="red" />
                        ) : (
                          ""
                        )}
                      </Td>
                      <Td>{item.itemCode}</Td>
                      <Td>{item.itemDescription}</Td>
                      <Td>{item.itemCategory}</Td>
                      <Td>{item.uom}</Td>
                      <Td>
                        {item.soh?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td>
                        {item.reserve?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td>
                        {item.bufferLevel?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </PageScroll>
          </ModalBody>

          <ModalFooter mt={7}>
            <ButtonGroup size="sm">
              <Button colorScheme="blue" onClick={handlePrint}>
                Print
              </Button>
              <Button onClick={onClose}>Close</Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
