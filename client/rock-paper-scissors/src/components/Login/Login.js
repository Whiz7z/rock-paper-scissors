import { useContext, useEffect } from "react";
import { Button, ButtonGroup, Heading, VStack, Box } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router";
import axios from "axios";
import * as Yup from "yup";
import { useSocket } from "../context/SocketProvider";
import TextField from "./TextField";
import { AuthContext } from "../context/auth-context";

const Login = () => {
  const socket = useSocket();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={Yup.object({
        username: Yup.string()
          .required("Username required!")
          .min(6, "Username too short!")
          .max(28, "Username too long!"),
        password: Yup.string()
          .required("Password required!")
          .min(6, "Password too short!")
          .max(28, "Password too long!"),
      })}
      onSubmit={(values, actions) => {
        const vals = { ...values };
        actions.resetForm();
        fetch(process.env.REACT_APP_BACKEND_URL + "/auth/login", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vals),
        })
          .catch((err) => {
            return;
          })
          .then((res) => {
            if (!res || !res.ok || res.status >= 400) {
              return;
            }
            return res.json();
          })
          .then((data) => {
            if (!data) return;
            auth.login(data.userId, data.token, data.name);
            navigate(`/mainmenu`);
          });
      }}
    >
      <VStack
        as={Form}
        w={{ base: "90%", md: "500px" }}
        m="auto"
        justify="center"
        h="100vh"
        spacing="1rem"
      >
        <Box
          w={{ base: "90%", md: "500px" }}
          m="auto"
          justify="center"
          textAlign="center"
          padding="40px 20px 40px 20px"
          backgroundColor="rgba(174, 157, 130, 0.92)"
          spacing="1rem"
          border="5px solid #487085"
        >
          <Heading color="#487085" fontWeight="bold">
            Log In
          </Heading>
          <TextField
            name="username"
            placeholder="Enter username"
            autoComplete="on"
            label="Username"
          />

          <TextField
            name="password"
            placeholder="Enter password"
            autoComplete="on"
            label="Password"
          />

          <ButtonGroup pt="1rem">
            <Button
              backgroundColor="burlywood"
              borderRadius="none"
              color="#487085"
              fontWeight="bold"
              type="submit"
            >
              Log In
            </Button>
            <Button
              backgroundColor="#487085"
              borderRadius="none"
              color="burlywood"
              fontWeight="bold"
              onClick={() => navigate("/register")}
            >
              Create Account
            </Button>
          </ButtonGroup>
        </Box>
      </VStack>
    </Formik>
  );
};

export default Login;
