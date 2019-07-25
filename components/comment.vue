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
        />
        <input
          class="input user-name"
          type="text"
          v-model="comment.user_name"
          ref="user_name"
          placeholder="昵称（必填）"
        >
        <div class="g-r-center">
          <input
            class="input"
            type="email"
            v-model="comment.email"
            ref="email"
            placeholder="填写邮箱订阅动态（必填）"
          >
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
              <strong>{{ item.user_name }}</strong>
              <i>{{ item.city }}</i>
              <span>{{ item.creation_at | dateFormat('YYYY-MM-DD hh:mm') }}</span>
            </div>
            <div class="comment-centent">
              {{ item.content }}
              <div class="btn u_transition_300" @click="reply(index, item)">
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
              <strong>{{data.user_name + ' @ ' + data.reply_user}}</strong>
              <i>{{ data.city }}</i>
              <span>{{ data.creation_at | dateFormat('YYYY-MM-DD hh:mm') }}</span>
            </div>
            <div class="comment-centent">
              {{ data.content }}
              <div class="btn u_transition_300" @click="reply(index, data, item._id)">
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

<script lang='ts'>
'use strict'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { State } from 'vuex-class'

@Component
export default class Comment extends Vue {
  @Prop(Array)
  readonly list!: any
  @Prop(String)
  readonly type!: string

  // data
  @State('AVATAR_IMGHOST')
  AVATAR_IMGHOST
  @State('QN_POSTFIX')
  QN_POSTFIX

  avatar: string = ''
  comment: any = {
    content: '',
    user_name: '',
    email: ''
  }
  comment_msg_status: boolean = false // 提示信息状态
  request_status: boolean = false // 请求状态

  mounted() {
    this.avatar = localStorage.avatar || ''
    this.comment.user_name = localStorage.user_name || ''
    this.comment.email = localStorage.email || ''
  }

  /**
   * 头像上传
   */
  avatarUpload() {
    let formData = new FormData(),
      upload_obj = this.$refs.upload as HTMLInputElement

    formData.append('file', upload_obj.files[0])

    ;(<any>this).$axios
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
  }
  /**
   * 发表评论
   */
  submit() {
    let comment = this.comment,
      verification = {
        content: '评论内容不能为空',
        user_name: '昵称不能为空',
        email: '邮箱不能为空'
      }

    for (let i in verification) {
      let object = this.$refs[i] as HTMLInputElement

      if (!comment[i]) {
        object.focus()
        this.$message({ type: 'info', title: verification[i] })

        return
      } else if (
        i === 'email' &&
        !/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(
          comment[i]
        )
      ) {
        object.focus()
        this.$message({ type: 'info', title: '邮箱格式不正确' })

        return
      }
    }

    let params: any = {
      id: this.$route.query.id,
      content: comment.content,
      user_name: comment.user_name,
      email: comment.email,
      city: window.returnCitySN.cname,
      avatar: this.avatar,
      url: location.href
    }

    if (this.type !== 'guestbook') {
      params.acticle_title = this.$route.query.title
    }

    // 设置回复信息
    if (
      comment.reply_id &&
      comment.content.indexOf(`@${comment.reply_user}：`) !== -1
    ) {
      params.id = comment.reply_id
      params.content = comment.content.replace(`@${comment.reply_user}：`, '')
      params.reply_user = comment.reply_user
      params.reply_email = comment.reply_email
    }

    this.request_status = true
    ;(<any>this).$axios
      .post(
        this.type === 'guestbook' ? 'api/addGuestbook' : 'api/addComment',
        params
      )
      .then(res => {
        if (res.code === 0) {
          // 记录用户昵称
          localStorage.user_name = comment.user_name || ''
          localStorage.email = comment.email || ''
          this.comment.content = ''
          if (params.reply_user) {
            this.list[comment.reply_index].replys.push(res.data)
          } else {
            this.list.unshift(res.data)
          }

          this.$message({ type: 'success', title: res.message })
        } else {
          this.$message({ type: 'error', title: res.message })
        }
      })
  }

  /**
   * 评论
   * @param {Number} index - 评论下标
   * @param {Object} data - 回复的用户信息
   * @param {Object} id - 回复id
   */
  reply(index: number, data: any, id: string): void {
    this.comment = Object.assign(this.comment, {
      reply_id: id || data._id,
      reply_user: data.user_name,
      reply_email: data.email,
      reply_index: index,
      content: `@${data.user_name}：`
    })

    let scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop,
      content = this.$refs.content as HTMLInputElement

    window.scrollSkip = true
    setTimeout(() => {
      window.scrollSkip = false
    }, 50)
    window.scrollTo(0, content.getBoundingClientRect().top + scrollTop - 50)

    content.focus()
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
