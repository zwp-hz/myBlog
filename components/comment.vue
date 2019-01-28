<template>
  <div id="comment">
    <div class="comment-form">
      <div class="comment-avatar">
        <div class="box">
          <i class="iconfont icon-huifu" style="font-size: 30px;"/>
        </div>
      </div>
      <form class="clear" @submit.prevent="submit">
        <div class="form-row clear">
          <span
            class="comment_msg u_transition_300"
            :class="{show: comment_msg,hide: comment_msg_status}"
          >{{ comment_msg }}</span>
          <textarea
            class="input"
            v-model="comment_data.content"
            maxlength="200"
            placeholder="说点什么吧..."
            required
          />
        </div>
        <div class="form-row clear">
          <input
            v-if="checkbox_status"
            class="input"
            v-model="comment_data.nickname"
            placeholder="昵称"
            required
          >
          <input v-else class="input" disabled placeholder="昵称">
        </div>
        <div class="form-row text-right">
          <label for="comment-anonymous">
            <input
              id="comment-anonymous"
              type="checkbox"
              @click="checkbox_status = !checkbox_status"
              style="float: inherit;"
            >
            匿名发表
          </label>
        </div>
        <div
          class="form-row submit-btn u_transition_300"
          :class="{u_in_request: request_status}"
          style="float: right;"
        >
          <i/>
          <input type="submit" value="发表评论">
        </div>
      </form>
    </div>
    <div class="comment-list">
      <header>
        <p>
          <span v-if="commentList">{{ commentList.length }}</span>条评论
        </p>
      </header>
      <!-- <h3>最新评论</h3> -->
      <section class="g-r-center" v-for="(item, index) in commentList" :key="index">
        <div class="portrait">
          <i class="iconfont icon-codestore"/>
        </div>
        <div class="box">
          <div class="comment-info">
            <strong>{{ item.nickname || '匿名' }}</strong>
            <i>{{ item.city }}</i>
            <span>{{ item.creation_at | dateFormat('YYYY年MM月DD日 hh:mm') }}</span>
          </div>
          <div class="comment-centent">{{ item.content }}</div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  props: ['commentList'],
  data() {
    return {
      comment_data: {},
      comment_msg: '', // 提交评论 提示信息
      comment_msg_status: false, // 提示信息状态
      request_status: false, // 请求状态
      checkbox_status: true
    }
  },
  mounted() {
    this.comment_data.nickname = localStorage.nickname || ''
  },
  methods: {
    // 发表评论
    submit() {
      this.request_status = true
      if (!this.checkbox_status) delete this.comment_data.nickname

      // 添加评论
      this.$axios
        .post(
          'api/setComment',
          Object.assign(this.comment_data, {
            id: this.$route.query.id,
            city: this.$store.state.city
          })
        )
        .then(res => {
          if (res.code === 0) {
            // 记录用户昵称
            localStorage.nickname = this.comment_data.nickname || ''
            this.commentList.push(res.data)
            this.comment_data.content = ''
            this.setCommentMsg(res.message)
          } else {
            this.comment_msg = res.message
            this.setCommentMsg(res.message)
          }
        })
    },
    // 设置评论提示信息
    setCommentMsg(text) {
      this.comment_msg = text
      this.request_status = false

      setTimeout(() => {
        this.comment_msg_status = true

        setTimeout(() => {
          this.comment_msg = ''
          this.comment_msg_status = false
        }, 300)
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
$defaultColor: #1ed9be;
#comment {
  position: relative;
  margin-top: 40px;
  .comment-form {
    .comment-avatar {
      position: absolute;
      top: -40px;
      left: 20px;
      z-index: 100;
      height: 50px;
      width: 60px;
      line-height: 50px;
      text-align: center;
      background-color: #fff;
      .box {
        width: 50px;
        height: 50px;
        margin-left: 5px;
        border: 1px solid $defaultColor;
        border-radius: 50%;
        i {
          color: $defaultColor;
        }
      }
    }
    form {
      .form-row {
        position: relative;
        margin-bottom: 5px;
        .comment_msg {
          position: absolute;
          top: 0%;
          left: 50%;
          padding: 5px 20px;
          color: #fff;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 6px;
          -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
          opacity: 0;
          &.show {
            top: 50%;
            opacity: 1;
          }
          &.hide {
            top: 100%;
            opacity: 0;
          }
        }
        .input {
          background-color: #fcfcfc;
          border: none;
          border-radius: 6px;
          border: 1px solid $defaultColor;
          color: #555f77;
          font-family: inherit;
          font-size: 14px;
          padding: 5px 10px;
          outline: none;
          width: 100%;
        }
        label {
          color: #555f77;
          font-family: inherit;
          font-size: 14px;
        }
        textarea.input {
          height: 100px;
          padding: 20px 10px 15px;
          resize: none;
        }
        &.submit-btn {
          float: right;
          border-radius: 6px;
          background-color: $defaultColor;
          i {
            display: none;
            position: absolute;
            top: 9px;
            left: 10px;
            width: 15px;
            height: 15px;
            color: #fff;
            border: 1px solid #fff;
            border-bottom-color: transparent;
            border-right-color: transparent;
            border-radius: 100%;
          }
          input {
            padding: 8px 20px;
            color: #fff;
            cursor: pointer;
          }
          &.u_in_request {
            padding-left: 10px;
            i {
              display: block;
            }
          }
        }
      }
    }
  }
  .comment-list {
    padding: 15px 0;
    header {
      position: relative;
      height: 30px;
      margin-bottom: 15px;
      line-height: 30px;
      text-align: right;
      color: $defaultColor;
      border-bottom: 1px solid $defaultColor;
      &:after {
        content: '评论';
        position: absolute;
        top: -1px;
        left: 0;
        width: 66px;
        height: 30px;
        text-align: center;
        border: 1px solid $defaultColor;
        border-bottom: none;
        border-radius: 6px 6px 0 0;
        background-color: #fff;
      }
      span {
        padding-right: 5px;
        font-size: 20px;
        font-weight: bold;
      }
    }
    h3 {
      margin-top: 15px;
      padding-left: 10px;
      font-size: 15px;
      color: $defaultColor;
      border-left: 4px solid $defaultColor;
      border-radius: 3px;
    }
    section {
      padding: 15px 0;
      border-bottom: 1px dashed #cecec4;
      align-items: flex-start;
      .portrait {
        width: 50px;
        height: 50px;
        margin-right: 15px;
        line-height: 50px;
        text-align: center;
        border-radius: 50%;
        background-color: #cecec4;
        i {
          color: #fff;
          font-size: 30px;
        }
      }
      .box {
        flex: 1;
        .comment-info {
          strong {
            color: $defaultColor;
          }
          i {
            padding-left: 15px;
            font-style: normal;
            font-size: 12px;
            color: #cecec4;
          }
          span {
            float: right;
            font-size: 12px;
            color: #cecec4;
          }
        }
        .comment-centent {
          padding-top: 10px;
          word-break: break-all;
        }
      }
    }
  }
}
</style>
