 // Example Album
 var albumPicasso = {
     title: 'The Colors',
     artist: 'Pablo Picasso',
     label: 'Cubism',
     year: '1881',
     albumArtUrl: 'assets/images/album_covers/01.png',
     songs: [
         { title: 'Blue', duration: '4:26' },
         { title: 'Green', duration: '3:14' },
         { title: 'Red', duration: '5:01' },
         { title: 'Pink', duration: '3:21'},
         { title: 'Magenta', duration: '2:15'}
     ]
 };
 
 // Another Example Album
 var albumMarconi = {
     title: 'The Telephone',
     artist: 'Guglielmo Marconi',
     label: 'EM',
     year: '1909',
     albumArtUrl: 'assets/images/album_covers/20.png',
     songs: [
         { title: 'Hello, Operator?', duration: '1:01' },
         { title: 'Ring, ring, ring', duration: '5:01' },
         { title: 'Fits in your pocket', duration: '3:21'},
         { title: 'Can you hear me now?', duration: '3:14' },
         { title: 'Wrong phone number', duration: '2:15'}
     ]
 };
 // Checkpoint 11 Assignment Album
 var albumCheckpoint = {
     title: 'My Face',
     artist: 'Some Random Chick',
     label: 'EM',
     year: '2017',
     albumArtUrl: 'assets/images/album_covers/21.png',
     songs: [
         { title: 'Aint it pretty?', duration: '4:35' },
         { title: 'And my sunglasses', duration: '5:24' },
         { title: 'IN a field', duration: '5:41'},
         { title: 'Where is the beach?', duration: '3:00' },
         { title: 'Wrong place..sorry', duration: '12:55'}
     ]
 };

var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     return template;
 };

 var setCurrentAlbum = function(album) {
     // #1
     var albumTitle = document.getElementsByClassName('album-view-title')[0];
     var albumArtist = document.getElementsByClassName('album-view-artist')[0];
     var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
     var albumImage = document.getElementsByClassName('album-cover-art')[0];
     var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
 
     // #2
     albumTitle.firstChild.nodeValue = album.title;
     albumArtist.firstChild.nodeValue = album.artist;
     albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
     albumImage.setAttribute('src', album.albumArtUrl);
 
     // #3
     albumSongList.innerHTML = '';
 
     // #4
     for (var i = 0; i < album.songs.length; i++) {
         albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
     }
 };
 
    var songListContainer = document.getElementsByClassName('album-view-song-list')[0];

	varplayButtonTemplate = '<a class ="album-song-button"><span class="ion-play"><span></a>';

    window.onload = function() {
     setCurrentAlbum(albumPicasso);

     songListContainer.addEventListener('mouseover', function(event) {
       
        if (event.target.parentElement.className === 'album-view-song-item') {
			
             event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
         }
     });
		 for (var i = 0; i < songRows.length; i++) {
         songRows[i].addEventListener('mouseleave', function(event) {
             // change back to the number
			 this.children[0].innerHTML = this.children[0].getAttribute('data-song-number');
         });
     }
	 
	var albumArray = [albumPicasso, albumMarconi, albumCheckpoint];
	var albumToggle = document.getElementsByClassName('album-cover-art')[0];
	var index = 1;

	albumToggle.addEventListener('click', function() {
	  setCurrentAlbum(albumArray[index]);
	  index++;
	  if (index === albumArray.length) {
		index = 0;
	  }
	});
 }