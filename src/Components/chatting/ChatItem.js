import React from "react";
import { ListItem } from "@material-ui/core";

class ChatItem extends React.Component {
  render() {
    const { message, email,teacherName } = this.props;
    const isOwnMessage = message.author === email;

    return (
      <ListItem style={styles.listItem(isOwnMessage)}>
        <div style={styles.author}>{message.author}</div>
        <div style={styles.author}></div>

        <div style={styles.container(isOwnMessage)}>
          {message.body}
          <div style={styles.timestamp}>
            {new Date(message.dateCreated.toISOString()).toDateString()}
            <div></div>
            {new Date(message.dateCreated.toISOString()).toLocaleTimeString()}

          </div>
        </div>
      </ListItem>
    );
  }
}

const styles = {
  listItem: (isOwnMessage) => ({
    flexDirection: "column",
    alignItems: isOwnMessage ? "flex-end" : "flex-start",
  }),
  container: (isOwnMessage) => ({
    maxWidth: "75%",
    borderRadius: 12,
    padding: 16,
    color: "white",
    fontSize: 16,
    backgroundColor: isOwnMessage ? "#14a73f" : "#262d31",
  }),
  author: { fontSize: 14, color: "gray" },
  timestamp: { fontSize: 12, color: "white", textAlign: "right", paddingTop: 4 },
};

export default ChatItem;
