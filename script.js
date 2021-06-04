const { applyMiddleware, createStore, combineReducers, bindActionCreators } = Redux;
const { Provider, connect } = ReactRedux;

const alarmClip = 'http://soundbible.com/mp3/Loud_Alarm_Clock_Buzzer-Muk1984-493547174.mp3';

const timer = 'new timer';
const startTime = 25 + ":00";
const defaultState = {
  timer: '25:00' };


const creator = stat => {
  return {
    type: timer,
    state: stat };

};

//Redux
const reducer = (defaultState, action) => {
  switch (action.type) {
    case 'new timer':
      return {
        timer: action.state };

    default:
      return defaultState;}

};

const store = Redux.createStore(reducer);

//React

class Clocktimer extends React.Component {
  constructor(props)
  {
    super(props);

    this.state = {
      breakLength: 5,
      sessionLength: 25,
      breakTimeSecs: 300,
      sessTimeSecs: 1500,
      timerLabel: 'Session',
      currentTime: 1500,
      showTime: "25:00",
      playPause: false,
      setTime: 1,
      soundClip: alarmClip,
      timeColor: { color: 'white' } };

    this.handleBreak = this.handleBreak.bind(this);
    this.handleSession = this.handleSession.bind(this);
    //  this.savetime= this.savetime.bind(this);
    this.handleTimer = this.handleTimer.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.clockTime = this.clockTime.bind(this);
    this.timerCount = this.timerCount.bind(this);
    // this.checkTime =this.checkTime.bind(this);
    this.warningAlert = this.warningAlert.bind(this);
    this.warningColor = this.warningColor.bind(this);
    this.setLengthTime = this.setLengthTime.bind(this);
  }

  warningAlert(timeLeft) {
    //var timeLeft = this.state.currentTime;

    if (timeLeft === 0) {
      var playNote = document.getElementById('beep');
      playNote.load();
      playNote.play();
    }
  }
  warningColor(timeLeft) {

    var color = timeLeft < 61 ?
    { color: '#a50d0d' } :
    { color: 'white' };

    return color;

  }
  timerCount() {
    //console.log("In timer "+this.state.currentTime);
    var timeLeft = this.state.currentTime;
    var timeLabel = this.state.timerLabel;
    var timeLeft = timeLeft - 1;
    var color = this.warningColor();

    if (timeLeft < 0) {

      timeLeft = timeLabel === 'Session' ?
      this.state.breakTimeSecs :
      this.state.sessTimeSecs;


      timeLabel = timeLabel === 'Session' ?
      'Break' :
      'Session';

    } // end of outer if
    this.warningAlert(timeLeft);
    this.setState({
      currentTime: timeLeft,
      timerLabel: timeLabel,
      timeColor: this.warningColor(timeLeft),
      showTime: this.clockTime(timeLeft) });

    console.log(this.clockTime(timeLeft) + " and " + timeLabel);
  }


  clockTime(timeLeft) {


    var totaltime = timeLeft;
    var minutes = Math.floor(totaltime / 60);
    var seconds = Math.floor(totaltime % 60);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return minutes + ":" + seconds;
  }

  async handleReset() {
    clearInterval(this.state.setTime);
    /*var x = document.getElementById("buzzer");
    
    x.currentTime =1;*/
    const audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;

    await this.setState({
      breakLength: 5,
      sessionLength: 25,
      breakTimeSecs: 300,
      sessTimeSecs: 1500,
      timerLabel: 'Session',
      currentTime: 1500,
      showTime: "25:00",
      playPause: false,
      timeColor: { color: 'white' } });

  }
  setLengthTime(Len, timeLabel, buttonClicked) {

    var Lensecs = Len * 60;
    //var button = buttonClicked.split("-").splice(0,1);
    var button = buttonClicked.split("-");
    //alert(Len+ " "+ timeLabel + " "+ button[0]);
    if (timeLabel === "Session" && button[0] === "session") {
      //alert("am here 1");
      this.setState({
        sessionLength: Len,
        sessTimeSecs: Lensecs,
        currentTime: Lensecs,
        showTime: this.clockTime(Lensecs) });

    } else
    if (timeLabel === "Break" && button[0] === "break") {
      // alert("am here 2");
      this.setState({
        breakLength: Len,
        breakTimeSecs: Lensecs,
        currentTime: Lensecs,
        showTime: this.clockTime(Lensecs) });

    } else

    if (timeLabel === "Break" && button[0] === "session") {
      // alert("am here 3");
      this.setState({
        sessionLength: Len,
        sessTimeSecs: Lensecs });

    } else

    {
      // alert("am here 4");
      this.setState({
        breakLength: Len,
        breakTimeSecs: Lensecs });

    }

  }


  async handleBreak(event) {
    var breakLen = this.state.breakLength;
    var iscounting = this.state.playPause;
    var buttonClicked = event.currentTarget.id;
    var timeLabel = this.state.timerLabel;
    if (!iscounting) {
      if (buttonClicked === "break-decrement") {
        if (--breakLen >= 1) {

          this.setLengthTime(breakLen, timeLabel, buttonClicked);
        } // end of inner if
      } // end of outer if
      else {
          if (++breakLen <= 60) {

            this.setLengthTime(breakLen, timeLabel, buttonClicked);
          }
        } // end of else
    } // end of iscounting
  } // end of handle break

  async handleSession(event) {

    var sessionLen = this.state.sessionLength;
    var iscounting = this.state.playPause;
    var buttonClicked = event.currentTarget.id;
    var timeLabel = this.state.timerLabel;
    if (!iscounting) {
      if (buttonClicked === "session-decrement") {
        if (--sessionLen >= 1) {
          this.setLengthTime(sessionLen, timeLabel, buttonClicked);
        } // end of if

      } // end of outer if
      else {
          if (++sessionLen <= 60) {
            this.setLengthTime(sessionLen, timeLabel, buttonClicked);
          }
        } // end of else
    } // if iscounting  
  }

  async handleTimer() {

    const regex = /[:]/;
    var playStatus = !this.state.playPause;

    await this.setState({
      playPause: playStatus });


    var sessionTime, breakTime, timeLabel, startSec, diff, totalTime, minutes, seconds, displayTime, displayLabel, setTimer, stringTime, arrayTime, timeleft, currentlabel;


    sessionTime = this.state.sessTimeSecs;
    breakTime = this.state.breakTimeSecs;
    timeLabel = this.state.timerLabel;
    startSec = Date.now();
    // totalTime = sessionTime;
    displayTime = document.querySelector('#time-left');
    displayLabel = document.querySelector('#timer-label');

    if (timeLabel === 'Session') {
      totalTime = sessionTime;
    } else
    {
      totalTime = breakTime;
    }

    if (!playStatus) {
      this.setState({
        currentTime: ++this.state.currentTime });

      clearInterval(this.state.setTime);
      // console.log("In pause "+this.state.currentTime);
    } else
    {
      this.timerCount();
      setTimer = setInterval(this.timerCount, 1000);
      await this.setState({
        setTime: setTimer });

    }
  }
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: "firstDiv" }, /*#__PURE__*/
      React.createElement("div", { id: "clock" }, /*#__PURE__*/
      React.createElement("h1", null, "25+5 Clock"), /*#__PURE__*/
      React.createElement("div", { id: "break-session" }, /*#__PURE__*/
      React.createElement("div", { id: "breakLength" }, /*#__PURE__*/
      React.createElement("h2", { id: "break-label" }, "Break Length"), /*#__PURE__*/
      React.createElement("div", { id: "breakTimer" }, /*#__PURE__*/
      React.createElement("button", { onClick: this.handleBreak, id: "break-decrement" }, /*#__PURE__*/
      React.createElement("i", { class: "fas fa-arrow-down" })), /*#__PURE__*/

      React.createElement("span", { id: "break-length" }, this.state.breakLength), /*#__PURE__*/
      React.createElement("button", { onClick: this.handleBreak, id: "break-increment" }, /*#__PURE__*/
      React.createElement("i", { class: "fas fa-arrow-up" })))), /*#__PURE__*/




      React.createElement("div", { id: "sessionLength" }, /*#__PURE__*/
      React.createElement("h2", { id: "session-label" }, "Session Length"), /*#__PURE__*/
      React.createElement("div", { id: "sessionTimer" }, /*#__PURE__*/
      React.createElement("button", { id: "session-decrement", onClick: this.handleSession }, /*#__PURE__*/
      React.createElement("i", { class: "fas fa-arrow-down" })), /*#__PURE__*/

      React.createElement("span", { id: "session-length" }, this.state.sessionLength), /*#__PURE__*/
      React.createElement("button", { id: "session-increment", onClick: this.handleSession }, /*#__PURE__*/
      React.createElement("i", { class: "fas fa-arrow-up" }))))), /*#__PURE__*/





      React.createElement("div", { id: "bottomHalf" }, /*#__PURE__*/
      React.createElement("div", { id: "sessionTime", style: this.state.timeColor }, /*#__PURE__*/
      React.createElement("p", { id: "timer-label" }, this.state.timerLabel), /*#__PURE__*/
      React.createElement("p", { id: "time-left" }, this.state.showTime)), /*#__PURE__*/

      React.createElement("div", { id: "playerIcons" }, /*#__PURE__*/
      React.createElement("button", { onClick: this.handleTimer }, /*#__PURE__*/
      React.createElement("i", { class: "fa fa-play", id: "start_stop" }), /*#__PURE__*/
      React.createElement("audio", { src: this.state.soundClip, id: "beep" })), /*#__PURE__*/

      React.createElement("i", { class: "fa fa-pause" }), /*#__PURE__*/
      React.createElement("button", { onClick: this.handleReset }, /*#__PURE__*/
      React.createElement("i", { class: "fas fa-sync-alt refresh", id: "reset" }))), /*#__PURE__*/


      React.createElement("p", { id: "phrase" }, "Designed and coded by"), /*#__PURE__*/
      React.createElement("p", { id: "author" }, "Ogbebor Ann")))));






  }}


const mapStateToProps = state => {
  return {
    theState: state };

};

const mapDispatchToProps = dispatch => {
  return {
    submitMessage: message => {
      dispatch(creator(message));
    } };

};

const Container = connect(mapStateToProps, mapDispatchToProps)(Clocktimer);

class ClockTimerWrapper extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return /*#__PURE__*/(
      React.createElement(Provider, { store: store }, /*#__PURE__*/
      React.createElement(Container, null)));


  }}


ReactDOM.render( /*#__PURE__*/React.createElement(ClockTimerWrapper, null), document.getElementById('clocktime'));