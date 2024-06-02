import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Characters from "./routes/characters";
import Characters_Id from "./routes/characters_:id";
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
        element: "Home",
      },
      {
        path: "/characters",
        element: <Characters />,
      },
      {
        path: "/characters/:id",
        element: <Characters_Id />,
      },
      {
        path: "/maps",
        element: "Maps",
      },
      {
        path: "/maps/:id",
        element: "MapsId",
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
