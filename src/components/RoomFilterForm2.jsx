import React from "react";

import { Button, Card, Form, Select, Tooltip } from "antd";
import { ClearOutlined } from "@ant-design/icons";

import { useFormik } from "formik";
import * as Yup from "yup";

const styleFormItem = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
};

function RoomFilterForm2() {
  const validationSchema = Yup.object({}); // eslint-disable-next-line
  const { handleSubmit, handleChange, values, setFieldValue, errors, touched } = useFormik({
    initialValues: {
      roomKind: {}
    },
    validationSchema,
    onSubmit: (data) => {
      console.log(data);
    },
  });

  return (
    <Card>
      <Form layout="inline">
        <Form.Item label="Tipo de Habitación" style={styleFormItem}>
          <Select
            showSearch
            allowClear
            name="roomKind"
            placeholder="Seleccione una opción"
            optionFilterProp="children"
            style={{ width: "200px" }}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          ></Select>
        </Form.Item>
        <Form.Item label="Nivel" style={styleFormItem}>
          <Select
            showSearch
            allowClear
            name="roomKind"
            placeholder="Seleccione una opción"
            optionFilterProp="children"
            style={{ width: "200px" }}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          ></Select>
        </Form.Item>
        <Form.Item label="Estado" style={styleFormItem}>
          <Select
            showSearch
            allowClear
            name="roomKind"
            placeholder="Seleccione una opción"
            optionFilterProp="children"
            style={{ width: "200px" }}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          ></Select>
        </Form.Item>
        <Form.Item
          label=""
          style={{
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <Button type="primary" htmlType="submit">
            Filtrar
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
            <Button type="ghost">
              <ClearOutlined />
            </Button>
          </Tooltip>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default RoomFilterForm2;
