import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function RemoveDialog({ open, catPost, handleDelete, handleClose }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">알림</DialogTitle>
      <DialogContent>
        <DialogContentText>
          정말 해당 포스트를 삭제하시겠습니까?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          취소
        </Button>
        <Button
          onClick={() => {
            handleDelete(catPost);
          }}
          color="secondary"
        >
          삭제
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RemoveDialog;
