import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Pets from '@material-ui/icons/Pets';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useSnackbar } from 'notistack';
import axios from '../utils/axios';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  loginSpan: {
    fontWeight: 600,
  },
}));

export default function SignUp() {
  const classes = useStyles();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');

  const { enqueueSnackbar } = useSnackbar(); // 알림창 띄우기위함

  const handleInputUserId = (event) => {
    setUserId(event.target.value);
  };

  const handleInputPassword = (event) => {
    setPassword(event.target.value);
  };

  const handleInputRepassword = (event) => {
    setRepassword(event.target.value);
  };

  const showError = (message) => {
    enqueueSnackbar(message, { variant: 'error' });
  };

  const showSuccess = (message) => {
    enqueueSnackbar(message, { variant: 'success' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userId || userId.trim().length <= 0) {
      showError('유저 아이디가 비었습니다.');
      return;
    }

    if (!password || password.trim().length <= 0) {
      showError('비밀번호가 비었습니다.');
      return;
    }

    if (!repassword || repassword.trim().length <= 0) {
      showError('비밀번호 확인란이 비었습니다.');
      return;
    }

    if (password !== repassword) {
      showError('비밀번호와 비밀번호 확인 값이 다릅니다.');
      return;
    }

    try {
      // eslint-disable-next-line no-unused-vars
      const result = (
        await axios.post('/users', {
          userId,
          password,
        })
      ).data;

      setUserId('');
      setPassword('');
      setRepassword('');

      showSuccess('성공적으로 회원가입을 완료하였습니다.');
    } catch (error) {
      if (error.response) {
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

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <Pets />
        </Avatar>
        <Typography component="h1" variant="h5">
          회원가입
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="userId"
                label="아이디"
                name="id"
                autoComplete="username"
                onChange={handleInputUserId}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="비밀번호"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleInputPassword}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="비밀번호 확인"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleInputRepassword}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            가입 완료
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="#" variant="body2">
                이미 계정을 가지고 계시나요?{' '}
                <span className={classes.loginSpan}>로그인하기</span>
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
