function genGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

var v = new Vue({
  el: '#app',
  data: {
    gameGuid: genGuid(),
    player: null,
    count: 0,
    currentQuestion: {
      idx: -1,
      questionItem: null,
    },
    dialog: {
      visible: false,
    },
    options: [{
      value: 'A',
      label: 'A'
    }, {
      value: 'B',
      label: 'B'
    }],
    idx: 0,
    answer: null,
    messageBoxDurationConfig: { success: 30000, error: 60000 },
    urlPath: 'api/v1/game/',
  },
  methods: {
    onAnswer() {
      this.dialog.visible = false;
      var that = this;
      axios.post(this.urlPath + "answer_question",
        {
          idx: this.currentQuestion.idx,
          answer: this.answer,
          player: this.player,
          gameGuid: this.gameGuid
        })
        .then(function (response) {
          if (that.currentQuestion.idx == that.count - 1) {//last question
            that.showGameResult(that.gameGuid);
          } else {
            that.getQuestion(that.currentQuestion.idx + 1);
          }
        })
        .catch(function (error) {
          console.log(error);
        });

    },
    getQuestion(idx) {
      var that = this;
      axios.post(this.urlPath + "get_question", {
        idx: idx
      })
      .then(function (response) {
        that.currentQuestion = response.data;
        that.idx = that.currentQuestion.idx;
        that.answer = null;
        that.dialog.visible = true;
      })
      .catch(function (error) {
        console.log(error);
      });
    },

    showGameResult(gameGuid) {
      this.idx++; 
      var that = this;

      axios.post(this.urlPath + "game_result", {
        gameGuid: this.gameGuid
      })
      .then(function (response) {
        let records = response.data;
        that.drawChart(_.map(_.sortBy(response.data,'idx'), obj=>obj.score));
      })
      .catch(function (error) {
        console.log(error);
      });
    },

    drawChart(grades){
      Highcharts.chart('report-container', {
        chart: {
          type: 'bar'
        },
        title: {
          text: 'Your Score: ' + _.sum(grades).toString() + " of " + grades.length.toString()
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: _.map(_.range(0, this.count), (value) => "Question " + (value+1).toString()), 
          title: {
            text: null
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Score',
            align: 'high'
          },
          labels: {
            overflow: 'justify'
          }
        },
        tooltip: {
          valueSuffix: ''
        },
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: true
            }
          }
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'top',
          x: 0,
          y: 120,
          floating: true,
          borderWidth: 1,
          backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
          shadow: true
        },
        credits: {
          enabled: false
        },
        series: [{
          name: this.player + "'s Score",
          data: grades
        }, {
          name: 'Average Score',
          data: [0.5,0.6,0.4]
        }]
      });
    },

    restartGame(){
      this.idx = 0;
      this.answer = null;
      this.gameGuid = genGuid();
      this.getQuestion(0);
    }
  },
  mounted() {
    var that = this;

    this.$prompt('Please input your name', 'Prompt', {
      confirmButtonText: 'OK',
      showCancelButton: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
    })
    .then(({ value }) => {
      this.$message({
        type: 'success',
        message: 'Welcome: ' + value
      });
      that.player = value;

      if (that.count > 0) {
        that.getQuestion(0);
      }
    })
    .catch(() => {
      this.$message({
        type: 'info',
        message: 'Cancelled, will use "No_name"'
      });
      that.player = "No_name";
    });

    axios.get(this.urlPath + "get_question_count")
    .then(function (response) {
      that.count = response.data.count;
    })
    .catch(function (error) {
      console.log(error);
    });
  }
});