import React, { useEffect, useState } from "react";

import {
  Button,
  PageHeader,
  Table,
  Tag,
  Modal,
  Descriptions,
  Input,
} from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";

import { getRooms, getRoomById } from "../../services/RoomService";

import "../Book/Book.css";

const Room = () => {
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [filterTable, setFilterTable] = useState(null);
  const [room, setRoom] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);

  const formatDataRooms = (data) => {
    data.forEach((data, idx) => {
      data.key = idx + 1;
      data.nivel = data.nivel.nombre;
      data.nroCamas = data.tipoHabitacion.nroCamas;
      data.precio = data.tipoHabitacion.precio;
      data.tipo = data.tipoHabitacion.nombre;
    });
    return data;
  };

  const listRooms = () => {
    getRooms().then((resp) => {
      setDataSource(formatDataRooms(resp));
      console.log(dataSource);
      setLoading(false);
    });
  };

  const getRoomInfo = (state, id) => {
    if (state) {
      getRoomById(id).then((resp) => {
        resp.nombreNivel = resp.nivel.nombre;
        resp.nombreTipo = resp.tipoHabitacion.nombre;
        resp.nroCamas = resp.tipoHabitacion.nroCamas;
        resp.precio = resp.tipoHabitacion.precio;
        setRoom(resp);
        setModalVisible(state);
      });
    } else {
      setModalVisible(state);
    }
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
      width: 150,
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
      dataIndex: "nivel",
      key: "nivel",
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
        let nivel = String(record.nivel);
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
      width: 150,
      render: (val, record) => <span>S/{record.precio}.00</span>,
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      align: "center",
      render: (val, record) => {
        switch (record.estado) {
          case "DISPONIBLE":
            return <Tag color="green">{record.estado}</Tag>;
          case "OCUPADO":
            return <Tag color="volcano">{record.estado}</Tag>;
          case "MANTENIMIENTO":
            return <Tag color="blue">{record.estado}</Tag>;
          default:
            <Tag color="gold">NO DEFINIDO</Tag>;
            break;
        }
      },
      filters: [
        {
          text: "DISPONIBLE",
          value: "DISPONIBLE",
        },
        {
          text: "OCUPADO",
          value: "OCUPADO",
        },
        {
          text: "MANTENIMIENTO",
          value: "MANTENIMIENTO",
        },
      ],
      filterMultiple: false,
      onFilter: (value, record) => {
        let estado = String(record.estado);
        return estado.indexOf(value) === 0;
      },
      width: 150,
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
            onClick={() => getRoomInfo(true, record.id)}
          >
            <EyeOutlined />
          </Button>
          <Button type="link" size="small">
            <EditOutlined />
          </Button>
        </>
      ),
    },
  ];

  const keyUpTable = (value) => {
    setFilterTable(
      dataSource.filter((o) =>
        Object.keys(o).some((k) =>
          String(o[k]).toLowerCase().includes(value.toLowerCase())
        )
      )
    );
  };

  useEffect(() => {
    listRooms(); // eslint-disable-next-line
  }, []);

  return (
    <div>
      <Modal
        title={`Habitación ${room.nombre}`}
        visible={isModalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <div className="room-photo">
          <img src={room.imagen} alt="Habitación" />
        </div>
        <p>{room.descripcion}</p>
        <Descriptions layout="vertical">
          <Descriptions.Item label="Nivel">
            {room.nombreNivel}
          </Descriptions.Item>
          <Descriptions.Item label="Tipo Habitación">
            {room.nombreTipo}
          </Descriptions.Item>
          <Descriptions.Item label="Nro Camas">
            {room.nroCamas}
          </Descriptions.Item>
          <Descriptions.Item label="Precio">
            S/ {room.precio}.00
          </Descriptions.Item>
        </Descriptions>
      </Modal>
      <PageHeader
        className="site-page-header"
        title="Habitación"
        subTitle="Mantenimiento de Habitaciones."
        extra={<Button type="primary">Añadir Habitación</Button>}
      />
      <Input.Search
        className="searchInput"
        placeholder="Buscar por nombre, tipo de habitación..."
        onKeyUpCapture={(e) => keyUpTable(e.target.value)}
      />
      <Table
        loading={loading}
        dataSource={filterTable === null ? dataSource : filterTable}
        columns={columns}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 1000 }}
        style={{ marginTop: "20px" }}
      />
    </div>
  );
};

export default Room;
