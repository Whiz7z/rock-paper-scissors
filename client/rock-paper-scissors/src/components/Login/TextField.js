import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Field, useField } from "formik";

const TextField = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <FormControl isInvalid={meta.touched && meta.error}>
      <FormLabel color="#487085" fontWeight="bold">
        {label}
      </FormLabel>
      <Input
        borderRadius="none"
        border="5px solid #487085"
        fontSize="20px"
        h="45px"
        fontWeight="bold"
        backgroundColor="rgba(174, 157, 130, 0.5)"
        _placeholder={{ color: "rgb(212, 231, 226)", fontWeight: "bold" }}
        _autofill={{
          textFillColor: "rgb(212, 231, 226)",
          boxShadow: "0 0 0px 1000px rgba(174, 157, 130, 0.5) inset",
          transition: "background-color 5000s ease-in-out 0s",
        }}
        as={Field}
        {...field}
        {...props}
      />
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default TextField;
