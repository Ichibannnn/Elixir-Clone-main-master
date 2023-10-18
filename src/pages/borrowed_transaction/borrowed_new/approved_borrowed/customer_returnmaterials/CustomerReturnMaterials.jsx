import React, { useState, useEffect } from "react";
import {
  Button,
  Flex,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { usePagination } from "@ajna/pagination";
import { ToastComponent } from "../../../../../components/Toast";
import request from "../../../../../services/ApiClient";

const CustomerReturnMaterials = () => {
  const [returnData, setReturnData] = useState([]);
  const [lengthIndicator, setLengthIndicator] = useState("");

  const [returnId, setReturnId] = useState("");
  const [returnListData, setReturnListData] = useState([]);

  const [highlighterId, setHighlighterId] = useState("");
  const [preparedQty, setPreparedQty] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(false);
  const [pageTotal, setPageTotal] = useState(undefined);

  let [buttonChanger, setButtonChanger] = useState(false);

  return <div>CustomerReturnMaterials</div>;
};

export default CustomerReturnMaterials;
