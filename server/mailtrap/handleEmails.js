import {
  createCommentNotificationEmailTemplate,
  createWelcomeEmailTemplate,
} from "./emailTemplates.js";
import { client, sender } from "./mailtrap.js";

export const sendWelcomeEmail = async (email, username, profilePath) => {
  const recipient = [{ email }];

  try {
    client
      .send({
        from: sender,
        to: recipient,
        subject: "Welcome to LinkedIn ",
        html: createWelcomeEmailTemplate(username, profilePath),
        category: "Welcome to LinkedIn",
      })
      .then(() => {
        console.log("Email sent successfully");
      });
  } catch (error) {
    console.log(error);
  }
};

export const sendCommentEmail = async (
  recipientName,
  recipientEmail,
  postPath,
  commenterName,
  CommentContent
) => {
  const recipient = [{ email: recipientEmail }];

  try {
    client
      .send({
        from: sender,
        to: recipient,
        subject: `${commenterName} commented on your post`,
        html: createCommentNotificationEmailTemplate(
          recipientName,
          recipientEmail,
          postPath,
          commenterName,
          CommentContent
        ),
        category: "Comment on Post",
      })
      .then(() => {
        console.log("Comment sent successfully");
      });
  } catch (error) {
    console.log(error);
  }
};
