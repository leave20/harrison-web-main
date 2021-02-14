import React, { useEffect, useState } from "react";

import RoomCard from "./RoomCard";

import {
  BackTop,
  Tag,
  Button,
  Card,
  Descriptions,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Row,
} from "antd";
import { getRooms } from "../services/RoomService";
import {
  changeBookStatus,
  findBookByCodeBook,
  findBookByIdHabitacion,
} from "../services/BookService";
import BookRegisterForm from "./BookRegisterForm";

import moment from "moment";
import "moment/locale/es";

import * as Yup from "yup";
import { useFormik } from "formik";

function RoomCardList() {
  moment.locale("es");

  const [rooms, setRooms] = useState([]);
  const [bookFormStatus, setBookFormStatus] = useState(false);
  const [registeredBook, setRegisteredBook] = useState(false);
  const [changeeStatusRoom, setChangeStatusRoom] = useState(false);
  const [modalOcupadoVisible, setModalOcupadoVisible] = useState(false);
  const [modalReservadoVisible, setModalReservadoVisible] = useState(false);
  const [book, setBook] = useState({});

  const validationSchema = Yup.object({
    codigo: Yup.string().trim().required("Código Requerido"),
  });

  const reservadoFormik = useFormik({
    initialValues: {
      idHabitacion: "",
      codigo: "",
    },
    validationSchema,
    onSubmit: (data) => {
      findBookByCodeBook(data.codigo, data.idHabitacion)
        .then((resp) => {
          message.success("Código de reserva " + data.codigo + " válido.");
          setBook(parseDataBook(resp));
          console.log(resp);
          changeBookStatus("ACTIVO", resp.id).then();
        })
        .catch(() => {
          message.error("Código de reserva inválido.");
          setBook({});
        });
    },
  });

  const parseDataBook = (data) => {
    data.nombreHabitacion = data.habitacion.nombre;
    data.tipoHabitacion = data.habitacion.tipoHabitacion.nombre;
    data.nombreHuesped = data.huesped.nombre + " " + data.huesped.apellido;
    data.documentoHuesped = data.huesped.documento;
    return data;
  };

  const listRooms = () => {
    getRooms().then((resp) => {
      resp.forEach((data) => {
        data.tipo = data.tipoHabitacion.nombre;
        data.nombreNivel = data.nivel.nombre;
        data.nroCamas = data.tipoHabitacion.nroCamas;
        data.precio = data.tipoHabitacion.precio;
      });
      setRooms(resp);
      console.log("LIST CARDLIST", resp);
    });
  };

  const handleCardRoom = (status, id, precio) => {
    switch (status) {
      case "DISPONIBLE":
        localStorage.setItem(
          "preDataBook",
          JSON.stringify({
            start: moment().format("YYYY-MM-DD"),
            finish: moment().add(1, "days").format("YYYY-MM-DD"),
            roomId: id,
            roomPrice: precio,
          })
        );
        setBookFormStatus(true);
        break;
      case "OCUPADO":
        findBookByIdHabitacion(id).then((resp) => {
          console.log(resp);
          setBook(parseDataBook(resp));
          setModalOcupadoVisible(true);
        });
        break;
      case "MANTENIMIENTO":
        break;
      case "RESERVADO":
        reservadoFormik.setFieldValue("idHabitacion", id);
        setModalReservadoVisible(true);
        break;
      default:
        break;
    }
  };

  const cancelOcupadoModal = () => {
    setModalOcupadoVisible(false);
    setBook({});
  };

  const cancelReseradoModal = () => {
    reservadoFormik.resetForm();
    setModalReservadoVisible(false);
    setBook({});
  };

  useEffect(() => {
    listRooms();
    if (registeredBook) {
      setRegisteredBook(false);
      console.log("LIST CARDLIST IFFF");
    }
    if (changeeStatusRoom) {
      setChangeStatusRoom(false);
    }
  }, [registeredBook, changeeStatusRoom, modalReservadoVisible]);

  return (
    <>
      <BackTop />
      <Card title={<span>Habitaciones</span>} style={{ marginTop: "20px" }}>
        <Row gutter={[10, 10]}>
          {rooms.map((data) => (
            <RoomCard
              key={data.id}
              roomData={data}
              onClick={() => handleCardRoom(data.estado, data.id, data.precio)}
              onSetChangeStatusRoom={setChangeStatusRoom}
            />
          ))}
        </Row>
      </Card>
      <BookRegisterForm
        status={bookFormStatus}
        onSetStatus={setBookFormStatus}
        onSetRegisteredBook={setRegisteredBook}
      />
      <Modal
        title="Datos de la Reserva"
        visible={modalOcupadoVisible}
        onOk={cancelOcupadoModal}
        onCancel={cancelOcupadoModal}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <Descriptions column={2} layout="vertical">
          <Descriptions.Item span={2} label="Fecha Inicio">
            {moment(book.fechaInicio).format("dddd, D MMMM [del] YYYY")}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Fecha Final">
            {moment(book.fechaFinal).format("dddd, D MMMM [del] YYYY")}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Huésped">
            ({book.documentoHuesped}) {book.nombreHuesped}
          </Descriptions.Item>
          <Descriptions.Item label="Habitación">
            ({book.nombreHabitacion}) {book.tipoHabitacion}
          </Descriptions.Item>
          <Descriptions.Item label="Precio">
            <Tag color="#f50">S/{book.precioTotal}</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Modal>
      <Modal
        title="Reserva"
        visible={modalReservadoVisible}
        onOk={cancelReseradoModal}
        onCancel={cancelReseradoModal}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <Form layout="inline" onSubmitCapture={reservadoFormik.handleSubmit}>
          <Form.Item label="Código de Reserva:" required>
            <Input
              name="codigo"
              value={reservadoFormik.values.codigo}
              onChange={reservadoFormik.handleChange}
            />
            {reservadoFormik.errors.codigo && reservadoFormik.touched.codigo ? (
              <div className="error-field">{reservadoFormik.errors.codigo}</div>
            ) : null}
          </Form.Item>
          <Form.Item label="">
            <Button type="primary" htmlType="submit">
              Validar
            </Button>
          </Form.Item>
        </Form>
        {JSON.stringify(book) === "{}" ? null : (
          <>
            <Divider>Datos de la Reserva</Divider>
            <Descriptions column={2} layout="vertical">
              <Descriptions.Item span={2} label="Fecha Inicio">
                {moment(book.fechaInicio).format("dddd, D MMMM [del] YYYY")}
              </Descriptions.Item>
              <Descriptions.Item span={2} label="Fecha Final">
                {moment(book.fechaFinal).format("dddd, D MMMM [del] YYYY")}
              </Descriptions.Item>
              <Descriptions.Item span={2} label="Huésped">
                ({book.documentoHuesped}) {book.nombreHuesped}
              </Descriptions.Item>
              <Descriptions.Item label="Habitación">
                ({book.nombreHabitacion}) {book.tipoHabitacion}
              </Descriptions.Item>
              <Descriptions.Item label="Precio">
                <Tag color="#f50">S/{book.precioTotal}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </>
  );
}

export default RoomCardList;
