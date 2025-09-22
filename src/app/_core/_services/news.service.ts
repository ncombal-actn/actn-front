import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { HttpClient } from '@angular/common/http';
import { take, map } from 'rxjs/operators';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class NewsService {

    constructor(
        private http: HttpClient,
        private storageService: StorageService
    ) { }

    getLatestNews(): Observable<Array<News>> {
      //  return this.storageService.getStoredData('news', '0', () => {
     
      
            return this.http.get(`${environment.apiUrl}/xmllecture.php`, {
                withCredentials: true
            }).pipe(
                take(1),

                map((fetchedNews) => {
                    const news = new Array<News>();
                    for (const _news of Object.values(fetchedNews)as any) {
                        const actu = new News();
                        actu.title = _news.title;
                        actu.link = _news.link;
                        actu.comments = _news.link;
                        actu.date = _news.date;
                        //const regex = /data-orig-file="([^"]+)"/;
                        actu.description = _news.image;
                        news.push(actu);
                    }
                    
                    return news;
                }),
                
            );
      //  }, false);

      
    }
}

export class News {
    title: string;
    link: string;
    comments: string;
    date: string;
    description: string;
}
