import { EditOutlined } from "@ant-design/icons";
import {
  Form,
  Button,
  Drawer,
  Input,
  PageHeader,
  Table,
  InputNumber,
  Row,
  Col,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../../services/ProductService";

import { useFormik } from "formik";
import * as Yup from "yup";

const Product = () => {
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [filterTable, setFilterTable] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const listProducts = () => {
    getProducts().then((resp) => {
      resp.forEach((data) => {
        data.key = data.id;
      });
      resp.key = resp.id;
      setDataSource(resp);
      setLoading(false);
    });
  };

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().trim().required("Nombre requerido."),
    precio: Yup.string().trim().nullable().required("Precio requerido."),
    stock: Yup.string().trim().nullable().required("Stock requerido."),
  });

  const formik = useFormik({
    initialValues: {
      id: null,
      nombre: "",
      precio: null,
      stock: null,
    },
    validationSchema,
    onSubmit: (value) => {
      console.log(value);
      if (formik.values.id === null) {
        createProduct(value)
          .then((resp) => {
            message.success("Creado correctamente.");
            console.log(resp);
            listProducts();
          })
          .catch(console.warn)
          .finally(formik.resetForm());
      } else {
        updateProduct(value, formik.values.id)
          .then((resp) => {
            message.success("Actualizado correctamente.");
            console.log(resp);
            listProducts();
          })
          .catch(console.warn)
          .finally(formik.resetForm());
      }
      listProducts();
    },
  });

  const closeDrawer = () => {
    formik.resetForm();
    setDrawerVisible(false);
  };

  const edit = (id) => {
    getProductById(id).then((resp) => {
      console.log(resp);
      formik.setValues(resp);
      setDrawerVisible(true);
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
      title: "Precio",
      dataIndex: "precio",
      key: "precio",
      align: "center",
      width: 60,
      render: (val, record) => <span>S/{record.precio}</span>,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      align: "center",
      width: 60,
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
    listProducts();
  }, []);

  return (
    <div>
      <Drawer
        title="Producto"
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
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item label="Precio" required>
                <InputNumber
                  name="precio"
                  min={0.5}
                  value={formik.values.precio}
                  onChange={(value) => formik.setFieldValue("precio", value)}
                  style={{ width: "100%" }}
                />
                {formik.errors.precio && formik.touched.precio ? (
                  <div className="error-field">{formik.errors.precio}</div>
                ) : null}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Stock" required>
                <InputNumber
                  name="stock"
                  min={1}
                  max={100}
                  value={formik.values.stock}
                  onChange={(value) => formik.setFieldValue("stock", value)}
                  style={{ width: "100%" }}
                />
                {formik.errors.stock && formik.touched.stock ? (
                  <div className="error-field">{formik.errors.stock}</div>
                ) : null}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Guardar
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
      <PageHeader
        className="site-page-header"
        title="Producto"
        subTitle="Mantimiento de los Productos."
        extra={
          <Button type="primary" onClick={() => setDrawerVisible(true)}>
            Añadir Producto
          </Button>
        }
      />
      <Input.Search
        className="searchInput"
        placeholder="Buscar por nombre..."
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

export default Product;
