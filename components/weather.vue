<template>
  <div id="weather" :class="{isMobile: device.isMobile}">
    <section class="g-c-center" v-if="weather_ifno.currentCity">
      <i :class="`iconfont icon-${weather_ifno.picture_icon}`"></i>
      <p class="cityName">{{ weather_ifno.currentCity }}</p>
      <div class="info g-r-center">
        <p>
          <span>{{ weather_ifno.currentCity }}</span>
          <b>{{ weather_ifno.weather_data[0].weather }}</b>
        </p>
        <strong>{{ 24 || weather_ifno.weather_data[0].date }}ﾟ</strong>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import jsonp from 'jsonp'

export default {
  data() {
    return {
      weather_ifno: {},
      sunlightStatus: null
    }
  },
  computed: {
    ...mapState(['device'])
  },
  mounted() {
    jsonp(
      `http://api.map.baidu.com/telematics/v3/weather?location=${
        returnCitySN.cname
      }&output=json&ak=cgLTnAd8d2q50s2vAM32yyXsfqchIAix`,
      {},
      (err, data) => {
        let weather_ifno = data.results[0]

        weather_ifno.weather_data[0].date.match(/：(\d*)/)[1]
        weather_ifno.currentCity = weather_ifno.currentCity.replace(/\S*省/, '')
        weather_ifno.picture_icon = weather_ifno.weather_data[0].dayPictureUrl.match(
          /\/([a-z]*)\.png/
        )[1]

        this.weather_ifno = weather_ifno
        console.log(this.weather_ifno)
      }
    )
  }
}
</script>

<style lang="scss" scoped>
#weather {
  height: 150px;
  width: 100%;
  margin-bottom: 10px;
  &.isMobile {
    left: 0 !important;
    opacity: 1 !important;
  }
  .iconfont {
    display: block;
    font-size: 60px;
    &:before {
      content: '\e61c';
    }
  }
  .cityName {
    display: none;
    font-size: 16px;
  }
  .info {
    flex: none;
    p {
      padding: 0 10px;
      text-align: center;
    }
    span {
      font-size: 25px;
    }
    b {
      display: block;
      color: #333;
      font-size: 12px;
    }
    strong {
      font-size: 35px;
    }
  }
}

@media (max-width: 375px) {
  #weather {
    .iconfont {
      font-size: 40px;
    }
    .info {
      p {
        padding: 0 5px;
      }
      span {
        display: none;
      }
      strong {
        font-size: 25px !important;
      }
    }
  }
}

@media (max-width: 635px) {
  #weather {
    .iconfont {
      font-size: 50px;
    }
    .info {
      span {
        display: none;
      }
    }
    .cityName {
      display: block;
    }
  }
}
</style>
