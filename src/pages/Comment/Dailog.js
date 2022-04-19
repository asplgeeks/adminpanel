import * as React from 'react'
import { useForm, Controller  } from "react-hook-form"
// import InputAdornment from "@mui/material/InputAdornment"
// import TextField from "@mui/material/TextField"
// import SearchIcon from "@material-ui/icons/Search"
// import { IconButton } from "@material-ui/core"
// import CancelRoundedIcon from "@material-ui/icons/CancelRounded"
// import FormHelperText from '@mui/material/FormHelperText'
import classnames from 'classnames'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import API from "@src/api";

export default function FormDialog(props) {
  const { register, errors, setValue, handleSubmit, control } = useForm()
  const [open, setOpen] = React.useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (data) => {
 console.log(data)
 API.deleteComment(data, props.ID)
 .then(response => response)
 .then(result => {
   if(result.success === 1) {
    handleClose()
 }
})
 .catch((ex) => {
     // setTableLoading(false);
     notification.error({
         message: ex,
         placement: "bottomRight",
     });
 });
  }
  return (
    <div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Reason</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogContentText>
            Reason to this comment, please enter your reason for delete the comment here.
          </DialogContentText>
          {/* <Controller 
          control={control}
          name="reason"
          rules={{
            required:{
                value: true,
                message: "Campo obrigatório."
            }
        }}
          as={ */}
          <TextField
          name='reason'
          // className={classnames({ 'is-invalid': errors['reason'] })}
          {...register('reason')}
          margin="dense"
          id="name"
          label="Reason"
          type="text"
          fullWidth
          variant="standard"
          />
          {/* }
          /> */}
           {/* {errors.reason && <p style={{color:"red"}}>Reason is required</p>} */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
