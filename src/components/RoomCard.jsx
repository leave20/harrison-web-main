import React, { useEffect, useState } from "react";

import { Card, Col, Descriptions, message, Popconfirm, Tag } from "antd";
import { ColumnWidthOutlined, EyeOutlined } from "@ant-design/icons";
import RoomViewModal from "./RoomViewModal";

import moment from "moment";
import "moment/locale/es";
import { changeStatusRoom } from "../services/RoomService";

const gridStyle = {
  width: "100%",
  textAlign: "center",
};

function RoomCard({ roomData, onClick, onSetChangeStatusRoom }) {
  moment.locale("es");

  const [room, setRoom] = useState({});
  const [colorStatus, setColorStatus] = useState("");
  const [roomViewStatus, setRoomViewStatus] = useState(false);

  const enabledRoom = () => {
    changeStatusRoom(room.id, "DISPONIBLE").then(() => {
      message.success("Habitación " + room.nombre + " disponible.");
      onSetChangeStatusRoom(true);
    });
  };

  useEffect(() => {
    if (roomData !== null) {
      setRoom(roomData);
      switch (roomData.estado) {
        case "DISPONIBLE":
          setColorStatus("#42DC64");
          break;
        case "OCUPADO":
          setColorStatus("#FF3D48");
          break;
        case "LIMPIEZA":
          setColorStatus("#4BC9FF");
          break;
        case "RESERVADO":
          setColorStatus("#FFB422");
          break;
        default:
          break;
      }
    }
  }, [roomData]);
  return (
    <>
      <Col className="gutter-row" span={6}>
        <Popconfirm
          title="¿Desea finalizar la limpieza?"
          onConfirm={enabledRoom}
          onCancel={console.log}
          okText="Sí"
          cancelText="No"
          disabled={room.estado === "LIMPIEZA" ? false : true}
        >
          <Card
            hoverable
            style={gridStyle}
            actions={[<EyeOutlined onClick={() => setRoomViewStatus(true)} />]}
          >
            <div className="card-header" onClick={onClick}>
              <div className="tag-header" style={{ background: colorStatus }}>
                <ColumnWidthOutlined style={{ fontSize: "25px" }} />
                <span className="status">{room.estado}</span>
              </div>
              <h3>{room.nombre}</h3>
            </div>
            <div className="card-body" onClick={onClick}>
              <Descriptions column={1}>
                <Descriptions.Item label="Tipo">{room.tipo}</Descriptions.Item>
                <Descriptions.Item label="Nivel">
                  {room.nombreNivel}
                </Descriptions.Item>
                <Descriptions.Item label="Precio">
                  <Tag color="volcano">S/{room.precio}</Tag>
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Card>
        </Popconfirm>
      </Col>
      <RoomViewModal
        roomId={room.id}
        roomStatus={roomViewStatus}
        onSetRoomViewStatus={setRoomViewStatus}
      />
    </>
  );
}

export default RoomCard;
