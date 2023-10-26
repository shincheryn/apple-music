import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import OpenModalButton from '../OpenModalButton';
import AddSongToPlaylistModal from '../Playlists/AddSongtoPlaylistModal';
import * as songsActions from '../../store/songs';
import './css/song-details.css';

const SongDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);
    const song = useSelector((state) => state.song[id]);
    const [showButton, setShowButton] = useState(false);
    const [audio] = useState(new Audio());

    useEffect(() => {
        dispatch(songsActions.getSongsDetails(id))
    }, [dispatch, id])

    useEffect(() => {
        if (song) {
            audio.src = song.song_url;
        }
    }, [song, audio]);

    useEffect(() => {
        if (user) {
            setShowButton(true);
        }
    })
    if(!song){
        return <div> No song</div>
    }

    const year = new Date(song.createdAt).getFullYear();

    const handleClick = e => {
        e.preventDefault();
        alert("Feature Coming Soon! <3 :)")
    }


    return (
        <div className='page-container'>
            <div className='parent'>
                <div className='song-image-detail-id div1'>
                    <img  className='image-id' src={song.image_url} alt={song.song_name}/>
                </div>
                <div className='righthalfpage'>
                    <div className='song-details div2'>
                        <h2 className="song-name-detail-id">{song.song_name}</h2>
                        <p className="genre-detail-id div2">{song.username}</p>
                        <p className='createdat-year'>{song.genre} &#8231; {year}</p>
                        <button onClick={handleClick} className='artist-info' >See Artist Info</button>
                    </div>
                    <div>
                    {showButton && <OpenModalButton
                        modalComponent={<AddSongToPlaylistModal songId={song.id} />}
                        buttonText='Add to Playlist'
                    />}
                    </div>
                    <div className="apple-music-player div4">
                        <audio className='div4'controls>
                            <source src={song.song_url} type="audio/mpeg" />
                        </audio>
                    </div>
                </div>
            </div>
            <div className='lyrics-text'>
                <button onClick={handleClick} className='lyrics-structure'>No lyrics to display . . .</button>
            </div>
        </div>
    )
}

export default SongDetails;
