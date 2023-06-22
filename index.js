const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

let notes = [
  {
    id: 1,
    content: "Html is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP Protocols",
    important: true,
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!<h1>");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id); //we use Number because there will be a type error during the find method below
  const note = notes.find((note) => note.id === id);
  note ? response.json(note) : response.status(404).end(); //if an object exists(truthy) return object else, return 404 and end response
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  };

  notes = notes.concat(note);

  response.json(note);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
