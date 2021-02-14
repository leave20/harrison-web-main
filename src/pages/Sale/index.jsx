import { EyeOutlined } from "@ant-design/icons";
import { Button, Input, Modal, PageHeader, Table } from "antd";
import React, { useEffect, useState } from "react";
import { getBooks } from "../../services/BookService";

import moment from "moment";
import "moment/locale/es";
import SaleRoomForm from "../../components/SaleRoomForm";
import { getConsumosByReservaId } from "../../services/ConsumoService";

const Sale = () => {
  moment.locale("es");

  const [loading, setLoading] = useState(true);
  const [filterTable, setFilterTable] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [bookId, setBookId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [consumo, setConsumo] = useState([]);
  const [totalConsumo, setTotalConsumo] = useState(0);

  const listRooms = () => {
    getBooks().then((resp) => {
      resp.forEach((data) => {
        data.key = data.id;
        data.nombreHuesped =
          data.huesped.nombre.toUpperCase() +
          " " +
          data.huesped.apellido.toUpperCase();
        data.documentoHuesped = data.huesped.documento;
        data.nombreHabitacion =
          data.habitacion.nombre + " " + data.habitacion.tipoHabitacion.nombre;
      });
      const filterStatus = resp.filter((data) => data.estado === "ACTIVO");
      setDataSource(filterStatus);
      setLoading(false);
      console.log("LIST SALE");
    });
  };

  const openFormSale = (id) => {
    setDrawerVisible(true);
    setBookId(id);
  };

  const viewSale = (id) => {
    setIsModalVisible(true);
    getConsumosByReservaId(id).then((resp) => {
      let totalNeto = 0;
      resp.forEach((data) => {
        console.log(data);
        data.nombreProducto = data.producto.nombre;
        data.precioProducto = data.producto.precio;
        totalNeto += data.total;
      });
      setConsumo(resp);
      setTotalConsumo(totalNeto);
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
      width: 120,
    },
    {
      title: "Habitación",
      dataIndex: "nombreHabitacion",
      key: "nombreHabitacion",
      align: "center",
      width: 150,
    },
    {
      title: "Acciones",
      key: "action",
      fixed: "right",
      width: 120,
      align: "center",
      render: (values, record) => (
        <>
          <Button type="link" size="small" onClick={() => viewSale(record.id)}>
            <EyeOutlined />
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={() => openFormSale(record.id)}
          >
            Vender
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
  }, []);

  return (
    <div>
      <Modal
        title="Ventas Realizadas"
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <table className="table-prod">
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
                        ? `${String(data.nombreProducto).substring(0, 15)} ...`
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
      </Modal>
      <PageHeader
        className="site-page-header"
        title="Venta"
        subTitle="Venta de productos a las habitaciones."
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
      <SaleRoomForm
        status={drawerVisible}
        setStatus={setDrawerVisible}
        bookId={bookId}
      />
    </div>
  );
};

export default Sale;
