import clienteAxios from "../config/AxiosConfig";

const countHuespedes = async () => {
  const resp = await clienteAxios.get("/contadores/huespedes");
  return resp.data;
};
const countHabitaciones = async () => {
  const resp = await clienteAxios.get("/contadores/habitaciones");
  return resp.data;
};
const countReservas = async () => {
  const resp = await clienteAxios.get("/contadores/reservas");
  return resp.data;
};
const countVentas = async () => {
  const resp = await clienteAxios.get("/contadores/ventas");
  return resp.data;
};

const countTipoHabitación = async (id) => {
  const resp = await clienteAxios.get("/contadores/tipo-habitacion/" + id);
  return resp.data;
};

export {
  countHuespedes,
  countHabitaciones,
  countReservas,
  countVentas,
  countTipoHabitación,
};
