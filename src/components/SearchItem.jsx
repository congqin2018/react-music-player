import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import MoreVert from '@material-ui/icons/MoreVert';
import MusicNote from '@material-ui/icons/MusicNote';

const SearchItem = ({ item, handleClick }) => (
  <ListItem className="song" onClick={handleClick}>
    <ListItemText
      primary={item.name}
      secondary={`${item.artists[0].name} - ${item.album.name}`} 
      secondaryTypographyProps={{noWrap: true}}
    />
  </ListItem>
);

SearchItem.propTypes = {
  item: PropTypes.objectOf(PropTypes.any).isRequired,
  handleClick: PropTypes.func.isRequired,
};
export default SearchItem;
