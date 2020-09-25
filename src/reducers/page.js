import {
  SEARCH_PAGE, HOME_PAGE, NOW_PLAYING_PAGE, SETTINGS_PAGE, PLAYLIST_PAGE,
} from '../actions/index';

export default (state = SEARCH_PAGE, action) => {
  switch (action.type) {
    case SEARCH_PAGE: {
      return SEARCH_PAGE;
    }
    case HOME_PAGE: {
      return HOME_PAGE;
    }
    case PLAYLIST_PAGE: {
      return PLAYLIST_PAGE;
    }
    case NOW_PLAYING_PAGE: {
      return NOW_PLAYING_PAGE;
    }
    case SETTINGS_PAGE: {
      return SETTINGS_PAGE;
    }
    default: {
      return state;
    }
  }
};
