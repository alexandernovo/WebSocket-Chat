import React from 'react'
import Chat from './Chat'
import Empty from './Empty'

const ChatBox = ({ contact, setToggle, showMessage }) => {
    return (
        <>
            {contact && contact.length !== 0 ? (
                <Chat contact={contact} setToggle={setToggle} showMessage={showMessage} />
            ) : (
                <Empty setToggle={setToggle} />
            )
            }
        </>
    )
}

export default ChatBox
