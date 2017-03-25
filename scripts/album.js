var createSongRow = function(songNumber, songName, songLength) {
		var template = 
			'<tr class="album-view-song-item">' + 
			'<td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' +  
			'<td class="song-item-title">' + songName + '</td>' + 
			'<td class="song-item-duration">' + songLength + '</td>' +
			'</tr>';
        var $row = $(template);

        var clickHandler = function() {

            var songNumber = parseInt($(this).attr('data-song-number'));

            if (currentlyPlayingSongNumber !== null) {

                var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
                currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
                currentlyPlayingCell.html(currentlyPlayingSongNumber);
            }
            if (currentlyPlayingSongNumber !== songNumber) {

                setSong(songNumber);
                currentSoundFile.play();
                updateSeekBarWhileSongPlays();
                currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

                var $volumeFill = $('.volume .fill');
                var $volumeThumb = $('.volume .thumb');
                $volumeFill.width(currentVolume + '%');
                $volumeThumb.css({left: currentVolume + '%'});

                $(this).html(pauseButtonTemplate);
                updatePlayerBarSong();

                // If clicking the currently playing song, revert the currentlyPlayingSong to null
                // and display the play button
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
            var songNumberCell = $(this).find('.song-item-number');
            var songNumber = parseInt(songNumberCell.attr('data-song-number'));
            if (songNumber !== currentlyPlayingSongNumber) {
                songNumberCell.html(playButtonTemplate);
            }
        };

        var offHover = function(event) {
            var songNumberCell = $(this).find('.song-item-number');
            var songNumber = parseInt(songNumberCell.attr('data-song-number'));
            if (songNumber !== currentlyPlayingSongNumber) {
                songNumberCell.html(songNumber);
            }
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

        var updateSeekBarWhileSongPlays = function() {
            if (currentSoundFile) {
                // #10
                //connect timeupdate and currentSoundFile
                currentSoundFile.bind('timeupdate', function(event) {
                    // #11
                    //calculate current time of song and total length of song
                    var seekBarFillRatio = this.getTime() / this.getDuration();
                    var $seekBar = $('.seek-control .seek-bar');

                    updateSeekPercentage($seekBar, seekBarFillRatio);

                    setCurrentTimeInPlayerBar(this.getTime());
                    setTotalTimeInPlayerBar(this.getDuration());
                });
            }
        };

        var setCurrentTimeInPlayerBar = function(currentTime) {
            $('.current-time').text(filterTimeCode(currentTime));
        };

        var setTotalTimeInPlayerBar = function(totalTime) {
            $('.total-time').text(filterTimeCode(totalTime));
        };

        var filterTimeCode = function(timeInSeconds) {

            var timeInSecondsParsed = parseFloat(timeInSeconds);
            var minutes = Math.floor(timeInSecondsParsed / 60);
            var seconds = Math.floor(timeInSeconds - minutes * 60);

            return minutes + ':' + ('0' + seconds).slice(-2);

        };

        var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
            var offsetXPercent = seekBarFillRatio * 100;
            // #1
            offsetXPercent = Math.max(0, offsetXPercent);
            offsetXPercent = Math.min(100, offsetXPercent);

            // #2
            var percentageString = offsetXPercent + '%';
            $seekBar.find('.fill').width(percentageString);
            $seekBar.find('.thumb').css({
                left: percentageString
            });
        };

        var setupSeekBars = function() {
            var $seekBars = $('.player-bar .seek-bar');

            $seekBars.click(function(event) {
                // #3
                var offsetX = event.pageX - $(this).offset().left;
                var barWidth = $(this).width();
                // #4
                var seekBarFillRatio = offsetX / barWidth;

                if ($(this).parent().hasClass('seek-control')) {

                    // Skip to the seekbar percent in the song
                    seek(seekBarFillRatio * currentSoundFile.getDuration());

                } else {

                    // Set the volume based on the seek bar position
                    setVolume(seekBarFillRatio * 100);
                }

                // #5
                updateSeekPercentage($(this), seekBarFillRatio);
            });
            // #7
            $seekBars.find('.thumb').mousedown(function(event) {
                // #8
                var $seekBar = $(this).parent();

                // #9
                $(document).bind('mousemove.thumb', function(event) {
                    var offsetX = event.pageX - $seekBar.offset().left;
                    var barWidth = $seekBar.width();
                    var seekBarFillRatio = offsetX / barWidth;

                    if ($(this).parent().hasClass('seek-control')) {

                        // Skip to the seekbar percent in the song
                        seek(seekBarFillRatio * currentSoundFile.getDuration());
                    } else {

                        // Set the volume based on the seek bar position
                        setVolume(seekBarFillRatio);
                    }
                    updateSeekPercentage($seekBar, seekBarFillRatio);
                });

                // #10
                $(document).bind('mouseup.thumb', function() {
                    $(document).unbind('mousemove.thumb');
                    $(document).unbind('mouseup.thumb');
                });
            });
        };

        var trackIndex = function(album, song) {
            return album.songs.indexOf(song);
        };

        var playButtonTemplate = '<a class ="album-song-button"><span class="ion-play"><span></a>';
        var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
        var playerBarPlayButton = '<span class="ion-play"></span>';
        var playerBarPauseButton = '<span class="ion-pause"></span>';

        var updatePlayerBarSong = function() {
            $('.currently-playing .song-name').text(currentSongFromAlbum.name);
            $('.currently-playing .artist-name').text(currentAlbum.artist);
            $('.currently-playing .artist-song-mobile').text(currentAlbum.artist + ' - ' + currentSongFromAlbum.name);

            $('.main-controls .play-pause').html(playerBarPauseButton);
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
            updateSeekBarWhileSongPlays();
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
            updateSeekBarWhileSongPlays();
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
                formats: ['mp3'],
                preload: true
            });

            setVolume(currentVolume);
        };

        var seek = function(time) {
            if (currentSoundFile) {
                currentSoundFile.setTime(time);
            }
        };

        var setVolume = function(volume) {
            if (currentSoundFile) {
                currentSoundFile.setVolume(volume);
            }
        };

        var getSongNumberCell = function(number) {
            return $('.song-item-number[data-song-number="' + number + '"]');

        };

        var currentAlbum = null;
        var currentlyPlayingSongNumber = null;
        var currentSongFromAlbum = null;
        var currentSoundFile = null;
        var currentVolume = 80;
        var $previousButton = $('.main-controls .previous');
        var $nextButton = $('.main-controls .next');

        $(document).ready(function() {
            setCurrentAlbum(albumPicasso);
            setupSeekBars();
            $previousButton.click(previousSong);
            $nextButton.click(nextSong);
        });
