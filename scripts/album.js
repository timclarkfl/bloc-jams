  //checkpoint album
  var albumCheckpoint = {
  	title: 'best album',
  	artist: 'Not Taylor Swift',
  	label: 'EM',
  	year: '1988',
  	albumArtUrl: 'assets/images/album_covers/21.png',
  	songs: [ {
  		title: 'Beat it',
  		duration: '1:01'
  	}, {
  		title: 'Black and White',
  		duration: '5:01'
  	}, {
  		title: 'Heal the world',
  		duration: '3:21'
  	}, {
  		title: 'Not Alone',
  		duration: '3:14'
  	}, {
  		title: 'PYT',
  		duration: '2:15'
  	} ]
  };

  var createSongRow = function( songNumber, songName, songLength ) {
  	var template = '<tr class="album-view-song-item">' + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' + '  <td class="song-item-title">' + songName + '</td>' + '  <td class="song-item-duration">' + songLength + '</td>' + '</tr>';
  	var $row = $( template );

  	var clickHandler = function() {

  		var songNumber = parseInt( $( this ).attr( 'data-song-number' ) );

  		if ( currentlyPlayingSongNumber !== null ) {

  			var currentlyPlayingCell = $( '.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]' );
  			currentlyPlayingCell.html( currentlyPlayingSongNumber );
  		}
  		if ( currentlyPlayingSongNumber !== songNumber ) {

  			$( this ).html( pauseButtonTemplate );
  			currentlyPlayingSongNumber = songNumber;
  			currentSongFromAlbum = currentAlbum.songs[ songNumber - 1 ];

  		} else if ( currentlyPlayingSongNumber === songNumber ) {

  			$( this ).html( playButtonTemplate );

  			currentlyPlayingSongNumber = null;
  			currentSongFromAlbum = null;
  		}
  	};

  	var onHover = function( event ) {
  		var songNumberCell = $( this ).find( '.song-item-number' );
  		var songNumber = parseInt( $( this ).attr( 'data-song-number' ) );
  		if ( songNumber !== currentlyPlayingSong ) {
  			songNumberCell.html( playButtonTemplate );
  		}
  	};

  	var offHover = function( event ) {
  		var songNumberCell = $( this ).find( '.song-item-number' );
  		var songNumber = parseInt( $( this ).attr( 'data-song-number' ) );
  		if ( songNumber !== currentlyPlayingSong ) {
  			songNumberCell.html( songNumber );
  		}

  		console.log( "songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber );

  	};
  	// #1
  	$row.find( '.song-item-number' ).click( clickHandler );
  	// #2
  	$row.hover( onHover, offHover );
  	// #3
  	return $row;
  };

  var setCurrentAlbum = function( album ) {
  	currentAlbum = album;
  	var $albumTitle = $( '.album-view-title' );
  	var $albumArtist = $( '.album-view-artist' );
  	var $albumReleaseInfo = $( '.album-view-release-info' );
  	var $albumImage = $( '.album-cover-art' );
  	var $albumSongList = $( '.album-view-song-list' );
  	// #2
  	$albumTitle.text( album.title );
  	$albumArtist.text( album.artist );
  	$albumReleaseInfo.text( album.year + ' ' + album.label );
  	$albumImage.attr( 'src', album.albumArtUrl );
  	// #3
  	$albumSongList.empty();
  	for ( var i = 0; i < album.songs.length; i++ ) {
  		var $newRow = createSongRow( i + 1, album.songs[ i ].title, album.songs[ i ].duration );
  		$albumSongList.append( $newRow );
  	}
  };

  var trackIndex = function( album, song ) {
  	return album.songs.indexOf( song );
  };

  var playButtonTemplate = '<a class ="album-song-button"><span class="ion-play"><span></a>';
  var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

  var updatePlayerBarSong = function() {
  	$( '.currently-playing .song-name' ).text( currentSongFromAlbum.name );
  	$( '.currently-playing .artist-name' ).text( currentAlbum.artist );
  	$( '.currently-playing .artist-song-mobile' ).text( currentAlbum.artist + ' - ' + currentSongFromAlbum.name );

  	$( '.main-controls .play-pause' ).html( playerBarPauseButton );
  };

  // Play next song

  var nextSong = function() {
  	var currentSongIndex = trackIndex( currentAlbum, currentSongFromAlbum );
  	var prevSongNumber = currentSongIndex + 1;

  	if ( currentSongIndex === currentAlbum.songs.length - 1 ) {
  		currentSongIndex = 0;
  	} else {
  		currentSongIndex++;
  	}

  	setSong( currentSongIndex + 1 );

  	$getSongNumberCell( prevSongNumber ).html( prevSongNumber );
  	$getSongNumberCell( currentlyPlayingSongNumber ).html( $pauseButtonTemplate );
  	updatePlayerBarSong();
  }

  var prevSong = function() {
  	var currentSongIndex = trackIndex( currentAlbum, currentSongFromAlbum );
  	var prevSongNumber = currentSongIndex + 1;

  	if ( currentSongIndex === 0 ) {
  		currentSongIndex = currentAlbum.songs.length - 1;
  	} else {
  		currentSongIndex--;
  	}

  	setSong( currentSongIndex + 1 );

  	$getSongNumberCell( prevSongNumber ).html( prevSongNumber );
  	$getSongNumberCell( currentlyPlayingSongNumber ).html( $pauseButtonTemplate );
  	updatePlayerBarSong();
  }

  // Store state of playing songs
  var currentAlbum = null;
  var currentlyPlayingSongNumber = null;
  var currentSongFromAlbum = null;

  var $previousButton = $( '.main-controls .previous' );
  var $nextButton = $( '.main-controls .next' );

  $( document ).ready( function() {
  	setCurrentAlbum( albumPicasso );
  	$previousButton.click( previousSong );
  	$nextButton.click( nextSong );
  } );

