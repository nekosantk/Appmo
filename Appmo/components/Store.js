import { createState } from '@hookstate/core'

const Store = createState({
  chats: [],
  contactList: [],
  myProfile: {},
})

export default Store