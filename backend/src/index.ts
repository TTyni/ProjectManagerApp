import server from "./server.js";

const PORT = process.env.BACKEND_PORT;

server.listen(PORT, () => console.log("Listening to port", PORT));
