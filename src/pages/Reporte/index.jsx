import {
  BookOutlined,
  ClearOutlined,
  ColumnWidthOutlined,
  RiseOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  message,
  PageHeader,
  Row,
  Table,
  Tag,
} from "antd";
import React, { useEffect, useState } from "react";

import { Doughnut } from "react-chartjs-2";

import "./Reporte.css";

import moment from "moment";
import "moment/locale/es";
import { findDateFactura } from "../../services/FacturaService";
import {
  countHabitaciones,
  countHuespedes,
  countReservas,
  countTipoHabitación,
  countVentas,
} from "../../services/CountService";

const dateFormatList = ["DD-MM-YYYY", "YYYY-MM-DD"];

let fechasFactura = {
  start: "",
  finish: "",
};

function Reporte() {
  moment.locale("es");

  const [range, setRange] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [countHue, setCountHue] = useState(0);
  const [countHab, setCountHab] = useState(0);
  const [countReser, setCountReser] = useState(0);
  const [countVent, setCountVent] = useState(0);
  const [tipo1, setTipo1] = useState(0);
  const [tipo2, setTipo2] = useState(0);
  const [tipo3, setTipo3] = useState(0);
  const [tipo4, setTipo4] = useState(0);
  const [tipo5, setTipo5] = useState(0);

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
      title: "Huesped",
      dataIndex: "nombreHu",
      key: "nombreHu",
      align: "center",
      width: 200,
    },
    {
      title: "Documento",
      dataIndex: "documento",
      key: "documento",
      align: "center",
      width: 100,
    },
    {
      title: "Habitación",
      dataIndex: "habita",
      key: "habita",
      align: "center",
      width: 200,
    },
    {
      title: "Precio Estadía",
      dataIndex: "precio",
      key: "precio",
      align: "center",
      width: 100,
      render: (val, record) => <Tag color="success">S/{record.precio}.00</Tag>,
    },
  ];

  const data = {
    labels: ["INDIVIDUAL", "QUEEN", "KING", "MINI SUITE", "MASTER SUITE"],
    datasets: [
      {
        data: [tipo1, tipo2, tipo3, tipo4, tipo5],
        backgroundColor: [
          "#008080",
          "#029797",
          "#027c97",
          "#0290af",
          "#0278af",
        ],
        hoverBackgroundColor: [
          "#464646",
          "#464646",
          "#464646",
          "#464646",
          "#464646",
        ],
      },
    ],
  };

  function onChangeRange(date, dateString) {
    console.log("start", dateString[0]);
    console.log("finish", dateString[1]);
    console.log("dateRange", date);
    fechasFactura.start = dateString[0];
    fechasFactura.finish = dateString[1];
    console.log(fechasFactura);
    setRange(date);
  }

  const searchVentas = () => {
    console.log("submit", fechasFactura);
    findDateFactura(fechasFactura)
      .then((resp) => {
        console.log(resp);
        resp.forEach((data) => {
          data.key = data.id;
          data.nombreHu = `${data.reserva.huesped.nombre} ${data.reserva.huesped.apellido}`;
          data.documento = data.reserva.huesped.documento;
          data.habita = `(${data.reserva.habitacion.nombre}) ${data.reserva.habitacion.tipoHabitacion.nombre}`;
          data.precio = data.reserva.precioTotal;
        });
        setDataSource(resp);
        message.success(resp.length + " Ventas Encontradas.");
      })
      .catch((err) => {
        console.log(err);
        message.error("No se encontrarón ventas.");
      });
  };

  const clearFilter = () => {
    fechasFactura.start = "";
    fechasFactura.finish = "";
    setRange(null);
    setDataSource([]);
  };

  useEffect(() => {
    countHuespedes().then(setCountHue);
    countHabitaciones().then(setCountHab);
    countReservas().then(setCountReser);
    countVentas().then(setCountVent);
    countTipoHabitación(1).then(setTipo1);
    countTipoHabitación(2).then(setTipo2);
    countTipoHabitación(3).then(setTipo3);
    countTipoHabitación(4).then(setTipo4);
    countTipoHabitación(5).then(setTipo5);
  }, []);

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="Informes"
        subTitle="Informes que mostrarán un panorama del sistema."
      />
      <div className="site-card-wrapper">
        <Row gutter={50}>
          <Col span={6}>
            <Card className="card-report" hoverable>
              <div className="left">
                <div className="icon">
                  <UserOutlined />
                </div>
              </div>
              <div className="right">
                <h3 className="title">Huéspedes</h3>
                <span>{countHue}</span>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card className="card-report" hoverable>
              <div className="left">
                <div className="icon">
                  <ColumnWidthOutlined />
                </div>
              </div>
              <div className="right">
                <h3 className="title">Habitaciones</h3>
                <span>{countHab}</span>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card className="card-report" hoverable>
              <div className="left">
                <div className="icon">
                  <BookOutlined />
                </div>
              </div>
              <div className="right">
                <h3 className="title">Reservas</h3>
                <span>{countReser}</span>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card className="card-report" hoverable>
              <div className="left">
                <div className="icon">
                  <RiseOutlined />
                </div>
              </div>
              <div className="right">
                <h3 className="title">Ventas</h3>
                <span>{countVent}</span>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      <div className="bottom-report" style={{ marginTop: "20px" }}>
        <Row gutter={50}>
          <Col span={8}>
            <Card
              title={
                <span style={{ fontWeight: "bold", color: "#222222" }}>
                  Tipos de Habitaciones
                </span>
              }
              hoverable
            >
              <Doughnut data={data} />
            </Card>
          </Col>
          <Col span={16}>
            <Card title={
                <span style={{ fontWeight: "bold", color: "#222222" }}>
                  Ventas Realizadas
                </span>
              } hoverable>
              <div style={{ marginBottom: "20px" }}>
                <DatePicker.RangePicker
                  name="dateRange"
                  value={range}
                  onChange={onChangeRange}
                  format={dateFormatList[1]}
                />
                <Button
                  type="primary"
                  style={{ margin: "0 10px" }}
                  onClick={searchVentas}
                >
                  Buscar
                </Button>
                <Button type="ghost" onClick={clearFilter}>
                  <ClearOutlined />
                </Button>
              </div>
              <Table
                dataSource={dataSource}
                columns={columns}
                pagination={{ pageSize: 5 }}
                scroll={{ x: 1000 }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Reporte;
