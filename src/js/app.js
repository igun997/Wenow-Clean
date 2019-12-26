import $$ from 'dom7';
import Framework7 from 'framework7/framework7.esm.bundle.js';
import store from 'localforage/dist/localforage.js';
import storeData from 'local-storage';
// import NodeGeocoder from 'node-geocoder';
import geo from 'geolocation';
// Import F7 Styles
import 'framework7/css/framework7.bundle.css';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.css';
// Import Cordova APIs
import cordovaApp from './cordova-app.js';
// Import Routes
import routes from './routes.js';
// Import Location

var storageSession = store.createInstance({
  name: "session"
});

// var base_url = "http://wenow.id/api/android/";
var base_url = "http://127.0.0.1/scm/public/api/android/";
console.log(storageSession);
var app = new Framework7({
  root: '#app', // App root element
  id: 'io.framework7.wenow', // App bundle ID
  name: 'WENOW', // App name
  theme: 'auto', // Automatic theme detection
  // App root data
  data: function () {
    return {
      session: storeData,
      obj:$$,
      url:base_url,
      loc:geo,
      sesi:storageSession
    };
  },
  // App root methods
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
    notifikasi:function(data){
      console.log(data);
      var inst = app.notification.create({
        icon: '<i class="icon demo-icon">W</i>',
        title: data.title,
        titleRightText: 'now',
        subtitle: data.subtitle,
        text: data.text,
        closeOnClick: true,
      })
      return inst;
    }
  },
  // App routes
  routes: routes,


  // Input settings
  input: {
    scrollIntoViewOnFocus: Framework7.device.cordova && !Framework7.device.electron,
    scrollIntoViewCentered: Framework7.device.cordova && !Framework7.device.electron,
  },
  // Cordova Statusbar settings
  statusbar: {
    iosOverlaysWebView: true,
    androidOverlaysWebView: false,
  },
  on: {
    init: function () {
      var f7 = this;
      if (f7.device.cordova) {
        // Init cordova APIs (see cordova-app.js)
        cordovaApp.init(f7);
      }
    },
  },
});
//Notif
function notif(data) {
  console.log(data);
  var inst = app.notification.create({
    icon: '<i class="icon demo-icon">W</i>',
    title: data.title,
    titleRightText: 'now',
    subtitle: data.subtitle,
    text: data.text,
    closeOnClick: true,
  })
  return inst;
}
//Cek session
storageSession.getItem("isLogin",function(e,v){
  if (v == null) {
    console.log("Session empty");
    app.loginScreen.open("#my-login-screen");
  }
})
function onError(xhr, status) {
  var data = {
    title:"Perhatian",
    subtitle:"Server terputus",
    text:"Periksa kembali isian anda"
  };
  notif(data).open();
  console.log();
}
console.log("Initial");
console.log($$);
// Login Screen Demo
$$("#tab_pesanan").on("click", function(event) {
  console.log("ClickIt");
  app.views.main.router.navigate("/pesanan/");
})
$$("#tab_home").on("click", function(event) {
  console.log("ClickIt");
  app.views.main.router.navigate("/");
})
$$("#tab_settings").on("click", function(event) {
  console.log("ClickIt");
  app.views.main.router.navigate("/settings/");
})
$$("#tab_help").on("click", function(event) {
  console.log("ClickIt");
  app.views.main.router.navigate("/help/");
})
$$('#my-login-screen .login-button').on('click', function () {
  var username = $$('#my-login-screen [name="username"]').val();
  var password = $$('#my-login-screen [name="password"]').val();
  // app.loginScreen.close('#my-login-screen');
  var compact = {email:username,password:password};
  app.request.post(base_url+"login",compact,function(d, status, xhr){
    console.log("ajax");
    console.log(d);
    if (d.status == 1) {
      storageSession.setItem("isLogin",true);
      storeData.set("data",d.data);
      var data = {
        title:"Yeaay !",
        subtitle:"Login Berhasil",
        text:"Silahkan menikmati fasilitas kami"
      };
      notif(data).open();
      app.loginScreen.close("#my-login-screen");
      app.views.main.router.navigate("/");
    }else {
      var data = {
        title:"Perhatian",
        subtitle:"Login Gagal",
        text:"Tolong periksa username dan password anda"
      };
      notif(data).open();
    }
  },onError,"json");
});
var urlBonds = function(add){
  return "https://maps.googleapis.com/maps/api/geocode/json?address="+add+"&key=AIzaSyD1cM44pjtWnEej7CgCeCVtYx5D70ImTdQ";
};
$$('#my-login-screen .register-button').on('click', function () {
  app.loginScreen.close("#my-login-screen");
  app.loginScreen.open("#my-register-screen");
  var map = L.map('mapid').setView([51.505, -0.09], 13);
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      accessToken: 'pk.eyJ1IjoiaWd1bjk5NyIsImEiOiJjazRkNGU2MGEwdHB4M2xwYTU0YWpsd2V4In0.DsoDIY5kzULdad_WuJVyRg'
  }).addTo(map);
  map.locate({setView: true, maxZoom: 16});
  function onLocationFound(e) {
      var radius = e.accuracy;
      L.marker(e.latlng).addTo(map)
          .bindPopup("Lokasi Anda Akurat " + radius + " meter dari titik").openPopup();
      L.circle(e.latlng, radius).addTo(map);
      var coord = e.latlng;
      var lat = coord.lat;
      var lng = coord.lng;
      $$('#my-register-screen [name="lat"]').val(lat);
      $$('#my-register-screen [name="lng"]').val(lng);
  }
  map.on('locationfound', onLocationFound);
  function onLocationError(e) {
      alert(e.message);
  }

  map.on('locationerror', onLocationError);
});
$$('#my-register-screen .login-button').on('click', function () {
  app.loginScreen.close("#my-register-screen");
  app.loginScreen.open("#my-login-screen");
});
$$("#my-register-screen .simpan-button").on("click",function(){
      var data = {};
      data.nama = $$('#my-register-screen [name="nama"]').val();
      data.email = $$('#my-register-screen [name="email"]').val();
      data.password = $$('#my-register-screen [name="password"]').val();
      data.jk = $$('#my-register-screen [name="jk"]').val();
      data.lat = $$('#my-register-screen [name="lat"]').val();
      data.lng = $$('#my-register-screen [name="lng"]').val();
      data.alamat = $$('#my-register-screen [name="alamat"]').val();
      data.no_hp = $$('#my-register-screen [name="no_hp"]').val();
      app.request.post(base_url+"register",data,function(d, status, xhr){
        if (d.status == 1) {
          var ds = {
            title:"Perhatian",
            subtitle:"Pendaftaran Sukses",
            text:"Silahkan cek email untuk aktivasi akun"
          }
          notif(ds).open();
          app.loginScreen.close("#my-register-screen");
          app.loginScreen.open("#my-login-screen");
        }
      },"json");
});
