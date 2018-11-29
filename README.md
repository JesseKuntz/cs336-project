# Project Design
Team Members: Jordan Doorlag and Jesse Kuntz

### Vision:
A chatroom in which you can upload files. There would not be a login - users would be prompted to create a username on entrance to the SPA, and then they would have the permissions to start sending messages and uploading files, which can then be downloaded by other users. This would basically be a quicker way to send data than emailing. With emailing, you must specify who receives your email, and go through the routine of creating and sending it. With this chatroom application, you can immediately broadcast to everyone what you have to say, and what data you want to get to people. This chatroom can be specified in many, many ways, but in order to make it as universal as possible, no theme will be forced upon it. If it were to be developed outside of the scope of this class project, functionality could be added for customization.

### Technical Standpoint:
We hope to allow the user to use a file-upload interface, or (ideally) drag-and-drop the file they wish to share onto the page. This would then be converted into the BSON format (or similar) and sent to our server, which would then store it in the database. Clicking on a file in the chat log would prompt the user to download it (or maybe display it if it's an image). We would also like to store the user's name as a cookie, so that they don't need to re-enter it every time they reload the page.
