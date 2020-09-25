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

const Song = ({ song, handleClick, handleIconClick }) => (
  <ListItem className="song" onClick={handleClick}>
    <ListItemAvatar>
      <Avatar>
        <MusicNote />
      </Avatar>
    </ListItemAvatar>
    <ListItemText
      primary={song.detail.name}
      secondary={song.source=='network' ? `${song.detail.artists[0].name} - ${song.detail.album.name}`:'local'}
      secondaryTypographyProps={{noWrap: true}}
    />
    <ListItemSecondaryAction onClick={handleIconClick}>
      <IconButton aria-label="Delete">
        <MoreVert />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);
// secondary={`${item.artists[0].name} - ${item.album.name}`} 
//       secondaryTypographyProps={{noWrap: true}}

Song.propTypes = {
  song: PropTypes.objectOf(PropTypes.any).isRequired,
  handleClick: PropTypes.func.isRequired,
  handleIconClick: PropTypes.func.isRequired,
};
export default Song;
