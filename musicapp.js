//Database for songs. Schema is {artist: [artist name], song: [song name], youtubeID: [YouTube ID]}
Songs = new Meteor.Collection('songs'); 


if (Meteor.isClient) {
  Meteor.startup(function () {
    Deps.autorun(function () {
      if (! Session.get("youID")) {
        var song = Songs.findOne({}, {sort: {artist: 1, song: 1}});
        if (song) {
          selectSong(song);
        }
      }
    });
  });

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
  });
  

  //Playlist Bar
  Template.songs.songs = function () {
    return Songs.find({}, {sort: {artist: 1, song: 1}});
  };

  Template.song.songSelected = function () {
    return Session.equals("sessionColor", this._id) ? "selected" : "";
  };

  Template.song.togglePlay = function() {
    return Session.equals("togglePlay", this._id) ? "icon-play-circle" : "";
  }
  
  Template.youtube.youtubeID = function () {
    return Session.get("youID")
  };

  Template.songControls.error = function() {
    return Session.get("error");
  };


  //Song Controls
  function selectSong(song){
     Session.set("togglePlay", song._id);
     Session.set('sessionColor', song._id);
     Session.set('youID', song.youtubeID); 
  };

  var nowPlaying = function () {
    return Songs.findOne({youtubeID: Session.get("youID")});
  };


  var clearSong = function () {
      $('input').val('');
  };

  Template.songControls.nowPlaying = function() {
    return nowPlaying();
  };


  //Validate song entry
  Validation = {
    clear: function() {
      return Session.set("error", undefined);
    },
    setError: function (message) {
      return Session.set("error", message);
    },
    validEntry: function (entry) {
      this.clear();
      if (entry.length == 0) {
        this.setError("Cant be blank");
        return false;
      } else {
        return true;
      }
    }
  };

  
  
  var parseYoutube = function (url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match&&match[2].length==11){
      return match[2];
    } else {
      // TODO: add an error function
    }
  };

  //Playlist Events
  Template.song.events = {
    //When you click on a song in the list, it loads the song into the youtube window.
    'click .song': function() {
      selectSong(this); 
    },
 
    'click .delete_song': function() {
      Songs.remove(this._id);
      
    }
  };

  // Song Controls Events
  Template.songControls.events = {

    
    'click .next_song': function () {
      // TODO: Add a function to select the next song.
    },

    'click .prev_song': function () {
      // TODO: Add a function to select the previous song.
    },

    'click .icon-angle-up': function() {
      $(".add_song").slideUp();
      $(".icon-angle-down").show();
      $(".icon-angle-up").hide();
    },

    'click .icon-angle-down': function() {
      $(".add_song").slideDown();
      $(".icon-angle-down").hide();
      $(".icon-angle-up").show();
    },
    //add the song
    'click button#addsong': function () {
      var artist = document.getElementById("artistName").value.trim();
      var song = document.getElementById("songName").value.trim();
      var youtube = document.getElementById("youtubeID").value.trim();
      var youtubeID = parseYoutube(youtube);

      if (Validation.validEntry(artist) && Validation.validEntry(song) && Validation.validEntry(youtubeID)) {
        Songs.insert({artist: artist, song: song, youtubeID: youtubeID});
        clearSong();
      }
      
    },

    'click button#cancelSong': function () {
      clearSong();
    }
  };

  

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
