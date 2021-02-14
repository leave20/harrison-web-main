import clienteAxios from "../config/AxiosConfig";

const getRooms = async () => {
  const resp = await clienteAxios.get("/habitaciones");
  return resp.data;
};

const getRoomById = async (id) => {
  const resp = await clienteAxios.get(`/habitaciones/${id}`);
  return resp.data;
};

const changeStatusRoom = async (id, status) => {
  const resp = await clienteAxios.patch(`/habitaciones/${id}/${status}`);
  return resp.data;
};

export { getRooms, getRoomById, changeStatusRoom };
