import React, {Component} from 'react';
import Song from './Song.jsx';


class Songs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      songs: []
    }
  }

  componentDidMount() {
    let accessToken = this.props.accessToken
      fetch (this.props.playlist.tracks.href, {
      headers: {
        Authorization: "Bearer " + accessToken
      }
    })
      .then((response) => {
        if(response.status >= 400){

        }
        return response.json()
      })
      .then((data) => {
        this.setState({ songs: data.items})
      })

  }

  render() {
    let renderSongs = this.state.songs.map((song, index)=>{
        return <Song song = {song} key = {index}/>
      })

    return (
      <div>
        <hr/>
        <table className="table table-bordered tester">
            <thead><tr>
              <th className="col-sm-1 col-xs-6">Album Art</th>
              <th className="col-sm-4 col-xs-6">Track Name</th>
              <th className="col-sm-4 hidden-xs">Track Artist</th>
              <th className="col-sm-3 hidden-xs">Track Album</th>
            </tr></thead>
            <tbody>
              {renderSongs}
            </tbody>
          </table>
        </div>
      )
  }
}


export default Songs