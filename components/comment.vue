<template>
  <div id="comment">
    <!-- 评论模块 -->
    <div class="comment-form">
      <div class="comment-avatar">
        <input class="upload" type="file" ref="upload" @change="avatarUpload">
        <div class="box">
          <img v-if="avatar" :src="AVATAR_IMGHOST + avatar + QN_POSTFIX + 100" alt>
          <i v-else class="iconfont icon-upload" style="font-size: 30px;"/>
        </div>
      </div>
      <section class="clear">
        <textarea
          class="input"
          v-model="comment.content"
          maxlength="200"
          placeholder="说点什么吧..."
          ref="content"
          required
        />
        <input class="input user-name" type="text" v-model="comment.user_name" placeholder="昵称（必填）">
        <div class="g-r-center">
          <input class="input" type="email" v-model="comment.email" placeholder="填写邮箱订阅动态（选填）">
          <button
            class="g-button u_transition_300"
            :class="{active: comment.content && comment.user_name}"
            @click="submit()"
          >{{ type === 'guestbook' ? '发表留言' : '发表评论' }}</button>
        </div>
      </section>
    </div>
    <!-- 评论列表 -->
    <div class="comment-list">
      <header :class="{guestbook: type === 'guestbook'}">
        <p>
          <span v-if="list">{{ list.length || 0 }}</span>
          条{{ type === 'guestbook' ? '留言' : '评论' }}
        </p>
      </header>
      <section v-for="(item, index) in list" :key="index">
        <div class="comment g-r-center">
          <div class="portrait">
            <img v-if="item.avatar" :src="AVATAR_IMGHOST + item.avatar + QN_POSTFIX + 100" alt>
            <i v-else class="iconfont icon-codestore"/>
          </div>
          <div class="box">
            <div class="comment-info">
              <strong>{{ item.user_name || '匿名' }}</strong>
              <i>{{ item.city }}</i>
              <span>{{ item.creation_at | dateFormat('YYYY-MM-DD hh:mm') }}</span>
            </div>
            <div class="comment-centent">
              {{ item.content }}
              <div class="btn u_transition_300" @click="reply(index, item._id, item.user_name)">
                <i class="iconfont icon-huifu1"/>
                <span>回复</span>
              </div>
            </div>
          </div>
        </div>
        <section class="reply g-r-center" v-for="(data, i) in item.replys" :key="i">
          <div class="portrait">
            <img v-if="item.avatar" :src="AVATAR_IMGHOST + data.avatar + QN_POSTFIX + 100" alt>
            <i v-else class="iconfont icon-codestore"/>
          </div>
          <div class="box">
            <div class="comment-info">
              <strong>{{ data.reply_user ? (data.user_name || '匿名') + ' @ ' + data.reply_user : '匿名' }}</strong>
              <i>{{ data.city }}</i>
              <span>{{ data.creation_at | dateFormat('YYYY-MM-DD hh:mm') }}</span>
            </div>
            <div class="comment-centent">
              {{ data.content }}
              <div class="btn u_transition_300" @click="reply(index, item._id, data.user_name)">
                <i class="iconfont icon-huifu1"/>
                <span>回复</span>
              </div>
            </div>
          </div>
        </section>
      </section>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['list', 'type'],
  data() {
    return {
      avatar: '',
      comment: {
        content: '',
        user_name: '',
        email: ''
      },
      comment_msg_status: false, // 提示信息状态
      request_status: false // 请求状态
    }
  },
  computed: {
    ...mapState(['AVATAR_IMGHOST', 'QN_POSTFIX'])
  },
  mounted() {
    this.avatar = localStorage.avatar || ''
    this.comment.user_name = localStorage.user_name || ''
    this.comment.email = localStorage.email || ''
  },
  methods: {
    /**
     * 头像上传
     */
    avatarUpload() {
      let formData = new FormData(),
        file = this.$refs.upload.files[0]

      formData.append('file', file)

      this.$axios
        .post('/api/avatarUpload', formData, { type: 'upload' })
        .then(res => {
          if (res.code === 0) {
            this.avatar = res.data.avatar
            this.$message({ type: 'success', title: '上传头像成功' })
            localStorage.avatar = res.data.avatar
          } else {
            this.$message({ type: 'error', title: '上传头像失败' })
          }
        })
    },
    /**
     * 发表评论
     */
    submit() {
      let { ...c } = this.comment

      if (!c.content) {
        this.$message({ type: 'info', title: '评论内容不能为空' })
      } else if (!c.user_name) {
        this.$message({ type: 'info', title: '昵称不能为空' })
      } else {
        let params = {
          id: this.$route.query.id,
          content: c.content,
          user_name: c.user_name,
          email: c.email,
          city: returnCitySN.cname,
          avatar: this.avatar
        }

        if (c.reply_id && c.content.indexOf(`@${c.reply_user}：`) !== -1) {
          params.id = c.reply_id
          params.content = c.content.replace(`@${c.reply_user}：`, '')
          params.reply_user = c.reply_user
        }

        this.request_status = true
        this.$axios
          .post(
            this.type === 'guestbook' ? 'api/addGuestbook' : 'api/addComment',
            params
          )
          .then(res => {
            if (res.code === 0) {
              // 记录用户昵称
              localStorage.user_name = c.user_name || ''
              localStorage.email = c.email || ''
              this.comment.content = ''
              if (params.reply_user) {
                this.list[c.reply_index].replys.push(res.data)
              } else {
                this.list.unshift(res.data)
              }

              this.$message({ type: 'success', title: res.message })
            } else {
              this.$message({ type: 'error', title: res.message })
            }
          })
      }
    },
    /**
     * 评论
     * @param {Number} index - 评论下标
     * @param {String} reply_id - 回复评论id
     * @param {String} reply_user - 回复评论用户
     */
    reply(index, reply_id, reply_user) {
      this.comment.reply_id = reply_id
      this.comment.reply_user = reply_user
      this.comment.reply_index = index
      this.comment.content = `@${reply_user}：`

      let scrollTop =
          document.body.scrollTop || document.documentElement.scrollTop,
        content = this.$refs.content

      window.scrollSkip = true
      setTimeout(() => {
        window.scrollSkip = false
      }, 50)
      window.scrollTo(0, content.getBoundingClientRect().top + scrollTop - 50)

      content.focus()
    }
  }
}
</script>

<style lang="scss" scoped>
$defaultColor: #1e212b;
#comment {
  position: relative;
  margin-top: 40px;
  .input {
    width: 100%;
    height: 36px;
    padding: 6px 10px;
    font-size: 14px;
    font-family: inherit;
    background-color: #fcfcfc;
    border: none;
    border-radius: 4px;
    border: 1px solid $defaultColor;
    color: #333;
    outline: none;
    &.user-name {
      margin-bottom: 10px;
    }
  }
  textarea.input {
    float: left;
    height: 90px;
    padding: 15px 10px 10px;
    margin-bottom: 10px;
    resize: none;
  }
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
      .upload {
        position: absolute;
        left: 5px;
        width: 50px;
        height: 50px;
        opacity: 0;
        cursor: pointer;
      }
      .box {
        width: 50px;
        height: 50px;
        margin-left: 5px;
        border: 1px solid $defaultColor;
        border-radius: 50%;
        img {
          width: 48px;
          height: 48px;
          border-radius: 50%;
        }
        i {
          color: $defaultColor;
        }
      }
    }
    section {
      position: relative;
      .g-r-center {
        input {
          flex: 1;
        }
        .g-button {
          margin-left: 20px;
          background: $defaultColor;
        }
      }
    }
  }
  .comment-list {
    padding: 40px 0 15px;
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
      &.guestbook::after {
        content: '留言';
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
      padding-top: 15px;
      align-items: flex-start;
      .comment {
        border-bottom: 1px solid #f1f1f1;
        align-items: flex-start;
        &:hover .box .comment-centent .btn {
          visibility: visible;
          opacity: 1;
        }
      }
      &.reply {
        margin-left: 30px;
        border-bottom: 1px solid #f1f1f1;
        &:hover .box .comment-centent .btn {
          visibility: visible;
          opacity: 1;
        }
      }
      .portrait {
        width: 40px;
        height: 40px;
        margin-right: 10px;
        line-height: 40px;
        text-align: center;
        border-radius: 50%;
        background-color: #cecec4;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        i {
          color: #fff;
          font-size: 25px;
        }
      }
      .box {
        flex: 1;
        .comment-info {
          display: flex;
          strong {
            color: $defaultColor;
          }
          i {
            padding: 0 10px;
            font-style: normal;
            font-size: 12px;
            color: #8590a6;
          }
          span {
            flex: 1;
            font-size: 12px;
            color: #8590a6;
            text-align: right;
          }
        }
        .comment-centent {
          position: relative;
          padding: 10px 0 30px;
          word-break: break-all;
          .btn {
            visibility: hidden;
            position: absolute;
            bottom: 4px;
            right: 0;
            color: $defaultColor;
            opacity: 0;
            cursor: pointer;
            i {
              width: 30px;
              color: $defaultColor;
            }
          }
        }
      }
    }
  }
}

@media (max-width: 750px) {
  #comment {
    .comment-form {
      section {
        padding-bottom: 55px;
      }
    }
    .comment-list {
      padding-top: 20px;
    }
    .comment-centent {
      .btn {
        visibility: visible !important;
        opacity: 1 !important;
      }
    }
  }

  .g-button {
    position: absolute;
    right: 0;
    bottom: 10px;
  }
}
</style>
