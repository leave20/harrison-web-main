import {
  Alert,
  Button,
  Descriptions,
  Drawer,
  Input,
  PageHeader,
  Table,
  Tag,
  Form,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  getBooks,
  getBookById,
  changeBookStatus,
} from "../../services/BookService";

import moment from "moment";
import "moment/locale/es";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  createFactura,
  generatePdfFactura,
} from "../../services/FacturaService";
import { getConsumosByReservaId } from "../../services/ConsumoService";

const CheckOut = () => {
  moment.locale("es");

  const [loading, setLoading] = useState(true);
  const [filterTable, setFilterTable] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [book, setBook] = useState({});
  const [consumo, setConsumo] = useState([]);
  const [totalConsumo, setTotalConsumo] = useState(0);
  const [totalNeto, setTotalNeto] = useState(0);

  const listRooms = () => {
    getBooks()
      .then((resp) => {
        resp.forEach((data) => {
          data.key = data.id;
          data.nombreHuesped = data.huesped.nombre;
          data.documentoHuesped = data.huesped.documento;
          data.nombreHabitacion = data.habitacion.nombre;
          data.rangoFecha =
            moment(data.fechaInicio).format("dddd, D MMMM [del] YYYY") +
            " - " +
            moment(data.fechaFinal).format("dddd, D MMMM [del] YYYY");
        });
        const filterStatus = resp.filter((data) => data.estado === "ACTIVO");
        setDataSource(filterStatus);
        console.log(resp);
        console.log("FILTER", filterStatus);
        setLoading(false);
      })
      .catch(() => {});
  };

  const validationSchema = Yup.object({});

  const { handleSubmit, setFieldValue, values, resetForm } = useFormik({
    initialValues: {
      ruc: "15216477891",
      razonSocial: "HOTEL HARRISON",
      lateCheckOut: null,
      estado: "PENDIENTE",
      reserva: {
        id: null,
      },
      caja: {
        id: 1,
      },
    },
    validationSchema,
    onSubmit: (data) => {
      console.log(data);
      generatePdfFactura(data.reserva.id);
      createFactura(data).then((resp) => {
        console.log("RESP", resp);
        changeBookStatus("FINALIZADO", values.reserva.id).then(console.log);
        message.success("Hospedaje finalizado.");
        generatePdfFactura(data.reserva.id);
        listRooms();
      });
      resetForm();
      setDrawerVisible(false);
    },
  });

  const closeDrawer = () => {
    setTotalConsumo(0);
    setTotalNeto(0);
    setConsumo([]);
    setBook({});
    setDrawerVisible(false);
  };

  const openDrawer = (id) => {
    getBookById(id).then((resp1) => {
      resp1.nombreHabitacion = resp1.habitacion.nombre;
      resp1.nombreTipoHabitacion = resp1.habitacion.tipoHabitacion.nombre;
      resp1.nombreHuesped = resp1.huesped.nombre;
      resp1.documentoHuesped = resp1.huesped.documento;
      setBook(resp1);

      getConsumosByReservaId(id)
        .then((resp) => {
          let totalNeto = 0;
          resp.forEach((data) => {
            console.log(data);
            data.nombreProducto = data.producto.nombre;
            data.precioProducto = data.producto.precio;
            totalNeto += data.total;
          });
          setConsumo(resp);
          setTotalConsumo(totalNeto);
          let debeReserva =
            Number(resp1.precioTotal) - Number(resp1.pagoAdelantado);
          setTotalNeto(debeReserva + Number(totalNeto));
        })
        .catch(() => {
          let debeReserva =
            Number(resp1.precioTotal) - Number(resp1.pagoAdelantado);
          setTotalNeto(debeReserva);
        });
    });
    setFieldValue("reserva.id", id);
    setDrawerVisible(true);
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
      title: "Huésped",
      dataIndex: "nombreHuesped",
      key: "nombreHuesped",
      align: "center",
      width: 250,
    },
    {
      title: "Documento",
      dataIndex: "documentoHuesped",
      key: "documentoHuesped",
      align: "center",
      width: 150,
    },
    {
      title: "Habitación",
      dataIndex: "nombreHabitacion",
      key: "nombreHabitacion",
      align: "center",
      width: 150,
    },
    {
      title: "Fecha",
      dataIndex: "rangoFecha",
      key: "rangoFecha",
      align: "center",
      width: 250,
    },
    {
      title: "Precio Total",
      dataIndex: "precioTotal",
      key: "precioTotal",
      align: "center",
      width: 150,
      render: (val, record) => <span>S/{record.precioTotal}.00</span>,
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      align: "center",
      render: (val, record) => {
        switch (record.estado) {
          case "PENDIENTE":
            return <Tag color="volcano">{record.estado}</Tag>;
          case "ACTIVO":
            return <Tag color="green">{record.estado}</Tag>;
          case "FINALIZADO":
            return <Tag color="blue">{record.estado}</Tag>;
          default:
            <Tag color="gold">NO DEFINIDO</Tag>;
            break;
        }
      },
      filters: [
        {
          text: "PENDIENTE",
          value: "PENDIENTE",
        },
        {
          text: "ACTIVO",
          value: "ACTIVO",
        },
        {
          text: "FINALIZADO",
          value: "FINALIZADO",
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
      render: (values, record) => (
        <>
          <Button
            type="primary"
            size="small"
            onClick={() => openDrawer(record.id)}
          >
            Finalizar
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
    listRooms();
  }, [drawerVisible]);

  return (
    <div>
      <Drawer
        visible={drawerVisible}
        title="Finalizar Reserva"
        width={550}
        placement="right"
        closable={false}
        onClose={closeDrawer}
      >
        <Alert
          type="info"
          banner
          showIcon={false}
          style={{ paddingBottom: "2px", marginBottom: "20px" }}
          description={
            <>
              <Descriptions layout="vertical">
                <Descriptions.Item label="Fecha Inicio">
                  {book.fechaInicio}
                </Descriptions.Item>
                <Descriptions.Item label="Fecha Final">
                  {book.fechaFinal}
                </Descriptions.Item>
                <Descriptions.Item label=""></Descriptions.Item>
                <Descriptions.Item label="Habitación">
                  {book.nombreHabitacion +
                    " (" +
                    book.nombreTipoHabitacion +
                    ")"}
                </Descriptions.Item>
                <Descriptions.Item label="Huesped">
                  {book.nombreHuesped + " (" + book.documentoHuesped + ")"}
                </Descriptions.Item>
                <Descriptions.Item label="Estacionamiento/Placa">
                  {book.placaVehiculo === null
                    ? "NO REGISTRADO"
                    : book.placaVehiculo}
                </Descriptions.Item>
                <Descriptions.Item label="Precio Total">
                  {book.precioTotal}
                </Descriptions.Item>
                <Descriptions.Item label="Pago Adelantado">
                  {book.pagoAdelantado}
                </Descriptions.Item>
                <Descriptions.Item label="Pago Restante">
                  {book.precioTotal - book.pagoAdelantado}
                </Descriptions.Item>
              </Descriptions>
              <table
                className="table-prod"
                style={{ marginTop: "10px", marginBottom: "10px" }}
              >
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {consumo.length !== 0
                    ? consumo.map((data, idx) => (
                        <tr key={data.id}>
                          {}
                          <td>{idx + 1}</td>
                          <td>
                            (S/{data.precioProducto}){" "}
                            {String(data.nombreProducto).length > 15
                              ? `${String(data.nombreProducto).substring(
                                  0,
                                  15
                                )} ...`
                              : data.nombreProducto}
                          </td>
                          <td>{data.cantidad}</td>
                          <td>S/{data.total}</td>
                        </tr>
                      ))
                    : null}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" align="right">
                      Total: S/{totalConsumo}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </>
          }
        />
        <Alert
          message={<b>TOTAL A PAGAR: S/{totalNeto}</b>}
          type="warning"
          style={{ marginBottom: "20px" }}
        />
        <Form layout="vertical" onSubmitCapture={handleSubmit}>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Finalizar Reserva
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
      <PageHeader
        className="site-page-header"
        title="Check-Out"
        subTitle="Proceso de Check-Out, finalizar hospedaje."
      />
      <Input.Search
        className="searchInput"
        placeholder="Buscar por Huesped, documento, habitación..."
        onKeyUpCapture={(e) => keyUpTable(e.target.value)}
        style={{ marginBottom: "20px" }}
      />
      <Table
        loading={loading}
        dataSource={filterTable === null ? dataSource : filterTable}
        columns={columns}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default CheckOut;
