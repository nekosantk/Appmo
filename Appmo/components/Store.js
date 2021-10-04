import { createState } from '@hookstate/core'

const Store = createState({
  chats: [],
  contactList: [],
})

export default Store