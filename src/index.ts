import { Elysia } from "elysia";
import { mahasiswaRoute } from "./routes/mahasiswa";
const app = new Elysia();

app.use(mahasiswaRoute);

app.listen(3001);

console.log(`Server berjalan pada http://localhost:3001`);