import React, { useState, useEffect, Fragment, useContext } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Create';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';
import axios, { TOKEN_NAME } from '../utils/axios';
import { UserContext } from '../context/UserProvider';
import PostDialog from '../components/PostDialog';

const useStyles = makeStyles((theme) => ({
  appbarRoot: {
    flexGrow: 1,
  },
  appTitle: {
    flexGrow: 1,
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardAvator: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  fab: {
    position: 'fixed',
    right: 0,
    bottom: 0,
    marginBottom: theme.spacing(3),
    marginRight: theme.spacing(4),
  },
}));

export default function Main() {
  const classes = useStyles(); // css 설정 가져오기
  const [posts, setPosts] = useState([]); // CatPost 데이터
  const { enqueueSnackbar } = useSnackbar(); // 스낵바
  const { userState, setUserState } = useContext(UserContext); // 전역 유저 상태
  const [dialogOpen, setDialogOpen] = useState(false); // PostDialog 열림/닫힘 상태 관리
  const [selectedPost, setSelectedPost] = useState(null); // 현재 선택중인 post 관리
  const [isUpdate, setIsUpdate] = useState(false); // 현재 선택중인 post update 모드 관리
  const history = useHistory();

  const showError = (message) => {
    enqueueSnackbar(message, { variant: 'error' });
  };

  const showInfo = (message) => {
    enqueueSnackbar(message, { variant: 'info' });
  };

  const fetchUserInfo = async () => {
    try {
      const result = (await axios.get('/users/me')).data;
      setUserState(result);
    } catch (error) {
      if (error.response) {
        if (error.response.status !== 401) {
          const errMsg = error.response.data.message;

          if (Array.isArray(errMsg)) {
            showError(errMsg[0]);
          } else {
            showError(errMsg);
          }
        }
      } else {
        showError('유저 정보를 불러오는데 실패했습니다!');
      }
    }
  };

  const fetchCatPosts = async () => {
    try {
      const result = (await axios.get('/cat-posts')).data;
      setPosts(result);
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

  const handleDialogOpen = (catPost, updateMode) => {
    if (!userState) {
      showInfo('로그인 후 이용 가능합니다');
      return;
    }

    setIsUpdate(updateMode);
    setSelectedPost(catPost);
    setDialogOpen(true);
  };

  const handleDialogClose = (catPost) => {
    setDialogOpen(false);

    if (catPost) {
      setPosts([...posts, catPost]); // Dialog를 통해 새로 생성된 포스트가 있으면 추가
    }
  };

  const handleLogin = () => {
    history.push('/login');
  };

  const handleLogout = () => {
    localStorage.setItem(TOKEN_NAME, '');
    showInfo('로그아웃되었습니다');
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  };

  const processing = async () => {
    fetchUserInfo();
    fetchCatPosts();
  };

  // on create
  useEffect(() => {
    processing();
  }, []);

  return (
    <Fragment>
      <CssBaseline />
      <AppBar position="relative" className={classes.appbarRoot}>
        <Toolbar>
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            className={classes.appTitle}
          >
            나만 고양이 없어
          </Typography>
          {userState ? (
            <Button color="inherit" onClick={handleLogout}>
              로그아웃
            </Button>
          ) : (
            <Button color="inherit" onClick={handleLogin}>
              로그인
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <main>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {posts.map((catPost) => (
              <Grid item key={catPost.seqNo} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={catPost.imageUrl}
                    title="귀여운 고양이 사진입니다"
                  />
                  <CardContent className={classes.cardContent}>
                    <Box
                      display="flex"
                      flexDirection="row"
                      mb={2}
                      fontWeight="fontWeightLight"
                    >
                      <Avatar
                        alt={catPost.user.userId}
                        className={classes.cardAvator}
                      >
                        {catPost.user.userId.length > 0
                          ? catPost.user.userId[0]
                          : 'unknown'}
                      </Avatar>
                      <Box ml={1.2} mt={0.3}>
                        {catPost.user.userId}
                      </Box>
                    </Box>
                    <Typography>{catPost.content}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => {
                        handleDialogOpen(catPost);
                      }}
                    >
                      View
                    </Button>
                    {userState.seqNo === catPost.user.seqNo ? (
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => {
                          handleDialogOpen(catPost, true);
                        }}
                      >
                        Edit
                      </Button>
                    ) : (
                      ''
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        <Fab
          variant="extended"
          color="primary"
          aria-label="add"
          className={classes.fab}
          onClick={() => handleDialogOpen(null)}
        >
          <AddIcon className={classes.extendedIcon} />새 포스트 작성
        </Fab>
      </main>
      {/* CatPost 생성/수정 시 폼 화면 */}
      <PostDialog
        open={dialogOpen}
        handleClose={handleDialogClose}
        catPost={selectedPost}
        isUpdate={isUpdate}
      />
    </Fragment>
  );
}
