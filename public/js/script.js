      // Initialize Firebase
      var config = {
        apiKey: "AIzaSyDOaLgGtZ4VyNLYcpDKA5Cj8GWgMOChmOA",
        authDomain: "lime-4e46e.firebaseapp.com",
        databaseURL: "https://lime-4e46e.firebaseio.com",
        projectId: "lime-4e46e",
        storageBucket: "lime-4e46e.appspot.com",
        messagingSenderId: "897464103789"
      };
      firebase.initializeApp(config);

      var newAccountButton = document.getElementById('newAccount');
      var email = document.getElementById('emailField');
      var password = document.getElementById('passwordField');
      var nameInput = document.getElementById('nameField');
      var phone = document.getElementById('phoneField');
      var loginEmail = document.getElementById('loginemail');
      var loginPassword = document.getElementById('loginpassword');
      var loginButton = document.getElementById('loginButton');
      var logoutButton = document.getElementById('logout');


      firebase.auth().onAuthStateChanged(function (user) {
        console.log(user);
        if (!user && !(window.location.pathname == '/index.html' || window.location.pathname == '/pswd.html' || window.location.pathname == '/newacc.html')) {
          window.location = '/index.html';
        }
      });
      if (logoutButton != null) {
        logoutButton.onclick = function () {
          firebase.auth().signOut().then(function () {
            // Sign-out successful.
          }).catch(function (error) {
            // An error happened.
          });
        }
      }

      if (loginButton != null) {
        loginButton.onclick = function () {
          console.log("Function");
          console.log(loginEmail.value);
          console.log(loginPassword.value);
          firebase.auth().signInWithEmailAndPassword(loginEmail.value, loginPassword.value).then(() => {
              window.location = "home.html";
            })
            .catch(function (error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;

              console.log(errorMessage);
              // ...
            });
        }
      }

      if (newAccountButton != null) {
        console.log("Here");
        newAccountButton.onclick = function () {
          firebase.auth().createUserWithEmailAndPassword(email.value, password.value).then(() => {
            var uid = firebase.auth().currentUser.uid;
            console.log(uid);

            var userObject = {
              uid : uid,
              phone: phone.value,
              name : nameInput.value
          }
          var updates = {};
          updates['/UserInfo/' + uid] = userObject;
          return firebase.database().ref().update(updates);
          })
          .then(() => {
            window.location = "home.html";
          })
          .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            console.log(errorMessage);
          });
        }
      }