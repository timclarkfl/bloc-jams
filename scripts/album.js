var createSongRow = function(songNumber, songName, songLength) {
	var template = '<tr class="album-view-song-item">' + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' + '  <td class="song-item-title">' + songName + '</td>' + '  <td class="song-item-duration">' + songLength + '</td>' + '</tr>';
	var $row = $(template);

	var clickHandler = function() {

		var songNumber = parseInt($(this)
			.attr('data-song-number'));

		if (currentlyPlayingSongNumber !== null) {

			var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
			currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
			currentlyPlayingCell.html(currentlyPlayingSongNumber);
		}
		if (currentlyPlayingSongNumber !== songNumber) {
			
			setSong(songNumber);
			currentSoundFile.play();
			$(this).html(pauseButtonTemplate);
			currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
			updatePlayerBarSong();

		} else if (currentlyPlayingSongNumber === songNumber) {
			
      // Conditional statement that checks if the currentSoundFile is paused
      // Use Buzz's isPaused() method on currentSoundFile to check if the song is paused or not.
        if (currentSoundFile.isPaused()) {

        // Update the song's buttons to pause
        $(this).html(pauseButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPauseButton);

        // If song is paused, start playing the song again and revert the icon
        // in the song row and the player bar to the pause button.
        currentSoundFile.play();

        } else {

        // Update the song's buttons to play
        $(this).html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);

        // If song isn't paused, pause the song and set the content
        // of the song number cell and player bar's pause button back to the play button.
        currentSoundFile.pause();

      }

    }

  };

	var onHover = function(event) {
        var songNumberCell = $(this)
            .find('.song-item-number');
        var songNumber = parseInt(songNumberCell
            .attr('data-song-number'));
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };

    var offHover = function(event) {
        var songNumberCell = $(this)
            .find('.song-item-number');
        var songNumber = parseInt(songNumberCell
            .attr('data-song-number'));
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }

        console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);

    };
	// #1
	$row.find('.song-item-number')
		.click(clickHandler);
	// #2
	$row.hover(onHover, offHover);
	// #3
	return $row;
};

var setCurrentAlbum = function(album) {
	currentAlbum = album;
	var $albumTitle = $('.album-view-title');
	var $albumArtist = $('.album-view-artist');
	var $albumReleaseInfo = $('.album-view-release-info');
	var $albumImage = $('.album-cover-art');
	var $albumSongList = $('.album-view-song-list');
	// #2
	$albumTitle.text(album.title);
	$albumArtist.text(album.artist);
	$albumReleaseInfo.text(album.year + ' ' + album.label);
	$albumImage.attr('src', album.albumArtUrl);
	// #3
	$albumSongList.empty();
	for (var i = 0; i < album.songs.length; i++) {
		var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
		$albumSongList.append($newRow);
	}
};

var trackIndex = function(album, song) {
	return album.songs.indexOf(song);
};

var playButtonTemplate = '<a class ="album-song-button"><span class="ion-play"><span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var updatePlayerBarSong = function() {
	$('.currently-playing .song-name')
		.text(currentSongFromAlbum.name);
	$('.currently-playing .artist-name')
		.text(currentAlbum.artist);
	$('.currently-playing .artist-song-mobile')
		.text(currentAlbum.artist + ' - ' + currentSongFromAlbum.name);

	$('.main-controls .play-pause')
		.html(playerBarPauseButton);
};

// Play next song

var nextSong = function() {
	var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
	currentSongIndex++;

	if (currentSongIndex >= currentAlbum.songs.length) {
		currentSongIndex = 0;
	}

	var lastSongNumber = currentlyPlayingSongNumber;

	setSong(currentSongIndex + 1);
	currentSoundFile.play();
	updatePlayerBarSong();

	var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
	var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

	$nextSongNumberCell.html(pauseButtonTemplate);
	$lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
	var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
	// Note that we're _decrementing_ the index here
	currentSongIndex--;

	if (currentSongIndex < 0) {
		currentSongIndex = currentAlbum.songs.length - 1;
	}

	// Save the last song number before changing it
	var lastSongNumber = currentlyPlayingSongNumber;

	// Set a new current song
	setSong(currentSongIndex + 1);
	currentSoundFile.play();
	updatePlayerBarSong();

	$('.main-controls .play-pause')
		.html(playerBarPauseButton);

	var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
	var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

	$previousSongNumberCell.html(pauseButtonTemplate);
	$lastSongNumberCell.html(lastSongNumber);
};

var setSong = function(songNumber) {
    if (currentSoundFile) {
         currentSoundFile.stop();
     }
 
	currentlyPlayingSongNumber = parseInt(songNumber);
	currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
	     // #1
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         // #2
         formats: [ 'mp3' ],
         preload: true
     });
	
     setVolume(currentVolume);
 };
 
 var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
};

var getSongNumberCell = function(number) {
	return $('.song-item-number[data-song-number="' + number + '"]');
	
}

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document)
	.ready(function() {
		setCurrentAlbum(albumPicasso);
		$previousButton.click(previousSong);
		$nextButton.click(nextSong);
	});
