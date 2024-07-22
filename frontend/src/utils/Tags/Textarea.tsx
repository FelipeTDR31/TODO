import { TextField, TextFieldProps } from "@mui/material";

export const Textarea = (props: TextFieldProps) => {
    return (
        <TextField
            variant="standard"
            required
            multiline
            {...props}
        />
    );
}