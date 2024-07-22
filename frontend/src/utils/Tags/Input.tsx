import { TextField, TextFieldProps } from "@mui/material";

export const Input = (props: TextFieldProps) => {
    return (
        <TextField
            {...props}
            variant="standard"
            required
            sx={{
                "& .MuiInputBase-input": {
                    color: "gray",
                    fontWeight: "600",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    padding: "0.5rem",
                },
                "& .MuiInput-underline:before": {
                    borderBottomColor: "gray",
                },
                "& .MuiInput-underline:after": {
                    borderBottomColor: "gray",
                },
            }}
        />
    );
};
