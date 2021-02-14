import React from "react";

import { PageHeader } from "antd";

import "./Reception2.css";
import RoomCardList from "../../components/RoomCardList";

function Reception2() {
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="Recepción"
        subTitle="Recepción de habitaciones."
      />
      <RoomCardList />
    </div>
  );
}

export default Reception2;
