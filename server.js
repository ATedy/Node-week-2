const express = require("express");
const albumsData = require("./Data");

const app = express();

// this should be always before our route code
// content-Type:application/json
// middleware module
app.use(express.json());

app.get("/albums", function (req, res) {
  res.send(albumsData);
});

// searching using the id param, getting data
app.get("/albums/:id", function (req, res) {
  let id = req.params.id;
  console.log(albumsData);

  let filteredAlbum = albumsData.find(
    (singleData) => singleData.albumId === id
  );

  if (!filteredAlbum) {
    res.sendStatus(404);
  }
  res.send(filteredAlbum);
});

// post method, adding new element
app.post("/albums", function (req, res) {
  let newAlbum = req.body;

  if (!newAlbum.albumId) {
    res.status(400);
    res.send("Album Id required");
  } else if (albumsData.find((album) => album.albumId === newAlbum.albumId)) {
    res.status(400);
    res.send("Album already exists");
  } else {
    albumsData.push(newAlbum);
    res.status(201);
    console.log(newAlbum);
    res.send(newAlbum);
  }
});

// deleting an element
// solution-1
app.delete("/albums/:albumId", (req, res) => {
  let id = req.params.albumId;
  let deletedAlbumIndex = albumsData.findIndex((album) => album.albumId === id);
  if (deletedAlbumIndex > -1) {
    albumsData.slice(deletedAlbumIndex, 1);
    res.status(204);
    res.send("Album Successfully deleted");
    res.end();
  }
  // Solution 2
  // filtering same array based on not having the id
  albumsData = albumsData.filter((album) => album.albumId !== req.params.id);

  res.status(204); // No data
  res.end(); // Response body is empty
});

// updating/put
app.put("/albums/:albumId", (req, res) => {
  // let newUpdatedAlbum = req.body;
  // the album to be updated
  let albumIndex = albumsData.findIndex(
    (album) => album.albumId === req.params.albumId
  );

  // if the album is the array
  if (albumIndex >= 0) {
    // origAlbum contain the data of the album in the array
    // updatedAlbum.albumId contains the data of the body from the put request
    const origAlbum = albumsData[albumIndex];
    const updatedAlbum = req.body;

    // Data validation
    if (updatedAlbum.albumId && origAlbum.albumId !== updatedAlbum.albumId) {
      res.status(400); // Bad request
      res.send({message: "album IDs don't match"});
    } else {
      // It will updated the existing album album with new vales and the rest values unchanged using spread operator
      albumsData[albumIndex] = {...origAlbum, ...updatedAlbum};
      res.send(albumsData[albumIndex]);
    }
  } else {
    res.status(404); // Not found
    res.send({message: "no such album"});
  }
  // albumsData[updatedAlbumIndex] = newUpdatedAlbum;
  // res.send(newUpdatedAlbum);
});

app.listen(3000, () => console.log(`listening on 3000`));
