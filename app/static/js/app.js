/* Add your Application JavaScript */
Vue.component('app-header', {
    template: `
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
        <a class="navbar-brand" href="#">Photogram</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
    
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
              <router-link class="nav-link" to="/">Home<span class="sr-only">(current)</span></router-link>
            </li>
			      <li class="nav-item active">
              <router-link to="/explore" class="nav-link">Explore</router-link>
            </li>
          </ul>
          <ul class="navbar-nav navbar-right">
            <li v-if="token" class="nav-item active">
              <a href="#" class="nav-link" v-on:click.stop="logOut">Logout</a>
            </li>
          </ul>
        </div>
      </nav>
    `,
    data: function(){
      return {
        token: localStorage.getItem('token'),
        message: ''
      }
    },
    methods: {
      logOut: function(){
        let self = this;
        fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'X-CSRFToken': token
          },
          credentials: 'same-origin'
        })
        .then(function(response){
          return response.json();
        })
        .then(function(jsonResponse){
          console.log(jsonResponse);
          //remove token from local storage
          localStorage.removeItem('token');
          localStorage.removeItem('id');
          sessionStorage.removeItem('id_details');
          self.message = jsonResponse['message']; 
          self.token = '';
          self.$router.push("/");
        })
        .catch(function(error){
          console.log(error);
        })
      }
    }
});

Vue.component('app-footer', {
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; Flask Inc.</p>
        </div>
    </footer>
    `
});



const Home = Vue.component('home', {
   template: `
    <div class="row">
      <div class="col-sm-6">
        <div class= "card ">
          <img src="/static/upload/beach.jpg">
        </div>
      </div>   
      <div class="col-sm-6">
			  <div class= "card card-body">
				  <h1 class="card-title">Photogram</h1>
          <p class="lead">Share photos of your favourite  moments with your friends, families and the world</p>
            <div>
				      <button id="register" class="btn btn-success" v-on:click="registrationPage">Register</button>
				      <button id="login" class="btn btn-primary" v-on:click="loginPage">Login</button>
			      </div>
        </div>
      </div>
    </div>
   `,
    methods:{ 
      registrationPage: function(){  
        this.$router.push("/register")
      },
		  loginPage: function(){ 
        this.$router.push("/login")
      }
    }
});

const Register = Vue.component('register',{
    template:`
    
    <div class="d-flex justify-content-center"> 
      <div>
      <h2>Registration Form</h2>
      <h4 v-if="message" class="alert alert-success">{{ message }}</h4>
        <ul v-if="errors.length > 0">
          <li v-for="error in errors" class="alert alert-danger">
            <div>{{ error }}</div>
          </li>
        </ul>
    <div class="jumbotron"> 
    <form id="registerForm" method="POST" enctype = "multipart/form-data" @submit.prevent="registerUser"> 
    <div>
    <label>Username</label> 
    </div>
    <div>
    <input type="text" id ="username" name="username" />
    </div>
    <div>
    <label>Password</label> 
    </div> 
    <div>
    <input type="password" id ="password" name="password" /> 
    </div> 
    <div>
    <label>Firstname</label> 
    </div> 
    <div>
    <input type="text" id ="firstname" name="firstname" /> 
    </div> 
    <div>
    <label>Lastname</label> 
    </div> 
    <div>
    <input type="text" id ="lastname" name="lastname" /> 
    </div> 
    <div>
    <label>Email</label> 
    </div> 
    <div>
    <input type="text" id ="email" name="email" /> 
    </div> 
    <div>
    <label>Location</label> 
    </div> 
    <div>
    <input type="text" id ="location" name="location" /> 
    </div> 
    <div>
    <label>Biography</label> 
    </div> 
    <div>
     <textarea id="biography" name="biography" ></textarea> 
    </div> 
    <div> 
    <label>Photo</label>
    </div> 
    <div> 
    <input id="profile_picture" type="file" name="profile_picture" accept="image/*">
    </div> 
    <div class="d-flex flex-column"> 
    <p></p>
    <button type="submit" name="submit" class="btn btn-success">REGISTER</button> 
    </div>
    </form>
    </div> 
    </div>
    </div>
   
    `,
    data: function() {
       return {
         message: '',
         errors: []
       }
    },
    methods: {
      registerUser: function(){
        let self  = this;
        let registerForm = document.getElementById('registerForm');
        let form_data = new FormData(registerForm);

        fetch("/api/users/register", {
          method: 'POST',
          body: form_data,
          headers: {
            'X-CSRFToken': token
          },
          credentials: 'same-origin'
        })
        .then(function(response){
          return response.json();
        })
        .then(function(jsonResponse){ 
          if (jsonResponse['error']) {
            self.errors = jsonResponse['error'];
            setTimeout(function(){ self.errors = [] }, 5000);
          } else {
            self.message = jsonResponse['message'];
            registerForm.reset();
            setTimeout(function(){ self.message = ''; }, 5000);
          }
        })
        .catch(function(error){
          console.log(error);
        }); 
      }
    }
}); 

const Login = Vue.component('login',{
    template:`
      <div id="lgn">
        <div class="d-flex justify-content-center">
          <div>
            <h2>Login</h2>
            <h4 v-if="message" class="alert alert-success">{{ message }}</h4>
            <ul v-if="errors.length > 0">
              <li v-for="error in errors" class="alert alert-danger">
                <div>{{ error }}</div>
              </li>
            </ul>
            <div class="jumbotron"> 
              <form id="loginForm" method="POST" @submit.prevent="loginUser">
                <div>
                  <br>
                  <br>
                  <label>Username</label> 
                </div>
                <div>
                  <input id="username" name="username" type="text" />
                </div> 
                <div>
                  <br>
                  <label>Password</label> 
                </div> 
                <div> 
                  <input id="password" name="password" type="password" />
                </div> 
                <br>
                <br>
                <div class="d-flex flex-column"> 
                  <p></p>
                  <button type="Submit" class="btn btn-success">Login</button>
                </div>
              </form>
            </div> 
          </div> 
        </div>
      </div>
    `,
    data: function() {
       return {
         message: '',
         token: '',
         errors: []
       }
    },
    methods: {
      loginUser: function(){
        let self = this;
        let loginForm = document.getElementById('loginForm');
        let form_data = new FormData(loginForm);

        fetch('/api/auth/login', {
          method: 'POST',
          body: form_data,
          headers: {
            'X-CSRFToken': token
          },
          credentials: 'same-origin'
        })
        .then(function(response){
          return response.json();
        })
        .then(function(jsonResponse){
          if (jsonResponse['error']) {
            self.errors = jsonResponse['error'];
            setTimeout(function(){ self.errors = [] }, 5000);
          } else {
            console.log(jsonResponse);
            //get the token
            let jwt_token = jsonResponse['token'];
            let id = jsonResponse['id'];
            self.message = jsonResponse['message'];
            //store the token to local storage and self
            localStorage.setItem('token', jwt_token);
            localStorage.setItem('id', id);
            console.info('Token generated and added to local storage.');
            self.token = jwt_token;
            setTimeout(function(){ self.message = ''; }, 5000);
            self.$router.push("/explore");
          }
        })
        .catch(function(error){
          console.log(error);
          self.errors = error;
        });
      }
    }  
});


const User = Vue.component('user',{
  template:
  `
    <div class="card" style="width: 60rem; padding:20px;">
      <div class="row">
        <div class="col-sm-2">
          <img class="card-img-left" v-bind:src="'/static/upload/' + user.profile_photo" alt="" style="height:150px; width:150px;"> 
        </div>
        <div class="col-sm-7" style="padding-left:40px;">
          <h5 >{{user.firstname}} {{user.lastname}}</h5>
          <p>{{user.location}}</p>
          <p>Member since {{user.joined_on}} </p>
          <p>{{user.biography}} </p>
        </div>

        <div class="col-sm-3">
        <div class="row">
          <div class="col" align="center">
            <h2>{{ posts_count }}</h2>
            <p>Posts</p>
          </div>
          <div class="col" align="center">
            <h2>{{followers}}</h2>
            <p>Followers</p>
          </div>
        </div>
        <div class="col" align="center">
          <button type="button" class="btn btn-success" v-on:click="followUser" style="width:100%">{{ btn_message }}</button>
        </div>
          
        </div>
      </div>
    </div>
  `,    
  created: function(){
    let self = this;
    self.user_id = sessionStorage.getItem('id_details');
    fetch(`/api/users/${self.user_id}`,{
      method: 'GET',
      headers: {
        'Authorization': 'Bearer '+ localStorage.getItem('token')
      }
    })
    .then(function(response){
      //prevent unauthorized acces
      if (!localStorage.getItem('token')){
        self.$router.push("/login");
      }
      return response.json();
    })
    .then(function (jsonResponse) {
      self.user = jsonResponse['user']; 
      self.posts = jsonResponse['posts'];
      self.posts_count = self.posts.length;
      self.followers = self.followerCount();
      console.log(jsonResponse);
      console.log(self.btn_message);
    })
    .catch(function(error){
      console.log(error);
    });
  },
  data: function() {
    return {
      user: '',
      user_id: '',
      btn_message: 'Follow',
      posts: [],
      post_count: 0,
      followers: 0
    };
  },
  methods: {
    followUser: function(){
      let self = this;
      fetch(`/api/users/${self.user_id}/follow`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'X-CSRFToken': token
        },
        credentials: 'same-origin'
      })
      .then(function(response){
        return response.json();
      })
      .then(function(jsonResponse){
        self.btn_message = 'Following';
        self.message = jsonResponse['message'];
        self.followers = self.followerCount();
        console.log(jsonResponse);
      })
      .catch(function(error){
        console.log(error);
      });
    },
    followerCount: function(){
      let self = this;
      fetch(`/api/users/${self.user_id}/follow`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })
      .then(function(response){
        return response.json();
      })
      .then(function(jsonResponse){
        self.followers = jsonResponse['followers'];
        if(jsonResponse['following']){
          self.btn_message = 'Following';
        } else {
          self.btn_message = 'Follow';
        }
      })
      .catch(function(error){
        console.log(error);
      });
    }
  }
});

const Explore = Vue.component('explore', {
  template: `
    <div>
      <div class="row">
        <div class="container col-sm-8">
          <div class="col-md-10">
            <h2 v-if="posts.length == 0" class="alert alert-info">{{ message }}</h2>
            <ul v-if="posts.length > 0" >
              <li v-for="post in posts">
                <div class="row top-buffer">
                  <div class="card" style="width: 40rem;">
                    <div class="row" style="padding-left:20px;padding-top:20px;">  
                      <img class="card-img-top" v-bind:src="'/static/upload/' + post.photo" alt="" style="width:30px;height:30px;">
                      <a @click="viewUser(post.user_id)" class="pointer">
                      <h5 class="card-title" style="padding-left:10px;padding-bottom:10px;">{{post.username}}</h5></a>
                    </div>
                    <img class="card-img-top" v-bind:src="'/static/upload/' + post.photo" alt="Card image cap">
                    <div class="card-body">
                      <p class="card-text">{{post.caption}}</p>
                      <div class="row top-buffer">
                        <div class="col-sm-8">
                          <h6>
                            <img class="card-img-top pointer" src="/static/upload/heart.png" v-on:click="likePost(post.id)" alt="" style="width:20px;height:20px;">
                            {{post.likes}}
                            likes                
                          </h6>
                        </div>
                        <div class="col-sm-4">
                          <h6>
                            {{post.created_on}}
                          </h6>   
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="row top-buffer">
          <div class="col-sm-2">
            <button type="button" class="btn btn-primary" v-on:click="newPost">New Post</button>
          </div>
        </div>
        {{posts.username}}
      </div>
    </div>
  `,
  created: function(){
    let self = this;
    fetch('/api/posts', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
    .then(function(response){
      //prevent unauthorized acces
      if (!localStorage.getItem('token')){
        self.$router.push("/login");
      }
      return response.json();
    })
    .then(function(jsonResponse){
      if (jsonResponse['posts']) {
        self.posts = jsonResponse['posts'];
        console.log(self.posts[0].photo)
      }
      self.message = jsonResponse['message'];
      console.log(jsonResponse);
    })
    .catch(function(error){
      console.log(error);
    });
  },
  data: function(){
    return {
      message: '',
      error: [],
      posts: []
    }
  },
  methods: {
    newPost: function(){
      this.$router.push("/posts/new");
    },
    viewUser: function(user_id){
      sessionStorage.setItem('id_details', user_id);
      this.$router.push(`/users/${user_id}`);
    },
    likePost: function(post_id){
      let self = this;
      fetch(`/api/posts/${post_id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'X-CSRFToken': token
        },
        credentials: 'same-origin'
      })
      .then(function(response){
        return response.json();
      })
      .then(function(jsonResponse){
        self.message = jsonResponse['message'];
        self.posts.forEach(post => {
          if(post.id == post_id){ post.likes = jsonResponse['likes']; }
        });
      })
      .catch(function(error){
        console.log(error);
      });
    }
  }

});

const Post = Vue.component('post', {
  template: `
    <div class="container">
      <form id="post-form" class="was-validated" enctype="multipart/form-data" @submit.prevent="newPost">
        <div class="custom-file mb-3">
          <label for="photo" class="custom-file-label">Photo</label>
          <input type="file" class="custom-file-input" name="photo" id="photo" required>
          <div class="invalid-feedback"></div>
          </div>
        <div class="mb-3">
          <label for="caption">Caption</label>
          <textarea class="form-control is-invalid" name="caption" id="caption" required></textarea>
          <div class="invalid-feedback">
            Please enter a caption
          </div>
        </div>
        <button type="Submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  `,
  data: function(){
    return {
      message: '',
      id: localStorage.getItem('id'),
      errors: []
    }
  },
  methods: {
    newPost: function(){
      let self = this;
      let postForm = document.getElementById('post-form');
      let form_data = new FormData(postForm);

      fetch(`/api/users/${self.id}/posts`, {
        method: 'POST',
        body: form_data,
        headers: {
          'X-CSRFToken': token,
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        credentials: 'same-origin'
      })
      .then(function(response){
        if(!response.ok){
          self.$router.push("/login");
        }
        return response.json();
      })
      .then(function(jsonResponse){
        console.log(jsonResponse);
        self.message = jsonResponse['message'];
        self.$router.push("/explore");
      })
      .catch(function(error){
        console.log(error);
        self.errors = error;
      });
    }
  }
});

const NotFound = Vue.component('not-found', {
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data: function () {
        return {}
    }
});

// Define Routes
const router = new VueRouter({
    mode: 'history',
    routes: [
      { path: "/", component: Home},
        // Put other routes here
		  { path: "/register", component: Register },
      { path: "/login", component: Login },
      { path: "/explore", component: Explore },
      { path: "/posts/new", component: Post },
      { path: "/users/:user_id", component: User},		 
        // This is a catch all route in case none of the above matches
      { path: "*", component: NotFound}
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});