import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from 'routes/Home';
import Main from 'routes/Main';
import NotFound from 'routes/NotFound';
import RequestUpdatePassword from 'routes/RequestUpdatePassword';
import SignIn from 'routes/SignIn';
import SignUp from 'routes/SignUp';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* 로그인 없이 main 강제접속 시 Home으로 redirect */}
        <Route path="/main" element={<Main />}>
          <Route path="/main/:id" element={<Main />} />
          <Route path="/main/lists/:listId/tasks" element={<Main />} />
          <Route path="/main/lists/:listId/tasks/:id" element={<Main />} />
          <Route path="/main/all/tasks" element={<Main />} />
          <Route path="/main/all/tasks/:id" element={<Main />} />
        </Route>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/requestUpdatePassword"
          element={<RequestUpdatePassword />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
