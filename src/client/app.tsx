import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Characters from "./routes/characters";
import Characters_Create from "./routes/characters_create";
import Characters_Id from "./routes/characters_:id";
import Maps from "./routes/maps";
import Maps_Create from "./routes/maps_create";
import Maps_Id from "./routes/maps_:id";
import Players from "./routes/players";
import Players_Create from "./routes/players_create";
import Players_Id from "./routes/players_:id";
import Games from "./routes/games";
import Games_Id from "./routes/games_:id";
import Home from "./routes/home";
import Login from "./routes/login";
import { NavigationBar } from "./components/navigation-bar";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <NavigationBar />
        <Outlet />
      </>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/characters",
        element: <Characters />,
      },
      {
        path: "/characters/create",
        element: <Characters_Create />,
      },
      {
        path: "/characters/:id",
        element: <Characters_Id />,
      },
      {
        path: "/maps",
        element: <Maps />,
      },
      {
        path: "/maps/create",
        element: <Maps_Create />,
      },
      {
        path: "/maps/:id",
        element: <Maps_Id />,
      },
      {
        path: "/players",
        element: <Players />,
      },
      {
        path: "/players/create",
        element: <Players_Create />,
      },
      {
        path: "/players/:id",
        element: <Players_Id />,
      },
      {
        path: "/games",
        element: <Games />,
      },
      {
        path: "/games/create",
        element: <Players_Create />,
      },
      {
        path: "/games/:id",
        element: <Games_Id />,
      },
    ],
  },
]);

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};
