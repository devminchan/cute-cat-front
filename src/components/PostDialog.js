import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { AddPhotoAlternate as AddIcon } from '@material-ui/icons';
import { DialogContentText, Avatar } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { grey } from '@material-ui/core/colors';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  imageContainer: {
    width: theme.spacing(48),
    height: theme.spacing(30),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
  },
  userInfoBox: {
    display: 'flex',
    flexDirection: 'row',
  },
  cardAvator: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  addIcon: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    marginBottom: theme.spacing(2), // 시각적으로 중심상에 있도록 margin 추가
  },
  contentTextArea: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
}));

function PostDialog({ open, handleClose, catPost }) {
  const classes = useStyles();

  const titleElement = catPost ? (
    <Box display="flex" flexDirection="row" alignItems="center">
      <Avatar alt={catPost.user.userId} className={classes.cardAvator}>
        {catPost.user.userId.length > 0 ? catPost.user.userId[0] : 'unknown'}
      </Avatar>
      <Box ml={1.2}>
        <Typography>{catPost.user.userId}</Typography>
      </Box>
    </Box>
  ) : (
    '새 포스트 작성'
  );

  const imageElement = catPost ? (
    <img alt="커여운 고양이" src={catPost.imageUrl} className={classes.image} />
  ) : (
    <AddIcon className={classes.addIcon} style={{ color: grey[500] }} />
  );

  const contentElement = catPost ? (
    <DialogContentText className={classes.contentTextArea}>
      {catPost.content}
    </DialogContentText>
  ) : (
    <TextField
      id="standard-multiline-static"
      label="사진 설명"
      multiline
      rows={4}
      placeholder="사진에 대한 설명을 해주세요!"
      className={classes.contentTextArea}
    />
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle>{titleElement}</DialogTitle>
      <DialogContent>
        <Paper className={classes.imageContainer} variant="outlined">
          {imageElement}
        </Paper>
        {contentElement}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleClose} color="primary">
          Subscribe
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PostDialog;
