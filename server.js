const express = require('express')
const app = express()
require("dotenv").config()
const getAlbums = require("./database")
const Album = require("./Album")
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.listen(process.env.PORT, () => {
  console.log("Server listening on port: " + process.env.PORT);
})

app.get('/api/albums', (req, res) => {
  Album.find()
    .then((albums) => {
      let html = '<h1>Albums</h1>';
      html += '<div>';
      html += '<h2>Add Album</h2>';
      html += '<label for="title">Title:</label>';
      html += '<input type="text" id="title" name="title">';
      html += '<label for="artist">Artist:</label>';
      html += '<input type="text" id="artist" name="artist">';
      html += '<label for="year">Year:</label>';
      html += '<input type="text" id="year" name="year">';
      html += '<button onclick="addAlbum()">Add Album</button>';
      html += '</div>';
      html += '<table>';
      html += '<thead><tr><th>Title</th><th>Artist</th><th>Year</th><th>Action</th></tr></thead>';
      html += '<tbody>';
      albums.forEach((album) => {
        html += `<tr><td>${album.title}</td><td>${album.artist}</td><td>${album.year}</td>`;
        html += `<td><button onclick="editAlbum('${album._id}', '${album.title}', '${album.artist}', '${album.year}')">Edit</button>`;
        html += `<button onclick="deleteAlbum('${album._id}')">Delete</button></td>`;
        html += `<td><div id="album-${album._id}"></div></td>`;
        html += '</tr>';
      });
      html += '</tbody>';
      html += '</table>';
      html += '<script>';
      html += 'function editAlbum(id, title, artist, year) {';
      html += 'const albumDiv = document.getElementById(`album-${id}`);';
      html += 'albumDiv.innerHTML = `<label for="title-${id}">Title:</label> <input type="text" id="title-${id}" value="${title}"><br>';
      html += '<label for="artist-${id}">Artist:</label> <input type="text" id="artist-${id}" value="${artist}"><br>';
      html += '<label for="year-${id}">Year:</label> <input type="text" id="year-${id}" value="${year}"><br>';
      html += '<button onclick="saveAlbumChanges()">Update</button> ';
      html += '<button onclick="cancelAlbumChanges()">Cancel</button>`;';
      html += '}';
      html += 'function deleteAlbum(id) {';
      html += 'fetch("/api/albums/" + id, { method: "DELETE" })';
      html += '.then(() => window.location.reload())';
      html += '.catch((err) => console.error(err));';
      html += '}';
      html += 'function addAlbum() {';
      html += 'const title = document.getElementById("title").value;';
      html += 'const artist = document.getElementById("artist").value;';
      html += 'const year = document.getElementById("year").value;';
      html += 'fetch("/api/albums", {';
      html += 'method: "POST",';
      html += 'headers: {';
      html += '"Content-Type": "application/json"';
      html += '},';
      html += 'body: JSON.stringify({ title, artist, year })';
      html += '})';
      html += '.then(() => window.location.reload())';
      html += '.catch((err) => console.error(err));';
      html += '}';
      html += 'function cancelAlbumChanges(id) {';
      html += 'const albumDiv = document.getElementById(`album-${id}`);';
      html += 'if (albumDiv) { albumDiv.innerHTML = ""; }';
      html += '}';
      html += '</script>';
      res.send(html);
    })
    .catch((e) => {
      console.error(e);
      res.status(500).json({ message: 'Error retrieving albums' });
    });
});

app.delete('/api/albums/:id', (req, res) => {
  const { id } = req.params;
  Album.findByIdAndDelete(id)
    .then(() => {
      console.log(`Album with ID ${id} deleted`);
      res.sendStatus(204);
    })
    .catch((e) => {
      console.error(e);
      res.status(500).json({ message: `Error deleting album with ID ${id}` });
    });
});

app.post('/api/albums', (req, res) => {
  const { title, artist, year } = req.body;
  const album = new Album({ title, artist, year });
  album.save()
    .then(() => {
      console.log('Album added successfully');
      res.sendStatus(201);
    })
    .catch((e) => {
      console.error(e);
      res.status(500).json({ message: 'Error adding album' });
    });
});