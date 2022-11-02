import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import Home from "./pages/Home";
import Detail from "./pages/Detail";
import NoMatch from "./pages/NoMatch";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import Success from "./pages/Success";
import OrderHistory from "./pages/OrderHistory";
import { StoreProvider } from "./utils/GlobalState";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
// import Snackbar from "../components/Snack";
const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          {/* <Snackbar /> */}
          <StoreProvider>
            <Nav />

            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/profile" component={<Profile />} />
              <Route exact path="/orderHistory" element={<OrderHistory />} />
              <Route exact path="/orders" element={<Orders />} />
              <Route exact path="/success" element={<Success />} />
              <Route exact path="/products/:id" element={<Detail />} />
              <Route element={<NoMatch />} />
            </Routes>
          </StoreProvider>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
