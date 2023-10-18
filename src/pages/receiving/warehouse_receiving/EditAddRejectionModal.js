import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Flex,
  FormLabel,
  Input,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ReceivingContext } from "../../../components/context/ReceivingContext";
import request from "../../../services/ApiClient";
import { ToastComponent } from "../../../components/Toast";
import { AiFillMinusCircle } from "react-icons/ai";
import { IoIosAdd, IoIosSave } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { TiDeleteOutline } from "react-icons/ti";
import { FaMinusCircle } from "react-icons/fa";
import { GrAdd } from "react-icons/gr";
import { IoAddSharp } from "react-icons/io5";

const EditAddRejectionModal = ({
  receivingId,
  sumQuantity,
  actualGood,
  setDisableQuantity,
  quantity,
  setQuantity,
  actualDelivered,
}) => {
  const { setSubmitDataTwo, setSumQuantity } = useContext(ReceivingContext);

  const [reasons, setReasons] = useState([]);

  const [remarks, setRemarks] = useState("");
  const [remarksName, setRemarksName] = useState("");
  const [errors, setErrors] = useState({});
  const [finalData, setFinalData] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [disabledQuantity, setDisabledQuantity] = useState("");

  const remarksDisplay = useRef(null);
  const toast = useToast();

  const rejectQuantityProvider = (data) => {
    setDisableQuantity(data);
  };

  // FETCH REASON API
  const fetchReasonsApi = async () => {
    const res = await request.get("Reason/GetAllActiveReasons");
    return res.data;
  };

  const getReasonHandler = async () => {
    fetchReasonsApi().then((res) => {
      setReasons(res);
    });
  };

  useEffect(() => {
    getReasonHandler();
  }, [setReasons]);

  // USE EFFECT (QUANTITY)
  useEffect(() => {
    if (finalData.length) {
      let totalQuantity = finalData.map((q) => parseFloat(q.quantity));
      let sum = totalQuantity.reduce((a, b) => a + b);
      setSumQuantity(sum);
    } else {
      setSumQuantity(0);
    }
  }, [finalData, sumQuantity]);

  useEffect(() => {
    setSubmitDataTwo(finalData);
  }, [finalData]);

  // QTY HANDLER FOR QUANTITY INPUT
  const quantityHandler = (data) => {
    if (data) {
      if (data + Number(sumQuantity) >= actualDelivered) {
        ToastComponent(
          "Warning",
          "You are providing a value greater than or equal to your Actual Good!",
          "warning",
          toast
        );
        setQuantity("");
      } else {
        setQuantity(data);
      }
    } else {
      setQuantity("");
    }
  };

  // Disabled reject quantity
  const disabledQuantityReject = () => {
    setDisabled(false);
  };

  const disabledQuantityProvider = (data) => {
    setDisableQuantity(data);
  };

  // REASON HANDLER
  const remarksHandler = (data) => {
    if (data) {
      const newData = JSON.parse(data);
      setRemarks(newData.id);
      setRemarksName(newData.reasonName);
    } else {
      setRemarks("");
    }
  };

  // HANDLER FOR REJECTION BUTTON
  const addNewRowHandler = () => {
    // quantityHandler()
    if (finalData.some((data) => data.remarks === remarks)) {
      ToastComponent(
        "Error!",
        "Remarks description already added",
        "error",
        toast
      );
      return;
    }

    if (!quantity) {
      setErrors({
        qty: true,
      });
      return;
    }
    if (!remarks) {
      setErrors({
        rms: true,
      });
      return;
    } else {
      setErrors({
        qty: false,
        rms: false,
      });
    }

    const data = {
      pO_ReceivingId: receivingId,
      quantity: quantity,
      remarks: remarks,
      remarksName: remarksName,
    };
    setFinalData([...finalData, data]);

    remarksDisplay.current.selectedIndex = 0;
    setQuantity("");
    setDisabled(true);
  };

  // REMOVE THE DATA FROM THE TABLE ADD REJECT
  const deleteRejectionHandler = (data) => {
    setFinalData(finalData.filter((row) => row.remarksName !== data));
  };

  return (
    <Box>
      <Accordion allowToggle defaultIndex={[1]}>
        <AccordionItem>
          <Flex
            bg="primary"
            color="white"
            justifyContent="space-between"
            alignItems="center"
          >
            <AccordionButton p={1}>
              <Text fontSize="13px" fontWeight="semibold">
                {" "}
                REJECTION INFORMATION <AccordionIcon />{" "}
              </Text>
            </AccordionButton>
            <Button
              leftIcon={<IoAddSharp fontSize="17px" />}
              colorScheme="red"
              size="xs"
              mr={1}
              // borderRadius="full"
              borderRadius="none"
              onClick={disabledQuantityReject}
              onChange={(e) => rejectQuantityProvider(e.target.value)}
            >
              Add Reject
            </Button>
          </Flex>

          <AccordionPanel>
            <Flex justifyContent="space-between">
              <FormLabel w="50%" fontSize="12px" p={0}>
                Quantity
                <Input
                  disabled={disabled}
                  value={quantity}
                  onChange={(e) => quantityHandler(parseInt(e.target.value))}
                  onWheel={(e) => e.target.blur()}
                  isInvalid={errors.qty}
                  fontSize="11px"
                  size="sm"
                  bgColor="#ffffe0"
                  placeholder="Quantity"
                  type="number"
                />
              </FormLabel>
              <FormLabel w="50%" fontSize="12px">
                Remarks
                {reasons.length > 0 ? (
                  <Select
                    ref={remarksDisplay}
                    disabled={disabled}
                    onChange={(e) => remarksHandler(e.target.value)}
                    isInvalid={errors.rms}
                    placeholder="Select Reason"
                    fontSize="11px"
                    size="sm"
                    border="1px"
                    borderColor="gray.400"
                    bgColor="#ffffe0"
                  >
                    {reasons?.map((reason) => (
                      <option key={reason.id} value={JSON.stringify(reason)}>
                        {reason.reasonName}
                      </option>
                    ))}
                  </Select>
                ) : (
                  "Loading"
                )}
              </FormLabel>
            </Flex>

            <Flex justifyContent="space-between">
              <Badge colorScheme="blue"> Total Quantity: {sumQuantity} </Badge>
              <Button
                leftIcon={<IoIosSave fontSize="20px" />}
                size="xs"
                colorScheme="blue"
                borderRadius="full"
                onClick={addNewRowHandler}
              >
                Save Reject
              </Button>
            </Flex>
            {!finalData.length > 0 ? (
              ""
            ) : (
              <Table size="sm" mt={2} bg="form">
                <Thead>
                  <Tr bgColor="primary">
                    <Th color="white" fontSize="10px">
                      Quantity
                    </Th>
                    <Th color="white" fontSize="10px">
                      Remarks
                    </Th>
                    <Th color="white"></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {finalData?.map((data, i) => (
                    <Tr key={i}>
                      <Td fontSize="10px">{data.quantity}</Td>
                      <Td fontSize="10px">{data.remarksName}</Td>
                      {/* <Td>{data.rawMaterialDescription}</Td> */}
                      <Td>
                        <Button
                          p={0}
                          background="none"
                          color="secondary"
                          onClick={() =>
                            deleteRejectionHandler(data.remarksName)
                          }
                        >
                          <FaMinusCircle fontSize="17px" color="red" />
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default EditAddRejectionModal;
