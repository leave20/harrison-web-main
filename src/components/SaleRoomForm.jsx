import { DeleteFilled } from "@ant-design/icons";
import {
  Alert,
  Button,
  Col,
  Descriptions,
  Drawer,
  Form,
  Input,
  message,
  Row,
  Select,
} from "antd";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { getBookById } from "../services/BookService";
import { getProducts } from "../services/ProductService";

import * as Yup from "yup";
import { createConsumo } from "../services/ConsumoService";

function SaleRoomForm({ status, setStatus, bookId }) {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [book, setBook] = useState({});
  const [products, setProducts] = useState([]);
  const [consumos, setConsumos] = useState([]);
  const [totalConsumo, setTotalConsumo] = useState(0);
  const [subTotalProducto, setSubTotalProducto] = useState(0);

  const validationProduct = Yup.object({});

  const productFormik = useFormik({
    initialValues: {
      producto: {
        id: null,
      },
      productoId: null,
      nombre: "",
      precio: 0,
      cantidad: null,
      total: 0,
      reserva: {
        id: null,
      },
    },
    validationSchema: validationProduct,
    onSubmit: (data) => {
      console.log(data);
      if (consumos.length === 0) {
        setConsumos([data]);
      } else setConsumos([...consumos, data]);
      setTotalConsumo(totalConsumo + data.total);
      productFormik.setFieldValue("cantidad", 0);
      setSubTotalProducto(0);
      console.log(consumos);
    },
  });

  const deleteProduct = (idx) => {
    setConsumos(consumos.filter((data, index) => index !== idx));
    let total = 0;
    consumos
      .filter((data, index) => index !== idx)
      .forEach((data) => {
        total += data.total;
        console.log(data.total);
      });
    setTotalConsumo(total);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setStatus(false);
    productFormik.resetForm();
  };

  const getBook = () => {
    getBookById(bookId).then((resp) => {
      resp.nombreHuesped = `${resp.huesped.nombre.toUpperCase()} ${resp.huesped.apellido.toUpperCase()}`;
      resp.nombreHabitacion = `${resp.habitacion.nombre} ${resp.habitacion.tipoHabitacion.nombre}`;
      setBook(resp);
    });
  };

  const changeProduct = (e) => {
    let values = String(e).split("-");
    productFormik.setFieldValue("producto.id", Number(values[0]));
    productFormik.setFieldValue("nombre", values[1]);
    productFormik.setFieldValue("precio", Number(values[2]));
    productFormik.setFieldValue("productoId", e);
    productFormik.setFieldValue("cantidad", 0);
    setSubTotalProducto(0);
  };

  const changeCantidad = (e) => {
    let cantidad = Number(e.target.value);
    productFormik.setFieldValue("cantidad", cantidad);
    let total = cantidad * productFormik.values.precio;
    setSubTotalProducto(total);
    productFormik.setFieldValue("total", total);
  };

  const handleSubmitSale = () => {
    let consumo;
    consumos.forEach((data) => {
      consumo = {
        cantidad: data.cantidad,
        total: data.total,
        producto: { id: data.producto.id },
        reserva: { id: data.reserva.id },
      };
      createConsumo(consumo).then((resp) => {
        console.log("CONSUMO CREADO", resp);
      });
    });
    productFormik.resetForm();
    message.success("Venta(s) registradas correctamente.");
    closeDrawer();
  };

  useEffect(() => {
    setConsumos([]);
    setTotalConsumo(0);
    setSubTotalProducto(0);
    setDrawerVisible(status);
    getProducts().then(setProducts);
    productFormik.setFieldValue("reserva.id", bookId);
    getBook(); // eslint-disable-next-line
  }, [status]);

  return (
    <Drawer
      title="Venta"
      placement="right"
      closable={false}
      onClose={closeDrawer}
      visible={drawerVisible}
      width={600}
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
            onClick={handleSubmitSale}
            style={{ width: "280px" }}
          >
            Registrar Venta
          </Button>
        </div>
      }
    >
      <Alert
        type="info"
        description={
          <Descriptions column={1} layout="vertical">
            <Descriptions.Item label="Huésped">
              {book.nombreHuesped}
            </Descriptions.Item>
            <Descriptions.Item
              label="Habitación"
              style={{ paddingBottom: "2px" }}
            >
              {book.nombreHabitacion}
            </Descriptions.Item>
          </Descriptions>
        }
      />
      <Form
        layout="vertical"
        style={{ margin: "20px 0 0" }}
        onSubmitCapture={productFormik.handleSubmit}
      >
        <Row gutter={12}>
          <Col span={16}>
            <Form.Item label="Producto" required>
              <Select
                showSearch
                placeholder="Seleccione un producto"
                optionFilterProp="children"
                name="productoId"
                value={productFormik.values.productoId}
                style={{ width: "100%" }}
                onChange={changeProduct}
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {products.map((data) => (
                  <Select.Option
                    key={data.id}
                    value={`${data.id}-${data.nombre}-${data.precio}`}
                  >
                    {String(`S/${data.precio} - ${data.nombre}`)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Cantidad" required>
              <Input
                type="number"
                name="cantidad"
                value={productFormik.values.cantidad}
                onChange={changeCantidad}
                min={1}
                max={10}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={16}>
            <Form.Item>
              <Alert
                style={{ padding: "5px 15px" }}
                message={
                  <span>
                    <b>Subtotal: </b> S/ {subTotalProducto}
                  </span>
                }
                type="success"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Añadir Producto
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <table className="table-prod">
        <thead>
          <tr>
            <th>#</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {consumos.map((data, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>
                (S/{data.precio}){" "}
                {String(data.nombre).length > 15
                  ? `${String(data.nombre).substring(0, 15)} ...`
                  : data.nombre}
              </td>
              <td>{data.cantidad}</td>
              <td>S/{data.total}</td>
              <td>
                <Button size="small" danger onClick={() => deleteProduct(idx)}>
                  <DeleteFilled />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Alert
        style={{
          padding: "5px 25px",
          textAlign: "right",
          margin: "5px 0 10px",
        }}
        message={
          <span>
            <b>Total: S/ {totalConsumo}</b>
          </span>
        }
        type="success"
      />
    </Drawer>
  );
}

export default SaleRoomForm;
