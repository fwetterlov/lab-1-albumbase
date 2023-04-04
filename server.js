const express = require('express')
const app = express()
require("dotenv").config()
const getAlbums = require("./database")
const Album = require("./Album")

app.listen(process.env.PORT, () => {
  console.log("Server listening on port: " + process.env.PORT);
})

app.get('/api/albums', (req, res) => {
  Album.find()
    .then((albums) => {
      let html = '<h1>Albums</h1>';
      html += '<table>';
      html += '<thead><tr><th>Title</th><th>Artist</th><th>Year</th><th>Action</th></tr></thead>';
      html += '<tbody>';
      albums.forEach((album) => {
        html += `<tr><td>${album.title}</td><td>${album.artist}</td><td>${album.year}</td>`;
        html += `<td><button onclick="updateAlbum('${album._id}')">Update</button>`;
        html += `<button onclick="deleteAlbum('${album._id}')">Delete</button></td>`;
        html += '</tr>';
      });
      html += '</tbody>';
      html += '</table>';
      res.send(html);
    })
    .catch((e) => {
      console.error(e);
      res.status(500).json({ message: 'Error retrieving albums' });
    });
});