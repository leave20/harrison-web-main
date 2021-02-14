import React, { useEffect, useState } from "react";
import { Button, Empty, Table, Tag } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import RoomViewModal from "./RoomViewModal";
import BookRegisterForm from "./BookRegisterForm";

const RoomFilterTable = ({ data }) => {
  const [dataSource, setDataSource] = useState([]);
  const [roomId, setRoomId] = useState(null);
  const [roomStatus, setRoomStatus] = useState(false);
  const [drawerStatus, setDrawerStatus] = useState(false);

  const modalActive = (id) => {
    setRoomId(id);
    setRoomStatus(true);
  };

  const drawerActive = (id, precio) => {
    const preDataBook = JSON.parse(localStorage.getItem("preDataBook"));
    localStorage.setItem(
      "preDataBook",
      JSON.stringify({ ...preDataBook, roomId: id, roomPrice: precio })
    );
    setDrawerStatus(true);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      width: 50,
      fixed: "left",
      align: "center",
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      align: "center",
      width: 100,
    },
    {
      title: "Tipo de Habitación",
      dataIndex: "tipo",
      key: "tipo",
      align: "center",
      width: 250,
    },
    {
      title: "Nivel",
      dataIndex: "nombreNivel",
      key: "nombreNivel",
      align: "center",
      width: 150,
      filters: [
        {
          text: "PRIMER PISO",
          value: "PRIMER PISO",
        },
        {
          text: "SEGUNDO PISO",
          value: "SEGUNDO PISO",
        },
        {
          text: "TERCER PISO",
          value: "TERCER PISO",
        },
        {
          text: "CUARTO PISO",
          value: "CUARTO PISO",
        },
        {
          text: "QUINTO PISO",
          value: "QUINTO PISO",
        },
        {
          text: "SEXTO PISO",
          value: "SEXTO PISO",
        },
      ],
      filterMultiple: false,
      onFilter: (value, record) => {
        let nivel = String(record.nombreNivel);
        return nivel.indexOf(value) === 0;
      },
    },
    {
      title: "N° Camas",
      dataIndex: "nroCamas",
      key: "nroCamas",
      align: "center",
      width: 100,
    },
    {
      title: "Precio",
      dataIndex: "precio",
      key: "precio",
      align: "center",
      fixed: "right",
      width: 110,
      render: (val, record) => <Tag color="volcano">S/{record.precio}.00</Tag>,
    },
    {
      title: "Acciones",
      key: "action",
      fixed: "right",
      width: 150,
      align: "center",
      render: (val, record) => (
        <>
          <Button
            type="link"
            size="small"
            onClick={() => modalActive(record.id)}
          >
            <EyeOutlined />
          </Button>
          <Button
            type="primary"
            size="small"
            style={{ marginLeft: "8px" }}
            onClick={() => drawerActive(record.id, record.precio)}
          >
            Reservar
          </Button>
        </>
      ),
    },
  ];

  const formatDataRooms = (data) => {
    return data.map((data, idx) => {
      data.key = idx + 1;
      data.nombreNivel = data.nivel.nombre;
      data.nroCamas = data.tipoHabitacion.nroCamas;
      data.precio = data.tipoHabitacion.precio;
      data.tipo = data.tipoHabitacion.nombre;
      return data;
    });
  };

  useEffect(() => {
    setDataSource(formatDataRooms(data));
  }, [data]);

  return (
    <div style={{ marginTop: "30px" }}>
      {data.length === 0 ? (
        <Empty description="No hay datos. Filtre las habitaciones para mostrar las opciones." />
      ) : (
        <>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={{ pageSize: 5 }}
            scroll={{ x: 1000 }}
          />
          <RoomViewModal
            roomId={roomId}
            roomStatus={roomStatus}
            onSetRoomViewStatus={setRoomStatus}
          />
          <BookRegisterForm
            status={drawerStatus}
            onSetStatus={setDrawerStatus}
          />
        </>
      )}
    </div>
  );
};

export default RoomFilterTable;
