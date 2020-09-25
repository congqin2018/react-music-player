import { combineReducers } from 'redux';
import songs from './songs';
import playState from './playState';
import common from './common';
import page from './page';
import searchResult from './searchResult';

const reducers = combineReducers({
  searchResult,
  songs,
  common,
  playState,
  page,
});

export default reducers;
