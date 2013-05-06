Songs = new Meteor.Collection('songs'); //Database for songs. Schema is {artist:, song:, youtubeID:}

if (Meteor.isClient) {
  var admin = function() {
    if (Meteor.user().emails[0].address == 'alex.guerrilla@gmail.com') {
      console.log("its me!");
      return true;
    } else {
      console.log("nope");
      return false;
    }
  };

  // Templates 
  Template.songs.songs = function () {
    return Songs.find({}, {sort: {artist: 1, song: 1}});
  };

  Template.song.songSelected = function () {
    return Session.equals("sessionColor", this._id) ? "selected" : "";
  };

  Template.song.togglePlay = function() {
    return Session.equals("togglePlay", this._id) ? "> " : "";
  }

  Template.youtube.youtubeID = function () {
    return Session.get("youID")
  };

  Template.newSong.error = function() {
    return Session.get("error");
  };


  //Template Events
  Template.song.events = {
    //When you click on a song in the list, it loads the song into the youtube window.
    'click .song': function() {
      Session.set("togglePlay", this._id);
      Session.set('sessionColor', this._id);
      Session.set('youID', this.youtubeID); 
    },

    'click .delete_song': function() {
      Songs.remove(this._id);
    }
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

  
  
  function parseYoutube(url){
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match&&match[2].length==11){
      return match[2];
    } else {
      //error
    }
  };

  function clearSong() {
    $('input').val('');
  };

  Template.newSong.events = {
    //add the song
    'click button#addsong' : function () {
      var artist = document.getElementById("artistName").value.trim();
      var song = document.getElementById("songName").value.trim();
      var youtube = document.getElementById("youtubeID").value.trim();
      var youtubeID = parseYoutube(youtube);

      if (Validation.validEntry(artist) && Validation.validEntry(song) && Validation.validEntry(youtubeID)) {
        Songs.insert({artist: artist, song: song, youtubeID: youtubeID});
        clearSong();
      }
      
    },

    'click button#cancelSong' : function () {
      clearSong();
    }
  };

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
