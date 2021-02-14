import clienteAxios from "../config/AxiosConfig";

const createConsumo = async (data) => {
  const resp = await clienteAxios.post("/consumos", data);
  return resp.data;
};

const getConsumosByReservaId = async (id) => {
  const resp = await clienteAxios.get("/consumos/reservas/" + id);
  return resp.data;
};

export { createConsumo, getConsumosByReservaId };
