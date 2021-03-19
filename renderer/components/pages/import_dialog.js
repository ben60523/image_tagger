import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
// import ContextStore from '../../context_store';

const CreateDialog = ({ open, handleClose }) => {
  // const { setSelectLabel, projectName, ldispatch } = useContext(ContextStore);

  const handleConfirm = () => {
    // const newLabel = addNewBucketLabel({
    //   title: inputContent,
    //   project: projectName,
    // });

    // setSelectLabel(newLabel.payload);
    // ldispatch(newLabel);

    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="alert-dialog-title">
        Tagged Media Found
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Let Google help apps determine location. This means sending anonymous location data to
          Google, even when no apps are running.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} size="small">
          Cancel
        </Button>
        <Button onClick={handleConfirm} size="small">
          confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateDialog;
