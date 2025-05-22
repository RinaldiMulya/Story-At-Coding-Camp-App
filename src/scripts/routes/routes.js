import HomePage from '../pages/home/home-page';
import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/register/register-page';
import AddStoryPage from '../pages/AddStoryPage/add-story';


const routes = {
  '/': new HomePage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
  '/stories': new AddStoryPage(),
};

export default routes;
