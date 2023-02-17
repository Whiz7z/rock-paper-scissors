import { ArrowBackIcon } from "@chakra-ui/icons";
import { Button, ButtonGroup, Heading, VStack, Box } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import TextField from "./TextField";

const SignUp = () => {
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
        fetch(process.env.REACT_APP_BACKEND_URL + "/auth/signup", {
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
          })
          .then((data) => {
            navigate("/");
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
          <Heading color="#487085">Sign Up</Heading>
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
              Create Account
            </Button>
            <Button
              backgroundColor="#487085"
              borderRadius="none"
              color="burlywood"
              fontWeight="bold"
              onClick={() => navigate("/")}
              leftIcon={<ArrowBackIcon />}
            >
              Back
            </Button>
          </ButtonGroup>
        </Box>
      </VStack>
    </Formik>
  );
};

export default SignUp;
