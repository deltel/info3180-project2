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
    <div class="jumbotron">
		<div class="row">
			<div class= "card card-body">
				<h1 class="card-title">Photogram</h1>
				<p class="lead">Share photos of your favourite  moments with your friends, families and the world</p>
				<button id="register" class="btn btn-success" v-on:click="registrationPage">Register</button>
				<button id="login" class="btn btn-primary" v-on:click="loginPage">Login</button>
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


const user = Vue.component('user',{
  template:`
      <div>          
      <div class="Profile pic">
        <img class="imgs" src="{{ url_for('static', filename="uploads/" + i) }}" />
      </div>
      <div>
      <h3>{{user.firstname}} {{user.lastname}}</h3>
      </div>
      <div>
      <p>{{user.biography}}</p>
      </div>

    </div>
    `,
    
Created: function(){
  let self =this;
  let userid = ""+self.uc;
  fetch('/api/users/'+userid,{
    method: 'GET',
    'headers':{
      'Authorization': 'Bearer'+ localStorage.getItem('token')
    },
    credentials: 'same-origin'
  })
  .then(function(response){
    if (!response.ok){
      self.$router.push("/users/:userid");
    }
    return response.json();
  })
  .then(function (jsonResponse) {
    self.user= jsonResponse.response["0"]; 
      console.log(jsonResponse);
  })
  .catch(function(error){
    console.log(error);
 });
},
data: function() {
  return {
      user:[],
      uc:user_id,
      Other:other,
      post:[],
      follow:[]
  };
}

});

const Explore = Vue.component('explore', {
  template: `
    <div class="container">
      <div class="col-md-10">
        <h2 v-if="posts.length == 0" class="alert alert-info">{{ message }}</h2>
        <ul v-if="posts.length > 0">
          <li v-for="post in posts">
            <div class="card" style="width: 18rem;">
              <h5 class="card-title">{{posts.username}}</h5>
              <img class="card-img-top" src="{{posts.photo}}" alt="Card image cap">
              <div class="card-body">
                <p class="card-text">{{posts.body}}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <form>
        <div class="form-group">
        <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
        </div>
        <div class
        <button type="button" class="btn btn-primary">New Post</button>
      </form>
  
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
      this.$router.push("/post");
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
        <button type="Submit" class="btn btn-success">Submit</button>
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
      { path: "/post", component: Post },		 
        // This is a catch all route in case none of the above matches
      { path: "*", component: NotFound}
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});