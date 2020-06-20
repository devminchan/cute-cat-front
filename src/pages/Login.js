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
import { useHistory } from 'react-router-dom';
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

  const { enqueueSnackbar } = useSnackbar(); // 알림창 띄우기위함
  const history = useHistory(); // 프로그래밍방식 라우팅을 위함

  const handleInputUserId = (event) => {
    setUserId(event.target.value);
  };

  const handleInputPassword = (event) => {
    setPassword(event.target.value);
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

    try {
      const { token } = (
        await axios.post('/auth/login', {
          userId,
          password,
        })
      ).data;

      localStorage.setItem('token', token);

      axios.interceptors.request.use(
        (config) => {
          // eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `bearer ${token}`;
          return config;
        },
        (error) => {
          Promise.reject(error);
        },
      );

      setUserId('');
      setPassword('');

      showSuccess('로그인 성공');

      history.push('/');
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
          로그인
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
                value={userId}
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
                value={password}
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
            로그인
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/register" variant="body2">
                계정이 없으신가요?{' '}
                <span className={classes.loginSpan}>회원가입</span>
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
