import React, { useState, useEffect } from "react";
import { usePagination } from "@ajna/pagination";
import request from "../../../services/ApiClient";
import { ForApprovalMoveOrder } from "./ForApprovalMoveOrder";

const fetchForApprovalMOApi = async (search, status) => {
  const res = await request.get(
    `Ordering/ForApprovalMoveOrderPaginationOrig?search=${search}&status=${status}`
  );
  return res.data;
};

const fetchViewApi = async (mirId) => {
  const res = await request.get(
    `Ordering/ViewMoveOrderForApproval?id=${mirId}`
  );
  return res.data;
};

const ForApprovalMo = ({ notification, fetchNotification }) => {
  const [forApprovalData, setForApprovalData] = useState([]);
  const [search, setSearch] = useState("");
  const [mirId, setMirId] = useState("");
  const [mirNo, setMirNo] = useState([]);
  const [viewData, setViewData] = useState([]);
  const [status, setStatus] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [genusData, setGenusData] = useState([]);

  //List
  const fetchForApprovalMO = () => {
    fetchForApprovalMOApi(search, status).then((res) => {
      setForApprovalData(res);
      // console.log(res);
    });
  };

  useEffect(() => {
    fetchForApprovalMO();

    return () => {
      setForApprovalData([]);
    };
  }, [search, status]);

  //For View and Printing Layout
  const fetchView = () => {
    fetchViewApi(mirId).then((res) => {
      setViewData(res);
    });
  };

  useEffect(() => {
    if (mirId) {
      fetchView();
    }

    return () => {
      setViewData([]);
    };
  }, [mirId]);

  return (
    <ForApprovalMoveOrder
      setSearch={setSearch}
      forApprovalData={forApprovalData}
      fetchForApprovalMO={fetchForApprovalMO}
      mirId={mirId}
      setMirId={setMirId}
      mirNo={mirNo}
      setMirNo={setMirNo}
      viewData={viewData}
      status={status}
      setStatus={setStatus}
      checkedItems={checkedItems}
      setCheckedItems={setCheckedItems}
      notification={notification}
      fetchNotification={fetchNotification}
      genusData={genusData}
      setGenusData={setGenusData}
    />
  );
};

export default ForApprovalMo;
