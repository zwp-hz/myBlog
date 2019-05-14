import Vue from 'vue'
import Main from './main.vue'
let MessageConstructor = Vue.extend(Main),
  instance,
  instances = [],
  seed = 1

const Message = options => {
  let id = 'message_' + seed++,
    verticalOffset = 0

  options.onClose = () => {
    Message.close(id)
  }

  instance = new MessageConstructor({
    data: options
  })
  instance.id = id
  instance.vm = instance.$mount()
  instance.dom = instance.$el
  // 注入dom
  if (!document.getElementById('message')) {
    let message = document.createElement('div')

    message.id = 'message'

    document.body.appendChild(message)
  }

  document.getElementById('message').appendChild(instance.vm.$el)

  instance.visible = true
  instances.forEach(item => {
    verticalOffset += item.$el.offsetHeight + 16
  })
  verticalOffset += 16
  instance.verticalOffset = verticalOffset

  instances.push(instance)
}

Message.close = function(id) {
  let index = -1
  const len = instances.length
  const instance = instances.filter((instance, i) => {
    if (instance.id === id) {
      index = i
      return true
    }
    return false
  })[0]

  instances.splice(index, 1)

  if (instance && len > 1) {
    const removedHeight = instance.dom.offsetHeight
    for (let i = index; i < len - 1; i++) {
      instances[i].dom.style.top =
        parseInt(instances[i].dom.style.top, 10) - removedHeight - 16 + 'px'
    }
  }
}

export default Message
