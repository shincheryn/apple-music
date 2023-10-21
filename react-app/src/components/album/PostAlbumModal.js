import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as albumActions from "../../store/album";
import { useHistory } from "react-router-dom";
import "./Album.css";

function PostAlbumModal() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [album_name, setAlbum_name] = useState("");
  const [genre, setGenre] = useState("");
  const [release_year, setRelease_year] = useState("");
  const [description, setDescription] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [album_image_url, setAlbum_image_url] = useState('');
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errorMess = [];

    if ((isNaN(release_year) && isNaN(parseFloat(release_year))) || (release_year.length !== 4)) {
      errorMess.push('Release year must be a 4 digit number')
    }


    if (album_image_url !== '') {
      const allowedExtensions = ['png', 'jpg', 'jpeg'];
      // const fileExtension = album_image_url.name.toLowerCase().slice(-4);

      const fileExtension = album_image_url.name.split('.');

      if (!allowedExtensions.includes(fileExtension[fileExtension.length-1])) {
        errorMess.push('Image file must have a valid extension: .png, .jpg, .jpeg')
      }

    }
    setErrors(errorMess)

      if(errorMess.length === 0) {
        const formData = new FormData();
        formData.append("album_name", album_name);
        formData.append("genre", genre);
        formData.append("release_year", release_year);
        formData.append("description", description);
        formData.append("album_image_url", album_image_url);

      setImageLoading(true);

        dispatch(albumActions.addAlbumThunk(formData));
        history.push("/albums/owned");
    }
    setImageLoading(false);
  }


  return (
    <div className="pageContainers">
      <h1>Create New Album</h1>
      <form onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <ul>
        {errors.length > 0 && errors.map(el => (
          <div key={el} className="errors">{el}</div>
        ))}
        </ul>
        <div>
          <label>
            Album Name
            <input
              type="text"
              value={album_name}
              onChange={(e) => setAlbum_name(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Genre
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Release Year
            <input
              type="text"
              value={release_year}
              onChange={(e) => setRelease_year(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Description
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          {/* <div className="error-message">{errorMess.album_image_url && <p className="">{errors.album_image_url}</p>}</div> */}
          {(imageLoading)&& <p>Image Uploading...</p>}
          <label>
            <p>Album Image Url (optional)</p>
            <p>URL must ends in .png, .jpg or .jpeg</p>
            <input
              type="file"
              accept="image/*"
              // value={album_image_url}
              onChange={(e) => setAlbum_image_url(e.target.files[0])}
            />
          </label>
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default PostAlbumModal;
