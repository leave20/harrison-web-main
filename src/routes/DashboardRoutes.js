import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Layout from "../components/Layout";
import Book2 from "../pages/Book2";
import CheckOut from "../pages/CheckOut";
import Client from "../pages/Client";
import Product from "../pages/Product";
import Reception2 from "../pages/Reception2";
import Reporte from "../pages/Reporte";
import Room from "../pages/Room";
import Sale from "../pages/Sale";

export const DashboardRoutes = () => {
  return (
    <Layout>
      <Switch>
        <Route exact path="/reserva" component={Book2} />
        <Route exact path="/recepcion" component={Reception2} />
        <Route exact path="/check-out" component={CheckOut} />
        <Route exact path="/productos" component={Product} />
        <Route exact path="/venta" component={Sale} />
        <Route exact path="/mantenimiento/habitacion" component={Room} />
        <Route exact path="/clientes" component={Client} />
        <Route exact path="/reporte" component={Reporte} />
        <Redirect to="/reserva" />
      </Switch>
    </Layout>
  );
};
