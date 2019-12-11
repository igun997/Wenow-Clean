
import HomePage from '../pages/home.f7.html';
import FormPage from '../pages/form.f7.html';
import PesananPage from '../pages/pesanan.f7.html';
import PesananDetail from '../pages/pesanan_detail.f7.html';
import SettingsPage from '../pages/settings.f7.html';
import store from 'localforage/dist/localforage.js'
import LayananPage from '../pages/layanan.f7.html';
import NotFoundPage from '../pages/404.f7.html';
import geolocation from "geolocation";

var routes = [
  {
    path: '/',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      var url = app.data.url;
      app.preloader.show();

      app.preloader.hide();
      resolve({
        component: HomePage,
      },{
        context: {
          lokasi:null,
        }
      });
    }
  },
  {
    path: '/layanan/',
    component: LayananPage,
  },
  {
    path: '/form/',
    component: FormPage,
  },
  {
    path: '/pesanan/',
    async: function (routeTo, routeFrom, resolve, reject) {
        var router = this;
        var app = router.app;
        var url = app.data.url;
        var sess = app.data.session;
        var d = sess.get("data");
        app.preloader.show();
        app.request({
          url: url+"listpesanan/"+d.id,
          async:false,
          statusCode: {
            404: function (xhr) {
              alert('page not found');
            }
          },
          success:function(d){
            var pos ;
            app.preloader.hide();
            resolve({
                  component: PesananPage,
                },{
                  context: {
                    pesanan:d
                  }
                });
          },
          always:function(){

          }
        });
    }
  },
  {
    path: '/pesanan/:id/',
    async: function (routeTo, routeFrom, resolve, reject) {
        var router = this;
        var app = router.app;
        var url = app.data.url;
        app.preloader.show();
        console.log(url);
        app.request({
          url: url+"pesanan",
          async:false,
          statusCode: {
            404: function (xhr) {
              alert('page not found');
            }
          },
          success:function(d){
            var pos ;

            app.preloader.hide();
            resolve({
                  component: PesananDetail,
                },{
                  context: {
                    pesanan:d,
                    loc:pos
                  }
                });
          },
          always:function(){

          }
        });
    }
  },
  {
    path: '/settings/',
    component: SettingsPage,
  },{
    path:"/logout/",
    async:function(){
      store.removeItem("isLogin");
      var router = this;
      var app = router.app;
      var url = app.data.url;
      var ses = app.data.sesi;
      ses.removeItem("isLogin");
      app.views.main.router.navigate("/");
      app.loginScreen.open("#my-login-screen");
    }
  }

];

export default routes;
