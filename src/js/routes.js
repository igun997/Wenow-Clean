
import HomePage from '../pages/home.f7.html';
import AboutPage from '../pages/about.f7.html';
import FormPage from '../pages/form.f7.html';
import PesananPage from '../pages/pesanan.f7.html';
import PesananDetail from '../pages/pesanan_detail.f7.html';
import SettingsPage from '../pages/settings.f7.html';
import store from 'localforage/dist/localforage.js'
import DynamicRoutePage from '../pages/dynamic-route.f7.html';
import RequestAndLoad from '../pages/request-and-load.f7.html';
import LayananPage from '../pages/layanan.f7.html';
import NotFoundPage from '../pages/404.f7.html';

var routes = [
  {
    path: '/',
    component: HomePage,
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
    component: PesananPage,
  },
  {
    path: '/pesanan/:id/',
    async: function (routeTo, routeFrom, resolve, reject) {
        var router = this;
        var app = router.app;
        var url = app.data.url;
        // app.preloader.show();
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
            // console.log(d);
            // app.preloader.close();
            var pos ;

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
        // app.request.get(url+"pesanan",function(d){
        //   app.preloader.close();
        //   resolve({
        //       component: PesananDetail,
        //     },{
        //       context: {
        //         pesanan:d.data
        //       }
        //     });
        // },"json");
    }
  },
  {
    path: '/settings/',
    component: SettingsPage,
  },{
    path:"/logout/",
    async:function(){
      store.removeItem("isLogin");
    }
  },
  {
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    component: DynamicRoutePage,
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = routeTo.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            component: RequestAndLoad,
          },
          {
            context: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
