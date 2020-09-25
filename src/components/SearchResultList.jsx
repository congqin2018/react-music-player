import React, { useState } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { removeSong, fetchDetailAndPlay } from '../actions';
import Song from './Song';
import SearchItem from './SearchItem';


const SearchResultList = ({ searchResult, play }) => {

    const handleSongClick = ind => () => play(searchResult[ind]);
    if (!searchResult.length) {
        return (
            <h4 style={{ fontWeight: 300, textAlign: 'center' }}>No songs. Please search Songs</h4>
        )
    }
    return (
        <div style={{ marginBottom: '100px' }}>
            <List>
                {
                    searchResult.map((item, ind) => (
                        [
                            <SearchItem
                                key={`search-item-${item.id}`}
                                handleClick={handleSongClick(ind)}
                                item={item}
                            />,
                            <Divider key={`divider-${item.id}`} />
                        ]
                    ))
                }
            </List>
        </div>
    )
}


SearchResultList.propTypes = {
  play: PropTypes.func.isRequired,
  searchResult: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
};

export default connect(null, {play: fetchDetailAndPlay })(SearchResultList);


// const SongList = ({ songs, remove, play }) => {
//   const [anchorEl, setAnchorEl] = useState(null);

//   const [activeSong, setActiveSong] = useState(-1);

//   const setActiveSongItem = ind => ({ target }) => {
//     setAnchorEl(target);
//     setActiveSong(ind);
//   };

//   const handleSongClick = ind => () => play(ind);

//   return (
//     <div style={{ marginBottom: '100px' }}>

//       <List>
//         {
//           songs.map((song, ind) => (
//             [
//               <Song
//                 key={`song-${song.lastModifiedDate}`}
//                 handleClick={handleSongClick(ind)}
//                 handleIconClick={setActiveSongItem(ind)}
//                 song={song}
//               />,
//               <Divider key={`divider-${song.lastModifiedDate}`} />,
//             ]
//           ))
//         }
//       </List>
//     </div>
//   );
// };


