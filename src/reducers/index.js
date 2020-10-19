import { combineReducers } from 'redux';
import songs from './songs';
import playState from './playState';
import common from './common';
import page from './page';
import searchResult from './searchResult';
import audio from './audio';

const reducers = combineReducers({
  searchResult,
  songs,
  common,
  playState,
  page,
  audio
});

export default reducers;
