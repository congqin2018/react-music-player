import mediaSession from '../utils/media-session';
import * as types from '../constants/ActionTypes';
export const ADD_SONGS = 'ADD_SONGS';
export const REMOVE_SONGS = 'REMOVE_SONGS';
export const TOGGLE_PLAYING = 'TOGGLE_PLAYING';
export const FILTER_SONGS = 'FILTER_SONGS';
export const PLAY_SONG = 'PLAY_SONG';
export const RECEIVE_SEARCH_RESULT = 'RECEIVE_SEARCH_RESULT';
export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';
export const PLAYLIST_PAGE = 'PLAYLIST_PAGE';
export const SHUFFLE = 'SHUFFLE';
export const REPEAT = 'REPEAT';
export const SEARCH_PAGE = 'SEARCH_PAGE';
export const HOME_PAGE = 'HOME_PAGE';
export const SETTINGS_PAGE = 'SETTINGS_PAGE';
export const NOW_PLAYING_PAGE = 'NOW_PLAYING_PAGE';

export const addLocalSongs = localSongs => ({
  type: ADD_SONGS,
  songs: localSongs.map(i => ({source: 'local', detail: i}))
});

export const addNetworkSong = networkSong => ({
  type: ADD_SONGS,
  songs: [{source: 'network', detail: networkSong}]
});

export const removeSong = id => ({
  type: REMOVE_SONGS,
  id,
});

export const playSong = (id) => {
  mediaSession.playSong(id);
  return {
    type: PLAY_SONG,
    id,
  };
};
/////////////////


export function play(audio, ind) {
  return { type: types.PLAY, audio, ind }
}

export function previous(audio) {
  return { type: types.PREVIOUS, audio }
}


/////////////////////


export const repeatType = id => ({
  type: REPEAT,
  id,
});

export const togglePlaying = () => ({
  type: TOGGLE_PLAYING,
});

export const toggleSidebar = () => ({
  type: TOGGLE_SIDEBAR,
});

export const filterSong = filter => ({
  type: FILTER_SONGS,
  filter,
});

export const homePage = () => ({
  type: HOME_PAGE,
});

export const nowPlayingPage = () => ({
  type: NOW_PLAYING_PAGE,
});

export const settingsPage = () => ({
  type: SETTINGS_PAGE,
});

export const receiveSearchResult = json => ({
  type: RECEIVE_SEARCH_RESULT,
  songs: json.result.songs
  // subreddit,
  // posts: json.data.children.map(child => child.data),
  // receivedAt: Date.now()
})

export const fetchSongs = keyword => (dispatch, getState) => {
  return fetch(`https://cors-anywhere.herokuapp.com/https://api.muxiv.com/search?keywords=${keyword}&offset=0&limit=20&type=1&lang=en`)
  // return fetch(`https://api.muxiv.com/search?keywords=${keyword}&offset=0&limit=20&type=1&lang=en`)
    .then(response => response.json())
    // .then(json => dispatch(playSong(-1)))
    // .then(json => console.log(json))
    .then(json => dispatch(receiveSearchResult(json)))
}

export const fetchDetailAndPlay = song => (dispatch, getState) => {

  return fetch(`https://cors-anywhere.herokuapp.com/https://api.muxiv.com/music/url?id=${song.id}&lang=en#`)
  .then(response => response.json())
  .then(json => {
    song['url'] = json[0]['url']
    return song
  })
  .then(song => dispatch(addNetworkSong(song)))
  .then(() => dispatch(playSong(-2)))
}