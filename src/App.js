import tw, { styled } from 'twin.macro';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { BiPlay, BiPause, BiRefresh } from 'react-icons/bi';

import BeepSound from './assets/beep.mp3';

import { padNumber } from './utils';
import ButtonComponent from './ButtonComponent';
import GlobalStyle from './globalStyle';
import PageComponent from './PageComponent';
import ColumnComponent from './ColumnComponent';
import RowComponent from './RowComponent';
import CounterDialComponent from './CounterDialComponent';

const formatTimer = timer => {
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  return `${padNumber(minutes, 2, '0')}:${padNumber(seconds, 2, '0')}`;
};

const TimerStyledComponent = styled.div`
  ${tw`flex flex-col items-center`}
`;

const TimerContentStyledComponent = styled.div`
  ${tw`flex flex-col items-center`}
`;

const TimerValueContainerStyledComponent = styled.div`
  ${tw`text-3xl`}
`;

const TimerButtonsContainerStyledComponent = styled.div`
  ${tw`flex items-center`}
`;

const BREAK_CHANGE_ACTION = 'break-change';
const SESSION_CHANGE_ACTION = 'session-change';
const SET_TIMER_ACTION = 'set-timer';
const SWAP_TIMER_ACTION = 'swap-timer';
const DECREMENT_TIMER_ACTION = 'decrement-timer';
const SET_TIMER_STATE_ACTION = 'set-timer-state';
const SET_TIMER_TYPE_ACTION = 'set-timer-type';
const SET_TIMER_ID = 'set-timer-id';
const RESET_TIMER = 'reset-timer';

const TIMER_TYPE_ENUM = Object.freeze({
  SESSION: 'Session',
  BREAK: 'Break'
});

const TIMER_STATE_ENUM = Object.freeze({
  PAUSED: 'PAUSED',
  RUNNING: 'RUNNING',
  DONE: 'DONE'
});

const initialState = {
  break: 5,
  session: 25,
  timer: 25 * 60,
  timerState: TIMER_STATE_ENUM.DONE,
  timerType: TIMER_TYPE_ENUM.SESSION,
  timerId: null
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case BREAK_CHANGE_ACTION:
      return { ...state, break: payload };
    case SESSION_CHANGE_ACTION:
      return { ...state, session: payload };
    case SET_TIMER_ACTION:
      return { ...state, timer: payload * 60 };
    case SWAP_TIMER_ACTION:
      return {
        ...state,
        timer: state.timerType === TIMER_TYPE_ENUM.SESSION ? state.break * 60 : state.session * 60,
        timerType: state.timerType === TIMER_TYPE_ENUM.SESSION ? TIMER_TYPE_ENUM.BREAK : TIMER_TYPE_ENUM.SESSION
      };
    case DECREMENT_TIMER_ACTION:
      return { ...state, timer: state.timer - 1 };
    case SET_TIMER_STATE_ACTION:
      return { ...state, timerState: payload };
    case SET_TIMER_TYPE_ACTION:
      return { ...state, timerType: payload };
    case SET_TIMER_ID:
      return { ...state, timerId: payload };
    case RESET_TIMER:
      return initialState;
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const audioRef = useRef();

  useEffect(() => {
    dispatch({ type: RESET_TIMER });
  }, []);

  useEffect(() => {
    if (state.timer === 0) {
      audioRef.current.play();
      clearInterval(state.timerId);

      dispatch({ type: SWAP_TIMER_ACTION });

      const timerId = setInterval(() => {
        dispatch({ type: DECREMENT_TIMER_ACTION });
      }, 1000);

      dispatch({ type: SET_TIMER_ID, payload: timerId });
    }
  }, [state.timer, state.timerId, audioRef]);

  const onClickStartStopHandler = useCallback(() => {
    if (state.timerId) {
      dispatch({ type: SET_TIMER_STATE_ACTION, payload: TIMER_STATE_ENUM.PAUSED });
      dispatch({ type: SET_TIMER_ID, payload: null });
      return clearInterval(state.timerId);
    }

    const timerId = setInterval(() => {
      dispatch({ type: DECREMENT_TIMER_ACTION });
    }, 1000);

    dispatch({ type: SET_TIMER_STATE_ACTION, payload: TIMER_STATE_ENUM.RUNNING });
    dispatch({ type: SET_TIMER_ID, payload: timerId });
  }, [state.timerId]);

  const onClickResetHandler = useCallback(() => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;

    if (state.timerId) clearInterval(state.timerId);

    dispatch({ type: RESET_TIMER });
  }, [state.timerId, audioRef]);

  return (
    <>
      <GlobalStyle />
      <audio ref={audioRef} id="beep">
        <source src={BeepSound} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      <PageComponent title="25 + 5 Clock!">
        <RowComponent>
          <ColumnComponent>
            <CounterDialComponent
              label="Break Length"
              labelId="break-label"
              upButtonId="break-increment"
              downButtonId="break-decrement"
              counterValueId="break-length"
              disableButtons={state.timerState !== TIMER_STATE_ENUM.DONE}
              length={state.break}
              onChange={v => {
                dispatch({ type: BREAK_CHANGE_ACTION, payload: v });
              }}
            />
          </ColumnComponent>
          <ColumnComponent>
            <CounterDialComponent
              label="Session Length"
              labelId="session-label"
              upButtonId="session-increment"
              downButtonId="session-decrement"
              counterValueId="session-length"
              disableButtons={state.timerState !== TIMER_STATE_ENUM.DONE}
              length={state.session}
              onChange={v => {
                dispatch({ type: SESSION_CHANGE_ACTION, payload: v });
                dispatch({ type: SET_TIMER_ACTION, payload: v });
              }}
            />
          </ColumnComponent>
        </RowComponent>
        <RowComponent>
          <ColumnComponent>
            <TimerStyledComponent>
              <h1 id="timer-label">{state.timerType}</h1>
              <TimerContentStyledComponent>
                <TimerValueContainerStyledComponent id="time-left">
                  {formatTimer(state.timer)}
                </TimerValueContainerStyledComponent>
                <TimerButtonsContainerStyledComponent>
                  <ButtonComponent
                    id="start_stop"
                    icon={state.timerState === TIMER_STATE_ENUM.RUNNING ? BiPause : BiPlay}
                    onClick={onClickStartStopHandler}
                  />
                  <ButtonComponent id="reset" icon={BiRefresh} onClick={onClickResetHandler} />
                </TimerButtonsContainerStyledComponent>
              </TimerContentStyledComponent>
            </TimerStyledComponent>
          </ColumnComponent>
        </RowComponent>
      </PageComponent>
    </>
  );
}

export default App;
