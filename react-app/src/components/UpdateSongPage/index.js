import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as songsActions from '../../store/songs';

const UpdateSong = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { id } = useParams();
    const song = useSelector((state) => state.song[id]);
    const [songName, setSongName] = useState(song?.song_name || '');
    const [genre, setGenre] = useState(song?.genre || '');
    // const [image, setImage] = useState(song?.image_url || '');
    // const [songMP3, setSongMP3] = useState(song?.song_url || '');
    const [image, setImage] = useState(null);
    const [songMP3, setSongMP3] = useState(null);
    const [songLoading, setSongLoading] = useState(false)
    const [imageLoading, setImageLoading] = useState(false);
    const [errors, setErrors] = useState({});

    console.log("SONG URL OMG", song?.song_url)

    useEffect(() => {
        if (!song) {
            dispatch(songsActions.getSongsDetails(id))
                .then((songDetail) => {
                    if (songDetail) {
                        setSongName(songDetail.song_name);
                        setGenre(songDetail.genre);
                        setImage(songDetail.image_url);
                        setSongMP3(songDetail.song_url);
                    }
                    console.log('i!!!!d', songDetail)
                })
                .catch((err) => {
                    console.error('Error fetching song details:', err);
                });
        }

    }, [dispatch, id, song]);


    console.log('!!!song', song)

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = {};

        if(!songName) errors.songName = 'Song name is required';
        if(!genre) errors.genre = 'Genre is required';
        if(!image) errors.image = 'Image is required';
        if(!songMP3) errors.songMP3 = 'Song MP3 is required';

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
          } else {
            setErrors({});
            const formData = new FormData();
            formData.append("song_name", songName);
            formData.append("genre", genre);
            formData.append("image_url", image);
            formData.append("song_url", songMP3);
            // if (image) {
            //     formData.append("image_url", image);
            // }

            // if (songMP3) {
            //     formData.append("song_url", songMP3);
            // }
            setImageLoading(true);
            setSongLoading(true);

            dispatch(songsActions.updateSong(id, formData))
                .then((song) => {
                    history.push(`/songs/${song.id}`)
                })
                .catch((err) => {
                    setErrors(err)
                })
          }
    }

    return (
        <>
            <div className='page-container'>
            <div className='form-create'>
            <h1>Update Song</h1>
            <form
                method='PUT'
                onSubmit={handleSubmit}
                encType="multipart/form-data"
            >
                <div>
                <div className="error-message ">{errors.songName && <p className="">{errors.songName}</p>}</div>
                <label className="">
                    Song Name
                    <input
                        className=""
                        type='text'
                        name="song_name"
                        placeholder="Song Name"
                        value={songName}
                        onChange={(e) => setSongName(e.target.value)}
                    />
                </label>
                </div>
                <div>
                <div className="error-message ">{errors.genre && <p className="">{errors.genre}</p>}</div>
                <label className="">
                    Genre
                    <input
                        className=""
                        type='text'
                        name="genre"
                        placeholder="Genre"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                    />
                </label>
                </div>
                <div>
                <div className="error-message ">{errors.image && <p className="">{errors.image}</p>}</div>
                {song?.image_url && <img src={song.image_url} alt="Current Song Image" />}
                <label className="">
                    Select Song Image
                    <input
                        type="file"
                        name="image_url"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </label>
                {(imageLoading)&& <p>Loading...</p>}
                </div>
                <div>
                <div className="error-message ">{errors.songMP3 && <p className="">{errors.songMP3}</p>}</div>
                {song?.song_url && (
                    <audio controls>
                        <source src={song.song_url} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                )}
                <label className="">
                    Select Song MP3
                    <input
                        type="file"
                        name="song_url"
                        accept="audio/*"
                        onChange={(e) => setSongMP3(e.target.files[0])}
                    />
                </label>
                {(songLoading)&& <p>Loading...</p>}
                </div>
                <button type="submit">Submit</button>
            </form>
            </div>
            </div>
        </>
    );
};

export default UpdateSong;
