import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import { SEARCH_PAGE, PLAYLIST_PAGE, NOW_PLAYING_PAGE,  togglePlaying, playSong, fetchSongs } from './actions';

import PlayListView from './views/PlayListView';
import SearchView from "./views/SearchView";
import Header from './components/Header';
import PlayingView from './views/PlayingView';
import keyboardEvents from './utils/keyboardEvents';


const mapStateToProps = state => ({
  searchResult: state.searchResult,
  page: state.page,
  songs: state.songs,
  playState: state.playState,
  repeatType: state.common.repeat,
});

const mapDispatchToProps = dispatch => ({
  toggle: () => dispatch(togglePlaying()),
  playSong: id => dispatch(playSong(id)),
  searchSong: keyword => dispatch(fetchSongs(keyword)),
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0,
      snackBarOpen: false,
      hasRejectedInstall: false,
      snackMsg: '',
      hideSnackAction: false,
      installEvent: null,
      addToHomeScreenUIVisible: false,
    };
  }

  componentDidMount() {
    const { songs, toggle } = this.props;
    if (songs[0]) {
      if(songs[0].source === 'local') {
        this.audioPlayer.src = URL.createObjectURL(songs[0].detail);
      } else { // network song
        this.audioPlayer.src = songs[0].detail.url;
      }
      
    }
    this.releaseKeyboardEvents = keyboardEvents({
      playNext: this.playNext,
      playPrevious: this.playPrevious,
      togglePlaying: toggle,
    });
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.setState({ installEvent: e, addToHomeScreenUIVisible: true });
    });
  }

  componentWillReceiveProps(nextProps) {
    const { playState } = this.props;
    const { songs } = nextProps;
    const { installEvent, hasRejectedInstall } = this.state;
    if (nextProps.playState !== playState) {
      if (!nextProps.playState.playing) {
        // PAUSE
        this.audioPlayer.pause();
      } else if (nextProps.playState.songId === -2) { // play last song
        this.playSong(songs.length - 1);
      } else if (nextProps.playState.songId === -1) {
        this.playSong(0);
      } else if (nextProps.playState.songId === playState.songId) {
        // RESUME
        console.log('Should only resume');
        this.audioPlayer.play();
        // Start playing
      } else {
        this.playSong(nextProps.playState.songId);
      }
      if (installEvent && !hasRejectedInstall) {
        installEvent.prompt();
        installEvent.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            this.setState({
              snackBarOpen: true,
              hideSnackAction: true,
              hasRejectedInstall: false,
              snackMsg: '🤗 Yay! You\'ve installed the app',
            });
          } else {
            this.setState({
              snackBarOpen: true,
              hideSnackAction: true,
              hasRejectedInstall: true,
              snackMsg: '😥 Reload the page whenever you change your mind',
            });
          }
          this.snackBarOpen({ installEvent: null });
        });
      }
    }
  }

  componentWillUnmount() {
    this.releaseKeyboardEvents();
  }

  playNext = () => {
    const { songs, playState, playSong: play } = this.props;
    URL.revokeObjectURL(songs[playState.songId]);
    const nextSongId = (playState.songId + 1) % songs.length;
    play(nextSongId);
  }

  songEnded = () => {
    const {
      songs, playState, repeatType, playSong: play,
    } = this.props;
    // No repeat
    if (repeatType === 0) {
      URL.revokeObjectURL(songs[playState.songId]);
      if (playState.songId < songs.length - 1) play(playState.songId + 1);
    } else if (repeatType === 1) {
      // repeat one
      play(playState.songId);
      // repeat all
    } else this.playNext();
  }

  playPrevious = () => {
    const { songs, playState, playSong: play } = this.props;
    URL.revokeObjectURL(songs[playState.songId]);
    const prevSongId = playState.songId === 0 ? songs.length - 1 : playState.songId - 1;
    play(prevSongId);
  }

  updateTime = () => {
    const currentTime = 100 * this.audioPlayer.currentTime / this.audioPlayer.duration || 0;
    this.setState({ currentTime });
  }

  playSong = (id) => {
    const { songs } = this.props;
    if (songs[id]) {

      let url = songs[id].source === 'local' ? URL.createObjectURL(songs[id].detail) : songs[id].detail.url;
      this.audioPlayer.src = url;

      this.audioPlayer.play();
      window.document.title = songs[id].detail.name.replace('.mp3', '');
    }
  }

  timeDrag = (time) => {
    this.audioPlayer.currentTime = this.audioPlayer.duration * (time / 100);
  }

  handleActionClick = () => {
    window.open('https://github.com/ashinzekene/react-music-player', '_blank');
  }

  handleRequestClose = () => {
    this.setState({ snackBarOpen: false, snackMsg: '', hideSnackAction: false });
  }

  handleSearch = (keyword) => {
    const { searchSong } = this.props;
    searchSong(keyword);
  }

  renderMain = target => {
    const {
      currentTime, snackBarOpen, snackMsg, installEvent, addToHomeScreenUIVisible, hideSnackAction,
    } = this.state;
    const {
      searchResult, songs, playState, toggle, repeatType, page,
    } = this.props;
    switch (target) {
      case SEARCH_PAGE:
        return <SearchView
        searchResult={searchResult}
        toggle={toggle}
        playState={playState}
        currentTime={currentTime}
        openSnackbar={msg => this.setState({ snackBarOpen: true, snackMsg: msg })} />

      case PLAYLIST_PAGE:
        return <PlayListView
          songs={songs}
          toggle={toggle}
          playState={playState}
          currentTime={currentTime}
          openSnackbar={msg => this.setState({ snackBarOpen: true, snackMsg: msg })} />

      case NOW_PLAYING_PAGE:
        return <PlayingView
          repeatType={repeatType}
          playNext={this.playNext}
          timeDrag={this.timeDrag}
          installEvent={installEvent}
          currentTime={currentTime}
          playPrevious={this.playPrevious}
          playingSong={songs[playState.songId]}
          openSnackbar={msg => this.setState({ snackBarOpen: true, snackMsg: msg })}
        />

      default:
        return <PlayListView
          songs={songs}
          toggle={toggle}
          playState={playState}
          currentTime={currentTime}
          openSnackbar={msg => this.setState({ snackBarOpen: true, snackMsg: msg })} />
    }

  }

  render() {
    const {
      currentTime, snackBarOpen, snackMsg, installEvent, addToHomeScreenUIVisible, hideSnackAction,
    } = this.state;
    const {
      songs, playState, toggle, repeatType, page,
    } = this.props;
    return (
      <>
        <Header
          playState={playState}
          addToHomeScreenUIVisible={addToHomeScreenUIVisible}
          playingSong={songs[playState.songId]}
          openSnackbar={() => this.setState({ snackBarOpen: true })}
          onSearch={(keyword) => this.handleSearch(keyword)}
        />
        <audio
          hidden
          controls
          onEnded={this.songEnded}
          onTimeUpdate={this.updateTime}
          ref={(audio) => { this.audioPlayer = audio; }}
        >
          <track kind="captions" {...{}} />
        </audio>
        {this.renderMain(page)}
        <Snackbar
          open={snackBarOpen}
          autoHideDuration={6000}
          onClose={this.handleRequestClose}
          ContentProps={{ 'aria-describedby': 'message-id' }}
          message={(
            <span id="message-id">{snackMsg || 'Not Implemented yet 😊'}</span>
          )}
          action={
            !hideSnackAction && (
              <Button key="undo" color="secondary" size="small" onClick={this.handleActionClick}>
                MAKE A PR
              </Button>
            )}
        />
      </>
    );
  }
}

App.propTypes = {
  page: PropTypes.string.isRequired,
  songs: PropTypes.arrayOf(PropTypes.any).isRequired,
  playState: PropTypes.shape({
    playing: PropTypes.bool.isRequired,
    songId: PropTypes.number.isRequired,
  }).isRequired,
  repeatType: PropTypes.oneOf([0, 1, 2]).isRequired,
  toggle: PropTypes.func.isRequired,
  playSong: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);