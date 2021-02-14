import clienteAxios from "../config/AxiosConfig";

const getBooks = async () => {
  const resp = await clienteAxios.get("/reservas");
  return resp.data;
};

const getBookById = async (id) => {
  const resp = await clienteAxios.get(`/reservas/${id}`);
  return resp.data;
};

const createBook = async (data) => {
  const resp = await clienteAxios.post("/reservas", data);
  return resp.data;
};

const changeBookStatus = async (estado, id) => {
  const resp = await clienteAxios.patch(`/reservas/${id}/${estado}`);
  return resp.data;
};

const findBooksByRangeDate = async (data) => {
  const resp = await clienteAxios.post("/reservas/find-dateTime", data);
  return resp.data;
};

const findBookByCodeBook = async (code, idHabitacion) => {
  const resp = await clienteAxios.get(
    `/reservas/codigo/${code}/${idHabitacion}`
  );
  return resp.data;
};

const findBookByIdHabitacion = async (idHabitacion) => {
  const resp = await clienteAxios.get(`/reservas/habitacion/${idHabitacion}`);
  return resp.data;
};

export {
  getBooks,
  getBookById,
  createBook,
  findBooksByRangeDate,
  changeBookStatus,
  findBookByCodeBook,
  findBookByIdHabitacion,
};
