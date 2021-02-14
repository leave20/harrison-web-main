import React, { useEffect, useState } from "react";

import { useFormik } from "formik";
import * as Yup from "yup";

import {
  Alert,
  Button,
  Checkbox,
  Col,
  Descriptions,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Tooltip,
} from "antd";

import moment from "moment";
import "moment/locale/es";

import GuestRegisterForm from "./GuestRegisterForm";

import { getRooms } from "../services/RoomService";
import { getGuests } from "../services/GuestService";
import { PlusOutlined } from "@ant-design/icons";
import { changeBookStatus, createBook } from "../services/BookService";

const BookRegisterForm = ({
  status,
  onSetStatus,
  onSetRegisteredBook = null,
}) => {
  moment.locale("es");

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  const [disabledPlaca, setDisabledPlaca] = useState(true);
  const [drawerGuestStatus, setDrawerGuestStatus] = useState(false);
  const [guestRegistered, setGuestRegistered] = useState(false);

  const validationSchema = Yup.object({
    pagoAdelantado: Yup.number().nullable().required("Pago requerido"),
    huesped: Yup.object().shape({
      id: Yup.number().nullable().required("Huésped requerido"),
    }),
  });

  const {
    handleSubmit,
    handleChange,
    values,
    setFieldValue,
    resetForm,
    errors,
    touched,
  } = useFormik({
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
    validationSchema,
    onSubmit: (data) => {
      console.log("DATA FORMIK", data);
      createBook(data)
        .then((resp) => {
          message.success("Reserva registrada correctamente.");
          console.info("RESP", resp);
          if (
            values.fechaInicio.substring(0, 10) ===
              moment().format("YYYY-MM-DD") &&
            values.fechaFinal.substring(0, 10) ===
              moment().add(1, "days").format("YYYY-MM-DD")
          ) {
            console.log("change estado activo reserva");
            // setTimeout(() => {
              changeBookStatus("ACTIVO", resp.id);
            // }, 5000);
          }
          if (onSetRegisteredBook !== null) {
            onSetRegisteredBook(true);
          }
        })
        .catch((err) => {
          message.error("Ocurrio un problema al registrar.");
          console.info("ERROR", err);
        })
        .finally(() => {
          closeDrawer();
        });
    },
  });

  const closeDrawer = () => {
    setDrawerVisible(false);
    onSetStatus(false);
    resetForm();
  };

  const calcPrecioTotal = (start, finish, roomPrice) => {
    const dias = moment(finish).diff(moment(start), "days");
    return dias * roomPrice;
  };

  const initPreDataBook = () => {
    if (localStorage.getItem("preDataBook") !== null) {
      let preData = JSON.parse(localStorage.getItem("preDataBook"));
      setFieldValue("fechaInicio", preData.start + "T06:58:03.747Z");
      setFieldValue("fechaFinal", preData.finish + "T06:58:03.747Z");
      setFieldValue(
        "precioTotal",
        calcPrecioTotal(preData.start, preData.finish, preData.roomPrice)
      );
      setFieldValue("habitacion.id", preData.roomId);
    }
  };

  const placaStatus = (status) => {
    if (!status) {
      setFieldValue("placaVehiculo", "");
    }
    setDisabledPlaca(!status);
  };

  useEffect(() => {
    if (guestRegistered) {
      setGuestRegistered(false);
    }
    getRooms().then((resp) => {
      resp.forEach((data) => {
        data.tipo = data.tipoHabitacion.nombre;
      });
      setRooms(resp);
    });
    getGuests().then((resp) => {
      setGuests(resp);
    });
    setDrawerVisible(status);
    initPreDataBook(); // eslint-disable-next-line
  }, [status, guestRegistered]);

  return (
    <Drawer
      title="Reserva"
      placement="right"
      closable={false}
      onClose={closeDrawer}
      visible={drawerVisible}
      width={400}
      style={{ paddingBottom: "0" }}
      footer={
        <div
          style={{
            textAlign: "right",
          }}
        >
          <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
            Cancelar
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            onClick={handleSubmit}
            style={{ width: "280px" }}
          >
            Registrar Reserva
          </Button>
        </div>
      }
    >
      <Alert
        banner
        showIcon={false}
        type="info"
        description={
          <Descriptions layout="vertical" column={1}>
            <Descriptions.Item label="Fecha Inicio">
              {moment(values.fechaInicio).format("dddd, D MMMM [del] YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Fecha Final">
              {moment(values.fechaFinal).format("dddd, D MMMM [del] YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Precio Total">
              S/{values.precioTotal}
            </Descriptions.Item>
          </Descriptions>
        }
        style={{ paddingBottom: "5px", marginBottom: "15px" }}
      />
      <Form layout="vertical" onSubmitCapture={handleSubmit}>
        <Form.Item label="Habitación" required>
          <Select
            showSearch
            name="habitacion.id"
            placeholder="Seleccione una Habitación"
            optionFilterProp="children"
            style={{ width: "100%" }}
            value={values.habitacion.id}
            disabled
            onChange={(text) => setFieldValue("habitacion.id", text)}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {rooms.map((data) => (
              <Select.Option key={data.id} value={data.id}>
                {String(`(${data.nombre}) ${data.tipo}`)}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Row gutter={10}>
          <Col span={20}>
            <Form.Item label="Huésped" required>
              <Select
                showSearch
                name="huesped.id"
                placeholder="Seleccione un huésped"
                optionFilterProp="children"
                style={{ width: "100%" }}
                value={values.huesped.id}
                onChange={(text) => setFieldValue("huesped.id", text)}
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
              {errors.huesped && touched.huesped ? (
                <div className="error-field">{errors.huesped.id}</div>
              ) : null}
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label=" ">
              <Tooltip title="Añadir Huésped" placement="left">
                <Button type="ghost" onClick={() => setDrawerGuestStatus(true)}>
                  <PlusOutlined />
                </Button>
              </Tooltip>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={20}>
          <Col span={12}>
            <Form.Item label="¿Estacionamiento?">
              <Checkbox onChange={(e) => placaStatus(e.target.checked)}>
                {disabledPlaca === true ? "NO" : "SI"}
              </Checkbox>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Placa de Vehículo">
              <Input
                name="placaVehiculo"
                value={values.placaVehiculo}
                onChange={handleChange}
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
                max={values.precioTotal}
                value={values.pagoAdelantado}
                onChange={(value) => setFieldValue("pagoAdelantado", value)}
                style={{ width: "100%" }}
                placeholder="S/ 0.00"
              />
              {errors.pagoAdelantado && touched.pagoAdelantado ? (
                <div className="error-field">{errors.pagoAdelantado}</div>
              ) : null}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Saldo a Deber">
              <Input
                value={values.precioTotal - values.pagoAdelantado}
                placeholder="S/ 0.00"
                readOnly
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <GuestRegisterForm
        status={drawerGuestStatus}
        onSetStatus={setDrawerGuestStatus}
        onSetGuestRegistered={setGuestRegistered}
      />
    </Drawer>
  );
};

export default BookRegisterForm;
