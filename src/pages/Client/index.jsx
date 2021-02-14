import { EditOutlined } from "@ant-design/icons";
import {
  Form,
  Button,
  Drawer,
  Input,
  PageHeader,
  Table,
  Row,
  Col,
  message,
  Popconfirm,
  Tag,
  Select,
} from "antd";
import React, { useEffect, useState } from "react";

import { useFormik } from "formik";
import * as Yup from "yup";
import {
  changeStatusGuest,
  createGuest,
  getGuestById,
  getGuests,
  updateGuest,
} from "../../services/GuestService";
import { getDocumentsType } from "../../services/DocumentType";
let key = "load";

const Client = () => {
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [filterTable, setFilterTable] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [typesDocuments, setTypesDocuments] = useState([]);

  const listGuests = () => {
    getGuests().then((resp) => {
      resp.forEach((data) => {
        data.key = data.id;
      });
      setDataSource(resp);
      setLoading(false);
    });
  };

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
    tipoDocumento: Yup.object().shape({
      id: Yup.number().nullable().required("Tipo Documento requerido"),
    }),
  });

  const formik = useFormik({
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
    },
    validationSchema,
    onSubmit: (value) => {
      console.log(value);
      if (formik.values.id === null) {
        createGuest(value)
          .then((resp) => {
            message.success("Creado correctamente.");
            console.log(resp);
            listGuests();
          })
          .catch(console.warn)
          .finally(formik.resetForm());
      } else {
        updateGuest(value, formik.values.id)
          .then((resp) => {
            message.success("Actualizado correctamente.");
            console.log(resp);
            listGuests();
          })
          .catch(console.warn)
          .finally(formik.resetForm());
      }
      listGuests();
    },
  });

  const closeDrawer = () => {
    formik.resetForm();
    setDrawerVisible(false);
  };

  const edit = (id) => {
    getGuestById(id).then((resp) => {
      console.log(resp);
      formik.setValues(resp);
      setDrawerVisible(true);
    });
  };

  const setInactive = (id) => {
    message.loading({ content: "Cargando...", key });
    changeStatusGuest(id)
      .then(() => {
        message.success({
          content: "Huésped desactivado correctamente.",
          key,
        });
        listGuests();
      })
      .catch(() => {
        message.warning({
          content: "Ocurrío un error al procesar.",
          key,
        });
      });
  };

  const setActive = (id) => {
    message.loading({ content: "Cargando...", key });
    changeStatusGuest(id)
      .then(() => {
        message.success({
          content: "Huésped activado correctamente.",
          key,
        });
        listGuests();
      })
      .catch(() => {
        message.warning({
          content: "Ocurrío un error al procesar.",
          key: "load",
        });
      });
  };

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: 50,
      fixed: "left",
      align: "center",
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      align: "center",
      width: 200,
    },
    {
      title: "Apellido",
      dataIndex: "apellido",
      key: "apellido",
      align: "center",
      width: 200,
    },
    {
      title: "Documento",
      dataIndex: "documento",
      key: "apellido",
      align: "center",
      width: 120,
    },
    {
      title: "Correo",
      dataIndex: "correo",
      key: "correo",
      align: "center",
      width: 200,
    },
    {
      title: "Estado",
      dataIndex: "status",
      width: 100,
      render: (val, record) =>
        record.estado ? (
          <Popconfirm
            title="¿Seguro que desea desactivar este Huésped?"
            onConfirm={() => setInactive(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Tag className="cursor-pointer" color="green">
              ACTIVO
            </Tag>
          </Popconfirm>
        ) : (
          <Popconfirm
            title="¿Seguro que desea activar este Huésped?"
            onConfirm={() => setActive(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Tag className="cursor-pointer" color="red">
              INACTIVO
            </Tag>
          </Popconfirm>
        ),
      filters: [
        {
          text: "Activo",
          value: "true",
        },
        {
          text: "Inactivo",
          value: "false",
        },
      ],
      filterMultiple: false,
      onFilter: (value, record) => {
        let status = String(record.estado);
        return status.indexOf(value) === 0;
      },
    },
    {
      title: "Acciones",
      key: "action",
      fixed: "right",
      width: 100,
      align: "center",
      render: (val, record) => (
        <>
          <Button type="link" size="small" onClick={() => edit(record.id)}>
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
    listGuests();
    getDocumentsType().then(setTypesDocuments);
  }, []);

  return (
    <div>
      <Drawer
        title="Huésped"
        placement="right"
        closable={false}
        onClose={closeDrawer}
        visible={drawerVisible}
        width={400}
      >
        <Form layout="vertical" onSubmitCapture={formik.handleSubmit}>
          <Form.Item label="Nombre" required>
            <Input
              type="text"
              name="nombre"
              value={formik.values.nombre}
              onChange={formik.handleChange}
            />
            {formik.errors.nombre && formik.touched.nombre ? (
              <div className="error-field">{formik.errors.nombre}</div>
            ) : null}
          </Form.Item>
          <Form.Item label="Apellido" required>
            <Input
              type="text"
              name="apellido"
              value={formik.values.apellido}
              onChange={formik.handleChange}
            />
            {formik.errors.apellido && formik.touched.apellido ? (
              <div className="error-field">{formik.errors.apellido}</div>
            ) : null}
          </Form.Item>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item label="Tipo Documento" required>
                <Select
                  name="tipoDocumento.id"
                  placeholder="Seleccione un Tipo de documento"
                  style={{ width: "100%" }}
                  value={formik.values.tipoDocumento.id}
                  onChange={(text) =>
                    formik.setFieldValue("tipoDocumento.id", text)
                  }
                >
                  {typesDocuments.map((data) => (
                    <Select.Option key={data.id} value={data.id}>
                      {data.nombre}
                    </Select.Option>
                  ))}
                </Select>
                {formik.errors.tipoDocumento && formik.touched.tipoDocumento ? (
                  <div className="error-field">
                    {formik.errors.tipoDocumento.id}
                  </div>
                ) : null}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Documento" required>
                <Input
                  type="text"
                  name="documento"
                  value={formik.values.documento}
                  onChange={formik.handleChange}
                />
                {formik.errors.documento && formik.touched.documento ? (
                  <div className="error-field">{formik.errors.documento}</div>
                ) : null}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Correo">
            <Input
              type="text"
              name="correo"
              value={formik.values.correo}
              onChange={formik.handleChange}
            />
            {formik.errors.correo && formik.touched.correo ? (
              <div className="error-field">{formik.errors.correo}</div>
            ) : null}
          </Form.Item>
          <Form.Item label="Télefono">
            <Input
              type="text"
              name="telefono"
              value={formik.values.telefono}
              onChange={formik.handleChange}
            />
            {formik.errors.telefono && formik.touched.telefono ? (
              <div className="error-field">{formik.errors.telefono}</div>
            ) : null}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Guardar
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
      <PageHeader
        className="site-page-header"
        title="Huésped"
        subTitle="Mantimiento de los Huespedes."
        extra={
          <Button type="primary" onClick={() => setDrawerVisible(true)}>
            Añadir Huésped
          </Button>
        }
      />
      <Input.Search
        className="searchInput"
        placeholder="Buscar por nombre, apellido, correo, documento ..."
        onKeyUpCapture={(e) => keyUpTable(e.target.value)}
        style={{ marginBottom: "20px" }}
      />
      <Table
        loading={loading}
        dataSource={filterTable === null ? dataSource : filterTable}
        columns={columns}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 800 }}
      />
    </div>
  );
};

export default Client;
