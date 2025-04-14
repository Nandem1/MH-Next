export async function POST(req: Request) {
  const zpl = await req.text(); // 🔥 Recibimos como texto plano

  const formData = new FormData();
  formData.append("file", zpl); // 🔥 Campo "file", no "body", no JSON.

  const labelaryUrl = "http://api.labelary.com/v1/printers/8dpmm/labels/4x1.2/0/";

  const response = await fetch(labelaryUrl, {
    method: "POST",
    headers: {
      "Accept": "image/png", // Queremos PNG para previsualizar en frontend
    },
    body: formData,
  });

  if (!response.ok) {
    console.error("Error en Labelary:", await response.text());
    return new Response("Error generando etiqueta", { status: 500 });
  }

  const imageBuffer = await response.arrayBuffer();
  return new Response(imageBuffer, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
    },
  });
}
