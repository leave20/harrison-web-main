import React, { useState } from "react";

import RoomFilterForm from "../../components/RoomFilterForm";
import RoomFilterTable from "../../components/RoomFilterTable";

import { PageHeader } from "antd";

const Book2 = () => {
  const [rooms, setRooms] = useState([]);

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="Reserva"
        subTitle="Reserva de Habitaciones."
      />
      <RoomFilterForm onSetRoomFilter={setRooms} />
      <RoomFilterTable data={rooms}/>
    </div>
  );
};

export default Book2;
