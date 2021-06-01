import WhatsappChats from '../database/Schema.js'
import { io } from '../sockets/socket.js'

// get all the Groups

// Get all groups
export const getAllGroups = () => {
 WhatsappChats.find({})
  .sort({ _id: -1 })
  .then(docs => {
   io.sockets.emit('get_data', docs)
  })
}

// FInd group by each id and retrieve its message
export const getGroupBy_id = args => {
 const _id = args
 console.log(args)
 WhatsappChats.findById(_id, function (err, res) {
  err && console.log(err)
  if (res) {
   io.sockets.emit('get_group_with_id', res)
  }
 })
}

// send text message
export const sendChatMessage = args => {
 const { name, message, _id } = args
 const chat = { name, message }
 console.log(chat)

 WhatsappChats.findOneAndUpdate(
  { _id: _id },
  { $push: { user: chat } },
  { new: true },
  function (error, success) {
   if (success) {
    WhatsappChats.findById(_id)
     .select({ user: { $slice: -1 } })
     .exec((err, doc) => {
      io.sockets.emit('get_last_sent_text_message', doc.user)
      console.log(doc.user)
     })
   }
  }
 )

 // io.sockets.
}

// Create New Groupcd server
export const createNewGroup = args => {
 console.log(args)
 WhatsappChats.create(args, function (err, small) {
  err ? console.log(err) : console.log(small)
 })
}

export const getLastSentMessage = () => {
 WhatsappChats.find({})
  .select({ user: { $slice: -1 } })
  .exec((err, doc) => {
   io.sockets.emit('get_last_sent_text_message_for_group', doc.user)
   console.log(doc.user)
  })
}
