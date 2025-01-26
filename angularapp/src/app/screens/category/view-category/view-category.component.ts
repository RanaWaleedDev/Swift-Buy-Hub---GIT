import { Component, OnInit,HostListener,OnDestroy   } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiConfigServiceService } from 'src/app/api-config-service.service';
import { io } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-category',
  templateUrl: './view-category.component.html',
  styleUrls: ['./view-category.component.css']
})
export class ViewCategoryComponent implements OnInit,OnDestroy {
  categoryId: string | undefined;
  categoryName: string | undefined;
  userIdPosterAd: string | any;
  messages: any[] = []; // Variable to store messages
  sortedMessages: any[] = []; // Variable to store sorted messages
  curentUserId: string | undefined;
  curentUserName: string | undefined;
  userNamePosterAd: string | any;
  private socket: any; // Declare a private variable for the socket
  inspectionResult: any
  physicalInspectionResult: any

  laptop: any; // Variable to store laptop data
  car: any; 
  isAdmin: boolean = false; // Variable to store whether the user is an admin
  loading: boolean = false; // Add loading property

  constructor(private apiService: ApiConfigServiceService,private route: ActivatedRoute,private http: HttpClient) { }

  ngOnInit(): void {
    const userDataString1 = localStorage.getItem('userData');
    if (userDataString1) {
      const userData = JSON.parse(userDataString1);
      this.isAdmin = userData.role === 'admin'; // Assuming the role is 'admin'
    }


    this.socket = io('http://localhost:3001');

    this.socket.on('chat message', (data: any) => {
      console.log('Message from server:');
      this.fetchMessages()
    });

    this.socket.on('message', (data: any) => {
      console.log('Message from server:'); 
      this.fetchMessages() 
    });

    // Retrieve the ID and category name from the route snapshot
    this.categoryId = this.route.snapshot.params['id'];
    this.categoryName = this.route.snapshot.params['name'];

    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      const senderId = userData.userId;
      this.curentUserId=senderId
      this.curentUserName=userData.username
    }

    if (this.categoryName && this.categoryId) {
      this.apiService.getCategoryData(this.categoryName, this.categoryId).subscribe(
        (response) => {
          // Handle the response from the API
          if (this.categoryName === 'laptops') {
            this.laptop = response;
            this.userIdPosterAd=response.userId
            this.car=''
            this.getUserName(this.userIdPosterAd); // Call method to get user_name
           

          } else if (this.categoryName === 'cars') {
            this.car = response;
            this.laptop=''
            this.userIdPosterAd=response.userId
            this.getUserName(this.userIdPosterAd); // Call method to get user_name

          }
          console.log('Search result:', response);
        },
        (error) => {
          // Handle errors
          console.error('Error:', error);
        }
      );
    }

  }

  apiUrl = 'http://localhost:3000'; // Assuming backend runs on port 3000

  deleteCar(carId: number): void {
    const url = `${this.apiUrl}/cars/${carId}`;
console.log(carId,'carIdcarId')
    // Send DELETE request to delete the car
    this.http.delete(url)
      .subscribe(
        () => {
          console.log('Car deleted successfully');
          // Handle any additional logic after successful deletion, such as updating the UI
        },
        error => {
          console.error('Error deleting car:', error);
          // Handle error
        }
      );
  }

  deleteLaptop(carId: number): void {
    const url = `${this.apiUrl}/laptop/${carId}`;
// console.log(carId,'carIdcarId')
    // Send DELETE request to delete the car
    this.http.delete(url)
      .subscribe(
        () => {
          console.log('laptop deleted successfully');
        },
        error => {
          console.error('Error deleting laptop:', error);
          // Handle error
        }
      );
  }

  isAdminUser(): boolean {
    return this.isAdmin;
}




  ngOnDestroy(): void {
    // Disconnect the socket when the component is destroyed
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  getUserName(userId: string): void {
    this.apiService.getUserName(userId).subscribe(
      (response) => {
        this.userNamePosterAd = response.user_name;
        console.log(this.userNamePosterAd,'this.userNamePosterAd')
      },
      (error) => {
        console.error('Error fetching user name:', error);
      }
    );
  }

  getImageUrl(image: string): string {
    if (image) {
      return `http://localhost:3000/images/${image}`;
    } else {
      return 'path/to/placeholder-image.jpg';
    }
  }
  selectedImageIndex: number = 0;
  changeMainImage(index: number): void {
    this.selectedImageIndex = index; // assuming you have a variable to store the selected image index
  }
  

  showChat: boolean = false;

  toggleChat() {
    this.showChat = !this.showChat;
    if (this.showChat) {
      // Fetch messages for the current sender when the chat is toggled on
      this.fetchMessages();
    }
  }


  fetchMessages() {
    const userDataString = localStorage.getItem('userData');
  
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      const senderId = userData.userId;
      const adId = this.categoryId || ''; // Assuming categoryId is available in the component
      this.curentUserId=senderId
      // Call the API service to fetch messages for the current sender and adId
      this.apiService.getMessagesBySenderIdAndAdId(senderId, adId).subscribe(
        (response) => {
          // Handle the response from the API
          this.messages = response;
          console.log('Messages:', this.messages);
          this.sortedMessages = this.messages.sort((a, b) => {
            return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          });
          
        },
        (error) => {
          // Handle errors
          console.error('Error fetching messages:', error);
        }
      );
    }
  }
  


  closeChat() {
    this.showChat = false; // Set showChat to false to hide the chat
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      const userId = userData.userId;
      console.log(userData,userId)
    }
  }

  sendMessage(messageInput: HTMLInputElement) {
    const message = messageInput.value;
    const receiverId = this.userIdPosterAd;
    const adId = this.categoryId || ''; // Use empty string as default value if categoryId is undefined
    const userDataString = localStorage.getItem('userData');
  
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      const senderId = userData.userId;

      
      this.socket.emit('chat message', {
        senderId,
        receiverId,
        message,
        adId
      });
  
      // Send the message using the API service
      this.apiService.sendMessage(senderId, receiverId, message, adId).subscribe(
        response => {
          console.log('Message sent successfully');
          this.fetchMessages()
          // Optionally, update the UI or display a confirmation message here
        },
        error => {
          console.error('Error sending message:', error);
          // Handle error scenario here
        }
      );
    }
  
    // Clear the input field
    messageInput.value = '';
  }

 

  
  showModal = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.inspectionResult=''
    this.physicalInspectionResult=''
  }

  getPhysicalInspection() {
    this.http.post('http://localhost:3000/physical-inspection', {
      categoryId: this.categoryId,
      currentUserId: this.curentUserName
    }, { responseType: 'text' }).subscribe(
      (response) => {
        console.log('Request sent successfully:', response);
        this.physicalInspectionResult='After initiating the physical inspection request, the application communicates with the server to submit the necessary details. Once the request is successfully processed, the application receives confirmation that the request has been forwarded to our inspection provider. As part of our service, an email will be sent to the provided email address containing further instructions and details regarding the inspection process. Please check your email inbox shortly for updates from our inspection team. We appreciate your trust in our service and look forward to assisting you further with your inspection needs '
        // Handle any success logic here
      },
      (error) => {
        console.error('Error sending request:', error);
        // Handle any error logic here
      }
    );

    // this.showModal = false;
  }

  getOnlineInspection() {
    this.loading = true; // Set loading to true before making the API call

    console.log(this.categoryName )
    if(this.categoryName === 'laptops'){
      
      this.getLaptopInspection(
        this.laptop.company,
        this.laptop.typeName,
        this.laptop.Ram,
        this.laptop.Weight,
        this.laptop.Touchscreen,
        this.laptop.Ips,
        this.laptop.ppi,
        this.laptop.Cpubrand,
        this.laptop.HDD,
        this.laptop.SSD,
        this.laptop.Gpubrand,
        this.laptop.os
      );

    }else{
      this.getCarInspection(
        this.car.engineCapacity,
        this.car.modelYear,
        this.car.Mileage,
        this.car.Company,
        this.car.Vaarient,
        this.car.EngineType,
        this.car.Transmission,
        this.car.BodyType
      );
    }
    setTimeout(() => {
      this.loading = false; // Set loading to false after 3 seconds
    }, 3000);

 
    // this.showModal = false; // Close the modal after action
  }

  getLaptopInspection(company:string, typeName:string,Ram:number,Weight:string,Touchscreen:string,Ips:string,ppi:string,Cpubrand:string,HDD:string,SSD:string,Gpubrand:string,os:string)
  {
    const body = 
    {
      "company":company,
      "typeName":typeName,
      "Ram":Ram,
      "Weight":Weight,
      "Touchscreen":Touchscreen,
      "Ips":Ips,
      "ppi":ppi,
      "Cpubrand":Cpubrand,
      "HDD":HDD,
      "SSD":SSD,
      "Gpubrand":Gpubrand,
      "os":os

    }
    this.apiService.inspectionLaptop(body).subscribe(
      (response) =>{
          this.inspectionResult = Math.round(response.price)
          // console.log(this.inspectionResult,'this.inspectionResultthis.inspectionResult')
      }
    )
  }

  getCarInspection(engineCapacity:string, modelYear:string,Mileage:number,Company:string,Vaarient:string,EngineType:string,Transmission:string,BodyType:string)
  {
    const body = 
    {
      "engineCapacity":engineCapacity,
      "modelYear":modelYear,
      "mileage":Mileage,
      "company":Company,
      "variant":Vaarient,
      "engineType":EngineType,
      "transmission":Transmission,
      "bodyType":BodyType

    }
    this.apiService.inspection(body).subscribe(
      (response) =>{
          this.inspectionResult = Math.round(response.price)
          // console.log(this.inspectionResult,'this.inspectionResultthis.inspectionResult')
      }
    )
  }
  
  

}
