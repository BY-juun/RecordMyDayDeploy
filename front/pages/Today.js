import React, { useEffect, useState } from 'react';
import TopLayout from '../components/TopLayout';
import BottomLayout from '../components/BottomLayout';
import { makeStyles } from '@material-ui/core/styles';
import ScheduleList from '../components/ScheduleList';
import Chip from '@material-ui/core/Chip';
import wrapper from "../store/configureStore";
import { END } from 'redux-saga';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import { LOAD_TODAY_REQUEST } from '../reducers/day';
import Router from 'next/router';
import AlarmOffIcon from '@material-ui/icons/AlarmOff';

import { Snackbar } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }


const useStyles = makeStyles((theme) => ({
  TodayWrapper: {
    textAlign: "center",
    marginTop: "30px",
  },
  icon: {
    color: "#f48fb1",
    fontSize: "65px",
  },
  noSchedule: {
    marginTop: "170px",
  },
  noScheduleComment: {
    marginTop: "30px",
    fontSize: "20px",
  },
  snackbar : {
    marginTop : "350px",
  },
  chipp : {
    marginBottom : "15px",
  }
}));

const Today = () => {
  const { User } = useSelector((state) => state.user);
  const classes = useStyles();
  const today = new Date();
  const { todayPlan } = useSelector((state) => state.day);
  const { submitTimeDone } = useSelector((state) => state.plan);
  const scheduleArr = todayPlan?.Plans;
  const dayinfo = String(today.getFullYear()) + " " + String(today.getMonth() + 1) + " " + String(today.getDate());
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!User) {
      setOpen(true);
      setTimeout(() => {
        Router.push('/');
      }, 2000);
    }
  }, [User])
  useEffect(() => {
    if (submitTimeDone) {
      Router.push('/Today');
    }
  }, [submitTimeDone])

  return (
    <>
      <TopLayout></TopLayout>
      {User &&
        <div className={classes.TodayWrapper}>
          <h2>????????? ??????!</h2>
          <Chip className = {classes.chipp} label={dayinfo} color="primary" variant="outlined" />
          {!scheduleArr &&
            <div className={classes.noSchedule}>
              <AlarmOffIcon className={classes.icon} />
              <div className={classes.noScheduleComment}>?????? ?????? ????????? ????????????</div>
            </div>}
          {scheduleArr && scheduleArr.map((value, index) =>
            <ScheduleList
              value={value.content}
              id={value.id}
              PropStartTime={value.starttime}
              PropEndTime={value.endtime}
              PropTotalTime={value.totaltime}
              key={index} />
          )}
        </div>
      }
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        className={classes.snackbar}
      >
        <Alert severity="error">
          ????????? ??? ?????? ???????????????.
                </Alert>
      </Snackbar>
      <BottomLayout value = {'today'}></BottomLayout>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  async ({ req, res }) => {
    //?????? ?????????????????? cookie??? ????????? ??????????????? , SSR????????? ???????????? ????????? ???????????? ????????????????????? ????????? ????????? ????????? ???????????? ??????.
    const cookie = req ? req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';
    if (req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    })
    store.dispatch({
      type: LOAD_TODAY_REQUEST,
    })
    store.dispatch(END);
    await store.sagaTask.toPromise();
  });

export default Today;