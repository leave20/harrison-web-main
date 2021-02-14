import clienteAxios from "../config/AxiosConfig";

const createFactura = async (data) => {
  const resp = await clienteAxios.post("/facturas", data);
  return resp.data;
};

const findDateFactura = async (data) => {
  const resp = await clienteAxios.post("/facturas/find-date", data);
  return resp.data;
};

const generatePdfFactura = async (reservaId) => {
  await clienteAxios
    .get("/facturas/pdf/" + reservaId, { responseType: "blob" })
    .then((resp) => {
      const file = new Blob([resp.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
      console.log("PDF GENERADO");
    });
};

export { createFactura, generatePdfFactura, findDateFactura };
