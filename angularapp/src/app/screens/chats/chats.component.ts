import { Component, OnInit,HostListener,OnDestroy,Renderer2  ,HostBinding  } from '@angular/core';
import { ApiConfigServiceService } from 'src/app/api-config-service.service';
import { io } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit,OnDestroy  {
  adIds: string[] = [];
  messagesByAdId: { [adId: string]: any[] } = {};
  selectedAdId: string | null = null;
  senderId: string | null = null;
  userNames: { [userId: string]: string } = {}; // Map to store user names
  private socket: any; // Declare a private variable for the socket
  messageCount: number = 0; // Variable to store message count
  userId: string = '';
  userName: string = '';
  currentChatImageProfile: string = '';
  selectedAdReceiverId: string = '';

  @HostBinding('class.dark-theme') isDarkTheme: boolean = false; // Apply dark-theme class conditionally


   constructor(private apiService: ApiConfigServiceService, private renderer: Renderer2,private http: HttpClient,private snackBar: MatSnackBar) {}

  ngOnInit(): void {
       this.isDarkTheme = document.body.classList.contains('dark-theme');
       this.renderer.listen('body', 'DOMSubtreeModified', () => {
      this.isDarkTheme = document.body.classList.contains('dark-theme');
  });

    
    this.socket = io('http://localhost:3001');


    this.socket.on('chat message', (data: any) => {
      console.log('Message from server:');
      this.fetchMessage()
      // console.log('updated mesagea',this.messagesByAdId)
    });
    // Example: Listen for 'message' event from the server

    this.socket.on('message', (data: any) => {
      console.log('Message from server:');
      this.fetchMessage()
      
    
    });

   this.fetchMessage()
  }

  fetchMessage(){
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      const senderId1 = userData.userId;
      // this.userId=userData.userId; 
      this.userId = userData.username.split('@')[0];
      this.userName=userData.username

      this.senderId=senderId1
      this.apiService.getMessagesBySenderId(senderId1).subscribe(messages => {
        // Group messages by adId
        this.groupMessagesByAdId(messages);
        this.fetchUserNames();
        console.log(this.userNames)

      }, error => {
        console.error('Error fetching messages:', error);
        // Handle error if necessary
      });
    }
  }

 
  ngOnDestroy(): void {
    // Disconnect the socket when the component is destroyed
    if (this.socket) {
      this.socket.disconnect();
    }
  }
  
  messagesBySenderId: { [key: string]: any[] } = {}; 

  groupMessagesByAdId(messages: any[]): void {
    messages.forEach(message => {
      const senderId = message.senderId;
      const receiverId = message.receiverId;
      const adId = message.adId;

      const key1 = `${senderId}_${receiverId}_${adId}`; // Unique key for sender-receiver pair
      const key2 = `${receiverId}_${senderId}_${adId}`; // Unique key for receiver-sender pair
  
      if (!this.messagesByAdId[key1] && !this.messagesByAdId[key2]) {
        this.messagesByAdId[key1] = []; // Initialize array if not exists for key1
        this.adIds.push(key1);
      }
  
      if (this.messagesByAdId[key1]) {
        this.messagesByAdId[key1].push(message); // Push message to corresponding array for key1
      } else {
        this.messagesByAdId[key2].push(message); // Push message to corresponding array for key2
      }
    });
  
    console.log(this.messagesByAdId);
  }
  
  

  openChat(adId: string): void {
    this.selectedAdId = adId;
    
    const imageAdId=this.getADID(adId)
    this.getImages(imageAdId)
  }


  isLoggedIn(): boolean {
    return !localStorage.getItem('userData');
  }

  newMessage: string = '';

  // sendMessage(message: string): void {
  //   if(this.selectedAdId){
  //     const receiverId = this.getChatPartnerId(this.selectedAdId) || ''; // Assuming selectedAdId represents the receiver's ID
  //     const adId = this.getThirdValue(this.selectedAdId) || ''; // Use empty string as default value if selectedAdId is undefined
  //     const userDataString = localStorage.getItem('userData');
  
  //     if (userDataString) {
  //       const userData = JSON.parse(userDataString);
  //       const senderId = userData.userId;
  
  //       this.socket.emit('chat message', {
  //         senderId,
  //         receiverId,
  //         message,
  //         adId
  //       });
  
  //       // Send the message using the API service
  //       this.apiService.sendMessage(senderId, receiverId, message, adId).subscribe(
  //         response => {
  //           console.log('Message sent successfully');
  //           this.newMessage = ''; 
  //           // Optionally, update the UI or display a confirmation message here
  //         },
  //         error => {
  //           console.error('Error sending message:', error);
  //           // Handle error scenario here
  //         }
  //       );
  //     }
  //   }
   
  // }
  sendMessage(message: string): void {
    if (this.selectedAdId) {
      const receiverId = this.getChatPartnerId(this.selectedAdId) || ''; // Assuming selectedAdId represents the receiver's ID
      const adId = this.getThirdValue(this.selectedAdId) || ''; // Use empty string as default value if selectedAdId is undefined
      const userDataString = localStorage.getItem('userData');
  
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        const senderId = userData.userId;
  
        // Create a new message object representing the sent message
        const sentMessage = {
          senderId,
          receiverId,
          message,
          adId,
          timestamp: new Date().toISOString() // Add a timestamp for the sent message
        };
  
        // Append the sent message to the list of messages for the selected chat
        if (!this.messagesByAdId[this.selectedAdId]) {
          this.messagesByAdId[this.selectedAdId] = [];
        }
        this.messagesByAdId[this.selectedAdId].push(sentMessage);
  
        // Optionally, update the UI to display the sent message immediately
        // This step is optional and depends on how you want to handle UI updates
        // For example, you can emit an event to notify the chat component to update its UI
  
        // Send the message using the API service
        this.apiService.sendMessage(senderId, receiverId, message, adId).subscribe(
          response => {
            console.log('Message sent successfully');
            this.newMessage = ''; 
            // Optionally, update the UI or display a confirmation message here
          },
          error => {
            console.error('Error sending message:', error);
            // Handle error scenario here
          }
        );
      }
    }
  }
  
  getThirdValue(input: string): string {
    const parts = input.split('_');
    if (parts.length >= 3) {
      return parts[2];
    } else {
      return '';
    }
  }
  
    onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Enter') {
        this.sendMessage(this.newMessage);
      }
    }
   
   
    getChatPartnerId(adId: string): string {
      // console.log(adId,'ad id is')
      const userDataString = localStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        const senderId1 = userData.userId;
        const [senderId, receiverId, _] = adId.split('_');
        // return senderId === senderId1 ? receiverId : senderId;
         const userId = senderId === senderId1 ? receiverId : senderId;

           return userId
      }
      return '';
    }

   
    getADID(selectedAdId: string): string {
      const parts = selectedAdId.split('_');
      if (parts.length >= 3) {
        // this.getImages(parts[2])
        return parts[2];
      } else {
        return '';
      }
    }
    selectedAdImage: string | undefined; // Variable to hold the selected ad image

    getImages(selectedAdId: string): void {
      console.log('hi',selectedAdId)
      this.apiService.getImagesById(selectedAdId).subscribe(
        (response) => {
          console.log('Images:', response.images);
          this.currentChatImageProfile=response.images
       
        },
        (error) => {
          console.error('Error:', error);
          // Handle error scenario here
        }
      );
    }

    
    fetchUserNames(): void {
      const userIds = new Set<string>(); // Use a set to avoid duplicate user IDs
      this.messageCount=this.adIds.length
      for (const adId of this.adIds) {
        const userId = this.getChatPartnerId(adId);
        if (userId) {
          userIds.add(userId);
        }
      }
      userIds.forEach(userId => {
        this.apiService.getUserName(userId).subscribe(
          (response) => {
            this.userNames[userId] = response.user_name;
          },
          (error) => {
            console.error('Error fetching user name:', error);
          }
        );
      });
    }
  
    
    getChatPartnerName(adId: string): string {
      const userId = this.getChatPartnerId(adId);
      const userName = this.userNames[userId];
      return userName || ''; // Return empty string if user name is not found
    }

    getLastMessage(adId: string): string {
      const messages = this.messagesByAdId[adId];
      if (messages && messages.length > 0) {
        // Sort messages by timestamp to get the latest message
        const sortedMessages = messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        return sortedMessages[0].message; // Access the last element of the sorted array
      }
      return 'No messages'; // Return a default message if no messages exist
    }


    toggleBackground(event: any): void {
      const isChecked = event.target.checked;

      if (isChecked) {
        document.body.style.backgroundColor = 'black'; 
        document.querySelector('.chat-list')?.classList.add('lightBlackBackground'); // Add lightBlackBackground class
        document.querySelector('.chat-heading')?.classList.add('whitetext'); // Add lightBlackBackground class
        document.querySelector('.chat-details')?.classList.add('whitetext'); // Add lightBlackBackground class
        document.querySelector('.nameChat')?.classList.add('whitetext'); // Add lightBlackBackground class
       
      
      } else {
        document.body.style.backgroundColor = 'white'; 
        document.querySelector('.chat-list')?.classList.remove('lightBlackBackground'); // Remove lightBlackBackground class
        // document.querySelector('.chat-heading')?.classList.add('whitetext'); // Add lightBlackBackground class
        // document.querySelector('.chat-details')?.classList.add('whitetext'); // Add lightBlackBackground class
        // document.querySelector('.nameChat')?.classList.add('whitetext'); // Add lightBlackBackground class
        document.querySelector('.nameChat')?.classList.remove('whitetext'); // Remove lightBlackBackground class
        document.querySelector('.chat-details')?.classList.remove('whitetext'); // Remove lightBlackBackground class
        document.querySelector('.chat-heading')?.classList.remove('whitetext'); // Remove lightBlackBackground class
       
      }
    }
    
    getImageUrl(image: any): string {
      if (image) {
        // Assuming the images are stored in the '/images' directory on the backend
        return `http://localhost:3000/images/${image}`;
      } else {
        // Return a placeholder image URL if no images are available
        return 'path/to/placeholder-image.jpg';
      }
    }

    showPhoneNumber(): void {
      if (this.selectedAdId) {
        this.selectedAdReceiverId = this.getChatPartnerId(this.selectedAdId) || '';
     
        console.log(this.selectedAdReceiverId,'selectedAdReceiverIdselectedAdReceiverId')
        this.apiService.getUserById(this.selectedAdReceiverId).subscribe(
          (user) => {
            if (user && user.contact) {
              this.snackBar.open(`Contact Number: ${user.contact}`, 'Close', {
                duration: 9000, // Adjust the duration as needed
              });
            } else {
              this.snackBar.open('Contact number not found.', 'Close', {
                duration: 3000, // Adjust the duration as needed
              });
            }
          },
          (error) => {
            console.error('Error:', error);
            this.snackBar.open('Failed to fetch contact number.', 'Close', {
              duration: 3000, // Adjust the duration as needed
            });
          }
        );
      } else {
        this.snackBar.open('Receiver ID not available.', 'Close', {
          duration: 3000, // Adjust the duration as needed
        });
      }
    }

}
