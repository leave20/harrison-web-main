import React, { useEffect, useState } from "react";

import { getRoomKinds } from "../services/RoomKindService";
import { findBooksByRangeDate } from "../services/BookService";

import { useFormik } from "formik";
import * as Yup from "yup";

import { Card, Form, DatePicker, Select, Button, Tooltip, message } from "antd";
import { ClearOutlined } from "@ant-design/icons";

import moment from "moment";
import "moment/locale/es";

const { RangePicker } = DatePicker;

const dateFormatList = ["DD-MM-YYYY", "YYYY-MM-DD"];

const styleFormItem = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
};

function RoomFilterForm({ onSetRoomFilter }) {
  moment.locale("es");

  const [roomFiltered, setRoomFiltered] = useState([]);
  const [roomKinds, setRoomKinds] = useState([]);
  const [loadFilter, setLoadFilter] = useState(false);

  const validationSchema = Yup.object().shape({
    dateRange: Yup.array()
      .nullable()
      .required("Fecha de Inicio y Fin requerido."),
  });

  const {
    handleSubmit,
    resetForm,
    values,
    setFieldValue,
    errors,
    touched,
  } = useFormik({
    initialValues: {
      start: "",
      finish: "",
      dateRange: null,
      roomKind: null,
    },
    validationSchema,
    onSubmit: (data) => {
      console.info("FORMIK FILTER DATA:", data);
      setLoadFilter(true);
      findBooksByRangeDate(data)
        .then((resp) => {
          if (values.roomKind === null || values.roomKind === undefined) {
            setRoomFiltered(resp);
          } else {
            setRoomFiltered(
              resp.filter(
                (data) => data.tipoHabitacion.nombre === values.roomKind
              )
            );
          }
          message.success("Habitaciones Filtradas.");
          localStorage.setItem("preDataBook", JSON.stringify(data));
        })
        .catch((resp) => {
          console.info("ERROR:", resp);
        })
        .finally(setLoadFilter(false));
    },
  });

  const clearFilter = () => {
    setRoomFiltered([]);
    resetForm();
  };

  function onChangeRange(date, dateString) {
    setFieldValue("start", dateString[0]);
    setFieldValue("finish", dateString[1]);
    setFieldValue("dateRange", date);
  }

  useEffect(() => {
    getRoomKinds().then(setRoomKinds);
    onSetRoomFilter(roomFiltered);
  }, [roomFiltered, onSetRoomFilter]);

  return (
    <Card>
      <Form layout="inline" onSubmitCapture={handleSubmit}>
        <Form.Item label="Fecha Inicio Y Fin" required style={styleFormItem}>
          <RangePicker
            name="dateRange"
            value={values.dateRange}
            onChange={onChangeRange}
            format={dateFormatList[1]}
          />
          {errors.dateRange && touched.dateRange ? (
            <div className="error-field">{errors.dateRange}</div>
          ) : null}
        </Form.Item>
        <Form.Item label="Tipo de Habitación" style={styleFormItem}>
          <Select
            showSearch
            allowClear
            name="roomKind"
            placeholder="Seleccione una opción"
            optionFilterProp="children"
            style={{ width: "200px" }}
            value={values.roomKind}
            onChange={(text) => setFieldValue("roomKind", text)}
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
  );
}

export default RoomFilterForm;
