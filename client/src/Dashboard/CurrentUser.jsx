import React, {Component} from 'react';

import UserMatchSidebar from './UserMatchSidebar.jsx';
import UserProfile from './UserProfile.jsx';
import UserBoxAnalytics from './UserBoxAnalytics.jsx';

import BarChart from '../Charts/_Bar.jsx'


import TopArtistInsight from '../Insights/_TopArtist.jsx'
import { parse } from 'query-string'
// import compatibilityFunctions from '../../../user-compatibility.js'



class CurrentUser extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chartData: null,
      chartDataRaw: null,

      insightData: 'Click bar on chart for more info!',
      topTracks:[],
      topArtists:[],
      userAudioTrackFeatures: {},
      compatibleUsers: []
    }

    this.getUserTrackAudioFeatures = (topTracks) => {
      let danceability = 0
      let energy = 0
      let key = 0
      let loudness = 0
      let mode = 0
      let speechiness = 0
      let acousticness = 0
      let instrumentalness = 0
      let liveness = 0
      let valence = 0
      let tempo = 0

      for (let track in topTracks) {
        danceability += topTracks[track].danceability
        energy += topTracks[track].energy
        key += topTracks[track].key
        loudness += topTracks[track].loudness
        mode += topTracks[track].mode
        speechiness += topTracks[track].speechiness
        acousticness += topTracks[track].acousticness
        instrumentalness += topTracks[track].instrumentalness
        liveness += topTracks[track].liveness
        valence += topTracks[track].valence
        tempo += topTracks[track].tempo
      }

      key = Math.round(key/topTracks.length)
      mode = Math.round(mode/topTracks.length)

      let musicalKeys = {
        1: 'C',
        2: 'C#/Db',
        3: 'D',
        4: 'D#/Eb',
        5: 'E',
        6: 'F',
        7: 'F#/Gb',
        8: 'G',
        9: 'G#/Ab',
        10: 'A',
        11: 'A#/Bb',
        12: 'B'
      }

      let keyString = ''

      for (let musicalKey in musicalKeys) {
        if (musicalKey == key) {
          keyString = musicalKeys[musicalKey]
        }
      }

      let modeString = ''

      if (mode == 1) {
        modeString = 'Maj'
      } else {
        modeString = 'Min'
      }


      let userAudioTrackFeaturesAverages = {
        danceability: danceability/topTracks.length,
        energy: energy/topTracks.length,
        key: keyString,
        loudness: Number(Math.round((loudness/topTracks.length)+'e2')+'e-2'),
        mode: modeString,
        speechiness: speechiness/topTracks.length,
        acousticness: acousticness/topTracks.length,
        instrumentalness: instrumentalness/topTracks.length,
        liveness: liveness/topTracks.length,
        valence: valence/topTracks.length,
        tempo: Number(Math.round((tempo/topTracks.length)+'e2')+'e-2')
      }
      return userAudioTrackFeaturesAverages
    }
    const getUniqueUserGenres = function(user1artists) {
      let uniqueGenres = []
      for (let i = 0; i < user1artists.length; i++) {
        for (let j = 0; j < user1artists[i].genres.genres_array.length; j++) {
          if (uniqueGenres.indexOf(user1artists[i].genres.genres_array[j]) === -1) {
            uniqueGenres.push(user1artists[i].genres.genres_array[j])
          }
        }
      }
      return uniqueGenres
    }

    const userCompatibilityFunction = function(currentUserTopTracks, currentUserTopArtists, currentUserAudioTrackFeatures, otherUserComparisonData) {
      let userComparison = {
        id: otherUserComparisonData.userID,
        percentMatch: null
      }

      let user2artists = otherUserComparisonData.topArtists
      let user2tracks = otherUserComparisonData.topTracks
      let user2AudioTrackFeatures = otherUserComparisonData.userTrackAudioFeatures


      let matchesArr = []
      let percentMatch = 0
      let trackMatch = 0.05
      let trackMatches = 0
      let artistMatch = 0.05
      let artistMatches = 0
      let genreMatch = 0.85
      let genreMatches = 0
      // let audioFeaturesMatch = 0
      // let audioFeaturesMatches = 0

      let trackPercentileIncrease = 1/((currentUserTopTracks.length + user2tracks.length) / 2)

      for (let i in currentUserTopTracks) {
        for (let j in user2tracks) {
          if (currentUserTopTracks[i].track_name === user2tracks[j].track_name) {
            // console.log(user2tracks.items[j].name)
            trackMatches += trackPercentileIncrease
            break;
            // console.log(trackMatches)
          }
        }
      }

      // console.log(trackMatch*trackMatches)
      let artistPercentileIncrease = 1/((currentUserTopArtists.length + user2artists.length) / 2)

      for (let i = 0; i < currentUserTopArtists.length; i++) {
        for (let j = 0; j < user2artists.length; j++) {
          if (currentUserTopArtists[i].artist_name === user2artists[j].artist_name) {
            // console.log(user2artists.items[j].name)
            artistMatches += artistPercentileIncrease
            // console.log(artistMatches)
          }
        }
      }
      // console.log(artistMatches)

      let user1genres = getUniqueUserGenres(currentUserTopArtists)
      let user2genres = getUniqueUserGenres(user2artists)

      // console.log(user1genres.length)
      // console.log(user2genres.length)



      let genrePercentileIncrease = 1/((user1genres.length + user2genres.length) / 2)
      // console.log(genrePercentileIncrease)

      for (let i = 0; i < user1genres.length; i++) {
        for (let j = 0; j < user2genres.length; j++) {
          if (user1genres[i] === user2genres[j]) {
            // console.log(user2genres[j])
            genreMatches += genrePercentileIncrease
          }
        }
      }

      // console.log(trackMatches*trackMatch)
      // if (trackMatches < 0.2) {
      //   trackMatch = 0.2
      //   artistMatch = 0.2
      //   genreMatch = 0.3
      // }
      // if (artistMatches < 0.2 && trackMatches < 0.2) {
      //   trackMatch = 0.025
      //   artistMatch = 0.025
      //   genreMatch = 0.85
      // }
      // console.log(genreMatch)
      // console.log(`Track matches: ${trackMatches}`)
      // console.log(`Artist Matches: ${artistMatches}`)
      matchesArr.push(trackMatch*trackMatches)
      matchesArr.push(artistMatch*artistMatches)
      matchesArr.push(genreMatch*genreMatches)

      // console.log(user1AudioTrackFeatures)
      // console.log(user2AudioTrackFeatures)

      if (currentUserAudioTrackFeatures.danceability - user2AudioTrackFeatures.danceability < 0.05 && currentUserAudioTrackFeatures.danceability - user2AudioTrackFeatures.danceability > -0.05 ) {
        percentMatch += 0.05
      }

      if (currentUserAudioTrackFeatures.energy - user2AudioTrackFeatures.energy < 0.05 && currentUserAudioTrackFeatures.energy - user2AudioTrackFeatures.energy > -0.05 ) {
        percentMatch += 0.05
      }

      if (currentUserAudioTrackFeatures.key - user2AudioTrackFeatures.key < 1 && currentUserAudioTrackFeatures.key - user2AudioTrackFeatures.key > -1
        && currentUserAudioTrackFeatures.mode - user2AudioTrackFeatures.mode < 0.5 && currentUserAudioTrackFeatures.mode - user2AudioTrackFeatures.mode > -0.5 ) {
        percentMatch += 0.05
      }

      if (currentUserAudioTrackFeatures.loudness - user2AudioTrackFeatures.loudness < 3 && currentUserAudioTrackFeatures.loudness - user2AudioTrackFeatures.loudness > -3 ) {
        percentMatch += 0.05
      }

      if (currentUserAudioTrackFeatures.speechiness - user2AudioTrackFeatures.speechiness < 0.05 && currentUserAudioTrackFeatures.speechiness - user2AudioTrackFeatures.speechiness > -0.05 ) {
        percentMatch += 0.05
      }

      if (currentUserAudioTrackFeatures.acousticness - user2AudioTrackFeatures.acousticness < 0.05 && currentUserAudioTrackFeatures.acousticness - user2AudioTrackFeatures.acousticness > -0.05 ) {
        percentMatch += 0.05
      }

      if (currentUserAudioTrackFeatures.instrumentalness - user2AudioTrackFeatures.instrumentalness < 0.1 && currentUserAudioTrackFeatures.instrumentalness - user2AudioTrackFeatures.instrumentalness > -0.1 ) {
        percentMatch += 0.05
      }

      if (currentUserAudioTrackFeatures.liveness - user2AudioTrackFeatures.liveness < 0.05 && currentUserAudioTrackFeatures.liveness - user2AudioTrackFeatures.liveness > -0.05 ) {
        percentMatch += 0.05
      }

      if (currentUserAudioTrackFeatures.valence - user2AudioTrackFeatures.valence < 0.1 && currentUserAudioTrackFeatures.valence - user2AudioTrackFeatures.valence > -0.1 ) {
        percentMatch += 0.05
      }

      if (currentUserAudioTrackFeatures.tempo - user2AudioTrackFeatures.tempo < 10 && currentUserAudioTrackFeatures.tempo - user2AudioTrackFeatures.tempo > -10 ) {
        percentMatch += 0.05
      }

      // console.log(`Audio Parameter Percent Increase: ${percentMatch}`)
      // console.log(matchesArr)

      matchesArr.map((match) => {
        return percentMatch += match
      })

      if (percentMatch > 1) {
        percentMatch = 1
      }
      userComparison.percentMatch = Math.round(percentMatch*100)

      return userComparison
    }

    this.userCompatibility = () => {
      function findUserIndex(arr, uid) {
        for(let idx in arr) {
          // console.log(arr[idx].id)
          if(arr[idx].id === uid) { return idx; }
        }
        throw "should never get here";
      }

      for (let user in this.props.allUsers) {
        let idx = findUserIndex(this.state.allUsersComparisonData, this.props.allUsers[user].id);
        this.getUserTopTracks(this.props.allUsers[user].id)
          .then(userComparisonData => {
            let comparedUsers = this.state.allUsersCompared
            comparedUsers.push(userCompatibilityFunction(this.state.topTracks, this.state.topArtists, this.state.userAudioTrackFeatures, userComparisonData))
            this.setState({allUsersCompared: comparedUsers})

          })

      }
    }
  }

  componentWillMount(){



    if (!this.props.currentLocal) {
      // console.log('Please stand by while we get that thing that you need.')
    } else {
    this.setState({allUsersComparisonData: this.props.allUsers.map(u => ({id: u.id}))})
    this.setCurrentUserTopAbsArtists(),
    this.setCurrentUserTopTracks().then(()=> {
      return this.userCompatibility()

    })


    }
  }

  // CURRENT USER
  setCurrentUserTopTracks = () => {
    return $.get('http://localhost:3000/users/getUserTopTracks/'+this.props.currentLocal.id)
    .done( topTrackIDs => {

      let artistIDs = [];
      let artist_track = [];
      let artistByTrack;
      for (let i = 0; i < topTrackIDs.length; i++) {

// GET TRACK DETAILS BY TRACK_ID
        $.get('http://localhost:3000/tracks/getTrackByID/'+topTrackIDs[i].id)
        .done( result => {
          let currentUserTopTracks = this.state.topTracks;
          currentUserTopTracks.push(result);
          this.setState({ topTracks: currentUserTopTracks });
          this.setState({userAudioTrackFeatures: this.getUserTrackAudioFeatures(this.state.topTracks)})
        })
        .fail( err => {
          console.error(err);
        })

// GET ARTIST_ID BY TRACK_ID
        artistByTrack = $.get('http://localhost:3000/tracks/getArtistFromTrack/'+topTrackIDs[i].id)
        .done( result => {
          artistIDs.push(result.id);
          artist_track.push([result.id, topTrackIDs[i].id])
        })
        .fail( err => {
          console.error(err);
        })
      }

      $.when(artistByTrack).done( () => {
        let chartDetails = this.sortArtists(artist_track);
        // console.log(chartDetails);
        this.setChartDataRaw(chartDetails);
        // console.log(this.state.chartDataRaw)

      });

    })
    .fail( err => {
      console.error(err);
    });
  }

/* artist detail fetching, associated track fetching, setting */
  setChartDataRaw(highLevelDetails) {

    return new Promise( (resolve, reject) => {

    let chartData = {
        labels: [],
        datasets: [{
          label: 'Tracks',
          data: []
        }]
      };

    let chartDataRaw = [];

      for (let i = 0; i < highLevelDetails.length; i++) {
        let artistID = highLevelDetails[i][0];
        let setArtist = $.get('http://localhost:3000/artists/getArtistByID/'+ artistID)
            .done( result => {

              // let chartData = this.state.chartData;
              if(result.artist_name.length > 15) {
                chartData['labels'].push(result.artist_name.slice(0,15)+'...')
              } else {
                chartData['labels'].push(result.artist_name)
              }
              chartData['datasets'][0]['data'].push(highLevelDetails[i][1].length)
              // this.setState({chartData});

              // let chartDataRaw = this.state.chartDataRaw;
              chartDataRaw.push({artist: result, tracks: []})
              // this.setState({chartDataRaw});
            })
            .fail( err => {
              console.error(err);
            })

        $.when(setArtist).done( () => {
          for (let j = 0; j < highLevelDetails[i][1].length; j++) {
            // console.log(`artist ${highLevelDetails[i][0]} performs track ${highLevelDetails[i][1][j]}`)
            let trackID = highLevelDetails[i][1][j];
            $.get('http://localhost:3000/tracks/getTrackByID/'+trackID)
            .done( result => {
              // let chartDataRaw = this.state.chartDataRaw;
              chartDataRaw[i]['tracks'].push(result);
              // this.setState({chartDataRaw});
            })
          }
        })
      }
      setTimeout(() => resolve([chartData, chartDataRaw]), 100);
      // resolve([chartData, chartDataRaw]);

    })
    .then( result => {
      this.setState({chartData: result[0]})
      this.setState({chartDataRaw: result[1]})
    })


  }

/* artist sorting, filtering, and top five-ing */
  sortArtists(artist_track) {
    let sorted = artist_track.sort();
    let tally = [];
    let count = 1;

    for (let i = 0; i < sorted.length; i++) {
      let artist = [sorted[i][0], count];
      if (sorted[i+1] === undefined) {
        break;
      } else if (sorted[i][0] === sorted[i+1][0]) {
        count++;
      } else {
        tally.push(artist)
        count = 1;
      }
    }

    tally.sort( (a,b) => {
      return b[1] - a[1];
    });

    tally.splice(5);

    let finalTally = [];

    for (let i = 0; i < tally.length; i++) {
      finalTally.push([tally[i][0], []])
    }

    for (let i = 0; i < sorted.length; i++) {
      for (let j = 0; j < finalTally.length; j++) {
        if (sorted[i][0] === finalTally[j][0]) {
          finalTally[j][1].push(sorted[i][1]);
        }
      }
    }

    return finalTally;
  }


  setCurrentUserTopAbsArtists = () => {
    return $.get('http://localhost:3000/users/getUserTopAbsArtists/' + this.props.currentLocal.id)
    .done(absArtistIDs => {
      // console.log(absArtistIDs)
      for(let i = 0; i < absArtistIDs.length; i++) {
        $.get('http://localhost:3000/absArtists/getAbsArtistByID/' + absArtistIDs[i].id)
        .done(artist => {
          let topArtists = this.state.topArtists
          topArtists.push(artist)
          this.setState({topArtists})
        })
        .fail(err => {
          console.error(err)
        })
      }
    })
    .fail(err => {
      console.error(err)
    })
  }


  //ALL OTHER USERS ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  getUserTopTracks(id){
    return new Promise((res, rej) => {
    let userInfo = {
      userID: id,
      topTracks: null,
      topArtists:null,
      userTrackAudioFeatures: null
    }
      $.get('http://localhost:3000/users/getUserTopFullTracks/'+ id)
      .done( topTracks => {
        userInfo.topTracks = topTracks
        userInfo.userTrackAudioFeatures = this.getUserTrackAudioFeatures(topTracks)
        $.get('http://localhost:3000/users/getUserTopFullAbsArtists/' + id)
        .done(absArtists => {
          userInfo.topArtists = absArtists
          res(userInfo)
        })
      })
    })
  }

  // getUserTopAbsArtists(id) {
  //   return $.get('http://localhost:3000/users/getUserTopFullAbsArtists/' + id)
  //   .done(absArtists => {
  //     console.log(absArtists)
  //   })
  // }


  handleClickElement = (event) => {
    if (event[0]) {
      let index = event[0]['_index'];
      let label = this.state.chartDataRaw[index]['artist']['artist_name'];
      let insightData = `INDEX: ${index} => ${label}`;

      this.setState({ insightData: insightData });
    }
  }

  render (){

    let user_img = '#'
    let user_name = null;

    if(!this.props.currentLocal) {
      // console.log('Please wait.');
    } else {
      user_img = this.props.currentLocal.image_urls.image;
      user_name = this.props.currentLocal.display_name
    }

    let title = 'Loading Your Top Artist Data...'
    let data = {
      labels: ['LOADING','YOUR','TOP','ARTIST','DATA'],
        datasets:[{ label:'Loading...',
        data:[
          Math.random(),
          Math.random(),
          Math.random(),
          Math.random(),
          Math.random()
        ]
      }]
    };

    if(this.state.chartData) {
      data = this.state.chartData
      title = 'Your Top Artists'
    }


    return(
      <div>

        <UserProfile
        user_img = {user_img}
        user_name = {user_name}
        />

        <div className='row'>
          <div className='col-md-3'>
          </div>

          <div className='col-md-6 top-matches-text'>
            <h1 style={{color: 'white'}}>Your Top Musical Matches</h1>
          </div>

          <div className='col-md-3'>
          </div>
        </div>

          <UserMatchSidebar />

        <div className='row'>
          <div className='col-md-6'>
            <BarChart
                chartData={data}

                title={title}
                y_label=""
                x_label=""

                handleClick={ event => this.handleClickElement(event) }
              />
          </div>

          <div className='col-md-6'>
            <TopArtistInsight insightData={this.state.insightData}/>
          </div>
        </div>

        <UserBoxAnalytics userAudioTrackFeatures={this.state.userAudioTrackFeatures} />

      </div>
      )
  }
}

export default CurrentUser;