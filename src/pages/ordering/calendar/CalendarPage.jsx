import React, { useEffect, useState } from "react";
import request from "../../../services/ApiClient";
import { CalendarList } from "./CalendarList";

const fetchForMoveOrderApi = async (status) => {
  const res = await request.get(
    `Ordering/GetAllApprovedOrdersForCalendar?status=${status}`
  );
  return res.data;
};

const CalendarPage = () => {
  const [forMOData, setForMOData] = useState([]);
  const [status, setStatus] = useState(false);

  const fetchForMoveOrder = () => {
    fetchForMoveOrderApi(status).then((res) => {
      setForMOData(res);
    });
  };

  useEffect(() => {
    fetchForMoveOrder();

    return () => {
      setForMOData([]);
    };
  }, [status]);

  return (
    <CalendarList forMOData={forMOData} status={status} setStatus={setStatus} />
  );
};

export default CalendarPage;
