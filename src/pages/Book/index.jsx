import React, { useEffect, useState } from "react";

import {
  Form,
  Button,
  PageHeader,
  Table,
  DatePicker,
  Select,
  Card,
  Tooltip,
  Modal,
  Descriptions,
  Drawer,
  Checkbox,
  Input,
  Row,
  Col,
  Alert,
  message,
  InputNumber,
} from "antd";
import { ClearOutlined, EyeOutlined } from "@ant-design/icons";

import { getRooms, getRoomById } from "../../services/RoomService";

import * as Yup from "yup";
import { useFormik } from "formik";
import { createBook, findBooksByRangeDate } from "../../services/BookService";
import { getRoomKinds } from "../../services/RoomKindService";

import "./Book.css";
import { getGuestById, getGuests } from "../../services/GuestService";

import moment from "moment";
import "moment/locale/es";

const { RangePicker } = DatePicker;

const styleFormItem = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
};

const Book = () => {
  moment.locale("es");

  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [filterTable, setFilterTable] = useState(null);
  const [roomKinds, setRoomKinds] = useState([]);
  const [room, setRoom] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [loadFilter, setLoadFilter] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [guests, setGuests] = useState([]);
  const [disabledPlaca, setDisabledPlaca] = useState(true);
  const [modalBookDetail, setModalBookDetail] = useState(false);
  const [tempHuesped, setTempHuesped] = useState("");
  const [tempHabitacion, setTempHabitacion] = useState("");

  const validationSchema = Yup.object().shape({
    dateRange: Yup.array()
      .nullable()
      .required("Fecha de Inicio y Fin requerido."),
  });

  const formik = useFormik({
    initialValues: {
      start: "",
      finish: "",
      dateRange: null,
      roomKind: "",
      numBeds: null,
    },
    validationSchema,
    onSubmit: (value) => {
      setLoadFilter(true);
      console.log("FORMIK", value);
      findBooksByRangeDate(value).then((data) => {
        if (formik.values.roomKind === "") {
          setFilterTable(formatDataRooms(data));
        } else {
          filterRooms(data);
        }
        setLoadFilter(false);
        console.log("RESP FORMIK", data);
      });
    },
  });

  const validationSchemaBook = Yup.object().shape({
    precioTotal: Yup.number().required("Precio requerido"),
    pagoAdelantado: Yup.number().nullable().required("Pago requerido"),
    huesped: Yup.object().shape({
      id: Yup.number().nullable().required("Huésped requerido"),
    }),
  });

  const formikBook = useFormik({
    initialValues: {
      fechaFinal: "",
      fechaInicio: "",
      precioTotal: 0,
      pagoAdelantado: null,
      placaVehiculo: "",
      huesped: {
        id: null,
      },
      habitacion: {
        id: null,
      },
    },
    validationSchema: validationSchemaBook,
    onSubmit: (values) => {
      console.log(values);
      getGuestById(values.huesped.id).then((resp) => {
        console.log(resp);
        setTempHuesped(resp.nombre + " (" + resp.documento + ")");
      });
      getRoomById(values.habitacion.id).then((resp) => {
        console.log(resp);
        setTempHabitacion(
          resp.nombre + " (" + resp.tipoHabitacion.nombre + ")"
        );
      });
      setModalBookDetail(true);
    },
  });

  const saveBook = () => {
    createBook(formikBook.values)
      .then((resp) => {
        console.log(resp);
        message.success("Reserva realizada correctamente");
      })
      .catch(() => message.error("Ocurrió un error. Intentelo de nuevo."));
    setModalBookDetail(false);
    setDrawerVisible(false);
    formikBook.resetForm();
    clearFilter();
  };

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
          <Button
            type="primary"
            size="small"
            style={{ marginLeft: "8px" }}
            onClick={() => openDrawer(record.id, record.precio)}
          >
            Reservar
          </Button>
        </>
      ),
    },
  ];

  const dateFormatList = ["DD-MM-YYYY", "YYYY-MM-DD"];

  function onChangeRange(date, dateString) {
    formik.setFieldValue("start", dateString[0]);
    formik.setFieldValue("finish", dateString[1]);
    formik.setFieldValue("dateRange", date);
  }

  const filterRooms = (data) => {
    let dataKindFilter = data.filter(
      (data) => data.tipoHabitacion.nombre === formik.values.roomKind
    );
    console.log("FILTER", dataKindFilter);
    setFilterTable(formatDataRooms(dataKindFilter));
  };

  const clearFilter = () => {
    setFilterTable(null);
    formik.resetForm();
  };

  const closeDrawer = () => {
    formikBook.resetForm();
    setDrawerVisible(false);
  };

  const openDrawer = (id, precio) => {
    if (filterTable === null) {
      message.info("Necesita filtrar la fecha inicio y fin.");
    } else {
      const start = moment(formik.values.start);
      const finish = moment(formik.values.finish);
      const dias = finish.diff(start, "days");

      let precioXdias = precio * dias;

      formikBook.setFieldValue(
        "fechaInicio",
        formik.values.start + "T06:58:03.747Z"
      );
      formikBook.setFieldValue(
        "fechaFinal",
        formik.values.finish + "T06:58:03.747Z"
      );
      formikBook.setFieldValue("precioTotal", precioXdias + 0.18 * precioXdias);
      formikBook.setFieldValue("habitacion.id", id);
      setDrawerVisible(true);
    }
  };

  useEffect(() => {
    getGuests().then(setGuests);
    getRoomKinds().then(setRoomKinds);
    listRooms(); // eslint-disable-next-line
  }, []);

  return (
    <div>
      <Modal
        title="Detalle "
        visible={modalBookDetail}
        onOk={() => setModalBookDetail(false)}
        onCancel={() => setModalBookDetail(false)}
        footer={
          <Button type="primary" onClick={saveBook}>
            Confirmar Datos
          </Button>
        }
      >
        <Descriptions layout="vertical">
          <Descriptions.Item label="Fecha Inicio">
            {moment(formik.values.start).format("dddd, D MMMM [del] YYYY")}
          </Descriptions.Item>
          <Descriptions.Item label="Fecha Final">
            {moment(formik.values.finish).format("dddd, D MMMM [del] YYYY")}
          </Descriptions.Item>
          <Descriptions.Item label=""></Descriptions.Item>
          <Descriptions.Item label="Habitación">
            {tempHabitacion}
          </Descriptions.Item>
          <Descriptions.Item label="Huesped">{tempHuesped}</Descriptions.Item>
          <Descriptions.Item label="Estacionamiento">NO</Descriptions.Item>
          <Descriptions.Item label="Precio Total + IGV">
            S/ {formikBook.values.precioTotal}
          </Descriptions.Item>
          <Descriptions.Item label="Pago Adelantado">
            S/ {formikBook.values.pagoAdelantado}
          </Descriptions.Item>
          <Descriptions.Item label="Pago Restante">
            S/{" "}
            {formikBook.values.precioTotal - formikBook.values.pagoAdelantado}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
      <Drawer
        title="Reserva"
        placement="right"
        closable={false}
        onClose={closeDrawer}
        visible={drawerVisible}
        width={400}
      >
        <Alert
          type="info"
          description={
            <div>
              <Descriptions layout="vertical" column={1}>
                <Descriptions.Item label="Fecha Inicio">
                  {moment(formik.values.start).format(
                    "dddd, D MMMM [del] YYYY"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Fecha Final">
                  {moment(formik.values.finish).format(
                    "dddd, D MMMM [del] YYYY"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Precio Total + IGV">
                  S/ {formikBook.values.precioTotal}
                </Descriptions.Item>
              </Descriptions>
            </div>
          }
          style={{ marginBottom: "20px" }}
        />
        <Form layout="vertical" onSubmitCapture={formikBook.handleSubmit}>
          <Form.Item label="Habitación" required>
            <Select
              showSearch
              name="habitacion.id"
              placeholder="Seleccione una Habitación"
              optionFilterProp="children"
              style={{ width: "100%" }}
              value={formikBook.values.habitacion.id}
              disabled
              onChange={(text) =>
                formikBook.setFieldValue("habitacion.id", text)
              }
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {dataSource.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {String(`(${data.nombre}) ${data.tipo}`)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Huésped" required>
            <Select
              showSearch
              name="huesped.id"
              placeholder="Seleccione un huésped"
              optionFilterProp="children"
              style={{ width: "100%" }}
              value={formikBook.values.huesped.id}
              onChange={(text) => formikBook.setFieldValue("huesped.id", text)}
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {guests.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {String(`(${data.documento}) ${data.nombre}`)}
                </Select.Option>
              ))}
            </Select>
            {formikBook.errors.huesped && formikBook.touched.huesped ? (
              <div className="error-field">{formikBook.errors.huesped.id}</div>
            ) : null}
          </Form.Item>

          <Row gutter={20}>
            <Col span={12}>
              <Form.Item label="¿Estacionamiento?">
                <Checkbox onChange={(e) => setDisabledPlaca(!e.target.checked)}>
                  {disabledPlaca === true ? "NO" : "SI"}
                </Checkbox>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Placa de Vehículo">
                <Input
                  name="placaVehiculo"
                  value={formikBook.values.placaVehiculo}
                  onChange={formikBook.handleChange}
                  placeholder="Escriba el nro de Placa"
                  disabled={disabledPlaca}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="Saldo Adelantado" required>
                <InputNumber
                  name="pagoAdelantado"
                  min={0}
                  max={formikBook.values.precioTotal}
                  value={formikBook.values.pagoAdelantado}
                  onChange={(value) =>
                    formikBook.setFieldValue("pagoAdelantado", value)
                  }
                  style={{ width: "100%" }}
                  placeholder="S/ 0.00"
                />
                {formikBook.errors.pagoAdelantado &&
                formikBook.touched.pagoAdelantado ? (
                  <div className="error-field">
                    {formikBook.errors.pagoAdelantado}
                  </div>
                ) : null}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Saldo a Deber">
                <Input
                  value={
                    formikBook.values.precioTotal -
                    formikBook.values.pagoAdelantado
                  }
                  placeholder="S/ 0.00"
                  readOnly
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Registrar Reserva
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
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
        title="Reserva"
        subTitle="Reserva de Habitaciones."
      />
      <Card>
        <Form layout="inline" onSubmitCapture={formik.handleSubmit}>
          <Form.Item label="Fecha Inicio Y Fin" required style={styleFormItem}>
            <RangePicker
              name="dateRange"
              value={formik.values.dateRange}
              onChange={onChangeRange}
              format={dateFormatList[1]}
            />
            {formik.errors.dateRange && formik.touched.dateRange ? (
              <div className="error-field">{formik.errors.dateRange}</div>
            ) : null}
          </Form.Item>
          <Form.Item label="Tipo de Habitación" style={styleFormItem}>
            <Select
              showSearch
              name="roomKind"
              placeholder="Seleccione un distrito"
              optionFilterProp="children"
              style={{ width: "200px" }}
              value={formik.values.roomKind}
              onChange={(text) => formik.setFieldValue("roomKind", text)}
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {roomKinds.map((data) => (
                <Select.Option key={data.id} value={data.nombre}>
                  {data.nombre}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {/* <Form.Item label="N° de Camas" style={styleFormItem}>
            <InputNumber
              name="numBeds"
              min={0}
              max={5}
              value={formik.values.numBeds}
              onChange={(value) => formik.setFieldValue("numBeds", value)}
            />
          </Form.Item> */}
          <Form.Item
            label=""
            style={{
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <Button type="primary" htmlType="submit" loading={loadFilter}>
              Buscar Habitación
            </Button>
          </Form.Item>
          <Form.Item
            label=""
            style={{
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <Tooltip title="Limpiar Datos">
              <Button type="ghost" onClick={clearFilter}>
                <ClearOutlined />
              </Button>
            </Tooltip>
          </Form.Item>
        </Form>
      </Card>
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

export default Book;
