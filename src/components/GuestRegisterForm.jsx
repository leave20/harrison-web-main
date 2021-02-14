import React, { useEffect, useState } from "react";

import { useFormik } from "formik";
import * as Yup from "yup";

import { createGuest, updateGuest } from "../services/GuestService";

import { Button, Col, Drawer, Form, Input, message, Row, Select } from "antd";
import { getDocumentsType } from "../services/DocumentType";

const GuestRegisterForm = ({ status, onSetStatus, onSetGuestRegistered }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [typesDocument, setTypesDocument] = useState([]);

  const validationSchema = Yup.object().shape({
    nombre: Yup.string()
      .trim()
      .matches(/^[ñÑa-zA-ZáéíóúÁÉÍÓÚ ]*$/, "Solo se admiten letras.")
      .required("Nombre requerido."),
    apellido: Yup.string()
      .trim()
      .matches(/^[ñÑa-zA-ZáéíóúÁÉÍÓÚ ]*$/, "Solo se admiten letras.")
      .required("Apellido requerido."),
    documento: Yup.string().trim().required("Documento requerido."),
    correo: Yup.string().trim().email("Formato no válido."),
    telefono: Yup.string()
      .trim()
      .matches(/^[0-9]*$/, "Solo se admiten números.")
      .length(9, "Solo se admiten 9 dígitos."),
    tipoHuesped: Yup.object().shape({
      id: Yup.number().nullable().required("Tipo Huésped requerido"),
    }),
    tipoDocumento: Yup.object().shape({
      id: Yup.number().nullable().required("Tipo Documento requerido"),
    }),
  });

  const {
    handleSubmit,
    handleChange,
    values,
    setFieldValue,
    resetForm,
    touched,
    errors,
  } = useFormik({
    initialValues: {
      id: null,
      nombre: "",
      apellido: "",
      documento: "",
      correo: "",
      telefono: "",
      tipoDocumento: {
        id: null,
      },
      tipoHuesped: {
        id: 1,
      },
    },
    validationSchema,
    onSubmit: (value) => {
      console.log(value);
      if (values.id === null) {
        createGuest(value)
          .then((resp) => {
            message.success("Huésped creado correctamente.");
            console.log(resp);
            onSetGuestRegistered(true);
            closeDrawer();
          })
          .catch(console.warn)
          .finally(resetForm());
      } else {
        updateGuest(value, values.id)
          .then((resp) => {
            message.success("Huésped actualizado correctamente.");
            console.log(resp);
          })
          .catch(console.warn)
          .finally(resetForm());
      }
    },
  });

  const closeDrawer = () => {
    setDrawerVisible(false);
    onSetStatus(false);
  };

  useEffect(() => {
    getDocumentsType().then(setTypesDocument);
    setDrawerVisible(status);
  }, [status]);

  return (
    <Drawer
      title="Huésped"
      placement="right"
      closable={false}
      onClose={closeDrawer}
      visible={drawerVisible}
      width={350}
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
            style={{ width: "230px" }}
          >
            Registrar Huésped
          </Button>
        </div>
      }
    >
      <Form layout="vertical" onSubmitCapture={handleSubmit}>
        <Form.Item label="Nombre" required>
          <Input
            type="text"
            name="nombre"
            value={values.nombre}
            onChange={handleChange}
          />
          {errors.nombre && touched.nombre ? (
            <div className="error-field">{errors.nombre}</div>
          ) : null}
        </Form.Item>
        <Form.Item label="Apellido" required>
          <Input
            type="text"
            name="apellido"
            value={values.apellido}
            onChange={handleChange}
          />
          {errors.apellido && touched.apellido ? (
            <div className="error-field">{errors.apellido}</div>
          ) : null}
        </Form.Item>
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item label="Tipo Documento" required>
              <Select
                name="tipoDocumento.id"
                placeholder="Seleccione un Tipo de documento"
                style={{ width: "100%" }}
                value={values.tipoDocumento.id}
                onChange={(text) => setFieldValue("tipoDocumento.id", text)}
              >
                {typesDocument.map((data) => (
                  <Select.Option key={data.id} value={data.id}>
                    {data.nombre}
                  </Select.Option>
                ))}
              </Select>
              {errors.tipoDocumento && touched.tipoDocumento ? (
                <div className="error-field">{errors.tipoDocumento.id}</div>
              ) : null}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Documento" required>
              <Input
                type="text"
                name="documento"
                value={values.documento}
                onChange={handleChange}
              />
              {errors.documento && touched.documento ? (
                <div className="error-field">{errors.documento}</div>
              ) : null}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Correo">
          <Input
            type="text"
            name="correo"
            value={values.correo}
            onChange={handleChange}
          />
          {errors.correo && touched.correo ? (
            <div className="error-field">{errors.correo}</div>
          ) : null}
        </Form.Item>
        <Form.Item label="Télefono">
          <Input
            type="text"
            name="telefono"
            value={values.telefono}
            onChange={handleChange}
          />
          {errors.telefono && touched.telefono ? (
            <div className="error-field">{errors.telefono}</div>
          ) : null}
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default GuestRegisterForm;
