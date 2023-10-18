import React, { useEffect } from "react";
import {
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import PageScroll from "../../../utils/PageScroll";

export const ListOfReceipts = ({
  listDataTempo,
  selectorId,
  setSelectorId,
  setEditableData,
  setRowIndex,
  setTotalQuantity,
}) => {
  const TableHead = [
    "Line",
    "Item Code",
    "Item Description",
    "UOM",
    "Quantity",
    "Unit Cost",
  ];

  const rowHandler = (item, i) => {
    setSelectorId(i + 1);
    setEditableData(item);
    const index = listDataTempo.indexOf(item);
    setRowIndex(index);
  };

  useEffect(() => {
    if (listDataTempo.length) {
      let sumQuantity = listDataTempo.map((q) => parseFloat(q.quantity));
      let sum = sumQuantity.reduce((a, b) => a + b);
      setTotalQuantity(sum);
    }
  }, [listDataTempo]);

  return (
    <Flex justifyContent="center" flexDirection="column" w="full">
      <VStack justifyContent="center" w="full" spacing={-1}>
        <Text
          bgColor="secondary"
          w="full"
          color="white"
          textAlign="center"
          fontSize="11px"
          fontWeight="semibold"
          py={1}
        >
          List of Receipt
        </Text>
        <Flex justifyContent="center" w="full">
          <PageScroll minHeight="250px" maxHeight="251px">
            <Table size="sm">
              <Thead bgColor="secondary">
                <Tr>
                  {TableHead?.map((item, i) => (
                    <Th color="white" fontSize="11px" key={i}>
                      {item}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {listDataTempo?.map((item, i) => (
                  <Tr
                    key={i}
                    onClick={() => rowHandler(item, i)}
                    bgColor={selectorId === i + 1 ? "blue.200" : "none"}
                    cursor="pointer"
                  >
                    <Td fontSize="xs">{i + 1}</Td>
                    <Td fontSize="xs">{item?.itemCode}</Td>
                    <Td fontSize="xs">{item?.itemDescription}</Td>
                    <Td fontSize="xs">{item?.uom}</Td>
                    <Td fontSize="xs">
                      {item?.quantity.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td fontSize="xs">
                      {item?.unitPrice.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </PageScroll>
        </Flex>
      </VStack>
    </Flex>
  );
};
