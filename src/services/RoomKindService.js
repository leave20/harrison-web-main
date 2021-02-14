import clienteAxios from "../config/AxiosConfig";

const getRoomKinds = async () => {
  const resp = await clienteAxios.get("/tipos-habitacion");
  return resp.data;
};

export { getRoomKinds };
