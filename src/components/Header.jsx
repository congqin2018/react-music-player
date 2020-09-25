import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';

import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

import MenuIcon from '@material-ui/icons/Menu';
import NowPlayingIcon from '@material-ui/icons/PlaylistPlay';
import PlayListIcon from '@material-ui/icons/List';
import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';
import { createStyles, makeStyles, withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';

import {
  SEARCH_PAGE, HOME_PAGE, SETTINGS_PAGE, NOW_PLAYING_PAGE, PLAYLIST_PAGE,
} from '../actions';

const styles = theme => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    }
  },
  search: {
    display: 'flex',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto',
    },
  },
  // searchIcon: {
  //   position: 'absolute',
  //   // height: 40,
  //   // width: 40,
  //   height: '100%',
  //   right: 0,
  // },
  inputInput: {
    flexGrow: 1,
    color: 'inherit',
  }
});

const styless = theme => ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
});

const mapDispatchToProps = dispatch => ({
  openPage: type => dispatch({ type }),
});

const menuOptions = [
  {
    option: 'Search',
    page: SEARCH_PAGE,
    icon: <SearchIcon />,
  },
  // {
  //   option: 'Home',
  //   page: HOME_PAGE,
  //   icon: <HomeIcon />,
  // },
  {
    option: 'NowPlaying',
    page: NOW_PLAYING_PAGE,
    icon: <NowPlayingIcon />,
  },
  {
    option: 'Playlists',
    page: PLAYLIST_PAGE,
    icon: <PlayListIcon />,
  },
  {
    option: 'Settings',
    page: SETTINGS_PAGE,
    icon: <SettingsIcon />,
  },
];

class Header extends Component {
  
  constructor(props) {
    super(props);
    const { classes } = props;
    this.classes = classes;
    // this.classes = useStyles();
    this.state = {keyword : ''}
  }

  state = {
    open: false,
  };

  openPage = page => () => {
    const { openPage, playState, openSnackbar } = this.props;
    this.setState(prevState => ({ open: !prevState.open }));
    if (page === SETTINGS_PAGE) {
      openSnackbar();
      return;
    }
    // Don't Open now playing page when there is no song
    if (!playState && page === NOW_PLAYING_PAGE) return;
    if (page) openPage(page);
  }

  handleSearchClick = () => {
    const { onSearch } = this.props;
    onSearch(this.state.keyword);
  }

  handleInputChange = (e) => {
    this.setState({keyword: e.target.value });
  }

  render() {
    const { open } = this.state;

    return (
      <div>
        <AppBar>
          <Toolbar>
            <IconButton onClick={this.openPage()} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={this.classes.title}>
              Music Player
            </Typography>
            <div className={this.classes.grow} />
            <div className={this.classes.search}>
              <InputBase placeholder="Search…" className={this.classes.inputInput} onChange={this.handleInputChange}/>
              <IconButton color="inherit" className={this.classes.searchIcon} onClick={this.handleSearchClick} >
                <SearchIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <div className="header-padding" style={{ height: '55px' }} />
        <SwipeableDrawer anchor="left" open={open} onClose={this.openPage()} onOpen={this.openPage()}>
          <div style={{ paddingTop: '50px' }} />
          {
            menuOptions.map(option => (
              <ListItem key={option.option} button onClick={this.openPage(option.page)}>
                <ListItemIcon>{option.icon}</ListItemIcon>
                <ListItemText>{option.option}</ListItemText>
              </ListItem>
            ))
          }
        </SwipeableDrawer>
      </div>
    );
  }
}

Header.propTypes = {
  openPage: propTypes.func.isRequired,
  playState: propTypes.objectOf(propTypes.any).isRequired,
  openSnackbar: propTypes.func.isRequired,
  onSearch: propTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(withStyles(styles)(Header));
// export default connect(null, mapDispatchToProps)(Header);
