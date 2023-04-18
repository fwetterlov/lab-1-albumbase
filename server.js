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
      let html = "";
      html += /*html*/`
      <div>
        <h2>Albums</h2>
        <label for="title">Title:</label>
        <input type="text" id="title" name="title">
        <label for="artist">Artist:</label>
        <input type="text" id="artist" name="artist">
        <label for="year">Year:</label>
        <input type="text" id="year" name="year">
        <button onclick="addAlbum()">Add Album</button>
      </div>
      <table>
      <thead><tr><th>Title</th><th>Artist</th><th>Year</th><th>Action</th></tr></thead>
      <tbody>
      `;
      albums.forEach((album) => {
        html += /*html*/`
      <tr><td>${album.title}</td><td>${album.artist}</td><td>${album.year}</td>
      <td>
      <button onclick="deleteAlbum('${album._id}')">Delete</button>
      <button onclick="showAlbumDetails('${album.title}')">Details</button>
      <button onclick="editAlbum('${album._id}', '${album.title}', '${album.artist}', '${album.year}')">Edit</button></td>
      <td><button onclick="saveAlbumChanges('${album._id}')">Submit changes</button></td>
      <td><div id="album-${album._id}"></div></td>
      </tr>
      `;
        html += `<script>
        function editAlbum(id, title, artist, year) {
          const albumDiv = document.getElementById('album-' + id);
          console.log(typeof id);
          console.log(title);
          console.log(artist);
          console.log(year);
          albumDiv.innerHTML =
          '<label for="title-' + id + '">Title:</label> <input type="text" id="title-' + id + '" value="' + title + '">' +
          '<label for="artist-' + id + '">Artist:</label> <input type="text" id="artist-' + id + '" value="' + artist + '">' +
          '<label for="year-' + id + '">Year:</label> <input type="text" id="year-' + id + '" value="' + year + '">';    
        }
      </script>`;
      });
      html += '</tbody>';
      html += '<div id="album-details"></div>'
      html += '</table>';
      html += '<script>';
      html += /*html*/`
        function editAlbum(id, title, artist, year) {
          const albumDiv = document.getElementById('album-' + id);
          console.log(typeof id)
          console.log(title)
          console.log(artist)
          console.log(year)
          albumDiv.innerHTML =
          '<label for="title-' + id + '">Title:</label> <input type="text" id="title-' + id + '" value="' + title + '">' +
          '<label for="artist-' + id + '">Artist:</label> <input type="text" id="artist-' + id + '" value="' + artist + '">' +
          '<label for="year-' + id + '">Year:</label> <input type="text" id="year-' + id + '" value="' + year + '">';    
        }`;
      html += /*html*/`
        function deleteAlbum(id) {
        fetch("/api/albums/" + id, { method: "DELETE" })
          .then(() => window.location.reload())
          .catch((err) => console.error(err));
      }`;
      html += /*html*/`
      function addAlbum() {
        const title = document.getElementById("title").value;
        const artist = document.getElementById("artist").value;
        const year = document.getElementById("year").value;
        fetch("/api/albums", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ title, artist, year })
        })
        .then(() => window.location.reload())
        .catch((err) => {
          console.error(err);
          console.log("Failed to add album!");
        });
      }
    `;
      html += /*html*/`
        function saveAlbumChanges(id) {
          console.log(id)
          console.log("test")

          const title = document.getElementById('title-' + id).value;
          const artist = document.getElementById('artist-' + id).value;
          const year = document.getElementById('year-' + id).value;
            
          if (title && artist && year) {
            fetch('/api/albums/' + id, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title, artist, year })
            })
            .then(() => {
              console.log('Album ' + id + ' updated successfully');
              window.location.reload();
            })
            .catch(console.error);
          } else {
            console.error('Could not find elements with IDs "title-' + id + '", "artist-' + id + '", and/or "year-' + id + '"');
          }
        }
        `;
      html += /*html*/`
        function cancelAlbumChanges(id) {
        const albumDiv = document.getElementById(id)
        if (albumDiv) { albumDiv.innerHTML = ""; }
        }
      `;
      html += /*html*/
        function showAlbumDetails(title) {
          fetch('/api/albums/' + title)
            .then((response) => response.json())
            .then((album) => {
              const albumDetails = document.getElementById('album-details');
              albumDetails.innerHTML = `
                <p> Title: ${album.title}</p>
                <p>Artist: ${album.artist}</p>
                <p>Year: ${album.year}</p>
                <button onclick="cancelAlbumDetails('${album.title}')">Cancel details</button>
              `;
            })
            .catch((error) => console.error(error));
        }
      html += /*html*/
        function cancelAlbumDetails(title) {
          const albumDiv = document.getElementById('album-details');
          if (albumDiv) { albumDiv.innerHTML = ""; }
        }
      html += '</script>';
      res.send(html);
    })
    .catch((e) => {
      console.error(e);
      res.status(500).json({ message: 'Error retrieving albums' });
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

app.get('/api/albums/:title', (req, res) => {
  const title = req.params.title;
  Album.findOne({ title: title })
    .then((albums) => {
      if (!albums || albums.length === 0) {
        res.status(404).json({ message: `Albums with title '${title}' not found` });
        return;
      }
      res.status(200).json(albums);
    })
    .catch((e) => {
      console.error(e);
      res.status(500).json({ message: `Error retrieving albums with title '${title}'` });
    });
});

app.route('/api/albums/:id')
  .get((req, res) => {
    const { id } = req.params;
    Album.findById(id)
      .then((album) => {
        if (!album) {
          res.status(404).json({ message: `Album with ID ${id} not found` });
          return;
        }
        res.status(200).json(album);
      })
      .catch((e) => {
        console.error(e);
        res.status(500).json({ message: `Error retrieving album with ID ${id}` });
      });
  })
  .post((req, res) => {
    const { title, artist, year } = req.body;
    const newAlbum = new Album({ title, artist, year });
    newAlbum.save()
      .then((savedAlbum) => {
        console.log(`Album ${savedAlbum._id} saved successfully`);
        res.status(201).json(savedAlbum);
      })
      .catch((e) => {
        console.error(e);
        res.status(500).json({ message: 'Error saving album' });
      });
  })
  .put((req, res) => {
    const { title, artist, year } = req.body;
    const albumId = req.params.id;
    Album.findByIdAndUpdate(albumId, { title, artist, year }, { new: true })
      .then((updatedAlbum) => {
        if (!updatedAlbum) {
          res.status(404).json({ message: `Album with ID ${albumId} not found` });
          return;
        }
        console.log(`Album ${albumId} updated successfully`);
        res.status(200).json(updatedAlbum);
      })
      .catch((e) => {
        console.error(e);
        res.status(500).json({ message: `Error updating album with ID ${albumId}` });
      });
  })
  .delete((req, res) => {
    const { id } = req.params;
    Album.findByIdAndDelete(id)
      .then((deletedAlbum) => {
        if (!deletedAlbum) {
          res.status(404).json({ message: `Album with ID ${id} not found` });
          return;
        }
        console.log(`Album with ID ${id} deleted`);
        res.sendStatus(204);
      })
      .catch((e) => {
        console.error(e);
        res.status(500).json({ message: `Error deleting album with ID ${id}` });
      });
  });