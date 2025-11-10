import HomePage from "../pages/home/home-page";
import AddStoryPage from "../pages/add-story/add-story-page";
import AboutPage from "../pages/about/about-page";
import LoginPage from "../pages/login/login-page";
import RegisterPage from "../pages/register/register-page";
import DetailPage from "../pages/detail/detail-page";
import FavoritePage from "../pages/favorites/favorite-page";

const routes = {
  "/": HomePage,
  "/home": HomePage,
  "/add": AddStoryPage,
  "/about": AboutPage,
  "/login": LoginPage,
  "/register": RegisterPage,
  "/detail/:id": DetailPage,
  "/favorites": FavoritePage,
};

export default routes;
