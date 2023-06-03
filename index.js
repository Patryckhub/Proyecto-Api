const morgan = require('morgan');
const express = require('express');
const app = express();

//Routes
const empleados = require('./routes/empleados');


//Middleware
const auth = require('./middleware/auth');
const notFound = require('./middleware/notFound');
const index = require('./middleware/index');
const cors = require('./middleware/cors');


app.use(cors);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
Verbos HTTP
GET Abrir una pagina
POST Guardar algo
PATCH Modificar bases de datos (uno)
PUT Modificar bases de datos (todos)
DELETE Elimitar registros etc
*/

app.get("/", index);

app.use("/empleados", empleados);

app.use(auth);

app.use(notFound);

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running...")
});