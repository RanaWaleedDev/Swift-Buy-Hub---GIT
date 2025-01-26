import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigServiceService {

  API_BASE_URL='http://localhost:3000';

  API_MODEL_URL='http://localhost:8000'


  constructor(private httpClient:HttpClient) { }
  private readonly USER_DATA_KEY = 'userData';

  inspection(body:object): Observable<any> {
    return this.httpClient.post(`${this.API_MODEL_URL}/api/post/carmodel`,body);
  }

  inspectionLaptop(body:object): Observable<any> {
    return this.httpClient.post(`${this.API_MODEL_URL}/api/post/laptopModel`,body);
  }

  registerUser(userData: any){
    return this.httpClient.post(`${this.API_BASE_URL}/register`, userData);
  }

  // LoginUser(userData: any){
  //   return this.httpClient.post(`${this.API_BASE_URL}/login`, userData);
  // }
 
  LoginUser(userData: any): Observable<any> {
    return this.httpClient.post(`${this.API_BASE_URL}/login`, userData)
      .pipe(
        tap((response: any) => {
          const userData = {
            userId: response.user._id,
            username: response.user.e_mail,
            role:response.user.role
          };
          localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
        })
      );
  }

  getUserData(): { userId: string, username: string } | null {
    const userDataString = localStorage.getItem(this.USER_DATA_KEY);
    return userDataString ? JSON.parse(userDataString) : null;
  }

  getUserId(): string | null {
    const userData = this.getUserData();
    return userData ? userData.userId : null;
  }

  getUsername(): string | null {
    const userData = this.getUserData();
    return userData ? userData.username : null;
  }

 



  saveLaptop(laptopData: any): Observable<any> {
    const url = `${this.API_BASE_URL}/laptops`; // Adjust the endpoint URL
    const userId=this.getUserData()
    return this.httpClient.post(url, laptopData);
  }

  saveCar(carData: any): Observable<any> {
    const url = `${this.API_BASE_URL}/cars`; // Adjust the endpoint URL
    return this.httpClient.post(url, carData);
  }



  getCarsByUserId(userId: string): Observable<any> {
    const url = `${this.API_BASE_URL}/cars/user/${userId}`;
    return this.httpClient.get(url);
  }

  getLaptopsByUserId(userId: string): Observable<any> {
    const url = `${this.API_BASE_URL}/laptops/user/${userId}`;
    return this.httpClient.get(url);
  }


  getAllCars(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.API_BASE_URL}/carsAll`);
  }

  // Function to fetch all laptops
  getAllLaptops(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.API_BASE_URL}/laptopsAll`);
  }


  getCategoryData(selectedCategory: string, id: string): Observable<any> {
    return this.httpClient.get<any>(`${this.API_BASE_URL}/search/${selectedCategory}/${id}`);
  }


  getAllDataByCategory(categoryName: string): Observable<any[]> {
    if (categoryName === 'Cars') {
      return this.getAllCars();
    } else if (categoryName === 'Laptops') {
      return this.getAllLaptops();
    } else {
      // Return an empty observable if the category is unknown
      console.error('Unknown category:', categoryName);
      return of([]);
    }
  }

  sendMessage(senderId: string, receiverId: string, message: string, adId: string): Observable<any> {
    const url = `${this.API_BASE_URL}/chat`;
    const payload = { senderId, receiverId, message,adId };
    return this.httpClient.post<any>(url, payload);
  }
  getMessagesBySenderIdAndAdId(senderId: string, adId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.API_BASE_URL}/messages/${senderId}/${adId}`);
  }
  
  getUserName(userId: string): Observable<any> {
    const url = `${this.API_BASE_URL}/username/${userId}`; // Adjust the endpoint URL
    return this.httpClient.get<any>(url);
  }
  
  
  getMessagesBySenderId(senderId: string): Observable<any> {
    const url = `${this.API_BASE_URL}/messages/${senderId}`;
    return this.httpClient.get<any>(url);
  }

  getAllUsers(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.API_BASE_URL}/users`);
  }

  sendEmail(emailData: any): Observable<any> {
    const url = `${this.API_BASE_URL}/sendEmail`; // Adjust the endpoint URL for sending emails
    return this.httpClient.post(url, emailData);
  }

  getSubscriptions(): Observable<any[]> {
    const url = `${this.API_BASE_URL}/subscriptions`;
    return this.httpClient.get<any[]>(url);
  }

  updateSubscriptionStatus(subscriptionId: string, newStatus: string): Observable<any> {
    const url = `${this.API_BASE_URL}/subscriptions/${subscriptionId}/status`;
    return this.httpClient.put(url, { status: newStatus });
  }

  subscribeToNewsletter(email: string): Observable<any> {
    const url = `${this.API_BASE_URL}/newsletter/subscribe`;
    return this.httpClient.post(url, { email });
  }


  changePassword(newPassword: string,currentPassword:string): Observable<any> {
    const userDataString = localStorage.getItem(this.USER_DATA_KEY);
    if (!userDataString) {
      // Handle the case where user data is not available in local storage
      return of({ error: 'User data not found in local storage' });
    }

    const userData = JSON.parse(userDataString);
    const e_mail = userData.username; // Assuming username in userData is the email
    // console.log(e_mail,currentPassword,newPassword,'ccccccccccccccccccc')

    return this.httpClient.post(`${this.API_BASE_URL}/change-password`, { e_mail, newPassword ,currentPassword});
  }

  getUser() {
    return this.httpClient.get(`${this.API_BASE_URL}/user`);
  }

  updateUsername(newUsername: string) {
    const userDataString = localStorage.getItem(this.USER_DATA_KEY);
    if (!userDataString) {
      return new Observable(observer => {
        observer.error('User data not found in local storage');
      });
    }

    const userData = JSON.parse(userDataString);
    const userId = userData.userId;
    return this.httpClient.put(`${this.API_BASE_URL}/users/${userId}/username`, { username: newUsername });
  }
  
  deleteAccount(): Observable<any> {
    const userDataString = localStorage.getItem(this.USER_DATA_KEY);
    if (!userDataString) {
      return throwError('User data not found in local storage');
    }
  
    const userData = JSON.parse(userDataString);
    const userId = userData.userId;
    return this.httpClient.delete(`${this.API_BASE_URL}/users/${userId}`);
  }


  getImagesById(selectedAdId: string): Observable<any> {
    // const parts = selectedAdId.split('_');
    // console.log(parts[2],'parts[2]parts[2]parts[2]parts[2]')
    return this.httpClient.get<any>(`http://localhost:3000/getImagesById/${selectedAdId}`);
  }

  getUserById(userId: string): Observable<any> {
    return this.httpClient.get(`${this.API_BASE_URL}/getUserById/${userId}`);
  }

  getSmartInspections(): Observable<any> {
    return this.httpClient.get(`${this.API_BASE_URL}/smart-inspections`);
  }


  deleteSmartInspection(inspectionId: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.API_BASE_URL}/api/smartInspections/${inspectionId}`);
  }

}
