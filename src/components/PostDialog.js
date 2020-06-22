import React, { Fragment, useState, useRef, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { AddPhotoAlternate as AddIcon } from '@material-ui/icons';
import { DialogContentText, Avatar, IconButton } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { grey } from '@material-ui/core/colors';
import Typography from '@material-ui/core/Typography';
import { useSnackbar } from 'notistack';
import axios from '../utils/axios';

const useStyles = makeStyles((theme) => ({
  imageContainer: {
    width: theme.spacing(48),
    height: theme.spacing(30),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBox: {
    width: '100%',
    height: '100%',
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
  uploadButton: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    marginBottom: theme.spacing(2), // 시각적으로 중심상에 있도록 margin 추가
  },
  addIcon: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  contentTextArea: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
}));

function PostDialog({ open, handleClose, catPost, isUpdate = false }) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [fileUrl, setFileUrl] = useState('');
  const [content, setContent] = useState('');

  const inputRef = useRef(null); // input file에 접근하기 위함

  const showError = (message) => {
    enqueueSnackbar(message, { variant: 'error' });
  };

  const showSuccess = (message) => {
    enqueueSnackbar(message, { variant: 'success' });
  };

  const handleFileUpload = async (event) => {
    try {
      const file = event.target.files[0];

      const formData = new FormData();
      formData.append('image', file);

      const result = (await axios.post('/utils/resources', formData)).data;
      setFileUrl(result.imageUrl);
      // showSuccess(result.imageUrl);
    } catch (error) {
      if (error.resposne) {
        const errMsg = error.response.data.message;

        if (Array.isArray(errMsg)) {
          showError(errMsg[0]);
        } else {
          showError(errMsg);
        }
      } else {
        showError(error.message);
      }
    }
  };

  const handleFileSelect = () => {
    inputRef.current.click();
  };

  const handleInputContent = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (!fileUrl || fileUrl.trim().length <= 0) {
        showError('사진을 업로드해주세요.');
        return;
      }

      if (!content || content.trim().length <= 0) {
        showError('사진 설명을 추가해주세요.');
        return;
      }

      let newPost = null;

      if (isUpdate) {
        // 포스트 수정
        newPost = (
          await axios.patch(`/cat-posts/${catPost.seqNo}`, {
            imageUrl: fileUrl,
            content,
          })
        ).data;

        showSuccess('포스트를 수정하였습니다');
      } else {
        // 포스트 생성
        newPost = (
          await axios.post('/cat-posts', {
            imageUrl: fileUrl,
            content,
          })
        ).data;

        showSuccess('포스트를 생성하였습니다');
      }

      // 초기화
      setFileUrl('');
      setContent('');

      handleClose(newPost);
    } catch (e) {
      if (e.response) {
        const errMsg = e.response.data.message;

        if (Array.isArray(errMsg)) {
          showError(errMsg[0]);
        } else {
          showError(errMsg);
        }
      } else {
        showError(e.message);
      }
    }
  };

  const handleCloseWithCancel = () => {
    setFileUrl('');
    setContent('');

    handleClose(null);
  };

  useEffect(() => {
    if (catPost && isUpdate) {
      setFileUrl(catPost.imageUrl);
      setContent(catPost.content);
    }
  }, [open]);

  let titleElement = null;

  if (catPost) {
    if (isUpdate) {
      titleElement = '포스트 수정';
    } else {
      titleElement = (
        <Box display="flex" flexDirection="row" alignItems="center">
          <Avatar alt={catPost.user.userId} className={classes.cardAvator}>
            {catPost.user.userId.length > 0
              ? catPost.user.userId[0]
              : 'unknown'}
          </Avatar>
          <Box ml={1.2}>
            <Typography>{catPost.user.userId}</Typography>
          </Box>
        </Box>
      );
    }
  } else {
    titleElement = '새 포스트 작성';
  }

  let imageElement = null;

  if (catPost) {
    if (isUpdate) {
      imageElement = (
        <Fragment>
          <Box onClick={handleFileSelect} className={classes.imageBox}>
            <img alt="커여운 고양이" src={fileUrl} className={classes.image} />
          </Box>
          <input
            type="file"
            name="image"
            onChange={handleFileUpload}
            accept="image/*"
            hidden="true"
            ref={inputRef}
          />
        </Fragment>
      );
    } else {
      imageElement = (
        <img
          alt="커여운 고양이"
          src={catPost.imageUrl}
          className={classes.image}
        />
      );
    }
  } else {
    imageElement = (
      <Fragment>
        {fileUrl ? (
          <img alt="커여운 고양이" src={fileUrl} className={classes.image} />
        ) : (
          <Fragment>
            <IconButton
              className={classes.uploadButton}
              onClick={handleFileSelect}
            >
              <AddIcon
                className={classes.addIcon}
                style={{ color: grey[500] }}
              />
            </IconButton>
            <input
              type="file"
              name="image"
              onChange={handleFileUpload}
              accept="image/*"
              hidden="true"
              ref={inputRef}
            />
          </Fragment>
        )}
      </Fragment>
    );
  }

  let contentElement = null;

  if (catPost) {
    if (isUpdate) {
      contentElement = (
        <TextField
          id="standard-multiline-static"
          label="사진 설명"
          multiline
          rows={4}
          placeholder="사진에 대한 설명을 해주세요!"
          className={classes.contentTextArea}
          onChange={handleInputContent}
          value={content}
        />
      );
    } else {
      contentElement = (
        <DialogContentText className={classes.contentTextArea}>
          {catPost.content}
        </DialogContentText>
      );
    }
  } else {
    contentElement = (
      <TextField
        id="standard-multiline-static"
        label="사진 설명"
        multiline
        rows={4}
        placeholder="사진에 대한 설명을 해주세요!"
        className={classes.contentTextArea}
        onChange={handleInputContent}
        value={content}
      />
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleCloseWithCancel}
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
        {catPost && !isUpdate ? (
          ''
        ) : (
          <Fragment>
            <Button onClick={handleCloseWithCancel} color="primary">
              취소
            </Button>
            <Button onClick={handleSubmit} color="primary">
              업로드
            </Button>
          </Fragment>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default PostDialog;
