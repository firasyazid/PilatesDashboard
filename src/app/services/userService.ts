import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  Observable } from 'rxjs';
import { User } from '../models/user';
import { Appointment } from '../models/appointement';
import { Pharmacy } from '../models/pharmacy';
import { Pharmacy2 } from '../models/pharmacy2';
import { Region } from '../models/region';
import { Type } from '../models/types';
import { Medecin } from '../models/medecin';
import { Medecin2 } from '../models/medecin2';
import { Speciality } from '../models/speciality';
import { Article } from '../models/article';
import { Category } from '../models/category';
import { test } from '../models/tests';
import { Question } from '../models/questions';
import { Section } from '../models/section';
import { HttpHeaders } from '@angular/common/http';
import { Cours } from '../models/cours';
import { Coach } from '../models/coach';
import { ScheduledSession } from '../models/scheduledSession';
import { Booking } from '../models/bookings';
import { Abonnement } from '../models/abonnements';


export interface WeeklyBooking {
  courseName: string;
  dayOfWeek: string;
  totalBookings: number;
}

export interface MonthPercentage {
  month: string;
  count: number;
}



@Injectable({
  providedIn: 'root'
})


export class UserService {


  private baseUrl = 'https://emsat-project-backend.onrender.com/api/v1/users/';
  private baseUrl2 = 'https://emsat-project-backend.onrender.com/api/v1/tests/';
  private baseUrl3 = 'http://192.168.1.83:3008/api/v1/articles/';  
  private baseUrl4 = 'https://emsat-project-backend.onrender.com/api/v1/tests/total/';   
  private baseUrluser = 'http://localhost:3001/api/v1/users/total/';  
  private forgotPasswordUrl = 'https://emsat-project-backend.onrender.com/api/v1/users/forgot-password';  
  private apiUrl = 'https://emsat-project-backend.onrender.com/api/v1/users/send-email';
  
  
  constructor(private http: HttpClient) {}



///user
  getWeeklyBookings(): Observable<WeeklyBooking[]> {
    return this.http.get<WeeklyBooking[]>('http://localhost:3001/api/v1/scheduledSessions/weekly-bookings');
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:3001/api/v1/users/last-user');
  }

  searchUsers(searchTerm: string): Observable<User[]> {
    const url = `${this.baseUrl}search?q=${searchTerm}`;
    return this.http.get<User[]>(url);
  }
 
   createUser(user: User): Observable<User> {
    return this.http.post<User>('http://localhost:3001/api/v1/users/inscription', user);
  }

    forgetpassword(email: string): Observable<object> {
    return this.http.post<object>(`${this.forgotPasswordUrl}`, { email });
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`http://localhost:3001/api/v1/users/${user.id}`, user);
  }

  deleteUser(userId: string): Observable<object> {
    return this.http.delete<object>(`http://localhost:3001/api/v1/users/${userId}`);
  }



////////////cours 

createCours(cours: Cours): Observable<Cours> {
  return this.http.post<Cours>('http://localhost:3001/api/v1/cours', cours);
}

getCours(): Observable<Cours[]> {
  return this.http.get<Cours[]>('http://localhost:3001/api/v1/cours');
}

deleteCours(coursId: string): Observable<object> {
    return this.http.delete<object>(`http://localhost:3001/api/v1/cours/${coursId}`);
  }

  updateCours(user: Cours): Observable<Cours> {
    return this.http.put<Cours>(`http://localhost:3001/api/v1/cours/${user._id}`, user);
  }


/////coachs 

getCoach(): Observable<Coach[]> {
  return this.http.get<Coach[]>('http://localhost:3001/api/v1/coaches');
}

deleteCoach(coursId: string): Observable<object> {
  return this.http.delete<object>(`http://localhost:3001/api/v1/coaches/${coursId}`);
}
 
createCoach(productData: FormData): Observable<Coach> {
  return this.http.post<Coach>('http://localhost:3001/api/v1/coaches/', productData);
}

updateCoach(user: Coach): Observable<Coach> {
  return this.http.put<Coach>(`http://localhost:3001/api/v1/coaches/${user.id}`, user);
}

///////// ScheduledSession

createSession(user: ScheduledSession): Observable<ScheduledSession> {
  return this.http.post<ScheduledSession>('http://localhost:3001/api/v1/scheduledSessions', user);
}

getSession(): Observable<ScheduledSession[]> {
  return this.http.get<ScheduledSession[]>('http://localhost:3001/api/v1/scheduledSessions');
}

deleteSession(coursId: string): Observable<object> {
  return this.http.delete<object>(`http://localhost:3001/api/v1/scheduledSessions/${coursId}`);
}
updateSession(user: ScheduledSession): Observable<ScheduledSession> {
  return this.http.put<ScheduledSession>(`http://localhost:3001/api/v1/scheduledSessions/${user.id}`, user);
}

/////Booking

getBooking(): Observable<Booking[]> {
  return this.http.get<Booking[]>('http://localhost:3001/api/v1/bookings');
}

createBooking(user: Booking): Observable<Booking> {
  return this.http.post<Booking>('http://localhost:3001/api/v1/bookings', user);
}

deleteBooking(coursId: string): Observable<object> {
  return this.http.delete<object>(`http://localhost:3001/api/v1/bookings/${coursId}`);
} 

updateBooking(user: Booking): Observable<Booking> {
  return this.http.put<Booking>(`http://localhost:3001/api/v1/bookings/${user.id}/status`, user);
}

getBookingUsers(scheduledSessionId: string): Observable<any[]> {
  return this.http.get<any[]>(`http://localhost:3001/api/v1/bookings/${scheduledSessionId}/users`);
}
/////abonnements

 
getAbonnements(): Observable<Abonnement[]> {
  return this.http.get<Abonnement[]>('http://localhost:3001/api/v1/abonnements');
}

createAbonnement(user: Abonnement): Observable<Abonnement> {
  return this.http.post<Abonnement>('http://localhost:3001/api/v1/abonnements', user);
}

deleteAbonnement(coursId: string): Observable<object> {
  return this.http.delete<object>(`http://localhost:3001/api/v1/abonnements/${coursId}`);
}

updateAbonnement(user: Abonnement): Observable<Abonnement> {
  return this.http.put<Abonnement>(`http://localhost:3001/api/v1/abonnements/${user.id}`, user);
}

getAbonnementUsers(abonnementId: string): Observable<any[]> {
  return this.http.get<any[]>(`http://localhost:3001/api/v1/users/users-by-abonnement/${abonnementId}`);
}

getAbonnementUserCount(abonnementId: string): Observable<{ abonnementId: string; userCount: number }> {
  return this.http.get<{ abonnementId: string; userCount: number }>(
    `http://localhost:3001/api/v1/users/abonnement-user-count/${abonnementId}`
  );
}































  getUsersbyExpire(): Observable<User[]> {
    return this.http.get<User[]>('https://emsat-project-backend.onrender.com/api/v1/users/users-by-expiry');
  }
  getAppointements(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>('http://192.168.1.83:3005/api/v1/Appointement/');
  }


  deleteApp(userId: string): Observable<object> {
    return this.http.delete<object>(`http://192.168.1.83:3005/api/v1/Appointement/${userId}`);
  }

  getPharmacy(): Observable<Pharmacy[]> {
    return this.http.get<Pharmacy[]>('http://192.168.1.83:3007/api/v1/pharmacy/');
  }

  createPharmacy(user: Pharmacy2): Observable<Pharmacy2> {
    return this.http.post<Pharmacy2>(`http://192.168.1.83:3007/api/v1/pharmacy/`, user);
  }
  
  deletePharmacy(userId: string): Observable<object> {
    return this.http.delete<object>(`http://192.168.1.83:3007/api/v1/pharmacy/${userId}`);
  }

  getRegionPhramacy(): Observable<Region[]> {
    return this.http.get<Region[]>('http://192.168.1.83:3007/api/v1/RegionPharmacy/');
  }


  getType(): Observable<Type[]> {
    return this.http.get<Type[]>('http://192.168.1.83:3007/api/v1/type/');
  }


  getMedecin(): Observable<Medecin[]> {
    return this.http.get<Medecin[]>('http://192.168.1.83:3004/api/v1/medecin/');
  }


  deleteMedecin(userId: string): Observable<object> {
    return this.http.delete<object>(`http://192.168.1.83:3004/api/v1/medecin/${userId}`);
  }

  createMed(productData: FormData): Observable<Medecin> {
    return this.http.post<Medecin>('http://192.168.1.83:3004/api/v1/medecin/', productData);
  }

  addMedecin(medecin: Medecin2, imageFile: string): Observable<Medecin2> {
    const formData = new FormData();
    formData.append('fullname', medecin.fullname);
    formData.append('speciality', medecin.speciality);
    formData.append('description', medecin.description);
    formData.append('phone', medecin.phone);
    formData.append('address', medecin.address);
    formData.append('region', medecin.region);
    formData.append('image', imageFile);
    return this.http.post<Medecin2>(`${this.baseUrl}`, formData);
  }

  getSpec(): Observable<Speciality[]> {
    return this.http.get<Speciality[]>('http://192.168.1.83:3004/api/v1/speciality/');
  }

  deleteSpec(userId: string): Observable<object> {
    return this.http.delete<object>(`http://192.168.1.83:3004/api/v1/speciality/${userId}`);
  }
  addSpec(spec: Speciality, icon: string): Observable<Speciality> {
    const formData = new FormData();
    formData.append('titre', spec.titre);
      formData.append('icon', icon);
    return this.http.post<Speciality>(`${this.baseUrl2}`, formData);
  }

  createRegion(user: Region): Observable<Region> {
    return this.http.post<Region>(`http://192.168.1.83:3007/api/v1/RegionPharmacy/`, user);
  }
  deleteRegion(userId: string): Observable<object> {
    return this.http.delete<object>(`http://192.168.1.83:3007/api/v1/RegionPharmacy/${userId}`);
  }
  getArticle(): Observable<Article[]> {
    return this.http.get<Article[]>('http://192.168.1.83:3008/api/v1/articles/');
  }

  deleteArticle(userId: string): Observable<object> {
    return this.http.delete<object>(`http://192.168.1.83:3008/api/v1/articles/${userId}`);
  }


  addArticle(art: Article, categoryId: string, imageFile: string, imageFile2: string, 
    imageFile3: string, imageFile4: string, imageFile5: string): Observable<Article> {
    const formData = new FormData();
    formData.append('title', art.title);
    formData.append('description', art.description);
    formData.append('contenu', art.contenu);
    formData.append('source', art.source);
    formData.append('category', categoryId);
    formData.append('image', imageFile);
    formData.append('image1', imageFile2);
    formData.append('image2', imageFile3);
    formData.append('image3', imageFile4);
    formData.append('video', imageFile5);
    return this.http.post<Article>(`${this.baseUrl3}/${categoryId}`, formData);
  }

  getCat(): Observable<Category[]> {
    return this.http.get<Category[]>('http://192.168.1.83:3006/api/v1/categories/');
  }

  deleteCat(userId: string): Observable<object> {
    return this.http.delete<object>(`http://192.168.1.83:3006/api/v1/categories/${userId}`);
  }

  createCat(user: Category): Observable<Category> {
    return this.http.post<Category>('http://192.168.1.83:3006/api/v1/categories/', user);
  }
  getAppointementsConfirmed(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>('http://192.168.1.83:3005/api/v1/Appointement/confirmed/');
  }


  getAppointementsCancelled(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>('http://192.168.1.83:3005/api/v1/Appointement/canceled/');
  }

  getAppointmentsByMonth(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl4}/appointments-by-month`);
  }

  getTotalUsers(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(this.baseUrluser);
  }

  getTotalAppointments(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`https://emsat-project-backend.onrender.com/api/v1/tests/total/`);
  }

  getTotalMedecins(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`http://localhost:3001/api/v1/coaches/total`);
  }

  getTotalCours(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`http://localhost:3001/api/v1/cours/total`);
  }

  addTest(test: test): Observable<test> {
    return this.http.post<test>(`${this.baseUrl2}`, test);
  }

  getTests(): Observable<test[]> {
    return  this.http.get<test[]>(`${this.baseUrl2}`);
  }

  
  deletetTest(testId: string): Observable<object> {
    return this.http.delete<object>(`${this.baseUrl2}/${testId}`);
  }

  GetTestbyId(userId: string): Observable<test> {
    return this.http.get<test>(`https://emsat-project-backend.onrender.com/api/v1/tests/${userId}`);
  }

  getQuestionsByCategory(categoryId: string): Observable<Question[]> {
    return this.http.get<Question[]>(`https://emsat-project-backend.onrender.com/api/v1/questions//cat/${categoryId}`);
  }

  getCategory(): Observable<Section[]> {

    return this.http.get<Section[]>(`https://emsat-project-backend.onrender.com/api/v1/categories`);}


    updateCat(user: Section): Observable<Section> {
      return this.http.put<Section>(`https://emsat-project-backend.onrender.com/api/v1/categories/${user._id}`, user);
    }

    addQuestionToCategory(testId: string, categoryId: string, type: string, name: string): Observable<Question> {
      const body = { type, name };
      return this.http.post<Question>(`https://emsat-project-backend.onrender.com/api/v1/tests/${testId}/categories/${categoryId}`, body);
    }

    getTestByCategoryId(categoryId: string): Observable<{ testId: string }> {
      return this.http.get<{ testId: string }>(`https://emsat-project-backend.onrender.com/api/v1/categories/test-by-category/${categoryId}`);
    }
  
    deleteQuestion(questionid: string): Observable<object> {
      return this.http.delete<object>(`https://emsat-project-backend.onrender.com/api/v1/questions/${questionid}`);
    }
  
    getQuestionsbyId(userId: string): Observable<Question> {
      return this.http.get<Question>(`https://emsat-project-backend.onrender.com/api/v1/questions/${userId}`);
    }

    updateSingleChoiceQuestion(id: string, questionData: any): Observable<any> {
      return this.http.put(`https://emsat-project-backend.onrender.com/api/v1/questions/singleChoice/${id}`, questionData);
    }
  

    updateMultipleChoiceQuestion(id: string, questionData: any): Observable<any> {
      return this.http.put(`https://emsat-project-backend.onrender.com/api/v1/questions/multipleChoice/${id}`, questionData);
    }  

    updateDragAndDropQuestion(id: string, updatedFields: Partial<Question>): Observable<any> {
      return this.http.put(`https://emsat-project-backend.onrender.com/api/v1/questions/dragAndDrop/${id}`, updatedFields);
    }  

    getCorrectAnswerChoices(questionId: string): Observable<any> {
      const url = `https://emsat-project-backend.onrender.com/api/v1/questions/correct-answer-indices/${questionId}`;
      return this.http.get<any>(url);
    }  

    getExpirationStats(): Observable<MonthPercentage[]> {
      return this.http.get<MonthPercentage[]>(`https://emsat-project-backend.onrender.com/api/v1/users/expiration-stats/`);
    }
 

    getUserRolePercentages(): Observable<any> {
      return this.http.get<any>(`https://emsat-project-backend.onrender.com/api/v1/users/user-role-percentage/`);
    }
    sendEmailWithAttachment(
      text: string,
      subject: string,
      email: string,
      file?: File  
    ): Observable<any> {
      const formData = new FormData();
      formData.append('text', text);
      formData.append('subject', subject);
      formData.append('email', email);
  
       if (file) {
        formData.append('file', file, file.name);
      }
      return this.http.post(this.apiUrl, formData);
    }

}
