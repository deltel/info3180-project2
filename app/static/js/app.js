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
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
		  
			<li class="nav-item active">
            <router-link to="/upload" class="nav-link">Explore</router-link>
          </li>
		  
		  <li class="nav-item active">
            <router-link to="/upload" class="nav-link">My Profile</router-link>
          </li>
		  

		  
		   <li class="nav-item active">
            <router-link to="/upload" class="nav-link">Logout</router-link>
          </li>
		  
		  
        </ul>
      </div>
    </nav>
    `
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
				<button id="register" class="btn btn-success" v-on:click="nextpage1">Register</button>
				<button id="login" class="btn btn-primary" v-on:click="nextpage2">Login</button>
			</div>
		</div>
    </div>
   `,
    methods:{ 
        nextpage1:function(event){
            
           this.$router.push("/register")
        },
		nextpage2:function(event){
            
           this.$router.push("/login")
        }
    }
});

const register=Vue.component('register',{
    template:`
    
    <div class="d-flex justify-content-center"> 
      <div>
      <h2>Registration Form</h2>
      <h4 v-if="message" class="success">{{ message }}</h4>
        <ul v-if="errors.length > 0" class="error_list">
          <li v-for="error in errors" class="error_items">
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
    <button type="submit" name="submit" class="btn btn-secondary">REGISTER</button> 
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
          if (jsonResponse['errors']) {
            self.errors = jsonResponse['errors'];
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



const login =Vue.component('login',{
    template:`
      <div id="lgn">
        <div class="d-flex justify-content-center">
          <div>
            <h2>Login</h2>
            <div class="jumbotron"> 
              <form id="loginForm" method="POST" enctype="multipart/form-data">
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
                  <button type="submit" name="submit" class="btn btn-success">LOGIN</button>
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
          if (jsonResponse['errors']) {
            self.errors = jsonResponse['errors'];
            setTimeout(function(){ self.errors = [] }, 5000);
          } else {
            self.message = jsonResponse['message'];
            setTimeout(function(){ self.message = ''; }, 5000);
          }
        })
      }
    }  
})

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
        {path: "/", component: Home},
        // Put other routes here
		 {path:"/register",component:register},
		{path:"/login",component:login},		 
        // This is a catch all route in case none of the above matches
        {path: "*", component: NotFound}
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});