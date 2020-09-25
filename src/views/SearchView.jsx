import React, { Component } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';

import AddSongs from '../components/AddSongs';
import SearchResultList from '../components/SearchResultList';
import NowPlaying from '../components/NowPlaying';
import { togglePlaying, nowPlayingPage, addNetworkSong } from '../actions';

const mapDispatchToProps = dispatch => ({
  toggle: () => dispatch(togglePlaying()),
  openNowPlaying: () => dispatch(nowPlayingPage()),
  addSongs: songs => dispatch(addNetworkSong(songs)),
});

class SearchView extends Component {
  handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.dropEffect = 'copy';
  };

  render() {
    const {
      searchResult, playState, openNowPlaying, openSnackbar, currentTime, addSongs: add, toggle,
    } = this.props;
    return (
      <div
        onDragOver={this.handleDragOver}
        onDrop={(event) => {
          this.handleDragOver(event);
          if (window.File && window.FileReader && window.FileList && window.Blob) {
            const files = [...event.dataTransfer.files].filter(({ name }) => name && name.endsWith('.mp3'));
            if (files.length > 0) add(files);
          } else {
            openSnackbar('The File APIs are not fully supported in this browser.');
          }
          return false;
        }}
      >
        <SearchResultList searchResult={searchResult} />
        <AddSongs />
        <NowPlaying
          togglePlaying={toggle}
          playState={playState}
          playingSong={searchResult[playState.songId]}
          openNowPlaying={openNowPlaying}
          currentTime={currentTime}
        />
      </div>
    );
  }
}

SearchView.propTypes = {
  openNowPlaying: propTypes.func.isRequired,
  toggle: propTypes.func.isRequired,
  addSongs: propTypes.func.isRequired,
  searchResult: propTypes.arrayOf(propTypes.any).isRequired,
  playState: propTypes.objectOf(propTypes.any).isRequired,
  currentTime: propTypes.number.isRequired,
  openSnackbar: propTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(SearchView);
