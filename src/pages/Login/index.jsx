import React, { useContext, useState } from "react";

import { Form, Button, Input, Divider, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useFormik } from "formik";
import * as Yup from "yup";

import "./Login.css";

import LogoHarrison from "../../img/logo-harrison.min.png";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
import { types } from "../../types/types";
import { login } from "../../services/UserServices";

const imgHotel =
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=387&q=80";

const Login = () => {
  const history = useHistory();
  const { dispatch } = useContext(AuthContext);
  const [loadSubmit, setLoadSubmit] = useState(false);

  const validationSchema = Yup.object().shape({
    correo: Yup.string()
      .trim()
      .email("El formato no es correcto.")
      .required("Correo requerido."),
    password: Yup.string()
      .trim()
      .matches(/^[ñÑa-zA-Z0-9]*$/, "Solo se admiten letras y números.")
      .required("Contraseña requerida."),
  });

  const formik = useFormik({
    initialValues: {
      correo: "",
      password: "",
    },
    validationSchema,
    onSubmit: (value) => {
      setLoadSubmit(true);
      login(value)
        .then((resp) => {
          console.log("THEN", resp);
          if (resp.Valido) {
            dispatch({
              type: types.login,
              payload: {
                name: resp.Usuario.nombre,
              },
            });
            localStorage.setItem("user", JSON.stringify({ logged: true }));
            history.push("/reserva");
            message.success("Inicio de Sesión correcto.");
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            message.error("Las Credenciales no son válidas.");
          }
        })
        .finally(setLoadSubmit(false));
    },
  });

  return (
    <div className="Login">
      <div className="content">
        <div className="left">
          <img src={imgHotel} alt="Hotel Example" />
        </div>
        <div className="right">
          <div className="logo">
            <img src={LogoHarrison} alt="logo" />
          </div>
          <Form layout="vertical" onSubmitCapture={formik.handleSubmit}>
            <h1>Iniciar Sesión</h1>
            <Form.Item label="Correo:" required>
              <Input
                prefix={<UserOutlined />}
                placeholder="Ingrese su correo"
                name="correo"
                value={formik.values.correo}
                onChange={formik.handleChange}
              />
              {formik.errors.correo && formik.touched.correo ? (
                <div className="error-field">{formik.errors.correo}</div>
              ) : null}
            </Form.Item>
            <Form.Item label="Contraseña:" required>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Ingrese su contraseña"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              {formik.errors.password && formik.touched.password ? (
                <div className="error-field">{formik.errors.password}</div>
              ) : null}
            </Form.Item>
            <Form.Item>
              <Button
                loading={loadSubmit}
                type="primary"
                htmlType="submit"
                block
              >
                Ingresar
              </Button>
            </Form.Item>
          </Form>
          <div className="information">
            <Divider>
              <InfoCircleOutlined />
            </Divider>
            <p>
              Sistema de Reserva y Recepción de Habitaciones -{" "}
              <b>Hotel Harrison</b>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
