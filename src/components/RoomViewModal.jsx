import React, { useEffect, useState } from "react";

import { Descriptions, Modal } from "antd";
import { getRoomById } from "../services/RoomService";

function RoomViewModal({ roomId, roomStatus, onSetRoomViewStatus }) {
  const [room, setRoom] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);

  const closeModal = () => {
    setModalVisible(false);
    onSetRoomViewStatus(false);
  };

  useEffect(() => {
    if (roomStatus) {
      getRoomById(roomId).then((resp) => {
        resp.nombreNivel = resp.nivel.nombre;
        resp.nombreTipo = resp.tipoHabitacion.nombre;
        resp.nroCamas = resp.tipoHabitacion.nroCamas;
        resp.precio = resp.tipoHabitacion.precio;
        setRoom(resp);
      });
      setModalVisible(roomStatus);
    } else {
      setModalVisible(roomStatus);
    }
  }, [roomId, roomStatus]);

  return (
    <Modal
      title={`Habitación ${room.nombre}`}
      visible={isModalVisible}
      onOk={closeModal}
      onCancel={closeModal}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <div className="room-photo">
        <img src={room.imagen} alt="Habitación" />
      </div>
      <p>{room.descripcion}</p>
      <Descriptions layout="vertical">
        <Descriptions.Item label="Nivel">{room.nombreNivel}</Descriptions.Item>
        <Descriptions.Item label="Tipo Habitación">
          {room.nombreTipo}
        </Descriptions.Item>
        <Descriptions.Item label="Nro Camas">{room.nroCamas}</Descriptions.Item>
        <Descriptions.Item label="Precio">
          S/ {room.precio}.00
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}

export default RoomViewModal;
